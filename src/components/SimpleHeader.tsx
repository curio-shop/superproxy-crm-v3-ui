import { Icon } from '@iconify/react';
import { useState } from 'react';
import NotificationCard from './NotificationCard';

interface SimpleHeaderProps {
  title: string;
  subtitle: string;
  showCreateButton?: boolean;
  onOpenDrawer?: () => void;
  onBack?: () => void;
  customButton?: {
    label: string;
    icon: string;
    onClick: () => void;
  };
  onNavigateToNotifications?: () => void;
}

export default function SimpleHeader({ title, subtitle, showCreateButton, onOpenDrawer, customButton, onNavigateToNotifications }: SimpleHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-slate-100/60 sticky top-0 bg-white/60 backdrop-blur-xl z-30 transition-all">
      <div>
        <h1 className="text-lg font-semibold text-slate-800 tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex gap-2 items-center">
        {showCreateButton && (
          <button
            onClick={onOpenDrawer}
            className="flex items-center gap-2 border border-slate-200 text-slate-600 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50 px-4 py-2 rounded-xl transition-all active:scale-[0.98]"
          >
            <Icon icon="solar:add-circle-linear" width="15" className="text-slate-400" />
            <span className="text-[13px] font-medium">Create Invoice</span>
          </button>
        )}

        {customButton && (
          <button
            onClick={customButton.onClick}
            className="flex items-center gap-2 border border-slate-200 text-slate-600 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50 px-4 py-2 rounded-xl transition-all active:scale-[0.98]"
          >
            <Icon icon={customButton.icon} width="15" className="text-slate-400" />
            <span className="text-[13px] font-medium">{customButton.label}</span>
          </button>
        )}

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="group transition-all flex outline-none text-slate-400 hover:text-slate-600 w-9 h-9 rounded-xl border border-slate-200 relative items-center justify-center hover:bg-slate-50 hover:border-slate-300 active:scale-[0.97]"
          >
            <Icon icon="solar:bell-linear" width="18" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white">
              <span className="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75 animate-ping"></span>
            </span>
          </button>

          <NotificationCard
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
            onViewAll={() => {
              setShowNotifications(false);
              onNavigateToNotifications?.();
            }}
          />
        </div>
      </div>
    </header>
  );
}
