"use client";

import React, { memo, useEffect, useState, useCallback } from "react";
import { Building2, Home, Image, Mail, Phone, BadgeInfo, Globe, CreditCard, Plus, Pencil, Trash2, Star, FileText, Coffee } from "lucide-react";
import * as LucideIcons from "lucide-react";

import { toast } from "sonner";
import FileUpload from "./common/FileUpload";
import ConfirmationModal from "./common/ConfirmationModal";
import RichTextEditor from "./common/RichTextEditor";
import { scholarshipProviderApi, ProviderProfile } from "@/services/scholarshipProviderApi";
import {
  getServices, createService, updateService, deleteService,
  getSectors, createSector, updateSector, deleteSector,
  getProjects, createProject, updateProject, deleteProject,
  getGalleryImages, createGalleryImage, updateGalleryImage, deleteGalleryImage,
} from "@/services/scholarshipProviderApi";

const TABS = ["Details", "Services", "Sectors", "Projects", "Gallery"] as const;
type Tab = (typeof TABS)[number];

const OrganizationProfile: React.FC = memo(() => {
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("Details");
  const [isEditing, setIsEditing] = useState(false);
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
  const [bannerUrl, setBannerUrl] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  
  // Founder fields
  const [founderName, setFounderName] = useState("");
  const [founderRole, setFounderRole] = useState("");
  const [founderMessage, setFounderMessage] = useState("");
  const [founderImageUrl, setFounderImageUrl] = useState("");
  const [founderImagePreview, setFounderImagePreview] = useState("");
  const [uploadingFounderImage, setUploadingFounderImage] = useState(false);

  // Social media fields
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [brochureUrl, setBrochureUrl] = useState("");
  const [uploadingBrochure, setUploadingBrochure] = useState(false);



  // Content management state
  const [services, setServices] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [showForm, setShowForm] = useState<any>(null);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkUploadFolder, setBulkUploadFolder] = useState("");
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: number | null; type: string }>({ isOpen: false, id: null, type: "" });

  const loadProfile = useCallback(async () => {
    try {
      const data = await scholarshipProviderApi.getProfile();
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
      if (data.banner_url) { setBannerUrl(data.banner_url); setBannerPreview(data.banner_url); }
      
      // Founder
      setFounderName(data.founder_name || "");
      setFounderRole(data.founder_role || "");
      setFounderMessage(data.founder_message || "");
      if (data.founder_image_url) {
        setFounderImageUrl(data.founder_image_url);
        setFounderImagePreview(data.founder_image_url);
      }

      // Social
      setFacebookUrl(data.facebook_url || "");
      setInstagramUrl(data.instagram_url || "");
      setYoutubeUrl(data.youtube_url || "");
      setLinkedinUrl(data.linkedin_url || "");
      setMapUrl(data.map_url || "");
      setBrochureUrl(data.brochure_url || "");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    loadProfile();
    loadContent();
  }, [loadProfile]);

  const loadContent = async () => {
    try {
      const [s, sec, p, g] = await Promise.all([
        getServices().catch(() => []),
        getSectors().catch(() => []),
        getProjects().catch(() => []),
        getGalleryImages().catch(() => []),
      ]);
      setServices(s); setSectors(sec); setProjects(p); setGallery(g);
    } catch {}
  };

  const handleFounderImageSelect = async (file: File) => {
    setFounderImagePreview(URL.createObjectURL(file));
    setUploadingFounderImage(true);
    try {
      const url = await scholarshipProviderApi.uploadImage(file, "founders");
      setFounderImageUrl(url);
      setFounderImagePreview(url);
      toast.success("Founder image uploaded");
    } catch (err) {
      setFounderImageUrl("");
      setFounderImagePreview("");
      toast.error(err instanceof Error ? err.message : "Failed to upload founder image");
    } finally { setUploadingFounderImage(false); }
  };

  const handleBrochureSelect = async (file: File) => {
    setUploadingBrochure(true);
    try {
      const url = await scholarshipProviderApi.uploadDocument(file, "brochures");
      setBrochureUrl(url);
      toast.success("Brochure uploaded successfully");

    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload brochure");
    } finally { setUploadingBrochure(false); }
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

  const handleBannerSelect = async (file: File) => {
    setBannerPreview(URL.createObjectURL(file));
    setUploadingBanner(true);
    try {
      const url = await scholarshipProviderApi.uploadImage(file, "banners");
      setBannerUrl(url); setBannerPreview(url);
      toast.success("Banner uploaded");
    } catch (err) {
      setBannerUrl(""); setBannerPreview("");
      toast.error(err instanceof Error ? err.message : "Failed to upload banner");
    } finally { setUploadingBanner(false); }
  };

  const handleBannerClear = () => {
    setBannerUrl("");
    setBannerPreview("");
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
        banner_url: bannerUrl,
        address,
        about_text: aboutText,
        mission,
        values,
        founder_name: founderName,
        founder_role: founderRole,
        founder_message: founderMessage,
        founder_image_url: founderImageUrl,
        facebook_url: facebookUrl,
        instagram_url: instagramUrl,
        youtube_url: youtubeUrl,
        linkedin_url: linkedinUrl,
        map_url: mapUrl,
        brochure_url: brochureUrl,
      });
      setProfile(updated);
      if (updated.founder_name !== undefined) setFounderName(updated.founder_name);
      if (updated.founder_role !== undefined) setFounderRole(updated.founder_role);
      if (updated.founder_message !== undefined) setFounderMessage(updated.founder_message);
      if (updated.founder_image_url !== undefined) {
        setFounderImageUrl(updated.founder_image_url);
        setFounderImagePreview(updated.founder_image_url);
      }
      if (updated.facebook_url !== undefined) setFacebookUrl(updated.facebook_url);
      if (updated.instagram_url !== undefined) setInstagramUrl(updated.instagram_url);
      if (updated.youtube_url !== undefined) setYoutubeUrl(updated.youtube_url);
      if (updated.linkedin_url !== undefined) setLinkedinUrl(updated.linkedin_url);
      if (updated.map_url !== undefined) setMapUrl(updated.map_url);
      if (updated.brochure_url !== undefined) setBrochureUrl(updated.brochure_url);
      if (updated.contact_number !== undefined) setContactNumber(updated.contact_number);
      if (updated.pan_number !== undefined) setPanNumber(updated.pan_number);
      if (updated.website_url !== undefined) setWebsiteUrl(updated.website_url);

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
      toast.success("Deleted");
      loadContent();
    } catch { toast.error("Failed to delete"); }
    setDeleteModal({ isOpen: false, id: null, type: "" });
  };

  const handleBulkGalleryUpload = async (files: FileList) => {
    setBulkUploading(true);
    const toastId = toast.loading(`Uploading ${files.length} images...`);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const url = await scholarshipProviderApi.uploadImage(file, "gallery");
        return createGalleryImage({ image_url: url, caption: file.name.split('.')[0], folder: bulkUploadFolder });
      });
      await Promise.all(uploadPromises);
      toast.success("All images uploaded successfully", { id: toastId });
      loadContent();
    } catch (err) {
      toast.error("Failed to upload some images", { id: toastId });
    } finally {
      setBulkUploading(false);
    }
  };

  if (loading) return <div className="py-12 text-center text-slate-500">Loading profile...</div>;

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
              {isEditing ? (
                <div className="flex gap-2">
                  <button onClick={() => { setIsEditing(false); loadProfile(); }} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50">
                    Cancel
                  </button>
                  <button onClick={handleSaveProfile} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              ) : (
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 flex items-center gap-2">
                  <Pencil className="w-4 h-4" /> Edit Profile
                </button>
              )}
            </div>
            <div className="flex gap-8">
              <div className="w-1/6">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Organization Logo</label>
                {isEditing ? (
                  <>
                    <FileUpload accept="image/*" maxSize="2MB" recommendedSize="500x500" onFileSelect={handleLogoSelect} previewUrl={logoPreview} previewClassName="w-[120px] h-[120px] object-contain rounded-lg border border-slate-200 bg-white" />
                    {uploadingLogo && <p className="mt-2 text-xs text-blue-600">Uploading logo...</p>}
                  </>
                ) : (
                  <div className="relative overflow-hidden border border-slate-200 rounded-md">
                    {logoPreview ? (
                      <img src={logoPreview} className="w-[120px] h-[120px] object-contain mx-auto" alt="Logo" />
                    ) : (
                      <div className="w-[120px] h-[120px] flex items-center justify-center text-gray-300 text-sm">No logo</div>
                    )}
                  </div>
                )}
              </div>
              <div className="w-5/6">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Profile Banner Image</label>
                {isEditing ? (
                  <>
                    <FileUpload accept="image/*" maxSize="5MB" recommendedSize="1920x400" onFileSelect={handleBannerSelect} previewUrl={bannerPreview} previewClassName="w-full h-[120px] object-cover rounded-lg border border-slate-200" onClearPreview={handleBannerClear} />
                    {uploadingBanner && <p className="mt-2 text-xs text-blue-600">Uploading banner...</p>}
                  </>
                ) : (
                  <div className="relative overflow-hidden border border-slate-200 rounded-md">
                    {bannerPreview ? (
                      <img src={bannerPreview} className="w-full h-[120px] object-cover" alt="Banner" />
                    ) : (
                      <div className="w-full h-[120px] flex items-center justify-center text-gray-300 text-sm">No banner uploaded</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Organization Details */}
          <div className="bg-white rounded-lg p-8 border border-slate-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
              <Building2 className="w-5 h-5 text-blue-600" /> Organization Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Organization Name" required value={providerName} isEditing={isEditing}><input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={providerName} onChange={(e) => setProviderName(e.target.value)} placeholder="Enter organization name" /></Field>
              <Field label="Registration Number" required value={registrationNumber} isEditing={isEditing}><input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} placeholder="e.g., 12345/078-079" /></Field>
              <Field label="Email Address" value={email} isEditing={false}><input type="email" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50" value={email} readOnly /></Field>
              <Field label="Contact Number" value={contactNumber} isEditing={isEditing}><input type="tel" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} placeholder="+977-1-XXXXXXX" /></Field>
              <Field label="PAN Number" value={panNumber} isEditing={isEditing}><input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={panNumber} onChange={(e) => setPanNumber(e.target.value)} placeholder="PAN / VAT number" /></Field>
              <Field label="Address" value={address} isEditing={isEditing} span={2}><input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Organization address" /></Field>
              <Field label="Website URL" value={websiteUrl} isEditing={isEditing} span={2}><input type="url" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://www.example.com" /></Field>
              {isEditing ? (
                <Field label="About Text" value={aboutText} isEditing={true} span={2}>
                  <RichTextEditor value={aboutText} onChange={setAboutText} placeholder="Describe your organization..." minHeight={200} />
                </Field>
              ) : (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">About Text</label>
                  {aboutText ? (
                    <div className="prose prose-sm max-w-none text-gray-700 break-words [&_*]:break-words" dangerouslySetInnerHTML={{ __html: aboutText }} />
                  ) : (
                    <p className="text-sm text-gray-400 py-2">Not provided</p>
                  )}
                </div>
              )}
              <Field label="Mission" value={mission} isEditing={isEditing}><textarea className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={mission} onChange={(e) => setMission(e.target.value)} rows={3} placeholder="Our mission..." /></Field>
              <Field label="Values" value={values} isEditing={isEditing}><textarea className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={values} onChange={(e) => setValues(e.target.value)} rows={3} placeholder="Our values..." /></Field>
            </div>

            {/* Founder Section */}
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h3 className="text-md font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 text-blue-600" />
                Founder Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Founder Image</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                      {founderImagePreview ? (
                        <img src={founderImagePreview} alt="Founder" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Image className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    {isEditing && (
                      <div className="flex-1">
                        <FileUpload accept="image/*" maxSize="2MB" onFileSelect={handleFounderImageSelect} />
                        {uploadingFounderImage && <p className="mt-2 text-sm text-blue-600 font-medium">Uploading image...</p>}
                      </div>
                    )}
                  </div>
                </div>
                <Field label="Founder Name" value={founderName} isEditing={isEditing}><input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={founderName} onChange={(e) => setFounderName(e.target.value)} placeholder="e.g. John Doe" /></Field>
                <Field label="Founder Role" value={founderRole} isEditing={isEditing}><input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={founderRole} onChange={(e) => setFounderRole(e.target.value)} placeholder="e.g. Founder & Chairperson" /></Field>
                <Field label="Founder's Message / Quote" value={founderMessage} isEditing={isEditing} span={2}><textarea className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={founderMessage} onChange={(e) => setFounderMessage(e.target.value)} rows={3} placeholder="A short message or quote from the founder..." /></Field>
              </div>
            </div>

            {/* Social Media & Map Section */}
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h3 className="text-md font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" />
                Social Media & Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Facebook URL" value={facebookUrl} isEditing={isEditing}><input type="url" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={facebookUrl} onChange={(e) => setFacebookUrl(e.target.value)} placeholder="https://facebook.com/your-page" /></Field>
                <Field label="Instagram URL" value={instagramUrl} isEditing={isEditing}><input type="url" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} placeholder="https://instagram.com/your-profile" /></Field>
                <Field label="YouTube URL" value={youtubeUrl} isEditing={isEditing}><input type="url" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder="https://youtube.com/@your-channel" /></Field>
                <Field label="LinkedIn URL" value={linkedinUrl} isEditing={isEditing}><input type="url" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/company/your-company" /></Field>
                <Field label="Google Maps Embed URL" value={mapUrl} isEditing={isEditing} span={2}><div><input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={mapUrl} onChange={(e) => setMapUrl(e.target.value)} placeholder='e.g. https://www.google.com/maps/embed?pb=...' /><p className="mt-1 text-[11px] text-gray-500">Go to Google Maps → Share → Embed a map → Copy the URL inside the src="" attribute.</p></div></Field>
              </div>
            </div>

            {/* Brochure Section */}
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h3 className="text-md font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Organization Brochure
              </h3>
              <div className="bg-gray-50 rounded-xl p-6 border border-dashed border-gray-200">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h4 className="text-sm font-bold text-gray-900">Organization Brochure</h4>
                    <p className="text-xs text-gray-500 mt-1">PDF format preferred. Max size 5MB.</p>
                    {brochureUrl ? (
                      <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-[11px] font-medium border border-green-100">
                        <Star className="w-3 h-3" />
                        Brochure Uploaded
                        <a href={brochureUrl.startsWith('http') ? brochureUrl : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${brochureUrl.startsWith('/') ? '' : '/'}${brochureUrl}`} target="_blank" rel="noreferrer" className="underline hover:text-green-800 ml-1">View Current</a>
                      </div>
                    ) : !isEditing && (
                      <p className="mt-2 text-xs text-gray-400">No brochure uploaded</p>
                    )}
                  </div>
                  {isEditing && (
                    <div className="flex-shrink-0 text-center">
                      <FileUpload accept=".pdf,.doc,.docx" maxSize="5MB" onFileSelect={handleBrochureSelect} />
                      {uploadingBrochure && <p className="mt-2 text-sm text-blue-600 font-medium">Uploading brochure...</p>}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="mt-6 flex justify-end">
                <button onClick={handleSaveProfile} disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
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
          renderItem={(item: any) => <div className="flex items-center gap-3">{item.image_url && <img src={item.image_url} alt="" className="w-10 h-10 object-cover rounded" />}<div><p className="font-medium text-gray-900">{item.title}</p><p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>{item.external_link && <p className="text-xs text-blue-600 truncate max-w-[200px]">{item.external_link}</p>}</div></div>}
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
          renderItem={(item: any) => <div className="flex items-center gap-3">{item.image_url ? <img src={item.image_url} alt="" className="w-10 h-10 object-cover rounded" /> : <div className="w-10 h-10 rounded" style={{backgroundColor: item.color}} />}<div><p className="font-medium text-gray-900">{item.name}</p><p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>{item.external_link && <p className="text-xs text-blue-600 truncate max-w-[200px]">{item.external_link}</p>}</div></div>}
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
          renderItem={(item: any) => <div className="flex items-center gap-3">{item.image_url && <img src={item.image_url} alt="" className="w-12 h-10 object-cover rounded" />}<div><p className="font-medium text-gray-900">{item.title}</p><p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>{item.external_link && <p className="text-xs text-blue-600 truncate max-w-[200px]">{item.external_link}</p>}</div></div>}
        />
      )}

      {/* Gallery Tab */}
      {activeTab === "Gallery" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 border border-slate-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Bulk Upload Images</h2>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 block mb-1">Target Folder (optional)</label>
              <input 
                placeholder="e.g. disaster, env" 
                value={bulkUploadFolder} 
                onChange={(e) => setBulkUploadFolder(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <FileUpload 
              multiple 
              accept="image/*" 
              maxSize="10MB" 
              onFilesSelect={handleBulkGalleryUpload}
              uploadedText={bulkUploading ? "Uploading..." : "Click to bulk upload gallery images"}
            />
            {bulkUploading && <p className="mt-2 text-sm text-blue-600 animate-pulse">Processing bulk upload, please wait...</p>}
          </div>

          <div className="space-y-8">
            {Object.entries(
              gallery.reduce((acc: any, img: any) => {
                const folder = img.folder || "Uncategorized";
                if (!acc[folder]) acc[folder] = [];
                acc[folder].push(img);
                return acc;
              }, {})
            ).map(([folder, images]: [string, any]) => (
              <div key={folder} className="bg-white rounded-lg p-6 border border-slate-100">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-50">
                  <h3 className="text-md font-bold text-gray-800 capitalize flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    {folder} Folder
                  </h3>
                  <button 
                    onClick={() => setShowForm({ type: "gallery", data: { folder: folder === "Uncategorized" ? "" : folder }, editing: null })}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    + Add Image to this folder
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {images.map((img: any) => (
                    <div key={img.id} className="group relative aspect-square rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                      <img src={img.image_url} alt={img.caption} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button 
                          onClick={() => setShowForm({ type: "gallery", data: img, editing: img.id })}
                          className="p-1.5 bg-white text-gray-700 rounded-full hover:bg-gray-100"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button 
                          onClick={() => setDeleteModal({ isOpen: true, id: img.id, type: "gallery" })}
                          className="p-1.5 bg-white text-red-600 rounded-full hover:bg-red-50"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                      {img.caption && <div className="absolute bottom-0 inset-x-0 bg-black/60 p-1 text-[10px] text-white truncate text-center">{img.caption}</div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {gallery.length === 0 && (
              <div className="bg-white rounded-lg p-12 border border-slate-100 text-center">
                <p className="text-gray-500 mb-4">Your gallery is empty.</p>
                <button 
                  onClick={() => setShowForm({ type: "gallery", data: {}, editing: null })}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold"
                >
                  Add Your First Image
                </button>
              </div>
            )}
          </div>
        </div>
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
  const [uploading, setUploading] = useState(false);
  const type = showForm.type;

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await scholarshipProviderApi.uploadImage(file, type);
      setForm({ ...form, image_url: url });
      toast.success("Image uploaded");
    } catch (err) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const isValidUrl = (url: string) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = () => {
    if (form.external_link && !isValidUrl(form.external_link)) {
      toast.error("Please enter a valid URL (starting with http:// or https://)");
      return;
    }
    onSubmit(type, form);
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-slate-100 space-y-4 mb-6">
      {type === "services" && (
        <>
          <input placeholder="Title" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          <textarea placeholder="Description" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" rows={3} />
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <input placeholder="Icon Name (e.g. Coffee, Book, Globe, Heart)" value={form.icon || ""} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center shrink-0 bg-white">
              {(() => {
                const name = form.icon ? form.icon.charAt(0).toUpperCase() + form.icon.slice(1) : "";
                const Icon = (LucideIcons as any)[name] || null;
                return Icon ? <Icon className="w-5 h-5 text-blue-600" /> : <Coffee className="w-5 h-5 text-gray-300" />;
              })()}
            </div>
          </div>
          <a href="https://lucide.dev/icons" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1">
            Browse Lucide Icons ↗
          </a>
        </>
      )}
      {type === "sectors" && (
        <>
          <input placeholder="Name" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          <textarea placeholder="Description" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" rows={3} />
          <div className="flex gap-4 items-center">
            <label className="text-sm text-gray-600 shrink-0">Theme Color:</label>
            <input type="color" value={form.color || "#2563eb"} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-10 h-10 rounded cursor-pointer" />
            <input type="url" placeholder="External Link" value={form.external_link || ""} onChange={(e) => setForm({ ...form, external_link: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500">Sector Image</label>
            <FileUpload 
              onFileSelect={handleImageUpload} 
              previewUrl={form.image_url} 
              uploadedText={uploading ? "Uploading..." : "Image Uploaded"} 
              onClearPreview={() => setForm({ ...form, image_url: "" })}
            />
          </div>
        </>
      )}
      {type === "projects" && (
        <>
          <input placeholder="Title" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          <textarea placeholder="Description" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" rows={3} />
          <input type="url" placeholder="External Link" value={form.external_link || ""} onChange={(e) => setForm({ ...form, external_link: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500">Project Image</label>
            <FileUpload 
              onFileSelect={handleImageUpload} 
              previewUrl={form.image_url} 
              uploadedText={uploading ? "Uploading..." : "Image Uploaded"} 
              onClearPreview={() => setForm({ ...form, image_url: "" })}
            />
          </div>
          <div className="flex gap-4">
            <input placeholder="Category" value={form.category || ""} onChange={(e) => setForm({ ...form, category: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            <input type="date" value={form.date?.slice(0,10) || ""} onChange={(e) => setForm({ ...form, date: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
        </>
      )}
      {type === "gallery" && (
        <>
          <input placeholder="Folder Name (e.g. disaster, env)" value={form.folder || ""} onChange={(e) => setForm({ ...form, folder: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500">Gallery Image</label>
            <FileUpload 
              onFileSelect={handleImageUpload} 
              previewUrl={form.image_url} 
              uploadedText={uploading ? "Uploading..." : "Image Uploaded"} 
              onClearPreview={() => setForm({ ...form, image_url: "" })}
            />
          </div>
          <input placeholder="Caption" value={form.caption || ""} onChange={(e) => setForm({ ...form, caption: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
        </>
      )}

      <div className="flex gap-2">
        <button onClick={handleSubmit} disabled={uploading} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50">
          {showForm.editing ? "Update" : "Create"}
        </button>
        <button onClick={onCancel} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold">Cancel</button>
      </div>
    </div>
  );
};

function Field({ label, value, isEditing, required, span, children }: { label: string; value: string; isEditing: boolean; required?: boolean; span?: number; children: React.ReactNode }) {
  const cls = span === 2 ? "md:col-span-2" : "";
  if (isEditing) {
    return <div className={cls}>{children}</div>;
  }
  return (
    <div className={cls}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <p className="text-sm text-gray-900 py-2">{value || <span className="text-gray-400">Not provided</span>}</p>
    </div>
  );
}

OrganizationProfile.displayName = "OrganizationProfile";
export default OrganizationProfile;
