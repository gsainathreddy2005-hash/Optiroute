from pydantic import BaseModel
from typing import Optional

class SystemSettingsSchema(BaseModel):
    quality_threshold: float
    cache_enabled: bool
    cache_ttl_seconds: int
    max_escalations: int
    routing_strategy: str # cost_optimized, performance_first, balanced
    openai_key_configured: bool
    anthropic_key_configured: bool
    ollama_available: bool

class SystemSettingsUpdate(BaseModel):
    quality_threshold: Optional[float] = None
    cache_enabled: Optional[bool] = None
    cache_ttl_seconds: Optional[int] = None
    max_escalations: Optional[int] = None
    routing_strategy: Optional[str] = None
