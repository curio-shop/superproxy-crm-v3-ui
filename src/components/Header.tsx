import { Icon } from '@iconify/react';
import { useState } from 'react';
import NotificationCard from './NotificationCard';

interface HeaderProps {
  activePage: string;
  onOpenDrawer?: () => void;
  onCreateWorkspace?: () => void;
  onJoinWorkspace?: () => void;
  isTeamView?: boolean;
  onToggleView?: (isTeam: boolean) => void;
  onNavigateToNotifications?: () => void;
}

export default function Header({ activePage, onOpenDrawer, onCreateWorkspace, onJoinWorkspace, isTeamView = false, onToggleView, onNavigateToNotifications }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-slate-100/60 sticky top-0 bg-white/60 backdrop-blur-xl z-30 transition-all">
      <div>
        <h1 className="text-lg font-semibold text-slate-800 tracking-tight">
          {activePage === 'contacts'
            ? 'Contacts'
            : activePage === 'companies'
            ? 'Companies'
            : activePage === 'products'
            ? 'Products'
            : activePage === 'quotations'
            ? 'Quotations'
            : activePage === 'invoices'
            ? 'Invoices'
            : activePage === 'workspace'
            ? 'Workspace'
            : activePage === 'account'
            ? 'Account Settings'
            : activePage === 'call-history'
            ? 'Calls'
            : 'Dashboard'}
        </h1>
      </div>

      <div className="flex gap-3 items-center">
        {activePage === 'home' && onToggleView && (
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 mr-1">
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
