"use client";

import React, { memo, useEffect, useState } from "react";
import { Building2, Home, Image, Mail, Phone, BadgeInfo, Globe, CreditCard, Plus, Pencil, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import FileUpload from "./common/FileUpload";
import ConfirmationModal from "./common/ConfirmationModal";
import { scholarshipProviderApi, ProviderProfile } from "@/services/scholarshipProviderApi";
import {
  getServices, createService, updateService, deleteService,
  getSectors, createSector, updateSector, deleteSector,
  getProjects, createProject, updateProject, deleteProject,
  getGalleryImages, createGalleryImage, updateGalleryImage, deleteGalleryImage,
  getReviews, createReview, updateReview, deleteReview,
} from "@/services/scholarshipProviderApi";

const TABS = ["Details", "Services", "Sectors", "Projects", "Gallery", "Reviews"] as const;
type Tab = (typeof TABS)[number];

const OrganizationProfile: React.FC = memo(() => {
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("Details");
  const [providerName, setProviderName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [address, setAddress] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [mission, setMission] = useState("");
  const [values, setValues] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Content management state
  const [services, setServices] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [showForm, setShowForm] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: number | null; type: string }>({ isOpen: false, id: null, type: "" });

  useEffect(() => {
    let mounted = true;
    async function loadProfile() {
      try {
        const data = await scholarshipProviderApi.getProfile();
        if (!mounted) return;
        setProfile(data);
        setProviderName(data.provider_name || "");
        setRegistrationNumber(data.registration_number || "");
        setEmail(data.email || "");
        setContactNumber(data.contact_number || "");
        setPanNumber(data.pan_number || "");
        setWebsiteUrl(data.website_url || "");
        setAddress(data.address || "");
        setAboutText(data.about_text || "");
        setMission(data.mission || "");
        setValues(data.values || "");
        if (data.logo_url) { setLogoUrl(data.logo_url); setLogoPreview(data.logo_url); }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadProfile();
    loadContent();
    return () => { mounted = false; };
  }, []);

  const loadContent = async () => {
    try {
      const [s, sec, p, g, r] = await Promise.all([
        getServices().catch(() => []),
        getSectors().catch(() => []),
        getProjects().catch(() => []),
        getGalleryImages().catch(() => []),
        getReviews().catch(() => []),
      ]);
      setServices(s); setSectors(sec); setProjects(p); setGallery(g); setReviews(r);
    } catch {}
  };

  const handleLogoSelect = async (file: File) => {
    setLogoPreview(URL.createObjectURL(file));
    setUploadingLogo(true);
    try {
      const url = await scholarshipProviderApi.uploadImage(file, "logos");
      setLogoUrl(url); setLogoPreview(url);
      toast.success("Logo uploaded");
    } catch (err) {
      setLogoUrl(""); setLogoPreview("");
      toast.error(err instanceof Error ? err.message : "Failed to upload logo");
    } finally { setUploadingLogo(false); }
  };

  const handleSaveProfile = async () => {
    if (!providerName.trim() || !registrationNumber.trim()) {
      toast.error("Organization name and registration number are required");
      return;
    }
    setSaving(true);
    try {
      const updated = await scholarshipProviderApi.updateProfile({
        provider_name: providerName,
        registration_number: registrationNumber,
        contact_number: contactNumber,
        pan_number: panNumber,
        website_url: websiteUrl,
        logo_url: logoUrl,
        address,
        about_text: aboutText,
        mission,
        values,
      });
      setProfile(updated);
      toast.success("Profile updated successfully.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save profile");
    } finally { setSaving(false); }
  };

  const handleContentSubmit = async (type: string, data: any) => {
    try {
      const editing = showForm?.editing;
      if (type === "services") {
        if (editing) { await updateService(editing, data); } else { await createService(data); }
      } else if (type === "sectors") {
        if (editing) { await updateSector(editing, data); } else { await createSector(data); }
      } else if (type === "projects") {
        if (editing) { await updateProject(editing, data); } else { await createProject(data); }
      } else if (type === "gallery") {
        if (editing) { await updateGalleryImage(editing, data); } else { await createGalleryImage(data); }
      } else if (type === "reviews") {
        if (editing) { await updateReview(editing, data); } else { await createReview(data); }
      }
      toast.success(editing ? "Updated" : "Created");
      setShowForm(null);
      loadContent();
    } catch { toast.error("Failed to save"); }
  };

  const handleContentDelete = async () => {
    if (!deleteModal.id) return;
    try {
      const t = deleteModal.type;
      if (t === "services") { await deleteService(deleteModal.id); }
      else if (t === "sectors") { await deleteSector(deleteModal.id); }
      else if (t === "projects") { await deleteProject(deleteModal.id); }
      else if (t === "gallery") { await deleteGalleryImage(deleteModal.id); }
      else if (t === "reviews") { await deleteReview(deleteModal.id); }
      toast.success("Deleted");
      loadContent();
    } catch { toast.error("Failed to delete"); }
    setDeleteModal({ isOpen: false, id: null, type: "" });
  };

  if (loading) return <div className="py-12 text-center text-slate-500">Loading profile...</div>;

  const renderForm = () => {
    if (!showForm) return null;
    const { type, data } = showForm;
    const [form, setForm] = useState(data || {});

    return (
      <div className="bg-white rounded-lg p-6 border border-slate-100 space-y-4 mb-6">
        {type === "services" && (
          <>
            <input placeholder="Icon name (e.g. coffee, book-open)" value={form.icon || ""} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            <input placeholder="Title" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            <textarea placeholder="Description" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" rows={3} />
          </>
        )}
        {type === "sectors" && (
          <>
            <input placeholder="Name" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            <textarea placeholder="Description" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" rows={3} />
            <div className="flex gap-4 items-center">
              <label className="text-sm text-gray-600">Color:</label>
              <input type="color" value={form.color || "#2563eb"} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-10 h-10 rounded cursor-pointer" />
              <input placeholder="Icon name" value={form.icon || ""} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
            <input placeholder="Image URL" value={form.image_url || ""} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </>
        )}
        {type === "projects" && (
          <>
            <input placeholder="Title" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            <textarea placeholder="Description" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" rows={3} />
            <input placeholder="Image URL" value={form.image_url || ""} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            <div className="flex gap-4">
              <input placeholder="Category" value={form.category || ""} onChange={(e) => setForm({ ...form, category: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              <input type="date" value={form.date || ""} onChange={(e) => setForm({ ...form, date: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
          </>
        )}
        {type === "gallery" && (
          <>
            <input placeholder="Image URL" value={form.image_url || ""} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            {form.image_url && <img src={form.image_url} alt="Preview" className="w-full h-40 object-cover rounded-lg" />}
            <input placeholder="Caption" value={form.caption || ""} onChange={(e) => setForm({ ...form, caption: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </>
        )}
        {type === "reviews" && (
          <>
            <div className="flex gap-4">
              <input placeholder="Author name" value={form.author_name || ""} onChange={(e) => setForm({ ...form, author_name: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              <input placeholder="Avatar URL" value={form.avatar_url || ""} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rating:</span>
              {[1,2,3,4,5].map((r) => (
                <button key={r} onClick={() => setForm({ ...form, rating: r })} type="button">
                  <Star className={`w-5 h-5 ${r <= (form.rating || 5) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                </button>
              ))}
            </div>
            <input placeholder="Title" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            <textarea placeholder="Content" value={form.content || ""} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" rows={3} />
            <div className="flex gap-4">
              <textarea placeholder="Pros" value={form.pros || ""} onChange={(e) => setForm({ ...form, pros: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" rows={2} />
              <textarea placeholder="Cons" value={form.cons || ""} onChange={(e) => setForm({ ...form, cons: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" rows={2} />
            </div>
            <select value={form.status || "published"} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option value="published">Published</option>
              <option value="pending">Pending</option>
            </select>
          </>
        )}
        <div className="flex gap-2">
          <button onClick={() => handleContentSubmit(type, form)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold">
            {showForm.editing ? "Update" : "Create"}
          </button>
          <button onClick={() => setShowForm(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold">Cancel</button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Manage Profile</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">Manage Profile</span>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="border-b border-gray-100 overflow-x-auto no-scrollbar">
        <nav className="flex space-x-6 whitespace-nowrap">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 py-3 text-sm font-semibold transition-colors ${
                activeTab === tab ? "border-blue-600 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === "Details" && (
        <>
          {/* Branding */}
          <div className="bg-white rounded-lg p-8 border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Image className="w-5 h-5 text-blue-600" /> Branding Images
              </h2>
              <button onClick={handleSaveProfile} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
            <div className="max-w-xs">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Organization Logo</label>
              <FileUpload accept="image/*" maxSize="2MB" recommendedSize="500x500" onFileSelect={handleLogoSelect} previewUrl={logoPreview} previewClassName="w-[120px] h-[120px] object-contain rounded-lg mt-2 mx-auto border border-slate-200 bg-white" />
              {uploadingLogo && <p className="mt-2 text-xs text-blue-600">Uploading logo...</p>}
            </div>
          </div>

          {/* Organization Details */}
          <div className="bg-white rounded-lg p-8 border border-slate-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
              <Building2 className="w-5 h-5 text-blue-600" /> Organization Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Organization Name <span className="text-red-500">*</span></label>
                <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={providerName} onChange={(e) => setProviderName(e.target.value)} placeholder="Enter organization name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Registration Number <span className="text-red-500">*</span></label>
                <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} placeholder="e.g., 12345/078-079" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input type="email" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50" value={email} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Number</label>
                <input type="tel" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} placeholder="+977-1-XXXXXXX" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">PAN Number</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={panNumber} onChange={(e) => setPanNumber(e.target.value)} placeholder="PAN / VAT number" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Organization address" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Website URL</label>
                <input type="url" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://www.example.com" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">About Text</label>
                <textarea className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={aboutText} onChange={(e) => setAboutText(e.target.value)} rows={4} placeholder="Describe your organization..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mission</label>
                <textarea className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={mission} onChange={(e) => setMission(e.target.value)} rows={3} placeholder="Our mission..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Values</label>
                <textarea className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={values} onChange={(e) => setValues(e.target.value)} rows={3} placeholder="Our values..." />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={handleSaveProfile} disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Services Tab */}
      {activeTab === "Services" && (
        <ContentList
          title="Services"
          items={services}
          onAdd={() => setShowForm({ type: "services", data: {}, editing: null })}
          onEdit={(item: any) => setShowForm({ type: "services", data: item, editing: item.id })}
          onDelete={(item: any) => setDeleteModal({ isOpen: true, id: item.id, type: "services" })}
          renderItem={(item: any) => <><p className="font-medium text-gray-900">{item.title}</p><p className="text-sm text-gray-500">{item.description}</p></>}
        />
      )}

      {/* Sectors Tab */}
      {activeTab === "Sectors" && (
        <ContentList
          title="Sectors"
          items={sectors}
          onAdd={() => setShowForm({ type: "sectors", data: { color: "#2563eb" }, editing: null })}
          onEdit={(item: any) => setShowForm({ type: "sectors", data: item, editing: item.id })}
          onDelete={(item: any) => setDeleteModal({ isOpen: true, id: item.id, type: "sectors" })}
          renderItem={(item: any) => <><div className="flex items-center gap-3"><div className="w-6 h-6 rounded" style={{backgroundColor: item.color}} /><div><p className="font-medium text-gray-900">{item.name}</p><p className="text-sm text-gray-500">{item.description}</p></div></div></>}
        />
      )}

      {/* Projects Tab */}
      {activeTab === "Projects" && (
        <ContentList
          title="Projects"
          items={projects}
          onAdd={() => setShowForm({ type: "projects", data: {}, editing: null })}
          onEdit={(item: any) => setShowForm({ type: "projects", data: item, editing: item.id })}
          onDelete={(item: any) => setDeleteModal({ isOpen: true, id: item.id, type: "projects" })}
          renderItem={(item: any) => <><p className="font-medium text-gray-900">{item.title}</p><p className="text-sm text-gray-500">{item.description}</p></>}
        />
      )}

      {/* Gallery Tab */}
      {activeTab === "Gallery" && (
        <ContentList
          title="Gallery"
          items={gallery}
          onAdd={() => setShowForm({ type: "gallery", data: {}, editing: null })}
          onEdit={(item: any) => setShowForm({ type: "gallery", data: item, editing: item.id })}
          onDelete={(item: any) => setDeleteModal({ isOpen: true, id: item.id, type: "gallery" })}
          renderItem={(item: any) => <div className="flex items-center gap-3"><img src={item.image_url} alt="" className="w-16 h-12 object-cover rounded" /><p className="text-sm text-gray-600">{item.caption || "No caption"}</p></div>}
        />
      )}

      {/* Reviews Tab */}
      {activeTab === "Reviews" && (
        <ContentList
          title="Reviews"
          items={reviews}
          onAdd={() => setShowForm({ type: "reviews", data: { rating: 5, status: "published" }, editing: null })}
          onEdit={(item: any) => setShowForm({ type: "reviews", data: item, editing: item.id })}
          onDelete={(item: any) => setDeleteModal({ isOpen: true, id: item.id, type: "reviews" })}
          renderItem={(item: any) => <><p className="font-medium text-gray-900">{item.author_name}</p><p className="text-sm text-gray-500">{item.content?.slice(0, 100)}</p></>}
        />
      )}

      {showForm && <FormWrapper showForm={showForm} onSubmit={handleContentSubmit} onCancel={() => setShowForm(null)} />}

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title={`Delete ${deleteModal.type.slice(0, -1)}`}
        message="Are you sure?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleContentDelete}
        onCancel={() => setDeleteModal({ isOpen: false, id: null, type: "" })}
        destructive
      />
    </div>
  );
});

const ContentList = ({ title, items, onAdd, onEdit, onDelete, renderItem }: {
  title: string; items: any[]; onAdd: () => void; onEdit: (item: any) => void; onDelete: (item: any) => void; renderItem: (item: any) => React.ReactNode;
}) => (
  <div className="bg-white rounded-lg p-6 border border-slate-100">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      <button onClick={onAdd} className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
        <Plus className="w-4 h-4" /> Add
      </button>
    </div>
    {items.length === 0 ? (
      <p className="text-center text-gray-400 py-4">No {title.toLowerCase()} added yet.</p>
    ) : (
      <div className="space-y-2">
        {items.map((item: any) => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">{renderItem(item)}</div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => onEdit(item)} className="p-1.5 hover:bg-green-50 rounded text-green-600"><Pencil className="w-3.5 h-3.5" /></button>
              <button onClick={() => onDelete(item)} className="p-1.5 hover:bg-red-50 rounded text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// Separate form component to manage its own state
const FormWrapper = ({ showForm, onSubmit, onCancel }: { showForm: any; onSubmit: (type: string, data: any) => void; onCancel: () => void }) => {
  const [form, setForm] = useState(showForm.data || {});
  const type = showForm.type;

  return (
    <div className="bg-white rounded-lg p-6 border border-slate-100 space-y-4">
      {type === "services" && (
        <>
          <input placeholder="Icon name" value={form.icon || ""} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          <input placeholder="Title" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          <textarea placeholder="Description" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" rows={3} />
          <input type="number" placeholder="Sort order" value={form.sort_order || 0} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
        </>
      )}
      {type === "sectors" && (
        <>
          <input placeholder="Name" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          <textarea placeholder="Description" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" rows={3} />
          <div className="flex gap-4 items-center">
            <label className="text-sm text-gray-600">Color:</label>
            <input type="color" value={form.color || "#2563eb"} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-10 h-10 rounded cursor-pointer" />
            <input placeholder="Icon name" value={form.icon || ""} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <input placeholder="Image URL" value={form.image_url || ""} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          <input type="number" placeholder="Sort order" value={form.sort_order || 0} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
        </>
      )}
      {type === "projects" && (
        <>
          <input placeholder="Title" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          <textarea placeholder="Description" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" rows={3} />
          <input placeholder="Image URL" value={form.image_url || ""} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          <div className="flex gap-4">
            <input placeholder="Category" value={form.category || ""} onChange={(e) => setForm({ ...form, category: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            <input type="date" value={form.date?.slice(0,10) || ""} onChange={(e) => setForm({ ...form, date: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <input type="number" placeholder="Sort order" value={form.sort_order || 0} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
        </>
      )}
      {type === "gallery" && (
        <>
          <input placeholder="Image URL" value={form.image_url || ""} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          {form.image_url && <img src={form.image_url} alt="Preview" className="w-full h-40 object-cover rounded-lg" />}
          <input placeholder="Caption" value={form.caption || ""} onChange={(e) => setForm({ ...form, caption: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          <input type="number" placeholder="Sort order" value={form.sort_order || 0} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
        </>
      )}
      {type === "reviews" && (
        <>
          <div className="flex gap-4">
            <input placeholder="Author name" value={form.author_name || ""} onChange={(e) => setForm({ ...form, author_name: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            <input placeholder="Avatar URL" value={form.avatar_url || ""} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rating:</span>
            {[1,2,3,4,5].map((r) => (
              <button key={r} onClick={() => setForm({ ...form, rating: r })} type="button">
                <Star className={`w-5 h-5 ${r <= (form.rating || 5) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
              </button>
            ))}
          </div>
          <input placeholder="Title" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          <textarea placeholder="Content" value={form.content || ""} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" rows={3} />
          <div className="flex gap-4">
            <textarea placeholder="Pros" value={form.pros || ""} onChange={(e) => setForm({ ...form, pros: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" rows={2} />
            <textarea placeholder="Cons" value={form.cons || ""} onChange={(e) => setForm({ ...form, cons: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" rows={2} />
          </div>
          <select value={form.status || "published"} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
            <option value="published">Published</option>
            <option value="pending">Pending</option>
          </select>
        </>
      )}
      <div className="flex gap-2">
        <button onClick={() => onSubmit(type, form)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold">
          {showForm.editing ? "Update" : "Create"}
        </button>
        <button onClick={onCancel} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold">Cancel</button>
      </div>
    </div>
  );
};

OrganizationProfile.displayName = "OrganizationProfile";
export default OrganizationProfile;
