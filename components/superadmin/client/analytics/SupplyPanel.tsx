"use client";

import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Line } from "react-chartjs-2";
import { superadminAnalyticsApi } from "../../../../services/superadminAnalyticsApi";
import { seriesToCSV, downloadCSV } from "./csv";
import { Panel, redirectOnUnauthorized } from "./Panel";

const COLORS = ["#2563eb", "#16a34a", "#dc2626", "#ca8a04", "#7c3aed", "#0891b2"];

export default function SupplyPanel({ from, to }: { from: string; to: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["superadmin-analytics", "supply", from, to],
    queryFn: () => superadminAnalyticsApi.getSupply(from, to),
  });

  useEffect(() => {
    if (error) redirectOnUnauthorized(error);
  }, [error]);

  if (isLoading) {
    return (
      <Panel title="Supply">
        <p className="text-sm text-gray-500">Loading supply analytics…</p>
      </Panel>
    );
  }

  if (error) {
    return (
      <Panel title="Supply">
        <p className="text-sm text-gray-500">Failed to load supply analytics.</p>
      </Panel>
    );
  }

  const supply = data?.data;
  if (!supply) {
    return (
      <Panel title="Supply">
        <p className="text-sm text-gray-500">No supply analytics available.</p>
      </Panel>
    );
  }

  const keys = Array.from(new Set(supply.series.flatMap((p) => Object.keys(p.values)))).sort();

  return (
    <Panel title="Supply" onExport={() => downloadCSV(`supply-${from}-${to}.csv`, seriesToCSV(supply.series))}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile label="Colleges" value={supply.totals.colleges} />
        <Tile label="Scholarships published" value={supply.totals.scholarships_published} />
        <Tile label="Events" value={supply.totals.events} />
        <Tile label="Blogs" value={supply.totals.blogs} />
        <Tile label="News" value={supply.totals.news} />
      </div>
      {supply.series.length > 0 ? (
        <div className="mt-4">
          <Line
            data={{
              labels: supply.series.map((p) => p.bucket),
              datasets: keys.map((key, i) => ({
                label: key,
                data: supply.series.map((p) => p.values[key] ?? 0),
                borderColor: COLORS[i % COLORS.length],
                backgroundColor: COLORS[i % COLORS.length],
              })),
            }}
          />
        </div>
      ) : (
        <p className="mt-4 text-sm text-gray-500">No trend data for this range.</p>
      )}
      <div className="mt-4">
        <h4 className="text-sm font-semibold text-gray-900">Approval aging</h4>
        <table className="mt-2 w-full text-sm text-gray-700">
          <thead>
            <tr className="text-left text-xs text-gray-500">
              <th className="py-1">Queue</th>
              <th className="py-1">&lt;24h</th>
              <th className="py-1">1–3d</th>
              <th className="py-1">&gt;3d</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-1">Institutions</td>
              <td className="py-1">{supply.approval_aging.institutions.lt_24h}</td>
              <td className="py-1">{supply.approval_aging.institutions.d1_3}</td>
              <td className="py-1">{supply.approval_aging.institutions.gt_3d}</td>
            </tr>
            <tr>
              <td className="py-1">Providers</td>
              <td className="py-1">{supply.approval_aging.providers.lt_24h}</td>
              <td className="py-1">{supply.approval_aging.providers.d1_3}</td>
              <td className="py-1">{supply.approval_aging.providers.gt_3d}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {supply.top_bookmarked.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-900">Top bookmarked</h4>
          <ul className="mt-2 space-y-1 text-sm text-gray-700">
            {supply.top_bookmarked.slice(0, 10).map((item) => (
              <li key={`${item.kind}-${item.id}`}>
                {item.kind} #{item.id} — {item.count}
              </li>
            ))}
          </ul>
        </div>
      )}
      {supply.top_followed.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-900">Top followed</h4>
          <ul className="mt-2 space-y-1 text-sm text-gray-700">
            {supply.top_followed.slice(0, 10).map((item) => (
              <li key={`${item.kind}-${item.id}`}>
                {item.kind} #{item.id} — {item.count}
              </li>
            ))}
          </ul>
        </div>
      )}
      {supply.stale_scholarships.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-900">Stale scholarships</h4>
          <table className="mt-2 w-full text-sm text-gray-700">
            <thead>
              <tr className="text-left text-xs text-gray-500">
                <th className="py-1">Title</th>
                <th className="py-1">Deadline</th>
              </tr>
            </thead>
            <tbody>
              {supply.stale_scholarships.map((s) => (
                <tr key={s.id}>
                  <td className="py-1">{s.title}</td>
                  <td className="py-1">{s.deadline.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

function Tile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-gray-50 p-3">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-xs text-gray-500">{label}</p>
    </div>
  );
}
