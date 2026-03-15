import { useState } from 'react';
import { Icon } from '@iconify/react';

const CONNECTORS = [
  { id: 'gcal',   icon: 'logos:google-calendar', label: 'Google Calendar', description: 'Sync meetings and schedule calls' },
  { id: 'gdrive', icon: 'logos:google-drive',    label: 'Google Drive',    description: 'Access and share documents' },
  { id: 'slack',  icon: 'logos:slack-icon',       label: 'Slack',           description: 'Send messages and get notifications' },
  { id: 'gmail',  icon: 'logos:google-gmail',     label: 'Gmail',           description: 'Send and track emails' },
  { id: 'sheets', icon: 'flat-color-icons:google', label: 'Google Sheets',   description: 'Sync data and generate reports' },
];

interface ConnectToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectedTools: Record<string, boolean>;
  onConnectedToolsChange: (tools: Record<string, boolean>) => void;
}

export default function ConnectToolsModal({ isOpen, onClose, connectedTools, onConnectedToolsChange }: ConnectToolsModalProps) {
  const [disconnectTarget, setDisconnectTarget] = useState<string | null>(null);

  if (!isOpen) return null;

  const targetConnector = disconnectTarget ? CONNECTORS.find(c => c.id === disconnectTarget) : null;

  const handleToggle = (id: string) => {
    if (connectedTools[id]) {
      setDisconnectTarget(id);
    } else {
      onConnectedToolsChange(prev => ({ ...prev, [id]: true }));
    }
  };

  const handleConfirmDisconnect = () => {
    if (disconnectTarget) {
      onConnectedToolsChange(prev => ({ ...prev, [disconnectTarget]: false }));
      setDisconnectTarget(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{ animation: 'connectorFadeIn 200ms ease-out' }}
    >
      <style>{`
        @keyframes connectorFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes connectorSlideUp {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/15 backdrop-blur-sm"
        onClick={disconnectTarget ? () => setDisconnectTarget(null) : onClose}
      />

      {/* Disconnect confirmation */}
      {disconnectTarget && targetConnector && (
        <div
          className="relative bg-white rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.14),0_0_0_1px_rgba(0,0,0,0.03)] max-w-[320px] w-full mx-4 overflow-hidden z-[61]"
          style={{ animation: 'connectorSlideUp 200ms cubic-bezier(0.16,1,0.3,1)' }}
        >
          <div className="px-6 pt-6 pb-5 text-center">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4">
              <Icon icon={targetConnector.icon} width="20" />
            </div>
            <h3 className="text-[15px] font-semibold text-slate-800">Disconnect {targetConnector.label}?</h3>
            <p className="text-[13px] text-slate-400 mt-1.5 leading-relaxed">This will stop syncing data with {targetConnector.label}. You can reconnect anytime.</p>
          </div>
          <div className="flex gap-2.5 px-5 pb-5">
            <button
              onClick={() => setDisconnectTarget(null)}
              className="flex-1 py-2 rounded-xl text-[13px] font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDisconnect}
              className="flex-1 py-2 rounded-xl text-[13px] font-medium text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}

      {/* Main Modal */}
      {!disconnectTarget && (
        <div
          className="relative bg-white rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.03)] max-w-md w-full mx-4 overflow-hidden"
          style={{ animation: 'connectorSlideUp 250ms cubic-bezier(0.16,1,0.3,1)' }}
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-800 tracking-tight">Connect your tools</h2>
                <p className="text-[13px] text-slate-400 mt-1">Link your favorite tools to enhance your workflow.</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors -mr-1 -mt-1"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/></svg>
              </button>
            </div>
          </div>

          {/* Connector list */}
          <div className="px-3 pb-3">
            {CONNECTORS.map((connector) => {
              const isConnected = connectedTools[connector.id] || false;
              return (
                <div
                  key={connector.id}
                  className="flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-slate-50/80 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                    <Icon icon={connector.icon} width="18" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-slate-700">{connector.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{connector.description}</div>
                  </div>
                  <button
                    onClick={() => handleToggle(connector.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-200 flex-shrink-0 ${
                      isConnected
                        ? 'border border-emerald-400 text-emerald-600'
                        : 'border border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {isConnected ? (
                      <>
                        <Icon icon="solar:check-circle-bold" width="13" />
                        Connected
                      </>
                    ) : (
                      'Connect'
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100">
            <p className="text-[11px] text-slate-400 text-center">More integrations coming soon</p>
          </div>
        </div>
      )}
    </div>
  );
}
