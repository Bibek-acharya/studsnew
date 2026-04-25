"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  SquaresFour,
  Bank,
  CalendarStar,
  Newspaper,
  Gear,
  PaperPlaneTilt,
} from "@phosphor-icons/react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const SuperadminSidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();

  const menuItems = [
    {
      title: "Dashboard",
      icon: SquaresFour,
      path: "/superadmin",
    },
    {
      title: "Colleges",
      icon: Bank,
      path: "/superadmin/colleges",
    },
    {
      title: "Events",
      icon: CalendarStar,
      path: "/superadmin/events",
    },
    {
      title: "Blogs",
      icon: Newspaper,
      path: "/superadmin/blogs",
    },
    {
      title: "News Management",
      icon: Newspaper,
      path: "/superadmin/news",
    },
    {
      title: "Inquiries",
      icon: PaperPlaneTilt,
      path: "/superadmin/inquiries",
    },
    {
      title: "Settings",
      icon: Gear,
      path: "/superadmin/settings",
    },
  ];

  return (
    <>
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 flex items-center gap-3 border-b border-gray-100">
          <div className="w-8 h-8 bg-[#4F46E5] text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-sm">
            S
          </div>
          <h2 className="font-bold text-gray-900 text-lg tracking-tight">
            SuperAdmin
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-gray-400 hover:text-gray-600 p-1"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#EEF2FF] text-[#4F46E5] shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon size={22} weight={isActive ? "fill" : "regular"} />
                <span className="text-[14px]">{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default SuperadminSidebar;
