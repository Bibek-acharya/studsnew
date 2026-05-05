"use client";

import React from "react";
import { Plus, Trash } from "@phosphor-icons/react";
import RichTextEditor from "../common/RichTextEditor";

interface ScholarshipTypeItem {
  type: string;
  seats: string;
  coverage: string;
  eligibility: string;
}

interface SelectionRubricItem {
  criteria: string;
  description: string;
  weight: string;
}

interface ScholarshipDetailsSectionProps {
  sectionTitle: string;
  setSectionTitle: (v: string) => void;
  subtitle: string;
  setSubtitle: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  scholarshipTypes: ScholarshipTypeItem[];
  setScholarshipTypes: React.Dispatch<React.SetStateAction<ScholarshipTypeItem[]>>;
  selectionRubric: SelectionRubricItem[];
  setSelectionRubric: React.Dispatch<React.SetStateAction<SelectionRubricItem[]>>;
  sectionTitleError?: string;
  subtitleError?: string;
  descriptionError?: string;
}

const formInputClass = "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500";

export const ScholarshipDetailsSection: React.FC<ScholarshipDetailsSectionProps> = ({
  sectionTitle, setSectionTitle,
  subtitle, setSubtitle,
  description, setDescription,
  scholarshipTypes, setScholarshipTypes,
  selectionRubric, setSelectionRubric,
  sectionTitleError, subtitleError, descriptionError,
}) => {
  const addScholarshipType = () => {
    setScholarshipTypes([...scholarshipTypes, { type: "", seats: "", coverage: "", eligibility: "" }]);
  };

  const removeScholarshipType = (index: number) => {
    setScholarshipTypes(scholarshipTypes.filter((_, i) => i !== index));
  };

  const updateScholarshipType = (index: number, field: keyof ScholarshipTypeItem, value: string) => {
    setScholarshipTypes(scholarshipTypes.map((st, i) => i === index ? { ...st, [field]: value } : st));
  };

  const addRubricItem = () => {
    setSelectionRubric([...selectionRubric, { criteria: "", description: "", weight: "" }]);
  };

  const removeRubricItem = (index: number) => {
    setSelectionRubric(selectionRubric.filter((_, i) => i !== index));
  };

  const updateRubricItem = (index: number, field: keyof SelectionRubricItem, value: string) => {
    setSelectionRubric(selectionRubric.map((r, i) => i === index ? { ...r, [field]: value } : r));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
      <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4 flex items-center gap-3">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Scholarship Tab - Program Details</h2>
          <p className="text-sm text-gray-500 mt-0.5">Types of scholarships available and their benefits</p>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div className="space-y-6 mb-8 pb-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Section Title <span className="text-red-500">*</span>
            </label>
            <input
              id="scholarshipSectionTitle"
              type="text"
              className={`${formInputClass} ${sectionTitleError ? "border-red-500 bg-red-50/10" : ""}`}
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              placeholder="Scholarship Program 2082"
            />
            {sectionTitleError && <p className="text-red-500 text-xs mt-1">{sectionTitleError}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Subtitle/Tagline <span className="text-red-500">*</span>
            </label>
            <input
              id="scholarshipSubtitle"
              type="text"
              className={`${formInputClass} ${subtitleError ? "border-red-500 bg-red-50/10" : ""}`}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Fully funded higher secondary education"
            />
            {subtitleError && <p className="text-red-500 text-xs mt-1">{subtitleError}</p>}
          </div>
          <div id="scholarshipDescription" className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Program Description <span className="text-red-500">*</span>
            </label>
            <RichTextEditor
              value={description}
              onChange={setDescription}
              placeholder="Describe the scholarship program..."
              minHeight={120}
            />
            {descriptionError && <p className="text-red-500 text-xs mt-1">{descriptionError}</p>}
          </div>
        </div>

        <hr className="border-gray-200" />

        <div className="pt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">Scholarship Types Available</h3>
            <button
              type="button"
              className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 flex items-center gap-1.5 transition-colors shadow-sm"
              onClick={addScholarshipType}
            >
              <Plus size={16} /> Add Type
            </button>
          </div>
          <div className="space-y-4">
            {scholarshipTypes.map((st, index) => (
              <div key={index} className="flex gap-4 items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">Type <span className="text-red-500">*</span></label>
                    <input
                      className={formInputClass}
                      value={st.type}
                      onChange={(e) => updateScholarshipType(index, "type", e.target.value)}
                      placeholder="e.g. Fully Funded"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">Seats <span className="text-red-500">*</span></label>
                    <input
                      className={formInputClass}
                      value={st.seats}
                      onChange={(e) => updateScholarshipType(index, "seats", e.target.value.replace(/[^0-9]/g, ""))}
                      placeholder="Number of seats"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">Coverage <span className="text-red-500">*</span></label>
                    <input
                      className={formInputClass}
                      value={st.coverage}
                      onChange={(e) => updateScholarshipType(index, "coverage", e.target.value)}
                      placeholder="What is covered"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">Eligibility <span className="text-red-500">*</span></label>
                    <input
                      className={formInputClass}
                      value={st.eligibility || ""}
                      onChange={(e) => updateScholarshipType(index, "eligibility", e.target.value)}
                      placeholder="e.g. SEE Graduates"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-6"
                  onClick={() => removeScholarshipType(index)}
                >
                  <Trash size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-gray-200" />

        <div className="pt-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold text-gray-800">Selection Process & Marking Criteria</h3>
              <p className="text-sm text-gray-500 mt-0.5">How candidates are evaluated and scored</p>
            </div>
            <button
              type="button"
              className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
              onClick={addRubricItem}
            >
              <Plus size={16} /> Add Criteria
            </button>
          </div>
          <div className="space-y-4">
            {selectionRubric.map((r, index) => (
              <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg border border-gray-200 relative">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-3 space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">Criteria Name <span className="text-red-500">*</span></label>
                    <input
                      className={formInputClass}
                      value={r.criteria}
                      onChange={(e) => updateRubricItem(index, "criteria", e.target.value)}
                      placeholder="e.g. Written Exam"
                    />
                  </div>
                  <div className="md:col-span-5 space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
                    <input
                      className={formInputClass}
                      value={r.description}
                      onChange={(e) => updateRubricItem(index, "description", e.target.value)}
                      placeholder="e.g. English, Math, Science"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">Weight <span className="text-red-500">*</span></label>
                    <input
                      className={formInputClass}
                      value={r.weight}
                      onChange={(e) => updateRubricItem(index, "weight", e.target.value)}
                      placeholder="e.g. 60%"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-6"
                  onClick={() => removeRubricItem(index)}
                >
                  <Trash size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipDetailsSection;