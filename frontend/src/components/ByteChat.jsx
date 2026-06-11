import { useState, useRef, useEffect } from 'react';
import { streamChat } from '../api/client';
import { useStore } from '../store/gameStore';
import { Spinner, ModelBadge } from './UI';

const BYTE_MODES = [
  { id: 'mentor', label: 'Mentor', icon: '🤖', desc: 'Guided learning' },
  { id: 'eli5',   label: 'ELI5',   icon: '🧸', desc: 'Simple explanations' },
];

export default function ByteChat({ currentChapter = '', currentProblem = '', onClose }) {
  const { getLearningProfile, playerName } = useStore();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hey ${playerName}! I'm Byte — your AI coding mentor. What are you working on or stuck with? 🤖` }
  ]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [mode, setMode] = useState('mentor');
  const [lastModel, setLastModel] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  const send = () => {
    const msg = input.trim();
    if (!msg || streaming) return;
    setInput('');

    const newMessages = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    setStreaming(true);
    setStreamingText('');

    const profile = getLearningProfile();

    abortRef.current = streamChat(
      {
        message: msg,
        history: newMessages.slice(-8).map(m => ({ role: m.role, content: m.content })),
        current_chapter: currentChapter,
        current_problem: currentProblem,
        session_id: profile.session_id,
        profile,
        mode,
      },
      (chunk) => {
        setStreamingText(prev => prev + chunk);
      },
      () => {
        setStreamingText(prev => {
          setMessages(msgs => [...msgs, { role: 'assistant', content: prev }]);
          setLastModel('gemini/gemini-2.5-flash');
          return '';
        });
        setStreaming(false);
      },
      (err) => {
        setMessages(msgs => [...msgs, { role: 'assistant', content: `Sorry, I ran into an issue: ${err}. Try again!` }]);
        setStreaming(false);
        setStreamingText('');
      }
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: 'var(--white)', borderLeft: '1px solid var(--border)',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'var(--white)',
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: '50%', background: 'var(--ink)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
        }}>🤖</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--ink)' }}>
            Byte
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--ink4)' }}>AI mentor · Gemini powered</div>
        </div>

        {/* Mode selector */}
        <div style={{ display: 'flex', gap: 4, background: 'var(--parchment)', borderRadius: 8, padding: 3 }}>
          {BYTE_MODES.map(m => (
            <button key={m.id} onClick={() => setMode(m.id)} style={{
              padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
              background: mode === m.id ? 'var(--white)' : 'transparent',
              color: mode === m.id ? 'var(--ink)' : 'var(--ink4)',
              fontSize: '0.75rem', fontWeight: 600,
              boxShadow: mode === m.id ? 'var(--shadow-xs)' : 'none',
              transition: 'all 0.15s',
            }}>
              {m.icon} {m.label}
            </button>
          ))}
        </div>

        {onClose && (
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: '4px 8px' }}>✕</button>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex', gap: 10,
            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
            alignItems: 'flex-start',
          }}>
            {msg.role === 'assistant' && (
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', flexShrink: 0, marginTop: 2 }}>
                🤖
              </div>
            )}
            <div style={{
              maxWidth: '80%',
              padding: '10px 14px',
              borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: msg.role === 'user' ? 'var(--ink)' : 'var(--parchment)',
              color: msg.role === 'user' ? 'var(--white)' : 'var(--ink)',
              fontSize: '0.88rem',
              lineHeight: 1.6,
              border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
              fontFamily: 'var(--font-sans)',
              whiteSpace: 'pre-wrap',
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* Streaming bubble */}
        {streaming && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', flexShrink: 0, marginTop: 2 }}>
              🤖
            </div>
            <div style={{
              maxWidth: '80%', padding: '10px 14px',
              borderRadius: '16px 16px 16px 4px',
              background: 'var(--parchment)', border: '1px solid var(--border)',
              fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--ink)',
              whiteSpace: 'pre-wrap',
            }}>
              {streamingText || <Spinner size={14} />}
              {streamingText && <span className="typing-cursor" />}
            </div>
          </div>
        )}

        {lastModel && !streaming && messages.length > 1 && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', paddingLeft: 38 }}>
            <ModelBadge model={lastModel} />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', background: 'var(--white)' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Byte anything..."
            disabled={streaming}
            rows={1}
            style={{
              flex: 1,
              fontFamily: 'var(--font-sans)',
              fontSize: '0.88rem',
              background: 'var(--parchment)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '9px 12px',
              color: 'var(--ink)',
              outline: 'none',
              resize: 'none',
              lineHeight: 1.5,
            }}
          />
          <button
            onClick={send}
            disabled={!input.trim() || streaming}
            className="btn btn-primary"
            style={{ padding: '9px 16px', alignSelf: 'flex-end' }}
          >
            {streaming ? <Spinner size={14} color="var(--white)" /> : '→'}
          </button>
        </div>
        <div style={{ marginTop: 6, fontSize: '0.7rem', color: 'var(--ink4)' }}>
          Shift+Enter for new line · Gemini Flash streaming
        </div>
      </div>
    </div>
  );
}
