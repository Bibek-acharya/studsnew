import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/services/AuthContext";
import { toast } from "sonner";
import { College, apiService, getImageUrl } from "@/services/api";
import { CollegeFilters, isCollegeVerified } from "@/app/find-college/types";
import { FaMap } from "react-icons/fa6";
import {
  BadgeCheckIcon,
  LockIcon,
  SlidersHorizontal,
  Star,
  MapPin,
  Award,
  MessageSquare,
  Bookmark,
  Globe,
  GraduationCap,
  FolderOpen,
  Loader2,
} from "lucide-react";
import Pagination from "@/components/ui/Pagination";

// import TrendingCollegesAd from "./ads/TrendingCollegesAd";
// import RecommendationFeedback from "./ads/RecommendationFeedback";
import ClaimCollegeModal from "./ClaimCollegeModal";

interface CollegeGridProps {
  filters: CollegeFilters;
  setFilters: React.Dispatch<React.SetStateAction<CollegeFilters>>;
  onNavigate: (view: any, data?: any) => void;
  onMobileFilterClick?: () => void;
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

const COLLEGES_PER_PAGE = 18;

const CollegeGrid: React.FC<CollegeGridProps> = ({
  filters,
  setFilters,
  onNavigate,
  onMobileFilterClick,
}) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [savedColleges, setSavedColleges] = useState<(number | string)[]>([]);
  const [bookmarkMap, setBookmarkMap] = useState<
    Record<string | number, number>
  >({});
  const [pendingBookmarks, setPendingBookmarks] = useState<
    Record<string | number, boolean>
  >({});
  const [savedInstIds, setSavedInstIds] = useState<number[]>([]);
  const [instBookmarkMap, setInstBookmarkMap] = useState<
    Record<number, number>
  >({});
  const [pendingInstBookmarks, setPendingInstBookmarks] = useState<
    Record<number, boolean>
  >({});
  const [selectedForInquiry, setSelectedForInquiry] = useState<
    (number | string)[]
  >([]);
  const [isQuickInquiryMode, setIsQuickInquiryMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [collegeToClaim, setCollegeToClaim] = useState<College | null>(null);
  const [collegeForInquiry, setCollegeForInquiry] = useState<College | null>(
    null,
  );
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryMessageSingle, setInquiryMessageSingle] = useState("");
  const [isInquiryBulkSent, setIsInquiryBulkSent] = useState(false);
  const [isInquirySingleSent, setIsInquirySingleSent] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    apiService
      .getBookmarksByType("colleges")
      .then((items) => {
        const ids: (number | string)[] = [];
        const map: Record<string | number, number> = {};
        items.forEach((b) => {
          ids.push(b.item_id);
          map[b.item_id] = b.id;
        });
        setSavedColleges(ids);
        setBookmarkMap(map);
      })
      .catch(() => {});
    apiService
      .getBookmarksByType("institutions")
      .then((items) => {
        const ids: number[] = [];
        const map: Record<number, number> = {};
        items.forEach((b) => {
          ids.push(b.item_id);
          map[b.item_id] = b.id;
        });
        setSavedInstIds(ids);
        setInstBookmarkMap(map);
      })
      .catch(() => {});
  }, [isAuthenticated]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
        ...SEARCHABLE_FILTER_KEYS.flatMap((key) => filters[key]).map(
          toFilterLabel,
        ),
      ]
        .map((value) => String(value).trim())
        .filter(Boolean),
    [filters],
  );

  const locationTerms = useMemo(
    () =>
      [...filters.province, ...filters.district, ...filters.location].map(
        toFilterLabel,
      ),
    [filters],
  );

  const universityTerms = useMemo(
    () => filters.university.map(toFilterLabel),
    [filters.university],
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["colleges", currentPage, filters, isQuickInquiryMode],
    queryFn: async () => {
      const sortConfig: Record<
        string,
        { sort: string; order: "ASC" | "DESC" }
      > = {
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
      if (universityTerms.length > 0)
        params.affiliation = universityTerms.join(",");
      if (filters.feeMax < 2000000) params.feeMax = filters.feeMax;
      if (searchTerms.length > 0) params.search = searchTerms.join(" ");

      // Fetch from both APIs in parallel
      const [collegeRes, institutionRes] = await Promise.all([
        apiService.getColleges(params),
        apiService.getPublicInstitutions({
          page: currentPage,
          limit: COLLEGES_PER_PAGE,
          search: filters.search || undefined,
          location:
            locationTerms.length > 0 ? locationTerms.join(",") : undefined,
          type: filters.type.length > 0 ? params.type : undefined,
          affiliation:
            universityTerms.length > 0 ? params.affiliation : undefined,
        }),
      ]);

      // Map institution results to College shape
      const institutionColleges: College[] = (
        institutionRes?.data?.institutions || []
      ).map((inst: any) => ({
        id: inst.college_id > 0 ? inst.college_id : (`inst_${inst.id}` as any),
        name: inst.institution_name,
        image_url: inst.banner_url || inst.logo_url,
        description: inst.about,
        location: inst.district,
        website: inst.website_url,
        verified: inst.verified ?? false,
        claimed: inst.claimed ?? false,
        affiliation: inst.affiliation || "",
        featured: inst.featured || false,
        rating: 0,
        reviews: 0,
        type: inst.type || inst.institution_type || "College",
      }));

      // Build set of college IDs that are claimed by institutions
      const claimedCollegeIds = new Set(
        (institutionRes?.data?.institutions || [])
          .filter((inst: any) => inst.college_id > 0)
          .map((inst: any) => inst.college_id),
      );

      // Filter out colleges that are already represented by an institution
      const filteredColleges = (collegeRes?.data?.colleges || []).filter(
        (c: any) => !claimedCollegeIds.has(c.id),
      );

      // Merge: institutions first, then remaining colleges (no duplicates)
      const merged = [...institutionColleges, ...filteredColleges];

      const collegePagination = collegeRes?.data?.pagination || {};
      const collegeTotal = collegePagination.total || 0;
      const instData = institutionRes?.data || {};
      const instTotal =
        instData.pagination?.total ??
        instData.total ??
        institutionRes?.total ??
        instData.count ??
        instData.meta?.total ??
        (instData.institutions || []).length;
      const duplicateCount = claimedCollegeIds.size;
      const combinedTotal = collegeTotal - duplicateCount + instTotal;

      return {
        data: {
          colleges: merged,
          pagination: {
            ...collegePagination,
            total: combinedTotal || merged.length,
            totalPages: Math.ceil(
              (combinedTotal || merged.length) / COLLEGES_PER_PAGE,
            ),
          },
        },
      };
    },
    placeholderData: (previousData) => previousData,
  });

  const colleges = data?.data?.colleges || [];
  const totalResults = data?.data?.pagination?.total || 0;
  const totalPages = data?.data?.pagination?.totalPages || 1;
  const showingFrom =
    totalResults === 0 ? 0 : (currentPage - 1) * COLLEGES_PER_PAGE + 1;
  const showingTo = Math.min(
    (currentPage - 1) * COLLEGES_PER_PAGE + colleges.length,
    totalResults,
  );

  const toggleSavedCollege = async (collegeId: number | string) => {
    if (!isAuthenticated) {
      toast.error("Please login to save bookmarks");
      return;
    }

    if (typeof collegeId !== "number") {
      const instId = Number(String(collegeId).replace("inst_", ""));
      if (!instId) return;
      if (pendingInstBookmarks[instId]) return;
      setPendingInstBookmarks((prev) => ({ ...prev, [instId]: true }));
      const existing = instBookmarkMap[instId];
      try {
        if (existing) {
          await apiService.deleteBookmark(existing);
          setInstBookmarkMap((prev) => {
            const n = { ...prev };
            delete n[instId];
            return n;
          });
          setSavedInstIds((prev) => prev.filter((id) => id !== instId));
          toast.success("Removed from bookmarks");
        } else {
          const res = await apiService.createBookmark(instId, "institutions");
          setInstBookmarkMap((prev) => ({ ...prev, [instId]: res.data.id }));
          setSavedInstIds((prev) => [...prev, instId]);
          toast.success("Added to bookmarks!");
        }
      } catch {
        toast.error("Failed to save bookmark");
      } finally {
        setPendingInstBookmarks((prev) => {
          const n = { ...prev };
          delete n[instId];
          return n;
        });
      }
      return;
    }

    if (pendingBookmarks[collegeId]) return;
    setPendingBookmarks((prev) => ({ ...prev, [collegeId]: true }));
    const existing = bookmarkMap[collegeId];
    try {
      if (existing) {
        await apiService.deleteBookmark(existing);
        setBookmarkMap((prev) => {
          const n = { ...prev };
          delete n[collegeId];
          return n;
        });
        setSavedColleges((prev) => prev.filter((id) => id !== collegeId));
        toast.success("Removed from bookmarks");
      } else {
        const res = await apiService.createBookmark(collegeId, "colleges");
        setBookmarkMap((prev) => ({ ...prev, [collegeId]: res.data.id }));
        setSavedColleges((prev) => [...prev, collegeId]);
        toast.success("Added to bookmarks!");
      }
    } catch {
      toast.error("Failed to save bookmark");
    } finally {
      setPendingBookmarks((prev) => {
        const n = { ...prev };
        delete n[collegeId];
        return n;
      });
    }
  };

  const toggleSelection = (collegeId: number) => {
    const isAdding = !selectedForInquiry.includes(collegeId);
    if (isAdding && selectedForInquiry.length >= 5) {
      alert("You can select up to 5 colleges for Quick Apply.");
      return;
    }
    if (isAdding) {
      setIsQuickInquiryMode(true);
    }
    setSelectedForInquiry((prev) =>
      prev.includes(collegeId)
        ? prev.filter((id) => id !== collegeId)
        : [...prev, collegeId],
    );
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

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    for (const collegeId of selectedForInquiry) {
      try {
        await fetch(`${API_BASE}/api/v1/institutions/${collegeId}/inquiry`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            subject: "Quick Apply Inquiry",
            content: inquiryMessage,
          }),
        });
      } catch {
        /* silently fail */
      }
    }
    setIsInquiryBulkSent(true);
    toast.success("Your inquiry has been sent to the selected colleges.");
  };

  const handleSingleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    try {
      await fetch(
        `${API_BASE}/api/v1/institutions/${collegeForInquiry?.id}/inquiry`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            subject: `Inquiry about ${collegeForInquiry?.name}`,
            content: inquiryMessageSingle,
          }),
        },
      );
    } catch {
      /* silently fail */
    }
    setIsInquirySingleSent(true);
    toast.success(`Inquiry for ${collegeForInquiry?.name} has been sent!`);
  };

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-semibold text-red-700">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        {/* Top Row: Count and Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
          <h1 className="text-base text-gray-900">
            Showing {showingFrom.toLocaleString()}-{showingTo.toLocaleString()}{" "}
            of {totalResults.toLocaleString()}{" "}
            <span className="font-bold">Colleges</span>
          </h1>
          <div className="relative w-full sm:w-95 flex items-center gap-2">
            <div className="relative flex-1">
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
                className="w-full rounded-md border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm transition-all placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-brand-blue"
              />
            </div>
            <button
              type="button"
              onClick={onMobileFilterClick}
              className="lg:hidden flex items-center justify-center gap-1.5 shrink-0 px-3 py-2.5 bg-white border border-gray-200 rounded-md text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal size={14} />
              Filters
            </button>
          </div>
        </div>

        {/* View on Map (mobile only, desktop has it in sidebar) */}
        <div className="lg:hidden mb-3">
          <Link
            href="/map"
            className="flex w-full items-center justify-center gap-2 rounded-md border border-black/20 px-4 py-3 text-gray-700 hover:text-brand-blue transition-all duration-200 text-[15px] font-medium"
          >
            <FaMap />
            <span>View on Map</span>
          </Link>
        </div>

        {/* Bottom Row: Select All and Quick Apply */}
        <div className="flex flex-row justify-between items-center gap-4 pt-2 pb-4">
          <label className="group flex cursor-pointer items-center gap-2.5">
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

          <div className="flex items-center gap-3">
            <span className="text-[13px] font-semibold text-slate-800">
              Quick Apply
            </span>
            <label className="group flex cursor-pointer items-center gap-2">
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
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex animate-pulse flex-col rounded-md border border-gray-200 bg-white p-4"
              >
                <div className="h-35 w-full rounded-md bg-gray-200" />
                <div className="mt-3 space-y-2.5">
                  <div className="h-5 w-3/4 rounded bg-gray-200" />
                  <div className="h-3 w-1/2 rounded bg-gray-100" />
                  <div className="h-3 w-2/3 rounded bg-gray-100" />
                  <div className="h-3 w-1/2 rounded bg-gray-100" />
                </div>
                <div className="mt-4 flex gap-2">
                  <div className="h-9 flex-1 rounded-md bg-gray-200" />
                  <div className="h-9 flex-1 rounded-md bg-gray-200" />
                  <div className="h-9 w-10 rounded-md bg-gray-200" />
                </div>
              </div>
            ))}
          </>
        )}

        {colleges.map((college: College, index: number) => {
          return (
            <React.Fragment key={college.id}>
              <ProgramCard
                college={college}
                isVerified={isCollegeVerified(college.verified)}
                isClaimed={!!college.claimed}
                isSaved={
                  typeof college.id === "number"
                    ? savedColleges.includes(college.id)
                    : savedInstIds.includes(
                        Number(String(college.id).replace("inst_", "")),
                      )
                }
                isBookmarkPending={
                  typeof college.id === "number"
                    ? !!pendingBookmarks[college.id]
                    : !!pendingInstBookmarks[
                        Number(String(college.id).replace("inst_", ""))
                      ]
                }
                isSelected={selectedForInquiry.includes(college.id)}
                isQuickInquiryMode={isQuickInquiryMode}
                onNavigate={onNavigate}
                onToggleSaved={() => toggleSavedCollege(college.id)}
                onToggleSelection={() => toggleSelection(college.id)}
                onClaim={() => setCollegeToClaim(college)}
                onSingleInquiry={() => {
                  setCollegeForInquiry(college);
                  setIsInquiryModalOpen(true);
                  setIsInquirySingleSent(false);
                  setInquiryMessageSingle("");
                }}
              />
              {/* {isAfter2Rows && (
                <div className="col-span-1 md:col-span-2 xl:col-span-3 w-full">
                  {adCycleIndex === 0 && <TrendingCollegesAd />}
                  {adCycleIndex === 1 && <RecommendationFeedback />}
                </div>
              )} */}
            </React.Fragment>
          );
        })}

        {!isLoading && colleges.length === 0 && (
          <div className="col-span-1 flex flex-col items-center justify-center py-20 px-4 md:col-span-2 xl:col-span-3">
            <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-6">
              <FolderOpen className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              No Colleges Found
            </h3>
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
            className="flex items-center gap-2 rounded-full bg-brand-blue px-5 py-2.5 text-[14px] font-semibold text-white  transition-colors hover:bg-brand-hover sm:px-6 sm:text-[15px]"
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
        onClick={() => {
          setIsModalOpen(false);
          setIsInquiryBulkSent(false);
        }}
      >
        <div
          className={`mx-4 flex max-h-[90vh] w-full max-w-lg flex-col rounded-[20px] bg-white shadow-2xl transition-transform duration-300 ${isModalOpen ? "scale-100" : "scale-95"}`}
          onClick={(e) => e.stopPropagation()}
        >
          {isInquiryBulkSent ? (
            <div className="text-center py-8 px-6">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 mx-auto">
                <i className="fa-solid fa-check text-green-600 text-2xl"></i>
              </div>
              <p className="text-gray-900 font-bold text-lg">
                Application Submitted!
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Your application has been sent to {selectedForInquiry.length}{" "}
                college(s). They will review and get back to you.
              </p>
              <div className="mt-6 flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsInquiryBulkSent(false);
                  }}
                  className="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => router.push("/user/dashboard?tab=message")}
                  className="rounded-md bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover transition-colors"
                >
                  <i className="fa-regular fa-message mr-1.5"></i>View in
                  Messages
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-5">
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <i className="fa-solid fa-paper-plane text-[20px] text-brand-blue"></i>
                  Quick Apply to Colleges
                </h3>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsInquiryBulkSent(false);
                  }}
                  className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                >
                  <i className="fa-solid fa-xmark text-[20px]"></i>
                </button>
              </div>
              <div className="overflow-y-auto px-6 py-5">
                <div className="mb-5 flex items-start gap-3 rounded-md border border-blue-100 bg-blue-50 p-3.5">
                  <i className="fa-solid fa-circle-info mt-0.5 shrink-0 text-[18px] text-blue-600"></i>
                  <p className="line-height-extra text-[13px] text-blue-800">
                    You are applying to{" "}
                    <span className="text-[14px] font-bold text-blue-700">
                      {selectedForInquiry.length}
                    </span>{" "}
                    selected college(s). They will review your application and
                    get back to you.
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
                      className="w-full resize-none rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-[14px] text-gray-800  transition-all focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      placeholder="E.g., What are the admission requirements, fee structures, and scholarship options for the upcoming intake?"
                    ></textarea>
                  </div>
                  <div className="mt-8 flex flex-col justify-end gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setIsInquiryBulkSent(false);
                      }}
                      className="w-full rounded-md border border-gray-200 bg-white px-5 py-2.5 text-[14px] font-bold text-gray-600 transition-colors hover:bg-gray-50 sm:w-auto"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-blue px-6 py-2.5 text-[14px] font-bold text-white shadow-[0_4px_12px_rgba(0,0,255,0.2)] transition-all hover:-translate-y-0.5 hover:bg-brand-hover sm:w-auto"
                    >
                      Submit Application
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>

      <ClaimCollegeModal
        college={collegeToClaim}
        onClose={() => setCollegeToClaim(null)}
      />

      {/* Single College Inquiry Modal */}
      <div
        className={`fixed inset-0 z-210 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isInquiryModalOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => {
          setIsInquiryModalOpen(false);
          setIsInquirySingleSent(false);
        }}
      >
        <div
          className={`mx-4 flex max-h-[90vh] w-full max-w-lg flex-col rounded-md bg-white transition-transform duration-300 ${isInquiryModalOpen ? "scale-100" : "scale-95"}`}
          onClick={(e) => e.stopPropagation()}
        >
          {isInquirySingleSent ? (
            <div className="text-center py-8 px-6">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 mx-auto">
                <i className="fa-solid fa-check text-green-600 text-2xl"></i>
              </div>
              <p className="text-gray-900 font-bold text-lg">Inquiry Sent!</p>
              <p className="text-sm text-gray-500 mt-1">
                Your inquiry for {collegeForInquiry?.name} has been sent. The
                institution will respond to your inquiry soon.
              </p>
              <div className="mt-6 flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setIsInquiryModalOpen(false);
                    setIsInquirySingleSent(false);
                    setInquiryMessageSingle("");
                    setCollegeForInquiry(null);
                  }}
                  className="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => router.push("/user/dashboard?tab=message")}
                  className="rounded-md bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover transition-colors"
                >
                  <i className="fa-regular fa-message mr-1.5"></i>View in
                  Messages
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-5">
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <i className="fa-solid fa-paper-plane text-[20px] text-brand-blue"></i>
                  Inquiry for {collegeForInquiry?.name}
                </h3>
                <button
                  onClick={() => {
                    setIsInquiryModalOpen(false);
                    setIsInquirySingleSent(false);
                  }}
                  className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                >
                  <i className="fa-solid fa-xmark text-[20px]"></i>
                </button>
              </div>
              <div className="overflow-y-auto px-6 py-5">
                <form onSubmit={handleSingleInquirySubmit}>
                  <div className="mb-5">
                    <label
                      htmlFor="inquiryMessageSingle"
                      className="mb-2 block text-[14px] font-bold text-gray-800"
                    >
                      Your Question / Message{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="inquiryMessageSingle"
                      required
                      rows={4}
                      value={inquiryMessageSingle}
                      onChange={(e) => setInquiryMessageSingle(e.target.value)}
                      className="w-full resize-none rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-[14px] text-gray-800 transition-all focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      placeholder="E.g., What are the admission requirements, fee structures, and scholarship options for the upcoming intake?"
                    ></textarea>
                  </div>
                  <div className="mt-8 flex flex-col justify-end gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => {
                        setIsInquiryModalOpen(false);
                        setIsInquirySingleSent(false);
                      }}
                      className="w-full rounded-md border border-gray-200 bg-white px-5 py-2.5 text-[14px] font-bold text-gray-600 transition-colors hover:bg-gray-50 sm:w-auto"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-blue px-6 py-2.5 text-[14px] font-bold text-white transition-all  hover:bg-brand-hover sm:w-auto"
                    >
                      Submit Inquiry
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export const ProgramCard: React.FC<{
  college: College;
  isVerified: boolean;
  isClaimed?: boolean;
  isSaved: boolean;
  isBookmarkPending?: boolean;
  isSelected: boolean;
  isQuickInquiryMode: boolean;
  onNavigate: (view: any, data?: any) => void;
  onToggleSaved: () => void;
  onToggleSelection: () => void;
  onClaim: () => void;
  onSingleInquiry: () => void;
}> = ({
  college,
  isVerified,
  isClaimed = false,
  isSaved,
  isBookmarkPending = false,
  isSelected,
  isQuickInquiryMode,
  onNavigate,
  onToggleSaved,
  onToggleSelection,
  onClaim,
  onSingleInquiry,
}) => {
  return (
    <div className="flex h-full cursor-pointer flex-col rounded-md border border-gray-200 bg-white p-4 transition-all duration-300 hover:border-blue-500/20 overflow-visible">
      <div
        onClick={() => onNavigate("collegeDetails", { id: college.id })}
        className="group relative h-35 shrink-0 overflow-hidden rounded-md"
      >
        {college.featured && (
          <div className="absolute top-3 left-3 z-10 rounded bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white ">
            Featured
          </div>
        )}
        {isVerified && college.image_url ? (
          <img
            src={getImageUrl(college.image_url)}
            alt={college.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-brand-blue"></div>
        )}
        {!isClaimed && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClaim();
            }}
            className="absolute bottom-2 left-2 z-10 rounded-md bg-black/65 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-black/75"
          >
            Is this your college?{" "}
            <span className="underline text-brand-blue">Claim now</span>
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
              <div className="absolute inset-0 rounded-md border border-slate-300 bg-white/90  backdrop-blur-sm transition-colors hover:border-slate-400 peer-checked:border-brand-blue peer-checked:bg-brand-blue"></div>
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

      <div className="flex flex-1 flex-col px-0 pt-3 overflow-visible">
        <div className="flex items-center gap-1.5 mb-2">
          <button
            type="button"
            onClick={() => onNavigate("collegeDetails", { id: college.id })}
            className="group/title relative truncate text-left text-[20px] font-bold text-slate-800 tracking-tight transition-colors hover:text-blue-600 line-clamp-2"
          >
            <span className="truncate block" title={college.name}>
              {college.name}
            </span>
            <span className="absolute bottom-full left-0 mb-2 invisible opacity-0 group-hover/title:visible group-hover/title:opacity-100 bg-gray-900 text-white text-[13px] font-medium py-1.5 px-3 rounded  whitespace-nowrap transition-all duration-200 z-50 pointer-events-none">
              {college.name}
              <span className="absolute top-full left-4 -mt-px border-[5px] border-transparent border-t-gray-900"></span>
            </span>
          </button>
          {isCollegeVerified(college.verified) && (
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
              className="group/location block min-w-0 truncate font-semibold text-slate-700 line-clamp-1"
              title={college.location || "Kathmandu"}
            >
              <span className="truncate block">
                {college.location || "Kathmandu"}
              </span>
              <span className="absolute bottom-full left-0 mb-2 invisible opacity-0 group-hover/location:visible group-hover/location:opacity-100 bg-gray-900 text-white text-[13px] font-medium py-1.5 px-3 rounded  whitespace-nowrap transition-all duration-200 z-50 pointer-events-none">
                {college.location || "Kathmandu"}
                <span className="absolute top-full left-4 -mt-px border-[5px] border-transparent border-t-gray-900"></span>
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2 text-[14px] text-gray-500 mb-2">
          <Award className="w-4.5 h-4.5 text-gray-400 shrink-0 mt-0.75" />
          <p
            className="group/affil leading-snug pr-4 font-semibold text-slate-700 line-clamp-1"
            title={college.affiliation || ""}
          >
            <span className="truncate block">{college.affiliation || ""}</span>
            {college.affiliation && (
              <span className="absolute bottom-full left-0 mb-2 invisible opacity-0 group-hover/affil:visible group-hover/affil:opacity-100 bg-gray-900 text-white text-[13px] font-medium py-1.5 px-3 rounded  whitespace-nowrap transition-all duration-200 z-50 pointer-events-none">
                {college.affiliation}
                <span className="absolute top-full left-4 -mt-px border-[5px] border-transparent border-t-gray-900"></span>
              </span>
            )}
          </p>
        </div>

        {college.featured && college.website && (
          <div className="flex items-center gap-2 text-[14px] text-gray-500 mb-3">
            <Globe className="w-4.5 h-4.5 text-gray-400 shrink-0" />
            <a
              href={college.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-brand-blue hover:underline font-medium truncate"
            >
              {college.website.replace(/^https?:\/\//, "")}
            </a>
          </div>
        )}

        <div className="mt-2 flex items-center gap-4 mb-3">
          <a
            href="#"
            className="interaction-btn text-[12px] font-medium text-brand-blue hover:text-blue-800 flex items-center transition-colors"
          >
            Admission
            <svg
              className="w-3 h-3 ml-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 17L17 7M7 7h10v10"
              />
            </svg>
          </a>
          <a
            href="#"
            className="interaction-btn text-[12px] font-medium text-brand-blue hover:text-blue-800 flex items-center transition-colors"
          >
            Courses & Fees
            <svg
              className="w-3 h-3 ml-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 17L17 7M7 7h10v10"
              />
            </svg>
          </a>
        </div>

        <div className="flex flex-col gap-3 mt-auto">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate("collegeDetails", { id: college.id });
              }}
              className="bg-brand-blue flex-1 flex items-center justify-center gap-1.5 border border-gray-200 hover:bg-brand-hover text-white font-medium py-2 px-2 rounded-md transition-colors text-[13px] cursor-pointer"
            >
              View Details
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSingleInquiry();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-slate-600 font-medium py-2 px-2 rounded-md transition-colors text-[13px] cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-gray-500" />
              Inquiry
            </button>

            <button
              type="button"
              disabled={isBookmarkPending}
              onClick={(e) => {
                e.stopPropagation();
                onToggleSaved();
              }}
              className={`w-10 flex items-center justify-center border rounded-md transition-colors shrink-0 ${
                isBookmarkPending
                  ? "border-gray-100 bg-gray-50 cursor-not-allowed"
                  : isSaved
                    ? "border-blue-200 bg-blue-50"
                    : "border-gray-200 hover:bg-gray-50"
              }`}
              title={isSaved ? "Remove Bookmark" : "Bookmark"}
            >
              {isBookmarkPending ? (
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              ) : (
                <Bookmark
                  className={`w-4 h-4 transition-all ${isSaved ? "text-[#0000ff] fill-[#0000ff]" : "text-gray-400"}`}
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeGrid;
