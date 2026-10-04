from typing import Dict, Any
from app.core.config import settings

MODEL_ROUTING_TABLE = {
    "SIMPLE": {
        "primary": "gpt-3.5-turbo",
        "fallback": "mock-fast",
        "ollama": "llama3:8b",
        "anthropic": "claude-3-haiku",
        "expected_latency": 350.0,
        "estimated_cost_per_1k": 0.0015,
        "capability": 75.0,
        "description": "Routed to Fast/Ultra-Low-Cost model suitable for basic definitions, simple factual Q&A, and short queries."
    },
    "MODERATE": {
        "primary": "gpt-4o-mini",
        "fallback": "mock-balanced",
        "ollama": "llama3:8b",
        "anthropic": "claude-3-haiku",
        "expected_latency": 600.0,
        "estimated_cost_per_1k": 0.0006,
        "capability": 88.0,
        "description": "Routed to Balanced Model optimizing quality and cost for standard summarization, code generation, and standard reasoning."
    },
    "COMPLEX": {
        "primary": "gpt-4o",
        "fallback": "mock-advanced",
        "ollama": "llama3:8b",
        "anthropic": "claude-3-5-sonnet",
        "expected_latency": 1100.0,
        "estimated_cost_per_1k": 0.0100,
        "capability": 98.0,
        "description": "Routed to High-Capability Flagship Model for multi-step reasoning, architectural design, complex code debugging, and mathematical proofs."
    }
}

class LLMRouterService:
    def route(self, complexity: str, preferred_model: str = None, strategy: str = None) -> Dict[str, Any]:
        strategy = strategy or settings.ROUTING_STRATEGY
        config = MODEL_ROUTING_TABLE.get(complexity, MODEL_ROUTING_TABLE["MODERATE"])
        
        if preferred_model:
            selected_model = preferred_model
            reason = f"User explicitly requested model '{preferred_model}'. Override applied."
        else:
            if settings.OPENAI_API_KEY:
                selected_model = config["primary"]
            elif settings.ANTHROPIC_API_KEY:
                selected_model = config["anthropic"]
            else:
                selected_model = config["fallback"]
            reason = config["description"]

        return {
            "complexity": complexity,
            "selected_model": selected_model,
            "routing_reason": reason,
            "estimated_cost": config["estimated_cost_per_1k"],
            "expected_latency_ms": config["expected_latency"],
            "capability_score": config["capability"]
        }

llm_router_service = LLMRouterService()
