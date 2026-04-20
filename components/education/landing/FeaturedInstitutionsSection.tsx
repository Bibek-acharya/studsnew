"use client";

import { useState } from "react";
import { Star, MapPin, Award, MessageSquare, Bookmark, BadgeCheckIcon, Globe } from "lucide-react";
import { College } from "@/services/api";

interface FeaturedInstitutionsSectionProps {
  onNavigate: (view: string, data?: any) => void;
  featuredColleges?: College[];
}

const FeaturedInstitutionsSection: React.FC<FeaturedInstitutionsSectionProps> = ({ onNavigate, featuredColleges = [] }) => {
  const [bookmarked, setBookmarked] = useState<Set<string | number>>(new Set());

  const colleges = featuredColleges.length
    ? featuredColleges
    : [
      {
        id: 1,
        name: "KIST College & SS",
        image_url: "https://www.collegenp.com/uploads/2025/02/kist-college-building.jpg",
        rating: 4.5,
        type: "Private",
        location: "Kamalpokhari",
        description: "The Institute of Engineering (IOE) entrance exam is tough. Learn the strategies, tips, and tricks to crack the exam with our expert guidance and comprehensive study materials. Get personalized counselling and find the right program for your career goals.",
        affiliation: "NEB, Tribhuwan University, Purbanchal University",
        website: "https://kist.edu.np"
      },
      {
        id: 2,
        name: "Islington College",
        image_url: "https://kist-edu-np.s3.ap-south-1.amazonaws.com/uploads/album/value/e71ee13b2c733ac02f8709c49f3677c3d0f2d9d01766569944.jpg",
        rating: 4.3,
        type: "Private",
        location: "Kamalpokhari",
        description: "Leading IT and business education institution affiliated with London Metropolitan University. Offering internationally recognized programs with modern facilities and industry connections.",
        affiliation: "London Metropolitan University, CTEVT",
        website: "https://islington.edu.np"
      },
      {
        id: 3,
        name: "Kathmandu University",
        image_url: "https://www.collegenp.com/uploads/2025/02/kist-college-building.jpg",
        rating: 4.7,
        type: "Public",
        location: "Dhulikhel",
        description: "Premier autonomous university known for engineering, science, and management programs. Ranked among the top universities in Nepal with world-class research facilities.",
        affiliation: "Kathmandu University (Autonomous)",
        website: "https://ku.edu.np"
      },
      {
        id: 4,
        name: "NAMI College",
        image_url: "https://www.collegenp.com/uploads/2025/02/kist-college-building.jpg",
        rating: 4.2,
        type: "Private",
        location: "Lainchaur",
        description: "Specialized in healthcare and management education with hands-on clinical training. Partnered with leading hospitals for practical experience and job placement support.",
        affiliation: "Tribhuvan University, CTEVT",
        website: "https://nami.edu.np"
      }
    ];

  const toggleBookmark = (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation();
    setBookmarked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="mt-4 sm:mt-8 md:mt-12 lg:mt-16 w-full">
      <div className="max-w-350 mx-auto w-full">
      <div className="text-center mb-8 sm:mb-10 md:mb-12">
        <h2 className="text-[26px] xs:text-[30px] sm:text-3xl md:text-[36px] lg:text-[40px] font-bold text-[#111827] mb-2 sm:mb-3 tracking-tight px-2">
          Explore Featured Colleges & Universities
        </h2>
        <p className="text-[15px] sm:text-[16px] md:text-[17px] text-[#6b7280] max-w-3xl mx-auto leading-relaxed px-2">
          Compare top-rated programs and find the perfect institution for your academic future.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
        {colleges.map((college) => (
          <CollegeCard
            key={college.id}
            college={college}
            isBookmarked={bookmarked.has(college.id)}
            onNavigate={onNavigate}
            onToggleBookmark={toggleBookmark}
          />
        ))}
      </div>
      </div>
    </section>
  );
};

const CollegeCard: React.FC<{
  college: College;
  isBookmarked: boolean;
  onNavigate: (view: string, data?: any) => void;
  onToggleBookmark: (e: React.MouseEvent, id: string | number) => void;
}> = ({ college, isBookmarked, onNavigate, onToggleBookmark }) => {
  const hasLongDescription = (college.description?.length ?? 0) > 80;

  return (
    <div
      className="bg-white rounded-md p-4 border border-gray-100 flex flex-col h-full hover:border-blue-500/20 transition-all duration-300 cursor-pointer"
      onClick={() => onNavigate("collegeDetails", college)}
    >
      <div className="w-full h-30 rounded-md overflow-hidden mb-4 relative">
        <div className="absolute top-3 left-3 bg-brand-blue text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider z-10 ">
          Featured
        </div>
        <img
          src={college.image_url}
          alt={college.name}
          className="w-full h-full object-cover"
          onError={(e: any) => { e.target.src = 'https://placehold.co/600x400/f1f5f9/94a3b8?text=Image+Unavailable' }}
        />
      </div>

      <div className="flex items-center gap-1.5 mb-2">
        <h2
          className="text-[20px] font-bold text-slate-800 tracking-tight hover:text-blue-600 transition-colors line-clamp-1"
          onClick={(e) => e.stopPropagation()}
        >
          {college.name}
        </h2>
        <BadgeCheckIcon className="w-5 h-5 text-white fill-blue-500 shrink-0" />
      </div>

      <div className="flex items-center text-[14px] text-gray-500 mb-2">
        <div className="flex items-center gap-1 font-bold text-slate-700">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>{college.rating || "4.5"}</span>
        </div>
        <span className="mx-3 text-gray-300 font-light">|</span>
        <div className="flex items-center gap-1.5">
          <Award className="w-4.5 h-4.5 text-gray-400" />
          <span className="font-semibold text-slate-700">{college.type || "Private"}</span>
        </div>
        <span className="mx-3 text-gray-300 font-light">|</span>
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4.5 h-4.5 text-gray-400" />
          <span className="font-semibold text-slate-700">{college.location || "Kathmandu"}</span>
        </div>
      </div>

      <div className="flex items-start gap-2 text-[14px] text-gray-500 mb-2">
        <Award className="w-4.5 h-4.5 text-gray-400 shrink-0 mt-0.75" />
        <p className="leading-snug pr-4 font-semibold text-slate-700 line-clamp-1">
          {college.affiliation || "Tribhuvan University"}
        </p>
      </div>

      {college.website && (
        <div className="flex items-center gap-2 text-[14px] text-gray-500 mb-3">
          <Globe className="w-4.5 h-4.5 text-gray-400 shrink-0" />
          <a
            href={college.website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-blue-600 hover:underline font-medium truncate"
          >
            {college.website.replace(/^https?:\/\//, "")}
          </a>
        </div>
      )}

      <div className="flex flex-col gap-3 mt-auto">
     

        <div className="flex gap-2">
          <button className="bg-brand-blue flex-1 flex items-center justify-center gap-1.5 border border-gray-200 hover:bg-brand-hover text-white font-medium py-2 px-2 rounded-md transition-colors text-[13px] cursor-pointer" onClick={(e) => { e.stopPropagation(); onNavigate("collegeDetails", college); }}>
            View Detail
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-slate-600 font-medium py-2 px-2 rounded-md transition-colors text-[13px]"
            onClick={(e) => { e.stopPropagation(); onNavigate("campusForum", { collegeId: college.id, collegeName: college.name }); }}
          >
            <MessageSquare className="w-4 h-4 text-gray-500" />
            Inquiry
          </button>
          <button
            className={`w-10 flex items-center justify-center border rounded-md transition-colors shrink-0 ${
              isBookmarked
                ? "border-blue-50 bg-blue-50"
                : "border-gray-200 hover:bg-gray-50"
            }`}
            title={isBookmarked ? "Remove Bookmark" : "Bookmark"}
            onClick={(e) => onToggleBookmark(e, college.id)}
          >
            <Bookmark className={`w-4 h-4 transition-all ${isBookmarked ? "text-[#0000ff] fill-[#0000ff]" : "text-gray-400"}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedInstitutionsSection;
