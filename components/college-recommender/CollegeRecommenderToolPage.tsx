"use client";

import React, { useMemo, useState } from "react";
import {
  apiService,
  CollegeRecommendation,
  CollegeRecommenderPayload,
} from "@/services/api";

interface CollegeRecommenderToolPageProps {
  onNavigate: (view: any, data?: any) => void;
}

const stepTitles: Record<number, string> = {
  1: "Which type of student are you?",
  2: "Future Plan",
  3: "Let's Talk Budget",
  4: "Location Preference",
  5: "Distance From Home",
  6: "Class Size Preference",
  7: "Academics vs Campus Life",
  8: "Activities & Sports",
  9: "Facilities & Infrastructure",
  10: "Money Matters",
};

const stepSubtitles: Partial<Record<number, string>> = {
  1: "Select what matches you best:",
  5: "How far are you comfortable going?",
  6: "I prefer:",
  7: "Choose one:",
  8: "Are clubs, sports, and competitions important to you?",
  9: "Which matters most?",
  10: "Is tuition cost your top deciding factor?",
};

const progressByStep: Record<number, string> = {
  1: "15%",
  2: "15%",
  3: "15%",
  4: "30%",
  5: "25%",
  6: "60%",
  7: "40%",
  8: "70%",
  9: "70%",
  10: "85%",
};

const stepImages: Record<number, string> = {
  1: "https://static.vecteezy.com/system/resources/previews/028/534/745/non_2x/finding-direction-flat-style-design-illustration-stock-illustration-vector.jpg",
  2: "https://img.freepik.com/premium-vector/student-graduation-cap-with-certificate_473272-326.jpg?semt=ais_hybrid&w=740&q=80",
  3: "https://us.123rf.com/450wm/fahmiruddinhidayat/fahmiruddinhidayat2407/fahmiruddinhidayat240700038/231063485-concept-of-account-mutation-or-financial-activity-banking-design-elements-customer-savings-book.jpg?ver=6",
  4: "https://images.template.net/101912/location-icon-clipart-5z262.jpg",
  5: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=900&q=80",
  6: "https://static.vecteezy.com/system/resources/thumbnails/022/243/690/small/female-teacher-or-professor-teaching-math-pointing-at-chalkboard-isolated-illustration-female-teacher-at-lesson-in-classroom-abstract-simple-drawing-in-modern-style-education-teaching-concept-vector.jpg",
  7: "https://static.vecteezy.com/system/resources/thumbnails/067/119/243/small/celebrating-academic-achievement-the-joy-of-graduation-and-embracing-future-opportunities-and-challenges-vector.jpg",
  8: "https://static.vecteezy.com/system/resources/thumbnails/060/456/286/small/male-athlete-with-vitiligo-doing-football-practice-concept-of-agility-coordination-and-sports-vector.jpg",
  9: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80",
  10: "https://static.vecteezy.com/system/resources/previews/034/465/385/non_2x/money-bag-with-coins-illustration-vector.jpg",
};

const studentTypeOptions = [
  {
    value: "academic",
    title: "Academic Topper",
    description: "I want strong academics, tough competition, and high GPA results.",
    icon: "fa-book-open",
  },
  {
    value: "campus",
    title: "Campus Life Lover",
    description: "I want fun events, clubs, networking, and active college life.",
    icon: "fa-music",
  },
  {
    value: "career",
    title: "Career-Focused Planner",
    description: "I care about internships, job placement, and future salary.",
    icon: "fa-briefcase",
  },
  {
    value: "balanced",
    title: "Balanced Explorer",
    description: "I want academics + social life + extracurricular activities",
    icon: "fa-shield-halved",
  },
];

const CollegeRecommenderToolPage: React.FC<CollegeRecommenderToolPageProps> = ({
  onNavigate,
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CollegeRecommendation[]>([]);

  const [form, setForm] = useState({
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
  });

  const canContinue = useMemo(() => {
    if (step === 1) return !!form.student_type;
    if (step === 2)
      return !!form.knows_course && !!form.preferred_field && !!form.reputation_importance;
    if (step === 3) return !!form.financial_support && !!form.yearly_budget;
    if (step === 4) return !!form.province && !!form.setting;
    if (step === 5) return !!form.distance_from_home;
    if (step === 6) return !!form.class_size;
    if (step === 7) return !!form.academics_vs_campus;
    if (step === 8) return !!form.activities_importance;
    if (step === 9) return !!form.facility_choice;
    if (step === 10) return !!form.tuition_factor;
    return false;
  }, [form, step]);

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

      const res = await apiService.getCollegeRecommenderRecommendations(payload);
      setResults(res.data?.recommendations || []);
      setStep(11);
    } finally {
      setLoading(false);
    }
  };

  const renderRadioOption = (
    checked: boolean,
    onClick: () => void,
    label: string,
    description?: string,
  ) => (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex w-full items-center rounded-xl border-2 p-4 text-left transition-all ${
        checked
          ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
          : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/40"
      }`}
    >
      <div
        className={`mr-4 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded border-2 ${
          checked ? "border-blue-600 bg-blue-600" : "border-slate-300"
        }`}
      >
        {checked ? <i className="fa-solid fa-check text-[10px] text-white"></i> : null}
      </div>
      <div>
        <p className="text-[15px] font-medium text-slate-800">{label}</p>
        {description ? <p className="mt-0.5 text-sm text-slate-500">{description}</p> : null}
      </div>
    </button>
  );

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {studentTypeOptions.map((option) => {
            const selected = form.student_type === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, student_type: option.value }))}
                className={`group relative flex h-full flex-col rounded-xl border-2 p-5 text-left transition-all duration-200 ${
                  selected
                    ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                    : "border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/50"
                }`}
              >
                <div
                  className={`absolute right-5 top-5 flex h-5 w-5 items-center justify-center rounded border-2 ${
                    selected ? "border-blue-600 bg-blue-600" : "border-slate-300"
                  }`}
                >
                  {selected ? <i className="fa-solid fa-check text-[10px] text-white"></i> : null}
                </div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-transform group-hover:scale-110">
                  <i className={`fa-solid ${option.icon} text-xl`}></i>
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-800">{option.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{option.description}</p>
              </button>
            );
          })}
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="space-y-8">
          <div>
            <p className="mb-3 text-base font-semibold text-slate-800">Do you know what you want to study?</p>
            <div className="space-y-3">
              {renderRadioOption(
                form.knows_course === "Yes, I know my course",
                () => setForm((prev) => ({ ...prev, knows_course: "Yes, I know my course" })),
                "Yes, I know my course",
              )}
              {renderRadioOption(
                form.knows_course === "Not sure yet",
                () => setForm((prev) => ({ ...prev, knows_course: "Not sure yet" })),
                "Not sure yet",
              )}
            </div>
          </div>

          <div>
            <label className="mb-3 block text-base font-semibold text-slate-800">Select your preferred field:</label>
            <select
              value={form.preferred_field}
              onChange={(e) => setForm((prev) => ({ ...prev, preferred_field: e.target.value }))}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Search or select your preferred field</option>
              <option value="Science (+2 Science / BSc / BIT / CSIT / Engineering)">
                Science (+2 Science / BSc / BIT / CSIT / Engineering)
              </option>
              <option value="Management (BBS / BBA / BBM / BHM)">
                Management (BBS / BBA / BBM / BHM)
              </option>
              <option value="Humanities / Law">Humanities / Law</option>
              <option value="Medical / Nursing / Pharmacy">Medical / Nursing / Pharmacy</option>
              <option value="IT / Computer">IT / Computer</option>
              <option value="Hotel Management">Hotel Management</option>
              <option value="Education">Education</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div>
            <p className="mb-3 text-base font-semibold text-slate-800">Is college reputation important to you?</p>
            <div className="space-y-3">
              {renderRadioOption(
                form.reputation_importance === "Yes, very important",
                () => setForm((prev) => ({ ...prev, reputation_importance: "Yes, very important" })),
                "Yes, very important",
              )}
              {renderRadioOption(
                form.reputation_importance === "Somewhat",
                () => setForm((prev) => ({ ...prev, reputation_importance: "Somewhat" })),
                "Somewhat",
              )}
              {renderRadioOption(
                form.reputation_importance === "Not important",
                () => setForm((prev) => ({ ...prev, reputation_importance: "Not important" })),
                "Not important",
              )}
            </div>
          </div>
        </div>
      );
    }

    if (step === 3) {
      return (
        <div className="space-y-8">
          <div>
            <p className="mb-3 text-[15px] font-semibold text-slate-700">Do you need financial support?</p>
            <div className="space-y-3">
              {renderRadioOption(
                form.financial_support === "Yes, I need scholarship / financial aid",
                () =>
                  setForm((prev) => ({
                    ...prev,
                    financial_support: "Yes, I need scholarship / financial aid",
                  })),
                "Yes, I need scholarship / financial aid",
              )}
              {renderRadioOption(
                form.financial_support === "No, I can manage full fees",
                () =>
                  setForm((prev) => ({ ...prev, financial_support: "No, I can manage full fees" })),
                "No, I can manage full fees",
              )}
            </div>
          </div>

          <div>
            <label className="mb-3 block text-[15px] font-bold text-slate-900">What is your yearly budget range?</label>
            <select
              value={form.yearly_budget}
              onChange={(e) => setForm((prev) => ({ ...prev, yearly_budget: e.target.value }))}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select budget</option>
              <option value="Under NPR 1,50,000">Under NPR 1,50,000</option>
              <option value="NPR 1,50,000 – 3,00,000">NPR 1,50,000 – 3,00,000</option>
              <option value="NPR 3,00,000 – 6,00,000">NPR 3,00,000 – 6,00,000</option>
              <option value="Above NPR 6,00,000">Above NPR 6,00,000</option>
            </select>
          </div>
        </div>
      );
    }

    if (step === 4) {
      return (
        <div className="space-y-7">
          <div>
            <label className="mb-3 block text-[15px] font-semibold text-slate-900">Which province do you prefer?</label>
            <select
              value={form.province}
              onChange={(e) => setForm((prev) => ({ ...prev, province: e.target.value }))}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Search or select your province</option>
              <option value="Bagmati">Bagmati</option>
              <option value="Province 1">Province 1</option>
              <option value="Madhesh">Madhesh</option>
              <option value="Gandaki">Gandaki</option>
              <option value="Lumbini">Lumbini</option>
              <option value="Karnali">Karnali</option>
              <option value="Sudurpashchim">Sudurpashchim</option>
              <option value="No preference">No preference</option>
            </select>
          </div>

          <div>
            <label className="mb-3 block text-[15px] font-semibold text-slate-900">Do you prefer:</label>
            <select
              value={form.setting}
              onChange={(e) => setForm((prev) => ({ ...prev, setting: e.target.value }))}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Search or select your setting</option>
              <option value="Kathmandu Valley">Kathmandu Valley</option>
              <option value="Outside Valley but city area">Outside Valley but city area</option>
              <option value="Near my hometown">Near my hometown</option>
              <option value="Anywhere">Anywhere</option>
            </select>
          </div>
        </div>
      );
    }

    if (step === 5) {
      return (
        <div className="space-y-3">
          {renderRadioOption(
            form.distance_from_home === "I want to stay at home (Day scholar)",
            () =>
              setForm((prev) => ({
                ...prev,
                distance_from_home: "I want to stay at home (Day scholar)",
              })),
            "I want to stay at home (Day scholar)",
          )}
          {renderRadioOption(
            form.distance_from_home === "Within 2–3 hours travel",
            () => setForm((prev) => ({ ...prev, distance_from_home: "Within 2–3 hours travel" })),
            "Within 2–3 hours travel",
          )}
          {renderRadioOption(
            form.distance_from_home === "Different city but same province",
            () =>
              setForm((prev) => ({
                ...prev,
                distance_from_home: "Different city but same province",
              })),
            "Different city but same province",
          )}
          {renderRadioOption(
            form.distance_from_home === "Anywhere in Nepal",
            () => setForm((prev) => ({ ...prev, distance_from_home: "Anywhere in Nepal" })),
            "Anywhere in Nepal",
          )}
        </div>
      );
    }

    if (step === 6) {
      return (
        <div className="space-y-3">
          {renderRadioOption(
            form.class_size === "Small class (more teacher attention)",
            () =>
              setForm((prev) => ({
                ...prev,
                class_size: "Small class (more teacher attention)",
              })),
            "Small class (more teacher attention)",
          )}
          {renderRadioOption(
            form.class_size === "Medium class",
            () => setForm((prev) => ({ ...prev, class_size: "Medium class" })),
            "Medium class",
          )}
          {renderRadioOption(
            form.class_size === "Large college with big batches",
            () =>
              setForm((prev) => ({
                ...prev,
                class_size: "Large college with big batches",
              })),
            "Large college with big batches",
          )}
        </div>
      );
    }

    if (step === 7) {
      return (
        <div className="space-y-3">
          {renderRadioOption(
            form.academics_vs_campus === "Academics matter more than fun",
            () =>
              setForm((prev) => ({
                ...prev,
                academics_vs_campus: "Academics matter more than fun",
              })),
            "Academics matter more than fun",
          )}
          {renderRadioOption(
            form.academics_vs_campus === "Campus life matters more",
            () =>
              setForm((prev) => ({ ...prev, academics_vs_campus: "Campus life matters more" })),
            "Campus life matters more",
          )}
          {renderRadioOption(
            form.academics_vs_campus === "Both equally important",
            () =>
              setForm((prev) => ({ ...prev, academics_vs_campus: "Both equally important" })),
            "Both equally important",
          )}
        </div>
      );
    }

    if (step === 8) {
      return (
        <div className="space-y-3">
          {renderRadioOption(
            form.activities_importance === "Yes",
            () => setForm((prev) => ({ ...prev, activities_importance: "Yes" })),
            "Yes",
          )}
          {renderRadioOption(
            form.activities_importance === "No",
            () => setForm((prev) => ({ ...prev, activities_importance: "No" })),
            "No",
          )}
          {renderRadioOption(
            form.activities_importance === "Somewhat",
            () => setForm((prev) => ({ ...prev, activities_importance: "Somewhat" })),
            "Somewhat",
          )}
        </div>
      );
    }

    if (step === 9) {
      return (
        <div className="space-y-3">
          {renderRadioOption(
            form.facility_choice === "Modern labs",
            () => setForm((prev) => ({ ...prev, facility_choice: "Modern labs" })),
            "Modern labs",
          )}
          {renderRadioOption(
            form.facility_choice === "Hostel facility",
            () => setForm((prev) => ({ ...prev, facility_choice: "Hostel facility" })),
            "Hostel facility",
          )}
          {renderRadioOption(
            form.facility_choice === "Library",
            () => setForm((prev) => ({ ...prev, facility_choice: "Library" })),
            "Library",
          )}
          {renderRadioOption(
            form.facility_choice === "Cafeteria quality",
            () => setForm((prev) => ({ ...prev, facility_choice: "Cafeteria quality" })),
            "Cafeteria quality",
          )}
          {renderRadioOption(
            form.facility_choice === "All of the above",
            () => setForm((prev) => ({ ...prev, facility_choice: "All of the above" })),
            "All of the above",
          )}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {renderRadioOption(
          form.tuition_factor === "Yes, low cost is very important",
          () =>
            setForm((prev) => ({ ...prev, tuition_factor: "Yes, low cost is very important" })),
          "Yes, low cost is very important",
        )}
        {renderRadioOption(
          form.tuition_factor === "I'm okay paying more for quality",
          () =>
            setForm((prev) => ({ ...prev, tuition_factor: "I'm okay paying more for quality" })),
          "I'm okay paying more for quality",
        )}
        {renderRadioOption(
          form.tuition_factor === "Depends on scholarship availability",
          () =>
            setForm((prev) => ({
              ...prev,
              tuition_factor: "Depends on scholarship availability",
            })),
          "Depends on scholarship availability",
        )}
      </div>
    );
  };

  if (step === 11) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-sky-50 px-6 py-10 lg:px-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">Tool Result</p>
              <h1 className="text-3xl font-black text-slate-900 md:text-4xl">Best matched colleges for you</h1>
            </div>
            <button
              onClick={() => setStep(10)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:border-blue-500 hover:text-blue-700"
            >
              Refine Answers
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {results.map((item) => (
              <article
                key={item.id}
                className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <h3 className="text-xl font-bold leading-tight text-slate-900">{item.name}</h3>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                    {item.match_score}/10 Match
                  </span>
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white">{item.location}</span>
                  <span className="rounded bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {item.type || "Institution"}
                  </span>
                </div>

                <ul className="mb-5 space-y-1 text-xs text-slate-600">
                  {item.reasons?.slice(0, 3).map((reason: string, idx: number) => (
                    <li key={idx}>- {reason}</li>
                  ))}
                </ul>

                <button
                  onClick={() => onNavigate("collegeProfile", { id: item.id })}
                  className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-slate-800"
                >
                  View College Profile
                </button>
              </article>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-800 md:flex-row">
      <div className="hidden min-h-screen items-center justify-center overflow-hidden border-r border-blue-100 bg-blue-50 p-8 md:flex md:w-5/12 lg:w-[40%]">
        <div className="relative flex w-full max-w-md items-center justify-center overflow-hidden rounded-2xl">
          <img
            src={stepImages[step] || stepImages[1]}
            alt="Step illustration"
            className="h-full w-full object-cover mix-blend-multiply"
          />
        </div>
      </div>

      <div className="flex min-h-screen w-full flex-col justify-start p-6 md:w-7/12 md:p-12 lg:w-[60%] lg:px-24 xl:px-32">
        <div className="mx-auto w-full max-w-2xl">
          <div className="mb-10 flex items-center">
            <button
              onClick={() => (step === 1 ? onNavigate("educationPage") : setStep((prev) => Math.max(1, prev - 1)))}
              className="mr-4 rounded-full p-1 text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
            >
              <i className="fa-solid fa-chevron-left text-lg"></i>
            </button>
            <div className="h-2 flex-1 overflow-hidden rounded-full border border-blue-200 bg-blue-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                style={{ width: progressByStep[step] || "100%" }}
              ></div>
            </div>
          </div>

          <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            {stepTitles[step]}
          </h1>
          {stepSubtitles[step] ? (
            <p className="mb-8 text-lg font-medium text-slate-500">{stepSubtitles[step]}</p>
          ) : null}

          {renderStepContent()}

          <div className="mt-10">
            {step < 10 ? (
              <button
                onClick={() => setStep((prev) => Math.min(10, prev + 1))}
                disabled={!canContinue}
                className={`rounded-lg px-8 py-3 font-semibold transition-all duration-300 ${
                  canContinue
                    ? "cursor-pointer bg-blue-600 text-white shadow-md hover:bg-blue-700"
                    : "cursor-not-allowed bg-slate-300 text-slate-50"
                }`}
              >
                Next
              </button>
            ) : (
              <button
                onClick={fetchRecommendations}
                disabled={!canContinue || loading}
                className="rounded-lg bg-slate-900 px-8 py-3 font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Generating..." : "Find Colleges"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeRecommenderToolPage;
