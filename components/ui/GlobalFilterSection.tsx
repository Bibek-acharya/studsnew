import React from "react";

interface GlobalFilterSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  titleClassName?: string;
  sectionClassName?: string;
  contentClassName?: string;
}

const GlobalFilterSection: React.FC<GlobalFilterSectionProps> = ({
  title,
  isOpen,
  onToggle,
  children,
  titleClassName,
  sectionClassName,
  contentClassName,
}) => {
  return (
    <div className={sectionClassName || "border-b border-gray-100"}>
      <button
        type="button"
        onClick={onToggle}
        className="group flex w-full items-center justify-between bg-white py-4 text-left"
      >
        <span
          className={
            titleClassName ||
            "text-[15px] font-semibold text-gray-900 transition-colors group-hover:text-blue-600"
          }
        >
          {title}
        </span>
        <i
          className={`fa-solid fa-chevron-down h-4 w-4 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        ></i>
      </button>
      {isOpen && <div className={contentClassName || "pb-4"}>{children}</div>}
    </div>
  );
};

export default GlobalFilterSection;
