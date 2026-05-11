"use client";

import React from "react";
import { BasicInfoCard, FinancialCard, DescriptionCard, TimelineCard, JourneyTimelineCard, MediaCard, ContactCard } from "./create-scholarship/basic-info";
import { EligibilityCard } from "./create-scholarship/eligibility";
import { ExamCentersCard } from "./create-scholarship/exam-centers";
import { FaqCard, PartnersCard } from "./create-scholarship/faq-partners";
import { AchievementsCard, GalleryCard } from "./create-scholarship/achievements-gallery";
import { NewsNoticeCard } from "./create-scholarship/news-notice";
import { ScholarshipTypesCard, SelectionRubricCard } from "./create-scholarship/scholarship-table";

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

      <BasicInfoCard />
      <FinancialCard />
      <DescriptionCard />
      <TimelineCard />
      <JourneyTimelineCard />
      <ScholarshipTypesCard />
      <SelectionRubricCard />
      <MediaCard />
      <ContactCard />
      <EligibilityCard />
      <ExamCentersCard />
      <FaqCard />
      <PartnersCard />
      <AchievementsCard />
      <GalleryCard />
      <NewsNoticeCard />

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
