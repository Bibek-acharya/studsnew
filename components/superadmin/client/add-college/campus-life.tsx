"use client";

import React from "react";
import { CheckCircle, Calendar, Award } from "lucide-react";
import { FormCard } from "./FormCard";
import { FormInput } from "./FormInput";
import { FACILITIES } from "@/lib/superadmin/constants";

export function FacilitiesCard({
  locked,
  onToggleLock,
}: {
  locked: boolean;
  onToggleLock: () => void;
}) {
  return (
    <FormCard
      icon={<CheckCircle size={24} className="text-orange-600" />}
      title="Facilities"
      sub="Campus infrastructure and amenities"
      locked={locked}
      onToggleLock={onToggleLock}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {FACILITIES.map((facility) => (
            <label
              key={facility.id}
              className="flex cursor-pointer items-center gap-3 rounded-md border border-gray-200 p-4 transition-all hover:border-blue-300 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex items-center gap-3">
                <FacilityIcon id={facility.id} />
                <span className="text-sm font-medium text-gray-700">{facility.label}</span>
              </div>
            </label>
          ))}
        </div>
        <div>
          <FormInput
            label="Additional Facilities Description"
            type="textarea"
            rows={3}
            placeholder="Describe any other facilities not listed above..."
          />
        </div>
      </div>
    </FormCard>
  );
}

function FacilityIcon({ id }: { id: string }) {
  const size = 20;
  const className = "text-gray-600";
  switch (id) {
    case "library":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        </svg>
      );
    case "science-labs":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M10 2v6.5a4.5 4.5 0 00-4.5 4.5h13a4.5 4.5 0 00-4.5-4.5V2" /><path d="M7.5 17.5A2.5 2.5 0 005 20h14a2.5 2.5 0 00-2.5-2.5" /><path d="M6 14l2 3l4-2l4 2l2-3" />
        </svg>
      );
    case "computer-labs":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><path d="M8 21h8" /><path d="M12 17v4" />
        </svg>
      );
    case "sports":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M6 17l3-3l4 4l-3 3z" /><path d="M4 20l4-4" /><path d="M21 5l-4 4l-3-3l4-4z" /><path d="M17 12l3-3l-3-3" />
        </svg>
      );
    case "wifi":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M5 12.55a11 11 0 0114.08 0" /><path d="M1.42 9a16 16 0 0121.16 0" /><path d="M8.53 16.11a6 6 0 016.95 0" /><circle cx="12" cy="20" r="1" />
        </svg>
      );
    case "transport":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="3" y="3" width="18" height="14" rx="2" /><path d="M3 7h18" /><path d="M7 21h10" /><path d="M4 17l-1 4" /><path d="M20 17l1 4" />
        </svg>
      );
    case "cafeteria":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
        </svg>
      );
    case "auditorium":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" />
        </svg>
      );
    case "hostel":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M3 7l9-4l9 4v13H3V7z" /><path d="M7 11h.01" /><path d="M11 11h.01" /><path d="M7 15h.01" /><path d="M11 15h.01" /><path d="M15 11h.01" /><path d="M19 11h.01" />
        </svg>
      );
    default:
      return null;
  }
}

export function EventsActivitiesCard({
  locked,
  onToggleLock,
}: {
  locked: boolean;
  onToggleLock: () => void;
}) {
  return (
    <FormCard
      icon={<Calendar size={24} className="text-rose-600" />}
      title="Events & Activities"
      sub="Campus events and student activities"
      locked={locked}
      onToggleLock={onToggleLock}
      action={
        <button
          type="button"
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="M12 5v14" />
          </svg>
          Add Event
        </button>
      }
    >
      <div className="rounded-md bg-gray-50 p-6">
        <h4 className="mb-4 text-sm font-bold text-gray-700">Add New Event</h4>
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput label="Event Name" placeholder="e.g., Technika 2025" />
          <FormInput label="Venue" placeholder="e.g., Main Auditorium" />
        </div>
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput label="Start Date" type="date" />
          <FormInput label="End Date" type="date" />
        </div>
        <div className="mb-4">
          <FormInput label="Event Description" type="textarea" rows={3} placeholder="Annual tech symposium with hackathons, workshops, and robotics competitions..." />
        </div>
        <div>
          <label className="mb-3 block text-sm font-medium text-gray-700">Event Image</label>
          <div className="cursor-pointer rounded-md border-2 border-dashed border-gray-300 p-6 text-center transition-all hover:border-blue-400 hover:bg-blue-50/50">
            <svg className="mx-auto mb-2 h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
            <p className="text-sm text-gray-600">Click to upload image</p>
            <p className="mt-1 text-xs text-gray-500">JPG, PNG (max. 2MB)</p>
            <input type="file" className="hidden" accept="image/*" />
          </div>
        </div>
      </div>
    </FormCard>
  );
}

export function CollegeScholarshipCard({
  locked,
  onToggleLock,
}: {
  locked: boolean;
  onToggleLock: () => void;
}) {
  return (
    <FormCard
      icon={<Award size={24} className="text-yellow-600" />}
      title="Scholarship"
      sub="Financial aid and scholarship programs"
      locked={locked}
      onToggleLock={onToggleLock}
      action={
        <button
          type="button"
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="M12 5v14" />
          </svg>
          Add Scholarship
        </button>
      }
    >
      <div className="rounded-md bg-gray-50 p-6">
        <h4 className="mb-4 text-sm font-bold text-gray-700">Add New Scholarship</h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <FormInput label="Program" placeholder="e.g., +2 Science" />
          <FormInput label="Scholarship Name" placeholder="Merit Scholarship" />
          <FormInput label="Benefit" placeholder="Up to 100% waiver" />
          <FormInput label="For Whom" placeholder="Top 5% in SEE" />
        </div>
      </div>
    </FormCard>
  );
}
