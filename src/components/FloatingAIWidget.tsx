import { Icon } from '@iconify/react';
import { useState, useRef, useEffect } from 'react';

/* ── SparkIcon ── */
function SparkIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} fill="none" className={className}>
      <path
        d="M10 1C10 1 11.2 6.5 13.5 8.5C15.8 10.5 19 10 19 10C19 10 15.8 9.5 13.5 11.5C11.2 13.5 10 19 10 19C10 19 8.8 13.5 6.5 11.5C4.2 9.5 1 10 1 10C1 10 4.2 10.5 6.5 8.5C8.8 6.5 10 1 10 1Z"
        fill="currentColor"
      />
    </svg>
  );
}

const THINKING_PHRASES = [
  'Brewing something up', 'Almost there', 'One moment', 'Bear with me',
  'Give me a sec', 'Working some magic', 'Let me check on that',
  'Pulling some strings', 'Getting the good stuff', 'On the case',
  'Digging in', 'On it', 'Hang tight', 'Working on it',
  'Looking into it', 'Cooking something up', 'Connecting the dots',
  'Getting that for you', 'One sec', 'Hold that thought',
  'Pulling that up', 'Almost got it', 'Sorting it out',
];

const MOCK_RESPONSES: Record<string, string> = {
  default: `Here's what I found:\n\n• Your pipeline has **12 active deals** totaling ฿2.4M\n• 3 quotes awaiting response for 7+ days\n• Top account: **Apex Technologies** (฿480K)\n\nWant me to dig deeper?`,
  email: `Here's a draft:\n\n**Subject:** Following up on your quote\n\nHi there,\n\nJust checking in on the proposal we sent. Happy to adjust terms.\n\nWould a 15-min call work this week?`,
  pipeline: `**Pipeline Summary:**\n\n• 🟢 4 in negotiation\n• 🟡 5 awaiting decision\n• 🔴 3 overdue\n\nClose rate: **34%** (+8% QoQ)`,
};

const QUICK_ACTIONS = [
  { label: 'Check my pipeline', icon: 'solar:chart-2-linear' },
  { label: 'Draft a follow-up email', icon: 'solar:letter-linear' },
  { label: 'Show top accounts', icon: 'solar:buildings-2-linear' },
  { label: 'Generate a quote', icon: 'solar:document-text-linear' },
];

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface FloatingAIWidgetProps {
  isVisible: boolean;
}

export default function FloatingAIWidget({ isVisible }: FloatingAIWidgetProps) {
  const [dismissed, setDismissed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [thinkingPhrase, setThinkingPhrase] = useState('thinking');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);
  const [chatSize, setChatSize] = useState({ w: 400, h: 520 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeEdge, setResizeEdge] = useState<'corner' | 'top' | 'left'>('corner');
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const phraseQueueRef = useRef<string[]>([]);

  const getNextPhrase = () => {
    if (phraseQueueRef.current.length === 0) {
      const shuffled = [...THINKING_PHRASES];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      phraseQueueRef.current = shuffled;
    }
    return phraseQueueRef.current.pop()!;
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const getResponse = (input: string): string => {
    const lower = input.toLowerCase();
    if (lower.includes('email') || lower.includes('follow') || lower.includes('draft')) return MOCK_RESPONSES.email;
    if (lower.includes('pipeline') || lower.includes('summary') || lower.includes('overview')) return MOCK_RESPONSES.pipeline;
    return MOCK_RESPONSES.default;
  };

  const renderContent = (text: string) =>
    text.split('\n').map((line, i) => (
      <p
        key={i}
        className={line === '' ? 'h-2' : 'leading-relaxed'}
        dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-slate-800">$1</strong>') }}
      />
    ));

  const handleSubmit = (content?: string) => {
    const text = (content ?? inputValue).trim();
    if (!text || isTyping) return;

    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: text }]);
    setInputValue('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
    setThinkingPhrase(getNextPhrase());
    setIsTyping(true);

    setTimeout(() => {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: getResponse(text) }]);
      setIsTyping(false);
      inputRef.current?.focus();
    }, 3500);
  };

  /* ── Drag handlers ── */
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setHasDragged(false);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      setHasDragged(true);
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    };
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  /* ── Resize handlers ── */
  const handleResizeStart = (edge: 'corner' | 'top' | 'left') => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeEdge(edge);
    resizeStart.current = { x: e.clientX, y: e.clientY, w: chatSize.w, h: chatSize.h };
  };

  useEffect(() => {
    if (!isResizing) return;
    const handleMouseMove = (e: MouseEvent) => {
      const dw = resizeStart.current.x - e.clientX;
      const dh = resizeStart.current.y - e.clientY;
      setChatSize(prev => ({
        w: resizeEdge === 'top' ? prev.w : Math.max(340, Math.min(640, resizeStart.current.w + dw)),
        h: resizeEdge === 'left' ? prev.h : Math.max(400, Math.min(900, resizeStart.current.h + dh)),
      }));
    };
    const handleMouseUp = () => setIsResizing(false);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeEdge]);

  const handlePillClick = () => {
    if (!hasDragged) setIsOpen(!isOpen);
  };

  if (!isVisible || dismissed) return null;

  const hasMessages = messages.length > 0 || isTyping;

  return (
    <>
      <style>{`
        @keyframes widget-entrance {
          0% { opacity: 0; transform: translateY(16px) scale(0.9); }
          60% { opacity: 1; transform: translateY(-2px) scale(1.01); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes chat-open {
          from { opacity: 0; transform: translateY(12px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes widget-spark-shimmer {
          0%, 100% { opacity: 0.3; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @keyframes widget-text-shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .widget-shimmer-text {
          background: linear-gradient(90deg, #64748b 0%, #64748b 30%, #f1f5f9 50%, #64748b 70%, #64748b 100%);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: widget-text-shimmer 3s ease-in-out infinite;
        }
        @keyframes msg-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .widget-msg-in {
          animation: msg-in 300ms cubic-bezier(0.16,1,0.3,1) both;
        }
      `}</style>

      <div
        className="fixed z-[55]"
        style={{
          bottom: '24px',
          right: '24px',
          transform: `translate(${position.x}px, ${position.y}px)`,
          animation: 'widget-entrance 500ms cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Chat card */}
        {isOpen && (
          <div
            className="absolute bottom-14 right-0 bg-white rounded-2xl overflow-hidden flex flex-col"
            style={{
              animation: isResizing ? 'none' : 'chat-open 300ms cubic-bezier(0.16,1,0.3,1)',
              width: `${chatSize.w}px`,
              height: `${chatSize.h}px`,
              boxShadow: '0 32px 80px -12px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.03), 0 0 60px -20px rgba(0,0,0,0.06)',
            }}
          >
            {/* Resize handles */}
            {/* Top edge */}
            <div onMouseDown={handleResizeStart('top')} className="absolute top-0 left-4 right-0 h-2 cursor-n-resize z-10" />
            {/* Left edge */}
            <div onMouseDown={handleResizeStart('left')} className="absolute top-4 left-0 bottom-0 w-2 cursor-w-resize z-10" />
            {/* Top-left corner */}
            <div
              onMouseDown={handleResizeStart('corner')}
              className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-20 group"
            >
              <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 rounded-sm border-t-[1.5px] border-l-[1.5px] border-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <SparkIcon size={14} className="text-slate-700" />
                <span className="text-[13px] font-semibold text-slate-800 tracking-tight">AI Proxy</span>
              </div>
              <div className="flex items-center gap-0.5">
                {hasMessages && (
                  <button
                    onClick={() => { setMessages([]); setInputValue(''); }}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-all"
                    title="New conversation"
                  >
                    <Icon icon="solar:pen-new-square-linear" width="14" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-all"
                >
                  <Icon icon="solar:alt-arrow-down-linear" width="16" />
                </button>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
              {/* Empty state */}
              {!hasMessages && (
                <div className="flex flex-col py-4">
                  <p className="text-[13px] font-medium text-slate-500 mb-4">What would you like to do?</p>

                  <div className="w-full space-y-1.5">
                    {QUICK_ACTIONS.map((action) => (
                      <button
                        key={action.label}
                        onClick={() => handleSubmit(action.label)}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left text-[12px] font-medium text-slate-500 border border-slate-100 hover:border-slate-200 hover:bg-slate-50/80 transition-all group"
                      >
                        <Icon icon={action.icon} width="14" className="text-slate-400 group-hover:text-slate-500 transition-colors flex-shrink-0" />
                        {action.label}
                        <Icon icon="solar:arrow-right-linear" width="12" className="ml-auto text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              {hasMessages && (
                <div className="space-y-4">
                  {messages.map((msg, i) => (
                    <div key={msg.id} className="widget-msg-in" style={{ animationDelay: `${i * 30}ms` }}>
                      {msg.role === 'user' ? (
                        <div className="flex justify-end">
                          <div className="max-w-[82%] rounded-2xl px-3.5 py-2.5 bg-slate-100/80 text-slate-900 text-[13px] leading-relaxed">
                            {msg.content}
                          </div>
                        </div>
                      ) : (
                        <div className="text-[13px] text-slate-600 leading-relaxed space-y-0.5">
                          {renderContent(msg.content)}
                        </div>
                      )}
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex items-center gap-2 widget-msg-in">
                      <span style={{ animation: 'widget-spark-shimmer 3s ease-in-out infinite' }} className="text-slate-400">
                        <SparkIcon size={12} />
                      </span>
                      <span className="text-[13px] font-normal widget-shimmer-text">{thinkingPhrase}...</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Credit bar */}
            <div className="flex items-center justify-between px-3.5 py-1.5 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <Icon icon="solar:bolt-linear" width="11" className="text-slate-400" />
                <span className="text-[10px] font-semibold text-slate-500">159K</span>
                <span className="text-[10px] text-slate-400">credits</span>
              </div>
              <button className="text-[10px] font-medium text-indigo-500 hover:text-indigo-600 transition-colors">
                Get more
              </button>
            </div>

            {/* Input */}
            <div className="border-t border-slate-100 px-3.5 py-3">
              <div className="flex items-end gap-2.5">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
                  placeholder="Ask, run a task, or make a call..."
                  disabled={isTyping}
                  className="flex-1 bg-transparent text-slate-800 placeholder-slate-400 text-[13px] resize-none outline-none leading-5 max-h-[60px] py-1 disabled:opacity-50 overflow-y-auto"
                  rows={1}
                  onInput={(e) => {
                    const t = e.target as HTMLTextAreaElement;
                    t.style.height = 'auto';
                    t.style.height = `${Math.min(t.scrollHeight, 60)}px`;
                  }}
                />
                <button
                  onClick={() => handleSubmit()}
                  disabled={!inputValue.trim() || isTyping}
                  className="w-7 h-7 flex items-center justify-center bg-slate-900 hover:bg-slate-700 disabled:opacity-20 text-white rounded-lg transition-all flex-shrink-0 mb-px active:scale-95"
                >
                  <Icon icon="solar:arrow-up-outline" width="14" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating pill */}
        <div
          ref={pillRef}
          onMouseDown={handleMouseDown}
          onClick={handlePillClick}
          className="group relative flex items-center gap-2 pl-3 pr-3.5 py-2 rounded-full cursor-pointer select-none bg-slate-900 shadow-[0_2px_4px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.12),0_24px_48px_rgba(0,0,0,0.08)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_12px_32px_rgba(0,0,0,0.16),0_32px_56px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.97]"
        >
          <SparkIcon size={13} className="flex-shrink-0 text-white" />
          <span className="text-[12px] font-semibold tracking-tight text-white">AI Proxy</span>
          <button
            onClick={(e) => { e.stopPropagation(); setDismissed(true); setIsOpen(false); }}
            className="absolute -top-1 -right-1 w-[18px] h-[18px] flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border border-slate-200/80 shadow-sm transition-all duration-200 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 hover:border-slate-300 hover:shadow-md active:scale-90"
          >
            <svg width="7" height="7" viewBox="0 0 10 10" fill="none"><path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>
    </>
  );
}
