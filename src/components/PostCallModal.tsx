import { Icon } from '@iconify/react';
import { Contact } from '../contexts/CallManagerContext';

interface PostCallModalProps {
  isOpen: boolean;
  contact: Contact;
  duration: number;
  onViewTranscript: () => void;
  onClose: () => void;
  onNavigateToHistory?: () => void;
}

export default function PostCallModal({ isOpen, contact, duration, onViewTranscript, onClose, onNavigateToHistory }: PostCallModalProps) {
  if (!isOpen) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-white/50 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="w-full bg-slate-50 p-8 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="bg-gradient-to-br from-indigo-50/30 via-white to-slate-50/50 opacity-100 w-full h-full absolute top-0 left-0"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-white/80 rounded-lg transition-all shadow-md bg-white/60 backdrop-blur-sm"
          >
            <Icon icon="solar:close-circle-linear" className="w-5 h-5" />
          </button>

          <div className="relative z-10 flex flex-col items-center text-center space-y-6 w-full max-w-md">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-50 rounded-full border border-indigo-200">
              <Icon icon="solar:check-circle-bold" className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-xs font-bold text-indigo-700">Call Completed</span>
            </div>

            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/25 flex items-center justify-center ring-4 ring-indigo-50 relative">
                <Icon icon="solar:phone-calling-rounded-bold" className="w-11 h-11 text-white" />
                <div className="absolute -bottom-1.5 -right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-white ring-2 ring-indigo-50 shadow-lg">
                  <Icon icon="solar:check-circle-bold" className="w-4.5 h-4.5 text-indigo-500" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Great conversation!
              </h2>
              <p className="text-sm leading-relaxed text-slate-500">
                Your call with <span className="text-slate-900 font-semibold">{contact.name}</span> has been successfully completed and recorded.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full pt-2">
              <div className="group flex flex-col items-center p-5 bg-white rounded-2xl transition-all hover:bg-slate-50 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-3 text-slate-400">
                  <Icon icon="solar:clock-circle-linear" className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Duration
                  </span>
                </div>
                <span className="text-2xl font-bold text-slate-900 tracking-tight tabular-nums">
                  {formatDuration(duration)}
                </span>
              </div>

              <div className="group flex flex-col items-center p-5 bg-white rounded-2xl transition-all hover:bg-slate-50 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-3 text-slate-400">
                  <Icon icon="solar:check-circle-linear" className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </span>
                </div>
                <span className="text-2xl font-bold text-slate-700 tracking-tight">
                  Saved
                </span>
              </div>
            </div>

            <div className="w-full bg-slate-50 rounded-2xl p-5 border border-slate-200 relative overflow-hidden">
              <div className="flex items-start gap-4 relative z-10">
                <div className="flex-shrink-0 pt-0.5">
                  <Icon icon="solar:magic-stick-bold" className="w-5 h-5 text-amber-500" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-sm font-bold text-slate-900 mb-1">
                    AI Transcript Ready
                  </h3>
                  <p className="leading-relaxed text-sm text-slate-500">
                    Full conversation transcript and AI-powered insights are available to review now.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col gap-3 pt-2">
              <button
                onClick={() => {
                  onNavigateToHistory?.();
                  onClose();
                }}
                className="w-full px-5 py-3.5 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/30 transition-all flex items-center justify-center gap-2.5 active:scale-[0.98]"
              >
                <Icon icon="solar:document-text-bold" className="w-5 h-5" />
                <span>View Transcript & Insights</span>
              </button>

              <button
                onClick={onClose}
                className="w-full px-5 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-200 active:scale-[0.98]"
              >
                I'll check it later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
