import { Icon } from '@iconify/react';

interface PricingCardProps {
  onUpgradeClick: () => void;
  onViewPlans?: () => void;
}

export default function PricingCard({ onViewPlans }: PricingCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-semibold text-slate-800 tracking-tight">Free Plan</h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Current
                </span>
              </div>
              <p className="text-[13px] text-slate-400">100 contacts · 2 users · 0 AI credits</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right mr-2">
              <div className="text-2xl font-semibold text-slate-800 tracking-tight">$0</div>
              <div className="text-[11px] text-slate-400">forever free</div>
            </div>
            <button
              onClick={onViewPlans}
              className="flex items-center gap-2 border border-slate-200 text-slate-600 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50 px-4 py-2 rounded-xl transition-all active:scale-[0.98]"
            >
              <span className="text-[13px] font-medium">View Plans</span>
              <Icon icon="solar:arrow-right-linear" width="14" className="text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
