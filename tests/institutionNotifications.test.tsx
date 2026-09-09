/**
 * @jest-environment jsdom
 */
import React, { act } from "react";
import fs from "fs";
import path from "path";
import { createRoot, type Root } from "react-dom/client";
import { apiRequest } from "../services/api";
import InstitutionLayout from "../components/institution-zone/dashboard/institution/InstitutionLayout";
import NotificationsPage from "../components/institution-zone/dashboard/institution/NotificationsPage";
import { useInstitutionNotifications } from "../components/institution-zone/dashboard/institution/notifications-context";
import { resolveRoute } from "../features/notifications/routes";

jest.mock("../services/api", () => ({
  apiRequest: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  usePathname: () => "/institution-zone/dashboard/notifications",
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
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
    link: "news-directory",
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
    link: "/careers/abc",
  }),
];

function listCalls() {
  return mockedApiRequest.mock.calls.filter((call) =>
    String(call[0]).includes("/notifications?"),
  );
}

const realFetch = global.fetch;

beforeEach(() => {
  jest.useFakeTimers();
  mockedApiRequest.mockReset();
  mockedApiRequest.mockImplementation((requestPath: string) => {
    if (String(requestPath).includes("/unread-count")) {
      return Promise.resolve({ data: { unread_count: 3 }, message: "ok" });
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
  // InstitutionLayout still raw-fetches the profile/access endpoints (not
  // notification scope) — keep them inert under test.
  global.fetch = jest.fn(async () =>
    new Response(JSON.stringify({ data: {} }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
  ) as unknown as typeof fetch;
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
  global.fetch = realFetch;
  jest.useRealTimers();
});

function BellProbe() {
  const { unreadCount } = useInstitutionNotifications();
  return <span data-testid="bell-badge">{unreadCount}</span>;
}

describe("institution notification surfaces", () => {
  test("bell badge equals server unread_count; one shared list fetch; no fabricated counters", async () => {
    const onNavigate = jest.fn();
    const container = render(
      <InstitutionLayout activePage="notification" onNavigate={onNavigate}>
        <NotificationsPage />
        <BellProbe />
      </InstitutionLayout>,
    );
    await act(async () => {});

    // Badge reads the server unread_count through the shared hook instance.
    expect(container.querySelector('[data-testid="bell-badge"]')!.textContent).toBe("3");
    const bellButton = container.querySelector('button[title="Notifications"]')!;
    expect(bellButton.textContent).toContain("3");
    // Bell and page share one provider instance — a single list fetch.
    expect(listCalls()).toHaveLength(1);

    // Fabricated dashboard-counter feed is gone — never synthesized locally.
    expect(container.textContent).not.toContain("Pending Bookings");
    expect(container.textContent).not.toContain("Unread Messages");
    expect(container.textContent).not.toContain("pending counselling bookings");

    // The dead endpoints are never hit: dashboard counters, the nonexistent
    // institution-scoped notification paths, and the conversations mash-in.
    const paths = mockedApiRequest.mock.calls.map((call) => String(call[0]));
    expect(paths.some((p) => p.includes("/institution/dashboard"))).toBe(false);
    expect(paths.some((p) => p.includes("/institution/notifications"))).toBe(false);
    expect(paths.some((p) => p.includes("/conversations"))).toBe(false);
  });

  test("items navigate via routes.ts and mark read individually (never read-all)", async () => {
    const container = render(
      <InstitutionLayout activePage="notification" onNavigate={jest.fn()}>
        <NotificationsPage />
      </InstitutionLayout>,
    );
    await act(async () => {});

    const item = Array.from(container.querySelectorAll("a")).find((a) =>
      a.textContent?.includes("Title 1"),
    )!;
    expect(item.getAttribute("href")).toBe(resolveRoute("institution", "news-directory"));

    await act(async () => {
      item.click();
    });
    expect(mockedApiRequest).toHaveBeenCalledWith("/api/v1/notifications/1/read", {
      method: "PUT",
    });
    // Per-item read must NOT fan out to the read-all endpoint (the old bug).
    expect(
      mockedApiRequest.mock.calls.some((call) =>
        String(call[0]).includes("/read-all"),
      ),
    ).toBe(false);
  });

  test("mark-all-read hits the shared read-all endpoint", async () => {
    const container = render(
      <InstitutionLayout activePage="notification" onNavigate={jest.fn()}>
        <NotificationsPage />
      </InstitutionLayout>,
    );
    await act(async () => {});

    const markAll = Array.from(container.querySelectorAll("button")).find((b) =>
      b.textContent?.includes("Mark All Read"),
    )!;
    await act(async () => {
      markAll.click();
    });
    expect(mockedApiRequest).toHaveBeenCalledWith("/api/v1/notifications/read-all", {
      method: "PUT",
    });
  });

  test("institution source deleted the synthetic logic and dead endpoints", () => {
    const layoutSrc = fs.readFileSync(
      path.join(
        __dirname,
        "../components/institution-zone/dashboard/institution/InstitutionLayout.tsx",
      ),
      "utf8",
    );
    expect(layoutSrc).not.toContain("pending_bookings");
    expect(layoutSrc).not.toContain("unread_messages");
    expect(layoutSrc).not.toContain("institution/notifications/read-all");
    expect(layoutSrc).not.toContain("/institution/dashboard");
    expect(layoutSrc).not.toContain("institution-notifications-read");

    const pageSrc = fs.readFileSync(
      path.join(
        __dirname,
        "../components/institution-zone/dashboard/institution/NotificationsPage.tsx",
      ),
      "utf8",
    );
    expect(pageSrc).not.toContain("/conversations");
    expect(pageSrc).not.toContain("pending-bookings");
    expect(pageSrc).not.toContain("institution/notifications");
    expect(pageSrc).not.toContain("dangerouslySetInnerHTML");
  });
});
