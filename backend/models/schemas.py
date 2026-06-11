from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum

# ── Enums ────────────────────────────────────────────────
class DifficultyLevel(str, Enum):
    easy = "Easy"
    medium = "Medium"
    hard = "Hard"

class LLMProvider(str, Enum):
    claude = "claude"
    gemini = "gemini"

class HintLevel(int, Enum):
    gentle = 1      # nudge in right direction
    medium = 2      # specific pointer
    direct = 3      # near-solution guidance

# ── Student Profile ───────────────────────────────────────
class LearningProfile(BaseModel):
    session_id: str
    player_name: str = ""
    level: int = 1
    xp: int = 0
    completed_problems: List[str] = []
    completed_chapters: List[str] = []
    weak_topics: List[str] = []
    strong_topics: List[str] = []
    avg_attempts: float = 1.0
    hint_usage_rate: float = 0.0
    learning_style: str = "balanced"  # visual, example-first, definition-first
    streak: int = 0

# ── Code Execution ────────────────────────────────────────
class CodeRunRequest(BaseModel):
    code: str
    timeout: int = 5
    session_id: str = "anonymous"

class CodeRunResponse(BaseModel):
    stdout: str = ""
    stderr: str = ""
    error: Optional[str] = None
    execution_time_ms: int = 0
    timed_out: bool = False

# ── AI: Hint ─────────────────────────────────────────────
class HintRequest(BaseModel):
    problem_id: str
    problem_title: str
    problem_description: str
    student_code: str
    attempts: int = 1
    hint_level: HintLevel = HintLevel.gentle
    session_id: str = "anonymous"
    profile: Optional[LearningProfile] = None

class HintResponse(BaseModel):
    hint_text: str
    hint_level: int
    encouragement: str
    follow_up_question: str
    model_used: str
    cached: bool = False

# ── AI: Code Review ───────────────────────────────────────
class CodeReviewRequest(BaseModel):
    problem_id: str
    problem_title: str
    student_code: str
    expected_output: str
    actual_output: str
    is_correct: bool
    session_id: str = "anonymous"
    profile: Optional[LearningProfile] = None

class CodeReviewResponse(BaseModel):
    overall_score: int          # 0-100
    correctness: str
    time_complexity: str
    space_complexity: str
    code_style: List[str]
    improvements: List[str]
    what_you_did_well: List[str]
    optimized_approach: Optional[str] = None
    model_used: str
    cached: bool = False

# ── AI: Error Explanation ─────────────────────────────────
class ErrorExplainRequest(BaseModel):
    code: str
    error_message: str
    problem_context: str = ""
    session_id: str = "anonymous"

class ErrorExplainResponse(BaseModel):
    what_went_wrong: str
    why_it_happened: str
    how_to_fix: str
    example_fix: str
    model_used: str

# ── AI: Complexity Analysis ───────────────────────────────
class ComplexityRequest(BaseModel):
    code: str
    problem_title: str = ""
    session_id: str = "anonymous"

class ComplexityResponse(BaseModel):
    time_complexity: str
    space_complexity: str
    explanation: str
    best_case: str
    worst_case: str
    is_optimal: bool
    optimal_hint: Optional[str] = None
    model_used: str

# ── AI: Chat (Byte mentor) ────────────────────────────────
class ChatMessage(BaseModel):
    role: str   # "user" | "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []
    current_chapter: str = ""
    current_problem: str = ""
    session_id: str = "anonymous"
    profile: Optional[LearningProfile] = None
    mode: str = "mentor"   # mentor | eli5 | interview

# ── AI: Teach Byte (Feynman) ──────────────────────────────
class TeachByteRequest(BaseModel):
    concept: str
    student_explanation: str
    session_id: str = "anonymous"
    profile: Optional[LearningProfile] = None

class TeachByteResponse(BaseModel):
    is_correct: bool
    accuracy_score: int       # 0-100
    what_you_got_right: List[str]
    what_you_missed: List[str]
    follow_up_question: str
    byte_response: str
    model_used: str

# ── AI: Solution Comparison ───────────────────────────────
class SolutionCompareRequest(BaseModel):
    problem_title: str
    student_code: str
    optimal_solution: str
    session_id: str = "anonymous"

class SolutionCompareResponse(BaseModel):
    similarity_score: int     # 0-100
    approach_comparison: str
    student_approach: str
    optimal_approach: str
    key_differences: List[str]
    what_to_learn: str
    model_used: str

# ── AI: Interview Mock ────────────────────────────────────
class InterviewTurnRequest(BaseModel):
    student_response: str
    problem_context: str
    turn_number: int = 1
    history: List[ChatMessage] = []
    session_id: str = "anonymous"
    profile: Optional[LearningProfile] = None

class InterviewTurnResponse(BaseModel):
    interviewer_message: str
    is_complete: bool
    score: Optional[int] = None          # only on completion
    feedback: Optional[Dict[str, Any]] = None
    follow_up_type: str = "clarification"  # clarification|optimization|edge_case|done
    model_used: str

# ── AI: Readiness Score ───────────────────────────────────
class ReadinessRequest(BaseModel):
    profile: LearningProfile
    completed_problems_detail: List[Dict[str, Any]] = []

class ReadinessResponse(BaseModel):
    score: int                  # 0-100
    label: str                  # "Not Ready" | "Getting There" | "Almost" | "Ready"
    strong_areas: List[str]
    weak_areas: List[str]
    recommended_focus: List[str]
    weeks_to_ready: int
    breakdown: Dict[str, int]   # category → score
    model_used: str

# ── AI: Daily Challenge ───────────────────────────────────
class DailyChallengeResponse(BaseModel):
    problem_id: str
    title: str
    description: str
    difficulty: str
    xp_reward: int
    date: str

# ── Progress ──────────────────────────────────────────────
class SaveProgressRequest(BaseModel):
    session_id: str
    data: Dict[str, Any]

class LoadProgressResponse(BaseModel):
    found: bool
    data: Optional[Dict[str, Any]] = None

# ── LLM Meta ─────────────────────────────────────────────
class ModelInfo(BaseModel):
    provider: str
    model: str
    feature: str
    version: str
