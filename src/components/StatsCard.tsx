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
    <div className="glass-card p-6 group rounded-[24px]">
      <div className="flex justify-between items-start mb-4">
        <p className={`text-xs font-semibold uppercase tracking-wider ${titleColor}`}>{title}</p>
        <div
          ref={iconRef}
          onClick={handleIconClick}
          className={onIconClick ? 'cursor-pointer' : ''}
        >
          <Icon icon={icon} width="24" className={`${iconColor} transition`} />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <h3 className="text-4xl font-semibold text-slate-900 tracking-tight">{value}</h3>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-200/50">
        <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
      </div>
    </div>
  );
}

export default memo(StatsCard);
