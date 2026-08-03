"use client";

import React, { useState, lazy, Suspense, useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { clearAllAuthSessions, clearCookie } from "@/services/authSession";
import { apiService } from "@/services/api";
import {
  LayoutDashboard,
  GraduationCap,
  Building2,
  HandHeart,
  ShieldCheck,
  CreditCard,
  Megaphone,
  Newspaper,
  Calendar,
  FileText,
  Building,
  Bell,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  Users,
  UserPlus,
  ClipboardList,
  HelpCircle,
  BookOpen,
  School,
  MapPin,
  Globe,
  Briefcase,
  Menu,
  X,
} from "lucide-react";

const OverviewSection = lazy(() => import("./OverviewSection"));
const CollegeListSection = lazy(() => import("./CollegeListSection"));
const AddCollegeSection = lazy(() => import("./AddCollegeSection"));
const CourseListSection = lazy(() => import("./CourseListSection"));
const AddCourseSection = lazy(() => import("./AddCourseSection"));
const ScholarshipListSection = lazy(() => import("./ScholarshipListSection"));
const CreateScholarshipSection = lazy(
  () => import("./CreateScholarshipSection"),
);
const EntranceListSection = lazy(() => import("./EntranceListSection"));
const AddEntranceSection = lazy(() => import("./AddEntranceSection"));
const MessageInquirySection = lazy(() => import("./MessageInquirySection"));
const NewsListSection = lazy(() => import("./NewsListSection"));
const CreateNewsSection = lazy(() => import("./CreateNewsSection"));
const BlogListSection = lazy(() => import("./BlogListSection"));
const CreateBlogSection = lazy(() => import("./CreateBlogSection"));
const EventListSection = lazy(() => import("./EventListSection"));
const CreateEventSection = lazy(() => import("./CreateEventSection"));
const UniversityNewsSection = lazy(() => import("./UniversityNewsSection"));
const UniversityEventsSection = lazy(() => import("./UniversityEventsSection"));
const CreateUniversityNewsSection = lazy(() => import("./CreateUniversityNewsSection"));
const CreateUniversityEventsSection = lazy(() => import("./CreateUniversityEventsSection"));
const CampusFeedSection = lazy(() => import("./CampusFeedSection"));
const NotificationSection = lazy(() => import("./NotificationSection"));
const AccessControlSection = lazy(() => import("./AccessControlSection"));
const PaymentSection = lazy(() => import("./PaymentSection"));
const OrganizationProfileSection = lazy(
  () => import("./OrganizationProfileSection"),
);
const OrganizationSettingsSection = lazy(
  () => import("./OrganizationSettingsSection"),
);
const HistorySection = lazy(() => import("./HistorySection"));
const BackupSection = lazy(() => import("./BackupSection"));
const SettingsSection = lazy(() => import("./SettingsSection"));
const UserListSection = lazy(() => import("./UserListSection"));
const AddUserSection = lazy(() => import("./AddUserSection"));
const AnalyticsSection = lazy(() => import("./AnalyticsSection"));
const PendingProvidersSection = lazy(() => import("./PendingProvidersSection"));
const VerifiedProvidersSection = lazy(
  () => import("./VerifiedProvidersSection"),
);
const PendingInstitutionsSection = lazy(
  () => import("./PendingInstitutionsSection"),
);
const ManageProfileAccessSection = lazy(
  () => import("./ManageProfileAccessSection"),
);
const AdvertiseRequestSection = lazy(() => import("./AdvertiseRequestSection"));
const ManageAdsSection = lazy(() => import("./ManageAdsSection"));
const RejectedInstitutionsSection = lazy(
  () => import("./RejectedInstitutionsSection"),
);
const FeedbackListSection = lazy(() => import("./FeedbackListSection"));
const FAQManageSection = lazy(() => import("./FAQManageSection"));
const AddUniversitySection = lazy(() => import("./AddUniversitySection"));
const ListUniversitiesSection = lazy(() => import("./ListUniversitiesSection"));
const DraftUniversitiesSection = lazy(
  () => import("./DraftUniversitiesSection"),
);
const MapCollegeListSection = lazy(() => import("./MapCollegeListSection"));
const SuperadminCourseListSection = lazy(
  () => import("./SuperadminCourseListSection"),
);
const SuperadminAddCourseSection = lazy(
  () => import("./SuperadminAddCourseSection"),
);
const SuperadminEntranceDirectorySection = lazy(
  () => import("./SuperadminEntranceDirectorySection"),
);
const SuperadminCreateEntranceSection = lazy(
  () => import("./SuperadminCreateEntranceSection"),
);
const SuperadminEntranceDraftSection = lazy(
  () => import("./SuperadminEntranceDraftSection"),
);
const SuperadminEntranceApplicantsSection = lazy(
  () => import("./SuperadminEntranceApplicantsSection"),
);
const SuperadminEntranceResultsSection = lazy(
  () => import("./SuperadminEntranceResultsSection"),
);
const SuperadminAdmissionDirectorySection = lazy(
  () => import("./SuperadminAdmissionDirectorySection"),
);
const SuperadminCreateAdmissionSection = lazy(
  () => import("./SuperadminCreateAdmissionSection"),
);
const SuperadminAdmissionDraftSection = lazy(
  () => import("./SuperadminAdmissionDraftSection"),
);
const SuperadminAdmissionApplicationsSection = lazy(
  () => import("./SuperadminAdmissionApplicationsSection"),
);
const SuperadminAdmissionShortlistSection = lazy(
  () => import("./SuperadminAdmissionShortlistSection"),
);
const GlobalCourseListSection = lazy(() => import("./GlobalCourseListSection"));
const GlobalCourseFormSection = lazy(() => import("./GlobalCourseFormSection"));
const UniversityReviewSection = lazy(() => import("./UniversityReviewSection"));
const SuperadminJobDirectorySection = lazy(() => import("./SuperadminJobDirectorySection"));
const SuperadminCreateJobSection = lazy(() => import("./SuperadminCreateJobSection"));
const SuperadminJobApplicantsSection = lazy(() => import("./SuperadminJobApplicantsSection"));

type SectionType =
  | "overview"
  | "add-college"
  | `edit-institution-${number}`
  | "manage-college"
  | "add-course"
  | "manage-course"
  | "create-scholarship"
  | "manage-scholarship"
  | "add-entrance"
  | "manage-entrance"
  | "message-inquiry"
  | "create-news"
  | "manage-news"
  | "create-blog"
  | "manage-blog"
  | "create-event"
  | "manage-events"
  | "manage-campus-feed"
  | "add-user"
  | "user-management"
  | "analytics"
  | "manage-notification"
  | "access-control"
  | "payment"
  | "organization-profile"
  | "organization-settings"
  | "history"
  | "backup"
  | "settings"
  | "pending-providers"
  | "scholarship-provider"
  | "pending-institutions"
  | "student-overview"
  | "student-manage-user"
  | "student-faq"
  | "institution-overview"
  | "manage-profile-access"
  | "advertise-request"
  | "rejected-institutions"
  | "provider-overview"
  | "provider-calendar"
  | "provider-evaluation"
  | "assign-access"
  | "manage-ads"
  | "news-directory"
  | "events-directory"
  | "university-news"
  | "university-events"
  | "create-university-news"
  | "create-university-events"
  | "blogs-directory"
  | "manage-feedback"
  | "manage-faq"
  | "create-universities"
  | "draft-universities"
  | "list-universities"
  | `edit-university-${number}`
  | "map"
  | "superadmin-course-directory"
  | "superadmin-add-course"
  | "superadmin-entrance-directory"
  | "superadmin-create-entrance"
  | "superadmin-entrance-draft"
  | "superadmin-entrance-applicants"
  | "superadmin-entrance-results"
  | "superadmin-admission-directory"
  | "superadmin-create-admission"
  | "superadmin-admission-draft"
  | "superadmin-admission-applications"
  | "superadmin-admission-shortlist"
  | "global-course-directory"
  | "global-add-course"
  | "university-reviews"
  | "superadmin-job-directory"
  | "superadmin-create-job"
  | `superadmin-edit-job-${number}`
  | `superadmin-job-applicants-${number}`;

interface NavChild {
  section: SectionType;
  label: string;
}

interface NavItemData {
  icon: React.ReactNode;
  label: string;
  section: SectionType;
  children?: NavChild[];
}

const navItems: NavItemData[] = [
  {
    icon: <LayoutDashboard size={20} />,
    label: "Overview",
    section: "overview",
  },
  {
    icon: <GraduationCap size={20} />,
    label: "Student Management",
    section: "student-overview",
    children: [
      { section: "student-overview", label: "Overview" },
      { section: "student-manage-user", label: "User Management" },
      { section: "student-faq", label: "FAQ" },
    ],
  },
  {
    icon: <Building2 size={20} />,
    label: "Institution Management",
    section: "institution-overview",
    children: [
      { section: "add-college", label: "Add Institution" },
      { section: "manage-college", label: "All Institutions" },
      { section: "manage-profile-access", label: "Profile Access" },
      { section: "advertise-request", label: "Advertise Request" },
      {
        section: "pending-institutions",
        label: "Pending Institutions",
      },
      { section: "rejected-institutions", label: "Rejected Institutions" },
    ],
  },
  {
    icon: <BookOpen size={20} />,
    label: "Course Management",
    section: "superadmin-course-directory",
    children: [
      { section: "superadmin-course-directory", label: "Course Directory" },
      { section: "superadmin-add-course", label: "Add Course" },
    ],
  },
  {
    icon: <Globe size={20} />,
    label: "Global Course Management",
    section: "global-course-directory",
    children: [
      { section: "global-course-directory", label: "Course Directory" },
      { section: "global-add-course", label: "Add Course" },
    ],
  },
  {
    icon: <ClipboardList size={20} />,
    label: "Entrance Management",
    section: "superadmin-entrance-directory",
    children: [
      { section: "superadmin-create-entrance", label: "Add Entrance" },
      { section: "superadmin-entrance-draft", label: "Draft Entrances" },
      { section: "superadmin-entrance-directory", label: "All Entrances" },
      { section: "superadmin-entrance-applicants", label: "Applicants" },
      { section: "superadmin-entrance-results", label: "Results" },
    ],
  },
  {
    icon: <FileText size={20} />,
    label: "Admission Management",
    section: "superadmin-admission-directory",
    children: [
      { section: "superadmin-create-admission", label: "Add Admission" },
      { section: "superadmin-admission-draft", label: "Draft Admissions" },
      { section: "superadmin-admission-applications", label: "Applications" },
      {
        section: "superadmin-admission-directory",
        label: "Admission Directory",
      },
      { section: "superadmin-admission-shortlist", label: "Shortlist" },
    ],
  },
  { icon: <MapPin size={20} />, label: "College Map", section: "map" },
  {
    icon: <School size={20} />,
    label: "University Management",
    section: "create-universities",
    children: [
      { section: "create-universities", label: "Add University" },
      { section: "draft-universities", label: "Draft Universities" },
      { section: "list-universities", label: "All Universities" },
      { section: "university-reviews", label: "Reviews & Reports" },
      { section: "university-news", label: "University News" },
      { section: "university-events", label: "University Events" },
    ],
  },
  {
    icon: <HandHeart size={20} />,
    label: "Provider Management",
    section: "provider-overview",
    children: [
      { section: "provider-overview", label: "Overview" },
      { section: "manage-scholarship", label: "Scholarship Management" },
      { section: "pending-providers", label: "Pending Providers" },
      { section: "scholarship-provider", label: "Provider Directory" },
      { section: "provider-calendar", label: "Calendar" },
      { section: "provider-evaluation", label: "Evaluation & Results" },
      { section: "manage-news", label: "News Management" },
      { section: "manage-events", label: "Events Management" },
      { section: "manage-blog", label: "Blog Management" },
      { section: "assign-access", label: "Assign Access" },
    ],
  },
  {
    icon: <Briefcase size={20} />,
    label: "Hiring Management",
    section: "superadmin-job-directory",
    children: [
      { section: "superadmin-job-directory", label: "Job Directory" },
      { section: "superadmin-create-job", label: "Create Job" },
    ],
  },
  {
    icon: <ShieldCheck size={20} />,
    label: "Access Control",
    section: "access-control",
  },
  { icon: <CreditCard size={20} />, label: "Revenue", section: "payment" },
  { icon: <Megaphone size={20} />, label: "Ad Management", section: "manage-ads" },
  {
    icon: <Newspaper size={20} />,
    label: "News Management",
    section: "news-directory",
    children: [
      { section: "create-news", label: "Add News" },
      { section: "manage-news", label: "News Directory" },
    ],
  },
  {
    icon: <Calendar size={20} />,
    label: "Events Management",
    section: "events-directory",
    children: [
      { section: "create-event", label: "Add Event" },
      { section: "manage-events", label: "Events Directory" },
    ],
  },
  {
    icon: <FileText size={20} />,
    label: "Blog Management",
    section: "blogs-directory",
    children: [
      { section: "create-blog", label: "Add Blog" },
      { section: "manage-blog", label: "Blog Directory" },
    ],
  },
  {
    icon: <Building size={20} />,
    label: "Campus Feed Management",
    section: "manage-campus-feed",
  },
  {
    icon: <Bell size={20} />,
    label: "Notification Management",
    section: "manage-notification",
  },
  {
    icon: <MessageSquare size={20} />,
    label: "Feedback Management",
    section: "manage-feedback",
  },
  {
    icon: <HelpCircle size={20} />,
    label: "FAQ Management",
    section: "manage-faq",
  },
  {
    icon: <MessageSquare size={20} />,
    label: "Message Management",
    section: "message-inquiry",
  },
  { icon: <BarChart3 size={20} />, label: "Analytics", section: "analytics" },
  { icon: <Settings size={20} />, label: "Settings", section: "settings" },
];

export default function DashboardShell() {
  const [activeSection, setActiveSection] = useState<SectionType>("overview");
  const [dropdowns, setDropdowns] = useState<Record<string, boolean>>({});
  const [lockedSections, setLockedSections] = useState<Record<string, boolean>>(
    {},
  );
  const [adminUser, setAdminUser] = useState<{
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  } | null>(null);
  const [unreadInquiries, setUnreadInquiries] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  React.useEffect(() => {
    const stored = localStorage.getItem("superadmin_user");
    if (stored) {
      try {
        setAdminUser(JSON.parse(stored));
      } catch {
        /* ignore */
      }
    }
    apiService
      .getContactInquiries()
      .then((res) => {
        const inquiries: any[] = res?.data?.inquiries || [];
        setUnreadInquiries(
          inquiries.filter(
            (i: any) => i.status === "new" || i.status === "pending",
          ).length,
        );
      })
      .catch(() => {});
  }, []);

  const toggleDropdown = (name: string) => {
    setDropdowns((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const navigateTo = (section: string) => {
    setActiveSection(section as SectionType);
  };

  const handleLogout = useCallback(async () => {
    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("superadmin_token")
          : null;
      await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
    } catch {
    } finally {
      clearAllAuthSessions();
      clearCookie("superadmin_token");
      window.location.href = "/superadmin/login";
    }
  }, []);

  const renderSection = () => {
    if (activeSection.startsWith("edit-news-")) {
      const editId = parseInt(activeSection.replace("edit-news-", ""), 10);
      if (!isNaN(editId)) {
        return (
          <CreateNewsSection setActiveSection={navigateTo} editId={editId} />
        );
      }
    }
    if (activeSection.startsWith("edit-event-")) {
      const editId = parseInt(activeSection.replace("edit-event-", ""), 10);
      if (!isNaN(editId)) {
        return (
          <CreateEventSection setActiveSection={navigateTo} editId={editId} />
        );
      }
    }
    if (activeSection.startsWith("edit-university-news-")) {
      const editId = parseInt(activeSection.replace("edit-university-news-", ""), 10);
      if (!isNaN(editId)) {
        return <CreateUniversityNewsSection setActiveSection={navigateTo} editId={editId} />;
      }
    }
    if (activeSection.startsWith("edit-university-event-")) {
      const editId = parseInt(activeSection.replace("edit-university-event-", ""), 10);
      if (!isNaN(editId)) {
        return <CreateUniversityEventsSection setActiveSection={navigateTo} editId={editId} />;
      }
    }
    if (activeSection.startsWith("edit-blog-")) {
      const editId = parseInt(activeSection.replace("edit-blog-", ""), 10);
      if (!isNaN(editId)) {
        return (
          <CreateBlogSection setActiveSection={navigateTo} editId={editId} />
        );
      }
    }
    if (activeSection.startsWith("edit-institution-")) {
      const editId = parseInt(
        activeSection.replace("edit-institution-", ""),
        10,
      );
      if (!isNaN(editId)) {
        return (
          <AddCollegeSection setActiveSection={navigateTo} editId={editId} />
        );
      }
    }
    if (activeSection.startsWith("edit-university-")) {
      const editId = parseInt(
        activeSection.replace("edit-university-", ""),
        10,
      );
      if (!isNaN(editId)) {
        return (
          <AddUniversitySection setActiveSection={navigateTo} editId={editId} />
        );
      }
    }
    switch (activeSection) {
      case "overview":
        return <OverviewSection setActiveSection={navigateTo} />;
      case "manage-college":
        return <CollegeListSection setActiveSection={navigateTo} />;
      case "add-college":
        return <AddCollegeSection setActiveSection={navigateTo} />;
      case "manage-course":
        return <CourseListSection setActiveSection={navigateTo} />;
      case "add-course":
        return (
          <AddCourseSection
            setActiveSection={navigateTo}
            lockedSections={lockedSections}
            setLockedSections={setLockedSections}
          />
        );
      case "manage-scholarship":
        return <ScholarshipListSection setActiveSection={navigateTo} />;
      case "create-scholarship":
        return (
          <CreateScholarshipSection
            setActiveSection={navigateTo}
            lockedSections={lockedSections}
            setLockedSections={setLockedSections}
          />
        );
      case "manage-entrance":
        return <EntranceListSection setActiveSection={navigateTo} />;
      case "add-entrance":
        return <AddEntranceSection setActiveSection={navigateTo} />;
      case "message-inquiry":
        return <MessageInquirySection />;
      case "manage-news":
        return <NewsListSection setActiveSection={navigateTo} />;
      case "create-news":
        return <CreateNewsSection setActiveSection={navigateTo} />;
      case "manage-blog":
        return <BlogListSection setActiveSection={navigateTo} />;
      case "create-blog":
        return <CreateBlogSection setActiveSection={navigateTo} />;
      case "manage-events":
        return <EventListSection setActiveSection={navigateTo} />;
      case "create-event":
        return <CreateEventSection setActiveSection={navigateTo} />;
      case "manage-campus-feed":
        return <CampusFeedSection />;
      case "manage-notification":
        return <NotificationSection />;
      case "access-control":
        return <AccessControlSection />;
      case "payment":
        return <PaymentSection />;
      case "organization-profile":
        return <OrganizationProfileSection />;
      case "organization-settings":
        return <OrganizationSettingsSection />;
      case "history":
        return <HistorySection />;
      case "backup":
        return <BackupSection />;
      case "settings":
        return <SettingsSection />;
      case "user-management":
      case "student-manage-user":
        return <UserListSection />;
      case "add-user":
        return <AddUserSection setActiveSection={navigateTo} />;
      case "manage-profile-access":
        return <ManageProfileAccessSection />;
      case "advertise-request":
        return <AdvertiseRequestSection />;
      case "rejected-institutions":
        return <RejectedInstitutionsSection />;
      case "pending-institutions":
        return <PendingInstitutionsSection />;
      case "pending-providers":
        return <PendingProvidersSection />;
      case "scholarship-provider":
        return <VerifiedProvidersSection />;
      case "analytics":
        return <AnalyticsSection />;
      case "manage-ads":
        return <ManageAdsSection />;
      case "manage-feedback":
        return <FeedbackListSection />;
      case "manage-faq":
        return <FAQManageSection />;
      case "create-universities":
        return <AddUniversitySection setActiveSection={navigateTo} />;
      case "draft-universities":
        return <DraftUniversitiesSection setActiveSection={navigateTo} />;
      case "list-universities":
        return <ListUniversitiesSection setActiveSection={navigateTo} />;
      case "university-news":
        return <UniversityNewsSection setActiveSection={navigateTo} />;
      case "university-events":
        return <UniversityEventsSection setActiveSection={navigateTo} />;
      case "university-reviews":
        return <UniversityReviewSection setActiveSection={navigateTo} />;
      case "create-university-news":
        return <CreateUniversityNewsSection setActiveSection={navigateTo} />;
      case "create-university-events":
        return <CreateUniversityEventsSection setActiveSection={navigateTo} />;
      case "map":
        return <MapCollegeListSection />;
      case "superadmin-course-directory":
        return <SuperadminCourseListSection setActiveSection={navigateTo} />;
      case "superadmin-add-course":
        return <SuperadminAddCourseSection setActiveSection={navigateTo} />;
      case "global-course-directory":
        return <GlobalCourseListSection setActiveSection={navigateTo as any} />;
      case "global-add-course":
        return <GlobalCourseFormSection setActiveSection={navigateTo} />;
      case "superadmin-entrance-directory":
        return (
          <SuperadminEntranceDirectorySection setActiveSection={navigateTo} />
        );
      case "superadmin-create-entrance":
        return (
          <SuperadminCreateEntranceSection setActiveSection={navigateTo} />
        );
      case "superadmin-entrance-draft":
        return <SuperadminEntranceDraftSection setActiveSection={navigateTo} />;
      case "superadmin-entrance-applicants":
        return (
          <SuperadminEntranceApplicantsSection setActiveSection={navigateTo} />
        );
      case "superadmin-entrance-results":
        return (
          <SuperadminEntranceResultsSection setActiveSection={navigateTo} />
        );
      case "superadmin-admission-directory":
        return (
          <SuperadminAdmissionDirectorySection setActiveSection={navigateTo} />
        );
      case "superadmin-create-admission":
        return (
          <SuperadminCreateAdmissionSection setActiveSection={navigateTo} />
        );
      case "superadmin-admission-draft":
        return (
          <SuperadminAdmissionDraftSection setActiveSection={navigateTo} />
        );
      case "superadmin-admission-applications":
        return (
          <SuperadminAdmissionApplicationsSection
            setActiveSection={navigateTo}
          />
        );
      case "superadmin-admission-shortlist":
        return (
          <SuperadminAdmissionShortlistSection setActiveSection={navigateTo} />
        );
      case "superadmin-job-directory":
        return <SuperadminJobDirectorySection setActiveSection={navigateTo} />;
      case "superadmin-create-job":
        return <SuperadminCreateJobSection setActiveSection={navigateTo} />;
      default:
        if (activeSection.startsWith("superadmin-edit-job-")) {
          const editId = parseInt(activeSection.replace("superadmin-edit-job-", ""), 10);
          if (!isNaN(editId)) {
            return <SuperadminCreateJobSection setActiveSection={navigateTo} editId={editId} />;
          }
        }
        if (activeSection.startsWith("superadmin-job-applicants-")) {
          const jobId = parseInt(activeSection.replace("superadmin-job-applicants-", ""), 10);
          if (!isNaN(jobId)) {
            return <SuperadminJobApplicantsSection setActiveSection={navigateTo} jobId={jobId} />;
          }
        }
        return <PlaceholderSection section={activeSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans h-screen flex overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative top-0 left-0 z-50 w-80 h-full bg-white border-r border-gray-200 flex-shrink-0 flex flex-col transition-transform duration-300 shadow-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-50">
          <Image
            src="/studsphere.png"
            alt="StudySphere Logo"
            width={180}
            height={48}
            className="h-10 w-auto"
          />
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded md:hidden"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-4 flex flex-col gap-1">
          {navItems.map((item) =>
            item.children ? (
              <NavDropdown
                key={item.label}
                icon={item.icon}
                label={item.label}
                isOpen={!!dropdowns[item.label]}
                onToggle={() => toggleDropdown(item.label)}
              >
                {item.children.map((child) => (
                  <button
                    key={child.section}
                    type="button"
                    onClick={() => setActiveSection(child.section)}
                    className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeSection === child.section
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {child.label}
                  </button>
                ))}
              </NavDropdown>
            ) : (
              <NavItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                active={activeSection === item.section}
                onClick={() => setActiveSection(item.section)}
              />
            ),
          )}

          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-md transition-colors mt-2"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white flex items-center justify-between px-4 md:px-6 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-md"
            >
              <Menu size={20} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveSection("message-inquiry")}
              className="icon-btn-hover text-gray-400 hover:text-gray-600 transition-colors relative"
            >
              <MessageSquare size={22} />
              {unreadInquiries > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full px-1">
                  {unreadInquiries}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("manage-notification")}
              className="icon-btn-hover text-gray-400 hover:text-gray-600 transition-colors relative"
            >
              <Bell size={22} />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full px-1">
                  {unreadNotifications}
                </span>
              )}
            </button>

            <div className="pl-3 border-l border-gray-200 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-sm">
                {adminUser
                  ? (
                      adminUser.first_name.charAt(0) +
                      adminUser.last_name.charAt(0)
                    ).toUpperCase()
                  : "SA"}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {adminUser
                    ? `${adminUser.first_name} ${adminUser.last_name}`
                    : "Admin System"}
                </p>
                <p className="text-xs text-gray-500">
                  {adminUser?.role === "superadmin" ||
                  adminUser?.role === "super_admin"
                    ? "Super Admin"
                    : adminUser?.role || "Super Admin"}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Suspense fallback={<SectionLoader />}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                {renderSection()}
              </motion.div>
            </AnimatePresence>
          </Suspense>
        </main>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/45"
            onClick={() => setShowLogoutModal(false)}
          />
          <div className="relative w-full max-w-sm rounded-2xl bg-white px-5 pb-5 pt-6 shadow-lg sm:px-6 sm:pb-6 sm:pt-7">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 sm:h-14 sm:w-14">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-red-500 text-red-500">
                <span className="text-xl leading-none font-semibold">!</span>
              </div>
            </div>

            <div className="mx-auto max-w-xs text-center">
              <h3 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                Log out of your account?
              </h3>
              <p className="mt-2 text-[15px] leading-6 text-slate-500 sm:text-base">
                Are you sure you want to log out? You will need to re-enter your
                credentials to access your account.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-7">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="h-11 rounded-xl bg-slate-100 text-base font-medium text-slate-600 transition-colors hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutModal(false);
                  handleLogout();
                }}
                className="h-11 rounded-xl bg-red-600 text-base font-semibold text-white shadow-sm transition-colors hover:bg-red-700"
              >
                Yes, Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`nav-item flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors w-full ${
        active
          ? "active bg-blue-50 text-blue-600"
          : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
      }`}
    >
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </button>
  );
}

function NavDropdown({
  icon,
  label,
  isOpen,
  onToggle,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={onToggle}
        className="nav-item flex items-center justify-between px-3 py-2 rounded-md transition-colors w-full text-gray-700 hover:bg-blue-50 hover:text-blue-600"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-medium text-sm">{label}</span>
        </div>
        <ChevronRight
          size={14}
          className={`transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="pl-10 pr-3 py-2 flex flex-col gap-1">{children}</div>
      </div>
    </div>
  );
}

function PlaceholderSection({ section }: { section: string }) {
  return (
    <div className="flex h-60 items-center justify-center text-gray-400">
      <div className="text-center">
        <FileText size={40} className="mx-auto mb-3 opacity-50" />
        <p className="text-lg font-medium">Coming Soon</p>
        <p className="text-sm mt-1">
          {section.replace(/-/g, " ")} section is under development.
        </p>
      </div>
    </div>
  );
}

function SectionLoader() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
    </div>
  );
}
