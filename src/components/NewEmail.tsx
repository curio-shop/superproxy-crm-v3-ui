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
  const [recipientField, setRecipientField] = useState(contactEmail || '');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');

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
      setEmailBody(defaultBodyText.quote);
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
      setEmailBody(defaultBodyText.invoice);
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
    setEmailBody(defaultBodyText[sourceType as 'quote' | 'invoice']);
    if (!contactName && !recipientField) {
      setRecipientField('stacy.chen@berkshire.com');
    }
  };

  const [selectedWalkthrough, setSelectedWalkthrough] = useState<PresentationItem | null>(null);

  const handleSelectPresentation = (presentation: PresentationItem) => {
    setSelectedWalkthrough(selectedWalkthrough?.id === presentation.id ? null : presentation);
    setShowPresentationDropdown(false);
  };

  const recipientName = contactName || 'Stacy';
  const signature = `\nWarm regards,\nJohn Mitchell\nNorthway Creative Media`;

  const defaultBodyText: Record<'quote' | 'invoice', string> = {
    quote: `Hi ${recipientName},\n\nGreat speaking with you. I've put together the details we discussed — everything is ready for your review.\n\nYou'll find the quotation attached with a clear breakdown of scope and pricing. No hidden lines — what you see is what you get.\n\nThere's also a short walkthrough included that covers how the process works end to end. Should save you a few back-and-forths.\n\nTake your time looking through it. I'm around whenever you'd like to chat.\n${signature}`,
    invoice: `Hi ${recipientName},\n\nThank you for moving forward — it's a pleasure working with you on this.\n\nThe invoice is attached with a full breakdown of the agreed scope and terms. Everything is itemized so it's easy to review on your end.\n\nFeel free to reach out if you'd like to walk through any of the details together.\n\nIf anything needs adjusting, just let me know — happy to sort it out.\n${signature}`,
  };

  const parseEmailBody = (body: string) => {
    const lines = body.split('\n');

    // Extract greeting from first non-empty line
    let greetingName: string | null = null;
    let greetingLineIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      const match = lines[i].match(/^(Hi|Hey|Hello|Dear)\s+(.+?),*\s*$/);
      if (match) {
        greetingName = match[2].trim();
        greetingLineIndex = i;
        break;
      }
    }

    // Extract signature: scan from bottom for sign-off line
    let signOff: string | null = null;
    let sigName: string | null = null;
    let sigCompany: string | null = null;
    let sigStartIndex = -1;
    const signOffWords = ['warm regards', 'best regards', 'kind regards', 'regards', 'cheers', 'thanks', 'thank you', 'best', 'sincerely'];
    for (let i = lines.length - 1; i >= 0; i--) {
      const trimmed = lines[i].trim().toLowerCase().replace(/,+$/, '');
      if (signOffWords.includes(trimmed)) {
        sigStartIndex = i;
        signOff = lines[i].trim();
        // Name is next non-empty line after sign-off
        for (let j = i + 1; j < lines.length; j++) {
          if (lines[j].trim()) { sigName = lines[j].trim(); break; }
        }
        // Company is next non-empty line after name
        let foundName = false;
        for (let j = i + 1; j < lines.length; j++) {
          if (lines[j].trim() && !foundName) { foundName = true; continue; }
          if (lines[j].trim() && foundName) { sigCompany = lines[j].trim(); break; }
        }
        break;
      }
    }

    // Build content from lines between greeting and signature
    const startIndex = greetingLineIndex >= 0 ? greetingLineIndex + 1 : 0;
    const endIndex = sigStartIndex >= 0 ? sigStartIndex : lines.length;
    const content = lines.slice(startIndex, endIndex).join('\n').trim();

    return { greetingName, content, signOff, sigName, sigCompany };
  };

  const handleSourceTypeChange = (type: 'quote' | 'invoice' | 'empty') => {
    setSourceType(type);
    setSelectedSourceItem(null);
    setSubject('');
    setEmailBody(type === 'empty' ? `\n\n\nWarm regards,\nJohn Mitchell\nNorthway Creative Media` : '');
    if (type === 'empty' && !contactName) {
      setRecipientField('');
    }
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
        // Reset to empty state
        setIsSending(false);
        setSendSuccess(false);
        setSubject('');
        setEmailBody('');
        setCcRecipients('');
        setRecipientField(contactEmail || '');
        setSourceType('empty');
        setSelectedSourceItem(null);
        setSelectedWalkthrough(null);
        setViewMode('editor');
      }, 1200);
    }, 800);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 sticky top-0 bg-white/60 backdrop-blur-xl z-30 transition-all">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-[13px] font-medium text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Icon icon="solar:arrow-left-linear" width="14" />
            Back
          </button>
          <div className="h-4 w-px bg-slate-200" />
          <h1 className="text-[15px] font-semibold text-slate-800 tracking-tight">
            {contactName ? `Email to ${contactName}` : 'New Email'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Preview/Editor Toggle */}
          <div className="hidden md:flex items-center bg-slate-100 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                viewMode === 'preview' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setViewMode('editor')}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                viewMode === 'editor' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Editor
            </button>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="group transition-all flex outline-none text-slate-400 hover:text-slate-600 w-9 h-9 rounded-xl border border-slate-200 relative items-center justify-center hover:bg-slate-50 hover:border-slate-300 active:scale-[0.97]"
            >
              <Icon icon="solar:bell-linear" width="18" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white">
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
      <div className="flex-1 overflow-y-auto px-4 lg:px-8 pb-8 flex justify-center custom-scrollbar">
        {viewMode === 'editor' ? (
        <div key="editor" className="w-full max-w-5xl flex flex-col gap-6 pt-6 animate-in fade-in duration-200">

          {/* Context Selector Card */}
          <section className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              {/* Reference Label */}
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider shrink-0 pl-1">
                Attach
              </span>

              {/* Switcher */}
              <div className="flex shrink-0 bg-slate-100 rounded-lg p-0.5">
                <button
                  onClick={() => handleSourceTypeChange('quote')}
                  className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                    sourceType === 'quote' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Quote
                </button>
                <button
                  onClick={() => handleSourceTypeChange('invoice')}
                  className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                    sourceType === 'invoice' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Invoice
                </button>
                <button
                  onClick={() => handleSourceTypeChange('empty')}
                  className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                    sourceType === 'empty' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  None
                </button>
              </div>

              {/* Active Item Display */}
              <div className="flex-1 w-full relative" data-dropdown>
                {sourceType !== 'empty' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowSourceDropdown(!showSourceDropdown)}
                      className="flex items-center justify-between w-full h-[52px] px-4 bg-slate-50 hover:bg-white border border-slate-200 rounded-xl transition-all group cursor-pointer outline-none focus:border-slate-400"
                    >
                      <div className="flex items-center gap-4 overflow-hidden">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border bg-slate-100 text-slate-500 border-slate-200">
                          <Icon icon={getSourceIcon()} width="20" />
                        </div>
                        {selectedSourceItem ? (
                          <div className="flex flex-col justify-center overflow-hidden text-left">
                            <span className="text-[13px] font-medium text-slate-800 truncate">
                              {selectedSourceItem.title}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-slate-400 truncate">
                                {sourceType === 'quote' ? 'Quote' : 'Invoice'} #{selectedSourceItem.number}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <span className="text-[11px] font-medium truncate text-slate-500">
                                {selectedSourceItem.amount}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col justify-center overflow-hidden text-left">
                            <span className="text-[13px] text-slate-500">
                              Select {sourceType === 'invoice' ? 'an' : 'a'} {sourceType}
                            </span>
                            <span className="text-[11px] text-slate-400">
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
                                selectedSourceItem?.id === item.id ? 'bg-slate-50 ring-1 ring-slate-200' : ''
                              }`}
                            >
                              <div className="flex items-center gap-3 overflow-hidden flex-1">
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border bg-slate-100 text-slate-500 border-slate-200 group-hover:scale-105 transition-transform">
                                  <Icon icon={getSourceIcon()} width="18" />
                                </div>
                                <div className="flex flex-col justify-center overflow-hidden text-left">
                                  <span className="text-[13px] font-medium text-slate-700 truncate">
                                    {item.title}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[11px] text-slate-400 truncate">
                                      #{item.number}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                    <span className="text-[11px] text-slate-400">
                                      {item.date}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-[13px] font-medium text-slate-700">
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
                  <div className="w-full h-[52px] bg-slate-50 border border-dashed border-slate-200 rounded-xl flex items-center justify-center px-4 text-[13px] font-medium text-slate-400 animate-in fade-in zoom-in-95 duration-200 select-none gap-2">
                    <div className="p-1.5 rounded-md bg-slate-100 text-slate-400">
                      <Icon icon="solar:document-linear" width="16" />
                    </div>
                    Starting from blank slate
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Email Form Card */}
          <div className="flex flex-col bg-white border border-slate-200 shadow-sm rounded-2xl relative z-10">
            {/* Header Fields */}
            <div className="flex flex-col border-b border-slate-50 px-6 py-3">
              {/* To Field */}
              <div className="group flex min-h-[56px] border-b border-slate-50 items-center">
                <label className="w-20 text-[13px] font-medium text-slate-400 transition-colors group-hover:text-slate-500">
                  To
                </label>
                <div className="flex items-center gap-2 flex-1">
                  {contactName ? (
                    <div className="flex items-center gap-2 pl-1 pr-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm hover:ring-1 transition-all cursor-pointer group/chip hover:border-slate-300 hover:ring-slate-100">
                      <div className={`flex items-center justify-center w-7 h-7 text-[11px] font-bold bg-gradient-to-br ${avatarColor.from} ${avatarColor.to} text-white rounded-full shadow-sm`}>
                        {getInitials(contactName)}
                      </div>
                      <span className="text-[13px] font-medium text-slate-700 group-hover/chip:text-slate-900">
                        {contactName}
                      </span>
                    </div>
                  ) : (
                    <input
                      type="email"
                      placeholder="recipient@example.com"
                      value={recipientField}
                      onChange={(e) => setRecipientField(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-[13px] text-slate-700 placeholder-slate-300"
                    />
                  )}
                </div>
              </div>

              {/* Cc Field */}
              <div className="group flex min-h-[56px] border-b border-slate-50 items-center">
                <label className="w-20 text-[13px] font-medium text-slate-400 transition-colors group-hover:text-slate-500">
                  Cc
                </label>
                <input
                  type="text"
                  placeholder="Add recipients"
                  value={ccRecipients}
                  onChange={(e) => setCcRecipients(e.target.value)}
                  className="flex-1 border-none outline-none placeholder-slate-300 focus:ring-0 text-[13px] text-slate-700 bg-transparent h-full"
                />
              </div>

              {/* Subject Field */}
              <div className="group flex min-h-[56px] items-center">
                <label className="w-20 text-[13px] font-medium text-slate-400 transition-colors group-hover:text-slate-500">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter email subject"
                  className="flex-1 p-0 text-[13px] font-medium tracking-tight text-slate-900 bg-transparent border-none outline-none placeholder:font-normal placeholder-slate-300 focus:ring-0"
                />
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex border-b border-slate-100 py-2 px-6 items-center justify-between">
              <div className="flex items-center gap-1">
                {/* Formatting */}
                <button className="w-8 h-8 flex items-center justify-center text-slate-400 transition-all rounded-lg hover:text-slate-700 hover:bg-slate-100">
                  <Icon icon="solar:text-bold-linear" width="15" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center text-slate-400 transition-all rounded-lg hover:text-slate-700 hover:bg-slate-100">
                  <Icon icon="solar:text-italic-linear" width="15" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center text-slate-400 transition-all rounded-lg hover:text-slate-700 hover:bg-slate-100">
                  <Icon icon="solar:text-underline-linear" width="15" />
                </button>

                <div className="w-px h-4 bg-slate-200 mx-1" />

                {/* Attachment */}
                <button className="w-8 h-8 flex items-center justify-center text-slate-400 transition-all rounded-lg hover:text-slate-700 hover:bg-slate-100 outline-none">
                  <Icon icon="solar:paperclip-linear" width="15" />
                </button>

                <div className="w-px h-4 bg-slate-200 mx-1" />

                {/* Presentations Dropdown */}
                <div className="relative" data-dropdown>
                  <button
                    onClick={() => setShowPresentationDropdown(!showPresentationDropdown)}
                    className={`flex items-center gap-1.5 h-8 px-2.5 rounded-lg transition-all text-[12px] font-medium outline-none ${
                      selectedWalkthrough
                        ? 'text-slate-700'
                        : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {selectedWalkthrough ? (
                      <Icon icon="solar:check-circle-bold" width="14" className="text-emerald-500" />
                    ) : (
                      <Icon icon="solar:videocamera-record-linear" width="15" />
                    )}
                    <span>{selectedWalkthrough ? selectedWalkthrough.title : 'Walkthrough'}</span>
                    <Icon
                      icon="solar:alt-arrow-down-linear"
                      width="12"
                      className={`opacity-50 transition-transform ${showPresentationDropdown ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Presentation Dropdown Menu */}
                  {showPresentationDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-[380px] bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 p-1.5 z-50">
                      <div className="px-3 py-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Select Walkthrough
                      </div>
                      {mockPresentations.map((presentation) => (
                        <button
                          key={presentation.id}
                          onClick={() => handleSelectPresentation(presentation)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group ${
                            selectedWalkthrough?.id === presentation.id ? 'bg-slate-50' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex flex-col justify-center overflow-hidden text-left flex-1">
                            <span className={`text-[13px] truncate transition-colors ${
                              selectedWalkthrough?.id === presentation.id ? 'text-slate-900 font-semibold' : 'text-slate-600 group-hover:text-slate-800'
                            }`}>
                              {presentation.title} {presentation.date} at {presentation.time} <span className="text-slate-400 font-normal">({presentation.duration})</span>
                            </span>
                          </div>
                          <Icon
                            icon={selectedWalkthrough?.id === presentation.id ? 'solar:check-circle-bold' : 'solar:add-circle-linear'}
                            width="20"
                            className={`shrink-0 transition-colors ${
                              selectedWalkthrough?.id === presentation.id ? 'text-slate-900' : 'text-slate-300 group-hover:text-slate-700'
                            }`}
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
                className="w-full h-full font-sans text-[14px] leading-[1.8] bg-transparent border-none outline-none resize-none text-slate-600 placeholder-slate-300 focus:ring-0"
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
              onClick={() => {
                setSubject('');
                setEmailBody('');
                setCcRecipients('');
                setRecipientField(contactEmail || '');
                setSourceType('empty');
                setSelectedSourceItem(null);
                setSelectedWalkthrough(null);
                setViewMode('editor');
              }}
              className="text-slate-400 hover:text-red-500 rounded-xl text-[13px] font-medium px-3 py-2 transition-colors flex items-center gap-1.5"
            >
              <Icon icon="solar:trash-bin-trash-linear" width="14" />
              Discard
            </button>

            <div className="flex items-center gap-3">
              <div className="relative" data-dropdown>
                <button
                  onClick={() => setShowScheduleDropdown(!showScheduleDropdown)}
                  className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-slate-500 border border-slate-200 rounded-xl hover:text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all outline-none group"
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
                        <Icon icon="solar:calendar-linear" width="16" className="text-slate-400 group-hover:text-slate-600 transition-colors" />
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
                className={`group relative font-semibold py-2.5 px-5 rounded-xl transition-all duration-300 text-[13px] flex items-center gap-2 overflow-hidden ${
                  sendSuccess
                    ? 'bg-emerald-600 text-white cursor-default'
                    : isSending
                    ? 'bg-slate-800 text-white cursor-wait'
                    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm active:scale-[0.98]'
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
        ) : (
        /* ──────────────────────────────────────────────────────────
           EMAIL PREVIEW — Receiver's POV
           ────────────────────────────────────────────────────────── */
        <div key="preview" className="w-full max-w-5xl pt-6 pb-32 animate-in fade-in duration-200">

          {/* ── Email Client Chrome ── */}
          <div className="rounded-t-2xl bg-gradient-to-b from-slate-100 to-slate-50 border border-slate-200 border-b-0 px-5 py-3.5 flex items-center">
            {/* Traffic lights */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57] shadow-[inset_0_-1px_2px_rgba(0,0,0,0.15)]" />
              <div className="w-3 h-3 rounded-full bg-[#FEBC2E] shadow-[inset_0_-1px_2px_rgba(0,0,0,0.15)]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840] shadow-[inset_0_-1px_2px_rgba(0,0,0,0.15)]" />
            </div>
            {/* Title */}
            <div className="flex-1 text-center">
              <span className="text-[11px] font-medium text-slate-400 tracking-wide">
                Inbox — {contactName || 'Recipient'}
              </span>
            </div>
            {/* Decorative toolbar */}
            <div className="flex items-center gap-2 text-slate-300">
              <Icon icon="solar:archive-minimalistic-linear" width="14" />
              <Icon icon="solar:reply-linear" width="14" />
              <Icon icon="solar:forward-linear" width="14" />
            </div>
          </div>

          {/* ── Email Metadata Bar ── */}
          <div className="bg-slate-50/80 border-x border-slate-200 px-6 py-4 flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-14 shrink-0">From</span>
              <span className="text-[12px] text-slate-600 font-medium">Your Company <span className="text-slate-400 font-normal">&lt;hello@yourcompany.com&gt;</span></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-14 shrink-0">To</span>
              <span className="text-[12px] text-slate-600 font-medium">{contactName || 'Client'} {contactEmail ? <span className="text-slate-400 font-normal">&lt;{contactEmail}&gt;</span> : ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-14 shrink-0">Subject</span>
              <span className="text-[12px] text-slate-700 font-semibold">{subject || 'Your Quotation is Ready'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-14 shrink-0">Date</span>
              <span className="text-[12px] text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>

          {/* ── Email Body Container ── */}
          <div className="rounded-b-2xl bg-white border border-slate-200 border-t border-t-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)]">

            {/* Brand Header */}
            <div className="px-10 pt-10 pb-8">
              <div className="flex justify-center">
                <img src="/northway-logo.png" alt="Logo" className="h-12 object-contain" />
              </div>
            </div>

            {/* Content Card */}
            <div className="mx-24 mb-8 rounded-2xl border border-slate-200/70 bg-gradient-to-b from-white to-slate-50/40 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.02)] overflow-hidden">

              {/* Greeting & Body */}
              {!emailBody.trim() && (sourceType === 'empty' || !selectedSourceItem) ? (
                /* Empty state — no content yet */
                <div className="px-12 py-16 flex flex-col items-center justify-center text-center">
                  <Icon icon="solar:pen-new-square-linear" width="36" className="text-slate-300/60 mb-5" />
                  <h3 style={{ fontFamily: "'DM Serif Text', serif" }} className="text-[20px] text-slate-400 leading-tight mb-2">
                    Your message goes here
                  </h3>
                  <p className="text-[13px] text-slate-400/70">
                    {sourceType === 'empty' ? 'Switch to the editor to start writing' : `Select a ${sourceType} from the dropdown to get started`}
                  </p>
                </div>
              ) : sourceType === 'empty' ? (
                /* Scratch email — render raw text only */
                <div className="px-12 pt-10 pb-8">
                  <p className="text-[14px] leading-[1.85] text-slate-600 whitespace-pre-line">{emailBody}</p>
                </div>
              ) : (() => {
                  const parsed = emailBody ? parseEmailBody(emailBody) : null;
                  return (
                    <div className="px-12 pt-10 pb-8">
                      {/* Greeting */}
                      <h2 style={{ fontFamily: "'DM Serif Text', serif" }} className="text-[24px] text-slate-900 leading-tight mb-6">
                        {parsed?.greetingName ? `Hi ${parsed.greetingName},` : 'Hi Stacy,'}
                      </h2>

                      {/* Body */}
                      {parsed?.content ? (
                        <p className="text-[14px] leading-[1.85] text-slate-600 whitespace-pre-line">{parsed.content}</p>
                      ) : !emailBody ? (
                        <div className="space-y-4">
                          {/* --- Quotation body --- */}
                          {sourceType === 'quote' && (
                            <>
                              <p className="text-[14px] leading-[1.85] text-slate-600">
                                Great speaking with you. I've put together the details we discussed — everything is ready for your review.
                              </p>
                              <p className="text-[14px] leading-[1.85] text-slate-600">
                                You'll find the quotation attached with a clear breakdown of scope and pricing. No hidden lines — what you see is what you get.
                              </p>
                              <p className="text-[14px] leading-[1.85] text-slate-600">
                                There's also a short walkthrough included that covers how the process works end to end. Should save you a few back-and-forths.
                              </p>
                              <p className="text-[14px] leading-[1.85] text-slate-600">
                                Take your time looking through it. I'm around whenever you'd like to chat.
                              </p>
                            </>
                          )}

                          {/* --- Invoice body --- */}
                          {sourceType === 'invoice' && (
                            <>
                              <p className="text-[14px] leading-[1.85] text-slate-600">
                                Thank you for moving forward — it's a pleasure working with you on this.
                              </p>
                              <p className="text-[14px] leading-[1.85] text-slate-600">
                                The invoice is attached with a full breakdown of the agreed scope and terms. Everything is itemized so it's easy to review on your end.
                              </p>
                              <p className="text-[14px] leading-[1.85] text-slate-600">
                                Feel free to reach out if you'd like to walk through any of the details together.
                              </p>
                              <p className="text-[14px] leading-[1.85] text-slate-600">
                                If anything needs adjusting, just let me know — happy to sort it out.
                              </p>
                            </>
                          )}
                        </div>
                      ) : null}

                      {/* Signature */}
                      <div className="mt-8 text-[14px] leading-[1.85] text-slate-600">
                        <p>{parsed?.signOff || 'Warm regards,'}</p>
                        <p className="font-semibold text-slate-800 mt-1">{parsed?.sigName || 'John Mitchell'}</p>
                        <p className="text-[12px] text-slate-400 mt-0.5">{parsed?.sigCompany || 'Northway Creative Media'}</p>
                      </div>
                    </div>
                  );
                })()
              }


              {/* CTA Buttons */}
              {sourceType !== 'empty' && selectedSourceItem && (
              <div className="px-12 pt-2 pb-10 flex items-center justify-center gap-3">
                <button className="bg-slate-900 hover:bg-slate-800 text-white text-[13px] font-semibold px-6 py-3 rounded-xl shadow-[0_4px_16px_-4px_rgba(15,23,42,0.3)] transition-all flex items-center gap-2 group">
                  <Icon
                    icon={sourceType === 'quote' ? 'solar:document-text-linear' : sourceType === 'invoice' ? 'solar:bill-list-linear' : 'solar:document-linear'}
                    width="16"
                  />
                  <span>{sourceType === 'invoice' ? 'View Invoice' : 'View Quotation'}</span>
                  <Icon icon="solar:arrow-right-linear" width="14" className="group-hover:translate-x-0.5 transition-transform" />
                </button>
                {selectedWalkthrough && (
                <button className="border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 hover:text-slate-800 text-[13px] font-medium px-6 py-3 rounded-xl transition-all flex items-center gap-2 group">
                  <Icon icon="solar:play-circle-linear" width="16" className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                  <span>See Detailed Walkthrough</span>
                </button>
                )}
              </div>
              )}
            </div>

            {/* Professional Footer */}
            <div className="px-10 pt-6 pb-6 text-center">
              <div className="flex justify-center mb-5">
                <img src="/northway-logo.png" alt="Logo" className="h-8 object-contain opacity-30 grayscale" />
              </div>
              <div className="mt-4 space-y-1.5">
                <p className="text-[10px] text-slate-300 leading-relaxed">
                  Sent with care. We value every conversation.
                </p>
                <p className="text-[10px] text-slate-300 mt-3">
                  © 2026 Northway Creative Media. All rights reserved.
                </p>
              </div>
            </div>
          </div>

        </div>
        )}
      </div>

      {showSuccessOverlay && (
        <div className="fixed inset-0 bg-slate-900/5 backdrop-blur-sm z-[45] animate-in fade-in duration-300" />
      )}
    </div>
  );
}
