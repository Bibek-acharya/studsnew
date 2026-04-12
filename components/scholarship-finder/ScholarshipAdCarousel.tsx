"use client";

import React, { useRef, useState, useEffect } from "react";
import { MapPin, Calendar, ChevronLeft, ChevronRight, BadgeCheck } from "lucide-react";

export interface CollegeScholarship {
  id: string | number;
  title: string;
  location: string;
  type: string;
  eligibility: string;
  deadline: string;
  imageUrl: string;
  logoUrl: string;
  onApply?: () => void;
}

interface ScholarshipCarouselProps {
  title: string;
  scholarships: CollegeScholarship[];
  backgroundColor?: string;
}

const ScholarshipCarouselCard: React.FC<{
  scholarship: CollegeScholarship;
}> = ({ scholarship }) => (
  <div className="bg-white rounded-xl border border-gray-200 min-w-70 w-70 flex-none flex flex-col relative snap-start  transition-shadow group">
    <div className="relative h-30 w-full flex-none p-3 pointer-events-none">
      <img 
        src={scholarship.imageUrl} 
        alt="College Campus" 
        className="w-full h-full object-cover rounded-md" 
        draggable={false}
      />
    </div>
    <div className="absolute top-21.5 left-5 bg-white p-1 rounded-md border border-gray-100 h-12 w-12 flex items-center justify-center z-10 overflow-hidden pointer-events-none">
      <img 
        src={scholarship.logoUrl} 
        alt="Logo" 
        className="w-full h-full object-contain rounded-sm bg-white" 
        draggable={false}
      />
    </div>
    
    <div className="px-4 pb-4 pt-5 flex flex-col grow">
      <h3 className="group/title relative text-[17px] font-bold text-gray-900 leading-snug mb-1 flex items-center gap-1 w-full">
        <span className="truncate hover:text-blue-600 cursor-pointer transition-colors">{scholarship.title}</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0040ff" className="w-4.5 h-4.5 shrink-0">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
        </svg>
      </h3>
      <p className="text-[13px] text-gray-500 mb-3 flex items-center gap-1">
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        {scholarship.location}
      </p>
      
      <div className="space-y-1.5 mb-1">
        <p className="text-gray-700 text-[13px] flex items-start gap-1.5">
          <svg className="w-3.5 h-3.5 text-gray-400 mt-0.75 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
          </svg>
          <span><span className="font-medium text-gray-900">Type:</span> {scholarship.type}</span>
        </p>
        <p className="text-gray-700 text-[13px] flex items-start gap-1.5">
          <svg className="w-3.5 h-3.5 text-green-500 mt-0.75 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span><span className="font-medium text-gray-900">Eligibility:</span> {scholarship.eligibility}</span>
        </p>
        <p className="text-red-600 text-[13px] font-medium flex items-start gap-1.5 pt-0.5">
          <svg className="w-3.5 h-3.5 text-red-500 mt-0.75 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <span>Deadline: {scholarship.deadline}</span>
        </p>
      </div>
      
      <div className="mt-auto pt-4 border-t border-gray-100/60">
        <button className="text-blue-600 text-[15px] font-medium inline-flex items-center gap-1.5 hover:text-blue-800 transition-colors">
          Apply Now 
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5">
            <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"/>
            <path d="m21 3-9 9"/>
            <path d="M15 3h6v6"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
);

export const ScholarshipBasedOnCollege: React.FC<{ scholarships?: CollegeScholarship[] }> = ({ 
  scholarships 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const defaultScholarships: CollegeScholarship[] = [
    {
      id: 1,
      title: "KIST Excellence Award",
      location: "Maitighar, Kathmandu",
      type: "100% Tuition Waiver",
      eligibility: "SEE GPA 3.8+",
      deadline: "15 July 2026",
      imageUrl: "https://kist-edu-np.s3.ap-south-1.amazonaws.com/uploads/album/value/aeddff223a6b322bbcb719e0a160a721505040b71741944808.jpg",
      logoUrl: "https://kist.edu.np/resources/assets/img/logo_small.jpg",
    },
    {
      id: 2,
      title: "Global Mgmt Scholarship",
      location: "Mid-Baneshwor, Kathmandu",
      type: "Merit-based (Top 10)",
      eligibility: "SEE GPA 3.8+",
      deadline: "20 July 2026",
      imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=500&q=80",
      logoUrl: "https://ui-avatars.com/api/?name=GC&background=f17116&color=fff&font-size=0.4",
    },
    {
      id: 3,
      title: "Trinity A-Levels Scholarship",
      location: "Dillibazar, Kathmandu",
      type: "Need & Merit Based",
      eligibility: "SEE B+ Grade Min",
      deadline: "10 August 2026",
      imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&q=80",
      logoUrl: "https://ui-avatars.com/api/?name=TC&background=0000ff&color=fff&font-size=0.4",
    },
    {
      id: 4,
      title: "St. Xavier's Scholarship",
      location: "Maitighar, Kathmandu",
      type: "Full Tuition",
      eligibility: "SEE GPA 4.0 & Topper",
      deadline: "30 July 2026",
      imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=500&q=80",
      logoUrl: "https://ui-avatars.com/api/?name=SXC&background=000000&color=fff&font-size=0.4",
    },
    {
      id: 5,
      title: "Prasadi Science Scholarship",
      location: "Lalitpur, Nepal",
      type: "Merit-Based Partial",
      eligibility: "SEE GPA 3.8+",
      deadline: "25 July 2026",
      imageUrl: "https://images.unsplash.com/photo-1541829070757-228707e53f1f?w=500&q=80",
      logoUrl: "https://ui-avatars.com/api/?name=PA&background=047857&color=fff&font-size=0.4",
    },
    {
      id: 6,
      title: "NIST Excellence Award",
      location: "Lainchaur, Kathmandu",
      type: "100% Tuition Waiver",
      eligibility: "SEE GPA 3.6+",
      deadline: "12 August 2026",
      imageUrl: "https://images.unsplash.com/photo-1564069114553-7215e1ff1890?w=500&q=80",
      logoUrl: "https://ui-avatars.com/api/?name=NT&background=8b5cf6&color=fff&font-size=0.4",
    },
  ];

  const items = scholarships || defaultScholarships;

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDown(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => {
    setIsDown(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="bg-blue-100 w-full max-w-6xl p-6 md:p-8 rounded-lg border border-blue-100 shadow-sm">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Sponsored College Based Scholarship</h2>
          <p className="text-gray-600 mt-2 text-sm md:text-base">Explore specific scholarship programs from top institutions.</p>
        </div>
        <div className="hidden md:flex gap-2">
          <button 
            onClick={() => handleScroll('left')}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <button 
            onClick={() => handleScroll('right')}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="relative w-full">
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory cursor-grab items-stretch scrollbar-hide"
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((scholarship) => (
            <ScholarshipCarouselCard key={scholarship.id} scholarship={scholarship} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const RecommendedScholarship: React.FC<{ scholarships?: CollegeScholarship[] }> = ({ 
  scholarships 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const defaultScholarships: CollegeScholarship[] = [
    {
      id: 1,
      title: "KIST Excellence Scholarship",
      location: "Maitighar, Kathmandu",
      type: "100% Tuition Fee Waiver",
      eligibility: "SEE GPA 3.6+",
      deadline: "15 July 2026",
      imageUrl: "https://kist-edu-np.s3.ap-south-1.amazonaws.com/uploads/album/value/aeddff223a6b322bbcb719e0a160a721505040b71741944808.jpg",
      logoUrl: "https://kist.edu.np/resources/assets/img/logo_small.jpg",
    },
    {
      id: 2,
      title: "Global Mgmt Scholarship",
      location: "Mid-Baneshwor, Kathmandu",
      type: "Merit-based (Top 10)",
      eligibility: "SEE GPA 3.8+",
      deadline: "20 July 2026",
      imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=500&q=80",
      logoUrl: "https://ui-avatars.com/api/?name=GC&background=f17116&color=fff&font-size=0.4",
    },
    {
      id: 3,
      title: "Trinity A-Levels Scholarship",
      location: "Dillibazar, Kathmandu",
      type: "Need & Merit Based",
      eligibility: "SEE B+ Grade Min",
      deadline: "10 August 2026",
      imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&q=80",
      logoUrl: "https://ui-avatars.com/api/?name=TC&background=0000ff&color=fff&font-size=0.4",
    },
    {
      id: 4,
      title: "St. Xavier's Scholarship",
      location: "Maitighar, Kathmandu",
      type: "Full Scholarship",
      eligibility: "SEE GPA 4.0 & Top Score",
      deadline: "30 July 2026",
      imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=500&q=80",
      logoUrl: "https://ui-avatars.com/api/?name=SXC&background=000000&color=fff&font-size=0.4",
    },
    {
      id: 5,
      title: "Prasadi Science Scholarship",
      location: "Lalitpur, Nepal",
      type: "Merit-Based Partial",
      eligibility: "SEE GPA 3.8+",
      deadline: "25 July 2026",
      imageUrl: "https://images.unsplash.com/photo-1541829070757-228707e53f1f?w=500&q=80",
      logoUrl: "https://ui-avatars.com/api/?name=PA&background=047857&color=fff&font-size=0.4",
    },
    {
      id: 6,
      title: "NIST Excellence Award",
      location: "Lainchaur, Kathmandu",
      type: "100% Tuition Waiver",
      eligibility: "SEE GPA 3.6+",
      deadline: "12 August 2026",
      imageUrl: "https://images.unsplash.com/photo-1564069114553-7215e1ff1890?w=500&q=80",
      logoUrl: "https://ui-avatars.com/api/?name=NT&background=8b5cf6&color=fff&font-size=0.4",
    },
  ];

  const items = scholarships || defaultScholarships;

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDown(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => {
    setIsDown(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="bg-[#fef7f0] w-full max-w-6xl p-6 md:p-8 rounded-lg border border-orange-50/50 shadow-sm">
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Recommended Scholarships for You</h2>
        <div className="hidden md:flex gap-2">
          <button 
            onClick={() => handleScroll('left')}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <button 
            onClick={() => handleScroll('right')}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="relative w-full">
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory cursor-grab items-stretch scrollbar-hide"
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((scholarship) => (
            <ScholarshipCarouselCard key={scholarship.id} scholarship={scholarship} />
          ))}
        </div>
      </div>
    </div>
  );
};