import { Icon } from '@iconify/react';
import { useState, useRef, useEffect } from 'react';
import ScopeFilter, { ScopeType } from './ScopeFilter';

export interface Company {
  id: string;
  name: string;
  initials: string;
  type?: string;
  industry?: string;
  phone?: string;
  website?: string;
  city?: string;
  owner: {
    name: string;
    initials?: string;
    avatar?: string;
    color: string;
  };
  avatarColor: string;
  lifecycleStage?: string;
}

interface CompaniesProps {
  isTeamView: boolean;
  homeFilterPreference: 'team' | 'personal';
  onViewCompany?: (company: Company) => void;
  onOpenAddCompany?: () => void;
  onDeleteCompany?: (company: Company) => void;
}

export default function Companies({ isTeamView, homeFilterPreference, onViewCompany, onOpenAddCompany, onDeleteCompany }: CompaniesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scopeFilter, setScopeFilter] = useState<ScopeType>(homeFilterPreference);
  const [hasManuallyChanged, setHasManuallyChanged] = useState(false);
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

  const companies: Company[] = [
    { id: '1', name: 'Superproxy Inc.', initials: 'SI', type: 'Client', industry: 'Technology', phone: '+639175328910', city: 'Manila', owner: { name: 'Melwyn Arrubio', initials: 'MA', color: 'slate' }, avatarColor: 'slate' },
    { id: '2', name: 'Notion', initials: 'NT', type: 'Partner', industry: 'Software', phone: '+17135558235', city: 'San Francisco', owner: { name: 'Pete Salvador', initials: 'PS', color: 'slate' }, avatarColor: 'slate' },
    { id: '3', name: 'SpaceX', initials: 'SX', type: 'Client', industry: 'Aerospace', phone: '+13105551234', city: 'Hawthorne', owner: { name: 'Jayzel Tacan', initials: 'JT', color: 'slate' }, avatarColor: 'slate' },
    { id: '4', name: 'Apple', initials: 'AP', type: 'Client', industry: 'Technology', city: 'Cupertino', owner: { name: 'Ivan Gonzales', initials: 'IG', color: 'slate' }, avatarColor: 'slate' },
    { id: '5', name: 'Acme Corp', initials: 'AC', type: 'Prospect', industry: 'Manufacturing', phone: '+12125559876', city: 'New York', owner: { name: 'John Wee', initials: 'JW', color: 'slate' }, avatarColor: 'slate' },
    { id: '6', name: 'Apex Technologies', initials: 'AT', type: 'Client', industry: 'Technology', phone: '+6591234567', city: 'Singapore', owner: { name: 'Pete Salvador', initials: 'PS', color: 'slate' }, avatarColor: 'slate' },
    { id: '7', name: 'Nova Retail Group', initials: 'NR', type: 'Client', industry: 'Retail', phone: '+17025559876', city: 'Las Vegas', owner: { name: 'Ivan Gonzales', initials: 'IG', color: 'slate' }, avatarColor: 'slate' },
    { id: '8', name: 'Meridian Logistics', initials: 'ML', type: 'Prospect', industry: 'Logistics', phone: '+81312345678', city: 'Tokyo', owner: { name: 'Jayzel Tacan', initials: 'JT', color: 'slate' }, avatarColor: 'slate' },
    { id: '9', name: 'SkyLink Partners', initials: 'SP', type: 'Partner', industry: 'Consulting', phone: '+34612345678', city: 'Madrid', owner: { name: 'John Wee', initials: 'JW', color: 'slate' }, avatarColor: 'slate' },
    { id: '10', name: 'Crestwood Holdings', initials: 'CH', type: 'Client', industry: 'Finance', phone: '+442071234567', city: 'London', owner: { name: 'Melwyn Arrubio', initials: 'MA', color: 'slate' }, avatarColor: 'slate' },
  ];

  const handleAction = (action: string, company: Company) => {
    if (action === 'View') onViewCompany?.(company);
    if (action === 'Delete') onDeleteCompany?.(company);
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
              placeholder="Search companies..."
            />
          </div>
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
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
        <button
          onClick={() => onOpenAddCompany?.()}
          className="flex items-center gap-2 border border-slate-200 text-slate-600 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50 px-4 py-2 rounded-xl transition-all active:scale-[0.98]"
        >
          <Icon icon="solar:add-circle-linear" width="15" className="text-slate-400" />
          <span className="text-[13px] font-medium">Add Company</span>
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="min-w-full divide-y divide-slate-100">
            <thead>
              <tr className="text-left text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                <th className="pl-5 pr-6 py-3 w-[22%]">Name</th>
                <th className="px-5 py-3 w-[16%]">Type</th>
                <th className="px-5 py-3 w-[20%]">Industry</th>
                <th className="px-5 py-3 w-[18%]">Location</th>
                <th className="px-5 py-3 w-[16%]">Phone</th>
                <th className="px-3 py-3 w-[8%]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {companies.map((company) => (
                <tr
                  key={company.id}
                  className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                  onClick={() => onViewCompany?.(company)}
                >
                  <td className="pl-5 pr-6 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-semibold flex-shrink-0">
                        {company.initials}
                      </div>
                      <span className="text-[13px] font-medium text-slate-800">{company.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    {company.type ? (
                      <span className="text-[13px] text-slate-500">{company.type}</span>
                    ) : (
                      <span className="text-[13px] text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    {company.industry ? (
                      <span className="text-[13px] text-slate-500">{company.industry}</span>
                    ) : (
                      <span className="text-[13px] text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    {company.city ? (
                      <span className="text-[13px] text-slate-500">{company.city}</span>
                    ) : (
                      <span className="text-[13px] text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    {company.phone ? (
                      <span className="text-[13px] text-slate-500 font-mono">{company.phone}</span>
                    ) : (
                      <span className="text-[13px] text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="relative" ref={openDropdown === company.id ? dropdownRef : null}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === company.id ? null : company.id); }}
                        className={`flex items-center justify-center w-7 h-7 rounded-lg border transition-colors ${
                          openDropdown === company.id
                            ? 'bg-slate-100 border-slate-200 text-slate-600'
                            : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <Icon icon="solar:menu-dots-bold" width="14" />
                      </button>
                      {openDropdown === company.id && (
                        <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-slate-200/60 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                          <button onClick={(e) => { e.stopPropagation(); handleAction('View', company); }} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors">
                            <Icon icon="solar:eye-linear" width="14" className="text-slate-400" />
                            View
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); setOpenDropdown(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors">
                            <Icon icon="solar:pen-linear" width="14" className="text-slate-400" />
                            Edit
                          </button>
                          <div className="my-1 border-t border-slate-100 mx-2" />
                          <button onClick={(e) => { e.stopPropagation(); handleAction('Delete', company); }} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors">
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
          <span className="text-[11px] text-slate-400">Showing 1–10 of 42</span>
          <div className="flex items-center gap-1.5">
            <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded-lg text-slate-300 transition-colors" disabled>
              <Icon icon="solar:alt-arrow-left-linear" width="14" />
            </button>
            <button className="px-2.5 h-7 bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-800">1</button>
            <button className="px-2.5 h-7 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-500 hover:bg-slate-50 transition-colors">2</button>
            <span className="text-slate-300 text-[11px] px-0.5">...</span>
            <button className="px-2.5 h-7 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-500 hover:bg-slate-50 transition-colors">5</button>
            <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
              <Icon icon="solar:alt-arrow-right-linear" width="14" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
