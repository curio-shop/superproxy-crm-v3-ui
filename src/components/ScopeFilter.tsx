import { Icon } from '@iconify/react';
import { useState, useRef, useEffect } from 'react';

export type ScopeType = 'all' | 'team' | 'personal';

interface ScopeFilterProps {
  value: ScopeType;
  onChange: (scope: ScopeType) => void;
  defaultScope?: ScopeType;
  customLabels?: {
    all?: string;
    team?: string;
    personal?: string;
  };
  availableScopes?: ScopeType[];
  confirmationPosition?: 'left' | 'right';
}

export default function ScopeFilter({
  value,
  onChange,
  defaultScope = 'personal',
  customLabels = {},
  availableScopes = ['all', 'team', 'personal'],
  confirmationPosition = 'right'
}: ScopeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleScopeChange = (newScope: ScopeType) => {
    onChange(newScope);
    setIsOpen(false);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 1000);  // Faster feedback
  };

  const allScopeOptions = [
    { value: 'all' as const, label: customLabels.all || 'All Data', icon: 'solar:layers-minimalistic-linear' },
    { value: 'team' as const, label: customLabels.team || 'Team Data', icon: 'solar:users-group-rounded-linear' },
    { value: 'personal' as const, label: customLabels.personal || 'Personal Data', icon: 'solar:user-circle-linear' },
  ];

  const scopeOptions = allScopeOptions.filter(opt => availableScopes.includes(opt.value));

  const currentOption = scopeOptions.find(opt => opt.value === value) || scopeOptions[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2.5 pl-3 pr-3 h-[42px] rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:shadow-md hover:bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-1 group"
      >
        <Icon
          icon={currentOption.icon}
          width="16"
          className="text-slate-500 group-hover:text-slate-600 transition-colors"
        />
        <span className="text-sm font-medium">
          {currentOption.label}
        </span>
        <Icon
          icon="solar:alt-arrow-down-linear"
          width="13"
          className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-200/80 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
          {scopeOptions.map((option) => {
            const isSelected = value === option.value;
            return (
              <button
                key={option.value}
                onClick={() => handleScopeChange(option.value)}
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

      {showConfirmation && (
        <div className={`absolute top-0 z-50 pointer-events-none whitespace-nowrap flex items-center h-[42px] ${
          confirmationPosition === 'left'
            ? 'right-full mr-3'
            : 'left-full ml-3'
        }`}>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span className="text-xs font-medium text-slate-600">Viewing {currentOption.label}</span>
          </div>
        </div>
      )}
    </div>
  );
}
