"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import TestimonialCard from "@/components/ui/TestimonialCard";
import { feedbackApi } from "@/services/api";
import Link from "next/link";

const partners = [
  {
    src: "/images/partners/sa_new.jpeg",
    alt: "Sowers Action Nepal",
  },
  {
    src: "/images/partners/ronb.jpg",
    alt: "RONB",
  },
  {
    src: "/images/partners/ncell.png",
    alt: "Ncell",
  },
  {
    src: "/images/partners/creating.png",
    alt: "Creating Opportunities",
  },
  {
    src: "/images/partners/dari-club.jpeg",
    alt: "Dari Club USA",
  },
];

export default function AboutPage() {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const testimonialRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const fetchTestimonials = useCallback(async () => {
    try {
      const res = await feedbackApi.getPublicFeedbacks();
      setTestimonials(res.data || []);
    } catch {
      // silently fail, testimonials section won't render
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  useEffect(() => {
    const counters = document.querySelectorAll<HTMLElement>(".counter");
    const speed = 100;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const target = Number(el.dataset.target || "0");
            let current = 0;

            const updateCount = () => {
              const inc = target / speed;
              if (current < target) {
                current += inc;
                el.innerText = Math.ceil(current).toLocaleString();
                setTimeout(updateCount, 20);
              } else {
                el.innerText = target.toLocaleString();
              }
            };

            setTimeout(updateCount, 300);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 },
    );

    counters.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (showReviewModal || showPartnerModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showReviewModal, showPartnerModal]);

  const scrollTestimonial = (direction: "left" | "right") => {
    if (testimonialRef.current) {
      testimonialRef.current.scrollBy({
        left: direction === "left" ? -400 : 400,
        behavior: "smooth",
      });
    }
  };

  const formatTestimonialDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRating === 0) {
      alert("Please select a rating.");
      return;
    }
    const form = formRef.current;
    if (!form) return;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const designation = formData.get("designation") as string;
    const review = formData.get("review") as string;

    setSubmitting(true);
    try {
      await feedbackApi.submitTestimonial({
        name,
        designation,
        rating: selectedRating,
        review,
      });
      setSubmitted(true);
      setTimeout(() => {
        setShowReviewModal(false);
        setSelectedRating(0);
        setSubmitted(false);
        fetchTestimonials();
      }, 2000);
    } catch {
      alert("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your interest! We will contact you soon.");
    setShowPartnerModal(false);
  };

  return (
    <div>
      <main className="flex-grow flex flex-col items-center px-4 overflow-x-hidden pt-8 md:pt-12">
        {/* ==================== HERO SECTION ==================== */}
        <section
          className="relative w-full max-w-350 mx-auto mb-16 md:mb-24 rounded-2xl h-[50svh] min-h-[300px] max-h-[70svh] bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "url('/about-us.jpeg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 pointer-events-none" />

          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg">
              About Us
            </h1>
          </div>

          <div className="absolute bottom-0 left-0 w-full px-6 pb-12 md:pb-16 flex flex-col md:flex-row justify-center items-start md:items-center gap-10 md:gap-16 max-w-6xl mx-auto right-0 z-30 pointer-events-none">
            <div className="flex items-center gap-4">
              <div className="flex items-start">
                <span
                  className="counter text-white text-4xl md:text-6xl font-extrabold tracking-tight leading-none drop-shadow-sm"
                  data-target="4"
                >
                  0
                </span>
                <span className="text-white text-3xl md:text-5xl font-extrabold tracking-tight leading-none ml-1 drop-shadow-sm">
                  K+
                </span>
              </div>
              <div className="text-white/90 text-sm md:text-base leading-snug tracking-wide flex flex-col justify-center font-medium">
                <span>Students</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-start">
                <span
                  className="counter text-white text-4xl md:text-6xl font-extrabold tracking-tight leading-none drop-shadow-sm"
                  data-target="10"
                >
                  0
                </span>
                <span className="text-white text-3xl md:text-5xl font-extrabold tracking-tight leading-none ml-1 drop-shadow-sm">
                  +
                </span>
              </div>
              <div className="text-white/90 text-sm md:text-base leading-snug tracking-wide flex flex-col justify-center font-medium">
                <span>Opportunities</span>
              </div>
            </div>

            {/* <div className="flex items-center gap-4">
              <div className="flex items-start">
                <span className="counter text-white text-4xl md:text-6xl font-extrabold tracking-tight leading-none drop-shadow-sm" data-target="50">0</span>
                <span className="text-white text-3xl md:text-5xl font-extrabold tracking-tight leading-none ml-1 drop-shadow-sm">+</span>
              </div>
              <div className="text-white/90 text-sm md:text-base leading-snug tracking-wide flex flex-col justify-center font-medium">
                <span>Partner</span>
                <span>Institutions</span>
              </div>
            </div> */}
          </div>
        </section>

        {/* ==================== HOW IT STARTED ==================== */}
        <section className="mb-20 md:mb-32 w-full max-w-7xl px-2 md:px-6 flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 md:mb-12 text-center">
            How it started
          </h2>
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 relative">
            <div className="hidden md:flex flex-col items-center order-1 mt-[-40px] animate-float">
              <img
                src="/founders/santosh.jpeg"
                alt="Santosh"
                className="w-[90px] h-[90px] rounded-full object-cover border-4 border-white shadow-lg z-10"
              />
              <div
                className="name-badge text-white text-center font-semibold min-w-[110px]"
                style={{ backgroundColor: "#0A61EF" }}
              >
                Santosh
              </div>
            </div>

            <div className="max-w-xl text-center text-slate-600 leading-relaxed space-y-6 order-2 px-4">
              <p className="text-base md:text-lg">
                <span className="font-bold text-blue-600">StudSphere</span> is a
                youth-driven platform dedicated to empowering students across
                Nepal by providing them with the right guidance, opportunities,
                and pathways to shape their future.
              </p>
              <p className="text-base md:text-lg">
                Through mentorship and resources, we aim to bridge the gap
                between academic learning and real-world application, ensuring
                every student has the tools they need to succeed.
              </p>
            </div>

            <div
              className="hidden md:flex flex-col items-center order-3 mt-[-40px] animate-float"
              style={{ animationDelay: "1s" }}
            >
              <img
                src="/founders/jagdish.jpeg"
                alt="Jagdish"
                className="w-[90px] h-[90px] rounded-full object-cover border-4 border-white shadow-lg z-10"
              />
              <div
                className="name-badge text-white text-center font-semibold min-w-[110px]"
                style={{ backgroundColor: "#8476F1" }}
              >
                Jagdish
              </div>
            </div>
          </div>

          <div className="flex md:hidden flex-wrap justify-center gap-8 mt-10">
            <div className="flex flex-col items-center animate-float">
              <img
                src="/founders/santosh.jpeg"
                alt="Santosh"
                className="w-[80px] h-[80px] rounded-full object-cover border-4 border-white shadow-lg z-10"
              />
              <div
                className="name-badge text-white text-center font-semibold min-w-[100px] text-xs"
                style={{ backgroundColor: "#0A61EF" }}
              >
                Santosh
              </div>
            </div>
            <div
              className="flex flex-col items-center animate-float"
              style={{ animationDelay: "1s" }}
            >
              <img
                src="/founders/jagdish.jpeg"
                alt="Jagdish"
                className="w-[80px] h-[80px] rounded-full object-cover border-4 border-white shadow-lg z-10"
              />
              <div
                className="name-badge text-white text-center font-semibold min-w-[100px] text-xs"
                style={{ backgroundColor: "#8476F1" }}
              >
                Jagdish
              </div>
            </div>
          </div>

          <div
            className="flex flex-col items-center mt-8 md:mt-12 animate-float"
            style={{ animationDelay: "2s" }}
          >
            <img
              src="/founders/badal.jpeg"
              alt="Badal"
              className="w-[80px] h-[80px] md:w-[90px] md:h-[90px] rounded-full object-cover border-4 border-white shadow-lg z-10"
            />
            <div
              className="name-badge text-white text-center font-semibold min-w-[100px] md:min-w-[110px] text-xs md:text-sm"
              style={{ backgroundColor: "#EEAE85" }}
            >
              Badal
            </div>
          </div>
        </section>

        {/* ==================== OUR STORY, MISSION & VISION ==================== */}
        <section className="w-full max-w-350 mb-20 md:mb-32 px-2">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-8 md:mb-12">
            Our Story, Mission &amp; Vision
          </h2>
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8 items-start justify-center">
            <Link
              href="/our-story"
              className="xl:col-span-7 flex justify-center xl:justify-end"
            >
              <div className="story-card relative rounded-xl overflow-hidden group w-full h-[300px] md:h-[400px]">
                <img
                  src="/our-story.jpeg"
                  alt="Our Story"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A61EF]/90 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">
                    Our Story
                  </h3>
                  <p className="text-sm md:text-base text-blue-50 max-w-md">
                    StudSphere is a youth-driven platform dedicated to
                    empowering students across Nepal by providing them with the
                    right guidance and opportunities.
                  </p>
                </div>
              </div>
            </Link>

            <div className="xl:col-span-5 flex flex-col gap-4 md:gap-6 justify-center items-center xl:items-start h-full">
              <div className="side-card w-full bg-emerald-600/95 rounded-xl p-6 md:p-8 text-white shadow-lg flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <svg
                      className="w-5 h-5 md:w-6 md:h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold uppercase tracking-wider">
                    Our Mission
                  </h3>
                </div>
                <p className="text-green-50 text-sm md:text-base leading-relaxed">
                  To provide accessible, affordable, and high-quality digital
                  learning tools across Nepal, bridging the academic gap and
                  fostering innovation.
                </p>
              </div>

              <div className="side-card w-full bg-[#0A61EF] rounded-xl p-6 md:p-8 text-white shadow-lg flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <svg
                      className="w-5 h-5 md:w-6 md:h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold uppercase tracking-wider">
                    Our Vision
                  </h3>
                </div>
                <p className="text-blue-50 text-sm md:text-base leading-relaxed">
                  To create a future where every student in Nepal has the
                  resources and mentorship to achieve their dreams regardless of
                  their background.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== OUR VALUABLE PARTNERS ==================== */}
        <section className="w-full max-w-350 mb-20 md:mb-32 px-2">
          <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-20 py-8 lg:py-16">
            <div
              className="w-full lg:w-[65%] overflow-hidden relative group"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
              }}
            >
              <div className="flex w-max animate-scroll-ltr group-hover:[animation-play-state:paused]">
                <div className="flex gap-8 sm:gap-12 items-center justify-items-center shrink-0 pr-8 sm:pr-12">
                  {partners.map((p, i) => (
                    <img
                      key={i}
                      src={p.src}
                      alt={p.alt}
                      className="h-10 sm:h-14 w-auto object-contain flex-shrink-0"
                    />
                  ))}
                </div>
                <div className="flex gap-8 sm:gap-12 items-center justify-items-center shrink-0 pr-8 sm:pr-12">
                  {partners.map((p, i) => (
                    <img
                      key={`dup-${i}`}
                      src={p.src}
                      alt={p.alt}
                      className="h-10 sm:h-14 w-auto object-contain flex-shrink-0"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full lg:w-[35%] flex flex-col items-start text-left mt-8 lg:mt-0 px-4 lg:px-0">
              <h2
                className="text-2xl sm:text-[32px] md:text-[38px] font-extrabold text-gray-900 leading-tight mb-4"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Our Valuable Partners
              </h2>
              <p
                className="text-gray-500 text-[15px] leading-relaxed mb-8 max-w-[95%]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                We collaborate with industry-leading platforms and tools to
                deliver seamless, integrated, and powerful experiences for our
                users.
              </p>
              <div className="flex flex-wrap items-center gap-6">
                <button
                  onClick={() => setShowPartnerModal(true)}
                  className="bg-[#0000ff] text-white px-7 py-3 rounded-lg font-medium text-sm cursor-pointer"
                >
                  Get Started
                </button>
                <a
                  href="/partners"
                  className="text-[#0000ff] font-medium text-sm"
                >
                  View All Partners
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== TESTIMONIALS ==================== */}
        <section className="w-full max-w-350 mb-20 md:mb-32 px-2">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-4">
            Testimonials
          </h2>
          <p className="text-center text-gray-500 text-[15px] mb-8 md:mb-12">
            What our scholarship recipients have to say about us
          </p>

          <div
            ref={testimonialRef}
            className="flex flex-nowrap gap-6 overflow-x-auto no-scrollbar pb-2"
            style={{
              scrollBehavior: "smooth",
              scrollSnapType: "x proximity",
            }}
          >
            {testimonials.length > 0 &&
              testimonials.map((t) => (
                <TestimonialCard
                  key={t.id}
                  name={t.user_name || "Anonymous"}
                  rating={t.rating}
                  text={t.experience}
                  imageUrl={t.image_url}
                  date={formatTestimonialDate(t.created_at)}
                />
              ))}

            <div
              className="bg-white rounded-xl shadow-sm border border-gray-100 relative overflow-hidden pb-8 flex-shrink-0 w-[85vw] max-w-[350px] md:w-[400px]"
              style={{ scrollSnapAlign: "start" }}
            >
              <div className="p-6 md:p-8 pt-7 flex flex-col items-center justify-center h-full min-h-[300px]">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <i className="fa-solid fa-pen-to-square text-blue-600 text-2xl" />
                </div>
                <h3 className="text-blue-600 font-bold text-lg mb-2">
                  Write a Review
                </h3>
                <p className="text-gray-500 text-[14px] text-center mb-4">
                  Share your experience and help others make informed decisions.
                </p>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-[14px] font-semibold transition-colors cursor-pointer"
                >
                  Write Review
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3 mt-8">
            <button
              onClick={() => scrollTestimonial("left")}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <i className="fa-solid fa-chevron-left text-gray-600" />
            </button>
            <button
              onClick={() => scrollTestimonial("right")}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <i className="fa-solid fa-chevron-right text-gray-600" />
            </button>
          </div>
        </section>
      </main>

      {/* ==================== REVIEW MODAL ==================== */}
      {showReviewModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,255,0.95)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowReviewModal(false);
          }}
        >
          <div className="bg-white rounded-2xl w-full max-w-[550px] max-h-[90vh] overflow-y-auto relative">
            <div className="bg-[#f0fdf4] border-b border-[#bbf7d0] py-3 px-6 flex justify-center items-center gap-3 text-[14px] text-[#166534]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 flex-shrink-0"
              >
                <path
                  fillRule="evenodd"
                  d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">
                Your review helps others make informed decisions.
              </span>
            </div>
            <div className="px-6 sm:px-10 py-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[22px] font-bold text-[#1e293b]">
                  Write a Review
                </h2>
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    setSelectedRating(0);
                  }}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <i className="fa-solid fa-xmark text-gray-500 text-lg" />
                </button>
              </div>
              <form
                ref={formRef}
                className="space-y-5"
                onSubmit={handleReviewSubmit}
              >
                <div>
                  <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="name"
                    type="text"
                    className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:border-[#0000ff] transition-all bg-white"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                    Designation <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="designation"
                    type="text"
                    className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:border-[#0000ff] transition-all bg-white"
                    placeholder="Enter your designation"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                    Rate Us <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-1 text-2xl cursor-pointer">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`transition-colors ${
                          star <= (hoverRating || selectedRating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setSelectedRating(star)}
                      >
                        <i className="fa-solid fa-star" />
                      </span>
                    ))}
                    <span className="text-[14px] text-gray-500 ml-2">
                      {
                        ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][
                          selectedRating
                        ]
                      }
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                    Write a Review <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="review"
                    className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:border-[#0000ff] transition-all bg-white resize-none"
                    rows={4}
                    placeholder="Share your experience..."
                    required
                  />
                </div>
                {submitted ? (
                  <div className="pt-4 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mx-auto">
                      <i className="fa-solid fa-check text-green-600 text-xl"></i>
                    </div>
                    <p className="text-gray-900 font-semibold">
                      Thank you for your review!
                    </p>
                  </div>
                ) : (
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#0000ff] hover:bg-[#0000cc] text-white font-bold text-[16px] py-3.5 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? "Submitting..." : "Submit Review"}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ==================== PARTNER MODAL ==================== */}
      {showPartnerModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,255,0.95)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPartnerModal(false);
          }}
        >
          <div className="bg-white rounded-2xl w-full max-w-[550px] max-h-[90vh] overflow-y-auto relative">
            <div className="px-6 sm:px-10 py-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[22px] font-bold text-[#1e293b]">
                  Partner With Us
                </h2>
                <button
                  onClick={() => setShowPartnerModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <i className="fa-solid fa-xmark text-gray-500 text-lg" />
                </button>
              </div>
              <form className="space-y-5" onSubmit={handlePartnerSubmit}>
                <div>
                  <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                    Organization Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:border-[#0000ff] transition-all bg-white"
                    placeholder="Enter organization name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                    Contact Person <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:border-[#0000ff] transition-all bg-white"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                    Type of Partnership
                  </label>
                  <select className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:border-[#0000ff] transition-all bg-white cursor-pointer">
                    <option value="" disabled selected>
                      Select partnership type
                    </option>
                    <option value="Sponsorship">Sponsorship</option>
                    <option value="Collaboration">Collaboration</option>
                    <option value="Technology">Technology</option>
                    <option value="Mentorship">Mentorship</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:border-[#0000ff] transition-all bg-white"
                      placeholder="Enter email"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:border-[#0000ff] transition-all bg-white"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
                    Message
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded py-3 px-4 text-[15px] text-gray-800 outline-none focus:border-[#0000ff] transition-all bg-white resize-none"
                    rows={4}
                    placeholder="Tell us about your organization and partnership interest..."
                  />
                </div>
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-[#0000ff] hover:bg-[#0000cc] text-white font-bold text-[16px] py-3.5 rounded-lg transition-all cursor-pointer"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .name-badge {
          border-radius: 9999px;
          position: relative;
          margin-top: -20px;
          z-index: 20;
          padding: 4px 16px;
          font-size: 0.875rem;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
        .story-card { width: 100%; height: 400px; }
        .side-card { width: 100%; min-height: 194px; }
        @keyframes scrollLeftToRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-ltr {
          animation: scrollLeftToRight 30s linear infinite;
        }
        @keyframes fadeInUp {
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up { opacity: 0; transform: translateY(20px); animation: fadeInUp 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
}
