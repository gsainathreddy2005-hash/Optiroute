import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import engine, Base

# Ensure DB tables are created for tests
Base.metadata.create_all(bind=engine)

client = TestClient(app)

def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"

def test_prompt_process_flow():
    payload = {
        "prompt": "What is machine learning?",
        "force_no_cache": True
    }
    response = client.post("/api/v1/prompt/process", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert data["complexity"] in ["SIMPLE", "MODERATE", "COMPLEX"]
    assert "quality_score" in data
    assert data["cache_hit"] is False

def test_cache_hit_flow():
    prompt_text = "What is the capital of France?"
    
    # First request -> Cache Miss
    res1 = client.post("/api/v1/prompt/process", json={"prompt": prompt_text})
    assert res1.status_code == 200
    
    # Second request -> Cache Hit
    res2 = client.post("/api/v1/prompt/process", json={"prompt": prompt_text})
    assert res2.status_code == 200
    data2 = res2.json()
    assert data2["cache_hit"] is True
    assert data2["cost"] == 0.0

def test_routing_endpoint():
    response = client.post("/api/v1/routing/test", json={"prompt": "Write a Python function to sort a list."})
    assert response.status_code == 200
    data = response.json()
    assert "selected_model" in data
    assert "reasoning" in data

def test_feedback_endpoint():
    response = client.post("/api/v1/feedback", json={
        "request_id": "test-req-123",
        "rating": 1,
        "comment": "Great speed and low cost response!"
    })
    assert response.status_code == 200
    assert response.json()["rating"] == 1
