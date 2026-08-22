"use client";

import React from "react";
import { Share, EyeOff, Flag } from "lucide-react";

interface ActionMenuProps {
  onShare: () => void;
  onNotInterested: () => void;
  onReport: () => void;
}

export default function ActionMenu({ onShare, onNotInterested, onReport }: ActionMenuProps) {
  const menuItems = [
    {
      label: "Share via...",
      icon: Share,
      onClick: onShare,
      danger: false,
    },
    {
      label: "Not interested",
      icon: EyeOff,
      onClick: onNotInterested,
      danger: false,
    },
    {
      label: "Report",
      icon: Flag,
      onClick: onReport,
      danger: true,
    },
  ];

  return (
    <div className="w-64 overflow-hidden rounded-2xl bg-white p-2 shadow-lg ring-1 ring-slate-100">
      {menuItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <button
            key={index}
            onClick={item.onClick}
            className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-base font-medium transition-colors hover:bg-slate-50 ${
              item.danger
                ? "text-red-600"
                : "text-slate-700"
            }`}
          >
            <Icon
              className={`h-5 w-5 ${
                item.danger ? "text-red-600" : "text-slate-500"
              }`}
            />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
