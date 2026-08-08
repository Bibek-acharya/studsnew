"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TestimonialCard from "@/components/ui/TestimonialCard";

interface Testimonial {
  id: number;
  user_name: string;
  rating: number;
  experience: string;
  role?: string;
  image_url?: string;
  created_at?: string;
}

interface TestimonialsSectionProps {
  onNavigate: (view: string, data?: { [key: string]: unknown }) => void;
  testimonials?: Testimonial[];
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ onNavigate, testimonials = [] }) => {
  void onNavigate;

  const containerRef = useRef<HTMLDivElement | null>(null);

  const scrollByWidth = (direction: -1 | 1) => {
    const container = containerRef.current;
    if (!container) return;
    const scrollAmount = 420;
    container.scrollBy({ left: scrollAmount * direction, behavior: "smooth" });
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return "";
    }
  };

  return (
    <section className="mt-16 sm:mt-20 md:mt-24 w-full px-4 sm:px-6 md:px-8">
      <div className="max-w-350 mx-auto w-full">
        <div className="flex items-start justify-between gap-4 sm:gap-6 mb-4 sm:mb-6 md:mb-12">
          <div className="max-w-2xl">
            <h2 className="text-[#1A1F36] text-[26px] xs:text-3xl sm:text-4xl md:text-[40px] font-bold tracking-tight mb-2 sm:mb-3 md:mb-4">
              What Our Students Say
            </h2>
            <p className="text-[#4A5568] text-sm sm:text-base md:text-lg leading-relaxed">
              Discover how our programs have transformed the careers and lives of students from around the globe.
            </p>
          </div>

          <div className="flex shrink-0 gap-2 sm:gap-3 md:gap-4 pb-2">
            <button
              onClick={() => scrollByWidth(-1)}
              className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-[#1A1F36] transition-colors focus:outline-none"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => scrollByWidth(1)}
              className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-[#1A1F36] transition-colors focus:outline-none"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="flex flex-nowrap gap-6 overflow-x-auto no-scrollbar pb-2"
          style={{ scrollBehavior: "smooth", scrollSnapType: "x mandatory" }}
        >
          {testimonials.map((t) => (
            <TestimonialCard
              key={t.id}
              name={t.user_name || "Anonymous"}
              role={t.role}
              rating={t.rating}
              text={t.experience}
              imageUrl={t.image_url}
              date={formatDate(t.created_at)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
