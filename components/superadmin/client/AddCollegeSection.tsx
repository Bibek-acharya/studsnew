"use client";

import React, { useState, useRef, useCallback } from "react";
import RichTextEditor from "@/components/ScholarshipProvider/common/RichTextEditor";
import ImageCropperModal from "@/components/ScholarshipProvider/common/ImageCropperModal";
import { NEPAL_DISTRICTS } from "@/lib/location-data";

interface VideoItem { id: number; url: string; message: string; name: string; designation: string; }
interface OverviewRow { id: number; key: string; value: string; }
interface LeadershipRow { id: number; position: string; role: string; holder: string; }
interface CourseRow { id: number; name: string; duration: string; fees: string; eligibility: string; }
interface FacilityRow { id: number; icon: string; heading: string; desc: string; }
interface AlumniRow { id: number; photo: string; name: string; job: string; batch: string; linkedin: string; }
interface GalleryItem { id: number; url: string; }
interface DownloadItem { id: number; name: string; file: string; }

const DISTRICTS = Object.values(NEPAL_DISTRICTS).flat();

const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors";

export default function AddCollegeSection({
  setActiveSection,
}: {
  setActiveSection: (s: string) => void;
}) {
  const [collegeName, setCollegeName] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [level, setLevel] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [about, setAbout] = useState("");
  const [vision, setVision] = useState("");
  const [mission, setMission] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [overviewRows, setOverviewRows] = useState<OverviewRow[]>([]);
  const [leadershipRows, setLeadershipRows] = useState<LeadershipRow[]>([]);
  const [courses, setCourses] = useState<CourseRow[]>([]);

  const [facilities, setFacilities] = useState<FacilityRow[]>([]);
  const [alumni, setAlumni] = useState<AlumniRow[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locationFilter, setLocationFilter] = useState("");
  const locationRef = useRef<HTMLDivElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const filteredDistricts = DISTRICTS.filter(d => d.toLowerCase().includes(locationFilter.toLowerCase()));

  const getToken = () => localStorage.getItem("superadmin_token");
  const apiBase = () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const api = async (path: string, options?: RequestInit) => {
    const base = apiBase();
    const token = getToken();
    const res = await fetch(`${base}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || `API error: ${res.status}`);
    }
    return res.json();
  };

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const base = apiBase();
    const token = getToken();
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${base}/api/v1/superadmin/upload?folder=${folder}`, {
      method: "POST",
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: formData,
    });
    if (!res.ok) throw new Error(`Upload error: ${res.status}`);
    const data = await res.json();
    const path = data?.data?.url || "";
    return path.startsWith("http") ? path : `${apiBase()}${path}`;
  };

  const addItem = <T extends { id: number }>(setter: React.Dispatch<React.SetStateAction<T[]>>, defaultItem: Omit<T, 'id'>) => {
    setter(prev => [...prev, { ...defaultItem, id: Date.now() } as unknown as T]);
  };
  const removeItem = <T extends { id: number }>(setter: React.Dispatch<React.SetStateAction<T[]>>, id: number) => {
    setter(prev => prev.filter(x => x.id !== id));
  };
  const updateItem = (setter: any, id: number, field: string, value: string) => {
    setter((prev: any[]) => prev.map(x => x.id === id ? { ...x, [field]: value } : x));
  };

  const handleBannerCrop = useCallback((croppedBlob: Blob) => {
    const croppedFile = new File([croppedBlob], bannerFile?.name || "banner.jpg", { type: "image/jpeg" });
    setBannerFile(croppedFile);
    const reader = new FileReader();
    reader.onload = ev => { if (ev.target?.result) setBannerUrl(ev.target.result as string); };
    reader.readAsDataURL(croppedBlob);
    setCropperOpen(false);
    setCropImageSrc(null);
  }, [bannerFile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess(false);
    try {
      setSaving(true);
      let finalLogoUrl = logoUrl;
      let finalBannerUrl = bannerUrl;
      if (logoFile) {
        try { finalLogoUrl = await uploadFile(logoFile, "institution/logo"); } catch {}
      }
      if (bannerFile) {
        try { finalBannerUrl = await uploadFile(bannerFile, "institution/banner"); } catch {}
      }
      const body = {
        institution_name: collegeName,
        location,
        website,
        level,
        affiliation,
        logo_url: finalLogoUrl.startsWith("data:") ? "" : finalLogoUrl,
        banner_url: finalBannerUrl.startsWith("data:") ? "" : finalBannerUrl,
        about, vision, mission,
        videos: videos.map(({ id, ...rest }) => rest),
        overview_data: overviewRows.map(({ id, ...rest }) => rest),
        leadership_data: leadershipRows.map(({ id, ...rest }) => rest),
        courses_data: courses.map(({ id, ...rest }) => rest),
        facilities_data: facilities.map(({ id, ...rest }) => rest),
        alumni_data: alumni.map(({ id, ...rest }) => rest),
        gallery_data: gallery.map(({ id, ...rest }) => rest),
        downloads_data: downloads.map(({ id, ...rest }) => rest),
      };
      await api("/api/v1/superadmin/institutions", {
        method: "POST",
        body: JSON.stringify(body),
      });
      setFormSuccess(true);
      setFormError("");
      setTimeout(() => setActiveSection("manage-college"), 1500);
    } catch (err: any) {
      setFormError(err?.message || "Failed to create institution. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4 md:p-8 font-sans">
      <form onSubmit={handleSubmit}>
        <div className="max-w-[90rem] mx-auto space-y-8">

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Create Institution</h2>
              <p className="text-sm text-gray-500 mt-1">Register a new educational institution with full profile data.</p>
            </div>
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => setActiveSection("manage-college")}
                className="px-6 py-2.5 bg-white border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition">
                Cancel
              </button>
              <button type="submit" disabled={saving}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50">
                {saving ? "Creating..." : "Create Institution"}
              </button>
            </div>
          </div>

          {formSuccess && (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 text-sm font-medium">
              <i className="fa-solid fa-check-circle text-green-600"></i> Institution created successfully! Redirecting...
            </div>
          )}
          {formError && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 rounded-lg px-4 py-3 text-sm font-medium">
              <i className="fa-solid fa-exclamation-circle text-red-600"></i> {formError}
            </div>
          )}

          {/* ─── Logo & Banner ─── */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              <i className="fa-solid fa-image text-blue-500 mr-2"></i>Logo & Banner
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization Logo</label>
                <div onClick={() => logoInputRef.current?.click()}
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition cursor-pointer bg-gray-50 relative overflow-hidden h-40">
                  {logoUrl ? (
                    <img src={logoUrl} className="absolute inset-0 w-full h-full object-contain p-2" alt="Logo" />
                  ) : (
                    <div className="space-y-1 text-center self-center">
                      <i className="fa-regular fa-building text-4xl text-gray-400"></i>
                      <div className="flex text-sm text-gray-600 justify-center mt-3">
                        <span className="font-medium text-blue-600 hover:text-blue-500">Upload logo</span>
                      </div>
                    </div>
                  )}
                  <input ref={logoInputRef} type="file" className="sr-only" accept="image/*" onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setLogoFile(file);
                    const reader = new FileReader();
                    reader.onload = ev => { if (ev.target?.result) setLogoUrl(ev.target.result as string); };
                    reader.readAsDataURL(file);
                  }} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Banner / Cover Image</label>
                <div onClick={() => bannerInputRef.current?.click()}
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition cursor-pointer bg-gray-50 relative overflow-hidden h-40">
                  {bannerUrl ? (
                    <img src={bannerUrl} className="absolute inset-0 w-full h-full object-cover" alt="Banner" />
                  ) : (
                    <div className="space-y-1 text-center self-center">
                      <i className="fa-regular fa-image text-4xl text-gray-400"></i>
                      <div className="flex text-sm text-gray-600 justify-center mt-3">
                        <span className="font-medium text-blue-600 hover:text-blue-500">Upload banner</span>
                      </div>
                    </div>
                  )}
                  <input ref={bannerInputRef} type="file" className="sr-only" accept="image/*" onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setBannerFile(file);
                    const reader = new FileReader();
                    reader.onload = ev => {
                      if (ev.target?.result) {
                        setCropImageSrc(ev.target.result as string);
                        setCropperOpen(true);
                      }
                    };
                    reader.readAsDataURL(file);
                  }} />
                </div>
              </div>
            </div>
          </div>

          {/* ─── General Information ─── */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              <i className="fa-solid fa-building text-blue-500 mr-2"></i>General Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">College Name <span className="text-red-500">*</span></label>
                <input type="text" className={inputClass} placeholder="Enter college name" value={collegeName} onChange={e => setCollegeName(e.target.value)} required />
              </div>
              <div className="relative" ref={locationRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location (District)</label>
                <input type="text" className={inputClass} placeholder="Type a district..." value={location}
                  onChange={e => { setLocation(e.target.value); setLocationFilter(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)} />
                {showSuggestions && (
                  <div className="absolute z-20 top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {filteredDistricts.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-gray-400">No districts found</div>
                    ) : (
                      filteredDistricts.map(d => (
                        <button key={d} type="button" onClick={() => { setLocation(d); setShowSuggestions(false); }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors">{d}</button>
                      ))
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                <select className={inputClass} value={level} onChange={e => setLevel(e.target.value)}>
                  <option value="">Select Level</option>
                  <option value="+2">+2</option>
                  <option value="Bachelor">Bachelor</option>
                  <option value="Master">Master</option>
                  <option value="A Level">A Level</option>
                  <option value="CTEVT">CTEVT</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Affiliated University</label>
                <input type="text" className={inputClass} placeholder="e.g. Tribhuvan University" value={affiliation} onChange={e => setAffiliation(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input type="text" className={inputClass} placeholder="www.college.edu.np" value={website} onChange={e => setWebsite(e.target.value)} />
              </div>
            </div>
          </div>

          {/* ─── About Section ─── */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              <i className="fa-solid fa-circle-info text-blue-500 mr-2"></i>About Section
            </h3>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-0">Video Links (Max 4)</label>
                <button type="button" onClick={() => videos.length < 4 && addItem(setVideos, { url: "", message: "", name: "", designation: "" })}
                  className={`text-sm px-3 py-1.5 rounded-md font-medium ${videos.length >= 4 ? "text-gray-400 bg-gray-100 cursor-not-allowed" : "text-blue-600 bg-blue-50 hover:bg-blue-100"}`}>
                  <i className="fa-solid fa-plus mr-1"></i> Add Video
                </button>
              </div>
              <div className="space-y-3">
                {videos.map(v => (
                  <div key={v.id} className="bg-gray-50 border border-gray-200 rounded-md p-4 relative group">
                    <button type="button" onClick={() => removeItem(setVideos, v.id)}
                      className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                    <div className="space-y-3 pr-10">
                      <input type="url" className={`${inputClass} text-sm`} placeholder="Video URL" value={v.url} onChange={e => updateItem(setVideos, v.id, "url", e.target.value)} />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input type="text" className={`${inputClass} text-sm`} placeholder="Message / Title" value={v.message} onChange={e => updateItem(setVideos, v.id, "message", e.target.value)} />
                        <input type="text" className={`${inputClass} text-sm`} placeholder="Person Name" value={v.name} onChange={e => updateItem(setVideos, v.id, "name", e.target.value)} />
                        <input type="text" className={`${inputClass} text-sm`} placeholder="Designation" value={v.designation} onChange={e => updateItem(setVideos, v.id, "designation", e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
                {videos.length === 0 && <p className="text-sm text-gray-400 py-2">No videos added.</p>}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">About the College</label>
              <RichTextEditor value={about} onChange={setAbout} placeholder="Write a detailed description of your college..." minHeight={200} />
            </div>

            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Our Vision</label>
                <RichTextEditor value={vision} onChange={setVision} placeholder="Our vision is..." minHeight={150} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Our Mission</label>
                <RichTextEditor value={mission} onChange={setMission} placeholder="Our mission is..." minHeight={150} />
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-0">University Overview</label>
                <button type="button" onClick={() => addItem(setOverviewRows, { key: "", value: "" })}
                  className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium">
                  <i className="fa-solid fa-plus mr-1"></i> Add Row
                </button>
              </div>
              <div className="space-y-3">
                {overviewRows.map(r => (
                  <div key={r.id} className="bg-gray-50 border border-gray-200 rounded-md p-4 relative group">
                    <button type="button" onClick={() => removeItem(setOverviewRows, r.id)}
                      className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-10">
                      <input type="text" className={`${inputClass} text-sm`} placeholder="Key (e.g. Established Year)" value={r.key} onChange={e => updateItem(setOverviewRows, r.id, "key", e.target.value)} />
                      <input type="text" className={`${inputClass} text-sm`} placeholder="Value (e.g. 1995)" value={r.value} onChange={e => updateItem(setOverviewRows, r.id, "value", e.target.value)} />
                    </div>
                  </div>
                ))}
                {overviewRows.length === 0 && <p className="text-sm text-gray-400 py-2">No rows added.</p>}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-0">Leadership & Administration</label>
                <button type="button" onClick={() => addItem(setLeadershipRows, { position: "", role: "", holder: "" })}
                  className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium">
                  <i className="fa-solid fa-plus mr-1"></i> Add Row
                </button>
              </div>
              <div className="space-y-3">
                {leadershipRows.map(r => (
                  <div key={r.id} className="bg-gray-50 border border-gray-200 rounded-md p-4 relative group">
                    <button type="button" onClick={() => removeItem(setLeadershipRows, r.id)}
                      className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pr-10">
                      <input type="text" className={`${inputClass} text-sm`} placeholder="Position" value={r.position} onChange={e => updateItem(setLeadershipRows, r.id, "position", e.target.value)} />
                      <input type="text" className={`${inputClass} text-sm`} placeholder="Role" value={r.role} onChange={e => updateItem(setLeadershipRows, r.id, "role", e.target.value)} />
                      <input type="text" className={`${inputClass} text-sm`} placeholder="Current Holder" value={r.holder} onChange={e => updateItem(setLeadershipRows, r.id, "holder", e.target.value)} />
                    </div>
                  </div>
                ))}
                {leadershipRows.length === 0 && <p className="text-sm text-gray-400 py-2">No rows added.</p>}
              </div>
            </div>
          </div>

          {/* ─── Courses & Fees ─── */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                <i className="fa-solid fa-book-open text-blue-500 mr-2"></i>Courses & Fees
              </h3>
              <button type="button" onClick={() => addItem(setCourses, { name: "", duration: "", fees: "", eligibility: "" })}
                className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium">
                <i className="fa-solid fa-plus mr-1"></i> Add Course
              </button>
            </div>
            <div className="space-y-3">
              {courses.map(c => (
                <div key={c.id} className="bg-gray-50 border border-gray-200 rounded-md p-4 relative group">
                  <button type="button" onClick={() => removeItem(setCourses, c.id)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pr-10">
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Course name" value={c.name} onChange={e => updateItem(setCourses, c.id, "name", e.target.value)} />
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Duration" value={c.duration} onChange={e => updateItem(setCourses, c.id, "duration", e.target.value)} />
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Fees / Year" value={c.fees} onChange={e => updateItem(setCourses, c.id, "fees", e.target.value)} />
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Eligibility & Seat" value={c.eligibility} onChange={e => updateItem(setCourses, c.id, "eligibility", e.target.value)} />
                  </div>
                </div>
              ))}
              {courses.length === 0 && <p className="text-sm text-gray-400 py-4 text-center">No courses added.</p>}
            </div>
          </div>


          {/* ─── Facilities ─── */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                <i className="fa-solid fa-building text-blue-500 mr-2"></i>College Facilities
              </h3>
              <button type="button" onClick={() => addItem(setFacilities, { icon: "", heading: "", desc: "" })}
                className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium">
                <i className="fa-solid fa-plus mr-1"></i> Add Facility
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {facilities.map(f => (
                <div key={f.id} className="bg-gray-50 border border-gray-200 rounded-md p-4 relative group">
                  <button type="button" onClick={() => removeItem(setFacilities, f.id)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <div className="space-y-3 pr-10">
                    <div className="flex gap-3">
                      <input className={`${inputClass} text-sm font-mono w-24`} placeholder="Icon name" value={f.icon} onChange={e => updateItem(setFacilities, f.id, "icon", e.target.value)} />
                      <input className={`${inputClass} text-sm flex-1`} placeholder="Facility title" value={f.heading} onChange={e => updateItem(setFacilities, f.id, "heading", e.target.value)} />
                    </div>
                    <textarea className={`${inputClass} text-sm h-16`} placeholder="Short description" value={f.desc} onChange={e => updateItem(setFacilities, f.id, "desc", e.target.value)}></textarea>
                  </div>
                </div>
              ))}
              {facilities.length === 0 && <p className="text-sm text-gray-400 py-4 text-center">No facilities added.</p>}
            </div>
          </div>

          {/* ─── Alumni ─── */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                <i className="fa-solid fa-users text-blue-500 mr-2"></i>Notable Alumni
              </h3>
              <button type="button" onClick={() => addItem(setAlumni, { photo: "", name: "", job: "", batch: "", linkedin: "" })}
                className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium">
                <i className="fa-solid fa-plus mr-1"></i> Add Alumni
              </button>
            </div>
            <div className="space-y-3">
              {alumni.map(a => (
                <div key={a.id} className="bg-gray-50 border border-gray-200 rounded-md p-4 relative group">
                  <button type="button" onClick={() => removeItem(setAlumni, a.id)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <div className="flex gap-4 pr-10">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden flex items-center justify-center">
                      {a.photo ? <img src={a.photo} className="w-full h-full object-cover" alt="" /> : <i className="fa-solid fa-user text-gray-400 text-xl"></i>}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input className={`${inputClass} text-sm`} placeholder="Full name" value={a.name} onChange={e => updateItem(setAlumni, a.id, "name", e.target.value)} />
                      <input className={`${inputClass} text-sm`} placeholder="Current job (e.g. Software Engineer at Google)" value={a.job} onChange={e => updateItem(setAlumni, a.id, "job", e.target.value)} />
                      <div className="grid grid-cols-2 gap-2">
                        <input className={`${inputClass} text-sm`} placeholder="Batch year" value={a.batch} onChange={e => updateItem(setAlumni, a.id, "batch", e.target.value)} />
                        <input className={`${inputClass} text-sm`} placeholder="LinkedIn URL" value={a.linkedin} onChange={e => updateItem(setAlumni, a.id, "linkedin", e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {alumni.length === 0 && <p className="text-sm text-gray-400 py-4 text-center">No alumni added.</p>}
            </div>
          </div>

          {/* ─── Gallery ─── */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              <i className="fa-solid fa-image text-blue-500 mr-2"></i>Gallery
            </h3>
            <div className="mb-6">
              <div onClick={() => galleryRef.current?.click()}
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition cursor-pointer bg-gray-50 relative overflow-hidden">
                <div className="space-y-1 text-center">
                  <i className="fa-regular fa-image text-4xl text-gray-400"></i>
                  <div className="flex text-sm text-gray-600 justify-center mt-3">
                    <span className="font-medium text-blue-600 hover:text-blue-500">Upload images</span>
                  </div>
                  <p className="text-xs text-gray-400">PNG, JPG up to 5MB each</p>
                </div>
                <input ref={galleryRef} type="file" className="sr-only" accept="image/*" multiple
                  onChange={async e => {
                    const files = Array.from(e.target.files || []);
                    const newItems: GalleryItem[] = [];
                    for (let i = 0; i < files.length; i++) {
                      try {
                        const url = await uploadFile(files[i], "institution/gallery");
                        newItems.push({ id: Date.now() + i, url });
                      } catch { /* skip failed uploads */ }
                    }
                    if (newItems.length > 0) setGallery(prev => [...prev, ...newItems]);
                  }} />
              </div>
            </div>
            {gallery.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {gallery.map(g => (
                  <div key={g.id} className="relative group rounded-md overflow-hidden aspect-square bg-gray-200">
                    <img src={g.url} className="w-full h-full object-cover" alt="Gallery" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" onClick={() => removeItem(setGallery, g.id)} className="text-white hover:text-red-300">
                        <i className="fa-solid fa-trash text-lg"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ─── Downloads ─── */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                <i className="fa-solid fa-download text-blue-500 mr-2"></i>Downloads / Resources
              </h3>
              <button type="button" onClick={() => addItem(setDownloads, { name: "", file: "" })}
                className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium">
                <i className="fa-solid fa-plus mr-1"></i> Add Document
              </button>
            </div>
            <div className="space-y-3">
              {downloads.map(d => (
                <div key={d.id} className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-md p-3 relative group">
                  <button type="button" onClick={() => removeItem(setDownloads, d.id)}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <div className="w-10 h-10 rounded bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
                    <i className="fa-regular fa-file-lines"></i>
                  </div>
                  <input className={`${inputClass} text-sm flex-1`} placeholder="Document name" value={d.name} onChange={e => updateItem(setDownloads, d.id, "name", e.target.value)} />
                  <label className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-600 cursor-pointer hover:bg-gray-50 whitespace-nowrap flex items-center gap-1 flex-shrink-0">
                    <i className="fa-solid fa-upload"></i> Choose File
                    <input type="file" className="hidden" onChange={async e => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const url = await uploadFile(file, "institution/downloads");
                        updateItem(setDownloads, d.id, "file", url);
                      } catch { /* skip */ }
                    }} />
                  </label>
                </div>
              ))}
              {downloads.length === 0 && <p className="text-sm text-gray-400 py-4 text-center">No documents added.</p>}
            </div>
          </div>

          {/* ─── Footer ─── */}
          <div className="flex items-center justify-end space-x-4 pt-6 mt-8 border-t border-gray-200 pb-10">
            <button type="button" onClick={() => setActiveSection("manage-college")}
              className="px-6 py-2.5 bg-white border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50">
              <i className={`fa-solid ${saving ? "fa-spinner fa-spin" : "fa-check"}`}></i>
              {saving ? "Creating..." : "Create Institution"}
            </button>
          </div>

        </div>
      </form>

      {cropperOpen && cropImageSrc && (
        <ImageCropperModal
          imageSrc={cropImageSrc}
          onCropComplete={handleBannerCrop}
          onCancel={() => { setCropperOpen(false); setCropImageSrc(null); }}
        />
      )}
    </div>
  );
}