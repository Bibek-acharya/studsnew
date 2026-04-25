"use client";

import React from "react";

export function FormCard({
  icon,
  title,
  sub,
  locked,
  onToggleLock,
  children,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  locked: boolean;
  onToggleLock: () => void;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-md border border-gray-100 bg-white p-8">
      <div className="mb-8 flex items-center justify-between border-b border-gray-50 pb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-50">{icon}</div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{sub}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {action}
          <div className="flex items-center gap-3 rounded-md border border-gray-100 bg-gray-50 px-4 py-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
              {locked ? "Locked" : "Unlocked"}
            </span>
            <label className="section-lock-toggle">
              <input type="checkbox" className="sr-only" checked={locked} onChange={onToggleLock} />
              <div
                className={`relative h-6 w-10 rounded-full transition-all ${
                  locked ? "bg-red-500" : "bg-blue-600"
                }`}
              >
                <div
                  className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-all ${
                    locked ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </div>
            </label>
          </div>
        </div>
      </div>
      <div
        className={`transition-all duration-300 ${
          locked ? "pointer-events-none scale-[0.99] opacity-30" : "opacity-100"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
