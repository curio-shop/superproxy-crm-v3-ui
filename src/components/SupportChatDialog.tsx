import { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import { Z_INDEX } from '../lib/zIndex';
import { mockChatMessages } from '../data/mockChatMessages';

interface Message {
  id: string;
  sender_type: 'user' | 'support';
  sender_name: string;
  sender_avatar?: string;
  message: string;
  created_at: string;
}

interface SupportChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

export default function SupportChatDialog({ isOpen, onClose, userId, userName }: SupportChatDialogProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      loadMockMessages();
    }
  }, [isOpen]);

  const loadMockMessages = () => {
    setIsLoading(true);
    setTimeout(() => {
      setMessages(mockChatMessages);
      setIsLoading(false);
    }, 500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender_type: 'user',
      sender_name: 'You',
      message: newMessage.trim(),
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    setTimeout(() => {
      const supportMessage: Message = {
        id: `support-${Date.now()}`,
        sender_type: 'support',
        sender_name: 'Sarah Johnson',
        sender_avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
        message: 'Thanks for your message! Our support team will respond shortly. In the meantime, feel free to check out our help center for quick answers to common questions.',
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, supportMessage]);
      setIsSending(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-[2px] transition-opacity"
        style={{ zIndex: Z_INDEX.chatDialog }}
        onClick={onClose}
      />
      <div
        className="fixed bottom-24 right-6 w-[380px] h-[550px] bg-white shadow-2xl flex flex-col rounded-2xl border border-slate-200 animate-in slide-in-from-bottom-8 fade-in duration-300"
        style={{ zIndex: Z_INDEX.chatDialog + 1 }}
      >
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-4 flex items-center gap-3 rounded-t-2xl">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Icon icon="solar:chat-round-dots-bold" width="20" />
          </div>
          <div>
            <h2 className="text-base font-semibold">Chat With Our Team</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <p className="text-xs text-slate-400">Online</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Icon icon="svg-spinners:270-ring-with-bg" width="40" className="text-blue-600" />
            </div>
          ) : (
            <>
              {messages.map((msg, index) => {
                const showDate = index === 0 ||
                  new Date(messages[index - 1].created_at).toDateString() !== new Date(msg.created_at).toDateString();

                return (
                  <div key={msg.id}>
                    {showDate && (
                      <div className="flex justify-center my-3">
                        <span className="text-xs text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm">
                          {new Date(msg.created_at).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                            year: new Date(msg.created_at).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                          })}
                        </span>
                      </div>
                    )}
                    <div
                      className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-end gap-2 max-w-[75%] ${msg.sender_type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        {msg.sender_type === 'support' && (
                          <div className="flex-shrink-0 mb-1">
                            {msg.sender_avatar ? (
                              <img
                                src={msg.sender_avatar}
                                alt={msg.sender_name}
                                className="w-7 h-7 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                                {msg.sender_name.charAt(0)}
                              </div>
                            )}
                          </div>
                        )}
                        <div>
                          {msg.sender_type === 'support' && (
                            <p className="text-xs text-slate-600 mb-1 px-2 font-medium">{msg.sender_name}</p>
                          )}
                          <div
                            className={`rounded-2xl px-4 py-2.5 ${
                              msg.sender_type === 'user'
                                ? 'bg-slate-800 text-white shadow-md'
                                : 'bg-white text-slate-800 shadow-sm border border-slate-200'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 px-2">
                            {new Date(msg.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 rounded-b-2xl">
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-2xl focus:outline-none focus:border-slate-400 text-sm transition-colors"
                disabled={isSending}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Add emoji"
              >
                <Icon icon="solar:smile-circle-bold" width="20" />
              </button>
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-full p-3 hover:from-indigo-700 hover:to-indigo-800 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg disabled:shadow-none"
              aria-label="Send message"
            >
              {isSending ? (
                <Icon icon="svg-spinners:270-ring-with-bg" width="20" />
              ) : (
                <Icon icon="solar:plain-2-bold" width="20" className="rotate-45" />
              )}
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">Press Enter to send • Shift+Enter for new line</p>
        </form>
      </div>
    </>
  );
}
