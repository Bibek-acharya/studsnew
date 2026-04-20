"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSuperadminAuth } from "@/services/SuperadminAuthContext";
import { Mail, Lock, User, ShieldCheck, CheckCircle2, Eye, EyeOff } from "lucide-react";

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
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a] p-4 selection:bg-blue-500/30">
      {/* Glow blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-[500px]">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-md shadow-2xl p-8 md:p-10">
          {/* Header */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 bg-blue-600/10 rounded-md flex items-center justify-center border border-blue-500/20 mb-4 shadow-[0_0_40px_rgba(59,130,246,0.1)]">
              <ShieldCheck className="w-8 h-8 text-blue-500" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Onboard Administrator</h1>
            <p className="text-slate-400 mt-2 text-sm leading-relaxed">
              Create a high-level administrative account. A valid access code is required.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-sm flex items-start gap-3">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="w-4 h-4 text-slate-500" />
                  </div>
                  <input
                    id="sa-first-name"
                    name="firstName"
                    required
                    onChange={handleChange}
                    placeholder="John"
                    className="w-full bg-slate-950/50 border border-slate-800 focus:border-blue-600/60 focus:ring-4 focus:ring-blue-600/10 focus:outline-none rounded-md py-2.5 pl-10 pr-3 text-white placeholder:text-slate-600 transition-all text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                <input
                  id="sa-last-name"
                  name="lastName"
                  required
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full bg-slate-950/50 border border-slate-800 focus:border-blue-600/60 focus:ring-4 focus:ring-blue-600/10 focus:outline-none rounded-md py-2.5 px-4 text-white placeholder:text-slate-600 transition-all text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-slate-500" />
                </div>
                <input
                  id="sa-email"
                  name="email"
                  type="email"
                  required
                  onChange={handleChange}
                  placeholder="admin@studsphere.com"
                  className="w-full bg-slate-950/50 border border-slate-800 focus:border-blue-600/60 focus:ring-4 focus:ring-blue-600/10 focus:outline-none rounded-md py-2.5 pl-10 pr-3 text-white placeholder:text-slate-600 transition-all text-sm"
                />
              </div>
            </div>

            {/* Password Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-slate-500" />
                  </div>
                  <input
                    id="sa-password"
                    name="password"
                    type={showPwd ? "text" : "password"}
                    required
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/50 border border-slate-800 focus:border-blue-600/60 focus:ring-4 focus:ring-blue-600/10 focus:outline-none rounded-md py-2.5 pl-10 pr-10 text-white placeholder:text-slate-600 transition-all text-sm"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-600 hover:text-slate-400">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Confirm</label>
                <div className="relative">
                  <input
                    id="sa-confirm-password"
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    required
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/50 border border-slate-800 focus:border-blue-600/60 focus:ring-4 focus:ring-blue-600/10 focus:outline-none rounded-md py-2.5 px-4 pr-10 text-white placeholder:text-slate-600 transition-all text-sm"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-600 hover:text-slate-400">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Access Code */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                Admin Access Code <span className="text-blue-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <ShieldCheck className="w-4 h-4 text-blue-500/60" />
                </div>
                <input
                  id="sa-access-code"
                  name="accessCode"
                  type="text"
                  required
                  onChange={handleChange}
                  placeholder="XXXXXXXXX"
                  className="w-full bg-slate-950/50 border border-blue-900/30 focus:border-blue-500 focus:ring-4 focus:ring-blue-600/10 focus:outline-none rounded-md py-2.5 pl-10 pr-3 text-white placeholder:text-slate-700 transition-all text-sm font-mono tracking-widest"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              id="superadmin-register-btn"
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold py-4 rounded-md shadow-xl shadow-blue-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
            >
              <div className="absolute inset-0 w-0 bg-gradient-to-r from-white/5 to-transparent group-hover:w-full transition-all duration-700 ease-out" />
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
          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <p className="text-slate-500 text-sm">
              Already have access?{" "}
              <button
                onClick={() => router.push("/superadmin/login")}
                className="text-blue-500 font-semibold hover:text-blue-400 transition-colors"
              >
                Return to Login
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-slate-600 text-[10px] mt-8 uppercase tracking-[0.2em]">
          Classified Security Protocol &middot; Level 4 Clearance
        </p>
      </div>
    </div>
  );
};

export default SuperadminSignup;
