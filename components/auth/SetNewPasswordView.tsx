"use client";

import React, { useState } from "react";
import { apiService } from "../../services/api";
import { validators, useFieldValidation } from "@/utils/validation";

interface SetNewPasswordViewProps {
  identifier: string;
  onBack: () => void;
  onSuccess: () => void;
}

const SetNewPasswordView: React.FC<SetNewPasswordViewProps> = ({
  identifier,
  onBack,
  onSuccess,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { values, touched, errors, setValue, touch, validateField, validateAll } = useFieldValidation({
    newPassword: "",
    confirmPassword: "",
  });

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue("newPassword", val);
    if (touched.newPassword) validateField("newPassword", val, validators.password);
    if (touched.confirmPassword) {
      validateField("confirmPassword", values.confirmPassword, (v) => validators.confirmPassword(v, val));
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue("confirmPassword", val);
    if (touched.confirmPassword) validateField("confirmPassword", val, (v) => validators.confirmPassword(v, values.newPassword));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const isValid = validateAll([
      { key: "newPassword", validator: validators.password },
      { key: "confirmPassword", validator: (v: string) => validators.confirmPassword(v, values.newPassword) },
    ]);

    if (!isValid) return;

    setLoading(true);
    try {
      await apiService.resetPassword(identifier, "", values.newPassword);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please try again.");
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
        Back
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Set New Password</h1>
      <p className="text-gray-500 text-sm mb-6 leading-relaxed">
        Create a new password for your account.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              required
              disabled={loading}
              className={`w-full pl-11 pr-11 py-2.5 border rounded-md text-sm focus:ring-1 outline-none transition-colors placeholder:text-gray-400 disabled:bg-gray-50 ${getBorderClass("newPassword")} ${getFocusClasses("newPassword")}`}
              value={values.newPassword}
              onChange={handleNewPasswordChange}
              onBlur={() => { touch("newPassword"); validateField("newPassword", values.newPassword, validators.password); }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              )}
            </button>
          </div>
          {touched.newPassword && errors.newPassword && (
            <p className="text-[11px] text-red-500 mt-1 ml-1">{errors.newPassword}</p>
          )}
          {(!touched.newPassword || !errors.newPassword) && (
            <p className="text-[11px] text-gray-500 mt-1.5 ml-1">Must be 8+ chars with 1 uppercase &amp; 1 special character.</p>
          )}
        </div>

        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              required
              disabled={loading}
              className={`w-full pl-11 pr-11 py-2.5 border rounded-md text-sm focus:ring-1 outline-none transition-colors placeholder:text-gray-400 disabled:bg-gray-50 ${getBorderClass("confirmPassword")} ${getFocusClasses("confirmPassword")}`}
              value={values.confirmPassword}
              onChange={handleConfirmPasswordChange}
              onBlur={() => { touch("confirmPassword"); validateField("confirmPassword", values.confirmPassword, (v) => validators.confirmPassword(v, values.newPassword)); }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showConfirmPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              )}
            </button>
          </div>
          {touched.confirmPassword && errors.confirmPassword && (
            <p className="text-[11px] text-red-500 mt-1 ml-1">{errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-md py-2.5 transition-colors duration-200 mt-2  shadow-blue-600/30 flex items-center justify-center gap-2"
        >
          {loading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </div>
  );
};

export default SetNewPasswordView;
