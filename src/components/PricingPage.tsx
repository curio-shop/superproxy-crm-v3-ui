import { Icon } from '@iconify/react';
import { useState } from 'react';

interface PricingPageProps {
  onBack: () => void;
}

const TIERS = [
  {
    name: 'Free',
    price: 0,
    billing: '',
    target: 'For freelancers and early exploration',
    isCurrent: true,
    isRecommended: false,
    cta: 'Current plan',
    features: [
      '2 users',
      '100 contacts',
      'Quotes & invoices',
      'Email sending & open tracking',
      'Custom templates',
      'USD currency',
    ],
  },
  {
    name: 'Growth',
    price: 29,
    billing: '/mo',
    target: 'For small teams getting started',
    isCurrent: false,
    isRecommended: false,
    cta: 'Upgrade to Growth',
    features: [
      'Unlimited users',
      '2,500 contacts',
      'No watermarks',
      'AI chat & AI calls',
      '100K free AI credits',
      'Engagement tracking',
      'Multi-currency',
      'Comments on documents',
    ],
  },
  {
    name: 'Pro',
    price: 79,
    billing: '/mo',
    target: 'For teams that need more power',
    isCurrent: false,
    isRecommended: true,
    cta: 'Upgrade to Pro',
    features: [
      'Everything in Growth',
      '15,000 contacts',
      '300K free AI credits',
      'Multi-call & recording',
      'Multi-language calls',
      'Performance analytics',
      'Gmail & Calendar',
      'Advanced AI insights',
    ],
  },
  {
    name: 'Scale',
    price: 199,
    billing: '/mo',
    target: 'For organizations scaling fast',
    isCurrent: false,
    isRecommended: false,
    cta: 'Upgrade to Scale',
    features: [
      'Everything in Pro',
      'Unlimited contacts',
      '800K free AI credits',
      'Multi-team workspaces',
      'Approval workflows',
      'White-label & API access',
      'Priority AI processing',
      'Kanban & AI dashboards',
    ],
  },
];

interface FeatureRow {
  name: string;
  free: boolean | string;
  growth: boolean | string;
  pro: boolean | string;
  scale: boolean | string;
}

const FEATURE_SECTIONS: { category: string; features: FeatureRow[] }[] = [
  {
    category: 'Workspace',
    features: [
      { name: 'Workspaces', free: '1', growth: '1', pro: '1', scale: 'Multi-team' },
      { name: 'Users', free: 'Up to 2', growth: 'Unlimited', pro: 'Unlimited', scale: 'Unlimited' },
      { name: 'Role-based access', free: 'Owner + Admin', growth: 'Owner + Admin', pro: '+ Member', scale: '+ Approver' },
      { name: 'Leaderboard', free: false, growth: false, pro: true, scale: true },
    ],
  },
  {
    category: 'Contacts & Products',
    features: [
      { name: 'Contacts', free: '100', growth: '2,500', pro: '15,000', scale: 'Unlimited' },
      { name: 'Companies', free: 'Unlimited', growth: 'Unlimited', pro: 'Unlimited', scale: 'Unlimited' },
      { name: 'Products', free: 'Unlimited', growth: 'Unlimited', pro: 'Unlimited', scale: 'Unlimited' },
    ],
  },
  {
    category: 'Sales',
    features: [
      { name: 'Professional quotes & invoices', free: 'Watermark', growth: true, pro: true, scale: true },
      { name: 'Quotes & invoices limit', free: 'Unlimited', growth: 'Unlimited', pro: 'Unlimited', scale: 'Unlimited' },
      { name: 'Quote/invoice approval', free: false, growth: false, pro: false, scale: true },
      { name: 'E-signature', free: false, growth: false, pro: 'Limited', scale: 'Limited' },
      { name: 'Comments on documents', free: false, growth: true, pro: true, scale: true },
      { name: 'Presentation recording', free: false, growth: true, pro: true, scale: true },
    ],
  },
  {
    category: 'Branding',
    features: [
      { name: 'White-label links', free: false, growth: false, pro: false, scale: true },
      { name: 'Custom templates', free: 'Basic', growth: true, pro: true, scale: true },
    ],
  },
  {
    category: 'Engagement',
    features: [
      { name: 'Email sending', free: true, growth: true, pro: true, scale: true },
      { name: 'Email open tracking', free: true, growth: true, pro: true, scale: true },
      { name: 'Email click tracking', free: false, growth: true, pro: true, scale: true },
      { name: 'Quote & invoice viewed', free: false, growth: true, pro: true, scale: true },
      { name: 'Email notifications', free: false, growth: true, pro: true, scale: true },
    ],
  },
  {
    category: 'Visibility & Analytics',
    features: [
      { name: 'Team activity timeline', free: false, growth: true, pro: true, scale: true },
      { name: 'Client engagement timeline', free: false, growth: false, pro: true, scale: true },
      { name: 'Performance analytics', free: false, growth: false, pro: true, scale: true },
      { name: 'Revenue analytics', free: false, growth: false, pro: true, scale: true },
      { name: 'AI-powered dashboards', free: false, growth: false, pro: false, scale: true },
    ],
  },
  {
    category: 'AI',
    features: [
      { name: 'AI credits included', free: '0', growth: '100K', pro: '300K', scale: '800K' },
      { name: 'Agentic AI chat', free: false, growth: true, pro: true, scale: true },
      { name: 'AI calls', free: false, growth: true, pro: 'Multi-call', scale: 'Multi-call + Priority' },
      { name: 'Call transcript', free: false, growth: true, pro: true, scale: true },
      { name: 'Call recording', free: false, growth: false, pro: true, scale: true },
      { name: 'Multi-language calls', free: false, growth: false, pro: true, scale: true },
      { name: 'Basic call insights', free: false, growth: true, pro: true, scale: true },
      { name: 'Advanced call insights', free: false, growth: false, pro: true, scale: true },
      { name: 'Priority processing', free: false, growth: false, pro: false, scale: true },
    ],
  },
  {
    category: 'Integration & Currency',
    features: [
      { name: 'API access', free: false, growth: false, pro: false, scale: true },
      { name: 'Gmail integration', free: false, growth: false, pro: true, scale: true },
      { name: 'Calendar integration', free: false, growth: false, pro: true, scale: true },
      { name: 'Multi-currency', free: 'USD only', growth: true, pro: true, scale: true },
      { name: 'Currency converter', free: false, growth: false, pro: false, scale: true },
    ],
  },
];

export default function PricingPage({ onBack }: PricingPageProps) {
  const [showComparison, setShowComparison] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const getPrice = (monthlyPrice: number) => {
    if (monthlyPrice === 0) return 0;
    return billingCycle === 'annual' ? Math.round(monthlyPrice * 0.8) : monthlyPrice;
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[13px] font-medium text-slate-400 hover:text-slate-600 transition-colors mb-10"
        >
          <Icon icon="solar:arrow-left-linear" width="14" />
          Back
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-semibold text-slate-800 tracking-tight mb-2">Plans that grow with your team</h1>
          <p className="text-[14px] text-slate-400 mb-6">One workspace, unlimited seats. Start free, upgrade when you're ready.</p>

          {/* Billing toggle */}
          <div className="inline-flex items-center bg-slate-100 rounded-xl p-1 relative">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-lg text-[13px] font-medium transition-all ${
                billingCycle === 'monthly' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-5 py-2 rounded-lg text-[13px] font-medium transition-all ${
                billingCycle === 'annual' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Annual
            </button>
            <span className="absolute -top-2.5 -right-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full tracking-tight shadow-sm">
              −20%
            </span>
          </div>
        </div>

        {/* Pricing grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {TIERS.map((tier) => {
            const isPro = tier.isRecommended;
            return (
              <div
                key={tier.name}
                className={`relative flex flex-col rounded-2xl p-6 transition-all ${
                  isPro
                    ? 'border border-slate-900 shadow-[0_2px_12px_rgba(15,23,42,0.08)] bg-white'
                    : tier.isCurrent
                    ? 'bg-slate-50/80 border border-slate-200'
                    : 'bg-white border border-slate-200'
                }`}
              >
                {/* Recommended ribbon */}
                {isPro && (
                  <div className="absolute -top-3 left-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-semibold uppercase tracking-wider">
                      Most popular
                    </span>
                  </div>
                )}

                {/* Tier name */}
                <div className="flex items-center gap-2 mb-5 mt-1">
                  <span className={`text-[13px] font-semibold ${isPro ? 'text-indigo-600' : 'text-slate-500'}`}>
                    {tier.name}
                  </span>
                  {tier.isCurrent && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold text-slate-400 bg-slate-200/60 uppercase tracking-wider">
                      Current
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="mb-1.5">
                  <span className={`text-4xl font-semibold tracking-tight ${isPro ? 'text-slate-900' : 'text-slate-800'}`}>
                    ${getPrice(tier.price)}
                  </span>
                  {tier.billing && (
                    <span className="text-[13px] text-slate-400 ml-0.5">/mo</span>
                  )}
                  {tier.price > 0 && billingCycle === 'annual' && (
                    <span className="ml-1.5 text-[11px] text-slate-300 line-through">${tier.price}</span>
                  )}
                </div>

                {/* Target */}
                <p className="text-[13px] text-slate-400 mb-6">{tier.target}</p>

                {/* CTA */}
                {tier.isCurrent ? (
                  <div className="py-2.5 text-center text-[13px] font-medium text-slate-400 border border-slate-200 rounded-xl mb-6">
                    Current plan
                  </div>
                ) : (
                  <button
                    className={`w-full py-2.5 rounded-xl text-[13px] font-semibold transition-all active:scale-[0.98] mb-6 ${
                      isPro
                        ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
                        : 'border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {tier.cta}
                  </button>
                )}

                {/* Divider */}
                <div className="h-px bg-slate-100 mb-5" />

                {/* Features */}
                <ul className="flex-1 space-y-2.5">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Icon
                        icon="solar:check-read-linear"
                        width="14"
                        className={`mt-0.5 flex-shrink-0 ${isPro ? 'text-slate-900' : 'text-slate-400'}`}
                      />
                      <span className={`text-[13px] leading-relaxed ${
                        i === 0 && (tier.name === 'Pro' || tier.name === 'Scale')
                          ? 'text-slate-700 font-medium'
                          : 'text-slate-500'
                      }`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Compare toggle */}
        <div className="mt-14 mb-4 flex justify-center">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="flex items-center gap-1.5 text-[13px] font-medium text-slate-400 hover:text-slate-600 transition-colors"
          >
            See the full breakdown
            <Icon icon="solar:alt-arrow-down-linear" width="14" className={`transition-transform duration-200 ${showComparison ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Feature comparison table */}
        {showComparison && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-10">
          <table className="w-full">
            <thead className="sticky top-0 z-10">
              <tr className="bg-white border-b border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <th className="text-left px-5 py-4 w-[280px]">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Features</span>
                </th>
                <th className="px-4 py-4 text-center w-[130px]">
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">Free</div>
                  <div className="text-[13px] font-semibold text-slate-800">$0</div>
                </th>
                <th className="px-4 py-4 text-center w-[130px]">
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">Growth</div>
                  <div className="text-[13px] font-semibold text-slate-800">${getPrice(29)}<span className="text-slate-400 font-normal">/mo</span></div>
                </th>
                <th className="px-4 py-4 text-center w-[130px] border-x border-slate-200 bg-slate-50/40">
                  <div className="text-[11px] font-semibold text-slate-900 uppercase tracking-wider mb-0.5">Pro</div>
                  <div className="text-[13px] font-semibold text-slate-800">${getPrice(79)}<span className="text-slate-400 font-normal">/mo</span></div>
                </th>
                <th className="px-4 py-4 text-center w-[130px]">
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">Scale</div>
                  <div className="text-[13px] font-semibold text-slate-800">${getPrice(199)}<span className="text-slate-400 font-normal">/mo</span></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {FEATURE_SECTIONS.map((section) => (
                <>
                  <tr key={`section-${section.category}`}>
                    <td colSpan={5} className="px-5 pt-5 pb-2">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{section.category}</span>
                    </td>
                  </tr>
                  {section.features.map((feature) => (
                    <tr key={feature.name} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3">
                        <span className="text-[13px] text-slate-600">{feature.name}</span>
                      </td>
                      {[feature.free, feature.growth, feature.pro, feature.scale].map((value, i) => (
                        <td key={i} className={`px-4 py-3 text-center ${i === 2 ? 'border-x border-slate-100 bg-slate-50/20' : ''}`}>
                          {value === true ? (
                            <Icon icon="solar:check-read-linear" width="16" className="text-slate-700 mx-auto" />
                          ) : value === false ? (
                            <span className="text-slate-300">—</span>
                          ) : (
                            <span className="text-[13px] font-medium text-slate-700">{value}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
        )}

        {/* Footer */}
        <p className="text-center text-[12px] text-slate-400 mb-8">
          All plans include unlimited seats. Secure payment via Stripe. Cancel anytime.
        </p>
      </div>
    </div>
  );
}
