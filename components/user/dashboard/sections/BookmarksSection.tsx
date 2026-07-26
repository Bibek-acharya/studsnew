"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ProgramCard } from "@/components/find-college/CollegeGrid";
import { EntranceCard } from "@/components/entrance/EntranceGrid";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { Toast } from "@/components/ui/Toast";
import {
  Bookmark,
  MapPin,
  Star,
  BookOpen,
  DollarSign,
  Calendar,
  Clock,
  FileText,
  CheckCircle2,
  AlertCircle,
  Building2,
  ChevronRight,
  Trash2,
  BadgeCheck,
  Award,
  MessageSquare,
  LockIcon,
  GraduationCap,
  ClipboardCheck,
  CreditCard,
  Briefcase,
  PlayCircle,
  Bell,
  Send,
  ExternalLink,
  Users,
  Building,
  Globe,
  Monitor,
  TrendingUp,
  Flame,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { apiService } from "@/services/api";
import { admissionService } from "@/services/admission.api";
import { entranceService } from "@/services/entrance.api";
import { fetchCourseById } from "@/services/course-api";
import CollegeCard from "@/components/admissions/CollegeCard";
import { ScholarshipCard } from "@/components/cards/ScholarshipCard";
import { EventCard } from "@/components/cards/EventCard";

type BookmarkType =
  | "Colleges"
  | "Courses"
  | "Scholarships"
  | "Events"
  | "Entrance"
  | "Admissions";

interface BaseBookmark {
  id: number;
  type: BookmarkType;
  name: string;
  imageUrl?: string;
}

interface CollegeBookmark extends BaseBookmark {
  type: "Colleges";
  location: string;
  rating: string;
  affiliation: string;
  collegeType: string;
  isVerified: boolean;
  featured: boolean;
}

interface ScholarshipBookmark extends BaseBookmark {
  type: "Scholarships";
  eligibility: string;
  deadline: string;
  amount: string;
  org: string;
  status: "OPEN" | "CLOSING SOON" | "CLOSED";
  badgeType: string;
}

interface CourseBookmark extends BaseBookmark {
  type: "Courses";
  duration: string;
  offeredBy: string;
  affiliation: string;
  level: string;
  estFee: string;
}

interface EventBookmark extends BaseBookmark {
  type: "Events";
  date: string;
  time: string;
  organizer: string;
  location: string;
  category: string;
  excerpt: string;
}

interface EntranceBookmark extends BaseBookmark {
  type: "Entrance";
  date: string;
  format: string;
  institution: string;
  affiliation?: string;
  location?: string;
  website?: string;
  whatsapp?: string;
  viber?: string;
  deadline: string;
  eligibility: string;
  verified: boolean;
  tags: { text: string; icon: string; type: string }[];
}

interface AdmissionBookmark extends BaseBookmark {
  type: "Admissions";
  program: string;
  deadline: string;
  location: string;
  rating: number;
  collegeType: string;
  website: string;
  programs: {
    name: string;
    status: "Closing Soon" | "Opening Soon" | "Seats Available";
  }[];
}

type BookmarkItem =
  | CollegeBookmark
  | ScholarshipBookmark
  | CourseBookmark
  | EventBookmark
  | EntranceBookmark
  | AdmissionBookmark;

const TABS: BookmarkType[] = [
  "Colleges",
  "Courses",
  "Scholarships",
  "Events",
  "Entrance",
  "Admissions",
];

const iconMap: Record<string, React.ReactNode> = {
  flame: <Flame className="w-3 h-3" />,
  monitor: <Monitor className="w-3 h-3" />,
  globe: <Globe className="w-3 h-3" />,
  "trending-up": <TrendingUp className="w-3 h-3" />,
  building: <Building className="w-3 h-3" />,
  award: <Award className="w-3 h-3" />,
  "badge-check": <BadgeCheck className="w-3 h-3" />,
};

export default function BookmarksSection() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<BookmarkType>("Colleges");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      try {
        setLoading(true);
        const items = await apiService.getBookmarksByType(
          activeTab.toLowerCase(),
        );
        if (cancelled) return;

        if (activeTab === "Colleges") {
          const [collegeItems, instItems] = await Promise.all([
            apiService.getBookmarksByType("colleges"),
            apiService.getBookmarksByType("institutions").catch(() => []),
          ]);
          if (cancelled) return;
          const collegeDetails = await Promise.all(
            collegeItems.map((b) =>
              apiService
                .getCollegeById(b.item_id)
                .then((r) => r.data)
                .catch(() => null),
            ),
          );
          if (cancelled) return;
          const instDetails = await Promise.all(
            instItems.map((b) =>
              apiService
                .getPublicInstitutionById(b.item_id)
                .then((r) => r.data)
                .catch(() => null),
            ),
          );
          if (cancelled) return;
          const enriched = [
            ...collegeItems.map((b, i) => {
              const c = collegeDetails[i];
              if (!c) return null;
              return {
                bookmarkId: b.id,
                college: c,
                type: "Colleges" as const,
                id: c.id,
              };
            }),
            ...instItems.map((b, i) => {
              const c = instDetails[i];
              if (!c) return null;
              return {
                bookmarkId: b.id,
                college: {
                  id: c.id,
                  name: c.institution_name || c.name,
                  image_url: c.banner_url || c.image_url || c.logo_url,
                  rating: c.rating,
                  type: c.organization_type || c.type,
                  location: c.district || c.location,
                  affiliation: c.affiliation || c.college_affiliation,
                  website: c.website_url || c.website,
                  description: c.about || c.description,
                  featured: c.featured,
                  claimed: c.claimed,
                  verified: c.verified,
                  collegeType: c.organization_type,
                  full_name: c.institution_name,
                  email: c.email,
                  phone: c.contact_number || c.contact_phone,
                  established: c.established_year,
                },
                type: "Colleges" as const,
                id: c.id,
              };
            }),
          ].filter(Boolean);
          setBookmarks(enriched);
        } else if (activeTab === "Entrance") {
          const details = await Promise.all(
            items.map((b) =>
              entranceService
                .getEntranceById(String(b.item_id))
                .then((r) => r.data)
                .catch(() => null),
            ),
          );
          if (cancelled) return;
          const enriched = items
            .map((b, i) => {
              const e = details[i];
              if (!e) return null;
              return {
                bookmarkId: b.id,
                exam: e,
                type: "Entrance" as const,
                id: b.id,
              };
            })
            .filter(Boolean);
          setBookmarks(enriched);
        } else if (activeTab === "Courses") {
          const details = await Promise.all(
            items.map((b) =>
              fetchCourseById(String(b.item_id)).catch(() => null),
            ),
          );
          if (cancelled) return;
          const enriched = items
            .map((b, i) => {
              const c = details[i];
              if (!c) return null;
              return {
                bookmarkId: b.id,
                id: c.id || b.id,
                type: "Courses" as const,
                name: c.title,
                imageUrl: c.image,
                duration: c.duration,
                offeredBy: c.careerPath || c.institutionName || "",
                affiliation: c.affiliation,
                level: c.level,
                estFee: c.estFee,
                field: c.field,
                description: c.description,
                shortTitle: c.shortTitle,
              };
            })
            .filter(Boolean);
          setBookmarks(enriched);
        } else if (activeTab === "Admissions") {
          const details = await Promise.all(
            items.map((b) =>
              admissionService
                .getPublishedAdmissionCollegeById(b.item_id)
                .then((r) => r.data.institution)
                .catch(() => null),
            ),
          );
          if (cancelled) return;
          const enriched = items
            .map((b, i) => {
              const c = details[i];
              if (!c) return null;
              return {
                bookmarkId: b.id,
                college: c,
                type: "Admissions" as const,
                id: c.id,
              };
            })
            .filter(Boolean);
          setBookmarks(enriched);
        } else if (activeTab === "Scholarships") {
          const details = await Promise.all(
            items.map((b) =>
              apiService
                .getEducationScholarshipById(b.item_id)
                .catch(() => null),
            ),
          );
          if (cancelled) return;
          const enriched = items
            .map((b, i) => {
              const s = details[i];
              if (!s) return null;
              const sch = s?.data?.scholarship || s?.data || s || {};
              return {
                bookmarkId: b.id,
                id: sch.id || b.item_id,
                type: "Scholarships" as const,
                name: sch.title || "Scholarship",
                imageUrl: sch.image,
                org: sch.provider || "",
                badgeType: sch.scholarship_type || "Scholarship",
                amount: sch.amount || sch.value || "",
                eligibility: sch.eligibility || "",
                deadline: sch.deadline || sch.end_date || "",
                status: sch.status || "OPEN",
              };
            })
            .filter(Boolean);
          setBookmarks(enriched);
        } else if (activeTab === "Events") {
          const details = await Promise.all(
            items.map((b) =>
              apiService.getEducationEventById(b.item_id).catch(() => null),
            ),
          );
          if (cancelled) return;
          const enriched = items
            .map((b, i) => {
              const e = details[i];
              if (!e) return null;
              const ev = e?.data?.event || e || {};
              return {
                bookmarkId: b.id,
                id: ev.id || b.item_id,
                type: "Events" as const,
                name: ev.title || "Event",
                imageUrl: ev.image,
                category: ev.category || "workshop",
                organizer: ev.organizer || "",
                location: ev.location || "",
                excerpt: ev.excerpt || ev.description || "",
                date: ev.date || "",
                time: ev.time || "",
              };
            })
            .filter(Boolean);
          setBookmarks(enriched);
        } else {
          setBookmarks(items.map((b) => ({ ...b, type: activeTab })));
        }
        setError(null);
      } catch (err) {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Failed to load bookmarks",
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  const filteredBookmarks = bookmarks.filter((b) => b.type === activeTab);

  const removeBookmark = async (bookmarkId: number) => {
    try {
      await apiService.deleteBookmark(bookmarkId);
      setBookmarks((prev) => prev.filter((b) => b.bookmarkId !== bookmarkId));
      setToast({ message: "Bookmark removed", type: "success" });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to remove bookmark",
      );
    }
  };

  const levelBadgeColor = (level?: string) => {
    const l = (level || "").toLowerCase();
    if (
      l.includes("+2") ||
      l.includes("plus two") ||
      l.includes("higher secondary")
    )
      return "bg-[#7c3aed]/10 text-[#7c3aed]";
    if (l.includes("bachelor") || l.includes("bach") || l.includes("diploma"))
      return "bg-[#db2777]/10 text-[#db2777]";
    if (l.includes("master") || l.includes("post"))
      return "bg-[#ea580c]/10 text-[#ea580c]";
    return "bg-gray-100 text-gray-600";
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "OPEN":
        return {
          statusDot: "bg-[#22c55e]",
          statusText: "text-[#22c55e]",
          statusBg: "bg-green-50",
        };
      case "CLOSING SOON":
        return {
          statusDot: "bg-[#eab308]",
          statusText: "text-[#eab308]",
          statusBg: "bg-yellow-50",
        };
      case "CLOSED":
        return {
          statusDot: "bg-gray-400",
          statusText: "text-gray-500",
          statusBg: "bg-gray-100",
        };
      default:
        return {
          statusDot: "bg-gray-400",
          statusText: "text-gray-500",
          statusBg: "bg-gray-100",
        };
    }
  };

  const badgeClass = (category: string) => {
    if (category === "Seminar & Workshop") return "bg-[#00c2a8]";
    if (category === "Career Fairs") return "bg-orange-500";
    if (category === "Hackthons") return "bg-blue-500";
    return "bg-blue-500";
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Bookmarks</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">Bookmarks</span>
        </div>
      </div>
      <style jsx>{`
        .fade-in {
          animation: fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          opacity: 0;
          transform: translateY(15px);
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .card-stagger:nth-child(1) {
          animation-delay: 0.05s;
        }
        .card-stagger:nth-child(2) {
          animation-delay: 0.1s;
        }
        .card-stagger:nth-child(3) {
          animation-delay: 0.15s;
        }
        .card-stagger:nth-child(4) {
          animation-delay: 0.2s;
        }

        .hide-scroll-x::-webkit-scrollbar {
          display: none;
        }
        .hide-scroll-x {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-tooltip {
          position: absolute;
          bottom: 100%;
          left: 0;
          margin-bottom: 8px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s;
          z-index: 20;
          width: auto;
          max-width: 200px;
          background-color: #111827;
          color: white;
          font-size: 11px;
          font-weight: 500;
          padding: 6px 10px;
          border-radius: 6px;
          pointer-events: none;
          transform: translateY(4px);
        }
        .group:hover .custom-tooltip {
          opacity: 1;
          visibility: visible;
          transform: translateY(-4px);
        }
        .tooltip-arrow {
          position: absolute;
          top: 100%;
          left: 16px;
          border-width: 5px;
          border-style: solid;
          border-color: #111827 transparent transparent transparent;
        }
      `}</style>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-md mb-6 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setLoading(true);
              setActiveTab(tab);
            }}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
              activeTab === tab
                ? "bg-white text-brand-blue"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-md border border-slate-200 p-5 space-y-3 animate-pulse"
            >
              <Skeleton className="h-40 w-full rounded-md" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && <ErrorState error={error} />}

      {/* Cards Grid */}
      {!loading && !error && filteredBookmarks.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
          {filteredBookmarks.map((item) => (
            <div key={item.id} className="fade-in card-stagger h-full">
              {item.type === "Colleges" && (
                <ProgramCard
                  college={item.college}
                  isVerified={item.college.verified === true}
                  isClaimed={item.college.claimed === true}
                  isSaved={true}
                  isSelected={false}
                  isQuickInquiryMode={false}
                  onNavigate={(view, data) => {
                    if (view === "collegeDetails" && data?.id) {
                      router.push(`/find-college/${data.id}`);
                    }
                  }}
                  onToggleSaved={() => removeBookmark(item.bookmarkId)}
                  onToggleSelection={() => {}}
                  onClaim={() => {}}
                  onSingleInquiry={() =>
                    router.push(`/find-college/${item.college.id}?inquiry=true`)
                  }
                />
              )}

              {item.type === "Courses" && (
                <div className="bg-white rounded-md border border-gray-200 flex flex-col h-full transition-all hover:border-blue-500/20 duration-300">
                  <div className="relative h-28 w-full p-3 pb-2">
                    <img
                      src={
                        item.imageUrl ||
                        `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=200`
                      }
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>

                  <div className="px-3 pb-3 pt-0 flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-1.5 text-[12px] font-bold">
                      <span
                        className={`${levelBadgeColor((item as CourseBookmark).level)} px-2 py-0.5 rounded-md tracking-wide uppercase`}
                      >
                        {(item as CourseBookmark).level}
                      </span>
                      <div className="flex items-center text-gray-500 gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {(item as CourseBookmark).duration}
                      </div>
                    </div>

                    <div className="relative group mb-1.5">
                      <h2 className="text-base font-bold text-gray-900 group-hover:text-brand-blue cursor-pointer transition-colors truncate leading-tight">
                        {item.name}
                      </h2>
                      <div className="custom-tooltip">
                        {item.name}
                        <div className="tooltip-arrow"></div>
                      </div>
                    </div>

                    <div className="space-y-1 text-[12px] flex-1">
                      <div className="flex items-start gap-2">
                        <Building2 className="w-3.75 h-3.75 text-gray-400 mt-px shrink-0" />
                        <div>
                          <span className="font-bold text-gray-700">
                            Affiliation:
                          </span>{" "}
                          <span className="text-gray-600">
                            {(item as CourseBookmark).affiliation}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <GraduationCap className="w-3.75 h-3.75 text-gray-400 mt-px shrink-0" />
                        <div>
                          <span className="font-bold text-gray-700">
                            Eligibility:
                          </span>{" "}
                          <span className="text-gray-600">
                            As per institution criteria
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <ClipboardCheck className="w-3.75 h-3.75 text-gray-400 mt-px shrink-0" />
                        <div>
                          <span className="font-bold text-gray-700">
                            Entrance:
                          </span>{" "}
                          <span className="text-gray-600">
                            Entrance exam required
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CreditCard className="w-3.75 h-3.75 text-gray-400 mt-px shrink-0" />
                        <div>
                          <span className="font-bold text-gray-700">
                            Est. Fee:
                          </span>{" "}
                          <span className="text-brand-blue font-bold">
                            {(item as CourseBookmark).estFee}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 mb-4">
                        <Briefcase className="w-3.75 h-3.75 text-gray-400 mt-px shrink-0" />
                        <div>
                          <span className="font-bold text-gray-700">
                            Career:
                          </span>{" "}
                          <span className="text-gray-600 truncate inline-block max-w-37.5 align-bottom">
                            {(item as CourseBookmark).offeredBy}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-auto pt-6 border-t border-dashed border-gray-200">
                      <button className="flex-[1.5] flex items-center justify-center border border-gray-200 hover:bg-gray-50 text-slate-600 font-medium py-2 rounded-md transition-colors text-[12px] whitespace-nowrap">
                        Details
                      </button>

                      <button className="flex-[2.5] bg-brand-blue hover:bg-brand-hover text-white font-semibold py-2 rounded-md  text-[12px] flex items-center justify-center transition-colors whitespace-nowrap">
                        View Colleges
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBookmark(item.id);
                        }}
                        className={`shrink-0 w-10 flex items-center justify-center border rounded-md transition-colors ${
                          true
                            ? "border-blue-200 bg-blue-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <Bookmark
                          className={`w-4 h-4 transition-all ${
                            true
                              ? "text-brand-blue fill-brand-blue"
                              : "text-gray-400"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {item.type === "Scholarships" && (
                <ScholarshipCard
                  scholarship={{
                    id: item.id,
                    title: item.name,
                    org: (item as ScholarshipBookmark).org,
                    badgeType: (item as ScholarshipBookmark).badgeType,
                    fundingType: (item as ScholarshipBookmark).amount,
                    eligibility: (item as ScholarshipBookmark).eligibility,
                    deadline: (item as ScholarshipBookmark).deadline,
                    imageUrl: item.imageUrl,
                    imagePlaceholder: item.name,
                  }}
                  isSaved={true}
                  onToggleSaved={() => removeBookmark(item.id)}
                />
              )}

              {item.type === "Events" && (
                <EventCard
                  event={{
                    id: item.id,
                    title: item.name,
                    image: item.imageUrl,
                    category: (item as EventBookmark).category,
                    organizer: (item as EventBookmark).organizer,
                    location: (item as EventBookmark).location,
                    excerpt: (item as EventBookmark).excerpt,
                    date: (item as EventBookmark).date,
                  }}
                  isBookmarked={true}
                  onToggleBookmark={() => removeBookmark(item.id)}
                />
              )}

              {item.type === "Entrance" && (
                <EntranceCard
                  exam={item.exam}
                  isSaved={true}
                  isPending={false}
                  onToggleSaved={(e) => {
                    e.stopPropagation();
                    removeBookmark(item.bookmarkId);
                  }}
                />
              )}

              {item.type === "Admissions" && (
                <CollegeCard
                  images={
                    item.college.image_url
                      ? [item.college.image_url]
                      : ["/images/college-placeholder.png"]
                  }
                  collegeName={item.college.name}
                  rating={item.college.rating ?? 4.0}
                  type={item.college.type || "College"}
                  location={item.college.location}
                  website={item.college.website || item.college.affiliation}
                  programs={(() => {
                    const fp = (item.college as any).featured_programs;
                    if (Array.isArray(fp)) {
                      return fp.slice(0, 3).map((p: any) => {
                        const name = p.title || "";
                        const rawStatus = p.admissionStatus || "";
                        const statusMap: Record<
                          string,
                          "Seats Available" | "Closing Soon" | "Opening Soon"
                        > = {
                          "seats-available": "Seats Available",
                          "limited-seats": "Closing Soon",
                          "opening-soon": "Opening Soon",
                        };
                        return {
                          name,
                          status: statusMap[rawStatus] || "Seats Available",
                        };
                      });
                    }
                    return [
                      {
                        name:
                          item.college.affiliation ||
                          item.college.name ||
                          "Admission Open",
                        status: "Seats Available" as const,
                      },
                    ];
                  })()}
                  moreProgramsCount={item.college.programs}
                  isSaved={true}
                  onNavigate={() =>
                    router.push(`/find-college/${item.college.id}`)
                  }
                  onToggleSaved={() => removeBookmark(item.bookmarkId)}
                  onApply={() =>
                    router.push(`/find-college/${item.college.id}`)
                  }
                  onAskQuestion={() => {}}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        !loading &&
        !error && (
          <div
            id="empty-state"
            className="flex flex-col items-center justify-center py-24 px-4 text-center fade-in bg-white rounded-md border border-slate-200 "
          >
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Bookmark className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">
              No bookmarks yet
            </h3>
            <p className="text-slate-500 max-w-md mx-auto text-base">
              Save colleges, courses, and scholarships to find them later.
            </p>
            <button className="mt-8 px-8 py-3 bg-brand-blue text-white font-semibold rounded-md hover:bg-brand-hover transition-all">
              Explore Directory
            </button>
          </div>
        )
      )}

      {toast && <Toast message={toast.message} />}
    </div>
  );
}
