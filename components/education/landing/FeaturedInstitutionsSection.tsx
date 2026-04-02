"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Star, MapPin, Award, MessageSquare, ArrowRightLeft, Heart, BadgeCheckIcon } from "lucide-react";

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
    // Prototype data
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
    <section className="mt-4 w-full">
      <div className="max-w-[1400px] mx-auto w-full">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h2 className="text-[32px] md:text-[40px] font-bold text-[#111827] mb-3 tracking-tight">
          Explore Featured Colleges & Universities
        </h2>
        <p className="text-[17px] text-[#6b7280] max-w-3xl mx-auto leading-relaxed">
          Compare top-rated programs and find the perfect institution for your academic future.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredColleges.map((college) => (
          <div 
            key={college.id} 
            className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col h-full hover:shadow-lg transition-all duration-300 group cursor-pointer"
            onClick={() => onNavigate("collegeDetails", college)}
          >
            {/* Image */}
            <div className="w-full h-44 rounded-xl overflow-hidden mb-5 bg-gray-50 relative">
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
              <div className="flex items-center gap-1.5 mb-2.5">
                <h3 className="text-[18px] font-bold text-[#111827] group-hover:text-[#2563eb] transition-colors line-clamp-1">
                  {college.name}
                </h3>
                <BadgeCheckIcon className="w-[15px] h-[15px] text-white fill-blue-500 ml-1" />
              </div>

              {/* Meta Info 1 */}
              <div className="flex items-center text-[13px] text-[#6b7280] gap-2 mb-2">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-[#f59e0b] fill-current" />
                  <span className="font-bold text-[#374151]">{college.rating || "4.5"}</span>
                </div>
                <span className="text-gray-300">|</span>
                <div className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>{college.type || "Private"}</span>
                </div>
                <span className="text-gray-300">|</span>
                <div className="flex items-center gap-1 truncate">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{college.location || "Kamalpokhari"}</span>
                </div>
              </div>

              {/* Meta Info 2 */}
              <div className="flex items-start gap-1.5 text-[13px] text-[#6b7280] mb-3.5">
                < Award className="w-[15px] h-[15px] shrink-0 mt-[2px]" />
                <span className="leading-relaxed line-clamp-2">{college.affiliation || "NEB, Tribhuwan University, Purbanchal University"}</span>
              </div>

              {/* Description */}
              <p className="text-[13.5px] text-[#6b7280] leading-[1.6] line-clamp-2">
                {college.description || "Top rated institution offering diverse programs with excellent academic standards."}
              </p>
            </div>

            {/* Footer / Actions */}
            <div className="mt-auto pt-1">
              <div className="border-t border-dotted border-gray-200 my-4"></div>
              
              <button className="w-full bg-[#2563eb] hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors mb-2.5">
                Get counselling
              </button>
              
              <div className="flex items-center gap-2">
                <button className="flex-1 border border-[#e5e7eb] hover:bg-gray-50 text-[#4b5563] font-medium py-2 rounded-lg text-[13px] flex items-center justify-center gap-1.5 transition-colors">
                  <MessageSquare className="w-[15px] h-[15px]" />
                  Ask a question
                </button>
                <button className="flex-[0.9] bg-[#eab308] hover:bg-yellow-500 text-white font-medium py-2 rounded-lg text-[13px] transition-colors">
                  Compare now
                </button>
                <button 
                  className="flex-none border border-[#e5e7eb] hover:bg-gray-50 text-gray-400 w-9 h-[38px] rounded-lg flex items-center justify-center transition-colors hover:text-red-500 group/heart"
                  onClick={(e) => { e.stopPropagation(); }}
                >
                  <Heart className="w-4 h-4 group-hover/heart:fill-current" />
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
