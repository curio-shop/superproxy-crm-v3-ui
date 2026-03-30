import { useState, memo, useMemo } from 'react';
import { Icon } from '@iconify/react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type ViewType = 'pipeline' | 'revenue';
type DateRangeType = '7D' | '30D' | '12M';

const pipelineData = [
  { month: 'Jan', quotations: 180000, dealsWon: 120000 },
  { month: 'Feb', quotations: 250000, dealsWon: 180000 },
  { month: 'Mar', quotations: 320000, dealsWon: 240000 },
  { month: 'Apr', quotations: 290000, dealsWon: 210000 },
  { month: 'May', quotations: 450000, dealsWon: 350000 },
  { month: 'Jun', quotations: 580000, dealsWon: 420000 },
  { month: 'Jul', quotations: 490000, dealsWon: 380000 },
  { month: 'Aug', quotations: 750000, dealsWon: 580000 },
  { month: 'Sep', quotations: 920000, dealsWon: 720000 },
  { month: 'Oct', quotations: 1200000, dealsWon: 950000 },
  { month: 'Nov', quotations: 1600000, dealsWon: 1280000 },
  { month: 'Dec', quotations: 2262851, dealsWon: 1850000 },
];

const revenueData = [
  { month: 'Jan', invoiced: 150000, collected: 120000 },
  { month: 'Feb', invoiced: 220000, collected: 190000 },
  { month: 'Mar', invoiced: 280000, collected: 250000 },
  { month: 'Apr', invoiced: 310000, collected: 280000 },
  { month: 'May', invoiced: 420000, collected: 380000 },
  { month: 'Jun', invoiced: 520000, collected: 480000 },
  { month: 'Jul', invoiced: 460000, collected: 420000 },
  { month: 'Aug', invoiced: 680000, collected: 620000 },
  { month: 'Sep', invoiced: 850000, collected: 780000 },
  { month: 'Oct', invoiced: 1100000, collected: 1020000 },
  { month: 'Nov', invoiced: 1450000, collected: 1320000 },
  { month: 'Dec', invoiced: 2100000, collected: 1890000 },
];

// Flat placeholder data for free tier — renders as calm horizontal lines
const flatPipelineData = [
  { month: 'Jan', quotations: 45000, dealsWon: 30000 },
  { month: 'Feb', quotations: 45000, dealsWon: 30000 },
  { month: 'Mar', quotations: 45000, dealsWon: 30000 },
  { month: 'Apr', quotations: 45000, dealsWon: 30000 },
  { month: 'May', quotations: 45000, dealsWon: 30000 },
  { month: 'Jun', quotations: 45000, dealsWon: 30000 },
  { month: 'Jul', quotations: 45000, dealsWon: 30000 },
  { month: 'Aug', quotations: 45000, dealsWon: 30000 },
  { month: 'Sep', quotations: 45000, dealsWon: 30000 },
  { month: 'Oct', quotations: 45000, dealsWon: 30000 },
  { month: 'Nov', quotations: 45000, dealsWon: 30000 },
  { month: 'Dec', quotations: 45000, dealsWon: 30000 },
];

const flatRevenueData = [
  { month: 'Jan', invoiced: 45000, collected: 30000 },
  { month: 'Feb', invoiced: 45000, collected: 30000 },
  { month: 'Mar', invoiced: 45000, collected: 30000 },
  { month: 'Apr', invoiced: 45000, collected: 30000 },
  { month: 'May', invoiced: 45000, collected: 30000 },
  { month: 'Jun', invoiced: 45000, collected: 30000 },
  { month: 'Jul', invoiced: 45000, collected: 30000 },
  { month: 'Aug', invoiced: 45000, collected: 30000 },
  { month: 'Sep', invoiced: 45000, collected: 30000 },
  { month: 'Oct', invoiced: 45000, collected: 30000 },
  { month: 'Nov', invoiced: 45000, collected: 30000 },
  { month: 'Dec', invoiced: 45000, collected: 30000 },
];

interface ChartCardProps {
  isFreeTier?: boolean;
  onUpgrade?: () => void;
}

function ChartCard({ isFreeTier = false, onUpgrade }: ChartCardProps) {
  const [fiscalYear, setFiscalYear] = useState('2026');
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [activeView, setActiveView] = useState<ViewType>('pipeline');
  const [dateRange, setDateRange] = useState<DateRangeType>('12M');

  const chartData = useMemo(() => {
    if (isFreeTier) {
      return activeView === 'pipeline' ? flatPipelineData : flatRevenueData;
    }
    return activeView === 'pipeline' ? pipelineData : revenueData;
  }, [activeView, isFreeTier]);

  const primaryLabel = activeView === 'pipeline' ? 'Quotations' : 'Invoiced';
  const secondaryLabel = activeView === 'pipeline' ? 'Deals Won' : 'Collected';

  const ytdMetrics = {
    pipeline: { primary: 15.2, secondary: 12.8 },
    revenue: { primary: 18.4, secondary: 14.6 },
  };

  const metrics = ytdMetrics[activeView];

  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
          <p className="text-[11px] font-medium text-slate-400 mb-1.5">{payload[0].payload.month}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-0.5">
              <div className={`w-1.5 h-1.5 rounded-full ${index === 0 ? 'bg-slate-800' : 'bg-slate-300'}`} />
              <span className="text-[12px] text-slate-500">{entry.name}</span>
              <span className="text-[12px] font-semibold text-slate-800 ml-auto">₱{entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] border border-slate-100/80 p-5 relative overflow-hidden flex-1 flex flex-col">
      {/* Header */}
      <div className={`mb-5 space-y-3 ${isFreeTier ? 'opacity-[0.35] pointer-events-none select-none' : ''}`}>
        {/* Top row: title + date range with FY */}
        <div className="flex items-center justify-between">
          <h3 className="text-[13px] font-semibold text-slate-700">Performance</h3>
          <div className="flex items-center gap-2">
            {/* Fiscal year */}
            <div className="relative">
              <button
                onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-slate-400 hover:text-slate-600 transition-colors"
              >
                FY {fiscalYear}
                <Icon icon="solar:alt-arrow-down-linear" width="10" className={`transition-transform ${isYearDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isYearDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 w-24 py-1 bg-white rounded-xl border border-slate-200 shadow-lg z-50">
                  {['2026', '2025', '2024', '2023'].map((year) => (
                    <button
                      key={year}
                      onClick={() => { setFiscalYear(year); setIsYearDropdownOpen(false); }}
                      className={`w-full px-3 py-1.5 text-left text-[12px] font-medium transition-colors ${
                        fiscalYear === year ? 'text-slate-800 bg-slate-50' : 'text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Date range */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
              {(['7D', '30D', '12M'] as DateRangeType[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-2 py-1 text-[11px] font-medium rounded-md transition-all ${
                    dateRange === range ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Second row: view toggle + legends */}
        <div className="flex items-center justify-between">
          {/* View toggle */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
            <button
              onClick={() => setActiveView('pipeline')}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
                activeView === 'pipeline' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Pipeline
            </button>
            <button
              onClick={() => setActiveView('revenue')}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
                activeView === 'revenue' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Revenue
            </button>
          </div>

          {/* Legends with YoY */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-[2px] rounded-full bg-slate-800" />
              <span className="text-[11px] text-slate-500">{primaryLabel}</span>
              {!isFreeTier && <span className="text-[11px] font-semibold text-slate-700">+{metrics.primary}%</span>}
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-[2px] rounded-full bg-slate-300" />
              <span className="text-[11px] text-slate-500">{secondaryLabel}</span>
              {!isFreeTier && <span className="text-[11px] font-semibold text-slate-700">+{metrics.secondary}%</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-[240px] w-full -ml-2 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradPrimary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e293b" stopOpacity={isFreeTier ? 0.03 : 0.06} />
                <stop offset="100%" stopColor="#1e293b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradSecondary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#94a3b8" stopOpacity={isFreeTier ? 0.02 : 0.04} />
                <stop offset="100%" stopColor="#94a3b8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isFreeTier ? '#f8fafc' : '#f1f5f9'} vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: isFreeTier ? '#cbd5e1' : '#94a3b8', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              dy={8}
            />
            <YAxis
              tick={{ fill: isFreeTier ? '#cbd5e1' : '#94a3b8', fontSize: 10 }}
              tickFormatter={formatYAxis}
              axisLine={false}
              tickLine={false}
              width={45}
            />
            {!isFreeTier && <Tooltip content={<CustomTooltip />} />}
            <Area
              type="monotone"
              dataKey={activeView === 'pipeline' ? 'quotations' : 'invoiced'}
              stroke={isFreeTier ? '#e2e8f0' : '#1e293b'}
              strokeWidth={isFreeTier ? 1.5 : 2}
              fill="url(#gradPrimary)"
              name={primaryLabel}
              dot={false}
              activeDot={isFreeTier ? false : { r: 4, fill: '#1e293b', stroke: '#ffffff', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey={activeView === 'pipeline' ? 'dealsWon' : 'collected'}
              stroke={isFreeTier ? '#f1f5f9' : '#cbd5e1'}
              strokeWidth={1.5}
              fill="url(#gradSecondary)"
              name={secondaryLabel}
              dot={false}
              activeDot={isFreeTier ? false : { r: 4, fill: '#cbd5e1', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Free tier overlay CTA */}
        {isFreeTier && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <div className="text-center px-8 max-w-[320px]">
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-b from-amber-50 to-orange-50 border border-amber-100/60 mb-3.5">
                <Icon icon="solar:chart-2-bold-duotone" width="18" className="text-amber-500" />
              </div>
              <p className="text-[13px] font-medium text-slate-700 leading-snug mb-1">
                View your performance analytics to stay one step ahead
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                Unlock pipeline and revenue trend insights
              </p>
              <button
                onClick={onUpgrade}
                className="group inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-[12px] font-medium rounded-lg transition-all duration-200 shadow-[0_1px_3px_rgba(245,158,11,0.25),0_4px_12px_rgba(245,158,11,0.15)] hover:shadow-[0_2px_6px_rgba(245,158,11,0.3),0_8px_24px_rgba(245,158,11,0.2)]"
              >
                Upgrade Plan
                <Icon icon="solar:arrow-right-linear" width="14" className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(ChartCard);
