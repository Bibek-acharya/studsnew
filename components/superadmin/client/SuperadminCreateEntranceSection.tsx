"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import * as LucideIcons from "lucide-react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";
import { superadminEntranceApi } from "@/services/superadminRecordsApi";
import ImageCropperModal from "@/components/ScholarshipProvider/common/ImageCropperModal";
import "react-quill-new/dist/quill.snow.css";
import InstitutionSelector from "./InstitutionSelector";

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

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const daysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();
const formatDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parseDate = (s: string) => {
  const p = s.split("-").map(Number);
  return new Date(p[0], p[1] - 1, p[2]);
};

const isDisabled = (d: Date, min?: string, max?: string) => {
  d.setHours(0, 0, 0, 0);
  if (min) {
    const m = parseDate(min);
    m.setHours(0, 0, 0, 0);
    if (d.getTime() < m.getTime()) return true;
  }
  if (max) {
    const m = parseDate(max);
    m.setHours(0, 0, 0, 0);
    if (d.getTime() > m.getTime()) return true;
  }
  return false;
};

const CustomDatePicker = ({
  value,
  onChange,
  min,
  max,
}: {
  value: string;
  onChange: (v: string) => void;
  min?: string;
  max?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(0);
  const [viewMonth, setViewMonth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const selected = value ? parseDate(value) : null;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const vy = viewYear || today.getFullYear();
  const vm = viewMonth !== 0 ? viewMonth : today.getMonth();
  const days = daysInMonth(vy, vm);
  const firstDay = new Date(vy, vm, 1).getDay();

  const prev = () => {
    if (vm === 0) {
      setViewYear(vy - 1);
      setViewMonth(11);
    } else setViewMonth(vm - 1);
  };
  const next = () => {
    if (vm === 11) {
      setViewYear(vy + 1);
      setViewMonth(0);
    } else setViewMonth(vm + 1);
  };
  const selectDay = (d: number) => {
    const dt = new Date(vy, vm, d);
    onChange(formatDate(dt));
    setOpen(false);
  };
  const dispStr = selected
    ? `${MONTHS[selected.getMonth()]} ${selected.getDate()}, ${selected.getFullYear()}`
    : "";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full border-0 px-1 py-1.5 text-sm bg-white flex items-center gap-1.5 cursor-pointer hover:border-blue-400 focus:border-blue-400 outline-none transition-colors"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-gray-400 shrink-0"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span className={dispStr ? "text-gray-900" : "text-gray-400"}>
          {dispStr || "Pick date"}
        </span>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-64">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={prev}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <span className="text-sm font-semibold text-gray-900">
              {MONTHS[vm]} {vy}
            </span>
            <button
              type="button"
              onClick={next}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-7 gap-0 text-center text-xs font-medium text-gray-500 mb-1">
            {DAYS.map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0 text-center text-sm">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`e${i}`} />
            ))}
            {Array.from({ length: days }, (_, i) => {
              const d = i + 1;
              const dt = new Date(vy, vm, d);
              dt.setHours(0, 0, 0, 0);
              const dis = isDisabled(dt, min, max);
              const isSelected =
                selected && dt.getTime() === selected.getTime();
              const isToday = dt.getTime() === today.getTime();
              return (
                <button
                  key={d}
                  type="button"
                  disabled={dis}
                  onClick={() => selectDay(d)}
                  className={`py-1.5 rounded text-sm transition-colors ${isSelected ? "bg-blue-600 text-white font-semibold" : dis ? "text-gray-300 cursor-not-allowed" : isToday ? "text-blue-600 font-semibold hover:bg-blue-50" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

interface OverviewDetail {
  id: number;
  detail: string;
  information: string;
}
interface EligibilityItem {
  id: number;
  title: string;
  description: string;
}
interface ApplicationStep {
  id: number;
  title: string;
  description: string;
}
interface PatternItem {
  id: number;
  label: string;
  value: string;
}
interface SubjectMark {
  id: number;
  subject: string;
  marks: string;
}
interface ModelSet {
  id: number;
  title: string;
  size: string;
  description: string;
  fileUrl: string;
}
interface ExamDateSchedule {
  id: number;
  date: string;
  endDate: string;
  event: string;
}
interface KeyDate {
  id: number;
  date: string;
  endDate: string;
  event: string;
  icon: string;
  color: string;
}
interface ContactPerson {
  id: number;
  name: string;
  role: string;
  phone: string;
  email: string;
  whatsapp: string;
  image: string;
}
interface FaqItem {
  id: number;
  question: string;
  answer: string;
}
interface SocialLink {
  id: number;
  platform: string;
  url: string;
}
interface RequiredDocument {
  id: number;
  title: string;
  description: string;
}
interface ExaminationScheduleItem {
  id: number;
  examDate: string;
  shifts: string;
  centers: string;
}
interface ProgramOfferedItem {
  id: number;
  programName: string;
  description: string;
}

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

export default function SuperadminCreateEntranceSection({
  setActiveSection,
}: {
  setActiveSection: (s: string) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);

  const [editId, setEditId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [overviewDetails, setOverviewDetails] = useState<OverviewDetail[]>([]);
  const [description, setDescription] = useState("");
  const [applicationFee, setApplicationFee] = useState("");
  const [examMode, setExamMode] = useState("");
  const [examScope, setExamScope] = useState("");

  const [examDateSchedules, setExamDateSchedules] = useState<
    ExamDateSchedule[]
  >([]);
  const [eligibilityList, setEligibilityList] = useState<EligibilityItem[]>([]);
  const [applicationSteps, setApplicationSteps] = useState<ApplicationStep[]>(
    [],
  );
  const [examPattern, setExamPattern] = useState<PatternItem[]>([]);
  const [subjectMarks, setSubjectMarks] = useState<SubjectMark[]>([]);
  const [modelSets, setModelSets] = useState<ModelSet[]>([]);
  const [upcomingDates, setUpcomingDates] = useState<KeyDate[]>([]);
  const [contactPersons, setContactPersons] = useState<ContactPerson[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);

  const [heroBanner, setHeroBanner] = useState("");
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [uploadingInfo, setUploadingInfo] = useState<{ id: number } | null>(
    null,
  );
  const [applicationLink, setApplicationLink] = useState("");
  const [embeddedMap, setEmbeddedMap] = useState("");
  const [noticeFile, setNoticeFile] = useState("");
  const [noticeFileName, setNoticeFileName] = useState("");
  const [uploadingNotice, setUploadingNotice] = useState(false);
  const [entranceEmail, setEntranceEmail] = useState("");
  const [entranceContactNumber, setEntranceContactNumber] = useState("");
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [requiredDocuments, setRequiredDocuments] = useState<
    RequiredDocument[]
  >([]);
  const [examinationSchedule, setExaminationSchedule] = useState<
    ExaminationScheduleItem[]
  >([]);
  const [programsOffered, setProgramsOffered] = useState<ProgramOfferedItem[]>(
    [],
  );
  const [institutionFields, setInstitutionFields] = useState({
    name: "",
    location: "",
    affiliation: "",
    link: "",
    institution_id: 0,
    logo: "",
  });

  const ensureIds = (items: any[], start = 1): any[] =>
    (items || []).map((item: any, i: number) => ({
      ...item,
      id: item.id != null ? item.id : i + start,
    }));

  useEffect(() => {
    const stored = localStorage.getItem("superadmin_edit_entrance_id");
    if (!stored) return;
    const id = Number(stored);
    setEditId(id);
    setLoadingEdit(true);
    superadminEntranceApi
      .getById(id)
      .then((exam) => {
        const parseArray = (val: any): any[] => {
          if (!val) return [];
          if (typeof val === "string") {
            try {
              const parsed = JSON.parse(val);
              return Array.isArray(parsed) ? parsed : [];
            } catch {
              return [];
            }
          }
          return Array.isArray(val) ? val : [];
        };

        const heroUrl = exam.hero_banner || "";
        setHeroBanner(
          heroUrl.startsWith("/") ? `${apiBase()}${heroUrl}` : heroUrl,
        );
        setTitle(exam.title || "");
        setDescription(exam.description || "");
        setApplicationFee(exam.application_fee || "");
        setExamMode(exam.exam_mode || "");
        setExamScope(exam.exam_scope || "");
        setOverviewDetails(ensureIds(parseArray(exam.overview_details)));
        setExamDateSchedules(ensureIds(parseArray(exam.exam_date_schedules)));
        setEligibilityList(ensureIds(parseArray(exam.eligibility_list)));
        setApplicationSteps(ensureIds(parseArray(exam.application_steps)));
        setExamPattern(ensureIds(parseArray(exam.exam_pattern)));
        setSubjectMarks(ensureIds(parseArray(exam.subject_marks)));
        setModelSets(ensureIds(parseArray(exam.model_sets)));
        setUpcomingDates(
          ensureIds(parseArray(exam.upcoming_dates)).map((d: any) => ({
            ...d,
            icon: (d.icon || "calendar").toLowerCase(),
            color: (d.color || "blue").toLowerCase(),
          })),
        );
        setContactPersons(ensureIds(parseArray(exam.contact_persons)));
        setFaqs(ensureIds(parseArray(exam.faqs)));
        setApplicationLink(exam.application_link || "");
        setEmbeddedMap(exam.embedded_map || "");
        setNoticeFile(exam.notice_file || "");
        setNoticeFileName("");
        setEntranceEmail(exam.email || "");
        setEntranceContactNumber(exam.contact_number || "");
        setSocialLinks(ensureIds(parseArray(exam.social_links)));
        setRequiredDocuments(ensureIds(parseArray(exam.required_documents)));
        setExaminationSchedule(
          ensureIds(parseArray(exam.examination_schedule)),
        );
        setProgramsOffered(ensureIds(parseArray(exam.programs_offered)));
        if (exam.institution_name) {
          setInstitutionFields({
            name: exam.institution_name || "",
            location: exam.institution_location || "",
            affiliation: exam.institution_affiliation || "",
            link: exam.institution_link || "",
            institution_id: exam.institution_id || 0,
            logo: exam.institution_logo || "",
          });
        }
      })
      .catch((e) => console.error("Failed to load entrance for edit", e))
      .finally(() => setLoadingEdit(false));
  }, []);

  const apiBase = () =>
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const base = apiBase();
    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem("superadmin_token");
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

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const fieldError = (field: string) =>
    errors[field] ? "ring-2 ring-red-500" : "";

  const computeStatus = (
    start: string,
    end: string,
  ): { label: string; color: string } => {
    if (!start) return { label: "", color: "" };
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const startDate = new Date(start);
    startDate.setHours(0, 0, 0, 0);
    if (end) {
      const endDate = new Date(end);
      endDate.setHours(23, 59, 59, 999);
      if (now < startDate)
        return { label: "Upcoming", color: "text-orange-600 bg-orange-50" };
      if (now > endDate)
        return { label: "Closed", color: "text-red-600 bg-red-50" };
      return { label: "Ongoing", color: "text-green-600 bg-green-50" };
    }
    if (now < startDate)
      return { label: "Upcoming", color: "text-orange-600 bg-orange-50" };
    if (now > startDate)
      return { label: "Closed", color: "text-red-600 bg-red-50" };
    return { label: "Ongoing", color: "text-green-600 bg-green-50" };
  };

  const validate = () => {
    const errs: Record<string, boolean> = {};
    const hasEmpty = overviewDetails
      .filter((d) => (d as any).type !== "institution_meta")
      .some((d) => !(d.detail || "").trim() || !(d.information || "").trim());
    if (hasEmpty) errs.overviewDetails = true;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleBannerCrop = async (croppedBlob: Blob) => {
    const croppedFile = new File([croppedBlob], "banner.jpg", {
      type: "image/jpeg",
    });
    try {
      const url = await uploadFile(croppedFile, "institution/entrance");
      setHeroBanner(url);
    } catch (e) {
      console.error("Banner upload failed:", e);
    }
    setCropperOpen(false);
    setCropImageSrc(null);
  };

  const handleModelSetUpload = async (id: number, file: File) => {
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      alert("Please select an image or PDF file.");
      return;
    }
    setUploadingInfo({ id });
    try {
      const url = await uploadFile(file, "institution/entrance");
      setModelSets((prev) =>
        prev.map((ms) => (ms.id === id ? { ...ms, fileUrl: url } : ms)),
      );
    } catch (e) {
      console.error("Upload failed:", e);
    }
    setUploadingInfo(null);
  };

  const handleSave = async (publish: boolean) => {
    if (publish && !validate()) return;
    setSaving(true);
    try {
      const examTitle = title || overviewDetails[0]?.detail || "Entrance Exam";
      const startDate =
        examDateSchedules[0]?.date || new Date().toISOString().split("T")[0];

      const payload: Record<string, any> = {
        title: examTitle,
        description,
        date: startDate,
        total_seats: 0,
        hero_banner: heroBanner,
        status: publish ? "published" : "draft",
        application_fee: applicationFee,
        exam_mode: examMode,
        exam_scope: examScope,
        institution_name: institutionFields.name,
        institution_location: institutionFields.location,
        institution_link: institutionFields.link,
        institution_affiliation: institutionFields.affiliation,
        institution_logo: institutionFields.logo,
        overview_details: [...overviewDetails.map(({ id, ...rest }) => rest)],
        exam_date_schedules: examDateSchedules,
        eligibility_list: eligibilityList,
        application_steps: applicationSteps,
        exam_pattern: examPattern,
        subject_marks: subjectMarks,
        model_sets: modelSets,
        upcoming_dates: upcomingDates.map((d) => ({
          ...d,
          icon: d.icon.toLowerCase(),
          color: d.color.toLowerCase(),
        })),
        contact_persons: contactPersons,
        faqs: faqs,
        email: entranceEmail,
        contact_number: entranceContactNumber,
        social_links: socialLinks.map(({ id, ...rest }) => rest),
        application_link: applicationLink,
        embedded_map: embeddedMap,
        notice_file: noticeFile,
        required_documents: requiredDocuments.map(({ id, ...rest }) => rest),
        examination_schedule: examinationSchedule.map(
          ({ id, ...rest }) => rest,
        ),
        programs_offered: programsOffered.map(({ id, ...rest }) => rest),
      };
      if (editId) {
        await superadminEntranceApi.update(editId, payload);
      } else {
        await superadminEntranceApi.create(payload);
      }
      localStorage.removeItem("superadmin_edit_entrance_id");
      setActiveSection("superadmin-entrance-directory");
    } catch (e: any) {
      console.error("Failed to save entrance:", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-full">
      <SectionHeader
        title={editId ? "Edit Entrance" : "Create Entrance"}
        breadcrumbItems={[
          { label: "Dashboard" },
          { label: editId ? "Edit Entrance" : "Create Entrance" },
        ]}
      />
      {loadingEdit && (
        <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-lg mb-4 text-sm">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          Loading entrance data...
        </div>
      )}

      <InstitutionSelector
        value={institutionFields}
        onChange={setInstitutionFields}
        onUpload={(file) => uploadFile(file, "institution/logo")}
      />

      <div className="space-y-6">
        {/* 1. Exam Overview */}
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
                Exam Overview
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Basic details about the entrance examination
              </p>
            </div>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className={labelClass}>
                Hero Banner Image <span className="text-red-500">*</span>
              </label>
              <div
                onClick={() =>
                  document.getElementById("entrance-banner-input")?.click()
                }
                className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-blue-400 transition-colors cursor-pointer relative overflow-hidden min-h-[200px]"
              >
                {heroBanner ? (
                  <div className="relative w-full h-full">
                    <img
                      src={heroBanner}
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
                        setHeroBanner("");
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
                  id="entrance-banner-input"
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
                      if (!ev.target?.result) return;
                      const dataUrl = ev.target.result as string;
                      const img = new Image();
                      img.onload = async () => {
                        const ratio = img.naturalWidth / img.naturalHeight;
                        const targetRatio = 3.68;
                        if (Math.abs(ratio - targetRatio) < 0.05) {
                          try {
                            const url = await uploadFile(
                              file,
                              "institution/entrance",
                            );
                            setHeroBanner(url);
                          } catch (err) {
                            console.error("Banner upload failed:", err);
                          }
                        } else {
                          setCropImageSrc(dataUrl);
                          setCropperOpen(true);
                        }
                      };
                      img.src = dataUrl;
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>
                Exam Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`${inputClass} ${fieldError("title")}`}
                placeholder="e.g. CMAT 2026"
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
                  placeholder="Describe the entrance examination..."
                  style={{ minHeight: "120px" }}
                  className="bg-white"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Overview and key details about the examination
              </p>
            </div>
            <div>
              <label className={labelClass}>Application Fee</label>
              <input
                type="text"
                className={inputClass}
                placeholder="e.g. NPR 3,500"
                value={applicationFee}
                onChange={(e) => setApplicationFee(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Application fee for the examination
              </p>
            </div>
            <div>
              <label className={labelClass}>
                Mode <span className="text-red-500">*</span>
              </label>
              <select
                className={selectClass}
                value={examMode}
                onChange={(e) => setExamMode(e.target.value)}
              >
                <option value="">Select Mode</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>
                Exam Scope <span className="text-red-500">*</span>
              </label>
              <select
                className={selectClass}
                value={examScope}
                onChange={(e) => setExamScope(e.target.value)}
              >
                <option value="">Select Scope</option>
                <option value="nationwide">Nationwide</option>
                <option value="province-wide">Province-wide</option>
                <option value="district-level">District-level</option>
                <option value="regional">Regional</option>
                <option value="college-specific">College-specific</option>
                <option value="university-wide">University-wide</option>
                <option value="campus-specific">Campus-specific</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Application Link</label>
              <input
                type="url"
                className={inputClass}
                placeholder="https://example.com/apply"
                value={applicationLink}
                onChange={(e) => setApplicationLink(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                External application form URL for this entrance
              </p>
            </div>
            <div>
              <label className={labelClass}>Embedded Map</label>
              <textarea
                className={inputClass}
                rows={3}
                placeholder="Paste Google Maps iframe embed code..."
                value={embeddedMap}
                onChange={(e) => setEmbeddedMap(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Google Maps iframe embed code for institution location
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700">
                  Detail & Information Table
                </h3>
                <button
                  onClick={() =>
                    setOverviewDetails((prev) => [
                      ...prev,
                      { id: nextId(prev), detail: "", information: "" },
                    ])
                  }
                  className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 flex items-center gap-1.5 transition-colors shadow-sm"
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
                  Add Row
                </button>
              </div>
              <div
                className={`rounded-lg border border-gray-200 ${fieldError("overviewDetails") ? "ring-2 ring-red-500" : ""}`}
              >
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-200 w-1/3">
                        Detail
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-200">
                        Information
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-200 w-16"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {overviewDetails.map((d) => (
                      <tr key={d.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border-b border-gray-200">
                          <input
                            type="text"
                            className="w-full border-0 rounded-none px-1 py-1.5 text-sm focus:border-blue-400 outline-none bg-white"
                            placeholder="e.g. Exam Name"
                            value={d.detail}
                            onChange={(e) =>
                              setOverviewDetails((prev) =>
                                prev.map((x) =>
                                  x.id === d.id
                                    ? { ...x, detail: e.target.value }
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
                            placeholder="e.g. IOE BE/B.Arch Entrance 2081"
                            value={d.information}
                            onChange={(e) =>
                              setOverviewDetails((prev) =>
                                prev.map((x) =>
                                  x.id === d.id
                                    ? { ...x, information: e.target.value }
                                    : x,
                                ),
                              )
                            }
                          />
                        </td>
                        <td className="px-4 py-2 text-right border-b border-gray-200">
                          <button
                            onClick={() =>
                              setOverviewDetails((prev) =>
                                prev.filter((x) => x.id !== d.id),
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
              <p className="text-xs text-gray-500 mt-2">
                Add rows for exam details like name, conducting body, frequency,
                level, mode, etc.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Exam Dates & Schedule */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
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
                  Exam Dates & Schedule
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Key dates and schedule for the examination
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                setExamDateSchedules((prev) => [
                  ...prev,
                  {
                    id: nextId(prev),
                    date: "",
                    endDate: "",
                    event: "",
                    icon: "calendar",
                    color: "blue",
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
              </svg>
              Add Row
            </button>
          </div>
          <div className="p-6 overflow-visible">
            <div className="rounded-lg border border-gray-200 overflow-visible">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-200">
                      Start Date
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-200">
                      End Date
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-200">
                      Event
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-200 w-28">
                      Status
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-200 w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {examDateSchedules.map((d) => {
                    const status = computeStatus(d.date, d.endDate);
                    return (
                      <tr key={d.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border-b border-gray-200">
                          <CustomDatePicker
                            value={d.date}
                            max={d.endDate || undefined}
                            onChange={(v) =>
                              setExamDateSchedules((prev) =>
                                prev.map((x) =>
                                  x.id === d.id ? { ...x, date: v } : x,
                                ),
                              )
                            }
                          />
                        </td>
                        <td className="px-4 py-2 border-b border-gray-200">
                          <CustomDatePicker
                            value={d.endDate}
                            min={d.date || undefined}
                            onChange={(v) =>
                              setExamDateSchedules((prev) =>
                                prev.map((x) =>
                                  x.id === d.id ? { ...x, endDate: v } : x,
                                ),
                              )
                            }
                          />
                        </td>
                        <td className="px-4 py-2 border-b border-gray-200">
                          <input
                            type="text"
                            className="w-full border-0 rounded-none px-1 py-1.5 text-sm focus:border-blue-400 outline-none bg-white"
                            placeholder="e.g. IOE Entrance 2081 Registration"
                            value={d.event}
                            onChange={(e) =>
                              setExamDateSchedules((prev) =>
                                prev.map((x) =>
                                  x.id === d.id
                                    ? { ...x, event: e.target.value }
                                    : x,
                                ),
                              )
                            }
                          />
                        </td>
                        <td className="px-4 py-2 border-b border-gray-200">
                          {status.label ? (
                            <span
                              className={`inline-block text-[11px] font-bold px-2 py-1 rounded uppercase ${status.color}`}
                            >
                              {status.label}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">Auto</span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-right border-b border-gray-200">
                          <button
                            onClick={() =>
                              setExamDateSchedules((prev) =>
                                prev.filter((x) => x.id !== d.id),
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
                    );
                  })}
                </tbody>
              </table>
            </div>
            {examDateSchedules.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">
                No dates added yet. Click &quot;Add Row&quot; to add exam dates
                and schedule.
              </p>
            )}
          </div>
        </div>

        {/* 3. Eligibility Criteria */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <SectionItemHeader
            icon="clipboard-check"
            title="Eligibility Criteria"
            subtitle="Define eligibility requirements for candidates"
            onAdd={() =>
              setEligibilityList((prev) => [
                ...prev,
                { id: nextId(prev), title: "", description: "" },
              ])
            }
            addLabel="Add Criteria"
          />
          <div className="p-6 space-y-6">
            {eligibilityList.map((ec) => (
              <div
                key={ec.id}
                className="p-5 bg-gray-50 rounded-lg border border-gray-200 relative group"
              >
                <button
                  onClick={() =>
                    setEligibilityList((prev) =>
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
                      Criteria Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. Academic Qualification"
                      value={ec.title}
                      onChange={(e) =>
                        setEligibilityList((prev) =>
                          prev.map((x) =>
                            x.id === ec.id
                              ? { ...x, title: e.target.value }
                              : x,
                          ),
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Criteria Description{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <QuillEditor
                      theme="snow"
                      modules={quillModules}
                      className="bg-white"
                      value={ec.description}
                      onChange={(v) =>
                        setEligibilityList((prev) =>
                          prev.map((x) =>
                            x.id === ec.id ? { ...x, description: v } : x,
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

        {/* 4. Application Process */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <SectionItemHeader
            icon="list-ordered"
            title="Application Process"
            subtitle="Step-by-step application instructions"
            onAdd={() =>
              setApplicationSteps((prev) => [
                ...prev,
                { id: nextId(prev), title: "", description: "" },
              ])
            }
            addLabel="Add Step"
          />
          <div className="p-6 space-y-6">
            {applicationSteps.map((step) => (
              <div
                key={step.id}
                className="p-5 bg-gray-50 rounded-lg border border-gray-200 relative group"
              >
                <button
                  onClick={() =>
                    setApplicationSteps((prev) =>
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
                      value={String(applicationSteps.indexOf(step) + 1)}
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
                      placeholder="e.g. Online Registration"
                      value={step.title}
                      onChange={(e) =>
                        setApplicationSteps((prev) =>
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
                    <QuillEditor
                      theme="snow"
                      modules={quillModules}
                      className="bg-white"
                      value={step.description}
                      onChange={(v) =>
                        setApplicationSteps((prev) =>
                          prev.map((x) =>
                            x.id === step.id ? { ...x, description: v } : x,
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

        {/* 5. Exam Pattern & Syllabus */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <SectionItemHeader
            icon="book-open"
            title="Exam Pattern & Syllabus"
            subtitle="Exam structure, pattern details, and subject-wise marks"
            onAdd={() =>
              setExamPattern((prev) => [
                ...prev,
                { id: nextId(prev), label: "", value: "" },
              ])
            }
            addLabel="Add Pattern Detail"
          />
          <div className="p-6 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700">
                  Exam Pattern
                </h3>
                <button
                  onClick={() =>
                    setExamPattern((prev) => [
                      ...prev,
                      { id: nextId(prev), label: "", value: "" },
                    ])
                  }
                  className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 flex items-center gap-1.5 transition-colors shadow-sm"
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
                  Add Row
                </button>
              </div>
              <div className="rounded-lg border border-gray-200">
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-200">
                        Field
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-200">
                        Value
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-200 w-16"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {examPattern.map((pt) => (
                      <tr key={pt.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border-b border-gray-200">
                          <input
                            type="text"
                            className="w-full border-0 rounded-none px-1 py-1.5 text-sm focus:border-blue-400 outline-none bg-white"
                            placeholder="e.g. Total Questions"
                            value={pt.label}
                            onChange={(e) =>
                              setExamPattern((prev) =>
                                prev.map((x) =>
                                  x.id === pt.id
                                    ? { ...x, label: e.target.value }
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
                            placeholder="e.g. 120 MCQs"
                            value={pt.value}
                            onChange={(e) =>
                              setExamPattern((prev) =>
                                prev.map((x) =>
                                  x.id === pt.id
                                    ? { ...x, value: e.target.value }
                                    : x,
                                ),
                              )
                            }
                          />
                        </td>
                        <td className="px-4 py-2 text-right border-b border-gray-200">
                          <button
                            onClick={() =>
                              setExamPattern((prev) =>
                                prev.filter((x) => x.id !== pt.id),
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
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Subject-wise Marks Distribution
              </h3>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-200">
                        Subject
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-200 w-40">
                        Marks
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-200 w-16"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjectMarks.map((sm) => (
                      <tr key={sm.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border-b border-gray-200">
                          <input
                            type="text"
                            className="w-full border-0 rounded-none px-1 py-1.5 text-sm focus:border-blue-400 outline-none bg-white"
                            placeholder="e.g. Mathematics"
                            value={sm.subject}
                            onChange={(e) =>
                              setSubjectMarks((prev) =>
                                prev.map((x) =>
                                  x.id === sm.id
                                    ? { ...x, subject: e.target.value }
                                    : x,
                                ),
                              )
                            }
                          />
                        </td>
                        <td className="px-4 py-2 border-b border-gray-200">
                          <input
                            type="text"
                            className="w-full border-0 rounded-none px-1 py-1.5 text-sm text-center focus:border-blue-400 outline-none bg-white"
                            placeholder="40"
                            value={sm.marks}
                            onChange={(e) =>
                              setSubjectMarks((prev) =>
                                prev.map((x) =>
                                  x.id === sm.id
                                    ? { ...x, marks: e.target.value }
                                    : x,
                                ),
                              )
                            }
                          />
                        </td>
                        <td className="px-4 py-2 text-right border-b border-gray-200">
                          <button
                            onClick={() =>
                              setSubjectMarks((prev) =>
                                prev.filter((x) => x.id !== sm.id),
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
              <button
                onClick={() =>
                  setSubjectMarks((prev) => [
                    ...prev,
                    { id: nextId(prev), subject: "", marks: "" },
                  ])
                }
                className="mt-3 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
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
                Add Subject
              </button>
            </div>
          </div>
        </div>

        {/* 6. Model Sets / Past Papers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <SectionItemHeader
            icon="download"
            title="Model Sets & Past Papers"
            subtitle="Upload model question sets and past papers for download"
            onAdd={() =>
              setModelSets((prev) => [
                ...prev,
                {
                  id: nextId(prev),
                  title: "",
                  size: "",
                  description: "",
                  fileUrl: "",
                },
              ])
            }
            addLabel="Add Material"
          />
          <div className="p-6 space-y-4">
            {modelSets.map((ms) => (
              <div
                key={ms.id}
                className="p-5 bg-gray-50 rounded-lg border border-gray-200 relative group"
              >
                <button
                  onClick={() =>
                    setModelSets((prev) => prev.filter((x) => x.id !== ms.id))
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
                      placeholder="e.g. IOE Official Model Question"
                      value={ms.title}
                      onChange={(e) =>
                        setModelSets((prev) =>
                          prev.map((x) =>
                            x.id === ms.id
                              ? { ...x, title: e.target.value }
                              : x,
                          ),
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Short Description</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. Complete 120 Questions with Blueprint"
                      value={ms.description}
                      onChange={(e) =>
                        setModelSets((prev) =>
                          prev.map((x) =>
                            x.id === ms.id
                              ? { ...x, description: e.target.value }
                              : x,
                          ),
                        )
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-blue-400 transition-colors cursor-pointer group">
                      {ms.fileUrl ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="p-2 bg-green-50 text-green-600 rounded-full">
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
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            File uploaded
                          </span>
                          <span className="text-xs text-gray-500">
                            Click anywhere to replace
                          </span>
                          <div className="flex gap-2">
                            <a
                              href={ms.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                            >
                              View
                            </a>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setModelSets((prev) =>
                                  prev.map((x) =>
                                    x.id === ms.id ? { ...x, fileUrl: "" } : x,
                                  ),
                                );
                              }}
                              className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
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
                            Upload PDF File
                          </span>
                          <span className="mt-1 text-xs text-gray-500">
                            PDF format recommended
                          </span>
                        </>
                      )}
                      {uploadingInfo?.id === ms.id ? (
                        <span className="text-xs text-blue-600 mt-2">
                          Uploading...
                        </span>
                      ) : (
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleModelSetUpload(ms.id, file);
                          }}
                        />
                      )}
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Key Dates / Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <SectionItemHeader
            icon="calendar"
            title="Key Dates & Timeline"
            subtitle="Upcoming and past important dates"
            onAdd={() =>
              setUpcomingDates((prev) => [
                ...prev,
                {
                  id: nextId(prev),
                  date: "",
                  endDate: "",
                  event: "",
                  icon: "calendar",
                  color: "blue",
                },
              ])
            }
            addLabel="Add Upcoming Date"
          />
          <div className="p-6 space-y-6">
            <div>
              {upcomingDates.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">
                  No upcoming dates added yet.
                </p>
              )}
              <div className="space-y-4">
                {upcomingDates.map((d) => {
                  const status = computeStatus(d.date, d.endDate);
                  return (
                    <div
                      key={d.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 relative group"
                    >
                      <button
                        onClick={() =>
                          setUpcomingDates((prev) =>
                            prev.filter((x) => x.id !== d.id),
                          )
                        }
                        className="absolute top-3 right-3 p-1.5 text-red-400 hover:text-red-600 transition-colors"
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
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 pr-8">
                        <div>
                          <label className="text-xs font-medium text-gray-500 mb-1 block">
                            Start Date
                          </label>
                          <CustomDatePicker
                            value={d.date}
                            max={d.endDate || undefined}
                            onChange={(v) =>
                              setUpcomingDates((prev) =>
                                prev.map((x) =>
                                  x.id === d.id ? { ...x, date: v } : x,
                                ),
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 mb-1 block">
                            End Date
                          </label>
                          <CustomDatePicker
                            value={d.endDate}
                            min={d.date || undefined}
                            onChange={(v) =>
                              setUpcomingDates((prev) =>
                                prev.map((x) =>
                                  x.id === d.id ? { ...x, endDate: v } : x,
                                ),
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 mb-1 block">
                            Event
                          </label>
                          <input
                            type="text"
                            className={inputClass}
                            placeholder="e.g. Registration Opens"
                            value={d.event}
                            onChange={(e) =>
                              setUpcomingDates((prev) =>
                                prev.map((x) =>
                                  x.id === d.id
                                    ? { ...x, event: e.target.value }
                                    : x,
                                ),
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 mb-1 block">
                            Status
                          </label>
                          <div className="pt-2">
                            {status.label ? (
                              <span
                                className={`inline-block text-[11px] font-bold px-2 py-1 rounded uppercase ${status.color}`}
                              >
                                {status.label}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">
                                Auto
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 mb-1 block">
                            Icon
                          </label>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                              {(() => {
                                const key =
                                  (d.icon || "calendar")
                                    .charAt(0)
                                    .toUpperCase() +
                                  (d.icon || "calendar").slice(1).toLowerCase();
                                const Icon = (LucideIcons as any)[key];
                                return Icon ? (
                                  <Icon size={14} />
                                ) : (
                                  <LucideIcons.Calendar size={14} />
                                );
                              })()}
                            </div>
                            <input
                              type="text"
                              className={inputClass}
                              placeholder="e.g. calendar, bell"
                              value={d.icon}
                              onChange={(e) =>
                                setUpcomingDates((prev) =>
                                  prev.map((x) =>
                                    x.id === d.id
                                      ? { ...x, icon: e.target.value }
                                      : x,
                                  ),
                                )
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 mb-1 block">
                            Color
                          </label>
                          <select
                            className={selectClass}
                            value={d.color}
                            onChange={(e) =>
                              setUpcomingDates((prev) =>
                                prev.map((x) =>
                                  x.id === d.id
                                    ? { ...x, color: e.target.value }
                                    : x,
                                ),
                              )
                            }
                          >
                            <option value="blue">Blue</option>
                            <option value="green">Green</option>
                            <option value="orange">Orange</option>
                            <option value="purple">Purple</option>
                            <option value="red">Red</option>
                            <option value="teal">Teal</option>
                            <option value="indigo">Indigo</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 8. Contact Persons */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <SectionItemHeader
            icon="users"
            title="Contact Information"
            subtitle="Exam-related contact information for inquiries"
            onAdd={() =>
              setContactPersons((prev) => [
                ...prev,
                {
                  id: nextId(prev),
                  name: "",
                  role: "",
                  phone: "",
                  email: "",
                  whatsapp: "",
                  image: "",
                },
              ])
            }
            addLabel="Add Contact Person"
          />
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  className={inputClass}
                  placeholder="entrance@example.com"
                  value={entranceEmail}
                  onChange={(e) => setEntranceEmail(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Contact Number</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="+977-01-XXXXXXX"
                  value={entranceContactNumber}
                  onChange={(e) =>
                    setEntranceContactNumber(
                      e.target.value.replace(/[^0-9+()-]/g, ""),
                    )
                  }
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">
                  Social Links
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setSocialLinks((prev) => [
                      ...prev,
                      { id: nextId(prev), platform: "", url: "" },
                    ])
                  }
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                >
                  + Add Link
                </button>
              </div>
              {socialLinks.length === 0 && (
                <p className="text-xs text-gray-400">
                  No social links added yet.
                </p>
              )}
              <div className="space-y-3">
                {socialLinks.map((sl) => (
                  <div
                    key={sl.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <select
                      className={`${inputClass} max-w-[180px]`}
                      value={sl.platform}
                      onChange={(e) =>
                        setSocialLinks((prev) =>
                          prev.map((x) =>
                            x.id === sl.id
                              ? { ...x, platform: e.target.value }
                              : x,
                          ),
                        )
                      }
                    >
                      <option value="">Select platform</option>
                      <option value="facebook">Facebook</option>
                      <option value="twitter">Twitter / X</option>
                      <option value="instagram">Instagram</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="youtube">YouTube</option>
                      <option value="tiktok">TikTok</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="telegram">Telegram</option>
                      <option value="other">Other</option>
                    </select>
                    <input
                      type="url"
                      className={inputClass}
                      placeholder="https://..."
                      value={sl.url}
                      onChange={(e) =>
                        setSocialLinks((prev) =>
                          prev.map((x) =>
                            x.id === sl.id ? { ...x, url: e.target.value } : x,
                          ),
                        )
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setSocialLinks((prev) =>
                          prev.filter((x) => x.id !== sl.id),
                        )
                      }
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0 cursor-pointer"
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
              </div>
            </div>

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
                    <label className={labelClass}>Photo</label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 border border-gray-300 overflow-hidden shrink-0">
                        {cp.image ? (
                          <img
                            src={cp.image}
                            alt="Preview"
                            className="w-full h-full object-cover"
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
                      <label className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm transition-colors">
                        Choose File
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                const url = ev.target?.result as string;
                                setContactPersons((prev) =>
                                  prev.map((x) =>
                                    x.id === cp.id ? { ...x, image: url } : x,
                                  ),
                                );
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      {cp.image && (
                        <button
                          onClick={() =>
                            setContactPersons((prev) =>
                              prev.map((x) =>
                                x.id === cp.id ? { ...x, image: "" } : x,
                              ),
                            )
                          }
                          className="p-2 text-red-400 hover:text-red-600 transition-colors"
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
                      placeholder="e.g. Prof. Dr. Shashidhar Ram Joshi"
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
                      Role <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. Exam Controller"
                      value={cp.role}
                      onChange={(e) =>
                        setContactPersons((prev) =>
                          prev.map((x) =>
                            x.id === cp.id ? { ...x, role: e.target.value } : x,
                          ),
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. 01-5520398"
                      value={cp.phone}
                      onChange={(e) => {
                        const v = e.target.value.replace(/[^0-9+]/g, "");
                        setContactPersons((prev) =>
                          prev.map((x) =>
                            x.id === cp.id ? { ...x, phone: v } : x,
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
                      placeholder="controller@ioe.edu.np"
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
                    <label className={labelClass}>WhatsApp Link</label>
                    <input
                      type="url"
                      className={inputClass}
                      placeholder="https://wa.me/97798XXXXXXXX"
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

        {/* 9. FAQ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <SectionItemHeader
            icon="help-circle"
            title="Frequently Asked Questions (FAQ)"
            subtitle="Common questions and answers about the exam"
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
                    placeholder="e.g. Can I apply for both BE and B.Arch?"
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

        {/* 10. Entrance Notice */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <SectionItemHeader
            icon="file-text"
            title="Entrance Notice"
            subtitle="Upload notice PDF, DOC, or image for this exam"
          />
          <div className="p-6">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 border-dashed rounded-lg text-sm text-gray-500 cursor-pointer hover:border-blue-400 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {uploadingNotice
                  ? "Uploading..."
                  : noticeFile
                    ? "Replace File"
                    : "Upload File"}
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const allowed = [
                      "application/pdf",
                      "image/jpeg",
                      "image/png",
                      "image/jpg",
                      "application/msword",
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    ];
                    if (!allowed.includes(file.type)) {
                      alert("Only PDF, DOC, or image files are allowed.");
                      return;
                    }
                    setUploadingNotice(true);
                    try {
                      const ext = file.name.split(".").pop() || "pdf";
                      const url = await uploadFile(
                        new File([file], `notice.${ext}`, { type: file.type }),
                        "institution/entrance",
                      );
                      setNoticeFile(url);
                      setNoticeFileName(file.name);
                    } catch (e) {
                      console.error("Notice upload failed:", e);
                    }
                    setUploadingNotice(false);
                  }}
                />
              </label>
              {noticeFile && (
                <button
                  onClick={() => {
                    setNoticeFile("");
                    setNoticeFileName("");
                  }}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
            {noticeFile && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-green-700">
                      File uploaded successfully
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      {noticeFileName || noticeFile.split("/").pop()}
                    </p>
                  </div>
                  <a
                    href={noticeFile}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                  >
                    View
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 14. Required Documents */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <SectionItemHeader
            icon="file-check"
            title="Required Documents"
            subtitle="List required documents for applicants"
            onAdd={() =>
              setRequiredDocuments((prev) => [
                ...prev,
                { id: nextId(prev), title: "", description: "" },
              ])
            }
            addLabel="Add Document"
          />
          <div className="p-6 space-y-4">
            {requiredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="p-5 bg-gray-50 rounded-lg border border-gray-200 relative group"
              >
                <button
                  onClick={() =>
                    setRequiredDocuments((prev) =>
                      prev.filter((x) => x.id !== doc.id),
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
                <div className="grid grid-cols-1 gap-4 pr-12">
                  <div>
                    <label className={labelClass}>
                      Document Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. SLC/SEE Marksheet"
                      value={doc.title}
                      onChange={(e) =>
                        setRequiredDocuments((prev) =>
                          prev.map((x) =>
                            x.id === doc.id
                              ? { ...x, title: e.target.value }
                              : x,
                          ),
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Description</label>
                    <textarea
                      className={`${inputClass} min-h-[60px]`}
                      rows={2}
                      placeholder="Specifications about the document..."
                      value={doc.description}
                      onChange={(e) =>
                        setRequiredDocuments((prev) =>
                          prev.map((x) =>
                            x.id === doc.id
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

        {/* 15. Examination Schedule */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <SectionItemHeader
            icon="calendar-clock"
            title="Examination Schedule"
            subtitle="Exam date, shifts, and centers"
            onAdd={() =>
              setExaminationSchedule((prev) => [
                ...prev,
                {
                  id: nextId(prev),
                  examDate: "",
                  shifts: "",
                  centers: "",
                },
              ])
            }
            addLabel="Add Schedule"
          />
          <div className="p-6 space-y-4">
            {examinationSchedule.map((es) => (
              <div
                key={es.id}
                className="p-5 bg-gray-50 rounded-lg border border-gray-200 relative group"
              >
                <button
                  onClick={() =>
                    setExaminationSchedule((prev) =>
                      prev.filter((x) => x.id !== es.id),
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
                      Exam Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className={inputClass}
                      value={es.examDate}
                      onChange={(e) =>
                        setExaminationSchedule((prev) =>
                          prev.map((x) =>
                            x.id === es.id
                              ? { ...x, examDate: e.target.value }
                              : x,
                          ),
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Shifts</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. Morning, Day"
                      value={es.shifts}
                      onChange={(e) =>
                        setExaminationSchedule((prev) =>
                          prev.map((x) =>
                            x.id === es.id
                              ? { ...x, shifts: e.target.value }
                              : x,
                          ),
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Centers</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. Pulchowk, Thapathali"
                      value={es.centers}
                      onChange={(e) =>
                        setExaminationSchedule((prev) =>
                          prev.map((x) =>
                            x.id === es.id
                              ? { ...x, centers: e.target.value }
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

        {/* 16. Programs Offered */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <SectionItemHeader
            icon="graduation-cap"
            title="Programs Offered"
            subtitle="Programs available through this entrance"
            onAdd={() =>
              setProgramsOffered((prev) => [
                ...prev,
                { id: nextId(prev), programName: "", description: "" },
              ])
            }
            addLabel="Add Program"
          />
          <div className="p-6 space-y-4">
            {programsOffered.map((pg) => (
              <div
                key={pg.id}
                className="p-5 bg-gray-50 rounded-lg border border-gray-200 relative group"
              >
                <button
                  onClick={() =>
                    setProgramsOffered((prev) =>
                      prev.filter((x) => x.id !== pg.id),
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
                <div className="grid grid-cols-1 gap-4 pr-12">
                  <div>
                    <label className={labelClass}>
                      Program Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. BE Civil Engineering"
                      value={pg.programName}
                      onChange={(e) =>
                        setProgramsOffered((prev) =>
                          prev.map((x) =>
                            x.id === pg.id
                              ? { ...x, programName: e.target.value }
                              : x,
                          ),
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Description</label>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <QuillEditor
                        value={pg.description}
                        onChange={(v: string) =>
                          setProgramsOffered((prev) =>
                            prev.map((x) =>
                              x.id === pg.id ? { ...x, description: v } : x,
                            ),
                          )
                        }
                        modules={quillModules}
                        placeholder="Program details..."
                        style={{ minHeight: "100px" }}
                        className="bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => {
              localStorage.removeItem("superadmin_edit_entrance_id");
              setActiveSection("superadmin-entrance-directory");
            }}
            className="px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors shadow-sm"
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
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Cancel
          </button>
          <div className="flex items-center gap-4">
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
              {saving
                ? "Saving..."
                : editId
                  ? "Publish Changes"
                  : "Publish Exam"}
            </button>
          </div>
        </div>
      </div>

      {cropperOpen && cropImageSrc && (
        <ImageCropperModal
          imageSrc={cropImageSrc}
          onCropComplete={handleBannerCrop}
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
