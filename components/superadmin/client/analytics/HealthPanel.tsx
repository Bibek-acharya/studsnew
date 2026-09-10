"use client";

import React, { useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useLiveHealth } from "./useLiveHealth";
import { downloadCSV } from "./csv";
import { Panel, redirectOnUnauthorized } from "./Panel";

export function formatBytes(bytes: number): string {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const val = bytes / Math.pow(1024, i);
  return `${Number.isInteger(val) ? String(val) : val.toFixed(1)} ${units[i]}`;
}

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

export default function HealthPanel() {
  const { snapshot, buffer, loading, error } = useLiveHealth();

  useEffect(() => {
    if (error) redirectOnUnauthorized(error);
  }, [error]);

  if (loading) {
    return (
      <Panel title="Server health">
        <p className="text-sm text-gray-500">Loading server health…</p>
      </Panel>
    );
  }

  if (error) {
    return (
      <Panel title="Server health">
        <p className="text-sm text-gray-500">Failed to load server health.</p>
      </Panel>
    );
  }

  if (!snapshot) {
    return (
      <Panel title="Server health">
        <p className="text-sm text-gray-500">No health data available.</p>
      </Panel>
    );
  }

  const labels = buffer.map((_, i) => String(i + 1));
  const onExport = () => {
    const s = snapshot;
    const csv = [
      "metric,value",
      `uptime_seconds,${s.process.uptime_seconds}`,
      `goroutines,${s.process.goroutines}`,
      `heap_alloc_bytes,${s.process.heap_alloc_bytes}`,
      `heap_sys_bytes,${s.process.heap_sys_bytes}`,
      `pool_open,${s.database.pool_open}`,
      `pool_in_use,${s.database.pool_in_use}`,
      `pool_idle,${s.database.pool_idle}`,
      `pool_wait_count,${s.database.pool_wait_count}`,
      `db_size_bytes,${s.database.size_bytes}`,
      `email_pending,${s.queues.email.pending}`,
      `email_failed,${s.queues.email.failed}`,
      `outbox_pending,${s.queues.outbox_pending}`,
      `server_errors_5xx,${s.api.server_errors_5xx}`,
      `avg_latency_ms,${s.api.avg_latency_ms}`,
    ].join("\n");
    downloadCSV("health-snapshot.csv", csv);
  };

  return (
    <Panel title="Server health" onExport={onExport}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile label="Uptime" value={formatUptime(snapshot.process.uptime_seconds)} />
        <Tile label="DB size" value={formatBytes(snapshot.database.size_bytes)} />
        <Tile label="Pool in-use/open" value={`${snapshot.database.pool_in_use}/${snapshot.database.pool_open}`} />
        <Tile label="Email pending/failed" value={`${snapshot.queues.email.pending}/${snapshot.queues.email.failed}`} />
        <Tile label="Outbox pending" value={snapshot.queues.outbox_pending} />
        <Tile label="5xx errors" value={snapshot.api.server_errors_5xx} />
      </div>
      <p className="mt-3 text-xs text-gray-500">live window — last ~10 min, not history</p>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <h4 className="text-sm font-semibold text-gray-900">Heap (MB)</h4>
          <Line
            data={{
              labels,
              datasets: [{ label: "Heap MB", data: buffer.map((s) => s.process.heap_alloc_bytes / 1048576), borderColor: "#2563eb", backgroundColor: "#2563eb" }],
            }}
          />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900">Goroutines</h4>
          <Line
            data={{
              labels,
              datasets: [{ label: "Goroutines", data: buffer.map((s) => s.process.goroutines), borderColor: "#16a34a", backgroundColor: "#16a34a" }],
            }}
          />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900">Pool in-use</h4>
          <Line
            data={{
              labels,
              datasets: [{ label: "Pool in-use", data: buffer.map((s) => s.database.pool_in_use), borderColor: "#dc2626", backgroundColor: "#dc2626" }],
            }}
          />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900">Avg latency (ms)</h4>
          <Line
            data={{
              labels,
              datasets: [{ label: "Avg latency", data: buffer.map((s) => s.api.avg_latency_ms), borderColor: "#ca8a04", backgroundColor: "#ca8a04" }],
            }}
          />
        </div>
      </div>
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
