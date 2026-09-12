"use client";

import React from "react";

const BENEFITS = ["Tuition Fees", "Food & Accommodation", "Research Materials", "Travel Allowance", "Books & Supplies", "Full Support"];

const inputClass = "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500";

interface FinancialCardProps {
  totalValue: string;
  setTotalValue: (v: string) => void;
  totalSeats: string;
  setTotalSeats: (v: string) => void;
  fieldOfStudy: string;
  setFieldOfStudy: (v: string) => void;
  benefits: string[];
  setBenefits: React.Dispatch<React.SetStateAction<string[]>>;
}

export const FinancialCard: React.FC<FinancialCardProps> = ({
  totalValue,
  setTotalValue,
  totalSeats,
  setTotalSeats,
  fieldOfStudy,
  setFieldOfStudy,
  benefits,
  setBenefits,
}) => {
  const toggleBenefit = (benefit: string) => {
    setBenefits((prev) =>
      prev.includes(benefit) ? prev.filter((b) => b !== benefit) : [...prev, benefit]
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
      <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4 flex items-center gap-3">
        <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Financial Details</h2>
          <p className="text-sm text-gray-500 mt-0.5">Funding amount, seats and coverage</p>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Total Value / Amount</label>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g., NPR 500,000"
              value={totalValue}
              onChange={(e) => setTotalValue(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Total Seats</label>
            <input
              type="number"
              min={0}
              className={inputClass}
              placeholder="e.g., 110"
              value={totalSeats}
              onChange={(e) => setTotalSeats(e.target.value.replace(/[^0-9]/g, ""))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Field of Study</label>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g., Science, Technology, All"
              value={fieldOfStudy}
              onChange={(e) => setFieldOfStudy(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Coverage / Benefits</label>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <label key={benefit} className="flex cursor-pointer items-center gap-3 rounded-md border border-gray-200 p-3 transition-all hover:border-blue-300 hover:bg-gray-50">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={benefits.includes(benefit)}
                  onChange={() => toggleBenefit(benefit)}
                />
                <span className="text-sm font-medium text-gray-700">{benefit}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialCard;
