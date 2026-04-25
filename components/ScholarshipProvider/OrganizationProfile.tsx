"use client";

import React, { useState, useRef, useCallback, memo } from "react";
import dynamic from "next/dynamic";
import {
  Image,
  Building2,
  MapPin,
  FileText,
  Briefcase,
  Layers,
  FolderOpen,
  Images,
  Share2,
  User,
  UserCheck,
  Save,
  Eye,
  UploadCloud,
  Plus,
  X,
} from "lucide-react";
import SectionCard from "./common/SectionCard";
import InputField from "./common/InputField";
import SelectField from "./common/SelectField";
import FileUpload from "./common/FileUpload";
import Button from "./common/Button";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link", "image"],
    ["clean"],
  ],
};

const quillFormats = [
  "header", "bold", "italic", "underline", "strike",
  "list", "align", "link", "image",
];

const ORG_TYPE_OPTIONS = [
  { value: "ngo", label: "NGO" },
  { value: "nonprofit", label: "Non-Profit" },
  { value: "foundation", label: "Foundation" },
  { value: "trust", label: "Trust" },
  { value: "association", label: "Association" },
];

const PROVINCE_OPTIONS = [
  { value: "", label: "Select Province" },
  { value: "1", label: "Province 1" },
  { value: "2", label: "Madhesh" },
  { value: "3", label: "Bagmati" },
  { value: "4", label: "Gandaki" },
  { value: "5", label: "Lumbini" },
  { value: "6", label: "Karnali" },
  { value: "7", label: "Sudurpashchim" },
];

const DISTRICT_OPTIONS = [
  { value: "", label: "Select District" },
  { value: "kathmandu", label: "Kathmandu" },
  { value: "lalitpur", label: "Lalitpur" },
  { value: "bhaktapur", label: "Bhaktapur" },
  { value: "pokhara", label: "Kaski (Pokhara)" },
];

const TIMEZONE_OPTIONS = [
  { value: "nepal", label: "Nepal Time (NPT)" },
  { value: "utc", label: "UTC" },
];

const SERVICE_ICON_OPTIONS = [
  { value: "coffee", label: "Coffee (Charity Cafe)" },
  { value: "book-open", label: "Book Open (Library)" },
  { value: "globe", label: "Globe (Language)" },
  { value: "pen-tool", label: "Pen Tool (Literacy)" },
  { value: "heart", label: "Heart (Healthcare)" },
  { value: "droplet", label: "Droplet (Water)" },
  { value: "home", label: "Home (Shelter)" },
  { value: "users", label: "Users (Community)" },
];

const SECTOR_COLOR_OPTIONS = [
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
  { value: "orange", label: "Orange" },
  { value: "purple", label: "Purple" },
  { value: "red", label: "Red" },
  { value: "teal", label: "Teal" },
];

const SECTOR_ICON_OPTIONS = [
  { value: "graduation-cap", label: "Graduation Cap (Education)" },
  { value: "droplet", label: "Droplet (Water/Health)" },
  { value: "triangle-alert", label: "Alert (Disaster)" },
  { value: "users", label: "Users (Community)" },
  { value: "heart", label: "Heart (Healthcare)" },
  { value: "leaf", label: "Leaf (Environment)" },
];

const PROJECT_STATUS_OPTIONS = [
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "planned", label: "Planned" },
];

interface ServiceItem {
  icon: string;
  name: string;
  description: string;
}

interface SectorItem {
  name: string;
  color: string;
  icon: string;
  badgeLabel: string;
  description: string;
}

interface ProjectItem {
  name: string;
  category: string;
  image: string;
  description: string;
  date: string;
  location: string;
  status: string;
}

const OrganizationProfile: React.FC = memo(function OrganizationProfile() {
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [founderPhotoPreview, setFounderPhotoPreview] = useState<string>("");
  const [galleryImages, setGalleryImages] = useState<string[]>([
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
  ]);
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [mission, setMission] = useState("");
  const [vision, setVision] = useState("");
  const [founderMessage, setFounderMessage] = useState("");
  const [coreValues, setCoreValues] = useState([
    "Transparency",
    "Accountability",
    "Compassion",
  ]);
  const [services, setServices] = useState<ServiceItem[]>([
    { icon: "coffee", name: "Charity Cafe", description: "Providing free meals to those in need" },
  ]);
  const [sectors, setSectors] = useState<SectorItem[]>([
    { name: "Education", color: "blue", icon: "graduation-cap", badgeLabel: "Education", description: "Supporting education initiatives" },
  ]);
  const [projects, setProjects] = useState<ProjectItem[]>([
    { name: "Leadership Training 2026", category: "Leadership", image: "", description: "Training program for youth leaders", date: "April 2026", location: "Kathmandu", status: "ongoing" },
  ]);
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    twitter: "",
    instagram: "",
    youtube: "",
    linkedin: "",
    tiktok: "",
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const founderPhotoRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleCoverUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCoverPreview(URL.createObjectURL(file));
  }, []);

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setLogoPreview(URL.createObjectURL(file));
  }, []);

  const handleFounderPhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFounderPhotoPreview(URL.createObjectURL(file));
  }, []);

  const handleGalleryUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((f) => URL.createObjectURL(f));
      setGalleryImages((prev) => [...prev, ...newImages]);
    }
  }, []);

  const addCoreValue = useCallback(() => setCoreValues((prev) => [...prev, ""]), []);
  const removeCoreValue = useCallback((index: number) => setCoreValues((prev) => prev.filter((_, i) => i !== index)), []);
  const updateCoreValue = useCallback((index: number, value: string) => {
    setCoreValues((prev) => { const u = [...prev]; u[index] = value; return u; });
  }, []);

  const addService = useCallback(() => setServices((prev) => [...prev, { icon: "coffee", name: "", description: "" }]), []);
  const removeService = useCallback((index: number) => setServices((prev) => prev.filter((_, i) => i !== index)), []);
  const updateService = useCallback((index: number, field: keyof ServiceItem, value: string) => {
    setServices((prev) => { const u = [...prev]; u[index] = { ...u[index], [field]: value }; return u; });
  }, []);

  const addSector = useCallback(() => setSectors((prev) => [...prev, { name: "", color: "blue", icon: "graduation-cap", badgeLabel: "", description: "" }]), []);
  const removeSector = useCallback((index: number) => setSectors((prev) => prev.filter((_, i) => i !== index)), []);
  const updateSector = useCallback((index: number, field: keyof SectorItem, value: string) => {
    setSectors((prev) => { const u = [...prev]; u[index] = { ...u[index], [field]: value }; return u; });
  }, []);

  const addProject = useCallback(() => setProjects((prev) => [...prev, { name: "", category: "", image: "", description: "", date: "", location: "", status: "ongoing" }]), []);
  const removeProject = useCallback((index: number) => setProjects((prev) => prev.filter((_, i) => i !== index)), []);
  const updateProject = useCallback((index: number, field: keyof ProjectItem, value: string) => {
    setProjects((prev) => { const u = [...prev]; u[index] = { ...u[index], [field]: value }; return u; });
  }, []);

  const removeGalleryImage = useCallback((index: number) => setGalleryImages((prev) => prev.filter((_, i) => i !== index)), []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setSuccess("");
    setTimeout(() => {
      setSaving(false);
      setSuccess("Profile updated successfully!");
    }, 1000);
  }, []);

  return (
    <div className="pb-8">
      {/* Branding Images */}
      <SectionCard>
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Image className="w-5 h-5 text-blue-600" /> Branding Images
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Cover Photo</label>
            <div
              onClick={() => coverInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-md h-[100px] flex flex-col items-center justify-center cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-all"
            >
              <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
              <p className="text-sm text-slate-600">Click to upload or drag and drop</p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB (1920x500 recommended)</p>
            </div>
            <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
            {coverPreview && <img src={coverPreview} className="w-full h-32 object-cover rounded-lg mt-2" alt="Cover Preview" />}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Organization Logo</label>
            <div
              onClick={() => logoInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-md h-[120px] flex flex-col items-center justify-center cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-all"
            >
              <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
              <p className="text-sm text-slate-600">Click to upload or drag and drop</p>
              <p className="text-xs text-slate-400 mt-1">PNG, SVG up to 2MB (500x500 recommended)</p>
            </div>
            <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            {logoPreview && <img src={logoPreview} className="w-24 h-24 object-cover rounded-lg mt-2" alt="Logo Preview" />}
          </div>
        </div>
      </SectionCard>

      {/* Basic Information */}
      <SectionCard>
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" /> Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <InputField label="Organization Name" required placeholder="Enter organization name" />
          </div>
          <div>
            <SelectField label="Organization Type" required options={ORG_TYPE_OPTIONS} />
          </div>
          <div>
            <InputField label="Registration Number" placeholder="e.g., 12345/078-079" />
          </div>
          <div>
            <InputField label="Email Address" required type="email" placeholder="info@example.com" defaultValue="info@sowersaction.org.np" />
          </div>
          <div>
            <InputField label="Phone Number" required type="tel" placeholder="+977-1-XXXXXXX" defaultValue="01-5908179" />
          </div>
          <div>
            <InputField label="Mobile Number" type="tel" placeholder="+977-98XXXXXXXX" />
          </div>
          <div>
            <InputField label="Website URL" type="url" placeholder="https://www.example.com" />
          </div>
        </div>
      </SectionCard>

      {/* Address & Location */}
      <SectionCard>
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" /> Address & Location
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <InputField label="Street Address" required placeholder="House No, Street Name, Tole" />
          </div>
          <div>
            <SelectField label="Province" required options={PROVINCE_OPTIONS} />
          </div>
          <div>
            <SelectField label="District" required options={DISTRICT_OPTIONS} />
          </div>
          <div>
            <InputField label="City/Municipality" placeholder="e.g., Kathmandu Metropolitan" />
          </div>
          <div>
            <InputField label="Ward No" placeholder="e.g., Ward-8" />
          </div>
          <div>
            <InputField label="Postal Code" placeholder="e.g., 44600" />
          </div>
          <div>
            <InputField label="Country" defaultValue="Nepal" />
          </div>
        </div>
      </SectionCard>

      {/* About Organization */}
      <SectionCard>
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" /> About Organization
        </h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Short Description <span className="text-slate-400 font-normal">(for meta/cards)</span>
            </label>
            <textarea
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
              rows={3}
              maxLength={200}
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              placeholder="Brief description (max 200 characters)"
            />
            <p className="text-xs text-slate-500 text-right mt-1">{shortDesc.length}/200 characters</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Full Description / About Us <span className="text-red-500">*</span>
            </label>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <ReactQuill
                theme="snow"
                value={fullDesc}
                onChange={setFullDesc}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Describe your organization..."
                className="bg-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Mission Statement</label>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={mission}
                  onChange={setMission}
                  modules={quillModules}
                  formats={quillFormats}
                  className="bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Vision Statement</label>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={vision}
                  onChange={setVision}
                  modules={quillModules}
                  formats={quillFormats}
                  className="bg-white"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Core Values</label>
            <div className="space-y-3">
              {coreValues.map((value, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    className="flex-1 px-3.5 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
                    placeholder={`Value ${index + 1} (e.g., Transparency)`}
                    value={value}
                    onChange={(e) => updateCoreValue(index, e.target.value)}
                  />
                  <button type="button" className="text-red-500 hover:text-red-700" onClick={() => removeCoreValue(index)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" className="text-blue-600 text-sm font-medium hover:underline mt-2 flex items-center gap-1" onClick={addCoreValue}>
              <Plus className="w-4 h-4" /> Add More Values
            </button>
          </div>
        </div>
      </SectionCard>

      {/* Our Services */}
      <SectionCard>
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-blue-600" /> Our Services
        </h2>
        <div className="space-y-4">
          {services.map((service, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Icon</label>
                  <select
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-600"
                    value={service.icon}
                    onChange={(e) => updateService(index, "icon", e.target.value)}
                  >
                    <option value="coffee">Coffee (Charity Cafe)</option>
                    <option value="book-open">Book Open (Library)</option>
                    <option value="globe">Globe (Language)</option>
                    <option value="pen-tool">Pen Tool (Literacy)</option>
                    <option value="heart">Heart (Healthcare)</option>
                    <option value="droplet">Droplet (Water)</option>
                    <option value="home">Home (Shelter)</option>
                    <option value="users">Users (Community)</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Service Name</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-600"
                    placeholder="e.g., Charity Cafe"
                    value={service.name}
                    onChange={(e) => updateService(index, "name", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Description</label>
                <textarea
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-600"
                  rows={2}
                  placeholder="Brief description of the service"
                  value={service.description}
                  onChange={(e) => updateService(index, "description", e.target.value)}
                />
              </div>
              <button type="button" className="text-red-500 text-xs font-medium hover:underline mt-2" onClick={() => removeService(index)}>
                Remove Service
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="text-blue-600 text-sm font-medium hover:underline mt-3 flex items-center gap-1" onClick={addService}>
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </SectionCard>

      {/* Our Sectors */}
      <SectionCard>
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-600" /> Our Sectors
        </h2>
        <div className="space-y-4">
          {sectors.map((sector, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Sector Name</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-600"
                    placeholder="e.g., Education"
                    value={sector.name}
                    onChange={(e) => updateSector(index, "name", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Color Theme</label>
                  <select
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-600"
                    value={sector.color}
                    onChange={(e) => updateSector(index, "color", e.target.value)}
                  >
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="orange">Orange</option>
                    <option value="purple">Purple</option>
                    <option value="red">Red</option>
                    <option value="teal">Teal</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Icon</label>
                  <select
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-600"
                    value={sector.icon}
                    onChange={(e) => updateSector(index, "icon", e.target.value)}
                  >
                    <option value="graduation-cap">Graduation Cap (Education)</option>
                    <option value="droplet">Droplet (Water/Health)</option>
                    <option value="triangle-alert">Alert (Disaster)</option>
                    <option value="users">Users (Community)</option>
                    <option value="heart">Heart (Healthcare)</option>
                    <option value="leaf">Leaf (Environment)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Badge Label</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-600"
                    placeholder="e.g., Education"
                    value={sector.badgeLabel}
                    onChange={(e) => updateSector(index, "badgeLabel", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Description</label>
                <textarea
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-600"
                  rows={2}
                  placeholder="Brief description of work in this sector"
                  value={sector.description}
                  onChange={(e) => updateSector(index, "description", e.target.value)}
                />
              </div>
              <button type="button" className="text-red-500 text-xs font-medium hover:underline mt-2" onClick={() => removeSector(index)}>
                Remove Sector
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="text-blue-600 text-sm font-medium hover:underline mt-3 flex items-center gap-1" onClick={addSector}>
          <Plus className="w-4 h-4" /> Add Sector
        </button>
      </SectionCard>

      {/* Our Projects */}
      <SectionCard>
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-blue-600" /> Our Projects
        </h2>
        <div className="space-y-6">
          {projects.map((project, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Project Name</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-600"
                    placeholder="e.g., Leadership Training 2026"
                    value={project.name}
                    onChange={(e) => updateProject(index, "name", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Category Badge</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-600"
                    placeholder="e.g., Leadership"
                    value={project.category}
                    onChange={(e) => updateProject(index, "category", e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Project Image</label>
                <div className="border-2 border-dashed border-slate-200 rounded-md py-3 flex flex-col items-center justify-center cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-all">
                  <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
                  <p className="text-xs text-slate-500">Upload project image</p>
                </div>
              </div>
              <div className="mb-3">
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Description</label>
                <textarea
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-600"
                  rows={2}
                  placeholder="Brief project description"
                  value={project.description}
                  onChange={(e) => updateProject(index, "description", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Date/Period</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-600"
                    placeholder="e.g., April 2026"
                    value={project.date}
                    onChange={(e) => updateProject(index, "date", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Location</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-600"
                    placeholder="e.g., Kathmandu"
                    value={project.location}
                    onChange={(e) => updateProject(index, "location", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Status</label>
                  <select
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-600"
                    value={project.status}
                    onChange={(e) => updateProject(index, "status", e.target.value)}
                  >
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="planned">Planned</option>
                  </select>
                </div>
              </div>
              <button type="button" className="text-red-500 text-xs font-medium hover:underline mt-2" onClick={() => removeProject(index)}>
                Remove Project
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="text-blue-600 text-sm font-medium hover:underline mt-3 flex items-center gap-1" onClick={addProject}>
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </SectionCard>

      {/* Photo Gallery */}
      <SectionCard>
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Images className="w-5 h-5 text-blue-600" /> Photo Gallery
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Upload Images</label>
          <div
            onClick={() => galleryInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 rounded-md p-8 text-center cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-all"
          >
            <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600">Click to upload or drag and drop multiple images</p>
            <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB each</p>
          </div>
          <input ref={galleryInputRef} type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryImages.map((img, index) => (
            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200">
              <img src={img} className="w-full h-full object-cover" alt="Gallery" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                <button className="p-2 bg-white rounded-full hover:bg-slate-100">
                  <Image className="w-4 h-4" />
                </button>
                <button className="p-2 bg-white rounded-full hover:bg-slate-100" onClick={() => removeGalleryImage(index)}>
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Social Media Links */}
      <SectionCard>
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Share2 className="w-5 h-5 text-blue-600" /> Social Media Links
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <InputField label="Facebook URL" type="url" placeholder="https://facebook.com/yourpage" />
          </div>
          <div>
            <InputField label="Twitter/X URL" type="url" placeholder="https://twitter.com/yourhandle" />
          </div>
          <div>
            <InputField label="Instagram URL" type="url" placeholder="https://instagram.com/yourprofile" />
          </div>
          <div>
            <InputField label="YouTube URL" type="url" placeholder="https://youtube.com/yourchannel" />
          </div>
          <div>
            <InputField label="LinkedIn URL" type="url" placeholder="https://linkedin.com/company/yourorg" />
          </div>
          <div>
            <InputField label="TikTok URL" type="url" placeholder="https://tiktok.com/@yourhandle" />
          </div>
        </div>
      </SectionCard>

      {/* Contact Person */}
      <SectionCard>
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" /> Contact Person Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <InputField label="Contact Person Name" placeholder="Full name" />
          </div>
          <div>
            <InputField label="Designation/Position" placeholder="e.g., Executive Director" />
          </div>
          <div>
            <InputField label="Contact Email" type="email" placeholder="contact@example.com" />
          </div>
          <div>
            <InputField label="Contact Phone" type="tel" placeholder="+977-98XXXXXXXX" />
          </div>
          <div>
            <InputField label="Office Hours" placeholder="e.g., Sun-Thu, 9AM-5PM" />
          </div>
          <div>
            <SelectField label="Timezone" options={TIMEZONE_OPTIONS} />
          </div>
        </div>
      </SectionCard>

      {/* Founder's Message */}
      <SectionCard>
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-blue-600" /> Founder&apos;s Message
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Founder Photo</label>
            <div
              onClick={() => founderPhotoRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-md h-[100px] flex flex-col items-center justify-center cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-all"
            >
              <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
              <p className="text-sm text-slate-600">Upload square photo</p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG (200x200)</p>
            </div>
            <input ref={founderPhotoRef} type="file" accept="image/*" onChange={handleFounderPhotoUpload} className="hidden" />
            {founderPhotoPreview && <img src={founderPhotoPreview} className="w-20 h-20 object-cover rounded-lg mt-2" alt="Founder Preview" />}
          </div>
          <div className="md:col-span-3 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Founder Name" placeholder="Full name of founder" />
              <InputField label="Designation" placeholder="e.g., Founder & Chairperson" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={founderMessage}
                  onChange={setFounderMessage}
                  modules={quillModules}
                  formats={quillFormats}
                  className="bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Action Buttons */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium">
          {success}
        </div>
      )}
      <div className="flex justify-end gap-4">
        <Button variant="outline">
          <Eye className="w-4 h-4" /> Preview
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
});

OrganizationProfile.displayName = "OrganizationProfile";

export default OrganizationProfile;
