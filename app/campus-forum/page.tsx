"use client";

import React, { useState } from "react";
import ForumNavbar from "@/components/campus-forum/ForumNavbar";
import ForumHero from "@/components/campus-forum/ForumHero";
import ForumSidebar from "@/components/campus-forum/ForumSidebar";
import TrendingSidebar from "@/components/campus-forum/TrendingSidebar";
import CampusForumPage from "@/components/campus-forum/CampusForumPage";
import Footer from "@/components/Footer";

export default function CampusForumRoute() {
  const [activeTab, setActiveTab] = useState("Home Feed");

  const handleNavigate = (view: any) => {
    console.log("Navigating to", view);
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <ForumNavbar onNavigate={handleNavigate} />
      
      <main>
        <ForumHero />
        
        <div className="mx-auto max-w-[1400px] px-4 lg:px-8 flex gap-8 pb-12">
          {/* Sidebar */}
          <aside className="hidden lg:block w-[300px] shrink-0">
            <div className="sticky top-24">
              <ForumSidebar activeCommunity={activeTab} onSelect={setActiveTab} />
            </div>
          </aside>

          {/* Main Feed */}
          <div className="flex-1">
            <CampusForumPage onNavigate={handleNavigate} />
          </div>

          {/* Trending Sidebar */}
          <aside className="hidden xl:block w-[320px] shrink-0">
            <div className="sticky top-24">
              <TrendingSidebar />
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
