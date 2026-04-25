"use client";

import React from "react";
import { BasicInfoCard, FinancialCard, DescriptionCard, TimelineCard, MediaCard, ContactCard } from "./create-scholarship/basic-info";
import { EligibilityCard } from "./create-scholarship/eligibility";
import { ExamCentersCard } from "./create-scholarship/exam-centers";
import { FaqCard, PartnersCard } from "./create-scholarship/faq-partners";
import { AchievementsCard, GalleryCard } from "./create-scholarship/achievements-gallery";
import { NewsNoticeCard } from "./create-scholarship/news-notice";

export default function CreateScholarshipSection({
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
          <h2 className="text-lg font-bold text-gray-900">Create New Scholarship</h2>
          <p className="mt-1 text-sm text-gray-500">Add a new scholarship program to the system</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setActiveSection("manage-scholarship")}
            className="rounded-md border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white"
          >
            Create Scholarship
          </button>
        </div>
      </div>

      <BasicInfoCard locked={!!lockedSections.basic} onToggleLock={() => toggleLock("basic")} />
      <FinancialCard locked={!!lockedSections.financial} onToggleLock={() => toggleLock("financial")} />
      <DescriptionCard locked={!!lockedSections.desc} onToggleLock={() => toggleLock("desc")} />
      <TimelineCard locked={!!lockedSections.timeline} onToggleLock={() => toggleLock("timeline")} />
      <MediaCard locked={!!lockedSections.media} onToggleLock={() => toggleLock("media")} />
      <ContactCard locked={!!lockedSections.contact} onToggleLock={() => toggleLock("contact")} />
      <EligibilityCard locked={!!lockedSections.eligibility} onToggleLock={() => toggleLock("eligibility")} />
      <ExamCentersCard locked={!!lockedSections.centers} onToggleLock={() => toggleLock("centers")} />
      <FaqCard locked={!!lockedSections.faq} onToggleLock={() => toggleLock("faq")} />
      <PartnersCard locked={!!lockedSections.partners} onToggleLock={() => toggleLock("partners")} />
      <AchievementsCard locked={!!lockedSections.achievements} onToggleLock={() => toggleLock("achievements")} />
      <GalleryCard locked={!!lockedSections.gallery} onToggleLock={() => toggleLock("gallery")} />
      <NewsNoticeCard locked={!!lockedSections.news} onToggleLock={() => toggleLock("news")} />

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => setActiveSection("manage-scholarship")}
          className="rounded-md border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white"
        >
          Publish Scholarship
        </button>
      </div>
    </div>
  );
}
