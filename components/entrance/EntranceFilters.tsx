import React, { useState, useMemo } from "react";
import {
  EntranceFilterState,
  DEFAULT_ENTRANCE_FILTERS,
} from "@/app/entrance/types";
import GlobalFilterSection from "@/components/ui/GlobalFilterSection";
import { FaSliders } from "react-icons/fa6";

interface EntranceFiltersProps {
  filters: EntranceFilterState;
  setFilters: React.Dispatch<React.SetStateAction<EntranceFilterState>>;
}

const ACADEMIC_LEVELS = [
  { id: "plus2", label: "+2 / Higher Secondary" },
  { id: "bachelor", label: "Bachelor" },
  { id: "master", label: "Master" },
  { id: "diploma", label: "Diploma / CTEVT" },
];

const STREAMS = [
  { id: "science", label: "Science" },
  { id: "management", label: "Management" },
  { id: "medical", label: "Medical" },
  { id: "cs", label: "Computer Science" },
  { id: "humanities", label: "Humanities" },
];

const PROGRAMS = [
  { id: "ioe", label: "IOE Entrance" },
  { id: "cee", label: "CEE Medical" },
  { id: "cmat", label: "CMAT" },
  { id: "kuumatt", label: "KUUMAT" },
  { id: "gate", label: "GATE" },
];

const UNIVERSITIES = [
  { id: "tu", label: "Tribhuvan University (TU)" },
  { id: "ku", label: "Kathmandu University (KU)" },
  { id: "pu", label: "Pokhara University (PU)" },
  { id: "purbanchal", label: "Purbanchal University" },
  { id: "mec", label: "Medical Education Commission" },
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
  Exclude<keyof EntranceFilterState, "search" | "sortBy">
> = ["academicLevel", "stream", "programName", "university", "status", "quick"];

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
  const [programSearch, setProgramSearch] = useState("");
  const [universitySearch, setUniversitySearch] = useState("");

  const toggle = (key: keyof EntranceFilterState, value: string) => {
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

  const filteredPrograms = programSearch
    ? PROGRAMS.filter((p) =>
        p.label.toLowerCase().includes(programSearch.toLowerCase()),
      )
    : PROGRAMS;

  const filteredUniversities = universitySearch
    ? UNIVERSITIES.filter((u) =>
        u.label.toLowerCase().includes(universitySearch.toLowerCase()),
      )
    : UNIVERSITIES;

  const filterLabelMap = useMemo(() => {
    const map = new Map<string, string>();

    ACADEMIC_LEVELS.forEach((item) => map.set(item.id, item.label));
    STREAMS.forEach((item) => map.set(item.id, item.label));
    PROGRAMS.forEach((item) => map.set(item.id, item.label));
    UNIVERSITIES.forEach((item) => map.set(item.id, item.label));
    STATUSES.forEach((item) => map.set(item.id, item.label));

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
          <div className="custom-scrollbar flex max-h-[220px] flex-col gap-3.5 overflow-y-auto pr-1">
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

        <Accordion title="Program Name">
          <SearchInput
            placeholder="Search programs..."
            value={programSearch}
            onChange={setProgramSearch}
          />
          <div className="custom-scrollbar flex max-h-[220px] flex-col gap-3.5 overflow-y-auto pr-1">
            {filteredPrograms.map((item) => (
              <CheckboxItem
                key={item.id}
                id={`prog-${item.id}`}
                label={item.label}
                checked={filters.programName.includes(item.id)}
                onChange={() => toggle("programName", item.id)}
              />
            ))}
          </div>
        </Accordion>

        <Accordion title="University">
          <SearchInput
            placeholder="Search university..."
            value={universitySearch}
            onChange={setUniversitySearch}
          />
          <div className="custom-scrollbar flex max-h-[220px] flex-col gap-3.5 overflow-y-auto pr-1">
            {filteredUniversities.map((item) => (
              <CheckboxItem
                key={item.id}
                id={`uni-${item.id}`}
                label={item.label}
                checked={filters.university.includes(item.id)}
                onChange={() => toggle("university", item.id)}
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
