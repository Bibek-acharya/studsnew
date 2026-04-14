"use client";

import React from "react";
import { Check } from "lucide-react";
import { CollegeRecommenderForm, studentTypeOptions } from "../CollegeRecommenderToolPage";

interface Step1Props {
  form: CollegeRecommenderForm;
  handleInputChange: (field: keyof CollegeRecommenderForm, value: string) => void;
}

export default function Step1({ form, handleInputChange }: Step1Props) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        {studentTypeOptions.map((option) => (
          <label
            key={option.id}
            className={`group relative flex cursor-pointer flex-col rounded-lg border-2 p-7 transition-all duration-300 ${
              form.student_type === option.id
                ? "border-brand-blue bg-white"
                : "border-slate-100 bg-white hover:border-brand-blue"
            }`}
          >
            <input
              type="radio"
              name="student_type"
              className="sr-only"
              checked={form.student_type === option.id}
              onChange={() =>
                handleInputChange("student_type", option.id)
              }
            />
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-lg transition-all duration-300 ${
                form.student_type === option.id
                  ? "bg-brand-blue text-white"
                  : "bg-slate-50 text-slate-400 group-hover:bg-brand-blue/10 group-hover:text-brand-blue"
              }`}
            >
              <option.icon className="h-7 w-7" />
            </div>
            <h3 className="mt-6 text-xl font-bold text-slate-900 leading-tight">
              {option.title}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-500 group-hover:text-slate-600 ">
              {option.description}
            </p>
            <div
              className={`absolute top-7 right-7 flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                form.student_type === option.id
                  ? "border-brand-blue bg-brand-blue scale-100"
                  : "border-slate-100 bg-white scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100"
              }`}
            >
              <Check
                className={`h-4 w-4 text-white transition-all duration-300 ${
                  form.student_type === option.id
                    ? "scale-100"
                    : "scale-50 opacity-0"
                }`}
              />
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}