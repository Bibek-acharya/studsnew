"use client";

import { usePathname } from "next/navigation";
import EducationNavbar from "@/components/navigation/EducationNavbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Hide the global navbar for the scholarship-finder page if it's contributing to the "gray gap"
  if (pathname === "/scholarship-provider" || pathname === "/institution-zone") {
    return null;
  }

  return <EducationNavbar />;
}
