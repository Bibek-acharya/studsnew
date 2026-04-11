import React, { useEffect, useState } from "react";
import {
  X,
  User,
  Briefcase,
  Mail,
  Building2,
  Send,
  Check,
} from "lucide-react";
import type { College } from "@/services/api";

import { RiWhatsappFill } from "react-icons/ri";

interface ClaimCollegeModalProps {
  college: College | null;
  onClose: () => void;
}

interface ClaimFormData {
  fullName: string;
  designation: string;
  email: string;
  phone: string;
  whatsapp: string;
  department: string;
}

const initialForm: ClaimFormData = {
  fullName: "",
  designation: "",
  email: "",
  phone: "",
  whatsapp: "",
  department: "",
};

const ClaimCollegeModal: React.FC<ClaimCollegeModalProps> = ({ college, onClose }) => {
  const isOpen = college !== null;
  const [formData, setFormData] = useState<ClaimFormData>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialForm);
      setIsSubmitting(false);
      setIsSubmitted(false);
    }
  }, [isOpen]);

  const handleChange = (key: keyof ClaimFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Placeholder submit behavior until API endpoint is available.
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 700);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <main
        className="relative max-h-[95vh] w-full max-w-105 overflow-y-auto rounded-xl  bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {!isSubmitted && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-20 rounded-full p-1 text-white/90 transition-colors hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {!isSubmitted && (
          <div className="bg-brand-blue px-5 py-5 text-center text-white">
            <h2 className="text-xl font-bold tracking-tight">College Registration</h2>
            <p className="mt-1 text-[11px] font-medium text-white/80">
              Please fill out the form below for {college?.name || "this college"}.
            </p>
          </div>
        )}

        {!isSubmitted ? (
          <div className="p-5">
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-8 pr-3 text-sm outline-none transition focus:border-brand-blue focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">
                  Designation <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={(e) => handleChange("designation", e.target.value)}
                    placeholder="Enter your designation (e.g. Principal)"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-8 pr-3 text-sm text-gray-700 outline-none transition focus:border-brand-blue focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">
                  Official Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="Enter your official email address"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-8 pr-3 text-sm outline-none transition focus:border-brand-blue focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <div className="flex rounded-lg border border-gray-200 bg-gray-50 transition focus-within:border-brand-blue focus-within:bg-white">
                    <span className="inline-flex items-center border-r border-gray-200/50 px-2 text-[11px] font-bold text-gray-500">
                      +977
                    </span>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="98XXXXXXXX"
                      className="w-full min-w-0 bg-transparent px-2 py-2 text-sm outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">
                    WhatsApp <span className="text-[10px] font-normal text-gray-400">(Opt)</span>
                  </label>
                  <div className="flex rounded-lg border border-gray-200 bg-gray-50 transition focus-within:border-brand-blue focus-within:bg-white">
                    <span className="inline-flex items-center border-r border-gray-200/50 px-2 text-[11px] font-bold text-green-600">
                      <RiWhatsappFill className="h-3.5 w-3.5" />
                    </span>
                    <input
                      type="tel"
                      pattern="[0-9]{10}"
                      value={formData.whatsapp}
                      onChange={(e) => handleChange("whatsapp", e.target.value)}
                      placeholder="98XXXXXXXX"
                      className="w-full min-w-0 bg-transparent px-2 py-2 text-sm outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">
                  Department <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => handleChange("department", e.target.value)}
                    placeholder="e.g. Administration"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-8 pr-3 text-sm outline-none transition focus:border-brand-blue focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-blue px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-r-transparent" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      Submit Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 py-10 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 shadow-sm">
              <Check className="h-7 w-7 text-green-500" />
            </div>
            <h3 className="mb-1 text-lg font-bold text-gray-900">Request Received!</h3>
            <p className="mb-5 max-w-55 text-xs leading-relaxed text-gray-600">
              We will review your details and get back to you shortly.
            </p>
            <a
              href="mailto:info@studsphere.com"
              className="mb-6 inline-block rounded bg-brand-blue/10 px-3 py-1.5 text-xs font-bold text-brand-blue transition-colors hover:bg-brand-blue/20"
            >
              info@studsphere.com
            </a>
            <button
              type="button"
              onClick={onClose}
              className="flex w-full max-w-55 items-center justify-center gap-2 rounded-lg bg-brand-blue px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700"
            >
              Close Window
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ClaimCollegeModal;
