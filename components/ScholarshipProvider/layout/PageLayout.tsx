"use client";

import React from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface PageLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onNavigate: (section: string) => void;
  onLogout: () => void;
  providerUser: any;
  unreadMessages: number;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  activeTab,
  onNavigate,
  onLogout,
  providerUser,
  unreadMessages,
}) => {
  return (
    <div className="flex h-screen bg-slate-50 antialiased overflow-hidden font-sans text-slate-800">
      <Sidebar
        activeTab={activeTab}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden" style={{ marginLeft: "280px" }}>
        <TopBar
          providerUser={providerUser}
          unreadMessages={unreadMessages}
        />

        <main className="flex-1 overflow-y-auto p-8 pb-24 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
