"use client";

import React from "react";

interface AdBannerProps {
  title: string;
  subtitle: string;
  buttonText: string;
  onButtonClick?: () => void;
}

export const SponsoredBanner: React.FC<AdBannerProps> = ({ title, subtitle, buttonText, onButtonClick }) => (
  <div className="col-span-1 md:col-span-2 lg:col-span-3 w-full flex flex-col items-center mt-3 mb-5">
    <div className="w-full relative bg-linear-to-r from-white via-[#f0f6ff] to-[#e4f0ff] border border-[#dceaff] rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between overflow-hidden shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
      <div className="absolute bottom-0 right-0 w-80 h-40 bg-blue-100 rounded-tl-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-64 h-32 bg-white rounded-br-full blur-2xl opacity-70 pointer-events-none"></div>
      <span className="absolute top-4 right-5 text-[11px] font-semibold text-blue-400 italic">Sponsored</span>
      <div className="flex flex-col items-center gap-2 z-10 shrink-0 mb-6 md:mb-0 md:ml-4">
        <div className="w-16 h-16 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center justify-center p-2">
          <span className="font-bold text-blue-900 text-sm tracking-tight text-center">alorica</span>
        </div>
        <span className="text-[13px] font-semibold text-slate-600">Alorica</span>
      </div>
      <div className="flex flex-col items-center md:items-start text-center md:text-left z-10 max-w-2xl px-0 md:px-10 grow">
        <h3 className="text-[20px] md:text-[24px] font-extrabold text-[#1e293b] mb-4 tracking-tight leading-snug">{title}</h3>
        <button onClick={onButtonClick} className="bg-[#514df0] hover:bg-[#4338ca] text-white text-[14px] font-semibold px-6 py-2.5 rounded-full transition-colors flex items-center gap-2 shadow-md shadow-blue-500/20">
          {buttonText}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  </div>
);

export const SponsoredCarousel: React.FC = () => (
  <div className="flex items-center gap-3 mt-5">
    <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <div className="flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
      <span className="w-4 h-1.5 rounded-full bg-slate-500"></span>
      <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
      <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
      <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
    </div>
    <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
);

interface JobCardProps {
  title: string;
  company: string;
  subtitle: string;
  buttonText: string;
  onButtonClick?: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({ title, company, subtitle, buttonText, onButtonClick }) => (
  <div className="flex-1 min-h-45 bg-linear-to-br from-[#ebe5f6] to-[#d8d0ea] rounded-xl flex overflow-hidden  flex-col sm:flex-row">
    <div className="bg-white w-full sm:w-37.5 shrink-0 flex flex-col items-center justify-center text-center p-5 rounded-none sm:rounded-r-[60px] z-10">
      <div className="w-12.5 h-12.5 bg-white border border-gray-100 rounded-lg shadow-sm flex flex-col items-center justify-center mb-3 overflow-hidden relative">
        <div className="flex gap-0.75 rotate-45">
          <div className="w-1 h-7.5 rounded-full bg-[#e9234b]"></div>
          <div className="w-1 h-7.5 rounded-full bg-[#1a2749]"></div>
          <div className="w-1 h-7.5 rounded-full bg-[#e9234b]"></div>
        </div>
      </div>
      <p className="text-[#4a5173] text-[13px] font-semibold leading-tight">{company}</p>
    </div>
    <div className="flex-1 p-6 sm:p-6 sm:pl-10 flex flex-col justify-center items-center sm:items-start">
      <h2 className="text-[#212543] text-[18px] font-bold mb-4 leading-tight">{subtitle}</h2>
      <button onClick={onButtonClick} className="bg-[#556cfe] hover:bg-[#4358db] text-white px-5 py-2 rounded-full text-[13px] font-semibold flex items-center gap-1.5 transition-all active:scale-95">
        {buttonText}
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </button>
    </div>
  </div>
);