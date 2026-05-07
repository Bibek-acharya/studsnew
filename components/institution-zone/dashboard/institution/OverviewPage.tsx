"use client";
import React from "react";
import {
  FileText,
  GraduationCap,
  Users,
  ChatCircleText,
  ClipboardText,
  CalendarBlank,
  CalendarDots,
} from "@phosphor-icons/react";
import SectionHeader from "../shared/SectionHeader";
import StatCard from "../shared/StatCard";
import CalendarWidget from "../shared/CalendarWidget";

const recentAdmissions = [
  {
    name: "Emily Johnson",
    avatar: "https://i.pravatar.cc/150?img=1",
    course: "B.Tech Computer Science",
    status: "Confirmed",
    statusColor: "bg-green-100 text-green-700",
    date: "May 1, 2026",
  },
  {
    name: "Michael Chen",
    avatar: "https://i.pravatar.cc/150?img=2",
    course: "BBA",
    status: "Pending",
    statusColor: "bg-yellow-100 text-yellow-700",
    date: "Apr 30, 2026",
  },
  {
    name: "Sarah Williams",
    avatar: "https://i.pravatar.cc/150?img=3",
    course: "M.Sc Physics",
    status: "Confirmed",
    statusColor: "bg-green-100 text-green-700",
    date: "Apr 28, 2026",
  },
  {
    name: "David Brown",
    avatar: "https://i.pravatar.cc/150?img=4",
    course: "BCA",
    status: "Pending",
    statusColor: "bg-yellow-100 text-yellow-700",
    date: "Apr 25, 2026",
  },
];

const recentActivities = [
  {
    icon: <FileText weight="fill" className="text-blue-600 text-sm" />,
    bg: "bg-blue-50",
    title: "New student admitted",
    desc: "Emily Johnson • 2 hours ago",
  },
  {
    icon: <GraduationCap weight="fill" className="text-green-600 text-sm" />,
    bg: "bg-green-50",
    title: "Fee payment received",
    desc: "$2,500 • 5 hours ago",
  },
  {
    icon: <FileText weight="fill" className="text-purple-600 text-sm" />,
    bg: "bg-purple-50",
    title: "Grade submitted",
    desc: "B.Tech CS Year 1 • 1 day ago",
  },
  {
    icon: <CalendarBlank weight="fill" className="text-yellow-600 text-sm" />,
    bg: "bg-yellow-50",
    title: "Event created",
    desc: "Annual Sports Day • 2 days ago",
  },
  {
    icon: <GraduationCap weight="fill" className="text-red-600 text-sm" />,
    bg: "bg-red-50",
    title: "Book issued",
    desc: "Data Structures • 3 days ago",
  },
];

const OverviewPage: React.FC = () => {
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
        {/* Left Column */}
        <div className="w-full lg:w-2/3 xl:w-8/12 flex flex-col gap-6">
          {/* Banner Card */}
          <div className="relative w-full h-[200px] bg-[#0000ff] rounded-xl overflow-hidden flex items-center">
            <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-white opacity-[0.04] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="absolute top-0 right-0 w-[180px] h-[180px] bg-white opacity-[0.05] rounded-full translate-x-1/4 -translate-y-1/4 pointer-events-none" />
            <div className="absolute -right-[100px] top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/40 rounded-full pointer-events-none" />
            <div className="absolute right-4 bottom-0 w-[260px] h-[200px] pointer-events-none">
              <img src="/hello.svg" alt="" className="w-full h-full object-contain" />
            </div>
            <div className="relative z-10 px-6 md:px-10 flex flex-col items-start w-full md:max-w-[55%]">
              <div className="flex items-center gap-2 text-white/70 text-xs font-medium mb-5 bg-white/50 px-3 py-1 rounded-full backdrop-blur-sm">
                <CalendarDots className="w-3.5 h-3.5" />
                <span>{new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })} {new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase()}</span>
              </div>
              <h1 className="text-white text-xl md:text-2xl leading-tight font-bold tracking-wide mb-1">
                Good morning, KIST College 👋
              </h1>
              <p className="text-[#cbd0fa] text-sm md:text-md font-medium">
                Welcome to your College Dashboard
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-6">
            <StatCard
              icon={<FileText weight="fill" />}
              iconBg="bg-blue-50"
              iconColor="text-blue-600"
              label="Total Application Received"
              value="2,845"
              trend={{ value: "+12%", positive: true }}
            />
            <StatCard
              icon={<GraduationCap weight="fill" />}
              iconBg="bg-green-50"
              iconColor="text-green-600"
              label="Active Scholarship"
              value="24"
              badge={{ label: "Active", color: "green" }}
            />
            <StatCard
              icon={<GraduationCap weight="fill" />}
              iconBg="bg-indigo-50"
              iconColor="text-indigo-600"
              label="Active Admission"
              value="4"
              badge={{ label: "Open", color: "blue" }}
            />
            <StatCard
              icon={<Users weight="fill" />}
              iconBg="bg-purple-50"
              iconColor="text-purple-600"
              label="Total Student Applied"
              value="1,562"
              trend={{ value: "+8%", positive: true }}
            />
            <StatCard
              icon={<ChatCircleText weight="fill" />}
              iconBg="bg-amber-50"
              iconColor="text-amber-600"
              label="Total Message"
              value="89"
              badge={{ label: "3 unread", color: "red" }}
            />
            <StatCard
              icon={<ClipboardText weight="fill" />}
              iconBg="bg-red-50"
              iconColor="text-red-600"
              label="Active Entrance"
              value="06"
              badge={{ label: "Active", color: "green" }}
            />
          </div>

          {/* Recent Admissions Table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Recent Admissions</h3>
              <button className="text-sm text-blue-600 hover:underline">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Student
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Course
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentAdmissions.map((admission, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            className="h-8 w-8 rounded-full"
                            src={admission.avatar}
                            alt=""
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {admission.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600">
                        {admission.course}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${admission.statusColor}`}
                        >
                          {admission.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-500">
                        {admission.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-1/3 xl:w-4/12 flex flex-col gap-6">
          {/* Recent Activities */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Recent Activities</h2>
                <p className="text-xs text-gray-500">Latest updates and actions</p>
              </div>
              <button className="text-sm text-blue-600 hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full ${activity.bg} flex items-center justify-center shrink-0`}
                  >
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {activity.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar */}
          <CalendarWidget eventDays={[5, 12, 18, 24]} />
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
