"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Plus, Trash } from "@phosphor-icons/react";
import RichTextEditor from "@/components/ScholarshipProvider/common/RichTextEditor";
import ImageCropperModal from "@/components/ScholarshipProvider/common/ImageCropperModal";
import FileUpload from "@/components/ScholarshipProvider/common/FileUpload";

interface VideoItem {
  id: number;
  url: string;
  message: string;
  name: string;
  designation: string;
  avatar: string;
}
interface OverviewRow {
  id: number;
  key: string;
  value: string;
}
interface LeadershipRow {
  id: number;
  position: string;
  role: string;
  holder: string;
}
interface CourseRow {
  id: number;
  name: string;
  duration: string;
  fees: string;
  eligibility: string;
  seats: string;
}
interface ProgramRow {
  id: number;
  name: string;
  level: string;
  affiliation: string;
  status: string;
}
interface FacilityRow {
  id: number;
  icon: string;
  heading: string;
  desc: string;
}
interface AlumniRow {
  id: number;
  photo: string;
  name: string;
  job: string;
  batch: string;
  linkedin: string;
}

const LINKEDIN_REGEX = /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/i;

const alumniSchema = z.object({
  id: z.number(),
  photo: z.string(),
  name: z.string(),
  job: z.string(),
  batch: z.string(),
  linkedin: z.string().refine(
    (val) => !val || LINKEDIN_REGEX.test(val),
    { message: "Must be a valid LinkedIn profile URL (https://linkedin.com/in/...)" }
  ),
});

const profileSchema = z.object({
  collegeName: z.string().min(1, "Institution name is required"),
  location: z.string(),
  level: z.array(z.string()),
  website: z.string(),
  contactEmail: z.string(),
  contactPhone: z.string(),
  mapUrl: z.string(),
  facebookUrl: z.string(),
  instagramUrl: z.string(),
  tiktokUrl: z.string(),
  youtubeUrl: z.string(),
  linkedinUrl: z.string(),
  affiliation: z.string(),
  universityIds: z.array(z.number()),
  brochureUrl: z.string(),
  about: z.string().min(1, "About description is required"),
  vision: z.string(),
  mission: z.string(),
  logoUrl: z.string().min(1, "Organization logo is required"),
  bannerUrl: z.string().min(1, "Banner image is required"),
  videos: z.array(z.object({
    id: z.number(), url: z.string(), message: z.string(),
    name: z.string(), designation: z.string(), avatar: z.string(),
  })),
  overviewRows: z.array(z.object({ id: z.number(), key: z.string(), value: z.string() })),
  leadershipRows: z.array(z.object({ id: z.number(), position: z.string(), role: z.string(), holder: z.string() })),
  courses: z.array(z.object({ id: z.number(), name: z.string(), duration: z.string(), fees: z.string(), eligibility: z.string(), seats: z.string() })),
  programs: z.array(z.object({ id: z.number(), name: z.string(), level: z.string(), affiliation: z.string(), status: z.string() })),
  facilities: z.array(z.object({ id: z.number(), icon: z.string(), heading: z.string(), desc: z.string() })),
  alumni: z.array(alumniSchema),
  galleryGroups: z.array(z.object({
    folder: z.string(),
    images: z.array(z.object({ title: z.string(), url: z.string() })),
  })),
  downloads: z.array(z.object({ id: z.number(), name: z.string(), file: z.string(), size: z.string() })),
  faqs: z.array(z.object({ id: z.number(), question: z.string(), answer: z.string() })),
});

type FormData = z.infer<typeof profileSchema>;

interface GalleryEntry {
  title: string;
  url: string;
}
interface GalleryGroup {
  folder: string;
  images: GalleryEntry[];
}
interface DownloadItem {
  id: number;
  name: string;
  file: string;
  size: string;
}
interface FaqCard {
  id: number;
  question: string;
  answer: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
};

import { NEPAL_DISTRICTS } from "@/lib/location-data";

const DISTRICTS = Object.values(NEPAL_DISTRICTS).flat().sort();

const inputClass =
  "w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors";

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const levelOptions = ["+2", "A-Level", "TSLC (CTEVT)", "Diploma (CTEVT)", "PCL", "Bachelor's", "Bachelor's (Honours)", "Postgraduate Diploma (PGD)", "Master's", "MPhil", "PhD"];
  const [universities, setUniversities] = useState<{ id: number; name: string }[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profileStatus, setProfileStatus] = useState<"draft" | "published">(
    "draft",
  );
  const [publicProfile, setPublicProfile] = useState(true);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [uploadingInfo, setUploadingInfo] = useState<{
    groupIndex: number;
    imageIndex: number;
  } | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locationFilter, setLocationFilter] = useState("");
  const locationRef = useRef<HTMLDivElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
    trigger,
    getValues,
    setValue,
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      collegeName: "",
      location: "",
      level: [],
      website: "",
      contactEmail: "",
      contactPhone: "",
      mapUrl: "",
      facebookUrl: "",
      instagramUrl: "",
      tiktokUrl: "",
      youtubeUrl: "",
      linkedinUrl: "",
      affiliation: "",
      universityIds: [],
      brochureUrl: "",
      about: "",
      vision: "",
      mission: "",
      logoUrl: "",
      bannerUrl: "",
      videos: [{ id: 1, url: "", message: "", name: "", designation: "", avatar: "" }],
      overviewRows: [],
      leadershipRows: [],
      courses: [],
      programs: [],
      facilities: [],
      alumni: [],
      galleryGroups: [],
      downloads: [],
      faqs: [],
    },
  });

  const level = watch("level");
  const toggleLevel = (v: string) => {
    const current = getValues("level");
    setValue(
      "level",
      current.includes(v) ? current.filter((l) => l !== v) : [...current, v],
      { shouldDirty: true }
    );
  };

  const filteredDistricts = DISTRICTS.filter((d) =>
    d.toLowerCase().includes(locationFilter.toLowerCase()),
  );

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        locationRef.current &&
        !locationRef.current.contains(e.target as Node)
      )
        setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    loadProfile();
    loadSettings();
    (async () => {
      try {
        const token = localStorage.getItem("institutionToken");
        const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const res = await fetch(`${base}/api/v1/admin/universities?limit=500`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const json = await res.json();
        setUniversities(json?.data?.universities?.map((u: any) => ({ id: u.id, name: u.name })) || []);
      } catch {}
    })();
  }, []);

  const getToken = () => localStorage.getItem("institutionToken");
  const apiBase = () =>
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

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
    const res = await fetch(
      `${base}/api/v1/institution/upload?folder=${folder}`,
      {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      },
    );
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
        if (data.profile_status) setProfileStatus(data.profile_status);

        const primaryUniId = data.university_id || 0;
        const affiliationNames = (data.affiliation || "").split(",").map((s: string) => s.trim()).filter(Boolean);
        const resolvedIds = affiliationNames
          .map((name: string) => universities.find(u => u.name === name)?.id)
          .filter((id: number | undefined) => id && id > 0);

        let galleryGroupsData: GalleryGroup[] = [];
        if (data.gallery_data) {
          if (Array.isArray(data.gallery_data) && data.gallery_data.length > 0) {
            if ("folder" in data.gallery_data[0]) {
              galleryGroupsData = data.gallery_data;
            } else {
              galleryGroupsData = [
                {
                  folder: "Gallery",
                  images: data.gallery_data.map((g: any) => ({
                    title: g.title || "",
                    url: g.url || "",
                  })),
                },
              ];
            }
          }
        }

        const dataToReset = {
          collegeName: data.institution_name || "",
          location: data.location || "",
          level: data.level ? data.level.split(",").filter(Boolean) : [],
          website: data.website || "",
          contactEmail: data.contact_email || "",
          contactPhone: data.contact_phone || "",
          mapUrl: data.map_url || "",
          facebookUrl: data.facebook_url || "",
          instagramUrl: data.instagram_url || "",
          tiktokUrl: data.tiktok_url || "",
          youtubeUrl: data.youtube_url || "",
          linkedinUrl: data.linkedin_url || "",
          affiliation: data.affiliation || "",
          universityIds: resolvedIds.length > 0 ? resolvedIds : (primaryUniId > 0 ? [primaryUniId] : []),
          brochureUrl: data.brochure_data?.url || "",
          about: data.about || "",
          vision: data.vision || "",
          mission: data.mission || "",
          logoUrl: data.logo_url || "",
          bannerUrl: data.banner_url || "",
          videos: data.videos && Array.isArray(data.videos) && data.videos.length > 0
            ? data.videos.slice(0, 1).map((v: any, i: number) => ({
                ...v,
                id: v.id || i + 1,
              }))
            : [{ id: 1, url: "", message: "", name: "", designation: "", avatar: "" }],
          overviewRows: data.overview_data && Array.isArray(data.overview_data)
            ? data.overview_data.map((r: any, i: number) => ({ ...r, id: r.id || i + 1 }))
            : [],
          leadershipRows: data.leadership_data && Array.isArray(data.leadership_data)
            ? data.leadership_data.map((r: any, i: number) => ({ ...r, id: r.id || i + 1 }))
            : [],
          courses: data.courses_data && Array.isArray(data.courses_data)
            ? data.courses_data.map((c: any, i: number) => ({ ...c, id: c.id || i + 1 }))
            : [],
          programs: data.programs_data && Array.isArray(data.programs_data)
            ? data.programs_data.map((p: any, i: number) => ({ ...p, id: p.id || i + 1 }))
            : [],
          facilities: data.facilities_data && Array.isArray(data.facilities_data)
            ? data.facilities_data.map((f: any, i: number) => ({ ...f, id: f.id || i + 1 }))
            : [],
          alumni: data.alumni_data && Array.isArray(data.alumni_data)
            ? data.alumni_data.map((a: any, i: number) => ({ ...a, id: a.id || i + 1 }))
            : [],
          galleryGroups: galleryGroupsData,
          downloads: data.downloads_data && Array.isArray(data.downloads_data)
            ? data.downloads_data.map((d: any, i: number) => ({ ...d, id: d.id || i + 1 }))
            : [],
          faqs: data.faqs_data && Array.isArray(data.faqs_data)
            ? data.faqs_data.map((f: any, i: number) => ({ id: f.id || i + 1, question: f.question || "", answer: f.answer || "" }))
            : [],
        };

        reset(dataToReset as FormData);
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

  const addItem = <T extends { id: number }>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    defaultItem: Omit<T, "id">,
  ) => {
    setter((prev) => [
      ...prev,
      { ...defaultItem, id: Date.now() } as unknown as T,
    ]);
  };
  const removeItem = <T extends { id: number }>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    id: number,
  ) => {
    setter((prev) => prev.filter((x) => x.id !== id));
  };
  const updateItem = (
    setter: any,
    id: number,
    field: string,
    value: string,
  ) => {
    setter((prev: any[]) =>
      prev.map((x) => (x.id === id ? { ...x, [field]: value } : x)),
    );
  };

  const handleBannerCrop = useCallback(
    async (croppedBlob: Blob) => {
      const croppedFile = new File(
        [croppedBlob],
        bannerFile?.name || "banner.jpg",
        { type: "image/jpeg" },
      );
      try {
        const url = await uploadFile(croppedFile, "institution/banner");
        setBannerUrl(url);
      } catch {
        /* skip */
      }
      setCropperOpen(false);
      setCropImageSrc(null);
    },
    [bannerFile],
  );

  const addGalleryGroup = () => {
    setGalleryGroups([...galleryGroups, { folder: "", images: [] }]);
  };
  const removeGalleryGroup = (groupIndex: number) => {
    setGalleryGroups(galleryGroups.filter((_, i) => i !== groupIndex));
  };
  const updateGalleryFolder = (groupIndex: number, value: string) => {
    setGalleryGroups(
      galleryGroups.map((g, i) =>
        i === groupIndex ? { ...g, folder: value } : g,
      ),
    );
  };
  const addGalleryImage = (groupIndex: number) => {
    setGalleryGroups(
      galleryGroups.map((g, i) =>
        i === groupIndex && g.images.length < 8
          ? { ...g, images: [...g.images, { title: "", url: "" }] }
          : g,
      ),
    );
  };
  const removeGalleryImage = (groupIndex: number, imageIndex: number) => {
    setGalleryGroups(
      galleryGroups.map((g, i) =>
        i === groupIndex
          ? { ...g, images: g.images.filter((_, pi) => pi !== imageIndex) }
          : g,
      ),
    );
  };
  const updateGalleryImage = (
    groupIndex: number,
    imageIndex: number,
    field: keyof GalleryEntry,
    value: string,
  ) => {
    setGalleryGroups(
      galleryGroups.map((g, i) =>
        i === groupIndex
          ? {
              ...g,
              images: g.images.map((img, pi) =>
                pi === imageIndex ? { ...img, [field]: value } : img,
              ),
            }
          : g,
      ),
    );
  };
  const handleGalleryFileSelect = async (
    groupIndex: number,
    imageIndex: number,
    file: File,
  ) => {
    setUploadingInfo({ groupIndex, imageIndex });
    try {
      const url = await uploadFile(file, "institution/gallery");
      setGalleryGroups(
        galleryGroups.map((g, i) =>
          i === groupIndex
            ? {
                ...g,
                images: g.images.map((img, pi) =>
                  pi === imageIndex ? { ...img, url } : img,
                ),
              }
            : g,
        ),
      );
    } catch {
      /* skip */
    }
    setUploadingInfo(null);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string) => void,
    fileSetter: (f: File) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      fileSetter(file);
      const reader = new FileReader();
      reader.onload = (ev) => setter(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const validateRequired = (): string[] => {
    const errors: string[] = [];
    if (!collegeName.trim()) errors.push("Institution name is required");
    if (!about.trim()) errors.push("About description is required");
    if (!logoUrl) errors.push("Organization logo is required");
    if (!bannerUrl) errors.push("Banner image is required");
    return errors;
  };

  const validateLinkedIn = (): string[] => {
    const errors: Record<number, string> = {};
    const invalid: string[] = [];
    alumni.forEach((a) => {
      if (a.linkedin && !LINKEDIN_REGEX.test(a.linkedin.trim())) {
        errors[a.id] =
          "Must be a valid LinkedIn profile URL (https://linkedin.com/in/...)";
        invalid.push(`${a.name || "Alumni"}: invalid LinkedIn URL`);
      }
    });
    setLinkedinErrors(errors);
    return invalid;
  };

  const saveProfile = async (status: "draft" | "published") => {
    if (status === "published") {
      const requiredErrors = validateRequired();
      const linkedinErrorsList = validateLinkedIn();
      const allErrors = [...requiredErrors, ...linkedinErrorsList];
      if (allErrors.length > 0) {
        setValidationErrors(allErrors);
        return;
      }
    }
    setLinkedinErrors({});
    setValidationErrors([]);
    try {
      setSaving(true);
      const body = {
        status,
        institution_name: collegeName,
        location,
        level: level.join(","),
        website,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        map_url: mapUrl,
        facebook_url: facebookUrl,
        instagram_url: instagramUrl,
        tiktok_url: tiktokUrl,
        youtube_url: youtubeUrl,
        linkedin_url: linkedinUrl,
        affiliation: universityIds.map(id => universities.find(u => u.id === id)?.name || "").filter(Boolean).join(", "),
        university_id: universityIds[0] || undefined,
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
        faqs_data: faqs.map(({ id, ...rest }) => rest),
      };
      await api("/api/v1/institution/profile", {
        method: "PUT",
        body: JSON.stringify(body),
      });
      setProfileStatus(status);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveProfile(profileStatus);
        }}
      >
        <div className="max-w-[90rem] mx-auto space-y-8">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Manage Profile
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Update your institution profile information below.
            </p>
          </div>

          {validationErrors.length > 0 && (
            <div className="flex flex-col gap-2 bg-red-50 border border-red-200 text-red-800 rounded-lg px-4 py-3 text-sm font-medium">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-exclamation-circle text-red-600"></i>{" "}
                Please fix these errors before publishing:
              </div>
              <ul className="list-disc pl-5 text-red-700">
                {validationErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {saved && (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 text-sm font-medium">
              <i className="fa-solid fa-check-circle text-green-600"></i>{" "}
              Profile saved successfully!
            </div>
          )}

          {/* ─── Logo & Banner ─── */}
          <div className="bg-white p-6 rounded-md  border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              <i className="fa-solid fa-image text-blue-500 mr-2"></i>Logo &
              Banner
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-8 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Logo
                </label>
                <div
                  onClick={() => logoInputRef.current?.click()}
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition cursor-pointer bg-gray-50 relative overflow-hidden h-40"
                >
                  {logoUrl ? (
                    <>
                      <img
                        src={logoUrl}
                        className="absolute inset-0 w-full h-full object-contain p-2"
                        alt="Logo"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLogoUrl("");
                          setLogoFile(null);
                          if (logoInputRef.current) logoInputRef.current.value = "";
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                      >
                        <i className="fa-solid fa-times text-xs"></i>
                      </button>
                    </>
                  ) : (
                    <div className="space-y-1 text-center self-center">
                      <i className="fa-regular fa-building text-4xl text-gray-400"></i>
                      <div className="flex text-sm text-gray-600 justify-center mt-3">
                        <span className="font-medium text-blue-600 hover:text-blue-500">
                          Upload logo
                        </span>
                      </div>
                    </div>
                  )}
                  <input
                    ref={logoInputRef}
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const url = await uploadFile(file, "institution/logo");
                        setLogoUrl(url);
                      } catch {
                        /* skip */
                      }
                    }}
                  />
                </div>
              </div>
              <div className="md:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner / Cover Image
                </label>
                <div
                  onClick={() => bannerInputRef.current?.click()}
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition cursor-pointer bg-gray-50 relative overflow-hidden h-40"
                >
                  {bannerUrl ? (
                    <>
                      <img
                        src={bannerUrl}
                        className="absolute inset-0 w-full h-full object-cover"
                        alt="Banner"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setBannerUrl("");
                          setBannerFile(null);
                          if (bannerInputRef.current) bannerInputRef.current.value = "";
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                      >
                        <i className="fa-solid fa-times text-xs"></i>
                      </button>
                    </>
                  ) : (
                    <div className="space-y-1 text-center self-center">
                      <i className="fa-regular fa-image text-4xl text-gray-400"></i>
                      <div className="flex text-sm text-gray-600 justify-center mt-3">
                        <span className="font-medium text-blue-600 hover:text-blue-500">
                          Upload banner
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Recommended size: 1920 × 360 pixels
                      </p>
                    </div>
                  )}
                  <input
                    ref={bannerInputRef}
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setBannerFile(file);
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

          {/* ─── General Information ─── */}
          <div className="bg-white p-6 rounded-md  border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              <i className="fa-solid fa-building text-blue-500 mr-2"></i>General
              Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  College Name
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Enter college name"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                />
              </div>
              <div className="relative" ref={locationRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location (District)
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Type a district..."
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setLocationFilter(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                />
                {showSuggestions && (
                  <div className="absolute z-20 top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {filteredDistricts.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-gray-400">
                        No districts found
                      </div>
                    ) : (
                      filteredDistricts.map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => {
                            setLocation(d);
                            setShowSuggestions(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          {d}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                <div className="flex flex-wrap gap-2">
                  {levelOptions.map(opt => (
                    <label key={opt} className={`px-3 py-1.5 rounded-md border text-sm cursor-pointer transition-colors flex items-center gap-1.5 ${level.includes(opt) ? "bg-blue-50 border-blue-400 text-blue-700" : "bg-white border-gray-300 text-gray-600 hover:border-gray-400"}`}>
                      <input type="checkbox" className="hidden" checked={level.includes(opt)} onChange={() => toggleLevel(opt)} />
                      {level.includes(opt) && <i className="fa-solid fa-check text-xs"></i>}
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="www.college.edu.np"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  className={inputClass}
                  placeholder="admission@college.edu.np"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="01-4XXXXXX"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </div>
              {level.some(l => l === "Bachelor" || l === "Master") ? (
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
              ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Affiliation</label>
                <input type="text" className={inputClass} placeholder="e.g. Tribhuvan University" value={affiliation} onChange={(e) => setAffiliation(e.target.value)} />
              </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Maps Embed URL
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  value={mapUrl}
                  onChange={(e) => setMapUrl(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* ─── Social Links ─── */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              Social Links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook URL
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="https://facebook.com/..."
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram URL
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="https://instagram.com/..."
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TikTok URL
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="https://tiktok.com/..."
                  value={tiktokUrl}
                  onChange={(e) => setTiktokUrl(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube URL
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="https://youtube.com/..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn URL
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="https://linkedin.com/..."
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* ─── About Section ─── */}
          <div className="bg-white p-6 rounded-md  border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              <i className="fa-solid fa-circle-info text-blue-500 mr-2"></i>
              About Section
            </h3>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Video Link
              </label>
              {(() => {
                const v = videos[0];
                if (!v) return <p className="text-sm text-gray-400 py-2">Loading...</p>;
                return (
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border-2 border-gray-300 flex-shrink-0">
                          {v.avatar ? (
                            <img
                              src={v.avatar}
                              className="w-full h-full object-cover"
                              alt=""
                            />
                          ) : (
                            <i className="fa-solid fa-user text-gray-400 text-lg"></i>
                          )}
                        </div>
                        <label className="cursor-pointer text-xs font-medium text-brand-blue hover:text-brand-hover bg-brand-blue/5 hover:bg-brand-blue/10 px-3 py-1.5 rounded transition-colors">
                          <i className="fa-solid fa-camera mr-1"></i> Photo
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
                                  "institution/video-avatars",
                                );
                                updateItem(setVideos, v.id, "avatar", url);
                              } catch {
                                /* skip */
                              }
                            }}
                          />
                        </label>
                        <input
                          type="url"
                          className={`${inputClass} text-sm flex-1`}
                          placeholder="Video URL"
                          value={v.url}
                          onChange={(e) =>
                            updateItem(setVideos, v.id, "url", e.target.value)
                          }
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          className={`${inputClass} text-sm`}
                          placeholder="Message / Title"
                          maxLength={240}
                          value={v.message}
                          onChange={(e) =>
                            updateItem(
                              setVideos,
                              v.id,
                              "message",
                              e.target.value,
                            )
                          }
                        />
                        <input
                          type="text"
                          className={`${inputClass} text-sm`}
                          placeholder="Person Name"
                          value={v.name}
                          onChange={(e) =>
                            updateItem(setVideos, v.id, "name", e.target.value)
                          }
                        />
                        <input
                          type="text"
                          className={`${inputClass} text-sm`}
                          placeholder="Designation"
                          value={v.designation}
                          onChange={(e) =>
                            updateItem(
                              setVideos,
                              v.id,
                              "designation",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                About the College
              </label>
              <RichTextEditor
                value={about}
                onChange={setAbout}
                placeholder="Write a detailed description of your college..."
                minHeight={200}
              />
            </div>

            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Our Vision
                </label>
                <RichTextEditor
                  value={vision}
                  onChange={setVision}
                  placeholder="Our vision is..."
                  minHeight={150}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Our Mission
                </label>
                <RichTextEditor
                  value={mission}
                  onChange={setMission}
                  placeholder="Our mission is..."
                  minHeight={150}
                />
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-0">
                  Institution Overview
                </label>
                <button
                  type="button"
                  onClick={() =>
                    addItem(setOverviewRows, { key: "", value: "" })
                  }
                  className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium"
                >
                  <i className="fa-solid fa-plus mr-1"></i> Add Row
                </button>
              </div>
              <div className="space-y-3">
                {overviewRows.map((r) => (
                  <div
                    key={r.id}
                    className="bg-gray-50 border border-gray-200 rounded-md p-4 relative group"
                  >
                    <button
                      type="button"
                      onClick={() => removeItem(setOverviewRows, r.id)}
                      className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-10">
                      <input
                        type="text"
                        className={`${inputClass} text-sm`}
                        placeholder="Key (e.g. Established Year)"
                        value={r.key}
                        onChange={(e) =>
                          updateItem(
                            setOverviewRows,
                            r.id,
                            "key",
                            e.target.value,
                          )
                        }
                      />
                      <input
                        type="text"
                        className={`${inputClass} text-sm`}
                        placeholder="Value (e.g. 1995)"
                        value={r.value}
                        onChange={(e) =>
                          updateItem(
                            setOverviewRows,
                            r.id,
                            "value",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
                {overviewRows.length === 0 && (
                  <p className="text-sm text-gray-400 py-2">No rows added.</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-0">
                  Leadership & Administration
                </label>
                <button
                  type="button"
                  onClick={() =>
                    addItem(setLeadershipRows, {
                      position: "",
                      role: "",
                      holder: "",
                    })
                  }
                  className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium"
                >
                  <i className="fa-solid fa-plus mr-1"></i> Add Row
                </button>
              </div>
              <div className="space-y-3">
                {leadershipRows.map((r) => (
                  <div
                    key={r.id}
                    className="bg-gray-50 border border-gray-200 rounded-md p-4 relative group"
                  >
                    <button
                      type="button"
                      onClick={() => removeItem(setLeadershipRows, r.id)}
                      className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pr-10">
                      <input
                        type="text"
                        className={`${inputClass} text-sm`}
                        placeholder="Position"
                        value={r.position}
                        onChange={(e) =>
                          updateItem(
                            setLeadershipRows,
                            r.id,
                            "position",
                            e.target.value,
                          )
                        }
                      />
                      <input
                        type="text"
                        className={`${inputClass} text-sm`}
                        placeholder="Role"
                        value={r.role}
                        onChange={(e) =>
                          updateItem(
                            setLeadershipRows,
                            r.id,
                            "role",
                            e.target.value,
                          )
                        }
                      />
                      <input
                        type="text"
                        className={`${inputClass} text-sm`}
                        placeholder="Current Holder"
                        value={r.holder}
                        onChange={(e) =>
                          updateItem(
                            setLeadershipRows,
                            r.id,
                            "holder",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
                {leadershipRows.length === 0 && (
                  <p className="text-sm text-gray-400 py-2">No rows added.</p>
                )}
              </div>
            </div>
          </div>

          {/* ─── Courses & Fees ─── */}
          <div className="bg-white p-6 rounded-md  border border-gray-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                <i className="fa-solid fa-book-open text-blue-500 mr-2"></i>
                Courses & Fees
              </h3>
              <button
                type="button"
                onClick={() =>
                  addItem(setCourses, {
                    name: "",
                    duration: "",
                    fees: "",
                    eligibility: "",
                    seats: "",
                  })
                }
                className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium"
              >
                <i className="fa-solid fa-plus mr-1"></i> Add Course
              </button>
            </div>
            <div className="space-y-3">
              {courses.map((c) => (
                <div
                  key={c.id}
                  className="bg-gray-50 border border-gray-200 rounded-md p-4 relative group"
                >
                  <button
                    type="button"
                    onClick={() => removeItem(setCourses, c.id)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pr-10">
                    <input
                      type="text"
                      className={`${inputClass} text-sm`}
                      placeholder="Course name"
                      value={c.name}
                      onChange={(e) =>
                        updateItem(setCourses, c.id, "name", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className={`${inputClass} text-sm`}
                      placeholder="Duration"
                      value={c.duration}
                      onChange={(e) =>
                        updateItem(setCourses, c.id, "duration", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className={`${inputClass} text-sm`}
                      placeholder="Fees / Year"
                      value={c.fees}
                      onChange={(e) =>
                        updateItem(setCourses, c.id, "fees", e.target.value)
                      }
                    />
                    <input
                      type="number"
                      min="0"
                      className={`${inputClass} text-sm`}
                      placeholder="Seats"
                      value={c.seats}
                      onChange={(e) =>
                        updateItem(setCourses, c.id, "seats", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className={`${inputClass} text-sm`}
                      placeholder="Eligibility"
                      value={c.eligibility}
                      onChange={(e) =>
                        updateItem(
                          setCourses,
                          c.id,
                          "eligibility",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </div>
              ))}
              {courses.length === 0 && (
                <p className="text-sm text-gray-400 py-4 text-center">
                  No courses added.
                </p>
              )}
            </div>
          </div>

          {/* ─── Facilities ─── */}
          {/* ─── College Facilities ─── */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                <i className="fa-solid fa-building text-blue-500 mr-2"></i>
                College Facilities
              </h3>
              <button
                type="button"
                onClick={() =>
                  addItem(setFacilities, { icon: "", heading: "", desc: "" })
                }
                className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium"
              >
                <i className="fa-solid fa-plus mr-1"></i> Add Facility
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {facilities.map((f) => {
                const iconName = f.icon?.trim() || "";
                const iconValid = iconName.length > 0;
                return (
                  <div
                    key={f.id}
                    className="bg-gray-50 border border-gray-200 rounded-md p-4 relative group"
                  >
                    <button
                      type="button"
                      onClick={() => removeItem(setFacilities, f.id)}
                      className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100 z-10"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                    <div className="space-y-3 pr-10">
                      <input
                        className={`${inputClass} text-sm`}
                        placeholder="Facility title (e.g. Library, Sports Complex)"
                        value={f.heading}
                        onChange={(e) =>
                          updateItem(
                            setFacilities,
                            f.id,
                            "heading",
                            e.target.value,
                          )
                        }
                      />
                      <textarea
                        className={`${inputClass} text-sm h-16`}
                        placeholder="Short description"
                        value={f.desc}
                        onChange={(e) =>
                          updateItem(
                            setFacilities,
                            f.id,
                            "desc",
                            e.target.value,
                          )
                        }
                      ></textarea>
                      <div>
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-md border ${iconValid ? "bg-brand-blue/10 border-brand-blue/30 text-brand-blue" : "bg-gray-100 border-gray-200 text-gray-400"}`}
                          >
                            {iconValid ? (
                              <i
                                className={`fa-solid fa-${iconName} text-lg`}
                              ></i>
                            ) : (
                              <i className="fa-solid fa-icons text-lg"></i>
                            )}
                          </div>
                          <div className="flex-1">
                            <input
                              className={`${inputClass} text-sm font-mono`}
                              placeholder="Icon name (e.g. book, laptop, flask)"
                              value={f.icon}
                              onChange={(e) => {
                                const v = e.target.value
                                  .replace(/\s+/g, "-")
                                  .toLowerCase();
                                updateItem(setFacilities, f.id, "icon", v);
                              }}
                            />
                            <p className="mt-1 text-[11px] text-gray-400">
                              Browse icons at{" "}
                              <a
                                href="https://fontawesome.com/icons"
                                target="_blank"
                                rel="noreferrer"
                                className="text-brand-blue hover:underline font-medium"
                              >
                                fontawesome.com/icons
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {facilities.length === 0 && (
                <p className="text-sm text-gray-400 py-4 text-center col-span-2">
                  No facilities added.
                </p>
              )}
            </div>
          </div>

          {/* ─── Alumni ─── */}
          {/* ─── Notable Alumni ─── */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                <i className="fa-solid fa-users text-blue-500 mr-2"></i>Notable
                Alumni
              </h3>
              <button
                type="button"
                onClick={() =>
                  addItem(setAlumni, {
                    photo: "",
                    name: "",
                    job: "",
                    batch: "",
                    linkedin: "",
                  })
                }
                className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium"
              >
                <i className="fa-solid fa-plus mr-1"></i> Add Alumni
              </button>
            </div>
            <div className="space-y-3">
              {alumni.map((a) => (
                <div
                  key={a.id}
                  className="bg-gray-50 border border-gray-200 rounded-md p-4 relative group"
                >
                  <button
                    type="button"
                    onClick={() => removeItem(setAlumni, a.id)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100 z-10"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <div className="flex gap-4 pr-10">
                    <div className="flex flex-col items-center gap-2 flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border-2 border-gray-300">
                        {a.photo ? (
                          <img
                            src={a.photo}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        ) : (
                          <i className="fa-solid fa-user text-gray-400 text-xl"></i>
                        )}
                      </div>
                      <label className="cursor-pointer text-[10px] font-medium text-brand-blue hover:text-brand-hover bg-brand-blue/5 hover:bg-brand-blue/10 px-2 py-1 rounded transition-colors whitespace-nowrap">
                        <i className="fa-solid fa-camera mr-0.5"></i> Photo
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
                                "institution/alumni",
                              );
                              updateItem(setAlumni, a.id, "photo", url);
                            } catch {
                              /* skip */
                            }
                          }}
                        />
                      </label>
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        className={`${inputClass} text-sm`}
                        placeholder="Full name"
                        value={a.name}
                        onChange={(e) =>
                          updateItem(setAlumni, a.id, "name", e.target.value)
                        }
                      />
                      <input
                        className={`${inputClass} text-sm`}
                        placeholder="Current job (e.g. Software Engineer at Google)"
                        value={a.job}
                        onChange={(e) =>
                          updateItem(setAlumni, a.id, "job", e.target.value)
                        }
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          className={`${inputClass} text-sm`}
                          placeholder="Batch year"
                          value={a.batch}
                          onChange={(e) =>
                            updateItem(setAlumni, a.id, "batch", e.target.value)
                          }
                        />
                        <div className="relative">
                          <input
                            className={`${inputClass} text-sm ${linkedinErrors[a.id] ? "border-red-500 focus:ring-red-500" : ""}`}
                            placeholder="LinkedIn URL"
                            value={a.linkedin}
                            onChange={(e) => {
                              updateItem(
                                setAlumni,
                                a.id,
                                "linkedin",
                                e.target.value,
                              );
                              if (linkedinErrors[a.id]) {
                                setLinkedinErrors((prev) => ({
                                  ...prev,
                                  [a.id]: "",
                                }));
                              }
                            }}
                            onBlur={() => {
                              if (
                                a.linkedin &&
                                !LINKEDIN_REGEX.test(a.linkedin.trim())
                              ) {
                                setLinkedinErrors((prev) => ({
                                  ...prev,
                                  [a.id]:
                                    "Must be a valid LinkedIn profile URL",
                                }));
                              }
                            }}
                          />
                          {linkedinErrors[a.id] && (
                            <p className="mt-1 text-xs text-red-500">
                              {linkedinErrors[a.id]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {alumni.length === 0 && (
                <p className="text-sm text-gray-400 py-4 text-center">
                  No alumni added.
                </p>
              )}
            </div>
          </div>

          {/* ─── Gallery ─── */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Photo Gallery
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Images displayed in the gallery section
                  </p>
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
                <div
                  key={groupIndex}
                  className="border border-gray-200 rounded-2xl p-5"
                >
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Gallery Folder Name{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-sm"
                        placeholder="e.g. Leadership Workshop"
                        value={group.folder}
                        onChange={(e) =>
                          updateGalleryFolder(groupIndex, e.target.value)
                        }
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
                      <div
                        key={imageIndex}
                        className="border border-gray-200 rounded-2xl p-4 bg-white relative"
                      >
                        <button
                          type="button"
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center z-10"
                          onClick={() =>
                            removeGalleryImage(groupIndex, imageIndex)
                          }
                        >
                          <Trash size={14} />
                        </button>

                        {uploadingInfo?.groupIndex === groupIndex &&
                        uploadingInfo?.imageIndex === imageIndex ? (
                          <p className="text-sm text-blue-600 py-20 text-center">
                            Uploading...
                          </p>
                        ) : (
                          <FileUpload
                            label=""
                            uploadedText="Image uploaded"
                            accept="image/*"
                            maxSize="5MB"
                            previewUrl={img.url}
                            previewClassName="w-full h-44 object-cover rounded-2xl"
                            onFileSelect={(file) =>
                              handleGalleryFileSelect(
                                groupIndex,
                                imageIndex,
                                file,
                              )
                            }
                            onClearPreview={() =>
                              updateGalleryImage(
                                groupIndex,
                                imageIndex,
                                "url",
                                "",
                              )
                            }
                            hideClearButton
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
                            onChange={(e) =>
                              updateGalleryImage(
                                groupIndex,
                                imageIndex,
                                "title",
                                e.target.value,
                              )
                            }
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
                        <p className="text-sm text-gray-400 mt-1">
                          Maximum 8 images
                        </p>
                      </button>
                    )}
                  </div>

                  <div className="mt-5 text-xs text-gray-400">
                    Max 3 cards per row • Max 8 images per folder
                  </div>
                </div>
              ))}

              {galleryGroups.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No images added yet.
                </p>
              )}
            </div>
          </div>

          {/* ─── Downloads ─── */}
          <div className="bg-white p-6 rounded-md  border border-gray-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                <i className="fa-solid fa-download text-blue-500 mr-2"></i>
                Downloads / Resources
              </h3>
              <button
                type="button"
                onClick={() =>
                  addItem(setDownloads, { name: "", file: "", size: "" })
                }
                className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium"
              >
                <i className="fa-solid fa-plus mr-1"></i> Add Document
              </button>
            </div>
            <div className="space-y-3">
              {downloads.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-md p-3 pr-10 relative group"
                >
                  <button
                    type="button"
                    onClick={() => removeItem(setDownloads, d.id)}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <div className="w-10 h-10 rounded bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
                    <i className="fa-regular fa-file-lines"></i>
                  </div>
                  <input
                    className={`${inputClass} text-sm flex-1`}
                    placeholder="Document name"
                    value={d.name}
                    onChange={(e) =>
                      updateItem(setDownloads, d.id, "name", e.target.value)
                    }
                  />
                  {d.size && (
                    <span className="text-xs text-gray-400 flex-shrink-0 whitespace-nowrap">
                      {d.size}
                    </span>
                  )}
                  {d.file ? (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                        href={d.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-green-50 border border-green-300 rounded-md text-sm text-green-700 hover:bg-green-100 flex items-center gap-1"
                      >
                        <i className="fa-solid fa-eye"></i> Preview
                      </a>
                      <label className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-600 cursor-pointer hover:bg-gray-50 whitespace-nowrap flex items-center gap-1">
                        <i className="fa-solid fa-upload"></i>
                        <input
                          type="file"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              const url = await uploadFile(
                                file,
                                "institution/downloads",
                              );
                              updateItem(setDownloads, d.id, "file", url);
                              updateItem(
                                setDownloads,
                                d.id,
                                "size",
                                formatFileSize(file.size),
                              );
                            } catch {
                              /* skip */
                            }
                          }}
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-600 cursor-pointer hover:bg-gray-50 whitespace-nowrap flex items-center gap-1 flex-shrink-0">
                      <i className="fa-solid fa-upload"></i> Choose File
                      <input
                        type="file"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const url = await uploadFile(
                              file,
                              "institution/downloads",
                            );
                            updateItem(setDownloads, d.id, "file", url);
                            updateItem(
                              setDownloads,
                              d.id,
                              "size",
                              formatFileSize(file.size),
                            );
                          } catch {
                            /* skip */
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              ))}
              {downloads.length === 0 && (
                <p className="text-sm text-gray-400 py-4 text-center">
                  No documents added.
                </p>
              )}
            </div>
          </div>

          {/* ─── FAQs ─── */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                <i className="fa-solid fa-circle-question text-blue-500 mr-2"></i>
                FAQs
              </h3>
              <button
                type="button"
                onClick={() =>
                  addItem(setFaqs, { question: "", answer: "" })
                }
                className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium"
              >
                <i className="fa-solid fa-plus mr-1"></i> Add Question
              </button>
            </div>
            <div className="space-y-4">
              {faqs.map((f) => (
                <div
                  key={f.id}
                  className="p-5 bg-gray-50 border border-gray-200 rounded-md relative group"
                >
                  <button
                    type="button"
                    onClick={() => removeItem(setFaqs, f.id)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <div className="space-y-3 pr-10">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Question <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="e.g. What are the admission requirements?"
                        value={f.question}
                        onChange={(e) =>
                          updateItem(setFaqs, f.id, "question", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Answer <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        className={`${inputClass} min-h-[60px]`}
                        rows={2}
                        placeholder="Answer description..."
                        value={f.answer}
                        onChange={(e) =>
                          updateItem(setFaqs, f.id, "answer", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
              {faqs.length === 0 && (
                <p className="text-sm text-gray-400 py-4 text-center">
                  No FAQs added.
                </p>
              )}
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
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const url = await uploadFile(
                        file,
                        "institution/brochure",
                      );
                      setBrochureUrl(url);
                    } catch {
                      /* skip */
                    }
                  }}
                />
              </label>
              {brochureUrl ? (
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-md p-3">
                  <div className="w-10 h-10 rounded bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-file-pdf"></i>
                  </div>
                  <span className="text-sm text-gray-700 font-medium truncate max-w-[200px]">
                    {decodeURIComponent(
                      brochureUrl.split("/").pop() || "Brochure",
                    )}
                  </span>
                  <a
                    href={brochureUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 bg-green-50 border border-green-300 rounded-md text-sm text-green-700 hover:bg-green-100 flex items-center gap-1 flex-shrink-0"
                  >
                    <i className="fa-solid fa-eye"></i> Preview
                  </a>
                  <button
                    type="button"
                    onClick={() => setBrochureUrl("")}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors flex-shrink-0"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-400">No brochure uploaded.</p>
              )}
            </div>
          </div>

          {/* ─── Footer ─── */}
          <div className="border-t border-gray-200 pt-6 pb-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {profileStatus === "draft" ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  <span className="h-2 w-2 rounded-full bg-amber-500" /> Draft
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  <span className="h-2 w-2 rounded-full bg-green-500" /> Published
                </span>
              )}
              <button
                type="button"
                onClick={() => saveProfile(profileStatus === "draft" ? "published" : "draft")}
                disabled={saving}
                className={`px-4 py-2 rounded-md text-sm font-medium transition disabled:opacity-50 ${
                  profileStatus === "draft"
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "border border-red-300 text-red-600 hover:bg-red-50"
                }`}
              >
                {saving ? "Saving..." : profileStatus === "draft" ? "Publish" : "Unpublish"}
              </button>
            </div>
            {isDirty && (
              <button
                type="button"
                onClick={() => saveProfile(profileStatus)}
                disabled={saving}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2"
              >
                <i className={`fa-solid ${saving ? "fa-spinner fa-spin" : "fa-check"}`}></i>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            )}
          </div>
        </div>
      </form>

      {cropperOpen && cropImageSrc && (
        <ImageCropperModal
          imageSrc={cropImageSrc}
          onCropComplete={handleBannerCrop}
          onCancel={() => {
            setCropperOpen(false);
            setCropImageSrc(null);
          }}
        />
      )}
    </div>
  );
};

export default ProfilePage;
