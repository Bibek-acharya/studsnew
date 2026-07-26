"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  HelpCircle,
  MessageCircle,
  AlertTriangle,
  X,
  Loader2,
} from "lucide-react";
import { apiService } from "@/services/api";
import { useAuth } from "@/services/AuthContext";
import { Toast } from "@/components/ui/Toast";
import { ErrorState } from "@/components/ui/ErrorState";

interface FAQItemData {
  id: number;
  question: string;
  answer: string;
}

interface FAQCategoryData {
  id: number;
  name: string;
  description: string;
  items: FAQItemData[];
}

export default function FAQSection() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<FAQCategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [reportArea, setReportArea] = useState("Dashboard");
  const [reportMessage, setReportMessage] = useState("");
  const [toast, setToast] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchFAQ = async () => {
      try {
        setLoading(true);
        const res = await apiService.getFAQCategories();
        const cats = res.data || [];
        setCategories(cats);
        if (cats.length > 0 && activeCategory === null) {
          setActiveCategory(cats[0].id);
        }
      } catch {
        setError("Failed to load FAQs");
      } finally {
        setLoading(false);
      }
    };
    fetchFAQ();
  }, []);

  const category =
    categories.find((c) => c.id === activeCategory) || categories[0];

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
    } catch (err: any) {
      showToastMsg(err.message || "Failed to submit. Please try again.");
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
    } catch (err: any) {
      showToastMsg(err.message || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
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
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-md border border-slate-200 p-4"
            >
              <div className="h-5 bg-slate-200 rounded w-1/3 mb-2" />
              <div className="h-4 bg-slate-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
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
        <ErrorState error={error} />
      </div>
    );
  }

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

      {/* Contact Support CTA banner */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-semibold text-indigo-800">Need more help?</h3>
          <p className="text-sm text-indigo-600 mt-1">
            Contact our support team for personalized assistance.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowContactModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" /> Contact Support
          </button>
          <button
            onClick={() => setShowReportModal(true)}
            className="px-4 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-colors flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" /> Report Bug
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-md mb-6 w-fit">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
              activeCategory === cat.id
                ? "bg-white text-primary"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Category Description */}
      {category && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-800">{category.name}</h2>
          <p className="text-sm text-slate-500 mt-1">{category.description}</p>
        </div>
      )}

      {/* FAQ Items */}
      {category && (
        <div className="bg-white rounded-md border border-slate-200 divide-y divide-slate-100">
          {category.items.map((item) => (
            <FAQItem
              key={item.id}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-md rounded-md bg-white p-6 shadow-2xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 text-center mb-2">
              Contact Support
            </h3>
            <p className="text-sm text-slate-500 text-center mb-6">
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
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
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
                  className="w-full min-h-30 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowContactModal(false)}
                className="flex-1 rounded-md bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={submitContact}
                disabled={submitting}
                className="flex-1 rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-md rounded-md bg-white p-6 shadow-2xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 text-center mb-2">
              Report a Problem
            </h3>
            <p className="text-sm text-slate-500 text-center mb-6">
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
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
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
                  className="w-full min-h-30 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 rounded-md bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={submitReport}
                disabled={submitting}
                className="flex-1 rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                {submitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} />}
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
        className="w-full flex items-center justify-between gap-4 py-4 text-left text-slate-800 hover:text-indigo-600"
      >
        <div className="flex items-center gap-3 font-semibold">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <span>{question}</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 transition-transform ${open ? "rotate-180 text-indigo-600" : ""}`}
        />
      </button>
      {open && (
        <p className="pl-12 pr-4 text-sm text-slate-500 leading-7">{answer}</p>
      )}
    </div>
  );
}
