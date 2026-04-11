import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { College, apiService } from "@/services/api";
import { CollegeFilters } from "@/app/find-college/types";
import {
  BadgeCheckIcon,
  LockIcon,
  Star,
  MapPin,
  Award,
  MessageSquare,
  Bookmark,
} from "lucide-react";
import Pagination from "@/components/ui/Pagination";

import LocationAd from "./ads/LocationAd";
import RatingAd from "./ads/RatingAd";
import TrendingCollegesAd from "./ads/TrendingCollegesAd";
import ClaimCollegeModal from "./ClaimCollegeModal";

interface CollegeGridProps {
  filters: CollegeFilters;
  setFilters: React.Dispatch<React.SetStateAction<CollegeFilters>>;
  onNavigate: (view: any, data?: any) => void;
}

type ArrayFilterKey = {
  [K in keyof CollegeFilters]: CollegeFilters[K] extends string[] ? K : never;
}[keyof CollegeFilters];

const SEARCHABLE_FILTER_KEYS: Array<ArrayFilterKey> = [
  "stream",
  "facilities",
  "feeRange",
  "duration",
  "popularity",
  "quick",
];

const FILTER_LABELS: Record<string, string> = {
  plus2: "+2 / Higher Secondary",
  alevel: "A Level",
  bachelor: "Bachelor",
  master: "Master",
  diploma: "Diploma / CTEVT",
  p2_sci: "Science",
  p2_mgmt: "Management",
  p2_hum: "Humanities",
  p2_edu: "Education",
  p2_law: "Law",
  al_sci: "A Level - Science",
  al_nonsci: "A Level - Non-Science/Mgmt",
  b_it: "Information Technology & CS",
  b_eng: "Engineering",
  b_biz: "Business & Management",
  b_med: "Medical & Healthcare",
  b_hum: "Humanities & Social Sciences",
  b_agr: "Agriculture & Forestry",
  m_biz: "Business & Management",
  m_it: "IT & Computer Science",
  m_eng: "Engineering",
  m_hum: "Humanities & Social Sciences",
  d_eng: "Engineering (CTEVT)",
  d_med: "Medical & Nursing (CTEVT)",
  d_hm: "Hotel Management & Tourism",
  d_agr: "Agriculture & Forestry (CTEVT)",
  c_bsc_csit: "BSc CSIT",
  c_bca: "BCA",
  c_bit: "BIT",
  c_bim: "BIM",
  c_civil: "BE Civil Engineering",
  c_comp: "BE Computer Engineering",
  c_arch: "B. Architecture",
  c_elec: "BE Electrical/Electronics",
  c_bba: "BBA",
  c_bbs: "BBS",
  c_bbm: "BBM",
  c_bhm: "BHM",
  c_mbbs: "MBBS",
  c_bds: "BDS",
  c_nursing: "BSc. Nursing",
  c_pharma: "B. Pharmacy",
  c_bsc_ag: "BSc. Agriculture",
  c_bsc_forestry: "BSc. Forestry",
  c_mba: "MBA",
  c_mbs: "MBS",
  c_msc_csit: "MSc. CSIT",
  c_mca: "MCA",
  c_mit: "MIT",
  c_dip_civil: "Diploma in Civil Eng.",
  c_dip_comp: "Diploma in Computer Eng.",
  c_pcl_nurs: "PCL Nursing",
  c_ha: "HA (General Medicine)",
  prov_koshi: "Koshi",
  prov_madhesh: "Madhesh",
  prov_bagmati: "Bagmati",
  prov_gandaki: "Gandaki",
  prov_lumbini: "Lumbini",
  prov_karnali: "Karnali",
  prov_sudur: "Sudurpashchim",
  d_jhapa: "Jhapa",
  d_morang: "Morang",
  d_sunsari: "Sunsari",
  d_dhanusha: "Dhanusha",
  d_parsa: "Parsa",
  d_bhaktapur: "Bhaktapur",
  d_chitwan: "Chitwan",
  d_kathmandu: "Kathmandu",
  d_lalitpur: "Lalitpur",
  d_kavre: "Kavrepalanchok",
  d_kaski: "Kaski",
  d_nawalpur: "Nawalpur",
  d_tanahun: "Tanahun",
  d_banke: "Banke",
  d_rupandehi: "Rupandehi",
  d_dang: "Dang",
  d_surkhet: "Surkhet",
  d_jumla: "Jumla",
  d_kailali: "Kailali",
  d_kanchanpur: "Kanchanpur",
  u_tu: "Tribhuvan University",
  u_ku: "Kathmandu University",
  u_pu: "Pokhara University",
  u_purbanchal: "Purbanchal University",
  u_mwu: "Mid-Western University",
  u_fwu: "Far-Western University",
  u_afu: "Agriculture & Forestry University",
  u_lincoln: "Lincoln University",
  u_london_met: "London Metropolitan University",
  u_west_england: "University of the West of England",
};

const toFilterLabel = (value: string): string => FILTER_LABELS[value] || value;

const COLLEGES_PER_PAGE = 20;

const CollegeGrid: React.FC<CollegeGridProps> = ({
  filters,
  setFilters,
  onNavigate,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [savedColleges, setSavedColleges] = useState<number[]>([]);
  const [selectedForInquiry, setSelectedForInquiry] = useState<number[]>([]);
  const [isQuickInquiryMode, setIsQuickInquiryMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [collegeToClaim, setCollegeToClaim] = useState<College | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const searchTerms = useMemo(
    () =>
      [
        filters.search,
        ...filters.academic.map(toFilterLabel),
        ...filters.program.map(toFilterLabel),
        ...filters.course.map(toFilterLabel),
        ...filters.courseDuration.map(toFilterLabel),
        ...SEARCHABLE_FILTER_KEYS.flatMap((key) => filters[key]).map(toFilterLabel),
      ]
        .map((value) => String(value).trim())
        .filter(Boolean),
    [filters],
  );

  const locationTerms = useMemo(
    () => [...filters.province, ...filters.district, ...filters.location].map(toFilterLabel),
    [filters],
  );

  const universityTerms = useMemo(
    () => filters.university.map(toFilterLabel),
    [filters.university],
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["colleges", currentPage, filters, isQuickInquiryMode],
    queryFn: () => {
      const sortConfig: Record<string, { sort: string; order: "ASC" | "DESC" }> = {
        popularity: { sort: "rating", order: "DESC" },
        rating: { sort: "rating", order: "DESC" },
        verified: { sort: "verified", order: "DESC" },
        fee_low: { sort: "rating", order: "ASC" },
        fee_high: { sort: "rating", order: "DESC" },
      };
      const selectedSort = sortConfig[filters.sortBy] || sortConfig.popularity;

      const params: any = {
        page: currentPage,
        pageSize: COLLEGES_PER_PAGE,
        sort: selectedSort.sort,
        order: selectedSort.order,
      };

      if (filters.quick.includes("Verified")) params.verified = true;
      if (
        filters.popularity.includes("Most Enrolled") ||
        filters.popularity.includes("Recommended")
      ) {
        params.popular = true;
      }
      if (filters.type.length > 0) params.type = filters.type.join(",");
      if (locationTerms.length > 0) params.location = locationTerms.join(",");
      if (universityTerms.length > 0) params.affiliation = universityTerms.join(",");
      if (filters.feeMax < 2000000) params.feeMax = filters.feeMax;

      if (searchTerms.length > 0) params.search = searchTerms.join(" ");

      return apiService.getColleges(params);
    },
    placeholderData: (previousData) => previousData,
  });

  const colleges = data?.data?.colleges || [];
  const totalResults = data?.data?.pagination?.total || 0;
  const totalPages = data?.data?.pagination?.totalPages || 1;
  const showingFrom = totalResults === 0 ? 0 : (currentPage - 1) * COLLEGES_PER_PAGE + 1;
  const showingTo = Math.min((currentPage - 1) * COLLEGES_PER_PAGE + colleges.length, totalResults);

  const toggleSavedCollege = (collegeId: number) => {
    setSavedColleges((prev) =>
      prev.includes(collegeId)
        ? prev.filter((id) => id !== collegeId)
        : [...prev, collegeId],
    );
  };

  const toggleSelection = (collegeId: number) => {
    setSelectedForInquiry((prev) => {
      if (prev.includes(collegeId))
        return prev.filter((id) => id !== collegeId);
      if (prev.length >= 5) {
        alert("You can select up to 5 colleges for Quick Apply.");
        return prev;
      }
      return [...prev, collegeId];
    });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setIsQuickInquiryMode(true);
      const toSelect = colleges.slice(0, 5).map((c) => c.id);
      setSelectedForInquiry(toSelect);
    } else {
      setSelectedForInquiry([]);
      setIsQuickInquiryMode(false);
    }
  };

  useEffect(() => {
    if (selectedForInquiry.length > 0) {
      setIsQuickInquiryMode(true);
    }
  }, [selectedForInquiry]);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Success! Your inquiry has been sent to the selected colleges.");
    setIsModalOpen(false);
    setInquiryMessage("");
    setSelectedForInquiry([]);
  };

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-semibold text-red-700">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-col justify-start">
            <h1 className="mb-3 text-base text-gray-900">
              Showing {showingFrom.toLocaleString()}-{showingTo.toLocaleString()} of {totalResults.toLocaleString()} <span className="font-bold">Colleges</span>
            </h1>

            {isLoading && (
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[12px] font-medium text-blue-700">
                <svg
                  className="h-3.5 w-3.5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Updating results...
              </div>
            )}

            <label className="group mt-auto flex cursor-pointer items-center gap-2.5">
              <div className="relative flex h-5 w-5 items-center justify-center">
                <input
                  type="checkbox"
                  checked={
                    selectedForInquiry.length > 0 &&
                    selectedForInquiry.length === Math.min(colleges.length, 5)
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="flex items-baseline gap-1.5 text-[14px]">
                <span className="font-semibold text-slate-900">Select all</span>
                <span className="hidden text-[12.5px] text-slate-500 sm:inline">
                  (upto 5 quick apply colleges)
                </span>
              </div>
            </label>
          </div>

          <div className="mt-2 flex w-full shrink-0 flex-col gap-3 sm:mt-0 sm:w-[320px] sm:items-end">
            <div className="relative w-full">
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400"></i>
              <input
                type="text"
                value={filters.search}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    search: event.target.value,
                  }))
                }
                placeholder="Search colleges, locations, courses..."
                className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm transition-all placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-brand-blue"
              />
            </div>

            <label className="group flex cursor-pointer items-center gap-2">
              <span className="text-[13px] font-semibold text-slate-800">
                Quick Apply
              </span>
              <div className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={isQuickInquiryMode}
                  onChange={(e) => {
                    setIsQuickInquiryMode(e.target.checked);
                    if (!e.target.checked) setSelectedForInquiry([]);
                  }}
                  className="peer sr-only"
                />
                <div className="peer h-5 w-8.5 rounded-full bg-slate-300 transition-all after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-blue peer-checked:after:translate-x-3.5 peer-checked:after:border-white peer-focus:outline-none"></div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div
        className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
        id="card-grid"
      >
        {isLoading && colleges.length === 0 && (
          <div className="col-span-1 rounded-2xl border border-gray-100 bg-white py-16 text-center text-gray-500 shadow-[0_2px_15px_rgb(0,0,0,0.04)] md:col-span-2 xl:col-span-3">
            Loading colleges...
          </div>
        )}

        {colleges.map((college: College, index: number) => {
          const globalIndex = (currentPage - 1) * COLLEGES_PER_PAGE + index;
          const isAfter2Rows = (index + 1) % 6 === 0;
          const adCycleIndex = Math.floor(globalIndex / 6) % 3;

          return (
            <React.Fragment key={college.id}>
              <ProgramCard
                college={college}
                isVerified={Boolean(college.verified)}
                isSaved={savedColleges.includes(college.id)}
                isSelected={selectedForInquiry.includes(college.id)}
                isQuickInquiryMode={isQuickInquiryMode}
                onNavigate={onNavigate}
                onToggleSaved={() => toggleSavedCollege(college.id)}
                onToggleSelection={() => toggleSelection(college.id)}
                onClaim={() => setCollegeToClaim(college)}
              />
              {isAfter2Rows && (
                <div className="col-span-1 md:col-span-2 xl:col-span-3 w-full">
                  {adCycleIndex === 0 && <TrendingCollegesAd />}
                  {adCycleIndex === 1 && <LocationAd />}
                  {adCycleIndex === 2 && <RatingAd />}
                </div>
              )}
            </React.Fragment>
          );
        })}

        {!isLoading && colleges.length === 0 && (
          <div className="col-span-1 rounded-2xl border border-gray-100 bg-white py-16 text-center text-gray-500 shadow-[0_2px_15px_rgb(0,0,0,0.04)] md:col-span-2 xl:col-span-3">
            No colleges found matching your filters.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Bottom Action Bar */}
      <div
        className={`fixed bottom-0 left-0 z-40 flex w-full transform justify-center border-t border-slate-200 bg-white px-4 py-4 shadow-[0_-4px_15px_rgb(0,0,0,0.05)] transition-transform duration-300 sm:px-6 ${selectedForInquiry.length > 0 ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="flex w-full max-w-350 items-center justify-end gap-4 sm:gap-6">
          <button
            onClick={() => setSelectedForInquiry([])}
            className="cursor-pointer border-none bg-transparent text-[14px] font-semibold text-brand-blue hover:underline sm:text-[15px]"
          >
            Clear Selection
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-full bg-brand-blue px-5 py-2.5 text-[14px] font-semibold text-white shadow-md transition-colors hover:bg-brand-hover sm:px-6 sm:text-[15px]"
          >
            Quick Apply{" "}
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[12px] font-bold text-brand-blue">
              {selectedForInquiry.length}
            </span>
          </button>
        </div>
      </div>

      {/* Quick Inquiry Modal */}
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
              <i className="fa-solid fa-paper-plane text-[20px] text-brand-blue"></i>
              Quick Apply to Colleges
            </h3>
            <button
              onClick={() => setIsModalOpen(false)}
              className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            >
              <i className="fa-solid fa-xmark text-[20px]"></i>
            </button>
          </div>
          <div className="overflow-y-auto px-6 py-5">
            <div className="mb-5 flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 p-3.5">
              <i className="fa-solid fa-circle-info mt-0.5 shrink-0 text-[18px] text-blue-600"></i>
              <p className="line-height-extra text-[13px] text-blue-800">
                You are applying to{" "}
                <span className="text-[14px] font-bold text-blue-700">
                  {selectedForInquiry.length}
                </span>{" "}
                selected college(s). They will review your application and get
                back to you.
              </p>
            </div>
            <form onSubmit={handleInquirySubmit}>
              <div className="mb-5">
                <label
                  htmlFor="inquiryMessage"
                  className="mb-2 block text-[14px] font-bold text-gray-800"
                >
                  Your Question / Message{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="inquiryMessage"
                  required
                  rows={4}
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[14px] text-gray-800 shadow-sm transition-all focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  placeholder="E.g., What are the admission requirements, fee structures, and scholarship options for the upcoming intake?"
                ></textarea>
              </div>
              <div className="mt-8 flex flex-col justify-end gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-[14px] font-bold text-gray-600 transition-colors hover:bg-gray-50 sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-blue px-6 py-2.5 text-[14px] font-bold text-white shadow-[0_4px_12px_rgba(0,0,255,0.2)] transition-all hover:-translate-y-0.5 hover:bg-brand-hover sm:w-auto"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <ClaimCollegeModal
        college={collegeToClaim}
        onClose={() => setCollegeToClaim(null)}
      />
    </>
  );
};

const ProgramCard: React.FC<{
  college: College;
  isVerified: boolean;
  isSaved: boolean;
  isSelected: boolean;
  isQuickInquiryMode: boolean;
  onNavigate: (view: any, data?: any) => void;
  onToggleSaved: () => void;
  onToggleSelection: () => void;
  onClaim: () => void;
}> = ({
  college,
  isVerified,
  isSaved,
  isSelected,
  isQuickInquiryMode,
  onNavigate,
  onToggleSaved,
  onToggleSelection,
  onClaim,
}) => {
  const description =
    (typeof college.description === "string" && college.description) ||
    "Explore academics, facilities, and counselling support for this college.";

  return (
    <div className="flex h-full cursor-pointer flex-col rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:border-blue-500/20">
      <div
        onClick={() => onNavigate("collegeDetails", { id: college.id })}
        className="group relative h-35 shrink-0 overflow-hidden rounded-xl"
      >
        {college.featured && (
          <div className="absolute top-3 left-3 z-10 rounded bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
            Featured
          </div>
        )}
        {isVerified && college.image_url ? (
          <img
            src={college.image_url}
            alt={college.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-brand-blue">
            
          </div>
        )}
        {!isVerified && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClaim();
            }}
            className="absolute bottom-2 left-2 z-10 rounded-md bg-black/65 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-black/75"
          >
            Is this your college? <span className="underline text-brand-blue">Claim now</span>
          </button>
        )}
        {isQuickInquiryMode && (
          <label
            className="absolute right-2 top-2 z-10 cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex h-6 w-6 items-center justify-center">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={onToggleSelection}
                className="peer sr-only"
              />
              <div className="absolute inset-0 rounded-md border border-slate-300 bg-white/90 shadow-sm backdrop-blur-sm transition-colors hover:border-slate-400 peer-checked:border-brand-blue peer-checked:bg-brand-blue"></div>
              <svg
                className="pointer-events-none absolute z-10 h-4 w-4 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </label>
        )}
      </div>

      <div className="flex flex-1 flex-col px-0 pt-3">
        <div className="flex items-center gap-1.5 mb-2">
          <button
            type="button"
            onClick={() => onNavigate("collegeDetails", { id: college.id })}
            className="truncate text-left text-[20px] font-bold text-slate-800 tracking-tight transition-colors hover:text-blue-600"
            title={college.name}
          >
            {college.name}
          </button>
          {isVerified && (
            <BadgeCheckIcon className="w-5 h-5 text-white fill-blue-500 shrink-0" />
          )}
        </div>

        <div className="mb-2 flex min-w-0 items-center text-[14px] text-gray-500">
          <div className="flex items-center gap-1 font-bold text-slate-700">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{Number(college.rating || 0).toFixed(1)}</span>
          </div>
          <span className="mx-3 text-gray-300 font-light">|</span>
          <div className="flex items-center gap-1.5">
            <Award className="w-4.5 h-4.5 text-gray-400" />
            <span className="font-semibold text-slate-700">
              {college.type || "College"}
            </span>
          </div>
          <span className="mx-3 text-gray-300 font-light">|</span>
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            <MapPin className="w-4.5 h-4.5 text-gray-400" />
            <span
              className="block min-w-0 truncate font-semibold text-slate-700"
              title={college.location || "Kathmandu"}
            >
              {college.location || "Kathmandu"}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2 text-[14px] text-gray-500 mb-2">
          <Award className="w-4.5 h-4.5 text-gray-400 shrink-0 mt-0.75" />
          <p className="leading-snug pr-4 font-semibold text-slate-700 line-clamp-1">
            {college.affiliation ||
              "NEB, Tribhuvan University, Purbanchal University"}
          </p>
        </div>

        <div className="mb-4 pr-2">
          <p className="line-clamp-2 text-[14px] leading-relaxed text-gray-500">
            {description}
          </p>
          <button
            type="button"
            className="mt-1 text-[14px] font-semibold text-blue-600 hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate("collegeDetails", { id: college.id });
            }}
          >
            Read more
          </button>
        </div>

        <div className="border-t border-dashed border-gray-200 mb-4" />

        <div className="flex flex-col gap-3 mt-auto">
          <button
            type="button"
            disabled={!isVerified}
            onClick={(e) => {
              e.stopPropagation();
              if (isVerified) {
                onNavigate("bookCounselling", { collegeId: college.id });
              }
            }}
            className={`w-full text-white font-medium text-[14px] py-2.5 px-4 rounded-md transition-colors flex items-center justify-center gap-1.5 ${
              isVerified
                ? "bg-brand-blue hover:bg-blue-700"
                : "bg-brand-blue cursor-not-allowed"
            }`}
          >
            {!isVerified && <LockIcon size={14} />}
            Get counselling
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate("campusForum", {
                  collegeId: college.id,
                  collegeName: college.name,
                });
              }}
              className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-slate-600 font-medium py-2 px-2 rounded-md transition-colors text-[13px]"
            >
              <MessageSquare className="w-4 h-4 text-gray-500" />
              Inquiry
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate("compareColleges", { collegeName: college.name });
              }}
              className="flex-1 bg-[#EAB308] hover:bg-yellow-500 text-white font-semibold py-2 px-2 rounded-md transition-colors text-[13px]"
            >
              Compare now
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSaved();
              }}
              className={`w-10 flex items-center justify-center border rounded-md transition-colors shrink-0 ${
                isSaved
                  ? "border-blue-200 bg-blue-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
              title={isSaved ? "Remove Bookmark" : "Bookmark"}
            >
              <Bookmark
                className={`w-4 h-4 transition-all ${isSaved ? "text-[#0000ff] fill-[#0000ff]" : "text-gray-400"}`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeGrid;
