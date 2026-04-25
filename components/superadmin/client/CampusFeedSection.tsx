"use client";

import React from "react";
import { Building, Plus } from "lucide-react";

const posts = [
  { initials: "SA", name: "Campus Update", time: "Posted 2 hours ago", text: "New library facilities now open for all students..." },
  { initials: "AD", name: "Admission Office", time: "Posted 1 day ago", text: "Last date to apply for MBA program extended to May 30..." },
];

export default function CampusFeedSection() {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <Building size={20} className="text-blue-600" /> Manage Campus Feed
        </h2>
        <button type="button" className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700">
          <Plus size={16} /> Add Post
        </button>
      </div>
      <div className="space-y-4">
        {posts.map((p) => (
          <div key={p.name} className="rounded-md border border-gray-200 p-4">
            <div className="mb-3 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-600 text-sm font-bold text-white">
                {p.initials}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{p.name}</p>
                <p className="text-xs text-gray-500">{p.time}</p>
              </div>
            </div>
            <p className="mb-3 text-sm text-gray-700">{p.text}</p>
            <div className="flex items-center gap-4">
              <button type="button" className="text-xs font-medium text-blue-600 hover:underline">Edit</button>
              <button type="button" className="text-xs font-medium text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
