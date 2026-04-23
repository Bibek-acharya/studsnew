import React from "react";

export const NavItem: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean;
}> = ({ children, onClick, isActive = false }) => (
  <button
    onClick={onClick}
    className={`nav-link flex h-full shrink-0 items-center justify-center ${isActive ? "nav-link-active" : ""}`}
  >
    {children}
  </button>
);

export const DesktopDropdown: React.FC<{
  label: string;
  children: React.ReactNode;
  alignRight?: boolean;
  isOpen: boolean;
  onToggle: () => void;
  isActive?: boolean;
}> = ({ label, children, alignRight = false, isOpen, onToggle, isActive = false }) => (
  <div className="menu-anchor relative font-semibold h-full shrink-0">
    <button
      type="button"
      onClick={onToggle}
      className={`nav-link flex h-full items-center gap-1 ${isActive ? "nav-link-active" : ""}`}
    >
      <span>{label}</span>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-transform duration-200 ${isOpen || isActive ? "rotate-180 text-[#0000ff]" : "text-gray-400"}`}
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
    <div
      className={`absolute top-11 sm:top-11.5 z-[200] mt-1 transition-all duration-200 ${isOpen ? "visible translate-y-0 opacity-100" : "invisible translate-y-2 opacity-0"} ${
        alignRight ? "right-0" : "left-0"
      }`}
    >
      <div className="relative w-80 xs:w-96 sm:w-100 whitespace-normal rounded-md border border-gray-100 bg-white p-2.5 sm:p-3 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
        <div
          className={`absolute -top-1.5 h-3 w-3 rotate-45 border-l border-t border-gray-100 bg-white ${
            alignRight ? "right-6" : "left-6"
          }`}
        ></div>
        <div className="relative z-10 flex flex-col gap-1 whitespace-normal">
          {children}
        </div>
      </div>
    </div>
  </div>
);

export const DropdownCard: React.FC<{
  icon: string;
  color: string;
  title: string;
  desc: string;
  onClick?: () => void;
}> = ({ icon, color, title, desc, onClick }) => (
  <button
    onClick={onClick}
    disabled={!onClick}
    className="group/card flex w-full min-w-0 items-start whitespace-normal rounded-md border border-transparent p-2.5 text-left transition-colors hover:border-blue-100 hover:bg-blue-50/50 disabled:cursor-not-allowed disabled:opacity-70 sm:p-3"
  >
    <div
      className={`flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-md border border-gray-100 bg-gray-50 transition-colors group-hover/card:bg-white ${color}`}
    >
      <i className={`fa-solid ${icon} text-base sm:text-lg`}></i>
    </div>
    <div className="ml-3 sm:ml-4 min-w-0 flex-1">
      <h4 className="text-[13px] sm:text-[15px] font-bold leading-tight text-gray-900">
        {title}
      </h4>
      <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-[13px] leading-relaxed text-gray-500 line-clamp-2">
        {desc}
      </p>
    </div>
  </button>
);
