import { Icon } from '@iconify/react';
import { useState, useRef, useEffect } from 'react';
import RecordPresentationModal from './RecordPresentationModal';
import { Contact, Invoice } from '../contexts/CallManagerContext';

type InvoiceStatus = Invoice['status'];

const statusConfig: Record<InvoiceStatus, { label: string; icon: string; pillBg: string; pillText: string; pillBorder: string; pillIconColor: string; badgeBg: string; badgeText: string; badgeBorder: string }> = {
  paid: {
    label: 'Paid',
    icon: 'solar:check-circle-linear',
    pillBg: 'bg-emerald-50', pillText: 'text-emerald-600', pillBorder: 'border-emerald-200/80', pillIconColor: 'text-emerald-500',
    badgeBg: 'bg-emerald-50', badgeText: 'text-emerald-700', badgeBorder: 'border-emerald-200',
  },
  pending: {
    label: 'Unpaid',
    icon: 'solar:clock-circle-linear',
    pillBg: 'bg-amber-50', pillText: 'text-amber-600', pillBorder: 'border-amber-200/80', pillIconColor: 'text-amber-500',
    badgeBg: 'bg-amber-50', badgeText: 'text-amber-700', badgeBorder: 'border-amber-200',
  },
  overdue: {
    label: 'Overdue',
    icon: 'solar:danger-circle-linear',
    pillBg: 'bg-rose-50', pillText: 'text-rose-500', pillBorder: 'border-rose-200/80', pillIconColor: 'text-rose-400',
    badgeBg: 'bg-rose-50', badgeText: 'text-rose-600', badgeBorder: 'border-rose-200',
  },
  draft: {
    label: 'Draft',
    icon: 'solar:document-linear',
    pillBg: 'bg-slate-100', pillText: 'text-slate-500', pillBorder: 'border-slate-200/80', pillIconColor: 'text-slate-400',
    badgeBg: 'bg-slate-100', badgeText: 'text-slate-600', badgeBorder: 'border-slate-200',
  },
};

const allStatuses: InvoiceStatus[] = ['paid', 'pending', 'overdue', 'draft'];

interface InvoicesProps {
  isTeamView: boolean;
  homeFilterPreference: 'team' | 'personal';
  onPaymentReminderClick?: (invoice: Invoice, contact: Contact) => void;
  onEmailInvoiceClick?: (invoice: Invoice) => void;
  onAskAIClick?: (invoice: Invoice) => void;
  onOpenTemplateBuilder?: () => void;
  onOpenCreateInvoice?: () => void;
  onDeleteInvoice?: (invoice: Invoice) => void;
  onUpgrade?: () => void;
}

export default function Invoices({ isTeamView, homeFilterPreference, onPaymentReminderClick, onEmailInvoiceClick, onAskAIClick, onOpenTemplateBuilder, onOpenCreateInvoice, onDeleteInvoice, onUpgrade }: InvoicesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openStatusBadge, setOpenStatusBadge] = useState<string | null>(null);
  const [scopeFilter, setScopeFilter] = useState<'team' | 'personal'>(homeFilterPreference);
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [hasManuallyChanged, setHasManuallyChanged] = useState(false);
  const [isRecordPresentationOpen, setIsRecordPresentationOpen] = useState(false);
  const [selectedInvoiceForPresentation, setSelectedInvoiceForPresentation] = useState<string | null>(null);
  const [invoiceStatuses, setInvoiceStatuses] = useState<Record<string, InvoiceStatus>>({});
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

  const invoices: Invoice[] = [
    {
      id: '1',
      number: 'INV-2024-001',
      title: 'Website Redesign - Final Payment',
      client: { name: 'Superproxy Inc.', initials: 'SI', color: 'blue' },
      status: 'paid',
      amount: 2262851,
      issueDate: '2024-12-15',
      dueDate: '2025-01-14',
      items: 8,
    },
    {
      id: '2',
      number: 'INV-2024-002',
      title: 'Mobile App Development - Milestone 2',
      client: { name: 'Notion', initials: 'NT', color: 'purple' },
      status: 'pending',
      amount: 425000,
      issueDate: '2024-12-20',
      dueDate: '2025-01-19',
      items: 5,
    },
    {
      id: '3',
      number: 'INV-2024-003',
      title: 'Brand Identity Package',
      client: { name: 'SpaceX', initials: 'SX', color: 'slate' },
      status: 'overdue',
      amount: 180000,
      issueDate: '2024-11-25',
      dueDate: '2024-12-25',
      items: 4,
    },
    {
      id: '4',
      number: 'INV-2024-004',
      title: 'E-commerce Platform - Monthly Subscription',
      client: { name: 'Apple', initials: 'AP', color: 'amber' },
      status: 'pending',
      amount: 89000,
      issueDate: '2024-12-28',
      dueDate: '2025-01-27',
      items: 1,
    },
    {
      id: '5',
      number: 'INV-2024-005',
      title: 'Marketing Campaign - Q4 Services',
      client: { name: 'Acme Corp', initials: 'AC', color: 'emerald' },
      status: 'draft',
      amount: 320000,
      issueDate: '2024-12-29',
      dueDate: '2025-01-28',
      items: 6,
    },
    {
      id: '6',
      number: 'INV-2024-006',
      title: 'Consultation & Strategy Session',
      client: { name: 'Tesla Inc.', initials: 'TI', color: 'sky' },
      status: 'paid',
      amount: 125000,
      issueDate: '2024-12-10',
      dueDate: '2025-01-09',
      items: 3,
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

  const getEffectiveStatus = (invoice: Invoice): InvoiceStatus =>
    invoiceStatuses[invoice.id] ?? invoice.status;

  const filteredInvoices = (statusFilter === 'all'
    ? invoices
    : invoices.filter(inv => getEffectiveStatus(inv) === statusFilter)
  ).filter(
    (invoice) =>
      invoice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeStatusConfig = statusFilter === 'all' ? null : statusConfig[statusFilter];

  return (
    <div className="flex-1 overflow-hidden flex flex-col p-6" style={{ scrollbarGutter: 'stable' }}>
      {/* Toolbar */}
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
              placeholder="Search invoices..."
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
            onClick={() => onOpenCreateInvoice?.()}
            className="flex items-center gap-2 border border-slate-200 text-slate-600 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50 px-4 py-2 rounded-xl transition-all active:scale-[0.98]"
          >
            <Icon icon="solar:add-circle-linear" width="15" className="text-slate-400" />
            <span className="text-[13px] font-medium">Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="min-w-full divide-y divide-slate-100">
            <thead>
              <tr className="text-left text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                <th scope="col" className="pl-5 pr-6 py-3 w-[24%]">Invoice</th>
                <th scope="col" className="px-5 py-3 w-[20%]">Client</th>
                <th scope="col" className="px-5 py-3 w-[18%]">Status</th>
                <th scope="col" className="px-5 py-3 w-[16%]">Amount</th>
                <th scope="col" className="px-5 py-3 w-[14%]">Due Date</th>
                <th scope="col" className="px-3 py-3 w-[8%]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredInvoices.map((invoice) => {
                const effectiveStatus = getEffectiveStatus(invoice);
                const config = statusConfig[effectiveStatus];

                return (
                  <tr
                    key={invoice.id}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                  >
                    <td className="pl-5 pr-6 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-semibold flex-shrink-0">
                          {invoice.client.initials}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[13px] font-medium text-slate-800">{invoice.title}</span>
                          <span className="text-[11px] text-slate-400 font-mono">{invoice.number}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span className="text-[13px] text-slate-500">{invoice.client.name}</span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="relative" ref={openStatusBadge === invoice.id ? statusBadgeRef : null}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenStatusBadge(openStatusBadge === invoice.id ? null : invoice.id);
                          }}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${config.badgeBg} ${config.badgeText} text-[11px] font-semibold border ${config.badgeBorder} hover:opacity-80 transition-all active:scale-[0.96] cursor-pointer`}
                        >
                          <Icon icon={config.icon} width="12" />
                          {config.label}
                          <Icon icon="solar:alt-arrow-down-linear" width="11" className="opacity-50 -mr-0.5" />
                        </button>

                        {openStatusBadge === invoice.id && (
                          <div className="absolute left-0 mt-1.5 w-44 bg-white rounded-2xl shadow-[0_12px_48px_rgba(0,0,0,0.14)] border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                            {allStatuses.map((status) => {
                              const opt = statusConfig[status];
                              const isActive = effectiveStatus === status;
                              return (
                                <button
                                  key={status}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setInvoiceStatuses(prev => ({ ...prev, [invoice.id]: status }));
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
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span className="text-[13px] font-medium text-slate-800">{formatCurrency(invoice.amount)}</span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span className="text-[13px] text-slate-500">{formatDate(invoice.dueDate)}</span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="relative" ref={openDropdown === invoice.id ? dropdownRef : null}>
                        <button
                          onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === invoice.id ? null : invoice.id); }}
                          className={`flex items-center justify-center w-7 h-7 rounded-lg border transition-colors ${
                            openDropdown === invoice.id
                              ? 'bg-slate-100 border-slate-200 text-slate-600'
                              : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                          }`}
                        >
                          <Icon icon="solar:menu-dots-bold" width="14" />
                        </button>

                        {openDropdown === invoice.id && (
                          <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-slate-200/60 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
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
                                setSelectedInvoiceForPresentation(invoice.id);
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
                                onEmailInvoiceClick?.(invoice);
                                setOpenDropdown(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                            >
                              <Icon icon="solar:letter-linear" width="14" className="text-slate-400" />
                              Email Invoice
                            </button>
                            <div className="my-1 border-t border-slate-100 mx-2" />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onPaymentReminderClick?.(invoice, {
                                  id: invoice.id,
                                  name: invoice.client.name,
                                  company_name: invoice.client.name,
                                });
                                setOpenDropdown(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                            >
                              <Icon icon="solar:phone-calling-linear" width="14" className="text-slate-400" />
                              AI Reminder Call
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAskAIClick?.(invoice);
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
                                onDeleteInvoice?.(invoice);
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
          <span className="text-[11px] text-slate-400">Showing 1–{filteredInvoices.length} of {filteredInvoices.length}</span>
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

      {isRecordPresentationOpen && selectedInvoiceForPresentation && (
        <RecordPresentationModal
          onClose={() => {
            setIsRecordPresentationOpen(false);
            setSelectedInvoiceForPresentation(null);
          }}
          preSelectedType="invoice"
          preSelectedId={selectedInvoiceForPresentation}
          documentNumber={invoices.find(i => i.id === selectedInvoiceForPresentation)?.number}
          documentTitle={invoices.find(i => i.id === selectedInvoiceForPresentation)?.title}
          onUpgrade={onUpgrade}
        />
      )}
    </div>
  );
}
