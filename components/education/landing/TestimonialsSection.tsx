"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TestimonialsSectionProps {
  onNavigate: (view: string, data?: any) => void;
}

const testimonials = [
  {
    id: 1,
    name: "Alex Rivera",
    role: "Software Engineering, Class of '24",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=c0aede",
    rating: 5,
    quote: "The hands-on projects and mentorship completely changed my trajectory. I secured a job at a top tech firm before I even graduated. The curriculum is challenging but incredibly rewarding.",
  },
  {
    id: 2,
    name: "Samantha Lee",
    role: "UX/UI Design Bootcamp",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Samantha&backgroundColor=ffe0b2",
    rating: 5,
    quote: "I came in with zero design experience. The instructors guided me through every step, from user research to high-fidelity prototyping. Now I'm a product designer and loving it!",
  },
  {
    id: 3,
    name: "Marcus Johnson",
    role: "Business Administration",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus&backgroundColor=b6e3f4",
    rating: 4,
    quote: "The networking opportunities here are unparalleled. I connected with industry leaders and found my co-founder during a campus hackathon. Highly recommend the entrepreneurship track.",
  },
  {
    id: 4,
    name: "Elena Rodriguez",
    role: "Data Science Masters",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena&backgroundColor=ffdfbf",
    rating: 5,
    quote: "The deep dive into machine learning algorithms was exactly what I needed. The facilities are state-of-the-art, and the professors are genuinely invested in your success.",
  },
];

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ onNavigate }) => {
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
    <section className="mt-16 sm:mt-20 md:mt-24 w-full">
      <div className="max-w-350 mx-auto w-full">
        {/* Header & Navigation */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 md:mb-12 gap-4 sm:gap-6">
          <div className="max-w-2xl">
            <h2 className="text-[#1A1F36] text-[26px] xs:text-3xl sm:text-4xl md:text-[40px] font-bold tracking-tight mb-2 sm:mb-3 md:mb-4">
              What Our Students Say
            </h2>
            <p className="text-[#4A5568] text-sm sm:text-base md:text-lg leading-relaxed">
              Discover how our programs have transformed the careers and lives of students from around the globe.
            </p>
          </div>

          {/* Carousel Buttons */}
          <div className="flex gap-2 sm:gap-3 md:gap-4 pb-2">
            <button
              onClick={() => scrollByWidth(-1)}
              className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-[#1A1F36] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0000ff]"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => scrollByWidth(1)}
              className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-[#1A1F36] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0000ff]"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-[#F8F9FC] rounded-md p-5 xs:p-6 sm:p-7 md:p-8 relative z-0"
            >
              <div className="absolute top-4 sm:top-5 md:top-6 left-20 xs:left-24 sm:left-28 text-[#E2E8F0] z-[-1] opacity-60">
                <svg width="48" height="48" sm-width="56" sm-height="56" md-width="64" md-height="64" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16">
                  <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z" />
                </svg>
              </div>

              <div className="flex items-center gap-3 sm:gap-3.5 md:gap-4 mb-4 sm:mb-5 md:mb-6">
                <div>
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-11 h-11 xs:w-12 xs:h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full bg-blue-100 object-cover border-2 border-white "
                  />
                </div>
                <div>
                    <h3 className="font-bold text-[#1A1F36] text-sm xs:text-base sm:text-lg">{testimonial.name}</h3>
                    <p className="text-[#5551FF] text-[10px] xs:text-xs sm:text-sm font-medium leading-tight mt-0.5">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex gap-0.5 sm:gap-1 mb-3 sm:mb-4 text-[#FACC15]">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 fill-current ${i < testimonial.rating ? 'text-[#FACC15]' : 'text-[#CBD5E1]'}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-[#4A5568] text-xs xs:text-sm sm:text-[14px] md:text-[15px] leading-relaxed">
                "{testimonial.quote}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
