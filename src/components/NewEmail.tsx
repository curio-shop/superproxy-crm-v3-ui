import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import NotificationCard from './NotificationCard';
import { useToast } from './ToastContainer';
import { supabase } from '../lib/supabase';
import { Quotation, Invoice } from '../contexts/CallManagerContext';

interface NewEmailProps {
  onBack: () => void;
  contactName?: string;
  contactEmail?: string;
  onOpenEmailHistory?: () => void;
  preSelectedQuote?: Quotation | null;
  preSelectedInvoice?: Invoice | null;
  onEmailSent?: () => void;
}

interface QuoteInvoiceItem {
  id: string;
  title: string;
  number: string;
  amount: string;
  date: string;
  status: 'published' | 'overdue' | 'sent' | 'expiring soon';
}

interface PresentationItem {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
}

const mockQuotes: QuoteInvoiceItem[] = [
  { id: '1', title: 'Berkshire Stadium Project', number: 'Q-2024', amount: '$3,810.00', date: 'Jan 12', status: 'published' },
  { id: '2', title: 'Downtown Office Renovation', number: 'Q-2023', amount: '$12,450.00', date: 'Jan 10', status: 'sent' },
  { id: '3', title: 'Harbor View Apartments', number: 'Q-2022', amount: '$8,200.00', date: 'Jan 8', status: 'expiring soon' },
  { id: '4', title: 'Tech Campus Phase 2', number: 'Q-2021', amount: '$24,500.00', date: 'Jan 5', status: 'published' },
  { id: '5', title: 'Riverside Mall Expansion', number: 'Q-2020', amount: '$15,780.00', date: 'Dec 28', status: 'sent' },
  { id: '6', title: 'Green Valley Residences', number: 'Q-2019', amount: '$6,950.00', date: 'Dec 22', status: 'expiring soon' },
];

const mockInvoices: QuoteInvoiceItem[] = [
  { id: '1', title: 'Berkshire Stadium Project', number: 'INV-1024', amount: '$3,810.00', date: 'Jan 12', status: 'published' },
  { id: '2', title: 'Downtown Office Renovation', number: 'INV-1023', amount: '$12,450.00', date: 'Jan 10', status: 'sent' },
  { id: '3', title: 'Harbor View Apartments', number: 'INV-1022', amount: '$8,200.00', date: 'Jan 8', status: 'overdue' },
  { id: '4', title: 'Westside Shopping Center', number: 'INV-1021', amount: '$18,900.00', date: 'Jan 6', status: 'published' },
  { id: '5', title: 'City Park Infrastructure', number: 'INV-1020', amount: '$31,250.00', date: 'Jan 3', status: 'overdue' },
  { id: '6', title: 'Lakefront Development', number: 'INV-1019', amount: '$9,840.00', date: 'Dec 30', status: 'sent' },
];

const mockPresentations: PresentationItem[] = [
  { id: '1', title: 'Viet Tours', date: 'Jan 15', time: '03:44 PM', duration: '0:29' },
  { id: '2', title: 'Viet Tours', date: 'Jan 14', time: '02:20 PM', duration: '0:14' },
  { id: '3', title: 'Harbor View Apartments', date: 'Jan 13', time: '11:30 AM', duration: '1:15' },
  { id: '4', title: 'Downtown Office Renovation', date: 'Jan 12', time: '09:15 AM', duration: '0:45' },
  { id: '5', title: 'Tech Campus Phase 2', date: 'Jan 10', time: '04:00 PM', duration: '1:30' },
  { id: '6', title: 'Berkshire Stadium Project', date: 'Jan 8', time: '10:30 AM', duration: '2:15' },
];

export default function NewEmail({ onBack, contactName, contactEmail, onOpenEmailHistory, preSelectedQuote, preSelectedInvoice, onEmailSent }: NewEmailProps) {
  const { showToast } = useToast();
  const [sourceType, setSourceType] = useState<'quote' | 'invoice' | 'empty'>('empty');
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showPresentationDropdown, setShowPresentationDropdown] = useState(false);
  const [showScheduleDropdown, setShowScheduleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [subject, setSubject] = useState('');
  const [ccRecipients, setCcRecipients] = useState('');
  const [selectedSourceItem, setSelectedSourceItem] = useState<QuoteInvoiceItem | null>(null);
  const [emailBody, setEmailBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  // Handle pre-selected quote or invoice
  useEffect(() => {
    if (preSelectedQuote) {
      setSourceType('quote');
      const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'THB',
        minimumFractionDigits: 0,
      }).format(preSelectedQuote.amount);

      const formattedDate = new Date(preSelectedQuote.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      setSelectedSourceItem({
        id: preSelectedQuote.id,
        title: preSelectedQuote.title,
        number: preSelectedQuote.number,
        amount: formattedAmount,
        date: formattedDate,
        status: preSelectedQuote.status,
      });
      setSubject(`Quote for ${preSelectedQuote.title}`);
    } else if (preSelectedInvoice) {
      setSourceType('invoice');
      const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'THB',
        minimumFractionDigits: 0,
      }).format(preSelectedInvoice.amount);

      const formattedDate = new Date(preSelectedInvoice.issueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      const mappedStatus: 'published' | 'overdue' | 'sent' | 'expiring soon' =
        preSelectedInvoice.status === 'paid' ? 'published' :
        preSelectedInvoice.status === 'overdue' ? 'overdue' :
        preSelectedInvoice.status === 'pending' ? 'expiring soon' : 'sent';

      setSelectedSourceItem({
        id: preSelectedInvoice.id,
        title: preSelectedInvoice.title,
        number: preSelectedInvoice.number,
        amount: formattedAmount,
        date: formattedDate,
        status: mappedStatus,
      });
      setSubject(`Invoice for ${preSelectedInvoice.title}`);
    }
  }, [preSelectedQuote, preSelectedInvoice]);

  const getSourceIcon = () => {
    return sourceType === 'empty'
      ? 'solar:stars-minimalistic-linear'
      : 'solar:document-text-linear';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      { from: 'from-blue-500', to: 'to-blue-600' },
      { from: 'from-emerald-500', to: 'to-emerald-600' },
      { from: 'from-purple-500', to: 'to-purple-600' },
      { from: 'from-amber-500', to: 'to-amber-600' },
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      published: { bg: 'bg-blue-50', text: 'text-blue-700', ring: 'ring-blue-200/50', dot: 'bg-blue-500' },
      overdue: { bg: 'bg-red-50', text: 'text-red-700', ring: 'ring-red-200/50', dot: 'bg-red-500' },
      sent: { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-200/50', dot: 'bg-emerald-500' },
      'expiring soon': { bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-200/50', dot: 'bg-amber-500' },
    };
    return styles[status as keyof typeof styles] || styles.published;
  };

  const handleSelectSourceItem = (item: QuoteInvoiceItem) => {
    setSelectedSourceItem(item);
    setShowSourceDropdown(false);
    setSubject(`${sourceType === 'quote' ? 'Quote' : 'Invoice'} for ${item.title}`);
  };

  const handleSelectPresentation = (_presentation: PresentationItem) => {
    setShowPresentationDropdown(false);
  };

  const handleSourceTypeChange = (type: 'quote' | 'invoice' | 'empty') => {
    setSourceType(type);
    setSelectedSourceItem(null);
    setSubject('');
  };

  const avatarColor = contactName ? getAvatarColor(contactName) : { from: 'from-blue-500', to: 'to-blue-600' };
  const currentItems = sourceType === 'quote' ? mockQuotes : mockInvoices;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-dropdown]')) {
        setShowSourceDropdown(false);
        setShowPresentationDropdown(false);
        setShowScheduleDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSendEmail = async () => {
    if (!subject.trim()) {
      showToast('Please add a subject line', 'warning');
      return;
    }

    if (!emailBody.trim()) {
      showToast('Please write an email message', 'warning');
      return;
    }

    setIsSending(true);

    setTimeout(() => {
      setSendSuccess(true);
      setShowSuccessOverlay(true);
      onEmailSent?.();
      showToast('Email sent successfully!', 'success');

      setTimeout(() => {
        setShowSuccessOverlay(false);
      }, 1200);

      setTimeout(() => {
        onBack();
      }, 2000);
    }, 800);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-white/30 sticky top-0 bg-white/40 backdrop-blur-xl z-30 transition-all">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="group flex items-center justify-center w-10 h-10 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition-all hover:shadow-md"
          >
            <Icon icon="solar:arrow-left-linear" width="20" className="text-slate-600 group-hover:text-slate-900 transition-colors" />
          </button>
          <div>
            <div className="flex items-baseline gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {contactName ? 'Email to' : 'New Email'}
              </h1>
              {contactName && (
                <span className="text-3xl font-light text-slate-600 tracking-tight font-display">
                  {contactName}
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-slate-500 mt-1.5">
              Compose a new message or view previous email conversations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Preview/Editor Toggle */}
          <div className="hidden md:flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200/60 shadow-sm">
            <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              Preview
            </button>
            <div className="w-px h-4 bg-slate-200"></div>
            <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-900">
              Editor
            </button>
          </div>

          {/* Email History Button */}
          <button
            onClick={() => onOpenEmailHistory?.()}
            className="group flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition-all shadow-sm hover:shadow-md"
          >
            <Icon icon="solar:inbox-line-linear" width="18" className="text-slate-500 group-hover:text-slate-700 transition-colors" />
            <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">
              Sent
            </span>
          </button>

          <div className="h-8 w-px bg-slate-200"></div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="group hover:text-slate-800 transition-all flex outline-none focus:ring-2 focus:ring-slate-100 text-slate-500 bg-white w-10 h-10 rounded-xl relative items-center justify-center shadow-sm hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] active:scale-95"
            >
              <Icon icon="solar:bell-linear" width="22" className="transition-transform group-hover:scale-105 group-active:scale-95" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white">
                <span className="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75 animate-ping"></span>
              </span>
            </button>

            <NotificationCard
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
          </div>
        </div>
      </header>

      {/* Composer Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-8 pb-8 flex justify-center custom-scrollbar bg-slate-50/30">
        <div className="w-full max-w-5xl flex flex-col gap-6 pt-6">

          {/* Context Selector Card */}
          <section className="bg-white rounded-2xl p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Reference Label */}
              <div className="flex items-center gap-2.5 pl-2 shrink-0 select-none">
                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                  <Icon icon="solar:link-circle-linear" width="18" />
                </div>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Reference
                </span>
              </div>

              {/* Switcher */}
              <div className="flex shrink-0 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => handleSourceTypeChange('quote')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                    sourceType === 'quote'
                      ? 'bg-white text-slate-900 shadow-sm font-bold'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                  }`}
                >
                  Quote
                </button>
                <button
                  onClick={() => handleSourceTypeChange('invoice')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                    sourceType === 'invoice'
                      ? 'bg-white text-slate-900 shadow-sm font-bold'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                  }`}
                >
                  Invoice
                </button>
                <button
                  onClick={() => handleSourceTypeChange('empty')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                    sourceType === 'empty'
                      ? 'bg-white text-slate-900 shadow-sm font-bold'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                  }`}
                >
                  Empty
                </button>
              </div>

              {/* Active Item Display */}
              <div className="flex-1 w-full relative" data-dropdown>
                {sourceType !== 'empty' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowSourceDropdown(!showSourceDropdown)}
                      className="flex items-center justify-between w-full h-[60px] px-4 bg-slate-50 hover:bg-white border border-slate-200/60 rounded-xl transition-all group cursor-pointer outline-none focus:ring-2 focus:ring-blue-100 hover:border-blue-300"
                    >
                      <div className="flex items-center gap-4 overflow-hidden">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border bg-blue-50 text-blue-600 border-blue-100">
                          <Icon icon={getSourceIcon()} width="20" />
                        </div>
                        {selectedSourceItem ? (
                          <div className="flex flex-col justify-center overflow-hidden text-left">
                            <span className="text-sm font-semibold text-slate-900 truncate">
                              {selectedSourceItem.title}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-slate-600 truncate">
                                {sourceType === 'quote' ? 'Quote' : 'Invoice'} #{selectedSourceItem.number}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <span className="text-xs font-semibold truncate text-blue-600">
                                {selectedSourceItem.amount}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col justify-center overflow-hidden text-left">
                            <span className="text-sm font-medium text-slate-500">
                              Select {sourceType === 'invoice' ? 'an' : 'a'} {sourceType}
                            </span>
                            <span className="text-xs font-medium text-slate-400">
                              Choose {sourceType === 'invoice' ? 'an invoice' : 'a quote'} to attach
                            </span>
                          </div>
                        )}
                      </div>
                      <Icon
                        icon="solar:alt-arrow-down-linear"
                        width="20"
                        className={`text-slate-400 transition-transform shrink-0 ${showSourceDropdown ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* Source Dropdown Menu */}
                    {showSourceDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 p-1.5 z-50 max-h-[400px] overflow-y-auto custom-scrollbar">
                        <div className="px-3 py-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                          Select {sourceType === 'quote' ? 'Quote' : 'Invoice'}
                        </div>
                        {currentItems.map((item) => {
                          const statusStyle = getStatusBadge(item.status);
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleSelectSourceItem(item)}
                              className={`w-full flex items-center justify-between p-3 rounded-lg transition-all group hover:bg-slate-50 ${
                                selectedSourceItem?.id === item.id ? 'bg-blue-50 ring-1 ring-blue-100' : ''
                              }`}
                            >
                              <div className="flex items-center gap-3 overflow-hidden flex-1">
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border bg-blue-50 text-blue-600 border-blue-100 group-hover:scale-105 transition-transform">
                                  <Icon icon={getSourceIcon()} width="18" />
                                </div>
                                <div className="flex flex-col justify-center overflow-hidden text-left">
                                  <span className="text-sm font-semibold text-slate-900 truncate">
                                    {item.title}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-slate-600 truncate">
                                      #{item.number}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                    <span className="text-xs font-medium text-slate-500">
                                      {item.date}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-sm font-semibold text-slate-900">
                                  {item.amount}
                                </span>
                                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ring-1 ${statusStyle.bg} ${statusStyle.text} ${statusStyle.ring}`}>
                                  <div className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></div>
                                  <span className="text-[10px] font-semibold uppercase tracking-wide">
                                    {item.status}
                                  </span>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-[60px] bg-slate-50 border border-dashed border-slate-300 rounded-xl flex items-center justify-center px-4 text-sm font-semibold text-slate-600 animate-in fade-in zoom-in-95 duration-200 select-none gap-2">
                    <div className="p-1.5 rounded-md bg-amber-100 text-amber-600">
                      <Icon icon="solar:stars-minimalistic-linear" width="16" />
                    </div>
                    Starting from blank slate
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Email Form Card */}
          <div className="flex flex-col bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-2xl ring-1 ring-slate-900/5 transition-all duration-300 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.06)] relative z-10">
            {/* Header Fields */}
            <div className="flex flex-col border-b border-slate-50 px-6 py-3">
              {/* To Field */}
              <div className="group flex min-h-[56px] border-b border-slate-50 items-center">
                <label className="w-20 text-sm font-bold text-slate-600 transition-colors group-hover:text-blue-600">
                  To
                </label>
                <div className="flex items-center gap-2 flex-1">
                  {contactName ? (
                    <div className="flex items-center gap-2 pl-1 pr-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm hover:ring-2 transition-all cursor-pointer group/chip hover:border-blue-300 hover:ring-blue-50">
                      <div className={`flex items-center justify-center w-7 h-7 text-[11px] font-bold bg-gradient-to-br ${avatarColor.from} ${avatarColor.to} text-white rounded-full shadow-sm`}>
                        {getInitials(contactName)}
                      </div>
                      <span className="text-sm font-semibold text-slate-800 group-hover/chip:text-slate-900">
                        {contactName}
                      </span>
                    </div>
                  ) : (
                    <input
                      type="email"
                      placeholder="recipient@example.com"
                      className="flex-1 bg-transparent outline-none text-sm font-medium text-slate-700 placeholder-slate-400"
                    />
                  )}
                </div>
              </div>

              {/* Cc Field */}
              <div className="group flex min-h-[56px] border-b border-slate-50 items-center">
                <label className="w-20 text-sm font-bold text-slate-600 transition-colors group-hover:text-blue-600">
                  Cc
                </label>
                <input
                  type="text"
                  placeholder="Add recipients"
                  value={ccRecipients}
                  onChange={(e) => setCcRecipients(e.target.value)}
                  className="flex-1 border-none outline-none placeholder-slate-400 focus:ring-0 text-sm font-medium text-slate-700 bg-transparent h-full"
                />
              </div>

              {/* Subject Field */}
              <div className="group flex min-h-[56px] items-center">
                <label className="w-20 text-sm font-bold text-slate-600 transition-colors group-hover:text-blue-600">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter email subject"
                  className="flex-1 p-0 text-base font-semibold tracking-tight text-slate-900 bg-transparent border-none outline-none placeholder-slate-400 focus:ring-0"
                />
              </div>
            </div>

            {/* Modern Toolbar */}
            <div className="flex bg-slate-50/50 border-b border-slate-100 py-3 px-6 items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Formatting Group */}
                <div className="flex items-center p-0.5 bg-white border border-slate-200/80 rounded-lg shadow-sm">
                  <button className="p-1.5 text-slate-400 transition-all rounded-md hover:text-slate-900 hover:bg-slate-50">
                    <Icon icon="solar:text-bold-linear" width="16" />
                  </button>
                  <button className="p-1.5 text-slate-400 transition-all rounded-md hover:text-slate-900 hover:bg-slate-50">
                    <Icon icon="solar:text-italic-linear" width="16" />
                  </button>
                  <button className="p-1.5 text-slate-400 transition-all rounded-md hover:text-slate-900 hover:bg-slate-50">
                    <Icon icon="solar:text-underline-linear" width="16" />
                  </button>
                </div>

                {/* Attachment Button */}
                <button className="flex items-center justify-center p-2 bg-white border border-slate-200/80 rounded-lg shadow-sm text-slate-400 hover:shadow-md transition-all duration-200 outline-none group/attach hover:text-blue-600 hover:border-blue-200 hover:shadow-blue-500/10">
                  <Icon icon="solar:paperclip-linear" width="16" />
                </button>

                {/* Presentations Dropdown */}
                <div className="relative" data-dropdown>
                  <button
                    onClick={() => setShowPresentationDropdown(!showPresentationDropdown)}
                    className="flex items-center justify-between gap-2 px-3 py-2 bg-white border border-slate-200/80 rounded-lg shadow-sm text-sm font-semibold text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:shadow-md transition-all duration-200 outline-none"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                      Add presentation
                    </span>
                    <Icon
                      icon="solar:alt-arrow-down-linear"
                      width="14"
                      className={`opacity-50 transition-transform ${showPresentationDropdown ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Presentation Dropdown Menu */}
                  {showPresentationDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-[380px] bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 p-1.5 z-50">
                      <div className="px-3 py-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Select Presentation
                      </div>
                      {mockPresentations.map((presentation) => (
                        <button
                          key={presentation.id}
                          onClick={() => handleSelectPresentation(presentation)}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group hover:bg-slate-50"
                        >
                          <div className="flex flex-col justify-center overflow-hidden text-left flex-1">
                            <span className="text-sm font-medium text-slate-700 truncate group-hover:text-slate-900 transition-colors">
                              {presentation.title} {presentation.date} at {presentation.time} <span className="text-slate-500">({presentation.duration})</span>
                            </span>
                          </div>
                          <Icon
                            icon="solar:add-circle-linear"
                            width="20"
                            className="text-slate-300 group-hover:text-slate-700 transition-colors shrink-0"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Text Body */}
            <div className="flex-1 p-8 min-h-[26rem]">
              <textarea
                className="w-full h-full font-sans text-[15px] font-medium leading-loose bg-transparent border-none outline-none resize-none text-slate-700 placeholder-slate-400 focus:ring-0"
                spellCheck={false}
                placeholder="Write your message..."
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
              />
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-2 pb-12">
            <button
              onClick={onBack}
              className="text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl text-sm font-bold px-4 py-2.5 transition-all flex items-center gap-2"
            >
              <Icon icon="solar:trash-bin-trash-linear" width="16" />
              Discard Draft
            </button>

            <div className="flex items-center gap-3">
              <div className="relative" data-dropdown>
                <button
                  onClick={() => setShowScheduleDropdown(!showScheduleDropdown)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl shadow-sm hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 transition-all outline-none focus:ring-2 focus:ring-blue-100 group"
                >
                  <Icon icon="solar:clock-circle-linear" width="18" className="text-slate-500 group-hover:text-slate-900 transition-colors" />
                  <span>Send Later</span>
                  <Icon icon="solar:alt-arrow-down-linear" width="14" className="opacity-50" />
                </button>

                {showScheduleDropdown && (
                  <div className="absolute bottom-full right-0 mb-2 w-[280px] origin-bottom-right bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 p-1.5 z-50">
                    <div className="px-3 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Schedule Send</div>

                    <button className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-slate-700 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors group">
                      <div className="flex items-center gap-2.5">
                        <Icon icon="solar:sunrise-linear" width="16" className="text-slate-400 group-hover:text-amber-500 transition-colors" />
                        <span>Tomorrow morning</span>
                      </div>
                      <span className="text-xs font-medium text-slate-500">8:00 AM</span>
                    </button>

                    <button className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-slate-700 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors group">
                      <div className="flex items-center gap-2.5">
                        <Icon icon="solar:sun-linear" width="16" className="text-slate-400 group-hover:text-orange-500 transition-colors" />
                        <span>Tomorrow afternoon</span>
                      </div>
                      <span className="text-xs font-medium text-slate-500">1:00 PM</span>
                    </button>

                    <button className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-slate-700 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors group">
                      <div className="flex items-center gap-2.5">
                        <Icon icon="solar:calendar-linear" width="16" className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                        <span>Monday morning</span>
                      </div>
                      <span className="text-xs font-medium text-slate-500">Nov 25</span>
                    </button>

                    <div className="h-px bg-slate-100 my-1.5 mx-2"></div>

                    <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold text-slate-700 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors group">
                      <Icon icon="solar:calendar-mark-linear" width="16" className="text-slate-400 group-hover:text-slate-900 transition-colors" />
                      <span>Pick date & time...</span>
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={handleSendEmail}
                disabled={isSending || sendSuccess}
                className={`group relative font-bold py-3 px-6 rounded-xl transition-all duration-500 text-sm flex items-center gap-2 overflow-hidden ${
                  sendSuccess
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white cursor-default shadow-lg shadow-emerald-500/30 scale-[1.02]'
                    : isSending
                    ? 'bg-slate-800 text-white cursor-wait shadow-lg shadow-slate-500/20'
                    : 'bg-slate-900 hover:bg-slate-800 text-white hover:shadow-xl shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 active:scale-[0.98]'
                }`}
              >
                {sendSuccess && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-emerald-600/20 animate-pulse" />
                )}
                <div className="relative flex items-center gap-2">
                  {sendSuccess ? (
                    <>
                      <Icon icon="solar:check-circle-bold" width="20" className="animate-bounce" />
                      <span>Email Sent!</span>
                    </>
                  ) : isSending ? (
                    <>
                      <div className="animate-spin">
                        <Icon icon="solar:restart-circle-linear" width="20" />
                      </div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Email</span>
                      <Icon icon="solar:arrow-right-linear" width="20" className="group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSuccessOverlay && (
        <div className="fixed inset-0 bg-gradient-to-br from-emerald-500/10 via-blue-500/5 to-slate-900/10 backdrop-blur-sm z-[45] animate-in fade-in duration-300" />
      )}
    </div>
  );
}
