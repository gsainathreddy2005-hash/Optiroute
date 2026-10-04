from typing import Dict, Any, Tuple
from app.ml.predict import predict_complexity

class ComplexityClassifierService:
    def classify(self, prompt: str, nlp_features: Dict[str, Any]) -> Tuple[str, float]:
        """
        Calls ML prediction engine to return (complexity_tier, confidence)
        """
        return predict_complexity(prompt, nlp_features)

complexity_classifier_service = ComplexityClassifierService()
