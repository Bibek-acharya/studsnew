/**
 * @jest-environment jsdom
 */
import React, { act } from "react";
import fs from "fs";
import path from "path";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AnalyticsSection from "../components/superadmin/client/AnalyticsSection";
import { superadminAnalyticsApi } from "../services/superadminAnalyticsApi";

jest.mock("../services/superadminAnalyticsApi", () => ({
  superadminAnalyticsApi: {
    getUsers: jest.fn(),
    getFunnel: jest.fn(),
    getSupply: jest.fn(() => Promise.resolve({ data: null })),
    getOps: jest.fn(() => Promise.resolve({ data: null })),
    getHealth: jest.fn(() => Promise.resolve({ data: null })),
  },
}));

jest.mock("next/navigation", () => ({
  usePathname: () => "/superadmin",
  useRouter: () => ({ push: jest.fn() }),
}));

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const mockedApi = superadminAnalyticsApi as unknown as Record<string, jest.Mock>;

const containers: HTMLElement[] = [];
const roots: Root[] = [];

function render() {
  const container = document.createElement("div");
  document.body.appendChild(container);
  containers.push(container);
  const root = createRoot(container);
  roots.push(root);
  act(() => {
    root.render(
      <QueryClientProvider client={new QueryClient()}>
        <AnalyticsSection />
      </QueryClientProvider>,
    );
  });
  return container;
}

beforeEach(() => {
  jest.useFakeTimers();
  Object.values(mockedApi).forEach((fn) => fn.mockReset());
  mockedApi.getUsers.mockResolvedValue({
    data: {
      totals: {
        students: 10, institutions: 2, providers: 1,
        pending_institutions: 1, pending_providers: 0,
        active_7d: 4, activation_pct: 50,
      },
      user_status_breakdown: { active: 10 },
      series: [{ bucket: "2026-09-09", values: { students: 2 } }],
    },
  });
  mockedApi.getFunnel.mockResolvedValue({
    data: {
      totals: { admissions: 3, scholarship_applications: 1, bookings: 2 },
      admission_conversion_pct: 33.33,
      admissions_by_status: { pending: 2, approved: 1 },
      series: [{ bucket: "2026-09-09", values: { "admissions:pending": 2 } }],
    },
  });
});

afterEach(() => {
  while (roots.length) act(() => roots.pop()!.unmount());
  while (containers.length) containers.pop()!.remove();
  jest.useRealTimers();
});

describe("AnalyticsSection", () => {
  test("users panel renders totals and an export button, no mock numbers", async () => {
    const container = render();
    // react-query v5 notifies via setTimeout(0), which stays pending under
    // fake timers — flush timers as well as microtasks.
    await act(async () => {
      await jest.runAllTimersAsync();
    });
    expect(container.textContent).toContain("10");
    expect(container.textContent).toContain("Export CSV");
    expect(container.textContent).not.toContain("+12.5%");
    expect(container.textContent).not.toContain("847");
  });

  test("funnel panel renders conversion and stages", async () => {
    const container = render();
    await act(async () => {
      await jest.runAllTimersAsync();
    });
    expect(container.textContent).toContain("33.33");
  });

  test("401 redirects to the superadmin login", async () => {
    // This jsdom defines window.location as non-configurable, so the brief's
    // Object.defineProperty(window, "location", ...) mock throws here, and a
    // real href assignment surfaces as "Not implemented: navigation" instead
    // of changing href. Here we prove the 401 path attempts a full-page
    // navigation end-to-end; the test below pins the exact target.
    const err = new Error("Unauthorized") as Error & { status: number };
    err.status = 401;
    mockedApi.getUsers.mockRejectedValue(err);
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    try {
      const container = render();
      await act(async () => {
        await jest.runAllTimersAsync();
      });
      const attemptedNavigation = consoleSpy.mock.calls.some((args) =>
        args.some((arg) => String(arg).includes("Not implemented: navigation")),
      );
      expect(attemptedNavigation).toBe(true);
      expect(container.textContent).toContain("Failed to load");
    } finally {
      consoleSpy.mockRestore();
    }
  });

  test("unauthorized redirect targets the superadmin login", () => {
    const src = fs.readFileSync(
      path.join(__dirname, "../components/superadmin/client/analytics/Panel.tsx"),
      "utf8",
    );
    expect(src).toContain('window.location.href = "/superadmin/login"');
  });
});
