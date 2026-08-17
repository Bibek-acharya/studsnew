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

interface EligibilityRow {
  id: number;
  level: string;
  stream: string;
  eligibility: string[];
  documents: string[];
}

interface AdmissionStep {
  id: number;
  title: string;
  description: string;
}

interface SubjectGroup {
  id: number;
  groupName: string;
  description: string;
  subjects: string[];
  careers: string[];
}

interface FullTimeCourse {
  id: number;
  course: string;
  totalFees: string;
  seats: string;
  startDate: string;
  endDate: string;
}

interface FeeItem {
  id: number;
  particular: string;
  amount: string;
  frequency: string;
  notes: string;
}

interface ScholarshipItem {
  id: number;
  title: string;
  subtitle: string;
  coverage: string;
  requirement: string;
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
  const [affiliation, setAffiliation] = useState("");
  const [estFee, setEstFee] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");

  const [eligibilityRows, setEligibilityRows] = useState<EligibilityRow[]>([]);
  const [admissionSteps, setAdmissionSteps] = useState<AdmissionStep[]>([]);
  const [subjectGroups, setSubjectGroups] = useState<SubjectGroup[]>([]);
  const [fullTimeCourses, setFullTimeCourses] = useState<FullTimeCourse[]>([]);
  const [feeItems, setFeeItems] = useState<FeeItem[]>([]);
  const [scholarshipDesc, setScholarshipDesc] = useState("");
  const [scholarships, setScholarships] = useState<ScholarshipItem[]>([]);
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
        if (res.fullTimeCourses)
          setFullTimeCourses(
            res.fullTimeCourses.map((x: any, i: number) => ({
              ...x,
              id: i + 1,
            })),
          );
        if (res.feeItems)
          setFeeItems(
            res.feeItems.map((x: any, i: number) => ({ ...x, id: i + 1 })),
          );
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

    if (selectedLevel === "Bachelor" || selectedLevel === "Master") {
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
    setDescription(normalized.description || "");
    setBannerUrl(normalized.bannerUrl || "");
    setAffiliation(normalized.affiliationName || normalized.nonUniversityAffiliation || "");

    if (normalized.eligibilityRows?.length) {
      setEligibilityRows(normalized.eligibilityRows.map((x: any, i: number) => ({ ...x, id: i + 1 })));
    }
    if (normalized.admissionSteps?.length) {
      setAdmissionSteps(normalized.admissionSteps.map((x: any, i: number) => ({ ...x, id: i + 1 })));
    }
    if (normalized.scholarships?.length) {
      setScholarships(normalized.scholarships.map((x: any, i: number) => ({ ...x, id: i + 1 })));
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
    if (normalized.fullTimeCourses?.length) {
      setFullTimeCourses(normalized.fullTimeCourses.map((x: any, i: number) => ({ ...x, id: i + 1 })));
    }
    if (normalized.feeItems?.length) {
      setFeeItems(normalized.feeItems.map((x: any, i: number) => ({ ...x, id: i + 1 })));
    }
    if (normalized.scholarshipDesc) {
      setScholarshipDesc(normalized.scholarshipDesc);
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
    eligibility: "",
    capacity: 0,
    whoShouldChoose: whoShouldChoose.map(({ id, ...rest }) => rest),
    features: features.map(({ id, ...rest }) => rest),
    fullTimeCourses: fullTimeCourses.map(({ id, ...rest }) => rest),
    feeItems: feeItems.map(({ id, ...rest }) => rest),
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
                <option value="+2">+2</option>
                <option value="A Level">A Level</option>
                <option value="CTEVT">CTEVT</option>
                <option value="Diploma">Diploma</option>
                <option value="Bachelor">Bachelor</option>
                <option value="Master">Master</option>
              </select>
            </div>

            {(selectedLevel === "Bachelor" || selectedLevel === "Master") && (
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

            {["+2", "A Level", "CTEVT", "Diploma"].includes(selectedLevel) && (
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
              <select
                className={selectClass}
                value={selectedCourseId}
                onChange={(e) => {
                  const course = globalCourses.find(c => c.id === Number(e.target.value));
                  if (course) selectGlobalCourse(course);
                }}
                disabled={loadingCourses || globalCourses.length === 0}
              >
                <option value="">{loadingCourses ? "Loading courses..." : globalCourses.length === 0 ? "No courses available" : "Select existing course (optional)"}</option>
                {globalCourses.map(course => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
              <input
                type="text"
                className={`${inputClass} ${selectedGlobalCourse ? "bg-gray-50" : ""} ${fieldError("title")}`}
                placeholder="e.g. 10+2 Science"
                value={selectedGlobalCourse ? selectedGlobalCourse.title : title}
                onChange={(e) => !selectedGlobalCourse && setTitle(e.target.value)}
                disabled={!!selectedGlobalCourse}
              />
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
                <label className={labelClass}>Field</label>
                <input
                  type="text"
                  className={`${inputClass} ${selectedGlobalCourse ? "bg-gray-50" : ""}`}
                  value={selectedGlobalCourse ? selectedGlobalCourse.field || "" : ""}
                  disabled
                />
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
          <SectionItemHeader
            icon="clipboard-check"
            title="Eligibility Criteria"
            subtitle="Define eligibility requirements"
            onAdd={() =>
              setEligibilityRows((prev) => [
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
            addLabel="Add Row"
          />
          <div className="p-6 space-y-6">
            {eligibilityRows.map((ec) => (
              <div
                key={ec.id}
                className="p-5 bg-gray-50 rounded-lg border border-gray-200 relative group"
              >
                <button
                  onClick={() =>
                    setEligibilityRows((prev) =>
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
                        setEligibilityRows((prev) =>
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
                    <label className={labelClass}>Stream/Faculty</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. Biology, Computer Science"
                      value={ec.stream}
                      onChange={(e) =>
                        setEligibilityRows((prev) =>
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
                      Eligibility (bullet points)
                    </label>
                    <div className="space-y-2">
                      {(ec.eligibility || []).map((item, ei) => (
                        <div key={ei} className="flex items-center gap-2">
                          <span className="text-gray-400 shrink-0">&bull;</span>
                          <input
                            type="text"
                            className={inputClass}
                            placeholder="e.g. Minimum 2.5 GPA"
                            value={item}
                            onChange={(e) =>
                              setEligibilityRows((prev) =>
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
                              setEligibilityRows((prev) =>
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
                          setEligibilityRows((prev) =>
                            prev.map((x) =>
                              x.id === ec.id
                                ? { ...x, eligibility: [...x.eligibility, ""] }
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
                        Add Item
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>
                      Required Documents (bullet points)
                    </label>
                    <div className="space-y-2">
                      {(ec.documents || []).map((item, di) => (
                        <div key={di} className="flex items-center gap-2">
                          <span className="text-gray-400 shrink-0">&bull;</span>
                          <input
                            type="text"
                            className={inputClass}
                            placeholder="e.g. SEE Mark Sheet"
                            value={item}
                            onChange={(e) =>
                              setEligibilityRows((prev) =>
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
                              setEligibilityRows((prev) =>
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
                          setEligibilityRows((prev) =>
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
                        </svg>{" "}
                        Add Item
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
          <SectionItemHeader
            icon="wallet"
            title="Program Fee"
            subtitle="Fee structure details"
            onAdd={() =>
              setFeeItems((prev) => [
                ...prev,
                {
                  id: nextId(prev),
                  particular: "",
                  amount: "",
                  frequency: "",
                  notes: "",
                },
              ])
            }
            addLabel="Add Fee Item"
          />
          <div className="p-6 space-y-4">
            {feeItems.map((fi) => (
              <div
                key={fi.id}
                className="p-5 bg-gray-50 rounded-lg border border-gray-200 relative group"
              >
                <button
                  onClick={() =>
                    setFeeItems((prev) => prev.filter((x) => x.id !== fi.id))
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pr-12">
                  <div>
                    <label className={labelClass}>Particulars</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. Admission Fee"
                      value={fi.particular}
                      onChange={(e) =>
                        setFeeItems((prev) =>
                          prev.map((x) =>
                            x.id === fi.id
                              ? { ...x, particular: e.target.value }
                              : x,
                          ),
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Amount (NPR)</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. 25,000"
                      value={fi.amount}
                      onChange={(e) =>
                        setFeeItems((prev) =>
                          prev.map((x) =>
                            x.id === fi.id
                              ? { ...x, amount: e.target.value }
                              : x,
                          ),
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Frequency</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. One-time, Yearly"
                      value={fi.frequency}
                      onChange={(e) =>
                        setFeeItems((prev) =>
                          prev.map((x) =>
                            x.id === fi.id
                              ? { ...x, frequency: e.target.value }
                              : x,
                          ),
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Notes</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="Optional notes"
                      value={fi.notes}
                      onChange={(e) =>
                        setFeeItems((prev) =>
                          prev.map((x) =>
                            x.id === fi.id
                              ? { ...x, notes: e.target.value }
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
