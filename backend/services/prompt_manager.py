"""
Prompt Manager — loads versioned prompt templates.
Shows prompt engineering discipline: prompts are NOT hardcoded strings.
They are versioned, templated, and swappable without code changes.
"""
import os
from pathlib import Path
from string import Template
from functools import lru_cache
from typing import Dict

PROMPTS_DIR = Path(__file__).parent.parent / "prompts"

# In-memory cache of loaded templates
_cache: Dict[str, str] = {}


def load_prompt(name: str, version: str = "v1") -> str:
    """Load a prompt template by name and version."""
    key = f"{name}_{version}"
    if key not in _cache:
        path = PROMPTS_DIR / f"{name}_{version}.txt"
        if not path.exists():
            # Fallback to v1
            path = PROMPTS_DIR / f"{name}_v1.txt"
        if not path.exists():
            raise FileNotFoundError(f"Prompt not found: {name} ({version})")
        _cache[key] = path.read_text(encoding="utf-8")
    return _cache[key]


def render_prompt(name: str, version: str = "v1", **kwargs) -> str:
    """Load and render a prompt template with variable substitution."""
    template_str = load_prompt(name, version)
    # Use safe_substitute so missing vars don't crash
    return Template(template_str).safe_substitute(**kwargs)


def list_prompts() -> list:
    """List all available prompt files (for debugging/admin)."""
    return [f.name for f in PROMPTS_DIR.glob("*.txt")]


def invalidate_cache():
    """Clear prompt cache (call after editing prompts in dev)."""
    global _cache
    _cache = {}
