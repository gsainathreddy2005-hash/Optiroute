from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, JSON
from sqlalchemy.sql import func
from app.core.database import Base

class RequestLog(Base):
    __tablename__ = "request_logs"

    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(String(100), unique=True, nullable=False, index=True)
    prompt = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    
    # NLP & Complexity Analysis
    prompt_length = Column(Integer, default=0)
    word_count = Column(Integer, default=0)
    estimated_tokens = Column(Integer, default=0)
    complexity = Column(String(50), nullable=False) # SIMPLE, MODERATE, COMPLEX
    complexity_confidence = Column(Float, default=0.95)
    nlp_features = Column(JSON, nullable=True)

    # Routing
    initial_model = Column(String(100), nullable=False)
    selected_model = Column(String(100), nullable=False)
    routing_reason = Column(Text, nullable=True)

    # Metrics
    cache_hit = Column(Boolean, default=False)
    input_tokens = Column(Integer, default=0)
    output_tokens = Column(Integer, default=0)
    total_tokens = Column(Integer, default=0)
    cost = Column(Float, default=0.0)
    cost_saved = Column(Float, default=0.0)
    latency_ms = Column(Float, default=0.0)

    # Quality & Escalation
    quality_score = Column(Float, default=85.0)
    quality_status = Column(String(20), default="PASS") # PASS, FAIL
    quality_reason = Column(Text, nullable=True)
    is_escalated = Column(Boolean, default=False)
    escalation_count = Column(Integer, default=0)
    escalated_from_model = Column(String(100), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
