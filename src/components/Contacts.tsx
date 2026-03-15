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

  const avatarColors = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-100' },
    pink: { bg: 'bg-pink-50', text: 'text-pink-600', ring: 'ring-pink-100' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-100' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-100' },
    slate: { bg: 'bg-slate-100', text: 'text-slate-600', ring: 'ring-slate-200' },
  };

  const ownerColors = {
    slate: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    indigo: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  };

  const contacts: ContactDetail[] = [
    {
      id: '1',
      name: 'Let Cruz',
      initials: 'LC',
      company: 'VCC Construction',
      title: 'CEO',
      email: 'vcc.letcruz@myyahoo.com',
      phone: '+639064636955',
      owner: { name: 'Ivan Gonzales', initials: 'IG', color: 'slate' },
      avatarColor: 'blue',
    },
    {
      id: '2',
      name: 'Hailey Collins',
      initials: 'HC',
      company: 'Notion',
      title: 'Client',
      email: 'hailey@riggedparts.com',
      phone: '+17135558235',
      owner: { name: 'Pete Salvador', initials: 'PS', color: 'emerald' },
      avatarColor: 'pink',
    },
    {
      id: '3',
      name: 'Wang Wen',
      initials: 'WW',
      company: 'SpaceX',
      title: 'Client',
      email: 'melwyn.arrubio@yahoo.com',
      phone: '+639175328910',
      owner: { name: 'Jayzel Tacan', initials: 'JT', color: 'indigo' },
      avatarColor: 'amber',
    },
    {
      id: '4',
      name: 'Khim Tanglao',
      initials: 'KT',
      company: 'Metriccon Corp',
      title: 'Purchasing Manager',
      email: 'metriccon.purchasing@gmail.com',
      phone: '+639088938387',
      owner: { name: 'John Wee', initials: 'JW', color: 'purple' },
      avatarColor: 'slate',
    },
    {
      id: '5',
      name: 'Mac Mill',
      initials: 'MM',
      company: 'Apple',
      title: 'Purchaser',
      email: 'mac@m.gom',
      owner: {
        name: 'Melwyn Arrubio',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
        color: 'slate',
      },
      avatarColor: 'emerald',
    },
    {
      id: '6',
      name: 'Micaela Pena',
      initials: 'MP',
      company: 'BuildRight Inc',
      title: 'Project Manager',
      email: 'micaela.pena@gmail.com',
      phone: '+639171337142',
      owner: { name: 'Ivan Gonzales', initials: 'IG', color: 'slate' },
      avatarColor: 'slate',
    },
    {
      id: '7',
      name: 'Gillian Guiang',
      initials: 'GG',
      company: 'Design Studio',
      title: 'Interior Designer',
      email: 'gillian@designstudio.com',
      phone: '+639178102367',
      owner: { name: 'Jayzel Tacan', initials: 'JT', color: 'indigo' },
      avatarColor: 'slate',
    },
  ];

  return (
    <div className="flex-1 overflow-hidden flex flex-col p-6" style={{ scrollbarGutter: 'stable' }}>
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
              placeholder="Search contacts..."
            />
          </div>

          <ScopeFilter
            value={scopeFilter}
            onChange={(scope) => {
              setScopeFilter(scope);
              setHasManuallyChanged(true);
            }}
            defaultScope="personal"
            availableScopes={['personal', 'team']}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenAddContact?.()}
            className="flex items-center gap-2 bg-gradient-to-b from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 border-t border-white/20 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Icon icon="solar:add-circle-linear" width="18" className="text-indigo-100" />
            <span className="text-sm font-semibold tracking-wide">Add Contact</span>
          </button>
        </div>
      </div>

      <div className="flex-1 shadow-slate-200/20 overflow-hidden flex flex-col bg-white/50 border-white/60 border rounded-[24px] relative shadow-xl">
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/80">
              <tr className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th scope="col" className="pl-6 pr-3 py-4 w-12">
                  <label className="custom-checkbox flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only" />
                    <div className="w-4 h-4 border-2 border-slate-300 rounded-md bg-white flex items-center justify-center transition-all hover:border-slate-400 hover:bg-slate-50">
                      <svg
                        className="w-2.5 h-2.5 text-white hidden pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </label>
                </th>
                <th scope="col" className="px-6 py-4">
                  Name
                </th>
                <th scope="col" className="px-6 py-4">
                  Company
                </th>
                <th scope="col" className="px-6 py-4">
                  Title
                </th>
                <th scope="col" className="px-6 py-4">
                  Email
                </th>
                <th scope="col" className="px-6 py-4">
                  Phone No.
                </th>
                <th scope="col" className="px-6 py-4 w-48">
                  Owner
                </th>
                <th scope="col" className="px-6 py-4 w-16">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {contacts.map((contact) => {
                const avatarStyle = avatarColors[contact.avatarColor as keyof typeof avatarColors];
                const ownerStyle = ownerColors[contact.owner.color as keyof typeof ownerColors];

                return (
                  <tr key={contact.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="pl-6 pr-3 py-4 whitespace-nowrap">
                      <label className="custom-checkbox flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only" />
                        <div className="w-4 h-4 border border-slate-300 rounded-md bg-white flex items-center justify-center transition-all group-hover:border-slate-400">
                          <svg
                            className="w-2.5 h-2.5 text-white hidden pointer-events-none"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </label>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div
                            className={`h-9 w-9 rounded-full ${avatarStyle.bg} ${avatarStyle.text} flex items-center justify-center text-xs font-semibold ring-2 ${avatarStyle.ring} shadow-sm group-hover:shadow-md transition-shadow`}
                          >
                            {contact.initials}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="text-sm font-semibold text-slate-900">{contact.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {contact.company ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 group-hover:border-slate-300 transition-colors">
                          <Icon icon="solar:buildings-2-linear" width="14" className="text-slate-500" />
                          <span className="text-xs font-semibold text-slate-700">{contact.company}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-300">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {contact.title ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                          {contact.title}
                        </span>
                      ) : (
                        <span className="text-sm text-slate-300">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {contact.email ? (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Icon icon="solar:letter-linear" width="14" className="text-slate-400" />
                          <span>{truncateEmail(contact.email)}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-300">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {contact.phone ? (
                        <div className="flex items-center gap-2 text-slate-600">
                          <Icon icon="solar:phone-calling-linear" width="14" className="text-slate-400" />
                          <span className="font-mono text-[11px]">{contact.phone}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-300">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {contact.owner.avatar ? (
                          <img
                            src={contact.owner.avatar}
                            alt=""
                            className="h-6 w-6 rounded-full object-cover ring-2 ring-white shadow-sm"
                          />
                        ) : (
                          <div
                            className={`h-6 w-6 rounded-full ${ownerStyle.bg} border ${ownerStyle.border} flex items-center justify-center text-[9px] font-bold ${ownerStyle.text}`}
                          >
                            {contact.owner.initials}
                          </div>
                        )}
                        <span className="text-xs font-medium text-slate-600">{contact.owner.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="relative" ref={openMenuId === contact.id ? menuRef : null}>
                        <button
                          onClick={() => toggleMenu(contact.id)}
                          className={`flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 hover:ring-1 hover:ring-slate-200 transition-all focus:outline-none ${
                            openMenuId === contact.id ? 'bg-slate-100 text-slate-700 ring-1 ring-slate-200' : ''
                          }`}
                        >
                          <Icon icon="solar:menu-dots-bold" width="16" />
                        </button>

                        {openMenuId === contact.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-slate-200/60 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200 ring-1 ring-black/5">
                            <button
                              onClick={() => handleAction('View Contact', contact)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm text-slate-700 hover:bg-blue-50/80 hover:text-blue-700 transition-all duration-200 group"
                            >
                              <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600 group-hover:scale-105 transition-all duration-200">
                                <Icon icon="solar:eye-linear" width="15" />
                              </div>
                              <span className="font-semibold">View Contact</span>
                            </button>

                            <button
                              onClick={() => handleAction('Edit Contact', contact)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm text-slate-700 hover:bg-sky-50/80 hover:text-sky-700 transition-all duration-200 group"
                            >
                              <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-sky-100 group-hover:text-sky-600 group-hover:scale-105 transition-all duration-200">
                                <Icon icon="solar:pen-linear" width="15" />
                              </div>
                              <span className="font-semibold">Edit Contact</span>
                            </button>

                            <div className="my-1.5 border-t border-slate-100 mx-2" />

                            <button
                              onClick={() => handleAction('Send Email', contact)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50/80 hover:text-slate-900 transition-all duration-200 group"
                            >
                              <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-slate-200 group-hover:scale-105 transition-all duration-200">
                                <Icon icon="solar:letter-linear" width="15" />
                              </div>
                              <span className="font-medium">Send Email</span>
                            </button>

                            <button
                              onClick={() => handleAction('AI Cold Call', contact)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50/80 hover:text-slate-900 transition-all duration-200 group"
                            >
                              <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-slate-200 group-hover:scale-105 transition-all duration-200">
                                <Icon icon="solar:phone-calling-linear" width="15" />
                              </div>
                              <span className="font-medium">AI Cold Call</span>
                            </button>

                            <div className="my-1.5 border-t border-slate-100 mx-2" />

                            <button
                              onClick={() => handleAction('Delete Contact', contact)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50/80 hover:text-rose-700 transition-all duration-200 group"
                            >
                              <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-rose-50 text-rose-500 group-hover:bg-rose-100 group-hover:scale-105 transition-all duration-200">
                                <Icon icon="solar:trash-bin-minimalistic-linear" width="15" />
                              </div>
                              <span className="font-semibold">Delete Contact</span>
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
              1-7
            </span>
            <span className="text-xs text-slate-500 font-medium">of</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
              97
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
              12
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
