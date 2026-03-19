import { Icon } from '@iconify/react';
import { useState, useRef, useEffect } from 'react';
import ScopeFilter, { ScopeType } from './ScopeFilter';
import Dropdown from './Dropdown';

export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  stock: number;
  maxStock: number;
  price: number;
  status: 'active' | 'low_stock' | 'out_of_stock' | 'draft';
  image?: string;
  description?: string;
}

interface ProductsProps {
  isTeamView: boolean;
  homeFilterPreference: 'team' | 'personal';
  onViewProduct?: (product: Product) => void;
  onOpenAddProduct?: () => void;
  onDeleteProduct?: (product: Product) => void;
}

export default function Products({ isTeamView, homeFilterPreference, onViewProduct, onOpenAddProduct, onDeleteProduct }: ProductsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scopeFilter, setScopeFilter] = useState<ScopeType>(homeFilterPreference);
  const [hasManuallyChanged, setHasManuallyChanged] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasManuallyChanged) {
      setScopeFilter(homeFilterPreference);
    }
  }, [homeFilterPreference, hasManuallyChanged]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const products: Product[] = [
    { id: '1', name: 'Nike Air Max 270', category: 'Footwear', sku: 'NK-2024-001', stock: 450, maxStock: 1000, price: 129.00, status: 'active', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=100&h=100', description: 'Lightweight running shoe with Max Air unit for all-day comfort. Breathable mesh upper with foam midsole cushioning for everyday wear.' },
    { id: '2', name: 'Sony WH-1000XM4', category: 'Electronics', sku: 'SN-WH-004', stock: 12, maxStock: 200, price: 348.00, status: 'low_stock', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&h=100', description: 'Noise-cancelling wireless headphones with 30hr battery life. Features adaptive sound control, multipoint connection, and speak-to-chat technology.' },
    { id: '3', name: 'Fujifilm X-T30', category: 'Photography', sku: 'FJ-XT30-II', stock: 85, maxStock: 100, price: 899.00, status: 'active', image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=100&h=100', description: 'Mirrorless camera with 26.1MP sensor and 4K video. Compact body with advanced autofocus and film simulation modes for stunning color reproduction.' },
    { id: '4', name: 'Analog Watch', category: 'Accessories', sku: 'AW-SERIES-5', stock: 0, maxStock: 50, price: 210.00, status: 'out_of_stock', image: 'https://images.unsplash.com/photo-1593998066526-65fcab3021a2?auto=format&fit=crop&w=100&h=100', description: 'Stainless steel case with sapphire crystal and leather strap. Japanese quartz movement with 50m water resistance and luminous hands.' },
    { id: '5', name: 'Premium Kit', category: 'Bundles', sku: 'BUN-2023-EX', stock: 14, maxStock: 20, price: 1299.00, status: 'active', description: 'Complete professional bundle with all essential accessories. Includes carrying case, cables, cleaning kit, and extended warranty coverage.' },
    { id: '6', name: 'Wireless Charger', category: 'Electronics', sku: 'WC-MAG-01', stock: 320, maxStock: 500, price: 49.00, status: 'active', description: 'MagSafe-compatible fast charger with LED indicator. Supports up to 15W charging with foreign object detection and temperature control.' },
    { id: '7', name: 'Leather Backpack', category: 'Accessories', sku: 'LB-PRO-22', stock: 8, maxStock: 100, price: 189.00, status: 'low_stock', description: 'Full-grain leather with padded laptop compartment. Fits up to 15-inch laptops with organizer pockets and adjustable shoulder straps.' },
    { id: '8', name: 'Running Shorts', category: 'Footwear', sku: 'RS-DRI-07', stock: 275, maxStock: 400, price: 45.00, status: 'active', description: 'Moisture-wicking fabric with built-in compression liner. Lightweight 5-inch inseam design with zippered pocket and reflective details.' },
    { id: '9', name: 'Studio Monitor', category: 'Electronics', sku: 'SM-KRK-V8', stock: 0, maxStock: 30, price: 449.00, status: 'out_of_stock', description: '8-inch powered speaker for professional audio mixing. Bi-amped design with 230W output delivering flat frequency response for accurate monitoring.' },
    { id: '10', name: 'Travel Adapter', category: 'Accessories', sku: 'TA-UNI-03', stock: 180, maxStock: 300, price: 29.00, status: 'draft', description: 'Universal adapter supporting 150+ countries with USB-C. Includes 3 USB-A ports, surge protection, and a compact foldable design for easy packing.' },
  ];

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = { active: 'Active', low_stock: 'Low Stock', out_of_stock: 'Out of Stock', draft: 'Draft' };
    return labels[status] || status;
  };

  const handleAction = (action: string, product: Product) => {
    if (action === 'View') onViewProduct?.(product);
    if (action === 'Delete') onDeleteProduct?.(product);
    setOpenDropdown(null);
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col p-6" style={{ scrollbarGutter: 'stable' }}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="group w-full sm:w-80 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon icon="solar:magnifer-linear" width="16" className="text-slate-400 group-focus-within:text-slate-500 transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-white text-slate-600 placeholder-slate-400 focus:outline-none focus:border-slate-400 sm:text-sm transition-colors hover:border-slate-300"
              placeholder="Search products..."
            />
          </div>
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
            <button
              onClick={() => { setScopeFilter('all'); setHasManuallyChanged(true); }}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${scopeFilter === 'all' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              All
            </button>
            <button
              onClick={() => { setScopeFilter('personal'); setHasManuallyChanged(true); }}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${scopeFilter === 'personal' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Personal
            </button>
            <button
              onClick={() => { setScopeFilter('team'); setHasManuallyChanged(true); }}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${scopeFilter === 'team' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Team
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInventory(!showInventory)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium transition-all ${
              showInventory ? 'bg-slate-100 text-slate-700' : 'border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300'
            }`}
          >
            <Icon icon="solar:chart-2-linear" width="14" />
            Inventory
          </button>
          <button
            onClick={() => onOpenAddProduct?.()}
            className="flex items-center gap-2 border border-slate-200 text-slate-600 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50 px-4 py-2 rounded-xl transition-all active:scale-[0.98]"
          >
            <Icon icon="solar:add-circle-linear" width="15" className="text-slate-400" />
            <span className="text-[13px] font-medium">Add Product</span>
          </button>
        </div>
      </div>

      {/* Inventory overview — collapsible */}
      {showInventory && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Products</p>
            <p className="text-xl font-semibold text-slate-800">1,248</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Inventory Value</p>
            <p className="text-xl font-semibold text-slate-800">$84.2k</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Low Stock</p>
            <p className="text-xl font-semibold text-slate-800">12</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Categories</p>
            <p className="text-xl font-semibold text-slate-800">24</p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-hidden flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="min-w-full divide-y divide-slate-100">
            <thead>
              <tr className="text-left text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                <th className="pl-5 pr-6 py-3 w-[22%]">Product</th>
                <th className="px-5 py-3 w-[38%]">Description</th>
                <th className="px-5 py-3 w-[14%]">Stock</th>
                <th className="px-5 py-3 w-[18%]">Price</th>
                <th className="px-3 py-3 w-[8%]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                  onClick={() => onViewProduct?.(product)}
                >
                  <td className="pl-5 pr-6 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <Icon icon="solar:box-linear" width="14" className="text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="text-[13px] font-medium text-slate-800 block">{product.name}</span>
                        <span className="text-[11px] text-slate-400">{product.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    {product.description ? (
                      <span className="text-xs text-slate-400 block line-clamp-2 leading-relaxed" title={product.description}>{product.description}</span>
                    ) : (
                      <span className="text-[13px] text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <span className="text-[13px] text-slate-500">{product.stock.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <span className="text-[13px] font-medium text-slate-700">${product.price.toFixed(2)}</span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="relative" ref={openDropdown === product.id ? dropdownRef : null}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === product.id ? null : product.id); }}
                        className={`flex items-center justify-center w-7 h-7 rounded-lg border transition-colors ${
                          openDropdown === product.id
                            ? 'bg-slate-100 border-slate-200 text-slate-600'
                            : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <Icon icon="solar:menu-dots-bold" width="14" />
                      </button>
                      {openDropdown === product.id && (
                        <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-slate-200/60 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                          <button onClick={(e) => { e.stopPropagation(); handleAction('View', product); }} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors">
                            <Icon icon="solar:eye-linear" width="14" className="text-slate-400" />
                            View
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); setOpenDropdown(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors">
                            <Icon icon="solar:pen-linear" width="14" className="text-slate-400" />
                            Edit
                          </button>
                          <div className="my-1 border-t border-slate-100 mx-2" />
                          <button onClick={(e) => { e.stopPropagation(); handleAction('Delete', product); }} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors">
                            <Icon icon="solar:trash-bin-minimalistic-linear" width="14" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex border-t border-slate-100 py-3 px-4 items-center gap-3">
          <span className="text-[11px] text-slate-400">Showing 1–10 of 1,248</span>
          <div className="flex items-center gap-1.5">
            <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded-lg text-slate-300 transition-colors" disabled>
              <Icon icon="solar:alt-arrow-left-linear" width="14" />
            </button>
            <button className="px-2.5 h-7 bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-800">1</button>
            <button className="px-2.5 h-7 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-500 hover:bg-slate-50 transition-colors">2</button>
            <span className="text-slate-300 text-[11px] px-0.5">...</span>
            <button className="px-2.5 h-7 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-500 hover:bg-slate-50 transition-colors">125</button>
            <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
              <Icon icon="solar:alt-arrow-right-linear" width="14" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
