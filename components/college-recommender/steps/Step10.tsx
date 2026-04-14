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
) => (
  <button
    type="button"
    onClick={onClick}
    className={`group relative flex w-full items-center rounded-lg border-2 border-slate-300 p-4 text-left transition-all duration-200 hover:border-brand-blue ${
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

export default function Step10({ form, handleInputChange }: StepProps) {
  return (
    <div className="mt-8 space-y-4">
      {renderRadioOption(
        form.tuition_factor === "Yes, low cost is very important",
        () =>
          handleInputChange(
            "tuition_factor",
            "Yes, low cost is very important",
          ),
        "Yes, low cost is very important",
      )}
      {renderRadioOption(
        form.tuition_factor === "I'm okay paying more for quality",
        () =>
          handleInputChange(
            "tuition_factor",
            "I'm okay paying more for quality",
          ),
        "I'm okay paying more for quality",
      )}
      {renderRadioOption(
        form.tuition_factor === "Depends on scholarship availability",
        () =>
          handleInputChange(
            "tuition_factor",
            "Depends on scholarship availability",
          ),
        "Depends on scholarship availability",
      )}
    </div>
  );
}