"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { apiService, University, UniversityCollege } from "@/services/api";
import { useFollow } from "@/app/find-college/[id]/hooks/useFollow";
import ShareCollegeModal from "@/app/find-college/[id]/ShareCollegeModal";
import UniversityBanner from "./UniversityBanner";
import UniversityTabs from "./UniversityTabs";
import UniversitySidebar from "./UniversitySidebar";
import AboutTab from "./tabs/AboutTab";
import CoursesTab from "./tabs/CoursesTab";
import InstitutesTab from "./tabs/InstitutesTab";
import AdmissionsTab from "./tabs/AdmissionsTab";
import ScholarshipTab from "./tabs/ScholarshipTab";
import EventsTab from "./tabs/EventsTab";
import NewsTab from "./tabs/NewsTab";
import DownloadTab from "./tabs/DownloadTab";
import GalleryTab from "./tabs/GalleryTab";
import ReviewTab from "./tabs/ReviewTab";

type TabKey =
  | "tab-about"
  | "tab-courses"
  | "tab-institutes"
  | "tab-admissions"
  | "tab-scholarship"
  | "tab-events"
  | "tab-news"
  | "tab-download"
  | "tab-gallery"
  | "tab-review";

const UniversityDetail: React.FC = () => {
  const params = useParams();
  const id = Number(params?.id) || 0;
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get("tab");

  const getInitialTab = (): TabKey => {
    switch (tabParam) {
      case "courses": return "tab-courses";
      case "scholarship": return "tab-scholarship";
      case "admissions": return "tab-admissions";
      case "institutes": return "tab-institutes";
      case "gallery": return "tab-gallery";
      case "review": return "tab-review";
      default: return "tab-about";
    }
  };

  const [activeTab, setActiveTab] = useState<TabKey>(getInitialTab);
  const [university, setUniversity] = useState<University | null>(null);
  const [colleges, setColleges] = useState<UniversityCollege[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sponsoredInsts, setSponsoredInsts] = useState<any[]>([]);
  const { isFollowed, loading: followLoading, toggleFollow, unfollow } = useFollow(id || null, `/universities/${id}`, "university");
  const [showUnfollowDialog, setShowUnfollowDialog] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

  const decodeB64 = (str: string): any => {
    try {
      const decoded = decodeURIComponent(escape(atob(str)));
      return JSON.parse(decoded);
    } catch {
      return str;
    }
  };

  const decodeFields = (u: any): any => {
    if (!u) return u;
    const fields = [
      "about", "contact", "overview", "leadership", "courses",
      "programs", "scholarships", "events", "news", "downloads",
      "gallery", "faculties", "admissions", "official_notices",
      "latest_news", "quick",
    ];
    const out = { ...u };
    for (const f of fields) {
      if (typeof out[f] === "string" && out[f].length > 0) {
        out[f] = decodeB64(out[f]);
      }
    }
    return out;
  };

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    apiService
      .getUniversityById(id)
      .then((res) => {
        setUniversity(decodeFields(res.data.university));
        setColleges(res.data.colleges || []);
      })
      .catch(() => setError("Failed to load university details"))
      .finally(() => setLoading(false));
    apiService.getSponsoredInstitutions(id).then((res) => {
      setSponsoredInsts(res?.data?.institutions || res?.institutions || []);
    }).catch(() => {});
  }, [id]);

  const toggleDropdown = (key: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-500">Loading university details...</div>
      </div>
    );
  }

  if (error || !university) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
        <p className="text-gray-500 text-lg font-medium mb-4">
          Failed to load university details.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#0000ff] hover:bg-[#0000cc] cursor-pointer text-white font-semibold py-2.5 px-6 rounded-md transition-colors text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  const uni = university;
  const name = uni?.name || "University";
  const contactData: Record<string, any> = uni?.contact || {};
  const aboutData: Record<string, any> = uni?.about || {};
  const overviewList = Array.isArray(uni?.overview) ? uni.overview : [];
  const leadershipList = Array.isArray(uni?.leadership) ? uni.leadership : [];
  const institutesList = Array.isArray(uni?.faculties) ? uni.faculties : [];
  const admissionsList = Array.isArray(uni?.admissions) ? uni.admissions : [];
  const officialNoticesList = Array.isArray(uni?.official_notices) ? uni.official_notices : [];
  const scholarshipsList = Array.isArray(uni?.scholarships) ? uni.scholarships : [];
  const downloadsList = Array.isArray(uni?.downloads) ? uni.downloads : [];
  const galleryList = Array.isArray(uni?.gallery) ? uni.gallery : [];
  const latestNewsList = Array.isArray(uni?.latest_news) ? uni.latest_news : [];

  const renderTabContent = () => {
    switch (activeTab) {
      case "tab-about":
        return (
          <AboutTab
            name={name}
            description={uni?.description || ""}
            aboutData={aboutData}
            overviewList={overviewList}
            leadershipList={leadershipList}
            latestNewsList={latestNewsList}
          />
        );
      case "tab-courses":
        return <CoursesTab universityId={id} />;
      case "tab-institutes":
        return (
          <InstitutesTab
            institutesList={institutesList}
            openDropdowns={openDropdowns}
            toggleDropdown={toggleDropdown}
          />
        );
      case "tab-admissions":
        return (
          <AdmissionsTab
            universityId={id}
            admissionsList={admissionsList}
            officialNoticesList={officialNoticesList}
          />
        );
      case "tab-scholarship":
        return <ScholarshipTab scholarshipsList={scholarshipsList} />;
      case "tab-events":
        return <EventsTab universityId={id} />;
      case "tab-news":
        return <NewsTab universityId={id} />;
      case "tab-download":
        return <DownloadTab downloadsList={downloadsList} />;
      case "tab-gallery":
        return <GalleryTab galleryList={galleryList} />;
      case "tab-review":
        return (
          <ReviewTab
            universityId={id}
            overallRating={uni?.rating}
            reviewCount={uni?.review_count}
          />
        );
      default:
        return (
          <AboutTab
            name={name}
            description={uni?.description || ""}
            aboutData={aboutData}
            overviewList={overviewList}
            leadershipList={leadershipList}
            latestNewsList={latestNewsList}
          />
        );
    }
  };

  return (
    <>
      <div className="w-full bg-white font-sans">
        <UniversityBanner
          university={uni}
          name={name}
          id={id}
          contactData={contactData}
          aboutData={aboutData}
          isFollowed={isFollowed}
          followLoading={followLoading}
          toggleFollow={toggleFollow}
          setShowUnfollowDialog={setShowUnfollowDialog}
          setIsShareModalOpen={setIsShareModalOpen}
        />

        <UniversityTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content */}
        <div className="mx-auto max-w-[1400px] grid grid-cols-1 gap-10 bg-white py-8 px-4 sm:px-0 md:gap-14 md:py-12 lg:grid-cols-3">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {renderTabContent()}
          </div>

          {/* Right Column */}
          <UniversitySidebar
            contactData={contactData}
            aboutData={aboutData}
            sponsoredInsts={sponsoredInsts}
          />
        </div>
      </div>

      {/* Share Modal */}
      <ShareCollegeModal
        collegeName={name}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareUrl={typeof window !== "undefined" ? window.location.href : ""}
        shareTitle={`${name} - Studsphere`}
        shareText={`Check out ${name} on Studsphere`}
      />

      {/* Unfollow Dialog */}
      {showUnfollowDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-md bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-bold text-gray-900">
              Unfollow University
            </h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to unfollow <strong>{name}</strong>?
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
    </>
  );
};

export default UniversityDetail;
