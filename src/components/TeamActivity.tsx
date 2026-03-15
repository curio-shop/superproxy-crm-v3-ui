import { Icon } from '@iconify/react';

interface Activity {
  id: number;
  type: 'delivered' | 'sent' | 'commented' | 'presentation' | 'published';
  user: string;
  action: string;
  target: string;
  time: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  ringColor: string;
}

const activities: Activity[] = [
  {
    id: 1,
    type: 'delivered',
    user: 'Pete Salvador',
    action: 'email delivered to',
    target: 'rubio@gmail.com',
    time: '6d ago',
    icon: 'solar:check-circle-bold',
    iconBg: 'bg-white border-emerald-100',
    iconColor: 'text-emerald-500',
    ringColor: 'ring-emerald-50/50',
  },
  {
    id: 2,
    type: 'sent',
    user: 'Pete Salvador',
    action: 'sent email to',
    target: 'antoinette@gmail.com',
    time: '6d ago',
    icon: 'solar:letter-bold',
    iconBg: 'bg-white border-sky-100',
    iconColor: 'text-sky-500',
    ringColor: 'ring-sky-50/50',
  },
  {
    id: 3,
    type: 'commented',
    user: 'Pete Salvador',
    action: 'commented on',
    target: '"MaxAir Project"',
    time: '6d ago',
    icon: 'solar:chat-round-dots-bold',
    iconBg: 'bg-white border-amber-100',
    iconColor: 'text-amber-500',
    ringColor: 'ring-amber-50/50',
  },
  {
    id: 4,
    type: 'presentation',
    user: 'Pete Salvador',
    action: 'created a presentation for',
    target: '"Berkshire Stadium Project"',
    time: '6d ago',
    icon: 'solar:file-text-bold',
    iconBg: 'bg-white border-purple-100',
    iconColor: 'text-purple-500',
    ringColor: 'ring-purple-50/50',
  },
  {
    id: 5,
    type: 'published',
    user: 'Pete Salvador',
    action: 'published',
    target: '"APPQUANT HQ Renovation"',
    time: '6d ago',
    icon: 'solar:plain-3-bold',
    iconBg: 'bg-white border-indigo-100',
    iconColor: 'text-indigo-500',
    ringColor: 'ring-indigo-50/50',
  },
];

const activityTitles: Record<Activity['type'], string> = {
  delivered: 'Delivered',
  sent: 'Sent',
  commented: 'Commented',
  presentation: 'Presentation Created',
  published: 'Published',
};

interface TeamActivityProps {
  onViewFullActivity?: () => void;
}

export default function TeamActivity({ onViewFullActivity }: TeamActivityProps) {
  return (
    <div className="glass-card rounded-2xl h-full flex flex-col rounded-[20px]">
      <div className="p-6 border-b flex items-center justify-between border-slate-100/50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Icon icon="solar:pulse-2-bold" width="18" />
          </div>
          <h3 className="font-semibold text-slate-900 font-display">Team Activity</h3>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          Real-time
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-8 relative">
        <div className="absolute left-[39px] top-8 bottom-8 w-px bg-slate-200/60"></div>
        {activities.map((activity) => (
          <div key={activity.id} className="relative flex gap-4">
            <div className="relative z-10 flex-shrink-0 mt-1">
              <div
                className={`h-8 w-8 rounded-full ${activity.iconBg} border flex items-center justify-center ${activity.iconColor} shadow-lg shadow-${activity.iconColor.split('-')[1]}-500/10 ring-4 ${activity.ringColor}`}
              >
                <Icon icon={activity.icon} width="14" />
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">{activityTitles[activity.type]}</p>
                <span className="text-xs text-slate-400">{activity.time}</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                <span className="text-slate-900 font-semibold hover:text-indigo-600 cursor-pointer transition">
                  {activity.user}
                </span>{' '}
                {activity.action} <span className="text-slate-700">{activity.target}</span>
                {activity.type === 'presentation' || activity.type === 'published' ? '.' : ''}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-slate-100/50">
        <button
          onClick={onViewFullActivity}
          className="w-full py-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-md transition flex items-center justify-center gap-2"
        >
          See Full Activity
        </button>
      </div>
    </div>
  );
}
