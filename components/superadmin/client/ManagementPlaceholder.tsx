"use client";

import React from "react";

export default function ManagementPlaceholder({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <p className="mt-2 max-w-md text-gray-500">This section is wired into the super admin navigation and can be expanded into a full management workspace next.</p>
    </div>
  );
}
