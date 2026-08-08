"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
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
  SearchX,
  FolderOpen,
} from "lucide-react";
import RichText from "@/components/RichText";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "eligibility", label: "Eligibility" },
  { id: "process", label: "Admission Process" },
  { id: "facilities", label: "Facilities" },
  { id: "courses", label: "Courses & Fees" },
  { id: "scholarship", label: "Scholarships" },
  { id: "contact", label: "Contact" },
  { id: "downloads", label: "Downloads" },
  { id: "testimonials", label: "Testimonials" },
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

const iconMap: Record<string, any> = {
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
};

const EmptyTabState = ({ tabName }: { tabName: string }) => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <FolderOpen className="w-32 h-32 text-gray-300 mb-4" />
      <p className="text-gray-500 text-lg font-medium mb-6">
        No {tabName} information is currently available.
      </p>
      <button
        onClick={() => router.push("/")}
        className="bg-[#0000ff] hover:bg-[#0000cc] cursor-pointer text-white font-semibold py-2.5 px-6 rounded-md transition-colors text-sm"
      >
        Explore More
      </button>
    </div>
  );
};

export default function AdmissionDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const collegeId = params.collegeId as string;
  const collegeIdNum = parseInt(collegeId, 10);

  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openProgram, setOpenProgram] = useState<number>(0);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const tabNavRef = useRef<HTMLDivElement>(null);
  const programsSectionRef = useRef<HTMLDivElement>(null);

  const { data: collegeData } = useQuery({
    queryKey: ["publishedAdmissionPage", collegeIdNum],
    queryFn: () =>
      admissionService.getPublishedAdmissionByPageID(collegeIdNum),
    enabled: !isNaN(collegeIdNum),
  });

  const apData = collegeData?.data?.data || {};
  const institution = collegeData?.data?.institution;
  const collegeName = institution?.name || "College";
  const applicationFormLink =
    (apData?.overview_data as any)?.applicationFormLink || "";
  const heroBanner = (apData?.overview_data as any)?.heroBanner || "";
  const heroBanners: string[] = (() => {
    if (Array.isArray(heroBanner))
      return heroBanner.map(String).filter(Boolean);
    if (typeof heroBanner === "string" && heroBanner) {
      try {
        const parsed = JSON.parse(heroBanner);
        return Array.isArray(parsed)
          ? parsed.map(String).filter(Boolean)
          : [heroBanner];
      } catch {
        return [heroBanner];
      }
    }
    return [];
  })();
  const admissionLevel =
    (apData?.overview_data as any)?.level || (params.level as string) || "";

  const [heroSlide, setHeroSlide] = useState(0);
  const heroIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nextHeroSlide = useCallback(() => {
    if (heroBanners.length <= 1) return;
    setHeroSlide((prev) => (prev + 1) % heroBanners.length);
  }, [heroBanners.length]);

  const prevHeroSlide = useCallback(() => {
    if (heroBanners.length <= 1) return;
    setHeroSlide((prev) => (prev === 0 ? heroBanners.length - 1 : prev - 1));
  }, [heroBanners.length]);

  useEffect(() => {
    if (heroBanners.length <= 1) return;
    heroIntervalRef.current = setInterval(nextHeroSlide, 4000);
    return () => {
      if (heroIntervalRef.current) clearInterval(heroIntervalRef.current);
    };
  }, [heroBanners.length, nextHeroSlide]);

  // Handle scrollTo query parameter
  useEffect(() => {
    const scrollTo = searchParams.get("scrollTo");
    if (scrollTo === "programs") {
      // Wait for data to load and tab to be set
      const timer = setTimeout(() => {
        setActiveTab("overview");
        setTimeout(() => {
          programsSectionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }, 100);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const timeAgo = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} minutes ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} months ago`;
    return `${Math.floor(months / 12)} years ago`;
  };

  const createdAt = collegeData?.data?.created_at;
  const updatedAt = collegeData?.data?.updated_at;

  const brochureUrl = (apData as any)?.brochure_data?.url || "";

  const handleDownloadBrochure = async () => {
    if (!brochureUrl) return;
    try {
      const resp = await fetch(brochureUrl);
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = brochureUrl.split("/").pop() || "brochure.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(brochureUrl, "_blank");
    }
  };

  const programsData = ((apData?.programs_data as any[]) || []).map(
    (p: any) => {
      const now = new Date();
      const startDate = p.startDate ? new Date(p.startDate) : null;
      const endDate = p.endDate ? new Date(p.endDate) : null;

      let badge = "";
      let badgeClass = "bg-blue-100 text-blue-700";

      if (startDate && endDate) {
        if (now < startDate) {
          badge = "Upcoming";
          badgeClass = "bg-yellow-100 text-yellow-700";
        } else if (now >= startDate && now <= endDate) {
          badge = "Ongoing";
          badgeClass = "bg-green-100 text-green-700";
        } else {
          badge = "Closed";
          badgeClass = "bg-red-100 text-red-700";
        }
      } else if (startDate && !endDate) {
        if (now >= startDate) {
          badge = "Ongoing";
          badgeClass = "bg-green-100 text-green-700";
        } else {
          badge = "Upcoming";
          badgeClass = "bg-yellow-100 text-yellow-700";
        }
      }

      return {
        icon: FlaskConical,
        title: p.title || "",
        affiliation: p.subtitle || "",
        applyLink: p.applyLink || "",
        badge,
        badgeClass,
        desc: p.description || "",
        leftTitle: "Available Streams:",
        leftItems: p.streams || [],
        rightTitle: "Career Opportunities:",
        rightItems: p.careers || [],
      };
    },
  );

  const facilitiesData = ((apData?.facilities_data as any[]) || []).map(
    (f: any) => ({
      icon: iconMap[f.facilityIcon] || ShieldCheck,
      title: f.heading || "",
      desc: f.description || "",
    }),
  );

  const coursesData = ((apData?.courses_data as any[]) || []).map((c: any) => ({
    course: c.courseName || "",
    fees: c.feesText || "Contact College for Details",
    appDate: c.applicationDate || "",
    applyLink: c.applyLink || "",
  }));

  const scholarshipData = ((apData?.scholarships_data as any[]) || []).map(
    (s: any) => ({
      name: s.name || "",
      level: s.level || "",
      stream: s.stream || "",
      coverage: s.coverage || "",
      eligibility: s.eligibility ? String(s.eligibility).split(/[\n.]+/).map((item: string) => item.replace(/^-\s*/, "").trim()).filter(Boolean) : [],
      seats: s.seats || "",
    }),
  );

  const eligibilityData = (() => {
    const ed = (apData as any)?.eligibility_data;
    const criteria = ed?.criteria || (Array.isArray(ed) ? ed : []);
    return criteria.map((e: any, i: number) => ({
      sn: i + 1,
      level: e.level || "",
      stream: e.stream || "",
      eligibility: Array.isArray(e.eligibility) ? e.eligibility : (e.eligibility ? String(e.eligibility).split("\n").map((s: string) => s.replace(/^-\s*/, "").trim()).filter(Boolean) : []),
      docs: Array.isArray(e.documents) ? e.documents : (e.documents ? String(e.documents).split("\n").map((s: string) => s.replace(/^-\s*/, "").trim()).filter(Boolean) : []),
    }));
  })();

  const faqData = ((apData?.faqs_data as any[]) || []).map((f: any) => ({
    q: f.question || "",
    a: f.answer || "",
  }));

  const staffData = ((apData?.contact_persons_data as any[]) || []).map(
    (s: any) => ({
      name: s.name || "",
      role: s.designation || "",
      img: s.image || "",
      phone: s.number || "",
      email: s.email || "",
      wa: s.whatsapp || "",
    }),
  );

  const downloadsData = ((apData?.downloads_data as any[]) || []).map(
    (d: any) => ({
      title: d.title || "",
      description: d.description || "",
      file: d.file || "",
      size: d.size || "",
    }),
  );

  const testimonialsData = ((apData?.testimonials_data as any[]) || [])
    .map((t: any) => ({
      name: t.name || "",
      designation: t.designation || "",
      image: t.image || "",
      message: t.message || "",
    }))
    .filter((t) => t.name || t.message);

  const admissionProcess = (apData?.admission_process_data as any[]) || [];

  const whatsNewData = (apData as any)?.whats_new_data || {};
  const overviewDesc = (apData?.overview_data as any)?.overviewDesc || "";
  const overviewHeading = (apData?.overview_data as any)?.overviewHeading || "";

  const handleApplyNow = () => {
    const ongoingPrograms = programsData.filter(
      (p) => p.badge === "Ongoing" && p.applyLink,
    );
    if (ongoingPrograms.length === 1) {
      window.open(ongoingPrograms[0].applyLink, "_blank", "noopener,noreferrer");
    } else if (ongoingPrograms.length > 1) {
      setShowApplyModal(true);
    } else if (applicationFormLink) {
      window.open(applicationFormLink, "_blank", "noopener,noreferrer");
    } else {
      window.open(`/admissions/apply/${collegeIdNum}`, "_blank");
    }
  };

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
        <nav className="flex items-center text-sm text-gray-500 mb-6 gap-2 flex-wrap">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Link href="/admissions" className="hover:text-gray-900 transition-colors">
            Admissions
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Link
            href={`/admissions/${encodeURIComponent(params.level as string)}`}
            className="hover:text-gray-900 transition-colors"
          >
            {params.level} Admission
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">{collegeName}</span>
        </nav>

        <div className="mb-6">
          <h1 className="text-[28px] md:text-4xl font-bold text-gray-900">
            {collegeName} opens admission for {admissionLevel}
          </h1>
          <p className="text-sm text-gray-400 font-medium mt-2">
            Created {timeAgo(createdAt)} &middot; Last modified{" "}
            {timeAgo(updatedAt)}
          </p>
        </div>

        {heroBanners.length > 0 ? (
          <div className="relative w-full h-[280px] md:h-[380px] rounded-md overflow-hidden group">
            <div
              className="flex w-full h-full transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${heroSlide * 100}%)` }}
            >
              {heroBanners.map((url, idx) => (
                <div
                  key={idx}
                  className="w-full h-full shrink-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('${url}')`,
                    backgroundPosition: "center 20%",
                  }}
                />
              ))}
            </div>
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
            {heroBanners.length > 1 && (
              <>
                <button
                  onClick={prevHeroSlide}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white text-gray-800 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextHeroSlide}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white text-gray-800 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                  {heroBanners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setHeroSlide(idx)}
                      className={`rounded-full transition-all duration-300 ${
                        idx === heroSlide
                          ? "w-3 h-3 bg-white"
                          : "w-2 h-2 bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="relative w-full h-[280px] md:h-[380px] bg-brand-blue rounded-md overflow-hidden" />
        )}
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
                      <span className="absolute -top-1 -left-1 text-[#60a5fa] text-[16px]">
                        ✨
                      </span>
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
                  {whatsNewData.description ? (
                    <RichText html={whatsNewData.description} />
                  ) : (
                    <p className="mb-4">
                      All the latest updates regarding{" "}
                      <span className="font-semibold text-gray-900">
                        {collegeName} admissions
                      </span>{" "}
                      are as follows:
                    </p>
                  )}
                  {whatsNewData.btnText && whatsNewData.btnLink && (
                    <div className="flex justify-center mb-8">
                      <a
                        href={whatsNewData.btnLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#0000ff] hover:bg-[#0000cc] text-white font-semibold py-2.5 px-6 rounded-md inline-flex items-center transition-colors text-sm"
                      >
                        {whatsNewData.btnText}
                      </a>
                    </div>
                  )}

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
                  {overviewHeading || "Admissions Now Open for New Session"}
                </h2>
                {overviewDesc ? (
                  <RichText
                    html={overviewDesc}
                    variant="sm"
                    className="text-gray-600 break-words overflow-hidden [&_p]:break-words [&_p]:overflow-hidden"
                  />
                ) : (
                  <p className="text-gray-600">
                    {collegeName} announces the official opening of admissions
                    for the upcoming academic session. We invite prospective
                    students to explore our comprehensive programs.
                  </p>
                )}
              </div>

              <div ref={programsSectionRef} className="pt-6">
                {programsData.length > 0 ? (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Our Programs
                    </h2>
                    <div className="space-y-3">
                      {programsData.map((prog, idx) => {
                        const isOpen = openProgram === idx;
                        return (
                          <div
                            key={idx}
                            className="border border-gray-200 rounded-md bg-white overflow-hidden"
                          >
                            <button
                              onClick={() => setOpenProgram(isOpen ? -1 : idx)}
                              className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-md bg-[#0000ff] flex items-center justify-center text-white flex-shrink-0">
                                  <prog.icon className="w-5 h-5" />
                                </div>
                                <div>
                                  <h3 className="text-base font-bold text-gray-900">
                                    {prog.title}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    {prog.affiliation ||
                                      "NEB Affiliated | 2 Years Program"}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span
                                  className={`px-3 py-1 text-xs font-semibold rounded-full ${prog.badgeClass}`}
                                >
                                  {prog.badge}
                                </span>
                                <ChevronDown
                                  className={`w-5 h-5 text-gray-400 transition-transform ${
                                    isOpen ? "rotate-180" : ""
                                  }`}
                                />
                              </div>
                            </button>
                            {isOpen && (
                              <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                                <div className="text-sm text-gray-700 leading-relaxed mb-4">
                                  <RichText html={prog.desc} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div className="bg-gray-50 rounded-md p-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">
                                      {prog.leftTitle}
                                    </h4>
                                    <ul className="space-y-1 text-sm text-gray-600">
                                      {prog.leftItems.map(
                                        (item: any, i: number) => (
                                          <li
                                            key={i}
                                            className="flex items-center gap-2"
                                          >
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#0000ff]" />
                                            {item}
                                          </li>
                                        ),
                                      )}
                                    </ul>
                                  </div>
                                  <div className="bg-gray-50 rounded-md p-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">
                                      {prog.rightTitle}
                                    </h4>
                                    <ul className="space-y-1 text-sm text-gray-600">
                                      {prog.rightItems.map(
                                        (item: any, i: number) => (
                                          <li
                                            key={i}
                                            className="flex items-center gap-2"
                                          >
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#0000ff]" />
                                            {item}
                                          </li>
                                        ),
                                      )}
                                    </ul>
                                  </div>
                                </div>
                                {prog.applyLink && (
                                  <a
                                    href={prog.applyLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-[#0000ff] hover:bg-[#0000cc] text-white font-semibold py-2.5 px-5 rounded-md transition-colors text-sm"
                                  >
                                    Apply Now
                                    <ChevronRight className="w-4 h-4" />
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <EmptyTabState tabName="Programs" />
                )}
              </div>
            </div>
          )}

          {/* Eligibility Tab */}
          {activeTab === "eligibility" && (
            <div>
              <div className="mb-6">
                {eligibilityData.length > 0 ? (
                  <>
                    <h2 className="text-[22px] font-bold text-gray-900 mb-4">
                      Eligibility Criteria 2026
                    </h2>
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
                            <th className="p-4 font-bold text-gray-900 w-[25%]">
                              Required Documents
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-[15px]">
                          {eligibilityData.map((row: any, idx: number) => (
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
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                  {row.eligibility.map((item: string, i: number) => (
                                    <li key={i}>{item}</li>
                                  ))}
                                </ul>
                              </td>
                              <td className="p-4 align-top text-gray-700">
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                  {row.docs.map((doc: any, i: number) => (
                                    <li key={i}>{doc}</li>
                                  ))}
                                </ul>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <EmptyTabState tabName="Eligibility Criteria" />
                )}
              </div>
            </div>
          )}

          {/* Admission Process Tab */}
          {activeTab === "process" && (
            <div>
              {admissionProcess.length > 0 ? (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Admission Process 2026
                    </h2>
                    <p className="text-gray-600">
                      Step-by-step guide for {admissionLevel || "this program"} admission
                    </p>
                  </div>
                  {admissionProcess.map((step: any, idx: number) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-md p-6 mb-6"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#0000ff] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {step.stepNumber || idx + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg mb-3">
                            {step.title}
                          </h3>
                          <div className="text-sm text-gray-600">
                            <RichText html={step.description} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyTabState tabName="Admission Process" />
              )}
            </div>
          )}

          {/* Facilities Tab */}
          {activeTab === "facilities" && (
            <div>
              {facilitiesData.length > 0 ? (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Our Facilities
                    </h2>
                    <p className="text-gray-600">
                      World-class infrastructure for holistic learning
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {facilitiesData.map((fac, idx) => (
                      <div
                        key={idx}
                        className="border border-gray-200 rounded-md p-6"
                      >
                        <div className="w-12 h-12 rounded-md bg-[#0000ff] flex items-center justify-center text-white mb-4">
                          <fac.icon className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">
                          {fac.title}
                        </h3>
                        <p className="text-sm text-gray-600">{fac.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyTabState tabName="Facilities" />
              )}
            </div>
          )}

          {/* Courses & Fees Tab */}
          {activeTab === "courses" && (
            <div>
              <div className="mb-6">
                {coursesData.length > 0 ? (
                  <>
                    <h2 className="text-[22px] font-bold text-gray-900 mb-4">
                      {collegeName} of Science Fees & Eligibility
                    </h2>
                    <h3 className="text-[17px] font-bold text-gray-900 mb-4">
                      Full time Courses
                    </h3>
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
                            <th className="p-4 font-bold text-gray-900 w-[15%]">
                              Action
                            </th>
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
                                <div className="text-gray-900 font-semibold mb-1">
                                  {row.course}
                                </div>
                                <span className="text-[#2563eb] text-sm hover:underline cursor-pointer flex items-center">
                                  View Curriculum{" "}
                                  <ChevronRight className="w-3 h-3 ml-1" />
                                </span>
                              </td>
                              <td className="p-4 align-top border-r border-gray-200">
                                <div className="text-[#059669] mb-1">
                                  {row.fees}
                                </div>
                                <span className="text-[#2563eb] text-sm hover:underline cursor-pointer flex items-center">
                                  Check Details{" "}
                                  <ChevronRight className="w-3 h-3 ml-1" />
                                </span>
                              </td>
                              <td className="p-4 align-top border-r border-gray-200 text-gray-700">
                                {row.appDate}
                              </td>
                              <td className="p-4 align-top">
                                <span
                                  className="text-[#2563eb] hover:underline cursor-pointer flex items-center"
                                  onClick={() => {
                                    const link =
                                      row.applyLink || applicationFormLink;
                                    if (link)
                                      window.open(
                                        link,
                                        "_blank",
                                        "noopener,noreferrer",
                                      );
                                    else handleApplyNow();
                                  }}
                                >
                                  Apply Now{" "}
                                  <ChevronRight className="w-4 h-4 ml-1" />
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <EmptyTabState tabName="Courses &amp; Fees" />
                )}
              </div>
            </div>
          )}

          {/* Scholarships Tab */}
          {activeTab === "scholarship" && (
            <div>
              <div>
                {scholarshipData.length > 0 ? (
                  <>
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
                            <th className="p-4 font-bold text-gray-900 w-[10%]">
                              Seats
                            </th>
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
                                <div className="text-gray-900 font-semibold mb-1">
                                  {row.name}
                                </div>
                                <span className="text-[#2563eb] text-sm hover:underline cursor-pointer flex items-center">
                                  View Scholarship{" "}
                                  <ChevronRight className="w-3 h-3 ml-1" />
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
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                  {row.eligibility.map((item: string, i: number) => (
                                    <li key={i}>{item}</li>
                                  ))}
                                </ul>
                              </td>
                              <td className="p-4 align-top text-gray-700">
                                {row.seats}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <EmptyTabState tabName="Scholarships" />
                )}
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === "contact" && (
            <div>
              {staffData.length > 0 ? (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Contact Information
                    </h2>
                    <p className="text-gray-600">
                      Get in touch with our admission team
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {staffData.map((staff, idx) => (
                      <div
                        key={idx}
                        className="border border-gray-200 rounded-md p-6 bg-white"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <img
                            src={staff.img}
                            alt={staff.name}
                            className="w-20 h-20 rounded-md object-cover flex-shrink-0"
                          />
                          <div>
                            <h4 className="font-bold text-gray-900">
                              {staff.name}
                            </h4>
                            <p className="text-sm text-[#0000ff] font-medium">
                              {staff.role}
                            </p>
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
              ) : (
                <EmptyTabState tabName="Contact" />
              )}
            </div>
          )}

          {/* Downloads Tab */}
          {activeTab === "downloads" && (
            <div>
              {downloadsData.length > 0 ? (
                <div>
                  <div className="mb-6">
                    <h2 className="text-[20px] font-bold text-gray-900">Downloads</h2>
                    <p className="mt-1 text-[14px] text-gray-500">
                      Access brochures, forms, and study materials.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {downloadsData.map((download: any, i: number) => (
                      <div
                        key={download.title || i}
                        className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-5 transition"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                              <line x1="16" y1="13" x2="8" y2="13" />
                              <line x1="16" y1="17" x2="8" y2="17" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">
                              {download.title}
                            </h4>
                            <p className="text-[12.5px] text-gray-500">
                              {download.size || "Download file"}
                            </p>
                          </div>
                        </div>
                        {download.file ? (
                          <a
                            href={download.file}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 rounded-md bg-[#0000ff] hover:bg-[#0000cc] px-5 py-2.5 text-sm font-bold text-white"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </a>
                        ) : (
                          <button className="flex items-center gap-2 rounded-md bg-[#0000ff] hover:bg-[#0000cc] px-5 py-2.5 text-sm font-bold text-white">
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyTabState tabName="downloads" />
              )}
            </div>
          )}

          {/* Testimonials Tab */}
          {activeTab === "testimonials" && (
            <div>
              {testimonialsData.length > 0 ? (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Testimonials
                    </h2>
                    <p className="text-gray-600">
                      What our students and alumni say about us
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {testimonialsData.map((testimonial: any, idx: number) => (
                      <div
                        key={idx}
                        className="border border-gray-200 rounded-md p-6 bg-white"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                          />
                          <div>
                            <h4 className="font-bold text-gray-900">
                              {testimonial.name}
                            </h4>
                            <p className="text-sm text-[#0000ff] font-medium">
                              {testimonial.designation}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-600 text-[15px] leading-relaxed italic">
                          &ldquo;{testimonial.message}&rdquo;
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyTabState tabName="Testimonials" />
              )}
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === "faq" && (
            <div>
              {faqData.length > 0 ? (
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
                            <p className="text-[14px] text-gray-600 leading-relaxed">
                              {faq.a}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyTabState tabName="FAQ" />
              )}
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
                  Apply now or download the brochure for more information about
                  programs and admission process.
                </p>
              </div>
              <div className="space-y-3 pt-4 border-t border-blue-500/50">
                <button
                  onClick={handleApplyNow}
                  className="w-full flex items-center justify-center bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-4 rounded-md transition-colors text-sm"
                >
                  Apply Now
                </button>
                <button
                  onClick={handleDownloadBrochure}
                  className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-400 text-white font-semibold py-3 px-4 rounded-md transition-colors text-sm"
                >
                  Download Brochure
                  <Download className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-md p-5">
            <h3 className="font-bold text-gray-900 text-[18px] mb-5">
              Contact Information
            </h3>

            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-[13px]">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-gray-900 font-bold text-[13px]">
                    Address
                  </span>
                  <span className="text-gray-500 font-medium text-[12px]">
                    {institution?.location || "N/A"}
                  </span>
                </div>
              </li>
              <li className="flex items-center gap-3 text-[13px]">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-gray-900 font-bold text-[13px]">
                    Phone
                  </span>
                  <span className="text-gray-500 font-medium text-[12px]">
                    {institution?.contact_phone || staffData[0]?.phone || "N/A"}
                  </span>
                </div>
              </li>
              <li className="flex items-center gap-3 text-[13px]">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-gray-900 font-bold text-[13px]">
                    Email
                  </span>
                  <span className="text-gray-500 font-medium text-[12px]">
                    {institution?.contact_email || staffData[0]?.email || "N/A"}
                  </span>
                </div>
              </li>
              <li className="flex items-center gap-3 text-[13px]">
                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-gray-900 font-bold text-[13px]">
                    Website
                  </span>
                  <a
                    href={institution?.website || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 font-medium text-[12px] hover:underline transition"
                  >
                    {institution?.website
                      ? (() => {
                          try {
                            return new URL(institution.website).hostname;
                          } catch {
                            return institution.website;
                          }
                        })()
                      : "N/A"}
                  </a>
                </div>
              </li>
            </ul>

            <div className="mt-5">
              <h4 className="font-bold text-gray-900 text-[13px] mb-3">
                Follow Us
              </h4>
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
              <h4 className="font-bold text-gray-900 text-[13px] mb-3">
                Location
              </h4>
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
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
              &#8203;
            </span>
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
                  To get Recommendations &amp; Alerts, please share these
                  details
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

      {/* Apply Now Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-900/40 transition-opacity backdrop-blur-sm"
              onClick={() => setShowApplyModal(false)}
            />
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 relative">
              <button
                onClick={() => setShowApplyModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="px-2 pt-2">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Select a Program
                </h3>
                <p className="text-sm text-gray-500 mb-5">
                  Choose an ongoing program to apply
                </p>

                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {programsData
                    .filter((p) => p.badge === "Ongoing" && p.applyLink)
                    .map((prog, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          window.open(
                            prog.applyLink,
                            "_blank",
                            "noopener,noreferrer",
                          );
                          setShowApplyModal(false);
                        }}
                        className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors text-left"
                      >
                        <div className="w-10 h-10 rounded-md bg-[#0000ff] flex items-center justify-center text-white flex-shrink-0">
                          <prog.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {prog.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {prog.affiliation || "View program details"}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
