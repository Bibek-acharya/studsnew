"use client";

import { useState, useEffect } from "react";
import { apiService } from "@/services/api";
import { Star, MessageSquareText, Loader2, CheckCircle2 } from "lucide-react";

interface MyApplication {
  id: number;
  institution: string;
  program: string;
  type: string;
  status: string;
  applied_date: string;
}

interface Testimonial {
  id: number;
  rating: number;
  experience: string;
  created_at: string;
}

export default function ApplicationTestimonials() {
  const [applications, setApplications] = useState<MyApplication[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<MyApplication | null>(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [fetchingTestimonials, setFetchingTestimonials] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [appRes, testRes] = await Promise.all([
          apiService.getMyApplications({ page: 1, limit: 50 }),
          apiService.getUserTestimonials(),
        ]);
        if (appRes.success)
          setApplications((appRes.data as any)?.applications || []);
        if (testRes.success) setTestimonials(testRes.data || []);
      } catch {
        // ignore
      } finally {
        setLoading(false);
        setFetchingTestimonials(false);
      }
    };
    fetch();
  }, []);

  const alreadyReviewed = (appId: number) => {
    return testimonials.some((t) => t.id === appId);
  };

  const openModal = (app: MyApplication) => {
    setSelectedApp(app);
    setRating(0);
    setReview("");
    setModalOpen(true);
  };

  const charCount = review.length;
  const charValid = charCount >= 20 && charCount <= 500;

  const submitTestimonial = async () => {
    if (!selectedApp || !rating || !charValid) return;
    setSubmitting(true);
    try {
      await apiService.submitTestimonial({
        name: "",
        designation: `Student - ${selectedApp.program}`,
        rating,
        review,
      });
      setTestimonials((prev) => [
        ...prev,
        {
          id: selectedApp.id,
          rating,
          experience: review,
          created_at: new Date().toISOString(),
        },
      ]);
      setModalOpen(false);
      setToast({
        message: "Testimonial submitted! Thank you for your feedback.",
        type: "success",
      });
      setTimeout(() => setToast(null), 3000);
    } catch (err: any) {
      setToast({
        message: err.message || "Failed to submit testimonial",
        type: "error",
      });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-md border border-gray-100 p-6">
        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4 text-indigo-500">
          <MessageSquareText className="w-12 h-12" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          You haven't applied to any college yet
        </h3>
        <p className="text-gray-500 mb-6 max-w-sm">
          Once you submit applications to colleges, you can share your
          experience and leave a testimonial here.
        </p>
        <a
          href="/find-college"
          className="px-6 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors"
        >
          Browse Colleges
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-md border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Your Applications
        </h3>
        {testimonials.length > 0 && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-md">
            <h4 className="font-semibold text-emerald-800 text-sm mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Your Testimonials
            </h4>
            {testimonials.map((t) => (
              <div key={t.id} className="text-sm text-emerald-700 mb-1">
                <span className="font-medium">Application #{t.id}</span>
                <span className="mx-2">·</span>
                {Array.from({ length: t.rating }, (_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 inline fill-yellow-400 text-yellow-400"
                  />
                ))}
                <p className="text-emerald-600 mt-0.5 text-[13px]">
                  {t.experience.slice(0, 100)}
                </p>
              </div>
            ))}
          </div>
        )}
        <div className="space-y-3">
          {applications.map((app) => {
            const reviewed = alreadyReviewed(app.id);
            return (
              <div
                key={app.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-md border border-gray-100"
              >
                <div>
                  <p className="font-medium text-gray-900">{app.institution}</p>
                  <p className="text-sm text-gray-500">
                    {app.program} · {app.type}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${app.status === "accepted" || app.status === "approved" ? "bg-green-100 text-green-700" : app.status === "rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}
                  >
                    {app.status}
                  </span>
                  {reviewed ? (
                    <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Reviewed
                    </span>
                  ) : (
                    <button
                      onClick={() => openModal(app)}
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Write Testimonial
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {modalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-md shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Write a Testimonial
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {selectedApp.institution} · {selectedApp.program}
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
                  placeholder="Share your experience with this application..."
                  className={`w-full border rounded-md p-3 text-sm outline-none transition-all resize-none ${
                    review && !charValid
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
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
                className="flex-1 px-4 py-2.5 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          className={`fixed bottom-4 right-4 z-50 rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-lg ${toast.type === "error" ? "bg-red-600" : "bg-green-600"}`}
        >
          {toast.message}
        </div>
      )}
    </>
  );
}
