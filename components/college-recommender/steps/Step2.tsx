"use client";

import { CollegeRecommenderForm } from "../CollegeRecommenderToolPage";
import Dropdown from "../Dropdown";

interface Step2Props {
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
    className={`flex w-full cursor-pointer items-center rounded-xl border-2 border-[#e2e8f0] bg-white p-5 transition-all duration-200 hover:border-[#cbd5e1] hover:bg-[#f8fafc] ${
      checked
        ? "border-brand-blue bg-brand-blue/10"
        : ""
    }`}
  >
    <div
      className={`mr-4 flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-md border-2 border-[#e2e8f0] transition-all duration-200 ${
        checked ? "border-brand-blue bg-brand-blue" : "bg-white"
      }`}
    >
      {checked && (
        <div className="relative h-2.5 w-1 border-white border-r-2 border-b-2" style={{ transform: "rotate(45deg)", marginBottom: "2px" }} />
      )}
    </div>
    <span
      className={`text-base font-medium ${checked ? "font-semibold text-brand-blue" : "text-[#475569]"}`}
    >
      {label}
    </span>
  </button>
);

export default function Step2({ form, handleInputChange }: Step2Props) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="mt-8 space-y-8">
        <div className="space-y-4">
          <p className="text-[17px] font-semibold text-[#0f172a]">
            Do you need financial support?
          </p>
          <div className="flex flex-col gap-4">
            {renderOption(
              form.financial_support === "yes",
              () => handleInputChange("financial_support", "yes"),
              "Yes, I need scholarship / financial aid",
            )}
            {renderOption(
              form.financial_support === "no",
              () => handleInputChange("financial_support", "no"),
              "No, I can manage full fees",
            )}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[17px] font-semibold text-[#0f172a]">
            What is your yearly budget range?
          </p>
          <Dropdown
            value={form.yearly_budget || ""}
            onChange={(val) => handleInputChange("yearly_budget", val)}
            options={[
              "Under $10,000 / year",
              "$10,000 - $30,000 / year",
              "$30,000 - $50,000 / year",
              "Over $50,000 / year",
            ]}
            placeholder="Select budget"
          />
        </div>
      </div>
    </div>
  );
}