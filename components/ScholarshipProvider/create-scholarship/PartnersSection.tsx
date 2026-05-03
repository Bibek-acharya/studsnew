"use client";

import React, { useState } from "react";
import { Plus, Trash } from "@phosphor-icons/react";
import { scholarshipProviderApi } from "@/services/scholarshipProviderApi";
import FileUpload from "../common/FileUpload";

export interface PartnerOrganization {
  groupHeading: string;
  name: string;
  website: string;
  logo: string;
}

interface PartnersSectionProps {
  partnerGroups: PartnerOrganization[];
  setPartnerGroups: React.Dispatch<React.SetStateAction<PartnerOrganization[]>>;
}

const formInputClass = "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500";

export const PartnersSection: React.FC<PartnersSectionProps> = ({ partnerGroups, setPartnerGroups }) => {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const addPartner = () => {
    setPartnerGroups([...partnerGroups, { groupHeading: "", name: "", website: "", logo: "" }]);
  };

  const removePartner = (index: number) => {
    setPartnerGroups(partnerGroups.filter((_, i) => i !== index));
  };

  const updatePartner = (index: number, field: keyof PartnerOrganization, value: string) => {
    setPartnerGroups(partnerGroups.map((p, i) => i === index ? { ...p, [field]: value } : p));
  };

  const handleLogoUpload = async (index: number, file: File) => {
    setUploadingIndex(index);
    try {
      const url = await scholarshipProviderApi.uploadImage(file, "partners");
      setPartnerGroups(partnerGroups.map((p, i) => i === index ? { ...p, logo: url } : p));
    } catch (error) {
      console.error("Failed to upload logo:", error);
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Partner Organizations</h2>
            <p className="text-sm text-gray-500 mt-0.5">Organizations supporting this scholarship program</p>
          </div>
        </div>
        <button
          type="button"
          className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
          onClick={addPartner}
        >
          <Plus size={16} /> Add Partner
        </button>
      </div>
      <div className="p-6 space-y-6">
        {partnerGroups.map((partner, index) => (
          <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex-1 grid grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Group Heading <span className="text-red-500">*</span>
                </label>
                <input
                  className={formInputClass}
                  placeholder="e.g. Academic Partners"
                  value={partner.groupHeading ?? ""}
                  onChange={(e) => updatePartner(index, "groupHeading", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Organization Name <span className="text-red-500">*</span>
                </label>
                <input
                  className={formInputClass}
                  placeholder="Organization Name"
                  value={partner.name ?? ""}
                  onChange={(e) => updatePartner(index, "name", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Website URL <span className="text-red-500">*</span>
                </label>
                <input
                  className={formInputClass}
                  placeholder="https://"
                  value={partner.website ?? ""}
                  onChange={(e) => updatePartner(index, "website", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Organization Logo <span className="text-red-500">*</span>
                </label>
                {uploadingIndex === index ? (
                  <p className="text-sm text-blue-600 py-2">Uploading...</p>
                ) : (
                  <FileUpload
                    label=""
                    uploadedText="Logo uploaded"
                    accept="image/*"
                    maxSize="2MB"
                    previewUrl={partner.logo}
                    onFileSelect={(file) => handleLogoUpload(index, file)}
                    onClearPreview={() => updatePartner(index, "logo", "")}
                  />
                )}
              </div>
            </div>
            <button
              type="button"
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-6"
              onClick={() => removePartner(index)}
            >
              <Trash size={18} />
            </button>
          </div>
        ))}
        {partnerGroups.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">No partner organizations added yet.</p>
        )}
      </div>
    </div>
  );
};

export default PartnersSection;