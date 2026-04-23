"use client";

import React, { useState } from "react";

interface SelectScholarshipTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (scholarshipType: string) => void;
}

const scholarshipTypes = [
  { value: "need-based", label: "Need Based" },
  { value: "merit-based", label: "Merit Based" },
  { value: "partial-tuition", label: "Partial Tuition" },
  { value: "full-tuition", label: "Full Tuition" },
  { value: "research-grant", label: "Research Grant" },
  { value: "athletic-sports", label: "Athletic & Sports" },
  { value: "diversity", label: "Diversity & Minority" },
];

const SelectScholarshipTypeModal: React.FC<SelectScholarshipTypeModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelect = (type: string) => {
    setSelectedType(type);
  };

  const handleApply = () => {
    if (selectedType) {
      onSelect(selectedType);
      setSelectedType(null);
    }
  };

  const handleClose = () => {
    setSelectedType(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-md shadow-2xl w-full max-w-md overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors focus:outline-none rounded-md focus:ring-2 focus:ring-gray-200 p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8 sm:p-10 pt-12">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Select Scholarship Type</h2>
          <p className="text-sm text-gray-500 mt-2 mb-6 leading-relaxed">
            Please select a scholarship type to filter and show the most relevant results tailored for you.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 max-h-[220px] overflow-y-auto custom-scroll pr-2">
            {scholarshipTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => handleSelect(type.value)}
                className={`group relative flex items-center justify-between w-full px-4 py-3.5 bg-white border-2 rounded-md text-sm font-medium transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 focus:outline-none ${
                  selectedType === type.value
                    ? "border-blue-600 bg-blue-50 text-blue-800 ring-1 ring-blue-600"
                    : "border-gray-100 text-gray-700"
                }`}
              >
                <span>{type.label}</span>
                <div className={`check-icon transition-all duration-200 text-blue-600 ${
                  selectedType === type.value ? "opacity-100 scale-100" : "opacity-0 scale-50"
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                </div>
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleClose}
              className="w-full sm:w-1/2 px-5 py-3.5 bg-white text-gray-700 font-semibold rounded-md border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-1"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={!selectedType}
              className="w-full sm:w-1/2 px-5 py-3.5 bg-blue-600 text-white font-semibold rounded-md  hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 shadow-blue-500/30"
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectScholarshipTypeModal;