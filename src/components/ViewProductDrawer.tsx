import { Icon } from '@iconify/react';
import { Product } from './Products';

interface ViewProductDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export default function ViewProductDrawer({ isOpen, onClose, product }: ViewProductDrawerProps) {
  if (!isOpen || !product) return null;

  const getStockPercentage = (stock: number, maxStock: number) => {
    return (stock / maxStock) * 100;
  };

  const getStockColor = (percentage: number) => {
    if (percentage === 0) return 'bg-slate-300';
    if (percentage < 10) return 'bg-rose-500';
    if (percentage < 50) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      active: {
        label: 'Active',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
      },
      low_stock: {
        label: 'Low Stock',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
        animate: true,
      },
      out_of_stock: {
        label: 'Out of Stock',
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        icon: true,
      },
      draft: {
        label: 'Draft',
        bg: 'bg-slate-100',
        text: 'text-slate-600',
        border: 'border-slate-200',
        dot: 'bg-slate-400',
      },
    };
    return configs[status as keyof typeof configs];
  };

  const statusConfig = getStatusConfig(product.status);
  const stockPercentage = getStockPercentage(product.stock, product.maxStock);

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
        className="relative w-full max-w-[480px] h-full bg-white/80 backdrop-blur-2xl shadow-2xl flex flex-col transform transition-all duration-500 ease-out border-l border-white/60 rounded-l-[32px] ml-auto overflow-hidden"
        style={{
          animation: 'slideInRight 500ms cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div className="px-8 py-6 border-b border-slate-100/50 bg-white/40 backdrop-blur-md z-10 sticky top-0">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <h2 className="text-xl text-slate-900 tracking-tight font-display font-bold mb-2">
                {product.name}
              </h2>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}
                >
                  {statusConfig.icon ? (
                    <Icon icon="solar:close-circle-linear" width="10" />
                  ) : (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot} ${statusConfig.animate ? 'animate-pulse' : ''}`}
                    />
                  )}
                  {statusConfig.label}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 rounded-xl border border-transparent hover:border-slate-200/60 transition-all flex items-center justify-center flex-shrink-0"
            >
              <Icon icon="solar:close-circle-linear" width="20" />
            </button>
          </div>

          {product.image && (
            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {!product.image && (
            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 shadow-sm flex items-center justify-center">
              <div className="text-center">
                <Icon icon="solar:gallery-linear" width="48" className="text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-400 font-medium">No image available</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="space-y-5">
            <div className="bg-white/50 rounded-2xl p-5 border border-white/60 shadow-sm ring-1 ring-slate-100/50">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Icon icon="solar:box-linear" width="14" />
                Product Details
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                  <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                    <Icon icon="solar:tag-price-linear" width="16" className="text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Unit Price
                    </p>
                    <p className="text-2xl font-bold text-slate-900 font-display">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                {product.sku && (
                  <div className="flex items-start gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                    <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                      <Icon icon="solar:hashtag-linear" width="16" className="text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        SKU
                      </p>
                      <p className="text-sm font-mono font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md inline-block">
                        {product.sku}
                      </p>
                    </div>
                  </div>
                )}

                {product.category && (
                  <div className="flex items-start gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                    <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                      <Icon icon="solar:folder-linear" width="16" className="text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Category
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {product.category}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white/50 rounded-2xl p-5 border border-white/60 shadow-sm ring-1 ring-slate-100/50">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Icon icon="solar:layers-linear" width="14" />
                Inventory Status
              </h4>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl border border-slate-200/60 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Current Stock
                      </p>
                      <p className="text-2xl font-bold text-slate-900 font-display">
                        {product.stock}
                        <span className="text-sm text-slate-500 font-medium ml-1">/ {product.maxStock}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Stock Level
                      </p>
                      <p className={`text-lg font-bold ${stockPercentage < 10 && stockPercentage > 0 ? 'text-rose-600' : 'text-slate-700'}`}>
                        {Math.round(stockPercentage)}%
                      </p>
                    </div>
                  </div>
                  <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${getStockColor(stockPercentage)}`}
                      style={{ width: `${stockPercentage}%` }}
                    />
                  </div>
                  {stockPercentage < 10 && stockPercentage > 0 && (
                    <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-rose-50 border border-rose-200 rounded-lg">
                      <Icon icon="solar:danger-triangle-linear" width="16" className="text-rose-600" />
                      <p className="text-xs font-semibold text-rose-700">Low stock alert</p>
                    </div>
                  )}
                  {stockPercentage === 0 && (
                    <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg">
                      <Icon icon="solar:close-circle-linear" width="16" className="text-slate-600" />
                      <p className="text-xs font-semibold text-slate-700">Out of stock</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {product.description && (
              <div className="bg-white/50 rounded-2xl p-5 border border-white/60 shadow-sm ring-1 ring-slate-100/50">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Icon icon="solar:document-text-linear" width="14" />
                  Description
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
          </div>
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
