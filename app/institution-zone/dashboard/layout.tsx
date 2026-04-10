"use client";

import React from "react";
import InstitutionLayout, {
  InstitutionPage,
} from "@/components/institution-zone/dashboard/institution/InstitutionLayout";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Map pathname to activePage
  const getActivePage = (path: string): InstitutionPage => {
    if (path.includes("/overview")) return "overview";
    if (path.includes("/admission-manage")) return "admissionManage"; // Check specialized first
    if (path.includes("/admission")) return "admission";
    if (path.includes("/qms")) return "qms";
    if (path.includes("/program")) return "program";
    if (path.includes("/scholarship-manage")) return "scholarshipManage";
    if (path.includes("/scholarship")) return "scholarship";
    if (path.includes("/college-profile")) return "collegeProfile";
    if (path.includes("/counselling")) return "counselling";
    if (path.includes("/entrance")) return "entrance";
    if (path.includes("/news-notice")) return "newsNotice";
    if (path.includes("/events")) return "events";
    return "overview";
  };

  const activePage = getActivePage(pathname);

  const handleNavigate = (page: InstitutionPage) => {
    const routeMap: Record<InstitutionPage, string> = {
      overview: "/institution-zone/dashboard/overview",
      admission: "/institution-zone/dashboard/admission",
      admissionManage: "/institution-zone/dashboard/admission-manage",
      qms: "/institution-zone/dashboard/qms",
      program: "/institution-zone/dashboard/program",
      scholarship: "/institution-zone/dashboard/scholarship",
      scholarshipManage: "/institution-zone/dashboard/scholarship-manage",
      collegeProfile: "/institution-zone/dashboard/college-profile",
      counselling: "/institution-zone/dashboard/counselling",
      counsellingSlots: "/institution-zone/dashboard/counselling", // Assuming same base
      entrance: "/institution-zone/dashboard/entrance",
      newsNotice: "/institution-zone/dashboard/news-notice",
      events: "/institution-zone/dashboard/events",
      settings: "/institution-zone/dashboard/overview", // Default if not implemented
    };

    router.push(routeMap[page] || "/institution-zone/dashboard/overview");
  };

  return (
    <InstitutionLayout activePage={activePage} onNavigate={handleNavigate}>
      {children}
    </InstitutionLayout>
  );
}
