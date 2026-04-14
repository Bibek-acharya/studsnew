import React, { useState, useMemo } from "react";
import {
  EntranceFilterState,
  DEFAULT_ENTRANCE_FILTERS,
} from "@/app/entrance/types";
import GlobalFilterSection from "@/components/ui/GlobalFilterSection";
import { FaSliders } from "react-icons/fa6";
import { NEPAL_PROVINCES, NEPAL_DISTRICTS, NEPAL_LOCAL_BODIES } from "@/lib/location-data";

interface EntranceFiltersProps {
  filters: EntranceFilterState;
  setFilters: React.Dispatch<React.SetStateAction<EntranceFilterState>>;
}

const ACADEMIC_LEVELS = [
  { id: "plus2", label: "+2 / Higher Secondary" },
  { id: "alevel", label: "A Level" },
  { id: "diploma", label: "Diploma / CTEVT" },
];

const STREAMS = [
  { id: "science", label: "Science" },
  { id: "management", label: "Management" },
  { id: "medical", label: "Medical" },
  { id: "cs", label: "Computer Science" },
  { id: "humanities", label: "Humanities" },
];

const STATUSES = [
  { id: "ongoing", label: "Ongoing" },
  { id: "upcoming", label: "Upcoming" },
  { id: "closing", label: "Closing Soon" },
];

const SORT_OPTIONS = [
  { id: "popularity", label: "Popularity" },
  { id: "date", label: "Exam Date (Soonest)" },
  { id: "name", label: "Name (A-Z)" },
];

const APPLIED_FILTER_KEYS: Array<
  Exclude<keyof EntranceFilterState, "search" | "sortBy" | "location" | "gpa">
> = [
  "academicLevel",
  "stream",
  "status",
  "institutionType",
  "province",
  "district",
  "localLevel",
  "applicationFee",
  "scholarship",
];

const APPLICATION_FEES = [
  { id: "free", label: "Free" },
  { id: "below500", label: "Below NPR 500" },
  { id: "500to1000", label: "NPR 500 – 1000" },
  { id: "above1000", label: "Above NPR 1000" },
];

const INSTITUTION_TYPES = [
  { id: "public", label: "Public" },
  { id: "private", label: "Private" },
  { id: "community", label: "Community" },
];

type ProvinceName = keyof typeof NEPAL_DISTRICTS;
type DistrictName = keyof typeof NEPAL_LOCAL_BODIES;

const provinceOptions = NEPAL_PROVINCES.map((provinceName, index) => {
  const provinceKey = provinceName as ProvinceName;
  const provinceId = `province_${index + 1}`;
  const districts = (NEPAL_DISTRICTS[provinceKey] || []).map(
    (districtName: string) => {
      const districtKey = districtName as DistrictName;
      const localBodies = (NEPAL_LOCAL_BODIES[districtKey] || []).map(
        (lb: { name: string; wards: number }) => ({
          id: `lb_${lb.name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "")}`,
          label: lb.name,
        }),
      );
      return {
        id: `d_${districtName.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "")}`,
        label: districtName,
        localBodies,
      };
    },
  );
  return { id: provinceId, label: provinceName.replace(/\s+Province$/, ""), districts };
});

const SCHOLARSHIP_OPTIONS = [
  { id: "available", label: "Available" },
  { id: "notavailable", label: "Not Available" },
];

const GPA_OPTIONS = [
  { id: "nogpa", label: "No GPA Required" },
  { id: "2.0+", label: "2.0+" },
  { id: "2.5+", label: "2.5+" },
  { id: "3.0+", label: "3.0+" },
  { id: "3.5+", label: "3.5+" },
];

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
  checked: boolean;
  onChange: () => void;
}> = ({ id, label, checked, onChange }) => (
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
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  </div>
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

const EntranceFilters: React.FC<EntranceFiltersProps> = ({
  filters,
  setFilters,
}) => {
  const [showAppliedDropdown, setShowAppliedDropdown] = useState(false);
  const [streamSearch, setStreamSearch] = useState("");
  const [locating, setLocating] = useState(false);

  const toggle = (key: keyof EntranceFilterState, value: string) => {
    if (key === "location") return;
    setFilters((prev) => {
      const current = prev[key] as string[];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  };

  const clearAll = () => setFilters(DEFAULT_ENTRANCE_FILTERS);

  const filteredStreams = streamSearch
    ? STREAMS.filter((s) =>
        s.label.toLowerCase().includes(streamSearch.toLowerCase()),
      )
    : STREAMS;

  const filterLabelMap = useMemo(() => {
    const map = new Map<string, string>();

    ACADEMIC_LEVELS.forEach((item) => map.set(item.id, item.label));
    STREAMS.forEach((item) => map.set(item.id, item.label));
    STATUSES.forEach((item) => map.set(item.id, item.label));
    APPLICATION_FEES.forEach((item) => map.set(item.id, item.label));
    INSTITUTION_TYPES.forEach((item) => map.set(item.id, item.label));
    SCHOLARSHIP_OPTIONS.forEach((item) => map.set(item.id, item.label));
    provinceOptions.forEach((p) => {
      map.set(p.id, p.label);
      p.districts.forEach((d) => {
        map.set(d.id, d.label);
        d.localBodies?.forEach((lb) => map.set(lb.id, lb.label));
      });
    });

    return map;
  }, []);

  const appliedFilters = useMemo(() => {
    const tags: Array<{
      key: Exclude<keyof EntranceFilterState, "search" | "sortBy">;
      value: string;
      label: string;
    }> = [];

    APPLIED_FILTER_KEYS.forEach((key) => {
      filters[key].forEach((value) => {
        tags.push({ key, value, label: filterLabelMap.get(value) || value });
      });
    });

    if (filters.location) {
      tags.push({ key: "location", value: filters.location, label: filters.location });
    }
    if (filters.province?.[0]) {
      tags.push({ key: "province", value: filters.province[0], label: filterLabelMap.get(filters.province[0]) || filters.province[0] });
    }
    if (filters.district?.[0]) {
      tags.push({ key: "district", value: filters.district[0], label: filterLabelMap.get(filters.district[0]) || filters.district[0] });
    }
    filters.localLevel.forEach((value) => {
      tags.push({ key: "localLevel", value, label: filterLabelMap.get(value) || value });
    });
    if (filters.gpa) {
      tags.push({ key: "gpa", value: filters.gpa, label: `Min GPA: ${parseFloat(filters.gpa).toFixed(1)}` });
    }

    return tags;
  }, [filters, filterLabelMap]);

  const hasActiveFilters = appliedFilters.length > 0;

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
              Applied ({appliedFilters.length})
              <i
                className={`fa-solid fa-chevron-down text-[10px] transition-transform ${showAppliedDropdown ? "rotate-180" : ""}`}
              ></i>
            </button>
          )}
        </div>

        {hasActiveFilters && showAppliedDropdown && (
          <div className="absolute right-6 top-16 z-30 w-[min(520px,calc(100%-3rem))] rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
            {appliedFilters.length === 0 ? (
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
                      onClick={() => {
                        if (tag.key === "location") {
                          setFilters((prev) => ({ ...prev, location: "" }));
                        } else if (tag.key === "province") {
                          setFilters((prev) => ({ ...prev, province: [], district: [], localLevel: [] }));
                        } else if (tag.key === "district") {
                          setFilters((prev) => ({ ...prev, district: [], localLevel: [] }));
                        } else if (tag.key === "localLevel") {
                          setFilters((prev) => ({
                            ...prev,
                            localLevel: prev.localLevel.filter((item) => item !== tag.value),
                          }));
                        } else if (tag.key === "gpa") {
                          setFilters((prev) => ({ ...prev, gpa: "" }));
                        } else if (Array.isArray(filters[tag.key as keyof EntranceFilterState])) {
                          setFilters((prev) => ({
                            ...prev,
                            [tag.key]: (prev[tag.key as keyof EntranceFilterState] as string[]).filter(
                              (item: string) => item !== tag.value,
                            ),
                          }));
                        }
                      }}
className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[12px] font-medium text-blue-700 transition-colors hover:border-red-100 hover:bg-red-50 hover:text-red-700"
                    >
                      {tag.label}
                      <i className="fa-solid fa-xmark text-[10px]"></i>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className="border-b border-gray-100 py-3">
          <button
            type="button"
            onClick={() => {
              if (locating) return;
              setLocating(true);
              
              const resolveLocation = (lat?: number, lon?: number) => {
                fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat || "27.7172"}&longitude=${lon || "85.324"}&localityLanguage=en`)
                  .then(res => res.json())
                  .then(data => {
                    const city = data.city || data.locality || "Kathmandu";
                    setFilters((prev) => ({ ...prev, location: city }));
                    sessionStorage.setItem("navLocation", city);
                    window.dispatchEvent(new CustomEvent("navLocationChange", { detail: city }));
                  })
                  .catch(() => {
                    setFilters((prev) => ({ ...prev, location: "Kathmandu" }));
                  })
                  .finally(() => setLocating(false));
              };

              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (pos) => resolveLocation(pos.coords.latitude, pos.coords.longitude),
                  () => resolveLocation(),
                  { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
                );
              } else {
                resolveLocation();
              }
            }}
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
              <i className={`fa-solid ${filters.location ? "fa-location-dot" : "fa-location-crosshairs"} text-[16px]`}></i>
            )}
            <span className="text-[15px] font-medium">
              {locating ? "Locating..." : filters.location || "Exam Near Me"}
            </span>
          </button>
        </div>

        <Accordion title="Academic Level" defaultOpen>
          <div className="flex flex-col gap-3.5 pt-1">
            {ACADEMIC_LEVELS.map((item) => (
              <CheckboxItem
                key={item.id}
                id={`acad-${item.id}`}
                label={item.label}
                checked={filters.academicLevel.includes(item.id)}
                onChange={() => toggle("academicLevel", item.id)}
              />
            ))}
          </div>
        </Accordion>

        <Accordion title="Stream / Faculty">
          <SearchInput
            placeholder="Search streams..."
            value={streamSearch}
            onChange={setStreamSearch}
          />
          <div className="custom-scrollbar flex max-h-55 flex-col gap-3.5 overflow-y-auto pr-1">
            {filteredStreams.map((item) => (
              <CheckboxItem
                key={item.id}
                id={`stream-${item.id}`}
                label={item.label}
                checked={filters.stream.includes(item.id)}
                onChange={() => toggle("stream", item.id)}
              />
            ))}
          </div>
        </Accordion>

        <Accordion title="Admission Status">
          <div className="flex flex-col gap-3.5 pt-1">
            {STATUSES.map((item) => (
              <CheckboxItem
                key={item.id}
                id={`status-${item.id}`}
                label={item.label}
                checked={filters.status.includes(item.id)}
                onChange={() => toggle("status", item.id)}
              />
            ))}
          </div>
        </Accordion>

        <Accordion title="Application Fee">
          <div className="flex flex-col gap-3.5 pt-1">
            {APPLICATION_FEES.map((item) => (
              <CheckboxItem
                key={item.id}
                id={`fee-${item.id}`}
                label={item.label}
                checked={filters.applicationFee.includes(item.id)}
                onChange={() => toggle("applicationFee", item.id)}
              />
            ))}
          </div>
        </Accordion>

        <Accordion title="Institution Type">
          <div className="flex flex-col gap-3.5 pt-1">
            {INSTITUTION_TYPES.map((item) => (
              <CheckboxItem
                key={item.id}
                id={`inst-${item.id}`}
                label={item.label}
                checked={filters.institutionType.includes(item.id)}
                onChange={() => toggle("institutionType", item.id)}
              />
            ))}
          </div>
        </Accordion>

        <Accordion title="Location">
          <div className="flex flex-col gap-2 pt-1">
            <SelectInput
              placeholder="Select Province"
              value={filters.province?.[0] || ""}
              options={provinceOptions.map(p => ({ id: p.id, label: p.label }))}
              onChange={(val) => {
                setFilters((prev) => ({
                  ...prev,
                  province: val ? [val] : [],
                  district: [],
                }));
              }}
            />
            <SelectInput
              placeholder="Select District"
              value={filters.district?.[0] || ""}
              options={
                filters.province?.[0]
                  ? provinceOptions.find((p) => p.id === filters.province?.[0])?.districts.map(d => ({ id: d.id, label: d.label })) || []
                  : []
              }
              onChange={(val) => {
                setFilters((prev) => ({
                  ...prev,
                  district: val ? [val] : [],
                  localLevel: [],
                }));
              }}
              disabled={!filters.province?.[0]}
            />
            <SelectInput
              placeholder="Select Local Level"
              value={filters.localLevel?.[0] || ""}
              options={
                filters.district?.[0]
                  ? provinceOptions
                      .find((p) => p.id === filters.province?.[0])
                      ?.districts.find((d) => d.id === filters.district?.[0])
                      ?.localBodies?.map(lb => ({ id: lb.id, label: lb.label })) || []
                  : []
              }
              onChange={(val) => {
                setFilters((prev) => ({
                  ...prev,
                  localLevel: val ? [val] : [],
                }));
              }}
              disabled={!filters.district?.[0]}
            />
          </div>
        </Accordion>

        <Accordion title="Scholarship Availability">
          <div className="flex flex-col gap-3.5 pt-1">
            {SCHOLARSHIP_OPTIONS.map((item) => (
              <CheckboxItem
                key={item.id}
                id={`sch-${item.id}`}
                label={item.label}
                checked={filters.scholarship.includes(item.id)}
                onChange={() => toggle("scholarship", item.id)}
              />
            ))}
          </div>
        </Accordion>

        <Accordion title="GPA Requirement">
          <div className="flex flex-col gap-2 pt-1 px-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">Minimum GPA</span>
              <span className="text-sm font-semibold text-brand-blue">
                {filters.gpa ? parseFloat(filters.gpa).toFixed(1) : "0.0"}
              </span>
            </div>
            <div className="relative h-4">
              <div className="absolute top-1/2 left-0 w-full h-0.5 -translate-y-1/2 bg-gray-200 rounded-full pointer-events-none" />
              <div 
                className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-brand-blue rounded-full pointer-events-none"
                style={{ width: `${((filters.gpa ? parseFloat(filters.gpa) : 0) / 4) * 100}%` }}
              />
              <input
                type="range"
                min="0"
                max="4"
                step="0.1"
                value={filters.gpa ? parseFloat(filters.gpa) : 0}
                onChange={(e) => {
                  setFilters((prev) => ({
                    ...prev,
                    gpa: e.target.value,
                  }));
                }}
                className="absolute top-0 left-0 w-full h-full appearance-none cursor-pointer bg-transparent z-10"
                style={{
                  WebkitAppearance: 'none',
                  background: 'transparent'
                }}
              />
            </div>
            <style jsx>{`
              input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: white;
                border: 2px solid #3B82F6;
                cursor: pointer;
                margin-top: -2px;
              }
              input[type="range"]::-moz-range-thumb {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: white;
                border: 2px solid #3B82F6;
                cursor: pointer;
              }
              input[type="range"]::-webkit-slider-runnable-track {
                height: 4px;
                background: transparent;
              }
              input[type="range"]::-moz-range-track {
                height: 4px;
                background: transparent;
              }
            `}</style>
          </div>
        </Accordion>

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

        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </>
  );
};

export default EntranceFilters;
