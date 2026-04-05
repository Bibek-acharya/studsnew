import React, { useMemo, useState } from "react";

interface ScholarshipFinderRecommendation {
  id: number;
  title: string;
  provider?: string;
  funding_type?: string;
  description?: string;
  deadline?: string;
  value?: string;
  match_score?: number;
}

interface ScholarshipFinderToolPayload {
  education_level: string;
  study_mode: string;
  academic_score: string;
  target_country: string;
  need_type: string;
  skills: string[];
  achievements: string[];
  involvements: string[];
}

interface ScholarshipFinderPageProps {
  onNavigate: (view: any, data?: any) => void;
}

const educationLevels = [
  "SEE Completed",
  "Class 11",
  "Class 12",
  "+2 Completed",
  "Bachelor Running",
  "Bachelor Completed",
  "Master Running",
  "Planning to Study Abroad",
];

const studyModes = ["Full-time", "Part-time", "Either", "Not sure"];

const fieldOptions = [
  "Science (+2)",
  "Management (+2)",
  "Humanities (+2)",
  "Law",
  "Education",
  "BBS",
  "BBA",
  "BIT",
  "BSc CSIT",
  "Engineering",
  "MBBS",
  "Nursing",
  "Pharmacy",
  "Agriculture",
  "CA / ACCA",
  "Hotel Management",
  "Master's Programs",
  "Abroad Study",
];

const provinces = [
  "Koshi",
  "Madhesh",
  "Bagmati",
  "Gandaki",
  "Lumbini",
  "Karnali",
  "Sudurpashchim",
];

const districts = [
  "Achham", "Arghakhanchi", "Baglung", "Baitadi", "Bajhang", "Bajura", "Banke", "Bara",
  "Bardiya", "Bhaktapur", "Bhojpur", "Chitwan", "Dadeldhura", "Dailekh", "Dang", "Darchula",
  "Dhading", "Dhankuta", "Dhanusha", "Dolakha", "Dolpa", "Doti", "Eastern Rukum", "Gorkha",
  "Gulmi", "Humla", "Ilam", "Jajarkot", "Jhapa", "Jumla", "Kailali", "Kalikot",
  "Kanchanpur", "Kapilvastu", "Kaski", "Kathmandu", "Kavrepalanchok", "Khotang", "Lalitpur",
  "Lamjung", "Mahottari", "Makwanpur", "Manang", "Morang", "Mugu", "Mustang", "Myagdi",
  "Nawalpur", "Nuwakot", "Okhaldhunga", "Palpa", "Panchthar", "Parbat", "Parsa", "Pyuthan",
  "Ramechhap", "Rasuwa", "Rautahat", "Rolpa", "Rupandehi", "Salyan", "Sankhuwasabha", "Saptari",
  "Sarlahi", "Sindhuli", "Sindhupalchok", "Siraha", "Solukhumbu", "Sunsari", "Surkhet", "Syangja",
  "Tanahun", "Taplejung", "Terhathum", "Udayapur", "Western Rukum",
];

const categoryOptions = [
  "Dalit",
  "Janajati",
  "Madhesi",
  "Tharu",
  "Muslim",
  "Women",
  "Remote Area Resident",
  "Differently Abled",
  "Conflict Victim Family",
  "Martyrs' Family",
  "None",
];

const genders = ["Male", "Female", "Other", "Prefer not to say"];

const incomes = ["Below 2 lakh", "2–5 lakh", "5–10 lakh", "Above 10 lakh"];

const talents = [
  "Sports",
  "Music",
  "Debate",
  "Coding",
  "Leadership",
  "Social Service",
  "Research",
  "Arts",
];

const achievements = [
  "SEE Board Topper",
  "+2 Distinction",
  "National Competition Winner",
  "Olympiad Participant",
  "Published Research",
  "None",
];

const involvements = [
  "Community Service",
  "NGO Work",
  "Student Clubs",
  "Entrepreneurship",
  "Family Business",
  "None",
];

const stepImage: Record<number, string> = {
  1: "https://img.pikbest.com/origin/09/27/02/00ApIkbEsTaG6.png!sw800",
  2: "https://illustrations.popsy.co/blue/studying.svg",
  3: "https://clipart-library.com/2024/person-thinking-clipart/person-thinking-clipart-8.png",
  4: "https://clipart-library.com/2024/person-thinking-clipart/person-thinking-clipart-8.png",
  5: "https://cdni.iconscout.com/illustration/premium/thumb/achievement-illustration-svg-download-png-6983258.png",
};

const ScholarshipFinderPage: React.FC<ScholarshipFinderPageProps> = ({
  onNavigate,
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ScholarshipFinderRecommendation[]>([]);
  const [selectedScholarshipIds, setSelectedScholarshipIds] = useState<number[]>([]);
  const [deadlineSort, setDeadlineSort] = useState<"nearest" | "furthest" | "amount_highest">("nearest");
  const [sortBy, setSortBy] = useState<"relevance" | "newest">("relevance");

  const [form, setForm] = useState({
    education_level: "",
    study_mode: "",
    academic_score: "",
    intended_field: "",
    willing_essays: "",
    willing_interviews: "",
    willing_gpa: "",
    province: "",
    district: "",
    study_plan: "",
    categories: [] as string[],
    gender: "",
    income: "",
    talent: "",
    achievement: "",
    involvements: [] as string[],
  });

  const canContinue = useMemo(() => {
    if (step === 1) return !!form.education_level && !!form.study_mode && !!form.academic_score;
    if (step === 2)
      return !!form.intended_field && !!form.willing_essays && !!form.willing_interviews && !!form.willing_gpa;
    if (step === 3) return !!form.province && !!form.district && !!form.study_plan;
    if (step === 4) return form.categories.length > 0 && !!form.gender && !!form.income;
    return true;
  }, [form, step]);

  const progressNodes = (activeStep: number) => (
    <div className="mb-8 flex items-center space-x-2 text-sm font-semibold">
      {Array.from({ length: 5 }).map((_, idx) => {
        const number = idx + 1;
        const active = number === activeStep;
        const done = number < activeStep;
        return (
          <React.Fragment key={number}>
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                active
                  ? "bg-blue-600 text-white ring-4 ring-blue-100"
                  : done
                  ? "bg-slate-900 text-white"
                  : "border-2 border-slate-300 bg-white text-slate-400"
              }`}
            >
              {number}
            </div>
            {number < 5 ? (
              <div className={`h-[2px] w-4 ${done ? "bg-slate-700" : "bg-slate-300"}`}></div>
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );

  const toggleCategory = (value: string) => {
    setForm((prev) => {
      const has = prev.categories.includes(value);
      let next = prev.categories;
      if (value === "None") {
        next = has ? prev.categories.filter((v) => v !== value) : ["None"];
      } else {
        const withoutNone = prev.categories.filter((v) => v !== "None");
        next = has ? withoutNone.filter((v) => v !== value) : [...withoutNone, value];
      }
      return { ...prev, categories: next };
    });
  };

  const toggleInvolvement = (value: string) => {
    setForm((prev) => {
      const has = prev.involvements.includes(value);
      let next = prev.involvements;
      if (value === "None") {
        next = has ? prev.involvements.filter((v) => v !== value) : ["None"];
      } else {
        const withoutNone = prev.involvements.filter((v) => v !== "None");
        next = has ? withoutNone.filter((v) => v !== value) : [...withoutNone, value];
      }
      return { ...prev, involvements: next };
    });
  };

  const getPayload = (): ScholarshipFinderToolPayload => {
    const needType = `${form.income}; ${form.categories.join(", ")}`;
    return {
      education_level: form.education_level,
      study_mode: form.study_mode,
      academic_score: form.academic_score,
      target_country:
        form.study_plan === "Inside Nepal"
          ? "Nepal"
          : form.study_plan === "Abroad"
          ? "Abroad"
          : form.study_plan || "Nepal",
      need_type: needType,
      skills: [form.intended_field, form.talent].filter(Boolean),
      achievements: [form.achievement].filter(Boolean),
      involvements: form.involvements,
    };
  };

  const parseDate = (dateText?: string): number => {
    if (!dateText) return Number.MAX_SAFE_INTEGER;
    const parsed = new Date(dateText).getTime();
    return Number.isNaN(parsed) ? Number.MAX_SAFE_INTEGER : parsed;
  };

  const formatDeadline = (dateText?: string): string => {
    if (!dateText) return "TBD";
    const date = new Date(dateText);
    if (Number.isNaN(date.getTime())) return String(dateText);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const parseAmount = (valueText?: string): number => {
    if (!valueText) return 0;
    const numeric = valueText.replace(/[^\d.]/g, "");
    const parsed = Number(numeric);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const totalEstimatedValue = useMemo(() => {
    const total = results.reduce((sum, item) => sum + parseAmount(item.value), 0);
    return total > 0 ? total.toLocaleString() : "0";
  }, [results]);

  const displayedResults = useMemo(() => {
    const sorted = [...results];

    if (sortBy === "relevance") {
      sorted.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
    } else {
      sorted.sort((a, b) => b.id - a.id);
    }

    if (deadlineSort === "nearest") {
      sorted.sort((a, b) => parseDate(a.deadline) - parseDate(b.deadline));
    } else if (deadlineSort === "furthest") {
      sorted.sort((a, b) => parseDate(b.deadline) - parseDate(a.deadline));
    } else {
      sorted.sort((a, b) => parseAmount(b.value) - parseAmount(a.value));
    }

    return sorted;
  }, [results, sortBy, deadlineSort]);

  const handleShowResults = async () => {
    setLoading(true);
    try {
      setResults([
        { id: 1, title: "National Merit Scholarship", provider: "Government of Nepal", funding_type: "Merit-Based", description: "Full tuition waiver for top-performing students in SEE and +2 examinations.", deadline: "2026-03-15", value: "100000", match_score: 95 },
        { id: 2, title: "Women in STEM Grant", provider: "TU Scholarship Board", funding_type: "Need-Based", description: "Supporting women pursuing science, technology, engineering, and mathematics fields.", deadline: "2026-04-20", value: "50000", match_score: 88 },
        { id: 3, title: "Rural Excellence Award", provider: "District Education Office", funding_type: "Merit + Need", description: "For students from rural districts demonstrating academic excellence and financial need.", deadline: "2026-05-10", value: "75000", match_score: 82 },
        { id: 4, title: "Sports Talent Scholarship", provider: "National Sports Council", funding_type: "Talent-Based", description: "For students excelling in sports at district or national level competitions.", deadline: "2026-06-01", value: "40000", match_score: 75 },
      ]);
      setSelectedScholarshipIds([]);
      setStep(6);
    } finally {
      setLoading(false);
    }
  };

  if (step === 6) {
    const allSelected =
      displayedResults.length > 0 &&
      displayedResults.every((item) => selectedScholarshipIds.includes(item.id));

    const toggleSelectAll = () => {
      if (allSelected) {
        setSelectedScholarshipIds([]);
        return;
      }
      setSelectedScholarshipIds(displayedResults.map((item) => item.id));
    };

    const toggleSingle = (id: number) => {
      setSelectedScholarshipIds((prev) =>
        prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id],
      );
    };

    return (
      <div className="min-h-screen bg-stone-50 px-6 pb-32 pt-10 text-gray-900 antialiased lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-8">
            <div className="mb-4 flex items-center text-sm font-medium text-gray-500">
              <button className="transition-colors hover:text-blue-600" onClick={() => setStep(5)}>
                Scholarships
              </button>
              <span className="mx-2">/</span>
              <span className="text-gray-900">AI Recommendations</span>
            </div>
            <h1 className="mb-3 text-[2rem] font-bold leading-tight text-gray-900 md:text-[2.5rem]">
              Scholarships that fit you best
            </h1>
            <p className="max-w-4xl text-[1.05rem] leading-relaxed text-gray-600">
              These scholarships were handpicked based on your background, interests, and academic profile. You meet the key eligibility criteria, now it's time to explore and apply with confidence. You're eligible for <span className="font-bold text-blue-600">${totalEstimatedValue}+</span> in scholarships. Let's help you apply!
            </p>
          </div>

          <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <button
              onClick={() => setStep(1)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 font-semibold text-gray-800 transition-colors hover:bg-gray-50 sm:w-auto"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Refine your answers
            </button>

            <div className="flex w-full gap-3 sm:w-auto">
              <div className="relative w-full sm:w-48">
                <select
                  value={deadlineSort}
                  onChange={(event) => setDeadlineSort(event.target.value as "nearest" | "furthest" | "amount_highest")}
                  className="w-full cursor-pointer appearance-none rounded-xl border border-gray-300 bg-white py-2.5 pl-4 pr-10 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="nearest">Deadline (Nearest)</option>
                  <option value="furthest">Deadline (Furthest)</option>
                  <option value="amount_highest">Amount (Highest)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="relative w-full sm:w-40">
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as "relevance" | "newest")}
                  className="w-full cursor-pointer appearance-none rounded-xl border border-gray-300 bg-white py-2.5 pl-4 pr-10 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="relevance">Sort By</option>
                  <option value="relevance">Relevance</option>
                  <option value="newest">Newest</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {displayedResults.map((item) => {
              const selected = selectedScholarshipIds.includes(item.id);
              return (
              <div
                key={item.id}
                className="group relative flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:shadow-lg"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h3 className="text-[1.05rem] font-bold leading-snug text-gray-900 transition-colors group-hover:text-blue-700">
                    {item.title}
                  </h3>
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggleSingle(item.id)}
                    className="card-checkbox mt-0.5 h-5 w-5 flex-shrink-0"
                  />
                </div>

                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-600 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-white">
                    {item.provider || "Provider"}
                  </span>
                  <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-blue-700">
                    {item.funding_type || "Support"}
                  </span>
                </div>

                <p className="mb-5 flex-grow text-sm text-gray-600">
                  {item.description || "Scholarship details available."}
                </p>

                <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-4">
                  <div>
                    <span className="mb-1 block text-[0.7rem] font-bold uppercase tracking-wider text-gray-400">
                      Deadline
                    </span>
                    <span className="text-[0.95rem] font-bold text-blue-600">{formatDeadline(item.deadline)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="rounded-lg border border-gray-200 bg-gray-50 p-2 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      title="Save"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onNavigate("scholarshipHubDetails", { id: item.id })}
                      className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            );})}
          </div>

          <div className="fixed bottom-6 left-1/2 z-50 flex w-[90%] max-w-4xl -translate-x-1/2 items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)]">
            <div className="flex items-center gap-4">
              <span className="text-[0.95rem] font-bold text-gray-800">Select all</span>

              <button
                type="button"
                onClick={toggleSelectAll}
                className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors ${allSelected ? "bg-blue-600" : "bg-gray-300"}`}
              >
                <span
                  className={`absolute h-5 w-5 rounded-full border-2 border-gray-300 bg-white transition-transform ${
                    allSelected ? "translate-x-5 border-blue-600" : "translate-x-0.5"
                  }`}
                />
              </button>

              <span className="hidden text-sm font-semibold text-gray-500 sm:inline">
                ({selectedScholarshipIds.length}/{displayedResults.length} Selected)
              </span>
            </div>

            <button
              disabled={selectedScholarshipIds.length === 0}
              className={`rounded-xl px-6 py-3 font-bold text-white shadow-sm transition-colors ${
                selectedScholarshipIds.length > 0
                  ? "bg-gray-900 hover:bg-gray-800"
                  : "bg-gray-400"
              }`}
            >
              Add to shortlist
            </button>
          </div>

          <style>{`
            .card-checkbox {
              appearance: none;
              width: 1.25rem;
              height: 1.25rem;
              border: 2px solid #cbd5e1;
              border-radius: 0.25rem;
              outline: none;
              cursor: pointer;
              transition: all 0.2s;
              position: relative;
            }
            .card-checkbox:checked {
              background-color: #2563eb;
              border-color: #2563eb;
            }
            .card-checkbox:checked::after {
              content: '';
              position: absolute;
              top: 1px;
              left: 5px;
              width: 5px;
              height: 10px;
              border: solid white;
              border-width: 0 2px 2px 0;
              transform: rotate(45deg);
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-slate-50 text-slate-800">
      <main className="mx-auto flex h-full w-full max-w-7xl flex-col lg:flex-row">
        <div className="no-scrollbar w-full overflow-y-auto p-6 md:p-10 lg:w-[55%] lg:p-16">
          <div className="mx-auto w-full max-w-xl pt-2">
            {progressNodes(step)}

            {step === 1 && (
              <>
                <h1 className="mb-8 text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
                  Tell us where you are in your education journey
                </h1>

                <div className="space-y-8">
                  <div>
                    <label className="mb-3 block font-semibold text-slate-800">What level are you currently studying?</label>
                    <select
                      value={form.education_level}
                      onChange={(e) => setForm((prev) => ({ ...prev, education_level: e.target.value }))}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Select your education level</option>
                      {educationLevels.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-3 block font-semibold text-slate-800">Study Mode Preference</label>
                    <div className="flex flex-wrap gap-3">
                      {studyModes.map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, study_mode: mode }))}
                          className={`rounded-full border px-5 py-2 text-sm font-medium transition-all ${
                            form.study_mode === mode
                              ? "border-blue-600 bg-blue-50 text-blue-700"
                              : "border-slate-300 bg-white text-slate-600 hover:border-blue-400"
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-3 block font-semibold text-slate-800">What is your academic score?</label>
                    <input
                      value={form.academic_score}
                      onChange={(e) => setForm((prev) => ({ ...prev, academic_score: e.target.value }))}
                      placeholder="e.g. 3.8 or 85%"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h1 className="mb-6 text-3xl font-bold leading-tight text-slate-900 md:text-4xl">What Do You Want to Study?</h1>

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block font-semibold text-slate-800">Intended Field of Study</label>
                    <select
                      value={form.intended_field}
                      onChange={(e) => setForm((prev) => ({ ...prev, intended_field: e.target.value }))}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Select your prospective major</option>
                      {fieldOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="block font-semibold text-slate-800">Are you willing to:</label>

                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                      <p className="mb-2 text-sm font-medium text-slate-700">Write scholarship essays?</p>
                      <div className="flex gap-4 text-sm">
                        <label className="flex items-center gap-2"><input type="radio" name="essays" checked={form.willing_essays === "Yes"} onChange={() => setForm((prev) => ({ ...prev, willing_essays: "Yes" }))} />Yes</label>
                        <label className="flex items-center gap-2"><input type="radio" name="essays" checked={form.willing_essays === "No"} onChange={() => setForm((prev) => ({ ...prev, willing_essays: "No" }))} />No</label>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                      <p className="mb-2 text-sm font-medium text-slate-700">Attend scholarship interviews?</p>
                      <div className="flex gap-4 text-sm">
                        <label className="flex items-center gap-2"><input type="radio" name="interviews" checked={form.willing_interviews === "Yes"} onChange={() => setForm((prev) => ({ ...prev, willing_interviews: "Yes" }))} />Yes</label>
                        <label className="flex items-center gap-2"><input type="radio" name="interviews" checked={form.willing_interviews === "No"} onChange={() => setForm((prev) => ({ ...prev, willing_interviews: "No" }))} />No</label>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                      <p className="mb-2 text-sm font-medium text-slate-700">Maintain minimum GPA requirement?</p>
                      <div className="flex gap-4 text-sm">
                        <label className="flex items-center gap-2"><input type="radio" name="gpa" checked={form.willing_gpa === "Yes"} onChange={() => setForm((prev) => ({ ...prev, willing_gpa: "Yes" }))} />Yes</label>
                        <label className="flex items-center gap-2"><input type="radio" name="gpa" checked={form.willing_gpa === "No"} onChange={() => setForm((prev) => ({ ...prev, willing_gpa: "No" }))} />No</label>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h1 className="mb-3 text-[2.3rem] font-bold leading-tight text-slate-800">Location & Citizenship</h1>
                <p className="mb-8 text-lg font-medium text-slate-600">Many Nepal scholarships depend on district, province, or category.</p>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-800">Your Province</label>
                      <select
                        value={form.province}
                        onChange={(e) => setForm((prev) => ({ ...prev, province: e.target.value }))}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 shadow-sm focus:border-blue-500 focus:outline-none"
                      >
                        <option value="">Select Province</option>
                        {provinces.map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-800">Your District</label>
                      <select
                        value={form.district}
                        onChange={(e) => setForm((prev) => ({ ...prev, district: e.target.value }))}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 shadow-sm focus:border-blue-500 focus:outline-none"
                      >
                        <option value="">Select District</option>
                        {districts.map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-4 block text-sm font-bold text-slate-800">Are you planning to study:</label>
                    <div className="space-y-3">
                      {["Inside Nepal", "Abroad", "Both"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, study_plan: option }))}
                          className={`flex w-full items-center rounded-xl border p-4 text-left shadow-sm transition-all ${
                            form.study_plan === option
                              ? "border-blue-500 bg-blue-50"
                              : "border-slate-300 bg-white hover:border-blue-400"
                          }`}
                        >
                          <div className={`mr-4 h-5 w-5 rounded-full border-2 ${form.study_plan === option ? "border-blue-600 bg-blue-600" : "border-slate-300"}`}></div>
                          <span className="font-semibold text-slate-700">{option}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <h1 className="mb-3 text-[2.3rem] font-bold leading-tight text-slate-800">Tell us a bit more about yourself</h1>
                <p className="mb-8 max-w-md text-lg font-medium text-slate-600">
                  In Nepal, many scholarships are reserved for specific groups. This helps us match you with opportunities you're actually eligible for.
                </p>

                <div className="space-y-7">
                  <div>
                    <label className="mb-3 block text-sm font-bold text-slate-800">Do you belong to any of these categories?</label>
                    <div className="flex flex-wrap gap-3">
                      {categoryOptions.map((option) => {
                        const selected = form.categories.includes(option);
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => toggleCategory(option)}
                            className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all ${
                              selected
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-800">Gender</label>
                    <select
                      value={form.gender}
                      onChange={(e) => setForm((prev) => ({ ...prev, gender: e.target.value }))}
                      className="w-full max-w-sm rounded-xl border border-slate-300 bg-white px-4 py-3.5 shadow-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Select gender</option>
                      {genders.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-800">Annual Family Income</label>
                    <p className="mb-3 text-xs text-slate-500">(This helps match need-based scholarships)</p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {incomes.map((income) => (
                        <button
                          key={income}
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, income }))}
                          className={`flex items-center rounded-xl border p-4 text-left shadow-sm transition-all ${
                            form.income === income
                              ? "border-blue-500 bg-blue-50"
                              : "border-slate-300 bg-white hover:border-blue-400"
                          }`}
                        >
                          <div className={`mr-4 h-5 w-5 rounded-full border-2 ${form.income === income ? "border-blue-600 bg-blue-600" : "border-slate-300"}`}></div>
                          <span className="font-semibold text-slate-700">{income}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {step === 5 && (
              <>
                <h1 className="mb-3 text-[2.5rem] font-bold tracking-tight text-gray-900">Experience & Achievements</h1>
                <p className="mb-8 text-[1.1rem] font-medium text-gray-500">Optional but improves matching</p>

                <div className="max-w-md space-y-8">
                  <div>
                    <div className="mb-2 flex items-end justify-between">
                      <label className="text-[0.95rem] font-bold text-gray-800">Talents / Skills</label>
                      <span className="text-xs font-semibold text-gray-400">(optional)</span>
                    </div>
                    <select
                      value={form.talent}
                      onChange={(e) => setForm((prev) => ({ ...prev, talent: e.target.value }))}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="">Select an option</option>
                      {talents.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="mb-2 flex items-end justify-between">
                      <label className="text-[0.95rem] font-bold text-gray-800">Achievements</label>
                      <span className="text-xs font-semibold text-gray-400">(optional)</span>
                    </div>
                    <select
                      value={form.achievement}
                      onChange={(e) => setForm((prev) => ({ ...prev, achievement: e.target.value }))}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="">Select an option</option>
                      {achievements.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-4 block text-[0.95rem] font-bold text-gray-800">Are you involved in:</label>
                    <div className="space-y-3">
                      {involvements.map((item) => (
                        <label key={item} className="flex cursor-pointer items-center gap-3">
                          <input
                            type="checkbox"
                            checked={form.involvements.includes(item)}
                            onChange={() => toggleInvolvement(item)}
                            className="h-5 w-5 accent-indigo-600"
                          />
                          <span className="text-[0.95rem] font-medium text-gray-700">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="pt-8">
              <div className="flex items-center gap-3">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((prev) => Math.max(1, prev - 1))}
                    className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700"
                  >
                    Back
                  </button>
                ) : null}

                {step < 5 ? (
                  <button
                    type="button"
                    disabled={!canContinue}
                    onClick={() => setStep((prev) => Math.min(5, prev + 1))}
                    className={`rounded-xl px-8 py-3 font-semibold transition-all ${
                      canContinue
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "cursor-not-allowed bg-slate-300 text-slate-500"
                    }`}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleShowResults}
                    disabled={loading}
                    className="rounded-xl bg-gray-900 px-6 py-3.5 font-semibold text-white transition-all hover:bg-gray-800"
                  >
                    {loading ? "Loading..." : "Show results"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="hidden w-[45%] items-center justify-center p-8 lg:flex">
          <img
            src={stepImage[step]}
            alt="Scholarship Finder"
            className="h-auto w-full max-w-lg object-contain mix-blend-multiply"
          />
        </div>
      </main>
    </div>
  );
};

export default ScholarshipFinderPage;
