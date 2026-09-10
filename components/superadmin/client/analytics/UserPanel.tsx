"use client";

import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Line } from "react-chartjs-2";
import { superadminAnalyticsApi } from "../../../../services/superadminAnalyticsApi";
import { seriesToCSV, downloadCSV } from "./csv";
import { Panel, Tile, COLORS, redirectOnUnauthorized } from "./Panel";

export default function UserPanel({ from, to }: { from: string; to: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["superadmin-analytics", "users", from, to],
    queryFn: () => superadminAnalyticsApi.getUsers(from, to),
    retry: (failureCount, error) => ((error as { status?: number })?.status === 401 ? false : failureCount < 1),
  });

  useEffect(() => {
    if (error) redirectOnUnauthorized(error);
  }, [error]);

  if (isLoading) {
    return (
      <Panel title="Users">
        <p className="text-sm text-gray-500">Loading users analytics…</p>
      </Panel>
    );
  }

  if (error) {
    return (
      <Panel title="Users">
        <p className="text-sm text-gray-500">Failed to load users analytics.</p>
      </Panel>
    );
  }

  const users = data?.data;
  if (!users) {
    return (
      <Panel title="Users">
        <p className="text-sm text-gray-500">No user analytics available.</p>
      </Panel>
    );
  }

  const keys = Array.from(new Set(users.series.flatMap((p) => Object.keys(p.values)))).sort();
  const statuses = Object.entries(users.user_status_breakdown ?? {}).sort((a, b) => b[1] - a[1]);
  const statusTotal = statuses.reduce((sum, [, count]) => sum + count, 0);

  return (
    <Panel title="Users" onExport={() => downloadCSV(`users-${from}-${to}.csv`, seriesToCSV(users.series))}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile label="Students" value={users.totals.students} />
        <Tile label="Institutions" value={users.totals.institutions} />
        <Tile label="Providers" value={users.totals.providers} />
        <Tile label="Active (7d)" value={users.totals.active_7d} />
        <Tile label="Pending institutions" value={users.totals.pending_institutions} />
        <Tile label="Pending providers" value={users.totals.pending_providers} />
        <Tile label="Activation" value={`${users.totals.activation_pct}%`} />
      </div>
      {statuses.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-900">Status breakdown</h4>
          <div className="mt-2 space-y-1">
            {statuses.map(([status, count]) => (
              <div key={status} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="w-24 truncate">{status}</span>
                <div className="h-2 flex-1 rounded bg-gray-100">
                  <div
                    className="h-2 rounded bg-blue-600"
                    style={{ width: `${statusTotal ? (count / statusTotal) * 100 : 0}%` }}
                  />
                </div>
                <span className="w-12 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {users.series.length > 0 ? (
        <div className="mt-4">
          <Line
            data={{
              labels: users.series.map((p) => p.bucket),
              datasets: keys.map((key, i) => ({
                label: key,
                data: users.series.map((p) => p.values[key] ?? 0),
                borderColor: COLORS[i % COLORS.length],
                backgroundColor: COLORS[i % COLORS.length],
              })),
            }}
          />
        </div>
      ) : (
        <p className="mt-4 text-sm text-gray-500">No trend data for this range.</p>
      )}
    </Panel>
  );
}
