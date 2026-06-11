#!/bin/bash
echo "=== CodeTale v3 — Quick Start ==="
echo ""

# Backend
echo "Starting backend on :8000 ..."
cd backend
if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "⚠️  Created .env — add your API keys before using AI features!"
fi
python -m venv venv 2>/dev/null || true
source venv/bin/activate 2>/dev/null || venv\Scripts\activate 2>/dev/null
pip install -r requirements.txt -q
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

echo "Starting frontend on :5173 ..."
cd frontend
npm install -q
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ CodeTale v3 running!"
echo "   Frontend: http://localhost:5173"
echo "   API docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop."
wait
