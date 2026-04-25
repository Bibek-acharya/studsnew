"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  GraduationCap,
  ChevronRight,
  Calendar,
  MessageSquare,
  Newspaper,
  FileText,
  UserCog,
  BarChart3,
  FileCheck,
  ShieldCheck,
  Settings,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onNavigate: (section: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onNavigate, onLogout }) => {
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({
    scholarship: false,
    news: false,
    events: false,
    blog: false,
  });

  const toggleDropdown = (key: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const NavItem = ({
    icon: Icon,
    label,
    section,
    dropdown,
    children,
  }: {
    icon: any;
    label: string;
    section: string;
    dropdown?: string;
    children?: React.ReactNode;
  }) => {
    const isActive = activeTab === section;
    const hasDropdown = !!dropdown;

    return (
      <>
        <div
          onClick={() => {
            if (hasDropdown) {
              toggleDropdown(dropdown);
            } else {
              onNavigate(section);
            }
          }}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer mb-1 ${
            isActive
              ? "bg-blue-50 text-blue-600"
              : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
          }`}
        >
          <Icon className="w-5 h-5" />
          <span>{label}</span>
          {hasDropdown && (
            <ChevronRight
              className={`w-4 h-4 ml-auto transition-transform ${
                openDropdowns[dropdown!] ? "rotate-90" : ""
              }`}
            />
          )}
        </div>
        {hasDropdown && openDropdowns[dropdown!] && children}
      </>
    );
  };

  const DropdownItem = ({
    label,
    section,
  }: {
    label: string;
    section: string;
  }) => {
    const isActive = activeTab === section;
    return (
      <div
        onClick={() => onNavigate(section)}
        className={`pl-10 pr-4 py-2 text-sm transition-all cursor-pointer ${
          isActive
            ? "text-blue-600 font-medium"
            : "text-slate-500 hover:text-blue-600"
        }`}
      >
        {label}
      </div>
    );
  };

  return (
    <aside className="w-[280px] bg-white border-r border-slate-200 fixed left-0 top-0 bottom-0 overflow-y-auto z-50">
      <div className="p-5 border-b border-slate-200 flex items-center justify-center">
        <img
          src="https://test.studsphere.com/_next/image?url=%2Fstudsphere.png&w=3840&q=75"
          alt="StudSphere Logo"
          className="h-12 w-auto"
        />
      </div>

      <nav className="p-4">
        <NavItem
          icon={LayoutDashboard}
          label="Dashboard"
          section="sec-dashboard"
        />

        <NavItem
          icon={GraduationCap}
          label="Manage Scholarship"
          section="sec-scholarship-dropdown"
          dropdown="scholarship"
        >
          <DropdownItem
            label="Create Scholarship"
            section="sec-create-scholarship"
          />
          <DropdownItem
            label="Scholarship Directory"
            section="sec-scholarship-directory"
          />
          <DropdownItem
            label="Manage Application"
            section="sec-applications"
          />
          <DropdownItem
            label="Manage Shortlist"
            section="sec-shortlist"
          />
        </NavItem>

        <NavItem
          icon={Calendar}
          label="Calendar"
          section="sec-calendar"
        />

        <NavItem
          icon={MessageSquare}
          label="Message"
          section="sec-messages"
        />

        <NavItem
          icon={Newspaper}
          label="Manage News"
          section="sec-news-dropdown"
          dropdown="news"
        >
          <DropdownItem label="Create News" section="sec-create-news" />
          <DropdownItem label="News Directory" section="sec-news-directory" />
        </NavItem>

        <NavItem
          icon={Calendar}
          label="Manage Events"
          section="sec-events-dropdown"
          dropdown="events"
        >
          <DropdownItem label="Create Event" section="sec-create-event" />
          <DropdownItem
            label="Events Directory"
            section="sec-events-directory"
          />
        </NavItem>

        <NavItem
          icon={FileText}
          label="Manage Blogs"
          section="sec-blog-dropdown"
          dropdown="blog"
        >
          <DropdownItem label="Create Blog" section="sec-create-blog" />
          <DropdownItem label="Blog Directory" section="sec-blog-directory" />
        </NavItem>

        <NavItem
          icon={UserCog}
          label="Manage Profile"
          section="sec-org-profile"
        />

        <NavItem icon={BarChart3} label="Analytics" section="sec-reports" />

        <NavItem
          icon={FileCheck}
          label="Result Publish"
          section="sec-results"
        />

        <NavItem
          icon={ShieldCheck}
          label="Assign Access"
          section="sec-assign-access"
        />

        <NavItem icon={Settings} label="Settings" section="sec-settings" />

        <div
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 cursor-pointer mt-4 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
