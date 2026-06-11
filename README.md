# CodeTale by Mahek 💻

AI-powered gamified coding practice platform with DSA problems, code execution, AI hints, code review, complexity analysis, mock interviews, and ByteChat mentor support.

---

## What is CodeTale?

CodeTale is a coding practice platform designed to make DSA learning less scary, more guided, and more interactive.

Instead of only showing a problem and expecting the user to solve it alone, CodeTale gives AI-powered support through hints, explanations, code review, complexity analysis, error explanation, and mock interview preparation.

The project is built for learners who want to practice coding step by step while understanding the logic behind the solution.

---

## Why this project?

Many beginners understand the meaning of a DSA problem but struggle with:

* how to start
* how to build logic
* how to dry run
* how to debug errors
* how to improve code
* how to explain their approach in interviews

CodeTale was created to solve this problem by combining coding practice with AI mentoring.

The goal was not just to create another coding platform, but to build a learning environment where users can practice, get guided hints, understand mistakes, and improve like they are learning with a mentor.

---

## Features

### 🧩 Gamified DSA Practice

* Structured coding problems
* Beginner-friendly practice flow
* Problem page with coding workspace
* Progress-focused learning experience

### 🧠 AI Hints

* Step-by-step hints without directly giving away the full solution
* Helps users think through the problem logically
* Useful for learners who get stuck while building an approach

### 🔍 AI Code Review

* Reviews submitted code
* Suggests improvements
* Explains what can be optimized
* Helps users write cleaner and better code

### ⏱️ Complexity Analysis

* AI-based time and space complexity explanation
* Helps users understand performance
* Useful for interview preparation

### 🐞 Error Explanation

* Explains coding errors in simple language
* Helps users understand what went wrong
* Reduces confusion during debugging

### 🎙️ Mock Interview Support

* AI-generated interview-style questions
* Helps users practice explaining logic
* Useful for coding round and technical interview preparation

### 🤖 ByteChat Mentor

* AI mentor chat for coding doubts
* Helps with DSA concepts, logic building, and problem-solving guidance
* Designed as a friendly coding companion

---

## Tech Stack

| Layer              | Technology                  |
| ------------------ | --------------------------- |
| Frontend           | React.js, Vite, CSS         |
| Backend            | Python, FastAPI             |
| AI Models          | Claude, Gemini              |
| AI Integration     | Anthropic API, Google GenAI |
| API Testing        | REST APIs                   |
| Package Management | npm, pip                    |
| Version Control    | Git, GitHub                 |

---

## AI Architecture

```text
User Problem / Code / Doubt
        ↓
React Frontend
        ↓
FastAPI Backend
        ↓
AI Router
        ↓
Claude / Gemini API
        ↓
AI Response
        ↓
Hint | Review | Error Explanation | Complexity | Interview Support | ByteChat
```

---

## Project Structure

```text
codetale-v3/
├── backend/
│   ├── main.py
│   ├── config.py
│   ├── requirements.txt
│   ├── models/
│   │   └── schemas.py
│   ├── routers/
│   │   ├── ai.py
│   │   ├── code.py
│   │   └── progress.py
│   ├── services/
│   │   ├── claude_service.py
│   │   ├── gemini_service.py
│   │   ├── llm_router.py
│   │   ├── code_runner.py
│   │   └── prompt_manager.py
│   └── prompts/
│       ├── hint_v1.txt
│       ├── hint_v2.txt
│       ├── code_review_v1.txt
│       ├── complexity_v1.txt
│       ├── error_explain_v1.txt
│       ├── mock_interview_v1.txt
│       └── byte_chat_v1.txt
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── api/
│       │   └── client.js
│       ├── components/
│       │   ├── AIPanel.jsx
│       │   ├── ByteChat.jsx
│       │   └── UI.jsx
│       ├── pages/
│       │   ├── Landing.jsx
│       │   └── ProblemPage.jsx
│       ├── store/
│       │   └── gameStore.js
│       └── data/
│           └── content.js
│
├── README.md
├── .gitignore
└── start.sh
```

---

## What This Demonstrates

* AI-powered coding assistant development
* FastAPI backend development
* React and Vite frontend development
* Claude and Gemini API integration
* Prompt engineering for coding support
* Multi-model AI routing
* Code execution and review flow
* REST API design
* Frontend-backend integration
* GitHub-safe environment variable handling

---

## Purpose

CodeTale was built as a practice-focused AI coding platform to help learners improve their problem-solving confidence.

This project helped me explore GenAI engineering through AI API integration, prompt design, multi-model routing, backend logic, structured AI responses, and user-focused learning features.

The main goal was to make coding practice feel less intimidating and more guided for beginners who struggle with DSA logic building.

---

## Author

Mahek Khan


