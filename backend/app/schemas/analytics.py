from pydantic import BaseModel
from typing import List, Dict, Any

class OverviewStats(BaseModel):
    total_requests: int
    total_cost: float
    cost_saved: float
    cache_hit_rate: float
    avg_latency_ms: float
    avg_quality_score: float

class CostChartPoint(BaseModel):
    date: str
    actual_cost: float
    saved_cost: float

class UsageDistribution(BaseModel):
    name: str
    value: int
    percentage: float

class AnalyticsOverviewResponse(BaseModel):
    overview: OverviewStats
    cost_timeline: List[CostChartPoint]
    model_usage: List[UsageDistribution]
    complexity_breakdown: List[UsageDistribution]
    cache_efficiency: Dict[str, Any]
