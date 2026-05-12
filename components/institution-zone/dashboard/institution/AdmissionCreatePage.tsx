"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import * as LucideIcons from "lucide-react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";
import "react-quill-new/dist/quill.snow.css";
import { apiService } from "@/services/api";

const kebabToPascal = (name: string): string =>
  name.replace(/-./g, (m) => m[1].toUpperCase()).replace(/^./, (m) => m.toUpperCase());

const DynamicIcon = ({ name, size = 24, className = "" }: { name: string; size?: number; className?: string }) => {
  const IconComponent = (LucideIcons.icons as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[kebabToPascal(name)];
  return IconComponent ? <IconComponent size={size} className={className} /> : (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
    </svg>
  );
};

const QuillEditor = dynamic(() => import("react-quill-new"), { ssr: false });

const quillModules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "clean"],
  ],
};

const inputClass =
  "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-blue-600 outline-none transition-colors bg-white";
const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";
const selectClass =
  "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-blue-600 outline-none appearance-none bg-white transition-colors";

interface ProgramCard {
  id: number;
  title: string;
  subtitle: string;
  admissionStatus: string;
  programIcon: string;
  description: string;
  streams: string[];
  careers: string[];
}

interface FacilityCard {
  id: number;
  heading: string;
  facilityIcon: string;
  description: string;
}

interface CourseCard {
  id: number;
  courseName: string;
  curriculumLink: string;
  feesText: string;
  applicationDate: string;
  applyLink: string;
}

interface DownloadCard {
  id: number;
  title: string;
  description: string;
}

interface FaqCard {
  id: number;
  question: string;
  answer: string;
}

interface ContactPerson {
  id: number;
  name: string;
  designation: string;
  number: string;
  email: string;
  whatsapp: string;
}

interface ScholarshipCard {
  id: number;
  name: string;
  level: string;
  stream: string;
  coverage: string;
  eligibility: string;
  seats: string;
}

interface EligibilityCriteria {
  id: number;
  level: string;
  stream: string;
  eligibility: string[];
  documents: string[];
}

interface AdmissionStep {
  id: number;
  stepNumber: string;
  title: string;
  description: string;
}

type AnyRecord = Record<string, unknown>;

const nextId = <T extends { id: number }>(items: T[]) =>
  Math.max(0, ...items.map((i) => i.id)) + 1;

const toArr = (v: unknown): string[] =>
  Array.isArray(v) ? v.map(String) : typeof v === "string" && v ? v.split("\n").map(s => s.replace(/^-\s*/, "").trim()).filter(Boolean) : [];

function SectionItemHeader({
  icon,
  title,
  subtitle,
  onAdd,
  addLabel,
}: {
  icon: string;
  title: string;
  subtitle: string;
  onAdd?: () => void;
  addLabel?: string;
}) {
  return (
    <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
          <DynamicIcon name={icon} size={20} />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
        </div>
      </div>
      {onAdd && (
        <button
          onClick={onAdd}
          className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {addLabel}
        </button>
      )}
    </div>
  );
}

const AdmissionCreatePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [overviewHeading, setOverviewHeading] = useState("");
  const [overviewDesc, setOverviewDesc] = useState("");
  const [applicationFormLink, setApplicationFormLink] = useState("");
  const [level, setLevel] = useState("");

  const [whatsNewTitle, setWhatsNewTitle] = useState("");
  const [whatsNewDesc, setWhatsNewDesc] = useState("");
  const [whatsNewBtnText, setWhatsNewBtnText] = useState("");
  const [whatsNewBtnLink, setWhatsNewBtnLink] = useState("");

  const [programs, setPrograms] = useState<ProgramCard[]>([]);
  const [facilities, setFacilities] = useState<FacilityCard[]>([]);
  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [downloads, setDownloads] = useState<DownloadCard[]>([]);

  const [faqs, setFaqs] = useState<FaqCard[]>([]);
  const [contactPersons, setContactPersons] = useState<ContactPerson[]>([]);
  const [scholarships, setScholarships] = useState<ScholarshipCard[]>([]);

  const [eligibilityCriteria, setEligibilityCriteria] = useState<EligibilityCriteria[]>([]);

  const [admissionSteps, setAdmissionSteps] = useState<AdmissionStep[]>([]);

  const [brochureUrl, setBrochureUrl] = useState("");

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const fieldError = (field: string) =>
    errors[field] ? "ring-2 ring-red-500" : "";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiService.getInstitutionProfile();
        if (res.success && res.data) {
          const d = res.data;
          const od = d.overview_data;
          if (od) {
            setOverviewHeading(String(od.overviewHeading ?? ""));
            setOverviewDesc(String(od.overviewDesc ?? ""));
            setApplicationFormLink(String(od.applicationFormLink ?? ""));
            setLevel(String(od.level ?? ""));
          }
          const wnd = d.whats_new_data;
          if (wnd) {
            setWhatsNewTitle(wnd.title || "");
            setWhatsNewDesc(wnd.description || "");
            setWhatsNewBtnText(wnd.btnText || "");
            setWhatsNewBtnLink(wnd.btnLink || "");
          }
          const pd = d.programs_data;
          if (pd && Array.isArray(pd)) {
            setPrograms(
              pd.map((p: AnyRecord, i: number) => {
                const rawStreams = p.streams;
                const rawCareers = p.careers;
                return {
                  id: i + 1,
                  title: String(p.title ?? ""),
                  subtitle: String(p.subtitle ?? ""),
                  admissionStatus: String(p.admissionStatus ?? ""),
                  programIcon: String(p.programIcon ?? ""),
                  description: String(p.description ?? ""),
                  streams: Array.isArray(rawStreams) ? rawStreams.map(String) : (typeof rawStreams === "string" && rawStreams ? rawStreams.split("\n").map(s => s.replace(/^-\s*/, "").trim()).filter(Boolean) : []),
                  careers: Array.isArray(rawCareers) ? rawCareers.map(String) : (typeof rawCareers === "string" && rawCareers ? rawCareers.split("\n").map(s => s.replace(/^-\s*/, "").trim()).filter(Boolean) : []),
                };
              })
            );
          }
          const fd = d.facilities_data;
          if (fd && Array.isArray(fd)) {
            setFacilities(
              fd.map((f: AnyRecord, i: number) => ({
                id: i + 1,
                heading: String(f.heading ?? ""),
                facilityIcon: String(f.facilityIcon ?? ""),
                description: String(f.description ?? ""),
              }))
            );
          }
          const cd = d.courses_data;
          if (cd && Array.isArray(cd)) {
            setCourses(
              cd.map((c: AnyRecord, i: number) => ({
                id: i + 1,
                courseName: String(c.courseName ?? ""),
                curriculumLink: String(c.curriculumLink ?? ""),
                feesText: String(c.feesText ?? ""),
                applicationDate: String(c.applicationDate ?? ""),
                applyLink: String(c.applyLink ?? ""),
              }))
            );
          }
          const bd = d.brochure_data as AnyRecord | undefined;
          if (bd) {
            setBrochureUrl(String(bd.url ?? ""));
          }
          const dd = d.downloads_data;
          if (dd && Array.isArray(dd)) {
            setDownloads(
              dd.map((dl: AnyRecord, i: number) => ({
                id: i + 1,
                title: String(dl.title ?? ""),
                description: String(dl.description ?? ""),
              }))
            );
          }
          const faqD = d.faqs_data;
          if (faqD && Array.isArray(faqD)) {
            setFaqs(
              faqD.map((fq: AnyRecord, i: number) => ({
                id: i + 1,
                question: String(fq.question ?? ""),
                answer: String(fq.answer ?? ""),
              }))
            );
          }
          const cpD = d.contact_persons_data;
          if (cpD && Array.isArray(cpD)) {
            setContactPersons(
              cpD.map((cp: AnyRecord, i: number) => ({
                id: i + 1,
                name: String(cp.name ?? ""),
                designation: String(cp.designation ?? ""),
                number: String(cp.number ?? ""),
                email: String(cp.email ?? ""),
                whatsapp: String(cp.whatsapp ?? ""),
              }))
            );
          }
          const scD = d.scholarships_data;
          if (scD && Array.isArray(scD)) {
            setScholarships(
              scD.map((s: AnyRecord, i: number) => ({
                id: i + 1,
                name: String(s.name ?? ""),
                level: String(s.level ?? ""),
                stream: String(s.stream ?? ""),
                coverage: String(s.coverage ?? ""),
                eligibility: String(s.eligibility ?? ""),
                seats: String(s.seats ?? ""),
              }))
            );
          }
          const elD = d.eligibility_data as AnyRecord | undefined;
          if (elD) {
            const items = elD.criteria;
            if (items && Array.isArray(items)) {
              setEligibilityCriteria(
                items.map((ec: AnyRecord, i: number) => {
                  const rawElig = ec.eligibility;
                  const rawDocs = ec.documents;
                  return {
                    id: i + 1,
                    level: String(ec.level ?? ""),
                    stream: String(ec.stream ?? ""),
                    eligibility: Array.isArray(rawElig) ? rawElig.map(String) : (typeof rawElig === "string" && rawElig ? rawElig.split("\n").map(s => s.replace(/^-\s*/, "").trim()).filter(Boolean) : []),
                    documents: Array.isArray(rawDocs) ? rawDocs.map(String) : (typeof rawDocs === "string" && rawDocs ? rawDocs.split("\n").map(s => s.replace(/^-\s*/, "").trim()).filter(Boolean) : []),
                  };
                })
              );
            }
          }
          const apD = d.admission_process_data;
          if (apD && Array.isArray(apD)) {
            setAdmissionSteps(
              apD.map((st: AnyRecord, i: number) => ({
                id: i + 1,
                stepNumber: String(st.stepNumber ?? ""),
                title: String(st.title ?? ""),
                description: String(st.description ?? ""),
              }))
            );
          }

        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const validate = useCallback(() => {
    const errs: Record<string, boolean> = {};
    if (!overviewHeading.trim()) errs.overviewHeading = true;
    if (!overviewDesc.trim()) errs.overviewDesc = true;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [overviewHeading, overviewDesc]);

  const collectData = () => ({
    overview_data: {
      overviewHeading,
      overviewDesc,
      applicationFormLink,
      level,
    },
    whats_new_data: {
      title: whatsNewTitle,
      description: whatsNewDesc,
      btnText: whatsNewBtnText,
      btnLink: whatsNewBtnLink,
    },
    programs_data: programs.map((p) => {
      const { id: _, ...rest } = p; void _; return rest;
    }),
    facilities_data: facilities.map((f) => {
      const { id: _, ...rest } = f; void _; return rest;
    }),
    courses_data: courses.map((c) => {
      const { id: _, ...rest } = c; void _; return rest;
    }),
    downloads_data: downloads.map((d) => {
      const { id: _, ...rest } = d; void _; return rest;
    }),
    faqs_data: faqs.map((fq) => {
      const { id: _, ...rest } = fq; void _; return rest;
    }),
    contact_persons_data: contactPersons.map((cp) => {
      const { id: _, ...rest } = cp; void _; return rest;
    }),
    scholarships_data: scholarships.map((s) => {
      const { id: _, ...rest } = s; void _; return rest;
    }),
    eligibility_data: eligibilityCriteria.map((ec) => {
      const { id: _, ...rest } = ec; void _; return rest;
    }),
    admission_process_data: admissionSteps.map((as) => {
      const { id: _, ...rest } = as; void _; return rest;
    }),
    brochure_data: {
      url: brochureUrl,
    },
  });

  const handleSave = async (publish: boolean) => {
    if (publish && !validate()) return;
    setSaving(true);
    try {
      const data = collectData();
      await apiService.updateInstitutionProfile(data);
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 min-h-full">
        <SectionHeader
          title="Create Admission"
          breadcrumbItems={[
            { label: "Dashboard", href: "/institution-zone/dashboard/overview" },
            { label: "Create Admission" },
          ]}
        />
        <div className="flex items-center justify-center h-64 text-gray-400">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-full">
      <SectionHeader
        title="Create Admission"
        breadcrumbItems={[
          { label: "Dashboard", href: "/institution-zone/dashboard/overview" },
          { label: "Create Admission" },
        ]}
      />

      <div className="space-y-6">
        {/* 1. Admissions Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4 flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-800">Admissions Overview</h2>
              <p className="text-sm text-gray-500 mt-0.5">Manage the main admission landing page content</p>
            </div>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className={labelClass}>Main Title (Admission Heading) <span className="text-red-500">*</span></label>
              <input
                type="text"
                className={`${inputClass} ${fieldError("overviewHeading")}`}
                placeholder="e.g. Admissions Now Open for New Session"
                value={overviewHeading}
                onChange={(e) => setOverviewHeading(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">This appears at the top of the admissions page</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Level <span className="text-red-500">*</span></label>
                <select
                  className={selectClass}
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%230000ff'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1rem center",
                    backgroundSize: "1.2em",
                    paddingRight: "2.5rem",
                  }}
                >
                  <option value="">Select Level</option>
                  <option value="+2">+2</option>
                  <option value="A-Level">A-Level</option>
                  <option value="Diploma/CTEVT">Diploma/CTEVT</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Select the academic level for this admission</p>
              </div>
              <div>
                <label className={labelClass}>Application Form Link</label>
                <input
                  type="url"
                  className={inputClass}
                  placeholder="https://example.com/apply"
                  value={applicationFormLink}
                  onChange={(e) => setApplicationFormLink(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">URL where students can submit their application</p>
              </div>
            </div>
            <div>
              <label className={labelClass}>Hero Banner Image <span className="text-red-500">*</span></label>
              <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-blue-400 transition-colors cursor-pointer group">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-full group-hover:scale-110 transition-transform">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
                <span className="mt-4 text-sm font-medium text-gray-900">Click to change banner image</span>
                <span className="mt-1 text-xs text-gray-500">Recommended size: 1920x600px (JPG/PNG)</span>
                <input type="file" className="hidden" />
              </label>
            </div>
            <div>
              <label className={labelClass}>Overview Description <span className="text-red-500">*</span></label>
              <div className={`border border-gray-200 rounded-lg overflow-hidden ${fieldError("overviewDesc")}`}>
                <QuillEditor
                  value={overviewDesc}
                  onChange={setOverviewDesc}
                  modules={quillModules}
                  placeholder="Describe the admission program..."
                  style={{ minHeight: "120px" }}
                  className="bg-white"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Describe the admission program, key highlights, and what the page offers</p>
            </div>
          </div>
        </div>

        {/* 2. Our Programs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <SectionItemHeader
            icon="book-marked"
            title="Our Programs"
            subtitle="Manage programs offered and their details"
            onAdd={() =>
              setPrograms((prev) => [
                ...prev,
                {
                  id: nextId(prev),
                  title: "",
                  subtitle: "",
                  admissionStatus: "",
                  programIcon: "",
                  description: "",
                  streams: [],
                  careers: [],
                },
              ])
            }
            addLabel="Add Program"
          />
          <div className="p-6 space-y-6">
            {programs.map((p) => (
              <div key={p.id} className="p-5 bg-gray-50 rounded-lg border border-gray-200 relative group">
                <button
                  onClick={() => setPrograms((prev) => prev.filter((x) => x.id !== p.id))}
                  className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-12">
                  <div className="md:col-span-2">
                    <label className={labelClass}>Program Icon <span className="text-red-500">*</span></label>
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        </div>
                        <input
                          type="text"
                          className={`${inputClass} pl-10`}
                          placeholder="e.g. graduation-cap, flask, book-open"
                          value={p.programIcon}
                          onChange={(e) =>
                            setPrograms((prev) =>
                              prev.map((x) => (x.id === p.id ? { ...x, programIcon: e.target.value } : x))
                            )
                          }
                        />
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        {p.programIcon ? (
                          <DynamicIcon name={p.programIcon} size={24} />
                        ) : (
                          <span className="text-xs text-gray-400">Icon</span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Enter a Lucide icon name. Browse icons at{" "}
                      <a href="https://lucide.dev/icons" target="_blank" rel="noreferrer" className="text-blue-500 underline">
                        lucide.dev/icons
                      </a>
                    </p>
                  </div>
                  <div>
                    <label className={labelClass}>Program Title <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. Science (+2)"
                      value={p.title}
                      onChange={(e) =>
                        setPrograms((prev) =>
                          prev.map((x) => (x.id === p.id ? { ...x, title: e.target.value } : x))
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Subtitle / Affiliation <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. NEB Affiliated | 2 Years Program"
                      value={p.subtitle}
                      onChange={(e) =>
                        setPrograms((prev) =>
                          prev.map((x) => (x.id === p.id ? { ...x, subtitle: e.target.value } : x))
                        )
                      }
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Admission Status <span className="text-red-500">*</span></label>
                    <select
                      className={selectClass}
                      value={p.admissionStatus}
                      onChange={(e) =>
                        setPrograms((prev) =>
                          prev.map((x) => (x.id === p.id ? { ...x, admissionStatus: e.target.value } : x))
                        )
                      }
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%230000ff'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 1rem center",
                        backgroundSize: "1.2em",
                        paddingRight: "2.5rem",
                      }}
                    >
                      <option value="">Select Status</option>
                      <option value="deadline-near">Deadline Near</option>
                      <option value="limited-seats">Limited Seats</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="seats-available">Seats Available</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Description <span className="text-red-500">*</span></label>
                    <textarea
                      className={`${inputClass} min-h-[80px]`}
                      rows={3}
                      placeholder="Our Science program is designed for..."
                      value={p.description}
                      onChange={(e) =>
                        setPrograms((prev) =>
                          prev.map((x) => (x.id === p.id ? { ...x, description: e.target.value } : x))
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Available Streams (bullet points) <span className="text-red-500">*</span></label>
                    <div className="space-y-2">
                      {p.streams.map((item, si) => (
                        <div key={si} className="flex items-center gap-2">
                          <span className="text-gray-400 shrink-0">&bull;</span>
                          <input
                            type="text"
                            className={inputClass}
                            placeholder="e.g. Physics, Chemistry, Biology"
                            value={item}
                            onChange={(e) =>
                              setPrograms((prev) =>
                                prev.map((x) =>
                                  x.id === p.id
                                    ? {
                                        ...x,
                                        streams: x.streams.map((s, j) =>
                                          j === si ? e.target.value : s
                                        ),
                                      }
                                    : x
                                )
                              )
                            }
                          />
                          <button
                            onClick={() =>
                              setPrograms((prev) =>
                                prev.map((x) =>
                                  x.id === p.id
                                    ? { ...x, streams: x.streams.filter((_, j) => j !== si) }
                                    : x
                                )
                              )
                            }
                            className="p-1.5 text-red-400 hover:text-red-600 shrink-0"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() =>
                          setPrograms((prev) =>
                            prev.map((x) =>
                              x.id === p.id ? { ...x, streams: [...x.streams, ""] } : x
                            )
                          )
                        }
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Add Stream
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Career Opportunities (bullet points) <span className="text-red-500">*</span></label>
                    <div className="space-y-2">
                      {p.careers.map((item, ci) => (
                        <div key={ci} className="flex items-center gap-2">
                          <span className="text-gray-400 shrink-0">&bull;</span>
                          <input
                            type="text"
                            className={inputClass}
                            placeholder="e.g. Medicine (MBBS)"
                            value={item}
                            onChange={(e) =>
                              setPrograms((prev) =>
                                prev.map((x) =>
                                  x.id === p.id
                                    ? {
                                        ...x,
                                        careers: x.careers.map((c, j) =>
                                          j === ci ? e.target.value : c
                                        ),
                                      }
                                    : x
                                )
                              )
                            }
                          />
                          <button
                            onClick={() =>
                              setPrograms((prev) =>
                                prev.map((x) =>
                                  x.id === p.id
                                    ? { ...x, careers: x.careers.filter((_, j) => j !== ci) }
                                    : x
                                )
                              )
                            }
                            className="p-1.5 text-red-400 hover:text-red-600 shrink-0"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() =>
                          setPrograms((prev) =>
                            prev.map((x) =>
                              x.id === p.id ? { ...x, careers: [...x.careers, ""] } : x
                            )
                          )
                        }
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Add Career
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Eligibility Criteria */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <SectionItemHeader
            icon="clipboard-check"
            title="Eligibility Criteria"
            subtitle="Define academic eligibility and required documents"
            onAdd={() =>
              setEligibilityCriteria((prev) => [
                ...prev,
                { id: nextId(prev), level: "", stream: "", eligibility: [], documents: [] },
              ])
            }
            addLabel="Add Criteria"
          />
          <div className="p-6 space-y-6">
            <div className="space-y-6">
              {eligibilityCriteria.map((ec) => (
                <div key={ec.id} className="p-5 bg-gray-50 rounded-lg border border-gray-200 relative group">
                  <button
                    onClick={() => setEligibilityCriteria((prev) => prev.filter((x) => x.id !== ec.id))}
                    className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-12">
                    <div>
                      <label className={labelClass}>Level <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="e.g. +2 Science"
                        value={ec.level}
                        onChange={(e) =>
                          setEligibilityCriteria((prev) =>
                            prev.map((x) => (x.id === ec.id ? { ...x, level: e.target.value } : x))
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Stream/Faculty <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="e.g. PCB, PCM, Computer Science"
                        value={ec.stream}
                        onChange={(e) =>
                          setEligibilityCriteria((prev) =>
                            prev.map((x) => (x.id === ec.id ? { ...x, stream: e.target.value } : x))
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Eligibility (bullet points) <span className="text-red-500">*</span></label>
                      <div className="space-y-2">
                        {toArr(ec.eligibility).map((item, ei) => (
                          <div key={ei} className="flex items-center gap-2">
                            <span className="text-gray-400 shrink-0">&bull;</span>
                            <input
                              type="text"
                              className={inputClass}
                              placeholder="e.g. Minimum 2.5 GPA in SEE"
                              value={item}
                              onChange={(e) =>
                                setEligibilityCriteria((prev) =>
                                  prev.map((x) =>
                                    x.id === ec.id
                                      ? { ...x, eligibility: x.eligibility.map((v, j) => j === ei ? e.target.value : v) }
                                      : x
                                  )
                                )
                              }
                            />
                            <button
                              onClick={() =>
                                setEligibilityCriteria((prev) =>
                                  prev.map((x) =>
                                    x.id === ec.id
                                      ? { ...x, eligibility: x.eligibility.filter((_, j) => j !== ei) }
                                      : x
                                  )
                                )
                              }
                              className="p-1.5 text-red-400 hover:text-red-600 shrink-0"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() =>
                            setEligibilityCriteria((prev) =>
                              prev.map((x) =>
                                x.id === ec.id ? { ...x, eligibility: [...x.eligibility, ""] } : x
                              )
                            )
                          }
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                          Add Item
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Required Documents (bullet points) <span className="text-red-500">*</span></label>
                      <div className="space-y-2">
                        {toArr(ec.documents).map((item, di) => (
                          <div key={di} className="flex items-center gap-2">
                            <span className="text-gray-400 shrink-0">&bull;</span>
                            <input
                              type="text"
                              className={inputClass}
                              placeholder="e.g. SEE Mark Sheet"
                              value={item}
                              onChange={(e) =>
                                setEligibilityCriteria((prev) =>
                                  prev.map((x) =>
                                    x.id === ec.id
                                      ? { ...x, documents: x.documents.map((v, j) => j === di ? e.target.value : v) }
                                      : x
                                  )
                                )
                              }
                            />
                            <button
                              onClick={() =>
                                setEligibilityCriteria((prev) =>
                                  prev.map((x) =>
                                    x.id === ec.id
                                      ? { ...x, documents: x.documents.filter((_, j) => j !== di) }
                                      : x
                                  )
                                )
                              }
                              className="p-1.5 text-red-400 hover:text-red-600 shrink-0"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() =>
                            setEligibilityCriteria((prev) =>
                              prev.map((x) =>
                                x.id === ec.id ? { ...x, documents: [...x.documents, ""] } : x
                              )
                            )
                          }
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                          Add Item
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Admission Process */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <SectionItemHeader
            icon="list-ordered"
            title="Admission Process"
            subtitle="Step-by-step admission guide"
            onAdd={() =>
              setAdmissionSteps((prev) => [
                ...prev,
                { id: nextId(prev), stepNumber: String(prev.length + 1), title: "", description: "" },
              ])
            }
            addLabel="Add Step"
          />
          <div className="p-6 space-y-6">
            <div className="space-y-6">
              {admissionSteps.map((step) => (
                <div key={step.id} className="p-5 bg-gray-50 rounded-lg border border-gray-200 relative group">
                  <button
                    onClick={() => setAdmissionSteps((prev) => prev.filter((x) => x.id !== step.id))}
                    className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pr-12">
                    <div className="md:col-span-2">
                      <label className={labelClass}>Step # <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        className={`${inputClass} text-center font-semibold bg-gray-100`}
                        value={String(admissionSteps.indexOf(step) + 1)}
                        readOnly
                      />
                    </div>
                    <div className="md:col-span-10">
                      <label className={labelClass}>Step Title <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="e.g. Entrance Form Fill Up"
                        value={step.title}
                        onChange={(e) =>
                          setAdmissionSteps((prev) =>
                            prev.map((x) => (x.id === step.id ? { ...x, title: e.target.value } : x))
                          )
                        }
                      />
                    </div>
                    <div className="md:col-span-12">
                      <label className={labelClass}>Short Description <span className="text-red-500">*</span></label>
                      <textarea
                        className={`${inputClass} min-h-[80px]`}
                        rows={3}
                        placeholder="Brief description of this step..."
                        value={step.description}
                        onChange={(e) =>
                          setAdmissionSteps((prev) =>
                            prev.map((x) => (x.id === step.id ? { ...x, description: e.target.value } : x))
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Our Facilities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <SectionItemHeader
            icon="building"
            title="Our Facilities"
            subtitle="Key facilities provided by the organization"
            onAdd={() =>
              setFacilities((prev) => [
                ...prev,
                { id: nextId(prev), heading: "", facilityIcon: "", description: "" },
              ])
            }
            addLabel="Add Facility"
          />
          <div className="p-6 space-y-4">
            <div className="space-y-4">
              {facilities.map((f) => (
                <div key={f.id} className="flex gap-4 items-start p-5 bg-gray-50 rounded-lg border border-gray-200 relative group">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className={labelClass}>Facility Icon <span className="text-red-500">*</span></label>
                      <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                          </div>
                          <input
                            type="text"
                            className={`${inputClass} pl-10`}
                            placeholder="e.g. library, building, laptop"
                            value={f.facilityIcon}
                            onChange={(e) =>
                              setFacilities((prev) =>
                                prev.map((x) => (x.id === f.id ? { ...x, facilityIcon: e.target.value } : x))
                              )
                            }
                          />
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          {f.facilityIcon ? (
                            <DynamicIcon name={f.facilityIcon} size={24} />
                          ) : (
                            <span className="text-xs text-gray-400">Icon</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}>Heading <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="e.g. Modern Library"
                        value={f.heading}
                        onChange={(e) =>
                          setFacilities((prev) =>
                            prev.map((x) => (x.id === f.id ? { ...x, heading: e.target.value } : x))
                          )
                        }
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}>Description <span className="text-red-500">*</span></label>
                      <textarea
                        className={`${inputClass} min-h-[80px]`}
                        rows={3}
                        placeholder="Describe the facility..."
                        value={f.description}
                        onChange={(e) =>
                          setFacilities((prev) =>
                            prev.map((x) => (x.id === f.id ? { ...x, description: e.target.value } : x))
                          )
                        }
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setFacilities((prev) => prev.filter((x) => x.id !== f.id))}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-7 transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 6. Courses and Fees */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <SectionItemHeader
            icon="book-open"
            title="Courses and Fees"
            subtitle="Manage course details, fees, application dates, and links"
              onAdd={() =>
                setCourses((prev) => [
                  ...prev,
                  {
                    id: nextId(prev),
                    courseName: "",
                    curriculumLink: "",
                    feesText: "",
                    applicationDate: "",
                    applyLink: "",
                  },
                ])
              }
              addLabel="Add Course"
            />
            <div className="p-6 space-y-6">
              {courses.map((c) => (
                <div key={c.id} className="p-5 bg-gray-50 rounded-lg border border-gray-200 relative group">
                  <button
                    onClick={() => setCourses((prev) => prev.filter((x) => x.id !== c.id))}
                    className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-12">
                    <div>
                      <label className={labelClass}>Course Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="e.g. Science (+2)"
                        value={c.courseName}
                        onChange={(e) =>
                          setCourses((prev) =>
                            prev.map((x) => (x.id === c.id ? { ...x, courseName: e.target.value } : x))
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className={labelClass}>View Curriculum Link <span className="text-red-500">*</span></label>
                      <input
                        type="url"
                        className={inputClass}
                        placeholder="https://..."
                        value={c.curriculumLink}
                        onChange={(e) =>
                          setCourses((prev) =>
                            prev.map((x) => (x.id === c.id ? { ...x, curriculumLink: e.target.value } : x))
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Total Fees <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="e.g. Contact College for Details"
                        value={c.feesText}
                        onChange={(e) =>
                          setCourses((prev) =>
                            prev.map((x) => (x.id === c.id ? { ...x, feesText: e.target.value } : x))
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Application Date <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="e.g. Aug 2026"
                        value={c.applicationDate}
                        onChange={(e) =>
                          setCourses((prev) =>
                            prev.map((x) => (x.id === c.id ? { ...x, applicationDate: e.target.value } : x))
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Apply Now Link <span className="text-red-500">*</span></label>
                      <input
                        type="url"
                        className={inputClass}
                        placeholder="https://..."
                        value={c.applyLink}
                        onChange={(e) =>
                          setCourses((prev) =>
                            prev.map((x) => (x.id === c.id ? { ...x, applyLink: e.target.value } : x))
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </div>

        {/* 7. Scholarships Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <SectionItemHeader
            icon="graduation-cap"
            title="Scholarships Overview"
            subtitle="Available scholarships and detailed requirements"
            onAdd={() =>
              setScholarships((prev) => [
                ...prev,
                { id: nextId(prev), name: "", level: "", stream: "", coverage: "", eligibility: "", seats: "" },
              ])
            }
            addLabel="Add Scholarship"
          />
          <div className="p-6 space-y-6">
            {scholarships.map((s) => (
              <div key={s.id} className="p-5 bg-gray-50 rounded-lg border border-gray-200 relative group">
                <button
                  onClick={() => setScholarships((prev) => prev.filter((x) => x.id !== s.id))}
                  className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-12">
                  <div>
                    <label className={labelClass}>Scholarship Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. Merit Scholarship"
                      value={s.name}
                      onChange={(e) =>
                        setScholarships((prev) =>
                          prev.map((x) => (x.id === s.id ? { ...x, name: e.target.value } : x))
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Scholarship Level <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. +2"
                      value={s.level}
                      onChange={(e) =>
                        setScholarships((prev) =>
                          prev.map((x) => (x.id === s.id ? { ...x, level: e.target.value } : x))
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Stream <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. Science"
                      value={s.stream}
                      onChange={(e) =>
                        setScholarships((prev) =>
                          prev.map((x) => (x.id === s.id ? { ...x, stream: e.target.value } : x))
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Coverage <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. 100%"
                      value={s.coverage}
                      onChange={(e) =>
                        setScholarships((prev) =>
                          prev.map((x) => (x.id === s.id ? { ...x, coverage: e.target.value } : x))
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Eligibility <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. GPA 3.8+"
                      value={s.eligibility}
                      onChange={(e) =>
                        setScholarships((prev) =>
                          prev.map((x) => (x.id === s.id ? { ...x, eligibility: e.target.value } : x))
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Seats <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. 2"
                      value={s.seats}
                      onChange={(e) => {
                        const v = e.target.value.replace(/[^0-9]/g, "");
                        setScholarships((prev) =>
                          prev.map((x) => (x.id === s.id ? { ...x, seats: v } : x))
                        );
                      }}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Upload PDF/Doc <span className="text-red-500">*</span></label>
                    <label className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-blue-400 transition-colors cursor-pointer group">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-full group-hover:scale-110 transition-transform">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      </div>
                      <span className="mt-2 text-sm font-medium text-gray-900">Upload PDF/Doc</span>
                      <input type="file" className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. Key Contact Persons */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <SectionItemHeader
            icon="users"
            title="Key Contact Persons"
            subtitle="Specific individuals for contact"
            onAdd={() =>
              setContactPersons((prev) => [
                ...prev,
                { id: nextId(prev), name: "", designation: "", number: "", email: "", whatsapp: "" },
              ])
            }
            addLabel="Add Contact Person"
          />
          <div className="p-6 space-y-6">
            {contactPersons.map((cp) => (
              <div key={cp.id} className="p-5 bg-gray-50 rounded-lg border border-gray-200 relative group">
                <button
                  onClick={() => setContactPersons((prev) => prev.filter((x) => x.id !== cp.id))}
                  className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-12">
                  <div className="md:col-span-2">
                    <label className={labelClass}>Contact Person Image <span className="text-red-500">*</span></label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 border border-gray-300">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      </div>
                      <button className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 shadow-sm">
                        Upload Image
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. Jane Doe"
                      value={cp.name}
                      onChange={(e) =>
                        setContactPersons((prev) =>
                          prev.map((x) => (x.id === cp.id ? { ...x, name: e.target.value } : x))
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Designation <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. Admissions Officer"
                      value={cp.designation}
                      onChange={(e) =>
                        setContactPersons((prev) =>
                          prev.map((x) => (x.id === cp.id ? { ...x, designation: e.target.value } : x))
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Number <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. 9800000000"
                      value={cp.number}
                      onChange={(e) => {
                        const v = e.target.value.replace(/[^0-9+]/g, "");
                        setContactPersons((prev) =>
                          prev.map((x) => (x.id === cp.id ? { ...x, number: v } : x))
                        );
                      }}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Email <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      className={inputClass}
                      placeholder="email@example.com"
                      value={cp.email}
                      onChange={(e) =>
                        setContactPersons((prev) =>
                          prev.map((x) => (x.id === cp.id ? { ...x, email: e.target.value } : x))
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>WhatsApp Link <span className="text-red-500">*</span></label>
                    <input
                      type="url"
                      className={inputClass}
                      placeholder="https://wa.me/98XXXXXXXX"
                      value={cp.whatsapp}
                      onChange={(e) =>
                        setContactPersons((prev) =>
                          prev.map((x) => (x.id === cp.id ? { ...x, whatsapp: e.target.value } : x))
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 9. Frequently Asked Questions (FAQ) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <SectionItemHeader
            icon="help-circle"
            title="Frequently Asked Questions (FAQ)"
            subtitle="Common questions and answers"
            onAdd={() =>
              setFaqs((prev) => [
                ...prev,
                { id: nextId(prev), question: "", answer: "" },
              ])
            }
            addLabel="Add Question"
          />
          <div className="p-6 space-y-4">
            {faqs.map((f) => (
              <div key={f.id} className="p-5 bg-gray-50 rounded-lg border border-gray-200 relative group flex flex-col gap-4">
                <button
                  onClick={() => setFaqs((prev) => prev.filter((x) => x.id !== f.id))}
                  className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg z-10 transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
                <div className="space-y-1.5 pr-12">
                  <label className={labelClass}>Question <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="e.g. What is the application deadline?"
                    value={f.question}
                    onChange={(e) =>
                      setFaqs((prev) =>
                        prev.map((x) => (x.id === f.id ? { ...x, question: e.target.value } : x))
                      )
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>Answer <span className="text-red-500">*</span></label>
                  <textarea
                    className={`${inputClass} min-h-[60px]`}
                    rows={2}
                    placeholder="Answer description..."
                    value={f.answer}
                    onChange={(e) =>
                      setFaqs((prev) =>
                        prev.map((x) => (x.id === f.id ? { ...x, answer: e.target.value } : x))
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 10. Brochure (File Upload) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4 flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-800">Brochure (File Upload)</h2>
              <p className="text-sm text-gray-500 mt-0.5">Upload your institution brochure for download</p>
            </div>
          </div>
          <div className="p-6">
            <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-blue-400 transition-colors cursor-pointer group">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-full group-hover:scale-110 transition-transform">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              </div>
              <span className="mt-4 text-sm font-medium text-gray-900">
                {brochureUrl ? "Click to change brochure" : "Click to upload brochure"}
              </span>
              <span className="mt-1 text-xs text-gray-500">PDF format recommended</span>
              <input type="file" className="hidden" accept=".pdf" />
            </label>
            {brochureUrl && (
              <div className="mt-4 flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <span className="text-sm text-blue-700 flex-1 truncate">{brochureUrl}</span>
                <button
                  onClick={() => setBrochureUrl("")}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            {saving ? "Saving..." : "Save as Draft"}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            {saving ? "Saving..." : "Publish Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdmissionCreatePage;
