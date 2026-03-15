import { Icon } from '@iconify/react';

interface PricingCardProps {
  onUpgradeClick: () => void;
}

export default function PricingCard({ onUpgradeClick }: PricingCardProps) {
  const features = [
    'Unlimited quotations, invoices, and presentations',
    'No watermarks on any documents',
    'Team collaboration with shared access',
    'Full access to AI features and smart calling',
    'Priority support and dedicated account manager',
  ];

  return (
    <div className="relative w-full">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/40 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="relative z-10 p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.12)]">
                <Icon icon="solar:crown-linear" width="20" className="text-amber-400" />
              </div>

              <div className="space-y-0.5">
                <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                  Free Trial
                </h2>
                <p className="text-xs font-medium text-slate-500">
                  14 days remaining
                </p>
              </div>
            </div>

            <div className="self-start">
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg border border-amber-200 bg-amber-50 text-[10px] font-semibold tracking-wider text-amber-600 uppercase shadow-sm">
                Trial
              </span>
            </div>
          </div>

          <div className="mt-5 flex items-baseline gap-1.5">
            <span className="text-4xl font-semibold tracking-tighter text-slate-900">
              $20
            </span>
            <span className="text-sm text-slate-500 font-medium">/month</span>
          </div>

          <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-2xl">
            Unlock unlimited potential with multiple workspaces, team
            collaboration, and advanced features. No lock-in period, cancel
            anytime.
          </p>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent my-5"></div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
            <div className="lg:col-span-3">
              <ul className="flex flex-col gap-2.5">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2.5 group">
                    <Icon
                      icon="solar:check-circle-bold"
                      width="16"
                      className="text-emerald-500 mt-0.5 shrink-0 transition-transform group-hover:scale-110 duration-300"
                    />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2 w-full mt-8">
              <button
                onClick={onUpgradeClick}
                className="group relative w-full flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-slate-800 transition-all duration-300 rounded-xl py-3 px-5 shadow-lg shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/15 hover:-translate-y-0.5 active:translate-y-0"
              >
                <Icon
                  icon="solar:rocket-linear"
                  width="16"
                  className="transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-0.5"
                />
                <span className="font-semibold text-sm tracking-wide">
                  Upgrade to SUPERPROXY Pro
                </span>
              </button>
              <p className="text-center text-[11px] mt-3 text-slate-400">
                Secure payment • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
