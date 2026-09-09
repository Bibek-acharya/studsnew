"use client";
import React, { useEffect, useState } from "react";
import SectionHeader from "../shared/SectionHeader";
import { CheckCheck } from "lucide-react";
import NotificationList from "@/components/notifications/NotificationList";
import { resolveRoute } from "@/features/notifications/routes";
import { useNotifications } from "@/features/notifications/useNotifications";
import { useInstitutionNotifications } from "./notifications-context";

// Real institution inbox on the shared client. Tabs are the registry
// categories present in the inbox; rows deep-link via routes.ts and mark read
// individually. The dashboard-counter fabrications, the conversations
// mash-in, and the nonexistent institution-scoped endpoints are gone —
// messaging stays behind MessageBell.
const NotificationsPage: React.FC = () => {
  const [tab, setTab] = useState("all");
  const archivedView = tab === "archive";
  const inbox = useInstitutionNotifications();
  // Dedicated archived instance: the archive tab must not flip the shared
  // bell/badge instance's filter. It stays disabled until the tab opens, then
  // refreshes on entry (no poller — the bell owns the 60s poll).
  const archive = useNotifications({
    limit: 50,
    archived: true,
    enabled: archivedView,
  });
  const { refresh: refreshArchive } = archive;
  useEffect(() => {
    if (archivedView) void refreshArchive();
  }, [archivedView, refreshArchive]);
  const {
    items,
    unreadCount,
    loading,
    error,
    refresh,
    markRead,
    markAllRead,
    setArchived,
    remove,
  } = archivedView ? archive : inbox;

  const quiet = (promise: Promise<unknown>) => {
    promise.catch(() => {});
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <SectionHeader
        title="Notification"
        breadcrumbItems={[
          { label: "Dashboard", href: "/institution-zone/dashboard/overview" },
          { label: "Notification" },
        ]}
      />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
          <p className="text-xs text-gray-500">
            {loading
              ? "Loading..."
              : `${items.length} notification${items.length !== 1 ? "s" : ""}`}
          </p>
          {unreadCount > 0 && (
            <button
              onClick={() => quiet(markAllRead())}
              className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg font-medium flex items-center gap-1.5"
            >
              <CheckCheck className="w-4 h-4" />
              Mark All Read
            </button>
          )}
        </div>
        <NotificationList
          items={items}
          loading={loading}
          error={error}
          onRetry={() => quiet(refresh())}
          onMarkRead={(id) => quiet(markRead(id))}
          activeCategory={tab}
          onCategoryChange={setTab}
          extraTabs={["archive"]}
          getHref={(item) =>
            item.link ? resolveRoute("institution", item.link) : null
          }
          onSetArchived={(id, toArchived) => quiet(setArchived(id, toArchived))}
          onRemove={(id) => quiet(remove(id))}
          archivedView={archivedView}
        />
      </div>
    </div>
  );
};

export default NotificationsPage;
