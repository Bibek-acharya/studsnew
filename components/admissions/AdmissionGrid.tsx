"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FolderOpen, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { AdmissionFilters } from "@/app/admissions/[level]/types";
import CollegeCard from "@/components/admissions/CollegeCard";
import FeaturedAdmissionAd from "@/components/admissions/FeaturedAdmissionAd";
import DirectAdmissionAd from "@/components/admissions/DirectAdmissionAd";
import Pagination from "@/components/ui/Pagination";
import {
  admissionService,
  AdmissionCollegeItem,
} from "@/services/admission.api";
import { apiService } from "@/services/api";
import { useAuth } from "@/services/AuthContext";
import {
  sampleFeaturedColleges,
  sampleDirectAdmissions,
  levelConfig,
} from "./data";

interface AdmissionGridProps {
  filters: AdmissionFilters;
  setFilters: React.Dispatch<React.SetStateAction<AdmissionFilters>>;
  onNavigate: (view: string, data?: any) => void;
  level: string;
  onMobileFilterClick?: () => void;
}

const COLLEGES_PER_PAGE = 18;

function extractHeroBanners(college: AdmissionCollegeItem): string[] {
  const raw = college.hero_banner;

  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
  } catch {
    // single URL string
  }
  return [raw];
}

const AdmissionGrid: React.FC<AdmissionGridProps> = ({
  filters,
  setFilters,
  onNavigate,
  level,
  onMobileFilterClick,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [colleges, setColleges] = useState<AdmissionCollegeItem[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: COLLEGES_PER_PAGE,
    total: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [bookmarkMap, setBookmarkMap] = useState<Record<number, number>>({});
  const [pendingBookmarks, setPendingBookmarks] = useState<
    Record<number, boolean>
  >({});

  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [inquiryCollege, setInquiryCollege] =
    useState<AdmissionCollegeItem | null>(null);
  const [askName, setAskName] = useState("");
  const [askEmail, setAskEmail] = useState("");
  const [askPhone, setAskPhone] = useState("");
  const [askMessage, setAskMessage] = useState("");
  const [askSending, setAskSending] = useState(false);
  const [askSent, setAskSent] = useState(false);
  const [askTouched, setAskTouched] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const askErrors = useMemo(
    () => ({
      name:
        askName && askName.trim().length < 2
          ? "Name must be at least 2 characters"
          : "",
      email:
        askEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(askEmail)
          ? "Enter a valid email"
          : "",
      phone:
        askPhone && !/^9\d{9}$/.test(askPhone)
          ? "Must be 10 digits starting with 9"
          : "",
    }),
    [askName, askEmail, askPhone],
  );

  const askValid =
    askName.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(askEmail) &&
    (!askPhone || /^9\d{9}$/.test(askPhone)) &&
    askMessage.trim().length > 0;

  const handleAskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryCollege || !isAuthenticated) return;
    setAskSending(true);
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const subject = `Question about ${inquiryCollege.name}`;
      const content = `Name: ${askName}\nEmail: ${askEmail}\nPhone: ${askPhone ? "+977" + askPhone : "Not provided"}\n\n${askMessage}`;
      await fetch(
        `${API_BASE}/api/v1/institutions/${inquiryCollege.id}/inquiry`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ subject, content }),
        },
      );
      setAskSent(true);
    } catch {
      /* silently fail */
    } finally {
      setAskSending(false);
    }
  };

  const openInquiry = (college: AdmissionCollegeItem) => {
    setInquiryCollege(college);
    setAskName("");
    setAskEmail("");
    setAskPhone("");
    setAskMessage("");
    setAskSent(false);
    setAskTouched(false);
  };

  const closeInquiry = () => {
    setInquiryCollege(null);
    setAskSent(false);
  };

  const toggleSavedCollege = async (collegeId: number) => {
    if (!isAuthenticated) {
      toast.error("Please login to save bookmarks");
      return;
    }
    if (pendingBookmarks[collegeId]) return;
    setPendingBookmarks((prev) => ({ ...prev, [collegeId]: true }));
    const existingBookmarkId = bookmarkMap[collegeId];
    try {
      if (existingBookmarkId) {
        await apiService.deleteBookmark(existingBookmarkId);
        setBookmarkMap((prev) => {
          const next = { ...prev };
          delete next[collegeId];
          return next;
        });
        setSavedIds((prev) => prev.filter((id) => id !== collegeId));
        toast.success("Removed from bookmarks");
      } else {
        const res = await apiService.createBookmark(collegeId, "admissions");
        setBookmarkMap((prev) => ({ ...prev, [collegeId]: res.data.id }));
        setSavedIds((prev) => [...prev, collegeId]);
        toast.success("Added to bookmarks!");
      }
    } catch {
      toast.error("Failed to save bookmark");
    } finally {
      setPendingBookmarks((prev) => {
        const next = { ...prev };
        delete next[collegeId];
        return next;
      });
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    apiService
      .getBookmarksByType("admissions")
      .then((items) => {
        const ids: number[] = [];
        const map: Record<number, number> = {};
        items.forEach((b) => {
          ids.push(b.item_id);
          map[b.item_id] = b.id;
        });
        setSavedIds(ids);
        setBookmarkMap(map);
      })
      .catch(() => {});
  }, [isAuthenticated]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, level]);

  useEffect(() => {
    const fetchColleges = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const response = await admissionService.getPublishedAdmissionColleges(
          level,
          currentPage,
          COLLEGES_PER_PAGE,
          {
            search: filters.search,
            province: filters.province,
            district: filters.district,
            local: filters.local,
            type: filters.type,
            sortBy: filters.sortBy,
          },
        );

        setColleges(response.data.colleges);
        setPagination(response.data.pagination);
      } catch (error) {
        setFetchError(
          error instanceof Error
            ? error.message
            : "Failed to load admission colleges",
        );
        setColleges([]);
        setPagination({
          page: 1,
          pageSize: COLLEGES_PER_PAGE,
          total: 0,
          totalPages: 1,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchColleges();
  }, [filters, level, currentPage]);

  const filteredFeatured = useMemo(() => {
    let results = [...sampleFeaturedColleges];

    if (filters.province.length > 0) {
      results = results.filter((c) =>
        filters.province.some((p) =>
          c.location
            .toLowerCase()
            .includes(p.replace("prov_", "").toLowerCase()),
        ),
      );
    }

    if (filters.type.length > 0) {
      const typeMap: Record<string, string> = {
        ct_private: "Private",
        ct_public: "Public",
        ct_community: "Community",
      };
      const allowedTypes = filters.type.map((t) => typeMap[t]).filter(Boolean);
      if (allowedTypes.length > 0) {
        results = results.filter((c) => allowedTypes.includes(c.type));
      }
    }

    return results;
  }, [filters]);

  const totalResults = pagination.total;
  const totalPages = Math.max(1, pagination.totalPages);
  const showingFrom =
    totalResults === 0 ? 0 : (pagination.page - 1) * pagination.pageSize + 1;
  const showingTo = Math.min(
    pagination.page * pagination.pageSize,
    totalResults,
  );

  const getAdType = (index: number) => {
    if (index === 5) return "featured";
    if (index === 11) return "direct";
    if (
      pagination.page === 1 &&
      colleges.length < 6 &&
      index === colleges.length - 1
    ) {
      return "featured";
    }
    return null;
  };

  const config = levelConfig[level] ||
    levelConfig["high-school"] || {
      title: "Colleges",
      subtitle: "",
      badge: "",
    };

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  };

  return (
    <>
      <div className="mb-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-col justify-start">
            <h1 className="mb-3 text-base text-gray-900">
              Showing {showingFrom.toLocaleString()}-
              {showingTo.toLocaleString()} of {totalResults.toLocaleString()}{" "}
              <span className="font-bold">{config.title}</span>
            </h1>
            {fetchError && <p className="text-sm text-red-600">{fetchError}</p>}
          </div>

          <div className="mt-2 flex w-full shrink-0 flex-row items-center gap-2 sm:mt-0 sm:w-[320px] sm:items-end">
            <div className="relative flex-1">
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400"></i>
              <input
                type="text"
                value={filters.search}
                onChange={(event) => handleSearchChange(event.target.value)}
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
      </div>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
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
          ) : colleges.length === 0 ? (
            <div className="col-span-1 flex flex-col items-center justify-center py-20 px-4 md:col-span-2 xl:col-span-3">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-50">
                <FolderOpen className="h-36 w-36 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                No Colleges Found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                No colleges match your current filters. Try adjusting your
                search criteria.
              </p>
            </div>
          ) : (
            colleges.map((college, index) => {
              const adType = getAdType(index);
              return (
                <React.Fragment key={college.id}>
                  <CollegeCard
                    images={(() => {
                      const banners = extractHeroBanners(college);
                      if (banners.length > 0) return banners;
                      return college.image_url
                        ? [college.image_url]
                        : ["/images/college-placeholder.png"];
                    })()}
                    cardImage={college.card_image}
                    collegeName={college.name}
                    rating={college.rating ?? 4.0}
                    type={college.type || "College"}
                    location={college.location}
                    website={college.website || college.affiliation}
                    programs={
                      Array.isArray(college.featured_programs)
                        ? (college.featured_programs as any[]).map((p) => {
                            const name = p.title || "";
                            const rawStatus = p.admissionStatus || "";
                            const statusMap: Record<
                              string,
                              "Upcoming" | "Ongoing" | "Closed"
                            > = {
                              "opening-soon": "Upcoming",
                              ongoing: "Ongoing",
                              "limited-seats": "Closed",
                              "seats-available": "Ongoing",
                              closed: "Closed",
                            };
                            return {
                              name,
                              status: statusMap[rawStatus] || "Ongoing",
                            };
                          })
                        : [
                            {
                              name:
                                college.affiliation ||
                                college.name ||
                                "Admission Open",
                              status: "Ongoing" as const,
                            },
                          ]
                    }
                    collegeId={college.id}
                    isSaved={savedIds.includes(college.id)}
                    isBookmarkPending={!!pendingBookmarks[college.id]}
                    onToggleSaved={() => toggleSavedCollege(college.id)}
                    onCollegeNameClick={() =>
                      onNavigate("collegeDetails", { id: college.id })
                    }
                    onCourseClick={(courseName) =>
                      onNavigate("admissionDetails", {
                        id: college.admission_page_id || college.id,
                        scrollTo: "programs",
                      })
                    }
                    onNavigate={() =>
                      onNavigate("collegeDetails", { id: college.id })
                    }
                    onApply={() =>
                      onNavigate("admissionDetails", { id: college.admission_page_id || college.id })
                    }
                    onAskQuestion={() => openInquiry(college)}
                  />

                  {adType === "featured" && filteredFeatured.length > 0 && (
                    <FeaturedAdmissionAd colleges={filteredFeatured} />
                  )}

                  {adType === "direct" && sampleDirectAdmissions.length > 0 && (
                    <DirectAdmissionAd colleges={sampleDirectAdmissions} />
                  )}
                </React.Fragment>
              );
            })
          )}
        </div>
      </section>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {inquiryCollege && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closeInquiry}
        >
          <div
            className="mx-4 w-full max-w-lg rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                Inquiry — {inquiryCollege.name}
              </h3>
              <button
                onClick={closeInquiry}
                className="p-1 rounded-lg hover:bg-gray-100"
              >
                <i className="fa-solid fa-xmark text-gray-500"></i>
              </button>
            </div>
            {askSent ? (
              <div className="text-center py-8 px-6">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 mx-auto">
                  <i className="fa-solid fa-check text-green-600 text-2xl"></i>
                </div>
                <p className="text-gray-900 font-bold text-lg">
                  Question Sent!
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  The institution will respond to your inquiry soon.
                </p>
                <button
                  onClick={closeInquiry}
                  className="mt-6 rounded-md bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
                >
                  Close
                </button>
              </div>
            ) : (
              <form className="px-6 py-4 space-y-4" onSubmit={handleAskSubmit}>
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={askName}
                    onChange={(e) => {
                      setAskName(e.target.value);
                      setAskTouched(true);
                    }}
                    className={`w-full rounded-md border px-4 py-3 text-sm focus:outline-none focus:ring-2 ${askTouched && askErrors.name ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200" : "border-gray-200 bg-gray-50 focus:border-brand-blue focus:ring-brand-blue/20"}`}
                  />
                  {askTouched && askErrors.name && (
                    <p className="mt-1 text-xs text-red-500">
                      {askErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={askEmail}
                    onChange={(e) => {
                      setAskEmail(e.target.value);
                      setAskTouched(true);
                    }}
                    className={`w-full rounded-md border px-4 py-3 text-sm focus:outline-none focus:ring-2 ${askTouched && askErrors.email ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200" : "border-gray-200 bg-gray-50 focus:border-brand-blue focus:ring-brand-blue/20"}`}
                  />
                  {askTouched && askErrors.email && (
                    <p className="mt-1 text-xs text-red-500">
                      {askErrors.email}
                    </p>
                  )}
                </div>
                <div>
                  <div
                    className="flex rounded-md border overflow-hidden focus-within:ring-2 focus-within:ring-brand-blue/20 focus-within:border-brand-blue"
                    style={
                      askTouched && askErrors.phone
                        ? { borderColor: "#fca5a5" }
                        : { borderColor: "#e5e7eb" }
                    }
                  >
                    <span className="flex items-center bg-gray-100 px-3 text-sm text-gray-500 font-medium border-r border-gray-200">
                      +977
                    </span>
                    <input
                      type="tel"
                      placeholder="98XXXXXXXX"
                      maxLength={10}
                      value={askPhone}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "");
                        setAskPhone(v);
                        setAskTouched(true);
                      }}
                      className="w-full bg-gray-50 px-4 py-3 text-sm focus:outline-none"
                    />
                  </div>
                  {askTouched && askErrors.phone && (
                    <p className="mt-1 text-xs text-red-500">
                      {askErrors.phone}
                    </p>
                  )}
                </div>
                <div>
                  <textarea
                    placeholder="Type your message..."
                    rows={4}
                    value={askMessage}
                    maxLength={500}
                    onChange={(e) => {
                      setAskMessage(e.target.value);
                      setAskTouched(true);
                    }}
                    className={`w-full rounded-md border px-4 py-3 text-sm focus:outline-none focus:ring-2 resize-none ${askTouched && !askMessage.trim() ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200" : "border-gray-200 bg-gray-50 focus:border-brand-blue focus:ring-brand-blue/20"}`}
                  />
                  <div className="flex justify-between mt-1">
                    {askTouched && !askMessage.trim() ? (
                      <p className="text-xs text-red-500">
                        Message is required
                      </p>
                    ) : (
                      <span />
                    )}
                    <p
                      className={`text-xs ${askMessage.length >= 500 ? "text-red-500 font-medium" : "text-gray-400"}`}
                    >
                      {askMessage.length}/500
                    </p>
                  </div>
                </div>
                {isAuthenticated ? (
                  <button
                    type="submit"
                    disabled={askSending || !askValid}
                    className="w-full rounded-md bg-brand-blue py-3 text-sm font-bold text-white hover:bg-brand-hover disabled:opacity-50 transition-colors"
                  >
                    {askSending ? "Sending..." : "Submit Question"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`,
                      )
                    }
                    className="w-full rounded-md bg-brand-blue py-3 text-sm font-bold text-white hover:bg-brand-hover transition-colors"
                  >
                    <i className="fa-solid fa-lock mr-1.5"></i>Login to Submit
                  </button>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdmissionGrid;
