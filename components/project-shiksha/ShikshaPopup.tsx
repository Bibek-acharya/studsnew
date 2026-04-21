"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProjectShikshaPopupProps {
  onClose?: () => void;
}

const slides = [
  {
    image: "https://projectshiksha.hundredgroupnepal.org/images/2081.png",
    label: "Project Shiksha Batch 2024",
  },
  {
    image: "https://sowersaction.org.np/wp-content/uploads/2025/10/hostel.png",
    label: "Project Shiksha Batch 2024",
  },
  {
    image: "https://sowersaction.org.np/wp-content/uploads/2025/02/WhatsApp-Image-2025-04-02-at-12.30.05_95c5a826.jpg",
    label: "Project Shiksha Batch 2025",
  },
];

const partners = [
  { logo: "https://projectshiksha.hundredgroupnepal.org/images/hundred.jpg", name: "Hundred Group", role: "Initiation Partner" },
  { logo: "https://projectshiksha.hundredgroupnepal.org/images/sa_new.jpeg", name: "Student Alumni", role: "Organizer Partner" },
  { logo: "https://projectshiksha.hundredgroupnepal.org/images/sower-hk.jpeg", name: "Sower HK", role: "Organizer Partner" },
  { logo: "https://projectshiksha.hundredgroupnepal.org/images/ronb.jpg", name: "RONB", role: "Media Partner" },
  { logo: "https://projectshiksha.hundredgroupnepal.org/images/ncell.png", name: "Ncell", role: "Teach Partner" },
  { logo: "https://projectshiksha.hundredgroupnepal.org/images/creating.png", name: "Creating Possibilities", role: "Teach Partner" },
  { logo: "https://projectshiksha.hundredgroupnepal.org/images/dari-club.jpeg", name: "Dari Club", role: "Teach Partner" },
];

export default function ProjectShikshaPopup({ onClose }: ProjectShikshaPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("studsphere_scholarship_dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => setIsOpen(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    sessionStorage.setItem("studsphere_scholarship_dismissed", "true");
    onClose?.();
  }, [onClose]);

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape" && isOpen) {
      handleClose();
    }
  }, [isOpen, handleClose]);

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [handleEscape]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[150] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="bg-white rounded-xl w-[480px] max-w-full relative overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        {/* Hero Image Slider */}
        <div className="p-3 relative">
          <div className="relative w-full h-36 rounded-lg overflow-hidden border border-gray-100">
            <div
              className="flex w-full h-full transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide, index) => (
                <div key={index} className="w-full h-full shrink-0 relative">
                  <Image
                    src={slide.image}
                    alt={`Campus ${index + 1}`}
                    fill
                    className="object-cover object-center"
                    sizes="480px"
                  />
                  <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-[10px] font-bold text-white px-2.5 py-1 rounded shadow-sm">
                    {slide.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Dot Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 py-1">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "w-4 bg-[#0000ff] opacity-100"
                      : "w-1.5 bg-[#0000ff] opacity-40 hover:opacity-70"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 text-white/90 hover:text-white bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full p-1.5 transition-colors z-20"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Card Body */}
        <div className="pt-1 pb-5 px-6 text-left">
          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 leading-tight mb-3">
            Project Shiksha Scholarship 2026 for +2
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Project Shiksha provides fully-funded educational opportunities to deserving students, ensuring financial barriers do not hinder academic excellence and future potential...
            <span className="text-sm text-[#0000ff] cursor-pointer hover:underline font-semibold ml-1">
              Read more
            </span>
          </p>

          {/* Partners */}
          <div className="mb-4">
            <p className="text-[13px] font-semibold text-gray-800 mb-2.5">Project Shiksha Partners</p>
            <div className="flex gap-2 items-center flex-wrap">
              {partners.map((partner, index) => (
                <div
                  key={index}
                  className="group relative w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center shrink-0 shadow-sm hover:shadow-md transition-shadow p-1.5 cursor-help"
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#0000ff] text-white text-xs font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 shadow-lg">
                    {partner.role}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-[#0000ff]" />
                  </div>
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <button
                onClick={handleClose}
                className="flex-1 bg-transparent hover:bg-gray-50 border border-gray-200 text-gray-700 font-semibold text-sm py-2 rounded transition-colors"
              >
                View Details
              </button>
              <Link
                href="/scholarship-apply/project-shiksha"
                onClick={handleClose}
                className="flex-[1.5] bg-[#0000ff] hover:bg-[#0000cc] text-white font-semibold text-sm py-2 rounded transition-all transform active:scale-[0.98] flex justify-center items-center gap-2"
              >
                Apply Now
              </Link>
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`w-10 flex shrink-0 justify-center items-center hover:bg-gray-50 border transition-colors rounded ${
                  isBookmarked
                    ? "bg-blue-50 border-[#0000ff] text-[#0000ff]"
                    : "bg-white border-gray-200 text-gray-400 hover:text-[#0000ff]"
                }`}
                aria-label="Save bookmark"
              >
                <Bookmark className={`w-4 h-4 transition-all ${isBookmarked ? "fill-current" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
