import { useEffect, useState } from 'react';
import { useStore, ACHIEVEMENTS } from '../store/gameStore';

// ── Model Badge ───────────────────────────────────────────
export function ModelBadge({ model }) {
  if (!model) return null;
  const isCached = model === 'cached';
  const isClaude = model.includes('claude');
  const isGemini = model.includes('gemini');
  const isFallback = model.includes('fallback');

  return (
    <span className={`model-badge ${isCached ? 'model-cached' : isClaude ? 'model-claude' : 'model-gemini'}`}>
      {isCached ? '⚡ cached' : isClaude ? '◆ Claude' : '✦ Gemini'}
      {isFallback && ' ↩'}
    </span>
  );
}

// ── Difficulty Badge ──────────────────────────────────────
export function DiffBadge({ difficulty }) {
  const cls = { Easy: 'badge-easy', Medium: 'badge-medium', Hard: 'badge-hard' };
  return <span className={`badge ${cls[difficulty] || 'badge-ink'}`}>{difficulty}</span>;
}

// ── XP Bar ────────────────────────────────────────────────
export function XPBar({ compact = false }) {
  const { xp, level, getLevelTitle, getXPProgress } = useStore();
  const progress = getXPProgress();

  if (compact) {
    return (
      <div className="flex items-center gap-2" style={{ minWidth: 0 }}>
        <span style={{
          background: 'var(--ink)', color: 'var(--white)',
          fontFamily: 'var(--font-sans)', fontWeight: 700,
          fontSize: '0.72rem', padding: '2px 8px', borderRadius: 6,
          flexShrink: 0,
        }}>Lv {level}</span>
        <div className="progress-track" style={{ flex: 1 }}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span style={{ color: 'var(--ink4)', fontSize: '0.72rem', flexShrink: 0 }}>{xp} XP</span>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--parchment)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px' }}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span style={{ background: 'var(--ink)', color: 'var(--white)', fontWeight: 700, fontSize: '0.78rem', padding: '3px 10px', borderRadius: 6, fontFamily: 'var(--font-sans)' }}>
            Level {level}
          </span>
          <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--accent)', fontSize: '0.9rem' }}>
            {getLevelTitle()}
          </span>
        </div>
        <span style={{ color: 'var(--ink4)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>{xp} XP</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div style={{ textAlign: 'right', marginTop: 4 }}>
        <span style={{ color: 'var(--ink4)', fontSize: '0.7rem' }}>{Math.round(progress)}% to Level {level + 1}</span>
      </div>
    </div>
  );
}

// ── Achievement Toast ─────────────────────────────────────
export function AchievementToast() {
  const { pendingAchievement, clearPendingAchievement } = useStore();
  const [ach, setAch] = useState(null);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    if (!pendingAchievement) return;
    const found = ACHIEVEMENTS.find(a => a.id === pendingAchievement);
    if (!found) return;
    setAch(found);
    setHiding(false);
    const hideTimer = setTimeout(() => setHiding(true), 3500);
    const clearTimer = setTimeout(() => { setAch(null); clearPendingAchievement(); }, 4000);
    return () => { clearTimeout(hideTimer); clearTimeout(clearTimer); };
  }, [pendingAchievement]);

  if (!ach) return null;

  const rarityColors = { common: 'var(--green)', rare: 'var(--blue)', epic: 'var(--accent-dk)', legendary: '#8B5CF6' };

  return (
    <div className={`achievement-toast ${hiding ? 'hiding' : ''}`}>
      <div style={{ fontSize: '2rem', lineHeight: 1 }}>{ach.icon}</div>
      <div>
        <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', color: rarityColors[ach.rarity], textTransform: 'uppercase', marginBottom: 2 }}>
          Achievement Unlocked
        </div>
        <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, color: 'var(--ink)', fontSize: '0.95rem' }}>{ach.title}</div>
        <div style={{ color: 'var(--ink3)', fontSize: '0.8rem' }}>{ach.desc}</div>
      </div>
    </div>
  );
}

// ── XP Popup ──────────────────────────────────────────────
export function XPPopup({ amount, x, y, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 1300); return () => clearTimeout(t); }, []);
  return (
    <div className="xp-popup" style={{ left: x, top: y }}>
      +{amount} XP
    </div>
  );
}

// ── Daily Quests Card ─────────────────────────────────────
export function DailyQuestsCard() {
  const { dailyQuests } = useStore();
  const done = dailyQuests.filter(q => q.progress >= q.target).length;

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div className="flex justify-between items-center" style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '0.95rem' }}>Daily Quests</span>
        <span style={{ fontSize: '0.78rem', color: 'var(--ink3)', fontFamily: 'var(--font-mono)' }}>{done}/{dailyQuests.length}</span>
      </div>
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {dailyQuests.map(q => {
          const complete = q.progress >= q.target;
          return (
            <div key={q.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 10,
              background: complete ? 'var(--green-lt)' : 'var(--parchment)',
              border: `1px solid ${complete ? '#C3E6D0' : 'var(--border)'}`,
              transition: 'all 0.2s',
            }}>
              <span style={{ fontSize: '1.1rem', opacity: complete ? 1 : 0.7 }}>{complete ? '✅' : q.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 500, color: complete ? 'var(--green)' : 'var(--ink)' }}>{q.title}</div>
              </div>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: complete ? 'var(--green)' : 'var(--amber)' }}>
                {complete ? 'Done' : `+${q.xp} XP`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Top Nav ───────────────────────────────────────────────
export function TopNav({ onBack, title, right, center }) {
  return (
    <div className="topnav">
      {onBack && (
        <button onClick={onBack} className="btn btn-ghost btn-sm" style={{ padding: '6px 10px' }}>
          ← Back
        </button>
      )}
      {title && (
        <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1rem', color: 'var(--ink)', flex: center ? 'none' : 1 }}>
          {title}
        </span>
      )}
      {center && <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>{center}</div>}
      {right && <div style={{ marginLeft: 'auto' }}>{right}</div>}
    </div>
  );
}

// ── Streak Badge ──────────────────────────────────────────
export function StreakBadge() {
  const { streak, getStreakMultiplier } = useStore();
  const mult = getStreakMultiplier();
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 12px', borderRadius: 99,
      background: streak > 0 ? 'var(--amber-lt)' : 'var(--parchment2)',
      border: `1px solid ${streak > 0 ? '#E6C96A' : 'var(--border)'}`,
      color: streak > 0 ? 'var(--amber)' : 'var(--ink4)',
      fontSize: '0.82rem', fontWeight: 600,
    }}>
      🔥 {streak}d
      {mult > 1 && <span style={{ fontSize: '0.68rem', background: 'var(--amber)', color: '#fff', borderRadius: 4, padding: '0px 5px', fontWeight: 700 }}>{mult}×</span>}
    </div>
  );
}

// ── Spinner ───────────────────────────────────────────────
export function Spinner({ size = 18, color = 'var(--accent)' }) {
  return (
    <div style={{
      width: size, height: size, border: `2px solid ${color}22`,
      borderTop: `2px solid ${color}`, borderRadius: '50%',
      animation: 'spin 0.7s linear infinite', flexShrink: 0,
    }} />
  );
}

// ── Backend Status Pill ───────────────────────────────────
export function BackendStatus() {
  const { backendOnline } = useStore();
  if (backendOnline === null) return null;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 99, fontSize: '0.72rem', fontWeight: 600,
      background: backendOnline ? 'var(--green-lt)' : 'var(--red-lt)',
      color: backendOnline ? 'var(--green)' : 'var(--red)',
      border: `1px solid ${backendOnline ? '#C3E6D0' : '#F5C6C2'}`,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
      {backendOnline ? 'API connected' : 'API offline'}
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────
export function EmptyState({ emoji, title, desc, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--ink3)' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{emoji}</div>
      <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, color: 'var(--ink2)', fontSize: '1.1rem', marginBottom: 6 }}>{title}</div>
      <p style={{ fontSize: '0.88rem', color: 'var(--ink4)', marginBottom: action ? 20 : 0 }}>{desc}</p>
      {action}
    </div>
  );
}

// ── Phase pill ────────────────────────────────────────────
export function PhasePill({ phase }) {
  const colors = {
    phase1: { bg: 'var(--green-lt)', color: 'var(--green)', border: '#C3E6D0' },
    phase2: { bg: 'var(--blue-lt)', color: 'var(--blue-dk)', border: '#BBDEFB' },
    phase3: { bg: '#F3E8FF', color: '#6D28D9', border: '#DDD6FE' },
    phase4: { bg: 'var(--amber-lt)', color: 'var(--amber)', border: '#E6C96A' },
    phase5: { bg: 'var(--red-lt)', color: 'var(--red)', border: '#F5C6C2' },
    phase6: { bg: 'var(--accent-lt)', color: 'var(--accent-dk)', border: '#F5C6C2' },
  };
  const c = colors[phase.id] || colors.phase1;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 99, fontSize: '0.72rem', fontWeight: 600, background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
      {phase.emoji} {phase.title}
    </span>
  );
}

// ── Section header ────────────────────────────────────────
export function SectionHeader({ label, action }) {
  return (
    <div className="flex justify-between items-center" style={{ marginBottom: 14 }}>
      <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, color: 'var(--ink)', fontSize: '1rem' }}>{label}</h3>
      {action}
    </div>
  );
}
