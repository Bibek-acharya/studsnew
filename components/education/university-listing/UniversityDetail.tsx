"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ContactInfoRow from "@/app/find-college/[id]/components/ContactInfoRow";
import ReviewCard from "@/app/find-college/[id]/components/ReviewCard";
import RatingBar from "@/app/find-college/[id]/components/RatingBar";
import ShareCollegeModal from "@/app/find-college/[id]/ShareCollegeModal";
import {
  BadgeCheck,
  MapPin,
  Star,
  Building2,
  Download,
  Share2,
  Play,
  Video,
  MessageSquareQuote,
  Eye,
  Target,
  Gem,
  Landmark,
  Users,
  Layers,
  Globe2,
  Award,
  BookOpen,
  Briefcase,
  Scale,
  Cpu,
  Stethoscope,
  TreePine,
  Clock,
  Heart,
  ChevronRight,
  FileDown,
  ChevronDown,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";

type TabKey =
  | "tab-about"
  | "tab-courses"
  | "tab-institutes"
  | "tab-admissions"
  | "tab-scholarship"
  | "tab-events"
  | "tab-news"
  | "tab-download"
  | "tab-gallery"
  | "tab-review";

const TABS: { key: TabKey; label: string }[] = [
  { key: "tab-about", label: "About" },
  { key: "tab-courses", label: "Courses & Fees" },
  { key: "tab-institutes", label: "Institute / Faculties" },
  { key: "tab-admissions", label: "Admissions" },
  { key: "tab-scholarship", label: "Scholarship" },
  { key: "tab-events", label: "Events" },
  { key: "tab-news", label: "News & Notices" },
  { key: "tab-download", label: "Download" },
  { key: "tab-gallery", label: "Gallery" },
  { key: "tab-review", label: "Review" },
];

const coursesData = [
  { level: "Bachelor", name: "B.Tech Computer Science", sub: "AI, Data Science", duration: "4 Year", durationSub: "Full Time", fee: "Rs. 4,50,000", eligibility: "10+2 with 75% (PCM)", seats: "120 Seats" },
  { level: "Bachelor", name: "BBA Finance", sub: "Finance, Accounting", duration: "3 Year", durationSub: "Full Time", fee: "Rs. 2,80,000", eligibility: "10+2 with 60%", seats: "90 Seats" },
  { level: "Bachelor", name: "B.Sc. CSIT", sub: "Computing", duration: "4 Year", durationSub: "Semester", fee: "Rs. 3,20,000", eligibility: "10+2 with 65%", seats: "100 Seats" },
  { level: "Master", name: "MBA Financial Mgt", sub: "Finance", duration: "2 Year", durationSub: "Full Time", fee: "Rs. 3,50,000", eligibility: "Bachelor's Degree (Min 50%)", seats: "60 Seats" },
  { level: "Master", name: "M.Sc. Data Science", sub: "ML & AI", duration: "2 Year", durationSub: "Full Time", fee: "Rs. 3,00,000", eligibility: "B.Sc. CSIT / related", seats: "40 Seats" },
  { level: "Master", name: "MA Sociology", sub: "Anthropology", duration: "2 Year", durationSub: "Yearly", fee: "Rs. 1,20,000", eligibility: "Bachelor's degree", seats: "80 Seats" },
];

const institutesData = [
  {
    id: "inst-eng",
    icon: Cpu,
    title: "Institute of Engineering",
    colleges: [
      { sn: 1, name: "Pulchowk Engineering Campus", address: "Pulchowk", district: "Lalitpur", programs: "BE Civil-120, BE Computer-60, BE Electrical-60" },
      { sn: 2, name: "Thapathali Campus", address: "Thapathali", district: "Kathmandu", programs: "BE Civil-100, BE Mechanical-50, B.Arch-40" },
      { sn: 3, name: "Paschimanchal Campus", address: "Lamachour", district: "Pokhara", programs: "BE Civil-80, BE Electrical-40" },
      { sn: 4, name: "Purwanchal Campus", address: "Dharan", district: "Sunsari", programs: "BE Civil-60, BE Computer-40" },
    ],
  },
  {
    id: "inst-med",
    icon: Stethoscope,
    title: "Institute of Medicine",
    colleges: [
      { sn: 1, name: "Maharajgunj Medical Campus", address: "Maharajgunj", district: "Kathmandu", programs: "MBBS-100, MD/MS-80, BSc Nursing-60" },
      { sn: 2, name: "BP Koirala Institute of Health Sciences", address: "Dharan", district: "Sunsari", programs: "MBBS-150, BDS-40, BSc Nursing-80" },
      { sn: 3, name: "Kanti Children's Hospital", address: "Maharajgunj", district: "Kathmandu", programs: "MD Pediatrics-20, Fellowship-15" },
      { sn: 4, name: "National Academy of Medical Sciences", address: "Kathmandu", district: "Kathmandu", programs: "MBBS-50, BSc Nursing-40, MD-30" },
    ],
  },
  {
    id: "inst-for",
    icon: TreePine,
    title: "Institute of Forestry",
    colleges: [
      { sn: 1, name: "Hetauda Campus", address: "Hetauda", district: "Makwanpur", programs: "BSc Forestry-50, MSc Forestry-25" },
      { sn: 2, name: "Pokhara Campus", address: "Pokhara", district: "Kaski", programs: "BSc Forestry-40, BSc Natural Resources-30" },
    ],
  },
];

const facultiesData = [
  {
    id: "fac-management",
    icon: Briefcase,
    title: "Faculty of Management",
    hasTable: true,
    programs: [
      { sn: 1, name: "Bachelor of Arts (BA)", duration: "4 Years", system: "Yearly" },
      { sn: 2, name: "Bachelor of Arts (BA Honours)", duration: "4 Years", system: "Yearly" },
      { sn: 3, name: "Bachelor of Social Work (BSW)", duration: "4 Years/8 Semesters", system: "Semester" },
      { sn: 4, name: "Bachelor of Mass Communication & Journalism (BAMCJ)", duration: "4 Years/8 Semesters", system: "Semester" },
      { sn: 5, name: "Bachelor of Media Technology (BMT)", duration: "4 Years/8 Semesters", system: "Semester" },
      { sn: 6, name: "Bachelor of Liberal Arts & Science (BLAS)", duration: "4 Years/8 Semesters", system: "Semester" },
      { sn: 7, name: "Bachelor of Interior Design (BID)", duration: "4 Years/8 Semesters", system: "Semester" },
      { sn: 8, name: "Master of Journalism & Mass Communication (MAMCJ)", duration: "2 Years/4 Semesters", system: "Semester" },
      { sn: 9, name: "Master of Media Technology (MMT)", duration: "2 Years/4 Semesters", system: "Semester" },
      { sn: 10, name: "Master of Development Studies (MDEVS)", duration: "2 Years/4 Semesters", system: "Semester" },
      { sn: 11, name: "Master of Development Communication (MDC)", duration: "2 Years/4 Semesters", system: "Semester" },
      { sn: 12, name: "Master of Science in Population & Rural Development", duration: "2 Years/4 Semesters", system: "Semester" },
      { sn: 13, name: "Master of Sociology/Anthropology", duration: "2 Years", system: "Yearly" },
      { sn: 14, name: "Master of Social Work (MSW)", duration: "2 Years/4 Semesters", system: "Semester" },
    ],
  },
  {
    id: "fac-humanities",
    icon: Users,
    title: "Faculty of Humanities",
    hasTable: true,
    programs: [
      { sn: 1, name: "BA Sociology", duration: "4 Years", system: "Yearly" },
      { sn: 2, name: "BA English", duration: "4 Years", system: "Yearly" },
      { sn: 3, name: "BA History", duration: "4 Years", system: "Yearly" },
      { sn: 4, name: "BA Economics", duration: "4 Years", system: "Yearly" },
      { sn: 5, name: "BA Psychology", duration: "4 Years", system: "Semester" },
      { sn: 6, name: "MA Sociology", duration: "2 Years", system: "Semester" },
      { sn: 7, name: "MA English", duration: "2 Years", system: "Semester" },
      { sn: 8, name: "MA History", duration: "2 Years", system: "Yearly" },
    ],
  },
  {
    id: "fac-law",
    icon: Scale,
    title: "Faculty of Law",
    hasTable: true,
    programs: [
      { sn: 1, name: "LL.B. (Bachelor of Laws)", duration: "5 Years", system: "Semester" },
      { sn: 2, name: "LL.M. (Master of Laws)", duration: "2 Years", system: "Semester" },
      { sn: 3, name: "BA LL.B. (Integrated)", duration: "5 Years", system: "Semester" },
      { sn: 4, name: "PG Diploma in Constitutional Law", duration: "1 Year", system: "Yearly" },
      { sn: 5, name: "PG Diploma in International Law", duration: "1 Year", system: "Yearly" },
    ],
  },
];

const affiliatedColleges = [
  { sn: 1, name: "Janta Adarsha Multiple Campus", address: "Biratnagar", district: "Morang", programs: "BSW-48, PGDCP-33, MSW-33" },
  { sn: 2, name: "Chakrabarti Habi Educational Academy", address: "Kathmandu", district: "Kathmandu", programs: "BA (Hon.)-100, MA (Eng.)-100" },
  { sn: 3, name: "College of Journalism & Mass Communication", address: "Kathmandu", district: "Kathmandu", programs: "BAMCJ-25, MAMCJ-25, MDC-25" },
  { sn: 4, name: "Kadambari Memorial College of Science & Management", address: "Kathmandu", district: "Kathmandu", programs: "BSW-48, MSW-33" },
  { sn: 5, name: "Kantipur International College", address: "Kathmandu", district: "Kathmandu", programs: "BID-96" },
  { sn: 6, name: "Karfok Bidya Mandir Multiple Campus", address: "Karfok", district: "Ilam", programs: "B.A.-40" },
  { sn: 7, name: "Shepherd College", address: "Kathmandu", district: "Kathmandu", programs: "BMT-48, MMT-33" },
  { sn: 8, name: "Himalayan Whitehouse Int'l College", address: "Kathmandu", district: "Kathmandu", programs: "BLAS-25" },
  { sn: 9, name: "Centre of Population and Development (CPAD)", address: "Biratnagar", district: "Morang", programs: "M. Sc. PRD-33" },
  { sn: 10, name: "Kantipur City College", address: "Kathmandu", district: "Kathmandu", programs: "MAMCJ-33" },
  { sn: 11, name: "Polygon College", address: "Kathmandu", district: "Kathmandu", programs: "MAMCJ-40" },
  { sn: 12, name: "Global College of Social Science & Technology", address: "Kathmandu", district: "Kathmandu", programs: "MDS-33" },
  { sn: 13, name: "Sagarmatha Multiple College", address: "Kathmandu", district: "Kathmandu", programs: "MA (Sociology/Anthropology)-50" },
];

const admissionsData = [
  { status: "Ongoing", statusColor: "bg-[#10b981]", statusBg: "bg-[#ecfdf5]", statusText: "text-[#10b981]", title: "Bachelor In Information Technology", campus: "Main Campus", faculty: "Faculty of Science", openDate: "20th Dec, 2025", deadline: "20th Dec, 2025" },
  { status: "Closed", statusColor: "bg-[#ef4444]", statusBg: "bg-[#fef2f2]", statusText: "text-[#ef4444]", title: "Master of Business Administration", campus: "Main Campus", faculty: "Faculty of Mgt", openDate: "1st Aug, 2025", deadline: "30th Sep, 2025" },
];

const scholarshipsData = [
  { level: "+2", program: "+2 Science", name: "Merit Scholarship", benefit: "Up to 100% waiver", forWhom: "Top 5% in SEE" },
  { level: "+2", program: "+2 Management", name: "Need-Based Grant", benefit: "Variable", forWhom: "Low income families" },
  { level: "Bachelor", program: "B.Sc. CSIT", name: "Merit Scholarship", benefit: "Up to 100% waiver", forWhom: "60%+ in +2" },
  { level: "Bachelor", program: "BBA", name: "Sports Excellence", benefit: "Fee reduction", forWhom: "State/national players" },
  { level: "Master", program: "MBA", name: "Merit Scholarship", benefit: "50% waiver", forWhom: "70% in Bachelor" },
];

const eventsData = [
  { date: "15", month: "MAY", color: "text-blue-600", bg: "bg-blue-50", title: "International Conference on AI", time: "10:00 AM - 4:00 PM", desc: "Central Library Auditorium. Keynote by Prof. Yoshua Bengio." },
  { date: "22", month: "JUN", color: "text-green-600", bg: "bg-green-50", title: "Alumni Meet 2025", time: "5:00 PM onwards", desc: "University Guest House. Registration open." },
  { date: "05", month: "JUL", color: "text-purple-600", bg: "bg-purple-50", title: "Research Symposium 2025", time: "9:00 AM - 3:00 PM", desc: "Present your research. Prizes for best papers." },
  { date: "12", month: "AUG", color: "text-amber-600", bg: "bg-amber-50", title: "Career Fair 2025", time: "10:00 AM - 5:00 PM", desc: "50+ top companies participating. Register now." },
];

const newsData = [
  { tag: "Exam", tagBg: "bg-orange-50", tagText: "text-orange-500", img: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=800&auto=format&fit=crop", title: "JEE Main 2025: Registration Process Extended.", desc: "NTA extends JEE Main 2025 registration deadline due to high volume of applications.", time: "2 days ago" },
  { tag: "Admission", tagBg: "bg-blue-50", tagText: "text-blue-500", img: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop", title: "UG Admissions 2025 Open", desc: "Apply now for all bachelor programs. Last date extended.", time: "5 days ago" },
  { tag: "Scholarship", tagBg: "bg-green-50", tagText: "text-green-600", img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop", title: "Merit Scholarship 2025 Application Open", desc: "Apply for merit-based scholarships for outstanding students.", time: "1 week ago" },
];

const downloadsData = [
  { icon: BookOpen, color: "bg-blue-100", iconColor: "text-blue-600", hoverBorder: "hover:border-blue-200", title: "General Prospectus 2025", meta: "PDF, 12 MB · Updated Feb 2025", btnColor: "text-blue-600 hover:text-blue-700" },
  { icon: Building2, color: "bg-green-100", iconColor: "text-green-600", hoverBorder: "hover:border-blue-200", title: "Course Guide (Bachelor)", meta: "PDF, 8.5 MB · Updated Jan 2025", btnColor: "text-green-600 hover:text-green-700" },
  { icon: FileDown, color: "bg-purple-100", iconColor: "text-purple-600", hoverBorder: "hover:border-blue-200", title: "Scholarship Application Form", meta: "DOCX, 2.1 MB", btnColor: "text-purple-600 hover:text-purple-700" },
  { icon: Landmark, color: "bg-amber-100", iconColor: "text-amber-600", hoverBorder: "hover:border-blue-200", title: "International Student Guide", meta: "PDF, 5.3 MB", btnColor: "text-amber-600 hover:text-amber-700" },
];

const galleryImages = [
  { url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=500&auto=format&fit=crop", title: "Main Campus Building", folder: "Campus" },
  { url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=500&auto=format&fit=crop", title: "Graduation Ceremony", folder: "Events" },
  { url: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=500&auto=format&fit=crop", title: "Campus Landscape", folder: "Campus" },
  { url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=500&auto=format&fit=crop", title: "Classroom Session", folder: "Events" },
  { url: "https://images.unsplash.com/photo-1555438848-18e874ce2ab2?q=80&w=500&auto=format&fit=crop", title: "Library Interior", folder: "Campus" },
  { url: "https://images.unsplash.com/photo-1541829070764-84a5d30cb270?q=80&w=500&auto=format&fit=crop", title: "Sports Event", folder: "Events" },
  { url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=500&auto=format&fit=crop", title: "Students in Library", folder: "Campus" },
  { url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=500&auto=format&fit=crop", title: "Lab Session", folder: "Events" },
  { url: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=800&auto=format&fit=crop", title: "Cultural Program", folder: "Events" },
  { url: "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?q=80&w=500&auto=format&fit=crop", title: "Research Center", folder: "Campus" },
  { url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=500&auto=format&fit=crop", title: "Award Ceremony", folder: "Events" },
];

const overviewData = [
  { label: "Established", value: "1959 (2016 B.S.)" },
  { label: "Founder", value: "King Mahendra Bir Bikram Shah Dev" },
  { label: "Location", value: "Kirtipur, Kathmandu (Central Campus)" },
  { label: "Campus Size", value: "154.77 hectares (Main campus)" },
  { label: "Type", value: "Public / Non-profit / Autonomous" },
  { label: "Chancellor", value: "Rt. Hon'ble Prime Minister of Nepal" },
  { label: "Vice-Chancellor", value: "Prof. Dr. Dharma Kant Baskota" },
  { label: "Students (Total)", value: "Approx. 400,000+ (all campuses)" },
  { label: "Teaching Staff", value: "7,938 (constituent campuses)" },
  { label: "Non-Teaching Staff", value: "8,124" },
  { label: "Constituent Campuses", value: "64" },
  { label: "Affiliated Colleges", value: "1,053" },
  { label: "Central Departments", value: "40" },
  { label: "Research Centers", value: "4 (CNAS, CEDA, CERID, REC)" },
  { label: "International Collaborations", value: "200+ universities worldwide" },
];

const leadershipData = [
  { position: "Chancellor", role: "Ceremonial head (Prime Minister)", holder: "Rt. Hon'ble Prime Minister" },
  { position: "Vice Chancellor", role: "Chief Executive", holder: "Prof. Dr. Dharma Kant Baskota" },
  { position: "Rector", role: "Academic affairs", holder: "Prof. Dr. Khadga K.C." },
  { position: "Registrar", role: "Administration & finance", holder: "Prof. Dr. Kedar Prasad Rijal" },
  { position: "Dean, IOST", role: "Institute of Science & Tech", holder: "Prof. Dr. Sushil Kumar Jha" },
  { position: "Dean, IoM", role: "Institute of Medicine", holder: "Prof. Dr. Jagadish Prasad Agrawal" },
  { position: "Dean, FOHSS", role: "Humanities & Social Sciences", holder: "Prof. Dr. Puspa Raj Kadel" },
];

const UniversityDetail: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("tab-about");
  const [courseFilter, setCourseFilter] = useState("all");
  const [scholarFilter, setScholarFilter] = useState("all");
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const [isFollowed, setIsFollowed] = useState(false);
  const [showUnfollowDialog, setShowUnfollowDialog] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const name = "Tribhuvan University";
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = `${name} - Studsphere`;
  const shareText = `Check out ${name} on Studsphere`;

  const toggleDropdown = (id: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const closeLightbox = () => setLightboxIndex(null);

  const changeImage = (dir: number) => {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      const next = prev + dir;
      if (next < 0) return galleryImages.length - 1;
      if (next >= galleryImages.length) return 0;
      return next;
    });
  };

  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") changeImage(-1);
      if (e.key === "ArrowRight") changeImage(1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex]);

  return (
    <>
    <div className="w-full bg-white font-sans">
      {/* Banner */}
      <div className="h-[220px] w-full bg-brand-blue md:h-[360px]" />

      <div className="relative bg-white">
        <div className="relative px-6 pb-8 md:px-12 lg:px-24 xl:px-32">
          {/* Logo */}
          <div className="absolute -top-2 left-6 z-10 flex h-[120px] w-[120px] items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-white p-2 shadow-[0_4px_20px_-3px_rgba(0,0,0,0.1)] md:-top-4 md:left-12 md:h-[150px] md:w-[150px] lg:left-24 xl:left-32">
            <Image
              src="https://goldengateintl.com/wp-content/uploads/2023/05/Untitled-design-1.png"
              alt="University Logo"
              width={150}
              height={150}
              className="h-full w-full object-contain"
            />
          </div>

          {/* Profile Header */}
          <div className="flex flex-col items-start justify-between pt-20 lg:flex-row lg:items-end lg:pt-6 lg:ml-[180px]">
            <div className="w-full space-y-3 lg:w-auto">
              <div className="flex items-center gap-2">
                <h1 className="text-[24px] font-bold tracking-tight text-gray-900 md:text-3xl">
                  Tribhuvan University
                </h1>
                <BadgeCheck className="h-6 w-6 fill-blue-500 text-white" />
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                <Star className="h-4 w-4 fill-blue-500 text-blue-500" />
                <span className="text-[14px] font-bold text-gray-900">4.8</span>
                <span className="text-[14px] text-gray-500">(12,024 Reviews)</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (isFollowed) {
                    setShowUnfollowDialog(true);
                  } else {
                    setIsFollowed(true);
                  }
                }}
                className={`flex items-center justify-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors ${
                  isFollowed
                    ? "bg-green-300 text-gray-800 hover:bg-green-400"
                    : "bg-brand-blue text-white hover:bg-brand-hover"
                }`}
              >
                <i className={`fa-solid ${isFollowed ? "fa-check" : "fa-plus"}`}></i>
                {isFollowed ? "Following" : "Follow"}
              </button>
            </div>

            <div className="mt-8 flex w-full items-center gap-3 lg:mt-0 lg:w-auto">
              <Link
                href="/universities/tribhuvan-university/affiliated-colleges"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-[15px] font-semibold text-white shadow-sm shadow-blue-600/20 transition-colors hover:bg-blue-700 lg:flex-none"
              >
                <Building2 className="h-4 w-4" />
                View Affiliated Colleges
              </Link>
              <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-[15px] font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50">
                <Download className="h-4 w-4" />
                Prospectus
              </button>
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-3 text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Nav */}
        <div className="sticky top-0 z-40 overflow-x-auto border-b border-t border-gray-100 bg-white px-6 shadow-sm shadow-gray-100/50 no-scrollbar md:px-12 lg:px-24 xl:px-32">
          <nav className="flex space-x-8 whitespace-nowrap" id="tab-nav">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`border-b-2 py-4 text-[15px] transition-colors ${
                  activeTab === tab.key
                    ? "border-blue-600 font-bold text-gray-900"
                    : "border-transparent font-semibold text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 bg-[#fafbfc] px-6 py-8 md:gap-8 md:px-12 md:py-12 lg:grid-cols-3 lg:px-24 xl:px-32">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* ========== ABOUT ========== */}
            {activeTab === "tab-about" && (
              <div className="space-y-10">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-8">
                  <div className="group relative h-[240px] cursor-pointer overflow-hidden rounded-[24px] shadow-sm md:h-[300px]">
                    <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop" alt="University Message" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 transition-colors duration-300 group-hover:bg-black/40">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 pl-1 shadow-[0_8px_30px_rgba(0,0,0,0.2)] backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                        <Play className="h-7 w-7 fill-blue-600 text-blue-600" />
                      </div>
                    </div>
                    <div className="absolute inset-0 z-20 flex flex-col justify-end bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/30 to-transparent p-6 md:p-8">
                      <h3 className="mb-1.5 flex items-center gap-2.5 text-[19px] font-bold text-white md:text-[21px]">
                        <MessageSquareQuote className="h-5 w-5 text-blue-400" /> VC's Message
                      </h3>
                      <p className="line-clamp-1 text-[14px] text-gray-200">Listen to our Vice-Chancellor's welcome</p>
                    </div>
                  </div>
                  <div className="group relative h-[240px] cursor-pointer overflow-hidden rounded-[24px] shadow-sm md:h-[300px]">
                    <img src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2086&auto=format&fit=crop" alt="Campus Tour" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 transition-colors duration-300 group-hover:bg-black/40">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 pl-1 shadow-[0_8px_30px_rgba(0,0,0,0.2)] backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                        <Play className="h-7 w-7 fill-blue-600 text-blue-600" />
                      </div>
                    </div>
                    <div className="absolute inset-0 z-20 flex flex-col justify-end bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/30 to-transparent p-6 md:p-8">
                      <h3 className="mb-1.5 flex items-center gap-2.5 text-[19px] font-bold text-white md:text-[21px]">
                        <Video className="h-5 w-5 text-blue-400" /> Campus Tour
                      </h3>
                      <p className="line-clamp-1 text-[14px] text-gray-200">Explore our beautiful university campus</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 text-[15px] leading-[1.8] text-gray-600 md:text-[16px]">
                  <p className="text-lg font-medium text-gray-800">Welcome to Tribhuvan University – the pioneer of higher education in Nepal.</p>
                  <p>Established in 1959, <strong className="font-bold text-gray-900">Tribhuvan University (TU)</strong> is the oldest and largest university in Nepal. With a central campus in Kirtipur and numerous constituent and affiliated colleges across the country, TU has been the cornerstone of academic excellence for over six decades. It is a non-profit, autonomous institution funded by the Government of Nepal, dedicated to providing accessible and quality education to all.</p>
                  <p>The university comprises <strong className="text-gray-900">5 institutes, 4 faculties, 40 central departments, 64 constituent campuses, and over 1,050 affiliated colleges</strong>. It offers a vast range of programs from intermediate to PhD levels in fields such as humanities, management, science, technology, medicine, engineering, forestry, and agriculture. With more than 50,000 students enrolled in central departments alone, TU is one of the largest universities in the world by enrollment.</p>
                  <p>Our mission is to produce socially responsible, skilled, and research-oriented graduates who can contribute to the nation's development. We foster a vibrant academic environment with state-of-the-art laboratories, a central library housing thousands of volumes, and collaborations with over 200 international universities.</p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="rounded-[20px] bg-[#f4f7fb] p-8">
                    <div className="mb-4 flex items-center gap-3.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100/80 text-blue-600"><Eye className="h-5 w-5" /></div>
                      <h3 className="text-[16px] font-bold text-gray-900">Our Vision</h3>
                    </div>
                    <p className="text-[14.5px] leading-[1.7] text-gray-600">To be a leading center of higher learning globally recognized for excellence in research, teaching, and contribution to society's progress.</p>
                  </div>
                  <div className="rounded-[20px] bg-[#f0fdf4] p-8">
                    <div className="mb-4 flex items-center gap-3.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100/80 text-green-600"><Target className="h-5 w-5" /></div>
                      <h3 className="text-[16px] font-bold text-gray-900">Our Mission</h3>
                    </div>
                    <p className="text-[14.5px] leading-[1.7] text-gray-600">To provide affordable, quality higher education that empowers individuals and cultivates intellectual growth across diverse communities.</p>
                  </div>
                  <div className="rounded-[20px] bg-[#fef2f2] p-8">
                    <div className="mb-4 flex items-center gap-3.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500"><Gem className="h-5 w-5" /></div>
                      <h3 className="text-[16px] font-bold text-gray-900">Core Values</h3>
                    </div>
                    <p className="text-[14.5px] leading-[1.7] text-gray-600">Excellence, Inclusivity, Integrity, Innovation, and Social Responsibility.</p>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm">
                  <div className="border-b border-gray-100 bg-[#f8fafc] px-6 py-4">
                    <h3 className="flex items-center gap-2 text-[16px] font-bold text-gray-900"><Landmark className="h-5 w-5 text-blue-600" /> University Overview</h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {overviewData.map((row) => (
                      <div key={row.label} className="flex flex-col p-4 transition-colors hover:bg-gray-50 sm:flex-row">
                        <div className="w-full text-[14px] font-semibold text-gray-800 sm:w-1/3">{row.label}</div>
                        <div className="w-full text-[14px] text-gray-600 sm:w-2/3">{row.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm">
                  <div className="border-b border-gray-100 bg-[#f8fafc] px-6 py-4">
                    <h3 className="flex items-center gap-2 text-[16px] font-bold text-gray-900"><Users className="h-5 w-5 text-blue-600" /> Leadership & Administration</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[14px] text-gray-600">
                      <thead className="border-b border-gray-100 bg-gray-50/50 text-[13px] uppercase tracking-wider text-gray-800">
                        <tr><th className="px-6 py-4 font-bold">Position</th><th className="px-6 py-4 font-bold">Role</th><th className="px-6 py-4 font-bold">Current Holder</th></tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {leadershipData.map((row) => (
                          <tr key={row.position}>
                            <td className="px-6 py-4 font-bold text-gray-900">{row.position}</td>
                            <td className="px-6 py-4">{row.role}</td>
                            <td className="px-6 py-4 font-semibold">{row.holder}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="flex items-start gap-4 rounded-xl border border-blue-100 bg-blue-50 p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100"><Layers className="h-5 w-5 text-blue-600" /></div>
                    <div><h4 className="text-[15px] font-bold text-gray-900">Semester System</h4><p className="mt-1 text-[14px] text-gray-600">Implemented at master's level, expanding to undergraduate for timely completion.</p></div>
                  </div>
                  <div className="flex items-start gap-4 rounded-xl border border-emerald-100 bg-emerald-50 p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100"><Globe2 className="h-5 w-5 text-emerald-600" /></div>
                    <div><h4 className="text-[15px] font-bold text-gray-900">Global Ties</h4><p className="mt-1 text-[14px] text-gray-600">Partnerships with 200+ universities for research and exchange.</p></div>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50"><Award className="h-5 w-5 text-amber-600" /></div>
                  <div><h4 className="text-[15px] font-bold text-gray-900">Commitment to Excellence</h4><p className="mt-1 text-[14px] text-gray-600">Aims to be a global center for quality education, fostering peace and learning.</p></div>
                </div>
              </div>
            )}

            {/* ========== COURSES & FEES ========== */}
            {activeTab === "tab-courses" && (
              <div className="overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-[#f4f8fc] px-6 py-4">
                  <p className="text-[14px] font-semibold tracking-wide text-blue-600">Courses & fees – filter by level</p>
                  <div className="flex gap-2 text-xs font-medium">
                    {["all", "Bachelor", "Master"].map((level) => (
                      <button
                        key={level}
                        onClick={() => setCourseFilter(level)}
                        className={`rounded-full px-4 py-1.5 shadow-sm transition-colors ${
                          courseFilter === level
                            ? "bg-blue-600 text-white"
                            : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {level === "all" ? "All" : level}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="w-full overflow-x-auto">
                  <div className="min-w-[700px]">
                    <div className="grid grid-cols-12 gap-4 border-b border-gray-100 bg-white px-6 py-5 items-center">
                      <div className="col-span-4 text-[13px] font-bold uppercase tracking-wider text-gray-800">COURSES NAME</div>
                      <div className="col-span-2 text-[13px] font-bold uppercase tracking-wider text-gray-800">DURATION</div>
                      <div className="col-span-3 text-[13px] font-bold uppercase tracking-wider text-gray-800">FEES / YEAR</div>
                      <div className="col-span-3 text-[13px] font-bold uppercase tracking-wider text-gray-800">ELIGIBILITY & SEAT</div>
                    </div>
                    {coursesData
                      .filter((c) => courseFilter === "all" || c.level === courseFilter)
                      .map((course, i) => (
                        <div key={i} className="grid grid-cols-12 gap-4 border-b border-gray-100 px-6 py-5 transition-colors hover:bg-gray-50/50 items-center">
                          <div className="col-span-4 pr-4"><h4 className="text-[15.5px] font-bold text-gray-900">{course.name}</h4><p className="mt-1 text-[12px] text-gray-500">{course.sub}</p></div>
                          <div className="col-span-2"><h4 className="text-[15.5px] font-bold text-gray-900">{course.duration}</h4><p className="mt-1 text-[12px] text-gray-500">{course.durationSub}</p></div>
                          <div className="col-span-3"><h4 className="text-[15.5px] font-bold text-[#2563eb]">{course.fee}</h4><p className="mt-1 text-[12px] text-gray-500">/ Year</p></div>
                          <div className="col-span-3"><p className="mb-2 text-[12.5px] font-medium text-gray-600">{course.eligibility}</p><span className="inline-block rounded bg-[#eafaef] px-2.5 py-1 text-[11px] font-bold text-[#16a34a]">{course.seats}</span></div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========== INSTITUTE / FACULTIES ========== */}
            {activeTab === "tab-institutes" && (
              <div className="space-y-10">
                <div>
                  <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50"><Building2 className="h-5 w-5 text-blue-600" /></div>
                    <div><h3 className="text-[18px] font-bold text-gray-900">Institutes & Affiliated Colleges</h3><p className="mt-0.5 text-[13px] text-gray-500">Constituent and affiliated campuses</p></div>
                  </div>
                  <div className="grid grid-cols-1 gap-5">
                    <div className="rounded-[16px] border border-gray-100 bg-white p-5 shadow-sm">
                      <div className="flex cursor-pointer items-center justify-between" onClick={() => toggleDropdown("affiliated")}>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50"><Users className="h-5 w-5 text-blue-600" /></div>
                          <h4 className="text-[17px] font-bold text-gray-900">Affiliated Colleges (Faculty of Humanities & Social Sciences)</h4>
                        </div>
                        <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${openDropdowns["affiliated"] ? "rotate-180" : ""}`} />
                      </div>
                      {openDropdowns["affiliated"] && (
                        <div className="mt-6">
                          <table className="prog-table w-full">
                            <thead><tr><th className="bg-[#f8fafc] px-2 py-2.5 text-left text-[13px] font-semibold text-[#1e293b]">SN</th><th className="bg-[#f8fafc] px-2 py-2.5 text-left text-[13px] font-semibold text-[#1e293b]">College</th><th className="bg-[#f8fafc] px-2 py-2.5 text-left text-[13px] font-semibold text-[#1e293b]">Address</th><th className="bg-[#f8fafc] px-2 py-2.5 text-left text-[13px] font-semibold text-[#1e293b]">District</th><th className="bg-[#f8fafc] px-2 py-2.5 text-left text-[13px] font-semibold text-[#1e293b]">Approved Programs/Quotas</th></tr></thead>
                            <tbody>
                              {affiliatedColleges.map((col) => (
                                <tr key={col.sn} className="border-b border-gray-50">
                                  <td className="px-2 py-2 text-[13px] text-[#334155]">{col.sn}</td>
                                  <td className="px-2 py-2 text-[13px] text-[#334155]">{col.name}</td>
                                  <td className="px-2 py-2 text-[13px] text-[#334155]">{col.address}</td>
                                  <td className="px-2 py-2 text-[13px] text-[#334155]">{col.district}</td>
                                  <td className="px-2 py-2 text-[13px] text-[#334155]">{col.programs}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                    {institutesData.map((inst) => (
                      <div key={inst.id} className="rounded-[16px] border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="flex cursor-pointer items-center justify-between" onClick={() => toggleDropdown(inst.id)}>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50"><inst.icon className="h-5 w-5 text-blue-600" /></div>
                            <h4 className="text-[15px] font-bold text-gray-900">{inst.title}</h4>
                          </div>
                          <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${openDropdowns[inst.id] ? "rotate-180" : ""}`} />
                        </div>
                        {openDropdowns[inst.id] && (
                          <div className="mt-6">
                            <table className="prog-table w-full">
                              <thead><tr><th className="bg-[#f8fafc] px-2 py-2.5 text-left text-[13px] font-semibold text-[#1e293b]">SN</th><th className="bg-[#f8fafc] px-2 py-2.5 text-left text-[13px] font-semibold text-[#1e293b]">College</th><th className="bg-[#f8fafc] px-2 py-2.5 text-left text-[13px] font-semibold text-[#1e293b]">Address</th><th className="bg-[#f8fafc] px-2 py-2.5 text-left text-[13px] font-semibold text-[#1e293b]">District</th><th className="bg-[#f8fafc] px-2 py-2.5 text-left text-[13px] font-semibold text-[#1e293b]">Approved Programs/Quotas</th></tr></thead>
                              <tbody>
                                {inst.colleges?.map((col) => (
                                  <tr key={col.sn} className="border-b border-gray-50">
                                    <td className="px-2 py-2 text-[13px] text-[#334155]">{col.sn}</td>
                                    <td className="px-2 py-2 text-[13px] text-[#334155]">{col.name}</td>
                                    <td className="px-2 py-2 text-[13px] text-[#334155]">{col.address}</td>
                                    <td className="px-2 py-2 text-[13px] text-[#334155]">{col.district}</td>
                                    <td className="px-2 py-2 text-[13px] text-[#334155]">{col.programs}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50"><BookOpen className="h-5 w-5 text-green-600" /></div>
                    <div><h3 className="text-[18px] font-bold text-gray-900">Faculties</h3><p className="mt-0.5 text-[13px] text-gray-500">Programs under each faculty</p></div>
                  </div>
                  <div className="grid grid-cols-1 gap-5">
                    {facultiesData.map((fac) => (
                      <div key={fac.id} className="rounded-[16px] border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="flex cursor-pointer items-center justify-between" onClick={() => toggleDropdown(fac.id)}>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50"><fac.icon className="h-5 w-5 text-green-600" /></div>
                            <h4 className="text-[17px] font-bold text-gray-900">{fac.title}</h4>
                          </div>
                          <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${openDropdowns[fac.id] ? "rotate-180" : ""}`} />
                        </div>
                        {openDropdowns[fac.id] && (
                          <div className="mt-6">
                            <table className="prog-table w-full">
                              <thead><tr><th className="bg-[#f8fafc] px-2 py-2.5 text-left text-[13px] font-semibold text-[#1e293b]">SN</th><th className="bg-[#f8fafc] px-2 py-2.5 text-left text-[13px] font-semibold text-[#1e293b]">Programs</th><th className="bg-[#f8fafc] px-2 py-2.5 text-left text-[13px] font-semibold text-[#1e293b]">Duration</th><th className="bg-[#f8fafc] px-2 py-2.5 text-left text-[13px] font-semibold text-[#1e293b]">Year/Semester</th></tr></thead>
                              <tbody>
                                {fac.programs?.map((p) => (
                                  <tr key={p.sn} className="border-b border-gray-50">
                                    <td className="px-2 py-2 text-[13px] text-[#334155]">{p.sn}</td>
                                    <td className="px-2 py-2 text-[13px] text-[#334155]">{p.name}</td>
                                    <td className="px-2 py-2 text-[13px] text-[#334155]">{p.duration}</td>
                                    <td className="px-2 py-2 text-[13px] text-[#334155]">{p.system}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "tab-admissions" && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {admissionsData.map((ad, i) => (
                  <div key={i} className="flex h-full w-full max-w-85 flex-col overflow-hidden rounded-md border border-gray-200 bg-white transition-transform hover:border-blue-200 cursor-pointer">
                    <div className="shrink-0 p-2.5 pb-0">
                      <div className="group relative h-28 w-full overflow-hidden rounded-md bg-gray-200">
                        <img src={i === 0 ? "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=400&auto=format&fit=crop" : "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=400&auto=format&fit=crop"} className="h-full w-full object-cover" alt="" />
                        <div className={`absolute left-0 top-2.5 z-10 rounded-r-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white ${ad.status === "Ongoing" ? "bg-[#10b981]" : "bg-red-500"}`}>
                          {ad.status}
                        </div>
                        <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1 rounded border border-white/10 bg-black/30 px-1.5 py-0.5 backdrop-blur-sm">
                          <span className="text-[8px] font-medium tracking-tight text-white opacity-90">Required Counselling?</span>
                          <span className="h-2 w-px bg-white/20"></span>
                          <span className="text-[8px] font-bold tracking-tight text-emerald-300 transition-colors hover:text-emerald-100">Reserve Seat</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex grow flex-col p-3 pb-3">
                      <div className="group/name mb-1 flex items-center gap-1.5">
                        <h2 title={ad.title} className="truncate text-[18px] font-bold leading-tight text-[#0f172a] transition-colors group-hover/name:text-brand-blue">
                          {ad.title}
                        </h2>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0d6efd" className="mt-0.5 h-5 w-5 shrink-0">
                          <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="mb-1.5 flex items-center overflow-hidden whitespace-nowrap text-[12px] text-[#64748b]">
                        <div className="flex items-center gap-1">
                          <svg className="h-3.75 w-3.75 fill-[#f59e0b]" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                          <span className="font-bold text-[#334155]">4.5</span>
                        </div>
                        <span className="mx-2 text-gray-300">|</span>
                        <div className="flex items-center gap-1.5">
                          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                          <span>{ad.faculty}</span>
                        </div>
                        <span className="mx-2 text-gray-300">|</span>
                        <div className="flex items-center gap-1.5 truncate">
                          <svg className="h-4 w-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          <span className="truncate" title={ad.campus}>{ad.campus}</span>
                        </div>
                      </div>
                      <div className="mb-2 flex cursor-pointer items-center gap-1.5 text-[12.5px] text-[#64748b] transition-colors hover:text-[#0d6efd] w-fit">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                        <span>University Central</span>
                      </div>
                      <hr className="mb-2 border-gray-100" />
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-[12.5px] font-medium text-[#64748b]">Programs Offered</span>
                        <span className="text-[12.5px] font-semibold text-[#2563eb]">Admission Open</span>
                      </div>
                      <ul className="mb-2 space-y-1">
                        <li className="flex items-center justify-between text-[12.5px]">
                          <span className="font-semibold text-[#1e293b]">{ad.title}</span>
                          <div className={`flex items-center gap-1.5 text-[11px] font-medium ${ad.status === "Ongoing" ? "text-[#059669]" : "text-[#ef4444]"}`}>
                            <span className="relative flex h-2 w-2 items-center justify-center">
                              <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${ad.status === "Ongoing" ? "bg-[#059669]" : "bg-[#ef4444]"}`}></span>
                              <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${ad.status === "Ongoing" ? "bg-[#059669]" : "bg-[#ef4444]"}`}></span>
                            </span>
                            {ad.status === "Ongoing" ? "Seats Available" : "Closed"}
                          </div>
                        </li>
                      </ul>
                      <div className="mt-auto mb-3 w-full border-b border-dotted border-gray-200 pt-2" style={{ borderBottomWidth: "1.5px", borderBottomStyle: "dotted" }}></div>
                      <div className="flex items-center gap-1.5">
                        <button className="flex flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-md border border-blue-100 bg-blue-50 px-2 py-2 text-[13px] font-semibold text-blue-700 transition-colors hover:bg-blue-100">
                          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                          Ask Question
                        </button>
                        <button className="flex flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-md bg-brand-blue px-2 py-2 text-[13px] font-bold text-white transition-colors hover:bg-brand-hover">
                          Apply Now
                        </button>
                        <button className="flex h-9 w-9 flex-none items-center justify-center rounded-md border border-gray-200 text-[#64748b] transition-colors hover:bg-gray-50">
                          <i className="fa-regular fa-bookmark"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ========== OFFERED PROGRAM ========== */}
            {/* ========== SCHOLARSHIP ========== */}
            {activeTab === "tab-scholarship" && (
              <div className="overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-[#f4f8fc] px-6 py-4">
                  <p className="text-[14px] font-semibold tracking-wide text-blue-600">Scholarship opportunities – filter by level</p>
                  <div className="flex gap-2 text-xs font-medium">
                    {["all", "+2", "Bachelor", "Master"].map((level) => (
                      <button
                        key={level}
                        onClick={() => setScholarFilter(level)}
                        className={`rounded-full px-4 py-1.5 shadow-sm transition-colors ${
                          scholarFilter === level
                            ? "bg-blue-600 text-white"
                            : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {level === "all" ? "All" : level}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="w-full overflow-x-auto">
                  <div className="min-w-[800px]">
                    <div className="grid grid-cols-12 gap-4 border-b border-gray-100 bg-white px-6 py-5 items-center">
                      <div className="col-span-2 text-[13px] font-bold uppercase tracking-wider text-gray-800">PROGRAM</div>
                      <div className="col-span-2 text-[13px] font-bold uppercase tracking-wider text-gray-800">SCHOLARSHIP</div>
                      <div className="col-span-2 text-[13px] font-bold uppercase tracking-wider text-gray-800">BENEFIT</div>
                      <div className="col-span-3 text-[13px] font-bold uppercase tracking-wider text-gray-800">FOR WHOM</div>
                      <div className="col-span-3 text-[13px] font-bold uppercase tracking-wider text-gray-800"></div>
                    </div>
                    {scholarshipsData
                      .filter((s) => scholarFilter === "all" || s.level === scholarFilter)
                      .map((sch, i) => (
                        <div key={i} className="grid grid-cols-12 gap-4 border-b border-gray-100 px-6 py-5 transition-colors hover:bg-gray-50/50 items-center">
                          <div className="col-span-2"><h4 className="text-[14px] font-bold text-gray-900">{sch.program}</h4></div>
                          <div className="col-span-2"><h4 className="text-[14px] font-bold text-gray-900">{sch.name}</h4></div>
                          <div className="col-span-2"><span className="text-[13px] font-medium text-green-600">{sch.benefit}</span></div>
                          <div className="col-span-3"><span className="text-[13px] text-gray-600">{sch.forWhom}</span></div>
                          <div className="col-span-3"><button className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700">Get Scholarship</button></div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========== EVENTS ========== */}
            {activeTab === "tab-events" && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {eventsData.map((ev, i) => (
                  <div key={i} className="flex flex-col overflow-hidden rounded-md border border-gray-200 bg-white transition-colors hover:border-blue-500/20 duration-300">
                    <div className="h-35 w-full overflow-hidden p-4">
                      <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop" alt={ev.title} className="h-full w-full rounded-md object-cover" />
                    </div>
                    <div className="flex grow flex-col p-5">
                      <div className="mb-3 flex items-center justify-between">
                        <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white ${i === 0 ? "bg-teal-500" : i === 1 ? "bg-orange-500" : i === 2 ? "bg-blue-500" : "bg-amber-500"}`}>{ev.month}</span>
                        <span className="flex items-center text-xs font-semibold text-gray-500"><i className="fa-regular fa-calendar mr-1.5"></i> {ev.date} {ev.month}, 2025</span>
                      </div>
                      <h4 className="mb-3 text-left text-lg font-bold leading-tight text-black hover:text-[#0000ff]">{ev.title}</h4>
                      <div className="mb-2 flex items-center text-xs font-semibold text-gray-600"><i className="fa-regular fa-building mr-2 text-gray-500"></i>University Central</div>
                      <div className="mb-3 flex items-center text-xs font-semibold text-gray-600"><i className="fa-solid fa-location-dot mr-2 text-gray-500"></i>Central Campus</div>
                      <p className="mb-5 line-clamp-3 text-xs font-medium leading-relaxed text-gray-500">{ev.desc}</p>
                      <div className="mt-auto flex gap-2">
                        <button className="flex-1 rounded-md border border-gray-300 bg-white py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50">Details</button>
                        <button className="flex-1 rounded-md bg-brand-blue py-2 text-sm font-bold text-white transition-colors hover:bg-blue-600">Register Now</button>
                        <button className="flex w-10 shrink-0 items-center justify-center rounded-md border border-gray-200 transition-colors hover:bg-gray-50"><i className="fa-regular fa-bookmark text-gray-400"></i></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ========== NEWS & NOTICES ========== */}
            {activeTab === "tab-news" && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {newsData.map((item, i) => (
                  <div key={i} className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-4"><span className={`inline-block rounded-full px-3.5 py-1 text-[12px] font-bold ${item.tagBg} ${item.tagText}`}>{item.tag}</span></div>
                      <div className="mb-4 h-[140px] w-full shrink-0 overflow-hidden rounded-xl">
                        <img src={item.img} alt="" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                      </div>
                      <h3 className="mb-2 text-[17px] font-bold leading-tight text-gray-900">{item.title}</h3>
                      <p className="mb-2 line-clamp-2 text-[13.5px] text-gray-500">{item.desc}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between border-t border-gray-50 bg-white px-5 py-4">
                      <div className="flex items-center gap-1.5 text-gray-400"><Clock className="h-4 w-4" /><span className="text-[12.5px] font-medium">{item.time}</span></div>
                      <a href="#" className="flex items-center text-[13px] font-bold text-blue-600 transition-colors hover:text-blue-700">Read more <ChevronRight className="ml-0.5 h-4 w-4" /></a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ========== DOWNLOAD ========== */}
            {activeTab === "tab-download" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="mb-5 flex items-center gap-3 border-b border-gray-100 pb-3 text-[20px] font-bold text-gray-900">
                    <Download className="h-6 w-6 text-blue-600" /> Brochures & Forms
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {downloadsData.map((dl, i) => (
                      <div key={i} className={`download-card flex items-start gap-3 rounded-xl border border-gray-100 bg-[#f8fafc] p-5 transition-all ${dl.hoverBorder} hover:border-blue-200`}>
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${dl.color}`}>
                          <dl.icon className={`h-6 w-6 ${dl.iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-[15px] font-bold text-gray-900">{dl.title}</h4>
                          <p className="mb-2 text-[12px] text-gray-500">{dl.meta}</p>
                          <button className={`flex items-center gap-1.5 text-[13px] font-bold transition-colors ${dl.btnColor}`}>
                            <FileDown className="h-4 w-4" /> Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========== GALLERY ========== */}
            {activeTab === "tab-gallery" && (
              <div className="space-y-10">
                {(() => {
                  const groups = new Map<string, typeof galleryImages>();
                  for (const img of galleryImages) {
                    const key = img.folder || "Gallery";
                    if (!groups.has(key)) groups.set(key, []);
                    groups.get(key)!.push(img);
                  }
                  const urls = galleryImages.map(i => i.url);
                  return Array.from(groups.entries()).map(([heading, items], gi) => (
                    <div key={gi} className="space-y-5">
                      <h3 className="text-lg font-bold capitalize tracking-tight text-gray-800">{heading}</h3>
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 md:gap-5">
                        {items.slice(0, items.length > 8 ? 7 : 8).map((img, ii) => {
                          const globalIndex = urls.indexOf(img.url);
                          return (
                            <div
                              key={ii}
                              className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
                              onClick={() => setLightboxIndex(globalIndex >= 0 ? globalIndex : null)}
                            >
                              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gray-50">
                                <img src={img.url} alt={img.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                              </div>
                            </div>
                          );
                        })}
                        {items.length > 8 && (
                          <div
                            className="group cursor-pointer overflow-hidden rounded-2xl border border-dashed border-blue-100 bg-blue-50/30 p-1.5 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-md"
                            onClick={() => {
                              const firstIdx = urls.indexOf(items[0].url);
                              setLightboxIndex(firstIdx >= 0 ? firstIdx : null);
                            }}
                          >
                            <div className="aspect-[4/3] flex flex-col items-center justify-center overflow-hidden rounded-xl bg-blue-600/5">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
                                <ArrowRight className="h-6 w-6" />
                              </div>
                              <span className="mt-2 text-sm font-bold text-blue-700">View All</span>
                            </div>
                            <p className="mt-2 px-1 text-center text-[12px] font-bold tracking-tight text-blue-600/60">
                              +{items.length - 7} PHOTOS
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ));
                })()}
                {galleryImages.length === 0 && (
                  <div className="py-16 text-center text-gray-400">
                    <p className="text-[15px] font-medium">No gallery images available</p>
                  </div>
                )}
              </div>
            )}

            {/* ========== REVIEW ========== */}
            {activeTab === "tab-review" && (
              <div>
                <div className="mb-8 flex flex-col items-center gap-8 rounded-md border border-gray-200 bg-white p-8 md:flex-row">
                  <div className="text-center md:border-r md:pr-8 md:text-left">
                    <h2 className="mb-2 text-5xl font-extrabold text-gray-900">4.8</h2>
                    <div className="mb-2 flex items-center justify-center gap-1 md:justify-start">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <i key={idx} className={`fa-solid fa-star text-[14px] ${idx < 5 ? "text-yellow-400" : "text-gray-300"}`}></i>
                      ))}
                    </div>
                    <p className="text-[13px] font-medium text-gray-500">Based on 12,024 reviews</p>
                  </div>
                  <div className="w-full flex-1 space-y-2.5">
                    {[
                      { star: 5, pct: 80, color: "bg-green-500" },
                      { star: 4, pct: 15, color: "bg-green-500" },
                      { star: 3, pct: 3, color: "bg-yellow-400" },
                      { star: 2, pct: 1, color: "bg-orange-400" },
                      { star: 1, pct: 1, color: "bg-orange-400" },
                    ].map((r) => (
                      <RatingBar key={r.star} label={String(r.star)} width={`${r.pct}%`} color={r.color} pct={`${r.pct}%`} />
                    ))}
                  </div>
                </div>

                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-[18px] font-bold text-gray-900">Recent Reviews</h3>
                  <a href="/write-review" className="text-sm font-medium text-brand-blue hover:text-brand-hover">Write a Review</a>
                </div>

                <div className="space-y-5">
                  <ReviewCard initials="AK" name="Aarav Kumar" subtitle="B.Tech Computer Science · Batch 2024" rating={5} pros="Amazing infrastructure with top-notch labs for Data Science. Faculties are extremely helpful and the placement cell is very active." cons="Campus food options could be better. Hostel wifi needs improvement." tone="blue" />
                  <ReviewCard initials="SP" name="Sita Paudel" subtitle="MA Sociology · Batch 2023" rating={4} pros="Great environment for research in social sciences. Central library has an extensive collection." cons="Limited parking space and some departments need renovation." tone="purple" />
                </div>
              </div>
            )}
          </div>

          {/* Right Column - matching college details page */}
          <div className="space-y-6 lg:col-span-1 lg:w-full lg:max-w-[400px] lg:ml-8 xl:ml-12">
            <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 sm:p-10">
              <h3 className="mb-8 text-2xl font-bold text-gray-900">Contact Information</h3>
              <div className="flex flex-col gap-6">
                <ContactInfoRow
                  icon="fa-solid fa-location-dot"
                  title="Address"
                  value="Kirtipur, Kathmandu 44618, Nepal"
                  badge="bg-brand-blue/5 text-[#0000FF]"
                />
                <ContactInfoRow
                  icon="fa-solid fa-phone"
                  title="Phone"
                  value="+977-1-4330437"
                  badge="bg-emerald-50 text-emerald-600"
                />
                <ContactInfoRow
                  icon="fa-solid fa-envelope"
                  title="Email"
                  value="info@tribhuvan.edu.np"
                  badge="bg-red-50 text-red-500"
                  link
                  linkHref="mailto:info@tribhuvan.edu.np"
                />
                <ContactInfoRow
                  icon="fa-solid fa-globe"
                  title="Website"
                  value="www.tribhuvan.edu.np"
                  badge="bg-purple-50 text-purple-600"
                  link
                  linkHref="https://www.tribhuvan.edu.np"
                />
                <div className="w-full">
                  <h3 className="text-[15px] font-bold text-gray-900">Social Media</h3>
                  <div className="mt-3 flex gap-5 text-[26px]">
                    <a href="#" className="text-[#1877F2] transition-transform hover:scale-110" title="Facebook"><i className="fa-brands fa-facebook"></i></a>
                    <a href="#" className="text-[#E4405F] transition-transform hover:scale-110" title="Instagram"><i className="fa-brands fa-instagram"></i></a>
                    <a href="#" className="text-black transition-transform hover:scale-110" title="TikTok"><i className="fa-brands fa-tiktok"></i></a>
                    <a href="#" className="text-[#FF0000] transition-transform hover:scale-110" title="YouTube"><i className="fa-brands fa-youtube"></i></a>
                    <a href="#" className="text-[#0A66C2] transition-transform hover:scale-110" title="LinkedIn"><i className="fa-brands fa-linkedin"></i></a>
                  </div>
                </div>
                <div className="mt-8 h-40 w-full overflow-hidden rounded-md">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.8482494441884!2d85.2875!3d27.6833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19e1c3b7b8b7%3A0x8b8c8c8c8c8c8c8c!2sKirtipur%2C%20Kathmandu%2C%20Nepal!5e0!3m2!1sen!2s!4v1"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-md"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

      <ShareCollegeModal
        collegeName={name}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareUrl={shareUrl}
        shareTitle={shareTitle}
        shareText={shareText}
      />

      {showUnfollowDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-md bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-bold text-gray-900">Unfollow University</h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to unfollow <strong>{name}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUnfollowDialog(false)}
                className="flex-1 rounded-md border border-gray-200 px-4 py-2.5 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsFollowed(false);
                  setShowUnfollowDialog(false);
                }}
                className="flex-1 rounded-md bg-red-500 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-red-600"
              >
                Unfollow
              </button>
            </div>
          </div>
        </div>
      )}

      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95" onClick={() => setLightboxIndex(null)}>
          <button type="button" onClick={() => setLightboxIndex(null)} className="absolute right-8 top-5 z-[1001] cursor-pointer text-[40px] text-white hover:text-gray-300">&times;</button>
          <button type="button" onClick={(e) => { e.stopPropagation(); changeImage(-1); }} className="absolute left-3 top-1/2 z-[1001] -translate-y-1/2 cursor-pointer px-3 py-3 text-[30px] text-white select-none hover:text-gray-300 md:left-5 md:px-5 md:py-5 md:text-[50px]">&#10094;</button>
          <img src={galleryImages[lightboxIndex]?.url} alt={galleryImages[lightboxIndex]?.title || "Gallery"} className="max-h-[85vh] max-w-[90%] rounded-md object-contain" onClick={(e) => e.stopPropagation()} />
          <button type="button" onClick={(e) => { e.stopPropagation(); changeImage(1); }} className="absolute right-3 top-1/2 z-[1001] -translate-y-1/2 cursor-pointer px-3 py-3 text-[30px] text-white select-none hover:text-gray-300 md:right-5 md:px-5 md:py-5 md:text-[50px]">&#10095;</button>
        </div>
      )}
    </>
  );
};

export default UniversityDetail;
