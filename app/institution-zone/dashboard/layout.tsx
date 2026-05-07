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

  const getActivePage = (path: string): InstitutionPage => {
    if (path.includes("/admission/create")) return "createAdmission";
    if (path.includes("/admission/form")) return "admissionForm";
    if (path.includes("/admission/applications")) return "admissionApplications";
    if (path.includes("/admission/directory")) return "admissionDirectory";
    if (path.includes("/admission/shortlist")) return "admissionShortlist";
    if (path.includes("/scholarship/applications")) return "scholarshipApplications";
    if (path.includes("/scholarship/list")) return "scholarshipList";
    if (path.includes("/counselling/requests")) return "counsellingRequests";
    if (path.includes("/counselling/history")) return "counsellingHistory";
    if (path.includes("/entrance/results")) return "entranceResults";
    if (path.includes("/entrance/applicants")) return "entranceApplicants";
    if (path.includes("/entrance/create")) return "entranceCreate";
    if (path.includes("/course/syllabus")) return "courseSyllabus";
    if (path.includes("/course/material")) return "courseMaterial";
    if (path.includes("/course/list")) return "courseList";
    if (path.includes("/message")) return "message";
    if (path.includes("/news/create")) return "createNews";
    if (path.includes("/news/directory")) return "newsDirectory";
    if (path.includes("/events/create")) return "createEvent";
    if (path.includes("/events/directory")) return "eventsDirectory";
    if (path.includes("/blogs/create")) return "createBlog";
    if (path.includes("/blogs/directory")) return "blogDirectory";
    if (path.includes("/invite-student")) return "inviteStudent";
    if (path.includes("/reviews")) return "reviews";
    if (path.includes("/manage-advertisement")) return "manageAdvertisement";
    if (path.includes("/profile")) return "profile";
    if (path.includes("/analytics")) return "analytics";
    if (path.includes("/notifications")) return "notification";
    if (path.includes("/settings")) return "settings";
    return "overview";
  };

  const activePage = getActivePage(pathname);

  const handleNavigate = (page: InstitutionPage) => {
    const routeMap: Record<InstitutionPage, string> = {
      overview: "/institution-zone/dashboard/overview",
      createAdmission: "/institution-zone/dashboard/admission/create",
      admissionForm: "/institution-zone/dashboard/admission/form",
      admissionApplications: "/institution-zone/dashboard/admission/applications",
      admissionDirectory: "/institution-zone/dashboard/admission/directory",
      admissionShortlist: "/institution-zone/dashboard/admission/shortlist",
      scholarshipList: "/institution-zone/dashboard/scholarship/list",
      scholarshipApplications: "/institution-zone/dashboard/scholarship/applications",
      counsellingRequests: "/institution-zone/dashboard/counselling/requests",
      counsellingHistory: "/institution-zone/dashboard/counselling/history",
      entranceCreate: "/institution-zone/dashboard/entrance/create",
      entranceApplicants: "/institution-zone/dashboard/entrance/applicants",
      entranceResults: "/institution-zone/dashboard/entrance/results",
      courseList: "/institution-zone/dashboard/course/list",
      courseSyllabus: "/institution-zone/dashboard/course/syllabus",
      courseMaterial: "/institution-zone/dashboard/course/material",
      message: "/institution-zone/dashboard/message",
      createNews: "/institution-zone/dashboard/news/create",
      newsDirectory: "/institution-zone/dashboard/news/directory",
      createEvent: "/institution-zone/dashboard/events/create",
      eventsDirectory: "/institution-zone/dashboard/events/directory",
      createBlog: "/institution-zone/dashboard/blogs/create",
      blogDirectory: "/institution-zone/dashboard/blogs/directory",
      profile: "/institution-zone/dashboard/profile",
      analytics: "/institution-zone/dashboard/analytics",
      notification: "/institution-zone/dashboard/notifications",
      settings: "/institution-zone/dashboard/settings",
      inviteStudent: "/institution-zone/dashboard/invite-student",
      reviews: "/institution-zone/dashboard/reviews",
      manageAdvertisement: "/institution-zone/dashboard/manage-advertisement",
    };

    router.push(routeMap[page] || "/institution-zone/dashboard/overview");
  };

  return (
    <InstitutionLayout activePage={activePage} onNavigate={handleNavigate}>
      {children}
    </InstitutionLayout>
  );
}
