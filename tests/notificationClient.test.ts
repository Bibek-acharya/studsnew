import { toNotificationItem } from "../features/notifications/types";
import { notificationClient } from "../services/notificationClient";
import { apiRequest } from "../services/api";

jest.mock("../services/api", () => ({
  apiRequest: jest.fn(),
}));

const mockedApiRequest = apiRequest as jest.Mock;

beforeEach(() => {
  mockedApiRequest.mockReset();
});

describe("notificationClient", () => {
  test("listNotifications hits the inbox endpoint with page/limit defaults", async () => {
    mockedApiRequest.mockResolvedValue({ data: { notifications: [] }, message: "ok" });
    await notificationClient.listNotifications();
    expect(mockedApiRequest).toHaveBeenCalledWith(
      "/api/v1/notifications?page=1&limit=20",
    );
  });

  test("listNotifications forwards filters as query params", async () => {
    mockedApiRequest.mockResolvedValue({ data: { notifications: [] }, message: "ok" });
    await notificationClient.listNotifications(2, {
      limit: 10,
      category: "application",
      unread_only: true,
      query: "scholarship",
      sort: "-created_at",
    });
    const path = mockedApiRequest.mock.calls[0][0] as string;
    expect(path.startsWith("/api/v1/notifications?")).toBe(true);
    const params = new URLSearchParams(path.split("?")[1]);
    expect(params.get("page")).toBe("2");
    expect(params.get("limit")).toBe("10");
    expect(params.get("category")).toBe("application");
    expect(params.get("unread_only")).toBe("true");
    expect(params.get("query")).toBe("scholarship");
    expect(params.get("sort")).toBe("-created_at");
  });

  test("fetchUnreadCount hits the unread-count endpoint", async () => {
    mockedApiRequest.mockResolvedValue({ data: { unread_count: 3 }, message: "ok" });
    const res = await notificationClient.fetchUnreadCount();
    expect(mockedApiRequest).toHaveBeenCalledWith("/api/v1/notifications/unread-count");
    expect(res.data.unread_count).toBe(3);
  });

  test("markRead PUTs :id/read", async () => {
    await notificationClient.markRead(5);
    expect(mockedApiRequest).toHaveBeenCalledWith("/api/v1/notifications/5/read", {
      method: "PUT",
    });
  });

  test("markAllRead PUTs read-all", async () => {
    await notificationClient.markAllRead();
    expect(mockedApiRequest).toHaveBeenCalledWith("/api/v1/notifications/read-all", {
      method: "PUT",
    });
  });

  test("setArchived PUTs archive/unarchive", async () => {
    await notificationClient.setArchived(7, true);
    expect(mockedApiRequest).toHaveBeenCalledWith("/api/v1/notifications/7/archive", {
      method: "PUT",
    });
    await notificationClient.setArchived(7, false);
    expect(mockedApiRequest).toHaveBeenCalledWith("/api/v1/notifications/7/unarchive", {
      method: "PUT",
    });
  });

  test("remove DELETEs :id", async () => {
    await notificationClient.remove(3);
    expect(mockedApiRequest).toHaveBeenCalledWith("/api/v1/notifications/3", {
      method: "DELETE",
    });
  });

  test("fetchPreferences GETs /notifications/preferences", async () => {
    await notificationClient.fetchPreferences();
    expect(mockedApiRequest).toHaveBeenCalledWith("/api/v1/notifications/preferences");
  });

  test("updatePreferences PUTs the sparse overrides body", async () => {
    const payload = {
      overrides: [{ pref_key: "application", in_app: false }],
      global: { email: false },
    };
    await notificationClient.updatePreferences(payload);
    expect(mockedApiRequest).toHaveBeenCalledWith("/api/v1/notifications/preferences", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  });

  test("createBroadcast POSTs the doc 05 broadcast shape", async () => {
    const payload = {
      title: "Maintenance",
      body: "Downtime tonight",
      link: "/news",
      audience: ["user", "provider"] as const,
      priority: "critical" as const,
    };
    await notificationClient.createBroadcast(payload);
    expect(mockedApiRequest).toHaveBeenCalledWith("/api/v1/notifications/broadcast", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  });
});

describe("toNotificationItem", () => {
  test("passes the v2 envelope through unchanged", () => {
    const item = toNotificationItem({
      id: 1,
      event_key: "application.received",
      category: "application",
      priority: "normal",
      title: "New application",
      body: "Someone applied",
      link: "/applications/9",
      read_at: "2026-09-08T10:00:00Z",
      created_at: "2026-09-08T09:00:00Z",
    });
    expect(item).toEqual({
      id: 1,
      event_key: "application.received",
      category: "application",
      priority: "normal",
      title: "New application",
      body: "Someone applied",
      link: "/applications/9",
      read_at: "2026-09-08T10:00:00Z",
      created_at: "2026-09-08T09:00:00Z",
      data: null,
    });
  });

  test("normalizes the legacy envelope (message/read/type) into NotificationItem", () => {
    const item = toNotificationItem({
      id: 2,
      title: "Status changed",
      message: "Your application moved on",
      type: "application.status_changed",
      read: true,
      link: "/applications/4",
      created_at: "2026-09-08T09:00:00Z",
      updated_at: "2026-09-08T11:00:00Z",
    });
    expect(item.body).toBe("Your application moved on");
    expect(item.event_key).toBe("application.status_changed");
    expect(item.read_at).toBe("2026-09-08T11:00:00Z");
    expect(item.priority).toBe("normal");
    expect(item.category).toBe("");
  });

  test("legacy unread notification has a null read_at", () => {
    const item = toNotificationItem({
      id: 3,
      title: "Welcome",
      message: "hi",
      type: "account.welcome",
      read: false,
      created_at: "2026-09-08T09:00:00Z",
    });
    expect(item.read_at).toBeNull();
  });

  test("v2 body wins over a legacy message when both are present", () => {
    const item = toNotificationItem({
      id: 4,
      title: "t",
      body: "v2 body",
      message: "legacy body",
      created_at: "2026-09-08T09:00:00Z",
    });
    expect(item.body).toBe("v2 body");
  });
});
