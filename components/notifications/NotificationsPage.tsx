"use client";

import React, { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "@/features/notifications/useNotifications";
import NotificationList from "@/components/notifications/NotificationList";
import { resolveRoute } from "@/features/notifications/routes";

// Generic student inbox (route: /notifications). Tabs are the registry
// categories present in the inbox plus a real archive tab backed by
// `GET /notifications?archived=true`; the old synthetic "following" tab is
// gone — followed content arrives as the `content` category.
export default function NotificationsPage() {
  const [tab, setTab] = useState("all");
  const archived = tab === "archive";
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
  } = useNotifications({ limit: 50, archived });

  // The hook fetches on mount; only re-fetch when the archive flag flips.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    // Mount-time fetch lives in the hook — this only swaps inbox/archived.
    void refresh();
  }, [archived, refresh]);

  const quiet = (promise: Promise<unknown>) => {
    promise.catch(() => {});
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white text-left shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <div className="z-10 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-[#475569]" />
            <h3 className="text-lg font-semibold text-gray-900">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={() => quiet(markAllRead())}
            className="rounded-md px-2 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-900"
          >
            Mark all as read
          </button>
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
            item.link ? resolveRoute("user", item.link) : null
          }
          onSetArchived={(id, toArchived) => quiet(setArchived(id, toArchived))}
          onRemove={(id) => quiet(remove(id))}
          archivedView={archived}
        />
      </div>
    </div>
  );
}
