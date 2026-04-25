"use client";

import React from "react";
import { ArrowRight, Users, Percent } from "lucide-react";

export default function AnalyticsSection() {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <InfoTile title="User Growth" value="+12.5%" note="Last 30 days" icon={<TrendingUpIcon />} />
      <InfoTile title="Approval Rate" value="12.5%" note="Of total applications" icon={<Percent className="h-6 w-6 text-slate-400" />} />
      <InfoTile title="Active Users" value="847" note="Last 7 days" icon={<Users className="h-6 w-6 text-slate-400" />} />
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-3">
        <h3 className="text-lg font-bold text-gray-900">Analytics</h3>
        <p className="mt-1 text-sm text-gray-500">Detailed analytics panels can be added here to match the production dashboard.</p>
      </div>
    </div>
  );
}

function InfoTile({
  title,
  value,
  note,
  icon,
}: {
  title: string;
  value: string;
  note: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        {icon}
        <span className="text-2xl font-bold text-gray-900">{value}</span>
      </div>
      <p className="mt-4 text-sm font-semibold text-gray-700">{title}</p>
      <p className="mt-1 text-xs text-gray-500">{note}</p>
    </div>
  );
}

function TrendingUpIcon() {
  return <ArrowRight className="h-6 w-6 rotate-[-45deg] text-slate-400" />;
}
