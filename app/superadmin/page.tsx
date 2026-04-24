"use client";

import React, { useState } from "react";
import SuperadminSidebar from "@/components/superadmin/dashboard/SuperadminSidebar";
import { Menu } from "lucide-react";

const SuperadminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-white text-slate-900 font-sans">
      {/* Sidebar */}
      <SuperadminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center h-16 px-6 border-b border-slate-200 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 rounded-md text-slate-500 hover:bg-slate-100"
          >
            <Menu size={24} />
          </button>
          <span className="font-bold text-lg text-slate-900 ml-4">
            Dashboard
          </span>
        </header>

        {/* Content Section */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              Dashboard
            </h1>
            <p className="mt-2 text-slate-500 font-medium">
              Welcome back to the command center
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperadminDashboard;
