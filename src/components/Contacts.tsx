import { Icon } from '@iconify/react';
import { useState, useRef, useEffect } from 'react';
import ScopeFilter, { ScopeType } from './ScopeFilter';

export interface ContactDetail {
  id: string;
  name: string;
  initials: string;
  company?: string;
  title?: string;
  email?: string;
  phone?: string;
  owner: {
    name: string;
    initials?: string;
    avatar?: string;
    color: string;
  };
  avatarColor: string;
}

interface ContactsProps {
  isTeamView: boolean;
  homeFilterPreference: 'team' | 'personal';
  onColdCallClick: (contact: { id: string; name: string; title?: string; company_name?: string }) => void;
  onViewHistory?: () => void;
  onSendEmail?: (contact: ContactDetail) => void;
  onViewContact?: (contact: ContactDetail) => void;
  onOpenAddContact?: () => void;
  onDeleteContact?: (contact: ContactDetail) => void;
}

export default function Contacts({ isTeamView, homeFilterPreference, onColdCallClick, onViewHistory, onSendEmail, onViewContact, onOpenAddContact, onDeleteContact }: ContactsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [scopeFilter, setScopeFilter] = useState<ScopeType>(homeFilterPreference);
  const [hasManuallyChanged, setHasManuallyChanged] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const truncateEmail = (email: string, maxLength: number = 20): string => {
    if (email.length <= maxLength) return email;
    const [localPart, domain] = email.split('@');
    if (!domain) return email;
    const truncatedLocal = localPart.slice(0, Math.max(3, maxLength - domain.length - 4));
    return `${truncatedLocal}...`;
  };

  useEffect(() => {
    if (!hasManuallyChanged) {
      setScopeFilter(homeFilterPreference);
    }
  }, [homeFilterPreference, hasManuallyChanged]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (contactId: string) => {
    setOpenMenuId(openMenuId === contactId ? null : contactId);
  };

  const handleAction = (action: string, contact: Contact) => {
    if (action === 'AI Cold Call') {
      onColdCallClick({
        id: contact.id,
        name: contact.name,
        title: contact.title,
        company_name: contact.company
      });
    } else if (action === 'Send Email') {
      onSendEmail?.(contact);
    } else if (action === 'View Contact') {
      onViewContact?.(contact);
    } else if (action === 'Delete Contact') {
      onDeleteContact?.(contact);
    }
    setOpenMenuId(null);
  };

  const contacts: ContactDetail[] = [
    {
      id: '1', name: 'Let Cruz', initials: 'LC', company: 'VCC Construction', title: 'CEO',
      email: 'vcc.letcruz@myyahoo.com', phone: '+639064636955',
      owner: { name: 'Ivan Gonzales', initials: 'IG', color: 'slate' }, avatarColor: 'slate',
    },
    {
      id: '2', name: 'Hailey Collins', initials: 'HC', company: 'Notion', title: 'Head of Partnerships',
      email: 'hailey.collins@notion.so', phone: '+17135558235',
      owner: { name: 'Pete Salvador', initials: 'PS', color: 'slate' }, avatarColor: 'slate',
    },
    {
      id: '3', name: 'Wang Wen', initials: 'WW', company: 'SpaceX', title: 'Procurement Lead',
      email: 'wang.wen@spacex.com', phone: '+639175328910',
      owner: { name: 'Jayzel Tacan', initials: 'JT', color: 'slate' }, avatarColor: 'slate',
    },
    {
      id: '4', name: 'Khim Tanglao', initials: 'KT', company: 'Metriccon Corp', title: 'Purchasing Manager',
      email: 'khim.tanglao@metriccon.com', phone: '+639088938387',
      owner: { name: 'John Wee', initials: 'JW', color: 'slate' }, avatarColor: 'slate',
    },
    {
      id: '5', name: 'Mac Mill', initials: 'MM', company: 'Apple', title: 'Senior Buyer',
      email: 'mac.mill@apple.com', phone: '+14085551234',
      owner: { name: 'Melwyn Arrubio', initials: 'MA', color: 'slate' }, avatarColor: 'slate',
    },
    {
      id: '6', name: 'Micaela Pena', initials: 'MP', company: 'BuildRight Inc', title: 'Project Manager',
      email: 'micaela.pena@buildright.com', phone: '+639171337142',
      owner: { name: 'Ivan Gonzales', initials: 'IG', color: 'slate' }, avatarColor: 'slate',
    },
    {
      id: '7', name: 'Gillian Guiang', initials: 'GG', company: 'Design Studio', title: 'Interior Designer',
      email: 'gillian@designstudio.com', phone: '+639178102367',
      owner: { name: 'Jayzel Tacan', initials: 'JT', color: 'slate' }, avatarColor: 'slate',
    },
    {
      id: '8', name: 'Sarah Chen', initials: 'SC', company: 'Apex Technologies', title: 'VP of Engineering',
      email: 'sarah.chen@apextech.io', phone: '+6591234567',
      owner: { name: 'Pete Salvador', initials: 'PS', color: 'slate' }, avatarColor: 'slate',
    },
    {
      id: '9', name: 'Marcus Johnson', initials: 'MJ', company: 'Nova Retail Group', title: 'Operations Director',
      email: 'marcus@novaretail.com', phone: '+17025559876',
      owner: { name: 'Ivan Gonzales', initials: 'IG', color: 'slate' }, avatarColor: 'slate',
    },
    {
      id: '10', name: 'Elena Rodriguez', initials: 'ER', company: 'SkyLink Partners', title: 'Managing Partner',
      email: 'elena.r@skylinkpartners.com', phone: '+34612345678',
      owner: { name: 'John Wee', initials: 'JW', color: 'slate' }, avatarColor: 'slate',
    },
    {
      id: '11', name: 'James Whitfield', initials: 'JW', company: 'Crestwood Holdings', title: 'CFO',
      email: 'j.whitfield@crestwood.co', phone: '+442071234567',
      owner: { name: 'Jayzel Tacan', initials: 'JT', color: 'slate' }, avatarColor: 'slate',
    },
    {
      id: '12', name: 'Aiko Tanaka', initials: 'AT', company: 'Meridian Logistics', title: 'Supply Chain Manager',
      email: 'aiko.tanaka@meridian.jp', phone: '+81312345678',
      owner: { name: 'Pete Salvador', initials: 'PS', color: 'slate' }, avatarColor: 'slate',
    },
  ];

  return (
    <div className="flex-1 overflow-hidden flex flex-col p-6" style={{ scrollbarGutter: 'stable' }}>
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="group w-full sm:w-80 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon
                icon="solar:magnifer-linear"
                width="16"
                className="text-slate-400 group-focus-within:text-slate-500 transition-colors"
              />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-white text-slate-600 placeholder-slate-400 focus:outline-none focus:border-slate-400 sm:text-sm transition-colors hover:border-slate-300"
              placeholder="Search contacts..."
            />
          </div>

          <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
            <button
              onClick={() => { setScopeFilter('personal'); setHasManuallyChanged(true); }}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                scopeFilter === 'personal'
                  ? 'bg-white text-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Personal
            </button>
            <button
              onClick={() => { setScopeFilter('team'); setHasManuallyChanged(true); }}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                scopeFilter === 'team'
                  ? 'bg-white text-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Team
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenAddContact?.()}
            className="flex items-center gap-2 border border-slate-200 text-slate-600 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50 px-4 py-2 rounded-xl transition-all active:scale-[0.98]"
          >
            <Icon icon="solar:add-circle-linear" width="15" className="text-slate-400" />
            <span className="text-[13px] font-medium">Add Contact</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="min-w-full divide-y divide-slate-100">
            <thead>
              <tr className="text-left text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                <th scope="col" className="pl-5 pr-2 py-3">Name</th>
                <th scope="col" className="px-4 py-3">Company</th>
                <th scope="col" className="px-4 py-3">Title</th>
                <th scope="col" className="px-4 py-3">Email</th>
                <th scope="col" className="px-4 py-3">Phone</th>
                <th scope="col" className="px-4 py-3 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {contacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    onClick={() => onViewContact?.(contact)}
                  >
                    <td className="pl-5 pr-2 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-semibold flex-shrink-0">
                          {contact.initials}
                        </div>
                        <span className="text-[13px] font-medium text-slate-800">{contact.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {contact.company ? (
                        <span className="text-[13px] text-slate-500">{contact.company}</span>
                      ) : (
                        <span className="text-[13px] text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {contact.title ? (
                        <span className="text-[13px] text-slate-500">{contact.title}</span>
                      ) : (
                        <span className="text-[13px] text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      {contact.email ? (
                        <span className="text-[13px] text-slate-600 block truncate" title={contact.email}>{contact.email}</span>
                      ) : (
                        <span className="text-[13px] text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {contact.phone ? (
                        <span className="text-[13px] text-slate-500 font-mono">{contact.phone}</span>
                      ) : (
                        <span className="text-[13px] text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="relative" ref={openMenuId === contact.id ? menuRef : null}>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleMenu(contact.id); }}
                          className={`flex items-center justify-center w-7 h-7 rounded-lg border transition-colors ${
                            openMenuId === contact.id
                              ? 'bg-slate-100 border-slate-200 text-slate-600'
                              : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                          }`}
                        >
                          <Icon icon="solar:menu-dots-bold" width="14" />
                        </button>

                        {openMenuId === contact.id && (
                          <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-slate-200/60 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            <button onClick={(e) => { e.stopPropagation(); handleAction('View Contact', contact); }} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors">
                              <Icon icon="solar:eye-linear" width="14" className="text-slate-400" />
                              View
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleAction('Edit Contact', contact); }} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors">
                              <Icon icon="solar:pen-linear" width="14" className="text-slate-400" />
                              Edit
                            </button>
                            <div className="my-1 border-t border-slate-100 mx-2" />
                            <button onClick={(e) => { e.stopPropagation(); handleAction('Send Email', contact); }} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors">
                              <Icon icon="solar:letter-linear" width="14" className="text-slate-400" />
                              Send Email
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleAction('AI Cold Call', contact); }} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors">
                              <Icon icon="solar:phone-calling-linear" width="14" className="text-slate-400" />
                              AI Cold Call
                            </button>
                            <div className="my-1 border-t border-slate-100 mx-2" />
                            <button onClick={(e) => { e.stopPropagation(); handleAction('Delete Contact', contact); }} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors">
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

        <div className="flex border-t border-slate-100 py-3 px-4 items-center gap-3">
          <span className="text-[11px] text-slate-400">Showing 1–12 of 97</span>
          <div className="flex items-center gap-1.5">
            <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded-lg text-slate-300 transition-colors" disabled>
              <Icon icon="solar:alt-arrow-left-linear" width="14" />
            </button>
            <button className="px-2.5 h-7 bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-800">1</button>
            <button className="px-2.5 h-7 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-500 hover:bg-slate-50 transition-colors">2</button>
            <span className="text-slate-300 text-[11px] px-0.5">...</span>
            <button className="px-2.5 h-7 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-500 hover:bg-slate-50 transition-colors">12</button>
            <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
              <Icon icon="solar:alt-arrow-right-linear" width="14" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
