"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../services/AuthContext";
import { validators, useFieldValidation } from "@/utils/validation";

interface SignupViewProps {
  onSwitch: () => void;
  onSuccess: () => void;
  onOTPRequired?: (email: string) => void;
  onClose?: () => void;
}

const SignupView: React.FC<SignupViewProps> = ({
  onSwitch,
  onSuccess,
  onOTPRequired,
  onClose,
}) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();

  const {
    values,
    touched,
    errors,
    setValue,
    touch,
    validateField,
    validateAll,
  } = useFieldValidation({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValue(name, value);
    if (touched[name]) {
      if (name === "email") validateField("email", value, validators.email);
      if (name === "fullName")
        validateField("fullName", value, validators.fullName);
      if (name === "phone") validateField("phone", value, validators.phone);
      if (name === "password")
        validateField("password", value, validators.password);
      if (name === "confirmPassword")
        validateField("confirmPassword", value, (confirmValue) =>
          validators.confirmPassword(confirmValue, values.password),
        );
    }

    if (name === "password" && touched.confirmPassword) {
      validateField("confirmPassword", values.confirmPassword, (confirmValue) =>
        validators.confirmPassword(confirmValue, value),
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!agreedToTerms) {
      setError("Please agree to the Terms & Conditions.");
      return;
    }

    const isValid = validateAll([
      { key: "fullName", validator: validators.fullName },
      { key: "email", validator: validators.email },
      { key: "phone", validator: validators.phone },
      { key: "password", validator: validators.password },
      {
        key: "confirmPassword",
        validator: (value) =>
          validators.confirmPassword(value, values.password),
      },
    ]);

    if (!isValid) return;

    setLoading(true);
    try {
      const [firstName, ...lastNameParts] = values.fullName.trim().split(" ");
      const lastName = lastNameParts.join(" ") || firstName;
      await register(
        values.email,
        values.password,
        firstName,
        lastName,
        "student",
        "",
      );
      if (onOTPRequired) {
        onOTPRequired(values.email);
      } else {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
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
    if (
      touched[field] &&
      !errors[field] &&
      values[field as keyof typeof values]
    )
      return "focus:border-green-400 focus:ring-green-400";
    if (touched[field] && errors[field])
      return "focus:border-red-400 focus:ring-red-400";
    return "focus:border-blue-600 focus:ring-blue-600";
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google`;
  };

  return (
    <div className="relative w-full max-w-110 mx-auto flex min-h-160 flex-col justify-center py-2 px-4">
      <button
        type="button"
        onClick={() => (onClose ? onClose() : router.push("/"))}
        aria-label="Close signup view"
        className="absolute -right-6 -top-4 flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-500"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Create an Account
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Enter your details to register.
      </p>
  <div className="mb-4">
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-md py-2 px-4 hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-blue-600 focus:outline-none"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="text-sm font-semibold text-gray-700">Google</span>
        </button>
      </div>

      {/* Divider */}
      <div className="relative flex items-center mb-4">
        <div className="grow border-t border-gray-100"></div>
        <span className="mx-4 shrink-0 text-xs text-gray-400">or continue with email</span>
        <div className="grow border-t border-gray-100"></div>
      </div>
      

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              required
              disabled={loading}
              className={`w-full pl-11 pr-10 py-2.5 border rounded-md text-sm focus:ring-1 outline-none transition-colors placeholder:text-gray-400 disabled:bg-gray-50 ${getBorderClass("fullName")} ${getFocusClasses("fullName")}`}
              value={values.fullName}
              onChange={handleChange}
              onBlur={() => {
                touch("fullName");
                validateField("fullName", values.fullName, validators.fullName);
              }}
            />
            {touched.fullName && errors.fullName && (
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
            {touched.fullName && !errors.fullName && values.fullName && (
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
          {touched.fullName && errors.fullName && (
            <p className="text-[11px] text-red-500 mt-1 ml-1">
              {errors.fullName}
            </p>
          )}
        </div>

        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              disabled={loading}
              className={`w-full pl-11 pr-10 py-2.5 border rounded-md text-sm focus:ring-1 outline-none transition-colors placeholder:text-gray-400 disabled:bg-gray-50 ${getBorderClass("email")} ${getFocusClasses("email")}`}
              value={values.email}
              onChange={handleChange}
              onBlur={() => {
                touch("email");
                validateField("email", values.email, validators.email);
              }}
            />
            {touched.email && errors.email && (
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
            {touched.email && !errors.email && values.email && (
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
          {touched.email && errors.email && (
            <p className="text-[11px] text-red-500 mt-1 ml-1">{errors.email}</p>
          )}
        </div>

        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <div className="absolute inset-y-0 left-[2.4rem] flex items-center pointer-events-none">
              <span className="text-sm font-medium text-gray-600">+977 -</span>
            </div>
            <input
              type="tel"
              name="phone"
              placeholder="98XXXXXXXX"
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit number"
              disabled={loading}
              className={`w-full pl-22 pr-10 py-2.5 border rounded-md text-sm focus:ring-1 outline-none transition-colors placeholder:text-gray-400 disabled:bg-gray-50 ${getBorderClass("phone")} ${getFocusClasses("phone")}`}
              value={values.phone}
              onChange={handleChange}
              onBlur={() => {
                touch("phone");
                validateField("phone", values.phone, validators.phone);
              }}
            />
            {touched.phone && errors.phone && (
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
            {touched.phone && !errors.phone && values.phone && (
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
          {touched.phone && errors.phone && (
            <p className="text-[11px] text-red-500 mt-1 ml-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              pattern="(?=.*[A-Z])(?=.*[a-z])(?=.*[\W_]).{8,}"
              title="Must contain at least one uppercase letter, one special character, and be at least 8 characters long."
              required
              disabled={loading}
              className={`w-full pl-11 pr-11 py-2.5 border rounded-md text-sm focus:ring-1 outline-none transition-colors placeholder:text-gray-400 disabled:bg-gray-50 ${getBorderClass("password")} ${getFocusClasses("password")}`}
              value={values.password}
              onChange={handleChange}
              onBlur={() => {
                touch("password");
                validateField("password", values.password, validators.password);
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              )}
            </button>
          </div>
          {touched.password && errors.password && (
            <p className="text-[11px] text-red-500 mt-1 ml-1">
              {errors.password}
            </p>
          )}
          {(!touched.password || !errors.password) && (
            <p className="text-[11px] text-gray-500 mt-1.5 ml-1">
              Must be 8+ chars with 1 uppercase &amp; 1 special character.
            </p>
          )}
        </div>

        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Re-enter Password"
              required
              disabled={loading}
              className={`w-full pl-11 pr-11 py-2.5 border rounded-md text-sm focus:ring-1 outline-none transition-colors placeholder:text-gray-400 disabled:bg-gray-50 ${getBorderClass("confirmPassword")} ${getFocusClasses("confirmPassword")}`}
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={() => {
                touch("confirmPassword");
                validateField("confirmPassword", values.confirmPassword, (value) =>
                  validators.confirmPassword(value, values.password),
                );
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              )}
            </button>
          </div>
          {touched.confirmPassword && errors.confirmPassword && (
            <p className="text-[11px] text-red-500 mt-1 ml-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div className="flex items-center mt-1 mb-2">
          <label className="flex items-center cursor-pointer">
            <div className="relative flex items-center justify-center w-4 h-4 mr-2 shrink-0">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="peer appearance-none w-4 h-4 border border-gray-300 rounded bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 transition-all cursor-pointer"
              />
              <svg
                className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span className="text-xs text-gray-500 select-none">
              I agree to the{" "}
              <a
                href="/terms"
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                Terms &amp; Conditions
              </a>
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-blue hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-md py-2.5 transition-colors duration-200  flex items-center justify-center gap-2"
        >
          {loading ? (
            <svg
              className="w-5 h-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            "Sign up"
          )}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-5">
        Already have an account?{" "}
        <button
          onClick={onSwitch}
          className="font-medium text-blue-600 hover:underline"
        >
          Log in
        </button>
      </p>
    </div>
  );
};

export default SignupView;
