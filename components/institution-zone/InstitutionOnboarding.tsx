"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/services/api";

const TOTAL_STEPS = 8;

const steps = [
  {
    id: 1,
    question: "What type of college experience does your college offer?",
    type: "radio" as const,
    name: "experience_type",
    options: [
      {
        value: "Academic Excellence",
        title: "Academic Excellence",
        desc: "Strong academics, experienced faculty, competitive results.",
      },
      {
        value: "Vibrant Campus Life",
        title: "Vibrant Campus Life",
        desc: "Events, clubs, networking, and activities beyond classrooms.",
      },
      {
        value: "Career & Industry Focused",
        title: "Career & Industry Focused",
        desc: "Internships, practical learning, job placement focus.",
      },
      {
        value: "Holistic & Balanced",
        title: "Holistic & Balanced",
        desc: "Academics, campus life, activities, and career combined.",
      },
    ],
  },
  {
    id: 2,
    question:
      "How does your college support students with their education costs?",
    type: "radio" as const,
    name: "affordability",
    options: [
      {
        value: "Scholarship-Focused",
        title: "Scholarship-Focused",
        desc: "Merit and need-based scholarships for students.",
      },
      {
        value: "Affordable Fees",
        title: "Affordable Fees",
        desc: "Transparent, affordable tuition for quality education.",
      },
      {
        value: "Premium / Full-Fee",
        title: "Premium / Full-Fee",
        desc: "Premium experience with full tuition structure.",
      },
      {
        value: "Multiple Financial Support Options",
        title: "Multiple Financial Support Options",
        desc: "Scholarships, aid, discounts, and flexible payments.",
      },
    ],
  },
  {
    id: 3,
    question: "How would you describe your college's reputation?",
    type: "radio" as const,
    name: "reputation",
    options: [
      {
        value: "Highly Reputed",
        title: "Highly Reputed",
        desc: "Recognized for academic quality and outcomes.",
      },
      {
        value: "Well Established",
        title: "Well Established",
        desc: "Strong presence and community reputation.",
      },
      {
        value: "Growing & Emerging",
        title: "Growing & Emerging",
        desc: "Developing institution improving continuously.",
      },
      {
        value: "Specialized Reputation",
        title: "Specialized Reputation",
        desc: "Known for specific programs or expertise.",
      },
    ],
  },
  {
    id: 4,
    question: "What type of classroom environment does your college offer?",
    type: "radio" as const,
    name: "class_size",
    options: [
      {
        value: "Small Classes",
        title: "Small Classes",
        desc: "Individual attention and personalized support.",
      },
      {
        value: "Medium-Sized Classes",
        title: "Medium-Sized Classes",
        desc: "Balanced interaction and group learning.",
      },
      {
        value: "Large Batches",
        title: "Large Batches",
        desc: "Diverse communities and broad networking.",
      },
      {
        value: "Mixed Class Sizes",
        title: "Mixed Class Sizes",
        desc: "Varies by program, both personalized and community.",
      },
    ],
  },
  {
    id: 5,
    question: "What does your college prioritize most?",
    type: "radio" as const,
    name: "priority",
    options: [
      {
        value: "Academic Excellence",
        title: "Academic Excellence",
        desc: "Emphasis on performance, rigor, and outcomes.",
      },
      {
        value: "Vibrant Campus Life",
        title: "Vibrant Campus Life",
        desc: "Activities, events, clubs, and campus experience.",
      },
      {
        value: "Balanced Experience",
        title: "Balanced Experience",
        desc: "Equal importance to academics and campus life.",
      },
    ],
  },
  {
    id: 6,
    question: "How active is your college outside the classroom?",
    type: "radio" as const,
    name: "activities",
    options: [
      {
        value: "Highly Active",
        title: "Highly Active",
        desc: "Strong sports, clubs, events, and extracurriculars.",
      },
      {
        value: "Moderately Active",
        title: "Moderately Active",
        desc: "Range of activities alongside academics.",
      },
      {
        value: "Academics-Focused",
        title: "Academics-Focused",
        desc: "Primary focus on academic learning.",
      },
      {
        value: "Well-Rounded",
        title: "Well-Rounded",
        desc: "Balanced academics, sports, and cultural events.",
      },
    ],
  },
  {
    id: 7,
    question: "What facilities does your college offer?",
    type: "checkbox" as const,
    name: "facilities",
    options: [
      {
        value: "Modern Labs & Technology",
        title: "Modern Labs & Technology",
        desc: "Labs, computers, smart classrooms, modern tech.",
      },
      {
        value: "Hostel & Accommodation",
        title: "Hostel & Accommodation",
        desc: "On-campus or nearby accommodation options.",
      },
      {
        value: "Library & Learning Resources",
        title: "Library & Learning Resources",
        desc: "Books, digital resources, and study spaces.",
      },
      {
        value: "Cafeteria & Student Amenities",
        title: "Cafeteria & Student Amenities",
        desc: "Cafeteria, common areas, and recreational spaces.",
      },
      {
        value: "Sports & Recreation",
        title: "Sports & Recreation",
        desc: "Sports grounds, fitness, and indoor/outdoor activities.",
      },
    ],
  },
  {
    id: 8,
    question:
      "How would you describe your college's approach to tuition and value?",
    type: "radio" as const,
    name: "tuition",
    options: [
      {
        value: "Affordable & Budget-Friendly",
        title: "Affordable & Budget-Friendly",
        desc: "Quality education at a reasonable cost.",
      },
      {
        value: "Quality-Focused",
        title: "Quality-Focused",
        desc: "Fees reflect quality education and experience.",
      },
      {
        value: "Scholarship-Dependent",
        title: "Scholarship-Dependent",
        desc: "Scholarships and aid reduce cost for eligible students.",
      },
      {
        value: "Value for Money",
        title: "Value for Money",
        desc: "Balance of tuition, quality, and student support.",
      },
    ],
  },
];

interface InstitutionOnboardingProps {
  onComplete: () => void;
}

export default function InstitutionOnboarding({
  onComplete,
}: InstitutionOnboardingProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selections, setSelections] = useState<Record<string, string[]>>({});

  const currentStepData = steps[currentStep - 1];

  const handleCheckboxToggle = (stepName: string, value: string) => {
    setSelections((prev) => {
      const current = prev[stepName] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [stepName]: updated };
    });
    setError("");
  };

  const handleRadioSelect = (stepName: string, value: string) => {
    setSelections((prev) => ({ ...prev, [stepName]: [value] }));
    setError("");
  };

  const isSelected = (stepName: string, value: string) => {
    return (selections[stepName] || []).includes(value);
  };

  const canProceed = () => {
    const currentSelections = selections[currentStepData.name] || [];
    return currentSelections.length > 0;
  };

  const handleNext = () => {
    if (!canProceed()) {
      setError("Please select at least one option to continue.");
      return;
    }
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
      setError("");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setError("");
    }
  };

  const handleSubmit = async () => {
    if (!canProceed()) {
      setError("Please select at least one option to continue.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const preferences: Record<string, any> = {};
      for (const step of steps) {
        const vals = selections[step.name] || [];
        if (step.type === "checkbox") {
          preferences[step.name] = vals;
        } else {
          preferences[step.name] = vals[0] || "";
        }
      }

      await authApi.saveInstitutionPreferences(preferences);
      onComplete();
    } catch (err: any) {
      setError(err.message || "Failed to save preferences. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: "1rem",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "520px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem 1.25rem",
            borderBottom: "1px solid #f1f1f4",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: "0.95rem",
              fontWeight: 700,
              color: "#111827",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            College Profile
            <span
              style={{
                color: "#6b7280",
                fontSize: "0.75rem",
                fontWeight: 500,
              }}
            >
              Step {currentStep}/{TOTAL_STEPS}
            </span>
          </div>
        </div>

        {/* Body */}
        <div
          style={{
            padding: "1.25rem",
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            key={currentStep}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem",
              animation: "fadeIn 0.2s ease-in-out",
            }}
          >
            <h2
              style={{
                color: "#111827",
                fontSize: "1rem",
                fontWeight: 700,
                lineHeight: 1.4,
                marginBottom: "0.25rem",
              }}
            >
              {currentStep}. {currentStepData.question}
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.4rem",
              }}
            >
              {currentStepData.options.map((option) => {
                const checked = isSelected(
                  currentStepData.name,
                  option.value,
                );
                return (
                  <label
                    key={option.value}
                    onClick={() =>
                      currentStepData.type === "checkbox"
                        ? handleCheckboxToggle(
                            currentStepData.name,
                            option.value,
                          )
                        : handleRadioSelect(
                            currentStepData.name,
                            option.value,
                          )
                    }
                    style={{
                      border: checked
                        ? "1.5px solid #0000ff"
                        : "1.5px solid #e5e7eb",
                      borderRadius: "10px",
                      padding: "0.7rem 0.85rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: checked ? "#f5f5ff" : "#fff",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.15rem",
                        paddingRight: "0.75rem",
                        flex: 1,
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 600,
                          color: "#111827",
                          fontSize: "0.8rem",
                        }}
                      >
                        {option.title}
                      </span>
                      <p
                        style={{
                          color: "#6b7280",
                          fontSize: "0.7rem",
                          lineHeight: 1.35,
                          margin: 0,
                        }}
                      >
                        {option.desc}
                      </p>
                    </div>
                    <div
                      style={{
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "18px",
                          height: "18px",
                          border: checked
                            ? "2px solid #0000ff"
                            : "2px solid #d1d5db",
                          borderRadius:
                            currentStepData.type === "checkbox"
                              ? "5px"
                              : "50%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: checked ? "#0000ff" : "#fff",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {currentStepData.type === "checkbox" ? (
                          checked && (
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 10 10"
                              fill="none"
                            >
                              <path
                                d="M2 5L4.5 7.5L8 3"
                                stroke="white"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )
                        ) : (
                          checked && (
                            <div
                              style={{
                                width: "6px",
                                height: "6px",
                                backgroundColor: "white",
                                borderRadius: "50%",
                              }}
                            />
                          )
                        )}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            {error && (
              <p
                style={{
                  color: "#ef4444",
                  fontSize: "0.75rem",
                  marginTop: "0.25rem",
                }}
              >
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "0.85rem 1.25rem",
            borderTop: "1px solid #f1f1f4",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  backgroundColor: "white",
                  color: "#111827",
                  border: "1px solid #e5e7eb",
                }}
              >
                Back
              </button>
            )}
            <button
              onClick={
                currentStep === TOTAL_STEPS ? handleSubmit : handleNext
              }
              disabled={loading}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                backgroundColor: "#0000ff",
                color: "white",
                border: "1px solid #0000ff",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading
                ? "Saving..."
                : currentStep === TOTAL_STEPS
                  ? "Submit"
                  : "Next"}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
