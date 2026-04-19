"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/services/AuthContext";
import { apiService } from "@/services/api";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Phone } from "lucide-react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const studyLevels = [
  { value: "see_graduate", label: "SEE graduate" },
  { value: "plus2_running", label: "+2 running" },
  { value: "plus2_graduate", label: "+2 graduate" },
  { value: "bachelor_running", label: "Bachelor running" },
];

const targetExams = [
  { value: "IOE", label: "IOE" },
  { value: "IOM", label: "IOM" },
  { value: "CEE", label: "CEE" },
  { value: "KU", label: "KU" },
  { value: "TU", label: "TU" },
  { value: "MBBS", label: "MBBS" },
  { value: "BBA", label: "BBA" },
  { value: "CTEVT", label: "CTEVT" },
];

export default function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  
  const [step, setStep] = useState<"register" | "verify" | "onboarding">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(120);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [educationLevel, setEducationLevel] = useState("");
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [preferredLocation, setPreferredLocation] = useState("");
  const [phone, setPhone] = useState("");

  const validateRegister = () => {
    if (!emailRegex.test(email.trim())) return "Please enter a valid email address.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (!agreeTerms) return "Please agree to the Terms and Conditions.";
    return "";
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validateRegister();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await register(email.trim(), password, "Student", "User", "student", "");
      setStep("verify");
      startOtpTimer();
    } catch (err: any) {
      setError(err?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const startOtpTimer = () => {
    setOtpTimer(120);
    const interval = setInterval(() => {
      setOtpTimer(t => {
        if (t <= 1) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
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

  const handleOtpSubmit = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter the full 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Invalid verification code");
      }

      if (data.data?.token) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("studsphere_auth", JSON.stringify({
          token: data.data.token,
          user: data.data.user,
        }));
        
        if (data.data.user?.preferences?.education_level) {
          router.push("/user/dashboard");
        } else {
          setStep("onboarding");
        }
      }
    } catch (err: any) {
      setError(err?.message || "Verification failed. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      otpInputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setOtpTimer(120);
    startOtpTimer();
    try {
      await apiService.sendOTP(email);
    } catch (err) {
      console.error("Failed to resend OTP:", err);
    }
  };

  const toggleExam = (exam: string) => {
    setSelectedExams(prev => 
      prev.includes(exam) ? prev.filter(e => e !== exam) : [...prev, exam]
    );
  };

  const handleOnboardingSubmit = async () => {
    if (!educationLevel) {
      setError("Please select your education level");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      await apiService.savePreferences({
        preference_role: "student",
        preference_flow: "onboarding",
        preferences: {
          education_level: educationLevel,
          target_exams: selectedExams,
          preferred_location: preferredLocation,
        },
      }, token);

      router.push("/user/dashboard");
    } catch (err: any) {
      setError(err?.message || "Failed to save preferences.");
    } finally {
      setLoading(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-5">
      {step === "register" && (
        <>
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google`}
              className="w-full flex items-center justify-center gap-3 rounded-md border border-gray-200 bg-white py-3 px-4 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
            >
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign up via Google
            </button>
          </div>

          <div className="relative flex items-center text-center text-xs text-gray-400">
            <span className="mx-auto bg-white px-3">or continue with</span>
            <div className="absolute inset-x-0 top-1/2 h-px bg-gray-200" />
          </div>
        </>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {step === "register" && (
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Mail size={20} className="h-5 w-5" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full rounded-md border border-gray-200 bg-white pl-10 pr-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-blue-600 focus:ring-0"
            />
          </div>

          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock size={20} className="h-5 w-5" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (8+ characters)"
              className="w-full rounded-md border border-gray-200 bg-white pl-10 pr-14 py-3 text-sm text-gray-900 outline-none transition-all focus:border-blue-600 focus:ring-0"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
          <p className="text-xs text-gray-500">At least 8 characters.</p>

          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer w-max">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <span className="text-sm text-gray-600">
                I agree to the{" "}
                <button type="button" className="font-semibold text-blue-600 hover:text-blue-800">
                  Terms and Conditions
                </button>
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
      )}

      {step === "verify" && (
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <button onClick={() => setStep("register")} className="text-gray-400 hover:text-gray-600">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Check your email</h2>
              <p className="text-xs text-gray-500">We've sent a code to {email}</p>
            </div>
          </div>

          <div className="flex justify-start gap-2" onPaste={handleOtpPaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => otpInputRefs.current[i] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleOtpChange(i, e.target.value)}
                onKeyDown={e => handleOtpKeyDown(i, e)}
                className="w-11 h-12 text-center text-lg font-bold rounded-md border border-gray-200 text-gray-900 focus:border-blue-600 focus:ring-0"
              />
            ))}
          </div>

          <button
            onClick={handleOtpSubmit}
            disabled={loading || otp.join("").length !== 6}
            className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Code expires in{" "}
              <span className="font-bold text-blue-600">{formatTimer(otpTimer)}</span>
            </p>
            <button
              onClick={handleResendOtp}
              disabled={otpTimer > 0}
              className={`text-xs font-medium mt-1 ${
                otpTimer > 0 ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:text-blue-800"
              }`}
            >
              Resend Code
            </button>
          </div>
        </div>
      )}

      {step === "onboarding" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <button onClick={() => {}} className="text-gray-400 hover:text-gray-600">
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-bold text-[#111827]">Tell us about yourself</h2>
          </div>

          <div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              className="w-full px-4 py-3 text-[14px] border border-gray-200 rounded placeholder-gray-400 transition-all"
            />
          </div>

          <div>
            <select
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
              className="form-select w-full px-4 py-3 text-[14px] bg-white border border-gray-200 rounded transition-all"
            >
              <option value="" disabled>Select Study Level</option>
              {studyLevels.map(level => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            {targetExams.map(exam => (
              <button
                key={exam.value}
                type="button"
                onClick={() => toggleExam(exam.value)}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  selectedExams.includes(exam.value)
                    ? "bg-[#0000ff] text-white"
                    : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {exam.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleOnboardingSubmit}
            disabled={loading}
            className="w-full bg-[#0000ff] text-white font-semibold text-[16px] py-3 rounded hover:bg-blue-700 transition-colors shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save and Continue"}
          </button>
        </div>
      )}
    </div>
  );
}