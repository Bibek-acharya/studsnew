"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import ImageCropperModal from "@/components/ScholarshipProvider/common/ImageCropperModal";
import { NEPAL_DISTRICTS } from "@/lib/location-data";
import ProfileMediaSection from "./ProfileMediaSection";
import ProfileGeneralSection from "./ProfileGeneralSection";
import ProfileAboutSection from "./ProfileAboutSection";
import ProfileDataSections from "./ProfileDataSections";
import ProfileAlumniSection from "./ProfileAlumniSection";
import ProfileResourcesSection from "./ProfileResourcesSection";


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

export const profileSchema = z.object({
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
  cardImageUrl: z.string(),
  videos: z.array(z.object({
    id: z.number(), url: z.string(), message: z.string(),
    name: z.string(), designation: z.string(), avatar: z.string(),
  })),
  overviewRows: z.array(z.object({ id: z.number(), key: z.string(), value: z.string() })),
  leadershipRows: z.array(z.object({ id: z.number(), position: z.string(), role: z.string(), holder: z.string() })),
  courses: z.array(z.object({ id: z.number(), name: z.string(), level: z.string(), duration: z.string(), fees: z.string(), eligibility: z.string(), seats: z.string(), sub_description: z.string() })),
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

export type FormData = z.infer<typeof profileSchema>;

export interface GalleryEntry {
  title: string;
  url: string;
}
export interface GalleryGroup {
  folder: string;
  images: GalleryEntry[];
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
};

const DISTRICTS = Object.values(NEPAL_DISTRICTS).flat().sort();

export const inputClass =
  "w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors";

const ProfilePage: React.FC = () => {
  const levelOptions = ["+2", "A-Level", "TSLC (CTEVT)", "Diploma (CTEVT)", "PCL", "Bachelor's", "Bachelor's (Honours)", "Postgraduate Diploma (PGD)", "Master's", "MPhil", "PhD"];
  const [universities, setUniversities] = useState<{ id: number; name: string }[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [cardImageFile, setCardImageFile] = useState<File | null>(null);
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
  const cardImageInputRef = useRef<HTMLInputElement>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [cropTarget, setCropTarget] = useState<"banner" | "card">("banner");

  const methods = useForm<FormData>({
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
      cardImageUrl: "",
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

  const {
    formState: { isDirty, errors },
    trigger,
    getValues,
    setValue,
    reset,
  } = methods;

  const level = methods.watch("level");

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
    loadSettings();
    (async () => {
      try {
        const token = localStorage.getItem("institutionToken");
        const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const res = await fetch(`${base}/api/v1/admin/universities?limit=500`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const json = await res.json();
        const unis = json?.data?.universities?.map((u: any) => ({ id: u.id, name: u.name })) || [];
        setUniversities(unis);
        loadProfile(unis);
      } catch {
        loadProfile([]);
      }
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

  const loadProfile = async (unis: { id: number; name: string }[]) => {
    try {
      setLoading(true);
      const res = await api("/api/v1/institution/profile");
      const data = res?.data;
      if (data) {
        if (data.profile_status) setProfileStatus(data.profile_status);

        const primaryUniId = data.university_id || 0;
        // Use university_affiliations if available, otherwise fallback to parsing affiliation string
        let resolvedIds: number[] = [];
        if (data.university_affiliations && Array.isArray(data.university_affiliations) && data.university_affiliations.length > 0) {
          resolvedIds = data.university_affiliations.filter((id: any) => typeof id === "number" && id > 0);
        } else {
          const affiliationNames = (data.affiliation || "").split(",").map((s: string) => s.trim()).filter(Boolean);
          resolvedIds = affiliationNames
            .map((name: string) => unis.find(u => u.name === name)?.id)
            .filter((id: number | undefined) => id && id > 0);
        }

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
          affiliation: data.non_university_affiliation || data.affiliation || "",
          universityIds: resolvedIds.length > 0 ? resolvedIds : (primaryUniId > 0 ? [primaryUniId] : []),
          brochureUrl: data.brochure_data?.url || "",
          about: data.about || "",
          vision: data.vision || "",
          mission: data.mission || "",
          logoUrl: data.logo_url || "",
          bannerUrl: data.banner_url || "",
          cardImageUrl: data.card_image_url || "",
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
            ? data.courses_data.map((c: any, i: number) => ({ ...c, id: c.id || i + 1, sub_description: c.sub_description || "" }))
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
    fieldName: string,
    defaultItem: Omit<T, "id">,
  ) => {
    const current = getValues(fieldName as any) as T[];
    setValue(fieldName as any, [...current, { ...defaultItem, id: Date.now() } as unknown as T], { shouldDirty: true });
  };
  const removeItem = <T extends { id: number }>(
    fieldName: string,
    id: number,
  ) => {
    const current = getValues(fieldName as any) as T[];
    setValue(fieldName as any, current.filter((x) => x.id !== id), { shouldDirty: true });
  };
  const updateItem = (
    fieldName: string,
    id: number,
    field: string,
    value: string,
  ) => {
    const current = getValues(fieldName as any) as any[];
    setValue(fieldName as any, current.map((x: any) => (x.id === id ? { ...x, [field]: value } : x)), { shouldDirty: true });
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
        setValue("bannerUrl", url, { shouldDirty: true });
      } catch {
        /* skip */
      }
      setCropperOpen(false);
      setCropImageSrc(null);
    },
    [bannerFile],
  );

  const handleCardImageCrop = useCallback(
    async (croppedBlob: Blob) => {
      const croppedFile = new File(
        [croppedBlob],
        cardImageFile?.name || "card.jpg",
        { type: "image/jpeg" },
      );
      try {
        const url = await uploadFile(croppedFile, "institution/card");
        setValue("cardImageUrl", url, { shouldDirty: true });
      } catch {
        /* skip */
      }
      setCropperOpen(false);
      setCropImageSrc(null);
    },
    [cardImageFile],
  );

  const addGalleryGroup = () => {
    const gg = getValues("galleryGroups") as GalleryGroup[];
    setValue("galleryGroups", [...gg, { folder: "", images: [] }], { shouldDirty: true });
  };
  const removeGalleryGroup = (groupIndex: number) => {
    const gg = getValues("galleryGroups") as GalleryGroup[];
    setValue("galleryGroups", gg.filter((_, i) => i !== groupIndex), { shouldDirty: true });
  };
  const updateGalleryFolder = (groupIndex: number, value: string) => {
    const gg = getValues("galleryGroups") as GalleryGroup[];
    setValue("galleryGroups", gg.map((g, i) =>
      i === groupIndex ? { ...g, folder: value } : g,
    ), { shouldDirty: true });
  };
  const addGalleryImage = (groupIndex: number) => {
    const gg = getValues("galleryGroups") as GalleryGroup[];
    setValue("galleryGroups", gg.map((g, i) =>
      i === groupIndex && g.images.length < 8
        ? { ...g, images: [...g.images, { title: "", url: "" }] }
        : g,
    ), { shouldDirty: true });
  };
  const removeGalleryImage = (groupIndex: number, imageIndex: number) => {
    const gg = getValues("galleryGroups") as GalleryGroup[];
    setValue("galleryGroups", gg.map((g, i) =>
      i === groupIndex
        ? { ...g, images: g.images.filter((_, pi) => pi !== imageIndex) }
        : g,
    ), { shouldDirty: true });
  };
  const updateGalleryImage = (
    groupIndex: number,
    imageIndex: number,
    field: keyof GalleryEntry,
    value: string,
  ) => {
    const gg = getValues("galleryGroups") as GalleryGroup[];
    setValue("galleryGroups", gg.map((g, i) =>
      i === groupIndex
        ? {
            ...g,
            images: g.images.map((img, pi) =>
              pi === imageIndex ? { ...img, [field]: value } : img,
            ),
          }
        : g,
    ), { shouldDirty: true });
  };
  const handleGalleryFileSelect = async (
    groupIndex: number,
    imageIndex: number,
    file: File,
  ) => {
    setUploadingInfo({ groupIndex, imageIndex });
    try {
      const url = await uploadFile(file, "institution/gallery");
      const gg = getValues("galleryGroups") as GalleryGroup[];
      setValue("galleryGroups", gg.map((g, i) =>
        i === groupIndex
          ? {
              ...g,
              images: g.images.map((img, pi) =>
                pi === imageIndex ? { ...img, url } : img,
              ),
            }
          : g,
      ), { shouldDirty: true });
    } catch {
      /* skip */
    }
    setUploadingInfo(null);
  };



  const saveProfile = async (status: "draft" | "published") => {
    const isValid = await trigger();
    if (!isValid) {
      toast.error("Please fix the errors below");
      setTimeout(() => {
        const findFirstErrorEl = (errors: any, prefix = ""): HTMLElement | null => {
          for (const key of Object.keys(errors)) {
            const err = errors[key];
            if (!err) continue;
            if (err.message) {
              const name = prefix ? `${prefix}.${key}` : key;
              const el = document.querySelector(
                `[name="${name}"], [data-name="${name}"], [data-name^="${name}."]`
              );
              if (el) return el as HTMLElement;
            }
            if (typeof err === "object" && !err.message) {
              if (Array.isArray(err)) {
                for (let i = 0; i < err.length; i++) {
                  if (err[i] && typeof err[i] === "object") {
                    const name = prefix ? `${prefix}.${key}.${i}` : `${key}.${i}`;
                    const found = findFirstErrorEl(err[i], name);
                    if (found) return found;
                  }
                }
              } else {
                const name = prefix ? `${prefix}.${key}` : key;
                const found = findFirstErrorEl(err, name);
                if (found) return found;
              }
            }
          }
          return null;
        };
        const el = findFirstErrorEl(errors);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          (el as HTMLElement).focus();
        }
      }, 100);
      return;
    }

    try {
      setSaving(true);
      setSaved(false);
      const fd = getValues();
      const body = {
        status,
        institution_name: fd.collegeName,
        location: fd.location,
        level: fd.level.join(","),
        website: fd.website,
        contact_email: fd.contactEmail,
        contact_phone: fd.contactPhone,
        map_url: fd.mapUrl,
        facebook_url: fd.facebookUrl,
        instagram_url: fd.instagramUrl,
        tiktok_url: fd.tiktokUrl,
        youtube_url: fd.youtubeUrl,
        linkedin_url: fd.linkedinUrl,
        affiliation: level.some(l => l.includes("Bachelor") || l.includes("Master"))
          ? fd.universityIds.map(id => universities.find(u => u.id === id)?.name || "").filter(Boolean).join(", ")
          : "",
        non_university_affiliation: fd.affiliation || "",
        university_affiliations: fd.universityIds,
        brochure_data: fd.brochureUrl ? { url: fd.brochureUrl } : null,
        logo_url: fd.logoUrl,
        banner_url: fd.bannerUrl,
        card_image_url: fd.cardImageUrl,
        about: fd.about,
        vision: fd.vision,
        mission: fd.mission,
        videos: fd.videos.map(({ id, ...rest }) => rest),
        overview_data: fd.overviewRows.map(({ id, ...rest }) => rest),
        leadership_data: fd.leadershipRows.map(({ id, ...rest }) => rest),
        courses_data: fd.courses.map(({ id, ...rest }) => rest),
        programs_data: fd.programs.map(({ id, ...rest }) => rest),
        facilities_data: fd.facilities.map(({ id, ...rest }) => rest),
        alumni_data: fd.alumni.map(({ id, ...rest }) => rest),
        gallery_data: fd.galleryGroups,
        downloads_data: fd.downloads.map(({ id, ...rest }) => rest),
        faqs_data: fd.faqs.map(({ id, ...rest }) => rest),
      };
      await api("/api/v1/institution/profile", {
        method: "PUT",
        body: JSON.stringify(body),
      });
      setProfileStatus(status);
      setSaved(true);
      reset(fd);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error("Failed to save profile:", e);
      toast.error("Failed to save profile. Please try again.");
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
        <FormProvider {...methods}>
        <div className="max-w-[90rem] mx-auto space-y-8">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Manage Profile
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Update your institution profile information below.
            </p>
          </div>

          {saved && (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 text-sm font-medium">
              <i className="fa-solid fa-check-circle text-green-600"></i>{" "}
              Profile saved successfully!
            </div>
          )}

          <ProfileMediaSection
            logoInputRef={logoInputRef}
            bannerInputRef={bannerInputRef}
            setLogoFile={setLogoFile}
            setBannerFile={setBannerFile}
            setCropImageSrc={setCropImageSrc}
            setCropperOpen={setCropperOpen}
            uploadFile={uploadFile}
            cardImageInputRef={cardImageInputRef}
            setCardImageFile={setCardImageFile}
            cropTarget={cropTarget}
            setCropTarget={setCropTarget}
          />

          <ProfileGeneralSection
            locationRef={locationRef}
            showSuggestions={showSuggestions}
            setShowSuggestions={setShowSuggestions}
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
            filteredDistricts={filteredDistricts}
            toggleLevel={toggleLevel}
            levelOptions={levelOptions}
            level={level}
            universities={universities}
          />

          <ProfileAboutSection
            addItem={addItem}
            removeItem={removeItem}
            updateItem={updateItem}
            uploadFile={uploadFile}
          />

          <ProfileDataSections
            addItem={addItem}
            removeItem={removeItem}
            updateItem={updateItem}
            levelOptions={levelOptions}
          />

          <ProfileAlumniSection
            addItem={addItem}
            removeItem={removeItem}
            updateItem={updateItem}
            uploadFile={uploadFile}
          />

          <ProfileResourcesSection
            addItem={addItem}
            removeItem={removeItem}
            updateItem={updateItem}
            addGalleryGroup={addGalleryGroup}
            removeGalleryGroup={removeGalleryGroup}
            updateGalleryFolder={updateGalleryFolder}
            addGalleryImage={addGalleryImage}
            removeGalleryImage={removeGalleryImage}
            updateGalleryImage={updateGalleryImage}
            handleGalleryFileSelect={handleGalleryFileSelect}
            setUploadingInfo={setUploadingInfo}
            uploadFile={uploadFile}
            uploadingInfo={uploadingInfo}
          />

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
        </FormProvider>
      </form>

      {cropperOpen && cropImageSrc && (
        <ImageCropperModal
          imageSrc={cropImageSrc}
          onCropComplete={cropTarget === "banner" ? handleBannerCrop : handleCardImageCrop}
          onCancel={() => {
            setCropperOpen(false);
            setCropImageSrc(null);
          }}
          aspectRatio={cropTarget === "banner" ? 1920 / 400 : 310 / 140}
        />
      )}
    </div>
  );
};

export default ProfilePage;
