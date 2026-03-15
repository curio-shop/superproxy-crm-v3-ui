import { Icon } from '@iconify/react';

interface Notification {
  id: string;
  type: 'view' | 'comment' | 'download' | 'invite' | 'warning';
  title: string;
  message: string;
  time: string;
  isUnread: boolean;
  actions?: { label: string; variant: 'primary' | 'secondary' }[];
  badge?: { icon: string; color: string };
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'view',
    title: 'Quotation Viewed',
    message: 'Acme Corp viewed "Q-2024-001" for the 3rd time today.',
    time: '2m ago',
    isUnread: true,
    badge: { icon: 'solar:eye-bold', color: 'text-emerald-500' }
  },
  {
    id: '2',
    type: 'comment',
    title: 'New Comment',
    message: 'Sarah M. commented: "Can we adjust the quantity on line item #2?"',
    time: '1h ago',
    isUnread: true,
    actions: [
      { label: 'Reply', variant: 'primary' },
      { label: 'Dismiss', variant: 'secondary' }
    ]
  },
  {
    id: '3',
    type: 'download',
    title: 'Quote Downloaded',
    message: 'Client Acme Inc downloaded proposal Q-24-02.',
    time: '5m ago',
    isUnread: false
  },
  {
    id: '4',
    type: 'invite',
    title: 'Workspace Invite',
    message: 'Sarah invited you to join the Design System team.',
    time: '2h ago',
    isUnread: true,
    actions: [
      { label: 'Accept', variant: 'primary' },
      { label: 'Decline', variant: 'secondary' }
    ]
  },
  {
    id: '5',
    type: 'warning',
    title: 'Expiring Soon',
    message: 'The proposal for TechFlow Inc. expires in 24 hours.',
    time: '2d ago',
    isUnread: false
  }
];

const notificationStyles = {
  view: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    border: 'border-indigo-100',
    icon: 'solar:file-text-linear'
  },
  comment: {
    bg: 'bg-sky-50',
    text: 'text-sky-600',
    border: 'border-sky-100',
    icon: 'solar:chat-round-line-linear'
  },
  download: {
    bg: 'bg-sky-50',
    text: 'text-sky-600',
    border: 'border-sky-100',
    icon: 'solar:download-minimalistic-linear'
  },
  invite: {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    border: 'border-purple-100',
    icon: 'solar:users-group-rounded-linear'
  },
  warning: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-100',
    icon: 'solar:danger-triangle-linear'
  }
};

interface NotificationCardProps {
  isOpen: boolean;
  onClose: () => void;
  onViewAll?: () => void;
}

export default function NotificationCard({ isOpen, onClose, onViewAll }: NotificationCardProps) {
  if (!isOpen) return null;

  const unreadCount = mockNotifications.filter(n => n.isUnread).length;
  const todayNotifications = mockNotifications.slice(0, 2);
  const previousNotifications = mockNotifications.slice(2);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Notification Card */}
      <div className="absolute top-full right-0 mt-4 w-[400px] sm:w-[440px] bg-white/95 backdrop-blur-2xl rounded-2xl border border-white/60 shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_20px_50px_-12px_rgba(0,0,0,0.15),0_4px_12px_-4px_rgba(0,0,0,0.05)] overflow-hidden origin-top-right animate-[slideDownFade_0.2s_cubic-bezier(0.16,1,0.3,1)_forwards] z-50">

        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 bg-white/50 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-[15px] font-bold text-slate-900 font-display tracking-tight">Notifications</h2>
            <span className="bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
              {unreadCount} New
            </span>
          </div>
          <button className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1 hover:bg-indigo-50 px-2 py-1 rounded-lg">
            <Icon icon="solar:check-read-linear" width="12" />
            Mark all as read
          </button>
        </div>

        {/* Content List */}
        <div className="max-h-[420px] overflow-y-auto bg-white/40 custom-scrollbar">

          {/* Today Group */}
          <div className="px-5 py-2.5 bg-slate-50/30 border-b border-slate-50">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Today</span>
          </div>

          {todayNotifications.map((notification) => {
            const style = notificationStyles[notification.type];
            return (
              <div
                key={notification.id}
                className={`group relative px-5 py-4 hover:bg-white transition-colors cursor-pointer border-b border-slate-50 ${notification.isUnread ? '' : 'opacity-80 hover:opacity-100'}`}
              >
                {notification.isUnread && notification.type === 'view' && (
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-indigo-500 rounded-r-full"></div>
                )}

                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 relative">
                    <div className={`w-10 h-10 rounded-[14px] ${style.bg} ${style.text} flex items-center justify-center border ${style.border} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <Icon icon={style.icon} width="20" />
                    </div>
                    {notification.badge && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm">
                        <Icon icon={notification.badge.icon} className={notification.badge.color} width="10" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex justify-between items-start mb-0.5">
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">
                        {notification.title}
                      </p>
                      <span className="text-[10px] font-medium text-slate-400">{notification.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      {notification.message}
                    </p>
                    {notification.actions && (
                      <div className="mt-2 flex gap-2">
                        {notification.actions.map((action, idx) => (
                          <button
                            key={idx}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-colors ${
                              action.variant === 'primary'
                                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-700'
                            }`}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {notification.isUnread && notification.type !== 'view' && (
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      notification.type === 'comment' ? 'bg-sky-500' :
                      notification.type === 'invite' ? 'bg-purple-500' : 'bg-slate-500'
                    }`}></div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Previous Group */}
          <div className="px-5 py-2.5 bg-slate-50/30 border-b border-slate-50 mt-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Previous</span>
          </div>

          {previousNotifications.map((notification) => {
            const style = notificationStyles[notification.type];
            return (
              <div
                key={notification.id}
                className={`group relative px-5 py-4 hover:bg-white transition-colors cursor-pointer border-b border-slate-50 ${notification.isUnread ? '' : 'opacity-80 hover:opacity-100'}`}
              >
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-[14px] ${style.bg} ${style.text} flex items-center justify-center border ${style.border} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <Icon icon={style.icon} width="20" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex justify-between items-start mb-0.5">
                      <p className="text-sm font-semibold text-slate-900">
                        {notification.title}
                      </p>
                      <span className="text-[10px] font-medium text-slate-400">{notification.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      {notification.message}
                    </p>
                    {notification.actions && (
                      <div className="mt-3 flex items-center gap-2">
                        {notification.actions.map((action, idx) => (
                          <button
                            key={idx}
                            className={`h-7 px-3 rounded-lg text-[10px] font-semibold transition-colors shadow-sm ${
                              action.variant === 'primary'
                                ? 'bg-slate-900 text-white hover:bg-slate-800'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {notification.isUnread && (
                    <div className={`w-1.5 h-1.5 rounded-full mt-2 mr-1 ${
                      notification.type === 'invite' ? 'bg-purple-500' : 'bg-slate-500'
                    }`}></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100">
          <button 
            onClick={() => {
              onClose();
              onViewAll?.();
            }}
            className="hover:text-indigo-600 hover:border-indigo-200 hover:shadow-md transition-all flex gap-2 group text-xs font-semibold text-slate-600 bg-white w-full border-slate-200 border rounded-xl pt-2.5 pb-2.5 shadow-sm items-center justify-center"
          >
            View all notifications
          </button>
        </div>

      </div>
    </>
  );
}
