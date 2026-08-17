"use client";

import React, { useState, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "../../services/api";
import { fetchCourseDetailsById } from "../../services/course-api";
import { GlobalCourse } from "@/types/course";
import {
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Clock,
  Award,
  BookOpen,
  MapPin,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

interface CourseDetailsPageProps {
  courseId: string | number;
  onBack: () => void;
  onNavigate: (view: string, data?: any) => void;
}

function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

const TAB_LIST = [
  { id: "overview", label: "Overview" },
  { id: "eligibility", label: "Eligibility" },
  { id: "admission", label: "Admission" },
  { id: "courses", label: "Courses" },
  { id: "fees", label: "Program Fee" },
  { id: "scholarships", label: "Scholarships" },
  { id: "facilities", label: "Facilities" },
  { id: "faculty", label: "Faculty" },
  { id: "achievements", label: "Achievements" },
  { id: "news", label: "News" },
  { id: "downloads", label: "Downloads" },
  { id: "faq", label: "FAQ" },
];

const CourseDetailsPage: React.FC<CourseDetailsPageProps> = ({
  courseId,
  onBack,
  onNavigate,
}) => {
  const tabNavRef = useRef<HTMLDivElement>(null);

  const { data: listData, isLoading: listLoading } = useQuery({
    queryKey: ["education-courses"],
    queryFn: () => apiService.getEducationCourses(),
  });

  const { data: detailsData, isLoading: detailsLoading } = useQuery({
    queryKey: ["course-details", courseId],
    queryFn: () => fetchCourseDetailsById(String(courseId)),
  });

  const allCourses = useMemo(
    () => (listData?.data?.courses || []) as unknown as GlobalCourse[],
    [listData],
  );

  const course = useMemo(
    () => allCourses.find((c) => String(c.id) === String(courseId)) || null,
    [allCourses, courseId],
  );

  const details = detailsData || null;

  const courseTitle = stripHtml(course?.title || details?.course?.title || "");
  const courseDuration = stripHtml(
    course?.duration || details?.course?.duration || "",
  );
  const courseLevel = stripHtml(
    course?.level || details?.course?.level || "",
  );
  const courseField = stripHtml(
    course?.field || details?.course?.field || "",
  );
  const courseDescription = stripHtml(
    course?.description ||
      details?.course?.description ||
      details?.about?.join(" ") ||
      "",
  );
  const courseEstFee = stripHtml(
    course?.estFee || details?.course?.estFee || "",
  );
  const courseMode = stripHtml(
    (course as any)?.mode || details?.mode || details?.course?.mode || "",
  );
  const courseBannerUrl =
    course?.bannerUrl || details?.course?.bannerUrl || "";

  // Detailed fields — read from course first, then details top level
  const whoShouldChoose = details?.course?.whoShouldChoose || [];
  const features = details?.course?.features || [];
  const eligibilityRows = details?.course?.eligibilityRows || [];
  const admissionSteps = details?.course?.admissionSteps || [];
  const subjectGroups = details?.course?.subjectGroups || [];
  const fullTimeCourses = details?.course?.fullTimeCourses || [];
  const feeItems = details?.course?.feeItems || [];
  const scholarshipDesc = details?.course?.scholarshipDesc || "";
  const scholarshipNotes = details?.course?.scholarshipNotes || "";
  const scholarships = details?.course?.scholarships || [];
  const faqs = details?.course?.faqs || [];

  // Top-level details (fallback from CourseDetailsResponse)
  const detailAbout = details?.about || [];
  const detailCurriculum = details?.curriculum || [];
  const detailAdmissionReqs = details?.admissionRequirements || [];
  const detailCareers = details?.careerOpportunities || [];
  const detailUniversities = details?.universities || [];
  const detailContact = details?.contact || { email: "", phone: "" };
  const detailOtherPrograms = details?.otherPrograms || [];
  const detailHighlightsUniversity = details?.highlightsUniversity || "";
  const detailHighlightsFaculty = details?.highlightsFaculty || "";
  const detailHighlightsDuration = details?.highlightsDuration || "";
  const detailHighlightsDegreeLevel = details?.highlightsDegreeLevel || "";
  const detailOfferingCollegesCount = details?.offeringCollegesCount || 0;

  const [activeTab, setActiveTab] = useState("overview");

  const scrollTabs = (dir: number) => {
    tabNavRef.current?.scrollBy({ left: dir * 200, behavior: "smooth" });
  };

  const isLoading = listLoading || detailsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <p className="text-gray-500">Loading course details...</p>
      </div>
    );
  }

  if (!course && !details) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-3">
        <BookOpen className="w-12 h-12 text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-900">
          Course Not Found
        </h3>
        <p className="text-sm text-gray-500">
          The course you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <button
          onClick={onBack}
          className="mt-2 text-sm font-medium text-blue-600 hover:underline"
        >
          Back to Course Finder
        </button>
      </div>
    );
  }

  const relatedCourses = allCourses
    .filter((c) => String(c.id) !== String(courseId))
    .slice(0, 3);

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-in-out; }
      `}</style>

      <div className="w-full bg-white">
        {/* ── Header: Breadcrumb + Title + Banner ── */}
        <div className="px-6 md:px-12 lg:px-24 xl:px-32 pt-12 pb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-gray-500 mb-6 gap-1">
            <button
              onClick={() => onNavigate("finder")}
              className="hover:text-gray-900 transition-colors bg-transparent border-none p-0 cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <button
              onClick={onBack}
              className="hover:text-gray-900 transition-colors bg-transparent border-none p-0 cursor-pointer"
            >
              Course Finder
            </button>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-semibold">
              {courseTitle || "Course"}
            </span>
          </nav>

          {/* Title + Subtitle */}
          <div className="mb-6">
            <h1 className="text-[28px] md:text-4xl font-bold text-gray-900">
              {courseTitle}
            </h1>
            <p className="text-sm text-gray-400 font-medium mt-2">
              {[courseDuration, courseLevel, courseMode]
                .filter(Boolean)
                .join(" | ")}
            </p>
          </div>

          {/* Banner Image */}
          <div
            className="relative w-full h-[280px] md:h-[380px] bg-cover bg-center rounded-2xl overflow-hidden"
            style={{
              backgroundImage: courseBannerUrl
                ? `url('${courseBannerUrl}')`
                : undefined,
              backgroundColor: courseBannerUrl ? undefined : "#0000ff",
              backgroundPosition: "center 20%",
            }}
          >
            <div className="absolute inset-0 bg-black/10" />
          </div>
        </div>

        {/* ── Sticky Tab Navigation ── */}
        <div className="px-6 md:px-12 lg:px-24 xl:px-32 overflow-hidden bg-white sticky top-0 z-40">
          <div className="relative">
            <button
              onClick={() => scrollTabs(-1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center md:hidden shadow-sm"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div
              ref={tabNavRef}
              className="overflow-x-auto no-scrollbar"
            >
              <nav className="flex space-x-8 whitespace-nowrap border-b border-gray-100">
                {TAB_LIST.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`border-b-2 py-4 text-[14px] bg-transparent cursor-pointer transition-colors ${
                      activeTab === tab.id
                        ? "border-[#0000ff] font-bold text-gray-900"
                        : "border-transparent font-semibold text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            <button
              onClick={() => scrollTabs(1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center md:hidden shadow-sm"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* ── Content: 2-Column Grid ── */}
        <div className="px-6 md:px-12 lg:px-24 xl:px-32 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-3 gap-10 bg-white">
          {/* Main Content */}
          <div className="lg:col-span-2 min-h-[500px]">
            {/* Overview */}
            {activeTab === "overview" && (
              <div className="animate-fade-in">
                <div className="space-y-6 text-gray-600 text-[15px] md:text-[15.5px] leading-[1.8]">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Overview
                  </h2>
                  {courseDescription ? (
                    courseDescription.split("\n").map((para, i) => (
                      <p key={i}>{para}</p>
                    ))
                  ) : (
                    <p className="text-gray-400 italic">
                      No description available.
                    </p>
                  )}
                </div>

                {/* Who Should Choose / Features */}
                {whoShouldChoose.length > 0 && (
                  <div className="pt-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Who Should Choose This Course?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {whoShouldChoose.map(
                        (item: any, i: number) => (
                          <div
                            key={i}
                            className="border border-gray-200 rounded-xl p-6 bg-white"
                          >
                            <div className="w-12 h-12 rounded-xl bg-[#0000ff] flex items-center justify-center text-white mb-4">
                              <GraduationCap className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2 text-[17px]">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {item.shortDesc}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {features.length > 0 && (
                  <div className="pt-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Key Features
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {features.map(
                        (item: any, i: number) => (
                          <div
                            key={i}
                            className="border border-gray-200 rounded-xl p-6 bg-white"
                          >
                            <div className="w-12 h-12 rounded-xl bg-[#0000ff] flex items-center justify-center text-white mb-4">
                              <Award className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2 text-[17px]">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {item.shortDesc}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Eligibility */}
            {activeTab === "eligibility" && (
              <div className="animate-fade-in">
                <h2 className="text-[22px] font-bold text-gray-900 mb-4">
                  Eligibility Criteria
                </h2>
                {eligibilityRows.length > 0 ? (
                  <div className="mb-6">
                    <h3 className="text-[17px] font-bold text-gray-900 mb-4">
                      Full time Courses
                    </h3>
                    <div className="overflow-x-auto rounded border border-gray-200">
                      <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                          <tr className="bg-[#eff4fc] border-b border-gray-200">
                            <th className="p-4 font-bold text-gray-900 w-[8%] border-r border-gray-200">
                              S.N.
                            </th>
                            <th className="p-4 font-bold text-gray-900 w-[28%] border-r border-gray-200">
                              Stream/Faculty
                            </th>
                            <th className="p-4 font-bold text-gray-900 w-[32%] border-r border-gray-200">
                              Eligibility
                            </th>
                            <th className="p-4 font-bold text-gray-900 w-[32%]">
                              Required Documents
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-[15px]">
                          {eligibilityRows.map(
                            (row: any, i: number) => (
                              <tr
                                key={i}
                                className="border-b border-gray-200 hover:bg-gray-50"
                              >
                                <td className="p-4 align-top border-r border-gray-200 text-gray-700">
                                  {i + 1}
                                </td>
                                <td className="p-4 align-top border-r border-gray-200 text-gray-700">
                                  {row.stream || "-"}
                                </td>
                                <td className="p-4 align-top border-r border-gray-200 text-gray-700">
                                  {Array.isArray(row.eligibility) ? row.eligibility.join(", ") : (row.eligibility || "-")}
                                </td>
                                <td className="p-4 align-top text-gray-700">
                                  {Array.isArray(row.documents) && row.documents.length > 0 ? (
                                    <ul className="space-y-1 text-sm">
                                      {row.documents.map((doc: string, j: number) => (
                                        <li key={j} className="flex items-center gap-2">
                                          <span className="w-1.5 h-1.5 rounded-full bg-[#0000ff]" />
                                          {doc.trim()}
                                        </li>
                                      ))}
                                    </ul>
                                  ) : typeof row.documents === "string" && row.documents ? (
                                    <ul className="space-y-1 text-sm">
                                      {row.documents.split(",").map((doc: string, j: number) => (
                                        <li key={j} className="flex items-center gap-2">
                                          <span className="w-1.5 h-1.5 rounded-full bg-[#0000ff]" />
                                          {doc.trim()}
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    "-"
                                  )}
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : detailAdmissionReqs.length > 0 ? (
                  <ul className="space-y-3">
                    {detailAdmissionReqs.map(
                      (req: string, i: number) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 p-4 bg-blue-50 rounded-md"
                        >
                          <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span className="text-gray-700">
                            {stripHtml(req)}
                          </span>
                        </li>
                      ),
                    )}
                  </ul>
                ) : (
                  <p className="text-gray-400 italic">
                    No eligibility information available.
                  </p>
                )}
              </div>
            )}

            {/* Admission */}
            {activeTab === "admission" && (
              <div className="animate-fade-in">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Admission Process
                  </h2>
                  <p className="text-gray-600">
                    Step-by-step guide for {courseTitle} admission
                  </p>
                </div>
                {admissionSteps.length > 0 ? (
                  admissionSteps.map(
                    (step: any, i: number) => (
                      <div key={i} className="mb-6">
                        <div className="flex items-start gap-4 mb-4">
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
                      </div>
                    ),
                  )
                ) : (
                  <p className="text-gray-400 italic">
                    No admission process information available.
                  </p>
                )}
              </div>
            )}

            {/* Courses & Fees */}
            {activeTab === "courses" && (
              <div className="animate-fade-in">
                <h2 className="text-[22px] font-bold text-gray-900 mb-4">
                  {courseTitle} Courses & Fees
                </h2>

                {/* Full Time Courses Table */}
                {fullTimeCourses.length > 0 && (
                  <div className="mb-8">
                    <div className="overflow-x-auto rounded border border-gray-200">
                      <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                          <tr className="bg-[#eff4fc] border-b border-gray-200">
                            <th className="p-4 font-bold text-gray-900 w-[28%] border-r border-gray-200">Course</th>
                            <th className="p-4 font-bold text-gray-900 w-[30%] border-r border-gray-200">Total Fees</th>
                            <th className="p-4 font-bold text-gray-900 w-[27%] border-r border-gray-200">Admission Duration</th>
                            <th className="p-4 font-bold text-gray-900 w-[15%]">Action</th>
                          </tr>
                        </thead>
                        <tbody className="text-[15px]">
                          {fullTimeCourses.map((ftc: any, i: number) => (
                            <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="p-4 align-top border-r border-gray-200">
                                <div className="text-gray-900 font-semibold mb-1">{ftc.course}</div>
                              </td>
                              <td className="p-4 align-top border-r border-gray-200">
                                <div className="text-[#059669] mb-1">{ftc.totalFees || "-"}</div>
                              </td>
                              <td className="p-4 align-top border-r border-gray-200 text-gray-700">
                                {[ftc.startDate, ftc.endDate].filter(Boolean).join(" - ") || "-"}
                              </td>
                              <td className="p-4 align-top">
                                <span className="text-[#2563eb] hover:underline flex items-center cursor-pointer text-[14px]">
                                  View College <ArrowRight className="w-4 h-4 ml-1" />
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Course Details Cards */}
                {subjectGroups.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Details</h2>
                    <div className="space-y-6">
                      {subjectGroups.map((group: any, i: number) => (
                        <div key={i} className="border border-gray-200 rounded-xl p-6 bg-white">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-xl bg-[#0000ff] flex items-center justify-center text-white flex-shrink-0">
                                <BookOpen className="w-6 h-6" />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-900">{group.groupName || group.name}</h3>
                                <p className="text-sm text-gray-500">{group.subtitle}</p>
                              </div>
                            </div>
                          </div>
                          {group.description && (
                            <p className="text-gray-700 leading-relaxed mb-4">{group.description}</p>
                          )}
                          {((group.subjects?.length ?? 0) > 0 || (group.careers?.length ?? 0) > 0 || group.streams || group.careerList) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {((group.subjects?.length ?? 0) > 0 || group.streams) && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                  <h4 className="font-semibold text-gray-900 mb-2">Available Streams:</h4>
                                  <ul className="space-y-1 text-sm text-gray-600">
                                    {(group.subjects || (group.streams || "").split(",")).filter(Boolean).map((s: string, j: number) => (
                                      <li key={j} className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#0000ff]" />
                                        {typeof s === "string" ? s.trim() : s}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {((group.careers?.length ?? 0) > 0 || group.careerList) && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                  <h4 className="font-semibold text-gray-900 mb-2">Career Opportunities:</h4>
                                  <ul className="space-y-1 text-sm text-gray-600">
                                    {(group.careers || (group.careerList || "").split(",")).filter(Boolean).map((c: string, j: number) => (
                                      <li key={j} className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#0000ff]" />
                                        {typeof c === "string" ? c.trim() : c}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fallback: Curriculum */}
                {(!fullTimeCourses.length && !subjectGroups.length) && detailCurriculum.length > 0 && (
                  <div className="space-y-6">
                    {detailCurriculum.map((sem: any, i: number) => (
                      <div key={i} className="border border-gray-200 rounded-md p-5">
                        <h3 className="font-bold text-gray-900 mb-2">{sem.title || `Semester ${sem.semester || i + 1}`}</h3>
                        {sem.subtitle && <p className="text-sm text-gray-500 mb-3">{sem.subtitle}</p>}
                        {(sem.subjects?.length ?? 0) > 0 && (
                          <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                            {sem.subjects.map((sub: string, j: number) => <li key={j}>{sub}</li>)}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {(!fullTimeCourses.length && !subjectGroups.length && !detailCurriculum.length) && (
                  <p className="text-gray-400 italic">No course information available.</p>
                )}
              </div>
            )}

            {/* Program Fee */}
            {activeTab === "fees" && (
              <div className="animate-fade-in">
                <h2 className="text-[22px] font-bold text-gray-900 mb-4">
                  Fee Structure
                </h2>
                {feeItems.length > 0 ? (
                  <div className="mb-6">
                    <h3 className="text-[17px] font-bold text-gray-900 mb-4">
                      Full time Courses
                    </h3>
                    <div className="overflow-x-auto rounded border border-gray-200">
                      <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                          <tr className="bg-[#eff4fc] border-b border-gray-200">
                            <th className="p-4 font-bold text-gray-900 w-[28%] border-r border-gray-200">
                              Particulars
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
                          {feeItems.map(
                            (item: any, i: number) => (
                              <tr
                                key={i}
                                className="border-b border-gray-200 hover:bg-gray-50"
                              >
                                <td className="p-4 align-top border-r border-gray-200 text-gray-900 font-semibold">
                                  {item.particular}
                                </td>
                                <td className="p-4 align-top border-r border-gray-200 text-gray-700">
                                  {item.amount || "-"}
                                </td>
                                <td className="p-4 align-top border-r border-gray-200 text-gray-700">
                                  {item.frequency || "-"}
                                </td>
                                <td className="p-4 align-top text-gray-700">
                                  {item.notes || "-"}
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>
                        {courseEstFee && (
                          <tfoot>
                            <tr className="bg-[#eff4fc]">
                              <td className="p-4 font-bold text-gray-900 border-r border-gray-200">
                                Total Estimated Fee
                              </td>
                              <td className="p-4 font-bold text-gray-900 border-r border-gray-200">
                                {courseEstFee}
                              </td>
                              <td className="p-4 text-gray-700 border-r border-gray-200" />
                              <td className="p-4 text-gray-700">
                                Varies by college
                              </td>
                            </tr>
                          </tfoot>
                        )}
                      </table>
                    </div>
                  </div>
                ) : courseEstFee ? (
                  <div className="border border-gray-200 rounded-xl p-6 bg-white">
                    <p className="text-gray-700">
                      <span className="font-semibold">Estimated Fee:</span>{" "}
                      {courseEstFee}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-400 italic">
                    No fee information available.
                  </p>
                )}
              </div>
            )}

            {/* Scholarships */}
            {activeTab === "scholarships" && (
              <div className="animate-fade-in">
                <div className="mb-6">
                  <h2 className="text-[22px] font-bold text-gray-900">
                    Scholarship Programs
                  </h2>
                  {scholarshipDesc && (
                    <div
                      className="text-[15px] text-gray-600 mt-1 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: scholarshipDesc }}
                    />
                  )}
                </div>
                {scholarships.length > 0 ? (
                  <div className="overflow-x-auto rounded border border-gray-200">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead>
                        <tr className="bg-[#eff4fc] border-b border-gray-200">
                          <th className="p-4 font-bold text-gray-900 w-[25%] border-r border-gray-200">
                            Scholarship Type
                          </th>
                          <th className="p-4 font-bold text-gray-900 w-[20%] border-r border-gray-200">
                            Coverage
                          </th>
                          <th className="p-4 font-bold text-gray-900 w-[20%] border-r border-gray-200">
                            Eligibility
                          </th>
                          <th className="p-4 font-bold text-gray-900 w-[20%] border-r border-gray-200">
                            Seats
                          </th>
                          <th className="p-4 font-bold text-gray-900 w-[15%]">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-[15px]">
                        {scholarships.map(
                          (sch: any, i: number) => (
                            <tr
                              key={i}
                              className="border-b border-gray-200 hover:bg-gray-50"
                            >
                              <td className="p-4 align-top border-r border-gray-200">
                                <div className="text-gray-900 font-semibold mb-1">
                                  {sch.title}
                                </div>
                                {sch.subtitle && (
                                  <div className="text-xs text-gray-500">
                                    {sch.subtitle}
                                  </div>
                                )}
                              </td>
                              <td className="p-4 align-top border-r border-gray-200">
                                <span className="text-[13px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-md">
                                  {sch.coverage || "-"}
                                </span>
                              </td>
                              <td className="p-4 align-top border-r border-gray-200 text-gray-700">
                                {sch.requirement || "-"}
                              </td>
                              <td className="p-4 align-top border-r border-gray-200 text-gray-700">
                                {sch.seats || "-"}
                              </td>
                              <td className="p-4 align-top">
                                <span className="text-[#0000ff] hover:underline text-[13px] font-semibold cursor-pointer">
                                  Apply Now
                                </span>
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-400 italic">
                    No scholarship information available.
                  </p>
                )}
                {scholarshipNotes && (
                  <div
                    className="mt-4 text-sm text-gray-500 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: scholarshipNotes }}
                  />
                )}
              </div>
            )}

            {/* FAQ */}
            {activeTab === "faq" && (
              <div className="animate-fade-in">
                <h2 className="text-[22px] font-bold text-gray-900 mb-6">
                  Frequently Asked Questions
                </h2>
                {faqs.length > 0 ? (
                  <div className="space-y-3">
                    {faqs.map((faq: any, i: number) => (
                      <FaqItem key={i} question={faq.question} answer={faq.answer} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">
                    No FAQs available.
                  </p>
                )}
              </div>
            )}

            {/* Facilities */}
            {activeTab === "facilities" && (
              <div className="animate-fade-in">
                <h2 className="text-[22px] font-bold text-gray-900 mb-2">Facilities</h2>
                <p className="text-[15px] text-gray-600 mb-6">State-of-the-art infrastructure for quality education</p>
                {features.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((item: any, i: number) => (
                      <div key={i} className="border border-gray-200 rounded-xl p-5 bg-white">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <Award className="w-5 h-5 text-[#0000ff]" />
                          </div>
                          <h3 className="font-bold text-gray-900">{item.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{item.shortDesc}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">Facility information is available on the college page.</p>
                )}
              </div>
            )}

            {/* Faculty */}
            {activeTab === "faculty" && (
              <div className="animate-fade-in">
                <h2 className="text-[22px] font-bold text-gray-900 mb-2">Faculty</h2>
                <p className="text-[15px] text-gray-600 mb-6">Experienced and dedicated educators</p>
                {detailHighlightsFaculty ? (
                  <div className="border border-gray-200 rounded-xl p-6 bg-white">
                    <h3 className="font-bold text-gray-900 mb-2">Faculty / Stream</h3>
                    <p className="text-gray-600">{detailHighlightsFaculty}</p>
                  </div>
                ) : (
                  <p className="text-gray-400 italic">Faculty information is available on the college page.</p>
                )}
              </div>
            )}

            {/* Achievements */}
            {activeTab === "achievements" && (
              <div className="animate-fade-in">
                <h2 className="text-[20px] font-bold text-gray-900 mb-2">Achievements</h2>
                <p className="text-[14px] text-gray-500 mb-6">Milestones and success stories</p>
                {course?.highlights && course.highlights.length > 0 ? (
                  <div className="space-y-3">
                    {course.highlights.map((h: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                        <Award className="w-5 h-5 text-[#0000ff] mt-0.5 shrink-0" />
                        <span className="text-gray-700">{h}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">Achievement information is available on the college page.</p>
                )}
              </div>
            )}

            {/* News */}
            {activeTab === "news" && (
              <div className="animate-fade-in">
                <h2 className="text-[20px] font-bold text-gray-900 mb-2">News & Notices</h2>
                <p className="text-[14px] text-gray-500 mb-6">Stay updated with latest announcements</p>
                {detailOtherPrograms.length > 0 ? (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900">Other Programs</h3>
                    {detailOtherPrograms.map((prog: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <BookOpen className="w-5 h-5 text-[#0000ff] shrink-0" />
                        <div>
                          <span className="font-semibold text-gray-900">{prog.title}</span>
                          <span className="text-sm text-gray-500 ml-2">{prog.duration} | {prog.faculty}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">News and notices are available on the college page.</p>
                )}
              </div>
            )}

            {/* Downloads */}
            {activeTab === "downloads" && (
              <div className="animate-fade-in">
                <h2 className="text-[22px] font-bold text-gray-900 mb-2">Downloads</h2>
                <p className="text-[15px] text-gray-600 mb-6">Important documents and resources</p>
                {detailContact.email || detailContact.phone ? (
                  <div className="border border-gray-200 rounded-xl p-6 bg-white">
                    <h3 className="font-bold text-gray-900 mb-4">Contact & Support</h3>
                    <div className="space-y-3">
                      {detailContact.email && (
                        <div className="flex items-center gap-3 text-gray-700">
                          <span className="font-medium">Email:</span>
                          <a href={`mailto:${detailContact.email}`} className="text-[#0000ff] hover:underline">{detailContact.email}</a>
                        </div>
                      )}
                      {detailContact.phone && (
                        <div className="flex items-center gap-3 text-gray-700">
                          <span className="font-medium">Phone:</span>
                          <a href={`tel:${detailContact.phone}`} className="text-[#0000ff] hover:underline">{detailContact.phone}</a>
                        </div>
                      )}
                    </div>
                    <p className="mt-4 text-sm text-gray-500">Downloadable resources are available on the college page.</p>
                  </div>
                ) : (
                  <p className="text-gray-400 italic">Downloadable resources are available on the college page.</p>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Related Courses
                </h3>
                <div className="space-y-4">
                  {relatedCourses.map((rc) => (
                    <div
                      key={rc.id}
                      className="bg-white border border-gray-200 rounded-2xl overflow-hidden cursor-pointer hover:border-blue-500/20 transition-colors"
                      onClick={() =>
                        onNavigate("courseDetails", { id: rc.id })
                      }
                    >
                      <div className="p-3 pb-0">
                        {rc.bannerUrl ? (
                          <img
                            src={rc.bannerUrl}
                            alt={rc.title}
                            className="w-full h-32 object-cover rounded-xl"
                          />
                        ) : (
                          <div className="w-full h-32 bg-blue-50 rounded-xl" />
                        )}
                      </div>
                      <div className="p-4">
                        <div className="mb-2">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600">
                            {rc.level || "Course"}
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-900 text-[14px] mb-1">
                          {rc.title}
                        </h4>
                        <p className="text-[11px] text-gray-600 mb-3 line-clamp-2">
                          {stripHtml(rc.description || "") ||
                            "Explore this program."}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-[#059669] bg-green-50 px-2 py-0.5 rounded">
                            Explore
                          </span>
                          <span className="text-blue-600 text-[11px] font-bold flex items-center gap-1">
                            Details{" "}
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {relatedCourses.length === 0 && (
                    <p className="text-sm text-gray-400 italic">
                      No related courses.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ── FaqItem (expandable) ──

const FaqItem: React.FC<{ question: string; answer: string }> = ({
  question,
  answer,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full px-5 py-4 flex items-center justify-between text-left transition bg-transparent cursor-pointer"
      >
        <span className="font-semibold text-gray-900 text-[15px] pr-4">
          Q: {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-4">
          <p className="text-[14px] text-gray-600 leading-relaxed">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
};

export default CourseDetailsPage;
