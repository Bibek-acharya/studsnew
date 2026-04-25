"use client";

import React from "react";
import { BasicInfoCard, DescriptionCard, FeesCard, FeaturesCard, StreamsCard, ScholarshipsOverviewCard, AdmissionProcessCard, FaqCard, MediaCard } from "./create-course/basic-info";

export default function AddCourseSection({
  setActiveSection,
  lockedSections,
  setLockedSections,
}: {
  setActiveSection: (s: string) => void;
  lockedSections: Record<string, boolean>;
  setLockedSections: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}) {
  const toggleLock = (sid: string) => {
    setLockedSections((prev) => ({ ...prev, [sid]: !prev[sid] }));
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Add New Course</h2>
          <p className="mt-1 text-sm text-gray-500">Register a new academic course to the system</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setActiveSection("manage-course")}
            className="rounded-md border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white"
          >
            Save Course
          </button>
        </div>
      </div>

      <BasicInfoCard locked={!!lockedSections.basic} onToggleLock={() => toggleLock("basic")} />
      <DescriptionCard locked={!!lockedSections.desc} onToggleLock={() => toggleLock("desc")} />
      <FeesCard locked={!!lockedSections.fees} onToggleLock={() => toggleLock("fees")} />
      <FeaturesCard locked={!!lockedSections.features} onToggleLock={() => toggleLock("features")} />
      <StreamsCard locked={!!lockedSections.streams} onToggleLock={() => toggleLock("streams")} />
      <ScholarshipsOverviewCard locked={!!lockedSections.scholarships} onToggleLock={() => toggleLock("scholarships")} />
      <AdmissionProcessCard locked={!!lockedSections.admission} onToggleLock={() => toggleLock("admission")} />
      <FaqCard locked={!!lockedSections.faq} onToggleLock={() => toggleLock("faq")} />
      <MediaCard locked={!!lockedSections.media} onToggleLock={() => toggleLock("media")} />

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => setActiveSection("manage-course")}
          className="rounded-md border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white"
        >
          Publish Course
        </button>
      </div>
    </div>
  );
}
