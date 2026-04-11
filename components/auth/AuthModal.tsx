"use client";

import React, { useEffect, useState } from "react";
import LoginView from "@/components/auth/LoginView";
import SignupView from "@/components/auth/SignupView";
import OtpView from "@/components/auth/OtpView";
import ForgotPasswordView from "@/components/auth/ForgotPasswordView";
import SetNewPasswordView from "@/components/auth/SetNewPasswordView";

export type AuthModalView =
  | "login"
  | "signup"
  | "otp"
  | "forgot-password"
  | "reset-otp"
  | "set-new-password";

interface AuthModalProps {
  isOpen: boolean;
  initialView?: "login" | "signup";
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialView = "login",
  onClose,
}) => {
  const [view, setView] = useState<AuthModalView>(initialView);
  const [otpIdentifier, setOtpIdentifier] = useState("");

  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      setOtpIdentifier("");
    }
  }, [isOpen, initialView]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAuthSuccess = () => {
    onClose();
    setView("login");
    setOtpIdentifier("");
  };

  const handleForgotPasswordSubmit = (email: string) => {
    setOtpIdentifier(email);
    setView("reset-otp");
  };

  const goBackToLogin = () => {
    setView("login");
  };

  return (
    <div className="fixed inset-0 z-300 flex items-center justify-center px-4 py-6">
      <button
        type="button"
        aria-label="Close authentication modal"
        className="absolute inset-0 bg-black/45 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-125 rounded-xl border border-gray-200 bg-white p-6 shadow-2xl">
        {view === "login" && (
          <LoginView
            onSwitch={() => setView("signup")}
            onSuccess={handleAuthSuccess}
            onForgotPassword={() => setView("forgot-password")}
            onClose={onClose}
          />
        )}

        {view === "signup" && (
          <SignupView
            onSwitch={() => setView("login")}
            onSuccess={handleAuthSuccess}
            onClose={onClose}
          />
        )}

        {view === "otp" && (
          <OtpView
            identifier={otpIdentifier}
            type="email"
            onVerified={handleAuthSuccess}
            onBack={goBackToLogin}
          />
        )}

        {view === "forgot-password" && (
          <ForgotPasswordView
            onBack={goBackToLogin}
            onSubmit={handleForgotPasswordSubmit}
          />
        )}

        {view === "reset-otp" && (
          <OtpView
            identifier={otpIdentifier}
            type="email"
            onVerified={() => setView("set-new-password")}
            onBack={goBackToLogin}
          />
        )}

        {view === "set-new-password" && (
          <SetNewPasswordView
            identifier={otpIdentifier}
            onBack={goBackToLogin}
            onSuccess={handleAuthSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
