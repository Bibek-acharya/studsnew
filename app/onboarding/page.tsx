"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { apiService } from "@/services/api";

const studyLevels = [
  { value: "see_graduate", label: "SEE Graduate" },
  { value: "plus2_running", label: "+2 Running" },
  { value: "plus2_graduate", label: "+2 Graduate" },
  { value: "bachelor_running", label: "Bachelor Running" },
  { value: "bachelor_graduate", label: "Bachelor Graduate" },
  { value: "masters", label: "Masters" },
];

const targetExams = [
  { value: "IOE", label: "IOE Entrance" },
  { value: "IOM", label: "IOM Entrance" },
  { value: "CEE", label: "CEE Entrance" },
  { value: "KU", label: "Kathmandu University" },
  { value: "TU", label: "Tribhuvan University" },
  { value: "MBBS", label: "MBBS / Medical" },
  { value: "BBA", label: "BBA / Management" },
  { value: "CTEVT", label: "CTEVT" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [educationLevel, setEducationLevel] = useState("");
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [preferredLocation, setPreferredLocation] = useState("");
  const [interest, setInterest] = useState("");

  const toggleExam = (exam: string) => {
    setSelectedExams(prev => 
      prev.includes(exam) 
        ? prev.filter(e => e !== exam)
        : [...prev, exam]
    );
  };

  const handleSubmit = async () => {
    if (!educationLevel) {
      setError("Please select your current study level");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      await apiService.savePreferences({
        preference_role: "student",
        preference_flow: "onboarding",
        preferences: {
          education_level: educationLevel,
          target_exams: selectedExams,
          preferred_location: preferredLocation,
          interest: interest,
        },
      }, token);

      router.push("/");
    } catch (err: any) {
      setError(err?.message || "Failed to save preferences. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-md  border border-gray-200 p-6 sm:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Tell us about yourself</h1>
            <p className="text-sm text-gray-500 mt-1">We just need a few details to personalize your experience.</p>
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 mb-4">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Education Level *
              </label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full rounded-md border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-blue-600 focus:ring-0"
              >
                <option value="">Select your level...</option>
                {studyLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Exams / Courses (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {targetExams.map(exam => (
                  <button
                    key={exam.value}
                    type="button"
                    onClick={() => toggleExam(exam.value)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedExams.includes(exam.value)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {exam.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Location
              </label>
              <input
                type="text"
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
                placeholder="e.g., Kathmandu, Lalitpur"
                className="w-full rounded-md border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-blue-600 focus:ring-0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Career Interest (optional)
              </label>
              <input
                type="text"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                placeholder="e.g., Engineering, Medicine, Management"
                className="w-full rounded-md border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-blue-600 focus:ring-0"
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save and Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}