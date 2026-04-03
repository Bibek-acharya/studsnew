"use client";

import React, { useEffect, useMemo, useState } from "react";

interface ScholarshipApplicationPageProps {
  onNavigate?: (view: string, data?: any) => void;
  scholarshipId?: string | null;
  scholarshipName?: string;
  onClose?: () => void;
  returnTo?: string;
  returnToData?: any;
}

type PaymentMethod = "" | "esewa" | "khalti" | "ime" | "manual";

const totalSteps = 5;
const stepTitles = ["Personal Info", "Background", "Documents", "Payment", "Review"];

const ScholarshipApplicationPage: React.FC<ScholarshipApplicationPageProps> = ({
  onNavigate,
  scholarshipId,
  scholarshipName,
  onClose,
  returnTo = "scholarshipHubDetails",
  returnToData,
}) => {
  const resolvedScholarshipId = scholarshipId || null;
  const resolvedScholarshipName = scholarshipName || "Scholarship Application";

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("Unpaid");

  const [fullName, setFullName] = useState({ firstName: "", lastName: "" });
  const [email, setEmail] = useState("");
  const [education, setEducation] = useState("Bachelor's in CS");

  const stepProgress = useMemo(() => Math.round((currentStep / totalSteps) * 100), [currentStep]);

  useEffect(() => {
    const container = document.getElementById("scholarship-application-scroll");
    if (container) {
      container.scrollTop = 0;
    }
  }, [currentStep]);

  const closeModal = () => {
    if (onClose) {
      onClose();
      return;
    }

    if (!onNavigate) return;

    const returnPayload = returnToData || (resolvedScholarshipId ? { id: String(resolvedScholarshipId) } : undefined);
    onNavigate(returnTo, returnPayload);
  };

  const selectPayment = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
  };

  const submitForm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      closeModal();
    }, 1400);
  };

  const handleNext = () => {
    if (currentStep === 4) {
      if (!selectedPaymentMethod) {
        return;
      }

      if (selectedPaymentMethod !== "manual") {
        setIsRedirecting(true);
        setTimeout(() => {
          setIsRedirecting(false);
          setPaymentStatus(`Paid via ${selectedPaymentMethod.toUpperCase()}`);
          setCurrentStep(5);
        }, 1800);
        return;
      }

      setPaymentStatus("Voucher Uploaded");
    }

    if (currentStep === totalSteps) {
      submitForm();
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const goToStep = (step: number) => {
    if (step < 1 || step > totalSteps) return;
    setCurrentStep(step);
  };

  const renderStepCircle = (step: number) => {
    const isComplete = step < currentStep;
    const isActive = step === currentStep;

    if (isComplete) {
      return (
        <div className="relative z-10 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shadow-sm shrink-0">
          <i className="fa-solid fa-check text-xs"></i>
        </div>
      );
    }

    if (isActive && step === 1) {
      return (
        <div className="relative z-10 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30 shrink-0">
          <i className="fa-solid fa-user text-xs"></i>
        </div>
      );
    }

    if (isActive) {
      return (
        <div className="relative z-10 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30 shrink-0">
          <span className="text-xs font-bold">{step}</span>
        </div>
      );
    }

    return (
      <div className="relative z-10 w-8 h-8 rounded-full bg-white border-2 border-slate-300 text-slate-400 flex items-center justify-center shrink-0">
        <span className="text-xs font-bold">{step}</span>
      </div>
    );
  };

  const paymentButtonLabel = useMemo(() => {
    if (currentStep === totalSteps) return "Submit Application";
    if (currentStep === 4 && selectedPaymentMethod && selectedPaymentMethod !== "manual") {
      const names = { esewa: "eSewa", khalti: "Khalti", ime: "IME Pay", manual: "Bank Voucher" } as const;
      return `Pay with ${names[selectedPaymentMethod]}`;
    }
    return "Next Step";
  }, [currentStep, selectedPaymentMethod]);

  const summaryName = `${fullName.firstName || "Sarah"} ${fullName.lastName || "Connor"}`;

  return (
    <div className="fixed inset-0 z-[120] bg-black/45 backdrop-blur-[2px] flex items-center justify-center p-4">
      {isRedirecting && (
        <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <h3 className="text-xl font-bold text-slate-800">Redirecting to Payment Gateway...</h3>
          <p className="text-slate-500 mt-2">Please do not close this window.</p>
        </div>
      )}

      <div className="relative w-full max-w-6xl h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        <div className="hidden md:flex w-1/3 bg-slate-50 border-r border-slate-200 flex-col relative h-full">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          <div className="p-8 pb-4 relative z-10 shrink-0">
            <div className="flex items-center gap-3 mb-6 text-blue-700">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-blue-100">
                <i className="fa-solid fa-graduation-cap text-blue-600"></i>
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">ScholarHub</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 leading-tight">Complete your<br />application</h2>
            <p className="text-slate-500 text-sm mt-2">Track your progress via the steps below.</p>
          </div>

          <div className="flex-1 px-8 py-2 overflow-y-auto relative">
            <div className="space-y-0">
              {stepTitles.map((title, index) => {
                const step = index + 1;
                const isCurrent = step === currentStep;

                return (
                  <button
                    key={title}
                    type="button"
                    onClick={() => goToStep(step)}
                    className="step-item relative w-full text-left pb-8 flex gap-4 group"
                  >
                    {step !== totalSteps && (
                      <div
                        className={`absolute left-[15px] top-9 bottom-[-10px] w-[2px] ${step <= currentStep ? "bg-blue-600" : "bg-slate-200"}`}
                      ></div>
                    )}
                    {renderStepCircle(step)}
                    <div className="pt-1">
                      <p className={`text-sm transition-colors ${isCurrent ? "font-bold text-slate-900" : "font-medium text-slate-500"}`}>
                        {title}
                      </p>
                      <p className="text-xs text-slate-400">
                        {step === 1 && "Basic details & contact"}
                        {step === 2 && "Education & history"}
                        {step === 3 && "Upload transcripts"}
                        {step === 4 && "Secure gateway"}
                        {step === 5 && "Final check"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white relative h-full overflow-hidden">
          <button
            onClick={closeModal}
            className="hidden md:flex absolute top-6 right-6 z-20 w-10 h-10 bg-white hover:bg-slate-50 rounded-full items-center justify-center text-slate-400 hover:text-slate-600 border border-slate-100 shadow-sm transition-colors"
            title="Close"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          <div id="scholarship-application-scroll" className="flex-1 overflow-y-auto p-6 md:p-12">
            <form className="max-w-2xl mx-auto space-y-8 pb-4" onSubmit={(e) => e.preventDefault()}>
              {currentStep === 1 && (
                <div>
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-slate-900">Personal Information</h3>
                    <p className="text-slate-500 mt-1">Please provide your legal identification details.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">First Name</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                          placeholder="e.g., Sarah"
                          value={fullName.firstName}
                          onChange={(e) => setFullName((prev) => ({ ...prev, firstName: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">Last Name</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                          placeholder="e.g., Connor"
                          value={fullName.lastName}
                          onChange={(e) => setFullName((prev) => ({ ...prev, lastName: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Email Address</label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                        placeholder="sarah@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
              {currentStep === 2 && (
                <div>
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-slate-900">Academic Background</h3>
                    <p className="text-slate-500 mt-1">Tell us about your educational history.</p>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Institution Name</label>
                      <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100" placeholder="University or College" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Degree Level</label>
                      <select
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                        onChange={(e) => setEducation(`${e.target.value} in CS`)}
                      >
                        <option>High School Diploma</option>
                        <option>Bachelor's Degree</option>
                        <option>Master's Degree</option>
                        <option>PhD</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
              {currentStep === 3 && (
                <div>
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-slate-900">Upload Documents</h3>
                    <p className="text-slate-500 mt-1">Upload your required files for verification.</p>
                  </div>
                  <div className="space-y-5">
                    {["Academic Transcript", "Letter of Recommendation"].map((label, index) => (
                      <div key={label} className="p-5 border border-slate-200 rounded-xl bg-slate-50/50">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold text-slate-800">{label}</h4>
                        </div>
                        <div className="relative h-28 rounded-lg border-2 border-dashed border-slate-300 bg-white hover:bg-blue-50 hover:border-blue-300 transition-colors flex items-center justify-center text-center cursor-pointer">
                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" title={label} />
                          <p className="text-sm text-slate-600">Click or drag to upload</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {currentStep === 4 && (
                <div>
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-slate-900">Payment Gateway</h3>
                    <p className="text-slate-500 mt-1">Select a secure payment method.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {["esewa", "khalti", "ime", "manual"].map((method) => (
                      <button
                        key={method}
                        onClick={() => selectPayment(method as PaymentMethod)}
                        className={`p-4 border-2 rounded-xl text-center capitalize ${selectedPaymentMethod === method ? "border-blue-600 bg-blue-50" : "border-slate-200"}`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {currentStep === 5 && (
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-900">Review Application</h3>
                  <div className="mt-6 p-6 bg-slate-50 rounded-xl text-left space-y-4">
                    <p><strong>Name:</strong> {summaryName}</p>
                    <p><strong>Email:</strong> {email || "sarah@example.com"}</p>
                    <p><strong>Education:</strong> {education}</p>
                    <p><strong>Payment Status:</strong> {paymentStatus}</p>
                  </div>
                </div>
              )}
            </form>
          </div>

          <div className="bg-white p-5 border-t border-slate-100 flex justify-between items-center">
            <button onClick={handlePrev} className={`px-6 py-2 rounded-lg ${currentStep === 1 ? "invisible" : "visible"}`}>Back</button>
            <button onClick={handleNext} disabled={isSubmitting || (currentStep === 4 && !selectedPaymentMethod)} className="bg-blue-600 text-white px-8 py-2.5 rounded-lg">
              {isSubmitting ? "Processing..." : paymentButtonLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipApplicationPage;
