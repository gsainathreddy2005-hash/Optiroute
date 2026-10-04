import json
import logging
from typing import Optional, Any
from app.core.config import settings

logger = logging.getLogger("optiroute.redis")

class InMemoryCache:
    """Fallback in-memory cache when Redis server is unreachable."""
    def __init__(self):
        self._store = {}
        self.hits = 0
        self.misses = 0

    async def get(self, key: str) -> Optional[str]:
        val = self._store.get(key)
        if val is not None:
            self.hits += 1
            return val
        self.misses += 1
        return None

    async def set(self, key: str, value: str, ex: Optional[int] = None) -> bool:
        self._store[key] = value
        return True

    async def delete(self, key: str) -> bool:
        if key in self._store:
            del self._store[key]
            return True
        return False

    async def clear(self) -> bool:
        self._store.clear()
        return True

    async def get_keys(self, pattern: str = "*") -> list[str]:
        return list(self._store.keys())

    async def get_stats(self) -> dict:
        total = self.hits + self.misses
        hit_rate = round((self.hits / total * 100), 2) if total > 0 else 0.0
        return {
            "type": "in_memory_fallback",
            "connected": True,
            "total_keys": len(self._store),
            "hits": self.hits,
            "misses": self.misses,
            "hit_rate": hit_rate
        }

class RedisCacheManager:
    def __init__(self):
        self.redis_client = None
        self.in_memory = InMemoryCache()
        self.use_redis = False

    async def init(self):
        try:
            import redis.asyncio as aioredis
            client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
            await client.ping()
            self.redis_client = client
            self.use_redis = True
            logger.info("Connected to Redis successfully.")
        except Exception as e:
            logger.warning(f"Redis connection unavailable ({e}). Falling back to in-memory cache manager.")
            self.use_redis = False

    async def get(self, key: str) -> Optional[str]:
        if self.use_redis and self.redis_client:
            try:
                val = await self.redis_client.get(key)
                if val is not None:
                    await self.redis_client.incr("stats:hits")
                    return val
                await self.redis_client.incr("stats:misses")
                return None
            except Exception:
                pass
        return await self.in_memory.get(key)

    async def set(self, key: str, value: str, ttl: Optional[int] = None) -> bool:
        ttl = ttl or settings.DEFAULT_CACHE_TTL
        if self.use_redis and self.redis_client:
            try:
                await self.redis_client.set(key, value, ex=ttl)
                return True
            except Exception:
                pass
        return await self.in_memory.set(key, value, ex=ttl)

    async def delete(self, key: str) -> bool:
        if self.use_redis and self.redis_client:
            try:
                await self.redis_client.delete(key)
                return True
            except Exception:
                pass
        return await self.in_memory.delete(key)

    async def clear(self) -> bool:
        if self.use_redis and self.redis_client:
            try:
                await self.redis_client.flushdb()
                return True
            except Exception:
                pass
        return await self.in_memory.clear()

    async def get_stats(self) -> dict:
        if self.use_redis and self.redis_client:
            try:
                info = await self.redis_client.info()
                hits = int(await self.redis_client.get("stats:hits") or 0)
                misses = int(await self.redis_client.get("stats:misses") or 0)
                total = hits + misses
                hit_rate = round((hits / total * 100), 2) if total > 0 else 0.0
                keys_count = await self.redis_client.dbsize()
                return {
                    "type": "redis",
                    "connected": True,
                    "total_keys": keys_count,
                    "hits": hits,
                    "misses": misses,
                    "hit_rate": hit_rate,
                    "used_memory_human": info.get("used_memory_human", "N/A")
                }
            except Exception:
                pass
        return await self.in_memory.get_stats()

cache_manager = RedisCacheManager()
