"use client";

import React from "react";
import { Building2, Phone } from "lucide-react";
import { FormCard } from "./FormCard";
import { FormInput, FileUpload } from "./FormInput";
import { COLLEGE_LEVELS, COLLEGE_TYPES, AFFILIATIONS } from "@/lib/superadmin/constants";

export function BasicInfoCard({
  locked,
  onToggleLock,
}: {
  locked: boolean;
  onToggleLock: () => void;
}) {
  return (
    <FormCard
      icon={<Building2 size={24} className="text-blue-600" />}
      title="Basic Information"
      sub="Essential details about the college"
      locked={locked}
      onToggleLock={onToggleLock}
    >
      <div className="space-y-8">
        <FileUpload
          label="Cover/Banner Photo"
          sub="Upload Cover Photo"
          description="PNG, JPG (max. 5MB) — Recommended: 1200x400px (Wide Rectangular)"
          accept="image/*"
          required
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              College Logo <span className="text-red-500">*</span>
            </label>
            <div className="cursor-pointer rounded-md border-2 border-dashed border-gray-200 p-6 text-center transition-all hover:border-blue-400 hover:bg-blue-50/50">
              <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Upload Logo</p>
              <p className="mt-1 text-[10px] text-gray-400">PNG, JPG, SVG — 150x150px</p>
            </div>
          </div>

          <div className="space-y-6 md:col-span-2">
            <FormInput label="College Name" placeholder="e.g., GoldenGate International College" required />
            <FormInput label="Location" placeholder="e.g., Kamalpokhari, Kathmandu" required />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <FormInput label="College Level" type="select" options={COLLEGE_LEVELS} required />
          <FormInput label="College Type" type="select" options={COLLEGE_TYPES} required />
          <FormInput label="Affiliation" type="select" options={AFFILIATIONS} required />
          <FormInput label="Establishment Date" type="date" />
          <FormInput label="Registration Number" placeholder="e.g., 12345/078" />
          <FormInput label="Campus Size" placeholder="e.g., 154.77 hectares" />
          <FormInput label="Average Rating" type="number" placeholder="4.5" step="0.1" min="0" max="5" />
          <FormInput label="Website URL" type="url" placeholder="https://www.college.edu.np" />
        </div>
      </div>
    </FormCard>
  );
}

export function ContactInfoCard({
  locked,
  onToggleLock,
}: {
  locked: boolean;
  onToggleLock: () => void;
}) {
  return (
    <FormCard
      icon={<Phone size={24} className="text-green-600" />}
      title="Contact Information"
      sub="Primary contact details for administration"
      locked={locked}
      onToggleLock={onToggleLock}
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormInput label="Contact Person Name" placeholder="e.g., Ram Sharma" required />
        <FormInput label="Designation" placeholder="e.g., Principal" required />
        <FormInput label="Phone Number" type="tel" placeholder="+977-1-XXXXXXX" required />
        <FormInput label="Email Address" type="email" placeholder="info@college.edu.np" required />
        <div className="md:col-span-2">
          <FormInput label="Website URL" type="url" placeholder="https://www.college.edu.np" />
        </div>
        <div className="md:col-span-2">
          <FormInput label="Physical Address" type="textarea" placeholder="Street address, city, province..." />
        </div>
      </div>
    </FormCard>
  );
}
