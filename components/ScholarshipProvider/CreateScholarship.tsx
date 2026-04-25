"use client";

import React, { useState, useCallback, memo } from "react";
import dynamic from "next/dynamic";
import {
  PlusCircle,
  Info,
  DollarSign,
  Calendar,
  CircleCheck,
  FileText,
  Paperclip,
  ClipboardList,
  Save,
  UploadCloud,
} from "lucide-react";
import SectionCard from "./common/SectionCard";
import InputField from "./common/InputField";
import SelectField from "./common/SelectField";
import Button from "./common/Button";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link", "image"],
    ["clean"],
  ],
};

const quillFormats = [
  "header", "bold", "italic", "underline", "strike",
  "list", "align", "link", "image",
];

const SCHOLARSHIP_TYPE_OPTIONS = [
  { value: "", label: "Select Type" },
  { value: "merit", label: "Merit Based" },
  { value: "need", label: "Need Based" },
  { value: "minority", label: "Minority" },
  { value: "sports", label: "Sports" },
  { value: "research", label: "Research" },
  { value: "disability", label: "Disability Support" },
  { value: "community", label: "Community Service" },
];

const DISBURSEMENT_OPTIONS = [
  { value: "one-time", label: "One Time" },
  { value: "semester", label: "Per Semester" },
  { value: "annual", label: "Annual" },
  { value: "monthly", label: "Monthly" },
];

const COVERAGE_OPTIONS = [
  { value: "full", label: "Full Tuition" },
  { value: "partial", label: "Partial Tuition" },
  { value: "books", label: "Books Only" },
  { value: "living", label: "Living Expenses" },
  { value: "comprehensive", label: "Comprehensive" },
];

const GRADE_OPTIONS = [
  { value: "", label: "Select Grade" },
  { value: "11", label: "Grade 11" },
  { value: "12", label: "Grade 12" },
  { value: "both", label: "Both (11 & 12)" },
];

const GENDER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "male", label: "Male Only" },
  { value: "female", label: "Female Only" },
  { value: "other", label: "Other" },
];

const MARITAL_OPTIONS = [
  { value: "all", label: "No Preference" },
  { value: "single", label: "Single Only" },
  { value: "married", label: "Married" },
];

const SELECTION_CRITERIA_OPTIONS = [
  { value: "merit", label: "Merit Based" },
  { value: "interview", label: "Interview Required" },
  { value: "written", label: "Written Test" },
  { value: "combined", label: "Combined (Merit + Interview)" },
];

const PROVINCES = ["Province 1", "Madhesh", "Bagmati", "Gandaki", "Lumbini", "Karnali", "Sudurpashchim"];
const ADDITIONAL_REQUIREMENTS = [
  "Nepali Citizenship Required",
  "Must be enrolled in recognized institution",
  "Family income below threshold",
  "No other scholarship recipient",
  "Community service experience preferred",
];
const MANDATORY_DOCUMENTS = [
  "Citizenship Certificate",
  "SEE Mark Sheet",
  "Grade 11/12 Transcript",
  "Character Certificate",
  "Recommendation Letter",
  "Income Statement",
];
const DEFAULT_CHECKED_DOCS = ["Citizenship Certificate", "SEE Mark Sheet", "Grade 11/12 Transcript"];

interface CreateScholarshipProps {
  scholarshipId?: number | null;
  onNavigate?: (section: string) => void;
}

const CreateScholarship: React.FC<CreateScholarshipProps> = memo(({ scholarshipId, onNavigate }) => {
  const [scholarshipName, setScholarshipName] = useState("");
  const [scholarshipCode, setScholarshipCode] = useState("");
  const [scholarshipType, setScholarshipType] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [amountPerStudent, setAmountPerStudent] = useState("");
  const [disbursementType, setDisbursementType] = useState("one-time");
  const [coverage, setCoverage] = useState("full");
  const [appStartDate, setAppStartDate] = useState("");
  const [appEndDate, setAppEndDate] = useState("");
  const [resultDate, setResultDate] = useState("");
  const [eligibleGrades, setEligibleGrades] = useState("");
  const [minGpa, setMinGpa] = useState("");
  const [streams, setStreams] = useState<string[]>([]);
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [gender, setGender] = useState("all");
  const [maritalStatus, setMaritalStatus] = useState("all");
  const [provinces, setProvinces] = useState<string[]>(["1", "2", "3", "4", "5"]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [notes, setNotes] = useState("");
  const [selectionCriteria, setSelectionCriteria] = useState("merit");
  const [interviewRounds, setInterviewRounds] = useState("1");
  const [interviewLocation, setInterviewLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const totalBudget = totalSeats && amountPerStudent
    ? (parseInt(totalSeats) * parseInt(amountPerStudent)).toLocaleString()
    : "";

  const toggleStream = useCallback((stream: string) => {
    setStreams((prev) => prev.includes(stream) ? prev.filter((s) => s !== stream) : [...prev, stream]);
  }, []);

  const toggleProvince = useCallback((province: string) => {
    setProvinces((prev) => prev.includes(province) ? prev.filter((p) => p !== province) : [...prev, province]);
  }, []);

  const toggleRequirement = useCallback((req: string) => {
    setRequirements((prev) => prev.includes(req) ? prev.filter((r) => r !== req) : [...prev, req]);
  }, []);

  const handleSave = useCallback(async (draft: boolean = false) => {
    if (!scholarshipName.trim()) {
      setError("Scholarship name is required.");
      return;
    }
    setSubmitting(true);
    setError("");
    setSuccess("");
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(draft ? "Draft saved successfully!" : "Scholarship published successfully!");
    }, 1000);
  }, [scholarshipName]);

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <SectionCard>
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-blue-600" /> Create New Scholarship
        </h2>

        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600" /> Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <InputField
                label="Scholarship Name"
                required
                placeholder="e.g., Merit Scholarship 2026"
                value={scholarshipName}
                onChange={(e) => setScholarshipName(e.target.value)}
              />
            </div>
            <div>
              <InputField
                label="Scholarship Code"
                placeholder="e.g., SCH-2026-001"
                value={scholarshipCode}
                onChange={(e) => setScholarshipCode(e.target.value)}
              />
            </div>
            <div>
              <SelectField label="Scholarship Type" required value={scholarshipType} onChange={(e) => setScholarshipType(e.target.value)} options={SCHOLARSHIP_TYPE_OPTIONS} />
            </div>
          </div>
        </div>

        {/* Financial Details */}
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" /> Financial Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <InputField
                label="Total Seats"
                required
                type="number"
                placeholder="Number of seats"
                value={totalSeats}
                onChange={(e) => setTotalSeats(e.target.value)}
              />
            </div>
            <div>
              <InputField
                label="Amount per Student (Rs)"
                required
                type="number"
                placeholder="Amount in NPR"
                value={amountPerStudent}
                onChange={(e) => setAmountPerStudent(e.target.value)}
              />
            </div>
            <div>
              <InputField
                label="Total Budget (Rs)"
                placeholder="Auto-calculated"
                value={totalBudget}
                readOnly
                className="bg-slate-50"
              />
            </div>
              <SelectField label="Disbursement Type" value={disbursementType} onChange={(e) => setDisbursementType(e.target.value)} options={DISBURSEMENT_OPTIONS} />
              <SelectField label="Coverage" value={coverage} onChange={(e) => setCoverage(e.target.value)} options={COVERAGE_OPTIONS} />
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-600" /> Timeline
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <InputField
                label="Application Start Date"
                required
                type="date"
                value={appStartDate}
                onChange={(e) => setAppStartDate(e.target.value)}
              />
            </div>
            <div>
              <InputField
                label="Application End Date"
                required
                type="date"
                value={appEndDate}
                onChange={(e) => setAppEndDate(e.target.value)}
              />
            </div>
            <div>
              <InputField
                label="Result Publication Date"
                type="date"
                value={resultDate}
                onChange={(e) => setResultDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Eligibility Criteria */}
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <CircleCheck className="w-4 h-4 text-orange-600" /> Eligibility Criteria
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField label="Eligible Grades" required value={eligibleGrades} onChange={(e) => setEligibleGrades(e.target.value)} options={GRADE_OPTIONS} />
            <div>
              <InputField
                label="Minimum GPA Required"
                required
                type="number"
                step="0.01"
                placeholder="e.g., 3.5"
                value={minGpa}
                onChange={(e) => setMinGpa(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Stream/Subject</label>
              <select
                multiple
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100 h-32"
                value={streams}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, (o) => o.value);
                  setStreams(selected);
                }}
              >
                <option value="science">Science</option>
                <option value="management">Management</option>
                <option value="humanities">Humanities</option>
                <option value="education">Education</option>
                <option value="law">Law</option>
                <option value="engineering">Engineering</option>
                <option value="medical">Medical</option>
              </select>
              <p className="text-xs text-slate-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Age Range</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="flex-1 px-3.5 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-600"
                  placeholder="Min"
                  value={ageMin}
                  onChange={(e) => setAgeMin(e.target.value)}
                />
                <span className="text-slate-400">-</span>
                <input
                  type="number"
                  className="flex-1 px-3.5 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-600"
                  placeholder="Max"
                  value={ageMax}
                  onChange={(e) => setAgeMax(e.target.value)}
                />
              </div>
            </div>
              <SelectField label="Gender Eligibility" value={gender} onChange={(e) => setGender(e.target.value)} options={GENDER_OPTIONS} />
              <SelectField label="Marital Status" value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)} options={MARITAL_OPTIONS} />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Eligible Provinces <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-3 p-4 border border-slate-200 rounded-lg bg-slate-50">
              {PROVINCES.map((province, index) => {
                const val = (index + 1).toString();
                return (
                  <label key={val} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" checked={provinces.includes(val)} onChange={() => toggleProvince(val)} />
                    <span className="text-sm">{province}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Additional Requirements</label>
            <div className="space-y-3 p-4 border border-slate-200 rounded-lg bg-slate-50">
              {ADDITIONAL_REQUIREMENTS.map((req) => (
                <label key={req} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="rounded w-4 h-4" checked={requirements.includes(req)} onChange={() => toggleRequirement(req)} />
                  <span className="text-sm text-slate-700">{req}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Description & Details */}
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" /> Description & Details
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Short Description <span className="text-red-500">*</span>
              </label>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={shortDesc}
                  onChange={setShortDesc}
                  modules={quillModules}
                  formats={quillFormats}
                  className="bg-white"
                />
              </div>
              <p className="text-xs text-slate-500 text-right mt-1">{shortDesc.length}/200 characters</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Full Description <span className="text-red-500">*</span>
              </label>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={fullDesc}
                  onChange={setFullDesc}
                  modules={quillModules}
                  formats={quillFormats}
                  className="bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Important Notes</label>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={notes}
                  onChange={setNotes}
                  modules={quillModules}
                  formats={quillFormats}
                  className="bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Required Documents */}
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-pink-600" /> Required Documents
          </h3>
          <div className="space-y-4">
            <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-slate-700">Mandatory Documents</label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {MANDATORY_DOCUMENTS.map((doc) => (
                  <label key={doc} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" defaultChecked={DEFAULT_CHECKED_DOCS.includes(doc)} />
                    <span className="text-sm text-slate-600">{doc}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Upload Scholarship Guidelines/PDF</label>
              <div className="border-2 border-dashed border-slate-200 rounded-md py-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-all">
                <UploadCloud className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
                <p className="text-xs text-slate-500 mt-1">PDF, DOC, DOCX up to 10MB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Selection Process */}
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-indigo-600" /> Selection Process
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <SelectField
                label="Selection Criteria"
                value={selectionCriteria}
                onChange={(e) => setSelectionCriteria(e.target.value)}
                options={[
                  { value: "merit", label: "Merit Based" },
                  { value: "interview", label: "Interview Required" },
                  { value: "written", label: "Written Test" },
                  { value: "combined", label: "Combined (Merit + Interview)" },
                ]}
              />
            </div>
            <div>
              <InputField
                label="Number of Interview Rounds"
                type="number"
                placeholder="e.g., 1"
                value={interviewRounds}
                onChange={(e) => setInterviewRounds(e.target.value)}
              />
            </div>
            <div>
              <InputField
                label="Interview Location"
                placeholder="e.g., Kathmandu Office"
                value={interviewLocation}
                onChange={(e) => setInterviewLocation(e.target.value)}
              />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Action Buttons */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {success}
        </div>
      )}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => handleSave(true)} disabled={submitting}>
          <Save className="w-4 h-4" /> Save as Draft
        </Button>
        <Button onClick={() => handleSave(false)} disabled={submitting}>
          <PlusCircle className="w-4 h-4" /> {submitting ? "Publishing..." : "Publish Scholarship"}
        </Button>
      </div>
    </div>
  );
});

CreateScholarship.displayName = "CreateScholarship";

export default CreateScholarship;
