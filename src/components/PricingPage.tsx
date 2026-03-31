import { Icon } from '@iconify/react';
import { useState } from 'react';

interface PricingPageProps {
  onBack: () => void;
  initialTab?: 'plans' | 'credits';
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
      '1,000 AI credits/mo',
      'Engagement tracking',
      'Multi-currency',
      'Quote & invoice comments',
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
      '5,000 AI credits/mo',
      '5 concurrent AI calls',
      'Multi-language calls',
      'Performance analytics',
      'Call recording & transcripts',
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
      '15,000 AI credits/mo',
      'Multi-team workspaces',
      'Approval workflows',
      'Advanced role-based access',
      'Priority AI processing',
      'Dedicated support',
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
      { name: 'Quote & invoice comments', free: false, growth: true, pro: true, scale: true },
      { name: 'Video walkthroughs', free: false, growth: true, pro: true, scale: true },
    ],
  },
  {
    category: 'Branding',
    features: [
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
      { name: 'Performance analytics', free: false, growth: false, pro: true, scale: true },
      { name: 'Revenue analytics', free: false, growth: false, pro: true, scale: true },
    ],
  },
  {
    category: 'AI',
    features: [
      { name: 'AI credits included', free: '0', growth: '1,000/mo', pro: '5,000/mo', scale: '15,000/mo' },
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
      { name: 'Multi-currency', free: 'USD only', growth: true, pro: true, scale: true },
      { name: 'Currency converter', free: false, growth: false, pro: false, scale: true },
    ],
  },
];

const CREDIT_PACKS = [
  { tier: 1, credits: 500, price: 5 },
  { tier: 2, credits: 1100, price: 10 },
  { tier: 3, credits: 2750, price: 25 },
  { tier: 4, credits: 5500, price: 50 },
  { tier: 5, credits: 12000, price: 100, isPopular: true },
  { tier: 6, credits: 18000, price: 150 },
  { tier: 7, credits: 25000, price: 200 },
  { tier: 8, credits: 40000, price: 300 },
  { tier: 9, credits: 50000, price: 380 },
  { tier: 10, credits: 75000, price: 570 },
  { tier: 11, credits: 100000, price: 750 },
  { tier: 12, credits: 150000, price: 1100 },
  { tier: 13, credits: 200000, price: 1500 },
  { tier: 14, credits: 350000, price: 2500 },
  { tier: 15, credits: 500000, price: 3500 },
];

type PricingTab = 'plans' | 'credits';

export default function PricingPage({ onBack, initialTab = 'plans' }: PricingPageProps) {
  const [showComparison, setShowComparison] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [activeTab, setActiveTab] = useState<PricingTab>(initialTab);
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

        {/* Tab switcher — underline style to differentiate from billing pill toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-8">
            <button
              onClick={() => setActiveTab('plans')}
              className={`relative flex items-center gap-2 pb-3 text-[14px] font-semibold transition-colors ${
                activeTab === 'plans' ? 'text-slate-800' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon icon="solar:box-minimalistic-linear" width="16" />
              Plans
              {activeTab === 'plans' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-800 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('credits')}
              className={`relative flex items-center gap-2 pb-3 text-[14px] font-semibold transition-colors ${
                activeTab === 'credits' ? 'text-slate-800' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon icon="solar:bolt-linear" width="16" />
              AI Credits
              {activeTab === 'credits' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-800 rounded-full" />
              )}
            </button>
          </div>
        </div>

        {activeTab === 'plans' ? (
        <>
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
                  <span className={`text-[13px] font-semibold ${isPro ? 'text-amber-600' : 'text-slate-500'}`}>
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

        </>
        ) : (
        /* AI Credits Tab */
        <>
          <div className="text-center mb-12">
            <h1 className="text-2xl font-semibold text-slate-800 tracking-tight mb-2">Top-up AI Credits</h1>
            <p className="text-[14px] text-slate-400">Credits power AI chat, AI calls, and every AI feature. Valid for 12 months.</p>
          </div>

          {/* Featured credit packs — card grid matching plans style */}
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-3">
            {CREDIT_PACKS.filter(p => [2, 4, 5, 7, 10].includes(p.tier)).map((pack) => {
              const isFeatured = pack.isPopular;
              return (
                <div
                  key={pack.tier}
                  className={`relative flex flex-col rounded-2xl p-6 transition-all ${
                    isFeatured
                      ? 'border border-slate-900 shadow-[0_2px_12px_rgba(15,23,42,0.08)] bg-white'
                      : 'bg-white border border-slate-200'
                  }`}
                >
                  {isFeatured && (
                    <div className="absolute -top-3 left-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-semibold uppercase tracking-wider">
                        Best value
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-5 mt-1">
                    <span className={`text-[13px] font-semibold ${isFeatured ? 'text-amber-600' : 'text-slate-500'}`}>
                      Tier {pack.tier}
                    </span>
                  </div>

                  <div className="mb-1.5">
                    <span className={`text-4xl font-semibold tracking-tight ${isFeatured ? 'text-slate-900' : 'text-slate-800'}`}>
                      {pack.credits >= 1000 ? `${(pack.credits / 1000).toFixed(0)}K` : pack.credits}
                    </span>
                    <span className="text-[13px] text-slate-400 ml-1">credits</span>
                  </div>

                  <p className="text-[13px] text-slate-400 mb-6">${pack.price.toLocaleString()}</p>

                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl text-[13px] font-semibold border border-slate-200 text-slate-400 cursor-not-allowed opacity-50"
                    title="Upgrade to a paid plan to buy credits"
                  >
                    Buy credits
                  </button>
                </div>
              );
            })}
          </div>

          {/* All tiers expandable */}
          <div className="mt-14 mb-4 flex justify-center">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="flex items-center gap-1.5 text-[13px] font-medium text-slate-400 hover:text-slate-600 transition-colors"
            >
              See all 15 credit packs
              <Icon icon="solar:alt-arrow-down-linear" width="14" className={`transition-transform duration-200 ${showComparison ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showComparison && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-10">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="text-left text-[11px] font-medium text-slate-400 uppercase tracking-wider px-5 py-3 w-16">#</th>
                    <th className="text-left text-[11px] font-medium text-slate-400 uppercase tracking-wider px-4 py-3">Credits</th>
                    <th className="text-right text-[11px] font-medium text-slate-400 uppercase tracking-wider px-4 py-3">Price</th>
                    <th className="w-24 px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {CREDIT_PACKS.map((pack) => (
                    <tr key={pack.tier} className={`hover:bg-slate-50/70 transition-colors ${pack.isPopular ? 'bg-amber-50/30' : ''}`}>
                      <td className="px-5 py-3">
                        <span className={`text-[13px] ${pack.isPopular ? 'text-amber-600 font-semibold' : 'text-slate-400 font-medium'}`}>
                          {pack.tier}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[13px] font-semibold ${pack.isPopular ? 'text-slate-900' : 'text-slate-700'}`}>
                          {pack.credits.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-[13px] font-semibold ${pack.isPopular ? 'text-slate-900' : 'text-slate-700'}`}>
                          ${pack.price.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          disabled
                          className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-400 cursor-not-allowed opacity-50"
                          title="Upgrade to a paid plan to buy credits"
                        >
                          Buy
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
        )}

        {/* Footer */}
        <p className="text-center text-[12px] text-slate-400 mb-8 mt-10">
          {activeTab === 'plans'
            ? 'All plans include unlimited seats. Secure payment via Stripe. Cancel anytime.'
            : 'One-time purchase. Available to paid plans only. Secure payment via Stripe.'}
        </p>
      </div>
    </div>
  );
}
