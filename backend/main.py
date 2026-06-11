"""
CodeTale v3 — FastAPI Backend
Multi-LLM GenAI Platform: Claude (Anthropic) + Gemini (Google)
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import ai, code, progress
from config import get_settings

settings = get_settings()

app = FastAPI(
    title="CodeTale API",
    description="Multi-LLM Python learning platform — Claude + Gemini",
    version="3.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS — allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(ai.router)
app.include_router(code.router)
app.include_router(progress.router)


@app.get("/")
async def root():
    return {
        "name": "CodeTale API v3",
        "models": {
            "claude": settings.model_claude,
            "gemini": settings.model_gemini,
        },
        "endpoints": ["/ai/hint", "/ai/review", "/ai/chat", "/ai/complexity",
                      "/ai/explain-error", "/ai/teach-byte", "/ai/interview",
                      "/ai/readiness", "/ai/compare", "/ai/meta",
                      "/code/run", "/progress/save", "/progress/load/{id}"],
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    return {"status": "ok", "env": settings.app_env}
