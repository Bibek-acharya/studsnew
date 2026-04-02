"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

interface NewsStoriesSectionProps {
  onNavigate: (view: string, data?: any) => void;
}

const newsData = [
  {
    badgeText: "Admission",
    badgeColorClass: "bg-blue-50 text-blue-600",
    imgSrc: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    title: "KIST College Opens Admissions for BIM & BBA.",
    description: "KIST College has officially opened its admission portal for the upcoming fall intake. Apply now to secure your spot in top-tier management and IT programs.",
    timeAgo: "2 Hours ago",
  },
  {
    badgeText: "Exam",
    badgeColorClass: "bg-orange-50 text-orange-600",
    imgSrc: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    title: "St. Xavier's College +2 Entrance Exam Dates.",
    description: "St. Xavier's College, Maitighar has published the official schedule for the +2 Science and Management entrance examinations. Students are advised to download their admit cards.",
    timeAgo: "1 Day ago",
  },
  {
    badgeText: "Scholarship",
    badgeColorClass: "bg-purple-50 text-purple-600",
    imgSrc: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    title: "Kathmandu University Merit Scholarships.",
    description: "KU announces a new tier of merit-based scholarships for undergraduate engineering and science students securing top ranks in the CBT entrance test.",
    timeAgo: "3 Days ago",
  },
  {
    badgeText: "Event",
    badgeColorClass: "bg-blue-50 text-blue-600",
    imgSrc: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    title: "Trinity International College IT Fest 2026.",
    description: "Join us at Trinity International College for a two-day Tech Fest featuring hackathons, innovative projects, and guest lectures from industry experts.",
    timeAgo: "1 Week ago",
  },
  {
    badgeText: "Notice",
    badgeColorClass: "bg-emerald-50 text-emerald-600",
    imgSrc: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    title: "IOE Pulchowk Entrance Admit Cards Available.",
    description: "The Institute of Engineering (IOE), Pulchowk Campus has officially released the admit cards for the BE/BArch entrance examination. Login to your portal to download.",
    timeAgo: "2 Weeks ago",
  },
];

const NewsStoriesSection: React.FC<NewsStoriesSectionProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

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
    <section className="mt-24 w-full">
      <div className="max-w-[1400px] mx-auto w-full">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-[40px] font-semibold text-[#111827] mb-3 leading-tight tracking-tight">
              Latest News & Stories
            </h2>
            <p className="text-[17px] text-gray-500">
              Your guide to the best academic opportunities in Nepal and beyond.
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              onClick={() => scrollByWidth(-1)}
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-100"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => scrollByWidth(1)}
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-100"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative w-full overflow-hidden">
          {/* Track */}
          <div
            ref={containerRef}
            className="carousel-track flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-6 pt-2"
          >
            {newsData.map((card, index) => (
              <article
                key={index}
                className="min-w-[320px] max-w-[340px] w-full flex-shrink-0 snap-start bg-white rounded-2xl border border-gray-100 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer p-4"
                onClick={() => onNavigate("newsDetails", card)}
              >
                <div className="mb-3">
                  <span className={`inline-flex items-center px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full ${card.badgeColorClass}`}>
                    {card.badgeText}
                  </span>
                </div>
                <div className="overflow-hidden rounded-xl mb-4">
                  <img
                    src={card.imgSrc}
                    alt={card.title}
                    className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e: any) => { e.target.src = "https://placehold.co/600x400/f1f5f9/94a3b8?text=News"; }}
                  />
                </div>
                <h3 className="text-lg font-bold text-[#111827] group-hover:text-blue-600 transition-colors mb-2 leading-snug line-clamp-2">
                  {card.title}
                </h3>
                <p className="text-[14px] text-gray-500 mb-4 flex-grow line-clamp-3 leading-relaxed">
                  {card.description}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center text-gray-400 gap-1.5 text-sm font-medium">
                    <Clock className="w-4 h-4" />
                    <span>{card.timeAgo}</span>
                  </div>
                  <div className="text-[#111827] font-bold text-sm flex items-center gap-1 group-hover:text-blue-600 transition-colors">
                    View Details
                    <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsStoriesSection;
