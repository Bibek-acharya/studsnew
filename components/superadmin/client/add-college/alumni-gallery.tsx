"use client";

import React from "react";
import { Users, ImagePlus } from "lucide-react";
import { FormCard } from "./FormCard";
import { FormInput } from "./FormInput";

export function AlumniCard({
  locked,
  onToggleLock,
}: {
  locked: boolean;
  onToggleLock: () => void;
}) {
  return (
    <FormCard
      icon={<Users size={24} className="text-teal-600" />}
      title="Alumni"
      sub="Notable graduates and their achievements"
      locked={locked}
      onToggleLock={onToggleLock}
      action={
        <button
          type="button"
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="M12 5v14" />
          </svg>
          Add Alumni
        </button>
      }
    >
      <div className="rounded-md bg-gray-50 p-6">
        <h4 className="mb-4 text-sm font-bold text-gray-700">Add New Alumni</h4>
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormInput label="Full Name" placeholder="e.g., Bikash Sharma" />
          <FormInput label="Current Position" placeholder="Software Engineer at Google" />
          <FormInput label="Graduation Year" type="number" placeholder="2018" />
        </div>
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput label="Program" placeholder="e.g., B.Sc. CSIT" />
          <FormInput label="LinkedIn Profile URL" type="url" placeholder="https://linkedin.com/in/..." />
        </div>
        <div>
          <label className="mb-3 block text-sm font-medium text-gray-700">Profile Photo</label>
          <div className="cursor-pointer rounded-md border-2 border-dashed border-gray-300 p-6 text-center transition-all hover:border-blue-400 hover:bg-blue-50/50">
            <svg className="mx-auto mb-2 h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <p className="text-sm text-gray-600">Click to upload photo</p>
            <p className="mt-1 text-xs text-gray-500">JPG, PNG (max. 2MB)</p>
            <input type="file" className="hidden" accept="image/*" />
          </div>
        </div>
      </div>
    </FormCard>
  );
}

export function GalleryCard({
  locked,
  onToggleLock,
}: {
  locked: boolean;
  onToggleLock: () => void;
}) {
  const photos = [
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1562774053-701939374585?w=300&h=300&fit=crop",
  ];

  return (
    <FormCard
      icon={<ImagePlus size={24} className="text-violet-600" />}
      title="Gallery"
      sub="Campus photos and moments"
      locked={locked}
      onToggleLock={onToggleLock}
      action={
        <button
          type="button"
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><path d="M12 3v12" />
          </svg>
          Upload Photos
        </button>
      }
    >
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

        <div className="space-y-2">
          <h4 className="text-sm font-bold text-gray-700">Uploaded Photos ({photos.length})</h4>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
            {photos.map((url, i) => (
              <div key={i} className="group relative aspect-square overflow-hidden rounded-md border-2 border-gray-200">
                <img
                  src={url}
                  alt={`Gallery ${i + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-md bg-red-500 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18" /><path d="M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <div className="flex aspect-square cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 transition-all hover:border-blue-400 hover:bg-blue-50">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <path d="M5 12h14" /><path d="M12 5v14" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </FormCard>
  );
}
