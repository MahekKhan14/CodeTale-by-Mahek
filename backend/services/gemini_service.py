"""
Gemini (Google) service wrapper — uses google-genai (new SDK).
"""
import json
import asyncio
from typing import AsyncGenerator, Optional
from google import genai
from google.genai import types
from config import get_settings

settings = get_settings()
_client: Optional[genai.Client] = None


def get_client() -> genai.Client:
    global _client
    if _client is None:
        if not settings.gemini_api_key:
            raise ValueError("GEMINI_API_KEY not set in .env")
        _client = genai.Client(api_key=settings.gemini_api_key)
    return _client


async def complete(
    system_prompt: str,
    user_message: str,
    max_tokens: int = 1024,
    temperature: float = 0.3,
    model: Optional[str] = None,
) -> str:
    client = get_client()
    loop = asyncio.get_event_loop()
    model_name = model or settings.model_gemini

    def _call():
        response = client.models.generate_content(
            model=model_name,
            contents=user_message,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                max_output_tokens=max_tokens,
                temperature=temperature,
            ),
        )
        return response.text

    return await loop.run_in_executor(None, _call)


async def complete_json(
    system_prompt: str,
    user_message: str,
    max_tokens: int = 1024,
    temperature: float = 0.1,
    model: Optional[str] = None,
    retries: int = 2,
) -> dict:
    for attempt in range(retries + 1):
        try:
            msg = (
                user_message
                if attempt == 0
                else user_message + "\n\nIMPORTANT: Output ONLY valid JSON. No markdown, no backticks."
            )
            text = await complete(
                system_prompt=system_prompt,
                user_message=msg,
                max_tokens=max_tokens,
                temperature=temperature,
                model=model,
            )
            text = text.strip()
            if text.startswith("```"):
                parts = text.split("```")
                text = parts[1] if len(parts) > 1 else text
                if text.startswith("json"):
                    text = text[4:]
            text = text.strip().rstrip("```").strip()
            return json.loads(text)
        except (json.JSONDecodeError, Exception) as e:
            if attempt == retries:
                raise ValueError(f"Gemini returned invalid JSON after {retries+1} attempts: {e}")
            await asyncio.sleep(0.5)


async def stream_complete(
    system_prompt: str,
    user_message: str,
    max_tokens: int = 1024,
    temperature: float = 0.7,
    model: Optional[str] = None,
) -> AsyncGenerator[str, None]:
    client = get_client()
    model_name = model or settings.model_gemini

    response_stream = await client.aio.models.generate_content_stream(
        model=model_name,
        contents=user_message,
        config=types.GenerateContentConfig(
            system_instruction=system_prompt,
            max_output_tokens=max_tokens,
            temperature=temperature,
        ),
    )
    async for chunk in response_stream:
        if chunk.text:
            yield chunk.text
