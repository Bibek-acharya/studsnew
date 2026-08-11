"use client";

import React from "react";
import RichText from "@/components/RichText";

const ReviewCard: React.FC<{
  initials: string;
  name: string;
  subtitle: string;
  rating: number;
  pros: string;
  cons: string;
  tone: "blue" | "purple";
  profileImage?: string;
  yearlyFee?: number;
  scholarship?: boolean;
  internshipOutcome?: string;
  ratings?: Record<string, number>;
}> = ({ initials, name, subtitle, rating, pros, cons, tone, profileImage, yearlyFee, scholarship, internshipOutcome, ratings }) => (
  <div className="rounded-md border border-gray-200 bg-white p-6 ">
    <div className="mb-4 flex items-start justify-between">
      <div className="flex items-center gap-3">
        {profileImage ? (
          <img src={profileImage} alt="" className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${tone === "blue" ? "bg-brand-blue/10 text-brand-blue" : "bg-brand-blue/10 text-brand-blue"}`}
          >
            {initials}
          </div>
        )}
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
    <div className="mb-3 rounded-md border border-gray-100 bg-[#fafafa] p-4">
      <div className="mb-2 flex items-start gap-2">
        <i className="fa-solid fa-thumbs-up mt-0.5 text-green-500"></i>
        <p className="text-[13.5px] leading-relaxed text-gray-700">
          <span className="font-bold text-gray-900">Pros:</span>{" "}
          <RichText html={pros} variant="sm" as="span" />
        </p>
      </div>
      <div className="flex items-start gap-2">
        <i className="fa-solid fa-thumbs-down mt-0.5 text-red-500"></i>
        <p className="text-[13.5px] leading-relaxed text-gray-700">
          <span className="font-bold text-gray-900">Cons:</span>{" "}
          <RichText html={cons} variant="sm" as="span" />
        </p>
      </div>
    </div>
    {(yearlyFee || scholarship !== undefined || internshipOutcome) && (
      <div className="mb-3 flex flex-wrap gap-x-6 gap-y-2 text-[12.5px] text-gray-600">
        {yearlyFee && (
          <span>
            <i className="fa-solid fa-indian-rupee-sign mr-1 text-xs"></i>
            NPR {yearlyFee.toLocaleString("en-IN")}/yr
          </span>
        )}
        {scholarship !== undefined && (
          <span>
            <i className="fa-solid fa-award mr-1 text-xs"></i>
            {scholarship ? "Scholarship Received" : "No Scholarship"}
          </span>
        )}
        {internshipOutcome && (
          <span>
            <i className="fa-solid fa-briefcase mr-1 text-xs"></i>
            {internshipOutcome === "excellent" ? "Excellent Placements" : internshipOutcome === "good" ? "Good Opportunities" : internshipOutcome === "average" ? "Average Placements" : "Poor Placements"}
          </span>
        )}
      </div>
    )}
    {ratings && Object.keys(ratings).length > 0 && (
      <div className="border-t border-gray-100 pt-3">
        <div className="flex flex-wrap gap-3">
          {Object.entries(ratings).map(([category, value]) => (
            <div key={category} className="flex items-center gap-1 rounded bg-gray-50 px-2 py-1 text-xs">
              <span className="text-gray-500 max-w-[120px] truncate">{category}</span>
              <span className="font-semibold text-gray-800">{value}</span>
              <i className="fa-solid fa-star text-[10px] text-yellow-400"></i>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default ReviewCard;
