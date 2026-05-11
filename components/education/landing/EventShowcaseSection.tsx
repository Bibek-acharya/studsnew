"use client";

import { useEffect, useState } from "react";

interface ShowcaseSlide {
  image: string;
  title: string;
  link_url: string;
  location?: string;
  date?: string;
}

interface EventShowcaseSectionProps {
  onNavigate: (view: string, data?: any) => void;
}

const EventShowcaseSection: React.FC<EventShowcaseSectionProps> = ({ onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<ShowcaseSlide[]>([]);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/system/ads?page=landing&position=showcase`);
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          setSlides(
            json.data.map((ad: { image_url: string; title?: string; link_url?: string; location?: string; start_date?: string }) => ({
              image: ad.image_url.startsWith("/uploads") ? `${API_BASE}${ad.image_url}` : ad.image_url,
              title: ad.title || "Learn More",
              link_url: ad.link_url || "#",
              location: ad.location || "",
              date: ad.start_date ? new Date(ad.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "",
            }))
          );
        }
      } catch {}
    };
    fetchAds();
  }, []);

  const eventSlides = slides.map((slide) => ({
    image: slide.image,
    alt: slide.title,
    badgeText: "Featured",
    title: slide.title,
    link_url: slide.link_url,
    date: slide.date || "",
    location: slide.location || "",
    interested: "",
    avatars: [],
  }));

  useEffect(() => {
    if (eventSlides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % eventSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [eventSlides.length]);

  if (eventSlides.length === 0) return null;

  const previousSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + eventSlides.length) % eventSlides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % eventSlides.length);
  };

  return (
<section className="w-full py-8 sm:py-10 md:py-12 lg:py-14 my-2 sm:my-4 relative px-4 sm:px-6 md:px-8">
  <div className="max-w-350 mx-auto w-full">
        <div className="relative w-full mx-auto">
          <div className="overflow-hidden w-full relative">
            <div
              id="slider-track"
              className="flex transition-transform duration-500 ease-in-out w-full"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {eventSlides.map((slide, index) => (
                <div
                  key={index}
                  className="w-full shrink-0 flex flex-col lg:flex-row items-center gap-6 sm:gap-8 md:gap-10 lg:gap-16 px-1 sm:px-2 md:px-1"
                >
                  <div className="w-full lg:w-[55%]">
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      className="w-full h-[200px] xs:h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px] object-cover rounded-xl md:rounded-xl "
                    />
                  </div>

                  <div className="w-full lg:w-[45%] flex flex-col items-start pr-0 lg:pr-10">
                    <div
                      className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border mb-4 sm:mb-5 md:mb-6 ${"badgeClass" in slide ? slide.badgeClass : "bg-blue-50 border-blue-100 text-[#0000FF]"}`}
                    >
                      <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${"badgeIconClass" in slide ? slide.badgeIconClass : "text-[#0000FF]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="font-medium text-xs sm:text-sm">{slide.badgeText || "Featured"}</span>
                    </div>

                    <h2 className="text-[22px] xs:text-[26px] sm:text-3xl md:text-[36px] lg:text-[40px] font-bold text-gray-900 leading-[1.2] mb-4 sm:mb-5 md:mb-6 tracking-tight">
                      {slide.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-gray-700 font-medium text-xs sm:text-sm md:text-base mb-6 sm:mb-8">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{slide.date}</span>
                      </div>
                      <span className="text-gray-300 hidden xs:inline">|</span>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{slide.location || "Kathmandu"}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6">
                      <a
                        href={slide.link_url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center bg-brand-blue hover:bg-[#0000CC] text-white font-semibold py-2.5 sm:py-3 md:py-3.5 px-5 sm:px-6 md:px-8 rounded-md transition-colors text-[13px] sm:text-[14px] md:text-[15px]"
                      >
                        Apply Now
                      </a>


                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-5 mt-6 sm:mt-8 md:mt-10">
            <button
              onClick={previousSlide}
              className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <div className="flex items-center justify-center gap-1.5 sm:gap-2" id="pills-container">
              {eventSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`pill h-2 rounded-full transition-all duration-300 ${
                    currentSlide === index ? "w-7 sm:w-8 bg-brand-blue" : "w-3 sm:w-4 bg-gray-200 hover:bg-gray-300"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={nextSlide}
              className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventShowcaseSection;
