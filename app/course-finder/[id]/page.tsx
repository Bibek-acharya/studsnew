"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ArrowRight,
  GraduationCap,
  MapPin,
  Globe,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { fetchCourseDetailsById } from "@/services/course-api";
import { apiService } from "@/services/api";
import EmptyTabState from "@/components/course-finder/EmptyTabState";
import RichText from "@/components/RichText";
import Link from "next/link";

type TabKey =
  | "overview"
  | "curriculum"
  | "eligibility"
  | "admission"
  | "fees"
  | "downloads"
  | "scholarships"
  | "faq";

const tabs: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "curriculum", label: "Curriculum" },
  { key: "eligibility", label: "Eligibility" },
  { key: "admission", label: "Entrance & Admission" },
  { key: "fees", label: "Program Fee" },
  { key: "downloads", label: "Downloads" },
  { key: "scholarships", label: "Scholarships" },
  { key: "faq", label: "FAQ" },
];

function stripHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const kebabToPascal = (name: string): string =>
  name
    .replace(/-./g, (m) => m[1].toUpperCase())
    .replace(/^./, (m) => m.toUpperCase());

const DynamicIcon = ({
  name,
  size = 24,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) => {
  const IconComponent = (
    LucideIcons.icons as Record<
      string,
      React.ComponentType<{ size?: number; className?: string }>
    >
  )[kebabToPascal(name)];
  return IconComponent ? (
    <IconComponent size={size} className={className} />
  ) : (
    <GraduationCap size={size} className={className} />
  );
};

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const tabsScrollRef = useRef<HTMLDivElement | null>(null);
  const tabsNavRef = useRef<HTMLElement | null>(null);
  const tabBarRef = useRef<HTMLDivElement | null>(null);
  const [isTabsOverflowing, setIsTabsOverflowing] = useState(false);
  const [canScrollTabsLeft, setCanScrollTabsLeft] = useState(false);
  const [canScrollTabsRight, setCanScrollTabsRight] = useState(false);

  const { data: details, isLoading } = useQuery({
    queryKey: ["course-details", id],
    queryFn: () => fetchCourseDetailsById(id),
  });

  const [sponsoredInsts, setSponsoredInsts] = useState<any[]>([]);

  useEffect(() => {
    const affiliationId = details?.course?.affiliationId;
    if (!affiliationId) return;
    apiService.getSponsoredInstitutions(affiliationId).then((res) => {
      setSponsoredInsts(res?.data?.institutions || res?.institutions || []);
    }).catch(() => {});
  }, [details?.course?.affiliationId]);

  const updateTabScrollState = useCallback(() => {
    const container = tabsScrollRef.current;
    const nav = tabsNavRef.current;
    const firstTab = nav?.firstElementChild as HTMLElement | null;
    const lastTab = nav?.lastElementChild as HTMLElement | null;
    if (!container || !nav || !firstTab || !lastTab) {
      setIsTabsOverflowing(false);
      setCanScrollTabsLeft(false);
      setCanScrollTabsRight(false);
      return;
    }
    const containerRect = container.getBoundingClientRect();
    const firstTabRect = firstTab.getBoundingClientRect();
    const lastTabRect = lastTab.getBoundingClientRect();
    const leftOverflow = firstTabRect.left < containerRect.left - 4;
    const rightOverflow = lastTabRect.right > containerRect.right + 4;
    setIsTabsOverflowing(leftOverflow || rightOverflow);
    setCanScrollTabsLeft(leftOverflow);
    setCanScrollTabsRight(rightOverflow);
  }, []);

  const scrollTabs = (direction: "left" | "right") => {
    const container = tabsScrollRef.current;
    if (!container) return;
    const step = Math.max(180, Math.floor(container.clientWidth * 0.5));
    container.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const container = tabsScrollRef.current;
    if (!container) return;
    updateTabScrollState();
    const handleScroll = () => updateTabScrollState();
    const handleResize = () => updateTabScrollState();
    container.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => updateTabScrollState());
      observer.observe(container);
      if (tabsNavRef.current) observer.observe(tabsNavRef.current);
    }
    requestAnimationFrame(() => updateTabScrollState());
    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      observer?.disconnect();
    };
  }, [updateTabScrollState]);

  useEffect(() => {
    updateTabScrollState();
  }, [activeTab, updateTabScrollState]);

  const handleTabClick = (tab: TabKey) => {
    setActiveTab(tab);
    const offset = tabBarRef.current?.offsetTop || 200;
    window.scrollTo({ top: offset, behavior: "smooth" });
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  if (isLoading) {
    return (
      <div className="w-full animate-pulse">
        <div className="mx-auto max-w-350 pt-12 pb-8">
          <div className="h-4 w-64 rounded bg-gray-200 mb-6" />
          <div className="h-9 w-80 rounded bg-gray-200 mb-2" />
          <div className="h-4 w-48 rounded bg-gray-200 mb-6" />
          <div className="h-[280px] md:h-[380px] rounded-md bg-gray-200" />
        </div>
        <div className="mx-auto max-w-350 flex gap-8 border-b border-gray-100">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-10 w-20 rounded bg-gray-200 mb-0" />
          ))}
        </div>
        <div className="mx-auto max-w-350 py-8 md:py-12">
          <div className="space-y-4">
            <div className="h-6 w-48 rounded bg-gray-200" />
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-5/6 rounded bg-gray-200" />
            <div className="h-4 w-3/4 rounded bg-gray-200" />
            <div className="h-4 w-2/3 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  const course = details?.course;
  const courseTitle = stripHtml(course?.title || "");
  const courseDuration = stripHtml(course?.duration || "");
  const courseLevel = stripHtml(course?.level || "");
  const courseField = stripHtml(course?.field || "");
  const courseAffiliation = stripHtml(course?.affiliationName || "");
  const courseEstFee = course?.estFee || "";
  const courseGovtFee = course?.govtFee || "";
  const coursePrivateFee = course?.privateFee || "";
  const courseImage = course?.bannerUrl;
  const highlights = course?.highlights || [];
  const about = details?.about || [];
  const admissionRequirements = details?.admissionRequirements || [];
  const curriculum = details?.curriculum || [];
  const careerOpportunities = details?.careerOpportunities || [];
  const programData = details?.data as Record<string, any> | undefined;

  const features = course?.features || programData?.features || [];
  const whoShouldChoose = course?.whoShouldChoose || programData?.whoShouldChoose || [];
  const eligibilityRows = course?.eligibilityRows || programData?.eligibilityRows || [];
  const eligibilityText = course?.eligibilityText || programData?.eligibilityText || "";
  const admissionSteps = course?.admissionSteps || programData?.admissionSteps || [];
  const fullTimeCourses = course?.fullTimeCourses || programData?.fullTimeCourses || [];
  const feeItems = course?.feeItems || programData?.feeItems || [];
  const feeStructure = course?.feeStructure || programData?.feeStructure || "";
  const scholarships = course?.scholarships || programData?.scholarships || [];
  const scholarshipDesc = course?.scholarshipDesc || programData?.scholarshipDesc || "";
  const scholarshipNotes = course?.scholarshipNotes || programData?.scholarshipNotes || "";
  const subjectGroups = course?.subjectGroups || programData?.subjectGroups || [];
  const faqs = course?.faqs || programData?.faqs || [];
  const downloads = course?.downloads || programData?.downloads || [];
  const programLevel = programData?.level || "";
  const affiliationData = programData?.affiliation || "";

  const metadataParts = [
    courseDuration,
    courseLevel || programLevel,
    courseAffiliation || affiliationData,
  ].filter(Boolean);
  const metadataText =
    metadataParts.length > 0 ? metadataParts.join(" | ") : "";

  const hasEligibilityData =
    !!eligibilityText || eligibilityRows.length > 0 || admissionRequirements.length > 0;
  const hasAdmissionData = admissionSteps.length > 0;
  const hasCoursesData =
    fullTimeCourses.some((ft: any) => ft.course || ft.totalFees || ft.startDate || ft.endDate) ||
    subjectGroups.length > 0 ||
    curriculum.length > 0;
  const hasFeeData =
    !!feeStructure ||
    feeItems.some((fi: any) => fi.particular || fi.amount) ||
    !!(courseEstFee || courseGovtFee || coursePrivateFee);
  const hasScholarshipData = !!(scholarshipDesc || scholarships.length > 0);
  const hasDownloadsData = downloads.length > 0;
  const hasFaqData = faqs.length > 0;

  const bannerImage = courseImage || "";

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .tab-content { animation: fadeIn 0.4s ease-in-out; }
        .table-scroll-wrapper { position: relative; }
        .table-scroll-wrapper::after { content: ''; position: absolute; top: 0; right: 0; bottom: 0; width: 40px; background: linear-gradient(to right, transparent, white); pointer-events: none; }
        @media (min-width: 768px) { .table-scroll-wrapper::after { display: none; } }
         .ql-editor { padding: 0; max-width: 100%; overflow-x: hidden; word-break: normal; hyphens: none; line-break: strict; }
         .ql-editor p, .ql-editor li { font-size: 15px; line-height: 1.8; color: #4b5563; word-break: normal; overflow-wrap: break-word; hyphens: none; line-break: strict; }
        .ql-editor strong { font-weight: 700; color: #111827; }
        .ql-editor img { max-width: 100%; height: auto; }
         .ql-editor pre { white-space: pre-wrap; word-break: normal; overflow-wrap: break-word; max-width: 100%; overflow-x: auto; }
        .ql-editor table { max-width: 100%; overflow-x: auto; display: block; }
        details[open] summary ~ * { animation: slideDown 0.3s ease-out; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .banner-gradient {
          background: linear-gradient(135deg, #0d21e0 0%, #0014ff 100%);
          background-image:
            radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 40%),
            radial-gradient(circle at bottom left, rgba(255,255,255,0.1) 0%, transparent 40%),
            linear-gradient(135deg, #1126ef 0%, #0014FF 100%);
        }
      `}</style>

      <div className="w-full bg-white text-gray-800">
        <div className="mx-auto max-w-350 pt-8 md:pt-12 pb-6 md:pb-8">
          <nav className="flex items-center text-sm text-gray-500 mb-6 gap-1 overflow-x-auto whitespace-nowrap">
            <a
              href="/"
              className="hover:text-gray-900 transition-colors shrink-0"
            >
              Home
            </a>
            <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
            <a
              href="/course-finder"
              className="hover:text-gray-900 transition-colors shrink-0"
            >
              Courses
            </a>
            {courseLevel && (
              <>
                <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                <a
                  href={`/course-finder?level=${encodeURIComponent(courseLevel)}`}
                  className="hover:text-gray-900 transition-colors shrink-0"
                >
                  {courseLevel}
                </a>
              </>
            )}
            <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="text-gray-900 font-semibold truncate">
              {courseTitle}
            </span>
          </nav>

          <div className="mb-6">
            <h1 className="text-[28px] md:text-4xl font-bold text-gray-900">
              {courseTitle}
            </h1>
            {metadataText && (
              <p className="text-sm text-gray-400 font-medium mt-2">
                {metadataText}
              </p>
            )}
          </div>

          {bannerImage ? (
            <div
              className="relative w-full h-[280px] md:h-[380px] max-md:bg-contain bg-cover bg-center bg-no-repeat rounded-2xl overflow-hidden"
              style={{
                backgroundImage: `url('${bannerImage}')`,
                backgroundPosition: "center 20%",
              }}
            >
              <div className="absolute inset-0 bg-black/10"></div>
            </div>
          ) : (
            <div className="banner-gradient rounded-2xl p-6 relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[200px] md:min-h-[280px]">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-xl"></div>
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-white opacity-5 rounded-full -ml-20 -mb-20 blur-2xl"></div>
              <h2 className="text-white text-xl md:text-2xl font-bold leading-tight relative z-10 mb-2">
                {courseTitle}
              </h2>
              <div className="text-white/80 text-xs relative z-10 mt-auto pt-2 tracking-wide font-medium">
                studsphere.com
              </div>
            </div>
          )}
        </div>

        <div ref={tabBarRef} className="mx-auto max-w-350 sticky top-0 z-40 bg-white border-b border-gray-100">
          <div className="relative">
            {isTabsOverflowing && canScrollTabsLeft && (
              <button
                type="button"
                onClick={() => scrollTabs("left")}
                className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-1.5 text-gray-700 transition hover:bg-gray-50"
                aria-label="Scroll tabs left"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
            {isTabsOverflowing && canScrollTabsRight && (
              <button
                type="button"
                onClick={() => scrollTabs("right")}
                className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-1.5 text-gray-700 transition hover:bg-gray-50"
                aria-label="Scroll tabs right"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
            <div
              ref={tabsScrollRef}
              className="overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              <nav
                ref={tabsNavRef}
                className="flex w-max space-x-4 md:space-x-8 whitespace-nowrap"
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => handleTabClick(tab.key)}
                    className={`shrink-0 py-4 text-[14px] transition-colors cursor-pointer bg-transparent border-b-2 appearance-none outline-none ${
                      activeTab === tab.key
                        ? "border-[#0000ff] text-[#0000ff] font-bold"
                        : "border-transparent text-gray-500 font-semibold hover:text-gray-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-350 py-8 md:py-12 bg-white grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 min-h-[500px]">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="tab-content">
              {course?.description ? (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Overview
                  </h2>
                  <RichText
                    html={course.description}
                    className="text-gray-600 text-[15px] md:text-[15.5px] leading-[1.8]"
                  />
                </div>
              ) : null}

              {about.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    About This Course
                  </h2>
                  <div className="space-y-4">
                    {about.map((item: any, i: number) => (
                      <p
                        key={i}
                        className="text-gray-600 text-[15px] md:text-[15.5px] leading-[1.8]"
                      >
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {whoShouldChoose.length > 0 && (
                <div className="pt-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Who Should Choose {courseTitle}?
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {whoShouldChoose.map((item: any, i: number) => (
                      <div
                        key={i}
                        className="border border-gray-200 rounded-xl p-6 bg-white"
                      >
                        <div className="w-12 h-12 rounded-xl bg-[#0000ff] flex items-center justify-center text-white mb-4">
                          <DynamicIcon name={item.icon || ""} size={24} className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2 text-[17px]">
                          {item.title != null ? String(item.title) : ""}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {item.shortDesc != null ? String(item.shortDesc) : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {features.length > 0 && (
                <div className="pt-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Features of {courseTitle}
                  </h2>
                  <div className="space-y-4">
                    {features.map((item: any, i: number) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#0000ff] flex items-center justify-center text-white shrink-0 mt-0.5">
                          <span className="text-sm font-bold">{i + 1}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1 text-[16px]">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {item.shortDesc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {careerOpportunities.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Career Opportunities
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {careerOpportunities.map((career: any, i: number) => (
                      <div
                        key={i}
                        className="border border-gray-200 rounded-md p-4 bg-white flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-md bg-[#0000ff] flex items-center justify-center text-white flex-shrink-0">
                          <span className="text-sm font-bold">{i + 1}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {career.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!course?.description &&
                about.length === 0 &&
                whoShouldChoose.length === 0 &&
                features.length === 0 &&
                subjectGroups.length === 0 &&
                careerOpportunities.length === 0 && (
                  <EmptyTabState tabName="overview" />
                )}
            </div>
          )}

          {/* Curriculum Tab */}
          {activeTab === "curriculum" && (
            <div className="tab-content">
              {curriculum.length > 0 ? (
                <div>
                  <div className="mb-8">
                    <h2 className="text-[24px] font-bold text-gray-900 mb-2">
                      Course Structure
                    </h2>
                    <p className="text-gray-500 text-[15px]">
                      Detailed semester-wise breakdown of the curriculum.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {curriculum.map((sem: any, i: number) => {
                      const subjects = sem.subjects || [];
                      const electives = sem.electives || [];

                      return (
                        <details
                          key={i}
                          className="group bg-white border border-gray-200 rounded-xl overflow-hidden"
                          open={i === 0}
                        >
                          <summary className="flex justify-between items-center font-bold cursor-pointer list-none [&::-webkit-details-marker]:hidden p-5 text-gray-900 text-[16px] hover:bg-gray-50 transition-colors">
                            <span>
                              {sem.title || `Semester ${sem.semester || i + 1}`}
                            </span>
                            <ChevronDown className="w-5 h-5 text-gray-500 transition-transform duration-200 group-open:rotate-180" />
                          </summary>
                          <div className="border-t border-gray-200">
                            {subjects.length > 0 && (
                              <div className="overflow-x-auto table-scroll-wrapper">
                                <table className="w-full text-left border-collapse min-w-[500px]">
                                  <thead>
                                    <tr className="bg-[#eff4fc] text-gray-700">
                                      <th className="p-4 font-semibold w-[8%] text-[14px]">
                                        S.N.
                                      </th>
                                      <th className="p-4 font-semibold w-[20%] text-[14px]">
                                        Code
                                      </th>
                                      <th className="p-4 font-semibold text-[14px]">
                                        Subject
                                      </th>
                                      <th className="p-4 font-semibold w-[15%] text-[14px]">
                                        Credits
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="text-[14px]">
                                    {subjects.map(
                                      (subject: any, j: number) => (
                                        <tr
                                          key={j}
                                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                        >
                                          <td className="p-4 text-gray-600">
                                            {j + 1}
                                          </td>
                                          <td className="p-4 font-mono text-sm text-gray-500">
                                            {typeof subject === "string" ? "" : subject.code || ""}
                                          </td>
                                          <td className="p-4 font-medium text-gray-800">
                                            {typeof subject === "string" ? subject : subject.name || ""}
                                          </td>
                                          <td className="p-4 text-gray-600">
                                            {typeof subject === "string" ? "" : subject.credits || ""}
                                          </td>
                                        </tr>
                                      ),
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            )}
                            {electives.length > 0 && (
                              <div className="px-5 pb-5 pt-4">
                                <h4 className="font-semibold text-gray-900 mb-3 text-[15px]">
                                  List of Electives
                                </h4>
                                <ol className="space-y-2">
                                  {electives.map((e: any, k: number) => (
                                    <li
                                      key={k}
                                      className="flex items-start gap-3 text-sm text-gray-700"
                                    >
                                      <span className="font-semibold text-gray-900 mt-0.5">
                                        {k + 1}.
                                      </span>
                                      <span>
                                        {e.code ? `${e.code} — ` : ""}
                                        {e.name || ""}
                                      </span>
                                    </li>
                                  ))}
                                </ol>
            </div>
          )}

          </div>

                        </details>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <EmptyTabState tabName="curriculum" />
              )}
            </div>
          )}

          {/* Eligibility Tab */}
          {activeTab === "eligibility" && (
            <div className="tab-content">
              {hasEligibilityData ? (
                <div>
                  <h2 className="text-[22px] font-bold text-gray-900 mb-4">
                    Eligibility Criteria
                  </h2>
                  {eligibilityText ? (
                    <div
                      className="ql-editor prose prose-sm max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ __html: eligibilityText }}
                    />
                  ) : (
                    <div className="overflow-x-auto rounded border border-gray-200 table-scroll-wrapper">
                      <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                          <tr className="bg-[#eff4fc] border-b border-gray-200">
                            <th className="p-4 font-bold text-gray-900 w-[8%] border-r border-gray-200">
                              S.N.
                            </th>
                            <th className="p-4 font-bold text-gray-900 w-[24%] border-r border-gray-200">
                              Stream/Faculty
                            </th>
                            <th className="p-4 font-bold text-gray-900 w-[25%] border-r border-gray-200">
                              Eligibility
                            </th>
                            <th className="p-4 font-bold text-gray-900 w-[25%]">
                              Required Documents
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-[15px]">
                          {eligibilityRows.map((row: any, i: number) => (
                            <tr
                              key={i}
                              className="border-b border-gray-200 hover:bg-gray-50"
                            >
                              <td className="p-4 align-top border-r border-gray-200 text-gray-700">
                                {i + 1}
                              </td>
                              <td className="p-4 align-top border-r border-gray-200 text-gray-700">
                                {row.stream || row.faculty || "-"}
                              </td>
                              <td className="p-4 align-top border-r border-gray-200 text-gray-700">
                                {Array.isArray(row.eligibility) &&
                                row.eligibility.length > 0 ? (
                                  <ul className="list-disc list-inside space-y-1">
                                    {row.eligibility.map(
                                      (item: string, j: number) => (
                                        <li key={j}>{item}</li>
                                      ),
                                    )}
                                  </ul>
                                ) : (
                                  row.eligibility || "-"
                                )}
                              </td>
                              <td className="p-4 align-top text-gray-700">
                                {row.documents?.length > 0 ? (
                                  <ul className="space-y-1 text-sm">
                                    {row.documents.map(
                                      (doc: string, j: number) => (
                                        <li
                                          key={j}
                                          className="flex items-center gap-2"
                                        >
                                          <span className="w-1.5 h-1.5 rounded-full bg-[#0000ff]"></span>
                                          {doc}
                                        </li>
                                      ),
                                    )}
                                  </ul>
                                ) : (
                                  "-"
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                <EmptyTabState tabName="eligibility" />
              )}
            </div>
          )}

          {/* Admission Tab */}
          {activeTab === "admission" && (
            <div className="tab-content">
              {hasAdmissionData ? (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Admission Process
                    </h2>
                    <p className="text-gray-600">
                      Step-by-step guide for {courseTitle} admission
                    </p>
                  </div>
                  <div className="space-y-6">
                    {admissionSteps.map((step: any, i: number) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#0000ff] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {i + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg mb-3">
                            {step.title}
                          </h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyTabState tabName="admission process" />
              )}
            </div>
          )}

          {/* Program Fee Tab */}
          {activeTab === "fees" && (
            <div className="tab-content">
              {hasFeeData ? (
                <div>
                  <h2 className="text-[22px] font-bold text-gray-900 mb-4">
                    Fee Structure
                  </h2>
                  {feeStructure ? (
                    <div
                      className="ql-editor prose prose-sm max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ __html: feeStructure }}
                    />
                  ) : (
                    <>
                      {feeItems.some((fi: any) => fi.particular || fi.amount) && (
                        <div className="overflow-x-auto rounded border border-gray-200 mb-6 table-scroll-wrapper">
                          <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                              <tr className="bg-[#eff4fc] border-b border-gray-200">
                                <th className="p-4 font-bold text-gray-900 w-[28%] border-r border-gray-200">
                                  Particular
                                </th>
                                <th className="p-4 font-bold text-gray-900 w-[30%] border-r border-gray-200">
                                  Amount (NPR)
                                </th>
                                <th className="p-4 font-bold text-gray-900 w-[27%] border-r border-gray-200">
                                  Frequency
                                </th>
                                <th className="p-4 font-bold text-gray-900 w-[15%]">
                                  Notes
                                </th>
                              </tr>
                            </thead>
                            <tbody className="text-[15px]">
                              {feeItems.filter((fi: any) => fi.particular || fi.amount).map((fi: any, i: number) => (
                                <tr
                                  key={i}
                                  className="border-b border-gray-200 hover:bg-gray-50"
                                >
                                  <td className="p-4 align-top border-r border-gray-200">
                                    <div className="text-gray-900 font-semibold mb-1">
                                      {fi.particular}
                                    </div>
                                  </td>
                                  <td className="p-4 align-top border-r border-gray-200">
                                    <div className="text-gray-700">{fi.amount}</div>
                                  </td>
                                  <td className="p-4 align-top border-r border-gray-200 text-gray-700">
                                    {fi.frequency || "-"}
                                  </td>
                                  <td className="p-4 align-top text-gray-700">
                                    {fi.notes || "-"}
                                  </td>
                                </tr>
                              ))}
                              {courseGovtFee && (
                                <tr className="border-b border-gray-200 hover:bg-gray-50">
                                  <td className="p-4 align-top border-r border-gray-200 font-semibold text-gray-900">
                                    Government Fee
                                  </td>
                                  <td className="p-4 align-top border-r border-gray-200 text-gray-700">
                                    {courseGovtFee}
                                  </td>
                                  <td className="p-4 align-top border-r border-gray-200 text-gray-700">
                                    One-time
                                  </td>
                                  <td className="p-4 align-top text-gray-700">
                                    Government college
                                  </td>
                                </tr>
                              )}
                              {coursePrivateFee && (
                                <tr className="border-b border-gray-200 hover:bg-gray-50">
                                  <td className="p-4 align-top border-r border-gray-200 font-semibold text-gray-900">
                                    Private Fee
                                  </td>
                                  <td className="p-4 align-top border-r border-gray-200 text-gray-700">
                                    {coursePrivateFee}
                                  </td>
                                  <td className="p-4 align-top border-r border-gray-200 text-gray-700">
                                    One-time
                                  </td>
                                  <td className="p-4 align-top text-gray-700">
                                    Private college
                                  </td>
                                </tr>
                              )}
                            </tbody>
                            <tfoot>
                              <tr className="bg-[#eff4fc]">
                                <td className="p-4 font-bold text-gray-900 border-r border-gray-200">
                                  Total Estimated First Year Fee
                                </td>
                                <td className="p-4 font-bold text-gray-900 border-r border-gray-200">
                                  {courseEstFee || "Varies"}
                                </td>
                                <td className="p-4 text-gray-700 border-r border-gray-200">
                                  First Year
                                </td>
                                <td className="p-4 text-gray-700">
                                  Varies by college
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <EmptyTabState tabName="fee" />
              )}
            </div>
          )}

          {/* Downloads Tab */}
          {activeTab === "downloads" && (
            <div className="tab-content">
              {hasDownloadsData ? (
                <div>
                  <div className="mb-6">
                    <h2 className="text-[20px] font-bold text-gray-900">Downloads</h2>
                    <p className="mt-1 text-[14px] text-gray-500">Access brochures, forms, and study materials.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {downloads.map((download: any, i: number) => (
                      <div key={download.title || i} className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-5 transition">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                            <i className="fa-regular fa-file-lines text-xl"></i>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{download.title}</h4>
                            <p className="text-[12.5px] text-gray-500">{download.size || "Download file"}</p>
                          </div>
                        </div>
                        {download.file ? (
                          <a href={download.file} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-md bg-[#0000ff] hover:bg-blue-700 px-5 py-2.5 text-sm font-bold text-white">
                            <i className="fa-solid fa-download"></i>Download
                          </a>
                        ) : (
                          <button className="flex items-center gap-2 rounded-md bg-[#0000ff] hover:bg-blue-700 px-5 py-2.5 text-sm font-bold text-white">
                            <i className="fa-solid fa-download"></i>Download
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyTabState tabName="downloads" />
              )}
            </div>
          )}

          {/* Scholarships Tab */}
          {activeTab === "scholarships" && (
            <div className="tab-content">
              {hasScholarshipData ? (
                <div className="pt-8">
                  <h2 className="text-[22px] font-bold text-gray-900 mb-4">
                    Scholarships Overview
                  </h2>
                  {scholarshipDesc && (
                    <p className="text-[15px] text-gray-600 mb-6 leading-relaxed">
                      {scholarshipDesc}
                    </p>
                  )}

                  {scholarships.length > 0 && (
                    <>
                      <h3 className="text-[17px] font-bold text-gray-900 mb-4">
                        Scholarship Types
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {scholarships.map((s: any, i: number) => (
                          <div
                            key={i}
                            className="border border-gray-200 rounded-xl p-5 bg-white"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 rounded-full bg-[#0000ff] flex items-center justify-center text-white shrink-0">
                                <span className="text-sm font-bold">
                                  {i + 1}
                                </span>
                              </div>
                              <h3 className="font-bold text-gray-900 text-[16px]">
                                {s.title}
                              </h3>
                            </div>
                            {s.subtitle && (
                              <p className="text-sm text-gray-500 mb-2">
                                {s.subtitle}
                              </p>
                            )}
                            {s.description && (
                              <p className="text-sm text-gray-600 mb-3">
                                {s.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 flex-wrap">
                              {s.coverage && (
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold text-xs">
                                  Amount: {s.coverage}
                                </span>
                              )}
                              {s.requirement && (
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold text-xs">
                                  {s.requirement}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  <div className="bg-[#f8fafc] border border-gray-200 rounded-xl p-5">
                    <h4 className="font-bold text-gray-900 mb-3 text-[16px]">
                      Important Notes:
                    </h4>
                    <ul className="space-y-2 text-[14px] text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-[#0000ff] mt-0.5">&bull;</span>
                        <span>
                          Scholarship availability, coverage percentage, and
                          eligibility criteria vary by college. Contact
                          individual colleges directly for specific details.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#0000ff] mt-0.5">&bull;</span>
                        <span>
                          Most scholarships are renewable annually based on
                          maintaining minimum GPA requirements (typically 3.0 or
                          above).
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#0000ff] mt-0.5">&bull;</span>
                        <span>
                          Some colleges allow combining multiple scholarship
                          types (e.g., merit + sibling discount), while others
                          do not.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#0000ff] mt-0.5">&bull;</span>
                        <span>
                          Application deadlines for scholarships often differ
                          from regular admission deadlines. Check with colleges
                          early.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <EmptyTabState tabName="scholarships" />
              )}
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === "faq" && (
            <div className="tab-content">
              {hasFaqData ? (
                <div>
                  <div className="mb-6">
                    <h2 className="text-[20px] font-bold text-gray-900">
                      Frequently Asked Questions
                    </h2>
                    <p className="text-[14px] text-gray-500 mt-1">
                      Find answers to common questions
                    </p>
                  </div>
                  <div className="space-y-3">
                    {faqs.map((f: any, i: number) => (
                      <div
                        key={i}
                        className="bg-white rounded-xl overflow-hidden border border-gray-100"
                      >
                        <button
                          onClick={() => toggleFaq(i)}
                          className="w-full px-5 py-4 flex items-center justify-between text-left transition bg-transparent cursor-pointer"
                        >
                          <span className="font-semibold text-gray-900 text-[15px] pr-4">
                            Q: {f.question}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${
                              openFaqIndex === i ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {openFaqIndex === i && (
                          <div className="px-5 pb-4">
                            <p className="text-[14px] text-gray-600 leading-relaxed">
                              {f.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyTabState tabName="FAQ" />
              )}
            </div>
          )}

          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-32 space-y-6">
              {sponsoredInsts.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-[20px] font-bold text-gray-900">Sponsored Colleges</h3>
                    <span className="text-[11px] font-bold text-gray-400 tracking-wider">AD</span>
                  </div>
                  <div className="space-y-4">
                    {sponsoredInsts.map((inst: any) => (
                      <Link
                        key={inst.id}
                        href={`/find-college/${inst.college_id || inst.id}`}
                        className="bg-white border border-gray-200 rounded-[14px] p-5 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="w-[60px] h-[60px] rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0 p-1">
                          {inst.logo_url ? (
                            <img src={inst.logo_url} alt={inst.institution_name} className="w-full h-full object-contain rounded" />
                          ) : (
                            <div className="w-full h-full bg-brand-blue rounded" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-1">
                            <h4 className="text-[17px] font-bold text-gray-900 truncate">{inst.institution_name}</h4>
                            {inst.is_verified && (
                              <svg className="w-4 h-4 text-[#1678e3] shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
                            )}
                          </div>
                          {inst.district && (
                            <div className="flex items-center gap-1.5 text-gray-500 text-[13px] mb-1.5">
                              <MapPin className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{inst.district}</span>
                            </div>
                          )}
                          {inst.website_url && (
                            <a
                              href={inst.website_url.startsWith("http") ? inst.website_url : `https://${inst.website_url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-[#1678e3] text-[13px] font-medium hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Globe className="w-3.5 h-3.5 shrink-0" />
                              {inst.website_url.replace(/^https?:\/\//, "")}
                            </a>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
