"use client";

import type { SyntheticEvent } from "react";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { EducationNewsItem } from "@/services/api";
import HoverTooltip from "./HoverTooltip";

interface NewsStoriesSectionProps {
  onNavigate: (view: string, data?: { [key: string]: unknown }) => void;
  newsArticles?: EducationNewsItem[];
}

type NewsCard = {
  id: number;
  badgeText: string;
  badgeColorClass: string;
  imgSrc: string;
  title: string;
  description: string;
  timeAgo: string;
};

const NewsStoriesSection: React.FC<NewsStoriesSectionProps> = ({
  onNavigate,
  newsArticles,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stripHtml = (html: string) =>
    html
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .trim();

  const data: NewsCard[] = (newsArticles || []).map((item) => ({
    id: item.id,
    badgeText: item.category || "News",
    badgeColorClass: item.category?.toLowerCase().includes("exam")
      ? "bg-orange-50 text-orange-600"
      : item.category?.toLowerCase().includes("scholarship")
        ? "bg-purple-50 text-purple-600"
        : item.category?.toLowerCase().includes("admission")
          ? "bg-blue-50 text-blue-600"
          : item.category?.toLowerCase().includes("news")
            ? "bg-cyan-50 text-cyan-600"
            : "bg-emerald-50 text-emerald-600",
    imgSrc:
      item.image || "https://placehold.co/600x400/f1f5f9/94a3b8?text=News",
    title: item.title,
    description: stripHtml(
      item.excerpt ||
        item.content ||
        "Stay updated with the latest education announcements.",
    ),
    timeAgo: item.date
      ? (() => {
          const d = new Date(item.date);
          const now = new Date();
          const diffMs = now.getTime() - d.getTime();
          const mins = Math.floor(diffMs / 60000);
          if (mins < 1) return "Just now";
          if (mins < 60) return `${mins}m ago`;
          const hours = Math.floor(mins / 60);
          if (hours < 24) return `${hours}h ago`;
          const days = Math.floor(hours / 24);
          if (days < 7) return `${days}d ago`;
          return d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
        })()
      : "Today",
  }));

  const scrollByWidth = (direction: -1 | 1) => {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: scrollAmount * direction,
      behavior: "smooth",
    });
  };

  return (
    <section className="mt-16 sm:mt-20 md:mt-24 w-full px-4 sm:px-6 md:px-8">
      <div className="max-w-350 mx-auto w-full">
        {/* Header & Controls */}
        <div className="flex items-start justify-between gap-4 sm:gap-6 mb-4 sm:mb-6 md:mb-12">
          <div className="max-w-3xl">
            <h2 className="text-[24px] xs:text-[28px] sm:text-3xl md:text-[36px] lg:text-[40px] font-bold text-[#111827] mb-2 sm:mb-3 leading-tight tracking-tight">
              Latest News & Stories
            </h2>
            <p className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] text-gray-500">
              Your guide to the best academic opportunities in Nepal and beyond.
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              onClick={() => scrollByWidth(-1)}
              className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover: transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
            <button
              onClick={() => scrollByWidth(1)}
              className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover: transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative w-full overflow-hidden">
          {/* Track */}
          <div
            ref={containerRef}
            className="carousel-track flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-6 pt-2"
          >
            {data.map((card, index) => (
              <article
                key={index}
                className="min-w-65 xs:min-w-70 sm:min-w-75 md:min-w-[320px] max-w-75 xs:max-w-[320px] sm:max-w-85 w-full shrink-0 snap-start bg-white rounded-xl border border-gray-200 hover:border-blue-500/20 flex flex-col hover:-translate-y-1 transition-all duration-300 group cursor-pointer p-3.5 sm:p-4"
                onClick={() => onNavigate("newsDetails", card)}
              >
                <div className="mb-2.5 sm:mb-3">
                  <span
                    className={`inline-flex items-center px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] xs:text-[11px] sm:text-[11px] font-bold uppercase tracking-wider rounded-full ${card.badgeColorClass}`}
                  >
                    {card.badgeText}
                  </span>
                </div>
                <div className="overflow-hidden rounded-md mb-3 sm:mb-4">
                  <img
                    src={card.imgSrc}
                    alt={card.title}
                    className="w-full h-28 xs:h-32 sm:h-36 object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e: SyntheticEvent<HTMLImageElement>) => {
                      e.currentTarget.src =
                        "https://placehold.co/600x400/f1f5f9/94a3b8?text=News";
                    }}
                  />
                </div>
                <HoverTooltip label={card.title}>
                  <h3 className="text-[17px] xs:text-[18px] sm:text-[19px] font-semibold text-gray-900 group-hover:text-brand-blue transition-all duration-300 tracking-tight mb-1 sm:mb-2 leading-snug line-clamp-2">
                    {card.title}
                  </h3>
                </HoverTooltip>
                <p className="text-xs sm:text-sm text-gray-500 mb-5 sm:mb-6 grow line-clamp-3 leading-relaxed">
                  {card.description}
                </p>
                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3 sm:pt-3.5">
                  <div className="flex items-center gap-1.5 text-[12px] sm:text-[13px] text-gray-500">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>{card.timeAgo}</span>
                  </div>

                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 text-[12px] sm:text-[13px] font-semibold text-black cursor-pointer hover:text-brand-hover transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate("newsDetails", card);
                    }}
                  >
                    <span>View details</span>
                    {/* <ArrowRight className="w-3.5 h-3.5" /> */}
                  </button>
                </div>
                {/* <div className="flex gap-1.5 sm:gap-2">
                  {partnerLogos.map((logo, lIdx) => (
                    <div
                      key={lIdx}
                      className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 shrink-0 rounded-md border border-gray-100 flex items-center justify-center p-1 sm:p-1.5  bg-white hover:border-gray-300 transition-colors"
                    >
                      <img
                        src={logo}
                        alt={`Partner ${lIdx + 1}`}
                        className="max-w-full max-h-full object-contain mix-blend-multiply rounded-sm"
                        onError={(e: any) => { e.target.src = "https://placehold.co/48x48/f1f5f9/94a3b8?text=Logo"; }}
                      />
                    </div>
                  ))}
                </div> */}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsStoriesSection;
