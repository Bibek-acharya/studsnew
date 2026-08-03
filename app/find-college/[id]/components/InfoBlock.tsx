"use client";

import React from "react";
import RichText from "@/components/RichText";

const InfoBlock: React.FC<{
  title: string;
  desc: string;
  icon: string;
  color: "blue" | "green";
}> = ({ title, desc, icon, color }) => (
  <div
    className={`rounded-md border border-gray-100 p-8 ${
      color === "blue" ? "bg-[#f4f7fb]" : "bg-[#f0fdf4]"
    }`}
  >
    <div className="mb-4 flex items-center gap-3.5">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full ${
          color === "blue"
            ? "bg-blue-100/80 text-blue-600"
            : "bg-green-100/80 text-green-600"
        }`}
      >
        <i className={icon}></i>
      </div>
      <h3 className="text-[16px] font-bold text-gray-900">{title}</h3>
    </div>
    <RichText
      html={desc}
      variant="sm"
      className="text-[14.5px] leading-[1.7] text-gray-600 overflow-x-auto [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap [&_img]:max-w-full [&_table]:block [&_table]:overflow-x-auto"
    />
  </div>
);

export default InfoBlock;
