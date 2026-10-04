from typing import Dict, Any, Tuple
from app.core.config import settings

ESCALATION_TARGETS = {
    "gpt-3.5-turbo": "gpt-4o-mini",
    "gpt-4o-mini": "gpt-4o",
    "claude-3-haiku": "claude-3-5-sonnet",
    "mock-fast": "mock-balanced",
    "mock-balanced": "mock-advanced",
    "llama3:8b": "gpt-4o"
}

class EscalationService:
    def determine_escalation(
        self, 
        current_model: str, 
        current_escalation_count: int, 
        max_escalations: int = None
    ) -> Tuple[bool, str, str]:
        max_esc = max_escalations if max_escalations is not None else settings.MAX_ESCALATIONS

        if current_escalation_count >= max_esc:
            return (False, current_model, f"Maximum allowed escalations ({max_esc}) reached.")

        next_model = ESCALATION_TARGETS.get(current_model, "gpt-4o")
        if next_model == current_model:
            next_model = "mock-advanced" if "mock" in current_model else "gpt-4o"

        reason = f"Quality score fell below threshold. Auto-escalating from '{current_model}' to stronger model '{next_model}'."
        return (True, next_model, reason)

escalation_service = EscalationService()
