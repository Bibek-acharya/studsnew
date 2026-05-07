"use client";

import React, { useState } from "react";
import { Plus, Trash } from "@phosphor-icons/react";
import { scholarshipProviderApi } from "@/services/scholarshipProviderApi";
import FileUpload from "../common/FileUpload";

export interface PartnerEntry {
  name: string;
  website: string;
  logo: string;
}

export interface PartnerGroup {
  groupHeading: string;
  partners: PartnerEntry[];
}

interface PartnersSectionProps {
  partnerGroups: PartnerGroup[];
  setPartnerGroups: React.Dispatch<React.SetStateAction<PartnerGroup[]>>;
}

const formInputClass = "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500";

export const PartnersSection: React.FC<PartnersSectionProps> = ({ partnerGroups, setPartnerGroups }) => {
  const [uploadingInfo, setUploadingInfo] = useState<{ groupIndex: number; partnerIndex: number } | null>(null);

  const addGroup = () => {
    setPartnerGroups([...partnerGroups, { groupHeading: "", partners: [] }]);
  };

  const removeGroup = (groupIndex: number) => {
    setPartnerGroups(partnerGroups.filter((_, i) => i !== groupIndex));
  };

  const updateGroupHeading = (groupIndex: number, value: string) => {
    setPartnerGroups(partnerGroups.map((g, i) => i === groupIndex ? { ...g, groupHeading: value } : g));
  };

  const addPartner = (groupIndex: number) => {
    setPartnerGroups(partnerGroups.map((g, i) =>
      i === groupIndex && g.partners.length < 6
        ? { ...g, partners: [...g.partners, { name: "", website: "", logo: "" }] }
        : g
    ));
  };

  const removePartner = (groupIndex: number, partnerIndex: number) => {
    setPartnerGroups(partnerGroups.map((g, i) =>
      i === groupIndex ? { ...g, partners: g.partners.filter((_, pi) => pi !== partnerIndex) } : g
    ));
  };

  const updatePartner = (groupIndex: number, partnerIndex: number, field: keyof PartnerEntry, value: string) => {
    setPartnerGroups(partnerGroups.map((g, i) =>
      i === groupIndex
        ? { ...g, partners: g.partners.map((p, pi) => pi === partnerIndex ? { ...p, [field]: value } : p) }
        : g
    ));
  };

  const handleLogoUpload = async (groupIndex: number, partnerIndex: number, file: File) => {
    setUploadingInfo({ groupIndex, partnerIndex });
    try {
      const url = await scholarshipProviderApi.uploadImage(file, "partners");
      setPartnerGroups(partnerGroups.map((g, i) =>
        i === groupIndex
          ? { ...g, partners: g.partners.map((p, pi) => pi === partnerIndex ? { ...p, logo: url } : p) }
          : g
      ));
    } catch (error) {
      console.error("Failed to upload logo:", error);
    } finally {
      setUploadingInfo(null);
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
          onClick={addGroup}
        >
          <Plus size={16} /> Add Partner Group
        </button>
      </div>

      <div className="p-6 space-y-8">
        {partnerGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="border border-gray-200 rounded-2xl p-5">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Group Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-sm"
                  placeholder="e.g. Academic Partners"
                  value={group.groupHeading}
                  onChange={(e) => updateGroupHeading(groupIndex, e.target.value)}
                />
              </div>
              <button
                type="button"
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg shrink-0 mt-5"
                onClick={() => removeGroup(groupIndex)}
              >
                <Trash size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {group.partners.map((partner, partnerIndex) => (
                <div key={partnerIndex} className="border border-gray-200 rounded-2xl p-4 bg-white relative">
                  <button
                    type="button"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center"
                    onClick={() => removePartner(groupIndex, partnerIndex)}
                  >
                    <Trash size={14} />
                  </button>

                  {uploadingInfo?.groupIndex === groupIndex && uploadingInfo?.partnerIndex === partnerIndex ? (
                    <p className="text-sm text-blue-600 py-8 text-center">Uploading...</p>
                  ) : (
                    <FileUpload
                      label=""
                      uploadedText="Logo uploaded"
                      accept="image/*"
                      maxSize="2MB"
                      previewUrl={partner.logo}
                      previewClassName="w-full h-44 object-cover rounded-2xl"
                      onFileSelect={(file) => handleLogoUpload(groupIndex, partnerIndex, file)}
                      onClearPreview={() => updatePartner(groupIndex, partnerIndex, "logo", "")}
                    />
                  )}

                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1.5">
                        Organization Name
                      </label>
                      <input
                        type="text"
                        className={formInputClass}
                        placeholder="Enter organization name"
                        value={partner.name}
                        onChange={(e) => updatePartner(groupIndex, partnerIndex, "name", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1.5">
                        Website URL
                      </label>
                      <input
                        type="text"
                        className={formInputClass}
                        placeholder="https://example.com"
                        value={partner.website}
                        onChange={(e) => updatePartner(groupIndex, partnerIndex, "website", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {group.partners.length < 6 && (
                <button
                  type="button"
                  className="border-2 border-dashed border-gray-300 rounded-2xl min-h-[360px] flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50/40 transition"
                  onClick={() => addPartner(groupIndex)}
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 text-3xl mb-4">
                    +
                  </div>
                  <p className="font-semibold text-gray-800">Add Organization</p>
                  <p className="text-sm text-gray-400 mt-1">Maximum 6 cards per group</p>
                </button>
              )}
            </div>

            <div className="mt-5 text-xs text-gray-400">
              Max 3 cards per row • Max 6 organizations per group
            </div>
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
