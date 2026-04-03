import React from "react";

export const KistProgramsAd: React.FC = () => (
  <div className="w-full bg-purple-50 border border-purple-100 rounded-xl p-8 flex flex-col items-center justify-between shadow-sm lg:flex-row lg:gap-12">
    <div className="flex items-center gap-6 mb-4 lg:mb-0">
      <div className="w-16 h-16 bg-white border border-purple-100 rounded-xl flex items-center justify-center p-2 shadow-sm">
        <img src="https://kist.edu.np/resources/assets/img/logo_small.jpg" alt="Kist Logo" className="w-auto h-full" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-purple-900 tracking-tight">KIST College & SS</h3>
        <p className="text-sm text-purple-700 font-medium tracking-tight">Explore programs in Science, IT, Medicine & Management.</p>
      </div>
    </div>
    <div className="flex gap-4">
      <button className="px-6 h-11 bg-purple-600 text-white rounded-md text-sm font-bold shadow-md hover:bg-purple-700 transition-colors">
        Admissions Open
      </button>
      <button className="px-6 h-11 bg-white text-purple-700 border border-purple-200 rounded-md text-sm font-bold shadow-sm hover:border-purple-300 transition-colors">
        Details
      </button>
    </div>
  </div>
);
