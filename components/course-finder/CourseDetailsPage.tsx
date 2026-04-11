"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Clock,
  GraduationCap,
  Building,
  LayoutGrid,
  Info,
  ClipboardCheck,
  UserPlus,
  BookOpen,
  Coins,
  Award,
  FileText,
  Star,
  Trophy,
  ArrowRight,
  FileCheck2,
  Download,
  AlertCircle,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Mail,
  Phone,
  ExternalLink,
  MapPin,
  Newspaper,
} from "lucide-react";

interface CourseDetailsPageProps {
  courseId: string | number;
  onBack: () => void;
  onNavigate: (view: string, data?: any) => void;
}

type TabKey =
  | "overview"
  | "eligibility"
  | "admission"
  | "courses"
  | "fee"
  | "scholarships"
  | "model-questions"
  | "news";

const courseData: Record<
  string,
  {
    title: string;
    duration: string;
    level: string;
    field: string;
  }
> = {
  "1": {
    title: "10+2 Science",
    duration: "2 Years",
    level: "+2",
    field: "Science",
  },
  "2": {
    title: "10+2 Management",
    duration: "2 Years",
    level: "+2",
    field: "Management",
  },
  "3": {
    title: "BSc CSIT",
    duration: "4 Years",
    level: "Bachelor",
    field: "IT / Computer Science",
  },
  "4": {
    title: "BBA",
    duration: "4 Years",
    level: "Bachelor",
    field: "Management",
  },
  "5": {
    title: "MBA",
    duration: "2 Years",
    level: "Master",
    field: "Management",
  },
};

const sponsoredColleges = [
  {
    name: "Advance Foundation",
    location: "Kumaripati, Lalitpur",
    website: "advancefoundation.edu.np",
    url: "https://advancefoundation.edu.np",
    logo: "https://advancefoundation.edu.np/public/assets/img/logo.jpg",
    verified: true,
  },
  {
    name: "Trinity Int'l College",
    location: "Dillibazar, Kathmandu",
    website: "trinity.edu.np",
    url: "https://www.trinity.edu.np",
    logo: "https://www.trinity.edu.np/assets/backend/uploads/Logo/trinity%20college%20logo.jpg",
    verified: true,
  },
  {
    name: "KIST College",
    location: "Kamalpokhari, Kathmandu",
    website: "kist.edu.np",
    url: "https://kist.edu.np",
    logo: "https://kist.edu.np/resources/assets/img/logo_small.jpg",
    verified: true,
  },
  {
    name: "KMC Network",
    location: "Bagbazar, Kathmandu",
    website: "kmc.edu.np",
    url: "https://kmc.edu.np",
    logo: null,
    verified: true,
    logoFallback: "KMC",
    logoFallbackColor: "bg-green-50 text-green-800",
  },
];

const CourseDetailsPage: React.FC<CourseDetailsPageProps> = ({
  courseId,
  onBack,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  const course = courseData[String(courseId)] || courseData["1"];
  const courseTitle = course.title;
  const courseDuration = course.duration;
  const courseLevel = course.level;
  const courseField = course.field;

  const handleTabClick = (tab: TabKey) => {
    setActiveTab(tab);
  };

  return (
    <>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .banner-bg {
            background-color: #0b71d1;
            background-image: 
                radial-gradient(circle at 5% 150%, rgba(20, 160, 255, 0.3) 0%, transparent 40%),
                radial-gradient(circle at 80% 150%, rgba(0, 80, 180, 0.3) 0%, transparent 50%);
        }
        .ring-decor-1 {
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 50%;
            position: absolute;
            pointer-events: none;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-in-out; }
      `}</style>
      <div className="bg-white text-gray-900 antialiased selection:bg-blue-100 selection:text-blue-900 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          {/* Top Navigation */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={onBack}
              className="inline-flex items-center text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium group cursor-pointer bg-transparent border-none appearance-none outline-none"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Programs
            </button>
          </div>

          {/* Banner/Hero Section */}
          <header className="banner-bg relative w-full min-h-[240px] md:min-h-[280px] rounded-2xl overflow-hidden flex items-center justify-center py-10 mb-12 shadow-sm">
            {/* Background Decorations */}
            <div className="ring-decor-1 w-[250px] h-[250px] md:w-[400px] md:h-[400px] -top-[80px] md:-top-[150px] -right-[50px] md:-right-[50px]"></div>
            <div className="ring-decor-1 w-[350px] h-[350px] md:w-[500px] md:h-[500px] -top-[130px] md:-top-[200px] -right-[100px] md:-right-[100px] border-[0.5px]"></div>

            <div className="absolute bottom-0 left-0 w-[60%] md:w-[40%] h-[150%] bg-[#128cf4] opacity-20 rounded-tr-full mix-blend-screen pointer-events-none transform -translate-x-10 translate-y-10 md:translate-y-16"></div>

            {/* Content */}
            <div className="relative z-10 px-6 md:px-10 w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              {/* Left Side: Course Info */}
              <div className="flex flex-col gap-4">
                <h1 className="text-white text-4xl md:text-5xl font-bold tracking-tight">
                  {courseTitle}
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-white/90">
                  <span className="bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/10 flex items-center">
                    <Clock className="w-4 h-4 mr-2 opacity-80" />
                    {courseDuration} Duration
                  </span>
                  <span className="bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/10 flex items-center">
                    <GraduationCap className="w-4 h-4 mr-2 opacity-80" />
                    {courseLevel} Equivalent
                  </span>
                  <span className="bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/10 flex items-center">
                    <BookOpen className="w-4 h-4 mr-2 opacity-80" />
                    {courseField} Faculty
                  </span>
                </div>
              </div>

              {/* Right Side: Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button className="bg-white text-[#0b71d1] font-semibold px-6 py-3 rounded-xl shadow-sm hover:bg-gray-50 transition-colors whitespace-nowrap outline-none focus:ring-4 focus:ring-white/20 cursor-pointer border-none">
                  View Admissions
                </button>
                <button
                  onClick={() =>
                    onNavigate("universitiesPage", {
                      courseId,
                      courseTitle,
                      collegesCount: courseField,
                    })
                  }
                  className="bg-transparent border border-white/50 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 hover:border-white transition-all whitespace-nowrap outline-none focus:ring-4 focus:ring-white/20 cursor-pointer flex items-center justify-center"
                >
                  <LayoutGrid className="w-4 h-4 mr-2 opacity-80" />
                  Explore All Colleges
                </button>
              </div>
            </div>
          </header>

          {/* Sticky Tab Navigation */}
          <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md relative mb-12 border-b border-gray-200">
            <nav className="flex overflow-x-auto hide-scrollbar space-x-8 text-gray-500 font-medium whitespace-nowrap">
              {[
                { id: "overview", label: "Overview" },
                { id: "eligibility", label: "Eligibility" },
                { id: "admission", label: "Admission" },
                { id: "courses", label: "Courses" },
                { id: "fee", label: "Program Fee" },
                { id: "scholarships", label: "Scholarships" },
                { id: "model-questions", label: "Model Questions" },
                { id: "news", label: "News" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id as TabKey)}
                  className={`pb-4 -mb-px transition-colors hover:text-gray-900 border-b-2 appearance-none outline-none bg-transparent cursor-pointer ${
                    activeTab === tab.id
                      ? "text-gray-900 border-blue-600"
                      : "border-transparent"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Left Column: Content */}
            <div className="lg:col-span-2 min-h-[60vh]">
              <section
                id="overview"
                className={`content-section ${activeTab === "overview" ? "block animate-fade-in" : "hidden"}`}
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <Info className="w-6 h-6 mr-3 text-blue-600" />
                  Overview
                </h2>

                <div className="prose prose-lg text-gray-600 space-y-6">
                  <p>
                    The{" "}
                    <strong className="text-gray-900 font-semibold">
                      {courseTitle}
                    </strong>{" "}
                    program is meticulously designed to bridge the gap between
                    secondary education and advanced university studies.
                    Students will dive deep into fundamental scientific
                    principles, mathematical logic, and practical applications.
                  </p>
                  <p>
                    This program is highly suitable for curious and analytical
                    thinkers who want to shape the future of their chosen field.
                    By the end of this course, you will be proficient in
                    theoretical concepts and practical skills, preparing you for
                    competitive entrance examinations.
                  </p>
                  <p>
                    The curriculum emphasizes hands-on learning, encouraging
                    students to apply theoretical knowledge to real-world
                    problems. By enrolling in top colleges with state-of-the-art
                    facilities and expert faculty members, students receive an
                    immersive educational experience that lays a robust
                    foundation for a successful career.
                  </p>
                </div>
              </section>

              <section
                id="eligibility"
                className={`content-section ${activeTab === "eligibility" ? "block animate-fade-in" : "hidden"}`}
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <ClipboardCheck className="w-6 h-6 mr-3 text-blue-600" />
                  Eligibility Criteria
                </h2>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
                  <p className="text-gray-800 font-medium mb-2">
                    To be eligible for the {courseTitle} program, applicants
                    must meet the following criteria:
                  </p>
                  <ul className="list-disc pl-5 text-gray-600 space-y-2 mt-4">
                    <li>
                      Must have completed the Secondary Education Examination
                      (SEE) or an equivalent recognized board exam.
                    </li>
                    <li>
                      Must have achieved a minimum GPA of{" "}
                      <strong className="text-gray-900">2.0</strong> in
                      aggregate.
                    </li>
                    <li>
                      Must have secured at least a{" "}
                      <strong className="text-gray-900">C+ grade</strong> in
                      core subjects and a minimum of{" "}
                      <strong className="text-gray-900">D+ grade</strong> in
                      English and Nepali.
                    </li>
                  </ul>
                </div>
              </section>

              <section
                id="admission"
                className={`content-section ${activeTab === "admission" ? "block animate-fade-in" : "hidden"}`}
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <UserPlus className="w-6 h-6 mr-3 text-blue-600" />
                  Admission Process
                </h2>

                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 mb-8 text-gray-700 leading-relaxed">
                  The admission is mainly open from{" "}
                  <strong className="text-gray-900">July to August</strong>{" "}
                  (shortly after SEE results), but the exact timeline is also
                  heavily based on the individual college.
                </div>

                <div className="space-y-6">
                  <div className="flex">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                      1
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Application Form
                      </h3>
                      <p className="text-gray-600 mt-2 leading-relaxed">
                        Many colleges open online admission forms, while many
                        others still require you to submit the form physically
                        at the college.
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                      2
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Entrance Examination
                      </h3>
                      <p className="text-gray-600 mt-2 leading-relaxed">
                        Colleges can have different admission times and
                        schedules for their entrance exams. You can find
                        detailed entrance notices from the specific college page
                        via{" "}
                        <span className="text-blue-600 font-medium">
                          Find College
                        </span>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section
                id="courses"
                className={`content-section ${activeTab === "courses" ? "block animate-fade-in" : "hidden"}`}
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <BookOpen className="w-6 h-6 mr-3 text-blue-600" />
                  Course Structure & Career Opportunities
                </h2>

                <p className="text-gray-600 mb-6">
                  The program generally has two main sections: the{" "}
                  <strong>Physical Group</strong> and the{" "}
                  <strong>Biology Group</strong>. Below is the detailed
                  breakdown of subjects and opportunities for each.
                </p>

                {/* Grade 11 Tables */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
                  Grade 11 Subjects
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="bg-blue-50 border-b border-gray-200 px-6 py-3">
                      <h4 className="font-bold text-blue-900">
                        Physical Group
                      </h4>
                    </div>
                    <ul className="divide-y divide-gray-100 text-gray-600 text-sm">
                      <li className="px-6 py-3">Compulsory English</li>
                      <li className="px-6 py-3">Compulsory Nepali</li>
                      <li className="px-6 py-3 font-medium text-gray-800">
                        Physics
                      </li>
                      <li className="px-6 py-3 font-medium text-gray-800">
                        Chemistry
                      </li>
                      <li className="px-6 py-3 font-medium text-gray-800">
                        Mathematics
                      </li>
                      <li className="px-6 py-3">Computer Science (Optional)</li>
                    </ul>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="bg-emerald-50 border-b border-gray-200 px-6 py-3">
                      <h4 className="font-bold text-emerald-900">
                        Biology Group
                      </h4>
                    </div>
                    <ul className="divide-y divide-gray-100 text-gray-600 text-sm">
                      <li className="px-6 py-3">Compulsory English</li>
                      <li className="px-6 py-3">Compulsory Nepali</li>
                      <li className="px-6 py-3 font-medium text-gray-800">
                        Physics
                      </li>
                      <li className="px-6 py-3 font-medium text-gray-800">
                        Chemistry
                      </li>
                      <li className="px-6 py-3 font-medium text-gray-800">
                        Biology
                      </li>
                      <li className="px-6 py-3">
                        Mathematics / Extra Math (Optional)
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Grade 12 Tables */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
                  Grade 12 Subjects
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="bg-blue-50 border-b border-gray-200 px-6 py-3">
                      <h4 className="font-bold text-blue-900">
                        Physical Group
                      </h4>
                    </div>
                    <ul className="divide-y divide-gray-100 text-gray-600 text-sm">
                      <li className="px-6 py-3">Compulsory English</li>
                      <li className="px-6 py-3">
                        Compulsory Nepali / Life Skills
                      </li>
                      <li className="px-6 py-3 font-medium text-gray-800">
                        Physics
                      </li>
                      <li className="px-6 py-3 font-medium text-gray-800">
                        Chemistry
                      </li>
                      <li className="px-6 py-3 font-medium text-gray-800">
                        Mathematics
                      </li>
                      <li className="px-6 py-3">Computer Science (Optional)</li>
                    </ul>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="bg-emerald-50 border-b border-gray-200 px-6 py-3">
                      <h4 className="font-bold text-emerald-900">
                        Biology Group
                      </h4>
                    </div>
                    <ul className="divide-y divide-gray-100 text-gray-600 text-sm">
                      <li className="px-6 py-3">Compulsory English</li>
                      <li className="px-6 py-3">
                        Compulsory Nepali / Life Skills
                      </li>
                      <li className="px-6 py-3 font-medium text-gray-800">
                        Physics
                      </li>
                      <li className="px-6 py-3 font-medium text-gray-800">
                        Chemistry
                      </li>
                      <li className="px-6 py-3 font-medium text-gray-800">
                        Biology
                      </li>
                      <li className="px-6 py-3">
                        Mathematics / Extra Math (Optional)
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Entrance Preparation & Careers */}
                <div className="space-y-6 mb-8">
                  <div className="bg-gray-50 border border-gray-200 p-5 rounded-xl">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Physical Group Focus
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      <strong>Entrance you get prepared for:</strong> IOE
                      (Institute of Engineering Entrance), BSc. CSIT, BIT, and
                      other university-specific engineering and IT entrance
                      exams.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                        Civil Engineering
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                        Computer Engineering
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                        Software Development
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                        Architecture
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 p-5 rounded-xl">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Biology Group Focus
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      <strong>Entrance you get prepared for:</strong> CEE
                      (Common Entrance Examination for Medical Education),
                      Agriculture Entrance, Forestry Entrance, and Nursing
                      parameters.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold">
                        Medicine (MBBS/BDS)
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold">
                        Nursing
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold">
                        Pharmacy
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold">
                        Agriculture
                      </span>
                    </div>
                  </div>
                </div>

                {/* Note Block */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-800 leading-relaxed">
                        <strong>Note:</strong> Many colleges allow you to freely
                        choose the optional subject (such as Computer Science or
                        Extra Math). However, in many colleges, it is a
                        mandatory subject that must be read based on their
                        specific curriculum packages.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section
                id="fee"
                className={`content-section ${activeTab === "fee" ? "block animate-fade-in" : "hidden"}`}
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <Coins className="w-6 h-6 mr-3 text-blue-600" />
                  Fee Structure
                </h2>
                <p className="text-gray-600 mb-6">
                  Based on the college, here is the minimum and estimated fee
                  structure in the tables below for a standard program.
                </p>

                <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-900">
                        <th className="py-4 px-6 font-semibold border-b border-gray-200">
                          Particulars
                        </th>
                        <th className="py-4 px-6 font-semibold border-b border-gray-200 text-right">
                          Amount (NPR)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-600">
                      <tr>
                        <td className="py-4 px-6">Admission Fee (One-time)</td>
                        <td className="py-4 px-6 text-right">25,000</td>
                      </tr>
                      <tr>
                        <td className="py-4 px-6">
                          Monthly Tuition Fee (x 12 months)
                        </td>
                        <td className="py-4 px-6 text-right">6,500</td>
                      </tr>
                      <tr>
                        <td className="py-4 px-6">Laboratory Fee (Annual)</td>
                        <td className="py-4 px-6 text-right">10,000</td>
                      </tr>
                      <tr>
                        <td className="py-4 px-6">
                          Library & Extra-curricular (Annual)
                        </td>
                        <td className="py-4 px-6 text-right">5,000</td>
                      </tr>
                      <tr className="bg-gray-50 font-bold text-gray-900">
                        <td className="py-4 px-6">
                          Total Estimated first Year Fee
                        </td>
                        <td className="py-4 px-6 text-right">
                          90,000 - 150,000+
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section
                id="scholarships"
                className={`content-section ${activeTab === "scholarships" ? "block animate-fade-in" : "hidden"}`}
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <Award className="w-6 h-6 mr-3 text-blue-600" />
                  Scholarships & Financial Aid
                </h2>

                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 mb-8">
                  <p className="text-indigo-900 font-medium">
                    Many colleges provide scholarships based on the{" "}
                    <strong className="font-bold">SEE GPA</strong>,{" "}
                    <strong className="font-bold">government quotas</strong>,{" "}
                    <strong className="font-bold">
                      extracurricular activities
                    </strong>
                    , and based on the{" "}
                    <strong className="font-bold">
                      college entrance examination
                    </strong>{" "}
                    scores.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <h3 className="font-bold text-yellow-900 text-lg mb-2 flex items-center">
                      <Star className="w-5 h-5 mr-2" />
                      SEE Merit Scholarship
                    </h3>
                    <p className="text-gray-700 text-sm">
                      Students achieving a high GPA (usually 3.6 to 4.0) in SEE
                      are highly likely to receive a 50% to 100% waiver on
                      tuition fees.
                    </p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="font-bold text-blue-900 text-lg mb-2 flex items-center">
                      <Trophy className="w-5 h-5 mr-2" />
                      Entrance Topper Award
                    </h3>
                    <p className="text-gray-700 text-sm">
                      Top performers in a specific college's entrance
                      examination generally receive full or partial scholarships
                      for the first academic year.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                  <div className="mb-4 sm:mb-0">
                    <h3 className="text-lg font-bold text-gray-900">
                      Looking for Scholarships?
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Here you can find the many scholarship programs available
                      tailored to your scores.
                    </p>
                  </div>
                  <button className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-100 whitespace-nowrap">
                    Scholarship Finder
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </section>

              <section
                id="model-questions"
                className={`content-section ${activeTab === "model-questions" ? "block animate-fade-in" : "hidden"}`}
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <FileText className="w-6 h-6 mr-3 text-blue-600" />
                  Model Questions
                </h2>
                <p className="text-gray-600 mb-6">
                  Download sample entrance exam papers and previous NEB board
                  exam model questions to help with your preparation.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a
                    href="#"
                    className="flex items-center p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileCheck2 className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        Entrance Model Set 1
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">PDF • 2.4 MB</p>
                    </div>
                    <Download className="w-5 h-5 ml-auto text-gray-400 group-hover:text-blue-600" />
                  </a>

                  <a
                    href="#"
                    className="flex items-center p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileCheck2 className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        NEB Physics Past Papers
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">PDF • 5.1 MB</p>
                    </div>
                    <Download className="w-5 h-5 ml-auto text-gray-400 group-hover:text-blue-600" />
                  </a>
                </div>
              </section>

              {/* News Section */}
              <section
                id="news"
                className={`content-section ${activeTab === "news" ? "block animate-fade-in" : "hidden"}`}
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <Newspaper className="w-6 h-6 mr-3 text-blue-600" />
                  Latest News & Notices
                </h2>
                <div className="space-y-4">
                  <a
                    href="#"
                    className="bg-white border border-gray-200 p-5 rounded-xl flex flex-col sm:flex-row gap-5 hover:border-blue-600 hover:shadow-md transition-all group block"
                  >
                    <div className="w-full sm:w-16 h-16 bg-blue-50 rounded-lg flex flex-col items-center justify-center shrink-0 text-blue-600 border border-blue-100">
                      <span className="text-xl font-bold">12</span>
                      <span className="text-xs uppercase tracking-wider font-semibold">
                        Aug
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                          Admission
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                        NEB Class 11 Science Admission Open
                      </h3>
                      <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">
                        Various top colleges across the valley have started
                        taking applications and entrance exams for the upcoming
                        session.
                      </p>
                    </div>
                  </a>

                  <a
                    href="#"
                    className="bg-white border border-gray-200 p-5 rounded-xl flex flex-col sm:flex-row gap-5 hover:border-blue-600 hover:shadow-md transition-all group block"
                  >
                    <div className="w-full sm:w-16 h-16 bg-blue-50 rounded-lg flex flex-col items-center justify-center shrink-0 text-blue-600 border border-blue-100">
                      <span className="text-xl font-bold">05</span>
                      <span className="text-xs uppercase tracking-wider font-semibold">
                        Aug
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                          Results
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                        SEE Results Published Successfully
                      </h3>
                      <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">
                        The National Examination Board has officially published
                        the SEE results. Check your GPA and find eligibility.
                      </p>
                    </div>
                  </a>
                </div>
              </section>
            </div>

            {/* Right Column: Interactive Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                {/* Sponsored Colleges List */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 text-lg flex items-center">
                      Sponsored Colleges
                    </h3>
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                      Ad
                    </span>
                  </div>

                  {/* Scrollable container for the cards */}
                  <div className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2 pb-4 custom-scrollbar">
                    {sponsoredColleges.map((college) => (
                      <a
                        key={college.name}
                        href={college.url}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 w-full hover:border-blue-600 hover:shadow-md transition-all group block relative overflow-hidden"
                      >
                        <div
                          className={`w-16 h-16 rounded-lg border border-gray-100 flex items-center justify-center shrink-0 p-1 ${college.logoFallbackColor || "bg-white"}`}
                        >
                          {college.logo ? (
                            <img
                              src={college.logo}
                              alt={`${college.name} Logo`}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center w-full h-full">
                              <span className="font-bold text-[11px] leading-tight text-center">
                                {college.logoFallback}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col flex-1 justify-center">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors line-clamp-1">
                              {college.name}
                            </h4>
                            {college.verified && (
                              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <MapPin className="w-3 h-3 mr-1 shrink-0" />
                            <span className="truncate">{college.location}</span>
                          </div>
                          <div className="flex items-center mt-2 text-[11px] font-semibold text-blue-600 group-hover:text-blue-800 transition-colors">
                            <ExternalLink className="w-3 h-3 mr-1" />{" "}
                            {college.website}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetailsPage;
