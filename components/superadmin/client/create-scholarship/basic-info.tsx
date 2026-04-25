"use client";

import React from "react";
import { GraduationCap } from "lucide-react";
import { FormCard } from "../add-college/FormCard";
import { FormInput } from "../add-college/FormInput";
import { generateId } from "@/lib/superadmin/constants";

const DEGREE_LEVELS = [
  { value: "+2", label: "+2 / Higher Secondary" },
  { value: "bachelor", label: "Bachelor" },
  { value: "master", label: "Master" },
  { value: "phd", label: "PhD" },
  { value: "all", label: "All Levels" },
] as const;

const STATUSES = [
  { value: "open", label: "Open" },
  { value: "closed", label: "Closed" },
  { value: "draft", label: "Draft" },
  { value: "upcoming", label: "Upcoming" },
] as const;

const FUNDING_TYPES = [
  { value: "fully", label: "Fully Funded" },
  { value: "partially", label: "Partially Funded" },
  { value: "both", label: "Both" },
] as const;

const SCHOLARSHIP_TYPES = [
  { value: "merit", label: "Merit Based" },
  { value: "need", label: "Need Based" },
  { value: "minority", label: "Minority" },
  { value: "research", label: "Research Grant" },
] as const;

const BENEFITS = ["Tuition Fees", "Food & Accommodation", "Research Materials", "Travel Allowance", "Books & Supplies", "Full Support"];

export function BasicInfoCard({ locked, onToggleLock }: { locked: boolean; onToggleLock: () => void }) {
  return (
    <FormCard icon={<GraduationCap size={24} className="text-blue-600" />} title="Basic Information" sub="Essential details about the scholarship program" locked={locked} onToggleLock={onToggleLock}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FormInput label="Scholarship Title" placeholder="e.g., Project Shiksha Scholarship 2025" required />
          <FormInput label="Provider / Organization" placeholder="e.g., 100 Group, Sowers Action Nepal" required />
          <FormInput label="Location" placeholder="e.g., Kathmandu, Nepal" />
          <FormInput label="Degree Level" type="select" options={DEGREE_LEVELS} required />
          <FormInput label="Status" type="select" options={STATUSES} required />
          <FormInput label="Field of Study" placeholder="e.g., Science, Technology, All" />
        </div>
      </div>
    </FormCard>
  );
}

export function FinancialCard({ locked, onToggleLock }: { locked: boolean; onToggleLock: () => void }) {
  return (
    <FormCard icon={<GraduationCap size={24} className="text-yellow-600" />} title="Financial Details" sub="Funding information and coverage details" locked={locked} onToggleLock={onToggleLock}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <FormInput label="Total Value / Amount" placeholder="e.g., NPR 500,000" required />
          <FormInput label="Total Seats" type="number" placeholder="e.g., 110" required />
          <FormInput label="Funding Type" type="select" options={FUNDING_TYPES} required />
          <FormInput label="Scholarship Type" type="select" options={SCHOLARSHIP_TYPES} required />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Coverage / Benefits</label>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <label key={benefit} className="flex cursor-pointer items-center gap-3 rounded-md border border-gray-200 p-3 transition-all hover:border-blue-300 hover:bg-gray-50">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm font-medium text-gray-700">{benefit}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </FormCard>
  );
}

export function DescriptionCard({ locked, onToggleLock }: { locked: boolean; onToggleLock: () => void }) {
  return (
    <FormCard icon={<GraduationCap size={24} className="text-amber-600" />} title="Description & Details" sub="Program overview, eligibility, and terms" locked={locked} onToggleLock={onToggleLock}>
      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Program Description</label>
          <textarea className="input-field min-h-[120px]" rows={4} placeholder="Describe the scholarship program, its mission, and what makes it unique..." />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Eligibility Criteria</label>
            <textarea className="input-field min-h-[120px]" rows={4} placeholder="List the eligibility requirements line by line..." />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Required Documents</label>
            <textarea className="input-field min-h-[120px]" rows={4} placeholder="List the required application documents..." />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Terms & Conditions</label>
          <textarea className="input-field min-h-[100px]" rows={3} placeholder="Terms, conditions, and any special notes..." />
        </div>
      </div>
    </FormCard>
  );
}

export function TimelineCard({ locked, onToggleLock }: { locked: boolean; onToggleLock: () => void }) {
  const [dates, setDates] = React.useState([
    { id: generateId(), event: "Application Opens", date: "" },
    { id: generateId(), event: "Application Deadline", date: "" },
    { id: generateId(), event: "Entrance Examination", date: "" },
  ]);

  return (
    <FormCard icon={<GraduationCap size={24} className="text-purple-600" />} title="Timeline & Important Dates" sub="Key dates for the scholarship program" locked={locked} onToggleLock={onToggleLock} action={
      <button type="button" onClick={() => setDates((prev) => [...prev, { id: generateId(), event: "", date: "" }])} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="M12 5v14" /></svg> Add Date
      </button>
    }>
      <div className="space-y-4">
        {dates.map((d) => (
          <div key={d.id} className="grid grid-cols-1 items-end gap-4 md:grid-cols-12 md:gap-6">
            <div className="md:col-span-8">
              <input type="text" className="input-field" placeholder="e.g., Application Opens" defaultValue={d.event} />
            </div>
            <div className="md:col-span-3">
              <input type="date" className="input-field" defaultValue={d.date} />
            </div>
            <div className="md:col-span-1">
              <button type="button" onClick={() => setDates((prev) => prev.filter((x) => x.id !== d.id))} className="w-full rounded-md p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </FormCard>
  );
}

export function MediaCard({ locked, onToggleLock }: { locked: boolean; onToggleLock: () => void }) {
  return (
    <FormCard icon={<GraduationCap size={24} className="text-green-600" />} title="Media & Documents" sub="Cover photo, notice image, and official documents" locked={locked} onToggleLock={onToggleLock}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">Cover / Banner Photo</label>
            <div className="cursor-pointer rounded-md border-2 border-dashed border-gray-200 p-8 text-center transition-all hover:border-blue-400 hover:bg-blue-50/50">
              <div className="mx-auto mb-4 flex h-40 w-full items-center justify-center rounded-md bg-gray-50">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>
              </div>
              <p className="text-base font-medium text-gray-700">Upload Cover Photo</p>
              <p className="mt-1 text-sm text-gray-500">Recommended: 1200x400px</p>
              <input type="file" className="hidden" accept="image/*" />
            </div>
          </div>
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">Notice / Document Image</label>
            <div className="cursor-pointer rounded-md border-2 border-dashed border-gray-200 p-8 text-center transition-all hover:border-blue-400 hover:bg-blue-50/50">
              <div className="mx-auto mb-4 flex h-40 w-full items-center justify-center rounded-md bg-gray-50">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
              </div>
              <p className="text-base font-medium text-gray-700">Upload Notice Image</p>
              <p className="mt-1 text-sm text-gray-500">PNG, JPG (max. 5MB)</p>
              <input type="file" className="hidden" accept="image/*" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Official Notice URL</label>
            <input type="url" className="input-field" placeholder="https://example.com/notice.pdf" />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Provider Website</label>
            <input type="url" className="input-field" placeholder="https://provider.org" />
          </div>
        </div>
      </div>
    </FormCard>
  );
}

export function ContactCard({ locked, onToggleLock }: { locked: boolean; onToggleLock: () => void }) {
  return (
    <FormCard icon={<GraduationCap size={24} className="text-green-600" />} title="Contact Information" sub="Provider contact details" locked={locked} onToggleLock={onToggleLock}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Provider Email</label>
          <input type="email" className="input-field" placeholder="provider@organization.org" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Provider Phone</label>
          <input type="tel" className="input-field" placeholder="+977-1-XXXXXXX" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Provider Domain</label>
          <input type="text" className="input-field" placeholder="e.g., provider.org" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Contact Person</label>
          <input type="text" className="input-field" placeholder="e.g., Mr. Coordinator Name" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Additional Contact Info</label>
          <textarea className="input-field min-h-[80px]" rows={3} placeholder="Any additional contact details or office hours..." />
        </div>
      </div>
    </FormCard>
  );
}
