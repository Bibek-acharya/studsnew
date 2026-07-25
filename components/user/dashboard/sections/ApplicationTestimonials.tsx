"use client";

import { useState } from "react";
import { apiService } from "@/services/api";
import { Star, MessageSquareText, Loader2 } from "lucide-react";
import { Toast } from "@/components/ui/Toast";

export default function ApplicationTestimonials() {
  const [modalOpen, setModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const charCount = review.length;
  const charValid = charCount >= 20 && charCount <= 500;

  const openModal = () => {
    setRating(0);
    setReview("");
    setModalOpen(true);
  };

  const submitTestimonial = async () => {
    if (!rating || !charValid) return;
    setSubmitting(true);
    try {
      await apiService.submitTestimonial({
        name: "",
        designation: "StudSphere User",
        rating,
        review,
      });
      setModalOpen(false);
      setToast({
        message: "Review submitted! Thank you for your feedback.",
        type: "success",
      });
      setTimeout(() => setToast(null), 3000);
    } catch (err: any) {
      setToast({
        message: err.message || "Failed to submit review",
        type: "error",
      });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-md border border-gray-100 p-6">
        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4 text-indigo-500">
          <MessageSquareText className="w-12 h-12" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Share Your Experience
        </h3>
        <p className="text-gray-500 mb-6 max-w-sm">
          Tell us about your experience using StudSphere. Your feedback helps us
          improve and assist other students.
        </p>
        <button
          onClick={openModal}
          className="px-6 py-3 bg-brand-blue text-white rounded-md font-medium hover:bg-brand-hover transition-colors"
        >
          Write a Review
        </button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-md  w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Write a Review
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Share your experience with StudSphere.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`p-1 rounded transition-colors ${rating >= star ? "text-yellow-400" : "text-gray-300"}`}
                    >
                      <Star
                        className={`w-8 h-8 ${rating >= star ? "fill-yellow-400" : ""}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Review{" "}
                  <span className="text-gray-400 font-normal">
                    ({charCount}/500 — minimum 20)
                  </span>
                </label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows={4}
                  placeholder="Tell us about your experience..."
                  className={`w-full border rounded-md p-3 text-sm outline-none transition-all resize-none ${
                    review && !charValid
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-gray-300 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20/20"
                  }`}
                />
                {review && !charValid && (
                  <p className="text-xs text-red-500 mt-1">
                    {charCount < 20
                      ? `Minimum 20 characters (${20 - charCount} more needed)`
                      : "Maximum 500 characters exceeded"}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-md text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitTestimonial}
                disabled={submitting || !rating || !charValid}
                className="flex-1 px-4 py-2.5 rounded-md bg-brand-blue text-white font-medium hover:bg-brand-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}
