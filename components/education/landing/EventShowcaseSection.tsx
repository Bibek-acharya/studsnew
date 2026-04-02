"use client";

import { useEffect, useState } from "react";

interface EventShowcaseSectionProps {
  onNavigate: (view: string, data?: any) => void;
}

const EventShowcaseSection: React.FC<EventShowcaseSectionProps> = ({ onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [eventSlides, setEventSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Using mock data since API service may not be available
    setEventSlides([
      {
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200",
        alt: "AI Conference Event",
        badgeIcon: "fa-bolt",
        badgeClass: "bg-blue-50 border-blue-100 text-blue-700",
        badgeIconClass: "text-blue-600",
        badgeText: "Featured",
        title: "Learn today, lead tomorrow — your AI journey starts here!",
        date: "Sat,15 Nov",
        location: "Sallaghari,Bhaktpur",
        interested: "100+ Interested",
        avatars: [33, 47, 12],
      }
    ]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (eventSlides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % eventSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [eventSlides.length]);

  if (loading) return null;
  if (eventSlides.length === 0) return null;

  const previousSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + eventSlides.length) % eventSlides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % eventSlides.length);
  };

  return (
    <section className="w-full py-10 md:py-14 my-4 relative">
      <div className="max-w-[1400px] mx-auto w-full">
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
                className="w-full shrink-0 flex flex-col lg:flex-row items-center gap-10 lg:gap-16 px-2 md:px-1"
              >
                <div className="w-full lg:w-[55%]">
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="w-full h-[300px] md:h-[420px] object-cover rounded-[2rem] shadow-sm"
                  />
                </div>

                <div className="w-full lg:w-[45%] flex flex-col items-start pr-0 lg:pr-10">
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6 ${slide.badgeClass || "bg-blue-50 border-blue-100 text-blue-700"}`}
                  >
                    <svg className={`w-4 h-4 ${slide.badgeIconClass || "text-blue-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="font-medium text-sm">{slide.badgeText || "Featured"}</span>
                  </div>

                  <h2 className="text-[28px] md:text-[40px] font-bold text-gray-900 leading-[1.2] mb-6 tracking-tight">
                    {slide.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-3 text-gray-700 font-medium text-sm md:text-base mb-8">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{slide.date}</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{slide.location || "Kathmandu"}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6">
                    <button
                      type="button"
                      onClick={() => onNavigate("events", slide)}
                      className="inline-flex items-center justify-center bg-[#4461f2] hover:bg-blue-700 text-white font-semibold py-3.5 px-8 rounded-xl transition-colors shadow-sm"
                    >
                      Apply Now
                    </button>

                    <button
                      type="button"
                      onClick={() => onNavigate("eventsPage", slide)}
                      className="inline-flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 hover:border-blue-100 text-gray-700 font-semibold py-3.5 px-8 rounded-xl transition-colors shadow-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center gap-5 mt-8 md:mt-10">
          <button
            onClick={previousSlide}
            className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div className="flex items-center justify-center gap-2" id="pills-container">
            {eventSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`pill h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index ? "w-8 bg-[#4461f2]" : "w-4 bg-gray-200 hover:bg-gray-300"
                }`}
              />
            ))}
          </div>
          <button
            onClick={nextSlide}
            className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>
      </div>
    </section>
  );
};

export default EventShowcaseSection;
