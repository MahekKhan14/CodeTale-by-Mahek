# CodeTale v3 — Multi-LLM Python & DSA Learning Platform

> A GenAI-powered coding education platform demonstrating production-level AI engineering patterns — multi-model orchestration, prompt versioning, streaming, structured outputs, and adaptive learning.

---

## 🏗️ Architecture Overview

```
codetale-v3/
├── backend/          FastAPI + Claude (Anthropic) + Gemini (Google)
└── frontend/         React + Vite + Zustand
```

### Multi-LLM Routing

| Feature | Primary Model | Fallback | Why |
|---|---|---|---|
| Byte Chat | Gemini Flash | Claude Sonnet | Fast streaming, conversational |
| Code Review | Claude Sonnet | Gemini Flash | Best at code reasoning |
| Hint Generation | Gemini Flash | Claude Sonnet | Fast, cost-efficient |
| Error Explanation | Claude Sonnet | Gemini Flash | Nuanced debugging |
| Complexity Analysis | Gemini Flash | Claude Sonnet | Structured, fast |
| Mock Interview | Claude Sonnet | Gemini Flash | Multi-turn roleplay |
| Teach Byte (Feynman) | Gemini Flash | Claude Sonnet | Evaluation task |
| Readiness Score | Claude Sonnet | Gemini Flash | Deep history analysis |

---

## 🚀 Quick Start

### 1. Clone & Setup

```bash
git clone <repo>
cd codetale-v3
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Mac/Linux
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your API keys:
#   ANTHROPIC_API_KEY=your_key_here
#   GEMINI_API_KEY=your_key_here

# Run the server
uvicorn main:app --reload --port 8000
```

Backend runs at: http://localhost:8000
API docs at: http://localhost:8000/docs

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```

Frontend runs at: http://localhost:5173

---

## 🤖 GenAI Engineering Features

### 1. Prompt Versioning & A/B Testing

Prompts are NOT hardcoded strings. They live in `/backend/prompts/` as versioned `.txt` templates:

```
prompts/
  hint_v1.txt      ← current production
  hint_v2.txt      ← improved version (active via .env)
  code_review_v1.txt
  mock_interview_v1.txt
```

Switch versions without code changes:
```env
PROMPT_HINT_VERSION=v2
```

### 2. Structured Outputs with Pydantic

Every AI response is strictly typed. Claude/Gemini responds in JSON, parsed and validated:

```python
class HintResponse(BaseModel):
    hint_text: str
    hint_level: int
    encouragement: str
    follow_up_question: str
    model_used: str
    cached: bool
```

Retry logic on parse failure — if JSON is malformed, the system retries with a correction prompt.

### 3. LLM Fallback Chain

```python
# Primary: Gemini Flash (fast, cheap)
# → fails → Fallback: Claude Sonnet
# → both fail → Graceful error (never crashes UI)
```

### 4. SSE Streaming

Byte's chat responses stream token-by-token via Server-Sent Events:

```
Frontend → POST /ai/chat
Backend  → text/event-stream
         → data: {"text": "Hey"}
         → data: {"text": " there"}
         → data: [DONE]
```

### 5. In-Memory LLM Cache with TTL

Identical requests (same problem + same code) are cached:
```python
cache_key = sha256(feature + inputs)
TTL = 3600 seconds (configurable)
Max entries = 500 (auto-evicts oldest)
```

Saves API costs and latency for repeated requests.

### 6. Context Window Management

Chat history is trimmed to last 8 messages before sending to the LLM:
```python
trimmed_history = req.history[-8:]
```

For Claude multi-turn, history is formatted as proper `messages` array.
For Gemini, history is serialized as context text.

### 7. Student Learning Profile

Every AI call gets personalized context injected:
```json
{
  "player_name": "Alex",
  "level": 4,
  "weak_topics": ["recursion", "two_pointer"],
  "strong_topics": ["variables", "loops"],
  "avg_attempts": 2.3,
  "hint_usage_rate": 0.4,
  "streak": 5
}
```

This makes hints actually relevant to the student — not generic.

### 8. Spaced Repetition System (SRS)

Problems come back for review based on the forgetting curve:
- Day 1 → Day 3 → Day 7 → Day 14 → Day 30

Implemented in `gameStore.js` with `srsSchedule` state.

### 9. Feynman Technique (Teach Byte)

Student explains a concept → Gemini evaluates accuracy → follows up:
```
Student: "A hash map stores key-value pairs..."
Gemini:  accuracy=85%, missed="collision handling"
         follow_up: "What happens when two keys hash to the same bucket?"
```

### 10. Interview Readiness Scoring

Claude analyzes full learning history and returns:
- Score 0-100 with breakdown
- Honest assessment paragraph
- Weeks to interview readiness
- Specific weak areas to address

---

## 📡 API Endpoints

```
POST /ai/hint              Contextual hint (Gemini → Claude fallback)
POST /ai/review            Deep code review (Claude)
POST /ai/explain-error     Plain-English error explanation (Claude)
POST /ai/complexity        Time/space analysis (Gemini)
POST /ai/chat              Streaming mentor chat (SSE, Gemini)
POST /ai/teach-byte        Feynman evaluation (Gemini)
POST /ai/interview         Mock interview turn (Claude)
POST /ai/readiness         Interview readiness score (Claude)
POST /ai/compare           Solution comparison (Gemini)
GET  /ai/meta              Model routing + cache stats

POST /code/run             Execute Python safely (subprocess)
POST /progress/save        Save player progress (JSON file)
GET  /progress/load/{id}   Load player progress
DELETE /progress/reset/{id} Reset progress

GET  /                     API info
GET  /health               Health check
GET  /docs                 Swagger UI
```

---

## 🎨 Design System

**Typography:**
- Headlines: `Fraunces` (quirky serif — editorial, distinctive)
- Body/UI: `Inter` (clean, readable)
- Code: `JetBrains Mono`

**Palette:**
- Base: `#F7F3EE` (warm parchment)
- Text: `#1A1A1A` (ink black)
- Accent: `#D4542A` (burnt orange)
- Secondary: `#3B6EA5` (slate blue)
- Code bg: `#1E2030` (dark only in editor)

---

## 📚 Curriculum Structure

```
Phase 1 — Foundations (Week 1-2)
  Ch 1: Python Basics
  Ch 2: Control Flow
  Ch 3: Loops

Phase 2 — Functions & Collections (Week 3-4)
  Ch 4: Functions
  Ch 5: Lists & Arrays
  Ch 6: Strings Deep Dive

Phase 3 — Data Structures (Month 2)
  Ch 7:  Hashing & Dictionaries
  Ch 8:  Stack & Queue
  Ch 9:  Linked Lists
  Ch 10: Recursion & Backtracking

Phase 4 — Algorithms (Month 3)
  Ch 11: Sorting Algorithms
  Ch 12: Binary Search
  Ch 13: Two Pointers & Sliding Window
  Ch 14: Greedy Algorithms

Phase 5 — Advanced DSA (Month 4)
  Ch 15: Trees & BST
  Ch 16: Graphs (BFS/DFS)
  Ch 17: Heaps & Priority Queues
  Ch 18: Dynamic Programming

Phase 6 — Interview Galaxy
  30 Interview Patterns
  Company Dungeons (TCS/Infosys/Amazon/Google)
  AI Mock Interviews (Claude as interviewer)
  LeetCode Problem Mapping
  Interview Readiness Score
```

---

## 🔑 Getting API Keys

**Anthropic (Claude):**
1. Go to https://console.anthropic.com
2. Create API key
3. Add to `.env` as `ANTHROPIC_API_KEY`

**Google (Gemini):**
1. Go to https://aistudio.google.com
2. Get API key
3. Add to `.env` as `GEMINI_API_KEY`

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend framework | FastAPI |
| LLM (code/review/interview) | Anthropic Claude Sonnet 4 |
| LLM (chat/hints/fast) | Google Gemini 2.0 Flash |
| Streaming | Server-Sent Events (SSE) |
| Code execution | Python subprocess (sandboxed) |
| Schema validation | Pydantic v2 |
| Frontend | React 19 + Vite 8 |
| State management | Zustand (with localStorage persistence) |
| Fonts | Fraunces + Inter + JetBrains Mono |
| Progress storage | JSON files (backend) + localStorage (frontend) |

---

## 💡 Portfolio Talking Points

When explaining this project in interviews:

1. **"I implemented multi-model orchestration"** — different LLMs for different tasks based on their strengths, with fallback chains

2. **"Prompt engineering is versioned"** — prompts live as template files, not hardcoded strings, enabling A/B testing without code deploys

3. **"Structured outputs with retry logic"** — all AI responses are typed with Pydantic, with automatic retry on JSON parse failure

4. **"SSE streaming for real UX"** — not simulated typing, actual token-by-token streaming from the API

5. **"Context injection for personalization"** — every AI call gets the student's learning profile injected, making responses genuinely personalized

6. **"Cost optimization"** — caching identical requests, routing cheap tasks to Gemini Flash, expensive reasoning to Claude

---

## 📁 Key Files to Know

```
backend/services/llm_router.py      Multi-model routing + cache + fallback
backend/services/prompt_manager.py  Versioned prompt loading
backend/prompts/                    All prompt templates
backend/routers/ai.py               All AI endpoints
backend/services/code_runner.py     Safe Python execution

frontend/src/api/client.js          All API calls + SSE streaming
frontend/src/components/AIPanel.jsx Hint/Review/Explain/Complexity UI
frontend/src/components/ByteChat.jsx Streaming chat with Gemini
frontend/src/store/gameStore.js     Full game state + SRS + achievements
frontend/src/data/content.js        6 phases, 18 chapters, all problems
```
