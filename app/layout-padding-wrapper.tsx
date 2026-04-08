"use client";

import { usePathname } from "next/navigation";

export default function LayoutPaddingWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Route-specific exclusions for global navbar/padding
  const isDashboardRoute =
    pathname.startsWith("/institution-zone") ||
    pathname.startsWith("/scholarship-provider");

  return (
    <div
      className={`flex min-h-screen flex-col bg-white ${
        isDashboardRoute ? "" : "pt-18 xs:pt-20 sm:pt-24 md:pt-27"
      }`}
    >
      {children}
    </div>
  );
}
