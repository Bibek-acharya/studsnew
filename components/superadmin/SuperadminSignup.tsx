"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSuperadminAuth } from "@/services/SuperadminAuthContext";
import {
  Mail,
  Lock,
  User,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";

const SuperadminSignup = () => {
  const router = useRouter();
  const { register } = useSuperadminAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    accessCode: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await register({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        access_code: formData.accessCode,
      });
      router.push("/superadmin");
    } catch (err: any) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 selection:bg-[#0000ff]/10">
      <div className="relative z-10 w-full max-w-[500px]">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl p-8 md:p-10">
          {/* Header */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 bg-[#0000ff]/5 rounded-2xl flex items-center justify-center border border-[#0000ff]/10 mb-4 shadow-sm">
              <ShieldCheck className="w-8 h-8 text-[#0000ff]" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Onboard Administrator
            </h1>
            <p className="text-slate-500 mt-2 text-sm font-medium leading-relaxed">
              Create a high-level administrative account. A valid access code is
              required.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-start gap-3 shadow-sm">
              <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    id="sa-first-name"
                    name="firstName"
                    required
                    onChange={handleChange}
                    placeholder="John"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#0000ff] focus:ring-4 focus:ring-[#0000ff]/5 focus:outline-none rounded-xl py-2.5 pl-10 pr-3 text-slate-900 placeholder:text-slate-300 transition-all text-sm font-medium shadow-inner"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Last Name
                </label>
                <input
                  id="sa-last-name"
                  name="lastName"
                  required
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#0000ff] focus:ring-4 focus:ring-[#0000ff]/5 focus:outline-none rounded-xl py-2.5 px-4 text-slate-900 placeholder:text-slate-300 transition-all text-sm font-medium shadow-inner"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  id="sa-email"
                  name="email"
                  type="email"
                  required
                  onChange={handleChange}
                  placeholder="admin@studsphere.com"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#0000ff] focus:ring-4 focus:ring-[#0000ff]/5 focus:outline-none rounded-xl py-2.5 pl-10 pr-3 text-slate-900 placeholder:text-slate-300 transition-all text-sm font-medium shadow-inner"
                />
              </div>
            </div>

            {/* Password Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    id="sa-password"
                    name="password"
                    type={showPwd ? "text" : "password"}
                    required
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#0000ff] focus:ring-4 focus:ring-[#0000ff]/5 focus:outline-none rounded-xl py-2.5 pl-10 pr-10 text-slate-900 placeholder:text-slate-300 transition-all text-sm font-medium shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPwd ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Confirm
                </label>
                <div className="relative">
                  <input
                    id="sa-confirm-password"
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    required
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#0000ff] focus:ring-4 focus:ring-[#0000ff]/5 focus:outline-none rounded-xl py-2.5 px-4 pr-10 text-slate-900 placeholder:text-slate-300 transition-all text-sm font-medium shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirm ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Access Code */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                Admin Access Code <span className="text-[#0000ff]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <ShieldCheck className="w-4 h-4 text-[#0000ff]/40" />
                </div>
                <input
                  id="sa-access-code"
                  name="accessCode"
                  type="text"
                  required
                  onChange={handleChange}
                  placeholder="XXXXXXXXX"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#0000ff] focus:ring-4 focus:ring-[#0000ff]/5 focus:outline-none rounded-xl py-2.5 pl-10 pr-3 text-slate-900 placeholder:text-slate-400 transition-all text-sm font-mono tracking-widest shadow-inner font-bold"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              id="superadmin-register-btn"
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden bg-[#0000ff] hover:bg-[#0000cc] disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold py-4 rounded-2xl shadow-xl shadow-[#0000ff]/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
            >
              <div className="absolute inset-0 w-0 bg-linear-to-r from-white/10 to-transparent group-hover:w-full transition-all duration-700 ease-out" />
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Admin Identity</span>
                  <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Already have access?{" "}
              <button
                onClick={() => router.push("/superadmin/login")}
                className="text-[#0000ff] font-bold hover:text-[#0000cc] transition-colors"
              >
                Return to Login
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-slate-400 text-[10px] mt-8 uppercase tracking-[0.2em] font-bold">
          Classified Security Protocol &middot; Level 4 Clearance
        </p>
      </div>
    </div>
  );
};

export default SuperadminSignup;
