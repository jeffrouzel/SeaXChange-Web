"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface SpeciesOption {
  display: string;
  value: string;
}

interface SearchableDropdownProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const speciesOptions: SpeciesOption[] = [
  { display: 'Turingan (Skipjack)', value: 'Turingan' },
  { display: 'Tambakol (yellowfin)', value: 'Tambakol' },
  { display: 'Kurit (bullet)', value: 'Kurit' },
  { display: 'Bariles (albacore)', value: 'Bariles' },
  { display: 'Skipjack', value: 'Skipjack' },
  { display: 'Yellowfin', value: 'Yellowfin' },
  { display: 'Bullet', value: 'Bullet' },
  { display: 'Albacore', value: 'Albacore' },
];

export default function SearchableDropdown({
  value,
  onChange,
  placeholder = 'Search or select species...'
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = speciesOptions.filter(option =>
    option.display.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onChange(e.target.value);
  };

  const handleOptionClick = (option: SpeciesOption) => {
    setSearchTerm(option.value);
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#429FAD] focus:border-transparent"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
        >
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.map((option, index) => (
            <div
              key={index}
              onClick={() => handleOptionClick(option)}
              className="px-4 py-2 hover:bg-[#429FAD]/10 cursor-pointer text-gray-700 hover:text-[#429FAD]"
            >
              {option.display}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}