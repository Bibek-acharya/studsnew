"use client";

import React, { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  value: string;
  onChange: (val: string) => void;
  options: DropdownOption[];
  placeholder: string;
  size?: "sm" | "md";
  className?: string;
}

export default function Dropdown({ value, onChange, options, placeholder, size = "md", className = "" }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isSmall = size === "sm";

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative w-full ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white text-left transition-all duration-200 focus:outline-none focus:border-blue-500 hover:border-gray-200 ${
          isSmall ? "px-4 py-2.5 text-sm" : "px-4 py-2.5 text-sm"
        } ${
          isOpen ? "border-blue-500 ring-2 ring-blue-100" : ""
        }`}
      >
        <span
          className={`transition-colors truncate ${
            value ? "text-gray-900" : "text-gray-400"
          }`}
        >
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-all duration-300 flex-shrink-0 ${
            isOpen ? "rotate-180 text-blue-500" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-60"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute top-[calc(100%+4px)] left-0 z-70 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="max-h-64 overflow-y-auto py-1">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left transition-all hover:bg-gray-50 ${
                    isSmall ? "px-4 py-2 text-sm" : "px-4 py-2.5 text-sm"
                  } ${
                    value === opt.value
                      ? "bg-blue-50 font-semibold text-blue-600"
                      : "text-gray-900 font-medium hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {opt.label}
                    {value === opt.value && (
                      <Check className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
