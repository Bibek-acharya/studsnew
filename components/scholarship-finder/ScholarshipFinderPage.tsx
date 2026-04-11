"use client";

import React, { useState } from "react";
import {
  SlidersHorizontal,
  ChevronDown,
  Search,
  ArrowUpRight,
  User,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  BadgeCheck,
  Banknote,
  MapPin,
  GraduationCap,
  Calendar,
  Bookmark,
} from "lucide-react";

// Types
interface ScholarshipData {
  id: number;
  imageUrl?: string;
  imagePlaceholder?: string;
  badgeType: string;
  status: string;
  statusDot: string;
  statusText: string;
  statusBg: string;
  title: string;
  org: string;
  amount: string;
  location: string;
  degree: string;
  deadline: string;
}

// Data
const scholarships: ScholarshipData[] = [
  {
    id: 1,
    imagePlaceholder: "Women in Research Scholarship",
    badgeType: "NEED BASED",
    status: "CLOSED",
    statusDot: "bg-gray-400",
    statusText: "text-gray-500",
    statusBg: "bg-gray-100",
    title: "Women in Research Scholarship",
    org: "Global Science Alliance",
    amount: "NPR 500,000",
    location: "Pokhara, Nepal",
    degree: "Masters",
    deadline: "Mar 28, 2026",
  },
  {
    id: 2,
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
    badgeType: "PARTIAL TUITION",
    status: "CLOSING SOON",
    statusDot: "bg-[#eab308]",
    statusText: "text-[#eab308]",
    statusBg: "bg-yellow-50",
    title: "Nepal STEM Excellence Grant",
    org: "Tech Nepal Foundation",
    amount: "NPR 400,000",
    location: "Kathmandu, Ne...",
    degree: "Bachelors",
    deadline: "Apr 10, 2026",
  },
  {
    id: 3,
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop",
    badgeType: "MERIT SCHOLARSHIP",
    status: "OPEN",
    statusDot: "bg-[#22c55e]",
    statusText: "text-[#22c55e]",
    statusBg: "bg-green-50",
    title: "College Merit Excellence Award",
    org: "KIST College",
    amount: "NPR 200,000",
    location: "Lalitpur, Nepal",
    degree: "Bachelors",
    deadline: "Apr 30, 2026",
  },
  {
    id: 4,
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop",
    badgeType: "RESEARCH GRANT",
    status: "OPEN",
    statusDot: "bg-[#22c55e]",
    statusText: "text-[#22c55e]",
    statusBg: "bg-green-50",
    title: "Asian Tech Research Fellowship",
    org: "Kyoto University",
    amount: "¥1,500,000",
    location: "Kyoto, Japan",
    degree: "Ph.D.",
    deadline: "Jun 20, 2026",
  },
  {
    id: 5,
    imagePlaceholder: "Community Leaders Aid",
    badgeType: "NEED BASED",
    status: "CLOSING SOON",
    statusDot: "bg-[#eab308]",
    statusText: "text-[#eab308]",
    statusBg: "bg-yellow-50",
    title: "Community Leaders Aid Fund",
    org: "Social Impact NGO",
    amount: "NPR 150,000",
    location: "Kathmandu, Nepal",
    degree: "Diploma",
    deadline: "Apr 05, 2026",
  },
  {
    id: 6,
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop",
    badgeType: "FULL TUITION",
    status: "OPEN",
    statusDot: "bg-[#22c55e]",
    statusText: "text-[#22c55e]",
    statusBg: "bg-green-50",
    title: "Women in Tech Initiative",
    org: "Oxford University",
    amount: "£25,000 / Year",
    location: "Oxford, UK",
    degree: "Masters",
    deadline: "Aug 10, 2026",
  },
  {
    id: 7,
    imagePlaceholder: "Future Entrepreneurs Fund",
    badgeType: "MERIT BASED",
    status: "OPEN",
    statusDot: "bg-[#22c55e]",
    statusText: "text-[#22c55e]",
    statusBg: "bg-green-50",
    title: "Future Entrepreneurs Fund",
    org: "Global Business Org",
    amount: "NPR 300,000",
    location: "Kathmandu, Nepal",
    degree: "Bachelors",
    deadline: "Sep 15, 2026",
  },
  {
    id: 8,
    imageUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=800&auto=format&fit=crop",
    badgeType: "PARTIAL TUITION",
    status: "OPEN",
    statusDot: "bg-[#22c55e]",
    statusText: "text-[#22c55e]",
    statusBg: "bg-green-50",
    title: "Creative Arts Scholarship",
    org: "National Arts Council",
    amount: "NPR 250,000",
    location: "Patan, Nepal",
    degree: "Bachelors",
    deadline: "Oct 10, 2026",
  },
  {
    id: 9,
    imagePlaceholder: "Medical Science Grant",
    badgeType: "NEED BASED",
    status: "CLOSING SOON",
    statusDot: "bg-[#eab308]",
    statusText: "text-[#eab308]",
    statusBg: "bg-yellow-50",
    title: "Medical Science Grant",
    org: "Health Nepal Foundation",
    amount: "NPR 800,000",
    location: "Chitwan, Nepal",
    degree: "Masters",
    deadline: "May 01, 2026",
  },
  {
    id: 10,
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
    badgeType: "RESEARCH GRANT",
    status: "OPEN",
    statusDot: "bg-[#22c55e]",
    statusText: "text-[#22c55e]",
    statusBg: "bg-green-50",
    title: "Engineering Innovation Award",
    org: "Tech Institute Nepal",
    amount: "NPR 450,000",
    location: "Pokhara, Nepal",
    degree: "Bachelors",
    deadline: "Nov 20, 2026",
  },
  {
    id: 11,
    imagePlaceholder: "Rural Education Support",
    badgeType: "NEED BASED",
    status: "OPEN",
    statusDot: "bg-[#22c55e]",
    statusText: "text-[#22c55e]",
    statusBg: "bg-green-50",
    title: "Rural Education Support",
    org: "Himalayan Trust",
    amount: "NPR 100,000",
    location: "Solukhumbu, Nepal",
    degree: "+2",
    deadline: "Dec 05, 2026",
  },
  {
    id: 12,
    imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop",
    badgeType: "FULL TUITION",
    status: "CLOSED",
    statusDot: "bg-gray-400",
    statusText: "text-gray-500",
    statusBg: "bg-gray-100",
    title: "Global Leadership Fellowship",
    org: "International Uni",
    amount: "$40,000 / Year",
    location: "New York, USA",
    degree: "Ph.D.",
    deadline: "Jan 15, 2026",
  },
  {
    id: 13,
    imagePlaceholder: "Environmental Impact Grant",
    badgeType: "RESEARCH GRANT",
    status: "OPEN",
    statusDot: "bg-[#22c55e]",
    statusText: "text-[#22c55e]",
    statusBg: "bg-green-50",
    title: "Environmental Impact Grant",
    org: "Green Earth Foundation",
    amount: "NPR 350,000",
    location: "Kathmandu, Nepal",
    degree: "Masters",
    deadline: "Feb 20, 2027",
  },
  {
    id: 14,
    imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=800&auto=format&fit=crop",
    badgeType: "MERIT BASED",
    status: "CLOSING SOON",
    statusDot: "bg-[#eab308]",
    statusText: "text-[#eab308]",
    statusBg: "bg-yellow-50",
    title: "Excellence in Humanities",
    org: "National Literacy Trust",
    amount: "NPR 150,000",
    location: "Bhaktapur, Nepal",
    degree: "Bachelors",
    deadline: "Mar 10, 2027",
  },
  {
    id: 15,
    imagePlaceholder: "Tech Startups Fellowship",
    badgeType: "FULL TUITION",
    status: "OPEN",
    statusDot: "bg-[#22c55e]",
    statusText: "text-[#22c55e]",
    statusBg: "bg-green-50",
    title: "Tech Startups Fellowship",
    org: "Silicon Valley Hub",
    amount: "$20,000 / Year",
    location: "San Francisco, USA",
    degree: "Masters",
    deadline: "Apr 05, 2027",
  },
  {
    id: 16,
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop",
    badgeType: "NEED BASED",
    status: "OPEN",
    statusDot: "bg-[#22c55e]",
    statusText: "text-[#22c55e]",
    statusBg: "bg-green-50",
    title: "Public Health Scholarship",
    org: "WHO Affiliates",
    amount: "NPR 500,000",
    location: "Lalitpur, Nepal",
    degree: "Ph.D.",
    deadline: "May 12, 2027",
  },
  {
    id: 17,
    imagePlaceholder: "NextGen Innovators Award",
    badgeType: "PARTIAL TUITION",
    status: "CLOSING SOON",
    statusDot: "bg-[#eab308]",
    statusText: "text-[#eab308]",
    statusBg: "bg-yellow-50",
    title: "NextGen Innovators Award",
    org: "Global Innovators",
    amount: "NPR 220,000",
    location: "Kathmandu, Nepal",
    degree: "+2",
    deadline: "Jun 15, 2027",
  },
  {
    id: 18,
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop",
    badgeType: "RESEARCH GRANT",
    status: "OPEN",
    statusDot: "bg-[#22c55e]",
    statusText: "text-[#22c55e]",
    statusBg: "bg-green-50",
    title: "Data Science Fellowship",
    org: "Data Analytics Institute",
    amount: "NPR 400,000",
    location: "Pokhara, Nepal",
    degree: "Masters",
    deadline: "Jul 30, 2027",
  },
];

const FilterSection = ({
  title,
  icon,
  children,
  isOpenDefault = false,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  isOpenDefault?: boolean;
}) => {
  return (
    <details className="group mb-4 border-b border-gray-100 pb-4" open={isOpenDefault}>
      <summary className="flex justify-between items-center font-semibold text-[14px] text-slate-800 cursor-pointer list-none">
        <span className="flex items-center gap-2">
          {icon}
          {title}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500 transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  );
};

const CheckboxLabel = ({ label, checked = false }: { label: string; checked?: boolean }) => (
  <label className="flex items-center gap-3 cursor-pointer group/label mb-3">
    <input
      type="checkbox"
      defaultChecked={checked}
      className="w-4 h-4 accent-[#0000ff] border-gray-300 rounded cursor-pointer"
    />
    <span className="text-[14px] text-gray-600 group-hover/label:text-gray-900 transition-colors">
      {label}
    </span>
  </label>
);

const SearchInput = ({ placeholder }: { placeholder: string }) => (
  <div className="relative mb-3">
    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
    <input
      type="text"
      placeholder={placeholder}
      className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[12px] focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all placeholder:text-gray-400"
    />
  </div>
);

const ScholarshipCard = ({ scholarship }: { scholarship: ScholarshipData }) => {
  const imageHtml = scholarship.imageUrl ? (
    <img src={scholarship.imageUrl} alt={scholarship.title} className="w-full h-full object-cover" />
  ) : (
    <div className="w-full h-full p-3 flex items-start bg-linear-to-br from-gray-200 to-gray-50">
      <span className="text-gray-600 text-[13px] font-medium flex items-start gap-1.5 leading-snug">
        <ImageIcon className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
        {scholarship.imagePlaceholder}
      </span>
    </div>
  );

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-gray-200/80 transition-all duration-300 hover:-translate-y-1 p-3">
      {/* Image Area */}
      <div className="h-31.25 w-full bg-gray-100 relative overflow-hidden rounded-xl mb-3">
        {imageHtml}
      </div>

      {/* Content Area */}
      <div className="flex flex-col grow px-1">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-blue-600 bg-blue-50 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">
            {scholarship.badgeType}
          </span>
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${scholarship.statusBg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${scholarship.statusDot}`}></span>
            <span className={`text-[10px] font-bold uppercase tracking-wide ${scholarship.statusText}`}>
              {scholarship.status}
            </span>
          </div>
        </div>

        {/* Title & Organization */}
        <h3 className="font-bold text-[16px] leading-tight text-slate-900 mb-1">{scholarship.title}</h3>
        <div className="flex items-center gap-1.5 text-[12.5px] text-gray-500 mb-3.5">
          {scholarship.org}
          <BadgeCheck className="w-3.5 h-3.5 text-white fill-[#2563eb]" />
        </div>

        {/* Details Box */}
        <div className="bg-[#f9fafb] rounded-xl p-3.5 border border-gray-100 mb-4 mt-auto flex flex-col gap-2.5">
          <div className="grid grid-cols-2 gap-x-2">
            {/* Amount */}
            <div className="flex items-center gap-1.5 text-[12px] text-gray-600 font-medium">
              <Banknote className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{scholarship.amount}</span>
            </div>
            {/* Location */}
            <div className="flex items-center gap-1.5 text-[12px] text-gray-600 font-medium">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{scholarship.location}</span>
            </div>
          </div>

          {/* Degree */}
          <div className="flex items-center gap-1.5 text-[12px] text-gray-600 font-medium">
            <GraduationCap className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span>{scholarship.degree}</span>
          </div>

          {/* Deadline */}
          <div className="flex items-center gap-1.5 text-[12px] text-gray-800 font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#f43f5e] shrink-0" />
            <span>Ends: {scholarship.deadline}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="flex-1 py-2 text-[13px] font-semibold text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
            Details
          </button>
          <button className="flex-[1.2] py-2 text-[13px] font-semibold text-white bg-brand-blue rounded-md hover:bg-[#0000cc] transition-colors">
            Apply
          </button>
          <button className="p-2 border border-gray-200 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center">
            <Bookmark className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const FeaturedScholarshipsPage = () => {
  const [toast, setToast] = useState<string | null>(null);

  const handleExploreClick = (cardName: string) => {
    setToast(`Redirecting to opportunities from ${cardName}...`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="bg-white text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="min-h-screen py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Main Layout: Sidebar + Grid */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Filters Sidebar (Left Side) */}
            <aside className="w-full lg:w-1/4 bg-white rounded-2xl border border-gray-200/80 p-5 shrink-0 sticky top-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <h3 className="font-bold text-[18px] text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-gray-500" />
                  Filters
                </h3>
                <button className="text-[13px] font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                  Applied
                </button>
              </div>

              {/* 1. Study Level */}
              <FilterSection title="Study Level">
                <CheckboxLabel label="+2" />
                <CheckboxLabel label="Bachelor" />
                <CheckboxLabel label="Master" />
                <CheckboxLabel label="A Level" />
                <CheckboxLabel label="CTEVT" />
              </FilterSection>

              {/* 2. Course / Stream */}
              <FilterSection title="Course / Stream">
                <SearchInput placeholder="Search course..." />
                <CheckboxLabel label="Science" />
                <CheckboxLabel label="Management" />
                <CheckboxLabel label="IT" />
                <CheckboxLabel label="Medical" />
                <CheckboxLabel label="Humanities" />
                <CheckboxLabel label="Engineering" />
              </FilterSection>

              {/* 3. Location */}
              <FilterSection title="Location">
                <SearchInput placeholder="Search province, district, city..." />
                <CheckboxLabel label="All Nepal" />
                <CheckboxLabel label="Province" />
                <CheckboxLabel label="District" />
                <CheckboxLabel label="City" />
              </FilterSection>

              {/* 4. Scholarship Type */}
              <FilterSection title="Scholarship Type">
                <SearchInput placeholder="Search type..." />
                <CheckboxLabel label="Merit Based" />
                <CheckboxLabel label="Need Based" />
                <CheckboxLabel label="Entrance Based" />
                <CheckboxLabel label="Quota Based" />
                <CheckboxLabel label="Talent Based" />
              </FilterSection>

              {/* 5. Provider Type */}
              <FilterSection title="Provider Type">
                <SearchInput placeholder="Search provider..." />
                <CheckboxLabel label="Government" />
                <CheckboxLabel label="College" />
                <CheckboxLabel label="University" />
                <CheckboxLabel label="NGO" />
                <CheckboxLabel label="INGO" />
                <CheckboxLabel label="Private Organization" />
              </FilterSection>

              {/* 6. Scholarship Coverage */}
              <FilterSection title="Scholarship Coverage">
                <CheckboxLabel label="Full Scholarship" checked={true} />
                <CheckboxLabel label="75%" />
                <CheckboxLabel label="50%" />
                <CheckboxLabel label="25%" />
                <CheckboxLabel label="Tuition Only" />
              </FilterSection>

              {/* 7. GPA Requirement */}
              <FilterSection title="GPA Requirement">
                <CheckboxLabel label="No GPA Required" />
                <CheckboxLabel label="2.0+" />
                <CheckboxLabel label="2.5+" />
                <CheckboxLabel label="3.0+" />
                <CheckboxLabel label="3.5+" />
              </FilterSection>

              {/* 8. Entrance Requirement */}
              <FilterSection title="Entrance Requirement">
                <CheckboxLabel label="Entrance Required" />
                <CheckboxLabel label="No Entrance" />
                <CheckboxLabel label="Interview Only" />
              </FilterSection>

              {/* 9. Deadline */}
              <FilterSection title="Deadline">
                <CheckboxLabel label="Ending Soon" />
                <CheckboxLabel label="This Week" />
                <CheckboxLabel label="This Month" />
                <CheckboxLabel label="Ongoing" />
              </FilterSection>

              {/* 10. Special Category */}
              <FilterSection title="Special Category">
                <SearchInput placeholder="Search category..." />
                <CheckboxLabel label="Girls" />
                <CheckboxLabel label="Dalit" />
                <CheckboxLabel label="Remote Area" />
                <CheckboxLabel label="Underprivileged" />
                <CheckboxLabel label="Local Resident" />
              </FilterSection>
            </aside>

            {/* Grid Container (Right Side) */}
            <div className="w-full lg:w-3/4">
              {/* Top Controls Section */}
              <div className="mb-5 flex flex-col">
                {/* Top Row: Count and Search */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
                  <div className="text-[14px] font-medium text-[#555] mb-2">
                    Showing 1–20 of 256 scholarships
                  </div>
                  <div className="relative w-full sm:w-95">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search scholarships, locations, courses..."
                      className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-gray-400 shadow-sm"
                    />
                  </div>
                </div>

                {/* Bottom Row: Select All and Toggle */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2 pb-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4.5 h-4.5 accent-[#0000ff] border-gray-300 rounded cursor-pointer bg-white"
                    />
                    <span className="text-[15px] font-semibold text-slate-900 ml-1">Select all</span>
                    <span className="text-[14px] text-gray-500">(upto 5 quick apply scholarships)</span>
                  </label>

                  <div className="flex items-center gap-3">
                    <span className="text-[15px] font-semibold text-slate-900">Quick Apply</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-[#cbd5e1] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
                    </label>
                  </div>
                </div>

                <hr className="border-gray-200 mb-6" />
              </div>

              {/* Scholarship Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {scholarships.map((scholarship, index) => (
                  <React.Fragment key={scholarship.id}>
                    {/* 1. Inject First Custom Banner EXACTLY after the 6th card (index 6) */}
                    {index === 6 && (
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 w-full flex flex-col items-center mt-3 mb-5">
                        {/* Banner Content */}
                        <div className="w-full relative bg-linear-to-r from-white via-[#f0f6ff] to-[#e4f0ff] border border-[#dceaff] rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between overflow-hidden shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
                          <div className="absolute bottom-0 right-0 w-80 h-40 bg-blue-100 rounded-tl-full blur-3xl opacity-50 pointer-events-none"></div>
                          <div className="absolute top-0 left-0 w-64 h-32 bg-white rounded-br-full blur-2xl opacity-70 pointer-events-none"></div>

                          <span className="absolute top-4 right-5 text-[11px] font-semibold text-blue-400 italic">
                            Sponsored
                          </span>

                          <div className="flex flex-col items-center gap-2 z-10 shrink-0 mb-6 md:mb-0 md:ml-4">
                            <div className="w-16 h-16 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center justify-center p-2">
                              <span className="font-bold text-blue-900 text-sm tracking-tight text-center">
                                alorica
                              </span>
                            </div>
                            <span className="text-[13px] font-semibold text-slate-600">Alorica</span>
                          </div>

                          <div className="flex flex-col items-center md:items-start text-center md:text-left z-10 max-w-2xl px-0 md:px-10 grow">
                            <h3 className="text-[20px] md:text-[24px] font-extrabold text-[#1e293b] mb-4 tracking-tight leading-snug">
                              Stability, growth, and job security - our promises to you
                            </h3>
                            <button className="bg-[#514df0] hover:bg-[#4338ca] text-white text-[14px] font-semibold px-6 py-2.5 rounded-full transition-colors flex items-center gap-2 shadow-md shadow-blue-500/20">
                              Unlock new opportunities
                              <ArrowUpRight className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="hidden md:flex relative z-10 shrink-0 mr-8 items-center justify-center">
                            <div className="w-25 h-27.5 bg-blue-100/60 rounded-b-full rounded-t-lg flex items-center justify-center relative border border-white">
                              <div className="bg-blue-200/50 p-4 rounded-full">
                                <User className="w-8 h-8 text-[#514df0] fill-[#514df0]/20" />
                              </div>
                              <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-gray-400 rounded-full border-2 border-white shadow-sm"></div>
                            </div>
                          </div>
                        </div>

                        {/* Carousel Indicators */}
                        <div className="flex items-center gap-3 mt-5">
                          <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                            <span className="w-4 h-1.5 rounded-full bg-slate-500"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                          </div>
                          <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 2. Inject the Two Horizontal Cards EXACTLY after the 12th card (index 12) */}
                    {index === 12 && (
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 w-full flex flex-col md:flex-row gap-5 my-3">
                        {[1, 2].map((cardNum) => (
                          <div
                            key={cardNum}
                            className="flex-1 min-h-45 bg-linear-to-br from-[#ebe5f6] to-[#d8d0ea] rounded-xl flex overflow-hidden shadow-sm flex-col sm:flex-row"
                          >
                            <div className="bg-white w-full sm:w-37.5 shrink-0 flex flex-col items-center justify-center text-center p-5 rounded-none sm:rounded-r-[60px] z-10">
                              <div className="w-12.5 h-12.5 bg-white border border-gray-100 rounded-lg shadow-sm flex flex-col items-center justify-center mb-3 overflow-hidden relative">
                                <div className="flex gap-0.75 rotate-45">
                                  <div className="w-1 h-7.5 rounded-full bg-[#e9234b]"></div>
                                  <div className="w-1 h-7.5 rounded-full bg-[#1a2749]"></div>
                                  <div className="w-1 h-7.5 rounded-full bg-[#e9234b]"></div>
                                </div>
                              </div>
                              <p className="text-[#4a5173] text-[13px] font-semibold leading-tight">
                                Sutherland Global
                                <br />
                                Services
                              </p>
                            </div>
                            <div className="flex-1 p-6 sm:p-6 sm:pl-10 flex flex-col justify-center items-center sm:items-start">
                              <h2 className="text-[#212543] text-[18px] font-bold mb-4 leading-tight">
                                Unlock new horizons for your career through skill enrichment with us.
                              </h2>
                              <button
                                onClick={() => handleExploreClick(`Card ${cardNum}`)}
                                className="bg-[#556cfe] hover:bg-[#4358db] text-white px-5 py-2 rounded-full text-[13px] font-semibold flex items-center gap-1.5 transition-all active:scale-95"
                              >
                                Explore opportunities
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <ScholarshipCard scholarship={scholarship} />
                  </React.Fragment>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2 mt-12 mb-4">
                <button className="px-4 py-2 text-[14px] font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-800 transition-colors mr-2">
                  Previous
                </button>
                <button className="w-10 h-10 flex items-center justify-center text-[14px] font-medium text-white bg-brand-blue rounded-lg shadow-sm shadow-blue-500/30">
                  1
                </button>
                {[2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    className="w-10 h-10 flex items-center justify-center text-[14px] font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    {page}
                  </button>
                ))}
                <button className="px-4 py-2 text-[14px] font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors ml-2">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#212543] text-white px-6 py-3 rounded-lg text-sm font-medium shadow-lg z-1000 animate-in fade-in slide-in-from-bottom-10 duration-300">
          {toast}
        </div>
      )}
    </div>
  );
};

export default FeaturedScholarshipsPage;
