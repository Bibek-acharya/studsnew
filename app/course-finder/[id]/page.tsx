"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Lightbulb,
  Brain,
  Target,
  FlaskConical,
  TrendingUp,
  Users,
  HeartPulse,
  ArrowRight,
} from "lucide-react";
import { fetchCourseDetailsById } from "@/services/course-api";
import EmptyTabState from "@/components/course-finder/EmptyTabState";
import RichText from "@/components/RichText";

type TabKey =
  | "overview"
  | "eligibility"
  | "admission"
  | "courses"
  | "fees"
  | "scholarships"
  | "faq"
  | "news"
  | "blogs";

const tabs: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "eligibility", label: "Eligibility" },
  { key: "admission", label: "Admission" },
  { key: "courses", label: "Courses" },
  { key: "fees", label: "Program Fee" },
  { key: "scholarships", label: "Scholarships" },
  { key: "faq", label: "FAQ" },
  { key: "news", label: "News" },
  { key: "blogs", label: "Blogs" },
];

function stripHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const iconMap: Record<string, React.ReactNode> = {
  lightbulb: <Lightbulb className="w-6 h-6" />,
  brain: <Brain className="w-6 h-6" />,
  target: <Target className="w-6 h-6" />,
  "flask-conical": <FlaskConical className="w-6 h-6" />,
  "trending-up": <TrendingUp className="w-6 h-6" />,
  users: <Users className="w-6 h-6" />,
  "heart-pulse": <HeartPulse className="w-6 h-6" />,
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
  const [isTabsOverflowing, setIsTabsOverflowing] = useState(false);
  const [canScrollTabsLeft, setCanScrollTabsLeft] = useState(false);
  const [canScrollTabsRight, setCanScrollTabsRight] = useState(false);

  const { data: details, isLoading } = useQuery({
    queryKey: ["course-details", id],
    queryFn: () => fetchCourseDetailsById(id),
  });

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
    window.scrollTo({ top: 520, behavior: "smooth" });
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  if (isLoading) {
    return (
      <div className="w-full animate-pulse">
        <div className="mx-auto max-w-350 pt-12 pb-8 px-4">
          <div className="h-4 w-64 rounded bg-gray-200 mb-6" />
          <div className="h-9 w-80 rounded bg-gray-200 mb-2" />
          <div className="h-4 w-48 rounded bg-gray-200 mb-6" />
          <div className="h-[280px] md:h-[380px] rounded-md bg-gray-200" />
        </div>
        <div className="mx-auto max-w-350 flex gap-8 px-4 border-b border-gray-100">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-10 w-20 rounded bg-gray-200 mb-0" />
          ))}
        </div>
        <div className="mx-auto max-w-350 py-8 md:py-12 px-4">
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

  const features = programData?.features || [];
  const whoShouldChoose = programData?.whoShouldChoose || [];
  const eligibilityRows = programData?.eligibilityRows || [];
  const admissionSteps = programData?.admissionSteps || [];
  const fullTimeCourses = programData?.fullTimeCourses || [];
  const feeItems = programData?.feeItems || [];
  const scholarships = programData?.scholarships || [];
  const scholarshipDesc = programData?.scholarshipDesc || "";
  const subjectGroups = programData?.subjectGroups || [];
  const faqs = programData?.faqs || [];
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
    eligibilityRows.length > 0 || admissionRequirements.length > 0;
  const hasAdmissionData = admissionSteps.length > 0;
  const hasCoursesData =
    fullTimeCourses.length > 0 ||
    subjectGroups.length > 0 ||
    curriculum.length > 0;
  const hasFeeData =
    feeItems.length > 0 ||
    !!(courseEstFee || courseGovtFee || coursePrivateFee);
  const hasScholarshipData = !!(scholarshipDesc || scholarships.length > 0);
  const hasFaqData = faqs.length > 0;

  const bannerImage =
    courseImage ||
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=600&fit=crop";

  const getIcon = (iconName: string | undefined, index: number) => {
    if (iconName && iconMap[iconName]) return iconMap[iconName];
    return <span className="text-sm font-bold">{index + 1}</span>;
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .tab-content { animation: fadeIn 0.4s ease-in-out; }
         .ql-editor { padding: 0; max-width: 100%; overflow-x: hidden; word-break: normal; hyphens: none; line-break: strict; }
         .ql-editor p, .ql-editor li { font-size: 15px; line-height: 1.8; color: #4b5563; word-break: normal; overflow-wrap: break-word; hyphens: none; line-break: strict; }
        .ql-editor strong { font-weight: 700; color: #111827; }
        .ql-editor img { max-width: 100%; height: auto; }
         .ql-editor pre { white-space: pre-wrap; word-break: normal; overflow-wrap: break-word; max-width: 100%; overflow-x: auto; }
        .ql-editor table { max-width: 100%; overflow-x: auto; display: block; }
        details[open] summary ~ * { animation: slideDown 0.3s ease-out; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="w-full bg-white text-gray-800">
        <div className="mx-auto max-w-350 pt-12 pb-8 px-4">
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

          <div
            className="relative w-full h-[280px] md:h-[380px] max-md:bg-contain bg-cover bg-center bg-no-repeat rounded-2xl overflow-hidden"
            style={{
              backgroundImage: `url('${bannerImage}')`,
              backgroundPosition: "center 20%",
            }}
          >
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
        </div>

        <div className="mx-auto max-w-350 sticky top-0 z-40 bg-white border-b border-gray-100">
          <div className="relative overflow-hidden px-4">
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
                className="flex w-max space-x-8 whitespace-nowrap"
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

        <div className="mx-auto max-w-350 py-8 md:py-12 bg-white px-4">
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
                          {getIcon(item.icon, i)}
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

              {subjectGroups.length > 0 && (
                <div className="pt-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Course Details
                  </h2>
                  <div className="space-y-6">
                    {subjectGroups.map((sg: any, i: number) => (
                      <div
                        key={i}
                        className="border border-gray-200 rounded-xl p-6 bg-white"
                      >
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#0000ff] flex items-center justify-center text-white flex-shrink-0">
                              {getIcon(sg.icon, i)}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">
                                {sg.groupName}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {sg.subjects?.slice(0, 3).join(", ")}
                              </p>
                            </div>
                          </div>
                          {sg.status && (
                            <span
                              className={`px-3 py-1 text-xs font-semibold rounded-full shrink-0 ${
                                sg.status === "Admissions Open"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {sg.status}
                            </span>
                          )}
                        </div>
                        {sg.description && (
                          <p className="text-gray-700 leading-relaxed mb-4">
                            {sg.description}
                          </p>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {sg.subjects?.length > 0 && (
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h4 className="font-semibold text-gray-900 mb-2">
                                Available Streams:
                              </h4>
                              <ul className="space-y-1 text-sm text-gray-600">
                                {sg.subjects.map((sub: string, j: number) => (
                                  <li
                                    key={j}
                                    className="flex items-center gap-2"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#0000ff]"></span>
                                    {sub}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {sg.careers?.length > 0 && (
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h4 className="font-semibold text-gray-900 mb-2">
                                Career Opportunities:
                              </h4>
                              <ul className="space-y-1 text-sm text-gray-600">
                                {sg.careers.map((c: string, j: number) => (
                                  <li
                                    key={j}
                                    className="flex items-center gap-2"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#0000ff]"></span>
                                    {c}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
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

          {/* Eligibility Tab */}
          {activeTab === "eligibility" && (
            <div className="tab-content">
              {hasEligibilityData ? (
                <div>
                  <h2 className="text-[22px] font-bold text-gray-900 mb-4">
                    Eligibility Criteria
                  </h2>
                  <h3 className="text-[17px] font-bold text-gray-900 mb-4">
                    Full time Courses
                  </h3>
                  <div className="overflow-x-auto rounded border border-gray-200">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead>
                        <tr className="bg-[#eff4fc] border-b border-gray-200">
                          <th className="p-4 font-bold text-gray-900 w-[8%] border-r border-gray-200">
                            S.N.
                          </th>
                          <th className="p-4 font-bold text-gray-900 w-[18%] border-r border-gray-200">
                            Level
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
                            <td className="p-4 align-top border-r border-gray-200 font-semibold text-gray-900">
                              {row.level || "N/A"}
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

          {/* Courses Tab */}
          {activeTab === "courses" && (
            <div className="tab-content">
              {hasCoursesData ? (
                <div>
                  {fullTimeCourses.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-[22px] font-bold text-gray-900 mb-4">
                        {courseTitle} Courses & Fees
                      </h2>

                      <div className="overflow-x-auto rounded border border-gray-200">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                          <thead>
                            <tr className="bg-[#eff4fc] border-b border-gray-200">
                              <th className="p-4 font-bold text-gray-900 w-[28%] border-r border-gray-200">
                                Course
                              </th>
                              <th className="p-4 font-bold text-gray-900 w-[30%] border-r border-gray-200">
                                Total Fees
                              </th>
                              <th className="p-4 font-bold text-gray-900 w-[27%] border-r border-gray-200">
                                Admission Duration
                              </th>
                              <th className="p-4 font-bold text-gray-900 w-[15%]">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody className="text-[15px]">
                            {fullTimeCourses.map((ft: any, i: number) => (
                              <tr
                                key={i}
                                className="border-b border-gray-200 hover:bg-gray-50"
                              >
                                <td className="p-4 align-top border-r border-gray-200">
                                  <div className="text-gray-900 font-semibold mb-1">
                                    {ft.course}
                                  </div>
                                </td>
                                <td className="p-4 align-top border-r border-gray-200">
                                  <div className="text-[#059669] mb-1">
                                    {ft.totalFees || "-"}
                                  </div>
                                </td>
                                <td className="p-4 align-top border-r border-gray-200 text-gray-700">
                                  {ft.startDate && ft.endDate
                                    ? (() => {
                                        const s = new Date(ft.startDate);
                                        const e = new Date(ft.endDate);
                                        const months = [
                                          "Jan",
                                          "Feb",
                                          "Mar",
                                          "Apr",
                                          "May",
                                          "Jun",
                                          "Jul",
                                          "Aug",
                                          "Sep",
                                          "Oct",
                                          "Nov",
                                          "Dec",
                                        ];
                                        if (
                                          !isNaN(s.getTime()) &&
                                          !isNaN(e.getTime())
                                        ) {
                                          return `${months[s.getMonth()]}-${months[e.getMonth()]} ${s.getFullYear()}`;
                                        }
                                        return `${ft.startDate} - ${ft.endDate}`;
                                      })()
                                    : ft.admissionDuration || "-"}
                                </td>
                                <td className="p-4 align-top">
                                  <a
                                    href="#"
                                    className="text-[#2563eb] hover:underline flex items-center text-sm font-medium"
                                  >
                                    View College{" "}
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {subjectGroups.length > 0 && (
                    <div className="pt-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Course Details
                      </h2>
                      <div className="space-y-6">
                        {subjectGroups.map((sg: any, i: number) => (
                          <div
                            key={i}
                            className="border border-gray-200 rounded-xl p-6 bg-white"
                          >
                            <div className="flex items-start justify-between gap-4 mb-4">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[#0000ff] flex items-center justify-center text-white flex-shrink-0">
                                  {getIcon(sg.icon, i)}
                                </div>
                                <div>
                                  <h3 className="text-xl font-bold text-gray-900">
                                    {sg.groupName}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    {sg.subjects?.slice(0, 3).join(", ")}
                                  </p>
                                </div>
                              </div>
                              {sg.status && (
                                <span
                                  className={`px-3 py-1 text-xs font-semibold rounded-full shrink-0 ${
                                    sg.status === "Admissions Open"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-blue-100 text-blue-700"
                                  }`}
                                >
                                  {sg.status}
                                </span>
                              )}
                            </div>
                            {sg.description && (
                              <p className="text-gray-700 leading-relaxed mb-4">
                                {sg.description}
                              </p>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {sg.subjects?.length > 0 && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                  <h4 className="font-semibold text-gray-900 mb-2">
                                    Available Streams:
                                  </h4>
                                  <ul className="space-y-1 text-sm text-gray-600">
                                    {sg.subjects.map(
                                      (sub: string, j: number) => (
                                        <li
                                          key={j}
                                          className="flex items-center gap-2"
                                        >
                                          <span className="w-1.5 h-1.5 rounded-full bg-[#0000ff]"></span>
                                          {sub}
                                        </li>
                                      ),
                                    )}
                                  </ul>
                                </div>
                              )}
                              {sg.careers?.length > 0 && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                  <h4 className="font-semibold text-gray-900 mb-2">
                                    Career Opportunities:
                                  </h4>
                                  <ul className="space-y-1 text-sm text-gray-600">
                                    {sg.careers.map((c: string, j: number) => (
                                      <li
                                        key={j}
                                        className="flex items-center gap-2"
                                      >
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#0000ff]"></span>
                                        {c}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {curriculum.length > 0 &&
                    fullTimeCourses.length === 0 &&
                    subjectGroups.length === 0 && (
                      <div className="mb-8">
                        <h2 className="text-[22px] font-bold text-gray-900 mb-4">
                          Course Curriculum
                        </h2>
                        <div className="space-y-6">
                          {curriculum.map((sem: any, i: number) => (
                            <div
                              key={i}
                              className="border border-gray-200 rounded-md p-6 bg-white"
                            >
                              <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 rounded-md bg-[#0000ff] flex items-center justify-center text-white flex-shrink-0">
                                  <span className="text-sm font-bold">
                                    {sem.semester || i + 1}
                                  </span>
                                </div>
                                <div>
                                  <h3 className="text-xl font-bold text-gray-900">
                                    {sem.title ||
                                      `Semester ${sem.semester || i + 1}`}
                                  </h3>
                                  {sem.subtitle && (
                                    <p className="text-sm text-gray-500">
                                      {sem.subtitle}
                                    </p>
                                  )}
                                </div>
                              </div>
                              {sem.subjects?.length > 0 && (
                                <div className="bg-gray-50 rounded-md p-4">
                                  <h4 className="font-semibold text-gray-900 mb-2">
                                    Subjects:
                                  </h4>
                                  <ul className="space-y-1 text-sm text-gray-600">
                                    {sem.subjects.map(
                                      (sub: string, j: number) => (
                                        <li
                                          key={j}
                                          className="flex items-center gap-2"
                                        >
                                          <span className="w-1.5 h-1.5 rounded-full bg-[#0000ff]"></span>
                                          {sub}
                                        </li>
                                      ),
                                    )}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ) : (
                <EmptyTabState tabName="courses" />
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
                  <h3 className="text-[17px] font-bold text-gray-900 mb-4">
                    Full time Courses
                  </h3>
                  {(feeItems.length > 0 ||
                    courseGovtFee ||
                    coursePrivateFee) && (
                    <div className="overflow-x-auto rounded border border-gray-200 mb-6">
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
                          {feeItems.map((fi: any, i: number) => (
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
                </div>
              ) : (
                <EmptyTabState tabName="fee" />
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

          {/* News Tab */}
          {activeTab === "news" && (
            <div className="tab-content">
              <EmptyTabState tabName="news" />
            </div>
          )}

          {/* Blogs Tab */}
          {activeTab === "blogs" && (
            <div className="tab-content">
              <EmptyTabState tabName="blogs" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
