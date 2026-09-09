"use client";

import { useState, useMemo, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import LogoutModal from "./LogoutModal";
import { Menu, Search } from "lucide-react";
import { getImageUrl } from "@/services/api";
import { useAuth } from "@/services/AuthContext";
import NotificationBell from "@/components/notifications/NotificationBell";
import { resolveIcon } from "@/components/notifications/icons";
import {
  NotificationsProvider,
  useStudentNotifications,
} from "./notifications-context";

interface DashboardLayoutProps {
  children: ReactNode;
}

const statusLabels: Record<string, string> = {
  see_graduate: "SEE Graduate",
  plus_two_running: "+2 Running",
  plus_two_graduate: "+2 Graduate",
};

function DashboardHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  // Same hook instance the sidebar badge reads — bell and badge agree.
  const { items, unreadCount, loading, markRead, markAllRead } =
    useStudentNotifications();

  const initials = useMemo(() => {
    if (!user) return "KS";
    return (
      (
        (user.first_name?.[0] || "") + (user.last_name?.[0] || "")
      ).toUpperCase() || "U"
    );
  }, [user]);

  const profileLabel = useMemo(() => {
    if (!user) return "Student";
    if (user.role === "admin") return "Admin";
    if (user.current_status && statusLabels[user.current_status]) {
      return statusLabels[user.current_status];
    }
    return "Student";
  }, [user]);

  const bellNotifications = useMemo(
    () =>
      items.slice(0, 10).map((n) => {
        const { icon: Icon, color, bg } = resolveIcon(n.category, n.event_key);
        return {
          id: n.id,
          title: n.title,
          message: n.body,
          read: n.read_at !== null,
          created_at: n.created_at,
          icon: <Icon size={14} className={color} />,
          iconBg: bg,
        };
      }),
    [items],
  );

  const quiet = (promise: Promise<unknown>) => {
    promise.catch(() => {});
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
      <div className="flex items-center gap-4">
        <button
          id="menu-toggle"
          onClick={onMenuClick}
          className="lg:hidden text-gray-500 hover:text-brand-blue"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="relative hidden md:block w-64 lg:w-96">
          <input
            type="text"
            placeholder="Search colleges, courses, scholarships..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-[#0000ff] focus:ring-1 focus:ring-[#0000ff] text-sm transition-all"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-[18px] h-[18px]" />
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        <NotificationBell
          notifications={bellNotifications}
          unreadCount={unreadCount}
          loading={loading}
          isOpen={notifOpen}
          onToggle={() => setNotifOpen(!notifOpen)}
          onClose={() => setNotifOpen(false)}
          onMarkRead={(id) => quiet(markRead(Number(id)))}
          onMarkAllRead={() => quiet(markAllRead())}
          onViewAll={() => {
            router.push("/user/dashboard/notifications");
            setNotifOpen(false);
          }}
        />

        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <button
            type="button"
            className="relative flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white border border-blue-700 transition-colors hover:bg-blue-700"
            aria-label="User profile"
          >
            {user?.image_url ? (
              <img
                src={getImageUrl(user.image_url)}
                alt=""
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-sm font-semibold">{initials}</span>
            )}
            <span className="absolute -bottom-0.5 -right-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-400 " />
          </button>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-bold text-gray-800 transition-colors">
              {user?.first_name || "User"} {user?.last_name || ""}
            </p>
            <p className="text-xs text-gray-500">{profileLabel}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <NotificationsProvider>
      <div className="flex h-screen bg-gray-50 font-sans overflow-hidden text-gray-800">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onLogoutClick={() => setShowLogoutModal(true)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

          {/* Main Scrollable Area */}
          <main className="flex-1 overflow-y-auto">
            <div className="px-4 lg:px-8 py-6">{children}</div>
          </main>
        </div>

        {/* <PreferenceModal isOpen={preferenceModalOpen} onClose={() => setPreferenceModalOpen(false)} /> */}
        <LogoutModal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
        />
      </div>
    </NotificationsProvider>
  );
}
