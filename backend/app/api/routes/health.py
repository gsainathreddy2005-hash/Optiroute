import os
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db
from app.core.redis import cache_manager
from app.core.config import settings

router = APIRouter()

@router.get("/health")
async def health_check(db: Session = Depends(get_db)):
    db_status = "healthy"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    redis_stats = await cache_manager.get_stats()
    ml_model_status = "loaded" if os.path.exists(settings.MODEL_PATH) else "fallback_mode"

    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": db_status,
        "cache": redis_stats,
        "ml_classifier": ml_model_status,
        "openai_key_configured": bool(settings.OPENAI_API_KEY),
        "anthropic_key_configured": bool(settings.ANTHROPIC_API_KEY)
    }
