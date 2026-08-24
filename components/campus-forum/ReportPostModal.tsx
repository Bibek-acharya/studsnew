"use client";

import React, { useState } from "react";
import { X, Flag } from "lucide-react";

interface ReportPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { reasons: string[]; otherText: string }) => Promise<void>;
}

const REASONS = [
  "Hate Speech or Inappropriate Language",
  "Privacy Violation or Personal Information",
  "Misleading or Spammy Content",
];

export default function ReportPostModal({ isOpen, onClose, onSubmit }: ReportPostModalProps) {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [otherReason, setOtherReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleReason = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason],
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit({ reasons: selectedReasons, otherText: otherReason });
    } finally {
      setIsSubmitting(false);
      setSelectedReasons([]);
      setOtherReason("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
            <Flag size={18} className="text-red-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Report Post</h2>
            <p className="text-sm text-gray-500">Help us understand what&apos;s wrong</p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {REASONS.map((reason) => (
            <label
              key={reason}
              className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedReasons.includes(reason)}
                onChange={() => toggleReason(reason)}
                className="h-4 w-4 rounded border-gray-300 text-[#0000ff] focus:ring-[#0000ff]"
              />
              <span className="text-sm text-gray-700">{reason}</span>
            </label>
          ))}
        </div>

        <input
          type="text"
          placeholder="Any other reason? (Optional)"
          value={otherReason}
          onChange={(e) => setOtherReason(e.target.value)}
          className="mt-4 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#0000ff] focus:ring-1 focus:ring-[#0000ff] transition-colors"
        />

        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={(selectedReasons.length === 0 && !otherReason.trim()) || isSubmitting}
            className="flex-1 rounded-xl bg-[#0000ff] py-2.5 text-sm font-semibold text-white hover:bg-[#0000cc] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Submitting..." : "Report"}
          </button>
        </div>
      </div>
    </div>
  );
}
