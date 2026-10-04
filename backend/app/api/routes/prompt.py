import time
import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.prompt import PromptProcessRequest, PromptProcessResponse, ProcessStepDetail
from app.services.prompt_analyzer import prompt_analyzer_service
from app.services.complexity_classifier import complexity_classifier_service
from app.services.llm_router import llm_router_service
from app.services.llm_service import llm_execution_service
from app.services.quality_verifier import quality_verifier_service
from app.services.escalation_service import escalation_service
from app.services.cache_service import cache_service
from app.services.cost_tracker import cost_tracker_service
from app.services.chat_service import chat_service
from app.models.request_log import RequestLog
from app.models.cache_entry import CacheEntry
from app.core.config import settings

router = APIRouter()

@router.post("/prompt/process", response_model=PromptProcessResponse)
async def process_prompt(payload: PromptProcessRequest, db: Session = Depends(get_db)):
    start_total_time = time.time()
    req_id = f"req-{uuid.uuid4().hex[:10]}"
    pipeline_steps = []

    # Ensure session_id exists for ChatGPT-style history persistence
    current_session_id = payload.session_id
    if not current_session_id:
        new_sess = chat_service.create_session(db, title=payload.prompt[:35] + ("..." if len(payload.prompt) > 35 else ""))
        current_session_id = new_sess.session_id

    # Record User Message in Chat History
    chat_service.add_message(
        db,
        session_id=current_session_id,
        role="user",
        content=payload.prompt
    )

    # Step 1: Input Validation
    step_start = time.time()
    if not payload.prompt or len(payload.prompt.strip()) == 0:
        raise HTTPException(status_code=400, detail="Prompt text cannot be empty.")
    
    pipeline_steps.append(ProcessStepDetail(
        step="1. INPUT VALIDATION",
        status="SUCCESS",
        latency_ms=round((time.time() - step_start) * 1000, 2),
        detail={"prompt_length": len(payload.prompt)}
    ))

    # Step 2: Cache Memory Check
    step_start = time.time()
    cached_payload = None
    if settings.CACHE_ENABLED and not payload.force_no_cache:
        cached_payload = await cache_service.get_cached_response(payload.prompt)

    if cached_payload:
        pipeline_steps.append(ProcessStepDetail(
            step="2. CACHE CHECK",
            status="CACHE HIT",
            latency_ms=round((time.time() - step_start) * 1000, 2),
            detail={"cache_status": "HIT", "saved_cost": cached_payload.get("cost_saved", 0.005)}
        ))
        
        # Update CacheEntry in DB
        try:
            cache_key = cache_service.generate_cache_key(payload.prompt)
            db_entry = db.query(CacheEntry).filter(CacheEntry.cache_key == cache_key).first()
            if db_entry:
                db_entry.hit_count = (db_entry.hit_count or 1) + 1
                db_entry.estimated_cost_saved = (db_entry.estimated_cost_saved or 0.0) + cached_payload.get("cost_saved", 0.005)
                db.commit()
        except Exception:
            db.rollback()

        # Save RequestLog for Cache Hit
        try:
            log_record = RequestLog(
                request_id=req_id,
                prompt=payload.prompt,
                response=cached_payload.get("response", ""),
                prompt_length=len(payload.prompt),
                word_count=len(payload.prompt.split()),
                estimated_tokens=int(len(payload.prompt)/4),
                complexity=cached_payload.get("complexity", "SIMPLE"),
                complexity_confidence=cached_payload.get("complexity_confidence", 0.95),
                nlp_features=cached_payload.get("nlp_features", {}),
                initial_model="cache",
                selected_model="cache",
                routing_reason="Served from cache memory",
                cache_hit=True,
                input_tokens=0,
                output_tokens=0,
                total_tokens=0,
                cost=0.0,
                cost_saved=cached_payload.get("cost_saved", 0.005),
                latency_ms=round((time.time() - start_total_time) * 1000, 2),
                quality_score=cached_payload.get("quality_score", 90.0),
                quality_status="PASS",
                quality_reason="Served from cache",
                is_escalated=False,
                escalation_count=0
            )
            db.add(log_record)
            db.commit()
        except Exception:
            db.rollback()

        # Save Assistant Response in Chat History
        chat_service.add_message(
            db,
            session_id=current_session_id,
            role="assistant",
            content=cached_payload.get("response", ""),
            model=cached_payload.get("selected_model", "cache"),
            complexity=cached_payload.get("complexity", "SIMPLE"),
            cost_usd=0.0,
            cost_inr=0.0,
            quality_score=cached_payload.get("quality_score", 90.0),
            cache_hit=True,
            latency_ms=round((time.time() - start_total_time) * 1000, 2)
        )

        return PromptProcessResponse(
            request_id=req_id,
            session_id=current_session_id,
            prompt=payload.prompt,
            response=cached_payload.get("response", ""),
            cache_hit=True,
            complexity=cached_payload.get("complexity", "SIMPLE"),
            complexity_confidence=cached_payload.get("complexity_confidence", 0.95),
            nlp_features=cached_payload.get("nlp_features", {
                "length": len(payload.prompt), "word_count": len(payload.prompt.split()),
                "estimated_tokens": int(len(payload.prompt)/4), "has_question": True,
                "has_code_request": False, "requires_reasoning": False, "has_constraints": False,
                "sentence_count": 1, "keywords": []
            }),
            initial_model=cached_payload.get("selected_model", "cache"),
            selected_model=cached_payload.get("selected_model", "cache"),
            final_model=cached_payload.get("final_model", "cache"),
            routing_reason="Cached response served directly from Redis/Memory.",
            quality_score=cached_payload.get("quality_score", 90.0),
            quality_status="PASS",
            quality_reason="Served from verified high-quality cache.",
            is_escalated=False,
            escalation_count=0,
            input_tokens=0,
            output_tokens=0,
            total_tokens=0,
            cost=0.0,
            cost_usd=0.0,
            cost_inr=0.0,
            cost_saved=cached_payload.get("cost_saved", 0.005),
            cost_saved_usd=cached_payload.get("cost_saved", 0.005),
            cost_saved_inr=cached_payload.get("cost_saved", 0.005) * 83.50,
            latency_ms=round((time.time() - start_total_time) * 1000, 2),
            pipeline_steps=pipeline_steps
        )

    pipeline_steps.append(ProcessStepDetail(
        step="2. CACHE CHECK",
        status="CACHE MISS",
        latency_ms=round((time.time() - step_start) * 1000, 2),
        detail={"cache_status": "MISS"}
    ))

    # Step 3: NLP Prompt Feature Analysis
    step_start = time.time()
    nlp_features = prompt_analyzer_service.analyze(payload.prompt)
    pipeline_steps.append(ProcessStepDetail(
        step="3. NLP ANALYSIS",
        status="SUCCESS",
        latency_ms=round((time.time() - step_start) * 1000, 2),
        detail=nlp_features
    ))

    # Step 4: Complexity Classification
    step_start = time.time()
    complexity_tier, confidence = complexity_classifier_service.classify(payload.prompt, nlp_features)
    pipeline_steps.append(ProcessStepDetail(
        step="4. COMPLEXITY CLASSIFICATION",
        status="SUCCESS",
        latency_ms=round((time.time() - step_start) * 1000, 2),
        detail={"tier": complexity_tier, "confidence": confidence}
    ))

    # Step 5: Intelligent LLM Routing
    step_start = time.time()
    routing_result = llm_router_service.route(
        complexity=complexity_tier, 
        preferred_model=payload.preferred_model
    )
    initial_model = routing_result["selected_model"]
    pipeline_steps.append(ProcessStepDetail(
        step="5. LLM ROUTING",
        status="SUCCESS",
        latency_ms=round((time.time() - step_start) * 1000, 2),
        detail=routing_result
    ))

    # Step 6: Response Generation
    step_start = time.time()
    gen_result = await llm_execution_service.generate(payload.prompt, initial_model)
    current_response_text = gen_result["response_text"]
    current_model = gen_result["model"]
    input_tokens = gen_result["input_tokens"]
    output_tokens = gen_result["output_tokens"]
    gen_latency = gen_result["latency_ms"]

    pipeline_steps.append(ProcessStepDetail(
        step="6. RESPONSE GENERATION",
        status="SUCCESS",
        latency_ms=gen_latency,
        detail={"model": current_model, "input_tokens": input_tokens, "output_tokens": output_tokens}
    ))

    # Step 7: Quality Verification
    step_start = time.time()
    q_thresh = payload.override_quality_threshold or settings.QUALITY_THRESHOLD
    quality_res = quality_verifier_service.verify(payload.prompt, current_response_text, nlp_features, quality_threshold=q_thresh)
    
    pipeline_steps.append(ProcessStepDetail(
        step="7. QUALITY VERIFICATION",
        status="PASS" if quality_res["passed"] else "FAIL",
        latency_ms=round((time.time() - step_start) * 1000, 2),
        detail=quality_res
    ))

    # Step 8: Auto-Escalation
    is_escalated = False
    escalation_count = 0
    escalated_from = None

    if not quality_res["passed"]:
        should_escalate, next_model, esc_reason = escalation_service.determine_escalation(
            current_model=current_model, 
            current_escalation_count=escalation_count
        )

        if should_escalate:
            step_start = time.time()
            escalation_count += 1
            is_escalated = True
            escalated_from = current_model
            
            sec_gen_result = await llm_execution_service.generate(payload.prompt, next_model)
            current_response_text = sec_gen_result["response_text"]
            current_model = sec_gen_result["model"]
            input_tokens += sec_gen_result["input_tokens"]
            output_tokens += sec_gen_result["output_tokens"]
            
            quality_res = quality_verifier_service.verify(payload.prompt, current_response_text, nlp_features, quality_threshold=q_thresh)
            
            pipeline_steps.append(ProcessStepDetail(
                step="8. AUTO-ESCALATION",
                status="ESCALATED",
                latency_ms=round((time.time() - step_start) * 1000, 2),
                detail={
                    "from_model": escalated_from,
                    "to_model": current_model,
                    "escalation_reason": esc_reason,
                    "new_quality_score": quality_res["quality_score"]
                }
            ))

    # Step 9: Dual Currency Cost Calculation
    cost_data = cost_tracker_service.calculate_cost(current_model, input_tokens, output_tokens)
    total_latency = round((time.time() - start_total_time) * 1000, 2)

    # Save Assistant Response in Chat History
    chat_service.add_message(
        db,
        session_id=current_session_id,
        role="assistant",
        content=current_response_text,
        model=current_model,
        complexity=complexity_tier,
        cost_usd=cost_data["cost_usd"],
        cost_inr=cost_data["cost_inr"],
        quality_score=quality_res["quality_score"],
        cache_hit=False,
        latency_ms=total_latency
    )

    response_payload = {
        "response": current_response_text,
        "complexity": complexity_tier,
        "complexity_confidence": confidence,
        "selected_model": initial_model,
        "final_model": current_model,
        "nlp_features": nlp_features,
        "quality_score": quality_res["quality_score"],
        "cost_saved": cost_data["cost_saved"]
    }

    # Step 10: Store in Redis Cache
    if settings.CACHE_ENABLED and quality_res["passed"]:
        await cache_service.cache_response(payload.prompt, response_payload, ttl=settings.DEFAULT_CACHE_TTL)

    # Step 11: Store Request Log
    try:
        log_record = RequestLog(
            request_id=req_id,
            prompt=payload.prompt,
            response=current_response_text,
            prompt_length=nlp_features["length"],
            word_count=nlp_features["word_count"],
            estimated_tokens=nlp_features["estimated_tokens"],
            complexity=complexity_tier,
            complexity_confidence=confidence,
            nlp_features=nlp_features,
            initial_model=initial_model,
            selected_model=current_model,
            routing_reason=routing_result["routing_reason"],
            cache_hit=False,
            input_tokens=input_tokens,
            output_tokens=output_tokens,
            total_tokens=input_tokens + output_tokens,
            cost=cost_data["cost"],
            cost_saved=cost_data["cost_saved"],
            latency_ms=total_latency,
            quality_score=quality_res["quality_score"],
            quality_status=quality_res["quality_status"],
            quality_reason=quality_res["quality_reason"],
            is_escalated=is_escalated,
            escalation_count=escalation_count,
            escalated_from_model=escalated_from
        )
        db.add(log_record)
        db.commit()
    except Exception:
        db.rollback()

    return PromptProcessResponse(
        request_id=req_id,
        session_id=current_session_id,
        prompt=payload.prompt,
        response=current_response_text,
        cache_hit=False,
        complexity=complexity_tier,
        complexity_confidence=confidence,
        nlp_features=nlp_features,
        initial_model=initial_model,
        selected_model=initial_model,
        final_model=current_model,
        routing_reason=routing_result["routing_reason"],
        quality_score=quality_res["quality_score"],
        quality_status=quality_res["quality_status"],
        quality_reason=quality_res["quality_reason"],
        is_escalated=is_escalated,
        escalation_count=escalation_count,
        input_tokens=input_tokens,
        output_tokens=output_tokens,
        total_tokens=input_tokens + output_tokens,
        cost=cost_data["cost_usd"],
        cost_usd=cost_data["cost_usd"],
        cost_inr=cost_data["cost_inr"],
        cost_saved=cost_data["cost_saved_usd"],
        cost_saved_usd=cost_data["cost_saved_usd"],
        cost_saved_inr=cost_data["cost_saved_inr"],
        latency_ms=total_latency,
        pipeline_steps=pipeline_steps
    )
