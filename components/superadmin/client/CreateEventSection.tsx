"use client";

import React from "react";
import { PlusCircle } from "lucide-react";

export default function CreateEventSection({ setActiveSection }: { setActiveSection: (s: string) => void }) {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-8">
      <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-gray-900">
        <PlusCircle size={20} className="text-blue-600" /> Create Event
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Event Name</label>
          <input type="text" className="input-field" placeholder="Event name" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input type="date" className="input-field" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Time</label>
          <input type="time" className="input-field" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input type="text" className="input-field" placeholder="Event location" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Max Participants</label>
          <input type="number" className="input-field" placeholder="Maximum attendees" />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <button type="button" onClick={() => setActiveSection("manage-events")} className="rounded-md border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">Cancel</button>
        <button type="button" className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700">Create Event</button>
      </div>
    </div>
  );
}
