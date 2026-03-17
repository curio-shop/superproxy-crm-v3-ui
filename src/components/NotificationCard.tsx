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
    id: '1', type: 'view', title: 'Quotation Viewed',
    message: 'Acme Corp viewed "Q-2024-001" for the 3rd time today.',
    time: '2m ago', isUnread: true,
  },
  {
    id: '2', type: 'comment', title: 'New Comment',
    message: 'Sarah M. commented: "Can we adjust the quantity on line item #2?"',
    time: '1h ago', isUnread: true,
    actions: [{ label: 'Reply', variant: 'primary' }, { label: 'Dismiss', variant: 'secondary' }]
  },
  {
    id: '3', type: 'download', title: 'Quote Downloaded',
    message: 'Client Acme Inc downloaded proposal Q-24-02.',
    time: '5m ago', isUnread: false,
  },
  {
    id: '4', type: 'invite', title: 'Workspace Invite',
    message: 'Sarah invited you to join the Design System team.',
    time: '2h ago', isUnread: true,
    actions: [{ label: 'Accept', variant: 'primary' }, { label: 'Decline', variant: 'secondary' }]
  },
  {
    id: '5', type: 'warning', title: 'Expiring Soon',
    message: 'The proposal for TechFlow Inc. expires in 24 hours.',
    time: '2d ago', isUnread: false,
  }
];

const typeIcons: Record<string, string> = {
  view: 'solar:eye-linear',
  comment: 'solar:chat-round-line-linear',
  download: 'solar:download-minimalistic-linear',
  invite: 'solar:users-group-rounded-linear',
  warning: 'solar:danger-triangle-linear',
};

interface NotificationCardProps {
  isOpen: boolean;
  onClose: () => void;
  onViewAll?: () => void;
}

export default function NotificationCard({ isOpen, onClose, onViewAll }: NotificationCardProps) {
  if (!isOpen) return null;

  const unreadCount = mockNotifications.filter(n => n.isUnread).length;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div className="absolute top-full right-0 mt-2 w-[380px] bg-white rounded-2xl border border-slate-200 shadow-[0_24px_80px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.03)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">

        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-[13px] font-semibold text-slate-700">Notifications</h2>
            {unreadCount > 0 && (
              <span className="text-[10px] font-semibold text-slate-400">{unreadCount} new</span>
            )}
          </div>
          <button className="text-[11px] font-medium text-slate-400 hover:text-slate-600 transition-colors">
            Mark all read
          </button>
        </div>

        {/* List */}
        <div className="max-h-[360px] overflow-y-auto custom-scrollbar divide-y divide-slate-50">
          {mockNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`px-4 py-3 hover:bg-slate-50/70 transition-colors cursor-pointer ${notification.isUnread ? '' : 'opacity-60 hover:opacity-100'}`}
            >
              <div className="flex gap-3 items-start">
                <Icon icon={typeIcons[notification.type]} width="15" className="text-slate-400 flex-shrink-0 mt-1" />

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <p className="text-[13px] font-medium text-slate-700">{notification.title}</p>
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                      <span className="text-[10px] text-slate-400">{notification.time}</span>
                      {notification.isUnread && (
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                      )}
                    </div>
                  </div>
                  <p className="text-[12px] text-slate-400 leading-relaxed">{notification.message}</p>
                  {notification.actions && (
                    <div className="mt-2 flex gap-1.5">
                      {notification.actions.map((action, idx) => (
                        <button
                          key={idx}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                            action.variant === 'primary'
                              ? 'bg-slate-900 text-white hover:bg-slate-800'
                              : 'border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-100">
          <button
            onClick={() => { onClose(); onViewAll?.(); }}
            className="w-full py-2 rounded-xl text-[12px] font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
          >
            View all notifications
          </button>
        </div>
      </div>
    </>
  );
}
