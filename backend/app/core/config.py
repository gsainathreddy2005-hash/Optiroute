import os
from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "OptiRoute AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./optiroute.db")

    # Redis Cache
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    CACHE_ENABLED: bool = True
    DEFAULT_CACHE_TTL: int = 3600  # seconds

    # Provider API Keys
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY", None)
    ANTHROPIC_API_KEY: Optional[str] = os.getenv("ANTHROPIC_API_KEY", None)
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

    # Routing & Escalation Controls
    QUALITY_THRESHOLD: float = 75.0  # Out of 100
    MAX_ESCALATIONS: int = 1
    ROUTING_STRATEGY: str = "cost_optimized"  # cost_optimized, performance_first, balanced

    # ML Classifier Model Path
    MODEL_PATH: str = os.getenv("MODEL_PATH", "app/ml/model/complexity_model.pkl")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
