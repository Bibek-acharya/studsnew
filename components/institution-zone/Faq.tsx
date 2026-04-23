"use client";

import React, { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How do I start the process of buying a home?",
    answer:
      "The first step is to determine your budget and financing options. If you need a mortgage, getting pre-approved can help you understand how much you can afford. Once you're ready, our real estate experts will assist you in finding properties that meet your needs.",
  },
  {
    question: "How can i start a project with Architect?",
    answer:
      "You can start by contacting us through our website form or calling our main office. We'll schedule an initial consultation to discuss your vision, budget, and timeline.",
  },
  {
    question: "What services does the studio offer?",
    answer:
      "We offer a comprehensive range of architectural services including residential and commercial design, urban planning, interior architecture, and project management.",
  },
  {
    question: "How long does it take to complete a project?",
    answer:
      "Project timelines vary greatly depending on the scope and complexity. A simple residential remodel might take a few months, while a large commercial build can take over a year. We provide detailed estimates after our initial review.",
  },
  {
    question: "Do you offer advice on sustainable design?",
    answer:
      "Absolutely. Sustainable and eco-friendly design is at the core of our philosophy. We can advise on energy-efficient materials, passive solar design, and integrating renewable energy sources.",
  },
];

interface FaqProps {
  className?: string;
}

export default function Faq({ className }: FaqProps) {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className={`py-20 px-4 sm:px-8 md:px-12 ${className || ""}`}>
      <div className="max-w-350 mx-auto px-8" >
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          <div className="lg:col-span-2">
            <h2 className="text-[2.75rem] font-medium leading-[1.1] text-gray-900 mb-6 tracking-tight">
              Frequently asked
              <br />
              questions
            </h2>
            <p className="text-gray-500 text-base leading-relaxed">
              To help you make informed decisions, we've compiled answers to some of the most commonly asked questions.
            </p>
          </div>

          <div className="lg:col-span-3">
            <div className="border-t border-blue-200/20">
              {FAQ_ITEMS.map((item, idx) => (
                <div
                  key={idx}
                  className={`border-b border-blue-200/20 ${openIndex === idx ? "active" : ""}`}
                >
                  <button
                    onClick={() => toggleItem(idx)}
                    className="w-full flex items-center justify-between py-6 text-left focus:outline-none group"
                    aria-expanded={openIndex === idx}
                  >
                    <span className="text-lg font-medium text-gray-800 pr-8 group-hover:text-blue-600 transition-colors">
                      {item.question}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                        openIndex === idx ? "bg-gray-900" : "bg-blue-600"
                      }`}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-transform duration-300"
                        style={{ transform: openIndex === idx ? "rotate(45deg)" : "rotate(0)" }}
                      >
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                    </div>
                  </button>
                  <div
                    className="grid transition-all duration-300 ease-in-out"
                    style={{
                      gridTemplateRows: openIndex === idx ? "1fr" : "0fr",
                    }}
                  >
                    <div className="overflow-hidden">
                      <p className="text-gray-500 text-sm leading-relaxed pb-6 pr-16">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}