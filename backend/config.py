from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    anthropic_api_key: str = ""
    gemini_api_key: str = ""
    app_env: str = "development"
    max_code_execution_time: int = 5
    max_output_length: int = 2000
    cache_ttl_seconds: int = 3600
    rate_limit_per_session: int = 50

    # Model routing
    model_claude: str = "claude-sonnet-4-6"
    model_gemini: str = "gemini-2.5-flash"
    model_gemini_fallback: str = "gemini-3.5-flash"

    # Active prompt versions
    prompt_hint_version: str = "v2"
    prompt_review_version: str = "v1"
    prompt_chat_version: str = "v1"
    prompt_interview_version: str = "v1"

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
