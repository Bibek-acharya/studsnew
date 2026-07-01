"use client";

import React from "react";

const InfoBlock: React.FC<{
  title: string;
  desc: string;
  icon: string;
  color: "blue" | "green";
}> = ({ title, desc, icon, color }) => (
  <div className="rounded-md border border-gray-200 bg-white p-8">
    <div className="mb-4 flex items-center gap-3.5">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full ${color === "blue" ? "bg-brand-blue/10 text-brand-blue" : "bg-brand-blue/10 text-brand-blue"}`}
      >
        <i className={icon}></i>
      </div>
      <h3 className="text-[16px] font-bold text-gray-900">{title}</h3>
    </div>
    <div
      className="prose prose-gray max-w-none text-[14.5px] leading-[1.7] break-words overflow-x-auto [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap [&_img]:max-w-full [&_table]:block [&_table]:overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: desc }}
    />
  </div>
);

export default InfoBlock;
