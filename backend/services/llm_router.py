"""
LLM Router — the brain of multi-model orchestration.

Design decisions documented here (this is what GenAI engineers care about):

ROUTING LOGIC:
- Claude Sonnet: code review, error explanation, mock interview (complex reasoning)
- Gemini Flash: hints, complexity, chat, teach-byte (fast, cost-efficient)
- Both + consensus: solution evaluation (correctness matters most)

CACHING:
- In-memory dict with TTL (production would use Redis)
- Key = hash of (feature + prompt inputs)
- Avoids redundant API calls for identical requests

FALLBACK CHAIN:
- Primary model fails → try secondary model
- Both fail → return graceful error (never crash the UI)
"""
import hashlib
import json
import time
from typing import Optional, Tuple
from config import get_settings
import services.claude_service as claude
import services.gemini_service as gemini

settings = get_settings()

# ── In-memory cache ─────────────────────────────────────
_cache: dict = {}  # key → (value, timestamp)


def _cache_key(*args) -> str:
    raw = json.dumps(args, sort_keys=True, default=str)
    return hashlib.sha256(raw.encode()).hexdigest()[:16]


def _cache_get(key: str) -> Optional[dict]:
    if key in _cache:
        value, ts = _cache[key]
        if time.time() - ts < settings.cache_ttl_seconds:
            return value
        del _cache[key]
    return None


def _cache_set(key: str, value: dict):
    _cache[key] = (value, time.time())
    # Simple eviction: keep only 500 entries
    if len(_cache) > 500:
        oldest_key = min(_cache.keys(), key=lambda k: _cache[k][1])
        del _cache[oldest_key]


# ── Model routing decisions ──────────────────────────────
ROUTING = {
    "hint":           ("gemini", "gemini"),
    "code_review":    ("gemini", "gemini"),
    "error_explain":  ("gemini", "gemini"),
    "complexity":     ("gemini", "gemini"),
    "chat":           ("gemini", "gemini"),
    "teach_byte":     ("gemini", "gemini"),
    "mock_interview": ("gemini", "gemini"),
    "readiness":      ("gemini", "gemini"),
    "compare":        ("gemini", "gemini"),
}


async def route_json(
    feature: str,
    system_prompt: str,
    user_message: str,
    max_tokens: int = 1024,
    temperature: float = 0.2,
    use_cache: bool = True,
    cache_inputs: Optional[list] = None,
) -> Tuple[dict, str, bool]:
    """
    Route a JSON-output request to the right model with fallback.
    Returns: (result_dict, model_used_str, was_cached)
    """
    # Cache check
    cache_key = _cache_key(feature, cache_inputs or [system_prompt, user_message])
    if use_cache:
        cached = _cache_get(cache_key)
        if cached is not None:
            return cached, "cached", True

    primary, fallback = ROUTING.get(feature, ("gemini", "claude"))

    # Try primary
    try:
        if primary == "claude":
            result = await claude.complete_json(system_prompt, user_message, max_tokens, temperature)
            model_used = f"claude/{settings.model_claude}"
        else:
            result = await gemini.complete_json(system_prompt, user_message, max_tokens, temperature, model=settings.model_gemini)
            model_used = f"gemini/{settings.model_gemini}"

        if use_cache:
            _cache_set(cache_key, result)
        return result, model_used, False

    except Exception as primary_err:
        # Fallback
        try:
            if fallback == "claude":
                result = await claude.complete_json(system_prompt, user_message, max_tokens, temperature)
                model_used = f"claude/{settings.model_claude} (fallback)"
            else:
                result = await gemini.complete_json(system_prompt, user_message, max_tokens, temperature, model=settings.model_gemini_fallback)
                model_used = f"gemini/{settings.model_gemini_fallback} (fallback)"

            if use_cache:
                _cache_set(cache_key, result)
            return result, model_used, False

        except Exception as fallback_err:
            raise RuntimeError(
                f"Both models failed for {feature}. "
                f"Primary ({primary}): {primary_err}. "
                f"Fallback ({fallback}): {fallback_err}"
            )


async def route_stream(feature: str, system_prompt: str, user_message: str, messages: list = None):
    """
    Route a streaming request.
    Chat uses Gemini stream; interview uses Claude stream.
    """
    primary = ROUTING.get(feature, ("gemini", "claude"))[0]
    try:
        if primary == "claude":
            async for chunk in claude.stream_complete(system_prompt, messages or [{"role": "user", "content": user_message}]):
                yield chunk
        else:
            async for chunk in gemini.stream_complete(system_prompt, user_message, model=settings.model_gemini):
                yield chunk
    except Exception:
        # Fallback to other model
        fallback = ROUTING.get(feature, ("gemini", "claude"))[1]
        if fallback == "claude":
            async for chunk in claude.stream_complete(system_prompt, messages or [{"role": "user", "content": user_message}]):
                yield chunk
        else:
            async for chunk in gemini.stream_complete(system_prompt, user_message, model=settings.model_gemini_fallback):
                yield chunk


def get_cache_stats() -> dict:
    """Return cache statistics for admin/debug endpoint."""
    now = time.time()
    valid = sum(1 for v, ts in _cache.values() if now - ts < settings.cache_ttl_seconds)
    return {"total_entries": len(_cache), "valid_entries": valid, "ttl_seconds": settings.cache_ttl_seconds}
