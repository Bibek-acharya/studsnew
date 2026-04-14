"use client";

import { CollegeRecommenderForm } from "../CollegeRecommenderToolPage";

interface Step6Props {
  form: CollegeRecommenderForm;
  handleInputChange: (field: keyof CollegeRecommenderForm, value: string) => void;
}

const renderOption = (
  checked: boolean,
  onClick: () => void,
  label: string,
) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex w-full cursor-pointer items-center rounded-[0.75rem] border-2 border-[#e2e8f0] bg-white p-5 transition-all duration-200 hover:border-[#cbd5e1] hover:bg-[#f8fafc] ${
      checked
        ? "border-brand-blue bg-brand-blue/10"
        : ""
    }`}
  >
    <div
      className={`mr-4 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[6px] border-2 border-[#e2e8f0] transition-all duration-200 ${
        checked ? "border-brand-blue bg-brand-blue" : "bg-white"
      }`}
    >
      {checked && (
        <div className="relative h-2.5 w-1 border-white border-r-[2px] border-b-[2px]" style={{ transform: "rotate(45deg)", marginBottom: "2px" }} />
      )}
    </div>
    <span
      className={`text-[17px] ${checked ? "font-semibold text-brand-blue" : "text-[#475569]"}`}
    >
      {label}
    </span>
  </button>
);

export default function Step6({ form, handleInputChange }: Step6Props) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="mt-8 space-y-4">
        {renderOption(
          form.class_size === "Small class (more teacher attention)",
          () => handleInputChange("class_size", "Small class (more teacher attention)"),
          "Small class (more teacher attention)",
        )}
        {renderOption(
          form.class_size === "Medium class",
          () => handleInputChange("class_size", "Medium class"),
          "Medium class",
        )}
        {renderOption(
          form.class_size === "Large college with big batches",
          () => handleInputChange("class_size", "Large college with big batches"),
          "Large college with big batches",
        )}
      </div>
    </div>
  );
}