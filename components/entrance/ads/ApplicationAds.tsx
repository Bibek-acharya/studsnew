"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";

interface College {
  id: number;
  name: string;
  location: string;
  tagline: string;
  description: string;
  imageUrl: string;
  logoUrl: string;
  applyLink: string;
}

const colleges: College[] = [
  {
    id: 1,
    name: "KIST Higher Secondary School",
    location: "Maitighar, Kathmandu",
    tagline: "Top MBBS/BE Entrances",
    description: "100% Pass Rate in NEB",
    imageUrl:
      "https://kist-edu-np.s3.ap-south-1.amazonaws.com/uploads/album/value/aeddff223a6b322bbcb719e0a160a721505040b71741944808.jpg",
    logoUrl: "https://kist.edu.np/resources/assets/img/logo_small.jpg",
    applyLink: "#",
  },
  {
    id: 2,
    name: "St. Xavier's College",
    location: "Maitighar, Kathmandu",
    tagline: "Exceptional Science Faculty",
    description: "Legacy of Excellence",
    imageUrl:
      "https://images.unsplash.com/photo-1562774053-701939374585?w=500&q=80",
    logoUrl: "https://ui-avatars.com/api/?name=SXC&background=000000&color=fff&font-size=0.4",
    applyLink: "#",
  },
  {
    id: 3,
    name: "Kathmandu Model College",
    location: "Bagbazar, Kathmandu",
    tagline: "Top Management Results",
    description: "Modern Infrastructure",
    imageUrl:
      "https://images.unsplash.com/photo-1525926476834-f8b225881c1c?w=500&q=80",
    logoUrl: "https://ui-avatars.com/api/?name=KMC&background=ff0000&color=fff&font-size=0.4",
    applyLink: "#",
  },
  {
    id: 4,
    name: "Prasadi Academy",
    location: "Lalitpur, Nepal",
    tagline: "Strict Academic Discipline",
    description: "Outstanding Board Results",
    imageUrl:
      "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=500&q=80",
    logoUrl: "https://ui-avatars.com/api/?name=PA&background=008000&color=fff&font-size=0.4",
    applyLink: "#",
  },
];

const VerifiedIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="#0040ff"
    className={className}
  >
    <path
      stroke="none"
      d="M0 0h24v24H0z"
      fill="none"
    />
    <path d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
  </svg>
);

const LocationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const ArrowRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
    <path d="m21 3-9 9" />
    <path d="M15 3h6v6" />
  </svg>
);

const CollegeApplicationCard: React.FC<{ college: College }> = ({ college }) => (
  <div className="bg-white rounded-md border border-gray-200 min-w-70 w-70 flex-none flex flex-col relative overflow-hidden snap-start transition-shadow group">
    <div className="relative h-37.5 w-full flex-none p-3">
      <img
        src={college.imageUrl}
        alt="College Campus"
        className="w-full h-full object-cover rounded-md"
        draggable={false}
      />
    </div>
    <div className="absolute top-28.5 left-5 bg-white rounded-md  h-12 w-12 flex items-center justify-center z-10 overflow-hidden">
      <img
        src={college.logoUrl}
        alt="Logo"
        className="w-full h-full object-contain rounded-sm bg-white"
        draggable={false}
      />
    </div>

    <div className="px-4 pb-4 pt-8 flex flex-col grow">
      <h3 className="group/title relative text-[17px] font-bold text-gray-900 leading-snug mb-1 flex items-center gap-1 w-full">
        <span className="truncate hover:text-blue-600 cursor-pointer transition-colors">
          {college.name}
        </span>
        <VerifiedIcon className="w-4.5 h-4.5 shrink-0" />
        <div className="absolute bottom-full left-0 mb-2 invisible opacity-0 group-hover/title:visible group-hover/title:opacity-100 bg-gray-900 text-white text-[13px] font-medium py-1.5 px-3 rounded  whitespace-nowrap transition-all duration-200 z-50 pointer-events-none">
          {college.name}
          <div className="absolute top-full left-4 -mt-px border-[5px] border-transparent border-t-gray-900"></div>
        </div>
      </h3>
      <p className="text-[13px] text-gray-500 mb-3 flex items-center gap-1">
        <LocationIcon className="w-3.5 h-3.5 shrink-0" />
        {college.location}
      </p>

      <p className="text-[#0000ff] text-[14px] font-medium mb-1">
        {college.tagline}
      </p>
      <p className="text-gray-700 text-[13px]">{college.description}</p>

      <div className="mt-auto pt-4">
        <a
          href={college.applyLink}
          className="text-blue-600 text-[15px] font-medium inline-flex items-center gap-1.5 hover:text-blue-800 transition-colors"
        >
          Apply Now
          <ArrowRightIcon className="w-4.5 h-4.5" />
        </a>
      </div>
    </div>
  </div>
);

export const ApplicationAds: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDown(true);
    setStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => {
    setIsDown(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  return (
    <div className="bg-[#fef7f0] w-full max-w-6xl p-6 md:p-8 rounded-md border border-orange-50/50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          College Application Forms 2026 (+2 & A-Levels)
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (containerRef.current) {
                containerRef.current.scrollBy({ left: -300, behavior: "smooth" });
              }
            }}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => {
              if (containerRef.current) {
                containerRef.current.scrollBy({ left: 300, behavior: "smooth" });
              }
            }}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative w-full">
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory cursor-grab active:cursor-grabbing items-stretch"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {colleges.map((college) => (
            <CollegeApplicationCard key={college.id} college={college} />
          ))}
        </div>
      </div>
    </div>
  );
};