import { useState } from 'react';
import { getHint, reviewCode, explainError, analyzeComplexity, teachByte } from '../api/client';
import { useStore } from '../store/gameStore';
import { ModelBadge, Spinner } from './UI';

export default function AIPanel({ problem, code, output, runResult, onHintUsed }) {
  const [tab, setTab] = useState('hint');
  const [loading, setLoading] = useState(false);
  const [hintLevel, setHintLevel] = useState(1);
  const [hintResult, setHintResult] = useState(null);
  const [reviewResult, setReviewResult] = useState(null);
  const [explainResult, setExplainResult] = useState(null);
  const [complexityResult, setComplexityResult] = useState(null);
  const [teachInput, setTeachInput] = useState('');
  const [teachResult, setTeachResult] = useState(null);
  const { getLearningProfile, useHint: markHintUsed, incrementTeachByte } = useStore();

  const profile = getLearningProfile();

  // ── Hint ─────────────────────────────────────────────────
  const fetchHint = async () => {
    if (!problem) return;
    setLoading(true);
    try {
      const res = await getHint({
        problem_id: problem.id,
        problem_title: problem.title,
        problem_description: problem.story,
        student_code: code,
        attempts: profile.completed_problems.length,
        hint_level: hintLevel,
        session_id: profile.session_id,
        profile,
      });
      setHintResult(res);
      markHintUsed(problem.id);
      onHintUsed?.();
      if (hintLevel < 3) setHintLevel(l => l + 1);
    } catch (e) {
      setHintResult({ hint_text: `Couldn't load hint: ${e.message}`, encouragement: '', follow_up_question: '', model_used: 'error' });
    }
    setLoading(false);
  };

  // ── Code Review ───────────────────────────────────────────
  const fetchReview = async () => {
    if (!problem || !code) return;
    setLoading(true);
    try {
      const res = await reviewCode({
        problem_id: problem.id,
        problem_title: problem.title,
        student_code: code,
        expected_output: problem.expected || '',
        actual_output: output || '',
        is_correct: runResult?.correct || false,
        session_id: profile.session_id,
        profile,
      });
      setReviewResult(res);
    } catch (e) {
      setReviewResult({ error: e.message });
    }
    setLoading(false);
  };

  // ── Error Explanation ─────────────────────────────────────
  const fetchExplain = async () => {
    if (!runResult?.stderr && !runResult?.error) return;
    setLoading(true);
    try {
      const res = await explainError({
        code,
        error_message: runResult.stderr || runResult.error || '',
        problem_context: problem?.title || '',
        session_id: profile.session_id,
      });
      setExplainResult(res);
    } catch (e) {
      setExplainResult({ error: e.message });
    }
    setLoading(false);
  };

  // ── Complexity ────────────────────────────────────────────
  const fetchComplexity = async () => {
    if (!code) return;
    setLoading(true);
    try {
      const res = await analyzeComplexity({
        code,
        problem_title: problem?.title || '',
        session_id: profile.session_id,
      });
      setComplexityResult(res);
    } catch (e) {
      setComplexityResult({ error: e.message });
    }
    setLoading(false);
  };

  // ── Teach Byte ────────────────────────────────────────────
  const fetchTeach = async () => {
    if (!teachInput.trim() || !problem) return;
    setLoading(true);
    try {
      const res = await teachByte({
        concept: problem.pattern || problem.title,
        student_explanation: teachInput,
        session_id: profile.session_id,
        profile,
      });
      setTeachResult(res);
      incrementTeachByte();
    } catch (e) {
      setTeachResult({ error: e.message });
    }
    setLoading(false);
  };

  const tabs = [
    { id: 'hint', label: '💡 Hint', badge: hintLevel > 1 ? `L${hintLevel}` : null },
    { id: 'review', label: '📋 Review' },
    { id: 'explain', label: '🔍 Explain Error', disabled: !runResult?.stderr && !runResult?.error },
    { id: 'complexity', label: '⏱ Complexity' },
    { id: 'teach', label: '🎓 Teach Byte' },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--white)' }}>
      {/* Tab nav */}
      <div style={{ borderBottom: '1px solid var(--border)', overflowX: 'auto', flexShrink: 0 }}>
        <div style={{ display: 'flex', padding: '0 4px' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => !t.disabled && setTab(t.id)} style={{
              padding: '10px 14px', border: 'none', cursor: t.disabled ? 'not-allowed' : 'pointer',
              background: 'none', borderBottom: `2px solid ${tab === t.id ? 'var(--ink)' : 'transparent'}`,
              color: t.disabled ? 'var(--ink5)' : tab === t.id ? 'var(--ink)' : 'var(--ink3)',
              fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: tab === t.id ? 600 : 400,
              whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 5,
              marginBottom: -1, transition: 'all 0.15s',
            }}>
              {t.label}
              {t.badge && <span style={{ background: 'var(--accent-lt)', color: 'var(--accent-dk)', borderRadius: 4, padding: '1px 5px', fontSize: '0.65rem', fontWeight: 700 }}>{t.badge}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Panel body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>

        {/* ── HINT ── */}
        {tab === 'hint' && (
          <div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--ink3)', marginBottom: 10 }}>
                Byte gives contextual hints based on your code. More attempts → more specific hints.
              </p>
              <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                {[1, 2, 3].map(l => (
                  <button key={l} onClick={() => setHintLevel(l)} style={{
                    padding: '5px 14px', borderRadius: 8, border: `1px solid ${hintLevel === l ? 'var(--ink)' : 'var(--border)'}`,
                    background: hintLevel === l ? 'var(--ink)' : 'transparent',
                    color: hintLevel === l ? 'var(--white)' : 'var(--ink3)',
                    fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                  }}>
                    {l === 1 ? '🌱 Gentle' : l === 2 ? '💡 Medium' : '🎯 Direct'}
                  </button>
                ))}
              </div>
              <button onClick={fetchHint} disabled={loading} className="btn btn-primary btn-sm" style={{ gap: 6 }}>
                {loading ? <Spinner size={13} color="var(--white)" /> : '✦ Gemini'}
                Get Hint
              </button>
            </div>

            {hintResult && (
              <div className="animate-fadeup">
                <div style={{ background: 'var(--parchment)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', marginBottom: 10 }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--ink4)', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hint Level {hintResult.hint_level}</div>
                  <p style={{ color: 'var(--ink)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 10 }}>{hintResult.hint_text}</p>
                  {hintResult.follow_up_question && (
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, color: 'var(--blue-dk)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                      🤔 {hintResult.follow_up_question}
                    </div>
                  )}
                </div>
                {hintResult.encouragement && (
                  <p style={{ color: 'var(--green)', fontSize: '0.82rem', fontStyle: 'italic' }}>💚 {hintResult.encouragement}</p>
                )}
                <div style={{ marginTop: 8 }}><ModelBadge model={hintResult.model_used} /></div>
              </div>
            )}
          </div>
        )}

        {/* ── REVIEW ── */}
        {tab === 'review' && (
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink3)', marginBottom: 12 }}>
              Deep code review — correctness, complexity, style, improvements.
            </p>
            <button onClick={fetchReview} disabled={loading || !code} className="btn btn-primary btn-sm" style={{ gap: 6, marginBottom: 14 }}>
              {loading ? <Spinner size={13} color="var(--white)" /> : '◆ Claude'}
              Review My Code
            </button>

            {reviewResult?.error && (
              <div style={{ color: 'var(--red)', fontSize: '0.85rem', background: 'var(--red-lt)', padding: '10px 14px', borderRadius: 10 }}>
                {reviewResult.error}
              </div>
            )}

            {reviewResult && !reviewResult.error && (
              <div className="animate-fadeup" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Score */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: reviewResult.overall_score >= 80 ? 'var(--green-lt)' : reviewResult.overall_score >= 60 ? 'var(--amber-lt)' : 'var(--red-lt)',
                    color: reviewResult.overall_score >= 80 ? 'var(--green)' : reviewResult.overall_score >= 60 ? 'var(--amber)' : 'var(--red)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.1rem',
                    border: `2px solid currentColor`, flexShrink: 0,
                  }}>
                    {reviewResult.overall_score}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--ink)' }}>Overall Score</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--ink3)' }}>{reviewResult.correctness}</div>
                  </div>
                </div>

                {/* Complexity */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ background: 'var(--blue-lt)', color: 'var(--blue-dk)', padding: '4px 10px', borderRadius: 8, fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    Time: {reviewResult.time_complexity}
                  </span>
                  <span style={{ background: 'var(--parchment2)', color: 'var(--ink2)', padding: '4px 10px', borderRadius: 8, fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    Space: {reviewResult.space_complexity}
                  </span>
                </div>

                {/* Strengths */}
                {reviewResult.what_you_did_well?.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>✓ Done well</div>
                    {reviewResult.what_you_did_well.map((s, i) => (
                      <div key={i} style={{ fontSize: '0.85rem', color: 'var(--ink2)', marginBottom: 3 }}>• {s}</div>
                    ))}
                  </div>
                )}

                {/* Improvements */}
                {reviewResult.improvements?.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-dk)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>↑ Improve</div>
                    {reviewResult.improvements.map((s, i) => (
                      <div key={i} style={{ fontSize: '0.85rem', color: 'var(--ink2)', marginBottom: 3 }}>• {s}</div>
                    ))}
                  </div>
                )}

                {reviewResult.optimized_approach && (
                  <div style={{ background: 'var(--blue-lt)', border: '1px solid #BBDEFB', borderRadius: 10, padding: '10px 14px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--blue-dk)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Better approach</div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--blue-dk)', lineHeight: 1.6 }}>{reviewResult.optimized_approach}</p>
                  </div>
                )}

                <ModelBadge model={reviewResult.model_used} />
              </div>
            )}
          </div>
        )}

        {/* ── EXPLAIN ERROR ── */}
        {tab === 'explain' && (
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink3)', marginBottom: 12 }}>
              Claude explains your error in plain English — what went wrong and how to fix it.
            </p>
            {runResult?.stderr || runResult?.error ? (
              <>
                <div style={{ background: 'var(--red-lt)', border: '1px solid #F5C6C2', borderRadius: 10, padding: '10px 14px', marginBottom: 12, fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--red)' }}>
                  {runResult.stderr || runResult.error}
                </div>
                <button onClick={fetchExplain} disabled={loading} className="btn btn-primary btn-sm" style={{ gap: 6, marginBottom: 14 }}>
                  {loading ? <Spinner size={13} color="var(--white)" /> : '◆ Claude'}
                  Explain This Error
                </button>
              </>
            ) : (
              <p style={{ color: 'var(--ink4)', fontSize: '0.85rem' }}>Run your code first to see error output here.</p>
            )}

            {explainResult && !explainResult.error && (
              <div className="animate-fadeup" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'What went wrong', content: explainResult.what_went_wrong, color: 'var(--red)' },
                  { label: 'Why it happened', content: explainResult.why_it_happened, color: 'var(--amber)' },
                  { label: 'How to fix', content: explainResult.how_to_fix, color: 'var(--green)' },
                ].map(({ label, content, color }) => (
                  <div key={label} style={{ background: 'var(--parchment)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{label}</div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--ink2)', lineHeight: 1.7 }}>{content}</p>
                  </div>
                ))}
                {explainResult.example_fix && (
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--blue-dk)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Example fix</div>
                    <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', background: 'var(--code-bg)', color: 'var(--code-text)', padding: '12px 14px', borderRadius: 10, overflowX: 'auto' }}>
                      {explainResult.example_fix}
                    </pre>
                  </div>
                )}
                <ModelBadge model={explainResult.model_used} />
              </div>
            )}
          </div>
        )}

        {/* ── COMPLEXITY ── */}
        {tab === 'complexity' && (
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink3)', marginBottom: 12 }}>
              Gemini analyzes your code's time and space complexity with explanation.
            </p>
            <button onClick={fetchComplexity} disabled={loading || !code} className="btn btn-primary btn-sm" style={{ gap: 6, marginBottom: 14 }}>
              {loading ? <Spinner size={13} color="var(--white)" /> : '✦ Gemini'}
              Analyze Complexity
            </button>

            {complexityResult && !complexityResult.error && (
              <div className="animate-fadeup" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div style={{ background: 'var(--blue-lt)', border: '1px solid #BBDEFB', borderRadius: 12, padding: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--blue-dk)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Time</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--blue-dk)' }}>{complexityResult.time_complexity}</div>
                  </div>
                  <div style={{ background: 'var(--parchment2)', border: '1px solid var(--border2)', borderRadius: 12, padding: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Space</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--ink)' }}>{complexityResult.space_complexity}</div>
                  </div>
                </div>

                <div style={{ background: 'var(--parchment)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px' }}>
                  <p style={{ fontSize: '0.88rem', color: 'var(--ink2)', lineHeight: 1.7 }}>{complexityResult.explanation}</p>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ background: 'var(--green-lt)', color: 'var(--green)', padding: '4px 10px', borderRadius: 8, fontSize: '0.78rem', fontWeight: 600 }}>
                    Best: {complexityResult.best_case}
                  </span>
                  <span style={{ background: 'var(--red-lt)', color: 'var(--red)', padding: '4px 10px', borderRadius: 8, fontSize: '0.78rem', fontWeight: 600 }}>
                    Worst: {complexityResult.worst_case}
                  </span>
                </div>

                {!complexityResult.is_optimal && complexityResult.optimal_hint && (
                  <div style={{ background: 'var(--accent-lt)', border: '1px solid #F5C6C2', borderRadius: 10, padding: '10px 14px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-dk)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Not optimal yet</div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--accent-dk)', lineHeight: 1.6 }}>{complexityResult.optimal_hint}</p>
                  </div>
                )}
                {complexityResult.is_optimal && (
                  <div style={{ color: 'var(--green)', fontSize: '0.85rem', fontWeight: 600 }}>✓ This is an optimal solution!</div>
                )}
                <ModelBadge model={complexityResult.model_used} />
              </div>
            )}
          </div>
        )}

        {/* ── TEACH BYTE ── */}
        {tab === 'teach' && (
          <div>
            <div style={{ background: 'var(--parchment)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px', marginBottom: 14 }}>
              <p style={{ fontSize: '0.88rem', color: 'var(--ink2)', lineHeight: 1.7 }}>
                <strong style={{ fontFamily: 'var(--font-serif)' }}>The Feynman Technique:</strong> Explain the concept to Byte in your own words. If you can teach it, you truly understand it.
              </p>
            </div>

            <div style={{ marginBottom: 8, fontSize: '0.82rem', color: 'var(--ink3)', fontWeight: 600 }}>
              Concept: <em style={{ color: 'var(--ink)' }}>{problem?.pattern || problem?.title}</em>
            </div>

            <textarea
              value={teachInput}
              onChange={e => setTeachInput(e.target.value)}
              placeholder={`Explain ${problem?.pattern || 'this concept'} in your own words. Pretend Byte has never heard of it...`}
              style={{
                width: '100%', minHeight: 100, padding: '10px 12px',
                fontFamily: 'var(--font-sans)', fontSize: '0.88rem',
                background: 'var(--parchment)', border: '1px solid var(--border2)',
                borderRadius: 10, color: 'var(--ink)', resize: 'vertical',
                lineHeight: 1.6, outline: 'none', marginBottom: 10,
              }}
            />
            <button onClick={fetchTeach} disabled={loading || !teachInput.trim()} className="btn btn-primary btn-sm" style={{ gap: 6 }}>
              {loading ? <Spinner size={13} color="var(--white)" /> : '✦ Gemini'}
              Teach Byte
            </button>

            {teachResult && !teachResult.error && (
              <div className="animate-fadeup" style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Score */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{
                    width: 50, height: 50, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1rem',
                    background: teachResult.accuracy_score >= 80 ? 'var(--green-lt)' : teachResult.accuracy_score >= 50 ? 'var(--amber-lt)' : 'var(--red-lt)',
                    color: teachResult.accuracy_score >= 80 ? 'var(--green)' : teachResult.accuracy_score >= 50 ? 'var(--amber)' : 'var(--red)',
                    border: '2px solid currentColor', flexShrink: 0,
                  }}>
                    {teachResult.accuracy_score}%
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', background: 'var(--parchment)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', flex: 1, color: 'var(--ink)', lineHeight: 1.6 }}>
                    🤖 {teachResult.byte_response}
                  </div>
                </div>

                {teachResult.what_you_got_right?.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>✓ Got right</div>
                    {teachResult.what_you_got_right.map((s, i) => <div key={i} style={{ fontSize: '0.85rem', color: 'var(--ink2)', marginBottom: 3 }}>• {s}</div>)}
                  </div>
                )}
                {teachResult.what_you_missed?.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-dk)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>→ Missed</div>
                    {teachResult.what_you_missed.map((s, i) => <div key={i} style={{ fontSize: '0.85rem', color: 'var(--ink2)', marginBottom: 3 }}>• {s}</div>)}
                  </div>
                )}
                {teachResult.follow_up_question && (
                  <div style={{ background: 'var(--blue-lt)', border: '1px solid #BBDEFB', borderRadius: 10, padding: '10px 14px', color: 'var(--blue-dk)', fontSize: '0.88rem', fontStyle: 'italic' }}>
                    🤔 {teachResult.follow_up_question}
                  </div>
                )}
                <ModelBadge model={teachResult.model_used} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
