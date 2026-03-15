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
    <header className="flex items-center justify-between px-8 py-5 border-b border-white/30 sticky top-0 bg-white/40 backdrop-blur-xl z-30 transition-all">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight font-display">
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
            : 'Dashboard'}
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          {activePage === 'contacts'
            ? 'Manage leads, track interactions, and organize business relationships.'
            : activePage === 'companies'
            ? 'Manage organizations, partnerships, and business accounts.'
            : activePage === 'products'
            ? 'Manage inventory, track stock levels, and organize your catalog.'
            : activePage === 'quotations'
            ? 'Create, track, and manage client quotations with ease.'
            : activePage === 'invoices'
            ? 'Track payments, manage billing, and monitor invoice status.'
            : activePage === 'workspace'
            ? 'Manage your team, settings, and workspace configuration.'
            : activePage === 'account'
            ? 'Manage your profile, security, and preferences.'
            : isTeamView
            ? 'Viewing consolidated team performance and metrics.'
            : 'Overview of your sales performance, pipeline activity, and business growth.'}
        </p>
      </div>

      <div className="flex gap-3 items-center">
        {activePage === 'home' && onToggleView && (
          <button
            onClick={() => onToggleView(!isTeamView)}
            className="flex items-center gap-2.5 group select-none"
            aria-label="Toggle personal/team view"
          >
            <span className={`text-xs font-semibold tracking-wide transition-colors duration-200 ${!isTeamView ? 'text-slate-800' : 'text-slate-400'}`}>
              Personal
            </span>
            <div className={`relative w-9 h-[22px] rounded-full transition-colors duration-200 ease-in-out ${isTeamView ? 'bg-indigo-500' : 'bg-slate-200'}`}>
              <div className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.18)] transition-transform duration-200 ease-in-out ${isTeamView ? 'translate-x-[18px]' : 'translate-x-[3px]'}`} />
            </div>
            <span className={`text-xs font-semibold tracking-wide transition-colors duration-200 ${isTeamView ? 'text-slate-800' : 'text-slate-400'}`}>
              Team
            </span>
          </button>
        )}

        {activePage === 'home' && onToggleView && (
          <div className="h-8 w-px bg-slate-200"></div>
        )}


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
