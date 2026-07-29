"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";
import RichTextEditor from "@/components/ScholarshipProvider/common/RichTextEditor";
import ImageCropperModal from "@/components/ScholarshipProvider/common/ImageCropperModal";
import { NEPAL_PROVINCES, NEPAL_DISTRICTS, NEPAL_LOCAL_BODIES } from "@/lib/location-data";


interface VideoItem {
  id: number;
  url: string;
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

interface QuickHighlightRow {
  id: number;
  key: string;
  value: string;
}

interface CourseItem {
  id: number;
  name: string;
  level: string;
  duration: string;
  fees: string;
  eligibility: string;
  seats: string;
  specialization: string;
  sub_description: string;
}
interface FacultyProgram {
  id: number;
  name: string;
  duration: string;
  fee: string;
}
interface FacultyCollege {
  id: number;
  name: string;
  location: string;
}
interface FacultyItem {
  id: number;
  name: string;
  programs: FacultyProgram[];
  colleges: FacultyCollege[];
}
interface ScholarshipItem {
  id: number;
  program: string;
  name: string;
  benefit: string;
  eligibility: string;
  level: string;
  application_link: string;
}
interface DownloadItem {
  id: number;
  title: string;
  type: string;
  url: string;
}
interface GalleryImage {
  id: number;
  url: string;
  caption: string;
}
interface GalleryAlbum {
  id: number;
  folder: string;
  images: GalleryImage[];
}
interface FacultyItem {
  id: number;
  name: string;
  programs: FacultyProgram[];
  colleges: FacultyCollege[];
}
interface AdmissionItem {
  id: number;
  program: string;
  faculty: string;
  status: string;
  opens_from: string;
  deadline: string;
  fee: string;
  application_link: string;
}


const inputClass =
  "w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors";

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
  const [locState, setLocState] = useState("");
  const [locDistrict, setLocDistrict] = useState("");
  const [locMunicipality, setLocMunicipality] = useState("");
  const [locWard, setLocWard] = useState("");
  const [locStreet, setLocStreet] = useState("");
  const [type, setType] = useState("");
  const [isNepali, setIsNepali] = useState(true);
  const [rank, setRank] = useState<number>(0);
  const [verified, setVerified] = useState(false);
  const [description, setDescription] = useState("");
  const [established, setEstablished] = useState("");

  const [website, setWebsite] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [prospectusFile, setProspectusFile] = useState<File | null>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [cropperTarget, setCropperTarget] = useState<"logo" | "cover">("cover");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [aboutText, setAboutText] = useState("");
  const [prospectusTitle, setProspectusTitle] = useState("");
  const [prospectusUrl, setProspectusUrl] = useState("");
  const [vision, setVision] = useState("");
  const [mission, setMission] = useState("");
  const [overviewRows, setOverviewRows] = useState<OverviewRow[]>([]);
  const [leadershipRows, setLeadershipRows] = useState<LeadershipRow[]>([]);
  const [contactAddress, setContactAddress] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactWebsite, setContactWebsite] = useState("");
  const [contactFacebook, setContactFacebook] = useState("");
  const [contactInstagram, setContactInstagram] = useState("");
  const [contactYoutube, setContactYoutube] = useState("");
  const [contactLinkedin, setContactLinkedin] = useState("");
  const [mapEmbed, setMapEmbed] = useState("");


  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [scholarships, setScholarships] = useState<ScholarshipItem[]>([]);

  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [gallery, setGallery] = useState<GalleryAlbum[]>([]);
  const [faculties, setFaculties] = useState<FacultyItem[]>([]);
  const [admissions, setAdmissions] = useState<AdmissionItem[]>([]);

  const [locStateSearch, setLocStateSearch] = useState("");
  const [locDistrictSearch, setLocDistrictSearch] = useState("");
  const [locMunicipalitySearch, setLocMunicipalitySearch] = useState("");
  const [locWardSearch, setLocWardSearch] = useState("");
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [showMunicipalityDropdown, setShowMunicipalityDropdown] = useState(false);
  const [showWardDropdown, setShowWardDropdown] = useState(false);
  const [stateFocusIdx, setStateFocusIdx] = useState(-1);
  const [districtFocusIdx, setDistrictFocusIdx] = useState(-1);
  const [municipalityFocusIdx, setMunicipalityFocusIdx] = useState(-1);
  const [wardFocusIdx, setWardFocusIdx] = useState(-1);
  const stateRef = useRef<HTMLDivElement>(null);
  const districtRef = useRef<HTMLDivElement>(null);
  const municipalityRef = useRef<HTMLDivElement>(null);
  const wardRef = useRef<HTMLDivElement>(null);
  const stateInputRef = useRef<HTMLInputElement>(null);
  const districtInputRef = useRef<HTMLInputElement>(null);
  const municipalityInputRef = useRef<HTMLInputElement>(null);
  const wardInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const getToken = () => localStorage.getItem("superadmin_token");
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
    const res = await fetch(
      `${base}/api/v1/superadmin/upload?folder=${folder}`,
      {
        method: "POST",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: formData,
      },
    );
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
        if (d.contact) {
          const c = typeof d.contact === "object" ? d.contact : {};
          setLocState(c.state || "");
          setLocDistrict(c.district || "");
          setLocMunicipality(c.municipality || "");
          setLocWard(c.ward || "");
          setLocStreet(c.street || "");
        }
        setIsNepali(d.is_nepali !== false);
        setRank(d.rank || 0);
        setVerified(d.verified || false);
        setDescription(d.description || "");
        setEstablished(d.established || "");
        setWebsite(d.website || "");
        setLogoUrl(d.logo || "");
        setCoverUrl(d.cover || "");

        const parseJson = (raw: any) => {
          if (!raw) return null;
          if (typeof raw === "object") return raw;
          if (typeof raw === "string") {
            try {
              return JSON.parse(raw);
            } catch {}
            try {
              return JSON.parse(decodeURIComponent(escape(atob(raw))));
            } catch {}
          }
          return null;
        };

        const withId = (arr: any[]) =>
          (arr || []).map((item: any, i: number) => ({
            ...item,
            id: Date.now() + i,
          }));

        const aboutData = parseJson(d.about);
        if (aboutData) {
          if (aboutData.videos) setVideos(withId(aboutData.videos));
          if (aboutData.description) setAboutText(aboutData.description);
          if (aboutData.vision) setVision(aboutData.vision);
          if (aboutData.mission) setMission(aboutData.mission);
          if (aboutData.prospectus_title) setProspectusTitle(aboutData.prospectus_title);
          if (aboutData.prospectus_url) setProspectusUrl(aboutData.prospectus_url);
        }

        const overviewData = parseJson(d.overview);
        if (overviewData) {
          const rows = Array.isArray(overviewData)
            ? overviewData
            : Object.entries(overviewData).map(([k, v]) => ({
                key: k,
                value: String(v),
              }));
          setOverviewRows(withId(rows));
        }

        const leadershipData = parseJson(d.leadership);
        if (leadershipData) {
          setLeadershipRows(
            withId(Array.isArray(leadershipData) ? leadershipData : []),
          );
        }

        const contactData = parseJson(d.contact);
        if (contactData) {
          setContactAddress(contactData.address || "");
          setContactPhone(contactData.phone || "");
          setContactEmail(contactData.email || "");
          setContactWebsite(contactData.website || "");
          if (contactData.facebook) setContactFacebook(contactData.facebook);
          if (contactData.instagram) setContactInstagram(contactData.instagram);
          if (contactData.youtube) setContactYoutube(contactData.youtube);
          if (contactData.linkedin) setContactLinkedin(contactData.linkedin);
          setMapEmbed(contactData.map_embed || "");
        }

        if (d.courses) setCourses(withId(parseJson(d.courses) || []));
        if (d.scholarships)
          setScholarships(withId(parseJson(d.scholarships) || []));
        if (d.downloads) setDownloads(withId(parseJson(d.downloads) || []));
        if (d.gallery) {
          const parsed = parseJson(d.gallery);
          if (parsed) {
            if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].images) {
              setGallery(withId(parsed.map((album: any) => ({ ...album, images: withId(album.images || []) }))));
            } else {
              setGallery(withId(parsed));
            }
          }
        }
        if (d.faculties) setFaculties(withId(parseJson(d.faculties) || []));
        if (d.admissions) setAdmissions(withId(parseJson(d.admissions) || []));
      })
      .catch(() => {});
  }, [editId]);


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

  const stripId = (arr: any[]): any[] => arr.map(({ id, images, programs, colleges, ...rest }: any) => ({
    ...rest,
    ...(images ? { images: images.map(({ id: imgId, ...imgRest }: any) => imgRest) } : {}),
    ...(programs ? { programs: programs.map(({ id: pId, ...pRest }: any) => pRest) } : {}),
    ...(colleges ? { colleges: colleges.map(({ id: cId, ...cRest }: any) => cRest) } : {}),
  }));

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (stateRef.current && !stateRef.current.contains(e.target as Node)) setShowStateDropdown(false);
      if (districtRef.current && !districtRef.current.contains(e.target as Node)) setShowDistrictDropdown(false);
      if (municipalityRef.current && !municipalityRef.current.contains(e.target as Node)) setShowMunicipalityDropdown(false);
      if (wardRef.current && !wardRef.current.contains(e.target as Node)) setShowWardDropdown(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleCoverCrop = useCallback(
    (croppedBlob: Blob) => {
      const croppedFile = new File([croppedBlob], "cover.jpg", {
        type: "image/jpeg",
      });
      if (cropperTarget === "cover") {
        setCoverFile(croppedFile);
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) setCoverUrl(ev.target.result as string);
        };
        reader.readAsDataURL(croppedBlob);
      } else {
        setLogoFile(croppedFile);
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) setLogoUrl(ev.target.result as string);
        };
        reader.readAsDataURL(croppedBlob);
      }
      setCropperOpen(false);
      setCropImageSrc(null);
    },
    [cropperTarget],
  );

  const handleSubmit = async (
    e: React.FormEvent | React.MouseEvent,
    status: "draft" | "published" = "published",
  ) => {
    e.preventDefault();
    setFormError("");
    setFieldErrors({});

    if (status === "published") {
      const errs: Record<string, string> = {};
      if (!name.trim()) errs.name = "University name is required";
      if (!description.trim()) errs.description = "Description is required";
      if (!locDistrict.trim()) errs.location = "District is required";
      if (!type.trim()) errs.type = "Type is required";

      if (Object.keys(errs).length > 0) {
        setFieldErrors(errs);
        if (formRef.current) {
          const firstInput = formRef.current.querySelector('input, select, textarea') as HTMLElement | null;
          if (firstInput) {
            firstInput.focus();
            firstInput.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
        return;
      }
    }

    try {
      setSaving(true);
      let finalLogoUrl = logoUrl;
      let finalCoverUrl = coverUrl;
      let finalProspectusUrl = prospectusUrl;
      if (logoFile) {
        try {
          finalLogoUrl = await uploadFile(logoFile, "university/logo");
        } catch {}
      }
      if (coverFile) {
        try {
          finalCoverUrl = await uploadFile(coverFile, "university/cover");
        } catch {}
      }
      if (prospectusFile) {
        try {
          finalProspectusUrl = await uploadFile(prospectusFile, "university/prospectus");
        } catch {}
      }

      const body: Record<string, any> = {
        name,
        logo: finalLogoUrl.startsWith("data:") ? "" : finalLogoUrl,
        cover: finalCoverUrl.startsWith("data:") ? "" : finalCoverUrl,
        type,
        is_nepali: isNepali,
        rank,
        verified,
        status,
        description,
        established,
        website,
        about: {
          videos: stripId(videos),
          description: aboutText,
          vision,
          mission,
          prospectus_title: prospectusTitle,
          prospectus_url: finalProspectusUrl,
        },
        location: [locState, locDistrict, locMunicipality, locWard ? `Ward ${locWard}` : "", locStreet].filter(Boolean).join(", ") || location,
        contact: {
          address: contactAddress,
          phone: contactPhone,
          email: contactEmail,
          website: contactWebsite,
          state: locState,
          district: locDistrict,
          municipality: locMunicipality,
          ward: locWard,
          street: locStreet,
          facebook: contactFacebook,
          instagram: contactInstagram,
          youtube: contactYoutube,
          linkedin: contactLinkedin,
          map_embed: mapEmbed,
        },
        overview: stripId(overviewRows),
        leadership: stripId(leadershipRows),

        courses: stripId(courses),
        scholarships: stripId(scholarships),
        downloads: stripId(downloads),
        gallery: stripId(gallery),
        faculties: stripId(faculties),
        admissions: stripId(admissions),
      };

      const targetSection = status === "draft" ? "draft-universities" : "list-universities";

      if (editId) {
        await api(`/api/v1/admin/universities/${editId}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
        toast.success("University updated successfully!");
        setTimeout(() => setActiveSection(targetSection), 800);
      } else {
        await api("/api/v1/admin/universities", {
          method: "POST",
          body: JSON.stringify(body),
        });
        toast.success("University created successfully!");
        setTimeout(() => setActiveSection(targetSection), 800);
      }
    } catch (err: any) {
      setFormError(
        err?.message ||
          `Failed to ${editId ? "update" : "create"} university. Please try again.`,
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4 md:p-8 font-sans">
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="max-w-[90rem] mx-auto space-y-8">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {editId ? "Edit University" : "Add University"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {editId
                ? "Update the university profile data."
                : "Register a new university with complete profile information."}
            </p>
          </div>



          {/* ─── Logo & Cover ─── */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              <i className="fa-solid fa-image text-blue-500 mr-2"></i>Logo &
              Cover
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-8 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  University Logo
                </label>
                <div
                  onClick={() => logoInputRef.current?.click()}
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition cursor-pointer bg-gray-50 relative overflow-hidden h-40"
                >
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      className="absolute inset-0 w-full h-full object-contain p-2"
                      alt="Logo"
                    />
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
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setLogoFile(file);
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        if (ev.target?.result)
                          setLogoUrl(ev.target.result as string);
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </div>
              </div>
              <div className="md:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image
                </label>
                <div
                  onClick={() => coverInputRef.current?.click()}
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition cursor-pointer bg-gray-50 relative overflow-hidden h-40"
                >
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      className="absolute inset-0 w-full h-full object-cover"
                      alt="Cover"
                    />
                  ) : (
                    <div className="space-y-1 text-center self-center">
                      <i className="fa-regular fa-image text-4xl text-gray-400"></i>
                      <div className="flex text-sm text-gray-600 justify-center mt-3">
                        <span className="font-medium text-blue-600 hover:text-blue-500">
                          Upload cover
                        </span>
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
              <i className="fa-solid fa-school text-blue-500 mr-2"></i>Basic
              Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  University Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Enter university name"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setFieldErrors((prev) => ({ ...prev, name: "" })); }}
                  required
                />
                {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
              </div>
              <div className="relative" ref={stateRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input ref={stateInputRef} type="text" className={inputClass} placeholder="Search state..." value={locStateSearch || locState} onChange={(e) => { setLocStateSearch(e.target.value); setShowStateDropdown(true); setStateFocusIdx(0); }} onFocus={() => setShowStateDropdown(true)} onKeyDown={(e) => { const opts = NEPAL_PROVINCES.filter((p) => p.toLowerCase().includes((locStateSearch || "").toLowerCase())); if (e.key === "ArrowDown") { e.preventDefault(); setStateFocusIdx((prev) => Math.min(prev + 1, opts.length - 1)); } else if (e.key === "ArrowUp") { e.preventDefault(); setStateFocusIdx((prev) => Math.max(prev - 1, 0)); } else if (e.key === "Enter" && stateFocusIdx >= 0 && opts[stateFocusIdx]) { e.preventDefault(); const v = opts[stateFocusIdx]; setLocState(v); setLocStateSearch(""); setShowStateDropdown(false); setStateFocusIdx(-1); setLocDistrict(""); setLocMunicipality(""); setLocWard(""); } }} />
                {showStateDropdown && (
                  <div className="absolute z-20 top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                    {NEPAL_PROVINCES.filter((p) => p.toLowerCase().includes((locStateSearch || "").toLowerCase())).map((p, i) => (
                      <button key={p} type="button" className={`w-full text-left px-3 py-2 text-sm ${stateFocusIdx === i ? "bg-blue-50 text-blue-600" : "hover:bg-blue-50 hover:text-blue-600"}`} onMouseEnter={() => setStateFocusIdx(i)} onClick={() => { setLocState(p); setLocStateSearch(""); setShowStateDropdown(false); setStateFocusIdx(-1); setLocDistrict(""); setLocMunicipality(""); setLocWard(""); }}>{p}</button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative" ref={districtRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">District <span className="text-red-500">*</span></label>
                <input ref={districtInputRef} type="text" className={inputClass} placeholder="Search district..." value={locDistrictSearch || locDistrict} onChange={(e) => { setLocDistrictSearch(e.target.value); setShowDistrictDropdown(true); setDistrictFocusIdx(0); }} onFocus={() => setShowDistrictDropdown(true)} onKeyDown={(e) => { const opts = locState ? (NEPAL_DISTRICTS as Record<string, string[]>)[locState] || [] : []; const filtered = opts.filter((d) => d.toLowerCase().includes((locDistrictSearch || "").toLowerCase())); if (e.key === "ArrowDown") { e.preventDefault(); setDistrictFocusIdx((prev) => Math.min(prev + 1, filtered.length - 1)); } else if (e.key === "ArrowUp") { e.preventDefault(); setDistrictFocusIdx((prev) => Math.max(prev - 1, 0)); } else if (e.key === "Enter" && districtFocusIdx >= 0 && filtered[districtFocusIdx]) { e.preventDefault(); const v = filtered[districtFocusIdx]; setLocDistrict(v); setLocDistrictSearch(""); setShowDistrictDropdown(false); setDistrictFocusIdx(-1); setLocMunicipality(""); setLocWard(""); } }} />
                {fieldErrors.location && <p className="mt-1 text-xs text-red-500">{fieldErrors.location}</p>}
                {showDistrictDropdown && locState && (
                  <div className="absolute z-20 top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                    {((NEPAL_DISTRICTS as Record<string, string[]>)[locState] || []).filter((d) => d.toLowerCase().includes((locDistrictSearch || "").toLowerCase())).map((d, i) => (
                      <button key={d} type="button" className={`w-full text-left px-3 py-2 text-sm ${districtFocusIdx === i ? "bg-blue-50 text-blue-600" : "hover:bg-blue-50 hover:text-blue-600"}`} onMouseEnter={() => setDistrictFocusIdx(i)} onClick={() => { setLocDistrict(d); setLocDistrictSearch(""); setShowDistrictDropdown(false); setDistrictFocusIdx(-1); setLocMunicipality(""); setLocWard(""); }}>{d}</button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative" ref={municipalityRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Municipality</label>
                <input ref={municipalityInputRef} type="text" className={inputClass} placeholder="Search municipality..." value={locMunicipalitySearch || locMunicipality} onChange={(e) => { setLocMunicipalitySearch(e.target.value); setShowMunicipalityDropdown(true); setMunicipalityFocusIdx(0); }} onFocus={() => setShowMunicipalityDropdown(true)} onKeyDown={(e) => { const opts = locDistrict ? (NEPAL_LOCAL_BODIES as Record<string, {name: string; wards: number}[]>)[locDistrict] || [] : []; const filtered = opts.filter((m) => m.name.toLowerCase().includes((locMunicipalitySearch || "").toLowerCase())); if (e.key === "ArrowDown") { e.preventDefault(); setMunicipalityFocusIdx((prev) => Math.min(prev + 1, filtered.length - 1)); } else if (e.key === "ArrowUp") { e.preventDefault(); setMunicipalityFocusIdx((prev) => Math.max(prev - 1, 0)); } else if (e.key === "Enter" && municipalityFocusIdx >= 0 && filtered[municipalityFocusIdx]) { e.preventDefault(); const v = filtered[municipalityFocusIdx].name; setLocMunicipality(v); setLocMunicipalitySearch(""); setShowMunicipalityDropdown(false); setMunicipalityFocusIdx(-1); setLocWard(""); } }} />
                {showMunicipalityDropdown && locDistrict && (
                  <div className="absolute z-20 top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                    {((NEPAL_LOCAL_BODIES as Record<string, {name: string; wards: number}[]>)[locDistrict] || []).filter((m) => m.name.toLowerCase().includes((locMunicipalitySearch || "").toLowerCase())).map((m, i) => (
                      <button key={m.name} type="button" className={`w-full text-left px-3 py-2 text-sm ${municipalityFocusIdx === i ? "bg-blue-50 text-blue-600" : "hover:bg-blue-50 hover:text-blue-600"}`} onMouseEnter={() => setMunicipalityFocusIdx(i)} onClick={() => { setLocMunicipality(m.name); setLocMunicipalitySearch(""); setShowMunicipalityDropdown(false); setMunicipalityFocusIdx(-1); setLocWard(""); }}>{m.name}</button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative" ref={wardRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ward No.</label>
                <input ref={wardInputRef} type="text" className={inputClass} placeholder="Search ward..." value={locWardSearch || locWard} onChange={(e) => { setLocWardSearch(e.target.value); setShowWardDropdown(true); setWardFocusIdx(0); }} onFocus={() => setShowWardDropdown(true)} onKeyDown={(e) => { const body = ((NEPAL_LOCAL_BODIES as Record<string, {name: string; wards: number}[]>)[locDistrict] || []).find((b) => b.name === locMunicipality); const opts = body ? Array.from({ length: body.wards }, (_, i) => String(i + 1)) : []; const filtered = opts.filter((w) => w.includes(locWardSearch || "")); if (e.key === "ArrowDown") { e.preventDefault(); setWardFocusIdx((prev) => Math.min(prev + 1, filtered.length - 1)); } else if (e.key === "ArrowUp") { e.preventDefault(); setWardFocusIdx((prev) => Math.max(prev - 1, 0)); } else if (e.key === "Enter" && wardFocusIdx >= 0 && filtered[wardFocusIdx]) { e.preventDefault(); setLocWard(filtered[wardFocusIdx]); setLocWardSearch(""); setShowWardDropdown(false); setWardFocusIdx(-1); } }} />
                {showWardDropdown && locMunicipality && (() => {
                  const body = ((NEPAL_LOCAL_BODIES as Record<string, {name: string; wards: number}[]>)[locDistrict] || []).find((b) => b.name === locMunicipality);
                  return body ? (
                    <div className="absolute z-20 top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                      {Array.from({ length: body.wards }, (_, i) => String(i + 1)).filter((w) => w.includes(locWardSearch || "")).map((w, i) => (
                        <button key={w} type="button" className={`w-full text-left px-3 py-2 text-sm ${wardFocusIdx === i ? "bg-blue-50 text-blue-600" : "hover:bg-blue-50 hover:text-blue-600"}`} onMouseEnter={() => setWardFocusIdx(i)} onClick={() => { setLocWard(w); setLocWardSearch(""); setShowWardDropdown(false); setWardFocusIdx(-1); }}>Ward {w}</button>
                      ))}
                    </div>
                  ) : null;
                })()}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
                <input type="text" className={inputClass} placeholder="e.g. Kirtipur" value={locStreet} onChange={(e) => setLocStreet(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  className={inputClass}
                  value={type}
                  onChange={(e) => { setType(e.target.value); setFieldErrors((prev) => ({ ...prev, type: "" })); }}
                >
                  <option value="">Select type</option>
                  {UNIVERSITY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {fieldErrors.type && <p className="mt-1 text-xs text-red-500">{fieldErrors.type}</p>}
              </div>
              <div>
                <label className="flex items-center gap-3 cursor-pointer h-full pt-6">
                  <div
                    role="switch"
                    aria-checked={isNepali}
                    onClick={() => setIsNepali(!isNepali)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${isNepali ? "bg-blue-600" : "bg-gray-300"}`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${isNepali ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Nepali University
                  </span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Established Year
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="e.g. 1959"
                  value={established}
                  onChange={(e) => setEstablished(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rank
                </label>
                <input
                  type="number"
                  className={inputClass}
                  placeholder="0"
                  value={rank}
                  onChange={(e) => setRank(Number(e.target.value))}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="www.university.edu"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
            </div>
          </div>



          {/* ─── Description ─── */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              <i className="fa-solid fa-circle-info text-blue-500 mr-2"></i>
              Description
            </h3>
            <RichTextEditor
              value={description}
              onChange={(val: string) => { setDescription(val); setFieldErrors((prev) => ({ ...prev, description: "" })); }}
              placeholder="Write a detailed description of the university..."
              minHeight={200}
            />
            {fieldErrors.description && <p className="mt-1 text-xs text-red-500">{fieldErrors.description}</p>}
          </div>

          {/* ─── About Section ─── */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              <i className="fa-solid fa-circle-info text-blue-500 mr-2"></i>
              About Section
            </h3>
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-0">
                  Video Link
                </label>
                <button
                  type="button"
                  onClick={() =>
                    videos.length < 1 &&
                    addItem(setVideos, { url: "" })
                  }
                  className={`text-sm px-3 py-1.5 rounded-md font-medium ${videos.length >= 1 ? "text-gray-400 bg-gray-100 cursor-not-allowed" : "text-blue-600 bg-blue-50 hover:bg-blue-100"}`}
                >
                  <i className="fa-solid fa-plus mr-1"></i> Add Video
                </button>
              </div>
              <div className="space-y-3">
                {videos.map((v) => (
                  <div
                    key={v.id}
                    className="bg-gray-50 border border-gray-200 rounded-md p-4 relative group"
                  >
                    <button
                      type="button"
                      onClick={() => removeItem(setVideos, v.id)}
                      className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                    <div className="pr-10">
                      <input
                        type="url"
                        className={`${inputClass} text-sm`}
                        placeholder="Video URL"
                        value={v.url}
                        onChange={(e) =>
                          updateItem(setVideos, v.id, "url", e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
                {videos.length === 0 && (
                  <p className="text-sm text-gray-400 py-2">No videos added.</p>
                )}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                About Text
              </label>
              <RichTextEditor
                value={aboutText}
                onChange={setAboutText}
                placeholder="About the university..."
                minHeight={200}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vision
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
                  Mission
                </label>
                <RichTextEditor
                  value={mission}
                  onChange={setMission}
                  placeholder="Our mission is..."
                  minHeight={150}
                />
              </div>
            </div>
          </div>

          {/* ─── Prospectus ─── */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              <i className="fa-solid fa-file-pdf text-blue-500 mr-2"></i>Prospectus
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="e.g. General Prospectus 2025"
                  value={prospectusTitle}
                  onChange={(e) => setProspectusTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">PDF File</label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer bg-white border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                    <i className="fa-solid fa-upload mr-2"></i>
                    {prospectusFile ? prospectusFile.name : "Choose PDF"}
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setProspectusFile(file);
                      }}
                    />
                  </label>
                  {prospectusFile && (
                    <button
                      type="button"
                      onClick={() => { setProspectusFile(null); setProspectusUrl(""); }}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      <i className="fa-solid fa-times"></i> Remove
                    </button>
                  )}
                </div>
                {prospectusUrl && !prospectusFile && (
                  <p className="mt-1 text-xs text-gray-500">
                    <i className="fa-solid fa-file-pdf text-red-500 mr-1"></i>
                    Current: {prospectusTitle || "Prospectus"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ─── Overview ─── */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                <i className="fa-solid fa-table-list text-blue-500 mr-2"></i>
                University Overview
              </h3>
              <button
                type="button"
                onClick={() => addItem(setOverviewRows, { key: "", value: "" })}
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
                        updateItem(setOverviewRows, r.id, "key", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className={`${inputClass} text-sm`}
                      placeholder="Value (e.g. 1959)"
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

          {/* ─── Leadership & Administration ─── */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                <i className="fa-solid fa-users text-blue-500 mr-2"></i>
                Leadership & Administration
              </h3>
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

          {/* ─── Contact Information ─── */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              <i className="fa-solid fa-address-book text-blue-500 mr-2"></i>
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Physical address"
                  value={contactAddress}
                  onChange={(e) => setContactAddress(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Phone number"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className={inputClass}
                  placeholder="contact@university.edu"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Website
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="www.university.edu"
                  value={contactWebsite}
                  onChange={(e) => setContactWebsite(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <label className="block text-sm font-medium text-gray-700">Social Media Links</label>
              <input type="url" className={inputClass} placeholder="Facebook URL (https://facebook.com/...)" value={contactFacebook} onChange={(e) => setContactFacebook(e.target.value)} />
              <input type="url" className={inputClass} placeholder="Instagram URL (https://instagram.com/...)" value={contactInstagram} onChange={(e) => setContactInstagram(e.target.value)} />
              <input type="url" className={inputClass} placeholder="YouTube URL (https://youtube.com/...)" value={contactYoutube} onChange={(e) => setContactYoutube(e.target.value)} />
              <input type="url" className={inputClass} placeholder="LinkedIn URL (https://linkedin.com/...)" value={contactLinkedin} onChange={(e) => setContactLinkedin(e.target.value)} />
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Maps Embed URL
              </label>
              <input
                type="text"
                className={inputClass}
                placeholder="Google Maps embed URL"
                value={mapEmbed}
                onChange={(e) => setMapEmbed(e.target.value)}
              />
            </div>
          </div>



          {/* ═══════════════ COURSES ═══════════════ */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
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
                    level: "",
                    duration: "",
                    fees: "",
                    eligibility: "",
                    seats: "",
                    specialization: "",
                    sub_description: "",
                  })
                }
                className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium"
              >
                <i className="fa-solid fa-plus mr-1"></i> Add Course
              </button>
            </div>
            <div className="space-y-4">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-10">
                    <input
                      type="text"
                      className={`${inputClass} text-sm`}
                      placeholder="Course Name"
                      value={c.name}
                      onChange={(e) =>
                        updateItem(setCourses, c.id, "name", e.target.value)
                      }
                    />
                    <select
                      className={`${inputClass} text-sm`}
                      value={c.level}
                      onChange={(e) =>
                        updateItem(setCourses, c.id, "level", e.target.value)
                      }
                    >
                      <option value="">Select Level</option>
                      <option value="Bachelor's">Bachelor's</option>
                      <option value="Master">Master</option>
                    </select>
                    <input
                      type="text"
                      className={`${inputClass} text-sm`}
                      placeholder="Duration (e.g. 4 Year)"
                      value={c.duration}
                      onChange={(e) =>
                        updateItem(setCourses, c.id, "duration", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className={`${inputClass} text-sm`}
                      placeholder="Fees (e.g. Rs. 4,50,000)"
                      value={c.fees}
                      onChange={(e) =>
                        updateItem(setCourses, c.id, "fees", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className={`${inputClass} text-sm`}
                      placeholder="Eligibility (e.g. 10+2 with 75%)"
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
                    <input
                      type="text"
                      className={`${inputClass} text-sm`}
                      placeholder="Seats (e.g. 120)"
                      value={c.seats}
                      onChange={(e) =>
                        updateItem(setCourses, c.id, "seats", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className={`${inputClass} text-sm`}
                      placeholder="Specialization (e.g. AI, Data Science)"
                      value={c.specialization}
                      onChange={(e) =>
                        updateItem(
                          setCourses,
                          c.id,
                          "specialization",
                          e.target.value,
                        )
                      }
                    />
                    <input
                      type="text"
                      className={`${inputClass} text-sm`}
                      placeholder="Sub Description (e.g. Honors program)"
                      value={c.sub_description}
                      onChange={(e) =>
                        updateItem(
                          setCourses,
                          c.id,
                          "sub_description",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </div>
              ))}
              {courses.length === 0 && (
                <p className="text-sm text-gray-400 py-2">No courses added.</p>
              )}
            </div>
          </div>

          {/* ═══════════════ SCHOLARSHIPS ═══════════════ */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                <i className="fa-solid fa-hand-holding-heart text-blue-500 mr-2"></i>
                Scholarships
              </h3>
              <button
                type="button"
                onClick={() =>
                  addItem(setScholarships, {
                    program: "",
                    name: "",
                    benefit: "",
                    eligibility: "",
                    level: "",
                    application_link: "",
                  })
                }
                className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium"
              >
                <i className="fa-solid fa-plus mr-1"></i> Add Scholarship
              </button>
            </div>
            <div className="space-y-4">
              {scholarships.map((s) => (
                <div
                  key={s.id}
                  className="bg-gray-50 border border-gray-200 rounded-md p-4 relative group"
                >
                  <button
                    type="button"
                    onClick={() => removeItem(setScholarships, s.id)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pr-10">
                    <input
                      type="text"
                      className={`${inputClass} text-sm`}
                      placeholder="Scholarship Name"
                      value={s.name}
                      onChange={(e) =>
                        updateItem(
                          setScholarships,
                          s.id,
                          "name",
                          e.target.value,
                        )
                      }
                    />
                    <input
                      type="text"
                      className={`${inputClass} text-sm`}
                      placeholder="Program"
                      value={s.program}
                      onChange={(e) =>
                        updateItem(
                          setScholarships,
                          s.id,
                          "program",
                          e.target.value,
                        )
                      }
                    />
                    <input
                      type="text"
                      className={`${inputClass} text-sm`}
                      placeholder="Level (e.g. Bachelor)"
                      value={s.level}
                      onChange={(e) =>
                        updateItem(
                          setScholarships,
                          s.id,
                          "level",
                          e.target.value,
                        )
                      }
                    />
                    <input
                      type="text"
                      className={`${inputClass} text-sm`}
                      placeholder="Benefit (e.g. 100% waiver)"
                      value={s.benefit}
                      onChange={(e) =>
                        updateItem(
                          setScholarships,
                          s.id,
                          "benefit",
                          e.target.value,
                        )
                      }
                    />
                    <input
                      type="text"
                      className={`${inputClass} text-sm`}
                      placeholder="Eligibility (e.g. Top 5%)"
                      value={s.eligibility}
                      onChange={(e) =>
                        updateItem(
                          setScholarships,
                          s.id,
                          "eligibility",
                          e.target.value,
                        )
                      }
                    />
                    <input
                      type="url"
                      className={`${inputClass} text-sm`}
                      placeholder="Application Link"
                      value={s.application_link}
                      onChange={(e) =>
                        updateItem(
                          setScholarships,
                          s.id,
                          "application_link",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </div>
              ))}
              {scholarships.length === 0 && (
                <p className="text-sm text-gray-400 py-2">
                  No scholarships added.
                </p>
              )}
            </div>
          </div>
          {/* ═══════════════ DOWNLOADS ═══════════════ */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                <i className="fa-solid fa-download text-blue-500 mr-2"></i>
                Downloads
              </h3>
              <button
                type="button"
                onClick={() =>
                  addItem(setDownloads, { title: "", type: "", url: "" })
                }
                className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium"
              >
                <i className="fa-solid fa-plus mr-1"></i> Add Download
              </button>
            </div>
            <div className="space-y-4">
              {downloads.map((d) => (
                <div
                  key={d.id}
                  className="bg-gray-50 border border-gray-200 rounded-md p-4 relative group"
                >
                  <button
                    type="button"
                    onClick={() => removeItem(setDownloads, d.id)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-10">
                    <input
                      type="text"
                      className={`${inputClass} text-sm`}
                      placeholder="Title (e.g. General Prospectus 2025)"
                      value={d.title}
                      onChange={(e) =>
                        updateItem(setDownloads, d.id, "title", e.target.value)
                      }
                    />
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer bg-white border border-gray-300 rounded-md px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors flex-1 text-center">
                        <i className="fa-solid fa-upload mr-1"></i>
                        {d.url ? "Change File" : "Choose File"}
                        <input
                          type="file"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              const url = await uploadFile(file, "university/downloads");
                              const ext = file.name.split(".").pop()?.toUpperCase() || "";
                              setDownloads((prev: any[]) => prev.map((x) => x.id === d.id ? { ...x, url, type: ext } : x));
                            } catch {}
                          }}
                        />
                      </label>
                      {d.url && (
                        <button
                          type="button"
                          onClick={() => updateItem(setDownloads, d.id, "url", "")}
                          className="text-red-400 hover:text-red-600 text-sm shrink-0"
                        >
                          <i className="fa-solid fa-times"></i>
                        </button>
                      )}
                    </div>
                  </div>
                  {d.url && (
                    <p className="mt-1 text-xs text-gray-500">
                      <i className="fa-solid fa-file text-blue-500 mr-1"></i>
                      {d.title || "File"} {d.type ? `(${d.type})` : ""}
                    </p>
                  )}
                </div>
              ))}
              {downloads.length === 0 && (
                <p className="text-sm text-gray-400 py-2">
                  No downloads added.
                </p>
              )}
            </div>
          </div>

          {/* ═══════════════ GALLERY ═══════════════ */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
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
                onClick={() => setGallery((prev: any[]) => [...prev, { id: Date.now(), folder: "", images: [] }])}
              >
                <i className="fa-solid fa-plus"></i> Add Gallery Group
              </button>
            </div>
            <div className="p-6 space-y-8">
              {gallery.map((group: any, groupIndex: number) => (
                <div key={group.id} className="border border-gray-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Gallery Folder Name</label>
                      <input
                        type="text"
                        className="w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-sm"
                        placeholder="e.g. Campus Tour"
                        value={group.folder}
                        onChange={(e) => setGallery((prev: any[]) => prev.map((g) => g.id === group.id ? { ...g, folder: e.target.value } : g))}
                      />
                    </div>
                    <button
                      type="button"
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg shrink-0 mt-5"
                      onClick={() => setGallery((prev: any[]) => prev.filter((g) => g.id !== group.id))}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {(group.images || []).map((img: any, imageIndex: number) => (
                      <div key={img.id} className="border border-gray-200 rounded-2xl p-4 bg-white relative">
                        <button
                          type="button"
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center z-10"
                          onClick={() => setGallery((prev: any[]) => prev.map((g) => g.id === group.id ? { ...g, images: g.images.filter((im: any) => im.id !== img.id) } : g))}
                        >
                          <i className="fa-solid fa-times text-sm"></i>
                        </button>
                        <label className="cursor-pointer block">
                          {img.url ? (
                            <div className="relative">
                              <img src={img.url} className="w-full h-44 object-cover rounded-2xl" alt="" />
                              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition rounded-2xl flex items-center justify-center">
                                <span className="text-white opacity-0 hover:opacity-100 text-sm font-medium">Click to change</span>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-44 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50/40 transition">
                              <i className="fa-solid fa-cloud-arrow-up text-3xl text-gray-300 mb-2"></i>
                              <p className="text-sm text-gray-500">Click to upload</p>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                const url = await uploadFile(file, "university/gallery");
                                setGallery((prev: any[]) => prev.map((g) => g.id === group.id ? { ...g, images: g.images.map((im: any) => im.id === img.id ? { ...im, url } : im) } : g));
                              } catch {}
                            }}
                          />
                        </label>
                        <div className="mt-4">
                          <label className="text-sm font-medium text-gray-700 block mb-1.5">Image Title</label>
                          <input
                            type="text"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500 text-sm"
                            placeholder="e.g. Main Building"
                            value={img.caption || img.title || ""}
                            onChange={(e) => setGallery((prev: any[]) => prev.map((g) => g.id === group.id ? { ...g, images: g.images.map((im: any) => im.id === img.id ? { ...im, caption: e.target.value, title: e.target.value } : im) } : g))}
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="border-2 border-dashed border-gray-300 rounded-2xl min-h-[280px] flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50/40 transition"
                      onClick={() => setGallery((prev: any[]) => prev.map((g) => g.id === group.id ? { ...g, images: [...(g.images || []), { id: Date.now(), url: "", caption: "" }] } : g))}
                    >
                      <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 text-3xl mb-4">
                        <i className="fa-solid fa-plus"></i>
                      </div>
                      <p className="font-semibold text-gray-800">Add Image</p>
                    </button>
                  </div>
                </div>
              ))}
              {gallery.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No gallery images added yet.</p>
              )}
            </div>
          </div>

          {/* ═══════════════ FACULTIES ═══════════════ */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                <i className="fa-solid fa-building-columns text-blue-500 mr-2"></i>
                Faculties & Institutes
              </h3>
              <button
                type="button"
                onClick={() =>
                  addItem(setFaculties, { name: "", programs: [], colleges: [] })
                }
                className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium"
              >
                <i className="fa-solid fa-plus mr-1"></i> Add Faculty
              </button>
            </div>
            <div className="space-y-4">
              {faculties.map((f) => (
                <div
                  key={f.id}
                  className="bg-gray-50 border border-gray-200 rounded-md p-4 relative group"
                >
                  <button
                    type="button"
                    onClick={() => removeItem(setFaculties, f.id)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <div className="pr-10 mb-4">
                    <input
                      type="text"
                      className={`${inputClass} text-sm`}
                      placeholder="Faculty/Institute Name"
                      value={f.name}
                      onChange={(e) =>
                        updateItem(setFaculties, f.id, "name", e.target.value)
                      }
                    />
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Programs</h4>
                    <div className="overflow-x-auto border border-gray-200 rounded-md">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-3 py-2 text-left font-semibold text-gray-700 w-10">SN</th>
                            <th className="px-3 py-2 text-left font-semibold text-gray-700">Program</th>
                            <th className="px-3 py-2 text-left font-semibold text-gray-700">Duration</th>
                            <th className="px-3 py-2 text-left font-semibold text-gray-700">Yearly/Semester</th>
                            <th className="px-3 py-2 text-center w-10"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {(f.programs || []).map((p: any, pi: number) => (
                            <tr key={p.id}>
                              <td className="px-3 py-2 text-gray-500">{pi + 1}</td>
                              <td className="px-3 py-2">
                                <input type="text" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500" placeholder="Program name" value={p.name} onChange={(e) => { const updated = [...(f.programs || [])]; updated[pi] = { ...updated[pi], name: e.target.value }; setFaculties((prev: any[]) => prev.map((x) => x.id === f.id ? { ...x, programs: updated } : x)); }} />
                              </td>
                              <td className="px-3 py-2">
                                <input type="text" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500" placeholder="e.g. 4 Years" value={p.duration} onChange={(e) => { const updated = [...(f.programs || [])]; updated[pi] = { ...updated[pi], duration: e.target.value }; setFaculties((prev: any[]) => prev.map((x) => x.id === f.id ? { ...x, programs: updated } : x)); }} />
                              </td>
                              <td className="px-3 py-2">
                                <input type="text" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500" placeholder="e.g. Rs. 80,000" value={p.fee} onChange={(e) => { const updated = [...(f.programs || [])]; updated[pi] = { ...updated[pi], fee: e.target.value }; setFaculties((prev: any[]) => prev.map((x) => x.id === f.id ? { ...x, programs: updated } : x)); }} />
                              </td>
                              <td className="px-3 py-2 text-center">
                                <button onClick={() => setFaculties((prev: any[]) => prev.map((x) => x.id === f.id ? { ...x, programs: (x.programs || []).filter((_: any, i: number) => i !== pi) } : x))} className="text-red-400 hover:text-red-600 text-xs"><i className="fa-solid fa-times"></i></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button onClick={() => setFaculties((prev: any[]) => prev.map((x) => x.id === f.id ? { ...x, programs: [...(x.programs || []), { id: Date.now(), name: "", duration: "", fee: "" }] } : x))} className="mt-2 text-xs text-blue-600 hover:text-blue-800"><i className="fa-solid fa-plus mr-1"></i> Add Program</button>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Colleges</h4>
                    <div className="overflow-x-auto border border-gray-200 rounded-md">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-3 py-2 text-left font-semibold text-gray-700 w-10">SN</th>
                            <th className="px-3 py-2 text-left font-semibold text-gray-700">College Name</th>
                            <th className="px-3 py-2 text-left font-semibold text-gray-700">Location</th>
                            <th className="px-3 py-2 text-center w-10"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {(f.colleges || []).map((c: any, ci: number) => (
                            <tr key={c.id}>
                              <td className="px-3 py-2 text-gray-500">{ci + 1}</td>
                              <td className="px-3 py-2">
                                <input type="text" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500" placeholder="College name" value={c.name} onChange={(e) => { const updated = [...(f.colleges || [])]; updated[ci] = { ...updated[ci], name: e.target.value }; setFaculties((prev: any[]) => prev.map((x) => x.id === f.id ? { ...x, colleges: updated } : x)); }} />
                              </td>
                              <td className="px-3 py-2">
                                <input type="text" className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500" placeholder="Location" value={c.location} onChange={(e) => { const updated = [...(f.colleges || [])]; updated[ci] = { ...updated[ci], location: e.target.value }; setFaculties((prev: any[]) => prev.map((x) => x.id === f.id ? { ...x, colleges: updated } : x)); }} />
                              </td>
                              <td className="px-3 py-2 text-center">
                                <button onClick={() => setFaculties((prev: any[]) => prev.map((x) => x.id === f.id ? { ...x, colleges: (x.colleges || []).filter((_: any, i: number) => i !== ci) } : x))} className="text-red-400 hover:text-red-600 text-xs"><i className="fa-solid fa-times"></i></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button onClick={() => setFaculties((prev: any[]) => prev.map((x) => x.id === f.id ? { ...x, colleges: [...(x.colleges || []), { id: Date.now(), name: "", location: "" }] } : x))} className="mt-2 text-xs text-blue-600 hover:text-blue-800"><i className="fa-solid fa-plus mr-1"></i> Add College</button>
                  </div>
                </div>
              ))}
              {faculties.length === 0 && (
                <p className="text-sm text-gray-400 py-2">No faculties added.</p>
              )}
            </div>
          </div>

          {/* ═══════════════ ADMISSIONS ═══════════════ */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                <i className="fa-solid fa-file-lines text-blue-500 mr-2"></i>
                Admissions
              </h3>
              <button
                type="button"
                onClick={() =>
                  addItem(setAdmissions, {
                    program: "",
                    faculty: "",
                    status: "Open",
                    opens_from: "",
                    deadline: "",
                    fee: "",
                    application_link: "",
                  })
                }
                className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium"
              >
                <i className="fa-solid fa-plus mr-1"></i> Add Admission
              </button>
            </div>
            <div className="space-y-4">
              {admissions.map((a) => (
                <div
                  key={a.id}
                  className="bg-gray-50 border border-gray-200 rounded-md p-4 relative group"
                >
                  <button
                    type="button"
                    onClick={() => removeItem(setAdmissions, a.id)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-10">
                    <input
                      type="text"
                      className={`${inputClass} text-sm`}
                      placeholder="Program"
                      value={a.program}
                      onChange={(e) =>
                        updateItem(
                          setAdmissions,
                          a.id,
                          "program",
                          e.target.value,
                        )
                      }
                    />
                    <input
                      type="text"
                      className={`${inputClass} text-sm`}
                      placeholder="Faculty"
                      value={a.faculty}
                      onChange={(e) =>
                        updateItem(
                          setAdmissions,
                          a.id,
                          "faculty",
                          e.target.value,
                        )
                      }
                    />
                    <select
                      className={`${inputClass} text-sm`}
                      value={a.status}
                      onChange={(e) =>
                        updateItem(
                          setAdmissions,
                          a.id,
                          "status",
                          e.target.value,
                        )
                      }
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      className={`${inputClass} text-sm`}
                      placeholder="Opens From"
                      value={a.opens_from}
                      onChange={(e) =>
                        updateItem(
                          setAdmissions,
                          a.id,
                          "opens_from",
                          e.target.value,
                        )
                      }
                    />
                    <input
                      type="text"
                      className={`${inputClass} text-sm`}
                      placeholder="Deadline"
                      value={a.deadline}
                      onChange={(e) =>
                        updateItem(
                          setAdmissions,
                          a.id,
                          "deadline",
                          e.target.value,
                        )
                      }
                    />
                    <input
                      type="text"
                      className={`${inputClass} text-sm`}
                      placeholder="Application Fee"
                      value={a.fee}
                      onChange={(e) =>
                        updateItem(
                          setAdmissions,
                          a.id,
                          "fee",
                          e.target.value,
                        )
                      }
                    />
                    <input
                      type="url"
                      className={`${inputClass} text-sm`}
                      placeholder="Application Link"
                      value={a.application_link}
                      onChange={(e) =>
                        updateItem(
                          setAdmissions,
                          a.id,
                          "application_link",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </div>
              ))}
              {admissions.length === 0 && (
                <p className="text-sm text-gray-400 py-2">
                  No admission entries added.
                </p>
              )}
            </div>
          </div>

          {/* ─── Verified ─── */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                role="switch"
                aria-checked={verified}
                onClick={() => setVerified(!verified)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${verified ? "bg-blue-600" : "bg-gray-300"}`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${verified ? "translate-x-5" : "translate-x-0"}`}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Verified University
              </span>
            </label>
          </div>

          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm font-medium">
              <i className="fa-solid fa-exclamation-circle mr-2"></i>
              {formError}
            </div>
          )}

          {/* ─── Footer ─── */}
          <div className="flex items-center justify-end space-x-4 pt-6 mt-8 border-t border-gray-200 pb-10">
            <button
              type="button"
              onClick={() => setActiveSection("list-universities")}
              className="px-6 py-2.5 bg-white border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={(e) => handleSubmit(e, "draft")}
              className="px-6 py-2.5 bg-gray-600 text-white rounded-md font-medium hover:bg-gray-700 transition flex items-center gap-2 disabled:opacity-50"
            >
              <i
                className={`fa-solid ${saving ? "fa-spinner fa-spin" : "fa-save"}`}
              ></i>
              {saving ? "Saving..." : "Save as Draft"}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
            >
              <i
                className={`fa-solid ${saving ? "fa-spinner fa-spin" : "fa-check"}`}
              ></i>
              {saving
                ? editId
                  ? "Updating..."
                  : "Publishing..."
                : editId
                  ? "Update University"
                  : "Publish University"}
            </button>
          </div>
        </div>
      </form>

      {cropperOpen && cropImageSrc && (
        <ImageCropperModal
          imageSrc={cropImageSrc}
          onCropComplete={handleCoverCrop}
          onCancel={() => {
            setCropperOpen(false);
            setCropImageSrc(null);
          }}
          aspectRatio={cropperTarget === "cover" ? 1920 / 360 : 1}
        />
      )}
    </div>
  );
}
