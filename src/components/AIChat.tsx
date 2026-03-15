import { Icon } from '@iconify/react';
import { useState, useEffect, useRef } from 'react';
import { Quotation, Invoice } from '../contexts/CallManagerContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  onBack: () => void;
  quotation?: Quotation | null;
  invoice?: Invoice | null;
  originPage: 'quotations' | 'invoices';
}

export default function AIChat({ onBack, quotation, invoice, originPage }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const hasConversation = messages.length > 0;
  const documentData = quotation || invoice;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (hasConversation && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, hasConversation]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Reset textarea height after submission
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    setIsTyping(true);

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand you're asking about ${documentData?.title}. Here's what I can help you with:\n\n• Review the current ${originPage === 'quotations' ? 'quote' : 'invoice'} details\n• Suggest improvements or adjustments\n• Generate follow-up actions\n• Answer questions about pricing or terms\n\nWhat would you like to know more about?`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && hasConversation) {
        onBack();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [hasConversation, onBack]);

  if (!hasConversation) {
    return (
      <div className="flex-1 flex flex-col bg-white relative overflow-hidden">
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl px-8 py-4">
          <div className="flex items-center justify-between w-full">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors group"
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 group-hover:bg-slate-200 transition-colors">
                <Icon icon="solar:arrow-left-linear" width="18" />
              </div>
              <span className="text-sm font-semibold">Back to {originPage === 'quotations' ? 'Quotations' : 'Invoices'}</span>
            </button>

            {documentData && (
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${
                  originPage === 'quotations' ? 'bg-blue-100' : 'bg-emerald-100'
                } flex items-center justify-center flex-shrink-0`}>
                  <Icon
                    icon={originPage === 'quotations' ? 'solar:document-text-bold' : 'solar:bill-list-bold'}
                    width="16"
                    className={originPage === 'quotations' ? 'text-blue-600' : 'text-emerald-600'}
                  />
                </div>
                <div>
                  <div className={`text-xs font-bold ${
                    originPage === 'quotations' ? 'text-blue-600' : 'text-emerald-600'
                  } uppercase tracking-wider`}>
                    {documentData.number}
                  </div>
                  <div className="text-sm font-semibold text-slate-900 truncate max-w-xs">
                    {documentData.title}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-sm font-bold text-slate-900">{formatCurrency(documentData.amount)}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-full max-w-3xl flex flex-col items-center">
            <h1 className="text-5xl font-bold text-slate-900 mb-8 text-center tracking-tight">
              How Can I Help You Today?
            </h1>

            <form onSubmit={handleSubmit} className="w-full">
              <div className="relative bg-slate-100 rounded-[20px] shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
                <div className="flex items-end gap-3 px-4 py-3">
                  <button
                    type="button"
                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors mb-2"
                  >
                    <Icon icon="solar:paperclip-linear" width="20" />
                  </button>

                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything about this document..."
                    className="flex-1 bg-transparent text-slate-900 placeholder-slate-400 text-base resize-none outline-none max-h-32 leading-6 py-2"
                    rows={1}
                    style={{
                      minHeight: '24px',
                      height: 'auto',
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
                    }}
                  />

                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-900 mb-2"
                  >
                    <Icon icon="solar:arrow-right-linear" width="20" />
                  </button>
                </div>
              </div>
            </form>

            <p className="text-xs text-slate-400 mt-4 text-center">
              Press Enter to send, Shift + Enter for new line
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white relative overflow-hidden">
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl px-8 py-4">
        <div className="flex items-center justify-between w-full">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors group"
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 group-hover:bg-slate-200 transition-colors">
              <Icon icon="solar:arrow-left-linear" width="18" />
            </div>
            <span className="text-sm font-semibold">Back to {originPage === 'quotations' ? 'Quotations' : 'Invoices'}</span>
          </button>

          {documentData && (
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${
                originPage === 'quotations' ? 'bg-blue-100' : 'bg-emerald-100'
              } flex items-center justify-center flex-shrink-0`}>
                <Icon
                  icon={originPage === 'quotations' ? 'solar:document-text-bold' : 'solar:bill-list-bold'}
                  width="16"
                  className={originPage === 'quotations' ? 'text-blue-600' : 'text-emerald-600'}
                />
              </div>
              <div>
                <div className={`text-xs font-bold ${
                  originPage === 'quotations' ? 'text-blue-600' : 'text-emerald-600'
                } uppercase tracking-wider`}>
                  {documentData.number}
                </div>
                <div className="text-sm font-semibold text-slate-900 truncate max-w-xs">
                  {documentData.title}
                </div>
              </div>
              <div className="text-right ml-4">
                <div className="text-sm font-bold text-slate-900">{formatCurrency(documentData.amount)}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {message.role === 'user' ? (
                <div className="flex justify-end mb-6">
                  <div className="max-w-[85%]">
                    <div className="rounded-3xl px-5 py-3.5 bg-slate-100 text-slate-900">
                      <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full group">
                  <div className="text-slate-900 py-1">
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(message.content);
                      }}
                      className="relative p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors group/tooltip"
                    >
                      <Icon icon="solar:copy-linear" width="16" />
                      <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                        Copy
                      </span>
                    </button>
                    <button
                      className="relative p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors group/tooltip"
                    >
                      <Icon icon="solar:refresh-linear" width="16" />
                      <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                        Try again
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="animate-in fade-in duration-300">
              <div className="w-full py-1">
                <div className="flex items-center gap-2">
                  <Icon
                    icon="solar:lightbulb-linear"
                    width="16"
                    className="text-slate-400 animate-pulse"
                    style={{ animationDuration: '2s' }}
                  />
                  <div className="flex items-center">
                    <span className="text-[15px] text-slate-400 font-medium">Thinking</span>
                    <span className="flex gap-0.5">
                      <span className="inline-block animate-pulse" style={{ animationDelay: '0ms', animationDuration: '1.4s' }}>.</span>
                      <span className="inline-block animate-pulse" style={{ animationDelay: '200ms', animationDuration: '1.4s' }}>.</span>
                      <span className="inline-block animate-pulse" style={{ animationDelay: '400ms', animationDuration: '1.4s' }}>.</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="sticky bottom-0 z-20 bg-white/80 backdrop-blur-xl px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="relative bg-white rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
              <div className="flex items-end gap-3 px-4 py-2.5">
                <button
                  type="button"
                  className="flex-shrink-0 w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors mb-1.5"
                >
                  <Icon icon="solar:paperclip-linear" width="18" />
                </button>

                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  disabled={isTyping}
                  className="flex-1 bg-transparent text-slate-900 placeholder-slate-400 text-[15px] resize-none outline-none max-h-32 leading-6 py-1.5"
                  rows={1}
                  style={{
                    minHeight: '24px',
                    height: 'auto',
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
                  }}
                />

                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="flex-shrink-0 w-9 h-9 flex items-center justify-center text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-900 mb-1.5"
                >
                  <Icon icon="solar:arrow-right-linear" width="18" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
