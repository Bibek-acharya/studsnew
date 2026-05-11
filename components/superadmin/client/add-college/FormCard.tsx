"use client";

import React from "react";

export function FormCard({
  icon,
  title,
  sub,
  children,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
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
        {action && <div className="flex items-center gap-3">{action}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}
