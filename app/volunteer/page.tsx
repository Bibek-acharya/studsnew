"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import VolunteerCard from "@/components/volunteer/VolunteerCard";
import type { Volunteer } from "@/components/volunteer/VolunteerCard";
import VolunteerFilter, { VolunteerFilters, DEFAULT_VOLUNTEER_FILTERS } from "@/components/volunteer/VolunteerFilter";
import Pagination from "@/components/ui/Pagination";
import { apiService, getImageUrl, stripHtml } from "@/services/api";

const ITEMS_PER_PAGE = 6;

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function mapVolunteer(apiVol: any): Volunteer {
  const isPaid = apiVol.volunteer_type === "paid";
  return {
    id: apiVol.id,
    image: getImageUrl(apiVol.banner_image),
    type: isPaid ? "Paid Volunteer" : "Unpaid Volunteer",
    title: apiVol.title,
    organizer: apiVol.organizer || "",
    location: apiVol.location || "",
    deadline: formatDate(apiVol.application_deadline),
    fee: isPaid ? apiVol.volunteer_payment || "NPR 0" : "Free",
    feeLabel: isPaid
      ? apiVol.volunteer_payment
        ? `NPR ${apiVol.volunteer_payment}`
        : "Stipend Provided"
      : "Free",
    details: [
      { label: "Organizer", value: apiVol.organizer || "" },
      { label: "Compensation", value: isPaid ? "Stipend Provided" : "Unpaid Volunteer Role" },
      { label: "Application Fee", value: "Free" },
      { label: "Location", value: apiVol.location || "" },
      { label: "Application Deadline", value: formatDate(apiVol.application_deadline) },
      { label: "Description", value: stripHtml(apiVol.description) },
    ],
    availableDates: apiVol.specific_dates || [],
  };
}

export default function VolunteerPage() {
  const [filters, setFilters] = useState<VolunteerFilters>(DEFAULT_VOLUNTEER_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchVolunteers = useCallback(async (page: number) => {
    setLoading(true);
    setError("");
    try {
      const response = await apiService.getPublicVolunteers({
        search: filters.search || undefined,
        type: filters.type || undefined,
        province: filters.province || undefined,
        page,
        limit: ITEMS_PER_PAGE,
      });
      const items = response?.data?.volunteers || [];
      const meta = response?.data?.meta || {};
      setVolunteers(items.map(mapVolunteer));
      setTotalResults(meta.total || 0);
    } catch (err: any) {
      setError(err.message || "Failed to load volunteers");
      setVolunteers([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, [filters.search, filters.type, filters.province]);

  useEffect(() => {
    fetchVolunteers(currentPage);
  }, [currentPage, fetchVolunteers]);

  const handleSetFilters = useCallback((value: React.SetStateAction<VolunteerFilters>) => {
    setFilters(value);
    setCurrentPage(1);
  }, []);

  const sorted = useMemo(() => {
    let list = [...volunteers];
    if (filters.sortBy === "newest") {
      list.sort((a, b) => b.id - a.id);
    } else if (filters.sortBy === "oldest") {
      list.sort((a, b) => a.id - b.id);
    }
    return list;
  }, [volunteers, filters.sortBy]);

  const totalPages = Math.max(1, Math.ceil(totalResults / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const showingFrom = totalResults === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1;
  const showingTo = Math.min(safePage * ITEMS_PER_PAGE, totalResults);

  return (
    <div className="min-h-screen p-4 text-gray-800 md:p-6 lg:p-8">
      <div className="mx-auto flex max-w-350 flex-col gap-6 lg:flex-row lg:flex-nowrap lg:gap-8">
        <aside className="w-full shrink-0 lg:w-75">
          <VolunteerFilter filters={filters} setFilters={handleSetFilters} />
        </aside>
        <main className="min-w-0 flex-1">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {loading ? (
                  "Loading volunteers..."
                ) : (
                  <>Showing {showingFrom.toLocaleString()}&ndash;{showingTo.toLocaleString()} of {totalResults.toLocaleString()} <span className="font-bold">Volunteers</span></>
                )}
              </h1>
            </div>
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={filters.search}
                onChange={(e) => { setFilters((prev) => ({ ...prev, search: e.target.value })); setCurrentPage(1); }}
                placeholder="Search volunteer opportunities..."
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-4 pr-10 text-[14px] outline-none focus:border-[#0000ff] transition-all"
              />
              <svg className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          {loading ? (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-20 text-center">
              <p className="text-lg font-bold text-gray-500">Loading volunteer opportunities...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-red-200 py-20 text-center">
              <p className="text-lg font-bold text-red-500">{error}</p>
            </div>
          ) : sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-20 text-center">
              <p className="text-lg font-bold text-gray-500">No volunteer opportunities found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {sorted.map((v) => (
                  <VolunteerCard key={v.id} volunteer={v} />
                ))}
              </div>
              <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
