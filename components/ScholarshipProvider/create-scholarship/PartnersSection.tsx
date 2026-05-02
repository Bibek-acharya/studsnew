"use client";

import React from "react";
import { Plus, Trash } from "@phosphor-icons/react";

interface PartnerOrganization {
  name: string;
  website: string;
}

interface PartnerGroup {
  heading: string;
  partners: PartnerOrganization[];
}

interface PartnersSectionProps {
  partnerGroups: PartnerGroup[];
  setPartnerGroups: React.Dispatch<React.SetStateAction<PartnerGroup[]>>;
}

const formInputClass = "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500";

export const PartnersSection: React.FC<PartnersSectionProps> = ({ partnerGroups, setPartnerGroups }) => {
  const addPartnerGroup = () => {
    setPartnerGroups([...partnerGroups, { heading: "", partners: [] }]);
  };

  const removePartnerGroup = (index: number) => {
    setPartnerGroups(partnerGroups.filter((_, i) => i !== index));
  };

  const updatePartnerGroup = (index: number, field: keyof PartnerGroup, value: string | PartnerOrganization[]) => {
    setPartnerGroups(partnerGroups.map((g, i) => i === index ? { ...g, [field]: value } : g));
  };

  const addPartner = (groupIndex: number) => {
    const group = partnerGroups[groupIndex];
    updatePartnerGroup(groupIndex, "partners", [...group.partners, { name: "", website: "" }]);
  };

  const removePartner = (groupIndex: number, partnerIndex: number) => {
    const group = partnerGroups[groupIndex];
    const newPartners = group.partners.filter((_, i) => i !== partnerIndex);
    updatePartnerGroup(groupIndex, "partners", newPartners);
  };

  const updatePartner = (groupIndex: number, partnerIndex: number, field: keyof PartnerOrganization, value: string) => {
    const group = partnerGroups[groupIndex];
    const newPartners = group.partners.map((p, i) => i === partnerIndex ? { ...p, [field]: value } : p);
    updatePartnerGroup(groupIndex, "partners", newPartners);
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
          onClick={addPartnerGroup}
        >
          <Plus size={16} /> Add Partner
        </button>
      </div>
      <div className="p-6 space-y-6">
        {partnerGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <input
                className={`${formInputClass} text-sm flex-grow mr-3`}
                placeholder="Group Heading (e.g., Lead Organizers)"
                value={group.heading}
                onChange={(e) => updatePartnerGroup(groupIndex, "heading", e.target.value)}
              />
              <button
                type="button"
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                onClick={() => removePartnerGroup(groupIndex)}
              >
                <Trash size={14} />
              </button>
            </div>
            <div className="space-y-2">
              {group.partners.map((partner, partnerIndex) => (
                <div key={partnerIndex} className="flex items-center gap-3">
                  <input
                    className={`${formInputClass} text-sm flex-grow`}
                    placeholder="Organization Name"
                    value={partner.name}
                    onChange={(e) => updatePartner(groupIndex, partnerIndex, "name", e.target.value)}
                  />
                  <input
                    className={`${formInputClass} text-sm flex-grow`}
                    placeholder="Website URL"
                    value={partner.website}
                    onChange={(e) => updatePartner(groupIndex, partnerIndex, "website", e.target.value)}
                  />
                  <button
                    type="button"
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    onClick={() => removePartner(groupIndex, partnerIndex)}
                  >
                    <Trash size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
                onClick={() => addPartner(groupIndex)}
              >
                <Plus size={14} /> Add Partner
              </button>
            </div>
          </div>
        ))}
        {partnerGroups.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">No partner groups added yet.</p>
        )}
      </div>
    </div>
  );
};

export default PartnersSection;