"use client";

import React from "react";
import { BasicInfoCard, ContactInfoCard } from "./add-college/basic-info";
import { SocialMediaCard } from "./add-college/social-media";
import { VideoIntroCard, AboutDescriptionCard, VisionMissionCard } from "./add-college/media-about";
import { UniversityOverviewCard, LeadershipCard } from "./add-college/univ-leadership";
import { MapLocationCard, InquiryFormCard } from "./add-college/map-inquiry";
import { CoursesFeesCard, AdmissionsCard, OfferedProgramsCard } from "./add-college/academics";
import { FacilitiesCard, EventsActivitiesCard, CollegeScholarshipCard } from "./add-college/campus-life";
import { AlumniCard, GalleryCard } from "./add-college/alumni-gallery";
import { NewsNoticeCard, DownloadsCard } from "./add-college/news-materials";

export default function AddCollegeSection({
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
          <h2 className="text-lg font-bold text-gray-900">Add New College</h2>
          <p className="mt-1 text-sm text-gray-500">Register a new educational institution to the system</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setActiveSection("manage-college")}
            className="rounded-md border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white"
          >
            Save College
          </button>
        </div>
      </div>

      <BasicInfoCard locked={!!lockedSections.basic} onToggleLock={() => toggleLock("basic")} />
      <ContactInfoCard locked={!!lockedSections.contact} onToggleLock={() => toggleLock("contact")} />
      <SocialMediaCard locked={!!lockedSections.social} onToggleLock={() => toggleLock("social")} />
      <VideoIntroCard locked={!!lockedSections.video} onToggleLock={() => toggleLock("video")} />
      <AboutDescriptionCard locked={!!lockedSections.about} onToggleLock={() => toggleLock("about")} />
      <VisionMissionCard locked={!!lockedSections.vision} onToggleLock={() => toggleLock("vision")} />
      <UniversityOverviewCard locked={!!lockedSections.university} onToggleLock={() => toggleLock("university")} />
      <LeadershipCard locked={!!lockedSections.leadership} onToggleLock={() => toggleLock("leadership")} />
      <MapLocationCard locked={!!lockedSections.map} onToggleLock={() => toggleLock("map")} />
      <InquiryFormCard locked={!!lockedSections.inquiry} onToggleLock={() => toggleLock("inquiry")} />
      <CoursesFeesCard locked={!!lockedSections.courses} onToggleLock={() => toggleLock("courses")} />
      <AdmissionsCard locked={!!lockedSections.admissions} onToggleLock={() => toggleLock("admissions")} />
      <OfferedProgramsCard locked={!!lockedSections.programs} onToggleLock={() => toggleLock("programs")} />
      <FacilitiesCard locked={!!lockedSections.facilities} onToggleLock={() => toggleLock("facilities")} />
      <EventsActivitiesCard locked={!!lockedSections.events} onToggleLock={() => toggleLock("events")} />
      <CollegeScholarshipCard locked={!!lockedSections.scholarship} onToggleLock={() => toggleLock("scholarship")} />
      <AlumniCard locked={!!lockedSections.alumni} onToggleLock={() => toggleLock("alumni")} />
      <GalleryCard locked={!!lockedSections.gallery} onToggleLock={() => toggleLock("gallery")} />
      <NewsNoticeCard locked={!!lockedSections.news} onToggleLock={() => toggleLock("news")} />
      <DownloadsCard locked={!!lockedSections.downloads} onToggleLock={() => toggleLock("downloads")} />

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => setActiveSection("manage-college")}
          className="rounded-md border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white"
        >
          Publish College
        </button>
      </div>
    </div>
  );
}
