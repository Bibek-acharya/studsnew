import AuthPageLayout from "@/components/auth/AuthPageLayout";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthPageLayout
      title="Create Account"
      subtitle="Join StudsSphere and start your journey today."
    >
      <RegisterForm />
    </AuthPageLayout>
  );
}
