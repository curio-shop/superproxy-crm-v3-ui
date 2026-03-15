import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

interface Workspace {
  id: string;
  name: string;
  logo_url: string | null;
  address: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  profile: string | null;
  created_at: string;
  updated_at: string;
}

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
  currentWorkspace: Workspace | null;
  onCreateNew?: (type: 'contact' | 'company' | 'product' | 'quote' | 'invoice') => void;
  onCreateQuote?: () => void;
  onCreateInvoice?: () => void;
  onOpenQuoteTemplate?: () => void;
  onOpenInvoiceTemplate?: () => void;
}

export default function Sidebar({ activePage, onPageChange, currentWorkspace, onCreateQuote, onCreateInvoice, onOpenQuoteTemplate, onOpenInvoiceTemplate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['ai-proxy']));

  const toggleSection = (section: 'quotations' | 'invoices' | 'ai-proxy') => {
    setOpenSections(prev => {
      const next = new Set(prev);
      next.has(section) ? next.delete(section) : next.add(section);
      return next;
    });
  };

  const isQuotationActive = activePage === 'quotations';
  const isInvoiceActive = activePage === 'invoices';
  const isAiProxyActive = activePage === 'ai-proxy';
  const isCallHistoryActive = activePage === 'call-history';

  return (
    <aside
      className={`hidden lg:flex flex-col z-40 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] group/sidebar bg-white/80 border-slate-200/50 border rounded-[24px] relative shadow-[0_8px_40px_rgba(0,0,0,0.08),0_2px_12px_rgba(0,0,0,0.04)] backdrop-blur-lg overflow-visible ${
        collapsed ? 'w-[88px]' : 'w-72'
      }`}
    >
      <div className="flex items-center justify-between pt-6 pr-5 pb-2 pl-6 transition-all duration-300 relative">
        <div className="flex items-center transition-all duration-300 overflow-hidden">
          <div className={`transition-all duration-300 ${collapsed ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'}`}>
            <img
              src="/superproxy-logo.png"
              alt="Superproxy"
              className="h-7 w-auto object-contain"
            />
          </div>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100/50 transition-all focus:outline-none group-hover/sidebar:opacity-100 duration-200 ${
            collapsed
              ? 'opacity-0 rotate-180 group-hover/sidebar:translate-x-0 absolute right-0 translate-x-full group-hover/sidebar:opacity-100'
              : 'opacity-0 translate-x-2 group-hover/sidebar:translate-x-0'
          }`}
          aria-label="Toggle sidebar"
        >
          <Icon icon="solar:sidebar-minimalistic-linear" width="20" />
        </button>
      </div>

      <nav
        className={`flex-1 pt-4 pb-4 overflow-y-auto ${
          collapsed ? 'px-3' : 'px-3'
        }`}
      >
        <div className="space-y-1">

          {/* ── AI Proxy (expandable) ── */}
          <div>
            <button
              onClick={() => {
                toggleSection('ai-proxy');
                if (!openSections.has('ai-proxy')) onPageChange('ai-proxy');
              }}
              className={`w-full group flex items-center rounded-2xl transition-all duration-300 relative text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 ${collapsed ? 'justify-center p-3' : 'gap-3.5 px-4 py-3'}`}
            >
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                <svg
                  viewBox="0 0 20 20"
                  width="18"
                  height="18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="transition-colors text-slate-400 group-hover:text-slate-600"
                >
                  <path
                    d="M10 1C10 1 11.2 6.5 13.5 8.5C15.8 10.5 19 10 19 10C19 10 15.8 9.5 13.5 11.5C11.2 13.5 10 19 10 19C10 19 8.8 13.5 6.5 11.5C4.2 9.5 1 10 1 10C1 10 4.2 10.5 6.5 8.5C8.8 6.5 10 1 10 1Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <span className={`font-semibold text-sm whitespace-nowrap overflow-hidden transition-all duration-300 flex-1 text-left ${collapsed ? 'w-0 opacity-0' : 'opacity-100'}`}>
                AI Proxy
              </span>
              {!collapsed && (
                <Icon
                  icon="solar:alt-arrow-down-linear"
                  width="14"
                  className={`text-slate-400 transition-transform duration-200 ${openSections.has('ai-proxy') ? 'rotate-180' : ''}`}
                />
              )}
              {collapsed && (
                <span className="absolute left-full ml-3 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white text-sm font-semibold rounded-xl shadow-2xl ring-1 ring-white/10 opacity-0 scale-95 -translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-300 ease-out whitespace-nowrap z-[35] pointer-events-none">
                  AI Proxy
                  <span className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-[7px] border-transparent border-r-slate-800"></span>
                </span>
              )}
            </button>

            {/* AI Proxy sub-items */}
            {openSections.has('ai-proxy') && !collapsed && (
              <div className="mt-0.5 ml-4 pl-4 space-y-0.5">
                <button
                  onClick={() => onPageChange('ai-proxy')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors ${
                    isAiProxyActive ? 'text-slate-900 font-semibold bg-slate-900/[0.05]' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
                  }`}
                >
                  <Icon icon="solar:pen-new-square-linear" width="15" className={isAiProxyActive ? 'text-slate-900' : 'text-slate-400'} />
                  Task
                </button>
                <button
                  onClick={() => onPageChange('call-history')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors ${
                    isCallHistoryActive ? 'text-slate-900 font-semibold bg-slate-900/[0.05]' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
                  }`}
                >
                  <Icon icon="solar:phone-linear" width="15" className={isCallHistoryActive ? 'text-slate-900' : 'text-slate-400'} />
                  Calls
                </button>
              </div>
            )}
          </div>

          {/* ── Dashboard ── */}
          <button
            onClick={() => onPageChange('home')}
            className={`w-full group flex items-center rounded-2xl transition-all duration-300 relative ${
              activePage === 'home'
                ? 'bg-slate-900/[0.06] text-slate-900'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
            } ${collapsed ? 'justify-center p-3' : 'gap-3.5 px-4 py-3'}`}
          >
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              <Icon
                icon="solar:widget-linear"
                width="20"
                className={`transition-colors ${
                  activePage === 'home' ? 'text-slate-900 [&_*]:stroke-[2]' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />
            </div>
            <span
              className={`whitespace-nowrap overflow-hidden transition-all duration-300 text-sm font-medium ${
                collapsed ? 'w-0 opacity-0' : 'opacity-100'
              }`}
            >
              Dashboard
            </span>
            {collapsed && (
              <span className="absolute left-full ml-3 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white text-sm font-semibold rounded-xl shadow-2xl ring-1 ring-white/10 opacity-0 scale-95 -translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-300 ease-out whitespace-nowrap z-[35] pointer-events-none">
                Dashboard
                <span className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-[7px] border-transparent border-r-slate-800"></span>
              </span>
            )}
          </button>

          {/* ── Separator + Sales category ── */}
          <div className={`pt-3 pb-1 transition-all duration-300 ${collapsed ? 'px-0' : 'px-1'}`}>
            {collapsed ? (
              <div className="h-px bg-slate-200/70 mx-1" />
            ) : (
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3">Sales</p>
            )}
          </div>

          {/* Contact */}
          <button
            onClick={() => onPageChange('contacts')}
            className={`w-full group flex items-center rounded-2xl transition-all duration-300 relative ${
              activePage === 'contacts'
                ? 'bg-slate-900/[0.06] text-slate-900'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
            } ${collapsed ? 'justify-center p-3' : 'gap-3.5 px-4 py-3'}`}
          >
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              <Icon
                icon="solar:users-group-two-rounded-linear"
                width="20"
                className={`transition-colors ${
                  activePage === 'contacts' ? 'text-slate-900 [&_*]:stroke-[2]' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />
            </div>
            <span className={`font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'opacity-100'}`}>
              Contact
            </span>
            {collapsed && (
              <span className="absolute left-full ml-3 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white text-sm font-semibold rounded-xl shadow-2xl ring-1 ring-white/10 opacity-0 scale-95 -translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-300 ease-out whitespace-nowrap z-[35] pointer-events-none">
                Contact
                <span className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-[7px] border-transparent border-r-slate-800"></span>
              </span>
            )}
          </button>

          {/* Company */}
          <button
            onClick={() => onPageChange('companies')}
            className={`w-full group flex items-center rounded-2xl transition-all duration-300 relative ${
              activePage === 'companies'
                ? 'bg-slate-900/[0.06] text-slate-900'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
            } ${collapsed ? 'justify-center p-3' : 'gap-3.5 px-4 py-3'}`}
          >
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              <Icon
                icon="solar:buildings-2-linear"
                width="20"
                className={`transition-colors ${
                  activePage === 'companies' ? 'text-slate-900 [&_*]:stroke-[2]' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />
            </div>
            <span className={`font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'opacity-100'}`}>
              Company
            </span>
            {collapsed && (
              <span className="absolute left-full ml-3 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white text-sm font-semibold rounded-xl shadow-2xl ring-1 ring-white/10 opacity-0 scale-95 -translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-300 ease-out whitespace-nowrap z-[35] pointer-events-none">
                Company
                <span className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-[7px] border-transparent border-r-slate-800"></span>
              </span>
            )}
          </button>

          {/* Products */}
          <button
            onClick={() => onPageChange('products')}
            className={`w-full group flex items-center rounded-2xl transition-all duration-300 relative ${
              activePage === 'products'
                ? 'bg-slate-900/[0.06] text-slate-900'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
            } ${collapsed ? 'justify-center p-3' : 'gap-3.5 px-4 py-3'}`}
          >
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              <Icon
                icon="solar:box-linear"
                width="20"
                className={`transition-colors ${
                  activePage === 'products' ? 'text-slate-900 [&_*]:stroke-[2]' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />
            </div>
            <span className={`font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'opacity-100'}`}>
              Products
            </span>
            {collapsed && (
              <span className="absolute left-full ml-3 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white text-sm font-semibold rounded-xl shadow-2xl ring-1 ring-white/10 opacity-0 scale-95 -translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-300 ease-out whitespace-nowrap z-[35] pointer-events-none">
                Products
                <span className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-[7px] border-transparent border-r-slate-800"></span>
              </span>
            )}
          </button>

          {/* ── Quotation (expandable) ── */}
          <div>
            <button
              onClick={() => {
                toggleSection('quotations'); if (!openSections.has('quotations')) onPageChange('quotations');
              }}
              className={`w-full group flex items-center rounded-2xl transition-all duration-300 relative text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 ${collapsed ? 'justify-center p-3' : 'gap-3.5 px-4 py-3'}`}
            >
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                <Icon
                  icon="solar:file-text-linear"
                  width="20"
                  className="transition-colors text-slate-400 group-hover:text-slate-600"
                />
              </div>
              <span className={`font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-300 flex-1 text-left ${collapsed ? 'w-0 opacity-0' : 'opacity-100'}`}>
                Quotation
              </span>
              {!collapsed && (
                <Icon
                  icon="solar:alt-arrow-down-linear"
                  width="14"
                  className={`text-slate-400 transition-transform duration-200 ${openSections.has('quotations') ? 'rotate-180' : ''}`}
                />
              )}
              {collapsed && (
                <span className="absolute left-full ml-3 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white text-sm font-semibold rounded-xl shadow-2xl ring-1 ring-white/10 opacity-0 scale-95 -translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-300 ease-out whitespace-nowrap z-[35] pointer-events-none">
                  Quotation
                  <span className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-[7px] border-transparent border-r-slate-800"></span>
                </span>
              )}
            </button>

            {/* Quotation sub-items */}
            {openSections.has('quotations') && !collapsed && (
              <div className="mt-0.5 ml-4 pl-4 space-y-0.5">
                <button
                  onClick={() => onPageChange('quotations')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors ${
                    isQuotationActive ? 'text-slate-900 font-semibold bg-slate-900/[0.05]' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
                  }`}
                >
                  <Icon icon="solar:list-linear" width="15" className={isQuotationActive ? 'text-slate-900' : 'text-slate-400'} />
                  All Quotes
                </button>
                <button
                  onClick={onOpenQuoteTemplate}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 transition-colors"
                >
                  <Icon icon="solar:palette-linear" width="15" className="text-slate-400" />
                  Templates
                </button>
                <button
                  onClick={onCreateQuote}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 transition-colors"
                >
                  <Icon icon="solar:add-circle-linear" width="15" className="text-slate-400" />
                  Create Quote
                </button>
              </div>
            )}
          </div>

          {/* ── Invoicing (expandable) ── */}
          <div>
            <button
              onClick={() => {
                toggleSection('invoices'); if (!openSections.has('invoices')) onPageChange('invoices');
              }}
              className={`w-full group flex items-center rounded-2xl transition-all duration-300 relative text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 ${collapsed ? 'justify-center p-3' : 'gap-3.5 px-4 py-3'}`}
            >
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                <Icon
                  icon="solar:bill-list-linear"
                  width="20"
                  className="transition-colors text-slate-400 group-hover:text-slate-600"
                />
              </div>
              <span className={`font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-300 flex-1 text-left ${collapsed ? 'w-0 opacity-0' : 'opacity-100'}`}>
                Invoicing
              </span>
              {!collapsed && (
                <Icon
                  icon="solar:alt-arrow-down-linear"
                  width="14"
                  className={`text-slate-400 transition-transform duration-200 ${openSections.has('invoices') ? 'rotate-180' : ''}`}
                />
              )}
              {collapsed && (
                <span className="absolute left-full ml-3 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white text-sm font-semibold rounded-xl shadow-2xl ring-1 ring-white/10 opacity-0 scale-95 -translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-300 ease-out whitespace-nowrap z-[35] pointer-events-none">
                  Invoicing
                  <span className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-[7px] border-transparent border-r-slate-800"></span>
                </span>
              )}
            </button>

            {/* Invoicing sub-items */}
            {openSections.has('invoices') && !collapsed && (
              <div className="mt-0.5 ml-4 pl-4 space-y-0.5">
                <button
                  onClick={() => onPageChange('invoices')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors ${
                    isInvoiceActive ? 'text-slate-900 font-semibold bg-slate-900/[0.05]' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
                  }`}
                >
                  <Icon icon="solar:list-linear" width="15" className={isInvoiceActive ? 'text-slate-900' : 'text-slate-400'} />
                  All Invoices
                </button>
                <button
                  onClick={onOpenInvoiceTemplate}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 transition-colors"
                >
                  <Icon icon="solar:palette-linear" width="15" className="text-slate-400" />
                  Templates
                </button>
                <button
                  onClick={onCreateInvoice}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 transition-colors"
                >
                  <Icon icon="solar:add-circle-linear" width="15" className="text-slate-400" />
                  Create Invoice
                </button>
              </div>
            )}
          </div>

          {/* ── Separator + Tools category ── */}
          <div className={`pt-3 pb-1 transition-all duration-300 ${collapsed ? 'px-0' : 'px-1'}`}>
            {collapsed ? (
              <div className="h-px bg-slate-200/70 mx-1" />
            ) : (
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3">Tools</p>
            )}
          </div>

          {/* Walkthroughs */}
          <button
            onClick={() => onPageChange('presentations')}
            className={`w-full group flex items-center rounded-2xl transition-all duration-300 relative ${
              activePage === 'presentations'
                ? 'bg-slate-900/[0.06] text-slate-900'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
            } ${collapsed ? 'justify-center p-3' : 'gap-3.5 px-4 py-3'}`}
          >
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              <Icon
                icon="solar:videocamera-record-linear"
                width="20"
                className={`transition-colors ${
                  activePage === 'presentations' ? 'text-slate-900 [&_*]:stroke-[2]' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />
            </div>
            <span className={`font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'opacity-100'}`}>
              Walkthroughs
            </span>
            {collapsed && (
              <span className="absolute left-full ml-3 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white text-sm font-semibold rounded-xl shadow-2xl ring-1 ring-white/10 opacity-0 scale-95 -translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-300 ease-out whitespace-nowrap z-[35] pointer-events-none">
                Walkthroughs
                <span className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-[7px] border-transparent border-r-slate-800"></span>
              </span>
            )}
          </button>

          {/* Currency */}
          <button
            onClick={() => onPageChange('currency')}
            className={`w-full group flex items-center rounded-2xl transition-all duration-300 relative ${
              activePage === 'currency'
                ? 'bg-slate-900/[0.06] text-slate-900'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
            } ${collapsed ? 'justify-center p-3' : 'gap-3.5 px-4 py-3'}`}
          >
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              <Icon
                icon="solar:dollar-minimalistic-linear"
                width="20"
                className={`transition-colors ${
                  activePage === 'currency' ? 'text-slate-900 [&_*]:stroke-[2]' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />
            </div>
            <span className={`font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'opacity-100'}`}>
              Currency
            </span>
            {collapsed && (
              <span className="absolute left-full ml-3 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white text-sm font-semibold rounded-xl shadow-2xl ring-1 ring-white/10 opacity-0 scale-95 -translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-300 ease-out whitespace-nowrap z-[35] pointer-events-none">
                Currency
                <span className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-[7px] border-transparent border-r-slate-800"></span>
              </span>
            )}
          </button>

          {/* Email */}
          <button
            onClick={() => onPageChange('new-email')}
            className={`w-full group flex items-center rounded-2xl transition-all duration-300 relative ${
              activePage === 'new-email'
                ? 'bg-slate-900/[0.06] text-slate-900'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
            } ${collapsed ? 'justify-center p-3' : 'gap-3.5 px-4 py-3'}`}
          >
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              <Icon
                icon="solar:letter-linear"
                width="20"
                className={`transition-colors ${
                  activePage === 'new-email' ? 'text-slate-900 [&_*]:stroke-[2]' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />
            </div>
            <span className={`font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'opacity-100'}`}>
              Email
            </span>
            {collapsed && (
              <span className="absolute left-full ml-3 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white text-sm font-semibold rounded-xl shadow-2xl ring-1 ring-white/10 opacity-0 scale-95 -translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-300 ease-out whitespace-nowrap z-[35] pointer-events-none">
                Email
                <span className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-[7px] border-transparent border-r-slate-800"></span>
              </span>
            )}
          </button>

        </div>
      </nav>


      {!collapsed && (
        <div className="px-5 pb-2 flex items-center justify-center gap-2">
          <span className="text-xs font-medium text-slate-400">Free plan</span>
          <span className="h-3 w-px bg-slate-200"></span>
          <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
            Upgrade
          </button>
        </div>
      )}

      <div className={`h-px w-auto bg-slate-100 transition-all duration-300 ${collapsed ? 'mx-3' : 'mx-6'}`}></div>

      <div className={`transition-all duration-300 py-3 ${collapsed ? 'px-2' : 'px-3'}`}>
        <button
          onClick={() => onPageChange('workspace')}
          className={`w-full group flex items-center rounded-2xl transition-all duration-300 relative ${
            activePage === 'workspace'
              ? 'bg-slate-900/[0.06] text-slate-900'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
          } ${collapsed ? 'justify-center p-3' : 'gap-3.5 px-4 py-3'}`}
        >
          <div className="h-5 w-5 rounded-lg overflow-hidden shrink-0">
            <img
              src="https://ryuxwkawbokdgvkiwzqd.supabase.co/storage/v1/object/public/site-asset/OOH-spxy.png"
              alt="OOH Media Advertising"
              className="h-full w-full object-cover"
            />
          </div>
          <span
            className={`font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${
              collapsed ? 'w-0 opacity-0' : 'opacity-100'
            }`}
          >
            {currentWorkspace?.name || 'OOH Media Advertising'}
          </span>
          {collapsed && (
            <span className="absolute left-full ml-3 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white text-sm font-semibold rounded-xl shadow-2xl ring-1 ring-white/10 opacity-0 scale-95 -translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-300 ease-out whitespace-nowrap z-[35] pointer-events-none">
              {currentWorkspace?.name || 'OOH Media Advertising'}
              <span className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-[7px] border-transparent border-r-slate-800"></span>
            </span>
          )}
        </button>

        <button
          onClick={() => onPageChange('account')}
          className={`relative w-full flex items-center p-2.5 mt-0.5 rounded-2xl hover:bg-slate-50/80 cursor-pointer transition-colors duration-200 group ${
            activePage === 'account' ? 'bg-slate-100/80' : ''
          } ${collapsed ? 'justify-center' : 'gap-3'}`}
        >
          <div className="relative shrink-0">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80"
              alt="Melwyn Arrubio"
              className="h-8 w-8 rounded-full object-cover border border-white ring-1 ring-slate-100 transition-all duration-200"
            />
            <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white"></div>
          </div>
          <div className={`flex-1 min-w-0 text-left whitespace-nowrap overflow-hidden transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'opacity-100'}`}>
            <p className="truncate group-hover:text-slate-900 transition-colors text-sm font-medium text-slate-900">
              Richard Mell
            </p>
            <p className="text-xs text-slate-400 truncate group-hover:text-slate-500">richardmell@gmail.com</p>
          </div>
          {collapsed && (
            <span className="absolute left-full ml-3 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white text-sm font-semibold rounded-xl shadow-2xl ring-1 ring-white/10 opacity-0 scale-95 -translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-300 ease-out whitespace-nowrap z-[35] pointer-events-none">
              Richard Mille
              <span className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-[7px] border-transparent border-r-slate-800"></span>
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
