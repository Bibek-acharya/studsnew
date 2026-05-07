"use client";

import React, { useState } from "react";
import { ChartBar, Users, GraduationCap, CurrencyDollar, FileText } from "@phosphor-icons/react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";
import StatCard from "@/components/institution-zone/dashboard/shared/StatCard";

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d");

  const trends = {
    "7d": { visitors: "+8%", applications: "+15%", admissions: "+5%", revenue: "+12%" },
    "30d": { visitors: "+22%", applications: "+18%", admissions: "+10%", revenue: "+25%" },
    "90d": { visitors: "+35%", applications: "+28%", admissions: "+16%", revenue: "+40%" },
    "1y": { visitors: "+58%", applications: "+42%", admissions: "+28%", revenue: "+65%" },
  };

  const currentTrend = trends[timeRange];

  const recentActivity = [
    { user: "Emily Johnson", action: "Submitted Application", program: "B.Tech CS", date: "May 06, 2026" },
    { user: "Michael Chen", action: "Completed Admission", program: "BBA", date: "May 05, 2026" },
    { user: "Sarah Williams", action: "Fee Payment Received", program: "M.Sc Physics", date: "May 05, 2026" },
    { user: "David Brown", action: "Document Submitted", program: "BCA", date: "May 04, 2026" },
    { user: "Lisa Park", action: "Application Shortlisted", program: "B.Tech EE", date: "May 03, 2026" },
    { user: "James Wilson", action: "Interview Scheduled", program: "MBA", date: "May 03, 2026" },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <SectionHeader
        title="Analytics"
        breadcrumbItems={[
          { label: "Dashboard", href: "/institution-zone/dashboard" },
          { label: "Analytics" },
        ]}
      />

      <div className="flex items-center gap-2 mb-6">
        {(["7d", "30d", "90d", "1y"] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeRange === range
                ? "bg-blue-600 text-white"
                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Users weight="fill" />}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          label="Total Visitors"
          value="24,521"
          trend={{ value: currentTrend.visitors, positive: true }}
        />
        <StatCard
          icon={<FileText weight="fill" />}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          label="Applications"
          value="2,845"
          trend={{ value: currentTrend.applications, positive: true }}
        />
        <StatCard
          icon={<GraduationCap weight="fill" />}
          iconBg="bg-green-50"
          iconColor="text-green-600"
          label="Admissions"
          value="1,240"
          trend={{ value: currentTrend.admissions, positive: true }}
        />
        <StatCard
          icon={<CurrencyDollar weight="fill" />}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          label="Revenue"
          value="$482K"
          trend={{ value: currentTrend.revenue, positive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Admission Trends</h3>
          <div className="flex items-end justify-between gap-1 h-48 px-2">
            {[
              { month: "Jan", value: 35 },
              { month: "Feb", value: 48 },
              { month: "Mar", value: 28 },
              { month: "Apr", value: 62 },
              { month: "May", value: 75 },
              { month: "Jun", value: 55 },
              { month: "Jul", value: 40 },
              { month: "Aug", value: 68 },
              { month: "Sep", value: 82 },
              { month: "Oct", value: 58 },
              { month: "Nov", value: 45 },
              { month: "Dec", value: 70 },
            ].map((item) => (
              <div key={item.month} className="flex flex-col items-center gap-1 flex-1">
                <div
                  className="w-full bg-blue-500 rounded-t-md transition-all hover:bg-blue-600"
                  style={{ height: `${item.value}%` }}
                />
                <span className="text-xs text-gray-400">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Program Distribution</h3>
          <div className="space-y-3">
            {[
              { name: "B.Tech CS", value: 85, color: "bg-blue-500" },
              { name: "BBA", value: 65, color: "bg-purple-500" },
              { name: "M.Sc Physics", value: 45, color: "bg-green-500" },
              { name: "BCA", value: 55, color: "bg-amber-500" },
              { name: "MBA", value: 35, color: "bg-red-500" },
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-28 truncate">{item.name}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-3">
                  <div className={`h-3 rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                </div>
                <span className="text-sm font-medium text-gray-700 w-10 text-right">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Sources</h3>
          <div className="space-y-4">
            {[
              { source: "Direct", value: 42, color: "bg-blue-500" },
              { source: "Social Media", value: 28, color: "bg-purple-500" },
              { source: "Search Engines", value: 18, color: "bg-green-500" },
              { source: "Referrals", value: 12, color: "bg-amber-500" },
            ].map((item) => (
              <div key={item.source}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.source}</span>
                  <span className="font-medium text-gray-700">{item.value}%</span>
                </div>
                <div className="bg-gray-100 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Recent Analytics Activity</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Program</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentActivity.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-sm font-medium text-gray-800">{row.user}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">{row.action}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">{row.program}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
