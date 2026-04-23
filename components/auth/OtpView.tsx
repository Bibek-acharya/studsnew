"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../services/AuthContext";
import { apiService } from "../../services/api";
import { validators } from "@/utils/validation";

interface OtpViewProps {
  identifier: string;
  type?: "phone" | "email";
  onVerified: () => void;
  onBack?: () => void;
}

const OtpView: React.FC<OtpViewProps> = ({
  identifier,
  type = "email",
  onVerified,
  onBack,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [touched, setTouched] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const { verifyOTP } = useAuth();

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const otpError = touched ? validators.otp(otp) : null;

  const handleChange = (val: string, index: number) => {
    if (!/^[0-9]?$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    setError("");
    if (val && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (otp.some((v) => !v)) return;
    setLoading(true);
    setError("");
    try {
      await verifyOTP(identifier, otp.join(""));
      onVerified();
    } catch (err: any) {
      setError(err.message || "Invalid or expired code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    setSuccess("");
    try {
      await apiService.sendOTP(identifier);
      setSuccess("New code sent to your email!");
      setOtp(["", "", "", "", "", ""]);
      setTouched(false);
      inputsRef.current[0]?.focus();
    } catch (err: any) {
      setError(err.message || "Failed to resend code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full max-w-[360px] mx-auto flex flex-col py-4">
      {onBack && (
        <button
          onClick={onBack}
          className="mb-6 text-gray-500 hover:text-gray-800 self-start flex items-center text-sm font-medium transition-colors focus:outline-none"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      )}

      <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-5 border border-blue-100">
        <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
      <p className="text-gray-500 text-sm mb-6 leading-relaxed">
        We&apos;ve sent a 6-digit verification code to{" "}
        <span className="font-medium text-gray-900">{identifier}</span>.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-md">
          <p className="text-emerald-700 text-sm">{success}</p>
        </div>
      )}

      <form onSubmit={handleVerify} className="flex flex-col gap-5">
        <div className="flex justify-between gap-2">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => { inputsRef.current[idx] = el; }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onBlur={handleBlur}
              className={`w-12 h-12 bg-white border rounded-md text-center text-xl font-bold text-gray-900 outline-none transition-all ${
                touched && otpError
                  ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
                  : digit
                  ? "border-green-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/20"
                  : "border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              }`}
            />
          ))}
        </div>
        {touched && otpError && (
          <p className="text-[11px] text-red-500 -mt-3 text-center">{otpError}</p>
        )}

        <button
          type="submit"
          disabled={loading || otp.some((v) => !v)}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-md py-2.5 transition-colors duration-200  shadow-blue-600/30 flex items-center justify-center gap-2 mt-2"
        >
          {loading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            "Verify Account"
          )}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Didn&apos;t receive the email?{" "}
        <br />
        <button
          onClick={handleResend}
          disabled={resending}
          className="font-medium text-blue-600 hover:underline inline-block mt-1 disabled:opacity-50"
        >
          {resending ? "Sending..." : "Click to resend"}
        </button>
      </p>
    </div>
  );
};

export default OtpView;
