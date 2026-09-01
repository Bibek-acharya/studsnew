"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight } from "lucide-react";
import RichText from "@/components/RichText";

const ReviewCard: React.FC<{
  initials: string;
  name: string;
  subtitle: string;
  rating: number;
  pros: string;
  cons: string;
  tone: "blue" | "purple";
  profileImage?: string;
  yearlyFee?: number;
  scholarship?: boolean;
  internshipOutcome?: string;
  ratings?: Record<string, number>;
  helpfulUpvotes?: number;
  helpfulDownvotes?: number;
  myVote?: string;
  onVote?: (vote: "up" | "down") => Promise<void>;
}> = ({ initials, name, subtitle, rating, pros, cons, tone, profileImage, yearlyFee, scholarship, internshipOutcome, ratings, helpfulUpvotes = 0, helpfulDownvotes = 0, myVote, onVote }) => {
  const ratingsScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = ratingsScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    const el = ratingsScrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => checkScroll());
      observer.observe(el);
    }
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
      observer?.disconnect();
    };
  }, [checkScroll]);

  const scrollRatings = (direction: "left" | "right") => {
    const el = ratingsScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === "left" ? -160 : 160, behavior: "smooth" });
  };

  const hasRatings = ratings && Object.keys(ratings).length > 0;

  const [pendingVote, setPendingVote] = useState<"up" | "down" | null>(null);
  const handleVote = async (vote: "up" | "down") => {
    if (!onVote || pendingVote) return;
    setPendingVote(vote);
    await onVote(vote);
    setPendingVote(null);
  };

  let helpfulCaption = "";
  if (helpfulUpvotes > helpfulDownvotes && helpfulUpvotes > 0) {
    helpfulCaption = `${helpfulUpvotes} people found this helpful`;
  } else if (helpfulDownvotes > 0) {
    helpfulCaption = `${helpfulDownvotes} people found this review unhelpful`;
  }

  return (
    <div className="rounded-md border border-gray-200 bg-white p-6 ">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          {profileImage ? (
            <img src={profileImage} alt="" className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${tone === "blue" ? "bg-brand-blue/10 text-brand-blue" : "bg-brand-blue/10 text-brand-blue"}`}
            >
              {initials}
            </div>
          )}
          <div>
            <h4 className="text-[14.5px] font-bold text-gray-900">{name}</h4>
            <p className="text-[12px] text-gray-500">{subtitle}</p>
          </div>
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, idx) => (
            <i
              key={idx}
              className={`${idx < rating ? "fa-solid text-yellow-400" : "fa-regular text-gray-300"} fa-star text-[13px]`}
            ></i>
          ))}
        </div>
      </div>
      {hasRatings && (
        <div className="relative mb-3">
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scrollRatings("left")}
              className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-1 text-gray-700 shadow-sm transition hover:bg-gray-50"
              aria-label="Scroll ratings left"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          )}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => scrollRatings("right")}
              className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-1 text-gray-700 shadow-sm transition hover:bg-gray-50"
              aria-label="Scroll ratings right"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
          <div
            ref={ratingsScrollRef}
            className={`flex gap-2 overflow-x-auto scroll-smooth py-0.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${canScrollLeft ? "pl-7" : ""} ${canScrollRight ? "pr-7" : ""}`}
          >
            {Object.entries(ratings!).map(([category, value]) => (
              <div
                key={category}
                className="flex shrink-0 items-center gap-1 rounded bg-gray-50 px-2 py-1 text-xs"
              >
                <span className="text-gray-500">{category}</span>
                <span className="font-semibold text-gray-800">{value}</span>
                <i className="fa-solid fa-star text-[10px] text-yellow-400"></i>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="mb-3 rounded-md border border-gray-100 bg-[#fafafa] p-4">
        <div className="mb-2 flex items-start gap-2">
          <i className="fa-solid fa-thumbs-up mt-0.5 text-green-500"></i>
          <p className="text-[13.5px] leading-relaxed text-gray-700">
            <span className="font-bold text-gray-900">Pros:</span>{" "}
            <RichText html={pros} variant="sm" as="span" />
          </p>
        </div>
        <div className="flex items-start gap-2">
          <i className="fa-solid fa-thumbs-down mt-0.5 text-red-500"></i>
          <p className="text-[13.5px] leading-relaxed text-gray-700">
            <span className="font-bold text-gray-900">Cons:</span>{" "}
            <RichText html={cons} variant="sm" as="span" />
          </p>
        </div>
      </div>
      {(yearlyFee || scholarship !== undefined || internshipOutcome) && (
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[12.5px] text-gray-600">
          {yearlyFee && (
            <span>
              <i className="fa-solid fa-indian-rupee-sign mr-1 text-xs"></i>
              NPR {yearlyFee.toLocaleString("en-IN")}/yr
            </span>
          )}
          {scholarship !== undefined && (
            <span>
              <i className="fa-solid fa-award mr-1 text-xs"></i>
              {scholarship ? "Scholarship Received" : "No Scholarship"}
            </span>
          )}
          {internshipOutcome && (
            <span>
              <i className="fa-solid fa-briefcase mr-1 text-xs"></i>
              {internshipOutcome === "excellent" ? "Excellent Placements" : internshipOutcome === "good" ? "Good Opportunities" : internshipOutcome === "average" ? "Average Placements" : "Poor Placements"}
            </span>
          )}
        </div>
      )}
      {onVote && (
        <div>
          {helpfulCaption && (
            <p className="mb-2 text-[12.5px] text-gray-500">{helpfulCaption}</p>
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pendingVote !== null}
              onClick={() => handleVote("up")}
              className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[13px] font-semibold transition-colors disabled:opacity-60 ${myVote === "up" ? "border-brand-blue bg-brand-blue text-white" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}
            >
              <ArrowUp className="h-3.5 w-3.5" />
              Helpful
              {helpfulUpvotes > 0 && <span className="font-bold">{helpfulUpvotes}</span>}
            </button>
            <button
              type="button"
              disabled={pendingVote !== null}
              onClick={() => handleVote("down")}
              className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[13px] font-semibold transition-colors disabled:opacity-60 ${myVote === "down" ? "border-brand-blue bg-brand-blue text-white" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}
            >
              <ArrowDown className="h-3.5 w-3.5" />
              Not Helpful
              {helpfulDownvotes > 0 && <span className="font-bold">{helpfulDownvotes}</span>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
