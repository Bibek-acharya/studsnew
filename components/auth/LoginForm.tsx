"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/services/AuthContext";
import { apiService } from "@/services/api";
import { Eye, EyeOff } from "lucide-react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function decodeToken(token: string) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id: payload.user_id,
      email: payload.email,
      role: payload.role || "student",
      first_name: payload.first_name || payload.email?.split("@")[0] || "",
      last_name: payload.last_name || "",
      image_url: payload.image_url || "",
    };
  } catch {
    return null;
  }
}

function getInitials(name: string, email: string) {
  if (name && name !== email?.split("@")[0]) {
    return name.charAt(0).toUpperCase();
  }
  return (email?.charAt(0) || "?").toUpperCase();
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    login,
    setSession,
    requiresTOTP,
    totpTempToken,
    verifyTOTP,
    cancelTOTP,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [totpLoading, setTotpLoading] = useState(false);
  const tokenProcessed = useRef(false);

  useEffect(() => {
    const token = searchParams.get("token");
    if (token && !tokenProcessed.current) {
      tokenProcessed.current = true;
      setGoogleLoading(true);
      const redirect = searchParams.get("redirect") || "/";
      (async () => {
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
        }
        try {
          const res = await apiService.getProfile({
            headers: { Authorization: `Bearer ${token}` },
          } as any);
          const profile = res.data;
          setSession(
            {
              id: profile.id,
              first_name: profile.first_name,
              last_name: profile.last_name,
              email: profile.email,
              role: profile.role,
              image_url: profile.image_url,
            },
            token,
          );
          window.location.href = redirect;
        } catch {
          const user = decodeToken(token);
          if (user) {
            setSession(user, token);
            window.location.href = redirect;
          } else {
            setGoogleLoading(false);
            setError("Failed to process login");
          }
        }
      })();
      return;
    }

    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [searchParams, setSession]);

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
      if (!requiresTOTP) {
        router.push("/");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMsg = err?.message?.toLowerCase() || "";
      if (
        errorMsg.includes("invalid") ||
        errorMsg.includes("wrong") ||
        errorMsg.includes(" credentials") ||
        errorMsg.includes("failed") ||
        errorMsg.includes("401") ||
        errorMsg.includes("403")
      ) {
        setError("Invalid email or password");
      } else {
        setError(err?.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    const requestedRedirect = searchParams.get("redirect");
    const redirectPath =
      requestedRedirect && requestedRedirect !== "/login"
        ? requestedRedirect
        : "/";
    const redirectParam = encodeURIComponent(redirectPath);
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google?redirect=${redirectParam}&prompt=select_account`;
  };

  const handleTOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!totpCode.trim() || totpCode.length < 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }
    setTotpLoading(true);
    try {
      await verifyTOTP(totpCode.trim());
      router.push("/");
    } catch (err: any) {
      setError(err?.message || "Invalid verification code");
    } finally {
      setTotpLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {requiresTOTP ? (
        <form onSubmit={handleTOTPSubmit} className="space-y-4">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Two-Factor Authentication
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Enter the 6-digit code from your authenticator app.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Authentication Code
            </label>
            <input
              value={totpCode}
              onChange={(e) => {
                setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                setError("");
              }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              className={`w-full rounded-md border border-gray-200 bg-white px-4 py-3 text-center text-2xl tracking-widest text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${error ? "border-red-500" : ""}`}
            />
            {error && (
              <p className="mt-1 text-[13px] text-red-500 font-medium">
                {error}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={totpLoading || totpCode.length < 6}
            className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {totpLoading ? "Verifying..." : "Verify & Sign In"}
          </button>
          <button
            type="button"
            onClick={cancelTOTP}
            className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
          >
            Back to sign in
          </button>
        </form>
      ) : (
        <>
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogle}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 rounded-md border border-gray-200 bg-white py-3 px-4 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <img
                  src="/google-icon.svg"
                  alt="Google icon"
                  className="h-5 w-5"
                />
              )}
              {googleLoading ? "Completing sign in..." : "Sign in via Google"}
            </button>
          </div>

          <div className="relative flex items-center text-center text-xs text-gray-400">
            <span className="mx-auto bg-white px-3 z-10">or continue with</span>
            <div className="absolute inset-x-0 top-1/2 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#111827]">
                Email Address
              </label>
              <div className="relative">
                <input
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  type="email"
                  placeholder="Email Address"
                  className={`w-full rounded-md border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-[#0000ff] focus:ring-0 focus:ring-[#0000ff] ${error ? "border-red-500" : ""}`}
                />
              </div>
              {error && (
                <p className="text-[13px] text-red-500 font-medium">{error}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#111827]">
                Password
              </label>
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
              <Link
                href="/forgot-password"
                className="font-semibold text-[#0000ff] hover:text-blue-800"
              >
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
          </form>
        </>
      )}
    </div>
  );
}
