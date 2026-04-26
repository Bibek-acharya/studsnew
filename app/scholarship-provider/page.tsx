"use client";

import React, { useEffect, useState, useRef } from "react";
import { apiService } from "../../services/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, Eye, EyeOff, Loader2 } from "lucide-react";

import ScholarshipProviderDashboard from "@/components/ScholarshipProvider/ScholarshipProviderDashboard";

interface ScholarshipProviderZoneProps {
  onNavigate?: (view: any, data?: any) => void;
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
  const [activeTab, setActiveTab] = useState<"register" | "login">("register");
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

  // OTP state
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(120);
  const [otpResendDisabled, setOtpResendDisabled] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const token = apiService.getScholarshipProviderToken();
    const user = apiService.getScholarshipProviderUser();
    if (token && user) {
      setCurrentView("dashboard");
    }
  }, []);

  useEffect(() => {
    if (showOtpStep) {
      const interval = setInterval(() => {
        setOtpTimer((t) => {
          if (t <= 1) { clearInterval(interval); return 0; }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showOtpStep]);

  const clearAuthMessages = () => {
    setAuthError(null);
    setAuthSuccess(null);
    setFieldErrors({});
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^\d{10}$/.test(phone);

  const handleProviderLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearAuthMessages();

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setAuthError("Email and password are required.");
      return;
    }

    setAuthLoading(true);
    try {
      const response = await apiService.scholarshipProviderLogin(
        loginEmail.trim(),
        loginPassword,
      );

      const token = response.data?.token;
      const user = response.data?.user;

      if (!token || !user) throw new Error("Invalid login response from server");

      apiService.setScholarshipProviderToken(token);
      apiService.setScholarshipProviderUser(user);
      setCurrentView("dashboard");
      setAuthSuccess("Login successful. Connecting to your dashboard...");
      setLoginPassword("");
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : "Login failed. Please try again.",
      );
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

    if (!registerNumber.trim() || !registerPAN.trim() || !registerWebsite.trim()) {
      setAuthError("Please fill all required fields.");
      return;
    }

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

      setAuthSuccess("Verification code sent to your email.");
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

  if (currentView === "dashboard") {
    return <ScholarshipProviderDashboard onLogout={() => setCurrentView("landing")} />;
  }

  if (currentView === "pending-approval") {
    return (
      <div className="min-h-screen bg-[#fcfcfc] font-sans flex items-center justify-center p-4">
        <div className="bg-white max-w-[420px] w-full rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-6 sm:p-8 text-center">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <BadgeCheck className="w-16 h-16 text-green-500 mx-auto mb-5" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted Successfully!</h2>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mt-6 mb-6 text-left">
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-blue mt-0.5 flex-shrink-0">
                <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
              </svg>
              <p className="text-[14px] text-gray-700 font-medium leading-relaxed">
                Your account is currently under review by our admin team. You will receive an email notification with your login credentials once your account is approved.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => { setCurrentView("landing"); setActiveTab("login"); }}
            className="w-full bg-brand-blue hover:bg-brand-hover cursor-pointer text-white font-bold py-3 rounded-md transition-colors"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden max-w-350 mx-auto">
      <style>{`
        input[type="password"] { letter-spacing: 0.2em; }
        input[type="password"]::placeholder { letter-spacing: normal; font-size: 15px; font-weight: 500; }
      `}</style>

      <div className="bg-white min-h-screen flex flex-col relative">
        <main className="flex-1 flex items-center justify-center w-full pb-12 lg:pb-20 pt-24">
          <div className="max-w-350 w-full mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
            <div className="flex-1 text-black w-full max-w-2xl text-center lg:text-left pt-6 lg:pt-0">
              <h1 className="text-4xl lg:text-[4rem] font-bold leading-[1.15] mb-6">
                Empower the Next Generation<span className="text-brand-blue"> – List Your Scholarships</span>
              </h1>
              <p className="text-gray-600 text-lg lg:text-xl leading-relaxed max-w-lg mx-auto lg:mx-0 font-semibold">
                Join Nepal&rsquo;s largest scholarship network and connect with deserving students nationwide.
              </p>
            </div>

            <div className="w-full max-w-115">
              <div className="bg-white rounded-md p-5 sm:p-6 mt-6 relative text-gray-800 animate-in fade-in slide-in-from-bottom-4 duration-500 border border-gray-200">
                <div className="flex p-1 bg-[#F1F3F5] rounded-md mb-5">
                  <button
                    onClick={() => { setActiveTab("register"); setShowOtpStep(false); }}
                    className={`flex-1 py-3 text-[16px] font-bold transition-all rounded-md ${
                      activeTab === "register"
                        ? "text-white bg-brand-blue z-10 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Register
                  </button>
                  <button
                    onClick={() => { setActiveTab("login"); setShowOtpStep(false); }}
                    className={`flex-1 py-3 text-[16px] font-bold transition-all rounded-md ${
                      activeTab === "login"
                        ? "text-white bg-brand-blue z-10 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Log in
                  </button>
                </div>

                {activeTab === "login" && (
                  <div className="animate-in fade-in duration-300">
                    <form onSubmit={handleProviderLogin} className="space-y-3 mt-4">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full px-4 py-2.5 border border-[#D5DCE8] rounded-md focus:border-brand-blue outline-none"
                      />
                      <div className="relative">
                        <input
                          type={showLoginPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="w-full px-4 py-2.5 pr-12 border border-[#D5DCE8] rounded-md focus:border-brand-blue outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <div className="flex justify-end pt-1">
                        <Link
                          href="#"
                          className="text-[15px] text-brand-blue font-semibold hover:text-brand-hover transition-colors"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      {authError && <p className="text-sm text-red-500">{authError}</p>}
                      {authSuccess && <p className="text-sm text-emerald-600">{authSuccess}</p>}
                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full bg-brand-blue hover:bg-brand-hover cursor-pointer text-white font-bold py-3 rounded-md transition-colors disabled:opacity-50"
                      >
                        {authLoading ? "Logging in..." : "Log in"}
                      </button>

                      <div className="flex items-center my-6">
                        <div className="grow border-t border-gray-200"></div>
                        <span className="px-4 text-xs text-gray-400 font-semibold uppercase">Or</span>
                        <div className="grow border-t border-gray-200"></div>
                      </div>

                      <button
                        type="button"
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-[15px] font-semibold text-gray-700 py-3.5 rounded-md cursor-pointer hover:text-brand-blue transition-all"
                      >
                        <Image
                          src="/google-icon.svg"
                          alt="Google"
                          width={18}
                          height={18}
                          className="w-4.5 h-4.5"
                        />
                        Log in with Google
                      </button>
                    </form>
                  </div>
                )}

                {activeTab === "register" && !showOtpStep && registerStep === 1 && (
                  <div className="animate-in fade-in duration-300">
                    <div className="text-center mb-4 mt-4">
                      <h2 className="text-lg font-bold text-gray-900">Create Account</h2>
                      <p className="text-[13px] text-gray-500 font-medium">Enter your organization details</p>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <input
                          type="text"
                          placeholder="Organization name"
                          value={registerProviderName}
                          onChange={(e) => setRegisterProviderName(e.target.value)}
                          className={`w-full px-4 py-2.5 border rounded-md focus:border-brand-blue outline-none ${fieldErrors.providerName ? 'border-red-500' : 'border-[#D5DCE8]'}`}
                        />
                        {fieldErrors.providerName && <p className="text-xs text-red-500 mt-1">{fieldErrors.providerName}</p>}
                      </div>
                      <div>
                        <input
                          type="email"
                          placeholder="Official email"
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          className={`w-full px-4 py-2.5 border rounded-md focus:border-brand-blue outline-none ${fieldErrors.email ? 'border-red-500' : 'border-[#D5DCE8]'}`}
                        />
                        {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
                      </div>
                      <div>
                        <input
                          type="tel"
                          placeholder="Contact number (10-digit)"
                          value={registerContact}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                            setRegisterContact(val);
                          }}
                          className={`w-full px-4 py-2.5 border rounded-md focus:border-brand-blue outline-none ${fieldErrors.contact ? 'border-red-500' : 'border-[#D5DCE8]'}`}
                        />
                        {fieldErrors.contact && <p className="text-xs text-red-500 mt-1">{fieldErrors.contact}</p>}
                      </div>
                      {authError && <p className="text-sm text-red-500">{authError}</p>}
                      <button
                        type="button"
                        onClick={handleContinueStep2}
                        className="w-full bg-brand-blue hover:bg-brand-hover cursor-pointer text-white font-bold py-3 rounded-md transition-colors"
                      >
                        Continue
                      </button>
                      <div className="text-center text-[13px] text-gray-500 font-medium">
                        Already have an account?{' '}
                        <button type="button" onClick={() => setActiveTab("login")} className="text-brand-blue font-semibold hover:underline">
                          Sign in
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "register" && !showOtpStep && registerStep === 2 && (
                  <div className="animate-in fade-in duration-300">
                    <div className="text-center mb-4 mt-4">
                      <h2 className="text-lg font-bold text-gray-900">Organization Information</h2>
                      <p className="text-[13px] text-gray-500 font-medium">Complete your registration</p>
                    </div>
                    <form onSubmit={handleProviderRegister} className="space-y-3">
                      <input
                        type="text"
                        placeholder="PAN number"
                        value={registerPAN}
                        onChange={(e) => setRegisterPAN(e.target.value)}
                        className="w-full px-4 py-2.5 border border-[#D5DCE8] rounded-md focus:border-brand-blue outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Registration number"
                        value={registerNumber}
                        onChange={(e) => setRegisterNumber(e.target.value)}
                        className="w-full px-4 py-2.5 border border-[#D5DCE8] rounded-md focus:border-brand-blue outline-none"
                      />
                      <input
                        type="url"
                        placeholder="Website URL"
                        value={registerWebsite}
                        onChange={(e) => setRegisterWebsite(e.target.value)}
                        className="w-full px-4 py-2.5 border border-[#D5DCE8] rounded-md focus:border-brand-blue outline-none"
                      />
                      {authError && <p className="text-sm text-red-500">{authError}</p>}
                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full bg-brand-blue hover:bg-brand-hover cursor-pointer text-white font-bold py-3 rounded-md transition-colors disabled:opacity-50"
                      >
                        {authLoading ? "Submitting..." : "Submit for Verification"}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setRegisterStep(1); clearAuthMessages(); }}
                        className="w-full text-[13px] text-gray-400 hover:text-gray-700 font-semibold py-2 transition-colors"
                      >
                        Back to Basic Info
                      </button>
                    </form>
                  </div>
                )}

                {activeTab === "register" && showOtpStep && (
                  <div className="animate-in fade-in duration-300 mt-4">
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Verify Your Email</h3>
                      <p className="text-sm text-gray-500">
                        Enter the 6-digit code sent to <span className="font-semibold text-gray-700">{registerEmail}</span>
                      </p>
                    </div>

                    <div className="flex gap-3 justify-center" onPaste={handleOtpPaste}>
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
                          className={`w-12 h-14 text-center text-xl font-bold text-gray-900 border border-gray-200 rounded-md focus:outline-none focus:ring-0 transition-colors bg-white ${
                            authError ? "border-red-500 focus:border-red-500" : "focus:border-brand-blue"
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
                      className="w-full mt-6 bg-brand-blue hover:bg-brand-hover text-white font-bold py-3 rounded-md transition-colors disabled:opacity-50"
                    >
                      {authLoading ? "Verifying..." : "Verify Code"}
                    </button>

                    <div className="flex justify-between items-center mt-4 text-sm">
                      <span className="text-gray-500">
                        Code expires in{" "}
                        <span className="font-semibold text-gray-800">{formatTimer(otpTimer)}</span>
                      </span>
                      <button
                        type="button"
                        disabled={otpTimer > 0 || otpResendDisabled}
                        onClick={handleResendOtp}
                        className="text-brand-blue font-semibold hover:underline disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed transition-colors"
                      >
                        {otpResendDisabled ? "Sending..." : "Resend Code"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ScholarshipProviderZone;
