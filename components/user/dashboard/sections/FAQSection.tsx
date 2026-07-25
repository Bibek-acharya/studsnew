"use client";

import { useState } from "react";
import {
  ChevronDown,
  HelpCircle,
  MessageCircle,
  AlertTriangle,
  X,
} from "lucide-react";
import { faqCategories } from "./faqData";
import { apiService } from "@/services/api";
import { useAuth } from "@/services/AuthContext";
import { Toast } from "@/components/ui/Toast";

export default function FAQSection() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState(faqCategories[0].id);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [reportArea, setReportArea] = useState("Dashboard");
  const [reportMessage, setReportMessage] = useState("");
  const [toast, setToast] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const category =
    faqCategories.find((item) => item.id === activeCategory) ??
    faqCategories[0];

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const submitContact = async () => {
    if (!contactSubject.trim() || !contactMessage.trim()) {
      showToastMsg("Please fill in all fields");
      return;
    }
    setSubmitting(true);
    try {
      const name =
        `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
        "Anonymous";
      await apiService.submitContactInquiry({
        name,
        email: user?.email || "",
        phone: user?.phone || "",
        subject: contactSubject,
        message: contactMessage,
        type: "support",
      });
      setShowContactModal(false);
      setContactSubject("");
      setContactMessage("");
      showToastMsg("Message sent to support successfully!");
    } catch {
      showToastMsg("Failed to send. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const submitReport = async () => {
    if (!reportMessage.trim()) {
      showToastMsg("Please describe the problem");
      return;
    }
    setSubmitting(true);
    try {
      const name =
        `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
        "Anonymous";
      await apiService.submitContactInquiry({
        name,
        email: user?.email || "",
        phone: user?.phone || "",
        subject: reportArea,
        message: reportMessage,
        type: "bug",
      });
      setShowReportModal(false);
      setReportArea("Dashboard");
      setReportMessage("");
      showToastMsg("Bug report submitted successfully!");
    } catch {
      showToastMsg("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Help & Support</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">Help & Support</span>
        </div>
      </div>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {/* Contact Support CTA banner */}
        <div className="bg-indigo-50 border border-brand-blue/20 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-indigo-800">Need more help?</h3>
            <p className="text-sm text-brand-blue mt-1">
              Contact our support team for personalized assistance.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowContactModal(true)}
              className="px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-semibold hover:bg-brand-hover transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Contact Support
            </button>
            <button
              onClick={() => setShowReportModal(true)}
              className="px-4 py-2 bg-white text-brand-blue border border-brand-blue rounded-lg text-sm font-semibold hover:bg-brand-blue/10 transition-colors flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              Report Bug
            </button>
          </div>
        </div>

        {/* Existing FAQ content - preserve the original rendering from FAQSection.tsx */}
        <div className="bg-white rounded-md border border-slate-200 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 text-slate-800">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-indigo-50 p-3 text-brand-blue">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold">
                  Frequently Asked Questions
                </h1>
                <p className="text-sm text-slate-500">
                  Answers to common questions about your student dashboard and
                  account settings.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 bg-slate-100 p-1 rounded-md w-fit">
              {faqCategories.map((categoryItem) => (
                <button
                  key={categoryItem.id}
                  type="button"
                  onClick={() => setActiveCategory(categoryItem.id)}
                  className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
                    activeCategory === categoryItem.id
                      ? "bg-white text-brand-blue"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {categoryItem.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6 rounded-md bg-slate-50 px-5 py-4 border border-slate-200">
            <p className="text-sm text-slate-600">{category.description}</p>
          </div>

          <div className="space-y-4">
            {category.items.map((item, index) => (
              <FAQItem
                key={item.question}
                question={item.question}
                answer={item.answer}
                isLast={index === category.items.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Contact Support Modal */}
        {showContactModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-xl bg-white  p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900">
                  Contact Support
                </h3>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-slate-500 mb-6">
                Send us a message and we&apos;ll reply to your email.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    placeholder="What do you need help with?"
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Describe your issue in detail..."
                    rows={4}
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20/20"
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 rounded-lg bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={submitContact}
                  disabled={submitting}
                  className="flex-1 rounded-lg bg-brand-blue px-4 py-3 text-sm font-semibold text-white hover:bg-brand-hover disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Report Bug Modal */}
        {showReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-xl bg-white  p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900">
                  Report a Problem
                </h3>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-slate-500 mb-6">
                Found a bug or issue? Let us know so we can fix it.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Problem Area
                  </label>
                  <select
                    value={reportArea}
                    onChange={(e) => setReportArea(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20/20"
                  >
                    <option>Dashboard</option>
                    <option>Settings</option>
                    <option>Profile</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={reportMessage}
                    onChange={(e) => setReportMessage(e.target.value)}
                    placeholder="Please describe how to reproduce the bug..."
                    rows={4}
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20/20"
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 rounded-lg bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReport}
                  disabled={submitting}
                  className="flex-1 rounded-lg bg-brand-blue px-4 py-3 text-sm font-semibold text-white hover:bg-brand-hover disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast notification */}
        {toast && <Toast message={toast} />}
      </div>
    </div>
  );
}

function FAQItem({
  question,
  answer,
  isLast,
}: {
  question: string;
  answer: string;
  isLast?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`${!isLast ? "border-b border-slate-100" : ""} pb-4`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left text-slate-800 hover:text-brand-blue"
      >
        <div className="flex items-center gap-3 font-semibold">
          <HelpCircle className="w-5 h-5 text-brand-blue" />
          <span>{question}</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 transition-transform ${open ? "rotate-180 text-brand-blue" : ""}`}
        />
      </button>
      {open && (
        <p className="pl-12 pr-4 text-sm text-slate-500 leading-7">{answer}</p>
      )}
    </div>
  );
}
