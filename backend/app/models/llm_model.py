from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class LLMModel(Base):
    __tablename__ = "llm_models"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True) # e.g. gpt-3.5-turbo, gpt-4o, claude-3-haiku, llama3:8b, mock-fast
    display_name = Column(String(100), nullable=False)
    provider = Column(String(50), nullable=False) # openai, anthropic, ollama, mock
    tier = Column(String(50), nullable=False) # simple, moderate, complex
    cost_per_1k_input = Column(Float, nullable=False, default=0.0015)
    cost_per_1k_output = Column(Float, nullable=False, default=0.002)
    avg_latency_ms = Column(Float, nullable=False, default=450.0)
    capability_score = Column(Float, nullable=False, default=80.0) # 0 to 100
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
