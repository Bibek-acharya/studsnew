"use client";

import React, { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

interface DropdownProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder: string;
  size?: "sm" | "md";
}

export default function Dropdown({ value, onChange, options, placeholder, size = "md" }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isSmall = size === "sm";

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white text-left transition-all duration-200 focus:outline-none focus:border-blue-600 focus:ring-[3px] focus:ring-blue-100 hover:border-slate-200 ${
          isSmall ? "px-4 py-3 text-sm" : "px-4 py-3 text-sm"
        } ${
          isOpen ? "border-blue-600 ring-[3px] ring-blue-100" : ""
        }`}
      >
        <span
          className={`transition-colors ${
            value ? "text-slate-900" : "text-slate-500"
          }`}
        >
          {value || placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-slate-500 transition-all duration-300 ${
            isOpen ? "rotate-180 text-blue-600" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-60"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute top-[calc(100%+8px)] left-0 z-70 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="max-h-64 overflow-y-auto py-2">
              {options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left transition-all hover:bg-slate-50 ${
                    isSmall ? "px-4 py-2.5 text-sm" : "px-4 py-3 text-sm"
                  } ${
                    value === opt
                      ? "bg-blue-50 font-semibold text-blue-600"
                      : "text-slate-900 font-medium hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {opt}
                    {value === opt && (
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
