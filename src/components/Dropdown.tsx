import { Icon } from '@iconify/react';
import { useState, useRef, useEffect, useMemo } from 'react';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  subtext?: string;
}

interface DropdownProps {
  value: string | string[];
  options: DropdownOption[] | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  icon?: string;
  label?: string;
  searchable?: boolean;
  multiSelect?: boolean;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  menuAlign?: 'left' | 'right';
  renderOption?: (option: DropdownOption, isSelected: boolean) => React.ReactNode;
  renderValue?: (selected: DropdownOption | DropdownOption[]) => React.ReactNode;
}

export default function Dropdown({
  value,
  options,
  onChange,
  placeholder = 'Select...',
  icon,
  label,
  searchable = false,
  multiSelect = false,
  disabled = false,
  error = false,
  className = '',
  buttonClassName = '',
  menuClassName = '',
  menuAlign = 'right',
  renderOption,
  renderValue,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Normalize options to always have value and label
  const normalizedOptions = useMemo(
    () =>
      options.map((opt) =>
        typeof opt === 'string' ? { value: opt, label: opt } : opt
      ),
    [options]
  );

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery) return normalizedOptions;
    const query = searchQuery.toLowerCase();
    return normalizedOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query) ||
        opt.value.toLowerCase().includes(query)
    );
  }, [normalizedOptions, searchQuery, searchable]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens - instant
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Get selected option(s)
  const selectedOptions = useMemo(() => {
    if (multiSelect && Array.isArray(value)) {
      return normalizedOptions.filter((opt) => value.includes(opt.value));
    }
    return normalizedOptions.find((opt) => opt.value === value);
  }, [value, normalizedOptions, multiSelect]);

  // Handle option selection
  const handleSelect = (optionValue: string) => {
    if (disabled) return;

    if (multiSelect && Array.isArray(value)) {
      const newValue = value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue];
      onChange(newValue);
    } else {
      onChange(optionValue);
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  // Check if option is selected
  const isSelected = (optionValue: string) => {
    if (multiSelect && Array.isArray(value)) {
      return value.includes(optionValue);
    }
    return value === optionValue;
  };

  // Render display value
  const renderDisplayValue = () => {
    if (renderValue && selectedOptions) {
      return renderValue(selectedOptions);
    }

    if (multiSelect && Array.isArray(selectedOptions)) {
      if (selectedOptions.length === 0) return placeholder;
      if (selectedOptions.length === 1) return selectedOptions[0].label;
      return `${selectedOptions.length} selected`;
    }

    if (selectedOptions && !Array.isArray(selectedOptions)) {
      return selectedOptions.label;
    }

    return placeholder;
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center justify-between w-full pl-3 pr-3 h-[40px] rounded-xl border text-slate-700 shadow-[0_1px_2px_0_rgb(0,0,0,0.04),inset_0_1px_0_0_rgb(255,255,255,0.8)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-900/[0.08] focus:ring-offset-1 group ${
          error
            ? 'border-red-300 bg-red-50 hover:border-red-400'
            : disabled
            ? 'border-slate-200 bg-slate-100 cursor-not-allowed opacity-60'
            : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-[0_2px_8px_0_rgb(0,0,0,0.06),inset_0_1px_0_0_rgb(255,255,255,0.8)]'
        } ${buttonClassName}`}
      >
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          {icon && (
            <Icon
              icon={icon}
              width="16"
              className={`flex-shrink-0 transition-colors ${
                error
                  ? 'text-red-500'
                  : disabled
                  ? 'text-slate-400'
                  : 'text-slate-500 group-hover:text-slate-600'
              }`}
            />
          )}
          {label && (
            <span className="text-xs font-medium text-slate-500 flex-shrink-0">
              {label}
            </span>
          )}
          <span
            className={`text-sm font-medium truncate ${
              !selectedOptions || (Array.isArray(selectedOptions) && selectedOptions.length === 0)
                ? 'text-slate-400'
                : 'text-slate-700'
            }`}
          >
            {renderDisplayValue()}
          </span>
        </div>
        <Icon
          icon="solar:alt-arrow-down-linear"
          width="13"
          className={`flex-shrink-0 ml-2 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute ${menuAlign === 'left' ? 'left-0' : 'right-0'} mt-1.5 min-w-[200px] bg-white rounded-2xl shadow-[0_12px_48px_-6px_rgb(0,0,0,0.12),0_0_0_1px_rgb(0,0,0,0.04)] py-2 z-50 overflow-hidden ${menuClassName}`}
          style={{
            animation: 'fadeIn 150ms ease-out, slideInFromTop 150ms ease-out',
          }}
        >
          {/* Search Input */}
          {searchable && (
            <div className="px-2 pb-1.5 pt-0.5">
              <div className="relative">
                <Icon
                  icon="solar:magnifer-linear"
                  width="15"
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-300"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-9 pr-3 py-2 text-[13px] rounded-lg bg-slate-50 border-0 focus:bg-slate-100/80 focus:ring-0 focus:outline-none transition-all duration-200 placeholder:text-slate-300"
                />
              </div>
              <div className="mt-1.5 border-b border-slate-100" />
            </div>
          )}

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto custom-scrollbar px-1.5">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-8 text-center text-[13px] text-slate-300">
                No results found
              </div>
            ) : (
              filteredOptions.map((option) => {
                const selected = isSelected(option.value);
                const optionDisabled = option.disabled || false;

                if (renderOption) {
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => !optionDisabled && handleSelect(option.value)}
                      disabled={optionDisabled}
                      className={`w-full text-left transition-all duration-150 ${
                        optionDisabled ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {renderOption(option, selected)}
                    </button>
                  );
                }

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => !optionDisabled && handleSelect(option.value)}
                    disabled={optionDisabled}
                    className={`w-full flex items-center justify-between px-2.5 py-2.5 text-left rounded-lg transition-all duration-150 ${
                      selected
                        ? 'bg-slate-100 text-slate-900'
                        : optionDisabled
                        ? 'text-slate-300 cursor-not-allowed'
                        : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      {option.icon && (
                        <Icon
                          icon={option.icon}
                          width="16"
                          className={selected ? 'text-slate-700' : 'text-slate-400'}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <span
                          className={`text-[13px] ${
                            selected ? 'font-semibold text-slate-900' : 'font-medium'
                          }`}
                        >
                          {option.label}
                        </span>
                        {option.subtext && (
                          <p className="text-xs text-slate-400 mt-0.5">
                            {option.subtext}
                          </p>
                        )}
                      </div>
                    </div>
                    {selected && (
                      <Icon
                        icon="solar:check-read-linear"
                        width="16"
                        className="text-slate-500 flex-shrink-0"
                      />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInFromTop {
          from {
            transform: translateY(-8px);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
