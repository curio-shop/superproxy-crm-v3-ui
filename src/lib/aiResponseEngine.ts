import type { ContactDetail } from '../components/Contacts';
import type { Company } from '../components/Companies';
import type { Product } from '../components/Products';
import type { Quotation, Invoice } from '../contexts/CallManagerContext';

/* ── Types ─────────────────────────────────────── */

export type EntityActionType = 'contact' | 'company' | 'product';

export interface EntityAction {
  type: EntityActionType;
  label: string;
  contact?: ContactDetail;
  company?: Company;
  product?: Product;
}

export interface DocumentCard {
  type: 'quote' | 'invoice';
  quotation?: Quotation;
  invoice?: Invoice;
}

export interface ToolCallStep {
  toolName: string;
  description: string;
  icon: string;
  entityType: string;
}

export interface AIResponseResult {
  content: string;
  entityAction?: EntityAction;
  documentCard?: DocumentCard;
  toolCall?: ToolCallStep;
}

/* ── Mock responses ────────────────────────────── */

export const MOCK_RESPONSES: Record<string, string> = {
  default:  `Here's what I found:\n\n• Your pipeline has **12 active deals** totaling ฿2.4M in potential revenue\n• 3 quotes are awaiting client response for more than 7 days\n• Top performing account this month: **Apex Technologies** (฿480K)\n\nWould you like me to draft outreach for any of the stalled deals, or dig deeper into a specific account?`,
  email:    `Here's a follow-up email draft:\n\n**Subject:** Following up on your quote — [Company Name]\n\nHi [Name],\n\nI wanted to check in on the proposal we sent over last week. We'd love to answer any questions or adjust terms to better fit your needs.\n\nWould a quick 15-minute call this week work for you?\n\nBest,\n[Your Name]\n\nWant me to personalize this for a specific contact?`,
  pipeline: `Here's your pipeline summary:\n\n**Total Active Deals:** 12\n**Combined Value:** ฿2,400,000\n\n• 🟢 4 deals in negotiation stage\n• 🟡 5 deals awaiting client decision\n• 🔴 3 deals overdue for follow-up\n\nYour close rate this quarter is **34%**, up 8% from last quarter. Shall I highlight the at-risk deals?`,
  accounts: `**Top Accounts by Revenue (This Month):**\n\n1. Apex Technologies — ฿480,000\n2. Nova Retail Group — ฿312,000\n3. Meridian Logistics — ฿275,500\n4. SkyLink Partners — ฿198,000\n5. Crestwood Holdings — ฿145,000\n\nApex Technologies has increased activity by 40% — a strong upsell opportunity. Want me to prepare a proposal?`,
};

/* ── Utilities ─────────────────────────────────── */

export function toTitleCase(str: string): string {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

/* ── Mock entity factories ─────────────────────── */

export function createMockContact(name: string): ContactDetail {
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const colors = ['blue', 'pink', 'amber', 'emerald'];
  return {
    id: `ai-c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name,
    initials,
    company: 'Unassigned',
    title: 'New Contact',
    email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    phone: '+66 98 765 4321',
    owner: { name: 'Richard', initials: 'R', color: 'indigo' },
    avatarColor: colors[Math.floor(Math.random() * colors.length)],
  };
}

export function createMockCompany(name: string): Company {
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const colors = ['blue', 'pink', 'amber', 'emerald', 'purple'];
  return {
    id: `ai-co-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name,
    initials,
    type: 'Prospect',
    industry: 'Technology',
    owner: { name: 'Richard', initials: 'R', color: 'indigo' },
    avatarColor: colors[Math.floor(Math.random() * colors.length)],
    lifecycleStage: 'Lead',
  };
}

export function createMockProduct(name: string): Product {
  return {
    id: `ai-p-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name,
    category: 'General',
    sku: `SKU-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    stock: 100,
    maxStock: 200,
    price: 9900,
    status: 'active',
  };
}

export function createMockQuotation(clientName: string): Quotation {
  const initials = clientName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const colors = ['blue', 'purple', 'amber', 'emerald', 'pink'];
  const num = Math.floor(Math.random() * 50) + 90;
  const amount = Math.floor(Math.random() * 400000) + 100000;
  const items = Math.floor(Math.random() * 4) + 2;
  const today = new Date();
  const validUntil = new Date(today);
  validUntil.setDate(validUntil.getDate() + 30);
  return {
    id: `ai-q-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    number: `QT-2024-${String(num).padStart(3, '0')}`,
    title: `Quote for ${clientName}`,
    client: { name: clientName, initials, color: colors[Math.floor(Math.random() * colors.length)] },
    status: 'published',
    amount,
    date: today.toISOString().slice(0, 10),
    validUntil: validUntil.toISOString().slice(0, 10),
    items,
  };
}

export function createMockInvoice(clientName: string): Invoice {
  const initials = clientName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const colors = ['blue', 'purple', 'amber', 'emerald', 'pink'];
  const num = Math.floor(Math.random() * 50) + 50;
  const amount = Math.floor(Math.random() * 400000) + 80000;
  const items = Math.floor(Math.random() * 4) + 2;
  const today = new Date();
  const dueDate = new Date(today);
  dueDate.setDate(dueDate.getDate() + 30);
  return {
    id: `ai-inv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    number: `INV-2024-${String(num).padStart(3, '0')}`,
    title: `Invoice for ${clientName}`,
    client: { name: clientName, initials, color: colors[Math.floor(Math.random() * colors.length)] },
    status: 'pending',
    amount,
    issueDate: today.toISOString().slice(0, 10),
    dueDate: dueDate.toISOString().slice(0, 10),
    items,
  };
}

/* ── AI response engine ────────────────────────── */

export function getAIResponse(input: string): AIResponseResult {
  const lower = input.toLowerCase();

  // Create contact
  const contactMatch = lower.match(/create\s+(?:a\s+)?(?:new\s+)?contact\s+(.+)/);
  if (contactMatch) {
    const name = toTitleCase(contactMatch[1].trim());
    const entity = createMockContact(name);
    return {
      content: `Done! I've created a new contact for **${name}**.\n\nHere's what I set up:\n\n• Email: ${entity.email}\n• Company: ${entity.company}\n• Owner: Richard\n\nYou can view the full profile or make edits from there.`,
      entityAction: { type: 'contact', label: `View ${name}`, contact: entity },
      toolCall: { toolName: 'createContact', description: 'Creating contact...', icon: 'solar:user-plus-bold', entityType: 'contact' },
    };
  }

  // Create company
  const companyMatch = lower.match(/create\s+(?:a\s+)?(?:new\s+)?company\s+(.+)/);
  if (companyMatch) {
    const name = toTitleCase(companyMatch[1].trim());
    const entity = createMockCompany(name);
    return {
      content: `Done! I've created a new company: **${name}**.\n\nHere are the details:\n\n• Industry: Technology\n• Type: Prospect\n• Lifecycle Stage: Lead\n• Owner: Richard\n\nFeel free to update any details from the company profile.`,
      entityAction: { type: 'company', label: `View ${name}`, company: entity },
      toolCall: { toolName: 'createCompany', description: 'Creating company...', icon: 'solar:buildings-bold', entityType: 'company' },
    };
  }

  // Create product
  const productMatch = lower.match(/create\s+(?:a\s+)?(?:new\s+)?product\s+(.+)/);
  if (productMatch) {
    const name = toTitleCase(productMatch[1].trim());
    const entity = createMockProduct(name);
    return {
      content: `Done! I've created a new product: **${name}**.\n\nHere are the details:\n\n• SKU: ${entity.sku}\n• Price: ฿${entity.price.toLocaleString()}\n• Stock: ${entity.stock} units\n• Status: Active\n\nYou can update pricing, stock levels, and more from the product page.`,
      entityAction: { type: 'product', label: `View ${name}`, product: entity },
      toolCall: { toolName: 'createProduct', description: 'Creating product...', icon: 'solar:box-bold', entityType: 'product' },
    };
  }

  // Generate quote
  const quoteMatch = lower.match(/(?:generate|create)\s+(?:a\s+)?(?:new\s+)?quote\s+(?:for\s+)?(.+)/);
  if (quoteMatch) {
    const name = toTitleCase(quoteMatch[1].trim());
    const quotation = createMockQuotation(name);
    return {
      content: `I've generated a new quote for **${name}**. Here's a summary of what was created:`,
      documentCard: { type: 'quote', quotation },
      toolCall: { toolName: 'generateQuote', description: 'Generating quote...', icon: 'solar:file-text-bold', entityType: 'quote' },
    };
  }

  // Create invoice
  const invoiceMatch = lower.match(/(?:generate|create)\s+(?:a\s+)?(?:new\s+)?invoice\s+(?:for\s+)?(.+)/);
  if (invoiceMatch) {
    const name = toTitleCase(invoiceMatch[1].trim());
    const invoice = createMockInvoice(name);
    return {
      content: `I've created a new invoice for **${name}**. Here are the details:`,
      documentCard: { type: 'invoice', invoice },
      toolCall: { toolName: 'createInvoice', description: 'Creating invoice...', icon: 'solar:bill-list-bold', entityType: 'invoice' },
    };
  }

  // Existing keyword matches
  if (lower.includes('email') || lower.includes('follow')) return { content: MOCK_RESPONSES.email };
  if (lower.includes('pipeline') || lower.includes('summary')) return { content: MOCK_RESPONSES.pipeline };
  if (lower.includes('account') || lower.includes('analy')) return { content: MOCK_RESPONSES.accounts };
  return { content: MOCK_RESPONSES.default };
}
