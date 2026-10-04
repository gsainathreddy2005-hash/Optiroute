from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(String(100), nullable=False, index=True)
    rating = Column(Integer, nullable=False) # +1 for good, -1 for bad
    comment = Column(Text, nullable=True)
    model = Column(String(100), nullable=True)
    complexity = Column(String(50), nullable=True)
    quality_score = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
