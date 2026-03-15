import { Icon } from '@iconify/react';
import { useState, useRef, useEffect } from 'react';
import ScopeFilter, { ScopeType } from './ScopeFilter';
import RecordPresentationModal from './RecordPresentationModal';
import { Contact, Quotation } from '../contexts/CallManagerContext';

interface QuotationsProps {
  isTeamView: boolean;
  homeFilterPreference: 'team' | 'personal';
  onViewQuote?: (quotation: Quotation) => void;
  onQuoteFollowUpClick?: (quotation: Quotation, contact: Contact) => void;
  onEmailQuoteClick?: (quotation: Quotation) => void;
  onCreateInvoiceClick?: (quotation: Quotation) => void;
  onAskAIClick?: (quotation: Quotation) => void;
  onOpenTemplateBuilder?: () => void;
  onOpenCreateQuote?: () => void;
  onDeleteQuotation?: (quotation: Quotation) => void;
}

export default function Quotations({ isTeamView, homeFilterPreference, onViewQuote, onQuoteFollowUpClick, onEmailQuoteClick, onCreateInvoiceClick, onAskAIClick, onOpenTemplateBuilder, onOpenCreateQuote, onDeleteQuotation }: QuotationsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scopeFilter, setScopeFilter] = useState<ScopeType>(homeFilterPreference);
  const [hasManuallyChanged, setHasManuallyChanged] = useState(false);
  const [isRecordPresentationOpen, setIsRecordPresentationOpen] = useState(false);
  const [selectedQuoteForPresentation, setSelectedQuoteForPresentation] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasManuallyChanged) {
      setScopeFilter(homeFilterPreference);
    }
  }, [homeFilterPreference, hasManuallyChanged]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const statusStyles = {
    draft: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: 'solar:pen-new-square-linear' },
    published: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', icon: 'solar:plain-3-linear' },
    sent: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: 'solar:check-circle-linear' },
  };

  const clientColors = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', ring: 'ring-purple-100' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-100' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-100' },
    slate: { bg: 'bg-slate-100', text: 'text-slate-600', ring: 'ring-slate-200' },
    pink: { bg: 'bg-pink-50', text: 'text-pink-600', ring: 'ring-pink-100' },
  };

  const quotations: Quotation[] = [
    {
      id: '1',
      number: 'QT-2024-001',
      title: 'Website Redesign Project',
      client: { name: 'Superproxy Inc.', initials: 'SI', color: 'blue' },
      status: 'published',
      amount: 2262851,
      date: '2024-12-28',
      validUntil: '2025-01-27',
      items: 12,
    },
    {
      id: '2',
      number: 'QT-2024-002',
      title: 'Mobile App Development',
      client: { name: 'Notion', initials: 'NT', color: 'purple' },
      status: 'sent',
      amount: 850000,
      date: '2024-12-25',
      validUntil: '2025-01-24',
      items: 8,
    },
    {
      id: '3',
      number: 'QT-2024-003',
      title: 'Brand Identity Design',
      client: { name: 'SpaceX', initials: 'SX', color: 'slate' },
      status: 'draft',
      amount: 450000,
      date: '2024-12-27',
      validUntil: '2025-01-26',
      items: 5,
    },
    {
      id: '4',
      number: 'QT-2024-004',
      title: 'E-commerce Platform',
      client: { name: 'Apple', initials: 'AP', color: 'amber' },
      status: 'published',
      amount: 1800000,
      date: '2024-12-26',
      validUntil: '2025-01-25',
      items: 15,
    },
    {
      id: '5',
      number: 'QT-2024-005',
      title: 'Marketing Campaign',
      client: { name: 'Acme Corp', initials: 'AC', color: 'emerald' },
      status: 'draft',
      amount: 320000,
      date: '2024-12-20',
      validUntil: '2024-12-30',
      items: 6,
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col p-6" style={{ scrollbarGutter: 'stable' }}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="group relative w-full sm:w-auto max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon
                icon="solar:magnifer-linear"
                width="16"
                className="text-slate-400 group-focus-within:text-indigo-500 transition-colors"
              />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-white text-slate-600 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 sm:text-sm shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
              placeholder="Search quotations..."
            />
          </div>

          <ScopeFilter
            value={scopeFilter}
            onChange={(scope) => {
              setScopeFilter(scope);
              setHasManuallyChanged(true);
            }}
            defaultScope="personal"
            availableScopes={['personal', 'team']}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenTemplateBuilder?.()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            <Icon icon="solar:magic-stick-3-linear" width="18" className="text-slate-500" />
            <span>Customize Template</span>
          </button>
          <button
            onClick={() => onOpenCreateQuote?.()}
            className="flex items-center gap-2 bg-gradient-to-b from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 border-t border-white/20 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Icon icon="solar:add-circle-linear" width="18" className="text-indigo-100" />
            <span className="text-sm font-semibold tracking-wide">Create Quote</span>
          </button>
        </div>
      </div>

      <div className="flex-1 shadow-slate-200/20 overflow-hidden flex flex-col bg-white/50 border-white/60 border rounded-[24px] relative shadow-xl">
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/80">
              <tr className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th scope="col" className="pl-6 pr-3 py-4 w-12">
                  <label className="custom-checkbox flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only" />
                    <div className="w-4 h-4 border-2 border-slate-300 rounded-md bg-white flex items-center justify-center transition-all hover:border-slate-400 hover:bg-slate-50">
                      <svg
                        className="w-2.5 h-2.5 text-white hidden pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </label>
                </th>
                <th scope="col" className="px-6 py-4">
                  Quote Name
                </th>
                <th scope="col" className="px-6 py-4">
                  Client
                </th>
                <th scope="col" className="px-6 py-4">
                  Status
                </th>
                <th scope="col" className="px-6 py-4">
                  Amount
                </th>
                <th scope="col" className="px-6 py-4">
                  Date Created
                </th>
                <th scope="col" className="px-6 py-4">
                  Valid Until
                </th>
                <th scope="col" className="px-6 py-4 w-16">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
                {quotations.map((quote) => {
                  const statusStyle = statusStyles[quote.status];
                  const clientColor = clientColors[quote.client.color as keyof typeof clientColors];

                  return (
                    <tr key={quote.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="pl-6 pr-3 py-4 whitespace-nowrap">
                        <label className="custom-checkbox flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only" />
                          <div className="w-4 h-4 border border-slate-300 rounded-md bg-white flex items-center justify-center transition-all group-hover:border-slate-400">
                            <svg
                              className="w-2.5 h-2.5 text-white hidden pointer-events-none"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        </label>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-slate-900">{quote.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-9 w-9 rounded-full ${clientColor.bg} ${clientColor.text} flex items-center justify-center text-xs font-semibold ring-2 ${clientColor.ring} shadow-sm group-hover:shadow-md transition-shadow`}
                          >
                            {quote.client.initials}
                          </div>
                          <div className="text-sm font-semibold text-slate-900">{quote.client.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md ${statusStyle.bg} ${statusStyle.text} text-xs font-medium border ${statusStyle.border}`}>
                          <Icon icon={statusStyle.icon} width="14" />
                          {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Icon icon="solar:wallet-money-linear" width="14" className="text-slate-400" />
                          <span className="text-sm font-bold text-slate-900">{formatCurrency(quote.amount)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Icon icon="solar:calendar-linear" width="14" className="text-slate-400" />
                          <span>{formatDate(quote.date)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Icon icon="solar:calendar-mark-linear" width="14" className="text-slate-400" />
                          <span>{formatDate(quote.validUntil)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="relative" ref={openDropdown === quote.id ? dropdownRef : null}>
                          <button
                            onClick={() => setOpenDropdown(openDropdown === quote.id ? null : quote.id)}
                            className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 hover:ring-1 hover:ring-slate-200 transition-all focus:outline-none"
                          >
                            <Icon icon="solar:menu-dots-bold" width="16" />
                          </button>

                          {openDropdown === quote.id && (
                            <div className="absolute right-0 mt-2 w-52 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-slate-200/60 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200 ring-1 ring-black/5">
                              <button
                                onClick={() => {
                                  onViewQuote?.(quote);
                                  setOpenDropdown(null);
                                }}
                                className="w-full px-3 py-2 text-left text-sm font-bold text-slate-800 hover:bg-sky-50/80 hover:text-sky-700 flex items-center gap-2.5 transition-all duration-200 group"
                              >
                                <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center group-hover:bg-sky-100 group-hover:scale-105 transition-all duration-200">
                                  <Icon icon="solar:eye-linear" width="15" className="text-sky-600 group-hover:text-sky-700" />
                                </div>
                                <span>View Quote</span>
                              </button>
                              <button
                                onClick={() => {
                                  setOpenDropdown(null);
                                }}
                                className="w-full px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50/80 hover:text-slate-900 flex items-center gap-2.5 transition-all duration-200 group"
                              >
                                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 group-hover:scale-105 transition-all duration-200">
                                  <Icon icon="solar:pen-linear" width="15" className="text-slate-600 group-hover:text-slate-700" />
                                </div>
                                <span>Edit Quote</span>
                              </button>
                              <div className="border-t border-slate-100 my-1.5 mx-2" />
                              <button
                                onClick={() => {
                                  setSelectedQuoteForPresentation(quote.id);
                                  setIsRecordPresentationOpen(true);
                                  setOpenDropdown(null);
                                }}
                                className="w-full px-3 py-1.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50/80 hover:text-slate-900 flex items-center gap-2.5 transition-all duration-200 group"
                              >
                                <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 group-hover:scale-105 transition-all duration-200">
                                  <Icon icon="solar:presentation-graph-linear" width="13" className="text-slate-600 group-hover:text-slate-700" />
                                </div>
                                <span>Create Presentation</span>
                              </button>
                              <button
                                onClick={() => {
                                  onEmailQuoteClick?.(quote);
                                  setOpenDropdown(null);
                                }}
                                className="w-full px-3 py-1.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50/80 hover:text-slate-900 flex items-center gap-2.5 transition-all duration-200 group"
                              >
                                <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 group-hover:scale-105 transition-all duration-200">
                                  <Icon icon="solar:letter-linear" width="13" className="text-slate-600 group-hover:text-slate-700" />
                                </div>
                                <span>Email Quote</span>
                              </button>
                              <button
                                onClick={() => {
                                  onCreateInvoiceClick?.(quote);
                                  setOpenDropdown(null);
                                }}
                                className="w-full px-3 py-1.5 text-left text-sm font-medium text-slate-700 hover:bg-emerald-50/80 hover:text-emerald-700 flex items-center gap-2.5 transition-all duration-200 group"
                              >
                                <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-emerald-100 group-hover:scale-105 transition-all duration-200">
                                  <Icon icon="solar:bill-list-linear" width="13" className="text-slate-600 group-hover:text-emerald-600" />
                                </div>
                                <span>Create Invoice</span>
                              </button>
                              <div className="border-t border-slate-100 my-1.5 mx-2" />
                              <button
                                onClick={() => {
                                  onQuoteFollowUpClick?.(quote, {
                                    id: quote.id,
                                    name: quote.client.name,
                                    company_name: quote.client.name,
                                  });
                                  setOpenDropdown(null);
                                }}
                                className="w-full px-3 py-1.5 text-left text-sm font-medium text-slate-700 hover:bg-blue-50/80 hover:text-blue-700 flex items-center gap-2.5 transition-all duration-200 group"
                              >
                                <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-blue-100 group-hover:scale-105 transition-all duration-200">
                                  <Icon icon="solar:phone-calling-rounded-linear" width="13" className="text-slate-600 group-hover:text-blue-600" />
                                </div>
                                <span>AI Follow-Up Call</span>
                              </button>
                              <button
                                onClick={() => {
                                  onAskAIClick?.(quote);
                                  setOpenDropdown(null);
                                }}
                                className="w-full px-3 py-1.5 text-left text-sm font-medium text-slate-700 hover:bg-indigo-50/80 hover:text-indigo-700 flex items-center gap-2.5 transition-all duration-200 group"
                              >
                                <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-indigo-100 group-hover:scale-105 transition-all duration-200">
                                  <Icon icon="solar:lightbulb-linear" width="13" className="text-slate-600 group-hover:text-indigo-600" />
                                </div>
                                <span>Ask AI</span>
                              </button>
                              <button
                                onClick={() => {
                                  setOpenDropdown(null);
                                }}
                                className="w-full px-3 py-1.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50/80 hover:text-slate-900 flex items-center gap-2.5 transition-all duration-200 group"
                              >
                                <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 group-hover:scale-105 transition-all duration-200">
                                  <Icon icon="solar:copy-linear" width="13" className="text-slate-600 group-hover:text-slate-700" />
                                </div>
                                <span>Duplicate Quote</span>
                              </button>
                              <div className="border-t border-slate-100 my-1.5 mx-2" />
                              <button
                                onClick={() => {
                                  onDeleteQuotation?.(quote);
                                  setOpenDropdown(null);
                                }}
                                className="w-full px-3 py-2 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50/80 hover:text-rose-700 flex items-center gap-2.5 transition-all duration-200 group"
                              >
                                <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center group-hover:bg-rose-100 group-hover:scale-105 transition-all duration-200">
                                  <Icon icon="solar:trash-bin-trash-linear" width="15" className="text-rose-500 group-hover:text-rose-600" />
                                </div>
                                <span>Delete Quote</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
        </div>

        <div className="flex bg-white/80 backdrop-blur-sm border-slate-100 border-t py-4 px-6 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Showing</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                1-5
              </span>
              <span className="text-xs text-slate-500 font-medium">of</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                5
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 hover:border-slate-300 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-slate-200"
                disabled
              >
                <Icon icon="solar:alt-arrow-left-linear" width="16" />
              </button>
              <button className="px-3 h-8 bg-slate-900 border border-slate-900 rounded-lg text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition-colors">
                1
              </button>
              <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 hover:border-slate-300 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-slate-200" disabled>
                <Icon icon="solar:alt-arrow-right-linear" width="16" />
              </button>
          </div>
        </div>
      </div>

      {isRecordPresentationOpen && selectedQuoteForPresentation && (
        <RecordPresentationModal
          onClose={() => {
            setIsRecordPresentationOpen(false);
            setSelectedQuoteForPresentation(null);
          }}
          preSelectedType="quote"
          preSelectedId={selectedQuoteForPresentation}
          documentNumber={quotations.find(q => q.id === selectedQuoteForPresentation)?.number}
          documentTitle={quotations.find(q => q.id === selectedQuoteForPresentation)?.title}
        />
      )}
    </div>
  );
}
