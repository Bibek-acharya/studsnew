"use client";

import React from "react";

interface ContactDetailsSectionProps {
  coverageArea: string;
  setCoverageArea: (v: string) => void;
  contactEmail: string;
  setContactEmail: (v: string) => void;
  contactEmailError?: string;
  setContactEmailError?: (v: string) => void;
  primaryPhone: string;
  setPrimaryPhone: (v: string) => void;
  primaryPhoneError?: string;
  setPrimaryPhoneError?: (v: string) => void;
  secondaryPhone: string;
  setSecondaryPhone: (v: string) => void;
  secondaryPhoneError?: string;
  setSecondaryPhoneError?: (v: string) => void;
  websiteUrl: string;
  setWebsiteUrl: (v: string) => void;
  websiteUrlError?: string;
  setWebsiteUrlError?: (v: string) => void;
  officeAddress: string;
  setOfficeAddress: (v: string) => void;
  coverageAreaError?: string;
  officeAddressError?: string;
  mapUrl: string;
  setMapUrl: (v: string) => void;
  mapUrlError?: string;
  setMapUrlError?: (v: string) => void;
}

const formInputClass = "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500";

const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    new URL(url);
    return url.startsWith('http://') || url.startsWith('https://');
  } catch {
    return false;
  }
};

const isValidPhone = (phone: string): boolean => {
  return /^9\d{9}$/.test(phone);
};

export const ContactDetailsSection: React.FC<ContactDetailsSectionProps> = ({
  coverageArea, setCoverageArea,
  contactEmail, setContactEmail, contactEmailError, setContactEmailError,
  primaryPhone, setPrimaryPhone, primaryPhoneError, setPrimaryPhoneError,
  secondaryPhone, setSecondaryPhone, secondaryPhoneError, setSecondaryPhoneError,
  websiteUrl, setWebsiteUrl, websiteUrlError, setWebsiteUrlError,
  officeAddress, setOfficeAddress,
  coverageAreaError, officeAddressError,
  mapUrl, setMapUrl, mapUrlError, setMapUrlError,
}) => {
  const handlePhoneInput = (value: string, setter: (v: string) => void, setError?: (v: string) => void) => {
    const numericValue = value.replace(/[^0-9]/g, "").slice(0, 10);
    setter(numericValue);
    if (numericValue.length > 0 && !/^9\d{9}$/.test(numericValue)) {
      setError?.("Must be exactly 10 digits and start with 9");
    } else {
      setError?.("");
    }
  };

  const handleUrlChange = (value: string, setter: (v: string) => void, setError?: (v: string) => void) => {
    setter(value);
    if (value && !isValidUrl(value)) {
      setError?.("Must be a valid URL starting with http:// or https://");
    } else {
      setError?.("");
    }
  };

  const handleEmailChange = (value: string, setter: (v: string) => void, setError?: (v: string) => void) => {
    setter(value);
    if (value && !isValidEmail(value)) {
      setError?.("Invalid email format");
    } else {
      setError?.("");
    }
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
              id="coverageArea"
              type="text"
              className={`${formInputClass} ${coverageAreaError ? 'border-red-500 bg-red-50/10' : ''}`}
              placeholder="Which areas does this scholarship cover?"
              value={coverageArea}
              onChange={(e) => setCoverageArea(e.target.value)}
            />
            {coverageAreaError && <p className="text-xs text-red-500 mt-1">{coverageAreaError}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Contact Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="contactEmail"
              type="email"
              className={`${formInputClass} ${contactEmailError ? 'border-red-500 bg-red-50/10' : ''}`}
              placeholder="contact@example.com"
              value={contactEmail}
              onChange={(e) => handleEmailChange(e.target.value, setContactEmail, setContactEmailError)}
            />
            {contactEmailError && <p className="text-xs text-red-500 mt-1">{contactEmailError}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Primary Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="primaryPhone"
              type="text"
              className={`${formInputClass} ${primaryPhoneError ? 'border-red-500 bg-red-50/10' : ''}`}
              placeholder="98XXXXXXXX"
              value={primaryPhone}
              onChange={(e) => handlePhoneInput(e.target.value, setPrimaryPhone, setPrimaryPhoneError)}
            />
            {primaryPhoneError && <p className="text-xs text-red-500 mt-1">{primaryPhoneError}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Secondary Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="secondaryPhone"
              type="text"
              className={`${formInputClass} ${secondaryPhoneError ? 'border-red-500 bg-red-50/10' : ''}`}
              placeholder="98XXXXXXXX"
              value={secondaryPhone}
              onChange={(e) => handlePhoneInput(e.target.value, setSecondaryPhone, setSecondaryPhoneError)}
            />
            {secondaryPhoneError && <p className="text-xs text-red-500 mt-1">{secondaryPhoneError}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Official Website URL <span className="text-red-500">*</span>
            </label>
            <input
              id="websiteUrl"
              type="text"
              className={`${formInputClass} ${websiteUrlError ? 'border-red-500 bg-red-50/10' : ''}`}
              placeholder="https://example.com"
              value={websiteUrl}
              onChange={(e) => handleUrlChange(e.target.value, setWebsiteUrl, setWebsiteUrlError)}
            />
            {websiteUrlError && <p className="text-xs text-red-500 mt-1">{websiteUrlError}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Office Address <span className="text-red-500">*</span>
            </label>
            <input
              id="officeAddress"
              type="text"
              className={`${formInputClass} ${officeAddressError ? 'border-red-500 bg-red-50/10' : ''}`}
              placeholder="Physical location"
              value={officeAddress}
              onChange={(e) => setOfficeAddress(e.target.value)}
            />
            {officeAddressError && <p className="text-xs text-red-500 mt-1">{officeAddressError}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Map Embed URL <span className="text-red-500">*</span>
            </label>
            <input
              id="mapUrl"
              type="text"
              className={`${formInputClass} ${mapUrlError ? 'border-red-500 bg-red-50/10' : ''}`}
              placeholder="https://www.google.com/maps/embed?pb..."
              value={mapUrl}
              onChange={(e) => handleUrlChange(e.target.value, setMapUrl, setMapUrlError)}
            />
            {mapUrlError && <p className="text-xs text-red-500 mt-1">{mapUrlError}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetailsSection;