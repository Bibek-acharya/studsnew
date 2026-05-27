"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaSliders, FaStar } from "react-icons/fa6";
import GlobalFilterSection from "@/components/ui/GlobalFilterSection";
import { ProgramCard } from "@/components/find-college/CollegeGrid";
import Pagination from "@/components/ui/Pagination";
import type { College } from "@/services/api";
import {
  Search,
  ChevronDown,
  Check,
} from "lucide-react";

interface UniversityOption {
  id: string;
  name: string;
  collegeCount: string;
}

interface AffiliatedCollegesProps {
  universities: UniversityOption[];
  colleges: College[];
  type: "nepali" | "foreign";
}

const Accordion: React.FC<{
  title: string;
  defaultOpen?: boolean;
  hideDivider?: boolean;
  children: React.ReactNode;
}> = ({ title, defaultOpen = false, hideDivider = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <GlobalFilterSection
      title={title}
      isOpen={open}
      onToggle={() => setOpen((o) => !o)}
      hideDivider={hideDivider}
    >
      {children}
    </GlobalFilterSection>
  );
};

const CheckboxItem: React.FC<{
  id: string;
  label: React.ReactNode;
  count?: number;
  checked?: boolean;
}> = ({ id, label, count, checked = false }) => (
  <label htmlFor={id} className="group flex w-full cursor-pointer items-center justify-between">
    <div className="flex items-center gap-3">
      <input
        id={id}
        type="checkbox"
        defaultChecked={checked}
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

const RadioItem: React.FC<{
  id: string;
  label: string;
  name: string;
  checked?: boolean;
}> = ({ id, label, name, checked = false }) => (
  <label htmlFor={id} className="group flex cursor-pointer items-center gap-3">
    <input
      id={id}
      type="radio"
      name={name}
      defaultChecked={checked}
      className="custom-radio"
    />
    <span className="text-[14.5px] text-[#475569] transition-colors group-hover:text-gray-900">
      {label}
    </span>
  </label>
);

const ACADEMIC_LEVELS = [
  { id: "bachelors", label: "Bachelors", count: 1200 },
  { id: "masters", label: "Masters", count: 800 },
  { id: "phd", label: "PhD", count: 200 },
];

const COLLEGE_TYPES = [
  { id: "ct_private", label: "Private", count: 250 },
  { id: "ct_public", label: "Public / Govt", count: 50 },
  { id: "ct_community", label: "Community", count: 20 },
  { id: "ct_constituent", label: "Constituent", count: 15 },
  { id: "ct_foreign", label: "Foreign Affiliated", count: 35 },
];

const COURSE_DURATIONS = ["1 Year", "2 Years", "3 Years", "4 Years", "5+ Years"];

const FACILITIES = ["Hostel", "Transportation", "Library", "Lab", "Sports", "Cafeteria"];

const SORT_OPTIONS = [
  { id: "popularity", label: "Popularity" },
  { id: "rating", label: "Highest Rating" },
  { id: "verified", label: "Verified First" },
  { id: "fee_low", label: "Fee: Low to High" },
  { id: "fee_high", label: "Fee: High to Low" },
];

const AffiliatedColleges: React.FC<AffiliatedCollegesProps> = ({
  universities,
  colleges: sampleColleges,
  type,
}) => {
  const router = useRouter();
  const [activeUni, setActiveUni] = useState(universities[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [quickInquiryMode, setQuickInquiryMode] = useState(false);
  const ITEMS_PER_PAGE = 18;

  const handleNavigate = (view: string, data?: any) => {
    if (view === "collegeDetails" && data?.id) {
      router.push(`/find-college/${data.id}`);
    }
  };

  const toggleSaved = (id: number) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleClaim = () => {};

  const handleSingleInquiry = () => {};

  const filteredColleges = sampleColleges.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredColleges.length / ITEMS_PER_PAGE);
  const currentItems = filteredColleges.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const activeUniName = universities.find((u) => u.id === activeUni)?.name || "University";
  const shortName = activeUniName.replace(/\s+University$/, "");

  return (
    <div className="w-full bg-[#f8fafc] font-sans text-slate-800">
      {/* Header - University Selector (matching course finder view college) */}
      <header className="pb-4 pt-8">
        <div className="mx-auto w-full max-w-[1340px] px-6">
          <h2 className="mb-5 text-[22px] font-bold tracking-tight text-[#0f172a]">
            Affiliated University
          </h2>
          <div className="overflow-hidden rounded-md border border-blue-100 bg-blue-50 px-6 py-5 md:px-8 md:py-6">
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x md:gap-5 no-scrollbar">
              {universities.map((uni) => (
                <button
                  key={uni.id}
                  onClick={() => setActiveUni(uni.id)}
                  className={`relative flex min-h-[92px] w-[190px] shrink-0 snap-start flex-col justify-between rounded-md border-[1.5px] bg-white px-4 py-3.5 text-left transition-all duration-200 sm:w-[220px] ${
                    activeUni === uni.id
                      ? "border-blue-600"
                      : "border-transparent hover:border-gray-200"
                  }`}
                  title={uni.name}
                >
                  <h3 className="truncate pr-6 text-[13px] font-semibold leading-[18px] text-slate-900">
                    {uni.name}
                  </h3>
                  <div className="mt-1.5 flex items-center text-[11px] font-medium text-blue-600">
                    {uni.collegeCount} colleges
                    <ChevronDown size={10} className="-ml-1 -rotate-90" />
                  </div>
                  {activeUni === uni.id && (
                    <div className="absolute right-[14px] top-[14px]">
                      <Check size={16} className="rounded-full bg-blue-600 p-0.5 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto mt-6 flex w-full max-w-[1340px] flex-col gap-8 px-6 lg:flex-row">
        {/* Sidebar Filters */}
        <aside className="w-full shrink-0 lg:w-[280px]">
          <div className="relative w-full rounded-[20px] border border-gray-200 bg-white p-6">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaSliders size={18} className="text-black" />
                <h3 className="text-xl font-black tracking-tight text-slate-900">Filters</h3>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <Accordion title="Academic Level">
                <div className="flex flex-col gap-3.5 pt-1">
                  {ACADEMIC_LEVELS.map((item) => (
                    <CheckboxItem key={item.id} id={`acad-${item.id}`} label={item.label} count={item.count} />
                  ))}
                </div>
              </Accordion>

              <Accordion title="Program">
                <div className="relative mb-4 group">
                  <input
                    type="text"
                    placeholder="Search programs..."
                    className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] text-slate-900 outline-none transition group-focus-within:border-blue-500 group-focus-within:ring-1 group-focus-within:ring-blue-500"
                  />
                  <i className="fa-solid fa-magnifying-glass absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400"></i>
                </div>
                <div className="custom-scrollbar flex max-h-55 flex-col gap-3.5 overflow-y-auto pr-1">
                  {["BBA", "BBS", "BCA", "BIT", "BIM", "BHM", "BA", "BSc", "MBA"].map((prog) => (
                    <CheckboxItem key={prog} id={`prog-${prog}`} label={prog} />
                  ))}
                </div>
              </Accordion>

              <Accordion title="Location">
                <div className="flex flex-col gap-2 pt-1">
                  <select className="w-full rounded-md border border-gray-200 bg-[#f8fafc] px-3 py-2 text-[13.5px] text-gray-900 outline-none transition focus:border-blue-500">
                    <option value="">Select Province</option>
                    <option>Province 1</option>
                    <option>Province 2</option>
                    <option>Province 3</option>
                  </select>
                  <select className="w-full rounded-md border border-gray-200 bg-[#f8fafc] px-3 py-2 text-[13.5px] text-gray-900 outline-none transition focus:border-blue-500">
                    <option value="">Select District</option>
                  </select>
                  <select className="w-full rounded-md border border-gray-200 bg-[#f8fafc] px-3 py-2 text-[13.5px] text-gray-900 outline-none transition focus:border-blue-500">
                    <option value="">Select Municipality / Gaunpalika</option>
                  </select>
                </div>
              </Accordion>

              <Accordion title="Colleges Type">
                <div className="flex flex-col gap-3.5 pt-1">
                  {COLLEGE_TYPES.map((item) => (
                    <CheckboxItem key={item.id} id={`type-${item.id}`} label={item.label} count={item.count} />
                  ))}
                </div>
              </Accordion>

              <Accordion title="Total Fee Range">
                <div className="px-2 pb-2 pt-2">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-[13px] font-medium text-gray-400">NPR 0</span>
                    <span className="rounded-md bg-blue-50 px-2.5 py-1 text-[14px] font-bold text-blue-600">NPR 20,00,000+</span>
                  </div>
                  <input type="range" min={0} max={2000000} step={50000} defaultValue={1000000} className="fee-range w-full" />
                </div>
              </Accordion>

              <Accordion title="Course Duration">
                <div className="flex flex-col gap-3.5 pt-1">
                  {COURSE_DURATIONS.map((dur) => (
                    <CheckboxItem key={dur} id={`dur-${dur}`} label={dur} />
                  ))}
                </div>
              </Accordion>

              <Accordion title="Facilities">
                <div className="flex flex-col gap-3.5 pt-1">
                  {FACILITIES.map((fac) => (
                    <CheckboxItem key={fac} id={`fac-${fac.toLowerCase()}`} label={fac} />
                  ))}
                </div>
              </Accordion>

              <Accordion title="Rating">
                <div className="flex flex-col gap-3.5 pt-1">
                  <CheckboxItem id="rating-4.5" label={<><FaStar className="inline text-yellow-500" /> 4.5 & above (Top Rated)</>} />
                  <CheckboxItem id="rating-4.0" label={<><FaStar className="inline text-yellow-500" /> 4.0 & above</>} />
                  <CheckboxItem id="rating-3.5" label={<><FaStar className="inline text-yellow-500" /> 3.5 & above</>} />
                  <CheckboxItem id="rating-3.0" label={<><FaStar className="inline text-yellow-500" /> 3.0 & above</>} />
                </div>
              </Accordion>

              <Accordion title="Sort By" hideDivider>
                <div className="flex flex-col gap-3.5">
                  {SORT_OPTIONS.map((opt) => (
                    <RadioItem key={opt.id} id={`sort-${opt.id}`} name="sort" label={opt.label} />
                  ))}
                </div>
              </Accordion>
            </div>
          </div>
        </aside>

        {/* Right Content */}
        <section className="min-w-0 flex-1">
          <div className="mb-6">
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-base text-gray-900">
                Showing {filteredColleges.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredColleges.length)} of {filteredColleges.length} <span className="font-bold">Colleges</span>
              </h1>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search colleges..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm transition-colors focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* College Cards Grid using ProgramCard from find-college */}
          <div className="grid min-h-[400px] grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {currentItems.map((college) => (
              <ProgramCard
                key={college.id}
                college={college}
                isVerified={Boolean(college.verified)}
                isSaved={savedIds.includes(college.id)}
                isSelected={selectedIds.includes(college.id)}
                isQuickInquiryMode={quickInquiryMode}
                onNavigate={handleNavigate}
                onToggleSaved={() => toggleSaved(college.id)}
                onToggleSelection={() => {
                  setSelectedIds((prev) =>
                    prev.includes(college.id)
                      ? prev.filter((i) => i !== college.id)
                      : [...prev, college.id],
                  );
                }}
                onClaim={handleClaim}
                onSingleInquiry={handleSingleInquiry}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </section>
      </main>
    </div>
  );
};

export default AffiliatedColleges;
