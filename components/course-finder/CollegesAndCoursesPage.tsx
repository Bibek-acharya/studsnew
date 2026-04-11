"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  apiService,
  College as ApiCollege,
  EducationCourse,
} from "../../services/api";

interface SelectedCourseContext {
  id?: string;
  title: string;
  collegesCount?: number;
}

interface CollegesAndCoursesPageProps {
  selectedCourse: SelectedCourseContext;
  onBack: () => void;
}

interface CollegeCardItem {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  affiliation: string;
  type: string;
  logo: string;
}

const toCollegeCard = (college: ApiCollege): CollegeCardItem => ({
  id: college.id,
  name: college.name || "Advance Academy College",
  rating: Number(college.rating || 4.5),
  reviews: Number(college.reviews || 209),
  affiliation: college.affiliation || "TU Affiliation",
  type: college.type || "Private",
  logo:
    college.image_url ||
    "https://kist.edu.np/resources/assets/img/logo_small.jpg",
});

const CollegesAndCoursesPage: React.FC<CollegesAndCoursesPageProps> = ({
  selectedCourse,
}) => {
  const [quickApplyMode, setQuickApplyMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [slideIndex, setSlideIndex] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({
    academic: true,
    stream: true,
    location: true,
    type: true,
    facilities: true,
    fee: true,
    duration: true,
    popularity: true,
  });

  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [popularOnly, setPopularOnly] = useState(false);
  const [streamSearch, setStreamSearch] = useState("");
  const [province, setProvince] = useState("All Provinces");
  const [nationalWide, setNationalWide] = useState(false);
  const [selectedCollegeType, setSelectedCollegeType] = useState("");

  const { data: coursesResponse } = useQuery({
    queryKey: ["education-courses"],
    queryFn: () => apiService.getEducationCourses(),
  });

  const backendCourses = (coursesResponse?.data?.courses || []) as EducationCourse[];

  const getInitialCourseId = () => {
    if (selectedCourse?.id) {
      const foundById = backendCourses.find(c => String(c.id) === String(selectedCourse.id));
      if (foundById) return String(foundById.id);
      
      const foundByTitle = backendCourses.find(c => 
        c.title?.toLowerCase() === selectedCourse.title?.toLowerCase() ||
        c.title?.toLowerCase().includes(selectedCourse.title?.toLowerCase().split('(')[0].trim())
      );
      if (foundByTitle) return String(foundByTitle.id);
    }
    return backendCourses[0]?.id ? String(backendCourses[0].id) : "";
  };

  const initialSelectedCourseId = selectedCourse?.id ? getInitialCourseId() : (backendCourses[0]?.id ? String(backendCourses[0].id) : "");
  const [activeCourseId, setActiveCourseId] = useState(initialSelectedCourseId);

  useEffect(() => {
    if (!activeCourseId && backendCourses.length > 0) {
      setActiveCourseId(backendCourses[0].id ? String(backendCourses[0].id) : "");
    }
  }, [activeCourseId, backendCourses]);

  useEffect(() => {
    if (selectedCourse?.id && backendCourses.length > 0) {
      const newId = getInitialCourseId();
      if (newId && newId !== activeCourseId) {
        setActiveCourseId(newId);
      }
    }
  }, [selectedCourse, backendCourses]);

  const activeCourse = useMemo(() => {
    if (!activeCourseId) return null;
    return (
      backendCourses.find((course) => String(course.id) === String(activeCourseId)) ||
      null
    );
  }, [backendCourses, activeCourseId]);

  const topCourses = useMemo(() => {
    return backendCourses.map((course) => ({
      id: String(course.id),
      name: course.title,
      count: `${Number((course as any).collegesCount || course.colleges || 0)}+`,
      active: String(course.id) === String(activeCourseId),
      affiliation: course.affiliation || "",
      status: (course as any).status || ""
    }));
  }, [backendCourses, activeCourseId, selectedCourse?.title, selectedCourse?.collegesCount]);

  const { data: collegesResponse, isLoading: collegesLoading } = useQuery({
    queryKey: [
      "colleges-and-courses-list",
      page,
      verifiedOnly,
      popularOnly,
      streamSearch,
      province,
      nationalWide,
      selectedCollegeType,
      activeCourse?.affiliation,
      selectedCourse?.id,
    ],
    queryFn: () =>
      apiService.getColleges({
        page,
        pageSize: 16,
        sort: "rating",
        order: "DESC",
        verified: verifiedOnly || undefined,
        popular: popularOnly || undefined,
        search: streamSearch || undefined,
        location:
          nationalWide || province === "All Provinces" ? undefined : province,
        type: selectedCollegeType || undefined,
        affiliation: activeCourse?.affiliation || undefined,
        courseId: selectedCourse?.id || undefined,
      }),
  });

  const cards = useMemo(
    () => (collegesResponse?.data?.colleges || []).map(toCollegeCard),
    [collegesResponse],
  );

  const pagination = collegesResponse?.data?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const totalResults =
    pagination?.total ||
    Number(activeCourse?.colleges || selectedCourse.collegesCount || 0);

  const firstGrid = cards.slice(0, 8);
  const secondGrid = cards.slice(8, 16);
  const allVisibleIds = cards.map((item: CollegeCardItem) => item.id);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % 3);
    }, 4000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(null), 3000);
    return () => window.clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    setPage(1);
  }, [
    activeCourseId,
    verifiedOnly,
    popularOnly,
    streamSearch,
    province,
    nationalWide,
    selectedCollegeType,
  ]);

  const toggleFilter = (key: string) => {
    setOpenFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleQuickApply = () => {
    if (quickApplyMode && selectedIds.size > 0) {
      setMessage(`Successfully applied to ${selectedIds.size} colleges!`);
      setSelectedIds(new Set());
    }
    setQuickApplyMode((prev) => !prev);
  };

  const toggleCollegeSelection = (collegeId: number) => {
    if (!quickApplyMode) return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(collegeId)) next.delete(collegeId);
      else next.add(collegeId);
      return next;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (!quickApplyMode) return;
    setSelectedIds(checked ? new Set(allVisibleIds) : new Set());
  };

  const isAllSelected =
    allVisibleIds.length > 0 && selectedIds.size === allVisibleIds.length;

  const quickApplyText = !quickApplyMode
    ? "Quick Apply"
    : selectedIds.size > 0
      ? `Apply Selected (${selectedIds.size})`
      : "Cancel Quick Apply";

  const renderCard = (college: CollegeCardItem) => {
    const selected = selectedIds.has(college.id);
    return (
      <label
        key={college.id}
        className={`bg-white border rounded-[16px] p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:border-blue-200 hover:shadow-[0_4px_20px_-4px_rgba(37,99,235,0.08)] transition-all duration-200 group relative ${selected ? "border-blue-500 bg-blue-50/30" : "border-gray-100"}`}
      >
        <div className="flex items-center w-full">
          <input
            type="checkbox"
            checked={selected}
            onChange={(event) => {
              event.stopPropagation();
              toggleCollegeSelection(college.id);
            }}
            className={`qa-checkbox custom-checkbox rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer ${quickApplyMode ? "opacity-100 w-5 mr-4 pointer-events-auto" : "opacity-0 w-0 mr-0 pointer-events-none"}`}
          />

          <div className="w-[72px] h-[72px] rounded-[14px] border border-gray-100 bg-white p-2 flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
            <img src={college.logo} alt={college.name} className="w-full h-full object-contain" />
          </div>

          <div className="flex flex-col ml-4">
            <h3 className="font-bold text-[16px] text-gray-900 leading-tight mb-1.5 group-hover:text-blue-600 transition-colors line-clamp-1">
              {college.name}
            </h3>
            <div className="flex items-center mb-3">
              <div className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-[#2563EB] fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                <span className="text-[12px] font-bold text-gray-700 mt-0.5">{college.rating.toFixed(1)}</span>
              </div>
              <div className="w-[1px] h-3.5 bg-gray-300 mx-2.5"></div>
              <span className="text-[11px] text-gray-500 font-medium mt-0.5">{college.reviews} reviews</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="border border-gray-100 bg-white text-gray-600 text-[10px] sm:text-[11px] px-3 py-1 rounded-full font-medium shadow-sm">{college.affiliation || "TU Affiliation"}</span>
              <span className="border border-gray-100 bg-white text-gray-600 text-[10px] sm:text-[11px] px-3 py-1 rounded-full font-medium shadow-sm">NEB</span>
              <span className="border border-gray-100 bg-white text-gray-600 text-[10px] sm:text-[11px] px-3 py-1 rounded-full font-medium shadow-sm">{college.type || "Private"}</span>
            </div>
          </div>
        </div>
        <div className={`pr-1 pl-2 card-chevron transition-opacity duration-300 ${quickApplyMode ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
        </div>
      </label>
    );
  };

  const renderFilterSection = (
    key: string,
    title: string,
    content: React.ReactNode,
    hasBorder = true,
  ) => (
    <div className={`${hasBorder ? "mb-5 border-b border-gray-100 pb-5" : ""}`} key={key}>
      <div className="flex justify-between items-center cursor-pointer mb-3 filter-toggle" onClick={() => toggleFilter(key)}>
        <h3 className="text-[13px] font-bold text-gray-900">{title}</h3>
        <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${openFilters[key] ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>
      {!openFilters[key] ? null : <div className="filter-content">{content}</div>}
    </div>
  );

  return (
    <div className="antialiased text-gray-900 pb-12">
      <style>{`
        .custom-checkbox:checked { background-color: #2563EB; border-color: #2563EB; color: #2563EB; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .qa-checkbox { transition: all 0.3s ease; }
        .carousel-track { display: flex; transition: transform 0.5s ease-in-out; height: 100%; }
        .carousel-slide { min-width: 100%; height: 100%; position: relative; }
      `}</style>

      <div className="max-w-350 mx-auto">
        <div className="mb-8">
          <h1 className="text-[24px] font-bold text-gray-900 tracking-tight mb-4">Colleges and Courses</h1>

          <div className="bg-[#F2F6FE] -mx-4 px-4 py-8 sm:mx-0 sm:rounded-[16px]">
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 items-stretch">
              {topCourses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => setActiveCourseId(course.id)}
                  className={`min-w-[210px] flex flex-col flex-shrink-0 bg-white rounded-xl p-4 sm:p-5 cursor-pointer relative transition-all duration-200 ${course.active ? "border border-[#2563EB] shadow-sm" : "border border-transparent shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:border-gray-100"}`}
                >
                  {course.active ? (
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 text-[#2563EB]">
                      <svg className="w-[20px] h-[20px]" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"></circle><path d="M10.2 15.4l-3.2-3.2 1.4-1.4 1.8 1.8 4.6-4.6 1.4 1.4-6 6z" fill="white"></path></svg>
                    </div>
                  ) : null}
                  <h3 className="font-bold text-[15px] sm:text-[16px] text-gray-900 mb-1.5 pr-6 leading-snug">{course.name}</h3>
                  <p className="text-[12px] sm:text-[13px] text-[#2563EB] font-medium flex items-center mb-3">
                    {course.count} colleges <span className="ml-1 text-[16px] leading-none mb-0.5">›</span>
                  </p>
                  <div className="mt-auto pt-1">
                    {course.status ? (
                      <span className="inline-flex items-center gap-1.5 bg-green-50 border border-green-100 text-green-700 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                        <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span></span>
                        {course.status}
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <aside className="w-[280px] flex-shrink-0 hidden lg:flex flex-col bg-white border border-gray-100 rounded-xl p-5 shadow-sm h-fit">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[16px] font-bold text-gray-900 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"></path></svg>
                Filters
              </h2>
              <button
                onClick={() => {
                  setVerifiedOnly(false);
                  setPopularOnly(false);
                  setStreamSearch("");
                  setProvince("All Provinces");
                  setNationalWide(false);
                  setSelectedCollegeType("");
                }}
                className="text-[13px] text-gray-500 hover:text-gray-800 flex items-center gap-1 font-medium transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                Reset
              </button>
            </div>

            <div className="mb-5 border-b border-gray-100 pb-5">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Quick Filters</h3>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setVerifiedOnly((prev) => !prev)} className={`border text-[11px] px-2.5 py-1.5 rounded flex items-center gap-1 font-medium ${verifiedOnly ? "border-green-300 bg-green-100 text-green-800" : "border-green-200 bg-green-50 text-green-700"}`}><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>Verified</button>
                <button onClick={() => setPopularOnly((prev) => !prev)} className={`border text-[11px] px-2.5 py-1.5 rounded flex items-center gap-1 font-medium ${popularOnly ? "border-blue-300 bg-blue-100 text-blue-800" : "border-blue-200 bg-blue-50 text-blue-700"}`}><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>New</button>
                <button className="border border-red-200 bg-red-50 text-red-700 text-[11px] px-2.5 py-1.5 rounded flex items-center gap-1 font-medium"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>Closing</button>
              </div>
            </div>

            {renderFilterSection("academic", "Academic Level / Program", (
              <div className="space-y-2.5">
                <label className="flex items-center justify-between group cursor-pointer"><div className="flex items-center gap-2.5 text-[13px] text-gray-600 group-hover:text-gray-900"><input type="checkbox" defaultChecked className="custom-checkbox w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />+2 / Higher Secondary</div><span className="text-[10px] text-blue-500 font-medium bg-blue-50 px-1.5 py-0.5 rounded">3220 Colleges</span></label>
                <label className="flex items-center justify-between group cursor-pointer"><div className="flex items-center gap-2.5 text-[13px] text-gray-600 group-hover:text-gray-900"><input type="checkbox" className="custom-checkbox w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />Bachelor</div><span className="text-[10px] text-blue-500 font-medium bg-blue-50 px-1.5 py-0.5 rounded">200 Colleges</span></label>
                <label className="flex items-center justify-between group cursor-pointer"><div className="flex items-center gap-2.5 text-[13px] text-gray-600 group-hover:text-gray-900"><input type="checkbox" className="custom-checkbox w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />Master</div><span className="text-[10px] text-blue-500 font-medium bg-blue-50 px-1.5 py-0.5 rounded">200 Colleges</span></label>
                <label className="flex items-center justify-between group cursor-pointer"><div className="flex items-center gap-2.5 text-[13px] text-gray-600 group-hover:text-gray-900"><input type="checkbox" className="custom-checkbox w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />Diploma / CTEVT</div><span className="text-[10px] text-blue-500 font-medium bg-blue-50 px-1.5 py-0.5 rounded">200 Colleges</span></label>
                <label className="flex items-center justify-between group cursor-pointer"><div className="flex items-center gap-2.5 text-[13px] text-gray-600 group-hover:text-gray-900"><input type="checkbox" className="custom-checkbox w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />Other</div><span className="text-[10px] text-blue-500 font-medium bg-blue-50 px-1.5 py-0.5 rounded">200 Colleges</span></label>
              </div>
            ))}

            {renderFilterSection("stream", "Stream / Faculty", (
              <>
                <div className="relative mb-3">
                  <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  <input value={streamSearch} onChange={(event) => setStreamSearch(event.target.value)} type="text" placeholder="Filter Fields..." className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-[12px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="space-y-2.5">
                  <label className="flex items-center justify-between group cursor-pointer"><div className="flex items-center gap-2.5 text-[13px] text-gray-600 group-hover:text-gray-900"><input type="checkbox" className="custom-checkbox w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />Science</div><span className="text-[10px] text-blue-500 font-medium bg-blue-50 px-1.5 py-0.5 rounded">200 Colleges</span></label>
                  <label className="flex items-center justify-between group cursor-pointer"><div className="flex items-center gap-2.5 text-[13px] text-gray-600 group-hover:text-gray-900"><input type="checkbox" className="custom-checkbox w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />Management</div><span className="text-[10px] text-blue-500 font-medium bg-blue-50 px-1.5 py-0.5 rounded">200 Colleges</span></label>
                  <label className="flex items-center justify-between group cursor-pointer"><div className="flex items-center gap-2.5 text-[13px] text-gray-600 group-hover:text-gray-900"><input type="checkbox" className="custom-checkbox w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />Medical</div><span className="text-[10px] text-blue-500 font-medium bg-blue-50 px-1.5 py-0.5 rounded">200 Colleges</span></label>
                  <label className="flex items-center justify-between group cursor-pointer"><div className="flex items-center gap-2.5 text-[13px] text-gray-600 group-hover:text-gray-900"><input type="checkbox" className="custom-checkbox w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />Computer Science</div><span className="text-[10px] text-blue-500 font-medium bg-blue-50 px-1.5 py-0.5 rounded">200 Colleges</span></label>
                </div>
              </>
            ))}

            {renderFilterSection("location", "Location", (
              <>
                <select value={province} onChange={(event) => setProvince(event.target.value)} className="w-full bg-white border border-gray-200 text-gray-600 text-[13px] rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 mb-3 appearance-none">
                  <option>All Provinces</option>
                  <option>Bagmati Province</option>
                  <option>Gandaki Province</option>
                  <option>Koshi Province</option>
                </select>
                <label className="flex items-center gap-2.5 text-[13px] text-gray-600 group hover:text-gray-900 cursor-pointer"><input checked={nationalWide} onChange={(event) => setNationalWide(event.target.checked)} type="checkbox" className="custom-checkbox w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />National Wide</label>
              </>
            ))}

            {renderFilterSection("type", "Colleges Type", (
              <>
                <div className="relative mb-3">
                  <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  <input type="text" placeholder="Filter Fields..." className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-[12px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="space-y-2.5">
                  <label className="flex items-center justify-between group cursor-pointer"><div className="flex items-center gap-2.5 text-[13px] text-gray-600 group-hover:text-gray-900"><input checked={selectedCollegeType === "Government"} onChange={() => setSelectedCollegeType((prev) => prev === "Government" ? "" : "Government")} type="checkbox" className="custom-checkbox w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />Government College</div><span className="text-[10px] text-blue-500 font-medium bg-blue-50 px-1.5 py-0.5 rounded">200 Colleges</span></label>
                  <label className="flex items-center justify-between group cursor-pointer"><div className="flex items-center gap-2.5 text-[13px] text-gray-600 group-hover:text-gray-900"><input checked={selectedCollegeType === "Private"} onChange={() => setSelectedCollegeType((prev) => prev === "Private" ? "" : "Private")} type="checkbox" className="custom-checkbox w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />Private College</div><span className="text-[10px] text-blue-500 font-medium bg-blue-50 px-1.5 py-0.5 rounded">200 Colleges</span></label>
                  <label className="flex items-center justify-between group cursor-pointer"><div className="flex items-start gap-2.5 text-[13px] text-gray-600 group-hover:text-gray-900"><input checked={selectedCollegeType === "Affiliated"} onChange={() => setSelectedCollegeType((prev) => prev === "Affiliated" ? "" : "Affiliated")} type="checkbox" className="custom-checkbox w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5" /><span className="leading-tight">University-affiliated<br /><span className="text-[11px] text-gray-500">(TU, KU, PU, Purbanchal)</span></span></div><span className="text-[10px] text-blue-500 font-medium bg-blue-50 px-1.5 py-0.5 rounded mt-1">200 Colleges</span></label>
                  <label className="flex items-center justify-between group cursor-pointer"><div className="flex items-center gap-2.5 text-[13px] text-gray-600 group-hover:text-gray-900"><input checked={selectedCollegeType === "Community"} onChange={() => setSelectedCollegeType((prev) => prev === "Community" ? "" : "Community")} type="checkbox" className="custom-checkbox w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />Community</div><span className="text-[10px] text-blue-500 font-medium bg-blue-50 px-1.5 py-0.5 rounded">200 Colleges</span></label>
                  <label className="flex items-center justify-between group cursor-pointer"><div className="flex items-center gap-2.5 text-[13px] text-gray-600 group-hover:text-gray-900"><input checked={selectedCollegeType === "CTEVT"} onChange={() => setSelectedCollegeType((prev) => prev === "CTEVT" ? "" : "CTEVT")} type="checkbox" className="custom-checkbox w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />CTEVT / Gov. Training Center</div><span className="text-[10px] text-blue-500 font-medium bg-blue-50 px-1.5 py-0.5 rounded">200 Colleges</span></label>
                </div>
              </>
            ))}

            {renderFilterSection("facilities", "Facilities / Amenities", (
              <div className="space-y-2.5">
                <label className="flex items-center gap-2.5 text-[13px] text-gray-600 group hover:text-gray-900 cursor-pointer"><input type="checkbox" className="custom-checkbox w-4 h-4 rounded border-gray-300 text-blue-600" />Hostel</label>
                <label className="flex items-center gap-2.5 text-[13px] text-gray-600 group hover:text-gray-900 cursor-pointer"><input type="checkbox" className="custom-checkbox w-4 h-4 rounded border-gray-300 text-blue-600" />Library</label>
                <label className="flex items-center gap-2.5 text-[13px] text-gray-600 group hover:text-gray-900 cursor-pointer"><input type="checkbox" className="custom-checkbox w-4 h-4 rounded border-gray-300 text-blue-600" />Computer Lab</label>
                <label className="flex items-center gap-2.5 text-[13px] text-gray-600 group hover:text-gray-900 cursor-pointer"><input type="checkbox" className="custom-checkbox w-4 h-4 rounded border-gray-300 text-blue-600" />Canteen</label>
                <label className="flex items-center gap-2.5 text-[13px] text-gray-600 group hover:text-gray-900 cursor-pointer"><input type="checkbox" className="custom-checkbox w-4 h-4 rounded border-gray-300 text-blue-600" />Play Ground</label>
              </div>
            ))}

            {renderFilterSection("fee", "Total Fee Range (NPR)", (
              <div className="space-y-2.5">
                <label className="flex items-center gap-2.5 text-[13px] text-gray-600 group hover:text-gray-900 cursor-pointer"><input type="checkbox" className="custom-checkbox w-4 h-4 rounded border-gray-300 text-blue-600" />Free / Government Funded</label>
                <label className="flex items-center gap-2.5 text-[13px] text-gray-600 group hover:text-gray-900 cursor-pointer"><input type="checkbox" className="custom-checkbox w-4 h-4 rounded border-gray-300 text-blue-600" />Under NPR 50,000</label>
                <label className="flex items-center gap-2.5 text-[13px] text-gray-600 group hover:text-gray-900 cursor-pointer"><input type="checkbox" className="custom-checkbox w-4 h-4 rounded border-gray-300 text-blue-600" />NPR 50,000 – 1,00,000</label>
                <label className="flex items-center gap-2.5 text-[13px] text-gray-600 group hover:text-gray-900 cursor-pointer"><input type="checkbox" className="custom-checkbox w-4 h-4 rounded border-gray-300 text-blue-600" />NPR 1,00,000 – 2,00,000</label>
                <label className="flex items-center gap-2.5 text-[13px] text-gray-600 group hover:text-gray-900 cursor-pointer"><input type="checkbox" className="custom-checkbox w-4 h-4 rounded border-gray-300 text-blue-600" />Above NPR 2,00,000</label>
              </div>
            ))}

            {renderFilterSection("duration", "Course Duration", (
              <div className="space-y-2.5">
                <label className="flex items-center gap-2.5 text-[13px] text-gray-600 group hover:text-gray-900 cursor-pointer"><input type="checkbox" className="custom-checkbox w-4 h-4 rounded border-gray-300 text-blue-600" />&lt; 1 month</label>
                <label className="flex items-center gap-2.5 text-[13px] text-gray-600 group hover:text-gray-900 cursor-pointer"><input type="checkbox" className="custom-checkbox w-4 h-4 rounded border-gray-300 text-blue-600" />1–3 months</label>
                <label className="flex items-center gap-2.5 text-[13px] text-gray-600 group hover:text-gray-900 cursor-pointer"><input type="checkbox" className="custom-checkbox w-4 h-4 rounded border-gray-300 text-blue-600" />3–6 months</label>
                <label className="flex items-center gap-2.5 text-[13px] text-gray-600 group hover:text-gray-900 cursor-pointer"><input type="checkbox" className="custom-checkbox w-4 h-4 rounded border-gray-300 text-blue-600" />6 months–1 year</label>
                <label className="flex items-center gap-2.5 text-[13px] text-gray-600 group hover:text-gray-900 cursor-pointer"><input type="checkbox" className="custom-checkbox w-4 h-4 rounded border-gray-300 text-blue-600" />1–2 years</label>
                <label className="flex items-center gap-2.5 text-[13px] text-gray-600 group hover:text-gray-900 cursor-pointer"><input type="checkbox" className="custom-checkbox w-4 h-4 rounded border-gray-300 text-blue-600" />3–4 years</label>
                <label className="flex items-center gap-2.5 text-[13px] text-gray-600 group hover:text-gray-900 cursor-pointer"><input type="checkbox" className="custom-checkbox w-4 h-4 rounded border-gray-300 text-blue-600" />4+ years</label>
              </div>
            ))}

            {renderFilterSection("popularity", "Popularity", (
              <div className="space-y-2.5">
                <label className="flex items-center gap-2.5 text-[13px] text-gray-600 group hover:text-gray-900 cursor-pointer"><input type="checkbox" className="custom-checkbox w-4 h-4 rounded border-gray-300 text-blue-600" />Most Enrolled</label>
                <label className="flex items-center gap-2.5 text-[13px] text-gray-600 group hover:text-gray-900 cursor-pointer"><input type="checkbox" className="custom-checkbox w-4 h-4 rounded border-gray-300 text-blue-600" />Trending Programs</label>
                <label className="flex items-center gap-2.5 text-[13px] text-gray-600 group hover:text-gray-900 cursor-pointer"><input type="checkbox" className="custom-checkbox w-4 h-4 rounded border-gray-300 text-blue-600" />Recommended</label>
                <label className="flex items-center gap-2.5 text-[13px] text-gray-600 group hover:text-gray-900 cursor-pointer"><input type="checkbox" className="custom-checkbox w-4 h-4 rounded border-gray-300 text-blue-600" />New Programs</label>
              </div>
            ), false)}
          </aside>

          <main className={`flex-1 min-w-0 ${quickApplyMode ? "quick-apply-active" : ""}`} id="main-content">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 border-b border-gray-200 pb-4 gap-3">
              <p className="text-[13px] text-gray-600 font-medium">Showing {totalResults} results for colleges and courses</p>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-[13px] text-gray-900 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    disabled={!quickApplyMode || cards.length === 0}
                    onChange={(event) => handleSelectAll(event.target.checked)}
                    className="custom-checkbox w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-opacity"
                    style={{ opacity: quickApplyMode ? 1 : 0.5 }}
                  />
                  <span className="font-medium group-hover:text-blue-600 transition-colors">Select all</span>
                  <span className="text-gray-500 font-normal hidden sm:inline">(up to 5 - quick apply courses)</span>
                </label>
                <button
                  onClick={toggleQuickApply}
                  className={`text-[13px] font-medium px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 group shadow-sm ${quickApplyMode ? "bg-blue-600 border border-transparent text-white hover:bg-blue-700" : "bg-white border border-gray-300 text-gray-900 hover:text-blue-600 hover:border-blue-500"}`}
                >
                  <svg className={`w-4 h-4 ${quickApplyMode ? "text-white" : "text-blue-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  <span>{quickApplyText}</span>
                </button>
              </div>
            </div>

            {collegesLoading ? (
              <div className="py-10 text-center text-slate-500 font-semibold">Loading colleges...</div>
            ) : cards.length === 0 ? (
              <div className="py-10 text-center text-slate-500 font-semibold">No colleges found.</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 lg:gap-5" id="colleges-grid-1">{firstGrid.map(renderCard)}</div>

                <div className="my-6 w-full h-[140px] md:h-[180px] rounded-[16px] overflow-hidden relative shadow-sm group">
                  <div className="carousel-track" style={{ transform: `translateX(-${slideIndex * 100}%)` }}>
                    {[{
                      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=80",
                      badge: "Admissions Open",
                      badgeClass: "bg-blue-600",
                      title: "Apply for the 2024 Intake Today",
                      subtitle: "Secure your spot in top ranked universities.",
                    }, {
                      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1400&q=80",
                      badge: "Scholarships",
                      badgeClass: "bg-green-600",
                      title: "Up to 100% Scholarships Available",
                      subtitle: "Merit-based grants for outstanding students.",
                    }, {
                      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=80",
                      badge: "IT & Tech",
                      badgeClass: "bg-purple-600",
                      title: "Join Top Rated IT Colleges",
                      subtitle: "Explore BSc CSIT, BCA, BIT and more.",
                    }].map((slide) => (
                      <div className="carousel-slide flex-shrink-0" key={slide.title}>
                        <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center p-6 md:p-10 cursor-pointer">
                          <div className="text-white">
                            <span className={`${slide.badgeClass} text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded text-white mb-2 inline-block`}>{slide.badge}</span>
                            <h3 className="text-[20px] md:text-[28px] font-bold mb-1 max-w-md leading-tight">{slide.title}</h3>
                            <p className="text-[13px] md:text-[15px] text-gray-200">{slide.subtitle}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="absolute bottom-3 md:bottom-4 left-0 right-0 flex justify-center gap-2 z-10" id="carouselDots">
                    {[0, 1, 2].map((idx) => (
                      <button
                        key={idx}
                        onClick={() => setSlideIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${slideIndex === idx ? "bg-white opacity-100" : "bg-white/50 hover:bg-white/80"}`}
                      ></button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 lg:gap-5" id="colleges-grid-2">{secondGrid.map(renderCard)}</div>
              </>
            )}

            <div className="flex items-center justify-center gap-2 mt-12 mb-6">
              <button onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page <= 1} className={`flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 ${page <= 1 ? "text-gray-400 bg-gray-50 cursor-not-allowed" : "text-gray-600 bg-white hover:bg-gray-50 transition-colors"}`}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg></button>
              <button className="w-9 h-9 rounded-lg bg-blue-600 text-white text-[14px] font-medium shadow-[0_4px_12px_rgba(37,99,235,0.3)]">{page}</button>
              <button onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))} disabled={page >= totalPages} className={`flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 ${page >= totalPages ? "text-gray-400 bg-gray-50 cursor-not-allowed" : "text-gray-600 bg-white hover:bg-gray-50 transition-colors"}`}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg></button>
            </div>
          </main>
        </div>
      </div>

      <div className={`fixed top-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl z-50 transform transition-all duration-300 flex items-center gap-3 ${message ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"}`}>
        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        <span className="text-[14px] font-medium">{message || "Action successful"}</span>
      </div>
    </div>
  );
};

export default CollegesAndCoursesPage;
