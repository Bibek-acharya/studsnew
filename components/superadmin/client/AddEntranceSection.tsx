"use client";

import React from "react";
import { PlusCircle } from "lucide-react";

export default function AddEntranceSection({ setActiveSection }: { setActiveSection: (s: string) => void }) {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-8">
      <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-gray-900">
        <PlusCircle size={20} className="text-blue-600" /> Add Entrance Exam
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Exam Name</label>
          <input type="text" className="input-field" placeholder="e.g., CMAT Entrance" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">College</label>
          <select className="input-field">
            <option value="">Select College</option>
            <option value="sowers">Sowers College</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Exam Date</label>
          <input type="date" className="input-field" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Application Deadline</label>
          <input type="date" className="input-field" />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <button type="button" onClick={() => setActiveSection("manage-entrance")} className="rounded-md border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">Cancel</button>
        <button type="button" className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700">Add Entrance</button>
      </div>
    </div>
  );
}
