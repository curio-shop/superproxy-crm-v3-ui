import { Icon } from '@iconify/react';
import { Z_INDEX } from '../lib/zIndex';

interface FloatingChatButtonProps {
  unreadCount: number;
  onClick: () => void;
  isOpen: boolean;
  isVisible: boolean;
}

export default function FloatingChatButton({ unreadCount, onClick, isOpen, isVisible }: FloatingChatButtonProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white rounded-full p-4 shadow-xl transition-all duration-300 hover:scale-110 ${isOpen ? '' : 'animate-in fade-in slide-in-from-bottom-4'}`}
      style={{ zIndex: Z_INDEX.floatingChatButton }}
      aria-label={isOpen ? "Close support chat" : "Open support chat"}
    >
      <Icon
        icon={isOpen ? "solar:close-circle-bold" : "solar:chat-round-dots-bold"}
        width="28"
        className="transition-transform duration-200"
      />
      {!isOpen && unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold rounded-full h-7 w-7 flex items-center justify-center shadow-lg border-2 border-white animate-in zoom-in">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}
