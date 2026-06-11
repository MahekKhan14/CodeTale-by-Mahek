"""
Claude (Anthropic) service wrapper.
Handles: regular completions, streaming, structured JSON outputs, retries.
"""
import json
import asyncio
from typing import AsyncGenerator, Optional, Any
import anthropic
from config import get_settings

settings = get_settings()
_client: Optional[anthropic.AsyncAnthropic] = None


def get_client() -> anthropic.AsyncAnthropic:
    global _client
    if _client is None:
        if not settings.anthropic_api_key:
            raise ValueError("ANTHROPIC_API_KEY not set in .env")
        _client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)
    return _client


async def complete(
    system_prompt: str,
    user_message: str,
    max_tokens: int = 1024,
    temperature: float = 0.3,
    model: Optional[str] = None,
) -> str:
    """Single-turn completion. Returns raw text."""
    client = get_client()
    model = model or settings.model_claude
    msg = await client.messages.create(
        model=model,
        max_tokens=max_tokens,
        temperature=temperature,
        system=system_prompt,
        messages=[{"role": "user", "content": user_message}],
    )
    return msg.content[0].text


async def complete_json(
    system_prompt: str,
    user_message: str,
    max_tokens: int = 1024,
    temperature: float = 0.1,
    model: Optional[str] = None,
    retries: int = 2,
) -> dict:
    """
    Completion that expects and parses JSON output.
    Retries on parse failure with a correction prompt.
    """
    for attempt in range(retries + 1):
        try:
            text = await complete(
                system_prompt=system_prompt,
                user_message=user_message if attempt == 0 else user_message + "\n\nIMPORTANT: Respond with ONLY valid JSON, no markdown, no extra text.",
                max_tokens=max_tokens,
                temperature=temperature,
                model=model,
            )
            # Strip markdown fences if present
            text = text.strip()
            if text.startswith("```"):
                text = text.split("```")[1]
                if text.startswith("json"):
                    text = text[4:]
            text = text.strip().rstrip("```").strip()
            return json.loads(text)
        except (json.JSONDecodeError, IndexError) as e:
            if attempt == retries:
                raise ValueError(f"Claude returned invalid JSON after {retries+1} attempts: {e}\nRaw: {text}")
            await asyncio.sleep(0.5)


async def complete_multiturn(
    system_prompt: str,
    messages: list,
    max_tokens: int = 1024,
    temperature: float = 0.5,
    model: Optional[str] = None,
) -> str:
    """Multi-turn conversation completion."""
    client = get_client()
    model = model or settings.model_claude
    msg = await client.messages.create(
        model=model,
        max_tokens=max_tokens,
        temperature=temperature,
        system=system_prompt,
        messages=messages,
    )
    return msg.content[0].text


async def stream_complete(
    system_prompt: str,
    messages: list,
    max_tokens: int = 1024,
    temperature: float = 0.7,
    model: Optional[str] = None,
) -> AsyncGenerator[str, None]:
    """
    Streaming completion. Yields text chunks as they arrive.
    Used for Byte's real-time chat responses.
    """
    client = get_client()
    model = model or settings.model_claude
    async with client.messages.stream(
        model=model,
        max_tokens=max_tokens,
        temperature=temperature,
        system=system_prompt,
        messages=messages,
    ) as stream:
        async for text in stream.text_stream:
            yield text
