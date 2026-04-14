import React, { useState, useMemo, useEffect } from "react";
import {
  CourseFinderFilters,
  CourseFilterCounts,
  defaultCourseFinderFilters,
} from "./types";
import { FaSliders } from "react-icons/fa6";
import GlobalFilterSection from "@/components/ui/GlobalFilterSection";
import { NEPAL_PROVINCES, NEPAL_DISTRICTS } from "@/lib/location-data";

interface CourseFiltersProps {
  filters: CourseFinderFilters;
  counts: CourseFilterCounts;
  onChange: (next: CourseFinderFilters) => void;
}

type DistrictOption = {
  id: string;
  label: string;
};

type ProvinceOption = {
  id: string;
  label: string;
  districts: DistrictOption[];
};

type ProvinceName = keyof typeof NEPAL_DISTRICTS;

// ── Nepal Data ────────────────────────────────────────────────────────────────

const ACADEMIC_LEVELS = [
  { id: "plus2", label: "+2 / Higher Secondary", count: 3200 },
  { id: "alevel", label: "A Level", count: 85 },
  { id: "diploma", label: "Diploma / CTEVT", count: 410 },
  { id: "masters", label: "Masters", count: 210 },
];

const FIELDS: Record<
  string,
  Array<{ id: string; label: string; count: number }>
> = {
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
  masters: [
    { id: "m_mgmt", label: "Management (MBA/MBS)", count: 110 },
    { id: "m_it", label: "IT & Computer Science", count: 60 },
    { id: "m_edu", label: "Education", count: 40 },
  ],
};

const provinceOptions: ProvinceOption[] = NEPAL_PROVINCES.map(
  (provinceName, index) => {
    const provinceKey = provinceName as ProvinceName;
    const districts = (NEPAL_DISTRICTS[provinceKey] || []).map(
      (districtName: string) => ({
        id:
          "d_" +
          districtName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/^_+|_+$/g, ""),
        label: districtName,
      }),
    );

    return {
      id: provinceName,
      label: provinceName.replace(/\s+Province$/, ""),
      districts,
    };
  },
);

const PROVIDER_TYPES = [
  { id: "private", label: "Private Institutions", count: 250 },
  { id: "public", label: "Public / Government", count: 80 },
  { id: "community", label: "Community", count: 45 },
];

const DURATIONS = [
  { id: "1yr", label: "1 Year", count: 120 },
  { id: "2yr", label: "2 Years", count: 1500 },
  { id: "3yr", label: "3 Years", count: 410 },
  { id: "4yr", label: "4 Years", count: 85 },
];

const SORT_OPTIONS = [
  { id: "popularity", label: "Popularity" },
  { id: "rating", label: "Highest Rating" },
  { id: "fee_low", label: "Fee: Low to High" },
  { id: "fee_high", label: "Fee: High to Low" },
];

// ── Sub-Components ────────────────────────────────────────────────────────────

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
    {count !== undefined && count > 0 && (
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

const CourseFilters: React.FC<CourseFiltersProps> = ({
  filters,
  counts,
  onChange,
}) => {
  const [showAppliedDropdown, setShowAppliedDropdown] = useState(false);
  const [locating, setLocating] = useState(false);
  const [navLocString, setNavLocString] = useState("");

  const availableFields = useMemo(() => {
    if (filters.academicLevels.length === 0) return [];
    return filters.academicLevels.flatMap((level) => FIELDS[level] || []);
  }, [filters.academicLevels]);

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
  }, []);

  const toggleArray = (key: keyof CourseFinderFilters, value: string) => {
    const current = filters[key] as string[];
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  const hasActiveFilters =
    filters.academicLevels.length > 0 ||
    filters.fields.length > 0 ||
    filters.providerTypes.length > 0 ||
    filters.feeRanges.length > 0 ||
    filters.scholarships.length > 0 ||
    filters.durations.length > 0 ||
    filters.admissions.length > 0 ||
    filters.popularity.length > 0 ||
    filters.province !== "All Provinces" ||
    filters.quickVerified ||
    filters.quickNew ||
    filters.quickClosing;

  const appliedFilters = useMemo(() => {
    const tags: Array<{ key: string; value: string; label: string }> = [];

    if (filters.academicLevels.length > 0) {
      filters.academicLevels.forEach((v) => {
        const label = ACADEMIC_LEVELS.find((al) => al.id === v)?.label || v;
        tags.push({ key: "academicLevels", value: v, label });
      });
    }
    if (filters.fields.length > 0) {
      filters.fields.forEach((v) => {
        let label = v;
        Object.values(FIELDS).forEach((group) => {
          const found = group.find((f) => f.id === v);
          if (found) label = found.label;
        });
        tags.push({ key: "fields", value: v, label });
      });
    }
    if (filters.providerTypes.length > 0) {
      filters.providerTypes.forEach((v) => {
        const label = PROVIDER_TYPES.find((pt) => pt.id === v)?.label || v;
        tags.push({ key: "providerTypes", value: v, label });
      });
    }
    if (filters.durations.length > 0) {
      filters.durations.forEach((v) => {
        const label = DURATIONS.find((d) => d.id === v)?.label || v;
        tags.push({ key: "durations", value: v, label });
      });
    }
    if (filters.popularity.length > 0) {
      filters.popularity.forEach((v) => {
        const label = SORT_OPTIONS.find((s) => s.id === v)?.label || v;
        tags.push({ key: "popularity", value: v, label });
      });
    }
    if (filters.province !== "All Provinces") {
      tags.push({
        key: "province",
        value: filters.province,
        label: filters.province,
      });
    }
    if (filters.quickVerified)
      tags.push({
        key: "quickVerified",
        value: "quickVerified",
        label: "Verified",
      });
    if (filters.quickNew)
      tags.push({ key: "quickNew", value: "quickNew", label: "New" });
    if (filters.quickClosing)
      tags.push({
        key: "quickClosing",
        value: "quickClosing",
        label: "Closing Soon",
      });

    return tags;
  }, [filters]);

  const handleLocate = () => {
    if (locating) return;
    setLocating(true);

    const resolveLocation = async (lat?: number, lon?: number) => {
      try {
        let cityStr = "";

        if (lat && lon) {
          const res = await fetch(
            "https://nominatim.openstreetmap.org/reverse?lat=" +
              lat +
              "&lon=" +
              lon +
              "&format=json&zoom=10&addressdetails=1",
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
            "https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=en",
          );
          if (res.ok) {
            const data = await res.json();
            if (data) cityStr = data.city || data.principalSubdivision || "";
          }
        }

        if (cityStr) {
          const normalizedSearch = cityStr.toLowerCase();
          let foundProvId = "";

          for (const prov of provinceOptions) {
            if (normalizedSearch.includes(prov.label.toLowerCase()))
              foundProvId = prov.id;
          }

          if (foundProvId) {
            const provLabel = provinceOptions.find(
              (p) => p.id === foundProvId,
            )?.label;
            onChange({ ...filters, province: provLabel || foundProvId });
          }

          sessionStorage.setItem("navLocation", cityStr);
          setNavLocString(cityStr);
          window.dispatchEvent(
            new CustomEvent("navLocationChange", { detail: cityStr }),
          );
        }
      } catch (e) {
        console.error(e);
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

  const removeFilter = (key: string, value: string) => {
    if (key === "quickVerified") onChange({ ...filters, quickVerified: false });
    else if (key === "quickNew") onChange({ ...filters, quickNew: false });
    else if (key === "quickClosing")
      onChange({ ...filters, quickClosing: false });
    else if (key === "province")
      onChange({ ...filters, province: "All Provinces" });
    else toggleArray(key as keyof CourseFinderFilters, value);
  };

  return (
    <>
      <div className="relative w-full rounded-[20px] border border-gray-200 bg-white p-6 ">
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
              <i className="fa-solid fa-chevron-down text-[10px] transition-transform"></i>
            </button>
          )}
        </div>

        {hasActiveFilters && showAppliedDropdown && (
          <div className="absolute right-6 top-16 z-30 w-[min(520px,calc(100%-3rem))] rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
            <div className="flex flex-wrap gap-2 pb-3">
              {appliedFilters.map((tag, index) => (
                <button
                  key={tag.key + "-" + tag.value + "-" + index}
                  type="button"
                  onClick={() => removeFilter(tag.key, tag.value)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[12px] font-medium text-blue-700 transition-colors hover:border-red-100 hover:bg-red-50 hover:text-red-700"
                >
                  {tag.label}
                  <i className="fa-solid fa-xmark text-[10px]"></i>
                </button>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-2">
              <button
                type="button"
                onClick={() => {
                  onChange(defaultCourseFinderFilters);
                  setShowAppliedDropdown(false);
                }}
                className="text-[12px] font-semibold text-red-600 transition-colors hover:text-red-700"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        <div className="border-b border-gray-100 py-3">
          <button
            type="button"
            onClick={handleLocate}
            className="flex w-full items-center justify-start gap-2 rounded-md border border-black/20 px-4 py-3 text-gray-700 hover:text-brand-blue outline-none transition-all duration-200"
          >
            {locating ? (
              "Locating..."
            ) : (
              <i className="fa-solid fa-location-crosshairs text-[16px]"></i>
            )}
            <span className="text-[15px] font-medium">
              {locating ? "Locating..." : navLocString || "Course Near Me"}
            </span>
          </button>
        </div>

        <div className="space-y-4 pt-4">
          <Accordion title="Academic Level" defaultOpen>
            <div className="flex flex-col gap-3.5 pt-1">
              {ACADEMIC_LEVELS.map((level) => (
                <CheckboxItem
                  key={level.id}
                  id={"acad-" + level.id}
                  label={level.label}
                  count={level.count}
                  checked={filters.academicLevels.includes(level.id)}
                  onChange={() => {
                    const current = filters.academicLevels;
                    const next = current.includes(level.id)
                      ? current.filter((id) => id !== level.id)
                      : [...current, level.id];
                    onChange({ ...filters, academicLevels: next, fields: [] });
                  }}
                />
              ))}
            </div>
          </Accordion>

          <Accordion title="Field of Study" defaultOpen>
            <div className="flex flex-col gap-3.5 pt-1">
              {availableFields.length === 0 ? (
                <p className="px-1 text-[13px] italic text-gray-400">
                  Select an Academic Level first.
                </p>
              ) : (
                availableFields.map((field) => (
                  <CheckboxItem
                    key={field.id}
                    id={"field-" + field.id}
                    label={field.label}
                    count={field.count}
                    checked={filters.fields.includes(field.id)}
                    onChange={() => toggleArray("fields", field.id)}
                  />
                ))
              )}
            </div>
          </Accordion>

          <Accordion title="Location" defaultOpen>
            <div className="flex flex-col gap-2 pt-1">
              <SelectInput
                placeholder="Select Province"
                value={
                  filters.province === "All Provinces" ? "" : filters.province
                }
                options={provinceOptions}
                onChange={(val) =>
                  onChange({
                    ...filters,
                    province: val || "All Provinces",
                    location: [],
                  })
                }
              />
              <SelectInput
                placeholder="Select District"
                value={filters.location[0] || ""}
                options={
                  filters.province && filters.province !== "All Provinces"
                    ? provinceOptions.find((p) => p.id === filters.province)
                        ?.districts || []
                    : []
                }
                onChange={(val) =>
                  onChange({ ...filters, location: val ? [val] : [] })
                }
                disabled={
                  !filters.province || filters.province === "All Provinces"
                }
              />
            </div>
          </Accordion>

          <Accordion title="Institution Type">
            <div className="flex flex-col gap-3.5 pt-1">
              {PROVIDER_TYPES.map((type) => (
                <CheckboxItem
                  key={type.id}
                  id={"type-" + type.id}
                  label={type.label}
                  count={type.count}
                  checked={filters.providerTypes.includes(type.id)}
                  onChange={() => toggleArray("providerTypes", type.id)}
                />
              ))}
            </div>
          </Accordion>

          <Accordion title="Course Duration">
            <div className="flex flex-col gap-3.5 pt-1">
              {DURATIONS.map((dur) => (
                <CheckboxItem
                  key={dur.id}
                  id={"dur-" + dur.id}
                  label={dur.label}
                  count={dur.count}
                  checked={filters.durations.includes(dur.id)}
                  onChange={() => toggleArray("durations", dur.id)}
                />
              ))}
            </div>
          </Accordion>

          <Accordion title="Sort By" defaultOpen>
            <div className="flex flex-col gap-3.5 pt-1">
              {SORT_OPTIONS.map((opt) => (
                <RadioItem
                  key={opt.id}
                  id={"sort-" + opt.id}
                  name="sort"
                  label={opt.label}
                  checked={filters.popularity.includes(opt.id)}
                  onChange={() =>
                    onChange({ ...filters, popularity: [opt.id] })
                  }
                />
              ))}
            </div>
          </Accordion>
        </div>
      </div>

      <style>
        {
          '\
        .custom-checkbox { appearance: none; background-color: #fff; margin: 0; width: 1.15em; height: 1.15em; border: 1px solid #94a3b8; border-radius: 0.25em; display: grid; place-content: center; cursor: pointer; transition: all 0.2s ease-in-out; flex-shrink: 0; }\
        .custom-checkbox::before { content: ""; width: 0.65em; height: 0.65em; transform: scale(0); transition: 120ms transform ease-in-out; box-shadow: inset 1em 1em white; clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%); }\
        .custom-checkbox:checked { background-color: #2563eb; border-color: #2563eb; }\
        .custom-checkbox:checked::before { transform: scale(1); }\
        .custom-checkbox:hover { border-color: #64748b; }\
        .custom-radio { appearance: none; background-color: #fff; margin: 0; width: 1.15em; height: 1.15em; border: 1px solid #94a3b8; border-radius: 50%; display: grid; place-content: center; cursor: pointer; transition: all 0.2s ease-in-out; flex-shrink: 0; }\
        .custom-radio::before { content: ""; width: 0.5em; height: 0.5em; border-radius: 50%; transform: scale(0); transition: 120ms transform ease-in-out; background-color: white; }\
        .custom-radio:checked { background-color: #2563eb; border-color: #2563eb; }\
        .custom-radio:checked::before { transform: scale(1); }\
        .custom-radio:hover { border-color: #64748b; }\
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }\
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }\
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }\
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }\
      '
        }
      </style>
    </>
  );
};

export default CourseFilters;
