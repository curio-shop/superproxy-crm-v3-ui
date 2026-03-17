import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { supabase } from '../lib/supabase';

interface EmailHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onComposeEmail?: (recipient: { name: string; email: string }) => void;
  contactEmail?: string;
  contactName?: string;
}

interface EmailHistoryItem {
  id: string;
  recipient: string;
  recipientEmail: string;
  subject: string;
  type: 'quote' | 'invoice' | 'custom';
  reference?: string;
  amount?: string;
  date: string;
  time: string;
  status: 'sent' | 'opened' | 'replied';
  preview: string;
  body: string;
  ccRecipients?: string[];
  attachmentName?: string;
  attachmentSize?: string;
  deliveredAt?: string;
}

const mockEmailHistory: EmailHistoryItem[] = [
  {
    id: '1',
    recipient: 'Let Cruz',
    recipientEmail: 'vcc.letcruz@myyahoo.com',
    subject: 'Quote for Berkshire Stadium Project',
    type: 'quote',
    reference: 'Q-2024',
    amount: '$3,810.00',
    date: 'Jan 15, 2026',
    time: '2:34 PM',
    status: 'opened',
    preview: 'Hi Let, Please find attached the quote for the Berkshire Stadium Project. Looking forward to your feedback...',
    body: `Hi Let,

I hope this email finds you well.

I wanted to follow up on our conversation from last week regarding the Berkshire Stadium Project. As discussed, I've prepared a comprehensive quote that outlines all the details of the project scope, timeline, and associated costs.

The quote includes:
• Complete structural analysis and assessment
• Material procurement and logistics
• Installation and construction services
• Quality assurance and final inspection
• 2-year warranty on all work completed

Our team has extensive experience with stadium projects of this scale, and we're confident we can deliver exceptional results within your timeline. The total project cost comes to $3,810.00, which includes all materials, labor, and project management.

I've attached the detailed quote (Q-2024) to this email for your review. Please take your time going through it, and feel free to reach out if you have any questions or need clarification on any aspect of the proposal.

We're excited about the possibility of working with you on this project and look forward to your feedback.

Best regards,
John Anderson`,
    attachmentName: 'Quote_Q-2024_Berkshire_Stadium.pdf',
    attachmentSize: '245 KB',
    deliveredAt: 'Jan 15, 2026 at 2:35 PM'
  },
  {
    id: '2',
    recipient: 'Hailey Collins',
    recipientEmail: 'hailey@riggedparts.com',
    subject: 'Following up on our conversation',
    type: 'custom',
    date: 'Jan 14, 2026',
    time: '11:22 AM',
    status: 'replied',
    preview: 'Hi Hailey, Thanks for taking the time to speak with me yesterday. I wanted to follow up on the points we discussed...',
    body: `Hi Hailey,

Thanks for taking the time to speak with me yesterday. It was great to connect and learn more about your current projects and future plans.

I wanted to follow up on the points we discussed regarding:

1. The upcoming infrastructure upgrade you mentioned for Q2 2026
2. Your interest in exploring more sustainable materials
3. Potential partnership opportunities for the new developments

Based on our conversation, I think there are several ways we could work together to achieve your goals while staying within budget constraints. I'd love to schedule a follow-up meeting next week to dive deeper into the specifics.

Would Tuesday or Thursday afternoon work for your schedule? I'm flexible and happy to work around your availability.

Looking forward to continuing our conversation!

Best regards,
John Anderson`,
    deliveredAt: 'Jan 14, 2026 at 11:23 AM'
  },
  {
    id: '3',
    recipient: 'Wang Wen',
    recipientEmail: 'melwyn.arrubio@yahoo.com',
    subject: 'Invoice for Downtown Office Renovation',
    type: 'invoice',
    reference: 'INV-1023',
    amount: '$12,450.00',
    date: 'Jan 13, 2026',
    time: '4:18 PM',
    status: 'opened',
    preview: 'Hi Wang, Please find attached invoice #INV-1023 for the completed Downtown Office Renovation project...',
    body: `Hi Wang,

I hope you're doing well!

Please find attached invoice #INV-1023 for the completed Downtown Office Renovation project. We're thrilled with how everything turned out, and I hope you're just as pleased with the final results.

Invoice Summary:
• Invoice Number: INV-1023
• Project: Downtown Office Renovation
• Total Amount: $12,450.00
• Payment Terms: Net 30 days
• Due Date: February 12, 2026

The invoice includes all agreed-upon services:
• Demolition and preparation work
• Electrical system upgrades
• Flooring installation
• Paint and finishing touches
• Final inspection and cleanup

Payment can be made via bank transfer or check. All payment details are included in the attached invoice.

Thank you for choosing us for this project. It was a pleasure working with you, and we look forward to future opportunities to collaborate.

If you have any questions about the invoice or need any clarification, please don't hesitate to reach out.

Best regards,
John Anderson`,
    attachmentName: 'Invoice_INV-1023.pdf',
    attachmentSize: '198 KB',
    deliveredAt: 'Jan 13, 2026 at 4:19 PM'
  },
  {
    id: '4',
    recipient: 'Khim Tanglao',
    recipientEmail: 'metriccon.purchasing@gmail.com',
    subject: 'Thank you for your business',
    type: 'custom',
    date: 'Jan 12, 2026',
    time: '9:45 AM',
    status: 'opened',
    preview: 'Hi Khim, I wanted to reach out and thank you for choosing us for your recent project. Your satisfaction is our priority...',
    body: `Hi Khim,

I wanted to reach out and thank you for choosing us for your recent project. Your satisfaction is our top priority, and we're grateful for the trust you've placed in our team.

Working with MetricCon has been an absolute pleasure, and we truly appreciate the opportunity to contribute to your success. Your professionalism and clear communication throughout the project made everything run smoothly.

If there's anything we can do to improve your experience or if you have any feedback, please don't hesitate to share. We're always looking for ways to serve our clients better.

We look forward to working with you again in the future!

Warm regards,
John Anderson`,
    deliveredAt: 'Jan 12, 2026 at 9:46 AM'
  },
  {
    id: '5',
    recipient: 'Mac Mill',
    recipientEmail: 'mac@m.gom',
    subject: 'Quote for Harbor View Apartments',
    type: 'quote',
    reference: 'Q-2022',
    amount: '$8,200.00',
    date: 'Jan 10, 2026',
    time: '3:12 PM',
    status: 'sent',
    preview: 'Hi Mac, As discussed, I have prepared a comprehensive quote for the Harbor View Apartments project...',
    body: `Hi Mac,

As discussed in our recent meeting, I have prepared a comprehensive quote for the Harbor View Apartments project.

This proposal covers all aspects we reviewed, including materials, labor, and timeline considerations. Our team is excited about this opportunity and confident we can deliver exceptional results.

Please review the attached quote at your convenience. I'm available to discuss any questions or modifications you might need.

Best regards,
John Anderson`,
    attachmentName: 'Quote_Q-2022_Harbor_View.pdf',
    attachmentSize: '187 KB',
    deliveredAt: 'Jan 10, 2026 at 3:13 PM'
  },
  {
    id: '6',
    recipient: 'Micaela Pena',
    recipientEmail: 'micaela.pena@gmail.com',
    subject: 'Invoice for Tech Campus Phase 2',
    type: 'invoice',
    reference: 'INV-1021',
    amount: '$18,900.00',
    date: 'Jan 8, 2026',
    time: '1:55 PM',
    status: 'opened',
    preview: 'Hi Micaela, Attached is the invoice for Tech Campus Phase 2. Payment terms are net 30 days...',
    body: `Hi Micaela,

Attached is the invoice for Tech Campus Phase 2. Payment terms are net 30 days from the invoice date.

Thank you for your continued partnership!

Best regards,
John Anderson`,
    attachmentName: 'Invoice_INV-1021.pdf',
    attachmentSize: '203 KB',
    deliveredAt: 'Jan 8, 2026 at 1:56 PM'
  },
  {
    id: '7',
    recipient: 'Let Cruz',
    recipientEmail: 'vcc.letcruz@myyahoo.com',
    subject: 'Project timeline and next steps',
    type: 'custom',
    date: 'Jan 6, 2026',
    time: '10:30 AM',
    status: 'replied',
    preview: 'Hi Let, I wanted to outline the project timeline and next steps for the upcoming construction phase...',
    body: `Hi Let,

I wanted to outline the project timeline and next steps for the upcoming construction phase. Here's what we're looking at:

Week 1-2: Site preparation and permits
Week 3-4: Foundation work
Week 5-8: Main construction
Week 9-10: Finishing and inspection

Let me know if you have any questions about the schedule!

Best regards,
John Anderson`,
    deliveredAt: 'Jan 6, 2026 at 10:31 AM'
  },
  {
    id: '8',
    recipient: 'Gillian Guiang',
    recipientEmail: 'gillian@designstudio.com',
    subject: 'Quote for Riverside Mall Expansion',
    type: 'quote',
    reference: 'Q-2020',
    amount: '$15,780.00',
    date: 'Jan 4, 2026',
    time: '2:08 PM',
    status: 'sent',
    preview: 'Hi Gillian, Please review the attached quote for the Riverside Mall Expansion project. All specifications are included...',
    body: `Hi Gillian,

Please review the attached quote for the Riverside Mall Expansion project. All specifications are included per your requirements.

I'm available to discuss any details or adjustments you might need.

Best regards,
John Anderson`,
    attachmentName: 'Quote_Q-2020_Riverside_Mall.pdf',
    attachmentSize: '312 KB',
    deliveredAt: 'Jan 4, 2026 at 2:09 PM'
  },
  {
    id: '9',
    recipient: 'Hailey Collins',
    recipientEmail: 'hailey@riggedparts.com',
    subject: 'Invoice for City Park Infrastructure',
    type: 'invoice',
    reference: 'INV-1020',
    amount: '$31,250.00',
    date: 'Jan 2, 2026',
    time: '11:14 AM',
    status: 'opened',
    preview: 'Hi Hailey, Please find the invoice for the City Park Infrastructure project. Thank you for your continued partnership...',
    body: `Hi Hailey,

Please find the invoice for the City Park Infrastructure project. Thank you for your continued partnership and trust in our services.

Looking forward to our next collaboration!

Best regards,
John Anderson`,
    attachmentName: 'Invoice_INV-1020.pdf',
    attachmentSize: '221 KB',
    deliveredAt: 'Jan 2, 2026 at 11:15 AM'
  },
  {
    id: '10',
    recipient: 'Wang Wen',
    recipientEmail: 'melwyn.arrubio@yahoo.com',
    subject: 'Proposal for Q1 2026 collaboration',
    type: 'custom',
    date: 'Dec 28, 2025',
    time: '4:42 PM',
    status: 'sent',
    preview: 'Hi Wang, As we approach the new year, I wanted to discuss potential collaboration opportunities for Q1 2026...',
    body: `Hi Wang,

As we approach the new year, I wanted to discuss potential collaboration opportunities for Q1 2026.

I believe there are several exciting projects where our expertise could add value to your operations. Would you be available for a call in early January to explore these possibilities?

Wishing you a wonderful holiday season!

Best regards,
John Anderson`,
    deliveredAt: 'Dec 28, 2025 at 4:43 PM'
  }
];

export default function EmailHistoryDrawer({ isOpen, onClose, onComposeEmail, contactEmail, contactName }: EmailHistoryDrawerProps) {
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [emailHistory, setEmailHistory] = useState<EmailHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Reset state when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedEmailId(null);
      setEmailHistory([]);
      setIsLoading(false);
    }
  }, [isOpen]);

  // Fetch email history when drawer opens
  useEffect(() => {
    if (isOpen && contactEmail) {
      fetchEmailHistory();
    }
  }, [isOpen, contactEmail, contactName]);

  const fetchEmailHistory = async () => {
    if (!contactEmail) {
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('email_history')
        .select('*')
        .eq('recipient_email', contactEmail)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedEmails: EmailHistoryItem[] = (data || []).map((email) => ({
        id: email.id,
        recipient: email.recipient_name,
        recipientEmail: email.recipient_email,
        subject: email.subject,
        type: (email.reference_type || 'custom') as 'quote' | 'invoice' | 'custom',
        reference: email.reference_name || undefined,
        amount: undefined,
        date: new Date(email.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: new Date(email.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        status: (email.status || 'sent') as 'sent' | 'opened' | 'replied',
        preview: email.body.slice(0, 100) + '...',
        body: email.body,
        ccRecipients: email.cc_recipients,
        attachmentName: email.attachment_name,
        attachmentSize: email.attachment_size,
        deliveredAt: email.delivered_at ? new Date(email.delivered_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : undefined,
      }));

      setEmailHistory(formattedEmails);
    } catch (error) {
      setEmailHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const selectedEmail = selectedEmailId ? emailHistory.find(e => e.id === selectedEmailId) : null;
  const currentIndex = selectedEmailId ? emailHistory.findIndex(e => e.id === selectedEmailId) : -1;

  const handleNavigateEmail = (direction: 'prev' | 'next') => {
    if (currentIndex === -1) return;

    if (direction === 'prev' && currentIndex > 0) {
      setSelectedEmailId(emailHistory[currentIndex - 1].id);
    } else if (direction === 'next' && currentIndex < emailHistory.length - 1) {
      setSelectedEmailId(emailHistory[currentIndex + 1].id);
    }
  };

  const handleCloseDetail = () => {
    setSelectedEmailId(null);
  };

  const getTypeStyles = (type: string) => {
    const styles = {
      quote: { bg: 'bg-gradient-to-br from-blue-50 to-blue-100/50', text: 'text-blue-700', border: 'border-blue-200/60', icon: 'solar:document-text-linear' },
      invoice: { bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100/50', text: 'text-emerald-700', border: 'border-emerald-200/60', icon: 'solar:bill-list-linear' },
      custom: { bg: 'bg-gradient-to-br from-amber-50 to-amber-100/50', text: 'text-amber-700', border: 'border-amber-200/60', icon: 'solar:letter-linear' },
    };
    return styles[type as keyof typeof styles];
  };

  const getStatusStyles = (status: string) => {
    const styles = {
      sent: { bg: 'bg-gradient-to-br from-slate-100 to-slate-200/50', text: 'text-slate-600', dot: 'bg-slate-500' },
      opened: { bg: 'bg-gradient-to-br from-blue-100 to-blue-200/50', text: 'text-blue-700', dot: 'bg-blue-500' },
      replied: { bg: 'bg-gradient-to-br from-emerald-100 to-emerald-200/50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    };
    return styles[status as keyof typeof styles];
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const avatarColorMap: Record<string, { bg: string; text: string }> = {
      'Let Cruz': { bg: 'bg-blue-50', text: 'text-blue-600' },
      'Hailey Collins': { bg: 'bg-pink-50', text: 'text-pink-600' },
      'Wang Wen': { bg: 'bg-amber-50', text: 'text-amber-600' },
      'Khim Tanglao': { bg: 'bg-slate-100', text: 'text-slate-600' },
      'Mac Mill': { bg: 'bg-emerald-50', text: 'text-emerald-600' },
      'Micaela Pena': { bg: 'bg-slate-100', text: 'text-slate-600' },
      'Gillian Guiang': { bg: 'bg-slate-100', text: 'text-slate-600' },
    };
    return avatarColorMap[name] || { bg: 'bg-slate-100', text: 'text-slate-600' };
  };

  return (
    <div className="fixed inset-0 z-[200] flex justify-end" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300 ease-out"
        onClick={onClose}
        style={{
          animation: 'fadeIn 300ms ease-out'
        }}
      />

      <div
        className={`relative h-full bg-white/80 backdrop-blur-2xl shadow-2xl flex transform border-l border-white/60 rounded-l-[32px] ml-auto overflow-hidden ${
          selectedEmail ? 'w-full max-w-[1200px]' : 'w-full max-w-[680px]'
        }`}
        style={{
          animation: 'slideInRight 500ms cubic-bezier(0.16, 1, 0.3, 1)',
          transition: 'max-width 200ms cubic-bezier(0.4, 0, 0.2, 1), width 200ms cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'max-width, width'
        }}
      >
        {/* Email List Panel */}
        <div
          className={`flex flex-col ${
            selectedEmail ? 'w-[380px] border-r border-slate-200/60' : 'w-full'
          }`}
          style={{
            transition: 'width 200ms cubic-bezier(0.4, 0, 0.2, 1), border-color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
            willChange: 'width',
            transform: 'translateZ(0)'
          }}
        >
          <div className="px-6 py-6 border-b border-slate-100/50 bg-white/40 backdrop-blur-md z-10 flex items-center justify-between sticky top-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Icon icon="solar:inbox-line-linear" width="20" />
              </div>
              <div>
                <h2 className="text-lg text-slate-900 tracking-tight font-display font-semibold">
                  {contactName ? `Emails to ${contactName}` : 'Sent Emails'}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {isLoading ? 'Loading...' : `${emailHistory.length} ${emailHistory.length === 1 ? 'email' : 'emails'}`}
                </p>
              </div>
            </div>
            {!selectedEmail && (
              <button
                onClick={onClose}
                className="w-9 h-9 text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 rounded-xl border border-transparent hover:border-slate-200/60 transition-all flex items-center justify-center"
              >
                <Icon icon="solar:close-circle-linear" width="20" />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3 animate-pulse">
                    <Icon icon="solar:inbox-line-linear" width="24" className="text-blue-600" />
                  </div>
                  <p className="text-sm text-slate-500 font-medium">Loading emails...</p>
                </div>
              </div>
            ) : emailHistory.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <Icon icon={!contactEmail ? "solar:danger-triangle-linear" : "solar:inbox-line-linear"} width="32" className={!contactEmail ? "text-amber-500" : "text-slate-400"} />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">
                    {!contactEmail ? 'Cannot load email history' : 'No emails yet'}
                  </h3>
                  <p className="text-xs text-slate-500 mb-4 max-w-xs mx-auto">
                    {!contactEmail
                      ? 'No contact email address is available. Please ensure the contact has a valid email.'
                      : contactName
                      ? `You haven't sent any emails to ${contactName} yet.`
                      : 'No email history found.'}
                  </p>
                  {contactEmail && contactName && (
                    <button
                      onClick={() => {
                        if (onComposeEmail) {
                          onComposeEmail({ name: contactName, email: contactEmail });
                        }
                        onClose();
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-all"
                    >
                      <Icon icon="solar:letter-linear" width="16" />
                      Send First Email
                    </button>
                  )}
                  {!contactEmail && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-left">
                      <p className="text-xs text-amber-800 font-medium mb-1">Debug Info:</p>
                      <p className="text-xs text-amber-700 font-mono">
                        contactName: {contactName || 'undefined'}<br />
                        contactEmail: {contactEmail || 'undefined'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              emailHistory.map((email) => {
              const typeStyle = getTypeStyles(email.type);
              const statusStyle = getStatusStyles(email.status);
              const avatarColor = getAvatarColor(email.recipient);
              const isSelected = selectedEmailId === email.id;

              return (
                <div
                  key={email.id}
                  onClick={() => setSelectedEmailId(email.id)}
                  className={`bg-white/60 backdrop-blur-sm rounded-xl p-4 border shadow-sm ring-1 ring-slate-100/50 hover:shadow-md hover:bg-white/80 cursor-pointer group ${
                    isSelected ? 'border-blue-300 bg-blue-50/40 ring-blue-200/50' : 'border-white/80'
                  }`}
                  style={{
                    transition: 'border-color 150ms cubic-bezier(0.4, 0, 0.2, 1), background-color 150ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-full ${avatarColor.bg} ${avatarColor.text} flex items-center justify-center text-xs font-bold ring-2 ring-white shadow-sm group-hover:scale-105 transition-transform shrink-0`}>
                      {getInitials(email.recipient)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                          {email.recipient}
                        </h3>
                        <div className="text-[10px] font-semibold text-slate-500 shrink-0">
                          {email.time}
                        </div>
                      </div>

                      <p className="text-xs font-semibold text-slate-700 truncate mb-1">
                        {email.subject}
                      </p>

                      <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 mb-2">
                        {email.preview}
                      </p>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded ${typeStyle.bg} ${typeStyle.text} border ${typeStyle.border}`}>
                          <Icon icon={typeStyle.icon} width="10" />
                          <span className="text-[9px] font-bold uppercase tracking-wide">
                            {email.type}
                          </span>
                        </div>

                        {email.reference && (
                          <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            <span className="text-[9px] font-bold">
                              {email.reference}
                            </span>
                          </div>
                        )}

                        <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded ${statusStyle.bg} ${statusStyle.text} ml-auto`}>
                          <div className={`w-1 h-1 rounded-full ${statusStyle.dot}`}></div>
                          <span className="text-[9px] font-bold uppercase tracking-wide">
                            {email.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
            )}
          </div>
        </div>

        {/* Email Detail Panel */}
        {selectedEmail && (
          <div
            className="flex-1 flex flex-col bg-white/60 backdrop-blur-sm animate-slideInFromRight"
            style={{
              transform: 'translateZ(0)'
            }}
          >
            {/* Detail Header */}
            <div className="px-8 py-6 border-b border-slate-200/60 bg-gradient-to-br from-white/40 via-blue-50/20 to-emerald-50/20 backdrop-blur-md z-10 sticky top-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCloseDetail}
                    className="w-9 h-9 text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 rounded-xl border border-transparent hover:border-slate-200/60 transition-all flex items-center justify-center"
                  >
                    <Icon icon="solar:arrow-left-linear" width="20" />
                  </button>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Email Details
                    </h3>
                    <p className="text-xs text-slate-500">
                      {currentIndex + 1} of {emailHistory.length}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleNavigateEmail('prev')}
                    disabled={currentIndex === 0}
                    className="w-9 h-9 text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 rounded-xl border border-transparent hover:border-slate-200/60 transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  >
                    <Icon icon="solar:alt-arrow-left-linear" width="18" />
                  </button>
                  <button
                    onClick={() => handleNavigateEmail('next')}
                    disabled={currentIndex === emailHistory.length - 1}
                    className="w-9 h-9 text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 rounded-xl border border-transparent hover:border-slate-200/60 transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  >
                    <Icon icon="solar:alt-arrow-right-linear" width="18" />
                  </button>
                  <div className="w-px h-6 bg-slate-200 mx-1"></div>
                  <button
                    onClick={onClose}
                    className="w-9 h-9 text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 rounded-xl border border-transparent hover:border-slate-200/60 transition-all flex items-center justify-center"
                  >
                    <Icon icon="solar:close-circle-linear" width="20" />
                  </button>
                </div>
              </div>

              {/* Subject & Status Bar */}
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 leading-tight">
                  {selectedEmail.subject}
                </h2>

                <div className="flex items-center gap-3 flex-wrap">
                  {(() => {
                    const typeStyle = getTypeStyles(selectedEmail.type);
                    return (
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${typeStyle.bg} ${typeStyle.text} border ${typeStyle.border}`}>
                        <Icon icon={typeStyle.icon} width="14" />
                        <span className="text-xs font-bold uppercase tracking-wide">
                          {selectedEmail.type}
                        </span>
                      </div>
                    );
                  })()}

                  {selectedEmail.reference && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                      <Icon icon="solar:hashtag-linear" width="14" />
                      <span className="text-xs font-bold">
                        {selectedEmail.reference}
                      </span>
                    </div>
                  )}

                  {selectedEmail.amount && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-900 border border-slate-200">
                      <Icon icon="solar:dollar-linear" width="14" />
                      <span className="text-xs font-bold">
                        {selectedEmail.amount}
                      </span>
                    </div>
                  )}

                  {(() => {
                    const statusStyle = getStatusStyles(selectedEmail.status);
                    return (
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${statusStyle.bg} ${statusStyle.text} ml-auto`}>
                        <div className={`w-2 h-2 rounded-full ${statusStyle.dot}`}></div>
                        <span className="text-xs font-bold uppercase tracking-wide">
                          {selectedEmail.status}
                        </span>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Email Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="max-w-3xl mx-auto space-y-8">
                {/* Recipient Info */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm">
                  <div className="flex items-start gap-4">
                    {(() => {
                      const avatarColor = getAvatarColor(selectedEmail.recipient);
                      return (
                        <div className={`w-14 h-14 rounded-full ${avatarColor.bg} ${avatarColor.text} flex items-center justify-center text-lg font-bold ring-2 ring-white shadow-sm shrink-0`}>
                          {getInitials(selectedEmail.recipient)}
                        </div>
                      );
                    })()}

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="text-base font-bold text-slate-900 mb-1">
                            {selectedEmail.recipient}
                          </h3>
                          <p className="text-sm text-slate-600">
                            {selectedEmail.recipientEmail}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-slate-700">
                            {selectedEmail.date}
                          </div>
                          <div className="text-xs text-slate-500">
                            {selectedEmail.time}
                          </div>
                        </div>
                      </div>

                      {selectedEmail.deliveredAt && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Icon icon="solar:check-circle-linear" width="14" className="text-emerald-500" />
                          <span>Delivered {selectedEmail.deliveredAt}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Attachment */}
                {selectedEmail.attachmentName && (
                  <div className="bg-gradient-to-br from-emerald-50/50 via-blue-50/30 to-amber-50/50 backdrop-blur-sm rounded-2xl p-5 border border-emerald-200/40 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-emerald-500/20">
                        <Icon icon="solar:document-text-bold" width="24" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 mb-0.5 truncate">
                          {selectedEmail.attachmentName}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {selectedEmail.attachmentSize}
                        </p>
                      </div>
                      <button className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center transition-all shadow-sm hover:shadow-md">
                        <Icon icon="solar:download-linear" width="18" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Email Body */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/60 shadow-sm">
                  <div className="prose prose-sm prose-slate max-w-none">
                    <div className="text-slate-700 leading-relaxed whitespace-pre-wrap font-normal text-[15px]" style={{ lineHeight: '1.7' }}>
                      {selectedEmail.body}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (onComposeEmail) {
                        onComposeEmail({
                          name: selectedEmail.recipient,
                          email: selectedEmail.recipientEmail
                        });
                      }
                      onClose();
                    }}
                    className="flex-1 h-11 px-5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                  >
                    <Icon icon="solar:letter-linear" width="18" />
                    Compose New Email
                  </button>
                  <button className="flex-1 h-11 px-5 bg-gradient-to-br from-white to-slate-50/50 hover:from-slate-50 hover:to-slate-100/50 text-slate-700 font-semibold rounded-xl border border-slate-200 hover:border-slate-300 transition-all shadow-sm hover:shadow flex items-center justify-center gap-2">
                    <Icon icon="solar:forward-linear" width="18" />
                    Forward
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideInFromRight {
          from {
            transform: translateX(20px) translateZ(0);
            opacity: 0;
          }
          to {
            transform: translateX(0) translateZ(0);
            opacity: 1;
          }
        }

        .animate-slideInFromRight {
          animation: slideInFromRight 200ms cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}
