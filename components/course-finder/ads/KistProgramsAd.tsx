"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Star, MapPin, Calendar } from "lucide-react";
import { getAdPlacement } from "@/lib/ad-controller";

interface KistProgram {
  title: string;
  subtitle: string;
  rating: string;
  university: string;
  duration: string;
  location: string;
  logo: string;
}

const programs: KistProgram[] = [
  { title: "BIT in KIST College", subtitle: "Best college for the IT enthusiasts", rating: "4.8/5", university: "Purbanchal Univ", duration: "4 Years (8 Sem)", location: "Kamalpokhari", logo: "https://kist.edu.np/resources/assets/img/logo_small.jpg" },
  { title: "BCA in KIST College", subtitle: "Top choice for future developers", rating: "4.7/5", university: "Purbanchal Univ", duration: "4 Years (8 Sem)", location: "Kamalpokhari", logo: "https://kist.edu.np/resources/assets/img/logo_small.jpg" },
  { title: "BBA in KIST College", subtitle: "Leading business management", rating: "4.9/5", university: "Purbanchal Univ", duration: "4 Years (8 Sem)", location: "Kamalpokhari", logo: "https://kist.edu.np/resources/assets/img/logo_small.jpg" },
  { title: "BIM in KIST College", subtitle: "Information Management", rating: "4.6/5", university: "Tribhuvan Univ", duration: "4 Years (8 Sem)", location: "Kamalpokhari", logo: "https://kist.edu.np/resources/assets/img/logo_small.jpg" },
  { title: "BBM in KIST College", subtitle: "Business Management", rating: "4.8/5", university: "Tribhuvan Univ", duration: "4 Years (8 Sem)", location: "Kamalpokhari", logo: "https://kist.edu.np/resources/assets/img/logo_small.jpg" },
];

const companies = [
  { name: "Leapfrog", bg: "bg-white", logo: "https://www.lftechnology.com/images/lf-logo.svg" },
  { name: "Leapfrog Connect", bg: "bg-[#0b1b3d]", logo: "https://leapfrogconnect.co/svg/header_logo.svg" },
  { name: "Softnep", bg: "bg-white", logo: "https://www.softnep.com/themes/softnep/images/logo.webp" },
  { name: "F1Soft", bg: "bg-black", text: "F1." },
  { name: "Techbit", bg: "bg-white", text: "techbit" },
  { name: "Cotiviti", bg: "bg-white", icon: "blue" },
  { name: "InfoDevs", bg: "bg-white", text: "ID", color: "purple" },
  { name: "EB Pearls", bg: "bg-white", text: "EB" },
  { name: "Microsoft", bg: "bg-white", ms: true },
];

const KistProgramsAd: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const placement = getAdPlacement("course-kist-programs");

  if (!placement.enabled) return null;

  const scroll = (direction: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: direction * 306, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full bg-[#ebfbf1] border border-[#c6f6d5] rounded-[20px] p-5">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <div>
          <h2 className="text-lg md:text-[22px] font-bold text-green-900 tracking-tight leading-snug">
            {placement.headline}
          </h2>
          <p className="text-[13px] text-green-700 font-medium">
            {placement.description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => scroll(-1)} className="w-8 h-8 rounded-full bg-white border border-gray-200  text-gray-600 hover:bg-gray-50 flex items-center justify-center">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => scroll(1)} className="w-8 h-8 rounded-full bg-white border border-gray-200  text-gray-600 hover:bg-gray-50 flex items-center justify-center">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto snap-x snap-mandatory" ref={carouselRef} style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        <div className="flex gap-4 pb-2">
          {programs.map((program, idx) => (
            <div
              key={idx}
              className="w-[290px] flex-shrink-0 bg-white rounded-[16px]  border border-gray-100 p-4 snap-center flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3 gap-2">
                  <div>
                    <h3 className="text-[17px] font-bold text-gray-900 leading-tight tracking-tight mb-0.5">{program.title}</h3>
                    <p className="text-[12px] font-normal text-slate-500">{program.subtitle}</p>
                  </div>
                  <div className="w-10 h-auto flex items-center justify-center flex-shrink-0 bg-white rounded-[6px] p-1 border border-gray-100 ">
                    <img src={program.logo} alt="KIST Logo" className="w-full object-contain rounded-[4px]" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-gray-200 rounded-full text-[11px] font-medium text-slate-700">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {program.rating}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 bg-white border border-gray-200 rounded-full text-[11px] font-medium text-slate-700">
                    {program.university}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 text-[12px] text-slate-600 mb-3">
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="whitespace-nowrap">{program.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{program.location}</span>
                  </div>
                </div>
              </div>

              <div>
                <hr className="border-gray-100 mb-3" />
                <div>
                  <p className="text-[11px] font-medium text-slate-500 mb-1.5 uppercase tracking-wider">MOU Companies</p>
                  <div className="flex flex-wrap gap-1.5">
                    {companies.slice(0, 6).map((company, i) => (
                      <div
                        key={i}
                        className={`group relative flex-shrink-0 w-8 h-[28px] rounded-[4px] border border-gray-200 flex items-center justify-center cursor-pointer ${company.bg}`}
                      >
                        {company.logo && <img src={company.logo} alt={company.name} className="w-full h-full object-contain p-1" />}
                        {company.text && (
                          <span className={`font-medium text-[9px] ${company.color === "purple" ? "text-purple-700 italic font-bold" : "text-gray-800"}`}>
                            {company.text}
                          </span>
                        )}
                        {company.icon === "blue" && (
                          <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                          </svg>
                        )}
                        {company.ms && (
                          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
                            <path fill="#f25022" d="M2 2h9v9H2z" />
                            <path fill="#7fba00" d="M13 2h9v9h-9z" />
                            <path fill="#00a4ef" d="M2 13h9v9H2z" />
                            <path fill="#ffb900" d="M13 13h9v9h-9z" />
                          </svg>
                        )}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center pointer-events-none z-50">
                          <div className="bg-gray-800 text-white text-[10px] font-medium px-2 py-0.5 rounded-[4px] whitespace-nowrap">
                            {company.name}
                          </div>
                          <div className="w-1.5 h-1.5 bg-gray-800 transform rotate-45 -mt-[3px]"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KistProgramsAd;
