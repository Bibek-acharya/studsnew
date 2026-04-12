"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, Image as ImageIcon, BadgeCheck, Banknote, MapPin, GraduationCap, Calendar, Bookmark, ChevronDown } from "lucide-react";
import { scholarshipApi, Scholarship } from "@/services/scholarship.api";
import { useAuth } from "@/services/AuthContext";
import AlertDialog from "@/components/ui/AlertDialog";
import { ScholarshipBasedOnCollege, RecommendedScholarship } from "./ScholarshipAdCarousel";
import ScholarshipFilterSidebar from "./ScholarshipFilterSidebar";
import LoginView from "@/components/auth/LoginView";
import SignupView from "@/components/auth/SignupView";
import AuthModal from "@/components/auth/AuthModal";
import SelectScholarshipTypeModal from "./SelectScholarshipTypeModal";

const FilterSection = ({
  title,
  icon,
  children,
  isOpenDefault = false,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  isOpenDefault?: boolean;
}) => {
  return (
    <details className="group mb-4 border-b border-gray-100 pb-4" open={isOpenDefault}>
      <summary className="flex justify-between items-center font-semibold text-[14px] text-slate-800 cursor-pointer list-none">
        <span className="flex items-center gap-2">
          {icon}
          {title}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500 transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  );
};

const CheckboxLabel = ({ label, checked = false, onChange }: { label: string; checked?: boolean; onChange?: (checked: boolean) => void }) => (
  <label className="flex items-center gap-3 cursor-pointer group/label mb-3">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange?.(e.target.checked)}
      className="w-4 h-4 accent-[#0000ff] border-gray-300 rounded cursor-pointer"
    />
    <span className="text-[14px] text-gray-600 group-hover/label:text-gray-900 transition-colors">
      {label}
    </span>
  </label>
);

const SearchInput = ({ placeholder }: { placeholder: string }) => (
  <div className="relative mb-3">
    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
    <input
      type="text"
      placeholder={placeholder}
      className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all placeholder:text-gray-400"
    />
  </div>
);

const getStatusStyle = (status: string) => {
  switch (status) {
    case "OPEN":
      return {
        statusDot: "bg-[#22c55e]",
        statusText: "text-[#22c55e]",
        statusBg: "bg-green-50",
      };
    case "CLOSING SOON":
      return {
        statusDot: "bg-[#eab308]",
        statusText: "text-[#eab308]",
        statusBg: "bg-yellow-50",
      };
    case "CLOSED":
      return {
        statusDot: "bg-gray-400",
        statusText: "text-gray-500",
        statusBg: "bg-gray-100",
      };
    default:
      return {
        statusDot: "bg-gray-400",
        statusText: "text-gray-500",
        statusBg: "bg-gray-100",
      };
  }
};

const ScholarshipCard = ({
  scholarship,
  isSelected = false,
  isQuickApplyMode = false,
  isSaved = false,
  onToggleSelection,
  onToggleSaved,
}: {
  scholarship: Scholarship;
  isSelected?: boolean;
  isQuickApplyMode?: boolean;
  isSaved?: boolean;
  onToggleSelection?: () => void;
  onToggleSaved?: () => void;
}) => {
  const statusStyle = getStatusStyle(scholarship.status);
  
  const imageHtml = scholarship.imageUrl ? (
    <img src={scholarship.imageUrl} alt={scholarship.title} className="w-full h-full object-cover" />
  ) : (
    <div className="w-full h-full p-3 flex items-start bg-linear-to-br from-gray-200 to-gray-50">
      <span className="text-gray-600 text-[13px] font-medium flex items-start gap-1.5 leading-snug">
        <ImageIcon className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
        {scholarship.imagePlaceholder}
      </span>
    </div>
  );

  return (
    <div
      className="relative flex flex-col bg-white rounded-2xl border border-gray-200/80 transition-all duration-300 p-3"
    >
      {/* Selection Checkbox */}
      {isQuickApplyMode && (
        <div 
          className="absolute top-3 right-3 z-10 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleSelection?.();
          }}
        >
          <div className="relative flex h-5 w-5 items-center justify-center">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => {}}
              className="peer sr-only"
            />
            <div className="absolute inset-0 rounded-sm border-[1.5px] border-slate-300 bg-white transition-colors peer-checked:border-brand-blue peer-checked:bg-brand-blue"></div>
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
        </div>
      )}

      {/* Image Area */}
      <div className="h-31.25 w-full bg-gray-100 relative overflow-hidden rounded-xl mb-3">
        {imageHtml}
      </div>

      {/* Content Area */}
      <div className="flex flex-col grow px-1">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-blue-600 bg-blue-50 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">
            {scholarship.badgeType}
          </span>
<div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${statusStyle.statusBg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.statusDot}`}></span>
              <span className={`text-[10px] font-bold uppercase tracking-wide ${statusStyle.statusText}`}>
                {scholarship.status}
              </span>
            </div>
        </div>

        {/* Title & Organization */}
        <h3 className="font-bold text-[16px] leading-tight text-slate-900 mb-1 hover:text-brand-blue">
          {scholarship.title}
        </h3>
        <div className="flex items-center gap-1.5 text-[12.5px] text-gray-500 mb-3.5">
          {scholarship.org}
          <BadgeCheck className="w-3.5 h-3.5 text-white fill-[#2563eb]" />
        </div>

        {/* Details Box */}
        <div className="bg-[#f9fafb] rounded-xl p-3.5 border border-gray-100 mb-4 mt-auto flex flex-col gap-2.5">
          <div className="grid grid-cols-2 gap-x-2">
            {/* Amount */}
            <div className="flex items-center gap-1.5 text-[12px] text-gray-600 font-medium">
              <Banknote className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{scholarship.amount}</span>
            </div>
            {/* Location */}
            <div className="flex items-center gap-1.5 text-[12px] text-gray-600 font-medium">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{scholarship.location}</span>
            </div>
          </div>

          {/* Eligibility */}
          <div className="flex items-center gap-1.5 text-[12px] text-gray-600 font-medium">
            <GraduationCap className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="truncate">{scholarship.eligibility}</span>
          </div>

          {/* Deadline */}
          <div className="flex items-center gap-1.5 text-[12px] text-gray-800 font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#f43f5e] shrink-0" />
            <span>Ends: {scholarship.deadline}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="flex-1 py-2 text-[13px] font-semibold text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
            Details
          </button>
          <button className="flex-[1.2] py-2 text-[13px] font-semibold text-white bg-brand-blue rounded-md hover:bg-[#0000cc] transition-colors">
            Apply
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleSaved?.();
            }}
            className={`p-2 border rounded-md transition-colors flex items-center justify-center ${
              isSaved
                ? "border-blue-200 bg-blue-50"
                : "border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            }`}
            title={isSaved ? "Remove Bookmark" : "Bookmark"}
          >
            <Bookmark className={`w-4.5 h-4.5 ${isSaved ? "text-brand-blue fill-brand-blue" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

const FeaturedScholarshipsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [toast, setToast] = useState<string | null>(null);
  const [savedScholarships, setSavedScholarships] = useState<(string | number)[]>([]);
  const [selectedForApply, setSelectedForApply] = useState<(string | number)[]>([]);
  const [isQuickApplyMode, setIsQuickApplyMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applyMessage, setApplyMessage] = useState("");
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const [showCategoryAlert, setShowCategoryAlert] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    studyLevel: [] as string[],
    location: [] as string[],
    courseStream: [] as string[],
    scholarshipType: [] as string[],
    providerType: [] as string[],
    coverage: [] as string[],
    gpaRequirement: [] as string[],
    deadlineType: [] as string[],
  });

  const [appliedDropdownOpen, setAppliedDropdownOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat?: number; lng?: number }>({});

  const handleLocationDetect = (location: string, lat?: number, lng?: number) => {
    setUserLocation({ lat, lng });
  };

  const appliedFilters = useMemo(() => {
    const tags: { key: string; label: string; value: string }[] = [];
    const labels: Record<string, string> = {
      studyLevel: "Study Level",
      courseStream: "Course",
      scholarshipType: "Type",
      providerType: "Provider",
      coverage: "Coverage",
      gpaRequirement: "GPA",
      deadlineType: "Deadline",
    };
    Object.entries(filters).forEach(([key, values]) => {
      if (Array.isArray(values)) {
        values.forEach((v) => tags.push({ key, label: labels[key] || key, value: v }));
      }
    });
    return tags;
  }, [filters]);

  useEffect(() => {
    const savedCoords = sessionStorage.getItem("navLocationCoords");
    if (savedCoords) {
      try {
        const coords = JSON.parse(savedCoords);
        setUserLocation({ lat: coords.lat, lng: coords.lng });
      } catch {}
    }
  }, []);

  useEffect(() => {
    const loadScholarships = async () => {
      const response = await scholarshipApi.getScholarships({
        studyLevel: filters.studyLevel.length ? filters.studyLevel : undefined,
        location: filters.location.length ? filters.location : undefined,
        courseStream: filters.courseStream.length ? filters.courseStream : undefined,
        scholarshipType: filters.scholarshipType.length ? filters.scholarshipType : undefined,
        providerType: filters.providerType.length ? filters.providerType : undefined,
        coverage: filters.coverage.length ? filters.coverage : undefined,
        gpaRequirement: filters.gpaRequirement.length ? filters.gpaRequirement : undefined,
        deadlineType: filters.deadlineType.length ? filters.deadlineType : undefined,
        userLat: userLocation.lat,
        userLng: userLocation.lng,
      }, currentPage);
      setScholarships(response.scholarships);
      setTotalPages(response.pagination.totalPages);
    };
    loadScholarships();
  }, [filters, userLocation, currentPage]);

  const toggleFilter = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const toggleSelection = (scholarshipId: string | number) => {
    setSelectedForApply((prev) => {
      if (prev.includes(scholarshipId))
        return prev.filter((id) => id !== scholarshipId);
      if (prev.length >= 5) {
        setShowLimitAlert(true);
        return prev;
      }
      return [...prev, scholarshipId];
    });
  };

  const toggleSavedScholarship = (scholarshipId: string | number) => {
    setSavedScholarships((prev) =>
      prev.includes(scholarshipId)
        ? prev.filter((id) => id !== scholarshipId)
        : [...prev, scholarshipId],
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      if (filters.scholarshipType.length === 0) {
        setShowCategoryAlert(true);
        e.target.checked = false;
        return;
      }
      
      setIsQuickApplyMode(true);
      const toSelect = scholarships.slice(0, 5).map((s) => s.id);
      setSelectedForApply(toSelect);
    } else {
      setSelectedForApply([]);
      setIsQuickApplyMode(false);
    }
  };

  const handleCategorySelect = async (scholarshipType: string) => {
    const badgeTypeMap: Record<string, string> = {
      "Need Based": "NEED BASED",
      "need-based": "NEED BASED",
      "Merit Based": "MERIT BASED",
      "merit-based": "MERIT BASED",
      "Partial Tuition": "PARTIAL TUITION",
      "partial-tuition": "PARTIAL TUITION",
      "Full Tuition": "FULL TUITION",
      "full-tuition": "FULL TUITION",
      "Research Grant": "RESEARCH GRANT",
      "research-grant": "RESEARCH GRANT",
      "Athletic & Sports": "ATHLETIC & SPORTS",
      "athletic-sports": "ATHLETIC & SPORTS",
      "Diversity & Minority": "DIVERSITY & MINORITY",
      "diversity": "DIVERSITY & MINORITY",
    };
    
    const badgeType = badgeTypeMap[scholarshipType] || scholarshipType.toUpperCase().replace(/-/g, " ");
    
    setFilters((prev) => ({
      ...prev,
      scholarshipType: [badgeType],
    }));
    setShowCategoryAlert(false);
    
    const response = await scholarshipApi.getScholarships({
      studyLevel: filters.studyLevel.length ? filters.studyLevel : undefined,
      location: filters.location.length ? filters.location : undefined,
      courseStream: filters.courseStream.length ? filters.courseStream : undefined,
      scholarshipType: [badgeType],
      providerType: filters.providerType.length ? filters.providerType : undefined,
      coverage: filters.coverage.length ? filters.coverage : undefined,
      gpaRequirement: filters.gpaRequirement.length ? filters.gpaRequirement : undefined,
      deadlineType: filters.deadlineType.length ? filters.deadlineType : undefined,
    }, 1);
    
    setScholarships(response.scholarships);
    setTotalPages(response.pagination.totalPages);
    setCurrentPage(1);
    
    const toSelect = response.scholarships.slice(0, 5).map((s) => s.id);
    setSelectedForApply(toSelect);
    setIsQuickApplyMode(true);
  };

  const scholarshipTypeOptions = ["Need Based", "Merit Based", "Partial Tuition", "Full Tuition", "Research Grant"];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (selectedForApply.length > 0) {
      setIsQuickApplyMode(true);
    }
  }, [selectedForApply]);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    setApplyMessage("");
    setSelectedForApply([]);
    setIsQuickApplyMode(false);
    setToast("Application submitted successfully! Providers will contact you soon.");
    setTimeout(() => setToast(null), 4000);
  };

  const handleExploreClick = (cardName: string) => {
    setToast(`Redirecting to opportunities from ${cardName}...`);
    setTimeout(() => setToast(null), 3000);
  };

 
  return (
    <div className="bg-white text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="min-h-screen py-16 px-4 md:px-8">
        <div className="max-w-350 mx-auto">
          {/* Main Layout: Sidebar + Grid */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <ScholarshipFilterSidebar filters={filters} setFilters={setFilters} onLocationDetect={handleLocationDetect} />

            {/* Grid Container (Right Side) */}
            <div className="w-full lg:w-3/4">
              {/* Top Controls Section */}
              <div className="mb-5 flex flex-col">
                {/* Top Row: Count and Search */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
                  <div className="text-[16px] text-black mb-2">
                    Showing {scholarships.length > 0 ? `1–${scholarships.length}` : "0"} of {scholarships.length} <span className="font-bold">Scholarships</span>
                  </div>
                  <div className="relative w-full sm:w-95">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search scholarships, locations, courses..."
                      className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-gray-400 "
                    />
                  </div>
                </div>

                {/* Bottom Row: Select All and Toggle */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2 pb-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <div className="relative flex h-5 w-5 items-center justify-center">
                      <input
                        type="checkbox"
                        checked={
                          selectedForApply.length > 0 &&
                          selectedForApply.length === Math.min(scholarships.length, 5)
                        }
                        onChange={handleSelectAll}
                        className="peer sr-only"
                      />
                      <div className="absolute inset-0 rounded-sm border-[1.5px] border-slate-300 bg-white transition-colors group-hover:border-slate-400 peer-checked:border-brand-blue peer-checked:bg-brand-blue"></div>
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
                    <span className="text-[15px] font-semibold text-slate-900 ml-1">Select all</span>
                    <span className="text-[14px] text-gray-500">(upto 5 quick apply scholarships)</span>
                  </label>

                  <div className="flex items-center gap-3">
                    <span className="text-[15px] font-semibold text-slate-900">Quick Apply</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isQuickApplyMode}
                        onChange={(e) => {
                          setIsQuickApplyMode(e.target.checked);
                          if (!e.target.checked) setSelectedForApply([]);
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#cbd5e1] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Scholarship Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {scholarships.map((scholarship, index) => {
                    const isAfter2Rows = (index + 1) % 6 === 0 && index > 0;
                    const showAd = index < 12 && isAfter2Rows;
                    const adIndex = Math.floor(index / 6);
                    
                    return (
                      <React.Fragment key={scholarship.id}>
                        <ScholarshipCard
                          scholarship={scholarship}
                          isSelected={selectedForApply.includes(scholarship.id)}
                          isQuickApplyMode={isQuickApplyMode}
                          isSaved={savedScholarships.includes(scholarship.id)}
                          onToggleSelection={() => toggleSelection(scholarship.id)}
                          onToggleSaved={() => toggleSavedScholarship(scholarship.id)}
                        />
                        {showAd && (
                          <div className="col-span-1 md:col-span-2 lg:col-span-3 w-full">
                            {adIndex === 0 && <RecommendedScholarship />}
                            {adIndex === 1 && <ScholarshipBasedOnCollege />}
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2 mt-12 mb-4">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-[14px] font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-800 transition-colors mr-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 flex items-center justify-center text-[14px] font-medium rounded-lg transition-colors ${
                      page === currentPage
                        ? "text-white bg-brand-blue shadow-sm shadow-blue-500/30"
                        : "text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-[14px] font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Apply Bottom Action Bar */}
      <div
        className={`fixed bottom-0 left-0 z-40 flex w-full transform justify-center border-t border-slate-200 bg-white px-4 py-4 shadow-[0_-4px_15px_rgb(0,0,0,0.05)] transition-transform duration-300 sm:px-6 ${selectedForApply.length > 0 ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="flex w-full max-w-350 items-center justify-end gap-4 sm:gap-6">
          <button
            onClick={() => {
              setSelectedForApply([]);
              setFilters((prev) => ({ ...prev, scholarshipType: [] }));
            }}
            className="cursor-pointer border-none bg-transparent text-[14px] font-semibold text-brand-blue hover:underline sm:text-[15px]"
          >
            Clear Selection
          </button>
          <button
            onClick={() => {
              if (!isAuthenticated) {
                setShowLoginAlert(true);
              } else {
                setIsModalOpen(true);
              }
            }}
            className="flex items-center gap-2 rounded-full bg-brand-blue px-5 py-2.5 text-[14px] font-semibold text-white shadow-md transition-colors hover:bg-brand-hover sm:px-6 sm:text-[15px]"
          >
            Quick Apply{" "}
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[12px] font-bold text-brand-blue">
              {selectedForApply.length}
            </span>
          </button>
        </div>
      </div>

      {/* Quick Apply Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isModalOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setIsModalOpen(false)}
      >
        <div
          className={`mx-4 flex max-h-[90vh] w-full max-w-lg flex-col rounded-[20px] bg-white shadow-2xl transition-transform duration-300 ${isModalOpen ? "scale-100" : "scale-95"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-5">
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <svg className="w-5 h-5 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Quick Apply to Scholarships
            </h3>
            <button
              onClick={() => setIsModalOpen(false)}
              className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="overflow-y-auto px-6 py-5">
            <div className="mb-5 flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 p-3.5">
              <svg className="w-4.5 h-4.5 shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-[13px] text-blue-800">
                You are applying to{" "}
                <span className="text-[14px] font-bold text-blue-700">
                  {selectedForApply.length}
                </span>{" "}
                selected scholarship(s). They will review your application and get back to you.
              </p>
            </div>
            
            {isAuthenticated && user && (
              <div className="mb-5 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="text-[14px] font-bold text-gray-800 mb-3">Applicant Information</h4>
                <div className="grid grid-cols-2 gap-3 text-[13px]">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <span className="ml-2 font-medium text-gray-800">{user.first_name} {user.last_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <span className="ml-2 font-medium text-gray-800">{user.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Phone:</span>
                    <span className="ml-2 font-medium text-gray-800">{user.phone || "Not provided"}</span>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleApplySubmit}>
              <div className="mb-5">
                <label
                  htmlFor="applyMessage"
                  className="mb-2 block text-[14px] font-bold text-gray-800"
                >
                  Your Question / Message{" "}
                </label>
                <textarea
                  id="applyMessage"
                  value={applyMessage}
                  onChange={(e) => setApplyMessage(e.target.value)}
                  placeholder="Write your message to the scholarship providers..."
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 p-3 text-[14px] transition-all placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-brand-blue"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-brand-blue py-3 text-[15px] font-semibold text-white transition-colors hover:bg-brand-hover"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Alert Dialog for selection limit */}
      <AlertDialog
        isOpen={showLimitAlert}
        onClose={() => setShowLimitAlert(false)}
        title="Selection Limit Reached"
        message="You can select up to 5 scholarships for Quick Apply. Please deselect one to add another."
      />

      <SelectScholarshipTypeModal
        isOpen={showCategoryAlert}
        onClose={() => setShowCategoryAlert(false)}
        onSelect={handleCategorySelect}
      />

      {/* Login Required Alert */}
      {showLoginAlert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setShowLoginAlert(false)}
        >
          <div
            className="mx-4 w-full max-w-md rounded-xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 mx-auto">
                <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900">Login Required</h3>
              <p className="mb-4 text-sm text-gray-600">You need to be logged in to apply for scholarships.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowLoginAlert(false); setShowAuthModal(true); }}
                  className="flex-1 rounded-lg bg-brand-blue px-4 py-2 text-sm font-semibold text-white hover:bg-brand-hover transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => { setShowLoginAlert(false); setShowAuthModal(true); }}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Register
                </button>
              </div>
              <button
                onClick={() => setShowLoginAlert(false)}
                className="mt-3 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        initialView="login"
        onClose={() => {
          setShowAuthModal(false);
        }}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#212543] text-white px-6 py-3 rounded-lg text-sm font-medium shadow-lg z-1000 animate-in fade-in slide-in-from-bottom-10 duration-300">
          {toast}
        </div>
      )}
    </div>
  );
};

export default FeaturedScholarshipsPage;
