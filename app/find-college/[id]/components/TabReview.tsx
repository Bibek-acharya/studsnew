"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { RatingBar, ReviewCard } from "./index";
import EmptyTabState from "./EmptyTabState";

interface TabReviewProps {
  reviewsData: any;
  reviewsLoading: boolean;
}

const TabReview: React.FC<TabReviewProps> = ({ reviewsData, reviewsLoading }) => {
  const router = useRouter();
  const hasReviews = reviewsData?.reviews?.length > 0;

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
          <h2 className="mb-2 text-5xl font-extrabold text-gray-900">{reviewsData?.overallRating?.toFixed(1) || "0.0"}</h2>
          <div className="mb-2 flex items-center justify-center gap-1 md:justify-start">
            {Array.from({ length: 5 }).map((_, idx) => (
              <i key={idx} className={`fa-solid fa-star text-[14px] ${idx < Math.round(reviewsData?.overallRating || 0) ? "text-yellow-400" : "text-gray-300"}`}></i>
            ))}
          </div>
          <p className="text-[13px] font-medium text-gray-500">Based on {reviewsData?.reviewCount || 0} reviews</p>
        </div>
        <div className="w-full flex-1 space-y-2.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviewsData?.reviews?.filter((r: any) => {
              const avg = Object.values(r.ratings || {}).reduce((s: number, v: any) => s + v, 0) / 10;
              return Math.round(avg) === star;
            }).length || 0;
            const pct = reviewsData?.reviewCount ? Math.round((count / reviewsData.reviewCount) * 100) : 0;
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
            const avgRating = Object.values(review.ratings || {}).reduce((s: number, v: any) => s + v, 0) / 10;
            return <ReviewCard key={review.id} initials={review.userInitials || "U"} name={review.userName || "Anonymous"} subtitle={`${review.course} · Batch ${review.batchYear}`} rating={Math.round(avgRating)} pros={review.pros} cons={review.cons} tone={idx % 2 === 0 ? "blue" : "purple"} />;
          })}
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
