"use client";

import React from "react";
import type { MockTestQuestion } from "@/services/mockTestsApi";

const OPTION_LABELS = ["A", "B", "C", "D", "E", "F"] as const;

interface MockTestQuestionCardProps {
  question: MockTestQuestion;
  index: number;
  selectedOptionId: number | null;
  onSelect: (optionId: number) => void;
}

export default function MockTestQuestionCard({
  question,
  index,
  selectedOptionId,
  onSelect,
}: MockTestQuestionCardProps) {
  const name = `question-${question.id}`;

  return (
    <fieldset className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_18px_45px_-38px_rgba(15,23,42,0.55)] sm:p-6">
      <legend className="sr-only">
        Question {index + 1} of the questions in this test
      </legend>

      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-600">
        Question {index + 1}
      </p>
      <p className="mt-2 text-lg font-bold leading-relaxed tracking-[-0.02em] text-gray-900">
        {question.question_text}
      </p>

      <div className="mt-5 space-y-2.5">
        {question.options.map((option, optionIndex) => {
          const checked = selectedOptionId === option.id;
          const inputId = `${name}-option-${option.id}`;
          return (
            <label
              key={option.id}
              htmlFor={inputId}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-all ${
                checked
                  ? "border-brand-blue bg-blue-50/70 ring-1 ring-brand-blue/20"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <input
                id={inputId}
                type="radio"
                name={name}
                value={option.id}
                checked={checked}
                onChange={() => onSelect(option.id)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#0000FF]"
              />
              <span
                aria-hidden="true"
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                  checked
                    ? "bg-brand-blue text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {OPTION_LABELS[optionIndex] ?? optionIndex + 1}
              </span>
              <span className="text-sm leading-6 text-gray-700">
                {option.option_text}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
