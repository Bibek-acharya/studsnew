"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, FolderOpen } from "lucide-react";
import { apiService, College as ApiCollege } from "../../services/api";
import {
  CollegeFilters,
  DEFAULT_COLLEGE_FILTERS,
  isCollegeVerified,
} from "@/app/find-college/types";
import FilterSidebar from "@/components/find-college/FilterSidebar";
import { ProgramCard } from "@/components/find-college/CollegeGrid";
import Pagination from "@/components/ui/Pagination";

// ── Types ─────────────────────────────────────────────────────────────────

interface SelectedCourseContext {
  id?: string;
  title: string;
  collegesCount?: number;
}

interface CollegesAndCoursesPageProps {
  selectedCourse: SelectedCourseContext;
  onBack: () => void;
}

// ── Mock Data ──────────────────────────────────────────────────────────────

const MOCK_COLLEGES: ApiCollege[] = [
  {
    id: 101,
    name: "KIST Higher Secondary School & College",
    rating: 4.8,
    type: "Private",
    location: "Kamalpokhari, Kathmandu",
    affiliation: "NEB",
    image_url:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1000&auto=format&fit=crop",
    description:
      "KIST is a premier academic institution in Nepal providing high-quality education in Management and Science.",
    verified: true,
    featured: true,
  },
  {
    id: 102,
    name: "Kathmandu Model College (KMC)",
    rating: 4.7,
    type: "Private",
    location: "Balkumari, Lalitpur",
    affiliation: "Tribhuvan University",
    image_url:
      "https://images.unsplash.com/photo-1523050853064-dbad6f987297?q=80&w=1000&auto=format&fit=crop",
    description:
      "KMC has established itself as one of the most prominent academic institutions for higher education in Nepal.",
    verified: true,
    featured: false,
  },
  {
    id: 103,
    name: "St. Xavier's College",
    rating: 4.9,
    type: "Public / Govt",
    location: "Maitighar, Kathmandu",
    affiliation: "Tribhuvan University",
    image_url:
      "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1000&auto=format&fit=crop",
    description:
      "An educational institution of high repute, run by the Nepal Jesuit Society, providing excellence in education.",
    verified: true,
    featured: true,
  },
  {
    id: 104,
    name: "British College",
    rating: 4.5,
    type: "Private",
    location: "Thapathali, Kathmandu",
    affiliation: "UWE Bristol",
    image_url:
      "https://images.unsplash.com/photo-1492538356227-3eb926ca10aa?q=80&w=1000&auto=format&fit=crop",
    description:
      "The British College offers internationally recognized degrees in partnership with top UK universities.",
    verified: true,
    featured: false,
  },
  {
    id: 105,
    name: "GoldenGate International College",
    rating: 4.4,
    type: "Private",
    location: "Battisputali, Kathmandu",
    affiliation: "Tribhuvan University",
    image_url:
      "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=1000&auto=format&fit=crop",
    description:
      "Providing quality education with a focus on holistic development and research-oriented learning.",
    verified: false,
    featured: false,
  },
  {
    id: 106,
    name: "Trinity International College",
    rating: 4.6,
    type: "Private",
    location: "Dillibazar, Kathmandu",
    affiliation: "NEB",
    image_url:
      "https://images.unsplash.com/photo-1525921429624-479b6a29d810?q=80&w=1000&auto=format&fit=crop",
    description:
      "Trinity is a leading college for +2 and Bachelor levels, known for its academic discipline.",
    verified: true,
    featured: false,
  },
];

const MOCK_COURSES = [
  {
    id: "1",
    title: "BBA (Bachelor of Business Administration)",
    colleges: "120+",
  },
  {
    id: "2",
    title: "B.Sc CSIT (B.Sc. in Computer Science & IT)",
    colleges: "54+",
  },
  {
    id: "3",
    title: "BIT (Bachelor in Information Technology)",
    colleges: "35+",
  },
  { id: "4", title: "BBM (Bachelor of Business Management)", colleges: "45+" },
  {
    id: "5",
    title: "BIM (Bachelor of Information Management)",
    colleges: "25+",
  },
  { id: "6", title: "Science (+2)", colleges: "200+" },
  { id: "7", title: "Management (+2)", colleges: "300+" },
];

// ── Toast ──────────────────────────────────────────────────────────────────

const Toast: React.FC<{ message: string }> = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="bg-neutral-800 text-white px-5 py-3 rounded-md shadow-lg text-[14px] font-medium"
  >
    {message}
  </motion.div>
);

// ── Main Page Component ────────────────────────────────────────────────────

const COLLEGES_PER_PAGE = 18;

const CollegesAndCoursesPage: React.FC<CollegesAndCoursesPageProps> = ({
  selectedCourse,
}) => {
  const router = useRouter();
  const [activeCourseId, setActiveCourseId] = useState<string | null>(
    selectedCourse.id || "2",
  );
  const [filters, setFilters] = useState<CollegeFilters>(
    DEFAULT_COLLEGE_FILTERS,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [quickApplyMode, setQuickApplyMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [toasts, setToasts] = useState<string[]>([]);
  const [collegeForInquiry, setCollegeForInquiry] =
    useState<ApiCollege | null>(null);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryMessageSingle, setInquiryMessageSingle] = useState("");
  const [isInquirySingleSent, setIsInquirySingleSent] = useState(false);

  const addToast = (msg: string) => {
    setToasts((prev) => [...prev, msg]);
    setTimeout(() => setToasts((prev) => prev.slice(1)), 3000);
  };

  const handleNavigate = (view: string, data?: any) => {
    if (view === "collegeDetails" && data?.id) {
      const tabParam = data.tab ? `?tab=${data.tab}` : "";
      router.push(`/find-college/${data.id}${tabParam}`);
    }
  };

  // ── Data Fetching ────────────────────────────────────────────────────────

  const { data: filterCountsResponse } = useQuery({
    queryKey: ["collegeFilterCounts"],
    queryFn: () => apiService.getCollegeFilterCounts(),
  });

  const { data: coursesResponse } = useQuery({
    queryKey: ["education-courses-mini"],
    queryFn: () => apiService.getEducationCourses(),
  });

  const backendCourses = useMemo(() => {
    const list = coursesResponse?.data?.courses || [];
    return list.length > 0 ? list : MOCK_COURSES;
  }, [coursesResponse]);

  const { data: collegesResponse, isLoading: collegesLoading } = useQuery({
    queryKey: ["colleges-list-filtered", filters, activeCourseId, currentPage],
    queryFn: () =>
      apiService.getColleges({
        page: currentPage,
        pageSize: COLLEGES_PER_PAGE,
        search: filters.search || undefined,
        location:
          filters.district[0] || filters.province[0] || undefined,
        courseId: activeCourseId || undefined,
        sort: filters.sortBy,
        academic:
          filters.academic.length > 0 ? filters.academic : undefined,
        type: filters.type.length > 0 ? filters.type.join(",") : undefined,
        feeMax: filters.feeMax < 2000000 ? filters.feeMax : undefined,
      }),
  });

  const colleges = useMemo(() => {
    const list = collegesResponse?.data?.colleges || [];
    return list.length > 0 ? list : [];
  }, [collegesResponse]);

  const pagination = collegesResponse?.data?.pagination;
  const totalResults = pagination?.total || colleges.length;
  const totalPages = pagination?.totalPages || 1;

  // ── Handlers ─────────────────────────────────────────────────────────────

  const toggleSaved = (id: number) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
    addToast(
      savedIds.includes(id) ? "Removed from bookmarks" : "Added to bookmarks!",
    );
  };

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSingleInquiry = (college: ApiCollege) => {
    setCollegeForInquiry(college);
    setIsInquiryModalOpen(true);
    setIsInquirySingleSent(false);
    setInquiryMessageSingle("");
  };

  const handleSingleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    try {
      await fetch(`${API_BASE}/api/v1/conversations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          institution_id: collegeForInquiry?.id,
          subject: `Inquiry about ${collegeForInquiry?.name}`,
          content: inquiryMessageSingle,
          client_message_id: crypto.randomUUID(),
        }),
      });
    } catch {
      /* silently fail */
    }
    setIsInquirySingleSent(true);
    addToast(`Inquiry for ${collegeForInquiry?.name} has been sent!`);
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen p-4 text-gray-800 md:p-6 lg:p-8">
      {/* Top Bar for Courses */}
      <div className="mx-auto max-w-350 mb-6">
        <div className="bg-blue-50 w-full rounded-md py-5 px-6 md:py-6 md:px-8 overflow-hidden border border-blue-100">
          <div className="flex gap-4 md:gap-5 overflow-x-auto snap-x pb-2 no-scrollbar">
            {backendCourses.map((course: any) => {
              const isSelected =
                String(course.id) === String(activeCourseId);
              return (
                <div
                  key={course.id}
                  onClick={() => {
                    setActiveCourseId(String(course.id));
                    setCurrentPage(1);
                  }}
                  className={`relative flex-shrink-0 w-[190px] sm:w-[220px] bg-white rounded-md px-4 py-3.5 border-[1.5px] transition-all duration-200 cursor-pointer snap-start flex flex-col justify-between min-h-[92px] ${isSelected ? "border-blue-600" : "border-transparent hover:border-gray-200"}`}
                  title={course.title}
                >
                  <h3 className="text-slate-900 font-semibold text-[13px] leading-[18px] truncate pr-6">
                    {course.title}
                  </h3>
                  <div className="mt-1.5 text-blue-600 text-[11px] font-medium flex items-center">
                    {course.colleges || "10+"} colleges{" "}
                    <ChevronDown size={10} className="-rotate-90 ml-1" />
                  </div>
                  {isSelected && (
                    <div className="absolute top-[14px] right-[14px]">
                      <Check
                        size={16}
                        className="bg-blue-600 rounded-full text-white p-0.5"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar + Grid */}
      <div className="mx-auto flex max-w-350 flex-col gap-6 lg:flex-row lg:flex-nowrap lg:gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-full shrink-0 lg:w-75">
          <FilterSidebar filters={filters} setFilters={setFilters} />
        </aside>

        {/* Main Grid Section */}
        <main className="min-w-0 flex-1">
          {/* Top Row: Count + Quick Apply */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
              <h1 className="text-base text-gray-900">
                Showing{" "}
                {totalResults === 0
                  ? "0"
                  : `${((currentPage - 1) * COLLEGES_PER_PAGE + 1).toLocaleString()}-${Math.min(currentPage * COLLEGES_PER_PAGE, totalResults).toLocaleString()}`}{" "}
                of {totalResults.toLocaleString()}{" "}
                <span className="font-bold">Colleges</span>
              </h1>
            </div>

            <div className="flex flex-row justify-between items-center gap-4 pt-2 pb-4">
              <label className="group flex cursor-pointer items-center gap-2.5">
                <div className="relative flex h-5 w-5 items-center justify-center">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length > 0 &&
                      selectedIds.length === Math.min(colleges.length, 5)
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setQuickApplyMode(true);
                        setSelectedIds(colleges.slice(0, 5).map((c) => c.id));
                      } else {
                        setSelectedIds([]);
                        setQuickApplyMode(false);
                      }
                    }}
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
                  <span className="font-semibold text-slate-900">
                    Select all
                  </span>
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
                      checked={quickApplyMode}
                      onChange={(e) => {
                        setQuickApplyMode(e.target.checked);
                        if (!e.target.checked) setSelectedIds([]);
                      }}
                      className="peer sr-only"
                    />
                    <div className="peer h-5 w-8.5 rounded-full bg-slate-300 transition-all after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-blue peer-checked:after:translate-x-3.5 peer-checked:after:border-white peer-focus:outline-none"></div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* College Grid */}
          <div
            className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
            id="card-grid"
          >
            {collegesLoading && colleges.length === 0 && (
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

            {colleges.map((college) => (
              <ProgramCard
                key={college.id}
                college={college}
                isVerified={isCollegeVerified(college.verified)}
                isSaved={savedIds.includes(college.id)}
                isSelected={selectedIds.includes(college.id)}
                isQuickInquiryMode={quickApplyMode}
                onNavigate={handleNavigate}
                onToggleSaved={() => toggleSaved(college.id)}
                onToggleSelection={() => toggleSelection(college.id)}
                onClaim={() => {}}
                onSingleInquiry={() => handleSingleInquiry(college)}
              />
            ))}

            {!collegesLoading && colleges.length === 0 && (
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

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </main>
      </div>

      {/* Toast Notifications */}
      <div className="fixed bottom-5 right-5 flex flex-col gap-2 z-[100]">
        <AnimatePresence>
          {toasts.map((toast, idx) => (
            <Toast key={idx} message={toast} />
          ))}
        </AnimatePresence>
      </div>

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
                institution will respond soon.
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
                      onChange={(e) =>
                        setInquiryMessageSingle(e.target.value)
                      }
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
                      className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-blue px-6 py-2.5 text-[14px] font-bold text-white transition-all hover:bg-brand-hover sm:w-auto"
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
    </div>
  );
};

export default CollegesAndCoursesPage;
