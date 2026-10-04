from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import Optional, List
from app.core.database import get_db
from app.schemas.subscription import SubscriptionPlan, UpgradePlanRequest
from app.models.user import User

router = APIRouter()

PLANS = [
    SubscriptionPlan(
        id="free",
        name="Developer Free Tier",
        price_usd=0.00,
        price_inr=0.00,
        billing_period="month",
        features=[
            "Up to 1,000 requests / month",
            "Basic complexity classification",
            "Mock & Low-cost model access",
            "Standard Redis caching",
            "Community Support"
        ],
        request_limit="1,000 requests/mo",
        max_escalations=1,
        is_popular=False
    ),
    SubscriptionPlan(
        id="pro",
        name="Pro Router Plan",
        price_usd=29.00,
        price_inr=2420.00,
        billing_period="month",
        features=[
            "Up to 50,000 requests / month",
            "Advanced NLP feature analysis",
            "Full Multi-LLM provider access (GPT-4o, Claude 3.5 Sonnet)",
            "Automated post-generation quality verification",
            "Auto-escalation failsafe triggers",
            "Dual currency telemetry analytics ($ & ₹)",
            "Priority Email Support"
        ],
        request_limit="50,000 requests/mo",
        max_escalations=2,
        is_popular=True
    ),
    SubscriptionPlan(
        id="enterprise",
        name="Enterprise SaaS Plan",
        price_usd=199.00,
        price_inr=16600.00,
        billing_period="month",
        features=[
            "Unlimited monthly requests",
            "Custom fine-tuned complexity classifiers",
            "Dedicated Redis cache cluster integration",
            "Custom routing rules & SLA latency targets",
            "Custom API Key configuration",
            "24/7 Dedicated Support & SLA guarantee"
        ],
        request_limit="Unlimited",
        max_escalations=3,
        is_popular=False
    )
]

@router.get("/subscription/plans", response_model=List[SubscriptionPlan])
async def get_plans():
    return PLANS

@router.post("/subscription/upgrade")
async def upgrade_subscription(payload: UpgradePlanRequest, db: Session = Depends(get_db)):
    if payload.plan_tier not in ["free", "pro", "enterprise"]:
        raise HTTPException(status_code=400, detail="Invalid plan tier specified.")
    
    # Update first user or demo user
    user = db.query(User).first()
    if user:
        user.plan_tier = payload.plan_tier
        db.commit()
    
    return {
        "status": "success",
        "message": f"Successfully upgraded subscription to '{payload.plan_tier.upper()}' plan!",
        "plan_tier": payload.plan_tier
    }
