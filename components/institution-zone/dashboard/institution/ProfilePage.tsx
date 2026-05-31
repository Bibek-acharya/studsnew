"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash } from "@phosphor-icons/react";
import RichTextEditor from "@/components/ScholarshipProvider/common/RichTextEditor";
import ImageCropperModal from "@/components/ScholarshipProvider/common/ImageCropperModal";
import FileUpload from "@/components/ScholarshipProvider/common/FileUpload";

interface VideoItem { id: number; url: string; message: string; name: string; designation: string; }
interface OverviewRow { id: number; key: string; value: string; }
interface LeadershipRow { id: number; position: string; role: string; holder: string; }
interface CourseRow { id: number; name: string; duration: string; fees: string; eligibility: string; }
interface ProgramRow { id: number; name: string; level: string; affiliation: string; status: string; }
interface FacilityRow { id: number; icon: string; heading: string; desc: string; }
interface AlumniRow { id: number; photo: string; name: string; job: string; batch: string; linkedin: string; }
interface GalleryEntry { title: string; url: string; }
interface GalleryGroup { folder: string; images: GalleryEntry[]; }
interface DownloadItem { id: number; name: string; file: string; }

const DISTRICTS = [
  "Achham","Arghakhanchi","Baglung","Baitadi","Bajhang","Bajura","Banke","Bara","Bardiya","Bhaktapur",
  "Bhojpur","Chitwan","Dadeldhura","Dailekh","Dang","Darchula","Dhading","Dhankuta","Dhanusha","Dolakha",
  "Dolpa","Doti","Gorkha","Gulmi","Humla","Ilam","Jajarkot","Jhapa","Jumla","Kailali",
  "Kalikot","Kanchanpur","Kapilvastu","Kaski","Kathmandu","Kavrepalanchok","Khotang","Lalitpur","Lamjung","Mahottari",
  "Makwanpur","Manang","Morang","Mugu","Mustang","Myagdi","Nawalpur","Nuwakot","Okhaldhunga","Palpa",
  "Panchthar","Parbat","Parsa","Pyuthan","Ramechhap","Rasuwa","Rautahat","Rolpa","Rukum East","Rukum West",
  "Rupandehi","Salyan","Sankhuwasabha","Saptari","Sarlahi","Sindhuli","Sindhupalchok","Siraha","Solukhumbu","Sunsari",
  "Surkhet","Syangja","Tanahun","Taplejung","Terhathum","Udayapur",
];

const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors";

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [collegeName, setCollegeName] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [brochureUrl, setBrochureUrl] = useState("");
  const [about, setAbout] = useState("");
  const [vision, setVision] = useState("");
  const [mission, setMission] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [publicProfile, setPublicProfile] = useState(true);
  const [settingsLoading, setSettingsLoading] = useState(true);

  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [overviewRows, setOverviewRows] = useState<OverviewRow[]>([]);
  const [leadershipRows, setLeadershipRows] = useState<LeadershipRow[]>([]);
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [programs, setPrograms] = useState<ProgramRow[]>([]);
  const [facilities, setFacilities] = useState<FacilityRow[]>([]);
  const [alumni, setAlumni] = useState<AlumniRow[]>([]);
  const [galleryGroups, setGalleryGroups] = useState<GalleryGroup[]>([]);
  const [uploadingInfo, setUploadingInfo] = useState<{ groupIndex: number; imageIndex: number } | null>(null);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locationFilter, setLocationFilter] = useState("");
  const locationRef = useRef<HTMLDivElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

  const filteredDistricts = DISTRICTS.filter(d => d.toLowerCase().includes(locationFilter.toLowerCase()));

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    loadProfile();
    loadSettings();
  }, []);

  const getToken = () => localStorage.getItem("institutionToken");
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
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  };

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const base = apiBase();
    const token = getToken();
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${base}/api/v1/institution/upload?folder=${folder}`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    if (!res.ok) throw new Error(`Upload error: ${res.status}`);
    const data = await res.json();
    const url = data?.data?.url || "";
    return url.startsWith("/") ? `${base}${url}` : url;
  };

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await api("/api/v1/institution/profile");
      const data = res?.data;
      if (data) {
        setCollegeName(data.institution_name || "");
        setLocation(data.location || "");
        setWebsite(data.website || "");
        setContactEmail(data.contact_email || "");
        setContactPhone(data.contact_phone || "");
        setMapUrl(data.map_url || "");
        setFacebookUrl(data.facebook_url || "");
        setInstagramUrl(data.instagram_url || "");
        setTiktokUrl(data.tiktok_url || "");
        setYoutubeUrl(data.youtube_url || "");
        setLinkedinUrl(data.linkedin_url || "");
        setBrochureUrl(data.brochure_data?.url || "");
        setLogoUrl(data.logo_url || "");
        setBannerUrl(data.banner_url || "");
        setAbout(data.about || "");
        setVision(data.vision || "");
        setMission(data.mission || "");
        if (data.videos) setVideos(Array.isArray(data.videos) ? data.videos.map((v: any, i: number) => ({ ...v, id: v.id || i + 1 })) : []);
        if (data.overview_data) setOverviewRows(Array.isArray(data.overview_data) ? data.overview_data.map((r: any, i: number) => ({ ...r, id: r.id || i + 1 })) : []);
        if (data.leadership_data) setLeadershipRows(Array.isArray(data.leadership_data) ? data.leadership_data.map((r: any, i: number) => ({ ...r, id: r.id || i + 1 })) : []);
        if (data.courses_data) setCourses(Array.isArray(data.courses_data) ? data.courses_data.map((c: any, i: number) => ({ ...c, id: c.id || i + 1 })) : []);
        if (data.programs_data) setPrograms(Array.isArray(data.programs_data) ? data.programs_data.map((p: any, i: number) => ({ ...p, id: p.id || i + 1 })) : []);
        if (data.facilities_data) setFacilities(Array.isArray(data.facilities_data) ? data.facilities_data.map((f: any, i: number) => ({ ...f, id: f.id || i + 1 })) : []);
        if (data.alumni_data) setAlumni(Array.isArray(data.alumni_data) ? data.alumni_data.map((a: any, i: number) => ({ ...a, id: a.id || i + 1 })) : []);
        if (data.gallery_data) {
          if (Array.isArray(data.gallery_data) && data.gallery_data.length > 0) {
            if ("folder" in data.gallery_data[0]) {
              setGalleryGroups(data.gallery_data);
            } else {
              setGalleryGroups([{ folder: "Gallery", images: data.gallery_data.map((g: any) => ({ title: g.title || "", url: g.url || "" })) }]);
            }
          } else {
            setGalleryGroups([]);
          }
        }
        if (data.downloads_data) setDownloads(Array.isArray(data.downloads_data) ? data.downloads_data.map((d: any, i: number) => ({ ...d, id: d.id || i + 1 })) : []);
      }
    } catch (e) {
      console.error("Failed to load profile:", e);
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const res = await api("/api/v1/institution/settings");
      if (res?.data?.public_profile !== undefined) {
        setPublicProfile(res.data.public_profile);
      }
    } catch (e) {
      console.error("Failed to load settings:", e);
    } finally {
      setSettingsLoading(false);
    }
  };

  const togglePublicProfile = async () => {
    const newValue = !publicProfile;
    try {
      await api("/api/v1/institution/settings", {
        method: "PUT",
        body: JSON.stringify({ public_profile: newValue }),
      });
      setPublicProfile(newValue);
    } catch (e) {
      console.error("Failed to update settings:", e);
    }
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

  const handleBannerCrop = useCallback(async (croppedBlob: Blob) => {
    const croppedFile = new File([croppedBlob], bannerFile?.name || "banner.jpg", { type: "image/jpeg" });
    try {
      const url = await uploadFile(croppedFile, "institution/banner");
      setBannerUrl(url);
    } catch { /* skip */ }
    setCropperOpen(false);
    setCropImageSrc(null);
  }, [bannerFile]);

  const addGalleryGroup = () => {
    setGalleryGroups([...galleryGroups, { folder: "", images: [] }]);
  };
  const removeGalleryGroup = (groupIndex: number) => {
    setGalleryGroups(galleryGroups.filter((_, i) => i !== groupIndex));
  };
  const updateGalleryFolder = (groupIndex: number, value: string) => {
    setGalleryGroups(galleryGroups.map((g, i) => i === groupIndex ? { ...g, folder: value } : g));
  };
  const addGalleryImage = (groupIndex: number) => {
    setGalleryGroups(galleryGroups.map((g, i) =>
      i === groupIndex && g.images.length < 8
        ? { ...g, images: [...g.images, { title: "", url: "" }] }
        : g
    ));
  };
  const removeGalleryImage = (groupIndex: number, imageIndex: number) => {
    setGalleryGroups(galleryGroups.map((g, i) =>
      i === groupIndex ? { ...g, images: g.images.filter((_, pi) => pi !== imageIndex) } : g
    ));
  };
  const updateGalleryImage = (groupIndex: number, imageIndex: number, field: keyof GalleryEntry, value: string) => {
    setGalleryGroups(galleryGroups.map((g, i) =>
      i === groupIndex
        ? { ...g, images: g.images.map((img, pi) => pi === imageIndex ? { ...img, [field]: value } : img) }
        : g
    ));
  };
  const handleGalleryFileSelect = async (groupIndex: number, imageIndex: number, file: File) => {
    setUploadingInfo({ groupIndex, imageIndex });
    try {
      const url = await uploadFile(file, "institution/gallery");
      setGalleryGroups(galleryGroups.map((g, i) =>
        i === groupIndex
          ? { ...g, images: g.images.map((img, pi) => pi === imageIndex ? { ...img, url } : img) }
          : g
      ));
    } catch { /* skip */ }
    setUploadingInfo(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void, fileSetter: (f: File) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      fileSetter(file);
      const reader = new FileReader();
      reader.onload = (ev) => setter(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const body = {
        institution_name: collegeName,
        location,
        website,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        map_url: mapUrl,
        facebook_url: facebookUrl,
        instagram_url: instagramUrl,
        tiktok_url: tiktokUrl,
        youtube_url: youtubeUrl,
        linkedin_url: linkedinUrl,
        brochure_data: brochureUrl ? { url: brochureUrl } : null,
        logo_url: logoUrl,
        banner_url: bannerUrl,
        about,
        vision,
        mission,
        videos: videos.map(({ id, ...rest }) => rest),
        overview_data: overviewRows.map(({ id, ...rest }) => rest),
        leadership_data: leadershipRows.map(({ id, ...rest }) => rest),
        courses_data: courses.map(({ id, ...rest }) => rest),
        programs_data: programs.map(({ id, ...rest }) => rest),
        facilities_data: facilities.map(({ id, ...rest }) => rest),
        alumni_data: alumni.map(({ id, ...rest }) => rest),
        gallery_data: galleryGroups,
        downloads_data: downloads.map(({ id, ...rest }) => rest),
      };
      await api("/api/v1/institution/profile", {
        method: "PUT",
        body: JSON.stringify(body),
      });
      router.push("/institution-zone/dashboard");
    } catch (e) {
      console.error("Failed to save profile:", e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4 md:p-8 font-sans flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4 md:p-8 font-sans">
      <form onSubmit={handleSubmit}>
        <div className="max-w-[90rem] mx-auto space-y-8">

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Manage Profile</h2>
              <p className="text-sm text-gray-500 mt-1">Update your college profile information below.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600">Profile Visibility:</span>
                <button
                  type="button"
                  onClick={togglePublicProfile}
                  disabled={settingsLoading}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${publicProfile ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${publicProfile ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <span className={`text-sm font-semibold ${publicProfile ? 'text-green-600' : 'text-gray-500'}`}>
                  {publicProfile ? 'Public' : 'Private'}
                </span>
              </div>
              <button type="submit" disabled={saving}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50">
                <i className={`fa-solid ${saving ? "fa-spinner fa-spin" : "fa-check"}`}></i>
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>

          {saved && (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 text-sm font-medium">
              <i className="fa-solid fa-check-circle text-green-600"></i> Profile saved successfully!
            </div>
          )}

          {/* ─── Logo & Banner ─── */}
          <div className="bg-white p-6 rounded-md  border border-gray-200">
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
                  <input ref={logoInputRef} type="file" className="sr-only" accept="image/*" onChange={async e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const url = await uploadFile(file, "institution/logo");
                      setLogoUrl(url);
                    } catch { /* skip */ }
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
          </div>

          {/* ─── General Information ─── */}
          <div className="bg-white p-6 rounded-md  border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              <i className="fa-solid fa-building text-blue-500 mr-2"></i>General Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">College Name</label>
                <input type="text" className={inputClass} placeholder="Enter college name" value={collegeName} onChange={e => setCollegeName(e.target.value)} />
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Google Maps Embed URL</label>
                <input type="text" className={inputClass} placeholder="https://www.google.com/maps/embed?pb=..." value={mapUrl} onChange={e => setMapUrl(e.target.value)} />
              </div>
            </div>
          </div>

          {/* ─── Social Links ─── */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">Social Links</h3>
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
          <div className="bg-white p-6 rounded-md  border border-gray-200">
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
          <div className="bg-white p-6 rounded-md  border border-gray-200">
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
          {/* ─── College Facilities ─── */}
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
              {facilities.map(f => {
                const iconName = f.icon?.trim() || "";
                const iconValid = iconName.length > 0;
                return (
                  <div key={f.id} className="bg-gray-50 border border-gray-200 rounded-md p-4 relative group">
                    <button type="button" onClick={() => removeItem(setFacilities, f.id)}
                      className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100 z-10">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                    <div className="space-y-3 pr-10">
                      <input className={`${inputClass} text-sm`} placeholder="Facility title (e.g. Library, Sports Complex)" value={f.heading} onChange={e => updateItem(setFacilities, f.id, "heading", e.target.value)} />
                      <textarea className={`${inputClass} text-sm h-16`} placeholder="Short description" value={f.desc} onChange={e => updateItem(setFacilities, f.id, "desc", e.target.value)}></textarea>
                      <div>
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-md border ${iconValid ? "bg-brand-blue/10 border-brand-blue/30 text-brand-blue" : "bg-gray-100 border-gray-200 text-gray-400"}`}>
                            {iconValid ? (
                              <i className={`fa-solid fa-${iconName} text-lg`}></i>
                            ) : (
                              <i className="fa-solid fa-icons text-lg"></i>
                            )}
                          </div>
                          <div className="flex-1">
                            <input className={`${inputClass} text-sm font-mono`} placeholder="Icon name (e.g. book, laptop, flask)" value={f.icon}
                              onChange={e => {
                                const v = e.target.value.replace(/\s+/g, "-").toLowerCase();
                                updateItem(setFacilities, f.id, "icon", v);
                              }} />
                            <p className="mt-1 text-[11px] text-gray-400">
                              Browse icons at{" "}
                              <a href="https://fontawesome.com/icons" target="_blank" rel="noreferrer" className="text-brand-blue hover:underline font-medium">fontawesome.com/icons</a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {facilities.length === 0 && <p className="text-sm text-gray-400 py-4 text-center col-span-2">No facilities added.</p>}
            </div>
          </div>

          {/* ─── Alumni ─── */}
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
                      <label className="cursor-pointer text-[10px] font-medium text-brand-blue hover:text-brand-hover bg-brand-blue/5 hover:bg-brand-blue/10 px-2 py-1 rounded transition-colors whitespace-nowrap">
                        <i className="fa-solid fa-camera mr-0.5"></i> Photo
                        <input type="file" className="hidden" accept="image/*" onChange={async e => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const url = await uploadFile(file, "institution/alumni");
                            updateItem(setAlumni, a.id, "photo", url);
                          } catch { /* skip */ }
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

          {/* ─── Gallery ─── */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Photo Gallery</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Images displayed in the gallery section</p>
                </div>
              </div>
              <button
                type="button"
                className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
                onClick={addGalleryGroup}
              >
                <Plus size={16} /> Add Gallery Group
              </button>
            </div>

            <div className="p-6 space-y-8">
              {galleryGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="border border-gray-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Gallery Folder Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-sm"
                        placeholder="e.g. Leadership Workshop"
                        value={group.folder}
                        onChange={(e) => updateGalleryFolder(groupIndex, e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg shrink-0 mt-5"
                      onClick={() => removeGalleryGroup(groupIndex)}
                    >
                      <Trash size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {group.images.map((img, imageIndex) => (
                      <div key={imageIndex} className="border border-gray-200 rounded-2xl p-4 bg-white relative">
                        <button
                          type="button"
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center z-10"
                          onClick={() => removeGalleryImage(groupIndex, imageIndex)}
                        >
                          <Trash size={14} />
                        </button>

                        {uploadingInfo?.groupIndex === groupIndex && uploadingInfo?.imageIndex === imageIndex ? (
                          <p className="text-sm text-blue-600 py-20 text-center">Uploading...</p>
                        ) : (
                          <FileUpload
                            label=""
                            uploadedText="Image uploaded"
                            accept="image/*"
                            maxSize="5MB"
                            previewUrl={img.url}
                            previewClassName="w-full h-44 object-cover rounded-2xl"
                            onFileSelect={(file) => handleGalleryFileSelect(groupIndex, imageIndex, file)}
                            onClearPreview={() => updateGalleryImage(groupIndex, imageIndex, "url", "")}
                          />
                        )}

                        <div className="mt-4">
                          <label className="text-sm font-medium text-gray-700 block mb-1.5">
                            Image Title
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500"
                            placeholder="Leadership Training"
                            value={img.title}
                            onChange={(e) => updateGalleryImage(groupIndex, imageIndex, "title", e.target.value)}
                          />
                        </div>
                      </div>
                    ))}

                    {group.images.length < 8 && (
                      <button
                        type="button"
                        className="border-2 border-dashed border-gray-300 rounded-2xl min-h-[280px] flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50/40 transition"
                        onClick={() => addGalleryImage(groupIndex)}
                      >
                        <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 text-3xl mb-4">
                          +
                        </div>
                        <p className="font-semibold text-gray-800">Add Image</p>
                        <p className="text-sm text-gray-400 mt-1">Maximum 8 images</p>
                      </button>
                    )}
                  </div>

                  <div className="mt-5 text-xs text-gray-400">
                    Max 3 cards per row • Max 8 images per folder
                  </div>
                </div>
              ))}

              {galleryGroups.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No images added yet.</p>
              )}
            </div>
          </div>

          {/* ─── Downloads ─── */}
          <div className="bg-white p-6 rounded-md  border border-gray-200">
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
                <div key={d.id} className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-md p-3 pr-10 relative group">
                  <button type="button" onClick={() => removeItem(setDownloads, d.id)}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <div className="w-10 h-10 rounded bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
                    <i className="fa-regular fa-file-lines"></i>
                  </div>
                  <input className={`${inputClass} text-sm flex-1`} placeholder="Document name" value={d.name} onChange={e => updateItem(setDownloads, d.id, "name", e.target.value)} />
                  {d.file ? (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a href={d.file} target="_blank" rel="noopener noreferrer"
                        className="px-3 py-2 bg-green-50 border border-green-300 rounded-md text-sm text-green-700 hover:bg-green-100 flex items-center gap-1">
                        <i className="fa-solid fa-eye"></i> Preview
                      </a>
                      <label className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-600 cursor-pointer hover:bg-gray-50 whitespace-nowrap flex items-center gap-1">
                        <i className="fa-solid fa-upload"></i>
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
                  ) : (
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
                  )}
                </div>
              ))}
              {downloads.length === 0 && <p className="text-sm text-gray-400 py-4 text-center">No documents added.</p>}
            </div>
          </div>

          {/* ─── Brochure ─── */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              <i className="fa-solid fa-file-pdf text-red-500 mr-2"></i>Brochure
            </h3>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 rounded-md bg-brand-blue px-5 py-2.5 text-sm font-bold text-white cursor-pointer hover:bg-brand-hover transition-colors">
                <i className="fa-solid fa-upload"></i> Upload Brochure
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,image/*"
                  onChange={async e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const url = await uploadFile(file, "institution/brochure");
                      setBrochureUrl(url);
                    } catch { /* skip */ }
                  }}
                />
              </label>
              {brochureUrl ? (
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-md p-3">
                  <div className="w-10 h-10 rounded bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-file-pdf"></i>
                  </div>
                  <span className="text-sm text-gray-700 font-medium truncate max-w-[200px]">
                    {decodeURIComponent(brochureUrl.split("/").pop() || "Brochure")}
                  </span>
                  <a href={brochureUrl} target="_blank" rel="noreferrer"
                    className="px-3 py-2 bg-green-50 border border-green-300 rounded-md text-sm text-green-700 hover:bg-green-100 flex items-center gap-1 flex-shrink-0">
                    <i className="fa-solid fa-eye"></i> Preview
                  </a>
                  <button type="button" onClick={() => setBrochureUrl("")}
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
            <button type="button" className="px-6 py-2.5 bg-white border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="button" className="px-6 py-2.5 bg-white border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition">
              Save Draft
            </button>
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50">
              <i className={`fa-solid ${saving ? "fa-spinner fa-spin" : "fa-check"}`}></i>
              {saving ? "Saving..." : "Publish Profile"}
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
};

export default ProfilePage;
