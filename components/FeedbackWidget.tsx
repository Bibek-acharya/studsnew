"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/services/AuthContext";

const faces = [
  { value: 5, color: "#1fc354", label: "Love" },
  { value: 4, color: "#8ee034", label: "Happy" },
  { value: 3, color: "#ffda3b", label: "Neutral" },
  { value: 2, color: "#f88b30", label: "Sad" },
  { value: 1, color: "#eb3323", label: "Hate" },
];

const FaceIcon = ({ face, selected }: { face: typeof faces[0]; selected: boolean }) => {
  const basePath = "M 26 58 Q 50 88 74 58 Z";
  const sadPath = "M 30 70 Q 50 50 70 70";
  const hatePath = "M 26 76 Q 50 48 74 76 Z";
  const neutralLine = <line x1="30" y1="64" x2="70" y2="64" stroke="#000" strokeWidth="4.5" strokeLinecap="round" />;
  const happySmile = <path d="M 28 62 Q 50 80 72 62" stroke="#000" strokeWidth="4.5" strokeLinecap="round" fill="none" />;

  return (
    <svg viewBox="0 0 100 100" className={`w-10 h-10 transition-all duration-200 ${selected ? "scale-115 drop-" : ""}`}>
      <circle cx="50" cy="50" r="50" fill={face.color} />
      <circle cx="33" cy="42" r="5.5" fill="#000" />
      <circle cx="67" cy="42" r="5.5" fill="#000" />
      {face.value === 5 && <path d={basePath} fill="#000" />}
      {face.value === 4 && happySmile}
      {face.value === 3 && neutralLine}
      {face.value === 2 && <path d={sadPath} stroke="#000" strokeWidth="4.5" strokeLinecap="round" fill="none" />}
      {face.value === 1 && <path d={hatePath} fill="#000" />}
    </svg>
  );
};

export default function FeedbackWidget() {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [rating, setRating] = useState<number | null>(null);
  const [experience, setExperience] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      setIsOpen(false);
      setStep(1);
      setRating(null);
      setExperience("");
      setEmail("");
    }
  }, [isAuthenticated]);

  const handleRating = (value: number) => {
    setRating(value);
  };

  const nextStep = () => {
    if (step === 1 && !rating) {
      return;
    }
    setStep(step + 1);
  };

  const skipEmail = () => {
    setEmail("");
    setStep(4);
  };

  const submitFeedback = () => {
    console.log("Feedback Submitted:", { rating, experience, email });
    setStep(4);
  };

  const closeWidget = () => {
    setIsOpen(false);
  };

  const resetForm = () => {
    setStep(1);
    setRating(null);
    setExperience("");
    setEmail("");
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex flex-col justify-between h-full flex-grow">
            <h2 className="text-[#202124] text-[15px] font-semibold mb-2 tracking-tight">
              How would you rate your experience?
            </h2>
            <div className="w-full mb-2">
              <div className="flex justify-between items-center px-1 mb-1">
                {faces.map((face) => (
                  <button
                    key={face.value}
                    onClick={() => handleRating(face.value)}
                    className={`transition-all duration-200 ${rating === face.value ? "scale-115 drop-" : rating ? "opacity-40 grayscale-[80%] scale-95" : ""}`}
                    aria-label={face.label}
                  >
                    <FaceIcon face={face} selected={rating === face.value} />
                  </button>
                ))}
              </div>
              <div className="flex justify-between w-full text-[12px] text-[#9aa0a6] font-medium px-2">
                <span>Love</span>
                <span>Hate</span>
              </div>
            </div>
            <div className="flex justify-end mt-auto pt-1">
              <button
                onClick={nextStep}
                disabled={!rating}
                className="bg-brand-blue hover:bg-brand-hover disabled:bg-blue-300 text-white px-4 py-1.5 rounded-md font-medium text-[14px] transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col h-full flex-grow">
            <h2 className="text-[#202124] text-[13px] font-semibold mb-2 tracking-tight">
              Tell us about your experience...
            </h2>
            <textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full border border-gray-200 rounded-md p-2 text-[13px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none h-[60px] mb-2"
              placeholder="Share your experience..."
            />
            <div className="flex justify-end mt-auto">
              <button
                onClick={nextStep}
                className="bg-brand-blue hover:bg-brand-hover text-white px-4 py-1.5 rounded-md font-medium text-[14px] transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col h-full flex-grow">
            <h2 className="text-[#202124] text-[13px] font-semibold mb-2 tracking-tight leading-snug">
              We may wish to follow up. Enter your email if you&apos;re happy for us to contact you.
            </h2>
            <textarea
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-md p-2 text-[13px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none h-[60px] mb-2"
              placeholder="Enter your email (optional)..."
            />
            <div className="flex justify-end items-center gap-4 mt-auto">
              <button
                onClick={skipEmail}
                className="text-[#70757a] hover:text-gray-900 font-medium text-[13px] transition-colors"
              >
                Skip
              </button>
              <button
                onClick={submitFeedback}
                className="bg-brand-blue hover:bg-brand-hover text-white px-4 py-1.5 rounded-md font-medium text-[14px] transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col justify-center items-center h-full flex-grow py-2">
            <h2 className="text-[#202124] text-[14px] font-semibold mb-4 tracking-tight text-center px-4">
              Thank you for sharing your feedback with us!
            </h2>
            <button
              onClick={closeWidget}
              className="bg-brand-blue hover:bg-brand-hover text-white w-full py-2 rounded-md font-medium text-[14px] transition-colors mt-auto"
            >
              Close
            </button>
          </div>
        );
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="absolute left-0 top-1/2 -translate-y-1/2 z-50">
      <div className="flex items-stretch">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-brand-blue hover:bg-brand-hover text-white flex flex-col items-center justify-center w-[42px] rounded-r-md cursor-pointer transition-colors shadow-[4px_0_15px_rgba(0,0,0,0.1)] relative z-20 focus:outline-none py-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-5 h-5 mb-2 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span
            className="vertical-text font-medium text-[15px] tracking-wide mt-1"
            style={{ writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)" }}
          >
            Feedback
          </span>
        </button>

        <div 
          className={`bg-white transition-all duration-300 ease-in-out overflow-hidden rounded-r-lg shadow-xl relative z-10 flex items-stretch -ml-[2px] ${
            isOpen ? "w-[340px] opacity-100" : "w-0 opacity-0"
          }`}
        >
          <div className="w-[340px] min-w-[340px] py-3 px-5 flex flex-col h-full">
            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  );
}