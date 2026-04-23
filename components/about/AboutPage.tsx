"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

const AboutPage: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const faqRefs = useRef<Array<HTMLDivElement | null>>([]);

  const photoRow1 = useMemo(
    () => [
      {
        src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
        alt: "Team collaboration",
        width: "md:w-[356px]",
      },
      {
        src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
        alt: "CEO Portrait",
        width: "md:w-[289px]",
      },
      {
        src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80",
        alt: "Office Space",
        width: "md:w-[356px]",
      },
      {
        src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
        alt: "Workshop",
        width: "md:w-[309px]",
      },
    ],
    [],
  );

  const photoRow2 = useMemo(
    () => [
      {
        src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80",
        alt: "Design Meeting",
        width: "md:w-[309px]",
      },
      {
        src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
        alt: "Handshake",
        width: "md:w-[356px]",
      },
      {
        src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
        alt: "Technology",
        width: "md:w-[289px]",
      },
      {
        src: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
        alt: "Planning",
        width: "md:w-[356px]",
      },
    ],
    [],
  );

  const initiatives = useMemo(
    () => [
      {
        title: "Our Vision",
        text: "Building a collaborative ecosystem where students and professionals co-create the future.",
        image:
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
        fabClass: "bg-sky-100 text-sky-600",
        hoverTitleColor: "group-hover:text-blue-600",
      },
      {
        title: "Leadership Summit",
        text: "Empowering the next generation of leaders through impactful public speaking and global networking.",
        image:
          "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80",
        fabClass: "bg-pink-100 text-pink-600",
        hoverTitleColor: "group-hover:text-pink-600",
      },
      {
        title: "Skill Workshops",
        text: "Hands-on sessions focused on bridging the gap between academic theory and practical industry skills.",
        image:
          "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80",
        fabClass: "bg-yellow-100 text-yellow-600",
        hoverTitleColor: "group-hover:text-yellow-600",
      },
    ],
    [],
  );

  const faqItems = useMemo(
    () => [
      {
        question: "What is your return policy?",
        answer:
          "We offer a 30-day money-back guarantee. If you're not absolutely satisfied with your purchase, you can return it for a full refund, no questions asked. We even cover the return shipping for all domestic orders to ensure a hassle-free experience.",
      },
      {
        question: "How do I track my order?",
        answer:
          "Once your order ships, you will receive an automated email with a tracking number and a direct link to the carrier's website. You can also track your order status in real-time by logging into your account dashboard and visiting the 'Orders' section.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Yes, we ship to over 50 countries worldwide! International shipping rates are calculated dynamically at checkout based on your location and package weight. Please be aware that local customs duties or taxes may apply upon arrival.",
      },
      {
        question: "Can I change my subscription plan?",
        answer:
          "Absolutely. You have total control. You can upgrade, downgrade, or cancel your subscription at any time directly from your account settings. Any changes to your plan will be prorated and reflected in your next billing cycle.",
      },
    ],
    [],
  );

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          entry.target.classList.add("active");

          const counters = entry.target.querySelectorAll("[data-counter-target]");
          counters.forEach((counterEl) => {
            const el = counterEl as HTMLElement;
            if (el.dataset.animated === "true") return;

            const target = Number(el.dataset.counterTarget || "0");
            const duration = 2000;
            const start = performance.now();

            const tick = (now: number) => {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              el.textContent = String(Math.ceil(eased * target));
              if (progress < 1) {
                requestAnimationFrame(tick);
              } else {
                el.textContent = String(target);
                el.dataset.animated = "true";
              }
            };

            requestAnimationFrame(tick);
          });

          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document
      .querySelectorAll(".scroll-fade-in, .stat-card, .reveal, .fade-in-up")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      <style>
        {`
          @keyframes fadeInUp {
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-12px); }
            100% { transform: translateY(0px); }
          }
          .fade-in-up { opacity: 0; transform: translateY(20px); animation: fadeInUp 0.8s ease-out forwards; }
          .animate-float { animation: float 4s ease-in-out infinite; }
          .scroll-fade-in, .reveal, .stat-card { opacity: 0; transform: translateY(30px); transition: all 0.7s cubic-bezier(0.4,0,0.2,1); }
          .scroll-fade-in.visible, .reveal.visible, .stat-card.active { opacity: 1; transform: translateY(0); }
          .initiative-image-mask {
            border-radius: 24px 24px 0 24px;
            overflow: hidden;
            -webkit-mask: radial-gradient(circle 48px at calc(100% - 32px) calc(100% - 32px), transparent 99%, #000 100%);
            mask: radial-gradient(circle 48px at calc(100% - 32px) calc(100% - 32px), transparent 99%, #000 100%);
          }
        `}
      </style>

      <main className="flex flex-col items-center px-4 overflow-x-hidden pt-8 md:pt-12">
        <div className="flex flex-col gap-4 w-full max-w-350 items-center mb-16 md:mb-24">
          <div className="flex flex-wrap justify-center gap-4 w-full">
            {photoRow1.map((photo, idx) => (
              <div
                key={photo.alt}
                className={`group relative overflow-hidden rounded-md  w-full sm:w-[calc(50%-8px)] ${photo.width} h-51.25 fade-in-up`}
                style={{ animationDelay: `${0.1 * (idx + 1)}s` }}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4 w-full">
            {photoRow2.map((photo, idx) => (
              <div
                key={photo.alt}
                className={`group relative overflow-hidden rounded-md  w-full sm:w-[calc(50%-8px)] ${photo.width} h-51.25 fade-in-up`}
                style={{ animationDelay: `${0.1 * (idx + 5)}s` }}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>

        <section className="mb-20 md:mb-32 w-full max-w-7xl px-2 md:px-6 flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 md:mb-12 text-center">
            How it started
          </h2>
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 relative">
            <div className="hidden md:flex flex-col items-center order-1 mt-[-40px] animate-float">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
                alt="Santosh"
                className="w-22.5 h-22.5 rounded-full object-cover border-4 border-white shadow-lg z-10"
              />
              <div className="rounded-full relative -mt-5 z-20 px-4 py-1 text-sm font-semibold min-w-27.5 text-center text-white bg-[#0A61EF] ">
                Santosh
              </div>
            </div>

            <div className="max-w-xl text-center text-slate-600 leading-relaxed space-y-6 order-2 px-4">
              <p className="text-base md:text-lg">
                <span className="font-bold text-blue-600">StudSphere</span> is a youth-driven platform dedicated to empowering students across Nepal by providing them with the right guidance, opportunities, and pathways to shape their future.
              </p>
              <p className="text-base md:text-lg">
                Through mentorship and resources, we aim to bridge the gap between academic learning and real-world application, ensuring every student has the tools they need to succeed.
              </p>
            </div>

            <div className="hidden md:flex flex-col items-center order-3 -mt-10 animate-float" style={{ animationDelay: "1s" }}>
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
                alt="Jagdish"
                className="w-22.5 h-22.5 rounded-full object-cover border-4 border-white shadow-lg z-10"
              />
              <div className="rounded-full relative -mt-5 z-20 px-4 py-1 text-sm font-semibold min-w-27.5 text-center text-white bg-[#8476F1] ">
                Jagdish
              </div>
            </div>
          </div>

          <div className="flex md:hidden flex-wrap justify-center gap-8 mt-10">
            <div className="flex flex-col items-center animate-float">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
                alt="Santosh"
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg z-10"
              />
              <div className="rounded-full relative -mt-3.75 z-20 px-3 py-1 text-xs font-semibold min-w-25 text-center text-white bg-[#0A61EF] ">
                Santosh
              </div>
            </div>
            <div className="flex flex-col items-center animate-float" style={{ animationDelay: "1s" }}>
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
                alt="Jagdish"
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg z-10"
              />
              <div className="rounded-full relative -mt-3.75 z-20 px-3 py-1 text-xs font-semibold min-w-25 text-center text-white bg-[#8476F1] ">
                Jagdish
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center mt-8 md:mt-12 animate-float" style={{ animationDelay: "2s" }}>
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80"
              alt="Badal"
              className="w-20 h-20 md:w-22.5 md:h-22.5 rounded-full object-cover border-4 border-white shadow-lg z-10"
            />
            <div className="rounded-full relative -mt-3.75 md:-mt-5 z-20 px-4 py-1 text-xs md:text-sm font-semibold min-w-25 md:min-w-27.5 text-center text-white bg-[#EEAE85] ">
              Badal
            </div>
          </div>
        </section>

        <section className="w-full max-w-350 mb-20 md:mb-24 px-2">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-8 md:mb-12 scroll-fade-in">
            Our Story, Mission &amp; Vision
          </h2>
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8 items-start justify-center">
            <div className="xl:col-span-7 flex justify-center xl:justify-end scroll-fade-in" style={{ transitionDelay: "100ms" }}>
              <div className="relative rounded-md overflow-hidden shadow-2xl group w-full h-75 md:h-100">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=80"
                  alt="Our Story"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0A61EF]/90 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">Our Story</h3>
                  <p className="text-sm md:text-base text-blue-50 max-w-md">
                    StudSphere is a youth-driven platform dedicated to empowering students across Nepal by providing them with the right guidance and opportunities.
                  </p>
                </div>
              </div>
            </div>

            <div className="xl:col-span-5 flex flex-col gap-4 md:gap-6 justify-center items-center xl:items-start h-full">
              <div className="w-full rounded-md p-6 md:p-8 text-white shadow-lg flex flex-col justify-center bg-emerald-600/95 scroll-fade-in" style={{ transitionDelay: "200ms" }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-white/20 p-2 rounded-md">
                    <i className="fa-solid fa-bullseye w-5 h-5 md:w-6 md:h-6"></i>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold uppercase tracking-wider">Our Mission</h3>
                </div>
                <p className="text-green-50 text-sm md:text-base leading-relaxed">
                  To provide accessible, affordable, and high-quality digital learning tools across Nepal, bridging the academic gap and fostering innovation.
                </p>
              </div>

              <div className="w-full rounded-md p-6 md:p-8 text-white shadow-lg flex flex-col justify-center bg-[#0A61EF] scroll-fade-in" style={{ transitionDelay: "300ms" }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-white/20 p-2 rounded-md">
                    <i className="fa-solid fa-eye w-5 h-5 md:w-6 md:h-6"></i>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold uppercase tracking-wider">Our Vision</h3>
                </div>
                <p className="text-blue-50 text-sm md:text-base leading-relaxed">
                  To create a future where every student in Nepal has the resources and mentorship to achieve their dreams regardless of their background.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 md:px-6 w-full mb-20 md:mb-24">
          <div className="text-center mb-10 md:mb-16 scroll-fade-in">
            <p className="text-2xl md:text-4xl font-bold text-slate-900">Numbers that tell our story</p>
            <p className="text-sm md:text-base text-slate-500 mt-2 md:mt-4">Growing impact across the nation</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: "fa-users", target: 50000, label: "Students Empowered", iconWrap: "bg-blue-50 text-blue-600" },
              { icon: "fa-school", target: 75, label: "Partner Schools", iconWrap: "bg-pink-50 text-pink-600" },
              { icon: "fa-location-dot", target: 25, label: "Districts Covered", iconWrap: "bg-yellow-50 text-yellow-600" },
              { icon: "fa-award", target: 150, label: "Mentors & Experts", iconWrap: "bg-purple-50 text-purple-600" },
            ].map((item, idx) => (
              <div key={item.label} className="stat-card bg-white p-6 md:p-8 rounded-md text-center  relative overflow-hidden group hover:-translate-y-1 hover:shadow-xl" style={{ transitionDelay: `${idx * 150}ms` }}>
                <div className={`inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-md mb-4 md:mb-6 group-hover:scale-110 transition-transform ${item.iconWrap}`}>
                  <i className={`fa-solid ${item.icon} text-xl md:text-2xl`}></i>
                </div>
                <div className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-2">
                  <span data-counter-target={item.target}>0</span>+
                </div>
                <p className="text-slate-500 text-sm md:text-base font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12 px-6 max-w-7xl mx-auto mb-12 w-full">
          <div className="text-center mb-10 md:mb-16 reveal">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Our Initiatives</h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto text-sm md:text-base">
              Discover how we are shaping the future through collaboration, leadership, and hands-on learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
            {initiatives.map((item, idx) => (
              <div key={item.title} className="group flex flex-col reveal" style={{ transitionDelay: `${100 + idx * 100}ms` }}>
                <div className="relative mb-6 bg-white rounded-md">
                  <div className="initiative-image-mask aspect-4/3  bg-slate-200">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <button className={`absolute bottom-0 right-0 w-16 h-16 rounded-full flex items-center justify-center shadow-xl border-2 border-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-45 ${item.fabClass}`} aria-label="View more">
                    <i className="fa-solid fa-arrow-up-right-from-square text-xl"></i>
                  </button>
                </div>
                <div className="px-2 pt-2">
                  <h3 className={`text-xl md:text-2xl font-bold text-slate-900 mb-2 transition-colors ${item.hoverTitleColor}`}>{item.title}</h3>
                  <p className="text-sm md:text-base text-slate-600 leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-linear-to-br from-slate-50 to-indigo-50/50 py-20 px-6 w-full">
          <div className="max-w-3xl w-full mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">Frequently Asked Questions</h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Everything you need to know about our product and billing. Can&apos;t find the answer? Chat to our team.
              </p>
            </div>

            <div className="space-y-4">
              {faqItems.map((item, idx) => {
                const isActive = activeFaq === idx;
                const maxHeight = isActive ? `${faqRefs.current[idx]?.scrollHeight || 0}px` : "0px";

                return (
                  <div
                    key={item.question}
                    className={`group bg-white border rounded-md transition-all duration-200 hover:border-indigo-300 ${
                      isActive ? "border-indigo-300 " : "border-slate-200"
                    }`}
                  >
                    <button
                      className="w-full flex justify-between items-start text-left p-6"
                      onClick={() => setActiveFaq((prev) => (prev === idx ? null : idx))}
                    >
                      <span className="text-lg font-semibold text-slate-900 pr-8 pt-1">{item.question}</span>
                      <span
                        className={`shrink-0 ml-4 h-8 w-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? "bg-indigo-100 text-indigo-600 border-indigo-200 rotate-180"
                            : "border-slate-200 text-slate-500 group-hover:border-indigo-200 group-hover:text-indigo-600"
                        }`}
                      >
                        <i className="fa-solid fa-chevron-down text-sm"></i>
                      </span>
                    </button>
                    <div
                      ref={(el) => {
                        faqRefs.current[idx] = el;
                      }}
                      className="overflow-hidden transition-all duration-300"
                      style={{ maxHeight }}
                    >
                      <p className="px-6 pb-6 text-slate-600 leading-relaxed">{item.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-16 text-center">
              <p className="text-slate-600 mb-4">Still have questions?</p>
              <button className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-brand-blue rounded-md hover:bg-brand-hover transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
