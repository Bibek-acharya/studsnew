"use client";

import React, { useState } from "react";
import EmptyTabState from "./EmptyTabState";

interface FaqItem {
  question: string;
  answer: string;
}

interface TabFaqProps {
  faqs: FaqItem[];
}

const TabFaq: React.FC<TabFaqProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (faqs.length === 0) return <EmptyTabState tabName="FAQs" />;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">FAQs</h2>
        <p className="mt-1 text-[14px] text-gray-500">
          Frequently asked questions about this institution.
        </p>
      </div>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-lg overflow-hidden bg-white"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900 text-[15px] pr-4">
                {faq.question}
              </span>
              <i
                className={`fa-solid fa-chevron-down text-gray-400 text-xs transition-transform duration-200 shrink-0 ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              ></i>
            </button>
            {openIndex === i && (
              <div className="px-5 pb-4 text-[14px] text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabFaq;
