import React, { useState, useRef, useEffect, useMemo } from 'react';

interface DatalistInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  options: readonly string[];
}

const DatalistInput: React.FC<DatalistInputProps> = ({ label, id, options, value, onChange, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAllOnFocus, setShowAllOnFocus] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayedOptions = useMemo(() => {
    if (showAllOnFocus) {
      return options;
    }
    return options.filter(option =>
      option.toLowerCase().includes(String(value || '').toLowerCase())
    );
  }, [options, value, showAllOnFocus]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectOption = (option: string) => {
    if (onChange) {
      // Create a synthetic event that matches what the parent expects from an input change
      const syntheticEvent = {
        target: { value: option === 'Other' ? '' : option },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
    setIsOpen(false);

    if (option === 'Other') {
      // Allow state to update before focusing
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowAllOnFocus(false); // Start filtering as soon as user types
    if (onChange) {
      onChange(e); // Pass the original event
    }
  }

  const handleInputFocus = () => {
    setIsOpen(true);
    setShowAllOnFocus(true); // On focus, flag to show all options
  }

  return (
    <div className="relative" ref={containerRef}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          autoComplete="off"
          {...props}
          className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 pr-10"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 3a.75.75 0 01.53.22l3.5 3.5a.75.75 0 01-1.06 1.06L10 4.81 7.03 7.78a.75.75 0 01-1.06-1.06l3.5-3.5A.75.75 0 0110 3zm-3.72 9.53a.75.75 0 011.06 0L10 15.19l2.97-2.97a.75.75 0 111.06 1.06l-3.5 3.5a.75.75 0 01-1.06 0l-3.5-3.5a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
        </div>
      </div>
      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {displayedOptions.map(option => (
            <li
              key={option}
              onClick={() => handleSelectOption(option)}
              onMouseDown={(e) => e.preventDefault()} // Prevents input from losing focus before click is registered
              className="px-4 py-2 text-sm text-gray-800 cursor-pointer hover:bg-indigo-50"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DatalistInput;