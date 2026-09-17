"use client";

import React, { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
import { useQuery } from "@tanstack/react-query";
import UserPanel from "./analytics/UserPanel";
import FunnelPanel from "./analytics/FunnelPanel";
import SupplyPanel from "./analytics/SupplyPanel";
import OpsPanel from "./analytics/OpsPanel";
import { Panel, redirectOnUnauthorized } from "./analytics/Panel";
import { superadminAnalyticsApi } from "../../../services/superadminAnalyticsApi";
import HealthPanel from "./analytics/HealthPanel";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

type RangeDays = 7 | 30 | 90;

const RANGES: RangeDays[] = [7, 30, 90];

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function PageVisitsPanel({ from, to }: { from: string; to: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["superadmin-analytics", "pages", from, to],
    queryFn: () => superadminAnalyticsApi.getPages(from, to, "day"),
    retry: (failureCount, err) => ((err as { status?: number })?.status === 401 ? false : failureCount < 1),
  });

  useEffect(() => {
    if (error) redirectOnUnauthorized(error);
  }, [error]);

  if (isLoading) {
    return (
      <Panel title="Page Visits">
        <p className="text-sm text-gray-500">Loading page visit analytics…</p>
      </Panel>
    );
  }

  if (error) {
    const msg =
      (error as { response?: { data?: { error?: string } } })?.response?.data?.error ||
      (error as { message?: string })?.message ||
      "";
    return (
      <Panel title="Page Visits">
        <p className="text-sm text-gray-500">Failed to load page visit analytics.</p>
        {msg && <p className="mt-1 text-xs text-red-500 break-words">{msg}</p>}
      </Panel>
    );
  }

  const pages = data?.data;
  if (!pages) {
    return (
      <Panel title="Page Visits">
        <p className="text-sm text-gray-500">No page visit analytics available.</p>
      </Panel>
    );
  }

  const topPages = Array.isArray(pages.top_pages) ? pages.top_pages : [];
  const maxVisits = topPages[0]?.visits || 1;

  return (
    <Panel title="Page Visits">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-2xl font-bold text-gray-900">{pages.totals?.total_visits ?? 0}</p>
          <p className="mt-1 text-xs text-gray-500">Total visits</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-2xl font-bold text-gray-900">{topPages.length}</p>
          <p className="mt-1 text-xs text-gray-500">Tracked pages</p>
        </div>
      </div>
      {topPages.length > 0 ? (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-900">Top pages</h4>
          <div className="mt-2 space-y-2">
            {topPages.map((p, i) => {
              const width = maxVisits > 0 ? Math.max(4, Math.round((p.visits / maxVisits) * 100)) : 0;
              return (
                <div key={p.path || i} className="flex items-center gap-3">
                  <span className="w-6 shrink-0 text-xs font-bold text-gray-500">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm text-gray-700">{p.path}</span>
                      <span className="shrink-0 text-xs font-semibold text-gray-600">{p.visits}</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-gray-100">
                      <div className="h-1.5 rounded-full bg-blue-600" style={{ width: `${width}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-gray-500">No page visits recorded for this range.</p>
      )}
    </Panel>
  );
}

export default function AnalyticsSection({ onNavigate }: { onNavigate?: (section: string) => void }) {
  const [range, setRange] = useState<RangeDays>(30);

  const to = toISODate(new Date());
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - range);
  const from = toISODate(fromDate);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {RANGES.map((days) => (
          <button
            key={days}
            type="button"
            onClick={() => setRange(days)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              range === days ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {days}d
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <UserPanel from={from} to={to} />
        <FunnelPanel from={from} to={to} />
        <SupplyPanel from={from} to={to} onNavigate={onNavigate} />
        <OpsPanel from={from} to={to} onNavigate={onNavigate} />
        <PageVisitsPanel from={from} to={to} />
        <HealthPanel />
      </div>
    </div>
  );
}
