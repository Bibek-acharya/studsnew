"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { FaSliders } from "react-icons/fa6";
import {
  BadgeCheckIcon,
  Star,
  MapPin,
  Award,
  MessageSquare,
  Bookmark,
  ChevronDown,
  Search,
  LocateFixed,
  Check,
} from "lucide-react";
import {
  apiService,
  College as ApiCollege,
} from "../../services/api";
import {
  CollegeFilters,
  DEFAULT_COLLEGE_FILTERS,
} from "@/app/find-college/types";
import GlobalFilterSection from "@/components/ui/GlobalFilterSection";
import {
  NEPAL_DISTRICTS,
  NEPAL_PROVINCES,
} from "@/lib/location-data";

// ── Types & Helpers ──────────────────────────────────────────────────────────

interface SelectedCourseContext {
  id?: string;
  title: string;
  collegesCount?: number;
}

interface CollegesAndCoursesPageProps {
  selectedCourse: SelectedCourseContext;
  onBack: () => void;
}

function formatFee(val: number) {
  if (val >= 2000000) return "NPR 20,00,000+";
  return `NPR ${val.toLocaleString("en-IN")}`;
}

// ── Sidebar Constants ────────────────────────────────────────────────────────

const ACADEMIC_LEVELS = [
  { id: "plus2", label: "+2 / Higher Secondary", count: 3200 },
  { id: "alevel", label: "A Level", count: 85 },
  { id: "diploma", label: "Diploma / CTEVT", count: 410 },
];

const PROGRAMS: Record<string, Array<{ id: string; label: string; count: number }>> = {
  plus2: [
    { id: "p2_sci", label: "Science", count: 1200 },
    { id: "p2_mgmt", label: "Management", count: 1500 },
    { id: "p2_hum", label: "Humanities", count: 300 },
    { id: "p2_edu", label: "Education", count: 150 },
    { id: "p2_law", label: "Law", count: 50 },
  ],
  alevel: [
    { id: "al_sci", label: "A Level - Science", count: 45 },
    { id: "al_nonsci", label: "A Level - Non-Science/Mgmt", count: 40 },
  ],
  diploma: [
    { id: "d_eng", label: "Engineering (CTEVT)", count: 150 },
    { id: "d_med", label: "Medical & Nursing (CTEVT)", count: 120 },
    { id: "d_hm", label: "Hotel Management & Tourism", count: 90 },
    { id: "d_agr", label: "Agriculture & Forestry (CTEVT)", count: 50 },
  ],
};

const provinceIdMap: Record<string, string> = {
  "Koshi Province": "prov_koshi",
  "Madhesh Province": "prov_madhesh",
  "Bagmati Province": "prov_bagmati",
  "Gandaki Province": "prov_gandaki",
  "Lumbini Province": "prov_lumbini",
  "Karnali Province": "prov_karnali",
  "Sudurpashchim Province": "prov_sudur",
};

const districtIdMap: Record<string, string> = {
  Kathmandu: "d_kathmandu",
  Lalitpur: "d_lalitpur",
  Bhaktapur: "d_bhaktapur",
  Pokhara: "d_pokhara",
};

const provinceOptions = NEPAL_PROVINCES.map((provinceName, index) => {
  const provinceKey = provinceName as keyof typeof NEPAL_DISTRICTS;
  const provinceId = provinceIdMap[provinceName] || `prov_${index}`;
  const districts = (NEPAL_DISTRICTS[provinceKey] || []).map((districtName: string) => ({
    id: districtIdMap[districtName] || `d_${districtName.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`,
    label: districtName,
  }));
  return { id: provinceId, label: provinceName.replace(/\s+Province$/, ""), districts };
});

const COLLEGE_TYPES = [
  { id: "ct_private", label: "Private", count: 250 },
  { id: "ct_public", label: "Public / Govt", count: 50 },
];

const SORT_OPTIONS = [
  { id: "popularity", label: "Popularity" },
  { id: "rating", label: "Highest Rating" },
  { id: "fee_low", label: "Fee: Low to High" },
];

// ── Sidebar Sub-Components ───────────────────────────────────────────────────

const SelectInput: React.FC<{
  placeholder: string;
  value: string;
  options: Array<{ id: string; label: string }>;
  onChange: (v: string) => void;
  disabled?: boolean;
}> = ({ placeholder, value, options, onChange, disabled }) => (
  <div className="relative mb-3">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="block w-full appearance-none rounded-md border border-gray-200 bg-[#f8fafc] py-2 px-3 pr-9 text-[13.5px] text-gray-900 outline-none transition disabled:bg-gray-100 disabled:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
    >
      <option value="" disabled={value !== ""}>{placeholder}</option>
      {options.map((opt) => (<option key={opt.id} value={opt.id}>{opt.label}</option>))}
    </select>
    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
      <ChevronDown size={14} />
    </div>
  </div>
);

const SearchInput: React.FC<{ placeholder: string; value: string; onChange: (v: string) => void }> = ({ placeholder, value, onChange }) => (
  <div className="relative mb-3">
    <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="block w-full rounded-lg border border-gray-200 bg-[#f8fafc] py-2 pl-9 pr-3 text-[13.5px] text-gray-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
  </div>
);

const CheckboxItem: React.FC<{ id: string; label: string; count?: number; checked: boolean; onChange: () => void }> = ({ id, label, count, checked, onChange }) => (
  <label htmlFor={id} className="group flex w-full cursor-pointer items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="relative flex items-center justify-center">
        <input id={id} type="checkbox" checked={checked} onChange={onChange} className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 bg-white transition-all checked:border-blue-600 checked:bg-blue-600" />
        <Check size={14} className="pointer-events-none absolute text-white opacity-0 transition-opacity peer-checked:opacity-100" />
      </div>
      <span className="text-[14.5px] text-[#475569] transition-colors group-hover:text-gray-900">{label}</span>
    </div>
    {count !== undefined && (<span className="rounded-md bg-slate-50 px-2 py-0.5 text-[12px] font-medium text-slate-500">{count.toLocaleString()}</span>)}
  </label>
);

const RadioItem: React.FC<{ id: string; label: string; name: string; checked: boolean; onChange: () => void }> = ({ id, label, name, checked, onChange }) => (
  <label htmlFor={id} className="group flex cursor-pointer items-center gap-3">
    <div className="relative flex items-center justify-center">
      <input id={id} type="radio" name={name} checked={checked} onChange={onChange} className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-gray-300 bg-white transition-all checked:border-blue-600 checked:bg-blue-600" />
      <div className="pointer-events-none absolute h-2 w-2 rounded-full bg-white opacity-0 transition-opacity peer-checked:opacity-100" />
    </div>
    <span className="text-[14.5px] text-[#475569] transition-colors group-hover:text-gray-900">{label}</span>
  </label>
);

const FilterAccordion: React.FC<{ title: string; defaultOpen?: boolean; children: React.ReactNode }> = ({ title, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <GlobalFilterSection title={title} isOpen={open} onToggle={() => setOpen((o) => !o)}>
      {children}
    </GlobalFilterSection>
  );
};

// ── Shared UI Components ────────────────────────────────────────────────────

const Toast: React.FC<{ message: string }> = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
    className="bg-neutral-800 text-white px-5 py-3 rounded-md shadow-lg text-[14px] font-medium"
  >
    {message}
  </motion.div>
);

// ── College Card Component (ProgramCard) ───────────────────────────────────

const ProgramCard: React.FC<{
  college: ApiCollege;
  isVerified: boolean;
  isSaved: boolean;
  isSelected: boolean;
  isQuickInquiryMode: boolean;
  onToggleSaved: () => void;
  onToggleSelection: () => void;
  addToast: (msg: string) => void;
}> = ({
  college,
  isVerified,
  isSaved,
  isSelected,
  isQuickInquiryMode,
  onToggleSaved,
  onToggleSelection,
  addToast,
}) => {
  const description =
    (typeof college.description === "string" && college.description) ||
    "Explore academics, facilities, and counselling support for this college.";

  return (
    <div className="flex h-full cursor-pointer flex-col rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:border-blue-500/20">
      <div className="group relative h-35 shrink-0 overflow-hidden rounded-xl">
        {college.featured && (
          <div className="absolute top-3 left-3 z-10 rounded bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
            Featured
          </div>
        )}
        {college.image_url ? (
          <img
            src={college.image_url}
            alt={college.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-blue-50"></div>
        )}
        {isQuickInquiryMode && (
          <label className="absolute right-2 top-2 z-10 cursor-pointer" onClick={(e) => e.stopPropagation()}>
            <div className="relative flex h-6 w-6 items-center justify-center">
              <input type="checkbox" checked={isSelected} onChange={onToggleSelection} className="peer sr-only" />
              <div className="absolute inset-0 rounded-md border border-slate-300 bg-white/90 shadow-sm backdrop-blur-sm transition-colors hover:border-slate-400 peer-checked:border-blue-600 peer-checked:bg-blue-600"></div>
              <Check size={16} className="pointer-events-none absolute z-10 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
            </div>
          </label>
        )}
      </div>

      <div className="flex flex-1 flex-col px-0 pt-3">
        <div className="flex items-center gap-1.5 mb-2">
          <button type="button" className="truncate text-left text-[20px] font-bold text-slate-800 tracking-tight transition-colors hover:text-blue-600">
            {college.name}
          </button>
          {isVerified && (
            <BadgeCheckIcon className="w-5 h-5 text-white fill-blue-500 shrink-0" />
          )}
        </div>

        <div className="mb-2 flex min-w-0 items-center text-[14px] text-gray-500">
          <div className="flex items-center gap-1 font-bold text-slate-700">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{Number(college.rating || 0).toFixed(1)}</span>
          </div>
          <span className="mx-3 text-gray-300 font-light">|</span>
          <div className="flex items-center gap-1.5">
            <Award className="w-4.5 h-4.5 text-gray-400" />
            <span className="font-semibold text-slate-700">{college.type || "College"}</span>
          </div>
          <span className="mx-3 text-gray-300 font-light">|</span>
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            <MapPin className="w-4.5 h-4.5 text-gray-400" />
            <span className="block min-w-0 truncate font-semibold text-slate-700">{college.location || "Kathmandu"}</span>
          </div>
        </div>

        <div className="flex items-start gap-2 text-[14px] text-gray-500 mb-2">
          <Award size={18} className="text-gray-400 shrink-0 mt-0.75" />
          <p className="leading-snug pr-4 font-semibold text-slate-700 line-clamp-1">
            {college.affiliation || "NEB, Tribhuvan University, Purbanchal University"}
          </p>
        </div>

        <div className="mb-4 pr-2">
          <p className="line-clamp-2 text-[14px] leading-relaxed text-gray-500">{description}</p>
          <button type="button" className="mt-1 text-[14px] font-semibold text-blue-600 hover:underline">Read more</button>
        </div>

        <div className="border-t border-dashed border-gray-200 mb-4" />

        <div className="flex flex-col gap-3 mt-auto">
          <button
            type="button"
            onClick={() => addToast(`Initiating counselling for ${college.name}...`)}
            className="w-full text-white font-medium text-[14px] py-2.5 px-4 rounded-md transition-colors flex items-center justify-center bg-blue-600 hover:bg-blue-700"
          >
            Get counselling
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => addToast(`Opening inquiry for ${college.name}...`)}
              className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-slate-600 font-medium py-2 px-2 rounded-md transition-colors text-[13px]"
            >
              <MessageSquare size={16} className="text-gray-500" />
              Inquiry
            </button>
            <button
              onClick={() => addToast(`Comparing ${college.name}...`)}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-2 rounded-md transition-colors text-[13px]"
            >
              Compare now
            </button>
            <button
              onClick={onToggleSaved}
              className={`w-10 flex items-center justify-center border rounded-md transition-colors shrink-0 ${isSaved ? "border-blue-200 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}
            >
              <Bookmark className={`w-4 h-4 transition-all ${isSaved ? "text-blue-600 fill-blue-600" : "text-gray-400"}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Mock Data ──────────────────────────────────────────────────────────────

const MOCK_COLLEGES: ApiCollege[] = [
  {
    id: 101,
    name: "KIST Higher Secondary School & College",
    rating: 4.8,
    type: "Private",
    location: "Kamalpokhari, Kathmandu",
    affiliation: "NEB",
    image_url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1000&auto=format&fit=crop",
    description: "KIST is a premier academic institution in Nepal providing high-quality education in Management and Science.",
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
    image_url: "https://images.unsplash.com/photo-1523050853064-dbad6f987297?q=80&w=1000&auto=format&fit=crop",
    description: "KMC has established itself as one of the most prominent academic institutions for higher education in Nepal.",
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
    image_url: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1000&auto=format&fit=crop",
    description: "An educational institution of high repute, run by the Nepal Jesuit Society, providing excellence in education.",
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
    image_url: "https://images.unsplash.com/photo-1492538356227-3eb926ca10aa?q=80&w=1000&auto=format&fit=crop",
    description: "The British College offers internationally recognized degrees in partnership with top UK universities.",
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
    image_url: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=1000&auto=format&fit=crop",
    description: "Providing quality education with a focus on holistic development and research-oriented learning.",
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
    image_url: "https://images.unsplash.com/photo-1525921429624-479b6a29d810?q=80&w=1000&auto=format&fit=crop",
    description: "Trinity is a leading college for +2 and Bachelor levels, known for its academic discipline.",
    verified: true,
    featured: false,
  },
];

const MOCK_COURSES = [
  { id: "1", title: "BBA (Bachelor of Business Administration)", colleges: "120+" },
  { id: "2", title: "B.Sc CSIT (B.Sc. in Computer Science & IT)", colleges: "54+" },
  { id: "3", title: "BIT (Bachelor in Information Technology)", colleges: "35+" },
  { id: "4", title: "BBM (Bachelor of Business Management)", colleges: "45+" },
  { id: "5", title: "BIM (Bachelor of Information Management)", colleges: "25+" },
  { id: "6", title: "Science (+2)", colleges: "200+" },
  { id: "7", title: "Management (+2)", colleges: "300+" },
];

// ── Main Page Component ──────────────────────────────────────────────────────

const CollegesAndCoursesPage: React.FC<CollegesAndCoursesPageProps> = ({
  selectedCourse,
}) => {
  const [activeCourseId, setActiveCourseId] = useState<string | null>(selectedCourse.id || "2");
  const [filters, setFilters] = useState<CollegeFilters>(DEFAULT_COLLEGE_FILTERS);
  const [quickApplyMode, setQuickApplyMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [toasts, setToasts] = useState<string[]>([]);
  const [locating, setLocating] = useState(false);
  const [programSearch, setProgramSearch] = useState("");

  const addToast = (msg: string) => {
    setToasts((prev) => [...prev, msg]);
    setTimeout(() => setToasts((prev) => prev.slice(1)), 3000);
  };

  const { data: filterCountsResponse } = useQuery({
    queryKey: ["collegeFilterCounts"],
    queryFn: () => apiService.getCollegeFilterCounts(),
  });

  const getFacetCount = (id: string): number | undefined => {
    return filterCountsResponse?.data?.facet_counts_by_id?.[id] ?? undefined;
  };

  const { data: coursesResponse } = useQuery({
    queryKey: ["education-courses-mini"],
    queryFn: () => apiService.getEducationCourses(),
  });

  const backendCourses = useMemo(() => {
    const list = coursesResponse?.data?.courses || [];
    return list.length > 0 ? list : MOCK_COURSES;
  }, [coursesResponse]);

  const { data: collegesResponse, isLoading: collegesLoading } = useQuery({
    queryKey: ["colleges-list-filtered", filters, activeCourseId],
    queryFn: () =>
      apiService.getColleges({
        search: filters.search || undefined,
        location: filters.district[0] || filters.province[0] || undefined,
        courseId: activeCourseId || undefined,
        sortBy: filters.sortBy,
        pageSize: 18,
      }),
  });

  const colleges = useMemo(() => {
    const list = collegesResponse?.data?.colleges || [];
    return list.length > 0 ? list : MOCK_COLLEGES;
  }, [collegesResponse]);

  const toggleFilter = (key: keyof CollegeFilters, value: string) => {
    setFilters((prev) => {
      const current = prev[key] as string[];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { ...prev, [key]: next };
    });
  };

  const toggleSaved = (id: number) => {
    setSavedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    addToast(savedIds.includes(id) ? "Removed from bookmarks" : "Added to bookmarks!");
  };

  const toggleSelection = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleLocate = () => {
    if (locating) return;
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=en`);
            const data = await res.json();
            const city = data.city || data.locality || "Kathmandu";
            setFilters(prev => ({ ...prev, search: city }));
            addToast(`Location found: ${city}`);
          } catch { addToast("Could not detect location."); } finally { setLocating(false); }
        },
        () => { addToast("Location permission denied."); setLocating(false); }
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-start p-4 sm:p-8 gap-8 md:gap-10 font-sans">
      {/* Top Bar for Courses */}
      <div className="bg-blue-50 w-full max-w-[1440px] rounded-lg py-5 px-6 md:py-6 md:px-8 overflow-hidden shadow-sm border border-blue-100">
        <div className="flex gap-4 md:gap-5 overflow-x-auto snap-x pb-2 no-scrollbar">
          {backendCourses.map((course: any) => {
            const isSelected = String(course.id) === String(activeCourseId);
            return (
              <div
                key={course.id} onClick={() => setActiveCourseId(String(course.id))}
                className={`relative flex-shrink-0 w-[190px] sm:w-[220px] bg-white rounded-md px-4 py-3.5 border-[1.5px] transition-all duration-200 cursor-pointer snap-start flex flex-col justify-between min-h-[92px] shadow-sm hover:shadow-md ${isSelected ? "border-blue-600" : "border-transparent hover:border-gray-200"}`}
                title={course.title}
              >
                <h3 className="text-slate-900 font-semibold text-[13px] leading-[18px] truncate pr-6">{course.title}</h3>
                <div className="mt-1.5 text-blue-600 text-[11px] font-medium flex items-center">{course.colleges || "10+"} colleges <ChevronDown size={10} className="-rotate-90 ml-1" /></div>
                {isSelected && (<div className="absolute top-[14px] right-[14px]"><Check size={16} className="bg-blue-600 rounded-full text-white p-0.5" /></div>)}
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full max-w-[1440px] flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
        {/* Sidebar */}
        <aside className="w-full lg:w-[280px] shrink-0 bg-white rounded-3xl p-5 md:p-6 border border-gray-100 shadow-sm self-start">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-3"><FaSliders size={18} className="text-black" /><h3 className="font-black text-xl text-slate-900 tracking-tight">Filters</h3></div>
          </div>
          <div className="border-b border-gray-100 py-3">
            <button type="button" onClick={handleLocate} className="flex w-full items-center justify-start gap-2 rounded-md border border-gray-200 px-4 py-3 text-gray-700 hover:text-blue-600 outline-none transition-all duration-200 shadow-sm">
              {locating ? <LocateFixed size={18} className="animate-spin" /> : <LocateFixed size={18} />}
              <span className="text-[15px] font-medium">{locating ? "Locating..." : "College Near Me"}</span>
            </button>
          </div>
          <FilterAccordion title="Academic Level" defaultOpen>
            <div className="flex flex-col gap-3.5 pt-1">
              {ACADEMIC_LEVELS.map((item) => (
                <CheckboxItem key={item.id} id={`acad-${item.id}`} label={item.label} count={getFacetCount(item.id)} checked={filters.academic.includes(item.id)} onChange={() => toggleFilter("academic", item.id)} />
              ))}
            </div>
          </FilterAccordion>
          <FilterAccordion title="Program" defaultOpen>
            <SearchInput placeholder="Search programs..." value={programSearch} onChange={setProgramSearch} />
            <div className="flex flex-col gap-3.5 pt-1">
              {(filters.academic.flatMap(a => PROGRAMS[a]||[])).filter(p => p.label.toLowerCase().includes(programSearch.toLowerCase())).map(item => (
                <CheckboxItem key={item.id} id={`prog-${item.id}`} label={item.label} count={getFacetCount(item.id)} checked={filters.program.includes(item.id)} onChange={() => toggleFilter("program", item.id)} />
              ))}
            </div>
          </FilterAccordion>
          <FilterAccordion title="Location" defaultOpen>
            <div className="flex flex-col gap-2 pt-1">
              <SelectInput placeholder="Select Province" value={filters.province[0] || ""} options={provinceOptions} onChange={(val) => setFilters(prev => ({ ...prev, province: val ? [val] : [], district: [] }))} />
              <SelectInput placeholder="Select District" value={filters.district[0] || ""} options={filters.province[0] ? provinceOptions.find(p => p.id === filters.province[0])?.districts || [] : []} onChange={(val) => setFilters(prev => ({ ...prev, district: val ? [val] : [] }))} disabled={!filters.province[0]} />
            </div>
          </FilterAccordion>
          <FilterAccordion title="Colleges Type">
            <div className="flex flex-col gap-3.5 pt-1">
              {COLLEGE_TYPES.map(item => (<CheckboxItem key={item.id} id={`type-${item.id}`} label={item.label} count={getFacetCount(item.id)} checked={filters.type.includes(item.id)} onChange={() => toggleFilter("type", item.id)} />))}
            </div>
          </FilterAccordion>
          <FilterAccordion title="Total Fee Range">
            <div className="px-2 pb-2 pt-2">
              <div className="mb-4 flex items-center justify-between"><span className="text-[13px] font-medium text-gray-400">NPR 0</span><span className="rounded-md bg-blue-50 px-2.5 py-1 text-[14px] font-bold text-blue-600">{formatFee(filters.feeMax)}</span></div>
              <input type="range" min={0} max={2000000} step={50000} value={filters.feeMax} onChange={(e) => setFilters(prev => ({ ...prev, feeMax: Number(e.target.value) }))} className="w-full accent-blue-600 cursor-pointer" />
            </div>
          </FilterAccordion>
          <FilterAccordion title="Sort By" defaultOpen>
            <div className="flex flex-col gap-3.5 pt-1">
              {SORT_OPTIONS.map(opt => (<RadioItem key={opt.id} id={`sort-${opt.id}`} name="sort" label={opt.label} checked={filters.sortBy === opt.id} onChange={() => setFilters(prev => ({ ...prev, sortBy: opt.id }))} />))}
            </div>
          </FilterAccordion>
        </aside>

        {/* Main Grid Section */}
        <div className="flex-1 w-full flex flex-col gap-6 md:gap-8">
          <div className="w-full flex flex-col gap-4 px-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="text-[16px] text-slate-900">Showing 1–{colleges.length} of {colleges.length} <span className="font-bold">Colleges</span></div>
              <div className="w-full md:w-80">
                <SearchInput placeholder="Search colleges, courses..." value={filters.search} onChange={(v) => setFilters(prev => ({ ...prev, search: v }))} />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={quickApplyMode} onChange={(e) => {setQuickApplyMode(e.target.checked); if(!e.target.checked) setSelectedIds([]);}} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-600 accent-blue-600" />
                <span className="text-[15px] text-slate-900 font-medium">Select all <span className="text-gray-500 font-normal">(upto 5 quick apply)</span></span>
              </label>
              <div className="flex items-center gap-3">
                <span className="text-[15px] font-semibold text-slate-900">Quick Apply</span>
                <button 
                  onClick={() => setQuickApplyMode(!quickApplyMode)} 
                  className={`relative inline-flex h-6 w-11 rounded-full px-1 items-center transition-colors ${quickApplyMode ? "bg-blue-600" : "bg-gray-300"}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${quickApplyMode ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            </div>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {collegesLoading ? Array.from({ length: 6 }).map((_, i) => (<div key={i} className="max-w-[380px] w-full bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm animate-pulse h-[400px]" />))
              : colleges.map((college) => (
                <ProgramCard
                  key={college.id}
                  college={college}
                  isVerified={Boolean(college.verified)}
                  isSaved={savedIds.includes(college.id)}
                  isSelected={selectedIds.includes(college.id)}
                  isQuickInquiryMode={quickApplyMode}
                  onToggleSaved={() => toggleSaved(college.id)}
                  onToggleSelection={() => toggleSelection(college.id)}
                  addToast={addToast}
                />
              ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-5 right-5 flex flex-col gap-2 z-[100]"><AnimatePresence>{toasts.map((toast, idx) => (<Toast key={idx} message={toast} />))}</AnimatePresence></div>
    </div>
  );
};

export default CollegesAndCoursesPage;
