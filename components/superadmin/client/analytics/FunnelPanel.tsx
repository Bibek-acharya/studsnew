"use client";

import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bar, Line } from "react-chartjs-2";
import { superadminAnalyticsApi } from "../../../../services/superadminAnalyticsApi";
import { seriesToCSV, downloadCSV } from "./csv";
import { Panel, Tile, COLORS, redirectOnUnauthorized } from "./Panel";

export default function FunnelPanel({ from, to }: { from: string; to: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["superadmin-analytics", "funnel", from, to],
    queryFn: () => superadminAnalyticsApi.getFunnel(from, to),
    retry: (failureCount, error) => ((error as { status?: number })?.status === 401 ? false : failureCount < 1),
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
