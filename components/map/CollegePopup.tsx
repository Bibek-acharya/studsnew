"use client";

import { useState, useEffect, useCallback } from "react";
import { Popup } from "react-leaflet";
import Image from "next/image";
import {
  FaMapMarkerAlt,
  FaStar,
  FaBookmark,
  FaTimes,
  FaBuilding,
  FaInfoCircle,
  FaDirections,
  FaShareAlt,
  FaComments,
  FaPhone,
  FaPaperPlane,
  FaExpand,
  FaChevronLeft,
  FaChevronRight,
  FaImages,
} from "react-icons/fa";
import ShareCollegeModal from "@/app/find-college/[id]/ShareCollegeModal";

interface GalleryItem {
  url?: string;
  image?: string;
  src?: string;
  title?: string;
  folder?: string;
}

interface CollegePopupProps {
  college: {
    id: number;
    name: string;
    logo?: string;
    district?: string;
    type?: string;
    rating?: number;
    reviews?: number;
    latitude?: number;
    longitude?: number;
    gallery?: GalleryItem[] | string[];
    phone?: string;
  };
}

export default function CollegePopup({ college }: CollegePopupProps) {
  const [shareOpen, setShareOpen] = useState(false);
  const [origin, setOrigin] = useState("");
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const stars = Math.round(college.rating || 0);

  const typeColor: Record<string, string> = {
    public: "bg-blue-100 text-blue-700",
    private: "bg-green-100 text-green-700",
    community: "bg-purple-100 text-purple-700",
  };
  const typeBadge =
    typeColor[college.type?.toLowerCase() || ""] || "bg-gray-100 text-gray-600";

  const shareUrl = origin
    ? `${origin}/find-college/${college.id}`
    : `https://studsphere.com/find-college/${college.id}`;

  // Parse gallery images
  const galleryImages: string[] = [];
  if (college.gallery && Array.isArray(college.gallery)) {
    for (const item of college.gallery) {
      if (typeof item === "string") {
        galleryImages.push(item);
      } else if (item.url) {
        galleryImages.push(item.url);
      } else if (item.image) {
        galleryImages.push(item.image);
      } else if (item.src) {
        galleryImages.push(item.src);
      }
    }
  }

  const currentImage = galleryImages[galleryIndex] || null;
  const totalImages = galleryImages.length;

  const handlePrev = useCallback(() => {
    if (totalImages === 0) return;
    setGalleryIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  }, [totalImages]);

  const handleNext = useCallback(() => {
    if (totalImages === 0) return;
    setGalleryIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  }, [totalImages]);

  return (
    <>
      <Popup className="college-popup">
        <div
          className="overflow-hidden bg-white border border-gray-200 rounded-md"
          style={{ width: "min(560px, calc(100vw - 24px))" }}
        >
          {/* Header */}
          <div className="px-5 pt-5 pb-3 relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-extrabold text-gray-900 leading-tight m-0">
                  {college.name}
                </h1>
              </div>
              <div className="flex gap-2">
                <button
                  className="w-[42px] h-[42px] border-0 rounded-full bg-gray-100 flex items-center justify-center text-slate-500 cursor-pointer"
                  aria-label="Bookmark"
                >
                  <FaBookmark className="w-[19px] h-[19px]" />
                </button>
                <button
                  className="w-[42px] h-[42px] border-0 rounded-full bg-gray-100 flex items-center justify-center text-slate-500 cursor-pointer"
                  aria-label="Close"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Rating row */}
            <div className="flex items-center gap-[7px] text-sm mt-2">
              {college.rating !== undefined && (
                <>
                  <span className="font-extrabold">{college.rating}</span>
                  <span className="text-amber-400 tracking-tight text-lg">
                    {stars > 0 ? "★".repeat(stars) : ""}
                    {stars < 5 ? "☆".repeat(5 - stars) : ""}
                  </span>
                </>
              )}
              {college.reviews !== undefined && (
                <span className="text-gray-500 ml-0.5">({college.reviews})</span>
              )}
            </div>

            {/* Location */}
            {college.district && (
              <div className="mt-2.5 flex items-center gap-[7px] text-gray-600 text-sm">
                <FaMapMarkerAlt className="text-pink-500 flex-shrink-0" />
                <span>{college.district}</span>
              </div>
            )}
          </div>

          {/* Gallery */}
          {currentImage && (
            <section className="h-[240px] relative overflow-hidden bg-gray-300">
              <Image
                src={currentImage}
                alt={college.name}
                fill
                className="object-cover block"
              />

              {/* Badge */}
              <div className="absolute top-3 left-3 py-[7px] px-3 rounded-lg bg-gray-900/78 text-white text-[13px] font-bold flex items-center gap-[7px]">
                <FaImages className="w-[15px] h-[15px]" />
                Campus View
              </div>

              {/* Expand button */}
              <button
                className="absolute right-3 top-3 w-[38px] h-[38px] border-0 rounded-[9px] bg-gray-900/72 text-white flex items-center justify-center cursor-pointer"
                aria-label="Fullscreen"
              >
                <FaExpand className="w-[19px] h-[19px]" />
              </button>

              {/* Gallery navigation */}
              {totalImages > 1 && (
                <div className="absolute right-3 bottom-3 flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="w-[34px] h-[34px] border-0 rounded-full bg-white/90 text-gray-700 text-xl flex items-center justify-center cursor-pointer"
                    aria-label="Previous"
                  >
                    <FaChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="py-[7px] px-3 rounded-[18px] bg-gray-900/72 text-white text-[13px] font-bold">
                    {galleryIndex + 1}/{totalImages}
                  </span>
                  <button
                    onClick={handleNext}
                    className="w-[34px] h-[34px] border-0 rounded-full bg-white/90 text-gray-700 text-xl flex items-center justify-center cursor-pointer"
                    aria-label="Next"
                  >
                    <FaChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </section>
          )}

          {/* Actions */}
          <section className="px-5 pt-5 pb-4">
            <div className="grid grid-cols-5 gap-3">
              <a
                href="/find-college"
                className="border-0 bg-transparent cursor-pointer flex flex-col items-center gap-2 text-gray-700 text-[13px] font-bold no-underline"
              >
                <span className="w-[50px] h-[50px] rounded-full bg-indigo-600 text-white flex items-center justify-center">
                  <FaBuilding className="w-[22px] h-[22px]" />
                </span>
                <span>View</span>
              </a>

              <a
                href={`/find-college/${college.id}`}
                className="border-0 bg-transparent cursor-pointer flex flex-col items-center gap-2 text-gray-700 text-[13px] font-bold no-underline"
              >
                <span className="w-[50px] h-[50px] rounded-full bg-blue-50 text-indigo-600 flex items-center justify-center">
                  <FaInfoCircle className="w-[22px] h-[22px]" />
                </span>
                <span>Details</span>
              </a>

              <a
                href={
                  college.latitude && college.longitude
                    ? `https://www.google.com/maps/dir/?api=1&destination=${college.latitude},${college.longitude}`
                    : `/find-college/${college.id}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="border-0 bg-transparent cursor-pointer flex flex-col items-center gap-2 text-gray-700 text-[13px] font-bold no-underline"
              >
                <span className="w-[50px] h-[50px] rounded-full bg-blue-50 text-indigo-600 flex items-center justify-center">
                  <FaDirections className="w-[22px] h-[22px]" />
                </span>
                <span>Visit</span>
              </a>

              <a
                href={`/find-college/${college.id}?tab=courses`}
                className="border-0 bg-transparent cursor-pointer flex flex-col items-center gap-2 text-gray-700 text-[13px] font-bold no-underline"
              >
                <span className="w-[50px] h-[50px] rounded-full bg-blue-50 text-indigo-600 flex items-center justify-center">
                  <FaComments className="w-[22px] h-[22px]" />
                </span>
                <span>Courses</span>
              </a>

              <button
                onClick={() => setShareOpen(true)}
                className="border-0 bg-transparent cursor-pointer flex flex-col items-center gap-2 text-gray-700 text-[13px] font-bold"
              >
                <span className="w-[50px] h-[50px] rounded-full bg-blue-50 text-indigo-600 flex items-center justify-center">
                  <FaShareAlt className="w-[22px] h-[22px]" />
                </span>
                <span>Share</span>
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200 my-5 mx-0" />

            {/* Bottom CTAs */}
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href={college.phone ? `tel:${college.phone}` : "#"}
                className="h-12 border-0 rounded-[9px] text-[15px] font-extrabold text-white cursor-pointer flex justify-center items-center gap-[9px] bg-gray-900 no-underline"
              >
                <FaPhone className="w-[18px] h-[18px]" />
                Call Now
              </a>
              <a
                href={`/find-college/${college.id}`}
                className="h-12 border-0 rounded-[9px] text-[15px] font-extrabold text-white cursor-pointer flex justify-center items-center gap-[9px] bg-indigo-600 no-underline"
              >
                <FaPaperPlane className="w-[19px] h-[19px]" />
                Apply / Inquire
              </a>
            </div>
          </section>
        </div>
      </Popup>

      <ShareCollegeModal
        collegeName={college.name}
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        shareUrl={shareUrl}
        shareTitle={college.name}
        shareText={`Check out ${college.name} on Studsphere`}
      />
    </>
  );
}
