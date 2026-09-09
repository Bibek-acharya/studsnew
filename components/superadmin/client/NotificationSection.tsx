"use client";

import React, { useMemo, useState } from "react";
import { Bell, CheckCheck, Megaphone } from "lucide-react";
import NotificationList from "@/components/notifications/NotificationList";
import { resolveRoute } from "@/features/notifications/routes";
import { notificationClient } from "@/services/notificationClient";
import type {
  BroadcastAudience,
  Priority,
} from "@/features/notifications/types";
import { useSuperadminNotifications } from "./notifications-context";

const AUDIENCES: BroadcastAudience[][] = [
  ["user"],
  ["institution"],
  ["provider"],
  ["all"],
];

const PRIORITIES: Priority[] = ["low", "normal", "critical"];

// Manage-Notifications page: the moderation events slice of the shared inbox
// plus the Broadcast tab (POST /notifications/broadcast per doc 05 §2.5).
export default function NotificationSection() {
  const [tab, setTab] = useState<"inbox" | "broadcast">("inbox");

  return (
    <div className="rounded-md border border-gray-200 bg-white p-8">
      <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-gray-900">
        <Bell size={20} className="text-blue-600" /> Manage Notifications
      </h2>
      <div className="mb-6 flex gap-2">
        <button
          type="button"
          onClick={() => setTab("inbox")}
          className={`rounded-md px-4 py-2 text-sm font-medium ${
            tab === "inbox"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Moderation inbox
        </button>
        <button
          type="button"
          onClick={() => setTab("broadcast")}
          className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium ${
            tab === "broadcast"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Megaphone size={16} /> Broadcast
        </button>
      </div>
      {tab === "inbox" ? <ModerationInbox /> : <BroadcastForm />}
    </div>
  );
}

function ModerationInbox() {
  const { items, unreadCount, loading, error, refresh, markRead, markAllRead } =
    useSuperadminNotifications();
  const moderation = useMemo(
    () => items.filter((n) => n.category === "moderation"),
    [items],
  );

  const quiet = (promise: Promise<unknown>) => {
    promise.catch(() => {});
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {loading
            ? "Loading..."
            : `${moderation.length} moderation event${moderation.length !== 1 ? "s" : ""}`}
        </p>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={() => quiet(markAllRead())}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
          >
            <CheckCheck size={16} />
            Mark All Read
          </button>
        )}
      </div>
      <NotificationList
        items={moderation}
        loading={loading}
        error={error}
        onRetry={() => quiet(refresh())}
        onMarkRead={(id) => quiet(markRead(id))}
        getHref={(item) =>
          item.link ? resolveRoute("superadmin", item.link) : null
        }
      />
    </div>
  );
}

function BroadcastForm() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [link, setLink] = useState("");
  const [audience, setAudience] = useState<BroadcastAudience>("all");
  const [priority, setPriority] = useState<Priority>("normal");
  const [sending, setSending] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setBanner(null);
    setError(null);
    try {
      const res = await notificationClient.createBroadcast({
        title,
        body,
        ...(link.trim() ? { link: link.trim() } : {}),
        audience: [audience],
        priority,
      });
      setBanner(`Broadcast queued — campaign #${res.data.broadcast_id} accepted.`);
      setTitle("");
      setBody("");
      setLink("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Broadcast failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={send} className="space-y-4">
      {banner && (
        <p role="status" className="rounded-md bg-green-50 p-3 text-sm font-medium text-green-700">
          {banner}
        </p>
      )}
      {error && (
        <p role="alert" className="rounded-md bg-red-50 p-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
      <div>
        <label htmlFor="broadcast-title" className="mb-1 block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          id="broadcast-title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="broadcast-body" className="mb-1 block text-sm font-medium text-gray-700">
          Body
        </label>
        <textarea
          id="broadcast-body"
          name="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={4}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="broadcast-link" className="mb-1 block text-sm font-medium text-gray-700">
          Link (optional)
        </label>
        <input
          id="broadcast-link"
          name="link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="/news"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="broadcast-audience" className="mb-1 block text-sm font-medium text-gray-700">
            Audience
          </label>
          <select
            id="broadcast-audience"
            name="audience"
            value={audience}
            onChange={(e) => setAudience(e.target.value as BroadcastAudience)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            {AUDIENCES.map(([value]) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="broadcast-priority" className="mb-1 block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            id="broadcast-priority"
            name="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            {PRIORITIES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        type="submit"
        disabled={sending}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {sending ? "Sending..." : "Send broadcast"}
      </button>
    </form>
  );
}
