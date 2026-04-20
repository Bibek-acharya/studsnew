"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiService } from "../../services/api";
import { validators, useFieldValidation } from "@/utils/validation";
import { Mail, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import AuthPageLayout from "@/components/auth/AuthPageLayout";

type Step = "email" | "otp" | "newPassword";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const { values: emailValues, touched: emailTouched, errors: emailErrors, setValue: setEmailValue, validateField: validateEmailField, touch: touchEmailField } = useFieldValidation({
    email: "",
  });

  const { values: passwordValues, touched: passwordTouched, errors: passwordErrors, setValue: setPasswordValue, validateField: validatePasswordField, touch: touchPasswordField } = useFieldValidation({
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpTouched, setOtpTouched] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const getBorderClass = (field: string, touched: boolean, errors: Record<string, string>, values: Record<string, string>) => {
    if (!touched) return "border-gray-200";
    if (errors[field]) return "border-red-400";
    return "border-green-400";
  };

  const getFocusClasses = (field: string, touched: boolean, errors: Record<string, string>, values: Record<string, string>) => {
    if (touched && !errors[field] && values[field as keyof typeof values]) return "focus:border-green-400 focus:ring-green-400";
    if (touched && errors[field]) return "focus:border-red-400 focus:ring-red-400";
    return "focus:border-blue-600 focus:ring-blue-600";
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const emailError = validateEmailField("email", emailValues.email, validators.email);
    if (emailError) return;

    setLoading(true);
    try {
      setEmail(emailValues.email);
      await apiService.sendOTP(emailValues.email, "password_reset");
      setStep("otp");
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      setError(err.message || "Failed to send reset code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (val: string, index: number) => {
    if (!/^[0-9]?$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    setError("");
    if (val && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOtpTouched(true);

    if (otp.some((v) => !v)) return;

    setLoading(true);
    try {
      await apiService.verifyOTP(email, otp.join(""));
      setStep("newPassword");
    } catch (err: any) {
      setError(err.message || "Invalid or expired code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const passwordError = validatePasswordField("password", passwordValues.password, validators.password);
    const confirmError = passwordValues.confirmPassword !== passwordValues.password ? "Passwords do not match" : null;
    if (passwordError || confirmError) return;

    setLoading(true);
    try {
      await apiService.resetPassword(email, passwordValues.password);
      setSuccessMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      await apiService.sendOTP(email, "password_reset");
      setSuccessMessage("New code sent to your email!");
      setOtp(["", "", "", "", "", ""]);
      setOtpTouched(false);
    } catch (err: any) {
      setError(err.message || "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
if (step === "email") {
      return (
        <form onSubmit={handleEmailSubmit} className="space-y-5">
          <div>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                required
                disabled={loading}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm outline-none transition-all placeholder:text-gray-400 disabled:bg-gray-50 ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : getBorderClass("email", emailTouched.email, emailErrors, emailValues) + " " + getFocusClasses("email", emailTouched.email, emailErrors, emailValues)}`}
                value={emailValues.email}
                onChange={(e) => { setEmailValue("email", e.target.value); setError(""); }}
                onBlur={() => { touchEmailField("email"); validateEmailField("email", emailValues.email, validators.email); }}
              />
            </div>
            {(error || (emailTouched.email && emailErrors.email)) && (
              <p className="text-[11px] text-red-500 mt-1">{error || emailErrors.email}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-blue hover:bg-brand-hover disabled:bg-blue-400 text-white font-semibold rounded-lg py-3 transition-all disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Reset Code"}
          </button>
        </form>
      );
    }

    if (step === "otp") {
      return (
        <form onSubmit={handleOtpSubmit} className="space-y-5">
          <button
            type="button"
            onClick={() => setStep("email")}
            className="text-gray-500 hover:text-gray-800 flex items-center text-sm font-medium transition-colors focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </button>

          <div className="flex justify-start gap-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { otpInputRefs.current[idx] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, idx)}
                onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                onBlur={() => setOtpTouched(true)}
                className={`w-11 h-12 text-center text-lg font-bold rounded-md border outline-none transition-all ${
                  error && otpTouched
                    ? "border-red-500 focus:border-red-500"
                    : otpTouched && otp.some((v) => !v)
                    ? "border-red-400 focus:border-red-400"
                    : digit
                    ? "border-green-400 focus:border-green-400"
                    : "border-gray-200 focus:border-brand-blue"
                }`}
              />
            ))}
          </div>
          {otpTouched && otp.some((v) => !v) && (
            <p className="text-[11px] text-red-500">Please enter the 6-digit code</p>
          )}

          <button
            type="submit"
            disabled={loading || otp.some((v) => !v)}
            className="w-full bg-brand-blue hover:bg-brand-hover disabled:bg-blue-400 text-white font-semibold rounded-lg py-3 transition-all disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Didn&apos;t receive the email?{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={loading}
              className="font-medium text-brand-blue hover:underline disabled:opacity-50"
            >
              {loading ? "Sending..." : "Click to resend"}
            </button>
          </p>
        </form>
      );
    }

    if (step === "newPassword") {
      return (
        <form onSubmit={handleNewPasswordSubmit} className="space-y-5">
          <button
            type="button"
            onClick={() => setStep("otp")}
            className="text-gray-500 hover:text-gray-800 flex items-center text-sm font-medium transition-colors focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </button>

          <div>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                required
                disabled={loading}
                className={`w-full pl-10 pr-14 py-3 border rounded-lg text-sm outline-none transition-all placeholder:text-gray-400 disabled:bg-gray-50 ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : getBorderClass("password", passwordTouched.password, passwordErrors, passwordValues) + " " + getFocusClasses("password", passwordTouched.password, passwordErrors, passwordValues)}`}
                value={passwordValues.password}
                onChange={(e) => { setPasswordValue("password", e.target.value); setError(""); }}
                onBlur={() => { touchPasswordField("password"); validatePasswordField("password", passwordValues.password, validators.password); }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {passwordTouched.password && passwordErrors.password && (
              <p className="text-[11px] text-red-500 mt-1">{passwordErrors.password}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                required
                disabled={loading}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm outline-none transition-all placeholder:text-gray-400 disabled:bg-gray-50 ${(error || confirmPasswordError) ? "border-red-500 focus:border-red-500 focus:ring-red-500" : getBorderClass("confirmPassword", passwordTouched.confirmPassword, passwordErrors, passwordValues) + " " + getFocusClasses("confirmPassword", passwordTouched.confirmPassword, passwordErrors, passwordValues)}`}
                value={passwordValues.confirmPassword}
                onChange={(e) => { setPasswordValue("confirmPassword", e.target.value); setError(""); setConfirmPasswordError(""); }}
                onBlur={() => { touchPasswordField("confirmPassword"); if (passwordValues.confirmPassword !== passwordValues.password) setConfirmPasswordError("Passwords do not match"); }}
              />
            </div>
            {(passwordTouched.confirmPassword && passwordValues.confirmPassword !== passwordValues.password) || confirmPasswordError ? (
              <p className="text-[11px] text-red-500 mt-1">{confirmPasswordError || "Passwords do not match"}</p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-blue hover:bg-brand-hover disabled:bg-blue-400 text-white font-semibold rounded-lg py-3 transition-all disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      );
    }

    return null;
  };

  return (
    <AuthPageLayout
      title="Forgot Password?"
      subtitle="Enter your email address and we&apos;ll send you a verification link."
      footerText="Remembered your password?"
      footerLinkText="Log in"
      footerHref="/login"
    >
      {successMessage && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
          <p className="text-green-700 text-sm">{successMessage}</p>
        </div>
      )}
      {renderContent()}
    </AuthPageLayout>
  );
}