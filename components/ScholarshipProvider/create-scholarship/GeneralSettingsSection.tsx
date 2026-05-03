"use client";

import React from "react";
import { format, addDays } from "date-fns";
import FileUpload from "../common/FileUpload";
import DatePicker from "../common/DatePicker";
import Dropdown from "@/components/college-recommender/Dropdown";
import { NEPAL_DISTRICTS } from "@/lib/location-data";

interface GeneralSettingsSectionProps {
  mainTitle: string;
  setMainTitle: (v: string) => void;
  providerName: string;
  setProviderName: (v: string) => void;
  fundingType: string;
  setFundingType: (v: string) => void;
  fundingTypeOther: string;
  setFundingTypeOther: (v: string) => void;
  scholarshipType: string;
  setScholarshipType: (v: string) => void;
  scholarshipTypeOther: string;
  setScholarshipTypeOther: (v: string) => void;
  educationLevel: string;
  setEducationLevel: (v: string) => void;
  educationLevelOther: string;
  setEducationLevelOther: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  startDate: string;
  setStartDate: (v: string) => void;
  endDate: string;
  setEndDate: (v: string) => void;
  startDateError?: string;
  endDateError?: string;
  applyLink: string;
  setApplyLink: (v: string) => void;
  bannerBgUrl: string;
  bannerBgPreview: string;
  onBannerSelect: (file: File) => void;
  mainTitleError?: string;
  providerNameError?: string;
  fundingTypeError?: string;
  scholarshipTypeError?: string;
  educationLevelError?: string;
  locationError?: string;
  bannerError?: string;
}

const FUNDING_TYPES = [
  { value: "Full Funded", label: "Full Funded (tuition + hostel + food)" },
  { value: "Partial Funded", label: "Partial Funded (only tuition or % discount)" },
  { value: "Tuition Fee Waiver", label: "Tuition Fee Waiver" },
  { value: "Monthly Stipend", label: "Monthly Stipend" },
  { value: "One-Time Grant", label: "One-Time Grant" },
  { value: "Loan-Based Support", label: "Loan-Based Support" },
  { value: "Other", label: "Other (Specify / Special)" },
];

const SCHOLARSHIP_TYPES = [
  { value: "Merit-Based", label: "Merit-Based (high GPA students)" },
  { value: "Need-Based", label: "Need-Based (low-income students)" },
  { value: "Sports Scholarship", label: "Sports Scholarship" },
  { value: "Women Scholarship", label: "Women Scholarship" },
  { value: "Dalit / Inclusive", label: "Dalit / Inclusive Scholarship" },
  { value: "Government Scholarship", label: "Government Scholarship" },
  { value: "College-Specific", label: "College-Specific Scholarship" },
  { value: "Other", label: "Other (specify/special)" },
];

const EDUCATION_LEVELS = [
  { value: "+2", label: "+2" },
  { value: "Diploma", label: "Diploma" },
  { value: "Bachelor's Degree", label: "Bachelor's Degree" },
  { value: "Master's Degree", label: "Master's Degree" },
  { value: "MPhil / PhD", label: "MPhil / PhD" },
  { value: "Vocational / Skill Training", label: "Vocational / Skill Training" },
  { value: "Language Courses", label: "Language Courses (e.g., IELTS prep)" },
  { value: "Short Courses / Certification", label: "Short Courses / Certification" },
  { value: "Other", label: "Other / Special" },
];

const formInputClass = "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500";

export const GeneralSettingsSection: React.FC<GeneralSettingsSectionProps> = ({
  mainTitle, setMainTitle,
  providerName, setProviderName,
  fundingType, setFundingType,
  fundingTypeOther, setFundingTypeOther,
  scholarshipType, setScholarshipType,
  scholarshipTypeOther, setScholarshipTypeOther,
  educationLevel, setEducationLevel,
  educationLevelOther, setEducationLevelOther,
  location, setLocation,
  startDate, setStartDate,
  endDate, setEndDate,
  startDateError,
  endDateError,
  applyLink, setApplyLink,
  bannerBgUrl,
  bannerBgPreview,
  onBannerSelect,
  mainTitleError,
  providerNameError,
  fundingTypeError,
  scholarshipTypeError,
  educationLevelError,
  locationError,
  bannerError,
}) => {
  const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [filteredDistricts, setFilteredDistricts] = React.useState<string[]>([]);
  const suggestionRef = React.useRef<HTMLDivElement>(null);

  const ALL_DISTRICTS = React.useMemo(() => {
    return Array.from(new Set(Object.values(NEPAL_DISTRICTS).flat())).sort();
  }, []);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocationChange = (val: string) => {
    setLocation(val);
    if (val.trim().length > 0) {
      const filtered = ALL_DISTRICTS.filter(d => 
        d.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 8);
      setFilteredDistricts(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
      <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4 flex items-center gap-3">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Page Header & Hero Section</h2>
          <p className="text-sm text-gray-500 mt-0.5">Settings for the main banner and title</p>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">
            Main Title (Scholarship Name) <span className="text-red-500">*</span>
          </label>
          <input
            id="mainTitle"
            type="text"
            className={`${formInputClass} ${mainTitleError ? "border-red-500 bg-red-50/10" : ""}`}
            placeholder="Enter Scholarship Name"
            value={mainTitle}
            onChange={(e) => setMainTitle(e.target.value)}
          />
          {mainTitleError && <p className="text-red-500 text-xs mt-1">{mainTitleError}</p>}
          <p className="text-xs text-gray-500">This appears at the top of the page</p>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">
            Scholarship Provider Name <span className="text-red-500">*</span>
          </label>
          <input
            id="providerName"
            type="text"
            className={`${formInputClass} ${providerNameError ? "border-red-500 bg-red-50/10" : ""}`}
            placeholder="Enter Scholarship Provider Name"
            value={providerName}
            onChange={(e) => setProviderName(e.target.value)}
          />
          {providerNameError && <p className="text-red-500 text-xs mt-1">{providerNameError}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Funding Type <span className="text-red-500">*</span>
            </label>
            <Dropdown
              id="fundingType"
              value={fundingType}
              onChange={setFundingType}
              options={FUNDING_TYPES}
              placeholder="Select Funding Type"
              error={fundingTypeError}
            />
            {fundingType === "Other" && (
              <input
                type="text"
                className={`${formInputClass} mt-2 ${fundingTypeError ? "border-red-500 bg-red-50/10" : ""}`}
                placeholder="Specify other funding type"
                value={fundingTypeOther}
                onChange={(e) => setFundingTypeOther(e.target.value)}
              />
            )}
            {fundingTypeError && <p className="text-red-500 text-xs mt-1">{fundingTypeError}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Scholarship Type <span className="text-red-500">*</span>
            </label>
            <Dropdown
              id="scholarshipType"
              value={scholarshipType}
              onChange={setScholarshipType}
              options={SCHOLARSHIP_TYPES}
              placeholder="Select Scholarship Type"
              error={scholarshipTypeError}
            />
            {scholarshipType === "Other" && (
              <input
                type="text"
                className={`${formInputClass} mt-2 ${scholarshipTypeError ? "border-red-500 bg-red-50/10" : ""}`}
                placeholder="Specify other scholarship type"
                value={scholarshipTypeOther}
                onChange={(e) => setScholarshipTypeOther(e.target.value)}
              />
            )}
            {scholarshipTypeError && <p className="text-red-500 text-xs mt-1">{scholarshipTypeError}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Education Level <span className="text-red-500">*</span>
            </label>
            <Dropdown
              id="educationLevel"
              value={educationLevel}
              onChange={setEducationLevel}
              options={EDUCATION_LEVELS}
              placeholder="Select Level"
              error={educationLevelError}
            />
            {educationLevel === "Other" && (
              <input
                type="text"
                className={`${formInputClass} mt-2 ${educationLevelError ? "border-red-500 bg-red-50/10" : ""}`}
                placeholder="Specify other education level"
                value={educationLevelOther}
                onChange={(e) => setEducationLevelOther(e.target.value)}
              />
            )}
            {educationLevelError && <p className="text-red-500 text-xs mt-1">{educationLevelError}</p>}
          </div>

          <div className="space-y-1.5 relative" ref={suggestionRef}>
            <label className="block text-sm font-medium text-gray-700">
              Location <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="location"
                type="text"
                className={`${formInputClass} ${locationError ? "border-red-500 bg-red-50/10" : ""}`}
                placeholder="Search district (e.g. Kathmandu)"
                value={location}
                onChange={(e) => handleLocationChange(e.target.value)}
                onFocus={() => {
                  if (location.trim().length > 0) setShowSuggestions(filteredDistricts.length > 0);
                }}
                autoComplete="off"
              />
              {showSuggestions && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in duration-100">
                  {filteredDistricts.map((d) => (
                    <button
                      key={d}
                      type="button"
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-2"
                      onClick={() => {
                        setLocation(d);
                        setShowSuggestions(false);
                      }}
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {locationError && <p className="text-red-500 text-xs mt-1">{locationError}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Starting Date <span className="text-red-500">*</span>
            </label>
            <DatePicker
              id="startDate"
              value={startDate}
              onChange={setStartDate}
              placeholder="Select start date"
              required
              minDate={tomorrow}
              error={startDateError}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Ending Date <span className="text-red-500">*</span>
            </label>
            <DatePicker
              id="endDate"
              value={endDate}
              onChange={setEndDate}
              placeholder="Select end date"
              required
              minDate={startDate || undefined}
              error={endDateError}
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Apply Form Link
            </label>
            <input
              id="applyLink"
              type="url"
              className={formInputClass}
              placeholder="https://forms.gle/... or website link"
              value={applyLink}
              onChange={(e) => setApplyLink(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">
            Hero Banner Image <span className="text-red-500">*</span>
          </label>
          <FileUpload
            accept="image/*"
            maxSize="5MB"
            recommendedSize="1920x600"
            onFileSelect={onBannerSelect}
            previewUrl={bannerBgPreview}
          />
          {bannerError && <p className="text-red-500 text-xs mt-1">{bannerError}</p>}
        </div>
      </div>
    </div>
  );
};

export default GeneralSettingsSection;