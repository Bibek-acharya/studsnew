"use client";

import React from "react";
import { Video, FileText, Target } from "lucide-react";
import { FormCard } from "./FormCard";
import { FormInput } from "./FormInput";

export function VideoIntroCard({
  locked,
  onToggleLock,
}: {
  locked: boolean;
  onToggleLock: () => void;
}) {
  return (
    <FormCard
      icon={<Video size={24} className="text-purple-600" />}
      title="Video Introduction"
      sub="Add college introduction video with staff"
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
          Add Participant
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Main Introduction Video</label>
          <div className="cursor-pointer rounded-md border-2 border-dashed border-gray-200 p-8 text-center transition-all hover:border-blue-400 hover:bg-blue-50/50">
            <div className="mx-auto mb-4 flex h-48 w-full items-center justify-center rounded-md bg-gray-50">
              <Video size={64} className="text-gray-400" />
            </div>
            <p className="text-base font-medium text-gray-700">Upload Main Video</p>
            <p className="mt-1 text-sm text-gray-500">MP4, MOV (max. 100MB)</p>
            <p className="mt-2 text-sm font-medium text-blue-600">Recommended: 1920x1080px, 2-3 minutes</p>
          </div>
          <FormInput label="Video Title/Name" placeholder="e.g., Welcome to GoldenGate College" />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Video Participants</label>
          <ParticipantCard initials="SS" name="Samir Sharma" role="Principal" />
          <ParticipantCard initials="DK" name="Deepak Khadka" role="Admission Head" />
          <button
            type="button"
            className="w-full rounded-md border-2 border-dashed border-gray-300 py-3 text-sm text-gray-500 transition-colors hover:border-blue-400 hover:text-blue-600"
          >
            + Add More Participants
          </button>
        </div>
      </div>
    </FormCard>
  );
}

function ParticipantCard({
  initials,
  name,
  role,
}: {
  initials: string;
  name: string;
  role: string;
}) {
  return (
    <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-100 text-sm font-bold text-blue-600">
          {initials}
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>
      <input type="file" className="w-full text-xs text-gray-500 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-blue-600 hover:file:bg-blue-100" accept="video/*" />
    </div>
  );
}

export function AboutDescriptionCard({
  locked,
  onToggleLock,
}: {
  locked: boolean;
  onToggleLock: () => void;
}) {
  return (
    <FormCard
      icon={<FileText size={24} className="text-amber-600" />}
      title="About & Description"
      sub="Tell students about the college"
      locked={locked}
      onToggleLock={onToggleLock}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            College Description <span className="text-red-500">*</span>
          </label>
          <RichTextToolbar />
          <textarea
            className="input-field min-h-[160px] rounded-t-none font-sans"
            placeholder="Write a comprehensive description about the college, its programs, achievements, and what makes it unique..."
          />
          <p className="text-xs text-gray-500">Minimum 100 characters. Use the toolbar above to format your text.</p>
        </div>
      </div>
    </FormCard>
  );
}

export function VisionMissionCard({
  locked,
  onToggleLock,
}: {
  locked: boolean;
  onToggleLock: () => void;
}) {
  return (
    <FormCard
      icon={<Target size={24} className="text-indigo-600" />}
      title="Vision & Mission"
      sub="College's core values and goals"
      locked={locked}
      onToggleLock={onToggleLock}
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Vision Statement</label>
          <MiniToolbar />
          <textarea
            className="input-field min-h-[140px] rounded-t-none font-sans"
            placeholder="To become a center of excellence by imparting quality education..."
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Mission Statement</label>
          <MiniToolbar />
          <textarea
            className="input-field min-h-[140px] rounded-t-none font-sans"
            placeholder="Equipping students with the knowledge and skills necessary to excel..."
          />
        </div>
      </div>
    </FormCard>
  );
}

function RichTextToolbar() {
  const buttons = [
    { icon: "Bold" },
    { icon: "Italic" },
    { icon: "Underline" },
    { type: "divider" },
    { icon: "List" },
    { icon: "ListOrdered" },
    { type: "divider" },
    { icon: "Link" },
    { type: "divider" },
    { icon: "Undo" },
    { icon: "Redo" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-t-md border border-gray-200 bg-gray-50 px-3 py-2">
      {buttons.map((btn, i) =>
        btn.type === "divider" ? (
          <div key={i} className="mx-1 h-5 w-px bg-gray-300" />
        ) : (
          <button
            key={i}
            type="button"
            className="rounded-md p-2 text-gray-600 transition-colors hover:bg-white hover:text-blue-600"
            title={btn.icon}
          >
            <RichTextIcon name={btn.icon!} />
          </button>
        ),
      )}
    </div>
  );
}

function MiniToolbar() {
  return (
    <div className="flex flex-wrap items-center gap-1 rounded-t-md border border-gray-200 bg-gray-50 px-3 py-2">
      <button type="button" className="rounded-md p-2 text-gray-600 transition-colors hover:bg-white hover:text-blue-600" title="Bold">
        <RichTextIcon name="Bold" />
      </button>
      <button type="button" className="rounded-md p-2 text-gray-600 transition-colors hover:bg-white hover:text-blue-600" title="Italic">
        <RichTextIcon name="Italic" />
      </button>
      <div className="mx-1 h-5 w-px bg-gray-300" />
      <button type="button" className="rounded-md p-2 text-gray-600 transition-colors hover:bg-white hover:text-blue-600" title="List">
        <RichTextIcon name="List" />
      </button>
    </div>
  );
}

function RichTextIcon({ name }: { name: string }) {
  const size = name === "Bold" || name === "Italic" || name === "Underline" ? 16 : 15;
  switch (name) {
    case "Bold":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" /><path d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
        </svg>
      );
    case "Italic":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 4h-9" /><path d="M14 20H5" /><path d="M15 4L9 20" />
        </svg>
      );
    case "Underline":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 4v7a6 6 0 006 6 6 6 0 006-6V4" /><path d="M4 20h16" />
        </svg>
      );
    case "List":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 6h13" /><path d="M8 12h13" /><path d="M8 18h13" /><path d="M3 6h.01" /><path d="M3 12h.01" /><path d="M3 18h.01" />
        </svg>
      );
    case "ListOrdered":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 6h11" /><path d="M10 12h11" /><path d="M10 18h11" /><path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1.5 1-2 2-2s1-.5 1-1c0-.5-.5-1-1-1H4" />
        </svg>
      );
    case "Link":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
        </svg>
      );
    case "Undo":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7v6h6" /><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" />
        </svg>
      );
    case "Redo":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 7v6h-6" /><path d="M3 17a9 9 0 019-9 9 9 0 016 2.3L21 13" />
        </svg>
      );
    default:
      return null;
  }
}
