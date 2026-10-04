from typing import Dict, Any
from app.providers.openai_provider import OpenAIProvider
from app.providers.anthropic_provider import AnthropicProvider
from app.providers.ollama_provider import OllamaProvider
from app.providers.mock_provider import MockLLMProvider

class LLMExecutionService:
    def __init__(self):
        self.openai_provider = OpenAIProvider()
        self.anthropic_provider = AnthropicProvider()
        self.ollama_provider = OllamaProvider()
        self.mock_provider = MockLLMProvider()

    async def generate(self, prompt: str, model_name: str, **kwargs) -> Dict[str, Any]:
        lower_model = model_name.lower()
        if "gpt" in lower_model:
            return await self.openai_provider.generate_response(prompt, model_name, **kwargs)
        elif "claude" in lower_model:
            return await self.anthropic_provider.generate_response(prompt, model_name, **kwargs)
        elif "llama" in lower_model or "ollama" in lower_model:
            return await self.ollama_provider.generate_response(prompt, model_name, **kwargs)
        else:
            return await self.mock_provider.generate_response(prompt, model_name, **kwargs)

llm_execution_service = LLMExecutionService()
