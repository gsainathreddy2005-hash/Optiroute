from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class PromptProcessRequest(BaseModel):
    prompt: str = Field(..., min_length=1, description="The user prompt to analyze and process")
    session_id: Optional[str] = None
    force_no_cache: Optional[bool] = False
    preferred_model: Optional[str] = None
    override_quality_threshold: Optional[float] = None

class NLPFeatures(BaseModel):
    length: int
    word_count: int
    estimated_tokens: int
    has_question: bool
    has_code_request: bool
    requires_reasoning: bool
    has_constraints: bool
    sentence_count: int
    keywords: List[str]

class ProcessStepDetail(BaseModel):
    step: str
    status: str # SUCCESS, PENDING, SKIPPED, ESCALATED
    latency_ms: float
    detail: Dict[str, Any]

class PromptProcessResponse(BaseModel):
    request_id: str
    session_id: Optional[str] = None
    prompt: str
    response: str
    cache_hit: bool
    complexity: str # SIMPLE, MODERATE, COMPLEX
    complexity_confidence: float
    nlp_features: NLPFeatures
    initial_model: str
    selected_model: str
    final_model: str
    routing_reason: str
    quality_score: float
    quality_status: str
    quality_reason: str
    is_escalated: bool
    escalation_count: int
    input_tokens: int
    output_tokens: int
    total_tokens: int
    cost: float
    cost_usd: float
    cost_inr: float
    cost_saved: float
    cost_saved_usd: float
    cost_saved_inr: float
    latency_ms: float
    pipeline_steps: List[ProcessStepDetail]
