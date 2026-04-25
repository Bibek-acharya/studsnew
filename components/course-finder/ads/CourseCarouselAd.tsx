"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Star, MapPin, Calendar, GraduationCap } from "lucide-react";
import { getAdPlacement } from "@/lib/ad-controller";

interface Course {
  title: string;
  subtitle: string;
  rating: string;
  university: string;
  degree: string;
  location: string;
  duration: string;
  logos: { name: string; url: string }[];
}

const courses: Course[] = [
  {
    title: "BSc. CSIT",
    subtitle: "Highly sought-after core computing degree.",
    rating: "4.8+",
    university: "Tribhuvan University",
    degree: "Bachelor's Degree",
    location: "Kathmandu",
    duration: "4 Years (8 Semesters)",
    logos: [
      { name: "KIST College", url: "https://kist.edu.np/resources/assets/img/logo_small.jpg" },
      { name: "Trinity College", url: "https://www.trinity.edu.np/assets/backend/uploads/Logo/trinity%20college%20logo.jpg" },
      { name: "Advance College", url: "https://advancefoundation.edu.np/public/assets/img/logo.jpg" },
    ],
  },
  {
    title: "BCA",
    subtitle: "Application development and software engineering.",
    rating: "4.5+",
    university: "Pokhara University",
    degree: "Bachelor's Degree",
    location: "Pokhara / Ktm",
    duration: "4 Years (8 Semesters)",
    logos: [
      { name: "KIST College", url: "https://kist.edu.np/resources/assets/img/logo_small.jpg" },
      { name: "Trinity College", url: "https://www.trinity.edu.np/assets/backend/uploads/Logo/trinity%20college%20logo.jpg" },
      { name: "Advance College", url: "https://advancefoundation.edu.np/public/assets/img/logo.jpg" },
    ],
  },
  {
    title: "BIT",
    subtitle: "Information technology and network systems.",
    rating: "4.6+",
    university: "Purbanchal University",
    degree: "Bachelor's Degree",
    location: "Biratnagar",
    duration: "4 Years (8 Semesters)",
    logos: [
      { name: "KIST College", url: "https://kist.edu.np/resources/assets/img/logo_small.jpg" },
      { name: "Advance College", url: "https://advancefoundation.edu.np/public/assets/img/logo.jpg" },
      { name: "Trinity College", url: "https://www.trinity.edu.np/assets/backend/uploads/Logo/trinity%20college%20logo.jpg" },
    ],
  },
  {
    title: "BBA",
    subtitle: "Bachelor of Business Administration programs.",
    rating: "4.7+",
    university: "Tribhuvan University",
    degree: "Bachelor's Degree",
    location: "Kathmandu",
    duration: "4 Years (8 Semesters)",
    logos: [
      { name: "Trinity College", url: "https://www.trinity.edu.np/assets/backend/uploads/Logo/trinity%20college%20logo.jpg" },
      { name: "KIST College", url: "https://kist.edu.np/resources/assets/img/logo_small.jpg" },
      { name: "Advance College", url: "https://advancefoundation.edu.np/public/assets/img/logo.jpg" },
    ],
  },
  {
    title: "BIM",
    subtitle: "Bachelor of Information Management programs.",
    rating: "4.4+",
    university: "Tribhuvan University",
    degree: "Bachelor's Degree",
    location: "Kathmandu",
    duration: "4 Years (8 Semesters)",
    logos: [
      { name: "KIST College", url: "https://kist.edu.np/resources/assets/img/logo_small.jpg" },
      { name: "Trinity College", url: "https://www.trinity.edu.np/assets/backend/uploads/Logo/trinity%20college%20logo.jpg" },
      { name: "Advance College", url: "https://advancefoundation.edu.np/public/assets/img/logo.jpg" },
    ],
  },
];

const CourseCarouselAd: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const placement = getAdPlacement("course-carousel");

  if (!placement.enabled) return null;

  const scroll = (direction: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: direction * 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-[#0000ff] rounded-md p-5" style={{ boxShadow: "0 10px 30px rgba(0, 0, 255, 0.2)" }}>
      <div className="flex justify-between items-center mb-4 gap-3 flex-wrap">
        <h2 className="text-lg font-extrabold text-white tracking-tight">
          {placement.headline}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll(-1)}
            className="w-9 h-9 rounded-full bg-white text-[#0000ff] border-none cursor-pointer flex items-center justify-center  hover:bg-gray-50 hover:scale-105 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll(1)}
            className="w-9 h-9 rounded-full bg-white text-[#0000ff] border-none cursor-pointer flex items-center justify-center  hover:bg-gray-50 hover:scale-105 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto" ref={carouselRef} style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        <div className="flex gap-4 pb-3" style={{ scrollSnapType: "x mandatory" }}>
          {(placement.slides?.map((slide) => ({
            title: slide.title,
            subtitle: slide.description || placement.description,
            rating: "4.8+",
            university: "Top partners",
            degree: "Bachelor's Degree",
            location: "Kathmandu",
            duration: "4 Years (8 Semesters)",
            logos: [{ name: slide.title, url: slide.image }],
          })) || courses).map((course, idx) => (
            <div
              key={idx}
              className="bg-white rounded-md p-4 min-w-[220px] max-w-[240px] flex-shrink-0  border border-gray-100 flex flex-col transition-transform hover:-translate-y-1"
              style={{ scrollSnapAlign: "start" }}
            >
              <h3 className="text-[15px] font-bold text-slate-800 mb-1">{course.title}</h3>
              <p className="text-[11px] text-slate-500 leading-snug line-clamp-2 mb-2">
                {course.subtitle}
              </p>

              <div className="flex gap-1.5 mb-2">
                <span className="px-2 py-0.5 rounded-full border border-gray-200 text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {course.rating}
                </span>
                <span className="px-2 py-0.5 rounded-full border border-gray-200 text-[11px] font-semibold text-slate-700 max-w-[120px] truncate">
                  {course.university}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-2 gap-y-2 text-[11px] text-slate-600 font-medium mb-3">
                <div className="flex items-center gap-1 truncate">
                  <GraduationCap className="w-3 h-3 text-slate-400 shrink-0" />
                  {course.degree}
                </div>
                <div className="flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  {course.location}
                </div>
                <div className="col-span-2 flex items-center gap-1 truncate">
                  <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                  {course.duration}
                </div>
              </div>

              <div className="h-px bg-gray-100 my-2" />

              <div className="mt-auto">
                <p className="text-[11px] font-semibold text-slate-500 mb-1.5">Available at:</p>
                <div className="flex gap-1 flex-wrap">
                  {course.logos.map((logo, i) => (
                    <div
                      key={i}
                      className="relative w-6 h-6 rounded-md border border-gray-100 p-0.5 flex items-center justify-center bg-white cursor-pointer group"
                    >
                      <img src={logo.url} alt={logo.name} className="w-full h-full object-contain rounded opacity-80 hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-slate-800 text-white text-[10px] font-semibold px-2 py-1 rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        {logo.name}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseCarouselAd;
