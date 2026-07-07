"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
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
  const [activeTab, setActiveTab] = useState<TabKey>("tab-about");
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

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    apiService
      .getUniversityById(id)
      .then((res) => {
        setUniversity(res.data.university);
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

  const videoUrl = (aboutData?.video_url as string) || "";
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
          className="h-[220px] w-full bg-brand-blue bg-cover bg-center md:h-[360px]"
          style={
            uni?.cover ? { backgroundImage: `url(${uni.cover})` } : undefined
          }
        />

        <div className="relative bg-white">
          <div className="relative mx-auto max-w-[1400px] pb-8">
            {/* Logo */}
            <div className="absolute -top-2 left-6 z-10 flex h-[120px] w-[120px] items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-white p-2 shadow-[0_4px_20px_-3px_rgba(0,0,0,0.1)] md:-top-4 md:h-[150px] md:w-[150px]">
              {uni?.logo ? (
                <Image
                  src={uni.logo}
                  alt={`${name} logo`}
                  width={150}
                  height={150}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-3xl font-bold text-gray-400">
                  {name.charAt(0)}
                </div>
              )}
            </div>

            {/* Profile Header */}
            <div className="flex flex-col items-start justify-between pt-20 lg:flex-row lg:items-end lg:pt-6 lg:ml-[180px]">
              <div className="w-full space-y-3 lg:w-auto">
                <div className="flex items-center gap-2">
                  <h1 className="text-[24px] font-bold tracking-tight text-gray-900 md:text-3xl">
                    {name}
                  </h1>
                  {uni?.verified && (
                    <BadgeCheck className="h-6 w-6 fill-blue-500 text-white" />
                  )}
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  <Star className="h-4 w-4 fill-blue-500 text-blue-500" />
                  <span className="text-[14px] font-bold text-gray-900">
                    {uni?.rating ?? "—"}
                  </span>
                  <span className="text-[14px] text-gray-500">
                    ({uni?.review_count ?? 0} Reviews)
                  </span>
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
                  className={`flex items-center justify-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors ${
                    isFollowed
                      ? "bg-green-300 text-gray-800 hover:bg-green-400"
                      : "bg-brand-blue text-white hover:bg-brand-hover"
                  }`}
                >
                  <i
                    className={`fa-solid ${isFollowed ? "fa-check" : "fa-plus"}`}
                  ></i>
                  {isFollowed ? "Following" : "Follow"}
                </button>
              </div>

              <div className="mt-8 flex w-full items-center gap-3 lg:mt-0 lg:w-auto">
                <Link
                  href={`/universities/${name.toLowerCase().replace(/\s+/g, "-")}/affiliated-colleges`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-[15px] font-semibold text-white shadow-sm shadow-blue-600/20 transition-colors hover:bg-blue-700 lg:flex-none"
                >
                  <Building2 className="h-4 w-4" />
                  View Affiliated Colleges
                </Link>
                <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-[15px] font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50">
                  <Download className="h-4 w-4" />
                  Prospectus
                </button>
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-3 text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
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
                  {ytId ? (
                    <div className="relative h-[240px] w-full overflow-hidden rounded-[24px] bg-brand-blue shadow-sm md:h-[400px]">
                      <iframe
                        className="absolute inset-0 h-full w-full"
                        src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}`}
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        title="University Video"
                      />
                    </div>
                  ) : null}

                  <div
                    className="space-y-6 text-[15px] leading-[1.8] text-gray-600 md:text-[16px] rich-text"
                    dangerouslySetInnerHTML={{
                      __html: safeHtml(description),
                    }}
                  />

                  {(aboutData?.vision ||
                    aboutData?.mission ||
                    aboutData?.values) && (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      {aboutData?.vision && (
                        <div className="rounded-[20px] bg-[#f4f7fb] p-8">
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
                        <div className="rounded-[20px] bg-[#f0fdf4] p-8">
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
                      {aboutData?.values && (
                        <div className="rounded-[20px] bg-[#fef2f2] p-8">
                          <div className="mb-4 flex items-center gap-3.5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500">
                              <Gem className="h-5 w-5" />
                            </div>
                            <h3 className="text-[16px] font-bold text-gray-900">
                              Core Values
                            </h3>
                          </div>
                          <div
                            className="text-[14.5px] leading-[1.7] text-gray-600 rich-text"
                            dangerouslySetInnerHTML={{
                              __html: safeHtml(aboutData.values as string),
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {overviewList.length > 0 && (
                    <div className="overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm">
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
                    <div className="overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm">
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

                  {aboutData?.highlights &&
                    Array.isArray(aboutData.highlights) &&
                    aboutData.highlights.length > 0 && (
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {aboutData.highlights.map((h: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-start gap-4 rounded-xl border border-blue-100 bg-blue-50 p-5"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
                              <Layers className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="text-[15px] font-bold text-gray-900">
                                {h.title || h.label}
                              </h4>
                              <div
                                className="mt-1 text-[14px] text-gray-600 rich-text"
                                dangerouslySetInnerHTML={{
                                  __html: safeHtml(
                                    h.description || h.text || h.desc,
                                  ),
                                }}
                              />
                            </div>
                          </div>
                        ))}
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
                      {["all", "Bachelor", "Master"].map((level) => (
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
                  <div className="w-full overflow-x-auto">
                    <div className="min-w-[700px]">
                      <div className="grid grid-cols-12 gap-4 border-b border-gray-100 bg-white px-6 py-5 items-center">
                        <div className="col-span-4 text-[13px] font-bold uppercase tracking-wider text-gray-800">
                          COURSES NAME
                        </div>
                        <div className="col-span-2 text-[13px] font-bold uppercase tracking-wider text-gray-800">
                          DURATION
                        </div>
                        <div className="col-span-3 text-[13px] font-bold uppercase tracking-wider text-gray-800">
                          FEES / YEAR
                        </div>
                        <div className="col-span-3 text-[13px] font-bold uppercase tracking-wider text-gray-800">
                          ELIGIBILITY & SEAT
                        </div>
                      </div>
                      {coursesList.length > 0 ? (
                        coursesList
                          .filter(
                            (c: any) =>
                              courseFilter === "all" ||
                              c.level === courseFilter,
                          )
                          .map((course: any, i: number) => (
                            <div
                              key={i}
                              className="grid grid-cols-12 gap-4 border-b border-gray-100 px-6 py-5 transition-colors hover:bg-gray-50/50 items-center"
                            >
                              <div className="col-span-4 pr-4">
                                <h4 className="text-[15.5px] font-bold text-gray-900">
                                  {course.name}
                                </h4>
                                <p className="mt-1 text-[12px] text-gray-500">
                                  {course.sub || course.description || ""}
                                </p>
                              </div>
                              <div className="col-span-2">
                                <h4 className="text-[15.5px] font-bold text-gray-900">
                                  {course.duration}
                                </h4>
                                <p className="mt-1 text-[12px] text-gray-500">
                                  {course.durationSub || ""}
                                </p>
                              </div>
                              <div className="col-span-3">
                                <h4 className="text-[15.5px] font-bold text-[#2563eb]">
                                  {course.fee}
                                </h4>
                                <p className="mt-1 text-[12px] text-gray-500">
                                  / Year
                                </p>
                              </div>
                              <div className="col-span-3">
                                <p className="mb-2 text-[12.5px] font-medium text-gray-600">
                                  {course.eligibility}
                                </p>
                                <span className="inline-block rounded bg-[#eafaef] px-2.5 py-1 text-[11px] font-bold text-[#16a34a]">
                                  {course.seats}
                                </span>
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="px-6 py-10 text-center text-gray-400">
                          <EmptyTabState tabName="Courses" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ========== INSTITUTE / FACULTIES ========== */}
              {activeTab === "tab-institutes" && (
                <div className="space-y-10">
                  <div>
                    <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-[18px] font-bold text-gray-900">
                          Institutes & Affiliated Colleges
                        </h3>
                        <p className="mt-0.5 text-[13px] text-gray-500">
                          Constituent and affiliated campuses
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-5">
                      {colleges.length > 0 && (
                        <div className="rounded-[16px] border border-gray-100 bg-white p-5 shadow-sm">
                          <div
                            className="flex cursor-pointer items-center justify-between"
                            onClick={() => toggleDropdown("affiliated")}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                                <Users className="h-5 w-5 text-blue-600" />
                              </div>
                              <h4 className="text-[17px] font-bold text-gray-900">
                                Affiliated Colleges ({colleges.length})
                              </h4>
                            </div>
                            <ChevronDown
                              className={`h-5 w-5 text-gray-500 transition-transform ${openDropdowns["affiliated"] ? "rotate-180" : ""}`}
                            />
                          </div>
                          {openDropdowns["affiliated"] && (
                            <div className="mt-6">
                              <table className="prog-table w-full">
                                <thead>
                                  <tr>
                                    <th className="bg-[#f8fafc] px-2 py-2.5 text-left text-[13px] font-semibold text-[#1e293b]">
                                      #
                                    </th>
                                    <th className="bg-[#f8fafc] px-2 py-2.5 text-left text-[13px] font-semibold text-[#1e293b]">
                                      College
                                    </th>
                                    <th className="bg-[#f8fafc] px-2 py-2.5 text-left text-[13px] font-semibold text-[#1e293b]">
                                      Type
                                    </th>
                                    <th className="bg-[#f8fafc] px-2 py-2.5 text-left text-[13px] font-semibold text-[#1e293b]">
                                      Rating
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {colleges.map((col, idx) => (
                                    <tr
                                      key={col.id}
                                      className="border-b border-gray-50"
                                    >
                                      <td className="px-2 py-2 text-[13px] text-[#334155]">
                                        {idx + 1}
                                      </td>
                                      <td className="px-2 py-2 text-[13px] text-[#334155]">
                                        {col.name}
                                      </td>
                                      <td className="px-2 py-2 text-[13px] text-[#334155]">
                                        {col.affiliation || col.type}
                                      </td>
                                      <td className="px-2 py-2 text-[13px] text-[#334155]">
                                        {col.rating ?? "—"}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )}
                      {institutesList.length > 0 ? (
                        institutesList.map((inst: any, idx: number) => (
                          <div
                            key={idx}
                            className="rounded-[16px] border border-gray-100 bg-white p-5 shadow-sm"
                          >
                            <div
                              className="flex cursor-pointer items-center justify-between"
                              onClick={() => toggleDropdown(`inst-${idx}`)}
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                                  <Building2 className="h-5 w-5 text-blue-600" />
                                </div>
                                <h4 className="text-[15px] font-bold text-gray-900">
                                  {inst.title ||
                                    inst.name ||
                                    `Institute ${idx + 1}`}
                                </h4>
                              </div>
                              <ChevronDown
                                className={`h-4 w-4 text-gray-500 transition-transform ${openDropdowns[`inst-${idx}`] ? "rotate-180" : ""}`}
                              />
                            </div>
                            {openDropdowns[`inst-${idx}`] && (
                              <div className="mt-6">
                                <table className="prog-table w-full">
                                  <thead>
                                    <tr>
                                      <th className="bg-[#f8fafc] px-2 py-2.5 text-left text-[13px] font-semibold text-[#1e293b]">
                                        #
                                      </th>
                                      <th className="bg-[#f8fafc] px-2 py-2.5 text-left text-[13px] font-semibold text-[#1e293b]">
                                        Detail
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {(
                                      inst.items ||
                                      inst.colleges ||
                                      inst.programs ||
                                      []
                                    ).map((item: any, ii: number) => (
                                      <tr
                                        key={ii}
                                        className="border-b border-gray-50"
                                      >
                                        <td className="px-2 py-2 text-[13px] text-[#334155]">
                                          {ii + 1}
                                        </td>
                                        <td className="px-2 py-2 text-[13px] text-[#334155]">
                                          {item.name || item.title || item}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <EmptyTabState tabName="Institutes" />
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50">
                        <BookOpen className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-[18px] font-bold text-gray-900">
                          Faculties
                        </h3>
                        <p className="mt-0.5 text-[13px] text-gray-500">
                          Programs under each faculty
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-5">
                      {uni?.programs &&
                      Array.isArray(uni.programs) &&
                      uni.programs.length > 0 ? (
                        uni.programs.map((fac: any, idx: number) => (
                          <div
                            key={idx}
                            className="rounded-[16px] border border-gray-100 bg-white p-5 shadow-sm"
                          >
                            <div
                              className="flex cursor-pointer items-center justify-between"
                              onClick={() => toggleDropdown(`fac-${idx}`)}
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
                                  <BookOpen className="h-5 w-5 text-green-600" />
                                </div>
                                <h4 className="text-[17px] font-bold text-gray-900">
                                  {fac.title ||
                                    fac.name ||
                                    `Faculty ${idx + 1}`}
                                </h4>
                              </div>
                              <ChevronDown
                                className={`h-5 w-5 text-gray-500 transition-transform ${openDropdowns[`fac-${idx}`] ? "rotate-180" : ""}`}
                              />
                            </div>
                            {openDropdowns[`fac-${idx}`] && (
                              <div className="mt-6">
                                <table className="prog-table w-full">
                                  <thead>
                                    <tr>
                                      <th className="bg-[#f8fafc] px-2 py-2.5 text-left text-[13px] font-semibold text-[#1e293b]">
                                        #
                                      </th>
                                      <th className="bg-[#f8fafc] px-2 py-2.5 text-left text-[13px] font-semibold text-[#1e293b]">
                                        Programs
                                      </th>
                                      <th className="bg-[#f8fafc] px-2 py-2.5 text-left text-[13px] font-semibold text-[#1e293b]">
                                        Duration
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {(fac.programs || fac.items || []).map(
                                      (p: any, pi: number) => (
                                        <tr
                                          key={pi}
                                          className="border-b border-gray-50"
                                        >
                                          <td className="px-2 py-2 text-[13px] text-[#334155]">
                                            {pi + 1}
                                          </td>
                                          <td className="px-2 py-2 text-[13px] text-[#334155]">
                                            {p.name || p.title || p}
                                          </td>
                                          <td className="px-2 py-2 text-[13px] text-[#334155]">
                                            {p.duration || "—"}
                                          </td>
                                        </tr>
                                      ),
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <EmptyTabState tabName="Faculties" />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "tab-admissions" && (
                <div>
                  {admissionsList.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {admissionsList.map((ad: any, i: number) => (
                        <div
                          key={i}
                          className="flex h-full w-full max-w-85 flex-col overflow-hidden rounded-md border border-gray-200 bg-white transition-transform hover:border-blue-200 cursor-pointer"
                        >
                          <div className="shrink-0 p-2.5 pb-0">
                            <div className="group relative h-28 w-full overflow-hidden rounded-md bg-gray-200">
                              <img
                                src={
                                  ad.image ||
                                  (i === 0
                                    ? "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=400&auto=format&fit=crop"
                                    : "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=400&auto=format&fit=crop")
                                }
                                className="h-full w-full object-cover"
                                alt=""
                              />
                              <div
                                className={`absolute left-0 top-2.5 z-10 rounded-r-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white ${ad.status === "Ongoing" ? "bg-[#10b981]" : "bg-red-500"}`}
                              >
                                {ad.status}
                              </div>
                              <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1 rounded border border-white/10 bg-black/30 px-1.5 py-0.5 backdrop-blur-sm">
                                <span className="text-[8px] font-medium tracking-tight text-white opacity-90">
                                  Required Counselling?
                                </span>
                                <span className="h-2 w-px bg-white/20"></span>
                                <span className="text-[8px] font-bold tracking-tight text-emerald-300 transition-colors hover:text-emerald-100">
                                  Reserve Seat
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex grow flex-col p-3 pb-3">
                            <div className="group/name mb-1 flex items-center gap-1.5">
                              <h2
                                title={ad.title}
                                className="truncate text-[18px] font-bold leading-tight text-[#0f172a] transition-colors group-hover/name:text-brand-blue"
                              >
                                {ad.title}
                              </h2>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="#0d6efd"
                                className="mt-0.5 h-5 w-5 shrink-0"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <div className="mb-1.5 flex items-center overflow-hidden whitespace-nowrap text-[12px] text-[#64748b]">
                              <div className="flex items-center gap-1">
                                <svg
                                  className="h-3.75 w-3.75 fill-[#f59e0b]"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="font-bold text-[#334155]">
                                  4.5
                                </span>
                              </div>
                              <span className="mx-2 text-gray-300">|</span>
                              <div className="flex items-center gap-1.5">
                                <svg
                                  className="h-4 w-4 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  strokeWidth="2"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                  />
                                </svg>
                                <span>{ad.faculty || ""}</span>
                              </div>
                              <span className="mx-2 text-gray-300">|</span>
                              <div className="flex items-center gap-1.5 truncate">
                                <svg
                                  className="h-4 w-4 shrink-0 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  strokeWidth="2"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                <span
                                  className="truncate"
                                  title={ad.campus || ""}
                                >
                                  {ad.campus || ""}
                                </span>
                              </div>
                            </div>
                            <div className="mb-2 flex cursor-pointer items-center gap-1.5 text-[12.5px] text-[#64748b] transition-colors hover:text-[#0d6efd] w-fit">
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                                />
                              </svg>
                              <span>University Central</span>
                            </div>
                            <hr className="mb-2 border-gray-100" />
                            <div className="mb-1.5 flex items-center justify-between">
                              <span className="text-[12.5px] font-medium text-[#64748b]">
                                Programs Offered
                              </span>
                              <span className="text-[12.5px] font-semibold text-[#2563eb]">
                                Admission Open
                              </span>
                            </div>
                            <ul className="mb-2 space-y-1">
                              <li className="flex items-center justify-between text-[12.5px]">
                                <span className="font-semibold text-[#1e293b]">
                                  {ad.title}
                                </span>
                                <div
                                  className={`flex items-center gap-1.5 text-[11px] font-medium ${ad.status === "Ongoing" ? "text-[#059669]" : "text-[#ef4444]"}`}
                                >
                                  <span className="relative flex h-2 w-2 items-center justify-center">
                                    <span
                                      className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${ad.status === "Ongoing" ? "bg-[#059669]" : "bg-[#ef4444]"}`}
                                    ></span>
                                    <span
                                      className={`relative inline-flex h-1.5 w-1.5 rounded-full ${ad.status === "Ongoing" ? "bg-[#059669]" : "bg-[#ef4444]"}`}
                                    ></span>
                                  </span>
                                  {ad.status === "Ongoing"
                                    ? "Seats Available"
                                    : "Closed"}
                                </div>
                              </li>
                            </ul>
                            <div
                              className="mt-auto mb-3 w-full border-b border-dotted border-gray-200 pt-2"
                              style={{
                                borderBottomWidth: "1.5px",
                                borderBottomStyle: "dotted",
                              }}
                            ></div>
                            <div className="flex items-center gap-1.5">
                              <button className="flex flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-md border border-blue-100 bg-blue-50 px-2 py-2 text-[13px] font-semibold text-blue-700 transition-colors hover:bg-blue-100">
                                <svg
                                  className="h-3.5 w-3.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  strokeWidth="2"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                  />
                                </svg>
                                Ask Question
                              </button>
                              <button className="flex flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-md bg-brand-blue px-2 py-2 text-[13px] font-bold text-white transition-colors hover:bg-brand-hover">
                                Apply Now
                              </button>
                              <button className="flex h-9 w-9 flex-none items-center justify-center rounded-md border border-gray-200 text-[#64748b] transition-colors hover:bg-gray-50">
                                <i className="fa-regular fa-bookmark"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
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
                  <div className="w-full overflow-x-auto">
                    <div className="min-w-[800px]">
                      <div className="grid grid-cols-12 gap-4 border-b border-gray-100 bg-white px-6 py-5 items-center">
                        <div className="col-span-2 text-[13px] font-bold uppercase tracking-wider text-gray-800">
                          PROGRAM
                        </div>
                        <div className="col-span-2 text-[13px] font-bold uppercase tracking-wider text-gray-800">
                          SCHOLARSHIP
                        </div>
                        <div className="col-span-2 text-[13px] font-bold uppercase tracking-wider text-gray-800">
                          BENEFIT
                        </div>
                        <div className="col-span-3 text-[13px] font-bold uppercase tracking-wider text-gray-800">
                          FOR WHOM
                        </div>
                        <div className="col-span-3 text-[13px] font-bold uppercase tracking-wider text-gray-800"></div>
                      </div>
                      {scholarshipsList.length > 0 ? (
                        scholarshipsList
                          .filter(
                            (s: any) =>
                              scholarFilter === "all" ||
                              s.level === scholarFilter,
                          )
                          .map((sch: any, i: number) => (
                            <div
                              key={i}
                              className="grid grid-cols-12 gap-4 border-b border-gray-100 px-6 py-5 transition-colors hover:bg-gray-50/50 items-center"
                            >
                              <div className="col-span-2">
                                <h4 className="text-[14px] font-bold text-gray-900">
                                  {sch.program || ""}
                                </h4>
                              </div>
                              <div className="col-span-2">
                                <h4 className="text-[14px] font-bold text-gray-900">
                                  {sch.name || sch.title || ""}
                                </h4>
                              </div>
                              <div className="col-span-2">
                                <span className="text-[13px] font-medium text-green-600">
                                  {sch.benefit || ""}
                                </span>
                              </div>
                              <div className="col-span-3">
                                <span className="text-[13px] text-gray-600">
                                  {sch.forWhom || sch.eligibility || ""}
                                </span>
                              </div>
                              <div className="col-span-3">
                                <button className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700">
                                  Get Scholarship
                                </button>
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="px-6 py-10 text-center text-gray-400">
                          <EmptyTabState tabName="Scholarship" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ========== EVENTS ========== */}
              {activeTab === "tab-events" && (
                <div>
                  {eventsList.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {eventsList.map((ev: any, i: number) => (
                        <div
                          key={i}
                          className="flex flex-col overflow-hidden rounded-md border border-gray-200 bg-white transition-colors hover:border-blue-500/20 duration-300"
                        >
                          <div className="h-35 w-full overflow-hidden p-4">
                            <img
                              src={
                                ev.image ||
                                "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop"
                              }
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
                  {newsList.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {newsList.map((item: any, i: number) => (
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
                <div className="space-y-10">
                  {galleryList.length > 0 ? (
                    (() => {
                      const groups = new Map<string, typeof galleryList>();
                      for (const img of galleryList) {
                        const key = (img as any).folder || "Gallery";
                        if (!groups.has(key)) groups.set(key, []);
                        groups.get(key)!.push(img);
                      }
                      const urls = galleryList.map(
                        (i: any) => i.url || i.image || i.src,
                      );
                      return Array.from(groups.entries()).map(
                        ([heading, items], gi) => (
                          <div key={gi} className="space-y-5">
                            <h3 className="text-lg font-bold capitalize tracking-tight text-gray-800">
                              {heading}
                            </h3>
                            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 md:gap-5">
                              {items
                                .slice(0, items.length > 8 ? 7 : 8)
                                .map((img: any, ii: number) => {
                                  const url = img.url || img.image || img.src;
                                  const globalIndex = urls.indexOf(url);
                                  return (
                                    <div
                                      key={ii}
                                      className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
                                      onClick={() =>
                                        setLightboxIndex(
                                          globalIndex >= 0 ? globalIndex : null,
                                        )
                                      }
                                    >
                                      <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gray-50">
                                        <img
                                          src={url}
                                          alt={img.title || img.alt || ""}
                                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                      </div>
                                    </div>
                                  );
                                })}
                              {items.length > 8 && (
                                <div
                                  className="group cursor-pointer overflow-hidden rounded-2xl border border-dashed border-blue-100 bg-blue-50/30 p-1.5 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-md"
                                  onClick={() => {
                                    const firstUrl =
                                      (items[0] as any).url ||
                                      (items[0] as any).image ||
                                      (items[0] as any).src;
                                    const firstIdx = urls.indexOf(firstUrl);
                                    setLightboxIndex(
                                      firstIdx >= 0 ? firstIdx : null,
                                    );
                                  }}
                                >
                                  <div className="aspect-[4/3] flex flex-col items-center justify-center overflow-hidden rounded-xl bg-blue-600/5">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
                                      <ArrowRight className="h-6 w-6" />
                                    </div>
                                    <span className="mt-2 text-sm font-bold text-blue-700">
                                      View All
                                    </span>
                                  </div>
                                  <p className="mt-2 px-1 text-center text-[12px] font-bold tracking-tight text-blue-600/60">
                                    +{items.length - 7} PHOTOS
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        ),
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
                  <div className="mb-8 flex flex-col items-center gap-8 rounded-md border border-gray-200 bg-white p-8 md:flex-row">
                    <div className="text-center md:border-r md:pr-8 md:text-left">
                      <h2 className="mb-2 text-5xl font-extrabold text-gray-900">
                        {uni?.rating ?? "—"}
                      </h2>
                      <div className="mb-2 flex items-center justify-center gap-1 md:justify-start">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <i
                            key={idx}
                            className={`fa-solid fa-star text-[14px] ${idx < Math.round(uni?.rating ?? 0) ? "text-yellow-400" : "text-gray-300"}`}
                          ></i>
                        ))}
                      </div>
                      <p className="text-[13px] font-medium text-gray-500">
                        Based on {uni?.review_count ?? 0} reviews
                      </p>
                    </div>
                    <div className="w-full flex-1 space-y-2.5">
                      {[
                        { star: 5, pct: 80, color: "bg-green-500" },
                        { star: 4, pct: 15, color: "bg-green-500" },
                        { star: 3, pct: 3, color: "bg-yellow-400" },
                        { star: 2, pct: 1, color: "bg-orange-400" },
                        { star: 1, pct: 1, color: "bg-orange-400" },
                      ].map((r) => (
                        <RatingBar
                          key={r.star}
                          label={String(r.star)}
                          width={`${r.pct}%`}
                          color={r.color}
                          pct={`${r.pct}%`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-[18px] font-bold text-gray-900">
                      Recent Reviews
                    </h3>
                    <a
                      href="/write-review"
                      className="text-sm font-medium text-brand-blue hover:text-brand-hover"
                    >
                      Write a Review
                    </a>
                  </div>

                  <div className="space-y-5">
                    {uni?.reviews &&
                    Array.isArray(uni.reviews) &&
                    uni.reviews.length > 0 ? (
                      uni.reviews.map((review: any, idx: number) => (
                        <ReviewCard
                          key={idx}
                          initials={(review.name || "A")
                            .charAt(0)
                            .toUpperCase()}
                          name={review.name}
                          subtitle={review.subtitle || ""}
                          rating={review.rating || 5}
                          pros={review.pros || review.positive || ""}
                          cons={review.cons || review.negative || ""}
                          tone={idx % 2 === 0 ? "blue" : "purple"}
                        />
                      ))
                    ) : (
                      <EmptyTabState tabName="Reviews" />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - matching college details page */}
            <div className="space-y-6 lg:col-span-1 lg:w-full lg:max-w-[400px] lg:ml-8 xl:ml-12">
              <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 sm:p-10">
                <h3 className="mb-8 text-2xl font-bold text-gray-900">
                  Contact Information
                </h3>
                <div className="flex flex-col gap-6">
                  <ContactInfoRow
                    icon="fa-solid fa-location-dot"
                    title="Address"
                    value={(contactData?.address as string) || "—"}
                    badge="bg-brand-blue/5 text-[#0000FF]"
                  />
                  <ContactInfoRow
                    icon="fa-solid fa-phone"
                    title="Phone"
                    value={(contactData?.phone as string) || "—"}
                    badge="bg-emerald-50 text-emerald-600"
                  />
                  <ContactInfoRow
                    icon="fa-solid fa-envelope"
                    title="Email"
                    value={(contactData?.email as string) || "—"}
                    badge="bg-red-50 text-red-500"
                    link={!!contactData?.email}
                    linkHref={`mailto:${contactData?.email || ""}`}
                  />
                  <ContactInfoRow
                    icon="fa-solid fa-globe"
                    title="Website"
                    value={
                      (contactData?.website as string) || uni?.website || "—"
                    }
                    badge="bg-purple-50 text-purple-600"
                    link={!!(contactData?.website || uni?.website)}
                    linkHref={
                      (contactData?.website as string) || uni?.website || "#"
                    }
                  />
                  {(contactData?.social ||
                    contactData?.facebook ||
                    contactData?.twitter ||
                    contactData?.instagram ||
                    contactData?.youtube ||
                    contactData?.linkedin) && (
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
                  {(contactData?.mapUrl || contactData?.address) && (
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
