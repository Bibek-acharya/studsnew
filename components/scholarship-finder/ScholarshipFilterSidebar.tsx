"use client";

import React, { useState, useMemo, useEffect } from "react";
import { FaSliders } from "react-icons/fa6";

interface CheckboxItemProps {
  id: string;
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}

const CheckboxItem: React.FC<CheckboxItemProps> = ({ id, label, count, checked, onChange }) => (
  <label htmlFor={id} className="group flex w-full cursor-pointer items-center justify-between">
    <div className="flex items-center gap-3">
      <input id={id} type="checkbox" checked={checked} onChange={onChange} className="custom-checkbox" />
      <span className="text-[14.5px] text-[#475569] transition-colors group-hover:text-gray-900">{label}</span>
    </div>
    {count !== undefined && (
      <span className="rounded-md bg-slate-50 px-2 py-0.5 text-[12px] font-medium text-slate-500">{count}</span>
    )}
  </label>
);

interface SearchInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ placeholder, value, onChange }) => (
  <div className="relative mb-3">
    <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400"></i>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="block w-full rounded-md border border-gray-200 bg-[#f8fafc] py-2 pl-9 pr-3 text-[13.5px] text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
    />
  </div>
);

interface AccordionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 py-3">
      <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center justify-between py-1">
        <span className="text-[14.5px] font-semibold text-slate-900">{title}</span>
        <i className={`fa-solid fa-chevron-down text-[10px] text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}></i>
      </button>
      {open && <div className="flex flex-col gap-3.5 pt-3">{children}</div>}
    </div>
  );
};

interface ScholarshipFilters {
  studyLevel: string[];
  location: string[];
  courseStream: string[];
  scholarshipType: string[];
  providerType: string[];
  coverage: string[];
  gpaRequirement: string[];
  deadlineType: string[];
}

interface ScholarshipFilterSidebarProps {
  filters: ScholarshipFilters;
  setFilters: React.Dispatch<React.SetStateAction<ScholarshipFilters>>;
  onLocationDetect?: (location: string, lat?: number, lng?: number) => void;
}

const ScholarshipFilterSidebar: React.FC<ScholarshipFilterSidebarProps> = ({
  filters,
  setFilters,
  onLocationDetect,
}) => {
  const [showAppliedDropdown, setShowAppliedDropdown] = useState(false);

  const [locating, setLocating] = useState(false);
  const [navLocString, setNavLocString] = useState("");

  useEffect(() => {
    const updateLocation = (cityStr: string) => {
      if (!cityStr || cityStr === "Detect Location" || cityStr === "Detecting..." || cityStr === "Location Found") return;
      setNavLocString(cityStr);
    };
    const savedLoc = sessionStorage.getItem("navLocation");
    if (savedLoc) updateLocation(savedLoc);
    const savedCoords = sessionStorage.getItem("navLocationCoords");
    if (savedLoc && savedCoords) {
      try {
        const coords = JSON.parse(savedCoords);
        onLocationDetect?.(savedLoc, coords.lat, coords.lng);
      } catch {}
    }
    const handleNavLocation = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      updateLocation(customEvent.detail);
    };
    window.addEventListener("navLocationChange", handleNavLocation);
    return () => window.removeEventListener("navLocationChange", handleNavLocation);
  }, []);

  const handleLocate = async () => {
    if (navigator.geolocation) {
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            const cityStr = data.city || data.locality || data.localityInfo?.[0]?.name || data.principalSubdivision || "Nearby";
            setNavLocString(cityStr);
            sessionStorage.setItem("navLocation", cityStr);
            sessionStorage.setItem("navLocationCoords", JSON.stringify({ lat: latitude, lng: longitude }));
            window.dispatchEvent(new CustomEvent("navLocationChange", { detail: cityStr }));
            onLocationDetect?.(cityStr, latitude, longitude);
          } catch {
            setNavLocString("Nearby");
            sessionStorage.setItem("navLocation", "Nearby");
            onLocationDetect?.("Nearby");
          } finally {
            setLocating(false);
          }
        },
        () => {
          setLocating(false);
          setNavLocString("");
        }
      );
    }
  };

  const toggleFilter = (key: keyof ScholarshipFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((v) => v !== value) : [...prev[key], value],
    }));
  };

  const hasActiveFilters = Object.values(filters).some((arr) => arr.length > 0);

  const appliedFilters = useMemo(() => {
    const tags: { key: keyof ScholarshipFilters; label: string; value: string }[] = [];
    const labels: Record<keyof ScholarshipFilters, string> = {
      studyLevel: "Level",
      location: "Location",
      courseStream: "Course",
      scholarshipType: "Type",
      providerType: "Provider",
      coverage: "Coverage",
      gpaRequirement: "GPA",
      deadlineType: "Deadline",
    };
    Object.entries(filters).forEach(([key, values]) => {
      if (Array.isArray(values)) {
        values.forEach((v) => tags.push({ key: key as keyof ScholarshipFilters, label: labels[key as keyof ScholarshipFilters], value: v }));
      }
    });
    return tags;
  }, [filters]);

  const clearAll = () => setFilters({ studyLevel: [], location: [], courseStream: [], scholarshipType: [], providerType: [], coverage: [], gpaRequirement: [], deadlineType: [] });

  return (
    <aside className="w-full lg:w-1/5 bg-white rounded-md border border-gray-200/80 p-5 shrink-0 sticky top-8">
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FaSliders size={18} className="text-black" />
          <h3 className="font-black text-xl text-slate-900 tracking-tight">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button type="button" onClick={() => setShowAppliedDropdown(!showAppliedDropdown)} className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[12px] font-semibold text-blue-700 transition-colors">
            Applied ({appliedFilters.length})
            <i className={`fa-solid fa-chevron-down text-[10px] transition-transform ${showAppliedDropdown ? "rotate-180" : ""}`}></i>
          </button>
        )}
      </div>

      {hasActiveFilters && showAppliedDropdown && (
        <div className="absolute right-6 top-16 z-30 w-[min(520px,calc(100%-3rem))] rounded-md border border-gray-200 bg-white p-3 shadow-lg">
          {appliedFilters.length === 0 ? (
            <p className="px-1 py-2 text-[13px] italic text-gray-400">No filters selected yet.</p>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 pb-3">
                {appliedFilters.map((tag, index) => (
                  <button
                    key={`${tag.key}-${tag.value}-${index}`}
                    type="button"
                    onClick={() => toggleFilter(tag.key, tag.value)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[12px] font-medium text-blue-700 transition-colors hover:border-red-100 hover:bg-red-50 hover:text-red-700"
                  >
                    {tag.label}: {tag.value}
                    <i className="fa-solid fa-xmark text-[10px]"></i>
                  </button>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-2">
                <button type="button" onClick={() => { clearAll(); setShowAppliedDropdown(false); }} className="text-[12px] font-semibold text-red-600 transition-colors hover:text-red-700">
                  Reset Filters
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Detect Location */}
      <div className="border-b border-gray-100 py-3">
        <button
          type="button"
          onClick={handleLocate}
          className="flex w-full items-center justify-start gap-2 rounded-md border border-black/20 px-4 py-3 text-gray-700 hover:text-brand-blue outline-none transition-all duration-200"
        >
          {locating ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
              <circle cx="12" cy="12" r="3" />
              <circle cx="12" cy="12" r="7" />
              <line x1="12" y1="1" x2="12" y2="5" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="1" y1="12" x2="5" y2="12" />
              <line x1="19" y1="12" x2="23" y2="12" />
            </svg>
          ) : (
            <i className={`fa-solid ${navLocString ? "fa-location-dot" : "fa-location-crosshairs"} text-[16px]`}></i>
          )}
          <span className="text-[15px] font-medium">
            {locating ? "Locating..." : navLocString || "Detect Location"}
          </span>
        </button>
      </div>

      {/* 1. Study Level */}
      <Accordion title="Study Level" defaultOpen>
        <CheckboxItem id="sl-plus2" label="+2" checked={filters.studyLevel.includes("+2")} onChange={() => toggleFilter("studyLevel", "+2")} />
        <CheckboxItem id="sl-alevel" label="A Level" checked={filters.studyLevel.includes("A Level")} onChange={() => toggleFilter("studyLevel", "A Level")} />
        <CheckboxItem id="sl-ctevt" label="CTEVT" checked={filters.studyLevel.includes("CTEVT")} onChange={() => toggleFilter("studyLevel", "CTEVT")} />
      </Accordion>

      {/* 2. Location */}
      <Accordion title="Location">
        <CheckboxItem id="loc-kath" label="Kathmandu" checked={filters.location.includes("Kathmandu")} onChange={() => toggleFilter("location", "Kathmandu")} />
        <CheckboxItem id="loc-lalit" label="Lalitpur" checked={filters.location.includes("Lalitpur")} onChange={() => toggleFilter("location", "Lalitpur")} />
        <CheckboxItem id="loc-pok" label="Pokhara" checked={filters.location.includes("Pokhara")} onChange={() => toggleFilter("location", "Pokhara")} />
        <CheckboxItem id="loc-outsite" label="Outside Nepal" checked={filters.location.includes("Outside Nepal")} onChange={() => toggleFilter("location", "Outside Nepal")} />
      </Accordion>

      {/* 3. Course / Stream */}
      <Accordion title="Course / Stream">
        <CheckboxItem id="cs-science" label="Science" checked={filters.courseStream.includes("Science")} onChange={() => toggleFilter("courseStream", "Science")} />
        <CheckboxItem id="cs-mgmt" label="Management" checked={filters.courseStream.includes("Management")} onChange={() => toggleFilter("courseStream", "Management")} />
        <CheckboxItem id="cs-it" label="IT" checked={filters.courseStream.includes("IT")} onChange={() => toggleFilter("courseStream", "IT")} />
        <CheckboxItem id="cs-medical" label="Medical" checked={filters.courseStream.includes("Medical")} onChange={() => toggleFilter("courseStream", "Medical")} />
        <CheckboxItem id="cs-humanities" label="Humanities" checked={filters.courseStream.includes("Humanities")} onChange={() => toggleFilter("courseStream", "Humanities")} />
        <CheckboxItem id="cs-eng" label="Engineering" checked={filters.courseStream.includes("Engineering")} onChange={() => toggleFilter("courseStream", "Engineering")} />
      </Accordion>

      {/* 4. Scholarship Type */}
      <Accordion title="Scholarship Type">
        <CheckboxItem id="st-merit" label="MERIT BASED" checked={filters.scholarshipType.includes("MERIT BASED")} onChange={() => toggleFilter("scholarshipType", "MERIT BASED")} />
        <CheckboxItem id="st-need" label="NEED BASED" checked={filters.scholarshipType.includes("NEED BASED")} onChange={() => toggleFilter("scholarshipType", "NEED BASED")} />
        <CheckboxItem id="st-partial" label="PARTIAL TUITION" checked={filters.scholarshipType.includes("PARTIAL TUITION")} onChange={() => toggleFilter("scholarshipType", "PARTIAL TUITION")} />
        <CheckboxItem id="st-full" label="FULL TUITION" checked={filters.scholarshipType.includes("FULL TUITION")} onChange={() => toggleFilter("scholarshipType", "FULL TUITION")} />
        <CheckboxItem id="st-research" label="RESEARCH GRANT" checked={filters.scholarshipType.includes("RESEARCH GRANT")} onChange={() => toggleFilter("scholarshipType", "RESEARCH GRANT")} />
      </Accordion>

      {/* 5. Provider Type */}
      <Accordion title="Provider Type">
        <CheckboxItem id="pt-gov" label="Government" checked={filters.providerType.includes("Government")} onChange={() => toggleFilter("providerType", "Government")} />
        <CheckboxItem id="pt-college" label="College" checked={filters.providerType.includes("College")} onChange={() => toggleFilter("providerType", "College")} />
        <CheckboxItem id="pt-uni" label="University" checked={filters.providerType.includes("University")} onChange={() => toggleFilter("providerType", "University")} />
        <CheckboxItem id="pt-ngo" label="NGO" checked={filters.providerType.includes("NGO")} onChange={() => toggleFilter("providerType", "NGO")} />
        <CheckboxItem id="pt-ingo" label="INGO" checked={filters.providerType.includes("INGO")} onChange={() => toggleFilter("providerType", "INGO")} />
        <CheckboxItem id="pt-private" label="Private Organization" checked={filters.providerType.includes("Private Organization")} onChange={() => toggleFilter("providerType", "Private Organization")} />
      </Accordion>

      {/* 6. Scholarship Coverage */}
      <Accordion title="Scholarship Coverage">
        <CheckboxItem id="cov-full" label="Full" checked={filters.coverage.includes("Full")} onChange={() => toggleFilter("coverage", "Full")} />
        <CheckboxItem id="cov-75" label="75%" checked={filters.coverage.includes("75%")} onChange={() => toggleFilter("coverage", "75%")} />
        <CheckboxItem id="cov-50" label="50%" checked={filters.coverage.includes("50%")} onChange={() => toggleFilter("coverage", "50%")} />
        <CheckboxItem id="cov-25" label="25%" checked={filters.coverage.includes("25%")} onChange={() => toggleFilter("coverage", "25%")} />
        <CheckboxItem id="cov-tuition" label="Tuition Only" checked={filters.coverage.includes("Tuition Only")} onChange={() => toggleFilter("coverage", "Tuition Only")} />
      </Accordion>

      {/* 7. GPA Requirement */}
      <Accordion title="GPA Requirement">
        <CheckboxItem id="gpa-no" label="No GPA Required" checked={filters.gpaRequirement.includes("No GPA Required")} onChange={() => toggleFilter("gpaRequirement", "No GPA Required")} />
        <CheckboxItem id="gpa-2" label="2.0+" checked={filters.gpaRequirement.includes("2.0+")} onChange={() => toggleFilter("gpaRequirement", "2.0+")} />
        <CheckboxItem id="gpa-25" label="2.5+" checked={filters.gpaRequirement.includes("2.5+")} onChange={() => toggleFilter("gpaRequirement", "2.5+")} />
        <CheckboxItem id="gpa-3" label="3.0+" checked={filters.gpaRequirement.includes("3.0+")} onChange={() => toggleFilter("gpaRequirement", "3.0+")} />
        <CheckboxItem id="gpa-35" label="3.5+" checked={filters.gpaRequirement.includes("3.5+")} onChange={() => toggleFilter("gpaRequirement", "3.5+")} />
      </Accordion>

      {/* 8. Deadline */}
      <Accordion title="Deadline">
        <CheckboxItem id="dl-soon" label="Ending Soon" checked={filters.deadlineType.includes("Ending Soon")} onChange={() => toggleFilter("deadlineType", "Ending Soon")} />
        <CheckboxItem id="dl-week" label="This Week" checked={filters.deadlineType.includes("This Week")} onChange={() => toggleFilter("deadlineType", "This Week")} />
        <CheckboxItem id="dl-month" label="This Month" checked={filters.deadlineType.includes("This Month")} onChange={() => toggleFilter("deadlineType", "This Month")} />
        <CheckboxItem id="dl-ongoing" label="Ongoing" checked={filters.deadlineType.includes("Ongoing")} onChange={() => toggleFilter("deadlineType", "Ongoing")} />
      </Accordion>
    </aside>
  );
};

export default ScholarshipFilterSidebar;