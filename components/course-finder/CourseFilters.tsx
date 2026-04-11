import React, { useState } from "react";
import {
  CourseFinderFilters,
  CourseFilterCounts,
  defaultCourseFinderFilters,
} from "./types";
import { FaSliders } from "react-icons/fa6";

interface CourseFiltersProps {
  filters: CourseFinderFilters;
  counts: CourseFilterCounts;
  onChange: (next: CourseFinderFilters) => void;
}

const CourseFilters: React.FC<CourseFiltersProps> = ({
  filters,
  counts,
  onChange,
}) => {
  const [openSections, setOpenSections] = useState({
    academicLevel: true,
    fieldOfStudy: true,
    providerType: true,
    location: true,
    feeRange: true,
    scholarship: true,
    duration: true,
    admission: true,
    popularity: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleArray = (
    key: keyof CourseFinderFilters,
    value: string,
  ) => {
    const current = filters[key] as string[];
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden font-sans">
      <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
        <div className="flex items-center gap-3">
          <FaSliders size={18} className="text-black" />
          <h3 className="font-black text-xl text-slate-900 tracking-tight">
            Filters
          </h3>
        </div>
        <button
          onClick={() => onChange(defaultCourseFinderFilters)}
          className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary-600 transition-colors"
        >
          <i className="fa-solid fa-rotate-left mr-1"></i>
          Reset
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Filters */}
        <div className="pb-4">
          <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">
            Quick Filters
          </h4>
          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-1.5 rounded-full bg-green-50 text-green-600 border border-green-100 text-[10px] font-black uppercase tracking-wider hover:shadow-sm transition-all">
              <span onClick={() => onChange({ ...filters, quickVerified: !filters.quickVerified })}>
              Verified
              </span>
            </button>
            <button className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-black uppercase tracking-wider hover:shadow-sm transition-all">
              <span onClick={() => onChange({ ...filters, quickNew: !filters.quickNew })}>
              New
              </span>
            </button>
            <button className="px-3 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-100 text-[10px] font-black uppercase tracking-wider hover:shadow-sm transition-all">
              <span onClick={() => onChange({ ...filters, quickClosing: !filters.quickClosing })}>
              Closing
              </span>
            </button>
          </div>
        </div>

        {/* Academic Level / Program */}
        <CollapsibleSection
          title="Academic Level / Program"
          isOpen={openSections.academicLevel}
          onToggle={() => toggleSection('academicLevel')}
        >
          <FilterCheck id="plus2" label="+2 / Higher Secondary" checked={filters.academicLevels.includes("plus2")} count={counts.byAcademic.plus2 || 0} onToggle={() => toggleArray("academicLevels", "plus2")} />
          <FilterCheck id="bachelor" label="Bachelor" checked={filters.academicLevels.includes("bachelor")} count={counts.byAcademic.bachelor || 0} onToggle={() => toggleArray("academicLevels", "bachelor")} />
          <FilterCheck id="master" label="Master" checked={filters.academicLevels.includes("master")} count={counts.byAcademic.master || 0} onToggle={() => toggleArray("academicLevels", "master")} />
          <FilterCheck id="diploma" label="Diploma / CTEVT" checked={filters.academicLevels.includes("diploma")} count={counts.byAcademic.diploma || 0} onToggle={() => toggleArray("academicLevels", "diploma")} />
          <FilterCheck id="shortterm" label="Short-term Training" checked={filters.academicLevels.includes("shortterm")} count={counts.byAcademic.shortterm || 0} onToggle={() => toggleArray("academicLevels", "shortterm")} />
          <FilterCheck id="cert" label="Professional Certification" checked={filters.academicLevels.includes("cert")} count={counts.byAcademic.cert || 0} onToggle={() => toggleArray("academicLevels", "cert")} />
          <FilterCheck id="distance" label="Online / Distance Course" checked={filters.academicLevels.includes("distance")} count={counts.byAcademic.distance || 0} onToggle={() => toggleArray("academicLevels", "distance")} />
        </CollapsibleSection>

        {/* Field of Study */}
        <CollapsibleSection
          title="Field of study"
          isOpen={openSections.fieldOfStudy}
          onToggle={() => toggleSection('fieldOfStudy')}
        >
          <FilterCheck id="it" label="IT / Computer Science" checked={filters.fields.includes("it")} count={counts.byField.it || 0} onToggle={() => toggleArray("fields", "it")} />
          <FilterCheck id="engineering" label="Engineering" checked={filters.fields.includes("engineering")} count={counts.byField.engineering || 0} onToggle={() => toggleArray("fields", "engineering")} />
          <FilterCheck id="management" label="Management / Business" checked={filters.fields.includes("management")} count={counts.byField.management || 0} onToggle={() => toggleArray("fields", "management")} />
          <FilterCheck id="medical" label="Medicine & Health" checked={filters.fields.includes("medical")} count={counts.byField.medical || 0} onToggle={() => toggleArray("fields", "medical")} />
        </CollapsibleSection>

        {/* Provider Type */}
        <CollapsibleSection
          title="Provider Type"
          isOpen={openSections.providerType}
          onToggle={() => toggleSection('providerType')}
        >
          <div className="space-y-4">
            <FilterCheck id="govt" label="Government College" checked={filters.providerTypes.includes("govt")} count={counts.byProvider.govt || 0} onToggle={() => toggleArray("providerTypes", "govt")} />
            <FilterCheck id="private" label="Private College" checked={filters.providerTypes.includes("private")} count={counts.byProvider.private || 0} onToggle={() => toggleArray("providerTypes", "private")} />
            <FilterCheck
              id="univ"
              label="University-affiliated (TU, KU, PU, Purbanchal)"
              checked={filters.providerTypes.includes("univ")}
              count={counts.byProvider.univ || 0}
              onToggle={() => toggleArray("providerTypes", "univ")}
            />
            <FilterCheck id="auto" label="Autonomous / Independent" checked={filters.providerTypes.includes("auto")} count={counts.byProvider.auto || 0} onToggle={() => toggleArray("providerTypes", "auto")} />
            <FilterCheck
              id="ctevt"
              label="CTEVT / Gov. Training Center"
              checked={filters.providerTypes.includes("ctevt")}
              count={counts.byProvider.ctevt || 0}
              onToggle={() => toggleArray("providerTypes", "ctevt")}
            />
            <FilterCheck id="onlinep" label="Online Platform / Institute" checked={filters.providerTypes.includes("onlinep")} count={counts.byProvider.onlinep || 0} onToggle={() => toggleArray("providerTypes", "onlinep")} />
          </div>
        </CollapsibleSection>

        {/* Location */}
        <CollapsibleSection title="Location" isOpen={openSections.location} onToggle={() => toggleSection('location')}>
          <div className="space-y-4">
            <select value={filters.province} onChange={(event) => onChange({ ...filters, province: event.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary-100 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19%209l-7%207-7-7%22%20%2F%3E%3C%2Fsvg%3E')] bg-[length:1em] bg-[right_1rem_center] bg-no-repeat">
              <option>All Provinces</option>
              <option>Bagmati Province</option>
              <option>Gandaki Province</option>
              <option>Lumbini Province</option>
            </select>
            <FilterCheck id="anywhere" label="National Wide" checked={filters.nationalWide} onToggle={() => onChange({ ...filters, nationalWide: !filters.nationalWide })} />
          </div>
        </CollapsibleSection>

        {/* Total Fee Range (NPR) */}
        <CollapsibleSection
          title="Total Fee Range (NPR)"
          isOpen={openSections.feeRange}
          onToggle={() => toggleSection('feeRange')}
        >
          <FilterCheck id="free" label="Free / Government Funded" checked={filters.feeRanges.includes("free")} onToggle={() => toggleArray("feeRanges", "free")} />
          <FilterCheck id="under50" label="Under NPR 50,000" checked={filters.feeRanges.includes("under50")} onToggle={() => toggleArray("feeRanges", "under50")} />
          <FilterCheck id="range50_100" label="NPR 50,000 – 1,00,000" checked={filters.feeRanges.includes("range50_100")} onToggle={() => toggleArray("feeRanges", "range50_100")} />
          <FilterCheck id="range100_200" label="NPR 1,00,000 – 2,00,000" checked={filters.feeRanges.includes("range100_200")} onToggle={() => toggleArray("feeRanges", "range100_200")} />
          <FilterCheck id="above200" label="Above NPR 2,00,000" checked={filters.feeRanges.includes("above200")} onToggle={() => toggleArray("feeRanges", "above200")} />
        </CollapsibleSection>

        {/* Scholarship / Financial Aid */}
        <CollapsibleSection
          title="Scholarship / Financial Aid"
          isOpen={openSections.scholarship}
          onToggle={() => toggleSection('scholarship')}
        >
          <FilterCheck id="sch-avail" label="Scholarship Available" checked={filters.scholarships.includes("sch-avail")} onToggle={() => toggleArray("scholarships", "sch-avail")} />
          <FilterCheck id="sch-govt" label="Government Scholarship" checked={filters.scholarships.includes("sch-govt")} onToggle={() => toggleArray("scholarships", "sch-govt")} />
          <FilterCheck id="sch-college" label="College Scholarship" checked={filters.scholarships.includes("sch-college")} onToggle={() => toggleArray("scholarships", "sch-college")} />
        </CollapsibleSection>

        {/* Course Duration */}
        <CollapsibleSection
          title="Course Duration"
          isOpen={openSections.duration}
          onToggle={() => toggleSection('duration')}
        >
          <FilterCheck id="dur_lt1" label="< 1 month" checked={filters.durations.includes("dur_lt1")} count={counts.byDuration.dur_lt1 || 0} onToggle={() => toggleArray("durations", "dur_lt1")} />
          <FilterCheck id="dur_1_3" label="1–3 months" checked={filters.durations.includes("dur_1_3")} count={counts.byDuration.dur_1_3 || 0} onToggle={() => toggleArray("durations", "dur_1_3")} />
          <FilterCheck id="dur_3_6" label="3–6 months" checked={filters.durations.includes("dur_3_6")} count={counts.byDuration.dur_3_6 || 0} onToggle={() => toggleArray("durations", "dur_3_6")} />
          <FilterCheck id="dur_6_1" label="6 months–1 year" checked={filters.durations.includes("dur_6_1")} count={counts.byDuration.dur_6_1 || 0} onToggle={() => toggleArray("durations", "dur_6_1")} />
          <FilterCheck id="dur_1_2" label="1–2 years" checked={filters.durations.includes("dur_1_2")} count={counts.byDuration.dur_1_2 || 0} onToggle={() => toggleArray("durations", "dur_1_2")} />
          <FilterCheck id="dur_3_4" label="3–4 years" checked={filters.durations.includes("dur_3_4")} count={counts.byDuration.dur_3_4 || 0} onToggle={() => toggleArray("durations", "dur_3_4")} />
          <FilterCheck id="dur_4plus" label="4+ years" checked={filters.durations.includes("dur_4plus")} count={counts.byDuration.dur_4plus || 0} onToggle={() => toggleArray("durations", "dur_4plus")} />
        </CollapsibleSection>

        {/* Admission Requirement */}
        <CollapsibleSection
          title="Admission Requirement"
          isOpen={openSections.admission}
          onToggle={() => toggleSection('admission')}
        >
          <FilterCheck id="openMerit" label="Open Merit" checked={filters.admissions.includes("openMerit")} onToggle={() => toggleArray("admissions", "openMerit")} />
          <FilterCheck id="entrance" label="Entrance Exam Required" checked={filters.admissions.includes("entrance")} onToggle={() => toggleArray("admissions", "entrance")} />
          <FilterCheck id="interview" label="Interview Required" checked={filters.admissions.includes("interview")} onToggle={() => toggleArray("admissions", "interview")} />
          <FilterCheck id="portfolio" label="Portfolio / Aptitude Test" checked={filters.admissions.includes("portfolio")} onToggle={() => toggleArray("admissions", "portfolio")} />
        </CollapsibleSection>

        {/* Popularity */}
        <CollapsibleSection
          title="Popularity"
          isOpen={openSections.popularity}
          onToggle={() => toggleSection('popularity')}
        >
          <FilterCheck id="mostEnrolled" label="Most Enrolled" checked={filters.popularity.includes("mostEnrolled")} onToggle={() => toggleArray("popularity", "mostEnrolled")} />
          <FilterCheck id="trending" label="Trending Programs" checked={filters.popularity.includes("trending")} onToggle={() => toggleArray("popularity", "trending")} />
          <FilterCheck id="recommended" label="Recommended" checked={filters.popularity.includes("recommended")} onToggle={() => toggleArray("popularity", "recommended")} />
          <FilterCheck id="newPrograms" label="New Programs" checked={filters.popularity.includes("newPrograms")} onToggle={() => toggleArray("popularity", "newPrograms")} />
        </CollapsibleSection>
      </div>
    </div>
  );
};

const CollapsibleSection: React.FC<{
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, isOpen, onToggle, children }) => (
  <div className="border-b border-slate-50 last:border-0 pb-4">
    <button
      onClick={onToggle}
      className="flex justify-between items-center w-full py-2 group"
    >
      <span
        className={`text-[11px] font-black uppercase tracking-[0.15em] transition-colors ${isOpen ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"}`}
      >
        {title}
      </span>
      <i
        className={`fa-solid fa-chevron-down text-[10px] text-slate-300 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
      ></i>
    </button>
    {isOpen && (
      <div className="pt-4 space-y-3 animate-fadeInDown">{children}</div>
    )}
  </div>
);

const FilterCheck: React.FC<{
  id: string;
  label: string;
  checked?: boolean;
  count?: number;
  onToggle?: () => void;
}> = ({ id, label, checked, count, onToggle }) => (
  <label htmlFor={id} className="flex items-center gap-3 group cursor-pointer">
    <div className="relative flex items-center">
      <input
        id={id}
        type="checkbox"
        checked={!!checked}
        onChange={onToggle}
        className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded-lg checked:bg-primary-600 checked:border-primary-600 transition-all cursor-pointer"
      />
      <i className="fa-solid fa-check absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[10px] opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></i>
    </div>
    <span className="text-xs font-bold text-slate-500 group-hover:text-slate-800 transition-colors">
      {label}
      {typeof count === "number" ? ` (${count})` : ""}
    </span>
  </label>
);

export default CourseFilters;
