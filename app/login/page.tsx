import { Suspense } from "react";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthPageLayout
      title="Sign in to StudsSphere"
      subtitle="Welcome back! Enter your details to access your dashboard."
      footerText="Not a Member yet?"
      footerLinkText="Register Now"
      footerHref="/register"
    >
      <Suspense fallback={<div className="py-8 text-center text-sm text-gray-500">Loading sign in form...</div>}>
        <LoginForm />
      </Suspense>
    </AuthPageLayout>
  );
}
