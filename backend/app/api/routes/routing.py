from fastapi import APIRouter
from app.schemas.routing import RoutingTestRequest, RoutingTestResponse
from app.services.prompt_analyzer import prompt_analyzer_service
from app.services.complexity_classifier import complexity_classifier_service
from app.services.llm_router import llm_router_service

router = APIRouter()

@router.post("/routing/test", response_model=RoutingTestResponse)
async def test_routing(payload: RoutingTestRequest):
    nlp_feats = prompt_analyzer_service.analyze(payload.prompt)
    complexity, conf = complexity_classifier_service.classify(payload.prompt, nlp_feats)
    route_res = llm_router_service.route(complexity)

    return RoutingTestResponse(
        prompt=payload.prompt,
        complexity=complexity,
        confidence=conf,
        selected_model=route_res["selected_model"],
        reasoning=route_res["routing_reason"],
        estimated_cost=route_res["estimated_cost"],
        expected_latency_ms=route_res["expected_latency_ms"],
        capability_match=route_res["capability_score"]
    )

@router.get("/routing/rules")
async def get_routing_rules():
    from app.services.llm_router import MODEL_ROUTING_TABLE
    return {
        "rules": MODEL_ROUTING_TABLE,
        "strategy": "cost_optimized"
    }
