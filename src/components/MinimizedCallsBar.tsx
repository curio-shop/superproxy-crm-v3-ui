import { Icon } from '@iconify/react';
import { useCallManager } from '../contexts/CallManagerContext';

export default function MinimizedCallsBar() {
  const { activeCalls, restoreCall } = useCallManager();

  const minimizedCalls = activeCalls.filter((call) => call.isMinimized);

  if (minimizedCalls.length === 0) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-0 right-0 z-40 pointer-events-none">
      <div className="pr-4">
        <div className="flex items-end gap-2 justify-end overflow-x-auto pointer-events-auto flex-row-reverse"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>{`
            @keyframes mini-wave {
              0%, 100% { height: 3px; }
              50% { height: 10px; }
            }
            .minimized-calls-bar::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {minimizedCalls.map((call, index) => (
            <div
              key={call.id}
              className="relative animate-in slide-in-from-bottom-3 fade-in duration-300"
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <div
                className="relative bg-gradient-to-br from-slate-900 to-slate-950 backdrop-blur-xl border border-slate-700/50 rounded-t-xl shadow-2xl hover:shadow-[0_-8px_30px_rgba(0,0,0,0.4)] hover:border-slate-600/50 transition-all duration-300 overflow-hidden min-w-[200px] max-w-[200px] cursor-pointer group"
                onClick={() => restoreCall(call.id)}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-90 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${call.color}, transparent)`,
                  }}
                ></div>

                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300"
                  style={{ backgroundColor: call.color }}
                ></div>

                <div className="p-2 pt-2.5 relative">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-shrink-0">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg ring-1 ring-white/10 overflow-hidden flex items-center justify-center relative">
                        <div className="absolute inset-0 opacity-50">
                          <div
                            className="absolute -top-1 -left-1 w-5 h-5 rounded-full mix-blend-screen blur-md animate-[spin_4s_linear_infinite]"
                            style={{ backgroundColor: call.color }}
                          ></div>
                        </div>

                        <div className="relative z-10 flex items-center justify-center gap-0.5">
                          <div
                            className="w-0.5 bg-white/90 rounded-full animate-[mini-wave_0.8s_ease-in-out_infinite]"
                            style={{ animationDelay: '0s' }}
                          ></div>
                          <div
                            className="w-0.5 bg-white/90 rounded-full animate-[mini-wave_0.9s_ease-in-out_infinite]"
                            style={{ animationDelay: '0.1s' }}
                          ></div>
                          <div
                            className="w-0.5 bg-white rounded-full animate-[mini-wave_0.7s_ease-in-out_infinite]"
                            style={{ animationDelay: '0.2s' }}
                          ></div>
                        </div>
                      </div>

                      <div
                        className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full shadow-lg flex items-center justify-center ring-1 ring-slate-900"
                        style={{ backgroundColor: call.color }}
                      >
                        <Icon icon="solar:microphone-bold" className="w-1.5 h-1.5 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <h4 className="text-[11px] font-bold text-white truncate leading-tight">
                          {call.contact.name}
                        </h4>
                        <span className="text-[10px] font-bold text-slate-300 tabular-nums flex-shrink-0">
                          {formatDuration(call.duration)}
                        </span>
                      </div>
                      {call.contact.company_name && (
                        <p className="text-[10px] text-slate-400 truncate leading-tight">
                          {call.contact.company_name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
