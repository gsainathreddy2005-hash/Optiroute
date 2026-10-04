from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.cache_service import cache_service
from app.models.cache_entry import CacheEntry

router = APIRouter()

@router.get("/cache/stats")
async def get_cache_stats():
    return await cache_service.get_stats()

@router.get("/cache")
async def get_cache_entries(db: Session = Depends(get_db)):
    entries = db.query(CacheEntry).order_by(CacheEntry.last_accessed_at.desc()).limit(100).all()
    return entries

@router.delete("/cache/clear")
async def clear_cache(db: Session = Depends(get_db)):
    await cache_service.clear_cache()
    db.query(CacheEntry).delete()
    db.commit()
    return {"status": "success", "message": "Cache memory cleared successfully."}

@router.delete("/cache/{key}")
async def delete_cache_entry(key: str, db: Session = Depends(get_db)):
    await cache_service.cache_manager.delete(key)
    db.query(CacheEntry).filter(CacheEntry.cache_key == key).delete()
    db.commit()
    return {"status": "success", "message": f"Cache key '{key}' evicted."}
