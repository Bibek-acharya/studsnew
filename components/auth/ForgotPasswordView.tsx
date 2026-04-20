"use client";

import React, { useState } from "react";
import { apiService } from "../../services/api";
import { validators, useFieldValidation } from "@/utils/validation";
import { Mail } from "lucide-react";

interface ForgotPasswordViewProps {
  onBack: () => void;
  onSubmit: (email: string) => void;
}

const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({
  onBack,
  onSubmit,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { values, touched, errors, setValue, touch, validateField } = useFieldValidation({
    email: "",
  });

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue("email", val);
    if (touched.email) validateField("email", val, validators.email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const emailError = validateField("email", values.email, validators.email);
    if (emailError) return;

    setLoading(true);
    try {
      await apiService.sendOTP(values.email);
      onSubmit(values.email);
    } catch (err: any) {
      setError(err.message || "Failed to send reset code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getBorderClass = (field: string) => {
    if (!touched[field]) return "border-gray-200";
    if (errors[field]) return "border-red-400";
    return "border-green-400";
  };

  const getFocusClasses = (field: string) => {
    if (touched[field] && !errors[field] && values[field as keyof typeof values]) return "focus:border-green-400 focus:ring-green-400";
    if (touched[field] && errors[field]) return "focus:border-red-400 focus:ring-red-400";
    return "focus:border-blue-600 focus:ring-blue-600";
  };

  return (
    <div className="w-full max-w-[360px] mx-auto flex flex-col py-4">
      <button
        onClick={onBack}
        className="mb-6 text-gray-500 hover:text-gray-800 self-start flex items-center text-sm font-medium transition-colors focus:outline-none"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Login
      </button>

      <h1 className="text-xl font-bold text-gray-900 mb-1">Forgot Password</h1>
      <p className="text-gray-500 text-sm mb-6">
        Enter your email and we&apos;ll send you a 6-digit code to reset your password.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Mail className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              required
              disabled={loading}
              className={`w-full pl-11 pr-10 py-2.5 border rounded-lg text-sm focus:ring-1 outline-none transition-colors placeholder:text-gray-400 disabled:bg-gray-50 ${getBorderClass("email")} ${getFocusClasses("email")}`}
              value={values.email}
              onChange={handleEmailChange}
              onBlur={() => { touch("email"); validateField("email", values.email, validators.email); }}
            />
            {touched.email && errors.email && (
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            {touched.email && !errors.email && values.email && (
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          {touched.email && errors.email && (
            <p className="text-[11px] text-red-500 mt-1 ml-1">{errors.email}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg py-2.5 transition-colors duration-200 mt-2 shadow-md shadow-blue-600/30 flex items-center justify-center gap-2"
        >
          {loading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            "Send Reset Code"
          )}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordView;
