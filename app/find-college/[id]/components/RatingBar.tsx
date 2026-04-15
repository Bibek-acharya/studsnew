"use client";

import React from "react";

const RatingBar: React.FC<{
  label: string;
  width: string;
  color: string;
  pct: string;
}> = ({ label, width, color, pct }) => (
  <div className="flex items-center text-[13px] font-medium text-gray-600">
    <span className="w-3">{label}</span>
    <i className="fa-solid fa-star mx-1.5 text-[10px] text-gray-400"></i>
    <div className="relative mx-3 h-2 flex-grow rounded bg-[#f1f5f9]">
      <div className={`h-full rounded ${color}`} style={{ width }}></div>
    </div>
    <span className="w-8 text-right text-gray-400">{pct}</span>
  </div>
);

export default RatingBar;