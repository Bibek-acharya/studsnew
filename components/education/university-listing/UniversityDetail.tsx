"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { safeHtml } from "@/lib/html";
import ContactInfoRow from "@/app/find-college/[id]/components/ContactInfoRow";
import ReviewCard from "@/app/find-college/[id]/components/ReviewCard";
import RatingBar from "@/app/find-college/[id]/components/RatingBar";
import EmptyTabState from "@/app/find-college/[id]/components/EmptyTabState";
import ShareCollegeModal from "@/app/find-college/[id]/ShareCollegeModal";
import { apiService, University, UniversityCollege } from "@/services/api";
import {
  BadgeCheck,
  Star,
  Building2,
  Download,
  Share2,
  Eye,
  Target,
  Gem,
  Landmark,
  Users,
  Layers,
  BookOpen,
  Clock,
  ChevronRight,
  FileDown,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

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

const TABS: { key: TabKey; label: string }[] = [
  { key: "tab-about", label: "About" },
  { key: "tab-courses", label: "Courses & Fees" },
  { key: "tab-institutes", label: "Institute / Faculties" },
  { key: "tab-admissions", label: "Admissions" },
  { key: "tab-scholarship", label: "Scholarship" },
  { key: "tab-events", label: "Events" },
  { key: "tab-news", label: "News & Notices" },
  { key: "tab-download", label: "Download" },
  { key: "tab-gallery", label: "Gallery" },
  { key: "tab-review", label: "Review" },
];

const getYouTubeId = (url: string): string | null => {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? match[1] : null;
};

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
  const [courseFilter, setCourseFilter] = useState("all");
  const [scholarFilter, setScholarFilter] = useState("all");
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {},
  );
  const [isFollowed, setIsFollowed] = useState(false);
  const [showUnfollowDialog, setShowUnfollowDialog] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [university, setUniversity] = useState<University | null>(null);
  const [colleges, setColleges] = useState<UniversityCollege[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewsData, setReviewsData] = useState<any>(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [myReview, setMyReview] = useState<any>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [uniEvents, setUniEvents] = useState<any[]>([]);
  const [uniNews, setUniNews] = useState<any[]>([]);
  const [uniEventsLoading, setUniEventsLoading] = useState(false);
  const [uniNewsLoading, setUniNewsLoading] = useState(false);
  const [galFolder, setGalFolder] = useState("all");
  const [galCount, setGalCount] = useState(9);
  const [galIdx, setGalIdx] = useState<number | null>(null);
  useEffect(() => { if (activeTab !== "tab-gallery") { setGalFolder("all"); setGalCount(9); setGalIdx(null); } }, [activeTab]);
  useEffect(() => { setGalCount(9); }, [galFolder]);

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
      "about",
      "contact",
      "overview",
      "leadership",
      "courses",
      "programs",
      "scholarships",
      "events",
      "news",
      "downloads",
      "gallery",
      "faculties",
      "admissions",
      "quick",
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
  }, [id]);

  const uni = university;
  const name = uni?.name || "University";
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = `${name} - Studsphere`;
  const shareText = `Check out ${name} on Studsphere`;

  const description = uni?.description || "";

  const overviewList = uni?.overview
    ? Array.isArray(uni.overview)
      ? uni.overview
      : []
    : [];
  const leadershipList = uni?.leadership
    ? Array.isArray(uni.leadership)
      ? uni.leadership
      : []
    : [];
  const coursesList = uni?.courses
    ? Array.isArray(uni.courses)
      ? uni.courses
      : []
    : [];
  const admissionsList = uni?.admissions
    ? Array.isArray(uni.admissions)
      ? uni.admissions
      : []
    : [];
  const scholarshipsList = uni?.scholarships
    ? Array.isArray(uni.scholarships)
      ? uni.scholarships
      : []
    : [];
  const eventsList = uni?.events
    ? Array.isArray(uni.events)
      ? uni.events
      : []
    : [];
  const newsList = uni?.news ? (Array.isArray(uni.news) ? uni.news : []) : [];
  const downloadsList = uni?.downloads
    ? Array.isArray(uni.downloads)
      ? uni.downloads
      : []
    : [];
  const galleryList = uni?.gallery
    ? Array.isArray(uni.gallery)
      ? uni.gallery
      : []
    : [];
  const institutesList = uni?.faculties
    ? Array.isArray(uni.faculties)
      ? uni.faculties
      : []
    : [];
  const contactData: Record<string, any> = uni?.contact || {};
  const aboutData: Record<string, any> = uni?.about || {};

  const videoUrl =
    (aboutData?.video_url as string) ||
    (Array.isArray(aboutData?.videos) && aboutData.videos[0]?.url) ||
    "";
  const ytId = videoUrl ? getYouTubeId(videoUrl) : null;

  const toggleDropdown = (id: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const closeLightbox = () => setLightboxIndex(null);

  const changeImage = (dir: number) => {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      const next = prev + dir;
      if (next < 0) return galleryList.length - 1;
      if (next >= galleryList.length) return 0;
      return next;
    });
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") changeImage(-1);
      if (e.key === "ArrowRight") changeImage(1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex]);

  useEffect(() => {
    if (activeTab !== "tab-review" || !id) return;
    (async () => {
      setReviewsLoading(true);
      try {
        const token = apiService.getToken();
        const [reviewsRes, myReviewRes] = await Promise.allSettled([
          apiService.getUniversityReviews(id, { page: 1, limit: 10 }),
          token ? apiService.getMyUniversityReview(id, { authToken: token }) : Promise.resolve(null),
        ]);
        if (reviewsRes.status === "fulfilled") {
          setReviewsData(reviewsRes.value?.data || reviewsRes.value);
        }
        if (myReviewRes.status === "fulfilled" && myReviewRes.value?.data?.review) {
          const r = myReviewRes.value.data.review;
          setMyReview(r);
          setReviewRating(Math.round(r.ratings?.overall || 5));
          setReviewText(r.summaryTitle || "");
        }
      } catch {
        // silently fail
      } finally {
        setReviewsLoading(false);
      }
    })();
  }, [activeTab, id]);

  useEffect(() => {
    if (activeTab !== "tab-events" || !id) return;
    (async () => {
      setUniEventsLoading(true);
      try {
        const res = await apiService.getUniversityEvents(id, { page: 1, limit: 50 });
        const list = res?.data?.events || res?.events || [];
        setUniEvents(list);
      } catch { setUniEvents([]); }
      finally { setUniEventsLoading(false); }
    })();
  }, [activeTab, id]);

  useEffect(() => {
    if (activeTab !== "tab-news" || !id) return;
    (async () => {
      setUniNewsLoading(true);
      try {
        const res = await apiService.getUniversityNews(id, { page: 1, limit: 50 });
        const list = res?.data?.news || res?.news || [];
        setUniNews(list);
      } catch { setUniNews([]); }
      finally { setUniNewsLoading(false); }
    })();
  }, [activeTab, id]);

  const handleSubmitReview = async () => {
    if (!reviewRating || !reviewText.trim()) return;
    setSubmittingReview(true);
    setSubmitError("");
    try {
      const token = apiService.getToken();
      if (!token) {
        setSubmitError("Please log in to submit a review.");
        return;
      }
      await apiService.submitUniversityReview(
        { university_id: id, rating: reviewRating, review: reviewText.trim() },
        { authToken: token },
      );
      setShowReviewForm(false);
      setReviewRating(0);
      setReviewText("");
      setMyReview(null);
      setReviewsLoading(true);
      try {
        const t = apiService.getToken();
        const [r1] = await Promise.allSettled([
          apiService.getUniversityReviews(id, { page: 1, limit: 10 }),
          t ? apiService.getMyUniversityReview(id, { authToken: t }) : Promise.resolve(null),
        ]);
        if (r1.status === "fulfilled") {
          setReviewsData(r1.value?.data || r1.value);
        }
      } catch {
        // silent
      } finally {
        setReviewsLoading(false);
      }
    } catch (err: any) {
      const msg = err?.message || "";
      if (msg.includes("already reviewed")) {
        setSubmitError("You have already reviewed this university.");
      } else {
        setSubmitError(msg || "Failed to submit review.");
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-500">Loading university details...</div>
      </div>
    );
  }

  if (error || !uni) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
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

  return (
    <>
      <div className="w-full bg-white font-sans">
        {/* Banner */}
        <div
          className="relative w-full bg-brand-blue bg-cover bg-center bg-no-repeat aspect-[16/3]"
          style={
            uni?.cover ? { backgroundImage: `url(${uni.cover})` } : undefined
          }
        />

        <div className="relative bg-white">
          <div className="relative mx-auto max-w-[1400px] pb-8">
            {/* Logo */}
            <div className="absolute -top-4 left-6 z-10 flex h-20 w-20 items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-white p-1.5 md:left-12 md:h-[150px] md:w-[150px] lg:left-24 xl:left-32">
              {uni?.logo ? (
                <Image
                  src={uni.logo}
                  alt={`${name} logo`}
                  width={150}
                  height={150}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-brand-blue rounded-sm" />
              )}
            </div>

            {/* Profile Header */}
            <div className="flex flex-col items-start justify-between pt-14 md:pt-20 lg:flex-row lg:items-end lg:pt-6 lg:pl-[170px]">
              <div className="w-full space-y-3 lg:w-auto">
                <div className="flex items-center gap-2">
                  <h1 className="text-[18px] font-bold tracking-tight text-gray-900 md:text-[24px] lg:text-3xl truncate">
                    {name}
                  </h1>
                  {uni?.verified && (
                    <BadgeCheck className="h-6 w-6 shrink-0 fill-blue-500 text-white" />
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-medium md:text-[14px]">
                  <div className="flex items-center gap-1.5">
                    <i className="fa-solid fa-location-dot text-gray-500"></i>
                    <span className="text-gray-600">{uni?.location || ""}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <i className="fa-solid fa-star text-yellow-400"></i>
                    <span className="font-bold text-gray-900">{uni?.rating ?? "—"}</span>
                    <span className="text-gray-500 whitespace-nowrap">({uni?.review_count ?? 0} Reviews)</span>
                  </div>
                  {uni?.website && (
                    <a href={uni.website.startsWith("http") ? uni.website : `https://${uni.website}`} target="_blank" rel="noreferrer" className="hidden md:flex items-center gap-1 text-[13px] font-medium tracking-wide text-brand-blue hover:text-brand-hover">
                      <i className="fa-solid fa-globe text-gray-500 text-[12px]"></i>
                      {uni.website.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (isFollowed) {
                      setShowUnfollowDialog(true);
                    } else {
                      setIsFollowed(true);
                    }
                  }}
                  className={`flex items-center justify-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold transition-colors md:px-4 md:py-1.5 md:text-[13px] ${
                    isFollowed
                      ? "bg-green-300 text-gray-800 hover:bg-green-400"
                      : "bg-brand-blue text-white hover:bg-brand-hover"
                  }`}
                >
                  <i className={`fa-solid ${isFollowed ? "fa-check" : "fa-plus"}`}></i>
                  {isFollowed ? "Following" : "Follow"}
                </button>
              </div>

              <div className="hidden mt-8 w-full flex-nowrap items-center gap-2 overflow-x-auto pb-1 md:flex lg:mt-0 lg:w-auto lg:gap-3 lg:overflow-visible lg:pb-0">
                <Link
                  href={`/universities/${name.toLowerCase().replace(/\s+/g, "-")}/affiliated-colleges`}
                  className="shrink-0 flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-brand-blue px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-brand-hover lg:px-5 lg:py-3 lg:text-[15px]"
                >
                  <Building2 className="h-4 w-4" />
                  View Affiliated Colleges
                </Link>
                {(aboutData?.prospectus_url as string) ? (
                  <a
                    href={aboutData?.prospectus_url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-[13px] font-semibold text-gray-700 transition-colors hover:bg-gray-50 lg:px-5 lg:py-3 lg:text-[15px]"
                  >
                    <Download className="h-4 w-4" />
                    <span>{aboutData?.prospectus_title as string || "Prospectus"}</span>
                  </a>
                ) : null}
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="shrink-0 flex items-center justify-center rounded-md border border-gray-200 bg-white p-2.5 text-gray-700 transition-colors hover:bg-gray-50 lg:p-3"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Tab Nav */}
          <div className="sticky top-0 z-40 overflow-x-auto border-b border-t border-gray-100 bg-white shadow-sm shadow-gray-100/50 no-scrollbar">
            <nav
              className="mx-auto max-w-[1400px] flex space-x-8 whitespace-nowrap"
              id="tab-nav"
            >
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`border-b-2 py-4 text-[15px] transition-colors ${
                    activeTab === tab.key
                      ? "border-blue-600 font-bold text-gray-900"
                      : "border-transparent font-semibold text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="mx-auto max-w-[1400px] grid grid-cols-1 gap-10 bg-white py-8 md:gap-14 md:py-12 lg:grid-cols-3">
            {/* Left Column */}
            <div className="lg:col-span-2">
              {/* ========== ABOUT ========== */}
              {activeTab === "tab-about" && (
                <div className="space-y-10">
                  <div
                    className="space-y-6 text-[15px] leading-[1.8] text-gray-600 md:text-[16px] rich-text"
                    dangerouslySetInnerHTML={{
                      __html: safeHtml(description),
                    }}
                  />

                  {ytId ? (
                    <div className="relative h-[240px] w-full overflow-hidden rounded-md border border-gray-100 bg-brand-blue md:h-[400px]">
                      <iframe
                        className="absolute inset-0 h-full w-full"
                        src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}`}
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        title="University Video"
                      />
                    </div>
                  ) : null}

                  {aboutData?.description && (
                    <div
                      className="space-y-6 text-[15px] leading-[1.8] text-gray-600 md:text-[16px] rich-text"
                      dangerouslySetInnerHTML={{
                        __html: safeHtml(aboutData.description as string),
                      }}
                    />
                  )}

                  {(aboutData?.vision || aboutData?.mission) && (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {aboutData?.vision && (
                        <div className="rounded-md border border-gray-100 bg-[#f4f7fb] p-8">
                          <div className="mb-4 flex items-center gap-3.5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100/80 text-blue-600">
                              <Eye className="h-5 w-5" />
                            </div>
                            <h3 className="text-[16px] font-bold text-gray-900">
                              Our Vision
                            </h3>
                          </div>
                          <div
                            className="text-[14.5px] leading-[1.7] text-gray-600 rich-text"
                            dangerouslySetInnerHTML={{
                              __html: safeHtml(aboutData.vision as string),
                            }}
                          />
                        </div>
                      )}
                      {aboutData?.mission && (
                        <div className="rounded-md border border-gray-100 bg-[#f0fdf4] p-8">
                          <div className="mb-4 flex items-center gap-3.5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100/80 text-green-600">
                              <Target className="h-5 w-5" />
                            </div>
                            <h3 className="text-[16px] font-bold text-gray-900">
                              Our Mission
                            </h3>
                          </div>
                          <div
                            className="text-[14.5px] leading-[1.7] text-gray-600 rich-text"
                            dangerouslySetInnerHTML={{
                              __html: safeHtml(aboutData.mission as string),
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {overviewList.length > 0 && (
                    <div className="overflow-hidden rounded-md border border-gray-100 bg-white">
                      <div className="border-b border-gray-100 bg-[#f8fafc] px-6 py-4">
                        <h3 className="flex items-center gap-2 text-[16px] font-bold text-gray-900">
                          <Landmark className="h-5 w-5 text-blue-600" />{" "}
                          University Overview
                        </h3>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {overviewList.map((row: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex flex-col p-4 transition-colors hover:bg-gray-50 sm:flex-row"
                          >
                            <div className="w-full text-[14px] font-semibold text-gray-800 sm:w-1/3">
                              {row.label || row.key || row.field}
                            </div>
                            <div
                              className="w-full text-[14px] text-gray-600 sm:w-2/3 rich-text"
                              dangerouslySetInnerHTML={{
                                __html: safeHtml(
                                  row.value || row.val || String(row),
                                ),
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {leadershipList.length > 0 && (
                    <div className="overflow-hidden rounded-md border border-gray-100 bg-white">
                      <div className="border-b border-gray-100 bg-[#f8fafc] px-6 py-4">
                        <h3 className="flex items-center gap-2 text-[16px] font-bold text-gray-900">
                          <Users className="h-5 w-5 text-blue-600" /> Leadership
                          & Administration
                        </h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-[14px] text-gray-600">
                          <thead className="border-b border-gray-100 bg-gray-50/50 text-[13px] uppercase tracking-wider text-gray-800">
                            <tr>
                              <th className="px-6 py-4 font-bold">Position</th>
                              <th className="px-6 py-4 font-bold">Role</th>
                              <th className="px-6 py-4 font-bold">
                                Current Holder
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {leadershipList.map((row: any, idx: number) => (
                              <tr key={idx}>
                                <td className="px-6 py-4 font-bold text-gray-900">
                                  {row.position || row.title}
                                </td>
                                <td className="px-6 py-4">{row.role || ""}</td>
                                <td className="px-6 py-4 font-semibold">
                                  {row.holder || row.name || row.person}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ========== COURSES & FEES ========== */}
              {activeTab === "tab-courses" && (
                <div className="overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-[#f4f8fc] px-6 py-4">
                    <p className="text-[14px] font-semibold tracking-wide text-blue-600">
                      Courses & fees – filter by level
                    </p>
                    <div className="flex gap-2 text-xs font-medium">
                      {["all", "Bachelor's", "Master"].map((level) => (
                        <button
                          key={level}
                          onClick={() => setCourseFilter(level)}
                          className={`rounded-full px-4 py-1.5 shadow-sm transition-colors ${
                            courseFilter === level
                              ? "bg-blue-600 text-white"
                              : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {level === "all" ? "All" : level}
                        </button>
                      ))}
                    </div>
                  </div>
                  {coursesList.length > 0 ? (
                    <>
                      {/* Desktop header */}
                      <div className="hidden sm:grid sm:grid-cols-12 gap-4 border-b border-gray-100 bg-white px-6 py-5 items-center">
                        <div className="sm:col-span-4 text-[13px] font-bold uppercase tracking-wider text-gray-800">
                          COURSES NAME
                        </div>
                        <div className="sm:col-span-2 text-[13px] font-bold uppercase tracking-wider text-gray-800">
                          DURATION
                        </div>
                        <div className="sm:col-span-3 text-[13px] font-bold uppercase tracking-wider text-gray-800">
                          FEES / YEAR
                        </div>
                        <div className="sm:col-span-3 text-[13px] font-bold uppercase tracking-wider text-gray-800">
                          ELIGIBILITY & SEAT
                        </div>
                      </div>
                      {coursesList
                        .filter(
                          (c: any) =>
                            courseFilter === "all" || c.level === courseFilter,
                        )
                        .map((course: any, i: number) => (
                          <div
                            key={i}
                            className="border-b border-gray-100 px-6 py-5 transition-colors hover:bg-gray-50/50"
                          >
                            {/* Mobile card view */}
                            <div className="sm:hidden space-y-3">
                              <h4 className="text-[15.5px] font-bold text-gray-900">
                                {course.name}
                              </h4>
                              {course.sub_description ? (
                                <p className="text-[12px] text-gray-500">
                                  {course.sub_description}
                                </p>
                              ) : null}
                              <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
                                <div>
                                  <span className="text-gray-400">
                                    Duration:{" "}
                                  </span>
                                  <span className="font-semibold text-gray-900">
                                    {course.duration}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-400">Fee: </span>
                                  <span className="font-semibold text-[#2563eb]">
                                    {course.fees} / Year
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-400">
                                    Eligibility:{" "}
                                  </span>
                                  <span className="text-gray-600">
                                    {course.eligibility}
                                  </span>
                                </div>
                                {course.seats ? (
                                  <div>
                                    <span className="inline-block rounded bg-[#eafaef] px-2.5 py-1 text-[11px] font-bold text-[#16a34a]">
                                      {course.seats}
                                    </span>
                                  </div>
                                ) : null}
                              </div>
                            </div>
                            {/* Desktop grid view */}
                            <div className="hidden sm:grid sm:grid-cols-12 gap-4 items-center">
                              <div className="sm:col-span-4 pr-4">
                                <h4 className="text-[15.5px] font-bold text-gray-900">
                                  {course.name}
                                </h4>
                                <p className="mt-1 text-[12px] text-gray-500">
                                  {course.sub_description || ""}
                                </p>
                              </div>
                              <div className="sm:col-span-2">
                                <h4 className="text-[15.5px] font-bold text-gray-900">
                                  {course.duration}
                                </h4>
                                <p className="mt-1 text-[12px] text-gray-500">
                                  {course.durationSub || ""}
                                </p>
                              </div>
                              <div className="sm:col-span-3">
                                <h4 className="text-[15.5px] font-bold text-[#2563eb]">
                                  {course.fees}
                                </h4>
                                <p className="mt-1 text-[12px] text-gray-500">
                                  / Year
                                </p>
                              </div>
                              <div className="sm:col-span-3">
                                <p className="mb-2 text-[12.5px] font-medium text-gray-600">
                                  {course.eligibility}
                                </p>
                                <span className="inline-block rounded bg-[#eafaef] px-2.5 py-1 text-[11px] font-bold text-[#16a34a]">
                                  {course.seats}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </>
                  ) : (
                    <EmptyTabState tabName="Courses" />
                  )}
                </div>
              )}

              {/* ========== INSTITUTE / FACULTIES ========== */}
              {activeTab === "tab-institutes" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-[20px] font-bold text-gray-900">Institutes & Faculties</h3>
                    <p className="mt-1 text-[13px] text-gray-500">Constituent and affiliated campuses</p>
                  </div>
                  {institutesList.length > 0 ? (
                    <div className="space-y-8">
                      {institutesList.map((fac: any, idx: number) => (
                        <div key={idx} className="overflow-hidden rounded-md border border-gray-100 bg-white">
                          <div className="flex items-center justify-between border-b border-gray-100 bg-[#f8fafc] px-6 py-4">
                            <h4 className="text-[16px] font-bold text-gray-900">{fac.name || `Faculty ${idx + 1}`}</h4>
                            {(fac.colleges && fac.colleges.length > 0) && (
                              <button
                                onClick={() => toggleDropdown(`fac-colleges-${idx}`)}
                                className="text-xs font-semibold text-brand-blue hover:underline flex items-center gap-1"
                              >
                                <Building2 className="h-3.5 w-3.5" />
                                View Colleges ({fac.colleges.length})
                              </button>
                            )}
                          </div>
                          {openDropdowns[`fac-colleges-${idx}`] && (
                            <div className="border-b border-gray-100 px-6 py-4 bg-gray-50/50">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b border-gray-200">
                                    <th className="px-3 py-2 text-left text-[12px] font-bold uppercase text-gray-600 w-10">SN</th>
                                    <th className="px-3 py-2 text-left text-[12px] font-bold uppercase text-gray-600">College Name</th>
                                    <th className="px-3 py-2 text-left text-[12px] font-bold uppercase text-gray-600">Location</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                  {fac.colleges.map((c: any, ci: number) => (
                                    <tr key={c.id || ci}>
                                      <td className="px-3 py-2.5 text-[13px] text-gray-500">{ci + 1}</td>
                                      <td className="px-3 py-2.5 text-[13px] font-medium text-gray-900">{c.name}</td>
                                      <td className="px-3 py-2.5 text-[13px] text-gray-600">{c.location || "-"}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                          {fac.programs && fac.programs.length > 0 && (
                            <div className="overflow-x-auto">
                              <div className="min-w-[600px]">
                                <div className="grid grid-cols-12 gap-2 border-b border-gray-100 bg-white px-6 py-3">
                                  <div className="col-span-1 text-[12px] font-bold uppercase tracking-wider text-gray-600">SN</div>
                                  <div className="col-span-5 text-[12px] font-bold uppercase tracking-wider text-gray-600">PROGRAM</div>
                                  <div className="col-span-3 text-[12px] font-bold uppercase tracking-wider text-gray-600">DURATION</div>
                                  <div className="col-span-3 text-[12px] font-bold uppercase tracking-wider text-gray-600">YEARLY/SEMESTER</div>
                                </div>
                                <div className="divide-y divide-gray-100">
                                  {fac.programs.map((p: any, pi: number) => (
                                    <div key={p.id || pi} className="grid grid-cols-12 gap-2 px-6 py-3 hover:bg-gray-50/50 items-center">
                                      <div className="col-span-1 text-[13px] text-gray-500">{pi + 1}</div>
                                      <div className="col-span-5 text-[14px] font-medium text-gray-900">{p.name}</div>
                                      <div className="col-span-3 text-[13px] text-gray-600">{p.duration || "-"}</div>
                                      <div className="col-span-3 text-[13px] text-gray-600">{p.fee || "-"}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                          {(!fac.programs || fac.programs.length === 0) && (!fac.colleges || fac.colleges.length === 0) && (
                            <div className="px-6 py-4 text-sm text-gray-400">No programs or colleges added for this faculty.</div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyTabState tabName="Institutes" />
                  )}
                </div>
              )}

              {activeTab === "tab-admissions" && (
                <div className="overflow-hidden rounded-md border border-gray-100 bg-white">
                  <div className="border-b border-gray-100 bg-[#f8fafc] px-6 py-4">
                    <h3 className="flex items-center gap-2 text-[16px] font-bold text-gray-900">
                      Admissions
                    </h3>
                  </div>
                  {admissionsList.length > 0 ? (
                    <div className="w-full overflow-x-auto">
                      <div className="min-w-[700px]">
                        <div className="grid grid-cols-12 gap-2 border-b border-gray-100 bg-white px-6 py-5">
                          <div className="col-span-4 text-[13px] font-bold uppercase tracking-wider text-gray-800">PROGRAM</div>
                          <div className="col-span-1 text-[13px] font-bold uppercase tracking-wider text-gray-800">STATUS</div>
                          <div className="col-span-2 text-[13px] font-bold uppercase tracking-wider text-gray-800">OPENS</div>
                          <div className="col-span-2 text-[13px] font-bold uppercase tracking-wider text-gray-800">DEADLINE</div>
                          <div className="col-span-1 text-[13px] font-bold uppercase tracking-wider text-gray-800">APPL. FEE</div>
                          <div className="col-span-2 text-[13px] font-bold uppercase tracking-wider text-gray-800">APPLY</div>
                        </div>
                        <div className="divide-y divide-gray-100">
                          {admissionsList.map((ad: any, i: number) => (
                            <div key={i} className="grid grid-cols-12 gap-2 px-6 py-5 hover:bg-gray-50/50 items-center">
                              <div className="col-span-4">
                                <h4 className="text-[15.5px] font-bold text-gray-900">{ad.program || ad.title}</h4>
                                {ad.faculty && <p className="text-[13px] text-gray-500">{ad.faculty}</p>}
                              </div>
                              <div className="col-span-1">
                                <span className={`inline-block rounded-md px-2.5 py-1 text-[11px] font-bold whitespace-nowrap ${ad.status === "Open" || ad.status === "Ongoing" ? "bg-[#ecfdf5] text-[#10b981]" : "bg-[#fef2f2] text-[#ef4444]"}`}>
                                  {ad.status}
                                </span>
                              </div>
                              <div className="col-span-2 text-[14px] text-gray-600">{ad.opens_from || "-"}</div>
                              <div className="col-span-2 text-[14px] text-gray-600">{ad.deadline || "-"}</div>
                              <div className="col-span-1 text-[14px] font-semibold text-gray-900">{ad.fee || "-"}</div>
                              <div className="col-span-2">
                                {ad.application_link ? (
                                  <a href={ad.application_link} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline font-semibold text-[13px]">
                                    Apply Now
                                  </a>
                                ) : (
                                  <span className="text-gray-400 text-[13px]">Apply Now</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <EmptyTabState tabName="Admissions" />
                  )}
                </div>
              )}

              {/* ========== OFFERED PROGRAM ========== */}
              {/* ========== SCHOLARSHIP ========== */}
              {activeTab === "tab-scholarship" && (
                <div className="overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-[#f4f8fc] px-6 py-4">
                    <p className="text-[14px] font-semibold tracking-wide text-blue-600">
                      Scholarship opportunities – filter by level
                    </p>
                    <div className="flex gap-2 text-xs font-medium">
                      {["all", "+2", "Bachelor", "Master"].map((level) => (
                        <button
                          key={level}
                          onClick={() => setScholarFilter(level)}
                          className={`rounded-full px-4 py-1.5 shadow-sm transition-colors ${
                            scholarFilter === level
                              ? "bg-blue-600 text-white"
                              : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {level === "all" ? "All" : level}
                        </button>
                      ))}
                    </div>
                  </div>
                  {scholarshipsList.length > 0 ? (
                    <>
                      {/* Desktop header */}
                      <div className="hidden sm:grid sm:grid-cols-12 gap-4 border-b border-gray-100 bg-white px-6 py-5 items-center">
                        <div className="sm:col-span-2 text-[13px] font-bold uppercase tracking-wider text-gray-800">
                          PROGRAM
                        </div>
                        <div className="sm:col-span-2 text-[13px] font-bold uppercase tracking-wider text-gray-800">
                          SCHOLARSHIP
                        </div>
                        <div className="sm:col-span-2 text-[13px] font-bold uppercase tracking-wider text-gray-800">
                          BENEFIT
                        </div>
                        <div className="sm:col-span-3 text-[13px] font-bold uppercase tracking-wider text-gray-800">
                          FOR WHOM
                        </div>
                        <div className="sm:col-span-3 text-[13px] font-bold uppercase tracking-wider text-gray-800"></div>
                      </div>
                      {scholarshipsList
                        .filter(
                          (s: any) =>
                            scholarFilter === "all" ||
                            s.level === scholarFilter,
                        )
                        .map((sch: any, i: number) => (
                          <div
                            key={i}
                            className="border-b border-gray-100 px-6 py-5 transition-colors hover:bg-gray-50/50"
                          >
                            {/* Mobile card view */}
                            <div className="sm:hidden space-y-3">
                              <h4 className="text-[15px] font-bold text-gray-900">
                                {sch.name || sch.title || ""}
                              </h4>
                              <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
                                {sch.program ? (
                                  <div>
                                    <span className="text-gray-400">
                                      Program:{" "}
                                    </span>
                                    <span className="font-semibold text-gray-900">
                                      {sch.program}
                                    </span>
                                  </div>
                                ) : null}
                                {sch.benefit ? (
                                  <div>
                                    <span className="text-gray-400">
                                      Benefit:{" "}
                                    </span>
                                    <span className="font-medium text-green-600">
                                      {sch.benefit}
                                    </span>
                                  </div>
                                ) : null}
                                {sch.forWhom || sch.eligibility ? (
                                  <div>
                                    <span className="text-gray-400">For: </span>
                                    <span className="text-gray-600">
                                      {sch.forWhom || sch.eligibility}
                                    </span>
                                  </div>
                                ) : null}
                              </div>
                              <button className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700">
                                Get Scholarship
                              </button>
                            </div>
                            {/* Desktop grid view */}
                            <div className="hidden sm:grid sm:grid-cols-12 gap-4 items-center">
                              <div className="sm:col-span-2">
                                <h4 className="text-[14px] font-bold text-gray-900">
                                  {sch.program || ""}
                                </h4>
                              </div>
                              <div className="sm:col-span-2">
                                <h4 className="text-[14px] font-bold text-gray-900">
                                  {sch.name || sch.title || ""}
                                </h4>
                              </div>
                              <div className="sm:col-span-2">
                                <span className="text-[13px] font-medium text-green-600">
                                  {sch.benefit || ""}
                                </span>
                              </div>
                              <div className="sm:col-span-3">
                                <span className="text-[13px] text-gray-600">
                                  {sch.forWhom || sch.eligibility || ""}
                                </span>
                              </div>
                              <div className="sm:col-span-3">
                                <button className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700">
                                  Get Scholarship
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </>
                  ) : (
                    <EmptyTabState tabName="Scholarship" />
                  )}
                </div>
              )}

              {/* ========== EVENTS ========== */}
              {activeTab === "tab-events" && (
                <div>
                  {uniEventsLoading ? <div className="py-12 text-center text-slate-500">Loading events...</div> :
                  (uniEvents.length > 0 || eventsList.length > 0) ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {(uniEvents.length > 0 ? uniEvents : eventsList).map((ev: any, i: number) => (
                        <div
                          key={i}
                          className="flex flex-col overflow-hidden rounded-md border border-gray-200 bg-white transition-colors hover:border-blue-500/20 duration-300"
                        >
                          <div className="h-35 w-full overflow-hidden p-4">
                            <img
                              src={ev.image || ""}
                              alt={ev.title}
                              className="h-full w-full rounded-md object-cover"
                            />
                          </div>
                          <div className="flex grow flex-col p-5">
                            <div className="mb-3 flex items-center justify-between">
                              <span className="rounded-full bg-teal-500 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                                {ev.month || ""}
                              </span>
                              <span className="flex items-center text-xs font-semibold text-gray-500">
                                <i className="fa-regular fa-calendar mr-1.5"></i>{" "}
                                {ev.date || ""} {ev.month || ""}
                              </span>
                            </div>
                            <h4 className="mb-3 text-left text-lg font-bold leading-tight text-black hover:text-[#0000ff]">
                              {ev.title}
                            </h4>
                            <div className="mb-2 flex items-center text-xs font-semibold text-gray-600">
                              <i className="fa-regular fa-building mr-2 text-gray-500"></i>
                              University Central
                            </div>
                            <div className="mb-3 flex items-center text-xs font-semibold text-gray-600">
                              <i className="fa-solid fa-location-dot mr-2 text-gray-500"></i>
                              {ev.location || "Central Campus"}
                            </div>
                            <p className="mb-5 line-clamp-3 text-xs font-medium leading-relaxed text-gray-500">
                              {ev.description || ev.desc || ""}
                            </p>
                            <div className="mt-auto flex gap-2">
                              <button className="flex-1 rounded-md border border-gray-300 bg-white py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50">
                                Details
                              </button>
                              <button className="flex-1 rounded-md bg-brand-blue py-2 text-sm font-bold text-white transition-colors hover:bg-blue-600">
                                Register Now
                              </button>
                              <button className="flex w-10 shrink-0 items-center justify-center rounded-md border border-gray-200 transition-colors hover:bg-gray-50">
                                <i className="fa-regular fa-bookmark text-gray-400"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyTabState tabName="Events" />
                  )}
                </div>
              )}

              {/* ========== NEWS & NOTICES ========== */}
              {activeTab === "tab-news" && (
                <div>
                  {uniNewsLoading ? <div className="py-12 text-center text-slate-500">Loading news...</div> :
                  (uniNews.length > 0 || newsList.length > 0) ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {(uniNews.length > 0 ? uniNews : newsList).map((item: any, i: number) => (
                        <div
                          key={i}
                          className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
                        >
                          <div className="flex flex-1 flex-col p-5">
                            <div className="mb-4">
                              <span className="inline-block rounded-full bg-blue-100 px-3.5 py-1 text-[12px] font-bold text-blue-700">
                                {item.tag || "News"}
                              </span>
                            </div>
                            <div className="mb-4 h-[140px] w-full shrink-0 overflow-hidden rounded-xl">
                              <img
                                src={item.image || item.img || ""}
                                alt=""
                                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                              />
                            </div>
                            <h3 className="mb-2 text-[17px] font-bold leading-tight text-gray-900">
                              {item.title}
                            </h3>
                            <p className="mb-2 line-clamp-2 text-[13.5px] text-gray-500">
                              {item.description || item.desc || ""}
                            </p>
                          </div>
                          <div className="mt-auto flex items-center justify-between border-t border-gray-50 bg-white px-5 py-4">
                            <div className="flex items-center gap-1.5 text-gray-400">
                              <Clock className="h-4 w-4" />
                              <span className="text-[12.5px] font-medium">
                                {item.time || item.date || ""}
                              </span>
                            </div>
                            <a
                              href="#"
                              className="flex items-center text-[13px] font-bold text-blue-600 transition-colors hover:text-blue-700"
                            >
                              Read more{" "}
                              <ChevronRight className="ml-0.5 h-4 w-4" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyTabState tabName="News & Notices" />
                  )}
                </div>
              )}

              {/* ========== DOWNLOAD ========== */}
              {activeTab === "tab-download" && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h3 className="mb-5 flex items-center gap-3 border-b border-gray-100 pb-3 text-[20px] font-bold text-gray-900">
                      <Download className="h-6 w-6 text-blue-600" /> Brochures &
                      Forms
                    </h3>
                    {downloadsList.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {downloadsList.map((dl: any, i: number) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 rounded-xl border border-gray-100 bg-[#f8fafc] p-5 transition-all hover:border-blue-200"
                          >
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                              <FileDown className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-[15px] font-bold text-gray-900">
                                {dl.title || dl.name}
                              </h4>
                              <p className="mb-2 text-[12px] text-gray-500">
                                {dl.meta || dl.description || dl.size || ""}
                              </p>
                              <a
                                href={dl.url || dl.link || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-[13px] font-bold text-blue-600 transition-colors hover:text-blue-700"
                              >
                                <FileDown className="h-4 w-4" /> Download
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyTabState tabName="Download" />
                    )}
                  </div>
                </div>
              )}

              {/* ========== GALLERY ========== */}
              {activeTab === "tab-gallery" && (
                <div>
                  {galleryList.length > 0 ? (
                    (() => {
                      const groups = new Map<string, string[]>();
                      for (const img of galleryList) {
                        if ((img as any).images) {
                          const folder = (img as any).folder || "Gallery";
                          for (const sub of (img as any).images) {
                            const url = sub.url || sub.image || sub.src;
                            if (url) {
                              if (!groups.has(folder)) groups.set(folder, []);
                              groups.get(folder)!.push(url);
                            }
                          }
                        } else {
                          const folder = (img as any).folder || (img as any).group || "Gallery";
                          const url = (img as any).url || (img as any).image || (img as any).src;
                          if (url) {
                            if (!groups.has(folder)) groups.set(folder, []);
                            groups.get(folder)!.push(url);
                          }
                        }
                      }
                      const allFolders = Array.from(groups.keys());
                      const galImages = galFolder === "all"
                        ? Array.from(groups.values()).flat()
                        : groups.get(galFolder) || [];

                      return (
                        <div>
                          <div className="mb-6">
                            <h2 className="text-[20px] font-bold text-gray-900">Campus Gallery</h2>
                          </div>
                          {allFolders.length > 1 && (
                            <div className="mb-6 flex flex-wrap gap-2">
                              <button
                                onClick={() => setGalFolder("all")}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition ${galFolder === "all" ? "bg-brand-blue text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                              >
                                All
                              </button>
                              {allFolders.map((f) => (
                                <button
                                  key={f}
                                  onClick={() => setGalFolder(f)}
                                  className={`px-4 py-2 rounded-md text-sm font-medium transition ${galFolder === f ? "bg-brand-blue text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                                >
                                  {f}
                                </button>
                              ))}
                            </div>
                          )}
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                            {galImages.slice(0, galCount).map((url, idx) => (
                              <div
                                key={url}
                                className="aspect-[16/10] overflow-hidden rounded-md cursor-pointer bg-brand-blue"
                                onClick={() => setGalIdx(idx)}
                              >
                                <img
                                  src={url}
                                  className="h-full w-full object-cover transition duration-300 hover:scale-105"
                                  alt="Gallery"
                                />
                              </div>
                            ))}
                          </div>
                          {galCount < galImages.length && (
                            <div className="mt-8 text-center">
                              <button
                                className="rounded-md bg-brand-blue px-8 py-3 text-sm font-bold text-white hover:bg-brand-hover transition"
                                onClick={() => setGalCount((p) => p + 9)}
                              >
                                Load More
                              </button>
                            </div>
                          )}
                          {galIdx !== null && (
                            <div
                              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
                              onClick={() => setGalIdx(null)}
                            >
                              <button
                                className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                                onClick={(e) => { e.stopPropagation(); setGalIdx((p) => p === 0 ? galImages.length - 1 : (p as number) - 1); }}
                              >
                                <i className="fa-solid fa-chevron-left text-xl"></i>
                              </button>
                              <img
                                src={galImages[galIdx]}
                                alt="Gallery preview"
                                className="max-h-[90vh] max-w-[90vw] object-contain"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <button
                                className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                                onClick={(e) => { e.stopPropagation(); setGalIdx((p) => p === galImages.length - 1 ? 0 : (p as number) + 1); }}
                              >
                                <i className="fa-solid fa-chevron-right text-xl"></i>
                              </button>
                              <button
                                className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                                onClick={() => setGalIdx(null)}
                              >
                                <i className="fa-solid fa-xmark text-xl"></i>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })()
                  ) : (
                    <EmptyTabState tabName="Gallery" />
                  )}
                </div>
              )}

              {/* ========== REVIEW ========== */}
              {activeTab === "tab-review" && (
                <div>
                  {reviewsLoading ? (
                    <div className="animate-pulse space-y-4 py-8">
                      <div className="flex items-center gap-6">
                        <div className="h-20 w-20 rounded-full bg-gray-200" />
                        <div className="space-y-2">
                          <div className="h-4 w-40 rounded bg-gray-200" />
                          <div className="h-3 w-24 rounded bg-gray-200" />
                        </div>
                      </div>
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-2 rounded-lg border border-gray-100 p-4">
                          <div className="h-4 w-48 rounded bg-gray-200" />
                          <div className="h-3 w-full rounded bg-gray-100" />
                          <div className="h-3 w-3/4 rounded bg-gray-100" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="mb-8 flex flex-col items-center gap-8 rounded-md border border-gray-200 bg-white p-8 md:flex-row">
                        <div className="text-center md:border-r md:pr-8 md:text-left">
                          <h2 className="mb-2 text-5xl font-extrabold text-gray-900">
                            {reviewsData?.overall_rating?.toFixed(1) || uni?.rating?.toFixed(1) || "0.0"}
                          </h2>
                          <div className="mb-2 flex items-center justify-center gap-1 md:justify-start">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <i
                                key={idx}
                                className={`fa-solid fa-star text-[14px] ${idx < Math.round(reviewsData?.overall_rating || uni?.rating || 0) ? "text-yellow-400" : "text-gray-300"}`}
                              ></i>
                            ))}
                          </div>
                          <p className="text-[13px] font-medium text-gray-500">
                            Based on {reviewsData?.review_count || uni?.review_count || 0} reviews
                          </p>
                        </div>
                        <div className="w-full flex-1 space-y-2.5">
                          {[5, 4, 3, 2, 1].map((star) => {
                            const dist = reviewsData?.distribution || {};
                            const count = dist[star] || 0;
                            const total = reviewsData?.review_count || 1;
                            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                            return (
                              <RatingBar
                                key={star}
                                label={String(star)}
                                width={`${pct}%`}
                                color={star >= 4 ? "bg-green-500" : star >= 3 ? "bg-yellow-400" : "bg-orange-400"}
                                pct={`${pct}%`}
                              />
                            );
                          })}
                        </div>
                      </div>

                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-[18px] font-bold text-gray-900">
                          Recent Reviews
                        </h3>
                        <button
                          onClick={() => setShowReviewForm(!showReviewForm)}
                          className="text-sm font-medium text-brand-blue hover:text-brand-hover"
                        >
                          {showReviewForm ? "Cancel" : "Write a Review"}
                        </button>
                      </div>

                      {showReviewForm && (
                        <div className="mb-6 rounded-md border border-gray-200 bg-white p-6">
                          <h4 className="mb-4 text-[16px] font-bold text-gray-900">
                            {myReview ? "Edit Your Review" : "Write Your Review"}
                          </h4>
                          <div className="mb-4">
                            <label className="mb-2 block text-sm font-medium text-gray-700">Rating</label>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setReviewRating(star)}
                                  className="text-2xl transition-colors hover:scale-110"
                                >
                                  <i className={`${star <= (reviewRating || myReview?.rating) ? "fa-solid text-yellow-400" : "fa-regular text-gray-300"} fa-star`}></i>
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="mb-4">
                            <label className="mb-2 block text-sm font-medium text-gray-700">Review</label>
                            <textarea
                              className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none"
                              rows={4}
                              placeholder="Share your experience about this university..."
                              value={reviewText}
                              onChange={(e) => setReviewText(e.target.value)}
                            />
                          </div>
                          {submitError && (
                            <p className="mb-3 text-sm text-red-500">{submitError}</p>
                          )}
                          <button
                            onClick={handleSubmitReview}
                            disabled={submittingReview || !reviewRating || !reviewText.trim()}
                            className="rounded-md bg-brand-blue px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-hover disabled:opacity-50"
                          >
                            {submittingReview ? "Submitting..." : myReview ? "Update Review" : "Submit Review"}
                          </button>
                        </div>
                      )}

                      <div className="space-y-5">
                        {reviewsData?.reviews?.length > 0 ? (
                          reviewsData.reviews.map((review: any, idx: number) => {
                            const rating = review.ratings?.overall || Object.values(review.ratings || {}).reduce((s: number, v: any) => s + v, 0) / 10 || 5;
                            return (
                              <ReviewCard
                                key={review.id}
                                initials={review.userInitials || "U"}
                                name={review.userName || "Anonymous"}
                                subtitle="University Review"
                                rating={Math.round(rating)}
                                pros={review.summaryTitle || review.pros || ""}
                                cons={review.cons || ""}
                                tone={idx % 2 === 0 ? "blue" : "purple"}
                              />
                            );
                          })
                        ) : (
                          <EmptyTabState tabName="Reviews" actionLabel="Write a Review" onAction={() => setShowReviewForm(true)} />
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - matching college details page */}
            {/* Right Column - matching college details page */}
            <div className="space-y-6 lg:col-span-1 lg:w-full lg:max-w-[400px] lg:ml-8 xl:ml-12">
              {(() => {
                const hasAddress = !!contactData?.address;
                const hasPhone = !!contactData?.phone;
                const hasEmail = !!contactData?.email;
                const hasWebsite = !!(contactData?.website || uni?.website);
                const hasSocial = !!(contactData?.social ||
                  contactData?.facebook ||
                  contactData?.twitter ||
                  contactData?.instagram ||
                  contactData?.youtube ||
                  contactData?.linkedin);
                const hasMap = !!(contactData?.mapUrl || contactData?.address);
                const hasAny = hasAddress || hasPhone || hasEmail || hasWebsite || hasSocial || hasMap;
                if (!hasAny) return null;
                return (
                  <div className="w-full rounded-md border border-gray-100 bg-white p-5">
                    <h3 className="mb-5 text-[18px] font-bold text-gray-900">
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      {hasAddress && (
                        <ContactInfoRow
                          icon="fa-solid fa-location-dot"
                          title="Address"
                          value={contactData?.address as string}
                          badge="bg-brand-blue/5 text-[#0000FF]"
                        />
                      )}
                      {hasPhone && (
                        <ContactInfoRow
                          icon="fa-solid fa-phone"
                          title="Phone"
                          value={contactData?.phone as string}
                          badge="bg-emerald-50 text-emerald-600"
                        />
                      )}
                      {hasEmail && (
                        <ContactInfoRow
                          icon="fa-solid fa-envelope"
                          title="Email"
                          value={contactData?.email as string}
                          badge="bg-red-50 text-red-500"
                          link
                          linkHref={`mailto:${contactData?.email || ""}`}
                        />
                      )}
                      {hasWebsite && (
                        <ContactInfoRow
                          icon="fa-solid fa-globe"
                          title="Website"
                          value={(contactData?.website as string) || uni?.website || ""}
                          badge="bg-purple-50 text-purple-600"
                          link
                          linkHref={(contactData?.website as string) || uni?.website || "#"}
                        />
                      )}
                      {hasSocial && (
                        <div className="w-full">
                          <h3 className="text-[15px] font-bold text-gray-900">
                            Social Media
                          </h3>
                          <div className="mt-3 flex gap-5 text-[26px]">
                            {(contactData?.facebook as string) && (
                              <a
                                href={contactData.facebook as string}
                                className="text-[#1877F2] transition-transform hover:scale-110"
                                title="Facebook"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <i className="fa-brands fa-facebook"></i>
                              </a>
                            )}
                            {(contactData?.instagram as string) && (
                              <a
                                href={contactData.instagram as string}
                                className="text-[#E4405F] transition-transform hover:scale-110"
                                title="Instagram"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <i className="fa-brands fa-instagram"></i>
                              </a>
                            )}
                            {(contactData?.tiktok as string) && (
                              <a
                                href={contactData.tiktok as string}
                                className="text-black transition-transform hover:scale-110"
                                title="TikTok"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <i className="fa-brands fa-tiktok"></i>
                              </a>
                            )}
                            {(contactData?.youtube as string) && (
                              <a
                                href={contactData.youtube as string}
                                className="text-[#FF0000] transition-transform hover:scale-110"
                                title="YouTube"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <i className="fa-brands fa-youtube"></i>
                              </a>
                            )}
                            {(contactData?.linkedin as string) && (
                              <a
                                href={contactData.linkedin as string}
                                className="text-[#0A66C2] transition-transform hover:scale-110"
                                title="LinkedIn"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <i className="fa-brands fa-linkedin"></i>
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                      {hasMap && (
                        <div className="mt-8 h-40 w-full overflow-hidden rounded-md">
                          <iframe
                            src={
                              (contactData?.mapUrl as string) ||
                              `https://www.google.com/maps?q=${encodeURIComponent((contactData?.address as string) || "")}&output=embed`
                            }
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="rounded-md"
                          ></iframe>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {uni?.quick &&
                Array.isArray(uni.quick) &&
                uni.quick.length > 0 && (
                  <div className="w-full rounded-md border border-gray-100 bg-white p-5">
                    <h3 className="mb-5 text-[18px] font-bold text-gray-900">
                      Quick Highlights
                    </h3>
                    <div className="space-y-4">
                      {uni.quick.map((h: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div>
                            <span className="block text-gray-900 font-bold text-[13px]">{h.key || h.label || h.title}</span>
                            <span className="text-gray-500 font-medium text-[12px]">{h.value || h.val || h.description || h.text || h.desc || ""}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

      <ShareCollegeModal
        collegeName={name}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareUrl={shareUrl}
        shareTitle={shareTitle}
        shareText={shareText}
      />

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
                onClick={() => {
                  setIsFollowed(false);
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

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute right-8 top-5 z-[1001] cursor-pointer text-[40px] text-white hover:text-gray-300"
          >
            &times;
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              changeImage(-1);
            }}
            className="absolute left-3 top-1/2 z-[1001] -translate-y-1/2 cursor-pointer px-3 py-3 text-[30px] text-white select-none hover:text-gray-300 md:left-5 md:px-5 md:py-5 md:text-[50px]"
          >
            &#10094;
          </button>
          <img
            src={
              (galleryList[lightboxIndex] as any)?.url ||
              (galleryList[lightboxIndex] as any)?.image ||
              (galleryList[lightboxIndex] as any)?.src ||
              ""
            }
            alt={
              (galleryList[lightboxIndex] as any)?.title ||
              (galleryList[lightboxIndex] as any)?.alt ||
              "Gallery"
            }
            className="max-h-[85vh] max-w-[90%] rounded-md object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              changeImage(1);
            }}
            className="absolute right-3 top-1/2 z-[1001] -translate-y-1/2 cursor-pointer px-3 py-3 text-[30px] text-white select-none hover:text-gray-300 md:right-5 md:px-5 md:py-5 md:text-[50px]"
          >
            &#10095;
          </button>
        </div>
      )}
    </>
  );
};

export default UniversityDetail;
