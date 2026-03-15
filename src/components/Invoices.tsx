import { Icon } from '@iconify/react';
import { useState, useRef, useEffect } from 'react';
import ScopeFilter, { ScopeType } from './ScopeFilter';
import RecordPresentationModal from './RecordPresentationModal';
import { Contact, Invoice } from '../contexts/CallManagerContext';

interface InvoicesProps {
  isTeamView: boolean;
  homeFilterPreference: 'team' | 'personal';
  onPaymentReminderClick?: (invoice: Invoice, contact: Contact) => void;
  onEmailInvoiceClick?: (invoice: Invoice) => void;
  onAskAIClick?: (invoice: Invoice) => void;
  onOpenTemplateBuilder?: () => void;
  onOpenCreateInvoice?: () => void;
  onDeleteInvoice?: (invoice: Invoice) => void;
}

export default function Invoices({ isTeamView, homeFilterPreference, onPaymentReminderClick, onEmailInvoiceClick, onAskAIClick, onOpenTemplateBuilder, onOpenCreateInvoice, onDeleteInvoice }: InvoicesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scopeFilter, setScopeFilter] = useState<ScopeType>(homeFilterPreference);
  const [hasManuallyChanged, setHasManuallyChanged] = useState(false);
  const [isRecordPresentationOpen, setIsRecordPresentationOpen] = useState(false);
  const [selectedInvoiceForPresentation, setSelectedInvoiceForPresentation] = useState<string | null>(null);
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
    paid: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: 'solar:check-circle-linear', label: 'Paid' },
    pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: 'solar:clock-circle-linear', label: 'Unpaid' },
    overdue: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: 'solar:danger-circle-linear', label: 'Overdue' },
    draft: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', icon: 'solar:document-linear', label: 'Draft' },
  };

  const clientColors = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', ring: 'ring-purple-100' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-100' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-100' },
    slate: { bg: 'bg-slate-100', text: 'text-slate-600', ring: 'ring-slate-200' },
    pink: { bg: 'bg-pink-50', text: 'text-pink-600', ring: 'ring-pink-100' },
    sky: { bg: 'bg-sky-50', text: 'text-sky-600', ring: 'ring-sky-100' },
  };

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

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    paid: invoices.filter((inv) => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0),
    unpaid: invoices.filter((inv) => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0),
    overdue: invoices.filter((inv) => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0),
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col p-6" style={{ scrollbarGutter: 'stable' }}>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats.total)}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
              <Icon icon="solar:bill-list-linear" width="20" className="text-slate-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Paid</p>
              <p className="text-2xl font-bold text-emerald-700">{formatCurrency(stats.paid)}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Icon icon="solar:check-circle-linear" width="20" className="text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">Unpaid</p>
              <p className="text-2xl font-bold text-amber-700">{formatCurrency(stats.unpaid)}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Icon icon="solar:clock-circle-linear" width="20" className="text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1">Overdue</p>
              <p className="text-2xl font-bold text-rose-700">{formatCurrency(stats.overdue)}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
              <Icon icon="solar:danger-circle-linear" width="20" className="text-rose-600" />
            </div>
          </div>
        </div>
      </div>

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
              placeholder="Search invoices..."
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
            onClick={() => onOpenCreateInvoice?.()}
            className="flex items-center gap-2 bg-gradient-to-b from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 border-t border-white/20 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Icon icon="solar:add-circle-linear" width="18" className="text-indigo-100" />
            <span className="text-sm font-semibold tracking-wide">Create Invoice</span>
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
                <th scope="col" className="px-4 py-4">
                  Invoice
                </th>
                <th scope="col" className="px-4 py-4">
                  Client
                </th>
                <th scope="col" className="px-4 py-4">
                  Status
                </th>
                <th scope="col" className="px-4 py-4">
                  Amount
                </th>
                <th scope="col" className="px-4 py-4">
                  Issue Date
                </th>
                <th scope="col" className="px-4 py-4">
                  Due Date
                </th>
                <th scope="col" className="px-4 py-4 w-16">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredInvoices.map((invoice) => {
                const statusStyle = statusStyles[invoice.status];
                const clientColor = clientColors[invoice.client.color as keyof typeof clientColors];
                const daysUntilDue = getDaysUntilDue(invoice.dueDate);

                return (
                  <tr key={invoice.id} className="hover:bg-slate-50/50 transition-colors group">
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
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-slate-900">{invoice.title}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-9 w-9 rounded-full ${clientColor.bg} ${clientColor.text} flex items-center justify-center text-xs font-semibold ring-2 ${clientColor.ring} shadow-sm group-hover:shadow-md transition-shadow`}
                        >
                          {invoice.client.initials}
                        </div>
                        <div className="text-sm font-semibold text-slate-900">{invoice.client.name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md ${statusStyle.bg} ${statusStyle.text} text-xs font-medium border ${statusStyle.border}`}
                      >
                        <Icon icon={statusStyle.icon} width="14" />
                        {statusStyle.label}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Icon icon="solar:wallet-money-linear" width="14" className="text-slate-400" />
                        <span className="text-sm font-bold text-slate-900">{formatCurrency(invoice.amount)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Icon icon="solar:calendar-linear" width="14" className="text-slate-400" />
                        <span>{formatDate(invoice.issueDate)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Icon icon="solar:calendar-mark-linear" width="14" className="text-slate-400" />
                          <span>{formatDate(invoice.dueDate)}</span>
                        </div>
                        {invoice.status === 'pending' && (
                          <div className="text-[10px] font-medium text-slate-500 mt-1">
                            {daysUntilDue > 0 ? `${daysUntilDue} days left` : `Due today`}
                          </div>
                        )}
                        {invoice.status === 'overdue' && (
                          <div className="text-[10px] font-semibold text-rose-600 mt-1">
                            {Math.abs(daysUntilDue)} days overdue
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <div className="relative" ref={openDropdown === invoice.id ? dropdownRef : null}>
                        <button
                          onClick={() => setOpenDropdown(openDropdown === invoice.id ? null : invoice.id)}
                          className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 hover:ring-1 hover:ring-slate-200 transition-all focus:outline-none"
                        >
                          <Icon icon="solar:menu-dots-bold" width="16" />
                        </button>

                        {openDropdown === invoice.id && (
                          <div className="absolute right-0 mt-2 w-52 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-slate-200/60 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200 ring-1 ring-black/5">
                            <button
                              onClick={() => {
                                setOpenDropdown(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm font-bold text-slate-800 hover:bg-emerald-50/80 hover:text-emerald-700 flex items-center gap-2.5 transition-all duration-200 group"
                            >
                              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 group-hover:scale-105 transition-all duration-200">
                                <Icon icon="solar:eye-linear" width="15" className="text-emerald-600 group-hover:text-emerald-700" />
                              </div>
                              <span>View Invoice</span>
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
                              <span>Edit Invoice</span>
                            </button>
                            <div className="border-t border-slate-100 my-1.5 mx-2" />
                            <button
                              onClick={() => {
                                setSelectedInvoiceForPresentation(invoice.id);
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
                                onEmailInvoiceClick?.(invoice);
                                setOpenDropdown(null);
                              }}
                              className="w-full px-3 py-1.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50/80 hover:text-slate-900 flex items-center gap-2.5 transition-all duration-200 group"
                            >
                              <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 group-hover:scale-105 transition-all duration-200">
                                <Icon icon="solar:letter-linear" width="13" className="text-slate-600 group-hover:text-slate-700" />
                              </div>
                              <span>Email Invoice</span>
                            </button>
                            <div className="border-t border-slate-100 my-1.5 mx-2" />
                            <button
                              onClick={() => {
                                onPaymentReminderClick?.(invoice, {
                                  id: invoice.id,
                                  name: invoice.client.name,
                                  company_name: invoice.client.name,
                                });
                                setOpenDropdown(null);
                              }}
                              className="w-full px-3 py-1.5 text-left text-sm font-medium text-slate-700 hover:bg-blue-50/80 hover:text-blue-700 flex items-center gap-2.5 transition-all duration-200 group"
                            >
                              <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-blue-100 group-hover:scale-105 transition-all duration-200">
                                <Icon icon="solar:phone-calling-rounded-linear" width="13" className="text-slate-600 group-hover:text-blue-600" />
                              </div>
                              <span>AI Reminder Call</span>
                            </button>
                            <button
                              onClick={() => {
                                onAskAIClick?.(invoice);
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
                              <span>Duplicate Invoice</span>
                            </button>
                            <div className="border-t border-slate-100 my-1.5 mx-2" />
                            <button
                              onClick={() => {
                                onDeleteInvoice?.(invoice);
                                setOpenDropdown(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50/80 hover:text-rose-700 flex items-center gap-2.5 transition-all duration-200 group"
                            >
                              <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center group-hover:bg-rose-100 group-hover:scale-105 transition-all duration-200">
                                <Icon icon="solar:trash-bin-trash-linear" width="15" className="text-rose-500 group-hover:text-rose-600" />
                              </div>
                              <span>Delete Invoice</span>
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
              1-{filteredInvoices.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">of</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
              {invoices.length}
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
            <button
              className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 hover:border-slate-300 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-slate-200"
              disabled
            >
              <Icon icon="solar:alt-arrow-right-linear" width="16" />
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
        />
      )}
    </div>
  );
}
