"use client";

import React, { useState } from "react";
import { MapPin, Phone } from "lucide-react";
import { FormCard } from "../add-college/FormCard";
import { generateId } from "@/lib/superadmin/constants";

const PROVINCES = [
  "Bagmati Province", "Gandaki Province", "Lumbini Province",
  "Koshi Province", "Sudurpashchim Province", "Madhesh Province", "Karnali Province",
];

export function ExamCentersCard({ locked, onToggleLock }: { locked: boolean; onToggleLock: () => void }) {
  const [centers, setCenters] = useState([
    { id: generateId(), province: "Bagmati Province", city: "Kathmandu", venue: "Advance Academy, Lalitpur", contact: "Mr. Bablu Gupta", phone: "9851131074, 9861116456", mapUrl: "" },
    { id: generateId(), province: "Gandaki Province", city: "Pokhara", venue: "Gandaki College, Mahendrapul", contact: "Mr. Prasanna Dhungel", phone: "9801127672, 9856009596", mapUrl: "" },
  ]);

  return (
    <FormCard icon={<MapPin size={24} className="text-red-600" />} title="Exam Centers" sub="Entrance exam locations by province" locked={locked} onToggleLock={onToggleLock} action={
      <button type="button" onClick={() => setCenters((prev) => [...prev, { id: generateId(), province: "", city: "", venue: "", contact: "", phone: "", mapUrl: "" }])} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="M12 5v14" /></svg> Add Center
      </button>
    }>
      <div className="space-y-6">
        {centers.map((c, idx) => (
          <div key={c.id} className="rounded-md border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-5 py-3">
              <span className="text-sm font-bold text-gray-700">Center {idx + 1}</span>
              <button type="button" onClick={() => setCenters((prev) => prev.filter((x) => x.id !== c.id))} className="rounded-md p-1.5 text-red-500 transition-colors hover:bg-red-50">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
              </button>
            </div>
            <div className="space-y-4 p-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-600">Province</label>
                  <select className="input-field text-sm" defaultValue={c.province}>
                    <option value="">Select Province</option>
                    {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-600">City</label>
                  <input type="text" className="input-field text-sm" placeholder="e.g., Kathmandu" defaultValue={c.city} />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-600">Venue</label>
                  <input type="text" className="input-field text-sm" placeholder="e.g., Advance Academy" defaultValue={c.venue} />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-600">Contact Person</label>
                  <input type="text" className="input-field text-sm" placeholder="e.g., Mr. Coordinator" defaultValue={c.contact} />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-600">
                    <div className="flex items-center gap-1"><Phone size={12} /> Phone</div>
                  </label>
                  <input type="text" className="input-field text-sm" placeholder="e.g., 9851131074" defaultValue={c.phone} />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-600">Google Maps Embed URL</label>
                  <input type="url" className="input-field text-sm" placeholder="https://www.google.com/maps/embed?pb=..." defaultValue={c.mapUrl} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </FormCard>
  );
}
