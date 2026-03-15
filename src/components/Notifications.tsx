import { Icon } from '@iconify/react';
import { useState } from 'react';

interface Notification {
  id: string;
  type: 'expiring' | 'overdue' | 'download' | 'invite' | 'comment';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  isNew: boolean;
  icon: string;
  iconColor: string;
  iconBg: string;
  iconBorder: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'expiring',
    title: 'Expiring Soon',
    message: '"Asok Tables and Chairs" expires within 24 hours.',
    timestamp: '1 day ago',
    isRead: false,
    isNew: true,
    icon: 'solar:danger-triangle-linear',
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-100',
    iconBorder: 'border-blue-200/50',
  },
  {
    id: '2',
    type: 'expiring',
    title: 'Expiring Soon',
    message: '"12222025 QUOTE PAREF / 4 Sets Retractable with HDPE Bleacher Seat" expires within 24 hours.',
    timestamp: '2 days ago',
    isRead: true,
    isNew: false,
    icon: 'solar:danger-triangle-linear',
    iconColor: 'text-orange-600',
    iconBg: 'bg-orange-50',
    iconBorder: 'border-orange-100',
  },
  {
    id: '3',
    type: 'overdue',
    title: 'Overdue',
    message: 'An invoice is overdue (unpaid beyond due date).',
    timestamp: '6 days ago',
    isRead: true,
    isNew: false,
    icon: 'solar:wad-of-money-linear',
    iconColor: 'text-red-600',
    iconBg: 'bg-red-50',
    iconBorder: 'border-red-100',
  },
  {
    id: '4',
    type: 'download',
    title: 'Quote Downloaded',
    message: 'Client Acme Inc downloaded proposal Q-24-02.',
    timestamp: '7 days ago',
    isRead: true,
    isNew: false,
    icon: 'solar:download-minimalistic-linear',
    iconColor: 'text-sky-600',
    iconBg: 'bg-sky-50',
    iconBorder: 'border-sky-100',
  },
  {
    id: '5',
    type: 'invite',
    title: 'Workspace Invite',
    message: 'Sarah invited you to join the Design System team.',
    timestamp: '9 days ago',
    isRead: true,
    isNew: false,
    icon: 'solar:users-group-rounded-linear',
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50',
    iconBorder: 'border-purple-100',
  },
  {
    id: '6',
    type: 'comment',
    title: 'New Comment on Your Quote',
    message: 'Sarah M. added a comment to "Office Renovation Proposal".',
    timestamp: '10 days ago',
    isRead: true,
    isNew: false,
    icon: 'solar:chat-round-line-linear',
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
    iconBorder: 'border-blue-100',
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(notifications.map(n => n.id)));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectNotification = (id: string) => {
    const newSelected = new Set(selectedNotifications);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedNotifications(newSelected);
    setSelectAll(newSelected.size === notifications.length);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true, isNew: false })));
  };

  const handleDeleteSelected = () => {
    setNotifications(notifications.filter(n => !selectedNotifications.has(n.id)));
    setSelectedNotifications(new Set());
    setSelectAll(false);
  };

  const handleDeleteAll = () => {
    if (window.confirm('Are you sure you want to delete all notifications?')) {
      setNotifications([]);
      setSelectedNotifications(new Set());
      setSelectAll(false);
    }
  };

  const filteredNotifications = notifications.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-hidden flex flex-col" style={{ scrollbarGutter: 'stable' }}>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="mx-auto max-w-5xl px-6 py-8 md:px-10 md:py-12">
          {/* Search and Unread Count */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="relative w-full md:w-96 group">
              <Icon 
                icon="solar:magnifer-linear" 
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors" 
                width="20" 
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notifications by title..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 shadow-sm transition-all hover:border-slate-300"
              />
            </div>
            
            {/* Unread Count - Minimalist */}
            {unreadCount > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-slate-600">
                  {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
                </span>
              </div>
            )}
          </div>

          {/* Actions Row */}
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2.5">
              <label htmlFor="selectAll" className="custom-checkbox flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="selectAll"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="sr-only"
                />
                <div className="w-[18px] h-[18px] border-2 border-slate-300 rounded-md bg-white flex items-center justify-center transition-all hover:border-slate-400 hover:bg-slate-50">
                  <svg className="w-3 h-3 text-white hidden" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M20 6 9 17l-5-5"></path>
                  </svg>
                </div>
              </label>
              <label htmlFor="selectAll" className="text-[13px] font-medium text-slate-500 cursor-pointer select-none">
                Select all
              </label>
            </div>
            <div className="flex flex-wrap gap-3 items-center min-h-[40px]">
              {/* Conditional Delete Buttons - No Layout Shift */}
              <div className="min-w-[152px]">
                {selectedNotifications.size === notifications.length && selectedNotifications.size > 0 ? (
                  <button
                    onClick={handleDeleteAll}
                    className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors border border-red-100 active:scale-[0.98] w-full justify-center"
                  >
                    <Icon icon="solar:trash-bin-2-linear" width="18" />
                    Delete all
                  </button>
                ) : selectedNotifications.size > 0 ? (
                  <button
                    onClick={handleDeleteSelected}
                    className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors border border-red-100 active:scale-[0.98] w-full justify-center"
                  >
                    <Icon icon="solar:trash-bin-trash-linear" width="18" />
                    Delete selected
                  </button>
                ) : null}
              </div>
              
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-[0.98]"
              >
                <Icon icon="solar:check-read-linear" width="18" />
                Mark all as read
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex flex-col gap-3">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Icon icon="solar:bell-off-linear" width="48" className="text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No notifications found</p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`group relative flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition-all ${
                    !notif.isRead
                      ? 'border-blue-100 bg-blue-50/20 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5'
                      : 'border-slate-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-slate-200 hover:shadow-md'
                  }`}
                >
                  <label className="custom-checkbox flex items-center cursor-pointer pt-0.5">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.has(notif.id)}
                      onChange={() => handleSelectNotification(notif.id)}
                      className="sr-only"
                    />
                    <div className="w-[18px] h-[18px] border-2 border-slate-300 rounded-md bg-white flex items-center justify-center transition-all hover:border-slate-400 hover:bg-slate-50">
                      <svg className="w-3 h-3 text-white hidden" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M20 6 9 17l-5-5"></path>
                      </svg>
                    </div>
                  </label>
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${notif.iconBg} ${notif.iconColor} ${notif.iconBorder}`}>
                    <Icon icon={notif.icon} width="24" />
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5 pr-14">
                    <h3 className={`text-[15px] leading-snug ${!notif.isRead ? 'font-semibold' : 'font-medium'} text-slate-900`}>
                      {notif.title}
                    </h3>
                    <p className="text-[13px] text-slate-500 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                  <div className="absolute right-5 top-5 flex flex-col items-end gap-2.5">
                    <span className="text-[11px] font-medium text-slate-400 tracking-wide">
                      {notif.timestamp}
                    </span>
                    {notif.isNew && (
                      <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200 uppercase tracking-wide">
                        New
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Load More */}
          {filteredNotifications.length > 0 && (
            <div className="mt-8 flex justify-center">
              <button className="text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors">
                Load more notifications
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
