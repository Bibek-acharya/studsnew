"use client";

import React, { useState } from "react";
import GlobalFilterSection from "@/components/ui/GlobalFilterSection";
import {
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
import { FaSliders } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import Link from "next/link";

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

const Accordion: React.FC<{
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}> = ({ title, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <GlobalFilterSection
      title={title}
      isOpen={open}
      onToggle={() => setOpen((o) => !o)}
    >
      {children}
    </GlobalFilterSection>
  );
};

const CheckboxItem: React.FC<{
  id: string;
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}> = ({ id, label, count, checked, onChange }) => (
  <label
    htmlFor={id}
    className="group flex w-full cursor-pointer items-center justify-between mt-3"
  >
    <div className="flex items-center gap-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="custom-checkbox"
      />
      <span className="text-[14.5px] text-[#475569] transition-colors group-hover:text-gray-900">
        {label}
      </span>
    </div>
    {count !== undefined && (
      <span className="rounded-md bg-slate-50 px-2 py-0.5 text-[12px] font-medium text-slate-500">
        {count.toLocaleString()}
      </span>
    )}
  </label>
);

const SearchInput: React.FC<{
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}> = ({ placeholder, value, onChange }) => (
  <div className="relative mb-3 mt-4">
    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="block w-full rounded-lg border border-gray-200 bg-[#f8fafc] py-2 pl-9 pr-3 text-[13.5px] text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
    />
  </div>
);

const SelectInput: React.FC<{
  placeholder: string;
  value: string;
  options: Array<{ id: string; label: string }>;
  onChange: (v: string) => void;
  disabled?: boolean;
}> = ({ placeholder, value, options, onChange, disabled }) => (
  <div className="relative mb-3 mt-4">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="block w-full appearance-none rounded-md border border-gray-200 bg-[#f8fafc] py-2 px-3 pr-9 text-[13.5px] text-gray-900 outline-none transition disabled:bg-gray-100 disabled:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
    >
      <option value="" disabled={value !== ""}>
        {placeholder}
      </option>
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.label}
        </option>
      ))}
    </select>
    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
      <ChevronDown className="w-4 h-4" />
    </div>
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
          <Link 
            href={`/scholarship-finder/${scholarship.id}`}
            className="flex-1 py-2 text-[13px] font-semibold text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors text-center"
          >
            Details
          </Link>
          <Link 
            href="/scholarship-apply"
            className="flex-[1.2] py-2 text-[13px] font-semibold text-white bg-brand-blue rounded-md hover:bg-[#0000cc] transition-colors text-center"
          >
            Apply
          </Link>
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
  const [showAppliedDropdown, setShowAppliedDropdown] = useState(false);
  const [locating, setLocating] = useState(false);
  const [navLocString, setNavLocString] = useState("");
  const [filters, setFilters] = useState({
    studyLevel: [] as string[],
    stream: [] as string[],
    location: { province: "", district: "" },
    type: [] as string[],
    provider: [] as string[],
    coverage: [] as string[],
    gpa: "" as string,
    entrance: [] as string[],
    deadline: [] as string[],
    category: [] as string[],
  });

  const [courseSearch, setCourseSearch] = useState("");

  const handleLocate = () => {
    setLocating(true);
    setTimeout(() => {
      setNavLocString("Kathmandu");
      setLocating(false);
    }, 1500);
  };

  const toggleFilter = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => {
      const current = prev[key];
      if (Array.isArray(current)) {
        return {
          ...prev,
          [key]: current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value],
        };
      }
      return { ...prev, [key]: value };
    });
  };

  const clearAll = () => {
    setFilters({
      studyLevel: [],
      stream: [],
      location: { province: "", district: "" },
      type: [],
      provider: [],
      coverage: [],
      gpa: "",
      entrance: [],
      deadline: [],
      category: [],
    });
  };

  const appliedFiltersCount = Object.values(filters).reduce((acc, val) => {
    if (Array.isArray(val)) return acc + val.length;
    if (typeof val === "object" && val !== null) {
      return acc + (val.province ? 1 : 0) + (val.district ? 1 : 0);
    }
    return acc + (val ? 1 : 0);
  }, 0);

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
            <aside className="w-full lg:w-1/4 shrink-0 sticky top-8">
              <div className="relative w-full rounded-[20px] border border-gray-200 bg-white p-6">
                {/* Header */}
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaSliders size={18} className="text-black" />
                    <h3 className="font-black text-xl text-slate-900 tracking-tight">
                      Filters
                    </h3>
                  </div>
                  {appliedFiltersCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowAppliedDropdown((prev) => !prev)}
                      className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[12px] font-semibold text-blue-700 transition-colors"
                    >
                      Applied ({appliedFiltersCount})
                      <ChevronDown
                        className={`w-3 h-3 transition-transform ${showAppliedDropdown ? "rotate-180" : ""}`}
                      />
                    </button>
                  )}
                </div>

                {appliedFiltersCount > 0 && showAppliedDropdown && (
                  <div className="absolute left-0 right-0 top-16 z-30 mx-6 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                    <div className="flex flex-wrap gap-2 pb-3">
                      {Object.entries(filters).map(([key, value]) => {
                        if (Array.isArray(value)) {
                          return value.map((v) => (
                            <button
                              key={`${key}-${v}`}
                              onClick={() => toggleFilter(key as any, v)}
                              className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[11px] font-medium text-blue-700 transition-colors hover:border-red-100 hover:bg-red-50 hover:text-red-700"
                            >
                              {v}
                              <i className="fa-solid fa-xmark text-[10px]"></i>
                            </button>
                          ));
                        }
                        if (typeof value === "object" && value !== null) {
                          return Object.entries(value).map(([subKey, subVal]) =>
                            subVal ? (
                              <button
                                key={`${key}-${subVal}`}
                                onClick={() =>
                                  setFilters((prev) => ({
                                    ...prev,
                                    location: {
                                      ...prev.location,
                                      [subKey]: "",
                                    },
                                  }))
                                }
                                className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[11px] font-medium text-blue-700 transition-colors hover:border-red-100 hover:bg-red-50 hover:text-red-700"
                              >
                                {subVal}
                                <i className="fa-solid fa-xmark text-[10px]"></i>
                              </button>
                            ) : null,
                          );
                        }
                        return value ? (
                          <button
                            key={`${key}-${value}`}
                            onClick={() => setFilters((prev) => ({ ...prev, [key]: "" }))}
                            className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[11px] font-medium text-blue-700 transition-colors hover:border-red-100 hover:bg-red-50 hover:text-red-700"
                          >
                            {value}
                            <i className="fa-solid fa-xmark text-[10px]"></i>
                          </button>
                        ) : null;
                      })}
                    </div>
                    <div className="border-t border-gray-100 pt-2 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          clearAll();
                          setShowAppliedDropdown(false);
                        }}
                        className="text-[12px] font-semibold text-red-600 transition-colors hover:text-red-700"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </div>
                )}

                {/* Scholarship Near Me */}
                <div className="border-b border-gray-100 py-3">
                  <button
                    type="button"
                    onClick={handleLocate}
                    className="flex w-full items-center justify-center gap-2 rounded-md border border-blue-500 bg-blue-50 px-4 py-3 text-blue-500 outline-none transition-all duration-200 hover:bg-blue-100 active:bg-blue-200"
                  >
                    {locating ? (
                      <svg
                        className="animate-spin"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="3" />
                        <circle cx="12" cy="12" r="7" />
                        <line x1="12" y1="1" x2="12" y2="5" />
                        <line x1="12" y1="19" x2="12" y2="23" />
                        <line x1="1" y1="12" x2="5" y2="12" />
                        <line x1="19" y1="12" x2="23" y2="12" />
                      </svg>
                    ) : (
                      <i
                        className={`fa-solid ${navLocString ? "fa-location-dot" : "fa-location-crosshairs"} text-[16px]`}
                      ></i>
                    )}
                    <span className="text-[15px] font-medium">
                      {locating
                        ? "Locating..."
                        : navLocString
                          ? navLocString
                          : "Scholarship Near Me"}
                    </span>
                  </button>
                </div>

                {/* 1. Study Level */}
                <Accordion title="Study Level" defaultOpen>
                  {["+2", "Bachelor", "Master", "A Level", "CTEVT"].map((level) => (
                    <CheckboxItem
                      key={level}
                      id={`level-${level}`}
                      label={level}
                      checked={filters.studyLevel.includes(level)}
                      onChange={() => toggleFilter("studyLevel", level)}
                    />
                  ))}
                </Accordion>

                {/* 2. Course / Stream */}
                <Accordion title="Course / Stream" defaultOpen>
                  <SearchInput
                    placeholder="Search course..."
                    value={courseSearch}
                    onChange={setCourseSearch}
                  />
                  {["Science", "Management", "IT", "Medical", "Humanities", "Engineering"].map(
                    (stream) => (
                      <CheckboxItem
                        key={stream}
                        id={`stream-${stream}`}
                        label={stream}
                        checked={filters.stream.includes(stream)}
                        onChange={() => toggleFilter("stream", stream)}
                      />
                    ),
                  )}
                </Accordion>

                {/* 3. Location */}
                <Accordion title="Location">
                  <SelectInput
                    placeholder="Select Province"
                    value={filters.location.province}
                    options={[
                      { id: "Bagmati", label: "Bagmati" },
                      { id: "Gandaki", label: "Gandaki" },
                      { id: "Lumbini", label: "Lumbini" },
                    ]}
                    onChange={(val) =>
                      setFilters((prev) => ({
                        ...prev,
                        location: { ...prev.location, province: val, district: "" },
                      }))
                    }
                  />
                  <SelectInput
                    placeholder="Select District"
                    value={filters.location.district}
                    options={
                      filters.location.province === "Bagmati"
                        ? [
                            { id: "Kathmandu", label: "Kathmandu" },
                            { id: "Lalitpur", label: "Lalitpur" },
                            { id: "Bhaktapur", label: "Bhaktapur" },
                          ]
                        : []
                    }
                    onChange={(val) =>
                      setFilters((prev) => ({
                        ...prev,
                        location: { ...prev.location, district: val },
                      }))
                    }
                    disabled={!filters.location.province}
                  />
                </Accordion>

                {/* 4. Scholarship Type */}
                <Accordion title="Scholarship Type">
                  {[
                    "Merit Based",
                    "Need Based",
                    "Entrance Based",
                    "Quota Based",
                    "Talent Based",
                  ].map((type) => (
                    <CheckboxItem
                      key={type}
                      id={`type-${type}`}
                      label={type}
                      checked={filters.type.includes(type)}
                      onChange={() => toggleFilter("type", type)}
                    />
                  ))}
                </Accordion>

                {/* 5. Provider Type */}
                <Accordion title="Provider Type">
                  {[
                    "Government",
                    "College",
                    "University",
                    "NGO",
                    "INGO",
                    "Private Organization",
                  ].map((provider) => (
                    <CheckboxItem
                      key={provider}
                      id={`provider-${provider}`}
                      label={provider}
                      checked={filters.provider.includes(provider)}
                      onChange={() => toggleFilter("provider", provider)}
                    />
                  ))}
                </Accordion>

                {/* 6. Scholarship Coverage */}
                <Accordion title="Scholarship Coverage">
                  {["Full Scholarship", "75%", "50%", "25%", "Tuition Only"].map((cov) => (
                    <CheckboxItem
                      key={cov}
                      id={`cov-${cov}`}
                      label={cov}
                      checked={filters.coverage.includes(cov)}
                      onChange={() => toggleFilter("coverage", cov)}
                    />
                  ))}
                </Accordion>

                {/* 7. GPA Requirement */}
                <Accordion title="GPA Requirement">
                  {["No GPA Required", "2.0+", "2.5+", "3.0+", "3.5+"].map((gpa) => (
                    <label key={gpa} className="flex items-center gap-3 cursor-pointer mt-3">
                      <input
                        type="radio"
                        name="gpa"
                        className="custom-radio"
                        checked={filters.gpa === gpa}
                        onChange={() => setFilters((prev) => ({ ...prev, gpa }))}
                      />
                      <span className="text-[14.5px] text-[#475569]">{gpa}</span>
                    </label>
                  ))}
                </Accordion>

                {/* 8. Entrance Requirement */}
                <Accordion title="Entrance Requirement">
                  {["Entrance Required", "No Entrance", "Interview Only"].map((ent) => (
                    <CheckboxItem
                      key={ent}
                      id={`ent-${ent}`}
                      label={ent}
                      checked={filters.entrance.includes(ent)}
                      onChange={() => toggleFilter("entrance", ent)}
                    />
                  ))}
                </Accordion>

                {/* 9. Deadline */}
                <Accordion title="Deadline">
                  {["Ending Soon", "This Week", "This Month", "Ongoing"].map((dl) => (
                    <CheckboxItem
                      key={dl}
                      id={`dl-${dl}`}
                      label={dl}
                      checked={filters.deadline.includes(dl)}
                      onChange={() => toggleFilter("deadline", dl)}
                    />
                  ))}
                </Accordion>

                {/* 10. Special Category */}
                <Accordion title="Special Category">
                  {["Girls", "Dalit", "Remote Area", "Underprivileged", "Local Resident"].map(
                    (cat) => (
                      <CheckboxItem
                        key={cat}
                        id={`cat-${cat}`}
                        label={cat}
                        checked={filters.category.includes(cat)}
                        onChange={() => toggleFilter("category", cat)}
                      />
                    ),
                  )}
                </Accordion>
              </div>
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

      <style jsx global>{`
        .custom-checkbox {
          appearance: none;
          background-color: #fff;
          margin: 0;
          width: 1.15em;
          height: 1.15em;
          border: 1px solid #94a3b8;
          border-radius: 0.35rem;
          display: grid;
          place-content: center;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          flex-shrink: 0;
        }
        .custom-checkbox::before {
          content: "";
          width: 0.65em;
          height: 0.65em;
          transform: scale(0);
          transition: 120ms transform ease-in-out;
          box-shadow: inset 1em 1em white;
          clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
        }
        .custom-checkbox:checked {
          background-color: #2563eb;
          border-color: #2563eb;
        }
        .custom-checkbox:checked::before {
          transform: scale(1);
        }
        .custom-checkbox:hover {
          border-color: #64748b;
        }

        .custom-radio {
          appearance: none;
          background-color: #fff;
          margin: 0;
          width: 1.15em;
          height: 1.15em;
          border: 1px solid #94a3b8;
          border-radius: 50%;
          display: grid;
          place-content: center;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          flex-shrink: 0;
        }
        .custom-radio::before {
          content: "";
          width: 0.5em;
          height: 0.5em;
          border-radius: 50%;
          transform: scale(0);
          transition: 120ms transform ease-in-out;
          background-color: white;
        }
        .custom-radio:checked {
          background-color: #2563eb;
          border-color: #2563eb;
        }
        .custom-radio:checked::before {
          transform: scale(1);
        }
        .custom-radio:hover {
          border-color: #64748b;
        }
      `}</style>
    </div>
  );
};

export default FeaturedScholarshipsPage;
