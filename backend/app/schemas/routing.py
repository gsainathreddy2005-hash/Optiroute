from pydantic import BaseModel
from typing import Optional, List

class RoutingTestRequest(BaseModel):
    prompt: str

class RoutingTestResponse(BaseModel):
    prompt: str
    complexity: str
    confidence: float
    selected_model: str
    reasoning: str
    estimated_cost: float
    expected_latency_ms: float
    capability_match: float
