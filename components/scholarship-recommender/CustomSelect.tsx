"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  label?: string;
  className?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  label,
  className = "",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          <span className={selectedOption ? "text-[#1e293b]" : "text-slate-400"}>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown
            className={`h-5 w-5 text-slate-600 absolute right-3 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border-2 border-[#cbd5e1] rounded-md shadow-lg overflow-hidden">
            <div className="max-h-60 overflow-y-auto">
              {options.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setHoveredIndex(null);
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`w-full text-left px-4 py-3 text-[16px] transition-colors ${
                    hoveredIndex === index
                      ? "bg-blue-50 text-[#2563eb]"
                        : "text-[#1e293b] hover:bg-slate-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}