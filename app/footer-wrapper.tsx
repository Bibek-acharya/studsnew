"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

export default function FooterWrapper() {
  const pathname = usePathname();

  // Hide the global footer for specific routes
  const hideGlobalFooter =
    pathname.startsWith("/scholarship-provider") ||
    pathname.startsWith("/institution-zone");

  if (hideGlobalFooter) {
    return null;
  }

  return <Footer />;
}
