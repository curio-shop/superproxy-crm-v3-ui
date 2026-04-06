import { useState, useMemo, useRef, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { useTier } from '../contexts/TierContext';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', flag: '🇸🇦' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'Mex$', flag: '🇲🇽' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
  { code: 'TWD', name: 'Taiwan Dollar', symbol: 'NT$', flag: '🇹🇼' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', flag: '🇵🇱' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', flag: '🇨🇿' },
  { code: 'ILS', name: 'Israeli Shekel', symbol: '₪', flag: '🇮🇱' },
  { code: 'QAR', name: 'Qatari Riyal', symbol: 'QR', flag: '🇶🇦' },
];

const getRate = (from: string, to: string): number => {
  if (from === to) return 1;
  const baseRates: Record<string, number> = {
    USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.50, AUD: 1.52, CAD: 1.36, CHF: 0.88,
    SGD: 1.34, AED: 3.67, NZD: 1.64, PHP: 56.20, THB: 35.40, INR: 83.12, CNY: 7.24,
    KRW: 1320.50, MYR: 4.72, IDR: 15680, SAR: 3.75, ZAR: 18.65, BRL: 4.97,
    MXN: 17.15, SEK: 10.45, NOK: 10.62, DKK: 6.87, HKD: 7.82, TWD: 31.50,
    PLN: 4.02, CZK: 23.10, ILS: 3.68, QAR: 3.64,
  };
  return (baseRates[to] || 1) / (baseRates[from] || 1);
};

type ActiveTab = 'display' | 'filter';

interface CurrencyPageProps {
  onUpgrade?: () => void;
}

export default function CurrencyPage({ onUpgrade }: CurrencyPageProps) {
  const { can, upgradeLabel } = useTier();
  const isFreeTier = !can('multiCurrency');
  const isConverterGated = !can('currencyConverter');
  const [showUpgradeHint, setShowUpgradeHint] = useState(false);
  const hintTimer = useRef<ReturnType<typeof setTimeout>>();
  const [activeTab, setActiveTab] = useState<ActiveTab>('display');
  const [displayCurrency, setDisplayCurrency] = useState('USD');
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['USD']);
  const [search, setSearch] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('1000');

  const convertedAmount = (parseFloat(amount) || 0) * getRate(fromCurrency, toCurrency);

  const showGate = useCallback(() => {
    if (hintTimer.current) clearTimeout(hintTimer.current);
    setShowUpgradeHint(true);
    hintTimer.current = setTimeout(() => setShowUpgradeHint(false), 4000);
  }, []);

  const handleGatedAction = useCallback((action: () => void) => {
    if (isConverterGated) { showGate(); return; }
    action();
  }, [isConverterGated, showGate]);

  const handleSwap = () => { handleGatedAction(() => { setFromCurrency(toCurrency); setToCurrency(fromCurrency); }); };

  const toggleFilter = (code: string) => {
    if (isFreeTier) { showGate(); return; }
    setSelectedFilters(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]);
  };

  const filtered = useMemo(() =>
    CURRENCIES.filter(c =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
    ), [search]);

  const selectedDisplay = CURRENCIES.find(c => c.code === displayCurrency);

  return (
    <div className="flex-1 overflow-hidden flex flex-col p-6" style={{ scrollbarGutter: 'stable' }}>
      <div className="flex-1 flex gap-4 min-h-0">

        {/* Left — Currency selector */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-w-0">
          {/* Tabs */}
          <div className="flex items-center gap-1 px-4 pt-4 pb-3">
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
              <button
                onClick={() => { setActiveTab('display'); setSearch(''); }}
                className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${activeTab === 'display' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Display Currency
              </button>
              <button
                onClick={() => { setActiveTab('filter'); setSearch(''); }}
                className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${activeTab === 'filter' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Dashboard Filter
              </button>
            </div>

            {activeTab === 'filter' && selectedFilters.length > 0 && (
              <span className="text-[10px] text-slate-400 ml-2">{selectedFilters.length} selected</span>
            )}
          </div>

          {/* Description */}
          <div className="px-4 pb-3">
            <p className="text-[11px] text-slate-400">
              {activeTab === 'display'
                ? 'Set the currency your dashboard displays. Ideal for teams working across borders — see unified totals in one currency while keeping each quote and invoice in its original currency.'
                : 'Filter your dashboard by the currencies you trade in. Perfect for tracking performance by market — only quotes and invoices in selected currencies will count toward your stats.'
              }
            </p>
          </div>

          {/* Search */}
          <div className="px-4 pb-2">
            <div className="relative">
              <Icon icon="solar:magnifer-linear" width="14" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${CURRENCIES.length} currencies...`}
                className="w-full pl-8 pr-3 py-1.5 text-[13px] text-slate-700 placeholder-slate-400 bg-slate-50 rounded-lg border border-slate-100 outline-none focus:border-slate-300 transition-colors"
              />
            </div>
          </div>

          {/* Filter chips */}
          {activeTab === 'filter' && selectedFilters.length > 0 && (
            <div className="flex flex-wrap gap-1 px-4 pb-2">
              {selectedFilters.map(code => {
                const c = CURRENCIES.find(cur => cur.code === code);
                return (
                  <button
                    key={code}
                    onClick={() => toggleFilter(code)}
                    className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded-md text-[11px] font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    {c?.flag} {code}
                    <Icon icon="solar:close-circle-linear" width="11" className="text-slate-400" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Currency list */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-2 min-h-0">
            {filtered.length === 0 ? (
              <p className="text-[12px] text-slate-400 text-center py-8">No currencies found</p>
            ) : (
              <div className="space-y-0.5">
                {filtered.map((currency) => {
                  const isDisplay = activeTab === 'display';
                  const isSelected = isDisplay
                    ? displayCurrency === currency.code
                    : selectedFilters.includes(currency.code);

                  return (
                    <button
                      key={currency.code}
                      onClick={() => {
                        if (isFreeTier) { showGate(); return; }
                        isDisplay ? setDisplayCurrency(currency.code) : toggleFilter(currency.code);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${
                        isSelected ? 'bg-slate-50 border border-slate-200' : 'border border-transparent hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-base leading-none">{currency.flag}</span>
                      <span className="text-[13px] font-medium text-slate-800 w-10">{currency.code}</span>
                      <span className="text-[12px] text-slate-400 flex-1">{currency.name}</span>
                      <span className="text-[11px] text-slate-300 mr-1">{currency.symbol}</span>

                      {isDisplay ? (
                        <div className={`w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center transition-all flex-shrink-0 ${
                          isSelected ? 'border-slate-900' : 'border-slate-300'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-slate-900" />}
                        </div>
                      ) : (
                        <div className={`w-4 h-4 rounded border-[1.5px] flex items-center justify-center transition-all flex-shrink-0 ${
                          isSelected ? 'bg-slate-900 border-slate-900' : 'border-slate-300'
                        }`}>
                          {isSelected && <Icon icon="solar:check-read-linear" width="10" className="text-white" />}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right — Converter */}
        <div className="w-[320px] flex-shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-[13px] font-semibold text-slate-700 mb-1">Converter</h2>
            <p className="text-[11px] text-slate-400 mb-4">Quick conversion between currencies.</p>

            <div className="space-y-2.5">
              <div>
                <label className="text-[11px] font-medium text-slate-400 mb-1 block">From</label>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => handleGatedAction(() => setAmount(e.target.value))}
                    onFocus={() => { if (isConverterGated) showGate(); }}
                    readOnly={isConverterGated}
                    className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-slate-200 text-[13px] font-semibold text-slate-800 focus:border-slate-400 outline-none transition-colors"
                    placeholder="Amount"
                  />
                  <select
                    value={fromCurrency}
                    onChange={(e) => handleGatedAction(() => setFromCurrency(e.target.value))}
                    className="px-2 py-2 rounded-xl border border-slate-200 text-[12px] font-medium text-slate-700 bg-white focus:border-slate-400 outline-none transition-colors w-[78px]"
                  >
                    {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex justify-center">
                <button onClick={handleSwap} className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors active:scale-95">
                  <Icon icon="solar:transfer-vertical-linear" width="14" className="text-slate-500" />
                </button>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 mb-1 block">To</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    readOnly
                    className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-[13px] font-semibold text-slate-800 outline-none"
                  />
                  <select
                    value={toCurrency}
                    onChange={(e) => handleGatedAction(() => setToCurrency(e.target.value))}
                    className="px-2 py-2 rounded-xl border border-slate-200 text-[12px] font-medium text-slate-700 bg-white focus:border-slate-400 outline-none transition-colors w-[78px]"
                  >
                    {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                  </select>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 text-center pt-0.5">
                1 {fromCurrency} = <span className="font-medium text-slate-600">{getRate(fromCurrency, toCurrency).toFixed(4)}</span> {toCurrency}
              </p>
            </div>

            {/* Current selections summary */}
            <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5">
              <div>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1">Display Currency</p>
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">{selectedDisplay?.flag}</span>
                  <span className="text-[13px] font-semibold text-slate-800">{selectedDisplay?.code}</span>
                  <span className="text-[11px] text-slate-400">{selectedDisplay?.name}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1">Dashboard Filter</p>
                <div className="flex flex-wrap gap-1">
                  {selectedFilters.length === 0 ? (
                    <span className="text-[11px] text-slate-300">None selected</span>
                  ) : selectedFilters.map(code => (
                    <span key={code} className="text-[11px] font-medium text-slate-600 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded">
                      {CURRENCIES.find(c => c.code === code)?.flag} {code}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Upgrade popover — appears on any gated interaction */}
      {showUpgradeHint && (isFreeTier || isConverterGated) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowUpgradeHint(false)}>
          <div className="absolute inset-0 bg-black/5" />
          <div
            className="relative bg-white rounded-2xl border border-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-5 max-w-[320px] w-full animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3.5">
              <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-b from-amber-50 to-orange-50 border border-amber-100/60">
                <Icon icon="solar:dollar-minimalistic-bold-duotone" width="20" className="text-amber-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-slate-800 mb-1">{isFreeTier ? 'Multi-currency requires an upgrade' : 'Currency converter requires an upgrade'}</p>
                <p className="text-[12px] text-slate-400 leading-relaxed mb-3">{isFreeTier ? 'Customize your display currency and converter to match how you do business.' : 'Convert between currencies instantly with live rates.'}</p>
                <button
                  onClick={() => { setShowUpgradeHint(false); onUpgrade?.(); }}
                  className="group inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-[12px] font-medium rounded-lg transition-all duration-200 shadow-[0_1px_3px_rgba(245,158,11,0.25),0_4px_12px_rgba(245,158,11,0.15)] hover:shadow-[0_2px_6px_rgba(245,158,11,0.3)]"
                >
                  {isFreeTier ? upgradeLabel('multiCurrency') : upgradeLabel('currencyConverter')}
                  <Icon icon="solar:arrow-right-linear" width="13" className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
