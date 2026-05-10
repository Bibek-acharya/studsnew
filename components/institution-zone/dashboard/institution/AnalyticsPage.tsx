"use client";

import React, { useState, useEffect } from "react";
import { ChartBar, Users, GraduationCap, FileText } from "@phosphor-icons/react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";
import StatCard from "@/components/institution-zone/dashboard/shared/StatCard";

interface ProgramStat {
  id: number;
  name: string;
  status: string;
  entrances: number;
}

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d");
  const [totalApplicants, setTotalApplicants] = useState<number | null>(null);
  const [totalStudents, setTotalStudents] = useState<number | null>(null);
  const [activeEntrances, setActiveEntrances] = useState<number | null>(null);
  const [totalPrograms, setTotalPrograms] = useState<number | null>(null);
  const [programStats, setProgramStats] = useState<ProgramStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const token = localStorage.getItem("institutionToken");
        if (!token) { setLoading(false); return; }

        const authHeaders = { Authorization: `Bearer ${token}` };

        const [dashboardRes, analyticsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/v1/institution/dashboard`, {
            headers: authHeaders,
          }).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/v1/institution/analytics`, {
            headers: authHeaders,
          }).then(r => r.json()),
        ]);

        if (dashboardRes?.success) {
          setTotalStudents(dashboardRes.data.total_students);
          setActiveEntrances(dashboardRes.data.active_entrances);
          setTotalPrograms(dashboardRes.data.total_programs);
        }
        if (analyticsRes?.success) {
          setTotalApplicants(analyticsRes.data.total_applicants);
          setProgramStats(analyticsRes.data.program_stats || []);
        }
      } catch (err) {
        console.error("Failed to load analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatNumber = (n: number | null) => {
    if (n === null || n === undefined) return "—";
    return n.toLocaleString();
  };

  const maxEntrances = Math.max(...programStats.map(p => p.entrances), 1);

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <SectionHeader title="Analytics" breadcrumbItems={[{ label: "Dashboard", href: "/institution-zone/dashboard" }, { label: "Analytics" }]} />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <SectionHeader
        title="Analytics"
        breadcrumbItems={[
          { label: "Dashboard", href: "/institution-zone/dashboard" },
          { label: "Analytics" },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Users weight="fill" />}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          label="Total Students"
          value={formatNumber(totalStudents)}
        />
        <StatCard
          icon={<FileText weight="fill" />}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          label="Total Applicants"
          value={formatNumber(totalApplicants)}
        />
        <StatCard
          icon={<GraduationCap weight="fill" />}
          iconBg="bg-green-50"
          iconColor="text-green-600"
          label="Active Entrances"
          value={formatNumber(activeEntrances)}
          badge={{ label: "Active", color: "green" }}
        />
        <StatCard
          icon={<ChartBar weight="fill" />}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          label="Total Programs"
          value={formatNumber(totalPrograms)}
        />
      </div>

      {programStats.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Program Distribution</h3>
          <div className="space-y-3">
            {programStats.map((program) => (
              <div key={program.id} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-36 truncate">{program.name}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-4">
                  <div
                    className="h-4 rounded-full bg-blue-500 transition-all"
                    style={{ width: `${(program.entrances / maxEntrances) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 w-10 text-right">
                  {program.entrances}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
