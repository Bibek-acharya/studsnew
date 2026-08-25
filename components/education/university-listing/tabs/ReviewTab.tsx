"use client";

import React, { useState, useEffect } from "react";
import ReviewCard from "@/app/find-college/[id]/components/ReviewCard";
import RatingBar from "@/app/find-college/[id]/components/RatingBar";
import EmptyTabState from "@/app/find-college/[id]/components/EmptyTabState";
import { apiService } from "@/services/api";
import { isUniversityReviewValid } from "../university-review-validation";

interface ReviewTabProps {
  universityId: number;
  overallRating?: number;
  reviewCount?: number;
}

export default function ReviewTab({
  universityId,
  overallRating,
  reviewCount,
}: ReviewTabProps) {
  const [reviewsData, setReviewsData] = useState<any>(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [myReview, setMyReview] = useState<any>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewPros, setReviewPros] = useState("");
  const [reviewCons, setReviewCons] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!universityId) return;
    (async () => {
      setReviewsLoading(true);
      try {
        const token = apiService.getToken();
        const [reviewsRes, myReviewRes] = await Promise.allSettled([
          apiService.getUniversityReviews(universityId, { page: 1, limit: 10 }),
          token ? apiService.getMyUniversityReview(universityId, { authToken: token }) : Promise.resolve(null),
        ]);
        if (reviewsRes.status === "fulfilled") {
          setReviewsData(reviewsRes.value?.data || reviewsRes.value);
        }
        if (myReviewRes.status === "fulfilled" && myReviewRes.value?.data?.review) {
          const r = myReviewRes.value.data.review;
          setMyReview(r);
          setReviewRating(Math.round(r.rating || r.ratings?.overall || 5));
          setReviewPros(r.pros?.trim() || r.summaryTitle || "");
          setReviewCons(r.cons || "");
        }
      } catch {
        // silently fail
      } finally {
        setReviewsLoading(false);
      }
    })();
  }, [universityId]);

  const handleSubmitReview = async () => {
    if (!isUniversityReviewValid(reviewRating, reviewPros, reviewCons)) return;
    const token = apiService.getToken();
    if (!token) {
      setSubmitError("Please log in to submit a review.");
      return;
    }
    setSubmittingReview(true);
    setSubmitError("");
    try {
      if (myReview) {
        await apiService.updateUniversityReview(
          universityId,
          { rating: reviewRating, pros: reviewPros.trim(), cons: reviewCons.trim() },
          { authToken: token },
        );
      } else {
        await apiService.submitUniversityReview(
          { university_id: universityId, rating: reviewRating, pros: reviewPros.trim(), cons: reviewCons.trim() },
          { authToken: token },
        );
      }
      setShowReviewForm(false);
      if (!myReview) {
        setReviewRating(0);
        setReviewPros("");
        setReviewCons("");
        setMyReview(null);
      }
      setReviewsLoading(true);
      try {
        const t = apiService.getToken();
        const [r1] = await Promise.allSettled([
          apiService.getUniversityReviews(universityId, { page: 1, limit: 10 }),
          t ? apiService.getMyUniversityReview(universityId, { authToken: t }) : Promise.resolve(null),
        ]);
        if (r1.status === "fulfilled") {
          setReviewsData(r1.value?.data || r1.value);
        }
      } catch {
        // silent
      } finally {
        setReviewsLoading(false);
      }
    } catch (err: any) {
      const msg = err?.message || "";
      if (msg.includes("already reviewed")) {
        setSubmitError("You have already reviewed this university.");
      } else {
        setSubmitError(msg || "Failed to submit review.");
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="px-4 sm:px-0">
      {reviewsLoading ? (
        <div className="animate-pulse space-y-4 py-8">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-full bg-gray-200" />
            <div className="space-y-2">
              <div className="h-4 w-40 rounded bg-gray-200" />
              <div className="h-3 w-24 rounded bg-gray-200" />
            </div>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2 rounded-lg border border-gray-100 p-4">
              <div className="h-4 w-48 rounded bg-gray-200" />
              <div className="h-3 w-full rounded bg-gray-100" />
              <div className="h-3 w-3/4 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="mb-8 flex flex-col items-center gap-8 rounded-md border border-gray-200 bg-white p-8 md:flex-row">
            <div className="text-center md:border-r md:pr-8 md:text-left">
              <h2 className="mb-2 text-5xl font-extrabold text-gray-900">
                {reviewsData?.overall_rating?.toFixed(1) || overallRating?.toFixed(1) || "0.0"}
              </h2>
              <div className="mb-2 flex items-center justify-center gap-1 md:justify-start">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <i
                    key={idx}
                    className={`fa-solid fa-star text-[14px] ${idx < Math.round(reviewsData?.overall_rating || overallRating || 0) ? "text-yellow-400" : "text-gray-300"}`}
                  ></i>
                ))}
              </div>
              <p className="text-[13px] font-medium text-gray-500">
                Based on {reviewsData?.review_count || reviewCount || 0} reviews
              </p>
            </div>
            <div className="w-full flex-1 space-y-2.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const dist = reviewsData?.distribution || {};
                const count = dist[star] || 0;
                const total = reviewsData?.review_count || 1;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <RatingBar
                    key={star}
                    label={String(star)}
                    width={`${pct}%`}
                    color={star >= 4 ? "bg-green-500" : star >= 3 ? "bg-yellow-400" : "bg-orange-400"}
                    pct={`${pct}%`}
                  />
                );
              })}
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[18px] font-bold text-gray-900">Recent Reviews</h3>
            {reviewsData?.reviews?.length > 0 && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="text-sm font-medium text-brand-blue hover:text-brand-hover"
              >
                {showReviewForm ? "Cancel" : "Write a Review"}
              </button>
            )}
          </div>

          {showReviewForm && (
            <div className="mb-6 rounded-md border border-gray-200 bg-white p-6">
              <h4 className="mb-4 text-[16px] font-bold text-gray-900">
                {myReview ? "Edit Your Review" : "Write Your Review"}
              </h4>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="text-2xl transition-colors hover:scale-110"
                    >
                      <i className={`${star <= (reviewRating || myReview?.rating) ? "fa-solid text-yellow-400" : "fa-regular text-gray-300"} fa-star`}></i>
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">Pros</label>
                <textarea
                  className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none"
                  rows={4}
                  placeholder="What do you like about this university?"
                  value={reviewPros}
                  onChange={(e) => setReviewPros(e.target.value)}
                />
                <p className="mt-1 text-xs text-gray-500">Minimum 10 characters</p>
              </div>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">Cons</label>
                <textarea
                  className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none"
                  rows={4}
                  placeholder="What could this university improve?"
                  value={reviewCons}
                  onChange={(e) => setReviewCons(e.target.value)}
                />
                <p className="mt-1 text-xs text-gray-500">Minimum 10 characters</p>
              </div>
              {submitError && (
                <p className="mb-3 text-sm text-red-500">{submitError}</p>
              )}
              <button
                onClick={handleSubmitReview}
                disabled={submittingReview || !isUniversityReviewValid(reviewRating, reviewPros, reviewCons)}
                className="rounded-md bg-brand-blue px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-hover disabled:opacity-50"
              >
                {submittingReview ? "Submitting..." : myReview ? "Update Review" : "Submit Review"}
              </button>
            </div>
          )}

          <div className="space-y-5">
            {reviewsData?.reviews?.length > 0 ? (
              reviewsData.reviews.map((review: any, idx: number) => {
                const rating = review.rating || review.ratings?.overall || Object.values(review.ratings || {}).reduce((s: number, v: any) => s + v, 0) / 10 || 5;
                return (
                  <ReviewCard
                    key={review.id}
                    initials={review.user_initials || "U"}
                    name={review.user_name || "Anonymous"}
                    subtitle="University Review"
                    rating={Math.round(rating)}
                    pros={review.pros || ""}
                    cons={review.cons || "No cons provided."}
                    tone={idx % 2 === 0 ? "blue" : "purple"}
                    profileImage={review.user_profile_image}
                  />
                );
              })
            ) : (
              <EmptyTabState tabName="Reviews" actionLabel="Write a Review" onAction={() => setShowReviewForm(true)} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
