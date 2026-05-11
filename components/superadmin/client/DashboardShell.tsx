"use client";

import React, { useState, lazy, Suspense, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { clearAllAuthSessions, clearCookie } from "@/services/authSession";
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
  BookOpen,
} from "lucide-react";

const OverviewSection = lazy(() => import("./OverviewSection"));
const CollegeListSection = lazy(() => import("./CollegeListSection"));
const AddCollegeSection = lazy(() => import("./AddCollegeSection"));
const CourseListSection = lazy(() => import("./CourseListSection"));
const AddCourseSection = lazy(() => import("./AddCourseSection"));
const ScholarshipListSection = lazy(() => import("./ScholarshipListSection"));
const CreateScholarshipSection = lazy(() => import("./CreateScholarshipSection"));
const EntranceListSection = lazy(() => import("./EntranceListSection"));
const AddEntranceSection = lazy(() => import("./AddEntranceSection"));
const MessageInquirySection = lazy(() => import("./MessageInquirySection"));
const NewsListSection = lazy(() => import("./NewsListSection"));
const CreateNewsSection = lazy(() => import("./CreateNewsSection"));
const BlogListSection = lazy(() => import("./BlogListSection"));
const CreateBlogSection = lazy(() => import("./CreateBlogSection"));
const EventListSection = lazy(() => import("./EventListSection"));
const CreateEventSection = lazy(() => import("./CreateEventSection"));
const CampusFeedSection = lazy(() => import("./CampusFeedSection"));
const NotificationSection = lazy(() => import("./NotificationSection"));
const AccessControlSection = lazy(() => import("./AccessControlSection"));
const PaymentSection = lazy(() => import("./PaymentSection"));
const OrganizationProfileSection = lazy(() => import("./OrganizationProfileSection"));
const OrganizationSettingsSection = lazy(() => import("./OrganizationSettingsSection"));
const HistorySection = lazy(() => import("./HistorySection"));
const BackupSection = lazy(() => import("./BackupSection"));
const SettingsSection = lazy(() => import("./SettingsSection"));
const UserListSection = lazy(() => import("./UserListSection"));
const AddUserSection = lazy(() => import("./AddUserSection"));
const AnalyticsSection = lazy(() => import("./AnalyticsSection"));
const PendingProvidersSection = lazy(() => import("./PendingProvidersSection"));
const VerifiedProvidersSection = lazy(() => import("./VerifiedProvidersSection"));
const PendingInstitutionsSection = lazy(() => import("./PendingInstitutionsSection"));
const ManageProfileAccessSection = lazy(() => import("./ManageProfileAccessSection"));
const AdvertiseRequestSection = lazy(() => import("./AdvertiseRequestSection"));
const RejectedInstitutionsSection = lazy(() => import("./RejectedInstitutionsSection"));

type SectionType =
  | "overview"
  | "add-college"
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
  | "blogs-directory";

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
  { icon: <LayoutDashboard size={20} />, label: "Overview", section: "overview" },
  { icon: <GraduationCap size={20} />, label: "Student Dashboard", section: "student-overview", children: [{ section: "student-overview", label: "Overview" }, { section: "student-manage-user", label: "Manage User" }, { section: "student-faq", label: "FAQ" }] },
  { icon: <Building2 size={20} />, label: "Institution Dashboard", section: "institution-overview", children: [{ section: "institution-overview", label: "Overview" }, { section: "add-college", label: "Create Institution" }, { section: "manage-college", label: "Listed Institutions" }, { section: "manage-profile-access", label: "Manage Profile Access" }, { section: "advertise-request", label: "Advertise Request" }, { section: "pending-institutions", label: "Pending Institutions Request" }, { section: "rejected-institutions", label: "Rejected Institutions" }] },
  { icon: <HandHeart size={20} />, label: "Provider Dashboard", section: "provider-overview", children: [{ section: "provider-overview", label: "Overview" }, { section: "manage-scholarship", label: "Manage Scholarship" }, { section: "pending-providers", label: "Pending Providers" }, { section: "scholarship-provider", label: "Scholarship Provider" }, { section: "provider-calendar", label: "Calendar" }, { section: "provider-evaluation", label: "Evaluation & Results" }, { section: "manage-news", label: "Manage News" }, { section: "manage-events", label: "Manage Events" }, { section: "manage-blog", label: "Manage Blogs" }, { section: "assign-access", label: "Assign Access" }] },
  { icon: <ShieldCheck size={20} />, label: "Assign Access", section: "access-control" },
  { icon: <CreditCard size={20} />, label: "Revenue", section: "payment" },
  { icon: <Megaphone size={20} />, label: "Manage Ads", section: "manage-ads" },
  { icon: <Newspaper size={20} />, label: "News", section: "news-directory", children: [{ section: "create-news", label: "Create News" }, { section: "manage-news", label: "News Directory" }] },
  { icon: <Calendar size={20} />, label: "Events", section: "events-directory", children: [{ section: "create-event", label: "Create Events" }, { section: "manage-events", label: "Events Directory" }] },
  { icon: <FileText size={20} />, label: "Blogs", section: "blogs-directory", children: [{ section: "create-blog", label: "Create Blogs" }, { section: "manage-blog", label: "Blogs Directory" }] },
  { icon: <Building size={20} />, label: "Manage Campus Feed", section: "manage-campus-feed" },
  { icon: <Bell size={20} />, label: "Notification", section: "manage-notification" },
  { icon: <MessageSquare size={20} />, label: "Message", section: "message-inquiry" },
  { icon: <BarChart3 size={20} />, label: "Analytics", section: "analytics" },
  { icon: <Settings size={20} />, label: "Settings", section: "settings" },
];

export default function DashboardShell() {
  const [activeSection, setActiveSection] = useState<SectionType>("overview");
  const [dropdowns, setDropdowns] = useState<Record<string, boolean>>({});
  const [lockedSections, setLockedSections] = useState<Record<string, boolean>>({});

  const toggleDropdown = (name: string) => {
    setDropdowns((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const navigateTo = (section: string) => {
    setActiveSection(section as SectionType);
  };

  const handleLogout = useCallback(async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const token = typeof window !== "undefined" ? localStorage.getItem("superadmin_token") : null;
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
        return <AddCourseSection setActiveSection={navigateTo} lockedSections={lockedSections} setLockedSections={setLockedSections} />;
      case "manage-scholarship":
        return <ScholarshipListSection setActiveSection={navigateTo} />;
      case "create-scholarship":
        return <CreateScholarshipSection setActiveSection={navigateTo} lockedSections={lockedSections} setLockedSections={setLockedSections} />;
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
        return <UserListSection setActiveSection={navigateTo} />;
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
      default:
        return <PlaceholderSection section={activeSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans h-screen flex overflow-hidden">
      <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-gray-50">
          <Image src="/studsphere.png" alt="StudySphere Logo" width={180} height={48} className="h-10 w-auto" />
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
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-md transition-colors mt-2"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white flex items-center justify-end px-6 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <button type="button" className="icon-btn-hover text-gray-400 hover:text-gray-600 transition-colors relative">
              <MessageSquare size={22} />
              <span className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full px-1">3</span>
            </button>
            <button type="button" className="icon-btn-hover text-gray-400 hover:text-gray-600 transition-colors relative">
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full px-1">5</span>
            </button>

            <div className="pl-3 border-l border-gray-200 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-sm">
                SA
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Admin System</p>
                <p className="text-xs text-gray-500">Super Admin</p>
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
        active ? "active bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
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
        <ChevronRight size={14} className={`transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`} />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
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
        <p className="text-sm mt-1">{section.replace(/-/g, " ")} section is under development.</p>
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
