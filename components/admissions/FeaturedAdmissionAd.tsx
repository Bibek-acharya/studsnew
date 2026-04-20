import React from "react";
import FeaturedCollegeCard from "./FeaturedCollegeCard";

interface FeaturedAdmissionAdProps {
  colleges: any[];
}

const FeaturedAdmissionAd: React.FC<FeaturedAdmissionAdProps> = ({ colleges }) => {
  if (colleges.length === 0) return null;

  return (
    <div className="col-span-1 sm:col-span-2 lg:col-span-3 my-2">
      <div className="bg-linear-to-br from-brand-blue to-[#2563EB] rounded-md p-5 md:p-7 flex flex-col gap-6 ">
        <div className="text-white w-full px-1 flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              Featured Admission
            </h2>
          </div>
          <div className="hidden md:block">
             <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-white/20">
                Sponsored
             </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
          {colleges.map((fc, i) => (
            <FeaturedCollegeCard key={i} {...fc} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedAdmissionAd;
