"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  video: string;
  logo: string;
  logoAlt: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Working with this platform has improved our operational efficiency in ways we didn't expect. The interface is intuitive, the navigation feels seamless, and the support team responds quickly whenever we need assistance.",
    name: "Marcus Wright",
    title: "Operations Manager",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    logo: "https://kist.edu.np/resources/assets/img/logo_small.jpg",
    logoAlt: "KIST Logo",
  },
  {
    quote:
      "This tool has completely transformed how our team collaborates. The visual workflow makes complex projects easy to manage, and we've seen a 30% increase in productivity since implementation.",
    name: "Sarah Jenkins",
    title: "Creative Director",
    video: "https://media.w3.org/2010/05/sintel/trailer.mp4",
    logo: "https://www.trinity.edu.np/assets/backend/uploads/Logo/trinity%20college%20logo.jpg",
    logoAlt: "Trinity Logo",
  },
  {
    quote:
      "Finding software that balances powerful features with genuine ease-of-use is rare. This platform nails it. It integrated perfectly into our existing tech stack without a hitch.",
    name: "David Chen",
    title: "Lead Developer",
    video: "https://media.w3.org/2010/05/bunny/trailer.mp4",
    logo: "https://advancefoundation.edu.np/public/assets/img/logo.jpg",
    logoAlt: "Advance Foundation Logo",
  },
];

interface TestimonialsProps {
  className?: string;
}

export default function Testimonials({ className }: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const currentTestimonial = TESTIMONIALS[currentIndex];

  const goToNext = useCallback(() => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
      setIsFading(false);
    }, 300);
  }, []);

  const goToPrev = useCallback(() => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
      setIsFading(false);
    }, 300);
  }, []);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoChange = () => {
    setIsPlaying(true);
  };

  return (
    <section id="testimonials" className={`py-16 px-4 sm:p-8 bg-white${className || ""}`}>
      <div className="max-w-350 px-8 mx-auto flex flex-col gap-10">
        <div className="w-full bg-transparent flex flex-col md:flex-row items-center gap-8 lg:gap-12">
          <div className="w-full md:w-[45%] lg:w-[40%] flex flex-col relative">
            <div
              className={`w-full h-62.5 md:h-80 lg:h-95 rounded-xl overflow-hidden relative transition-opacity duration-300 ${
                isFading ? "opacity-0" : "opacity-100"
              }`}
            >
              <video
                ref={videoRef}
                key={currentTestimonial.video}
                autoPlay
                loop
                muted
                playsInline
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="w-full h-full object-cover object-center absolute inset-0"
              >
                <source src={currentTestimonial.video} type="video/mp4" />
              </video>

              <button
                onClick={togglePlayPause}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-blue-600 rounded-full p-4 shadow-lg transition-transform hover:scale-105 focus:outline-none z-10"
                aria-label={isPlaying ? "Pause Video" : "Play Video"}
              >
                {isPlaying ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="w-full md:w-[55%] lg:w-[60%] py-4 flex flex-col justify-center bg-transparent relative">
            <div className="flex flex-col">
              <div className="mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0000ff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M14 13h4a1 1 0 0 1 1 1v3a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-6q 0 -4 4 -5" />
                  <path d="M5 13h4a1 1 0 0 1 1 1v3a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-6q 0 -4 4 -5" />
                </svg>
              </div>

              <div className={`transition-opacity duration-300 ${isFading ? "opacity-0" : "opacity-100"}`}>
                <p className="text-gray-800 text-xl md:text-2xl lg:text-3xl leading-relaxed mb-8 font-normal">
                  "{currentTestimonial.quote}"
                </p>
              </div>

              <div className={`flex items-center gap-6 transition-opacity duration-300 ${isFading ? "opacity-0" : "opacity-100"}`}>
                <div className="flex flex-col">
                  <h4 className="font-bold text-gray-900 text-[15px]">{currentTestimonial.name}</h4>
                  <p className="text-gray-500 text-[13px] mt-0.5">{currentTestimonial.title}</p>
                </div>

                <div className="h-10 w-px bg-gray-200" />

                <div className="flex items-center gap-3">
                  <Image
                    src={currentTestimonial.logo}
                    alt={currentTestimonial.logoAlt}
                    width={40}
                    height={40}
                    className="h-10 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center w-full gap-5">
          <button
            onClick={goToPrev}
            className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center bg-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-label="Previous testimonial"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="flex items-center gap-2.5">
            {TESTIMONIALS.map((_, idx) => (
              <span
                key={idx}
                className={`rounded-full transition-all duration-300 ${
                  idx === currentIndex ? "w-6 h-2.5 bg-blue-600" : "w-2.5 h-2.5 bg-gray-200"
                }`}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center bg-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-label="Next testimonial"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}