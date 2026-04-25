"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SuperadminSidebar from "@/components/superadmin/dashboard/SuperadminSidebar";
import { useSuperadminAuth } from "@/services/SuperadminAuthContext";
import { College, apiService } from "@/services/api";
import {
  clearCollegeSubscription,
  CollegeSubscriptionPlan,
  CollegeSubscriptionStatus,
  getCollegeSubscription,
  upsertCollegeSubscription,
} from "@/lib/college-subscriptions";
import {
  ArrowLeft,
  Building2,
  CircleDollarSign,
  Globe,
  Image as ImageIcon,
  LoaderCircle,
  Mail,
  MapPin,
  Menu,
  Phone,
  Save,
  ShieldCheck,
  Upload,
  Users,
} from "lucide-react";

type DetailForm = {
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

const emptyDetailForm: DetailForm = {
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

const planOptions: Array<{ label: string; value: CollegeSubscriptionPlan }> = [
  { label: "No Plan", value: "none" },
  { label: "Basic", value: "basic" },
  { label: "Standard", value: "standard" },
  { label: "Premium", value: "premium" },
];

const statusOptions: Array<{ label: string; value: CollegeSubscriptionStatus }> = [
  { label: "Inactive", value: "inactive" },
  { label: "Active", value: "active" },
  { label: "Paused", value: "paused" },
  { label: "Expired", value: "expired" },
];

const CollegeDetailsPage: React.FC = () => {
  const { admin } = useSuperadminAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const collegeId = Number(params?.id);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [college, setCollege] = useState<College | null>(null);
  const [form, setForm] = useState<DetailForm>(emptyDetailForm);
  const [subscription, setSubscription] = useState({
    plan: "none" as CollegeSubscriptionPlan,
    status: "inactive" as CollegeSubscriptionStatus,
    renewalDate: "",
    notes: "",
  });
  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50";

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3000);
  };

  const loadCollege = async () => {
    if (!collegeId || Number.isNaN(collegeId)) {
      showToast("Invalid college ID", "error");
      router.push("/superadmin/colleges");
      return;
    }

    setLoading(true);
    try {
      const result = await apiService.getAdminCollegeById(collegeId);
      const data = result.data;
      setCollege(data);
      setForm({
        name: data.name || "",
        full_name: data.full_name || "",
        location: data.location || "",
        type: data.type || "",
        rating: String(data.rating ?? 0),
        reviews: String(data.reviews ?? 0),
        programs: String(data.programs ?? 0),
        established: data.established || "",
        students: data.students || "",
        description: data.description || "",
        website: data.website || "",
        email: data.email || "",
        phone: data.phone || "",
        image_url: data.image_url || "",
        featured_programs: Array.isArray(data.featured_programs) ? data.featured_programs.join(", ") : "",
        amenities: Array.isArray(data.amenities) ? data.amenities.join(", ") : "",
        profile_tags: Array.isArray(data.profile_tags) ? data.profile_tags.join(", ") : "",
        verified: !!data.verified,
        popular: !!data.popular,
        academic_fit_score: String(data.academic_fit_score ?? 5),
        campus_life_score: String(data.campus_life_score ?? 5),
        career_fit_score: String(data.career_fit_score ?? 5),
        balanced_fit_score: String(data.balanced_fit_score ?? 5),
      });

      const stored = getCollegeSubscription(collegeId);
      if (stored) {
        setSubscription({
          plan: stored.plan,
          status: stored.status,
          renewalDate: stored.renewalDate,
          notes: stored.notes || "",
        });
      }
    } catch {
      showToast("Failed to load college details", "error");
      router.push("/superadmin/colleges");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollege();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collegeId]);

  const setField = <K extends keyof DetailForm>(key: K, value: DetailForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const parseList = (value: string) =>
    value
      .split(/[\n,]/g)
      .map((item) => item.trim())
      .filter(Boolean);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collegeId || !college) return;

    setSaving(true);
    try {
      await apiService.updateCollege(collegeId, {
        name: form.name,
        full_name: form.full_name,
        location: form.location,
        type: form.type,
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
        profile_tags: parseList(form.profile_tags),
        verified: form.verified,
        popular: form.popular,
        academic_fit_score: Number(form.academic_fit_score) || 5,
        campus_life_score: Number(form.campus_life_score) || 5,
        career_fit_score: Number(form.career_fit_score) || 5,
        balanced_fit_score: Number(form.balanced_fit_score) || 5,
      });
      showToast("College details updated");
      await loadCollege();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to save college", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await apiService.uploadCollegeImage(file);
      setField("image_url", url);
      showToast("Hero image uploaded");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Image upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubscriptionSave = () => {
    if (!collegeId) return;
    upsertCollegeSubscription({
      collegeId,
      plan: subscription.plan,
      status: subscription.status,
      renewalDate: subscription.renewalDate,
      notes: subscription.notes,
    });
    showToast("Subscription updated");
  };

  const handleSubscriptionClear = () => {
    if (!collegeId) return;
    clearCollegeSubscription(collegeId);
    setSubscription({ plan: "none", status: "inactive", renewalDate: "", notes: "" });
    showToast("Subscription cleared");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-600">
        <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
        Loading college details...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      <SuperadminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-18 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 shrink-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-slate-50 rounded-lg">
              <Menu size={24} />
            </button>
            <button
              onClick={() => router.push("/superadmin/colleges")}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-500">Superadmin</p>
              <h1 className="text-xl font-bold text-slate-900">{college?.name || "College Details"}</h1>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-bold text-slate-900">{admin ? `${admin.first_name} ${admin.last_name}` : "Super Admin"}</span>
            <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold">Details management</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6">
            <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white p-6 lg:p-8 shadow-xl relative overflow-hidden">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
              <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                <div className="max-w-2xl">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/60 font-semibold">College profile</p>
                  <h2 className="mt-2 text-3xl lg:text-4xl font-black tracking-tight">{college?.name}</h2>
                  <p className="mt-3 text-white/75 leading-relaxed">
                    Edit the college profile, upload the hero image, and manage subscription settings from the superadmin dashboard.
                  </p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Private details page
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
              <form onSubmit={handleSave} className="space-y-6">
                <Card title="Hero Image">
                  <div className="grid grid-cols-1 md:grid-cols-[1.3fr_0.7fr] gap-4">
                    <label className="group relative flex min-h-[240px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors">
                      {form.image_url ? (
                        <img src={form.image_url} alt={college?.name || "College"} className="absolute inset-0 h-full w-full object-cover" />
                      ) : (
                        <div className="text-center px-6">
                          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                            <ImageIcon className="h-7 w-7 text-indigo-600" />
                          </div>
                          <p className="font-semibold text-slate-900">Upload hero image</p>
                          <p className="mt-1 text-sm text-slate-500">Displayed in the superadmin detail view and saved to the backend</p>
                        </div>
                      )}
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      <div className="absolute bottom-4 right-4 rounded-full bg-slate-900/90 text-white px-3 py-2 text-xs font-semibold flex items-center gap-2 shadow-lg">
                        {uploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        {uploading ? "Uploading" : "Change image"}
                      </div>
                    </label>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-4">
                      <Field label="Image URL">
                        <input value={form.image_url} onChange={(e) => setField("image_url", e.target.value)} className={inputClass} />
                      </Field>
                      <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500 leading-relaxed">
                        This is the hero image that will represent the college in this superadmin flow.
                      </div>
                    </div>
                  </div>
                </Card>

                <Card title="College Information">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="College Name" required>
                      <input value={form.name} onChange={(e) => setField("name", e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Full Name">
                      <input value={form.full_name} onChange={(e) => setField("full_name", e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Location" required>
                      <input value={form.location} onChange={(e) => setField("location", e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Type">
                      <input value={form.type} onChange={(e) => setField("type", e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Website">
                      <input value={form.website} onChange={(e) => setField("website", e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Email">
                      <input value={form.email} onChange={(e) => setField("email", e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Phone">
                      <input value={form.phone} onChange={(e) => setField("phone", e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Established">
                      <input value={form.established} onChange={(e) => setField("established", e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Students">
                      <input value={form.students} onChange={(e) => setField("students", e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Programs">
                      <input value={form.programs} onChange={(e) => setField("programs", e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Rating">
                      <input value={form.rating} onChange={(e) => setField("rating", e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Reviews">
                      <input value={form.reviews} onChange={(e) => setField("reviews", e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Profile Tags" hint="Comma separated">
                      <input value={form.profile_tags} onChange={(e) => setField("profile_tags", e.target.value)} className={inputClass} />
                    </Field>
                  </div>
                </Card>

                <Card title="Overview Content">
                  <div className="space-y-4">
                    <Field label="Description">
                      <textarea rows={5} value={form.description} onChange={(e) => setField("description", e.target.value)} className={`${inputClass} resize-none`} />
                    </Field>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Field label="Featured Programs" hint="Comma separated">
                        <textarea rows={4} value={form.featured_programs} onChange={(e) => setField("featured_programs", e.target.value)} className={`${inputClass} resize-none`} />
                      </Field>
                      <Field label="Amenities" hint="Comma separated">
                        <textarea rows={4} value={form.amenities} onChange={(e) => setField("amenities", e.target.value)} className={`${inputClass} resize-none`} />
                      </Field>
                      <Field label="Scores">
                        <div className="grid grid-cols-2 gap-3">
                          <input value={form.academic_fit_score} onChange={(e) => setField("academic_fit_score", e.target.value)} className={inputClass} placeholder="Academic" />
                          <input value={form.campus_life_score} onChange={(e) => setField("campus_life_score", e.target.value)} className={inputClass} placeholder="Campus" />
                          <input value={form.career_fit_score} onChange={(e) => setField("career_fit_score", e.target.value)} className={inputClass} placeholder="Career" />
                          <input value={form.balanced_fit_score} onChange={(e) => setField("balanced_fit_score", e.target.value)} className={inputClass} placeholder="Balanced" />
                        </div>
                      </Field>
                    </div>
                  </div>
                </Card>

                <Card title="Visibility">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Toggle label="Verified" checked={form.verified} onChange={(checked) => setField("verified", checked)} />
                    <Toggle label="Popular" checked={form.popular} onChange={(checked) => setField("popular", checked)} />
                  </div>
                </Card>

                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm disabled:opacity-60">
                  {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save college details
                </button>
              </form>

              <div className="space-y-6">
                <Card title="Quick Summary">
                  <div className="space-y-3">
                    <InfoRow icon={<Building2 className="h-4 w-4" />} label="Name" value={college?.name || "-"} />
                    <InfoRow icon={<MapPin className="h-4 w-4" />} label="Location" value={college?.location || "-"} />
                    <InfoRow icon={<Globe className="h-4 w-4" />} label="Website" value={college?.website || "-"} />
                    <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={college?.email || "-"} />
                    <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={college?.phone || "-"} />
                    <InfoRow icon={<Users className="h-4 w-4" />} label="Programs" value={String(college?.programs ?? 0)} />
                  </div>
                </Card>

                <Card title="Subscription Management">
                  <div className="space-y-4">
                    <Field label="Plan">
                      <select value={subscription.plan} onChange={(e) => setSubscription((prev) => ({ ...prev, plan: e.target.value as CollegeSubscriptionPlan }))} className={inputClass}>
                        {planOptions.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Status">
                      <select value={subscription.status} onChange={(e) => setSubscription((prev) => ({ ...prev, status: e.target.value as CollegeSubscriptionStatus }))} className={inputClass}>
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Renewal Date">
                      <input type="date" value={subscription.renewalDate} onChange={(e) => setSubscription((prev) => ({ ...prev, renewalDate: e.target.value }))} className={inputClass} />
                    </Field>
                    <Field label="Notes">
                      <textarea rows={4} value={subscription.notes} onChange={(e) => setSubscription((prev) => ({ ...prev, notes: e.target.value }))} className={`${inputClass} resize-none`} />
                    </Field>
                    <div className="flex flex-wrap gap-3">
                      <button type="button" onClick={handleSubscriptionSave} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white">
                        <CircleDollarSign className="h-4 w-4" />
                        Save subscription
                      </button>
                      <button type="button" onClick={handleSubscriptionClear} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                        Clear
                      </button>
                    </div>
                  </div>
                </Card>

                <Card title="Preview">
                  {form.image_url ? (
                    <img src={form.image_url} alt={college?.name || "College"} className="mb-4 h-56 w-full rounded-2xl object-cover" />
                  ) : null}
                  <div className="space-y-2 text-sm text-slate-600">
                    <p className="font-semibold text-slate-900">{form.name || "No college name"}</p>
                    <p>{form.description || "No description provided"}</p>
                  </div>
                </Card>
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

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
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

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-slate-400">{icon}</span>
        <span className="text-sm font-semibold text-slate-700">{label}</span>
      </div>
      <span className="text-sm text-slate-600 text-right break-all">{value}</span>
    </div>
  );
}

export default CollegeDetailsPage;
