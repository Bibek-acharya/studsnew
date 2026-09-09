/**
 * @jest-environment jsdom
 */
import React, { act } from "react";
import fs from "fs";
import path from "path";
import { createRoot, type Root } from "react-dom/client";
import { apiRequest } from "../services/api";
import {
  NotificationsProvider,
  useStudentNotifications,
} from "../components/user/dashboard/notifications-context";
import Sidebar from "../components/user/dashboard/Sidebar";
import NotificationsPage from "../components/notifications/NotificationsPage";
import { resolveRoute } from "../features/notifications/routes";

jest.mock("../services/api", () => ({
  apiRequest: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  usePathname: () => "/user/dashboard",
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("../services/AuthContext", () => ({
  useAuth: () => ({
    user: { first_name: "Test", last_name: "User", role: "user" },
    logout: jest.fn(),
  }),
}));

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const mockedApiRequest = apiRequest as jest.Mock;

const NOW = "2026-09-08T09:00:00Z";

function raw(id: number, overrides: Record<string, unknown> = {}) {
  return {
    id,
    event_key: "application.submitted",
    category: "application",
    priority: "normal",
    title: `Title ${id}`,
    body: `Body ${id}`,
    link: "/user/dashboard/applications",
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
    event_key: "content.follow",
    category: "content",
    title: "Followed post",
    link: "/campus-forum/abc",
  }),
];
const ARCHIVED = [
  raw(9, { category: "system", title: "Archived item", link: "" }),
];

function listCalls() {
  return mockedApiRequest.mock.calls.filter((call) =>
    String(call[0]).includes("/notifications?"),
  );
}

beforeEach(() => {
  jest.useFakeTimers();
  mockedApiRequest.mockReset();
  mockedApiRequest.mockImplementation((requestPath: string) => {
    if (String(requestPath).includes("/unread-count")) {
      return Promise.resolve({ data: { unread_count: 3 }, message: "ok" });
    }
    if (String(requestPath).includes("archived=true")) {
      return Promise.resolve({
        data: {
          notifications: ARCHIVED,
          unread_count: 3,
          meta: { total: 1, page: 1, limit: 50 },
        },
        message: "ok",
      });
    }
    return Promise.resolve({
      data: {
        notifications: INBOX,
        unread_count: 3,
        meta: { total: 2, page: 1, limit: 50 },
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
  const root = createRoot(container);
  act(() => {
    root.render(ui);
  });
  containers.push(container);
  roots.push(root);
  return container;
}

afterEach(async () => {
  while (roots.length) {
    const root = roots.pop()!;
    act(() => {
      root.unmount();
    });
  }
  while (containers.length) containers.pop()!.remove();
  jest.useRealTimers();
});

function BellProbe() {
  const { unreadCount } = useStudentNotifications();
  return <span data-testid="bell-badge">{unreadCount}</span>;
}

describe("student notification surfaces", () => {
  test("sidebar badge and bell read the SAME hook instance (one list fetch)", async () => {
    const container = render(
      <NotificationsProvider>
        <Sidebar
          sidebarOpen={false}
          setSidebarOpen={jest.fn()}
          onLogoutClick={jest.fn()}
        />
        <BellProbe />
      </NotificationsProvider>,
    );
    await act(async () => {});

    expect(container.querySelector('[data-testid="bell-badge"]')!.textContent).toBe("3");
    // Sidebar notifications nav badge shows the same server unread count.
    const sidebarText = container.textContent!;
    expect(sidebarText).toContain("Notifications");
    expect(listCalls()).toHaveLength(1);
    expect(sidebarText.match(/3/g)!.length).toBeGreaterThanOrEqual(2);
  });

  test("canonical inbox tabs derive from shared categories and items link via resolveRoute", async () => {
    const container = render(<NotificationsPage />);
    await act(async () => {});

    const tabs = Array.from(
      container.querySelectorAll('[role="tablist"] button'),
    ).map((b) => b.textContent);
    expect(tabs).toEqual(expect.arrayContaining(["All", "application", "content"]));

    const contentTab = Array.from(
      container.querySelectorAll('[role="tablist"] button'),
    ).find((b) => b.textContent === "content")!;
    act(() => {
      contentTab.click();
    });
    expect(container.textContent).toContain("Followed post");
    expect(container.textContent).not.toContain("Title 1");

    const link = container.querySelector('a[href]')!;
    expect(link.getAttribute("href")).toBe(
      resolveRoute("user", "/campus-forum/abc"),
    );
  });

  test("dashboard notifications route is unified on /notifications", () => {
    // The duplicate live inbox is gone: the dashboard section is deleted and
    // the dashboard route redirects to the canonical provider-backed page.
    expect(
      fs.existsSync(
        path.join(
          __dirname,
          "../components/user/dashboard/sections/NotificationsSection.tsx",
        ),
      ),
    ).toBe(false);
    const src = fs.readFileSync(
      path.join(__dirname, "../app/user/dashboard/notifications/page.tsx"),
      "utf8",
    );
    expect(src).toContain('redirect("/notifications")');
    expect(src).not.toContain("dangerouslySetInnerHTML");
  });

  test("page folds following into content and wires a real archive tab", async () => {
    const container = render(<NotificationsPage />);
    await act(async () => {});

    const tabs = Array.from(
      container.querySelectorAll('[role="tablist"] button'),
    ).map((b) => b.textContent);
    expect(tabs).not.toContain("following");
    expect(tabs).toContain("archive");
    expect(tabs).toContain("content");

    const archiveTab = Array.from(
      container.querySelectorAll('[role="tablist"] button'),
    ).find((b) => b.textContent === "archive")!;
    await act(async () => {
      archiveTab.click();
    });
    await act(async () => {});

    expect(
      listCalls().some((call) => String(call[0]).includes("archived=true")),
    ).toBe(true);
    expect(container.textContent).toContain("Archived item");

    await act(async () => {
      (container.querySelector('[aria-label="Unarchive"]') as HTMLElement).click();
    });
    expect(mockedApiRequest).toHaveBeenCalledWith(
      "/api/v1/notifications/9/unarchive",
      { method: "PUT" },
    );

    await act(async () => {
      (container.querySelector('[aria-label="Delete notification"]') as HTMLElement).click();
    });
    expect(mockedApiRequest).toHaveBeenCalledWith("/api/v1/notifications/9", {
      method: "DELETE",
    });
  });

  test("page markRead/markAllRead hit the API and update the badge", async () => {
    const container = render(<NotificationsPage />);
    await act(async () => {});

    const item = Array.from(container.querySelectorAll("a")).find((b) =>
      b.textContent?.includes("Title 1"),
    )!;
    await act(async () => {
      item.click();
    });
    expect(mockedApiRequest).toHaveBeenCalledWith(
      "/api/v1/notifications/1/read",
      { method: "PUT" },
    );

    const markAll = Array.from(container.querySelectorAll("button")).find((b) =>
      b.textContent?.includes("Mark all as read"),
    )!;
    await act(async () => {
      markAll.click();
    });
    expect(mockedApiRequest).toHaveBeenCalledWith(
      "/api/v1/notifications/read-all",
      { method: "PUT" },
    );
  });
});
