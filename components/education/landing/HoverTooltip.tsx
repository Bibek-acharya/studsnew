"use client";

import { useState, type ReactNode } from "react";

interface HoverTooltipProps {
  label: string;
  children: ReactNode;
  className?: string;
  placement?: "top" | "bottom";
}

const placementClasses = {
  top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
};

const arrowClasses = {
  top: "absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900",
  bottom: "absolute left-1/2 bottom-full -translate-x-1/2 border-4 border-transparent border-b-slate-900",
};

const HoverTooltip: React.FC<HoverTooltipProps> = ({
  label,
  children,
  className = "",
  placement = "top",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
    >
      {children}
      <span
        className={`pointer-events-none absolute z-20 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white shadow-lg transition-all duration-200 ${
          isOpen ? "opacity-100" : "opacity-0"
        } ${placementClasses[placement]}`}
      >
        {label}
        <span className={arrowClasses[placement]} />
      </span>
    </span>
  );
};

export default HoverTooltip;
