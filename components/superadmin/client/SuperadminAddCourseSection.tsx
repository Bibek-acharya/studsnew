"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import * as LucideIcons from "lucide-react";
import { superadminGlobalCourseApi } from "@/services/superadminRecordsApi";
import { universityApi } from "@/services/university.api";
import ImageCropperModal from "@/components/ScholarshipProvider/common/ImageCropperModal";
import type {
  PersonaItem,
  FeatureItem,
  AdmissionStep,
  SubjectGroup,
  ScholarshipItem,
  FullTimeCourse,
  FaqItem,
  CareerItem,
  DownloadItem,
} from "@/types/course";

import "react-quill-new/dist/quill.snow.css";

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

type WithId<T> = T & { id: number };

const nextId = <T extends { id: number }>(items: T[]) =>
  Math.max(0, ...items.map((i) => i.id)) + 1;

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

export default function SuperadminAddCourseSection({
  setActiveSection,
}: {
  setActiveSection: (s: string) => void;
}) {
  const editId = (() => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("superadmin_edit_global_course_id");
    return stored ? Number(stored) : null;
  })();

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!editId);

  const [title, setTitle] = useState("");
  const [shortTitle, setShortTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [level, setLevel] = useState("");
  const [field, setField] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [affiliationId, setAffiliationId] = useState<number | null>(null);
  const [affiliationName, setAffiliationName] = useState("");
  const [nonUniversityAffiliation, setNonUniversityAffiliation] = useState("");
  const [estFee, setEstFee] = useState("");
  const [govtFee, setGovtFee] = useState("");
  const [privateFee, setPrivateFee] = useState("");
  const [mode, setMode] = useState("");
  const [degreeLabel, setDegreeLabel] = useState("");
  const [careerPath, setCareerPath] = useState("");
  const [location, setLocation] = useState("");
  const [badges, setBadges] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");

  const [universities, setUniversities] = useState<{ id: number; name: string }[]>([]);

  const [admissionSteps, setAdmissionSteps] = useState<WithId<AdmissionStep>[]>([]);
  const [subjectGroups, setSubjectGroups] = useState<WithId<SubjectGroup>[]>([]);
  const [fullTimeCourses, setFullTimeCourses] = useState<WithId<FullTimeCourse>[]>([]);
  const [scholarshipDesc, setScholarshipDesc] = useState("");
  const [scholarshipNotes, setScholarshipNotes] = useState("");
  const [scholarships, setScholarships] = useState<WithId<ScholarshipItem>[]>([]);
  const [features, setFeatures] = useState<WithId<FeatureItem>[]>([]);
  const [whoShouldChoose, setWhoShouldChoose] = useState<WithId<PersonaItem>[]>([]);
  const [faqs, setFaqs] = useState<WithId<FaqItem>[]>([]);
  const [careers, setCareers] = useState<WithId<CareerItem>[]>([]);
  const [downloads, setDownloads] = useState<WithId<DownloadItem>[]>([]);
  const [feeStructureText, setFeeStructureText] = useState("");
  const [eligibilityText, setEligibilityText] = useState("");
  const [curriculum, setCurriculum] = useState<
    {
      id: number;
      semester: number;
      title: string;
      subjects: { code: string; name: string; credits: string }[];
      electives: { code: string; name: string }[];
    }[]
  >([]);

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

  const getToken = () => localStorage.getItem("superadmin_token");
  const apiBase = () =>
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const base = apiBase();
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(
      `${base}/api/v1/superadmin/upload?folder=${folder}`,
      {
        method: "POST",
        headers: {
          ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
        },
        body: formData,
      },
    );
    if (!res.ok) throw new Error(`Upload error: ${res.status}`);
    const data = await res.json();
    const url = data?.data?.url || "";
    return url.startsWith("/") ? `${base}${url}` : url;
  };

  useEffect(() => {
    if (!editId) {
      setLoading(false);
      return;
    }
    superadminGlobalCourseApi
      .getById(Number(editId))
      .then((res) => {
        setTitle(res.title || "");
        setDescription(res.description || "");
        setDuration(res.duration || "");
        setLevel(res.level || "");
        setField(res.field || "");
        setFieldOfStudy(res.fieldOfStudy || "");
        setAffiliationId(res.affiliationId || null);
        setAffiliationName(res.affiliationName || res.affiliation || "");
        setEstFee(res.estFee || "");
        setGovtFee(res.govtFee || "");
        setPrivateFee(res.privateFee || "");
        setMode(res.mode || "");
        setDegreeLabel(res.degreeLabel || "");
        setCareerPath(res.careerPath || "");
        setLocation(res.location || "");
        setBadges(Array.isArray(res.badges) ? res.badges.join(", ") : res.badges || "");
        setBannerUrl(res.bannerUrl || "");
        setShortTitle(res.shortTitle || "");
        setScholarshipDesc(res.scholarshipDesc || "");
        setScholarshipNotes(res.scholarshipNotes || "");
        setNonUniversityAffiliation(res.nonUniversityAffiliation || "");
        if (res.whoShouldChoose)
          setWhoShouldChoose(
            res.whoShouldChoose.map((x: any, i: number) => ({
              ...x,
              id: i + 1,
            })),
          );
        if (res.features)
          setFeatures(
            res.features.map((x: any, i: number) => ({ ...x, id: i + 1 })),
          );
        if (res.admissionSteps)
          setAdmissionSteps(
            res.admissionSteps.map((x: any, i: number) => ({
              ...x,
              id: i + 1,
            })),
          );
        if (res.fullTimeCourses)
          setFullTimeCourses(
            res.fullTimeCourses.map((x: any, i: number) => ({
              ...x,
              id: i + 1,
            })),
          );
        if (res.subjectGroups)
          setSubjectGroups(
            res.subjectGroups.map((x: any, i: number) => ({ ...x, id: i + 1 })),
          );
        if (res.feeStructure) setFeeStructureText(res.feeStructure);
        if (res.eligibilityText) setEligibilityText(res.eligibilityText);
        if (res.scholarships)
          setScholarships(
            res.scholarships.map((x: any, i: number) => ({ ...x, id: i + 1 })),
          );
        if (res.faqs)
          setFaqs(res.faqs.map((x: any, i: number) => ({ ...x, id: i + 1 })));
        if (res.careers)
          setCareers(res.careers.map((x: any, i: number) => ({ ...x, id: i + 1 })));
        if (res.downloads)
          setDownloads(res.downloads.map((x: any, i: number) => ({ ...x, id: i + 1 })));
        if (res.curriculum && Array.isArray(res.curriculum))
          setCurriculum(
            res.curriculum.map((x: any, i: number) => ({
              id: i + 1,
              semester: x.semester ?? i + 1,
              title: x.title ?? "",
              subjects: Array.isArray(x.subjects)
                ? x.subjects.map((s: any) =>
                    typeof s === "string"
                      ? { code: "", name: s, credits: "" }
                      : { code: s.code ?? "", name: s.name ?? "", credits: s.credits ?? "" },
                  )
                : [],
              electives: Array.isArray(x.electives) ? x.electives : [],
            })),
          );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [editId]);

  useEffect(() => {
    universityApi
      .getUniversities()
      .then((res) => {
        const list = res?.data?.universities || [];
        setUniversities(list.map((u: any) => ({ id: u.id, name: u.name })));
      })
      .catch(() => {});
  }, []);

  // Sync affiliationId from affiliationName when universities load (edit mode)
  useEffect(() => {
    if (affiliationName && universities.length > 0 && !affiliationId) {
      const match = universities.find(
        (u) => u.name.toLowerCase() === affiliationName.toLowerCase(),
      );
      if (match) setAffiliationId(match.id);
    }
  }, [affiliationName, universities]);

  const fieldError = (field: string) =>
    errors[field] ? "ring-2 ring-red-500" : "";

  const UNIVERSITY_AFFILIATION_LEVELS = [
    "Bachelor's",
    "Bachelor's (Honours)",
    "Postgraduate Diploma (PGD)",
    "Master's",
    "MPhil",
    "PhD",
  ];
  const NON_UNIVERSITY_AFFILIATION_LEVELS = [
    "+2",
    "A-Level",
    "TSLC (CTEVT)",
    "Diploma (CTEVT)",
    "PCL",
  ];
  const needsUniversityAffiliation = UNIVERSITY_AFFILIATION_LEVELS.includes(level);
  const needsNonUniversityAffiliation = NON_UNIVERSITY_AFFILIATION_LEVELS.includes(level);

  const validate = () => {
    const errs: Record<string, boolean> = {};
    if (!title.trim()) errs.title = true;
    if (needsUniversityAffiliation && !affiliationId) {
      errs.affiliation = true;
    }
    if (needsNonUniversityAffiliation && !nonUniversityAffiliation.trim()) {
      errs.nonUniversityAffiliation = true;
    }
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      const errorFieldIds: Record<string, string> = {
        title: "course-title",
        affiliation: "course-affiliation",
        nonUniversityAffiliation: "course-non-university-affiliation",
      };
      const firstErrKey = Object.keys(errs)[0];
      const el = document.getElementById(errorFieldIds[firstErrKey]);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus({ preventScroll: true });
      }
    }

    return Object.keys(errs).length === 0;
  };

  const collectData = () => ({
    title,
    shortTitle,
    description,
    duration,
    level,
    field,
    fieldOfStudy,
    affiliationId: needsUniversityAffiliation ? affiliationId : null,
    affiliation: needsUniversityAffiliation ? affiliationName : "",
    nonUniversityAffiliation: needsNonUniversityAffiliation ? nonUniversityAffiliation : "",
    badges: badges.split(",").map(b => b.trim()).filter(Boolean),
    estFee,
    govtFee,
    privateFee,
    mode,
    degreeLabel,
    careerPath,
    location,
    bannerUrl,
    scholarshipDesc,
    scholarshipNotes,
    whoShouldChoose: whoShouldChoose.map(({ id, ...rest }) => rest),
    features: features.map(({ id, ...rest }) => rest),
    admissionSteps: admissionSteps.map(({ id, ...rest }) => rest),
    fullTimeCourses: fullTimeCourses.map(({ id, ...rest }) => rest),
    subjectGroups: subjectGroups.map(({ id, ...rest }) => rest),
    feeStructure: feeStructureText,
    eligibilityText: eligibilityText,
    scholarships: scholarships.map(({ id, ...rest }) => rest),
    faqs: faqs.map(({ id, ...rest }) => rest),
    careers: careers.map(({ id, ...rest }) => rest),
    downloads: downloads.map(({ id, ...rest }) => rest),
    curriculum: curriculum.map(({ id, ...rest }) => rest),
  });

  const handleSave = async (publish: boolean) => {
    if (publish && !validate()) return;
    setSaving(true);
    try {
      const data = collectData();
      if (editId) {
        await superadminGlobalCourseApi.update(Number(editId), {
          ...data,
          status: publish ? "published" : "draft",
        });
      } else {
        await superadminGlobalCourseApi.create({
          ...data,
          status: publish ? "published" : "draft",
        });
      }
      localStorage.removeItem("superadmin_edit_global_course_id");
      setActiveSection("superadmin-course-directory");
    } catch (e: any) {
      console.error("Failed to save course:", e);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 min-h-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Edit Course</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Loading course data...
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64 text-gray-400">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {editId ? "Edit Course" : "Create Course"}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {editId
              ? "Update course details across institutions"
              : "Register a new academic course"}
          </p>
        </div>
        <div />
      </div>

      <div className="space-y-6">
        {/* 1. Course Overview */}
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
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-800">
                Course Overview
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Basic details about the course
              </p>
            </div>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className={labelClass}>Banner Image</label>
              <div
                onClick={() =>
                  document.getElementById("course-banner-input")?.click()
                }
                className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-blue-400 transition-colors cursor-pointer relative overflow-hidden min-h-[200px]"
              >
                {bannerUrl ? (
                  <div className="relative w-full h-full">
                    <img
                      src={bannerUrl}
                      className="w-full h-48 object-cover"
                      alt="Banner"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 text-xs text-white/80">
                      Click anywhere to replace
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBannerUrl("");
                      }}
                      className="absolute top-3 right-3 p-2 bg-white/95 rounded-full text-red-500 hover:bg-white shadow-md"
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
                ) : (
                  <>
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
                    <span className="mt-3 text-sm font-medium text-gray-900">
                      Click to upload banner image
                    </span>
                    <span className="mt-1 text-xs text-gray-500">
                      Recommended size: 1400x380px (JPG/PNG)
                    </span>
                  </>
                )}
                <input
                  id="course-banner-input"
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
                        setCropperOpen(true);
                      }
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>
                Course Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="course-title"
                required
                className={`${inputClass} ${fieldError("title")}`}
                placeholder="e.g. 10+2 Science"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>
                Description <span className="text-red-500">*</span>
              </label>
              <div
                className={`border border-gray-200 rounded-lg overflow-hidden ${fieldError("description")}`}
              >
                <QuillEditor
                  value={description}
                  onChange={setDescription}
                  modules={quillModules}
                  placeholder="Describe the course..."
                  style={{ minHeight: "120px" }}
                  className="bg-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>
                  Duration <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="e.g. 2 Years"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Level</label>
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
                  <option value="TSLC (CTEVT)">TSLC (CTEVT)</option>
                  <option value="Diploma (CTEVT)">Diploma (CTEVT)</option>
                  <option value="PCL">PCL</option>
                  <option value="Bachelor's">Bachelor's</option>
                  <option value="Bachelor's (Honours)">Bachelor's (Honours)</option>
                  <option value="Postgraduate Diploma (PGD)">Postgraduate Diploma (PGD)</option>
                  <option value="Master's">Master's</option>
                  <option value="MPhil">MPhil</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Field of Study</label>
                <select
                  className={selectClass}
                  value={fieldOfStudy}
                  onChange={(e) => setFieldOfStudy(e.target.value)}
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%230000ff'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1rem center",
                    backgroundSize: "1.2em",
                    paddingRight: "2.5rem",
                  }}
                >
                  <option value="">Select Field of Study</option>
                  <option value="Management & Business">Management & Business</option>
                  <option value="Accounting & Finance">Accounting & Finance</option>
                  <option value="Computer Science & Information Technology">Computer Science & IT</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Science & Mathematics">Science & Mathematics</option>
                  <option value="Medicine & Health Sciences">Medicine & Health Sciences</option>
                  <option value="Nursing">Nursing</option>
                  <option value="Pharmacy">Pharmacy</option>
                  <option value="Dentistry">Dentistry</option>
                  <option value="Ayurveda & Alternative Medicine">Ayurveda & Alternative Medicine</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Veterinary & Animal Science">Veterinary & Animal Science</option>
                  <option value="Forestry & Environmental Studies">Forestry & Environmental Studies</option>
                  <option value="Education & Teaching">Education & Teaching</option>
                  <option value="Humanities">Humanities</option>
                  <option value="Social Sciences">Social Sciences</option>
                  <option value="Law & Legal Studies">Law & Legal Studies</option>
                  <option value="Economics">Economics</option>
                  <option value="Hospitality & Hotel Management">Hospitality & Hotel Management</option>
                  <option value="Travel & Tourism">Travel & Tourism</option>
                  <option value="Architecture, Design & Planning">Architecture, Design & Planning</option>
                  <option value="Media & Communication">Media & Communication</option>
                  <option value="Arts & Fine Arts">Arts & Fine Arts</option>
                  <option value="Fashion & Textile">Fashion & Textile</option>
                  <option value="Aviation">Aviation</option>
                  <option value="Sports & Physical Education">Sports & Physical Education</option>
                  <option value="Library & Information Science">Library & Information Science</option>
                  <option value="Languages & Literature">Languages & Literature</option>
                  <option value="Public Administration & Governance">Public Administration & Governance</option>
                  <option value="Development Studies">Development Studies</option>
                  <option value="Technical & Vocational">Technical & Vocational</option>
                  <option value="Professional Studies">Professional Studies</option>
                  <option value="Other / Interdisciplinary">Other / Interdisciplinary</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>
                  Affiliation / Board
                  {needsUniversityAffiliation && (
                    <span className="text-red-500"> *</span>
                  )}
                </label>
                {needsUniversityAffiliation ? (
                  <select
                    id="course-affiliation"
                    required
                    className={`${selectClass} ${fieldError("affiliation")}`}
                    value={affiliationId ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      const id = val ? Number(val) : null;
                      setAffiliationId(id);
                      const uni = universities.find((u) => u.id === id);
                      setAffiliationName(uni?.name || "");
                    }}
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%230000ff'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1rem center",
                      backgroundSize: "1.2em",
                      paddingRight: "2.5rem",
                    }}
                  >
                    <option value="">Select University</option>
                    {universities.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    id="course-non-university-affiliation"
                    required
                    className={`${inputClass} ${fieldError("nonUniversityAffiliation")}`}
                    placeholder="e.g. NEB, CTEVT"
                    value={nonUniversityAffiliation}
                    onChange={(e) => setNonUniversityAffiliation(e.target.value)}
                  />
                )}
              </div>
              <div>
                <label className={labelClass}>Estimated Fee</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="e.g. NPR 80,000/year"
                  value={estFee}
                  onChange={(e) => setEstFee(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Who Should Choose This Course */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <SectionItemHeader
            icon="users"
            title="Who Should Choose This Course?"
            subtitle="Define target audience personas"
            onAdd={() =>
              setWhoShouldChoose((prev) => [
                ...prev,
                { id: nextId(prev), icon: "", title: "", shortDesc: "" },
              ])
            }
            addLabel="Add Persona"
          />
          <div className="p-6 space-y-4">
            {whoShouldChoose.map((w) => (
              <div
                key={w.id}
                className="p-5 bg-gray-50 rounded-lg border border-gray-200 relative group"
              >
                <button
                  onClick={() =>
                    setWhoShouldChoose((prev) =>
                      prev.filter((x) => x.id !== w.id),
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-12">
                  <div>
                    <label className={labelClass}>
                      Icon <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          className={inputClass}
                          placeholder="e.g. lightbulb, brain, users"
                          value={w.icon}
                          onChange={(e) =>
                            setWhoShouldChoose((prev) =>
                              prev.map((x) =>
                                x.id === w.id
                                  ? { ...x, icon: e.target.value }
                                  : x,
                              ),
                            )
                          }
                        />
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        {w.icon ? (
                          <DynamicIcon name={w.icon} size={20} />
                        ) : (
                          <span className="text-xs text-gray-400">Icon</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. Curious Minds"
                      value={w.title}
                      onChange={(e) =>
                        setWhoShouldChoose((prev) =>
                          prev.map((x) =>
                            x.id === w.id ? { ...x, title: e.target.value } : x,
                          ),
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Short Description <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. Students who love asking questions"
                      value={w.shortDesc}
                      onChange={(e) =>
                        setWhoShouldChoose((prev) =>
                          prev.map((x) =>
                            x.id === w.id
                              ? { ...x, shortDesc: e.target.value }
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

        {/* 3. Features */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <SectionItemHeader
            icon="list-checks"
            title="Features"
            subtitle="Highlight key features of this course"
            onAdd={() =>
              setFeatures((prev) => [
                ...prev,
                { id: nextId(prev), title: "", shortDesc: "" },
              ])
            }
            addLabel="Add Feature"
          />
          <div className="p-6 space-y-4">
            {features.map((f, idx) => (
              <div
                key={f.id}
                className="p-5 bg-gray-50 rounded-lg border border-gray-200 relative group"
              >
                <button
                  onClick={() =>
                    setFeatures((prev) => prev.filter((x) => x.id !== f.id))
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
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pr-12">
                  <div className="md:col-span-1">
                    <label className={labelClass}>#</label>
                    <input
                      type="text"
                      className={`${inputClass} text-center font-semibold bg-gray-100`}
                      value={String(idx + 1)}
                      readOnly
                    />
                  </div>
                  <div className="md:col-span-5">
                    <label className={labelClass}>
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. Comprehensive Curriculum"
                      value={f.title}
                      onChange={(e) =>
                        setFeatures((prev) =>
                          prev.map((x) =>
                            x.id === f.id ? { ...x, title: e.target.value } : x,
                          ),
                        )
                      }
                    />
                  </div>
                  <div className="md:col-span-6">
                    <label className={labelClass}>
                      Short Description <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. Covers all essential topics"
                      value={f.shortDesc}
                      onChange={(e) =>
                        setFeatures((prev) =>
                          prev.map((x) =>
                            x.id === f.id
                              ? { ...x, shortDesc: e.target.value }
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

        {/* 4. Eligibility Criteria */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <label className={labelClass}>Eligibility Criteria</label>
            <p className="text-xs text-gray-500 mb-2">Define eligibility requirements using rich text</p>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <QuillEditor
                theme="snow"
                value={eligibilityText}
                onChange={setEligibilityText}
                modules={quillModules}
                placeholder="Describe eligibility requirements..."
                className="bg-white"
              />
            </div>
          </div>
        </div>

        {/* 5. Admission Process */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <SectionItemHeader
            icon="list-ordered"
            title="Admission Process"
            subtitle="Step-by-step admission instructions"
            onAdd={() =>
              setAdmissionSteps((prev) => [
                ...prev,
                { id: nextId(prev), title: "", description: "" },
              ])
            }
            addLabel="Add Step"
          />
          <div className="p-6 space-y-6">
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
                    <label className={labelClass}>Step #</label>
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
                      placeholder="e.g. Application Form"
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
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className={`${inputClass} min-h-[80px]`}
                      rows={3}
                      placeholder="Description of this step..."
                      value={step.description}
                      onChange={(e) =>
                        setAdmissionSteps((prev) =>
                          prev.map((x) =>
                            x.id === step.id
                              ? { ...x, description: e.target.value }
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

        {/* 6. Full Time Courses */}
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
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="9" y1="21" x2="9" y2="9" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-800">
                  Full Time Courses
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Manage full-time course listings, fees, and durations
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                setFullTimeCourses((prev) => [
                  ...prev,
                  {
                    id: nextId(prev),
                    course: "",
                    totalFees: "",
                    seats: "",
                    startDate: "",
                    endDate: "",
                  },
                ])
              }
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
              </svg>{" "}
              Add Row
            </button>
          </div>
          <div className="p-6 overflow-visible">
            <div className="rounded-lg border border-gray-200 overflow-visible">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-200">
                      Course
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-200">
                      Total Fees
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-200">
                      Seats
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-200">
                      Start Date
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-200">
                      End Date
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-200 w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {fullTimeCourses.map((ft) => (
                    <tr key={ft.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b border-gray-200">
                        <input
                          type="text"
                          className="w-full border-0 rounded-none px-1 py-1.5 text-sm focus:border-blue-400 outline-none bg-white"
                          placeholder="e.g. B.Sc. CSIT"
                          value={ft.course}
                          onChange={(e) =>
                            setFullTimeCourses((prev) =>
                              prev.map((x) =>
                                x.id === ft.id
                                  ? { ...x, course: e.target.value }
                                  : x,
                              ),
                            )
                          }
                        />
                      </td>
                      <td className="px-4 py-2 border-b border-gray-200">
                        <input
                          type="text"
                          className="w-full border-0 rounded-none px-1 py-1.5 text-sm focus:border-blue-400 outline-none bg-white"
                          placeholder="e.g. NPR 250,000"
                          value={ft.totalFees}
                          onChange={(e) =>
                            setFullTimeCourses((prev) =>
                              prev.map((x) =>
                                x.id === ft.id
                                  ? { ...x, totalFees: e.target.value }
                                  : x,
                              ),
                            )
                          }
                        />
                      </td>
                      <td className="px-4 py-2 border-b border-gray-200">
                        <input
                          type="number"
                          min="0"
                          className="w-full border-0 rounded-none px-1 py-1.5 text-sm focus:border-blue-400 outline-none bg-white"
                          placeholder="e.g. 60"
                          value={ft.seats}
                          onChange={(e) =>
                            setFullTimeCourses((prev) =>
                              prev.map((x) =>
                                x.id === ft.id
                                  ? { ...x, seats: e.target.value }
                                  : x,
                              ),
                            )
                          }
                        />
                      </td>
                      <td className="px-4 py-2 border-b border-gray-200">
                        <input
                          type="date"
                          className="w-full border-0 rounded-none px-1 py-1.5 text-sm focus:border-blue-400 outline-none bg-white"
                          value={ft.startDate}
                          max={ft.endDate || undefined}
                          onChange={(e) =>
                            setFullTimeCourses((prev) =>
                              prev.map((x) =>
                                x.id === ft.id
                                  ? { ...x, startDate: e.target.value }
                                  : x,
                              ),
                            )
                          }
                        />
                      </td>
                      <td className="px-4 py-2 border-b border-gray-200">
                        <input
                          type="date"
                          className="w-full border-0 rounded-none px-1 py-1.5 text-sm focus:border-blue-400 outline-none bg-white"
                          value={ft.endDate}
                          min={ft.startDate || undefined}
                          onChange={(e) =>
                            setFullTimeCourses((prev) =>
                              prev.map((x) =>
                                x.id === ft.id
                                  ? { ...x, endDate: e.target.value }
                                  : x,
                              ),
                            )
                          }
                        />
                      </td>
                      <td className="px-4 py-2 text-right border-b border-gray-200">
                        <button
                          onClick={() =>
                            setFullTimeCourses((prev) =>
                              prev.filter((x) => x.id !== ft.id),
                            )
                          }
                          className="p-1.5 text-red-400 hover:text-red-600 transition-colors"
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {fullTimeCourses.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">
                No courses added yet.
              </p>
            )}
          </div>
        </div>

        {/* 7. Subjects & Career */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <SectionItemHeader
            icon="book-open"
            title="Subjects & Career Opportunities"
            subtitle="Define subject groups and career paths"
            onAdd={() =>
              setSubjectGroups((prev) => [
                ...prev,
                {
                  id: nextId(prev),
                  groupName: "",
                  description: "",
                  subjects: [],
                  careers: [],
                },
              ])
            }
            addLabel="Add Group"
          />
          <div className="p-6 space-y-6">
            {subjectGroups.map((sg) => (
              <div
                key={sg.id}
                className="p-5 bg-gray-50 rounded-lg border border-gray-200 relative group"
              >
                <button
                  onClick={() =>
                    setSubjectGroups((prev) =>
                      prev.filter((x) => x.id !== sg.id),
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
                <div className="pr-12 space-y-4">
                  <div>
                    <label className={labelClass}>
                      Group Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. Physical Group"
                      value={sg.groupName}
                      onChange={(e) =>
                        setSubjectGroups((prev) =>
                          prev.map((x) =>
                            x.id === sg.id
                              ? { ...x, groupName: e.target.value }
                              : x,
                          ),
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Group Description</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. This group focuses on core science subjects"
                      value={sg.description}
                      onChange={(e) =>
                        setSubjectGroups((prev) =>
                          prev.map((x) =>
                            x.id === sg.id
                              ? { ...x, description: e.target.value }
                              : x,
                          ),
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Available Streams (bullet points)
                    </label>
                    <div className="space-y-2">
                      {(sg.subjects || []).map((item, si) => (
                        <div key={si} className="flex items-center gap-2">
                          <span className="text-gray-400 shrink-0">&bull;</span>
                          <input
                            type="text"
                            className={inputClass}
                            placeholder="e.g. Physics"
                            value={item}
                            onChange={(e) =>
                              setSubjectGroups((prev) =>
                                prev.map((x) =>
                                  x.id === sg.id
                                    ? {
                                        ...x,
                                        subjects: (x.subjects || []).map(
                                          (v, j) =>
                                            j === si ? e.target.value : v,
                                        ),
                                      }
                                    : x,
                                ),
                              )
                            }
                          />
                          <button
                            onClick={() =>
                              setSubjectGroups((prev) =>
                                prev.map((x) =>
                                  x.id === sg.id
                                    ? {
                                        ...x,
                                        subjects: (x.subjects || []).filter(
                                          (_, j) => j !== si,
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
                          setSubjectGroups((prev) =>
                            prev.map((x) =>
                              x.id === sg.id
                                ? {
                                    ...x,
                                    subjects: [...(x.subjects || []), ""],
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
                        </svg>{" "}
                        Add Stream
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>
                      Career Opportunities (bullet points)
                    </label>
                    <div className="space-y-2">
                      {(sg.careers || []).map((item, ci) => (
                        <div key={ci} className="flex items-center gap-2">
                          <span className="text-gray-400 shrink-0">&bull;</span>
                          <input
                            type="text"
                            className={inputClass}
                            placeholder="e.g. Medicine (MBBS)"
                            value={item}
                            onChange={(e) =>
                              setSubjectGroups((prev) =>
                                prev.map((x) =>
                                  x.id === sg.id
                                    ? {
                                        ...x,
                                        careers: (x.careers || []).map(
                                          (v, j) =>
                                            j === ci ? e.target.value : v,
                                        ),
                                      }
                                    : x,
                                ),
                              )
                            }
                          />
                          <button
                            onClick={() =>
                              setSubjectGroups((prev) =>
                                prev.map((x) =>
                                  x.id === sg.id
                                    ? {
                                        ...x,
                                        careers: (x.careers || []).filter(
                                          (_, j) => j !== ci,
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
                          setSubjectGroups((prev) =>
                            prev.map((x) =>
                              x.id === sg.id
                                ? { ...x, careers: [...(x.careers || []), ""] }
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
                        </svg>{" "}
                        Add Career
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. Program Fee */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <label className={labelClass}>Fee Structure</label>
            <p className="text-xs text-gray-500 mb-2">Describe the fee structure using rich text</p>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <QuillEditor
                theme="snow"
                value={feeStructureText}
                onChange={setFeeStructureText}
                modules={quillModules}
                placeholder="Describe fee structure, payment details..."
                className="bg-white"
              />
            </div>
          </div>
        </div>

        {/* 9. Scholarships Overview */}
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
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-800">
                Scholarships Overview
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Available scholarships and detailed requirements
              </p>
            </div>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className={labelClass}>Short Description (Overview)</label>
              <input
                type="text"
                className={inputClass}
                placeholder="e.g. We offer various scholarships to support deserving students"
                value={scholarshipDesc}
                onChange={(e) => setScholarshipDesc(e.target.value)}
              />
            </div>
            <div className="space-y-4">
              {scholarships.map((s) => (
                <div
                  key={s.id}
                  className="p-5 bg-gray-50 rounded-lg border border-gray-200 relative group"
                >
                  <button
                    onClick={() =>
                      setScholarships((prev) =>
                        prev.filter((x) => x.id !== s.id),
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-12">
                    <div>
                      <label className={labelClass}>
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="e.g. Merit Scholarship"
                        value={s.title}
                        onChange={(e) =>
                          setScholarships((prev) =>
                            prev.map((x) =>
                              x.id === s.id
                                ? { ...x, title: e.target.value }
                                : x,
                            ),
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Subtitle</label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="e.g. For Top 10% Students"
                        value={s.subtitle}
                        onChange={(e) =>
                          setScholarships((prev) =>
                            prev.map((x) =>
                              x.id === s.id
                                ? { ...x, subtitle: e.target.value }
                                : x,
                            ),
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Coverage</label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="e.g. 50% Tuition Fee"
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
                      <label className={labelClass}>Requirement</label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="e.g. Minimum 3.5 GPA"
                        value={s.requirement}
                        onChange={(e) =>
                          setScholarships((prev) =>
                            prev.map((x) =>
                              x.id === s.id
                                ? { ...x, requirement: e.target.value }
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
            <div>
              <label className={labelClass}>
                Scholarship Notes (important details, bullet points)
              </label>
              <textarea
                className={`${inputClass} min-h-[120px]`}
                rows={5}
                placeholder={`• Scholarship is awarded based on merit\n• Students must maintain 3.0 GPA\n• Apply before admission deadline`}
                value={scholarshipNotes}
                onChange={(e) => setScholarshipNotes(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 10. FAQ */}
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
                    placeholder="e.g. What is the duration?"
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

        {/* Downloads */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <SectionItemHeader
            icon="download"
            title="Downloads"
            subtitle="Brochures, forms, and study materials"
            onAdd={() =>
              setDownloads((prev) => [
                ...prev,
                { id: nextId(prev), title: "", size: "", file: "" },
              ])
            }
            addLabel="Add Download"
          />
          <div className="p-6 space-y-4">
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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-12">
                  <div>
                    <label className={labelClass}>Title</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. Course Brochure"
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
                  <div>
                    <label className={labelClass}>File</label>
                    {d.file ? (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white truncate">
                          {d.file.split("/").pop()}
                          {d.size && <span className="text-gray-400 ml-2">({d.size})</span>}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setDownloads((prev) =>
                              prev.map((x) =>
                                x.id === d.id ? { ...x, file: "", size: "" } : x,
                              ),
                            )
                          }
                          className="px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg border border-gray-200 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center w-full px-4 py-2.5 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-colors cursor-pointer">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        Choose file
                        <input
                          type="file"
                          className="hidden"
                          accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.csv"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const maxSize = 25 * 1024 * 1024;
                            if (file.size > maxSize) {
                              alert("File size must be under 25 MB.");
                              e.target.value = "";
                              return;
                            }
                            const formatSize = (bytes: number) => {
                              if (bytes < 1024) return bytes + " B";
                              if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
                              return (bytes / (1024 * 1024)).toFixed(1) + " MB";
                            };
                            const sizeStr = formatSize(file.size);
                            try {
                              const url = await uploadFile(file, "course/downloads");
                              setDownloads((prev) =>
                                prev.map((x) =>
                                  x.id === d.id ? { ...x, file: url, size: sizeStr } : x,
                                ),
                              );
                            } catch {
                              alert("Upload failed. Please try again.");
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {downloads.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No downloads added yet.</p>
            )}
          </div>
        </div>

        {/* N. Curriculum */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <SectionItemHeader
            icon="book-open"
            title="Curriculum"
            subtitle="Semester or year-wise course structure"
            onAdd={() =>
              setCurriculum((prev) => [
                ...prev,
                {
                  id: nextId(prev),
                  semester: prev.length + 1,
                  title: `Semester ${prev.length + 1}`,
                  subjects: [{ code: "", name: "", credits: "" }],
                  electives: [],
                },
              ])
            }
            addLabel="Add Section"
          />
          <div className="p-6 space-y-6">
            {curriculum.map((sec) => (
              <div
                key={sec.id}
                className="p-5 bg-gray-50 rounded-lg border border-gray-200 relative group"
              >
                <button
                  onClick={() =>
                    setCurriculum((prev) => prev.filter((x) => x.id !== sec.id))
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
                    <path d="M19 6v14a2 2 0 0 1-2 2H7c-1 0-2-1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
                <div className="mb-4">
                  <div className="pr-12 mb-4">
                    <label className={labelClass}>
                      Section Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder='e.g. "Semester I" or "Year 1"'
                      value={sec.title}
                      onChange={(e) =>
                        setCurriculum((prev) =>
                          prev.map((x) =>
                            x.id === sec.id ? { ...x, title: e.target.value } : x,
                          ),
                        )
                      }
                    />
                  </div>

                  {/* Subjects */}
                  <label className={labelClass}>Subjects</label>
                  <div className="space-y-2">
                    {sec.subjects.map((subject, subIdx) => (
                      <div key={subIdx} className="flex items-center gap-2">
                        <span className="w-6 text-right text-xs font-semibold text-gray-400">
                          {subIdx + 1}.
                        </span>
                        <input
                          type="text"
                          className={`${inputClass} w-24`}
                          placeholder="Code"
                          value={subject.code}
                          onChange={(e) =>
                            setCurriculum((prev) =>
                              prev.map((x) =>
                                x.id === sec.id
                                  ? {
                                      ...x,
                                      subjects: x.subjects.map((s, i) =>
                                        i === subIdx ? { ...s, code: e.target.value } : s,
                                      ),
                                    }
                                  : x,
                              ),
                            )
                          }
                        />
                        <input
                          type="text"
                          className={`${inputClass} flex-1 min-w-0`}
                          placeholder="Subject name"
                          value={subject.name}
                          onChange={(e) =>
                            setCurriculum((prev) =>
                              prev.map((x) =>
                                x.id === sec.id
                                  ? {
                                      ...x,
                                      subjects: x.subjects.map((s, i) =>
                                        i === subIdx ? { ...s, name: e.target.value } : s,
                                      ),
                                    }
                                  : x,
                              ),
                            )
                          }
                        />
                        <input
                          type="text"
                          className={`${inputClass} w-20`}
                          placeholder="Credits"
                          value={subject.credits}
                          onChange={(e) =>
                            setCurriculum((prev) =>
                              prev.map((x) =>
                                x.id === sec.id
                                  ? {
                                      ...x,
                                      subjects: x.subjects.map((s, i) =>
                                        i === subIdx ? { ...s, credits: e.target.value } : s,
                                      ),
                                    }
                                  : x,
                              ),
                            )
                          }
                        />
                        {sec.subjects.length > 1 && (
                          <button
                            onClick={() =>
                              setCurriculum((prev) =>
                                prev.map((x) =>
                                  x.id === sec.id
                                    ? {
                                        ...x,
                                        subjects: x.subjects.filter(
                                          (_, i) => i !== subIdx,
                                        ),
                                      }
                                    : x,
                                ),
                              )
                            }
                            className="p-1.5 text-red-400 hover:text-red-600 transition-colors"
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
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() =>
                      setCurriculum((prev) =>
                        prev.map((x) =>
                          x.id === sec.id
                            ? { ...x, subjects: [...x.subjects, { code: "", name: "", credits: "" }] }
                            : x,
                        ),
                      )
                    }
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
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
                    </svg>{" "}
                    Add Subject
                  </button>
                </div>

                {/* Electives */}
                <div>
                  <label className={labelClass}>
                    Electives{" "}
                    <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  {sec.electives.length > 0 && (
                    <div className="space-y-2 mb-2">
                      {sec.electives.map((ele, ei) => (
                        <div key={ei} className="flex items-center gap-2">
                          <input
                            type="text"
                            className={`${inputClass} w-24`}
                            placeholder="Code"
                            value={ele.code}
                            onChange={(e) =>
                              setCurriculum((prev) =>
                                prev.map((x) =>
                                  x.id === sec.id
                                    ? {
                                        ...x,
                                        electives: x.electives.map((el, j) =>
                                          j === ei
                                            ? { ...el, code: e.target.value }
                                            : el,
                                        ),
                                      }
                                    : x,
                                ),
                              )
                            }
                          />
                          <input
                            type="text"
                            className={`${inputClass} flex-1 min-w-0`}
                            placeholder="Elective name"
                            value={ele.name}
                            onChange={(e) =>
                              setCurriculum((prev) =>
                                prev.map((x) =>
                                  x.id === sec.id
                                    ? {
                                        ...x,
                                        electives: x.electives.map((el, j) =>
                                          j === ei
                                            ? { ...el, name: e.target.value }
                                            : el,
                                        ),
                                      }
                                    : x,
                                ),
                              )
                            }
                          />
                          <button
                            onClick={() =>
                              setCurriculum((prev) =>
                                prev.map((x) =>
                                  x.id === sec.id
                                    ? {
                                        ...x,
                                        electives: x.electives.filter(
                                          (_, j) => j !== ei,
                                        ),
                                      }
                                    : x,
                                ),
                              )
                            }
                            className="p-1.5 text-red-400 hover:text-red-600 transition-colors"
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
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() =>
                      setCurriculum((prev) =>
                        prev.map((x) =>
                          x.id === sec.id
                            ? {
                                ...x,
                                electives: [...x.electives, { code: "", name: "" }],
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
                    </svg>{" "}
                    Add Elective
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => {
              localStorage.removeItem("superadmin_edit_course_id");
              setActiveSection("superadmin-course-directory");
            }}
            className="px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors shadow-sm"
          >
            Cancel
          </button>
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
          onCropComplete={async (blob) => {
            const croppedFile = new File([blob], "banner.jpg", {
              type: "image/jpeg",
            });
            try {
              const url = await uploadFile(croppedFile, "institution/course");
              setBannerUrl(url);
            } catch (e) {
              console.error("Banner upload failed:", e);
            }
            setCropperOpen(false);
            setCropImageSrc(null);
          }}
          onCancel={() => {
            setCropperOpen(false);
            setCropImageSrc(null);
          }}
          aspectRatio={3.68 / 1}
        />
      )}
    </div>
  );
}
