"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  apiService,
  College as ApiCollege,
  EducationCourse,
} from "../../services/api";
import GlobalFilterSection from "../ui/GlobalFilterSection";

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
    level: true,
    stream: true,
    affiliation: false,
    location: true,
    type: true,
    fee: false,
    status: false,
  });

  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [popularOnly, setPopularOnly] = useState(false);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedStreams, setSelectedStreams] = useState<string[]>([]);
  const [selectedAffiliations, setSelectedAffiliations] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedFeeRanges, setSelectedFeeRanges] = useState<string[]>([]);
  const [streamSearch, setStreamSearch] = useState("");
  const [affiliationSearch, setAffiliationSearch] = useState("");
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

  const showingFrom = totalResults === 0 ? 0 : (page - 1) * 16 + 1;
  const showingTo = Math.min((page - 1) * 16 + cards.length, totalResults);
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
      <div
        key={college.id}
        className={`flex h-full flex-col rounded-2xl border bg-white p-4 transition-all duration-300 hover:border-blue-500/20 group relative shadow-sm ${selected ? "border-blue-500 ring-1 ring-blue-500/10" : "border-gray-200"}`}
      >
        <div className="group relative h-40 shrink-0 overflow-hidden rounded-xl bg-gray-50">
          <img src={college.logo} alt={college.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          
          <div className="absolute top-3 left-3 z-10 flex gap-2">
            <span className="rounded bg-blue-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              Featured
            </span>
          </div>

          {quickApplyMode && (
            <label className="absolute right-3 top-3 z-10 cursor-pointer" onClick={(e) => e.stopPropagation()}>
              <div className="relative flex h-6 w-6 items-center justify-center">
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => toggleCollegeSelection(college.id)}
                  className="peer sr-only"
                />
                <div className="absolute inset-0 rounded-md border border-slate-300 bg-white/90 shadow-sm backdrop-blur-sm transition-colors hover:border-blue-500 peer-checked:border-blue-600 peer-checked:bg-blue-600"></div>
                <svg className="pointer-events-none absolute z-10 h-4 w-4 text-white opacity-0 transition-opacity peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </label>
          )}
        </div>

        <div className="flex flex-1 flex-col pt-4">
          <div className="flex items-center gap-1.5 mb-2">
            <h3 className="truncate text-left text-[19px] font-bold text-slate-800 tracking-tight transition-colors group-hover:text-blue-600">
              {college.name}
            </h3>
            <svg className="w-5 h-5 text-blue-500 fill-blue-500 shrink-0" viewBox="0 0 24 24"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1.106-6.103L8.293 13.3a1 1 0 0 1 1.414-1.414l1.193 1.193 4.407-4.407a1 1 0 0 1 1.414 1.414l-5.114 5.114a1 1 0 0 1-1.414 0z"/></svg>
          </div>

          <div className="mb-3 flex items-center text-[13.5px] text-gray-500 font-medium">
            <div className="flex items-center gap-1 text-amber-500">
              <i className="fa-solid fa-star"></i>
              <span className="text-slate-700 font-bold">{college.rating.toFixed(1)}</span>
            </div>
            <span className="mx-2.5 text-gray-300">|</span>
            <span className="text-slate-600">{college.type || "Private"}</span>
            <span className="mx-2.5 text-gray-300">|</span>
            <div className="flex min-w-0 flex-1 items-center gap-1.5 truncate">
              <i className="fa-solid fa-location-dot text-gray-400"></i>
              <span>Kathmandu</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-start gap-2 text-[13.5px] text-gray-600">
              <i className="fa-solid fa-award mt-1 text-gray-400"></i>
              <p className="line-clamp-2 font-medium leading-relaxed">
                {college.affiliation || "TU Affiliation, NEB, Kathmandu University"}
              </p>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-dashed border-gray-100">
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md shadow-blue-100 text-[14px]"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = `/find-college/${college.id}`;
              }}
            >
              Get Counselling
            </button>
            <div className="flex gap-2 mt-2">
              <button className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-2 rounded-xl transition-all text-[13px]">
                Inquiry
              </button>
              <button className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 rounded-xl transition-all text-[13px] shadow-sm">
                Compare
              </button>
            </div>
          </div>
        </div>
      </div>
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
      {openFilters[key] ? <div className="filter-content">{content}</div> : null}
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
          <aside className="w-full shrink-0 lg:w-75">
            <div className="relative w-full rounded-[20px] border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
                  <h3 className="text-xl font-black tracking-tight text-slate-900">
                    Filters
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setVerifiedOnly(false);
                    setPopularOnly(false);
                    setSelectedLevels([]);
                    setSelectedStreams([]);
                    setSelectedAffiliations([]);
                    setSelectedStatuses([]);
                    setSelectedFeeRanges([]);
                    setStreamSearch("");
                    setAffiliationSearch("");
                    setProvince("All Provinces");
                    setNationalWide(false);
                    setSelectedCollegeType("");
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Reset All
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">Quick Filters</h4>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => setVerifiedOnly((prev: boolean) => !prev)} 
                      className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[11.5px] font-semibold transition-all ${verifiedOnly ? "border-green-200 bg-green-50 text-green-700" : "border-gray-100 bg-gray-50 text-gray-600 hover:border-green-100 hover:bg-green-50/50"}`}
                    >
                      <i className="fa-solid fa-circle-check"></i>
                      Verified
                    </button>
                    <button 
                      onClick={() => setPopularOnly((prev: boolean) => !prev)} 
                      className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[11.5px] font-semibold transition-all ${popularOnly ? "border-blue-200 bg-blue-50 text-blue-700" : "border-gray-100 bg-gray-50 text-gray-600 hover:border-blue-100 hover:bg-blue-50/50"}`}
                    >
                      <i className="fa-solid fa-fire"></i>
                      Popular
                    </button>
                  </div>
                </div>

              <GlobalFilterSection
                title="Education Level"
                isOpen={openFilters.level}
                onToggle={() => setOpenFilters((prev) => ({ ...prev, level: !prev.level }))}
                contentClassName="pb-4 space-y-3"
              >
                {["+2 (NEB)", "Bachelor", "Master", "Diploma"].map((level) => (
                  <label className="group flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedLevels.includes(level)}
                      onChange={() =>
                        setSelectedLevels((prev) =>
                          prev.includes(level)
                            ? prev.filter((v) => v !== level)
                            : [...prev, level],
                        )
                      }
                      className="h-[1.15em] w-[1.15em] rounded-xs border border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-[14.5px] text-[#475569] transition-colors group-hover:text-gray-900">
                      {level}
                    </span>
                  </label>
                ))}
              </GlobalFilterSection>

              <GlobalFilterSection
                title="Field of Study"
                isOpen={openFilters.stream}
                onToggle={() => setOpenFilters((prev) => ({ ...prev, stream: !prev.stream }))}
                contentClassName="pb-4 space-y-3"
              >
                <div className="relative mb-3">
                  <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    value={streamSearch}
                    onChange={(e) => setStreamSearch(e.target.value)}
                    placeholder="Search fields..."
                    className="w-full bg-gray-50 border border-gray-200 text-sm font-medium rounded-md pl-9 pr-3 h-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                {["Science", "Management", "IT / Computer Science", "Engineering", "Medical", "Law", "Humanities", "Education"].map((stream) => (
                  <label className="group flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedStreams.includes(stream)}
                      onChange={() =>
                        setSelectedStreams((prev) =>
                          prev.includes(stream)
                            ? prev.filter((v) => v !== stream)
                            : [...prev, stream],
                        )
                      }
                      className="h-[1.15em] w-[1.15em] rounded-xs border border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-[14.5px] text-[#475569] transition-colors group-hover:text-gray-900">
                      {stream}
                    </span>
                  </label>
                ))}
              </GlobalFilterSection>

              <GlobalFilterSection
                title="Affiliation / University"
                isOpen={openFilters.affiliation}
                onToggle={() => setOpenFilters((prev) => ({ ...prev, affiliation: !prev.affiliation }))}
                contentClassName="pb-4 space-y-3"
              >
                <div className="relative mb-3">
                  <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    value={affiliationSearch}
                    onChange={(e) => setAffiliationSearch(e.target.value)}
                    placeholder="Search university..."
                    className="w-full bg-gray-50 border border-gray-200 text-sm font-medium rounded-md pl-9 pr-3 h-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                {["TU Affiliation", "IOE", "PU", "KU"].map((affiliation) => (
                  <label className="group flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedAffiliations.includes(affiliation)}
                      onChange={() =>
                        setSelectedAffiliations((prev) =>
                          prev.includes(affiliation)
                            ? prev.filter((v) => v !== affiliation)
                            : [...prev, affiliation],
                        )
                      }
                      className="h-[1.15em] w-[1.15em] rounded-xs border border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-[14.5px] text-[#475569] transition-colors group-hover:text-gray-900">
                      {affiliation}
                    </span>
                  </label>
                ))}
              </GlobalFilterSection>

              <GlobalFilterSection
                title="Location"
                isOpen={openFilters.location}
                onToggle={() => setOpenFilters((prev) => ({ ...prev, location: !prev.location }))}
                contentClassName="pb-4 space-y-3"
              >
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full bg-white border border-gray-200 text-gray-600 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 mb-3 appearance-none"
                >
                  <option>All Provinces</option>
                  <option>Bagmati Province</option>
                  <option>Gandaki Province</option>
                  <option>Koshi Province</option>
                  <option>Lumbini Province</option>
                  <option>Sudurpashchim Province</option>
                </select>
                <label className="flex items-center gap-2.5 text-[14px] text-gray-600 group hover:text-gray-900 cursor-pointer">
                  <input
                    checked={nationalWide}
                    onChange={(e) => setNationalWide(e.target.checked)}
                    type="checkbox"
                    className="h-[1.15em] w-[1.15em] rounded-xs border border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>National Wide</span>
                </label>
              </GlobalFilterSection>

              <GlobalFilterSection
                title="Colleges Type"
                isOpen={openFilters.type}
                onToggle={() => setOpenFilters((prev) => ({ ...prev, type: !prev.type }))}
                contentClassName="pb-4 space-y-3"
              >
                {["Government", "Private", "Community", "CTEVT"].map((type) => (
                  <label className="group flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCollegeType === type}
                      onChange={() =>
                        setSelectedCollegeType((prev) => (prev === type ? "" : type))
                      }
                      className="h-[1.15em] w-[1.15em] rounded-xs border border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-[14.5px] text-[#475569] transition-colors group-hover:text-gray-900">
                      {type === "CTEVT" ? "CTEVT / Gov. Training" : `${type} College`}
                    </span>
                  </label>
                ))}
              </GlobalFilterSection>

              <GlobalFilterSection
                title="Fee Range"
                isOpen={openFilters.fee}
                onToggle={() => setOpenFilters((prev) => ({ ...prev, fee: !prev.fee }))}
                contentClassName="pb-4 space-y-3"
              >
                <div className="px-1 space-y-4">
                  <div className="flex justify-between text-xs text-gray-500 font-medium mb-2">
                    <span>Max Fee</span>
                    <span className="text-blue-600 font-bold">NPR 50,00,000</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={5000000}
                    step={100000}
                    defaultValue={5000000}
                    className="w-full"
                  />
                </div>
                <div className="h-px bg-gray-100 my-2"></div>
                {[
                  { key: "below1", label: "Below 1 Lakh" },
                  { key: "1to3", label: "1–3 Lakhs" },
                  { key: "3to6", label: "3–6 Lakhs" },
                  { key: "6plus", label: "6+ Lakhs" },
                ].map((range) => (
                  <label className="group flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFeeRanges.includes(range.key)}
                      onChange={() =>
                        setSelectedFeeRanges((prev) =>
                          prev.includes(range.key)
                            ? prev.filter((v) => v !== range.key)
                            : [...prev, range.key],
                        )
                      }
                      className="h-[1.15em] w-[1.15em] rounded-xs border border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-[14.5px] text-[#475569] transition-colors group-hover:text-gray-900">
                      {range.label}
                    </span>
                  </label>
                ))}
              </GlobalFilterSection>

              <GlobalFilterSection
                title="Admission Status"
                isOpen={openFilters.status}
                onToggle={() => setOpenFilters((prev) => ({ ...prev, status: !prev.status }))}
                contentClassName="pb-4 space-y-3"
              >
                {(["Admission Open", "Entrance Ongoing", "Closed"] as const).map((status) => (
                  <label className="group flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedStatuses.includes(status)}
                      onChange={() =>
                        setSelectedStatuses((prev) =>
                          prev.includes(status)
                            ? prev.filter((v) => v !== status)
                            : [...prev, status],
                        )
                      }
                      className="h-[1.15em] w-[1.15em] rounded-xs border border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-[14.5px] text-[#475569] transition-colors group-hover:text-gray-900">
                      {status}
                    </span>
                  </label>
                ))}
              </GlobalFilterSection>
            </div>
          </div>
        </aside>

          <main className={`flex-1 min-w-0 ${quickApplyMode ? "quick-apply-active" : ""}`} id="main-content">
            <div className="mb-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex flex-col justify-start">
                  <h1 className="mb-2 text-base text-gray-900 font-medium">
                    Showing <span className="font-bold">{showingFrom}-{showingTo}</span> of <span className="font-bold">{totalResults}</span> Colleges
                  </h1>

                  <label className="group mt-2 flex cursor-pointer items-center gap-2.5">
                    <div className="relative flex h-5 w-5 items-center justify-center">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        disabled={!quickApplyMode || cards.length === 0}
                        onChange={(event) => handleSelectAll(event.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="absolute inset-0 rounded-sm border-[1.5px] border-slate-300 bg-white transition-colors group-hover:border-slate-400 peer-checked:border-blue-600 peer-checked:bg-blue-600"></div>
                      <svg
                        className="pointer-events-none absolute z-10 h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex items-baseline gap-1.5 text-[14px]">
                      <span className="font-semibold text-slate-900">Select all</span>
                      <span className="hidden text-[12.5px] text-slate-500 sm:inline">
                        (up to 5 quick apply colleges)
                      </span>
                    </div>
                  </label>
                </div>

                <div className="mt-2 flex w-full shrink-0 flex-col gap-3 sm:mt-0 sm:w-[320px] sm:items-end">
                  <div className="relative w-full">
                    <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400"></i>
                    <input
                      type="text"
                      value={streamSearch}
                      onChange={(e) => setStreamSearch(e.target.value)}
                      placeholder="Search colleges, courses..."
                      className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm transition-all placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
                    />
                  </div>

                  <label className="group flex cursor-pointer items-center gap-2">
                    <span className="text-[13px] font-semibold text-slate-800">
                      Quick Apply
                    </span>
                    <div className="relative inline-flex cursor-pointer items-center" onClick={toggleQuickApply}>
                      <input
                        type="checkbox"
                        checked={quickApplyMode}
                        readOnly
                        className="peer sr-only"
                      />
                      <div className="peer h-5 w-9 rounded-full bg-slate-200 transition-all after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-200 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-4 peer-checked:after:border-white peer-focus:outline-none shadow-inner"></div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {collegesLoading ? (
              <div className="py-10 text-center text-slate-500 font-semibold">Loading colleges...</div>
            ) : cards.length === 0 ? (
              <div className="py-10 text-center text-slate-500 font-semibold">No colleges found.</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 lg:gap-5" id="colleges-grid-1">{cards.slice(0, 8).map(renderCard)}</div>

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

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 lg:gap-5" id="colleges-grid-2">{cards.slice(8, 16).map(renderCard)}</div>
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
