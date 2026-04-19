"use client";

import { useState, useMemo, useEffect } from "react";
import {
  AdmissionFilters,
  DEFAULT_ADMISSION_FILTERS,
} from "@/app/admissions/[level]/types";
import {
  NEPAL_PROVINCES,
  NEPAL_DISTRICTS,
  NEPAL_LOCAL_BODIES,
} from "@/lib/location-data";
import GlobalFilterSection from "@/components/ui/GlobalFilterSection";
import { FaSliders } from "react-icons/fa6";
import { admissionService, AdmissionFilterCountsResponse } from "@/services/admission.api";

interface AdmissionFilterSidebarProps {
  filters: AdmissionFilters;
  setFilters: React.Dispatch<React.SetStateAction<AdmissionFilters>>;
  level: string;
}

const ACADEMIC_LEVELS: Record<
  string,
  Array<{ id: string; label: string; count: number }>
> = {
  "high-school": [
    { id: "p2_sci", label: "Science", count: 1200 },
    { id: "p2_mgmt", label: "Management", count: 1500 },
    { id: "p2_hum", label: "Humanities", count: 300 },
    { id: "p2_edu", label: "Education", count: 150 },
    { id: "p2_law", label: "Law", count: 50 },
  ],
  "a-level": [
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

const PROGRAMS: Record<
  string,
  Array<{ id: string; label: string; count: number }>
> = {
  p2_sci: [
    { id: "p2s_it", label: "Computer Science", count: 200 },
    { id: "p2s_bio", label: "Biological Sciences", count: 180 },
    { id: "p2s_phy", label: "Physics", count: 150 },
  ],
  p2_mgmt: [
    { id: "p2m_acc", label: "Accounting", count: 400 },
    { id: "p2m_mkt", label: "Marketing", count: 300 },
    { id: "p2m_fin", label: "Finance", count: 250 },
  ],
  p2_hum: [
    { id: "p2h_eng", label: "English", count: 120 },
    { id: "p2h_soc", label: "Sociology", count: 80 },
  ],
  al_sci: [
    { id: "als_math", label: "Mathematics", count: 30 },
    { id: "als_phys", label: "Physics", count: 25 },
    { id: "als_chem", label: "Chemistry", count: 20 },
  ],
  al_nonsci: [
    { id: "alns_biz", label: "Business Studies", count: 25 },
    { id: "alns_econ", label: "Economics", count: 20 },
  ],
  d_eng: [
    { id: "de_civil", label: "Diploma in Civil Eng.", count: 60 },
    { id: "de_comp", label: "Diploma in Computer Eng.", count: 45 },
    { id: "de_elec", label: "Diploma in Electrical Eng.", count: 35 },
  ],
  d_med: [
    { id: "dm_nurs", label: "PCL Nursing", count: 55 },
    { id: "dm_ha", label: "HA (General Medicine)", count: 40 },
  ],
  d_hm: [
    { id: "dhm_htl", label: "Hotel Management", count: 50 },
    { id: "dhm_tour", label: "Tourism Management", count: 40 },
  ],
  d_agr: [
    { id: "da_agr", label: "Agriculture", count: 30 },
    { id: "da_for", label: "Forestry", count: 20 },
  ],
};

const COLLEGE_TYPES = [
  { id: "ct_private", label: "Private College" },
  { id: "ct_community", label: "Community College" },
  { id: "ct_government", label: "Government College" },
];

const SCHOLARSHIP_OPTIONS = [
  { id: "sch_entrance", label: "Entrance Scholarship" },
  { id: "sch_merit", label: "Merit Scholarship" },
  { id: "sch_need", label: "Need-based Scholarship" },
];

const FACILITY_OPTIONS = [
  { id: "fac_ac", label: "AC Classrooms" },
  { id: "fac_library", label: "Digital Library" },
  { id: "fac_sports", label: "Sports Complex" },
  { id: "fac_wifi", label: "Wi-Fi Campus" },
  { id: "fac_hostel", label: "Hostel Available" },
  { id: "fac_cafeteria", label: "Cafeteria" },
];

const SORT_OPTIONS = [
  { id: "popularity", label: "Popularity" },
  { id: "rating", label: "Rating: High to Low" },
  { id: "fee_low", label: "Fee: Low to High" },
  { id: "fee_high", label: "Fee: High to Low" },
];

const APPLIED_FILTER_KEYS: Array<
  Exclude<keyof AdmissionFilters, "search" | "feeMax" | "sortBy" | "directAdmission">
> = ["academic", "program", "province", "district", "local", "type", "scholarship", "facilities"];

function formatFee(val: number) {
  if (val >= 1000000) return "NPR 10,00,000+";
  if (val === 0) return "Free / No Fee";
  return `NPR ${val.toLocaleString("en-IN")}`;
}

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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  </div>
);

const SearchInput: React.FC<{
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}> = ({ placeholder, value, onChange }) => (
  <div className="relative mb-3">
    <svg
      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="block w-full rounded-lg border border-gray-200 bg-[#f8fafc] py-2 pl-9 pr-3 text-[13.5px] text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
    />
  </div>
);

const CheckboxItem: React.FC<{
  id: string;
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}> = ({ id, label, count, checked, onChange }) => (
  <label
    htmlFor={id}
    className="group flex w-full cursor-pointer items-center justify-between"
  >
    <div className="flex items-center gap-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="custom-checkbox"
      />
      <span className="text-[14.5px] text-[#475569] transition-colors group-hover:text-gray-900 leading-tight">
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
  checked: boolean;
  onChange: () => void;
}> = ({ id, label, name, checked, onChange }) => (
  <label htmlFor={id} className="group flex cursor-pointer items-center gap-3">
    <input
      id={id}
      type="radio"
      name={name}
      checked={checked}
      onChange={onChange}
      className="custom-radio"
    />
    <span className="text-[14.5px] text-[#475569] transition-colors group-hover:text-gray-900 leading-tight">
      {label}
    </span>
  </label>
);

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

const DirectAdmissionModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div 
      className="fixed inset-0 bg-gray-900/40 flex items-center justify-center p-4 z-1000" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden relative flex flex-col p-6 md:p-8" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-gray-900 transition-colors bg-white rounded-full"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className="text-center mb-6 mt-2 md:mt-0">
          <h2 className="font-poppins text-2xl md:text-3xl font-bold text-gray-900 mb-2 tracking-tight">How does College Direct Admission work?</h2>
        </div>

        <div className="relative flex flex-col md:flex-row justify-between w-full mx-auto mb-6 gap-y-6 md:gap-y-0 md:gap-x-3 overflow-y-auto custom-scrollbar">
          <div className="absolute top-12 left-[10%] right-[10%] h-0.5 bg-gray-200 z-0 hidden md:block"></div>
          <div className="absolute left-10 top-10 bottom-10 w-0.5 bg-gray-200 z-0 md:hidden"></div>
          
          {[
            { 
              step: "1. Create Profile", 
              desc: "Build your academic profile in minutes by entering your SEE/+2 results, preferred faculty, and location.", 
              img: "https://i.pinimg.com/1200x/8d/94/a9/8d94a9ab7d4cae915dcecd7cfe10484d.jpg" 
            },
            { 
              step: "2. Get Matched", 
              desc: "Our smart system instantly connects you with colleges and programs where you are eligible for direct admission.", 
              img: "https://i.pinimg.com/1200x/77/26/ec/7726ecf44da329c20c215fca1982a5f9.jpg" 
            },
            { 
              step: "3. Compare & Choose", 
              desc: "Explore matched colleges, compare fees, facilities, scholarships, and locations — then choose your fit.", 
              img: "https://i.pinimg.com/1200x/6b/14/ee/6b14ee22b8589497cd6cfcba2420af7f.jpg" 
            },
            { 
              step: "4. Apply Instantly", 
              desc: "Send your application directly to the college with one click. No need to visit multiple campuses.", 
              img: "https://i.pinimg.com/1200x/f9/90/34/f99034c1ff77e20f8b97347bf96171df.jpg" 
            },
            { 
              step: "5. Confirm Admission", 
              desc: "Get quick confirmation from the college and secure your seat before it fills.", 
              img: "https://i.pinimg.com/736x/61/9f/b2/619fb264043785065fc11519f5897cbb.jpg" 
            }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-row md:flex-col items-center flex-1 relative z-10 px-1 gap-4 md:gap-2">
              <div className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center shrink-0 z-10 hover:-translate-y-0.5 transition-transform overflow-hidden bg-white">
                <img src={item.img} alt={item.step} className="w-full h-full object-cover mix-blend-multiply" />
              </div>
              <div className="text-left md:text-center flex-1">
                <h4 className="font-poppins font-bold text-gray-900 text-[13px] md:text-sm mb-1">{item.step}</h4>
                <p className="text-gray-500 text-[11px] md:text-xs leading-snug">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 w-full mx-auto shadow-sm">
          <div className="flex-1 w-full order-2 md:order-1">
            <h3 className="font-poppins font-bold text-gray-900 text-lg md:text-xl mb-1">Complete your profile now</h3>
            <p className="text-gray-500 text-xs md:text-sm mb-4">You are just a few steps away from unlocking direct admission matches.</p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
              <div className="flex items-center gap-3 w-full sm:max-w-45">
                <div className="w-full bg-indigo-100/80 rounded-full h-2 overflow-hidden">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: "40%" }}></div>
                </div>
                <span className="text-xs font-bold text-indigo-700">40%</span>
              </div>
              <button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 px-5 rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap">
                Get direct admission
              </button>
            </div>
          </div>
          <div className="shrink-0 w-20 h-20 md:w-28 md:h-28 order-1 md:order-2 flex items-center justify-center">
            <img src="https://i.pinimg.com/1200x/c0/a7/68/c0a7688c3212fe6d63227c3f23ce060a.jpg" alt="Profile Illustration" className="w-full h-full object-cover mix-blend-multiply" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdmissionFilterSidebar({
  filters,
  setFilters,
  level,
}: AdmissionFilterSidebarProps) {
  const [locating, setLocating] = useState(false);
  const [showAppliedDropdown, setShowAppliedDropdown] = useState(false);
  const [programSearch, setProgramSearch] = useState("");
  const [navLocString, setNavLocString] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [filterCounts, setFilterCounts] = useState<AdmissionFilterCountsResponse["data"] | null>(null);

  useEffect(() => {
    const loadFilterCounts = async () => {
      try {
        const response = await admissionService.getAdmissionFilterCounts(level);
        setFilterCounts(response.data);
      } catch (error) {
        console.error("Failed to load admission filter counts:", error);
        setFilterCounts(null);
      }
    };

    loadFilterCounts();
  }, [level]);

  const getFilterCount = (key: string, defaultValue = 0) => {
    if (!filterCounts) return defaultValue;
    return (
      filterCounts.facet_counts_by_id?.[key] ??
      filterCounts.type_counts_by_id?.[key] ??
      filterCounts.type_counts?.[key] ??
      defaultValue
    );
  };

  useEffect(() => {
    const updateLocation = (cityStr: string) => {
      if (
        !cityStr ||
        cityStr === "Detect Location" ||
        cityStr === "Detecting..." ||
        cityStr === "Location Found"
      )
        return;
      setNavLocString(cityStr);
    };

    const savedLoc = sessionStorage.getItem("navLocation");
    if (savedLoc) {
      updateLocation(savedLoc);
    }

    const handleNavLocation = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      updateLocation(customEvent.detail);
    };

    window.addEventListener("navLocationChange", handleNavLocation);
    return () =>
      window.removeEventListener("navLocationChange", handleNavLocation);
  }, [setFilters]);

  const availablePrograms = useMemo(() => {
    const progs = filters.academic.flatMap((a) => PROGRAMS[a] || []);
    if (!programSearch) return progs;
    return progs.filter((p) =>
      p.label.toLowerCase().includes(programSearch.toLowerCase()),
    );
  }, [filters.academic, programSearch]);

  const provinceOptions = useMemo(() => {
    return NEPAL_PROVINCES.map((name) => ({ id: name, label: name }));
  }, []);

  const getDistrictsForProvince = (province: string) =>
    NEPAL_DISTRICTS[province as keyof typeof NEPAL_DISTRICTS] ?? [];

  const getLocalsForDistrict = (district: string) =>
    NEPAL_LOCAL_BODIES[district as keyof typeof NEPAL_LOCAL_BODIES] ?? [];

  const districtOptions = useMemo(() => {
    if (filters.province.length === 0) return [];
    return filters.province.flatMap((province) =>
      getDistrictsForProvince(province).map((district: string) => ({
        id: district,
        label: district,
      })),
    );
  }, [filters.province]);

  const localOptions = useMemo(() => {
    if (filters.district.length === 0) return [];
    return filters.district.flatMap((district) =>
      getLocalsForDistrict(district).map((local) => ({
        id: local.name,
        label: local.name,
      })),
    );
  }, [filters.district]);

  const filterLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    const levels = ACADEMIC_LEVELS[level] || [];
    levels.forEach((item) => map.set(item.id, item.label));
    NEPAL_PROVINCES.forEach((name) => map.set(name, name));
    COLLEGE_TYPES.forEach((item) => map.set(item.id, item.label));
    SCHOLARSHIP_OPTIONS.forEach((item) => map.set(item.id, item.label));
    FACILITY_OPTIONS.forEach((item) => map.set(item.id, item.label));
    SORT_OPTIONS.forEach((item) => map.set(item.id, item.label));
    Object.values(PROGRAMS).forEach((group) => {
      group.forEach((item) => map.set(item.id, item.label));
    });
    Object.values(NEPAL_DISTRICTS).forEach((group) => {
      group.forEach((districtName) => map.set(districtName, districtName));
    });
    Object.values(NEPAL_LOCAL_BODIES).forEach((group) => {
      group.forEach((local) => map.set(local.name, local.name));
    });
    return map;
  }, [level]);

  const appliedFilters = useMemo(() => {
    const tags: Array<{
      key: Exclude<keyof AdmissionFilters, "search" | "feeMax" | "sortBy" | "directAdmission">;
      value: string;
      label: string;
    }> = [];

    APPLIED_FILTER_KEYS.forEach((key) => {
      filters[key].forEach((value) => {
        tags.push({ key, value, label: filterLabelMap.get(value) || value });
      });
    });

    return tags;
  }, [filters, filterLabelMap]);

  const isFeeApplied = filters.feeMax < DEFAULT_ADMISSION_FILTERS.feeMax;
  const hasActiveFilters = appliedFilters.length > 0 || isFeeApplied;

  const toggle = (key: keyof AdmissionFilters, value: string) => {
    setFilters((prev) => {
      const current = prev[key] as string[];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  };

  const clearAll = () => setFilters(DEFAULT_ADMISSION_FILTERS);

  const handleLocate = () => {
    if (locating) return;
    setLocating(true);

    const resolveLocation = async (lat?: number, lon?: number) => {
      try {
        let cityStr = "";

        if (lat && lon) {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10&addressdetails=1`,
          );
          if (res.ok) {
            const data = await res.json();
            if (data && data.address) {
              cityStr =
                data.address.county ||
                data.address.city ||
                data.address.state_district ||
                "";
            }
          }
        }

        if (!cityStr) {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=en`,
          );
          if (res.ok) {
            const data = await res.json();
            if (data) {
              cityStr = data.city || data.principalSubdivision || "";
            }
          }
        }

        if (cityStr) {
          const normalizedSearch = cityStr.toLowerCase();
          let foundProvince = "";
          let foundDistrict = "";

          for (const province of NEPAL_PROVINCES) {
            if (normalizedSearch.includes(province.toLowerCase())) {
              foundProvince = province;
            }
          }

          for (const [province, districts] of Object.entries(NEPAL_DISTRICTS)) {
            for (const district of districts) {
              const distLower = district.toLowerCase();
              if (
                normalizedSearch.includes(distLower) ||
                distLower.includes(normalizedSearch)
              ) {
                foundDistrict = district;
                foundProvince = province;
              }
            }
          }

          setFilters((prev) => {
            if (!foundProvince && !foundDistrict) {
              return { ...prev, search: cityStr };
            }

            const nextProv = new Set(prev.province);
            const nextDist = new Set(prev.district);

            if (foundProvince) nextProv.add(foundProvince);
            if (foundDistrict) nextDist.add(foundDistrict);

            return {
              ...prev,
              province: Array.from(nextProv),
              district: Array.from(nextDist),
            };
          });

          sessionStorage.setItem("navLocation", cityStr);
          window.dispatchEvent(
            new CustomEvent("navLocationChange", { detail: cityStr }),
          );
        } else {
          alert("Could not detect your district. Please select it manually.");
        }
      } catch (e) {
        console.error(e);
        alert("Could not detect location.");
      } finally {
        setLocating(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolveLocation(pos.coords.latitude, pos.coords.longitude),
        () => resolveLocation(),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
      );
    } else {
      resolveLocation();
    }
  };

  const levels = ACADEMIC_LEVELS[level] || [];

  return (
    <>
      <div className="relative w-full rounded-[20px] border border-gray-200 bg-white p-6">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaSliders size={18} className="text-black" />
            <h3 className="font-black text-xl text-slate-900 tracking-tight">
              Filters
            </h3>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => setShowAppliedDropdown((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[12px] font-semibold text-blue-700 transition-colors"
            >
              Applied ({appliedFilters.length + (isFeeApplied ? 1 : 0)})
              <i
                className={`fa-solid fa-chevron-down text-[10px] transition-transform ${showAppliedDropdown ? "rotate-180" : ""}`}
              ></i>
            </button>
          )}
        </div>

        {hasActiveFilters && showAppliedDropdown && (
          <div className="absolute right-6 top-16 z-30 w-[min(520px,calc(100%-3rem))] rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
            {appliedFilters.length === 0 && !isFeeApplied ? (
              <p className="px-1 py-2 text-[13px] italic text-gray-400">
                No filters selected yet.
              </p>
            ) : (
              <>
                <div className="flex flex-wrap gap-2 pb-3">
                  {appliedFilters.map((tag, index) => (
                    <button
                      key={`${tag.key}-${tag.value}-${index}`}
                      type="button"
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          [tag.key]: prev[tag.key].filter(
                            (item) => item !== tag.value,
                          ),
                        }))
                      }
                      className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[12px] font-medium text-blue-700 transition-colors hover:border-red-100 hover:bg-red-50 hover:text-red-700"
                    >
                      {tag.label}
                      <i className="fa-solid fa-xmark text-[10px]"></i>
                    </button>
                  ))}
                  {isFeeApplied && (
                    <button
                      type="button"
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          feeMax: DEFAULT_ADMISSION_FILTERS.feeMax,
                        }))
                      }
                      className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[12px] font-medium text-blue-700 transition-colors hover:border-red-100 hover:bg-red-50 hover:text-red-700"
                    >
                      Max Fee: {formatFee(filters.feeMax)}
                      <i className="fa-solid fa-xmark text-[10px]"></i>
                    </button>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-2">
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
              </>
            )}
          </div>
        )}

        <div className="border-b border-gray-100 py-3">
          <button
            type="button"
            onClick={handleLocate}
            className="flex w-full items-center justify-start gap-2 rounded-md border border-black/20 px-4 py-3 text-gray-700 hover:text-brand-blue outline-none transition-all duration-200"
          >
            {locating ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-spin"
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
                  : "College Near Me"}
            </span>
          </button>
        </div>

        {/* Stream / Program Filter */}
        <Accordion title="Stream" defaultOpen>
          <div className="flex flex-col gap-3.5 pt-1">
            {levels.map((item) => (
              <CheckboxItem
                key={item.id}
                id={`stream-${item.id}`}
                label={item.label}
                count={getFilterCount(item.id, item.count)}
                checked={filters.academic.includes(item.id)}
                onChange={() => {
                  toggle("academic", item.id);
                  setFilters((prev) => ({ ...prev, program: [] }));
                }}
              />
            ))}
          </div>
        </Accordion>

        {/* Program */}
        <Accordion title="Program">
          <SearchInput
            placeholder="Search programs..."
            value={programSearch}
            onChange={setProgramSearch}
          />
          <div className="custom-scrollbar flex max-h-55 flex-col gap-3.5 overflow-y-auto pr-1">
            {availablePrograms.length === 0 ? (
              <p className="px-1 text-[13px] italic text-gray-400">
                {filters.academic.length === 0
                  ? "Select a Stream first."
                  : "No programs found."}
              </p>
            ) : (
              availablePrograms.map((item) => (
                <CheckboxItem
                  key={item.id}
                  id={`prog-${item.id}`}
                  label={item.label}
                  count={getFilterCount(item.id, item.count)}
                  checked={filters.program.includes(item.id)}
                  onChange={() => toggle("program", item.id)}
                />
              ))
            )}
          </div>
        </Accordion>

        {/* Location (Province/District/Locality) */}
        <Accordion title="Location">
          <div className="flex flex-col gap-2 pt-1">
            <SelectInput
              placeholder="Select Province"
              value={filters.province[0] || ""}
              options={provinceOptions}
              onChange={(val) => {
                setFilters((prev) => ({
                  ...prev,
                  province: val ? [val] : [],
                  district: [],
                  local: [],
                }));
              }}
            />
            <SelectInput
              placeholder="Select District"
              value={filters.district[0] || ""}
              options={districtOptions}
              onChange={(val) => {
                setFilters((prev) => ({
                  ...prev,
                  district: val ? [val] : [],
                  local: [],
                }));
              }}
              disabled={filters.province.length === 0}
            />
            <SelectInput
              placeholder="Select Locality"
              value={filters.local[0] || ""}
              options={localOptions}
              onChange={(val) => {
                setFilters((prev) => ({
                  ...prev,
                  local: val ? [val] : [],
                }));
              }}
              disabled={filters.district.length === 0}
            />
          </div>
        </Accordion>

        {/* College Type */}
        <Accordion title="College Type">
          <div className="flex flex-col gap-3.5 pt-1">
            {COLLEGE_TYPES.map((item) => (
              <CheckboxItem
                key={item.id}
                id={`type-${item.id}`}
                label={item.label}
                checked={filters.type.includes(item.id)}
                onChange={() => toggle("type", item.id)}
              />
            ))}
          </div>
        </Accordion>

        {/* Scholarship */}
        <Accordion title="Scholarship">
          <div className="flex flex-col gap-3.5 pt-1">
            {SCHOLARSHIP_OPTIONS.map((item) => (
              <CheckboxItem
                key={item.id}
                id={`scholar-${item.id}`}
                label={item.label}
                checked={filters.scholarship.includes(item.id)}
                onChange={() => toggle("scholarship", item.id)}
              />
            ))}
          </div>
        </Accordion>

        {/* Facilities */}
        <Accordion title="Facilities">
          <div className="flex flex-col gap-3.5 pt-1">
            {FACILITY_OPTIONS.map((item) => (
              <CheckboxItem
                key={item.id}
                id={`facility-${item.id}`}
                label={item.label}
                checked={filters.facilities.includes(item.id)}
                onChange={() => toggle("facilities", item.id)}
              />
            ))}
          </div>
        </Accordion>

        {/* Fee Range */}
        <Accordion title="Fee Range">
          <div className="px-2 pb-2 pt-2">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[13px] font-medium text-gray-400">
                Max Fee:
              </span>
              <span className="text-[14px] font-bold text-blue-600">
                {formatFee(filters.feeMax)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1000000}
              step={50000}
              value={filters.feeMax > 1000000 ? 1000000 : filters.feeMax}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  feeMax: Number(e.target.value),
                }))
              }
              className="fee-range w-full"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-medium">
              <span>0</span>
              <span>10L+</span>
            </div>
          </div>
        </Accordion>

        {/* Sort By */}
        <Accordion title="Sort By">
          <div className="flex flex-col gap-3.5 pt-1">
            {SORT_OPTIONS.map((opt) => (
              <RadioItem
                key={opt.id}
                id={`sort-${opt.id}`}
                name="sort"
                label={opt.label}
                checked={filters.sortBy === opt.id}
                onChange={() =>
                  setFilters((prev) => ({ ...prev, sortBy: opt.id }))
                }
              />
            ))}
          </div>
        </Accordion>

        {/* Direct Admission Toggle */}
        <div className="mt-2 pt-5 border-t border-gray-100">
          <div className="flex flex-col gap-2 w-full">
            <div className={`py-2 px-3 rounded-lg flex items-center justify-between transition-colors duration-300 w-full ${filters.directAdmission ? 'bg-green-50' : 'bg-gray-100'}`}>
              <span className="text-sm font-semibold text-slate-900 leading-tight">
                Get college direct admission
              </span>
              <label className="toggle-switch shrink-0">
                <input 
                  type="checkbox" 
                  checked={filters.directAdmission}
                  onChange={(e) => setFilters(prev => ({ ...prev, directAdmission: e.target.checked }))}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="flex justify-end w-full px-1">
              <button 
                onClick={() => setShowModal(true)}
                className="text-blue-600 text-xs hover:underline flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                How it works?
              </button>
            </div>
          </div>
        </div>
      </div>

      <DirectAdmissionModal isOpen={showModal} onClose={() => setShowModal(false)} />

      <style>{`
        .custom-checkbox {
          appearance: none;
          background-color: #fff;
          margin: 0;
          width: 1.15em;
          height: 1.15em;
          border: 1px solid #94a3b8;
          border-radius: 0.25em;
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
        .custom-checkbox:checked::before { transform: scale(1); }
        .custom-checkbox:hover { border-color: #64748b; }

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
        .custom-radio:checked { background-color: #2563eb; border-color: #2563eb; }
        .custom-radio:checked::before { transform: scale(1); }
        .custom-radio:hover { border-color: #64748b; }

        .fee-range {
          -webkit-appearance: none;
          width: 100%;
          height: 4px;
          border-radius: 2px;
          background: #e2e8f0;
        }
        .fee-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
          transition: box-shadow 0.2s;
        }
        .fee-range::-webkit-slider-thumb:hover { box-shadow: 0 0 0 6px rgba(37, 99, 235, 0.2); }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
        }
        .toggle-switch input { opacity: 0; width: 0; height: 0; }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: #8a949b;
          transition: .3s ease-in-out;
          border-radius: 34px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 18px; width: 18px;
          left: 3px; bottom: 3px;
          background-color: white;
          transition: .3s ease-in-out;
          border-radius: 50%;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        input:checked + .slider { background-color: #0f7b1c; }
        input:checked + .slider:before { transform: translateX(20px); }

        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </>
  );
}
