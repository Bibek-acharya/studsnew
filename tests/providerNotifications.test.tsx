/**
 * @jest-environment jsdom
 */
import React, { act } from "react";
import fs from "fs";
import path from "path";
import { createRoot, type Root } from "react-dom/client";
import { apiRequest } from "../services/api";
import TopBar from "../components/ScholarshipProvider/layout/TopBar";
import Notifications from "../components/ScholarshipProvider/Notifications";
import { toNotificationItem } from "../features/notifications/types";
import { resolveRoute } from "../features/notifications/routes";

jest.mock("../services/api", () => ({
  apiRequest: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  usePathname: () => "/scholarship-provider/dashboard",
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("sonner", () => ({
  toast: { error: jest.fn(), success: jest.fn() },
  Toaster: () => null,
}));

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const mockedApiRequest = apiRequest as jest.Mock;

const NOW = "2026-09-08T09:00:00Z";

// Shared transition envelope as the unified inbox returns it for provider
// legacy rows: v2 event_key empty, category carried over the old `type`.
function raw(id: number, overrides: Record<string, unknown> = {}) {
  return {
    id,
    event_key: "",
    category: "application",
    priority: "normal",
    title: `Title ${id}`,
    body: `Body ${id}`,
    link: "applications",
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
    category: "scholarship",
    title: "New scholarship",
    link: "manage-scholarships",
  }),
];

beforeEach(() => {
  jest.useFakeTimers();
  mockedApiRequest.mockReset();
  mockedApiRequest.mockImplementation((requestPath: string) => {
    if (String(requestPath).includes("/unread-count")) {
      return Promise.resolve({ data: { unread_count: 2 }, message: "ok" });
    }
    const query = String(requestPath).split("?")[1] ?? "";
    const page = Number(new URLSearchParams(query).get("page") ?? "1");
    return Promise.resolve({
      data: {
        notifications: INBOX,
        unread_count: 2,
        meta: { total: 25, page, limit: 20 },
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

function providerCalls() {
  return mockedApiRequest.mock.calls.filter((call) =>
    String(call[0]).includes("scholarship-provider"),
  );
}

describe("provider notification surfaces", () => {
  test("legacy ProviderNotification shape maps through toNotificationItem", () => {
    // Exact pre-migration ProviderNotification row (message/type/read/link).
    const item = toNotificationItem({
      id: 7,
      title: "New application",
      message: "A student applied",
      type: "application",
      read: false,
      link: "applications",
      created_at: NOW,
    } as unknown as Parameters<typeof toNotificationItem>[0]);
    expect(item.category).toBe("application");
    expect(item.body).toBe("A student applied");
    expect(item.read_at).toBeNull();
    expect(item.event_key).toBe("");
  });

  test("provider bell badge equals server unread_count via the shared client", async () => {
    const container = render(
      <TopBar
        providerUser={{ provider_name: "Acme", role: "Administrator" }}
        unreadMessages={0}
        onNavigate={jest.fn()}
      />,
    );
    await act(async () => {});

    const bellButton = container.querySelector('button[title="Notifications"]')!;
    expect(bellButton.textContent).toContain("2");
    // The dead provider-scoped notification endpoints are never hit.
    expect(providerCalls()).toHaveLength(0);
    expect(
      mockedApiRequest.mock.calls.some((call) =>
        String(call[0]).includes("/api/v1/notifications"),
      ),
    ).toBe(true);
  });

  test("notifications page keeps the pagination contract on the shared client", async () => {
    const container = render(<Notifications />);
    await act(async () => {});

    // First page hits the shared inbox with the preserved page/limit.
    expect(mockedApiRequest).toHaveBeenCalledWith(
      "/api/v1/notifications?page=1&limit=20",
    );
    expect(container.textContent).toContain("Title 1");
    expect(container.textContent).toContain("2 of 25 alerts");

    // Pager advances server-side — never the dead provider endpoint.
    const next = Array.from(container.querySelectorAll("button")).find((b) =>
      b.textContent?.includes("Next"),
    )!;
    await act(async () => {
      next.click();
    });
    expect(mockedApiRequest).toHaveBeenCalledWith(
      "/api/v1/notifications?page=2&limit=20",
    );
    expect(providerCalls()).toHaveLength(0);
  });

  test("provider rows deep-link legacy slugs via routes.ts and mark read individually", async () => {
    const container = render(<Notifications />);
    await act(async () => {});

    const item = Array.from(container.querySelectorAll("a")).find((a) =>
      a.textContent?.includes("Title 1"),
    )!;
    expect(item.getAttribute("href")).toBe(
      resolveRoute("provider", "applications"),
    );

    await act(async () => {
      item.click();
    });
    expect(mockedApiRequest).toHaveBeenCalledWith("/api/v1/notifications/1/read", {
      method: "PUT",
    });
    expect(
      mockedApiRequest.mock.calls.some((call) =>
        String(call[0]).includes("/read-all"),
      ),
    ).toBe(false);
  });

  test("provider legacy slugs all resolve via routes.ts", () => {
    for (const slug of [
      "org-profile",
      "applications",
      "manage-scholarships",
      "sec-dashboard",
      "assign-access",
      "settings",
      "news-directory",
      "events-directory",
      "blog-directory",
      "calendar",
      "interviews",
    ]) {
      expect(resolveRoute("provider", slug)).toBe(
        "/scholarship-provider/dashboard",
      );
    }
  });

  test("provider collateral deleted; no legacy notification imports remain", () => {
    expect(
      fs.existsSync(
        path.join(
          __dirname,
          "../components/ScholarshipProvider/DashboardHeader.tsx",
        ),
      ),
    ).toBe(false);

    for (const file of [
      "../components/ScholarshipProvider/layout/TopBar.tsx",
      "../components/ScholarshipProvider/Notifications.tsx",
    ]) {
      const src = fs.readFileSync(path.join(__dirname, file), "utf8");
      expect(src).not.toContain("scholarshipProviderApi");
      expect(src).not.toContain("scholarship-providers/notifications");
    }
  });
});
