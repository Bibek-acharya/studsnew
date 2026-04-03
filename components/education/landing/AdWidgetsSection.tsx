"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdSlide {
  image: string;
  title: string;
  description?: string;
}

const adCarousels: AdSlide[][] = [
  [
    {
      image: "https://kist-edu-np.s3.ap-south-1.amazonaws.com/uploads/media/c41b90bcc485bfd7e06896d9bd8deb1c75a299431672641200.jpg",
      title: "Discover Campus Life",
    },
    {
      image: "https://kist-edu-np.s3.ap-south-1.amazonaws.com/uploads/album/value/e71ee13b2c733ac02f8709c49f3677c3d0f2d9d01766569944.jpg",
      title: "Explore Academic Programs",
    },
    {
      image: "https://kist-edu-np.s3.ap-south-1.amazonaws.com/uploads/slider/4936925f5363b99c1eb6862c5af01996bf9aaa541625033698.jpg",
      title: "Join Our Community",
    },
  ],
  [
    {
      image: "https://kist-edu-np.s3.ap-south-1.amazonaws.com/uploads/media/c41b90bcc485bfd7e06896d9bd8deb1c75a299431672641200.jpg",
      title: "Scholarships Available",
      description: "Apply now to unlock funding opportunities for the 2026 academic year.",
    },
    {
      image: "https://kist.edu.np/resources/assets/img/kist_building.jpg",
      title: "World-Class Facilities",
      description: "State-of-the-art labs, libraries, and modern campus infrastructure.",
    },
    {
      image: "https://kist-edu-np.s3.ap-south-1.amazonaws.com/uploads/album/value/3b46b09ce63aa0e3b287a5b1855ce3df27e6b98e1705905215.jpg",
      title: "Student Success Stories",
      description: "Hear from our alumni who are making a difference around the globe.",
    },
  ],
];

const AdCard: React.FC<{ slides: AdSlide[]; carouselIndex: number }> = ({ slides, carouselIndex }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000 + carouselIndex * 1500);
    return () => clearInterval(interval);
  }, [nextSlide, carouselIndex]);

  const activeSlide = slides[currentSlide];

  return (
    <div
      className="relative w-full h-[200px] xs:h-[230px] sm:h-[250px] md:h-[260px] rounded-lg overflow-hidden group shadow-sm bg-gray-900 cursor-pointer"
    >
      <img
        src={activeSlide.image}
        alt={activeSlide.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        onError={(e: any) => {
          e.target.src = "https://placehold.co/800x400/1e293b/94a3b8?text=Ad";
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-black/40 backdrop-blur-md text-white/90 text-[9px] xs:text-[10px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded uppercase tracking-wider">
        Ad
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          prevSlide();
        }}
        className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
        aria-label="Previous"
      >
        <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }}
        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
        aria-label="Next"
      >
        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </button>

      <div className="absolute bottom-5 sm:bottom-6 md:bottom-8 left-4 sm:left-5 md:left-6 right-4 sm:right-5 md:right-6">
        <h2 className="text-white text-lg xs:text-xl sm:text-2xl font-bold mb-0.5 sm:mb-1 transition-opacity duration-300">
          {activeSlide.title}
        </h2>
        {activeSlide.description && (
          <p className="text-white/80 text-xs sm:text-sm line-clamp-2 transition-opacity duration-300">
            {activeSlide.description}
          </p>
        )}
      </div>

      <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex items-center space-x-1 sm:space-x-1.5 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentSlide(index);
            }}
            className={`rounded-full transition-all duration-300 ${
              currentSlide === index
                ? "w-5 sm:w-6 h-1 sm:h-1.5 bg-white"
                : "w-1 sm:w-1.5 h-1 sm:h-1.5 bg-white/50 hover:bg-white/80 cursor-pointer"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const AdWidgetsSection = () => {
  return (
    <section className="mt-16 sm:mt-20 md:mt-24 w-full">
      <div className="max-w-[1400px] mx-auto w-full px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          {adCarousels.map((slides, index) => (
            <AdCard key={index} slides={slides} carouselIndex={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdWidgetsSection;
