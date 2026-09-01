"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { RatingBar, ReviewCard } from "./index";
import EmptyTabState from "./EmptyTabState";
import { getImageUrl } from "@/services/api";
import { useAuth } from "@/services/AuthContext";
import Pagination from "@/components/ui/Pagination";

interface TabReviewProps {
  reviewsData: any;
  reviewsLoading: boolean;
  reviewsPage: number;
  onPageChange: (page: number) => void;
  onVote: (reviewId: number, vote: "up" | "down") => Promise<void>;
}

interface ReviewLike {
  rating?: number;
  ratings?: Record<string, number>;
}

const TabReview: React.FC<TabReviewProps> = ({ reviewsData, reviewsLoading, reviewsPage, onPageChange, onVote }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const hasReviews = reviewsData?.reviews?.length > 0;

  // API returns snake_case fields plus a precomputed per-review rating.
  const reviewRating = (r: ReviewLike): number => {
    if (typeof r?.rating === "number" && r.rating > 0) return r.rating;
    const vals = Object.values(r?.ratings || {}) as number[];
    return vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : 0;
  };

  if (reviewsLoading) {
    return (
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
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col items-center gap-8 rounded-md border border-gray-200 bg-white p-8 md:flex-row">
        <div className="text-center md:border-r md:pr-8 md:text-left">
          <h2 className="mb-2 text-5xl font-extrabold text-gray-900">{reviewsData?.overall_rating?.toFixed(1) || "0.0"}</h2>
          <div className="mb-2 flex items-center justify-center gap-1 md:justify-start">
            {Array.from({ length: 5 }).map((_, idx) => (
              <i key={idx} className={`fa-solid fa-star text-[14px] ${idx < Math.round(reviewsData?.overall_rating || 0) ? "text-yellow-400" : "text-gray-300"}`}></i>
            ))}
          </div>
          <p className="text-[13px] font-medium text-gray-500">Based on {reviewsData?.review_count || 0} reviews</p>
        </div>
        <div className="w-full flex-1 space-y-2.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviewsData?.reviews?.filter((r: any) => Math.round(reviewRating(r)) === star).length || 0;
            const pct = reviewsData?.review_count ? Math.round((count / reviewsData.review_count) * 100) : 0;
            return <RatingBar key={star} label={String(star)} width={`${pct}%`} color={star >= 4 ? "bg-green-500" : star >= 3 ? "bg-yellow-400" : "bg-orange-400"} pct={`${pct}%`} />;
          })}
        </div>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-[18px] font-bold text-gray-900">Recent Reviews</h3>
        {hasReviews && (
          <a href="/write-review" className="text-sm font-medium text-brand-blue hover:text-brand-hover">Write a Review</a>
        )}
      </div>

      {hasReviews ? (
        <div className="space-y-5">
          {reviewsData.reviews.map((review: any, idx: number) => {
            return <ReviewCard key={review.id} initials={review.user_initials || "U"} name={review.user_name || "Anonymous"} profileImage={review.user_profile_image ? getImageUrl(review.user_profile_image) : undefined} subtitle={`${review.course ? `${review.course} · ` : ""}Batch ${review.batch_year}`} rating={Math.round(reviewRating(review))} pros={review.pros} cons={review.cons} tone={idx % 2 === 0 ? "blue" : "purple"} yearlyFee={review.yearly_fee} scholarship={review.scholarship} internshipOutcome={review.internship_outcome} ratings={review.ratings} helpfulUpvotes={review.helpful_upvotes} helpfulDownvotes={review.helpful_downvotes} myVote={review.my_vote} onVote={isAuthenticated ? (vote) => onVote(review.id, vote) : undefined} />;
          })}
          <Pagination
            currentPage={reviewsData?.meta?.page || reviewsPage}
            totalPages={reviewsData?.meta?.total_pages || 1}
            onPageChange={onPageChange}
          />
        </div>
      ) : (
        <EmptyTabState
          tabName="reviews"
          actionLabel="Write a Review"
          onAction={() => router.push("/write-review")}
        />
      )}
    </div>
  );
};

export default TabReview;
