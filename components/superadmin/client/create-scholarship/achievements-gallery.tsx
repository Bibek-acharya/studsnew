"use client";

import React, { useState } from "react";
import { Trophy, ImageIcon } from "lucide-react";
import { FormCard } from "../add-college/FormCard";
import { generateId } from "@/lib/superadmin/constants";

export function AchievementsCard({ locked, onToggleLock }: { locked: boolean; onToggleLock: () => void }) {
  const [items, setItems] = useState([
    { id: generateId(), title: "Successful Scholarship Program", badge: "Success", desc: "95% of scholarship holders achieving distinction.", tags: "95% Pass, 85% Distinction" },
  ]);

  const addItem = () => setItems((prev) => [...prev, { id: generateId(), title: "", badge: "Achievement", desc: "", tags: "" }]);
  const removeItem = (id: string) => setItems((prev) => prev.filter((x) => x.id !== id));
  const updateItem = (id: string, field: string, val: string) =>
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, [field]: val } : x)));

  return (
    <FormCard icon={<Trophy size={24} className="text-yellow-600" />} title="Achievements" sub="Milestones and success stories" locked={locked} onToggleLock={onToggleLock} action={
      <button type="button" onClick={addItem} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="M12 5v14" /></svg> Add Achievement
      </button>
    }>
      <div className="space-y-4">
        {items.length === 0 && <p className="py-8 text-center text-sm text-gray-400">No achievements added yet.</p>}
        {items.map((item, i) => (
          <div key={item.id} className="rounded-md border border-gray-200 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold text-yellow-600">Achievement {i + 1}</span>
              <button type="button" onClick={() => removeItem(item.id)} className="rounded-md p-1 text-red-500 transition-colors hover:bg-red-50">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
              </button>
            </div>
            <div className="mb-3 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-600">Title</label>
                <input type="text" className="input-field text-sm" placeholder="e.g., Successful Scholarship Program" defaultValue={item.title} onChange={(e) => updateItem(item.id, "title", e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-600">Badge Label</label>
                <input type="text" className="input-field text-sm" placeholder="e.g., Success, Award, Students" defaultValue={item.badge} onChange={(e) => updateItem(item.id, "badge", e.target.value)} />
              </div>
            </div>
            <div className="mb-3 space-y-2">
              <label className="block text-xs font-medium text-gray-600">Description</label>
              <textarea className="input-field min-h-[60px] text-sm" rows={2} placeholder="Brief description..." defaultValue={item.desc} onChange={(e) => updateItem(item.id, "desc", e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-600">Tags (comma separated)</label>
              <input type="text" className="input-field text-sm" placeholder="e.g., 95% Pass, 85% Distinction" defaultValue={item.tags} onChange={(e) => updateItem(item.id, "tags", e.target.value)} />
            </div>
          </div>
        ))}
      </div>
    </FormCard>
  );
}

export function GalleryCard({ locked, onToggleLock }: { locked: boolean; onToggleLock: () => void }) {
  const [photos, setPhotos] = useState([
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&h=300&fit=crop",
  ]);

  return (
    <FormCard icon={<ImageIcon size={24} className="text-violet-600" />} title="Gallery" sub="Photo gallery for the scholarship" locked={locked} onToggleLock={onToggleLock}>
      <div className="space-y-6">
        <div className="cursor-pointer rounded-md border-2 border-dashed border-gray-200 p-12 text-center transition-all hover:border-blue-400 hover:bg-blue-50/50">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-md bg-blue-100">
            <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
          </div>
          <p className="text-base font-medium text-gray-700">Click to upload or drag and drop</p>
          <p className="mt-1 text-sm text-gray-500">JPG, PNG (max. 20 images, 5MB each)</p>
          <input type="file" className="hidden" accept="image/*" multiple />
        </div>

        {photos.length > 0 && (
          <div>
            <h4 className="mb-3 text-sm font-bold text-gray-700">Uploaded Photos ({photos.length})</h4>
            <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
              {photos.map((url, i) => (
                <div key={i} className="group relative aspect-square overflow-hidden rounded-md border-2 border-gray-200">
                  <img src={url} alt={`Gallery ${i + 1}`} className="h-full w-full object-cover" />
                  <button type="button" className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-md bg-red-500 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18" /><path d="M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
              <div className="flex aspect-square cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 transition-all hover:border-blue-400 hover:bg-blue-50">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </FormCard>
  );
}
