from pydantic import BaseModel
from typing import List

class SubscriptionPlan(BaseModel):
    id: str # free, pro, enterprise
    name: str
    price_usd: float
    price_inr: float
    billing_period: str # "month"
    features: List[str]
    request_limit: str
    max_escalations: int
    is_popular: bool = False

class UpgradePlanRequest(BaseModel):
    plan_tier: str # free, pro, enterprise
