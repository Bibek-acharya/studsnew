"use client";

import React from "react";
import {
  Building2,
  Phone,
  Images,
  ImageIcon,
  Bold,
  Italic,
  Underline,
  List as ListIcon,
  Link as LinkIcon,
  Undo,
  Redo,
  CloudUpload,
  Plus,
} from "lucide-react";

export default function AddCollegeSection({
  setActiveSection,
  lockedSections,
  setLockedSections,
}: {
  setActiveSection: (s: string) => void;
  lockedSections: Record<string, boolean>;
  setLockedSections: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}) {
  const toggleLock = (sid: string) => {
    setLockedSections((prev) => ({ ...prev, [sid]: !prev[sid] }));
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Add New College</h2>
          <p className="mt-1 text-gray-500">Register a new educational institution to the system</p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => setActiveSection("manage-college")} className="rounded-md border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button type="button" className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-200">
            Save College
          </button>
        </div>
      </div>

      <FormCard
        id="basic"
        title="Basic Information"
        sub="Essential details about the college"
        icon={<Building2 size={24} className="text-blue-600" />}
        locked={lockedSections.basic}
        onToggleLock={() => toggleLock("basic")}
      >
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700">Cover/Banner Photo <span className="text-red-500">*</span></label>
            <div className="cursor-pointer rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center transition-all hover:border-blue-400 hover:bg-blue-50/50">
              <div className="mb-4 flex h-40 w-full items-center justify-center rounded-xl bg-gray-50 transition-colors group-hover:bg-blue-100">
                <ImageIcon size={48} className="text-gray-400" />
              </div>
              <p className="text-sm font-bold text-gray-700">Upload Cover Photo</p>
              <p className="mt-1 text-xs text-gray-400">Recommended: 1200x400px (Wide Rectangular)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700">College Logo</label>
              <div className="cursor-pointer rounded-xl border-2 border-dashed border-gray-200 p-6 text-center transition-all hover:border-blue-400 hover:bg-blue-50/50">
                <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 transition-colors">
                  <ImageIcon size={24} className="text-gray-400" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Upload PNG</p>
              </div>
            </div>
            <div className="space-y-6 md:col-span-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">College Name <span className="text-red-500">*</span></label>
                <input type="text" className="input-field" placeholder="e.g., GoldenGate International College" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">Location <span className="text-red-500">*</span></label>
                <input type="text" className="input-field" placeholder="e.g., Kamalpokhari, Kathmandu" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <FormInput label="College Level" type="select" options={["+2 College", "Bachelor", "Master"]} required />
            <FormInput label="College Type" type="select" options={["Public", "Private", "Community"]} required />
            <FormInput label="Affiliation" type="select" options={["Tribhuvan University", "Kathmandu University"]} required />
            <FormInput label="Establishment Date" type="date" />
          </div>
        </div>
      </FormCard>

      <FormCard
        id="contact"
        title="Contact Information"
        sub="Primary contact details for administration"
        icon={<Phone size={24} className="text-green-600" />}
        locked={lockedSections.contact}
        onToggleLock={() => toggleLock("contact")}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormInput label="Contact Person Name" placeholder="e.g., Ram Sharma" required />
          <FormInput label="Designation" placeholder="e.g., Principal" required />
          <FormInput label="Phone Number" placeholder="+977-1-XXXXXXX" required />
          <FormInput label="Email Address" placeholder="info@college.edu.np" required />
          <div className="md:col-span-2">
            <FormInput label="Physical Address" type="textarea" placeholder="Street address, city, province..." />
          </div>
        </div>
      </FormCard>

      <FormCard
        id="extra"
        title="About & Gallery"
        sub="Tell students more with photos and descriptions"
        icon={<Images size={24} className="text-purple-600" />}
        locked={lockedSections.extra}
        onToggleLock={() => toggleLock("extra")}
      >
        <div className="space-y-8">
          <div className="space-y-4">
            <label className="text-sm font-bold text-gray-700">College Description</label>
            <div className="overflow-hidden rounded-xl border border-gray-200 transition-all focus-within:border-blue-600">
              <div className="flex items-center gap-1 border-b border-gray-200 bg-gray-50 p-2">
                <EditorBtn icon={<Bold size={16} />} />
                <EditorBtn icon={<Italic size={16} />} />
                <EditorBtn icon={<Underline size={16} />} />
                <EditorBtn icon={<ListIcon size={16} />} />
                <EditorBtn icon={<LinkIcon size={16} />} />
                <EditorBtn icon={<Undo size={16} />} />
                <EditorBtn icon={<Redo size={16} />} />
              </div>
              <textarea placeholder="Write a comprehensive description..." className="min-h-[150px] w-full p-4 text-sm outline-none" />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-gray-700">Gallery</label>
            <div className="cursor-pointer rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center transition-all hover:border-blue-400 hover:bg-blue-50">
              <CloudUpload size={48} className="mx-auto mb-3 text-gray-400" />
              <p className="text-sm font-bold text-gray-700">Click to upload photos</p>
              <p className="mt-1 text-xs text-gray-500">Multi-upload supported (max. 20 photos)</p>
            </div>
          </div>
        </div>
      </FormCard>

      <div className="flex justify-end gap-4">
        <button type="button" onClick={() => setActiveSection("manage-college")} className="rounded-md border border-gray-200 px-6 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
        <button type="button" className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-xl shadow-blue-100">
          Publish College
        </button>
      </div>
    </div>
  );
}

function FormCard({
  icon,
  title,
  sub,
  locked,
  onToggleLock,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  locked: boolean;
  onToggleLock: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
      <div className="mb-8 flex items-center justify-between border-b border-gray-50 pb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 shadow-sm">{icon}</div>
          <div>
            <h3 className="text-xl font-extrabold tracking-tight text-gray-900">{title}</h3>
            <p className="text-sm font-medium text-gray-500">{sub}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-2">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{locked ? "Locked" : "Unlocked"}</span>
          <label className="section-lock-toggle">
            <input type="checkbox" className="sr-only" checked={locked} onChange={onToggleLock} />
            <div className={`relative h-6 w-10 rounded-full transition-all ${locked ? "bg-red-500" : "bg-blue-600"}`}>
              <div className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-all ${locked ? "translate-x-4 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "translate-x-0"}`} />
            </div>
          </label>
        </div>
      </div>

      <div className={`transition-all duration-300 ${locked ? "pointer-events-none scale-[0.99] opacity-30 blur-[1px]" : "opacity-100"}`}>
        {children}
      </div>
    </div>
  );
}

function FormInput({
  label,
  type = "text",
  placeholder,
  options,
  required,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  options?: string[];
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-gray-700">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>
      {type === "select" ? (
        <select className="input-field font-medium">
          <option value="">Select {label}</option>
          {(options || []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea className="input-field min-h-[100px] py-4" placeholder={placeholder} />
      ) : (
        <input type={type} className="input-field" placeholder={placeholder} />
      )}
    </div>
  );
}

function EditorBtn({ icon }: { icon: React.ReactNode }) {
  return (
    <button type="button" className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-white hover:text-blue-600">
      {icon}
    </button>
  );
}
