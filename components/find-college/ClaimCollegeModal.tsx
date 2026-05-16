"use client";

import React, { useState } from "react";
import { X, Loader2, Mail, Check, Send } from "lucide-react";
import { apiService } from "@/services/api";
import { NEPAL_PROVINCES, NEPAL_DISTRICTS } from "@/lib/location-data";

interface College {
  id: number;
  name: string;
}

interface ClaimCollegeModalProps {
  college: College | null;
  onClose: () => void;
}

const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-sm";

export default function ClaimCollegeModal({ college, onClose }: ClaimCollegeModalProps) {
  const [step, setStep] = useState<"form" | "otp" | "success" | "error">("form");

  const [formData, setFormData] = useState({
    institution_name: college?.name || "",
    email: "",
    contact_number: "",
    province: "",
    district: "",
    local_body: "",
    organization_type: "",
    pan_number: "",
    registration_number: "",
    website_url: "",
    contact_person: "",
    contact_person_designation: "",
    contact_person_phone: "",
  });

  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const districts = formData.province ? (NEPAL_DISTRICTS as Record<string, string[]>)[formData.province] || [] : [];

  const updateField = (key: string, value: string) => {
    setFormData(prev => {
      const next = { ...prev, [key]: value };
      if (key === "province") { next.district = ""; next.local_body = ""; }
      if (key === "district") next.local_body = "";
      return next;
    });
  };

  const submitClaim = async () => {
    if (!college) return;
    setSubmitting(true);
    setErrorMsg("");
    try {
      await apiService.claimRegister({
        college_id: college.id,
        institution_name: formData.institution_name,
        registration_number: formData.registration_number,
        email: formData.email.trim(),
        contact_number: formData.contact_number,
        province: formData.province,
        district: formData.district,
        local_body: formData.local_body,
        organization_type: formData.organization_type,
        pan_number: formData.pan_number,
        website_url: formData.website_url,
        contact_person: formData.contact_person,
        contact_person_designation: formData.contact_person_designation,
        contact_person_phone: formData.contact_person_phone,
      });
      await apiService.sendOTP(formData.email.trim(), "verification");
      setStep("otp");
    } catch (e: any) {
      setErrorMsg(e?.message || "Failed to submit claim request");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendOTP = async () => {
    if (!formData.email) { setErrorMsg("Please enter your email first"); return; }
    setOtpSending(true);
    setErrorMsg("");
    try {
      await apiService.sendOTP(formData.email.trim(), "verification");
    } catch (e: any) {
      setErrorMsg(e?.message || "Failed to send OTP");
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) { setErrorMsg("Please enter the OTP"); return; }
    setSubmitting(true);
    setErrorMsg("");
    try {
      await apiService.verifyOTP(formData.email.trim(), otp);
      setOtpVerified(true);
      setStep("success");
      setSuccessMsg("Claim request submitted successfully! Our team will verify and grant you access.");
    } catch (e: any) {
      setErrorMsg(e?.message || "Invalid OTP or verification failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!college) return null;

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Claim {college.name}</h3>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-5">
          {errorMsg && (
            <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 rounded-lg px-4 py-3 text-sm">
              <span>{errorMsg}</span>
            </div>
          )}

          {step === "success" ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-green-600" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Request Received!</h4>
              <p className="text-sm text-gray-500">{successMsg}</p>
            </div>
          ) : step === "otp" ? (
            <div>
              <p className="text-sm text-gray-600 mb-4">Enter the 6-digit OTP sent to <strong>{formData.email}</strong></p>
              <input type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                className={`${inputClass} text-center text-2xl tracking-widest mb-4`} placeholder="000000" />
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setStep("form")}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  Back
                </button>
                <button type="button" onClick={handleVerifyOTP} disabled={submitting || otp.length !== 6}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  Verify & Submit
                </button>
              </div>
              <button type="button" onClick={handleSendOTP} disabled={otpSending}
                className="mt-3 text-sm text-blue-600 hover:underline flex items-center gap-1">
                <Send size={14} /> Resend OTP
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Institution Name *</label>
                  <input type="text" value={formData.institution_name} onChange={e => updateField("institution_name", e.target.value)}
                    className={inputClass} placeholder="Enter full institution name" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Official Email *</label>
                  <input type="email" value={formData.email} onChange={e => updateField("email", e.target.value)}
                    className={inputClass} placeholder="admin@institution.edu.np" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input type="tel" value={formData.contact_number} onChange={e => updateField("contact_number", e.target.value)}
                    className={inputClass} placeholder="+977-XXXXXXXXX" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                  <select value={formData.province} onChange={e => updateField("province", e.target.value)}
                    className={inputClass}>
                    <option value="">Select Province</option>
                    {NEPAL_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                  <select value={formData.district} onChange={e => updateField("district", e.target.value)}
                    className={inputClass} disabled={!formData.province}>
                    <option value="">Select District</option>
                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization Type</label>
                  <select value={formData.organization_type} onChange={e => updateField("organization_type", e.target.value)}
                    className={inputClass}>
                    <option value="">Select Type</option>
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                    <option value="community">Community</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                  <input type="text" value={formData.pan_number} onChange={e => updateField("pan_number", e.target.value)}
                    className={inputClass} placeholder="PAN number" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number *</label>
                  <input type="text" value={formData.registration_number} onChange={e => updateField("registration_number", e.target.value)}
                    className={inputClass} placeholder="e.g. 12345/078" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                  <input type="url" value={formData.website_url} onChange={e => updateField("website_url", e.target.value)}
                    className={inputClass} placeholder="https://www.college.edu.np" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person Name</label>
                  <input type="text" value={formData.contact_person} onChange={e => updateField("contact_person", e.target.value)}
                    className={inputClass} placeholder="Full name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person Designation</label>
                  <input type="text" value={formData.contact_person_designation} onChange={e => updateField("contact_person_designation", e.target.value)}
                    className={inputClass} placeholder="e.g. Principal" />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="button" onClick={submitClaim} disabled={submitting || !formData.email || !formData.institution_name}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2">
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                  {submitting ? "Submitting..." : "Submit & Verify Email"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
