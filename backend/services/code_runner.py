"""
Safe Python code execution via subprocess with timeout and output limits.
Production would use Docker/gVisor, but this is solid for a portfolio project.
"""
import subprocess
import sys
import time
import os
import tempfile
from config import get_settings

settings = get_settings()

# Blocked imports for safety
BLOCKED_IMPORTS = [
    "os.system", "subprocess", "shutil.rmtree", "__import__",
    "open('/", "open(\"/",'eval(', "exec(", "compile(",
    "socket", "requests", "urllib", "http.client",
]


def is_safe(code: str) -> tuple[bool, str]:
    """Basic static analysis to block obviously dangerous code."""
    code_lower = code.lower()
    for pattern in BLOCKED_IMPORTS:
        if pattern.lower() in code_lower:
            return False, f"Blocked pattern detected: '{pattern}'"
    return True, ""


def run_code(code: str, timeout: int = None) -> dict:
    """
    Execute Python code safely in a subprocess.
    Returns: {stdout, stderr, error, execution_time_ms, timed_out}
    """
    timeout = timeout or settings.max_code_execution_time

    # Safety check
    safe, reason = is_safe(code)
    if not safe:
        return {
            "stdout": "",
            "stderr": "",
            "error": f"Code blocked: {reason}",
            "execution_time_ms": 0,
            "timed_out": False,
        }

    # Write to temp file
    with tempfile.NamedTemporaryFile(
        mode="w", suffix=".py", delete=False, encoding="utf-8"
    ) as f:
        f.write(code)
        tmp_path = f.name

    try:
        start = time.time()
        result = subprocess.run(
            [sys.executable, tmp_path],
            capture_output=True,
            text=True,
            timeout=timeout,
            env={**os.environ, "PYTHONPATH": ""},  # clean env
        )
        elapsed_ms = int((time.time() - start) * 1000)

        stdout = result.stdout[:settings.max_output_length]
        stderr = result.stderr[:500]

        return {
            "stdout": stdout,
            "stderr": stderr,
            "error": None,
            "execution_time_ms": elapsed_ms,
            "timed_out": False,
        }

    except subprocess.TimeoutExpired:
        return {
            "stdout": "",
            "stderr": "",
            "error": f"Code timed out after {timeout} seconds.",
            "execution_time_ms": timeout * 1000,
            "timed_out": True,
        }
    except Exception as e:
        return {
            "stdout": "",
            "stderr": str(e),
            "error": "Execution error",
            "execution_time_ms": 0,
            "timed_out": False,
        }
    finally:
        os.unlink(tmp_path)
