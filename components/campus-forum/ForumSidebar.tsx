"use client";

import React from "react";

interface ForumSidebarProps {
  activeCommunity: string;
  onSelect: (name: string) => void;
}

const ForumSidebar: React.FC<ForumSidebarProps> = ({
  activeCommunity,
  onSelect,
}) => {
  return (
    <div className="space-y-4">
      {/* MY FEED Section */}
      <div className="bg-white rounded-md p-4  border border-slate-100">
        <h3 className="px-3 text-sm font-black text-slate-700 uppercase tracking-tight mb-4 mt-1">
          MY FEED
        </h3>
        <nav className="space-y-1">
          <SidebarItem
            icon="fa-solid fa-house"
            label="Home Feed"
            active={activeCommunity === "Home Feed"}
            onClick={() => onSelect("Home Feed")}
          />
          <SidebarItem
            icon="fa-solid fa-clock-rotate-left"
            label="Latest"
            active={activeCommunity === "Latest"}
            onClick={() => onSelect("Latest")}
          />
          <SidebarItem
            icon="fa-solid fa-fire text-amber-500"
            label="Trending"
            active={activeCommunity === "Trending"}
            onClick={() => onSelect("Trending")}
          />
          <SidebarItem
            icon="fa-solid fa-heart text-[#2563EB]"
            label="Saved"
            active={activeCommunity === "Saved"}
            onClick={() => onSelect("Saved")}
          />
        </nav>
      </div>

      {/* CATEGORIES Section */}
      <div className="bg-white rounded-md p-4  border border-slate-100">
        <h3 className="px-3 text-sm font-black text-slate-700 uppercase tracking-tight mb-4 mt-1">
          CATEGORIES
        </h3>
        <nav className="space-y-1">
          {[
            { label: "Colleges", icon: "fa-solid fa-building-columns" },
            { label: "Courses", icon: "fa-solid fa-graduation-cap" },
            { label: "Admission", icon: "fa-solid fa-clipboard-check" },
            { label: "Scholarship", icon: "fa-solid fa-coins" },
            { label: "Events", icon: "fa-solid fa-calendar-days" },
            { label: "Entrance Exam", icon: "fa-solid fa-file-pen" },
            { label: "Exam Programs", icon: "fa-solid fa-book" },
            { label: "Campus Life", icon: "fa-solid fa-people-group" },
            { label: "Academics", icon: "fa-solid fa-user-graduate" },
            { label: "General", icon: "fa-solid fa-globe" },
          ].map((cat) => (
            <button
              key={cat.label}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-600 hover:bg-slate-50 transition-all font-bold group"
            >
              <i
                className={`${cat.icon} text-lg text-slate-900 group-hover:scale-110 transition-transform`}
              ></i>
              <span className="text-sm tracking-tight">{cat.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Analytics Graphic placeholder */}
      <div className="h-32 bg-[#1D63FF] rounded-md shadow-xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="absolute top-1/2 left-0 w-full h-px bg-white/20"></div>
        <div className="absolute top-[60%] left-0 w-full h-px bg-white/20"></div>
      </div>
    </div>
  );
};

const SidebarItem: React.FC<{
  icon: string;
  label: string;
  active?: boolean;
  onClick: () => void;
}> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-md transition-all font-bold group ${active ? "text-[#2563EB] bg-blue-50/50 " : "text-slate-600 hover:bg-slate-50"}`}
  >
    <i
      className={`${icon} text-lg ${active ? "text-[#2563EB]" : "text-slate-900"} group-hover:scale-110 transition-transform`}
    ></i>
    <span className="text-sm tracking-tight">{label}</span>
  </button>
);

export default ForumSidebar;
