/**
 * @jest-environment jsdom
 */
import React, { act } from "react";
import fs from "fs";
import path from "path";
import { createRoot, type Root } from "react-dom/client";
import { apiRequest } from "../services/api";
import EducationNavbar from "../components/navigation/EducationNavbar";

jest.mock("../services/api", () => ({
  apiRequest: jest.fn(),
  apiService: {
    getDashboardStats: jest.fn(() => Promise.resolve({ data: null })),
    getPublicNotifications: jest.fn(() => Promise.resolve({ data: [] })),
  },
  getImageUrl: jest.fn((u: string) => u),
  stripHtml: jest.fn((s: string) => s),
}));

jest.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("../components/SearchBar", () => ({
  SearchBar: () => null,
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
    title: `Inbox title ${id}`,
    body: `Inbox body ${id}`,
    link: "/user/dashboard/applications",
    read_at: null,
    created_at: NOW,
    updated_at: NOW,
    data: null,
    ...overrides,
  };
}

const USER = {
  first_name: "Test",
  last_name: "User",
  email: "t@example.com",
  role: "user",
};

function mockInbox(notifications: unknown[], unreadCount = 1) {
  mockedApiRequest.mockImplementation((requestPath: string) => {
    if (String(requestPath).includes("/unread-count")) {
      return Promise.resolve({ data: { unread_count: unreadCount }, message: "ok" });
    }
    return Promise.resolve({
      data: {
        notifications,
        unread_count: unreadCount,
        meta: { total: notifications.length, page: 1, limit: 50 },
      },
      message: "ok",
    });
  });
}

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

beforeEach(() => {
  jest.useFakeTimers();
  mockedApiRequest.mockReset();
});

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

async function openBell(container: HTMLElement) {
  await act(async () => {});
  const bell = container.querySelector(
    '[aria-label="Notifications"]',
  ) as HTMLElement;
  expect(bell).not.toBeNull();
  act(() => {
    bell.click();
  });
  await act(async () => {});
}

describe("EducationNavbar notification bell", () => {
  test("zero server notifications renders the empty state, never the mocks", async () => {
    mockInbox([], 0);
    const container = render(<EducationNavbar user={USER} />);
    await openBell(container);

    expect(container.textContent).toContain("No notifications");
    expect(container.textContent).not.toContain("Stanford");
    expect(container.textContent).not.toContain("Cornell");
  });

  test("badge equals the server unread count and rows render real items", async () => {
    mockInbox([raw(1), raw(2, { read_at: NOW })], 1);
    const container = render(<EducationNavbar user={USER} />);
    await openBell(container);

    expect(container.textContent).toContain("Inbox title 1");
    expect(container.textContent).toContain("Inbox title 2");
    expect(container.textContent).not.toContain("Stanford");
  });

  test("archive and delete hit the API instead of staying client-only", async () => {
    mockInbox([raw(1)], 1);
    const container = render(<EducationNavbar user={USER} />);
    await openBell(container);

    await act(async () => {
      (container.querySelector('[aria-label="Archive notification"]') as HTMLElement).click();
    });
    expect(mockedApiRequest).toHaveBeenCalledWith("/api/v1/notifications/1/archive", {
      method: "PUT",
    });

    await act(async () => {
      (container.querySelector('[aria-label="Delete notification"]') as HTMLElement).click();
    });
    expect(mockedApiRequest).toHaveBeenCalledWith("/api/v1/notifications/1", {
      method: "DELETE",
    });
  });

  test("archive tab fetches archived=true from the server", async () => {
    mockInbox([raw(1)], 1);
    const container = render(<EducationNavbar user={USER} />);
    await openBell(container);

    const archiveTab = Array.from(container.querySelectorAll("button")).find((b) =>
      b.textContent?.toLowerCase().includes("archive"),
    )!;
    await act(async () => {
      archiveTab.click();
    });
    await act(async () => {});

    expect(
      mockedApiRequest.mock.calls.some((call) =>
        String(call[0]).includes("archived=true"),
      ),
    ).toBe(true);
  });

  test("config mock seed is deleted", () => {
    const src = fs.readFileSync(
      path.join(__dirname, "../components/navigation/config.ts"),
      "utf8",
    );
    expect(src).not.toContain("initialNotifications");
    expect(src).not.toContain("Stanford");
    expect(src).not.toContain("Cornell");
  });
});
