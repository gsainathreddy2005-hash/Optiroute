from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.llm_model import LLMModel

router = APIRouter()

DEFAULT_MODELS = [
    {
        "name": "gpt-3.5-turbo",
        "display_name": "OpenAI GPT-3.5 Turbo",
        "provider": "openai",
        "tier": "SIMPLE",
        "cost_per_1k_input": 0.0015,
        "cost_per_1k_output": 0.0020,
        "avg_latency_ms": 350.0,
        "capability_score": 75.0,
        "is_active": True
    },
    {
        "name": "gpt-4o-mini",
        "display_name": "OpenAI GPT-4o Mini",
        "provider": "openai",
        "tier": "MODERATE",
        "cost_per_1k_input": 0.00015,
        "cost_per_1k_output": 0.0006,
        "avg_latency_ms": 450.0,
        "capability_score": 88.0,
        "is_active": True
    },
    {
        "name": "gpt-4o",
        "display_name": "OpenAI GPT-4o Flagship",
        "provider": "openai",
        "tier": "COMPLEX",
        "cost_per_1k_input": 0.0050,
        "cost_per_1k_output": 0.0150,
        "avg_latency_ms": 950.0,
        "capability_score": 98.0,
        "is_active": True
    },
    {
        "name": "claude-3-haiku",
        "display_name": "Anthropic Claude 3 Haiku",
        "provider": "anthropic",
        "tier": "SIMPLE",
        "cost_per_1k_input": 0.00025,
        "cost_per_1k_output": 0.00125,
        "avg_latency_ms": 380.0,
        "capability_score": 82.0,
        "is_active": True
    },
    {
        "name": "claude-3-5-sonnet",
        "display_name": "Anthropic Claude 3.5 Sonnet",
        "provider": "anthropic",
        "tier": "COMPLEX",
        "cost_per_1k_input": 0.0030,
        "cost_per_1k_output": 0.0150,
        "avg_latency_ms": 900.0,
        "capability_score": 99.0,
        "is_active": True
    },
    {
        "name": "llama3:8b",
        "display_name": "Ollama Llama 3 8B (Local)",
        "provider": "ollama",
        "tier": "MODERATE",
        "cost_per_1k_input": 0.0000,
        "cost_per_1k_output": 0.0000,
        "avg_latency_ms": 650.0,
        "capability_score": 85.0,
        "is_active": True
    },
    {
        "name": "mock-fast",
        "display_name": "Mock Fast Engine",
        "provider": "mock",
        "tier": "SIMPLE",
        "cost_per_1k_input": 0.0001,
        "cost_per_1k_output": 0.0002,
        "avg_latency_ms": 200.0,
        "capability_score": 70.0,
        "is_active": True
    }
]

@router.get("/models")
async def get_models(db: Session = Depends(get_db)):
    models = db.query(LLMModel).all()
    if not models:
        # Seed default model registry if empty
        for item in DEFAULT_MODELS:
            m = LLMModel(**item)
            db.add(m)
        db.commit()
        models = db.query(LLMModel).all()
    return models

@router.get("/models/{model_id}")
async def get_model(model_id: int, db: Session = Depends(get_db)):
    model = db.query(LLMModel).filter(LLMModel.id == model_id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found.")
    return model

@router.patch("/models/{model_id}")
async def toggle_model_active(model_id: int, is_active: bool, db: Session = Depends(get_db)):
    model = db.query(LLMModel).filter(LLMModel.id == model_id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found.")
    model.is_active = is_active
    db.commit()
    return model
