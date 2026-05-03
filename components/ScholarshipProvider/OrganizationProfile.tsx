"use client";

import React, { memo, useEffect, useState } from "react";
import { Building2, Home, Image, Mail, Phone, BadgeInfo, Globe, CreditCard } from "lucide-react";
import { toast } from "sonner";
import FileUpload from "./common/FileUpload";
import { scholarshipProviderApi, ProviderProfile } from "@/services/scholarshipProviderApi";

const OrganizationProfile: React.FC = memo(() => {
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [providerName, setProviderName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

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
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const handleCoverSelect = async (file: File) => {
    setCoverPreview(URL.createObjectURL(file));
    setUploadingCover(true);
    try {
      const url = await scholarshipProviderApi.uploadImage(file, "profile");
      setCoverUrl(url);
      setCoverPreview(url);
      toast.success("Cover image uploaded");
    } catch (err) {
      setCoverUrl("");
      setCoverPreview("");
      toast.error(err instanceof Error ? err.message : "Failed to upload cover image");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleLogoSelect = async (file: File) => {
    setLogoPreview(URL.createObjectURL(file));
    setUploadingLogo(true);
    try {
      const url = await scholarshipProviderApi.uploadImage(file, "logos");
      setLogoUrl(url);
      setLogoPreview(url);
      toast.success("Logo uploaded");
    } catch (err) {
      setLogoUrl("");
      setLogoPreview("");
      toast.error(err instanceof Error ? err.message : "Failed to upload logo");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async () => {
    if (!providerName.trim()) {
      toast.error("Organization name is required");
      return;
    }

    if (!registrationNumber.trim()) {
      toast.error("Registration number is required");
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
      });
      setProfile(updated);
      toast.success("Your profile has been updated successfully.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-slate-500">Loading profile...</div>;
  }

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

      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Image className="w-5 h-5 text-blue-600" /> Branding Images
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => toast.info("Image uploads are saved immediately")}
              className="px-4 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors"
            >
              Draft
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Cover Photo</label>
            <FileUpload
              accept="image/*"
              maxSize="5MB"
              recommendedSize="1920x500"
              onFileSelect={handleCoverSelect}
              previewUrl={coverPreview}
              previewClassName="w-full h-[200px] object-cover rounded-lg mt-2"
            />
            {uploadingCover && <p className="mt-2 text-xs text-blue-600">Uploading cover photo...</p>}
            {coverUrl && <input type="hidden" value={coverUrl} readOnly />}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Organization Logo</label>
            <FileUpload
              accept="image/*"
              maxSize="2MB"
              recommendedSize="500x500"
              onFileSelect={handleLogoSelect}
              previewUrl={logoPreview}
              previewClassName="w-[120px] h-[120px] object-contain rounded-lg mt-2 mx-auto border border-slate-200 bg-white"
            />
            {uploadingLogo && <p className="mt-2 text-xs text-blue-600">Uploading logo...</p>}
            {logoUrl && <input type="hidden" value={logoUrl} readOnly />}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" /> Organization Details
          </h2>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Organization Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              value={providerName}
              onChange={(e) => setProviderName(e.target.value)}
              placeholder="Enter organization name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Registration Number <span className="text-red-500">*</span></label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              placeholder="e.g., 12345/078-079"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50"
              value={email}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Number</label>
            <input
              type="tel"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="+977-1-XXXXXXX"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">PAN Number</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              value={panNumber}
              onChange={(e) => setPanNumber(e.target.value)}
              placeholder="PAN / VAT number"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Website URL</label>
            <input
              type="url"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://www.example.com"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex items-center gap-3 mb-2 text-slate-500 text-sm">
          <BadgeInfo className="w-4 h-4" />
          <span>Saved profile data comes from the backend profile endpoint.</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /> {profile?.email || email}</div>
          <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400" /> {contactNumber || "No contact number yet"}</div>
          <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-slate-400" /> {websiteUrl || "No website yet"}</div>
          <div className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-slate-400" /> {registrationNumber || "No registration number yet"}</div>
        </div>
      </div>
    </div>
  );
});

OrganizationProfile.displayName = "OrganizationProfile";

export default OrganizationProfile;
