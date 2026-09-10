/**
 * @jest-environment jsdom
 */
import React, { act } from "react";
import fs from "fs";
import path from "path";
import { createRoot, type Root } from "react-dom/client";
import { apiRequest } from "../services/api";
import NotificationSection from "../components/superadmin/client/NotificationSection";
import { NotificationsProvider } from "../components/superadmin/client/notifications-context";

jest.mock("../services/api", () => ({
  apiRequest: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  usePathname: () => "/superadmin",
  useRouter: () => ({ push: jest.fn() }),
}));

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const mockedApiRequest = apiRequest as jest.Mock;

const NOW = "2026-09-08T09:00:00Z";

function raw(id: number, overrides: Record<string, unknown> = {}) {
  return {
    id,
    event_key: "moderation.flagged",
    category: "moderation",
    priority: "critical",
    title: `Flagged content ${id}`,
    body: `Needs review ${id}`,
    link: "/superadmin/moderation",
    read_at: null,
    created_at: NOW,
    updated_at: NOW,
    data: null,
    ...overrides,
  };
}

const INBOX = [
  raw(1),
  raw(2, {
    event_key: "application.submitted",
    category: "application",
    priority: "normal",
    title: "New application",
    body: "Someone applied",
  }),
];

beforeEach(() => {
  jest.useFakeTimers();
  mockedApiRequest.mockReset();
  mockedApiRequest.mockImplementation((requestPath: string) => {
    if (String(requestPath).includes("/unread-count")) {
      return Promise.resolve({ data: { unread_count: 1 }, message: "ok" });
    }
    if (String(requestPath).includes("/broadcast")) {
      return Promise.resolve({
        data: { broadcast_id: 9, status: "queued" },
        message: "accepted",
      });
    }
    return Promise.resolve({
      data: {
        notifications: INBOX,
        unread_count: 1,
        meta: { total: 2, page: 1, limit: 20 },
      },
      message: "ok",
    });
  });
});

const containers: HTMLElement[] = [];
const roots: Root[] = [];

function render(ui: React.ReactElement) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  containers.push(container);
  const root = createRoot(container);
  roots.push(root);
  act(() => {
    root.render(ui);
  });
  return container;
}

afterEach(() => {
  while (roots.length) {
    const root = roots.pop()!;
    act(() => {
      root.unmount();
    });
  }
  while (containers.length) containers.pop()!.remove();
  jest.useRealTimers();
});

function renderSection() {
  return render(
    <NotificationsProvider options={{ limit: 20 }}>
      <NotificationSection />
    </NotificationsProvider>,
  );
}

describe("superadmin notification surfaces", () => {
  test("moderation inbox renders real events from the shared inbox; static toggles gone", async () => {
    const container = renderSection();
    await act(async () => {});

    expect(container.textContent).toContain("Flagged content 1");
    // Static toggle mocks are deleted — never rendered.
    expect(container.textContent).not.toContain("Weekly Digest");
    expect(container.textContent).not.toContain("SMS Alerts");
    expect(container.textContent).not.toContain("Push Notifications");

    // The moderation tab owns a filtered instance (category=moderation) so
    // paging/counts scope correctly; the shell provider fetches once beside
    // it for the bell badge.
    const listCalls = mockedApiRequest.mock.calls.filter((call) =>
      String(call[0]).includes("/notifications?"),
    );
    expect(listCalls).toHaveLength(2);
    expect(
      listCalls.some((call) => String(call[0]).includes("category=moderation")),
    ).toBe(true);
  });

  test("broadcast form posts the doc 05 body shape; 202 shows a campaign banner", async () => {
    const container = renderSection();
    await act(async () => {});

    const broadcastTab = Array.from(container.querySelectorAll("button")).find(
      (b) => b.textContent?.includes("Broadcast"),
    )!;
    await act(async () => {
      broadcastTab.click();
    });

    const title = container.querySelector('input[name="title"]')!;
    const body = container.querySelector('textarea[name="body"]')!;
    const link = container.querySelector('input[name="link"]')!;
    const audience = container.querySelector('select[name="audience"]')!;
    const priority = container.querySelector('select[name="priority"]')!;
    await act(async () => {
      (audience as HTMLSelectElement).value = "all";
      audience.dispatchEvent(new Event("change", { bubbles: true }));
      (priority as HTMLSelectElement).value = "critical";
      priority.dispatchEvent(new Event("change", { bubbles: true }));
    });

    // React controlled inputs need native setters under jsdom.
    const setNative = (el: Element, value: string) => {
      const proto =
        el instanceof HTMLTextAreaElement
          ? HTMLTextAreaElement.prototype
          : HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(proto, "value")!.set!;
      setter.call(el, value);
      el.dispatchEvent(new Event("input", { bubbles: true }));
    };
    await act(async () => {
      setNative(title, "Maintenance");
      const bodySetter = Object.getOwnPropertyDescriptor(
        HTMLTextAreaElement.prototype,
        "value",
      )!.set!;
      bodySetter.call(body, "Downtime tonight");
      body.dispatchEvent(new Event("input", { bubbles: true }));
      setNative(link, "/news");
    });

    const submit = Array.from(container.querySelectorAll("button")).find((b) =>
      b.textContent?.includes("Send broadcast"),
    )!;
    await act(async () => {
      submit.click();
    });

    expect(mockedApiRequest).toHaveBeenCalledWith(
      "/api/v1/notifications/broadcast",
      {
        method: "POST",
        body: JSON.stringify({
          title: "Maintenance",
          body: "Downtime tonight",
          link: "/news",
          audience: ["all"],
          priority: "critical",
        }),
        // Superadmin calls authenticate explicitly and never trip the
        // global user-session auth-expired nuke.
        suppressAuthExpired: true,
      },
    );
    // 202 accepted → campaign banner (acceptance #4 hook).
    expect(container.textContent).toContain("Broadcast queued");
  });

  test("superadmin inbox calls carry the superadmin token verbatim", async () => {
    localStorage.setItem("superadmin_token", "good-superadmin");
    localStorage.setItem("token", "stale-user-token");
    try {
      renderSection();
      await act(async () => {});

      const listCalls = mockedApiRequest.mock.calls.filter((call) =>
        String(call[0]).includes("/notifications?"),
      );
      expect(listCalls.length).toBeGreaterThan(0);
      for (const call of listCalls) {
        // Explicit superadmin token wins over the stale default key, and
        // the global auth-expired nuke stays off for role sessions.
        expect(call[1]).toMatchObject({
          authToken: "good-superadmin",
          suppressAuthExpired: true,
        });
      }
    } finally {
      localStorage.removeItem("superadmin_token");
      localStorage.removeItem("token");
    }
  });

  test("DashboardShell deleted the raw student-endpoint fetch and read hedging", () => {
    const shellSrc = fs.readFileSync(
      path.join(
        __dirname,
        "../components/superadmin/client/DashboardShell.tsx",
      ),
      "utf8",
    );
    expect(shellSrc).not.toContain("isRead");
    expect(shellSrc).not.toContain("/notifications?page=");
    expect(shellSrc).not.toContain("/notifications/${id}/read");
    expect(shellSrc).not.toContain("/notifications/read-all");
    expect(shellSrc).toContain("useSuperadminNotifications");

    const sectionSrc = fs.readFileSync(
      path.join(
        __dirname,
        "../components/superadmin/client/NotificationSection.tsx",
      ),
      "utf8",
    );
    expect(sectionSrc).not.toContain("ToggleRow");
    expect(sectionSrc).not.toContain("defaultChecked");
    expect(sectionSrc).toContain("createBroadcast");
  });
});
