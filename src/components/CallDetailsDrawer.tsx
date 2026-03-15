import { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Clock, TrendingUp, TrendingDown, Minus, Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface CallHistoryRecord {
  id: string;
  contact_id: string;
  user_name: string;
  duration: number;
  notes: string;
  transcript: string;
  sentiment: string;
  outcome: string;
  next_action: string;
  created_at: string;
  contact: {
    name: string;
    initials: string;
    company_name: string;
    avatar_color: string;
  };
}

interface CallDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  call: CallHistoryRecord | null;
}

export default function CallDetailsDrawer({ isOpen, onClose, call }: CallDetailsDrawerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const progressIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying && call) {
      progressIntervalRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + (0.1 * playbackSpeed);
          if (next >= call.duration) {
            setIsPlaying(false);
            return call.duration;
          }
          return next;
        });
      }, 100);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying, call, playbackSpeed]);

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      setCurrentTime(0);
      setPlaybackSpeed(1);
    }
  }, [isOpen]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkipBack = () => {
    setCurrentTime((prev) => Math.max(0, prev - 10));
  };

  const handleSkipForward = () => {
    if (call) {
      setCurrentTime((prev) => Math.min(call.duration, prev + 10));
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!call) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    setCurrentTime(percentage * call.duration);
  };

  const cyclePlaybackSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIndex]);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    if (diffInHours < 24) {
      return `Today at ${timeStr}`;
    } else if (diffInHours < 48) {
      return `Yesterday at ${timeStr}`;
    } else {
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      return `${dateStr} at ${timeStr}`;
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-rose-600" />;
      default:
        return <Minus className="w-4 h-4 text-slate-400" />;
    }
  };

  const getOutcomeBadge = (outcome: string) => {
    const badges: Record<string, { label: string; color: string }> = {
      interested: { label: 'Interested', color: 'bg-blue-50 text-blue-700 border-blue-200' },
      follow_up: { label: 'Follow Up', color: 'bg-amber-50 text-amber-700 border-amber-200' },
      not_interested: { label: 'Not Interested', color: 'bg-slate-50 text-slate-600 border-slate-200' },
      no_answer: { label: 'No Answer', color: 'bg-slate-50 text-slate-500 border-slate-200' },
      completed: { label: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    };

    const badge = badges[outcome] || badges.completed;
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  const parseTranscript = (transcript: string) => {
    const lines = transcript.split('\n\n');
    return lines.map((line) => {
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) return null;

      const speaker = line.substring(0, colonIndex).trim();
      const message = line.substring(colonIndex + 1).trim();

      return {
        speaker,
        message,
        isUser: speaker.toLowerCase() === 'me'
      };
    }).filter(Boolean);
  };

  if (!isOpen || !call) return null;

  const messages = call.transcript ? parseTranscript(call.transcript) : [];

  return (
    <div className="fixed inset-0 z-[200] flex justify-end" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300 ease-out"
        onClick={onClose}
        style={{
          animation: 'fadeIn 300ms ease-out'
        }}
      />

      <div
        className="relative w-full max-w-[520px] h-full bg-white/80 backdrop-blur-2xl shadow-2xl flex flex-col transform transition-all duration-500 ease-out border-l border-white/60 rounded-l-[32px] ml-auto overflow-hidden"
        style={{
          animation: 'slideInRight 500ms cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div className="px-8 py-6 border-b border-slate-100/50 bg-white/40 backdrop-blur-md z-10 flex items-center justify-between sticky top-0">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${
                call.contact.avatar_color === 'blue'
                  ? 'from-blue-400 to-blue-500'
                  : call.contact.avatar_color === 'pink'
                  ? 'from-pink-400 to-pink-500'
                  : call.contact.avatar_color === 'amber'
                  ? 'from-amber-400 to-amber-500'
                  : call.contact.avatar_color === 'emerald'
                  ? 'from-emerald-400 to-emerald-500'
                  : 'from-slate-400 to-slate-500'
              } flex items-center justify-center text-white font-bold text-xs shadow-lg`}
            >
              {call.contact.initials}
            </div>
            <div>
              <h2 className="text-lg text-slate-900 tracking-tight font-display font-semibold">
                {call.contact.name}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {call.contact.company_name || 'Call Recording'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 rounded-xl border border-transparent hover:border-slate-200/60 transition-all flex items-center justify-center"
          >
            <Icon icon="solar:close-circle-linear" width="20" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-slate-50/80 to-slate-100/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm ring-1 ring-slate-100/50">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2 text-slate-700">
                  <Icon icon="solar:soundwave-bold" className="w-5 h-5" />
                  <span className="text-sm font-semibold">Call Recording</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-slate-600">{formatDuration(Math.floor(currentTime))}</span>
                  <span className="text-xs text-slate-400">/</span>
                  <span className="text-xs font-medium text-slate-600">{formatDuration(call.duration)}</span>
                </div>
              </div>

              <div
                className="relative h-20 mb-5 cursor-pointer group rounded-xl overflow-hidden bg-gradient-to-b from-slate-50/30 to-white/30"
                onClick={handleProgressClick}
              >
                <div className="absolute inset-0 flex items-center justify-start gap-[2px] px-2">
                  {Array.from({ length: 120 }).map((_, i) => {
                    const heights = [
                      0.2, 0.35, 0.28, 0.45, 0.6, 0.4, 0.55, 0.75, 0.5, 0.65,
                      0.85, 0.7, 0.9, 0.95, 0.8, 0.65, 0.5, 0.4, 0.3, 0.45,
                      0.6, 0.75, 0.85, 0.7, 0.55, 0.4, 0.25, 0.35, 0.5, 0.65,
                      0.8, 0.9, 0.75, 0.6, 0.45, 0.3, 0.2, 0.35, 0.5, 0.7,
                      0.85, 0.95, 1, 0.9, 0.75, 0.6, 0.45, 0.3, 0.4, 0.55,
                      0.7, 0.85, 0.75, 0.6, 0.45, 0.3, 0.25, 0.4, 0.55, 0.7,
                      0.8, 0.65, 0.5, 0.35, 0.25, 0.4, 0.6, 0.75, 0.9, 0.8,
                      0.65, 0.5, 0.35, 0.25, 0.4, 0.55, 0.7, 0.85, 0.95, 0.8,
                      0.65, 0.5, 0.35, 0.25, 0.35, 0.5, 0.65, 0.8, 0.7, 0.55,
                      0.4, 0.3, 0.45, 0.6, 0.75, 0.65, 0.5, 0.35, 0.25, 0.35,
                      0.5, 0.7, 0.85, 0.7, 0.55, 0.4, 0.3, 0.2, 0.35, 0.5,
                      0.65, 0.8, 0.9, 0.75, 0.6, 0.45, 0.3, 0.25, 0.35, 0.45
                    ];
                    const height = heights[i % heights.length];
                    const progress = currentTime / call.duration;
                    const barProgress = i / 120;
                    const isPassed = barProgress <= progress;

                    return (
                      <div
                        key={i}
                        className={`w-[3px] rounded-full transition-all duration-150 ${
                          isPassed
                            ? 'bg-blue-400 group-hover:bg-blue-500'
                            : 'bg-blue-200/60 group-hover:bg-blue-300/70'
                        }`}
                        style={{ height: `${height * 100}%` }}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSkipBack}
                    className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 rounded-full transition-all text-slate-600 hover:text-slate-900 active:scale-95"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handlePlayPause}
                    className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900 hover:from-slate-800 hover:to-slate-950 rounded-full transition-all text-white shadow-lg shadow-slate-900/40 hover:shadow-xl hover:shadow-slate-900/60 active:scale-95 group"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" fill="currentColor" />
                    ) : (
                      <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                    )}
                  </button>
                  <button
                    onClick={handleSkipForward}
                    className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 rounded-full transition-all text-slate-600 hover:text-slate-900 active:scale-95"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={cyclePlaybackSpeed}
                  className="min-w-[60px] px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200/60 hover:border-slate-300 rounded-full text-xs font-bold text-slate-700 hover:text-slate-900 transition-all shadow-sm hover:shadow active:scale-95"
                >
                  {playbackSpeed}x
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/50 rounded-2xl p-4 border border-white/60 shadow-sm ring-1 ring-slate-100/50">
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-[11px] font-semibold uppercase tracking-wide">Duration</span>
                </div>
                <p className="text-lg font-bold text-slate-900">{formatDuration(call.duration)}</p>
              </div>

              <div className="bg-white/50 rounded-2xl p-4 border border-white/60 shadow-sm ring-1 ring-slate-100/50">
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                  <Icon icon="solar:calendar-linear" className="w-4 h-4" />
                  <span className="text-[11px] font-semibold uppercase tracking-wide">Date & Time</span>
                </div>
                <p className="text-sm font-bold text-slate-900 leading-snug">{formatDateTime(call.created_at)}</p>
              </div>

              <div className="bg-white/50 rounded-2xl p-4 border border-white/60 shadow-sm ring-1 ring-slate-100/50">
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                  {getSentimentIcon(call.sentiment)}
                  <span className="text-[11px] font-semibold uppercase tracking-wide">Sentiment</span>
                </div>
                <p className="text-lg font-bold text-slate-900 capitalize">{call.sentiment}</p>
              </div>

              <div className="bg-white/50 rounded-2xl p-4 border border-white/60 shadow-sm ring-1 ring-slate-100/50">
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                  <Icon icon="solar:check-circle-linear" className="w-4 h-4" />
                  <span className="text-[11px] font-semibold uppercase tracking-wide">Outcome</span>
                </div>
                <div>{getOutcomeBadge(call.outcome)}</div>
              </div>
            </div>

            {call.notes && (
              <div className="bg-white/50 rounded-2xl p-5 border border-white/60 shadow-sm ring-1 ring-slate-100/50">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Icon icon="solar:notes-bold" className="w-4 h-4" />
                  Notes
                </h5>
                <p className="text-sm text-slate-700 leading-relaxed">{call.notes}</p>
              </div>
            )}

            {call.next_action && (
              <div className="bg-blue-50/80 backdrop-blur-sm rounded-2xl p-5 border border-blue-200/60 shadow-sm ring-1 ring-blue-100/50">
                <h5 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Icon icon="solar:checklist-minimalistic-bold" className="w-4 h-4" />
                  Next Action
                </h5>
                <p className="text-sm text-blue-700 leading-relaxed font-medium">{call.next_action}</p>
              </div>
            )}

            {call.transcript && messages.length > 0 && (
              <div className="bg-white/50 rounded-2xl p-5 border border-white/60 shadow-sm ring-1 ring-slate-100/50">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Icon icon="solar:chat-round-line-linear" className="w-4 h-4" />
                  Conversation
                  <span className="ml-auto text-[10px] font-semibold text-slate-400/80">
                    {messages.length} {messages.length === 1 ? 'message' : 'messages'}
                  </span>
                </h5>
                <div className="bg-gradient-to-b from-slate-50/60 to-white/60 rounded-xl p-4 max-h-[520px] overflow-y-auto custom-scrollbar border border-slate-200/40 space-y-3">
                  {messages.map((msg: any, idx: number) => (
                    <div
                      key={idx}
                      className={`flex gap-2.5 ${msg.isUser ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {!msg.isUser && (
                        <div
                          className={`flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br ${
                            call.contact.avatar_color === 'blue'
                              ? 'from-blue-400 to-blue-500'
                              : call.contact.avatar_color === 'pink'
                              ? 'from-pink-400 to-pink-500'
                              : call.contact.avatar_color === 'amber'
                              ? 'from-amber-400 to-amber-500'
                              : call.contact.avatar_color === 'emerald'
                              ? 'from-emerald-400 to-emerald-500'
                              : 'from-slate-400 to-slate-500'
                          } flex items-center justify-center text-white font-bold text-[10px] shadow-sm`}
                        >
                          {call.contact.initials}
                        </div>
                      )}

                      {msg.isUser && (
                        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white shadow-sm">
                          <Icon icon="solar:user-bold" className="w-3.5 h-3.5" />
                        </div>
                      )}

                      <div className={`flex flex-col gap-1 max-w-[75%] ${msg.isUser ? 'items-end' : 'items-start'}`}>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${
                          msg.isUser ? 'text-slate-700' : 'text-slate-600'
                        }`}>
                          {msg.isUser ? 'You' : msg.speaker}
                        </span>
                        <div
                          className={`rounded-xl px-3.5 py-2 shadow-sm ${
                            msg.isUser
                              ? 'bg-slate-900 text-white rounded-tr-sm'
                              : 'bg-white border border-slate-200/60 text-slate-700 rounded-tl-sm'
                          }`}
                        >
                          <p className={`text-[13.5px] leading-relaxed ${msg.isUser ? 'text-white' : 'text-slate-700'}`}>
                            {msg.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center justify-center gap-3 pt-4 pb-1">
                    <div className="h-px w-16 bg-gradient-to-r from-transparent to-slate-200/60"></div>
                    <span className="text-[10px] font-semibold text-slate-400/70 uppercase tracking-wider">
                      End of conversation
                    </span>
                    <div className="h-px w-16 bg-gradient-to-l from-transparent to-slate-200/60"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
