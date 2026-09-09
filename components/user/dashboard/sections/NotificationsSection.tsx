"use client";

import React, { useState } from "react";
import { useStudentNotifications } from "../notifications-context";
import NotificationList from "@/components/notifications/NotificationList";
import { resolveRoute } from "@/features/notifications/routes";

// Student inbox section (mounted under DashboardLayout, so this reads the
// layout's shared hook instance — no second fetch, no second poller).
// Category tabs derive from the items' registry categories; icons come from
// icons.ts via NotificationList; rows deep-link via routes.ts.
export default function NotificationsSection() {
  const { items, loading, error, refresh, markRead, markAllRead } =
    useStudentNotifications();
  const [category, setCategory] = useState("all");

  const quiet = (promise: Promise<unknown>) => {
    promise.catch(() => {});
  };

  return (
    <div className="mt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">Notifications</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-4 pt-3 flex justify-end items-center">
          <button
            onClick={() => quiet(markAllRead())}
            className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
          >
            Mark All Read
          </button>
        </div>
        <NotificationList
          items={items}
          loading={loading}
          error={error}
          onRetry={() => quiet(refresh())}
          onMarkRead={(id) => quiet(markRead(id))}
          activeCategory={category}
          onCategoryChange={setCategory}
          getHref={(item) =>
            item.link ? resolveRoute("user", item.link) : null
          }
        />
      </div>
    </div>
  );
}
