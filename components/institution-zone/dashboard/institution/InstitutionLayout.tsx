"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
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
  | "admissionApplications"
  | "admissionDirectory"
  | "admissionShortlist"
  | "admissionDraft"
  | "scholarshipCreate"
  | "scholarshipDraft"
  | "scholarshipShortlist"
  | "scholarshipList"
  | "scholarshipApplications"
  | "counsellingRequests"
  | "counsellingHistory"
  | "entranceDetails"
  | "entranceDraft"
  | "entranceDirectory"
  | "entranceCreate"
  | "entranceApplicants"
  | "entranceResults"
  | "courseCreate"
  | "courseList"
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
  const [notifCount, setNotifCount] = useState(0);
  const [msgCount, setMsgCount] = useState(0);
  const [notifItems, setNotifItems] = useState<{ icon: React.ReactNode; bg: string; text: string; time: string }[]>([]);
  const [instName, setInstName] = useState("");
  const [instLogo, setInstLogo] = useState("");
  const [subType, setSubType] = useState("");

  useEffect(() => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const token = localStorage.getItem("institutionToken");
    if (!token) return;

    const fetchAll = async () => {
      try {
        const [profileRes, accessRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/v1/institution/profile`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/api/v1/institutions/profile-access`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const profileData = await profileRes.json();
        const p = profileData?.data || {};
        setInstName(p.institution_name || "Institution");
        if (p.logo_url) setInstLogo(p.logo_url);
        setSubType(p.subscription_type || "");

        const accessData = await accessRes.json();
        const access: Record<string, boolean> = accessData.data || {};
        const allToggles = ["About", "Course & Fees", "Admission", "Scholarship", "News", "Events", "Blogs"];
        const disabled: Record<string, boolean> = {};
        allToggles.forEach((t) => { if (access[t] === false) disabled[t] = true; });
        setAccessDisabled(disabled);
      } catch {}
    };
    fetchAll();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const token = localStorage.getItem("institutionToken");
        if (!token) return;
        const res = await fetch(`${API_BASE_URL}/api/v1/institution/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data?.success) {
          setInstName(data.data?.institution_name || "");
          setInstLogo(data.data?.logo_url || "");
        }
      } catch {}
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("institutionToken");
    localStorage.removeItem("institutionUser");
    window.location.href = "/institution-zone";
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
      icon: <SquaresFour className="w-[18px] h-[18px]" />,
    },
    {
      key: "admission",
      type: "dropdown",
      label: "Manage Admission",
      icon: <UserPlus className="w-[18px] h-[18px]" />,
      items: [
        { page: "createAdmission", label: "Create Admission" },
        { page: "admissionDraft", label: "Draft Admission" },
        { page: "admissionApplications", label: "Applications" },
        { page: "admissionDirectory", label: "Admission Directory" },
        { page: "admissionShortlist", label: "Shortlist" },
      ],
    },
    {
      key: "scholarship",
      type: "dropdown",
      label: "Manage Scholarship",
      icon: <GraduationCap className="w-[18px] h-[18px]" />,
      items: [
        { page: "scholarshipCreate", label: "Create Scholarship" },
        { page: "scholarshipDraft", label: "Draft Scholarship" },
        { page: "scholarshipList", label: "Scholarship List" },
        { page: "scholarshipApplications", label: "Applications" },
        { page: "scholarshipShortlist", label: "Shortlist" },
      ],
    },
    {
      key: "counselling",
      type: "dropdown",
      label: "Manage Counselling",
      icon: <ChatsCircle className="w-[18px] h-[18px]" />,
      items: [
        { page: "counsellingRequests", label: "Counselling Requests" },
        { page: "counsellingHistory", label: "Session History" },
      ],
    },
    {
      key: "entrance",
      type: "dropdown",
      label: "Manage Entrance",
      icon: <ClipboardText className="w-[18px] h-[18px]" />,
      items: [
        { page: "entranceDetails", label: "Create Entrance" },
        { page: "entranceDraft", label: "Draft Entrance" },
        { page: "entranceDirectory", label: "Entrance Directory" },
        { page: "entranceApplicants", label: "Applicants" },
        { page: "entranceResults", label: "Results" },
      ],
    },
    {
      key: "course",
      type: "dropdown",
      label: "Manage Course",
      icon: <BookOpen className="w-[18px] h-[18px]" />,
      items: [
        { page: "courseCreate", label: "Create Course" },
        { page: "courseList", label: "Course List" },
      ],
    },
    {
      key: "message",
      type: "item",
      page: "message",
      label: "Message",
      icon: <Chats className="w-[18px] h-[18px]" />,
    },
    {
      key: "inviteStudent",
      type: "item",
      page: "inviteStudent",
      label: "Invite Student",
      icon: <EnvelopeOpen className="w-[18px] h-[18px]" />,
    },
    {
      key: "news",
      type: "dropdown",
      label: "Manage News",
      icon: <Newspaper className="w-[18px] h-[18px]" />,
      items: [
        { page: "createNews", label: "Create News" },
        { page: "newsDirectory", label: "News Directory" },
      ],
    },
    {
      key: "events",
      type: "dropdown",
      label: "Manage Events",
      icon: <CalendarBlank className="w-[18px] h-[18px]" />,
      items: [
        { page: "createEvent", label: "Create Event" },
        { page: "eventsDirectory", label: "Events Directory" },
      ],
    },
    {
      key: "blogs",
      type: "dropdown",
      label: "Manage Blogs",
      icon: <FileText className="w-[18px] h-[18px]" />,
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
      icon: <Star className="w-[18px] h-[18px]" />,
    },
    {
      key: "manageAdvertisement",
      type: "item",
      page: "manageAdvertisement",
      label: "Manage Advertisement",
      icon: <Megaphone className="w-[18px] h-[18px]" />,
    },
    {
      key: "profile",
      type: "item",
      page: "profile",
      label: "Manage Profile",
      icon: <UserGear className="w-[18px] h-[18px]" />,
    },
    {
      key: "analytics",
      type: "item",
      page: "analytics",
      label: "Analytics",
      icon: <ChartBar className="w-[18px] h-[18px]" />,
    },
    {
      key: "notification",
      type: "item",
      page: "notification",
      label: "Notification",
      icon: <Bell className="w-[18px] h-[18px]" />,
    },
    {
      key: "settings",
      type: "item",
      page: "settings",
      label: "Settings",
      icon: <Gear className="w-[18px] h-[18px]" />,
    },
  ];

  const fetchNotifications = useCallback(async () => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const token = localStorage.getItem("institutionToken");
    if (!token) return;
    try {
      const [dashRes, msgRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/v1/institution/dashboard`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        fetch(`${API_BASE_URL}/api/v1/institution/messages/students`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      ]);
      const dash = dashRes?.data || {};
      const unreadCount = Number(dash.unread_messages || 0) + Number(dash.pending_bookings || 0);
      setNotifCount(unreadCount);
      setMsgCount(Number(dash.unread_messages || 0));
      const items: { icon: React.ReactNode; bg: string; text: string; time: string }[] = [];
      if (dash.pending_bookings > 0) items.push({ icon: <UserPlus className="text-blue-600 text-sm" />, bg: "bg-blue-50", text: `${dash.pending_bookings} pending counselling bookings`, time: "Now" });
      if (dash.unread_messages > 0) items.push({ icon: <Chats className="text-green-600 text-sm" />, bg: "bg-green-50", text: `${dash.unread_messages} unread messages`, time: "Now" });
      const contacts = msgRes?.data || [];
      contacts.slice(0, 2).forEach((c: any, i: number) => {
        items.push({ icon: <FileText className="text-purple-600 text-sm" />, bg: "bg-purple-50", text: `Message from ${c.name || `User #${c.user_id}`}`, time: i === 0 ? "Recently" : "Earlier" });
      });
      if (items.length === 0) items.push({ icon: <SquaresFour className="text-gray-400 text-sm" />, bg: "bg-gray-50", text: "No new notifications", time: "" });
      setNotifItems(items);
    } catch { /* skip */ }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

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
                      <div className="pl-10 pr-3 py-2 flex flex-col gap-1">
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
                            <span className="whitespace-nowrap">{item.label}</span>
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
            <SignOut className="w-[18px] h-[18px]" />
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
              {msgCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full px-1">
                  {msgCount > 99 ? "99+" : msgCount}
                </span>
              )}
            </button>

            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="icon-btn-hover text-gray-400 hover:text-gray-600 transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {notifCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full px-1">
                    {notifCount > 99 ? "99+" : notifCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notificationOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                  <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                    <button onClick={() => setNotificationOpen(false)} className="text-gray-400 hover:text-gray-600">
                      <X className="w-[18px] h-[18px]" />
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifItems.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-400">No notifications</div>
                    ) : (
                      notifItems.map((notif, i) => (
                        <div key={i} className="p-3 border-b border-gray-50 hover:bg-brand-50 cursor-pointer flex items-start gap-3 transition-colors">
                          <div className={`w-8 h-8 rounded-full ${notif.bg} flex items-center justify-center shrink-0`}>
                            {notif.icon}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{notif.text}</p>
                            {notif.time && <p className="text-xs text-gray-500 mt-0.5">{notif.time}</p>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-2 border-t border-gray-100 text-center">
                    <button onClick={() => { onNavigate("notification"); setNotificationOpen(false); }}
                      className="text-xs text-blue-600 hover:underline font-medium">
                      View All Activity
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="pl-3 border-l border-gray-200 flex items-center gap-3">
              {instLogo ? (
                <img className="h-10 w-10 rounded-full object-cover border border-gray-200" src={instLogo} alt="" />
              ) : (
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">{instName.charAt(0)}</div>
              )}
              <div>
                <p className="text-sm font-semibold text-gray-900">{instName || "Loading..."}</p>
                {subType && (
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${subType === "premium" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"}`}>
                    {subType === "premium" ? "Premium" : "Free"}
                  </span>
                )}
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
