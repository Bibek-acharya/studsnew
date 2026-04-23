import React from "react";
import DirectAdmissionCard from "./DirectAdmissionCard";

interface DirectAdmissionAdProps {
  colleges: any[];
}

const DirectAdmissionAd: React.FC<DirectAdmissionAdProps> = ({ colleges }) => {
  if (colleges.length === 0) return null;

  // Take latest 3 as requested
  const latestColleges = colleges.slice(0, 3);

  return (
    <div className="col-span-1 sm:col-span-2 lg:col-span-3 my-2">
      <div className="bg-linear-to-br from-indigo-600 to-violet-700 rounded-md p-5 md:p-7 flex flex-col gap-6 ">
        <div className="text-white w-full px-1 flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              Skip the queue: Apply directly
            </h2>
          </div>
          <div className="hidden md:block">
             <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-white/20">
                Verified Partners
             </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
          {latestColleges.map((dc, i) => (
            <DirectAdmissionCard key={i} {...dc} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DirectAdmissionAd;
