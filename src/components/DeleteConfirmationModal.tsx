import { useEffect } from 'react';
import { Icon } from '@iconify/react';

type EntityType = 'contact' | 'company' | 'product' | 'quotation' | 'invoice' | 'presentation';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  entityType: EntityType;
  entityName?: string;
  isDeleting?: boolean;
}

const entityConfig = {
  contact: {
    title: 'Delete Contact',
    message: 'Are you sure you want to remove this contact?',
    detail: (name: string) => `This will permanently delete ${name} from your contacts.`,
    icon: 'solar:user-cross-linear',
  },
  company: {
    title: 'Delete Company',
    message: 'Are you sure you want to remove this company?',
    detail: (name: string) => `This will permanently delete ${name} and all associated data.`,
    icon: 'solar:buildings-2-linear',
  },
  product: {
    title: 'Delete Product',
    message: 'Are you sure you want to remove this product?',
    detail: (name: string) => `This will permanently delete ${name} from your inventory.`,
    icon: 'solar:box-linear',
  },
  quotation: {
    title: 'Delete Quote',
    message: 'Are you sure you want to delete this quote?',
    detail: (name: string) => `Quote ${name} will be permanently removed.`,
    icon: 'solar:document-text-linear',
  },
  invoice: {
    title: 'Delete Invoice',
    message: 'Are you sure you want to delete this invoice?',
    detail: (name: string) => `Invoice ${name} will be permanently removed.`,
    icon: 'solar:bill-list-linear',
  },
  presentation: {
    title: 'Delete Presentation',
    message: 'Are you sure you want to delete this presentation?',
    detail: (name: string) => `${name} will be permanently deleted.`,
    icon: 'solar:videocamera-record-linear',
  },
};

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  entityType,
  entityName,
  isDeleting = false,
}: DeleteConfirmationModalProps) {
  const config = entityConfig[entityType];

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
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
    >
      <div
        className="fixed inset-0"
        onClick={!isDeleting ? onClose : undefined}
      />

      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl border border-white/50 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center mb-4 ring-4 ring-rose-50">
            <Icon icon={config.icon} width="28" className="text-rose-500" />
          </div>

          <h3
            id="delete-modal-title"
            className="text-lg font-bold text-slate-900 mb-2"
          >
            {config.title}
          </h3>

          <p
            id="delete-modal-description"
            className="text-sm text-slate-600 mb-1"
          >
            {config.message}
          </p>

          {entityName && (
            <p className="text-sm text-slate-500 mb-6">
              {config.detail(entityName)}
            </p>
          )}

          {!entityName && <div className="mb-6" />}

          <div className="flex items-center gap-3 w-full">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-rose-500 hover:bg-rose-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Icon icon="solar:loading-linear" width="16" className="animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Icon icon="solar:trash-bin-minimalistic-linear" width="16" />
                  <span>Delete</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
