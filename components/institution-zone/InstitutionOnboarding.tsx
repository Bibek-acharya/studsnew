"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/services/api";

const TOTAL_STEPS = 8;

const steps = [
  {
    id: 1,
    question: "What type of college experience does your college offer?",
    type: "checkbox" as const,
    name: "experience",
    options: [
      {
        value: "Academic Excellence",
        title: "Academic Excellence",
        desc: "Strong academics, experienced faculty, and competitive results.",
      },
      {
        value: "Vibrant Campus Life",
        title: "Vibrant Campus Life",
        desc: "Active environment with events, clubs, and networking.",
      },
      {
        value: "Career & Industry Focused",
        title: "Career & Industry Focused",
        desc: "Prioritize internships, practical learning, and job placement.",
      },
      {
        value: "Holistic & Balanced",
        title: "Holistic & Balanced",
        desc: "Balanced experience combining academics, life, and career.",
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
        desc: "Merit and need-based scholarships to manage expenses.",
      },
      {
        value: "Affordable Fees",
        title: "Affordable Fees",
        desc: "Transparent tuition fees making quality education accessible.",
      },
      {
        value: "Premium / Full-Fee",
        title: "Premium / Full-Fee",
        desc: "Premium educational experience with full tuition structure.",
      },
      {
        value: "Multiple Options",
        title: "Multiple Financial Options",
        desc: "Scholarships, aid, and flexible payment options.",
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
        desc: "Widely recognized for academic quality and graduate outcomes.",
      },
      {
        value: "Well Established",
        title: "Well Established",
        desc: "Recognized institution with strong community presence.",
      },
      {
        value: "Growing & Emerging",
        title: "Growing & Emerging",
        desc: "Developing institution focused on improving facilities.",
      },
      {
        value: "Specialized",
        title: "Specialized Reputation",
        desc: "Particularly well known for specific expertise.",
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
        desc: "Smaller sizes with personalized support and individual attention.",
      },
      {
        value: "Medium-Sized",
        title: "Medium-Sized Classes",
        desc: "Balanced environment providing faculty interaction.",
      },
      {
        value: "Large Batches",
        title: "Large Batches",
        desc: "Diverse communities and broad networking opportunities.",
      },
      {
        value: "Mixed",
        title: "Mixed Class Sizes",
        desc: "Varies by program offering personalized and community learning.",
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
        desc: "Greater emphasis on academic performance and rigorous learning.",
      },
      {
        value: "Vibrant Campus Life",
        title: "Vibrant Campus Life",
        desc: "Emphasize student activities, clubs, sports, and experience.",
      },
      {
        value: "Balanced Experience",
        title: "Balanced Experience",
        desc: "Equal importance to academic excellence and campus life.",
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
        desc: "Strongly promote sports, clubs, events, and extracurriculars.",
      },
      {
        value: "Moderately Active",
        title: "Moderately Active",
        desc: "Provide a range of extracurricular activities alongside academics.",
      },
      {
        value: "Academics-Focused",
        title: "Academics-Focused",
        desc: "Primary focus is academic learning with limited activities.",
      },
      {
        value: "Well-Rounded",
        title: "Well-Rounded",
        desc: "Balanced combination of academics, sports, and cultural events.",
      },
    ],
  },
  {
    id: 7,
    question: "What facilities does your college offer?",
    type: "radio" as const,
    name: "facilities",
    options: [
      {
        value: "Modern Labs",
        title: "Modern Labs & Technology",
        desc: "Well-equipped labs, smart classrooms, and modern tech.",
      },
      {
        value: "Hostel",
        title: "Hostel & Accommodation",
        desc: "On-campus or nearby accommodation options for students.",
      },
      {
        value: "Library",
        title: "Library & Learning Resources",
        desc: "Well-equipped library with books and digital study spaces.",
      },
      {
        value: "Cafeteria",
        title: "Cafeteria & Student Amenities",
        desc: "Quality cafeteria, common areas, and essential facilities.",
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
        value: "Affordable",
        title: "Affordable & Budget-Friendly",
        desc: "Focus on keeping tuition affordable and reasonable.",
      },
      {
        value: "Quality-Focused",
        title: "Quality-Focused",
        desc: "Fees reflect premium quality education and facilities.",
      },
      {
        value: "Scholarship-Dependent",
        title: "Scholarship-Dependent",
        desc: "Significant financial aid to reduce cost for eligible students.",
      },
      {
        value: "Value for Money",
        title: "Value for Money",
        desc: "Strong balance between tuition, quality, and student support.",
      },
    ],
  },
];

export default function InstitutionOnboarding() {
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
      router.push("/institution-zone/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to save preferences. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "1rem",
        backgroundColor: "#f9fafb",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "360px",
          minHeight: "440px",
          display: "flex",
          flexDirection: "column",
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.75rem 1rem",
            borderBottom: "1px solid #f1f1f4",
          }}
        >
          <div
            style={{
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "#111827",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            College Recommender{" "}
            <span
              style={{
                color: "#6b7280",
                fontSize: "0.7rem",
                fontWeight: 500,
              }}
            >
              Step {currentStep}/{TOTAL_STEPS}
            </span>
          </div>
        </div>

        <div
          style={{
            padding: "0.85rem 1rem",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          <div
            key={currentStep}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              animation: "fadeIn 0.2s ease-in-out",
            }}
          >
            <h2
              style={{
                color: "#111827",
                fontSize: "0.85rem",
                fontWeight: 700,
                lineHeight: 1.3,
                marginBottom: "0.25rem",
              }}
            >
              {currentStep}. {currentStepData.question}
            </h2>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}
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
                        ? "1px solid #0000ff"
                        : "1px solid #e5e7eb",
                      borderRadius: "6px",
                      padding: "0.5rem 0.75rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: "#fff",
                      position: "relative",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.1rem",
                        paddingRight: "0.5rem",
                        flex: 1,
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 600,
                          color: "#111827",
                          fontSize: "0.75rem",
                        }}
                      >
                        {option.title}
                      </span>
                      <p
                        style={{
                          color: "#6b7280",
                          fontSize: "0.65rem",
                          lineHeight: 1.25,
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
                          width: "15px",
                          height: "15px",
                          border: checked
                            ? "2px solid #0000ff"
                            : "2px solid #d1d5db",
                          borderRadius:
                            currentStepData.type === "checkbox"
                              ? "4px"
                              : "50%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: checked ? "#0000ff" : "#fff",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {currentStepData.type === "checkbox" ? (
                          checked && (
                            <span
                              style={{
                                color: "white",
                                fontSize: "9px",
                                fontWeight: "bold",
                              }}
                            >
                              ✓
                            </span>
                          )
                        ) : (
                          checked && (
                            <div
                              style={{
                                width: "5px",
                                height: "5px",
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
                  fontSize: "0.7rem",
                  marginTop: "0.25rem",
                }}
              >
                {error}
              </p>
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "0.75rem 1rem",
          }}
        >
          <div style={{ display: "flex", gap: "0.4rem" }}>
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                style={{
                  padding: "0.4rem 0.85rem",
                  borderRadius: "6px",
                  fontSize: "0.7rem",
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
                padding: "0.4rem 0.85rem",
                borderRadius: "6px",
                fontSize: "0.7rem",
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
