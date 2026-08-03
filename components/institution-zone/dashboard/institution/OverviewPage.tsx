"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  FileText,
  GraduationCap,
  MessageSquare,
  ClipboardList,
  Calendar,
} from "lucide-react";
import SectionHeader from "../shared/SectionHeader";
import StatCard from "../shared/StatCard";
import CalendarWidget from "../shared/CalendarWidget";

const OverviewPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<{
    total_programs: number;
    total_students: number;
    active_students: number;
    active_entrances: number;
    pending_bookings: number;
    unread_messages: number;
    active_programs: number;
  } | null>(null);
  const [institutionName, setInstitutionName] = useState("");
  const [loading, setLoading] = useState(true);
  const [recentAdmissions, setRecentAdmissions] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const token = localStorage.getItem("institutionToken");
      if (!token) {
        setLoading(false);
        return;
      }

      const authHeaders = { Authorization: `Bearer ${token}` };

      const [dashboardRes, profileRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/v1/institution/dashboard`, {
          headers: authHeaders,
        }).then(r => r.json()),
        fetch(`${API_BASE_URL}/api/v1/institution/profile`, {
          headers: authHeaders,
        }).then(r => r.json()),
      ]);

      if (dashboardRes?.success) setDashboardData(dashboardRes.data);
      if (profileRes?.success) setInstitutionName(profileRes.data?.institution_name || "");

      try {
        const admissionsRes = await fetch(`${API_BASE_URL}/api/v1/institution/admissions`, {
          headers: authHeaders,
        }).then(r => r.json());
        if (admissionsRes?.success && Array.isArray(admissionsRes.data)) {
          setRecentAdmissions(admissionsRes.data.slice(0, 4));
        }
      } catch {}
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 30000);

    const handleDataChanged = () => fetchData();
    window.addEventListener("institution-data-changed", handleDataChanged);

    return () => {
      clearInterval(interval);
      window.removeEventListener("institution-data-changed", handleDataChanged);
    };
  }, [fetchData]);

  const formatNumber = (n: number | undefined | null) => {
    if (n === undefined || n === null) return "—";
    return n.toLocaleString();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <SectionHeader title="Dashboard" breadcrumbItems={[{ label: "Dashboard" }, { label: "Overview" }]} />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <SectionHeader
        title="Dashboard"
        breadcrumbItems={[
          { label: "Dashboard" },
          { label: "Overview" },
        ]}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-2/3 xl:w-8/12 flex flex-col gap-6">
          <div className="relative w-full h-[200px] bg-[#0000ff] rounded-xl overflow-hidden flex items-center">
            <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-white opacity-[0.04] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="absolute top-0 right-0 w-[180px] h-[180px] bg-white opacity-[0.05] rounded-full translate-x-1/4 -translate-y-1/4 pointer-events-none" />
            <div className="absolute -right-[100px] top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/40 rounded-full pointer-events-none" />
            <div className="absolute right-4 bottom-0 w-[260px] h-[200px] pointer-events-none">
              <img src="/hello.svg" alt="" className="w-full h-full object-contain" />
            </div>
            <div className="relative z-10 px-6 md:px-10 flex flex-col items-start w-full md:max-w-[55%]">
              <div className="flex items-center gap-2 text-white/70 text-xs font-medium mb-5 bg-white/50 px-3 py-1 rounded-full backdrop-blur-sm">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })} {new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase()}</span>
              </div>
              <h1 className="text-white text-xl md:text-2xl leading-tight font-bold tracking-wide mb-1">
                {getGreeting()}{institutionName ? `, ${institutionName}` : ""} 👋
              </h1>
              <p className="text-[#cbd0fa] text-sm md:text-md font-medium">
                Welcome to your College Dashboard
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-6">
            <StatCard
              icon={<Users size={24} />}
              iconBg="bg-blue-50"
              iconColor="text-blue-600"
              label="Total Students"
              value={formatNumber(dashboardData?.total_students)}
              trend={{ value: "All time", positive: true }}
            />
            <StatCard
              icon={<Users size={24} />}
              iconBg="bg-green-50"
              iconColor="text-green-600"
              label="Active Students"
              value={formatNumber(dashboardData?.active_students)}
              trend={{ value: "This Year", positive: true }}
            />
            <StatCard
              icon={<FileText size={24} />}
              iconBg="bg-indigo-50"
              iconColor="text-indigo-600"
              label="Total Programs"
              value={formatNumber(dashboardData?.total_programs)}
            />
            <StatCard
              icon={<ClipboardList size={24} />}
              iconBg="bg-amber-50"
              iconColor="text-amber-600"
              label="Active Entrances"
              value={formatNumber(dashboardData?.active_entrances)}
              badge={{ label: "Active", color: "green" }}
            />
            <StatCard
              icon={<Calendar size={24} />}
              iconBg="bg-orange-50"
              iconColor="text-orange-600"
              label="Pending Bookings"
              value={formatNumber(dashboardData?.pending_bookings)}
              badge={{ label: "Pending", color: "yellow" }}
            />
            <StatCard
              icon={<MessageSquare size={24} />}
              iconBg="bg-purple-50"
              iconColor="text-purple-600"
              label="Unread Messages"
              value={formatNumber(dashboardData?.unread_messages)}
              badge={{ label: "Unread", color: "red" }}
            />
            <StatCard
              icon={<GraduationCap size={24} />}
              iconBg="bg-red-50"
              iconColor="text-red-600"
              label="Active Programs"
              value={formatNumber(dashboardData?.active_programs)}
              badge={{ label: "Active", color: "green" }}
            />
          </div>

          {recentAdmissions.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Recent Admissions</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Student</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Course</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentAdmissions.map((admission: any, i: number) => (
                      <tr key={admission.id || i} className="hover:bg-gray-50">
                        <td className="px-5 py-3 text-sm font-medium text-gray-900">
                          {admission.student_name || "—"}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-600">
                          {admission.program_name || "—"}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            admission.status === "confirmed" || admission.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : admission.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}>
                            {admission.status || "—"}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-500">
                          {admission.created_at ? new Date(admission.created_at).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="w-full lg:w-1/3 xl:w-4/12 flex flex-col gap-6">
          <CalendarWidget eventDays={[]} />
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
