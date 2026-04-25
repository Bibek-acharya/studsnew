"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SuperadminSidebar from "@/components/superadmin/dashboard/SuperadminSidebar";
import { useSuperadminAuth } from "@/services/SuperadminAuthContext";
import { College, University, apiService } from "@/services/api";
import { getCollegeSubscription } from "@/lib/college-subscriptions";
import {
  BadgeCheck,
  Building2,
  Globe,
  Image as ImageIcon,
  LoaderCircle,
  Mail,
  MapPin,
  Menu,
  Phone,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  Upload,
  Users,
  Pencil,
} from "lucide-react";

type FormState = {
  university_selection: string;
  university_id: string;
  name: string;
  full_name: string;
  location: string;
  type: string;
  rating: string;
  reviews: string;
  programs: string;
  established: string;
  students: string;
  description: string;
  website: string;
  email: string;
  phone: string;
  image_url: string;
  featured_programs: string;
  amenities: string;
  profile_tags: string;
  verified: boolean;
  popular: boolean;
  academic_fit_score: string;
  campus_life_score: string;
  career_fit_score: string;
  balanced_fit_score: string;
};

type UniversityOption = {
  label: string;
  matchers: string[];
};

const UNIVERSITY_OPTIONS: UniversityOption[] = [
  { label: "TU", matchers: ["tribhuvan university", "tu"] },
  { label: "PU", matchers: ["pokhara university", "pu"] },
  { label: "POU", matchers: ["purbanchal university", "pou"] },
  { label: "Foreign University", matchers: ["foreign university", "foreign affiliated", "foreign"] },
];

const normalize = (value: string) => value.trim().toLowerCase();

function findUniversityForOption(universities: University[], option: UniversityOption) {
  return universities.find((university) =>
    option.matchers.some((matcher) => {
      const name = normalize(university.name || "");
      const type = normalize(university.type || "");
      const location = normalize(university.location || "");
      return name.includes(matcher) || type.includes(matcher) || location.includes(matcher);
    }),
  );
}

const emptyForm: FormState = {
  university_selection: "",
  university_id: "",
  name: "",
  full_name: "",
  location: "",
  type: "",
  rating: "0",
  reviews: "0",
  programs: "0",
  established: "",
  students: "",
  description: "",
  website: "",
  email: "",
  phone: "",
  image_url: "",
  featured_programs: "",
  amenities: "",
  profile_tags: "",
  verified: false,
  popular: false,
  academic_fit_score: "5",
  campus_life_score: "5",
  career_fit_score: "5",
  balanced_fit_score: "5",
};

const CollegeManagementPage: React.FC = () => {
  const { admin } = useSuperadminAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [universities, setUniversities] = useState<University[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [selectedCollegeId, setSelectedCollegeId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3000);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [collegeResult, universityResult] = await Promise.all([
        apiService.getAdminColleges({ page: 1, pageSize: 100 }),
        apiService.getUniversities(),
      ]);
      setColleges(collegeResult.data.colleges || []);
      setUniversities(universityResult.data.universities || []);
    } catch {
      setColleges([]);
      setUniversities([]);
      showToast("Unable to load college data", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredColleges = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return colleges;
    return colleges.filter((college) => {
      const haystack = [
        college.name,
        college.full_name,
        college.location,
        college.affiliation,
        college.type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [colleges, search]);

  const stats = useMemo(() => {
    const total = colleges.length;
    const verified = colleges.filter((college) => college.verified).length;
    const featured = colleges.filter((college) => college.featured).length;
    const popular = colleges.filter((college) => college.popular).length;
    return { total, verified, featured, popular };
  }, [colleges]);

  const selectedCollege = useMemo(
    () => colleges.find((college) => college.id === selectedCollegeId) || null,
    [colleges, selectedCollegeId],
  );

  const universityPickerOptions = useMemo(() => {
    return UNIVERSITY_OPTIONS.map((option) => {
      const university = findUniversityForOption(universities, option);
      return {
        label: option.label,
        university,
        id: university?.id ?? null,
      };
    });
  }, [universities]);

  const selectedUniversityLabel = useMemo(() => {
    if (!form.university_selection) return "Select university";

    const selected = universityPickerOptions.find((option) => option.label === form.university_selection);
    if (!selected) return form.university_selection;

    return selected.university?.name ? `${selected.label} - ${selected.university.name}` : selected.label;
  }, [form.university_selection, universityPickerOptions]);

  const resolveUniversitySelection = useCallback(
    (college: College) => {
      const university = college.university_id
        ? universities.find((item) => item.id === college.university_id)
        : null;

      const candidates = [university?.name, university?.type, college.affiliation]
        .filter((value): value is string => Boolean(value))
        .map(normalize);

      const matchedOption = UNIVERSITY_OPTIONS.find((option) =>
        option.matchers.some((matcher) => candidates.some((candidate) => candidate.includes(matcher))),
      );

      return matchedOption?.label || "";
    },
    [universities],
  );

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const parseList = (value: string) =>
    value
      .split(/[\n,]/g)
      .map((item) => item.trim())
      .filter(Boolean);

  const resetForm = () => {
    setForm(emptyForm);
    setSelectedCollegeId(null);
  };

  const fillForm = (college: College) => {
    const universitySelection = resolveUniversitySelection(college);
    setSelectedCollegeId(college.id);
    setForm({
      university_selection: universitySelection,
      university_id: college.university_id ? String(college.university_id) : "",
      name: college.name || "",
      full_name: college.full_name || "",
      location: college.location || "",
      type: college.type || "",
      rating: String(college.rating ?? 0),
      reviews: String(college.reviews ?? 0),
      programs: String(college.programs ?? 0),
      established: college.established || "",
      students: college.students || "",
      description: college.description || "",
      website: college.website || "",
      email: college.email || "",
      phone: college.phone || "",
      image_url: college.image_url || "",
      featured_programs: Array.isArray(college.featured_programs) ? college.featured_programs.join(", ") : "",
      amenities: Array.isArray(college.amenities) ? college.amenities.join(", ") : "",
      profile_tags: Array.isArray(college.profile_tags) ? college.profile_tags.join(", ") : "",
      verified: !!college.verified,
      popular: !!college.popular,
      academic_fit_score: String(college.academic_fit_score ?? 5),
      campus_life_score: String(college.campus_life_score ?? 5),
      career_fit_score: String(college.career_fit_score ?? 5),
      balanced_fit_score: String(college.balanced_fit_score ?? 5),
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await apiService.uploadCollegeImage(file);
      setField("image_url", url);
      showToast("Hero image uploaded successfully");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Image upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.university_id || !form.name || !form.location) {
      showToast("University, college name, and location are required", "error");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        university_id: Number(form.university_id),
        name: form.name,
        full_name: form.full_name,
        location: form.location,
        type: form.type,
        verified: form.verified,
        popular: form.popular,
        rating: Number(form.rating) || 0,
        reviews: Number(form.reviews) || 0,
        programs: Number(form.programs) || 0,
        established: form.established,
        students: form.students,
        description: form.description,
        website: form.website,
        email: form.email,
        phone: form.phone,
        image_url: form.image_url,
        featured_programs: parseList(form.featured_programs),
        amenities: parseList(form.amenities),
        academic_fit_score: Number(form.academic_fit_score) || 5,
        campus_life_score: Number(form.campus_life_score) || 5,
        career_fit_score: Number(form.career_fit_score) || 5,
        balanced_fit_score: Number(form.balanced_fit_score) || 5,
        profile_tags: parseList(form.profile_tags),
      };

      if (selectedCollegeId) {
        await apiService.updateCollege(selectedCollegeId, payload);
        showToast("College updated successfully");
      } else {
        const created = await apiService.createCollege(payload);
        showToast("College created successfully");
        if (created?.data?.id) {
          setSelectedCollegeId(created.data.id);
          router.push(`/superadmin/colleges/${created.data.id}`);
        }
      }

      if (selectedCollegeId) {
        await loadData();
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to save college", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async (college: College) => {
    try {
      await apiService.approveCollege(college.id);
      showToast(`${college.name} approved`);
      loadData();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Approval failed", "error");
    }
  };

  const handleFeatureToggle = async (college: College) => {
    try {
      await apiService.toggleCollegeFeatured(college.id);
      showToast(`${college.name} featured status updated`);
      loadData();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Update failed", "error");
    }
  };

  const handleDelete = async (college: College) => {
    if (!window.confirm(`Delete ${college.name}? This cannot be undone.`)) return;

    try {
      await apiService.deleteCollege(college.id);
      showToast("College deleted successfully");
      if (selectedCollegeId === college.id) resetForm();
      loadData();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Delete failed", "error");
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      <SuperadminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
        <header className="h-18 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 shrink-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-slate-50 rounded-lg">
              <Menu size={24} />
            </button>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-500">Superadmin</p>
              <h1 className="text-xl font-bold text-slate-900">Profile Overview</h1>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 w-[360px]">
            <Search size={18} className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search colleges..."
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-slate-900">{admin ? `${admin.first_name} ${admin.last_name}` : "Super Admin"}</span>
              <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold">Profile Overview</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-sm">
              SA
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white p-6 lg:p-8 shadow-xl overflow-hidden relative">
              <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/60 font-semibold">Single tab workflow</p>
                  <h2 className="mt-2 text-3xl lg:text-4xl font-black tracking-tight">Profile Overview</h2>
                  <p className="mt-3 text-white/75 leading-relaxed">
                    Add and manage college overview content, hero imagery, and public listing details from one place.
                    No admissions, programs, or gallery tabs are exposed here.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-2 text-sm font-semibold">
                  <ShieldCheck size={18} />
                  Superadmin only
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard label="Total Colleges" value={stats.total} icon={<Building2 className="w-5 h-5" />} />
              <StatCard label="Verified" value={stats.verified} icon={<BadgeCheck className="w-5 h-5" />} accent="emerald" />
              <StatCard label="Featured" value={stats.featured} icon={<Sparkles className="w-5 h-5" />} accent="amber" />
              <StatCard label="Popular" value={stats.popular} icon={<Star className="w-5 h-5" />} accent="indigo" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Section title="Hero Section Image" subtitle="Upload the image that represents the college in the overview and listing cards.">
                  <div className="grid grid-cols-1 md:grid-cols-[1.3fr_0.7fr] gap-4">
                    <label className="group relative flex min-h-[240px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors">
                      {form.image_url ? (
                        <img src={form.image_url} alt="College hero" className="absolute inset-0 h-full w-full object-cover" />
                      ) : (
                        <div className="text-center px-6">
                          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                            <ImageIcon className="h-7 w-7 text-indigo-600" />
                          </div>
                          <p className="font-semibold text-slate-900">Upload hero image</p>
                          <p className="mt-1 text-sm text-slate-500">PNG, JPG, WebP supported</p>
                        </div>
                      )}
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      <div className="absolute bottom-4 right-4 rounded-full bg-slate-900/90 text-white px-3 py-2 text-xs font-semibold flex items-center gap-2 shadow-lg">
                        {uploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        {uploading ? "Uploading" : "Change image"}
                      </div>
                    </label>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Globe className="h-4 w-4 text-indigo-500" />
                        Image URL
                      </div>
                      <input
                        value={form.image_url}
                        onChange={(e) => setField("image_url", e.target.value)}
                        placeholder="https://..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                      />
                      <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500 leading-relaxed">
                        This image is saved to the backend and re-used in the college list and public views.
                      </div>
                    </div>
                  </div>
                </Section>

                <Section title="College Identity" subtitle="Create the public-facing profile data for this college.">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="University" required>
                      <select
                        value={form.university_selection}
                        onChange={(e) => {
                          const selection = e.target.value;
                          const option = UNIVERSITY_OPTIONS.find((item) => item.label === selection);
                          const university = option ? findUniversityForOption(universities, option) : undefined;

                          setForm((prev) => ({
                            ...prev,
                            university_selection: selection,
                            university_id: university ? String(university.id) : "",
                          }));
                        }}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                      >
                        <option value="">Select university</option>
                        {universityPickerOptions.map((option) => (
                          <option key={option.label} value={option.label} disabled={!option.id}>
                            {option.label}{option.university?.name ? ` - ${option.university.name}` : " - unavailable"}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="College Name" required>
                      <input value={form.name} onChange={(e) => setField("name", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50" />
                    </Field>
                    <Field label="Full Name">
                      <input value={form.full_name} onChange={(e) => setField("full_name", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50" />
                    </Field>
                    <Field label="Location" required>
                      <input value={form.location} onChange={(e) => setField("location", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50" />
                    </Field>
                    <Field label="College Type">
                      <input value={form.type} onChange={(e) => setField("type", e.target.value)} placeholder="Private / Public / Community" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50" />
                    </Field>
                    <Field label="Website">
                      <input value={form.website} onChange={(e) => setField("website", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50" />
                    </Field>
                    <Field label="Email">
                      <input value={form.email} onChange={(e) => setField("email", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50" />
                    </Field>
                    <Field label="Phone">
                      <input value={form.phone} onChange={(e) => setField("phone", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50" />
                    </Field>
                    <Field label="Affiliation" hint="Derived from the selected university">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        {selectedUniversityLabel}
                      </div>
                    </Field>
                  </div>
                </Section>

                <Section title="Overview Content" subtitle="This is the content that appears in the college overview area.">
                  <div className="space-y-4">
                    <Field label="Description">
                      <textarea value={form.description} onChange={(e) => setField("description", e.target.value)} rows={5} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 resize-none" />
                    </Field>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Field label="Established">
                        <input value={form.established} onChange={(e) => setField("established", e.target.value)} placeholder="1999" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50" />
                      </Field>
                      <Field label="Students">
                        <input value={form.students} onChange={(e) => setField("students", e.target.value)} placeholder="5,000+" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50" />
                      </Field>
                      <Field label="Programs">
                        <input value={form.programs} onChange={(e) => setField("programs", e.target.value)} placeholder="12" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50" />
                      </Field>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Field label="Rating">
                        <input value={form.rating} onChange={(e) => setField("rating", e.target.value)} placeholder="4.5" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50" />
                      </Field>
                      <Field label="Reviews">
                        <input value={form.reviews} onChange={(e) => setField("reviews", e.target.value)} placeholder="210" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50" />
                      </Field>
                      <Field label="Profile Tags" hint="Separate with commas">
                        <input value={form.profile_tags} onChange={(e) => setField("profile_tags", e.target.value)} placeholder="Top-ranked, City campus, Research-led" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50" />
                      </Field>
                    </div>
                  </div>
                </Section>

                <Section title="Visibility and Scores" subtitle="Control how the college appears across the platform.">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Toggle label="Verified" checked={form.verified} onChange={(checked) => setField("verified", checked)} />
                      <Toggle label="Popular" checked={form.popular} onChange={(checked) => setField("popular", checked)} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <MiniScore label="Academic" value={form.academic_fit_score} onChange={(value) => setField("academic_fit_score", value)} />
                      <MiniScore label="Campus Life" value={form.campus_life_score} onChange={(value) => setField("campus_life_score", value)} />
                      <MiniScore label="Career" value={form.career_fit_score} onChange={(value) => setField("career_fit_score", value)} />
                      <MiniScore label="Balanced" value={form.balanced_fit_score} onChange={(value) => setField("balanced_fit_score", value)} />
                    </div>
                  </div>
                </Section>

                <Section title="Public Highlights" subtitle="Comma-separated lists for the public overview card.">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Featured Programs" hint="Comma separated">
                      <textarea value={form.featured_programs} onChange={(e) => setField("featured_programs", e.target.value)} rows={4} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 resize-none" />
                    </Field>
                    <Field label="Amenities" hint="Comma separated">
                      <textarea value={form.amenities} onChange={(e) => setField("amenities", e.target.value)} rows={4} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 resize-none" />
                    </Field>
                  </div>
                </Section>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
                  >
                    {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    {selectedCollegeId ? "Update college" : "Add College"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reset form
                  </button>
                </div>
              </form>

              <div className="space-y-6">
                <Section title="College Preview" subtitle="A quick read-only snapshot of the selected college.">
                  {selectedCollege ? (
                    <div className="space-y-4">
                      <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100">
                        <img
                          src={selectedCollege.image_url || "/images/college-placeholder.png"}
                          alt={selectedCollege.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{selectedCollege.name}</h3>
                        <p className="text-sm text-slate-500 mt-1">{selectedCollege.full_name || selectedCollege.affiliation}</p>
                      </div>
                      <div className="space-y-2 text-sm text-slate-600">
                        <PreviewRow icon={<MapPin className="h-4 w-4" />} text={selectedCollege.location || "No location"} />
                        <PreviewRow icon={<Globe className="h-4 w-4" />} text={selectedCollege.website || "No website"} />
                        <PreviewRow icon={<Mail className="h-4 w-4" />} text={selectedCollege.email || "No email"} />
                        <PreviewRow icon={<Phone className="h-4 w-4" />} text={selectedCollege.phone || "No phone"} />
                        <PreviewRow icon={<Users className="h-4 w-4" />} text={`${selectedCollege.programs ?? 0} programs`} />
                      </div>
                    </div>
                  ) : (
                    <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                        <Building2 className="h-6 w-6 text-slate-500" />
                      </div>
                      <p className="font-semibold text-slate-900">No college selected</p>
                      <p className="mt-1 text-sm text-slate-500">Choose a college from the list to edit its profile overview.</p>
                    </div>
                  )}
                </Section>

                <Section title="College Directory" subtitle="Manage the existing colleges in the backend.">
                  <div className="mb-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <Search className="h-4 w-4 text-slate-400" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by name, location, affiliation..."
                      className="w-full bg-transparent text-sm outline-none"
                    />
                  </div>

                  <div className="space-y-3 max-h-[900px] overflow-y-auto pr-1">
                    {loading ? (
                      <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-slate-500">
                        <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                        Loading colleges...
                      </div>
                    ) : filteredColleges.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                        No colleges found.
                      </div>
                    ) : (
                      filteredColleges.map((college) => (
                        <div key={college.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                          <div className="flex gap-4">
                            <img
                              src={college.image_url || "/images/college-placeholder.png"}
                              alt={college.name}
                              className="h-24 w-24 rounded-2xl object-cover bg-slate-100 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="truncate text-base font-bold text-slate-900">{college.name}</h3>
                                    {college.verified && <Badge label="Verified" tone="emerald" />}
                                    {college.featured && <Badge label="Featured" tone="amber" />}
                                    {college.popular && <Badge label="Popular" tone="indigo" />}
                                  </div>
                                  <p className="mt-1 text-sm text-slate-500 line-clamp-1">{college.location} {college.affiliation ? `• ${college.affiliation}` : ""}</p>
                                  <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                                    <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 text-amber-500" /> {college.rating ?? 0}</span>
                                    <span>{college.reviews ?? 0} reviews</span>
                                    <span>{college.type || "College"}</span>
                                    {getCollegeSubscription(college.id) ? (
                                      <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 font-semibold text-indigo-700">
                                        Subscription
                                      </span>
                                    ) : null}
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <ActionButton icon={<Globe className="h-4 w-4" />} label="Details" onClick={() => router.push(`/superadmin/colleges/${college.id}`)} />
                                  <ActionButton icon={<Pencil className="h-4 w-4" />} label="Edit" onClick={() => fillForm(college)} />
                                  <ActionButton icon={<BadgeCheck className="h-4 w-4" />} label="Approve" onClick={() => handleApprove(college)} />
                                  <ActionButton icon={<Sparkles className="h-4 w-4" />} label="Feature" onClick={() => handleFeatureToggle(college)} />
                                  <ActionButton icon={<Trash2 className="h-4 w-4" />} label="Delete" danger onClick={() => handleDelete(college)} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Section>
              </div>
            </div>
          </div>
        </main>

        {toast && (
          <div className={`fixed bottom-5 right-5 z-50 rounded-2xl px-4 py-3 shadow-xl text-sm font-medium ${toast.type === "success" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"}`}>
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
};

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-700">
          {label} {required ? <span className="text-rose-500">*</span> : null}
        </span>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors ${
        checked ? "border-indigo-200 bg-indigo-50" : "border-slate-200 bg-white hover:bg-slate-50"
      }`}
    >
      <span className="font-semibold text-slate-800">{label}</span>
      <span className={`inline-flex h-6 w-11 items-center rounded-full p-1 transition-colors ${checked ? "bg-indigo-600" : "bg-slate-300"}`}>
        <span className={`h-4 w-4 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </span>
    </button>
  );
}

function MiniScore({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
      />
    </label>
  );
}

function Badge({
  label,
  tone,
}: {
  label: string;
  tone: "emerald" | "amber" | "indigo";
}) {
  const tones: Record<"emerald" | "amber" | "indigo", string> = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };
  return <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${tones[tone]}`}>{label}</span>;
}

function ActionButton({
  label,
  icon,
  onClick,
  danger,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
        danger
          ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent = "slate",
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent?: "slate" | "emerald" | "amber" | "indigo";
}) {
  const accentStyles: Record<"slate" | "emerald" | "amber" | "indigo", string> = {
    slate: "bg-slate-100 text-slate-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    indigo: "bg-indigo-50 text-indigo-700",
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accentStyles[accent]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function PreviewRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <span className="mt-0.5 text-slate-400">{icon}</span>
      <span className="text-sm text-slate-700 break-all">{text}</span>
    </div>
  );
}

export default CollegeManagementPage;
