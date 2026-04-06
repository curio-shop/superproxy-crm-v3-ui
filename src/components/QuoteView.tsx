import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useTier } from '../contexts/TierContext';

interface QuoteViewProps {
  onBackToQuotes: () => void;
}

export default function QuoteView({ onBackToQuotes }: QuoteViewProps) {
  const { can } = useTier();
  const isFreeTier = !can('noWatermark');
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [feedbackData, setFeedbackData] = useState({
    name: '',
    email: '',
    feedback: ''
  });
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    feedback: ''
  });

  const mockQuote = {
    name: 'Churning',
    reference: '1a187393-a4e9-4721',
    createdDate: 'January 14, 2026',
    expiresDate: 'February 13, 2026',
    buyer: {
      company: 'HPerez Construction, Inc.',
      address: 'Quezon City, Metro Manila, 1103',
      website: 'www.hperezinc.com',
      contact: 'Anna Perez',
      email: 'annaperez@gmail.com',
      phone: '+639125267150'
    },
    items: [
      {
        id: 1,
        name: 'PREFAB CONTAINER',
        description: 'A prefab container house is a dwelling built using prefabricated (factory-made) sections or repurposed steel shipping containers, designed for rapid assembly on-site, offering a durable, cost-effective, and often eco-friendly housing solution that can be quickly transported and installed for various uses like homes, offices, or temporary shelters. Prefab',
        image: '/api/placeholder/60/60',
        quantity: 1,
        unitPrice: 295000.00,
        total: 295000.00
      }
    ],
    subtotal: 295000.00,
    tax: 0,
    discount: 0,
    total: 295000.00,
    currency: '₱',
    termsOfSale: `1. Payment Terms
   • 50% deposit required upon acceptance
   • Balance due upon delivery
   • Payment methods: Bank transfer, Check

2. Delivery
   • Estimated delivery: 30-45 days from deposit
   • Delivery charges may apply based on location
   • Client responsible for site preparation

3. Warranty
   • 1-year warranty on structural components
   • Excludes damage from misuse or natural disasters

4. Validity
   • This quotation is valid for 30 days from the date of issue
   • Prices subject to change after expiry date`
  };

  const handlePrint = () => {
    window.print();
    setShowActionMenu(false);
  };

  const handleCopyLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    setShowActionMenu(false);
  };

  const handleDownloadPDF = () => {
    setShowActionMenu(false);
  };

  const handleCreatePresentation = () => {
    setShowActionMenu(false);
  };

  const handleSendEmail = () => {
    setShowActionMenu(false);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 50));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  const handleSubmitFeedback = () => {
    const errors = {
      name: '',
      email: '',
      feedback: ''
    };

    // Validate feedback
    if (!feedbackData.feedback.trim()) {
      errors.feedback = 'Please share your thoughts';
    }

    // Validate name
    if (!feedbackData.name.trim()) {
      errors.name = 'Name is required';
    }

    // Validate email
    if (!feedbackData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(feedbackData.email)) {
      errors.email = 'Please enter a valid email';
    }

    setValidationErrors(errors);

    // If there are any errors, don't submit
    if (errors.name || errors.email || errors.feedback) {
      return;
    }

    // All validation passed
    setShowFeedbackModal(false);
    setFeedbackData({ name: '', email: '', feedback: '' });
    setValidationErrors({ name: '', email: '', feedback: '' });
  };

  return (
    <div className="min-h-screen bg-[#f7f7f8] flex flex-col relative">
      {/* Branding watermark — top left */}
      {isFreeTier && (
        <a href="https://superproxy.com" target="_blank" rel="noopener noreferrer" className="fixed top-6 left-6 z-50 group">
          <div className="flex items-center gap-2">
            <img src="/superproxy-icon.png" alt="Superproxy" className="h-3.5 w-3.5 object-contain opacity-30 group-hover:opacity-50 transition-opacity" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-medium leading-tight">Powered by <span className="text-slate-500">Superproxy</span></span>
              <span className="text-[10px] text-amber-500/80 font-medium leading-tight group-hover:text-amber-600 transition-colors">Create yours free →</span>
            </div>
          </div>
        </a>
      )}

      <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
        <button
          onClick={onBackToQuotes}
          className="relative w-9 h-9 flex items-center justify-center bg-white rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors group/tooltip"
        >
          <Icon icon="solar:arrow-left-linear" width="18" className="text-slate-500" />
          <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
            Back to Quotes
          </span>
        </button>

        <div className="flex items-center gap-1 bg-white rounded-xl shadow-sm border border-slate-200 px-2 py-1">
          <button
            onClick={handleZoomOut}
            className="relative w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-lg transition-colors text-slate-600 font-semibold text-lg group/tooltip"
          >
            −
            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
              Zoom Out
            </span>
          </button>

          <button
            onClick={handleResetZoom}
            className="relative px-3 h-8 flex items-center justify-center hover:bg-slate-100 rounded-lg transition-colors min-w-[60px] group/tooltip"
          >
            <span className="text-sm font-medium text-slate-700">{zoomLevel}%</span>
            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
              Reset Zoom
            </span>
          </button>

          <button
            onClick={handleZoomIn}
            className="relative w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-lg transition-colors text-slate-600 font-semibold text-lg group/tooltip"
          >
            +
            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
              Zoom In
            </span>
          </button>
        </div>

        <button
          className="relative w-9 h-9 flex items-center justify-center bg-white rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors group/tooltip"
        >
          <Icon icon="solar:chat-round-line-linear" width="18" className="text-slate-500" />
          <span className="absolute top-full right-0 mt-2 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
            Show/Hide Comments
          </span>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center px-4 py-16 overflow-y-auto">
        <div
          className="w-full max-w-4xl transition-transform origin-top"
          style={{ transform: `scale(${zoomLevel / 100})` }}
        >
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200">
            <div className="p-12 md:p-16 space-y-8">
              <div className="flex items-center justify-center pb-6 border-b border-slate-200">
                <div className="flex flex-col items-center gap-2">
                  <svg viewBox="0 0 100 100" className="w-16 h-16">
                    <path d="M30 20 L50 10 L70 20 L70 50 L50 60 L30 50 Z" fill="currentColor" className="text-slate-900" />
                    <path d="M40 35 L60 35 M40 45 L60 45" stroke="currentColor" strokeWidth="3" className="text-orange-500" />
                  </svg>
                  <div className="text-2xl font-bold tracking-wide text-orange-600">EMBASSY</div>
                </div>
              </div>

              <div className="bg-slate-50/50 rounded-lg p-8 border border-slate-100">
                <h1 className="text-3xl font-bold text-slate-900 mb-6">
                  {mockQuote.name}
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-bold text-slate-900 mb-1.5">{mockQuote.buyer.company}</p>
                      <p className="text-sm text-slate-600">{mockQuote.buyer.address}</p>
                      <p className="text-sm text-slate-600">{mockQuote.buyer.website}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 mb-1.5">{mockQuote.buyer.contact}</p>
                      <p className="text-sm text-slate-600">{mockQuote.buyer.email}</p>
                      <p className="text-sm text-slate-600">{mockQuote.buyer.phone}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1.5">
                    <p className="text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">Reference:</span> {mockQuote.reference}
                    </p>
                    <p className="text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">Quote created:</span> {mockQuote.createdDate}
                    </p>
                    <p className="text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">Quote expires:</span> {mockQuote.expiresDate}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-base font-bold text-slate-900">Our Offer:</h2>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-400 text-white">
                    <div className="grid grid-cols-12 gap-4 px-6 py-3.5 text-xs font-bold uppercase tracking-wide">
                      <div className="col-span-5">Item & Description</div>
                      <div className="col-span-2 text-center">Period</div>
                      <div className="col-span-2 text-center">Quantity</div>
                      <div className="col-span-1 text-right">Unit Price</div>
                      <div className="col-span-2 text-right">Total</div>
                    </div>
                  </div>
                  <div className="bg-white">
                    {mockQuote.items.map((item) => (
                      <div key={item.id} className="grid grid-cols-12 gap-4 px-6 py-5 border-b border-slate-100 last:border-0">
                        <div className="col-span-5 flex gap-3">
                          <div className="w-12 h-12 rounded-md bg-slate-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                            <div className="w-8 h-8 bg-slate-300 rounded"></div>
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 text-sm mb-1">{item.name}</p>
                            <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                          </div>
                        </div>
                        <div className="col-span-2 flex items-center justify-center">
                          <span className="text-sm text-slate-600">1</span>
                        </div>
                        <div className="col-span-2 flex items-center justify-center">
                          <span className="text-sm font-semibold text-slate-900">{item.quantity}</span>
                        </div>
                        <div className="col-span-1 flex items-center justify-end">
                          <span className="text-sm text-slate-700">{mockQuote.currency}{item.unitPrice.toLocaleString()}.00</span>
                        </div>
                        <div className="col-span-2 flex items-center justify-end">
                          <span className="text-sm font-bold text-slate-900">{mockQuote.currency}{item.total.toLocaleString()}.00</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white px-6 py-6 border-t border-slate-200">
                    <div className="flex justify-end">
                      <div className="w-80 space-y-2.5">
                        <div className="flex justify-between text-sm text-slate-600">
                          <span>Subtotal</span>
                          <span>{mockQuote.currency}{mockQuote.subtotal.toLocaleString()}.00</span>
                        </div>
                        {mockQuote.tax > 0 && (
                          <div className="flex justify-between text-sm text-slate-600">
                            <span>Tax</span>
                            <span>{mockQuote.currency}{mockQuote.tax.toLocaleString()}.00</span>
                          </div>
                        )}
                        {mockQuote.discount > 0 && (
                          <div className="flex justify-between text-sm text-emerald-600">
                            <span>Discount</span>
                            <span>-{mockQuote.currency}{mockQuote.discount.toLocaleString()}.00</span>
                          </div>
                        )}
                        <div className="h-px bg-slate-200 my-3"></div>
                        <div className="flex justify-between text-lg font-bold text-slate-900">
                          <span>Total</span>
                          <span>{mockQuote.currency}{mockQuote.total.toLocaleString()}.00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Terms of Sale</h3>
                <pre className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap font-sans">
                  {mockQuote.termsOfSale}
                </pre>
              </div>
            </div>

            {isFreeTier && (
              <div className="px-12 md:px-16 py-4 bg-slate-50 flex items-center justify-center">
                <span className="text-[11px] text-slate-400">Created with <span className="font-semibold text-slate-500">Superproxy</span> — Free plan</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => {
                setShowFeedbackModal(!showFeedbackModal);
                if (!showFeedbackModal) {
                  setValidationErrors({ name: '', email: '', feedback: '' });
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-700 border border-slate-200 hover:border-slate-300 rounded-xl font-medium text-[13px] transition-all shadow-sm active:scale-[0.98]"
            >
              <Icon icon="solar:chat-round-dots-linear" width="15" className="text-slate-400" />
              <span>Feedback</span>
            </button>

            {showFeedbackModal && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => {
                    setShowFeedbackModal(false);
                    setValidationErrors({ name: '', email: '', feedback: '' });
                  }}
                ></div>
                <div className="group absolute bottom-full right-[-3.5rem] mb-3 w-[400px] bg-white rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.03)] border border-slate-200 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
                  <div className="px-5 py-4 border-b border-slate-100">
                    <div className="flex items-start justify-between">
                      <div>
                          <h2 className="text-[13px] font-semibold text-slate-700">Leave Feedback</h2>
                          <p className="text-[11px] text-slate-400 mt-0.5">Share your thoughts about this quote</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowFeedbackModal(false);
                          setValidationErrors({ name: '', email: '', feedback: '' });
                        }}
                        className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all flex-shrink-0 opacity-0 group-hover:opacity-100"
                      >
                        <Icon icon="solar:close-linear" width="18" />
                      </button>
                    </div>
                  </div>

                  <div className="px-5 py-4 space-y-3">
                    <div>
                      <textarea
                        value={feedbackData.feedback}
                        onChange={(e) => {
                          setFeedbackData({ ...feedbackData, feedback: e.target.value });
                          if (validationErrors.feedback) {
                            setValidationErrors({ ...validationErrors, feedback: '' });
                          }
                        }}
                        placeholder="Share your thoughts about this quote..."
                        rows={4}
                        className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white transition-all resize-none ${
                          validationErrors.feedback
                            ? 'border-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100'
                            : 'border-slate-200 focus:border-slate-300 focus:shadow-sm'
                        }`}
                      />
                      {validationErrors.feedback && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-rose-600">
                          <Icon icon="solar:danger-circle-bold" width="14" />
                          <p className="text-xs font-medium">{validationErrors.feedback}</p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          value={feedbackData.name}
                          onChange={(e) => {
                            setFeedbackData({ ...feedbackData, name: e.target.value });
                            if (validationErrors.name) {
                              setValidationErrors({ ...validationErrors, name: '' });
                            }
                          }}
                          placeholder="Your name"
                          className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white transition-all ${
                            validationErrors.name
                              ? 'border-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100'
                              : 'border-slate-200 focus:border-slate-300 focus:shadow-sm'
                          }`}
                        />
                        {validationErrors.name && (
                          <div className="flex items-center gap-1.5 mt-1.5 text-rose-600">
                            <Icon icon="solar:danger-circle-bold" width="14" />
                            <p className="text-xs font-medium">{validationErrors.name}</p>
                          </div>
                        )}
                      </div>
                      <div>
                        <input
                          type="email"
                          value={feedbackData.email}
                          onChange={(e) => {
                            setFeedbackData({ ...feedbackData, email: e.target.value });
                            if (validationErrors.email) {
                              setValidationErrors({ ...validationErrors, email: '' });
                            }
                          }}
                          placeholder="email@example.com"
                          className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white transition-all ${
                            validationErrors.email
                              ? 'border-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100'
                              : 'border-slate-200 focus:border-slate-300 focus:shadow-sm'
                          }`}
                        />
                        {validationErrors.email && (
                          <div className="flex items-center gap-1.5 mt-1.5 text-rose-600">
                            <Icon icon="solar:danger-circle-bold" width="14" />
                            <p className="text-xs font-medium">{validationErrors.email}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={handleSubmitFeedback}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-[13px] transition-all shadow-sm active:scale-[0.98]"
                    >
                      <Icon icon="solar:plain-2-linear" width="16" />
                      Submit Feedback
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowActionMenu(!showActionMenu)}
              className="relative flex items-center justify-center w-9 h-9 bg-white hover:bg-slate-50 text-slate-500 border border-slate-200 hover:border-slate-300 rounded-xl shadow-sm transition-colors group/tooltip"
            >
              <Icon icon="solar:menu-dots-bold" width="18" />
              <span className="absolute top-full right-0 mt-2 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                More Actions
              </span>
            </button>

            {showActionMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowActionMenu(false)}
                ></div>
                <div className="absolute bottom-12 right-0 w-48 bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-slate-200/60 py-1 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <button onClick={handlePrint} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors">
                    <Icon icon="solar:printer-linear" width="14" className="text-slate-400" />
                    Print
                  </button>
                  <button onClick={handleCopyLink} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors">
                    <Icon icon="solar:copy-linear" width="14" className="text-slate-400" />
                    {copiedLink ? 'Copied!' : 'Copy Link'}
                  </button>
                  <button onClick={handleDownloadPDF} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors">
                    <Icon icon="solar:download-linear" width="14" className="text-slate-400" />
                    Download PDF
                  </button>
                  <div className="my-1 border-t border-slate-100 mx-2" />
                  <button onClick={handleCreatePresentation} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors">
                    <Icon icon="solar:presentation-graph-linear" width="14" className="text-slate-400" />
                    Presentation
                  </button>
                  <button onClick={handleSendEmail} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors">
                    <Icon icon="solar:letter-linear" width="14" className="text-slate-400" />
                    Email Quote
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
