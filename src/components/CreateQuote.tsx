import { Icon } from '@iconify/react';
import { useState, useMemo } from 'react';
import AddProductDrawer from './AddProductDrawer';
import Dropdown from './Dropdown';

interface CreateQuoteProps {
  onBack: () => void;
  onPublish?: () => void;
}

interface Workspace {
  id: string;
  name: string;
  logo_url: string | null;
}

interface Contact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company_id: string | null;
  company_name: string | null;
  title: string | null;
}

interface Company {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  website: string | null;
  city: string | null;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  sku: string | null;
  category: string | null;
  is_custom: boolean;
}

interface LineItem {
  id: string;
  product_id: string;
  product_name: string;
  description: string | null;
  quantity: number;
  unit_price: number;
  total: number;
}

const CONTACTS: Contact[] = [
  {
    id: '1',
    name: 'Let Cruz',
    email: 'vcc.letcruz@myyah.com',
    phone: '+639064636955',
    company_id: null,
    company_name: null,
    title: null,
  },
  {
    id: '2',
    name: 'Hailey Collins',
    email: 'hailey@riggedparts.com',
    phone: '+17135558235',
    company_id: '2',
    company_name: 'Notion',
    title: 'Client',
  },
  {
    id: '3',
    name: 'Wang Wen',
    email: 'melwyn.arrubio@yahoo.com',
    phone: '+639175328910',
    company_id: '3',
    company_name: 'SpaceX',
    title: 'Client',
  },
  {
    id: '4',
    name: 'Khim Tanglao',
    email: 'metriccon.purchasing@gmail.com',
    phone: '+639088938387',
    company_id: null,
    company_name: null,
    title: null,
  },
  {
    id: '5',
    name: 'Mac Mill',
    email: 'mac@m.com',
    phone: null,
    company_id: '4',
    company_name: 'Apple',
    title: 'Purchaser',
  },
  {
    id: '6',
    name: 'Micaela Pena',
    email: 'micaela.pena@gmail.com',
    phone: '+639171337142',
    company_id: null,
    company_name: null,
    title: null,
  },
  {
    id: '7',
    name: 'Gillian Guiang',
    email: null,
    phone: '+639178102367',
    company_id: null,
    company_name: null,
    title: 'Interior Designer',
  },
];

const COMPANIES: Company[] = [
  {
    id: '1',
    name: 'Superproxy Inc.',
    address: '123 Tech Street, Manila',
    phone: '+639175328910',
    website: 'superproxy.com',
    city: 'Manila',
  },
  {
    id: '2',
    name: 'Notion',
    address: null,
    phone: '+17135558235',
    website: 'notion.so',
    city: 'San Francisco',
  },
  {
    id: '3',
    name: 'SpaceX',
    address: 'Rocket Road',
    phone: '+13105551234',
    website: 'spacex.com',
    city: 'Hawthorne',
  },
  {
    id: '4',
    name: 'Apple',
    address: 'One Apple Park Way',
    phone: null,
    website: 'apple.com',
    city: 'Cupertino',
  },
  {
    id: '5',
    name: 'Acme Corp',
    address: null,
    phone: '+12125559876',
    website: 'acme.com',
    city: 'New York',
  },
];

const STEPS = [
  { id: 1, label: 'Quote Details', active: true },
  { id: 2, label: 'Buyer Info', active: false },
  { id: 3, label: 'Your Info', active: false },
  { id: 4, label: 'Line Items', active: false },
  { id: 5, label: 'Signature', active: false },
  { id: 6, label: 'Terms & Expiry', active: false },
  { id: 7, label: 'Review', active: false },
];

const CURRENCIES = [
  { value: 'PHP', label: 'PHP (₱)' },
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'AUD', label: 'AUD (A$)' },
];

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'PREFAB CONTAINER',
    description: 'Standard prefab container unit',
    price: 295000.00,
    sku: 'PC-001',
    category: 'Construction',
    is_custom: false,
  },
  {
    id: '2',
    name: 'Smart Prefab Container Office',
    description: 'Premium smart office container with modern amenities',
    price: 598000.00,
    sku: 'SPCO-001',
    category: 'Construction',
    is_custom: false,
  },
  {
    id: '3',
    name: 'Installation Fee',
    description: 'Professional installation service',
    price: 50000.00,
    sku: null,
    category: 'Services',
    is_custom: true,
  },
  {
    id: '4',
    name: 'Electrical Wiring Setup',
    description: 'Complete electrical wiring and setup',
    price: 35000.00,
    sku: null,
    category: 'Services',
    is_custom: true,
  },
  {
    id: '5',
    name: 'Modular Container House',
    description: 'Modern modular container home with 2 bedrooms',
    price: 850000.00,
    sku: 'MCH-002',
    category: 'Construction',
    is_custom: false,
  },
  {
    id: '6',
    name: 'Container Pool',
    description: 'Shipping container converted into swimming pool',
    price: 420000.00,
    sku: 'CP-003',
    category: 'Leisure',
    is_custom: false,
  },
  {
    id: '7',
    name: 'Site Preparation',
    description: 'Land preparation and foundation work',
    price: 75000.00,
    sku: null,
    category: 'Services',
    is_custom: true,
  },
];

const MOCK_WORKSPACE = {
  id: 'mock-workspace-1',
  name: 'Superproxy Inc.',
  logo_url: '/superproxy_logo_(2).jpg',
  address: '123 Tech Street, Manila',
};

const MOCK_USER = {
  user_name: 'Melwyn Arrubio',
  user_email: 'melwyn@superproxy.com',
  position: 'Sales Manager',
  phone: '+639175328910',
  profile_photo_url: null,
};

export default function CreateQuote({ onBack, onPublish }: CreateQuoteProps) {
  const [quoteName, setQuoteName] = useState('Untitled Quote');
  const [currency, setCurrency] = useState('PHP');
  const [currentStep, setCurrentStep] = useState(1);
  const [companyData] = useState<Workspace>(MOCK_WORKSPACE);
  const [selectedContactId, setSelectedContactId] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentUser] = useState(MOCK_USER);
  const [workspaceDetails] = useState(MOCK_WORKSPACE);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [productFilter, setProductFilter] = useState<'all' | 'team' | 'custom'>('all');
  const [justAddedProductId, setJustAddedProductId] = useState<string | null>(null);
  const [taxEnabled, setTaxEnabled] = useState(false);
  const [taxRate, setTaxRate] = useState(0);
  const [discountEnabled, setDiscountEnabled] = useState(false);
  const [discountRate, setDiscountRate] = useState(0);
  const [isAddProductDrawerOpen, setIsAddProductDrawerOpen] = useState(false);
  const [signatureOption, setSignatureOption] = useState<'none' | 'written' | 'electronic'>('written');
  const [additionalSignatories, setAdditionalSignatories] = useState<string[]>([]);
  const [commentsToBuyer, setCommentsToBuyer] = useState('');
  const [expiryPeriod, setExpiryPeriod] = useState<'30' | '60' | '90' | 'custom'>('90');
  const [customExpiryDays, setCustomExpiryDays] = useState(30);
  const [isEditingTerms, setIsEditingTerms] = useState(false);
  const [termsOfSale, setTermsOfSale] = useState(
    `1. Payment Terms: Payment is due within 30 days of invoice date. Late payments may incur a 1.5% monthly interest charge.\n\n2. Delivery: Estimated delivery times are provided in good faith but are not guaranteed. We are not liable for delays beyond our control.\n\n3. Returns & Refunds: Products may be returned within 14 days of delivery in original condition. Custom products are non-refundable.\n\n4. Warranty: All products come with a standard manufacturer's warranty. Extended warranties are available upon request.\n\n5. Limitation of Liability: Our liability is limited to the total value of this quotation. We are not liable for indirect or consequential damages.`
  );

  const mockReferenceNumber = useMemo(() => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 900) + 100;
    return `QT-${year}-${randomNum}`;
  }, []);

  const handleContactChange = (contactId: string) => {
    setSelectedContactId(contactId);
    const contact = CONTACTS.find((c) => c.id === contactId);
    if (contact?.company_id) {
      setSelectedCompanyId(contact.company_id);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const today = useMemo(() => new Date(), []);

  const validUntil = useMemo(() => {
    const date = new Date(today);
    if (expiryPeriod === 'custom') {
      date.setDate(date.getDate() + customExpiryDays);
    } else {
      date.setDate(date.getDate() + parseInt(expiryPeriod));
    }
    return date;
  }, [today, expiryPeriod, customExpiryDays]);

  const selectedContact = useMemo(
    () => CONTACTS.find((c) => c.id === selectedContactId),
    [selectedContactId]
  );

  const selectedCompany = useMemo(
    () => COMPANIES.find((c) => c.id === selectedCompanyId),
    [selectedCompanyId]
  );

  const handleNextStep = () => {
    if (currentStep < 7) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePublish = () => {
    if (onPublish) {
      onPublish();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddProduct = (product: Product) => {
    const existingItem = lineItems.find((item) => item.product_id === product.id);

    if (existingItem) {
      setLineItems(
        lineItems.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.unit_price }
            : item
        )
      );
    } else {
      const newItem: LineItem = {
        id: `${Date.now()}-${product.id}`,
        product_id: product.id,
        product_name: product.name,
        description: product.description,
        quantity: 1,
        unit_price: product.price,
        total: product.price,
      };
      setLineItems([...lineItems, newItem]);
    }

    setJustAddedProductId(product.id);
    setTimeout(() => setJustAddedProductId(null), 500);  // Faster flash
    setIsProductDropdownOpen(false);
    setProductSearchQuery('');
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    setLineItems(
      lineItems.map((item) =>
        item.id === itemId ? { ...item, quantity, total: quantity * item.unit_price } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setLineItems(lineItems.filter((item) => item.id !== itemId));
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTax = () => {
    if (!taxEnabled || taxRate <= 0) return 0;
    return calculateSubtotal() * (taxRate / 100);
  };

  const calculateDiscount = () => {
    if (!discountEnabled || discountRate <= 0) return 0;
    return calculateSubtotal() * (discountRate / 100);
  };

  const calculateFinalTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    const discount = calculateDiscount();
    return subtotal + tax - discount;
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(productSearchQuery.toLowerCase());
      const matchesFilter =
        productFilter === 'all' ||
        (productFilter === 'team' && !product.is_custom) ||
        (productFilter === 'custom' && product.is_custom);
      return matchesSearch && matchesFilter;
    });
  }, [products, productSearchQuery, productFilter]);

  const teamProducts = useMemo(
    () => filteredProducts.filter((p) => !p.is_custom),
    [filteredProducts]
  );

  const customProducts = useMemo(
    () => filteredProducts.filter((p) => p.is_custom),
    [filteredProducts]
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-[#F8FAFC] z-[200] flex flex-col overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[#F8FAFC]">
      </div>

      <div className="flex-1 flex flex-col bg-white/90 backdrop-blur-2xl rounded-[24px] border border-white/50 shadow-2xl overflow-hidden relative ring-1 ring-slate-900/5 my-2 mx-2 h-[calc(100vh-1rem)]">
        <header className="border-b border-slate-200 bg-white flex flex-col shrink-0 relative overflow-hidden">
          <div className="flex pt-4 pr-6 pb-4 pl-6 items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-all"
              >
                <Icon icon="solar:arrow-left-linear" width="20" />
              </button>
              <div className="h-6 w-px bg-slate-200"></div>
              <div>
                <div className="flex items-center gap-2 text-[10px] font-semibold tracking-widest uppercase text-slate-500 mb-1">
                  <span>New Quotation</span>
                </div>
                <h1 className="flex items-center gap-2 text-lg font-semibold text-slate-900 tracking-tight">
                  <span>{quoteName}</span>
                  <Icon
                    icon="solar:pen-linear"
                    className="text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                    width="14"
                  />
                </h1>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              {currentStep > 1 && (
                <button
                  onClick={handlePrevStep}
                  className="hover:bg-slate-100 hover:text-slate-900 transition-all focus:ring-2 focus:ring-slate-200 focus:outline-none active:scale-[0.98] text-sm font-medium text-slate-600 bg-white h-10 border border-slate-200 rounded-lg px-5"
                >
                  Back
                </button>
              )}
              <button className="hover:bg-slate-100 hover:text-slate-900 transition-all focus:ring-2 focus:ring-slate-200 focus:outline-none active:scale-[0.98] text-sm font-medium text-slate-600 bg-white h-10 border border-slate-200 rounded-lg px-5">
                Save
              </button>
              {currentStep === 7 ? (
                <button
                  onClick={handlePublish}
                  className="group h-10 flex items-center gap-2 px-5 rounded-lg text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 hover:shadow-lg transition-all focus:ring-2 focus:ring-slate-300 focus:outline-none active:scale-[0.98]"
                >
                  <span>Publish Quote</span>
                  <Icon
                    icon="solar:check-circle-linear"
                    className="group-hover:scale-110 transition-transform"
                    width="16"
                  />
                </button>
              ) : (
                <button
                  onClick={handleNextStep}
                  className="group h-10 flex items-center gap-2 px-5 rounded-lg text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 hover:shadow-lg transition-all focus:ring-2 focus:ring-slate-300 focus:outline-none active:scale-[0.98]"
                >
                  <span>Next Step</span>
                  <Icon
                    icon="solar:arrow-right-linear"
                    className="group-hover:translate-x-0.5 transition-transform"
                    width="16"
                  />
                </button>
              )}
            </div>
          </div>

          <div className="px-6 border-t border-slate-200 bg-white relative z-10">
            <div className="flex items-center gap-0 overflow-x-auto no-scrollbar py-0">
              {STEPS.map((step, index) => {
                const isCompleted = completedSteps.includes(step.id);
                const isActive = step.id === currentStep;
                const isClickable = step.id <= currentStep || completedSteps.includes(step.id);

                return (
                  <div key={step.id} className="flex items-center flex-shrink-0">
                    <div
                      onClick={() => isClickable && setCurrentStep(step.id)}
                      className={`relative flex items-center gap-2.5 px-4 py-3 transition-all ${
                        isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
                      } ${
                        isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold transition-all ${
                          isCompleted && !isActive
                            ? 'bg-slate-800 text-white'
                            : isActive
                            ? 'bg-slate-800 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {step.id}
                      </div>
                      <span
                        className={`text-[12px] font-medium whitespace-nowrap transition-colors ${
                          isActive
                            ? 'text-slate-800'
                            : isCompleted
                            ? 'text-slate-600'
                            : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </span>
                      {isActive && (
                        <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-slate-800 rounded-full" />
                      )}
                    </div>
                    {index < STEPS.length - 1 && (
                      <div className="w-5 h-px bg-slate-200 flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </header>

        <div className="flex-1 relative overflow-hidden flex flex-col lg:flex-row">
          <div className="lg:w-[35%] xl:w-[30%] overflow-y-auto overflow-x-visible z-20 flex flex-col bg-white w-full border-slate-200 border-r relative">

            {currentStep === 1 && (
              <>
                <div className="lg:p-8 w-full max-w-md mx-auto pt-6 px-6 pb-6 space-y-8 relative z-10">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Quote Details</h2>
                    <p className="text-sm text-slate-500">Define the core details of your quotation.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2 group">
                      <label
                        htmlFor="quoteName"
                        className="flex items-center justify-between uppercase text-xs font-semibold text-slate-600 tracking-wide"
                      >
                        <span>Quote Name</span>
                        <span className="text-slate-500 opacity-0 group-focus-within:opacity-100 transition-opacity">
                          Required
                        </span>
                      </label>
                      <div className="relative transition-all duration-200 focus-within:transform focus-within:-translate-y-0.5">
                        <input
                          type="text"
                          id="quoteName"
                          value={quoteName}
                          onChange={(e) => setQuoteName(e.target.value || 'Untitled Quote')}
                          className="peer w-full bg-white border border-slate-200 rounded-lg px-4 py-3 pl-10 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-800 focus:bg-white transition-all shadow-sm hover:shadow-md hover:border-slate-300"
                          placeholder="e.g. Website Redesign"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 peer-focus:text-slate-500 transition-colors">
                          <Icon icon="solar:pen-new-square-linear" width="18" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto p-6 bg-gradient-to-br from-slate-50/80 to-slate-50 border-t border-slate-200/50 relative z-10 backdrop-blur-sm">
                  <div className="flex gap-3 items-start">
                    <Icon icon="solar:info-circle-linear" className="text-slate-400 mt-0.5" width="18" />
                    <p className="leading-relaxed text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">Pro Tip:</span> Upgrading to a Growth plan removes the Superproxy branding, ensuring your documents look fully professional and white-labeled.
                    </p>
                  </div>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="lg:p-8 w-full max-w-md mx-auto pt-6 px-6 pb-6 space-y-8 relative z-10">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Buyer Info</h2>
                    <p className="text-sm text-slate-500">Select the contact and company for this quotation.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2 group">
                      <label
                        htmlFor="contact"
                        className="flex items-center justify-between uppercase text-xs font-semibold text-slate-600 tracking-wide"
                      >
                        <span>Contact</span>
                        <span className="text-slate-500 opacity-0 group-focus-within:opacity-100 transition-opacity">
                          Required
                        </span>
                      </label>
                      <Dropdown
                        value={selectedContactId}
                        options={[
                          { value: '', label: 'Select a contact' },
                          ...CONTACTS.map((contact) => ({
                            value: contact.id,
                            label: `${contact.name}${contact.email ? ` (${contact.email})` : ''}`,
                          })),
                        ]}
                        onChange={(val) => handleContactChange(val as string)}
                        icon="solar:user-linear"
                        placeholder="Select a contact"
                        searchable
                        className="w-full"
                        buttonClassName="w-full"
                        menuClassName="w-full"
                        menuAlign="left"
                      />
                      {selectedContact && (
                        <div className="mt-3 p-3 bg-white border border-slate-200 rounded-lg space-y-1.5 shadow-sm">
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <Icon icon="solar:user-linear" width="14" className="text-slate-500" />
                            <span className="font-semibold">{selectedContact.name}</span>
                          </div>
                          {selectedContact.email && (
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <Icon icon="solar:letter-linear" width="14" className="text-slate-400" />
                              <span>{selectedContact.email}</span>
                            </div>
                          )}
                          {selectedContact.phone && (
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <Icon icon="solar:phone-calling-linear" width="14" className="text-slate-400" />
                              <span className="font-mono">{selectedContact.phone}</span>
                            </div>
                          )}
                          {selectedContact.title && (
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <Icon icon="solar:case-linear" width="14" className="text-slate-400" />
                              <span>{selectedContact.title}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="company" className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Company
                      </label>
                      <Dropdown
                        value={selectedCompanyId}
                        options={[
                          { value: '', label: 'Select a company' },
                          ...COMPANIES.map((company) => ({
                            value: company.id,
                            label: company.name,
                          })),
                        ]}
                        onChange={(val) => setSelectedCompanyId(val as string)}
                        icon="solar:buildings-2-linear"
                        placeholder="Select a company"
                        searchable
                        className="w-full"
                        buttonClassName="w-full"
                        menuClassName="w-full"
                        menuAlign="left"
                      />
                      {selectedCompany && (
                        <div className="mt-3 p-3 bg-white border border-slate-200 rounded-lg space-y-1.5 shadow-sm">
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <Icon icon="solar:buildings-2-linear" width="14" className="text-slate-500" />
                            <span className="font-semibold">{selectedCompany.name}</span>
                          </div>
                          {selectedCompany.city && (
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <Icon icon="solar:map-point-linear" width="14" className="text-slate-400" />
                              <span>{selectedCompany.city}</span>
                            </div>
                          )}
                          {selectedCompany.phone && (
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <Icon icon="solar:phone-calling-linear" width="14" className="text-slate-400" />
                              <span className="font-mono">{selectedCompany.phone}</span>
                            </div>
                          )}
                          {selectedCompany.website && (
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <Icon icon="solar:globe-linear" width="14" className="text-slate-400" />
                              <span>{selectedCompany.website}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-auto p-6 bg-gradient-to-br from-slate-50/80 to-slate-50 border-t border-slate-200/50 relative z-10 backdrop-blur-sm">
                  <div className="flex gap-3 items-start">
                    <Icon icon="solar:info-circle-linear" className="text-slate-400 mt-0.5" width="18" />
                    <p className="leading-relaxed text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">Quick Tip:</span> Select both a contact person and their company for complete buyer information in your quotation.
                    </p>
                  </div>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <div className="lg:p-8 w-full max-w-md mx-auto pt-6 px-6 pb-6 space-y-8 relative z-10">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Your Info</h2>
                    <p className="text-sm text-slate-500">Review your details for this quotation.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                      <div className="p-6 space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="relative flex-shrink-0">
                            {currentUser?.profile_photo_url ? (
                              <img
                                src={currentUser.profile_photo_url}
                                alt={currentUser.user_name}
                                className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 shadow-sm"
                              />
                            ) : (
                              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold text-2xl shadow-sm border-2 border-slate-200">
                                {currentUser?.user_name?.charAt(0) || 'J'}
                              </div>
                            )}
                          </div>

                          <div className="flex-1 pt-1 space-y-3">
                            <div>
                              <p className="text-base font-semibold text-slate-900 mb-0.5">
                                {currentUser?.user_name || 'John Smith'}
                              </p>
                              <p className="text-sm text-slate-600">
                                {currentUser?.position || 'Sales Manager'}
                              </p>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-xs text-slate-600">
                                <Icon icon="solar:letter-linear" width="14" className="text-slate-400" />
                                <span>{currentUser?.user_email || 'john@acme.com'}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-600">
                                <Icon icon="solar:phone-calling-linear" width="14" className="text-slate-400" />
                                <span className="font-mono">{currentUser?.phone || '+1 (555) 123-4567'}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="h-px bg-slate-100"></div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Icon icon="solar:buildings-2-linear" width="16" className="text-slate-500" />
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">Company</h3>
                          </div>

                          <div className="pl-6 space-y-3">
                            <div>
                              <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">
                                Company Name
                              </label>
                              <p className="text-sm font-semibold text-slate-900">
                                {workspaceDetails?.name || 'Acme Corporation'}
                              </p>
                            </div>

                            <div>
                              <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">
                                Business Address
                              </label>
                              <p className="text-sm text-slate-700 leading-relaxed">
                                {workspaceDetails?.address || '123 Business St, San Francisco, CA 94105'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto p-6 bg-gradient-to-br from-slate-50/80 to-slate-50 border-t border-slate-200/50 relative z-10 backdrop-blur-sm">
                  <div className="flex gap-3 items-start">
                    <Icon icon="solar:info-circle-linear" className="text-slate-400 mt-0.5" width="18" />
                    <p className="leading-relaxed text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">Note:</span> To update your profile information or company details, navigate to your account or workspace settings at any time.
                    </p>
                  </div>
                </div>
              </>
            )}

            {currentStep === 4 && (
              <>
                <div className="lg:p-6 w-full max-w-lg mx-auto pt-5 px-5 pb-5 space-y-6 relative z-10 overflow-visible">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Line Items</h2>
                    <p className="text-xs text-slate-500">Add products and services to your quotation</p>
                  </div>

                  <div className="space-y-5 overflow-visible">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center ring-1 ring-slate-200/60">
                          <Icon icon="solar:add-square-bold" width="16" className="text-slate-500" />
                        </div>
                        <h3 className="text-base font-medium text-slate-900">Select Products</h3>
                      </div>

                      <div className="space-y-2 overflow-visible">
                        <label className="text-xs font-medium text-slate-600">
                          Product or Service
                        </label>
                        <div className="relative overflow-visible">
                          <button
                            onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
                            className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 pr-3 h-[42px] text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-1 cursor-pointer text-left shadow-sm"
                          >
                            <div className="flex items-center gap-2.5 flex-1 min-w-0">
                              <Icon icon="solar:box-linear" width="16" className="text-slate-500 flex-shrink-0" />
                              <span className="text-slate-400 truncate">Choose a product or service</span>
                            </div>
                            <Icon
                              icon="solar:alt-arrow-down-linear"
                              width="13"
                              className={`flex-shrink-0 ml-2 text-slate-400 transition-transform duration-200 ${
                                isProductDropdownOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </button>

                          {isProductDropdownOpen && (
                            <div className="absolute z-[100] top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-[0_12px_48px_-6px_rgb(0,0,0,0.12),0_0_0_1px_rgb(0,0,0,0.04)] overflow-hidden">
                                <div className="p-2.5 border-b border-slate-100">
                                  <div className="relative">
                                    <input
                                      type="text"
                                      placeholder="Search by product name..."
                                      value={productSearchQuery}
                                      onChange={(e) => setProductSearchQuery(e.target.value)}
                                      className="w-full pl-9 pr-4 py-2 text-[13px] bg-slate-50 border-0 rounded-lg focus:bg-slate-100/80 focus:ring-0 focus:outline-none transition-all placeholder:text-slate-300"
                                    />
                                    <Icon
                                      icon="solar:magnifer-linear"
                                      width="15"
                                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
                                    />
                                  </div>
                                </div>

                                <div className="flex gap-1 p-2.5 border-b border-slate-100">
                                  <button
                                    onClick={() => setProductFilter('all')}
                                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                      productFilter === 'all'
                                        ? 'bg-slate-800 text-white shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    All
                                  </button>
                                  <button
                                    onClick={() => setProductFilter('team')}
                                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                      productFilter === 'team'
                                        ? 'bg-slate-800 text-white shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    Team Product
                                  </button>
                                  <button
                                    onClick={() => setProductFilter('custom')}
                                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                      productFilter === 'custom'
                                        ? 'bg-slate-800 text-white shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    Custom Product
                                  </button>
                                </div>

                                <div className="max-h-80 overflow-y-auto">
                                  {(productFilter === 'all' || productFilter === 'team') && teamProducts.length > 0 && (
                                    <div className="p-3">
                                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 px-2 flex items-center gap-2">
                                        <Icon icon="solar:users-group-rounded-linear" width="14" />
                                        Team products ({teamProducts.length})
                                      </p>
                                      <div className="space-y-1">
                                        {teamProducts.map((product) => (
                                          <button
                                            key={product.id}
                                            onClick={() => handleAddProduct(product)}
                                            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-all duration-150 text-left group border border-transparent"
                                          >
                                            <div className="flex-1 min-w-0">
                                              <p className="text-sm font-semibold text-slate-900 group-hover:text-slate-700 transition-colors truncate">
                                                {product.name}
                                              </p>
                                              {product.description && (
                                                <p className="text-xs text-slate-500 mt-0.5 truncate">{product.description}</p>
                                              )}
                                            </div>
                                            <span className="text-sm font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md group-hover:bg-slate-50 group-hover:text-slate-700 transition-colors flex-shrink-0 ml-2">
                                              {formatCurrency(product.price)}
                                            </span>
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {(productFilter === 'all' || productFilter === 'custom') &&
                                    customProducts.length > 0 && (
                                      <div className="p-3 border-t border-slate-100">
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 px-2 flex items-center gap-2">
                                          <Icon icon="solar:star-linear" width="14" />
                                          Custom products ({customProducts.length})
                                        </p>
                                        <div className="space-y-1">
                                          {customProducts.map((product) => (
                                            <button
                                              key={product.id}
                                              onClick={() => handleAddProduct(product)}
                                              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-all duration-150 text-left group border border-transparent"
                                            >
                                              <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-slate-900 group-hover:text-slate-700 transition-colors truncate">
                                                  {product.name}
                                                </p>
                                                {product.description && (
                                                  <p className="text-xs text-slate-500 mt-0.5 truncate">{product.description}</p>
                                                )}
                                              </div>
                                              <span className="text-sm font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md group-hover:bg-slate-50 group-hover:text-slate-700 transition-colors flex-shrink-0 ml-2">
                                                {formatCurrency(product.price)}
                                              </span>
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                  {filteredProducts.length === 0 && (
                                    <div className="p-8 text-center">
                                      <Icon icon="solar:box-linear" width="48" className="text-slate-300 mx-auto mb-2" />
                                      <p className="text-sm text-slate-400">No products found</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                      <button
                        onClick={() => setIsAddProductDrawerOpen(true)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-dashed border-slate-200 text-xs font-medium text-slate-600 hover:border-slate-300 hover:text-slate-500 hover:bg-slate-50/50 transition-all">
                        <Icon icon="solar:add-circle-linear" width="16" />
                        <span>Create Custom Product</span>
                      </button>
                    </div>

                    {lineItems.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center ring-1 ring-sky-200/50">
                            <Icon icon="solar:check-circle-bold" width="16" className="text-blue-500" />
                          </div>
                          <h3 className="text-base font-medium text-slate-900">
                            Added Items <span className="text-slate-500">({lineItems.length})</span>
                          </h3>
                        </div>

                          <div className="space-y-2">
                            {lineItems.map((item) => (
                              <div
                                key={item.id}
                                className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-all ${
                                  justAddedProductId === item.product_id
                                    ? 'border-sky-200 bg-sky-50/40'
                                    : 'border-slate-200 bg-slate-50'
                                }`}
                              >
                                <p className="text-sm font-medium text-slate-700 truncate min-w-0 flex-shrink">
                                  {item.product_name}
                                </p>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <button
                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
                                  >
                                    <Icon icon="lucide:minus" width="14" />
                                  </button>
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    value={item.quantity}
                                    onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                                    className="w-14 h-8 text-center text-sm font-medium border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 bg-white"
                                    min="1"
                                  />
                                  <button
                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
                                  >
                                    <Icon icon="lucide:plus" width="14" />
                                  </button>
                                  <span className="text-base font-semibold text-slate-900 min-w-[110px] text-right">
                                    {formatCurrency(item.total)}
                                  </span>
                                  <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-500 transition-all"
                                  >
                                    <Icon icon="solar:trash-bin-trash-linear" width="14" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                        <div className="space-y-3 pt-2">
                          <h4 className="text-sm font-medium text-slate-900">Optional Fees and Discounts</h4>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setTaxEnabled(!taxEnabled)}
                              className={`w-6 h-6 rounded-md flex items-center justify-center border transition-all flex-shrink-0 ${
                                taxEnabled
                                  ? 'bg-slate-800 border-slate-800'
                                  : 'bg-white border-slate-300 hover:border-slate-400'
                              }`}
                            >
                              {taxEnabled && <Icon icon="lucide:check" width="14" className="text-white" />}
                            </button>
                            <span className="text-xs font-medium text-slate-700 w-24">Apply Tax</span>
                            <div className="flex-1 flex items-center gap-1">
                              <input
                                type="number"
                                value={taxRate === 0 ? '' : taxRate}
                                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                                disabled={!taxEnabled}
                                className="flex-1 px-2 py-1.5 text-xs font-medium border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-200 focus:border-slate-400 disabled:bg-slate-100 disabled:text-slate-400 bg-white"
                                placeholder="0"
                                min="0"
                                max="100"
                                step="0.01"
                              />
                              <span className="text-xs font-medium text-slate-500">%</span>
                            </div>
                            <span className="text-sm font-medium text-slate-900 min-w-[90px] text-right">
                              {formatCurrency(calculateTax())}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setDiscountEnabled(!discountEnabled)}
                              className={`w-6 h-6 rounded-md flex items-center justify-center border transition-all flex-shrink-0 ${
                                discountEnabled
                                  ? 'bg-slate-800 border-slate-800'
                                  : 'bg-white border-slate-300 hover:border-slate-400'
                              }`}
                            >
                              {discountEnabled && <Icon icon="lucide:check" width="14" className="text-white" />}
                            </button>
                            <span className="text-xs font-medium text-slate-700 w-24">Apply Discount</span>
                            <div className="flex-1 flex items-center gap-1">
                              <input
                                type="number"
                                value={discountRate === 0 ? '' : discountRate}
                                onChange={(e) => setDiscountRate(parseFloat(e.target.value) || 0)}
                                disabled={!discountEnabled}
                                className="flex-1 px-2 py-1.5 text-xs font-medium border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-200 focus:border-slate-400 disabled:bg-slate-100 disabled:text-slate-400 bg-white"
                                placeholder="0"
                                min="0"
                                max="100"
                                step="0.01"
                              />
                              <span className="text-xs font-medium text-slate-500">%</span>
                            </div>
                            <span className="text-sm font-medium text-slate-900 min-w-[90px] text-right">
                              -{formatCurrency(calculateDiscount())}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
                          <div className="flex items-center gap-2">
                            <Icon icon="solar:bill-list-bold" width="20" className="text-slate-400" />
                            <span className="text-sm font-medium text-white">Final Total</span>
                          </div>
                          <span className="text-xl font-bold text-white">
                            {formatCurrency(calculateFinalTotal())}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-auto p-6 bg-gradient-to-br from-slate-50/80 to-slate-50 border-t border-slate-200/50 relative z-10 backdrop-blur-sm">
                  <div className="flex gap-3 items-start">
                    <Icon icon="solar:info-circle-linear" className="text-slate-400 mt-0.5" width="18" />
                    <p className="leading-relaxed text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">Pro Tip:</span> Select products from the dropdown above and they'll automatically appear in your line items.
                    </p>
                  </div>
                </div>
              </>
            )}

            {currentStep === 5 && (
              <>
                <div className="lg:p-8 w-full max-w-lg mx-auto pt-6 px-6 pb-6 space-y-8 relative z-10">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Signature</h2>
                    <p className="text-sm text-slate-500">Define how your client will sign and accept this quotation</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <button
                        onClick={() => setSignatureOption('none')}
                        className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all ${
                          signatureOption === 'none'
                            ? 'border-slate-800 bg-slate-50/50'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                            signatureOption === 'none' ? 'bg-slate-100' : 'bg-slate-100'
                          }`}
                        >
                          <Icon
                            icon="solar:close-circle-linear"
                            width="20"
                            className={signatureOption === 'none' ? 'text-slate-500' : 'text-slate-500'}
                          />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="text-sm font-semibold text-slate-900 mb-1">No Signature Required</h3>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            Client can accept the quote without any signature
                          </p>
                        </div>
                        <div
                          className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            signatureOption === 'none'
                              ? 'border-slate-800 bg-slate-800'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {signatureOption === 'none' && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                      </button>

                      <button
                        onClick={() => setSignatureOption('written')}
                        className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all ${
                          signatureOption === 'written'
                            ? 'border-slate-800 bg-slate-50/50'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                            signatureOption === 'written' ? 'bg-slate-100' : 'bg-slate-100'
                          }`}
                        >
                          <Icon
                            icon="solar:pen-linear"
                            width="20"
                            className={signatureOption === 'written' ? 'text-slate-500' : 'text-slate-500'}
                          />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="text-sm font-semibold text-slate-900 mb-1">Written Signature Space</h3>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            Include a space for the client to print and sign manually
                          </p>
                        </div>
                        <div
                          className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            signatureOption === 'written'
                              ? 'border-slate-800 bg-slate-800'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {signatureOption === 'written' && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                      </button>

                      <button
                        onClick={() => setSignatureOption('electronic')}
                        className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all ${
                          signatureOption === 'electronic'
                            ? 'border-slate-800 bg-slate-50/50'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                            signatureOption === 'electronic' ? 'bg-slate-100' : 'bg-slate-100'
                          }`}
                        >
                          <Icon
                            icon="solar:document-linear"
                            width="20"
                            className={signatureOption === 'electronic' ? 'text-slate-500' : 'text-slate-500'}
                          />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="text-sm font-semibold text-slate-900 mb-1">Electronic Signature</h3>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            Enable digital signature collection
                          </p>
                        </div>
                        <div
                          className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            signatureOption === 'electronic'
                              ? 'border-slate-800 bg-slate-800'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {signatureOption === 'electronic' && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                      </button>
                    </div>

                    <div className="pt-4 border-t border-slate-200">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900 mb-1">Additional Signatory Fields</h3>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            By default, "Signature over Printed Name" and "Date" fields are included. Add additional fields below.
                          </p>
                        </div>

                        {additionalSignatories.length > 0 && (
                          <div className="space-y-2">
                            {additionalSignatories.map((signatory, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white"
                              >
                                <Icon icon="solar:user-linear" width="16" className="text-slate-400 flex-shrink-0" />
                                <input
                                  type="text"
                                  value={signatory}
                                  onChange={(e) => {
                                    const updated = [...additionalSignatories];
                                    updated[index] = e.target.value;
                                    setAdditionalSignatories(updated);
                                  }}
                                  className="flex-1 text-xs font-medium text-slate-900 bg-transparent border-none outline-none focus:ring-0 p-0"
                                  placeholder="Field name"
                                />
                                <button
                                  onClick={() => {
                                    setAdditionalSignatories(
                                      additionalSignatories.filter((_, i) => i !== index)
                                    );
                                  }}
                                  className="flex-shrink-0 p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                >
                                  <Icon icon="solar:trash-bin-minimalistic-linear" width="16" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <button
                          onClick={() => setAdditionalSignatories([...additionalSignatories, ''])}
                          className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-500 hover:bg-slate-50/50 transition-all group"
                        >
                          <Icon icon="solar:add-circle-linear" width="18" className="group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-medium">Add Signatory Field</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto p-6 bg-gradient-to-br from-slate-50/80 to-slate-50 border-t border-slate-200/50 relative z-10 backdrop-blur-sm">
                  <div className="flex gap-3 items-start">
                    <Icon icon="solar:info-circle-linear" className="text-slate-400 mt-0.5" width="18" />
                    <p className="leading-relaxed text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">Pro Tip:</span> Choose the signature method that best fits your workflow. Written signatures work great for in-person meetings.
                    </p>
                  </div>
                </div>
              </>
            )}

            {currentStep === 6 && (
              <>
                <div className="lg:p-8 w-full max-w-lg mx-auto pt-6 px-6 pb-6 space-y-8 relative z-10">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Terms & Expiry</h2>
                    <p className="text-sm text-slate-500">Set validity period and define terms of sale</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label htmlFor="expiry" className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Quote Expiry Period
                      </label>
                      <Dropdown
                        value={expiryPeriod}
                        options={[
                          { value: '30', label: '30 days' },
                          { value: '60', label: '60 days' },
                          { value: '90', label: '90 days' },
                          { value: 'custom', label: 'Custom' },
                        ]}
                        onChange={(val) => setExpiryPeriod(val as '30' | '60' | '90' | 'custom')}
                        icon="solar:calendar-linear"
                        className="w-full"
                        buttonClassName="w-full"
                        menuClassName="w-full"
                        menuAlign="left"
                      />

                      {expiryPeriod === 'custom' && (
                        <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                          <input
                            type="number"
                            value={customExpiryDays}
                            onChange={(e) => setCustomExpiryDays(Math.max(1, parseInt(e.target.value) || 1))}
                            className="flex-1 px-3 py-2 text-sm font-semibold border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 bg-white"
                            placeholder="Enter days"
                            min="1"
                          />
                          <span className="text-xs font-medium text-slate-600">days</span>
                        </div>
                      )}

                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <p className="text-xs text-slate-600">
                          <span className="font-semibold text-slate-700">Quote will expire on:</span>{' '}
                          {formatDate(validUntil)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label htmlFor="comments" className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Comments to Buyer
                      </label>
                      <textarea
                        id="comments"
                        value={commentsToBuyer}
                        onChange={(e) => setCommentsToBuyer(e.target.value)}
                        rows={4}
                        placeholder="Add any special notes, conditions, or comments for the buyer..."
                        className="w-full px-4 py-3 text-sm text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-800 hover:border-slate-300 transition-all resize-none bg-white shadow-sm placeholder:text-slate-400"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                          Terms of Sale
                        </label>
                        <button
                          onClick={() => setIsEditingTerms(!isEditingTerms)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-all"
                        >
                          <Icon icon={isEditingTerms ? "solar:check-circle-linear" : "solar:pen-linear"} width="14" />
                          <span>{isEditingTerms ? 'Done' : 'Edit'}</span>
                        </button>
                      </div>

                      {isEditingTerms ? (
                        <textarea
                          value={termsOfSale}
                          onChange={(e) => setTermsOfSale(e.target.value)}
                          rows={12}
                          className="w-full px-4 py-3 text-xs text-slate-700 leading-relaxed border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-800 transition-all resize-none bg-white shadow-sm font-mono"
                        />
                      ) : (
                        <div className="p-4 rounded-lg border border-slate-200 bg-white shadow-sm max-h-64 overflow-y-auto">
                          <pre className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">
                            {termsOfSale}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-auto p-6 bg-gradient-to-br from-slate-50/80 to-slate-50 border-t border-slate-200/50 relative z-10 backdrop-blur-sm">
                  <div className="flex gap-3 items-start">
                    <Icon icon="solar:info-circle-linear" className="text-slate-400 mt-0.5" width="18" />
                    <p className="leading-relaxed text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">Pro Tip:</span> Clear terms and expiry dates help set expectations and create urgency for your clients.
                    </p>
                  </div>
                </div>
              </>
            )}

            {currentStep === 7 && (
              <>
                <div className="lg:p-8 w-full max-w-2xl mx-auto pt-6 px-6 pb-6 space-y-6 relative z-10">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Review Quote</h2>
                    <p className="text-sm text-slate-500">Review all details before publishing</p>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                          <Icon icon="solar:document-text-linear" width="16" className="text-slate-400" />
                          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Quote Details</h3>
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Quote Name</p>
                            <p className="text-sm font-semibold text-slate-900">{quoteName}</p>
                          </div>
                          <div className="text-right space-y-1">
                            <p className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Reference</p>
                            <p className="text-sm font-mono font-medium text-slate-700">{mockReferenceNumber}</p>
                          </div>
                        </div>
                        <div className="h-px bg-slate-100"></div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Date Issued</p>
                            <p className="text-xs text-slate-700">{formatDate(today)}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Valid Until</p>
                            <p className="text-xs text-slate-700">{formatDate(validUntil)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                          <div className="flex items-center gap-2">
                            <Icon icon="solar:user-linear" width="16" className="text-slate-400" />
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Buyer</h3>
                          </div>
                        </div>
                        <div className="p-4 space-y-2">
                          {selectedContact ? (
                            <>
                              <p className="text-sm font-semibold text-slate-900">{selectedContact.name}</p>
                              {selectedContact.email && (
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                  <Icon icon="solar:letter-linear" width="12" className="text-slate-400" />
                                  <span>{selectedContact.email}</span>
                                </div>
                              )}
                              {selectedContact.phone && (
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                  <Icon icon="solar:phone-calling-linear" width="12" className="text-slate-400" />
                                  <span className="font-mono">{selectedContact.phone}</span>
                                </div>
                              )}
                            </>
                          ) : (
                            <p className="text-xs text-slate-400 italic">No contact selected</p>
                          )}
                          {selectedCompany && (
                            <>
                              <div className="h-px bg-slate-100 my-2"></div>
                              <div className="flex items-center gap-2 text-xs text-slate-600">
                                <Icon icon="solar:buildings-2-linear" width="12" className="text-slate-400" />
                                <span className="font-medium">{selectedCompany.name}</span>
                              </div>
                              {selectedCompany.city && (
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                  <Icon icon="solar:map-point-linear" width="12" className="text-slate-400" />
                                  <span>{selectedCompany.city}</span>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                          <div className="flex items-center gap-2">
                            <Icon icon="solar:case-linear" width="16" className="text-slate-400" />
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Your Info</h3>
                          </div>
                        </div>
                        <div className="p-4 space-y-2">
                          <p className="text-sm font-semibold text-slate-900">{currentUser?.user_name || 'John Smith'}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <Icon icon="solar:letter-linear" width="12" className="text-slate-400" />
                            <span>{currentUser?.user_email || 'john@acme.com'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <Icon icon="solar:phone-calling-linear" width="12" className="text-slate-400" />
                            <span className="font-mono">{currentUser?.phone || '+1 (555) 123-4567'}</span>
                          </div>
                          <div className="h-px bg-slate-100 my-2"></div>
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <Icon icon="solar:buildings-2-linear" width="12" className="text-slate-400" />
                            <span className="font-medium">{workspaceDetails?.name || 'Acme Corporation'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon icon="solar:bill-list-linear" width="16" className="text-slate-400" />
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Line Items</h3>
                          </div>
                          <span className="text-xs font-medium text-slate-600">{lineItems.length} {lineItems.length === 1 ? 'item' : 'items'}</span>
                        </div>
                      </div>
                      <div className="p-4">
                        {lineItems.length === 0 ? (
                          <p className="text-xs text-slate-400 italic text-center py-4">No items added</p>
                        ) : (
                          <div className="space-y-3">
                            {lineItems.map((item, index) => (
                              <div key={item.id} className={`flex items-center justify-between gap-3 ${index !== lineItems.length - 1 ? 'pb-3 border-b border-slate-100' : ''}`}>
                                <div className="flex-1">
                                  <p className="text-xs font-semibold text-slate-900">{item.product_name}</p>
                                  {item.description && (
                                    <p className="text-[10px] text-slate-500 mt-0.5">{item.description}</p>
                                  )}
                                  <p className="text-[10px] text-slate-500 mt-1">Qty: {item.quantity} × {formatCurrency(item.unit_price)}</p>
                                </div>
                                <p className="text-sm font-bold text-slate-900">{formatCurrency(item.total)}</p>
                              </div>
                            ))}
                            <div className="pt-3 border-t border-slate-200 space-y-2">
                              <div className="flex justify-between text-xs text-slate-600">
                                <span>Subtotal</span>
                                <span className="font-medium">{formatCurrency(calculateSubtotal())}</span>
                              </div>
                              {taxEnabled && taxRate > 0 && (
                                <div className="flex justify-between text-xs text-slate-600">
                                  <span>Tax ({taxRate}%)</span>
                                  <span className="font-medium">{formatCurrency(calculateTax())}</span>
                                </div>
                              )}
                              {discountEnabled && discountRate > 0 && (
                                <div className="flex justify-between text-xs text-emerald-600">
                                  <span>Discount ({discountRate}%)</span>
                                  <span className="font-medium">-{formatCurrency(calculateDiscount())}</span>
                                </div>
                              )}
                              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                                <span>Total</span>
                                <span>{formatCurrency(calculateFinalTotal())}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                          <div className="flex items-center gap-2">
                            <Icon icon="solar:pen-new-square-linear" width="16" className="text-slate-400" />
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Signature Method</h3>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                              <Icon
                                icon={
                                  signatureOption === 'none'
                                    ? 'solar:close-circle-linear'
                                    : signatureOption === 'written'
                                    ? 'solar:pen-linear'
                                    : 'solar:document-linear'
                                }
                                width="16"
                                className="text-slate-500"
                              />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-900">
                                {signatureOption === 'none'
                                  ? 'No Signature Required'
                                  : signatureOption === 'written'
                                  ? 'Written Signature'
                                  : 'Electronic Signature'}
                              </p>
                              <p className="text-[10px] text-slate-500 mt-0.5">
                                {signatureOption === 'none'
                                  ? 'Client can accept without signing'
                                  : signatureOption === 'written'
                                  ? 'Print and sign manually'
                                  : 'Digital signature enabled'}
                              </p>
                            </div>
                          </div>
                          {additionalSignatories.length > 0 && (
                            <>
                              <div className="h-px bg-slate-100 my-3"></div>
                              <div className="space-y-1">
                                <p className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider mb-2">Additional Fields</p>
                                {additionalSignatories.map((field, index) => (
                                  <div key={index} className="flex items-center gap-2 text-xs text-slate-600">
                                    <Icon icon="solar:check-circle-linear" width="12" className="text-slate-500" />
                                    <span>{field}</span>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                          <div className="flex items-center gap-2">
                            <Icon icon="solar:calendar-mark-linear" width="16" className="text-slate-400" />
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Validity</h3>
                          </div>
                        </div>
                        <div className="p-4 space-y-2">
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Expiry Period</p>
                            <p className="text-xs font-semibold text-slate-900">
                              {expiryPeriod === 'custom' ? `${customExpiryDays} days` : `${expiryPeriod} days`}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Expires On</p>
                            <p className="text-xs text-slate-700">{formatDate(validUntil)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {commentsToBuyer && (
                      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                          <div className="flex items-center gap-2">
                            <Icon icon="solar:chat-round-line-linear" width="16" className="text-slate-400" />
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Comments to Buyer</h3>
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{commentsToBuyer}</p>
                        </div>
                      </div>
                    )}

                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                          <Icon icon="solar:document-text-linear" width="16" className="text-slate-400" />
                          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Terms of Sale</h3>
                        </div>
                      </div>
                      <div className="p-4 max-h-48 overflow-y-auto">
                        <pre className="text-[10px] text-slate-600 leading-relaxed whitespace-pre-wrap font-sans">
                          {termsOfSale}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto p-6 bg-gradient-to-br from-emerald-50/50 to-slate-50 border-t border-emerald-100/50 relative z-10 backdrop-blur-sm">
                  <div className="flex gap-3 items-start">
                    <Icon icon="solar:check-circle-linear" className="text-emerald-600 mt-0.5" width="18" />
                    <p className="leading-relaxed text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">Ready to Publish:</span> Review all details carefully. Once published, you can share this quote with your client.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex-1 flex flex-col bg-slate-100/80 relative overflow-hidden">
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 bg-white/90 backdrop-blur-md border border-slate-200/60 rounded-full px-4 py-2 shadow-lg flex items-center gap-4 transition-all hover:bg-white hover:scale-105">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <Icon icon="solar:eye-linear" width="14" className="text-slate-400" />
                <span>Live Preview</span>
              </div>
              <div className="w-px h-3 bg-slate-200"></div>
              <div className="flex gap-1">
                <div className="relative group/tooltip">
                  <button
                    className="p-1.5 text-slate-400 hover:text-slate-500 hover:bg-slate-100 rounded-full transition-all"
                  >
                    <Icon icon="solar:monitor-linear" width="14" />
                  </button>
                  <span className="absolute top-full right-0 mt-2 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                    Desktop
                  </span>
                </div>
                <div className="relative group/tooltip">
                  <button
                    className="p-1.5 text-slate-400 hover:text-slate-500 hover:bg-slate-100 rounded-full transition-all"
                  >
                    <Icon icon="solar:smartphone-linear" width="14" />
                  </button>
                  <span className="absolute top-full right-0 mt-2 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                    Mobile
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col pt-24 pr-8 pb-20 pl-8 items-center justify-start">
              <div className="relative w-full max-w-[210mm] min-h-[297mm] bg-white rounded-2xl ring-1 ring-slate-900/5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-transform duration-500 origin-top">
                <div className="p-[12mm] md:p-[15mm] space-y-10">
                  <div className="flex items-start justify-between">
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 24" className="w-[146px] h-[32px]" strokeWidth="2">
                        <path fill="currentColor" d="M4 0h16v8h-8zm0 8h8l8 8H4zm0 8h8v8z" className="text-slate-900"></path>
                        <text x="28" y="20" fontFamily="Geist" fontWeight="600" fontSize="20" fill="currentColor" className="text-slate-900">
                          FRIGMA
                        </text>
                      </svg>
                    </div>
                    <div className="text-right"></div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-100/50">
                    <h1 className="text-2xl font-semibold text-slate-900 tracking-tight mb-4">
                      {quoteName}
                    </h1>
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">client name</p>
                        {selectedContact || selectedCompany ? (
                          <div className="space-y-1">
                            {selectedContact && (
                              <p className="text-xs font-semibold text-slate-900">{selectedContact.name}</p>
                            )}
                            {selectedCompany && (
                              <p className="text-xs text-slate-600">{selectedCompany.name}</p>
                            )}
                            {selectedCompany?.address && (
                              <p className="text-xs text-slate-600">{selectedCompany.address}</p>
                            )}
                            {selectedCompany?.city && !selectedCompany?.address && (
                              <p className="text-xs text-slate-600">{selectedCompany.city}</p>
                            )}
                          </div>
                        ) : (
                          <>
                            <div className="h-2 w-24 bg-slate-200 rounded animate-pulse"></div>
                            <div className="h-2 w-32 bg-slate-200 rounded animate-pulse"></div>
                          </>
                        )}
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-[10px] text-slate-400">
                          <span className="font-semibold text-slate-600">Date:</span> {formatDate(today)}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          <span className="font-semibold text-slate-600">Valid Until:</span> {formatDate(validUntil)}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          <span className="font-semibold text-slate-600">Reference:</span> {mockReferenceNumber}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900">What we offer:</h3>
                    <div className="w-full border border-slate-200 rounded-lg overflow-hidden text-xs">
                      <div className="bg-slate-50 text-slate-500 grid grid-cols-12 gap-4 p-3 font-semibold uppercase tracking-wider text-[10px]">
                        <div className="col-span-6">Description</div>
                        <div className="col-span-2 text-center">Qty</div>
                        <div className="col-span-2 text-right">Price</div>
                        <div className="col-span-2 text-right">Amount</div>
                      </div>
                      {lineItems.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 italic bg-white">No items added yet.</div>
                      ) : (
                        <div className="bg-white divide-y divide-slate-100">
                          {lineItems.map((item) => (
                            <div key={item.id} className="grid grid-cols-12 gap-4 p-3 text-slate-700">
                              <div className="col-span-6">
                                <p className="font-semibold text-slate-900">{item.product_name}</p>
                                {item.description && (
                                  <p className="text-[10px] text-slate-500 mt-0.5">{item.description}</p>
                                )}
                              </div>
                              <div className="col-span-2 text-center font-medium">{item.quantity}</div>
                              <div className="col-span-2 text-right font-medium">{formatCurrency(item.unit_price)}</div>
                              <div className="col-span-2 text-right font-bold text-slate-900">
                                {formatCurrency(item.total)}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end pt-2">
                      <div className="w-1/2 space-y-2">
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>Subtotal</span>
                          <span>{formatCurrency(calculateSubtotal())}</span>
                        </div>
                        {taxEnabled && taxRate > 0 && (
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>Tax ({taxRate}%)</span>
                            <span>{formatCurrency(calculateTax())}</span>
                          </div>
                        )}
                        {discountEnabled && discountRate > 0 && (
                          <div className="flex justify-between text-xs text-emerald-600">
                            <span>Discount ({discountRate}%)</span>
                            <span>-{formatCurrency(calculateDiscount())}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                          <span>Total</span>
                          <span>{formatCurrency(calculateFinalTotal())}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-8 left-8 right-8 flex justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-4">
                  <span>Created from Superproxy.ai</span>
                  <span>Page 1 of 1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddProductDrawer isOpen={isAddProductDrawerOpen} onClose={() => setIsAddProductDrawerOpen(false)} />
    </div>
  );
}
