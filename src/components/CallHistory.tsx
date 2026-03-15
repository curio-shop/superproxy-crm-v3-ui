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

export default function CallHistory({ contactId, onViewCall }: CallHistoryProps) {
  const [viewType, setViewType] = useState<'card' | 'list'>('card');

  const calls = contactId
    ? mockCallHistory.filter(call => call.contact_id === contactId)
    : mockCallHistory;

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
      interested: { label: 'Interested', color: 'bg-purple-50 text-purple-700 border-purple-200' },
      follow_up: { label: 'Follow Up', color: 'bg-amber-50 text-amber-700 border-amber-200' },
      not_interested: { label: 'Not Interested', color: 'bg-slate-50 text-slate-600 border-slate-200' },
      no_answer: { label: 'Missed Call', color: 'bg-rose-50 text-rose-700 border-rose-200' },
      completed: { label: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    };

    const badge = badges[outcome] || badges.completed;
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${badge.color}`}>
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
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Phone className="w-4 h-4" />
              <span className="font-medium">{calls.length} outbound calls</span>
            </div>

            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewType('card')}
                className={`p-1.5 rounded transition-all ${
                  viewType === 'card' ? 'bg-slate-100 text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewType('list')}
                className={`p-1.5 rounded transition-all ${
                  viewType === 'list' ? 'bg-slate-100 text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {calls.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-5 shadow-inner">
                <Phone className="w-9 h-9 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No calls yet</h3>
              <p className="text-sm text-slate-500 text-center max-w-md leading-relaxed">
                {contactId
                  ? 'Start calling this contact to see call history here.'
                  : 'Your call history will appear here once you start making calls.'}
              </p>
            </div>
          ) : viewType === 'card' ? (
            <div className="max-w-5xl mx-auto space-y-4">
              {calls.map((call) => (
                <div
                  key={call.id}
                  className="group bg-white rounded-2xl p-6 border border-slate-200/60 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-200 cursor-pointer"
                  onClick={() => onViewCall?.(call)}
                >
                  <div className="flex items-start gap-5">
                    <div
                      className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${
                        call.contact.avatar_color === 'blue'
                          ? 'from-blue-400 to-blue-600'
                          : call.contact.avatar_color === 'pink'
                          ? 'from-pink-400 to-pink-600'
                          : call.contact.avatar_color === 'amber'
                          ? 'from-amber-400 to-amber-600'
                          : call.contact.avatar_color === 'emerald'
                          ? 'from-emerald-400 to-emerald-600'
                          : 'from-slate-400 to-slate-600'
                      } flex items-center justify-center text-white font-bold text-base shadow-lg ring-4 ring-white`}
                    >
                      {call.contact.initials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-slate-900 truncate mb-1">
                            {call.contact.name}
                          </h3>
                          {call.contact.company_name && (
                            <p className="text-sm font-medium text-slate-500 truncate">{call.contact.company_name}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2.5 flex-shrink-0">
                          {getSentimentIcon(call.sentiment)}
                          <span className="text-sm font-medium text-slate-500">{formatDate(call.created_at)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 mb-4 flex-wrap">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200/80">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span className="text-xs font-semibold text-slate-700">{formatDuration(call.duration)}</span>
                        </div>
                        {getOutcomeBadge(call.outcome)}
                        <span className="text-xs font-medium text-slate-500 px-2.5 py-1.5 bg-slate-50 rounded-lg border border-slate-200/80">
                          {getCallTypeLabel(call.call_type)}
                        </span>
                      </div>

                      {call.notes && (
                        <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-4">{call.notes}</p>
                      )}

                      {call.next_action && (
                        <div className="flex items-start gap-3 p-4 bg-blue-50/80 rounded-xl border border-blue-200/60">
                          <Icon icon="solar:checklist-minimalistic-bold" className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-blue-900 mb-1">Next Action</p>
                            <p className="text-sm text-blue-700 leading-relaxed">{call.next_action}</p>
                          </div>
                        </div>
                      )}

                      {call.transcript && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewCall?.(call);
                          }}
                          className="mt-4 flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors group-hover:gap-3"
                        >
                          <Icon icon="solar:document-text-bold" className="w-4 h-4" />
                          View Details
                          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 shadow-slate-200/20 overflow-hidden flex flex-col bg-white/50 border-white/60 border rounded-[24px] relative shadow-xl">
              <div className="overflow-x-auto flex-1 custom-scrollbar">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50/80">
                    <tr className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th scope="col" className="px-6 py-4">
                        Contact
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Call Type
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Duration
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Outcome
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Sentiment
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Notes
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-4 w-16">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {calls.map((call) => {
                      const avatarColors = {
                        blue: { bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-100' },
                        pink: { bg: 'bg-pink-50', text: 'text-pink-600', ring: 'ring-pink-100' },
                        amber: { bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-100' },
                        emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-100' },
                        slate: { bg: 'bg-slate-100', text: 'text-slate-600', ring: 'ring-slate-200' },
                      };
                      const avatarStyle = avatarColors[call.contact.avatar_color as keyof typeof avatarColors] || avatarColors.slate;

                      return (
                        <tr
                          key={call.id}
                          className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                          onClick={() => onViewCall?.(call)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div
                                className={`h-9 w-9 rounded-full ${avatarStyle.bg} ${avatarStyle.text} flex items-center justify-center text-xs font-semibold ring-2 ${avatarStyle.ring} shadow-sm group-hover:shadow-md transition-shadow`}
                              >
                                {call.contact.initials}
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-semibold text-slate-900 truncate">
                                  {call.contact.name}
                                </div>
                                {call.contact.company_name && (
                                  <div className="text-xs text-slate-500 truncate">
                                    {call.contact.company_name}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-xs font-medium text-slate-700">
                              {getCallTypeLabel(call.call_type)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-xs font-medium text-slate-700">
                                {formatDuration(call.duration)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getOutcomeBadge(call.outcome)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {getSentimentIcon(call.sentiment)}
                              <span className="text-xs font-medium text-slate-600 capitalize">
                                {call.sentiment}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 max-w-xs">
                            {call.notes ? (
                              <p className="text-xs text-slate-600 truncate">
                                {call.notes}
                              </p>
                            ) : (
                              <span className="text-sm text-slate-300">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-xs text-slate-600">
                              {formatDate(call.created_at)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewCall?.(call);
                              }}
                              className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 hover:ring-1 hover:ring-slate-200 transition-all focus:outline-none"
                            >
                              <Icon icon="solar:eye-linear" width="16" />
                            </button>
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
                    1-{calls.length}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">of</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                    {calls.length}
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
                    className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all"
                    disabled
                  >
                    <Icon icon="solar:alt-arrow-right-linear" width="16" />
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
