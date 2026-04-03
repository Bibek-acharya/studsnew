import React from "react";

export const SudsphereBannerAd: React.FC = () => (
  <div className="w-full h-48 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 rounded-3xl p-10 flex flex-col items-start justify-center shadow-xl relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 group-hover:scale-110 transition-transform"></div>
    <div className="relative z-10 flex flex-col items-start gap-4">
      <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 border border-white/30 text-white text-[12px] font-black uppercase tracking-widest shadow-sm">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        Sudsphere Platform
      </div>
      <h2 className="text-3xl font-black text-white leading-tight mb-2 tracking-tight">Your Path to Excellence</h2>
      <p className="text-sm text-white/90 font-medium max-w-lg mb-4 tracking-tight">Find international programs and colleges with ease.</p>
    </div>
    <div className="absolute top-1/2 -translate-y-1/2 right-12 hidden lg:flex items-center gap-12 text-white">
      <div className="flex flex-col items-center">
        <span className="text-3xl font-black mb-1">500+</span>
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Universities</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-3xl font-black mb-1">2k+</span>
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Courses</span>
      </div>
    </div>
  </div>
);
