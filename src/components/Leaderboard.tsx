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
  },
  rising_star: {
    icon: 'solar:graph-up-bold',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    label: 'Rising Star',
  },
  deal_closer: {
    icon: 'solar:handshake-bold',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    label: 'Deal Closer',
  },
  speed_demon: {
    icon: 'solar:bolt-bold',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    label: 'Speed Demon',
  },
  revenue_king: {
    icon: 'solar:crown-bold',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    label: 'Revenue King',
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

const getRankIndicator = (rank: number) => {
  switch (rank) {
    case 1:
      return { icon: 'solar:crown-bold', color: 'text-amber-500', bg: 'bg-amber-50 border-amber-100' };
    case 2:
      return { icon: 'solar:medal-star-bold', color: 'text-slate-400', bg: 'bg-slate-50 border-slate-200' };
    case 3:
      return { icon: 'solar:medal-ribbons-star-bold', color: 'text-orange-400', bg: 'bg-orange-50 border-orange-100' };
    default:
      return null;
  }
};

interface LeaderboardProps {
  isFreeTier?: boolean;
  onUpgrade?: () => void;
}

export default function Leaderboard({ isFreeTier = false, onUpgrade }: LeaderboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('month');
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const topTen = mockLeaderboardData.slice(0, 10);
  const topThree = topTen.slice(0, 3);
  const remaining = topTen.slice(3);
  const topRevenue = topTen[0]?.total_revenue || 1;
  const totalTeamRevenue = mockLeaderboardData.reduce((sum, entry) => sum + entry.total_revenue, 0);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Icon icon="solar:cup-star-bold" width="14" className="text-amber-500" />
            Top Performers
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
            {[
              { value: 'week' as PeriodType, label: 'Week' },
              { value: 'month' as PeriodType, label: 'Month' },
              { value: 'all_time' as PeriodType, label: 'All Time' },
            ].map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  selectedPeriod === period.value
                    ? 'bg-white text-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-7 h-7 flex items-center justify-center hover:bg-slate-50 rounded-lg transition-colors"
          >
            <Icon
              icon={isExpanded ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'}
              width="16"
              className="text-slate-400"
            />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div>
          {/* Rankings Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-[11px] font-medium text-slate-400 uppercase tracking-wider pl-5 pr-4 py-3 w-10">#</th>
                  <th className="text-left text-[11px] font-medium text-slate-400 uppercase tracking-wider px-5 py-3">Member</th>
                  <th className="text-right text-[11px] font-medium text-slate-400 uppercase tracking-wider px-4 py-3">
                    <div className="relative inline-flex items-center gap-1 group/tooltip cursor-default">
                      Revenue
                      <Icon icon="solar:info-circle-linear" width="11" className="text-slate-300 group-hover/tooltip:text-slate-500 transition-colors" />
                      <span className="absolute top-full right-0 mt-2 px-2.5 py-1.5 bg-slate-900 text-white text-[11px] font-medium rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap shadow-lg z-50 normal-case tracking-normal">
                        Total value of closed-won deals
                      </span>
                    </div>
                  </th>
                  <th className="text-right text-[11px] font-medium text-slate-400 uppercase tracking-wider px-4 py-3 hidden sm:table-cell">
                    <div className="relative inline-flex items-center gap-1 group/tooltip cursor-default">
                      Deals
                      <Icon icon="solar:info-circle-linear" width="11" className="text-slate-300 group-hover/tooltip:text-slate-500 transition-colors" />
                      <span className="absolute top-full right-0 mt-2 px-2.5 py-1.5 bg-slate-900 text-white text-[11px] font-medium rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap shadow-lg z-50 normal-case tracking-normal">
                        Number of quotations marked as won
                      </span>
                    </div>
                  </th>
                  <th className="text-right text-[11px] font-medium text-slate-400 uppercase tracking-wider px-4 py-3 hidden md:table-cell">
                    <div className="relative inline-flex items-center gap-1 group/tooltip cursor-default">
                      Win Rate
                      <Icon icon="solar:info-circle-linear" width="11" className="text-slate-300 group-hover/tooltip:text-slate-500 transition-colors" />
                      <span className="absolute top-full right-0 mt-2 px-2.5 py-1.5 bg-slate-900 text-white text-[11px] font-medium rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap shadow-lg z-50 normal-case tracking-normal">
                        Deals won ÷ quotations sent
                      </span>
                    </div>
                  </th>
                  <th className="text-right text-[11px] font-medium text-slate-400 uppercase tracking-wider pl-4 pr-5 py-3 hidden lg:table-cell w-[140px]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(showAll ? topTen : topThree).map((entry) => {
                  const rankIndicator = getRankIndicator(entry.rank);
                  const revenuePercent = Math.round((entry.total_revenue / topRevenue) * 100);
                  const topBadge = entry.badges[0];

                  return (
                    <tr
                      key={entry.id}
                      className={`hover:bg-slate-50/70 transition-colors group ${
                        entry.rank === 1 ? 'bg-amber-50/20' : ''
                      }`}
                    >
                      {/* Rank */}
                      <td className="pl-5 pr-4 py-3">
                        {rankIndicator ? (
                          <div className={`w-7 h-7 rounded-lg border ${rankIndicator.bg} flex items-center justify-center`}>
                            <Icon icon={rankIndicator.icon} width="14" className={rankIndicator.color} />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center">
                            <span className="text-[13px] font-semibold text-slate-300">{entry.rank}</span>
                          </div>
                        )}
                      </td>

                      {/* Member */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          {isFreeTier ? (
                            /* Free tier: hidden avatar + redacted name */
                            <>
                              <div className={`h-8 w-8 rounded-lg flex-shrink-0 bg-slate-100 flex items-center justify-center ${
                                entry.rank === 1 ? 'ring-2 ring-amber-200' : 'ring-2 ring-slate-100'
                              }`}>
                                <Icon icon="solar:user-bold" width="14" className="text-slate-300" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <div className="h-3.5 w-24 rounded bg-slate-100" />
                                  {topBadge && (() => {
                                    const config = badgeConfig[topBadge as keyof typeof badgeConfig];
                                    return (
                                      <div className={`hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded ${config.bg}`}>
                                        <Icon icon={config.icon} width="10" className={config.color} />
                                        <span className={`text-[9px] font-semibold ${config.color}`}>{config.label}</span>
                                      </div>
                                    );
                                  })()}
                                </div>
                                <div className="h-2.5 w-32 rounded bg-slate-50 mt-1.5" />
                              </div>
                            </>
                          ) : (
                            /* Paid tier: real avatar + name */
                            <>
                              <div className={`h-8 w-8 rounded-lg overflow-hidden shadow-sm flex-shrink-0 ${
                                entry.rank === 1 ? 'ring-2 ring-amber-200' : 'ring-2 ring-white'
                              }`}>
                                <img
                                  src={entry.member_avatar_url}
                                  alt={entry.member_name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[13px] font-medium text-slate-800 truncate">{entry.member_name}</span>
                                  {topBadge && (() => {
                                    const config = badgeConfig[topBadge as keyof typeof badgeConfig];
                                    return (
                                      <div className={`hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded ${config.bg}`}>
                                        <Icon icon={config.icon} width="10" className={config.color} />
                                        <span className={`text-[9px] font-semibold ${config.color}`}>{config.label}</span>
                                      </div>
                                    );
                                  })()}
                                </div>
                                <div className="text-[11px] text-slate-400 truncate">{entry.member_email}</div>
                              </div>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Revenue */}
                      <td className="px-4 py-3 text-right">
                        <span className={`text-[13px] font-semibold ${
                          entry.rank === 1 ? 'text-slate-900' : 'text-slate-700'
                        }`}>
                          {formatCurrency(entry.total_revenue)}
                        </span>
                      </td>

                      {/* Deals Won */}
                      <td className="px-4 py-3 text-right hidden sm:table-cell">
                        <span className="text-[13px] text-slate-500">{entry.deals_won}</span>
                      </td>

                      {/* Win Rate */}
                      <td className="px-4 py-3 text-right hidden md:table-cell">
                        <span className={`text-[13px] ${
                          entry.success_rate >= 35 ? 'text-emerald-600 font-medium' : 'text-slate-500'
                        }`}>
                          {entry.success_rate.toFixed(1)}%
                        </span>
                      </td>

                      {/* Revenue Bar */}
                      <td className="pl-4 pr-5 py-3 hidden lg:table-cell">
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              entry.rank === 1
                                ? 'bg-amber-400'
                                : entry.rank === 2
                                  ? 'bg-slate-400'
                                  : entry.rank === 3
                                    ? 'bg-orange-300'
                                    : 'bg-slate-200'
                            }`}
                            style={{ width: `${revenuePercent}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex border-t border-slate-100 py-2.5 px-4 items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Showing {showAll ? '1–10' : '1–3'} of {topTen.length}
            </span>
            {isFreeTier ? (
              <button
                onClick={onUpgrade}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-amber-600 hover:text-amber-700 hover:bg-amber-50 transition-colors"
              >
                <Icon icon="solar:lock-keyhole-minimalistic-linear" width="12" className="text-amber-500" />
                <span>Reveal who's on top</span>
              </button>
            ) : remaining.length > 0 ? (
              <button
                onClick={() => setShowAll(!showAll)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span>{showAll ? 'Show Less' : `Show Ranks 4–10`}</span>
                <Icon
                  icon={showAll ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'}
                  width="12"
                  className="text-slate-400"
                />
              </button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
