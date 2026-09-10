"use client";

import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bar, Line } from "react-chartjs-2";
import { superadminAnalyticsApi } from "../../../../services/superadminAnalyticsApi";
import { seriesToCSV, downloadCSV } from "./csv";
import { Panel, redirectOnUnauthorized } from "./Panel";

const COLORS = ["#2563eb", "#16a34a", "#dc2626", "#ca8a04", "#7c3aed", "#0891b2"];

export default function FunnelPanel({ from, to }: { from: string; to: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["superadmin-analytics", "funnel", from, to],
    queryFn: () => superadminAnalyticsApi.getFunnel(from, to),
  });

  useEffect(() => {
    if (error) redirectOnUnauthorized(error);
  }, [error]);

  if (isLoading) {
    return (
      <Panel title="Funnel">
        <p className="text-sm text-gray-500">Loading funnel analytics…</p>
      </Panel>
    );
  }

  if (error) {
    return (
      <Panel title="Funnel">
        <p className="text-sm text-gray-500">Failed to load funnel analytics.</p>
      </Panel>
    );
  }

  const funnel = data?.data;
  if (!funnel) {
    return (
      <Panel title="Funnel">
        <p className="text-sm text-gray-500">No funnel analytics available.</p>
      </Panel>
    );
  }

  const stages = Object.entries(funnel.admissions_by_status);
  const seriesKeys = Array.from(new Set(funnel.series.flatMap((p) => Object.keys(p.values)))).sort();

  return (
    <Panel title="Funnel" onExport={() => downloadCSV(`funnel-${from}-${to}.csv`, seriesToCSV(funnel.series))}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile label="Admissions" value={funnel.totals.admissions} />
        <Tile label="Scholarship applications" value={funnel.totals.scholarship_applications} />
        <Tile label="Bookings" value={funnel.totals.bookings} />
        <Tile label="Admission conversion" value={`${funnel.admission_conversion_pct}%`} />
      </div>
      {stages.length > 0 && (
        <div className="mt-4">
          <Bar
            data={{
              labels: stages.map(([stage]) => stage),
              datasets: [
                {
                  label: "Admissions by status",
                  data: stages.map(([, count]) => count),
                  backgroundColor: COLORS[0],
                },
              ],
            }}
          />
        </div>
      )}
      {funnel.series.length > 0 ? (
        <div className="mt-4">
          <Line
            data={{
              labels: funnel.series.map((p) => p.bucket),
              datasets: seriesKeys.map((key, i) => ({
                label: key,
                data: funnel.series.map((p) => p.values[key] ?? 0),
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

function Tile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-gray-50 p-3">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-xs text-gray-500">{label}</p>
    </div>
  );
}
