"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { CollegeRecommenderForm } from "../CollegeRecommenderToolPage";

interface StepProps {
  form: CollegeRecommenderForm;
  handleInputChange: (field: keyof CollegeRecommenderForm, value: string) => void;
}

const renderRadioOption = (
  checked: boolean,
  onClick: () => void,
  label: string,
) => (
  <button
    type="button"
    onClick={onClick}
    className={`group relative flex w-full items-center rounded-lg border-2 border-slate-300 p-4 text-left transition-all duration-200 hover:border-brand-blue hover:bg-slate-50 ${
      checked
        ? "border-brand-blue bg-brand-blue/10"
        : "border-slate-300 bg-white"
    }`}
  >
    <div
      className={`mr-4 flex h-6 w-6 shrink-0 items-center justify-center rounded border-2 transition-all duration-300 ${
        checked ? "border-brand-blue bg-brand-blue" : "border-slate-400 bg-white"
      }`}
    >
      <Check
        className={`h-4 w-4 text-white transition-all duration-300 ${
          checked ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      />
    </div>
    <span className={`text-base font-medium transition-colors ${
      checked ? "text-brand-blue" : "text-slate-700"
    }`}>
      {label}
    </span>
  </button>
);

export default function Step9({ form, handleInputChange }: StepProps) {
  const [otherValue, setOtherValue] = useState("");
  const isOtherSelected = form.facility_choice === "Other";

  return (
    <div className="mt-8 space-y-3">
      {renderRadioOption(
        form.facility_choice === "Modern labs",
        () => handleInputChange("facility_choice", "Modern labs"),
        "Modern labs",
      )}
      {renderRadioOption(
        form.facility_choice === "Hostel facility",
        () => handleInputChange("facility_choice", "Hostel facility"),
        "Hostel facility",
      )}
      {renderRadioOption(
        form.facility_choice === "Library",
        () => handleInputChange("facility_choice", "Library"),
        "Library",
      )}
      {renderRadioOption(
        form.facility_choice === "Cafeteria quality",
        () => handleInputChange("facility_choice", "Cafeteria quality"),
        "Cafeteria quality",
      )}
      {renderRadioOption(
        form.facility_choice === "All of the above",
        () => handleInputChange("facility_choice", "All of the above"),
        "All of the above",
      )}
      {renderRadioOption(
        form.facility_choice === "Other",
        () => handleInputChange("facility_choice", "Other"),
        "Other",
      )}
      {isOtherSelected && (
        <input
          type="text"
          value={otherValue}
          onChange={(e) => {
            setOtherValue(e.target.value);
            handleInputChange("facility_choice", e.target.value);
          }}
          className="w-full p-3.5 border-2 border-slate-300 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all text-base text-slate-700"
          placeholder="Please specify..."
        />
      )}
    </div>
  );
}