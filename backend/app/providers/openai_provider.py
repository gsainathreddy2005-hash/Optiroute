import time
from typing import Dict, Any
from app.providers.base_provider import BaseLLMProvider
from app.providers.mock_provider import MockLLMProvider
from app.core.config import settings

class OpenAIProvider(BaseLLMProvider):
    def __init__(self):
        self.mock_fallback = MockLLMProvider()
        self.client = None
        if settings.OPENAI_API_KEY:
            try:
                from openai import AsyncOpenAI
                self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
            except Exception:
                self.client = None

    async def generate_response(self, prompt: str, model_name: str, **kwargs) -> Dict[str, Any]:
        if not self.client:
            # Fallback to mock provider if API key is not set
            res = await self.mock_fallback.generate_response(prompt, model_name, **kwargs)
            res["provider"] = "openai (mock fallback)"
            return res

        start_time = time.time()
        try:
            response = await self.client.chat.completions.create(
                model=model_name if model_name.startswith("gpt") else "gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=kwargs.get("max_tokens", 1000)
            )
            latency = (time.time() - start_time) * 1000
            content = response.choices[0].message.content or ""
            usage = response.usage
            return {
                "response_text": content,
                "input_tokens": usage.prompt_tokens if usage else len(prompt.split()) * 2,
                "output_tokens": usage.completion_tokens if usage else len(content.split()) * 2,
                "latency_ms": round(latency, 2),
                "provider": "openai",
                "model": model_name
            }
        except Exception as e:
            # On API error, gracefully fall back to mock provider
            res = await self.mock_fallback.generate_response(prompt, model_name, **kwargs)
            res["provider"] = f"openai (fallback: {str(e)[:30]})"
            return res
