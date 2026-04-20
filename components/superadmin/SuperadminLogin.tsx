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
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a] p-4 selection:bg-blue-500/30">
      {/* Glow blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
        {/* Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-md shadow-2xl p-8 md:p-10">
          {/* Header */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 bg-blue-600/10 rounded-md flex items-center justify-center border border-blue-500/20 mb-4 shadow-[0_0_40px_rgba(59,130,246,0.1)]">
              <ShieldCheck className="w-8 h-8 text-blue-500" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Super Control</h1>
            <p className="text-slate-400 mt-2 text-sm leading-relaxed max-w-xs">
              Authorized personnel only. Enter your administrative credentials to access the nexus.
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">
                Admin Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  id="superadmin-email"
                  type="email"
                  required
                  value={email}
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@studsphere.com"
                  className="w-full bg-slate-950/50 border border-slate-800 focus:border-blue-600/60 focus:ring-4 focus:ring-blue-600/10 focus:outline-none rounded-md py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 transition-all text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">
                Access Key
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  id="superadmin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  disabled={loading}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/50 border border-slate-800 focus:border-blue-600/60 focus:ring-4 focus:ring-blue-600/10 focus:outline-none rounded-md py-3.5 pl-12 pr-12 text-white placeholder:text-slate-600 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-600 hover:text-slate-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="peer appearance-none w-5 h-5 border border-slate-800 rounded-md bg-slate-950 checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition-all"
                  />
                  <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Keep me authenticated</span>
              </label>
              <button type="button" className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors">
                Lost Access?
              </button>
            </div>

            {/* Submit */}
            <button
              id="superadmin-login-btn"
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold py-4 rounded-md shadow-xl shadow-blue-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <div className="absolute inset-0 w-0 bg-gradient-to-r from-white/5 to-transparent group-hover:w-full transition-all duration-700 ease-out" />
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
          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <p className="text-slate-500 text-sm">
              New administrator?{" "}
              <button
                onClick={() => router.push("/superadmin/signup")}
                className="text-blue-500 font-semibold hover:text-blue-400 transition-colors hover:underline underline-offset-4"
              >
                Register Credentials
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-slate-600 text-[10px] mt-8 uppercase tracking-[0.2em]">
          Internal Systems &copy; 2026 StudSphere Global Security
        </p>
      </div>
    </div>
  );
};

export default SuperadminLogin;
