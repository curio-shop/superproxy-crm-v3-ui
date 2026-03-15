-- Insert mock email history data for Let Cruz and Hailey Collins only
INSERT INTO email_history (
  recipient_name,
  recipient_email,
  user_name,
  user_email,
  subject,
  body,
  status,
  reference_type,
  reference_name,
  attachment_name,
  attachment_size,
  sent_at,
  delivered_at,
  created_at,
  updated_at
) VALUES
-- Let Cruz - Email 1
(
  'Let Cruz',
  'vcc.letcruz@myyahoo.com',
  'John Anderson',
  'john@company.com',
  'Quote for Berkshire Stadium Project',
  'Hi Let,

I hope this email finds you well.

I wanted to follow up on our conversation from last week regarding the Berkshire Stadium Project. As discussed, I''ve prepared a comprehensive quote that outlines all the details of the project scope, timeline, and associated costs.

The quote includes:
• Complete structural analysis and assessment
• Material procurement and logistics
• Installation and construction services
• Quality assurance and final inspection
• 2-year warranty on all work completed

Our team has extensive experience with stadium projects of this scale, and we''re confident we can deliver exceptional results within your timeline. The total project cost comes to $3,810.00, which includes all materials, labor, and project management.

I''ve attached the detailed quote (Q-2024) to this email for your review. Please take your time going through it, and feel free to reach out if you have any questions or need clarification on any aspect of the proposal.

We''re excited about the possibility of working with you on this project and look forward to your feedback.

Best regards,
John Anderson',
  'opened',
  'quote',
  'Q-2024',
  'Quote_Q-2024_Berkshire_Stadium.pdf',
  '245 KB',
  '2026-01-15 14:34:00+00',
  '2026-01-15 14:35:00+00',
  '2026-01-15 14:34:00+00',
  '2026-01-15 14:34:00+00'
),
-- Let Cruz - Email 2
(
  'Let Cruz',
  'vcc.letcruz@myyahoo.com',
  'John Anderson',
  'john@company.com',
  'Project timeline and next steps',
  'Hi Let,

I wanted to outline the project timeline and next steps for the upcoming construction phase. Here''s what we''re looking at:

Week 1-2: Site preparation and permits
Week 3-4: Foundation work
Week 5-8: Main construction
Week 9-10: Finishing and inspection

Let me know if you have any questions about the schedule!

Best regards,
John Anderson',
  'replied',
  'custom',
  NULL,
  NULL,
  NULL,
  '2026-01-06 10:30:00+00',
  '2026-01-06 10:31:00+00',
  '2026-01-06 10:30:00+00',
  '2026-01-06 10:30:00+00'
),
-- Hailey Collins - Email 1
(
  'Hailey Collins',
  'hailey@riggedparts.com',
  'John Anderson',
  'john@company.com',
  'Following up on our conversation',
  'Hi Hailey,

Thanks for taking the time to speak with me yesterday. It was great to connect and learn more about your current projects and future plans.

I wanted to follow up on the points we discussed regarding:

1. The upcoming infrastructure upgrade you mentioned for Q2 2026
2. Your interest in exploring more sustainable materials
3. Potential partnership opportunities for the new developments

Based on our conversation, I think there are several ways we could work together to achieve your goals while staying within budget constraints. I''d love to schedule a follow-up meeting next week to dive deeper into the specifics.

Would Tuesday or Thursday afternoon work for your schedule? I''m flexible and happy to work around your availability.

Looking forward to continuing our conversation!

Best regards,
John Anderson',
  'replied',
  'custom',
  NULL,
  NULL,
  NULL,
  '2026-01-14 11:22:00+00',
  '2026-01-14 11:23:00+00',
  '2026-01-14 11:22:00+00',
  '2026-01-14 11:22:00+00'
),
-- Hailey Collins - Email 2
(
  'Hailey Collins',
  'hailey@riggedparts.com',
  'John Anderson',
  'john@company.com',
  'Invoice for City Park Infrastructure',
  'Hi Hailey,

Please find the invoice for the City Park Infrastructure project. Thank you for your continued partnership and trust in our services.

Looking forward to our next collaboration!

Best regards,
John Anderson',
  'opened',
  'invoice',
  'INV-1020',
  'Invoice_INV-1020.pdf',
  '221 KB',
  '2026-01-02 11:14:00+00',
  '2026-01-02 11:15:00+00',
  '2026-01-02 11:14:00+00',
  '2026-01-02 11:14:00+00'
);
