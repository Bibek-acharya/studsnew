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
  User,
  FileText,
  Bookmark,
  Sparkles,
  Settings,
  LogOut,
  MessageCircleQuestion,
  Award,
  Building,
  Search,
  ChevronDown,
  X,
  Menu,
} from "lucide-react";
import {
  desktopMenuSections,
  initialNotifications,
  mobileMenuSections,
  mobileQuickLinks,
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

  const [currentNotifTab, setCurrentNotifTab] = useState<NotificationTab>("all");
  const [notifications, setNotifications] = useState(initialNotifications);

  const visibleNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (currentNotifTab === "all") return !n.isArchived;
      if (currentNotifTab === "following") return !n.isArchived && n.isFollowing;
      if (currentNotifTab === "system") return !n.isArchived && n.type === "system";
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

  const renderMobileAction = (item: MobileMenuItem) => {
    const isDisabled = Boolean(item.disabled || !item.viewKey);

    return (
      <button
        key={item.label}
        onClick={
          isDisabled ? undefined : () => go(item.viewKey as ViewKey, item.data)
        }
        disabled={isDisabled}
        className={`flex items-center gap-3 rounded-lg p-2 text-[14px] transition-colors ${
          isDisabled
            ? "cursor-not-allowed text-gray-400"
            : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
        }`}
      >
        {item.icon && <i className={`fa-solid ${item.icon} w-4 text-center ${item.color ?? "text-gray-400"}`}></i>}
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
                      prev === "notification-menu" ? null : "notification-menu",
                    )
                  }
                  className="relative flex items-center justify-center w-9.5 h-9.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors text-[#475569] shrink-0"
                >
                  <Bell size={18} />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#f44336] text-[11px] font-bold text-white shadow-sm">
                      {unreadNotificationCount}
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
                          {unreadNotificationCount > 0 && (
                            <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white shadow-sm">
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
                    <button
                      onClick={() => go("login")}
                      className="border-r border-gray-200 bg-gray-100 px-3 py-2 text-[#334155] transition-colors hover:bg-gray-200"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => go("signup")}
                      className="bg-brand-blue px-3 py-2 text-white transition-colors hover:bg-brand-hover"
                    >
                      Register
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        setActiveMenu((prev) =>
                          prev === "profile-menu" ? null : "profile-menu",
                        )
                      }
                      className="flex items-center gap-3"
                    >
                      <div className="relative">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue text-white font-bold text-sm shadow-sm ring-2 ring-white">
                          <span>{initials}</span>
                        </div>
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div className="hidden lg:flex flex-col text-left">
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
                        className="text-gray-400 group-hover:text-primary transition-colors ml-1 hidden lg:block"
                      />
                    </button>

                    {activeMenu === "profile-menu" && (
                      <div className="absolute top-full right-0 pt-3 z-200 cursor-default font-inter">
                        <div className="w-67.5 bg-white rounded-[18px] border border-gray-100/80 p-2.5 text-[14px] text-gray-600 font-medium select-none shadow-[0_8px_30px_rgb(0,0,0,0.08)] relative">
                          <div className="absolute -top-1.5 right-6 w-3 h-3 bg-white border-t border-l border-gray-100/80 transform rotate-45"></div>
                          <div className="flex flex-col relative z-10 bg-white rounded-xl">
                            <div
                              onClick={() => go("studentDashboard")}
                              className="flex flex-col px-3 py-3 bg-[#f4f4f5] rounded-xl cursor-pointer mb-1 hover:bg-gray-100 transition-all"
                            >
                              <div className="flex items-center gap-3 text-gray-900">
                                <User size={18} />
                                <span className="font-semibold">
                                  View Profile
                                </span>
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
                              onClick={() => go("studentDashboard")}
                              className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-xl transition-all"
                            >
                              <FileText size={18} />
                              <span>My Application</span>
                            </button>
                            <button
                              onClick={() => go("studentDashboard")}
                              className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-xl transition-all"
                            >
                              <Bookmark size={18} />
                              <span>Saved College</span>
                              <span className="ml-auto text-gray-400 text-xs font-semibold">
                                12
                              </span>
                            </button>
                            <div className="h-px bg-gray-100 my-1.5 mx-2"></div>
                            <button
                              onClick={onLogout}
                              className="flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 text-red-500 rounded-xl transition-all"
                            >
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

              {desktopMenuSections.map((section) => (
                <DesktopDropdown
                  key={section.key}
                  label={section.label}
                  alignRight={section.alignRight}
                  isOpen={activeMenu === section.key}
                  onToggle={() =>
                    setActiveMenu((prev) => (prev === section.key ? null : section.key))
                  }
                >
                  {section.items.map((item) => (
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
              ))}

              <NavItem onClick={() => go("campusForum")}>Campus Feed</NavItem>

              <NavItem onClick={() => go("entranceDiscovery")}>
                Entrance
              </NavItem>
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
                <button
                  onClick={() => go("login")}
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 transition-all active:scale-[0.98]"
                >
                  <User size={16} /> <span>Log in</span>
                </button>
                <button
                  onClick={() => go("signup")}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition-all active:scale-[0.98]"
                >
                  <span>Join Now</span>
                </button>
              </div>
            ) : (
              <>
                <div
                  className="flex items-center justify-between mb-5 p-3 rounded-lg border border-gray-200 bg-gray-50 cursor-pointer"
                  onClick={() => toggleMobileMenu("profile")}
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
                        <span className="text-[15px] font-bold text-gray-800 leading-tight">
                          {user.first_name} {user.last_name}
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="#0040ff"
                          className="icon icon-tabler icons-tabler-filled icon-tabler-rosette-discount-check"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
                        </svg>
                      </div>
                      <span className="text-[13px] text-gray-500 leading-tight font-semibold mt-0.5">
                        {profileLabel}
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-gray-400 transition-transform duration-200 ${mobileMenus["profile"] ? "rotate-180" : ""}`}
                  />
                </div>

                <div
                  className={`${mobileMenus["profile"] ? "flex" : "hidden"} flex-col mb-5 -mt-3`}
                >
                  <div className="w-full bg-white rounded-[18px] border border-gray-100/80 p-2.5 text-[14px] text-gray-600 font-medium select-none shadow-sm">
                    <div
                      onClick={() => go("studentDashboard")}
                      className="flex flex-col px-3 py-3 bg-[#f4f4f5] rounded-xl cursor-pointer mb-1 hover:bg-gray-100 transition-all duration-200"
                    >
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

                    <div
                      onClick={() => go("studentDashboard")}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-xl cursor-pointer mb-0.5 transition-all"
                    >
                      <FileText size={18} className="text-gray-500" />
                      <span>My Application</span>
                      <span className="ml-auto w-2.5 h-2.5 bg-red-500 rounded-full shadow-sm"></span>
                    </div>

                    <div
                      onClick={() => go("studentDashboard")}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-xl cursor-pointer mb-0.5 transition-all"
                    >
                      <Bookmark size={18} className="text-gray-500" />
                      <span>Saved College</span>
                      <span className="ml-auto text-gray-400 text-xs font-bold leading-none">
                        12
                      </span>
                    </div>

                    <div
                      onClick={() => go("studentDashboard")}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-xl cursor-pointer mb-0.5 transition-all"
                    >
                      <Sparkles size={18} className="text-gray-500" />
                      <span>Match</span>
                      <span className="ml-auto bg-[#5468FF]/10 text-[#5468FF] text-[11px] font-bold px-2 py-0.5 rounded-full">
                        3
                      </span>
                    </div>

                    <div className="h-px bg-gray-100 my-1.5 mx-2"></div>

                    <div
                      onClick={() => go("studentDashboard")}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-xl cursor-pointer mb-0.5 transition-all"
                    >
                      <Bell size={18} className="text-gray-500" />
                      <span>Notifications</span>
                      <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-[1.5px] rounded-full leading-none">
                        2
                      </span>
                    </div>

                    <div
                      onClick={() => go("studentDashboard")}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-xl cursor-pointer transition-all"
                    >
                      <Settings size={18} className="text-gray-500" />
                      <span>Settings</span>
                    </div>

                    <div className="h-px bg-gray-100 my-1.5 mx-2"></div>

                    <div
                      onClick={() => go("contact")}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-xl cursor-pointer transition-all"
                    >
                      <MessageCircleQuestion
                        size={18}
                        className="text-gray-500"
                      />
                      <span>Help center</span>
                    </div>

                    <div
                      onClick={onLogout}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 rounded-xl cursor-pointer mt-1 text-[#FF6B6B] transition-all"
                    >
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
            {mobileQuickLinks.map((link) => (
              <button
                key={link.viewKey}
                onClick={() => go(link.viewKey)}
                className="flex w-full items-center justify-between rounded-lg p-2 text-left transition-colors hover:bg-gray-50 hover:text-blue-600"
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="bg-blue-600 text-white text-[10px] leading-none px-1.5 py-1 rounded font-bold tracking-wide">
                    {link.badge}
                  </span>
                )}
              </button>
            ))}

            {mobileMenuSections.map((section) => (
              <div key={section.key}>
                <button
                  className={`flex w-full items-center justify-between rounded-lg p-2 text-left transition-colors hover:bg-gray-50 hover:text-blue-600 ${mobileMenus[section.key] ? "text-blue-600" : ""}`}
                  onClick={() => toggleMobileMenu(section.key)}
                >
                  <span>{section.label}</span>
                  <ChevronDown
                    size={14}
                    className={`text-gray-400 transition-transform duration-200 ${mobileMenus[section.key] ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`${mobileMenus[section.key] ? "flex" : "hidden"} flex-col gap-1 pl-4 py-2 ml-2 mt-1 font-medium`}
                >
                  {section.items.map(renderMobileAction)}
                </div>
              </div>
            ))}

            {user && (
              <div>
                <button
                  className={`flex w-full items-center justify-between rounded-lg p-2 text-left transition-colors hover:bg-gray-50 hover:text-blue-600 ${mobileMenus["partners"] ? "text-blue-600" : ""}`}
                  onClick={() => toggleMobileMenu("partners")}
                >
                  <span>Partner Modules</span>
                  <ChevronDown
                    size={14}
                    className={`text-gray-400 transition-transform duration-200 ${mobileMenus["partners"] ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`${mobileMenus["partners"] ? "flex" : "hidden"} flex-col gap-1 pl-4 py-2 ml-2 mt-1 font-medium`}
                >
                  {partnerMobileItems.map(renderMobileAction)}
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
