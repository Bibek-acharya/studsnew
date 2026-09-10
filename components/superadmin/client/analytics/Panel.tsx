import React from "react";

export function Panel({ title, onExport, children }: { title: string; onExport?: () => void; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        {onExport && (
          <button type="button" onClick={onExport} className="rounded-md px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50">
            Export CSV
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

export function redirectOnUnauthorized(error: unknown) {
  if ((error as { status?: number })?.status === 401 && typeof window !== "undefined") {
    window.location.href = "/superadmin/login";
  }
}
