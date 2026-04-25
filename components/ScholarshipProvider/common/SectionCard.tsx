import React, { memo } from "react";

interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
}

const SectionCard: React.FC<SectionCardProps> = memo(({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg p-8 border border-slate-100 mb-12 ${className}`}>
      {children}
    </div>
  );
});

SectionCard.displayName = "SectionCard";

export default SectionCard;
