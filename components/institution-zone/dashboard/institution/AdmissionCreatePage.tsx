"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import * as LucideIcons from "lucide-react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";
import "react-quill-new/dist/quill.snow.css";
import { apiService } from "@/services/api";
import { institutionAdmissionApi } from "@/services/institutionAdmissionApi";
import ImageCropperModal from "@/components/ScholarshipProvider/common/ImageCropperModal";
import { toast } from "sonner";

const kebabToPascal = (name: string): string =>
  name
    .replace(/-./g, (m) => m[1].toUpperCase())
    .replace(/^./, (m) => m.toUpperCase());

const DynamicIcon = ({
  name,
  size = 24,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) => {
  const IconComponent = (
    LucideIcons.icons as Record<
      string,
      React.ComponentType<{ size?: number; className?: string }>
    >
  )[kebabToPascal(name)];
  return IconComponent ? (
    <IconComponent size={size} className={className} />
  ) : (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
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
  applyLink: string;
  startDate: string;
  endDate: string;
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
  file: string;
}

interface TestimonialCard {
  id: number;
  name: string;
  designation: string;
  image: string;
  message: string;
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
  image: string;
}

interface ScholarshipCard {
  id: number;
  name: string;
  level: string;
  stream: string;
  coverage: string;
  eligibility: string;
  seats: string;
  pdfUrl: string;
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
  Array.isArray(v)
    ? v.map(String)
    : typeof v === "string" && v
      ? v
          .split("\n")
          .map((s) => s.replace(/^-\s*/, "").trim())
          .filter(Boolean)
      : [];

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
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
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
  const router = useRouter();
  const editId =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("id")
      : null;

  const [dataLoaded, setDataLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  const showLoading = !!editId && !dataLoaded;

  const [overviewHeading, setOverviewHeading] = useState("");
  const [overviewDesc, setOverviewDesc] = useState("");
  const [applicationFormLink, setApplicationFormLink] = useState("");
  const [level, setLevel] = useState("");
  const [heroBanners, setHeroBanners] = useState<string[]>([]);
  const [cardImage, setCardImage] = useState("");
  const [cardImageCropperOpen, setCardImageCropperOpen] = useState(false);
  const [cardImageCropSrc, setCardImageCropSrc] = useState<string | null>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [cropTargetIndex, setCropTargetIndex] = useState<number | null>(null);

  const getToken = () => localStorage.getItem("institutionToken");
  const apiBase = () =>
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const base = apiBase();
    const token = getToken();
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(
      `${base}/api/v1/institution/upload?folder=${folder}`,
      {
        method: "POST",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: formData,
      },
    );
    if (!res.ok) throw new Error(`Upload error: ${res.status}`);
    const data = await res.json();
    const url = data?.data?.url || "";
    return url.startsWith("/") ? `${base}${url}` : url;
  };

  const [whatsNewTitle, setWhatsNewTitle] = useState("");
  const [whatsNewDesc, setWhatsNewDesc] = useState("");
  const [whatsNewBtnText, setWhatsNewBtnText] = useState("");
  const [whatsNewBtnLink, setWhatsNewBtnLink] = useState("");

  const [programs, setPrograms] = useState<ProgramCard[]>([]);
  const [facilities, setFacilities] = useState<FacilityCard[]>([]);
  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [downloads, setDownloads] = useState<DownloadCard[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialCard[]>([]);

  const [faqs, setFaqs] = useState<FaqCard[]>([]);
  const [contactPersons, setContactPersons] = useState<ContactPerson[]>([]);
  const [scholarships, setScholarships] = useState<ScholarshipCard[]>([]);

  const [eligibilityCriteria, setEligibilityCriteria] = useState<
    EligibilityCriteria[]
  >([]);

  const [admissionSteps, setAdmissionSteps] = useState<AdmissionStep[]>([]);
  const [openPrograms, setOpenPrograms] = useState<Set<number>>(new Set());

  const [brochureUrl, setBrochureUrl] = useState("");

  const [generatingWhatsNew, setGeneratingWhatsNew] = useState(false);
  const [whatsNewManuallyEdited, setWhatsNewManuallyEdited] = useState(false);

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const fieldError = (field: string) =>
    errors[field] ? "ring-2 ring-red-500" : "";

  const populateFromData = useCallback((data: any) => {
    const od = data.overview_data;
    if (od) {
      setOverviewHeading(String(od.overviewHeading ?? ""));
      setOverviewDesc(String(od.overviewDesc ?? ""));
      setApplicationFormLink(String(od.applicationFormLink ?? ""));
      setLevel(String(od.level ?? ""));
      const hb = od.heroBanner;
      if (Array.isArray(hb)) {
        setHeroBanners(hb.map(String).filter(Boolean));
      } else if (typeof hb === "string" && hb) {
        try {
          const parsed = JSON.parse(hb);
          setHeroBanners(
            Array.isArray(parsed) ? parsed.map(String).filter(Boolean) : [hb],
          );
        } catch {
          setHeroBanners([hb]);
        }
      } else {
        setHeroBanners([]);
      }
      setCardImage(String(od.cardImage ?? ""));
    }
    const wnd = data.whats_new_data;
    if (wnd) {
      setWhatsNewTitle(wnd.title || "");
      setWhatsNewDesc(wnd.description || "");
      setWhatsNewBtnText(wnd.btnText || "");
      setWhatsNewBtnLink(wnd.btnLink || "");
    }
    const pd = data.programs_data;
    if (pd && Array.isArray(pd)) {
      setPrograms(
        pd.map((p: AnyRecord, i: number) => {
          const rawStreams = p.streams;
          const rawCareers = p.careers;
          return {
            id: i + 1,
            title: String(p.title ?? ""),
            subtitle: String(p.subtitle ?? ""),
            applyLink: String(p.applyLink ?? ""),
            startDate: String(p.startDate ?? ""),
            endDate: String(p.endDate ?? ""),
            programIcon: String(p.programIcon ?? ""),
            description: String(p.description ?? ""),
            streams: Array.isArray(rawStreams)
              ? rawStreams.map(String)
              : typeof rawStreams === "string" && rawStreams
                ? rawStreams
                    .split("\n")
                    .map((s) => s.replace(/^-\s*/, "").trim())
                    .filter(Boolean)
                : [],
            careers: Array.isArray(rawCareers)
              ? rawCareers.map(String)
              : typeof rawCareers === "string" && rawCareers
                ? rawCareers
                    .split("\n")
                    .map((s) => s.replace(/^-\s*/, "").trim())
                    .filter(Boolean)
                : [],
          };
        }),
      );
    }
    const fd = data.facilities_data;
    if (fd && Array.isArray(fd)) {
      setFacilities(
        fd.map((f: AnyRecord, i: number) => ({
          id: i + 1,
          heading: String(f.heading ?? ""),
          facilityIcon: String(f.facilityIcon ?? ""),
          description: String(f.description ?? ""),
        })),
      );
    }
    const cd = data.courses_data;
    if (cd && Array.isArray(cd)) {
      setCourses(
        cd.map((c: AnyRecord, i: number) => ({
          id: i + 1,
          courseName: String(c.courseName ?? ""),
          curriculumLink: String(c.curriculumLink ?? ""),
          feesText: String(c.feesText ?? ""),
          applicationDate: String(c.applicationDate ?? ""),
          applyLink: String(c.applyLink ?? ""),
        })),
      );
    }
    const dld = data.downloads_data;
    if (dld && Array.isArray(dld)) {
      setDownloads(
        dld.map((dl: AnyRecord, i: number) => ({
          id: i + 1,
          title: String(dl.title ?? ""),
          description: String(dl.description ?? ""),
          file: String(dl.file ?? ""),
        })),
      );
    }
    const tld = data.testimonials_data;
    if (tld && Array.isArray(tld)) {
      setTestimonials(
        tld.map((t: AnyRecord, i: number) => ({
          id: i + 1,
          name: String(t.name ?? ""),
          designation: String(t.designation ?? ""),
          image: String(t.image ?? ""),
          message: String(t.message ?? ""),
        })),
      );
    }
    const fqd = data.faqs_data;
    if (fqd && Array.isArray(fqd)) {
      setFaqs(
        fqd.map((fq: AnyRecord, i: number) => ({
          id: i + 1,
          question: String(fq.question ?? ""),
          answer: String(fq.answer ?? ""),
        })),
      );
    }
    const cpd = data.contact_persons_data;
    if (cpd && Array.isArray(cpd)) {
      setContactPersons(
        cpd.map((item: AnyRecord, i: number) => ({
          id: i + 1,
          name: String(item.name ?? ""),
          designation: String(item.designation ?? ""),
          number: String(item.number ?? ""),
          email: String(item.email ?? ""),
          whatsapp: String(item.whatsapp ?? ""),
          image: String(item.image ?? ""),
        })),
      );
    }
    const sd = data.scholarships_data;
    if (sd && Array.isArray(sd)) {
      setScholarships(
        sd.map((s: AnyRecord, i: number) => ({
          id: i + 1,
          name: String(s.name ?? ""),
          level: String(s.level ?? ""),
          stream: String(s.stream ?? ""),
          coverage: String(s.coverage ?? ""),
          eligibility: String(s.eligibility ?? ""),
          seats: String(s.seats ?? ""),
          pdfUrl: String(s.pdfUrl ?? ""),
        })),
      );
    }
    const eld = data.eligibility_data;
    if (eld) {
      const items = eld.criteria;
      if (items && Array.isArray(items)) {
        setEligibilityCriteria(
          items.map((ec: AnyRecord, i: number) => ({
            id: i + 1,
            level: String(ec.level ?? ""),
            stream: String(ec.stream ?? ""),
            eligibility: toArr(ec.eligibility),
            documents: toArr(ec.documents),
          })),
        );
      } else if (Array.isArray(eld)) {
        setEligibilityCriteria(
          eld.map((ec: AnyRecord, i: number) => ({
            id: i + 1,
            level: String(ec.level ?? ""),
            stream: String(ec.stream ?? ""),
            eligibility: toArr(ec.eligibility),
            documents: toArr(ec.documents),
          })),
        );
      }
    }
    const apd = data.admission_process_data;
    if (apd && Array.isArray(apd)) {
      setAdmissionSteps(
        apd.map((as: AnyRecord, i: number) => ({
          id: i + 1,
          stepNumber: String(as.stepNumber ?? ""),
          title: String(as.title ?? ""),
          description: String(as.description ?? ""),
        })),
      );
    }
    const bd = data.brochure_data;
    if (bd) {
      setBrochureUrl(String(bd.url ?? ""));
    }
  }, []);

  useEffect(() => {
    if (!editId) {
      setDataLoaded(true);
      return;
    }
    const fetchAdmission = async () => {
      try {
        const res = await institutionAdmissionApi.get(Number(editId));
        if (res.success && res.data?.data) {
          const d =
            typeof res.data.data === "string"
              ? JSON.parse(res.data.data)
              : res.data.data;
          populateFromData(d);
        }
      } catch {
        // silent
      } finally {
        setDataLoaded(true);
      }
    };
    fetchAdmission();
  }, [editId, populateFromData]);

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
      heroBanner: heroBanners.length > 0 ? JSON.stringify(heroBanners) : "",
      cardImage,
    },
    whats_new_data: {
      title: whatsNewTitle,
      description: whatsNewDesc,
      btnText: whatsNewBtnText,
      btnLink: whatsNewBtnLink,
    },
    programs_data: programs.map((p) => {
      const { id: _, ...rest } = p;
      void _;
      return rest;
    }),
    facilities_data: facilities.map((f) => {
      const { id: _, ...rest } = f;
      void _;
      return rest;
    }),
    courses_data: courses.map((c) => {
      const { id: _, ...rest } = c;
      void _;
      return rest;
    }),
    downloads_data: downloads.map((d) => {
      const { id: _, ...rest } = d;
      void _;
      return rest;
    }),
    testimonials_data: testimonials.map((t) => {
      const { id: _, ...rest } = t;
      void _;
      return rest;
    }),
    faqs_data: faqs.map((fq) => {
      const { id: _, ...rest } = fq;
      void _;
      return rest;
    }),
    contact_persons_data: contactPersons.map((cp) => {
      const { id: _, ...rest } = cp;
      void _;
      return rest;
    }),
    scholarships_data: scholarships.map((s) => {
      const { id: _, ...rest } = s;
      void _;
      return rest;
    }),
    eligibility_data: eligibilityCriteria.map((ec) => {
      const { id: _, ...rest } = ec;
      void _;
      return rest;
    }),
    admission_process_data: admissionSteps.map((as) => {
      const { id: _, ...rest } = as;
      void _;
      return rest;
    }),
    brochure_data: {
      url: brochureUrl,
    },
  });

  const handleSave = async (publish: boolean) => {
    if (publish && !validate()) return;
    setSaving(true);
    try {
      let admissionId = editId ? Number(editId) : 0;

      if (editId) {
        await institutionAdmissionApi.update(Number(editId), collectData(), publish);
      } else {
        const result = await institutionAdmissionApi.create(collectData(), publish);
        admissionId = (result as any)?.data?.id || 0;
      }

      window.dispatchEvent(new Event("institution-data-changed"));
      router.push(
        publish
          ? "/institution-zone/dashboard/admission/directory"
          : "/institution-zone/dashboard/admission/draft",
      );

    } catch {
      toast.error("Failed to save admission");
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateWhatsNew = async () => {
    setGeneratingWhatsNew(true);
    toast.info("Generating What's New summary...");
    try {
      const data = collectData();
      const result = await institutionAdmissionApi.generateWhatsNew(
        editId ? Number(editId) : 0,
        data,
      );
      if (result.success && result.data) {
        const whatsNew = (result.data as any).whats_new_data;
        if (whatsNew) {
          setWhatsNewDesc(whatsNew.description || "");
          setWhatsNewManuallyEdited(false);
          toast.success("What's New summary generated!");
        }
      } else {
        toast.error("Failed to generate summary. Please try again.");
      }
    } catch {
      toast.error("Failed to generate summary. Please try again.");
    } finally {
      setGeneratingWhatsNew(false);
    }
  };

  if (showLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 min-h-full">
        <SectionHeader
          title="Edit Admission"
          breadcrumbItems={[
            {
              label: "Dashboard",
              href: "/institution-zone/dashboard/overview",
            },
            { label: "Edit Admission" },
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
        title={editId ? "Edit Admission" : "Create Admission"}
        breadcrumbItems={[
          { label: "Dashboard", href: "/institution-zone/dashboard/overview" },
          { label: editId ? "Edit Admission" : "Create Admission" },
        ]}
      />

      <div className="space-y-6">
        {/* 1. Admissions Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4 flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-800">
                Admissions Overview
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Manage the main admission landing page content
              </p>
            </div>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className={labelClass}>
                Main Title (Admission Heading){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`${inputClass} ${fieldError("overviewHeading")}`}
                placeholder="e.g. Admissions Now Open for New Session"
                value={overviewHeading}
                onChange={(e) => setOverviewHeading(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                This appears at the top of the admissions page
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  Level <span className="text-red-500">*</span>
                </label>
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
                  <option value="Bachelor">Bachelor</option>
                  <option value="Master">Master</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Select the academic level for this admission
                </p>
              </div>
            </div>
            <div>
              <label className={labelClass}>
                Hero Banner Image <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-5 gap-3">
                {heroBanners.map((url, idx) => (
                  <div
                    key={idx}
                    onClick={() =>
                      document
                        .getElementById(`admission-banner-input-${idx}`)
                        ?.click()
                    }
                    className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-blue-400 transition-colors group"
                  >
                    <img
                      src={url}
                      className="w-full h-full object-cover"
                      alt={`Hero Banner ${idx + 1}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="absolute bottom-2 left-2 text-xs text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to replace
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setHeroBanners((prev) =>
                          prev.filter((_, i) => i !== idx),
                        );
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-white/95 rounded-full text-red-500 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                    <input
                      id={`admission-banner-input-${idx}`}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (!file.type.startsWith("image/")) {
                          alert("Please select an image file.");
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          if (ev.target?.result) {
                            setCropImageSrc(ev.target.result as string);
                            setCropTargetIndex(idx);
                            setCropperOpen(true);
                          }
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </div>
                ))}
                {heroBanners.length < 5 && (
                  <div
                    onClick={() =>
                      document
                        .getElementById("admission-banner-input-new")
                        ?.click()
                    }
                    className="aspect-video rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-blue-400 transition-colors cursor-pointer"
                  >
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                    <span className="mt-2 text-xs font-medium text-gray-600">
                      Add Image
                    </span>
                    <span className="mt-0.5 text-[10px] text-gray-400">
                      ({heroBanners.length}/5)
                    </span>
                    <input
                      id="admission-banner-input-new"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (!file.type.startsWith("image/")) {
                          alert("Please select an image file.");
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          if (ev.target?.result) {
                            setCropImageSrc(ev.target.result as string);
                            setCropTargetIndex(heroBanners.length);
                            setCropperOpen(true);
                          }
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Upload up to 5 banner images. Recommended size: 1400x380px
                (JPG/PNG)
              </p>
            </div>
            <div>
              <label className={labelClass}>Card Image</label>
              <div className="flex items-start gap-4">
                {cardImage ? (
                  <div
                    onClick={() =>
                      document.getElementById("admission-card-image-input")?.click()
                    }
                    className="relative w-[318px] h-[136px] rounded-lg overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-blue-400 transition-colors group"
                  >
                    <img
                      src={cardImage}
                      className="w-full h-full object-cover"
                      alt="Card Image"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="absolute bottom-2 left-2 text-xs text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to replace
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCardImage("");
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-white/95 rounded-full text-red-500 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() =>
                      document.getElementById("admission-card-image-input")?.click()
                    }
                    className="w-[318px] h-[136px] rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-blue-400 transition-colors cursor-pointer"
                  >
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                    <span className="mt-2 text-xs font-medium text-gray-600">
                      Upload Card Image
                    </span>
                    <span className="mt-0.5 text-[10px] text-gray-400">
                      318 x 136 px
                    </span>
                  </div>
                )}
                <input
                  id="admission-card-image-input"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (!file.type.startsWith("image/")) {
                      alert("Please select an image file.");
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      if (ev.target?.result) {
                        setCardImageCropSrc(ev.target.result as string);
                        setCardImageCropperOpen(true);
                      }
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Image shown in admission cards. Recommended size: 318x136px (JPG/PNG)
              </p>
            </div>
            <div>
              <label className={labelClass}>
                Overview Description <span className="text-red-500">*</span>
              </label>
              <div
                className={`border border-gray-200 rounded-lg ${fieldError("overviewDesc")}`}
              >
                <QuillEditor
                  value={overviewDesc}
                  onChange={setOverviewDesc}
                  modules={quillModules}
                  placeholder="Describe the admission program..."
                  className="bg-white quill-auto-grow"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Describe the admission program, key highlights, and what the
                page offers
              </p>
            </div>
          </div>
        </div>

        {/* 2. Our Programs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <SectionItemHeader
            icon="book-marked"
            title="Our Programs"
            subtitle="Manage programs offered and their details"
            onAdd={() => {
              const newId = nextId(programs);
              setPrograms((prev) => [
                ...prev,
                {
                  id: newId,
                  title: "",
                  subtitle: "",
                  applyLink: "",
                  startDate: "",
                  endDate: "",
                  programIcon: "",
                  description: "",
                  streams: [],
                  careers: [],
                },
              ]);
              setOpenPrograms((prev) => new Set([...prev, newId]));
            }}
            addLabel="Add Program"
          />
          <div className="p-6 space-y-3">
            {programs.map((p) => {
              const isOpen = openPrograms.has(p.id);
              return (
                <div
                  key={p.id}
                  className="border border-gray-200 rounded-lg overflow-hidden bg-white"
                >
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50">
                    <button
                      onClick={() =>
                        setOpenPrograms((prev) => {
                          const next = new Set(prev);
                          if (next.has(p.id)) {
                            next.delete(p.id);
                          } else {
                            next.add(p.id);
                          }
                          return next;
                        })
                      }
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      {p.programIcon ? (
                        <DynamicIcon name={p.programIcon} size={18} />
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-gray-800 truncate">
                      {p.title || "New Program"}
                    </span>
                    <button
                      onClick={() =>
                        setPrograms((prev) => prev.filter((x) => x.id !== p.id))
                      }
                      className="ml-auto p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                  {isOpen && (
                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100">
                      <div>
                        <label className={labelClass}>
                          Program Icon <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-3">
                          <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-gray-400"
                              >
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                              </svg>
                            </div>
                            <input
                              type="text"
                              className={`${inputClass} pl-10`}
                              placeholder="e.g. graduation-cap, flask"
                              value={p.programIcon}
                              onChange={(e) =>
                                setPrograms((prev) =>
                                  prev.map((x) =>
                                    x.id === p.id
                                      ? { ...x, programIcon: e.target.value }
                                      : x,
                                  ),
                                )
                              }
                            />
                          </div>
                          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            {p.programIcon ? (
                              <DynamicIcon name={p.programIcon} size={20} />
                            ) : (
                              <span className="text-xs text-gray-400">Icon</span>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          <a
                            href="https://lucide.dev/icons"
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-500 underline"
                          >
                            Browse icons
                          </a>
                        </p>
                      </div>
                      <div>
                        <label className={labelClass}>
                          Program Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className={inputClass}
                          placeholder="e.g. Science (+2)"
                          value={p.title}
                          onChange={(e) =>
                            setPrograms((prev) =>
                              prev.map((x) =>
                                x.id === p.id
                                  ? { ...x, title: e.target.value }
                                  : x,
                              ),
                            )
                          }
                        />
                      </div>
                      <div>
                        <label className={labelClass}>
                          Subtitle / Affiliation{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className={inputClass}
                          placeholder="e.g. NEB Affiliated | 2 Years"
                          value={p.subtitle}
                          onChange={(e) =>
                            setPrograms((prev) =>
                              prev.map((x) =>
                                x.id === p.id
                                  ? { ...x, subtitle: e.target.value }
                                  : x,
                              ),
                            )
                          }
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Start Date</label>
                        <input
                          type="date"
                          className={inputClass}
                          value={p.startDate}
                          onChange={(e) =>
                            setPrograms((prev) =>
                              prev.map((x) =>
                                x.id === p.id
                                  ? { ...x, startDate: e.target.value }
                                  : x,
                              ),
                            )
                          }
                        />
                      </div>
                      <div>
                        <label className={labelClass}>End Date</label>
                        <input
                          type="date"
                          className={inputClass}
                          value={p.endDate}
                          onChange={(e) =>
                            setPrograms((prev) =>
                              prev.map((x) =>
                                x.id === p.id
                                  ? { ...x, endDate: e.target.value }
                                  : x,
                              ),
                            )
                          }
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className={labelClass}>Application Form Link</label>
                        <input
                          type="url"
                          className={inputClass}
                          placeholder="https://example.com/apply"
                          value={p.applyLink}
                          onChange={(e) =>
                            setPrograms((prev) =>
                              prev.map((x) =>
                                x.id === p.id
                                  ? { ...x, applyLink: e.target.value }
                                  : x,
                              ),
                            )
                          }
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className={labelClass}>
                          Description <span className="text-red-500">*</span>
                        </label>
                        <div className="border border-gray-200 rounded-lg overflow-visible">
                          <QuillEditor
                            value={p.description}
                            onChange={(val: string) =>
                              setPrograms((prev) =>
                                prev.map((x) =>
                                  x.id === p.id
                                    ? { ...x, description: val }
                                    : x,
                                ),
                              )
                            }
                            modules={quillModules}
                            placeholder="Our Science program is designed for..."
                            className="bg-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>
                          Available Streams{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-2">
                          {p.streams.map((item, si) => (
                            <div key={si} className="flex items-center gap-2">
                              <span className="text-gray-400 shrink-0">&bull;</span>
                              <input
                                type="text"
                                className={inputClass}
                                placeholder="e.g. Physics, Chemistry"
                                value={item}
                                onChange={(e) =>
                                  setPrograms((prev) =>
                                    prev.map((x) =>
                                      x.id === p.id
                                        ? {
                                            ...x,
                                            streams: x.streams.map((s, j) =>
                                              j === si ? e.target.value : s,
                                            ),
                                          }
                                        : x,
                                    ),
                                  )
                                }
                              />
                              <button
                                onClick={() =>
                                  setPrograms((prev) =>
                                    prev.map((x) =>
                                      x.id === p.id
                                        ? {
                                            ...x,
                                            streams: x.streams.filter(
                                              (_, j) => j !== si,
                                            ),
                                          }
                                        : x,
                                    ),
                                  )
                                }
                                className="p-1 text-red-400 hover:text-red-600 shrink-0"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() =>
                              setPrograms((prev) =>
                                prev.map((x) =>
                                  x.id === p.id
                                    ? { ...x, streams: [...x.streams, ""] }
                                    : x,
                                ),
                              )
                            }
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                            Add Stream
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>
                          Career Opportunities{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-2">
                          {p.careers.map((item, ci) => (
                            <div key={ci} className="flex items-center gap-2">
                              <span className="text-gray-400 shrink-0">&bull;</span>
                              <input
                                type="text"
                                className={inputClass}
                                placeholder="e.g. Software Engineer"
                                value={item}
                                onChange={(e) =>
                                  setPrograms((prev) =>
                                    prev.map((x) =>
                                      x.id === p.id
                                        ? {
                                            ...x,
                                            careers: x.careers.map((c, j) =>
                                              j === ci ? e.target.value : c,
                                            ),
                                          }
                                        : x,
                                    ),
                                  )
                                }
                              />
                              <button
                                onClick={() =>
                                  setPrograms((prev) =>
                                    prev.map((x) =>
                                      x.id === p.id
                                        ? {
                                            ...x,
                                            careers: x.careers.filter(
                                              (_, j) => j !== ci,
                                            ),
                                          }
                                        : x,
                                    ),
                                  )
                                }
                                className="p-1 text-red-400 hover:text-red-600 shrink-0"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() =>
                              setPrograms((prev) =>
                                prev.map((x) =>
                                  x.id === p.id
                                    ? { ...x, careers: [...x.careers, ""] }
                                    : x,
                                ),
                              )
                            }
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                            Add Career
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
                {
                  id: nextId(prev),
                  level: "",
                  stream: "",
                  eligibility: [],
                  documents: [],
                },
              ])
            }
            addLabel="Add Criteria"
          />
          <div className="p-6 space-y-6">
            <div className="space-y-6">
              {eligibilityCriteria.map((ec) => (
                <div
                  key={ec.id}
                  className="p-5 bg-gray-50 rounded-lg border border-gray-200 relative group"
                >
                  <button
                    onClick={() =>
                      setEligibilityCriteria((prev) =>
                        prev.filter((x) => x.id !== ec.id),
                      )
                    }
                    className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-12">
                    <div>
                      <label className={labelClass}>
                        Level <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="e.g. +2 Science"
                        value={ec.level}
                        onChange={(e) =>
                          setEligibilityCriteria((prev) =>
                            prev.map((x) =>
                              x.id === ec.id
                                ? { ...x, level: e.target.value }
                                : x,
                            ),
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        Stream/Faculty <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="e.g. PCB, PCM, Computer Science"
                        value={ec.stream}
                        onChange={(e) =>
                          setEligibilityCriteria((prev) =>
                            prev.map((x) =>
                              x.id === ec.id
                                ? { ...x, stream: e.target.value }
                                : x,
                            ),
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        Eligibility (bullet points){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-2">
                        {toArr(ec.eligibility).map((item, ei) => (
                          <div key={ei} className="flex items-center gap-2">
                            <span className="text-gray-400 shrink-0">
                              &bull;
                            </span>
                            <input
                              type="text"
                              className={inputClass}
                              placeholder="e.g. Minimum 2.5 GPA in SEE"
                              value={item}
                              onChange={(e) =>
                                setEligibilityCriteria((prev) =>
                                  prev.map((x) =>
                                    x.id === ec.id
                                      ? {
                                          ...x,
                                          eligibility: x.eligibility.map(
                                            (v, j) =>
                                              j === ei ? e.target.value : v,
                                          ),
                                        }
                                      : x,
                                  ),
                                )
                              }
                            />
                            <button
                              onClick={() =>
                                setEligibilityCriteria((prev) =>
                                  prev.map((x) =>
                                    x.id === ec.id
                                      ? {
                                          ...x,
                                          eligibility: x.eligibility.filter(
                                            (_, j) => j !== ei,
                                          ),
                                        }
                                      : x,
                                  ),
                                )
                              }
                              className="p-1.5 text-red-400 hover:text-red-600 shrink-0"
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() =>
                            setEligibilityCriteria((prev) =>
                              prev.map((x) =>
                                x.id === ec.id
                                  ? {
                                      ...x,
                                      eligibility: [...x.eligibility, ""],
                                    }
                                  : x,
                              ),
                            )
                          }
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                          Add Item
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>
                        Required Documents (bullet points){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-2">
                        {toArr(ec.documents).map((item, di) => (
                          <div key={di} className="flex items-center gap-2">
                            <span className="text-gray-400 shrink-0">
                              &bull;
                            </span>
                            <input
                              type="text"
                              className={inputClass}
                              placeholder="e.g. SEE Mark Sheet"
                              value={item}
                              onChange={(e) =>
                                setEligibilityCriteria((prev) =>
                                  prev.map((x) =>
                                    x.id === ec.id
                                      ? {
                                          ...x,
                                          documents: x.documents.map((v, j) =>
                                            j === di ? e.target.value : v,
                                          ),
                                        }
                                      : x,
                                  ),
                                )
                              }
                            />
                            <button
                              onClick={() =>
                                setEligibilityCriteria((prev) =>
                                  prev.map((x) =>
                                    x.id === ec.id
                                      ? {
                                          ...x,
                                          documents: x.documents.filter(
                                            (_, j) => j !== di,
                                          ),
                                        }
                                      : x,
                                  ),
                                )
                              }
                              className="p-1.5 text-red-400 hover:text-red-600 shrink-0"
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() =>
                            setEligibilityCriteria((prev) =>
                              prev.map((x) =>
                                x.id === ec.id
                                  ? { ...x, documents: [...x.documents, ""] }
                                  : x,
                              ),
                            )
                          }
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
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
                {
                  id: nextId(prev),
                  stepNumber: String(prev.length + 1),
                  title: "",
                  description: "",
                },
              ])
            }
            addLabel="Add Step"
          />
          <div className="p-6 space-y-6">
            <div className="space-y-6">
              {admissionSteps.map((step) => (
                <div
                  key={step.id}
                  className="p-5 bg-gray-50 rounded-lg border border-gray-200 relative group"
                >
                  <button
                    onClick={() =>
                      setAdmissionSteps((prev) =>
                        prev.filter((x) => x.id !== step.id),
                      )
                    }
                    className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pr-12">
                    <div className="md:col-span-2">
                      <label className={labelClass}>
                        Step # <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className={`${inputClass} text-center font-semibold bg-gray-100`}
                        value={String(admissionSteps.indexOf(step) + 1)}
                        readOnly
                      />
                    </div>
                    <div className="md:col-span-10">
                      <label className={labelClass}>
                        Step Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="e.g. Entrance Form Fill Up"
                        value={step.title}
                        onChange={(e) =>
                          setAdmissionSteps((prev) =>
                            prev.map((x) =>
                              x.id === step.id
                                ? { ...x, title: e.target.value }
                                : x,
                            ),
                          )
                        }
                      />
                    </div>
                    <div className="md:col-span-12">
                      <label className={labelClass}>
                        Short Description{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="border border-gray-200 rounded-lg overflow-visible">
                        <QuillEditor
                          value={step.description}
                          onChange={(val: string) =>
                            setAdmissionSteps((prev) =>
                              prev.map((x) =>
                                x.id === step.id
                                  ? { ...x, description: val }
                                  : x,
                              ),
                            )
                          }
                          modules={quillModules}
                          placeholder="Brief description of this step..."
                          className="bg-white"
                        />
                      </div>
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
                {
                  id: nextId(prev),
                  heading: "",
                  facilityIcon: "",
                  description: "",
                },
              ])
            }
            addLabel="Add Facility"
          />
          <div className="p-6 space-y-4">
            <div className="space-y-4">
              {facilities.map((f) => (
                <div
                  key={f.id}
                  className="flex gap-4 items-start p-5 bg-gray-50 rounded-lg border border-gray-200 relative group"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className={labelClass}>
                        Facility Icon <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-gray-400"
                            >
                              <circle cx="11" cy="11" r="8" />
                              <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                          </div>
                          <input
                            type="text"
                            className={`${inputClass} pl-10`}
                            placeholder="e.g. library, building, laptop"
                            value={f.facilityIcon}
                            onChange={(e) =>
                              setFacilities((prev) =>
                                prev.map((x) =>
                                  x.id === f.id
                                    ? { ...x, facilityIcon: e.target.value }
                                    : x,
                                ),
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
                      <label className={labelClass}>
                        Heading <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="e.g. Modern Library"
                        value={f.heading}
                        onChange={(e) =>
                          setFacilities((prev) =>
                            prev.map((x) =>
                              x.id === f.id
                                ? { ...x, heading: e.target.value }
                                : x,
                            ),
                          )
                        }
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}>
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        className={`${inputClass} min-h-[80px]`}
                        rows={3}
                        placeholder="Describe the facility..."
                        value={f.description}
                        onChange={(e) =>
                          setFacilities((prev) =>
                            prev.map((x) =>
                              x.id === f.id
                                ? { ...x, description: e.target.value }
                                : x,
                            ),
                          )
                        }
                      />
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setFacilities((prev) => prev.filter((x) => x.id !== f.id))
                    }
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-7 transition-colors"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
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
              <div
                key={c.id}
                className="p-5 bg-gray-50 rounded-lg border border-gray-200 relative group"
              >
                <button
                  onClick={() =>
                    setCourses((prev) => prev.filter((x) => x.id !== c.id))
                  }
                  className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-12">
                  <div>
                    <label className={labelClass}>
                      Course Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. Science (+2)"
                      value={c.courseName}
                      onChange={(e) =>
                        setCourses((prev) =>
                          prev.map((x) =>
                            x.id === c.id
                              ? { ...x, courseName: e.target.value }
                              : x,
                          ),
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      View Curriculum Link{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      className={inputClass}
                      placeholder="https://..."
                      value={c.curriculumLink}
                      onChange={(e) =>
                        setCourses((prev) =>
                          prev.map((x) =>
                            x.id === c.id
                              ? { ...x, curriculumLink: e.target.value }
                              : x,
                          ),
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Total Fees <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. Contact College for Details"
                      value={c.feesText}
                      onChange={(e) =>
                        setCourses((prev) =>
                          prev.map((x) =>
                            x.id === c.id
                              ? { ...x, feesText: e.target.value }
                              : x,
                          ),
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Application Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. Aug 2026"
                      value={c.applicationDate}
                      onChange={(e) =>
                        setCourses((prev) =>
                          prev.map((x) =>
                            x.id === c.id
                              ? { ...x, applicationDate: e.target.value }
                              : x,
                          ),
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Apply Now Link <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      className={inputClass}
                      placeholder="https://..."
                      value={c.applyLink}
                      onChange={(e) =>
                        setCourses((prev) =>
                          prev.map((x) =>
                            x.id === c.id
                              ? { ...x, applyLink: e.target.value }
                              : x,
                          ),
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6.5 Downloads */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <SectionItemHeader
            icon="download"
            title="Downloads"
            subtitle="Downloadable resources like syllabus, forms, and study materials"
            onAdd={() =>
              setDownloads((prev) => [
                ...prev,
                { id: nextId(prev), title: "", description: "", file: "" },
              ])
            }
            addLabel="Add Download"
          />
          <div className="p-6 space-y-6">
            {downloads.map((d) => (
              <div
                key={d.id}
                className="p-5 bg-gray-50 rounded-lg border border-gray-200 relative group"
              >
                <button
                  onClick={() =>
                    setDownloads((prev) => prev.filter((x) => x.id !== d.id))
                  }
                  className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-12">
                  <div>
                    <label className={labelClass}>Title</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. Syllabus 2026"
                      value={d.title}
                      onChange={(e) =>
                        setDownloads((prev) =>
                          prev.map((x) =>
                            x.id === d.id ? { ...x, title: e.target.value } : x,
                          ),
                        )
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Upload File</label>
                    <label className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-blue-400 transition-colors cursor-pointer group">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-full group-hover:scale-110 transition-transform">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                      </div>
                      <span className="mt-2 text-sm font-medium text-gray-900">
                        {d.file ? "Click to change file" : "Upload PDF/Doc"}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const url = await uploadFile(
                              file,
                              "institution/admission",
                            );
                            setDownloads((prev) =>
                              prev.map((x) =>
                                x.id === d.id ? { ...x, file: url } : x,
                              ),
                            );
                          } catch {
                            /* skip */
                          }
                        }}
                      />
                    </label>
                    {d.file && (
                      <div className="mt-2 flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-blue-600 shrink-0"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <a
                          href={d.file}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-700 truncate"
                        >
                          View File
                        </a>
                        <button
                          type="button"
                          onClick={() =>
                            setDownloads((prev) =>
                              prev.map((x) =>
                                x.id === d.id ? { ...x, file: "" } : x,
                              ),
                            )
                          }
                          className="p-1 text-red-500 hover:bg-red-50 rounded ml-auto"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    )}
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
                {
                  id: nextId(prev),
                  name: "",
                  level: "",
                  stream: "",
                  coverage: "",
                  eligibility: "",
                  seats: "",
                  pdfUrl: "",
                },
              ])
            }
            addLabel="Add Scholarship"
          />
          <div className="p-6 space-y-6">
            {scholarships.map((s) => (
              <div
                key={s.id}
                className="p-5 bg-gray-50 rounded-lg border border-gray-200 relative group"
              >
                <button
                  onClick={() =>
                    setScholarships((prev) => prev.filter((x) => x.id !== s.id))
                  }
                  className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-12">
                  <div>
                    <label className={labelClass}>
                      Scholarship Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. Merit Scholarship"
                      value={s.name}
                      onChange={(e) =>
                        setScholarships((prev) =>
                          prev.map((x) =>
                            x.id === s.id ? { ...x, name: e.target.value } : x,
                          ),
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Scholarship Level <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. +2"
                      value={s.level}
                      onChange={(e) =>
                        setScholarships((prev) =>
                          prev.map((x) =>
                            x.id === s.id ? { ...x, level: e.target.value } : x,
                          ),
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Stream <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. Science"
                      value={s.stream}
                      onChange={(e) =>
                        setScholarships((prev) =>
                          prev.map((x) =>
                            x.id === s.id
                              ? { ...x, stream: e.target.value }
                              : x,
                          ),
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Coverage <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. 100%"
                      value={s.coverage}
                      onChange={(e) =>
                        setScholarships((prev) =>
                          prev.map((x) =>
                            x.id === s.id
                              ? { ...x, coverage: e.target.value }
                              : x,
                          ),
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Eligibility <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. GPA 3.8+"
                      value={s.eligibility}
                      onChange={(e) =>
                        setScholarships((prev) =>
                          prev.map((x) =>
                            x.id === s.id
                              ? { ...x, eligibility: e.target.value }
                              : x,
                          ),
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Seats <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. 2"
                      value={s.seats}
                      onChange={(e) => {
                        const v = e.target.value.replace(/[^0-9]/g, "");
                        setScholarships((prev) =>
                          prev.map((x) =>
                            x.id === s.id ? { ...x, seats: v } : x,
                          ),
                        );
                      }}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Upload PDF/Doc</label>
                    <label className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-blue-400 transition-colors cursor-pointer group">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-full group-hover:scale-110 transition-transform">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                      </div>
                      <span className="mt-2 text-sm font-medium text-gray-900">
                        {s.pdfUrl ? "Click to change PDF" : "Upload PDF/Doc"}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const url = await uploadFile(
                              file,
                              "institution/admission",
                            );
                            setScholarships((prev) =>
                              prev.map((x) =>
                                x.id === s.id ? { ...x, pdfUrl: url } : x,
                              ),
                            );
                          } catch {
                            /* skip */
                          }
                        }}
                      />
                    </label>
                    {s.pdfUrl && (
                      <div className="mt-2 flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-blue-600 shrink-0"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <a
                          href={s.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-700 truncate"
                        >
                          View PDF
                        </a>
                        <button
                          type="button"
                          onClick={() =>
                            setScholarships((prev) =>
                              prev.map((x) =>
                                x.id === s.id ? { ...x, pdfUrl: "" } : x,
                              ),
                            )
                          }
                          className="p-1 text-red-500 hover:bg-red-50 rounded ml-auto"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    )}
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
            title="Key Contact Information"
            subtitle="Specific individuals for contact"
            onAdd={() =>
              setContactPersons((prev) => [
                ...prev,
                {
                  id: nextId(prev),
                  name: "",
                  designation: "",
                  number: "",
                  email: "",
                  whatsapp: "",
                  image: "",
                },
              ])
            }
            addLabel="Add Contact Person"
          />
          <div className="p-6 space-y-6">
            {contactPersons.map((cp) => (
              <div
                key={cp.id}
                className="p-5 bg-gray-50 rounded-lg border border-gray-200 relative group"
              >
                <button
                  onClick={() =>
                    setContactPersons((prev) =>
                      prev.filter((x) => x.id !== cp.id),
                    )
                  }
                  className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-12">
                  <div className="md:col-span-2">
                    <label className={labelClass}>Contact Person Image</label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 border border-gray-300 overflow-hidden">
                        {cp.image ? (
                          <img
                            src={cp.image}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        ) : (
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect
                              x="3"
                              y="3"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                        )}
                      </div>
                      <label className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 shadow-sm cursor-pointer">
                        {cp.image ? "Change" : "Upload Image"}
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              const url = await uploadFile(
                                file,
                                "institution/admission",
                              );
                              setContactPersons((prev) =>
                                prev.map((x) =>
                                  x.id === cp.id ? { ...x, image: url } : x,
                                ),
                              );
                            } catch {
                              /* skip */
                            }
                          }}
                        />
                      </label>
                      {cp.image && (
                        <button
                          type="button"
                          onClick={() =>
                            setContactPersons((prev) =>
                              prev.map((x) =>
                                x.id === cp.id ? { ...x, image: "" } : x,
                              ),
                            )
                          }
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. Jane Doe"
                      value={cp.name}
                      onChange={(e) =>
                        setContactPersons((prev) =>
                          prev.map((x) =>
                            x.id === cp.id ? { ...x, name: e.target.value } : x,
                          ),
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Designation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. Admissions Officer"
                      value={cp.designation}
                      onChange={(e) =>
                        setContactPersons((prev) =>
                          prev.map((x) =>
                            x.id === cp.id
                              ? { ...x, designation: e.target.value }
                              : x,
                          ),
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. 9800000000"
                      value={cp.number}
                      onChange={(e) => {
                        const v = e.target.value.replace(/[^0-9+]/g, "");
                        setContactPersons((prev) =>
                          prev.map((x) =>
                            x.id === cp.id ? { ...x, number: v } : x,
                          ),
                        );
                      }}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      className={inputClass}
                      placeholder="email@example.com"
                      value={cp.email}
                      onChange={(e) =>
                        setContactPersons((prev) =>
                          prev.map((x) =>
                            x.id === cp.id
                              ? { ...x, email: e.target.value }
                              : x,
                          ),
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      WhatsApp Link <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      className={inputClass}
                      placeholder="https://wa.me/98XXXXXXXX"
                      value={cp.whatsapp}
                      onChange={(e) =>
                        setContactPersons((prev) =>
                          prev.map((x) =>
                            x.id === cp.id
                              ? { ...x, whatsapp: e.target.value }
                              : x,
                          ),
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 8.5 Testimonials */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <SectionItemHeader
            icon="message-square"
            title="Testimonials"
            subtitle="Student or alumni testimonials about the admission experience"
            onAdd={() =>
              setTestimonials((prev) => [
                ...prev,
                {
                  id: nextId(prev),
                  name: "",
                  designation: "",
                  image: "",
                  message: "",
                },
              ])
            }
            addLabel="Add Testimonial"
          />
          <div className="p-6 space-y-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="p-5 bg-gray-50 rounded-lg border border-gray-200 relative group"
              >
                <button
                  onClick={() =>
                    setTestimonials((prev) => prev.filter((x) => x.id !== t.id))
                  }
                  className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-12">
                  <div className="md:col-span-2">
                    <label className={labelClass}>Profile Image</label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 border border-gray-300 overflow-hidden">
                        {t.image ? (
                          <img
                            src={t.image}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        ) : (
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        )}
                      </div>
                      <label className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 shadow-sm cursor-pointer">
                        {t.image ? "Change" : "Upload Image"}
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              const url = await uploadFile(
                                file,
                                "institution/admission",
                              );
                              setTestimonials((prev) =>
                                prev.map((x) =>
                                  x.id === t.id ? { ...x, image: url } : x,
                                ),
                              );
                            } catch {
                              /* skip */
                            }
                          }}
                        />
                      </label>
                      {t.image && (
                        <button
                          type="button"
                          onClick={() =>
                            setTestimonials((prev) =>
                              prev.map((x) =>
                                x.id === t.id ? { ...x, image: "" } : x,
                              ),
                            )
                          }
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. Ram Shrestha"
                      value={t.name}
                      onChange={(e) =>
                        setTestimonials((prev) =>
                          prev.map((x) =>
                            x.id === t.id ? { ...x, name: e.target.value } : x,
                          ),
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Designation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. Alumni, Batch 2024"
                      value={t.designation}
                      onChange={(e) =>
                        setTestimonials((prev) =>
                          prev.map((x) =>
                            x.id === t.id
                              ? { ...x, designation: e.target.value }
                              : x,
                          ),
                        )
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>
                      Testimonial Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className={`${inputClass} min-h-[80px]`}
                      rows={3}
                      placeholder="Share the testimonial message..."
                      value={t.message}
                      onChange={(e) =>
                        setTestimonials((prev) =>
                          prev.map((x) =>
                            x.id === t.id ? { ...x, message: e.target.value } : x,
                          ),
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
              <div
                key={f.id}
                className="p-5 bg-gray-50 rounded-lg border border-gray-200 relative group flex flex-col gap-4"
              >
                <button
                  onClick={() =>
                    setFaqs((prev) => prev.filter((x) => x.id !== f.id))
                  }
                  className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg z-10 transition-colors"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
                <div className="space-y-1.5 pr-12">
                  <label className={labelClass}>
                    Question <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="e.g. What is the application deadline?"
                    value={f.question}
                    onChange={(e) =>
                      setFaqs((prev) =>
                        prev.map((x) =>
                          x.id === f.id
                            ? { ...x, question: e.target.value }
                            : x,
                        ),
                      )
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    Answer <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className={`${inputClass} min-h-[60px]`}
                    rows={2}
                    placeholder="Answer description..."
                    value={f.answer}
                    onChange={(e) =>
                      setFaqs((prev) =>
                        prev.map((x) =>
                          x.id === f.id ? { ...x, answer: e.target.value } : x,
                        ),
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
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-800">
                Brochure (File Upload)
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Upload your institution brochure for download
              </p>
            </div>
          </div>
          <div className="p-6">
            <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-blue-400 transition-colors cursor-pointer group relative">
              {brochureUrl ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-blue-50 text-blue-600 rounded-full">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    Brochure uploaded
                  </span>
                  <span className="text-xs text-gray-500">
                    Click anywhere to replace
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setBrochureUrl("");
                    }}
                    className="px-4 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-full group-hover:scale-110 transition-transform">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <span className="mt-4 text-sm font-medium text-gray-900">
                    Click to upload brochure
                  </span>
                  <span className="mt-1 text-xs text-gray-500">
                    PDF format recommended
                  </span>
                </>
              )}
              <input
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const url = await uploadFile(file, "institution/admission");
                    setBrochureUrl(url);
                  } catch {
                    /* skip */
                  }
                }}
              />
            </label>
          </div>
        </div>

        {/* 11. What's New */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-800">
                  What&apos;s New
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Latest updates and announcements for this admission
                </p>
              </div>
            </div>
            <button
              onClick={handleGenerateWhatsNew}
              disabled={generatingWhatsNew || saving}
              className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 flex items-center gap-2 transition-colors disabled:opacity-50 shrink-0"
            >
              {generatingWhatsNew ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                  Generate with AI
                </>
              )}
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className={labelClass}>Description</label>
              <div className="border border-gray-200 rounded-lg overflow-visible">
                <QuillEditor
                  value={whatsNewDesc}
                  onChange={(val: string) => {
                    setWhatsNewDesc(val);
                    setWhatsNewManuallyEdited(true);
                  }}
                  modules={quillModules}
                  placeholder="Latest updates about admissions, deadlines, events..."
                  className="bg-white"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Rich text supported. Leave empty and click &quot;Generate with AI&quot; to auto-generate from admission data.
              </p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            {saving ? "Saving..." : "Save as Draft"}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            {saving ? "Saving..." : editId ? "Publish Changes" : "Publish"}
          </button>
        </div>
      </div>

      {cropperOpen && cropImageSrc && (
        <ImageCropperModal
          imageSrc={cropImageSrc}
          aspectRatio={1400 / 380}
          onCropComplete={async (blob) => {
            const croppedFile = new File([blob], "banner.jpg", {
              type: "image/jpeg",
            });
            try {
              const url = await uploadFile(
                croppedFile,
                "institution/admission",
              );
              setHeroBanners((prev) => {
                if (cropTargetIndex !== null && cropTargetIndex < prev.length) {
                  const copy = [...prev];
                  copy[cropTargetIndex] = url;
                  return copy;
                }
                return [...prev, url];
              });
            } catch {
              // skip
            }
            setCropperOpen(false);
            setCropImageSrc(null);
            setCropTargetIndex(null);
          }}
          onCancel={() => {
            setCropperOpen(false);
            setCropImageSrc(null);
            setCropTargetIndex(null);
          }}
        />
      )}

      {cardImageCropperOpen && cardImageCropSrc && (
        <ImageCropperModal
          imageSrc={cardImageCropSrc}
          aspectRatio={318 / 136.283}
          onCropComplete={async (blob) => {
            const croppedFile = new File([blob], "card-image.jpg", {
              type: "image/jpeg",
            });
            try {
              const url = await uploadFile(
                croppedFile,
                "institution/admission",
              );
              setCardImage(url);
            } catch {
              // skip
            }
            setCardImageCropperOpen(false);
            setCardImageCropSrc(null);
          }}
          onCancel={() => {
            setCardImageCropperOpen(false);
            setCardImageCropSrc(null);
          }}
        />
      )}
    </div>
  );
};

export default AdmissionCreatePage;
