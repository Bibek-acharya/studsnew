"use client";

import { useState, useEffect } from "react";
import { Bookmark, MapPin, GraduationCap, Calendar, Building, CheckCircle2, BadgeCheckIcon } from "lucide-react";

interface FinancialAidSectionProps {
  onNavigate: (view: string, data?: any) => void;
}

const FinancialAidSection: React.FC<FinancialAidSectionProps> = ({ onNavigate }) => {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setScholarships([
      { id: 1, title: "National IT Excellence Scholarship (BSc. CSIT)", provider: "Tribhuvan University, Nepal", type: "MERIT-BASED", status: "Open", amount: "100% Tuition", location: "Bagmati", eligibility: "Bachelor (+2 Sci: 2.8+ GPA)", deadline: "Aug 15, 2026", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop" },
      { id: 2, title: "STEM Women Scholars Award", provider: "Kathmandu University", type: "MERIT-BASED", status: "Open", amount: "75% Scholarship", location: "Province 3", eligibility: "Female Students (3.0+ GPA)", deadline: "Sep 20, 2026", image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop" },
      { id: 3, title: "Social Impact Leadership Grant", provider: "Social Welfare Board", type: "NEED-BASED", status: "Closing", amount: "NRs. 50,000", location: "National", eligibility: "Community Service Record", deadline: "Jul 30, 2026", image: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?q=80&w=600&auto=format&fit=crop" },
      { id: 4, title: "Future Educators Excellence Fund", provider: "Tribhuvan University", type: "MERIT-BASED", status: "Open", amount: "Full Ride", location: "Bagmati", eligibility: "Education Majors", deadline: "Oct 05, 2026", image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop" }
    ]);
    setLoading(false);
  }, []);

  if (loading) return null;

  return (
    <section className="mt-16 sm:mt-20 md:mt-24 w-full">
      <div className="max-w-[1400px] mx-auto w-full px-3 sm:px-4 md:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-10 md:mb-12">
        <h2 className="text-[26px] xs:text-3xl sm:text-4xl font-extrabold text-[#0f172a] mb-3 sm:mb-4 tracking-tight px-2">Featured Financial Aid</h2>
        <p className="text-[14px] sm:text-[15px] md:text-[16px] text-[#64748b] max-w-2xl mx-auto leading-relaxed px-2">
          Discover scholarships, grants, and financial support options to fund your academic journey.
        </p>
      </div>

      {/* Grid Container for Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
        {scholarships.map((scholarship) => (
          <div key={scholarship.id} className="bg-white rounded-[14px] sm:rounded-[16px] p-3 sm:p-3.5 border border-[#e2e8f0] shadow-[0_2px_15px_rgba(0,0,0,0.06)] flex flex-col h-full group hover:shadow-lg transition-all duration-300">
            {/* Image Area */}
            <div className="w-full h-[140px] xs:h-[160px] sm:h-[170px] rounded-[10px] sm:rounded-[12px] overflow-hidden mb-3 sm:mb-4 relative">
              <img 
                src={scholarship.image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop"} 
                alt={scholarship.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e: any) => { e.target.src = "https://placehold.co/600x400/f1f5f9/94a3b8?text=Scholarship"; }} 
              />
            </div>

            {/* Content Area */}
            <div className="flex flex-col flex-grow px-0.5 sm:px-1">
              {/* Tags */}
              <div className="flex items-center gap-2 sm:gap-2.5 mb-2.5 sm:mb-3">
                <span className="text-[#2563eb] bg-[#eff6ff] px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-[11px] font-bold tracking-wider uppercase">
                  {scholarship.type || "MERIT-BASED"}
                </span>
                <span className={`px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-[11px] md:text-[12px] font-semibold flex items-center gap-1 sm:gap-1.5 ${scholarship.status === 'Open' ? 'text-[#16a34a] bg-[#f0fdf4]' : 'text-amber-600 bg-amber-50'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${scholarship.status === 'Open' ? 'bg-[#16a34a]' : 'bg-amber-500'}`}></span>
                  {scholarship.status || "Open"}
                </span>
              </div>

              {/* Title & Institution */}
              <h3 className="text-[15px] xs:text-[16px] sm:text-[17px] font-bold text-[#0f172a] leading-[1.35] mb-1 sm:mb-1.5 line-clamp-2" title={scholarship.title}>
                {scholarship.title}
              </h3>
              <div className="flex items-center text-[12px] xs:text-[13px] sm:text-[13.5px] text-[#64748b] mb-4 sm:mb-5">
                <Building className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 shrink-0" />
                <span className="truncate">{scholarship.provider || "Tribhuvan University, Nepal"}</span>
                <BadgeCheckIcon className="w-[13px] h-[13px] sm:w-[15px] sm:h-[15px] text-white fill-blue-500 ml-0.5 sm:ml-1 shrink-0" />
              </div>

              {/* Details Box */}
              <div className="bg-[#f8fafc] rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-3.5 flex flex-col gap-2 sm:gap-3 mt-auto border border-[#f1f5f9]">
                {/* Row 1: Split */}
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-[11px] xs:text-[12px] sm:text-[13px] text-[#475569]">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#94a3b8] shrink-0 font-bold text-xs sm:text-sm">$</span>
                    <span className="truncate font-medium">{scholarship.amount || "100% Tuition"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#94a3b8] shrink-0" />
                    <span className="truncate">{scholarship.location || "Bagmati"}</span>
                  </div>
                </div>
                
                {/* Row 2: Level */}
                <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] xs:text-[12px] sm:text-[13px] text-[#475569]">
                  <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#94a3b8] shrink-0" />
                  <span className="truncate">{scholarship.eligibility || "Bachelor (+2 Sci: 2.8+ GPA)"}</span>
                </div>
                
                {/* Row 3: Deadline */}
                <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] xs:text-[12px] sm:text-[13px] md:text-[13.5px] text-[#ef4444] font-medium mt-0.5">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ef4444] shrink-0" />
                  <span>Ends: {scholarship.deadline || "Aug 15, 2026"}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 sm:gap-2.5 mt-4 sm:mt-5 mb-1">
                <button 
                  onClick={() => onNavigate("scholarshipDetails", scholarship)}
                  className="flex-1 bg-white border border-[#cbd5e1] text-[#334155] rounded-lg py-2 sm:py-2.5 text-[12px] sm:text-[13px] md:text-[14px] font-semibold hover:bg-[#f8fafc] hover:text-[#0f172a] transition-all duration-200"
                >
                  Details
                </button>
                <button className="flex-1 bg-[#0000FF] text-white rounded-lg py-2 sm:py-2.5 text-[12px] sm:text-[13px] md:text-[14px] font-semibold hover:bg-[#0000CC] hover:shadow-md transition-all duration-200">
                  Apply
                </button>
                <button className="w-[36px] sm:w-[40px] md:w-[44px] shrink-0 bg-white border border-[#cbd5e1] text-[#94a3b8] rounded-lg flex items-center justify-center hover:bg-[#f8fafc] hover:text-[#64748b] transition-all duration-200" aria-label="Bookmark">
                  <Bookmark className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] md:w-[18px] md:h-[18px]" />
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

export default FinancialAidSection;
