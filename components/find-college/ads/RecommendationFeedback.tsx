"use client";

import { Check, CheckCheck, CheckCircle } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { FaCheckCircle } from "react-icons/fa";

const RecommendationFeedback: React.FC = () => {
  const [selection, setSelection] = useState<"up" | "down" | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showLikeModal, setShowLikeModal] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });

  const [checkboxes, setCheckboxes] = useState({
    notInterested: false,
    wrongLocation: false,
    outOfBudget: false,
    alreadyAdmitted: false,
    other: false,
  });
  const [otherText, setOtherText] = useState("");
  const [likeText, setLikeText] = useState("");

  const specificChecked =
    checkboxes.notInterested ||
    checkboxes.wrongLocation ||
    checkboxes.outOfBudget ||
    checkboxes.alreadyAdmitted;

  const canSubmit = specificChecked || checkboxes.other;

  const toggleBodyScroll = useCallback((disable: boolean) => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = disable ? "hidden" : "";
    }
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showModal) setShowModal(false);
        if (showLikeModal) setShowLikeModal(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showModal, showLikeModal]);

  useEffect(() => {
    if (showModal || showLikeModal) {
      toggleBodyScroll(true);
    } else {
      toggleBodyScroll(false);
    }
  }, [showModal, showLikeModal, toggleBodyScroll]);

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 2500);
  };

  const handleThumbDown = () => {
    if (selection === "down") {
      setSelection(null);
    } else {
      setSelection("down");
      setShowModal(true);
    }
  };

  const handleThumbUp = () => {
    if (selection === "up") {
      setSelection(null);
    } else {
      setSelection("up");
      setShowLikeModal(true);
    }
  };

  const handleCheckboxChange = (key: keyof typeof checkboxes) => {
    if (key === "other") {
      setCheckboxes((prev) => ({ ...prev, other: !prev.other }));
    } else {
      setCheckboxes((prev) => {
        const newState = { ...prev, [key]: !prev[key] };
        if (!prev[key]) {
          newState.other = false;
          setOtherText("");
        }
        return newState;
      });
    }
  };

  const handleSubmitFeedback = () => {
    setShowModal(false);
    showToast("Thank you, we value your feedback");
    setCheckboxes({
      notInterested: false,
      wrongLocation: false,
      outOfBudget: false,
      alreadyAdmitted: false,
      other: false,
    });
    setOtherText("");
  };

  const handleSubmitLike = () => {
    setShowLikeModal(false);
    showToast("Thank you, we value your feedback");
    setLikeText("");
  };

  return (
    <>
      <div className="bg-white px-6 sm:px-8 py-5 w-full rounded-md border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all">
        <span className="text-[#0c1844] font-semibold text-[16px] text-center sm:text-left leading-snug tracking-tight">
          Are these colleges relevant to your location and interests?
        </span>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleThumbDown}
            className={`flex items-center justify-center w-[38px] h-[38px] rounded-full border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-200 ${
              selection === "down"
                ? "bg-[#fef2f2] text-red-600"
                : "hover:bg-gray-100 hover:scale-105 active:scale-95"
            }`}
            style={{
              color: selection === "down" ? undefined : "#374151",
            }}
            aria-label="Not relevant"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={selection === "down" ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 14V2" />
              <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
            </svg>
          </button>

          <button
            onClick={handleThumbUp}
            className={`flex items-center justify-center w-[38px] h-[38px] rounded-full border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 ${
              selection === "up"
                ? "bg-[#eff6ff] text-blue-600"
                : "hover:bg-gray-100 hover:scale-105 active:scale-95"
            }`}
            style={{
              color: selection === "up" ? undefined : "#374151",
            }}
            aria-label="Relevant"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={selection === "up" ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 10v12" />
              <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Dislike Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-gray-900/30 backdrop-blur-[2px] flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-md shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] w-[550px] max-w-[95vw] p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[20px] font-bold tracking-tight text-[#0c1844]">
                What went wrong?
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-red-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-2 space-y-0">
              <label
                className={`flex items-center space-x-4 cursor-pointer py-3.5 border-b border-gray-100 group ${
                  checkboxes.other ? "opacity-50" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={checkboxes.notInterested}
                  disabled={checkboxes.other}
                  onChange={() => handleCheckboxChange("notInterested")}
                  className="w-4.5 h-4.5 rounded border-gray-300 text-[#0000ff]  accent-[#0000ff] cursor-pointer transition-all"
                />
                <span className="text-gray-700 text-[15px] group-hover:text-gray-900 transition-colors">
                  I am not interested in this Course / Degree
                </span>
              </label>
              <label
                className={`flex items-center space-x-4 cursor-pointer py-3.5 border-b border-gray-100 group ${
                  checkboxes.other ? "opacity-50" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={checkboxes.wrongLocation}
                  disabled={checkboxes.other}
                  onChange={() => handleCheckboxChange("wrongLocation")}
                  className="w-4.5 h-4.5 rounded border-gray-300 text-[#0000ff]  accent-[#0000ff] cursor-pointer transition-all"
                />
                <span className="text-gray-700 text-[15px] group-hover:text-gray-900 transition-colors">
                  Colleges shown are not in my location of preference
                </span>
              </label>
              <label
                className={`flex items-center space-x-4 cursor-pointer py-3.5 border-b border-gray-100 group ${
                  checkboxes.other ? "opacity-50" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={checkboxes.outOfBudget}
                  disabled={checkboxes.other}
                  onChange={() => handleCheckboxChange("outOfBudget")}
                  className="w-4.5 h-4.5 rounded border-gray-300 text-[#0000ff]  accent-[#0000ff] cursor-pointer transition-all"
                />
                <span className="text-gray-700 text-[15px] group-hover:text-gray-900 transition-colors">
                  The fees for colleges are out of my budget
                </span>
              </label>
              <label
                className={`flex items-center space-x-4 cursor-pointer py-3.5 border-b border-gray-100 group ${
                  checkboxes.other ? "opacity-50" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={checkboxes.alreadyAdmitted}
                  disabled={checkboxes.other}
                  onChange={() => handleCheckboxChange("alreadyAdmitted")}
                  className="w-4.5 h-4.5 rounded border-gray-300 text-[#0000ff]  accent-[#0000ff] cursor-pointer transition-all"
                />
                <span className="text-gray-700 text-[15px] group-hover:text-gray-900 transition-colors">
                  I have already taken admission/shortlisted colleges
                </span>
              </label>
              <label
                className={`flex items-center space-x-4 cursor-pointer py-3.5 group ${
                  specificChecked ? "opacity-50" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={checkboxes.other}
                  disabled={specificChecked}
                  onChange={() => handleCheckboxChange("other")}
                  className="w-4.5 h-4.5 rounded border-gray-300 text-[#0000ff] accent-[#0000ff] cursor-pointer transition-all"
                />
                <span className="text-gray-700 text-[15px] group-hover:text-gray-900 transition-colors">
                  Other
                </span>
              </label>

              {checkboxes.other && (
                <div className="pb-2">
                  <textarea
                    value={otherText}
                    onChange={(e) => setOtherText(e.target.value)}
                    rows={3}
                    className="w-full text-[15px] p-4 border border-gray-200 rounded-md focus:outline-none focus:border-[#0000ff] focus:ring-4 focus:ring-[#0000ff]/10 resize-none transition-all placeholder-gray-400"
                    placeholder="Please describe what went wrong..."
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end items-center mt-6 space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="text-[15px] text-gray-600 font-medium hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-md transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitFeedback}
                disabled={!canSubmit}
                className={`px-6 py-2.5 rounded-md text-[15px] font-semibold transition-all ${
                  canSubmit
                    ? "bg-[#0000ff] text-white  hover:bg-blue-800"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                Send feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Like Modal */}
      {showLikeModal && (
        <div
          className="fixed inset-0 bg-gray-900/30 backdrop-blur-[2px] flex items-center justify-center z-50"
          onClick={() => setShowLikeModal(false)}
        >
          <div
            className="bg-white rounded-md w-[550px] max-w-[95vw] p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[20px] font-bold tracking-tight text-[#0c1844]">
                Thanks! We value your feedback
              </h2>
              <button
                onClick={() => setShowLikeModal(false)}
                className="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-2 rounded-full transition-all focus:outline-none "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-2">
              <textarea
                value={likeText}
                onChange={(e) => setLikeText(e.target.value)}
                rows={4}
                className="w-full text-[15px] p-4 border border-gray-200 rounded-md focus:outline-none focus:border-[#0000ff]  resize-none transition-all placeholder-gray-400"
                placeholder="Write anything else you'd want us to know"
              />
            </div>

            <div className="flex justify-end items-center mt-6 space-x-4">
              <button
                onClick={() => setShowLikeModal(false)}
                className="text-[15px] text-gray-600 font-medium hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-md transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitLike}
                disabled={likeText.trim().length === 0}
                className={`px-6 py-2.5 rounded-md text-[15px] font-semibold transition-all ${
                  likeText.trim().length > 0
                    ? "bg-[#0000ff] text-white hover:bg-blue-800"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                Send feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-[#0000ff] text-white px-6 py-3.5 rounded-md text-[15px] font-medium overflow-hidden min-w-[280px] flex items-center gap-3">
          <FaCheckCircle/>
          <span>{toast.message}</span>
          <div className="absolute bottom-0 left-0 h-1 bg-white opacity-40 w-full animate-pulse" />
        </div>
      )}
    </>
  );
};

export default RecommendationFeedback;