import re
import json
import hashlib
from typing import Optional, Dict, Any
from app.core.redis import cache_manager
from app.core.database import SessionLocal
from app.models.cache_entry import CacheEntry

class CacheService:
    def normalize_prompt(self, prompt: str) -> str:
        clean = prompt.lower().strip()
        clean = re.sub(r'\s+', ' ', clean)
        clean = re.sub(r'[^\w\s]', '', clean)
        return clean

    def generate_cache_key(self, prompt: str) -> str:
        normalized = self.normalize_prompt(prompt)
        digest = hashlib.sha256(normalized.encode('utf-8')).hexdigest()
        return f"optiroute:cache:{digest}"

    async def get_cached_response(self, prompt: str) -> Optional[Dict[str, Any]]:
        key = self.generate_cache_key(prompt)
        val = await cache_manager.get(key)
        if val:
            try:
                return json.loads(val)
            except Exception:
                pass

        # Fallback to persistent SQLite CacheEntry table
        try:
            with SessionLocal() as db:
                entry = db.query(CacheEntry).filter(CacheEntry.cache_key == key).first()
                if entry:
                    # Parse stored payload or reconstruct response
                    response_payload = {
                        "response": entry.response_snippet,
                        "complexity": "SIMPLE",
                        "complexity_confidence": 0.95,
                        "selected_model": entry.model_used,
                        "final_model": entry.model_used,
                        "quality_score": 92.0,
                        "cost_saved": entry.estimated_cost_saved or 0.005
                    }
                    # Populate back into active cache memory
                    await cache_manager.set(key, json.dumps(response_payload))
                    return response_payload
        except Exception:
            pass

        return None

    async def cache_response(self, prompt: str, response_payload: Dict[str, Any], ttl: int = 3600) -> bool:
        key = self.generate_cache_key(prompt)
        serialized = json.dumps(response_payload)
        success = await cache_manager.set(key, serialized, ttl=ttl)

        # Persist into DB CacheEntry
        try:
            with SessionLocal() as db:
                entry = db.query(CacheEntry).filter(CacheEntry.cache_key == key).first()
                if not entry:
                    entry = CacheEntry(
                        cache_key=key,
                        prompt_snippet=prompt[:250],
                        response_snippet=response_payload.get("response", "")[:1000],
                        model_used=response_payload.get("final_model", response_payload.get("selected_model", "gpt-3.5-turbo")),
                        hit_count=1,
                        estimated_cost_saved=response_payload.get("cost_saved", 0.005)
                    )
                    db.add(entry)
                else:
                    entry.response_snippet = response_payload.get("response", "")[:1000]
                    entry.model_used = response_payload.get("final_model", response_payload.get("selected_model", "gpt-3.5-turbo"))
                db.commit()
        except Exception:
            pass

        return success

    async def clear_cache(self) -> bool:
        res = await cache_manager.clear()
        try:
            with SessionLocal() as db:
                db.query(CacheEntry).delete()
                db.commit()
        except Exception:
            pass
        return res

    async def get_stats(self) -> Dict[str, Any]:
        stats = await cache_manager.get_stats()
        try:
            with SessionLocal() as db:
                db_count = db.query(CacheEntry).count()
                if db_count > stats.get("total_keys", 0):
                    stats["total_keys"] = db_count
        except Exception:
            pass
        return stats

cache_service = CacheService()
