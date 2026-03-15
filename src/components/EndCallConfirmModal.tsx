import { Icon } from '@iconify/react';

interface EndCallConfirmModalProps {
  contactName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function EndCallConfirmModal({ contactName, onConfirm, onCancel }: EndCallConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onCancel}></div>

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
            <Icon icon="solar:danger-triangle-linear" className="w-6 h-6 text-amber-600" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900">End this call?</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Ending the call with <span className="font-semibold text-slate-900">{contactName}</span> now may interrupt important conversation flow. The recording and transcript will still be saved automatically.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full pt-2">
            <button
              onClick={onCancel}
              className="flex-1 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-200"
            >
              Continue Call
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold shadow-lg shadow-red-600/30 hover:bg-red-700 transition-all"
            >
              End Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
