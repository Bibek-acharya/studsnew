"use client";

import React, { useState, memo } from "react";
import dynamic from "next/dynamic";
import { Home, Image, Building2, MapPin, FileText, UploadCloud } from "lucide-react";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const quillModules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link"],
    ["clean"],
  ],
};

const quillFormats = ["bold", "italic", "underline", "strike", "list", "align", "link"];

const PROVINCES = [
  "", "Province 1", "Madhesh", "Bagmati", "Gandaki", "Lumbini", "Karnali", "Sudurpashchim",
];

const DISTRICTS = [
  { value: "", label: "Select District" },
  { value: "kathmandu", label: "Kathmandu" },
  { value: "lalitpur", label: "Lalitpur" },
  { value: "bhaktapur", label: "Bhaktapur" },
  { value: "kaski", label: "Kaski (Pokhara)" },
];

const ORG_TYPES = [
  { value: "ngo", label: "NGO" },
  { value: "nonprofit", label: "Non-Profit" },
  { value: "foundation", label: "Foundation" },
  { value: "trust", label: "Trust" },
  { value: "association", label: "Association" },
];

const OrganizationProfile: React.FC = memo(() => {
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");

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

      {/* Branding Images */}
      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Image className="w-5 h-5 text-blue-600" /> Branding Images
          </h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors">Draft</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">Save</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Cover Photo</label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center justify-center" style={{ height: "200px" }}>
              <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB (1920x500 recommended)</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Organization Logo</label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center justify-center" style={{ height: "200px" }}>
              <div className="w-[50px] h-[50px] mx-auto mb-3 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <UploadCloud className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-400 mt-1">PNG, SVG up to 2MB (500x500 recommended)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" /> Basic Information
          </h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors">Draft</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">Save</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Organization Name <span className="text-red-500">*</span></label>
            <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" defaultValue="Sowers Action Nepal" placeholder="Enter organization name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Organization Type <span className="text-red-500">*</span></label>
            <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500">
              <option value="">Select Type</option>
              {ORG_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Registration Number</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="e.g., 12345/078-079" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
            <input type="email" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" defaultValue="info@sowersaction.org.np" placeholder="info@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
            <input type="tel" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" defaultValue="01-5908179" placeholder="+977-1-XXXXXXX" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number</label>
            <input type="tel" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="+977-98XXXXXXXX" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Website URL</label>
            <input type="url" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="https://www.example.com" />
          </div>
        </div>
      </div>

      {/* Address & Location */}
      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" /> Address & Location
          </h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors">Draft</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">Save</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address <span className="text-red-500">*</span></label>
            <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="House No, Street Name, Tole" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Province <span className="text-red-500">*</span></label>
            <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500">
              <option value="">Select Province</option>
              {PROVINCES.filter(Boolean).map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">District <span className="text-red-500">*</span></label>
            <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500">
              {DISTRICTS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">City/Municipality</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="e.g., Kathmandu Metropolitan" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ward No</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="e.g., Ward-8" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Postal Code</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="e.g., 44600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" defaultValue="Nepal" />
          </div>
        </div>
      </div>

      {/* About Organization */}
      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" /> About Organization
          </h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors">Draft</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">Save</button>
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Short Description <span className="text-gray-400 font-normal">(for meta/cards)</span></label>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <ReactQuill theme="snow" value={shortDesc} onChange={setShortDesc} modules={quillModules} formats={quillFormats} className="bg-white" />
            </div>
            <p className="text-xs text-gray-500 text-right mt-1">{shortDesc.replace(/<[^>]*>/g, "").length}/200 characters</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Description / About Us <span className="text-red-500">*</span></label>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <ReactQuill theme="snow" value={fullDesc} onChange={setFullDesc} modules={quillModules} formats={quillFormats} className="bg-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

OrganizationProfile.displayName = "OrganizationProfile";

export default OrganizationProfile;
