"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  SearchCollegeCard,
  SearchCourseCard,
  SearchEventAdapter,
  SearchScholarshipAdapter,
  SearchUniversityAdapter,
  SearchNewsCard,
  SearchBlogCard,
  SearchExamCard,
  SearchAdmissionCard,
  type SearchResult,
} from "@/components/search";
import useCourseBookmarks from "@/components/course-finder/useCourseBookmarks";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const ENTITY_TYPES = [
  { value: "all", label: "All" },
  { value: "college", label: "Colleges & Institutes" },
  { value: "course", label: "Courses" },
  { value: "university", label: "Universities" },
  { value: "scholarship", label: "Scholarships" },
  { value: "event", label: "Events" },
  { value: "news", label: "News" },
  { value: "blog", label: "Blogs" },
  { value: "exam", label: "Exams" },
  { value: "admission_page", label: "Admissions" },
] as const;

const SORT_OPTIONS: Record<string, string> = {
  Popular: "relevance",
  "Newest First": "created_at_desc",
  "Highest Rated": "rating_desc",
  "Title A-Z": "title_asc",
};

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface SearchResponse {
  success: boolean;
  message: string;
  data: {
    items: SearchResult[];
    meta: PaginationMeta;
    quality?: string;
    retrievalErrors?: string[];
    isVectorEnabled?: boolean;
  };
}

function SearchResultCard({
  item,
  savedCourseIds,
  pendingBookmarks,
  onToggleSaved,
}: {
  item: SearchResult;
  savedCourseIds: number[];
  pendingBookmarks: Record<number, boolean>;
  onToggleSaved: (courseId: number) => void;
}) {
  switch (item.type) {
    case "college": return <SearchCollegeCard item={item} />;
    case "institution": return <SearchCollegeCard item={item} />;
    case "course": return (
      <SearchCourseCard
        item={item}
        isSaved={savedCourseIds.includes(item.id)}
        isBookmarkPending={!!pendingBookmarks[item.id]}
        onToggleSaved={onToggleSaved}
      />
    );
    case "university": return <SearchUniversityAdapter item={item} />;
    case "scholarship": return <SearchScholarshipAdapter item={item} />;
    case "event": return <SearchEventAdapter item={item} />;
    case "news": return <SearchNewsCard item={item} />;
    case "blog": return <SearchBlogCard item={item} />;
    case "exam": return <SearchExamCard item={item} />;
    case "admission_page": return <SearchAdmissionCard item={item} />;
    default: return <SearchCollegeCard item={item} />;
  }
}

function SearchContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { savedCourseIds, pendingBookmarks, toggleSaved } = useCourseBookmarks();
  const q = params.get("q") || "";
  const pageParam = parseInt(params.get("page") || "1", 10);
  const sortParam = params.get("sort") || "relevance";
  const typeFilter = params.get("cat") || params.get("type") || "all";

  const [items, setItems] = useState<SearchResult[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: 20, total: 0, pages: 0 });
  const [currentSort, setCurrentSort] = useState(
    Object.keys(SORT_OPTIONS).find((k) => SORT_OPTIONS[k] === sortParam) || "Popular"
  );
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [searchQuality, setSearchQuality] = useState<string>("full");

  const currentPage = Math.min(Math.max(pageParam, 1), 5);
  const isInitialLoading = !hasLoaded && currentPage === 1;
  const isEmpty = hasLoaded && items.length === 0;
  const hasErrorState = error !== null;
  const loading = isInitialLoading;

  const filteredItems = items;

  const buildSearchUrl = useCallback(
    (page: number, sort: string) => {
      const params = new URLSearchParams();
      params.set("q", q);
      params.set("page", String(page));
      params.set("limit", "20");
      params.set("sort", sort);
      if (typeFilter !== "all") {
        params.set("cat", typeFilter);
      }
      return `${API_BASE_URL}/api/v1/search?${params.toString()}`;
    },
    [q, typeFilter]
  );

  useEffect(() => {
    if (!q) return;
    
    let cancelled = false;
    const fetchSearch = async () => {
      try {
        const sortValue = SORT_OPTIONS[currentSort] || "relevance";
        const url = buildSearchUrl(currentPage, sortValue);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const res = await fetch(url, { 
          credentials: "include",
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        
        const json: SearchResponse = await res.json();
        
        if (!cancelled) {
          if (!json.success) {
            throw new Error(json.message || "Search failed");
          }
          
          if (json.data.quality === "error") {
            setError("Search service temporarily unavailable. Please try again.");
            setItems([]);
            setMeta({ page: 1, limit: 20, total: 0, pages: 0 });
          } else if (json.data.quality === "degraded") {
            setError("Showing keyword-only results (vector search unavailable)");
            setItems(json.data.items || []);
            setMeta(json.data.meta);
            setSearchQuality("degraded");
          } else {
            setError(null);
            setItems(json.data.items || []);
            setMeta(json.data.meta);
            setSearchQuality(json.data.quality || "full");
          }
        }
      } catch (e) {
        if (!cancelled) {
          if (e instanceof Error && e.name === "AbortError") {
            setError("Search timed out (10s). Please try again.");
          } else {
            setError(e instanceof Error ? e.message : "Search failed. Please try again.");
          }
          console.error("Search fetch failed:", e);
          
          if (retryCount < 2) {
            setTimeout(() => setRetryCount(prev => prev + 1), 1000 * (retryCount + 1));
          }
        }
      } finally {
        if (!cancelled) setHasLoaded(true);
      }
    };
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasLoaded(false);
    fetchSearch();
    return () => { cancelled = true; };
  }, [q, currentPage, currentSort, buildSearchUrl, retryCount]);

  const navigateToPage = (page: number) => {
    const sp = new URLSearchParams();
    sp.set("q", q);
    sp.set("page", String(page));
    sp.set("sort", SORT_OPTIONS[currentSort] || "relevance");
    if (typeFilter !== "all") sp.set("cat", typeFilter);
    router.push(`/search?${sp.toString()}`);
  };

  const handleSortChange = (label: string) => {
    setCurrentSort(label);
    setIsSortOpen(false);
    const sp = new URLSearchParams();
    sp.set("q", q);
    sp.set("page", "1");
    sp.set("sort", SORT_OPTIONS[label] || "relevance");
    if (typeFilter !== "all") sp.set("cat", typeFilter);
    router.push(`/search?${sp.toString()}`);
  };

  const handleTypeFilter = (value: string) => {
    const sp = new URLSearchParams();
    sp.set("q", q);
    sp.set("page", "1");
    sp.set("sort", SORT_OPTIONS[currentSort] || "relevance");
    if (value !== "all") sp.set("type", value);
    router.push(`/search?${sp.toString()}`);
  };

  const sortPopoverItems = [
    { label: "Popular", icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" },
    { label: "Newest First", icon: "M3 6h18M3 12h18M3 18h18" },
    { label: "Highest Rated", icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" },
    { label: "Title A-Z", icon: "M3 6h18M3 12h18M3 18h18" },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-350 mx-auto w-full pt-8 px-8">
        <div className="flex flex-col w-full mt-8">
          <h1 className="text-[28px] font-bold text-[#0d0c22] mb-1">Search Results</h1>
          {q && <p className="text-[15px] text-[#6e6d7a] mb-6">Showing results for &quot;<span className="font-semibold text-gray-900">{q}</span>&quot;{meta.total > 0 && ` — ${meta.total} found`}</p>}

          <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar">
            {ENTITY_TYPES.map((et) => (
              <button key={et.value} onClick={() => handleTypeFilter(et.value)}
                className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${typeFilter === et.value ? "bg-[#0d0c22] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}>
                {et.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pb-2 mb-4">
            <div className="relative">
              <button onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-[14px] font-medium text-[#0d0c22] hover:border-gray-300 hover:shadow-sm transition-all bg-white">
                <span>{currentSort}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"></path></svg>
              </button>
              {isSortOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                  <div className="absolute left-0 top-full mt-2 w-48 rounded-xl border border-gray-100 bg-white py-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-20">
                    {sortPopoverItems.map((item) => (
                      <div key={item.label}
                        className={`px-4 py-2.5 text-[14px] hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-2 ${currentSort === item.label ? "text-blue-600 font-semibold" : "text-gray-700"}`}
                        onClick={() => handleSortChange(item.label)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d={item.icon}></path></svg>
                        {item.label}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <span className="text-[13px] text-gray-400">{loading ? "Searching..." : `${filteredItems.length} results`}</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
            </div>
          ) : hasErrorState ? (
            <div className="flex flex-col items-center justify-center w-full py-16">
              <h3 className="text-[26px] font-bold text-red-600 mb-3">Search Error</h3>
              <p className="text-[15px] text-gray-600 text-center max-w-md mb-8">
                {error}
              </p>
              <div className="flex gap-3 flex-wrap justify-center">
                <button onClick={() => { setError(null); setHasLoaded(false); }} className="px-6 py-3 bg-blue-600 text-white rounded-lg text-[14px] font-semibold hover:bg-blue-700 transition-colors">Retry Search</button>
                <button onClick={() => router.push("/search")} className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg text-[14px] font-semibold hover:bg-gray-300 transition-colors">Clear Search</button>
              </div>
            </div>
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center w-full py-16">
              <h3 className="text-[26px] font-bold text-gray-900 mb-3">No results found</h3>
              <p className="text-[15px] text-gray-600 text-center max-w-md mb-8">
                We couldn&apos;t find anything matching &quot;<span className="font-semibold text-gray-900">{q}</span>&quot;. Try different keywords.
              </p>
              {searchQuality === "degraded" && (
                <p className="text-[12px] text-gray-500 mb-4">Vector search unavailable - showing keyword results only</p>
              )}
              <div className="flex gap-3 flex-wrap justify-center">
                <button onClick={() => router.push("/search")} className="px-6 py-3 bg-blue-600 text-white rounded-lg text-[14px] font-semibold hover:bg-blue-700 transition-colors">Clear Search</button>
                <button onClick={() => router.push("/search?q=Colleges")} className="px-6 py-3 border border-gray-200 bg-white text-gray-700 rounded-lg text-[14px] font-semibold hover:bg-gray-50 transition-colors">Browse Colleges</button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full pb-10">
                {filteredItems.map((item, idx) => (
                  <SearchResultCard
                    key={`${item.type}-${item.id}-${idx}`}
                    item={item}
                    savedCourseIds={savedCourseIds}
                    pendingBookmarks={pendingBookmarks}
                    onToggleSaved={toggleSaved}
                  />
                ))}
              </div>
              {meta.pages > 1 && (
                <div className="flex items-center justify-center gap-2 py-8">
                  <button onClick={() => navigateToPage(currentPage - 1)} disabled={currentPage <= 1}
                    className="px-4 py-2 rounded-lg text-[14px] font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Previous</button>
                  {Array.from({ length: Math.min(meta.pages, 5) }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => navigateToPage(p)}
                      className={`w-10 h-10 rounded-lg text-[14px] font-medium transition-colors ${currentPage === p ? "bg-blue-600 text-white" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"}`}>{p}</button>
                  ))}
                  <button onClick={() => navigateToPage(currentPage + 1)} disabled={currentPage >= meta.pages || currentPage >= 5}
                    className="px-4 py-2 rounded-lg text-[14px] font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Next</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function SearchLoading() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-350 mx-auto w-full pt-32 px-8">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200 mb-4"></div>
          <div className="h-4 w-96 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchContent />
    </Suspense>
  );
}
