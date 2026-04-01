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
  const [progress, setProgress] = useState(100);
  const toastRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<number | null>(null);
  const startXRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startTimeRef = useRef(Date.now());
  const elapsedRef = useRef(0);

  const getAccent = () => {
    switch (type) {
      case 'success':
        return { accent: '#34d399', icon: 'solar:check-circle-bold', label: 'Success' };
      case 'error':
        return { accent: '#fb7185', icon: 'solar:close-circle-bold', label: 'Error' };
      case 'warning':
        return { accent: '#fbbf24', icon: 'solar:danger-triangle-bold', label: 'Warning' };
      case 'info':
      default:
        return { accent: '#38bdf8', icon: 'solar:info-circle-bold', label: 'Info' };
    }
  };

  const { accent, icon } = getAccent();

  const dismiss = () => {
    setIsExiting(true);
    if (progressRef.current) cancelAnimationFrame(progressRef.current);
    setTimeout(() => onClose(), 280);
  };

  // Progress bar animation
  useEffect(() => {
    if (isExiting) return;

    const tick = () => {
      if (isPaused) {
        progressRef.current = requestAnimationFrame(tick);
        return;
      }
      const now = Date.now();
      const delta = now - startTimeRef.current;
      startTimeRef.current = now;
      elapsedRef.current += delta;

      const remaining = Math.max(0, 100 - (elapsedRef.current / duration) * 100);
      setProgress(remaining);

      if (remaining <= 0) {
        dismiss();
        return;
      }
      progressRef.current = requestAnimationFrame(tick);
    };

    startTimeRef.current = Date.now();
    progressRef.current = requestAnimationFrame(tick);

    return () => {
      if (progressRef.current) cancelAnimationFrame(progressRef.current);
    };
  }, [isPaused, isExiting, duration]);

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
  };

  const handleGlobalMove = (e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    const diff = e.clientX - startXRef.current;
    setDragX(diff);
  };

  const handleGlobalUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    if (Math.abs(dragX) > 80) {
      dismiss();
    } else {
      setDragX(0);
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleGlobalMove);
    document.addEventListener('mouseup', handleGlobalUp);
    return () => {
      document.removeEventListener('mousemove', handleGlobalMove);
      document.removeEventListener('mouseup', handleGlobalUp);
    };
  }, [dragX]);

  const dragOpacity = Math.max(0, 1 - Math.abs(dragX) / 200);

  return (
    <div
      ref={toastRef}
      className={`pointer-events-auto relative group cursor-grab select-none touch-none
        ${isExiting ? 'toast-exit' : 'toast-enter'}`}
      style={{
        transform: `translateX(${dragX}px)`,
        opacity: isExiting ? 0 : dragOpacity,
        transition: isDraggingRef.current ? 'none' : 'all 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        startTimeRef.current = Date.now();
      }}
    >
      {/* Main toast body */}
      <div
        className="relative flex items-center gap-3.5 pl-4 pr-10 py-3 rounded-[14px] overflow-hidden"
        style={{
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(20px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
          boxShadow: `0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.06) inset, 0 1px 0 rgba(255,255,255,0.05) inset`,
        }}
      >
        {/* Icon */}
        <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-[10px]"
          style={{ background: `${accent}18` }}
        >
          <Icon icon={icon} width="17" style={{ color: accent }} />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="text-[12.5px] font-semibold text-white/90 mb-0.5 leading-tight tracking-[-0.01em]">
              {title}
            </h4>
          )}
          <p className="text-[13px] text-slate-300 leading-snug tracking-[-0.005em]">
            {message}
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={(e) => { e.stopPropagation(); dismiss(); }}
          className="absolute top-2.5 right-2.5 p-1 rounded-lg text-slate-500 hover:text-slate-300 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Icon icon="solar:close-circle-linear" width="16" />
        </button>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.04]">
          <div
            className="h-full rounded-full transition-none"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${accent}90, ${accent}50)`,
              boxShadow: `0 0 6px ${accent}30`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
