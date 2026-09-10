/**
 * @jest-environment jsdom
 */
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HealthPanel from "../components/superadmin/client/analytics/HealthPanel";
import { superadminAnalyticsApi } from "../services/superadminAnalyticsApi";

// jsdom has no canvas: stub out Line so the test pins gauges/note/buffer
// logic instead of chart.js rendering.
jest.mock("react-chartjs-2", () => ({ Line: () => null }));

jest.mock("../services/superadminAnalyticsApi", () => ({
  superadminAnalyticsApi: { getHealth: jest.fn() },
}));

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const mockedGetHealth = superadminAnalyticsApi.getHealth as jest.Mock;

function snapshot(heap: number) {
  return {
    data: {
      process: { uptime_seconds: 3600, goroutines: 24, heap_alloc_bytes: heap, heap_sys_bytes: heap * 2 },
      database: { pool_open: 10, pool_in_use: 3, pool_idle: 7, pool_wait_count: 0, size_bytes: 104857600 },
      queues: { email: { available: true, pending: 2, active: 1, failed: 0 }, outbox_pending: 0 },
      api: { total_requests: 120, server_errors_5xx: 1, avg_latency_ms: 12.5, p95_latency_ms: 40.0, top_endpoints: [] },
    },
  };
}

describe("HealthPanel", () => {
  test("appendBounded caps the rolling buffer", async () => {
    const { appendBounded } = await import(
      "../components/superadmin/client/analytics/useLiveHealth"
    );
    const make = (heap: number) =>
      ({ process: { heap_alloc_bytes: heap } }) as unknown as import(
        "../services/superadminAnalyticsApi"
      ).HealthSnapshot;
    let buf: import("../services/superadminAnalyticsApi").HealthSnapshot[] = [];
    for (let i = 0; i < 45; i++) buf = appendBounded(buf, make(i));
    expect(buf).toHaveLength(40);
    expect(buf[0].process.heap_alloc_bytes).toBe(5);
    expect(buf[39].process.heap_alloc_bytes).toBe(44);
  });

  test("renders gauges and live-window note", async () => {
    mockedGetHealth.mockResolvedValue(snapshot(50_000_000));
    // react-query v5 notifies via setTimeout(0), which needs fake-timer
    // flushing to settle (see tests/superadminAnalyticsSection.test.tsx).
    // NOTE: runAllTimersAsync never terminates here — the panel polls every
    // 15s — so advance a bounded window instead (stays clear of refetch).
    jest.useFakeTimers();
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    try {
      act(() => {
        root.render(
          <QueryClientProvider client={new QueryClient()}>
            <HealthPanel />
          </QueryClientProvider>,
        );
      });
      await act(async () => {
        await jest.advanceTimersByTimeAsync(1000);
      });
      expect(container.textContent).toContain("live window");
      expect(container.textContent).toContain("100 MB");
    } finally {
      act(() => root.unmount());
      container.remove();
      jest.useRealTimers();
    }
  });
});
