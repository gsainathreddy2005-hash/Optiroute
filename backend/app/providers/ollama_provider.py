import time
import httpx
from typing import Dict, Any
from app.providers.base_provider import BaseLLMProvider
from app.providers.mock_provider import MockLLMProvider
from app.core.config import settings

class OllamaProvider(BaseLLMProvider):
    def __init__(self):
        self.mock_fallback = MockLLMProvider()
        self.base_url = settings.OLLAMA_BASE_URL.rstrip('/')

    async def generate_response(self, prompt: str, model_name: str, **kwargs) -> Dict[str, Any]:
        start_time = time.time()
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(
                    f"{self.base_url}/api/generate",
                    json={
                        "model": model_name if model_name != "ollama-local" else "llama3:8b",
                        "prompt": prompt,
                        "stream": False
                    }
                )
                if res.status_code == 200:
                    data = res.json()
                    latency = (time.time() - start_time) * 1000
                    content = data.get("response", "")
                    eval_count = data.get("eval_count", len(content.split()) * 2)
                    prompt_eval_count = data.get("prompt_eval_count", len(prompt.split()) * 2)
                    return {
                        "response_text": content,
                        "input_tokens": prompt_eval_count,
                        "output_tokens": eval_count,
                        "latency_ms": round(latency, 2),
                        "provider": "ollama",
                        "model": model_name
                    }
        except Exception:
            pass
            
        res = await self.mock_fallback.generate_response(prompt, model_name, **kwargs)
        res["provider"] = "ollama (mock fallback)"
        return res
