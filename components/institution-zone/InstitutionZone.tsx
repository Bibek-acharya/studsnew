"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import InstitutionHeader from "./InstitutionHeader";
import { Eye, EyeOff, ChevronDown, BadgeCheck, Loader2 } from "lucide-react";
import { apiService } from "@/services/api";
import {
  NEPAL_PROVINCES,
  NEPAL_DISTRICTS,
  NEPAL_LOCAL_BODIES,
} from "@/lib/location-data";

function formatTimer(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function InstitutionZone() {
  const [view, setView] = useState<"login" | "register" | "forgotPassword">("login");
  const [currentView, setCurrentView] = useState<"landing" | "pending-approval">("landing");

  const [rememberMe, setRememberMe] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [fpStep, setFpStep] = useState<"email" | "otp" | "newPassword" | "success">("email");
  const [fpEmail, setFpEmail] = useState("");
  const [fpOtp, setFpOtp] = useState("");
  const [fpNewPassword, setFpNewPassword] = useState("");
  const [fpConfirmPassword, setFpConfirmPassword] = useState("");
  const [fpError, setFpError] = useState<string | null>(null);
  const [fpSuccess, setFpSuccess] = useState<string | null>(null);
  const [fpLoading, setFpLoading] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginFieldErrors, setLoginFieldErrors] = useState<
    Record<string, string>
  >({});
  const [authLoading, setAuthLoading] = useState(false);

  const [registerStep, setRegisterStep] = useState(1);
  const [schoolName, setSchoolName] = useState("");
  const [officialEmail, setOfficialEmail] = useState("");
  const [officialContact, setOfficialContact] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedLocalBody, setSelectedLocalBody] = useState("");
  const [organizationType, setOrganizationType] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [website, setWebsite] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactPersonDesignation, setContactPersonDesignation] = useState("");
  const [contactPersonPhone, setContactPersonPhone] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(120);
  const [otpResendDisabled, setOtpResendDisabled] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();

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

  const districts = selectedProvince
    ? NEPAL_DISTRICTS[selectedProvince as keyof typeof NEPAL_DISTRICTS] || []
    : [];
  const localBodies = selectedDistrict
    ? NEPAL_LOCAL_BODIES[
        selectedDistrict as keyof typeof NEPAL_LOCAL_BODIES
      ] || []
    : [];

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^\d{10}$/.test(phone);

  const clearErrors = () => {
    setFieldErrors({});
    setLoginFieldErrors({});
    setAuthError(null);
    setAuthSuccess(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    const errors: Record<string, string> = {};
    if (!loginEmail.trim()) errors.email = "Email is required.";
    if (!loginPassword.trim()) errors.password = "Password is required.";
    setLoginFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setAuthLoading(true);
    try {
      const response = await apiService.institutionLogin(
        loginEmail.trim(),
        loginPassword
      );
      const token = (response as any).data?.token || (response as any).token;
      const user = (response as any).data?.user || (response as any).user;
      const preferencesCompleted =
        (response as any).data?.preferences_completed ??
        (response as any).preferences_completed ??
        false;
      if (token) {
        localStorage.setItem("institutionToken", token);
      }
      if (user) {
        localStorage.setItem("institutionUser", JSON.stringify(user));
      }
      if (!preferencesCompleted) {
        router.push("/institution-zone/onboarding");
      } else {
        router.push("/institution-zone/dashboard");
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Login failed. Please try again.";
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleFpSendOtp = async () => {
    if (!fpEmail.trim()) { setFpError("Email is required"); return; }
    setFpLoading(true);
    setFpError(null);
    try {
      await apiService.institutionSendOTP(fpEmail.trim(), "password_reset");
      setFpStep("otp");
    } catch (e: any) {
      setFpError(e?.message || "Failed to send OTP");
    } finally {
      setFpLoading(false);
    }
  };

  const handleFpVerifyOtp = () => {
    if (fpOtp.length !== 6) { setFpError("Please enter a valid 6-digit OTP"); return; }
    setFpStep("newPassword");
  };

  const handleFpResetPassword = async () => {
    if (fpNewPassword.length < 6) { setFpError("Password must be at least 6 characters"); return; }
    if (fpNewPassword !== fpConfirmPassword) { setFpError("Passwords do not match"); return; }
    setFpLoading(true);
    setFpError(null);
    try {
      await apiService.institutionResetPassword(fpEmail.trim(), fpOtp, fpNewPassword);
      setFpStep("success");
      setFpSuccess("Password reset successfully!");
      setTimeout(() => { setView("login"); setFpStep("email"); setFpEmail(""); setFpOtp(""); setFpNewPassword(""); setFpConfirmPassword(""); }, 2000);
    } catch (e: any) {
      setFpError(e?.message || "Failed to reset password");
    } finally {
      setFpLoading(false);
    }
  };

  const handleStep1Continue = () => {
    clearErrors();
    const errors: Record<string, string> = {};
    if (!schoolName.trim()) errors.schoolName = "School name is required.";
    if (!validateEmail(officialEmail.trim()))
      errors.officialEmail = "Please enter a valid email address.";
    if (!validatePhone(officialContact.trim()))
      errors.officialContact = "Please enter a valid 10-digit phone number.";
    setFieldErrors(errors);
    if (Object.keys(errors).length === 0) setRegisterStep(2);
  };

  const handleStep2Continue = () => {
    clearErrors();
    const errors: Record<string, string> = {};
    if (!selectedProvince) errors.province = "Please select a province.";
    if (!selectedDistrict) errors.district = "Please select a district.";
    if (!selectedLocalBody) errors.localBody = "Please select a local body.";
    setFieldErrors(errors);
    if (Object.keys(errors).length === 0) setRegisterStep(3);
  };

  const handleStep3Continue = () => {
    clearErrors();
    const errors: Record<string, string> = {};
    if (!organizationType)
      errors.organizationType = "Please select organization type.";
    if (!panNumber.trim()) errors.panNumber = "PAN number is required.";
    else if (!/^\d{9}$/.test(panNumber))
      errors.panNumber = "PAN must be exactly 9 digits.";
    if (!registrationNumber.trim())
      errors.registrationNumber = "Registration number is required.";
    else if (
      !/^[A-Za-z0-9]{4}-[A-Za-z0-9]{3}-[A-Za-z0-9]{3}$/.test(
        registrationNumber
      )
    )
      errors.registrationNumber = "Format must be XXXX-XXX-XXX.";
    if (!website.trim()) errors.website = "Website is required.";
    else if (!/^https?:\/\/.+\..+/.test(website.trim()))
      errors.website = "Please enter a valid URL (e.g. https://www.example.com).";
    setFieldErrors(errors);
    if (Object.keys(errors).length === 0) setRegisterStep(4);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    const errors: Record<string, string> = {};
    if (!contactPerson.trim())
      errors.contactPerson = "Contact person name is required.";
    if (!contactPersonDesignation.trim())
      errors.contactPersonDesignation = "Designation is required.";
    if (!validatePhone(contactPersonPhone.trim()))
      errors.contactPersonPhone =
        "Please enter a valid 10-digit phone number.";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setAuthLoading(true);
    try {
      await apiService.institutionRegister({
        institution_name: schoolName.trim(),
        registration_number: registrationNumber,
        email: officialEmail.trim(),
        contact_number: officialContact,
        province: selectedProvince,
        district: selectedDistrict,
        local_body: selectedLocalBody,
        organization_type: organizationType,
        pan_number: panNumber,
        website_url: website,
        contact_person: contactPerson.trim(),
        contact_person_designation: contactPersonDesignation.trim(),
        contact_person_phone: contactPersonPhone,
      });

      await apiService.sendOTP(officialEmail.trim(), "verification");

      setShowOtpStep(true);
      setOtpTimer(120);
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : "Registration failed. Please try again."
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
      await apiService.verifyOTP(officialEmail.trim(), otpCode);
      setCurrentView("pending-approval");
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : "Verification failed. Please try again."
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setOtpResendDisabled(true);
    try {
      await apiService.sendOTP(officialEmail.trim(), "verification");
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

  const inputClass = (hasError?: boolean) =>
    `w-full px-4 py-3 rounded-lg border-[0.5px] bg-white text-sm focus:outline-none focus:border-[#0000ff] focus:ring-1 focus:ring-[#0000ff] transition-all placeholder:text-gray-400 font-medium text-gray-900 ${
      hasError ? "border-red-500" : "border-gray-200"
    }`;

  const selectClass = (hasError?: boolean) =>
    `w-full px-4 py-3 rounded-lg border-[0.5px] bg-white text-sm focus:outline-none focus:border-[#0000ff] focus:ring-1 focus:ring-[#0000ff] transition-all text-gray-900 appearance-none cursor-pointer ${
      hasError ? "border-red-500" : "border-gray-200"
    }`;

  const labelClass = "block text-[13px] font-semibold text-gray-700 mb-1.5";
  const btnClass =
    "w-full bg-[#0000ff] hover:bg-[#0000cc] active:scale-[0.98] text-white text-sm font-semibold py-3 rounded-lg transition-all";

  if (currentView === "pending-approval") {
    return (
      <div className="min-h-screen font-sans bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
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
            onClick={() => { setCurrentView("landing"); setView("login"); }}
            className="w-full bg-[#0000ff] hover:bg-[#0000cc] active:scale-[0.98] text-white text-sm font-semibold py-3 rounded-lg transition-all"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans selection:bg-[#0000ff] selection:text-white bg-white">
      <InstitutionHeader />

      <div className="flex items-center justify-center px-4 md:px-8 lg:px-12 pb-4 md:pb-6 pt-36 lg:pt-44">
        <div className="w-full max-w-[1400px] bg-[#0000ff] rounded-2xl p-6 sm:p-10 lg:py-10 lg:px-16 xl:px-20 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center w-full">
            <div className="order-2 lg:order-1 flex flex-col justify-center text-center lg:text-left space-y-5 mx-auto lg:mx-0 max-w-xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl leading-[1.15] font-extrabold tracking-tight text-white">
                Simplify Admissions,<br />
                Applications
                <span className="text-blue-200">
                  {" "}
                  & Student Engagement{" "}
                </span>
              </h1>
              <p className="text-base sm:text-lg text-blue-50/90 leading-relaxed font-medium">
                Promote your programs, facilities, and opportunities to students
                across Nepal and beyond.
              </p>
            </div>

            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="w-full max-w-md">
                <div className="bg-white border border-gray-200 rounded-xl p-8 sm:p-10 shadow-lg">
                  <a href="/" className="flex justify-center mb-6">
                    <Image
                      src="/studsphere.png"
                      alt="StudSphere"
                      width={160}
                      height={42}
                      className="h-10 w-auto"
                    />
                  </a>

                  {view === "login" && (
                    <div className="animate-[fadeIn_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]">
                      <div className="text-center mb-5">
                        <h1 className="text-xl font-bold text-gray-900 mb-1.5">
                          Sign in to StudSphere
                        </h1>
                        <p className="text-[13px] text-gray-500 font-medium">
                          Welcome back! Enter your details to access your
                          dashboard.
                        </p>
                      </div>
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                          <label className={labelClass}>Email</label>
                          <input
                            type="email"
                            placeholder="Enter your Email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            className={inputClass(!!loginFieldErrors.email)}
                          />
                          {loginFieldErrors.email && (
                            <p className="text-red-500 text-[12px] mt-1">
                              {loginFieldErrors.email}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className={labelClass}>Password</label>
                          <div className="relative">
                            <input
                              type={showLoginPassword ? "text" : "password"}
                              placeholder="Enter Password"
                              value={loginPassword}
                              onChange={(e) =>
                                setLoginPassword(e.target.value)
                              }
                              className={`${inputClass(
                                !!loginFieldErrors.password
                              )} pr-12`}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowLoginPassword(!showLoginPassword)
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0000ff] transition-colors"
                            >
                              {showLoginPassword ? (
                                <Eye size={18} />
                              ) : (
                                <EyeOff size={18} />
                              )}
                            </button>
                          </div>
                          {loginFieldErrors.password && (
                            <p className="text-red-500 text-[12px] mt-1">
                              {loginFieldErrors.password}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={rememberMe}
                              onChange={() => setRememberMe(!rememberMe)}
                              className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-[#0000ff]"
                            />
                            <span className="text-[13px] text-gray-500 font-medium group-hover:text-gray-800 transition-colors">
                              Remember me
                            </span>
                          </label>
                          <button
                            type="button"
                            onClick={() => { setView("forgotPassword"); setFpStep("email"); setFpError(null); setFpSuccess(null); }}
                            className="text-[13px] font-semibold text-[#0000ff] hover:text-[#0000cc] hover:underline transition-colors"
                          >
                            Forgot password?
                          </button>
                        </div>
                        {authError && (
                          <p className="text-sm text-red-500">{authError}</p>
                        )}
                        <button
                          type="submit"
                          disabled={authLoading}
                          className={`${btnClass} disabled:opacity-50`}
                        >
                          {authLoading ? "Signing in..." : "Sign in"}
                        </button>
                      </form>
                      <div className="mt-5 text-center text-[13px] text-gray-500 font-medium">
                        Don&apos;t have an account?{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setView("register");
                            setRegisterStep(1);
                            clearErrors();
                          }}
                          className="text-[#0000ff] font-semibold hover:underline transition-all"
                        >
                          Register here
                        </button>
                      </div>
                    </div>
                  )}

                  {view === "forgotPassword" && (
                    <div className="animate-[fadeIn_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]">
                      <div className="text-center mb-5">
                        <h1 className="text-xl font-bold text-gray-900 mb-1.5">
                          Reset Password
                        </h1>
                        <p className="text-[13px] text-gray-500 font-medium">
                          {fpStep === "email" && "Enter your email to receive a reset code"}
                          {fpStep === "otp" && "Enter the 6-digit code sent to your email"}
                          {fpStep === "newPassword" && "Choose a new password"}
                          {fpStep === "success" && "Password reset successful!"}
                        </p>
                      </div>

                      {fpError && <p className="text-sm text-red-500 text-center mb-4 bg-red-50 rounded-lg px-4 py-3">{fpError}</p>}
                      {fpSuccess && <p className="text-sm text-green-700 text-center mb-4 bg-green-50 rounded-lg px-4 py-3">{fpSuccess}</p>}

                      {fpStep === "email" && (
                        <div className="space-y-4">
                          <input type="email" placeholder="Enter your email" value={fpEmail}
                            onChange={e => setFpEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:border-[#0000ff] focus:ring-1 focus:ring-[#0000ff] outline-none transition-colors" />
                          <button type="button" onClick={handleFpSendOtp} disabled={fpLoading}
                            className="w-full py-3 bg-[#0000ff] text-white font-semibold rounded-xl hover:bg-[#0000cc] transition-colors disabled:opacity-50">
                            {fpLoading ? "Sending..." : "Send Reset Code"}
                          </button>
                        </div>
                      )}

                      {fpStep === "otp" && (
                        <div className="space-y-4">
                          <input type="text" maxLength={6} placeholder="Enter 6-digit OTP" value={fpOtp}
                            onChange={e => setFpOtp(e.target.value.replace(/\D/g, ""))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-center text-2xl tracking-widest focus:border-[#0000ff] focus:ring-1 focus:ring-[#0000ff] outline-none transition-colors" />
                          <button type="button" onClick={handleFpVerifyOtp} disabled={fpOtp.length !== 6}
                            className="w-full py-3 bg-[#0000ff] text-white font-semibold rounded-xl hover:bg-[#0000cc] transition-colors disabled:opacity-50">
                            Verify Code
                          </button>
                        </div>
                      )}

                      {fpStep === "newPassword" && (
                        <div className="space-y-4">
                          <input type="password" placeholder="New Password (min 6 chars)" value={fpNewPassword}
                            onChange={e => setFpNewPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:border-[#0000ff] focus:ring-1 focus:ring-[#0000ff] outline-none transition-colors" />
                          <input type="password" placeholder="Confirm New Password" value={fpConfirmPassword}
                            onChange={e => setFpConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:border-[#0000ff] focus:ring-1 focus:ring-[#0000ff] outline-none transition-colors" />
                          <button type="button" onClick={handleFpResetPassword} disabled={fpLoading}
                            className="w-full py-3 bg-[#0000ff] text-white font-semibold rounded-xl hover:bg-[#0000cc] transition-colors disabled:opacity-50">
                            {fpLoading ? "Resetting..." : "Reset Password"}
                          </button>
                        </div>
                      )}

                      {fpStep === "success" && (
                        <button type="button" onClick={() => { setView("login"); setFpStep("email"); }}
                          className="w-full py-3 bg-[#0000ff] text-white font-semibold rounded-xl hover:bg-[#0000cc] transition-colors">
                          Back to Login
                        </button>
                      )}

                      <div className="mt-5 text-center text-[13px] text-gray-500 font-medium">
                        <button type="button" onClick={() => { setView("login"); setFpStep("email"); setFpError(null); }}
                          className="text-[#0000ff] font-semibold hover:underline transition-all">
                          Back to Sign In
                        </button>
                      </div>
                    </div>
                  )}

                  {view === "register" && !showOtpStep && registerStep === 1 && (
                    <div className="animate-[fadeIn_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]">
                      <div className="text-center mb-4">
                        <h2 className="text-lg font-bold text-gray-900">
                          Create Account
                        </h2>
                        <p className="text-[13px] text-gray-500 font-medium">
                          Enter your institution details
                        </p>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className={labelClass}>School Name</label>
                          <input
                            type="text"
                            placeholder="Enter School Name"
                            value={schoolName}
                            onChange={(e) => setSchoolName(e.target.value)}
                            className={inputClass(!!fieldErrors.schoolName)}
                          />
                          {fieldErrors.schoolName && (
                            <p className="text-red-500 text-[12px] mt-1">
                              {fieldErrors.schoolName}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className={labelClass}>Official Email</label>
                          <input
                            type="email"
                            placeholder="Enter Official Email"
                            value={officialEmail}
                            onChange={(e) => setOfficialEmail(e.target.value)}
                            className={inputClass(!!fieldErrors.officialEmail)}
                          />
                          {fieldErrors.officialEmail && (
                            <p className="text-red-500 text-[12px] mt-1">
                              {fieldErrors.officialEmail}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className={labelClass}>
                            Official Contact Number
                          </label>
                          <input
                            type="tel"
                            placeholder="Enter 10-digit number"
                            value={officialContact}
                            onChange={(e) => {
                              const val = e.target.value
                                .replace(/[^0-9]/g, "")
                                .slice(0, 10);
                              setOfficialContact(val);
                            }}
                            className={inputClass(
                              !!fieldErrors.officialContact
                            )}
                          />
                          {fieldErrors.officialContact && (
                            <p className="text-red-500 text-[12px] mt-1">
                              {fieldErrors.officialContact}
                            </p>
                          )}
                        </div>
                        {authError && (
                          <p className="text-sm text-red-500">{authError}</p>
                        )}
                        <button
                          type="button"
                          onClick={handleStep1Continue}
                          className={btnClass}
                        >
                          Continue
                        </button>
                        <div className="text-center text-[13px] text-gray-500 font-medium">
                          Already have an account?{" "}
                          <button
                            type="button"
                            onClick={() => {
                              setView("login");
                              clearErrors();
                            }}
                            className="text-[#0000ff] font-semibold hover:underline transition-all"
                          >
                            Sign in
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {view === "register" && !showOtpStep && registerStep === 2 && (
                    <div className="animate-[fadeIn_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]">
                      <div className="text-center mb-4">
                        <h2 className="text-lg font-bold text-gray-900">
                          Institution Address
                        </h2>
                        <p className="text-[13px] text-gray-500 font-medium">
                          Select your institution&apos;s location
                        </p>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className={labelClass}>Province</label>
                          <div className="relative">
                            <select
                              value={selectedProvince}
                              onChange={(e) => {
                                setSelectedProvince(e.target.value);
                                setSelectedDistrict("");
                                setSelectedLocalBody("");
                              }}
                              className={selectClass(!!fieldErrors.province)}
                            >
                              <option value="">Select Province</option>
                              {NEPAL_PROVINCES.map((p) => (
                                <option key={p} value={p}>
                                  {p}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                          {fieldErrors.province && (
                            <p className="text-red-500 text-[12px] mt-1">
                              {fieldErrors.province}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className={labelClass}>District</label>
                          <div className="relative">
                            <select
                              value={selectedDistrict}
                              onChange={(e) => {
                                setSelectedDistrict(e.target.value);
                                setSelectedLocalBody("");
                              }}
                              className={selectClass(!!fieldErrors.district)}
                              disabled={!selectedProvince}
                            >
                              <option value="">Select District</option>
                              {districts.map((d) => (
                                <option key={d} value={d}>
                                  {d}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                          {fieldErrors.district && (
                            <p className="text-red-500 text-[12px] mt-1">
                              {fieldErrors.district}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className={labelClass}>Local Body</label>
                          <div className="relative">
                            <select
                              value={selectedLocalBody}
                              onChange={(e) =>
                                setSelectedLocalBody(e.target.value)
                              }
                              className={selectClass(!!fieldErrors.localBody)}
                              disabled={!selectedDistrict}
                            >
                              <option value="">Select Local Body</option>
                              {localBodies.map((lb) => (
                                <option key={lb.name} value={lb.name}>
                                  {lb.name}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                          {fieldErrors.localBody && (
                            <p className="text-red-500 text-[12px] mt-1">
                              {fieldErrors.localBody}
                            </p>
                          )}
                        </div>
                        {authError && (
                          <p className="text-sm text-red-500">{authError}</p>
                        )}
                        <button
                          type="button"
                          onClick={handleStep2Continue}
                          className={btnClass}
                        >
                          Continue
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRegisterStep(1);
                            clearErrors();
                          }}
                          className="w-full text-[13px] text-gray-400 hover:text-gray-700 font-semibold py-2 transition-colors flex items-center justify-center gap-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m15 18-6-6 6-6" />
                          </svg>
                          Back to Basic Info
                        </button>
                      </div>
                    </div>
                  )}

                  {view === "register" && !showOtpStep && registerStep === 3 && (
                    <div className="animate-[fadeIn_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]">
                      <div className="text-center mb-4">
                        <h2 className="text-lg font-bold text-gray-900">
                          Institution Information
                        </h2>
                        <p className="text-[13px] text-gray-500 font-medium">
                          Complete your registration details
                        </p>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className={labelClass}>
                            Organization Type
                          </label>
                          <div className="relative">
                            <select
                              value={organizationType}
                              onChange={(e) =>
                                setOrganizationType(e.target.value)
                              }
                              className={selectClass(
                                !!fieldErrors.organizationType
                              )}
                            >
                              <option value="">Select Organization Type</option>
                              <option value="Private">Private</option>
                              <option value="Public">Public</option>
                              <option value="Community">Community</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                          {fieldErrors.organizationType && (
                            <p className="text-red-500 text-[12px] mt-1">
                              {fieldErrors.organizationType}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className={labelClass}>PAN Number</label>
                          <input
                            type="text"
                            placeholder="Enter 9-digit PAN Number"
                            value={panNumber}
                            onChange={(e) => {
                              const val = e.target.value
                                .replace(/[^0-9]/g, "")
                                .slice(0, 9);
                              setPanNumber(val);
                            }}
                            className={inputClass(!!fieldErrors.panNumber)}
                          />
                          {fieldErrors.panNumber && (
                            <p className="text-red-500 text-[12px] mt-1">
                              {fieldErrors.panNumber}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className={labelClass}>
                            Registration Number
                          </label>
                          <input
                            type="text"
                            placeholder="XXXX-XXX-XXX"
                            value={registrationNumber}
                            onChange={(e) => {
                              const val = e.target.value
                                .replace(/[^A-Za-z0-9]/g, "")
                                .slice(0, 10);
                              const parts: string[] = [];
                              if (val.length > 0) parts.push(val.slice(0, 4));
                              if (val.length > 4) parts.push(val.slice(4, 7));
                              if (val.length > 7) parts.push(val.slice(7, 10));
                              setRegistrationNumber(parts.join("-"));
                            }}
                            className={inputClass(
                              !!fieldErrors.registrationNumber
                            )}
                          />
                          {fieldErrors.registrationNumber && (
                            <p className="text-red-500 text-[12px] mt-1">
                              {fieldErrors.registrationNumber}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className={labelClass}>Website</label>
                          <input
                            type="url"
                            placeholder="https://www.example.com"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            className={inputClass(!!fieldErrors.website)}
                          />
                          {fieldErrors.website && (
                            <p className="text-red-500 text-[12px] mt-1">
                              {fieldErrors.website}
                            </p>
                          )}
                        </div>
                        {authError && (
                          <p className="text-sm text-red-500">{authError}</p>
                        )}
                        <button
                          type="button"
                          onClick={handleStep3Continue}
                          className={btnClass}
                        >
                          Continue
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRegisterStep(2);
                            clearErrors();
                          }}
                          className="w-full text-[13px] text-gray-400 hover:text-gray-700 font-semibold py-2 transition-colors flex items-center justify-center gap-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m15 18-6-6 6-6" />
                          </svg>
                          Back to Address
                        </button>
                      </div>
                    </div>
                  )}

                  {view === "register" && !showOtpStep && registerStep === 4 && (
                    <div className="animate-[fadeIn_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]">
                      <div className="text-center mb-4">
                        <h2 className="text-lg font-bold text-gray-900">
                          Contact Person Details
                        </h2>
                        <p className="text-[13px] text-gray-500 font-medium">
                          Provide contact person information
                        </p>
                      </div>
                      <form
                        onSubmit={handleRegister}
                        className="space-y-4"
                        noValidate
                      >
                        <div>
                          <label className={labelClass}>
                            Contact Person Name
                          </label>
                          <input
                            type="text"
                            placeholder="Enter Contact Person Name"
                            value={contactPerson}
                            onChange={(e) => setContactPerson(e.target.value)}
                            className={inputClass(!!fieldErrors.contactPerson)}
                          />
                          {fieldErrors.contactPerson && (
                            <p className="text-red-500 text-[12px] mt-1">
                              {fieldErrors.contactPerson}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className={labelClass}>
                            Contact Person&apos;s Designation
                          </label>
                          <input
                            type="text"
                            placeholder="Enter Designation"
                            value={contactPersonDesignation}
                            onChange={(e) =>
                              setContactPersonDesignation(e.target.value)
                            }
                            className={inputClass(
                              !!fieldErrors.contactPersonDesignation
                            )}
                          />
                          {fieldErrors.contactPersonDesignation && (
                            <p className="text-red-500 text-[12px] mt-1">
                              {fieldErrors.contactPersonDesignation}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className={labelClass}>
                            Contact Person&apos;s Phone Number
                          </label>
                          <input
                            type="tel"
                            placeholder="Enter 10-digit number"
                            value={contactPersonPhone}
                            onChange={(e) => {
                              const val = e.target.value
                                .replace(/[^0-9]/g, "")
                                .slice(0, 10);
                              setContactPersonPhone(val);
                            }}
                            className={inputClass(
                              !!fieldErrors.contactPersonPhone
                            )}
                          />
                          {fieldErrors.contactPersonPhone && (
                            <p className="text-red-500 text-[12px] mt-1">
                              {fieldErrors.contactPersonPhone}
                            </p>
                          )}
                        </div>
                        {authError && (
                          <p className="text-sm text-red-500">{authError}</p>
                        )}
                        <button
                          type="submit"
                          disabled={authLoading}
                          className={`${btnClass} disabled:opacity-50`}
                        >
                          {authLoading ? (
                            <span className="flex items-center justify-center gap-2">
                              <Loader2 size={16} className="animate-spin" />
                              Submitting...
                            </span>
                          ) : (
                            "Submit Registration"
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRegisterStep(3);
                            clearErrors();
                          }}
                          className="w-full text-[13px] text-gray-400 hover:text-gray-700 font-semibold py-2 transition-colors flex items-center justify-center gap-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m15 18-6-6 6-6" />
                          </svg>
                          Back to Institution Info
                        </button>
                      </form>
                    </div>
                  )}

                  {view === "register" && showOtpStep && (
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
                          className={`${btnClass} disabled:opacity-50`}
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
                        onClick={() => { setShowOtpStep(false); setRegisterStep(4); }}
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
    </div>
  );
}
