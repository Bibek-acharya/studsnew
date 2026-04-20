"use client";

import { useMemo, useState } from "react";
import { initialRecommenderState, recommendations } from "./data";
import ResultsGrid from "@/components/scholarship-recommender/ResultsGrid";
import CustomSelect from "@/components/scholarship-recommender/CustomSelect";
import MultiSelect from "@/components/scholarship-recommender/MultiSelect";
import { NEPAL_PROVINCES, NEPAL_DISTRICTS } from "@/lib/location-data";
import { RecommenderState, StepIndex } from "./types";
import ShortlistView from "./ShortlistView";

const stepTitles: Record<number, { title: string; subtitle: string }> = {
  1: {
    title: "Tell us where you are in your education journey",
    subtitle: "We use this to match scholarships that fit your current level.",
  },
  2: {
    title: "What do you want to study?",
    subtitle: "Help us find opportunities relevant to your intended field and preferences.",
  },
  3: {
    title: "Location",
    subtitle: "Many scholarships depend on province, district, and preferred study location.",
  },
  4: {
    title: "Tell us a bit more about yourself",
    subtitle: "This helps us include category and need-based opportunities you are eligible for.",
  },
  5: {
    title: "Experience & Achievements",
    subtitle: "Optional details can improve your scholarship matching quality.",
  },
};

function isAcademicScoreValid(
  scoreType: RecommenderState["academicScoreType"],
  score: string,
): boolean {
  if (!scoreType || !score.trim()) return false;

  const numericScore = Number(score);
  if (Number.isNaN(numericScore)) return false;

  if (scoreType === "gpa") return numericScore >= 0 && numericScore <= 4;
  if (scoreType === "percentage") return numericScore >= 0 && numericScore <= 100;

  return false;
}

function isStepValid(step: StepIndex, state: RecommenderState): boolean {
  switch (step) {
    case 1:
      return Boolean(
        state.educationLevel &&
          state.studyMode &&
          state.academicScoreType &&
          isAcademicScoreValid(state.academicScoreType, state.academicScore),
      );
    case 2:
      return Boolean(state.fieldOfStudy && state.willingEssay && state.willingInterview && state.willingGpa);
    case 3:
      return Boolean(state.province && state.district && state.studyLocation);
    case 4:
      return Boolean(state.category && state.gender && state.income);
    case 5:
      return true;
    default:
      return false;
  }
}

function StepShell({
  title,
  subtitle,
  children,
  actions,
  step,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  actions: React.ReactNode;
  step: StepIndex;
}) {
  const isStep3 = step === 3;
  const isStep4 = step === 4;
  const isStep5 = step === 5;

  const leftWrapperClass =
    step === 1 || step === 2
      ? "hidden md:flex md:w-1/2 items-center justify-center p-12"
      : isStep3
        ? "hidden md:flex md:w-1/2 items-center justify-center p-12"
        : isStep4
          ? "hidden md:flex md:w-1/2 relative items-center justify-center p-12  overflow-hidden"
        : "hidden md:flex md:w-1/2 relative items-center justify-center p-12  overflow-hidden";

  const rightWrapperClass =
    step === 1 || step === 2
      ? "w-full md:w-1/2 flex items-center justify-center px-6 md:px-12 py-12 bg-white overflow-y-auto"
      : isStep3
        ? "w-full md:w-1/2 flex items-center justify-center px-6 md:px-12 py-12 bg-white overflow-y-auto"
        : isStep4
          ? "w-full md:w-1/2 flex items-center justify-center px-6 md:px-12 py-12 bg-white overflow-y-auto"
        : "w-full md:w-1/2 flex items-center justify-center px-6 md:px-12 py-12 bg-white overflow-y-auto";

  const contentWidthClass = step === 1 || step === 2 ? "w-full max-w-137.5" : "max-w-md w-full mx-auto md:mx-0";

  const illustrationPath = `/scholarship-recommender/illustrations/step${step}.svg`;

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      <aside className={leftWrapperClass}>
        {(isStep3 || isStep4 || isStep5) && (
          <div className="pointer-events-none absolute top-0 left-0 w-full h-full">
            <div className="absolute w-125 h-125 rounded-full blur-3xl -top-20 -left-20" />
            <div className="absolute w-100 h-100 rounded-full blur-3xl bottom-10 right-10" />
          </div>
        )}

        <div className="w-full text-center relative z-10">
          <div className="w-full max-w-80 lg:max-w-105 mx-auto flex items-center justify-center">
            <img src={illustrationPath} alt={`Step ${step} illustration`} className="w-full h-auto drop-shadow-xl" />
          </div>
        </div>
      </aside>

      <section className={rightWrapperClass}>
        <div className={contentWidthClass}>
          <header className="mb-8 text-center md:text-left">
            <h1 className="mb-3 text-[28px] font-bold leading-[1.2] tracking-tight text-slate-900 md:text-[36px]">{title}</h1>
            <p className="text-[16px] text-slate-500">{subtitle}</p>
          </header>

          <div className="mb-10">{children}</div>
          <div className="mt-4">{actions}</div>
        </div>
      </section>
    </div>
  );
}

export default function ScholarshipRecommenderPage() {
  const [step, setStep] = useState<StepIndex>(1);
  const [state, setState] = useState<RecommenderState>(initialRecommenderState);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [shortlistedIds, setShortlistedIds] = useState<number[]>([]);
  const [academicScoreError, setAcademicScoreError] = useState("");

  const canContinue = useMemo(() => isStepValid(step, state), [step, state]);

  const updateState = <K extends keyof RecommenderState>(key: K, value: RecommenderState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const next = () => {
    if (step < 5 && canContinue) {
      setStep((prev) => (prev + 1) as StepIndex);
      return;
    }
    if (step === 5) {
      setStep(6);
    }
  };

  const back = () => {
    if (step > 1 && step <= 6) {
      setStep((prev) => (prev - 1) as StepIndex);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? recommendations.map((item) => item.id) : []);
  };

  const handleToggleCard = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleYesNoChange = (field: "willingEssay" | "willingInterview" | "willingGpa", value: "yes" | "no") => {
    updateState(field, value);
  };

  const validateAcademicScore = (
    scoreType: RecommenderState["academicScoreType"],
    score: string,
  ) => {
    if (!score.trim()) return "";

    const numericScore = Number(score);
    if (Number.isNaN(numericScore)) return "Enter a valid number.";
    if (numericScore < 0) return "Score cannot be less than 0.";
    if (scoreType === "gpa" && numericScore > 4) return "GPA cannot be greater than 4.";
    if (scoreType === "percentage" && numericScore > 100) return "Percentage cannot be greater than 100.";
    return "";
  };

  const handleAcademicScoreTypeChange = (value: RecommenderState["academicScoreType"]) => {
    updateState("academicScoreType", value);
    setAcademicScoreError(validateAcademicScore(value, state.academicScore));
  };

  const handleAcademicScoreChange = (value: string) => {
    if (value === "") {
      updateState("academicScore", "");
      setAcademicScoreError("");
      return;
    }

    updateState("academicScore", value);
    setAcademicScoreError(validateAcademicScore(state.academicScoreType, value));
  };

  if (step === 6) {
    return (
      <ResultsGrid
        items={recommendations}
        selectedIds={selectedIds}
        onToggleAll={handleSelectAll}
        onToggleOne={handleToggleCard}
        onNavigateToStep={(step) => setStep(step as StepIndex)}
        onShortlist={() => {
          setShortlistedIds((prev) => Array.from(new Set([...prev, ...selectedIds])));
          setStep(7);
        }}
      />
    );
  }

  if (step === 7) {
    return (
      <ShortlistView
        recommendedItems={recommendations}
        shortlistedIds={shortlistedIds}
        onToggleShortlist={(id) => {
          setShortlistedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
          );
        }}
        onBack={() => setStep(6)}
      />
    );
  }

  const currentStep = stepTitles[step];
  const commonContinueEnabled = step < 5 ? canContinue : true;

  const renderBackContinue = () => (
    <div className="flex gap-4.5 items-center mt-4">
      <button
        onClick={back}
        className="inline-flex items-center justify-center h-12 rounded-md text-[18px] font-semibold bg-white border border-[#d0d7e3] text-[#3f5474] w-32.5 hover:bg-[#f8fafc]"
      >
        Back
      </button>
      <button
        onClick={next}
        disabled={!commonContinueEnabled}
        className={`inline-flex items-center justify-center h-12 rounded-md text-[18px] font-semibold text-white w-43.75 ${
          commonContinueEnabled ? "bg-brand-blue hover:bg-brand-hover shadow-[0_4px_14px_0_rgba(37,99,235,0.25)]" : "bg-[#afbacc]"
        }`}
      >
        Continue
      </button>
    </div>
  );

  return (
    <StepShell
      title={currentStep.title}
      subtitle={currentStep.subtitle}
      step={step}
      actions={
        step === 1 ? (
          <div className="flex items-center mt-4">
            <button
              onClick={next}
              disabled={!canContinue}
              className={`w-full md:w-auto md:min-w-50 px-10 py-3.5 text-white font-bold text-[17px] rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                canContinue ? "bg-brand-blue hover:bg-brand-hover cursor-pointer" : "bg-[#b0b8c6] cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        ) : step === 5 ? (
          <div className="mt-5">
            <button
              type="button"
              onClick={next}
              className="w-full py-3 px-4 bg-brand-blue hover:bg-brand-hover text-white text-[1.125rem] font-medium rounded-md transition-colors duration-200"
            >
              Find Scholarship
            </button>
          </div>
        ) : (
          renderBackContinue()
        )
      }
    >
      {step === 1 && (
        <form className="flex flex-col gap-6 mb-10">
          <div className="flex flex-col gap-2">
            <label className="text-[16px] font-semibold text-[#1e293b]">What level are you currently studying?</label>
            <CustomSelect
              value={state.educationLevel}
              onChange={(value) => updateState("educationLevel", value)}
              placeholder="Select your education level"
              options={[
                { value: "high_school", label: "High School (10th/12th Grade)" },
                { value: "diploma", label: "Diploma / Certificate" },
                { value: "undergraduate", label: "Undergraduate (Bachelor's)" },
                { value: "postgraduate", label: "Postgraduate (Master's / PhD)" },
              ]}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[16px] font-semibold text-[#1e293b]">Study Mode Preference</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                ["full-time", "Full-time"],
                ["part-time", "Part-time"],
                ["either", "Either"],
                ["not-sure", "Not sure"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => updateState("studyMode", value as RecommenderState["studyMode"])}
                  className={`flex items-center justify-center p-3 border-2 rounded-md cursor-pointer transition-colors text-center text-[15px] font-medium ${
                    state.studyMode === value
                      ? "border-[#2563eb] bg-blue-50/50 text-[#1e40af]"
                      : "border-[#cbd5e1] text-[#334155] hover:bg-slate-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[16px] font-semibold text-[#1e293b]">What is your academic score?</label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="relative sm:col-span-1">
                <CustomSelect
                  value={state.academicScoreType}
                  onChange={(value) => handleAcademicScoreTypeChange(value as RecommenderState["academicScoreType"])}
                  options={[
                    { value: "gpa", label: "GPA" },
                    { value: "percentage", label: "Percentage" },
                  ]}
                  className="w-full"
                />
              </div>

              <input
                value={state.academicScore}
                onChange={(event) => handleAcademicScoreChange(event.target.value)}
                placeholder={
                  state.academicScoreType === "percentage"
                    ? "Enter percentage (max 100)"
                    : "Enter GPA (max 4.0)"
                }
                type="text"
                inputMode={state.academicScoreType === "percentage" ? "numeric" : "decimal"}
                pattern={state.academicScoreType === "percentage" ? "[0-9]*" : "[0-9]*[.]?[0-9]*"}
                disabled={!state.educationLevel}
                className="sm:col-span-2 w-full p-3.5 border-2 border-[#cbd5e1] rounded-md focus:border-[#2563eb] focus:ring-2 focus:ring-[#bfdbfe] focus:outline-none transition-all text-[16px] text-[#1e293b] bg-slate-50 disabled:opacity-60"
              />
            </div>
            {academicScoreError && (
              <p className="text-[12px] text-red-500">{academicScoreError}</p>
            )}
          
          </div>
        </form>
      )}

      {step === 2 && (
        <form className="flex flex-col gap-8 mb-10">
          <div className="flex flex-col gap-3">
            <label className="text-[16px] font-semibold text-[#1e293b]">Intended Field of Study</label>
            <CustomSelect
              value={state.fieldOfStudy}
              onChange={(value) => updateState("fieldOfStudy", value)}
              placeholder="Select your prospective major"
              options={[
                { value: "cs", label: "Computer Science & IT" },
                { value: "business", label: "Business & Management" },
                { value: "engineering", label: "Engineering" },
                { value: "medicine", label: "Medicine & Health Sciences" },
                { value: "arts", label: "Arts & Humanities" },
                { value: "law", label: "Law & Social Sciences" },
              ]}
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-[18px] font-bold text-[#0f172a] border-b border-slate-100 pb-2">Are you willing to:</h3>

            {[
              ["willingEssay", "Write scholarship essays?"],
              ["willingInterview", "Attend scholarship interviews?"],
              ["willingGpa", "Maintain minimum GPA requirement?"],
            ].map(([field, question]) => (
              <div key={field} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-[16px] font-medium text-[#334155]">{question}</span>
                <div className="flex gap-2">
                  {[
                    ["yes", "Yes"],
                    ["no", "No"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleYesNoChange(field as "willingEssay" | "willingInterview" | "willingGpa", value as "yes" | "no")}
                      className={`px-6 py-2 border-2 rounded-md text-center cursor-pointer transition-all font-semibold ${
                        state[field as keyof RecommenderState] === value
                          ? value === "yes"
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-red-500 bg-red-50 text-red-700"
                          : "border-slate-300 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </form>
      )}

      {step === 3 && (
        <form className="flex flex-col gap-6 mb-10 ">
          <div className="flex flex-col gap-2">
            <label className="text-[16px] font-semibold text-[#1e293b]">Your Province</label>
            <CustomSelect
              value={state.province}
              onChange={(value) => {
                updateState("province", value);
                updateState("district", "");
              }}
              placeholder="Select Province"
              options={NEPAL_PROVINCES.map((province) => ({
                value: province,
                label: province,
              }))}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[16px] font-semibold text-[#1e293b]">Your District</label>
            <CustomSelect
              value={state.district}
              onChange={(value) => updateState("district", value)}
              placeholder="Select District"
              options={
                state.province
                  ? (NEPAL_DISTRICTS[state.province as keyof typeof NEPAL_DISTRICTS] || []).map(
                      (district) => ({ value: district, label: district }),
                    )
                  : []
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[16px] font-semibold text-[#1e293b]">Are you planning to study:</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                ["inside", "Inside Nepal"],
                ["abroad", "Abroad"],
                ["both", "Both"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => updateState("studyLocation", value as RecommenderState["studyLocation"])}
                  className={`flex items-center justify-center px-3 py-3.5 border-2 rounded-md text-center cursor-pointer transition-all font-medium text-[15px] ${
                    state.studyLocation === value
                      ? "border-[#2563eb] bg-blue-50/50 text-[#1e40af]"
                      : "border-[#cbd5e1] text-[#334155] hover:bg-slate-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </form>
      )}

      {step === 4 && (
        <form className="flex flex-col gap-6 mb-10">
          <div className="flex flex-col gap-2">
            <label className="text-[16px] font-semibold text-[#1e293b]">Do you belong to any category?</label>
            <CustomSelect
              value={state.category}
              onChange={(value) => updateState("category", value)}
              placeholder="Select Category"
              options={[
                { value: "none", label: "None / General" },
                { value: "dalit", label: "Dalit" },
                { value: "janajati", label: "Adivasi / Janajati" },
                { value: "madhesi", label: "Madhesi" },
                { value: "muslim", label: "Muslim" },
                { value: "disabled", label: "Person with Disability" },
              ]}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[16px] font-semibold text-[#1e293b]">Gender</label>
            <CustomSelect
              value={state.gender}
              onChange={(value) => updateState("gender", value)}
              placeholder="Select gender"
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
                { value: "prefer_not_to_say", label: "Prefer not to say" },
              ]}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[16px] font-semibold text-[#1e293b]">Annual Family Income</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["below_2", "Below 2 lakh"],
                ["2_to_5", "2–5 lakh"],
                ["5_to_10", "5–10 lakh"],
                ["above_10", "Above 10 lakh"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => updateState("income", value as RecommenderState["income"])}
                  className={`h-full px-3 py-3.5 border-2 rounded-md flex items-center justify-center text-center cursor-pointer transition-all font-medium text-[15px] ${
                    state.income === value
                      ? "border-[#2563eb] bg-blue-50/50 text-[#1e40af]"
                      : "border-[#cbd5e1] text-[#334155] hover:bg-slate-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </form>
      )}

      {step === 5 && (
        <form className="space-y-6">
          <MultiSelect
            label="Talents / Skills (optional)"
            value={state.talents}
            onChange={(value) => updateState("talents", value)}
            options={[
              { value: "Programming / IT", label: "Programming / IT" },
              { value: "Public Speaking / Debate", label: "Public Speaking / Debate" },
              { value: "Arts / Creative Writing", label: "Arts / Creative Writing" },
              { value: "Athletics / Sports", label: "Athletics / Sports" },
              { value: "Music / Performing Arts", label: "Music / Performing Arts" },
              { value: "Other Skills", label: "Other Skills" },
            ]}
            placeholder="Select your talents"
          />

          <MultiSelect
            label="Achievements (optional)"
            value={state.achievements}
            onChange={(value) => updateState("achievements", value)}
            options={[
              { value: "Academic Excellence Awards", label: "Academic Excellence Awards" },
              { value: "National Level Sports", label: "National Level Sports" },
              { value: "Student Leadership Award", label: "Student Leadership Award" },
              { value: "Science / Math Olympiad", label: "Science / Math Olympiad" },
              { value: "Other Achievements", label: "Other Achievements" },
            ]}
            placeholder="Select your achievements"
          />

          <MultiSelect
            label="Are you involved in:"
            value={state.involvement}
            onChange={(value) => updateState("involvement", value)}
            options={[
              { value: "Community Service", label: "Community Service" },
              { value: "NGO Work", label: "NGO Work" },
              { value: "Student Clubs", label: "Student Clubs" },
              { value: "Entrepreneurship", label: "Entrepreneurship" },
              { value: "Family Business", label: "Family Business" },
              { value: "None", label: "None" },
            ]}
            placeholder="Select your involvement"
          />
        </form>
      )}
    </StepShell>
  );
}
