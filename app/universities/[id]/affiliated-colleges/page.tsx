"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import FilterSidebar from "@/components/find-college/FilterSidebar";
import { ProgramCard } from "@/components/find-college/CollegeGrid";
import { College } from "@/services/api";
import { universityApi } from "@/services/university.api";
import { useAuth } from "@/services/AuthContext";
import { isCollegeVerified, CollegeFilters, DEFAULT_COLLEGE_FILTERS } from "@/app/find-college/types";
import { SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import ClaimCollegeModal from "@/components/find-college/ClaimCollegeModal";

interface University {
  id: number;
  name: string;
  colleges_count: number;
}

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [universities, setUniversities] = useState<University[]>([]);
  const [selectedUniId, setSelectedUniId] = useState<number | null>(null);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CollegeFilters>(DEFAULT_COLLEGE_FILTERS);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [bookmarkMap, setBookmarkMap] = useState<Record<number, number>>({});
  const [pendingBookmarks, setPendingBookmarks] = useState<Record<number, boolean>>({});
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [quickInquiryMode, setQuickInquiryMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [collegeForInquiry, setCollegeForInquiry] = useState<College | null>(null);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [isInquirySent, setIsInquirySent] = useState(false);
  const [collegeToClaim, setCollegeToClaim] = useState<College | null>(null);
  const uniScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const PER_PAGE = 18;
  const { isAuthenticated } = useAuth();

  // Fetch universities list with actual affiliated counts
  useEffect(() => {
    (async () => {
      try {
        const payload = await universityApi.getUniversities();
        const unis = payload?.data?.universities ?? [];
        
        // Fetch actual affiliated counts for each university
        const unisWithCounts = await Promise.all(
          unis.map(async (u: any) => {
            try {
              const res = await universityApi.getAffiliatedColleges(u.id);
              const count = res?.data?.affiliated_colleges?.length ?? 0;
              return { id: u.id, name: u.name, colleges_count: count };
            } catch {
              return { id: u.id, name: u.name, colleges_count: 0 };
            }
          })
        );
        
        setUniversities(unisWithCounts);

        // Only set selected university if not already set
        if (!selectedUniId) {
          const universityId = Number(params.id);
          if (!isNaN(universityId)) {
            setSelectedUniId(universityId);
          } else if (unisWithCounts.length > 0) {
            setSelectedUniId(unisWithCounts[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch universities:", err);
      }
    })();
  }, [params.id]);

  // Fetch affiliated colleges when university changes
  useEffect(() => {
    if (!selectedUniId) return;
    (async () => {
      setLoading(true);
      try {
        const payload = await universityApi.getAffiliatedColleges(selectedUniId);
        const affiliated = payload?.data?.affiliated_colleges ?? [];
        setColleges(
          affiliated.map((c: any) => ({
            id: c.college_id || c.id,
            name: c.name,
            image_url: c.card_image_url || c.banner_url || c.image_url || c.logo_url,
            location: c.location,
            website: c.website,
            verified: c.verified ?? false,
            claimed: c.college_id > 0 || (c.claimed ?? false),
            affiliation: c.affiliation || "",
            type: c.type || "College",
            rating: c.rating || 0,
            reviews: c.reviews || 0,
            featured: c.featured ?? false,
          } as College)),
        );
      } catch (err) {
        console.error("Failed to fetch affiliated colleges:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedUniId]);

  // Fetch bookmarks
  useEffect(() => {
    if (!isAuthenticated) return;
    import("@/services/api").then(({ apiService }) => {
      apiService.getBookmarksByType("colleges").then((items: any[]) => {
        const ids: number[] = [];
        const map: Record<number, number> = {};
        items.forEach((item: any) => {
          ids.push(item.item_id);
          map[item.item_id] = item.id;
        });
        setSavedIds(ids);
        setBookmarkMap(map);
      });
    });
  }, [isAuthenticated]);

  // Apply filters
  const filteredColleges = useMemo(() => {
    return colleges.filter((college) => {
      if (filters.search) {
        const query = filters.search.toLowerCase();
        if (!college.name?.toLowerCase().includes(query) &&
            !college.location?.toLowerCase().includes(query) &&
            !college.affiliation?.toLowerCase().includes(query)) {
          return false;
        }
      }
      if (filters.type.length > 0) {
        if (!college.type || !filters.type.includes(college.type)) return false;
      }
      if (filters.academic.length > 0) {
        const collegeLevel = (college as any).level || "";
        if (!filters.academic.some((l: string) => collegeLevel.toLowerCase().includes(l.toLowerCase()))) return false;
      }
      return true;
    });
  }, [colleges, filters]);

  const paginatedColleges = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return filteredColleges.slice(start, start + PER_PAGE);
  }, [filteredColleges, currentPage]);

  const totalPages = Math.ceil(filteredColleges.length / PER_PAGE);

  const handleToggleSaved = async (collegeId: number) => {
    if (!isAuthenticated) return;
    setPendingBookmarks((prev) => ({ ...prev, [collegeId]: true }));
    try {
      const { apiService } = await import("@/services/api");
      if (savedIds.includes(collegeId)) {
        const bookmarkId = bookmarkMap[collegeId];
        if (bookmarkId) await apiService.deleteBookmark(bookmarkId);
        setSavedIds((prev) => prev.filter((id) => id !== collegeId));
      } else {
        const result = await apiService.createBookmark(collegeId, "colleges");
        setBookmarkMap((prev) => ({ ...prev, [collegeId]: result.data.id }));
        setSavedIds((prev) => [...prev, collegeId]);
      }
    } catch (err) {
      console.error("Bookmark error:", err);
    } finally {
      setPendingBookmarks((prev) => ({ ...prev, [collegeId]: false }));
    }
  };

  const handleNavigate = (view: string, data?: any) => {
    if (view === "collegeDetails" && data?.id) {
      router.push(`/find-college/${data.id}`);
    }
  };

  const handleSingleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
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
            content: inquiryMessage,
          }),
        },
      );
    } catch {
      /* silently fail */
    }
    setIsInquirySent(true);
  };

  const selectedUni = universities.find(u => u.id === selectedUniId);

  // Check scroll position for navigation arrows
  const checkScroll = () => {
    if (uniScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = uniScrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    const ref = uniScrollRef.current;
    if (ref) {
      ref.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (ref) ref.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [universities]);

  const scrollUniversities = (direction: "left" | "right") => {
    if (uniScrollRef.current) {
      const scrollAmount = 260;
      uniScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* University Cards Header */}
      <div className="mx-auto max-w-350 pt-8">
        <h2 className="text-[20px] mb-2 font-bold text-[#0f172a]">Affiliated Colleges</h2>
        <div className="bg-[#F2F6FE] rounded-xl p-6 relative">
          <div className="relative">
            {/* Left Arrow */}
            {canScrollLeft && (
              <button
                onClick={() => scrollUniversities("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors -ml-2"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            
            <div ref={uniScrollRef} className="flex gap-4 overflow-x-auto hide-scrollbar snap-x pb-2">
              {universities.map((uni) => (
                <button
                  key={uni.id}
                  onClick={() => setSelectedUniId(uni.id)}
                  className={`snap-start shrink-0 w-60 h-31 rounded-xl p-5 cursor-pointer border-2 transition-all duration-200 flex flex-col justify-between ${
                    selectedUniId === uni.id
                      ? "border-[#2563eb] bg-white"
                      : "border-transparent bg-white"
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <h3 className="text-[14px] font-bold text-[#0f172a] leading-[1.3] tracking-tight pr-2">{uni.name}</h3>
                    {selectedUniId === uni.id && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[22px] h-[22px] text-[#2563eb] flex-shrink-0 mt-0.5">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="text-[#2563eb] text-[14px] font-medium flex items-center mt-3">
                    {uni.colleges_count} colleges
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5 ml-1.5 mt-[2px]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>

            {/* Right Arrow */}
            {canScrollRight && (
              <button
                onClick={() => scrollUniversities("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors -mr-2"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-350 mt-6 flex flex-col lg:flex-row gap-8 bg-white">
        {/* Left Sidebar - Filters */}
        <aside className="hidden lg:block w-full shrink-0 lg:w-[280px]">
          <FilterSidebar filters={filters} setFilters={setFilters} />
        </aside>

        {/* Mobile filter drawer */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setShowMobileFilters(false)}>
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute bottom-0 left-0 right-0 max-h-[70vh] bg-white rounded-t-2xl shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <FilterSidebar filters={filters} setFilters={setFilters} onClose={() => setShowMobileFilters(false)} />
            </div>
          </div>
        )}

        {/* Right Content */}
        <section className="flex-1 w-full min-w-0">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
              <h2 className="text-[15px] font-semibold text-gray-800">
                Showing <span className="text-blue-600 font-bold">{filteredColleges.length}</span> {selectedUni?.name || "university"} affiliated colleges
              </h2>
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Search colleges..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-200 focus:outline-none focus:border-blue-500 text-sm bg-white"
                />
                <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </div>
            {/* Mobile filter button */}
            <button onClick={() => setShowMobileFilters(true)} className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-md text-[13px] font-semibold text-gray-700 hover:bg-gray-50">
              <SlidersHorizontal size={14} /> Filters
            </button>
          </div>

          {/* College Cards */}
          {loading ? (
            <div className="text-center py-16 text-gray-400">Loading...</div>
          ) : filteredColleges.length === 0 ? (
            <div className="text-center py-16 text-gray-400">No affiliated colleges found.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {paginatedColleges.map((college) => (
                  <ProgramCard
                    key={college.id}
                    college={college}
                    isVerified={isCollegeVerified(college.verified)}
                    isClaimed={!!college.claimed}
                    isSaved={savedIds.includes(college.id)}
                    isBookmarkPending={pendingBookmarks[college.id]}
                    isSelected={selectedIds.includes(college.id)}
                    isQuickInquiryMode={quickInquiryMode}
                    onNavigate={handleNavigate}
                    onToggleSaved={() => handleToggleSaved(college.id)}
                    onToggleSelection={() => {
                      setSelectedIds((prev) =>
                        prev.includes(college.id) ? prev.filter((id) => id !== college.id) : [...prev, college.id]
                      );
                    }}
                    onClaim={() => setCollegeToClaim(college)}
                    onSingleInquiry={() => {
                      setCollegeForInquiry(college);
                      setIsInquiryModalOpen(true);
                      setIsInquirySent(false);
                      setInquiryMessage("");
                    }}
                  />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </section>
      </div>

      {/* Single College Inquiry Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isInquiryModalOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => {
          setIsInquiryModalOpen(false);
          setIsInquirySent(false);
        }}
      >
        <div
          className={`mx-4 flex max-h-[90vh] w-full max-w-lg flex-col rounded-md bg-white transition-transform duration-300 ${isInquiryModalOpen ? "scale-100" : "scale-95"}`}
          onClick={(e) => e.stopPropagation()}
        >
          {isInquirySent ? (
            <div className="text-center py-8 px-6">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 mx-auto">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
              <p className="text-gray-900 font-bold text-lg">Inquiry Sent!</p>
              <p className="text-sm text-gray-500 mt-1">
                Your inquiry for {collegeForInquiry?.name} has been sent.
              </p>
              <div className="mt-6 flex gap-3 justify-center">
                <button
                  onClick={() => { setIsInquiryModalOpen(false); setIsInquirySent(false); setInquiryMessage(""); }}
                  className="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-5">
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  Inquiry for {collegeForInquiry?.name}
                </h3>
                <button
                  onClick={() => { setIsInquiryModalOpen(false); setIsInquirySent(false); setInquiryMessage(""); }}
                  className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="overflow-y-auto px-6 py-5">
                <form onSubmit={handleSingleInquirySubmit}>
                  <div className="mb-5">
                    <label className="mb-2 block text-[14px] font-bold text-gray-800">
                      Your Question / Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={inquiryMessage}
                      onChange={(e) => setInquiryMessage(e.target.value)}
                      className="w-full resize-none rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-[14px] text-gray-800 transition-all focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="E.g., What are the admission requirements, fee structures, and scholarship options?"
                    ></textarea>
                  </div>
                  <div className="mt-8 flex flex-col justify-end gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => { setIsInquiryModalOpen(false); setIsInquirySent(false); setInquiryMessage(""); }}
                      className="w-full rounded-md border border-gray-200 bg-white px-5 py-2.5 text-[14px] font-bold text-gray-600 transition-colors hover:bg-gray-50 sm:w-auto"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 text-[14px] font-bold text-white transition-all hover:bg-blue-700 sm:w-auto"
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

      <ClaimCollegeModal
        college={collegeToClaim}
        onClose={() => setCollegeToClaim(null)}
      />
    </div>
  );
}
