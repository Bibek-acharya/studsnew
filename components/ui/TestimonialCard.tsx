"use client";

import React from "react";
import { getImageUrl } from "@/services/api";

interface TestimonialCardProps {
  name: string;
  role?: string;
  rating: number;
  text: string;
  date?: string;
  imageUrl?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role = "StudSphere User",
  rating,
  text,
  date,
  imageUrl,
}) => {

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 relative overflow-hidden flex-shrink-0 w-[350px] md:w-[400px] h-[400px] flex flex-col">
      <div className="absolute left-0 top-[36px] w-[4px] h-[48px] bg-blue-600 rounded-tr-[2px] rounded-br-[2px]" />
      <div className="p-6 md:p-8 pt-7 flex flex-col flex-1 overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-[60px] h-[60px] rounded-full border-2 border-white overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm bg-blue-100">
            {imageUrl ? (
              <img src={getImageUrl(imageUrl)} alt={name} className="w-full h-full object-cover" />
            ) : (
              <svg width="50" height="50" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 38C6 32 14 26 20 26C26 26 34 32 34 38" fill="#0000ff" />
                <path d="M10 40C10 33 15 28 20 28C25 28 30 33 30 40" fill="#60a5fa" />
                <rect x="17" y="18" width="6" height="10" fill="#fca5a5" />
                <circle cx="20" cy="15" r="7" fill="#ffbda7" />
                <path d="M13 14C13 9 17 6 20 6C23 6 27 9 27 14C27 15 28 17 25 18C25 15 22 13 20 13C18 13 15 15 15 18C12 17 13 15 13 14Z" fill="#3f3f46" />
              </svg>
            )}
          </div>
          <div className="flex flex-col mt-[-2px]">
            <h2 className="text-blue-600 font-bold text-lg leading-tight">{name}</h2>
            {role && <h3 className="text-gray-600 font-medium text-[15px] mt-0.5">{role}</h3>}
            <div className="flex items-center gap-2 mt-2">
              <div className="bg-blue-600 text-white flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-xs font-bold shadow-sm">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white" />
                </svg>
                {rating}.0
              </div>
              {date && (
                <>
                  <span className="text-gray-400 text-xs font-bold">.</span>
                  <span className="text-gray-400 text-[13px]">updated on {date}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="mt-6 flex-1 overflow-hidden">
          <p className="text-gray-600 text-[15px] leading-relaxed line-clamp-4">{text}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
