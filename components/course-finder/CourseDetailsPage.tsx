"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "../../services/api";
import { fetchCourseDetailsById, CourseFullDetails } from "../../services/course-api";
import CourseGrid from "./CourseGrid";
import { CourseFinderFilters, defaultCourseFinderFilters } from "./types";
import {
  Clock,
  Award,
  BookOpen,
  Info,
  ArrowRight,
  MapPin,
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

const CourseDetailsPage: React.FC<CourseDetailsPageProps> = ({
  courseId,
  onBack,
  onNavigate,
}) => {
  const [filters, setFilters] = useState<CourseFinderFilters>(defaultCourseFinderFilters);

  const { data: listData } = useQuery({
    queryKey: ["education-courses"],
    queryFn: () => apiService.getEducationCourses(),
  });

  const { data: detailsData } = useQuery({
    queryKey: ["course-details", courseId],
    queryFn: () => fetchCourseDetailsById(String(courseId)),
  });

  const allCourses = useMemo(() => (listData?.data?.courses || []) as unknown as import("../../types/course").GlobalCourse[], [listData]);

  const course = useMemo(() => {
    const found = allCourses.find(c => String(c.id) === String(courseId));
    if (found) return found;
    return null;
  }, [allCourses, courseId]);

  const details = detailsData || null;

  const courseTitle = stripHtml(course?.title || details?.course?.title || "");
  const courseDuration = stripHtml(course?.duration || details?.course?.duration || "");
  const courseLevel = stripHtml(course?.level || details?.course?.level || "");
  const courseField = stripHtml(course?.field || details?.course?.field || "");
  const courseDescription = stripHtml(course?.description || details?.course?.description || details?.about?.join(" ") || "");
  const courseEstFee = stripHtml(course?.estFee || details?.course?.estFee || "");
  const courseAffiliation = stripHtml(course?.affiliationName || details?.course?.affiliationName || "");
  const courseLocation = stripHtml((course as any)?.location || details?.course?.location || "");

  const tabs: { id: string; label: string; visible: boolean }[] = [
    { id: "overview", label: "Overview", visible: true },
    { id: "eligibility", label: "Eligibility", visible: !!(details?.admissionRequirements?.length) },
    { id: "curriculum", label: "Curriculum", visible: !!(details?.curriculum?.length) },
    { id: "career", label: "Career", visible: !!(details?.careerOpportunities?.length) },
  ];

  const visibleTabs = tabs.filter(t => t.visible);
  const [activeTab, setActiveTab] = useState(visibleTabs[0]?.id || "overview");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  if (!course && !details) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Loading course details...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-in-out; }
      `}</style>
      <div className="bg-white text-gray-900 antialiased pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 px-2 font-medium">
            <button onClick={() => onNavigate("finder")} className="hover:text-blue-600 transition-colors bg-transparent border-none p-0 cursor-pointer">Home</button>
            <ArrowRight size={10} className="text-gray-400" />
            <button onClick={onBack} className="hover:text-blue-600 transition-colors bg-transparent border-none p-0 cursor-pointer">Course Finder</button>
            <ArrowRight size={10} className="text-gray-400" />
            <span className="text-gray-900 font-semibold">{courseField || "Course"}</span>
          </nav>

          {/* Hero Section */}
          <header className="w-full bg-[#0000ff] rounded-md relative overflow-hidden min-h-[280px] md:min-h-[320px]">
            <div className="relative z-10 px-8 py-10 md:px-14 md:py-16">
              <div className="text-white max-w-2xl">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-3 tracking-tight break-words">
                  {courseTitle}
                </h1>
                {courseAffiliation && (
                  <p className="text-blue-200 font-semibold text-base md:text-lg mb-4">
                    {courseAffiliation}
                  </p>
                )}
                <div className="flex flex-wrap gap-3 mb-4 text-sm font-medium">
                  {courseDuration && (
                    <span className="flex items-center gap-1.5 text-blue-50 bg-white/10 px-3 py-1.5 rounded-md">
                      <Clock className="w-4 h-4 text-blue-200" />
                      {courseDuration}
                    </span>
                  )}
                  {courseLevel && (
                    <span className="flex items-center gap-1.5 text-blue-50 bg-white/10 px-3 py-1.5 rounded-md">
                      <Award className="w-4 h-4 text-blue-200" />
                      {courseLevel}
                    </span>
                  )}
                  {courseField && (
                    <span className="flex items-center gap-1.5 text-blue-50 bg-white/10 px-3 py-1.5 rounded-md">
                      <BookOpen className="w-4 h-4 text-blue-200" />
                      {courseField}
                    </span>
                  )}
                </div>
                {courseEstFee && (
                  <p className="text-blue-100 text-sm">Est. Fee: {courseEstFee}</p>
                )}
                {courseLocation && (
                  <p className="text-blue-100 text-sm mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {courseLocation}
                  </p>
                )}
              </div>
            </div>
          </header>

          {/* Tabs */}
          {visibleTabs.length > 0 && (
            <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200">
              <nav className="flex overflow-x-auto hide-scrollbar space-x-8 text-gray-500 font-medium">
                {visibleTabs.map(tab => (
                  <button key={tab.id} onClick={() => handleTabClick(tab.id)}
                    className={`pb-4 -mb-px transition-colors hover:text-gray-900 border-b-2 bg-transparent cursor-pointer whitespace-nowrap ${
                      activeTab === tab.id ? "text-gray-900 border-blue-600" : "border-transparent"
                    }`}>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          )}

          {/* Content */}
          <div className="min-h-[40vh]">
            {activeTab === "overview" && (
              <section className="animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  Overview
                </h2>
                <div className="text-gray-600 leading-relaxed space-y-4 break-words overflow-hidden">
                  {courseDescription ? (
                    courseDescription.split("\n").map((para, i) => (
                      <p key={i}>{para}</p>
                    ))
                  ) : (
                    <p className="text-gray-400 italic">No description available.</p>
                  )}
                </div>
              </section>
            )}

            {activeTab === "eligibility" && details?.admissionRequirements && (
              <section className="animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Eligibility Criteria</h2>
                <ul className="space-y-3">
                  {details.admissionRequirements.map((req: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 p-4 bg-blue-50 rounded-md">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                      <span className="text-gray-700 break-words overflow-hidden">{stripHtml(req)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {activeTab === "curriculum" && details?.curriculum && (
              <section className="animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Curriculum</h2>
                <div className="space-y-6">
                  {details.curriculum.map((sem: any, i: number) => (
                    <div key={i} className="border border-gray-200 rounded-md p-5">
                      <h3 className="font-bold text-gray-900 mb-2">{sem.title || `Semester ${sem.semester || i + 1}`}</h3>
                      {sem.subtitle && <p className="text-sm text-gray-500 mb-3">{sem.subtitle}</p>}
                      {sem.subjects?.length > 0 && (
                        <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                          {sem.subjects.map((sub: string, j: number) => (
                            <li key={j}>{sub}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === "career" && details?.careerOpportunities && (
              <section className="animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Career Opportunities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {details.careerOpportunities.map((career: any, i: number) => (
                    <div key={i} className="border border-gray-200 rounded-md p-4">
                      <h3 className="font-semibold text-gray-900">{career.title}</h3>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Related Programs */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Programs</h2>
            <CourseGrid 
              courses={allCourses.filter(c => String(c.id) !== String(courseId)).slice(0, 6)} 
              totalCourses={allCourses.length - 1}
              onNavigate={onNavigate}
              filters={filters}
              onFiltersChange={setFilters}
              isLoading={false}
            />
          </section>
        </div>
      </div>
    </>
  );
};

export default CourseDetailsPage;
