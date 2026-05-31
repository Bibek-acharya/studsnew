"use client";

import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { apiService, getImageUrl } from "@/services/api";
import { useAuth } from "@/services/AuthContext";
import CollegeCard from "@/components/admissions/CollegeCard";
import { BadgeCheckIcon, Building2, ChevronLeft, ChevronRight, MessageSquarePlus, FileX } from "lucide-react";
import ShareCollegeModal from "./ShareCollegeModal";
import {
  AboutVideoInteractive,
  FilterPills,
  ProgTh,
  InfoBlock,
  OverviewRow,
  AdminRow,
  RatingBar,
  ReviewCard,
  ContactInfoRow,
} from "./components";
import ClaimCollegeModal from "./components/ClaimCollegeModal";
import OpenCounsellingModal from "./components/OpenCounsellingModal";
import { getInstitutionCourses } from "@/services/institutionCourses";

type TabKey =
  | "about"
  | "courses"
  | "admissions"
  | "offered"
  | "facilities"
  | "events"
  | "scholarship"
  | "alumni"
  | "gallery"
  | "review"
  | "news"
  | "download";

type LevelFilter = "all" | "+2" | "Bachelor" | "Master";

const courses: { level: LevelFilter; name: string; specialization: string; duration: string; type: string; fees: string; eligibility: string; seats: string }[] = [];

const admissions: { level: LevelFilter; status: string; title: string; affiliation: string; openDate: string; deadline: string; image?: string }[] = [];

const offeredPrograms: { level: LevelFilter; name: string; affiliation: string; status: string }[] = [];

const scholarships: { level: LevelFilter; program: string; scholarship: string; benefit: string; audience: string }[] = [];

const facilities: { icon: string; title: string; desc: string }[] = [];

const events: { image: string; title: string; date: string; desc: string }[] = [];

const alumni: { image: string; name: string; role: string; batch: string }[] = [];

const galleryImages: string[] = [];

const newsCards: { badge: string; badgeClass: string; image: string; title: string; desc: string; time: string }[] = [];

const downloads: { title: string; size: string; color: string; btn: string }[] = [];

const isCollegeVerified = (value: unknown): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return ["true", "1", "yes", "verified", "active"].includes(normalized);
  }
  return false;
};

const CollegeDetailsPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id: idStr } = React.use(params);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const collegeId = idStr ? Number(idStr.replace("inst_", "")) : null;

  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryCourse, setInquiryCourse] = useState("");
  const [inquirySending, setInquirySending] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);
  const [isAskQuestionOpen, setIsAskQuestionOpen] = useState(false);
  const [askName, setAskName] = useState("");
  const [askEmail, setAskEmail] = useState("");
  const [askPhone, setAskPhone] = useState("");
  const [askMessage, setAskMessage] = useState("");
  const [askSending, setAskSending] = useState(false);
  const [askSent, setAskSent] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("about");
  const [courseFilter, setCourseFilter] = useState<LevelFilter>("all");
  const [admissionFilter, setAdmissionFilter] = useState<LevelFilter>("all");
  const [programFilter, setProgramFilter] = useState<LevelFilter>("all");
  const [scholarshipFilter, setScholarshipFilter] =
    useState<LevelFilter>("all");

  const inquiryErrors = useMemo(() => ({
    name: inquiryName && inquiryName.trim().length < 2 ? "Name must be at least 2 characters" : "",
    email: inquiryEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiryEmail) ? "Enter a valid email" : "",
    phone: inquiryPhone && !/^9\d{9}$/.test(inquiryPhone) ? "Must be 10 digits starting with 9" : "",
  }), [inquiryName, inquiryEmail, inquiryPhone]);

  const askErrors = useMemo(() => ({
    name: askName && askName.trim().length < 2 ? "Name must be at least 2 characters" : "",
    email: askEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(askEmail) ? "Enter a valid email" : "",
    phone: askPhone && !/^9\d{9}$/.test(askPhone) ? "Must be 10 digits starting with 9" : "",
  }), [askName, askEmail, askPhone]);

  const inquiryValid = inquiryName.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiryEmail) && (!inquiryPhone || /^9\d{9}$/.test(inquiryPhone));
  const askValid = askName.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(askEmail) && (!askPhone || /^9\d{9}$/.test(askPhone)) && askMessage.trim().length > 0;
  const askTouched = useRef(false);
  const inquiryTouched = useRef(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCounsellingModalOpen, setIsCounsellingModalOpen] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [showUnfollowDialog, setShowUnfollowDialog] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [visibleImageCount, setVisibleImageCount] = useState(9);
  const [eventsPage, setEventsPage] = useState(1);
  const [newsPage, setNewsPage] = useState(1);
  const [admissionPage, setAdmissionPage] = useState(1);
  const [shareUrl, setShareUrl] = useState("");
  const [college, setCollege] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviewsData, setReviewsData] = useState<any>(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const tabsScrollRef = useRef<HTMLDivElement | null>(null);
  const tabsNavRef = useRef<HTMLElement | null>(null);
  const [isTabsOverflowing, setIsTabsOverflowing] = useState(false);
  const [canScrollTabsLeft, setCanScrollTabsLeft] = useState(false);
  const [canScrollTabsRight, setCanScrollTabsRight] = useState(false);

  const updateTabScrollState = useCallback(() => {
    const container = tabsScrollRef.current;
    const nav = tabsNavRef.current;
    const firstTab = nav?.firstElementChild as HTMLElement | null;
    const lastTab = nav?.lastElementChild as HTMLElement | null;

    if (!container || !nav || !firstTab || !lastTab) {
      setIsTabsOverflowing(false);
      setCanScrollTabsLeft(false);
      setCanScrollTabsRight(false);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const firstTabRect = firstTab.getBoundingClientRect();
    const lastTabRect = lastTab.getBoundingClientRect();

    const leftOverflow = firstTabRect.left < containerRect.left - 4;
    const rightOverflow = lastTabRect.right > containerRect.right + 4;

    setIsTabsOverflowing(leftOverflow || rightOverflow);
    setCanScrollTabsLeft(leftOverflow);
    setCanScrollTabsRight(rightOverflow);
  }, []);

  const scrollTabs = (direction: "left" | "right") => {
    const container = tabsScrollRef.current;
    if (!container) return;

    const step = Math.max(180, Math.floor(container.clientWidth * 0.5));
    container.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  const handlePrevImage = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) =>
      prev === 0 ? galleryImagesSource.length - 1 : (prev as number) - 1
    );
  };

  const handleNextImage = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) =>
      prev === galleryImagesSource.length - 1 ? 0 : (prev as number) + 1
    );
  };

  useEffect(() => {
    if (!idStr) {
      setLoading(false);
      return;
    }

    const numericId = Number(idStr.replace("inst_", ""));
    if (!numericId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    apiService
      .getPublicInstitutionById(numericId)
      .then((res) => {
        setCollege(res.data);
        setLoading(false);
      })
      .catch(() => {
        apiService
          .getCollegeById(numericId)
          .then((res) => {
            setCollege(res.data);
            setLoading(false);
          })
          .catch(() => setLoading(false));
      });
  }, [idStr]);

  useEffect(() => {
    if (activeTab === "review" && collegeId && !reviewsData) {
      setReviewsLoading(true);
      apiService.getCollegeReviews(collegeId, { page: 1, limit: 10 })
        .then((res) => {
          if (res?.data) {
            setReviewsData(res.data);
          }
        })
        .catch(console.error)
        .finally(() => setReviewsLoading(false));
    }
  }, [activeTab, collegeId]);

  useEffect(() => {
    const container = tabsScrollRef.current;
    if (!container) return;

    updateTabScrollState();
    const handleScroll = () => updateTabScrollState();
    const handleResize = () => updateTabScrollState();

    container.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => updateTabScrollState());
      observer.observe(container);
      if (tabsNavRef.current) {
        observer.observe(tabsNavRef.current);
      }
    }

    requestAnimationFrame(() => updateTabScrollState());

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      observer?.disconnect();
    };
  }, [updateTabScrollState]);

  useEffect(() => {
    updateTabScrollState();
  }, [activeTab, updateTabScrollState]);

  useEffect(() => {
    setShareUrl(window.location.href);
  }, [collegeId]);

  const isInstitution = !!college?.institution_name;

  // For institution: map fields from institution API response
  const instName = isInstitution ? college?.institution_name : null;
  const instLocation = isInstitution ? college?.district : null;
  const instWebsite = isInstitution ? college?.website_url : null;
  const instDescription = isInstitution ? college?.about : null;
  const instVision = isInstitution ? college?.vision : null;
  const instMission = isInstitution ? college?.mission : null;
  const instOverviewData = isInstitution ? college?.overview_data : null;
  const instLeadershipData = isInstitution ? college?.leadership_data : null;
  const instVideos = isInstitution ? college?.videos : null;
  const instCourses = isInstitution ? college?.courses_data : null;
  const instPrograms = isInstitution ? college?.programs_data : null;
  const instFacilities = isInstitution ? college?.facilities_data : null;
  const instAlumni = isInstitution ? college?.alumni_data : null;
  const instGallery = isInstitution ? college?.gallery_data : null;
  const instDownloads = isInstitution ? college?.downloads_data : null;
  const instInstitutionPrograms = isInstitution ? college?.institution_programs : null;
  const instInstitutionEvents = isInstitution ? college?.institution_events : null;
  const instInstitutionNews = isInstitution ? college?.institution_news : null;
  const instInstitutionScholarships = isInstitution ? college?.institution_scholarships : null;
  const instAdmissionPageData = isInstitution ? college?.admission_page_data : null;
  const galleryImagesSource = useMemo(() => {
    if (!instGallery || !Array.isArray(instGallery)) return galleryImages;
    return instGallery.flatMap((g: any) => {
      if (g.images && Array.isArray(g.images)) {
        return g.images.map((img: any) => getImageUrl(img.url || img));
      }
      return getImageUrl(g.url || g);
    }).filter(Boolean);
  }, [instGallery]);
  const instLogo = isInstitution ? getImageUrl(college?.logo_url) : null;
  const instBanner = isInstitution ? getImageUrl(college?.banner_url) : null;

  const mappedCourses = useMemo(() => {
    if (instCourses && Array.isArray(instCourses)) {
      return instCourses
        .filter((c: any) => c.courseName || c.name)
        .map((c: any) => ({
          name: c.courseName || c.name || "",
          specialization: c.specialization || "",
          duration: c.duration || "",
          type: c.type || "",
          fees: c.feesText || c.fees || "",
          eligibility: c.eligibility || "",
          seats: c.seats || "",
        }));
    }
    return null;
  }, [instCourses]);

  const mappedPrograms = useMemo(() => {
    if (instPrograms && Array.isArray(instPrograms)) {
      return instPrograms
        .filter((p: any) => p.title || p.name)
        .map((p: any) => ({
          name: p.title || p.name || "",
          level: p.subtitle || p.level || "",
          affiliation: p.affiliation || "",
          status: p.admissionStatus || p.status || "",
        }));
    }
    return null;
  }, [instPrograms]);

  const mappedFacilities = useMemo(() => {
    if (instFacilities && Array.isArray(instFacilities)) {
      return instFacilities.map((f: any) => ({
        icon: f.facilityIcon || f.icon || "",
        title: f.heading || f.title || "",
        desc: f.description || f.desc || "",
      }));
    }
    return null;
  }, [instFacilities]);

  const mappedDownloads = useMemo(() => {
    if (instDownloads && Array.isArray(instDownloads)) {
      return instDownloads.map((d: any) => ({
        title: d.title || d.name || "",
        size: d.description || d.size || "",
        file: d.file || null,
      }));
    }
    return null;
  }, [instDownloads]);

  const institutionProgramsFromTable = useMemo(() => {
    if (!instInstitutionPrograms || !Array.isArray(instInstitutionPrograms)) return [];
    return instInstitutionPrograms
      .filter((p: any) => p.name)
      .map((p: any) => ({
        name: p.name || "",
        level: p.duration || "",
        affiliation: p.capacity ? `${p.capacity} seats` : "",
        status: p.status === "active" ? "Ongoing" : "Closed",
      }));
  }, [instInstitutionPrograms]);

  const mappedAdmissions = useMemo(() => {
    if (!instAdmissionPageData) return null;
    const pageData = typeof instAdmissionPageData === "string"
      ? JSON.parse(instAdmissionPageData)
      : instAdmissionPageData;
    const level = pageData?.overview_data?.level || "";
    const programs = pageData?.programs_data || [];
    return programs.map((p: any) => ({
      level: level || p.subtitle || "",
      status: p.admissionStatus || "Ongoing",
      title: p.title || "",
      affiliation: p.affiliation || "",
      openDate: p.openDate || "",
      deadline: p.deadline || "",
      image: p.programIcon || "",
    }));
  }, [instAdmissionPageData]);

  const mappedEvents = useMemo(() => {
    if (!instInstitutionEvents || !Array.isArray(instInstitutionEvents)) return null;
    return instInstitutionEvents.map((e: any) => ({
      image: getImageUrl(e.image) || "",
      title: e.title || "",
      date: `${e.date || ""} | ${e.location || "TBD"}`,
      desc: e.description || "",
    }));
  }, [instInstitutionEvents]);

  const mappedNews = useMemo(() => {
    if (!instInstitutionNews || !Array.isArray(instInstitutionNews)) return null;
    return instInstitutionNews.map((n: any) => ({
      badge: n.category || "News",
      badgeClass: "bg-blue-500 text-white",
      image: getImageUrl(n.image) || "",
      title: n.title || "",
      desc: n.excerpt || n.content || "",
      time: n.created_at ? new Date(n.created_at).toLocaleDateString() : "",
    }));
  }, [instInstitutionNews]);

  const mappedScholarships = useMemo(() => {
    if (!instInstitutionScholarships || !Array.isArray(instInstitutionScholarships)) return null;
    return instInstitutionScholarships.map((s: any) => ({
      level: s.degree_level || "",
      program: s.field_of_study?.join(", ") || s.title || "",
      scholarship: s.title || "",
      benefit: s.value || "",
      audience: s.eligibility || s.description || "",
    }));
  }, [instInstitutionScholarships]);

  const name = instName || college?.name || "";
  const locationText = instLocation || college?.location || "";
  const rating = college?.rating ?? 0;
  const reviewsCount =
    college?.reviews !== undefined
      ? Number(college.reviews || 0).toLocaleString()
      : "0";
  const website = instWebsite || college?.website || "";
  const websiteHref =
    website.startsWith("http://") || website.startsWith("https://")
      ? website
      : website ? `https://${website}` : "";
  const description = instDescription || college?.description || "";
  const isVerified = isCollegeVerified(college?.verified) || college?.claimed === true;
  const shareTitle = `${name} - Studsphere`;
  const shareText = `Check out ${name} on Studsphere`;

  const filteredCourses = useMemo(
    () =>
      courses.filter(
        (item) => courseFilter === "all" || item.level === courseFilter,
      ),
    [courseFilter],
  );
  const filteredPrograms = useMemo(
    () =>
      offeredPrograms.filter(
        (item) => programFilter === "all" || item.level === programFilter,
      ),
    [programFilter],
  );
  const institutionCoursesFromStorage = useMemo(
    () => getInstitutionCourses().map((c) => ({
      id: c.id,
      level: c.level,
      name: c.name,
      affiliation: c.level === "+2" ? "NEB" : `${c.level} Program`,
      status: c.status === "Active" ? "Ongoing" : "Closed",
      courseId: c.id,
    })),
    [],
  );
  const filteredScholarships = useMemo(
    () =>
      scholarships.filter(
        (item) =>
          scholarshipFilter === "all" || item.level === scholarshipFilter,
      ),
    [scholarshipFilter],
  );

  if (loading) {
    return (
      <div className="w-full animate-pulse">
        <div className="relative h-55 w-full bg-gray-200 md:h-90" />
        <div className="mx-auto max-w-350 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="-mt-16 shrink-0 md:-mt-20">
              <div className="h-24 w-24 rounded-lg bg-gray-300 md:h-32 md:w-32" />
            </div>
            <div className="flex-1 space-y-3 pt-2">
              <div className="h-7 w-72 rounded bg-gray-300" />
              <div className="h-4 w-48 rounded bg-gray-200" />
              <div className="h-4 w-96 rounded bg-gray-200" />
            </div>
          </div>
          <div className="mt-8 flex gap-6 border-b border-gray-200 pb-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-6 w-20 rounded bg-gray-200" />
            ))}
          </div>
          <div className="mt-8 space-y-4">
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-3/4 rounded bg-gray-200" />
            <div className="h-4 w-5/6 rounded bg-gray-200" />
            <div className="h-4 w-2/3 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        className="relative h-55 w-full bg-blue-800 bg-center md:h-90"
        style={{ ...(instBanner ? { backgroundImage: `url('${instBanner}')` } : {}) }}
      >
        <div className="absolute bottom-4 right-4 z-20 md:bottom-6 md:right-6">
          {isVerified ? (
            <button
              onClick={() => setIsCounsellingModalOpen(true)}
              className="flex items-center gap-2 rounded-md bg-black/60 cursor-pointer px-5 py-2.5 text-sm font-bold text-white transition-all duration-300  md:px-6 md:py-3 md:text-base"
            >
              <MessageSquarePlus />
              <span>Open Counselling</span>
            </button>
          ) : (
            <button
              onClick={() => setIsClaimModalOpen(true)}
              className="flex items-center gap-2 rounded-md bg-black/50 px-5 py-1 text-sm font-bold text-white transition-all duration-300 md:px-6 md:py-1 md:text-base"
            >
              {/* <i className="fa-solid fa-building-shield text-brand-blue"></i> */}
              Is this your college? <span className="underline hover:text-brand-blue cursor-pointer">Claim now</span>
            </button>
          )}
        </div>
      </div>

      <div className="relative bg-white">
        <div className="relative px-6 pb-8 md:px-12 lg:px-24 xl:px-32">
          <div className="relative z-10 mr-auto -mt-12 flex h-30 w-30 items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-white p-2 md:absolute md:-top-4 md:left-12 md:mx-0 md:mt-0 md:h-37.5 md:w-37.5 lg:left-24 xl:left-32">
            {instLogo ? (
              <img src={instLogo} alt="College Logo" className="h-full w-full object-contain" />
            ) : (
              <Building2 className="h-12 w-12 text-gray-300" />
            )}
          </div>

          <div className="mt-4 flex flex-col items-center justify-between gap-6 lg:mt-0 lg:flex-row lg:items-end lg:gap-0 lg:pl-42.5">
            <div className="w-full space-y-3 text-left lg:w-auto">
              <div className="flex items-center justify-start gap-2 pt-4">
                <h1 className="text-[24px] font-bold tracking-tight text-gray-900 md:text-3xl ">
                  {name}
                </h1>
                {isCollegeVerified(college?.verified) && (
                  <BadgeCheckIcon className="text-white fill-brand-blue" />
                )}
              </div>
              <div className="flex flex-wrap items-center justify-start gap-x-5 gap-y-1 text-[14px] font-medium">
                <div className="flex items-center gap-1.5">
                  <i className="fa-solid fa-location-dot text-gray-500"></i>
                  <span className="text-gray-600">{locationText}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <i className="fa-solid fa-star text-yellow-400"></i>
                  <span className="font-bold text-gray-900">{rating}</span>
                  <span className="text-gray-500">
                    ({reviewsCount} Reviews)
                  </span>
                </div>
                {college?.featured && website && (
                  <a
                    href={websiteHref}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[13px] font-medium tracking-wide text-brand-blue transition-colors hover:text-brand-hover"
                  >
                    <i className="fa-solid fa-globe text-gray-500 text-[12px]"></i>
                    {website.toLowerCase()}
                  </a>
                )}
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
                {isFollowed ? (
                  <i className="fa-solid fa-check"></i>
                ) : (
                  <i className="fa-solid fa-plus"></i>
                )}
                {isFollowed ? "Following" : "Follow"}
              </button>
            </div>

            <div className="mt-8 flex w-full flex-nowrap items-center gap-2 overflow-x-auto pb-1 lg:mt-0 lg:w-auto lg:gap-3 lg:overflow-visible lg:pb-0">
              {college?.brochure_data?.url ? (
                <a
                  href={getImageUrl(college.brochure_data.url)}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-[14px] font-semibold text-gray-700 transition-colors hover:bg-gray-50 lg:px-5 lg:py-3 lg:text-[15px]"
                >
                  <i className="fa-solid fa-download"></i>Brochure
                </a>
              ) : (
                <button className="shrink-0 flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-[14px] font-semibold text-gray-400 transition-colors lg:px-5 lg:py-3 lg:text-[15px] cursor-not-allowed" disabled>
                  <i className="fa-solid fa-download"></i>Brochure
                </button>
              )}
              <button
                onClick={() => setIsAskQuestionOpen(true)}
                className="shrink-0 flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-[14px] font-semibold text-gray-700 transition-colors hover:bg-gray-50 lg:px-5 lg:py-3 lg:text-[15px]">
                <i className="fa-regular fa-circle-question"></i>Ask Question
              </button>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="shrink-0 flex items-center justify-center rounded-md border border-gray-200 bg-white p-2.5 text-gray-700  transition-colors hover:bg-gray-50 lg:p-3"
                aria-label="Share college profile"
              >
                <i className="fa-solid fa-share-nodes"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-40 border-b border-t border-gray-100 bg-white  shadow-gray-100/50">
        <div className="relative overflow-hidden px-6 md:px-12 lg:px-24 xl:px-32">
          {isTabsOverflowing && canScrollTabsLeft && (
            <button
              type="button"
              onClick={() => scrollTabs("left")}
              className="absolute left-6 top-1/2 z-20 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-1.5 text-gray-700  transition hover:bg-gray-50 md:left-12 lg:left-24 xl:left-32"
              aria-label="Scroll tabs left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}

          {isTabsOverflowing && canScrollTabsRight && (
            <button
              type="button"
              onClick={() => scrollTabs("right")}
              className="absolute right-6 top-1/2 z-20 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-1.5 text-gray-700  transition hover:bg-gray-50 md:right-12 lg:right-24 xl:right-32"
              aria-label="Scroll tabs right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}

          <div
            ref={tabsScrollRef}
            className="overflow-x-auto scroll-smooth px-8 sm:px-9 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <nav
              ref={tabsNavRef}
              className="flex w-max space-x-8 whitespace-nowrap pr-6 md:pr-12 lg:pr-24 xl:pr-32"
            >
              {[
                ["about", "About"],
                ["courses", "Courses & Fees"],
                ["admissions", "Admissions"],
                ["offered", "Offered Program"],
                ["facilities", "Facilities"],
                ["events", "Events & Activities"],
                ["scholarship", "Scholarship"],
                ["alumni", "Alumni"],
                ["gallery", "Gallery"],
                ["review", "Review"],
                ["news", "News & Notice"],
                ["download", "Downloads"],
              ].map(([key, label]) => {
                const selected = activeTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key as TabKey)}
                    className={`shrink-0 border-b-2 bg-white py-4 text-[15px] ${selected ? "border-brand-blue font-bold text-gray-900" : "border-transparent font-semibold text-gray-500 hover:text-gray-900"}`}
                  >
                    {label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 bg-[#f8fafc] px-6 py-8 md:gap-14 md:px-12 md:py-12 lg:grid-cols-3 lg:px-24 xl:px-32">
        <div className="lg:col-span-2">
          {activeTab === "about" && (
            <div className="space-y-10">
              <AboutVideoInteractive videos={instVideos || undefined} />

              <div className="space-y-6 text-[15px] leading-[1.8] text-gray-600 md:text-[16px] [word-break:keep-all] [&_*]:[word-break:keep-all] [overflow-wrap:anywhere] [&_*]:[overflow-wrap:anywhere]">
                <div dangerouslySetInnerHTML={{ __html: description }} />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {instVision ? (
                  <InfoBlock title="Our Vision" desc={instVision} icon="fa-solid fa-eye" color="blue" />
                ) : (
                  <InfoBlock
                    title="Our Vision"
                    desc="To become a center of excellence by imparting quality education, focusing on research, innovation, and holistic development."
                    icon="fa-solid fa-eye"
                    color="blue"
                  />
                )}
                {instMission ? (
                  <InfoBlock title="Our Mission" desc={instMission} icon="fa-solid fa-bullseye" color="green" />
                ) : (
                  <InfoBlock
                    title="Our Mission"
                    desc="Equipping students with the knowledge and skills necessary to excel in a dynamic global environment while upholding strong ethical values."
                    icon="fa-solid fa-bullseye"
                    color="green"
                  />
                )}
              </div>

              {instOverviewData && Array.isArray(instOverviewData) && instOverviewData.length > 0 && (
                <div className="space-y-6 rounded-md">
                  <h2 className="text-[22px] font-bold text-gray-900">University Overview</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full rounded-md border border-gray-200 text-left text-sm">
                      <tbody className="divide-y divide-gray-200 text-gray-600">
                        {instOverviewData.map((row: any, i: number) => (
                          <OverviewRow key={i} label={row.key || row.label || ""} value={row.value || ""} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {instLeadershipData && Array.isArray(instLeadershipData) && instLeadershipData.length > 0 && (
                <div className="space-y-6 rounded-md">
                  <h2 className="text-[22px] font-bold text-gray-900">Leadership & Administration</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full rounded-md border border-gray-200 text-left text-sm">
                      <thead className="bg-gray-50 text-[13px] font-bold uppercase text-gray-700">
                        <tr>
                          <th className="px-4 py-3">Position</th>
                          <th className="px-4 py-3">Role</th>
                          <th className="px-4 py-3">Current Holder</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 text-gray-600">
                        {instLeadershipData.map((row: any, i: number) => (
                          <AdminRow key={i} position={row.position || ""} role={row.role || ""} holder={row.holder || ""} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "courses" && (
            <div className="overflow-hidden rounded-[20px] border border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 px-6 py-4">
                <p className="text-[14px] font-semibold text-brand-blue">
                  Fees in NPR/year – filter by level
                </p>
                {!mappedCourses && <FilterPills active={courseFilter} onChange={setCourseFilter} />}
              </div>
              {(mappedCourses || filteredCourses).length > 0 ? (
                <div className="w-full overflow-x-auto">
                  <div className="min-w-175">
                    <div className="grid grid-cols-12 items-center gap-4 border-b border-gray-200 px-6 py-5">
                      <ProgTh className="col-span-4">COURSES NAME</ProgTh>
                      <ProgTh className="col-span-2">DURATION</ProgTh>
                      <ProgTh className="col-span-3">FEES / YEAR</ProgTh>
                      <ProgTh className="col-span-3">ELIGIBILITY & SEAT</ProgTh>
                    </div>
                    {(mappedCourses || filteredCourses).map((course: any, i: number) => (
                      <div key={course.name || i} className="grid grid-cols-12 items-center gap-4 border-b border-gray-100 px-6 py-5 hover:bg-gray-50/50">
                        <div className="col-span-4">
                          <h4 className="text-[15.5px] font-bold text-gray-900">{course.name}</h4>
                          <p className="text-[12px] text-gray-500">{course.specialization || ""}</p>
                        </div>
                        <div className="col-span-2">
                          <h4 className="text-[15.5px] font-bold text-gray-900">{course.duration}</h4>
                          <p className="text-[12px] text-gray-500">{course.type || ""}</p>
                        </div>
                        <div className="col-span-3">
                          <h4 className="text-[15.5px] font-bold text-brand-blue">{course.fees}</h4>
                          <p className="text-[12px] text-gray-500">/ Year</p>
                        </div>
                        <div className="col-span-3">
                          <p className="mb-2 text-[12.5px] font-medium text-gray-600">{course.eligibility}</p>
                          <span className="inline-block rounded bg-[#eafaef] px-2.5 py-1 text-[11px] font-bold text-[#16a34a]">{course.seats || ""}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-gray-400">
                  <FileX size={56} className="mx-auto mb-3" />
                  <p className="text-[15px] font-medium">No courses available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "admissions" && (
            <div className="rounded-[20px] border border-gray-200 bg-white">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-[#f4f8fc] px-6 py-4">
                <p className="text-[14px] font-semibold text-brand-blue">
                  Admission notices – filter by level
                </p>
                {!mappedAdmissions && (
                  <FilterPills active={admissionFilter} onChange={setAdmissionFilter} />
                )}
              </div>
              {mappedAdmissions && mappedAdmissions.length > 0 ? (
                <div className="w-full overflow-x-auto">
                  <div className="min-w-[800px]">
                    <div className="grid grid-cols-12 items-center gap-4 border-b border-gray-100 bg-white px-6 py-5">
                      <ProgTh className="col-span-3">PROGRAM NAME</ProgTh>
                      <ProgTh className="col-span-2">LEVEL</ProgTh>
                      <ProgTh className="col-span-3">AFFILIATION</ProgTh>
                      <ProgTh className="col-span-2">STATUS</ProgTh>
                      <ProgTh className="col-span-2">ACTION</ProgTh>
                    </div>
                    {mappedAdmissions.map((admission: any, i: number) => (
                      <div key={admission.title || i} className="grid grid-cols-12 items-center gap-4 border-b border-gray-100 px-6 py-5 hover:bg-gray-50/50">
                        <div className="col-span-3">
                          <h4 className="text-[15.5px] font-bold text-gray-900">{admission.title}</h4>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[14px] text-gray-600">{admission.level}</span>
                        </div>
                        <div className="col-span-3">
                          <span className="text-[13px] text-gray-600">{admission.affiliation}</span>
                        </div>
                        <div className="col-span-2">
                          <span className={`rounded-md px-3 py-1.5 text-[12px] font-bold ${admission.status === "Ongoing" ? "bg-[#ecfdf5] text-[#10b981]" : "bg-[#fef2f2] text-[#ef4444]"}`}>
                            {admission.status}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <button
                            onClick={() => router.push(`/admissions/${encodeURIComponent(admission.level)}/${collegeId}`)}
                            className="rounded-md bg-brand-blue/5 px-4 py-2 text-xs font-bold text-brand-blue hover:bg-brand-blue/10"
                          >
                            Apply Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <i className="fa-solid fa-inbox text-4xl mb-4 text-gray-300"></i>
                  <p className="font-medium">No admission notices available at the moment.</p>
                  <p className="text-sm mt-1">Check back later or contact the institution directly.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "offered" && (
            <div className="overflow-hidden rounded-[20px] border border-gray-200 bg-white">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-[#f4f8fc] px-6 py-4">
                <p className="text-[14px] font-semibold text-brand-blue">
                  Programs offered – filter by level
                </p>
                {!mappedPrograms && (
                  <FilterPills active={programFilter} onChange={setProgramFilter} />
                )}
              </div>
              {(mappedPrograms ? [...mappedPrograms, ...institutionProgramsFromTable, ...institutionCoursesFromStorage] : [...institutionProgramsFromTable, ...filteredPrograms, ...institutionCoursesFromStorage]).length > 0 ? (
                <div className="w-full overflow-x-auto">
                  <div className="min-w-[800px]">
                    <div className="grid grid-cols-12 items-center gap-4 border-b border-gray-100 bg-white px-6 py-5">
                      <ProgTh className="col-span-3">PROGRAM NAME</ProgTh>
                      <ProgTh className="col-span-2">LEVEL</ProgTh>
                      <ProgTh className="col-span-3">AFFILIATION</ProgTh>
                      <ProgTh className="col-span-2">STATUS</ProgTh>
                      <ProgTh className="col-span-2">ACTION</ProgTh>
                    </div>
                    {(mappedPrograms ? [...mappedPrograms, ...institutionProgramsFromTable, ...institutionCoursesFromStorage] : [...institutionProgramsFromTable, ...filteredPrograms, ...institutionCoursesFromStorage]).map((program: any, i: number) => (
                      <div key={program.name || program.courseId || i} className="grid grid-cols-12 items-center gap-4 border-b border-gray-100 px-6 py-5 hover:bg-gray-50/50">
                        <div className="col-span-3"><h4 className="text-[15.5px] font-bold text-gray-900">{program.name}</h4></div>
                        <div className="col-span-2"><span className="text-[14px] text-gray-600">{program.level}</span></div>
                        <div className="col-span-3"><span className="text-[13px] text-gray-600">{program.affiliation}</span></div>
                        <div className="col-span-2"><span className={`rounded-md px-3 py-1.5 text-[12px] font-bold ${program.status === "Ongoing" ? "bg-[#ecfdf5] text-[#10b981]" : "bg-[#fef2f2] text-[#ef4444]"}`}>{program.status}</span></div>
                        <div className="col-span-2"><button onClick={() => program.courseId ? router.push(`/course-finder/${program.courseId}`) : undefined} className="rounded-md bg-brand-blue/5 px-4 py-2 text-xs font-bold text-brand-blue hover:bg-brand-blue/10">View Details</button></div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-gray-400">
                  <FileX size={56} className="mx-auto mb-3" />
                  <p className="text-[15px] font-medium">No programs available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "facilities" && (
            <div>
              <div className="mb-6">
                <h2 className="text-[20px] font-bold text-gray-900">
                  Campus Facilities
                </h2>
                <p className="mt-1 text-[14px] text-gray-500">
                  State-of-the-art infrastructure for holistic learning.
                </p>
              </div>
              {(mappedFacilities || facilities).length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {(mappedFacilities || facilities).map((facility: any, i: number) => (
                    <div key={facility.title || facility.heading || i} className="flex items-start gap-4 rounded-md border border-gray-200 bg-white p-5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-blue/5 text-brand-blue">
                        <i className={`fa-solid ${facility.icon}`}></i>
                      </div>
                      <div>
                        <h4 className="text-[16px] font-bold text-gray-900">{facility.title || facility.heading}</h4>
                        <p className="text-[13px] text-gray-600">{facility.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center text-gray-400">
                  <FileX size={56} className="mx-auto mb-3" />
                  <p className="text-[15px] font-medium">No facilities information available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "events" && (
            <div>
              <div className="mb-6">
                <h2 className="text-[20px] font-bold text-gray-900">
                  Events & Activities
                </h2>
                <p className="mt-1 text-[14px] text-gray-500">
                  Happening around the campus – join the vibe.
                </p>
              </div>
              {(mappedEvents || events).length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(mappedEvents || events).slice((eventsPage - 1) * 9, eventsPage * 9).map((event) => (
                      <article key={event.title} className="bg-white rounded-md border border-gray-200 hover:border-blue-500/20 overflow-hidden flex flex-col duration-300 cursor-pointer">
                        <div className="h-35 w-full overflow-hidden p-4">
                          <img src={event.image} alt={event.title} className="w-full h-full object-cover rounded-md" />
                        </div>
                        <div className="p-5 flex flex-col grow">
                          <div className="flex justify-between items-center mb-3">
                            <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Event</span>
                            <span className="flex items-center text-xs text-gray-500 font-semibold"><i className="fa-regular fa-calendar mr-1.5"></i> {event.date.split(" | ")[0]}</span>
                          </div>
                          <h4 className="font-bold text-lg mb-3 leading-tight text-gray-900">{event.title}</h4>
                          <div className="flex items-center text-xs text-gray-600 mb-2 font-semibold"><i className="fa-solid fa-location-dot mr-2 text-gray-500"></i> {event.date.split(" | ")[1] || "TBD"}</div>
                          <p className="text-xs text-gray-500 mb-5 line-clamp-3 leading-relaxed font-medium">{event.desc}</p>
                          <div className="mt-auto flex gap-2">
                            <button className="flex-1 bg-white border border-gray-300 text-gray-700 text-sm font-bold py-2 rounded-md hover:bg-gray-50 transition text-center">Details</button>
                            <button className="flex-1 text-white text-sm font-bold py-2 rounded-md transition bg-brand-blue cursor-pointer hover:bg-blue-600">Register</button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                  {(mappedEvents || events).length > 9 && (
                    <div className="mt-8 flex justify-center gap-2">
                      {Array.from({ length: Math.ceil((mappedEvents || events).length / 9) }).map((_, idx) => (
                        <button key={idx} className={`h-10 w-10 rounded-md text-sm font-bold transition ${eventsPage === idx + 1 ? "bg-brand-blue text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`} onClick={() => setEventsPage(idx + 1)}>{idx + 1}</button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="py-16 text-center text-gray-400">
                  <FileX size={56} className="mx-auto mb-3" />
                  <p className="text-[15px] font-medium">No events available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "scholarship" && (
            <div className="overflow-hidden rounded-[20px] border border-gray-200 bg-white">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-[#f4f8fc] px-6 py-4">
                <p className="text-[14px] font-semibold text-brand-blue">
                  Scholarship opportunities – filter by level
                </p>
                {!mappedScholarships && (
                <FilterPills
                  active={scholarshipFilter}
                  onChange={setScholarshipFilter}
                />
                )}
              </div>
              {(mappedScholarships || filteredScholarships).length > 0 ? (
                <div className="w-full overflow-x-auto">
                  <div className="min-w-[800px]">
                    <div className="grid grid-cols-12 items-center gap-4 border-b border-gray-100 bg-white px-6 py-5">
                      <ProgTh className="col-span-2">PROGRAM</ProgTh>
                      <ProgTh className="col-span-2">SCHOLARSHIP</ProgTh>
                      <ProgTh className="col-span-2">BENEFIT</ProgTh>
                      <ProgTh className="col-span-3">FOR WHOM</ProgTh>
                      <ProgTh className="col-span-3"></ProgTh>
                    </div>
                    {(mappedScholarships || filteredScholarships).map((scholarship) => (
                      <div key={`${scholarship.program}-${scholarship.scholarship}`} className="grid grid-cols-12 items-center gap-4 border-b border-gray-100 px-6 py-5 hover:bg-gray-50/50">
                        <div className="col-span-2"><h4 className="text-[14px] font-bold text-gray-900">{scholarship.program}</h4></div>
                        <div className="col-span-2">{scholarship.scholarship}</div>
                        <div className="col-span-2"><span className="text-[13px] font-medium text-green-600">{scholarship.benefit}</span></div>
                        <div className="col-span-3">{scholarship.audience}</div>
                        <div className="col-span-3"><button className="rounded-md bg-brand-blue px-5 py-2 text-xs font-bold text-white hover:bg-brand-hover">Get Scholarship</button></div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-gray-400">
                  <FileX size={56} className="mx-auto mb-3" />
                  <p className="text-[15px] font-medium">No scholarships available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "alumni" && (
            <div>
              <div className="mb-6">
                <h2 className="text-[20px] font-bold text-gray-900">
                  Notable Alumni
                </h2>
                <p className="text-[14px] text-gray-500">
                  Connect with our proud graduates working globally.
                </p>
              </div>
              {(instAlumni && Array.isArray(instAlumni) ? instAlumni : alumni).length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {(instAlumni && Array.isArray(instAlumni) ? instAlumni : alumni).map((person: any, i: number) => (
                    <div key={person.name || i} className="flex items-center gap-4 rounded-md border border-gray-200 bg-white p-5">
                      {person.photo || person.image ? (
                        <img src={getImageUrl(person.photo || person.image)} className="h-16 w-16 rounded-full object-cover" alt={person.name} />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center"><i className="fa-solid fa-user text-gray-400"></i></div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{person.name}</h4>
                        <p className="text-[12.5px] text-gray-500">{person.job || person.role}</p>
                        <p className="text-[11.5px] text-gray-400">{person.batch}</p>
                      </div>
                      {person.linkedin && (
                        <a href={person.linkedin} target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue/5 text-brand-blue hover:bg-brand-blue/10"><i className="fa-brands fa-linkedin-in"></i></a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center text-gray-400">
                  <FileX size={56} className="mx-auto mb-3" />
                  <p className="text-[15px] font-medium">No alumni information available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "gallery" && (
            <div>
              <div className="mb-6">
                <h2 className="text-[20px] font-bold text-gray-900">
                  Campus Gallery
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {galleryImagesSource.slice(0, visibleImageCount).map((image: string, index: number) => (
                  <div
                    key={image}
                    className="aspect-[16/10] overflow-hidden rounded-md cursor-pointer"
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img
                      src={image}
                      className="h-full w-full object-cover transition duration-300 hover:scale-105"
                      alt="Gallery"
                    />
                  </div>
                ))}
              </div>

              {visibleImageCount < galleryImagesSource.length && (
                <div className="mt-8 text-center">
                  <button
                    className="rounded-md bg-brand-blue px-8 py-3 text-sm font-bold text-white hover:bg-brand-hover transition"
                    onClick={() => setVisibleImageCount((prev) => prev + 9)}
                  >
                    Load More
                  </button>
                </div>
              )}

              {selectedImageIndex !== null && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
                  onClick={() => setSelectedImageIndex(null)}
                >
                  <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                  >
                    <i className="fa-solid fa-chevron-left text-xl"></i>
                  </button>

                  <img
                    src={galleryImagesSource[selectedImageIndex]}
                    alt="Gallery preview"
                    className="max-h-[90vh] max-w-[90vw] object-contain"
                    onClick={(e) => e.stopPropagation()}
                  />

                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                  >
                    <i className="fa-solid fa-chevron-right text-xl"></i>
                  </button>

                  <button
                    className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                    onClick={() => setSelectedImageIndex(null)}
                  >
                    <i className="fa-solid fa-xmark text-xl"></i>
                  </button>
                </div>
              )}
              {galleryImagesSource.length === 0 && (
                <div className="py-16 text-center text-gray-400">
                  <FileX size={56} className="mx-auto mb-3" />
                  <p className="text-[15px] font-medium">No gallery images available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "review" && (
            <div>
              {reviewsLoading ? (
                <div className="animate-pulse space-y-4 py-8">
                  <div className="flex items-center gap-6">
                    <div className="h-20 w-20 rounded-full bg-gray-200" />
                    <div className="space-y-2">
                      <div className="h-4 w-40 rounded bg-gray-200" />
                      <div className="h-3 w-24 rounded bg-gray-200" />
                    </div>
                  </div>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2 rounded-lg border border-gray-100 p-4">
                      <div className="h-4 w-48 rounded bg-gray-200" />
                      <div className="h-3 w-full rounded bg-gray-100" />
                      <div className="h-3 w-3/4 rounded bg-gray-100" />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="mb-8 flex flex-col items-center gap-8 rounded-md border border-gray-200 bg-white p-8 md:flex-row">
                    <div className="text-center md:border-r md:pr-8 md:text-left">
                      <h2 className="mb-2 text-5xl font-extrabold text-gray-900">
                        {reviewsData?.overallRating?.toFixed(1) || "0.0"}
                      </h2>
                      <div className="mb-2 flex items-center justify-center gap-1 md:justify-start">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <i
                            key={idx}
                            className={`fa-solid fa-star text-[14px] ${idx < Math.round(reviewsData?.overallRating || 0) ? "text-yellow-400" : "text-gray-300"}`}
                          ></i>
                        ))}
                      </div>
                      <p className="text-[13px] font-medium text-gray-500">
                        Based on {reviewsData?.reviewCount || 0} reviews
                      </p>
                    </div>
                    <div className="w-full flex-1 space-y-2.5">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = reviewsData?.reviews?.filter((r: any) => {
                          const avg = Object.values(r.ratings || {}).reduce((s: number, v: any) => s + v, 0) / 10;
                          return Math.round(avg) === star;
                        }).length || 0;
                        const pct = reviewsData?.reviewCount ? Math.round((count / reviewsData.reviewCount) * 100) : 0;
                        return (
                          <RatingBar
                            key={star}
                            label={String(star)}
                            width={`${pct}%`}
                            color={star >= 4 ? "bg-green-500" : star >= 3 ? "bg-yellow-400" : "bg-orange-400"}
                            pct={`${pct}%`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div className="mb-4 flex justify-between items-center">
                    <h3 className="text-[18px] font-bold text-gray-900">
                      Recent Reviews
                    </h3>
                    <a
                      href="/write-review"
                      className="text-sm font-medium text-brand-blue hover:text-brand-hover"
                    >
                      Write a Review
                    </a>
                  </div>

                  {reviewsData?.reviews?.length > 0 ? (
                    <div className="space-y-5">
                      {reviewsData.reviews.map((review: any, idx: number) => {
                        const avgRating = Object.values(review.ratings || {}).reduce((s: number, v: any) => s + v, 0) / 10;
                        return (
                          <ReviewCard
                            key={review.id}
                            initials={review.userInitials || "U"}
                            name={review.userName || "Anonymous"}
                            subtitle={`${review.course} · Batch ${review.batchYear}`}
                            rating={Math.round(avgRating)}
                            pros={review.pros}
                            cons={review.cons}
                            tone={idx % 2 === 0 ? "blue" : "purple"}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-4">No reviews yet. Be the first to review!</p>
                      <a
                        href="/write-review"
                        className="inline-block px-6 py-3 bg-brand-blue text-white rounded-md font-medium hover:bg-brand-hover transition-colors"
                      >
                        Write a Review
                      </a>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === "news" && (
            <div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {(mappedNews || newsCards).slice((newsPage - 1) * 9, newsPage * 9).map((news) => (
                  <div
                    key={news.title}
                    className="flex flex-col overflow-hidden rounded-md border border-gray-200 bg-white transition "
                  >
                    <div className="flex-1 p-5">
                      <div className="mb-4">
                        <span
                          className={`inline-block rounded-full px-3.5 py-1 text-[12px] font-bold ${news.badgeClass}`}
                        >
                          {news.badge}
                        </span>
                      </div>
                      <div className="mb-4 h-[140px] w-full overflow-hidden rounded-md">
                        <img
                          src={news.image}
                          className="h-full w-full object-cover transition hover:scale-105"
                          alt={news.title}
                        />
                      </div>
                      <h3 className="mb-2 text-[17px] font-bold text-gray-900">
                        {news.title}
                      </h3>
                      <p className="line-clamp-2 text-[13.5px] text-gray-500">
                        {news.desc}
                      </p>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-50 bg-white px-5 py-4">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <i className="fa-regular fa-clock"></i>
                        <span className="text-[12.5px] font-medium">
                          {news.time}
                        </span>
                      </div>
                      <button className="flex items-center text-[13px] font-bold text-brand-blue hover:text-brand-hover">
                        View Details
                        <i className="fa-solid fa-chevron-right ml-1 text-[11px]"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {(mappedNews || newsCards).length > 9 && (
                <div className="mt-8 flex justify-center gap-2">
                  {Array.from({ length: Math.ceil((mappedNews || newsCards).length / 9) }).map((_, idx) => (
                    <button
                      key={idx}
                      className={`h-10 w-10 rounded-md text-sm font-bold transition ${newsPage === idx + 1 ? "bg-brand-blue text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                      onClick={() => setNewsPage(idx + 1)}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              )}
              {(mappedNews || newsCards).length === 0 && (
                <div className="py-16 text-center text-gray-400">
                  <FileX size={56} className="mx-auto mb-3" />
                  <p className="text-[15px] font-medium">No news or notices available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "download" && (
            <div>
              <div className="mb-6">
                <h2 className="text-[20px] font-bold text-gray-900">
                  Downloads
                </h2>
                <p className="mt-1 text-[14px] text-gray-500">
                  Access brochures, forms, and study materials.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(mappedDownloads || downloads).map((download: any, i: number) => {
                  const isInst = !!mappedDownloads;
                  return (
                    <div
                      key={download.title || download.name || i}
                      className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-5 transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-brand-blue/5 text-brand-blue">
                          <i className="fa-regular fa-file-lines text-xl"></i>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">
                            {download.title || download.name}
                          </h4>
                          <p className="text-[12.5px] text-gray-500">
                            {download.size || (isInst ? "Download file" : "")}
                          </p>
                        </div>
                      </div>
                      {download.file ? (
                        <a href={download.file} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-md bg-brand-blue hover:bg-brand-hover px-5 py-2.5 text-sm font-bold text-white">
                          <i className="fa-solid fa-download"></i>Download
                        </a>
                      ) : (
                        <button className="flex items-center gap-2 rounded-md bg-brand-blue hover:bg-brand-hover px-5 py-2.5 text-sm font-bold text-white">
                          <i className="fa-solid fa-download"></i>Download
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6 lg:col-span-1 lg:w-full lg:max-w-[400px] lg:justify-self-end">
          <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 sm:p-10">
            <h3 className="mb-8 text-2xl font-bold text-gray-900">
              Contact Information
            </h3>
            <div className="flex flex-col gap-3">
              {locationText && (
                <ContactInfoRow
                  icon="fa-solid fa-location-dot"
                  title="Address"
                  value={locationText}
                  badge="bg-brand-blue/5 text-[#0000FF]"
                />
              )}
              {(college?.contact_phone || college?.phone) && (
                <ContactInfoRow
                  icon="fa-solid fa-phone"
                  title="Phone"
                  value={college?.contact_phone || college?.phone}
                  badge="bg-emerald-50 text-emerald-600"
                />
              )}
              {(college?.contact_email || college?.email) && (
                <ContactInfoRow
                  icon="fa-solid fa-envelope"
                  title="Email"
                  value={college?.contact_email || college?.email}
                  badge="bg-red-50 text-red-500"
                  link
                  linkHref={`mailto:${college?.contact_email || college?.email}`}
                />
              )}
              {website && (
                <ContactInfoRow
                  icon="fa-solid fa-globe"
                  title="Website"
                  value={website}
                  badge="bg-purple-50 text-purple-600"
                  link
                  linkHref={websiteHref}
                />
              )}
              {(college?.facebook_url || college?.instagram_url || college?.tiktok_url || college?.youtube_url || college?.linkedin_url) && (
                <div className="w-full">
                  <h3 className="text-[15px] font-bold text-gray-900">Social Media</h3>
                  <div className="mt-3 flex gap-5 text-[26px]">
                    {college?.facebook_url && (
                      <a href={college.facebook_url} target="_blank" rel="noreferrer" className="text-[#1877F2] transition-transform hover:scale-110" title="Facebook">
                        <i className="fa-brands fa-facebook"></i>
                      </a>
                    )}
                    {college?.instagram_url && (
                      <a href={college.instagram_url} target="_blank" rel="noreferrer" className="text-[#E4405F] transition-transform hover:scale-110" title="Instagram">
                        <i className="fa-brands fa-instagram"></i>
                      </a>
                    )}
                    {college?.tiktok_url && (
                      <a href={college.tiktok_url} target="_blank" rel="noreferrer" className="text-black transition-transform hover:scale-110" title="TikTok">
                        <i className="fa-brands fa-tiktok"></i>
                      </a>
                    )}
                    {college?.youtube_url && (
                      <a href={college.youtube_url} target="_blank" rel="noreferrer" className="text-[#FF0000] transition-transform hover:scale-110" title="YouTube">
                        <i className="fa-brands fa-youtube"></i>
                      </a>
                    )}
                    {college?.linkedin_url && (
                      <a href={college.linkedin_url} target="_blank" rel="noreferrer" className="text-[#0A66C2] transition-transform hover:scale-110" title="LinkedIn">
                        <i className="fa-brands fa-linkedin"></i>
                      </a>
                    )}
                  </div>
                </div>
              )}
              <div className="mt-8 h-45 w-full overflow-hidden rounded-md border border-gray-200">
                <iframe
                  src={college?.map_url || `https://www.google.com/maps?q=${encodeURIComponent(name + " " + locationText)}&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full"
                  title={`Map of ${name}`}
                ></iframe>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="mb-2 text-[18px] font-bold text-gray-900">
              Request Information
            </h3>
            {!isAuthenticated ? (
              <div className="text-center py-6">
                <p className="text-gray-500 text-sm mb-4">Please log in to send an inquiry to this institution.</p>
                <button
                  onClick={() => router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)}
                  className="rounded-md bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
                >
                  Log In to Continue
                </button>
              </div>
            ) : (inquirySent ? (
              <div className="text-center py-6">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mx-auto">
                  <i className="fa-solid fa-check text-green-600 text-xl"></i>
                </div>
                <p className="text-gray-900 font-semibold">Inquiry Sent!</p>
                <p className="text-sm text-gray-500 mt-1">The institution will get back to you soon.</p>
              </div>
            ) : (
              <>
                <p className="mb-5 text-[13px] text-gray-500">
                  Fill the form and our admission counselor will contact you.
                </p>
                <form className="space-y-3" onSubmit={async (e) => {
                  e.preventDefault();
                  if (!collegeId) return;
                  setInquirySending(true);
                  try {
                    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
                    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
                    const subject = `Inquiry about ${name} - ${inquiryCourse || "General"}`;
                    const content = `Name: ${inquiryName}\nEmail: ${inquiryEmail}\nPhone: ${inquiryPhone}\nCourse of Interest: ${inquiryCourse || "Not specified"}`;
                    await fetch(`${API_BASE}/api/v1/institutions/${collegeId}/inquiry`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                      },
                      body: JSON.stringify({ subject, content }),
                    });
                    setInquirySent(true);
                  } catch {
                    // silently fail
                  } finally {
                    setInquirySending(false);
                  }
                }}>
                  <div>
                    <input type="text" placeholder="Full Name" value={inquiryName} onChange={e => { setInquiryName(e.target.value); inquiryTouched.current = true; }}
                      className={`w-full rounded-md border px-4 py-3 text-[13.5px] focus:outline-none focus:ring-2 ${inquiryTouched.current && inquiryErrors.name ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200" : "border-gray-200 bg-gray-50 focus:border-brand-blue focus:ring-brand-blue/20"}`} />
                    {inquiryTouched.current && inquiryErrors.name && <p className="mt-1 text-xs text-red-500">{inquiryErrors.name}</p>}
                  </div>
                  <div>
                    <input type="email" placeholder="Email Address" value={inquiryEmail} onChange={e => { setInquiryEmail(e.target.value); inquiryTouched.current = true; }}
                      className={`w-full rounded-md border px-4 py-3 text-[13.5px] focus:outline-none focus:ring-2 ${inquiryTouched.current && inquiryErrors.email ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200" : "border-gray-200 bg-gray-50 focus:border-brand-blue focus:ring-brand-blue/20"}`} />
                    {inquiryTouched.current && inquiryErrors.email && <p className="mt-1 text-xs text-red-500">{inquiryErrors.email}</p>}
                  </div>
                  <div>
                    <div className="flex rounded-md border overflow-hidden focus-within:ring-2 focus-within:ring-brand-blue/20 focus-within:border-brand-blue"
                      style={inquiryTouched.current && inquiryErrors.phone ? { borderColor: "#fca5a5" } : { borderColor: "#e5e7eb" }}>
                      <span className="flex items-center bg-gray-100 px-3 text-sm text-gray-500 font-medium border-r border-gray-200">+977</span>
                      <input type="tel" placeholder="98XXXXXXXX" maxLength={10} value={inquiryPhone} onChange={e => { const v = e.target.value.replace(/\D/g, ""); setInquiryPhone(v); inquiryTouched.current = true; }}
                        className="w-full bg-gray-50 px-4 py-3 text-[13.5px] focus:outline-none" />
                    </div>
                    {inquiryTouched.current && inquiryErrors.phone && <p className="mt-1 text-xs text-red-500">{inquiryErrors.phone}</p>}
                  </div>
                  <select value={inquiryCourse} onChange={e => setInquiryCourse(e.target.value)}
                    className="w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-[13.5px] text-gray-600 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20">
                    <option value="">Select Course of Interest</option>
                    {(mappedPrograms || []).map((p: any) => (
                      <option key={p.name} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                  <button type="submit" disabled={inquirySending || !inquiryValid}
                    className="mt-2 w-full rounded-md bg-brand-blue py-3.5 text-[14px] font-bold text-white shadow-brand-blue/20 transition-colors hover:bg-brand-hover disabled:opacity-50">
                    {inquirySending ? "Sending..." : "Submit Request"}
                  </button>
                </form>
              </>
            ))}
          </div>
        </div>
      </div>

      <ClaimCollegeModal
        collegeName={name}
        collegeId={college?.id || collegeId || 0}
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
      />

      <ShareCollegeModal
        collegeName={name}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareUrl={shareUrl}
        shareTitle={shareTitle}
        shareText={shareText}
      />

      {isInstitution && (
        <OpenCounsellingModal
          isOpen={isCounsellingModalOpen}
          onClose={() => setIsCounsellingModalOpen(false)}
          institutionId={college?.id || collegeId || 0}
          collegeName={name}
        />
      )}

      {isAskQuestionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => { setIsAskQuestionOpen(false); setAskSent(false); }}>
          <div className="mx-4 w-full max-w-lg rounded-2xl bg-white shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Ask a Question</h3>
              <button onClick={() => { setIsAskQuestionOpen(false); setAskSent(false); }} className="p-1 rounded-lg hover:bg-gray-100">
                <i className="fa-solid fa-xmark text-gray-500"></i>
              </button>
            </div>
            {askSent ? (
              <div className="text-center py-8 px-6">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 mx-auto">
                  <i className="fa-solid fa-check text-green-600 text-2xl"></i>
                </div>
                <p className="text-gray-900 font-bold text-lg">Question Sent!</p>
                <p className="text-sm text-gray-500 mt-1">The institution will respond to your inquiry soon.</p>
                <button onClick={() => { setIsAskQuestionOpen(false); setAskSent(false); }} className="mt-6 rounded-md bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover">
                  Close
                </button>
              </div>
            ) : (
              <form className="px-6 py-4 space-y-4" onSubmit={async (e) => {
                e.preventDefault();
                if (!collegeId || !isAuthenticated) return;
                setAskSending(true);
                try {
                  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
                  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
                  const subject = `Question about ${name}`;
                  const content = `Name: ${askName}\nEmail: ${askEmail}\nPhone: ${askPhone}\n\nMessage:\n${askMessage}`;
                  await fetch(`${API_BASE}/api/v1/institutions/${collegeId}/inquiry`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify({ subject, content }),
                  });
                  setAskSent(true);
                } catch {
                  // silently fail
                } finally {
                  setAskSending(false);
                }
              }}>
                <div>
                  <input type="text" placeholder="Full Name" value={askName} onChange={e => { setAskName(e.target.value); askTouched.current = true; }}
                    className={`w-full rounded-md border px-4 py-3 text-sm focus:outline-none focus:ring-2 ${askTouched.current && askErrors.name ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200" : "border-gray-200 bg-gray-50 focus:border-brand-blue focus:ring-brand-blue/20"}`} />
                  {askTouched.current && askErrors.name && <p className="mt-1 text-xs text-red-500">{askErrors.name}</p>}
                </div>
                <div>
                  <input type="email" placeholder="Email Address" value={askEmail} onChange={e => { setAskEmail(e.target.value); askTouched.current = true; }}
                    className={`w-full rounded-md border px-4 py-3 text-sm focus:outline-none focus:ring-2 ${askTouched.current && askErrors.email ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200" : "border-gray-200 bg-gray-50 focus:border-brand-blue focus:ring-brand-blue/20"}`} />
                  {askTouched.current && askErrors.email && <p className="mt-1 text-xs text-red-500">{askErrors.email}</p>}
                </div>
                <div>
                  <div className="flex rounded-md border overflow-hidden focus-within:ring-2 focus-within:ring-brand-blue/20 focus-within:border-brand-blue"
                    style={askTouched.current && askErrors.phone ? { borderColor: "#fca5a5" } : { borderColor: "#e5e7eb" }}>
                    <span className="flex items-center bg-gray-100 px-3 text-sm text-gray-500 font-medium border-r border-gray-200">+977</span>
                    <input type="tel" placeholder="98XXXXXXXX" maxLength={10} value={askPhone} onChange={e => { const v = e.target.value.replace(/\D/g, ""); setAskPhone(v); askTouched.current = true; }}
                      className="w-full bg-gray-50 px-4 py-3 text-sm focus:outline-none" />
                  </div>
                  {askTouched.current && askErrors.phone && <p className="mt-1 text-xs text-red-500">{askErrors.phone}</p>}
                </div>
                <div>
                  <textarea placeholder="Type your message..." rows={4} value={askMessage} maxLength={500}
                    onChange={e => { setAskMessage(e.target.value); askTouched.current = true; }}
                    className={`w-full rounded-md border px-4 py-3 text-sm focus:outline-none focus:ring-2 resize-none ${askTouched.current && !askMessage.trim() ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200" : "border-gray-200 bg-gray-50 focus:border-brand-blue focus:ring-brand-blue/20"}`} />
                  <div className="flex justify-between mt-1">
                    {askTouched.current && !askMessage.trim() ? <p className="text-xs text-red-500">Message is required</p> : <span />}
                    <p className={`text-xs ${askMessage.length >= 500 ? "text-red-500 font-medium" : "text-gray-400"}`}>{askMessage.length}/500</p>
                  </div>
                </div>
                {isAuthenticated ? (
                  <button type="submit" disabled={askSending || !askValid}
                    className="w-full rounded-md bg-brand-blue py-3 text-sm font-bold text-white hover:bg-brand-hover disabled:opacity-50 transition-colors">
                    {askSending ? "Sending..." : "Submit Question"}
                  </button>
                ) : (
                  <button type="button"
                    onClick={() => router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)}
                    className="w-full rounded-md bg-brand-blue py-3 text-sm font-bold text-white hover:bg-brand-hover transition-colors">
                    <i className="fa-solid fa-lock mr-1.5"></i>Login to Submit
                  </button>
                )}
              </form>
            )}
          </div>
        </div>
      )}

      {showUnfollowDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-md bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-bold text-gray-900">Unfollow College</h3>
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
    </div>
  );
};

export default CollegeDetailsPage;
