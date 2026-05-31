"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FolderOpen } from "lucide-react";
import { AdmissionFilters } from "@/app/admissions/[level]/types";
import CollegeCard from "@/components/admissions/CollegeCard";
import FeaturedAdmissionAd from "@/components/admissions/FeaturedAdmissionAd";
import DirectAdmissionAd from "@/components/admissions/DirectAdmissionAd";
import Pagination from "@/components/ui/Pagination";
import { admissionService, AdmissionCollegeItem } from "@/services/admission.api";
import { sampleFeaturedColleges, sampleDirectAdmissions, levelConfig } from "./data";

interface AdmissionGridProps {
  filters: AdmissionFilters;
  setFilters: React.Dispatch<React.SetStateAction<AdmissionFilters>>;
  onNavigate: (view: string, data?: any) => void;
  level: string;
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

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, level]);

  useEffect(() => {
    const fetchColleges = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const response = await admissionService.getPublishedAdmissionColleges(level, currentPage, COLLEGES_PER_PAGE);

        setColleges(response.data.colleges);
        setPagination(response.data.pagination);
      } catch (error) {
        setFetchError(error instanceof Error ? error.message : "Failed to load admission colleges");
        setColleges([]);
        setPagination({ page: 1, pageSize: COLLEGES_PER_PAGE, total: 0, totalPages: 1 });
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
          c.location.toLowerCase().includes(p.replace("prov_", "").toLowerCase()),
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
  const showingFrom = totalResults === 0 ? 0 : (pagination.page - 1) * pagination.pageSize + 1;
  const showingTo = Math.min(pagination.page * pagination.pageSize, totalResults);

  const getAdType = (index: number) => {
    if (index === 5) return "featured";
    if (index === 11) return "direct";
    if (pagination.page === 1 && colleges.length < 6 && index === colleges.length - 1) {
      return "featured";
    }
    return null;
  };

  const config = levelConfig[level] || levelConfig["high-school"] || { title: "Colleges", subtitle: "", badge: "" };

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  };

  return (
    <>
      <div className="mb-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-col justify-start">
            <h1 className="mb-3 text-base text-gray-900">
              Showing {showingFrom.toLocaleString()}-{showingTo.toLocaleString()} of {totalResults.toLocaleString()} <span className="font-bold">{config.title}</span>
            </h1>
            {fetchError && <p className="text-sm text-red-600">{fetchError}</p>}
          </div>

          <div className="mt-2 flex w-full shrink-0 flex-col gap-3 sm:mt-0 sm:w-[320px] sm:items-end">
            <div className="relative w-full">
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400"></i>
              <input
                type="text"
                value={filters.search}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder="Search colleges, locations, courses..."
                className="w-full rounded-md border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm transition-all placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>
        </div>
      </div>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex animate-pulse flex-col rounded-md border border-gray-200 bg-white p-4">
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
              <h3 className="text-xl font-bold text-gray-900">No Colleges Found</h3>
              <p className="mt-1 text-sm text-gray-500">No colleges match your current filters. Try adjusting your search criteria.</p>
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
                      return college.image_url ? [college.image_url] : ["/images/college-placeholder.png"];
                    })()}
                    tag={{
                      text: college.verified ? "Verified" : "Admission",
                      color: college.verified ? "bg-blue-600" : "bg-slate-500",
                    }}
                    collegeName={college.name}
                    rating={college.rating ?? 4.0}
                    type={college.type || "College"}
                    location={college.location}
                    website={college.website || college.affiliation}
                    programs={Array.isArray(college.featured_programs)
                      ? (college.featured_programs as any[]).slice(0, 3).map((p) => {
                          const name = p.title || "";
                          const rawStatus = p.admissionStatus || "";
                          const statusMap: Record<string, "Seats Available" | "Closing Soon" | "Opening Soon"> = {
                            "seats-available": "Seats Available",
                            "limited-seats": "Closing Soon",
                            "opening-soon": "Opening Soon",
                          };
                          return { name, status: statusMap[rawStatus] || "Seats Available" };
                        })
                      : [{ name: college.affiliation || college.name || "Admission Open", status: "Seats Available" }]}
                    moreProgramsCount={college.programs}
                    onNavigate={() => onNavigate("collegeDetails", { id: college.id })}
                    onApply={() => onNavigate("collegeDetails", { id: college.id })}
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
    </>
  );
};

export default AdmissionGrid;
