"use client";

import React, { useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  BadgeCheckIcon,
  Globe,
  Award,
} from "lucide-react";
import { useCoursePageAds, trackAdClick } from "./useCoursePageAds";
import { getImageUrl } from "@/services/api";

const CourseCarouselAd: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const { data: ads, isLoading } = useCoursePageAds("carousel");

  if (isLoading || !ads || ads.length === 0) return null;

  const scroll = (direction: number) => {
    carouselRef.current?.scrollBy({
      left: direction * 300,
      behavior: "smooth",
    });
  };

  const slides = ads.map((ad) => ({
    title: ad.college_name || ad.title,
    rating: ad.college_rating ? Number(ad.college_rating).toFixed(1) : "",
    location: ad.college_location || "",
    affiliation: ad.course_affiliation || "",
    image: ad.college_image || "",
    website: ad.college_website || "",
    link: ad.college_id
      ? `/find-college/${ad.college_id}`
      : ad.link_url || "#",
    ad,
  }));

  const accent = slides[0]?.ad?.accent || "#0000ff";

  return (
    <div
      className="rounded-md p-5"
      style={{
        backgroundColor: accent,
        boxShadow: `0 10px 30px ${accent}33`,
      }}
    >
      <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-lg font-extrabold text-white tracking-tight">
          Featured Colleges
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll(-1)}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-none bg-white transition-all hover:bg-gray-50 hover:scale-105"
            style={{ color: accent }}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll(1)}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-none bg-white transition-all hover:bg-gray-50 hover:scale-105"
            style={{ color: accent }}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        className="overflow-x-auto"
        ref={carouselRef}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div
          className="flex gap-4 items-stretch pb-3"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {slides.map((slide, idx) => (
            <a
              key={slide.ad?.id || idx}
              href={slide.link}
              onClick={() => slide.ad && trackAdClick(slide.ad.id)}
              className="flex w-[220px] shrink-0 flex-col rounded-md border border-gray-200 bg-white p-4 no-underline transition-all duration-300 hover:border-blue-500/20"
              style={{ scrollSnapAlign: "start" }}
            >
              {/* Image */}
              <div className="relative h-[120px] shrink-0 overflow-hidden rounded-md">
                {slide.image ? (
                  <img
                    src={getImageUrl(slide.image)}
                    alt={slide.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-brand-blue">
                    <span className="text-3xl font-bold text-white/30">
                      {slide.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col pt-3">
                {/* Title */}
                <h3
                  className="mb-2 text-[15px] font-bold text-slate-800 tracking-tight line-clamp-2"
                  title={slide.title}
                >
                  {slide.title}
                </h3>

                {/* Rating | Location */}
                <div className="mb-2 flex min-w-0 items-center text-[13px] text-gray-500">
                  {slide.rating && (
                    <>
                      <div className="flex items-center gap-1 font-bold text-slate-700">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        <span>{slide.rating}</span>
                      </div>
                      {slide.location && (
                        <span className="mx-2 text-gray-300 font-light">
                          |
                        </span>
                      )}
                    </>
                  )}
                  {slide.location && (
                    <div className="flex min-w-0 flex-1 items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                      <span
                        className="truncate font-semibold text-slate-700 line-clamp-1"
                        title={slide.location}
                      >
                        {slide.location}
                      </span>
                    </div>
                  )}
                </div>

                {/* Affiliation */}
                {slide.affiliation && (
                  <div className="mb-2 flex items-start gap-1.5 text-[13px] text-gray-500">
                    <Award className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
                    <p
                      className="line-clamp-1 font-semibold leading-snug text-slate-700"
                      title={slide.affiliation}
                    >
                      {slide.affiliation}
                    </p>
                  </div>
                )}

                {/* Website */}
                {slide.website && (
                  <div className="mb-2 flex items-center gap-1.5 text-[13px] text-gray-500">
                    <Globe className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                    <a
                      href={
                        slide.website.match(/^https?:\/\//)
                          ? slide.website
                          : `https://${slide.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="truncate font-medium text-brand-blue hover:underline"
                    >
                      {slide.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}

                {/* View Details */}
                <div className="mt-auto pt-2">
                  <span className="flex w-full items-center justify-center rounded-md bg-brand-blue py-2 text-[12px] font-medium text-white transition-colors hover:bg-blue-700">
                    View Details
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseCarouselAd;
