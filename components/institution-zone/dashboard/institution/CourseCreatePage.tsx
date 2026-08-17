"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import * as LucideIcons from "lucide-react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";
import { institutionProgramApi } from "@/services/institutionProgramApi";
import { fetchCoursesByAffiliation, fetchSecondaryCourses } from "@/services/course-api";
import { universityApi } from "@/services/university.api";
import { GlobalCourse } from "@/types/course";
import ImageCropperModal from "@/components/ScholarshipProvider/common/ImageCropperModal";
import "react-quill-new/dist/quill.snow.css";

function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

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

interface AdmissionStep {
  id: number;
  title: string;
  description: string;
}

interface FeatureItem {
  id: number;
  title: string;
  shortDesc: string;
}

interface WhoShouldChoose {
  id: number;
  icon: string;
  title: string;
  shortDesc: string;
}

interface FaqItem {
  id: number;
  question: string;
  answer: string;
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

const CourseCreatePage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!editId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [level, setLevel] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [estFee, setEstFee] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");

  const [eligibilityText, setEligibilityText] = useState("");
  const [admissionSteps, setAdmissionSteps] = useState<AdmissionStep[]>([]);
  const [feeStructureText, setFeeStructureText] = useState("");
  const [scholarshipText, setScholarshipText] = useState("");
  const [curriculum, setCurriculum] = useState<any[]>([]);
  const [features, setFeatures] = useState<FeatureItem[]>([]);
  const [whoShouldChoose, setWhoShouldChoose] = useState<WhoShouldChoose[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedAffiliationId, setSelectedAffiliationId] = useState<number | null>(null);
  const [nonUniversityAffiliation, setNonUniversityAffiliation] = useState("");
  const [globalCourses, setGlobalCourses] = useState<GlobalCourse[]>([]);
  const [selectedGlobalCourse, setSelectedGlobalCourse] = useState<GlobalCourse | null>(null);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [universities, setUniversities] = useState<{ id: number; name: string }[]>([]);

  const getToken = () => localStorage.getItem("institutionToken");
  const apiBase = () =>
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const base = apiBase();
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(
      `${base}/api/v1/institution/upload?folder=${folder}`,
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
    institutionProgramApi
      .getById(Number(editId))
      .then((res) => {
        setTitle(res.globalCourseTitle || "");
        setDescription(res.overrides?.description || "");
        setEstFee(res.fee || "");
        setBannerUrl(res.overrides?.bannerUrl || res.bannerUrl || "");
        setDuration(res.duration || "");
        setLevel(res.level || "");
        setAffiliation(res.affiliationName || res.nonUniversityAffiliation || "");

        if (res.globalCourseId) {
          setSelectedGlobalCourse({
            id: res.globalCourseId,
            title: res.globalCourseTitle || "",
            duration: res.duration || "",
            level: res.level || "",
            field: res.field || "",
            affiliationName: res.affiliationName || "",
            nonUniversityAffiliation: res.nonUniversityAffiliation || "",
            bannerUrl: res.bannerUrl || "",
            description: res.overrides?.description || "",
            estFee: res.fee || "",
          } as GlobalCourse);
        }

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
        if (res.eligibilityText)
          setEligibilityText(res.eligibilityText);
        if (res.feeStructureText)
          setFeeStructureText(res.feeStructureText);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [editId]);

  useEffect(() => {
    universityApi.getUniversities().then((res) => {
      setUniversities(res.data?.universities || []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedLevel) {
      setGlobalCourses([]);
      return;
    }

    setLoadingCourses(true);

    if (selectedLevel === "Bachelor's Degree" || selectedLevel === "Master's Degree" || selectedLevel === "Postgraduate Diploma" || selectedLevel === "M.Phil." || selectedLevel === "PhD / Doctorate") {
      if (selectedAffiliationId) {
        fetchCoursesByAffiliation(selectedAffiliationId, 1, 100)
          .then(res => setGlobalCourses(res.courses || []))
          .catch(() => setGlobalCourses([]))
          .finally(() => setLoadingCourses(false));
      } else {
        setGlobalCourses([]);
        setLoadingCourses(false);
      }
    } else {
      fetchSecondaryCourses(1, 100)
        .then(res => setGlobalCourses(res.courses || []))
        .catch(() => setGlobalCourses([]))
        .finally(() => setLoadingCourses(false));
    }
  }, [selectedLevel, selectedAffiliationId]);

  const selectGlobalCourse = (course: GlobalCourse) => {
    const normalized = { ...course, id: Number(course.id) || 0 };
    setSelectedGlobalCourse(normalized);
    setTitle(normalized.title || "");
    setDuration(normalized.duration || "");
    setEstFee(normalized.estFee || "");
    setLevel(normalized.level || "");
    setFieldOfStudy(normalized.fieldOfStudy || normalized.field || "");
    setDescription(normalized.description || "");
    setBannerUrl(normalized.bannerUrl || "");
    setAffiliation(normalized.affiliationName || normalized.nonUniversityAffiliation || "");

    if (normalized.eligibilityText) {
      setEligibilityText(normalized.eligibilityText);
    }
    if (normalized.admissionSteps?.length) {
      setAdmissionSteps(normalized.admissionSteps.map((x: any, i: number) => ({ ...x, id: i + 1 })));
    }
    if (normalized.faqs?.length) {
      setFaqs(normalized.faqs.map((x: any, i: number) => ({ ...x, id: i + 1 })));
    }
    if (normalized.whoShouldChoose?.length) {
      setWhoShouldChoose(normalized.whoShouldChoose.map((x: any, i: number) => ({ ...x, id: i + 1 })));
    }
    if (normalized.features?.length) {
      setFeatures(normalized.features.map((x: any, i: number) => ({ ...x, id: i + 1 })));
    }
    if (normalized.feeStructure) {
      setFeeStructureText(normalized.feeStructure);
    }
    if (normalized.scholarshipDesc || normalized.scholarships?.length || normalized.scholarshipNotes) {
      let text = normalized.scholarshipDesc || "";
      if (normalized.scholarships?.length) {
        text += "\n\n" + normalized.scholarships.map((s: any) => {
          let item = `• ${s.title}`;
          if (s.subtitle) item += ` — ${s.subtitle}`;
          if (s.coverage) item += `\n  Coverage: ${s.coverage}`;
          if (s.requirement) item += `\n  Requirement: ${s.requirement}`;
          return item;
        }).join("\n");
      }
      if (normalized.scholarshipNotes) {
        text += "\n\n" + normalized.scholarshipNotes;
      }
      setScholarshipText(text);
    }
    if (normalized.curriculum?.length) {
      setCurriculum(normalized.curriculum.map((x: any, i: number) => ({ ...x, id: i + 1 })));
    }
  };

  const clearGlobalCourse = () => {
    setSelectedGlobalCourse(null);
  };

  const selectedCourseId = selectedGlobalCourse?.id || "";

  const fieldError = (field: string) =>
    errors[field] ? "ring-2 ring-red-500" : "";

  const validate = () => {
    const errs: Record<string, boolean> = {};
    if (!title.trim()) errs.title = true;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const collectData = () => ({
    globalCourseId: Number(selectedGlobalCourse?.id) || 0,
    fee: estFee,
    eligibilityText: eligibilityText || undefined,
    capacity: 0,
    whoShouldChoose: whoShouldChoose.map(({ id, ...rest }) => rest),
    features: features.map(({ id, ...rest }) => rest),
    feeStructureText: feeStructureText || undefined,
    scholarshipText: scholarshipText || undefined,
    curriculum: curriculum.map(({ id, ...rest }) => rest),
    overrides: {
      description: description || undefined,
      bannerUrl: bannerUrl || undefined,
    },
    nullifiedFields: [] as string[],
  });

  const handleSave = async (publish: boolean) => {
    if (publish && !validate()) return;
    setSaving(true);
    try {
      const data = collectData();
      if (editId) {
        await institutionProgramApi.update(Number(editId), {
          ...data,
          status: publish ? "active" : "draft",
        });
        window.dispatchEvent(new Event("institution-data-changed"));
        if (publish) router.push("/institution-zone/dashboard/course/list");
      } else {
        const res = await institutionProgramApi.create({
          ...data,
          status: publish ? "active" : "draft",
        });
        window.dispatchEvent(new Event("institution-data-changed"));
        if (res?.id)
          router.replace(
            `/institution-zone/dashboard/course/create?id=${res.id}`,
          );
      }
    } catch (e: any) {
      console.error("Failed to save course:", e);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 min-h-full">
        <SectionHeader
          title="Edit Course"
          breadcrumbItems={[
            {
              label: "Dashboard",
              href: "/institution-zone/dashboard/overview",
            },
            { label: "Edit Course" },
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
        title={editId ? "Edit Course" : "Create Course"}
        breadcrumbItems={[
          { label: "Dashboard", href: "/institution-zone/dashboard/overview" },
          { label: editId ? "Edit Course" : "Create Course" },
        ]}
      />

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
                {selectedGlobalCourse
                  ? "Global fields are locked. Edit institution-specific details below."
                  : "Basic details about the course"}
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
                      Recommended size: 1920x600px (JPG/PNG)
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
              <label className={labelClass}>Level</label>
              <select
                className={selectClass}
                value={selectedLevel}
                onChange={(e) => {
                  setSelectedLevel(e.target.value);
                  setSelectedAffiliationId(null);
                  setSelectedGlobalCourse(null);
                }}
              >
                <option value="">Select Level</option>
                <option value="Higher Secondary (+2)">Higher Secondary (+2)</option>
                <option value="A Levels">A Levels</option>
                <option value="Pre-Diploma / TSLC">Pre-Diploma / TSLC</option>
                <option value="Diploma / PCL">Diploma / PCL</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Postgraduate Diploma">Postgraduate Diploma</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="M.Phil.">M.Phil.</option>
                <option value="PhD / Doctorate">PhD / Doctorate</option>
                <option value="Professional Qualifications">Professional Qualifications</option>
                <option value="Certificate Courses">Certificate Courses</option>
                <option value="Short-Term Courses">Short-Term Courses</option>
                <option value="Vocational / Technical Training">Vocational / Technical Training</option>
                <option value="Skill Development Programs">Skill Development Programs</option>
                <option value="Entrance Preparation">Entrance Preparation</option>
                <option value="Language & Test Preparation">Language & Test Preparation</option>
                <option value="Continuing / Lifelong Education">Continuing / Lifelong Education</option>
              </select>
            </div>

            {(selectedLevel === "Bachelor's Degree" || selectedLevel === "Master's Degree" || selectedLevel === "Postgraduate Diploma" || selectedLevel === "M.Phil." || selectedLevel === "PhD / Doctorate") && (
              <div>
                <label className={labelClass}>University / Affiliation</label>
                <select
                  className={selectClass}
                  value={selectedAffiliationId || ""}
                  onChange={(e) => {
                    setSelectedAffiliationId(Number(e.target.value) || null);
                    setSelectedGlobalCourse(null);
                  }}
                >
                  <option value="">Select University</option>
                  {universities
                    .slice()
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                </select>
              </div>
            )}

            {["Higher Secondary (+2)", "A Levels", "Pre-Diploma / TSLC", "Diploma / PCL", "Certificate Courses", "Short-Term Courses", "Vocational / Technical Training", "Skill Development Programs", "Entrance Preparation", "Language & Test Preparation", "Continuing / Lifelong Education", "Professional Qualifications"].includes(selectedLevel) && (
              <div>
                <label className={labelClass}>Board / Non-University Affiliation</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="e.g. NEB, CTEVT, A Level"
                  value={nonUniversityAffiliation}
                  onChange={(e) => setNonUniversityAffiliation(e.target.value)}
                />
              </div>
            )}

            <div>
              <label className={labelClass}>
                Course <span className="text-red-500">*</span>
              </label>
              {globalCourses.length > 0 || loadingCourses ? (
                <select
                  className={selectClass}
                  value={selectedCourseId}
                  onChange={(e) => {
                    const course = globalCourses.find(c => c.id === Number(e.target.value));
                    if (course) selectGlobalCourse(course);
                  }}
                  disabled={loadingCourses}
                >
                  <option value="">{loadingCourses ? "Loading courses..." : "Select course"}</option>
                  {globalCourses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  className={`${inputClass} ${fieldError("title")}`}
                  placeholder="e.g. 10+2 Science"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              )}
            </div>

            <div>
              <label className={labelClass}>
                Description
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
                <label className={labelClass}>Duration</label>
                <input
                  type="text"
                  className={`${inputClass} ${selectedGlobalCourse ? "bg-gray-50" : ""}`}
                  placeholder="e.g. 2 Years"
                  value={selectedGlobalCourse ? selectedGlobalCourse.duration : duration}
                  onChange={(e) => !selectedGlobalCourse && setDuration(e.target.value)}
                  disabled={!!selectedGlobalCourse}
                />
              </div>
              <div>
                <label className={labelClass}>Level</label>
                <input
                  type="text"
                  className={`${inputClass} ${selectedGlobalCourse ? "bg-gray-50" : ""}`}
                  value={selectedGlobalCourse ? selectedGlobalCourse.level : level}
                  disabled
                />
              </div>
              <div>
                <label className={labelClass}>Affiliation / Board</label>
                <input
                  type="text"
                  className={`${inputClass} ${selectedGlobalCourse ? "bg-gray-50" : ""}`}
                  placeholder="e.g. NEB, Tribhuvan University"
                  value={
                    selectedGlobalCourse
                      ? selectedGlobalCourse.affiliationName || selectedGlobalCourse.nonUniversityAffiliation || ""
                      : affiliation
                  }
                  disabled
                />
              </div>
              <div>
                <label className={labelClass}>Field of Study</label>
                <select
                  className={`${selectClass} ${selectedGlobalCourse ? "bg-gray-50" : ""}`}
                  value={selectedGlobalCourse ? selectedGlobalCourse.fieldOfStudy || selectedGlobalCourse.field || "" : ""}
                  disabled
                >
                  <option value="">Select Field of Study</option>
                  <option value="Management & Business">Management & Business</option>
                  <option value="Accounting & Finance">Accounting & Finance</option>
                  <option value="Computer Science & Information Technology">Computer Science & Information Technology</option>
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
                  <option value="Disaster & Risk Management">Disaster & Risk Management</option>
                  <option value="Maritime / Marine Studies">Maritime / Marine Studies</option>
                  <option value="Food & Nutrition">Food & Nutrition</option>
                  <option value="Religious & Cultural Studies">Religious & Cultural Studies</option>
                  <option value="Security & Defence Studies">Security & Defence Studies</option>
                  <option value="Technical & Vocational">Technical & Vocational</option>
                  <option value="Professional Studies">Professional Studies</option>
                  <option value="Language & Test Preparation">Language & Test Preparation</option>
                  <option value="Skill & Short-Term Courses">Skill & Short-Term Courses</option>
                  <option value="Other / Interdisciplinary">Other / Interdisciplinary</option>
                </select>
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
              {selectedGlobalCourse && (
                <div>
                  <label className={labelClass}>Capacity (Seats)</label>
                  <input
                    type="number"
                    min="0"
                    className={inputClass}
                    placeholder="e.g. 60"
                  />
                </div>
              )}
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

        {/* 6. Program Fee */}
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

        {/* 7. Scholarships Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <label className={labelClass}>Scholarships Overview</label>
            <p className="text-xs text-gray-500 mb-2">Describe scholarships, coverage, and requirements using rich text</p>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <QuillEditor
                theme="snow"
                value={scholarshipText}
                onChange={setScholarshipText}
                modules={quillModules}
                placeholder="Describe available scholarships, coverage details, eligibility requirements..."
                className="bg-white"
              />
            </div>
          </div>
        </div>

        {/* 8. FAQ */}
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

        {/* 9. Curriculum */}
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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
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
                  <label className={labelClass}>Subjects</label>
                  <div className="space-y-2">
                    {sec.subjects.map((subject: any, subIdx: number) => (
                      <div key={subIdx} className="flex items-center gap-2">
                        <span className="w-6 text-right text-xs font-semibold text-gray-400">{subIdx + 1}.</span>
                        <input type="text" className={`${inputClass} w-24`} placeholder="Code" value={subject.code}
                          onChange={(e) => setCurriculum((prev) => prev.map((x) => x.id === sec.id ? { ...x, subjects: x.subjects.map((s: any, i: number) => i === subIdx ? { ...s, code: e.target.value } : s) } : x))}
                        />
                        <input type="text" className={`${inputClass} flex-1`} placeholder="Subject name" value={subject.name}
                          onChange={(e) => setCurriculum((prev) => prev.map((x) => x.id === sec.id ? { ...x, subjects: x.subjects.map((s: any, i: number) => i === subIdx ? { ...s, name: e.target.value } : s) } : x))}
                        />
                        <input type="text" className={`${inputClass} w-20`} placeholder="Credits" value={subject.credits}
                          onChange={(e) => setCurriculum((prev) => prev.map((x) => x.id === sec.id ? { ...x, subjects: x.subjects.map((s: any, i: number) => i === subIdx ? { ...s, credits: e.target.value } : s) } : x))}
                        />
                        {sec.subjects.length > 1 && (
                          <button onClick={() => setCurriculum((prev) => prev.map((x) => x.id === sec.id ? { ...x, subjects: x.subjects.filter((_: any, i: number) => i !== subIdx) } : x))}
                            className="p-1.5 text-red-400 hover:text-red-600 transition-colors">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setCurriculum((prev) => prev.map((x) => x.id === sec.id ? { ...x, subjects: [...x.subjects, { code: "", name: "", credits: "" }] } : x))}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>{" "}Add Subject
                  </button>
                </div>
                <div>
                  <label className={labelClass}>Electives <span className="text-gray-400 font-normal">(optional)</span></label>
                  {sec.electives.length > 0 && (
                    <div className="space-y-2 mb-2">
                      {sec.electives.map((ele: any, ei: number) => (
                        <div key={ei} className="flex items-center gap-2">
                          <input type="text" className={`${inputClass} w-24`} placeholder="Code" value={ele.code}
                            onChange={(e) => setCurriculum((prev) => prev.map((x) => x.id === sec.id ? { ...x, electives: x.electives.map((el: any, j: number) => j === ei ? { ...el, code: e.target.value } : el) } : x))}
                          />
                          <input type="text" className={`${inputClass} flex-1`} placeholder="Elective name" value={ele.name}
                            onChange={(e) => setCurriculum((prev) => prev.map((x) => x.id === sec.id ? { ...x, electives: x.electives.map((el: any, j: number) => j === ei ? { ...el, name: e.target.value } : el) } : x))}
                          />
                          <button onClick={() => setCurriculum((prev) => prev.map((x) => x.id === sec.id ? { ...x, electives: x.electives.filter((_: any, j: number) => j !== ei) } : x))}
                            className="p-1.5 text-red-400 hover:text-red-600 transition-colors">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button onClick={() => setCurriculum((prev) => prev.map((x) => x.id === sec.id ? { ...x, electives: [...x.electives, { code: "", name: "" }] } : x))}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>{" "}Add Elective
                  </button>
                </div>
              </div>
            ))}
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
};

export default CourseCreatePage;
