"use client";

import { CollegeRecommenderForm } from "./CollegeRecommenderToolPage";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import Step5 from "./steps/Step5";
import Step6 from "./steps/Step6";
import Step7 from "./steps/Step7";
import Step8 from "./steps/Step8";
import Step9 from "./steps/Step9";
import Step10 from "./steps/Step10";

interface RightPanelProps {
  step: number;
  setStep: (step: number) => void;
  form: CollegeRecommenderForm;
  handleInputChange: (field: keyof CollegeRecommenderForm, value: string) => void;
  canContinue: (step: number) => boolean;
  fetchRecommendations: () => void;
  loading: boolean;
  stepTitles: Record<number, string>;
  onNavigate: (view: any, data?: any) => void;
}

export default function RightPanel({
  step,
  setStep,
  form,
  handleInputChange,
  canContinue,
  fetchRecommendations,
  loading,
  stepTitles,
  onNavigate,
}: RightPanelProps) {
  const renderStepContent = () => {
    const commonProps = { form, handleInputChange };
    
    switch (step) {
      case 1:
        return <Step1 {...commonProps} />;
      case 2:
        return <Step2 {...commonProps} />;
      case 3:
        return <Step3 {...commonProps} />;
      case 4:
        return <Step4 {...commonProps} />;
      case 5:
        return <Step5 {...commonProps} />;
      case 6:
        return <Step6 {...commonProps} />;
      case 7:
        return <Step7 {...commonProps} />;
      case 8:
        return <Step8 {...commonProps} />;
      case 9:
        return <Step9 {...commonProps} />;
      case 10:
        return <Step10 {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full flex-1 flex-col justify-between overflow-y-visible pl-4 pr-0 py-8 lg:pt-20">
      <div className="w-full max-w-[1400px]">
        <div className="mb-6">
          <h1 className="mb-2 text-2xl font-bold leading-tight tracking-tight text-[#0f172a] sm:text-[2rem]">
            {stepTitles[step]}
          </h1>
        </div>

        {renderStepContent()}

        <div className="mt-8 flex items-center gap-4">
          {step > 1 && (
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              className="rounded-lg border border-[#cbd5e1] bg-white px-8 py-3.5 text-sm font-semibold text-[#475569] transition-all duration-300 hover:border-[#0f172a] hover:text-[#0f172a]"
            >
              Back
            </button>
          )}
          {step < 10 ? (
            <button
              onClick={() => setStep(Math.min(10, step + 1))}
              disabled={!canContinue(step)}
              className={`rounded-lg px-8 py-3.5 text-sm font-semibold transition-all duration-300 ${
                canContinue(step)
                  ? "cursor-pointer bg-brand-blue text-white hover:bg-brand-hover"
                  : "cursor-not-allowed bg-slate-100 text-slate-400"
              }`}
            >
              Continue
            </button>
          ) : (
            <button
              onClick={fetchRecommendations}
              disabled={!canContinue(step) || loading}
              className={`rounded-lg px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#1d4ed8] ${
                canContinue(step) && !loading
                  ? "bg-brand-blue cursor-pointer"
                  : "bg-slate-300 cursor-not-allowed"
              }`}
            >
              {loading ? "Loading..." : "Find Colleges"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}