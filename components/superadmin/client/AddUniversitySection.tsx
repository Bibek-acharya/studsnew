"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import RichTextEditor from "@/components/ScholarshipProvider/common/RichTextEditor";
import ImageCropperModal from "@/components/ScholarshipProvider/common/ImageCropperModal";
import { NEPAL_DISTRICTS } from "@/lib/location-data";

interface VideoItem { id: number; url: string; message: string; name: string; designation: string; }
interface OverviewRow { id: number; key: string; value: string; }
interface LeadershipRow { id: number; position: string; role: string; holder: string; }
interface ContactSocial { id: number; platform: string; url: string; }
interface QuickHighlightRow { id: number; key: string; value: string; }

interface CourseItem { id: number; name: string; level: string; duration: string; fees: string; eligibility: string; seats: string; specialization: string; }
interface ProgramItem { id: number; name: string; level: string; duration: string; affiliation: string; status: string; }
interface ScholarshipItem { id: number; program: string; name: string; benefit: string; eligibility: string; level: string; }
interface EventItem { id: number; title: string; date: string; time: string; venue: string; description: string; }
interface NewsItem { id: number; title: string; category: string; description: string; image_url: string; date: string; }
interface DownloadItem { id: number; title: string; type: string; url: string; }
interface GalleryItem { id: number; url: string; caption: string; group: string; }
interface FacultyItem { id: number; name: string; programs: string; }
interface AdmissionItem { id: number; program: string; status: string; open_date: string; deadline: string; campus: string; faculty: string; }

const DISTRICTS = Object.values(NEPAL_DISTRICTS).flat();

const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors";

const UNIVERSITY_TYPES = ["Public", "Private", "Community", "Constituent"];

const STATUS_OPTIONS = ["Open", "Ongoing", "Closed"];

export default function AddUniversitySection({
  setActiveSection,
  editId,
}: {
  setActiveSection: (s: string) => void;
  editId?: number;
}) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [rank, setRank] = useState<number>(0);
  const [rating, setRating] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [verified, setVerified] = useState(false);
  const [popular, setPopular] = useState(false);
  const [description, setDescription] = useState("");
  const [established, setEstablished] = useState("");
  const [students, setStudents] = useState("");
  const [chancellor, setChancellor] = useState("");
  const [viceChancellor, setViceChancellor] = useState("");
  const [founder, setFounder] = useState("");
  const [website, setWebsite] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [cropperTarget, setCropperTarget] = useState<"logo" | "cover">("cover");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [aboutText, setAboutText] = useState("");
  const [vision, setVision] = useState("");
  const [mission, setMission] = useState("");
  const [overviewRows, setOverviewRows] = useState<OverviewRow[]>([]);
  const [leadershipRows, setLeadershipRows] = useState<LeadershipRow[]>([]);
  const [contactAddress, setContactAddress] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactWebsite, setContactWebsite] = useState("");
  const [contactSocials, setContactSocials] = useState<ContactSocial[]>([]);
  const [mapEmbed, setMapEmbed] = useState("");
  const [quickHighlights, setQuickHighlights] = useState<QuickHighlightRow[]>([]);

  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [scholarships, setScholarships] = useState<ScholarshipItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [faculties, setFaculties] = useState<FacultyItem[]>([]);
  const [admissions, setAdmissions] = useState<AdmissionItem[]>([]);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locationFilter, setLocationFilter] = useState("");
  const locationRef = useRef<HTMLDivElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (!editId) return;
    const base = apiBase();
    const token = getToken();
    fetch(`${base}/api/v1/admin/universities/${editId}`, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    })
      .then((res) => res.json())
      .then((json) => {
        const d = json?.data?.university || json?.data;
        if (!d) return;
        setName(d.name || "");
        setLocation(d.location || "");
        setType(d.type || "");
        setRank(d.rank || 0);
        setRating(d.rating || 0);
        setReviewCount(d.review_count || 0);
        setVerified(d.verified || false);
        setPopular(d.popular || d.isPopular || false);
        setDescription(d.description || "");
        setEstablished(d.established || "");
        setStudents(d.students || "");
        setChancellor(d.chancellor || "");
        setViceChancellor(d.vice_chancellor || "");
        setFounder(d.founder || "");
        setWebsite(d.website || "");
        setLogoUrl(d.logo || "");
        setCoverUrl(d.cover || "");

        const parseJson = (raw: any) => {
          if (!raw) return null;
          if (typeof raw === "object") return raw;
          if (typeof raw === "string") {
            try { return JSON.parse(raw); } catch {}
            try { return JSON.parse(atob(raw)); } catch {}
          }
          return null;
        };

        const withId = (arr: any[]) => (arr || []).map((item: any, i: number) => ({ ...item, id: Date.now() + i }));

        const aboutData = parseJson(d.about);
        if (aboutData) {
          if (aboutData.videos) setVideos(withId(aboutData.videos));
          if (aboutData.description) setAboutText(aboutData.description);
          if (aboutData.vision) setVision(aboutData.vision);
          if (aboutData.mission) setMission(aboutData.mission);
        }

        const overviewData = parseJson(d.overview);
        if (overviewData) {
          const rows = Array.isArray(overviewData) ? overviewData : Object.entries(overviewData).map(([k, v]) => ({ key: k, value: String(v) }));
          setOverviewRows(withId(rows));
        }

        const leadershipData = parseJson(d.leadership);
        if (leadershipData) {
          setLeadershipRows(withId(Array.isArray(leadershipData) ? leadershipData : []));
        }

        const contactData = parseJson(d.contact);
        if (contactData) {
          setContactAddress(contactData.address || "");
          setContactPhone(contactData.phone || "");
          setContactEmail(contactData.email || "");
          setContactWebsite(contactData.website || "");
          if (contactData.socials) setContactSocials(withId(contactData.socials));
          setMapEmbed(contactData.map_embed || "");
        }

        const quickData = parseJson(d.quick);
        if (quickData) {
          const rows = Array.isArray(quickData) ? quickData : Object.entries(quickData).map(([k, v]) => ({ key: k, value: String(v) }));
          setQuickHighlights(withId(rows));
        }

        if (d.courses) setCourses(withId(parseJson(d.courses) || []));
        if (d.programs) setPrograms(withId(parseJson(d.programs) || []));
        if (d.scholarships) setScholarships(withId(parseJson(d.scholarships) || []));
        if (d.events) setEvents(withId(parseJson(d.events) || []));
        if (d.news) setNews(withId(parseJson(d.news) || []));
        if (d.downloads) setDownloads(withId(parseJson(d.downloads) || []));
        if (d.gallery) setGallery(withId(parseJson(d.gallery) || []));
        if (d.faculties) setFaculties(withId(parseJson(d.faculties) || []));
        if (d.admissions) setAdmissions(withId(parseJson(d.admissions) || []));
      })
      .catch(() => {});
  }, [editId]);

  const filteredDistricts = DISTRICTS.filter((d) => d.toLowerCase().includes(locationFilter.toLowerCase()));

  const addItem = <T extends { id: number }>(setter: React.Dispatch<React.SetStateAction<T[]>>, defaultItem: Omit<T, "id">) => {
    setter((prev) => [...prev, { ...defaultItem, id: Date.now() } as unknown as T]);
  };
  const removeItem = <T extends { id: number }>(setter: React.Dispatch<React.SetStateAction<T[]>>, id: number) => {
    setter((prev) => prev.filter((x) => x.id !== id));
  };
  const updateItem = (setter: any, id: number, field: string, value: string) => {
    setter((prev: any[]) => prev.map((x) => (x.id === id ? { ...x, [field]: value } : x)));
  };

  const stripId = (arr: any[]) => arr.map(({ id, ...rest }) => rest);

  const handleCoverCrop = useCallback(
    (croppedBlob: Blob) => {
      const croppedFile = new File([croppedBlob], "cover.jpg", { type: "image/jpeg" });
      if (cropperTarget === "cover") {
        setCoverFile(croppedFile);
        const reader = new FileReader();
        reader.onload = (ev) => { if (ev.target?.result) setCoverUrl(ev.target.result as string); };
        reader.readAsDataURL(croppedBlob);
      } else {
        setLogoFile(croppedFile);
        const reader = new FileReader();
        reader.onload = (ev) => { if (ev.target?.result) setLogoUrl(ev.target.result as string); };
        reader.readAsDataURL(croppedBlob);
      }
      setCropperOpen(false);
      setCropImageSrc(null);
    },
    [cropperTarget]
  );

  const handleSubmit = async (e: React.FormEvent | React.MouseEvent, status: "draft" | "published" = "published") => {
    e.preventDefault();
    setFormError("");
    setFormSuccess(false);
    try {
      setSaving(true);
      let finalLogoUrl = logoUrl;
      let finalCoverUrl = coverUrl;
      if (logoFile) {
        try { finalLogoUrl = await uploadFile(logoFile, "university/logo"); } catch {}
      }
      if (coverFile) {
        try { finalCoverUrl = await uploadFile(coverFile, "university/cover"); } catch {}
      }

      const body: Record<string, any> = {
        name,
        logo: finalLogoUrl.startsWith("data:") ? "" : finalLogoUrl,
        cover: finalCoverUrl.startsWith("data:") ? "" : finalCoverUrl,
        location,
        type,
        rank,
        rating,
        review_count: reviewCount,
        verified,
        popular,
        status,
        description,
        established,
        students,
        chancellor,
        vice_chancellor: viceChancellor,
        founder,
        website,
        about: {
          videos: stripId(videos),
          description: aboutText,
          vision,
          mission,
        },
        contact: {
          address: contactAddress,
          phone: contactPhone,
          email: contactEmail,
          website: contactWebsite,
          socials: stripId(contactSocials),
          map_embed: mapEmbed,
        },
        overview: stripId(overviewRows),
        leadership: stripId(leadershipRows),
        quick: stripId(quickHighlights),
        courses: stripId(courses),
        programs: stripId(programs),
        scholarships: stripId(scholarships),
        events: stripId(events),
        news: stripId(news),
        downloads: stripId(downloads),
        gallery: stripId(gallery),
        faculties: stripId(faculties),
        admissions: stripId(admissions),
      };

      if (editId) {
        await api(`/api/v1/admin/universities/${editId}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
        setFormSuccess(true);
        setTimeout(() => setActiveSection("list-universities"), 1500);
      } else {
        await api("/api/v1/admin/universities", {
          method: "POST",
          body: JSON.stringify(body),
        });
        setFormSuccess(true);
        setTimeout(() => setActiveSection("list-universities"), 1500);
      }
    } catch (err: any) {
      setFormError(err?.message || `Failed to ${editId ? "update" : "create"} university. Please try again.`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4 md:p-8 font-sans">
      <form onSubmit={handleSubmit}>
        <div className="max-w-[90rem] mx-auto space-y-8">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{editId ? "Edit University" : "Create University"}</h2>
            <p className="text-sm text-gray-500 mt-1">{editId ? "Update the university profile data." : "Register a new university with complete profile information."}</p>
          </div>

          {formSuccess && (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 text-sm font-medium">
              <i className="fa-solid fa-check-circle text-green-600"></i> {editId ? "University updated" : "University created"} successfully! Redirecting...
            </div>
          )}
          {formError && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 rounded-lg px-4 py-3 text-sm font-medium">
              <i className="fa-solid fa-exclamation-circle text-red-600"></i> {formError}
            </div>
          )}

          {/* ─── Logo & Cover ─── */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              <i className="fa-solid fa-image text-blue-500 mr-2"></i>Logo & Cover
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-8 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">University Logo</label>
                <div
                  onClick={() => logoInputRef.current?.click()}
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition cursor-pointer bg-gray-50 relative overflow-hidden h-40"
                >
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
                  <input
                    ref={logoInputRef}
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setLogoFile(file);
                      const reader = new FileReader();
                      reader.onload = (ev) => { if (ev.target?.result) setLogoUrl(ev.target.result as string); };
                      reader.readAsDataURL(file);
                    }}
                  />
                </div>
              </div>
              <div className="md:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                <div
                  onClick={() => coverInputRef.current?.click()}
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition cursor-pointer bg-gray-50 relative overflow-hidden h-40"
                >
                  {coverUrl ? (
                    <img src={coverUrl} className="absolute inset-0 w-full h-full object-cover" alt="Cover" />
                  ) : (
                    <div className="space-y-1 text-center self-center">
                      <i className="fa-regular fa-image text-4xl text-gray-400"></i>
                      <div className="flex text-sm text-gray-600 justify-center mt-3">
                        <span className="font-medium text-blue-600 hover:text-blue-500">Upload cover</span>
                      </div>
                    </div>
                  )}
                  <input
                    ref={coverInputRef}
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setCoverFile(file);
                      setCropperTarget("cover");
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
            </div>
          </div>

          {/* ─── Basic Information ─── */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              <i className="fa-solid fa-school text-blue-500 mr-2"></i>Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">University Name <span className="text-red-500">*</span></label>
                <input type="text" className={inputClass} placeholder="Enter university name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="relative" ref={locationRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location (District)</label>
                <input
                  type="text" className={inputClass} placeholder="Type a district..." value={location}
                  onChange={(e) => { setLocation(e.target.value); setLocationFilter(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                />
                {showSuggestions && (
                  <div className="absolute z-20 top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {filteredDistricts.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-gray-400">No districts found</div>
                    ) : (
                      filteredDistricts.map((d) => (
                        <button key={d} type="button" onClick={() => { setLocation(d); setShowSuggestions(false); }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors">{d}</button>
                      ))
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select className={inputClass} value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="">Select type</option>
                  {UNIVERSITY_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Established Year</label>
                <input type="text" className={inputClass} placeholder="e.g. 1959" value={established} onChange={(e) => setEstablished(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input type="text" className={inputClass} placeholder="www.university.edu" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>
            </div>
          </div>

          {/* ─── Stats & Badges ─── */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              <i className="fa-solid fa-chart-bar text-blue-500 mr-2"></i>Stats & Badges
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rank</label>
                <input type="number" className={inputClass} placeholder="0" value={rank} onChange={(e) => setRank(Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <input type="number" step="0.1" min="0" max="5" className={inputClass} placeholder="0.0" value={rating} onChange={(e) => setRating(Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Review Count</label>
                <input type="number" className={inputClass} placeholder="0" value={reviewCount} onChange={(e) => setReviewCount(Number(e.target.value))} />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" checked={verified} onChange={(e) => setVerified(e.target.checked)} />
                  <span className="text-sm font-medium text-gray-700">Verified</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" checked={popular} onChange={(e) => setPopular(e.target.checked)} />
                  <span className="text-sm font-medium text-gray-700">Popular</span>
                </label>
              </div>
            </div>
          </div>

          {/* ─── Key Personnel ─── */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              <i className="fa-solid fa-user-tie text-blue-500 mr-2"></i>Key Personnel
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chancellor</label>
                <input type="text" className={inputClass} placeholder="Chancellor name" value={chancellor} onChange={(e) => setChancellor(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vice Chancellor</label>
                <input type="text" className={inputClass} placeholder="Vice chancellor name" value={viceChancellor} onChange={(e) => setViceChancellor(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Founder</label>
                <input type="text" className={inputClass} placeholder="Founder name" value={founder} onChange={(e) => setFounder(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Students</label>
                <input type="text" className={inputClass} placeholder="e.g. 400,000+" value={students} onChange={(e) => setStudents(e.target.value)} />
              </div>
            </div>
          </div>

          {/* ─── Description ─── */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              <i className="fa-solid fa-circle-info text-blue-500 mr-2"></i>Description
            </h3>
            <RichTextEditor value={description} onChange={setDescription} placeholder="Write a detailed description of the university..." minHeight={200} />
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
                {videos.map((v) => (
                  <div key={v.id} className="bg-gray-50 border border-gray-200 rounded-md p-4 relative group">
                    <button type="button" onClick={() => removeItem(setVideos, v.id)}
                      className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                    <div className="space-y-3 pr-10">
                      <input type="url" className={`${inputClass} text-sm`} placeholder="Video URL" value={v.url} onChange={(e) => updateItem(setVideos, v.id, "url", e.target.value)} />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input type="text" className={`${inputClass} text-sm`} placeholder="Message / Title" value={v.message} onChange={(e) => updateItem(setVideos, v.id, "message", e.target.value)} />
                        <input type="text" className={`${inputClass} text-sm`} placeholder="Person Name" value={v.name} onChange={(e) => updateItem(setVideos, v.id, "name", e.target.value)} />
                        <input type="text" className={`${inputClass} text-sm`} placeholder="Designation" value={v.designation} onChange={(e) => updateItem(setVideos, v.id, "designation", e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
                {videos.length === 0 && <p className="text-sm text-gray-400 py-2">No videos added.</p>}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">About Text</label>
              <RichTextEditor value={aboutText} onChange={setAboutText} placeholder="About the university..." minHeight={200} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vision</label>
                <RichTextEditor value={vision} onChange={setVision} placeholder="Our vision is..." minHeight={150} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mission</label>
                <RichTextEditor value={mission} onChange={setMission} placeholder="Our mission is..." minHeight={150} />
              </div>
            </div>
          </div>

          {/* ─── Overview ─── */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                <i className="fa-solid fa-table-list text-blue-500 mr-2"></i>University Overview
              </h3>
              <button type="button" onClick={() => addItem(setOverviewRows, { key: "", value: "" })}
                className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium">
                <i className="fa-solid fa-plus mr-1"></i> Add Row
              </button>
            </div>
            <div className="space-y-3">
              {overviewRows.map((r) => (
                <div key={r.id} className="bg-gray-50 border border-gray-200 rounded-md p-4 relative group">
                  <button type="button" onClick={() => removeItem(setOverviewRows, r.id)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-10">
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Key (e.g. Established Year)" value={r.key} onChange={(e) => updateItem(setOverviewRows, r.id, "key", e.target.value)} />
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Value (e.g. 1959)" value={r.value} onChange={(e) => updateItem(setOverviewRows, r.id, "value", e.target.value)} />
                  </div>
                </div>
              ))}
              {overviewRows.length === 0 && <p className="text-sm text-gray-400 py-2">No rows added.</p>}
            </div>
          </div>

          {/* ─── Leadership & Administration ─── */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                <i className="fa-solid fa-users text-blue-500 mr-2"></i>Leadership & Administration
              </h3>
              <button type="button" onClick={() => addItem(setLeadershipRows, { position: "", role: "", holder: "" })}
                className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium">
                <i className="fa-solid fa-plus mr-1"></i> Add Row
              </button>
            </div>
            <div className="space-y-3">
              {leadershipRows.map((r) => (
                <div key={r.id} className="bg-gray-50 border border-gray-200 rounded-md p-4 relative group">
                  <button type="button" onClick={() => removeItem(setLeadershipRows, r.id)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pr-10">
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Position" value={r.position} onChange={(e) => updateItem(setLeadershipRows, r.id, "position", e.target.value)} />
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Role" value={r.role} onChange={(e) => updateItem(setLeadershipRows, r.id, "role", e.target.value)} />
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Current Holder" value={r.holder} onChange={(e) => updateItem(setLeadershipRows, r.id, "holder", e.target.value)} />
                  </div>
                </div>
              ))}
              {leadershipRows.length === 0 && <p className="text-sm text-gray-400 py-2">No rows added.</p>}
            </div>
          </div>

          {/* ─── Contact Information ─── */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              <i className="fa-solid fa-address-book text-blue-500 mr-2"></i>Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input type="text" className={inputClass} placeholder="Physical address" value={contactAddress} onChange={(e) => setContactAddress(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input type="text" className={inputClass} placeholder="Phone number" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" className={inputClass} placeholder="contact@university.edu" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Website</label>
                <input type="text" className={inputClass} placeholder="www.university.edu" value={contactWebsite} onChange={(e) => setContactWebsite(e.target.value)} />
              </div>
            </div>
            <div className="mt-6">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-0">Social Media Links</label>
                <button type="button" onClick={() => addItem(setContactSocials, { platform: "", url: "" })}
                  className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium">
                  <i className="fa-solid fa-plus mr-1"></i> Add Social
                </button>
              </div>
              <div className="space-y-3">
                {contactSocials.map((s) => (
                  <div key={s.id} className="bg-gray-50 border border-gray-200 rounded-md p-4 relative group">
                    <button type="button" onClick={() => removeItem(setContactSocials, s.id)}
                      className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-10">
                      <input type="text" className={`${inputClass} text-sm`} placeholder="Platform (e.g. Facebook)" value={s.platform} onChange={(e) => updateItem(setContactSocials, s.id, "platform", e.target.value)} />
                      <input type="url" className={`${inputClass} text-sm`} placeholder="URL" value={s.url} onChange={(e) => updateItem(setContactSocials, s.id, "url", e.target.value)} />
                    </div>
                  </div>
                ))}
                {contactSocials.length === 0 && <p className="text-sm text-gray-400 py-2">No social links added.</p>}
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Google Maps Embed URL</label>
              <input type="text" className={inputClass} placeholder="Google Maps embed URL" value={mapEmbed} onChange={(e) => setMapEmbed(e.target.value)} />
            </div>
          </div>

          {/* ─── Quick Highlights ─── */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                <i className="fa-solid fa-bolt text-blue-500 mr-2"></i>Quick Highlights
              </h3>
              <button type="button" onClick={() => addItem(setQuickHighlights, { key: "", value: "" })}
                className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium">
                <i className="fa-solid fa-plus mr-1"></i> Add Highlight
              </button>
            </div>
            <div className="space-y-3">
              {quickHighlights.map((r) => (
                <div key={r.id} className="bg-gray-50 border border-gray-200 rounded-md p-4 relative group">
                  <button type="button" onClick={() => removeItem(setQuickHighlights, r.id)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-10">
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Key" value={r.key} onChange={(e) => updateItem(setQuickHighlights, r.id, "key", e.target.value)} />
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Value" value={r.value} onChange={(e) => updateItem(setQuickHighlights, r.id, "value", e.target.value)} />
                  </div>
                </div>
              ))}
              {quickHighlights.length === 0 && <p className="text-sm text-gray-400 py-2">No highlights added.</p>}
            </div>
          </div>

          {/* ═══════════════ COURSES ═══════════════ */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                <i className="fa-solid fa-book-open text-blue-500 mr-2"></i>Courses & Fees
              </h3>
              <button type="button" onClick={() => addItem(setCourses, { name: "", level: "", duration: "", fees: "", eligibility: "", seats: "", specialization: "" })}
                className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium">
                <i className="fa-solid fa-plus mr-1"></i> Add Course
              </button>
            </div>
            <div className="space-y-4">
              {courses.map((c) => (
                <div key={c.id} className="bg-gray-50 border border-gray-200 rounded-md p-4 relative group">
                  <button type="button" onClick={() => removeItem(setCourses, c.id)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-10">
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Course Name" value={c.name} onChange={(e) => updateItem(setCourses, c.id, "name", e.target.value)} />
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Level (e.g. Bachelor)" value={c.level} onChange={(e) => updateItem(setCourses, c.id, "level", e.target.value)} />
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Duration (e.g. 4 Year)" value={c.duration} onChange={(e) => updateItem(setCourses, c.id, "duration", e.target.value)} />
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Fees (e.g. Rs. 4,50,000)" value={c.fees} onChange={(e) => updateItem(setCourses, c.id, "fees", e.target.value)} />
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Eligibility (e.g. 10+2 with 75%)" value={c.eligibility} onChange={(e) => updateItem(setCourses, c.id, "eligibility", e.target.value)} />
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Seats (e.g. 120)" value={c.seats} onChange={(e) => updateItem(setCourses, c.id, "seats", e.target.value)} />
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Specialization (e.g. AI, Data Science)" value={c.specialization} onChange={(e) => updateItem(setCourses, c.id, "specialization", e.target.value)} />
                  </div>
                </div>
              ))}
              {courses.length === 0 && <p className="text-sm text-gray-400 py-2">No courses added.</p>}
            </div>
          </div>

          {/* ═══════════════ PROGRAMS ═══════════════ */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                <i className="fa-solid fa-graduation-cap text-blue-500 mr-2"></i>Programs
              </h3>
              <button type="button" onClick={() => addItem(setPrograms, { name: "", level: "", duration: "", affiliation: "", status: "Active" })}
                className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium">
                <i className="fa-solid fa-plus mr-1"></i> Add Program
              </button>
            </div>
            <div className="space-y-4">
              {programs.map((p) => (
                <div key={p.id} className="bg-gray-50 border border-gray-200 rounded-md p-4 relative group">
                  <button type="button" onClick={() => removeItem(setPrograms, p.id)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pr-10">
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Program Name" value={p.name} onChange={(e) => updateItem(setPrograms, p.id, "name", e.target.value)} />
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Level (e.g. Bachelor)" value={p.level} onChange={(e) => updateItem(setPrograms, p.id, "level", e.target.value)} />
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Duration (e.g. 4 Years)" value={p.duration} onChange={(e) => updateItem(setPrograms, p.id, "duration", e.target.value)} />
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Affiliation" value={p.affiliation} onChange={(e) => updateItem(setPrograms, p.id, "affiliation", e.target.value)} />
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Status (e.g. Active)" value={p.status} onChange={(e) => updateItem(setPrograms, p.id, "status", e.target.value)} />
                  </div>
                </div>
              ))}
              {programs.length === 0 && <p className="text-sm text-gray-400 py-2">No programs added.</p>}
            </div>
          </div>

          {/* ═══════════════ SCHOLARSHIPS ═══════════════ */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                <i className="fa-solid fa-hand-holding-heart text-blue-500 mr-2"></i>Scholarships
              </h3>
              <button type="button" onClick={() => addItem(setScholarships, { program: "", name: "", benefit: "", eligibility: "", level: "" })}
                className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium">
                <i className="fa-solid fa-plus mr-1"></i> Add Scholarship
              </button>
            </div>
            <div className="space-y-4">
              {scholarships.map((s) => (
                <div key={s.id} className="bg-gray-50 border border-gray-200 rounded-md p-4 relative group">
                  <button type="button" onClick={() => removeItem(setScholarships, s.id)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pr-10">
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Scholarship Name" value={s.name} onChange={(e) => updateItem(setScholarships, s.id, "name", e.target.value)} />
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Program" value={s.program} onChange={(e) => updateItem(setScholarships, s.id, "program", e.target.value)} />
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Level (e.g. Bachelor)" value={s.level} onChange={(e) => updateItem(setScholarships, s.id, "level", e.target.value)} />
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Benefit (e.g. 100% waiver)" value={s.benefit} onChange={(e) => updateItem(setScholarships, s.id, "benefit", e.target.value)} />
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Eligibility (e.g. Top 5%)" value={s.eligibility} onChange={(e) => updateItem(setScholarships, s.id, "eligibility", e.target.value)} />
                  </div>
                </div>
              ))}
              {scholarships.length === 0 && <p className="text-sm text-gray-400 py-2">No scholarships added.</p>}
            </div>
          </div>

          {/* ═══════════════ EVENTS ═══════════════ */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                <i className="fa-solid fa-calendar-days text-blue-500 mr-2"></i>Events
              </h3>
              <button type="button" onClick={() => addItem(setEvents, { title: "", date: "", time: "", venue: "", description: "" })}
                className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium">
                <i className="fa-solid fa-plus mr-1"></i> Add Event
              </button>
            </div>
            <div className="space-y-4">
              {events.map((ev) => (
                <div key={ev.id} className="bg-gray-50 border border-gray-200 rounded-md p-4 relative group">
                  <button type="button" onClick={() => removeItem(setEvents, ev.id)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pr-10">
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Event Title" value={ev.title} onChange={(e) => updateItem(setEvents, ev.id, "title", e.target.value)} />
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Date (e.g. 2025-05-15)" value={ev.date} onChange={(e) => updateItem(setEvents, ev.id, "date", e.target.value)} />
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Time (e.g. 10:00 AM - 4:00 PM)" value={ev.time} onChange={(e) => updateItem(setEvents, ev.id, "time", e.target.value)} />
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Venue" value={ev.venue} onChange={(e) => updateItem(setEvents, ev.id, "venue", e.target.value)} />
                    <div className="md:col-span-2">
                      <input type="text" className={`${inputClass} text-sm`} placeholder="Description" value={ev.description} onChange={(e) => updateItem(setEvents, ev.id, "description", e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
              {events.length === 0 && <p className="text-sm text-gray-400 py-2">No events added.</p>}
            </div>
          </div>

          {/* ═══════════════ NEWS ═══════════════ */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                <i className="fa-solid fa-newspaper text-blue-500 mr-2"></i>News & Notices
              </h3>
              <button type="button" onClick={() => addItem(setNews, { title: "", category: "", description: "", image_url: "", date: "" })}
                className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium">
                <i className="fa-solid fa-plus mr-1"></i> Add News
              </button>
            </div>
            <div className="space-y-4">
              {news.map((n) => (
                <div key={n.id} className="bg-gray-50 border border-gray-200 rounded-md p-4 relative group">
                  <button type="button" onClick={() => removeItem(setNews, n.id)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pr-10">
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Title" value={n.title} onChange={(e) => updateItem(setNews, n.id, "title", e.target.value)} />
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Category (e.g. Exam, Admission)" value={n.category} onChange={(e) => updateItem(setNews, n.id, "category", e.target.value)} />
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Date (e.g. 2025-06-01)" value={n.date} onChange={(e) => updateItem(setNews, n.id, "date", e.target.value)} />
                    <div className="md:col-span-2">
                      <input type="text" className={`${inputClass} text-sm`} placeholder="Image URL" value={n.image_url} onChange={(e) => updateItem(setNews, n.id, "image_url", e.target.value)} />
                    </div>
                    <div className="md:col-span-3">
                      <input type="text" className={`${inputClass} text-sm`} placeholder="Description" value={n.description} onChange={(e) => updateItem(setNews, n.id, "description", e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
              {news.length === 0 && <p className="text-sm text-gray-400 py-2">No news added.</p>}
            </div>
          </div>

          {/* ═══════════════ DOWNLOADS ═══════════════ */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                <i className="fa-solid fa-download text-blue-500 mr-2"></i>Downloads
              </h3>
              <button type="button" onClick={() => addItem(setDownloads, { title: "", type: "", url: "" })}
                className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium">
                <i className="fa-solid fa-plus mr-1"></i> Add Download
              </button>
            </div>
            <div className="space-y-4">
              {downloads.map((d) => (
                <div key={d.id} className="bg-gray-50 border border-gray-200 rounded-md p-4 relative group">
                  <button type="button" onClick={() => removeItem(setDownloads, d.id)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pr-10">
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Title (e.g. General Prospectus 2025)" value={d.title} onChange={(e) => updateItem(setDownloads, d.id, "title", e.target.value)} />
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Type (e.g. PDF, DOCX)" value={d.type} onChange={(e) => updateItem(setDownloads, d.id, "type", e.target.value)} />
                    <input type="url" className={`${inputClass} text-sm`} placeholder="URL" value={d.url} onChange={(e) => updateItem(setDownloads, d.id, "url", e.target.value)} />
                  </div>
                </div>
              ))}
              {downloads.length === 0 && <p className="text-sm text-gray-400 py-2">No downloads added.</p>}
            </div>
          </div>

          {/* ═══════════════ GALLERY ═══════════════ */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                <i className="fa-solid fa-images text-blue-500 mr-2"></i>Gallery
              </h3>
              <button type="button" onClick={() => addItem(setGallery, { url: "", caption: "", group: "" })}
                className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium">
                <i className="fa-solid fa-plus mr-1"></i> Add Image
              </button>
            </div>
            <div className="space-y-4">
              {gallery.map((g) => (
                <div key={g.id} className="bg-gray-50 border border-gray-200 rounded-md p-4 relative group">
                  <button type="button" onClick={() => removeItem(setGallery, g.id)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pr-10">
                    <input type="url" className={`${inputClass} text-sm`} placeholder="Image URL" value={g.url} onChange={(e) => updateItem(setGallery, g.id, "url", e.target.value)} />
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Caption" value={g.caption} onChange={(e) => updateItem(setGallery, g.id, "caption", e.target.value)} />
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Group (e.g. Campus, Events)" value={g.group} onChange={(e) => updateItem(setGallery, g.id, "group", e.target.value)} />
                  </div>
                </div>
              ))}
              {gallery.length === 0 && <p className="text-sm text-gray-400 py-2">No gallery images added.</p>}
            </div>
          </div>

          {/* ═══════════════ FACULTIES ═══════════════ */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                <i className="fa-solid fa-building-columns text-blue-500 mr-2"></i>Faculties & Institutes
              </h3>
              <button type="button" onClick={() => addItem(setFaculties, { name: "", programs: "" })}
                className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium">
                <i className="fa-solid fa-plus mr-1"></i> Add Faculty
              </button>
            </div>
            <div className="space-y-4">
              {faculties.map((f) => (
                <div key={f.id} className="bg-gray-50 border border-gray-200 rounded-md p-4 relative group">
                  <button type="button" onClick={() => removeItem(setFaculties, f.id)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-10">
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Faculty/Institute Name" value={f.name} onChange={(e) => updateItem(setFaculties, f.id, "name", e.target.value)} />
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Programs (e.g. B.Sc., M.Sc., PhD)" value={f.programs} onChange={(e) => updateItem(setFaculties, f.id, "programs", e.target.value)} />
                  </div>
                </div>
              ))}
              {faculties.length === 0 && <p className="text-sm text-gray-400 py-2">No faculties added.</p>}
            </div>
          </div>

          {/* ═══════════════ ADMISSIONS ═══════════════ */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                <i className="fa-solid fa-file-lines text-blue-500 mr-2"></i>Admissions
              </h3>
              <button type="button" onClick={() => addItem(setAdmissions, { program: "", status: "Open", open_date: "", deadline: "", campus: "", faculty: "" })}
                className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium">
                <i className="fa-solid fa-plus mr-1"></i> Add Admission
              </button>
            </div>
            <div className="space-y-4">
              {admissions.map((a) => (
                <div key={a.id} className="bg-gray-50 border border-gray-200 rounded-md p-4 relative group">
                  <button type="button" onClick={() => removeItem(setAdmissions, a.id)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pr-10">
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Program Name" value={a.program} onChange={(e) => updateItem(setAdmissions, a.id, "program", e.target.value)} />
                    <select className={`${inputClass} text-sm`} value={a.status} onChange={(e) => updateItem(setAdmissions, a.id, "status", e.target.value)}>
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Campus" value={a.campus} onChange={(e) => updateItem(setAdmissions, a.id, "campus", e.target.value)} />
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Faculty" value={a.faculty} onChange={(e) => updateItem(setAdmissions, a.id, "faculty", e.target.value)} />
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Open Date (e.g. 2025-07-01)" value={a.open_date} onChange={(e) => updateItem(setAdmissions, a.id, "open_date", e.target.value)} />
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Deadline (e.g. 2025-08-15)" value={a.deadline} onChange={(e) => updateItem(setAdmissions, a.id, "deadline", e.target.value)} />
                  </div>
                </div>
              ))}
              {admissions.length === 0 && <p className="text-sm text-gray-400 py-2">No admission entries added.</p>}
            </div>
          </div>

          {/* ─── Footer ─── */}
          <div className="flex items-center justify-end space-x-4 pt-6 mt-8 border-t border-gray-200 pb-10">
            <button type="button" onClick={() => setActiveSection("list-universities")}
              className="px-6 py-2.5 bg-white border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition">
              Cancel
            </button>
            {!editId && (
              <button type="button" disabled={saving} onClick={(e) => handleSubmit(e, "draft")}
                className="px-6 py-2.5 bg-gray-600 text-white rounded-md font-medium hover:bg-gray-700 transition flex items-center gap-2 disabled:opacity-50">
                <i className={`fa-solid ${saving ? "fa-spinner fa-spin" : "fa-save"}`}></i>
                {saving ? "Saving..." : "Save as Draft"}
              </button>
            )}
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50">
              <i className={`fa-solid ${saving ? "fa-spinner fa-spin" : "fa-check"}`}></i>
              {saving ? (editId ? "Updating..." : "Publishing...") : (editId ? "Update University" : "Publish University")}
            </button>
          </div>
        </div>
      </form>

      {cropperOpen && cropImageSrc && (
        <ImageCropperModal
          imageSrc={cropImageSrc}
          onCropComplete={handleCoverCrop}
          onCancel={() => { setCropperOpen(false); setCropImageSrc(null); }}
        />
      )}
    </div>
  );
}
