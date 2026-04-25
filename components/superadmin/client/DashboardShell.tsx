"use client";

import React, { useState, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  GraduationCap,
  ClipboardList,
  MessageSquare,
  Newspaper,
  FileText,
  Calendar,
  Building,
  Users,
  BarChart3,
  Bell,
  ShieldCheck,
  CreditCard,
  Clock,
  Database,
  Settings,
  LogOut,
  Search,
  ChevronRight,
  UserPlus,
} from "lucide-react";

const OverviewSection = lazy(() => import("./OverviewSection"));
const CollegeListSection = lazy(() => import("./CollegeListSection"));
const AddCollegeSection = lazy(() => import("./AddCollegeSection"));
const CourseListSection = lazy(() => import("./CourseListSection"));
const AddCourseSection = lazy(() => import("./AddCourseSection"));
const ScholarshipListSection = lazy(() => import("./ScholarshipListSection"));
const CreateScholarshipSection = lazy(() => import("./CreateScholarshipSection"));
const UserListSection = lazy(() => import("./UserListSection"));
const AddUserSection = lazy(() => import("./AddUserSection"));
const AnalyticsSection = lazy(() => import("./AnalyticsSection"));
const ManagementPlaceholder = lazy(() => import("./ManagementPlaceholder"));

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
  | "settings";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", section: "overview" as SectionType },
  { icon: Building2, label: "Manage College", section: "manage-college" as SectionType, children: ["add-college", "manage-college"] as SectionType[] },
  { icon: BookOpen, label: "Manage Course", section: "manage-course" as SectionType, children: ["add-course", "manage-course"] as SectionType[] },
  { icon: GraduationCap, label: "Manage Scholarship", section: "manage-scholarship" as SectionType, children: ["create-scholarship", "manage-scholarship"] as SectionType[] },
  { icon: ClipboardList, label: "Manage Entrance", section: "manage-entrance" as SectionType, children: ["add-entrance", "manage-entrance"] as SectionType[] },
  { icon: MessageSquare, label: "Message/Inquiry", section: "message-inquiry" as SectionType },
  { icon: Newspaper, label: "Manage News", section: "manage-news" as SectionType, children: ["create-news", "manage-news"] as SectionType[] },
  { icon: FileText, label: "Manage Blogs", section: "manage-blog" as SectionType, children: ["create-blog", "manage-blog"] as SectionType[] },
  { icon: Calendar, label: "Manage Events", section: "manage-events" as SectionType, children: ["create-event", "manage-events"] as SectionType[] },
  { icon: Building, label: "Manage Campus Feed", section: "manage-campus-feed" as SectionType },
  { icon: Users, label: "User Management", section: "user-management" as SectionType, children: ["add-user", "user-management"] as SectionType[] },
  { icon: BarChart3, label: "Analytics", section: "analytics" as SectionType },
  { icon: Bell, label: "Manage Notification", section: "manage-notification" as SectionType },
  { icon: ShieldCheck, label: "Access Control", section: "access-control" as SectionType },
  { icon: CreditCard, label: "Payment", section: "payment" as SectionType },
  { icon: Building2, label: "Manage Organization", section: "organization-profile" as SectionType, children: ["organization-profile", "organization-settings"] as SectionType[] },
  { icon: Clock, label: "History", section: "history" as SectionType },
  { icon: Database, label: "Backup", section: "backup" as SectionType },
  { icon: Settings, label: "Settings", section: "settings" as SectionType },
];

export default function DashboardShell() {
  const [activeSection, setActiveSection] = useState<SectionType>("overview");
  const [dropdowns, setDropdowns] = useState<Record<string, boolean>>({});
  const [lockedSections, setLockedSections] = useState<Record<string, boolean>>({});

  const toggleDropdown = (name: string) => {
    setDropdowns((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewSection setActiveSection={setActiveSection} />;
      case "manage-college":
        return <CollegeListSection setActiveSection={setActiveSection} />;
      case "add-college":
        return <AddCollegeSection setActiveSection={setActiveSection} lockedSections={lockedSections} setLockedSections={setLockedSections} />;
      case "manage-course":
        return <CourseListSection setActiveSection={setActiveSection} />;
      case "add-course":
        return <AddCourseSection setActiveSection={setActiveSection} />;
      case "manage-scholarship":
        return <ScholarshipListSection setActiveSection={setActiveSection} />;
      case "create-scholarship":
        return <CreateScholarshipSection setActiveSection={setActiveSection} />;
      case "user-management":
        return <UserListSection setActiveSection={setActiveSection} />;
      case "add-user":
        return <AddUserSection setActiveSection={setActiveSection} />;
      case "analytics":
        return <AnalyticsSection />;
      default:
        return <ManagementPlaceholder title={getSectionTitle(activeSection)} icon={getSectionIcon(activeSection)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-gray-800">
      <div className="flex min-h-screen">
        <aside className="fixed left-0 top-0 bottom-0 z-50 w-[280px] overflow-y-auto border-r border-[#e2e8f0] bg-white hide-scrollbar">
          <div className="flex items-center justify-center border-b border-[#e2e8f0] p-5">
            <Image
              src="/studsphere.png"
              alt="Logo"
              width={180}
              height={48}
              className="h-12 w-auto"
            />
          </div>

          <nav className="space-y-1 p-4">
            {navItems.map((item) =>
              item.children ? (
                <NavDropdown
                  key={item.label}
                  icon={<item.icon size={20} />}
                  label={item.label}
                  isOpen={!!dropdowns[item.label]}
                  onToggle={() => toggleDropdown(item.label)}
                >
                  {item.children.map((child) => (
                    <SubNavItem
                      key={child}
                      label={prettyLabel(child)}
                      active={activeSection === child}
                      onClick={() => setActiveSection(child)}
                    />
                  ))}
                </NavDropdown>
              ) : (
                <NavItem
                  key={item.label}
                  icon={<item.icon size={20} />}
                  label={item.label}
                  active={activeSection === item.section}
                  onClick={() => setActiveSection(item.section)}
                />
              ),
            )}

            <div className="mt-4 border-t border-gray-100 pt-4">
              <NavItem
                icon={<LogOut size={20} />}
                label="Logout"
                active={false}
                onClick={() => undefined}
                className="text-red-500 hover:bg-red-50 hover:text-red-600"
              />
            </div>
          </nav>
        </aside>

        <main className="ml-[280px] flex min-h-screen flex-1 flex-col">
          <Header />

          <div className="flex-1 overflow-y-auto p-8">
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
          </div>
        </main>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[#e2e8f0] bg-white px-8 py-3">
      <div className="flex items-center border border-[#e2e8f0] bg-gray-50 px-4 py-2 transition-all focus-within:border-blue-600 focus-within:bg-white rounded-lg w-[500px]">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search colleges, courses, users..."
          className="ml-2 w-full border-none bg-transparent text-sm outline-none"
        />
      </div>

      <div className="flex items-center gap-4">
        <IconButton badge={5} icon={<Bell size={20} />} />
        <IconButton badge={12} icon={<MessageSquare size={20} />} />
        <div className="group flex cursor-pointer items-center gap-3 border-l border-gray-100 pl-4">
          <div className="text-right">
            <p className="text-sm font-semibold leading-tight text-gray-900">Superadmin</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Super Administrator</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-md transition-transform group-hover:scale-105">
            SA
          </div>
        </div>
      </div>
    </header>
  );
}

function NavItem({
  icon,
  label,
  active,
  onClick,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-bold transition-colors ${
        active ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
      } ${className}`}
    >
      {icon}
      <span>{label}</span>
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
    <div>
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-bold transition-colors ${
          isOpen ? "text-blue-600" : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
        }`}
      >
        <span className="flex items-center gap-3">
          {icon}
          {label}
        </span>
        <ChevronRight size={16} className={`transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`} />
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        className="mx-2 overflow-hidden rounded-lg bg-gray-50/50"
      >
        <div className="ml-6 space-y-1 px-4 py-1">{children}</div>
      </motion.div>
    </div>
  );
}

function SubNavItem({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-md px-3 py-2 text-left text-xs font-bold transition-all ${
        active ? "bg-blue-100/50 text-blue-600" : "text-gray-500 hover:bg-white hover:text-blue-600"
      }`}
    >
      {label}
    </button>
  );
}

function IconButton({ icon, badge }: { icon: React.ReactNode; badge?: number }) {
  return (
    <button type="button" className="relative rounded-lg p-2.5 text-gray-500 transition-all hover:bg-gray-100 hover:text-blue-600">
      {icon}
      {typeof badge === "number" ? (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 text-[10px] font-bold text-white">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

function prettyLabel(section: SectionType) {
  const map: Record<string, string> = {
    "add-college": "Add College",
    "manage-college": "College List",
    "add-course": "Add Course",
    "manage-course": "Course List",
    "create-scholarship": "Create Scholarship",
    "manage-scholarship": "Scholarship List",
    "add-entrance": "Add Entrance",
    "manage-entrance": "Entrance List",
    "create-news": "Create News",
    "manage-news": "News List",
    "create-blog": "Create Blog",
    "manage-blog": "Blog List",
    "create-event": "Create Event",
    "manage-events": "Events List",
    "manage-campus-feed": "Campus Feed",
    "add-user": "Add User",
    "user-management": "User List",
    "manage-notification": "Manage Notification",
    "access-control": "Access Control",
    "organization-profile": "Organization Profile",
    "organization-settings": "Organization Settings",
  };
  return map[section] || section.replace(/-/g, " ");
}

function getSectionTitle(section: SectionType): string {
  const titles: Record<SectionType, string> = {
    "manage-news": "Manage News",
    "create-news": "Create News",
    "manage-blog": "Manage Blogs",
    "create-blog": "Create Blog",
    "manage-events": "Manage Events",
    "create-event": "Create Event",
    "manage-campus-feed": "Campus Feed",
    "message-inquiry": "Message / Inquiry",
    "manage-entrance": "Manage Entrance",
    "add-entrance": "Add Entrance",
    "manage-notification": "Notifications",
    "access-control": "Access Control",
    payment: "Payment",
    "organization-profile": "Organization Profile",
    "organization-settings": "Organization Settings",
    history: "History",
    backup: "Backup",
    settings: "Settings",
    overview: "Overview",
    "add-college": "Add College",
    "manage-college": "College List",
    "add-course": "Add Course",
    "manage-course": "Course List",
    "create-scholarship": "Create Scholarship",
    "manage-scholarship": "Scholarship List",
    "add-user": "Add User",
    "user-management": "User Management",
    analytics: "Analytics",
  };
  return titles[section];
}

function getSectionIcon(section: SectionType) {
  const icons: Record<SectionType, React.ReactNode> = {
    "manage-news": <Newspaper className="h-6 w-6 text-blue-600" />,
    "create-news": <Newspaper className="h-6 w-6 text-blue-600" />,
    "manage-blog": <FileText className="h-6 w-6 text-blue-600" />,
    "create-blog": <FileText className="h-6 w-6 text-blue-600" />,
    "manage-events": <Calendar className="h-6 w-6 text-blue-600" />,
    "create-event": <Calendar className="h-6 w-6 text-blue-600" />,
    "manage-campus-feed": <Building className="h-6 w-6 text-blue-600" />,
    "message-inquiry": <MessageSquare className="h-6 w-6 text-blue-600" />,
    "manage-entrance": <ClipboardList className="h-6 w-6 text-blue-600" />,
    "add-entrance": <ClipboardList className="h-6 w-6 text-blue-600" />,
    "manage-notification": <Bell className="h-6 w-6 text-blue-600" />,
    "access-control": <ShieldCheck className="h-6 w-6 text-blue-600" />,
    payment: <CreditCard className="h-6 w-6 text-blue-600" />,
    "organization-profile": <Building2 className="h-6 w-6 text-blue-600" />,
    "organization-settings": <Settings className="h-6 w-6 text-blue-600" />,
    history: <Clock className="h-6 w-6 text-blue-600" />,
    backup: <Database className="h-6 w-6 text-blue-600" />,
    settings: <Settings className="h-6 w-6 text-blue-600" />,
    overview: <LayoutDashboard className="h-6 w-6 text-blue-600" />,
    "add-college": <Building2 className="h-6 w-6 text-blue-600" />,
    "manage-college": <Building2 className="h-6 w-6 text-blue-600" />,
    "add-course": <BookOpen className="h-6 w-6 text-blue-600" />,
    "manage-course": <BookOpen className="h-6 w-6 text-blue-600" />,
    "create-scholarship": <GraduationCap className="h-6 w-6 text-blue-600" />,
    "manage-scholarship": <GraduationCap className="h-6 w-6 text-blue-600" />,
    "add-user": <UserPlus className="h-6 w-6 text-blue-600" />,
    "user-management": <Users className="h-6 w-6 text-blue-600" />,
    analytics: <BarChart3 className="h-6 w-6 text-blue-600" />,
  };
  return icons[section];
}

function SectionLoader() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
    </div>
  );
}
