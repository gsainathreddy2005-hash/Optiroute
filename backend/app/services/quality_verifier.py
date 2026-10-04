import re
from typing import Dict, Any

class QualityVerifierService:
    def verify(self, prompt: str, response_text: str, nlp_features: Dict[str, Any], quality_threshold: float = 75.0) -> Dict[str, Any]:
        score = 85.0 # Base default score
        reasons = []

        resp_len = len(response_text.strip())
        word_count = len(response_text.split())

        # Check 1: Minimum length check
        if resp_len < 30:
            score -= 30.0
            reasons.append("Response length is extremely short.")
        elif word_count > 15:
            score += 5.0
            reasons.append("Response length meets sufficiency standard.")

        # Check 2: Code request satisfaction check
        if nlp_features.get("has_code_request", False):
            if "```" in response_text or "def " in response_text or "function" in response_text or "class " in response_text:
                score += 10.0
                reasons.append("Code block request properly formatted and present.")
            else:
                score -= 25.0
                reasons.append("Prompt requested code, but output lacks code block syntax.")

        # Check 3: Formatting & constraints check
        if nlp_features.get("has_constraints", False):
            if any(char in response_text for char in ["- ", "1. ", "\n*", "{"]):
                score += 5.0
                reasons.append("Constraint formatting rules satisfied.")
            else:
                score -= 10.0
                reasons.append("Prompt specified structural constraints, but response lacks bulleted or structured formatting.")

        # Check 4: Refusal or error token check
        refusal_triggers = ["i cannot fulfill", "as an ai model, i cannot", "sorry, but i can't"]
        if any(trig in response_text.lower() for trig in refusal_triggers):
            score -= 40.0
            reasons.append("Response contains model refusal trigger.")

        final_score = max(0.0, min(100.0, round(score, 1)))
        status = "PASS" if final_score >= quality_threshold else "FAIL"
        reason_summary = " | ".join(reasons) if reasons else "Response verified and passed quality checks."

        return {
            "quality_score": final_score,
            "quality_status": status,
            "quality_reason": reason_summary,
            "passed": status == "PASS"
        }

quality_verifier_service = QualityVerifierService()
