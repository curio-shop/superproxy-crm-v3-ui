import { Icon } from '@iconify/react';
import { useState } from 'react';

interface LeaderboardEntry {
  id: string;
  member_id: string;
  member_name: string;
  member_email: string;
  member_avatar_url: string;
  total_revenue: number;
  quotations_sent: number;
  deals_won: number;
  deals_won_value: number;
  invoices_collected: number;
  success_rate: number;
  activity_streak: number;
  response_time_hours: number;
  points_scored: number;
  rank: number;
  badges: string[];
}

type PeriodType = 'week' | 'month' | 'all_time';

const mockLeaderboardData: LeaderboardEntry[] = [
  {
    id: '1',
    member_id: '2',
    member_name: 'Melwyn Arrubio',
    member_email: 'arrubiomelwyn@gmail.com',
    member_avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
    total_revenue: 245000,
    quotations_sent: 28,
    deals_won: 12,
    deals_won_value: 245000,
    invoices_collected: 10,
    success_rate: 42.9,
    activity_streak: 15,
    response_time_hours: 2.5,
    points_scored: 1250,
    rank: 1,
    badges: ['revenue_king', 'hot_streak', 'deal_closer'],
  },
  {
    id: '2',
    member_id: '1',
    member_name: 'Fiamma',
    member_email: 'fiamma@company.com',
    member_avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    total_revenue: 198000,
    quotations_sent: 22,
    deals_won: 9,
    deals_won_value: 198000,
    invoices_collected: 8,
    success_rate: 40.9,
    activity_streak: 12,
    response_time_hours: 3.2,
    points_scored: 980,
    rank: 2,
    badges: ['rising_star', 'speed_demon'],
  },
  {
    id: '3',
    member_id: '3',
    member_name: 'Sarah Johnson',
    member_email: 'sarah@fiamma.com',
    member_avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
    total_revenue: 156000,
    quotations_sent: 20,
    deals_won: 7,
    deals_won_value: 156000,
    invoices_collected: 7,
    success_rate: 35.0,
    activity_streak: 8,
    response_time_hours: 4.1,
    points_scored: 750,
    rank: 3,
    badges: ['deal_closer'],
  },
  {
    id: '4',
    member_id: '4',
    member_name: 'Mike Davis',
    member_email: 'mike@fiamma.com',
    member_avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80',
    total_revenue: 89000,
    quotations_sent: 15,
    deals_won: 4,
    deals_won_value: 89000,
    invoices_collected: 4,
    success_rate: 26.7,
    activity_streak: 5,
    response_time_hours: 5.8,
    points_scored: 420,
    rank: 4,
    badges: [],
  },
  {
    id: '5',
    member_id: '5',
    member_name: 'Emily Chen',
    member_email: 'emily@fiamma.com',
    member_avatar_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&q=80',
    total_revenue: 72000,
    quotations_sent: 12,
    deals_won: 3,
    deals_won_value: 72000,
    invoices_collected: 3,
    success_rate: 25.0,
    activity_streak: 6,
    response_time_hours: 4.5,
    points_scored: 360,
    rank: 5,
    badges: [],
  },
  {
    id: '6',
    member_id: '6',
    member_name: 'James Wilson',
    member_email: 'james@fiamma.com',
    member_avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    total_revenue: 58000,
    quotations_sent: 10,
    deals_won: 2,
    deals_won_value: 58000,
    invoices_collected: 2,
    success_rate: 20.0,
    activity_streak: 4,
    response_time_hours: 6.2,
    points_scored: 290,
    rank: 6,
    badges: [],
  },
  {
    id: '7',
    member_id: '7',
    member_name: 'Lisa Anderson',
    member_email: 'lisa@fiamma.com',
    member_avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    total_revenue: 45000,
    quotations_sent: 9,
    deals_won: 2,
    deals_won_value: 45000,
    invoices_collected: 2,
    success_rate: 22.2,
    activity_streak: 3,
    response_time_hours: 5.1,
    points_scored: 225,
    rank: 7,
    badges: [],
  },
  {
    id: '8',
    member_id: '8',
    member_name: 'Robert Taylor',
    member_email: 'robert@fiamma.com',
    member_avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80',
    total_revenue: 38000,
    quotations_sent: 8,
    deals_won: 2,
    deals_won_value: 38000,
    invoices_collected: 1,
    success_rate: 25.0,
    activity_streak: 2,
    response_time_hours: 7.3,
    points_scored: 190,
    rank: 8,
    badges: [],
  },
  {
    id: '9',
    member_id: '9',
    member_name: 'Amanda Martinez',
    member_email: 'amanda@fiamma.com',
    member_avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=80',
    total_revenue: 29000,
    quotations_sent: 7,
    deals_won: 1,
    deals_won_value: 29000,
    invoices_collected: 1,
    success_rate: 14.3,
    activity_streak: 3,
    response_time_hours: 8.1,
    points_scored: 145,
    rank: 9,
    badges: [],
  },
  {
    id: '10',
    member_id: '10',
    member_name: 'David Brown',
    member_email: 'david@fiamma.com',
    member_avatar_url: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&q=80',
    total_revenue: 21000,
    quotations_sent: 6,
    deals_won: 1,
    deals_won_value: 21000,
    invoices_collected: 1,
    success_rate: 16.7,
    activity_streak: 1,
    response_time_hours: 9.5,
    points_scored: 105,
    rank: 10,
    badges: [],
  },
];

const badgeConfig = {
  hot_streak: {
    icon: 'solar:fire-bold',
    color: 'text-orange-500',
    bg: 'bg-orange-50',
    label: 'Hot Streak',
    description: '15+ days active',
  },
  rising_star: {
    icon: 'solar:graph-up-bold',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    label: 'Rising Star',
    description: 'Biggest improvement',
  },
  deal_closer: {
    icon: 'solar:handshake-bold',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    label: 'Deal Closer',
    description: '35%+ success rate',
  },
  speed_demon: {
    icon: 'solar:bolt-bold',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    label: 'Speed Demon',
    description: 'Fast response time',
  },
  revenue_king: {
    icon: 'solar:crown-bold',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    label: 'Revenue King',
    description: 'Highest revenue',
  },
};

const formatCurrency = (amount: number) => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount}`;
};

export default function Leaderboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('month');
  const [isExpanded, setIsExpanded] = useState(true);
  const [showRemaining, setShowRemaining] = useState(false);

  const topTen = mockLeaderboardData.slice(0, 10);
  const topThree = topTen.slice(0, 3);
  const remaining = topTen.slice(3);

  const totalTeamRevenue = mockLeaderboardData.reduce((sum, entry) => sum + entry.total_revenue, 0);

  const getPodiumStyles = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          gradient: 'from-amber-50/50 to-yellow-100/50',
          border: 'border-amber-200/60',
          iconBg: 'bg-gradient-to-br from-amber-400 to-yellow-500',
          icon: 'solar:cup-star-bold',
          height: 'h-56',
        };
      case 2:
        return {
          gradient: 'from-slate-100/50 to-slate-200/50',
          border: 'border-slate-300/60',
          iconBg: 'bg-gradient-to-br from-slate-400 to-slate-500',
          icon: 'solar:medal-star-bold',
          height: 'h-56',
        };
      case 3:
        return {
          gradient: 'from-orange-50/50 to-orange-100/50',
          border: 'border-orange-200/60',
          iconBg: 'bg-gradient-to-br from-orange-400 to-orange-500',
          icon: 'solar:medal-ribbons-star-bold',
          height: 'h-56',
        };
      default:
        return {
          gradient: 'from-white to-slate-50',
          border: 'border-slate-200',
          iconBg: 'bg-slate-300',
          icon: 'solar:cup-bold',
          height: 'h-56',
        };
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-md">
              <Icon icon="solar:cup-star-bold" width="18" className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Sales Leaderboard</h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Top 10 Leaders • {formatCurrency(totalTeamRevenue)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              {[
                { value: 'week' as PeriodType, label: 'Week' },
                { value: 'month' as PeriodType, label: 'Month' },
                { value: 'all_time' as PeriodType, label: 'All Time' },
              ].map((period) => (
                <button
                  key={period.value}
                  onClick={() => setSelectedPeriod(period.value)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    selectedPeriod === period.value
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>

            <button
              onClick={toggleExpanded}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Icon
                icon={isExpanded ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'}
                width="18"
                className="text-slate-400"
              />
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {topThree.map((entry) => {
              const styles = getPodiumStyles(entry.rank);
              const topBadge = entry.badges[0];

              return (
                <div
                  key={entry.id}
                  className={`relative bg-gradient-to-br ${styles.gradient} border ${styles.border} rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:scale-102 ${styles.height} flex flex-col overflow-hidden`}
                >
                  {/* Parallel concentric circles - balanced spacing */}
                  {/* Outer circle */}
                  <div 
                    className="absolute -top-10 -right-10 w-40 h-40 rounded-full border-[2.5px] opacity-8 pointer-events-none select-none"
                    style={{
                      borderColor: entry.rank === 1 ? '#fbbf24' : entry.rank === 2 ? '#94a3b8' : '#fb923c'
                    }}
                  ></div>
                  
                  {/* Inner circle - 20px spacing for balance */}
                  <div 
                    className="absolute -top-5 -right-5 w-20 h-20 rounded-full border-[2.5px] opacity-10 pointer-events-none select-none"
                    style={{
                      borderColor: entry.rank === 1 ? '#fbbf24' : entry.rank === 2 ? '#94a3b8' : '#fb923c'
                    }}
                  ></div>
                  
                  {/* Rank number - color-coded */}
                  <div 
                    className="absolute top-2 right-3 text-7xl font-black opacity-12 leading-none pointer-events-none select-none"
                    style={{
                      color: entry.rank === 1 ? '#f59e0b' : entry.rank === 2 ? '#64748b' : '#fb923c'
                    }}
                  >
                    {entry.rank}
                  </div>

                  <div className="flex flex-col items-center text-center flex-1 relative z-10">
                    <div className="relative mb-4">
                      <div className="relative h-16 w-16 rounded-full overflow-hidden shadow-lg ring-4 ring-white">
                        <img
                          src={entry.member_avatar_url}
                          alt={entry.member_name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 h-8 w-8 ${styles.iconBg} rounded-full flex items-center justify-center shadow-md ring-3 ring-white`}
                      >
                        <Icon icon={styles.icon} width="14" className="text-white" />
                      </div>
                    </div>

                    <div className="mb-5">
                      <h4 className="text-base font-bold text-slate-900 mb-1.5">{entry.member_name}</h4>
                      {topBadge && (
                        <div className="flex items-center justify-center">
                          {(() => {
                            const config = badgeConfig[topBadge as keyof typeof badgeConfig];
                            return (
                              <div
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${config.bg}`}
                                title={config.description}
                              >
                                <Icon icon={config.icon} width="10" className={config.color} />
                                <span className={`text-[10px] font-semibold ${config.color}`}>
                                  {config.label}
                                </span>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 flex-1 flex flex-col justify-center w-full">
                      <div>
                        <p className="text-xs font-medium text-slate-600 mb-1">Total Revenue</p>
                        <p className="text-2xl font-bold text-slate-900 mb-3">{formatCurrency(entry.total_revenue)}</p>
                      </div>

                      <div className="flex items-center justify-center gap-4">
                        <div>
                          <p className="text-xs text-slate-600">Deals Won</p>
                          <p className="text-lg font-bold text-slate-900">{entry.deals_won}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {remaining.length > 0 && (
            <div className="pt-2">
              <button
                onClick={() => setShowRemaining(!showRemaining)}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors group"
              >
                <span>
                  {showRemaining ? 'Hide' : 'Show'} Ranks 4-10
                </span>
                <Icon
                  icon={showRemaining ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'}
                  width="16"
                  className="text-slate-400 group-hover:text-slate-600 transition-colors"
                />
              </button>

              {showRemaining && (
                <div className="space-y-1 bg-slate-50/50 rounded-xl p-3 mt-2">
                  {remaining.map((entry) => {
                    return (
                      <div
                        key={entry.id}
                        className="relative bg-white border border-slate-200/60 rounded-lg p-3 flex items-center gap-3 hover:border-slate-300 transition-colors overflow-hidden"
                      >
                        <div className="absolute top-1 right-2 text-5xl font-black text-slate-900 opacity-[0.03] leading-none pointer-events-none select-none">
                          {entry.rank}
                        </div>

                        <div className="h-9 w-9 rounded-full overflow-hidden shadow-sm flex-shrink-0 ring-2 ring-slate-100">
                          <img
                            src={entry.member_avatar_url}
                            alt={entry.member_name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="flex-1 text-left min-w-0">
                          <span className="text-sm font-semibold text-slate-900 block truncate">{entry.member_name}</span>
                        </div>

                        <div className="flex items-center gap-5 flex-shrink-0">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xs font-medium text-slate-500">Revenue:</span>
                            <span className="text-sm font-bold text-slate-900">{formatCurrency(entry.total_revenue)}</span>
                          </div>

                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xs font-medium text-slate-500">Deals Won:</span>
                            <span className="text-sm font-bold text-slate-900">{entry.deals_won}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
