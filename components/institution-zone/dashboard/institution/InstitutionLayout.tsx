"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  SquaresFour,
  UserPlus,
  GraduationCap,
  ChatsCircle,
  ClipboardText,
  BookOpen,
  Chats,
  Newspaper,
  CalendarBlank,
  FileText,
  UserGear,
  ChartBar,
  Bell,
  Gear,
  SignOut,
  CaretRight,
  X,
  EnvelopeOpen,
  Star,
  Megaphone,
  Lock,
} from "@phosphor-icons/react";

export type InstitutionPage =
  | "overview"
  | "createAdmission"
  | "admissionForm"
  | "admissionApplications"
  | "admissionDirectory"
  | "admissionShortlist"
  | "scholarshipList"
  | "scholarshipApplications"
  | "counsellingRequests"
  | "counsellingHistory"
  | "entranceCreate"
  | "entranceApplicants"
  | "entranceResults"
  | "courseList"
  | "courseSyllabus"
  | "courseMaterial"
  | "message"
  | "createNews"
  | "newsDirectory"
  | "createEvent"
  | "eventsDirectory"
  | "createBlog"
  | "blogDirectory"
  | "reviews"
  | "manageAdvertisement"
  | "profile"
  | "analytics"
  | "notification"
  | "settings"
  | "inviteStudent";

interface Props {
  activePage: InstitutionPage;
  onNavigate: (page: InstitutionPage) => void;
  children: React.ReactNode;
}

interface NavDropdownItem {
  page: InstitutionPage;
  label: string;
}

interface NavSection {
  type: "item" | "dropdown";
  page?: InstitutionPage;
  label: string;
  icon: React.ReactNode;
  items?: NavDropdownItem[];
  isLogout?: boolean;
}

const InstitutionLayout: React.FC<Props> = ({ activePage, onNavigate, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [accessDisabled, setAccessDisabled] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchAccess = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const token = localStorage.getItem("institutionToken");
        if (!token) return;
        const res = await fetch(`${API_BASE_URL}/api/v1/institutions/profile-access`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const access: Record<string, boolean> = data.data || {};
        const allToggles = ["About","Course & Fees","Admission","Scholarship","News","Events","Blogs"];
        const disabled: Record<string, boolean> = {};
        allToggles.forEach((t) => { if (access[t] === false) disabled[t] = true; });
        setAccessDisabled(disabled);
      } catch {}
    };
    fetchAccess();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("institutionAuthToken");
    localStorage.removeItem("institutionAuthUser");
    window.location.href = "/institutionZone";
  };
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (key: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isDropdownActive = (items: NavDropdownItem[]) =>
    items.some((item) => item.page === activePage);

  const accessMap: Record<string, string> = {
    admission: "Admission",
    scholarship: "Scholarship",
    course: "Course & Fees",
    news: "News",
    events: "Events",
    blogs: "Blogs",
  };

  const isLocked = (key: string) => {
    const toggleName = accessMap[key];
    return toggleName ? accessDisabled[toggleName] === true : false;
  };

  const navSections: (NavSection & { key: string })[] = [
    {
      key: "overview",
      type: "item",
      page: "overview",
      label: "Overview",
      icon: <SquaresFour weight="fill" className="w-[18px] h-[18px]" />,
    },
    {
      key: "admission",
      type: "dropdown",
      label: "Manage Admission",
      icon: <UserPlus weight="fill" className="w-[18px] h-[18px]" />,
      items: [
        { page: "createAdmission", label: "Create Admission" },
        { page: "admissionForm", label: "Admission Form" },
        { page: "admissionApplications", label: "Applications" },
        { page: "admissionDirectory", label: "Admission Directory" },
        { page: "admissionShortlist", label: "Shortlist" },
      ],
    },
    {
      key: "scholarship",
      type: "dropdown",
      label: "Manage Scholarship",
      icon: <GraduationCap weight="fill" className="w-[18px] h-[18px]" />,
      items: [
        { page: "scholarshipList", label: "Scholarship List" },
        { page: "scholarshipApplications", label: "Applications" },
      ],
    },
    {
      key: "counselling",
      type: "dropdown",
      label: "Manage Counselling",
      icon: <ChatsCircle weight="fill" className="w-[18px] h-[18px]" />,
      items: [
        { page: "counsellingRequests", label: "Counselling Requests" },
        { page: "counsellingHistory", label: "Session History" },
      ],
    },
    {
      key: "entrance",
      type: "dropdown",
      label: "Manage Entrance",
      icon: <ClipboardText weight="fill" className="w-[18px] h-[18px]" />,
      items: [
        { page: "entranceCreate", label: "Create Exam" },
        { page: "entranceApplicants", label: "Applicants" },
        { page: "entranceResults", label: "Results" },
      ],
    },
    {
      key: "course",
      type: "dropdown",
      label: "Manage Course",
      icon: <BookOpen weight="fill" className="w-[18px] h-[18px]" />,
      items: [
        { page: "courseList", label: "Course List" },
        { page: "courseSyllabus", label: "Syllabus" },
        { page: "courseMaterial", label: "Study Material" },
      ],
    },
    {
      key: "message",
      type: "item",
      page: "message",
      label: "Message",
      icon: <Chats weight="fill" className="w-[18px] h-[18px]" />,
    },
    {
      key: "inviteStudent",
      type: "item",
      page: "inviteStudent",
      label: "Invite Student",
      icon: <EnvelopeOpen weight="fill" className="w-[18px] h-[18px]" />,
    },
    {
      key: "news",
      type: "dropdown",
      label: "Manage News",
      icon: <Newspaper weight="fill" className="w-[18px] h-[18px]" />,
      items: [
        { page: "createNews", label: "Create News" },
        { page: "newsDirectory", label: "News Directory" },
      ],
    },
    {
      key: "events",
      type: "dropdown",
      label: "Manage Events",
      icon: <CalendarBlank weight="fill" className="w-[18px] h-[18px]" />,
      items: [
        { page: "createEvent", label: "Create Event" },
        { page: "eventsDirectory", label: "Events Directory" },
      ],
    },
    {
      key: "blogs",
      type: "dropdown",
      label: "Manage Blogs",
      icon: <FileText weight="fill" className="w-[18px] h-[18px]" />,
      items: [
        { page: "createBlog", label: "Create Blog" },
        { page: "blogDirectory", label: "Blog Directory" },
      ],
    },
    {
      key: "reviews",
      type: "item",
      page: "reviews",
      label: "Reviews",
      icon: <Star weight="fill" className="w-[18px] h-[18px]" />,
    },
    {
      key: "manageAdvertisement",
      type: "item",
      page: "manageAdvertisement",
      label: "Manage Advertisement",
      icon: <Megaphone weight="fill" className="w-[18px] h-[18px]" />,
    },
    {
      key: "profile",
      type: "item",
      page: "profile",
      label: "Manage Profile",
      icon: <UserGear weight="fill" className="w-[18px] h-[18px]" />,
    },
    {
      key: "analytics",
      type: "item",
      page: "analytics",
      label: "Analytics",
      icon: <ChartBar weight="fill" className="w-[18px] h-[18px]" />,
    },
    {
      key: "notification",
      type: "item",
      page: "notification",
      label: "Notification",
      icon: <Bell weight="fill" className="w-[18px] h-[18px]" />,
    },
    {
      key: "settings",
      type: "item",
      page: "settings",
      label: "Settings",
      icon: <Gear weight="fill" className="w-[18px] h-[18px]" />,
    },
  ];

  return (
    <div className="bg-white text-gray-800 font-sans h-screen flex overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative top-0 left-0 z-50 w-64 h-full bg-white border-r border-gray-200 flex-shrink-0 flex flex-col transition-transform duration-300 shadow-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-50">
          <img
            src="https://test.studsphere.com/_next/image?url=%2Fstudsphere.png&w=3840&q=75"
            alt="StudySphere Logo"
            className="h-10 w-auto"
          />
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-4 flex flex-col gap-1">
          {navSections.map((section) => {
            const key = section.key;

            if (section.type === "dropdown" && section.items) {
              const locked = isLocked(key);
              const isOpen = openDropdowns[key] || isDropdownActive(section.items);
              const isActive = isDropdownActive(section.items);

              return (
                <div key={key} className="flex flex-col">
                  <button
                    onClick={() => { if (!locked) toggleDropdown(key); }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors ${
                      locked ? "text-gray-300 cursor-not-allowed" : isActive
                        ? "bg-brand-50 text-brand-600"
                        : "text-gray-700 hover:bg-brand-50 hover:text-brand-600"
                    }`}
                    title={locked ? "This section has been disabled by the admin" : ""}
                  >
                    <div className="flex items-center gap-3">
                      {locked ? <Lock weight="fill" className="w-[18px] h-[18px]" /> : section.icon}
                      <span className="font-medium text-sm">{section.label}</span>
                    </div>
                    {!locked && (
                      <CaretRight
                        weight="bold"
                        className={`text-xs transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                      />
                    )}
                  </button>
                  {!locked && (
                    <div
                      className={`overflow-hidden transition-all duration-200 ${
                        isOpen ? "max-h-96" : "max-h-0"
                      }`}
                    >
                      <div className="pl-10 pr-3 py-1 flex flex-col gap-1">
                        {section.items.map((item) => (
                          <button
                            key={item.page}
                            onClick={() => {
                              onNavigate(item.page);
                              setSidebarOpen(false);
                            }}
                            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                              activePage === item.page
                                ? "text-brand-600 bg-brand-50"
                                : "text-gray-500 hover:text-brand-600 hover:bg-brand-50"
                            }`}
                          >
                            <span>{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            // Single nav item
            const isActive = activePage === section.page;
            const isLogout = section.isLogout;
            const locked = isLocked(key);

            return (
              <button
                key={key}
                onClick={() => {
                  if (!locked) {
                    onNavigate(section.page!);
                    setSidebarOpen(false);
                  }
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                  isLogout
                    ? "text-red-500 hover:bg-red-50"
                    : locked
                      ? "text-gray-300 cursor-not-allowed"
                      : isActive
                        ? "bg-brand-50 text-brand-600"
                        : "text-gray-700 hover:bg-brand-50 hover:text-brand-600"
                }`}
                title={locked ? "This section has been disabled by the admin" : ""}
              >
                {locked ? <Lock weight="fill" className="w-[18px] h-[18px]" /> : section.icon}
                <span className="font-medium text-sm">{section.label}</span>
              </button>
            );
          })}

          {/* Logout */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-red-500 hover:bg-red-50"
          >
            <SignOut weight="fill" className="w-[18px] h-[18px]" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Wrapper */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white flex items-center justify-between px-4 md:px-6 shadow-sm z-10 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-md"
            >
              <SquaresFour className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button className="icon-btn-hover text-gray-400 hover:text-gray-600 transition-colors relative">
              <Chats className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full px-1">
                3
              </span>
            </button>

            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="icon-btn-hover text-gray-400 hover:text-gray-600 transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full px-1">
                  5
                </span>
              </button>

              {/* Notification Dropdown */}
              {notificationOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                  <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                    <button
                      onClick={() => setNotificationOpen(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-[18px] h-[18px]" />
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {[
                      { icon: <UserPlus weight="fill" className="text-blue-600 text-sm" />, bg: "bg-blue-50", text: "New student application received", time: "2 minutes ago" },
                      { icon: <SquaresFour weight="fill" className="text-orange-500 text-sm" />, bg: "bg-orange-50", text: "Scholarship deadline approaching", time: "1 hour ago" },
                      { icon: <Chats weight="fill" className="text-green-600 text-sm" />, bg: "bg-green-50", text: "New message from applicant", time: "3 hours ago" },
                      { icon: <FileText weight="fill" className="text-purple-600 text-sm" />, bg: "bg-purple-50", text: "Admission form updated", time: "1 day ago" },
                      { icon: <BookOpen weight="fill" className="text-red-600 text-sm" />, bg: "bg-red-50", text: "Book issued to student", time: "3 days ago" },
                    ].map((notif, i) => (
                      <div
                        key={i}
                        className="p-3 border-b border-gray-50 hover:bg-brand-50 cursor-pointer flex items-start gap-3 transition-colors"
                      >
                        <div className={`w-8 h-8 rounded-full ${notif.bg} flex items-center justify-center shrink-0`}>
                          {notif.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{notif.text}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{notif.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t border-gray-100 text-center">
                    <button
                      onClick={() => {
                        onNavigate("notification");
                        setNotificationOpen(false);
                      }}
                      className="text-xs text-blue-600 hover:underline font-medium"
                    >
                      View All Activity
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="pl-3 border-l border-gray-200 flex items-center gap-3">
              <img
                className="h-10 w-10 rounded-full object-cover border border-gray-200"
                src="https://i.pravatar.cc/150?img=33"
                alt="User avatar"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900">Dr. Robert Anderson</p>
                <p className="text-xs text-gray-500">Principal</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      {/* Custom CSS for icon button hover */}
      <style jsx>{`
        .icon-btn-hover {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s;
        }
        .icon-btn-hover:hover {
          background-color: rgba(0, 0, 0, 0.06);
        }
      `}</style>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/45" onClick={() => setShowLogoutModal(false)} />
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
                Are you sure you want to log out? You will need to re-enter your credentials to access your account.
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
};

export default InstitutionLayout;
