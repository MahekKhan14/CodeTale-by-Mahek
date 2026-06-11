"""
AI Router — all /ai/* endpoints.
Each endpoint demonstrates a different GenAI engineering pattern.
"""
import json
from datetime import date
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from models.schemas import (
    HintRequest, HintResponse,
    CodeReviewRequest, CodeReviewResponse,
    ErrorExplainRequest, ErrorExplainResponse,
    ComplexityRequest, ComplexityResponse,
    ChatRequest,
    TeachByteRequest, TeachByteResponse,
    InterviewTurnRequest, InterviewTurnResponse,
    ReadinessRequest, ReadinessResponse,
    SolutionCompareRequest, SolutionCompareResponse,
)
from services.prompt_manager import render_prompt
from services.llm_router import route_json, route_stream, get_cache_stats
from config import get_settings

router = APIRouter(prefix="/ai", tags=["AI"])
settings = get_settings()


# ── /ai/hint ─────────────────────────────────────────────
@router.post("/hint", response_model=HintResponse)
async def get_hint(req: HintRequest):
    """
    Contextual hint generation.
    Pattern: Structured output + prompt versioning + caching
    Model: Gemini Flash (fast, cheap) with Claude fallback
    """
    profile = req.profile
    system = render_prompt(
        "hint",
        version=settings.prompt_hint_version,
        problem_title=req.problem_title,
        problem_description=req.problem_description,
        attempts=req.attempts,
        hint_level=req.hint_level,
        weak_topics=", ".join(profile.weak_topics) if profile else "unknown",
        strong_topics=", ".join(profile.strong_topics) if profile else "unknown",
        learning_style=profile.learning_style if profile else "balanced",
        student_code=req.student_code,
    )
    user_msg = f"Generate a level {req.hint_level} hint for this student's code attempt."

    try:
        data, model_used, cached = await route_json(
            feature="hint",
            system_prompt=system,
            user_message=user_msg,
            cache_inputs=[req.problem_id, req.student_code, req.hint_level],
        )
        return HintResponse(
            hint_text=data.get("hint_text", "Think about what data structure would give you O(1) lookup."),
            hint_level=data.get("hint_level", req.hint_level),
            encouragement=data.get("encouragement", "You're on the right track!"),
            follow_up_question=data.get("follow_up_question", "What do you need to track as you iterate?"),
            model_used=model_used,
            cached=cached,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── /ai/review ────────────────────────────────────────────
@router.post("/review", response_model=CodeReviewResponse)
async def review_code(req: CodeReviewRequest):
    """
    Deep code review.
    Pattern: Structured output with rich schema + personalization via profile
    Model: Claude Sonnet (best at code reasoning)
    """
    profile = req.profile
    system = render_prompt(
        "code_review",
        version="v1",
        problem_title=req.problem_title,
        student_code=req.student_code,
        expected_output=req.expected_output,
        actual_output=req.actual_output,
        is_correct=req.is_correct,
        level=profile.level if profile else 1,
        weak_topics=", ".join(profile.weak_topics) if profile else "",
    )
    user_msg = "Review this student's code solution thoroughly."

    try:
        data, model_used, cached = await route_json(
            feature="code_review",
            system_prompt=system,
            user_message=user_msg,
            cache_inputs=[req.problem_id, req.student_code],
        )
        return CodeReviewResponse(
            overall_score=data.get("overall_score", 70),
            correctness=data.get("correctness", ""),
            time_complexity=data.get("time_complexity", "O(n)"),
            space_complexity=data.get("space_complexity", "O(1)"),
            code_style=data.get("code_style", []),
            improvements=data.get("improvements", []),
            what_you_did_well=data.get("what_you_did_well", []),
            optimized_approach=data.get("optimized_approach"),
            model_used=model_used,
            cached=cached,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── /ai/explain-error ─────────────────────────────────────
@router.post("/explain-error", response_model=ErrorExplainResponse)
async def explain_error(req: ErrorExplainRequest):
    """
    Plain-English error explanation.
    Pattern: Claude for nuanced debugging explanation
    """
    system = render_prompt(
        "error_explain",
        version="v1",
        code=req.code,
        error_message=req.error_message,
        problem_context=req.problem_context,
    )
    user_msg = f"Explain this Python error to the student: {req.error_message}"

    try:
        data, model_used, _ = await route_json(
            feature="error_explain",
            system_prompt=system,
            user_message=user_msg,
            use_cache=False,  # errors are always context-specific
        )
        return ErrorExplainResponse(
            what_went_wrong=data.get("what_went_wrong", "An error occurred in your code."),
            why_it_happened=data.get("why_it_happened", ""),
            how_to_fix=data.get("how_to_fix", ""),
            example_fix=data.get("example_fix", ""),
            model_used=model_used,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── /ai/complexity ────────────────────────────────────────
@router.post("/complexity", response_model=ComplexityResponse)
async def analyze_complexity(req: ComplexityRequest):
    """
    Time/space complexity analysis.
    Pattern: Gemini for fast structured analysis
    """
    system = render_prompt(
        "complexity",
        version="v1",
        code=req.code,
        problem_title=req.problem_title,
    )
    user_msg = "Analyze the time and space complexity of this code."

    try:
        data, model_used, cached = await route_json(
            feature="complexity",
            system_prompt=system,
            user_message=user_msg,
            cache_inputs=[req.code],
        )
        return ComplexityResponse(
            time_complexity=data.get("time_complexity", "O(n)"),
            space_complexity=data.get("space_complexity", "O(1)"),
            explanation=data.get("explanation", ""),
            best_case=data.get("best_case", ""),
            worst_case=data.get("worst_case", ""),
            is_optimal=data.get("is_optimal", False),
            optimal_hint=data.get("optimal_hint"),
            model_used=model_used,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── /ai/chat (SSE streaming) ──────────────────────────────
@router.post("/chat")
async def chat_with_byte(req: ChatRequest):
    """
    Byte mentor chat — STREAMING via Server-Sent Events.
    Pattern: SSE streaming + context window management + multi-model
    Model: Gemini Flash (fast streaming) with Claude fallback
    """
    profile = req.profile

    # Context window management: trim history to last 8 messages
    trimmed_history = req.history[-8:] if len(req.history) > 8 else req.history

    system = render_prompt(
        "byte_chat",
        version="v1",
        player_name=profile.player_name if profile else "student",
        level=profile.level if profile else 1,
        current_chapter=req.current_chapter,
        current_problem=req.current_problem,
        weak_topics=", ".join(profile.weak_topics) if profile else "unknown",
        strong_topics=", ".join(profile.strong_topics) if profile else "unknown",
        streak=profile.streak if profile else 0,
        mode=req.mode,
    )

    # Build full message for Gemini (it gets system separately)
    history_text = ""
    for msg in trimmed_history:
        prefix = "Student" if msg.role == "user" else "Byte"
        history_text += f"{prefix}: {msg.content}\n"

    full_message = f"{history_text}Student: {req.message}"

    # Build Claude-format messages for multi-turn
    claude_messages = []
    for msg in trimmed_history:
        claude_messages.append({"role": msg.role, "content": msg.content})
    claude_messages.append({"role": "user", "content": req.message})

    async def generate():
        try:
            async for chunk in route_stream(
                feature="chat",
                system_prompt=system,
                user_message=full_message,
                messages=claude_messages,
            ):
                yield f"data: {json.dumps({'text': chunk})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        }
    )


# ── /ai/teach-byte ────────────────────────────────────────
@router.post("/teach-byte", response_model=TeachByteResponse)
async def teach_byte(req: TeachByteRequest):
    """
    Feynman technique — student explains, AI evaluates.
    Pattern: Gemini evaluates explanation accuracy
    """
    system = render_prompt(
        "teach_byte",
        version="v1",
        concept=req.concept,
        student_explanation=req.student_explanation,
    )
    user_msg = f"Evaluate if the student correctly explained: {req.concept}"

    try:
        data, model_used, _ = await route_json(
            feature="teach_byte",
            system_prompt=system,
            user_message=user_msg,
            use_cache=False,
        )
        return TeachByteResponse(
            is_correct=data.get("is_correct", False),
            accuracy_score=data.get("accuracy_score", 50),
            what_you_got_right=data.get("what_you_got_right", []),
            what_you_missed=data.get("what_you_missed", []),
            follow_up_question=data.get("follow_up_question", ""),
            byte_response=data.get("byte_response", ""),
            model_used=model_used,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── /ai/interview ─────────────────────────────────────────
@router.post("/interview", response_model=InterviewTurnResponse)
async def mock_interview_turn(req: InterviewTurnRequest):
    """
    Multi-turn mock interview.
    Pattern: Claude for roleplay + prompt chaining across turns
    """
    profile = req.profile
    history_text = "\n".join(
        f"{'Interviewer' if m.role == 'assistant' else 'Candidate'}: {m.content}"
        for m in req.history[-10:]
    )

    system = render_prompt(
        "mock_interview",
        version="v1",
        problem_context=req.problem_context,
        level=profile.level if profile else 1,
        strong_topics=", ".join(profile.strong_topics) if profile else "",
        weak_topics=", ".join(profile.weak_topics) if profile else "",
        turn_number=req.turn_number,
        history=history_text,
        student_response=req.student_response,
    )
    user_msg = f"Turn {req.turn_number}. Candidate said: {req.student_response}"

    try:
        data, model_used, _ = await route_json(
            feature="mock_interview",
            system_prompt=system,
            user_message=user_msg,
            temperature=0.6,
            use_cache=False,
        )
        return InterviewTurnResponse(
            interviewer_message=data.get("interviewer_message", "Can you walk me through your approach?"),
            is_complete=data.get("is_complete", False),
            score=data.get("score"),
            feedback=data.get("feedback"),
            follow_up_type=data.get("follow_up_type", "clarification"),
            model_used=model_used,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── /ai/readiness ─────────────────────────────────────────
@router.post("/readiness", response_model=ReadinessResponse)
async def get_readiness_score(req: ReadinessRequest):
    """
    Interview readiness scoring.
    Pattern: Claude analyzes full learning history for deep insights
    """
    p = req.profile
    system = render_prompt(
        "readiness",
        version="v1",
        level=p.level,
        xp=p.xp,
        problems_solved=len(p.completed_problems),
        chapters_completed=len(p.completed_chapters),
        streak=p.streak,
        strong_areas=", ".join(p.strong_topics),
        weak_areas=", ".join(p.weak_topics),
        avg_attempts=p.avg_attempts,
        hint_usage_rate=p.hint_usage_rate,
        problems_detail=json.dumps(req.completed_problems_detail[:20]),
    )
    user_msg = "Generate an honest interview readiness assessment for this student."

    try:
        data, model_used, cached = await route_json(
            feature="readiness",
            system_prompt=system,
            user_message=user_msg,
            max_tokens=2048,
            cache_inputs=[p.session_id, len(p.completed_problems), p.level],
        )
        return ReadinessResponse(
            score=data.get("score", 30),
            label=data.get("label", "Building Foundation"),
            strong_areas=data.get("strong_areas", []),
            weak_areas=data.get("weak_areas", []),
            recommended_focus=data.get("recommended_focus", []),
            weeks_to_ready=data.get("weeks_to_ready", 8),
            breakdown=data.get("breakdown", {}),
            model_used=model_used,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── /ai/compare ───────────────────────────────────────────
@router.post("/compare", response_model=SolutionCompareResponse)
async def compare_solutions(req: SolutionCompareRequest):
    """Compare student solution vs optimal using Gemini."""
    system = f"""You are an expert algorithm teacher comparing two solutions to the same problem.
Problem: {req.problem_title}

Student solution:
```python
{req.student_code}
```

Optimal solution:
```python
{req.optimal_solution}
```

Respond ONLY with valid JSON:
{{
  "similarity_score": <0-100>,
  "approach_comparison": "brief comparison of the two approaches",
  "student_approach": "name/description of student's approach",
  "optimal_approach": "name/description of optimal approach",
  "key_differences": ["diff1", "diff2", "diff3"],
  "what_to_learn": "one key insight the student should take away"
}}"""

    try:
        data, model_used, _ = await route_json(
            feature="compare",
            system_prompt=system,
            user_message="Compare these two solutions.",
            cache_inputs=[req.student_code, req.optimal_solution],
        )
        return SolutionCompareResponse(
            similarity_score=data.get("similarity_score", 50),
            approach_comparison=data.get("approach_comparison", ""),
            student_approach=data.get("student_approach", ""),
            optimal_approach=data.get("optimal_approach", ""),
            key_differences=data.get("key_differences", []),
            what_to_learn=data.get("what_to_learn", ""),
            model_used=model_used,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── /ai/meta ──────────────────────────────────────────────
@router.get("/meta")
async def get_ai_meta():
    """
    Returns model routing config and cache stats.
    Useful for portfolio demos — shows the multi-model architecture.
    """
    from services.llm_router import ROUTING, get_cache_stats
    return {
        "routing": ROUTING,
        "models": {
            "claude": settings.model_claude,
            "gemini": settings.model_gemini,
        },
        "prompt_versions": {
            "hint": settings.prompt_hint_version,
            "review": settings.prompt_review_version,
            "chat": settings.prompt_chat_version,
            "interview": settings.prompt_interview_version,
        },
        "cache": get_cache_stats(),
    }
