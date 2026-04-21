"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSuperadminAuth } from "@/services/SuperadminAuthContext";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";

const SuperadminLogin = () => {
  const router = useRouter();
  const { login } = useSuperadminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      router.push("/superadmin");
    } catch (err: any) {
      setError(err.message || "Login failed. Internal systems only.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4 selection:bg-[#0000ff]/10">
      {/* Glow blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-20">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-[#0000ff]/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-[#0000cc]/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-md p-8 md:p-10">
          {/* Header */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 bg-[#0000ff]/10 rounded-2xl flex items-center justify-center border border-[#0000ff]/20 mb-4 shadow-sm">
              <ShieldCheck className="w-8 h-8 text-[#0000ff]" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Super Control
            </h1>
            <p className="text-slate-500 mt-2 text-sm leading-relaxed max-w-xs font-medium">
              Authorized personnel only. Enter your administrative credentials
              to access the nexus.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-start gap-3">
              <svg
                className="w-4 h-4 mt-0.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                Admin Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-[#0000ff] transition-colors" />
                </div>
                <input
                  id="superadmin-email"
                  type="email"
                  required
                  value={email}
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@studsphere.com"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#0000ff] focus:ring-4 focus:ring-[#0000ff]/5 focus:outline-none rounded-md py-3.5 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 font-medium transition-all text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                Access Key
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-[#0000ff] transition-colors" />
                </div>
                <input
                  id="superadmin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  disabled={loading}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#0000ff] focus:ring-4 focus:ring-[#0000ff]/5 focus:outline-none rounded-md py-3.5 pl-12 pr-12 text-slate-900 placeholder:text-slate-400 font-medium transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#0000ff] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="peer appearance-none w-5 h-5 border border-slate-200 rounded-lg bg-slate-50 checked:bg-[#0000ff] checked:border-[#0000ff] focus:outline-none transition-all"
                  />
                  <svg
                    className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-sm text-slate-500 font-medium group-hover:text-slate-700 transition-colors">
                  Keep me authenticated
                </span>
              </label>
              <button
                type="button"
                className="text-sm font-bold text-[#0000ff] hover:text-[#0000cc] transition-colors"
              >
                Lost Access?
              </button>
            </div>

            {/* Submit */}
            <button
              id="superadmin-login-btn"
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden bg-gradient-to-r from-[#0000ff] to-[#0000cc] hover:from-[#0000cc] hover:to-[#0000ff] disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold py-4 rounded-md shadow-lg shadow-[#0000ff]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <div className="absolute inset-0 w-0 bg-gradient-to-r from-white/10 to-transparent group-hover:w-full transition-all duration-700 ease-out" />
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Initialize Access</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm font-medium">
              New administrator?{" "}
              <button
                onClick={() => router.push("/superadmin/signup")}
                className="text-[#0000ff] font-bold hover:text-[#0000cc] transition-colors hover:underline underline-offset-4"
              >
                Register Credentials
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-slate-400 text-[10px] mt-8 uppercase tracking-[0.2em] font-bold">
          Internal Systems &copy; 2026 StudSphere Global Security
        </p>
      </div>
    </div>
  );
};

export default SuperadminLogin;
