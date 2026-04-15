"use client";

import React, { useState } from 'react'
import Image from 'next/image'
import {
  BookOpen,
  Music,
  Briefcase,
  Compass,
  Check,
  ChevronDown,
  ChevronRight,
  Star,
  Banknote,
  TrendingUp,
  MapPin,
  Filter,
  Building2,
  X,
} from 'lucide-react'
import Step1 from './steps/Step1'
import Step2 from './steps/Step2'
import Step3 from './steps/Step3'
import Step4 from './steps/Step4'
import Step5 from './steps/Step5'
import Step6 from './steps/Step6'
import Step7 from './steps/Step7'
import Step8 from './steps/Step8'
import Step9 from './steps/Step9'
import Step10 from './steps/Step10'
import ResultsPage from './ResultsPage'

import {
  apiService,
  CollegeRecommendation,
  CollegeRecommenderPayload,
} from '@/services/api'

interface CollegeRecommenderToolPageProps {
  onNavigate: (view: any, data?: any) => void;
}

const stepTitles: Record<number, string> = {
  1: "Which type of student are you?",
  2: "Let's Talk Budget",
  3: "Future Plan",
  4: "Location Preference",
  5: "Distance From Home",
  6: "Class Size Preference",
  7: "Academics vs Campus Life",
  8: "Activities & Sports",
  9: "Facilities & Infrastructure",
  10: "Money Matters",
};

const stepImages: Record<number, string> = {
  1: "/college-recommender/one.svg",
  2: "/college-recommender/two.svg",
  3: "/mirror.svg",
  4: "/college-recommender/four.svg",
  5: "/college-recommender/five.svg",
  6: "/teacher.svg",
  7: "/college-recommender/seven.svg",
  8: "/college-recommender/eight.svg",
  9: "/college-recommender/nine.svg",
  10: "/college-recommender/ten.svg",
};

export const studentTypeOptions = [
  {
    id: "academic",
    title: "Academic Topper",
    description:
      "I want strong academics, tough competition, and high GPA results.",
    icon: BookOpen,
    bgColor: "bg-brand-blue/10",
    iconColor: "text-brand-blue",
    hoverBorder: "hover:border-brand-blue",
  },
  {
    id: "campus_life",
    title: "Campus Life Lover",
    description:
      "I want fun events, clubs, networking, and active college life.",
    icon: Music,
    bgColor: "bg-pink-50",
    iconColor: "text-pink-500",
    hoverBorder: "hover:border-pink-200",
  },
  {
    id: "career",
    title: "Career-Focused Planner",
    description: "I care about internships, job placement, and future salary.",
    icon: Briefcase,
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
    hoverBorder: "hover:border-purple-200",
  },
  {
    id: "balanced",
    title: "Balanced Explorer",
    description: "I want academics + social life + extracurricular activities",
    icon: Compass,
    bgColor: "bg-orange-50",
    iconColor: "text-orange-500",
    hoverBorder: "hover:border-orange-200",
  },
];

export interface CollegeRecommenderForm {
  student_type: string;
  knows_course: string;
  preferred_field: string;
  reputation_importance: string;
  financial_support: string;
  yearly_budget: string;
  province: string;
  setting: string;
  distance_from_home: string;
  class_size: string;
  academics_vs_campus: string;
  activities_importance: string;
  facility_choice: string;
  tuition_factor: string;
}

export const initialForm: CollegeRecommenderForm = {
  student_type: "",
  knows_course: "",
  preferred_field: "",
  reputation_importance: "",
  financial_support: "",
  yearly_budget: "",
  province: "",
  setting: "",
  distance_from_home: "",
  class_size: "",
  academics_vs_campus: "",
  activities_importance: "",
  facility_choice: "",
  tuition_factor: "",
};

export { stepTitles, stepImages };

const CollegeRecommenderToolPage: React.FC<CollegeRecommenderToolPageProps> = ({
  onNavigate,
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CollegeRecommendation[]>([]);

  const [previewId, setPreviewId] = useState<number | string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number | string>>(
    new Set(),
  );
  const [expandedMatchId, setExpandedMatchId] = useState<
    number | string | null
  >(null);
  const [isRefineModalOpen, setIsRefineModalOpen] = useState(false);

  const toggleSelection = (id: number | string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const [form, setForm] = useState<CollegeRecommenderForm>(initialForm);

  const handleInputChange = (field: keyof CollegeRecommenderForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const canContinue = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!form.student_type;
      case 2:
        return !!form.financial_support && !!form.yearly_budget;
      case 3:
        return !!form.knows_course && !!form.preferred_field && !!form.reputation_importance;
      case 4:
        return !!form.province && !!form.setting;
      case 5:
        return !!form.distance_from_home;
      case 6:
        return !!form.class_size;
      case 7:
        return !!form.academics_vs_campus;
      case 8:
        return !!form.activities_importance;
      case 9:
        return !!form.facility_choice;
      case 10:
        return !!form.tuition_factor;
      default:
        return false;
    }
  };

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const payload: CollegeRecommenderPayload = {
        student_type: form.student_type,
        program_interest: form.preferred_field,
        preferred_location: `${form.province}, ${form.setting}, ${form.distance_from_home}`,
        budget_preference: `${form.yearly_budget}; ${form.tuition_factor}`,
        campus_life_priority: `${form.academics_vs_campus}; ${form.activities_importance}; ${form.facility_choice}`,
        career_goal: form.reputation_importance,
        need_scholarship:
          form.financial_support.startsWith("Yes") ||
          form.tuition_factor.includes("scholarship"),
        preferred_mode: form.class_size,
        college_type: form.preferred_field,
        final_priority: form.knows_course,
      };

      const res =
        await apiService.getCollegeRecommenderRecommendations(payload);
      setResults(res.data?.recommendations || []);
      setStep(11);
    } finally {
      setLoading(false);
    }
  };

  if (step === 11) {
    return (
      <ResultsPage
        results={results}
        previewId={previewId}
        setPreviewId={setPreviewId}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        expandedMatchId={expandedMatchId}
        setExpandedMatchId={setExpandedMatchId}
        isRefineModalOpen={isRefineModalOpen}
        setIsRefineModalOpen={setIsRefineModalOpen}
        toggleSelection={toggleSelection}
        onNavigate={onNavigate}
        onRefine={() => setStep(10)}
        tution={form.yearly_budget}
      />
    );
  }

  return (
    <div className='flex flex-col overflow-visible bg-white text-slate-800 lg:flex-row'>
      {step === 1 && (
        <Step1
          step={step}
          stepImages={stepImages}
          form={form}
          handleInputChange={handleInputChange}
          stepTitles={stepTitles}
          canContinue={canContinue}
          setStep={setStep}
        />
      )}
      {step === 2 && (
        <Step2
          step={step}
          stepImages={stepImages}
          form={form}
          handleInputChange={handleInputChange}
          stepTitles={stepTitles}
          canContinue={canContinue}
          setStep={setStep}
        />
      )}
      {step === 3 && (
        <Step3
          step={step}
          stepImages={stepImages}
          form={form}
          handleInputChange={handleInputChange}
          stepTitles={stepTitles}
          canContinue={canContinue}
          setStep={setStep}
        />
      )}
      {step === 4 && (
        <Step4
          step={step}
          stepImages={stepImages}
          form={form}
          handleInputChange={handleInputChange}
          stepTitles={stepTitles}
          canContinue={canContinue}
          setStep={setStep}
        />
      )}
      {step === 5 && (
        <Step5
          step={step}
          stepImages={stepImages}
          form={form}
          handleInputChange={handleInputChange}
          stepTitles={stepTitles}
          canContinue={canContinue}
          setStep={setStep}
        />
      )}
      {step === 6 && (
        <Step6
          step={step}
          stepImages={stepImages}
          form={form}
          handleInputChange={handleInputChange}
          stepTitles={stepTitles}
          canContinue={canContinue}
          setStep={setStep}
        />
      )}
      {step === 7 && (
        <Step7
          step={step}
          stepImages={stepImages}
          form={form}
          handleInputChange={handleInputChange}
          stepTitles={stepTitles}
          canContinue={canContinue}
          setStep={setStep}
        />
      )}
      {step === 8 && (
        <Step8
          step={step}
          stepImages={stepImages}
          form={form}
          handleInputChange={handleInputChange}
          stepTitles={stepTitles}
          canContinue={canContinue}
          setStep={setStep}
        />
      )}
      {step === 9 && (
        <Step9
          step={step}
          stepImages={stepImages}
          form={form}
          handleInputChange={handleInputChange}
          stepTitles={stepTitles}
          canContinue={canContinue}
          setStep={setStep}
        />
      )}
      {step === 10 && (
        <Step10
          step={step}
          stepImages={stepImages}
          form={form}
          handleInputChange={handleInputChange}
          stepTitles={stepTitles}
          canContinue={canContinue}
          setStep={setStep}
          fetchRecommendations={fetchRecommendations}
          loading={loading}
        />
      )}
    </div>
  );
};

export default CollegeRecommenderToolPage;