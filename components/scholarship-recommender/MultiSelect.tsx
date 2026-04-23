"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface MultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  label?: string;
  className?: string;
}

export default function MultiSelect({
  value,
  onChange,
  options,
  placeholder = "Select options",
  label,
  className = "",
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (optionValue: string) => {
    const exists = value.includes(optionValue);
    if (exists) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const selectedLabels = options
    .filter((opt) => value.includes(opt.value))
    .map((opt) => opt.label);

  const displayText = selectedLabels.length > 0
    ? selectedLabels.length === 1
      ? selectedLabels[0]
      : `${selectedLabels.length} selected`
    : placeholder;

  return (
    <div className={className} ref={containerRef}>
      {label && (
        <label className="text-[16px] font-semibold text-[#1e293b] block mb-2">{label}</label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-3.5 pr-11 border-2 border-[#cbd5e1] rounded-md bg-white text-[16px] text-[#1e293b] transition-all hover:border-[#2563eb] focus:border-[#2563eb] focus:ring-2 focus:ring-[#bfdbfe] focus:outline-none"
        >
          <span className={value.length > 0 ? "text-[#1e293b]" : "text-slate-400"}>
            {displayText}
          </span>
          <ChevronDown
            className={`h-5 w-5 text-slate-600 absolute right-3 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border-2 border-[#cbd5e1] rounded-md shadow-lg overflow-hidden">
            {value.length > 0 && (
              <div className="px-4 py-3 border-b border-dashed border-slate-300 flex flex-wrap gap-2">
                {selectedLabels.map((label) => (
                  <span
                    key={label}
                    className="bg-brand-blue text-white text-[14px] px-3 py-1 rounded-md flex items-center gap-1"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}
            <div className="max-h-60 overflow-y-auto">
              {options.map((option, index) => {
                const isSelected = value.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleOption(option.value)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-[16px] transition-colors ${
                      hoveredIndex === index
                        ? "bg-blue-100 text-brand-blue"
                        : isSelected
                          ? "text-brand-blue"
                          : "text-[#1e293b] hover:bg-slate-50"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "border-brand-blue bg-brand-blue"
                        : hoveredIndex === index
                          ? "border-brand-blue"
                          : "border-slate-400"
                    }`}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}