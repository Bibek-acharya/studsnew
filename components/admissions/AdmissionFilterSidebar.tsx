"use client";

import { useState, useMemo, useEffect } from "react";
import {
  AdmissionFilters,
  DEFAULT_ADMISSION_FILTERS,
} from "@/app/admissions/[level]/types";
import GlobalFilterSection from "@/components/ui/GlobalFilterSection";

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

const PROVINCES = [
  { id: "prov_koshi", label: "Koshi", count: 420 },
  { id: "prov_madhesh", label: "Madhesh", count: 310 },
  { id: "prov_bagmati", label: "Bagmati", count: 1250 },
  { id: "prov_gandaki", label: "Gandaki", count: 380 },
  { id: "prov_lumbini", label: "Lumbini", count: 450 },
  { id: "prov_karnali", label: "Karnali", count: 120 },
  { id: "prov_sudur", label: "Sudurpashchim", count: 180 },
];

const DISTRICTS: Record<
  string,
  Array<{ id: string; label: string; count: number }>
> = {
  prov_koshi: [
    { id: "d_jhapa", label: "Jhapa", count: 80 },
    { id: "d_morang", label: "Morang", count: 110 },
    { id: "d_sunsari", label: "Sunsari", count: 90 },
  ],
  prov_madhesh: [
    { id: "d_dhanusha", label: "Dhanusha", count: 60 },
    { id: "d_parsa", label: "Parsa", count: 55 },
  ],
  prov_bagmati: [
    { id: "d_bhaktapur", label: "Bhaktapur", count: 120 },
    { id: "d_chitwan", label: "Chitwan", count: 150 },
    { id: "d_kathmandu", label: "Kathmandu", count: 650 },
    { id: "d_lalitpur", label: "Lalitpur", count: 180 },
    { id: "d_kavre", label: "Kavrepalanchok", count: 45 },
  ],
  prov_gandaki: [
    { id: "d_kaski", label: "Kaski", count: 210 },
    { id: "d_nawalpur", label: "Nawalpur", count: 40 },
    { id: "d_tanahun", label: "Tanahun", count: 25 },
  ],
  prov_lumbini: [
    { id: "d_banke", label: "Banke", count: 60 },
    { id: "d_rupandehi", label: "Rupandehi", count: 160 },
    { id: "d_dang", label: "Dang", count: 45 },
  ],
  prov_karnali: [
    { id: "d_surkhet", label: "Surkhet", count: 55 },
    { id: "d_jumla", label: "Jumla", count: 10 },
  ],
  prov_sudur: [
    { id: "d_kailali", label: "Kailali", count: 85 },
    { id: "d_kanchanpur", label: "Kanchanpur", count: 45 },
  ],
};

const COLLEGE_TYPES = [
  { id: "ct_private", label: "Private", count: 250 },
  { id: "ct_public", label: "Public / Govt", count: 50 },
  { id: "ct_community", label: "Community", count: 20 },
];

const SORT_OPTIONS = [
  { id: "popularity", label: "Popularity" },
  { id: "rating", label: "Highest Rating" },
  { id: "fee_low", label: "Fee: Low to High" },
  { id: "fee_high", label: "Fee: High to Low" },
];

const APPLIED_FILTER_KEYS: Array<
  Exclude<keyof AdmissionFilters, "search" | "feeMax" | "sortBy" | "directAdmission">
> = ["academic", "program", "province", "district", "type"];

function formatFee(val: number) {
  if (val >= 2000000) return "NPR 20,00,000+";
  return `NPR ${val.toLocaleString("en-IN")}`;
}

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
      className="block w-full rounded-[8px] border border-gray-200 bg-[#f8fafc] py-2 pl-9 pr-3 text-[13.5px] text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
    <span className="text-[14.5px] text-[#475569] transition-colors group-hover:text-gray-900">
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

export default function AdmissionFilterSidebar({
  filters,
  setFilters,
  level,
}: AdmissionFilterSidebarProps) {
  const [locating, setLocating] = useState(false);
  const [showAppliedDropdown, setShowAppliedDropdown] = useState(false);
  const [programSearch, setProgramSearch] = useState("");
  const [provinceSearch, setProvinceSearch] = useState("");
  const [districtSearch, setDistrictSearch] = useState("");
  const [navLocString, setNavLocString] = useState("");

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

  const availableDistricts = useMemo(() => {
    const dists = filters.province.flatMap((p) => DISTRICTS[p] || []);
    if (!districtSearch) return dists;
    return dists.filter((d) =>
      d.label.toLowerCase().includes(districtSearch.toLowerCase()),
    );
  }, [filters.province, districtSearch]);

  const filteredProvinces = provinceSearch
    ? PROVINCES.filter((p) =>
        p.label.toLowerCase().includes(provinceSearch.toLowerCase()),
      )
    : PROVINCES;

  const filterLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    const levels = ACADEMIC_LEVELS[level] || [];
    levels.forEach((item) => map.set(item.id, item.label));
    PROVINCES.forEach((item) => map.set(item.id, item.label));
    COLLEGE_TYPES.forEach((item) => map.set(item.id, item.label));
    SORT_OPTIONS.forEach((item) => map.set(item.id, item.label));
    Object.values(PROGRAMS).forEach((group) => {
      group.forEach((item) => map.set(item.id, item.label));
    });
    Object.values(DISTRICTS).forEach((group) => {
      group.forEach((item) => map.set(item.id, item.label));
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
          let foundProvId = "";
          let foundDistId = "";

          for (const prov of PROVINCES) {
            if (normalizedSearch.includes(prov.label.toLowerCase())) {
              foundProvId = prov.id;
            }
          }

          for (const [provKey, districts] of Object.entries(DISTRICTS)) {
            for (const dist of districts) {
              const distLower = dist.label.toLowerCase();
              if (
                normalizedSearch.includes(distLower) ||
                distLower.includes(normalizedSearch)
              ) {
                foundDistId = dist.id;
                foundProvId = provKey;
              }
            }
          }

          setFilters((prev) => {
            if (!foundProvId && !foundDistId) {
              return { ...prev, search: cityStr };
            }

            const nextProv = new Set(prev.province);
            const nextDist = new Set(prev.district);

            if (foundProvId) nextProv.add(foundProvId);
            if (foundDistId) nextDist.add(foundDistId);

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
      <div className="relative w-full rounded-[20px] border border-gray-100 bg-white p-6 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.1)]">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6 text-blue-600"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3 4a1 1 0 011-1h16a1 1 0 01.7 1.7L14 11.414V17a1 1 0 01-.293.707l-3 3A1 1 0 019 20v-8.586L3.3 4.7A1 1 0 013 4z"
              />
            </svg>
            <h2 className="text-[20px] font-bold tracking-tight text-gray-900">
              Filters
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShowAppliedDropdown((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-md border border-blue-100 bg-blue-50 px-3 py-1.5 text-[12px] font-semibold text-blue-700 transition-colors hover:bg-blue-100"
          >
            Applied ({appliedFilters.length + (isFeeApplied ? 1 : 0)})
            <i
              className={`fa-solid fa-chevron-down text-[10px] transition-transform ${showAppliedDropdown ? "rotate-180" : ""}`}
            ></i>
          </button>
        </div>

        {showAppliedDropdown && (
          <div className="absolute right-6 top-16 z-30 w-[min(520px,calc(100%-3rem))] rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
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
            className="flex w-full items-center justify-center gap-2 rounded-md border border-blue-500 bg-blue-50 px-4 py-3 text-blue-500 outline-none transition-all duration-200 hover:bg-blue-100 active:bg-blue-200"
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
                count={item.count}
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
          <div className="custom-scrollbar flex max-h-[220px] flex-col gap-3.5 overflow-y-auto pr-1">
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
                  count={item.count}
                  checked={filters.program.includes(item.id)}
                  onChange={() => toggle("program", item.id)}
                />
              ))
            )}
          </div>
        </Accordion>

        {/* Province */}
        <Accordion title="Province">
          <SearchInput
            placeholder="Search province..."
            value={provinceSearch}
            onChange={setProvinceSearch}
          />
          <div className="custom-scrollbar flex max-h-[220px] flex-col gap-3.5 overflow-y-auto pr-1">
            {filteredProvinces.map((item) => (
              <CheckboxItem
                key={item.id}
                id={`prov-${item.id}`}
                label={item.label}
                count={item.count}
                checked={filters.province.includes(item.id)}
                onChange={() => {
                  toggle("province", item.id);
                  setFilters((prev) => ({ ...prev, district: [] }));
                }}
              />
            ))}
          </div>
        </Accordion>

        {/* District */}
        <Accordion title="District">
          <SearchInput
            placeholder="Search district..."
            value={districtSearch}
            onChange={setDistrictSearch}
          />
          <div className="custom-scrollbar flex max-h-[220px] flex-col gap-3.5 overflow-y-auto pr-1">
            {availableDistricts.length === 0 ? (
              <p className="px-1 text-[13px] italic text-gray-400">
                {filters.province.length === 0
                  ? "Select a Province first."
                  : "No districts found."}
              </p>
            ) : (
              availableDistricts.map((item) => (
                <CheckboxItem
                  key={item.id}
                  id={`dist-${item.id}`}
                  label={item.label}
                  count={item.count}
                  checked={filters.district.includes(item.id)}
                  onChange={() => toggle("district", item.id)}
                />
              ))
            )}
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
                count={item.count}
                checked={filters.type.includes(item.id)}
                onChange={() => toggle("type", item.id)}
              />
            ))}
          </div>
        </Accordion>

        {/* Fee Range */}
        <Accordion title="Total Fee Range">
          <div className="px-2 pb-2 pt-2">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[13px] font-medium text-gray-400">
                NPR 0
              </span>
              <span className="rounded-md bg-blue-50 px-2.5 py-1 text-[14px] font-bold text-blue-600">
                {formatFee(filters.feeMax)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={2000000}
              step={50000}
              value={filters.feeMax}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  feeMax: Number(e.target.value),
                }))
              }
              className="fee-range w-full"
            />
          </div>
        </Accordion>

        {/* Sort By */}
        <div>
          <button
            type="button"
            className="group flex w-full items-center justify-between bg-white py-4"
          >
            <span className="text-[15px] font-semibold text-gray-900">
              Sort By
            </span>
          </button>
          <div className="flex flex-col gap-3.5 pb-4 pt-1">
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
        </div>
      </div>

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
          background: blue;
        }
        .fee-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          margin-top: -6px;
          box-shadow: 0 0 0 4px #eff6ff;
          transition: box-shadow 0.2s;
        }
        .fee-range::-webkit-slider-thumb:hover { box-shadow: 0 0 0 6px #dbeafe; }
        .fee-range::-webkit-slider-runnable-track {
          width: 100%;
          height: 4px;
          cursor: pointer;
          background: #e2e8f0;
          border-radius: 2px;
        }
        .fee-range:focus { outline: none; }

        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </>
  );
}
