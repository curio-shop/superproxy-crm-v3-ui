import { Icon } from '@iconify/react';
import { useState, useEffect, useRef } from 'react';
import NotificationCard from './NotificationCard';
import { ContactDetail } from './Contacts';
import { Company } from './Companies';
import { Product } from './Products';
import { Quotation, Invoice } from '../contexts/CallManagerContext';

/* ── Proxy context data ─────────────────────────────────────── */
type ProxyCategoryKey = 'contact' | 'company' | 'product' | 'quote' | 'invoice' | 'walkthrough';

const PROXY_CATEGORIES: { key: ProxyCategoryKey; label: string; icon: string; color: string }[] = [
  { key: 'contact',    label: 'Contact',      icon: 'solar:user-linear',            color: 'text-blue-500' },
  { key: 'company',    label: 'Company',      icon: 'solar:buildings-2-linear',     color: 'text-violet-500' },
  { key: 'product',    label: 'Product',      icon: 'solar:box-linear',             color: 'text-amber-500' },
  { key: 'quote',      label: 'Quote',        icon: 'solar:document-text-linear',   color: 'text-indigo-500' },
  { key: 'invoice',    label: 'Invoice',      icon: 'solar:bill-list-linear',       color: 'text-emerald-500' },
];

const PROXY_DATA: Record<ProxyCategoryKey, { id: string; label: string; sub?: string }[]> = {
  contact: [
    { id: 'c1', label: 'Sarah Chen',       sub: 'Apex Technologies' },
    { id: 'c2', label: 'Marcus Johnson',   sub: 'Nova Retail Group' },
    { id: 'c3', label: 'Aiko Tanaka',      sub: 'Meridian Logistics' },
    { id: 'c4', label: 'Elena Rodriguez',  sub: 'SkyLink Partners' },
    { id: 'c5', label: 'James Whitfield',  sub: 'Crestwood Holdings' },
  ],
  company: [
    { id: 'co1', label: 'Apex Technologies',   sub: '4 contacts' },
    { id: 'co2', label: 'Nova Retail Group',   sub: '2 contacts' },
    { id: 'co3', label: 'Meridian Logistics',  sub: '3 contacts' },
    { id: 'co4', label: 'SkyLink Partners',    sub: '1 contact' },
    { id: 'co5', label: 'Crestwood Holdings',  sub: '5 contacts' },
  ],
  product: [
    { id: 'p1', label: 'ProSeries X1',     sub: '฿12,400 · In Stock' },
    { id: 'p2', label: 'CloudBase Suite',  sub: '฿8,900 · In Stock' },
    { id: 'p3', label: 'DataGuard Pro',    sub: '฿5,200 · Low Stock' },
    { id: 'p4', label: 'FlexTrack 3000',   sub: '฿3,750 · In Stock' },
    { id: 'p5', label: 'NanoCore Module',  sub: '฿1,980 · Out of Stock' },
  ],
  quote: [
    { id: 'q1', label: 'QT-2024-089', sub: 'Apex Technologies · ฿480,000' },
    { id: 'q2', label: 'QT-2024-088', sub: 'Nova Retail Group · ฿312,000' },
    { id: 'q3', label: 'QT-2024-087', sub: 'Meridian Logistics · ฿275,500' },
    { id: 'q4', label: 'QT-2024-086', sub: 'SkyLink Partners · ฿198,000' },
    { id: 'q5', label: 'QT-2024-085', sub: 'Crestwood Holdings · ฿145,000' },
  ],
  invoice: [
    { id: 'i1', label: 'INV-2024-042', sub: 'Apex Technologies · Paid' },
    { id: 'i2', label: 'INV-2024-041', sub: 'Nova Retail Group · Unpaid' },
    { id: 'i3', label: 'INV-2024-040', sub: 'Meridian Logistics · Overdue' },
    { id: 'i4', label: 'INV-2024-039', sub: 'SkyLink Partners · Paid' },
    { id: 'i5', label: 'INV-2024-038', sub: 'Crestwood Holdings · Unpaid' },
  ],
};

/* ── ProxyDropdown component ────────────────────────────────── */
interface ProxyDropdownProps {
  selected: { category: string; label: string } | null;
  onSelectedChange: (val: { category: string; label: string } | null) => void;
  onSelect?: (tag: string) => void;
}

function ProxyDropdown({ selected, onSelectedChange }: ProxyDropdownProps) {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ProxyCategoryKey | null>(null);
  const [catSearch, setCatSearch] = useState('');
  const [itemSearch, setItemSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const itemSearchRef = useRef<HTMLInputElement>(null);
  const catSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveCategory(null);
        setCatSearch('');
        setItemSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && !activeCategory) setTimeout(() => catSearchRef.current?.focus(), 50);
  }, [open, activeCategory]);

  useEffect(() => {
    if (activeCategory) setTimeout(() => itemSearchRef.current?.focus(), 50);
  }, [activeCategory]);

  const filteredCategories = PROXY_CATEGORIES.filter(c =>
    c.label.toLowerCase().includes(catSearch.toLowerCase())
  );

  const filteredItems = activeCategory
    ? PROXY_DATA[activeCategory].filter(item =>
        item.label.toLowerCase().includes(itemSearch.toLowerCase()) ||
        item.sub?.toLowerCase().includes(itemSearch.toLowerCase())
      )
    : [];

  const activeCat = PROXY_CATEGORIES.find(c => c.key === activeCategory);

  const handleSelectItem = (item: { id: string; label: string }) => {
    onSelectedChange({ category: activeCat!.label, label: item.label });
    setOpen(false);
    setActiveCategory(null);
    setCatSearch('');
    setItemSearch('');
  };

  return (
    <div ref={ref} className="relative group/proxy">
      <button
        onClick={() => { setOpen(o => !o); setActiveCategory(null); setCatSearch(''); setItemSearch(''); }}
        className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-slate-100 transition-colors"
      >
        <span className={selected ? 'text-slate-700 font-semibold' : 'text-slate-500'}>
          {selected ? selected.label : 'Reference'}
        </span>
        <Icon icon="solar:alt-arrow-down-linear" width="13" className="text-slate-400 mt-px flex-shrink-0" />
      </button>
      {selected && (
        <button
          onClick={e => { e.stopPropagation(); onSelectedChange(null); }}
          className="absolute -top-1 -right-0.5 w-4 h-4 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all opacity-0 group-hover/proxy:opacity-100 shadow-sm"
        >
          <svg width="7" height="7" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
          </svg>
        </button>
      )}

      {open && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)] border border-slate-100 overflow-hidden z-50">

          {/* ── Category view ── */}
          {!activeCategory && (
            <>
              {/* Category list */}
              <div className="py-1.5 max-h-[260px] overflow-y-auto">
                {filteredCategories.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No categories found</p>
                ) : filteredCategories.map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => { setActiveCategory(cat.key); setItemSearch(''); }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-slate-50 transition-colors"
                  >
                    <Icon icon={cat.icon} width="16" className="text-slate-400 flex-shrink-0" />
                    <span className="text-[13px] font-medium text-slate-700 flex-1 text-left">{cat.label}</span>
                    <Icon icon="solar:alt-arrow-right-linear" width="12" className="text-slate-300" />
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ── Item view ── */}
          {activeCategory && activeCat && (
            <>
              {/* Header with back */}
              <div className="flex items-center gap-2 px-2.5 pt-2.5 pb-2 border-b border-slate-100">
                <button
                  onClick={() => { setActiveCategory(null); setItemSearch(''); }}
                  className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600 flex-shrink-0"
                >
                  <Icon icon="solar:alt-arrow-left-linear" width="14" />
                </button>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{activeCat.label}</span>
              </div>

              {/* Item search */}
              <div className="p-2 border-b border-slate-100">
                <div className="relative">
                  <Icon icon="solar:magnifer-linear" width="14" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    ref={itemSearchRef}
                    type="text"
                    value={itemSearch}
                    onChange={e => setItemSearch(e.target.value)}
                    placeholder={`Search ${activeCat.label.toLowerCase()}s…`}
                    className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 rounded-lg outline-none text-slate-700 placeholder-slate-400 focus:bg-slate-100 transition-colors"
                  />
                </div>
              </div>

              {/* Item list */}
              <div className="py-1.5 max-h-[220px] overflow-y-auto">
                {filteredItems.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No results found</p>
                ) : filteredItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    className="w-full flex flex-col px-3.5 py-2 hover:bg-slate-50 transition-colors text-left"
                  >
                    <span className="text-[13px] font-medium text-slate-700 leading-tight">{item.label}</span>
                    {item.sub && <span className="text-[11px] text-slate-400 mt-0.5 leading-tight">{item.sub}</span>}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function SparkIcon({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M10 1C10 1 11.2 6.5 13.5 8.5C15.8 10.5 19 10 19 10C19 10 15.8 9.5 13.5 11.5C11.2 13.5 10 19 10 19C10 19 8.8 13.5 6.5 11.5C4.2 9.5 1 10 1 10C1 10 4.2 10.5 6.5 8.5C8.8 6.5 10 1 10 1Z"
        fill="currentColor"
      />
    </svg>
  );
}

type EntityActionType = 'contact' | 'company' | 'product';

interface EntityAction {
  type: EntityActionType;
  label: string;
  contact?: ContactDetail;
  company?: Company;
  product?: Product;
}

interface DocumentCard {
  type: 'quote' | 'invoice';
  quotation?: Quotation;
  invoice?: Invoice;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  entityAction?: EntityAction;
  documentCard?: DocumentCard;
}

const THINKING_PHRASES = [
  'Brewing something up', 'Almost there', 'One moment', 'Bear with me',
  'Give me a sec', 'Working some magic', 'Let me check on that',
  'Pulling some strings', 'Getting the good stuff', 'On the case',
  'Digging in', 'On it', 'Hang tight', 'Working on it',
  'Looking into it', 'Just a moment', 'Cooking something up',
  'Connecting the dots', 'Piecing it together', 'Getting that for you',
  'One sec', 'Hold that thought', 'Rounding things up',
  'Checking on that', 'Putting it together', 'Grabbing the details',
  'Let me look', 'Sorting it out', 'Doing a quick check',
  'Pulling that up', 'Almost got it', 'Working my way through',
  'Let me dig into that', 'Getting things lined up', 'Right on it',
  'Rummaging through the data', 'Tracking that down', 'Spinning up',
  'Getting the wheels turning', 'Scouting for answers', 'Firing it up',
  'Lining things up', 'Chasing that down', 'Making it happen',
  'Fetching the details', 'Running a quick check', 'Crunching away',
  'Sniffing that out', 'Wrapping my head around it',
];

const ACTION_CHIPS = [
  { label: 'Generate Quote',  icon: 'solar:file-text-linear' },
  { label: 'Create Invoice',  icon: 'solar:bill-list-linear' },
  { label: 'Run a Call',      icon: 'solar:phone-linear' },
  { label: 'Send Email',      icon: 'solar:letter-linear' },
];

const MOCK_RESPONSES: Record<string, string> = {
  default:  `Here's what I found:\n\n• Your pipeline has **12 active deals** totaling ฿2.4M in potential revenue\n• 3 quotes are awaiting client response for more than 7 days\n• Top performing account this month: **Apex Technologies** (฿480K)\n\nWould you like me to draft outreach for any of the stalled deals, or dig deeper into a specific account?`,
  email:    `Here's a follow-up email draft:\n\n**Subject:** Following up on your quote — [Company Name]\n\nHi [Name],\n\nI wanted to check in on the proposal we sent over last week. We'd love to answer any questions or adjust terms to better fit your needs.\n\nWould a quick 15-minute call this week work for you?\n\nBest,\n[Your Name]\n\nWant me to personalize this for a specific contact?`,
  pipeline: `Here's your pipeline summary:\n\n**Total Active Deals:** 12\n**Combined Value:** ฿2,400,000\n\n• 🟢 4 deals in negotiation stage\n• 🟡 5 deals awaiting client decision\n• 🔴 3 deals overdue for follow-up\n\nYour close rate this quarter is **34%**, up 8% from last quarter. Shall I highlight the at-risk deals?`,
  accounts: `**Top Accounts by Revenue (This Month):**\n\n1. Apex Technologies — ฿480,000\n2. Nova Retail Group — ฿312,000\n3. Meridian Logistics — ฿275,500\n4. SkyLink Partners — ฿198,000\n5. Crestwood Holdings — ฿145,000\n\nApex Technologies has increased activity by 40% — a strong upsell opportunity. Want me to prepare a proposal?`,
};

/* ── Mock entity factories ─────────────────────────────────── */
function toTitleCase(str: string): string {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

function createMockContact(name: string): ContactDetail {
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

function createMockCompany(name: string): Company {
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

function createMockProduct(name: string): Product {
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

function createMockQuotation(clientName: string): Quotation {
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

function createMockInvoice(clientName: string): Invoice {
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

/* ── AI response engine ───────────────────────────────────── */
interface AIResponseResult {
  content: string;
  entityAction?: EntityAction;
  documentCard?: DocumentCard;
}

function getAIResponse(input: string): AIResponseResult {
  const lower = input.toLowerCase();

  // Create contact
  const contactMatch = lower.match(/create\s+(?:a\s+)?(?:new\s+)?contact\s+(.+)/);
  if (contactMatch) {
    const name = toTitleCase(contactMatch[1].trim());
    const entity = createMockContact(name);
    return {
      content: `Done! I've created a new contact for **${name}**.\n\nHere's what I set up:\n\n• Email: ${entity.email}\n• Company: ${entity.company}\n• Owner: Richard\n\nYou can view the full profile or make edits from there.`,
      entityAction: { type: 'contact', label: `View ${name}`, contact: entity },
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
    };
  }

  // Existing keyword matches
  if (lower.includes('email') || lower.includes('follow')) return { content: MOCK_RESPONSES.email };
  if (lower.includes('pipeline') || lower.includes('summary')) return { content: MOCK_RESPONSES.pipeline };
  if (lower.includes('account') || lower.includes('analy')) return { content: MOCK_RESPONSES.accounts };
  return { content: MOCK_RESPONSES.default };
}

interface AIProxyPageProps {
  onNavigateToNotifications?: () => void;
  onViewContact?: (contact: ContactDetail) => void;
  onViewCompany?: (company: Company) => void;
  onViewProduct?: (product: Product) => void;
  onViewQuote?: (quotation: Quotation) => void;
  onCreateInvoiceFromQuote?: (quotation: Quotation) => void;
  onViewInvoice?: () => void;
  onOpenConnectors?: () => void;
  connectedTools?: Record<string, boolean>;
  initialContext?: { category: string; label: string } | null;
  onConsumeInitialContext?: () => void;
  fabEnabled?: boolean;
  onFabEnabledChange?: (enabled: boolean) => void;
}

const CONNECT_TOOLS = [
  { id: 'gcal',   icon: 'logos:google-calendar',  label: 'Calendar' },
  { id: 'gdrive', icon: 'logos:google-drive',     label: 'Drive' },
  { id: 'slack',  icon: 'logos:slack-icon',       label: 'Slack' },
  { id: 'gmail',  icon: 'logos:google-gmail',     label: 'Gmail' },
];


export default function AIProxyPage({ onNavigateToNotifications, onViewContact, onViewCompany, onViewProduct, onViewQuote, onCreateInvoiceFromQuote, onViewInvoice, onOpenConnectors, connectedTools = {}, initialContext, onConsumeInitialContext, fabEnabled = true, onFabEnabledChange }: AIProxyPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showConnectBanner, setShowConnectBanner] = useState(true);
  const [bannerClosing, setBannerClosing] = useState(false);
  const [proxySelected, setProxySelected] = useState<{ category: string; label: string } | null>(null);
  const [thinkingPhrase, setThinkingPhrase] = useState('thinking');
  const [showShareBanner, setShowShareBanner] = useState(true);
  const phraseQueueRef = useRef<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialContext) {
      setProxySelected(initialContext);
      onConsumeInitialContext?.();
    }
  }, [initialContext]);

  const getNextPhrase = () => {
    if (phraseQueueRef.current.length === 0) {
      const shuffled = [...THINKING_PHRASES];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      phraseQueueRef.current = shuffled;
    }
    return phraseQueueRef.current.pop()!;
  };
  const hasConversation = messages.length > 0;

  const handleDismissBanner = () => {
    setBannerClosing(true);
    setTimeout(() => { setShowConnectBanner(false); setBannerClosing(false); }, 350);
  };

  const connectedCount = CONNECT_TOOLS.filter(t => connectedTools[t.id]).length;
  const hasConnections = connectedCount > 0;
  const visibleTools = hasConnections ? CONNECT_TOOLS.filter(t => connectedTools[t.id]) : CONNECT_TOOLS;

  const connectBanner = showConnectBanner && (
    <div
      style={{ transition: 'opacity 350ms ease, transform 350ms cubic-bezier(0.4,0,0.2,1), max-height 350ms cubic-bezier(0.4,0,0.2,1)' }}
      className={`overflow-hidden ${bannerClosing ? 'opacity-0 -translate-y-1 max-h-0' : 'opacity-100 translate-y-0 max-h-20'}`}
    >
      <div
        onClick={() => onOpenConnectors?.()}
        className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-100/80 rounded-b-2xl border-t border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors"
      >
        <Icon icon="solar:tuning-2-linear" width="14" className="text-slate-400 flex-shrink-0" />
        <span className="text-xs text-slate-500 font-medium flex-1">
          {hasConnections ? `${connectedCount} tool${connectedCount > 1 ? 's' : ''} connected` : 'Connect your tools'}
        </span>
        <div className="flex items-center gap-2">
          {visibleTools.map(tool => (
            <span key={tool.label} title={tool.label} className="w-4 h-4 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity">
              <Icon icon={tool.icon} width="14" />
            </span>
          ))}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); handleDismissBanner(); }}
          className="ml-1 text-slate-300 hover:text-slate-500 transition-colors"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
      </div>
    </div>
  );

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (hasConversation && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, hasConversation]);

  const handleSubmit = (content?: string) => {
    const text = (content ?? inputValue).trim();
    if (!text || isTyping) return;

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }]);
    setInputValue('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
    setThinkingPhrase(getNextPhrase());
    setIsTyping(true);

    setTimeout(() => {
      const response = getAIResponse(text);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        entityAction: response.entityAction,
        documentCard: response.documentCard,
      }]);
      setIsTyping(false);
      inputRef.current?.focus();
    }, 3500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const renderContent = (text: string) =>
    text.split('\n').map((line, i) => (
      <p
        key={i}
        className={line === '' ? 'h-3' : 'leading-relaxed'}
        dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }}
      />
    ));

  /* ── Landing state ────────────────────────────────────────── */
  if (!hasConversation) {
    return (
      <div className="flex-1 flex flex-col bg-[#fafafa] overflow-hidden">
        {/* FAB toggle — top-left */}
        <button
          onClick={() => onFabEnabledChange?.(!fabEnabled)}
          title={fabEnabled ? 'Task Assistant is active on other pages' : 'Task Assistant is hidden — click to enable'}
          className="absolute top-5 left-8 z-30 group flex items-center gap-2 h-9 transition-all"
        >
          <span className="text-[11.5px] font-medium text-slate-400 select-none">Task Assistant</span>
          <div className={`relative w-8 h-[18px] rounded-full transition-colors duration-200 ${fabEnabled ? 'bg-slate-900' : 'bg-slate-200'}`}>
            <div className={`absolute top-[2px] w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${fabEnabled ? 'translate-x-[14px]' : 'translate-x-[2px]'}`} />
          </div>
        </button>
        {/* Bell — top-right */}
        <div className="absolute top-5 right-8 z-30">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="group transition-all flex outline-none text-slate-400 hover:text-slate-600 w-9 h-9 rounded-xl bg-white border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.04)] relative items-center justify-center hover:border-slate-300 hover:shadow-[0_1px_3px_rgba(0,0,0,0.06)] active:scale-[0.97]"
            >
              <Icon icon="solar:bell-linear" width="18" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white">
                <span className="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75 animate-ping"></span>
              </span>
            </button>
            <NotificationCard
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
              onViewAll={() => {
                setShowNotifications(false);
                onNavigateToNotifications?.();
              }}
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Upper: fixed height, heading anchored at bottom */}
          <div className="h-[35%] flex flex-col items-center justify-end px-6 pb-6 flex-shrink-0">
            <div className="w-full max-w-2xl flex flex-col items-center">

              {/* Eyebrow label */}
              <div className="flex items-center gap-1.5 mb-5">
                <SparkIcon size={13} className="text-indigo-600" />
                <span className="text-sm text-slate-500 font-medium">AI-powered sales intelligence</span>
              </div>

              {/* Heading */}
              <h1 className="text-[2.6rem] text-slate-900 text-center leading-[1.15] tracking-tight mb-3" style={{ fontFamily: "'DM Serif Text', serif" }}>
                Ready when you are, Richard.
              </h1>

              {/* Subtitle */}
              <p className="text-[15px] text-slate-400 text-center leading-relaxed">
                Your AI sales agent — chat, query data, take action, and run calls.
              </p>

            </div>
          </div>

          {/* Lower: input + chips, grows downward */}
          <div className="flex flex-col items-center px-6 pb-10 pt-6">
            <div className="w-full max-w-2xl flex flex-col items-center">

              {/* Input card */}
              <div className={`w-full bg-white rounded-2xl border transition-all duration-200 mb-4 ${
                isFocused
                  ? 'border-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.08)]'
                  : 'border-slate-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:border-slate-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]'
              }`}>
                {/* Textarea */}
                <div className="px-4 pt-4 pb-2">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="How can I help you today?"
                    className="w-full bg-transparent text-slate-800 placeholder-slate-300 text-[15px] resize-none outline-none leading-6 min-h-[52px] max-h-40"
                    rows={2}
                    onInput={(e) => {
                      const t = e.target as HTMLTextAreaElement;
                      t.style.height = 'auto';
                      t.style.height = `${Math.min(t.scrollHeight, 160)}px`;
                    }}
                  />
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-1 px-3 py-2.5">
                  <button className="flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors px-1">
                    <svg width="18" height="18" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 4V18M4 11H18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                    </svg>
                  </button>

                  {/* Right: Proxy pill + Send */}
                  <div className="ml-auto flex items-center gap-2">
                    <ProxyDropdown selected={proxySelected} onSelectedChange={setProxySelected} />
                    <button
                      onClick={() => handleSubmit()}
                      disabled={!inputValue.trim()}
                      className="w-8 h-8 flex items-center justify-center bg-slate-900 hover:bg-slate-700 disabled:opacity-30 text-white rounded-full transition-colors shadow-sm"
                    >
                      <Icon icon="solar:arrow-up-outline" width="16" />
                    </button>
                  </div>
                </div>
              {connectBanner}
              </div>

              {/* Action chips — single row */}
              <div className="w-full flex gap-2 justify-center mt-2">
                {ACTION_CHIPS.map((chip) => (
                      <button
                        key={chip.label}
                        onClick={() => handleSubmit(chip.label)}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-slate-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] text-slate-500 text-sm font-medium transition-all whitespace-nowrap"
                      >
                        <Icon icon={chip.icon} width="15" className="text-slate-400 flex-shrink-0" />
                        {chip.label}
                      </button>
                    ))}
              </div>

            </div>
          </div>

          {/* Referral banner — pinned to bottom */}
          {showShareBanner && (
            <div className="mt-auto px-6 pb-6 pt-8 flex justify-center">
              <div className="group relative max-w-md w-full rounded-2xl border border-amber-100/80 bg-gradient-to-r from-amber-50/80 via-white to-amber-50/40 px-5 py-4 flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <Icon icon="solar:gift-bold" width="18" className="text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-slate-800">Invite a friend, get 500 credits</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">They get 500 too. Everyone wins.</p>
                </div>
                <button
                  onClick={() => {/* Wire to share functionality in prod */}}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-[12px] font-semibold rounded-xl hover:bg-slate-800 transition-all active:scale-[0.97] flex-shrink-0"
                >
                  Invite
                  <Icon icon="solar:arrow-right-linear" width="13" />
                </button>
                <button
                  onClick={() => setShowShareBanner(false)}
                  className="absolute -top-2 -right-2 w-[20px] h-[20px] flex items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm text-slate-300 hover:text-slate-500 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                >
                  <svg width="7" height="7" viewBox="0 0 10 10" fill="none"><path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/></svg>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    );
  }

  /* ── Conversation state ───────────────────────────────────── */
  return (
    <div className="flex-1 flex flex-col bg-[#fafafa] overflow-hidden">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-[#fafafa]/80 backdrop-blur-xl px-8 py-3.5 flex items-center">
        {/* FAB toggle — left */}
        <button
          onClick={() => onFabEnabledChange?.(!fabEnabled)}
          title={fabEnabled ? 'Task Assistant is active on other pages' : 'Task Assistant is hidden — click to enable'}
          className="group flex items-center gap-2 h-9 transition-all"
        >
          <span className="text-[11.5px] font-medium text-slate-400 select-none">Task Assistant</span>
          <div className={`relative w-8 h-[18px] rounded-full transition-colors duration-200 ${fabEnabled ? 'bg-slate-900' : 'bg-slate-200'}`}>
            <div className={`absolute top-[2px] w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${fabEnabled ? 'translate-x-[14px]' : 'translate-x-[2px]'}`} />
          </div>
        </button>
        <div className="ml-auto flex items-center gap-2">
          {/* New Task */}
          <button
            onClick={() => { setMessages([]); setInputValue(''); setProxySelected(null); }}
            className="group transition-all flex items-center gap-1.5 outline-none text-slate-400 hover:text-slate-600 bg-white border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-slate-300 hover:shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-3 h-9 rounded-xl active:scale-[0.97]"
          >
            <Icon icon="solar:pen-new-square-linear" width="15" className="flex-shrink-0" />
            <span className="text-[13px] font-medium">New Task</span>
          </button>
          {/* Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="group transition-all flex outline-none text-slate-400 hover:text-slate-600 w-9 h-9 rounded-xl bg-white border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.04)] relative items-center justify-center hover:border-slate-300 hover:shadow-[0_1px_3px_rgba(0,0,0,0.06)] active:scale-[0.97]"
            >
              <Icon icon="solar:bell-linear" width="18" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white">
                <span className="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75 animate-ping"></span>
              </span>
            </button>
            <NotificationCard
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
              onViewAll={() => {
                setShowNotifications(false);
                onNavigateToNotifications?.();
              }}
            />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-8">
        <div className="max-w-[720px] mx-auto space-y-8">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className=""
            >
              {message.role === 'user' ? (
                <div className="flex justify-end">
                  <div className="max-w-[72%] rounded-2xl px-5 py-3.5 bg-slate-100/80 text-slate-900 text-[15px] leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
              ) : (
                <div className="group">
                  <div className="text-[15px] text-slate-800 leading-relaxed pl-5 space-y-1">
                    {renderContent(message.content)}
                  </div>

                  {/* Entity inline preview */}
                  {message.entityAction && (() => {
                    const action = message.entityAction!;
                    const viewLabel = action.type === 'contact' ? 'View Contact' : action.type === 'company' ? 'View Company' : 'View Product';

                    if (action.type === 'contact' && action.contact) {
                      const c = action.contact;
                      return (
                        <div className="mt-3 ml-5">
                          <div className="border-l-[1.5px] border-slate-200 pl-4 py-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[13px] font-medium text-slate-700">{c.name}</span>
                              {c.title && <><span className="text-slate-300">·</span><span className="text-[11px] text-slate-400">{c.title}</span></>}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              {c.email && <span className="text-[12px] text-slate-400">{c.email}</span>}
                              {c.company && <><span className="text-slate-300">·</span><span className="text-[12px] text-slate-400">{c.company}</span></>}
                              {c.owner && <><span className="text-slate-300">·</span><span className="text-[12px] text-slate-400">Owner: {c.owner.name}</span></>}
                            </div>
                            <button
                              onClick={() => onViewContact?.(c)}
                              className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 text-[11px] font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200/80 hover:text-slate-700 rounded-lg transition-all active:scale-[0.97]"
                            >
                              <Icon icon="solar:arrow-right-up-linear" width="13" />
                              {viewLabel}
                            </button>
                          </div>
                        </div>
                      );
                    }

                    if (action.type === 'company' && action.company) {
                      const co = action.company;
                      return (
                        <div className="mt-3 ml-5">
                          <div className="border-l-[1.5px] border-slate-200 pl-4 py-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[13px] font-medium text-slate-700">{co.name}</span>
                              {co.type && <><span className="text-slate-300">·</span><span className="text-[11px] text-slate-400">{co.type}</span></>}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              {co.industry && <span className="text-[12px] text-slate-400">{co.industry}</span>}
                              {co.lifecycleStage && <><span className="text-slate-300">·</span><span className="text-[12px] text-slate-400">{co.lifecycleStage}</span></>}
                              {co.owner && <><span className="text-slate-300">·</span><span className="text-[12px] text-slate-400">Owner: {co.owner.name}</span></>}
                            </div>
                            <button
                              onClick={() => onViewCompany?.(co)}
                              className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 text-[11px] font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200/80 hover:text-slate-700 rounded-lg transition-all active:scale-[0.97]"
                            >
                              <Icon icon="solar:arrow-right-up-linear" width="13" />
                              {viewLabel}
                            </button>
                          </div>
                        </div>
                      );
                    }

                    if (action.type === 'product' && action.product) {
                      const p = action.product;
                      return (
                        <div className="mt-3 ml-5">
                          <div className="border-l-[1.5px] border-slate-200 pl-4 py-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[13px] font-medium text-slate-700">{p.name}</span>
                              <span className="text-slate-300">·</span>
                              <span className={`text-[11px] font-medium ${p.status === 'active' ? 'text-emerald-600' : p.status === 'draft' ? 'text-slate-400' : 'text-amber-600'}`}>
                                {p.status === 'active' ? 'Active' : p.status === 'draft' ? 'Draft' : p.status === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              <span className="text-[12px] text-slate-400">SKU: {p.sku}</span>
                              <span className="text-slate-300">·</span>
                              <span className="text-[12px] font-medium text-slate-600">฿{p.price.toLocaleString()}</span>
                              <span className="text-slate-300">·</span>
                              <span className="text-[12px] text-slate-400">{p.stock} in stock</span>
                            </div>
                            <button
                              onClick={() => onViewProduct?.(p)}
                              className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 text-[11px] font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200/80 hover:text-slate-700 rounded-lg transition-all active:scale-[0.97]"
                            >
                              <Icon icon="solar:arrow-right-up-linear" width="13" />
                              {viewLabel}
                            </button>
                          </div>
                        </div>
                      );
                    }

                    return null;
                  })()}

                  {/* Document card (quote / invoice) */}
                  {message.documentCard && message.documentCard.type === 'quote' && message.documentCard.quotation && (() => {
                    const q = message.documentCard.quotation;
                    const validDate = new Date(q.validUntil);
                    const formattedValid = validDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    const statusColor = q.status === 'published' ? 'text-emerald-600' : q.status === 'sent' ? 'text-blue-600' : 'text-slate-400';
                    const statusLabel = q.status === 'published' ? 'Published' : q.status === 'sent' ? 'Sent' : 'Draft';
                    return (
                      <div className="mt-3 ml-5">
                        <div className="border-l-[1.5px] border-slate-200 pl-4 py-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[13px] font-medium text-slate-700 tracking-tight">{q.number}</span>
                            <span className="text-slate-300">·</span>
                            <span className={`text-[11px] font-medium ${statusColor}`}>{statusLabel}</span>
                          </div>
                          <p className="text-[12px] text-slate-400 mt-0.5">{q.title}</p>
                          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                            <span className="text-[12px] font-medium text-slate-600">{q.client.name}</span>
                            <span className="text-slate-300">·</span>
                            <span className="text-[12px] text-slate-400">{q.items} items</span>
                            <span className="text-slate-300">·</span>
                            <span className="text-[12px] font-medium text-slate-600">฿{q.amount.toLocaleString()}</span>
                            <span className="text-slate-300">·</span>
                            <span className="text-[12px] text-slate-400">Valid until {formattedValid}</span>
                          </div>
                          <button
                            onClick={() => {
                              const url = new URL(window.location.href);
                              url.searchParams.set('view', 'quote');
                              window.open(url.toString(), '_blank');
                            }}
                            className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 text-[11px] font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200/80 hover:text-slate-700 rounded-lg transition-all active:scale-[0.97]"
                          >
                            <Icon icon="solar:arrow-right-up-linear" width="13" />
                            View Quote
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  {message.documentCard && message.documentCard.type === 'invoice' && message.documentCard.invoice && (() => {
                    const inv = message.documentCard.invoice;
                    const dueDate = new Date(inv.dueDate);
                    const formattedDue = dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    const statusColor = inv.status === 'paid' ? 'text-emerald-600' : inv.status === 'pending' ? 'text-amber-600' : inv.status === 'overdue' ? 'text-red-600' : 'text-slate-400';
                    const statusLabel = inv.status === 'paid' ? 'Paid' : inv.status === 'pending' ? 'Pending' : inv.status === 'overdue' ? 'Overdue' : 'Draft';
                    return (
                      <div className="mt-3 ml-5">
                        <div className="border-l-[1.5px] border-slate-200 pl-4 py-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[13px] font-medium text-slate-700 tracking-tight">{inv.number}</span>
                            <span className="text-slate-300">·</span>
                            <span className={`text-[11px] font-medium ${statusColor}`}>{statusLabel}</span>
                          </div>
                          <p className="text-[12px] text-slate-400 mt-0.5">{inv.title}</p>
                          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                            <span className="text-[12px] font-medium text-slate-600">{inv.client.name}</span>
                            <span className="text-slate-300">·</span>
                            <span className="text-[12px] text-slate-400">{inv.items} items</span>
                            <span className="text-slate-300">·</span>
                            <span className="text-[12px] font-medium text-slate-600">฿{inv.amount.toLocaleString()}</span>
                            <span className="text-slate-300">·</span>
                            <span className="text-[12px] text-slate-400">Due {formattedDue}</span>
                          </div>
                          <button
                            onClick={() => {
                              const url = new URL(window.location.href);
                              url.searchParams.set('view', 'invoice');
                              window.open(url.toString(), '_blank');
                            }}
                            className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 text-[11px] font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200/80 hover:text-slate-700 rounded-lg transition-all active:scale-[0.97]"
                          >
                            <Icon icon="solar:arrow-right-up-linear" width="13" />
                            View Invoice
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="flex items-center gap-1.5 mt-3 pl-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => navigator.clipboard.writeText(message.content)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-medium transition-colors"
                    >
                      <Icon icon="solar:copy-linear" width="13" />
                      Copy
                    </button>
                    <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-medium transition-colors">
                      <Icon icon="solar:refresh-linear" width="13" />
                      Retry
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="animate-in fade-in duration-300">
              <style>{`
                @keyframes spark-shimmer {
                  0%, 100% { opacity: 0.3; transform: scale(0.85); }
                  50% { opacity: 1; transform: scale(1.15); }
                }
                @keyframes text-shimmer {
                  0% { background-position: 200% center; }
                  100% { background-position: -200% center; }
                }
                .thinking-shimmer-text {
                  background: linear-gradient(90deg, #64748b 0%, #64748b 30%, #f1f5f9 50%, #64748b 70%, #64748b 100%);
                  background-size: 300% auto;
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  background-clip: text;
                  animation: text-shimmer 3s ease-in-out infinite;
                }
              `}</style>
              <div className="flex items-center gap-2">
                <span style={{ animation: 'spark-shimmer 3s ease-in-out infinite' }} className="text-slate-400">
                  <SparkIcon size={12} />
                </span>
                <span className="text-[13px] font-normal thinking-shimmer-text">{thinkingPhrase}...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Sticky input */}
      <div className="sticky bottom-0 z-20 bg-slate-50/90 backdrop-blur-xl px-6 py-4">
        <div className="max-w-[720px] mx-auto">
          <div className={`w-full bg-white rounded-2xl transition-all duration-200 border ${
            isFocused
              ? 'border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.08)]'
              : 'border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_18px_rgba(0,0,0,0.07)] hover:border-slate-200/60'
          }`}>
            {/* Credits bar */}
            <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-100/80 rounded-t-2xl border-b border-slate-100">
              <Icon icon="solar:bolt-linear" width="13" className="text-amber-500 flex-shrink-0" />
              <span className="text-xs text-slate-500 flex-1">
                <span className="font-semibold text-slate-600">159K</span> credits remaining
              </span>
              <button className="text-[11px] font-semibold text-slate-600 hover:text-slate-800 transition-colors whitespace-nowrap">
                Get more credits
              </button>
            </div>
            <div className="px-4 pt-3 pb-1">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Keep the conversation going"
                className="w-full bg-transparent text-slate-800 placeholder-slate-300 text-[14px] resize-none outline-none leading-6 min-h-[28px] max-h-32"
                rows={1}
                style={{ height: 'auto' }}
                onInput={(e) => {
                  const t = e.target as HTMLTextAreaElement;
                  t.style.height = 'auto';
                  t.style.height = `${Math.min(t.scrollHeight, 128)}px`;
                }}
              />
            </div>
            <div className="flex items-center gap-1 px-3 py-2.5">
              <button className="flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors px-1">
                <svg width="18" height="18" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 4V18M4 11H18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                </svg>
              </button>
              <div className="ml-auto flex items-center gap-2">
                {proxySelected && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-slate-500">
                    <span>{proxySelected.label}</span>
                  </div>
                )}
                <button
                  onClick={() => handleSubmit()}
                  disabled={!inputValue.trim() || isTyping}
                  className="w-8 h-8 flex items-center justify-center bg-slate-900 hover:bg-slate-700 disabled:opacity-30 text-white rounded-full transition-colors shadow-sm"
                >
                  <Icon icon="solar:arrow-up-outline" width="16" />
                </button>
              </div>
            </div>
          </div>
          <p className="text-center text-[11px] text-slate-300 mt-2.5 tracking-wide">
            Superproxy can make mistakes. Please double-check.
          </p>
        </div>
      </div>
    </div>
  );
}
