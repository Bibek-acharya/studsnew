"use client";

import React, { useEffect, useState } from "react";
import SectionHeader from "../shared/SectionHeader";
import { Star, Eye, Trash, X, CheckCircle, XCircle } from "@phosphor-icons/react";

interface ReviewData {
  id: number;
  college_id: number;
  user_name: string;
  user_initials: string;
  user_profile_image: string;
  student_type: string;
  course: string;
  level: string;
  batch_year: number;
  ratings: Record<string, number>;
  pros: string;
  cons: string;
  summary_title: string;
  yearly_fee: number | null;
  scholarship: boolean | null;
  internship_outcome: string;
  email: string;
  is_verified: boolean;
  is_published: boolean;
  helpful_count: number;
  created_at: string;
}

const RATING_CATEGORIES = [
  "Teaching Quality & Faculty Support",
  "Infrastructure & Lab Facilities",
  "Social & Campus Life",
  "Placement & Internships",
  "Value for Money",
  "Hostels & Accommodation",
  "Student Clubs & Activities",
  "Administration & Management",
  "Library & Resources",
  "Overall Experience",
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("institutionToken");
}

function authFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  });
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReview, setSelectedReview] = useState<ReviewData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ReviewData | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const profileRes = await authFetch("/api/v1/institution/profile");
      const profileJson = await profileRes.json();
      const collegeId = profileJson?.data?.college_id || profileJson?.college_id;

      if (!collegeId) {
        setError("Could not determine college ID from institution profile.");
        return;
      }

      const reviewsRes = await authFetch(`/api/v1/institution/reviews/college/${collegeId}?limit=100`);
      const reviewsJson = await reviewsRes.json();
      if (!reviewsRes.ok) {
        setError(reviewsJson?.message || reviewsJson?.error || "Failed to load reviews");
        return;
      }

      const list = reviewsJson?.data?.reviews || reviewsJson?.reviews || [];
      setReviews(list);
    } catch (e: any) {
      setError(e.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await authFetch(`/api/v1/institution/reviews/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        const err = await res.json();
        setError(err?.message || "Failed to delete review");
      }
    } catch (e: any) {
      setError(e.message || "Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  const avgRating = (ratings: Record<string, number>) => {
    const vals = Object.values(ratings);
    if (vals.length === 0) return 0;
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
  };

  const renderStars = (rating: number) => {
    const full = Math.round(rating);
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} weight={i <= full ? "fill" : "regular"}
            className={`w-3.5 h-3.5 ${i <= full ? "text-yellow-500" : "text-gray-300"}`} />
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <SectionHeader
        title="Reviews"
        breadcrumbItems={[{ label: "Dashboard", href: "/institution-zone/dashboard/overview" }, { label: "Reviews" }]}
      />

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
          <XCircle className="w-5 h-5 shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 flex items-center justify-center text-gray-400">
          Loading reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600 mb-4">
            <Star className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">No Reviews Yet</h2>
          <p className="text-sm text-gray-500 max-w-md">
            Student reviews about your institution will appear here once submitted.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Student</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Rating</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Type</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Batch</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-semibold">
                          {review.user_profile_image ? (
                            <img src={review.user_profile_image} className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            review.user_initials || review.user_name?.charAt(0)?.toUpperCase() || "?"
                          )}
                        </div>
                        <span className="font-medium text-gray-800">{review.user_name || "Anonymous"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {renderStars(Math.round(Number(avgRating(review.ratings))))}
                        <span className="text-gray-500">{avgRating(review.ratings)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 capitalize">{review.student_type}</td>
                    <td className="px-4 py-3 text-gray-600">{review.batch_year}</td>
                    <td className="px-4 py-3">
                      {review.is_published ? (
                        <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2 py-0.5 rounded-full text-xs font-medium">
                          <CheckCircle className="w-3.5 h-3.5" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-full text-xs font-medium">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => setSelectedReview(review)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(review)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
          <div className="fixed inset-0 bg-black/40" onClick={() => setSelectedReview(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-lg font-bold text-gray-900">Review Details</h3>
              <button onClick={() => setSelectedReview(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                  {selectedReview.user_profile_image ? (
                    <img src={selectedReview.user_profile_image} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    selectedReview.user_initials || selectedReview.user_name?.charAt(0)?.toUpperCase() || "?"
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{selectedReview.user_name || "Anonymous"}</h4>
                  <p className="text-sm text-gray-500">{selectedReview.email}</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  {selectedReview.is_verified && (
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">Verified</span>
                  )}
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                    {selectedReview.student_type}
                  </span>
                </div>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-3 gap-3 bg-gray-50 rounded-xl p-4">
                <div>
                  <p className="text-xs text-gray-500">Batch Year</p>
                  <p className="font-semibold text-gray-800">{selectedReview.batch_year}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Course</p>
                  <p className="font-semibold text-gray-800">{selectedReview.course || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Level</p>
                  <p className="font-semibold text-gray-800">{selectedReview.level || "—"}</p>
                </div>
              </div>

              {/* Overall Rating */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">{avgRating(selectedReview.ratings)}</span>
                <div>{renderStars(Math.round(Number(avgRating(selectedReview.ratings))))}</div>
              </div>

              {/* Category Ratings */}
              <div>
                <h5 className="text-sm font-semibold text-gray-800 mb-2">Category Ratings</h5>
                <div className="grid grid-cols-2 gap-2">
                  {RATING_CATEGORIES.map((cat) => {
                    const score = selectedReview.ratings[cat] || 0;
                    return (
                      <div key={cat} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-1.5">
                        <span className="text-xs text-gray-600 truncate mr-2">{cat}</span>
                        <div className="flex items-center gap-1">
                          {renderStars(score)}
                          <span className="text-xs font-medium text-gray-700 w-4 text-right">{score}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-semibold text-green-700 mb-1">Pros</h5>
                  <p className="text-sm text-gray-700 bg-green-50 rounded-lg p-3 whitespace-pre-wrap">
                    {selectedReview.pros}
                  </p>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-red-700 mb-1">Cons</h5>
                  <p className="text-sm text-gray-700 bg-red-50 rounded-lg p-3 whitespace-pre-wrap">
                    {selectedReview.cons}
                  </p>
                </div>
              </div>

              {/* Summary Title */}
              {selectedReview.summary_title && (
                <div>
                  <h5 className="text-sm font-semibold text-gray-800 mb-1">Summary</h5>
                  <p className="text-sm text-gray-700">{selectedReview.summary_title}</p>
                </div>
              )}

              {/* Additional Info */}
              <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-xl p-4">
                <div>
                  <p className="text-xs text-gray-500">Yearly Fee</p>
                  <p className="font-semibold text-gray-800">
                    {selectedReview.yearly_fee ? `Rs. ${selectedReview.yearly_fee.toLocaleString()}` : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Scholarship</p>
                  <p className="font-semibold text-gray-800">
                    {selectedReview.scholarship === true ? "Yes" : selectedReview.scholarship === false ? "No" : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Internship Outcome</p>
                  <p className="font-semibold text-gray-800 capitalize">
                    {selectedReview.internship_outcome || "—"}
                  </p>
                </div>
              </div>

              {/* Footer meta */}
              <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
                <span>Helpful: {selectedReview.helpful_count}</span>
                <span>{new Date(selectedReview.created_at).toLocaleDateString("en-US", {
                  year: "numeric", month: "long", day: "numeric",
                })}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/40" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
                <Trash className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Review?</h3>
              <p className="text-sm text-gray-500 mb-6">
                This will permanently delete the review from <strong>{deleteTarget.user_name || "this student"}</strong>.
                This action cannot be undone.
              </p>
              <div className="flex w-full gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleteLoading}
                  className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50"
                >
                  {deleteLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
