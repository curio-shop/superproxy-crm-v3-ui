import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const mockEmails = [
  {
    recipient_name: 'Let Cruz',
    recipient_email: 'vcc.letcruz@myyahoo.com',
    user_name: 'John Anderson',
    user_email: 'john@company.com',
    subject: 'Quote for Berkshire Stadium Project',
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
    status: 'opened',
    reference_type: 'quote',
    reference_name: 'Q-2024',
    attachment_name: 'Quote_Q-2024_Berkshire_Stadium.pdf',
    attachment_size: '245 KB',
    sent_at: new Date('2026-01-15T14:34:00Z'),
    delivered_at: new Date('2026-01-15T14:35:00Z'),
  },
  {
    recipient_name: 'Let Cruz',
    recipient_email: 'vcc.letcruz@myyahoo.com',
    user_name: 'John Anderson',
    user_email: 'john@company.com',
    subject: 'Project timeline and next steps',
    body: `Hi Let,

I wanted to outline the project timeline and next steps for the upcoming construction phase. Here's what we're looking at:

Week 1-2: Site preparation and permits
Week 3-4: Foundation work
Week 5-8: Main construction
Week 9-10: Finishing and inspection

Let me know if you have any questions about the schedule!

Best regards,
John Anderson`,
    status: 'replied',
    reference_type: 'custom',
    sent_at: new Date('2026-01-06T10:30:00Z'),
    delivered_at: new Date('2026-01-06T10:31:00Z'),
  },
  {
    recipient_name: 'Hailey Collins',
    recipient_email: 'hailey@riggedparts.com',
    user_name: 'John Anderson',
    user_email: 'john@company.com',
    subject: 'Following up on our conversation',
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
    status: 'replied',
    reference_type: 'custom',
    sent_at: new Date('2026-01-14T11:22:00Z'),
    delivered_at: new Date('2026-01-14T11:23:00Z'),
  },
  {
    recipient_name: 'Hailey Collins',
    recipient_email: 'hailey@riggedparts.com',
    user_name: 'John Anderson',
    user_email: 'john@company.com',
    subject: 'Invoice for City Park Infrastructure',
    body: `Hi Hailey,

Please find the invoice for the City Park Infrastructure project. Thank you for your continued partnership and trust in our services.

Looking forward to our next collaboration!

Best regards,
John Anderson`,
    status: 'opened',
    reference_type: 'invoice',
    reference_name: 'INV-1020',
    attachment_name: 'Invoice_INV-1020.pdf',
    attachment_size: '221 KB',
    sent_at: new Date('2026-01-02T11:14:00Z'),
    delivered_at: new Date('2026-01-02T11:15:00Z'),
  },
  {
    recipient_name: 'Wang Wen',
    recipient_email: 'melwyn.arrubio@yahoo.com',
    user_name: 'John Anderson',
    user_email: 'john@company.com',
    subject: 'Invoice for Downtown Office Renovation',
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
    status: 'opened',
    reference_type: 'invoice',
    reference_name: 'INV-1023',
    attachment_name: 'Invoice_INV-1023.pdf',
    attachment_size: '198 KB',
    sent_at: new Date('2026-01-13T16:18:00Z'),
    delivered_at: new Date('2026-01-13T16:19:00Z'),
  },
  {
    recipient_name: 'Wang Wen',
    recipient_email: 'melwyn.arrubio@yahoo.com',
    user_name: 'John Anderson',
    user_email: 'john@company.com',
    subject: 'Proposal for Q1 2026 collaboration',
    body: `Hi Wang,

As we approach the new year, I wanted to discuss potential collaboration opportunities for Q1 2026.

I believe there are several exciting projects where our expertise could add value to your operations. Would you be available for a call in early January to explore these possibilities?

Wishing you a wonderful holiday season!

Best regards,
John Anderson`,
    status: 'sent',
    reference_type: 'custom',
    sent_at: new Date('2025-12-28T16:42:00Z'),
    delivered_at: new Date('2025-12-28T16:43:00Z'),
  },
  {
    recipient_name: 'Khim Tanglao',
    recipient_email: 'metriccon.purchasing@gmail.com',
    user_name: 'John Anderson',
    user_email: 'john@company.com',
    subject: 'Thank you for your business',
    body: `Hi Khim,

I wanted to reach out and thank you for choosing us for your recent project. Your satisfaction is our top priority, and we're grateful for the trust you've placed in our team.

Working with MetricCon has been an absolute pleasure, and we truly appreciate the opportunity to contribute to your success. Your professionalism and clear communication throughout the project made everything run smoothly.

If there's anything we can do to improve your experience or if you have any feedback, please don't hesitate to share. We're always looking for ways to serve our clients better.

We look forward to working with you again in the future!

Warm regards,
John Anderson`,
    status: 'opened',
    reference_type: 'custom',
    sent_at: new Date('2026-01-12T09:45:00Z'),
    delivered_at: new Date('2026-01-12T09:46:00Z'),
  },
  {
    recipient_name: 'Mac Mill',
    recipient_email: 'mac@m.gom',
    user_name: 'John Anderson',
    user_email: 'john@company.com',
    subject: 'Quote for Harbor View Apartments',
    body: `Hi Mac,

As discussed in our recent meeting, I have prepared a comprehensive quote for the Harbor View Apartments project.

This proposal covers all aspects we reviewed, including materials, labor, and timeline considerations. Our team is excited about this opportunity and confident we can deliver exceptional results.

Please review the attached quote at your convenience. I'm available to discuss any questions or modifications you might need.

Best regards,
John Anderson`,
    status: 'sent',
    reference_type: 'quote',
    reference_name: 'Q-2022',
    attachment_name: 'Quote_Q-2022_Harbor_View.pdf',
    attachment_size: '187 KB',
    sent_at: new Date('2026-01-10T15:12:00Z'),
    delivered_at: new Date('2026-01-10T15:13:00Z'),
  },
  {
    recipient_name: 'Micaela Pena',
    recipient_email: 'micaela.pena@gmail.com',
    user_name: 'John Anderson',
    user_email: 'john@company.com',
    subject: 'Invoice for Tech Campus Phase 2',
    body: `Hi Micaela,

Attached is the invoice for Tech Campus Phase 2. Payment terms are net 30 days from the invoice date.

Thank you for your continued partnership!

Best regards,
John Anderson`,
    status: 'opened',
    reference_type: 'invoice',
    reference_name: 'INV-1021',
    attachment_name: 'Invoice_INV-1021.pdf',
    attachment_size: '203 KB',
    sent_at: new Date('2026-01-08T13:55:00Z'),
    delivered_at: new Date('2026-01-08T13:56:00Z'),
  },
  {
    recipient_name: 'Gillian Guiang',
    recipient_email: 'gillian@designstudio.com',
    user_name: 'John Anderson',
    user_email: 'john@company.com',
    subject: 'Quote for Riverside Mall Expansion',
    body: `Hi Gillian,

Please review the attached quote for the Riverside Mall Expansion project. All specifications are included per your requirements.

I'm available to discuss any details or adjustments you might need.

Best regards,
John Anderson`,
    status: 'sent',
    reference_type: 'quote',
    reference_name: 'Q-2020',
    attachment_name: 'Quote_Q-2020_Riverside_Mall.pdf',
    attachment_size: '312 KB',
    sent_at: new Date('2026-01-04T14:08:00Z'),
    delivered_at: new Date('2026-01-04T14:09:00Z'),
  },
];

async function insertMockEmails() {
  console.log('Starting to insert mock email history data...\n');

  for (const email of mockEmails) {
    const { data, error } = await supabase
      .from('email_history')
      .insert({
        ...email,
        created_at: email.sent_at,
        updated_at: email.sent_at,
      })
      .select();

    if (error) {
      console.error(`Error inserting email to ${email.recipient_name}:`, error.message);
    } else {
      console.log(`✓ Inserted email: "${email.subject}" to ${email.recipient_name}`);
    }
  }

  console.log('\n✅ Mock email history data insertion completed!');
  process.exit(0);
}

insertMockEmails();
