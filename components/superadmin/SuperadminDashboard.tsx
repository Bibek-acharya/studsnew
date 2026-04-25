"use client";

import React, { useState } from "react";
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
  Plus,
  Download,
  Filter,
  Check,
  Trash2,
  Mail,
  Eye,
  MapPin,
  CheckCircle,
  Phone,
  ArrowRight,
  UserPlus,
  Image as ImageIcon,
  Bold,
  Italic,
  Underline,
  List as ListIcon,
  Link as LinkIcon,
  Undo,
  Redo,
  CloudUpload,
  X,
  Award,
  Images,
  Percent,
  CircleAlert,
} from "lucide-react";

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

const activities = [
  { title: "New student registered", meta: "Anjali Sharma - 2h ago", icon: <UserPlus className="h-4 w-4" />, tone: "blue" as const },
  { title: "College approved", meta: "Sowers College - 5h ago", icon: <CheckCircle className="h-4 w-4" />, tone: "green" as const },
  { title: "New course added", meta: "BBA Program - 1d ago", icon: <FileText className="h-4 w-4" />, tone: "purple" as const },
  { title: "Payment received", meta: "Rs 50,000 - 2d ago", icon: <CreditCard className="h-4 w-4" />, tone: "amber" as const },
  { title: "New inquiry received", meta: "Ramesh Magar - 3d ago", icon: <MessageSquare className="h-4 w-4" />, tone: "red" as const },
];

const accessRows = [
  { initials: "AU", name: "Admin User", email: "admin@sowersaction.org", role: "Administrator", status: "Active", lastActive: "Now" },
  { initials: "EU", name: "Editor User", email: "editor@sowersaction.org", role: "Editor", status: "Active", lastActive: "2 hours ago" },
  { initials: "SM", name: "Scholarship Manager", email: "scholarship@sowersaction.org", role: "Scholarship Manager", status: "Active", lastActive: "1 hour ago" },
];

const colleges = [
  { sn: 1, date: "Apr 15, 2026", name: "Sowers College", reg: "12345/078", type: "Private", level: "+2", address: "Kathmandu, Ward-8", students: 245, status: "Verified", label: "SC" },
  { sn: 2, date: "Apr 12, 2026", name: "Kathmandu College", reg: "67890/079", type: "Community", level: "Bachelor", address: "Lalitpur, Ward-5", students: 180, status: "Pending", label: "KC" },
];

export default function SuperadminDashboard() {
  const [activeSection, setActiveSection] = useState<SectionType>("overview");
  const [dropdowns, setDropdowns] = useState<Record<string, boolean>>({});
  const [lockedSections, setLockedSections] = useState<Record<string, boolean>>({});

  const toggleDropdown = (name: string) => {
    setDropdowns((prev) => ({ ...prev, [name]: !prev[name] }));
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

          <div className="flex-1 overflow-y-auto p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeSection === "overview" && <OverviewSection setActiveSection={setActiveSection} />}
                {activeSection === "manage-college" && <CollegeListSection setActiveSection={setActiveSection} />}
                {activeSection === "add-college" && (
                  <AddCollegeSection
                    setActiveSection={setActiveSection}
                    lockedSections={lockedSections}
                    setLockedSections={setLockedSections}
                  />
                )}
                {activeSection === "manage-course" && <CourseListSection setActiveSection={setActiveSection} />}
                {activeSection === "add-course" && <AddCourseSection setActiveSection={setActiveSection} />}
                {activeSection === "manage-scholarship" && <ScholarshipListSection setActiveSection={setActiveSection} />}
                {activeSection === "create-scholarship" && <CreateScholarshipSection setActiveSection={setActiveSection} />}
                {activeSection === "user-management" && <UserListSection setActiveSection={setActiveSection} />}
                {activeSection === "add-user" && <AddUserSection setActiveSection={setActiveSection} />}
                {activeSection === "analytics" && <AnalyticsSection />}
                {activeSection === "manage-news" && <ManagementPlaceholder title="Manage News" icon={<Newspaper className="h-6 w-6 text-blue-600" />} />}
                {activeSection === "create-news" && <ManagementPlaceholder title="Create News" icon={<Newspaper className="h-6 w-6 text-blue-600" />} />}
                {activeSection === "manage-blog" && <ManagementPlaceholder title="Manage Blogs" icon={<FileText className="h-6 w-6 text-blue-600" />} />}
                {activeSection === "create-blog" && <ManagementPlaceholder title="Create Blog" icon={<FileText className="h-6 w-6 text-blue-600" />} />}
                {activeSection === "manage-events" && <ManagementPlaceholder title="Manage Events" icon={<Calendar className="h-6 w-6 text-blue-600" />} />}
                {activeSection === "create-event" && <ManagementPlaceholder title="Create Event" icon={<Calendar className="h-6 w-6 text-blue-600" />} />}
                {activeSection === "manage-campus-feed" && <ManagementPlaceholder title="Campus Feed" icon={<Building className="h-6 w-6 text-blue-600" />} />}
                {activeSection === "message-inquiry" && <ManagementPlaceholder title="Message / Inquiry" icon={<MessageSquare className="h-6 w-6 text-blue-600" />} />}
                {activeSection === "manage-entrance" && <ManagementPlaceholder title="Manage Entrance" icon={<ClipboardList className="h-6 w-6 text-blue-600" />} />}
                {activeSection === "add-entrance" && <ManagementPlaceholder title="Add Entrance" icon={<ClipboardList className="h-6 w-6 text-blue-600" />} />}
                {activeSection === "manage-notification" && <ManagementPlaceholder title="Notifications" icon={<Bell className="h-6 w-6 text-blue-600" />} />}
                {activeSection === "access-control" && <ManagementPlaceholder title="Access Control" icon={<ShieldCheck className="h-6 w-6 text-blue-600" />} />}
                {activeSection === "payment" && <ManagementPlaceholder title="Payment" icon={<CreditCard className="h-6 w-6 text-blue-600" />} />}
                {activeSection === "organization-profile" && <ManagementPlaceholder title="Organization Profile" icon={<Building2 className="h-6 w-6 text-blue-600" />} />}
                {activeSection === "organization-settings" && <ManagementPlaceholder title="Organization Settings" icon={<Settings className="h-6 w-6 text-blue-600" />} />}
                {activeSection === "history" && <ManagementPlaceholder title="History" icon={<Clock className="h-6 w-6 text-blue-600" />} />}
                {activeSection === "backup" && <ManagementPlaceholder title="Backup" icon={<Database className="h-6 w-6 text-blue-600" />} />}
                {activeSection === "settings" && <ManagementPlaceholder title="Settings" icon={<Settings className="h-6 w-6 text-blue-600" />} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
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

function OverviewSection({ setActiveSection }: { setActiveSection: (s: SectionType) => void }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <StatCard icon={<Users size={24} />} value="3,847" label="Total Users" change="+12.5% from last month" gradient="from-blue-500 to-blue-600" />
        <StatCard icon={<Building size={24} />} value="12" label="Total Colleges" change="+2 new this month" gradient="from-green-500 to-green-600" />
        <StatCard icon={<BookOpen size={24} />} value="48" label="Total Courses" change="Across all colleges" gradient="from-purple-500 to-purple-600" />
        <StatCard icon={<CreditCard size={24} />} value="Rs 892K" label="Total Revenue" change="+15.3% from last month" gradient="from-orange-500 to-orange-600" />
        <StatCard icon={<CircleAlert size={24} />} value="23" label="Pending Actions" change="Requires attention" gradient="from-red-500 to-red-600" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-1">
          <SimpleStatCard icon={<GraduationCap size={20} className="text-blue-600" />} value="24" label="Active Scholarships" bg="bg-blue-100" />
          <SimpleStatCard icon={<ClipboardList size={20} className="text-green-600" />} value="8" label="Entrance Exams" bg="bg-green-100" />
          <SimpleStatCard icon={<Newspaper size={20} className="text-purple-600" />} value="89" label="News Published" bg="bg-purple-100" />
          <SimpleStatCard icon={<Calendar size={20} className="text-yellow-600" />} value="45" label="Events Organized" bg="bg-yellow-100" />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 lg:col-span-2">
          <h3 className="mb-4 text-sm font-bold text-gray-900">Recent Activities</h3>
          <div className="space-y-3">
            {activities.map((item) => (
              <ActivityItem key={item.title} icon={item.icon} title={item.title} sub={item.meta} tone={item.tone} />
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-bold text-gray-800">Calendar</h2>
            <div className="flex items-center gap-3 rounded-full bg-blue-50 px-3 py-1">
              <button type="button" className="text-gray-500 hover:text-blue-600">
                <ChevronRight size={16} className="rotate-180" />
              </button>
              <span className="text-xs font-bold text-gray-700">April 2026</span>
              <button type="button" className="text-gray-500 hover:text-blue-600">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-400">
              {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 30 }, (_, index) => index + 1).map((day) => (
                <div
                  key={day}
                  className={`flex aspect-square cursor-pointer items-center justify-center rounded-full text-xs transition-all ${
                    day === 24 ? "bg-blue-600 font-bold text-white" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Upcoming Events</h4>
              <NextEventItem color="purple" time="09:00 - 09:45 AM" title="Leadership Training Session" />
              <NextEventItem color="orange" time="11:15 - 12:00 AM" title="Scholarship Review Meeting" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-base font-bold text-gray-900">
            <ShieldCheck size={20} className="text-blue-600" /> Current Access Holders
          </h3>
          <button type="button" onClick={() => setActiveSection("access-control")} className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700">
            Manage Access <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-600">User</th>
                <th className="px-4 py-3 text-left font-bold text-gray-600">Email</th>
                <th className="px-4 py-3 text-center font-bold text-gray-600">Role</th>
                <th className="px-4 py-3 text-center font-bold text-gray-600">Status</th>
                <th className="px-4 py-3 text-center font-bold text-gray-600">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {accessRows.map((row) => (
                <AccessRow key={row.email} {...row} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CollegeListSection({ setActiveSection }: { setActiveSection: (s: SectionType) => void }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <Building2 size={24} className="text-blue-600" /> College List
          </h2>
          <p className="mt-1 text-sm text-gray-500">Manage and track all registered colleges in the system</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" className="flex items-center gap-2 rounded-md border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50">
            <Download size={18} /> Export
          </button>
          <button type="button" onClick={() => setActiveSection("add-college")} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-200">
            <Plus size={18} /> Add College
          </button>
        </div>
      </div>

      <div className="mb-8 flex items-center gap-2 overflow-x-auto border-b border-gray-100 pb-2">
        <TabItem label="+2 College" count={12} active icon={<GraduationCap size={16} />} />
        <TabItem label="Bachelor" count={8} />
        <TabItem label="A Level" count={3} />
        <TabItem label="CTEVT" count={5} />
        <TabItem label="Master" count={4} />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-5">
        <div className="relative md:col-span-2">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by college name, reg. number..." className="h-11 w-full rounded-md border border-gray-200 pl-10 pr-4 text-sm outline-none focus:border-blue-600" />
        </div>
        <select className="h-11 rounded-md border border-gray-200 px-3 text-sm outline-none focus:border-blue-600">
          <option>All Types</option>
        </select>
        <select className="h-11 rounded-md border border-gray-200 px-3 text-sm outline-none focus:border-blue-600">
          <option>All Payment Status</option>
        </select>
        <button type="button" className="flex h-11 items-center justify-center gap-2 rounded-md bg-gray-100 px-4 text-sm font-bold text-gray-700 hover:bg-gray-200">
          <Filter size={16} /> More Filters
        </button>
      </div>

      <div className="mb-6 flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/50 p-4">
        <div className="flex items-center gap-4">
          <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          <span className="text-sm font-semibold text-gray-700">4 colleges selected</span>
        </div>
        <div className="flex items-center gap-2">
          <BulkBtn icon={<Mail size={14} />} label="Send Email" />
          <BulkBtn icon={<Check size={14} />} label="Verify Selected" />
          <BulkBtn icon={<Trash2 size={14} />} label="Delete" className="text-red-600" />
        </div>
      </div>

      <div className="mb-6 overflow-hidden rounded-xl border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-[2000px] w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="w-12 px-4 py-4 text-left"><input type="checkbox" className="h-4 w-4" /></th>
                <th className="w-16 px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600">S.N</th>
                <th className="w-44 px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Register Date</th>
                <th className="w-80 px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600">College Name</th>
                <th className="w-32 px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-600">Type</th>
                <th className="w-32 px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-600">Level</th>
                <th className="w-64 px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Address</th>
                <th className="w-44 px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-600">Students</th>
                <th className="w-32 px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-600">Status</th>
                <th className="w-48 px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {colleges.map((college) => (
                <CollegeRow key={college.sn} {...college} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-6">
        <p className="text-sm text-gray-500">
          Showing <span className="font-bold text-gray-900">1-2</span> of <span className="font-bold text-gray-900">24</span> colleges
        </p>
        <div className="flex items-center gap-2">
          <PageBtn icon={<ChevronRight size={16} className="rotate-180" />} disabled />
          <PageBtn label="1" active />
          <PageBtn label="2" />
          <PageBtn label="3" />
          <PageBtn icon={<ChevronRight size={16} />} />
        </div>
      </div>
    </div>
  );
}

function AddCollegeSection({
  setActiveSection,
  lockedSections,
  setLockedSections,
}: {
  setActiveSection: (s: SectionType) => void;
  lockedSections: Record<string, boolean>;
  setLockedSections: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}) {
  const toggleLock = (sid: string) => {
    setLockedSections((prev) => ({ ...prev, [sid]: !prev[sid] }));
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Add New College</h2>
          <p className="mt-1 text-gray-500">Register a new educational institution to the system</p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => setActiveSection("manage-college")} className="rounded-md border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button type="button" className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-200">
            Save College
          </button>
        </div>
      </div>

      <FormCard
        id="basic"
        title="Basic Information"
        sub="Essential details about the college"
        icon={<Building2 size={24} className="text-blue-600" />}
        locked={lockedSections.basic}
        onToggleLock={() => toggleLock("basic")}
      >
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700">Cover/Banner Photo <span className="text-red-500">*</span></label>
            <div className="cursor-pointer rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center transition-all hover:border-blue-400 hover:bg-blue-50/50">
              <div className="mb-4 flex h-40 w-full items-center justify-center rounded-xl bg-gray-50 transition-colors group-hover:bg-blue-100">
                <ImageIcon size={48} className="text-gray-400" />
              </div>
              <p className="text-sm font-bold text-gray-700">Upload Cover Photo</p>
              <p className="mt-1 text-xs text-gray-400">Recommended: 1200x400px (Wide Rectangular)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700">College Logo</label>
              <div className="cursor-pointer rounded-xl border-2 border-dashed border-gray-200 p-6 text-center transition-all hover:border-blue-400 hover:bg-blue-50/50">
                <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 transition-colors">
                  <ImageIcon size={24} className="text-gray-400" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Upload PNG</p>
              </div>
            </div>
            <div className="space-y-6 md:col-span-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">College Name <span className="text-red-500">*</span></label>
                <input type="text" className="input-field" placeholder="e.g., GoldenGate International College" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">Location <span className="text-red-500">*</span></label>
                <input type="text" className="input-field" placeholder="e.g., Kamalpokhari, Kathmandu" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <FormInput label="College Level" type="select" options={["+2 College", "Bachelor", "Master"]} required />
            <FormInput label="College Type" type="select" options={["Public", "Private", "Community"]} required />
            <FormInput label="Affiliation" type="select" options={["Tribhuvan University", "Kathmandu University"]} required />
            <FormInput label="Establishment Date" type="date" />
          </div>
        </div>
      </FormCard>

      <FormCard
        id="contact"
        title="Contact Information"
        sub="Primary contact details for administration"
        icon={<Phone size={24} className="text-green-600" />}
        locked={lockedSections.contact}
        onToggleLock={() => toggleLock("contact")}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormInput label="Contact Person Name" placeholder="e.g., Ram Sharma" required />
          <FormInput label="Designation" placeholder="e.g., Principal" required />
          <FormInput label="Phone Number" placeholder="+977-1-XXXXXXX" required />
          <FormInput label="Email Address" placeholder="info@college.edu.np" required />
          <div className="md:col-span-2">
            <FormInput label="Physical Address" type="textarea" placeholder="Street address, city, province..." />
          </div>
        </div>
      </FormCard>

      <FormCard
        id="extra"
        title="About & Gallery"
        sub="Tell students more with photos and descriptions"
        icon={<Images size={24} className="text-purple-600" />}
        locked={lockedSections.extra}
        onToggleLock={() => toggleLock("extra")}
      >
        <div className="space-y-8">
          <div className="space-y-4">
            <label className="text-sm font-bold text-gray-700">College Description</label>
            <div className="overflow-hidden rounded-xl border border-gray-200 transition-all focus-within:border-blue-600">
              <div className="flex items-center gap-1 border-b border-gray-200 bg-gray-50 p-2">
                <EditorBtn icon={<Bold size={16} />} />
                <EditorBtn icon={<Italic size={16} />} />
                <EditorBtn icon={<Underline size={16} />} />
                <EditorBtn icon={<ListIcon size={16} />} />
                <EditorBtn icon={<LinkIcon size={16} />} />
                <EditorBtn icon={<Undo size={16} />} />
                <EditorBtn icon={<Redo size={16} />} />
              </div>
              <textarea placeholder="Write a comprehensive description..." className="min-h-[150px] w-full p-4 text-sm outline-none" />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-gray-700">Gallery</label>
            <div className="cursor-pointer rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center transition-all hover:border-blue-400 hover:bg-blue-50">
              <CloudUpload size={48} className="mx-auto mb-3 text-gray-400" />
              <p className="text-sm font-bold text-gray-700">Click to upload photos</p>
              <p className="mt-1 text-xs text-gray-500">Multi-upload supported (max. 20 photos)</p>
            </div>
          </div>
        </div>
      </FormCard>

      <div className="flex justify-end gap-4">
        <button type="button" onClick={() => setActiveSection("manage-college")} className="rounded-md border border-gray-200 px-6 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
        <button type="button" className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-xl shadow-blue-100">
          Publish College
        </button>
      </div>
    </div>
  );
}

function CourseListSection({ setActiveSection }: { setActiveSection: (s: SectionType) => void }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <BookOpen size={24} className="text-blue-600" /> Manage Course
        </h2>
        <button type="button" onClick={() => setActiveSection("add-course")} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-bold text-white">
          <Plus size={18} /> Add Course
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left font-bold text-gray-600">Course Name</th>
              <th className="px-6 py-4 text-left font-bold text-gray-600">College</th>
              <th className="px-6 py-4 text-center font-bold text-gray-600">Duration</th>
              <th className="px-6 py-4 text-center font-bold text-gray-600">Semester</th>
              <th className="px-6 py-4 text-center font-bold text-gray-600">Status</th>
              <th className="px-6 py-4 text-center font-bold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 font-bold text-gray-900">BBA</td>
              <td className="px-6 py-4 font-medium text-gray-500">Sowers College</td>
              <td className="px-6 py-4 text-center text-gray-500">4 Years</td>
              <td className="px-6 py-4 text-center text-gray-500">8</td>
              <td className="px-6 py-4 text-center">
                <span className="rounded-full bg-green-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-green-600">Active</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-center gap-2">
                  <ActionBtn icon={<Eye size={16} />} color="blue" />
                  <ActionBtn icon={<EditIcon />} color="blue" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AddCourseSection({ setActiveSection }: { setActiveSection: (s: SectionType) => void }) {
  return (
    <div className="mx-auto max-w-4xl py-8">
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <h2 className="mb-8 flex items-center gap-3 text-xl font-extrabold text-gray-900">
          <Plus size={24} className="text-blue-600" /> Add New Course
        </h2>
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormInput label="Course Name" placeholder="e.g., BBA" required />
          <FormInput label="College" type="select" options={["Sowers College"]} required />
          <FormInput label="Duration" type="select" options={["4 Years", "3 Years", "2 Years"]} required />
          <FormInput label="Semester" type="select" options={["8 Semester", "6 Semester", "4 Semester"]} required />
        </div>
        <div className="flex justify-end gap-3 border-t border-gray-50 pt-6">
          <button type="button" onClick={() => setActiveSection("manage-course")} className="rounded-md border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button type="button" className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-bold text-white">
            Add Course
          </button>
        </div>
      </div>
    </div>
  );
}

function ScholarshipListSection({ setActiveSection }: { setActiveSection: (s: SectionType) => void }) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-100 bg-white p-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <GraduationCap size={24} className="text-blue-600" /> Manage Scholarship
          </h2>
          <button type="button" onClick={() => setActiveSection("create-scholarship")} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-bold text-white">
            <Plus size={18} /> Create Scholarship
          </button>
        </div>
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <SimpleStatCard icon={<Award size={20} />} value="24" label="Total Scholarships" bg="bg-blue-100" />
          <SimpleStatCard icon={<CheckCircle size={20} />} value="18" label="Active" bg="bg-green-100" />
          <SimpleStatCard icon={<FileText size={20} />} value="3" label="Draft" bg="bg-gray-100" />
          <SimpleStatCard icon={<X size={20} />} value="6" label="Closed" bg="bg-red-100" />
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left font-bold text-gray-600">Scholarship Name</th>
                <th className="px-6 py-4 text-center font-bold text-gray-600">Type</th>
                <th className="px-6 py-4 text-center font-bold text-gray-600">Seats</th>
                <th className="px-6 py-4 text-center font-bold text-gray-600">Deadline</th>
                <th className="px-6 py-4 text-center font-bold text-gray-600">Status</th>
                <th className="px-6 py-4 text-center font-bold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-bold text-gray-900">Merit Scholarship 2026</td>
                <td className="px-6 py-4 text-center">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600">Merit</span>
                </td>
                <td className="px-6 py-4 text-center font-bold text-gray-500">50</td>
                <td className="px-6 py-4 text-center font-medium text-gray-400">May 15, 2026</td>
                <td className="px-6 py-4 text-center">
                  <span className="rounded-full bg-green-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-green-600">Active</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <ActionBtn icon={<Eye size={16} />} color="blue" />
                    <ActionBtn icon={<EditIcon />} color="blue" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CreateScholarshipSection({ setActiveSection }: { setActiveSection: (s: SectionType) => void }) {
  return (
    <div className="mx-auto max-w-4xl py-8">
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <h2 className="mb-8 flex items-center gap-3 text-xl font-extrabold text-gray-900">
          <Plus size={24} className="text-blue-600" /> Create New Scholarship
        </h2>
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormInput label="Scholarship Name" placeholder="e.g., Merit Scholarship 2026" required />
          <FormInput label="Type" type="select" options={["Merit Based", "Need Based", "Minority"]} required />
          <FormInput label="Total Seats" type="number" placeholder="Number of seats" required />
          <FormInput label="Amount per Student (Rs)" type="number" placeholder="Amount in NPR" required />
        </div>
        <div className="flex justify-end gap-3 border-t border-gray-50 pt-6">
          <button type="button" onClick={() => setActiveSection("manage-scholarship")} className="rounded-md border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button type="button" className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-bold text-white">
            Create Scholarship
          </button>
        </div>
      </div>
    </div>
  );
}

function UserListSection({ setActiveSection }: { setActiveSection: (s: SectionType) => void }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <Users size={24} className="text-blue-600" /> Manage Users
        </h2>
        <button type="button" onClick={() => setActiveSection("add-user")} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-bold text-white">
          <Plus size={18} /> Add User
        </button>
      </div>
      <div className="mb-8 flex items-center gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search users..." className="h-11 w-full rounded-md border border-gray-200 pl-10 pr-4 text-sm outline-none focus:border-blue-600" />
        </div>
        <select className="h-11 w-auto rounded-md border border-gray-200 px-3 text-sm outline-none focus:border-blue-600"><option>All Roles</option></select>
        <select className="h-11 w-auto rounded-md border border-gray-200 px-3 text-sm outline-none focus:border-blue-600"><option>All Status</option></select>
      </div>
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left font-bold text-gray-600">User</th>
              <th className="px-6 py-4 text-left font-bold text-gray-600">Email</th>
              <th className="px-6 py-4 text-center font-bold text-gray-600">Role</th>
              <th className="px-6 py-4 text-center font-bold text-gray-600">Status</th>
              <th className="px-6 py-4 text-center font-bold text-gray-600">Joined</th>
              <th className="px-6 py-4 text-center font-bold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <AccessRow initials="AU" name="Admin User" email="admin@sowersaction.org" role="Administrator" status="Active" lastActive="Jan 15, 2025" />
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AddUserSection({ setActiveSection }: { setActiveSection: (s: SectionType) => void }) {
  return (
    <div className="mx-auto max-w-4xl py-8">
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <h2 className="mb-8 flex items-center gap-3 text-xl font-extrabold text-gray-900">
          <UserPlus size={24} className="text-blue-600" /> Add New User
        </h2>
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormInput label="Full Name" placeholder="Enter full name" required />
          <FormInput label="Email" placeholder="email@example.com" required />
          <FormInput label="Password" type="password" placeholder="Enter password" required />
          <FormInput label="Role" type="select" options={["Administrator", "Editor", "Viewer"]} required />
        </div>
        <div className="flex justify-end gap-3 border-t border-gray-50 pt-6">
          <button type="button" onClick={() => setActiveSection("user-management")} className="rounded-md border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button type="button" className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-bold text-white">
            Add User
          </button>
        </div>
      </div>
    </div>
  );
}

function AnalyticsSection() {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <InfoTile title="User Growth" value="+12.5%" note="Last 30 days" icon={<TrendingUpIcon />} />
      <InfoTile title="Approval Rate" value="12.5%" note="Of total applications" icon={<Percent className="h-6 w-6 text-slate-400" />} />
      <InfoTile title="Active Users" value="847" note="Last 7 days" icon={<Users className="h-6 w-6 text-slate-400" />} />
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-3">
        <h3 className="text-lg font-bold text-gray-900">Analytics</h3>
        <p className="mt-1 text-sm text-gray-500">Detailed analytics panels can be added here to match the production dashboard.</p>
      </div>
    </div>
  );
}

function ManagementPlaceholder({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <p className="mt-2 max-w-md text-gray-500">This section is wired into the super admin navigation and can be expanded into a full management workspace next.</p>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  change,
  gradient,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  change: string;
  gradient: string;
}) {
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${gradient} p-6 text-white shadow-lg transition-transform hover:-translate-y-1`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">{icon}</div>
        <span className="text-3xl font-extrabold">{value}</span>
      </div>
      <p className="text-sm font-bold opacity-90">{label}</p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide opacity-75">{change}</p>
    </div>
  );
}

function SimpleStatCard({
  icon,
  value,
  label,
  bg,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  bg: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${bg}`}>{icon}</div>
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</p>
    </div>
  );
}

function ActivityItem({
  icon,
  title,
  sub,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  tone: "blue" | "green" | "purple" | "amber" | "red";
}) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    amber: "bg-amber-100 text-amber-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-3 transition-colors hover:bg-gray-100">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${colors[tone]}`}>{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-gray-900">{title}</p>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{sub}</p>
      </div>
    </div>
  );
}

function NextEventItem({ color, time, title }: { color: "purple" | "orange" | "blue"; time: string; title: string }) {
  const colors = {
    purple: "bg-purple-600",
    orange: "bg-orange-500",
    blue: "bg-blue-500",
  };
  return (
    <div className="flex cursor-pointer gap-4 group">
      <div className={`w-[4px] shrink-0 rounded-full ${colors[color]} transition-all group-hover:scale-y-110`} />
      <div className="flex flex-col">
        <div className="text-[11px] font-bold tracking-tight text-gray-900">{time}</div>
        <div className="mt-0.5 text-xs font-medium text-gray-500 transition-colors group-hover:text-blue-600">{title}</div>
      </div>
    </div>
  );
}

function AccessRow({
  initials,
  name,
  email,
  role,
  status,
  lastActive,
}: {
  initials: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
}) {
  return (
    <tr className="transition-colors hover:bg-gray-50">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-xs font-bold text-white shadow-sm">
            {initials}
          </div>
          <span className="font-bold text-gray-900">{name}</span>
        </div>
      </td>
      <td className="px-4 py-4 font-medium text-gray-500">{email}</td>
      <td className="px-4 py-4 text-center">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600">{role}</span>
      </td>
      <td className="px-4 py-4 text-center">
        <span className="rounded-full bg-green-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-green-600">{status}</span>
      </td>
      <td className="px-4 py-4 text-center text-xs font-semibold uppercase text-gray-400">{lastActive}</td>
    </tr>
  );
}

function TabItem({
  label,
  count,
  active,
  icon,
}: {
  label: string;
  count: number;
  active?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className={`flex cursor-not-allowed items-center gap-2 whitespace-nowrap rounded-xl border px-5 py-2.5 transition-all ${
      active ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-100" : "border-gray-100 bg-white text-gray-500 hover:bg-gray-50"
    }`}>
      {icon}
      <span className="text-sm font-bold">{label}</span>
      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${active ? "bg-white/20" : "bg-gray-100"}`}>{count}</span>
    </div>
  );
}

function BulkBtn({ icon, label, className = "" }: { icon: React.ReactNode; label: string; className?: string }) {
  return (
    <button type="button" className={`flex items-center gap-2 rounded-lg border border-gray-100 bg-white px-3 py-1.5 text-xs font-bold transition-all hover:bg-gray-50 ${className}`}>
      {icon} {label}
    </button>
  );
}

function CollegeRow({
  sn,
  date,
  name,
  reg,
  type,
  level,
  address,
  students,
  status,
  label,
}: {
  sn: number;
  date: string;
  name: string;
  reg: string;
  type: string;
  level: string;
  address: string;
  students: number;
  status: string;
  label: string;
}) {
  return (
    <tr className="group transition-colors hover:bg-gray-50">
      <td className="px-4 py-4"><input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600" /></td>
      <td className="px-4 py-4 font-bold text-gray-400">{sn}</td>
      <td className="px-4 py-4">
        <p className="font-bold text-gray-900">{date}</p>
        <p className="text-[10px] font-bold uppercase text-gray-400">10:30 AM</p>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-600 transition-transform group-hover:scale-105">{label}</div>
          <div>
            <p className="font-extrabold leading-tight text-gray-900">{name}</p>
            <p className="mt-0.5 text-[10px] font-bold uppercase text-gray-400">Reg: {reg}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-center">
        <span className="rounded-lg bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600">{type}</span>
      </td>
      <td className="px-4 py-4 text-center">
        <span className="rounded-lg bg-green-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-green-600">{level}</span>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-start gap-2">
          <MapPin size={14} className="mt-0.5 text-red-400" />
          <span className="font-medium leading-relaxed text-gray-600">{address}</span>
        </div>
      </td>
      <td className="px-4 py-4 text-center font-extrabold text-gray-900">{students}</td>
      <td className="px-4 py-4 text-center">
        <label className="relative inline-flex cursor-pointer items-center">
          <input type="checkbox" className="sr-only peer" defaultChecked={status === "Verified"} />
          <div className="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white" />
        </label>
      </td>
      <td className="px-4 py-4 text-center">
        <div className="flex items-center justify-center gap-2 scale-90 transition-transform group-hover:scale-100">
          <ActionBtn icon={<EditIcon />} color="blue" />
          <ActionBtn icon={<MessageSquare size={16} />} color="green" />
          <ActionBtn icon={<Eye size={16} />} color="purple" />
          <ActionBtn icon={<Trash2 size={16} />} color="red" />
        </div>
      </td>
    </tr>
  );
}

function ActionBtn({ icon, color }: { icon: React.ReactNode; color: "blue" | "green" | "purple" | "red" }) {
  const colors = {
    blue: "text-blue-600 hover:bg-blue-50",
    green: "text-green-600 hover:bg-green-50",
    purple: "text-purple-600 hover:bg-purple-50",
    red: "text-red-600 hover:bg-red-50",
  };
  return (
    <button type="button" className={`rounded-lg p-2 transition-all ${colors[color]}`}>
      {icon}
    </button>
  );
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function PageBtn({ label, icon, active, disabled }: { label?: string; icon?: React.ReactNode; active?: boolean; disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-bold transition-all ${
        active ? "border-blue-600 bg-blue-600 text-white shadow-md" : "border-gray-100 bg-white text-gray-500 hover:bg-gray-50"
      } ${disabled ? "cursor-not-allowed opacity-30" : "cursor-pointer"}`}
    >
      {icon || label}
    </button>
  );
}

function FormCard({
  icon,
  title,
  sub,
  locked,
  onToggleLock,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  locked: boolean;
  onToggleLock: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
      <div className="mb-8 flex items-center justify-between border-b border-gray-50 pb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 shadow-sm">{icon}</div>
          <div>
            <h3 className="text-xl font-extrabold tracking-tight text-gray-900">{title}</h3>
            <p className="text-sm font-medium text-gray-500">{sub}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-2">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{locked ? "Locked" : "Unlocked"}</span>
          <label className="section-lock-toggle">
            <input type="checkbox" className="sr-only" checked={locked} onChange={onToggleLock} />
            <div className={`relative h-6 w-10 rounded-full transition-all ${locked ? "bg-red-500" : "bg-blue-600"}`}>
              <div className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-all ${locked ? "translate-x-4 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "translate-x-0"}`} />
            </div>
          </label>
        </div>
      </div>

      <div className={`transition-all duration-300 ${locked ? "pointer-events-none scale-[0.99] opacity-30 blur-[1px]" : "opacity-100"}`}>
        {children}
      </div>
    </div>
  );
}

function FormInput({
  label,
  type = "text",
  placeholder,
  options,
  required,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  options?: string[];
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-gray-700">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>
      {type === "select" ? (
        <select className="input-field font-medium">
          <option value="">Select {label}</option>
          {(options || []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea className="input-field min-h-[100px] py-4" placeholder={placeholder} />
      ) : (
        <input type={type} className="input-field" placeholder={placeholder} />
      )}
    </div>
  );
}

function EditorBtn({ icon }: { icon: React.ReactNode }) {
  return (
    <button type="button" className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-white hover:text-blue-600">
      {icon}
    </button>
  );
}

function InfoTile({
  title,
  value,
  note,
  icon,
}: {
  title: string;
  value: string;
  note: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        {icon}
        <span className="text-2xl font-bold text-gray-900">{value}</span>
      </div>
      <p className="mt-4 text-sm font-semibold text-gray-700">{title}</p>
      <p className="mt-1 text-xs text-gray-500">{note}</p>
    </div>
  );
}

function TrendingUpIcon() {
  return <ArrowRight className="h-6 w-6 rotate-[-45deg] text-slate-400" />;
}
