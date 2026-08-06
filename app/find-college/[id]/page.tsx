"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/services/AuthContext";
import ShareCollegeModal from "./ShareCollegeModal";
import ClaimCollegeModal from "./components/ClaimCollegeModal";
import OpenCounsellingModal from "./components/OpenCounsellingModal";
import {
  CollegeHeader,
  TabNavigation,
  TabAbout,
  TabCourses,
  TabAdmissions,
  TabOffered,
  TabFacilities,
  TabEvents,
  TabScholarship,
  TabAlumni,
  TabGallery,
  TabReview,
  TabNews,
  TabDownloads,
  TabFaq,
  InquiryForm,
} from "./components";
import TabRecognition from "./components/TabRecognition";
import { useCollegeData } from "./hooks/useCollegeData";
import { useFollow } from "./hooks/useFollow";
import { useBookmark } from "./hooks/useBookmark";
import type { TabKey, LevelFilter } from "../types";
import {
  FALLBACK_FACILITIES,
  FALLBACK_EVENTS,
  FALLBACK_ALUMNI,
  FALLBACK_NEWS_CARDS,
  FALLBACK_DOWNLOADS,
} from "./constants";

const CollegeDetailsPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id: idStr } = React.use(params);
  const { isAuthenticated } = useAuth();

  const [isAskQuestionOpen, setIsAskQuestionOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCounsellingModalOpen, setIsCounsellingModalOpen] = useState(false);
  const [showUnfollowDialog, setShowUnfollowDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("about");
  const [admissionFilter, setAdmissionFilter] = useState<LevelFilter>("all");
  const [programFilter, setProgramFilter] = useState<LevelFilter>("all");
  const [scholarshipFilter, setScholarshipFilter] =
    useState<LevelFilter>("all");
  const [eventsPage, setEventsPage] = useState(1);
  const [newsPage, setNewsPage] = useState(1);
  const [shareUrl, setShareUrl] = useState("");

  const data = useCollegeData(idStr);
  const {
    isFollowed,
    loading: followLoading,
    toggleFollow,
    unfollow,
  } = useFollow(data.college?.id || data.collegeId || null);

  const {
    isBookmarked,
    loading: bookmarkLoading,
    toggleBookmark,
  } = useBookmark(data.college?.id || data.collegeId || null);

  useEffect(() => {
    setShareUrl(window.location.href);
  }, [data.collegeId]);

  useEffect(() => {
    if (activeTab === "review") data.loadReviews();
  }, [activeTab]);

  useEffect(() => {
    if (!data.name || !data.instBanner) return;
    const setMeta = (prop: string, content: string) => {
      let el = document.querySelector(
        `meta[property="${prop}"]`,
      ) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", prop);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    const setName = (name: string, content: string) => {
      let el = document.querySelector(
        `meta[name="${name}"]`,
      ) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const title = data.shareTitle || `${data.name} - Studsphere`;
    const desc =
      data.shareText ||
      `${data.name} - ${data.description?.slice(0, 160) || "College details on Studsphere"}`;
    const image = data.instBanner;

    setMeta("og:title", title);
    setMeta("og:description", desc);
    setMeta("og:image", image);
    setMeta("og:image:width", "1200");
    setMeta("og:image:height", "630");
    setName("twitter:card", "summary_large_image");
    setName("twitter:title", title);
    setName("twitter:description", desc);
    setName("twitter:image", image);
    document.title = title;
  }, [
    data.name,
    data.instBanner,
    data.shareTitle,
    data.shareText,
    data.description,
  ]);

  if (data.loading) {
    return (
      <div className="w-full animate-pulse">
        <div className="relative h-55 w-full bg-brand-blue md:h-90" />
        <div className="mx-auto max-w-350 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="-mt-16 shrink-0 md:-mt-20">
              <div className="h-24 w-24 rounded-lg bg-brand-blue md:h-32 md:w-32" />
            </div>
            <div className="flex-1 space-y-3 pt-2">
              <div className="h-7 w-72 rounded bg-gray-300" />
              <div className="h-4 w-48 rounded bg-gray-200" />
              <div className="h-4 w-96 rounded bg-gray-200" />
            </div>
          </div>
          <div className="mt-8 flex gap-6 border-b border-gray-200 pb-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-6 w-20 rounded bg-gray-200" />
            ))}
          </div>
          <div className="mt-8 space-y-4">
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-3/4 rounded bg-gray-200" />
            <div className="h-4 w-5/6 rounded bg-gray-200" />
            <div className="h-4 w-2/3 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  const coursesData = data.mappedCourses || [];
  const admissionsData = data.mappedAdmissions;
  const facilitiesData = data.mappedFacilities || FALLBACK_FACILITIES;
  const eventsData = data.mappedEvents || FALLBACK_EVENTS;
  const alumniData =
    data.instAlumni && Array.isArray(data.instAlumni)
      ? data.instAlumni
      : FALLBACK_ALUMNI;
  const newsData = data.mappedNews || FALLBACK_NEWS_CARDS;
  const downloadsData = data.mappedDownloads || FALLBACK_DOWNLOADS;

  const offeredPrograms =
    data.institutionProgramsFromTable.length > 0
      ? data.institutionProgramsFromTable
      : data.mappedPrograms || [];

  const scholarshipsData =
    data.mappedScholarships || data.filteredScholarships(scholarshipFilter);

  return (
    <div className="w-full">
      <CollegeHeader
        name={data.name}
        locationText={data.locationText}
        rating={data.rating}
        reviewsCount={data.reviewsCount}
        website={data.website}
        websiteHref={data.websiteHref}
        instLogo={data.instLogo}  
        instBanner={data.instBanner}
        isVerified={data.isVerified}
        college={data.college}
        isInstitution={data.isInstitution}
        isFollowed={isFollowed}
        showUnfollowDialog={showUnfollowDialog}
        setShowUnfollowDialog={setShowUnfollowDialog}
        onToggleFollow={toggleFollow}
        followLoading={followLoading}
        isBookmarked={isBookmarked}
        bookmarkLoading={bookmarkLoading}
        onToggleBookmark={toggleBookmark}
        setIsAskQuestionOpen={setIsAskQuestionOpen}
        setIsShareModalOpen={setIsShareModalOpen}
        setIsClaimModalOpen={setIsClaimModalOpen}
        setIsCounsellingModalOpen={setIsCounsellingModalOpen}
      />

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="grid grid-cols-1 gap-10 px-6 py-8 md:gap-14 md:px-12 md:py-12 lg:grid-cols-3 lg:px-24 xl:px-32">
        <div className="lg:col-span-2">
          {activeTab === "about" && (
            <TabAbout
              description={data.description}
              instVideos={data.instVideos}
              instVision={data.instVision}
              instMission={data.instMission}
              instOverviewData={data.instOverviewData}
              instLeadershipData={data.instLeadershipData}
            />
          )}
          {activeTab === "recognition" && <TabRecognition />}
          {activeTab === "courses" && <TabCourses courses={coursesData} />}
          {activeTab === "admissions" && (
            <TabAdmissions
              admissions={admissionsData}
              collegeId={data.collegeId}
              filter={admissionFilter}
              onFilterChange={setAdmissionFilter}
            />
          )}
          {activeTab === "offered" && (
            <TabOffered
              programs={offeredPrograms}
              filter={programFilter}
              onFilterChange={setProgramFilter}
            />
          )}
          {activeTab === "facilities" && (
            <TabFacilities facilities={facilitiesData} />
          )}
          {activeTab === "events" && (
            <TabEvents events={eventsData} />
          )}
          {activeTab === "scholarship" && (
            <TabScholarship
              scholarships={scholarshipsData}
              filter={scholarshipFilter}
              onFilterChange={setScholarshipFilter}
              hasApiData={!!data.mappedScholarships}
            />
          )}
          {activeTab === "alumni" && <TabAlumni alumni={alumniData} />}
          {activeTab === "gallery" && (
            <TabGallery images={data.galleryGroups} />
          )}
          {activeTab === "review" && (
            <TabReview
              reviewsData={data.reviewsData}
              reviewsLoading={data.reviewsLoading}
            />
          )}
          {activeTab === "news" && (
            <TabNews news={newsData} />
          )}
          {activeTab === "download" && (
            <TabDownloads downloads={downloadsData} />
          )}
          {activeTab === "faq" && (
            <TabFaq faqs={data.mappedFaqs || []} />
          )}
        </div>

        <InquiryForm
          name={data.name}
          locationText={data.locationText}
          website={data.website}
          websiteHref={data.websiteHref}
          college={data.college}
          collegeId={data.collegeId}
          isAuthenticated={isAuthenticated}
          mappedPrograms={data.mappedPrograms}
          isAskQuestionOpen={isAskQuestionOpen}
          setIsAskQuestionOpen={setIsAskQuestionOpen}
        />
      </div>

      <ClaimCollegeModal
        collegeName={data.name}
        collegeId={data.college?.id || data.collegeId || 0}
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
      />

      <ShareCollegeModal
        collegeName={data.name}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareUrl={shareUrl}
        shareTitle={data.shareTitle}
        shareText={data.shareText}
      />

      {data.isInstitution && (
        <OpenCounsellingModal
          isOpen={isCounsellingModalOpen}
          onClose={() => setIsCounsellingModalOpen(false)}
          institutionId={data.college?.id || data.collegeId || 0}
          collegeName={data.name}
        />
      )}

      {showUnfollowDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-md bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-bold text-gray-900">
              Unfollow College
            </h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to unfollow <strong>{data.name}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUnfollowDialog(false)}
                className="flex-1 rounded-md border border-gray-200 px-4 py-2.5 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await unfollow();
                  setShowUnfollowDialog(false);
                }}
                className="flex-1 rounded-md bg-red-500 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-red-600"
              >
                Unfollow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeDetailsPage;
