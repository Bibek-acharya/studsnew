"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/SearchBar";

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
  findCollege: "/",
  compareColleges: "/",
  courseFinder: "/",
  bookCounselling: "/",
  scholarshipFinderTool: "/",
  collegeRecommenderTool: "/",
  scholarshipFinder: "/",
  scholarshipProviderZone: "/",
  scholarshipMain: "/",
  campusForum: "/",
  admissionsDiscovery: "/",
  entranceDiscovery: "/",
  universitiesPage: "/",
  rankingsPage: "/",
  newsPage: "/",
  blogPage: "/",
  eventsPage: "/",
  contact: "/",
  institutionZone: "/",
  studentDashboard: "/",
  writeReview: "/",
  login: "/",
  signup: "/",
};

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
  const router = useRouter();

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
    router.push(routeMap[viewKey] ?? "/");
    setIsMobileOpen(false);
    setActiveMenu(null);
  };

  return (
    <header
      className={`fixed left-0 top-0 z-110 w-full bg-white transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${isScrolled ? "shadow-sm" : ""}`}
    >
      <div className="w-full px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-350 items-center justify-between gap-2 sm:gap-4">
          <Link
            href="/"
            className="flex shrink-0 cursor-pointer items-center gap-2.5"
          >
            <span className="mt-0.5 text-[18px] font-bold leading-none tracking-tight text-[#0e5cf4] sm:text-[26px]">
              Studsphere
            </span>
          </Link>

          <SearchBar />

          <div className="flex items-center gap-3">
            <button
              onClick={() => go("writeReview")}
              className="relative hidden items-center gap-1.5 overflow-hidden rounded-md bg-[#4461f2] px-3 py-2 text-[13px] font-medium text-white shadow-sm transition-colors hover:bg-blue-700 sm:gap-2 sm:px-4 sm:text-[14px] md:flex"
            >
              <i className="fa-solid fa-pen-to-square relative z-10 text-sm"></i>
              <span className="relative z-10">Write a Review</span>
              <span className="shimmer-effect"></span>
            </button>

            {user && (
              <div className="menu-anchor relative">
                <button
                  onClick={() =>
                    setActiveMenu((prev) =>
                      prev === "notification-menu" ? null : "notification-menu",
                    )
                  }
                  className="relative rounded-full border border-gray-200 p-1.5 text-[#475569] transition-colors hover:bg-gray-50 sm:p-2"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="sm:h-5 sm:w-5"
                  >
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                  </svg>
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-[#ef4444] text-[9px] font-bold text-white shadow-sm">
                    3
                  </span>
                </button>

                {activeMenu === "notification-menu" && (
                  <div className="absolute right-0 z-200 mt-3 w-85 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                      <span className="text-[15px] font-semibold text-gray-800">Notifications</span>
                      <span className="cursor-pointer text-xs font-medium text-[#4264f5] hover:underline">
                        Mark all as read
                      </span>
                    </div>
                    <div className="custom-scrollbar max-h-90 overflow-y-auto">
                      <NotificationItem
                        icon="fa-thumbs-up"
                        color="bg-blue-100 text-blue-600"
                        text="Your review for Harvard University was approved and is now live!"
                        time="2 mins ago"
                        unread
                      />
                      <NotificationItem
                        icon="fa-circle-check"
                        color="bg-green-100 text-green-600"
                        text="Successfully enrolled in Advanced Computer Science Masterclass."
                        time="1 hour ago"
                        unread
                      />
                      <NotificationItem
                        icon="fa-reply"
                        color="bg-purple-100 text-purple-600"
                        text="Sarah Jenkins replied to your comment in the Campus Feed."
                        time="4 hours ago"
                      />
                    </div>
                    <div className="border-t border-gray-100 pb-1 pt-2 text-center">
                      <button className="text-[13px] font-medium text-[#4264f5] hover:underline">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="ml-1 hidden items-center gap-3 border-l border-gray-200 pl-4 sm:flex">
              {!user ? (
                <div className="ml-1 flex items-center overflow-hidden rounded-md text-[13px] font-medium shadow-sm sm:ml-2 sm:text-[14px]">
                  <button
                    onClick={() => go("login")}
                    className="border-r border-gray-200 bg-gray-100 px-3 py-2 text-[#334155] transition-colors hover:bg-gray-200 sm:px-4"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => go("signup")}
                    className="relative overflow-hidden bg-[#4461f2] px-3 py-2 text-white transition-colors hover:bg-blue-700 sm:px-4"
                  >
                    <span className="relative z-10">Register</span>
                    <span className="shimmer-effect"></span>
                  </button>
                </div>
              ) : (
                <div className="menu-anchor relative">
                  <button
                    onClick={() =>
                      setActiveMenu((prev) =>
                        prev === "profile-menu" ? null : "profile-menu",
                      )
                    }
                    className="group flex items-center gap-2"
                  >
                    <div className="relative">
                      <div className="flex h-9.5 w-9.5 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-indigo-600 text-[15px] font-bold text-white shadow-sm ring-2 ring-white ring-offset-1 transition-all duration-200 group-hover:ring-blue-100">
                        <span>{initials}</span>
                      </div>
                      <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500"></div>
                    </div>

                    <div className="mr-1 hidden text-left sm:flex sm:flex-col">
                      <span className="text-[13px] font-bold leading-tight text-gray-800">
                        {user.first_name} {user.last_name}
                      </span>
                      <span className="mt-0.5 text-[11px] font-medium leading-tight text-gray-500">
                        {profileLabel}
                      </span>
                    </div>

                    <i className="fa-solid fa-chevron-down text-xs text-gray-400 transition-transform duration-200 group-hover:text-[#4264f5]"></i>
                  </button>

                  {activeMenu === "profile-menu" && (
                    <div className="absolute right-0 z-200 mt-3 w-56 rounded-xl border border-gray-100 bg-white py-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
                      <div className="absolute -top-1.5 right-6 h-3 w-3 rotate-45 border-l border-t border-gray-100 bg-white"></div>
                      <div className="mb-1 border-b border-gray-100 px-4 py-3 sm:hidden">
                        <span className="block text-sm font-bold text-gray-800">
                          {user.first_name} {user.last_name}
                        </span>
                        <span className="mt-0.5 block text-xs text-gray-500">{user.email}</span>
                      </div>
                      <button className="menu-item">
                        <i className="fa-regular fa-user"></i>
                        My Profile
                      </button>
                      <button className="menu-item">
                        <i className="fa-regular fa-bookmark"></i>
                        Saved Colleges
                      </button>
                      <button onClick={() => go("studentDashboard")} className="menu-item">
                        <i className="fa-solid fa-chart-line"></i>
                        Dashboard
                      </button>
                      <button className="menu-item">
                        <i className="fa-solid fa-gear"></i>
                        Settings
                      </button>

                      <div className="mx-2 my-1 h-px bg-gray-100"></div>

                      <button
                        onClick={onLogout}
                        className="menu-item text-red-600 hover:bg-red-50"
                      >
                        <i className="fa-solid fa-arrow-right-from-bracket bg-red-50! text-red-500!"></i>
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              className="flex h-10 w-10 items-center justify-center text-xl text-gray-600 md:hidden"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              <i className={`fa-solid ${isMobileOpen ? "fa-xmark" : "fa-bars"}`}></i>
            </button>
          </div>
        </div>
      </div>

      <div className="relative w-full border-b border-gray-200 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex h-11.5 w-full max-w-350 items-center gap-4">
          <nav className="no-scrollbar flex h-full min-w-0 flex-1 items-center gap-x-5 overflow-x-auto whitespace-nowrap pr-2 text-[14px] font-medium text-[#212529] md:overflow-visible md:gap-x-7 lg:gap-x-8 lg:text-[15px]">
            <NavItem onClick={() => go("findCollege")}>Find College</NavItem>

            <DesktopDropdown label="Tools">
              <DropdownCard
                icon="fa-shuffle"
                color="text-blue-500"
                title="Compare College"
                desc="Compare multiple colleges side-by-side based on fees, ranking, and placement."
                onClick={() => go("compareColleges")}
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
            </DesktopDropdown>

            <DesktopDropdown label="Scholarships">
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

            <DesktopDropdown label="Admission">
              <DropdownCard
                icon="fa-school"
                color="text-blue-500"
                title="High School (+2)"
                desc="Explore top high schools for Science, Management, and Humanities."
                onClick={() => go("admissionsDiscovery", { level: "high-school" })}
              />
              <DropdownCard
                icon="fa-user-graduate"
                color="text-purple-600"
                title="Bachelor Degrees"
                desc="Find undergraduate programs including B.Tech, B.Sc, BBA, and more."
                onClick={() => go("admissionsDiscovery", { level: "bachelor" })}
              />
              <DropdownCard
                icon="fa-book-open"
                color="text-pink-600"
                title="Master Degrees"
                desc="Advance your career with postgraduate degrees like MBA and M.Tech."
                onClick={() => go("admissionsDiscovery", { level: "master" })}
              />
            </DesktopDropdown>

            <NavItem onClick={() => go("entranceDiscovery")}>Entrance</NavItem>
            <NavItem onClick={() => go("universitiesPage")}>Universities</NavItem>

            <NavItem onClick={() => go("rankingsPage")}>
              Rankings
              <div className="relative ml-1.5 mt-0.5 block">
                <span className="relative block overflow-hidden rounded bg-linear-to-r from-blue-400 via-blue-500 to-blue-600 px-1.5 py-0.75 text-[10px] font-bold uppercase leading-none tracking-wider text-white shadow-sm">
                  2082
                  <span className="shimmer-effect"></span>
                </span>
              </div>
            </NavItem>

            <DesktopDropdown label="More" alignRight>
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
            <div className="ml-2 flex shrink-0 items-center border-l-2 border-gray-100 py-2 pl-4 sm:ml-4 sm:pl-6">
              <button
                onClick={() => go("institutionZone")}
                className="flex items-center gap-1.5 whitespace-nowrap text-[13px] font-semibold text-[#0f172a] transition-colors hover:text-[#4461f2] sm:text-[14px]"
              >
                Institution Zone
                <svg
                  width="16"
                  height="16"
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

      <div
        className={`fixed inset-y-0 right-0 z-200 flex w-[88vw] max-w-75 transform flex-col border-l border-slate-50 bg-white shadow-[-10px_0_40px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-in-out md:hidden ${
          isMobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-50 p-6">
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L29.8564 10V22L16 30L2.14359 22V10L16 2Z" fill="#3B82F6" />
            </svg>
            <span className="font-black uppercase tracking-tighter text-gray-900">Studsphere</span>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-gray-400"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="no-scrollbar flex-1 space-y-6 overflow-y-auto p-6">
          <MobileSection title="Quick Explore">
            <MobileItem label="Find College" onClick={() => go("findCollege")} icon="fa-building-columns" />
            <MobileItem label="Campus Feed" onClick={() => go("campusForum")} icon="fa-comments" />
            <MobileItem label="Blogs" onClick={() => go("blogPage")} icon="fa-pen" />
            <MobileItem label="Scholarships" onClick={() => go("scholarshipMain")} icon="fa-hand-holding-dollar" />
            <MobileItem label="Write Review" onClick={() => go("writeReview")} icon="fa-pen-to-square" />
            <MobileItem label="High School (+2)" onClick={() => go("admissionsDiscovery", { level: "high-school" })} icon="fa-school" />
          </MobileSection>

          <MobileSection title="Tools">
            <MobileItem label="Compare College" onClick={() => go("compareColleges")} icon="fa-shuffle" />
            <MobileItem label="Course Finder" onClick={() => go("courseFinder")} icon="fa-compass" />
            <MobileItem label="Counselling" onClick={() => go("bookCounselling")} icon="fa-headset" />
            <MobileItem label="Scholarship Finder" onClick={() => go("scholarshipFinderTool")} icon="fa-award" />
          </MobileSection>

          {!user && (
            <div className="border-t border-gray-50 pt-6">
              <div className="mb-3 grid grid-cols-2 gap-2">
                <button
                  onClick={() => go("login")}
                  className="rounded-xl border border-gray-200 py-2.5 text-[12px] font-bold uppercase tracking-wide text-slate-700"
                >
                  Login
                </button>
                <button
                  onClick={() => go("signup")}
                  className="rounded-xl bg-[#4461f2] py-2.5 text-[12px] font-bold uppercase tracking-wide text-white"
                >
                  Register
                </button>
              </div>
              <button
                onClick={() => go("institutionZone")}
                className="w-full rounded-2xl bg-slate-900 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-xl"
              >
                Institutions Zone {">"}
              </button>
            </div>
          )}
        </div>
      </div>

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-150 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </header>
  );
};

const NavItem: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({
  children,
  onClick,
}) => (
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
}> = ({ label, children, alignRight = false }) => (
  <div className="group relative h-full shrink-0">
    <div className="nav-link flex h-full cursor-pointer items-center gap-1">
      <span>{label}</span>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gray-400 transition-colors group-hover:text-[#4461f2]"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
    <div
      className={`invisible absolute top-11.5 z-200 mt-1 translate-y-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 ${
        alignRight ? "right-0" : "left-0"
      }`}
    >
      <div className="relative w-100 whitespace-normal rounded-xl border border-gray-100 bg-white p-3 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
        <div
          className={`absolute -top-1.5 h-3 w-3 rotate-45 border-l border-t border-gray-100 bg-white ${
            alignRight ? "right-6" : "left-6"
          }`}
        ></div>
        <div className="relative z-10 flex flex-col gap-1 whitespace-normal">{children}</div>
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
    className="group/card flex w-full min-w-0 items-start whitespace-normal rounded-xl border border-transparent p-3 text-left transition-colors hover:border-blue-100 hover:bg-blue-50/50"
  >
    <div
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 transition-colors group-hover/card:bg-white ${color}`}
    >
      <i className={`fa-solid ${icon} text-lg`}></i>
    </div>
    <div className="ml-4 min-w-0 flex-1">
      <h4 className="wrap-break-word text-[15px] font-bold leading-tight text-gray-900">{title}</h4>
      <p className="mt-1 wrap-break-word text-[13px] leading-relaxed text-gray-500">{desc}</p>
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
    className={`flex w-full items-start gap-3 border-b border-gray-50 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
      unread ? "bg-blue-50/30" : ""
    }`}
  >
    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${color}`}>
      <i className={`fa-solid ${icon} text-sm`}></i>
    </div>
    <div className="flex-1">
      <p className="text-[13px] leading-snug text-gray-800">{text}</p>
      <span className="mt-1 block text-[11px] text-gray-500">{time}</span>
    </div>
    {unread && <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#4264f5]"></div>}
  </button>
);

const MobileSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="space-y-4">
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{title}</p>
    <div className="space-y-2">{children}</div>
  </div>
);

const MobileItem: React.FC<{ label: string; onClick: () => void; icon: string }> = ({
  label,
  onClick,
  icon,
}) => (
  <button
    onClick={onClick}
    className="group flex w-full items-center gap-4 rounded-2xl bg-slate-50 p-4 transition-colors hover:bg-slate-100"
  >
    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-white text-blue-500 shadow-sm transition-transform group-hover:scale-110">
      <i className={`fa-solid ${icon}`}></i>
    </div>
    <span className="text-xs font-bold uppercase tracking-widest text-gray-700">{label}</span>
  </button>
);

export default EducationNavbar;
