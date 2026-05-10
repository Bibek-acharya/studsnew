"use client";

import React, { useEffect, useState, useRef } from "react";
import { apiService } from "../../services/api";
import { scholarshipProviderApi } from "../../services/scholarshipProviderApi";
import { getStoredUsers } from "@/services/providerRbac";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";

import ScholarshipProviderDashboard from "@/components/ScholarshipProvider/ScholarshipProviderDashboard";

interface ScholarshipProviderZoneProps {
  onNavigate?: (view: string, data?: unknown) => void;
}

type ViewState = "landing" | "dashboard" | "pending-approval";

function formatTimer(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const ScholarshipProviderZone: React.FC<ScholarshipProviderZoneProps> = ({
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<"register" | "login">("login");
  const [rememberMe, setRememberMe] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerStep, setRegisterStep] = useState(1);
  const [registerProviderName, setRegisterProviderName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerContact, setRegisterContact] = useState("");
  const [registerNumber, setRegisterNumber] = useState("");
  const [registerPAN, setRegisterPAN] = useState("");
  const [registerWebsite, setRegisterWebsite] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>("landing");
  const router = useRouter();

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loginFieldErrors, setLoginFieldErrors] = useState<Record<string, string>>({});

  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(120);
  const [otpResendDisabled, setOtpResendDisabled] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [fpStep, setFpStep] = useState<"email" | "otp" | "newPassword">("email");
  const [fpEmail, setFpEmail] = useState("");
  const [fpOtp, setFpOtp] = useState(["", "", "", "", "", ""]);
  const [fpNewPassword, setFpNewPassword] = useState("");
  const [fpConfirmPassword, setFpConfirmPassword] = useState("");
  const [fpLoading, setFpLoading] = useState(false);
  const [fpError, setFpError] = useState<string | null>(null);
  const [fpSuccess, setFpSuccess] = useState<string | null>(null);
  const fpOtpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [fpOtpTimer, setFpOtpTimer] = useState(120);

  useEffect(() => {
    const token = localStorage.getItem("scholarshipProviderToken") || sessionStorage.getItem("scholarshipProviderToken");
    const user = localStorage.getItem("scholarshipProviderUser") || sessionStorage.getItem("scholarshipProviderUser");
    if (token && user) {
      router.push("/scholarship-provider/dashboard");
    }
  }, [router]);

  useEffect(() => {
    if (showOtpStep || fpStep === "otp") {
      const interval = setInterval(() => {
        if (showOtpStep) {
          setOtpTimer((t) => {
            if (t <= 1) { clearInterval(interval); return 0; }
            return t - 1;
          });
        }
        if (fpStep === "otp") {
          setFpOtpTimer((t) => {
            if (t <= 1) { clearInterval(interval); return 0; }
            return t - 1;
          });
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showOtpStep, fpStep]);

  const clearAuthMessages = () => {
    setAuthError(null);
    setAuthSuccess(null);
    setFieldErrors({});
    setLoginFieldErrors({});
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^\d{10}$/.test(phone);

  const loginProviderUser = (email: string, password: string) => {
    const users = getStoredUsers();
    const user = users.find(
      (u) => u.email === email && u.password === password && u.status === "Active"
    );
    if (user) {
      user.lastActive = "Just now";
      const updatedUsers = users.map(u => u.id === user.id ? user : u);
      localStorage.setItem("scholarshipProviderUsers", JSON.stringify(updatedUsers));
    }
    return user || null;
  };

  const handleProviderLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearAuthMessages();

    const errors: Record<string, string> = {};
    if (!loginEmail.trim()) errors.email = "Email is required.";
    if (!loginPassword.trim()) errors.password = "Password is required.";

    setLoginFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setAuthLoading(true);
    try {
      const storage = rememberMe ? localStorage : sessionStorage;

      // Set token cookie for middleware (which checks for `token` cookie)
      const setTokenCookie = (token: string) => {
        if (typeof document !== "undefined") {
          const maxAge = rememberMe ? "max-age=604800;" : "";
          document.cookie = `token=${token}; path=/; ${maxAge}SameSite=Lax`;
        }
      };

      // FIRST: Check for sub-user login
      const subUser = loginProviderUser(loginEmail.trim(), loginPassword);
      if (subUser) {
        storage.setItem("scholarshipProviderUser", JSON.stringify({
          ...subUser,
          isSubUser: true,
        }));
        setTokenCookie("sub_user");
        router.push("/scholarship-provider/dashboard");
        setLoginPassword("");
        return;
      }

      // If not sub-user, proceed with main provider login
      const response = await apiService.scholarshipProviderLogin(
        loginEmail.trim(),
        loginPassword,
      );

      // Store token in storage based on remember me preference
      const token = response.data?.token;
      const user = response.data?.user;
      if (token) {
        storage.setItem("scholarshipProviderToken", token);
        setTokenCookie(token);
      }
      if (user) {
        storage.setItem("scholarshipProviderUser", JSON.stringify(user));
      }

      router.push("/scholarship-provider/dashboard");
      setLoginPassword("");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Login failed. Please try again.";
      if (msg.toLowerCase().includes("password")) {
        setLoginFieldErrors({ password: msg });
      } else {
        setAuthError(msg);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleContinueStep2 = () => {
    clearAuthMessages();
    const errors: Record<string, string> = {};

    if (!registerProviderName.trim()) errors.providerName = "Organization name is required.";
    if (!validateEmail(registerEmail.trim())) errors.email = "Please enter a valid email address.";
    if (!validatePhone(registerContact.trim())) errors.contact = "Please enter a valid 10-digit phone number.";

    setFieldErrors(errors);
    if (Object.keys(errors).length === 0) {
      setRegisterStep(2);
    }
  };

  const handleProviderRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearAuthMessages();

    const errors: Record<string, string> = {};
    if (!registerPAN.trim()) errors.pan = "PAN number is required.";
    else if (!/^\d{9}$/.test(registerPAN.trim())) errors.pan = "PAN must be exactly 9 digits.";
    if (!registerNumber.trim()) errors.number = "Registration number is required.";
    else if (!/^[A-Za-z0-9]{4}-[A-Za-z0-9]{3}-[A-Za-z0-9]{3}$/.test(registerNumber.trim())) errors.number = "Format must be XXXX-XXX-XXX.";
    if (!registerWebsite.trim()) errors.website = "Website URL is required.";

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setAuthLoading(true);
    try {
      await apiService.scholarshipProviderRegister({
        provider_name: registerProviderName.trim(),
        registration_number: registerNumber.trim(),
        email: registerEmail.trim(),
        contact_number: registerContact.trim(),
        pan_number: registerPAN.trim(),
        website_url: registerWebsite.trim(),
      });

      await apiService.sendOTP(registerEmail.trim(), "verification");

      setShowOtpStep(true);
      setOtpTimer(120);
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : "Registration failed. Please try again.",
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setAuthError(null);
    if (value && index < 5) otpInputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, 6).replace(/\D/g, "");
    const newOtp = Array(6).fill("").map((_, i) => paste[i] || "");
    setOtp(newOtp);
    if (paste[5]) otpInputRefs.current[5]?.focus();
    else if (paste.length) otpInputRefs.current[paste.length]?.focus();
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setAuthError("Please enter the full 6-digit code");
      return;
    }

    setAuthLoading(true);
    try {
      await apiService.verifyOTP(registerEmail.trim(), otpCode);
      setCurrentView("pending-approval");
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : "Verification failed. Please try again.",
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setOtpResendDisabled(true);
    try {
      await apiService.sendOTP(registerEmail.trim(), "verification");
      setOtpTimer(120);
      setOtp(["", "", "", "", "", ""]);
      setAuthError(null);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    } catch (error) {
      setAuthError("Failed to resend code. Please try again.");
    } finally {
      setOtpResendDisabled(false);
    }
  };

  const handleFpSendOtp = async () => {
    setFpError(null);
    if (!fpEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fpEmail.trim())) {
      setFpError("Please enter a valid email address");
      return;
    }
    setFpLoading(true);
    try {
      await scholarshipProviderApi.sendOTP(fpEmail.trim(), "password_reset");
      setFpStep("otp");
      setFpOtpTimer(120);
      setTimeout(() => fpOtpInputRefs.current[0]?.focus(), 100);
    } catch (error) {
      setFpError(error instanceof Error ? error.message : "Failed to send OTP");
    } finally {
      setFpLoading(false);
    }
  };

  const handleFpOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...fpOtp];
    newOtp[index] = value.slice(-1);
    setFpOtp(newOtp);
    setFpError(null);
    if (value && index < 5) fpOtpInputRefs.current[index + 1]?.focus();
  };

  const handleFpOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !fpOtp[index] && index > 0) {
      fpOtpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleFpOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, 6).replace(/\D/g, "");
    const newOtp = Array(6).fill("").map((_, i) => paste[i] || "");
    setFpOtp(newOtp);
    if (paste[5]) fpOtpInputRefs.current[5]?.focus();
    else if (paste.length) fpOtpInputRefs.current[paste.length]?.focus();
  };

  const handleFpResetPassword = async () => {
    setFpError(null);
    const otpCode = fpOtp.join("");
    if (otpCode.length !== 6) {
      setFpError("Please enter the full 6-digit code");
      return;
    }
    if (!fpNewPassword || fpNewPassword.length < 6) {
      setFpError("Password must be at least 6 characters");
      return;
    }
    if (fpNewPassword !== fpConfirmPassword) {
      setFpError("Passwords do not match");
      return;
    }
    setFpLoading(true);
    try {
      await scholarshipProviderApi.resetPassword(fpEmail.trim(), otpCode, fpNewPassword);
      setFpSuccess("Password reset successful! You can now sign in.");
      setTimeout(() => {
        setShowForgotPassword(false);
        setFpStep("email");
        setFpEmail("");
        setFpOtp(["", "", "", "", "", ""]);
        setFpNewPassword("");
        setFpConfirmPassword("");
        setFpSuccess(null);
      }, 2000);
    } catch (error) {
      setFpError(error instanceof Error ? error.message : "Failed to reset password");
    } finally {
      setFpLoading(false);
    }
  };


  if (currentView === "pending-approval") {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
        </div>
        <div className="bg-white max-w-[420px] w-full rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-6 sm:p-8 text-center">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <BadgeCheck className="w-16 h-16 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Application Submitted Successfully!</h2>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mt-6 mb-6 text-left">
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#0000ff] mt-0.5 flex-shrink-0">
                <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
              </svg>
              <p className="text-[14px] text-gray-700 font-medium leading-relaxed">
                Your account is currently under review by our admin team. This process usually takes <span className="font-bold text-gray-900">24 hours</span>. You will receive an email notification once your account is complete.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => { setCurrentView("landing"); setActiveTab("login"); }}
            className="w-full bg-[#0000ff] hover:bg-[#0000cc] active:scale-[0.98] text-white text-sm font-semibold py-3 rounded-lg transition-all"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <><div suppressHydrationWarning className="min-h-screen w-full font-sans selection:bg-[#0000ff] selection:text-white bg-gray-50 flex items-center justify-center p-4 md:p-8 lg:p-12">
      <div className="w-full max-w-[1400px] bg-[#0000ff] rounded-2xl p-6 sm:p-10 lg:py-10 lg:px-16 xl:px-20 relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center w-full">
          <div className="order-2 lg:order-1 flex flex-col justify-center text-center lg:text-left space-y-5 mx-auto lg:mx-0 max-w-xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-[1.15] font-extrabold tracking-tight text-white">
              Empower Students<br />
              Through <span className="text-blue-200">Scholarships</span>
            </h1>
            <p className="text-base sm:text-lg text-blue-50/90 leading-relaxed font-medium">
              Manage applications, award funding, and track student progress — all from one powerful dashboard.
            </p>
          </div>
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">

            <div className="w-full max-w-md">
              <div className="bg-white border border-gray-200 rounded-xl p-8 sm:p-10 shadow-lg">
                <Link href="/" className="flex justify-center mb-6">
                  <Image src="/studsphere.png" alt="StudSphere" width={160} height={42} className="h-10 w-auto" />
                </Link>
                {activeTab === "login" && !showForgotPassword && (
                  <div className="animate-[fadeIn_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]">
                    <div className="text-center mb-5">
                      <h1 className="text-xl font-bold text-gray-900 mb-1.5">Sign in to StudSphere</h1>
                      <p className="text-[13px] text-gray-500 font-medium">Welcome back! Enter your details to access your dashboard.</p>
                    </div>
                    <form onSubmit={handleProviderLogin} className="space-y-4">
                      <div>
                        <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Email</label>
                        <input
                          type="email"
                          placeholder="Enter your Email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className={`w-full px-4 py-3 rounded-lg border-[0.5px] bg-white text-sm focus:outline-none focus:border-[#0000ff] focus:ring-1 focus:ring-[#0000ff] transition-all placeholder:text-gray-400 font-medium text-gray-900 ${loginFieldErrors.email ? 'border-red-500' : 'border-gray-200'}`}
                        />
                        {loginFieldErrors.email && <p className="text-red-500 text-[12px] mt-1">{loginFieldErrors.email}</p>}
                      </div>
                      <div>
                        <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Password</label>
                        <div className="relative">
                          <input
                            type={showLoginPassword ? "text" : "password"}
                            placeholder="Enter Password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className={`w-full pl-4 pr-12 py-3 rounded-lg border-[0.5px] bg-white text-sm focus:outline-none focus:border-[#0000ff] focus:ring-1 focus:ring-[#0000ff] transition-all placeholder:text-gray-400 font-medium text-gray-900 ${loginFieldErrors.password ? 'border-red-500' : 'border-gray-200'}`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowLoginPassword(!showLoginPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0000ff] transition-colors"
                          >
                            {showLoginPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                          </button>
                        </div>
                        {loginFieldErrors.password && <p className="text-red-500 text-[12px] mt-1">{loginFieldErrors.password}</p>}
                      </div>
                      <div className="flex items-center justify-between pt-1">
<label className="flex items-center gap-2 cursor-pointer group">
                           <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-[#0000ff]" />
                          <span className="text-[13px] text-gray-500 font-medium group-hover:text-gray-800 transition-colors">Remember me</span>
                        </label>
                        <button type="button" onClick={() => { setShowForgotPassword(true); setFpStep("email"); setFpError(null); setFpSuccess(null); }} className="text-[13px] font-semibold text-[#0000ff] hover:text-[#0000cc] hover:underline transition-colors">
                          Forgot password?
                        </button>
                      </div>
                      {authError && <p className="text-sm text-red-500">{authError}</p>}
                      {authSuccess && <p className="text-sm text-emerald-600">{authSuccess}</p>}
                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full bg-[#0000ff] hover:bg-[#0000cc] active:scale-[0.98] text-white text-sm font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
                      >
                        {authLoading ? "Signing in..." : "Sign in"}
                      </button>
                    </form>
                    <div className="mt-5 text-center text-[13px] text-gray-500 font-medium">
                      Don&apos;t have an account?{' '}
                      <button type="button" onClick={() => { setActiveTab("register"); setRegisterStep(1); }} className="text-[#0000ff] font-semibold hover:underline transition-all">
                        Register here
                      </button>
                    </div>
                  </div>
                )}

                {showForgotPassword && (
                  <div className="animate-[fadeIn_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]">
                    {fpSuccess ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <BadgeCheck className="w-8 h-8 text-green-600" />
                        </div>
                        <p className="text-green-700 font-semibold">{fpSuccess}</p>
                      </div>
                    ) : fpStep === "email" ? (
                      <>
                        <div className="text-center mb-5">
                          <h2 className="text-xl font-bold text-gray-900 mb-1.5">Reset Password</h2>
                          <p className="text-[13px] text-gray-500 font-medium">Enter your email to receive a verification code.</p>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Email</label>
                            <input
                              type="email"
                              placeholder="Enter your registered email"
                              value={fpEmail}
                              onChange={(e) => setFpEmail(e.target.value)}
                              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#0000ff] focus:ring-1 focus:ring-[#0000ff] transition-all placeholder:text-gray-400 font-medium text-gray-900"
                            />
                          </div>
                          {fpError && <p className="text-sm text-red-500">{fpError}</p>}
                          <button
                            type="button"
                            onClick={handleFpSendOtp}
                            disabled={fpLoading}
                            className="w-full bg-[#0000ff] hover:bg-[#0000cc] active:scale-[0.98] text-white text-sm font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
                          >
                            {fpLoading ? "Sending..." : "Send Code"}
                          </button>
                          <button
                            type="button"
                            onClick={() => { setShowForgotPassword(false); setFpError(null); }}
                            className="w-full text-center text-[13px] text-gray-500 font-medium hover:text-gray-800 transition-colors"
                          >
                            Back to Sign In
                          </button>
                        </div>
                      </>
                    ) : fpStep === "otp" ? (
                      <>
                        <div className="text-center mb-5">
                          <h2 className="text-xl font-bold text-gray-900 mb-1.5">Enter Verification Code</h2>
                          <p className="text-[13px] text-gray-500 font-medium">A 6-digit code was sent to {fpEmail}</p>
                        </div>
                        <div className="flex items-center justify-center gap-2 mb-4">
                          {fpOtp.map((digit, i) => (
                            <input
                              key={i}
                              ref={(el) => { fpOtpInputRefs.current[i] = el; }}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleFpOtpChange(i, e.target.value)}
                              onKeyDown={(e) => handleFpOtpKeyDown(i, e)}
                              onPaste={i === 0 ? handleFpOtpPaste : undefined}
                              className="w-10 h-12 text-center border border-gray-300 rounded-lg text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#0000ff] focus:ring-1 focus:ring-[#0000ff]"
                            />
                          ))}
                        </div>
                        <div className="text-center mb-4">
                          <span className="text-[12px] text-gray-500">
                            {fpOtpTimer > 0 ? (
                              <>Resend code in <span className="font-semibold text-gray-700">{formatTimer(fpOtpTimer)}</span></>
                            ) : (
                              <button
                                type="button"
                                onClick={handleFpSendOtp}
                                className="text-[#0000ff] font-semibold hover:underline"
                              >
                                Resend Code
                              </button>
                            )}
                          </span>
                        </div>
                        {fpError && <p className="text-sm text-red-500 text-center mb-2">{fpError}</p>}
                        <button
                          type="button"
                          onClick={() => setFpStep("newPassword")}
                          disabled={fpOtp.join("").length !== 6}
                          className="w-full bg-[#0000ff] hover:bg-[#0000cc] active:scale-[0.98] text-white text-sm font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
                        >
                          Verify Code
                        </button>
                        <button
                          type="button"
                          onClick={() => setFpStep("email")}
                          className="w-full text-center text-[13px] text-gray-500 font-medium hover:text-gray-800 transition-colors mt-2"
                        >
                          Back
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="text-center mb-5">
                          <h2 className="text-xl font-bold text-gray-900 mb-1.5">Create New Password</h2>
                          <p className="text-[13px] text-gray-500 font-medium">Enter your new password below.</p>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">New Password</label>
                            <div className="relative">
                              <input
                                type={showLoginPassword ? "text" : "password"}
                                placeholder="At least 6 characters"
                                value={fpNewPassword}
                                onChange={(e) => setFpNewPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#0000ff] focus:ring-1 focus:ring-[#0000ff] transition-all placeholder:text-gray-400 font-medium text-gray-900"
                              />
                              <button
                                type="button"
                                onClick={() => setShowLoginPassword(!showLoginPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0000ff] transition-colors"
                              >
                                {showLoginPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                            <div className="relative">
                              <input
                                type={showLoginPassword ? "text" : "password"}
                                placeholder="Re-enter your password"
                                value={fpConfirmPassword}
                                onChange={(e) => setFpConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#0000ff] focus:ring-1 focus:ring-[#0000ff] transition-all placeholder:text-gray-400 font-medium text-gray-900"
                              />
                              <button
                                type="button"
                                onClick={() => setShowLoginPassword(!showLoginPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0000ff] transition-colors"
                              >
                                {showLoginPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                              </button>
                            </div>
                          </div>
                          {fpError && <p className="text-sm text-red-500">{fpError}</p>}
                          <button
                            type="button"
                            onClick={handleFpResetPassword}
                            disabled={fpLoading}
                            className="w-full bg-[#0000ff] hover:bg-[#0000cc] active:scale-[0.98] text-white text-sm font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
                          >
                            {fpLoading ? "Resetting..." : "Reset Password"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setFpStep("otp")}
                            className="w-full text-center text-[13px] text-gray-500 font-medium hover:text-gray-800 transition-colors"
                          >
                            Back
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {activeTab === "register" && !showOtpStep && registerStep === 1 && (
                  <div className="animate-[fadeIn_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]">
                    <div className="text-center mb-4">
                      <h2 className="text-lg font-bold text-gray-900">Create Account</h2>
                      <p className="text-[13px] text-gray-500 font-medium">Enter your organization details</p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Organization Name</label>
                        <input
                          type="text"
                  placeholder="Enter Organization Name"
                  value={registerProviderName}
                          onChange={(e) => setRegisterProviderName(e.target.value)}
                          className={`w-full px-4 py-3 rounded-lg border-[0.5px] bg-white text-sm focus:outline-none focus:border-[#0000ff] focus:ring-1 focus:ring-[#0000ff] transition-all placeholder:text-gray-400 font-medium text-gray-900 ${fieldErrors.providerName ? 'border-red-500' : 'border-gray-200'}`}
                        />
                        {fieldErrors.providerName && <p className="text-red-500 text-[12px] mt-1">{fieldErrors.providerName}</p>}
                      </div>
                      <div>
                        <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Official Email</label>
                        <input
                          type="email"
                  placeholder="Enter Official Email"
                  value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          className={`w-full px-4 py-3 rounded-lg border-[0.5px] bg-white text-sm focus:outline-none focus:border-[#0000ff] focus:ring-1 focus:ring-[#0000ff] transition-all placeholder:text-gray-400 font-medium text-gray-900 ${fieldErrors.email ? 'border-red-500' : 'border-gray-200'}`}
                        />
                        {fieldErrors.email && <p className="text-red-500 text-[12px] mt-1">{fieldErrors.email}</p>}
                      </div>
                      <div>
                        <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Contact Number</label>
                        <input
                          type="tel"
                  placeholder="Enter 10-digit number"
                  value={registerContact}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                            setRegisterContact(val);
                          }}
                          className={`w-full px-4 py-3 rounded-lg border-[0.5px] bg-white text-sm focus:outline-none focus:border-[#0000ff] focus:ring-1 focus:ring-[#0000ff] transition-all placeholder:text-gray-400 font-medium text-gray-900 ${fieldErrors.contact ? 'border-red-500' : 'border-gray-200'}`}
                        />
                        {fieldErrors.contact && <p className="text-red-500 text-[12px] mt-1">{fieldErrors.contact}</p>}
                      </div>
                      {authError && <p className="text-sm text-red-500">{authError}</p>}
                      <button
                        type="button"
                        onClick={handleContinueStep2}
                        className="w-full bg-[#0000ff] hover:bg-[#0000cc] active:scale-[0.98] text-white text-sm font-semibold py-3 rounded-lg transition-all"
                      >
                        Continue
                      </button>
                      <div className="text-center text-[13px] text-gray-500 font-medium">
                        Already have an account?{' '}
                        <button type="button" onClick={() => setActiveTab("login")} className="text-[#0000ff] font-semibold hover:underline transition-all">
                          Sign in
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "register" && !showOtpStep && registerStep === 2 && (
                  <div className="animate-[fadeIn_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]">
                    <div className="text-center mb-4">
                      <h2 className="text-lg font-bold text-gray-900">Organization Information</h2>
                      <p className="text-[13px] text-gray-500 font-medium">Complete your registration</p>
                    </div>
                    <form onSubmit={handleProviderRegister} className="space-y-4" noValidate>
                      <div>
                        <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">PAN Number</label>
                        <input
                          type="text"
                  placeholder="Enter PAN Number"
                  value={registerPAN}
                          onChange={(e) => setRegisterPAN(e.target.value)}
                          className={`w-full px-4 py-3 rounded-lg border-[0.5px] bg-white text-sm focus:outline-none focus:border-[#0000ff] focus:ring-1 focus:ring-[#0000ff] transition-all placeholder:text-gray-400 font-medium text-gray-900 ${fieldErrors.pan ? 'border-red-500' : 'border-gray-200'}`}
                        />
                        {fieldErrors.pan && <p className="text-red-500 text-[12px] mt-1">{fieldErrors.pan}</p>}
                      </div>
                      <div>
                        <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Registration Number</label>
                        <input
                          type="text"
placeholder="Enter Registration Number (e.g. XXXX-XXX-XXX)"
                  value={registerNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^A-Za-z0-9]/g, '').slice(0, 10);
                    const parts = [];
                    if (val.length > 0) parts.push(val.slice(0, 4));
                    if (val.length > 4) parts.push(val.slice(4, 7));
                    if (val.length > 7) parts.push(val.slice(7, 10));
                    setRegisterNumber(parts.join('-'));
                  }}
                  className={`w-full px-4 py-3 rounded-lg border-[0.5px] bg-white text-sm focus:outline-none focus:border-[#0000ff] focus:ring-1 focus:ring-[#0000ff] transition-all placeholder:text-gray-400 font-medium text-gray-900 ${fieldErrors.number ? 'border-red-500' : 'border-gray-200'}`}
                />
                {fieldErrors.number && <p className="text-red-500 text-[12px] mt-1">{fieldErrors.number}</p>}
                      </div>
                      <div>
                        <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Website</label>
                        <input
                          type="url"
                  placeholder="https://www.example.com"
                  value={registerWebsite}
                          onChange={(e) => setRegisterWebsite(e.target.value)}
                          className={`w-full px-4 py-3 rounded-lg border-[0.5px] bg-white text-sm focus:outline-none focus:border-[#0000ff] focus:ring-1 focus:ring-[#0000ff] transition-all placeholder:text-gray-400 font-medium text-gray-900 ${fieldErrors.website ? 'border-red-500' : 'border-gray-200'}`}
                        />
                        {fieldErrors.website && <p className="text-red-500 text-[12px] mt-1">{fieldErrors.website}</p>}
                      </div>
                      {authError && <p className="text-sm text-red-500">{authError}</p>}
                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full bg-[#0000ff] hover:bg-[#0000cc] active:scale-[0.98] text-white text-sm font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
                      >
                        {authLoading ? "Submitting..." : "Submit for Verification"}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setRegisterStep(1); clearAuthMessages(); }}
                        className="w-full text-[13px] text-gray-400 hover:text-gray-700 font-semibold py-2 transition-colors flex items-center justify-center gap-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        Back to Basic Info
                      </button>
                    </form>
                  </div>
                )}

                {activeTab === "register" && showOtpStep && (
                  <div className="animate-[fadeIn_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards] text-center py-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-1.5">Check your email</h2>
                    <p className="text-[13px] text-gray-500 mb-6 font-medium px-4">
                      We&apos;ve sent a 6-digit verification code to your email address.
                    </p>

                    <div className="mb-6">
                      <div className="flex justify-center gap-2 sm:gap-2.5 mb-6" onPaste={handleOtpPaste}>
                        {otp.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={(el) => { otpInputRefs.current[idx] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                            className={`w-11 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-lg border-[0.5px] bg-white focus:outline-none focus:border-[#0000ff] focus:ring-1 focus:ring-[#0000ff] transition-all text-gray-900 ${
                              authError ? "border-red-500" : "border-gray-200"
                            }`}
                          />
                        ))}
                      </div>

                      {authError && (
                        <p className="text-sm text-red-500 text-center mt-4">{authError}</p>
                      )}

                      <button
                        type="button"
                        disabled={otp.join("").length !== 6 || authLoading}
                        onClick={handleVerifyOtp}
                        className="w-full bg-[#0000ff] hover:bg-[#0000cc] active:scale-[0.98] text-white text-sm font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
                      >
                        {authLoading ? "Verifying..." : "Verify Code"}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[13px] font-medium py-2 px-1">
                      <span className="text-gray-500">
                        Time limit: <span className="font-bold text-gray-900">{formatTimer(otpTimer)}</span>
                      </span>
                      <button
                        type="button"
                        disabled={otpTimer > 0 || otpResendDisabled}
                        onClick={handleResendOtp}
                        className="text-[#0000ff] font-semibold hover:underline transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:no-underline"
                      >
                        {otpResendDisabled ? "Sending..." : "Resend code"}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => { setShowOtpStep(false); setRegisterStep(2); }}
                      className="mt-6 text-[13px] text-gray-400 hover:text-gray-700 font-semibold transition-colors flex items-center justify-center gap-1 mx-auto"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                      Back to Registration
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <style>{`
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}</style>
  </>);
};

export default ScholarshipProviderZone;
