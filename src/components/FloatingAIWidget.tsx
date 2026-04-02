import { Icon } from '@iconify/react';
import { useState, useRef, useEffect } from 'react';
import type { ContactDetail } from './Contacts';
import type { Company } from './Companies';
import type { Product } from './Products';
import {
  type EntityAction,
  type DocumentCard,
  type ToolCallStep,
  getAIResponse,
  MOCK_RESPONSES,
} from '../lib/aiResponseEngine';

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

const QUICK_ACTIONS = [
  { label: 'Follow up on a quote', icon: 'solar:letter-linear', command: 'Follow up on a quote' },
  { label: 'Add a contact', icon: 'solar:user-plus-linear', command: 'create contact New Lead' },
  { label: 'Create a new quote', icon: 'solar:document-add-linear', command: 'generate quote for Apex Technologies' },
  { label: 'Summarize my day', icon: 'solar:calendar-minimalistic-linear', command: 'Summarize my day' },
];

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'tool';
  content: string;
  entityAction?: EntityAction;
  documentCard?: DocumentCard;
  toolCall?: ToolCallStep;
  toolCompleted?: boolean;
}

interface FloatingAIWidgetProps {
  isVisible: boolean;
  dismissed: boolean;
  onDismiss: () => void;
  onGetMoreCredits?: () => void;
  onViewContact?: (contact: ContactDetail) => void;
  onViewCompany?: (company: Company) => void;
  onViewProduct?: (product: Product) => void;
}

export default function FloatingAIWidget({ isVisible, dismissed, onDismiss, onGetMoreCredits, onViewContact, onViewCompany, onViewProduct }: FloatingAIWidgetProps) {
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

    // Add user message
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: text }]);
    setInputValue('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
    setThinkingPhrase(getNextPhrase());
    setIsTyping(true);

    // Compute response immediately to know if tool call needed
    const response = getAIResponse(text);

    if (response.toolCall) {
      // Three-phase flow: thinking -> tool executing -> result
      setTimeout(() => {
        setIsTyping(false);
        // Insert tool call message
        const toolMsgId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, {
          id: toolMsgId,
          role: 'tool',
          content: response.toolCall!.description,
          toolCall: response.toolCall,
          toolCompleted: false,
        }]);

        // After tool execution delay, mark complete + add assistant response
        setTimeout(() => {
          // Mark tool as completed
          setMessages(prev => prev.map(m => m.id === toolMsgId ? { ...m, toolCompleted: true } : m));

          // Add assistant response after brief checkmark pause
          setTimeout(() => {
            setMessages(prev => [...prev, {
              id: (Date.now() + 2).toString(),
              role: 'assistant',
              content: response.content,
              entityAction: response.entityAction,
              documentCard: response.documentCard,
            }]);
            inputRef.current?.focus();
          }, 300);
        }, 1800);
      }, 1200);
    } else {
      // Simple text response — standard flow
      setTimeout(() => {
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: response.content }]);
        setIsTyping(false);
        inputRef.current?.focus();
      }, 2500);
    }
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
        @keyframes pill-pulse-ring {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.08); opacity: 0; }
          100% { transform: scale(1.08); opacity: 0; }
        }
        @keyframes pill-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pill-progress-sweep {
          0% { left: -33%; }
          100% { left: 100%; }
        }
        @keyframes widget-tool-enter {
          0% { opacity: 0; transform: translateX(-4px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes widget-tool-spinner {
          to { transform: rotate(360deg); }
        }
        @keyframes widget-tool-check {
          0% { stroke-dashoffset: 12; opacity: 0.4; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes widget-tool-line-sweep {
          0% { transform: scaleX(0); transform-origin: left; }
          100% { transform: scaleX(1); transform-origin: left; }
        }
        @keyframes widget-tool-text-fade {
          0% { opacity: 0; transform: translateX(-3px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .widget-tool-line {
          animation: widget-tool-enter 350ms cubic-bezier(0.16,1,0.3,1) both;
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
            <div onMouseDown={handleResizeStart('top')} className="absolute top-0 left-4 right-0 h-2 cursor-n-resize z-10" />
            <div onMouseDown={handleResizeStart('left')} className="absolute top-4 left-0 bottom-0 w-2 cursor-w-resize z-10" />
            <div
              onMouseDown={handleResizeStart('corner')}
              className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-20 group"
            >
              <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 rounded-sm border-t-[1.5px] border-l-[1.5px] border-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Header — draggable */}
            <div
              className="flex items-center justify-between px-4 py-3 cursor-grab active:cursor-grabbing select-none"
              onMouseDown={(e) => {
                if ((e.target as HTMLElement).closest('button')) return;
                setIsDragging(true);
                setHasDragged(false);
                setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
              }}
            >
              <div className="flex items-center">
                <img
                  src="/superproxy-logo.png"
                  alt="Superproxy"
                  className="h-[24px] w-auto object-contain"
                />
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
                        onClick={() => handleSubmit(action.command)}
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
                      {/* User message */}
                      {msg.role === 'user' && (
                        <div className="flex justify-end">
                          <div className="max-w-[82%] rounded-2xl px-3.5 py-2.5 bg-slate-100/80 text-slate-900 text-[13px] leading-relaxed">
                            {msg.content}
                          </div>
                        </div>
                      )}

                      {/* Tool call indicator */}
                      {msg.role === 'tool' && msg.toolCall && (
                        <div className="widget-tool-line pl-3.5 py-0.5">
                          <div className="flex items-center gap-2">
                            {/* Hairline left accent */}
                            <div className="relative flex items-center gap-2 flex-1 min-w-0">
                              <div
                                className="absolute left-[-14px] top-[3px] bottom-[3px] w-[1.5px] rounded-full bg-slate-300"
                                style={!msg.toolCompleted ? { animation: 'widget-tool-line-sweep 400ms cubic-bezier(0.16,1,0.3,1) both' } : undefined}
                              />
                              <Icon
                                icon={msg.toolCall.icon}
                                width="12"
                                className={`flex-shrink-0 transition-colors duration-300 ${msg.toolCompleted ? 'text-slate-400' : 'text-slate-400'}`}
                              />
                              <span
                                className={`text-[11px] tracking-[-0.01em] flex-1 truncate transition-colors duration-300 ${msg.toolCompleted ? 'text-slate-400' : 'text-slate-500 font-medium'}`}
                                style={{ animation: 'widget-tool-text-fade 300ms cubic-bezier(0.16,1,0.3,1) 80ms both' }}
                              >
                                {msg.toolCall.description}
                              </span>
                            </div>
                            {/* Status: spinner or checkmark */}
                            {msg.toolCompleted ? (
                              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="flex-shrink-0">
                                <path
                                  d="M2.5 6.5L5 9L9.5 3.5"
                                  stroke="#94a3b8"
                                  strokeWidth="1.25"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeDasharray="12"
                                  style={{ animation: 'widget-tool-check 350ms ease-out forwards' }}
                                />
                              </svg>
                            ) : (
                              <div
                                className="w-[10px] h-[10px] rounded-full border border-slate-300 border-t-slate-500 flex-shrink-0"
                                style={{ animation: 'widget-tool-spinner 0.8s linear infinite' }}
                              />
                            )}
                          </div>
                        </div>
                      )}

                      {/* Assistant message */}
                      {msg.role === 'assistant' && (
                        <div className="group">
                          <div className="text-[13px] text-slate-600 leading-relaxed space-y-0.5">
                            {renderContent(msg.content)}
                          </div>

                          {/* Entity inline preview — compact */}
                          {msg.entityAction && (() => {
                            const action = msg.entityAction!;

                            if (action.type === 'contact' && action.contact) {
                              const c = action.contact;
                              return (
                                <div className="mt-2.5">
                                  <div className="border-l-[1.5px] border-blue-400 pl-3 py-1">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[12px] font-semibold text-slate-800 truncate">{c.name}</span>
                                      {c.title && <><span className="text-slate-300">·</span><span className="text-[10px] text-slate-400 truncate">{c.title}</span></>}
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-0.5 truncate">
                                      {c.email && <span className="text-[11px] text-slate-400 truncate">{c.email}</span>}
                                      {c.company && <><span className="text-slate-300">·</span><span className="text-[11px] text-slate-400 truncate">{c.company}</span></>}
                                    </div>
                                    <button
                                      onClick={() => onViewContact?.(c)}
                                      className="inline-flex items-center gap-1 mt-2.5 px-2.5 py-1 text-[10px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/80 rounded-lg transition-all active:scale-[0.97]"
                                    >
                                      <Icon icon="solar:arrow-right-up-linear" width="11" />
                                      View Contact
                                    </button>
                                  </div>
                                </div>
                              );
                            }

                            if (action.type === 'company' && action.company) {
                              const co = action.company;
                              return (
                                <div className="mt-2.5">
                                  <div className="border-l-[1.5px] border-violet-400 pl-3 py-1">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[12px] font-semibold text-slate-800 truncate">{co.name}</span>
                                      {co.type && <><span className="text-slate-300">·</span><span className="text-[10px] text-slate-400">{co.type}</span></>}
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-0.5 truncate">
                                      {co.industry && <span className="text-[11px] text-slate-400">{co.industry}</span>}
                                      {co.lifecycleStage && <><span className="text-slate-300">·</span><span className="text-[11px] text-slate-400">{co.lifecycleStage}</span></>}
                                    </div>
                                    <button
                                      onClick={() => onViewCompany?.(co)}
                                      className="inline-flex items-center gap-1 mt-2.5 px-2.5 py-1 text-[10px] font-semibold text-violet-600 hover:text-violet-700 bg-violet-50 hover:bg-violet-100/80 rounded-lg transition-all active:scale-[0.97]"
                                    >
                                      <Icon icon="solar:arrow-right-up-linear" width="11" />
                                      View Company
                                    </button>
                                  </div>
                                </div>
                              );
                            }

                            if (action.type === 'product' && action.product) {
                              const p = action.product;
                              return (
                                <div className="mt-2.5">
                                  <div className="border-l-[1.5px] border-amber-400 pl-3 py-1">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[12px] font-semibold text-slate-800 truncate">{p.name}</span>
                                      <span className="text-slate-300">·</span>
                                      <span className={`text-[10px] font-medium ${p.status === 'active' ? 'text-emerald-600' : p.status === 'draft' ? 'text-slate-400' : 'text-amber-600'}`}>
                                        {p.status === 'active' ? 'Active' : p.status === 'draft' ? 'Draft' : p.status === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-0.5 truncate">
                                      <span className="text-[11px] text-slate-400">SKU: {p.sku}</span>
                                      <span className="text-slate-300">·</span>
                                      <span className="text-[11px] font-medium text-slate-600">฿{p.price.toLocaleString()}</span>
                                      <span className="text-slate-300">·</span>
                                      <span className="text-[11px] text-slate-400">{p.stock} in stock</span>
                                    </div>
                                    <button
                                      onClick={() => onViewProduct?.(p)}
                                      className="inline-flex items-center gap-1 mt-2.5 px-2.5 py-1 text-[10px] font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100/80 rounded-lg transition-all active:scale-[0.97]"
                                    >
                                      <Icon icon="solar:arrow-right-up-linear" width="11" />
                                      View Product
                                    </button>
                                  </div>
                                </div>
                              );
                            }

                            return null;
                          })()}

                          {/* Document card — quote */}
                          {msg.documentCard && msg.documentCard.type === 'quote' && msg.documentCard.quotation && (() => {
                            const q = msg.documentCard.quotation;
                            const validDate = new Date(q.validUntil);
                            const formattedValid = validDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            const statusColor = q.status === 'published' ? 'text-emerald-600' : q.status === 'sent' ? 'text-blue-600' : 'text-slate-400';
                            const statusLabel = q.status === 'published' ? 'Published' : q.status === 'sent' ? 'Sent' : 'Draft';
                            return (
                              <div className="mt-2.5">
                                <div className="border-l-[1.5px] border-emerald-400 pl-3 py-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[12px] font-semibold text-slate-800 tracking-tight">{q.number}</span>
                                    <span className="text-slate-300">·</span>
                                    <span className={`text-[10px] font-medium ${statusColor}`}>{statusLabel}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 mt-0.5 truncate">
                                    <span className="text-[11px] font-medium text-slate-600">{q.client.name}</span>
                                    <span className="text-slate-300">·</span>
                                    <span className="text-[11px] text-slate-400">{q.items} items</span>
                                    <span className="text-slate-300">·</span>
                                    <span className="text-[11px] font-medium text-slate-600">฿{q.amount.toLocaleString()}</span>
                                    <span className="text-slate-300">·</span>
                                    <span className="text-[11px] text-slate-400">Valid {formattedValid}</span>
                                  </div>
                                  <button
                                    onClick={() => {
                                      const url = new URL(window.location.href);
                                      url.searchParams.set('view', 'quote');
                                      window.open(url.toString(), '_blank');
                                    }}
                                    className="inline-flex items-center gap-1 mt-2.5 px-2.5 py-1 text-[10px] font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 rounded-lg transition-all active:scale-[0.97]"
                                  >
                                    <Icon icon="solar:arrow-right-up-linear" width="11" />
                                    View Quote
                                  </button>
                                </div>
                              </div>
                            );
                          })()}

                          {/* Document card — invoice */}
                          {msg.documentCard && msg.documentCard.type === 'invoice' && msg.documentCard.invoice && (() => {
                            const inv = msg.documentCard.invoice;
                            const dueDate = new Date(inv.dueDate);
                            const formattedDue = dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            const statusColor = inv.status === 'paid' ? 'text-emerald-600' : inv.status === 'pending' ? 'text-amber-600' : inv.status === 'overdue' ? 'text-red-600' : 'text-slate-400';
                            const statusLabel = inv.status === 'paid' ? 'Paid' : inv.status === 'pending' ? 'Pending' : inv.status === 'overdue' ? 'Overdue' : 'Draft';
                            return (
                              <div className="mt-2.5">
                                <div className="border-l-[1.5px] border-sky-400 pl-3 py-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[12px] font-semibold text-slate-800 tracking-tight">{inv.number}</span>
                                    <span className="text-slate-300">·</span>
                                    <span className={`text-[10px] font-medium ${statusColor}`}>{statusLabel}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 mt-0.5 truncate">
                                    <span className="text-[11px] font-medium text-slate-600">{inv.client.name}</span>
                                    <span className="text-slate-300">·</span>
                                    <span className="text-[11px] text-slate-400">{inv.items} items</span>
                                    <span className="text-slate-300">·</span>
                                    <span className="text-[11px] font-medium text-slate-600">฿{inv.amount.toLocaleString()}</span>
                                    <span className="text-slate-300">·</span>
                                    <span className="text-[11px] text-slate-400">Due {formattedDue}</span>
                                  </div>
                                  <button
                                    onClick={() => {
                                      const url = new URL(window.location.href);
                                      url.searchParams.set('view', 'invoice');
                                      window.open(url.toString(), '_blank');
                                    }}
                                    className="inline-flex items-center gap-1 mt-2.5 px-2.5 py-1 text-[10px] font-semibold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100/80 rounded-lg transition-all active:scale-[0.97]"
                                  >
                                    <Icon icon="solar:arrow-right-up-linear" width="11" />
                                    View Invoice
                                  </button>
                                </div>
                              </div>
                            );
                          })()}
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
                <Icon icon="solar:bolt-linear" width="11" className="text-amber-500" />
                <span className="text-[10px] font-semibold text-slate-500">159K</span>
                <span className="text-[10px] text-slate-400">credits</span>
              </div>
              <button onClick={onGetMoreCredits} className="text-[10px] font-medium text-amber-500 hover:text-amber-600 transition-colors">
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
                  className="flex-1 bg-transparent text-slate-800 placeholder-slate-400 text-[13px] resize-none outline-none leading-5 max-h-[60px] py-1 overflow-y-auto"
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

        {/* Floating pill — two states */}
        {hasMessages ? (
          /* On-going Task pill */
          <div className="group relative" ref={pillRef} onMouseDown={handleMouseDown} onClick={handlePillClick}>
            <div
              className="relative flex items-center gap-2 pl-3 pr-3.5 py-2 rounded-full cursor-pointer select-none bg-slate-900 border border-blue-500/30 shadow-[0_2px_4px_rgba(0,0,0,0.04),0_8px_24px_rgba(37,99,235,0.10),0_24px_48px_rgba(0,0,0,0.08)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_12px_32px_rgba(37,99,235,0.14),0_32px_56px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.97] overflow-hidden"
            >
              <span className="absolute inset-0 rounded-full border border-blue-400/40 pointer-events-none" style={{ animation: 'pill-pulse-ring 2.5s ease-out infinite' }} />
              <span className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" style={{ animation: 'pill-shimmer 3s ease-in-out infinite' }} />
              </span>
              <span className="relative text-[12px] font-semibold tracking-tight text-white/90 whitespace-nowrap">Task in progress</span>
              {!isOpen && (
                <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full overflow-hidden">
                  <span className="absolute inset-0 bg-white/[0.08] rounded-full" />
                  <span className="absolute inset-y-0 w-1/3 rounded-full bg-gradient-to-r from-transparent via-blue-400 to-transparent" style={{ animation: 'pill-progress-sweep 1.8s ease-in-out infinite' }} />
                </span>
              )}
            </div>
          </div>
        ) : (
          /* New Task pill */
          <div
            ref={pillRef}
            onMouseDown={handleMouseDown}
            onClick={handlePillClick}
            className="group relative flex items-center gap-2 pl-3 pr-3.5 py-2 rounded-full cursor-pointer select-none bg-slate-900 shadow-[0_2px_4px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.12),0_24px_48px_rgba(0,0,0,0.08)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_12px_32px_rgba(0,0,0,0.16),0_32px_56px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.97]"
          >
            <Icon icon="solar:pen-new-square-linear" width={13} className="flex-shrink-0 text-white" />
            <span className="text-[12px] font-semibold tracking-tight text-white">New Task</span>
            <button
              onClick={(e) => { e.stopPropagation(); onDismiss(); setIsOpen(false); }}
              className="absolute -top-1 -right-1 w-[18px] h-[18px] flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border border-slate-200/80 shadow-sm transition-all duration-200 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 hover:border-slate-300 hover:shadow-md active:scale-90"
            >
              <svg width="7" height="7" viewBox="0 0 10 10" fill="none"><path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/></svg>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
