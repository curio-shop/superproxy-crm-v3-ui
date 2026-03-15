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

export default function SimpleHeader({ title, subtitle, showCreateButton, onOpenDrawer, onBack, customButton, onNavigateToNotifications }: SimpleHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-white/30 sticky top-0 bg-white/40 backdrop-blur-xl z-30 transition-all">
      <div className="flex items-center gap-4">
        {onBack && (
          <button
            onClick={onBack}
            className="group flex items-center justify-center w-10 h-10 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition-all hover:shadow-md"
          >
            <Icon icon="solar:arrow-left-linear" width="20" className="text-slate-600 group-hover:text-slate-900 transition-colors" />
          </button>
        )}
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight font-display">
            {title}
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex gap-3 items-center">
        {showCreateButton && (
          <button
            onClick={onOpenDrawer}
            className="flex items-center gap-2 bg-gradient-to-b from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 border-t border-white/20 text-white px-5 py-2 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Icon icon="solar:add-circle-linear" width="20" className="text-indigo-100" />
            <span className="text-sm font-semibold tracking-wide">Create Invoice</span>
          </button>
        )}

        {customButton && (
          <button
            onClick={customButton.onClick}
            className="flex items-center gap-2 bg-gradient-to-b from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 border-t border-white/20 text-white px-5 py-2 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Icon icon={customButton.icon} width="20" className="text-indigo-100" />
            <span className="text-sm font-semibold tracking-wide">{customButton.label}</span>
          </button>
        )}

        {(showCreateButton || customButton) && <div className="h-8 w-px bg-slate-200"></div>}

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="group hover:text-slate-800 transition-all flex outline-none focus:ring-2 focus:ring-slate-100 text-slate-500 bg-white w-10 h-10 rounded-xl relative items-center justify-center shadow-sm hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] active:scale-95"
          >
            <Icon icon="solar:bell-linear" width="22" className="transition-transform group-hover:scale-105 group-active:scale-95" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white">
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
