"use client";

import React, { useMemo, useState } from "react";
import { submitReviewAction } from "@/actions/review-actions";
import { getCollegesBySearch } from "@/lib/college-suggestions";
import { courseDataByLevel, searchCourses } from "@/lib/course-suggestions";
import { ratingCategories, ratingStatusLabels } from "@/lib/review-types";

type StudentType = "current" | "alumni" | null;

const popularColleges = getCollegesBySearch("");

const courseDataMap: Record<string, string[]> = courseDataByLevel;

const WriteReviewPage: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1989 },
    (_, index) => currentYear - index,
  );

  const [studentType, setStudentType] = useState<StudentType>(null);
  const [collegeInput, setCollegeInput] = useState("");
  const [courseInput, setCourseInput] = useState("");
  const [level, setLevel] = useState("");
  const [batchYear, setBatchYear] = useState("");
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [summaryTitle, setSummaryTitle] = useState("");
  const [yearlyFee, setYearlyFee] = useState("");
  const [scholarship, setScholarship] = useState("");
  const [internshipOutcome, setInternshipOutcome] = useState("");
  const [email, setEmail] = useState("");
  const [certify, setCertify] = useState(false);
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const [showCollegeList, setShowCollegeList] = useState(false);
  const [showCourseList, setShowCourseList] = useState(false);

  const [modal, setModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    type: "success" | "error";
  }>({ open: false, title: "", message: "", type: "success" });

  const filteredColleges = useMemo(() => {
    return getCollegesBySearch(collegeInput);
  }, [collegeInput]);

  const currentCourseSuggestions = useMemo(() => {
    return searchCourses(courseInput, level);
  }, [level, courseInput]);

  const averageRating = useMemo(() => {
    const vals = Object.values(ratings) as number[];
    if (vals.length === 0) return 0;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }, [ratings]);

  const groupAverage = (cats: string[]) => {
    let sum = 0;
    let count = 0;
    cats.forEach((cat) => {
      if (ratings[cat]) {
        sum += ratings[cat];
        count += 1;
      }
    });
    return count > 0 ? sum / count : 0;
  };

  const academicsAvg = groupAverage([
    "Teaching Quality & Faculty Support",
    "Library & Resources",
    "Administration & Management",
  ]);
  const infrastructureAvg = groupAverage([
    "Infrastructure & Lab Facilities",
    "Hostels & Accommodation",
  ]);
  const socialAvg = groupAverage([
    "Social & Campus Life",
    "Student Clubs & Activities",
  ]);

  const handleRating = (category: string, value: number) => {
    setRatings((prev) => ({ ...prev, [category]: value }));
  };

  const showMessage = (
    type: "success" | "error",
    title: string,
    message: string,
  ) => {
    setModal({ open: true, title, message, type });
  };

  const resetForm = () => {
    setStudentType(null);
    setCollegeInput("");
    setCourseInput("");
    setLevel("");
    setBatchYear("");
    setPros("");
    setCons("");
    setSummaryTitle("");
    setYearlyFee("");
    setScholarship("");
    setInternshipOutcome("");
    setEmail("");
    setCertify(false);
    setRatings({});
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!studentType) {
      showMessage(
        "error",
        "Missing Information",
        "Please select if you are a Current Student or an Alumni.",
      );
      return;
    }
    if (Object.keys(ratings).length < ratingCategories.length) {
      showMessage(
        "error",
        "Incomplete Ratings",
        "Please select a rating for all 10 categories.",
      );
      return;
    }
    if (
      !collegeInput ||
      !level ||
      !courseInput ||
      !batchYear ||
      !pros ||
      !cons ||
      !summaryTitle ||
      !email ||
      !certify
    ) {
      showMessage(
        "error",
        "Missing Fields",
        "Please complete all required fields before submitting.",
      );
      return;
    }

    const selectedCollege = popularColleges.find(
      c => c.name.toLowerCase() === collegeInput.toLowerCase()
    );

    const result = await submitReviewAction({
      collegeId: selectedCollege?.id || Math.floor(Math.random() * 1000),
      collegeName: collegeInput,
      studentType,
      course: courseInput,
      level,
      batchYear: parseInt(batchYear),
      ratings,
      pros,
      cons,
      summaryTitle,
      yearlyFee: yearlyFee ? parseInt(yearlyFee) : undefined,
      scholarship: scholarship === "yes",
      internshipOutcome: internshipOutcome || undefined,
      email,
    });

    if (result.success) {
      showMessage(
        "success",
        "Review Submitted!",
        "Thank you for sharing your experience. Your review will help future students make better choices.",
      );
      resetForm();
    } else {
      showMessage(
        "error",
        "Submission Failed",
        result.error || "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 px-4 py-12 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center lg:text-left">
          <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Review Your college Experience
          </h1>
          <p className="max-w-3xl text-base text-slate-600 md:text-lg">
            Help future students in Nepal make the right choice. Share your
            honest feedback on academics, facilities, and costs.
          </p>
        </div>

        <form
          className="grid grid-cols-1 gap-8 lg:grid-cols-12"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-6 lg:col-span-8">
            <section className="rounded-md border border-slate-200 bg-white p-6  md:p-8">
              <SectionHeader
                icon="fa-graduation-cap"
                iconWrap="bg-blue-50 text-blue-600"
                title="Reviewer Background"
                subtitle="Basic details about your study"
              />

              <div className="mb-8">
                <label className="mb-4 block text-sm font-semibold text-slate-900">
                  I am a... <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <TypeButton
                    active={studentType === "current"}
                    onClick={() => setStudentType("current")}
                    label="Current Students"
                  />
                  <TypeButton
                    active={studentType === "alumni"}
                    onClick={() => setStudentType("alumni")}
                    label="Alumni (Passout)"
                  />
                </div>
              </div>

              <div className="mb-8">
                <label className="mb-2 block text-sm font-semibold text-slate-900">
                  College/Campus Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <i className="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input
                    value={collegeInput}
                    onFocus={() => setShowCollegeList(true)}
                    onBlur={() =>
                      setTimeout(() => setShowCollegeList(false), 150)
                    }
                    onChange={(event) => setCollegeInput(event.target.value)}
                    placeholder="Search Your Campus/college Name"
                    className="w-full rounded-md border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm placeholder-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {showCollegeList && filteredColleges.length > 0 && (
                    <ul className="absolute left-0 top-full z-20 mt-1 max-h-52 w-full overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg">
                      {filteredColleges.map((item) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            className="w-full border-b border-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition-colors last:border-0 hover:bg-blue-50"
                            onMouseDown={(event) => {
                              event.preventDefault();
                              setCollegeInput(item.name);
                              setShowCollegeList(false);
                            }}
                          >
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-slate-500">{item.location} • {item.type}</div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-900">
                    Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={level}
                    onChange={(event) => {
                      setLevel(event.target.value);
                      setCourseInput("");
                    }}
                    className="w-full cursor-pointer appearance-none rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Level</option>
                    <option value="+2 / High School">+2 / High School</option>
                    <option value="Bachelor's Degree">Bachelor's Degree</option>
                    <option value="Master's Degree">Master's Degree</option>
                    <option value="Diploma">Diploma</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-900">
                    Courses/Program <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <i className="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input
                      value={courseInput}
                      onFocus={() => setShowCourseList(true)}
                      onBlur={() =>
                        setTimeout(() => setShowCourseList(false), 150)
                      }
                      onChange={(event) => setCourseInput(event.target.value)}
                      placeholder={
                        level
                          ? "Search your courses and program"
                          : "Select Level first"
                      }
                      className="w-full rounded-md border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm placeholder-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {showCourseList && currentCourseSuggestions.length > 0 && (
                      <ul className="absolute left-0 top-full z-20 mt-1 max-h-52 w-full overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg">
                        {currentCourseSuggestions.map((item) => (
                          <li key={item}>
                            <button
                              type="button"
                              className="w-full border-b border-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition-colors last:border-0 hover:bg-blue-50"
                              onMouseDown={(event) => {
                                event.preventDefault();
                                setCourseInput(item);
                                setShowCourseList(false);
                              }}
                            >
                              {item}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-900">
                    Batch/Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={batchYear}
                    onChange={(event) => setBatchYear(event.target.value)}
                    className="w-full cursor-pointer appearance-none rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-6  md:p-8">
              <SectionHeader
                icon="fa-face-smile"
                iconWrap="bg-amber-50 text-amber-500"
                title="Rate your experience *"
                subtitle="10 categories to help us build a complete picture."
              />
              <hr className="mb-8 border-slate-100" />
              <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
                {ratingCategories.map((category) => {
                  const currentValue = ratings[category] || 0;
                  return (
                    <div key={category}>
                      <div className="mb-3 flex h-6 items-center justify-between">
                        <span className="pr-2 text-sm font-semibold text-slate-800">
                          {category}
                        </span>
                        <span
                          className={`whitespace-nowrap rounded border px-2 py-1 text-xs font-bold ${currentValue ? "border-amber-100 bg-amber-50 text-amber-700" : "text-slate-400"}`}
                        >
                          {currentValue
                            ? ratingStatusLabels[currentValue - 1]
                            : "Not Rated"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            type="button"
                            key={value}
                            onClick={() => handleRating(category, value)}
                            className="transition-transform hover:scale-110"
                          >
                            <i
                              className={`fa-solid fa-star text-2xl ${currentValue >= value ? "text-amber-400" : "text-slate-200"}`}
                            ></i>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-6  md:p-8">
              <SectionHeader
                icon="fa-pen"
                iconWrap="bg-green-50 text-green-600"
                title="Write your review"
                subtitle="Help juniors understand the reality."
              />
              <hr className="mb-8 border-slate-100" />

              <ReviewTextarea
                label="What is the best thing about this college?"
                badge="PROS"
                badgeClass="bg-green-100 text-green-700"
                value={pros}
                onChange={setPros}
                placeholder="Eg. Supportive faculty, good library environment"
                required
              />
              <ReviewTextarea
                label="What is the worst thing about this college?"
                badge="CONS"
                badgeClass="bg-red-100 text-red-700"
                value={cons}
                onChange={setCons}
                placeholder="Eg. Lack of practical classes, poor cafeteria facilities"
                required
              />

              <div>
                <label className="mb-3 block text-sm font-bold text-slate-900">
                  Review Title (Summary) <span className="text-red-500">*</span>
                </label>
                <input
                  value={summaryTitle}
                  onChange={(event) => setSummaryTitle(event.target.value)}
                  placeholder="Eg. Great learning environment but needs better infrastructure"
                  className="w-full rounded-md border border-slate-200 bg-white p-4 text-sm placeholder-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-6  md:p-8">
              <SectionHeader
                icon="fa-book-open"
                iconWrap="bg-purple-50 text-purple-600"
                title="Evidence & Facts (Optional)"
                subtitle="Helps others understand costs and outcomes."
              />
              <hr className="mb-8 border-slate-100" />

              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field label="Approx Yearly Fee (NPR)">
                  <input
                    type="number"
                    value={yearlyFee}
                    onChange={(event) => setYearlyFee(event.target.value)}
                    placeholder="e.g. 150000"
                    className="w-full rounded-md border border-slate-200 bg-white p-4 text-sm placeholder-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </Field>
                <Field label="Scholarship Received?">
                  <select
                    value={scholarship}
                    onChange={(event) => setScholarship(event.target.value)}
                    className="w-full cursor-pointer appearance-none rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-600 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </Field>
              </div>

              <Field label="Internship / Job Outcome">
                <select
                  value={internshipOutcome}
                  onChange={(event) => setInternshipOutcome(event.target.value)}
                  className="w-full cursor-pointer appearance-none rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-600 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select outcome</option>
                  <option value="excellent">Excellent Placements</option>
                  <option value="good">Good Opportunities</option>
                  <option value="average">
                    Average / Requires Self Effort
                  </option>
                  <option value="poor">Poor / No Campus Placements</option>
                </select>
              </Field>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-6  md:p-8">
              <SectionHeader
                icon="fa-lock"
                iconWrap="bg-slate-100 text-blue-600"
                title="Verification"
                subtitle="Helps others understand costs and outcomes."
              />
              <hr className="mb-8 border-slate-100" />

              <p className="mb-6 text-sm leading-relaxed text-slate-700">
                To maintain the quality of reviews on MeroCollege, we require
                proof that you actually studied here.{" "}
                <strong>
                  Your documents are strictly private and will never be
                  published.
                </strong>
              </p>

              <div className="mb-6">
                <label className="mb-3 block text-sm font-bold text-slate-900">
                  College / Personal Email{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full rounded-md border border-slate-200 bg-white p-4 text-sm placeholder-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-2 text-xs font-medium text-slate-400">
                  We may send a verification link to this email.
                </p>
              </div>

              <div className="mb-8 flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={certify}
                  onChange={(event) => setCertify(event.target.checked)}
                  className="mt-1 h-5 w-5 cursor-pointer rounded border border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="cursor-pointer text-sm leading-relaxed text-slate-500">
                  I certify that this review is based on my genuine experience
                  and I have not been paid to write this. I agree to the{" "}
                  <span className="font-semibold text-blue-600">
                    Terms of Service
                  </span>
                  . <span className="text-red-500">*</span>
                </label>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-md bg-blue-600 px-8 py-3 font-bold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <span>Submit Review</span>
                </button>
              </div>
            </section>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-6 overflow-hidden rounded-md border border-slate-200 bg-white ">
              <div className="rounded-t-2xl bg-[#111827] p-8 text-center text-white">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-200">
                  Live Rating Preview
                </h3>
                <div className="mb-4 text-5xl font-extrabold">
                  {averageRating.toFixed(1)}
                  <span className="text-3xl text-slate-400">/5</span>
                </div>
                <div className="mb-4 flex h-10 items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <i
                      key={value}
                      className={`fa-solid fa-star text-2xl ${Math.round(averageRating) >= value ? "text-amber-400" : "text-slate-600 opacity-50"}`}
                    ></i>
                  ))}
                </div>
                <p className="text-sm font-medium text-slate-400">
                  Start Rating...
                </p>
              </div>

              <div className="space-y-6 p-6">
                <ProgressRow label="Academics & Faculty" value={academicsAvg} />
                <ProgressRow
                  label="Infrastructure & Labs"
                  value={infrastructureAvg}
                />
                <ProgressRow label="Social & Campus Life" value={socialAvg} />
              </div>

              <div className="flex items-center justify-center gap-2 border-t border-slate-100 bg-slate-50 p-4">
                <i className="fa-solid fa-lock text-xs text-slate-400"></i>
                <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  This Preview Updates as you type.
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-md bg-white p-6 text-center shadow-xl">
            <div
              className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${modal.type === "error" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}
            >
              <i
                className={`fa-solid ${modal.type === "error" ? "fa-circle-exclamation" : "fa-circle-check"} text-2xl`}
              ></i>
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-900">
              {modal.title}
            </h3>
            <p className="mb-6 text-sm text-slate-500">{modal.message}</p>
            <button
              type="button"
              onClick={() => setModal((prev) => ({ ...prev, open: false }))}
              className="w-full rounded-md bg-slate-900 px-4 py-3 font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const SectionHeader: React.FC<{
  icon: string;
  iconWrap: string;
  title: string;
  subtitle: string;
}> = ({ icon, iconWrap, title, subtitle }) => (
  <div className="mb-6 flex items-center gap-4">
    <div
      className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${iconWrap}`}
    >
      <i className={`fa-solid ${icon}`}></i>
    </div>
    <div>
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      <p className="text-sm text-slate-500">{subtitle}</p>
    </div>
  </div>
);

const TypeButton: React.FC<{
  active: boolean;
  onClick: () => void;
  label: string;
}> = ({ active, onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex flex-col items-center justify-center rounded-md border-2 px-4 py-8 transition-all ${active ? "border-blue-600 bg-blue-50 text-blue-700 " : "border-slate-100 text-slate-700 hover:border-slate-200 hover:bg-slate-50"}`}
  >
    <i
      className={`fa-solid fa-graduation-cap mb-3 text-2xl ${active ? "text-blue-600" : "text-slate-800"}`}
    ></i>
    <span className="font-semibold">{label}</span>
  </button>
);

const ReviewTextarea: React.FC<{
  label: string;
  badge: string;
  badgeClass: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
}> = ({ label, badge, badgeClass, value, onChange, placeholder, required }) => (
  <div className="mb-8">
    <div className="mb-3 flex items-center gap-3">
      <span
        className={`rounded px-2 py-0.5 text-[11px] font-bold tracking-wider ${badgeClass}`}
      >
        {badge}
      </span>
      <label className="text-sm font-bold text-slate-900">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>
    </div>
    <textarea
      rows={4}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full resize-none rounded-md border border-slate-200 bg-white p-4 text-sm placeholder-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div>
    <label className="mb-3 block text-sm font-bold text-slate-900">
      {label}
    </label>
    {children}
  </div>
);

const ProgressRow: React.FC<{ label: string; value: number }> = ({
  label,
  value,
}) => (
  <div>
    <div className="mb-2 flex items-center justify-between">
      <span className="text-sm font-bold text-slate-800">{label}</span>
    </div>
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full bg-blue-500 transition-all duration-500 ease-out"
        style={{ width: `${(value / 5) * 100}%` }}
      />
    </div>
  </div>
);

export default WriteReviewPage;
