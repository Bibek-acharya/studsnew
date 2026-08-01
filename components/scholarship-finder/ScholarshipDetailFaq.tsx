"use client";

import { ChevronDown } from "lucide-react";
import RichText from "@/components/RichText";

function FaqTab({
  faqs,
  faqOpen,
  toggleFaq,
}: {
  faqs: { q: string; a: string }[];
  faqOpen: number[];
  toggleFaq: (i: number) => void;
}) {
  if (faqs.length === 0) return null;
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">
          Frequently Asked Questions
        </h2>
        <p className="mt-1 text-[14px] text-gray-500">
          Find answers to common questions about this scholarship
        </p>
      </div>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="overflow-hidden rounded-md bg-white">
            <button
              type="button"
              onClick={() => toggleFaq(i)}
              className="flex w-full items-center justify-between px-5 py-4 text-left transition-all"
            >
              <span className="pr-4 text-[15px] font-semibold text-gray-900">
                <span className="mr-2 font-bold text-blue-600">Q{i + 1}.</span>
                {faq.q}
              </span>
              <ChevronDown
                size={20}
                className={`shrink-0 text-gray-400 transition-transform duration-200 ${faqOpen.includes(i) ? "rotate-180" : ""}`}
              />
            </button>
            {faqOpen.includes(i) && (
              <div className="px-5 pb-4">
                <RichText
                  html={faq.a}
                  variant="sm"
                  as="p"
                  className="text-[14px] leading-relaxed text-gray-600 hyphens-none"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FaqTab;
