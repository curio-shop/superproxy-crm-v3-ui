import { Icon } from '@iconify/react';
import { useEffect } from 'react';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  deleteConfirmText: string;
  onDeleteConfirmTextChange: (text: string) => void;
  isDeleting: boolean;
}

export default function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
  deleteConfirmText,
  onDeleteConfirmTextChange,
  isDeleting,
}: DeleteAccountModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isDeleting) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-account-modal-title"
      aria-describedby="delete-account-modal-description"
    >
      <div
        className="fixed inset-0"
        onClick={!isDeleting ? onClose : undefined}
      />

      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-white/50 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mb-5 ring-8 ring-rose-50">
            <Icon icon="solar:danger-triangle-bold" width="32" className="text-rose-600" />
          </div>

          <h3
            id="delete-account-modal-title"
            className="text-xl font-bold text-slate-900 mb-2"
          >
            Delete Account
          </h3>

          <p
            id="delete-account-modal-description"
            className="text-sm text-slate-600 mb-1"
          >
            This action is permanent and cannot be undone
          </p>

          <div className="w-full bg-rose-50 border border-rose-200 rounded-xl p-4 my-5">
            <ul className="text-left text-sm text-slate-700 space-y-2">
              <li className="flex items-start gap-2">
                <Icon icon="solar:close-circle-bold" width="18" className="text-rose-500 flex-shrink-0 mt-0.5" />
                <span>All your personal data will be permanently deleted</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon icon="solar:close-circle-bold" width="18" className="text-rose-500 flex-shrink-0 mt-0.5" />
                <span>You will lose access to all workspaces and documents</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon icon="solar:close-circle-bold" width="18" className="text-rose-500 flex-shrink-0 mt-0.5" />
                <span>This action cannot be reversed or undone</span>
              </li>
            </ul>
          </div>

          <div className="w-full mb-6">
            <label className="block text-sm font-semibold text-slate-900 mb-2 text-left">
              Type <span className="font-mono text-rose-600">DELETE</span> to confirm
            </label>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => onDeleteConfirmTextChange(e.target.value)}
              placeholder="Type DELETE"
              disabled={isDeleting}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex items-center gap-3 w-full">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-5 py-3 rounded-xl font-semibold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={isDeleting || deleteConfirmText !== 'DELETE'}
              className="flex-1 px-5 py-3 rounded-xl font-semibold text-sm text-white bg-rose-600 hover:bg-rose-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Icon icon="solar:trash-bin-minimalistic-bold" width="16" />
                  <span>Yes, delete account</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
