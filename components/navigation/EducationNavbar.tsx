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
  const pathname = usePathname();

  const [mobileMenus, setMobileMenus] = useState<Record<string, boolean>>({});
  const drawerDirection = user ? "right" : "left";
  const mobileSearchSuggestions = trendingSearches.slice(0, 4);
  const [mobileLiveSuggestions, setMobileLiveSuggestions] = useState(
    mobileSearchSuggestions,
  );

  const toggleMobileMenu = (key: string) => {
    setMobileMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleMobileDrawer = () => {
    setShowMobileSearch(false);
    setActiveMenu(null);
    setIsMobileOpen((prev) => !prev);
  };

  const toggleMobileSearch = () => {
    setIsMobileOpen(false);
    setActiveMenu(null);
    setMobileLiveSuggestions(mobileSearchSuggestions);
    setShowMobileSearch((prev) => !prev);
  };

  const handleMobileSearchStateChange = (
    query: string,
    suggestions: typeof mobileSearchSuggestions,
  ) => {
    setMobileLiveSuggestions(
      query.trim() === "" ? mobileSearchSuggestions : suggestions,
    );
  };

  const [currentNotifTab, setCurrentNotifTab] =
    useState<NotificationTab>("all");
  const [notifications, setNotifications] = useState(initialNotifications);

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

  useEffect(() => {
    const handleOpenAuthModal = () => {
      router.push("/login");
    };

    window.addEventListener("studsphere:open-auth-modal", handleOpenAuthModal);
    return () =>
      window.removeEventListener("studsphere:open-auth-modal", handleOpenAuthModal);
  }, [router]);

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

  const go = (viewKey: ViewKey, data?: { level?: string }) => {
    if (viewKey === "login") {
      router.push("/login");
      setIsMobileOpen(false);
      setActiveMenu(null);
      setMobileLiveSuggestions(mobileSearchSuggestions);
      setShowMobileSearch(false);
      return;
    }
    if (viewKey === "signup") {
      router.push("/register");
      setIsMobileOpen(false);
      setActiveMenu(null);
      setMobileLiveSuggestions(mobileSearchSuggestions);
      setShowMobileSearch(false);
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
    setShowMobileSearch(false);
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
        <div className="w-full px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-350 items-center justify-between gap-2 sm:gap-4 py-2.5 sm:py-3">
            {!user ? (
              <>
                {/* Not Logged In: Hamburger Left, Logo Center, Search + Login/Register Right */}
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-100 md:hidden shrink-0 z-10"
                  onClick={toggleMobileDrawer}
                  aria-label="Toggle menu"
                >
                  {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                <Link
                  href="/"
                  className="flex flex-1 shrink-0 cursor-pointer items-center justify-center min-w-0 md:flex-none md:justify-start"
                >
                  <Image
                    src="/studsphere.png"
                    alt="Studsphere Logo"
                    width={4702}
                    height={1320}
                    priority
                    className="h-7 sm:h-9 w-auto max-w-55 sm:max-w-67.5 object-contain origin-center scale-115 sm:scale-125"
                  />
                </Link>

                <div className="hidden md:block flex-1 max-w-3xl mx-4">
                  <SearchBar />
                </div>

                <div className="flex items-center shrink-0 z-10">
                  {/* Mobile Search Button */}
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-100 sm:hidden"
                    onClick={toggleMobileSearch}
                    aria-label="Toggle mobile search"
                  >
                    <Search size={18} />
                  </button>
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
              </>
            ) : (
              <>
                {/* Logged In: Logo Left, Search Center, Hamburger Right */}
                <Link
                  href="/"
                  className="flex shrink-0 cursor-pointer items-center min-w-0"
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

                <div className="block flex-1 max-w-3xl mx-4">
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
                            <button className="w-full rounded-md py-2 text-center text-sm font-medium text-gray-600 transition-colors hover:text-blue-600">
                              View all activity
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Notification Bell - Mobile */}
                  <button
                    className="md:hidden flex h-9.5 w-9.5 items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600 shrink-0 relative"
                    onClick={() => {
                      setActiveMenu((prev) =>
                        prev === "notification-menu"
                          ? null
                          : "notification-menu",
                      );
                    }}
                    aria-label="Toggle notifications"
                  >
                    <Bell size={18} />
                    {unreadNotificationCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#f44336] text-[11px] font-bold text-white">
                        {unreadNotificationCount}
                      </span>
                    )}
                  </button>

                  {/* Mobile Notification Dropdown */}
                  {activeMenu === "notification-menu" && (
                    <div className="md:hidden absolute right-2 top-full z-[200] mt-2 sm:right-3">
                      <div className="flex w-[280px] flex-col overflow-hidden rounded-md border border-gray-200 bg-white text-left shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                        <div className="z-10 flex items-center justify-between border-b border-gray-100 bg-white px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <h3 className="text-[15px] font-semibold text-gray-900">Notifications</h3>
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
                        <div className="no-scrollbar flex max-h-64 flex-col overflow-y-auto">
                          {visibleNotifications.map((notif) => (
                            <div
                              key={notif.id}
                              className="group relative flex cursor-pointer items-start gap-2.5 border-b border-gray-50 bg-white p-2.5 transition-colors hover:bg-gray-50"
                              onClick={() => markAsRead(notif.id)}
                            >
                              <div
                                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${notif.bgColor} ${notif.color}`}
                              >
                                <i className="fa-solid fa-bell text-[12px]"></i>
                              </div>
                              <div className="min-w-0 flex-1 pr-8">
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
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Profile Avatar - Mobile */}
                  <div className="menu-anchor sm:hidden relative">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveMenu((prev) =>
                          prev === "mobile-profile-menu" ? null : "mobile-profile-menu",
                        )
                      }
                      className="relative flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue text-sm font-bold text-white ring-2 ring-white"
                      aria-label="Open profile menu"
                    >
                      <span>{initials}</span>
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
                                  <span className="text-[#5468FF]">80%</span>
                                </div>
                                <div className="h-1.5 w-full rounded-full bg-gray-200/80">
                                  <div className="h-1.5 w-[80%] rounded-full bg-brand-blue"></div>
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => go("userDashboard")}
                              className="flex items-center gap-3 rounded-md px-3 py-2.5 font-semibold transition-all hover:bg-blue-50"
                            >
                              <FileText size={18} />
                              <span>My Application</span>
                              <span className="ml-auto rounded-full bg-red-500 px-1.5 py-[1.5px] text-[10px] font-bold leading-none text-white">2</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => go("userDashboard")}
                              className="flex items-center gap-3 rounded-md px-3 py-2.5 font-semibold transition-all hover:bg-blue-50"
                            >
                              <Bookmark size={18} />
                              <span>Saved College</span>
                              <span className="ml-auto text-xs font-bold text-gray-400">12</span>
                            </button>
                            <button
                              type="button"
                              className="flex items-center gap-3 rounded-md px-3 py-2.5 font-semibold transition-all hover:bg-blue-50"
                            >
                              <Bell size={18} />
                              <span>Notifications</span>
                              <span className="ml-auto rounded-full bg-red-500 px-1.5 py-[1.5px] text-[10px] font-bold leading-none text-white">2</span>
                            </button>
                            <button
                              type="button"
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
                    className="hidden lg:flex items-center gap-2 bg-brand-blue hover:bg-brand-hover text-white px-4 py-2.5 rounded-md text-[14px] font-semibold transition-colors shrink-0"
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
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue text-white font-bold text-sm ring-2 ring-white">
                          <span>{initials}</span>
                        </div>
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div className="flex flex-col text-left">
                        <div className="flex items-center gap-1">
                          <span className="text-[14px] font-bold text-gray-800 leading-tight group-hover:text-primary transition-colors">
                            {user.first_name} {user.last_name}
                          </span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="#0000FF"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
                          </svg>
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
                                  <span className="text-[#5468FF]">80%</span>
                                </div>
                                <div className="w-full bg-gray-200/80 rounded-full h-1.5">
                                  <div className="bg-brand-blue h-1.5 rounded-full w-[80%]"></div>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => go("userDashboard")}
                              className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 rounded-md transition-all font-semibold"
                            >
                              <FileText size={18} />
                              <span>My Application</span>
                              <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-[1.5px] rounded-full leading-none">2</span>
                            </button>
                            <button
                              onClick={() => go("userDashboard")}
                              className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 rounded-md transition-all font-semibold"
                            >
                              <Bookmark size={18} />
                              <span>Saved College</span>
                              <span className="ml-auto text-gray-400 text-xs font-bold">12</span>
                            </button>
                            <button
                              className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 rounded-md transition-all font-semibold"
                            >
                              <Bell size={18} />
                              <span>Notifications</span>
                              <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-[1.5px] rounded-full leading-none">2</span>
                            </button>
                            <button
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
                >
                  {scholarshipsSection.items.map((item) => (
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
          isMobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
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
              : drawerDirection === "left"
                ? "-translate-x-full"
                : "translate-x-full"
          } ${drawerDirection === "left" ? "left-0" : "right-0"}`}
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
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue text-sm font-bold text-white">
                        <span>{initials}</span>
                      </div>
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
                      onClick={() => toggleMobileMenu(mobileScholarshipsSection.key)}
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
                      onClick={() => toggleMobileMenu(mobileAdmissionSection.key)}
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

                {user && (
                  <div>
                    <button
                      type="button"
                      className={`flex w-full items-center justify-between rounded-md p-2 text-left transition-colors hover:bg-gray-50 hover:text-blue-600 ${mobileMenus.partners ? "text-blue-600" : ""}`}
                      onClick={() => toggleMobileMenu("partners")}
                    >
                      <span>Partner Modules</span>
                      <ChevronDown
                        size={14}
                        className={`text-gray-400 transition-transform duration-200 ${mobileMenus.partners ? "rotate-180" : ""}`}
                      />
                    </button>
                    <div
                      className={`${mobileMenus.partners ? "flex" : "hidden"} ml-2 mt-1 flex-col gap-1 pl-4 py-2 font-medium`}
                    >
                      {partnerMobileItems.map(renderMobileAction)}
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

      {/* Mobile Search Overlay */}
      <div
        className={`fixed inset-0 z-[150] md:hidden transition-opacity duration-300 ${
          showMobileSearch
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!showMobileSearch}
      >
        <div className="absolute inset-0 bg-white">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Find colleges and courses
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowMobileSearch(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                aria-label="Close search panel"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
              <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
                <SearchBar
                  isMobile
                  defaultSearchOpen
                  showSuggestionDropdown={false}
                  onQueryStateChange={handleMobileSearchStateChange}
                />
                <div className="rounded-2xl bg-white p-0">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                    Suggestions
                  </p>
                  {mobileLiveSuggestions.length > 0 ? (
                    <div className="mt-3 grid gap-2">
                      {mobileLiveSuggestions.map((item) => (
                        <button
                          key={item.title}
                          type="button"
                          onClick={() => {
                            const storedLocation =
                              typeof window !== "undefined"
                                ? window.sessionStorage.getItem("navLocation")
                                : null;
                            const locationQuery =
                              storedLocation || "Detect Location";
                            setShowMobileSearch(false);
                            router.push(
                              `/search?q=${encodeURIComponent(item.title)}&loc=${encodeURIComponent(locationQuery)}`,
                            );
                          }}
                          className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-left transition-colors hover:bg-blue-50/60"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-900">
                              {item.title}
                            </p>
                          </div>
                          <Search size={16} className="shrink-0 text-gray-400" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-3 rounded-xl bg-white px-4 py-5 text-sm text-gray-500">
                      No matches found. Try a different keyword.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default EducationNavbar;
