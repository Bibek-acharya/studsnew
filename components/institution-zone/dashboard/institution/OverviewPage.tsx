"use client";

import React, { useEffect, useRef } from "react";
import {
  GraduationCap,
  HelpCircle,
  Users,
  FileText,
  TrendingUp,
  AlertCircle,
  CalendarCheck,
  Clock,
  RefreshCw,
  Bell,
  CheckCircle2,
  UserPlus,
  BookOpen,
  MessageSquare,
  Award,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Doughnut, Pie, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const OverviewPage: React.FC = () => {
  const calendarDays: (number | null)[] = [
    null,
    null,
    null,
    null,
    null,
    null,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
  ];
  const eventDays = [12, 18, 24];
  const activeDay = 6;

  const admissionData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Admissions",
        data: [185, 220, 310, 280, 360, 420, 390, 450, 510, 480, 530, 490],
        backgroundColor: "rgba(37,99,235,0.7)",
        borderRadius: 6,
      },
    ],
  };

  const qmsData = {
    labels: ["Resolved", "Pending", "Urgent"],
    datasets: [
      {
        data: [145, 48, 12],
        backgroundColor: ["#22c55e", "#f59e0b", "#ef4444"],
        borderWidth: 0,
      },
    ],
  };

  const programData = {
    labels: ["Bachelor", "Master", "+2", "Diploma", "Training"],
    datasets: [
      {
        data: [38, 22, 15, 18, 7],
        backgroundColor: [
          "#6366f1",
          "#22c55e",
          "#f59e0b",
          "#64748b",
          "#8b5cf6",
        ],
        borderWidth: 0,
      },
    ],
  };

  const scholarshipData = {
    labels: ["Merit", "Need-Based", "Sports", "Other"],
    datasets: [
      {
        data: [45, 30, 15, 10],
        backgroundColor: ["#2563eb", "#a855f7", "#ec4899", "#14b8a6"],
        borderWidth: 0,
      },
    ],
  };

  const counsellingData = {
    labels: ["BSc CSIT", "BBA", "BIM", "MBA", "Civil Eng.", "Other"],
    datasets: [
      {
        label: "Sessions",
        data: [42, 38, 25, 20, 18, 13],
        backgroundColor: "rgba(99,102,241,0.7)",
        borderRadius: 6,
      },
    ],
  };

  const entranceData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Applicants",
        data: [120, 145, 200, 180, 220, 195, 240],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#2563eb",
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#f1f5f9" }, ticks: { font: { size: 11 } } },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { font: { size: 11 }, padding: 12 },
      },
    },
    cutout: "65%",
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { font: { size: 11 }, padding: 12 },
      },
    },
  };

  const horizontalBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y" as const,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { display: false } },
      x: { grid: { color: "#f1f5f9" }, ticks: { font: { size: 11 } } },
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#f1f5f9" }, ticks: { font: { size: 11 } } },
    },
  };

  return (
    <div className="p-4 lg:p-8 max-w-400 mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Comprehensive Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time data visualization across all operational modules.
          </p>
        </div>
       
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">
              Total Admissions
            </p>
            <h3 className="text-2xl font-bold text-slate-900 leading-tight">
              2,845
            </h3>
            <p className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12% this year
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">
              Pending Queries
            </p>
            <h3 className="text-2xl font-bold text-slate-900 leading-tight">
              48
            </h3>
            <p className="text-xs font-semibold text-rose-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> 12 urgent
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">
              Counselling Slots
            </p>
            <h3 className="text-2xl font-bold text-slate-900 leading-tight">
              156
            </h3>
            <p className="text-xs font-semibold text-indigo-600 mt-1 flex items-center gap-1">
              <CalendarCheck className="w-3 h-3" /> 89 booked this week
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Upcoming Exams</p>
            <h3 className="text-2xl font-bold text-slate-900 leading-tight">
              08
            </h3>
            <p className="text-xs font-semibold text-amber-500 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Next in 3 days
            </p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Admission Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-blue-600 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" /> Admission
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Monthly enrollment trends
          </p>
          <div className="relative h-55">
            <Bar data={admissionData} options={chartOptions} />
          </div>
        </div>

        {/* QMS Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-amber-600 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" /> QMS Status
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Query resolution breakdown
          </p>
          <div className="relative h-55">
            <Doughnut data={qmsData} options={doughnutOptions} />
          </div>
        </div>

        {/* Program Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-indigo-600 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> Programs
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Distribution by academic level
          </p>
          <div className="relative h-55">
            <Pie data={programData} options={pieOptions} />
          </div>
        </div>

        {/* Scholarship Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-purple-600 flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Scholarships
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">By scholarship category</p>
          <div className="relative h-55">
            <Doughnut data={scholarshipData} options={doughnutOptions} />
          </div>
        </div>

        {/* Counselling Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-indigo-600 flex items-center gap-1.5">
              <Users className="w-4 h-4" /> Counselling
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">Sessions by program</p>
          <div className="relative h-55">
            <Bar data={counsellingData} options={horizontalBarOptions} />
          </div>
        </div>

        {/* Entrance Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-blue-600 flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> Entrance
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Applicant growth this year
          </p>
          <div className="relative h-55">
            <Line data={entranceData} options={lineOptions} />
          </div>
        </div>
      </div>

      {/* Bottom Section: Updates + Calendar + Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Updates */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" /> Recent Updates
          </h3>
          <ul className="space-y-3">
            {[
              {
                icon: <UserPlus className="w-4 h-4 text-emerald-600" />,
                text: "15 new admissions registered",
                time: "2h ago",
                bg: "bg-emerald-50",
              },
              {
                icon: <HelpCircle className="w-4 h-4 text-amber-600" />,
                text: "3 urgent queries need response",
                time: "4h ago",
                bg: "bg-amber-50",
              },
              {
                icon: <CheckCircle2 className="w-4 h-4 text-blue-600" />,
                text: "Scholarship allocations updated",
                time: "1d ago",
                bg: "bg-blue-50",
              },
              {
                icon: <MessageSquare className="w-4 h-4 text-indigo-600" />,
                text: "New counselling request pending",
                time: "2d ago",
                bg: "bg-indigo-50",
              },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full ${item.bg} flex items-center justify-center shrink-0`}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm text-slate-700">{item.text}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-blue-600" /> March 2026
          </h3>
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {calendarDays.map((day, i) => {
              if (day === null) return <div key={i} />;
              const isActive = day === activeDay;
              const hasEvent = eventDays.includes(day);
              return (
                <div
                  key={i}
                  className={`aspect-square flex flex-col items-center justify-center rounded-full cursor-pointer transition-all relative ${
                    isActive
                      ? "bg-blue-600 text-white font-bold"
                      : "hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  {day}
                  {hasEvent && (
                    <span
                      className={`absolute bottom-0.5 w-1 h-1 rounded-full ${isActive ? "bg-white" : "bg-rose-500"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 space-y-2">
            {[
              {
                day: 12,
                label: "Entrance Results",
                color: "bg-rose-100 text-rose-700",
              },
              {
                day: 18,
                label: "Counselling Day",
                color: "bg-indigo-100 text-indigo-700",
              },
              {
                day: 24,
                label: "Scholarship Deadline",
                color: "bg-amber-100 text-amber-700",
              },
            ].map((ev) => (
              <div
                key={ev.day}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${ev.color}`}
              >
                <span className="font-bold">Mar {ev.day}</span> — {ev.label}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600" /> Recent Activities
          </h3>
          <ol className="relative border-l border-slate-200 ml-2 space-y-4">
            {[
              {
                time: "9:30 AM",
                text: "Admission form submitted by Rahul Sharma (BSc CSIT)",
                color: "bg-blue-500",
              },
              {
                time: "11:00 AM",
                text: "Counselling slot booked by Priya Singh for BBA",
                color: "bg-indigo-500",
              },
              {
                time: "1:15 PM",
                text: "QMS query #48 escalated to urgent",
                color: "bg-amber-500",
              },
              {
                time: "3:00 PM",
                text: "New scholarship posted: Merit Excellence 2026",
                color: "bg-emerald-500",
              },
              {
                time: "4:30 PM",
                text: "News published: Mid-term exam schedule updated",
                color: "bg-rose-500",
              },
            ].map((act, i) => (
              <li key={i} className="ml-4">
                <span
                  className={`absolute -left-1.5 w-3 h-3 rounded-full shrink-0 ${act.color}`}
                />
                <p className="text-xs text-slate-400">{act.time}</p>
                <p className="text-sm text-slate-700 mt-0.5">{act.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Studsphere Support Banner */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div>
          <h3 className="text-lg font-bold">Need Help with Studsphere?</h3>
          <p className="text-blue-100 text-sm mt-1">
            Our support team is available Mon–Fri, 9am–6pm. Contact us for
            onboarding, data issues, or feature requests.
          </p>
        </div>
        <button className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow shrink-0">
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default OverviewPage;
