"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/services/AuthContext";
import { Eye, EyeOff } from "lucide-react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password, rememberMe);
      router.push("/");
    } catch (err: any) {
      const errorMsg = err?.message?.toLowerCase() || "";
      if (errorMsg.includes("invalid") || errorMsg.includes("wrong") || errorMsg.includes(" credentials") || errorMsg.includes("failed") || errorMsg.includes("401") || errorMsg.includes("403")) {
        setError("Invalid email or password");
      } else {
        setError(err?.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google`;
  };

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        <button
          type="button"
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 rounded-md border border-gray-200 bg-white py-3 px-4 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
        >
          <img src="/google-icon.svg" alt="Google icon" className="h-5 w-5" />
          Sign in via Google
        </button>
      </div>

      <div className="relative flex items-center text-center text-xs text-gray-400">
        <span className="mx-auto bg-white px-3 z-10">or continue with</span>
        <div className="absolute inset-x-0 top-1/2 h-px bg-gray-200" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#111827]">Email Address</label>
          <div className="relative">
            <input
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              type="email"
              placeholder="Email Address"
              className={`w-full rounded-md border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-[#0000ff] focus:ring-0 focus:ring-[#0000ff] ${error ? "border-red-500" : ""}`}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#111827]">Password</label>
          <div className="relative">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full rounded-md border border-gray-200 bg-white px-4 py-3 pr-14 text-sm text-gray-900 outline-none transition-all focus:border-[#0000ff] focus:ring-0 focus:ring-[#0000ff]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400"
            >
              {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 text-sm text-gray-600">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-[#0000ff] focus:ring-[#0000ff]"
            />
            Remember me
          </label>
          <Link href="/forgot-password" className="font-semibold text-[#0000ff] hover:text-blue-800">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-[#0000ff] px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
        {error && (
          <p className="text-[13px] text-red-500 text-center font-medium">{error}</p>
        )}
      </form>
    </div>
  );
}
