"use client";

import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Line } from "react-chartjs-2";
import { superadminAnalyticsApi } from "../../../../services/superadminAnalyticsApi";
import { seriesToCSV, downloadCSV } from "./csv";
import { Panel, Tile, COLORS, redirectOnUnauthorized } from "./Panel";

export default function OpsPanel({ from, to, onNavigate }: { from: string; to: string; onNavigate?: (section: string) => void }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["superadmin-analytics", "ops", from, to],
    queryFn: () => superadminAnalyticsApi.getOps(from, to),
    retry: (failureCount, error) => ((error as { status?: number })?.status === 401 ? false : failureCount < 1),
  });

  useEffect(() => {
    if (error) redirectOnUnauthorized(error);
  }, [error]);

  if (isLoading) {
    return (
      <Panel title="Ops">
        <p className="text-sm text-gray-500">Loading ops analytics…</p>
      </Panel>
    );
  }

  if (error) {
    return (
      <Panel title="Ops">
        <p className="text-sm text-gray-500">Failed to load ops analytics.</p>
      </Panel>
    );
  }

  const ops = data?.data;
  if (!ops) {
    return (
      <Panel title="Ops">
        <p className="text-sm text-gray-500">No ops analytics available.</p>
      </Panel>
    );
  }

  const keys = Array.from(new Set(ops.series.flatMap((p) => Object.keys(p.values)))).sort();
  const statuses = Object.entries(ops.inquiries_by_status);

  return (
    <Panel title="Ops" onExport={() => downloadCSV(`ops-${from}-${to}.csv`, seriesToCSV(ops.series))}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <NavTile label="Forum reports" value={ops.totals.forum_reports} target="manage-campus-feed" onNavigate={onNavigate} />
        <NavTile label="Review reports" value={ops.totals.review_reports} target="university-reviews" onNavigate={onNavigate} />
        <NavTile label="Feedback" value={ops.totals.feedback} target="manage-feedback" onNavigate={onNavigate} />
        <Tile label="Broadcasts" value={ops.totals.broadcasts} />
        <Tile label="Broadcasts failed" value={ops.totals.broadcasts_failed} />
      </div>
      {ops.series.length > 0 ? (
        <div className="mt-4">
          <Line
            data={{
              labels: ops.series.map((p) => p.bucket),
              datasets: keys.map((key, i) => ({
                label: key,
                data: ops.series.map((p) => p.values[key] ?? 0),
                borderColor: COLORS[i % COLORS.length],
                backgroundColor: COLORS[i % COLORS.length],
              })),
            }}
          />
        </div>
      ) : (
        <p className="mt-4 text-sm text-gray-500">No trend data for this range.</p>
      )}
      {statuses.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-900">Inquiries by status</h4>
          <table className="mt-2 w-full text-sm text-gray-700">
            <thead>
              <tr className="text-left text-xs text-gray-500">
                <th className="py-1">Status</th>
                <th className="py-1">Count</th>
              </tr>
            </thead>
            <tbody>
              {statuses.map(([status, count]) => (
                <tr key={status}>
                  <td className="py-1">
                    {onNavigate ? (
                      <button type="button" onClick={() => onNavigate("message-inquiry")} className="hover:text-blue-600 hover:underline">
                        {status}
                      </button>
                    ) : (
                      status
                    )}
                  </td>
                  <td className="py-1">{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {ops.recent_broadcasts.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-900">Recent broadcasts</h4>
          <table className="mt-2 w-full text-sm text-gray-700">
            <thead>
              <tr className="text-left text-xs text-gray-500">
                <th className="py-1">Broadcast</th>
                <th className="py-1">Status</th>
                <th className="py-1">Audience</th>
              </tr>
            </thead>
            <tbody>
              {ops.recent_broadcasts.map((b) => (
                <tr key={b.id}>
                  <td className="py-1">
                    {onNavigate ? (
                      <button type="button" onClick={() => onNavigate("manage-notification")} className="hover:text-blue-600 hover:underline">
                        Broadcast #{b.id}
                      </button>
                    ) : (
                      <>Broadcast #{b.id}</>
                    )}
                  </td>
                  <td className="py-1">{b.status}</td>
                  <td className="py-1">{b.audience}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

function NavTile({ label, value, target, onNavigate }: { label: string; value: string | number; target: string; onNavigate?: (section: string) => void }) {
  if (!onNavigate) return <Tile label={label} value={value} />;
  return (
    <button type="button" onClick={() => onNavigate(target)} className="rounded-lg bg-gray-50 p-3 text-left hover:bg-blue-50">
      <span className="block text-2xl font-bold text-gray-900">{value}</span>
      <span className="mt-1 block text-xs text-gray-500">{label}</span>
    </button>
  );
}
