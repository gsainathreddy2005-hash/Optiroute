import os
import joblib
import logging
from typing import Tuple, Dict, Any

logger = logging.getLogger("optiroute.ml")

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "complexity_model.pkl")

_model_cache = None

def get_model():
    global _model_cache
    if _model_cache is None:
        if os.path.exists(MODEL_PATH):
            try:
                _model_cache = joblib.load(MODEL_PATH)
            except Exception as e:
                logger.warning(f"Could not load ML model: {e}")
                _model_cache = None
    return _model_cache

def predict_complexity(prompt: str, nlp_features: Dict[str, Any]) -> Tuple[str, float]:
    """
    Predicts prompt complexity: SIMPLE, MODERATE, COMPLEX.
    Returns (complexity_label, confidence_score)
    """
    model = get_model()
    ml_label = None
    confidence = 0.85

    if model:
        try:
            probs = model.predict_proba([prompt])[0]
            classes = model.classes_
            max_idx = probs.argmax()
            ml_label = classes[max_idx]
            confidence = float(probs[max_idx])
        except Exception as e:
            logger.warning(f"Error during ML prediction: {e}")

    # Combine with NLP heuristics for enhanced accuracy
    word_cnt = nlp_features.get("word_count", 0)
    requires_reasoning = nlp_features.get("requires_reasoning", False)
    has_code = nlp_features.get("has_code_request", False)
    has_constraints = nlp_features.get("has_constraints", False)

    lower_prompt = prompt.lower()
    is_doc_or_paper = any(k in lower_prompt for k in [
        "paper", "pdf", ".pdf", "document", "research", "thesis", "whitepaper", 
        "attached file", "optiroute", "summarize", "literature"
    ])
    is_deep_reasoning = any(k in lower_prompt for k in [
        "deep reasoning", "deep research", "architect", "refactor", "derive", 
        "mathematical", "presentation", "slide"
    ])

    # Document/paper analysis and deep reasoning are inherently COMPLEX
    if is_doc_or_paper or is_deep_reasoning:
        return ("COMPLEX", max(confidence, 0.96))

    # Heuristic override rules
    if word_cnt > 150 or (requires_reasoning and (has_code or has_constraints)):
        return ("COMPLEX", max(confidence, 0.92))
    
    if word_cnt < 15 and not requires_reasoning and not has_code:
        return ("SIMPLE", max(confidence, 0.90))

    if ml_label in ["SIMPLE", "MODERATE", "COMPLEX"]:
        return (ml_label, round(confidence, 2))

    # Fallback heuristic logic if ML model is absent
    if word_cnt < 25 and not has_code:
        return ("SIMPLE", 0.88)
    elif word_cnt < 80 or has_code:
        return ("MODERATE", 0.85)
    else:
        return ("COMPLEX", 0.90)
