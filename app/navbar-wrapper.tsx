"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import EducationNavbar from "@/components/navigation/EducationNavbar";
import { useAuth } from "@/services/AuthContext";
import { routeMap } from "@/components/navigation/config";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const hideGlobalNavbar =
    pathname.startsWith("/scholarship-provider") ||
    pathname.startsWith("/institution-zone") ||
    pathname.startsWith("/user/dashboard") ||
    pathname.startsWith("/superadmin");

  if (hideGlobalNavbar) {
    return null;
  }

  const handleNavigate = useCallback((viewKey: string) => {
    const route = routeMap[viewKey as keyof typeof routeMap];
    if (route) {
      router.push(route);
    }
  }, [router]);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <EducationNavbar
      user={user}
      onLogout={handleLogout}
      onNavigate={handleNavigate}
    />
  );
}
