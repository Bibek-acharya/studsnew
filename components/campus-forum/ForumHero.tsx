"use client";

import React, { useState } from "react";

const ForumHero: React.FC = () => {
  const [query, setQuery] = useState("");

  return (
    <section className="relative w-full h-[550px] overflow-hidden bg-white mb-10">
      {/* Split Background Layout */}
      <div className="absolute inset-0 flex">
        {/* Left Blue Part with Diagonal Cut */}
        <div
          className="relative w-[65%] h-full bg-[#2563EB] z-10"
          style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)" }}
        >
          {/* Subtle Patterns inside blue area */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        {/* Right Image Part */}
        <div className="absolute right-0 top-0 w-[45%] h-full">
          <img
            src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"
            alt="Workspace"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/5"></div>
        </div>
      </div>

      {/* Floating Elements from Background */}
      <div className="absolute bottom-10 left-[40%] z-20 w-[450px] h-[300px] pointer-events-none transform rotate-[-15deg] opacity-40">
        <img
          src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1074&auto=format&fit=crop"
          alt="App UI"
          className="w-full h-full object-contain rounded-md shadow-2xl"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-30 max-w-7xl mx-auto px-6 md:px-12 h-full flex flex-col justify-center">
        <div className="max-w-2xl">
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight tracking-tighter">
            Campus Forum
          </h1>

          <p className="text-xl md:text-2xl text-blue-50 font-medium leading-relaxed mb-10 max-w-xl">
            Stop searching blindly. Update your profile and let our algorithm
            match you with the opportunities you deserve.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="relative max-w-2xl mb-12 group"
          >
            <div className="flex items-center bg-white rounded-full shadow-2xl overflow-hidden p-1.5 border border-white/20">
              <div className="pl-6 text-slate-400 group-focus-within:text-[#2563EB] transition-colors">
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search scholarship name,college or keywords..."
                className="flex-1 py-4 px-6 bg-transparent text-slate-800 text-lg border-0 outline-none placeholder-slate-400 font-bold"
              />
              <button
                type="submit"
                className="bg-[#2563EB] hover:bg-blue-700 text-white px-10 py-4 font-black rounded-full transition-all active:scale-95 uppercase tracking-widest text-xs"
              >
                Search
              </button>
            </div>
          </form>

          {/* Recent Visits & Action Buttons */}
          <div className="space-y-12">
            <div className="flex items-center gap-6 text-white overflow-x-auto no-scrollbar pb-2">
              <span className="text-sm font-black whitespace-nowrap opacity-90">
                Your recent visit :
              </span>
              <div className="flex gap-6">
                {["BIT Colleges", "college Predictior", "Scholarship"].map(
                  (item) => (
                    <button
                      key={item}
                      className="text-sm font-black hover:text-blue-200 transition-colors whitespace-nowrap"
                    >
                      {item}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <button className="bg-[#334155] hover:bg-[#1e293b] text-white px-10 py-5 rounded-md font-black text-sm flex items-center gap-4 transition-all shadow-xl shadow-black/10 active:scale-95">
                <i className="fa-solid fa-file-invoice text-xl opacity-80"></i>
                Ask & Share
              </button>
              <button className="bg-white hover:bg-slate-50 text-[#2563EB] px-10 py-5 rounded-md font-black text-sm flex items-center gap-4 transition-all shadow-xl active:scale-95">
                <i className="fa-solid fa-square-plus text-xl opacity-80"></i>
                Create a Poll
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Social Link & Feedback */}
      <div className="absolute bottom-8 right-8 z-40">
        <button className="bg-white text-slate-700 px-6 py-3 rounded-full font-black text-xs flex items-center gap-3 shadow-2xl border border-slate-100/50 hover:bg-slate-50 transition-all">
          <i className="fa-solid fa-link text-blue-500"></i>
          Hundredgroupnepal
        </button>
      </div>

      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-40">
        <div className="bg-[#2563EB] text-white py-4 px-2 rounded-l-xl cursor-pointer flex flex-col items-center gap-2 group hover:pr-4 transition-all shadow-xl font-black text-[10px] uppercase tracking-widest [writing-mode:vertical-lr] rotate-180">
          <i className="fa-solid fa-chevron-right rotate-90 mb-2"></i>
          Feedback
        </div>
      </div>
    </section>
  );
};

export default ForumHero;
