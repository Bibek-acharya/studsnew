"use client";

import React from "react";

const ProgTh: React.FC<{ className?: string; children?: React.ReactNode }> = ({
  className = "",
  children,
}) => (
  <div className={`text-[13px] font-bold uppercase text-gray-800 ${className}`}>
    {children}
  </div>
);

export default ProgTh;