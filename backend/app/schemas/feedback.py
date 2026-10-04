from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class FeedbackCreate(BaseModel):
    request_id: str
    rating: int # +1 or -1
    comment: Optional[str] = None

class FeedbackResponse(BaseModel):
    id: int
    request_id: str
    rating: int
    comment: Optional[str]
    model: Optional[str]
    complexity: Optional[str]
    quality_score: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True
