import { ReactNode, useRef, memo } from 'react';
import { Icon } from '@iconify/react';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle: ReactNode;
  icon: string;
  iconColor: string;
  titleColor: string;
  onIconClick?: (x: number, y: number) => void;
  iconAnimation?: 'celebrate' | 'shine';
}

function StatsCard({
  title,
  value,
  subtitle,
  icon,
  iconColor,
  titleColor,
  onIconClick,
  iconAnimation = 'celebrate',
}: StatsCardProps) {
  const iconRef = useRef<HTMLDivElement>(null);

  const handleIconClick = (e: React.MouseEvent) => {
    if (onIconClick && iconRef.current) {
      e.stopPropagation();
      const rect = iconRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      onIconClick(x, y);

      const animationClass = iconAnimation === 'shine' ? 'animate-icon-shine' : 'animate-icon-celebrate';
      const duration = iconAnimation === 'shine' ? 700 : 600;

      iconRef.current.classList.remove(animationClass);
      void iconRef.current.offsetWidth;
      iconRef.current.classList.add(animationClass);

      setTimeout(() => {
        iconRef.current?.classList.remove(animationClass);
      }, duration);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] border border-slate-100/80 p-5 group">
      <div className="flex justify-between items-start mb-3">
        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{title}</p>
        <div
          ref={iconRef}
          onClick={handleIconClick}
          className={onIconClick ? 'cursor-pointer' : ''}
        >
          <Icon icon={icon} width="18" className="text-slate-400 transition" />
        </div>
      </div>
      <h3 className="text-2xl font-semibold text-slate-800 tracking-tight">{value}</h3>
      <div className="mt-3">
        <p className="text-[11px] text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}

export default memo(StatsCard);
