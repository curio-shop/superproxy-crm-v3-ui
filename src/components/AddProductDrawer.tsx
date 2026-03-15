import { Icon } from '@iconify/react';
import { useState } from 'react';
import Dropdown from './Dropdown';

interface AddProductDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddProductDrawer({ isOpen, onClose }: AddProductDrawerProps) {
  const [category, setCategory] = useState('');
  const [productType, setProductType] = useState('');
  const [currency, setCurrency] = useState('');
  const [status, setStatus] = useState('Active');

  if (!isOpen) return null;

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
        className="relative w-full max-w-[520px] h-full bg-white/80 backdrop-blur-2xl shadow-2xl flex flex-col transform transition-all duration-500 ease-out border-l border-white/60 rounded-l-[32px] ml-auto overflow-hidden"
        style={{
          animation: 'slideInRight 500ms cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div className="px-8 py-6 border-b border-slate-100/50 bg-white/40 backdrop-blur-md z-10 flex items-center justify-between sticky top-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
              <Icon icon="solar:box-linear" width="20" />
            </div>
            <div>
              <h2 className="text-lg text-slate-900 tracking-tight font-display font-semibold">
                Add Product
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                New entry for your inventory
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 rounded-xl border border-transparent hover:border-slate-200/60 transition-all flex items-center justify-center"
          >
            <Icon icon="solar:close-circle-linear" width="20" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <form className="space-y-5">
            <div className="bg-white/50 rounded-2xl p-5 border border-white/60 shadow-sm ring-1 ring-slate-100/50">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Icon icon="solar:tag-linear" width="14" />
                Product Details
              </h4>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    Product Name
                  </label>
                  <input
                    type="text"
                    className="block w-full rounded-xl border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
                    placeholder="e.g. Nike Air Max 270"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                      SKU
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-xl border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
                      placeholder="e.g. NK-2024-001"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                      Barcode
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-xl border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
                      placeholder="e.g. 123456789"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                      Category
                    </label>
                    <Dropdown
                      value={category}
                      options={[
                        'Electronics',
                        'Footwear',
                        'Apparel',
                        'Accessories',
                        'Furniture',
                        'Photography',
                        'Bundles',
                      ]}
                      onChange={(val) => setCategory(val as string)}
                      placeholder="Select category"
                      className="w-full"
                      buttonClassName="w-full"
                      menuClassName="w-full"
                      menuAlign="left"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                      Product Type
                    </label>
                    <Dropdown
                      value={productType}
                      options={['Inventory', 'Non-inventory', 'Service']}
                      onChange={(val) => setProductType(val as string)}
                      placeholder="Select type"
                      className="w-full"
                      buttonClassName="w-full"
                      menuClassName="w-full"
                      menuAlign="left"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/50 rounded-2xl p-5 border border-white/60 shadow-sm ring-1 ring-slate-100/50">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Icon icon="solar:wallet-money-linear" width="14" />
                Pricing
              </h4>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    Currency
                  </label>
                  <Dropdown
                    value={currency}
                    options={[
                      { value: 'USD', label: 'USD - US Dollar' },
                      { value: 'EUR', label: 'EUR - Euro' },
                      { value: 'GBP', label: 'GBP - British Pound' },
                      { value: 'JPY', label: 'JPY - Japanese Yen' },
                      { value: 'AUD', label: 'AUD - Australian Dollar' },
                      { value: 'CAD', label: 'CAD - Canadian Dollar' },
                      { value: 'CHF', label: 'CHF - Swiss Franc' },
                      { value: 'CNY', label: 'CNY - Chinese Yuan' },
                      { value: 'INR', label: 'INR - Indian Rupee' },
                      { value: 'SGD', label: 'SGD - Singapore Dollar' },
                    ]}
                    onChange={(val) => setCurrency(val as string)}
                    placeholder="Select currency"
                    searchable
                    className="w-full"
                    buttonClassName="w-full"
                    menuClassName="w-full"
                    menuAlign="left"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                      Cost Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="block w-full rounded-xl border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                      Margin (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="block w-full rounded-xl border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="e.g. 30"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    Unit Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="block w-full rounded-xl border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/50 rounded-2xl p-5 border border-white/60 shadow-sm ring-1 ring-slate-100/50">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Icon icon="solar:box-minimalistic-linear" width="14" />
                Stock &amp; Inventory
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                      Initial Stock
                    </label>
                    <input
                      type="number"
                      className="block w-full rounded-xl border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="e.g. 100"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                      Reorder Level
                    </label>
                    <input
                      type="number"
                      className="block w-full rounded-xl border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="e.g. 20"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    Supplier
                  </label>
                  <input
                    type="text"
                    className="block w-full rounded-xl border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
                    placeholder="e.g. Nike Inc."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    Warehouse Location
                  </label>
                  <input
                    type="text"
                    className="block w-full rounded-xl border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
                    placeholder="e.g. Aisle A, Shelf 12"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/50 rounded-2xl p-5 border border-white/60 shadow-sm ring-1 ring-slate-100/50">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Icon icon="solar:document-text-linear" width="14" />
                Product Information
              </h4>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    className="block w-full rounded-xl border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400 resize-none"
                    placeholder="e.g. Premium quality footwear with advanced cushioning technology..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    Status
                  </label>
                  <Dropdown
                    value={status}
                    options={['Active', 'Draft', 'Archived']}
                    onChange={(val) => setStatus(val as string)}
                    className="w-full"
                    buttonClassName="w-full"
                    menuClassName="w-full"
                    menuAlign="left"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/50 rounded-2xl p-5 border border-white/60 shadow-sm ring-1 ring-slate-100/50">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Icon icon="solar:gallery-linear" width="14" />
                Product Images
              </h4>
              <div className="space-y-3">
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer group">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                      <Icon icon="solar:upload-linear" width="24" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
                        Click to upload
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">PNG, JPG up to 5MB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-12"></div>
          </form>
        </div>

        <div className="px-8 py-5 border-t border-slate-100/50 bg-white/80 backdrop-blur-xl flex items-center gap-3 absolute bottom-0 w-full z-20">
          <button className="flex-1 rounded-xl bg-gradient-to-b from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 border-t border-white/20 text-white px-4 py-2.5 text-sm font-semibold tracking-wide shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
            <Icon icon="solar:check-circle-linear" width="18" />
            Create Product
          </button>
          <button className="hover:bg-slate-50 transition-all active:scale-[0.98] text-sm font-semibold text-slate-600 bg-white border-slate-200 border rounded-xl px-4 py-2.5 shadow-sm whitespace-nowrap">
            Create &amp; Add Another
          </button>
        </div>
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
      `}</style>
    </div>
  );
}
