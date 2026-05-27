import React, { useState } from "react";
import GlobalFilterSection from "@/components/ui/GlobalFilterSection";

const Accordion: React.FC<{
  title: string;
  defaultOpen?: boolean;
  hideDivider?: boolean;
  children: React.ReactNode;
}> = ({ title, defaultOpen = false, hideDivider = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <GlobalFilterSection
      title={title}
      isOpen={open}
      onToggle={() => setOpen((o) => !o)}
      hideDivider={hideDivider}
    >
      {children}
    </GlobalFilterSection>
  );
};

export default Accordion;
