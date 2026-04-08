"use client";

import { useState, useMemo } from "react";
import { AdmissionFilters } from "@/app/admissions/[level]/types";
import DirectAdmissionCard from "@/components/admissions/DirectAdmissionCard";
import CollegeCard from "@/components/admissions/CollegeCard";
import FeaturedCollegeCard from "@/components/admissions/FeaturedCollegeCard";

interface AdmissionGridProps {
  filters: AdmissionFilters;
  setFilters: React.Dispatch<React.SetStateAction<AdmissionFilters>>;
  onNavigate: (view: string, data?: any) => void;
  level: string;
}

const SEARCHABLE_FILTER_KEYS: Array<keyof AdmissionFilters> = [
  "academic",
  "program",
];

const levelConfig: Record<string, { title: string; subtitle: string; badge: string }> = {
  "high-school": {
    title: "+2 Colleges",
    subtitle: "Science, Management & Humanities",
    badge: "+2",
  },
  "a-level": {
    title: "A-Level Colleges",
    subtitle: "Cambridge International Education",
    badge: "A-Level",
  },
  diploma: {
    title: "Diploma / CTEVT",
    subtitle: "Technical & Vocational Education",
    badge: "Diploma",
  },
};

const sampleDirectAdmissions = [
  {
    image: "https://i.ytimg.com/vi/zqfQW-SH3AI/maxresdefault.jpg",
    collegeName: "Herald College",
    rating: 4.7,
    type: "Private",
    location: "Naxal, Kathmandu",
    website: "www.heraldcollege.edu.np",
    courseName: "Bachelors in IT & Software",
    description: "Apply directly via the partner portal to skip the standard entrance queue. Verified for 2024 session.",
  },
  {
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=400&h=250",
    collegeName: "Kathmandu Bernhard College",
    rating: 4.5,
    type: "Private",
    location: "Bafal, Kathmandu",
    website: "www.kbc.edu.np",
    courseName: "BBA in Business Administration",
    description: "Direct admission available for eligible students. No entrance exam required for qualified candidates.",
  },
];

const sampleColleges = [
  {
    images: [
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=400&h=250",
      "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=400&h=250",
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=400&h=250",
    ],
    tag: { text: "Featured", color: "bg-[#0d6efd]" },
    collegeName: "KIST College of IT",
    rating: 4.2,
    type: "Private",
    location: "Kamalpokhari, KTM",
    website: "www.kist.edu.np",
    programs: [
      { name: "BSc (Hons) Computing", status: "Closing Soon" as const },
      { name: "Multimedia Tech", status: "Opening Soon" as const },
      { name: "Bachelor in IT", status: "Seats Available" as const },
    ],
    moreProgramsCount: 30,
  },
  {
    images: [
      "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=400&h=250",
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=400&h=250",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=400&h=250",
    ],
    tag: { text: "Filling Fast", color: "bg-red-500" },
    collegeName: "Global College",
    rating: 4.8,
    type: "Private",
    location: "Mid-Baneshwor, KTM",
    website: "www.global.edu.np",
    programs: [
      { name: "BBA in Management", status: "Closing Soon" as const },
      { name: "BBS General", status: "Seats Available" as const },
    ],
    moreProgramsCount: 15,
  },
  {
    images: [
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=400&h=250",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=400&h=250",
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=400&h=250",
    ],
    tag: { text: "Top Choice", color: "bg-purple-600" },
    collegeName: "St. Xavier's College",
    rating: 4.9,
    type: "Public",
    location: "Maitighar, KTM",
    website: "www.sxc.edu.np",
    programs: [
      { name: "Science +2", status: "Closing Soon" as const },
      { name: "A-Levels", status: "Opening Soon" as const },
    ],
    moreProgramsCount: 20,
  },
  {
    images: [
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=400&h=250",
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=400&h=250",
      "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=400&h=250",
    ],
    tag: { text: "Limited Seats", color: "bg-orange-500" },
    collegeName: "Orchid International College",
    rating: 4.3,
    type: "Private",
    location: "Dillibazar, KTM",
    website: "www.orchid.edu.np",
    programs: [
      { name: "BIT", status: "Seats Available" as const },
      { name: "BCA", status: "Opening Soon" as const },
    ],
    moreProgramsCount: 12,
  },
];

const sampleFeaturedColleges = [
  {
    provider: "Kist College & SS",
    location: "Kamalpokhari, KTM",
    type: "Private",
    rating: 4.5,
    logo: "https://kist.edu.np/resources/assets/img/logo_small.jpg",
    title: "Admission open for Science and Management 2024",
    website: "www.kist.edu.np",
    secondaryBadge: "Limited Seats",
    badgeColor: "bg-red-500",
    programs: ["Science", "Management", "Law"],
    images: [
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=400&h=250",
      "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=400&h=250",
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=400&h=250",
    ],
  },
  {
    provider: "Global College",
    location: "Mid-Baneshwor, KTM",
    type: "Private",
    rating: 4.8,
    logo: "https://kist.edu.np/resources/assets/img/logo_small.jpg",
    title: "Excellence in Management & Humanities",
    website: "www.global.edu.np",
    secondaryBadge: "Closing Soon",
    badgeColor: "bg-orange-500",
    programs: ["Management", "Humanities"],
    images: [
      "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=400&h=250",
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=400&h=250",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=400&h=250",
    ],
  },
  {
    provider: "St. Xavier's College",
    location: "Maitighar, KTM",
    type: "Public",
    rating: 4.9,
    logo: "https://kist.edu.np/resources/assets/img/logo_small.jpg",
    title: "Merit Based Admission Open for A-Levels & Science",
    website: "www.sxc.edu.np",
    secondaryBadge: "Top Choice",
    badgeColor: "bg-purple-600",
    programs: ["Science", "A-Levels"],
    images: [
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=400&h=250",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=400&h=250",
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=400&h=250",
    ],
  },
];

const AdmissionGrid: React.FC<AdmissionGridProps> = ({
  filters,
  setFilters,
  onNavigate,
  level,
}) => {
  const searchTerms = useMemo(
    () =>
      [filters.search, ...SEARCHABLE_FILTER_KEYS.flatMap((key) => filters[key] as string[])]
        .map((value) => (typeof value === "string" ? value.trim() : ""))
        .filter(Boolean),
    [filters],
  );

  const filteredColleges = useMemo(() => {
    let results = [...sampleColleges];

    if (filters.directAdmission) {
      results = results.filter(() => true);
    }

    if (filters.academic.length > 0) {
      results = results.filter((c) =>
        c.programs.some((p) => filters.academic.some((a) => p.name.toLowerCase().includes(a.toLowerCase()))),
      );
    }

    if (filters.program.length > 0) {
      results = results.filter((c) =>
        c.programs.some((p) => filters.program.some((pr) => p.name.toLowerCase().includes(pr.toLowerCase()))),
      );
    }

    if (filters.province.length > 0) {
      results = results.filter((c) =>
        filters.province.some((p) => c.location.toLowerCase().includes(p.replace("prov_", "").toLowerCase())),
      );
    }

    if (filters.district.length > 0) {
      results = results.filter((c) =>
        filters.district.some((d) => c.location.toLowerCase().includes(d.replace("d_", "").toLowerCase())),
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

    if (searchTerms.length > 0) {
      const terms = searchTerms.map((t) => t.toLowerCase());
      results = results.filter(
        (c) =>
          terms.some((t) => c.collegeName.toLowerCase().includes(t)) ||
          terms.some((t) => c.location.toLowerCase().includes(t)) ||
          terms.some((t) => c.programs.some((p) => p.name.toLowerCase().includes(t))),
      );
    }

    return results;
  }, [filters, searchTerms]);

  const filteredFeatured = useMemo(() => {
    let results = [...sampleFeaturedColleges];

    if (filters.academic.length > 0) {
      results = results.filter((c) =>
        c.programs.some((p) => filters.academic.some((a) => p.toLowerCase().includes(a.toLowerCase()))),
      );
    }

    if (filters.province.length > 0) {
      results = results.filter((c) =>
        filters.province.some((p) => c.location.toLowerCase().includes(p.replace("prov_", "").toLowerCase())),
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

    if (searchTerms.length > 0) {
      const terms = searchTerms.map((t) => t.toLowerCase());
      results = results.filter(
        (c) =>
          terms.some((t) => c.provider.toLowerCase().includes(t)) ||
          terms.some((t) => c.location.toLowerCase().includes(t)),
      );
    }

    return results;
  }, [filters, searchTerms]);

  const filteredDirect = useMemo(() => {
    let results = [...sampleDirectAdmissions];

    if (searchTerms.length > 0) {
      const terms = searchTerms.map((t) => t.toLowerCase());
      results = results.filter(
        (c) =>
          terms.some((t) => c.collegeName.toLowerCase().includes(t)) ||
          terms.some((t) => c.location.toLowerCase().includes(t)),
      );
    }

    return results;
  }, [filters, searchTerms]);

  const totalResults = filteredColleges.length + filteredFeatured.length + (filters.directAdmission ? filteredDirect.length : 0);
  const config = levelConfig[level] || levelConfig["high-school"];

  return (
    <>
      {/* Header Bar */}
      <div className="mb-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-col justify-start">
            <h1 className="mb-3 text-base font-bold text-gray-900">
              Showing {totalResults.toLocaleString()} {config.title}
            </h1>
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
                className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm transition-all placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#0000FF]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Direct Admission Section */}
      {filters.directAdmission && filteredDirect.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            <h2 className="text-xl font-bold text-gray-900">Direct Admission</h2>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full">
              No Entrance Required
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDirect.map((college, index) => (
              <DirectAdmissionCard
                key={index}
                {...college}
              />
            ))}
          </div>
        </section>
      )}

      {/* Featured Colleges Section */}
      {filteredFeatured.length > 0 && (
        <section className="mb-10">
          <div className="bg-gradient-to-br from-[#1053F3] to-[#2563EB] rounded-2xl p-5 md:p-7 flex flex-col gap-6 shadow-xl shadow-blue-900/10">
            <div className="text-white w-full px-1 flex justify-between items-end">
              <div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">Featured {config.badge} Colleges</h2>
                <p className="text-blue-100 text-sm mt-1">Top picks for {config.subtitle.toLowerCase()}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
              {filteredFeatured.map((college, index) => (
                <FeaturedCollegeCard key={index} {...college} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Colleges Grid */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900">All {config.badge} Colleges</h2>
          <span className="text-sm text-gray-500">{filteredColleges.length} colleges found</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredColleges.map((college, index) => (
            <div key={index} onClick={() => onNavigate("collegeDetails", { id: "kist-college" })} className="cursor-pointer">
              <CollegeCard {...college} />
            </div>
          ))}
        </div>

        {filteredColleges.length === 0 && filteredFeatured.length === 0 && (!filters.directAdmission || filteredDirect.length === 0) && (
          <div className="col-span-1 rounded-[16px] border border-gray-100 bg-white py-16 text-center text-gray-500 shadow-[0_2px_15px_rgb(0,0,0,0.04)] md:col-span-2 xl:col-span-3">
            No colleges found matching your filters.
          </div>
        )}
      </section>
    </>
  );
};

export default AdmissionGrid;
