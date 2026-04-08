"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LoginView from "@/components/auth/LoginView";
import SignupView from "@/components/auth/SignupView";
import OtpView from "@/components/auth/OtpView";
import ForgotPasswordView from "@/components/auth/ForgotPasswordView";
import SetNewPasswordView from "@/components/auth/SetNewPasswordView";

type AuthView =
  | "login"
  | "signup"
  | "otp"
  | "forgot-password"
  | "reset-otp"
  | "set-new-password";

export default function LoginPage() {
  const [view, setView] = useState<AuthView>("login");
  const [otpIdentifier, setOtpIdentifier] = useState("");
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/");
  };

  const handleForgotPasswordSubmit = (email: string) => {
    setOtpIdentifier(email);
    setView("reset-otp");
  };

  const goBack = () => {
    setView("login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <div className="w-full max-w-110 rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        {view === "login" && (
          <LoginView
            onSwitch={() => setView("signup")}
            onSuccess={handleSuccess}
            onForgotPassword={() => setView("forgot-password")}
          />
        )}
        {view === "signup" && (
          <SignupView
            onSwitch={() => setView("login")}
            onSuccess={handleSuccess}
          />
        )}
        {view === "otp" && (
          <OtpView
            identifier={otpIdentifier}
            type="email"
            onVerified={handleSuccess}
            onBack={goBack}
          />
        )}
        {view === "forgot-password" && (
          <ForgotPasswordView
            onBack={goBack}
            onSubmit={handleForgotPasswordSubmit}
          />
        )}
        {view === "reset-otp" && (
          <OtpView
            identifier={otpIdentifier}
            type="email"
            onVerified={() => setView("set-new-password")}
            onBack={goBack}
          />
        )}
        {view === "set-new-password" && (
          <SetNewPasswordView
            identifier={otpIdentifier}
            onBack={goBack}
            onSuccess={() => router.push("/")}
          />
        )}
      </div>
    </div>
  );
}
