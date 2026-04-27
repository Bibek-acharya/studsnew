"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface SearchItem {
  id: number;
  type: string;
  title: string;
  description: string;
  image: string;
  featured: boolean;
  verified: boolean;
  rating: number;
  institutionType: string;
  location: string;
  university: string;
  website: string;
  slug: string;
  tags: string[];
}

interface SearchCategory {
  title: string;
  description: string;
  related: string[];
  tabs: string[];
  key: string;
}

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
    items: SearchItem[];
    category: SearchCategory | null;
    categoryKey: string;
    meta: PaginationMeta;
  };
}

function SearchContent() {
  const params = useSearchParams();
  const router = useRouter();
  const q = params.get("q") || "";
  const catParam = params.get("cat") || "";

  const [items, setItems] = useState<SearchItem[]>([]);
  const [category, setCategory] = useState<SearchCategory | null>(null);
  const [categoryKey, setCategoryKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState("all");
  const [currentSort, setCurrentSort] = useState("Popular");
  const [isPopularOpen, setIsPopularOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    locations: [] as string[],
    types: [] as string[],
    rating: "any",
    universities: [] as string[],
  });

  useEffect(() => {
    setLoading(true);
    const fetchSearch = async () => {
      try {
        const url = `${API_BASE_URL}/api/v1/search?q=${encodeURIComponent(q)}&cat=${encodeURIComponent(catParam)}&limit=50`;
        const res = await fetch(url, { credentials: "include" });
        const json: SearchResponse = await res.json();
        if (json.success) {
          const data = json.data;
          setItems(data.items || []);
          const cat = data.category;
          setCategory(cat);
          setCategoryKey(data.categoryKey);
          if (cat && cat.tabs && cat.tabs.length > 0) {
            setCurrentCategory(cat.tabs[0].toLowerCase());
          }
        }
      } catch (e) {
        console.error("Search fetch failed:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchSearch();
  }, [q, catParam]);

  const activeFiltersCount =
    activeFilters.locations.length +
    activeFilters.types.length +
    (activeFilters.rating !== "any" ? 1 : 0) +
    activeFilters.universities.length;

  const popoverItems = [
    { label: "Popular", icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" },
    { label: "Newest First", icon: "M3 6h18M3 12h18M3 18h18" },
    { label: "Oldest First", icon: "M3 6h18M3 12h18M3 18h18" },
    { label: "Highest Rated", icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" },
    { label: "Lowest Fees", icon: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" },
    { label: "Highest Fees", icon: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" },
    { label: "Most Reviews", icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" },
  ];

  const isNoResults = !loading && items.length === 0 && category === null;

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg key={i} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={i < Math.floor(rating) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      );
    }
    return stars;
  };

  const renderCollegeCard = (item: SearchItem, idx: number) => (
    <div key={idx} className="border border-gray-200 rounded-xl bg-white p-3.5 flex flex-col hover:shadow-md transition-shadow">
      <div className="relative w-full h-36 rounded-lg overflow-hidden mb-3">
        <img src={item.image || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80"} alt={item.title} className="w-full h-full object-cover" />
        {item.featured && (
          <span className="absolute top-3 left-3 bg-[#1d4ed8] text-white text-[11px] font-bold px-2 py-1 rounded uppercase tracking-wide">
            Featured
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5 mb-2">
        <h3 className="text-[17px] font-bold text-gray-900 truncate">{item.title}</h3>
        {item.verified && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#1d4ed8"/>
            <path d="M7.5 12L10.5 15L16.5 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>

      {item.rating > 0 && (
        <div className="flex items-center text-[13px] text-gray-600 mb-2.5 gap-2">
          <div className="flex items-center gap-1 text-[#f59e0b]">
            {renderStars(item.rating)}
            <span className="text-gray-800 font-semibold ml-1">{item.rating}</span>
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>{item.institutionType}</span>
          </div>
          {item.location && (
            <>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{item.location}</span>
              </div>
            </>
          )}
        </div>
      )}

      {item.university && (
        <div className="flex items-center text-[13px] text-gray-600 mb-2 gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="7"></circle>
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
          </svg>
          <span>{item.university}</span>
        </div>
      )}

      {item.website && (
        <div className="flex items-center text-[13px] mb-3 gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
          <a href="#" className="text-[#1d4ed8] font-medium hover:underline">{item.website}</a>
        </div>
      )}

      {item.university && (
        <div className="flex items-center gap-5 text-[13px] font-medium text-[#1d4ed8] mb-3">
          <a href="#" className="flex items-center gap-1 hover:underline">
            Admission
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </a>
          <a href="#" className="flex items-center gap-1 hover:underline">
            Courses & Fees
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </a>
        </div>
      )}

      {(item.university || item.website) && (
        <hr className="border-t border-dashed border-gray-200 mb-3" />
      )}

      <div className="flex items-center gap-2 mt-auto">
        <button
          onClick={() => router.push(`/${item.type === "college" ? "find-college" : item.type}/${item.slug || item.id}`)}
          className="flex-1 bg-[#0000ff] text-white py-2 rounded-lg text-[14px] font-medium hover:bg-[#0000cc] transition-colors"
        >
          View Details
        </button>
        <button className="flex items-center justify-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 text-[14px] font-medium hover:bg-gray-50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          Inquiry
        </button>
        <button className="px-3 py-2 border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto w-full pt-8 px-8">
        <div className="flex flex-col items-center w-full mt-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
            </div>
          ) : isNoResults ? (
            <div className="flex flex-col items-center justify-center w-full py-16">
              <div className="w-32 h-32 mb-6 flex items-center justify-center">
                <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                  <circle cx="50" cy="50" r="45" fill="#f1f5f9"/>
                  <circle cx="45" cy="45" r="20" fill="none" stroke="#94a3b8" strokeWidth="4"/>
                  <line x1="60" y1="60" x2="75" y2="75" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/>
                  <line x1="38" y1="38" x2="52" y2="52" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/>
                  <line x1="52" y1="38" x2="38" y2="52" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-[26px] font-bold text-gray-900 mb-3">No results found</h3>
              <p className="text-[15px] text-gray-600 text-center max-w-md mb-8">
                We couldn&apos;t find anything matching &quot;<span className="font-semibold text-gray-900">{q}</span>&quot;. Try different keywords or browse our categories.
              </p>
              <div className="flex gap-3 flex-wrap justify-center">
                <button
                  onClick={() => router.push("/search")}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg text-[14px] font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  Clear Search
                </button>
                <button
                  onClick={() => router.push("/search?q=Colleges&cat=colleges")}
                  className="px-6 py-3 border border-gray-200 bg-white text-gray-700 rounded-lg text-[14px] font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                  Browse Categories
                </button>
              </div>
              <div className="mt-10 text-center">
                <p className="text-[14px] text-gray-500 mb-4 font-medium">Popular searches:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["Engineering Colleges", "Medical Courses", "Scholarships 2026", "Entrance Exams"].map((s) => (
                    <button
                      key={s}
                      onClick={() => router.push(`/search?q=${encodeURIComponent(s)}`)}
                      className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full text-[13px] font-medium transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-[32px] font-bold text-[#0d0c22] mb-3">{category?.title || "Search Results"}</h1>
              <p className="text-[15px] text-[#6e6d7a] mb-5">{category?.description || ""}</p>

              {category?.related && category.related.length > 0 && (
                <div className="flex items-center gap-3 text-[14px] text-[#6e6d7a] mb-12">
                  <span>Related:</span>
                  <div className="flex gap-4 flex-wrap">
                    {category.related.map((tag: string) => (
                      <button
                        key={tag}
                        onClick={() => router.push(`/search?q=${encodeURIComponent(tag)}&cat=${categoryKey}`)}
                        className="hover:text-gray-900 transition-colors capitalize"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="w-full flex items-center justify-between pb-2 mt-2">
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsPopularOpen(!isPopularOpen); }}
                    className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-[14px] font-medium text-[#0d0c22] hover:border-gray-300 hover:shadow-sm transition-all bg-white shrink-0"
                  >
                    <span>{currentSort}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6"></path>
                    </svg>
                  </button>

                  {isPopularOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsPopularOpen(false)} />
                      <div className="absolute left-0 top-full mt-2 w-48 rounded-xl border border-gray-100 bg-white py-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-20">
                        {popoverItems.map((item) => (
                          <div
                            key={item.label}
                            className="px-4 py-2.5 text-[14px] text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-2"
                            onClick={() => { setCurrentSort(item.label); setIsPopularOpen(false); }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                              <path d={item.icon}></path>
                            </svg>
                            {item.label}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {category?.tabs && category.tabs.length > 0 && (
                  <div className="flex items-center gap-1 overflow-x-auto mx-4 no-scrollbar w-full justify-center">
                    {category.tabs.map((cat: string, idx: number) => {
                      const isActiveTab = currentCategory === cat.toLowerCase();
                      const badgeNumber = cat === "Engineering" ? "1" : cat === "Medical" ? "2" : null;
                      return (
                        <button
                          key={cat}
                          onClick={() => setCurrentCategory(cat.toLowerCase())}
                          className={`px-5 py-2.5 rounded-full text-[14px] font-medium whitespace-nowrap transition-colors ${
                            isActiveTab
                              ? "bg-gray-100 text-[#0d0c22]"
                              : "text-[#6e6d7a] hover:text-[#0d0c22] hover:bg-gray-50"
                          } ${badgeNumber ? "relative" : ""}`}
                        >
                          {cat}
                          {badgeNumber && (
                            <span className="absolute top-0 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0000ff] text-[10px] font-bold text-white shadow-sm">
                              {badgeNumber}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                <button
                  onClick={() => setIsFiltersOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-full text-[14px] font-medium text-[#0d0c22] hover:border-gray-300 hover:shadow-sm transition-all bg-white shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="21" y1="4" x2="14" y2="4"></line>
                    <line x1="10" y1="4" x2="3" y2="4"></line>
                    <line x1="21" y1="12" x2="12" y2="12"></line>
                    <line x1="8" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="20" x2="16" y2="20"></line>
                    <line x1="12" y1="20" x2="3" y2="20"></line>
                    <line x1="14" y1="2" x2="14" y2="6"></line>
                    <line x1="8" y1="10" x2="8" y2="14"></line>
                    <line x1="16" y1="18" x2="16" y2="22"></line>
                  </svg>
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8 w-full pb-20">
                {items.length === 0 ? (
                  <div className="col-span-full text-center py-16 text-gray-500">
                    No items found in this category.
                  </div>
                ) : (
                  items.map((item, idx) => renderCollegeCard(item, idx))
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {isFiltersOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={() => setIsFiltersOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-[18px] font-bold text-gray-900">Filters</h2>
                <button onClick={() => setIsFiltersOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <h3 className="text-[14px] font-bold text-gray-900 mb-3">Location</h3>
                  <div className="space-y-2">
                    {["Kathmandu", "Pokhara", "Chitwan", "Butwal", "Biratnagar"].map((loc) => (
                      <label key={loc} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          checked={activeFilters.locations.includes(loc.toLowerCase())}
                          onChange={(e) => setActiveFilters((prev) => ({
                            ...prev, locations: e.target.checked ? [...prev.locations, loc.toLowerCase()] : prev.locations.filter((l) => l !== loc.toLowerCase()),
                          }))} />
                        <span className="text-[14px] text-gray-700">{loc}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-gray-900 mb-3">Institution Type</h3>
                  <div className="space-y-2">
                    {[{ value: "public", label: "Public/Government" }, { value: "private", label: "Private" }].map((type) => (
                      <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          checked={activeFilters.types.includes(type.value)}
                          onChange={(e) => setActiveFilters((prev) => ({
                            ...prev, types: e.target.checked ? [...prev.types, type.value] : prev.types.filter((t) => t !== type.value),
                          }))} />
                        <span className="text-[14px] text-gray-700">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-gray-900 mb-3">Minimum Rating</h3>
                  <div className="space-y-2">
                    {[{ value: "any", label: "Any Rating" }, { value: "4", label: "4+ Stars" }, { value: "3", label: "3+ Stars" }].map((rating) => (
                      <label key={rating.value} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="rating" className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          checked={activeFilters.rating === rating.value}
                          onChange={() => setActiveFilters((prev) => ({ ...prev, rating: rating.value }))} />
                        <span className="text-[14px] text-gray-700">{rating.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-gray-900 mb-3">Affiliated University</h3>
                  <div className="space-y-2">
                    {[{ value: "tu", label: "Tribhuvan University" }, { value: "pu", label: "Pokhara University" }, { value: "ku", label: "Kathmandu University" }, { value: "pu-open", label: "Purbanchal University" }].map((uni) => (
                      <label key={uni.value} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          checked={activeFilters.universities.includes(uni.value)}
                          onChange={(e) => setActiveFilters((prev) => ({
                            ...prev, universities: e.target.checked ? [...prev.universities, uni.value] : prev.universities.filter((u) => u !== uni.value),
                          }))} />
                        <span className="text-[14px] text-gray-700">{uni.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between gap-3">
                <button onClick={() => setActiveFilters({ locations: [], types: [], rating: "any", universities: [] })}
                  className="px-4 py-2.5 text-[14px] font-medium text-gray-600 hover:text-gray-900 transition-colors">Clear All</button>
                <button onClick={() => setIsFiltersOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-[14px] font-medium hover:bg-blue-700 transition-colors">Show Results</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function SearchLoading() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto w-full pt-32 px-8">
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
