import { Icon } from '@iconify/react';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

interface CreateInvoiceProps {
  onBack: () => void;
  onPublish?: () => void;
  preSelectedQuote?: {
    id: string;
    number: string;
    title: string;
    client: {
      name: string;
      initials: string;
      color: string;
    };
    status: 'draft' | 'published' | 'sent';
    amount: number;
    date: string;
    validUntil: string;
    items: number;
  } | null;
}

interface Quotation {
  id: string;
  title: string;
  company_id: string | null;
  contact_id: string | null;
  total_amount: number;
  status: string;
  valid_until: string | null;
  created_at: string;
}

interface Workspace {
  id: string;
  name: string;
  logo_url: string | null;
  address: string | null;
  company_email: string | null;
  company_phone: string | null;
}

const mockQuotes: Quotation[] = [
  {
    id: '1',
    title: 'Website Redesign Project',
    company_id: '1',
    contact_id: '1',
    total_amount: 285000,
    status: 'published',
    valid_until: '2026-02-15',
    created_at: '2026-01-10T10:00:00Z',
  },
  {
    id: '2',
    title: 'Mobile App Development',
    company_id: '2',
    contact_id: '2',
    total_amount: 450000,
    status: 'published',
    valid_until: '2026-02-20',
    created_at: '2026-01-08T14:30:00Z',
  },
  {
    id: '3',
    title: 'Brand Identity Package',
    company_id: '3',
    contact_id: '3',
    total_amount: 175000,
    status: 'published',
    valid_until: '2026-02-10',
    created_at: '2026-01-05T09:15:00Z',
  },
  {
    id: '4',
    title: 'E-commerce Platform Setup',
    company_id: '4',
    contact_id: '4',
    total_amount: 680000,
    status: 'published',
    valid_until: '2026-02-28',
    created_at: '2026-01-12T16:45:00Z',
  },
  {
    id: '5',
    title: 'SEO Optimization Services',
    company_id: '5',
    contact_id: '5',
    total_amount: 95000,
    status: 'published',
    valid_until: '2026-02-05',
    created_at: '2026-01-03T11:20:00Z',
  },
];

const INVOICE_STEPS = [
  { id: 1, label: 'Quote Selection' },
  { id: 2, label: 'Notes & Details' },
  { id: 3, label: 'Review' },
];

const MOCK_WORKSPACE: Workspace = {
  id: 'mock-workspace-1',
  name: 'Superproxy Inc.',
  logo_url: '/superproxy_logo_(2).jpg',
  address: '123 Tech Street, Manila',
  company_email: 'contact@superproxy.com',
  company_phone: '+639175328910',
};

export default function CreateInvoice({ onBack, onPublish, preSelectedQuote }: CreateInvoiceProps) {
  const [invoiceTitle, setInvoiceTitle] = useState('Untitled Invoice');
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>(mockQuotes);
  const [selectedQuoteId, setSelectedQuoteId] = useState('');
  const [quoteSearchQuery, setQuoteSearchQuery] = useState('');
  const [isQuoteDropdownOpen, setIsQuoteDropdownOpen] = useState(false);
  const [isDueDateDropdownOpen, setIsDueDateDropdownOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [amountDueNowPercentage, setAmountDueNowPercentage] = useState('');
  const [invoiceDueInDays, setInvoiceDueInDays] = useState<number | 'custom'>(30);
  const [customDays, setCustomDays] = useState('');
  const [isEditingBilling, setIsEditingBilling] = useState(false);
  const [billingDetails, setBillingDetails] = useState(
    `Payment is due within 30 days of invoice date.\n\nAccepted payment methods:\n- Bank transfer\n- Credit card\n- Check\n\nLate payments may incur a 1.5% monthly interest charge.`
  );
  const [workspaceDetails] = useState<Workspace>(MOCK_WORKSPACE);
  const [currency] = useState('PHP');

  const quoteDropdownRef = useRef<HTMLDivElement>(null);
  const dueDateDropdownRef = useRef<HTMLDivElement>(null);

  const mockReferenceNumber = useMemo(() => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 900) + 100;
    return `INV-${year}-${randomNum}`;
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (quoteDropdownRef.current && !quoteDropdownRef.current.contains(event.target as Node)) {
        setIsQuoteDropdownOpen(false);
      }
      if (dueDateDropdownRef.current && !dueDateDropdownRef.current.contains(event.target as Node)) {
        setIsDueDateDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (preSelectedQuote) {
      const mappedQuote: Quotation = {
        id: preSelectedQuote.id,
        title: preSelectedQuote.title,
        company_id: null,
        contact_id: null,
        total_amount: preSelectedQuote.amount,
        status: preSelectedQuote.status,
        valid_until: preSelectedQuote.validUntil,
        created_at: preSelectedQuote.date,
      };

      setQuotations(prev => {
        const existingQuoteIndex = prev.findIndex(q => q.id === preSelectedQuote.id);
        if (existingQuoteIndex === -1) {
          return [mappedQuote, ...prev];
        }
        return prev;
      });

      setSelectedQuoteId(preSelectedQuote.id);
      setInvoiceTitle(`Invoice for ${preSelectedQuote.title}`);
    }
  }, [preSelectedQuote]);

  const filteredQuotations = useMemo(
    () => quotations.filter((quote) =>
      quote.title.toLowerCase().includes(quoteSearchQuery.toLowerCase())
    ),
    [quotations, quoteSearchQuery]
  );

  const selectedQuote = useMemo(
    () => quotations.find((q) => q.id === selectedQuoteId),
    [quotations, selectedQuoteId]
  );

  const amountDueNow = useMemo(() => {
    if (!selectedQuote) return 0;
    const percentage = parseFloat(amountDueNowPercentage) || 0;
    return (selectedQuote.total_amount * percentage) / 100;
  }, [selectedQuote, amountDueNowPercentage]);

  const dueDate = useMemo(() => {
    const today = new Date();
    const dueDateCalc = new Date(today);
    const days = invoiceDueInDays === 'custom' ? (parseInt(customDays) || 30) : invoiceDueInDays;
    dueDateCalc.setDate(dueDateCalc.getDate() + days);
    return dueDateCalc;
  }, [invoiceDueInDays, customDays]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    if (completedSteps.includes(stepId) || stepId === currentStep) {
      setCurrentStep(stepId);
    }
  };

  const handlePublish = () => {
    if (onPublish) {
      onPublish();
    }
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
                <div className="flex items-center gap-2 text-[10px] font-semibold tracking-wider uppercase text-slate-500 mb-1">
                  <span>New Invoice</span>
                </div>
                <h1 className="flex items-center gap-2 text-lg font-semibold text-slate-900 tracking-tight">
                  <span>{invoiceTitle}</span>
                  <Icon
                    icon="solar:pen-linear"
                    className="text-slate-400 hover:text-slate-500 cursor-pointer transition-colors"
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
              {currentStep === 3 ? (
                <button
                  onClick={handlePublish}
                  className="group h-10 flex items-center gap-2 px-5 rounded-lg text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 hover:shadow-lg transition-all focus:ring-2 focus:ring-slate-300 focus:outline-none active:scale-[0.98]"
                >
                  <span>Publish Invoice</span>
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
              {INVOICE_STEPS.map((step, index) => {
                const isCompleted = completedSteps.includes(step.id);
                const isActive = step.id === currentStep;
                const isClickable = step.id <= currentStep || completedSteps.includes(step.id);

                return (
                  <div key={step.id} className="flex items-center flex-shrink-0">
                    <div
                      onClick={() => isClickable && handleStepClick(step.id)}
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
                    {index < INVOICE_STEPS.length - 1 && (
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
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.03),transparent_60%)] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(148,163,184,0.02),transparent_50%)] pointer-events-none"></div>

            {currentStep === 1 && (
              <>
                <div className="lg:p-8 w-full max-w-md mx-auto pt-6 px-6 pb-6 space-y-8 relative z-10">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
                      Select a Quote
                    </h2>
                    <p className="text-sm text-slate-500">
                      Choose an existing quotation to convert into an invoice.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="relative" ref={quoteDropdownRef}>
                      <button
                        onClick={() => setIsQuoteDropdownOpen(!isQuoteDropdownOpen)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 pr-3 h-[42px] text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-1 transition-all shadow-sm hover:shadow-md hover:border-slate-300 text-left flex items-center justify-between"
                      >
                        <span className={selectedQuote ? 'text-slate-700 truncate' : 'text-slate-400'}>
                          {selectedQuote ? selectedQuote.title : 'Choose a quotation...'}
                        </span>
                        <Icon
                          icon="solar:alt-arrow-down-linear"
                          className={`flex-shrink-0 ml-2 text-slate-400 transition-transform duration-200 ${
                            isQuoteDropdownOpen ? 'rotate-180' : ''
                          }`}
                          width="13"
                        />
                      </button>

                      {isQuoteDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200/80 shadow-xl z-50 overflow-hidden max-h-96">
                          <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                            <div className="relative">
                              <Icon
                                icon="solar:magnifer-linear"
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                width="16"
                              />
                              <input
                                type="text"
                                value={quoteSearchQuery}
                                onChange={(e) => setQuoteSearchQuery(e.target.value)}
                                placeholder="Search quotation..."
                                className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 bg-white transition-all"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>
                          <div className="overflow-y-auto max-h-72 custom-scrollbar">
                            {filteredQuotations.length > 0 ? (
                              filteredQuotations.map((quote) => (
                                <button
                                  key={quote.id}
                                  onClick={() => {
                                    setSelectedQuoteId(quote.id);
                                    setInvoiceTitle(`Invoice for ${quote.title}`);
                                    setIsQuoteDropdownOpen(false);
                                  }}
                                  className={`w-full flex items-start gap-4 p-5 hover:bg-slate-50 transition-all text-left border-b border-slate-100 last:border-0 group ${
                                    selectedQuoteId === quote.id ? 'bg-slate-50/50 hover:bg-slate-50' : ''
                                  }`}
                                >
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[15px] font-semibold text-slate-900 truncate group-hover:text-slate-500 transition-colors mb-2.5">
                                      {quote.title}
                                    </p>
                                    <div className="space-y-1.5">
                                      <div className="flex items-center gap-2">
                                        <Icon
                                          icon="solar:calendar-linear"
                                          className="text-slate-400"
                                          width="14"
                                        />
                                        <p className="text-xs text-slate-500">
                                          Created {formatDate(quote.created_at)}
                                        </p>
                                      </div>
                                      {quote.valid_until && (
                                        <div className="flex items-center gap-2">
                                          <Icon
                                            icon="solar:clock-circle-linear"
                                            className="text-slate-400"
                                            width="14"
                                          />
                                          <p className="text-xs text-slate-500">
                                            Valid until {formatDate(quote.valid_until)}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end justify-between shrink-0 min-h-full">
                                    <span className="text-[15px] font-bold text-slate-900">
                                      {formatCurrency(quote.total_amount)}
                                    </span>
                                    {selectedQuoteId === quote.id && (
                                      <Icon
                                        icon="solar:check-circle-bold"
                                        className="text-slate-500 mt-auto"
                                        width="20"
                                      />
                                    )}
                                  </div>
                                </button>
                              ))
                            ) : (
                              <div className="p-12 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-3">
                                  <Icon
                                    icon="solar:document-linear"
                                    className="text-slate-400"
                                    width="28"
                                  />
                                </div>
                                <p className="text-sm font-medium text-slate-900 mb-1">No quotations found</p>
                                <p className="text-xs text-slate-500">Try adjusting your search terms</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {selectedQuote && (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <Icon icon="solar:info-circle-linear" className="text-slate-400" width="16" />
                          <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                            Selected Quote Details
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Amount</span>
                            <span className="font-semibold text-slate-800">
                              {formatCurrency(selectedQuote.total_amount)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Status</span>
                            <span className="font-semibold text-slate-800 capitalize">
                              {selectedQuote.status}
                            </span>
                          </div>
                          {selectedQuote.valid_until && (
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Valid Until</span>
                              <span className="font-semibold text-slate-800">
                                {formatDate(selectedQuote.valid_until)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-auto p-6 bg-gradient-to-br from-slate-50/80 to-slate-50 border-t border-slate-200/50 relative z-10 backdrop-blur-sm">
                  <div className="flex gap-3 items-start">
                    <Icon icon="solar:info-circle-linear" className="text-slate-400 mt-0.5" width="18" />
                    <p className="leading-relaxed text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">Quick Tip:</span> Only convert sent or published quotes to ensure accurate billing information.
                    </p>
                  </div>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="lg:p-8 w-full max-w-md mx-auto pt-6 px-6 pb-6 space-y-8 relative z-10">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
                      Notes & Details
                    </h2>
                    <p className="text-sm text-slate-500">
                      Configure payment details and terms for your invoice.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="uppercase text-xs font-semibold text-slate-600 tracking-wide">
                        Amount Due Now
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          value={amountDueNowPercentage}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || (parseFloat(val) >= 0 && parseFloat(val) <= 100)) {
                              setAmountDueNowPercentage(val);
                            }
                          }}
                          className="w-24 bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all shadow-sm hover:shadow-md hover:border-slate-300"
                          placeholder=""
                          min="0"
                          max="100"
                        />
                        <span className="text-xs text-slate-500">% Percentage of grand total to be billed now</span>
                      </div>
                      {selectedQuote && parseFloat(amountDueNowPercentage) > 0 && (
                        <p className="text-xs text-slate-500 mt-2">
                          Amount due now: <span className="font-semibold text-slate-900">{formatCurrency(amountDueNow)}</span>
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="uppercase text-xs font-semibold text-slate-600 tracking-wide">
                        Invoice Due In
                      </label>
                      <div className="relative" ref={dueDateDropdownRef}>
                        <button
                          onClick={() => setIsDueDateDropdownOpen(!isDueDateDropdownOpen)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 pr-3 h-[42px] text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-1 transition-all shadow-sm hover:shadow-md hover:border-slate-300 text-left flex items-center justify-between"
                        >
                          <span className="text-slate-700 truncate">
                            {invoiceDueInDays === 'custom'
                              ? `Custom (${customDays || '30'} days)`
                              : `${invoiceDueInDays} days`}
                          </span>
                          <Icon
                            icon="solar:alt-arrow-down-linear"
                            className={`flex-shrink-0 ml-2 text-slate-400 transition-transform duration-200 ${
                              isDueDateDropdownOpen ? 'rotate-180' : ''
                            }`}
                            width="13"
                          />
                        </button>

                        {isDueDateDropdownOpen && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200/80 shadow-xl z-50 overflow-hidden">
                            <div className="py-1.5">
                              {[15, 30, 45, 60, 90].map((days) => (
                                <button
                                  key={days}
                                  onClick={() => {
                                    setInvoiceDueInDays(days);
                                    setIsDueDateDropdownOpen(false);
                                  }}
                                  className={`w-full flex items-center justify-between px-3 py-2 transition-all duration-150 text-left ${
                                    invoiceDueInDays === days
                                      ? 'bg-slate-50/80 text-slate-600'
                                      : 'hover:bg-slate-50 text-slate-700'
                                  }`}
                                >
                                  <span className={`text-sm font-medium ${invoiceDueInDays === days ? 'font-semibold' : ''}`}>
                                    {days} days
                                  </span>
                                  {invoiceDueInDays === days && (
                                    <Icon
                                      icon="solar:check-circle-bold"
                                      className="text-slate-500"
                                      width="16"
                                    />
                                  )}
                                </button>
                              ))}
                              <div className="border-t border-slate-100"></div>
                              <button
                                onClick={() => {
                                  setInvoiceDueInDays('custom');
                                  setIsDueDateDropdownOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 transition-all duration-150 text-left ${
                                  invoiceDueInDays === 'custom'
                                    ? 'bg-slate-50/80 text-slate-600'
                                    : 'hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                <span className={`text-sm font-medium ${invoiceDueInDays === 'custom' ? 'font-semibold' : ''}`}>Custom</span>
                                {invoiceDueInDays === 'custom' && (
                                  <Icon
                                    icon="solar:check-circle-bold"
                                    className="text-slate-500"
                                    width="16"
                                  />
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      {invoiceDueInDays === 'custom' && (
                        <input
                          type="number"
                          value={customDays}
                          onChange={(e) => setCustomDays(e.target.value)}
                          placeholder="Enter number of days"
                          className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all shadow-sm hover:shadow-md hover:border-slate-300"
                          min="1"
                        />
                      )}
                      <p className="text-xs text-slate-500 mt-2">
                        Invoice due on: <span className="font-semibold text-slate-900">{formatDate(dueDate.toISOString().split('T')[0])}</span>
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="uppercase text-xs font-semibold text-slate-600 tracking-wide">
                          Payment Terms
                        </label>
                        <button
                          onClick={() => setIsEditingBilling(!isEditingBilling)}
                          className="text-xs font-medium text-slate-500 hover:text-slate-600 flex items-center gap-1 transition-colors"
                        >
                          <Icon
                            icon={isEditingBilling ? 'solar:check-circle-linear' : 'solar:pen-linear'}
                            width="14"
                          />
                          {isEditingBilling ? 'Done' : 'Edit'}
                        </button>
                      </div>

                      {isEditingBilling ? (
                        <textarea
                          value={billingDetails}
                          onChange={(e) => setBillingDetails(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all shadow-sm hover:shadow-md hover:border-slate-300 resize-none"
                          rows={8}
                        />
                      ) : (
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                          <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                            {billingDetails}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center justify-between uppercase text-xs font-semibold text-slate-600 tracking-wide">
                        <span>Additional Notes</span>
                        <span className="text-slate-400 normal-case font-medium">Optional</span>
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add any special instructions, payment details, or notes for the client..."
                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all shadow-sm hover:shadow-md hover:border-slate-300 resize-none"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-auto p-6 bg-gradient-to-br from-slate-50/80 to-slate-50 border-t border-slate-200/50 relative z-10 backdrop-blur-sm">
                  <div className="flex gap-3 items-start">
                    <Icon icon="solar:info-circle-linear" className="text-slate-400 mt-0.5" width="18" />
                    <p className="leading-relaxed text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">Pro Tip:</span> Setting a clear 'Amount Due Now' helps manage cash flow.
                    </p>
                  </div>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <div className="lg:p-8 w-full max-w-md mx-auto pt-6 px-6 pb-6 space-y-8 relative z-10">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
                      Review Invoice
                    </h2>
                    <p className="text-sm text-slate-500">
                      Review all details before publishing your invoice.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Main Invoice Card */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Invoice Number
                          </p>
                          <p className="text-lg font-bold text-slate-900">{mockReferenceNumber}</p>
                          {selectedQuote && (
                            <div className="flex items-center gap-1.5 mt-2">
                              <Icon
                                icon="solar:document-text-linear"
                                className="text-slate-400"
                                width="14"
                              />
                              <p className="text-xs text-slate-500">
                                From quote: {selectedQuote.title}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Total Amount
                        </p>
                        <p className="text-4xl font-bold text-slate-900">
                          {selectedQuote ? formatCurrency(selectedQuote.total_amount) : formatCurrency(0)}
                        </p>
                      </div>
                    </div>

                    {/* Payment Details Card */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
                      <div className="flex items-start justify-between pb-5 border-b border-slate-100">
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Amount Due Now
                          </p>
                          <p className="text-2xl font-bold text-slate-500">
                            {formatCurrency(amountDueNow)}
                          </p>
                          <p className="text-xs text-slate-500 mt-1.5">
                            {parseFloat(amountDueNowPercentage) || 0}% of total
                          </p>
                        </div>
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50">
                          <Icon
                            icon="solar:wallet-bold"
                            className="text-slate-500"
                            width="24"
                          />
                        </div>
                      </div>

                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Payment Due Date
                          </p>
                          <p className="text-base font-semibold text-slate-900">
                            {formatDate(dueDate.toISOString().split('T')[0])}
                          </p>
                          <p className="text-xs text-slate-500 mt-1.5">
                            Due in {invoiceDueInDays === 'custom' ? (customDays || '30') : invoiceDueInDays} days
                          </p>
                        </div>
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50">
                          <Icon
                            icon="solar:calendar-bold"
                            className="text-slate-600"
                            width="24"
                          />
                        </div>
                      </div>
                    </div>

                    {notes && (
                      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                          Additional Notes
                        </p>
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                          {notes}
                        </p>
                      </div>
                    )}

                  </div>
                </div>

                <div className="mt-auto p-6 bg-gradient-to-br from-emerald-50/50 to-slate-50 border-t border-emerald-100/50 relative z-10 backdrop-blur-sm">
                  <div className="flex gap-3 items-start">
                    <Icon icon="solar:check-circle-linear" className="text-emerald-600 mt-0.5" width="18" />
                    <p className="leading-relaxed text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">Ready to Publish:</span> Review all details carefully. Once published, you can send this invoice to your client for payment.
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
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
                  >
                    <Icon icon="solar:monitor-linear" width="14" />
                  </button>
                  <span className="absolute top-full right-0 mt-2 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                    Desktop
                  </span>
                </div>
                <div className="relative group/tooltip">
                  <button
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
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
                    <div className="text-right">
                      <h1 className="text-3xl font-bold text-slate-900 mb-2">INVOICE</h1>
                      <p className="text-slate-500 text-sm">{mockReferenceNumber}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-100/50">
                    <h2 className="text-2xl font-semibold text-slate-900 tracking-tight mb-4">
                      {invoiceTitle}
                    </h2>
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Invoice To</p>
                        {selectedQuote ? (
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-slate-900">Client Name</p>
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
                          <span className="font-semibold text-slate-600">Issue Date:</span> {formatDate(new Date().toISOString().split('T')[0])}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          <span className="font-semibold text-slate-600">Due Date:</span> {formatDate(dueDate.toISOString().split('T')[0])}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">What we offer:</h3>
                    {selectedQuote ? (
                      <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-100 grid grid-cols-12 gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                          <div className="col-span-6">Description</div>
                          <div className="col-span-2 text-center">QTY</div>
                          <div className="col-span-2 text-right">Price</div>
                          <div className="col-span-2 text-right">Amount</div>
                        </div>
                        <div className="bg-white px-4 py-4">
                          <div className="grid grid-cols-12 gap-4 items-center text-xs">
                            <div className="col-span-6">
                              <p className="font-semibold text-slate-900">{selectedQuote.title}</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">From quote reference</p>
                            </div>
                            <div className="col-span-2 text-center text-slate-700">1</div>
                            <div className="col-span-2 text-right text-slate-700">{formatCurrency(selectedQuote.total_amount)}</div>
                            <div className="col-span-2 text-right font-semibold text-slate-900">{formatCurrency(selectedQuote.total_amount)}</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="border border-slate-200 rounded-xl p-12 text-center">
                        <div className="text-slate-300 text-sm italic">No items added yet.</div>
                      </div>
                    )}
                  </div>

                  {selectedQuote && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 text-sm">
                        <span className="text-slate-600">Subtotal</span>
                        <span className="font-medium text-slate-900">{formatCurrency(selectedQuote.total_amount)}</span>
                      </div>
                      {parseFloat(amountDueNowPercentage) > 0 && (
                        <div className="flex justify-between items-center py-2 bg-slate-50 rounded-lg px-4 text-sm">
                          <div>
                            <span className="text-slate-500 font-semibold">Amount Due Now</span>
                            <span className="text-xs text-slate-600 ml-2">({parseFloat(amountDueNowPercentage) || 0}%)</span>
                          </div>
                          <span className="font-bold text-slate-800">{formatCurrency(amountDueNow)}</span>
                        </div>
                      )}
                      <div className="border-t-2 border-slate-900 pt-3 flex justify-between items-center">
                        <span className="text-lg font-bold text-slate-900">Total</span>
                        <span className="text-2xl font-bold text-slate-900">{formatCurrency(selectedQuote.total_amount)}</span>
                      </div>
                    </div>
                  )}

                  {billingDetails && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Payment Terms</h3>
                      <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 rounded-lg p-4 border border-slate-100">
                        {billingDetails}
                      </div>
                    </div>
                  )}

                  {notes && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Additional Notes</h3>
                      <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 rounded-lg p-4 border border-slate-100">
                        {notes}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
