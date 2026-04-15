import { SuperadminAuthProvider } from "@/services/SuperadminAuthContext";

export default function SuperadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SuperadminAuthProvider>
      {children}
    </SuperadminAuthProvider>
  );
}
