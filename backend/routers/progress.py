import json
import os
from pathlib import Path
from fastapi import APIRouter, HTTPException
from models.schemas import SaveProgressRequest, LoadProgressResponse

router = APIRouter(prefix="/progress", tags=["Progress"])

SAVE_DIR = Path("./saves")
SAVE_DIR.mkdir(exist_ok=True)


@router.post("/save")
async def save_progress(req: SaveProgressRequest):
    """Save player progress to a JSON file keyed by session_id."""
    if not req.session_id or len(req.session_id) > 64:
        raise HTTPException(status_code=400, detail="Invalid session_id")

    safe_id = "".join(c for c in req.session_id if c.isalnum() or c in "-_")
    path = SAVE_DIR / f"{safe_id}.json"
    path.write_text(json.dumps(req.data, indent=2), encoding="utf-8")
    return {"saved": True, "session_id": req.session_id}


@router.get("/load/{session_id}", response_model=LoadProgressResponse)
async def load_progress(session_id: str):
    """Load player progress from JSON file."""
    safe_id = "".join(c for c in session_id if c.isalnum() or c in "-_")
    path = SAVE_DIR / f"{safe_id}.json"

    if not path.exists():
        return LoadProgressResponse(found=False)

    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        return LoadProgressResponse(found=True, data=data)
    except Exception:
        return LoadProgressResponse(found=False)


@router.delete("/reset/{session_id}")
async def reset_progress(session_id: str):
    """Delete saved progress."""
    safe_id = "".join(c for c in session_id if c.isalnum() or c in "-_")
    path = SAVE_DIR / f"{safe_id}.json"
    if path.exists():
        path.unlink()
    return {"reset": True}
