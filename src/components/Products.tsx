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
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('Any Status');
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
    {
      id: '1',
      name: 'Nike Air Max 270',
      category: 'Footwear',
      sku: 'NK-2024-001',
      stock: 450,
      maxStock: 1000,
      price: 129.0,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=100&h=100',
      description: 'Experience ultimate comfort with Nike Air Max 270. Featuring the largest Max Air unit yet, these shoes deliver unrivaled all-day comfort with their lightweight and responsive cushioning.',
    },
    {
      id: '2',
      name: 'Sony WH-1000XM4',
      category: 'Electronics',
      sku: 'SN-WH-004',
      stock: 12,
      maxStock: 200,
      price: 348.0,
      status: 'low_stock',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&h=100',
      description: 'Industry-leading noise cancellation technology with exceptional sound quality. Smart features including speak-to-chat, quick attention mode, and adaptive sound control for a premium audio experience.',
    },
    {
      id: '3',
      name: 'Fujifilm X-T30',
      category: 'Photography',
      sku: 'FJ-XT30-II',
      stock: 85,
      maxStock: 100,
      price: 899.0,
      status: 'draft',
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=100&h=100',
      description: 'Professional-grade mirrorless camera with 26.1MP APS-C sensor. Advanced autofocus system, 4K video recording, and classic design that combines cutting-edge technology with retro aesthetics.',
    },
    {
      id: '4',
      name: 'Analog Watch',
      category: 'Accessories',
      sku: 'AW-SERIES-5',
      stock: 0,
      maxStock: 50,
      price: 210.0,
      status: 'out_of_stock',
      image: 'https://images.unsplash.com/photo-1593998066526-65fcab3021a2?auto=format&fit=crop&w=100&h=100',
      description: 'Timeless elegance meets modern craftsmanship. Premium stainless steel case with scratch-resistant sapphire crystal and genuine leather strap. Water-resistant up to 50 meters.',
    },
    {
      id: '5',
      name: 'Premium Kit',
      category: 'Bundles',
      sku: 'BUN-2023-EX',
      stock: 14,
      maxStock: 20,
      price: 1299.0,
      status: 'active',
      description: 'Complete professional bundle including top-tier equipment and accessories. Perfect for enthusiasts and professionals looking for an all-in-one solution. Save over 20% compared to individual purchases.',
    },
  ];

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
        border: 'border-emerald-100',
        dot: 'bg-emerald-500',
      },
      low_stock: {
        label: 'Low Stock',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-100',
        dot: 'bg-amber-500',
        animate: true,
      },
      out_of_stock: {
        label: 'Out of Stock',
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-100',
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

  return (
    <div className="flex-1 overflow-hidden flex flex-col p-6" style={{ scrollbarGutter: 'stable' }}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/50 border border-white/60 rounded-[20px] p-5 flex flex-col justify-between h-32 shadow-sm relative overflow-hidden group hover:shadow-md transition-all backdrop-blur-md">
          <div className="flex items-center justify-between z-10">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Products</span>
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Icon icon="solar:box-linear" width="18" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight font-display">1,248</h3>
            <p className="text-xs font-medium text-emerald-600 mt-1 flex items-center gap-1">
              <Icon icon="solar:course-up-linear" width="12" />
              +12% this month
            </p>
          </div>
        </div>

        <div className="bg-white/50 border border-white/60 rounded-[20px] p-5 flex flex-col justify-between h-32 shadow-sm hover:shadow-md transition-all backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Inventory Value</span>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <Icon icon="solar:wallet-money-linear" width="18" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight font-display">$84.2k</h3>
            <p className="text-xs font-medium text-slate-500 mt-1">Total on-stock items: 9,102</p>
          </div>
        </div>

        <div className="bg-white/50 border border-white/60 rounded-[20px] p-5 flex flex-col justify-between h-32 shadow-sm hover:shadow-md transition-all backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Low Stock</span>
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <Icon icon="solar:danger-circle-linear" width="18" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight font-display">12</h3>
            <p className="text-xs font-medium text-amber-600 mt-1">Items need restock</p>
          </div>
        </div>

        <div className="bg-white/50 border border-white/60 rounded-[20px] p-5 flex flex-col justify-between h-32 shadow-sm hover:shadow-md transition-all backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Categories</span>
            <div className="p-1.5 bg-sky-50 text-sky-600 rounded-lg">
              <Icon icon="solar:tag-linear" width="18" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight font-display">24</h3>
            <p className="text-xs font-medium text-slate-500 mt-1">Active categories</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="group w-full sm:w-auto max-w-2xl relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon
                icon="solar:magnifer-linear"
                width="16"
                className="text-slate-400 group-focus-within:text-indigo-500 transition-colors"
              />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-white text-slate-600 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 sm:text-sm shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
              placeholder="Search products..."
            />
          </div>

          <ScopeFilter
            value={scopeFilter}
            onChange={(scope) => {
              setScopeFilter(scope);
              setHasManuallyChanged(true);
            }}
            defaultScope="team"
            customLabels={{
              all: 'All Products',
              team: 'Team Products',
              personal: 'Custom Products',
            }}
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Dropdown
            value={categoryFilter}
            options={[
              { value: 'All Categories', label: 'All Categories' },
              { value: 'Electronics', label: 'Electronics' },
              { value: 'Footwear', label: 'Footwear' },
              { value: 'Accessories', label: 'Accessories' },
            ]}
            onChange={(val) => setCategoryFilter(val as string)}
            icon="solar:tag-linear"
            className="flex-1 sm:flex-none"
            buttonClassName="w-full"
            menuClassName="w-full"
            menuAlign="left"
          />

          <Dropdown
            value={statusFilter}
            options={[
              { value: 'Any Status', label: 'Any Status' },
              { value: 'In Stock', label: 'In Stock' },
              { value: 'Low Stock', label: 'Low Stock' },
              { value: 'Out of Stock', label: 'Out of Stock' },
            ]}
            onChange={(val) => setStatusFilter(val as string)}
            icon="solar:chart-2-linear"
            className="flex-1 sm:flex-none"
            buttonClassName="w-full"
            menuClassName="w-full"
            menuAlign="right"
          />

          <button
            onClick={() => onOpenAddProduct?.()}
            className="flex items-center gap-2 bg-gradient-to-b from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 border-t border-white/20 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Icon icon="solar:add-circle-linear" width="18" className="text-indigo-100" />
            <span className="text-sm font-semibold tracking-wide">Add Product</span>
          </button>
        </div>
      </div>

      <div className="flex-1 shadow-slate-200/20 overflow-hidden flex flex-col bg-white/50 border-white/60 border rounded-[24px] relative shadow-xl">
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/50">
              <tr className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th scope="col" className="pl-6 pr-3 py-4 w-12">
                  <label className="custom-checkbox flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only" />
                    <div className="w-4 h-4 border border-slate-300 rounded-md bg-white flex items-center justify-center transition-all hover:border-indigo-400">
                      <svg
                        className="w-2.5 h-2.5 text-white hidden pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </label>
                </th>
                <th scope="col" className="px-6 py-4">
                  Product Name
                </th>
                <th scope="col" className="hidden md:table-cell px-6 py-4">
                  SKU
                </th>
                <th scope="col" className="px-6 py-4">
                  Stock Level
                </th>
                <th scope="col" className="px-6 py-4">
                  Unit Price
                </th>
                <th scope="col" className="px-6 py-4">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 w-16">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {products.map((product) => {
                const stockPercentage = getStockPercentage(product.stock, product.maxStock);
                const statusConfig = getStatusConfig(product.status);

                return (
                  <tr key={product.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="pl-6 pr-3 py-4 whitespace-nowrap">
                      <label className="custom-checkbox flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only" />
                        <div className="w-4 h-4 border border-slate-300 rounded-md bg-white flex items-center justify-center transition-all group-hover:border-indigo-400">
                          <svg
                            className="w-2.5 h-2.5 text-white hidden pointer-events-none"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </label>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-white border border-slate-200 p-0.5 shrink-0 shadow-sm group-hover:shadow-md transition-all">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover rounded-md"
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-50 rounded-md flex items-center justify-center text-slate-300">
                              <Icon icon="solar:gallery-linear" width="20" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {product.name}
                          </div>
                          <div className="text-[11px] text-slate-400">{product.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                        {product.sku}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full max-w-[120px]">
                        <div className="flex justify-between text-[10px] font-semibold mb-1">
                          <span
                            className={
                              stockPercentage < 10 && stockPercentage > 0 ? 'text-rose-600' : 'text-slate-700'
                            }
                          >
                            {product.stock}
                          </span>
                          <span className="text-slate-400">/ {product.maxStock}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${getStockColor(stockPercentage)}`}
                            style={{ width: `${stockPercentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-700 font-display">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="relative" ref={openDropdown === product.id ? dropdownRef : null}>
                        <button
                          onClick={() => setOpenDropdown(openDropdown === product.id ? null : product.id)}
                          className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white hover:ring-1 hover:ring-slate-200 hover:shadow-sm transition-all focus:outline-none"
                        >
                          <Icon icon="solar:menu-dots-bold" width="16" />
                        </button>

                        {openDropdown === product.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-slate-200/60 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200 ring-1 ring-black/5">
                            <button
                              onClick={() => {
                                onViewProduct?.(product);
                                setOpenDropdown(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-indigo-50/80 hover:text-indigo-700 flex items-center gap-2.5 transition-all duration-200 group"
                            >
                              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-indigo-100 group-hover:scale-105 transition-all duration-200">
                                <Icon icon="solar:eye-linear" width="15" className="text-slate-600 group-hover:text-indigo-600" />
                              </div>
                              <span>View Product</span>
                            </button>
                            <button
                              onClick={() => {
                                setOpenDropdown(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50/80 hover:text-slate-900 flex items-center gap-2.5 transition-all duration-200 group"
                            >
                              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 group-hover:scale-105 transition-all duration-200">
                                <Icon icon="solar:pen-linear" width="15" className="text-slate-600 group-hover:text-slate-700" />
                              </div>
                              <span>Edit Product</span>
                            </button>
                            <div className="border-t border-slate-100 my-1.5 mx-2" />
                            <button
                              onClick={() => {
                                onDeleteProduct?.(product);
                                setOpenDropdown(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50/80 hover:text-rose-700 flex items-center gap-2.5 transition-all duration-200 group"
                            >
                              <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center group-hover:bg-rose-100 group-hover:scale-105 transition-all duration-200">
                                <Icon icon="solar:trash-bin-trash-linear" width="15" className="text-rose-500 group-hover:text-rose-600" />
                              </div>
                              <span>Delete Product</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex bg-white/80 backdrop-blur-sm border-slate-100 border-t py-4 px-6 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Showing</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
              1-5
            </span>
            <span className="text-xs text-slate-500 font-medium">of</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
              1,248
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 hover:border-slate-300 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-slate-200"
              disabled
            >
              <Icon icon="solar:alt-arrow-left-linear" width="16" />
            </button>
            <button className="px-3 h-8 bg-slate-900 border border-slate-900 rounded-lg text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition-colors">
              1
            </button>
            <button className="px-3 h-8 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all">
              2
            </button>
            <span className="text-slate-300 text-xs px-1">...</span>
            <button className="px-3 h-8 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all">
              250
            </button>
            <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all">
              <Icon icon="solar:alt-arrow-right-linear" width="16" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
