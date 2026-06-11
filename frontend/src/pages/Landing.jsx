import { useEffect, useState } from 'react';
import { useStore } from '../store/gameStore';
import { checkHealth } from '../api/client';
import { BackendStatus } from '../components/UI';

export default function Landing() {
  const { go, playerName, setBackendOnline } = useStore();
  const [apiStatus, setApiStatus] = useState(null);

  useEffect(() => {
    checkHealth()
      .then(() => { setApiStatus(true); setBackendOnline(true); })
      .catch(() => { setApiStatus(false); setBackendOnline(false); });
  }, []);

  const features = [
    { icon: '◆', label: 'Claude Sonnet', desc: 'Code review, error explanation, mock interviews', color: '#5B3FA6' },
    { icon: '✦', label: 'Gemini Flash', desc: 'Streaming chat, hints, complexity analysis', color: '#1565C0' },
    { icon: '⚡', label: 'Real Python', desc: 'Actual code execution with sandboxed subprocess', color: 'var(--accent-dk)' },
    { icon: '🔀', label: 'LLM Router', desc: 'Smart routing, caching, fallback chains', color: 'var(--green)' },
    { icon: '📝', label: 'Prompt Engineering', desc: 'Versioned prompts, A/B testing, structured outputs', color: 'var(--amber)' },
    { icon: '🗺️', label: 'Full Curriculum', desc: '6 phases, 18 chapters, Python → interview-ready', color: 'var(--red)' },
  ];

  const path = [
    { emoji: '🥚', phase: '1', label: 'Foundations', desc: 'Variables, loops, control flow' },
    { emoji: '🌱', phase: '2', label: 'Functions & Collections', desc: 'Functions, lists, strings' },
    { emoji: '🏰', phase: '3', label: 'Data Structures', desc: 'Hash maps, stacks, linked lists, recursion' },
    { emoji: '🔥', phase: '4', label: 'Algorithms', desc: 'Sorting, binary search, greedy' },
    { emoji: '⚡', phase: '5', label: 'Advanced DSA', desc: 'Trees, graphs, heaps, DP' },
    { emoji: '🌟', phase: '6', label: 'Interview Galaxy', desc: '30 patterns, company dungeons, mock interviews' },
  ];

  return (
    <div style={{ background: 'var(--parchment)', minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 200,
        background: 'rgba(247,243,238,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 40px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.3rem', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
          Code<span style={{ color: 'var(--accent)' }}>Tale</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <BackendStatus />
          <span style={{ color: 'var(--ink4)', fontSize: '0.82rem' }}>Free · No signup required</span>
          <button onClick={() => go(playerName ? 'home' : 'onboarding')} className="btn btn-primary btn-sm">
            {playerName ? `Continue →` : 'Get Started'}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28,
          padding: '5px 14px', borderRadius: 99,
          background: 'var(--white)', border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-xs)',
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: apiStatus ? 'var(--green)' : apiStatus === false ? 'var(--red)' : 'var(--ink4)', display: 'inline-block' }} />
          <span style={{ fontSize: '0.78rem', color: 'var(--ink3)', fontFamily: 'var(--font-mono)' }}>
            Claude Sonnet + Gemini Flash · Multi-LLM Platform
          </span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: 'clamp(2.2rem, 6vw, 4rem)', color: 'var(--ink)', lineHeight: 1.1, marginBottom: 20, letterSpacing: '-0.02em' }}>
          Learn DSA.<br />
          <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>The right way.</em>
        </h1>

        <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: 'var(--ink3)', lineHeight: 1.7, maxWidth: 540, margin: '0 auto 36px' }}>
          A GenAI-powered Python learning platform that takes you from zero to interview-ready.
          Real AI mentorship — not just API calls.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
          <button onClick={() => go(playerName ? 'home' : 'onboarding')} className="btn btn-accent btn-lg">
            {playerName ? `Continue as ${playerName} →` : 'Begin Your Journey →'}
          </button>
          <button onClick={() => go('home')} className="btn btn-outline btn-lg">
            View Dashboard
          </button>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--ink4)' }}>
          No account needed · Progress saved locally · Works offline for content
        </p>
      </div>

      {/* GenAI Stack */}
      <div style={{ background: 'var(--white)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '48px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--ink4)', textAlign: 'center', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 32 }}>
            GenAI Engineering Stack
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {features.map((f, i) => (
              <div key={i} style={{
                background: 'var(--parchment)', border: '1px solid var(--border)', borderRadius: 14,
                padding: '20px', display: 'flex', gap: 14, alignItems: 'flex-start',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: f.color + '18', color: f.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-mono)',
                }}>{f.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--ink)', marginBottom: 4 }}>{f.label}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--ink3)', lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Learning path */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1.8rem', color: 'var(--ink)', marginBottom: 8 }}>
            Striver-Style Path. AI-Powered.
          </h2>
          <p style={{ color: 'var(--ink3)', fontSize: '0.95rem' }}>Every concept builds on the last. No skipping ahead. No getting lost.</p>
        </div>
        <div style={{ display: 'flex', gap: 0, position: 'relative', overflowX: 'auto', paddingBottom: 12 }}>
          {path.map((p, i) => (
            <div key={i} style={{ flex: '0 0 150px', textAlign: 'center', position: 'relative' }}>
              {i < path.length - 1 && (
                <div style={{ position: 'absolute', top: 22, left: '75%', width: '50%', height: 2, background: 'var(--border2)', zIndex: 0 }} />
              )}
              <div style={{ position: 'relative', zIndex: 1, display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%', background: 'var(--white)',
                  border: '2px solid var(--border2)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '1.2rem', boxShadow: 'var(--shadow-xs)',
                }}>
                  {p.emoji}
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--ink4)', fontFamily: 'var(--font-mono)', marginBottom: 2 }}>Phase {p.phase}</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>{p.label}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--ink3)', lineHeight: 1.4 }}>{p.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: '0.82rem', color: 'var(--ink4)' }}>
          Built with FastAPI · Claude Sonnet · Gemini Flash · React · Prompt Engineering
        </p>
      </div>
    </div>
  );
}
