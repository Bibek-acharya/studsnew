"use client";

import React, { useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
import UserPanel from "./analytics/UserPanel";
import FunnelPanel from "./analytics/FunnelPanel";
import SupplyPanel from "./analytics/SupplyPanel";
import OpsPanel from "./analytics/OpsPanel";
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
        <HealthPanel />
      </div>
    </div>
  );
}
