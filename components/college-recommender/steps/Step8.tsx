"use client";

import React from "react";
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
  description?: string,
) => (
  <button
    type="button"
    onClick={onClick}
    className={`group relative flex w-full items-center rounded-xl border border-slate-300 p-5 text-left transition-all duration-200 hover:border-brand-blue ${
      checked
        ? "border-brand-blue bg-brand-blue/10"
        : "border-slate-300 bg-white hover:bg-slate-50"
    }`}
  >
    <div
      className={`mr-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-300 ${
        checked ? "border-brand-blue bg-brand-blue" : "border-slate-300 bg-white"
      }`}
    >
      <Check
        className={`h-3 w-3 text-white transition-all duration-300 ${
          checked ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      />
    </div>
    <div>
      <p
        className={`text-base font-medium transition-colors ${
          checked ? "text-brand-blue" : "text-slate-700"
        }`}
      >
        {label}
      </p>
      {description ? (
        <p className="mt-0.5 text-sm text-slate-500">{description}</p>
      ) : null}
    </div>
  </button>
);

export default function Step8({ form, handleInputChange }: StepProps) {
  return (
    <div className="mt-8 space-y-8">
      {renderRadioOption(
        form.activities_importance === "Yes",
        () => handleInputChange("activities_importance", "Yes"),
        "Yes, they are very important",
      )}
      {renderRadioOption(
        form.activities_importance === "Somewhat",
        () => handleInputChange("activities_importance", "Somewhat"),
        "Somewhat important",
      )}
      {renderRadioOption(
        form.activities_importance === "No",
        () => handleInputChange("activities_importance", "No"),
        "No, I prefer to focus on academics",
      )}
    </div>
  );
}