import { Icon } from '@iconify/react';
import { useState, useRef, useEffect } from 'react';
import RecordPresentationModal from './RecordPresentationModal';
import { Contact, Quotation } from '../contexts/CallManagerContext';

type QuotationStatus = Quotation['status'];

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

const statusConfig: Record<QuotationStatus, { label: string; icon: string; pillBg: string; pillText: string; pillBorder: string; pillIconColor: string; badgeBg: string; badgeText: string; badgeBorder: string }> = {
  draft: {
    label: 'Draft',
    icon: 'solar:pen-new-square-linear',
    pillBg: 'bg-amber-50', pillText: 'text-amber-600', pillBorder: 'border-amber-200/80', pillIconColor: 'text-amber-500',
    badgeBg: 'bg-amber-50', badgeText: 'text-amber-700', badgeBorder: 'border-amber-200',
  },
  sent: {
    label: 'Sent',
    icon: 'solar:plain-3-linear',
    pillBg: 'bg-sky-50', pillText: 'text-sky-600', pillBorder: 'border-sky-200/80', pillIconColor: 'text-sky-500',
    badgeBg: 'bg-sky-50', badgeText: 'text-sky-700', badgeBorder: 'border-sky-200',
  },
  published: {
    label: 'Published',
    icon: 'solar:check-circle-linear',
    pillBg: 'bg-indigo-50', pillText: 'text-indigo-600', pillBorder: 'border-indigo-200/80', pillIconColor: 'text-indigo-500',
    badgeBg: 'bg-indigo-50', badgeText: 'text-indigo-700', badgeBorder: 'border-indigo-200',
  },
  expired: {
    label: 'Expired',
    icon: 'solar:clock-circle-linear',
    pillBg: 'bg-slate-100', pillText: 'text-slate-500', pillBorder: 'border-slate-200/80', pillIconColor: 'text-slate-400',
    badgeBg: 'bg-slate-100', badgeText: 'text-slate-600', badgeBorder: 'border-slate-200',
  },
  deal_won: {
    label: 'Deal Won',
    icon: 'solar:cup-star-linear',
    pillBg: 'bg-emerald-50', pillText: 'text-emerald-600', pillBorder: 'border-emerald-200/80', pillIconColor: 'text-emerald-500',
    badgeBg: 'bg-emerald-50', badgeText: 'text-emerald-700', badgeBorder: 'border-emerald-200',
  },
  deal_lost: {
    label: 'Deal Lost',
    icon: 'solar:close-circle-linear',
    pillBg: 'bg-rose-50', pillText: 'text-rose-500', pillBorder: 'border-rose-200/80', pillIconColor: 'text-rose-400',
    badgeBg: 'bg-rose-50', badgeText: 'text-rose-600', badgeBorder: 'border-rose-200',
  },
};

const allStatuses: QuotationStatus[] = ['draft', 'sent', 'published', 'expired', 'deal_won', 'deal_lost'];

export default function Quotations({ isTeamView, homeFilterPreference, onViewQuote, onQuoteFollowUpClick, onEmailQuoteClick, onCreateInvoiceClick, onAskAIClick, onOpenTemplateBuilder, onOpenCreateQuote, onDeleteQuotation }: QuotationsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openStatusBadge, setOpenStatusBadge] = useState<string | null>(null);
  const [scopeFilter, setScopeFilter] = useState<'team' | 'personal'>(homeFilterPreference);
  const [statusFilter, setStatusFilter] = useState<QuotationStatus | 'all'>('all');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [hasManuallyChanged, setHasManuallyChanged] = useState(false);
  const [isRecordPresentationOpen, setIsRecordPresentationOpen] = useState(false);
  const [selectedQuoteForPresentation, setSelectedQuoteForPresentation] = useState<string | null>(null);
  const [quotationStatuses, setQuotationStatuses] = useState<Record<string, QuotationStatus>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const statusBadgeRef = useRef<HTMLDivElement>(null);

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
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
      if (statusBadgeRef.current && !statusBadgeRef.current.contains(event.target as Node)) {
        setOpenStatusBadge(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      status: 'deal_won',
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
      status: 'expired',
      amount: 320000,
      date: '2024-12-20',
      validUntil: '2024-12-30',
      items: 6,
    },
    {
      id: '6',
      number: 'QT-2024-006',
      title: 'Cloud Migration Services',
      client: { name: 'BuildRight Inc', initials: 'BI', color: 'rose' },
      status: 'deal_lost',
      amount: 975000,
      date: '2024-12-18',
      validUntil: '2025-01-17',
      items: 9,
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

  const getEffectiveStatus = (quote: Quotation): QuotationStatus =>
    quotationStatuses[quote.id] ?? quote.status;

  const filteredQuotations = statusFilter === 'all'
    ? quotations
    : quotations.filter(q => getEffectiveStatus(q) === statusFilter);

  const activeStatusConfig = statusFilter === 'all' ? null : statusConfig[statusFilter];

  return (
    <div className="flex-1 overflow-hidden flex flex-col p-6" style={{ scrollbarGutter: 'stable' }}>
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="group w-full sm:w-80 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon
                icon="solar:magnifer-linear"
                width="16"
                className="text-slate-400 group-focus-within:text-slate-500 transition-colors"
              />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-white text-slate-600 placeholder-slate-400 focus:outline-none focus:border-slate-400 sm:text-sm transition-colors hover:border-slate-300"
              placeholder="Search quotations..."
            />
          </div>

          <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
            <button
              onClick={() => { setScopeFilter('personal'); setHasManuallyChanged(true); }}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                scopeFilter === 'personal'
                  ? 'bg-white text-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Personal
            </button>
            <button
              onClick={() => { setScopeFilter('team'); setHasManuallyChanged(true); }}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                scopeFilter === 'team'
                  ? 'bg-white text-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Team
            </button>
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative" ref={statusDropdownRef}>
            <button
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full border transition-all active:scale-[0.97] ${
                statusFilter === 'all'
                  ? 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                  : `${activeStatusConfig!.pillBg} ${activeStatusConfig!.pillBorder} ${activeStatusConfig!.pillText} border`
              }`}
            >
              <Icon
                icon={statusFilter === 'all' ? 'solar:filter-linear' : activeStatusConfig!.icon}
                width="14"
                className={statusFilter === 'all' ? 'text-slate-400' : activeStatusConfig!.pillIconColor}
              />
              <span className="text-[12px] font-semibold tracking-wide">
                {statusFilter === 'all' ? 'All Status' : activeStatusConfig!.label}
              </span>
              <Icon
                icon="solar:alt-arrow-down-linear"
                width="14"
                className={`transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''} ${statusFilter === 'all' ? 'text-slate-400' : 'opacity-60'}`}
              />
            </button>

            {isStatusDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-[0_12px_48px_rgba(0,0,0,0.14)] border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                {/* All option */}
                <button
                  onClick={() => { setStatusFilter('all'); setIsStatusDropdownOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-[13px] transition-colors ${
                    statusFilter === 'all'
                      ? 'bg-slate-50 text-slate-800 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50/80 font-medium'
                  }`}
                >
                  <span>All Status</span>
                  {statusFilter === 'all' && (
                    <Icon icon="solar:check-circle-bold" width="16" className="text-slate-500" />
                  )}
                </button>

                <div className="my-1 border-t border-slate-100 mx-3" />

                {allStatuses.map((status) => {
                  const config = statusConfig[status];
                  const isActive = statusFilter === status;
                  return (
                    <button
                      key={status}
                      onClick={() => { setStatusFilter(status); setIsStatusDropdownOpen(false); }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-[13px] transition-colors ${
                        isActive
                          ? `${config.badgeBg} ${config.badgeText} font-semibold`
                          : 'text-slate-600 hover:bg-slate-50/80 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon icon={config.icon} width="15" className={isActive ? config.pillIconColor : 'text-slate-400'} />
                        <span>{config.label}</span>
                      </div>
                      {isActive && (
                        <Icon icon="solar:check-circle-bold" width="16" className={config.pillIconColor} />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenTemplateBuilder?.()}
            className="flex items-center gap-2 border border-slate-200 text-slate-600 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50 px-4 py-2 rounded-xl transition-all active:scale-[0.98]"
          >
            <Icon icon="solar:magic-stick-3-linear" width="15" className="text-slate-400" />
            <span className="text-[13px] font-medium">Customize Template</span>
          </button>
          <button
            onClick={() => onOpenCreateQuote?.()}
            className="flex items-center gap-2 border border-slate-200 text-slate-600 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50 px-4 py-2 rounded-xl transition-all active:scale-[0.98]"
          >
            <Icon icon="solar:add-circle-linear" width="15" className="text-slate-400" />
            <span className="text-[13px] font-medium">Create Quote</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="min-w-full divide-y divide-slate-100">
            <thead>
              <tr className="text-left text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                <th scope="col" className="pl-5 pr-2 py-3">Quote Name</th>
                <th scope="col" className="px-4 py-3">Client</th>
                <th scope="col" className="px-4 py-3">Status</th>
                <th scope="col" className="px-4 py-3">Amount</th>
                <th scope="col" className="px-4 py-3">Date Created</th>
                <th scope="col" className="px-4 py-3 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredQuotations.map((quote) => {
                const effectiveStatus = getEffectiveStatus(quote);
                const config = statusConfig[effectiveStatus];

                return (
                  <tr
                    key={quote.id}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    onClick={() => onViewQuote?.(quote)}
                  >
                    <td className="pl-5 pr-2 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-semibold flex-shrink-0">
                          {quote.client.initials}
                        </div>
                        <span className="text-[13px] font-medium text-slate-800">{quote.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-[13px] text-slate-500">{quote.client.name}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="relative" ref={openStatusBadge === quote.id ? statusBadgeRef : null}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenStatusBadge(openStatusBadge === quote.id ? null : quote.id);
                          }}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${config.badgeBg} ${config.badgeText} text-[11px] font-semibold border ${config.badgeBorder} hover:opacity-80 transition-all active:scale-[0.96] cursor-pointer`}
                        >
                          <Icon icon={config.icon} width="12" />
                          {config.label}
                          <Icon icon="solar:alt-arrow-down-linear" width="11" className="opacity-50 -mr-0.5" />
                        </button>

                        {openStatusBadge === quote.id && (
                          <div className="absolute left-0 mt-1.5 w-44 bg-white rounded-2xl shadow-[0_12px_48px_rgba(0,0,0,0.14)] border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                            {allStatuses.map((status) => {
                              const opt = statusConfig[status];
                              const isActive = effectiveStatus === status;
                              return (
                                <button
                                  key={status}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setQuotationStatuses(prev => ({ ...prev, [quote.id]: status }));
                                    setOpenStatusBadge(null);
                                  }}
                                  className={`w-full flex items-center justify-between px-3.5 py-2 text-[13px] transition-colors ${
                                    isActive
                                      ? `${opt.badgeBg} ${opt.badgeText} font-semibold`
                                      : 'text-slate-600 hover:bg-slate-50/80 font-medium'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <Icon icon={opt.icon} width="15" className={isActive ? opt.pillIconColor : 'text-slate-400'} />
                                    <span>{opt.label}</span>
                                  </div>
                                  {isActive && (
                                    <Icon icon="solar:check-circle-bold" width="16" className={opt.pillIconColor} />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-[13px] font-medium text-slate-800">{formatCurrency(quote.amount)}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-[13px] text-slate-500">{formatDate(quote.date)}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="relative" ref={openDropdown === quote.id ? dropdownRef : null}>
                        <button
                          onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === quote.id ? null : quote.id); }}
                          className={`flex items-center justify-center w-7 h-7 rounded-lg border transition-colors ${
                            openDropdown === quote.id
                              ? 'bg-slate-100 border-slate-200 text-slate-600'
                              : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                          }`}
                        >
                          <Icon icon="solar:menu-dots-bold" width="14" />
                        </button>

                        {openDropdown === quote.id && (
                          <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-slate-200/60 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewQuote?.(quote);
                                setOpenDropdown(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                            >
                              <Icon icon="solar:eye-linear" width="14" className="text-slate-400" />
                              View
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdown(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                            >
                              <Icon icon="solar:pen-linear" width="14" className="text-slate-400" />
                              Edit
                            </button>
                            <div className="my-1 border-t border-slate-100 mx-2" />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedQuoteForPresentation(quote.id);
                                setIsRecordPresentationOpen(true);
                                setOpenDropdown(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                            >
                              <Icon icon="solar:presentation-graph-linear" width="14" className="text-slate-400" />
                              Create Presentation
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEmailQuoteClick?.(quote);
                                setOpenDropdown(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                            >
                              <Icon icon="solar:letter-linear" width="14" className="text-slate-400" />
                              Email Quote
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onCreateInvoiceClick?.(quote);
                                setOpenDropdown(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                            >
                              <Icon icon="solar:bill-list-linear" width="14" className="text-slate-400" />
                              Create Invoice
                            </button>
                            <div className="my-1 border-t border-slate-100 mx-2" />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onQuoteFollowUpClick?.(quote, {
                                  id: quote.id,
                                  name: quote.client.name,
                                  company_name: quote.client.name,
                                });
                                setOpenDropdown(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                            >
                              <Icon icon="solar:phone-calling-linear" width="14" className="text-slate-400" />
                              AI Follow-Up Call
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAskAIClick?.(quote);
                                setOpenDropdown(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                            >
                              <Icon icon="solar:lightbulb-linear" width="14" className="text-slate-400" />
                              Ask AI
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdown(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                            >
                              <Icon icon="solar:copy-linear" width="14" className="text-slate-400" />
                              Duplicate
                            </button>
                            <div className="my-1 border-t border-slate-100 mx-2" />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteQuotation?.(quote);
                                setOpenDropdown(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                            >
                              <Icon icon="solar:trash-bin-minimalistic-linear" width="14" />
                              Delete
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

        <div className="flex border-t border-slate-100 py-3 px-4 items-center gap-3">
          <span className="text-[11px] text-slate-400">Showing 1–{filteredQuotations.length} of {filteredQuotations.length}</span>
          <div className="flex items-center gap-1.5">
            <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded-lg text-slate-300 transition-colors" disabled>
              <Icon icon="solar:alt-arrow-left-linear" width="14" />
            </button>
            <button className="px-2.5 h-7 bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-800">1</button>
            <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded-lg text-slate-300 transition-colors" disabled>
              <Icon icon="solar:alt-arrow-right-linear" width="14" />
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
