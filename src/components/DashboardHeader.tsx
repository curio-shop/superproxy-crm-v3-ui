import { Icon } from '@iconify/react';
import { useState } from 'react';
import NotificationCard from './NotificationCard';

interface DashboardHeaderProps {
  isTeamView: boolean;
  onToggleView: (isTeam: boolean) => void;
  onNavigateToNotifications?: () => void;
}

export default function DashboardHeader({ isTeamView, onToggleView, onNavigateToNotifications }: DashboardHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="flex items-center justify-between px-6 py-4 sticky top-0 bg-[#fafafa] z-30">
      <h1 className="text-lg font-semibold text-slate-800 tracking-tight">Dashboard</h1>

      <div className="flex gap-2 items-center">
        <div className="flex items-center bg-white/80 rounded-lg p-0.5 border border-slate-100/80">
          <button
            onClick={() => onToggleView(false)}
            className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${
              !isTeamView ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Personal
          </button>
          <button
            onClick={() => onToggleView(true)}
            className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${
              isTeamView ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Team
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="group transition-all flex outline-none text-slate-400 hover:text-slate-600 w-9 h-9 rounded-xl bg-white/80 border border-slate-100/80 relative items-center justify-center hover:bg-white hover:border-slate-200 active:scale-[0.97]"
          >
            <Icon icon="solar:bell-linear" width="18" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-[#fafafa]">
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
