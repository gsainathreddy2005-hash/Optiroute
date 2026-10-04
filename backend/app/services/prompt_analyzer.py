import re
from typing import Dict, Any, List

class PromptAnalyzerService:
    REASONING_KEYWORDS = [
        "why", "explain", "reason", "derive", "architect", "design", "proof", 
        "compare", "contrast", "analyze", "evaluate", "optimize", "tradeoff"
    ]
    CODE_KEYWORDS = [
        "code", "python", "javascript", "react", "sql", "function", "class", 
        "script", "bug", "error", "exception", "c++", "rust", "html", "css"
    ]
    CONSTRAINT_KEYWORDS = [
        "must", "should not", "limit to", "maximum", "minimum", "in JSON", 
        "formatted as", "bullet points", "strictly", "no more than"
    ]

    def analyze(self, prompt: str) -> Dict[str, Any]:
        prompt_clean = prompt.strip()
        words = re.findall(r'\w+', prompt_clean)
        word_count = len(words)
        char_length = len(prompt_clean)
        
        # Simple heuristic token estimation (approx 1 token = 0.75 words or ~4 chars)
        estimated_tokens = max(1, int(char_length / 4))
        
        lower_prompt = prompt_clean.lower()
        
        has_question = "?" in prompt_clean or any(w in lower_prompt for w in ["what", "who", "where", "when", "how", "why"])
        has_code_request = any(k in lower_prompt for k in self.CODE_KEYWORDS) or "```" in prompt_clean
        requires_reasoning = any(k in lower_prompt for k in self.REASONING_KEYWORDS)
        has_constraints = any(k in lower_prompt for k in self.CONSTRAINT_KEYWORDS)
        
        sentence_count = len(re.split(r'[.!?]+', prompt_clean))
        sentence_count = max(1, sentence_count if prompt_clean[-1] not in ".!?" else sentence_count - 1)
        
        # Extract prominent keywords
        keywords = list(set([w.lower() for w in words if len(w) > 4 and w.lower() not in ["there", "where", "about", "would", "could", "should"]]))[:6]

        return {
            "length": char_length,
            "word_count": word_count,
            "estimated_tokens": estimated_tokens,
            "has_question": has_question,
            "has_code_request": has_code_request,
            "requires_reasoning": requires_reasoning,
            "has_constraints": has_constraints,
            "sentence_count": sentence_count,
            "keywords": keywords
        }

prompt_analyzer_service = PromptAnalyzerService()
