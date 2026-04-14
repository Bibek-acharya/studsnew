"use client";

import { CollegeRecommenderForm } from "../CollegeRecommenderToolPage";
import Dropdown from "../Dropdown";

interface Step3Props {
  form: CollegeRecommenderForm;
  handleInputChange: (field: keyof CollegeRecommenderForm, value: string) => void;
}

const renderPillOption = (
  checked: boolean,
  onClick: () => void,
  label: string,
) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-xl border-2 border-[#e2e8f0] bg-white px-5 py-3 text-base font-medium text-[#0f172a] transition-all duration-200 hover:border-[#cbd5e1] hover:bg-[#f8fafc] ${
      checked
        ? "border-brand-blue bg-brand-blue/10 text-brand-blue font-semibold"
        : ""
    }`}
  >
    {label}
  </button>
);

export default function Step3({ form, handleInputChange }: Step3Props) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="mt-8 space-y-8">
        <div className="space-y-4">
          <p className="text-[17px] font-semibold text-[#0f172a]">
            Do you know what you want to study?
          </p>
          <div className="flex flex-wrap gap-3">
            {renderPillOption(
              form.knows_course === "Yes",
              () => handleInputChange("knows_course", "Yes"),
              "Yes, I know my course",
            )}
            {renderPillOption(
              form.knows_course === "Not sure",
              () => handleInputChange("knows_course", "Not sure"),
              "Not sure yet",
            )}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[17px] font-semibold text-[#0f172a]">
            Select your preferred field:
          </p>
          <Dropdown
            value={form.preferred_field || ""}
            onChange={(val) => handleInputChange("preferred_field", val)}
            options={[
              "Science (+2 Science / BSc / BIT / CSIT / Engineering)",
              "Management (BBS / BBA / BBM / BHM)",
              "Humanities / Law",
              "Medical / Nursing / Pharmacy",
              "IT / Computer",
              "Hotel Management",
              "Education",
              "Others",
            ]}
            placeholder="Search or select your preferred field"
          />
        </div>

        <div className="space-y-4">
          <p className="text-[17px] font-semibold text-[#0f172a]">
            Is college reputation important to you?
          </p>
          <div className="flex flex-wrap gap-3">
            {renderPillOption(
              form.reputation_importance === "Yes",
              () => handleInputChange("reputation_importance", "Yes"),
              "Yes, very important",
            )}
            {renderPillOption(
              form.reputation_importance === "Somewhat",
              () => handleInputChange("reputation_importance", "Somewhat"),
              "Somewhat",
            )}
            {renderPillOption(
              form.reputation_importance === "No",
              () => handleInputChange("reputation_importance", "No"),
              "Not important",
            )}
          </div>
        </div>
      </div>
    </div>
  );
}