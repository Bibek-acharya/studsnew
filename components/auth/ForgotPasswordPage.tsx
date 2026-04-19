"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import ForgotPasswordView from "@/components/auth/ForgotPasswordView";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState("");

  const handleBack = () => {
    router.push("/login");
  };

  const handleSubmit = (email: string) => {
    setSuccessMessage(`A reset code has been sent to ${email}. Please check your inbox.`);
  };

  return (
    <AuthPageLayout
      title="Reset Password"
      subtitle="Enter your email address and we’ll send you a verification link."
      footerText="Remembered your password?"
      footerLinkText="Log in"
      footerHref="/login"
    >
      {successMessage ? (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-sm text-green-700">
          {successMessage}
        </div>
      ) : (
        <ForgotPasswordView onBack={handleBack} onSubmit={handleSubmit} />
      )}
    </AuthPageLayout>
  );
}
