"use client";

import React from "react";
import { Plus, Trash } from "@phosphor-icons/react";

interface ExamCenterItem {
  province: string;
  centerName: string;
  contactPerson: string;
  phoneNumber: string;
  mapCoordinates: string;
}

interface ExamCentersSectionProps {
  examCenters: ExamCenterItem[];
  setExamCenters: React.Dispatch<React.SetStateAction<ExamCenterItem[]>>;
}

const formInputClass = "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500";
const formSelectClass = "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer";

const PROVINCES = [
  "Koshi", "Madhesh", "Bagmati", "Gandaki", "Lumbini", "Karnali", "Sudurpashchim"
];

export const ExamCentersSection: React.FC<ExamCentersSectionProps> = ({ examCenters, setExamCenters }) => {
  const addExamCenter = () => {
    setExamCenters([...examCenters, { province: "", centerName: "", contactPerson: "", phoneNumber: "", mapCoordinates: "" }]);
  };

  const removeExamCenter = (index: number) => {
    setExamCenters(examCenters.filter((_, i) => i !== index));
  };

  const updateExamCenter = (index: number, field: keyof ExamCenterItem, value: string) => {
    setExamCenters(examCenters.map((ec, i) => i === index ? { ...ec, [field]: value } : ec));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
      <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Exam Center Locations</h2>
            <p className="text-sm text-gray-500 mt-0.5">Where the entrance exam is conducted</p>
          </div>
        </div>
        <button
          type="button"
          className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
          onClick={addExamCenter}
        >
          <Plus size={16} /> Add Center
        </button>
      </div>
      <div className="p-6 space-y-6">
        {examCenters.map((ec, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-start gap-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-grow">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Province</label>
                  <select
                    className={formSelectClass}
                    value={ec.province}
                    onChange={(e) => updateExamCenter(index, "province", e.target.value)}
                  >
                    <option value="">Select Province</option>
                    {PROVINCES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Center Name</label>
                  <input
                    className={formInputClass}
                    placeholder="Advance Academy Biratnagar"
                    value={ec.centerName}
                    onChange={(e) => updateExamCenter(index, "centerName", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                  <input
                    className={formInputClass}
                    placeholder="Mr. Ram Kumar Sharma"
                    value={ec.contactPerson}
                    onChange={(e) => updateExamCenter(index, "contactPerson", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    className={formInputClass}
                    placeholder="9842012345"
                    value={ec.phoneNumber}
                    onChange={(e) => updateExamCenter(index, "phoneNumber", e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Map Coordinates (lat, lng)</label>
                  <input
                    className={formInputClass}
                    placeholder="26.4525, 87.2718"
                    value={ec.mapCoordinates}
                    onChange={(e) => updateExamCenter(index, "mapCoordinates", e.target.value)}
                  />
                </div>
              </div>
              <button
                type="button"
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-6"
                onClick={() => removeExamCenter(index)}
              >
                <Trash size={18} />
              </button>
            </div>
          </div>
        ))}
        {examCenters.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">No exam centers added yet.</p>
        )}
      </div>
    </div>
  );
};

export default ExamCentersSection;