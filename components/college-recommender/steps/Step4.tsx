"use client";

import { CollegeRecommenderForm } from "../CollegeRecommenderToolPage";
import Dropdown from "../Dropdown";

interface Step4Props {
  form: CollegeRecommenderForm;
  handleInputChange: (field: keyof CollegeRecommenderForm, value: string) => void;
}

export default function Step4({ form, handleInputChange }: Step4Props) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="mt-8 space-y-8">
        <div className="space-y-4">
          <p className="text-[17px] font-semibold text-[#0f172a]">
            Which province do you prefer?
          </p>
          <Dropdown
            value={form.province || ""}
            onChange={(val) => handleInputChange("province", val)}
            options={[
              "Bagmati",
              "Province 1",
              "Madhesh",
              "Gandaki",
              "Lumbini",
              "Karnali",
              "Sudurpashchim",
              "No preference",
            ]}
            placeholder="Search or select your province"
          />
        </div>

        <div className="space-y-4">
          <p className="text-[17px] font-semibold text-[#0f172a]">
            Do you prefer:
          </p>
          <Dropdown
            value={form.setting || ""}
            onChange={(val) => handleInputChange("setting", val)}
            options={[
              "Kathmandu Valley",
              "Outside Valley but city area",
              "Near my hometown",
              "Anywhere",
            ]}
            placeholder="Search or select your setting"
          />
        </div>
      </div>
    </div>
  );
}