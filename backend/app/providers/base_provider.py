from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseLLMProvider(ABC):
    @abstractmethod
    async def generate_response(self, prompt: str, model_name: str, **kwargs) -> Dict[str, Any]:
        """
        Generates a response for a prompt.
        Returns dict with keys:
            - response_text: str
            - input_tokens: int
            - output_tokens: int
            - latency_ms: float
            - provider: str
            - model: str
        """
        pass
