"use client";

import React from "react";
import { Newspaper, Download } from "lucide-react";
import { FormCard } from "./FormCard";
import { FormInput } from "./FormInput";
import { NEWS_CATEGORIES, DOCUMENT_TYPES } from "@/lib/superadmin/constants";

export function NewsNoticeCard({
  locked,
  onToggleLock,
}: {
  locked: boolean;
  onToggleLock: () => void;
}) {
  return (
    <FormCard
      icon={<Newspaper size={24} className="text-cyan-600" />}
      title="News & Notice"
      sub="Latest updates and announcements"
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
          Add News
        </button>
      }
    >
      <div className="rounded-md bg-gray-50 p-6">
        <h4 className="mb-4 text-sm font-bold text-gray-700">Add News/Notice</h4>
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput
            label="Title"
            placeholder="e.g., MBA Admission Open 2025"
          />
          <FormInput label="Category" type="select" options={NEWS_CATEGORIES} />
        </div>
        <div className="mb-4">
          <FormInput
            label="Description"
            type="textarea"
            rows={3}
            placeholder="Brief description of the news or notice..."
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput label="Published Date" type="date" />
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">News Image</label>
            <div className="cursor-pointer rounded-md border-2 border-dashed border-gray-300 p-4 text-center transition-all hover:border-blue-400 hover:bg-blue-50/50">
              <svg className="mx-auto mb-1 h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
              <p className="text-xs text-gray-600">Click to upload</p>
              <input type="file" className="hidden" accept="image/*" />
            </div>
          </div>
        </div>
      </div>
    </FormCard>
  );
}

export function DownloadsCard({
  locked,
  onToggleLock,
}: {
  locked: boolean;
  onToggleLock: () => void;
}) {
  const documents = [
    { initials: "PR", title: "Prospectus 2025", meta: "PDF • 8.2 MB • Uploaded on Apr 20, 2026", bg: "bg-blue-100 text-blue-600" },
    { initials: "AF", title: "Application Form", meta: "PDF • 2.1 MB • Uploaded on Apr 18, 2026", bg: "bg-green-100 text-green-600" },
  ];

  return (
    <FormCard
      icon={<Download size={24} className="text-emerald-600" />}
      title="Downloads"
      sub="Brochures, forms, and documents"
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
          Add Document
        </button>
      }
    >
      <div className="space-y-6">
        <div className="rounded-md bg-gray-50 p-6">
          <h4 className="mb-4 text-sm font-bold text-gray-700">Upload New Document</h4>
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormInput label="Document Title" placeholder="e.g., Prospectus 2025" />
            <FormInput label="Document Type" type="select" options={DOCUMENT_TYPES} />
          </div>
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">Upload File (PDF)</label>
            <div className="cursor-pointer rounded-md border-2 border-dashed border-gray-300 p-8 text-center transition-all hover:border-blue-400 hover:bg-blue-50/50">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-md bg-gray-100">
                <svg className="h-7 w-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-700">Click to upload PDF</p>
              <p className="mt-1 text-xs text-gray-500">Max. 10MB</p>
              <input type="file" className="hidden" accept=".pdf" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-bold text-gray-700">Uploaded Documents ({documents.length})</h4>
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.title}
                className="flex items-center justify-between rounded-md border border-gray-200 p-4 transition-colors hover:border-blue-300"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-md text-sm font-bold ${doc.bg}`}
                  >
                    {doc.initials}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{doc.title}</p>
                    <p className="text-sm text-gray-500">{doc.meta}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-md p-2 text-blue-600 transition-colors hover:bg-blue-50"
                    title="Download"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><path d="M12 15V3" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="rounded-md p-2 text-red-600 transition-colors hover:bg-red-50"
                    title="Delete"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FormCard>
  );
}
