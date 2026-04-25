"use client";

import React, { useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { admissionService } from "@/services/admission.api";
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Globe,
  Download,
  FlaskConical,
  Briefcase,
  BookOpen,
  Monitor,
  Trophy,
  Wifi,
  Bus,
  Utensils,
  Users,
  ShieldCheck,
  X,
} from "lucide-react";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "eligibility", label: "Eligibility" },
  { id: "process", label: "Admission Process" },
  { id: "facilities", label: "Facilities" },
  { id: "courses", label: "Courses & Fees" },
  { id: "scholarship", label: "Scholarships" },
  { id: "contact", label: "Contact" },
  { id: "faq", label: "FAQ" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const eligibilityData = [
  {
    sn: 1,
    level: "+2 Science",
    stream: "PCB, PCM, Computer Science",
    eligibility: "Minimum 2.5 GPA in SEE with Compulsory Mathematics",
    docs: ["SEE Mark Sheet", "Character Certificate", "8 Photos"],
  },
  {
    sn: 2,
    level: "+2 Management",
    stream: "Business Studies, Finance",
    eligibility: "Minimum 2.0 GPA in SEE (Any stream)",
    docs: ["SEE Mark Sheet", "Character Certificate", "8 Photos"],
  },
  {
    sn: 3,
    level: "+2 Humanities",
    stream: "Social Sciences, Arts",
    eligibility: "Minimum 2.0 GPA in SEE (Any stream)",
    docs: ["SEE Mark Sheet", "Character Certificate", "8 Photos"],
  },
];

const programsData = [
  {
    icon: FlaskConical,
    title: "Science (+2)",
    badge: "Admissions Open",
    badgeClass: "bg-green-100 text-green-700",
    desc: "Our Science program is designed for students who aspire to pursue careers in medicine, engineering, technology, and pure sciences. The curriculum combines theoretical knowledge with practical laboratory experience to build a strong foundation in scientific concepts.",
    leftTitle: "Available Streams:",
    leftItems: [
      "Physics, Chemistry, Biology (PCB)",
      "Physics, Chemistry, Mathematics (PCM)",
      "Computer Science & IT",
      "Statistics & Mathematics",
    ],
    rightTitle: "Career Opportunities:",
    rightItems: [
      "Medicine (MBBS, BDS)",
      "Engineering (BE, BTech)",
      "B.Sc. (Pure Sciences)",
      "Research & Development",
    ],
  },
  {
    icon: Briefcase,
    title: "Management (+2)",
    badge: "Ongoing",
    badgeClass: "bg-blue-100 text-blue-700",
    desc: "Our Management program prepares students for careers in business, finance, accounting, and entrepreneurship. The curriculum focuses on developing analytical skills, business acumen, and leadership qualities essential for the corporate world.",
    leftTitle: "Key Subjects:",
    leftItems: [
      "Accountancy & Finance",
      "Business Studies",
      "Economics & Marketing",
      "Computer Applications",
    ],
    rightTitle: "Career Opportunities:",
    rightItems: [
      "BBA / BBS Programs",
      "Chartered Accountancy (CA)",
      "Banking & Finance",
      "Entrepreneurship",
    ],
  },
  {
    icon: BookOpen,
    title: "Humanities (+2)",
    badge: "Coming Soon",
    badgeClass: "bg-gray-100 text-gray-700",
    desc: "Our Humanities program offers a diverse range of subjects that develop critical thinking, communication skills, and cultural understanding. This program is ideal for students interested in social sciences, arts, law, journalism, and public service.",
    leftTitle: "Available Subjects:",
    leftItems: [
      "English Literature & Language",
      "History & Political Science",
      "Sociology & Psychology",
      "Economics & Geography",
    ],
    rightTitle: "Career Opportunities:",
    rightItems: [
      "Law (LLB)",
      "Journalism & Mass Communication",
      "Public Administration",
      "Teaching & Research",
    ],
  },
];

const facilitiesData = [
  { icon: FlaskConical, title: "Science Laboratories", desc: "Fully equipped Physics, Chemistry, and Biology labs with modern instruments for practical learning." },
  { icon: Monitor, title: "Computer Lab", desc: "State-of-the-art computer laboratory with high-speed internet and latest software applications." },
  { icon: BookOpen, title: "Library", desc: "Well-stocked library with thousands of books, journals, and digital resources for research and study." },
  { icon: Trophy, title: "Sports Complex", desc: "Indoor and outdoor sports facilities including basketball, volleyball, football, and table tennis." },
  { icon: Wifi, title: "WiFi Campus", desc: "High-speed WiFi connectivity throughout the campus for seamless digital learning experience." },
  { icon: Bus, title: "Transportation", desc: "College bus service covering major routes across Kathmandu valley for student convenience." },
  { icon: Utensils, title: "Cafeteria", desc: "Clean and hygienic cafeteria serving nutritious meals and refreshments at affordable prices." },
  { icon: Users, title: "Auditorium", desc: "Spacious auditorium for seminars, workshops, cultural programs, and annual functions." },
  { icon: ShieldCheck, title: "Security", desc: "24/7 security with CCTV surveillance ensuring safe and secure environment for all students." },
];

const coursesData = [
  {
    course: "Science (+2)",
    fees: "Contact College for Details",
    appDate: "Aug 2026",
  },
  {
    course: "Management (+2)",
    fees: "Contact College for Details",
    appDate: "Aug 2026",
  },
  {
    course: "Humanities (+2)",
    fees: "Contact College for Details",
    appDate: "Aug 2026",
  },
];

const scholarshipData = [
  {
    name: "Merit Scholarship",
    level: "+2",
    stream: "Science",
    coverage: "100%",
    eligibility: "GPA 3.8+",
    seats: 2,
  },
  {
    name: "Entrance Topper",
    level: "+2",
    stream: "All",
    coverage: "50%",
    eligibility: "Top 5 rank",
    seats: 5,
  },
  {
    name: "Need Based",
    level: "Bachelor",
    stream: "BBA",
    coverage: "30%",
    eligibility: "Interview",
    seats: 10,
  },
];

const staffData = [
  {
    name: "Ram Shrestha",
    role: "Admission Director",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    phone: "01-4112222 Ext. 101",
    email: "ram.shrestha@kist.edu.np",
    wa: "9779800000001",
  },
  {
    name: "Sita Gurung",
    role: "Senior Admission Officer",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    phone: "01-4112222 Ext. 102",
    email: "sita.gurung@kist.edu.np",
    wa: "9779800000002",
  },
];

const faqData = [
  {
    q: "How can I get admission in KIST College?",
    a: "You can apply online through our portal or visit the college administration office directly. Admission is based on your SEE GPA and performance in the entrance test.",
  },
  {
    q: "Is it difficult to get admission in KIST College?",
    a: "Admission is competitive but straightforward. Meeting the minimum GPA requirements and performing well in the entrance examination greatly improves your chances.",
  },
  {
    q: "Can I get admission in KIST College with 2.5 GPA in SEE?",
    a: "Yes, a minimum of 2.5 GPA in SEE meets the basic eligibility criteria for Science, Management, and Humanities courses. However, final admission also depends on the entrance test results.",
  },
  {
    q: "What is the fees for the Science (+2) course at KIST College?",
    a: "The total fee structure varies based on the course and merit scholarships. Please contact the college administration directly or download the brochure for a detailed fee breakdown.",
  },
  {
    q: "What is the step-by-step admission process for KIST College?",
    a: "The process involves filling out the online application, submitting academic documents, appearing for the KIST Entrance Test, and finally attending a Personal Interview if shortlisted.",
  },
  {
    q: "Is the entrance exam mandatory for all courses?",
    a: "Yes, appearing for the KIST Entrance Examination is mandatory for admission into Science, Management, Humanities, and undergraduate programs.",
  },
  {
    q: "When will the final merit list be published?",
    a: "The final merit list is typically published a few days after all entrance exams and personal interviews have concluded. You can check your dashboard for updates.",
  },
];

export default function AdmissionDetailPage() {
  const params = useParams();
  const collegeId = params.collegeId as string;
  const collegeIdNum = parseInt(collegeId, 10);

  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const tabNavRef = useRef<HTMLDivElement>(null);

  const { data: collegeData } = useQuery({
    queryKey: ["admissionCollege", collegeIdNum],
    queryFn: () => admissionService.getAdmissionCollegeById(collegeIdNum),
    enabled: !isNaN(collegeIdNum),
  });

  const collegeName = collegeData?.data?.college?.name || "KIST College";

  const scrollTabs = (direction: number) => {
    if (tabNavRef.current) {
      tabNavRef.current.scrollBy({ left: direction * 200, behavior: "smooth" });
    }
  };

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="mx-auto max-w-350 pt-12 pb-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 mb-6 gap-2">
          <span className="hover:text-gray-900 transition-colors cursor-pointer">Home</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="hover:text-gray-900 transition-colors cursor-pointer">Admission</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="hover:text-gray-900 transition-colors cursor-pointer">+2 Admission</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">{collegeName}</span>
        </nav>

        <div className="mb-6">
          <h1 className="text-[28px] md:text-4xl font-bold text-gray-900">
            {collegeName} opens college visits and registration for top-25 merit scholarships
          </h1>
          <p className="text-sm text-gray-400 font-medium mt-2">
            Created 17 days ago &middot; Last modified 17 hours ago
          </p>
        </div>

        <div
          className="relative w-full h-[280px] md:h-[380px] bg-cover bg-center rounded-md overflow-hidden"
          style={{
            backgroundImage:
              "url('https://kist-edu-np.s3.ap-south-1.amazonaws.com/uploads/album/value/c0374b68ef663e539f7e6aea4b84625b2a207a981656053172.jpg')",
            backgroundPosition: "center 20%",
          }}
        >
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </div>

      {/* Sticky Tab Navigation */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 overflow-hidden">
        <div className="mx-auto max-w-350 relative">
          <button
            onClick={() => scrollTabs(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center md:hidden"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="overflow-x-auto no-scrollbar" ref={tabNavRef}>
            <nav className="flex space-x-8 whitespace-nowrap border-b border-gray-100">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={
                    activeTab === tab.id
                      ? "border-b-2 border-[#0000ff] py-4 text-[14px] font-bold text-gray-900"
                      : "border-b-2 border-transparent py-4 text-[14px] font-semibold text-gray-500 hover:text-gray-900 transition-colors"
                  }
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          <button
            onClick={() => scrollTabs(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center md:hidden"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="mx-auto max-w-350 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-10 bg-white">
        {/* Left: Main Content */}
        <div className="lg:col-span-2 min-h-[500px]">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-10">
              <div className="border border-gray-100 bg-white rounded-md p-5 sm:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-md bg-[#f0f4ff] flex items-center justify-center relative flex-shrink-0">
                      <Bell className="w-6 h-6 text-[#226ee7]" />
                      <span className="absolute -top-1 -left-1 text-[#60a5fa] text-[16px]">✨</span>
                    </div>
                    <div>
                      <span className="text-[13px] text-gray-500 font-medium">
                        {collegeName} Admissions
                      </span>
                      <h2 className="text-xl sm:text-[22px] font-bold text-[#111827] mt-0.5">
                        What&apos;s new?
                      </h2>
                    </div>
                  </div>
                  <button className="text-gray-500 hover:text-gray-700 mt-2">
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-5 text-gray-700 text-[15px] leading-relaxed">
                  <p className="mb-4">
                    All the latest updates regarding{" "}
                    <span className="font-semibold text-gray-900">
                      {collegeName} admissions 2026
                    </span>{" "}
                    are as follows:
                  </p>
                  <ul className="list-disc pl-5 space-y-3 mb-8">
                    <li>
                      The Registration for Grade 11 is expected to start in Aug, 2026 for admission to
                      the Science, Management, and Humanities courses.
                    </li>
                    <li>
                      The Pre-Registration portal is active. Students need to log in to the official
                      college portal to reserve their seats early and access their dashboard.
                    </li>
                    <li>
                      The KIST Entrance Examination registration link is active for admission to the +2
                      programmes. The round 1 window to view offers and make a decision will be opened
                      on{" "}
                      <span className="font-semibold text-gray-900">May 11, 2026</span> (10 AM).
                    </li>
                  </ul>

                  <div className="flex justify-center">
                    <button
                      onClick={() => setShowNotificationModal(true)}
                      className="bg-[#0000ff] hover:bg-[#0000cc] text-white font-semibold py-2.5 px-6 rounded-md flex items-center transition-colors text-sm"
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      Keep Me Notified
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-6 text-gray-600 text-[15px] md:text-[15.5px] leading-[1.8]">
                <h2 className="text-2xl font-bold text-gray-900">
                  Admissions Now Open for New Session
                </h2>
                <p className="text-gray-600">
                  {collegeName} announces the official opening of admissions for the upcoming academic
                  session. We invite prospective students to explore our comprehensive programs in
                  Science, Management, and Humanities. Our institution is dedicated to fostering an
                  environment of academic excellence, critical thinking, and holistic development. With
                  state-of-the-art facilities, highly qualified faculty, and a robust curriculum, KIST
                  prepares students to meet global challenges and excel in their chosen career paths.
                </p>
              </div>

              <div className="pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Programs</h2>
                <div className="space-y-6">
                  {programsData.map((prog, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-md p-6 bg-white">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-md bg-[#0000ff] flex items-center justify-center text-white flex-shrink-0">
                            <prog.icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{prog.title}</h3>
                            <p className="text-sm text-gray-500">NEB Affiliated | 2 Years Program</p>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${prog.badgeClass}`}
                        >
                          {prog.badge}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-4">{prog.desc}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-md p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">{prog.leftTitle}</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            {prog.leftItems.map((item, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#0000ff]" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-gray-50 rounded-md p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">{prog.rightTitle}</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            {prog.rightItems.map((item, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#0000ff]" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Eligibility Tab */}
          {activeTab === "eligibility" && (
            <div>
              <div className="mb-6">
                <h2 className="text-[22px] font-bold text-gray-900 mb-4">
                  Eligibility Criteria 2026
                </h2>
                <h3 className="text-[17px] font-bold text-gray-900 mb-4">Full time Courses</h3>

                <div className="overflow-x-auto rounded-md border border-gray-200">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-[#eff4fc] border-b border-gray-200">
                        <th className="p-4 font-bold text-gray-900 w-[8%] border-r border-gray-200">
                          S.N.
                        </th>
                        <th className="p-4 font-bold text-gray-900 w-[18%] border-r border-gray-200">
                          Level
                        </th>
                        <th className="p-4 font-bold text-gray-900 w-[24%] border-r border-gray-200">
                          Stream/Faculty
                        </th>
                        <th className="p-4 font-bold text-gray-900 w-[25%] border-r border-gray-200">
                          Eligibility
                        </th>
                        <th className="p-4 font-bold text-gray-900 w-[25%]">Required Documents</th>
                      </tr>
                    </thead>
                    <tbody className="text-[15px]">
                      {eligibilityData.map((row, idx) => (
                        <tr
                          key={idx}
                          className={
                            idx < eligibilityData.length - 1
                              ? "border-b border-gray-200 hover:bg-gray-50"
                              : "hover:bg-gray-50"
                          }
                        >
                          <td className="p-4 align-top border-r border-gray-200 text-gray-700">
                            {row.sn}
                          </td>
                          <td className="p-4 align-top border-r border-gray-200 font-semibold text-gray-900">
                            {row.level}
                          </td>
                          <td className="p-4 align-top border-r border-gray-200 text-gray-700">
                            {row.stream}
                          </td>
                          <td className="p-4 align-top border-r border-gray-200 text-gray-700">
                            {row.eligibility}
                          </td>
                          <td className="p-4 align-top text-gray-700">
                            <ul className="space-y-1 text-sm">
                              {row.docs.map((doc, i) => (
                                <li key={i} className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#0000ff]" />
                                  {doc}
                                </li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Admission Process Tab */}
          {activeTab === "process" && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Admission Process 2026
                </h2>
                <p className="text-gray-600">
                  Step-by-step guide for Science (+2) admission
                </p>
              </div>

              <div className="border border-gray-200 rounded-md p-6 mb-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#0000ff] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-3">
                      Entrance Form Fill Up
                    </h3>
                    <div className="space-y-3 text-sm text-gray-600">
                      <p>
                        Students should fill up the online admission form which will be available on
                        the college&apos;s website after the announcement of the Grade 10 (SEE) results.
                      </p>
                      <p>
                        The prospectus, fee structure, model questions, entrance center, entrance
                        symbol number, entrance date, and time will be sent to your registered email
                        ID. Along with the application form, students should attach a recently taken
                        photograph with a white background.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-md p-6 mb-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#0000ff] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-3">Entrance Exam</h3>
                    <div className="space-y-3 text-sm text-gray-600">
                      <ol className="space-y-3 list-decimal pl-5">
                        <li>
                          KMC will set an entrance exam. The date, time, and center of the entrance
                          exam will be sent to your email.
                        </li>
                        <li>
                          Entrance exam will be paper-based. Model questions will be provided through
                          email.
                        </li>
                        <li>
                          Students&apos; answer sheets will be checked by computer, so students are
                          advised to follow instructions given by invigilators.
                        </li>
                        <li>
                          Result of entrance will be published after 2nd day of the examination or
                          informed during examination.
                        </li>
                        <li>
                          Students who are listed in the merit list (all entrance-passed students may
                          not be included in the merit list) are informed to either proceed for direct
                          admission or an interview. Date of the interview will be given along with
                          the result.
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-md p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#0000ff] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-3">Admission</h3>
                    <div className="space-y-3 text-sm text-gray-600">
                      <ol className="space-y-3 list-decimal pl-5">
                        <li>
                          Students who are enlisted in direct admission from the entrance result
                          should not appear for the interview. They can get admitted directly within
                          the deadline. Those students who are listed for interview can get admission
                          only when they pass the interview.
                        </li>
                        <li>
                          KMC will publish a higher number of students on the merit list than its
                          intake capacity, so students are advised to secure admission before the
                          seats are filled.
                        </li>
                        <li>
                          KMC will provide scholarships to deserving students on a first-come,
                          first-served basis. Students are advised to secure admission before the
                          scholarship quota is filled (refer to the scholarship section for details).
                        </li>
                        <li>
                          Please ensure that you have accurate knowledge about the fee structure,
                          scholarships, and payment process.
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Facilities Tab */}
          {activeTab === "facilities" && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Facilities</h2>
                <p className="text-gray-600">
                  World-class infrastructure for holistic learning
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {facilitiesData.map((fac, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-md p-6">
                    <div className="w-12 h-12 rounded-md bg-[#0000ff] flex items-center justify-center text-white mb-4">
                      <fac.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{fac.title}</h3>
                    <p className="text-sm text-gray-600">{fac.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Courses & Fees Tab */}
          {activeTab === "courses" && (
            <div>
              <div className="mb-6">
                <h2 className="text-[22px] font-bold text-gray-900 mb-4">
                  {collegeName} of Science Fees & Eligibility
                </h2>
                <h3 className="text-[17px] font-bold text-gray-900 mb-4">Full time Courses</h3>

                <div className="overflow-x-auto rounded-md border border-gray-200">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-[#eff4fc] border-b border-gray-200">
                        <th className="p-4 font-bold text-gray-900 w-[28%] border-r border-gray-200">
                          Course
                        </th>
                        <th className="p-4 font-bold text-gray-900 w-[30%] border-r border-gray-200">
                          Total Fees
                        </th>
                        <th className="p-4 font-bold text-gray-900 w-[27%] border-r border-gray-200">
                          Application Date
                        </th>
                        <th className="p-4 font-bold text-gray-900 w-[15%]">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-[15px]">
                      {coursesData.map((row, idx) => (
                        <tr
                          key={idx}
                          className={
                            idx < coursesData.length - 1
                              ? "border-b border-gray-200 hover:bg-gray-50"
                              : "hover:bg-gray-50"
                          }
                        >
                          <td className="p-4 align-top border-r border-gray-200">
                            <div className="text-gray-900 font-semibold mb-1">{row.course}</div>
                            <span className="text-[#2563eb] text-sm hover:underline cursor-pointer flex items-center">
                              View Curriculum <ChevronRight className="w-3 h-3 ml-1" />
                            </span>
                          </td>
                          <td className="p-4 align-top border-r border-gray-200">
                            <div className="text-[#059669] mb-1">{row.fees}</div>
                            <span className="text-[#2563eb] text-sm hover:underline cursor-pointer flex items-center">
                              Check Details <ChevronRight className="w-3 h-3 ml-1" />
                            </span>
                          </td>
                          <td className="p-4 align-top border-r border-gray-200 text-gray-700">
                            {row.appDate}
                          </td>
                          <td className="p-4 align-top">
                            <span className="text-[#2563eb] hover:underline cursor-pointer flex items-center">
                              Apply Now <ChevronRight className="w-4 h-4 ml-1" />
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Scholarships Tab */}
          {activeTab === "scholarship" && (
            <div>
              <div className="pt-8">
                <h2 className="text-[22px] font-bold text-gray-900 mb-4">
                  Scholarships Overview
                </h2>

                <div className="overflow-x-auto rounded-md border border-gray-200">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-[#eff4fc] border-b border-gray-200">
                        <th className="p-4 font-bold text-gray-900 w-[18%] border-r border-gray-200">
                          Scholarship
                        </th>
                        <th className="p-4 font-bold text-gray-900 w-[10%] border-r border-gray-200">
                          Level
                        </th>
                        <th className="p-4 font-bold text-gray-900 w-[15%] border-r border-gray-200">
                          Stream
                        </th>
                        <th className="p-4 font-bold text-gray-900 w-[12%] border-r border-gray-200">
                          Coverage
                        </th>
                        <th className="p-4 font-bold text-gray-900 w-[20%] border-r border-gray-200">
                          Eligibility
                        </th>
                        <th className="p-4 font-bold text-gray-900 w-[10%] border-r border-gray-200">
                          Seats
                        </th>
                        <th className="p-4 font-bold text-gray-900 w-[15%]">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-[15px]">
                      {scholarshipData.map((row, idx) => (
                        <tr
                          key={idx}
                          className={
                            idx < scholarshipData.length - 1
                              ? "border-b border-gray-200 hover:bg-gray-50"
                              : "hover:bg-gray-50"
                          }
                        >
                          <td className="p-4 align-top border-r border-gray-200">
                            <div className="text-gray-900 font-semibold mb-1">{row.name}</div>
                            <span className="text-[#2563eb] text-sm hover:underline cursor-pointer flex items-center">
                              View Scholarship <ChevronRight className="w-3 h-3 ml-1" />
                            </span>
                          </td>
                          <td className="p-4 align-top border-r border-gray-200 text-gray-700">
                            {row.level}
                          </td>
                          <td className="p-4 align-top border-r border-gray-200 text-gray-700">
                            {row.stream}
                          </td>
                          <td className="p-4 align-top border-r border-gray-200 text-gray-700">
                            {row.coverage}
                          </td>
                          <td className="p-4 align-top border-r border-gray-200 text-gray-700">
                            {row.eligibility}
                          </td>
                          <td className="p-4 align-top border-r border-gray-200 text-gray-700">
                            {row.seats}
                          </td>
                          <td className="p-4 align-top">
                            <span className="text-[#2563eb] hover:underline cursor-pointer flex items-center">
                              Download File <Download className="w-4 h-4 ml-1" />
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === "contact" && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h2>
                <p className="text-gray-600">Get in touch with our admission team</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {staffData.map((staff, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-md p-6 bg-white">
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={staff.img}
                        alt={staff.name}
                        className="w-20 h-20 rounded-md object-cover flex-shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900">{staff.name}</h4>
                        <p className="text-sm text-[#0000ff] font-medium">{staff.role}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4 text-[#0000ff]" />
                        <span>{staff.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4 text-[#0000ff]" />
                        <a
                          href={`mailto:${staff.email}`}
                          className="hover:text-[#0000ff] transition"
                        >
                          {staff.email}
                        </a>
                      </div>
                    </div>
                    <a
                      href={`https://wa.me/${staff.wa}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-[#0000ff] hover:bg-[#0000cc] text-white font-semibold py-2.5 px-4 rounded-md transition-colors text-sm"
                    >
                      <WhatsAppIcon className="w-5 h-5" />
                      Message on WhatsApp
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === "faq" && (
            <div>
              <div className="mb-6">
                <h2 className="text-[20px] font-bold text-gray-900">
                  Frequently Asked Questions
                </h2>
                <p className="text-[14px] text-gray-500 mt-1">
                  Find answers to common questions
                </p>
              </div>

              <div className="space-y-3">
                {faqData.map((faq, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-md overflow-hidden border border-gray-100"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left transition"
                    >
                      <span className="font-semibold text-gray-900 text-[15px] pr-4">
                        Q: {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${
                          openFaq === idx ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openFaq === idx && (
                      <div className="px-5 pb-4">
                        <p className="text-[14px] text-gray-600 leading-relaxed">{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-md p-5 text-white">
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="font-bold text-white text-[15px] mb-2">
                  Are You Interested in this College?
                </h3>
                <p className="text-[13px] text-white/90 leading-relaxed mb-3">
                  Apply now or download the brochure for more information about programs and
                  admission process.
                </p>
              </div>
              <div className="space-y-3 pt-4 border-t border-blue-500/50">
                <button className="w-full flex items-center justify-center bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-4 rounded-md transition-colors text-sm">
                  Apply Now
                </button>
                <button className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-400 text-white font-semibold py-3 px-4 rounded-md transition-colors text-sm">
                  Download Brochure
                  <Download className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-md p-5">
            <h3 className="font-bold text-gray-900 text-[18px] mb-5">Contact Information</h3>

            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-[13px]">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-gray-900 font-bold text-[13px]">Address</span>
                  <span className="text-gray-500 font-medium text-[12px]">
                    Kamalpokhari, Kathmandu
                    <br />
                    Bagmati Province, Nepal
                  </span>
                </div>
              </li>
              <li className="flex items-center gap-3 text-[13px]">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-gray-900 font-bold text-[13px]">Phone</span>
                  <a
                    href="tel:01-4112222"
                    className="text-gray-500 font-medium text-[12px] hover:text-emerald-600 transition"
                  >
                    01-4112222, 4112233
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3 text-[13px]">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-gray-900 font-bold text-[13px]">Email</span>
                  <a
                    href="mailto:admission@kist.edu.np"
                    className="text-gray-500 font-medium text-[12px] hover:text-red-500 transition"
                  >
                    admission@kist.edu.np
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3 text-[13px]">
                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-gray-900 font-bold text-[13px]">Website</span>
                  <a
                    href="https://kist.edu.np"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 font-medium text-[12px] hover:underline transition"
                  >
                    kist.edu.np
                  </a>
                </div>
              </li>
            </ul>

            <div className="mt-5">
              <h4 className="font-bold text-gray-900 text-[13px] mb-3">Follow Us</h4>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1877F2] hover:opacity-80 transition"
                >
                  <FacebookIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E4405F] hover:opacity-80 transition"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://www.youtube.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FF0000] hover:opacity-80 transition"
                >
                  <YoutubeIcon className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-gray-100">
              <h4 className="font-bold text-gray-900 text-[13px] mb-3">Location</h4>
              <div className="rounded-md overflow-hidden border border-gray-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.4762842059996!2d85.32!3d27.71!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb190c0b8c5e01%3A0x1234567890abcdef!2sKamalpokhari%2C%20Kathmandu!5e0!3m2!1sen!2snp!4v1234567890"
                  width="100%"
                  height="150"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="College Location"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-900/40 transition-opacity backdrop-blur-sm"
              onClick={() => setShowNotificationModal(false)}
            />
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-md px-4 pt-5 pb-4 text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6 relative">
              <button
                onClick={() => setShowNotificationModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="px-2 pt-2">
                <h3
                  className="text-[17px] font-bold text-gray-900 leading-snug mb-5"
                  id="modal-title"
                >
                  To get Recommendations &amp; Alerts, please share these details
                </h3>

                <div className="space-y-4">
                  <div className="relative">
                    <select className="w-full px-3 py-2.5 border border-gray-400 rounded-md text-[15px] text-gray-500 appearance-none bg-white focus:outline-none focus:border-gray-600 transition-colors">
                      <option value="" disabled selected hidden>
                        Course you&apos;re interested in
                      </option>
                      <option value="science">Science (+2)</option>
                      <option value="management">Management (+2)</option>
                      <option value="humanities">Humanities (+2)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-900">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>

                  <div>
                    <input
                      type="email"
                      placeholder="Add Gmail"
                      className="w-full px-3 py-2.5 border border-gray-400 rounded-md text-[15px] text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:border-gray-600 transition-colors"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      placeholder="Contact Number"
                      className="w-full px-3 py-2.5 border border-gray-400 rounded-md text-[15px] text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:border-gray-600 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-center pb-2">
                <button
                  type="button"
                  onClick={() => setShowNotificationModal(false)}
                  className="rounded-md px-6 py-2 bg-[#0000ff] text-[15px] font-bold text-white hover:bg-[#0000cc] focus:outline-none transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
