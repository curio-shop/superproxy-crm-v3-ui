import { useState } from 'react';
import { Icon } from '@iconify/react';
import Dropdown from './Dropdown';

const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'SGD'];

const currencySymbols: Record<string, string> = {
  USD: '$', EUR: '€', GBP: '£', JPY: '¥', AUD: 'A$',
  CAD: 'C$', CHF: 'CHF', CNY: '¥', INR: '₹', SGD: 'S$',
};

const currencyFlags: Record<string, string> = {
  USD: '🇺🇸', EUR: '🇪🇺', GBP: '🇬🇧', JPY: '🇯🇵', AUD: '🇦🇺',
  CAD: '🇨🇦', CHF: '🇨🇭', CNY: '🇨🇳', INR: '🇮🇳', SGD: '🇸🇬',
};

const currencyNames: Record<string, string> = {
  USD: 'US Dollar', EUR: 'Euro', GBP: 'British Pound', JPY: 'Japanese Yen',
  AUD: 'Australian Dollar', CAD: 'Canadian Dollar', CHF: 'Swiss Franc',
  CNY: 'Chinese Yuan', INR: 'Indian Rupee', SGD: 'Singapore Dollar',
};

const exchangeRates: Record<string, Record<string, number>> = {
  USD: { EUR: 0.92, GBP: 0.79, JPY: 149.50, AUD: 1.52, CAD: 1.36, CHF: 0.88, CNY: 7.24, INR: 83.12, SGD: 1.34, USD: 1 },
  EUR: { USD: 1.09, GBP: 0.86, JPY: 162.50, AUD: 1.65, CAD: 1.48, CHF: 0.96, CNY: 7.88, INR: 90.45, SGD: 1.46, EUR: 1 },
  GBP: { USD: 1.27, EUR: 1.16, JPY: 189.30, AUD: 1.92, CAD: 1.72, CHF: 1.11, CNY: 9.19, INR: 105.42, SGD: 1.70, GBP: 1 },
  JPY: { USD: 0.0067, EUR: 0.0062, GBP: 0.0053, AUD: 0.010, CAD: 0.0091, CHF: 0.0059, CNY: 0.048, INR: 0.56, SGD: 0.009, JPY: 1 },
  AUD: { USD: 0.66, EUR: 0.61, GBP: 0.52, JPY: 98.40, CAD: 0.89, CHF: 0.58, CNY: 4.76, INR: 54.68, SGD: 0.88, AUD: 1 },
  CAD: { USD: 0.74, EUR: 0.68, GBP: 0.58, JPY: 109.93, AUD: 1.12, CHF: 0.65, CNY: 5.32, INR: 61.12, SGD: 0.99, CAD: 1 },
  CHF: { USD: 1.14, EUR: 1.04, GBP: 0.90, JPY: 169.89, AUD: 1.72, CAD: 1.54, CNY: 8.23, INR: 94.45, SGD: 1.52, CHF: 1 },
  CNY: { USD: 0.14, EUR: 0.13, GBP: 0.11, JPY: 20.67, AUD: 0.21, CAD: 0.19, CHF: 0.12, INR: 11.48, SGD: 0.19, CNY: 1 },
  INR: { USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.80, AUD: 0.018, CAD: 0.016, CHF: 0.011, CNY: 0.087, SGD: 0.016, INR: 1 },
  SGD: { USD: 0.75, EUR: 0.68, GBP: 0.59, JPY: 111.57, AUD: 1.14, CAD: 1.01, CHF: 0.66, CNY: 5.40, INR: 62.01, SGD: 1 },
};

export default function CurrencyPage() {
  const [displayCurrency, setDisplayCurrency] = useState('USD');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('100');

  const convertedAmount = (parseFloat(amount) || 0) * (exchangeRates[fromCurrency]?.[toCurrency] || 1);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar space-y-6" style={{ scrollbarGutter: 'stable' }}>

      {/* Top row: Display Preference + Converter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Display Currency Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Icon icon="solar:eye-linear" width="18" className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Display Currency</h2>
              <p className="text-xs text-slate-400 mt-0.5">Set the currency shown across your dashboard</p>
            </div>
          </div>

          <div className="mt-5">
            <Dropdown
              value={displayCurrency}
              options={currencies.map(c => ({ value: c, label: `${currencyFlags[c]} ${c} — ${currencyNames[c]}` }))}
              onChange={(val) => setDisplayCurrency(val as string)}
              menuAlign="left"
            />
          </div>

          {/* Selected currency highlight */}
          <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-indigo-50/60 border border-indigo-100">
            <span className="text-2xl">{currencyFlags[displayCurrency]}</span>
            <div>
              <p className="text-sm font-semibold text-slate-900">{currencyNames[displayCurrency]}</p>
              <p className="text-xs text-slate-500">{currencySymbols[displayCurrency]} · {displayCurrency}</p>
            </div>
            <div className="ml-auto">
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-lg">Active</span>
            </div>
          </div>
        </div>

        {/* Currency Converter Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Icon icon="solar:transfer-horizontal-linear" width="18" className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Currency Converter</h2>
              <p className="text-xs text-slate-400 mt-0.5">Convert between any two currencies instantly</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {/* From */}
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">From</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  placeholder="Amount"
                />
                <Dropdown
                  value={fromCurrency}
                  options={currencies}
                  onChange={(val) => setFromCurrency(val as string)}
                  buttonClassName="h-[42px] px-3 min-w-[90px]"
                />
              </div>
            </div>

            {/* Swap */}
            <div className="flex justify-center">
              <button
                onClick={handleSwap}
                className="p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition-colors active:scale-95 group"
                aria-label="Swap currencies"
              >
                <Icon icon="solar:refresh-linear" width="16" className="text-indigo-600 group-hover:rotate-180 transition-transform duration-300" />
              </button>
            </div>

            {/* To */}
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">To</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={convertedAmount.toFixed(2)}
                  readOnly
                  className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 outline-none"
                />
                <Dropdown
                  value={toCurrency}
                  options={currencies}
                  onChange={(val) => setToCurrency(val as string)}
                  buttonClassName="h-[42px] px-3 min-w-[90px]"
                />
              </div>
            </div>

            {/* Rate reference */}
            <div className="pt-1 flex items-center justify-center gap-1.5">
              <Icon icon="solar:refresh-circle-linear" width="13" className="text-slate-400" />
              <p className="text-xs text-slate-400 text-center">
                1 {fromCurrency} = <span className="font-semibold text-slate-600">{exchangeRates[fromCurrency]?.[toCurrency]?.toFixed(4)}</span> {toCurrency}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Exchange Rates Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Icon icon="solar:chart-2-linear" width="18" className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Exchange Rates</h2>
              <p className="text-xs text-slate-400 mt-0.5">Rates relative to <span className="font-medium text-slate-600">{displayCurrency}</span></p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {currencies.map((currency) => {
            const rate = exchangeRates[displayCurrency]?.[currency] ?? 1;
            const isBase = currency === displayCurrency;
            return (
              <div
                key={currency}
                className={`rounded-xl p-3.5 border transition-all ${
                  isBase
                    ? 'bg-indigo-50 border-indigo-200'
                    : 'bg-slate-50 border-slate-100 hover:border-slate-200 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg leading-none">{currencyFlags[currency]}</span>
                  <span className={`text-xs font-bold ${isBase ? 'text-indigo-700' : 'text-slate-700'}`}>{currency}</span>
                  {isBase && (
                    <span className="ml-auto text-[10px] font-semibold text-indigo-500 bg-indigo-100 px-1.5 py-0.5 rounded-md">base</span>
                  )}
                </div>
                <p className={`text-base font-bold ${isBase ? 'text-indigo-900' : 'text-slate-900'}`}>
                  {isBase ? '1.0000' : rate.toFixed(4)}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">{currencyNames[currency]}</p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
