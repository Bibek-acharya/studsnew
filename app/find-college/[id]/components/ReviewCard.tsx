"use client";

import React from "react";

const ReviewCard: React.FC<{
  initials: string;
  name: string;
  subtitle: string;
  rating: number;
  pros: string;
  cons: string;
  tone: "blue" | "purple";
}> = ({ initials, name, subtitle, rating, pros, cons, tone }) => (
  <div className="rounded-md border border-gray-200 bg-white p-6 ">
    <div className="mb-4 flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${tone === "blue" ? "bg-brand-blue/10 text-brand-blue" : "bg-brand-blue/10 text-brand-blue"}`}
        >
          {initials}
        </div>
        <div>
          <h4 className="text-[14.5px] font-bold text-gray-900">{name}</h4>
          <p className="text-[12px] text-gray-500">{subtitle}</p>
        </div>
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, idx) => (
          <i
            key={idx}
            className={`${idx < rating ? "fa-solid text-yellow-400" : "fa-regular text-gray-300"} fa-star text-[13px]`}
          ></i>
        ))}
      </div>
    </div>
    <div className="mb-3 rounded-lg border border-gray-100 bg-[#fafafa] p-4">
      <div className="mb-2 flex items-start gap-2">
        <i className="fa-solid fa-thumbs-up mt-0.5 text-green-500"></i>
        <p className="text-[13.5px] leading-relaxed text-gray-700">
          <span className="font-bold text-gray-900">Pros:</span> {pros}
        </p>
      </div>
      <div className="flex items-start gap-2">
        <i className="fa-solid fa-thumbs-down mt-0.5 text-red-500"></i>
        <p className="text-[13.5px] leading-relaxed text-gray-700">
          <span className="font-bold text-gray-900">Cons:</span> {cons}
        </p>
      </div>
    </div>
  </div>
);

export default ReviewCard;