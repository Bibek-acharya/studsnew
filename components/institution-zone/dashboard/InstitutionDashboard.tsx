"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  LayoutDashboard,
  GraduationCap,
  HelpCircle,
  BookOpen,
  Award,
  Building2,
  Users,
  FileText,
  Megaphone,
  Calendar,
  Mail,
  Settings,
  LogOut,
  ChevronDown,
  X,
  Menu,
  Search,
  Bell,
  RefreshCw,
  TrendingUp,
  AlertCircle,
  CalendarCheck,
  Clock,
  ArrowRight,
  CalendarDays,
  BellRing,
  PhoneCall,
  ChevronLeft,
  ChevronRight,
  Phone,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Bar, Doughnut, Pie, Line } from "react-chartjs-2";

// Register ChartJS components
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

import ProgramManagement from "./ProgramManagement";

const InstitutionDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dropdowns, setDropdowns] = useState({
    admission: false,
    scholarship: false,
    counselling: false,
    entrance: false,
  });

  const toggleDropdown = (id: keyof typeof dropdowns) => {
    setDropdowns((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Admission Chart Data
  const admissionData = {
    labels: ["+2 Level", "Bachelor", "Master", "Diploma"],
    datasets: [
      {
        label: "Enrolled Students",
        data: [450, 820, 210, 150],
        backgroundColor: ["#93c5fd", "#3b82f6", "#1e40af", "#bfdbfe"],
        borderRadius: 6,
        barPercentage: 0.6,
      },
    ],
  };

  // QMS Chart Data
  const qmsData = {
    labels: ["Resolved", "Pending", "Unassigned"],
    datasets: [
      {
        data: [145, 42, 18],
        backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
        borderWidth: 2,
        borderColor: "#ffffff",
        hoverOffset: 4,
      },
    ],
  };

  // Program Chart Data
  const programData = {
    labels: ["Science & IT", "Management", "Humanities", "Law"],
    datasets: [
      {
        data: [40, 35, 15, 10],
        backgroundColor: ["#8b5cf6", "#a78bfa", "#c4b5fd", "#ede9fe"],
        borderWidth: 2,
        borderColor: "#ffffff",
        hoverOffset: 4,
      },
    ],
  };

  // Scholarship Chart Data
  const scholarshipData = {
    labels: ["Merit-Based", "Need-Based", "Sports", "Staff Quota"],
    datasets: [
      {
        data: [55, 25, 12, 8],
        backgroundColor: ["#059669", "#34d399", "#6ee7b7", "#d1fae5"],
        borderWidth: 2,
        borderColor: "#ffffff",
        hoverOffset: 4,
      },
    ],
  };

  // Counselling Chart Data
  const counsellingData = {
    labels: ["Booked", "Available", "Completed", "Cancelled"],
    datasets: [
      {
        label: "Slots",
        data: [45, 15, 30, 5],
        backgroundColor: ["#6366f1", "#e0e7ff", "#10b981", "#fca5a5"],
        borderRadius: 4,
      },
    ],
  };

  // Entrance Chart Data
  const entranceData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
    datasets: [
      {
        label: "New Registrations",
        data: [50, 85, 140, 220, 310],
        borderColor: "#f43f5e",
        backgroundColor: "rgba(244, 63, 94, 0.1)",
        borderWidth: 3,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#f43f5e",
        pointRadius: 4,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#f1f5f9" }, beginAtZero: true },
    },
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: {
        position: "right" as const,
        labels: { usePointStyle: true, boxWidth: 8 },
      },
    },
  };

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen flex overflow-hidden selection:bg-blue-500 selection:text-white">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden transition-opacity opacity-100"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative top-0 left-0 z-50 w-72 h-full bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} shadow-xl lg:shadow-none`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
              E
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              Studsphere
            </span>
          </div>
          <button
            onClick={toggleSidebar}
            className="text-slate-500 hover:text-slate-700 p-1 rounded-md bg-slate-100 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <button
            onClick={() => {
              setActiveTab("overview");
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
              activeTab === "overview"
                ? "bg-blue-50 text-blue-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Overview</span>
          </button>

          {/* Admission Dropdown */}
          <div>
            <button
              onClick={() => toggleDropdown("admission")}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors"
            >
              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5" />
                <span>Admission</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${dropdowns.admission ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${dropdowns.admission ? "max-h-48" : "max-h-0"}`}
            >
              <ul className="pl-11 pr-3 py-2 space-y-1">
                <li>
                  <a
                    href="#"
                    className="block px-3 py-2 rounded-md text-sm text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                  >
                    +2
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-3 py-2 rounded-md text-sm text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                  >
                    Bachelor
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-3 py-2 rounded-md text-sm text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                  >
                    Master
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-3 py-2 rounded-md text-sm text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                  >
                    Diploma
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
            <span>QMS</span>
          </a>

          <button
            onClick={() => {
              setActiveTab("program");
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
              activeTab === "program"
                ? "bg-blue-50 text-blue-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>Program</span>
          </button>

          {/* Scholarship Dropdown */}
          <div>
            <button
              onClick={() => toggleDropdown("scholarship")}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors"
            >
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5" />
                <span>Scholarship</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${dropdowns.scholarship ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${dropdowns.scholarship ? "max-h-48" : "max-h-0"}`}
            >
              <ul className="pl-11 pr-3 py-2 space-y-1">
                <li>
                  <a
                    href="#"
                    className="block px-3 py-2 rounded-md text-sm text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                  >
                    Manage Students
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-3 py-2 rounded-md text-sm text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                  >
                    Manage Scholarship
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors"
          >
            <Building2 className="w-5 h-5" />
            <span>College Profile</span>
          </a>

          {/* Counselling Dropdown */}
          <div>
            <button
              onClick={() => toggleDropdown("counselling")}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5" />
                <span>Counselling</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${dropdowns.counselling ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${dropdowns.counselling ? "max-h-48" : "max-h-0"}`}
            >
              <ul className="pl-11 pr-3 py-2 space-y-1">
                <li>
                  <a
                    href="#"
                    className="block px-3 py-2 rounded-md text-sm text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                  >
                    Manage Students
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-3 py-2 rounded-md text-sm text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                  >
                    Manage Slots
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Entrance Dropdown */}
          <div>
            <button
              onClick={() => toggleDropdown("entrance")}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5" />
                <span>Entrance / Exam</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${dropdowns.entrance ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${dropdowns.entrance ? "max-h-48" : "max-h-0"}`}
            >
              <ul className="pl-11 pr-3 py-2 space-y-1">
                <li>
                  <a
                    href="#"
                    className="block px-3 py-2 rounded-md text-sm text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                  >
                    Manage Students
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-3 py-2 rounded-md text-sm text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                  >
                    Manage Exams
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3 mt-6">
            Updates & Comms
          </div>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors"
          >
            <Megaphone className="w-5 h-5" />
            <span>News & Notice</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors"
          >
            <Calendar className="w-5 h-5" />
            <span>Events</span>
          </a>
          <a
            href="#"
            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors"
          >
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5" />
              <span>Message</span>
            </div>
            <span className="bg-blue-100 text-blue-700 py-0.5 px-2 rounded-full text-xs font-bold">
              3
            </span>
          </a>

          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3 mt-6">
            System
          </div>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </a>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0">
          <div className="flex items-center flex-1 gap-4 lg:gap-8">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1 max-w-md hidden sm:block relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search across all modules..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 ml-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="hidden sm:block w-px h-6 bg-slate-200 mx-2"></div>
            <button className="flex items-center gap-3 p-1 pr-2 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
              <Image
                src="https://ui-avatars.com/api/?name=Admin+User&background=1e3a8a&color=fff"
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full border border-slate-200"
              />
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-bold text-slate-800 leading-none">
                  Admin User
                </span>
                <span className="text-xs text-slate-500 mt-1">Super Admin</span>
              </div>
            </button>
          </div>
        </header>

        {/* Main Dashboard Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-400 mx-auto space-y-6">
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
              <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2 w-max">
                <RefreshCw className="w-4 h-4" />
                Sync Data
              </button>
            </div>

            {/* TOP SUMMARY STAT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Admissions */}
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
                    <TrendingUp className="w-3 h-3" />
                    +12% this year
                  </p>
                </div>
              </div>

              {/* Pending Queries */}
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
                    <AlertCircle className="w-3 h-3" />
                    12 urgent
                  </p>
                </div>
              </div>

              {/* Counselling Slots */}
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
                    <CalendarCheck className="w-3 h-3" />
                    89 booked this week
                  </p>
                </div>
              </div>

              {/* Upcoming Exams */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Upcoming Exams
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 leading-tight">
                    08
                  </h3>
                  <p className="text-xs font-semibold text-amber-500 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Next in 3 days
                  </p>
                </div>
              </div>
            </div>

            {/* DASHBOARD GRID: Charts & Activities */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* 1. Admission Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-blue-600">
                    <GraduationCap className="w-5 h-5" />
                    <h2 className="font-bold text-slate-900 text-lg">
                      Admission Stats
                    </h2>
                  </div>
                  <a
                    href="#"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    View More <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Current enrollment figures by educational level.
                </p>
                <div className="h-55 w-full">
                  <Bar data={admissionData} options={chartOptions} />
                </div>
              </div>

              {/* 2. QMS Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-amber-500">
                    <HelpCircle className="w-5 h-5" />
                    <h2 className="font-bold text-slate-900 text-lg">
                      QMS Status
                    </h2>
                  </div>
                  <a
                    href="#"
                    className="text-xs font-semibold text-amber-600 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    View More <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Resolution status of incoming student queries.
                </p>
                <div className="h-55 w-full flex justify-center items-center">
                  <Doughnut data={qmsData} options={donutOptions} />
                </div>
              </div>

              {/* 3. Program Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-purple-600">
                    <BookOpen className="w-5 h-5" />
                    <h2 className="font-bold text-slate-900 text-lg">
                      Programs
                    </h2>
                  </div>
                  <a
                    href="#"
                    className="text-xs font-semibold text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    View More <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Student distribution across different faculties.
                </p>
                <div className="h-55 w-full flex justify-center items-center">
                  <Pie
                    data={programData}
                    options={{
                      ...donutOptions,
                      plugins: {
                        legend: {
                          position: "bottom" as const,
                          labels: { usePointStyle: true, boxWidth: 8 },
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {/* 4. Scholarship Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Award className="w-5 h-5" />
                    <h2 className="font-bold text-slate-900 text-lg">
                      Scholarships
                    </h2>
                  </div>
                  <a
                    href="#"
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    View More <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Allocation of scholarships by category.
                </p>
                <div className="h-55 w-full flex justify-center items-center">
                  <Doughnut
                    data={scholarshipData}
                    options={{ ...donutOptions, cutout: "50%" }}
                  />
                </div>
              </div>

              {/* 5. Counselling Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-indigo-500">
                    <Users className="w-5 h-5" />
                    <h2 className="font-bold text-slate-900 text-lg">
                      Counselling Slots
                    </h2>
                  </div>
                  <a
                    href="#"
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    View More <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Appointments booked vs available for the week.
                </p>
                <div className="h-55 w-full">
                  <Bar
                    data={counsellingData}
                    options={{
                      ...chartOptions,
                      indexAxis: "y" as const,
                      scales: {
                        x: { grid: { color: "#f1f5f9" }, beginAtZero: true },
                        y: { grid: { display: false } },
                      },
                    }}
                  />
                </div>
              </div>

              {/* 6. Entrance / Exam Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-rose-500">
                    <FileText className="w-5 h-5" />
                    <h2 className="font-bold text-slate-900 text-lg">
                      Entrance & Exams
                    </h2>
                  </div>
                  <a
                    href="#"
                    className="text-xs font-semibold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    View More <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Registration trends for upcoming Entrance tests.
                </p>
                <div className="h-55 w-full">
                  <Line data={entranceData} options={chartOptions} />
                </div>
              </div>

              {/* 7. Updates, Comms & Profile */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow md:col-span-2 xl:col-span-2 flex flex-col">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Megaphone className="w-5 h-5" />
                    <h2 className="font-bold text-slate-900 text-lg">
                      Updates, Comms & College Profile
                    </h2>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href="#"
                      className="text-xs font-semibold text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      Manage Profile
                    </a>
                    <a
                      href="#"
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      View All <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
                  {/* News & Events */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                      Latest News & Events
                    </h3>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex gap-3">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-md flex flex-col items-center justify-center font-bold text-sm shrink-0">
                        24 <span className="text-[9px] uppercase">Nov</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-800">
                          Convocation Ceremony 2026
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Main campus auditorium. All staff required.
                        </p>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex gap-3">
                      <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-md flex items-center justify-center font-bold text-sm shrink-0">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-800">
                          System Maintenance Notice
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Portal will be down from 12 AM to 2 AM.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex justify-between">
                      Unread Messages{" "}
                      <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-[10px]">
                        3 New
                      </span>
                    </h3>
                    <div className="p-3 hover:bg-slate-50 cursor-pointer rounded-lg border border-transparent hover:border-slate-100 flex items-center justify-between transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <Image
                          src="https://ui-avatars.com/api/?name=Dr+Smith&background=f1f5f9"
                          alt="Dr. Smith"
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            Dr. Smith (HOD)
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            Regarding the new syllabus...
                          </p>
                        </div>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                    </div>
                    <div className="p-3 hover:bg-slate-50 cursor-pointer rounded-lg border border-transparent hover:border-slate-100 flex items-center justify-between transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <Image
                          src="https://ui-avatars.com/api/?name=IT+Support&background=f1f5f9"
                          alt="IT Support"
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            IT Support Team
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            Server backup completed.
                          </p>
                        </div>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 8. Interactive Calendar */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col md:col-span-1 xl:col-span-1">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-indigo-500">
                    <CalendarDays className="w-5 h-5" />
                    <h2 className="font-bold text-slate-900 text-lg">
                      Calendar
                    </h2>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <button className="hover:text-slate-900 p-1">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-bold text-slate-800 w-20 text-center">
                      Mar 2026
                    </span>
                    <button className="hover:text-slate-900 p-1">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  {/* Days of Week */}
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <div>Su</div>
                    <div>Mo</div>
                    <div>Tu</div>
                    <div>We</div>
                    <div>Th</div>
                    <div>Fr</div>
                    <div>Sa</div>
                  </div>
                  {/* Dates Grid */}
                  <div className="grid grid-cols-7 gap-1 text-sm flex-1 content-start">
                    {[...Array(31)].map((_, i) => {
                      const day = i + 1;
                      const isActive = day === 6;
                      const hasEvent = [12, 18, 24].includes(day);
                      return (
                        <div
                          key={day}
                          className={`aspect-square flex items-center justify-center rounded-full cursor-pointer transition-all relative
                            ${isActive ? "bg-blue-600 text-white font-bold shadow-md" : "text-slate-700 hover:bg-slate-100"}
                          `}
                        >
                          {day}
                          {hasEvent && (
                            <span
                              className={`absolute bottom-1 w-1 h-1 rounded-full ${isActive ? "bg-white" : "bg-rose-500"}`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <a
                    href="#"
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors w-full"
                  >
                    View Full Schedule <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* 9. Recent Activities & Student Inquiries */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col md:col-span-1 xl:col-span-3">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-blue-500">
                    <BellRing className="w-5 h-5" />
                    <h2 className="font-bold text-slate-900 text-lg">
                      Recent Activities & Student Inquiries
                    </h2>
                  </div>
                  <a
                    href="#"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    View All <ArrowRight className="w-3 h-3" />
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 flex-1">
                  {/* Card 1 */}
                  {[
                    {
                      name: "Aarav Patel",
                      role: "BBA Admission Inquiry",
                      email: "aarav.patel@example.com",
                      phone: "+977 9841234567",
                      time: "10 mins ago",
                      color: "c7d2fe",
                      textColor: "3730a3",
                    },
                    {
                      name: "Sarah Jenkins",
                      role: "Scholarship Eligibility",
                      email: "s.jenkins22@example.com",
                      phone: "+977 9823456789",
                      time: "1 hr ago",
                      color: "fecdd3",
                      textColor: "be123c",
                    },
                    {
                      name: "Michael Chang",
                      role: "Counselling Follow-up",
                      email: "m.chang.99@example.com",
                      phone: "+977 9801234567",
                      time: "3 hrs ago",
                      color: "dcfce7",
                      textColor: "166534",
                    },
                  ].map((student, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:shadow-sm hover:border-slate-200 transition-all"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex gap-3 items-center">
                          <div className="relative shrink-0">
                            <Image
                              src={`https://ui-avatars.com/api/?name=${student.name.replace(" ", "+")}&background=${student.color}&color=${student.textColor}`}
                              alt={student.name}
                              width={40}
                              height={40}
                              className="rounded-full border-2 border-white shadow-sm"
                            />
                            <span
                              className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-white rounded-full ${idx === 2 ? "bg-amber-400" : "bg-green-500"}`}
                            ></span>
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm font-bold text-slate-900 truncate">
                              {student.name}
                            </h3>
                            <p className="text-[11px] text-slate-500 font-medium truncate">
                              {student.role}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold bg-white px-2 py-1 rounded-md border border-slate-100 shrink-0">
                          {student.time}
                        </span>
                      </div>
                      <div className="space-y-2 mt-4 bg-white p-3 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{student.email}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-medium">{student.phone}</span>
                          </div>
                          <button
                            className="flex items-center justify-center w-7 h-7 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white rounded-full transition-colors"
                            title="WhatsApp Message"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 10. Studsphere Support Banner */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-6">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <Image
                    src="https://ui-avatars.com/api/?name=Stud+Sphere&background=1e3a8a&color=fff&font-size=0.4"
                    alt="Studsphere Logo"
                    width={64}
                    height={64}
                    className="rounded-full border-4 border-slate-50 shadow-sm"
                  />
                  <span
                    className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full"
                    title="Online"
                  ></span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-bold text-slate-900 text-xl">
                      Studsphere Support
                    </h2>
                    <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border border-blue-100">
                      Technical Partner
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 font-medium">
                    For system support, maintenance, and technical inquiries
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <a
                  href="mailto:support@studsphere.com"
                  className="flex items-center justify-center gap-2.5 px-5 py-2.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200 rounded-xl transition-all font-medium text-sm group"
                >
                  <Mail className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  support@studsphere.com
                </a>
                <a
                  href="tel:+9779801234567"
                  className="flex items-center justify-center gap-2.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow rounded-xl transition-all font-medium text-sm"
                >
                  <PhoneCall className="w-4 h-4 text-blue-200" />
                  +977 9801234567
                </a>
              </div>
            </div>
          </div>

          <footer className="max-w-400 mx-auto mt-10 py-6 border-t border-slate-200 text-center sm:text-left">
            <p className="text-sm text-slate-500">
              &copy; 2026 Studsphere College Management System. Dashboard
              Overview complete.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default InstitutionDashboard;
