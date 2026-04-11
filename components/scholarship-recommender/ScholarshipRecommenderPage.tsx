"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { initialRecommenderState, recommendations } from "./data";
import ResultsGrid from "@/components/scholarship-recommender/ResultsGrid";
import { RecommenderState, StepIndex } from "./types";

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
    title: "Location & Citizenship",
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
      ? "hidden md:flex md:w-1/2 bg-[#e0f2fe] items-center justify-center p-12 border-r border-blue-100"
      : isStep3
        ? "hidden md:flex md:w-1/2 bg-[#e0f2fe] items-center justify-center p-12 border-r border-blue-100"
        : isStep4
          ? "hidden md:flex md:w-1/2 relative bg-[#ebf3ff] items-center justify-center p-12 border-r border-blue-100 overflow-hidden"
        : "hidden md:flex md:w-1/2 relative bg-[#e0f2fe] items-center justify-center p-12 border-r border-blue-100 overflow-hidden";

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
            <div className="absolute w-125 h-125 bg-blue-400/20 rounded-full blur-3xl -top-20 -left-20" />
            <div className="absolute w-100 h-100 bg-indigo-400/20 rounded-full blur-3xl bottom-10 right-10" />
          </div>
        )}

        <div className="w-full text-center relative z-10">
          {step === 1 && (
            <img src={illustrationPath} alt="Education journey illustration" className="w-full max-w-125 h-auto mx-auto mb-8" />
          )}

          {step === 2 && (
            <div className="max-w-4/5 max-h-[70vh] flex items-center justify-center mx-auto">
              <img src={illustrationPath} alt="Study preferences illustration" className="w-full h-auto" />
            </div>
          )}

          {step === 3 && (
            <div className="relative z-10 w-full max-w-65 lg:max-w-80 flex items-center justify-center mx-auto">
              <img src={illustrationPath} alt="Location and citizenship illustration" className="w-full h-auto drop-shadow-xl" />
            </div>
          )}

          {step === 4 && (
            <div className="relative z-10 w-full max-w-80 lg:max-w-105 flex items-center justify-center mx-auto">
              <img src={illustrationPath} alt="Demographics illustration" className="w-full h-auto drop-shadow-xl" />
            </div>
          )}

          {step === 5 && (
            <div className="relative z-10 w-full max-w-70 lg:max-w-90 flex items-center justify-center mx-auto">
              <img src={illustrationPath} alt="Experience and achievements illustration" className="w-full h-auto drop-shadow-xl" />
            </div>
          )}
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
  const [academicScoreError, setAcademicScoreError] = useState("");
  const [openOptionGroups, setOpenOptionGroups] = useState<
    Record<"talents" | "achievements" | "involvement", boolean>
  >({
    talents: true,
    achievements: false,
    involvement: false,
  });

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

  const toggleArrayField = (field: "talents" | "achievements" | "involvement", value: string) => {
    setState((prev) => {
      const list = prev[field];
      const exists = list.includes(value);
      return {
        ...prev,
        [field]: exists ? list.filter((item) => item !== value) : [...list, value],
      };
    });
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

  const toggleOptionGroup = (groupKey: "talents" | "achievements" | "involvement") => {
    setOpenOptionGroups((prev) => ({ ...prev, [groupKey]: !prev[groupKey] }));
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
      />
    );
  }

  const currentStep = stepTitles[step];
  const commonContinueEnabled = step < 5 ? canContinue : true;

  const renderBackContinue = () => (
    <div className="flex gap-4.5 items-center mt-4">
      <button
        onClick={back}
        className="inline-flex items-center justify-center h-12 rounded-lg text-[18px] font-semibold bg-white border border-[#d0d7e3] text-[#3f5474] w-32.5 hover:bg-[#f8fafc]"
      >
        Back
      </button>
      <button
        onClick={next}
        disabled={!commonContinueEnabled}
        className={`inline-flex items-center justify-center h-12 rounded-lg text-[18px] font-semibold text-white w-43.75 ${
          commonContinueEnabled ? "bg-[#2563eb] hover:bg-[#1d4ed8] shadow-[0_4px_14px_0_rgba(37,99,235,0.25)]" : "bg-[#afbacc]"
        }`}
      >
        Continue
      </button>
    </div>
  );

  const renderCheckboxBlock = (group: {
    key: "talents" | "achievements" | "involvement";
    label: string;
    values: string[];
    optional?: boolean;
  }) => {
    const selectedCount = state[group.key].length;
    const isOpen = openOptionGroups[group.key];

    return (
      <div className="flex flex-col gap-2" key={group.key}>
      <label className="text-[15px] font-semibold text-slate-700">
        {group.label} {group.optional && <span className="text-slate-400 font-normal">(optional)</span>}
      </label>
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleOptionGroup(group.key)}
          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors"
        >
          <span className="text-[14px] font-medium text-slate-600">
            {selectedCount > 0 ? `${selectedCount} selected` : "Select options"}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        <div className={`${isOpen ? "block" : "hidden"} border-t border-slate-100 p-2`}>
          <div className="grid grid-cols-1 gap-1">
            {group.values.map((item) => {
              const isChecked = state[group.key].includes(item);

              return (
                <label
                  key={item}
                  className="flex items-center px-3 py-2 hover:bg-slate-50 cursor-pointer transition-colors rounded-md"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleArrayField(group.key, item)}
                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                  />
                  <span className="ml-3 text-[15px] text-slate-700">{item}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
    );
  };
  const stepOneButtonEnabled = canContinue;

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
              className={`w-full md:w-auto md:min-w-50 px-10 py-3.5 text-white font-bold text-[17px] rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                canContinue ? "bg-[#2563eb] hover:bg-[#1d4ed8] cursor-pointer" : "bg-[#b0b8c6] cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        ) : step === 5 ? (
          <div className="mt-8">
            <button
              type="button"
              onClick={next}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-[1.125rem] font-medium rounded-xs transition-colors duration-200"
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
            <div className="relative">
              <select
                value={state.educationLevel}
                onChange={(event) => updateState("educationLevel", event.target.value)}
                className="w-full appearance-none p-3.5 pr-11 border-2 border-[#cbd5e1] rounded-lg focus:border-[#2563eb] focus:ring-2 focus:ring-[#bfdbfe] focus:outline-none transition-all text-[16px] text-[#1e293b] bg-white"
              >
                <option value="">Select your education level</option>
                <option value="high_school">High School (10th/12th Grade)</option>
                <option value="diploma">Diploma / Certificate</option>
                <option value="undergraduate">Undergraduate (Bachelor&apos;s)</option>
                <option value="postgraduate">Postgraduate (Master&apos;s / PhD)</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-600" />
            </div>
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
                  className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-colors text-center text-[15px] font-medium ${
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
                <select
                  value={state.academicScoreType}
                  onChange={(event) => handleAcademicScoreTypeChange(event.target.value as RecommenderState["academicScoreType"])}
                  className="w-full appearance-none p-3.5 pr-11 border-2 border-[#cbd5e1] rounded-lg focus:border-[#2563eb] focus:ring-2 focus:ring-[#bfdbfe] focus:outline-none transition-all text-[16px] text-[#1e293b] bg-white"
                >
                  <option value="gpa">GPA</option>
                  <option value="percentage">Percentage</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-600" />
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
                className="sm:col-span-2 w-full p-3.5 border-2 border-[#cbd5e1] rounded-lg focus:border-[#2563eb] focus:ring-2 focus:ring-[#bfdbfe] focus:outline-none transition-all text-[16px] text-[#1e293b] bg-slate-50 disabled:opacity-60"
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
            <div className="relative">
              <select
                value={state.fieldOfStudy}
                onChange={(event) => updateState("fieldOfStudy", event.target.value)}
                className="w-full appearance-none p-3.5 pr-11 border-2 border-[#cbd5e1] rounded-xl focus:border-[#2563eb] focus:ring-4 focus:ring-blue-50 focus:outline-none transition-all text-[16px] text-[#1e293b] bg-white"
              >
                <option value="">Select your prospective major</option>
                <option value="cs">Computer Science & IT</option>
                <option value="business">Business & Management</option>
                <option value="engineering">Engineering</option>
                <option value="medicine">Medicine & Health Sciences</option>
                <option value="arts">Arts & Humanities</option>
                <option value="law">Law & Social Sciences</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-600" />
            </div>
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
                      className={`px-6 py-2 border-2 rounded-lg text-center cursor-pointer transition-all font-semibold ${
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
            <div className="relative">
              <select
                value={state.province}
                onChange={(event) => updateState("province", event.target.value)}
                className="w-full appearance-none p-3.5 pr-11 border-2 border-[#cbd5e1] rounded-lg focus:border-[#2563eb] focus:ring-2 focus:ring-[#bfdbfe] focus:outline-none transition-all text-[16px] text-[#1e293b] bg-white"
              >
                <option value="">Select Province</option>
                <option value="koshi">Koshi Province</option>
                <option value="madhesh">Madhesh Province</option>
                <option value="bagmati">Bagmati Province</option>
                <option value="gandaki">Gandaki Province</option>
                <option value="lumbini">Lumbini Province</option>
                <option value="karnali">Karnali Province</option>
                <option value="sudurpashchim">Sudurpashchim Province</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-600" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[16px] font-semibold text-[#1e293b]">Your District</label>
            <div className="relative">
              <select
                value={state.district}
                onChange={(event) => updateState("district", event.target.value)}
                className="w-full appearance-none p-3.5 pr-11 border-2 border-[#cbd5e1] rounded-lg focus:border-[#2563eb] focus:ring-2 focus:ring-[#bfdbfe] focus:outline-none transition-all text-[16px] text-[#1e293b] bg-white"
              >
                <option value="">Select District</option>
                <option value="kathmandu">Kathmandu</option>
                <option value="bhaktapur">Bhaktapur</option>
                <option value="lalitpur">Lalitpur</option>
                <option value="kaski">Kaski</option>
                <option value="chitwan">Chitwan</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-600" />
            </div>
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
                  className={`flex items-center justify-center px-3 py-3.5 border-2 rounded-lg text-center cursor-pointer transition-all font-medium text-[15px] ${
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
            <div className="relative">
              <select
                value={state.category}
                onChange={(event) => updateState("category", event.target.value)}
                className="w-full appearance-none p-3.5 pr-11 border-2 border-[#cbd5e1] rounded-lg focus:border-[#2563eb] focus:ring-2 focus:ring-[#bfdbfe] focus:outline-none transition-all text-[16px] text-[#1e293b] bg-white"
              >
                <option value="">Select Category</option>
                <option value="none">None / General</option>
                <option value="dalit">Dalit</option>
                <option value="janajati">Adivasi / Janajati</option>
                <option value="madhesi">Madhesi</option>
                <option value="muslim">Muslim</option>
                <option value="disabled">Person with Disability</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-600" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[16px] font-semibold text-[#1e293b]">Gender</label>
            <div className="relative">
              <select
                value={state.gender}
                onChange={(event) => updateState("gender", event.target.value)}
                className="w-full appearance-none p-3.5 pr-11 border-2 border-[#cbd5e1] rounded-lg focus:border-[#2563eb] focus:ring-2 focus:ring-[#bfdbfe] focus:outline-none transition-all text-[16px] text-[#1e293b] bg-white"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-600" />
            </div>
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
                  className={`h-full px-3 py-3.5 border-2 rounded-lg flex items-center justify-center text-center cursor-pointer transition-all font-medium text-[15px] ${
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
        <form className="space-y-8">
          {renderCheckboxBlock({
            key: "talents",
            label: "Talents / Skills",
            values: [
              "Programming / IT",
              "Public Speaking / Debate",
              "Arts / Creative Writing",
              "Athletics / Sports",
              "Music / Performing Arts",
              "Other Skills",
            ],
            optional: true,
          })}

          {renderCheckboxBlock({
            key: "achievements",
            label: "Achievements",
            values: [
              "Academic Excellence Awards",
              "National Level Sports",
              "Student Leadership Award",
              "Science / Math Olympiad",
              "Other Achievements",
            ],
            optional: true,
          })}

          {renderCheckboxBlock({
            key: "involvement",
            label: "Are you involved in:",
            values: ["Community Service", "NGO Work", "Student Clubs", "Entrepreneurship", "Family Business", "None"],
          })}
        </form>
      )}
    </StepShell>
  );
}
