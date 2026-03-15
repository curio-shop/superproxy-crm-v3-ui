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

function ChartCard() {
  const [fiscalYear, setFiscalYear] = useState('2026');
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [activeView, setActiveView] = useState<ViewType>('pipeline');
  const [dateRange, setDateRange] = useState<DateRangeType>('12M');

  const chartData = useMemo(() =>
    activeView === 'pipeline' ? pipelineData : revenueData,
    [activeView]
  );

  const ytdMetrics = {
    quotations: 15.2,
    dealsWon: 12.8,
    invoiced: 18.4,
    collected: 14.6,
  };

  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 border border-slate-200 rounded-lg px-3 py-2 shadow-lg">
          <p className="text-xs font-semibold text-slate-900 mb-1">{payload[0].payload.month}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs font-medium text-slate-600">
              {entry.name}: ₱{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card rounded-[24px] p-6 md:p-8 relative overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] group">
      <div className="flex flex-col gap-5 mb-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 ring-1 ring-slate-200/50">
              <Icon icon="solar:chart-2-bold" width="18" className="text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 tracking-tight">Performance Analytics</h3>
            <div className="relative">
              <button
                onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-all focus:outline-none active:scale-95"
              >
                <span className="text-slate-500 font-medium">FY</span>
                <span>{fiscalYear}</span>
                <Icon
                  icon="solar:alt-arrow-down-linear"
                  width="12"
                  className={`text-slate-500 transition-transform ${isYearDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isYearDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-32 py-1 bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-900/10 z-50">
                  {['2026', '2025', '2024', '2023', '2022'].map((year) => (
                    <button
                      key={year}
                      onClick={() => {
                        setFiscalYear(year);
                        setIsYearDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm font-medium transition-colors ${
                        fiscalYear === year
                          ? 'bg-slate-50 text-slate-900'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      FY {year}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex bg-white p-0.5 rounded-lg ring-1 ring-slate-200/50 shadow-sm">
            <button
              onClick={() => setDateRange('7D')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all focus:outline-none ${
                dateRange === '7D'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              7D
            </button>
            <button
              onClick={() => setDateRange('30D')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all focus:outline-none ${
                dateRange === '30D'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              30D
            </button>
            <button
              onClick={() => setDateRange('12M')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all focus:outline-none ${
                dateRange === '12M'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              12M
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="inline-flex bg-slate-50/80 p-1 rounded-xl gap-1">
            <button
              onClick={() => setActiveView('pipeline')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeView === 'pipeline'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Pipeline Activity
            </button>
            <button
              onClick={() => setActiveView('revenue')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeView === 'revenue'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Revenue Realization
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeView === 'pipeline' ? (
              <>
                <div className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50/80 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                  <span className="text-xs font-medium text-slate-600">Quotations</span>
                  <div className="flex items-center gap-0.5 text-indigo-700">
                    <Icon icon="solar:arrow-up-linear" width="12" />
                    <span className="text-sm font-semibold">{ytdMetrics.quotations}%</span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 ml-0.5">YoY</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50/80 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                  <span className="text-xs font-medium text-slate-600">Deals Won</span>
                  <div className="flex items-center gap-0.5 text-emerald-700">
                    <Icon icon="solar:arrow-up-linear" width="12" />
                    <span className="text-sm font-semibold">{ytdMetrics.dealsWon}%</span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 ml-0.5">YoY</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50/80 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                  <span className="text-xs font-medium text-slate-600">Invoiced</span>
                  <div className="flex items-center gap-0.5 text-indigo-700">
                    <Icon icon="solar:arrow-up-linear" width="12" />
                    <span className="text-sm font-semibold">{ytdMetrics.invoiced}%</span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 ml-0.5">YoY</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50/80 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                  <span className="text-xs font-medium text-slate-600">Collected</span>
                  <div className="flex items-center gap-0.5 text-emerald-700">
                    <Icon icon="solar:arrow-up-linear" width="12" />
                    <span className="text-sm font-semibold">{ytdMetrics.collected}%</span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 ml-0.5">YoY</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="relative h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSecondary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'Inter' }}
              tickFormatter={formatYAxis}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={activeView === 'pipeline' ? 'quotations' : 'invoiced'}
              stroke="#4f46e5"
              strokeWidth={2}
              fill="url(#colorPrimary)"
              name={activeView === 'pipeline' ? 'Total Quotations' : 'Invoiced Amount'}
              dot={false}
              activeDot={{ r: 6, fill: '#4f46e5', stroke: '#ffffff', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey={activeView === 'pipeline' ? 'dealsWon' : 'collected'}
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#colorSecondary)"
              name={activeView === 'pipeline' ? 'Deals Won' : 'Collected Amount'}
              dot={false}
              activeDot={{ r: 6, fill: '#10b981', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default memo(ChartCard);
