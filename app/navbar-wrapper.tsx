"use client";

import { usePathname } from "next/navigation";
import EducationNavbar from "@/components/navigation/EducationNavbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Hide the global navbar for specific routes
  const hideGlobalNavbar =
    pathname.startsWith("/scholarship-provider") ||
    pathname.startsWith("/institution-zone");

  if (hideGlobalNavbar) {
    return null;
  }

  return <EducationNavbar />;
}
