import time
from typing import Dict, Any
from app.providers.base_provider import BaseLLMProvider
from app.providers.mock_provider import MockLLMProvider
from app.core.config import settings

class AnthropicProvider(BaseLLMProvider):
    def __init__(self):
        self.mock_fallback = MockLLMProvider()
        self.client = None
        if settings.ANTHROPIC_API_KEY:
            try:
                from anthropic import AsyncAnthropic
                self.client = AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
            except Exception:
                self.client = None

    async def generate_response(self, prompt: str, model_name: str, **kwargs) -> Dict[str, Any]:
        if not self.client:
            res = await self.mock_fallback.generate_response(prompt, model_name, **kwargs)
            res["provider"] = "anthropic (mock fallback)"
            return res

        start_time = time.time()
        try:
            response = await self.client.messages.create(
                model=model_name if "claude" in model_name else "claude-3-haiku-20240307",
                max_tokens=kwargs.get("max_tokens", 1000),
                messages=[{"role": "user", "content": prompt}]
            )
            latency = (time.time() - start_time) * 1000
            content = response.content[0].text if response.content else ""
            return {
                "response_text": content,
                "input_tokens": response.usage.input_tokens,
                "output_tokens": response.usage.output_tokens,
                "latency_ms": round(latency, 2),
                "provider": "anthropic",
                "model": model_name
            }
        except Exception as e:
            res = await self.mock_fallback.generate_response(prompt, model_name, **kwargs)
            res["provider"] = f"anthropic (fallback: {str(e)[:30]})"
            return res
