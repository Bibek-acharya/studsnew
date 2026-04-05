"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/SearchBar";
import { 
  Bell, 
  Clock, 
  Archive, 
  ArchiveRestore, 
  Trash2, 
  CheckCircle2, 
  User, 
  FileText, 
  Bookmark, 
  Sparkles, 
  Settings, 
  LogOut, 
  MessageCircleQuestion, 
  UserCheck,
  Award,
  Building,
  Search,
  ChevronDown,
  X,
  ChevronUp,
  Menu
} from "lucide-react";

interface EducationNavbarProps {
  onNavigate?: (view: string, data?: { level?: string }) => void;
  user?: {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  } | null;
  onLogout?: () => void;
}

const routeMap: Record<string, string> = {
  educationPage: "/",
  findCollege: "/find-college",
  compareColleges: "/compare-colleges",
  courseFinder: "/course-finder",
  bookCounselling: "/counseling",
  scholarshipFinderTool: "/scholarship-finder",
  collegeRecommenderTool: "/college-recommender",
  scholarshipFinder: "/scholarship-finder",
  scholarshipProviderZone: "/",
  scholarshipMain: "/",
  campusForum: "/campus-forum",
  admissionsDiscovery: "/admissions",
  entranceDiscovery: "/entrance",
  universitiesPage: "/",
  rankingsPage: "/",
  newsPage: "/",
  blogPage: "/",
  eventsPage: "/",
  contact: "/",
  institutionZone: "/",
  studentDashboard: "/",
  writeReview: "/",
  login: "/login",
  signup: "/login",
};

const NavItem: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="nav-link flex h-full shrink-0 items-center justify-center"
  >
    {children}
  </button>
);

const DesktopDropdown: React.FC<{
  label: string;
  children: React.ReactNode;
  alignRight?: boolean;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ label, children, alignRight = false, isOpen, onToggle }) => (
  <div className="menu-anchor relative h-full shrink-0">
    <button type="button" onClick={onToggle} className="nav-link flex h-full items-center gap-1">
      <span>{label}</span>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-brand-blue" : ""}`}
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
    <div
      className={`absolute top-11 sm:top-11.5 z-200 mt-1 transition-all duration-200 ${isOpen ? "visible translate-y-0 opacity-100" : "invisible translate-y-2 opacity-0"} ${
        alignRight ? "right-0" : "left-0"
      }`}
    >
      <div className="relative w-80 xs:w-96 sm:w-100 whitespace-normal rounded-xl border border-gray-100 bg-white p-2.5 sm:p-3 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
        <div
          className={`absolute -top-1.5 h-3 w-3 rotate-45 border-l border-t border-gray-100 bg-white ${
            alignRight ? "right-6" : "left-6"
          }`}
        ></div>
        <div className="relative z-10 flex flex-col gap-1 whitespace-normal">
          {children}
        </div>
      </div>
    </div>
  </div>
);

const DropdownCard: React.FC<{
  icon: string;
  color: string;
  title: string;
  desc: string;
  onClick?: () => void;
}> = ({ icon, color, title, desc, onClick }) => (
  <button
    onClick={onClick}
    className="group/card flex w-full min-w-0 items-start whitespace-normal rounded-xl border border-transparent p-2.5 sm:p-3 text-left transition-colors hover:border-blue-100 hover:bg-blue-50/50"
  >
    <div
      className={`flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 transition-colors group-hover/card:bg-white ${color}`}
    >
      <i className={`fa-solid ${icon} text-base sm:text-lg`}></i>
    </div>
    <div className="ml-3 sm:ml-4 min-w-0 flex-1">
      <h4 className="text-[13px] sm:text-[15px] font-bold leading-tight text-gray-900">
        {title}
      </h4>
      <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-[13px] leading-relaxed text-gray-500 line-clamp-2">
        {desc}
      </p>
    </div>
  </button>
);

const NotificationItem: React.FC<{
  icon: string;
  color: string;
  text: string;
  time: string;
  unread?: boolean;
}> = ({ icon, color, text, time, unread }) => (
  <button
    className={`flex w-full items-start gap-2.5 sm:gap-3 border-b border-gray-50 px-3 sm:px-4 py-2.5 sm:py-3 text-left transition-colors hover:bg-gray-50 ${
      unread ? "bg-blue-50/30" : ""
    }`}
  >
    <div
      className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full ${color}`}
    >
      <i className={`fa-solid ${icon} text-xs sm:text-sm`}></i>
    </div>
    <div className="flex-1">
      <p className="text-[12px] sm:text-[13px] leading-snug text-gray-800">
        {text}
      </p>
      <span className="mt-0.5 sm:mt-1 block text-[10px] sm:text-[11px] text-gray-500">
        {time}
      </span>
    </div>
    {unread && (
      <div className="mt-1.5 sm:mt-2 h-1.5 sm:h-2 w-1.5 sm:w-2 shrink-0 rounded-full bg-brand-blue"></div>
    )}
  </button>
);

const EducationNavbar: React.FC<EducationNavbarProps> = ({
  onNavigate,
  user = null,
  onLogout,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const lastScrollY = useRef(0);
  const router = useRouter();

  const [mobileMenus, setMobileMenus] = useState<Record<string, boolean>>({});
  const toggleMobileMenu = (key: string) => {
    setMobileMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const [currentNotifTab, setCurrentNotifTab] = useState("all");
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "notice",
      title: "Application Status Update",
      message:
        "Stanford University has updated your application status. View portal for details.",
      time: "10m ago",
      isRead: false,
      isArchived: false,
      isFollowing: true,
      icon: "file-check-2",
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      id: "2",
      type: "exam",
      title: "Midterm Exam Reminder",
      message:
        "AP Physics 1 regular exam is in 3 days. Make sure you are prepared!",
      time: "1h ago",
      isRead: false,
      isArchived: false,
      isFollowing: true,
      icon: "pen-tool",
      color: "text-red-500",
      bgColor: "bg-red-100",
    },
    {
      id: "3",
      type: "match",
      title: "New College Match!",
      message:
        "Based on your profile, you are a 95% match for Cornell University.",
      time: "3h ago",
      isRead: true,
      isArchived: false,
      isFollowing: false,
      icon: "zap",
      color: "text-pink-500",
      bgColor: "bg-pink-100",
    },
    {
      id: "4",
      type: "scholarship",
      title: "Scholarship Match!",
      message:
        "You match the criteria for the National Merit Scholarship program.",
      time: "Yesterday",
      isRead: true,
      isArchived: false,
      isFollowing: false,
      icon: "award",
      color: "text-yellow-500",
      bgColor: "bg-yellow-100",
    },
    {
      id: "5",
      type: "poll",
      title: "New Poll in Student Hub",
      message: "Vote for the next virtual campus tour destination.",
      time: "2 days ago",
      isRead: true,
      isArchived: false,
      isFollowing: true,
      icon: "pie-chart",
      color: "text-green-500",
      bgColor: "bg-green-100",
    },
    {
      id: "6",
      type: "system",
      title: "Configuration Complete",
      message:
        "Congratulations! You have successfully created your Studsphere account.",
      time: "3 days ago",
      isRead: true,
      isArchived: false,
      isFollowing: false,
      icon: "settings",
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
    {
      id: "7",
      type: "system",
      title: "New Feature Added! 🎉",
      message:
        "Dark mode is now available. Check your settings to toggle your theme.",
      time: "4 days ago",
      isRead: true,
      isArchived: false,
      isFollowing: false,
      icon: "sparkles",
      color: "text-indigo-500",
      bgColor: "bg-indigo-100",
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const toggleArchive = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isArchived: !n.isArchived } : n)),
    );
  };

  const removeNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (currentNotifTab === "all" && !n.isArchived)
          return { ...n, isRead: true };
        if (
          currentNotifTab === "following" &&
          !n.isArchived &&
          n.isFollowing
        )
          return { ...n, isRead: true };
        if (
          currentNotifTab === "system" &&
          !n.isArchived &&
          n.type === "system"
        )
          return { ...n, isRead: true };
        if (currentNotifTab === "archive" && n.isArchived)
          return { ...n, isRead: true };
        return n;
      }),
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 16);

      if (currentScrollY > lastScrollY.current && currentScrollY > 110) {
        setIsVisible(false);
        setActiveMenu(null);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".menu-anchor")) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    if (isMobileOpen || showMobileSearch) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen, showMobileSearch]);

  const initials = useMemo(() => {
    if (!user) return "SS";
    const first = user.first_name?.charAt(0) || "S";
    const last = user.last_name?.charAt(0) || "S";
    return `${first}${last}`.toUpperCase();
  }, [user]);

  const profileLabel = useMemo(() => {
    if (!user) return "Student";
    if (user.role === "admin") return "Admin";
    return "Student";
  }, [user]);

  const go = (viewKey: string, data?: { level?: string }) => {
    onNavigate?.(viewKey, data);
    if (viewKey === "admissionsDiscovery" && data?.level) {
      router.push(`/admissions/${data.level}`);
    } else {
      router.push(routeMap[viewKey] ?? "/");
    }
    setIsMobileOpen(false);
    setActiveMenu(null);
    setShowMobileSearch(false);
  };

  return (
    <>
      <header
        className={`fixed left-0 top-0 z-110 w-full bg-white transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${isScrolled ? "shadow-sm" : ""}`}
      >
        <div className="w-full px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-350 items-center justify-between gap-1.5 xs:gap-2 sm:gap-4 py-2.5 sm:py-3">
            <Link
              href="/"
              className="flex shrink-0 cursor-pointer items-center gap-2"
            >
              <span className="text-[20px] sm:text-[22px] font-extrabold tracking-tight text-brand-blue leading-none">
                Studsphere
              </span>
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:block flex-1 max-w-xl mx-4">
              <SearchBar />
            </div>


            <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 shrink-0">
              {/* Write a Review - Desktop */}
              <button
                onClick={() => go("writeReview")}
                className="hidden lg:flex items-center gap-2 bg-brand-blue hover:bg-brand-hover text-white px-4 py-2.5 rounded-md text-[14px] font-semibold transition-colors shrink-0"
              >
                <i className="fa-solid fa-pen-to-square text-sm"></i>
                <span>Write a Review</span>
              </button>

              {/* Mobile Search Icon */}
              <button
                className="md:hidden flex h-9.5 w-9.5 items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600 shrink-0"
                onClick={() => {
                  setShowMobileSearch((prev) => !prev);
                  setIsMobileOpen(false);
                }}
                aria-label="Toggle mobile search"
              >
                <Search size={18} />
              </button>

              {/* Notification Bell */}
              <div className="menu-anchor relative group/notif">
                <button
                  onClick={() =>
                    setActiveMenu((prev) =>
                      prev === "notification-menu" ? null : "notification-menu"
                    )
                  }
                  className="relative flex items-center justify-center w-9.5 h-9.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors text-[#475569] shrink-0"
                >
                  <Bell size={18} />
                  {notifications.filter((n) => !n.isRead && !n.isArchived).length >
                    0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#f44336] text-[11px] font-bold text-white shadow-sm">
                      {
                        notifications.filter((n) => !n.isRead && !n.isArchived)
                          .length
                      }
                    </span>
                  )}
                </button>

                {activeMenu === "notification-menu" && (
                  <div className="absolute top-full right-0 z-200 mt-2 cursor-default font-inter sm:-right-2">
                    <div className="absolute -top-1.5 right-6 z-30 h-3 w-3 rotate-45 border-l border-t border-gray-200 bg-white"></div>
                    <div className="relative z-20 flex w-[320px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-[0_8px_30px_rgb(0,0,0,0.12)] sm:w-95">
                      <div className="z-10 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Notifications
                          </h3>
                          {notifications.filter((n) => !n.isRead && !n.isArchived)
                            .length > 0 && (
                            <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white shadow-sm">
                              {
                                notifications.filter(
                                  (n) => !n.isRead && !n.isArchived,
                                ).length
                              }
                            </span>
                          )}
                        </div>
                        <button
                          onClick={markAllAsRead}
                          className="rounded-md px-2 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-900"
                        >
                          Mark all as read
                        </button>
                      </div>
                      <div className="no-scrollbar flex gap-4 overflow-x-auto whitespace-nowrap border-b border-gray-50 bg-gray-50/50 px-4 py-2 text-sm">
                        {["all", "following", "system", "archive"].map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setCurrentNotifTab(tab)}
                            className={`pb-1 capitalize transition-all ${
                              currentNotifTab === tab
                                ? "border-b-2 border-blue-600 font-medium text-blue-600"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                      <div className="no-scrollbar flex max-h-75 flex-col overflow-y-auto">
                        {notifications
                          .filter((n) => {
                            if (currentNotifTab === "all") return !n.isArchived;
                            if (currentNotifTab === "following")
                              return !n.isArchived && n.isFollowing;
                            if (currentNotifTab === "system")
                              return !n.isArchived && n.type === "system";
                            if (currentNotifTab === "archive") return n.isArchived;
                            return true;
                          })
                          .map((notif) => (
                            <div
                              key={notif.id}
                              className="group relative flex cursor-pointer items-start gap-3 border-b border-gray-50 bg-white p-3 transition-colors hover:bg-gray-50"
                              onClick={() => markAsRead(notif.id)}
                            >
                              <div
                                className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${notif.bgColor} ${notif.color}`}
                              >
                                <i className="fa-solid fa-bell text-sm"></i>
                              </div>
                              <div className="flex-1 min-w-0 pr-10">
                                <div className="mb-0.5 flex flex-wrap items-center gap-2">
                                  <p className="truncate text-sm font-semibold text-black">
                                    {notif.title}
                                  </p>
                                  {notif.isFollowing && (
                                    <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-600 whitespace-nowrap">
                                      Following
                                    </span>
                                  )}
                                </div>
                                <p className="line-clamp-2 text-sm leading-relaxed text-gray-800">
                                  {notif.message}
                                </p>
                                <p className="mt-1.5 flex items-center gap-1 text-xs text-gray-500">
                                  <Clock size={12} /> {notif.time}
                                </p>
                              </div>
                              {!notif.isRead && (
                                <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-blue-500"></div>
                              )}
                              <div className="absolute bottom-3 right-3 flex gap-1 opacity-0 transition-all group-hover:opacity-100">
                                <button
                                  onClick={(e) => toggleArchive(notif.id, e)}
                                  className="rounded-md p-1 px-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                >
                                  {notif.isArchived ? (
                                    <ArchiveRestore size={16} />
                                  ) : (
                                    <Archive size={16} />
                                  )}
                                </button>
                                <button
                                  onClick={(e) => removeNotification(notif.id, e)}
                                  className="rounded-md p-1 px-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                      <div className="border-t border-gray-100 bg-gray-50/50 p-3">
                        <button className="w-full rounded-lg py-2 text-center text-sm font-medium text-gray-600 transition-colors hover:text-blue-600">
                          View all activity
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile - sm+ only */}
              <div className="hidden lg:block w-px h-8 bg-gray-200"></div>
              <div className="hidden sm:flex items-center gap-3 cursor-pointer group relative py-1">
                {!user ? (
                   <div className="flex items-center overflow-hidden rounded-md text-[13px] font-medium shadow-sm">
                    <button onClick={() => go("login")} className="border-r border-gray-200 bg-gray-100 px-3 py-2 text-[#334155] transition-colors hover:bg-gray-200">Login</button>
                    <button onClick={() => go("signup")} className="bg-brand-blue px-3 py-2 text-white transition-colors hover:bg-brand-hover">Register</button>
                  </div>
                ) : (
                  <>
                    <button onClick={() => setActiveMenu(prev => prev === 'profile-menu' ? null : 'profile-menu')} className="flex items-center gap-3">
                      <div className="relative">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue text-white font-bold text-sm shadow-sm ring-2 ring-white">
                          <span>{initials}</span>
                        </div>
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div className="hidden lg:flex flex-col text-left">
                        <div className="flex items-center gap-1">
                          <span className="text-[14px] font-bold text-gray-800 leading-tight group-hover:text-primary transition-colors">{user.first_name} {user.last_name}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#0000FF"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" /></svg>
                        </div>
                        <span className="text-[12px] text-gray-500 leading-tight font-semibold mt-0.5">{profileLabel}</span>
                      </div>
                      <ChevronDown size={14} className="text-gray-400 group-hover:text-primary transition-colors ml-1 hidden lg:block" />
                    </button>

                    {activeMenu === 'profile-menu' && (
                      <div className="absolute top-full right-0 pt-3 z-200 cursor-default font-inter">
                        <div className="w-67.5 bg-white rounded-[18px] border border-gray-100/80 p-2.5 text-[14px] text-gray-600 font-medium select-none shadow-[0_8px_30px_rgb(0,0,0,0.08)] relative">
                          <div className="absolute -top-1.5 right-6 w-3 h-3 bg-white border-t border-l border-gray-100/80 transform rotate-45"></div>
                          <div className="flex flex-col relative z-10 bg-white rounded-xl">
                            <div onClick={() => go("studentDashboard")} className="flex flex-col px-3 py-3 bg-[#f4f4f5] rounded-xl cursor-pointer mb-1 hover:bg-gray-100 transition-all">
                              <div className="flex items-center gap-3 text-gray-900">
                                <User size={18} />
                                <span className="font-semibold">View Profile</span>
                              </div>
                              <div className="mt-2.5 pl-7.5">
                                <div className="flex justify-between items-center text-[11px] font-semibold text-gray-500 mb-1.5">
                                  <span>Profile Completion</span>
                                  <span className="text-[#5468FF]">80%</span>
                                </div>
                                <div className="w-full bg-gray-200/80 rounded-full h-1.5">
                                  <div className="bg-brand-blue h-1.5 rounded-full w-[80%]"></div>
                                </div>
                              </div>
                            </div>
                            <button onClick={() => go("studentDashboard")} className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-xl transition-all">
                              <FileText size={18} />
                              <span>My Application</span>
                            </button>
                            <button onClick={() => go("studentDashboard")} className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-xl transition-all">
                              <Bookmark size={18} />
                              <span>Saved College</span>
                              <span className="ml-auto text-gray-400 text-xs font-semibold">12</span>
                            </button>
                            <div className="h-px bg-gray-100 my-1.5 mx-2"></div>
                            <button onClick={onLogout} className="flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 text-red-500 rounded-xl transition-all">
                              <LogOut size={18} className="scale-x-[-1]" />
                              <span>Sign out</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <button
                className="flex h-10 w-10 items-center justify-center text-gray-600 md:hidden rounded-md hover:bg-gray-100 transition-colors ml-1"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                aria-label="Toggle menu"
              >
                {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

          </div>
        </div>

        {/* Nav Links Row - Desktop */}
        <div className="relative hidden w-full border-b border-gray-200 px-3 xs:px-4 sm:px-6 lg:px-8 md:block">
            <div className="mx-auto flex h-11 sm:h-11.5 w-full max-w-350 items-center gap-3 sm:gap-4 overflow-visible">
              <nav className="no-scrollbar relative flex h-full min-w-0 flex-1 items-center gap-x-4 sm:gap-x-5 md:gap-x-6 lg:gap-x-7 xl:gap-x-8 overflow-visible whitespace-nowrap pr-2 text-[13px] sm:text-[14px] lg:text-[15px] font-medium text-[#212529]">
                <NavItem onClick={() => go("findCollege")}>Find College</NavItem>

                <DesktopDropdown label="Tools" isOpen={activeMenu === "tools"} onToggle={() => setActiveMenu((prev) => prev === "tools" ? null : "tools")}>
                <DropdownCard
                  icon="fa-shuffle"
                  color="text-blue-500"
                  title="Compare College"
                  desc="Launching Soon"
                  onClick={() => {}}
                />
                <DropdownCard
                  icon="fa-compass"
                  color="text-green-500"
                  title="Course Finder"
                  desc="Discover the perfect academic course tailored to your skills and career goals."
                  onClick={() => go("courseFinder")}
                />
                <DropdownCard
                  icon="fa-headset"
                  color="text-emerald-500"
                  title="Get Counselling?"
                  desc="Get expert counselling to choose your ideal college and course."
                  onClick={() => go("bookCounselling")}
                />
                <DropdownCard
                  icon="fa-award"
                  color="text-yellow-500"
                  title="Scholarship Finder"
                  desc="Discover scholarships tailored to your academic profile and financial needs."
                  onClick={() => go("scholarshipFinderTool")}
                />
                <DropdownCard
                  icon="fa-wand-magic-sparkles"
                  color="text-emerald-500"
                  title="College Recommender"
                  desc="Get personalized college recommendations based on your preferences."
                  onClick={() => go("collegeRecommenderTool")}
                />
              </DesktopDropdown>

              <DesktopDropdown label="Scholarships" isOpen={activeMenu === "scholarships"} onToggle={() => setActiveMenu((prev) => prev === "scholarships" ? null : "scholarships")}>
                <DropdownCard
                  icon="fa-graduation-cap"
                  color="text-yellow-500"
                  title="Find Scholarship"
                  desc="Browse available scholarships to fund your education."
                  onClick={() => go("scholarshipFinder")}
                />
                <DropdownCard
                  icon="fa-building-ngo"
                  color="text-indigo-500"
                  title="Scholarship Provider"
                  desc="List and manage scholarship programs with us."
                  onClick={() => go("scholarshipProviderZone")}
                />
              </DesktopDropdown>

              <NavItem onClick={() => go("campusForum")}>Campus Feed</NavItem>

              <DesktopDropdown label="Admission" isOpen={activeMenu === "admission"} onToggle={() => setActiveMenu((prev) => prev === "admission" ? null : "admission")}>
                <DropdownCard
                  icon="fa-school"
                  color="text-blue-500"
                  title="High School (+2)"
                  desc="Explore top high schools for Science, Management, and Humanities."
                  onClick={() =>
                    go("admissionsDiscovery", { level: "high-school" })
                  }
                />
                <DropdownCard
                  icon="fa-cubes"
                  color="text-orange-500"
                  title="A-Level"
                  desc="Discover internationally recognized Cambridge A-Level degrees."
                  onClick={() =>
                    go("admissionsDiscovery", { level: "a-level" })
                  }
                />

                <DropdownCard
                  icon="fa-wrench"
                  color="text-green-600"
                  title="Diploma / CTEVT"
                  desc="Explore skills-oriented technical and vocational education."
                  onClick={() => go("admissionsDiscovery", { level: "diploma" })}
                />
              </DesktopDropdown>

              <NavItem onClick={() => go("entranceDiscovery")}>
                Entrance
              </NavItem>
              <DesktopDropdown label="More" alignRight isOpen={activeMenu === "more"} onToggle={() => setActiveMenu((prev) => prev === "more" ? null : "more")}>
                <DropdownCard
                  icon="fa-newspaper"
                  color="text-blue-500"
                  title="News"
                  desc="Stay updated with the latest educational news."
                  onClick={() => go("newsPage")}
                />
                <DropdownCard
                  icon="fa-pen"
                  color="text-green-500"
                  title="Blogs"
                  desc="Read insights, study tips, and campus experiences."
                  onClick={() => go("blogPage")}
                />
                <DropdownCard
                  icon="fa-calendar-days"
                  color="text-orange-500"
                  title="Events"
                  desc="Join upcoming webinars, fairs, and campus events."
                  onClick={() => go("eventsPage")}
                />
                <DropdownCard
                  icon="fa-envelope"
                  color="text-purple-600"
                  title="Contact Us"
                  desc="Reach out to our support team for any assistance."
                  onClick={() => go("contact")}
                />
              </DesktopDropdown>
            </nav>

            {!user && (
              <div className="ml-2 flex shrink-0 items-center border-l-2 border-gray-100 py-2 pl-3 sm:ml-4 sm:pl-6">
                <button
                  onClick={() => go("institutionZone")}
                  className="flex items-center gap-1 sm:gap-1.5 whitespace-nowrap text-[12px] sm:text-[13px] font-semibold text-[#0f172a] transition-colors hover:text-[#4461f2]"
                >
                  <span className="hidden lg:inline">Institution Zone</span>
                  <span className="lg:hidden">Inst. Zone</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {isMobileOpen && (
          <div
            className="fixed inset-x-0 top-full bottom-0 z-100 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {showMobileSearch && (
          <div
            className="fixed inset-0 z-150 bg-black/35 backdrop-blur-sm md:hidden"
            onClick={() => setShowMobileSearch(false)}
          >
            <div
              className="mx-4 mt-20 rounded-2xl border border-gray-200 bg-white p-3 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <SearchBar isMobile />
            </div>
          </div>
        )}

        {/* Mobile Menu Dropdown (Visible only when toggled on smaller screens) */}
        <div 
          className={`${isMobileOpen ? "block" : "hidden"} md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-lg px-4 py-4 z-200 max-h-[calc(100vh-70px)] overflow-y-auto no-scrollbar font-inter transition-all duration-300`}
        >
            {/* Mobile Search */}
            <div className="flex items-center border border-gray-300 rounded-full h-11 bg-white focus-within:border-brand-blue focus-within:ring-1 focus-within:ring-brand-blue overflow-hidden mb-5">
                <div className="flex items-center gap-2 px-4 h-full flex-1 w-full text-gray-500">
                    <Search size={16} className="text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search +2 science colleges..." 
                      className="w-full h-full outline-none text-[14px] font-semibold text-gray-800 placeholder-gray-400 bg-transparent"
                    />
                </div>
            </div>

            {/* Mobile Auth Profile */}
            <div className="sm:hidden">
                {!user ? (
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <button onClick={() => go("login")} className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 transition-all active:scale-[0.98]">
                       <User size={16} /> <span>Log in</span>
                    </button>
                    <button onClick={() => go("signup")} className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition-all active:scale-[0.98]">
                      <span>Join Now</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <div 
                      className="flex items-center justify-between mb-5 p-3 rounded-lg border border-gray-200 bg-gray-50 cursor-pointer"
                      onClick={() => toggleMobileMenu('profile')}
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm border border-gray-200">
                                   <span>{initials}</span>
                                </div>
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>
                            <div className="flex flex-col justify-center text-left">
                                <div className="flex items-center gap-1">
                                    <span className="text-[15px] font-bold text-gray-800 leading-tight">{user.first_name} {user.last_name}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#0040ff" className="icon icon-tabler icons-tabler-filled icon-tabler-rosette-discount-check"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" /></svg>
                                </div>
                                <span className="text-[13px] text-gray-500 leading-tight font-semibold mt-0.5">{profileLabel}</span>
                            </div>
                        </div>
                        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${mobileMenus['profile'] ? "rotate-180" : ""}`} />
                    </div>

                    <div className={`${mobileMenus['profile'] ? "flex" : "hidden"} flex-col mb-5 -mt-3`}>
                        <div className="w-full bg-white rounded-[18px] border border-gray-100/80 p-2.5 text-[14px] text-gray-600 font-medium select-none shadow-sm">
                            <div onClick={() => go("studentDashboard")} className="flex flex-col px-3 py-3 bg-[#f4f4f5] rounded-xl cursor-pointer mb-1 hover:bg-gray-100 transition-all duration-200">
                                <div className="flex items-center gap-3 text-gray-900">
                                    <User size={18} className="text-gray-500" />
                                    <span className="font-semibold">View Profile</span>
                                </div>
                                <div className="mt-2.5 pl-7.5">
                                    <div className="flex justify-between items-center text-[11px] font-semibold text-gray-500 mb-1.5">
                                        <span>Profile Completion</span>
                                        <span className="text-[#5468FF]">80%</span>
                                    </div>
                                    <div className="w-full bg-gray-200/80 rounded-full h-1.5 border border-gray-100 shadow-inner">
                                        <div className="bg-brand-blue h-1.5 rounded-full w-[80%]"></div>
                                    </div>
                                </div>
                            </div>

                            <div onClick={() => go("studentDashboard")} className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-xl cursor-pointer mb-0.5 transition-all">
                                <FileText size={18} className="text-gray-500" />
                                <span>My Application</span>
                                <span className="ml-auto w-2.5 h-2.5 bg-red-500 rounded-full shadow-sm"></span>
                            </div>

                            <div onClick={() => go("studentDashboard")} className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-xl cursor-pointer mb-0.5 transition-all">
                                <Bookmark size={18} className="text-gray-500" />
                                <span>Saved College</span>
                                <span className="ml-auto text-gray-400 text-xs font-bold leading-none">12</span>
                            </div>

                            <div onClick={() => go("studentDashboard")} className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-xl cursor-pointer mb-0.5 transition-all">
                                <Sparkles size={18} className="text-gray-500" />
                                <span>Match</span>
                                <span className="ml-auto bg-[#5468FF]/10 text-[#5468FF] text-[11px] font-bold px-2 py-0.5 rounded-full">3</span>
                            </div>

                            <div className="h-px bg-gray-100 my-1.5 mx-2"></div>

                            <div onClick={() => go("studentDashboard")} className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-xl cursor-pointer mb-0.5 transition-all">
                                <Bell size={18} className="text-gray-500" />
                                <span>Notifications</span>
                                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-[1.5px] rounded-full leading-none">2</span>
                            </div>

                            <div onClick={() => go("studentDashboard")} className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-xl cursor-pointer transition-all">
                                <Settings size={18} className="text-gray-500" />
                                <span>Settings</span>
                            </div>

                            <div className="h-px bg-gray-100 my-1.5 mx-2"></div>

                            <div onClick={() => go("contact")} className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-xl cursor-pointer transition-all">
                                <MessageCircleQuestion size={18} className="text-gray-500" />
                                <span>Help center</span>
                            </div>

                            <div onClick={onLogout} className="flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 rounded-xl cursor-pointer mt-1 text-[#FF6B6B] transition-all">
                                <LogOut size={18} className="scale-x-[-1]" />
                                <span className="font-bold">Sign out</span>
                            </div>
                        </div>
                    </div>
                  </>
                )}
            </div>

            {/* Mobile Links */}
            <div className="flex flex-col gap-1 text-[15px] text-gray-700 font-semibold pb-4">
                <button onClick={() => go("findCollege")} className="w-full text-left hover:text-blue-600 hover:bg-gray-50 p-2 rounded-lg transition-colors">Find College</button>
                
                {/* Mobile Tools Dropdown */}
                <div>
                    <button 
                      className={`w-full text-left hover:text-blue-600 hover:bg-gray-50 p-2 rounded-lg transition-colors flex justify-between items-center ${mobileMenus['tools'] ? "text-blue-600" : ""}`}
                      onClick={() => toggleMobileMenu('tools')}
                    >
                        Tools <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${mobileMenus['tools'] ? "rotate-180" : ""}`} />
                    </button>
                    <div className={`${mobileMenus['tools'] ? "flex" : "hidden"} flex-col gap-1 pl-4 py-2 ml-2 mt-1 font-medium`}>
                        <button className="text-[14px] text-gray-400 p-2 rounded-lg flex items-center gap-3 cursor-not-allowed"><i className="fa-solid fa-shuffle w-4 text-center text-blue-500"></i> Compare College <span className="ml-auto text-[10px] font-bold text-gray-400">SOON</span></button>
                        <button onClick={() => go("courseFinder")} className="text-[14px] text-gray-600 hover:text-blue-600 hover:bg-gray-50 p-2 rounded-lg transition-colors flex items-center gap-3"><i className="fa-solid fa-compass w-4 text-center text-green-500"></i> Course Finder</button>
                        <button onClick={() => go("bookCounselling")} className="text-[14px] text-gray-600 hover:text-blue-600 hover:bg-gray-50 p-2 rounded-lg transition-colors flex items-center gap-3"><i className="fa-solid fa-headset w-4 text-center text-teal-600"></i> Get Counselling?</button>
                        <button onClick={() => go("scholarshipFinderTool")} className="text-[14px] text-gray-600 hover:text-blue-600 hover:bg-gray-50 p-2 rounded-lg transition-colors flex items-center gap-3"><i className="fa-solid fa-award w-4 text-center text-yellow-500"></i> Scholarship Finder</button>
                        <button onClick={() => go("collegeRecommenderTool")} className="text-[14px] text-gray-600 hover:text-blue-600 hover:bg-gray-50 p-2 rounded-lg transition-colors flex items-center gap-3"><i className="fa-solid fa-wand-magic-sparkles w-4 text-center text-emerald-500"></i> College Recommender</button>
                    </div>
                </div>

                {/* Mobile Scholarships Dropdown */}
                <div>
                    <button 
                      className={`w-full text-left hover:text-blue-600 hover:bg-gray-50 p-2 rounded-lg transition-colors flex justify-between items-center ${mobileMenus['scholarships'] ? "text-blue-600" : ""}`}
                      onClick={() => toggleMobileMenu('scholarships')}
                    >
                        Scholarships <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${mobileMenus['scholarships'] ? "rotate-180" : ""}`} />
                    </button>
                    <div className={`${mobileMenus['scholarships'] ? "flex" : "hidden"} flex-col gap-1 pl-4 py-2 ml-2 mt-1 font-medium`}>
                        <button onClick={() => go("scholarshipFinder")} className="text-[14px] text-gray-600 hover:text-blue-600 hover:bg-gray-50 p-2 rounded-lg transition-colors flex items-center gap-3"><i className="fa-solid fa-graduation-cap w-4 text-center text-yellow-500"></i> Find Scholarship</button>
                        <button onClick={() => go("scholarshipProviderZone")} className="text-[14px] text-gray-600 hover:text-blue-600 hover:bg-gray-50 p-2 rounded-lg transition-colors flex items-center gap-3"><i className="fa-solid fa-building w-4 text-center text-indigo-500"></i> Scholarship Provider</button>
                    </div>
                </div>

                <button onClick={() => go("campusForum")} className="w-full text-left hover:text-blue-600 hover:bg-gray-50 p-2 rounded-lg transition-colors flex items-center justify-between">
                  Campus Feed <span className="bg-blue-600 text-white text-[10px] leading-none px-1.5 py-1 rounded font-bold tracking-wide">NEW</span>
                </button>
                
                {/* Mobile Admission Dropdown */}
                <div>
                    <button 
                      className={`w-full text-left hover:text-blue-600 hover:bg-gray-50 p-2 rounded-lg transition-colors flex justify-between items-center ${mobileMenus['admission'] ? "text-blue-600" : ""}`}
                      onClick={() => toggleMobileMenu('admission')}
                    >
                        Admission <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${mobileMenus['admission'] ? "rotate-180" : ""}`} />
                    </button>
                    <div className={`${mobileMenus['admission'] ? "flex" : "hidden"} flex-col gap-1 pl-4 py-2 ml-2 mt-1 font-medium`}>
                        <button onClick={() => go("admissionsDiscovery", { level: "high-school" })} className="text-[14px] text-gray-600 hover:text-blue-600 hover:bg-gray-50 p-2 rounded-lg transition-colors flex items-center gap-3"><i className="fa-solid fa-school w-4 text-center text-blue-500"></i> High School (+2)</button>
                        <button onClick={() => go("admissionsDiscovery", { level: "a-level" })} className="text-[14px] text-gray-600 hover:text-blue-600 hover:bg-gray-50 p-2 rounded-lg transition-colors flex items-center gap-3"><i className="fa-solid fa-cubes w-4 text-center text-orange-500"></i> A-Level</button>
                        <button onClick={() => go("admissionsDiscovery", { level: "diploma" })} className="text-[14px] text-gray-600 hover:text-blue-600 hover:bg-gray-50 p-2 rounded-lg transition-colors flex items-center gap-3"><i className="fa-solid fa-wrench w-4 text-center text-green-600"></i> Diploma / CTEVT</button>
                    </div>
                </div>

                <button onClick={() => go("entranceDiscovery")} className="w-full text-left hover:text-blue-600 hover:bg-gray-50 p-2 rounded-lg transition-colors">Entrance</button>
                
                {/* Mobile More Dropdown */}
                <div>
                    <button 
                      className={`w-full text-left hover:text-blue-600 hover:bg-gray-50 p-2 rounded-lg transition-colors flex justify-between items-center ${mobileMenus['more'] ? "text-blue-600" : ""}`}
                      onClick={() => toggleMobileMenu('more')}
                    >
                        More <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${mobileMenus['more'] ? "rotate-180" : ""}`} />
                    </button>
                    <div className={`${mobileMenus['more'] ? "flex" : "hidden"} flex-col gap-1 pl-4 py-2 ml-2 mt-1 font-medium`}>
                        <button onClick={() => go("newsPage")} className="text-[14px] text-gray-600 hover:text-blue-600 hover:bg-gray-50 p-2 rounded-lg transition-colors flex items-center gap-3"><i className="fa-regular fa-newspaper w-4 text-center text-blue-500"></i> News</button>
                        <button onClick={() => go("blogPage")} className="text-[14px] text-gray-600 hover:text-blue-600 hover:bg-gray-50 p-2 rounded-lg transition-colors flex items-center gap-3"><i className="fa-solid fa-pen w-4 text-center text-green-500"></i> Blogs</button>
                        <button onClick={() => go("eventsPage")} className="text-[14px] text-gray-600 hover:text-blue-600 hover:bg-gray-50 p-2 rounded-lg transition-colors flex items-center gap-3"><i className="fa-regular fa-calendar w-4 text-center text-orange-500"></i> Events</button>
                        <button onClick={() => go("contact")} className="text-[14px] text-gray-600 hover:text-blue-600 hover:bg-gray-50 p-2 rounded-lg transition-colors flex items-center gap-3"><i className="fa-solid fa-envelope w-4 text-center text-purple-600"></i> Contact Us</button>
                    </div>
                </div>

                {/* Institution Zone - Partner Modules (Included for continuity) */}
                {user && (
                    <div>
                        <button 
                          className={`w-full text-left hover:text-blue-600 hover:bg-gray-50 p-2 rounded-lg transition-colors flex justify-between items-center ${mobileMenus['partners'] ? "text-blue-600" : ""}`}
                          onClick={() => toggleMobileMenu('partners')}
                        >
                            Partner Modules <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${mobileMenus['partners'] ? "rotate-180" : ""}`} />
                        </button>
                        <div className={`${mobileMenus['partners'] ? "flex" : "hidden"} flex-col gap-1 pl-4 py-2 ml-2 mt-1 font-medium`}>
                            <button onClick={() => go("institutionZone")} className="text-[14px] text-gray-600 hover:text-blue-600 hover:bg-gray-50 p-2 rounded-lg transition-colors flex items-center gap-3"><Building size={16} className="text-blue-500" /> Institution Zone</button>
                            <button onClick={() => go("scholarshipProviderZone")} className="text-[14px] text-gray-600 hover:text-blue-600 hover:bg-gray-50 p-2 rounded-lg transition-colors flex items-center gap-3"><Award size={16} className="text-indigo-500" /> Provider Zone</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </header>
    </>
  );
};

export default EducationNavbar;
