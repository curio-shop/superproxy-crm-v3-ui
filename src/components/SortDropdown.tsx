import { Icon } from '@iconify/react';
import { useState, useRef, useEffect } from 'react';

export interface SortOption {
  value: string;
  label: string;
  icon: string;
}

interface SortDropdownProps {
  value: string;
  options: SortOption[];
  onChange: (value: string) => void;
  className?: string;
}

export default function SortDropdown({
  value,
  options,
  onChange,
  className = '',
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2.5 pl-3 pr-3 h-[42px] rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:shadow-md hover:bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-1 group"
      >
        <Icon
          icon={selectedOption.icon}
          width="16"
          className="text-slate-500 group-hover:text-slate-600 transition-colors"
        />
        <span className="text-sm font-medium">
          {selectedOption.label}
        </span>
        <Icon
          icon="solar:alt-arrow-down-linear"
          width="13"
          className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-200/80 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full flex items-center justify-between px-3 py-2 text-left transition-all duration-150 ${
                  isSelected
                    ? 'bg-blue-50/80 text-blue-700'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className={`text-sm font-medium ${isSelected ? 'font-semibold' : ''}`}>
                  {option.label}
                </span>
                {isSelected && (
                  <Icon icon="solar:check-circle-bold" width="16" className="text-blue-600" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
