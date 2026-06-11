// ═══════════════════════════════════════════════════════
// App.jsx + Remaining Pages (Home, Onboarding, Path,
// Chapter, Interview, Profile) — all in one file
// ═══════════════════════════════════════════════════════

// ── App.jsx ─────────────────────────────────────────────
import { useStore, ACHIEVEMENTS } from './store/gameStore';
import { AchievementToast } from './components/UI';
import Landing from './pages/Landing';
import ProblemPage from './pages/ProblemPage';

// Lazy-style inline page components
import { useState, useEffect, useRef } from 'react';
import { PHASES, CHAPTERS, getChaptersByPhase, PATTERNS, COMPANY_DUNGEONS, AVATARS } from './data/content';
import { TopNav, XPBar, StreakBadge, DailyQuestsCard, DiffBadge, Spinner, ModelBadge, EmptyState, SectionHeader } from './components/UI';
import { runCode, getReadinessScore, interviewTurn } from './api/client';
import ByteChat from './components/ByteChat';

// ── Onboarding ───────────────────────────────────────────
function Onboarding() {
  const { go, setPlayer, updateStreak } = useStore();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🧑‍💻');
  const [err, setErr] = useState('');

  const handleStart = () => {
    if (name.trim().length < 2) { setErr('Name must be at least 2 characters'); return; }
    setPlayer(name.trim(), avatar);
    updateStreak();
    go('home');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--parchment)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 24, padding: '48px 40px', maxWidth: 440, width: '100%', boxShadow: 'var(--shadow-lg)' }}>
        {/* Steps */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 40, justifyContent: 'center' }}>
          {[0, 1].map(i => <div key={i} style={{ height: 4, width: i === step ? 32 : 16, borderRadius: 2, background: i <= step ? 'var(--ink)' : 'var(--border)', transition: 'all 0.3s' }} />)}
        </div>

        {step === 0 ? (
          <div className="animate-fadeup">
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1.7rem', color: 'var(--ink)', marginBottom: 8, textAlign: 'center' }}>
              What's your name?
            </h2>
            <p style={{ color: 'var(--ink3)', textAlign: 'center', marginBottom: 28, fontSize: '0.9rem' }}>Your progress is saved locally under this name.</p>
            <input
              className="input"
              value={name}
              onChange={e => { setName(e.target.value); setErr(''); }}
              onKeyDown={e => e.key === 'Enter' && name.trim().length >= 2 && setStep(1)}
              placeholder="Enter your name..."
              autoFocus
              style={{ marginBottom: err ? 6 : 20, textAlign: 'center', fontSize: '1.1rem', fontWeight: 600 }}
            />
            {err && <p style={{ color: 'var(--red)', fontSize: '0.82rem', textAlign: 'center', marginBottom: 16 }}>{err}</p>}
            <button onClick={() => name.trim().length >= 2 ? setStep(1) : setErr('Name too short')} className="btn btn-primary w-full" style={{ justifyContent: 'center', padding: 14 }}>
              Next →
            </button>
          </div>
        ) : (
          <div className="animate-fadeup">
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: '4rem', marginBottom: 8 }}>{avatar}</div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1.5rem', color: 'var(--ink)' }}>Pick your avatar</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, marginBottom: 24 }}>
              {AVATARS.map(av => (
                <button key={av} onClick={() => setAvatar(av)} style={{
                  fontSize: '1.5rem', padding: '8px', borderRadius: 10, cursor: 'pointer',
                  border: `2px solid ${avatar === av ? 'var(--ink)' : 'var(--border)'}`,
                  background: avatar === av ? 'var(--parchment)' : 'transparent',
                  transition: 'all 0.15s',
                }}>{av}</button>
              ))}
            </div>
            <div style={{ background: 'var(--parchment)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '2rem' }}>{avatar}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, color: 'var(--ink)' }}>{name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--ink4)', fontFamily: 'var(--font-mono)' }}>Level 1 · Code Newbie · 0 XP</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStep(0)} className="btn btn-outline">← Back</button>
              <button onClick={handleStart} className="btn btn-accent" style={{ flex: 1, justifyContent: 'center' }}>
                Begin Journey →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Home Dashboard ────────────────────────────────────────
function Home() {
  const { go, playerName, avatar, level, xp, streak, earnedAchievements, completedProblems, completedChapters, unlockedChapters, setCurrentChapter } = useStore();

  const recentPhases = PHASES.slice(0, 3);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--parchment)' }}>
      <div style={{
        position: 'sticky', top: 0, zIndex: 200,
        background: 'rgba(247,243,238,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)', padding: '0 24px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>
          Code<span style={{ color: 'var(--accent)' }}>Tale</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <StreakBadge />
          <button onClick={() => go('profile')} style={{
            background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '50%',
            width: 34, height: 34, cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{avatar}</button>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 20px' }}>
        {/* Welcome */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1.8rem', color: 'var(--ink)', marginBottom: 4 }}>
            Welcome back, <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>{playerName}</em>.
          </h1>
          <p style={{ color: 'var(--ink3)', fontSize: '0.9rem' }}>
            {completedProblems.length} problems solved · {completedChapters.length} chapters complete · Level {level}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
          <div>
            {/* XP */}
            <div style={{ marginBottom: 20 }}><XPBar /></div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 24 }}>
              {[
                { v: completedProblems.length, l: 'Problems', c: 'var(--accent)' },
                { v: completedChapters.length, l: 'Chapters', c: 'var(--blue-dk)' },
                { v: earnedAchievements.length, l: 'Achievements', c: 'var(--amber)' },
                { v: streak, l: 'Day Streak', c: 'var(--green)' },
              ].map((s, i) => (
                <div key={i} className="card" style={{ padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.5rem', color: s.c }}>{s.v}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ink4)' }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Path */}
            <SectionHeader label="Your Path" action={
              <button onClick={() => go('path')} className="btn btn-ghost btn-sm">View all →</button>
            } />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PHASES.map((phase, i) => {
                const phaseChs = getChaptersByPhase(phase.id);
                const completedInPhase = phaseChs.filter(ch => completedChapters.includes(ch.id)).length;
                const progress = phaseChs.length > 0 ? (completedInPhase / phaseChs.length) * 100 : 0;
                const accessible = i === 0 || completedChapters.length > 0 || phase.isInterviewGalaxy;

                return (
                  <div key={phase.id} onClick={() => accessible && go(phase.isInterviewGalaxy ? 'interview' : 'path')}
                    className="card card-hover"
                    style={{ padding: '16px 20px', cursor: accessible ? 'pointer' : 'not-allowed', opacity: accessible ? 1 : 0.5 }}>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                      <div style={{ fontSize: '1.6rem', width: 40, textAlign: 'center' }}>{phase.emoji}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                          <span style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--ink)' }}>Phase {phase.number}: {phase.title}</span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--ink4)', fontFamily: 'var(--font-mono)' }}>{phase.subtitle}</span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--ink3)', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{phase.desc}</p>
                        {!phase.isInterviewGalaxy && phaseChs.length > 0 && (
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <div className="progress-track" style={{ flex: 1, height: 4 }}>
                              <div className="progress-fill" style={{ width: `${progress}%`, height: 4 }} />
                            </div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--ink4)', fontFamily: 'var(--font-mono)' }}>
                              {completedInPhase}/{phaseChs.length}
                            </span>
                          </div>
                        )}
                      </div>
                      <span style={{ color: 'var(--ink4)', fontSize: '1rem' }}>→</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <DailyQuestsCard />

            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '0.95rem' }}>Quick Actions</span>
              </div>
              <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { icon: '🗺️', label: 'Skill Tree', screen: 'path' },
                  { icon: '🌌', label: 'Interview Galaxy', screen: 'interview' },
                  { icon: '💼', label: 'Profile & Achievements', screen: 'profile' },
                ].map(a => (
                  <button key={a.screen} onClick={() => go(a.screen)} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                    background: 'var(--parchment)', border: '1px solid var(--border)', borderRadius: 10,
                    cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left', width: '100%',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--parchment2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--parchment)'}
                  >
                    <span style={{ fontSize: '1rem' }}>{a.icon}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--ink)' }}>{a.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Path Page ─────────────────────────────────────────────
function PathPage() {
  const { go, setCurrentChapter, completedChapters, unlockedChapters, completedProblems } = useStore();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--parchment)' }}>
      <TopNav onBack={() => go('home')} title="Skill Tree" right={
        <span style={{ fontSize: '0.82rem', color: 'var(--ink4)', fontFamily: 'var(--font-mono)' }}>
          {completedChapters.length}/18 chapters
        </span>
      } />
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '28px 20px' }}>
        {PHASES.filter(p => !p.isInterviewGalaxy).map((phase, pi) => {
          const chapters = getChaptersByPhase(phase.id);
          const done = chapters.filter(ch => completedChapters.includes(ch.id)).length;

          return (
            <div key={phase.id} style={{ marginBottom: 36 }}>
              <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 22px', marginBottom: 14 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: '1.8rem' }}>{phase.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 4 }}>
                      <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1.05rem', color: 'var(--ink)' }}>
                        Phase {phase.number}: {phase.title}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--ink4)', fontFamily: 'var(--font-mono)' }}>{phase.subtitle}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <div className="progress-track" style={{ flex: 1, height: 5 }}>
                        <div className="progress-fill" style={{ width: `${(done / chapters.length) * 100}%`, height: 5 }} />
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--ink4)', fontFamily: 'var(--font-mono)' }}>{done}/{chapters.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10, paddingLeft: 16 }}>
                {chapters.map(ch => {
                  const unlocked = unlockedChapters.includes(ch.id);
                  const completed = completedChapters.includes(ch.id);
                  const solved = (ch.problems || []).filter(p => completedProblems.includes(p.id)).length;

                  return (
                    <div key={ch.id} onClick={() => { if (!unlocked) return; setCurrentChapter(ch); go('chapter'); }}
                      className="card card-hover"
                      style={{ padding: '16px', cursor: unlocked ? 'pointer' : 'not-allowed', opacity: unlocked ? 1 : 0.45, position: 'relative' }}>
                      {completed && (
                        <div style={{ position: 'absolute', top: 10, right: 10, width: 20, height: 20, borderRadius: '50%', background: 'var(--green)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700 }}>✓</div>
                      )}
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                        <div style={{ fontSize: '1.3rem' }}>{unlocked ? ch.emoji : '🔒'}</div>
                        <div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--ink4)', fontFamily: 'var(--font-mono)', marginBottom: 2 }}>Ch {ch.number}</div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ink)' }}>{ch.title}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                        {(ch.topics || []).slice(0, 3).map((t, i) => (
                          <span key={i} style={{ background: 'var(--parchment)', border: '1px solid var(--border)', borderRadius: 6, padding: '2px 7px', fontSize: '0.68rem', color: 'var(--ink3)' }}>{t}</span>
                        ))}
                      </div>
                      {unlocked && (
                        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                          {(ch.problems || []).map((p, i) => (
                            <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: completedProblems.includes(p.id) ? 'var(--green)' : 'var(--border2)' }} />
                          ))}
                          <span style={{ fontSize: '0.7rem', color: 'var(--ink4)', marginLeft: 4 }}>{solved}/{(ch.problems || []).length}</span>
                          {ch.boss && <span style={{ marginLeft: 'auto', fontSize: '0.68rem', color: 'var(--red)', fontWeight: 600 }}>⚔️ Boss</span>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Chapter Page ──────────────────────────────────────────
function ChapterPage() {
  const { currentChapter, go, setCurrentProblem, completedProblems, learnConcept } = useStore();
  const [tab, setTab] = useState('learn');
  const [storyMode, setStoryMode] = useState(true);
  const [conceptRead, setConceptRead] = useState(false);

  const isProblemCompleted = (id) => completedProblems.includes(id);

  if (!currentChapter) { go('path'); return null; }
  const ch = currentChapter;
  const lesson = ch.lesson;
  const problems = ch.problems || [];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--parchment)' }}>
      <TopNav onBack={() => go('path')} title={`${ch.emoji} ${ch.title}`} right={
        <div style={{ display: 'flex', gap: 4 }}>
          {problems.map((p, i) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: isProblemCompleted(p.id) ? 'var(--green)' : 'var(--border2)' }} />
          ))}
        </div>
      } />

      <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--white)', position: 'sticky', top: 56, zIndex: 90 }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div className="tab-list">
            {[{ id: 'learn', l: '📖 Learn' }, { id: 'problems', l: `⚔️ Problems (${problems.length})` }, { id: 'boss', l: '🐉 Boss' }].map(t => (
              <button key={t.id} className={`tab-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.l}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '28px 20px' }}>
        {/* Learn tab */}
        {tab === 'learn' && lesson && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-dk)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{lesson.hook?.title}</div>
              <p style={{ color: 'var(--ink2)', lineHeight: 1.8, fontSize: '0.95rem' }}>{lesson.hook?.content}</p>
            </div>

            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
                {[['📖 Story Mode', true], ['📐 Real Mode', false]].map(([label, sm]) => (
                  <button key={label} onClick={() => setStoryMode(sm)} style={{
                    flex: 1, padding: '13px', border: 'none', cursor: 'pointer',
                    background: storyMode === sm ? 'var(--parchment)' : 'var(--white)',
                    color: storyMode === sm ? 'var(--ink)' : 'var(--ink3)',
                    fontFamily: 'var(--font-sans)', fontWeight: storyMode === sm ? 600 : 400,
                    fontSize: '0.88rem', borderBottom: storyMode === sm ? '2px solid var(--ink)' : '2px solid transparent',
                    transition: 'all 0.15s',
                  }}>{label}</button>
                ))}
              </div>
              <div style={{ padding: '24px' }}>
                <pre style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'var(--ink2)', lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>
                  {storyMode ? lesson.story?.content : lesson.real?.content}
                </pre>
              </div>
            </div>

            {lesson.codeExample && (
              <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid #313244' }}>
                <div style={{ background: '#1E2030', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  {['#FF5F57', '#FFBD2E', '#28C840'].map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#6C7086', marginLeft: 4 }}>example.py</span>
                </div>
                <pre style={{ background: '#11131D', color: '#CDD6F4', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', padding: '20px', margin: 0, overflowX: 'auto', lineHeight: 1.8 }}>
                  {lesson.codeExample}
                </pre>
              </div>
            )}

            <button onClick={() => { if (!conceptRead) { setConceptRead(true); learnConcept(); } setTab('problems'); }}
              className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '12px 24px' }}>
              Got it — Start Problems →
            </button>
          </div>
        )}

        {/* Problems tab */}
        {tab === 'problems' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {problems.map((p, i) => {
              const solved = isProblemCompleted(p.id);
              return (
                <div key={p.id} onClick={() => { setCurrentProblem(p); go('problem'); }}
                  className="card card-hover" style={{ padding: '18px 20px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                      background: solved ? 'var(--green-lt)' : 'var(--parchment)',
                      border: `1px solid ${solved ? '#C3E6D0' : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-mono)', fontSize: '0.82rem',
                      color: solved ? 'var(--green)' : 'var(--ink4)', fontWeight: 700,
                    }}>{solved ? '✓' : i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--ink)' }}>{p.title}</span>
                        <DiffBadge difficulty={p.difficulty} />
                        {p.leetcodeNum && <span className="badge badge-orange">LC #{p.leetcodeNum}</span>}
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <span className="badge badge-ink">{p.pattern}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--amber)', fontFamily: 'var(--font-mono)' }}>+{p.xp} XP</span>
                      </div>
                    </div>
                    <span style={{ color: 'var(--ink4)' }}>→</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Boss tab */}
        {tab === 'boss' && ch.boss && (
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <div style={{ background: 'var(--white)', border: '1px solid #F5C6C2', borderRadius: 20, padding: '32px', textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🐉</div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1.5rem', color: 'var(--red)', marginBottom: 8 }}>
                {ch.boss.title}
              </h2>
              <p style={{ color: 'var(--ink3)', marginBottom: 20, fontSize: '0.9rem' }}>{ch.boss.desc}</p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
                <div className="card" style={{ padding: '10px 20px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--red)' }}>
                    {Math.floor(ch.boss.timeLimit / 60)}:{String(ch.boss.timeLimit % 60).padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--ink4)' }}>Time Limit</div>
                </div>
                <div className="card" style={{ padding: '10px 20px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--amber)' }}>+{ch.boss.xp} XP</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--ink4)' }}>Reward</div>
                </div>
              </div>
              <div style={{ background: 'var(--parchment)', borderRadius: 12, padding: '16px', textAlign: 'left', marginBottom: 24 }}>
                <pre style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', color: 'var(--ink2)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{ch.boss.story}</pre>
              </div>
              <button onClick={() => { setCurrentProblem({ ...ch.boss, isBoss: true, chapterId: ch.id }); go('problem'); }}
                className="btn btn-accent btn-lg" style={{ justifyContent: 'center', width: '100%' }}>
                ⚔️ Enter Boss Fight
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Interview Page ────────────────────────────────────────
function InterviewPage() {
  const { go, completedChapters, getLearningProfile, updateReadinessAchievement } = useStore();
  const [activeTab, setActiveTab] = useState('patterns');
  const [readiness, setReadiness] = useState(null);
  const [loadingReadiness, setLoadingReadiness] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState(null);

  // ── Mock Interview State ────────────────────────────────
  const [interviewActive, setInterviewActive] = useState(false);
  const [interviewMessages, setInterviewMessages] = useState([]);
  const [interviewInput, setInterviewInput] = useState('');
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [interviewReport, setInterviewReport] = useState(null);
  const [interviewCode, setInterviewCode] = useState('');
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const chatEndRef = useRef(null);

  const MOCK_PROBLEM = {
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    examples: 'Input: nums=[2,7,11,15], target=9 → Output: [0,1]',
    difficulty: 'easy',
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [interviewMessages]);

  const startInterview = async () => {
    setInterviewActive(true);
    setInterviewReport(null);
    setInterviewLoading(true);
    setInterviewCode('# Write your solution here\n\ndef two_sum(nums, target):\n    pass\n');
    const opening = {
      role: 'interviewer',
      text: `👋 Hi! I'm your AI interviewer today. Let's get started.\n\n**Problem: ${MOCK_PROBLEM.title}**\n\n${MOCK_PROBLEM.description}\n\n*Example:* ${MOCK_PROBLEM.examples}\n\nTake a moment to think, then walk me through your approach. How would you start?`,
    };
    setInterviewMessages([opening]);
    setInterviewLoading(false);
  };

  const sendInterviewMessage = async (content) => {
    if (!content.trim() && !showCodeEditor) return;
    const userMsg = content.trim() || `[Submitted code]\n\`\`\`python\n${interviewCode}\n\`\`\``;
    setInterviewMessages(prev => [...prev, { role: 'candidate', text: userMsg }]);
    setInterviewInput('');
    setShowCodeEditor(false);
    setInterviewLoading(true);

    try {
      const history = interviewMessages.map(m => ({
        role: m.role === 'interviewer' ? 'assistant' : 'user',
        content: m.text,
      }));
      const res = await interviewTurn({
        problem_title: MOCK_PROBLEM.title,
        problem_description: MOCK_PROBLEM.description,
        candidate_message: userMsg,
        history,
      });
      if (res.wrap_up || res.report) {
        setInterviewMessages(prev => [...prev, { role: 'interviewer', text: res.reply || "Great session! Here's your performance report." }]);
        setInterviewReport(res.report || res);
      } else {
        setInterviewMessages(prev => [...prev, { role: 'interviewer', text: res.reply }]);
      }
    } catch (e) {
      setInterviewMessages(prev => [...prev, { role: 'interviewer', text: `⚠️ Connection issue: ${e.message}. Try again.` }]);
    }
    setInterviewLoading(false);
  };

  const wrapUpInterview = async () => {
    await sendInterviewMessage('I think I\'m done. Please wrap up the interview and give me feedback.');
  };

  const resetInterview = () => {
    setInterviewActive(false);
    setInterviewMessages([]);
    setInterviewReport(null);
    setInterviewCode('');
  };

  const chaptersCompleted = completedChapters.length;

  const fetchReadiness = async () => {
    setLoadingReadiness(true);
    try {
      const profile = getLearningProfile();
      const res = await getReadinessScore({ profile });
      setReadiness(res);
      updateReadinessAchievement(res.score);
    } catch (e) {
      setReadiness({ error: e.message });
    }
    setLoadingReadiness(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--parchment)' }}>
      <TopNav onBack={() => go('home')} title="Interview Galaxy" />

      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)', padding: '28px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1.8rem', color: 'var(--ink)', marginBottom: 8 }}>
            Interview Galaxy 🌌
          </h1>
          <p style={{ color: 'var(--ink3)', fontSize: '0.92rem', marginBottom: 16 }}>
            30 essential patterns · Company dungeons · AI mock interviews · LeetCode mapping
          </p>
          <div style={{ display: 'inline-flex', gap: 10 }}>
            <div className="card" style={{ padding: '8px 18px' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--accent)', fontSize: '1.1rem' }}>{PATTERNS.length}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--ink4)', marginLeft: 6 }}>Patterns</span>
            </div>
            <div className="card" style={{ padding: '8px 18px' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--blue-dk)', fontSize: '1.1rem' }}>{COMPANY_DUNGEONS.length}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--ink4)', marginLeft: 6 }}>Companies</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--white)', position: 'sticky', top: 56, zIndex: 90 }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="tab-list">
            {['patterns', 'dungeons', 'mock', 'readiness'].map(t => (
              <button key={t} className={`tab-btn ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
                {t === 'patterns' ? '🔮 Patterns' : t === 'dungeons' ? '🏰 Dungeons' : t === 'mock' ? '🎤 Mock Interview' : '📊 Readiness'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 20px' }}>
        {activeTab === 'patterns' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
            {PATTERNS.map(p => {
              const unlocked = chaptersCompleted >= (p.minChapters || 0);
              return (
                <div key={p.id} onClick={() => unlocked && setSelectedPattern(selectedPattern?.id === p.id ? null : p)}
                  className="card card-hover" style={{ padding: '18px', cursor: unlocked ? 'pointer' : 'not-allowed', opacity: unlocked ? 1 : 0.45 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
                    <span style={{ fontSize: '1.6rem' }}>{unlocked ? p.emoji : '🔒'}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ink)' }}>{p.name}</div>
                      <DiffBadge difficulty={p.difficulty} />
                    </div>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--ink3)', lineHeight: 1.5, marginBottom: 8 }}>{p.desc}</p>
                  {selectedPattern?.id === p.id && (
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }} className="animate-fadeup">
                      {p.examples.map((ex, i) => <div key={i} style={{ fontSize: '0.82rem', color: 'var(--blue-dk)', marginBottom: 3 }}>• {ex}</div>)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'dungeons' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {COMPANY_DUNGEONS.map(d => {
              const unlocked = chaptersCompleted >= (d.minChapters || 0);
              return (
                <div key={d.id} className="card card-hover" style={{ padding: '24px', opacity: unlocked ? 1 : 0.5 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: '2rem' }}>{d.emoji}</span>
                    <div>
                      <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1rem', color: 'var(--ink)' }}>{d.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--ink4)', fontFamily: 'var(--font-mono)' }}>{d.questionCount} questions</div>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--ink3)', lineHeight: 1.5, marginBottom: 12 }}>{d.desc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
                    {d.topics.map((t, i) => <span key={i} className="badge badge-ink">{t}</span>)}
                  </div>
                  <button disabled={!unlocked} className="btn btn-outline w-full" style={{ justifyContent: 'center' }}>
                    {unlocked ? 'Enter →' : '🔒 Locked'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'mock' && (
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            {/* Pre-interview landing */}
            {!interviewActive && !interviewReport && (
              <div style={{ textAlign: 'center' }}>
                <div className="card" style={{ padding: '40px 36px', marginBottom: 20 }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🎤</div>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.6rem', color: 'var(--ink)', marginBottom: 10 }}>AI Mock Interview</h2>
                  <p style={{ color: 'var(--ink3)', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: 28, maxWidth: 440, margin: '0 auto 28px' }}>
                    Your AI interviewer gives you a coding problem, asks follow-up questions, and generates a detailed performance report when you're done.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
                    {[['🎯', 'Real Problem', 'Two Sum — classic interview favorite'], ['💬', 'Live Q&A', 'AI asks follow-ups just like a real interviewer'], ['📊', 'Full Report', 'Score, feedback, and action items']].map(([icon, title, desc], i) => (
                      <div key={i} style={{ background: 'var(--parchment)', borderRadius: 14, padding: '18px 12px', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '1.6rem', marginBottom: 8 }}>{icon}</div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--ink)', marginBottom: 4 }}>{title}</div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--ink4)', lineHeight: 1.5 }}>{desc}</div>
                      </div>
                    ))}
                  </div>
                  <button onClick={startInterview} className="btn btn-primary btn-lg" style={{ justifyContent: 'center', minWidth: 200, gap: 8 }}>
                    ▶ Start Interview
                  </button>
                </div>
                <div className="card" style={{ padding: '20px 24px', textAlign: 'left' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: 14, fontSize: '1rem' }}>💡 Tips before you start</h3>
                  {['Think out loud — explain your approach before coding', 'Start brute force, then optimize step by step', 'Always discuss time & space complexity', 'Ask clarifying questions first — it impresses interviewers'].map((tip, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                      <span style={{ background: 'var(--ink)', color: 'var(--white)', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{i + 1}</span>
                      <span style={{ fontSize: '0.88rem', color: 'var(--ink2)', lineHeight: 1.6 }}>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active interview chat */}
            {interviewActive && !interviewReport && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {/* Header */}
                <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '16px 16px 0 0', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#2ECC71', boxShadow: '0 0 0 3px #2ECC7130' }} />
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--ink)' }}>🎤 Interview in Progress</span>
                    <span className="badge badge-easy">Two Sum</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setShowCodeEditor(v => !v)} className="btn btn-outline btn-sm" style={{ gap: 5 }}>
                      {showCodeEditor ? '💬 Chat' : '⌨️ Code'}
                    </button>
                    <button onClick={wrapUpInterview} disabled={interviewLoading} className="btn btn-sm" style={{ background: 'var(--amber-lt)', color: 'var(--amber)', border: '1px solid #E6C96A', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>
                      Wrap Up →
                    </button>
                    <button onClick={resetInterview} className="btn btn-ghost btn-sm">✕ End</button>
                  </div>
                </div>

                {/* Chat messages */}
                <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderTop: 'none', minHeight: 380, maxHeight: 420, overflowY: 'auto', padding: '20px' }}>
                  {interviewMessages.map((msg, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 18, flexDirection: msg.role === 'candidate' ? 'row-reverse' : 'row' }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                        background: msg.role === 'interviewer' ? 'var(--ink)' : 'var(--accent)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1rem', color: 'white',
                      }}>
                        {msg.role === 'interviewer' ? '🤖' : '👤'}
                      </div>
                      <div style={{
                        maxWidth: '78%', background: msg.role === 'interviewer' ? 'var(--parchment)' : '#EEF2FF',
                        border: `1px solid ${msg.role === 'interviewer' ? 'var(--border)' : '#C7D2FE'}`,
                        borderRadius: msg.role === 'interviewer' ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                        padding: '12px 16px',
                      }}>
                        <pre style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', color: 'var(--ink2)', lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: 0 }}>
                          {msg.text}
                        </pre>
                      </div>
                    </div>
                  ))}
                  {interviewLoading && (
                    <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🤖</div>
                      <div style={{ background: 'var(--parchment)', border: '1px solid var(--border)', borderRadius: '4px 16px 16px 16px', padding: '12px 20px', display: 'flex', gap: 6, alignItems: 'center' }}>
                        {[0, 1, 2].map(i => (
                          <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--ink4)', animation: `bounce 1.2s ease ${i * 0.2}s infinite` }} />
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Code editor (optional) */}
                {showCodeEditor && (
                  <div style={{ border: '1px solid var(--border)', borderTop: 'none' }}>
                    <div style={{ background: '#1E2030', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                      {['#FF5F57', '#FFBD2E', '#28C840'].map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#6C7086', marginLeft: 4 }}>solution.py</span>
                    </div>
                    <textarea
                      className="code-editor"
                      value={interviewCode}
                      onChange={e => setInterviewCode(e.target.value)}
                      style={{ width: '100%', minHeight: 180, borderRadius: 0, border: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                    />
                  </div>
                )}

                {/* Input bar */}
                <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 16px 16px', padding: '12px 16px', display: 'flex', gap: 10 }}>
                  <textarea
                    value={interviewInput}
                    onChange={e => setInterviewInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendInterviewMessage(interviewInput); } }}
                    placeholder={showCodeEditor ? 'Add a message about your code, or just submit the code above…' : 'Type your response… (Enter to send, Shift+Enter for new line)'}
                    style={{
                      flex: 1, resize: 'none', fontFamily: 'var(--font-sans)', fontSize: '0.9rem',
                      border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px',
                      color: 'var(--ink)', background: 'var(--parchment)', lineHeight: 1.5, minHeight: 44, maxHeight: 120,
                      outline: 'none',
                    }}
                    rows={2}
                  />
                  <button onClick={() => showCodeEditor ? sendInterviewMessage('') : sendInterviewMessage(interviewInput)}
                    disabled={interviewLoading || (!interviewInput.trim() && !showCodeEditor)}
                    className="btn btn-primary" style={{ alignSelf: 'flex-end', padding: '10px 18px', gap: 6 }}>
                    {interviewLoading ? <Spinner size={14} color="var(--white)" /> : '↑'}
                    {showCodeEditor ? 'Submit Code' : 'Send'}
                  </button>
                </div>
              </div>
            )}

            {/* Performance report */}
            {interviewReport && (
              <div className="animate-fadeup" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ textAlign: 'center', marginBottom: 8 }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🏆</div>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.5rem', color: 'var(--ink)', marginBottom: 4 }}>Interview Complete!</h2>
                  <p style={{ color: 'var(--ink3)', fontSize: '0.9rem' }}>Here's your detailed performance report</p>
                </div>

                {/* Score */}
                {interviewReport.overall_score !== undefined && (
                  <div className="card" style={{ padding: '28px', textAlign: 'center' }}>
                    <div style={{
                      width: 90, height: 90, borderRadius: '50%', margin: '0 auto 16px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.8rem',
                      background: interviewReport.overall_score >= 75 ? 'var(--green-lt)' : interviewReport.overall_score >= 50 ? 'var(--amber-lt)' : 'var(--red-lt)',
                      color: interviewReport.overall_score >= 75 ? 'var(--green)' : interviewReport.overall_score >= 50 ? 'var(--amber)' : 'var(--red)',
                      border: '3px solid currentColor',
                    }}>{interviewReport.overall_score}</div>
                    <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1.1rem', color: 'var(--ink)' }}>
                      {interviewReport.verdict || 'Interview Complete'}
                    </div>
                  </div>
                )}

                {/* Feedback sections */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {interviewReport.strengths?.length > 0 && (
                    <div className="card" style={{ padding: '18px 20px' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>✅ Strengths</div>
                      {interviewReport.strengths.map((s, i) => <div key={i} style={{ fontSize: '0.86rem', color: 'var(--ink2)', marginBottom: 6 }}>• {s}</div>)}
                    </div>
                  )}
                  {interviewReport.improvements?.length > 0 && (
                    <div className="card" style={{ padding: '18px 20px' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>📈 Improve</div>
                      {interviewReport.improvements.map((s, i) => <div key={i} style={{ fontSize: '0.86rem', color: 'var(--ink2)', marginBottom: 6 }}>• {s}</div>)}
                    </div>
                  )}
                </div>

                {interviewReport.action_items?.length > 0 && (
                  <div className="card" style={{ padding: '20px 24px', background: 'linear-gradient(135deg, #FFF8EC, #FFF3D6)', border: '1px solid #E6C96A' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>🎯 Action Items</div>
                    {interviewReport.action_items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                        <span style={{ background: 'var(--amber)', color: 'white', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                        <span style={{ fontSize: '0.88rem', color: 'var(--ink)', lineHeight: 1.6 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                {interviewReport.summary && (
                  <div className="card" style={{ padding: '18px 20px' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--ink4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>💬 Summary</div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--ink2)', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>{interviewReport.summary}</p>
                  </div>
                )}

                <button onClick={resetInterview} className="btn btn-primary" style={{ alignSelf: 'center', padding: '12px 32px', gap: 6 }}>
                  🔄 Try Another Interview
                </button>
              </div>
            )}
          </div>
        )}


        {activeTab === 'readiness' && (
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            {!readiness ? (
              <div className="card" style={{ padding: '36px', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>📊</div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1.4rem', marginBottom: 8 }}>Interview Readiness Score</h2>
                <p style={{ color: 'var(--ink3)', fontSize: '0.9rem', marginBottom: 24, lineHeight: 1.6 }}>
                  Claude analyzes your full learning history — patterns covered, problem-solving independence, difficulty range — and gives an honest readiness assessment.
                </p>
                <button onClick={fetchReadiness} disabled={loadingReadiness} className="btn btn-primary btn-lg" style={{ gap: 8 }}>
                  {loadingReadiness ? <Spinner size={16} color="var(--white)" /> : '◆ Claude'}
                  {loadingReadiness ? 'Analyzing...' : 'Analyze My Readiness'}
                </button>
              </div>
            ) : readiness.error ? (
              <div className="card" style={{ padding: '24px', color: 'var(--red)' }}>{readiness.error}</div>
            ) : (
              <div className="animate-fadeup" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="card" style={{ padding: '28px', textAlign: 'center' }}>
                  <div style={{
                    width: 80, height: 80, borderRadius: '50%', margin: '0 auto 16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.6rem',
                    background: readiness.score >= 80 ? 'var(--green-lt)' : readiness.score >= 50 ? 'var(--amber-lt)' : 'var(--red-lt)',
                    color: readiness.score >= 80 ? 'var(--green)' : readiness.score >= 50 ? 'var(--amber)' : 'var(--red)',
                    border: '3px solid currentColor',
                  }}>{readiness.score}</div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1.2rem', color: 'var(--ink)', marginBottom: 4 }}>{readiness.label}</div>
                  <div style={{ color: 'var(--ink4)', fontSize: '0.85rem' }}>~{readiness.weeks_to_ready} weeks to fully ready</div>
                </div>
                <div className="card" style={{ padding: '20px 24px' }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--ink2)', lineHeight: 1.7, fontStyle: 'italic' }}>{readiness.honest_assessment}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="card" style={{ padding: '16px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Strong Areas</div>
                    {(readiness.strong_areas || []).map((s, i) => <div key={i} style={{ fontSize: '0.85rem', color: 'var(--ink2)', marginBottom: 4 }}>✓ {s}</div>)}
                  </div>
                  <div className="card" style={{ padding: '16px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Focus Next</div>
                    {(readiness.recommended_focus || []).map((s, i) => <div key={i} style={{ fontSize: '0.85rem', color: 'var(--ink2)', marginBottom: 4 }}>→ {s}</div>)}
                  </div>
                </div>
                <ModelBadge model={readiness.model_used} />
                <button onClick={() => setReadiness(null)} className="btn btn-ghost btn-sm">Re-analyze</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Profile Page ──────────────────────────────────────────
function ProfilePage() {
  const { go, playerName, avatar, xp, level, streak, earnedAchievements, completedProblems, completedChapters, getLevelTitle, setPlayer, resetGame } = useStore();
  const [showReset, setShowReset] = useState(false);
  const [editAvatar, setEditAvatar] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--parchment)' }}>
      <TopNav onBack={() => go('home')} title="Profile" />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 20px' }}>
        {/* Profile card */}
        <div className="card" style={{ padding: '28px', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 20 }}>
            <button onClick={() => setEditAvatar(v => !v)} style={{
              fontSize: '3.5rem', background: 'var(--parchment)', border: '2px solid var(--border)',
              borderRadius: 16, padding: '10px 14px', cursor: 'pointer', position: 'relative',
            }}>
              {avatar}
              <span style={{ position: 'absolute', bottom: 2, right: 2, fontSize: '0.55rem', background: 'var(--ink)', color: 'white', borderRadius: 4, padding: '1px 3px' }}>✏️</span>
            </button>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1.5rem', color: 'var(--ink)', marginBottom: 4 }}>{playerName}</h1>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                <span style={{ background: 'var(--ink)', color: 'var(--white)', padding: '3px 10px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 700 }}>Level {level}</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--accent)', fontSize: '0.9rem' }}>{getLevelTitle()}</span>
              </div>
              <XPBar compact />
            </div>
          </div>
          {editAvatar && (
            <div className="animate-fadeup" style={{ marginBottom: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
                {AVATARS.map(av => (
                  <button key={av} onClick={() => { setPlayer(playerName, av); setEditAvatar(false); }} style={{
                    fontSize: '1.5rem', padding: '8px', borderRadius: 10, cursor: 'pointer',
                    border: `2px solid ${avatar === av ? 'var(--ink)' : 'var(--border)'}`,
                    background: avatar === av ? 'var(--parchment)' : 'transparent',
                  }}>{av}</button>
                ))}
              </div>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {[
              { v: xp.toLocaleString(), l: 'Total XP', c: 'var(--amber)' },
              { v: completedProblems.length, l: 'Problems', c: 'var(--accent)' },
              { v: completedChapters.length, l: 'Chapters', c: 'var(--blue-dk)' },
              { v: `${streak}d`, l: 'Streak', c: 'var(--green)' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'var(--parchment)', borderRadius: 10, padding: '12px', textAlign: 'center', border: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.3rem', color: s.c }}>{s.v}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--ink4)' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="card" style={{ marginBottom: 20, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}>Achievements</span>
            <span style={{ fontSize: '0.82rem', color: 'var(--ink4)' }}>{earnedAchievements.length}/{ACHIEVEMENTS.length}</span>
          </div>
          <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
            {ACHIEVEMENTS.map(ach => {
              const earned = earnedAchievements.includes(ach.id);
              const rc = { common: 'var(--green)', rare: 'var(--blue-dk)', epic: 'var(--accent-dk)', legendary: '#7C3AED' };
              const c = rc[ach.rarity];
              return (
                <div key={ach.id} style={{
                  padding: '12px 14px', borderRadius: 12, display: 'flex', gap: 10, alignItems: 'center',
                  background: earned ? 'var(--parchment)' : 'var(--white)',
                  border: `1px solid ${earned ? 'var(--border2)' : 'var(--border)'}`,
                  opacity: earned ? 1 : 0.45,
                }}>
                  <span style={{ fontSize: '1.5rem', filter: earned ? 'none' : 'grayscale(1)' }}>{earned ? ach.icon : '🔒'}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: earned ? c : 'var(--ink4)' }}>{ach.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ink4)' }}>{ach.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reset */}
        <div className="card" style={{ padding: '20px 24px' }}>
          {!showReset ? (
            <button onClick={() => setShowReset(true)} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600 }}>
              🗑️ Reset All Progress
            </button>
          ) : (
            <div>
              <p style={{ color: 'var(--red)', fontWeight: 600, marginBottom: 12 }}>This will delete all your progress. Are you sure?</p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setShowReset(false)} className="btn btn-outline btn-sm">Cancel</button>
                <button onClick={() => { resetGame(); go('landing'); }} className="btn btn-sm" style={{ background: 'var(--red)', color: 'white', border: 'none', cursor: 'pointer', borderRadius: 8, padding: '6px 14px', fontWeight: 600 }}>
                  Yes, Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────
export default function App() {
  const { currentScreen } = useStore();
  const screens = {
    landing: <Landing />,
    onboarding: <Onboarding />,
    home: <Home />,
    path: <PathPage />,
    chapter: <ChapterPage />,
    problem: <ProblemPage />,
    interview: <InterviewPage />,
    profile: <ProfilePage />,
  };
  return (
    <>
      {screens[currentScreen] || <Landing />}
      <AchievementToast />
    </>
  );
}
