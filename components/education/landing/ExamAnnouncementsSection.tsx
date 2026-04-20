"use client";

import { useState } from "react";
import {
  BadgeCheck,
  MapPin,
  Award,
  ExternalLink,
  Bookmark,
  Clock,
  GraduationCap,
  Users,
  Bell,
  Send,
  PlayCircle,
  Flame,
  Monitor,
  Globe,
  TrendingUp,
  Building,
  BadgeCheckIcon,
  Paperclip,
  FileText,
} from "lucide-react";

interface ExamAnnouncementsSectionProps {
  onNavigate: (view: string, data?: any) => void;
}

const exams = [
  {
    id: 1,
    institution: "Kist College",
    verified: true,
    location: "Kathmandu",
    affiliation: "NEB Affiliated",
    website: "kist.edu.np",
    logo: "https://kist.edu.np/resources/assets/img/logo_small.jpg",
    title: "+2 Science Entrance Exam",
    tags: [
      {
        text: "Limited Seats",
        icon: <Flame className="w-3 h-3" />,
        type: "alert",
      },
      {
        text: "Online",
        icon: <Monitor className="w-3 h-3" />,
        type: "default",
      },
      {
        text: "National",
        icon: <Globe className="w-3 h-3" />,
        type: "default",
      },
    ],
    deadline: "04 Jan 2026",
    eligibility: "SEE Passed (Min 2.0 GPA)",
    whatsapp: "#",
    viber: "#",
  },
  {
    id: 2,
    institution: "St. Xavier's College",
    verified: true,
    location: "Maitighar",
    affiliation: "NEB Affiliated",
    website: "sxc.edu.np",
    logo: "https://placehold.co/64x64/1e3a8a/ffffff?text=SXC",
    title: "+2 Science Entrance Exam",
    tags: [
      {
        text: "High Demand",
        icon: <TrendingUp className="w-3 h-3" />,
        type: "warning",
      },
      {
        text: "In-Person",
        icon: <Building className="w-3 h-3" />,
        type: "default",
      },
    ],
    deadline: "10 Jul 2026",
    eligibility: "SEE Passed (Min 3.6 GPA)",
    whatsapp: "#",
    viber: "#",
  },
  {
    id: 3,
    institution: "Trinity Int'l College",
    verified: true,
    location: "Dillibazar",
    affiliation: "NEB Affiliated",
    website: "trinity.edu.np",
    logo: "https://www.trinity.edu.np/assets/backend/uploads/Logo/trinity%20college%20logo.jpg",
    title: "A-Level Entrance 2026",
    tags: [
      {
        text: "Scholarships",
        icon: <Award className="w-3 h-3" />,
        type: "success",
      },
      {
        text: "Hybrid",
        icon: <Monitor className="w-3 h-3" />,
        type: "default",
      },
    ],
    deadline: "25 Aug 2026",
    eligibility: "SEE Passed (Min 2.8 GPA)",
    whatsapp: "#",
    viber: "#",
  },
  {
    id: 4,
    institution: "Little Angels' College",
    verified: true,
    location: "Hattiban",
    affiliation: "NEB Affiliated",
    website: "lac.edu.np",
    logo: "https://placehold.co/64x64/dc2626/ffffff?text=LAC",
    title: "+2 Management Entrance",
    tags: [
      {
        text: "Applications Open",
        icon: <BadgeCheck className="w-3 h-3" />,
        type: "purple",
      },
    ],
    deadline: "15 Sep 2026",
    eligibility: "SEE Passed (Min 2.4 GPA)",
    whatsapp: "#",
    viber: "#",
  },
];

const ExamAnnouncementsSection: React.FC<ExamAnnouncementsSectionProps> = ({
  onNavigate,
}) => {
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());

  const toggleBookmark = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="mt-16 sm:mt-20 md:mt-24 w-full">
      <div className="max-w-350 mx-auto w-full">
        {/* New Heading and Subheading */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-[26px] xs:text-[30px] sm:text-3xl md:text-[40px] font-bold text-[#111827] mb-2 sm:mb-3 tracking-tight px-2">
            Find All Exam Announcements Easily.
          </h2>
          <p className="text-[15px] sm:text-[16px] md:text-[17px] text-[#6b7280] max-w-3xl mx-auto leading-relaxed px-2">
            Discover institutions that match your academic profile and
            preferences.
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {exams.map((exam) => (
            <article
              key={exam.id}
              className="bg-white rounded-md p-4 sm:p-5 border border-gray-200 flex flex-col h-full hover:border-blue-500/20 transition-all duration-300"
            >
              <header className="flex justify-between items-start mb-4 sm:mb-5">
                <div className="flex gap-2.5 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md border border-gray-200 flex items-center justify-center bg-white shrink-0">
                    <img
                      src={exam.logo}
                      alt={exam.institution}
                      className="max-w-full max-h-full object-contain rounded-md"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h3 className="text-[13px] xs:text-[14px] sm:text-[15px] font-bold text-[#111827] hover:text-[#0000ff] flex items-center gap-1 sm:gap-1.5 truncate">
                      {exam.institution}
                      {exam.verified && (
                        <BadgeCheckIcon className="w-3.25 h-3.25 sm:w-3.75 sm:h-3.75 text-white fill-blue-500 ml-0.5 sm:ml-1 shrink-0" />
                      )}
                    </h3>
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 text-[10px] xs:text-[11px] sm:text-[11px] text-[#6b7280] mt-0.5">
                      <span className="flex items-center ">
                        <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3" />{" "}
                        {exam.location}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-gray-300 hidden xs:inline"></span>
                      <span className="flex items-center gap-1">
                        <Award className="w-2.5 h-2.5 sm:w-3 sm:h-3" />{" "}
                        {exam.affiliation}
                      </span>
                    </div>
                    <a
                      href="#"
                      className="text-[#2563eb] text-[10px] xs:text-[11px] sm:text-[11px] font-medium mt-0.5 sm:mt-1 flex items-center gap-1 hover:underline"
                    >
                      <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />{" "}
                      {exam.website}
                    </a>
                  </div>
                </div>
                {/* Bookmark placeholder - moved to footer to match financial aid layout */}
                <div className="w-8 h-8 opacity-0"></div>
              </header>

              <main className="grow">
                <h4 className="text-[15px] xs:text-[16px] sm:text-[17px] font-bold text-[#111827] mb-2.5 sm:mb-3 leading-tight hover:text-[#0000ff]">
                  {exam.title}
                </h4>

                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                  {exam.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-[9px] xs:text-[10px] sm:text-[10px] font-bold flex items-center gap-1 sm:gap-1.5 ${
                        tag.type === "alert"
                          ? "bg-red-50 text-red-500"
                          : tag.type === "warning"
                            ? "bg-amber-50 text-amber-600"
                            : tag.type === "success"
                              ? "bg-emerald-50 text-emerald-600"
                              : tag.type === "purple"
                                ? "bg-purple-50 text-purple-600"
                                : "bg-gray-50 text-gray-600"
                      }`}
                    >
                      {tag.icon} {tag.text}
                    </span>
                  ))}
                </div>

                {/* More Compact Details Box */}
                <div className="bg-[#f8fafc] rounded-md sm:rounded-md p-2 sm:p-2.5 flex flex-col gap-1.5 sm:gap-2 mt-auto border border-[#f1f5f9]">
                  <div className="flex items-center gap-2 sm:gap-2.5 text-[11px] xs:text-[12px] sm:text-[13px] text-[#475569]">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#94a3b8] shrink-0" />
                    <span className="truncate font-medium text-red-500 text-[11px] sm:text-[12px]">
                      Ends: {exam.deadline}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-2.5 text-[11px] xs:text-[12px] sm:text-[13px] text-[#475569]">
                    <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#94a3b8] shrink-0" />
                    <span className="truncate text-[11px] sm:text-[12px]">
                      {exam.eligibility}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-2.5 text-[11px] xs:text-[12px] sm:text-[13px] text-[#475569]">
                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#94a3b8] shrink-0" />
                    <div className="flex gap-1.5 sm:gap-2 text-[10px] sm:text-[11px]">
                      <a
                        href={exam.whatsapp}
                        className="text-[#059669] hover:underline font-bold"
                      >
                        WhatsApp
                      </a>
                      <span className="text-gray-300">|</span>
                      <a
                        href={exam.viber}
                        className="text-[#6d28d9] hover:underline font-bold"
                      >
                        Viber
                      </a>
                    </div>
                  </div>
                </div>
              </main>

              {/* Action buttons */}
              <div className="mt-3 sm:mt-4 pt-1 flex flex-col gap-2 sm:gap-2.5">
                <button className="w-full flex items-center justify-center gap-2 py-2 sm:py-2.5 px-3 bg-brand-blue text-white font-bold text-[12px] sm:text-[13px] rounded-md hover:bg-brand-hover transition-colors">
                  <Send className="w-4 h-4" /> Apply Now
                </button>
                <div className="grid grid-cols-[1fr_1fr_auto] gap-2 sm:gap-2.5">
                  <button className="flex items-center justify-center gap-1.5 py-1.5 sm:py-2 px-2 sm:px-3 border border-[#e2e8f0] text-[#475569] font-bold text-[11px] xs:text-[12px] rounded-md hover:bg-gray-50 transition-colors">
                    <FileText className="w-3.5 h-3.5" /> <span>View Detail</span>
                  </button>
                  <button className="flex items-center justify-center gap-1.5 py-1.5 sm:py-2 px-2 sm:px-3 border border-[#e2e8f0] text-[#475569] font-bold text-[11px] xs:text-[12px] rounded-md hover:bg-gray-50 transition-colors">
                    <Bell className="w-3.5 h-3.5" /> Notify
                  </button>
                  <button
                    className={`w-9 sm:w-10 shrink-0 rounded-md flex items-center justify-center transition-all duration-200 ${
                      bookmarked.has(exam.id)
                        ? "border-blue-200 bg-blue-50"
                        : "bg-white border border-[#e2e8f0] text-[#94a3b8] hover:bg-[#f8fafc] hover:text-[#64748b]"
                    }`}
                    title={
                      bookmarked.has(exam.id) ? "Remove Bookmark" : "Bookmark"
                    }
                    onClick={(e) => toggleBookmark(e, exam.id)}
                  >
                    <Bookmark
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${bookmarked.has(exam.id) ? "text-[#0000ff] fill-[#0000ff]" : ""}`}
                    />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExamAnnouncementsSection;
