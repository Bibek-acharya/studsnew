"use client";

import React, { useState } from "react";
import { Plus, Trash } from "@phosphor-icons/react";
import { scholarshipProviderApi } from "@/services/scholarshipProviderApi";
import FileUpload from "../common/FileUpload";

export interface DownloadItem {
  title: string;
  description: string;
  url: string;
  file?: File;
}

interface DownloadsSectionProps {
  downloads: DownloadItem[];
  setDownloads: React.Dispatch<React.SetStateAction<DownloadItem[]>>;
}

const formInputClass = "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500";

export const DownloadsSection: React.FC<DownloadsSectionProps> = ({ downloads, setDownloads }) => {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const addDownload = () => {
    setDownloads([...downloads, { title: "", description: "", url: "" }]);
  };

  const removeDownload = (index: number) => {
    setDownloads(downloads.filter((_, i) => i !== index));
  };

  const updateDownload = (index: number, field: keyof DownloadItem, value: string) => {
    setDownloads(downloads.map((d, i) => i === index ? { ...d, [field]: value } : d));
  };

  const handleFileSelect = async (index: number, file: File) => {
    setUploadingIndex(index);
    try {
      const url = await scholarshipProviderApi.uploadDocument(file, "downloads");
      setDownloads(downloads.map((d, i) => i === index ? { ...d, url, file } : d));
    } catch (error) {
      console.error("Failed to upload file:", error);
    } finally {
      setUploadingIndex(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
      <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Downloadable Documents</h2>
            <p className="text-sm text-gray-500 mt-0.5">Brochures, forms, and documents users can download</p>
          </div>
        </div>
        <button
          type="button"
          className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
          onClick={addDownload}
        >
          <Plus size={16} /> Add File
        </button>
      </div>
      <div className="p-6 space-y-4">
        {downloads.map((d, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50 flex items-start gap-3">
            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  className={`${formInputClass} text-sm`}
                  placeholder="Scholarship Information Brochure"
                  value={d.title}
                  onChange={(e) => updateDownload(index, "title", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <input
                  className={`${formInputClass} text-sm`}
                  placeholder="Complete guide about the scholarship"
                  value={d.description}
                  onChange={(e) => updateDownload(index, "description", e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">File</label>
                {uploadingIndex === index ? (
                  <p className="text-sm text-blue-600 py-2">Uploading...</p>
                ) : (
                  <FileUpload
                    label=""
                    accept=".pdf,.doc,.docx"
                    maxSize="10MB"
                    previewUrl={d.url}
                    onFileSelect={(file) => handleFileSelect(index, file)}
                    onClearPreview={() => updateDownload(index, "url", "")}
                  />
                )}
              </div>
            </div>
            <button
              type="button"
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-6"
              onClick={() => removeDownload(index)}
            >
              <Trash size={18} />
            </button>
          </div>
        ))}
        {downloads.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">No downloads added yet.</p>
        )}
      </div>
    </div>
  );
};

export default DownloadsSection;