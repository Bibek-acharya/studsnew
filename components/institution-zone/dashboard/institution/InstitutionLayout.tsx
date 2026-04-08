"use client";

import React from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  MessageSquare,
  Award,
  Calendar,
  GraduationCap,
  ClipboardCheck,
  Building2,
  Bell,
  LineChart,
  HelpCircle,
  Share2,
  FileDown,
  LogOut,
  Sparkles,
  ChevronRight,
  Plus
} from "lucide-react";

export type InstitutionPage =
  | "Overview"
  | "Program List"
  | "Admission Details"
  | "QMS (Query System)"
  | "Booked Counselling"
  | "Entrance Portal"
  | "News & Notices"
  | "Events Management"
  | "Institutional Profile"
  | "Placement & Careers"
  | "Faculty & Staff"
  | "Scholarship"
  | "Social Media & Links"
  | "FAQ Management"
  | "General Inquiries"
  | "Analytics & Reports"
  | "Account Settings";

interface InstitutionLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const InstitutionLayout: React.FC<InstitutionLayoutProps> = ({
  children,
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-inter">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            S
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 leading-none">
              Studsphere
            </h2>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1 font-bold">
              Institution Zone
            </p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar scrollbar-hide">
          <NavSection title="Dashboard">
            <NavItem
              active={activeTab === "Overview"}
              onClick={() => setActiveTab("Overview")}
              label="Overview"
              icon={<LayoutDashboard size={18} />}
            />
            <NavItem
              active={activeTab === "Program List"}
              onClick={() => setActiveTab("Program List")}
              label="Programs"
              icon={<BookOpen size={18} />}
            />
            <NavItem
              active={activeTab === "Admission Details"}
              onClick={() => setActiveTab("Admission Details")}
              label="Admissions"
              icon={<Users size={18} />}
            />
          </NavSection>

          <NavSection title="Academic Tools">
            <NavItem
              active={activeTab === "Booked Counselling"}
              onClick={() => setActiveTab("Booked Counselling")}
              label="Counselling"
              icon={<GraduationCap size={18} />}
            />
            <NavItem
              active={activeTab === "Entrance Portal"}
              onClick={() => setActiveTab("Entrance Portal")}
              label="Entrance Portals"
              icon={<ClipboardCheck size={18} />}
            />
            <NavItem
              active={activeTab === "Scholarship"}
              onClick={() => setActiveTab("Scholarship")}
              label="Scholarships"
              icon={<Award size={18} />}
            />
          </NavSection>

          <NavSection title="Institutional">
            <NavItem
              active={activeTab === "Institutional Profile"}
              onClick={() => setActiveTab("Institutional Profile")}
              label="Public Profile"
              icon={<Building2 size={18} />}
            />
            <NavItem
              active={activeTab === "Faculty & Staff"}
              onClick={() => setActiveTab("Faculty & Staff")}
              label="Faculty & Staff"
              icon={<Users size={18} />}
            />
             <NavItem
              active={activeTab === "Placement & Careers"}
              onClick={() => setActiveTab("Placement & Careers")}
              label="Placements"
              icon={<Sparkles size={18} />}
            />
          </NavSection>

          <NavSection title="Engagement">
            <NavItem
              active={activeTab === "QMS (Query System)"}
              onClick={() => setActiveTab("QMS (Query System)")}
              label="Query System"
              icon={<MessageSquare size={18} />}
            />
            <NavItem
              active={activeTab === "General Inquiries"}
              onClick={() => setActiveTab("General Inquiries")}
              label="Inquiries"
              icon={<HelpCircle size={18} />}
            />
            <NavItem
              active={activeTab === "FAQ Management"}
              onClick={() => setActiveTab("FAQ Management")}
              label="Knowledge Base"
              icon={<BookOpen size={18} />}
            />
          </NavSection>

          <NavSection title="Communication">
            <NavItem
              active={activeTab === "News & Notices"}
              onClick={() => setActiveTab("News & Notices")}
              label="Notices"
              icon={<Bell size={18} />}
            />
            <NavItem
              active={activeTab === "Events Management"}
              onClick={() => setActiveTab("Events Management")}
              label="Events"
              icon={<Calendar size={18} />}
            />
            <NavItem
              active={activeTab === "Social Media & Links"}
              onClick={() => setActiveTab("Social Media & Links")}
              label="Links"
              icon={<Share2 size={18} />}
            />
          </NavSection>

          <NavSection title="System">
            <NavItem
              active={activeTab === "Analytics & Reports"}
              onClick={() => setActiveTab("Analytics & Reports")}
              label="Analytics"
              icon={<LineChart size={18} />}
            />
            <NavItem
              active={activeTab === "Account Settings"}
              onClick={() => setActiveTab("Account Settings")}
              label="Settings"
              icon={<Settings size={18} />}
            />
          </NavSection>
        </nav>

        <div className="p-4 border-t border-slate-100">
           <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all">
              <LogOut size={16} /> Logout
           </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
             <h3 className="text-sm font-black text-slate-800 uppercase italic underline decoration-indigo-500/30">{activeTab}</h3>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors relative">
               <Bell size={20} />
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right">
                <p className="text-xs font-black text-slate-800 uppercase leading-none">NCIT ADMIN</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase italic font-bold">Verified Inst.</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                NC
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50">
          {children}
        </main>
      </div>
    </div>
  );
};

interface NavSectionProps {
  title: string;
  children: React.ReactNode;
}

const NavSection: React.FC<NavSectionProps> = ({ title, children }) => (
  <div className="py-2">
    <h4 className="px-3 mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
      {title}
    </h4>
    <div className="space-y-0.5">{children}</div>
  </div>
);

interface NavItemProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ active, onClick, label, icon }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold transition-all group ${
      active
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
        : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
    }`}
  >
    <div className="flex items-center gap-3">
      <span className={active ? "text-white" : "text-slate-400 group-hover:text-indigo-600 transition-colors"}>
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </div>
    {active && <ChevronRight size={14} className="opacity-50" />}
  </button>
);

export default InstitutionLayout;
