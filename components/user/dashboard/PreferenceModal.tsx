"use client";

import React, { useState } from "react";
import {
  X,
  Award,
  MapPin,
  DollarSign,
  Save,
} from "lucide-react";
import { NEPAL_PROVINCES, NEPAL_DISTRICTS } from "@/lib/location-data";

interface PreferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PreferredStudyState {
  targetLevel: string;
  preferredField: string;
  preferredSpecialization: string;
  preferredProvince: string;
  preferredDistrict: string;
  budgetRange: string;
  scholarshipRequired: string;
  scholarshipType: string;
}

const PreferenceModal: React.FC<PreferenceModalProps> = ({ isOpen, onClose }) => {
  const [preferredStudy, setPreferredStudy] = useState<PreferredStudyState>({
    targetLevel: "Bachelor",
    preferredField: "Computer Science",
    preferredSpecialization: "Artificial Intelligence",
    preferredProvince: "Bagmati",
    preferredDistrict: "Kathmandu",
    budgetRange: "500000-1000000",
    scholarshipRequired: "Yes",
    scholarshipType: "Merit Based",
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-md shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
          <h2 className="text-xl font-bold text-gray-900">Update Preferences</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-md p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              Study Goal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Target Level</label>
                <select
                  value={preferredStudy.targetLevel}
                  onChange={(e) => setPreferredStudy({ ...preferredStudy, targetLevel: e.target.value })}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option>+2</option>
                  <option>A-Level</option>
                  <option>Diploma</option>
                  <option>Bachelor</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Preferred Field</label>
                <input
                  type="text"
                  value={preferredStudy.preferredField}
                  onChange={(e) => setPreferredStudy({ ...preferredStudy, preferredField: e.target.value })}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1">Preferred Specialization (Optional)</label>
                <input
                  type="text"
                  value={preferredStudy.preferredSpecialization}
                  onChange={(e) =>
                    setPreferredStudy({ ...preferredStudy, preferredSpecialization: e.target.value })
                  }
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Location Preference
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Preferred Province</label>
                <select
                  value={preferredStudy.preferredProvince}
                  onChange={(e) =>
                    setPreferredStudy({
                      ...preferredStudy,
                      preferredProvince: e.target.value,
                      preferredDistrict:
                        NEPAL_DISTRICTS[e.target.value as keyof typeof NEPAL_DISTRICTS]?.[0] || "",
                    })
                  }
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  {NEPAL_PROVINCES.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Preferred District</label>
                <select
                  value={preferredStudy.preferredDistrict}
                  onChange={(e) => setPreferredStudy({ ...preferredStudy, preferredDistrict: e.target.value })}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  {(NEPAL_DISTRICTS[preferredStudy.preferredProvince as keyof typeof NEPAL_DISTRICTS] || []).map(
                    (dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              Budget &amp; Funding
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Budget Range (per year)</label>
                <select
                  value={preferredStudy.budgetRange}
                  onChange={(e) => setPreferredStudy({ ...preferredStudy, budgetRange: e.target.value })}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="0-500000">Rs. 0 - 500,000</option>
                  <option value="500000-1000000">Rs. 500,000 - 1,000,000</option>
                  <option value="1000000-2000000">Rs. 1,000,000 - 2,000,000</option>
                  <option value="2000000+">Rs. 2,000,000+</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Scholarship Required</label>
                <select
                  value={preferredStudy.scholarshipRequired}
                  onChange={(e) => setPreferredStudy({ ...preferredStudy, scholarshipRequired: e.target.value })}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Scholarship Type</label>
                <select
                  value={preferredStudy.scholarshipType}
                  onChange={(e) => setPreferredStudy({ ...preferredStudy, scholarshipType: e.target.value })}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option>Merit Based</option>
                  <option>Need Based</option>
                  <option>Either</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t border-gray-100 bg-white px-6 py-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferenceModal;