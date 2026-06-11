import { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/gameStore';
import { runCode, compareSolutions } from '../api/client';
import { TopNav, DiffBadge, ModelBadge, Spinner, XPPopup } from '../components/UI';
import AIPanel from '../components/AIPanel';
import ByteChat from '../components/ByteChat';

export default function ProblemPage() {
  const { currentProblem, currentChapter, go, completeProblem, completeChapter,
    incrementAttempts, addXP, getStreakMultiplier, completedProblems } = useStore();

  const isProblemCompleted = (id) => completedProblems.includes(id);

  const prob = currentProblem;
  const isBoss = prob?.isBoss;

  const [code, setCode] = useState('');
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [rightPanel, setRightPanel] = useState('ai');  // 'ai' | 'chat'
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareData, setCompareData] = useState(null);
  const [compareError, setCompareError] = useState('');
  const [xpPopups, setXpPopups] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerStarted, setTimerStarted] = useState(false);
  const [storyMode, setStoryMode] = useState(true);
  const [showSolution, setShowSolution] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const solveStartRef = useRef(Date.now());
  const timerRef = useRef(null);

  useEffect(() => {
    if (!prob) return;
    setCode(prob.starter || '# Write your solution here\n\n');
    if (isBoss) setTimeLeft(prob.timeLimit || 300);
    setIsCorrect(null);
    setRunResult(null);
    setAttempts(0);
    solveStartRef.current = Date.now();
  }, [prob?.id]);

  useEffect(() => {
    if (!timerStarted || !isBoss) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timerStarted]);

  if (!prob) { go('chapter'); return null; }

  const alreadySolved = isProblemCompleted?.(prob.id);
  const multiplier = getStreakMultiplier();

  const handleRun = async () => {
    if (!code.trim() || running) return;
    setRunning(true);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    if (!isBoss) incrementAttempts(prob.id);

    try {
      const result = await runCode(code, 'problem-page');
      const stdout = (result.stdout || '').trim();
      const expected = (prob.expected || '').trim();

      // Check correctness
      const correct = !result.error && !result.timed_out && stdout === expected;
      setIsCorrect(correct);
      setRunResult({ ...result, correct });

      if (correct) {
        const solveTime = (Date.now() - solveStartRef.current) / 1000;
        const earnedXP = Math.round((prob.xp || 100) * multiplier);
        completeProblem(prob.id, { usedHints: hintUsed, solveTime });
        addXP(earnedXP);

        // XP popup
        const id = Date.now();
        setXpPopups(p => [...p, { id, amount: earnedXP, x: window.innerWidth / 2, y: 200 }]);
        setTimeout(() => setXpPopups(p => p.filter(pp => pp.id !== id)), 1400);

        if (isBoss) {
          clearInterval(timerRef.current);
          if (currentChapter) {
            completeChapter(currentChapter.id, currentChapter.nextChapter);
          }
        }
      }
    } catch (e) {
      setRunResult({ error: e.message, stdout: '', stderr: '', correct: false, timed_out: false, execution_time_ms: 0 });
      setIsCorrect(false);
    }
    setRunning(false);
  };

  const handleCompare = async () => {
    setCompareLoading(true);
    setCompareError('');
    setShowCompareModal(true);
    try {
      const res = await compareSolutions({
        problem_title: prob.title,
        student_code: code,
        optimal_solution: prob.solution,
      });
      setCompareData(res);
    } catch (e) {
      setCompareError(e.message || 'Failed to compare solutions');
    }
    setCompareLoading(false);
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleRun(); }
    if (e.key === 'Tab') {
      e.preventDefault();
      const s = e.target.selectionStart;
      const newCode = code.substring(0, s) + '    ' + code.substring(s);
      setCode(newCode);
      setTimeout(() => e.target.setSelectionRange(s + 4, s + 4), 0);
    }
  };

  const mins = Math.floor((timeLeft || 0) / 60);
  const secs = String((timeLeft || 0) % 60).padStart(2, '0');
  const timerWarning = timeLeft !== null && timeLeft < 60;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--parchment)' }}>
      {/* XP popups */}
      {xpPopups.map(p => (
        <XPPopup key={p.id} amount={p.amount} x={p.x} y={p.y} onDone={() => setXpPopups(pp => pp.filter(x => x.id !== p.id))} />
      ))}

      {/* Top bar */}
      <div style={{
        height: 52, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center',
        padding: '0 16px', gap: 12, background: 'var(--white)', flexShrink: 0,
      }}>
        <button onClick={() => { clearInterval(timerRef.current); go('chapter'); }} className="btn btn-ghost btn-sm">
          ← Back
        </button>
        <div style={{ height: 20, width: 1, background: 'var(--border)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
          {isBoss && <span>🐉</span>}
          <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {prob.title}
          </span>
          {!isBoss && <DiffBadge difficulty={prob.difficulty} />}
          {isBoss && <span className="badge badge-hard">BOSS</span>}
          {prob.leetcodeNum && (
            <a href={prob.leetcodeLink} target="_blank" rel="noreferrer" className="badge badge-orange">
              LC #{prob.leetcodeNum}
            </a>
          )}
          {alreadySolved && <span className="badge badge-easy">✓ Solved</span>}
        </div>

        {/* Boss timer */}
        {isBoss && (
          <div style={{
            fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1rem',
            color: timerWarning ? 'var(--red)' : 'var(--ink)',
            background: timerWarning ? 'var(--red-lt)' : 'var(--parchment)',
            border: `1px solid ${timerWarning ? '#F5C6C2' : 'var(--border)'}`,
            borderRadius: 8, padding: '4px 12px',
          }}>
            ⏱ {mins}:{secs}
          </div>
        )}
        {isBoss && !timerStarted && (
          <button onClick={() => setTimerStarted(true)} className="btn btn-accent btn-sm">
            ⚔️ Start
          </button>
        )}

        <span style={{ color: 'var(--amber)', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
          +{Math.round((prob.xp || 100) * multiplier)} XP{multiplier > 1 ? ` (${multiplier}×)` : ''}
        </span>

        {/* Right panel toggle */}
        <div style={{ display: 'flex', background: 'var(--parchment)', borderRadius: 8, padding: 3, gap: 3 }}>
          {['ai', 'chat'].map(p => (
            <button key={p} onClick={() => setRightPanel(p)} style={{
              padding: '4px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
              background: rightPanel === p ? 'var(--white)' : 'transparent',
              color: rightPanel === p ? 'var(--ink)' : 'var(--ink4)',
              boxShadow: rightPanel === p ? 'var(--shadow-xs)' : 'none',
              transition: 'all 0.15s',
            }}>
              {p === 'ai' ? '🤖 AI Panel' : '💬 Byte Chat'}
            </button>
          ))}
        </div>
      </div>

      {/* Main 3-col layout */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '380px 1fr 340px', overflow: 'hidden' }}>

        {/* LEFT: Problem description */}
        <div style={{ borderRight: '1px solid var(--border)', overflow: 'auto', background: 'var(--white)' }}>
          <div style={{ padding: '20px' }}>
            {/* Story / Real toggle */}
            {!isBoss && (
              <div style={{ display: 'flex', background: 'var(--parchment)', borderRadius: 10, padding: 3, gap: 3, marginBottom: 16 }}>
                {[['📖 Story', true], ['📐 Real', false]].map(([label, sm]) => (
                  <button key={label} onClick={() => setStoryMode(sm)} style={{
                    flex: 1, padding: '6px', border: 'none', borderRadius: 8, cursor: 'pointer',
                    background: storyMode === sm ? 'var(--white)' : 'transparent',
                    color: storyMode === sm ? 'var(--ink)' : 'var(--ink4)',
                    fontSize: '0.82rem', fontWeight: 600,
                    boxShadow: storyMode === sm ? 'var(--shadow-xs)' : 'none',
                    transition: 'all 0.15s',
                  }}>{label}</button>
                ))}
              </div>
            )}

            <pre style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', color: 'var(--ink2)', lineHeight: 1.8, whiteSpace: 'pre-wrap', marginBottom: 20 }}>
              {isBoss ? prob.story : (storyMode ? prob.story : prob.real)}
            </pre>

            {prob.pattern && (
              <span className="badge badge-blue" style={{ marginBottom: 12, display: 'inline-flex' }}>
                Pattern: {prob.pattern}
              </span>
            )}

            {/* Traps */}
            {prob.traps?.length > 0 && (
              <div style={{ background: 'var(--amber-lt)', border: '1px solid #E6C96A', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>⚠️ Watch out for</div>
                {prob.traps.map((t, i) => <div key={i} style={{ fontSize: '0.83rem', color: 'var(--ink2)', marginBottom: 3 }}>• {t}</div>)}
              </div>
            )}

            {/* Run result */}
            {runResult && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ink4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                  Expected Output
                </div>
                <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', background: 'var(--parchment)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', color: 'var(--ink2)', overflow: 'auto' }}>
                  {prob.expected}
                </pre>
              </div>
            )}

            {/* Solution viewer (after 3 failed attempts) */}
            {attempts >= 3 && isCorrect === false && !showSolution && (
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <button onClick={() => setShowSolution(true)} className="btn btn-outline btn-sm">
                  Show Solution
                </button>
              </div>
            )}
            {showSolution && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ink4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Solution</div>
                <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', background: 'var(--code-bg)', color: 'var(--code-text)', borderRadius: 10, padding: '14px', overflow: 'auto' }}>
                  {prob.solution}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* MIDDLE: Editor + output */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: '1px solid var(--border)' }}>
          {/* Editor toolbar */}
          <div style={{
            padding: '8px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10,
            background: '#1E2030', flexShrink: 0,
          }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {['#FF5F57', '#FFBD2E', '#28C840'].map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#6C7086' }}>solution.py</span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button onClick={() => setCode(prob.starter || '')} style={{
                background: 'transparent', border: '1px solid #313244', borderRadius: 6, padding: '3px 10px',
                color: '#6C7086', cursor: 'pointer', fontSize: '0.72rem', fontFamily: 'var(--font-mono)',
              }}>Reset</button>
            </div>
          </div>

          {/* Code area */}
          <textarea
            className="code-editor"
            value={code}
            onChange={e => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ flex: 1, borderRadius: 0, border: 'none', borderBottom: '1px solid #313244', resize: 'none', minHeight: 0 }}
          />

          {/* Output area */}
          <div style={{ flexShrink: 0, background: '#11131D' }}>
            <div style={{
              padding: '8px 16px', borderBottom: '1px solid #313244', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#6C7086', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Output</span>
              {runResult && (
                <>
                  {isCorrect ? (
                    <span style={{ background: '#1A3A2A', color: '#2ECC71', border: '1px solid #2ECC7144', borderRadius: 6, padding: '1px 8px', fontSize: '0.7rem', fontWeight: 700 }}>✓ Correct</span>
                  ) : (
                    <span style={{ background: '#3A1A1A', color: '#E74C3C', border: '1px solid #E74C3C44', borderRadius: 6, padding: '1px 8px', fontSize: '0.7rem', fontWeight: 700 }}>✗ Wrong</span>
                  )}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#6C7086', marginLeft: 4 }}>
                    {runResult.execution_time_ms}ms
                  </span>
                </>
              )}
            </div>
            <div className={`output-box ${runResult?.stderr || runResult?.error ? 'error' : ''} ${isCorrect ? 'correct' : ''}`}
              style={{ borderRadius: 0, border: 'none', minHeight: 80, maxHeight: 150, overflow: 'auto' }}>
              {running ? 'Running...' :
                runResult ? (runResult.stdout || runResult.stderr || runResult.error || 'No output') :
                  'Press Ctrl+Enter or Run to execute your code'}
            </div>
          </div>

          {/* Run button */}
          <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', background: 'var(--white)', display: 'flex', gap: 8, flexShrink: 0 }}>
            <button onClick={handleRun} disabled={running || !code.trim() || (isBoss && !timerStarted)}
              className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', gap: 8 }}>
              {running ? <Spinner size={14} color="var(--white)" /> : null}
              {running ? 'Running...' : isCorrect ? '✓ Correct — Run Again' : '▶ Run Code'}
              <span style={{ fontSize: '0.72rem', opacity: 0.6 }}>⌘↵</span>
            </button>
            {isCorrect && (
              <button onClick={handleCompare} className="btn btn-outline btn-sm" style={{ gap: 6, whiteSpace: 'nowrap' }}>
                🔍 Compare
              </button>
            )}
            {isCorrect && (
              <button onClick={() => go('chapter')} className="btn btn-accent" style={{ gap: 6 }}>
                Next →
              </button>
            )}
          </div>
        </div>

        {/* RIGHT: AI Panel or Byte Chat */}
        <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {rightPanel === 'ai' ? (
            <AIPanel
              problem={prob}
              code={code}
              output={runResult?.stdout || ''}
              runResult={runResult}
              onHintUsed={() => setHintUsed(true)}
            />
          ) : (
            <ByteChat
              currentChapter={currentChapter?.title || ''}
              currentProblem={prob.title}
            />
          )}
        </div>
      </div>

      {/* ── Compare Solutions Modal ─────────────────────────── */}
      {showCompareModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(10,10,20,0.72)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }} onClick={(e) => { if (e.target === e.currentTarget) setShowCompareModal(false); }}>
          <div style={{
            background: 'var(--white)', borderRadius: 20, width: '100%', maxWidth: 780,
            maxHeight: '88vh', overflow: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.35)',
            border: '1px solid var(--border)',
          }}>
            {/* Modal header */}
            <div style={{
              padding: '20px 24px', borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'var(--parchment)', borderRadius: '20px 20px 0 0',
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--ink)' }}>
                  🔍 Solution Comparison
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--ink4)', marginTop: 2 }}>
                  Your approach vs. the optimal solution
                </div>
              </div>
              <button onClick={() => setShowCompareModal(false)} style={{
                background: 'var(--border)', border: 'none', borderRadius: '50%',
                width: 32, height: 32, cursor: 'pointer', fontSize: '1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--ink3)',
              }}>✕</button>
            </div>

            <div style={{ padding: '24px' }}>
              {compareLoading && (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <Spinner size={32} color="var(--accent)" />
                  <p style={{ color: 'var(--ink3)', marginTop: 16, fontSize: '0.9rem' }}>
                    Byte is analyzing your solution...
                  </p>
                </div>
              )}

              {compareError && !compareLoading && (
                <div style={{ background: 'var(--red-lt)', border: '1px solid #F5C6C2', borderRadius: 12, padding: '16px 20px', color: 'var(--red)' }}>
                  ⚠️ {compareError}
                </div>
              )}

              {compareData && !compareLoading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Similarity score */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
                      background: 'var(--parchment)', borderRadius: 16, padding: '20px 36px',
                      border: '1px solid var(--border)',
                    }}>
                      <div style={{
                        fontSize: '2.8rem', fontFamily: 'var(--font-serif)', fontWeight: 700,
                        color: (compareData.similarity_score ?? 0) >= 80 ? 'var(--green)'
                          : (compareData.similarity_score ?? 0) >= 50 ? 'var(--amber)' : 'var(--accent)',
                      }}>
                        {compareData.similarity_score ?? '—'}%
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--ink4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Similarity Score
                      </div>
                      {/* Score bar */}
                      <div style={{ width: 180, height: 6, background: 'var(--border)', borderRadius: 3, marginTop: 12, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', borderRadius: 3, transition: 'width 0.8s ease',
                          width: `${compareData.similarity_score ?? 0}%`,
                          background: (compareData.similarity_score ?? 0) >= 80 ? 'var(--green)'
                            : (compareData.similarity_score ?? 0) >= 50 ? 'var(--amber)' : 'var(--accent)',
                        }} />
                      </div>
                    </div>
                  </div>

                  {/* Side-by-side approach */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div style={{ background: 'var(--parchment)', borderRadius: 14, padding: '18px', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                        👤 Your Approach
                      </div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--ink2)', lineHeight: 1.7, margin: 0 }}>
                        {compareData.your_approach || 'N/A'}
                      </p>
                    </div>
                    <div style={{ background: '#F0FFF6', borderRadius: 14, padding: '18px', border: '1px solid #C3E6D0' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                        ⚡ Optimal Approach
                      </div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--ink2)', lineHeight: 1.7, margin: 0 }}>
                        {compareData.optimal_approach || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Key differences */}
                  {compareData.key_differences?.length > 0 && (
                    <div style={{ background: 'var(--parchment)', borderRadius: 14, padding: '18px 20px', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                        🔑 Key Differences
                      </div>
                      {compareData.key_differences.map((d, i) => (
                        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
                          <span style={{ color: 'var(--amber)', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>•</span>
                          <span style={{ fontSize: '0.88rem', color: 'var(--ink2)', lineHeight: 1.6 }}>{d}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* What to learn */}
                  {compareData.what_to_learn && (
                    <div style={{
                      background: 'linear-gradient(135deg, #FFF8EC 0%, #FFF3D6 100%)',
                      borderRadius: 14, padding: '20px', border: '1px solid #E6C96A',
                    }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                        🎓 What to Learn
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--ink)', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
                        {compareData.what_to_learn}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
