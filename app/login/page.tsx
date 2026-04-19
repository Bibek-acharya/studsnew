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
      <LoginForm />
    </AuthPageLayout>
  );
}
