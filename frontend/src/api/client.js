/**
 * CodeTale API Client
 * All communication with FastAPI backend.
 * Demonstrates: proper error handling, request typing, SSE streaming.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ── Core fetch wrapper ────────────────────────────────────
async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `API error ${res.status}`);
  }
  return res.json();
}

// ── Code Execution ────────────────────────────────────────
export const runCode = (code, sessionId = 'anon') =>
  apiFetch('/code/run', {
    method: 'POST',
    body: JSON.stringify({ code, session_id: sessionId, timeout: 5 }),
  });

// ── AI: Hint ─────────────────────────────────────────────
export const getHint = (payload) =>
  apiFetch('/ai/hint', { method: 'POST', body: JSON.stringify(payload) });

// ── AI: Code Review ───────────────────────────────────────
export const reviewCode = (payload) =>
  apiFetch('/ai/review', { method: 'POST', body: JSON.stringify(payload) });

// ── AI: Error Explanation ─────────────────────────────────
export const explainError = (payload) =>
  apiFetch('/ai/explain-error', { method: 'POST', body: JSON.stringify(payload) });

// ── AI: Complexity ────────────────────────────────────────
export const analyzeComplexity = (payload) =>
  apiFetch('/ai/complexity', { method: 'POST', body: JSON.stringify(payload) });

// ── AI: Teach Byte ────────────────────────────────────────
export const teachByte = (payload) =>
  apiFetch('/ai/teach-byte', { method: 'POST', body: JSON.stringify(payload) });

// ── AI: Mock Interview ────────────────────────────────────
export const interviewTurn = (payload) =>
  apiFetch('/ai/interview', { method: 'POST', body: JSON.stringify(payload) });

// ── AI: Readiness Score ───────────────────────────────────
export const getReadinessScore = (payload) =>
  apiFetch('/ai/readiness', { method: 'POST', body: JSON.stringify(payload) });

// ── AI: Compare Solutions ─────────────────────────────────
export const compareSolutions = (payload) =>
  apiFetch('/ai/compare', { method: 'POST', body: JSON.stringify(payload) });

// ── AI: Chat (SSE Streaming) ──────────────────────────────
/**
 * Streams Byte's chat response token by token via Server-Sent Events.
 * onChunk: called with each text chunk as it arrives
 * onDone: called when stream completes
 * Returns: abort controller (call .abort() to cancel)
 */
export function streamChat(payload, onChunk, onDone, onError) {
  const controller = new AbortController();

  fetch(`${BASE_URL}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: controller.signal,
  }).then(async (res) => {
    if (!res.ok) throw new Error(`Stream error ${res.status}`);
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep incomplete line

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') { onDone?.(); return; }
        try {
          const parsed = JSON.parse(data);
          if (parsed.text) onChunk(parsed.text);
          if (parsed.error) onError?.(parsed.error);
        } catch {}
      }
    }
    onDone?.();
  }).catch((err) => {
    if (err.name !== 'AbortError') onError?.(err.message);
  });

  return controller;
}

// ── Progress ──────────────────────────────────────────────
export const saveProgress = (sessionId, data) =>
  apiFetch('/progress/save', {
    method: 'POST',
    body: JSON.stringify({ session_id: sessionId, data }),
  });

export const loadProgress = (sessionId) =>
  apiFetch(`/progress/load/${sessionId}`);

// ── Meta ──────────────────────────────────────────────────
export const getAIMeta = () => apiFetch('/ai/meta');
export const checkHealth = () => apiFetch('/health');
