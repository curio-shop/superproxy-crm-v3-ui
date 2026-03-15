import { Icon } from '@iconify/react';
import { useState } from 'react';
import Dropdown from './Dropdown';

interface AddContactDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddContactDrawer({ isOpen, onClose }: AddContactDrawerProps) {
  const [company, setCompany] = useState('');
  const [lifecycleStage, setLifecycleStage] = useState('Lead');

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
        className="relative w-full max-w-[480px] h-full bg-white/80 backdrop-blur-2xl shadow-2xl flex flex-col transform transition-all duration-500 ease-out border-l border-white/60 rounded-l-[32px] ml-auto overflow-hidden"
        style={{
          animation: 'slideInRight 500ms cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div className="px-8 py-6 border-b border-slate-100/50 bg-white/40 backdrop-blur-md z-10 flex items-center justify-between sticky top-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
              <Icon icon="solar:user-plus-linear" width="20" />
            </div>
            <div>
              <h2 className="text-lg text-slate-900 tracking-tight font-display font-semibold">
                Add Contact
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                New entry for your database
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
                <Icon icon="solar:user-id-linear" width="14" />
                Personal Details
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-xl border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
                      placeholder="e.g. Let"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-xl border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
                      placeholder="e.g. Cruz"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Icon icon="solar:letter-linear" width="16" />
                    </div>
                    <input
                      type="email"
                      className="block w-full rounded-xl border-slate-200 bg-white/80 pl-10 pr-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
                      placeholder="vcc.letcruz@myyahoo.com"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    Phone Number
                  </label>
                  <div className="flex rounded-xl shadow-sm border border-slate-200 bg-white/80 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
                    <div className="relative flex items-center border-r border-slate-200 px-3">
                      <span className="text-xs font-medium text-slate-500">
                        +63
                      </span>
                      <Icon icon="solar:alt-arrow-down-linear" className="ml-1 text-slate-300" width="10" />
                    </div>
                    <input
                      type="tel"
                      className="block w-full border-0 bg-transparent py-2 pl-3 text-slate-700 placeholder:text-slate-400 focus:ring-0 sm:text-sm"
                      placeholder="906 463 6955"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/50 rounded-2xl p-5 border border-white/60 shadow-sm ring-1 ring-slate-100/50">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Icon icon="solar:case-linear" width="14" />
                Organization
              </h4>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    Job Title
                  </label>
                  <input
                    type="text"
                    className="block w-full rounded-xl border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
                    placeholder="e.g. Sales Manager"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    Company
                  </label>
                  <Dropdown
                    value={company}
                    options={[
                      'Superproxy Inc.',
                      'Acme Corp.',
                      'Global Industries',
                    ]}
                    onChange={(val) => setCompany(val as string)}
                    placeholder="Select company..."
                    searchable
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
                <Icon icon="solar:tuning-square-2-linear" width="14" />
                Status &amp; Ownership
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80"
                      className="h-8 w-8 rounded-full ring-2 ring-white object-cover"
                      alt="Owner"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        Melwyn Arrubio
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium">
                        Contact Owner
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100 transition-colors"
                  >
                    Change
                  </button>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    Lifecycle Stage
                  </label>
                  <Dropdown
                    value={lifecycleStage}
                    options={[
                      'Lead',
                      'Marketing Qualified Lead',
                      'Sales Qualified Lead',
                      'Customer',
                    ]}
                    onChange={(val) => setLifecycleStage(val as string)}
                    className="w-full"
                    buttonClassName="w-full"
                    menuClassName="w-full"
                    menuAlign="left"
                  />
                </div>
              </div>
            </div>

            <div className="h-12"></div>
          </form>
        </div>

        <div className="px-8 py-5 border-t border-slate-100/50 bg-white/80 backdrop-blur-xl flex items-center gap-3 absolute bottom-0 w-full z-20">
          <button className="flex-1 rounded-xl bg-gradient-to-b from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 border-t border-white/20 text-white px-4 py-2.5 text-sm font-semibold tracking-wide shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
            <Icon icon="solar:check-circle-linear" width="18" />
            Create Contact
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
