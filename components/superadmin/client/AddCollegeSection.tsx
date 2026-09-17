"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import RichTextEditor from "@/components/ScholarshipProvider/common/RichTextEditor";
import ImageCropperModal from "@/components/ScholarshipProvider/common/ImageCropperModal";
import { NEPAL_DISTRICTS } from "@/lib/location-data";

interface VideoItem { id: number; url: string; message: string; name: string; designation: string; avatar?: string; }
interface OverviewRow { id: number; key: string; value: string; }
interface LeadershipRow { id: number; position: string; role: string; holder: string; }

interface FacilityRow { id: number; icon: string; heading: string; desc: string; }

interface CourseItem { id: number; name: string; level: string; duration: string; fees: string; eligibility: string; seats: string; sub_description: string; }
interface ProgramItem { id: number; name: string; level: string; affiliation: string; status: string; }
interface AlumniItem { id: number; photo: string; name: string; job: string; batch: string; linkedin: string; }
interface GalleryGroup { folder: string; images: { title: string; url: string }[]; }
interface DownloadItem { id: number; name: string; file: string; size: string; }
interface FaqItem { id: number; question: string; answer: string; }

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
};


const DISTRICTS = Object.values(NEPAL_DISTRICTS).flat();

const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors";

export default function AddCollegeSection({
  setActiveSection,
  editId,
}: {
  setActiveSection: (s: string) => void;
  editId?: number;
}) {
  const [collegeName, setCollegeName] = useState("");
  const [location, setLocation] = useState("");
  const [organizationType, setOrganizationType] = useState("");
  const [website, setWebsite] = useState("");
  const [level, setLevel] = useState<string[]>([]);

  const toggleLevel = (value: string) => {
    setLevel(prev => prev.includes(value) ? prev.filter(l => l !== value) : [...prev, value]);
  };

  const levelOptions = ["+2", "A-Level", "TSLC (CTEVT)", "Diploma (CTEVT)", "PCL", "Bachelor's", "Bachelor's (Honours)", "Postgraduate Diploma (PGD)", "Master's", "MPhil", "PhD"];
  const organizationTypeOptions = ["Private", "Public / Govt", "Community", "Constituent", "Foreign Affiliated"];
  const [affiliation, setAffiliation] = useState("");
  const [universityIds, setUniversityIds] = useState<number[]>([]);
  const [universities, setUniversities] = useState<{ id: number; name: string }[]>([]);
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
  const [facilities, setFacilities] = useState<FacilityRow[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locationFilter, setLocationFilter] = useState("");
  const locationRef = useRef<HTMLDivElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [cardImageUrl, setCardImageUrl] = useState("");
  const [cardImageFile, setCardImageFile] = useState<File | null>(null);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [alumni, setAlumni] = useState<AlumniItem[]>([]);
  const [galleryGroups, setGalleryGroups] = useState<GalleryGroup[]>([]);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [brochureUrl, setBrochureUrl] = useState("");
  const [brochureFile, setBrochureFile] = useState<File | null>(null);

  const cardImageInputRef = useRef<HTMLInputElement>(null);
  const [cardCropperOpen, setCardCropperOpen] = useState(false);
  const [cardCropImageSrc, setCardCropImageSrc] = useState<string | null>(null);
  const [uploadingInfo, setUploadingInfo] = useState<{ groupIndex: number; imageIndex: number } | null>(null);

  useEffect(() => {
    if (!editId) return;
    const base = apiBase();
    const token = getToken();
    fetch(`${base}/api/v1/superadmin/institutions/${editId}`, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    })
      .then(res => res.json())
      .then(json => {
        const d = json?.data;
        if (!d) return;
        setCollegeName(d.institution_name || "");
        setLocation(d.district || "");
        setOrganizationType(d.organization_type || "");
        setWebsite(d.website_url || "");
        setAffiliation(d.non_university_affiliation || d.affiliation || "");
        setUniversityIds(d.university_affiliations || (d.university_id ? [d.university_id] : []));
        setAbout(d.about || "");
        setVision(d.vision || "");
        setMission(d.mission || "");
        setLogoUrl(d.logo_url || "");
        setBannerUrl(d.banner_url || "");
        if (d.level) setLevel(d.level.split(",").filter(Boolean));
        const withId = (arr: any[]) => (arr || []).map((item: any, i: number) => ({ ...item, id: item.id || Date.now() + i }));
        setContactEmail(d.contact_email || "");
        setContactPhone(d.contact_phone || "");
        setMapUrl(d.map_url || "");
        setFacebookUrl(d.facebook_url || "");
        setInstagramUrl(d.instagram_url || "");
        setTiktokUrl(d.tiktok_url || "");
        setYoutubeUrl(d.youtube_url || "");
        setLinkedinUrl(d.linkedin_url || "");
        setCardImageUrl(d.card_image_url || "");
        if (d.profile_data?.courses_data) setCourses(withId(d.profile_data.courses_data));
        if (d.profile_data?.programs_data) setPrograms(withId(d.profile_data.programs_data));
        if (d.profile_data?.alumni_data) setAlumni(withId(d.profile_data.alumni_data));
        if (d.profile_data?.gallery_data) {
          const gd = d.profile_data.gallery_data;
          if (Array.isArray(gd) && gd.length > 0 && gd[0]?.folder) {
            setGalleryGroups(gd);
          } else if (Array.isArray(gd)) {
            setGalleryGroups([{ folder: "Gallery", images: gd.map((g: any) => ({ title: g.title || "", url: g.url || "" })) }]);
          }
        }
        if (d.profile_data?.downloads_data) setDownloads(withId(d.profile_data.downloads_data));
        if (d.profile_data?.faqs_data) setFaqs(withId(d.profile_data.faqs_data));
        if (d.profile_data?.brochure_data?.url) setBrochureUrl(d.profile_data.brochure_data.url);
        if (d.profile_data?.videos) setVideos(withId(d.profile_data.videos).slice(0, 1));
        if (d.profile_data?.overview_data) setOverviewRows(withId(d.profile_data.overview_data));
        if (d.profile_data?.leadership_data) setLeadershipRows(withId(d.profile_data.leadership_data));
        if (d.profile_data?.facilities_data) setFacilities(withId(d.profile_data.facilities_data));

      })
      .catch(() => {});
  }, [editId]);

  useEffect(() => {
    (async () => {
      try {
        const token = getToken();
        const base = apiBase();
        const res = await fetch(`${base}/api/v1/admin/universities?limit=500`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const json = await res.json();
        setUniversities(json?.data?.universities?.map((u: any) => ({ id: u.id, name: u.name })) || []);
      } catch {}
    })();
  }, []);

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

  const handleCardImageCrop = useCallback((croppedBlob: Blob) => {
    const croppedFile = new File([croppedBlob], cardImageFile?.name || "card.jpg", { type: "image/jpeg" });
    setCardImageFile(croppedFile);
    const reader = new FileReader();
    reader.onload = ev => { if (ev.target?.result) setCardImageUrl(ev.target.result as string); };
    reader.readAsDataURL(croppedBlob);
    setCardCropperOpen(false);
    setCardCropImageSrc(null);
  }, [cardImageFile]);

  const addGalleryGroup = () => {
    setGalleryGroups(prev => [...prev, { folder: "", images: [{ title: "", url: "" }] }]);
  };
  const removeGalleryGroup = (gi: number) => {
    setGalleryGroups(prev => prev.filter((_, i) => i !== gi));
  };
  const updateGalleryFolder = (gi: number, value: string) => {
    setGalleryGroups(prev => prev.map((g, i) => i === gi ? { ...g, folder: value } : g));
  };
  const addGalleryImage = (gi: number) => {
    setGalleryGroups(prev => prev.map((g, i) => i === gi ? { ...g, images: [...g.images, { title: "", url: "" }] } : g));
  };
  const removeGalleryImage = (gi: number, ii: number) => {
    setGalleryGroups(prev => prev.map((g, i) => i === gi ? { ...g, images: g.images.filter((_, j) => j !== ii) } : g));
  };
  const updateGalleryImage = (gi: number, ii: number, field: "title" | "url", value: string) => {
    setGalleryGroups(prev => prev.map((g, i) => i === gi ? { ...g, images: g.images.map((img, j) => j === ii ? { ...img, [field]: value } : img) } : g));
  };
  const handleGalleryFileSelect = async (gi: number, ii: number, file: File) => {
    setUploadingInfo({ groupIndex: gi, imageIndex: ii });
    try {
      const url = await uploadFile(file, "institution/gallery");
      updateGalleryImage(gi, ii, "url", url);
      if (!galleryGroups[gi]?.images[ii]?.title) {
        updateGalleryImage(gi, ii, "title", file.name.replace(/\.[^.]+$/, ""));
      }
    } catch { /* skip */ }
    setUploadingInfo(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess(false);
    try {
      setSaving(true);
      let finalLogoUrl = logoUrl;
      let finalBannerUrl = bannerUrl;
      let finalCardImageUrl = cardImageUrl;
      let finalBrochureUrl = brochureUrl;
      if (logoFile) {
        try { finalLogoUrl = await uploadFile(logoFile, "institution/logo"); } catch {}
      }
      if (bannerFile) {
        try { finalBannerUrl = await uploadFile(bannerFile, "institution/banner"); } catch {}
      }
      if (cardImageFile) {
        try { finalCardImageUrl = await uploadFile(cardImageFile, "institution/card"); } catch {}
      }
      if (brochureFile) {
        try { finalBrochureUrl = await uploadFile(brochureFile, "institution/brochure"); } catch {}
      }
      const body: Record<string, any> = {
        institution_name: collegeName,
        email: "",
        registration_number: "",
        location,
        website,
        organization_type: organizationType,
        level: level.join(","),
        contact_email: contactEmail,
        contact_phone: contactPhone,
        map_url: mapUrl,
        facebook_url: facebookUrl,
        instagram_url: instagramUrl,
        tiktok_url: tiktokUrl,
        youtube_url: youtubeUrl,
        linkedin_url: linkedinUrl,
        card_image_url: finalCardImageUrl.startsWith("data:") ? "" : finalCardImageUrl,
        affiliation: level.some(l => l.includes("Bachelor") || l.includes("Master"))
          ? universityIds.map(id => universities.find(u => u.id === id)?.name || "").filter(Boolean).join(", ")
          : "",
        non_university_affiliation: affiliation || "",
        university_affiliations: universityIds,
        logo_url: finalLogoUrl.startsWith("data:") ? "" : finalLogoUrl,
        banner_url: finalBannerUrl.startsWith("data:") ? "" : finalBannerUrl,
        about, vision, mission,
        courses_data: courses.map(({ id, ...rest }) => rest),
        programs_data: programs.map(({ id, ...rest }) => rest),
        alumni_data: alumni.map(({ id, ...rest }) => rest),
        gallery_data: galleryGroups,
        downloads_data: downloads.map(({ id, ...rest }) => rest),
        faqs_data: faqs.map(({ id, ...rest }) => rest),
        brochure_data: finalBrochureUrl ? { url: finalBrochureUrl } : null,
      };

      if (editId) {
        body.profile_data = {
          courses_data: courses.map(({ id, ...rest }) => rest),
          programs_data: programs.map(({ id, ...rest }) => rest),
          alumni_data: alumni.map(({ id, ...rest }) => rest),
          gallery_data: galleryGroups,
          downloads_data: downloads.map(({ id, ...rest }) => rest),
          faqs_data: faqs.map(({ id, ...rest }) => rest),
          brochure_data: finalBrochureUrl ? { url: finalBrochureUrl } : null,
          videos: videos.map(({ id, ...rest }) => rest),
          overview_data: overviewRows.map(({ id, ...rest }) => rest),
          leadership_data: leadershipRows.map(({ id, ...rest }) => rest),
          facilities_data: facilities.map(({ id, ...rest }) => rest),
        };
        await api(`/api/v1/superadmin/institutions/${editId}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
        setFormSuccess(true);
        setFormError("");
        setTimeout(() => setActiveSection("manage-college"), 1500);
      } else {
        Object.assign(body, {
          courses_data: courses.map(({ id, ...rest }) => rest),
          programs_data: programs.map(({ id, ...rest }) => rest),
          alumni_data: alumni.map(({ id, ...rest }) => rest),
          gallery_data: galleryGroups,
          downloads_data: downloads.map(({ id, ...rest }) => rest),
          faqs_data: faqs.map(({ id, ...rest }) => rest),
          brochure_data: finalBrochureUrl ? { url: finalBrochureUrl } : null,
          videos: videos.map(({ id, ...rest }) => rest),
          overview_data: overviewRows.map(({ id, ...rest }) => rest),
          leadership_data: leadershipRows.map(({ id, ...rest }) => rest),
          facilities_data: facilities.map(({ id, ...rest }) => rest),
        });
        await api("/api/v1/superadmin/institutions", {
          method: "POST",
          body: JSON.stringify(body),
        });
        setFormSuccess(true);
        setFormError("");
        setTimeout(() => setActiveSection("manage-college"), 1500);
      }
    } catch (err: any) {
      setFormError(err?.message || `Failed to ${editId ? "update" : "create"} institution. Please try again.`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4 md:p-8 font-sans">
      <form onSubmit={handleSubmit}>
        <div className="max-w-[90rem] mx-auto space-y-8">

          <div>
            <h2 className="text-xl font-bold text-gray-800">{editId ? "Edit Institution" : "Create Institution"}</h2>
            <p className="text-sm text-gray-500 mt-1">{editId ? "Update the institution profile data." : "Register a new educational institution with full profile data."}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-8 gap-6">
              <div className="md:col-span-1">
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
              <div className="md:col-span-7">
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
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Card Image</label>
              <div onClick={() => cardImageInputRef.current?.click()}
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition cursor-pointer bg-gray-50 relative overflow-hidden h-40 max-w-md">
                {cardImageUrl ? (
                  <img src={cardImageUrl} className="absolute inset-0 w-full h-full object-cover" alt="Card" />
                ) : (
                  <div className="space-y-1 text-center self-center">
                    <i className="fa-regular fa-image text-4xl text-gray-400"></i>
                    <div className="flex text-sm text-gray-600 justify-center mt-3">
                      <span className="font-medium text-blue-600 hover:text-blue-500">Upload card image</span>
                    </div>
                  </div>
                )}
                <input ref={cardImageInputRef} type="file" className="sr-only" accept="image/*" onChange={e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setCardImageFile(file);
                  const reader = new FileReader();
                  reader.onload = ev => {
                    if (ev.target?.result) {
                      setCardCropImageSrc(ev.target.result as string);
                      setCardCropperOpen(true);
                    }
                  };
                  reader.readAsDataURL(file);
                }} />
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
                <div className="flex flex-wrap gap-2">
                  {levelOptions.map(opt => (
                    <label key={opt}
                      className={`px-3 py-1.5 rounded-md border text-sm cursor-pointer transition-colors flex items-center gap-1.5 ${
                        level.includes(opt)
                          ? "bg-blue-50 border-blue-400 text-blue-700"
                          : "bg-white border-gray-300 text-gray-600 hover:border-gray-400"
                      }`}>
                      <input type="checkbox" className="hidden" checked={level.includes(opt)}
                        onChange={() => toggleLevel(opt)} />
                      {level.includes(opt) && <i className="fa-solid fa-check text-xs"></i>}
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">College Type</label>
                <select className={inputClass} value={organizationType} onChange={e => setOrganizationType(e.target.value)}>
                  <option value="">—</option>
                  {organizationTypeOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              {level.some(l => l.includes("Bachelor") || l.includes("Master")) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Affiliated Universities</label>
                <div className="border border-gray-300 rounded-md p-2 max-h-40 overflow-y-auto bg-white">
                  {universities.length === 0 ? (
                    <p className="text-sm text-gray-400">Loading universities...</p>
                  ) : (
                    universities.map(u => (
                      <label key={u.id} className="flex items-center gap-2 py-1.5 px-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={universityIds.includes(u.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setUniversityIds(prev => [...prev, u.id]);
                            } else {
                              setUniversityIds(prev => prev.filter(id => id !== u.id));
                            }
                          }}
                        />
                        <span className="text-sm text-gray-700">{u.name}</span>
                      </label>
                    ))
                  )}
                </div>
                {universityIds.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {universityIds.map(id => {
                      const uni = universities.find(u => u.id === id);
                      return uni ? (
                        <span key={id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                          {uni.name}
                          <button type="button" onClick={() => setUniversityIds(prev => prev.filter(i => i !== id))} className="hover:text-blue-900">
                            <i className="fa-solid fa-times text-[10px]"></i>
                          </button>
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
              )}
              {level.some(l => !l.includes("Bachelor") && !l.includes("Master")) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Non-University Affiliation</label>
                <input type="text" className={inputClass} placeholder="e.g. NEB, CTEVT" value={affiliation} onChange={e => setAffiliation(e.target.value)} />
              </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input type="text" className={inputClass} placeholder="www.college.edu.np" value={website} onChange={e => setWebsite(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                <input type="email" className={inputClass} placeholder="admission@college.edu.np" value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                <input type="text" className={inputClass} placeholder="01-4XXXXXX" value={contactPhone} onChange={e => setContactPhone(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Google Maps Embed URL</label>
                <input type="text" className={inputClass} placeholder="https://www.google.com/maps/embed?pb=..." value={mapUrl} onChange={e => setMapUrl(e.target.value)} />
              </div>
            </div>
          </div>

          {/* ─── Social Links ─── */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              <i className="fa-solid fa-share-nodes text-blue-500 mr-2"></i>Social Links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
                <input type="text" className={inputClass} placeholder="https://facebook.com/..." value={facebookUrl} onChange={e => setFacebookUrl(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
                <input type="text" className={inputClass} placeholder="https://instagram.com/..." value={instagramUrl} onChange={e => setInstagramUrl(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">TikTok URL</label>
                <input type="text" className={inputClass} placeholder="https://tiktok.com/..." value={tiktokUrl} onChange={e => setTiktokUrl(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
                <input type="text" className={inputClass} placeholder="https://youtube.com/..." value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                <input type="text" className={inputClass} placeholder="https://linkedin.com/..." value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} />
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
                <label className="block text-sm font-medium text-gray-700 mb-0">Video Link</label>
                <button type="button" onClick={() => videos.length < 1 && addItem(setVideos, { url: "", message: "", name: "", designation: "", avatar: "" })}
                  className={`text-sm px-3 py-1.5 rounded-md font-medium ${videos.length >= 1 ? "text-gray-400 bg-gray-100 cursor-not-allowed" : "text-blue-600 bg-blue-50 hover:bg-blue-100"}`}>
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
                    <div className="flex gap-4">
                      {/* Left: person avatar (same field as the institution-zone About section) */}
                      <div className="flex flex-col items-center gap-2 flex-shrink-0">
                        <div className="w-20 h-24 rounded-lg bg-gray-200 overflow-hidden flex items-center justify-center border-2 border-gray-300">
                          {v.avatar ? (
                            <Image src={v.avatar} alt="Video presenter" width={80} height={96} unoptimized className="w-full h-full object-cover" />
                          ) : (
                            <i className="fa-solid fa-user text-gray-400 text-2xl"></i>
                          )}
                        </div>
                        <label className="cursor-pointer text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded transition-colors">
                          <i className="fa-solid fa-camera mr-1"></i> Photo
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                const url = await uploadFile(file, "institution/video-avatars");
                                updateItem(setVideos, v.id, "avatar", url);
                              } catch {}
                            }}
                          />
                        </label>
                      </div>

                      {/* Right: url / name / designation / message rows */}
                      <div className="flex-1 space-y-3 pr-10">
                        <input type="url" className={`${inputClass} text-sm`} placeholder="Video URL" value={v.url} onChange={e => updateItem(setVideos, v.id, "url", e.target.value)} />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <input type="text" className={`${inputClass} text-sm`} placeholder="Message / Title" value={v.message} onChange={e => updateItem(setVideos, v.id, "message", e.target.value)} />
                          <input type="text" className={`${inputClass} text-sm`} placeholder="Person Name" value={v.name} onChange={e => updateItem(setVideos, v.id, "name", e.target.value)} />
                          <input type="text" className={`${inputClass} text-sm`} placeholder="Designation" value={v.designation} onChange={e => updateItem(setVideos, v.id, "designation", e.target.value)} />
                        </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-0">Institution Overview</label>
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
                    <input className={`${inputClass} text-sm`} placeholder="Facility title (e.g. Library, Sports Complex)" value={f.heading} onChange={e => updateItem(setFacilities, f.id, "heading", e.target.value)} />
                    <textarea className={`${inputClass} text-sm h-16`} placeholder="Short description" value={f.desc} onChange={e => updateItem(setFacilities, f.id, "desc", e.target.value)}></textarea>
                    <div>
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-md border ${f.icon?.trim() ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-gray-100 border-gray-200 text-gray-400"}`}>
                          {f.icon?.trim() ? (
                            <i className={`fa-solid fa-${f.icon.trim()} text-lg`}></i>
                          ) : (
                            <i className="fa-solid fa-icons text-lg"></i>
                          )}
                        </div>
                        <div className="flex-1">
                          <input className={`${inputClass} text-sm font-mono`} placeholder="Icon name (e.g. book, laptop, flask)" value={f.icon} onChange={e => { const v = e.target.value.replace(/\s+/g, "-").toLowerCase(); updateItem(setFacilities, f.id, "icon", v); }} />
                          <p className="mt-1 text-[11px] text-gray-400">Browse icons at <a href="https://fontawesome.com/icons" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-medium">fontawesome.com/icons</a></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {facilities.length === 0 && <p className="text-sm text-gray-400 py-4 text-center">No facilities added.</p>}
            </div>
          </div>

          {/* ─── Courses & Fees ─── */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                <i className="fa-solid fa-book-open text-blue-500 mr-2"></i>Courses & Fees
              </h3>
              <button type="button" onClick={() => addItem(setCourses, { name: "", level: "", duration: "", fees: "", eligibility: "", seats: "", sub_description: "" })}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-10">
                    <select className={`${inputClass} text-sm`} value={c.level} onChange={e => updateItem(setCourses, c.id, "level", e.target.value)}>
                      <option value="">Level</option>
                      {levelOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Course name" value={c.name} onChange={e => updateItem(setCourses, c.id, "name", e.target.value)} />
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Duration" value={c.duration} onChange={e => updateItem(setCourses, c.id, "duration", e.target.value)} />
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Fees / Year" value={c.fees} onChange={e => updateItem(setCourses, c.id, "fees", e.target.value)} />
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Seats (e.g. 120)" value={c.seats} onChange={e => updateItem(setCourses, c.id, "seats", e.target.value)} />
                    <textarea className={`${inputClass} text-sm h-16`} placeholder="Eligibility" value={c.eligibility} onChange={e => updateItem(setCourses, c.id, "eligibility", e.target.value)} />
                    <textarea className={`${inputClass} text-sm h-16`} placeholder="Sub Description (e.g. Honors program)" value={c.sub_description} onChange={e => updateItem(setCourses, c.id, "sub_description", e.target.value)} />
                  </div>
                </div>
              ))}
              {courses.length === 0 && <p className="text-sm text-gray-400 py-4 text-center">No courses added.</p>}
            </div>
          </div>

          {/* ─── Programs ─── */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                <i className="fa-solid fa-graduation-cap text-blue-500 mr-2"></i>Programs
              </h3>
              <button type="button" onClick={() => addItem(setPrograms, { name: "", level: "", affiliation: "", status: "" })}
                className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium">
                <i className="fa-solid fa-plus mr-1"></i> Add Program
              </button>
            </div>
            <div className="space-y-3">
              {programs.map(p => (
                <div key={p.id} className="bg-gray-50 border border-gray-200 rounded-md p-4 relative group">
                  <button type="button" onClick={() => removeItem(setPrograms, p.id)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pr-10">
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Program name" value={p.name} onChange={e => updateItem(setPrograms, p.id, "name", e.target.value)} />
                    <select className={`${inputClass} text-sm`} value={p.level} onChange={e => updateItem(setPrograms, p.id, "level", e.target.value)}>
                      <option value="">Level</option>
                      {levelOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <input type="text" className={`${inputClass} text-sm`} placeholder="Affiliation" value={p.affiliation} onChange={e => updateItem(setPrograms, p.id, "affiliation", e.target.value)} />
                    <select className={`${inputClass} text-sm`} value={p.status} onChange={e => updateItem(setPrograms, p.id, "status", e.target.value)}>
                      <option value="">Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Coming Soon">Coming Soon</option>
                    </select>
                  </div>
                </div>
              ))}
              {programs.length === 0 && <p className="text-sm text-gray-400 py-4 text-center">No programs added.</p>}
            </div>
          </div>

          {/* ─── Notable Alumni ─── */}
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
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100 z-10">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <div className="flex gap-4 pr-10">
                    <div className="flex flex-col items-center gap-2 flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border-2 border-gray-300">
                        {a.photo ? (
                          <img src={a.photo} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <i className="fa-solid fa-user text-gray-400 text-xl"></i>
                        )}
                      </div>
                      <label className="cursor-pointer text-[10px] font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors whitespace-nowrap">
                        <i className="fa-solid fa-camera mr-0.5"></i> Photo
                        <input type="file" className="hidden" accept="image/*" onChange={async e => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try { const url = await uploadFile(file, "institution/alumni"); updateItem(setAlumni, a.id, "photo", url); } catch {}
                        }} />
                      </label>
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

          {/* ─── Photo Gallery ─── */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <i className="fa-solid fa-images text-lg"></i>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Photo Gallery</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Images displayed in the gallery section</p>
                </div>
              </div>
              <button type="button" className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 flex items-center gap-1.5 transition-colors shadow-sm shrink-0" onClick={addGalleryGroup}>
                <i className="fa-solid fa-plus"></i> Add Gallery Group
              </button>
            </div>
            <div className="p-6 space-y-8">
              {galleryGroups.map((group, gi) => (
                <div key={gi} className="border border-gray-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Gallery Folder Name <span className="text-red-500">*</span></label>
                      <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm" placeholder="e.g. Leadership Workshop" value={group.folder} onChange={e => updateGalleryFolder(gi, e.target.value)} />
                    </div>
                    <button type="button" className="p-2 text-red-500 hover:bg-red-50 rounded-lg shrink-0 mt-5" onClick={() => removeGalleryGroup(gi)}>
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {group.images.map((img, ii) => (
                      <div key={ii} className="border border-gray-200 rounded-2xl p-4 bg-white relative">
                        <button type="button" className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center z-10" onClick={() => removeGalleryImage(gi, ii)}>
                          <i className="fa-solid fa-trash text-xs"></i>
                        </button>
                        {uploadingInfo?.groupIndex === gi && uploadingInfo?.imageIndex === ii ? (
                          <p className="text-sm text-blue-600 py-20 text-center">Uploading...</p>
                        ) : (
                          <div>
                            {img.url ? (
                              <div className="relative">
                                <img src={img.url} alt={img.title} className="w-full h-44 object-cover rounded-2xl" />
                                <button type="button" className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500 p-1.5 rounded-full" onClick={() => updateGalleryImage(gi, ii, "url", "")}>
                                  <i className="fa-solid fa-times text-xs"></i>
                                </button>
                              </div>
                            ) : (
                              <label className="flex flex-col items-center justify-center h-44 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50/40 transition">
                                <i className="fa-solid fa-cloud-arrow-up text-3xl text-gray-400 mb-2"></i>
                                <span className="text-sm text-gray-500">Click to upload</span>
                                <input type="file" className="hidden" accept="image/*" onChange={e => { const file = e.target.files?.[0]; if (file) handleGalleryFileSelect(gi, ii, file); }} />
                              </label>
                            )}
                          </div>
                        )}
                        <input type="text" className={`${inputClass} text-sm mt-2`} placeholder="Image title" value={img.title} onChange={e => updateGalleryImage(gi, ii, "title", e.target.value)} />
                      </div>
                    ))}
                    {group.images.length < 8 && (
                      <button type="button" className="border-2 border-dashed border-gray-300 rounded-2xl min-h-[280px] flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50/40 transition" onClick={() => addGalleryImage(gi)}>
                        <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 text-3xl mb-4">+</div>
                        <p className="font-semibold text-gray-800">Add Image</p>
                        <p className="text-sm text-gray-400 mt-1">Maximum 8 images</p>
                      </button>
                    )}
                  </div>
                  <div className="mt-5 text-xs text-gray-400">Max 3 cards per row • Max 8 images per folder</div>
                </div>
              ))}
              {galleryGroups.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No images added yet.</p>}
            </div>
          </div>

          {/* ─── Downloads ─── */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                <i className="fa-solid fa-download text-blue-500 mr-2"></i>Downloads / Resources
              </h3>
              <button type="button" onClick={() => addItem(setDownloads, { name: "", file: "", size: "" })}
                className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium">
                <i className="fa-solid fa-plus mr-1"></i> Add Document
              </button>
            </div>
            <div className="space-y-3">
              {downloads.map(d => (
                <div key={d.id} className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-md p-3 pr-10 relative group">
                  <button type="button" onClick={() => removeItem(setDownloads, d.id)}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <div className="w-10 h-10 rounded bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
                    <i className="fa-regular fa-file-lines"></i>
                  </div>
                  <input className={`${inputClass} text-sm flex-1`} placeholder="Document name" value={d.name} onChange={e => updateItem(setDownloads, d.id, "name", e.target.value)} />
                  {d.size && <span className="text-xs text-gray-400 flex-shrink-0 whitespace-nowrap">{d.size}</span>}
                  {d.file ? (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a href={d.file} target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-green-50 border border-green-300 rounded-md text-sm text-green-700 hover:bg-green-100 flex items-center gap-1">
                        <i className="fa-solid fa-eye"></i> Preview
                      </a>
                      <label className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-600 cursor-pointer hover:bg-gray-50 whitespace-nowrap flex items-center gap-1">
                        <i className="fa-solid fa-upload"></i>
                        <input type="file" className="hidden" onChange={async e => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try { const url = await uploadFile(file, "institution/downloads"); updateItem(setDownloads, d.id, "file", url); updateItem(setDownloads, d.id, "size", formatFileSize(file.size)); } catch {}
                        }} />
                      </label>
                    </div>
                  ) : (
                    <label className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-600 cursor-pointer hover:bg-gray-50 whitespace-nowrap flex items-center gap-1 flex-shrink-0">
                      <i className="fa-solid fa-upload"></i> Choose File
                      <input type="file" className="hidden" onChange={async e => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try { const url = await uploadFile(file, "institution/downloads"); updateItem(setDownloads, d.id, "file", url); updateItem(setDownloads, d.id, "size", formatFileSize(file.size)); } catch {}
                      }} />
                    </label>
                  )}
                </div>
              ))}
              {downloads.length === 0 && <p className="text-sm text-gray-400 py-4 text-center">No documents added.</p>}
            </div>
          </div>

          {/* ─── FAQs ─── */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                <i className="fa-solid fa-circle-question text-blue-500 mr-2"></i>FAQs
              </h3>
              <button type="button" onClick={() => addItem(setFaqs, { question: "", answer: "" })}
                className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium">
                <i className="fa-solid fa-plus mr-1"></i> Add Question
              </button>
            </div>
            <div className="space-y-4">
              {faqs.map(f => (
                <div key={f.id} className="p-5 bg-gray-50 border border-gray-200 rounded-md relative group">
                  <button type="button" onClick={() => removeItem(setFaqs, f.id)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <div className="space-y-3 pr-10">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Question <span className="text-red-500">*</span></label>
                      <input type="text" className={inputClass} placeholder="e.g. What are the admission requirements?" value={f.question} onChange={e => updateItem(setFaqs, f.id, "question", e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Answer <span className="text-red-500">*</span></label>
                      <textarea className={`${inputClass} min-h-[60px]`} rows={2} placeholder="Answer description..." value={f.answer} onChange={e => updateItem(setFaqs, f.id, "answer", e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
              {faqs.length === 0 && <p className="text-sm text-gray-400 py-4 text-center">No FAQs added.</p>}
            </div>
          </div>

          {/* ─── Brochure ─── */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              <i className="fa-solid fa-file-pdf text-red-500 mr-2"></i>Brochure
            </h3>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-bold text-white cursor-pointer hover:bg-blue-700 transition-colors">
                <i className="fa-solid fa-upload"></i> Upload Brochure
                <input type="file" className="hidden" accept=".pdf,.doc,.docx,image/*" onChange={async e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setBrochureFile(file);
                  try { const url = await uploadFile(file, "institution/brochure"); setBrochureUrl(url); } catch {}
                }} />
              </label>
              {brochureUrl ? (
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-md p-3">
                  <div className="w-10 h-10 rounded bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-file-pdf"></i>
                  </div>
                  <span className="text-sm text-gray-700 font-medium truncate max-w-[200px]">
                    {decodeURIComponent(brochureUrl.split("/").pop() || "Brochure")}
                  </span>
                  <a href={brochureUrl} target="_blank" rel="noreferrer" className="px-3 py-2 bg-green-50 border border-green-300 rounded-md text-sm text-green-700 hover:bg-green-100 flex items-center gap-1 flex-shrink-0">
                    <i className="fa-solid fa-eye"></i> Preview
                  </a>
                  <button type="button" onClick={() => { setBrochureUrl(""); setBrochureFile(null); }}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors flex-shrink-0">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-400">No brochure uploaded.</p>
              )}
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
              {saving ? (editId ? "Updating..." : "Creating...") : (editId ? "Edit Institution" : "Create Institution")}
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
      {cardCropperOpen && cardCropImageSrc && (
        <ImageCropperModal
          imageSrc={cardCropImageSrc}
          onCropComplete={handleCardImageCrop}
          onCancel={() => { setCardCropperOpen(false); setCardCropImageSrc(null); }}
        />
      )}
    </div>
  );
}