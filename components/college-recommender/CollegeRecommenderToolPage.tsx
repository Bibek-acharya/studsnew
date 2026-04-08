"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import {
  BookOpen,
  Music,
  Briefcase,
  Compass,
  Check,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Star,
  MapPin,
  Banknote,
  TrendingUp,
  Building2,
  X,
  Filter,
} from "lucide-react";
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
  1: "10%",
  2: "20%",
  3: "30%",
  4: "40%",
  5: "50%",
  6: "60%",
  7: "70%",
  8: "80%",
  9: "90%",
  10: "95%",
};

const stepImages: Record<number, string> = {
  1: "/foucs.svg",
  2: "/growth.svg",
  3: "/mirror.svg",
  4: "/location.svg",
  5: "/home.svg",
  6: "/teacher.svg",
  7: "/notes.svg",
  8: "/sports.svg",
  9: "/list.svg",
  10: "/money.svg",
};

const studentTypeOptions = [
  {
    id: "academic",
    title: "Academic Topper",
    description:
      "I want strong academics, tough competition, and high GPA results.",
    icon: BookOpen,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    hoverBorder: "hover:border-blue-200",
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

const Dropdown: React.FC<{
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder: string;
}> = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded-xl border-2 px-6 py-4.5 text-left transition-all duration-200 ${
          isOpen
            ? "border-blue-600 bg-white ring-1 ring-blue-600 shadow-md"
            : "border-slate-200 bg-white hover:border-slate-300"
        }`}
      >
        <span
          className={`text-[16px] font-medium transition-colors ${
            value ? "text-slate-900" : "text-slate-400"
          }`}
        >
          {value || placeholder}
        </span>
        <ChevronDown
          className={`h-5 w-5 text-slate-400 transition-all duration-300 ${
            isOpen ? "rotate-180 text-blue-600" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-60"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute top-[calc(100%+12px)] left-0 z-70 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="max-h-75 overflow-y-auto py-2">
              {options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                  }}
                  className={`w-full px-6 py-4 text-left text-[15px] transition-all hover:bg-slate-50 ${
                    value === opt
                      ? "bg-blue-50/80 font-bold text-blue-700 decoration-blue-700/30 underline-offset-4"
                      : "text-slate-700 font-medium hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {opt}
                    {value === opt && (
                      <Check className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const CollegeRecommenderToolPage: React.FC<CollegeRecommenderToolPageProps> = ({
  onNavigate,
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CollegeRecommendation[]>([]);

  // Result Page UI State
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

  const handleInputChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const canContinue = useMemo(() => {
    if (step === 1) return !!form.student_type;
    if (step === 2)
      return (
        !!form.knows_course &&
        !!form.preferred_field &&
        !!form.reputation_importance
      );
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

      const res =
        await apiService.getCollegeRecommenderRecommendations(payload);
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
      className={`group relative flex w-full items-center rounded-xl border-2 p-5 text-left transition-all duration-200 ${
        checked
          ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
      }`}
    >
      <div
        className={`mr-4 flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded border-2 transition-all duration-300 ${
          checked ? "border-blue-600 bg-blue-600" : "border-slate-300 bg-white"
        }`}
      >
        <Check
          className={`h-4 w-4 text-white transition-all duration-300 ${
            checked ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
        />
      </div>
      <div>
        <p
          className={`text-[15px] font-semibold transition-colors ${
            checked ? "text-blue-700" : "text-slate-700"
          }`}
        >
          {label}
        </p>
        {description ? (
          <p className="mt-0.5 text-sm text-slate-500">{description}</p>
        ) : null}
      </div>
    </button>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {studentTypeOptions.map((option) => (
                <label
                  key={option.id}
                  className={`group relative flex cursor-pointer flex-col rounded-3xl border-2 p-7 transition-all duration-300 hover:shadow-xl ${
                    form.student_type === option.id
                      ? "border-blue-600 bg-white ring-1 ring-blue-600 shadow-blue-600/10 shadow-xl"
                      : "border-slate-100 bg-white hover:border-blue-200"
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
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 ${
                      form.student_type === option.id
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                        : "bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500"
                    }`}
                  >
                    <option.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-slate-900 leading-tight">
                    {option.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-slate-500 group-hover:text-slate-600 italic">
                    {option.description}
                  </p>
                  <div
                    className={`absolute top-7 right-7 flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                      form.student_type === option.id
                        ? "border-blue-600 bg-blue-600 scale-100 shadow-md"
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

      case 2: // Future Plan
        return (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="mt-10 space-y-10">
              <div className="space-y-5">
                <p className="text-[17px] font-bold text-slate-900 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs">
                    1
                  </span>
                  Do you know what you want to study?
                </p>
                <div className="flex flex-wrap gap-4">
                  {["Yes, I know my course", "Not sure yet"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleInputChange("knows_course", opt)}
                      className={`rounded-2xl border-2 px-8 py-4 text-[15px] font-bold transition-all duration-300 ${
                        form.knows_course === opt
                          ? "border-blue-600 bg-blue-50 text-blue-700 shadow-md shadow-blue-600/5 ring-1 ring-blue-600"
                          : "border-slate-100 bg-white text-slate-500 hover:border-slate-200 hover:text-slate-700 hover:bg-slate-50/50"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <p className="text-[17px] font-bold text-slate-900 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs">
                    2
                  </span>
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
                  placeholder="Search or select field"
                />
              </div>

              <div className="space-y-5">
                <p className="text-[17px] font-bold text-slate-900 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs">
                    3
                  </span>
                  Is college reputation important to you?
                </p>
                <div className="flex flex-wrap gap-4">
                  {["Yes, very important", "Somewhat", "Not important"].map(
                    (opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() =>
                          handleInputChange("reputation_importance", opt)
                        }
                        className={`rounded-2xl border-2 px-8 py-4 text-[15px] font-bold transition-all duration-300 ${
                          form.reputation_importance === opt
                            ? "border-blue-600 bg-blue-50 text-blue-700 shadow-md shadow-blue-600/5 ring-1 ring-blue-600"
                            : "border-slate-100 bg-white text-slate-500 hover:border-slate-200 hover:text-slate-700 hover:bg-slate-50/50"
                        }`}
                      >
                        {opt}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 3: // Budget
        return (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="mt-10 space-y-10">
              <div className="space-y-5">
                <p className="text-[17px] font-bold text-slate-900">
                  Do you need financial support?
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {renderRadioOption(
                    form.financial_support === "yes",
                    () => handleInputChange("financial_support", "yes"),
                    "Yes, I need financial aid",
                  )}
                  {renderRadioOption(
                    form.financial_support === "no",
                    () => handleInputChange("financial_support", "no"),
                    "No, I can manage full fees",
                  )}
                </div>
              </div>

              <div className="space-y-5">
                <p className="text-[17px] font-bold text-slate-900">
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
                  placeholder="Choose your budget range"
                />
              </div>
            </div>
          </div>
        );

      case 4: // Location
        return (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="mt-10 space-y-10">
              <div className="space-y-5">
                <p className="text-[17px] font-bold text-slate-900">
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
                  placeholder="Select province"
                />
              </div>

              <div className="space-y-5">
                <p className="text-[17px] font-bold text-slate-900 border-t border-slate-50 pt-8 mt-8">
                  Do you prefer:
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    "Kathmandu Valley",
                    "Outside Valley (City)",
                    "Hometown",
                    "Anywhere",
                  ].map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => handleInputChange("setting", l)}
                      className={`rounded-2xl border-2 p-5 text-left text-[15px] font-bold transition-all duration-300 ${
                        form.setting === l
                          ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600 shadow-md"
                          : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 5: // Distance
        return (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="mt-10 grid gap-5">
              {[
                { id: "stay_at_home", l: "Stay at home (Day scholar)" },
                { id: "2_3_hours", l: "Within 2–3 hours travel" },
                { id: "same_province", l: "Different city, same province" },
                { id: "anywhere_nepal", l: "Anywhere in Nepal" },
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => handleInputChange("distance_from_home", d.l)}
                  className={`flex items-center justify-between rounded-2xl border-2 p-6 transition-all duration-300 ${
                    form.distance_from_home === d.l
                      ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600 shadow-lg shadow-blue-600/5 translate-x-1"
                      : "border-slate-50 bg-white text-slate-500 hover:border-slate-200 hover:translate-x-1"
                  }`}
                >
                  <span
                    className={`text-base font-bold ${form.distance_from_home === d.l ? "text-blue-700" : "text-slate-600"}`}
                  >
                    {d.l}
                  </span>
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
                      form.distance_from_home === d.l
                        ? "border-blue-600 bg-blue-600"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    {form.distance_from_home === d.l && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 6: // Class Size
        return (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="mt-10 space-y-5">
              {[
                {
                  id: "small",
                  l: "Small class",
                  d: "More personalized teacher attention",
                },
                {
                  id: "medium",
                  l: "Medium class",
                  d: "A balanced learning environment",
                },
                {
                  id: "large",
                  l: "Large college",
                  d: "Big batches and networking opportunities",
                },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleInputChange("class_size", s.l)}
                  className={`group flex w-full flex-col rounded-3xl border-2 p-7 text-left transition-all duration-300 ${
                    form.class_size === s.l
                      ? "border-blue-600 bg-blue-50/50 shadow-xl shadow-blue-600/5 ring-1 ring-blue-600 scale-[1.02]"
                      : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/30"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xl font-bold ${form.class_size === s.l ? "text-blue-700" : "text-slate-900"}`}
                    >
                      {s.l}
                    </span>
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
                        form.class_size === s.l
                          ? "border-blue-600 bg-blue-600"
                          : "border-slate-100 bg-white"
                      }`}
                    >
                      {form.class_size === s.l && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                  </div>
                  <p
                    className={`mt-2 text-[15px] opacity-70 transition-colors ${form.class_size === s.l ? "text-blue-600" : "text-slate-500"}`}
                  >
                    {s.d}
                  </p>
                </button>
              ))}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="mt-10 space-y-4">
              {renderRadioOption(
                form.academics_vs_campus === "Academics matter more than fun",
                () =>
                  handleInputChange(
                    "academics_vs_campus",
                    "Academics matter more than fun",
                  ),
                "Academics matter more than fun",
              )}
              {renderRadioOption(
                form.academics_vs_campus === "Campus life matters more",
                () =>
                  handleInputChange(
                    "academics_vs_campus",
                    "Campus life matters more",
                  ),
                "Campus life matters more",
              )}
              {renderRadioOption(
                form.academics_vs_campus === "Both equally important",
                () =>
                  handleInputChange(
                    "academics_vs_campus",
                    "Both equally important",
                  ),
                "Both equally important",
              )}
            </div>
          </div>
        );

      case 8:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="mt-10 space-y-4">
              {renderRadioOption(
                form.activities_importance === "Yes",
                () => handleInputChange("activities_importance", "Yes"),
                "Yes, they are very important",
              )}
              {renderRadioOption(
                form.activities_importance === "Somewhat",
                () => handleInputChange("activities_importance", "Somewhat"),
                "Somewhat important",
              )}
              {renderRadioOption(
                form.activities_importance === "No",
                () => handleInputChange("activities_importance", "No"),
                "No, I prefer to focus on academics",
              )}
            </div>
          </div>
        );

      case 9:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="mt-10 space-y-4">
              {renderRadioOption(
                form.facility_choice === "Modern labs",
                () => handleInputChange("facility_choice", "Modern labs"),
                "Modern labs",
              )}
              {renderRadioOption(
                form.facility_choice === "Hostel facility",
                () => handleInputChange("facility_choice", "Hostel facility"),
                "Hostel facility",
              )}
              {renderRadioOption(
                form.facility_choice === "Library",
                () => handleInputChange("facility_choice", "Library"),
                "Library",
              )}
              {renderRadioOption(
                form.facility_choice === "Cafeteria quality",
                () => handleInputChange("facility_choice", "Cafeteria quality"),
                "Cafeteria quality",
              )}
              {renderRadioOption(
                form.facility_choice === "All of the above",
                () => handleInputChange("facility_choice", "All of the above"),
                "All of the above",
              )}
            </div>
          </div>
        );

      case 10:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="mt-10 space-y-4">
              {renderRadioOption(
                form.tuition_factor === "Yes, low cost is very important",
                () =>
                  handleInputChange(
                    "tuition_factor",
                    "Yes, low cost is very important",
                  ),
                "Yes, low cost is very important",
              )}
              {renderRadioOption(
                form.tuition_factor === "I'm okay paying more for quality",
                () =>
                  handleInputChange(
                    "tuition_factor",
                    "I'm okay paying more for quality",
                  ),
                "I'm okay paying more for quality",
              )}
              {renderRadioOption(
                form.tuition_factor === "Depends on scholarship availability",
                () =>
                  handleInputChange(
                    "tuition_factor",
                    "Depends on scholarship availability",
                  ),
                "Depends on scholarship availability",
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (step === 11) {
    const selectedCount = selectedIds.size;
    const previewItem = results.find((r) => r.id === previewId) || results[0];

    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased font-sans overflow-x-hidden relative">
        {/* Side Preview Panel */}
        <aside
          className={`fixed top-0 right-0 h-screen w-100 bg-white border-l border-slate-200 z-60 overflow-y-auto shadow-2xl transition-transform duration-400 ease-in-out ${
            previewId ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-8 pb-32">
            {!previewId ? (
              <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
                <Building2 className="w-16 h-16 mb-4 opacity-20" />
                <p className="font-medium text-slate-500">
                  Select a college to see details
                </p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Back / Preview Header */}
                <div
                  className="flex items-center gap-2 mb-6 cursor-pointer group"
                  onClick={() => setPreviewId(null)}
                >
                  <ChevronLeft className="w-4 h-4 text-slate-700 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-bold text-slate-700 text-base">
                    Close Preview
                  </span>
                </div>

                {/* University Header Info */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl border border-slate-200 flex items-center justify-center font-extrabold text-xl bg-white text-slate-700 shadow-sm shrink-0">
                      {previewItem?.name?.[0]}
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
                        {previewItem?.name}
                      </h2>
                      <p className="text-slate-500 font-bold text-sm mt-1">
                        {previewItem?.location}
                      </p>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-200 my-5" />

                {/* Grid Stats */}
                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-slate-500 font-bold mb-1 text-xs uppercase tracking-wider">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      Status
                    </div>
                    <div className="text-blue-600 font-bold text-base">
                      Target
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-500 font-bold mb-1 text-xs uppercase tracking-wider">
                      <Building2 className="w-4 h-4 text-slate-700" />
                      Institution type
                    </div>
                    <div className="font-bold text-slate-900 text-base">
                      {previewItem?.type || "College"}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-500 font-bold mb-1 text-xs uppercase tracking-wider">
                      <MapPin className="w-4 h-4 text-slate-700" />
                      Location Match
                    </div>
                    <div className="font-bold text-slate-900 text-base">
                      100%
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-500 font-bold mb-1 text-xs uppercase tracking-wider">
                      <Banknote className="w-4 h-4 text-slate-700" />
                      Tuition cost
                    </div>
                    <div className="font-bold text-slate-900 text-base">
                      Rs. 4,00,000+
                    </div>
                  </div>
                </div>

                <hr className="border-slate-200 my-5" />

                {/* About Section */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    About
                  </h3>
                  <p className="text-slate-600 font-medium leading-relaxed text-sm">
                    {previewItem?.name} is recognized for its commitment to
                    academic excellence and holistic student development in{" "}
                    {previewItem?.location}. It provides a modern learning
                    environment with focus on career readiness.
                  </p>
                </div>

                <hr className="border-slate-200 my-5" />

                {/* Match Reasons */}
                <div>
                  <h3 className="text-lg font-bold mb-4 text-blue-600">
                    Why it matches you
                  </h3>
                  <div className="space-y-4">
                    {previewItem?.reasons?.map((reason, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="mt-1 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-emerald-600 stroke-[3px]" />
                        </div>
                        <div className="font-bold text-slate-700 text-sm leading-relaxed">
                          {reason}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() =>
                      onNavigate("collegeProfile", { id: previewItem.id })
                    }
                    className="w-full rounded-xl bg-blue-600 py-4 text-white font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    View Full Profile
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content Wrapper */}
        <div
          className={`transition-all duration-400 ${previewId ? "mr-100" : ""}`}
        >
          {/* Header Section */}
          <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              Colleges that fit you best
            </h1>
            <p className="text-slate-600 text-base max-w-2xl mb-6 font-medium">
              Based on your preferences in Nepal, here are your best college
              matches. Review them to create your shortlist!
            </p>

            <button
              onClick={() => setIsRefineModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all"
            >
              <Filter className="w-4 h-4" />
              Refine your answers
            </button>
          </header>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 pb-32">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((item) => {
                const isSelected = selectedIds.has(item.id);
                const isExpanded = expandedMatchId === item.id;

                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-2xl border ${
                      previewId === item.id
                        ? "border-blue-500 ring-2 ring-blue-500/10 shadow-lg"
                        : "border-slate-200"
                    } overflow-hidden cursor-pointer flex flex-col transition-all duration-200 hover:border-blue-300`}
                    onClick={() => setPreviewId(item.id)}
                  >
                    <div className="p-6 grow">
                      <div className="flex justify-between items-start gap-4 mb-5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-extrabold border border-blue-100 shrink-0 text-xs tracking-tighter">
                            {item.name?.[0]}
                          </div>
                          <h3 className="font-bold text-slate-800 text-lg leading-tight tracking-tight">
                            {item.name}
                          </h3>
                        </div>
                        <div className="shrink-0 pt-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSelection(item.id);
                            }}
                            className={`w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center ${
                              isSelected
                                ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/30"
                                : "bg-white border-slate-300 text-transparent hover:border-blue-400"
                            }`}
                          >
                            <Check className="w-4 h-4 stroke-[3px]" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                          <span className="text-emerald-600 font-bold">
                            Recommended
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 font-medium overflow-hidden">
                          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="truncate" title={item.location}>
                            {item.location}
                          </span>
                        </div>
                        <div className="col-span-2 my-1 border-t border-slate-50"></div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Banknote className="w-4 h-4 text-slate-400" />
                          <span className="font-bold text-slate-700">
                            Rs. 4L - 8L
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Check className="w-4 h-4 text-emerald-500" />
                          <span className="font-bold text-slate-700">
                            Verified
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Overall Match Bar */}
                    <div
                      className="px-6 py-4 border-t border-slate-50 bg-slate-50/50 flex flex-col hover:bg-slate-100/80 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedMatchId(isExpanded ? null : item.id);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm tracking-tight">
                          <Star className="w-5 h-5 fill-emerald-100 text-emerald-600" />
                          <span>
                            {Math.floor(item.match_score * 10)}% Overall match
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      {isExpanded && (
                        <div className="pt-4 pb-1 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-widest">
                              <span>Match breakdown</span>
                            </div>
                            <div className="flex gap-1 h-1.5 w-full rounded-full overflow-hidden bg-slate-200">
                              <div
                                className="h-full bg-emerald-500"
                                style={{ width: "90%" }}
                              ></div>
                              <div
                                className="h-full bg-blue-500"
                                style={{ width: "80%" }}
                              ></div>
                              <div
                                className="h-full bg-indigo-500"
                                style={{ width: "70%" }}
                              ></div>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                            {item.reasons?.slice(0, 2).map((r, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 text-[11px] font-bold text-slate-600"
                              >
                                <div className="w-1 h-1 rounded-full bg-blue-400" />
                                {r}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        </div>

        {/* Global Select & Shortlist Bar */}
        <div
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] transition-all duration-400"
          style={{ right: previewId ? "400px" : "0" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-800 text-sm">
                  Select All
                </span>
                <button
                  onClick={() => {
                    if (selectedCount === results.length)
                      setSelectedIds(new Set());
                    else setSelectedIds(new Set(results.map((r) => r.id)));
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    selectedCount === results.length
                      ? "bg-blue-600"
                      : "bg-slate-300"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      selectedCount === results.length
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              <span
                className={`text-sm font-bold ${selectedCount > 0 ? "text-blue-600" : "text-slate-500"}`}
              >
                ({selectedCount}/{results.length} Selected)
              </span>
            </div>
            <button
              disabled={selectedCount === 0}
              className={`w-full sm:w-auto px-10 py-3 rounded-xl font-bold text-sm tracking-tight transition-all duration-300 ${
                selectedCount > 0
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 active:scale-95 cursor-pointer"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Add to shortlist
            </button>
          </div>
        </div>

        {/* Refine Confirmation Modal */}
        {isRefineModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-100 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div
              className="bg-white rounded-2xl border border-slate-200 w-full max-w-md overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <button
                  onClick={() => setIsRefineModalOpen(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-extrabold text-[#0f172a] mb-4 tracking-tight">
                  Are you sure?
                </h2>
                <p className="text-[#475569] text-base leading-relaxed mb-10 font-medium">
                  Refining your answers will recalculate your results, and your
                  current matches might be updated based on new information.
                </p>
                <div className="flex items-center justify-end gap-6">
                  <button
                    onClick={() => setIsRefineModalOpen(false)}
                    className="text-[#0f172a] font-extrabold text-sm hover:opacity-70"
                  >
                    Stay on Page
                  </button>
                  <button
                    onClick={() => {
                      setIsRefineModalOpen(false);
                      setStep(10);
                    }}
                    className="px-6 py-3 rounded-xl bg-slate-900 text-white font-extrabold text-sm hover:bg-slate-800 transition-all active:scale-95"
                  >
                    Refine Answers
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white text-slate-800 lg:flex-row">
      {/* Left Panel: Illustration */}
      <div className="hidden h-full items-center justify-center bg-[#e0f2fe] p-12 lg:flex lg:w-1/2">
        <div className="relative z-10 w-full max-w-100 drop-shadow-sm">
          <Image
            src={stepImages[step] || "/foucs.svg"}
            alt="Step illustration"
            width={400}
            height={400}
            className="h-auto w-full mix-blend-multiply transition-all duration-500 scale-110"
          />
        </div>
      </div>

      {/* Right Panel: Interactive Content */}
      <div className="flex h-full flex-1 flex-col justify-center overflow-y-auto px-6 py-10 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-2xl">
          {/* Progress & Back Navigation */}
          <div className="mb-10 flex items-center">
            <button
              onClick={() =>
                step === 1
                  ? onNavigate("educationPage")
                  : setStep((prev) => Math.max(1, prev - 1))
              }
              className="mr-4 rounded-full p-1 text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <div className="h-2 flex-1 overflow-hidden rounded-full border border-blue-200 bg-blue-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                style={{ width: progressByStep[step] || "100%" }}
              ></div>
            </div>
          </div>

          <div className="mb-10">
            <h1 className="mb-2 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-[2.5rem]">
              {stepTitles[step]}
            </h1>
            {stepSubtitles[step] ? (
              <p className="text-lg font-medium text-slate-500">
                {stepSubtitles[step]}
              </p>
            ) : null}
          </div>

          {renderStepContent()}

          <div className="mt-8">
            {step < 10 ? (
              <button
                onClick={() => setStep((prev) => Math.min(10, prev + 1))}
                disabled={!canContinue}
                className={`w-full rounded-xl px-8 py-3.5 text-sm font-semibold transition-all duration-300 sm:w-auto ${
                  canContinue
                    ? "cursor-pointer bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700"
                    : "cursor-not-allowed bg-slate-100 text-slate-400"
                }`}
              >
                Continue
              </button>
            ) : (
              <button
                onClick={fetchRecommendations}
                disabled={!canContinue || loading}
                className="w-full rounded-xl bg-slate-900 px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
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
