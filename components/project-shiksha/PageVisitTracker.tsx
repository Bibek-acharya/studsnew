"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { superadminAnalyticsApi } from "@/services/superadminAnalyticsApi";

/**
 * Lightweight page-visit tracker. Renders nothing; on every pathname change
 * it fire-and-forget POSTs the visit to the public track endpoint.
 */
export default function PageVisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    const referrer =
      typeof document !== "undefined" && document.referrer
        ? document.referrer
        : undefined;
    superadminAnalyticsApi.trackVisit(pathname, referrer).catch(() => {});
  }, [pathname]);

  return null;
}
