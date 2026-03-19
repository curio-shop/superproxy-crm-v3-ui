import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Phone, Clock, TrendingUp, TrendingDown, Minus, ChevronRight, LayoutGrid, List } from 'lucide-react';

export interface CallHistoryRecord {
  id: string;
  contact_id: string;
  user_name: string;
  duration: number;
  notes: string;
  transcript: string;
  sentiment: string;
  outcome: string;
  next_action: string;
  call_type: 'cold_call' | 'follow_up' | 're_engagement' | 'payment_reminder' | 'deal_closing';
  created_at: string;
  contact: {
    name: string;
    initials: string;
    company_name: string;
    avatar_color: string;
  };
}

interface CallHistoryProps {
  contactId?: string;
  onViewCall?: (call: CallHistoryRecord) => void;
  onBack?: () => void;
}

const mockCallHistory: CallHistoryRecord[] = [
  {
    id: '1',
    contact_id: '1',
    user_name: 'Ivan Gonzales',
    duration: 245,
    notes: 'Discussed upcoming prefab container project. Client interested in smart office containers with modern amenities.',
    transcript: 'Let: Hi, this is Let from VCC Construction.\n\nMe: Hi Let, thanks for taking my call. I wanted to discuss your upcoming project needs.\n\nLet: Sure, we\'re actually looking at prefab solutions for our new office expansion.\n\nMe: Great! Our smart prefab containers might be perfect. They come with modern amenities and can be customized.\n\nLet: That sounds interesting. What kind of customization options do you offer?\n\nMe: We can customize everything from interior layouts to electrical systems, HVAC, insulation, and even smart building features.\n\nLet: Smart building features? Tell me more about that.\n\nMe: We can integrate IoT sensors, automated climate control, smart lighting, and energy monitoring systems. It helps reduce operating costs significantly.\n\nLet: That\'s exactly what we need. We\'re trying to reduce our carbon footprint. Do you have any sustainability certifications?\n\nMe: Absolutely. All our containers meet LEED standards and we use eco-friendly materials. We also offer solar panel integration.\n\nLet: Perfect. What about the timeline? We need these ready in about 3 months.\n\nMe: Three months is definitely achievable. Our typical lead time is 8-10 weeks for custom builds.\n\nLet: And what\'s the size range you work with?\n\nMe: We offer everything from 20-foot to 40-foot containers. We can also combine multiple units for larger spaces.\n\nLet: We\'re thinking about 5 units for different departments. What would the pricing look like for that?\n\nMe: For a bulk order of 5 units with smart features, we\'re looking at roughly $45,000-$60,000 per unit depending on the specs.\n\nLet: That\'s within our budget. Do you handle installation and setup as well?\n\nMe: Yes, we provide full turnkey service including site preparation, delivery, installation, and testing.\n\nLet: Excellent. Can you send me more details?\n\nMe: Absolutely, I\'ll email you our catalog, pricing breakdown, and some case studies from similar projects today.',
    sentiment: 'positive',
    outcome: 'interested',
    next_action: 'Send detailed product catalog and pricing by end of day',
    call_type: 'cold_call',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    contact: {
      name: 'Let Cruz',
      initials: 'LC',
      company_name: 'VCC Construction',
      avatar_color: 'blue'
    }
  },
  {
    id: '2',
    contact_id: '2',
    user_name: 'Ivan Gonzales',
    duration: 180,
    notes: 'Attempted follow-up call regarding quote modifications. No answer - left voicemail.',
    transcript: '',
    sentiment: 'neutral',
    outcome: 'no_answer',
    next_action: 'Retry call tomorrow or send email with revised quote',
    call_type: 'follow_up',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    contact: {
      name: 'Hailey Collins',
      initials: 'HC',
      company_name: 'Notion',
      avatar_color: 'pink'
    }
  },
  {
    id: '3',
    contact_id: '3',
    user_name: 'Ivan Gonzales',
    duration: 420,
    notes: 'Detailed discussion about aerospace-grade container requirements. Very promising lead.',
    transcript: 'Wang: We need specialized containers for our facilities.\n\nMe: I understand SpaceX has unique requirements. Can you tell me more?\n\nWang: We need containers that can withstand extreme conditions and have specific certifications.\n\nMe: We can definitely customize for those specs. Let me connect you with our engineering team.\n\nWang: Perfect. We\'re looking to place an order soon.\n\nMe: Excellent. I\'ll arrange a technical consultation this week.',
    sentiment: 'positive',
    outcome: 'interested',
    next_action: 'Schedule technical consultation with engineering team',
    call_type: 'deal_closing',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    contact: {
      name: 'Wang Wen',
      initials: 'WW',
      company_name: 'SpaceX',
      avatar_color: 'amber'
    }
  },
  {
    id: '4',
    contact_id: '4',
    user_name: 'Ivan Gonzales',
    duration: 95,
    notes: 'Brief intro call. Client not ready to proceed at this time.',
    transcript: 'Khim: Thanks for calling.\n\nMe: I wanted to introduce our prefab container solutions.\n\nKhim: We\'re not in the market right now.\n\nMe: I understand. Can I follow up in a few months?\n\nKhim: Sure, that works.',
    sentiment: 'neutral',
    outcome: 'not_interested',
    next_action: 'Follow up in 3 months',
    call_type: 're_engagement',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    contact: {
      name: 'Khim Tanglao',
      initials: 'KT',
      company_name: '',
      avatar_color: 'slate'
    }
  },
  {
    id: '5',
    contact_id: '5',
    user_name: 'Ivan Gonzales',
    duration: 315,
    notes: 'Discussed bulk order for retail locations. Strong interest in multiple units.',
    transcript: 'Mac: We\'re expanding our retail footprint.\n\nMe: How can our container solutions help?\n\nMac: We need temporary retail spaces at multiple locations.\n\nMe: Our modular containers are perfect for that. We can customize them with your branding.\n\nMac: Great! We\'d need about 12 units.\n\nMe: Perfect. Let me prepare a bulk pricing proposal for you.',
    sentiment: 'positive',
    outcome: 'interested',
    next_action: 'Prepare bulk pricing proposal for 12 units',
    call_type: 'cold_call',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    contact: {
      name: 'Mac Mill',
      initials: 'MM',
      company_name: 'Apple',
      avatar_color: 'emerald'
    }
  },
  {
    id: '6',
    contact_id: '6',
    user_name: 'Ivan Gonzales',
    duration: 135,
    notes: 'Initial contact. Client interested in learning more about our products.',
    transcript: 'Micaela: Hello?\n\nMe: Hi Micaela, I\'m calling about prefab container solutions.\n\nMicaela: Oh, we might be interested. Tell me more.\n\nMe: We offer customizable containers for various uses - offices, storage, retail.\n\nMicaela: Can you email me some information?\n\nMe: Absolutely, I\'ll send that right away.',
    sentiment: 'neutral',
    outcome: 'follow_up',
    next_action: 'Send product information and follow up next week',
    call_type: 'payment_reminder',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    contact: {
      name: 'Micaela Pena',
      initials: 'MP',
      company_name: '',
      avatar_color: 'slate'
    }
  },
];

type CallFilter = 'all' | 'cold_call' | 'follow_up' | 'payment_reminder';

const CALL_FILTERS: { value: CallFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'cold_call', label: 'Cold Calls' },
  { value: 'follow_up', label: 'Follow-ups' },
  { value: 'payment_reminder', label: 'Reminders' },
];

export default function CallHistory({ contactId, onViewCall }: CallHistoryProps) {
  const [viewType, setViewType] = useState<'card' | 'list'>('card');
  const [callFilter, setCallFilter] = useState<CallFilter>('all');

  const filteredByContact = contactId
    ? mockCallHistory.filter(call => call.contact_id === contactId)
    : mockCallHistory;

  const calls = callFilter === 'all'
    ? filteredByContact
    : filteredByContact.filter(call => call.call_type === callFilter);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else if (diffInHours < 168) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-rose-600" />;
      default:
        return <Minus className="w-4 h-4 text-slate-400" />;
    }
  };

  const getOutcomeBadge = (outcome: string) => {
    const badges: Record<string, { label: string; color: string }> = {
      interested: { label: 'Interested', color: 'bg-purple-50 text-purple-600' },
      follow_up: { label: 'Follow Up', color: 'bg-amber-50 text-amber-600' },
      not_interested: { label: 'Not Interested', color: 'bg-slate-100 text-slate-500' },
      no_answer: { label: 'Missed', color: 'bg-rose-50 text-rose-600' },
      completed: { label: 'Completed', color: 'bg-emerald-50 text-emerald-600' },
    };

    const badge = badges[outcome] || badges.completed;
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  const getCallTypeLabel = (callType: string) => {
    const labels: Record<string, string> = {
      cold_call: 'AI Cold Call',
      follow_up: 'Follow Up Call',
      re_engagement: 'Re-engagement',
      payment_reminder: 'AI Reminder Call',
      quote_follow_up: 'AI Follow-Up Call',
      deal_closing: 'Deal Closing',
    };

    return labels[callType] || 'Outbound';
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      <div className="w-full mx-auto px-6 py-6">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Toolbar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                {CALL_FILTERS.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setCallFilter(filter.value)}
                    className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                      callFilter === filter.value
                        ? 'bg-white text-slate-700 shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-slate-400">{calls.length} calls</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
              <button
                onClick={() => setViewType('card')}
                className={`p-1.5 rounded-md transition-all ${viewType === 'card' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Icon icon="solar:widget-4-linear" width="14" />
              </button>
              <button
                onClick={() => setViewType('list')}
                className={`p-1.5 rounded-md transition-all ${viewType === 'list' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Icon icon="solar:list-linear" width="14" />
              </button>
            </div>
          </div>

          {calls.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
                <Icon icon="solar:phone-linear" width="22" className="text-slate-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-700 mb-1">No calls yet</h3>
              <p className="text-[13px] text-slate-400 text-center max-w-sm">
                {contactId
                  ? 'Start calling this contact to see call history here.'
                  : 'Your call history will appear here once you start making calls.'}
              </p>
            </div>
          ) : viewType === 'card' ? (
            <div className="max-w-4xl mx-auto space-y-2">
              {calls.map((call) => (
                <div
                  key={call.id}
                  className="group bg-white rounded-xl p-4 border border-slate-200/60 hover:border-slate-300 hover:shadow-sm transition-all duration-150 cursor-pointer"
                  onClick={() => onViewCall?.(call)}
                >
                  <div className="flex items-start justify-between gap-4 mb-2.5">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[13px] font-semibold text-slate-800 truncate">{call.contact.name}</h3>
                        {call.contact.company_name && (
                          <span className="text-[11px] text-slate-400 truncate">{call.contact.company_name}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {getSentimentIcon(call.sentiment)}
                      <span className="text-[11px] text-slate-400">{formatDate(call.created_at)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="text-[11px] font-medium text-slate-500">{formatDuration(call.duration)}</span>
                    <span className="text-slate-300">·</span>
                    {getOutcomeBadge(call.outcome)}
                    <span className="text-slate-300">·</span>
                    <span className="text-[11px] text-slate-400">{getCallTypeLabel(call.call_type)}</span>
                  </div>

                  {call.notes && (
                    <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2 mb-3">{call.notes}</p>
                  )}

                  {call.next_action && (
                    <div className="border-l-2 border-slate-200 pl-3 py-1">
                      <p className="text-[11px] font-medium text-slate-400 mb-0.5">Next action</p>
                      <p className="text-[13px] text-slate-600 leading-relaxed">{call.next_action}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead>
                    <tr className="text-left text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                      <th className="pl-5 pr-6 py-3 w-[16%]">Contact</th>
                      <th className="px-5 py-3 w-[10%]">Type</th>
                      <th className="px-5 py-3 w-[10%]">Duration</th>
                      <th className="px-5 py-3 w-[12%]">Outcome</th>
                      <th className="px-5 py-3 w-[12%]">Sentiment</th>
                      <th className="px-5 py-3 w-[20%]">Notes</th>
                      <th className="px-5 py-3 w-[12%]">Date</th>
                      <th className="px-3 py-3 w-[8%]"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {calls.map((call) => (
                      <tr
                        key={call.id}
                        className="hover:bg-slate-50/60 transition-colors cursor-pointer"
                        onClick={() => onViewCall?.(call)}
                      >
                        <td className="pl-5 pr-6 py-3 whitespace-nowrap">
                          <div className="min-w-0">
                            <div className="text-[13px] font-medium text-slate-700 truncate">{call.contact.name}</div>
                            {call.contact.company_name && (
                              <div className="text-[11px] text-slate-400 truncate">{call.contact.company_name}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap">
                          <span className="text-[11px] text-slate-500">{getCallTypeLabel(call.call_type)}</span>
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap">
                          <span className="text-[11px] font-medium text-slate-600">{formatDuration(call.duration)}</span>
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap">{getOutcomeBadge(call.outcome)}</td>
                        <td className="px-5 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            {getSentimentIcon(call.sentiment)}
                            <span className="text-[11px] text-slate-500 capitalize">{call.sentiment}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          {call.notes ? (
                            <p className="text-[11px] text-slate-500 truncate">{call.notes}</p>
                          ) : (
                            <span className="text-[11px] text-slate-300">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap">
                          <span className="text-[11px] text-slate-400">{formatDate(call.created_at)}</span>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <button
                            onClick={(e) => { e.stopPropagation(); onViewCall?.(call); }}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                          >
                            <Icon icon="solar:arrow-right-up-linear" width="14" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex border-t border-slate-100 py-3 px-4 items-center justify-between">
                <span className="text-[11px] text-slate-400">Showing 1–{calls.length} of {calls.length}</span>
                <div className="flex items-center gap-1.5">
                  <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded-lg text-slate-300 transition-colors" disabled>
                    <Icon icon="solar:alt-arrow-left-linear" width="14" />
                  </button>
                  <button className="px-2.5 h-7 bg-slate-900 rounded-lg text-[11px] font-semibold text-white">1</button>
                  <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded-lg text-slate-300 transition-colors" disabled>
                    <Icon icon="solar:alt-arrow-right-linear" width="14" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
