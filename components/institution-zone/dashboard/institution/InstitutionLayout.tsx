"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import NotificationBell, { NotificationItem } from "@/components/shared/NotificationBell";
import MessageBell from "@/components/shared/MessageBell";
import {
  LayoutDashboard,
  UserPlus,
  GraduationCap,
  MessageSquare,
  ClipboardList,
  BookOpen,
  Newspaper,
  Calendar,
  FileText,
  UserCog,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  X,
  MailOpen,
  Star,
  Megaphone,
  Lock,
  MapPin,
} from "lucide-react";

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
  | "inviteStudent"
  | "collegeLocation";

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

const InstitutionLayout: React.FC<Props> = ({
  activePage,
  onNavigate,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {},
  );
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [accessDisabled, setAccessDisabled] = useState<Record<string, boolean>>(
    {},
  );
  const [notifCount, setNotifCount] = useState(0);
  const [msgCount, setMsgCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [instName, setInstName] = useState("");
  const [instLogo, setInstLogo] = useState("");
  const [subType, setSubType] = useState("");

  useEffect(() => {
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const token = localStorage.getItem("institutionToken");
    if (!token) return;

    const fetchAll = async () => {
      try {
        const [profileRes, accessRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/v1/institution/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/api/v1/institutions/profile-access`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const profileData = await profileRes.json();
        const p = profileData?.data || {};
        setInstName(p.institution_name || "Institution");
        if (p.logo_url) setInstLogo(p.logo_url);
        setSubType(p.subscription_type || "");

        const accessData = await accessRes.json();
        const access: Record<string, boolean> = accessData.data || {};
        const allToggles = [
          "About",
          "Course & Fees",
          "Admission",
          "Scholarship",
          "News",
          "Events",
          "Blogs",
        ];
        const disabled: Record<string, boolean> = {};
        allToggles.forEach((t) => {
          if (access[t] === false) disabled[t] = true;
        });
        setAccessDisabled(disabled);
      } catch {}
    };
    fetchAll();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
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
      icon: <LayoutDashboard size={20} />,
    },
    {
      key: "admission",
      type: "dropdown",
      label: "Manage Admission",
      icon: <UserPlus size={20} />,
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
      icon: <GraduationCap size={20} />,
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
      icon: <MessageSquare size={20} />,
      items: [
        { page: "counsellingRequests", label: "Counselling Requests" },
        { page: "counsellingHistory", label: "Session History" },
      ],
    },
    {
      key: "entrance",
      type: "dropdown",
      label: "Manage Entrance",
      icon: <ClipboardList size={20} />,
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
      icon: <BookOpen size={20} />,
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
      icon: <MessageSquare size={20} />,
    },
    {
      key: "inviteStudent",
      type: "item",
      page: "inviteStudent",
      label: "Invite Student",
      icon: <MailOpen size={20} />,
    },
    {
      key: "news",
      type: "dropdown",
      label: "Manage News",
      icon: <Newspaper size={20} />,
      items: [
        { page: "createNews", label: "Create News" },
        { page: "newsDirectory", label: "News Directory" },
      ],
    },
    {
      key: "events",
      type: "dropdown",
      label: "Manage Events",
      icon: <Calendar size={20} />,
      items: [
        { page: "createEvent", label: "Create Event" },
        { page: "eventsDirectory", label: "Events Directory" },
      ],
    },
    {
      key: "blogs",
      type: "dropdown",
      label: "Manage Blogs",
      icon: <FileText size={20} />,
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
      icon: <Star size={20} />,
    },
    {
      key: "manageAdvertisement",
      type: "item",
      page: "manageAdvertisement",
      label: "Manage Advertisement",
      icon: <Megaphone size={20} />,
    },
    {
      key: "collegeLocation",
      type: "item",
      page: "collegeLocation",
      label: "College Location",
      icon: <MapPin size={20} />,
    },
    {
      key: "profile",
      type: "item",
      page: "profile",
      label: "Manage Profile",
      icon: <UserCog size={20} />,
    },
    {
      key: "analytics",
      type: "item",
      page: "analytics",
      label: "Analytics",
      icon: <BarChart3 size={20} />,
    },
    {
      key: "notification",
      type: "item",
      page: "notification",
      label: "Notification",
      icon: <Bell size={20} />,
    },
    {
      key: "settings",
      type: "item",
      page: "settings",
      label: "Settings",
      icon: <Settings size={20} />,
    },
  ];

  const fetchNotifications = useCallback(async () => {
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const token = localStorage.getItem("institutionToken");
    if (!token) return;
    try {
      const [dashRes, msgRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/v1/institution/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((r) => r.json()),
        fetch(`${API_BASE_URL}/api/v1/institution/messages/students`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((r) => r.json()),
      ]);
      const dash = dashRes?.data || {};
      setNotifCount(Number(dash.pending_bookings || 0));
      setMsgCount(Number(dash.unread_messages || 0));

      const items: NotificationItem[] = [];
      if (dash.pending_bookings > 0)
        items.push({
          id: `booking-${Date.now()}`,
          title: "Pending Bookings",
          message: `${dash.pending_bookings} pending counselling bookings`,
          read: false,
          created_at: new Date().toISOString(),
          icon: <UserPlus className="text-blue-600 text-sm" />,
          iconBg: "bg-blue-50",
        });
      if (dash.unread_messages > 0)
        items.push({
          id: `message-${Date.now()}`,
          title: "Unread Messages",
          message: `${dash.unread_messages} unread messages`,
          read: false,
          created_at: new Date().toISOString(),
          icon: <LayoutDashboard className="text-green-600 text-sm" />,
          iconBg: "bg-green-50",
        });
      const contacts = msgRes?.data || [];
      contacts.slice(0, 2).forEach((c: any, i: number) => {
        items.push({
          id: `contact-${c.user_id || i}`,
          title: `Message from ${c.name || `User #${c.user_id}`}`,
          message: "",
          read: true,
          created_at: new Date(Date.now() - (i === 0 ? 300000 : 3600000)).toISOString(),
          icon: <FileText className="text-purple-600 text-sm" />,
          iconBg: "bg-purple-50",
        });
      });
      setNotifications(items);
    } catch {
      /* skip */
    }
  }, []);

  const handleMarkNotifRead = async (id: number | string) => {
    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const token = localStorage.getItem("institutionToken");
      if (!token) return;
      await fetch(`${API_BASE_URL}/api/v1/institution/notifications/read-all`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
      setNotifCount((prev) => Math.max(0, prev - 1));
    } catch {}
  };

  const handleMarkAllNotifRead = async () => {
    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const token = localStorage.getItem("institutionToken");
      if (!token) return;
      await fetch(`${API_BASE_URL}/api/v1/institution/notifications/read-all`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setNotifCount(0);
      window.dispatchEvent(new Event("institution-notifications-read"));
    } catch {}
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    const handler = () => fetchNotifications();
    if (typeof window !== "undefined") {
      window.addEventListener("institution-notifications-read", handler);
      return () =>
        window.removeEventListener("institution-notifications-read", handler);
    }
  }, [fetchNotifications]);

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
        className={`fixed md:relative top-0 left-0 z-50 w-80 h-full bg-white border-r border-gray-200 flex-shrink-0 flex flex-col transition-transform duration-300 shadow-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
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

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-4 flex flex-col gap-1">
          {navSections.map((section) => {
            const key = section.key;

            if (section.type === "dropdown" && section.items) {
              const locked = isLocked(key);
              const isOpen =
                openDropdowns[key] || isDropdownActive(section.items);

              return (
                <NavDropdown
                  key={key}
                  icon={section.icon}
                  label={section.label}
                  isOpen={isOpen}
                  onToggle={() => {
                    if (!locked) toggleDropdown(key);
                  }}
                  locked={locked}
                >
                  {section.items.map((item) => (
                    <button
                      key={item.page}
                      type="button"
                      onClick={() => {
                        onNavigate(item.page);
                        setSidebarOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activePage === item.page
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </NavDropdown>
              );
            }

            // Single nav item
            const isActive = activePage === section.page;
            const locked = isLocked(key);

            return (
              <NavItem
                key={key}
                icon={locked ? <Lock size={20} /> : section.icon}
                label={section.label}
                active={isActive && !locked}
                onClick={() => {
                  if (!locked) {
                    onNavigate(section.page!);
                    setSidebarOpen(false);
                  }
                }}
              />
            );
          })}

          {/* Logout */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-red-500 hover:bg-red-50"
          >
            <LogOut size={20} />
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
              <LayoutDashboard size={20} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <MessageBell
              unreadCount={msgCount}
              onClick={() => onNavigate("message")}
            />
            <NotificationBell
              notifications={notifications}
              unreadCount={notifCount}
              loading={notifLoading}
              isOpen={notifOpen}
              onToggle={() => setNotifOpen(!notifOpen)}
              onClose={() => setNotifOpen(false)}
              onMarkRead={handleMarkNotifRead}
              onMarkAllRead={handleMarkAllNotifRead}
              onViewAll={() => {
                onNavigate("notification");
                setNotifOpen(false);
              }}
            />

            <div className="pl-3 border-l border-gray-200 flex items-center gap-3">
              {instLogo ? (
                <img
                  className="h-10 w-10 rounded-full object-cover border border-gray-200"
                  src={instLogo}
                  alt=""
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                  {instName.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {instName || "Loading..."}
                </p>
                {subType && (
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${subType === "premium" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"}`}
                  >
                    {subType === "premium" ? "Premium" : "Free"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">{children}</main>
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
};

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
  locked,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  locked?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={onToggle}
        className={`nav-item flex items-center justify-between px-3 py-2 rounded-md transition-colors w-full ${
          locked
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        }`}
        title={locked ? "This section has been disabled by the admin" : ""}
      >
        <div className="flex items-center gap-3">
          {locked ? <Lock size={20} /> : icon}
          <span className="font-medium text-sm">{label}</span>
        </div>
        {!locked && (
          <ChevronRight
            size={14}
            className={`transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
          />
        )}
      </button>
      {!locked && (
        <div
          className={`overflow-hidden transition-all duration-200 ${
            isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pl-10 pr-3 py-2 flex flex-col gap-1">{children}</div>
        </div>
      )}
    </div>
  );
}

export default InstitutionLayout;
