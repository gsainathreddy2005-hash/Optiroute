from fastapi import APIRouter
from app.schemas.settings import SystemSettingsSchema, SystemSettingsUpdate
from app.core.config import settings

router = APIRouter()

@router.get("/settings", response_model=SystemSettingsSchema)
async def get_settings():
    return SystemSettingsSchema(
        quality_threshold=settings.QUALITY_THRESHOLD,
        cache_enabled=settings.CACHE_ENABLED,
        cache_ttl_seconds=settings.DEFAULT_CACHE_TTL,
        max_escalations=settings.MAX_ESCALATIONS,
        routing_strategy=settings.ROUTING_STRATEGY,
        openai_key_configured=bool(settings.OPENAI_API_KEY),
        anthropic_key_configured=bool(settings.ANTHROPIC_API_KEY),
        ollama_available=True
    )

@router.put("/settings", response_model=SystemSettingsSchema)
async def update_settings(payload: SystemSettingsUpdate):
    if payload.quality_threshold is not None:
        settings.QUALITY_THRESHOLD = payload.quality_threshold
    if payload.cache_enabled is not None:
        settings.CACHE_ENABLED = payload.cache_enabled
    if payload.cache_ttl_seconds is not None:
        settings.DEFAULT_CACHE_TTL = payload.cache_ttl_seconds
    if payload.max_escalations is not None:
        settings.MAX_ESCALATIONS = payload.max_escalations
    if payload.routing_strategy is not None:
        settings.ROUTING_STRATEGY = payload.routing_strategy

    return await get_settings()
