import { Icon } from '@iconify/react';
import { ContactDetail } from './Contacts';

interface ViewContactDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contact: ContactDetail | null;
}

export default function ViewContactDrawer({ isOpen, onClose, contact }: ViewContactDrawerProps) {
  if (!isOpen || !contact) return null;

  const avatarColors = {
    blue: { bg: 'bg-blue-400', text: 'text-white' },
    pink: { bg: 'bg-pink-400', text: 'text-white' },
    amber: { bg: 'bg-amber-400', text: 'text-white' },
    emerald: { bg: 'bg-emerald-400', text: 'text-white' },
    slate: { bg: 'bg-slate-400', text: 'text-white' },
  };

  const avatarStyle = avatarColors[contact.avatarColor as keyof typeof avatarColors] || avatarColors.slate;

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
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${avatarStyle.bg} ${avatarStyle.text} flex items-center justify-center text-lg font-bold shadow-lg ring-4 ring-white/50`}>
              {contact.initials}
            </div>
            <div>
              <h2 className="text-xl text-slate-900 tracking-tight font-display font-bold">
                {contact.name}
              </h2>
              {contact.title && (
                <p className="text-sm text-slate-600 font-medium mt-0.5">
                  {contact.title}
                </p>
              )}
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
          <div className="space-y-5">
            <div className="bg-white/50 rounded-2xl p-5 border border-white/60 shadow-sm ring-1 ring-slate-100/50">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Icon icon="solar:user-id-linear" width="14" />
                Contact Information
              </h4>
              <div className="space-y-4">
                {contact.email && (
                  <div className="flex items-start gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                    <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                      <Icon icon="solar:letter-linear" width="16" className="text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Email Address
                      </p>
                      <p className="text-sm font-medium text-slate-900 break-all">
                        {contact.email}
                      </p>
                    </div>
                  </div>
                )}

                {contact.phone && (
                  <div className="flex items-start gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                    <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                      <Icon icon="solar:phone-calling-linear" width="16" className="text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Phone Number
                      </p>
                      <p className="text-sm font-mono font-medium text-slate-900">
                        {contact.phone}
                      </p>
                    </div>
                  </div>
                )}

                {!contact.email && !contact.phone && (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                      <Icon icon="solar:info-circle-linear" width="24" className="text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-500">No contact information available</p>
                  </div>
                )}
              </div>
            </div>

            {contact.company && (
              <div className="bg-white/50 rounded-2xl p-5 border border-white/60 shadow-sm ring-1 ring-slate-100/50">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Icon icon="solar:case-linear" width="14" />
                  Organization
                </h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                    <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                      <Icon icon="solar:buildings-2-linear" width="16" className="text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Company
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {contact.company}
                      </p>
                    </div>
                  </div>

                  {contact.title && (
                    <div className="flex items-start gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                      <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                        <Icon icon="solar:user-id-linear" width="16" className="text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                          Job Title
                        </p>
                        <p className="text-sm font-medium text-slate-900">
                          {contact.title}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-white/50 rounded-2xl p-5 border border-white/60 shadow-sm ring-1 ring-slate-100/50">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Icon icon="solar:user-check-linear" width="14" />
                Ownership
              </h4>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl border border-slate-200/60 shadow-sm">
                {contact.owner.avatar ? (
                  <img
                    src={contact.owner.avatar}
                    alt={contact.owner.name}
                    className="h-10 w-10 rounded-full ring-2 ring-white object-cover shadow-sm"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-700">
                    {contact.owner.initials}
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {contact.owner.name}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    Contact Owner
                  </p>
                </div>
              </div>
            </div>

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
