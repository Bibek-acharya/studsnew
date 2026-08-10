"use client";

import { useState, useEffect, useCallback } from "react";
import { Popup } from "react-leaflet";
import Image from "next/image";
import {
  FaMapMarkerAlt,
  FaStar,
  FaRegBookmark,
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
  FaCheck,
  FaSpinner,
} from "react-icons/fa";
import ShareCollegeModal from "@/app/find-college/[id]/ShareCollegeModal";
import { useBookmark } from "@/app/find-college/[id]/hooks/useBookmark";
import { useAuth } from "@/services/AuthContext";
import { toast } from "sonner";

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
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [origin, setOrigin] = useState("");
  const [galleryIndex, setGalleryIndex] = useState(0);

  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquirySending, setInquirySending] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);

  const { isAuthenticated } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmark(college.id);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const stars = Math.round(college.rating || 0);

  const shareUrl = origin
    ? `${origin}/find-college/${college.id}`
    : `https://studsphere.com/find-college/${college.id}`;

  // Parse gallery images
  const galleryImages: string[] = [];
  if (college.gallery && Array.isArray(college.gallery)) {
    for (const item of college.gallery) {
      if (typeof item === "string") {
        galleryImages.push(item);
      } else if (item && typeof item === "object") {
        // Handle GalleryGroup format: { folder: string, images: string[] }
        if (Array.isArray((item as any).images)) {
          for (const img of (item as any).images) {
            if (typeof img === "string") galleryImages.push(img);
          }
        } else if ((item as any).url) {
          galleryImages.push((item as any).url);
        } else if ((item as any).image) {
          galleryImages.push((item as any).image);
        } else if ((item as any).src) {
          galleryImages.push((item as any).src);
        }
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

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryMessage.trim()) return;

    if (!isAuthenticated) {
      toast.error("Please log in to send an inquiry");
      return;
    }

    setInquirySending(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      await fetch(`${API_BASE}/api/v1/institutions/${college.id}/inquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: `Inquiry about ${college.name}`,
          content: inquiryMessage.trim(),
        }),
      });
      setInquirySent(true);
    } catch {
      toast.error("Failed to send inquiry");
    } finally {
      setInquirySending(false);
    }
  };

  const closeInquiry = () => {
    setInquiryOpen(false);
    setInquirySent(false);
    setInquiryMessage("");
  };

  return (
    <>
      <Popup>
        <div className="overflow-hidden bg-white border border-gray-200 rounded-md" style={{ width: "min(320px, calc(100vw - 24px))" }}>
          {/* Header */}
          <div className="px-3 pt-3 pb-2">
            <div className="flex items-start justify-between gap-2">
              <h1 className="text-sm font-extrabold text-gray-900 leading-tight m-0">
                {college.name}
              </h1>
              <div className="flex gap-1.5 shrink-0">
                <button
                  onClick={toggleBookmark}
                  className={`w-7 h-7 border-0 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                    isBookmarked
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-gray-100 text-slate-500 hover:bg-gray-200"
                  }`}
                  aria-label="Bookmark"
                >
                  {isBookmarked ? (
                    <FaBookmark className="w-3 h-3" />
                  ) : (
                    <FaRegBookmark className="w-3 h-3" />
                  )}
                </button>
                <button
                  className="w-7 h-7 border-0 rounded-full bg-gray-100 flex items-center justify-center text-slate-500 cursor-pointer hover:bg-gray-200"
                  aria-label="Close"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 text-xs mt-1">
              {(college.rating ?? 0) > 0 && (
                <>
                  <span className="font-extrabold">{college.rating}</span>
                  <span className="text-amber-400 tracking-tight text-sm">
                    {stars > 0 ? "★".repeat(stars) : ""}
                    {stars < 5 ? "☆".repeat(5 - stars) : ""}
                  </span>
                </>
              )}
              {(college.reviews ?? 0) > 0 && (
                <span className="text-gray-500">({college.reviews})</span>
              )}
            </div>

            {/* Location */}
            {college.district && (
              <div className="mt-1.5 flex items-center gap-1 text-gray-600 text-xs">
                <FaMapMarkerAlt className="text-pink-500 shrink-0 w-3 h-3" />
                <span>{college.district}</span>
              </div>
            )}
          </div>

          {/* Gallery */}
          {currentImage && (
            <section className="h-[160px] relative overflow-hidden bg-gray-300">
              <Image src={currentImage} alt={college.name} fill className="object-cover" />

              <div className="absolute top-2 left-2 py-1 px-2 rounded-md bg-gray-900/78 text-white text-[10px] font-bold flex items-center gap-1">
                <FaImages className="w-3 h-3" />
                Campus View
              </div>

              <button className="absolute right-2 top-2 w-7 h-7 border-0 rounded-md bg-gray-900/72 text-white flex items-center justify-center cursor-pointer" aria-label="Fullscreen">
                <FaExpand className="w-3 h-3" />
              </button>

              {totalImages > 1 && (
                <div className="absolute right-2 bottom-2 flex items-center gap-1">
                  <button onClick={handlePrev} className="w-6 h-6 border-0 rounded-full bg-white/90 text-gray-700 flex items-center justify-center cursor-pointer" aria-label="Previous">
                    <FaChevronLeft className="w-2.5 h-2.5" />
                  </button>
                  <span className="py-1 px-2 rounded-full bg-gray-900/72 text-white text-[10px] font-bold">
                    {galleryIndex + 1}/{totalImages}
                  </span>
                  <button onClick={handleNext} className="w-6 h-6 border-0 rounded-full bg-white/90 text-gray-700 flex items-center justify-center cursor-pointer" aria-label="Next">
                    <FaChevronRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              )}
            </section>
          )}

          {/* Actions */}
          <section className="px-3 pt-3 pb-3">
            <div className="grid grid-cols-5 gap-1.5">
              <a href="/find-college" className="border-0 bg-transparent cursor-pointer flex flex-col items-center gap-1 text-gray-700 text-[10px] font-bold no-underline">
                <span className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                  <FaBuilding className="w-3.5 h-3.5" />
                </span>
                <span>View</span>
              </a>

              <a href={`/find-college/${college.id}`} className="border-0 bg-transparent cursor-pointer flex flex-col items-center gap-1 text-gray-700 text-[10px] font-bold no-underline">
                <span className="w-9 h-9 rounded-full bg-blue-50 text-indigo-600 flex items-center justify-center">
                  <FaInfoCircle className="w-3.5 h-3.5" />
                </span>
                <span>Details</span>
              </a>

              <a
                href={college.latitude && college.longitude ? `https://www.google.com/maps/dir/?api=1&destination=${college.latitude},${college.longitude}` : `/find-college/${college.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border-0 bg-transparent cursor-pointer flex flex-col items-center gap-1 text-gray-700 text-[10px] font-bold no-underline"
              >
                <span className="w-9 h-9 rounded-full bg-blue-50 text-indigo-600 flex items-center justify-center">
                  <FaDirections className="w-3.5 h-3.5" />
                </span>
                <span>Visit</span>
              </a>

              <a href={`/find-college/${college.id}?tab=courses`} className="border-0 bg-transparent cursor-pointer flex flex-col items-center gap-1 text-gray-700 text-[10px] font-bold no-underline">
                <span className="w-9 h-9 rounded-full bg-blue-50 text-indigo-600 flex items-center justify-center">
                  <FaComments className="w-3.5 h-3.5" />
                </span>
                <span>Courses</span>
              </a>

              <button onClick={() => setShareOpen(true)} className="border-0 bg-transparent cursor-pointer flex flex-col items-center gap-1 text-gray-700 text-[10px] font-bold">
                <span className="w-9 h-9 rounded-full bg-blue-50 text-indigo-600 flex items-center justify-center">
                  <FaShareAlt className="w-3.5 h-3.5" />
                </span>
                <span>Share</span>
              </button>
            </div>

            <div className="h-px bg-gray-200 my-3" />

            <div className="grid grid-cols-2 gap-2">
              <a href={college.phone ? `tel:${college.phone}` : "#"} className="h-9 border-0 rounded-md text-xs font-extrabold text-white cursor-pointer flex justify-center items-center gap-1.5 bg-gray-900 no-underline">
                <FaPhone className="w-3 h-3 rotate-90" />
                Call Now
              </a>
              <button onClick={() => setInquiryOpen(true)} className="h-9 border-0 rounded-md text-xs font-extrabold text-white cursor-pointer flex justify-center items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 transition-colors">
                <FaPaperPlane className="w-3 h-3" />
                Inquiry
              </button>
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

      {/* Inquiry Modal */}
      {inquiryOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm" onClick={closeInquiry}>
          <div className="mx-4 flex max-h-[90vh] w-full max-w-lg flex-col rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
            {inquirySent ? (
              <div className="text-center py-8 px-6">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 mx-auto">
                  <FaCheck className="text-green-600 text-2xl" />
                </div>
                <p className="text-gray-900 font-bold text-lg">Inquiry Sent!</p>
                <p className="text-sm text-gray-500 mt-1">
                  Your inquiry for {college.name} has been sent. The institution will respond soon.
                </p>
                <div className="mt-6 flex gap-3 justify-center">
                  <button onClick={closeInquiry} className="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors">
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-5">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                    <FaPaperPlane className="text-[20px] text-indigo-600" />
                    Inquiry for {college.name}
                  </h3>
                  <button onClick={closeInquiry} className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700">
                    <FaTimes className="text-[20px]" />
                  </button>
                </div>
                <div className="overflow-y-auto px-6 py-5">
                  <form onSubmit={handleInquirySubmit}>
                    <div className="mb-5">
                      <label htmlFor="inquiryMessage" className="mb-2 block text-[14px] font-bold text-gray-800">
                        Your Question / Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="inquiryMessage"
                        required
                        rows={4}
                        value={inquiryMessage}
                        onChange={(e) => setInquiryMessage(e.target.value)}
                        className="w-full resize-none rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-[14px] text-gray-800 transition-all focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="E.g., What are the admission requirements, fee structures, and scholarship options?"
                      />
                    </div>
                    <div className="mt-8 flex flex-col justify-end gap-3 sm:flex-row">
                      <button type="button" onClick={closeInquiry} className="w-full rounded-md border border-gray-200 bg-white px-5 py-2.5 text-[14px] font-bold text-gray-600 transition-colors hover:bg-gray-50 sm:w-auto">
                        Cancel
                      </button>
                      <button type="submit" disabled={inquirySending || !inquiryMessage.trim()} className="flex w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-6 py-2.5 text-[14px] font-bold text-white transition-all hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto">
                        {inquirySending ? (<><FaSpinner className="animate-spin" /> Sending...</>) : "Submit Inquiry"}
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
