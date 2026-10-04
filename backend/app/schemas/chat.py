from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ChatSessionCreate(BaseModel):
    title: Optional[str] = "New Conversation"

class ChatMessageResponse(BaseModel):
    id: int
    session_id: str
    role: str
    content: str
    model: Optional[str] = None
    complexity: Optional[str] = None
    cost_usd: Optional[float] = 0.0
    cost_inr: Optional[float] = 0.0
    quality_score: Optional[float] = None
    cache_hit: Optional[bool] = False
    latency_ms: Optional[float] = 0.0
    created_at: datetime

    class Config:
        from_attributes = True

class ChatSessionResponse(BaseModel):
    id: int
    session_id: str
    title: str
    created_at: datetime
    updated_at: datetime
    messages: Optional[List[ChatMessageResponse]] = []

    class Config:
        from_attributes = True
