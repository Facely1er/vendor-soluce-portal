import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  className?: string;
  debounceMs?: number;
  autoFocus?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Search...',
  value: controlledValue,
  onChange,
  onSearch,
  className,
  debounceMs = 300,
  autoFocus = false
}) => {
  const [internalValue, setInternalValue] = useState('');
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const isControlled = controlledValue !== undefined;

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleChange = useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }

      if (onChange) {
        onChange(newValue);
      }

      if (onSearch && debounceMs > 0) {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
          onSearch(newValue);
        }, debounceMs);
      } else if (onSearch) {
        onSearch(newValue);
      }
    },
    [isControlled, onChange, onSearch, debounceMs]
  );

  const handleClear = useCallback(() => {
    handleChange('');
  }, [handleChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch) {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }
        onSearch(value);
      }
      if (e.key === 'Escape') {
        handleClear();
      }
    },
    [onSearch, value, handleClear]
  );

  return (
    <div className={cn('relative w-full', className)}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
      </div>
      <input
        type="search"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={cn(
          'w-full pl-10 pr-10 py-2 text-sm',
          'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md',
          'placeholder:text-gray-400 dark:placeholder:text-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-vendorsoluce-green focus:border-vendorsoluce-green',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-colors'
        )}
        aria-label="Search"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3 hover:text-gray-600 dark:hover:text-gray-300 text-gray-400 dark:text-gray-500 transition-colors"
          aria-label="Clear search"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;

