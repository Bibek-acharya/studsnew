"use client";

import React from "react";
import { Plus, Trash } from "@phosphor-icons/react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
  setFaqs: React.Dispatch<React.SetStateAction<FAQItem[]>>;
}

const formInputClass = "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500";
const formTextareaClass = "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500 min-h-[80px]";

export const FAQSection: React.FC<FAQSectionProps> = ({ faqs, setFaqs }) => {
  const addFAQ = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const removeFAQ = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const updateFAQ = (index: number, field: keyof FAQItem, value: string) => {
    setFaqs(faqs.map((faq, i) => i === index ? { ...faq, [field]: value } : faq));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
      <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Frequently Asked Questions (FAQ)</h2>
            <p className="text-sm text-gray-500 mt-0.5">Common questions and answers for applicants</p>
          </div>
        </div>
        <button
          type="button"
          className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
          onClick={addFAQ}
        >
          <Plus size={16} /> Add Question
        </button>
      </div>
      <div className="p-6 space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between gap-2">
              <div className="flex-grow space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Question</label>
                  <input
                    className={formInputClass}
                    placeholder="What is this scholarship?"
                    value={faq.question}
                    onChange={(e) => updateFAQ(index, "question", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Answer</label>
                  <textarea
                    className={formTextareaClass}
                    rows={2}
                    placeholder="Answer..."
                    value={faq.answer}
                    onChange={(e) => updateFAQ(index, "answer", e.target.value)}
                  />
                </div>
              </div>
              <button
                type="button"
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-6"
                onClick={() => removeFAQ(index)}
              >
                <Trash size={18} />
              </button>
            </div>
          </div>
        ))}
        {faqs.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">No FAQs added yet.</p>
        )}
      </div>
    </div>
  );
};

export default FAQSection;