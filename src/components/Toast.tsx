import { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  title?: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, title, type = 'info', duration = 3000, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const toastRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startXRef = useRef(0);
  const isDraggingRef = useRef(false);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          iconBg: 'bg-emerald-500',
          icon: 'solar:check-circle-bold',
          iconColor: 'text-white',
        };
      case 'error':
        return {
          iconBg: 'bg-rose-500',
          icon: 'solar:close-circle-bold',
          iconColor: 'text-white',
        };
      case 'warning':
        return {
          iconBg: 'bg-amber-500',
          icon: 'solar:danger-triangle-bold',
          iconColor: 'text-white',
        };
      case 'info':
      default:
        return {
          iconBg: 'bg-sky-500',
          icon: 'solar:info-circle-bold',
          iconColor: 'text-white',
        };
    }
  };

  const styles = getToastStyles();

  const dismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  useEffect(() => {
    if (!isPaused && !isExiting) {
      timerRef.current = setTimeout(dismiss, duration);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPaused, isExiting, duration]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const diff = e.clientX - startXRef.current;
    if (diff > 0) {
      setDragX(diff);
      setOpacity(Math.max(0, 1 - diff / 250));
    }
  };

  const handleMouseUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    if (dragX > 100) {
      dismiss();
    } else {
      setDragX(0);
      setOpacity(1);
      if (!isPaused) {
        timerRef.current = setTimeout(dismiss, duration);
      }
    }
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const diff = e.clientX - startXRef.current;
      if (diff > 0) {
        setDragX(diff);
        setOpacity(Math.max(0, 1 - diff / 250));
      }
    };

    const handleGlobalMouseUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;

      if (dragX > 100) {
        dismiss();
      } else {
        setDragX(0);
        setOpacity(1);
        if (!isPaused) {
          timerRef.current = setTimeout(dismiss, duration);
        }
      }
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [dragX, isPaused, duration]);

  return (
    <div
      ref={toastRef}
      className={`pointer-events-auto relative group flex items-center gap-4 px-5 py-4 pr-12 rounded-2xl bg-white border border-slate-200/80 shadow-lg shadow-slate-900/5 transition-all hover:shadow-xl hover:shadow-slate-900/10 max-w-[420px] w-full cursor-grab select-none touch-none ${
        isExiting ? 'animate-out fade-out slide-out-to-top-2 duration-300' : 'animate-in fade-in slide-in-from-top-5 duration-500'
      }`}
      style={{
        transform: `translateX(${dragX}px) ${isExiting ? 'translateY(-10px) scale(0.95)' : ''}`,
        opacity: isExiting ? 0 : opacity,
        transition: isDraggingRef.current ? 'none' : 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseEnter={() => {
        setIsPaused(true);
        if (timerRef.current) clearTimeout(timerRef.current);
      }}
      onMouseLeave={() => {
        setIsPaused(false);
      }}
    >
      <div className={`shrink-0 flex items-center justify-center w-11 h-11 rounded-xl ${styles.iconBg} ${styles.iconColor}`}>
        <Icon icon={styles.icon} width="20" />
      </div>

      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="text-sm font-semibold text-slate-900 mb-1 leading-tight">
            {title}
          </h4>
        )}
        <p className="text-[13.5px] text-slate-600 leading-relaxed">
          {message}
        </p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          dismiss();
        }}
        className="absolute top-3 right-3 transition-colors text-slate-400 hover:text-slate-600 rounded-lg p-1"
      >
        <Icon icon="solar:close-circle-linear" width="18" />
      </button>
    </div>
  );
}
