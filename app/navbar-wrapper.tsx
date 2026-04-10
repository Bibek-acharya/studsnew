"use client";

import { usePathname, useRouter } from "next/navigation";
import EducationNavbar from "@/components/navigation/EducationNavbar";
import { useAuth } from "@/services/AuthContext";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  // Hide the global navbar for specific routes
  const hideGlobalNavbar =
    pathname.startsWith("/scholarship-provider") ||
    pathname.startsWith("/institution-zone");

  if (hideGlobalNavbar) {
    return null;
  }

  const handleNavigate = (viewKey: string) => {
    // If EducationNavbar calls onNavigate, we can handle it here or let it use its internal router
  };

  return (
    <EducationNavbar
      user={user}
      onLogout={logout}
      onNavigate={handleNavigate}
    />
  );
}
