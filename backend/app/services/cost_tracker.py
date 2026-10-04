from typing import Dict, Any

MODEL_PRICING = {
    # Rates per 1,000 tokens in USD
    "gpt-3.5-turbo": {"input": 0.0015, "output": 0.0020},
    "gpt-4o-mini": {"input": 0.00015, "output": 0.0006},
    "gpt-4o": {"input": 0.0050, "output": 0.0150},
    "claude-3-haiku": {"input": 0.00025, "output": 0.00125},
    "claude-3-5-sonnet": {"input": 0.0030, "output": 0.0150},
    "llama3:8b": {"input": 0.0001, "output": 0.0002},
    "mock-fast": {"input": 0.0001, "output": 0.0002},
    "mock-balanced": {"input": 0.0005, "output": 0.0010},
    "mock-advanced": {"input": 0.0050, "output": 0.0150},
}

DEFAULT_TOP_TIER_COST = {"input": 0.0050, "output": 0.0150} # gpt-4o baseline
USD_TO_INR_RATE = 83.50

class CostTrackerService:
    def calculate_cost(self, model_name: str, input_tokens: int, output_tokens: int) -> Dict[str, float]:
        rates = MODEL_PRICING.get(model_name.lower(), MODEL_PRICING.get("mock-balanced"))
        
        input_cost = (input_tokens / 1000.0) * rates["input"]
        output_cost = (output_tokens / 1000.0) * rates["output"]
        actual_cost_usd = input_cost + output_cost
        
        baseline_input_cost = (input_tokens / 1000.0) * DEFAULT_TOP_TIER_COST["input"]
        baseline_output_cost = (output_tokens / 1000.0) * DEFAULT_TOP_TIER_COST["output"]
        baseline_cost_usd = baseline_input_cost + baseline_output_cost
        
        cost_saved_usd = max(0.0, baseline_cost_usd - actual_cost_usd)

        # Calculate INR equivalent values
        actual_cost_inr = actual_cost_usd * USD_TO_INR_RATE
        cost_saved_inr = cost_saved_usd * USD_TO_INR_RATE
        
        return {
            "cost": round(actual_cost_usd, 6),
            "cost_usd": round(actual_cost_usd, 6),
            "cost_inr": round(actual_cost_inr, 4),
            "baseline_cost": round(baseline_cost_usd, 6),
            "cost_saved": round(cost_saved_usd, 6),
            "cost_saved_usd": round(cost_saved_usd, 6),
            "cost_saved_inr": round(cost_saved_inr, 4)
        }

cost_tracker_service = CostTrackerService()
