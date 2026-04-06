import { Icon } from '@iconify/react';
import { useTier } from '../contexts/TierContext';

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
  {
    id: 6,
    type: 'sent',
    user: 'Marco Reyes',
    action: 'sent email to',
    target: 'logistics@buildcorp.ph',
    time: '7d ago',
    icon: 'solar:letter-bold',
    iconBg: 'bg-white border-sky-100',
    iconColor: 'text-sky-500',
    ringColor: 'ring-sky-50/50',
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
  onUpgrade?: () => void;
}

export default function TeamActivity({ onViewFullActivity, onUpgrade }: TeamActivityProps) {
  const { can } = useTier();
  const isFreeTier = !can('teamActivity');
  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] border border-slate-100/80 h-full flex flex-col relative overflow-hidden">
      <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-slate-700">Team Activity</h3>
        <span className="text-[10px] text-slate-400">Live</span>
      </div>

      {isFreeTier ? (
        /* Free tier: show all real activities, bottom CTA disguised as "see more" */
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className={`h-6 w-6 rounded-md ${activity.iconBg} flex items-center justify-center ${activity.iconColor}`}>
                    <Icon icon={activity.icon} width="12" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-[13px] font-medium text-slate-700">{activityTitles[activity.type]}</p>
                    <span className="text-[10px] text-slate-400 flex-shrink-0">{activity.time}</span>
                  </div>
                  <p className="text-[12px] text-slate-400 leading-relaxed">
                    <span className="text-slate-600 font-medium">{activity.user}</span>{' '}
                    {activity.action} <span className="text-slate-500">{activity.target}</span>
                    {activity.type === 'presentation' || activity.type === 'published' ? '.' : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-slate-100">
            <button
              onClick={onUpgrade}
              className="w-full py-2 rounded-xl text-[12px] font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
            >
              See all activity
            </button>
          </div>
        </>
      ) : (
        /* Normal tier: full activity feed */
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className={`h-6 w-6 rounded-md ${activity.iconBg} flex items-center justify-center ${activity.iconColor}`}>
                    <Icon icon={activity.icon} width="12" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-[13px] font-medium text-slate-700">{activityTitles[activity.type]}</p>
                    <span className="text-[10px] text-slate-400 flex-shrink-0">{activity.time}</span>
                  </div>
                  <p className="text-[12px] text-slate-400 leading-relaxed">
                    <span className="text-slate-600 font-medium">{activity.user}</span>{' '}
                    {activity.action} <span className="text-slate-500">{activity.target}</span>
                    {activity.type === 'presentation' || activity.type === 'published' ? '.' : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-slate-100">
            <button
              onClick={onViewFullActivity}
              className="w-full py-2 rounded-xl text-[12px] font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
            >
              See all activity
            </button>
          </div>
        </>
      )}
    </div>
  );
}
