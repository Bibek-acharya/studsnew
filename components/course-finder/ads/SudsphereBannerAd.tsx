"use client";

import React from "react";
import { useCoursePageAds, trackAdClick } from "./useCoursePageAds";

const SudsphereBannerAd: React.FC = () => {
  const { data: ads, isLoading } = useCoursePageAds("banner");

  if (isLoading || !ads || ads.length === 0) return null;

  const ad = ads[0];

  return (
    <a
      href={ad.link_url || "#"}
      onClick={() => trackAdClick(ad.id)}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <div
        className="relative w-full h-auto md:h-[220px] rounded-md overflow-hidden flex items-center"
        style={{
          backgroundColor: ad.accent || "#0b71d1",
          backgroundImage: `
            radial-gradient(circle at 5% 150%, rgba(20, 160, 255, 0.3) 0%, transparent 40%),
            radial-gradient(circle at 80% 150%, rgba(0, 80, 180, 0.3) 0%, transparent 50%)
          `,
        }}
      >
        <div className="absolute border border-white/15 rounded-full w-[300px] h-[300px] -top-[150px] right-[10%] pointer-events-none" />
        <div className="absolute border border-white/10 rounded-full w-[400px] h-[400px] -top-[200px] right-[5%] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[150%] bg-[#128cf4] opacity-20 rounded-tr-full mix-blend-screen pointer-events-none transform -translate-x-10 translate-y-20" />

        <div className="relative z-10 w-full px-6 py-10 md:px-16 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left flex-1">
            <h1 className="text-white text-3xl md:text-[36px] font-extrabold leading-tight tracking-tight">
              {ad.title}
            </h1>
            {ad.description || ad.location ? (
              <p className="mt-2 text-white/80 text-sm md:text-base max-w-xl">
                {ad.description || ad.location}
              </p>
            ) : null}
          </div>

          {ad.image_url && (
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden border-2 border-white/20 flex-shrink-0">
              <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>
    </a>
  );
};

export default SudsphereBannerAd;
