"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SearchBar } from "@/components/SearchBar";
import {
  Bell,
  Clock,
  Archive,
  ArchiveRestore,
  Trash2,
  User,
  FileText,
  Bookmark,
  Settings,
  LogOut,
  MessageCircleQuestion,
  Search,
  ChevronDown,
  X,
  Menu,
  FileSpreadsheet,
  Home,
  MessageSquare,
  Sparkles,
  LogIn,
  CircleUser,
} from "lucide-react";
import {
  desktopMenuSections,
  initialNotifications,
  mobileMenuSections,
  notificationTabs,
  partnerMobileItems,
  routeMap,
} from "./config";
import { DesktopDropdown, DropdownCard, NavItem } from "./NavUi";
import {
  DropdownItem,
  EducationNavbarProps,
  MobileMenuItem,
  NotificationTab,
  ViewKey,
} from "./types";
import Image from "next/image";
import { trendingSearches } from "@/utils/searchDatabase";
import { apiService, DashboardStats, getImageUrl } from "@/services/api";
import TopBar from "./TopBar";

const EducationNavbar: React.FC<EducationNavbarProps> = ({
  onNavigate,
  user = null,
  onLogout,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const [mobileMenus, setMobileMenus] = useState<Record<string, boolean>>({});
  const drawerDirection = "right";
  const mobileSearchSuggestions = trendingSearches.slice(0, 4);
  const [mobileLiveSuggestions, setMobileLiveSuggestions] = useState<
    { title: string; type: string }[]
  >(mobileSearchSuggestions);

  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null,
  );

  useEffect(() => {
    if (user) {
      apiService
        .getDashboardStats()
        .then((res) => {
          if (res?.data) {
            setDashboardStats(res.data);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const handleDropdownMouseEnter = (key: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setActiveMenu(key);
  };

  const handleDropdownMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const toggleMobileMenu = (key: string) => {
    setMobileMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleMobileDrawer = () => {
    setActiveMenu(null);
    setIsMobileOpen((prev) => !prev);
  };

  const handleMobileSearchStateChange = (
    query: string,
    suggestions: { title: string; type: string }[],
  ) => {
    setMobileLiveSuggestions(
      query.trim() === "" ? mobileSearchSuggestions : suggestions,
    );
  };

  const [currentNotifTab, setCurrentNotifTab] =
    useState<NotificationTab>("all");
  const [notifications, setNotifications] = useState(initialNotifications);
  const [studentNotifLoaded, setStudentNotifLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;
    apiService
      .getStudentNotifications(1, 50)
      .then((res) => {
        const list = res?.data?.notifications;
        if (Array.isArray(list) && list.length > 0) {
          setNotifications(
            list.map((n: any) => ({
              id: String(n.id),
              type: n.type || "system",
              title: n.title,
              message: n.message,
              time: n.created_at
                ? new Date(n.created_at).toLocaleDateString()
                : "",
              isRead: n.read,
              isArchived: false,
              isFollowing: false,
              icon: "fa-bell",
              color: "text-gray-500",
              bgColor: "bg-gray-100",
            })),
          );
        }
        setStudentNotifLoaded(true);
      })
      .catch(() => setStudentNotifLoaded(true));
  }, [user]);

  const visibleNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (currentNotifTab === "all") return !n.isArchived;
      if (currentNotifTab === "following")
        return !n.isArchived && n.isFollowing;
      if (currentNotifTab === "system")
        return !n.isArchived && n.type === "system";
      if (currentNotifTab === "archive") return n.isArchived;
      return true;
    });
  }, [currentNotifTab, notifications]);

  const unreadNotificationCount = useMemo(
    () => notifications.filter((n) => !n.isRead && !n.isArchived).length,
    [notifications],
  );

  const [publicNotifList, setPublicNotifList] = useState<
    {
      id: number;
      title: string;
      message: string;
      type: string;
      icon: string;
      color: string;
      bgColor: string;
    }[]
  >([]);

  const unreadPublicCount = publicNotifList.length;

  useEffect(() => {
    apiService
      .getPublicNotifications()
      .then((res) => {
        const data = res?.data;
        if (Array.isArray(data)) {
          setPublicNotifList(
            data.map((n: any) => ({
              id: n.id,
              title: n.title,
              message: n.message,
              type: n.type,
              icon: n.icon || "fa-bell",
              color: n.color || "text-gray-500",
              bgColor: n.bgColor || "bg-gray-100",
            })),
          );
        }
      })
      .catch(() => {});
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
    if (user) {
      apiService.markNotificationRead(Number(id)).catch(() => {});
    }
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
        if (currentNotifTab === "following" && !n.isArchived && n.isFollowing)
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
    if (user) {
      apiService.markAllNotificationsRead().catch(() => {});
    }
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
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  useEffect(() => {
    const handleOpenAuthModal = () => {
      router.push("/login");
    };

    window.addEventListener("studsphere:open-auth-modal", handleOpenAuthModal);
    return () =>
      window.removeEventListener(
        "studsphere:open-auth-modal",
        handleOpenAuthModal,
      );
  }, [router]);

  const initials = useMemo(() => {
    if (!user) return "SS";
    const first = user.first_name?.charAt(0) || "S";
    const last = user.last_name?.charAt(0) || "S";
    return `${first}${last}`.toUpperCase();
  }, [user]);

  const statusLabels: Record<string, string> = {
    see_graduate: "SEE Graduate",
    plus_two_running: "+2 Running",
    plus_two_graduate: "+2 Graduate",
  };

  const profileLabel = useMemo(() => {
    if (!user) return "Student";
    if (user.role === "admin") return "Admin";
    if (user.current_status && statusLabels[user.current_status]) {
      return statusLabels[user.current_status];
    }
    return "Student";
  }, [user]);

  const go = (viewKey: ViewKey, data?: { level?: string }) => {
    if (viewKey === "login") {
      router.push("/login");
      setIsMobileOpen(false);
      setActiveMenu(null);
      setMobileLiveSuggestions(mobileSearchSuggestions);
      return;
    }
    if (viewKey === "signup") {
      router.push("/register");
      setIsMobileOpen(false);
      setActiveMenu(null);
      setMobileLiveSuggestions(mobileSearchSuggestions);
      return;
    }

    onNavigate?.(viewKey, data);
    if (viewKey === "admissionsDiscovery" && data?.level) {
      router.push(`/admissions/${data.level}`);
    } else {
      router.push(routeMap[viewKey] ?? "/");
    }
    setIsMobileOpen(false);
    setActiveMenu(null);
    setMobileLiveSuggestions(mobileSearchSuggestions);
  };

  const renderMobileAction = (item: MobileMenuItem) => {
    const isDisabled = Boolean(item.disabled || !item.viewKey);

    return (
      <button
        key={item.label}
        onClick={
          isDisabled ? undefined : () => go(item.viewKey as ViewKey, item.data)
        }
        disabled={isDisabled}
        className={`flex items-center gap-3 rounded-md p-2 text-[14px] transition-colors ${
          isDisabled
            ? "cursor-not-allowed text-gray-400"
            : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
        }`}
      >
        {item.icon && (
          <i
            className={`fa-solid ${item.icon} w-4 text-center ${item.color ?? "text-gray-400"}`}
          ></i>
        )}
        <span>{item.label}</span>
        {item.badge && (
          <span className="ml-auto text-[10px] font-bold text-gray-400">
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  const getDropdownClick = (item: DropdownItem) => {
    const viewKey = item.viewKey;
    if (item.disabled || !viewKey) return undefined;
    return () => go(viewKey, item.data);
  };

  const toolsSection = desktopMenuSections.find(
    (section) => section.key === "tools",
  );
  const scholarshipsSection = desktopMenuSections.find(
    (section) => section.key === "scholarships",
  );
  const universitiesSection = desktopMenuSections.find(
    (section) => section.key === "universities",
  );
  const admissionSection = desktopMenuSections.find(
    (section) => section.key === "admission",
  );
  const moreSection = desktopMenuSections.find(
    (section) => section.key === "more",
  );

  const mobileToolsSection = mobileMenuSections.find(
    (section) => section.key === "tools",
  );
  const mobileScholarshipsSection = mobileMenuSections.find(
    (section) => section.key === "scholarships",
  );
  const mobileUniversitiesSection = mobileMenuSections.find(
    (section) => section.key === "universities",
  );
  const mobileAdmissionSection = mobileMenuSections.find(
    (section) => section.key === "admission",
  );
  const mobileMoreSection = mobileMenuSections.find(
    (section) => section.key === "more",
  );

  const normalizePath = (path: string) =>
    path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;

  const currentPath = normalizePath(pathname || "/");

  const isRouteActive = (path: string) => {
    const normalizedPath = normalizePath(path);
    if (normalizedPath === "/") return currentPath === "/";
    return (
      currentPath === normalizedPath ||
      currentPath.startsWith(`${normalizedPath}/`)
    );
  };

  const isViewActive = (viewKey?: ViewKey, data?: { level?: string }) => {
    if (!viewKey) return false;

    if (viewKey === "admissionsDiscovery") {
      if (data?.level) return isRouteActive(`/admissions/${data.level}`);
      return isRouteActive("/admissions");
    }

    const route = routeMap[viewKey];
    if (!route) return false;
    return isRouteActive(route);
  };

  const isSectionActive = (section?: {
    key: string;
    items: DropdownItem[];
  }) => {
    if (!section) return false;
    if (section.key === "admission" && isRouteActive("/admissions"))
      return true;
    return section.items.some((item) => isViewActive(item.viewKey, item.data));
  };

  return (
    <>
      <header
        className={`fixed left-0 top-0 z-[120] w-full bg-white transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${isScrolled ? "" : ""}`}
      >
        <TopBar />
        <div className="w-full px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-350 items-center justify-between gap-2 sm:gap-4 py-2.5 sm:py-3">
            {!user ? (
              <>
                {/* Mobile: Logo Left, Search Center, Hamburger Right */}
                <Link
                  href="/"
                  className="flex shrink-0 cursor-pointer items-center min-w-0 md:hidden"
                >
                  <Image
                    src="/mobilelogo.png"
                    alt="Studsphere Logo"
                    width={512}
                    height={512}
                    priority
                    className="h-9 w-auto object-contain"
                  />
                </Link>

                <div className="flex-1 md:hidden min-w-0 mx-1">
                  <SearchBar isMobile defaultSearchOpen={false} showSuggestionDropdown={false} />
                </div>

                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-100 shrink-0 z-10 md:hidden"
                  onClick={toggleMobileDrawer}
                  aria-label="Toggle menu"
                >
                  {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                {/* Desktop: Logo Left, Search Center, Login/Register Right */}
                <Link
                  href="/"
                  className="hidden md:flex shrink-0 cursor-pointer items-center min-w-0"
                >
                  <Image
                    src="/studsphere.png"
                    alt="Studsphere Logo"
                    width={4702}
                    height={1320}
                    priority
                    className="h-7 sm:h-9 w-auto max-w-55 sm:max-w-67.5 object-contain origin-left scale-115 sm:scale-125"
                  />
                </Link>

                <div className="hidden md:flex flex-1 max-w-3xl mx-4">
                  <SearchBar />
                </div>

                <div className="hidden md:flex items-center gap-1.5 xs:gap-2 sm:gap-3 shrink-0 z-10">
                  <button
                    onClick={() => go("login")}
                    className="hidden md:flex items-center gap-2 bg-brand-blue hover:bg-brand-hover text-white px-4 py-2.5 rounded-md text-[14px] font-semibold transition-colors shrink-0"
                  >
                    <i className="fa-solid fa-pen-to-square text-sm"></i>
                    <span>Write a Review</span>
                  </button>

                  {/* Notification Bell - Desktop (Public) */}
                  <div className="menu-anchor relative hidden md:block">
                    <button
                      onClick={() =>
                        setActiveMenu((prev) =>
                          prev === "public-notifications"
                            ? null
                            : "public-notifications",
                        )
                      }
                      className="relative flex items-center justify-center w-9.5 h-9.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors text-[#475569] shrink-0"
                    >
                      <Bell size={18} />
                      {unreadPublicCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#f44336] text-[11px] font-bold text-white">
                          {unreadPublicCount}
                        </span>
                      )}
                    </button>

                    {activeMenu === "public-notifications" && (
                      <div className="absolute top-full right-0 z-[200] mt-2 cursor-default font-inter sm:-right-2">
                        <div className="absolute -top-1.5 right-6 z-30 h-3 w-3 rotate-45 border-l border-t border-gray-200 bg-white"></div>
                        <div className="relative z-20 flex w-[320px] flex-col overflow-hidden rounded-md border border-gray-200 bg-white text-left shadow-[0_8px_30px_rgb(0,0,0,0.12)] sm:w-95">
                          <div className="z-10 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Notifications
                            </h3>
                          </div>
                          <div className="no-scrollbar flex max-h-75 flex-col overflow-y-auto">
                            {publicNotifList.length === 0 ? (
                              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                                <Bell size={32} className="mb-2 opacity-50" />
                                <p className="text-sm">No notifications</p>
                              </div>
                            ) : (
                              publicNotifList.map((notif) => (
                                <div
                                  key={notif.id}
                                  className="group relative flex cursor-pointer items-start gap-3 border-b border-gray-50 bg-white p-3 transition-colors hover:bg-gray-50"
                                >
                                  <div
                                    className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${notif.bgColor} ${notif.color}`}
                                  >
                                    <i
                                      className={`fa-solid ${notif.icon || "fa-bell"} text-sm`}
                                    ></i>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="mb-0.5 text-sm font-semibold text-black">
                                      {notif.title}
                                    </p>
                                    <p className="line-clamp-2 text-sm leading-relaxed text-gray-800">
                                      {notif.message}
                                    </p>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                          <div className="border-t border-gray-100 bg-gray-50/50 p-3">
                            <button
                              onClick={() => go("login")}
                              className="w-full rounded-md py-2 text-center text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
                            >
                              View all activity
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center">
                    <button
                      onClick={() => go("login")}
                      className="rounded-md sm:rounded-l-md bg-brand-blue sm:bg-[#f3f4f6] text-white sm:text-black px-3 sm:px-4 py-2 font-semibold transition-colors sm:hover:bg-gray-200 text-sm"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => go("signup")}
                      className="hidden sm:block rounded-r-md bg-brand-blue text-white px-3 sm:px-4 py-2 font-semibold transition-colors hover:bg-brand-hover text-sm"
                    >
                      Register
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Logged In: Logo Left, Search Center, Hamburger Right */}
                <Link
                  href="/"
                  className="flex shrink-0 cursor-pointer items-center min-w-0"
                >
                  <Image
                    src="/mobilelogo.png"
                    alt="Studsphere Logo"
                    width={512}
                    height={512}
                    priority
                    className="h-9 w-auto md:hidden object-contain"
                  />
                  <Image
                    src="/studsphere.png"
                    alt="Studsphere Logo"
                    width={4702}
                    height={1320}
                    priority
                    className="h-7 sm:h-9 w-auto max-w-55 sm:max-w-67.5 object-contain origin-left scale-115 sm:scale-125 hidden md:block"
                  />
                </Link>

                <div className="hidden md:block flex-1 max-w-3xl mx-4">
                  <SearchBar />
                </div>

                <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 shrink-0">
                  {/* Hamburger Menu - Mobile (Logged In) */}
                  <button
                    type="button"
                    className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-100 md:hidden"
                    onClick={toggleMobileDrawer}
                    aria-label="Toggle menu"
                  >
                    {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
                  </button>

                  {/* Notification Bell - Desktop */}
                  <div className="menu-anchor relative group/notif hidden sm:block">
                    <button
                      onClick={() =>
                        setActiveMenu((prev) =>
                          prev === "notification-menu"
                            ? null
                            : "notification-menu",
                        )
                      }
                      className="relative flex items-center justify-center w-9.5 h-9.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors text-[#475569] shrink-0"
                    >
                      <Bell size={18} />
                      {unreadNotificationCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#f44336] text-[11px] font-bold text-white">
                          {unreadNotificationCount}
                        </span>
                      )}
                    </button>

                    {activeMenu === "notification-menu" && (
                      <div className="absolute top-full right-0 z-[200] mt-2 cursor-default font-inter sm:-right-2">
                        <div className="absolute -top-1.5 right-6 z-30 h-3 w-3 rotate-45 border-l border-t border-gray-200 bg-white"></div>
                        <div className="relative z-20 flex w-[320px] flex-col overflow-hidden rounded-md border border-gray-200 bg-white text-left shadow-[0_8px_30px_rgb(0,0,0,0.12)] sm:w-95">
                          <div className="z-10 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                Notifications
                              </h3>
                              {unreadNotificationCount > 0 && (
                                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">
                                  {unreadNotificationCount}
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
                            {notificationTabs.map((tab) => (
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
                            {visibleNotifications.map((notif) => (
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
                                    onClick={(e) =>
                                      removeNotification(notif.id, e)
                                    }
                                    className="rounded-md p-1 px-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="border-t border-gray-100 bg-gray-50/50 p-3">
                            <button
                              onClick={() => go("notificationSettings")}
                              className="w-full rounded-md py-2 text-center text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
                            >
                              View all activity
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Profile Avatar - Mobile (hidden, moved to bottom tab) */}
                  <div className="menu-anchor hidden sm:hidden relative">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveMenu((prev) =>
                          prev === "mobile-profile-menu"
                            ? null
                            : "mobile-profile-menu",
                        )
                      }
                      className={`relative flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white ring-2 ring-white ${user?.image_url ? "p-0" : "bg-brand-blue"}`}
                      aria-label="Open profile menu"
                    >
                      {user?.image_url ? (
                        <img
                          src={getImageUrl(user.image_url)}
                          alt=""
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <span>{initials}</span>
                      )}
                      <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500"></div>
                    </button>

                    {activeMenu === "mobile-profile-menu" && (
                      <div className="menu-anchor absolute right-0 top-full z-[200] mt-2 w-[280px] cursor-default font-inter">
                        <div className="rounded-[18px] border border-gray-100/80 bg-white p-2.5 text-[14px] font-medium text-gray-600 shadow-[0_8px_30px_rgb(0,0,0,0.08)] select-none">
                          <div className="absolute -top-1.5 right-6 h-3 w-3 rotate-45 border-l border-t border-gray-100/80 bg-white"></div>
                          <div className="relative z-10 flex flex-col rounded-md bg-white">
                            <div
                              onClick={() => go("userDashboard")}
                              className="mb-1 flex cursor-pointer flex-col rounded-md bg-[#f4f4f5] px-3 py-3 transition-all hover:bg-blue-50"
                            >
                              <div className="flex items-center gap-3 text-gray-900">
                                <User size={18} />
                                <span className="font-bold">View Profile</span>
                              </div>
                              <div className="mt-2.5 pl-7.5">
                                <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold text-gray-500">
                                  <span>Profile Completion</span>
                                  <span className="text-[#5468FF]">
                                    {dashboardStats?.profile_completion ?? 0}%
                                  </span>
                                </div>
                                <div className="h-1.5 w-full rounded-full bg-gray-200/80">
                                  <div
                                    className="h-1.5 rounded-full bg-brand-blue"
                                    style={{
                                      width: `${dashboardStats?.profile_completion ?? 0}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => go("myApplications")}
                              className="flex items-center gap-3 rounded-md px-3 py-2.5 font-semibold transition-all hover:bg-blue-50"
                            >
                              <FileText size={18} />
                              <span>My Application</span>
                              {dashboardStats?.applications_submitted ? (
                                <span className="ml-auto rounded-full bg-red-500 px-1.5 py-[1.5px] text-[10px] font-bold leading-none text-white">
                                  {dashboardStats.applications_submitted}
                                </span>
                              ) : null}
                            </button>
                            <button
                              type="button"
                              onClick={() => go("savedColleges")}
                              className="flex items-center gap-3 rounded-md px-3 py-2.5 font-semibold transition-all hover:bg-blue-50"
                            >
                              <Bookmark size={18} />
                              <span>Saved College</span>
                              {dashboardStats?.saved_colleges ? (
                                <span className="ml-auto text-xs font-bold text-gray-400">
                                  {dashboardStats.saved_colleges}
                                </span>
                              ) : null}
                            </button>
                            <button
                              type="button"
                              onClick={() => go("notificationSettings")}
                              className="flex items-center gap-3 rounded-md px-3 py-2.5 font-semibold transition-all hover:bg-blue-50"
                            >
                              <Bell size={18} />
                              <span>Notifications</span>
                              {unreadNotificationCount > 0 && (
                                <span className="ml-auto rounded-full bg-red-500 px-1.5 py-[1.5px] text-[10px] font-bold leading-none text-white">
                                  {unreadNotificationCount}
                                </span>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => go("userSettings")}
                              className="flex items-center gap-3 rounded-md px-3 py-2.5 font-semibold transition-all hover:bg-blue-50"
                            >
                              <Settings size={18} />
                              <span>Settings</span>
                            </button>
                            <div className="my-1.5 h-px bg-gray-100 mx-2"></div>
                            <button
                              type="button"
                              onClick={() => go("contact")}
                              className="flex items-center gap-3 rounded-md px-3 py-2.5 font-semibold transition-all hover:bg-blue-50"
                            >
                              <MessageCircleQuestion size={18} />
                              <span>Help Center</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onLogout?.();
                                setActiveMenu(null);
                              }}
                              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left font-semibold text-red-500 transition-all hover:bg-red-50"
                            >
                              <LogOut size={18} className="scale-x-[-1]" />
                              <span>Log Out</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Write a Review - Desktop */}
                  <button
                    onClick={() => go("writeReview")}
                    className="hidden md:flex items-center gap-2 bg-brand-blue hover:bg-brand-hover text-white px-4 py-2.5 rounded-md text-[14px] font-semibold transition-colors shrink-0"
                  >
                    <i className="fa-solid fa-pen-to-square text-sm"></i>
                    <span>Write a Review</span>
                  </button>

                  {/* Desktop Profile */}
                  <div className="hidden lg:block w-px h-8 bg-gray-200 mx-2"></div>
                  <div className="hidden lg:flex items-center gap-3 cursor-pointer group relative py-1">
                    <button
                      onClick={() =>
                        setActiveMenu((prev) =>
                          prev === "profile-menu" ? null : "profile-menu",
                        )
                      }
                      className="flex items-center gap-3"
                    >
                      <div className="relative">
                        {user.image_url ? (
                          <img
                            src={getImageUrl(user.image_url)}
                            alt=""
                            className="h-9 w-9 rounded-full object-cover ring-2 ring-white"
                          />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue text-white font-bold text-sm ring-2 ring-white">
                            <span>{initials}</span>
                          </div>
                        )}
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div className="flex flex-col text-left">
                        <div className="flex items-center gap-1">
                          <span className="text-[14px] font-bold text-gray-800 leading-tight group-hover:text-primary transition-colors">
                            {user.first_name} {user.last_name}
                          </span>
                          {dashboardStats?.profile_completion === 100 && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="#0000FF"
                            >
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
                              <path d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
                            </svg>
                          )}
                        </div>
                        <span className="text-[12px] text-gray-500 leading-tight font-semibold mt-0.5">
                          {profileLabel}
                        </span>
                      </div>
                      <ChevronDown
                        size={14}
                        className="text-gray-400 group-hover:text-primary transition-colors ml-1"
                      />
                    </button>

                    {activeMenu === "profile-menu" && (
                      <div className="menu-anchor absolute top-full right-0 z-[200] cursor-default pt-3 font-inter">
                        <div className="w-67.5 bg-white rounded-[18px] border border-gray-100/80 p-2.5 text-[14px] text-gray-600 font-medium select-none shadow-[0_8px_30px_rgb(0,0,0,0.08)] relative">
                          <div className="absolute -top-1.5 right-6 w-3 h-3 bg-white border-t border-l border-gray-100/80 transform rotate-45"></div>
                          <div className="flex flex-col relative z-10 bg-white rounded-md">
                            <div
                              onClick={() => go("userDashboard")}
                              className="flex flex-col px-3 py-3 bg-[#f4f4f5] rounded-md cursor-pointer mb-1 hover:bg-blue-50 transition-all"
                            >
                              <div className="flex items-center gap-3 text-gray-900">
                                <User size={18} />
                                <span className="font-bold">View Profile</span>
                              </div>
                              <div className="mt-2.5 pl-7.5">
                                <div className="flex justify-between items-center text-[11px] font-semibold text-gray-500 mb-1.5">
                                  <span>Profile Completion</span>
                                  <span className="text-[#5468FF]">
                                    {dashboardStats?.profile_completion ?? 0}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200/80 rounded-full h-1.5">
                                  <div
                                    className="bg-brand-blue h-1.5 rounded-full"
                                    style={{
                                      width: `${dashboardStats?.profile_completion ?? 0}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => go("myApplications")}
                              className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 rounded-md transition-all font-semibold"
                            >
                              <FileText size={18} />
                              <span>My Application</span>
                              {dashboardStats?.applications_submitted ? (
                                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-[1.5px] rounded-full leading-none">
                                  {dashboardStats.applications_submitted}
                                </span>
                              ) : null}
                            </button>
                            <button
                              onClick={() => go("savedColleges")}
                              className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 rounded-md transition-all font-semibold"
                            >
                              <Bookmark size={18} />
                              <span>Saved College</span>
                              {dashboardStats?.saved_colleges ? (
                                <span className="ml-auto text-gray-400 text-xs font-bold">
                                  {dashboardStats.saved_colleges}
                                </span>
                              ) : null}
                            </button>
                            <button
                              onClick={() => go("notificationSettings")}
                              className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 rounded-md transition-all font-semibold"
                            >
                              <Bell size={18} />
                              <span>Notifications</span>
                              {unreadNotificationCount > 0 && (
                                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-[1.5px] rounded-full leading-none">
                                  {unreadNotificationCount}
                                </span>
                              )}
                            </button>
                            <button
                              onClick={() => go("userSettings")}
                              className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 rounded-md transition-all font-semibold"
                            >
                              <Settings size={18} />
                              <span>Settings</span>
                            </button>
                            <div className="h-px bg-gray-100 my-1.5 mx-2"></div>
                            <button
                              onClick={() => go("contact")}
                              className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 rounded-md transition-all font-semibold"
                            >
                              <MessageCircleQuestion size={18} />
                              <span>Help Center</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onLogout?.();
                              }}
                              className="flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 text-red-500 rounded-md transition-all w-full text-left"
                            >
                              <LogOut size={18} className="scale-x-[-1]" />
                              <span>Log Out</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Nav Links Row - Desktop */}
        <div className="relative hidden w-full border-b border-gray-200 px-3 xs:px-4 sm:px-6 lg:px-8 md:block font-semibold">
          <div className="mx-auto flex h-11 sm:h-11.5 w-full max-w-350 items-center gap-3 sm:gap-4 overflow-visible">
            <nav className="no-scrollbar relative flex h-full min-w-0 flex-1 items-center gap-x-4 sm:gap-x-5 md:gap-x-6 lg:gap-x-7 xl:gap-x-8 overflow-visible whitespace-nowrap pr-2 text-[13px] sm:text-[14px] lg:text-[15px] font-semibold text-[#212529]">
              <NavItem
                onClick={() => go("findCollege")}
                isActive={isViewActive("findCollege")}
              >
                Find College
              </NavItem>

              {toolsSection && (
                <DesktopDropdown
                  key={toolsSection.key}
                  label={toolsSection.label}
                  alignRight={toolsSection.alignRight}
                  isOpen={activeMenu === toolsSection.key}
                  isActive={isSectionActive(toolsSection)}
                  onToggle={() =>
                    setActiveMenu((prev) =>
                      prev === toolsSection.key ? null : toolsSection.key,
                    )
                  }
                  onMouseEnter={() =>
                    handleDropdownMouseEnter(toolsSection.key)
                  }
                  onMouseLeave={handleDropdownMouseLeave}
                >
                  {toolsSection.items.map((item) => (
                    <DropdownCard
                      key={item.title}
                      icon={item.icon}
                      color={item.color}
                      title={item.title}
                      desc={item.desc}
                      onClick={getDropdownClick(item)}
                    />
                  ))}
                </DesktopDropdown>
              )}

              {scholarshipsSection && (
                <DesktopDropdown
                  key={scholarshipsSection.key}
                  label={scholarshipsSection.label}
                  alignRight={scholarshipsSection.alignRight}
                  isOpen={activeMenu === scholarshipsSection.key}
                  isActive={isSectionActive(scholarshipsSection)}
                  onToggle={() =>
                    setActiveMenu((prev) =>
                      prev === scholarshipsSection.key
                        ? null
                        : scholarshipsSection.key,
                    )
                  }
                  onMouseEnter={() =>
                    handleDropdownMouseEnter(scholarshipsSection.key)
                  }
                  onMouseLeave={handleDropdownMouseLeave}
                >
                  {scholarshipsSection.items.map((item) => (
                    <DropdownCard
                      key={item.title}
                      icon={item.icon}
                      color={item.color}
                      title={item.title}
                      desc={item.desc}
                      onClick={getDropdownClick(item)}
                      iconElement={
                        item.lucideIcon === "FileSpreadsheet" ? (
                          <FileSpreadsheet className="text-base sm:text-lg" />
                        ) : undefined
                      }
                    />
                  ))}
                </DesktopDropdown>
              )}

              <NavItem
                onClick={() => go("campusForum")}
                isActive={isViewActive("campusForum")}
              >
                Campus Feed
              </NavItem>

              {admissionSection && (
                <DesktopDropdown
                  key={admissionSection.key}
                  label={admissionSection.label}
                  alignRight={admissionSection.alignRight}
                  isOpen={activeMenu === admissionSection.key}
                  isActive={isSectionActive(admissionSection)}
                  onToggle={() =>
                    setActiveMenu((prev) =>
                      prev === admissionSection.key
                        ? null
                        : admissionSection.key,
                    )
                  }
                  onMouseEnter={() =>
                    handleDropdownMouseEnter(admissionSection.key)
                  }
                  onMouseLeave={handleDropdownMouseLeave}
                >
                  {admissionSection.items.map((item) => (
                    <DropdownCard
                      key={item.title}
                      icon={item.icon}
                      color={item.color}
                      title={item.title}
                      desc={item.desc}
                      onClick={getDropdownClick(item)}
                    />
                  ))}
                </DesktopDropdown>
              )}

              {universitiesSection && (
                <DesktopDropdown
                  key={universitiesSection.key}
                  label={universitiesSection.label}
                  alignRight={universitiesSection.alignRight}
                  isOpen={activeMenu === universitiesSection.key}
                  isActive={isSectionActive(universitiesSection)}
                  onToggle={() =>
                    setActiveMenu((prev) =>
                      prev === universitiesSection.key
                        ? null
                        : universitiesSection.key,
                    )
                  }
                  onMouseEnter={() =>
                    handleDropdownMouseEnter(universitiesSection.key)
                  }
                  onMouseLeave={handleDropdownMouseLeave}
                >
                  {universitiesSection.items.map((item) => (
                    <DropdownCard
                      key={item.title}
                      icon={item.icon}
                      color={item.color}
                      title={item.title}
                      desc={item.desc}
                      onClick={getDropdownClick(item)}
                    />
                  ))}
                </DesktopDropdown>
              )}

              <NavItem
                onClick={() => go("entranceDiscovery")}
                isActive={isViewActive("entranceDiscovery")}
              >
                Entrance
              </NavItem>

              {moreSection && (
                <DesktopDropdown
                  key={moreSection.key}
                  label={moreSection.label}
                  alignRight={moreSection.alignRight}
                  isOpen={activeMenu === moreSection.key}
                  isActive={isSectionActive(moreSection)}
                  onToggle={() =>
                    setActiveMenu((prev) =>
                      prev === moreSection.key ? null : moreSection.key,
                    )
                  }
                  onMouseEnter={() => handleDropdownMouseEnter(moreSection.key)}
                  onMouseLeave={handleDropdownMouseLeave}
                >
                  {moreSection.items.map((item) => (
                    <DropdownCard
                      key={item.title}
                      icon={item.icon}
                      color={item.color}
                      title={item.title}
                      desc={item.desc}
                      onClick={getDropdownClick(item)}
                    />
                  ))}
                </DesktopDropdown>
              )}
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
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 z-[140] md:hidden transition-opacity duration-300 ${
          isMobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isMobileOpen}
      >
        <button
          type="button"
          aria-label="Close mobile menu"
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
        <aside
          className={`absolute top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl md:hidden transform transition-transform duration-300 ease-in-out ${
            isMobileOpen
              ? "translate-x-0"
              : "translate-x-full"
          } right-0`}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <h2 className="text-lg font-bold text-gray-900">
                {user ? "Menu" : "Explore"}
              </h2>
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-gray-100"
                aria-label="Close menu"
              >
                <X size={18} className="text-gray-600" />
              </button>
            </div>

            <div className="no-scrollbar flex-1 overflow-y-auto p-4">
              {user && (
                <div className="mb-5 rounded-md border border-gray-200 bg-gray-50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {user.image_url ? (
                        <img
                          src={getImageUrl(user.image_url)}
                          alt=""
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue text-sm font-bold text-white">
                          <span>{initials}</span>
                        </div>
                      )}
                      <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500"></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[15px] font-bold text-gray-800">
                        {user.first_name} {user.last_name}
                      </span>
                      <span className="text-[13px] font-semibold text-gray-500">
                        {profileLabel}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1 text-[15px] font-semibold text-gray-700">
                <button
                  type="button"
                  onClick={() => go("findCollege")}
                  className="flex w-full items-center justify-between rounded-md p-2 text-left transition-colors hover:bg-gray-50 hover:text-blue-600"
                >
                  <span>Find College</span>
                </button>

                {mobileToolsSection && (
                  <div>
                    <button
                      type="button"
                      className={`flex w-full items-center justify-between rounded-md p-2 text-left transition-colors hover:bg-gray-50 hover:text-blue-600 ${mobileMenus[mobileToolsSection.key] ? "text-blue-600" : ""}`}
                      onClick={() => toggleMobileMenu(mobileToolsSection.key)}
                    >
                      <span>{mobileToolsSection.label}</span>
                      <ChevronDown
                        size={14}
                        className={`text-gray-400 transition-transform duration-200 ${mobileMenus[mobileToolsSection.key] ? "rotate-180" : ""}`}
                      />
                    </button>
                    <div
                      className={`${mobileMenus[mobileToolsSection.key] ? "flex" : "hidden"} ml-2 mt-1 flex-col gap-1 pl-4 py-2 font-medium`}
                    >
                      {mobileToolsSection.items.map(renderMobileAction)}
                    </div>
                  </div>
                )}

                {mobileScholarshipsSection && (
                  <div>
                    <button
                      type="button"
                      className={`flex w-full items-center justify-between rounded-md p-2 text-left transition-colors hover:bg-gray-50 hover:text-blue-600 ${mobileMenus[mobileScholarshipsSection.key] ? "text-blue-600" : ""}`}
                      onClick={() =>
                        toggleMobileMenu(mobileScholarshipsSection.key)
                      }
                    >
                      <span>{mobileScholarshipsSection.label}</span>
                      <ChevronDown
                        size={14}
                        className={`text-gray-400 transition-transform duration-200 ${mobileMenus[mobileScholarshipsSection.key] ? "rotate-180" : ""}`}
                      />
                    </button>
                    <div
                      className={`${mobileMenus[mobileScholarshipsSection.key] ? "flex" : "hidden"} ml-2 mt-1 flex-col gap-1 pl-4 py-2 font-medium`}
                    >
                      {mobileScholarshipsSection.items.map(renderMobileAction)}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => go("campusForum")}
                  className="flex w-full items-center justify-between rounded-md p-2 text-left transition-colors hover:bg-gray-50 hover:text-blue-600"
                >
                  <span>Campus Feed</span>
                  <span className="rounded bg-blue-600 px-1.5 py-1 text-[10px] font-bold leading-none tracking-wide text-white">
                    NEW
                  </span>
                </button>

                {mobileAdmissionSection && (
                  <div>
                    <button
                      type="button"
                      className={`flex w-full items-center justify-between rounded-md p-2 text-left transition-colors hover:bg-gray-50 hover:text-blue-600 ${mobileMenus[mobileAdmissionSection.key] ? "text-blue-600" : ""}`}
                      onClick={() =>
                        toggleMobileMenu(mobileAdmissionSection.key)
                      }
                    >
                      <span>{mobileAdmissionSection.label}</span>
                      <ChevronDown
                        size={14}
                        className={`text-gray-400 transition-transform duration-200 ${mobileMenus[mobileAdmissionSection.key] ? "rotate-180" : ""}`}
                      />
                    </button>
                    <div
                      className={`${mobileMenus[mobileAdmissionSection.key] ? "flex" : "hidden"} ml-2 mt-1 flex-col gap-1 pl-4 py-2 font-medium`}
                    >
                      {mobileAdmissionSection.items.map(renderMobileAction)}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => go("entranceDiscovery")}
                  className="flex w-full items-center justify-between rounded-md p-2 text-left transition-colors hover:bg-gray-50 hover:text-blue-600"
                >
                  <span>Entrance</span>
                </button>

                {mobileUniversitiesSection && (
                  <div>
                    <button
                      type="button"
                      className={`flex w-full items-center justify-between rounded-md p-2 text-left transition-colors hover:bg-gray-50 hover:text-blue-600 ${mobileMenus[mobileUniversitiesSection.key] ? "text-blue-600" : ""}`}
                      onClick={() =>
                        toggleMobileMenu(mobileUniversitiesSection.key)
                      }
                    >
                      <span>{mobileUniversitiesSection.label}</span>
                      <ChevronDown
                        size={14}
                        className={`text-gray-400 transition-transform duration-200 ${mobileMenus[mobileUniversitiesSection.key] ? "rotate-180" : ""}`}
                      />
                    </button>
                    <div
                      className={`${mobileMenus[mobileUniversitiesSection.key] ? "flex" : "hidden"} ml-2 mt-1 flex-col gap-1 pl-4 py-2 font-medium`}
                    >
                      {mobileUniversitiesSection.items.map(renderMobileAction)}
                    </div>
                  </div>
                )}

                {mobileMoreSection && (
                  <div>
                    <button
                      type="button"
                      className={`flex w-full items-center justify-between rounded-md p-2 text-left transition-colors hover:bg-gray-50 hover:text-blue-600 ${mobileMenus[mobileMoreSection.key] ? "text-blue-600" : ""}`}
                      onClick={() => toggleMobileMenu(mobileMoreSection.key)}
                    >
                      <span>{mobileMoreSection.label}</span>
                      <ChevronDown
                        size={14}
                        className={`text-gray-400 transition-transform duration-200 ${mobileMenus[mobileMoreSection.key] ? "rotate-180" : ""}`}
                      />
                    </button>
                    <div
                      className={`${mobileMenus[mobileMoreSection.key] ? "flex" : "hidden"} ml-2 mt-1 flex-col gap-1 pl-4 py-2 font-medium`}
                    >
                      {mobileMoreSection.items.map(renderMobileAction)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {user && (
              <div className="border-t border-gray-200 p-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLogout?.();
                    setIsMobileOpen(false);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-red-50 px-4 py-3 font-semibold text-red-600 transition-colors hover:bg-red-100"
                >
                  <LogOut size={18} className="scale-x-[-1]" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Mobile Bottom Tab Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-[150] bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.06)] md:hidden">
        <nav className="flex items-center justify-around h-16 pb-safe">
          <button
            onClick={() => {
              router.push("/");
              setIsMobileOpen(false);
            }}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
              isRouteActive("/") ? "text-brand-blue" : "text-gray-500"
            }`}
          >
            <Home size={20} />
            <span className="text-[10px] font-medium">Home</span>
          </button>

          <button
            onClick={() => {
              router.push("/campus-forum");
              setIsMobileOpen(false);
            }}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
              isRouteActive("/campus-forum") ? "text-brand-blue" : "text-gray-500"
            }`}
          >
            <MessageSquare size={20} />
            <span className="text-[10px] font-medium">Feed</span>
          </button>

          <button
            onClick={() => {
              router.push("/sphere-ai");
              setIsMobileOpen(false);
            }}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
              isRouteActive("/sphere-ai") ? "text-brand-blue" : "text-gray-500"
            }`}
          >
            <Sparkles size={20} />
            <span className="text-[10px] font-medium">Sphere AI</span>
          </button>

          {user ? (
            <>
              <button
                onClick={() => {
                  setActiveMenu((prev) =>
                    prev === "notification-menu"
                      ? null
                      : "notification-menu",
                  );
                }}
                className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors relative text-gray-500"
              >
                <div className="relative">
                  <Bell size={20} />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#f44336] text-[9px] font-bold text-white">
                      {unreadNotificationCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium">Alerts</span>
              </button>

              <button
                onClick={() => {
                  go("userDashboard");
                  setIsMobileOpen(false);
                }}
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                  isRouteActive("/dashboard") ? "text-brand-blue" : "text-gray-500"
                }`}
              >
                {user.image_url ? (
                  <img
                    src={getImageUrl(user.image_url)}
                    alt=""
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-brand-blue"
                  />
                ) : (
                  <CircleUser size={24} />
                )}
                <span className="text-[10px] font-medium">Profile</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                router.push("/login");
                setIsMobileOpen(false);
              }}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                isRouteActive("/login") ? "text-brand-blue" : "text-gray-500"
              }`}
            >
              <CircleUser size={24} />
              <span className="text-[10px] font-medium">Login</span>
            </button>
          )}
        </nav>
      </div>

      {/* Mobile Bottom Notification Dropdown */}
      {user && activeMenu === "notification-menu" && (
        <div className="fixed bottom-16 left-2 right-2 z-[160] md:hidden">
          <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white text-left shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-h-[60vh]">
            <div className="z-10 flex items-center justify-between border-b border-gray-100 bg-white px-3 py-2.5">
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-semibold text-gray-900">
                  Notifications
                </h3>
                {unreadNotificationCount > 0 && (
                  <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">
                    {unreadNotificationCount}
                  </span>
                )}
              </div>
              <button
                onClick={markAllAsRead}
                className="rounded-md px-2 py-1 text-[11px] font-medium text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-900"
              >
                Mark all as read
              </button>
            </div>
            <div className="no-scrollbar flex gap-3 overflow-x-auto whitespace-nowrap border-b border-gray-50 bg-gray-50/50 px-3 py-2 text-[12px]">
              {notificationTabs.map((tab) => (
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
            <div className="no-scrollbar flex flex-col overflow-y-auto">
              {visibleNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  <Bell size={28} className="mb-2 opacity-50" />
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                visibleNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="group relative flex cursor-pointer items-start gap-2.5 border-b border-gray-50 bg-white p-3 transition-colors hover:bg-gray-50"
                    onClick={() => markAsRead(notif.id)}
                  >
                    <div
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${notif.bgColor} ${notif.color}`}
                    >
                      <i className="fa-solid fa-bell text-[12px]"></i>
                    </div>
                    <div className="min-w-0 flex-1 pr-6">
                      <div className="mb-0.5 flex flex-wrap items-center gap-2">
                        <p className="truncate text-[13px] font-semibold text-black">
                          {notif.title}
                        </p>
                        {notif.isFollowing && (
                          <span className="whitespace-nowrap rounded bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-blue-600">
                            Following
                          </span>
                        )}
                      </div>
                      <p className="line-clamp-2 text-[12px] leading-relaxed text-gray-800">
                        {notif.message}
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-gray-500">
                        <Clock size={11} /> {notif.time}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <div className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-blue-500"></div>
                    )}
                  </div>
                ))
              )}
            </div>
            <div className="border-t border-gray-100 bg-gray-50/50 p-2">
              <button
                onClick={() => {
                  go("notificationSettings");
                  setIsMobileOpen(false);
                }}
                className="w-full rounded-md py-2 text-center text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
              >
                View all activity
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EducationNavbar;
