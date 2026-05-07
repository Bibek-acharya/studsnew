"use client";
import React, { useState, useRef } from "react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";
import {
  Plus,
  Image,
  Trash,
  FloppyDisk,
  CaretDown,
  CaretRight,
  Upload,
} from "@phosphor-icons/react";

const inputClass =
  "w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none";
const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

interface ProgramCard {
  id: number;
  icon: string;
  title: string;
  subtitle: string;
  status: string;
  description: string;
  streams: string;
  career: string;
}

interface FacilityCard {
  id: number;
  heading: string;
  description: string;
}

interface CourseCard {
  id: number;
  name: string;
  curriculumLink: string;
  totalFees: string;
  detailsLink: string;
  applicationDate: string;
  applyNowLink: string;
}

interface GalleryCard {
  id: number;
  heading: string;
  image: string;
}

interface DownloadCard {
  id: number;
  title: string;
  description: string;
  file: string;
}

interface FaqCard {
  id: number;
  question: string;
  answer: string;
}

interface ContactPerson {
  id: number;
  image: string;
  name: string;
  designation: string;
  number: string;
  email: string;
}

interface ScholarshipCard {
  id: number;
  name: string;
  detailsLink: string;
  level: string;
  stream: string;
  coverage: string;
  eligibility: string;
  seats: string;
}

interface EligibilityCriteria {
  id: number;
  level: string;
  streamFaculty: string;
  eligibility: string;
  requiredDocuments: string;
}

interface AdmissionStep {
  id: number;
  stepNumber: string;
  title: string;
  description: string;
}

const nextId = <T extends { id: number }>(items: T[]) =>
  Math.max(0, ...items.map((i) => i.id)) + 1;

const AdmissionCreatePage: React.FC = () => {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const toggleSection = (key: string) =>
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

  const [admissionImage, setAdmissionImage] = useState("");
  const [overviewText, setOverviewText] = useState("");

  const [programs, setPrograms] = useState<ProgramCard[]>([]);
  const [facilities, setFacilities] = useState<FacilityCard[]>([]);
  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [gallery, setGallery] = useState<GalleryCard[]>([]);
  const [downloads, setDownloads] = useState<DownloadCard[]>([]);

  const [contactAddress, setContactAddress] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMobile, setContactMobile] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactFacebook, setContactFacebook] = useState("");
  const [contactInstagram, setContactInstagram] = useState("");
  const [contactTiktok, setContactTiktok] = useState("");
  const [contactLinkedin, setContactLinkedin] = useState("");
  const [contactX, setContactX] = useState("");
  const [contactMap, setContactMap] = useState("");

  const [faqs, setFaqs] = useState<FaqCard[]>([]);
  const [contactPersons, setContactPersons] = useState<ContactPerson[]>([]);
  const [scholarships, setScholarships] = useState<ScholarshipCard[]>([]);

  const [eligibilityHeading, setEligibilityHeading] = useState("");
  const [eligibilitySubheading, setEligibilitySubheading] = useState("");
  const [eligibilityCriteria, setEligibilityCriteria] = useState<EligibilityCriteria[]>([]);

  const [processHeading, setProcessHeading] = useState("");
  const [processSubheading, setProcessSubheading] = useState("");
  const [admissionSteps, setAdmissionSteps] = useState<AdmissionStep[]>([]);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (v: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) setter(URL.createObjectURL(file));
  };

  const CollapseIcon = ({ sectionKey }: { sectionKey: string }) => {
    const open = !collapsed[sectionKey];
    return open ? (
      <CaretDown weight="bold" className="text-gray-400" />
    ) : (
      <CaretRight weight="bold" className="text-gray-400" />
    );
  };

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
          <button
            onClick={() => toggleSection("overview")}
            className="w-full bg-gray-50/50 px-6 py-4 border-b border-gray-200 flex items-center justify-between"
          >
            <h2 className="text-base font-semibold text-gray-800">
              Admissions Overview
            </h2>
            <CollapseIcon sectionKey="overview" />
          </button>
          {!collapsed["overview"] && (
            <div className="p-6 space-y-4">
              <div>
                <label className={labelClass}>Admission Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center">
                  {admissionImage ? (
                    <div className="relative">
                      <img
                        src={admissionImage}
                        alt="Preview"
                        className="max-h-48 rounded-lg"
                      />
                      <button
                        onClick={() => setAdmissionImage("")}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600"
                      >
                        <Trash weight="bold" className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload
                        weight="bold"
                        className="w-10 h-10 text-gray-400 mb-2"
                      />
                      <p className="text-sm text-gray-500">
                        Drag & drop or click to upload
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, setAdmissionImage)}
                    className="mt-3 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Overview Description</label>
                <textarea
                  rows={4}
                  value={overviewText}
                  onChange={(e) => setOverviewText(e.target.value)}
                  placeholder="Enter admission overview description..."
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          )}
        </div>

        {/* 2. Our Programs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <button
            onClick={() => toggleSection("programs")}
            className="w-full bg-gray-50/50 px-6 py-4 border-b border-gray-200 flex items-center justify-between"
          >
            <h2 className="text-base font-semibold text-gray-800">
              Our Programs
            </h2>
            <CollapseIcon sectionKey="programs" />
          </button>
          {!collapsed["programs"] && (
            <div className="p-6 space-y-4">
              <button
                onClick={() =>
                  setPrograms((prev) => [
                    ...prev,
                    {
                      id: nextId(prev),
                      icon: "",
                      title: "",
                      subtitle: "",
                      status: "",
                      description: "",
                      streams: "",
                      career: "",
                    },
                  ])
                }
                className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 flex items-center gap-1.5"
              >
                <Plus weight="bold" className="w-4 h-4" /> Add Program
              </button>
              <div className="space-y-4">
                {programs.map((p) => (
                  <div
                    key={p.id}
                    className="bg-gray-50 rounded-lg border border-gray-200 p-5 space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg w-16 h-16 flex items-center justify-center">
                        {p.icon ? (
                          <img
                            src={p.icon}
                            alt=""
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Image
                            weight="bold"
                            className="w-6 h-6 text-gray-400"
                          />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setPrograms((prev) =>
                                prev.map((x) =>
                                  x.id === p.id
                                    ? { ...x, icon: URL.createObjectURL(file) }
                                    : x
                                )
                              );
                            }
                          }}
                          className="hidden"
                          id={`program-icon-${p.id}`}
                        />
                      </div>
                      <label
                        htmlFor={`program-icon-${p.id}`}
                        className="text-xs text-blue-600 cursor-pointer hover:underline"
                      >
                        Upload Icon
                      </label>
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <input
                          placeholder="Program Title"
                          value={p.title}
                          onChange={(e) =>
                            setPrograms((prev) =>
                              prev.map((x) =>
                                x.id === p.id
                                  ? { ...x, title: e.target.value }
                                  : x
                              )
                            )
                          }
                          className={inputClass}
                        />
                        <input
                          placeholder="Subtitle"
                          value={p.subtitle}
                          onChange={(e) =>
                            setPrograms((prev) =>
                              prev.map((x) =>
                                x.id === p.id
                                  ? { ...x, subtitle: e.target.value }
                                  : x
                              )
                            )
                          }
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={p.status}
                        onChange={(e) =>
                          setPrograms((prev) =>
                            prev.map((x) =>
                              x.id === p.id
                                ? { ...x, status: e.target.value }
                                : x
                            )
                          )
                        }
                        className={`${inputClass} w-40`}
                      >
                        <option value="">Select Status</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Closed">Closed</option>
                      </select>
                      {p.status && (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            p.status === "Ongoing"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {p.status}
                        </span>
                      )}
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Short Description"
                      value={p.description}
                      onChange={(e) =>
                        setPrograms((prev) =>
                          prev.map((x) =>
                            x.id === p.id
                              ? { ...x, description: e.target.value }
                              : x
                          )
                        )
                      }
                      className={`${inputClass} resize-none`}
                    />
                    <textarea
                      rows={2}
                      placeholder="Available Streams (comma separated)"
                      value={p.streams}
                      onChange={(e) =>
                        setPrograms((prev) =>
                          prev.map((x) =>
                            x.id === p.id
                              ? { ...x, streams: e.target.value }
                              : x
                          )
                        )
                      }
                      className={`${inputClass} resize-none`}
                    />
                    <textarea
                      rows={2}
                      placeholder="Career Options (comma separated)"
                      value={p.career}
                      onChange={(e) =>
                        setPrograms((prev) =>
                          prev.map((x) =>
                            x.id === p.id
                              ? { ...x, career: e.target.value }
                              : x
                          )
                        )
                      }
                      className={`${inputClass} resize-none`}
                    />
                    <button
                      onClick={() =>
                        setPrograms((prev) =>
                          prev.filter((x) => x.id !== p.id)
                        )
                      }
                      className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                    >
                      <Trash weight="bold" className="w-4 h-4" /> Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. Our Facilities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <button
            onClick={() => toggleSection("facilities")}
            className="w-full bg-gray-50/50 px-6 py-4 border-b border-gray-200 flex items-center justify-between"
          >
            <h2 className="text-base font-semibold text-gray-800">
              Our Facilities
            </h2>
            <CollapseIcon sectionKey="facilities" />
          </button>
          {!collapsed["facilities"] && (
            <div className="p-6 space-y-4">
              <div>
                <label className={labelClass}>Section Heading</label>
                <input placeholder="e.g. World-Class Facilities" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Section Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief description of facilities section..."
                  className={`${inputClass} resize-none`}
                />
              </div>
              <button
                onClick={() =>
                  setFacilities((prev) => [
                    ...prev,
                    { id: nextId(prev), heading: "", description: "" },
                  ])
                }
                className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 flex items-center gap-1.5"
              >
                <Plus weight="bold" className="w-4 h-4" /> Add Facility
              </button>
              <div className="space-y-3">
                {facilities.map((f) => (
                  <div
                    key={f.id}
                    className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex gap-3 items-start"
                  >
                    <div className="flex-1 space-y-2">
                      <input
                        placeholder="Facility Heading"
                        value={f.heading}
                        onChange={(e) =>
                          setFacilities((prev) =>
                            prev.map((x) =>
                              x.id === f.id
                                ? { ...x, heading: e.target.value }
                                : x
                            )
                          )
                        }
                        className={inputClass}
                      />
                      <textarea
                        rows={2}
                        placeholder="Facility Description"
                        value={f.description}
                        onChange={(e) =>
                          setFacilities((prev) =>
                            prev.map((x) =>
                              x.id === f.id
                                ? { ...x, description: e.target.value }
                                : x
                            )
                          )
                        }
                        className={`${inputClass} resize-none`}
                      />
                    </div>
                    <button
                      onClick={() =>
                        setFacilities((prev) =>
                          prev.filter((x) => x.id !== f.id)
                        )
                      }
                      className="text-red-400 hover:text-red-600 p-2"
                    >
                      <Trash weight="bold" className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. Courses and Fees */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <button
            onClick={() => toggleSection("courses")}
            className="w-full bg-gray-50/50 px-6 py-4 border-b border-gray-200 flex items-center justify-between"
          >
            <h2 className="text-base font-semibold text-gray-800">
              Courses and Fees
            </h2>
            <CollapseIcon sectionKey="courses" />
          </button>
          {!collapsed["courses"] && (
            <div className="p-6 space-y-4">
              <button
                onClick={() =>
                  setCourses((prev) => [
                    ...prev,
                    {
                      id: nextId(prev),
                      name: "",
                      curriculumLink: "",
                      totalFees: "",
                      detailsLink: "",
                      applicationDate: "",
                      applyNowLink: "",
                    },
                  ])
                }
                className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 flex items-center gap-1.5"
              >
                <Plus weight="bold" className="w-4 h-4" /> Add Course
              </button>
              <div className="space-y-4">
                {courses.map((c) => (
                  <div
                    key={c.id}
                    className="bg-gray-50 rounded-lg border border-gray-200 p-5"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className={labelClass}>Course Name</label>
                        <input
                          placeholder="e.g. BSc. CSIT"
                          value={c.name}
                          onChange={(e) =>
                            setCourses((prev) =>
                              prev.map((x) =>
                                x.id === c.id
                                  ? { ...x, name: e.target.value }
                                  : x
                              )
                            )
                          }
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Curriculum Link</label>
                        <input
                          placeholder="URL to curriculum PDF"
                          value={c.curriculumLink}
                          onChange={(e) =>
                            setCourses((prev) =>
                              prev.map((x) =>
                                x.id === c.id
                                  ? { ...x, curriculumLink: e.target.value }
                                  : x
                              )
                            )
                          }
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Total Fees</label>
                        <input
                          placeholder="e.g. NPR 4,50,000"
                          value={c.totalFees}
                          onChange={(e) =>
                            setCourses((prev) =>
                              prev.map((x) =>
                                x.id === c.id
                                  ? { ...x, totalFees: e.target.value }
                                  : x
                              )
                            )
                          }
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Details Link</label>
                        <input
                          placeholder="URL to course details page"
                          value={c.detailsLink}
                          onChange={(e) =>
                            setCourses((prev) =>
                              prev.map((x) =>
                                x.id === c.id
                                  ? { ...x, detailsLink: e.target.value }
                                  : x
                              )
                            )
                          }
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Application Date</label>
                        <input
                          type="date"
                          value={c.applicationDate}
                          onChange={(e) =>
                            setCourses((prev) =>
                              prev.map((x) =>
                                x.id === c.id
                                  ? { ...x, applicationDate: e.target.value }
                                  : x
                              )
                            )
                          }
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Apply Now Link</label>
                        <input
                          placeholder="URL to apply"
                          value={c.applyNowLink}
                          onChange={(e) =>
                            setCourses((prev) =>
                              prev.map((x) =>
                                x.id === c.id
                                  ? { ...x, applyNowLink: e.target.value }
                                  : x
                              )
                            )
                          }
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setCourses((prev) =>
                          prev.filter((x) => x.id !== c.id)
                        )
                      }
                      className="mt-4 text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                    >
                      <Trash weight="bold" className="w-4 h-4" /> Remove Course
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 5. Photo Gallery */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <button
            onClick={() => toggleSection("gallery")}
            className="w-full bg-gray-50/50 px-6 py-4 border-b border-gray-200 flex items-center justify-between"
          >
            <h2 className="text-base font-semibold text-gray-800">
              Photo Gallery
            </h2>
            <CollapseIcon sectionKey="gallery" />
          </button>
          {!collapsed["gallery"] && (
            <div className="p-6 space-y-4">
              <div>
                <label className={labelClass}>Section Heading</label>
                <input placeholder="e.g. Campus Life Gallery" className={inputClass} />
              </div>
              <button
                onClick={() =>
                  setGallery((prev) => [
                    ...prev,
                    { id: nextId(prev), heading: "", image: "" },
                  ])
                }
                className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 flex items-center gap-1.5"
              >
                <Plus weight="bold" className="w-4 h-4" /> Add Image
              </button>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {gallery.map((g) => (
                  <div
                    key={g.id}
                    className="bg-gray-50 rounded-lg border border-gray-200 p-4"
                  >
                    <input
                      placeholder="Image Heading"
                      value={g.heading}
                      onChange={(e) =>
                        setGallery((prev) =>
                          prev.map((x) =>
                            x.id === g.id
                              ? { ...x, heading: e.target.value }
                              : x
                          )
                        )
                      }
                      className={`${inputClass} mb-3`}
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center">
                      {g.image ? (
                        <div className="relative">
                          <img
                            src={g.image}
                            alt=""
                            className="max-h-32 rounded-lg"
                          />
                          <button
                            onClick={() =>
                              setGallery((prev) =>
                                prev.map((x) =>
                                  x.id === g.id ? { ...x, image: "" } : x
                                )
                              )
                            }
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                          >
                            <Trash weight="bold" className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload
                            weight="bold"
                            className="w-8 h-8 text-gray-400 mb-1"
                          />
                          <p className="text-xs text-gray-500">Upload Image</p>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setGallery((prev) =>
                              prev.map((x) =>
                                x.id === g.id
                                  ? { ...x, image: URL.createObjectURL(file) }
                                  : x
                              )
                            );
                          }
                        }}
                        className="mt-2 text-xs"
                      />
                    </div>
                    <button
                      onClick={() =>
                        setGallery((prev) =>
                          prev.filter((x) => x.id !== g.id)
                        )
                      }
                      className="mt-3 text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                    >
                      <Trash weight="bold" className="w-4 h-4" /> Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 6. Downloads */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <button
            onClick={() => toggleSection("downloads")}
            className="w-full bg-gray-50/50 px-6 py-4 border-b border-gray-200 flex items-center justify-between"
          >
            <h2 className="text-base font-semibold text-gray-800">
              Downloads
            </h2>
            <CollapseIcon sectionKey="downloads" />
          </button>
          {!collapsed["downloads"] && (
            <div className="p-6 space-y-4">
              <button
                onClick={() =>
                  setDownloads((prev) => [
                    ...prev,
                    { id: nextId(prev), title: "", description: "", file: "" },
                  ])
                }
                className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 flex items-center gap-1.5"
              >
                <Plus weight="bold" className="w-4 h-4" /> Add Download
              </button>
              <div className="space-y-3">
                {downloads.map((d) => (
                  <div
                    key={d.id}
                    className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex gap-3 items-start"
                  >
                    <div className="flex-1 space-y-2">
                      <input
                        placeholder="Document Title"
                        value={d.title}
                        onChange={(e) =>
                          setDownloads((prev) =>
                            prev.map((x) =>
                              x.id === d.id
                                ? { ...x, title: e.target.value }
                                : x
                            )
                          )
                        }
                        className={inputClass}
                      />
                      <textarea
                        rows={2}
                        placeholder="Description (optional)"
                        value={d.description}
                        onChange={(e) =>
                          setDownloads((prev) =>
                            prev.map((x) =>
                              x.id === d.id
                                ? { ...x, description: e.target.value }
                                : x
                            )
                          )
                        }
                        className={`${inputClass} resize-none`}
                      />
                      <input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setDownloads((prev) =>
                              prev.map((x) =>
                                x.id === d.id
                                  ? { ...x, file: file.name }
                                  : x
                              )
                            );
                          }
                        }}
                        className="text-sm"
                      />
                      {d.file && (
                        <p className="text-xs text-green-600">
                          Selected: {d.file}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() =>
                        setDownloads((prev) =>
                          prev.filter((x) => x.id !== d.id)
                        )
                      }
                      className="text-red-400 hover:text-red-600 p-2"
                    >
                      <Trash weight="bold" className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 7. Contact Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <button
            onClick={() => toggleSection("contact")}
            className="w-full bg-gray-50/50 px-6 py-4 border-b border-gray-200 flex items-center justify-between"
          >
            <h2 className="text-base font-semibold text-gray-800">
              Contact Information
            </h2>
            <CollapseIcon sectionKey="contact" />
          </button>
          {!collapsed["contact"] && (
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Address</label>
                  <input
                    placeholder="Full address"
                    value={contactAddress}
                    onChange={(e) => setContactAddress(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input
                    placeholder="01-123456"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Mobile</label>
                  <input
                    placeholder="98XXXXXXXX"
                    value={contactMobile}
                    onChange={(e) => setContactMobile(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    placeholder="info@college.edu.np"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Facebook</label>
                  <input
                    placeholder="https://facebook.com/..."
                    value={contactFacebook}
                    onChange={(e) => setContactFacebook(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Instagram</label>
                  <input
                    placeholder="https://instagram.com/..."
                    value={contactInstagram}
                    onChange={(e) => setContactInstagram(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>TikTok</label>
                  <input
                    placeholder="https://tiktok.com/..."
                    value={contactTiktok}
                    onChange={(e) => setContactTiktok(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>LinkedIn</label>
                  <input
                    placeholder="https://linkedin.com/..."
                    value={contactLinkedin}
                    onChange={(e) => setContactLinkedin(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>X (Twitter)</label>
                  <input
                    placeholder="https://x.com/..."
                    value={contactX}
                    onChange={(e) => setContactX(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Map Upload</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center">
                    {contactMap ? (
                      <div className="relative">
                        <img
                          src={contactMap}
                          alt="Map"
                          className="max-h-32 rounded-lg"
                        />
                        <button
                          onClick={() => setContactMap("")}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        >
                          <Trash weight="bold" className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload
                          weight="bold"
                          className="w-8 h-8 text-gray-400 mb-1"
                        />
                        <p className="text-xs text-gray-500">
                          Upload Map Image
                        </p>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, setContactMap)}
                      className="mt-2 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 8. FAQ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <button
            onClick={() => toggleSection("faq")}
            className="w-full bg-gray-50/50 px-6 py-4 border-b border-gray-200 flex items-center justify-between"
          >
            <h2 className="text-base font-semibold text-gray-800">FAQ</h2>
            <CollapseIcon sectionKey="faq" />
          </button>
          {!collapsed["faq"] && (
            <div className="p-6 space-y-4">
              <button
                onClick={() =>
                  setFaqs((prev) => [
                    ...prev,
                    { id: nextId(prev), question: "", answer: "" },
                  ])
                }
                className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 flex items-center gap-1.5"
              >
                <Plus weight="bold" className="w-4 h-4" /> Add FAQ
              </button>
              <div className="space-y-3">
                {faqs.map((f) => (
                  <div
                    key={f.id}
                    className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex gap-3 items-start"
                  >
                    <div className="flex-1 space-y-2">
                      <input
                        placeholder="Question"
                        value={f.question}
                        onChange={(e) =>
                          setFaqs((prev) =>
                            prev.map((x) =>
                              x.id === f.id
                                ? { ...x, question: e.target.value }
                                : x
                            )
                          )
                        }
                        className={inputClass}
                      />
                      <textarea
                        rows={2}
                        placeholder="Answer"
                        value={f.answer}
                        onChange={(e) =>
                          setFaqs((prev) =>
                            prev.map((x) =>
                              x.id === f.id
                                ? { ...x, answer: e.target.value }
                                : x
                            )
                          )
                        }
                        className={`${inputClass} resize-none`}
                      />
                    </div>
                    <button
                      onClick={() =>
                        setFaqs((prev) => prev.filter((x) => x.id !== f.id))
                      }
                      className="text-red-400 hover:text-red-600 p-2"
                    >
                      <Trash weight="bold" className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 9. Key Contact Persons */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <button
            onClick={() => toggleSection("contactPersons")}
            className="w-full bg-gray-50/50 px-6 py-4 border-b border-gray-200 flex items-center justify-between"
          >
            <h2 className="text-base font-semibold text-gray-800">
              Key Contact Persons
            </h2>
            <CollapseIcon sectionKey="contactPersons" />
          </button>
          {!collapsed["contactPersons"] && (
            <div className="p-6 space-y-4">
              <button
                onClick={() =>
                  setContactPersons((prev) => [
                    ...prev,
                    {
                      id: nextId(prev),
                      image: "",
                      name: "",
                      designation: "",
                      number: "",
                      email: "",
                    },
                  ])
                }
                className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 flex items-center gap-1.5"
              >
                <Plus weight="bold" className="w-4 h-4" /> Add Contact Person
              </button>
              <div className="space-y-4">
                {contactPersons.map((cp) => (
                  <div
                    key={cp.id}
                    className="bg-gray-50 rounded-lg border border-gray-200 p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-full w-16 h-16 flex items-center justify-center shrink-0">
                        {cp.image ? (
                          <img
                            src={cp.image}
                            alt=""
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <Upload
                            weight="bold"
                            className="w-5 h-5 text-gray-400"
                          />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setContactPersons((prev) =>
                                prev.map((x) =>
                                  x.id === cp.id
                                    ? { ...x, image: URL.createObjectURL(file) }
                                    : x
                                )
                              );
                            }
                          }}
                          className="hidden"
                          id={`contact-image-${cp.id}`}
                        />
                      </div>
                      <label
                        htmlFor={`contact-image-${cp.id}`}
                        className="text-xs text-blue-600 cursor-pointer hover:underline self-center"
                      >
                        Upload Photo
                      </label>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          placeholder="Full Name"
                          value={cp.name}
                          onChange={(e) =>
                            setContactPersons((prev) =>
                              prev.map((x) =>
                                x.id === cp.id
                                  ? { ...x, name: e.target.value }
                                  : x
                              )
                            )
                          }
                          className={inputClass}
                        />
                        <input
                          placeholder="Designation"
                          value={cp.designation}
                          onChange={(e) =>
                            setContactPersons((prev) =>
                              prev.map((x) =>
                                x.id === cp.id
                                  ? { ...x, designation: e.target.value }
                                  : x
                              )
                            )
                          }
                          className={inputClass}
                        />
                        <input
                          placeholder="Phone Number"
                          value={cp.number}
                          onChange={(e) =>
                            setContactPersons((prev) =>
                              prev.map((x) =>
                                x.id === cp.id
                                  ? { ...x, number: e.target.value }
                                  : x
                              )
                            )
                          }
                          className={inputClass}
                        />
                        <input
                          placeholder="Email Address"
                          value={cp.email}
                          onChange={(e) =>
                            setContactPersons((prev) =>
                              prev.map((x) =>
                                x.id === cp.id
                                  ? { ...x, email: e.target.value }
                                  : x
                              )
                            )
                          }
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setContactPersons((prev) =>
                          prev.filter((x) => x.id !== cp.id)
                        )
                      }
                      className="mt-3 text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                    >
                      <Trash weight="bold" className="w-4 h-4" /> Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 10. Scholarships Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <button
            onClick={() => toggleSection("scholarships")}
            className="w-full bg-gray-50/50 px-6 py-4 border-b border-gray-200 flex items-center justify-between"
          >
            <h2 className="text-base font-semibold text-gray-800">
              Scholarships Overview
            </h2>
            <CollapseIcon sectionKey="scholarships" />
          </button>
          {!collapsed["scholarships"] && (
            <div className="p-6 space-y-4">
              <button
                onClick={() =>
                  setScholarships((prev) => [
                    ...prev,
                    {
                      id: nextId(prev),
                      name: "",
                      detailsLink: "",
                      level: "",
                      stream: "",
                      coverage: "",
                      eligibility: "",
                      seats: "",
                    },
                  ])
                }
                className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 flex items-center gap-1.5"
              >
                <Plus weight="bold" className="w-4 h-4" /> Add Scholarship
              </button>
              <div className="space-y-4">
                {scholarships.map((s) => (
                  <div
                    key={s.id}
                    className="bg-gray-50 rounded-lg border border-gray-200 p-5"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className={labelClass}>Scholarship Name</label>
                        <input
                          placeholder="e.g. Merit Scholarship"
                          value={s.name}
                          onChange={(e) =>
                            setScholarships((prev) =>
                              prev.map((x) =>
                                x.id === s.id
                                  ? { ...x, name: e.target.value }
                                  : x
                              )
                            )
                          }
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Details Link</label>
                        <input
                          placeholder="URL to details"
                          value={s.detailsLink}
                          onChange={(e) =>
                            setScholarships((prev) =>
                              prev.map((x) =>
                                x.id === s.id
                                  ? { ...x, detailsLink: e.target.value }
                                  : x
                              )
                            )
                          }
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Level</label>
                        <input
                          placeholder="e.g. Bachelor"
                          value={s.level}
                          onChange={(e) =>
                            setScholarships((prev) =>
                              prev.map((x) =>
                                x.id === s.id
                                  ? { ...x, level: e.target.value }
                                  : x
                              )
                            )
                          }
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Stream</label>
                        <input
                          placeholder="e.g. Science"
                          value={s.stream}
                          onChange={(e) =>
                            setScholarships((prev) =>
                              prev.map((x) =>
                                x.id === s.id
                                  ? { ...x, stream: e.target.value }
                                  : x
                              )
                            )
                          }
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Coverage</label>
                        <input
                          placeholder="e.g. 100% Tuition"
                          value={s.coverage}
                          onChange={(e) =>
                            setScholarships((prev) =>
                              prev.map((x) =>
                                x.id === s.id
                                  ? { ...x, coverage: e.target.value }
                                  : x
                              )
                            )
                          }
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Eligibility</label>
                        <input
                          placeholder="e.g. GPA 3.6+"
                          value={s.eligibility}
                          onChange={(e) =>
                            setScholarships((prev) =>
                              prev.map((x) =>
                                x.id === s.id
                                  ? { ...x, eligibility: e.target.value }
                                  : x
                              )
                            )
                          }
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Seats</label>
                        <input
                          placeholder="e.g. 10"
                          value={s.seats}
                          onChange={(e) =>
                            setScholarships((prev) =>
                              prev.map((x) =>
                                x.id === s.id
                                  ? { ...x, seats: e.target.value }
                                  : x
                              )
                            )
                          }
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setScholarships((prev) =>
                          prev.filter((x) => x.id !== s.id)
                        )
                      }
                      className="mt-4 text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                    >
                      <Trash weight="bold" className="w-4 h-4" /> Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 11. Eligibility Criteria */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <button
            onClick={() => toggleSection("eligibility")}
            className="w-full bg-gray-50/50 px-6 py-4 border-b border-gray-200 flex items-center justify-between"
          >
            <h2 className="text-base font-semibold text-gray-800">
              Eligibility Criteria
            </h2>
            <CollapseIcon sectionKey="eligibility" />
          </button>
          {!collapsed["eligibility"] && (
            <div className="p-6 space-y-4">
              <div>
                <label className={labelClass}>Section Heading</label>
                <input
                  placeholder="e.g. Eligibility Requirements"
                  value={eligibilityHeading}
                  onChange={(e) => setEligibilityHeading(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Sub-heading</label>
                <input
                  placeholder="e.g. Please check the criteria before applying"
                  value={eligibilitySubheading}
                  onChange={(e) => setEligibilitySubheading(e.target.value)}
                  className={inputClass}
                />
              </div>
              <button
                onClick={() =>
                  setEligibilityCriteria((prev) => [
                    ...prev,
                    {
                      id: nextId(prev),
                      level: "",
                      streamFaculty: "",
                      eligibility: "",
                      requiredDocuments: "",
                    },
                  ])
                }
                className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 flex items-center gap-1.5"
              >
                <Plus weight="bold" className="w-4 h-4" /> Add Criteria
              </button>
              <div className="space-y-3">
                {eligibilityCriteria.map((ec) => (
                  <div
                    key={ec.id}
                    className="bg-gray-50 rounded-lg border border-gray-200 p-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        placeholder="Level"
                        value={ec.level}
                        onChange={(e) =>
                          setEligibilityCriteria((prev) =>
                            prev.map((x) =>
                              x.id === ec.id
                                ? { ...x, level: e.target.value }
                                : x
                            )
                          )
                        }
                        className={inputClass}
                      />
                      <input
                        placeholder="Stream / Faculty"
                        value={ec.streamFaculty}
                        onChange={(e) =>
                          setEligibilityCriteria((prev) =>
                            prev.map((x) =>
                              x.id === ec.id
                                ? { ...x, streamFaculty: e.target.value }
                                : x
                            )
                          )
                        }
                        className={inputClass}
                      />
                      <textarea
                        rows={2}
                        placeholder="Eligibility Details"
                        value={ec.eligibility}
                        onChange={(e) =>
                          setEligibilityCriteria((prev) =>
                            prev.map((x) =>
                              x.id === ec.id
                                ? { ...x, eligibility: e.target.value }
                                : x
                            )
                          )
                        }
                        className={`${inputClass} resize-none`}
                      />
                      <textarea
                        rows={2}
                        placeholder="Required Documents"
                        value={ec.requiredDocuments}
                        onChange={(e) =>
                          setEligibilityCriteria((prev) =>
                            prev.map((x) =>
                              x.id === ec.id
                                ? {
                                    ...x,
                                    requiredDocuments: e.target.value,
                                  }
                                : x
                            )
                          )
                        }
                        className={`${inputClass} resize-none`}
                      />
                    </div>
                    <button
                      onClick={() =>
                        setEligibilityCriteria((prev) =>
                          prev.filter((x) => x.id !== ec.id)
                        )
                      }
                      className="mt-3 text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                    >
                      <Trash weight="bold" className="w-4 h-4" /> Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 12. Admission Process */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <button
            onClick={() => toggleSection("process")}
            className="w-full bg-gray-50/50 px-6 py-4 border-b border-gray-200 flex items-center justify-between"
          >
            <h2 className="text-base font-semibold text-gray-800">
              Admission Process
            </h2>
            <CollapseIcon sectionKey="process" />
          </button>
          {!collapsed["process"] && (
            <div className="p-6 space-y-4">
              <div>
                <label className={labelClass}>Section Heading</label>
                <input
                  placeholder="e.g. How to Apply"
                  value={processHeading}
                  onChange={(e) => setProcessHeading(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Sub-heading</label>
                <input
                  placeholder="e.g. Follow these simple steps to complete your application"
                  value={processSubheading}
                  onChange={(e) => setProcessSubheading(e.target.value)}
                  className={inputClass}
                />
              </div>
              <button
                onClick={() =>
                  setAdmissionSteps((prev) => [
                    ...prev,
                    {
                      id: nextId(prev),
                      stepNumber: "",
                      title: "",
                      description: "",
                    },
                  ])
                }
                className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 flex items-center gap-1.5"
              >
                <Plus weight="bold" className="w-4 h-4" /> Add Step
              </button>
              <div className="space-y-3">
                {admissionSteps.map((step) => (
                  <div
                    key={step.id}
                    className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex gap-3 items-start"
                  >
                    <div className="w-12 shrink-0">
                      <input
                        placeholder="No."
                        value={step.stepNumber}
                        onChange={(e) =>
                          setAdmissionSteps((prev) =>
                            prev.map((x) =>
                              x.id === step.id
                                ? { ...x, stepNumber: e.target.value }
                                : x
                            )
                          )
                        }
                        className={`${inputClass} text-center`}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        placeholder="Step Title"
                        value={step.title}
                        onChange={(e) =>
                          setAdmissionSteps((prev) =>
                            prev.map((x) =>
                              x.id === step.id
                                ? { ...x, title: e.target.value }
                                : x
                            )
                          )
                        }
                        className={inputClass}
                      />
                      <textarea
                        rows={2}
                        placeholder="Step Description"
                        value={step.description}
                        onChange={(e) =>
                          setAdmissionSteps((prev) =>
                            prev.map((x) =>
                              x.id === step.id
                                ? { ...x, description: e.target.value }
                                : x
                            )
                          )
                        }
                        className={`${inputClass} resize-none`}
                      />
                    </div>
                    <button
                      onClick={() =>
                        setAdmissionSteps((prev) =>
                          prev.filter((x) => x.id !== step.id)
                        )
                      }
                      className="text-red-400 hover:text-red-600 p-2"
                    >
                      <Trash weight="bold" className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-1.5">
            <FloppyDisk weight="bold" className="w-4 h-4" /> Save as Draft
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            Publish Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdmissionCreatePage;
