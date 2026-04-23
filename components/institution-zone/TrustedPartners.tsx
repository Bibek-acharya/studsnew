"use client";

import React from "react";
import Image from "next/image";

interface TrustedPartnersProps {
  className?: string;
}

const PARTNER_LOGOS = [
  {
    src: "https://kist.edu.np/resources/assets/img/logo_small.jpg",
    alt: "KIST College",
  },
  {
    src: "https://www.trinity.edu.np/assets/backend/uploads/Logo/trinity%20college%20logo.jpg",
    alt: "Trinity College",
  },
  {
    src: "https://advancefoundation.edu.np/public/assets/img/logo.jpg",
    alt: "Advance Foundation",
  },
  {
    src: "https://goldengateintl.com/wp-content/uploads/2023/05/Untitled-design.png",
    alt: "Golden Gate International",
  },
];

const STATS = [
  {
    type: "users" as const,
    value: "10,000 +",
    label: "Users",
  },
  {
    type: "districts" as const,
    value: "77",
    label: "Districts",
  },
  {
    type: "partnerships" as const,
    value: "15 +",
    label: "Global University Partnerships",
  },
];

export default function TrustedPartners({ className }: TrustedPartnersProps) {
  const scrollItems = [...PARTNER_LOGOS, ...PARTNER_LOGOS];

  return (
    <section className={`max-w-350 mx-auto py-16 px-4 sm:px-8 lg:px-8 bg-white ${className || ""}`}>
      <div className="mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold tracking-tight mb-14 text-black text-center md:text-left">
          Trusted by leading <span className="text-blue-600">colleges around Nepal</span>
        </h2>

        <div className="relative w-full overflow-hidden mb-20 group">
          <div className="absolute inset-y-0 left-0 w-16 sm:w-24 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 sm:w-24 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="flex animate-scroll items-center">
            <div className="flex items-center gap-16 sm:gap-24 px-8 sm:px-12">
              {scrollItems.map((logo, idx) => (
                <div key={`first-${idx}`} className="flex items-center">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={180}
                    height={64}
                    className="h-12 sm:h-16 w-auto max-w-45 object-contain mix-blend-multiply"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://placehold.co/180x64?text=${encodeURIComponent(logo.alt)}`;
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-16 sm:gap-24 px-8 sm:px-12">
              {scrollItems.map((logo, idx) => (
                <div key={`second-${idx}`} className="flex items-center">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={180}
                    height={64}
                    className="h-12 sm:h-16 w-auto max-w-[180px] object-contain mix-blend-multiply"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://placehold.co/180x64?text=${encodeURIComponent(logo.alt)}`;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-auto lg:h-[220px]">
          <div className="lg:col-span-2 bg-gradient-to-r from-black via-slate-900 to-blue-900 rounded-md p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between  relative overflow-hidden h-full">
            <div className="flex -space-x-5 mb-6 sm:mb-0 z-10">
              <Image
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&h=120&fit=crop&crop=faces"
                alt="Graduate 1"
                width={84}
                height={84}
                className="w-[76px] h-[76px] sm:w-[84px] sm:h-[84px] rounded-full border-[3px] border-gray-200 object-cover "
              />
              <Image
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=faces"
                alt="Graduate 2"
                width={84}
                height={84}
                className="w-[76px] h-[76px] sm:w-[84px] sm:h-[84px] rounded-full border-[3px] border-blue-200 object-cover "
              />
              <Image
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=faces"
                alt="Graduate 3"
                width={84}
                height={84}
                className="w-[76px] h-[76px] sm:w-[84px] sm:h-[84px] rounded-full border-[3px] border-blue-300 object-cover "
              />
              <Image
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&crop=faces"
                alt="Graduate 4"
                width={84}
                height={84}
                className="w-[76px] h-[76px] sm:w-[84px] sm:h-[84px] rounded-full border-[3px] border-blue-100 object-cover "
              />
            </div>
            <div className="text-center sm:text-left z-10 sm:pr-4 flex flex-col justify-center">
              <div className="text-[40px] lg:text-[46px] font-bold text-white leading-tight">
                {STATS[0].value}
              </div>
              <div className="text-lg text-white font-medium mt-1">{STATS[0].label}</div>
            </div>
          </div>

          <div className="lg:col-span-1 bg-blue-50 rounded-md p-8 flex flex-col items-center justify-center text-center relative overflow-hidden h-full ">
            <svg
              className="absolute -bottom-10 -right-10 w-64 h-64 text-black opacity-[0.04] pointer-events-none"
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
              <ellipse cx="50" cy="50" rx="20" ry="45" fill="none" stroke="currentColor" strokeWidth="2" />
              <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M 50 5 L 50 95" stroke="currentColor" strokeWidth="2" />
            </svg>
            <div className="z-10 flex flex-col items-center justify-center mt-2">
              <div className="text-[40px] lg:text-[46px] font-bold text-blue-600 leading-tight">
                {STATS[1].value}
              </div>
              <div className="text-lg text-blue-600 font-medium mt-1">{STATS[1].label}</div>
            </div>
          </div>

          <div className="lg:col-span-1 bg-blue-600 rounded-md p-8 flex flex-col items-center justify-center text-center relative overflow-hidden h-full ">
            <svg
              className="absolute -top-4 -left-4 w-40 h-40 text-white opacity-[0.15] pointer-events-none"
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              <path d="M30 10 H90 V70 H70 V44 L24 90 L10 76 L56 30 H30 V10 Z" />
            </svg>
            <div className="z-10 flex flex-col items-center justify-center mt-2">
              <div className="text-[40px] lg:text-[46px] font-bold text-white leading-tight">
                {STATS[2].value}
              </div>
              <div className="text-[17px] text-white font-medium mt-1 leading-snug">
                {STATS[2].label}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll-left 30s linear infinite;
          width: max-content;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}