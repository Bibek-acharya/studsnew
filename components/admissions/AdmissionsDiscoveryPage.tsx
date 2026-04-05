"use client";

import { useState } from "react";
import AdmissionFilters from "@/components/admissions/AdmissionFilters";
import DirectAdmissionCard from "@/components/admissions/DirectAdmissionCard";
import CollegeCard from "@/components/admissions/CollegeCard";
import FeaturedCollegeCard from "@/components/admissions/FeaturedCollegeCard";

interface Filters {
  stream: string[];
  location: { province: string; district: string; city: string };
  fee: number;
  collegeType: string[];
  scholarship: string[];
  facilities: string[];
  sortBy: string;
  directAdmission: boolean;
}

interface AdmissionsDiscoveryPageProps {
  level?: string;
}

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

export default function AdmissionsDiscoveryPage({ level = "high-school" }: AdmissionsDiscoveryPageProps) {
  const [filters, setFilters] = useState<Filters>({
    stream: [],
    location: { province: "", district: "", city: "" },
    fee: 500000,
    collegeType: [],
    scholarship: [],
    facilities: [],
    sortBy: "Popularity",
    directAdmission: false,
  });

  const config = levelConfig[level] || levelConfig["high-school"];

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#1053F3] to-[#2563EB]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 mb-3">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white/90 text-xs font-medium">Admissions Open 2024</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                {config.title}
              </h1>
              <p className="text-blue-100 mt-2 text-base md:text-lg">
                {config.subtitle} — Find and apply to top colleges across Nepal
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-center">
                <p className="text-2xl font-bold text-white">{sampleColleges.length + sampleDirectAdmissions.length}</p>
                <p className="text-blue-100 text-xs">Colleges</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-center">
                <p className="text-2xl font-bold text-white">{sampleDirectAdmissions.length}</p>
                <p className="text-blue-100 text-xs">Direct Admission</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <AdmissionFilters onFilterChange={setFilters} />

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {/* Direct Admission Section */}
          {filters.directAdmission && (
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
                {sampleDirectAdmissions.map((college, index) => (
                  <DirectAdmissionCard
                    key={index}
                    {...college}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Featured Colleges Section */}
          <section className="mb-10">
            <div className="bg-gradient-to-br from-[#1053F3] to-[#2563EB] rounded-2xl p-5 md:p-7 flex flex-col gap-6 shadow-xl shadow-blue-900/10">
              <div className="text-white w-full px-1 flex justify-between items-end">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight">Featured {config.badge} Colleges</h2>
                  <p className="text-blue-100 text-sm mt-1">Top picks for {config.subtitle.toLowerCase()}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
                {sampleFeaturedColleges.map((college, index) => (
                  <FeaturedCollegeCard key={index} {...college} />
                ))}
              </div>
            </div>
          </section>

          {/* All Colleges Section */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">All {config.badge} Colleges</h2>
              <span className="text-sm text-gray-500">{sampleColleges.length} colleges found</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleColleges.map((college, index) => (
                <CollegeCard key={index} {...college} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
