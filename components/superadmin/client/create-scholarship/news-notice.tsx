"use client";

import React, { useState } from "react";
import { Newspaper } from "lucide-react";
import { FormCard } from "../add-college/FormCard";
import { generateId } from "@/lib/superadmin/constants";

const NEWS_CATEGORIES = [
  { value: "notice", label: "Notice" },
  { value: "result", label: "Result" },
  { value: "event", label: "Event" },
  { value: "update", label: "Update" },
  { value: "achievement", label: "Achievement" },
];

export function NewsNoticeCard({ locked, onToggleLock }: { locked: boolean; onToggleLock: () => void }) {
  const [items, setItems] = useState([
    { id: generateId(), title: "Entrance Examination Schedule Published", category: "Notice", desc: "The entrance examination will be held on Shrawan 1, 2082.", date: "" },
  ]);

  const addItem = () => setItems((prev) => [...prev, { id: generateId(), title: "", category: "Notice", desc: "", date: "" }]);
  const removeItem = (id: string) => setItems((prev) => prev.filter((x) => x.id !== id));
  const updateItem = (id: string, field: string, val: string) =>
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, [field]: val } : x)));

  return (
    <FormCard icon={<Newspaper size={24} className="text-cyan-600" />} title="News & Notice" sub="Announcements and updates for the scholarship" locked={locked} onToggleLock={onToggleLock} action={
      <button type="button" onClick={addItem} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="M12 5v14" /></svg> Add News
      </button>
    }>
      <div className="space-y-4">
        {items.length === 0 && <p className="py-8 text-center text-sm text-gray-400">No news items added yet.</p>}
        {items.map((item, i) => (
          <div key={item.id} className="rounded-md border border-gray-200 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-600">News {i + 1}</span>
              <button type="button" onClick={() => removeItem(item.id)} className="rounded-md p-1 text-red-500 transition-colors hover:bg-red-50">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
              </button>
            </div>
            <div className="mb-3 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-600">Title</label>
                <input type="text" className="input-field text-sm" placeholder="e.g., Entrance Examination Schedule" defaultValue={item.title} onChange={(e) => updateItem(item.id, "title", e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-600">Category</label>
                <select className="input-field text-sm" defaultValue={item.category} onChange={(e) => updateItem(item.id, "category", e.target.value)}>
                  {NEWS_CATEGORIES.map((c) => <option key={c.value} value={c.label}>{c.label}</option>)}
                </select>
              </div>
            </div>
            <div className="mb-3 space-y-2">
              <label className="block text-xs font-medium text-gray-600">Description</label>
              <textarea className="input-field min-h-[60px] text-sm" rows={2} placeholder="Brief description..." defaultValue={item.desc} onChange={(e) => updateItem(item.id, "desc", e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-600">Published Date</label>
              <input type="date" className="input-field text-sm" defaultValue={item.date} onChange={(e) => updateItem(item.id, "date", e.target.value)} />
            </div>
          </div>
        ))}
      </div>
    </FormCard>
  );
}
