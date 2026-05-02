"use client";

import React from "react";
import FileUpload from "../common/FileUpload";

interface ContactDetailsSectionProps {
  coverageArea: string;
  setCoverageArea: (v: string) => void;
  contactEmail: string;
  setContactEmail: (v: string) => void;
  primaryPhone: string;
  setPrimaryPhone: (v: string) => void;
  secondaryPhone: string;
  setSecondaryPhone: (v: string) => void;
  websiteUrl: string;
  setWebsiteUrl: (v: string) => void;
  officeAddress: string;
  setOfficeAddress: (v: string) => void;
  mapUrl: string;
  mapPreview: string;
  onMapSelect: (file: File) => void;
}

const formInputClass = "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500";

export const ContactDetailsSection: React.FC<ContactDetailsSectionProps> = ({
  coverageArea, setCoverageArea,
  contactEmail, setContactEmail,
  primaryPhone, setPrimaryPhone,
  secondaryPhone, setSecondaryPhone,
  websiteUrl, setWebsiteUrl,
  officeAddress, setOfficeAddress,
  mapUrl, mapPreview, onMapSelect,
}) => {
  const handlePhoneInput = (value: string, setter: (v: string) => void) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setter(numericValue);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
      <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4 flex items-center gap-3">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Contact Details</h2>
          <p className="text-sm text-gray-500 mt-0.5">Shown in the sidebar for inquiries</p>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Program Coverage Area <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={formInputClass}
              placeholder="Which areas does this scholarship cover?"
              value={coverageArea}
              onChange={(e) => setCoverageArea(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Contact Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className={formInputClass}
              placeholder="Email for support inquiries"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Primary Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={formInputClass}
              placeholder="Main contact number"
              value={primaryPhone}
              onChange={(e) => handlePhoneInput(e.target.value, setPrimaryPhone)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Secondary Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={formInputClass}
              placeholder="Alternative contact number"
              value={secondaryPhone}
              onChange={(e) => handlePhoneInput(e.target.value, setSecondaryPhone)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Official Website URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={formInputClass}
              placeholder="https://"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Office Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={formInputClass}
              placeholder="Physical location"
              value={officeAddress}
              onChange={(e) => setOfficeAddress(e.target.value)}
            />
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Upload Map <span className="text-red-500">*</span>
            </label>
            <FileUpload
              accept="image/*"
              maxSize="2MB"
              onFileSelect={onMapSelect}
              previewUrl={mapPreview}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetailsSection;