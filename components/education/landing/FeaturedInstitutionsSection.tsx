"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Star, MapPin, Award, MessageSquare, ArrowRightLeft, Bookmark, BadgeCheckIcon } from "lucide-react";

interface College {
  id: string | number;
  name: string;
  image_url: string;
  rating?: string | number;
  location?: string;
  affiliation?: string;
  description?: string;
  type?: string;
}

interface FeaturedInstitutionsSectionProps {
  onNavigate: (view: string, data?: any) => void;
}

const FeaturedInstitutionsSection: React.FC<FeaturedInstitutionsSectionProps> = ({ onNavigate }) => {
  const [featuredColleges, setFeaturedColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setFeaturedColleges([
      {
        id: 1,
        name: "KIST College & SS",
        image_url: "https://www.collegenp.com/uploads/2025/02/kist-college-building.jpg",
        rating: "4.5",
        type: "Private",
        location: "Kamalpokhari",
        description: "The Institute of Engineering (IOE) entrance exam is tough. Learn the strategies,",
        affiliation: "NEB, Tribhuwan University, Purbanchal University"
      },
      {
        id: 2,
        name: "KIST College & SS",
        image_url: "https://kist-edu-np.s3.ap-south-1.amazonaws.com/uploads/album/value/e71ee13b2c733ac02f8709c49f3677c3d0f2d9d01766569944.jpg",
        rating: "4.5",
        type: "Private",
        location: "Kamalpokhari",
        description: "The Institute of Engineering (IOE) entrance exam is tough. Learn the strategies,",
        affiliation: "NEB, Tribhuwan University, Purbanchal University"
      },
      {
        id: 3,
        name: "KIST College & SS",
        image_url: "https://www.collegenp.com/uploads/2025/02/kist-college-building.jpg",
        rating: "4.5",
        type: "Private",
        location: "Kamalpokhari",
        description: "The Institute of Engineering (IOE) entrance exam is tough. Learn the strategies,",
        affiliation: "NEB, Tribhuwan University, Purbanchal University"
      },
      {
        id: 4,
        name: "KIST College & SS",
        image_url: "https://www.collegenp.com/uploads/2025/02/kist-college-building.jpg",
        rating: "4.5",
        type: "Private",
        location: "Kamalpokhari",
        description: "The Institute of Engineering (IOE) entrance exam is tough. Learn the strategies,",
        affiliation: "NEB, Tribhuwan University, Purbanchal University"
      }
    ]);
    setLoading(false);
  }, []);

  if (loading) return null;

  return (
    <section className="mt-4 sm:mt-8 md:mt-12 lg:mt-16 w-full">
      <div className="max-w-[1400px] mx-auto w-full px-3 sm:px-4 md:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-10 md:mb-12">
        <h2 className="text-[26px] xs:text-[30px] sm:text-3xl md:text-[36px] lg:text-[40px] font-bold text-[#111827] mb-2 sm:mb-3 tracking-tight px-2">
          Explore Featured Colleges & Universities
        </h2>
        <p className="text-[15px] sm:text-[16px] md:text-[17px] text-[#6b7280] max-w-3xl mx-auto leading-relaxed px-2">
          Compare top-rated programs and find the perfect institution for your academic future.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
        {featuredColleges.map((college) => (
          <div 
            key={college.id} 
            className="bg-white rounded-2xl p-3.5 sm:p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col h-full hover:shadow-lg transition-all duration-300 group cursor-pointer"
            onClick={() => onNavigate("collegeDetails", college)}
          >
            {/* Image */}
            <div className="w-full h-36 xs:h-40 sm:h-44 rounded-xl overflow-hidden mb-4 sm:mb-5 bg-gray-50 relative">
              <img 
                src={college.image_url} 
                alt={college.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e: any) => { e.target.src='https://placehold.co/600x400/f1f5f9/94a3b8?text=Image+Unavailable' }}
              />
            </div>
            
            {/* Content */}
            <div className="flex-grow">
              {/* Title */}
              <div className="flex items-center gap-1.5 mb-2 sm:mb-2.5">
                <h3 className="text-[16px] sm:text-[17px] md:text-[18px] font-bold text-[#111827] group-hover:text-[#2563eb] transition-colors line-clamp-1">
                  {college.name}
                </h3>
                <BadgeCheckIcon className="w-[13px] h-[13px] sm:w-[14px] sm:h-[14px] md:w-[15px] md:h-[15px] text-white fill-blue-500 ml-0.5 sm:ml-1 shrink-0" />
              </div>

              {/* More Compact Details Box */}
              <div className="bg-[#f8fafc] rounded-lg sm:rounded-xl p-2 sm:p-2.5 flex flex-col gap-1.5 sm:gap-2 mt-auto border border-[#f1f5f9]">
                <div className="flex items-center gap-2 sm:gap-2.5 text-[11px] xs:text-[12px] sm:text-[13px] text-[#475569]">
                  <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#f59e0b] fill-current shrink-0" />
                  <span className="font-bold text-[#374151]">{college.rating || "4.5"} Rating</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-2.5 text-[11px] xs:text-[12px] sm:text-[13px] text-[#475569]">
                  <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#94a3b8] shrink-0" />
                  <span className="truncate">{college.affiliation || "NEB, Tribhuwan University"}</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-2.5 text-[11px] xs:text-[12px] sm:text-[13px] text-[#475569]">
                  <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#94a3b8] shrink-0" />
                  <span className="truncate">{college.location || "Kamalpokhari, Kathmandu"}</span>
                </div>
              </div>
            </div>

            {/* Footer / Actions */}
              {/* Restored Previous Button Structure with New Design */}
              <div className="mt-3 sm:mt-4 pt-1 flex flex-col gap-2 sm:gap-2.5">
                <button className="w-full bg-[#0000FF] hover:bg-[#0000CC] text-white font-semibold py-2 sm:py-2.5 rounded-lg text-[12px] sm:text-sm transition-colors">
                  Get counselling
                </button>
                
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button className="flex-1 border border-[#e2e8f0] bg-white hover:bg-gray-50 text-[#475569] font-semibold py-1.5 sm:py-2 rounded-lg text-[11px] xs:text-[12px] flex items-center justify-center gap-1 sm:gap-1.5 transition-colors">
                    <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#94a3b8]" />
                    <span>Ask</span>
                  </button>
                  <button className="flex-[0.9] bg-[#eab308] hover:bg-yellow-500 text-white font-semibold py-1.5 sm:py-2 rounded-lg text-[11px] xs:text-[12px] transition-colors">
                    Compare
                  </button>
                  <button 
                    className="w-[36px] sm:w-[38px] shrink-0 bg-white border border-[#e2e8f0] text-[#94a3b8] rounded-lg flex items-center justify-center h-[34px] sm:h-[38px] hover:bg-[#f8fafc] hover:text-[#64748b] transition-all duration-200"
                    aria-label="Bookmark"
                    onClick={(e) => { e.stopPropagation(); }}
                  >
                    <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
};

export default FeaturedInstitutionsSection;
