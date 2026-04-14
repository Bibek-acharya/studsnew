"use client";

import React, { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

interface DropdownProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder: string;
}

export default function Dropdown({ value, onChange, options, placeholder }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded-xl border-2 border-[#cbd5e1] bg-white px-5 py-[1.1rem] text-left text-[17px] font-medium transition-all duration-200 hover:border-[#cbd5e1] ${
          isOpen
            ? "border-brand-blue ring-[3px] ring-brand-blue/10"
            : ""
        }`}
      >
        <span
          className={`transition-colors ${
            value ? "text-[#0f172a]" : "text-[#475569]"
          }`}
        >
          {value || placeholder}
        </span>
        <ChevronDown
          className={`h-5 w-5 text-[#475569] transition-all duration-300 ${
            isOpen ? "rotate-180 text-brand-blue" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-60"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute top-[calc(100%+8px)] left-0 z-70 w-full overflow-hidden rounded-xl border border-[#cbd5e1] bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="max-h-64 overflow-y-auto py-2">
              {options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                  }}
                  className={`w-full px-5 py-3.5 text-left text-base transition-all hover:bg-[#f1f5f9] ${
                    value === opt
                      ? "bg-brand-blue/10 font-semibold text-brand-blue"
                      : "text-[#0f172a] font-medium hover:text-[#0f172a]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {opt}
                    {value === opt && (
                      <Check className="h-4 w-4 text-brand-blue" />
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