"use client";

import React from "react";
import { Search, Bell, MessageSquare } from "lucide-react";

interface TopBarProps {
  providerUser: any;
  unreadMessages: number;
  onNotificationUpdate?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
  providerUser,
  unreadMessages,
  onNotificationUpdate,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center border border-slate-200 rounded-lg px-3 py-2 w-[500px] focus-within:border-blue-600 transition-colors">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search scholarships, news, events..."
            className="bg-transparent border-none outline-none text-sm ml-2 w-full placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative w-10 h-10 rounded-lg flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors">
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
            5
          </span>
          <Bell className="w-5 h-5" />
        </button>

        <button className="relative w-10 h-10 rounded-lg flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors">
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {unreadMessages}
          </span>
          <MessageSquare className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-800">
              {providerUser?.provider_name || "Admin User"}
            </p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 text-white flex items-center justify-center font-semibold text-sm">
            {getInitials(providerUser?.provider_name || "Admin User")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
