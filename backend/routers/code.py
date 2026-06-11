from fastapi import APIRouter, HTTPException
from models.schemas import CodeRunRequest, CodeRunResponse
from services.code_runner import run_code

router = APIRouter(prefix="/code", tags=["Code"])


@router.post("/run", response_model=CodeRunResponse)
async def execute_code(req: CodeRunRequest):
    """
    Execute Python code safely in a subprocess sandbox.
    Returns stdout, stderr, execution time, timeout status.
    """
    if not req.code.strip():
        raise HTTPException(status_code=400, detail="Code cannot be empty")

    if len(req.code) > 10000:
        raise HTTPException(status_code=400, detail="Code too long (max 10,000 chars)")

    result = run_code(req.code, timeout=req.timeout)
    return CodeRunResponse(**result)
