"use client";

import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useParams } from "next/navigation";
import { apiService } from "@/services/api";
import CollegeCard from "@/components/admissions/CollegeCard";
import { BadgeCheckIcon, ChevronLeft, ChevronRight, MessageSquarePlus } from "lucide-react";
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

const fallbackCollege = {
  name: "GoldenGate International College",
  location: "Kamalpokhari, Kathmandu",
  rating: 4.5,
  reviewsCount: "1,024",
  website: "www.goldengate.edu.np",
  logo: "https://goldengateintl.com/wp-content/uploads/2023/05/Untitled-design-1.png",
  banner:
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop",
  description:
    "The B.Sc. in Data Science & Artificial Intelligence is designed to bridge the gap between theoretical mathematics and practical engineering. Students will dive deep into machine learning algorithms, big data analytics, and neural networks.",
  secondDescription:
    "This program is suitable for analytical thinkers who want to shape the future of automation. By the end of this course, you will be proficient in Python, R, TensorFlow, and cloud computing platforms.",
};

const courses = [
  {
    level: "+2" as LevelFilter,
    name: "+2 Science (Biology)",
    specialization: "Bio",
    duration: "2 Year",
    type: "Full Time",
    fees: "Rs. 75,000",
    eligibility: "SEE with GPA 3.0",
    seats: "240 Seats",
  },
  {
    level: "+2" as LevelFilter,
    name: "+2 Management",
    specialization: "Finance",
    duration: "2 Year",
    type: "Full Time",
    fees: "Rs. 65,000",
    eligibility: "SEE with GPA 2.5",
    seats: "200 Seats",
  },
  {
    level: "Bachelor" as LevelFilter,
    name: "B.Sc. Computer Science",
    specialization: "AI, Data Science",
    duration: "4 Year",
    type: "Full Time",
    fees: "Rs. 1,50,000",
    eligibility: "10+2 with 60% (Science)",
    seats: "120 Seats",
  },
  {
    level: "Bachelor" as LevelFilter,
    name: "BBA Finance",
    specialization: "Corporate Finance",
    duration: "4 Year",
    type: "Full Time",
    fees: "Rs. 1,20,000",
    eligibility: "10+2 with 50% (Any)",
    seats: "80 Seats",
  },
  {
    level: "Master" as LevelFilter,
    name: "MBA",
    specialization: "General",
    duration: "2 Year",
    type: "Full Time",
    fees: "Rs. 2,50,000",
    eligibility: "Bachelor with 55%",
    seats: "60 Seats",
  },
  {
    level: "Master" as LevelFilter,
    name: "M.Sc. Data Science",
    specialization: "AI",
    duration: "2 Year",
    type: "Full Time",
    fees: "Rs. 2,20,000",
    eligibility: "B.Sc. CSIT/BCA 60%",
    seats: "40 Seats",
  },
];

const admissions = [
  {
    level: "+2" as LevelFilter,
    status: "Ongoing",
    title: "+2 Science (Biology)",
    affiliation: "NEB",
    openDate: "1st June, 2025",
    deadline: "30th July, 2025",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop",
  },
  {
    level: "Bachelor" as LevelFilter,
    status: "Ongoing",
    title: "Bachelor In Information Technology",
    affiliation: "Tribhuvan University",
    openDate: "20th Dec, 2025",
    deadline: "20th Jan, 2026",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop",
  },
  {
    level: "Master" as LevelFilter,
    status: "Closed",
    title: "Master in Business Administration",
    affiliation: "Tribhuvan University",
    openDate: "--",
    deadline: "Passed",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop",
  },
];

const offeredPrograms = [
  {
    level: "+2" as LevelFilter,
    name: "Science (Biology)",
    affiliation: "NEB",
    status: "Ongoing",
  },
  {
    level: "+2" as LevelFilter,
    name: "Management",
    affiliation: "NEB",
    status: "Closed",
  },
  {
    level: "Bachelor" as LevelFilter,
    name: "B.Sc. CSIT",
    affiliation: "Tribhuvan University",
    status: "Ongoing",
  },
  {
    level: "Bachelor" as LevelFilter,
    name: "BBA Finance",
    affiliation: "Purwanchal University",
    status: "Closed",
  },
  {
    level: "Master" as LevelFilter,
    name: "MBA",
    affiliation: "Tribhuvan University",
    status: "Ongoing",
  },
  {
    level: "Master" as LevelFilter,
    name: "M.Sc. Data Science",
    affiliation: "Kathmandu University",
    status: "Closed",
  },
];

const scholarships = [
  {
    level: "+2" as LevelFilter,
    program: "+2 Science",
    scholarship: "Merit Scholarship",
    benefit: "Up to 100% waiver",
    audience: "Top 5% in SEE",
  },
  {
    level: "+2" as LevelFilter,
    program: "+2 Management",
    scholarship: "Need-Based Grant",
    benefit: "Variable",
    audience: "Low income families",
  },
  {
    level: "Bachelor" as LevelFilter,
    program: "B.Sc. CSIT",
    scholarship: "Merit Scholarship",
    benefit: "Up to 100% waiver",
    audience: "60%+ in +2",
  },
  {
    level: "Bachelor" as LevelFilter,
    program: "BBA Finance",
    scholarship: "Need-Based Grant",
    benefit: "Variable",
    audience: "Economically weak",
  },
  {
    level: "Master" as LevelFilter,
    program: "MBA",
    scholarship: "Merit Scholarship",
    benefit: "50% waiver",
    audience: "70% in Bachelor",
  },
  {
    level: "Master" as LevelFilter,
    program: "M.Sc. Data Science",
    scholarship: "Research Assistantship",
    benefit: "Stipend + tuition",
    audience: "Strong academic record",
  },
];

const facilities = [
  {
    icon: "fa-book-open",
    title: "Central Library",
    desc: "50,000+ books, digital resources, 24/7 reading hall.",
  },
  {
    icon: "fa-flask",
    title: "Science Labs",
    desc: "Physics, Chemistry, CS labs with modern equipment.",
  },
  {
    icon: "fa-dumbbell",
    title: "Sports Complex",
    desc: "Indoor basketball, badminton, gymnasium and football field.",
  },
  {
    icon: "fa-wifi",
    title: "High-Speed WiFi",
    desc: "Campus-wide gigabit connectivity and smart classrooms.",
  },
  {
    icon: "fa-bus",
    title: "Transportation",
    desc: "Fleet of buses covering all major city routes.",
  },
  {
    icon: "fa-utensils",
    title: "Cafeteria",
    desc: "Multi-cuisine, hygienic, and student-friendly prices.",
  },
];

const events = [
  {
    image:
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800&auto=format&fit=crop",
    title: "Technika 2025",
    date: "15-17 May 2025 | Main Auditorium",
    desc: "Annual tech symposium with hackathons, workshops, and robotics.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
    title: "Unity Day Celebration",
    date: "10 June 2025 | Open Air Theatre",
    desc: "Cultural performances, food stalls, and charity drive.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop",
    title: "Inter-college Basketball",
    date: "22-25 June 2025 | Sports Complex",
    desc: "Teams from 10+ colleges competing for the championship.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=800&auto=format&fit=crop",
    title: "Guest Lecture: AI Ethics",
    date: "5 July 2025 | Seminar Hall",
    desc: "By Dr. Anil Gupta, lead researcher at Google AI.",
  },
];

const alumni = [
  {
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
    name: "Bikash Sharma",
    role: "Software Engineer at Google",
    batch: "B.Sc. CSIT, 2018",
  },
  {
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
    name: "Anjali Thapa",
    role: "Investment Banker at J.P. Morgan",
    batch: "BBA, 2017",
  },
  {
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop",
    name: "Ramesh KC",
    role: "Data Scientist at Amazon",
    batch: "B.Sc. CSIT, 2019",
  },
  {
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop",
    name: "Sushma Shrestha",
    role: "HR Manager at Ncell",
    batch: "MBA, 2016",
  },
];

const galleryImages = [
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1571260899304-425dea4cf861?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
];

const newsCards = [
  {
    badge: "Exam",
    badgeClass: "bg-orange-50 text-orange-500",
    image:
      "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=800&auto=format&fit=crop",
    title: "JEE Main 2025: Registration Extended",
    desc: "NTA extends JEE Main 2025 deadline due to high volume of applications.",
    time: "90 Days ago",
  },
  {
    badge: "Admission",
    badgeClass: "bg-brand-blue/5 text-brand-blue",
    image:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop",
    title: "MBA Admission Open 2025",
    desc: "Apply for MBA at GoldenGate, last date 30th June.",
    time: "30 Days ago",
  },
  {
    badge: "Scholarship",
    badgeClass: "bg-green-50 text-green-600",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop",
    title: "Merit Scholarship 2025",
    desc: "Applications open for merit-based scholarships for +2 & Bachelor.",
    time: "15 Days ago",
  },
];

const downloads = [
  {
    title: "Prospectus 2025",
    size: "PDF, 8.2 MB",
    color: "bg-brand-blue/5 text-brand-blue",
    btn: "bg-brand-blue hover:bg-[#0000CC]",
  },
  {
    title: "Application Form",
    size: "PDF, 2.1 MB",
    color: "bg-brand-blue/5 text-brand-blue",
    btn: "bg-brand-blue hover:bg-[#0000CC]",
  },
  {
    title: "Scholarship Guidelines",
    size: "PDF, 1.5 MB",
    color: "bg-brand-blue/5 text-brand-blue",
    btn: "bg-brand-blue hover:bg-[#0000CC]",
  },
  {
    title: "Course Catalogue 2025",
    size: "PDF, 12.0 MB",
    color: "bg-brand-blue/5 text-brand-blue",
    btn: "bg-brand-blue hover:bg-[#0000CC]",
  },
];

const isCollegeVerified = (value: unknown): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return ["true", "1", "yes", "verified", "active"].includes(normalized);
  }
  return false;
};

const CollegeDetailsPage: React.FC = () => {
  const params = useParams();
  const collegeId = params.id ? Number(params.id) : null;

  const [activeTab, setActiveTab] = useState<TabKey>("about");
  const [courseFilter, setCourseFilter] = useState<LevelFilter>("all");
  const [admissionFilter, setAdmissionFilter] = useState<LevelFilter>("all");
  const [programFilter, setProgramFilter] = useState<LevelFilter>("all");
  const [scholarshipFilter, setScholarshipFilter] =
    useState<LevelFilter>("all");
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
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
      prev === 0 ? galleryImages.length - 1 : (prev as number) - 1
    );
  };

  const handleNextImage = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : (prev as number) + 1
    );
  };

  useEffect(() => {
    if (collegeId) {
      setLoading(true);
      apiService
        .getCollegeById(collegeId)
        .then((res) => {
          setCollege(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [collegeId]);

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

  const name = college?.name || fallbackCollege.name;
  const locationText = college?.location || fallbackCollege.location;
  const rating = college?.rating ?? fallbackCollege.rating;
  const reviewsCount =
    college?.reviews !== undefined
      ? Number(college.reviews || 0).toLocaleString()
      : fallbackCollege.reviewsCount;
  const website = college?.website || fallbackCollege.website;
  const websiteHref =
    website.startsWith("http://") || website.startsWith("https://")
      ? website
      : `https://${website}`;
  const description = college?.description || fallbackCollege.description;
  const isVerified = isCollegeVerified(college?.verified);
  const shareTitle = `${name} - Studsphere`;
  const shareText = `Check out ${name} on Studsphere`;

  const filteredCourses = useMemo(
    () =>
      courses.filter(
        (item) => courseFilter === "all" || item.level === courseFilter,
      ),
    [courseFilter],
  );
  const filteredAdmissions = useMemo(
    () =>
      admissions.filter(
        (item) => admissionFilter === "all" || item.level === admissionFilter,
      ),
    [admissionFilter],
  );
  const filteredPrograms = useMemo(
    () =>
      offeredPrograms.filter(
        (item) => programFilter === "all" || item.level === programFilter,
      ),
    [programFilter],
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
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        className="relative h-55 w-full bg-blue-800 bg-center md:h-90"
        // style={{ backgroundImage: `url('${banner}')` }}
      >
        <div className="absolute bottom-4 right-4 z-20 md:bottom-6 md:right-6">
          {isVerified ? (
            <button className="flex items-center gap-2 rounded-md bg-black/60 cursor-pointer px-5 py-2.5 text-sm font-bold text-white transition-all duration-300  md:px-6 md:py-3 md:text-base">
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
          <div className="relative z-10 mr-auto -mt-12 flex h-30 w-30 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white p-2 md:absolute md:-top-4 md:left-12 md:mx-0 md:mt-0 md:h-37.5 md:w-37.5 lg:left-24 xl:left-32">
            <img
              src={fallbackCollege.logo}
              alt="College Logo"
              className="h-full w-full object-contain"
            />
          </div>

          <div className="mt-4 flex flex-col items-center justify-between gap-6 lg:mt-0 lg:flex-row lg:items-end lg:gap-0 lg:pl-42.5">
            <div className="w-full space-y-3 text-left lg:w-auto">
              <div className="flex items-center justify-start gap-2 pt-4">
                <h1 className="text-[24px] font-bold tracking-tight text-gray-900 md:text-3xl ">
                  {name}
                </h1>
                {isVerified && (
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
                <a
                  href={websiteHref}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[13px] font-medium tracking-wide text-brand-blue transition-colors hover:text-brand-hover"
                >
                  <i className="fa-solid fa-globe text-gray-500 text-[12px]"></i>
                  {website.toLowerCase()}
                </a>
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
              <button className="shrink-0 flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-[14px] font-semibold text-gray-700 transition-colors hover:bg-gray-50 lg:px-5 lg:py-3 lg:text-[15px]">
                <i className="fa-solid fa-download"></i>Brochure
              </button>
              <button className="shrink-0 flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-[14px] font-semibold text-gray-700 transition-colors hover:bg-gray-50 lg:px-5 lg:py-3 lg:text-[15px]">
                <i className="fa-regular fa-circle-question"></i>Ask Question
              </button>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="shrink-0 flex items-center justify-center rounded-md border border-gray-200 bg-white p-2.5 text-gray-700 shadow-sm transition-colors hover:bg-gray-50 lg:p-3"
                aria-label="Share college profile"
              >
                <i className="fa-solid fa-share-nodes"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-40 border-b border-t border-gray-100 bg-white shadow-sm shadow-gray-100/50">
        <div className="relative overflow-hidden px-6 md:px-12 lg:px-24 xl:px-32">
          {isTabsOverflowing && canScrollTabsLeft && (
            <button
              type="button"
              onClick={() => scrollTabs("left")}
              className="absolute left-6 top-1/2 z-20 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-1.5 text-gray-700 shadow-sm transition hover:bg-gray-50 md:left-12 lg:left-24 xl:left-32"
              aria-label="Scroll tabs left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}

          {isTabsOverflowing && canScrollTabsRight && (
            <button
              type="button"
              onClick={() => scrollTabs("right")}
              className="absolute right-6 top-1/2 z-20 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-1.5 text-gray-700 shadow-sm transition hover:bg-gray-50 md:right-12 lg:right-24 xl:right-32"
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
              <AboutVideoInteractive />

              <div className="space-y-6 text-[15px] leading-[1.8] text-gray-600 md:text-[16px]">
                <p>{description}</p>
                <p>{fallbackCollege.secondDescription}</p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <InfoBlock
                  title="Our Vision"
                  desc="To become a center of excellence by imparting quality education, focusing on research, innovation, and holistic development."
                  icon="fa-solid fa-eye"
                  color="blue"
                />
                <InfoBlock
                  title="Our Mission"
                  desc="Equipping students with the knowledge and skills necessary to excel in a dynamic global environment while upholding strong ethical values."
                  icon="fa-solid fa-bullseye"
                  color="green"
                />
              </div>

              <div className="space-y-6 rounded-md">
                <h2 className="text-[22px] font-bold text-gray-900">
                  University Overview
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full rounded-xl border border-gray-200 text-left text-sm">
                    <tbody className="divide-y divide-gray-200 text-gray-600">
                      <OverviewRow label="Established" value="1959" />
                      <OverviewRow
                        label="Location"
                        value="Kirtipur, 5 km from Kathmandu's city center"
                      />
                      <OverviewRow
                        label="Campus Size"
                        value="154.77 hectares (3,042-5-2 ropanis)"
                      />
                      <OverviewRow
                        label="Type"
                        value="Non-profit, autonomous, funded by Government of Nepal"
                      />
                      <OverviewRow
                        label="Status"
                        value="Declared Central University on January 8, 2013"
                      />
                      <OverviewRow
                        label="Global Ranking"
                        value="One of the world's largest universities by size and program diversity"
                      />
                    </tbody>
                  </table>
                </div>

                <h2 className="pt-4 text-[22px] font-bold text-gray-900">
                  Leadership & Administration
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full rounded-xl border border-gray-200 text-left text-sm">
                    <thead className="bg-gray-50 text-[13px] font-bold uppercase text-gray-700">
                      <tr>
                        <th className="px-4 py-3">Position</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Current Holder</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-gray-600">
                      <AdminRow
                        position="Chancellor"
                        role="Ceremonial head (Prime Minister)"
                        holder="Sushila Karki, Rt. Hon'ble Prime Minister"
                      />
                      <AdminRow
                        position="Pro-Chancellor"
                        role="Minister of Education"
                        holder="Mahabir Pun"
                      />
                      <AdminRow
                        position="Vice Chancellor"
                        role="Chief Executive, oversees operations"
                        holder="Prof. Deepak Aryal, PhD"
                      />
                      <AdminRow
                        position="Rector"
                        role="Manages academic programs"
                        holder="Prof. Khadga K.C, PhD"
                      />
                      <AdminRow
                        position="Registrar"
                        role="Handles financial and administrative affairs"
                        holder="Prof. Kedar Prasad Rijal, PhD"
                      />
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "courses" && (
            <div className="overflow-hidden rounded-[20px] border border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 px-6 py-4">
                <p className="text-[14px] font-semibold text-brand-blue">
                  Fees in NPR/year – filter by level
                </p>
                <FilterPills active={courseFilter} onChange={setCourseFilter} />
              </div>
              <div className="w-full overflow-x-auto">
                <div className="min-w-175">
                  <div className="grid grid-cols-12 items-center gap-4 border-b border-gray-200  px-6 py-5">
                    <ProgTh className="col-span-4">COURSES NAME</ProgTh>
                    <ProgTh className="col-span-2">DURATION</ProgTh>
                    <ProgTh className="col-span-3">FEES / YEAR</ProgTh>
                    <ProgTh className="col-span-3">ELIGIBILITY & SEAT</ProgTh>
                  </div>
                  {filteredCourses.map((course) => (
                    <div
                      key={course.name}
                      className="grid grid-cols-12 items-center gap-4 border-b border-gray-100 px-6 py-5 hover:bg-gray-50/50"
                    >
                      <div className="col-span-4">
                        <h4 className="text-[15.5px] font-bold text-gray-900">
                          {course.name}
                        </h4>
                        <p className="text-[12px] text-gray-500">
                          {course.specialization}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <h4 className="text-[15.5px] font-bold text-gray-900">
                          {course.duration}
                        </h4>
                        <p className="text-[12px] text-gray-500">
                          {course.type}
                        </p>
                      </div>
                      <div className="col-span-3">
                        <h4 className="text-[15.5px] font-bold text-brand-blue">
                          {course.fees}
                        </h4>
                        <p className="text-[12px] text-gray-500">/ Year</p>
                      </div>
                      <div className="col-span-3">
                        <p className="mb-2 text-[12.5px] font-medium text-gray-600">
                          {course.eligibility}
                        </p>
                        <span className="inline-block rounded bg-[#eafaef] px-2.5 py-1 text-[11px] font-bold text-[#16a34a]">
                          {course.seats}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "admissions" && (
            <div className="rounded-[20px] border border-gray-200 p-5 bg-white">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <p className="text-[14px] font-semibold text-brand-blue">
                  Admission notices – filter by level
                </p>
                <FilterPills
                  active={admissionFilter}
                  onChange={setAdmissionFilter}
                />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredAdmissions.slice((admissionPage - 1) * 9, admissionPage * 9).map((admission) => (
                  <CollegeCard
                    key={admission.title}
                    images={[admission.image, admission.image, admission.image]}
                    tag={{
                      text:
                        admission.status === "Ongoing"
                          ? "Admission Open"
                          : "Closed",
                      color:
                        admission.status === "Ongoing"
                          ? "bg-[#0d6efd]"
                          : "bg-gray-500",
                    }}
                    collegeName={admission.affiliation}
                    rating={4.5}
                    type="Private"
                    location={locationText}
                    website={website}
                    programs={[
                      {
                        name: admission.title,
                        status:
                          admission.status === "Ongoing"
                            ? "Seats Available"
                            : "Closing Soon",
                      },
                    ]}
                    moreProgramsCount={0}
                  />
                ))}
              </div>

              {filteredAdmissions.length > 9 && (
                <div className="mt-8 flex justify-center gap-2">
                  {Array.from({ length: Math.ceil(filteredAdmissions.length / 9) }).map((_, idx) => (
                    <button
                      key={idx}
                      className={`h-10 w-10 rounded-lg text-sm font-bold transition ${admissionPage === idx + 1 ? "bg-brand-blue text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                      onClick={() => setAdmissionPage(idx + 1)}
                    >
                      {idx + 1}
                    </button>
                  ))}
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
                <FilterPills
                  active={programFilter}
                  onChange={setProgramFilter}
                />
              </div>
              <div className="w-full overflow-x-auto">
                <div className="min-w-[800px]">
                  <div className="grid grid-cols-12 items-center gap-4 border-b border-gray-100 bg-white px-6 py-5">
                    <ProgTh className="col-span-3">PROGRAM NAME</ProgTh>
                    <ProgTh className="col-span-2">LEVEL</ProgTh>
                    <ProgTh className="col-span-3">AFFILIATION</ProgTh>
                    <ProgTh className="col-span-2">STATUS</ProgTh>
                    <ProgTh className="col-span-2">ACTION</ProgTh>
                  </div>
                  {filteredPrograms.map((program) => (
                    <div
                      key={program.name}
                      className="grid grid-cols-12 items-center gap-4 border-b border-gray-100 px-6 py-5 hover:bg-gray-50/50"
                    >
                      <div className="col-span-3">
                        <h4 className="text-[15.5px] font-bold text-gray-900">
                          {program.name}
                        </h4>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[14px] text-gray-600">
                          {program.level}
                        </span>
                      </div>
                      <div className="col-span-3">
                        <span className="text-[13px] text-gray-600">
                          {program.affiliation}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span
                          className={`rounded-md px-3 py-1.5 text-[12px] font-bold ${program.status === "Ongoing" ? "bg-[#ecfdf5] text-[#10b981]" : "bg-[#fef2f2] text-[#ef4444]"}`}
                        >
                          {program.status}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <button className="rounded-lg bg-brand-blue/5 px-4 py-2 text-xs font-bold text-brand-blue hover:bg-brand-blue/10">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {facilities.map((facility) => (
                  <div
                    key={facility.title}
                    className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue/5 text-brand-blue">
                      <i className={`fa-solid ${facility.icon}`}></i>
                    </div>
                    <div>
                      <h4 className="text-[16px] font-bold text-gray-900">
                        {facility.title}
                      </h4>
                      <p className="text-[13px] text-gray-600">
                        {facility.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.slice((eventsPage - 1) * 9, eventsPage * 9).map((event) => (
                  <article
                    key={event.title}
                    className="bg-white rounded-2xl border border-gray-200 hover:border-blue-500/20 overflow-hidden flex flex-col duration-300 cursor-pointer"
                  >
                    <div className="h-35 w-full overflow-hidden p-4">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-5 flex flex-col grow">
                      <div className="flex justify-between items-center mb-3">
                        <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                          Event
                        </span>
                        <span className="flex items-center text-xs text-gray-500 font-semibold">
                          <i className="fa-regular fa-calendar mr-1.5"></i>{" "}
                          {event.date.split(" | ")[0]}
                        </span>
                      </div>

                      <h4 className="font-bold text-lg mb-3 leading-tight text-gray-900">
                        {event.title}
                      </h4>

                      <div className="flex items-center text-xs text-gray-600 mb-2 font-semibold">
                        <i className="fa-solid fa-location-dot mr-2 text-gray-500"></i>{" "}
                        {event.date.split(" | ")[1] || "TBD"}
                      </div>

                      <p className="text-xs text-gray-500 mb-5 line-clamp-3 leading-relaxed font-medium">
                        {event.desc}
                      </p>

                      <div className="mt-auto flex gap-2">
                        <button className="flex-1 bg-white border border-gray-300 text-gray-700 text-sm font-bold py-2 rounded-lg hover:bg-gray-50 transition text-center">
                          Details
                        </button>
                        <button className="flex-1 text-white text-sm font-bold py-2 rounded-lg transition bg-brand-blue cursor-pointer hover:bg-blue-600">
                          Register
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {events.length > 9 && (
                <div className="mt-8 flex justify-center gap-2">
                  {Array.from({ length: Math.ceil(events.length / 9) }).map((_, idx) => (
                    <button
                      key={idx}
                      className={`h-10 w-10 rounded-lg text-sm font-bold transition ${eventsPage === idx + 1 ? "bg-brand-blue text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                      onClick={() => setEventsPage(idx + 1)}
                    >
                      {idx + 1}
                    </button>
                  ))}
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
                <FilterPills
                  active={scholarshipFilter}
                  onChange={setScholarshipFilter}
                />
              </div>
              <div className="w-full overflow-x-auto">
                <div className="min-w-[800px]">
                  <div className="grid grid-cols-12 items-center gap-4 border-b border-gray-100 bg-white px-6 py-5">
                    <ProgTh className="col-span-2">PROGRAM</ProgTh>
                    <ProgTh className="col-span-2">SCHOLARSHIP</ProgTh>
                    <ProgTh className="col-span-2">BENEFIT</ProgTh>
                    <ProgTh className="col-span-3">FOR WHOM</ProgTh>
                    <ProgTh className="col-span-3"></ProgTh>
                  </div>
                  {filteredScholarships.map((scholarship) => (
                    <div
                      key={`${scholarship.program}-${scholarship.scholarship}`}
                      className="grid grid-cols-12 items-center gap-4 border-b border-gray-100 px-6 py-5 hover:bg-gray-50/50"
                    >
                      <div className="col-span-2">
                        <h4 className="text-[14px] font-bold text-gray-900">
                          {scholarship.program}
                        </h4>
                      </div>
                      <div className="col-span-2">
                        {scholarship.scholarship}
                      </div>
                      <div className="col-span-2">
                        <span className="text-[13px] font-medium text-green-600">
                          {scholarship.benefit}
                        </span>
                      </div>
                      <div className="col-span-3">{scholarship.audience}</div>
                      <div className="col-span-3">
                        <button className="rounded-lg bg-brand-blue px-5 py-2 text-xs font-bold text-white hover:bg-brand-hover">
                          Get Scholarship
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {alumni.map((person) => (
                  <div
                    key={person.name}
                    className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5"
                  >
                    <img
                      src={person.image}
                      className="h-16 w-16 rounded-full object-cover"
                      alt={person.name}
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{person.name}</h4>
                      <p className="text-[12.5px] text-gray-500">
                        {person.role}
                      </p>
                      <p className="text-[11.5px] text-gray-400">
                        {person.batch}
                      </p>
                    </div>
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue/5 text-brand-blue hover:bg-brand-blue/10">
                      <i className="fa-brands fa-linkedin-in"></i>
                    </button>
                  </div>
                ))}
              </div>
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
                {galleryImages.slice(0, visibleImageCount).map((image, index) => (
                  <div
                    key={image}
                    className="aspect-[16/10] overflow-hidden rounded-lg cursor-pointer"
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

              {visibleImageCount < galleryImages.length && (
                <div className="mt-8 text-center">
                  <button
                    className="rounded-lg bg-brand-blue px-8 py-3 text-sm font-bold text-white hover:bg-brand-hover transition"
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
                    src={galleryImages[selectedImageIndex]}
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
            </div>
          )}

          {activeTab === "review" && (
            <div>
              {reviewsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-brand-blue"></div>
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
                        className="inline-block px-6 py-3 bg-brand-blue text-white rounded-lg font-medium hover:bg-brand-hover transition-colors"
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
                {newsCards.slice((newsPage - 1) * 9, newsPage * 9).map((news) => (
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
                      <div className="mb-4 h-[140px] w-full overflow-hidden rounded-xl">
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

              {newsCards.length > 9 && (
                <div className="mt-8 flex justify-center gap-2">
                  {Array.from({ length: Math.ceil(newsCards.length / 9) }).map((_, idx) => (
                    <button
                      key={idx}
                      className={`h-10 w-10 rounded-lg text-sm font-bold transition ${newsPage === idx + 1 ? "bg-brand-blue text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                      onClick={() => setNewsPage(idx + 1)}
                    >
                      {idx + 1}
                    </button>
                  ))}
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
                {downloads.map((download) => (
                  <div
                    key={download.title}
                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${download.color}`}
                      >
                        <i className="fa-regular fa-file-lines text-xl"></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {download.title}
                        </h4>
                        <p className="text-[12.5px] text-gray-500">
                          {download.size}
                        </p>
                      </div>
                    </div>
                    <button
                      className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold text-white shadow-sm ${download.btn}`}
                    >
                      <i className="fa-solid fa-download"></i>Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6 lg:col-span-1 lg:w-full lg:max-w-[400px] lg:justify-self-end">
          <div className="w-full rounded-xl border border-gray-200 bg-white p-4 sm:p-10">
            <h3 className="mb-8 text-2xl font-bold text-gray-900">
              Contact Information
            </h3>
            <div className="flex flex-col gap-6">
            <ContactInfoRow
                icon="fa-solid fa-location-dot"
                title="Address"
                value={locationText}
                badge="bg-brand-blue/5 text-[#0000FF]"
              />
              <ContactInfoRow
                icon="fa-solid fa-phone"
                title="Phone"
                value={college?.phone || "+977-1-6680000"}
                badge="bg-emerald-50 text-emerald-600"
              />
              <ContactInfoRow
                icon="fa-solid fa-envelope"
                title="Email"
                value={college?.email || "info@soe.ku.edu.np"}
                badge="bg-red-50 text-red-500"
                link
                linkHref="mailto:info@soe.ku.edu.np"
              />
              <ContactInfoRow
                icon="fa-solid fa-globe"
                title="Website"
                value={website}
                badge="bg-purple-50 text-purple-600"
                link
                linkHref={websiteHref}
              />
              <div className="w-full">
                <h3 className="text-[15px] font-bold text-gray-900">
                  Social Media
                </h3>
                <div className="mt-3 flex gap-5 text-[26px]">
                  <a
                    href="#"
                    className="text-[#1877F2] drop-shadow-sm transition-transform hover:scale-110"
                    title="Facebook"
                  >
                    <i className="fa-brands fa-facebook"></i>
                  </a>
                  <a
                    href="#"
                    className="text-[#E4405F] drop-shadow-sm transition-transform hover:scale-110"
                    title="Instagram"
                  >
                    <i className="fa-brands fa-instagram"></i>
                  </a>
                  <a
                    href="#"
                    className="text-black drop-shadow-sm transition-transform hover:scale-110"
                    title="TikTok"
                  >
                    <i className="fa-brands fa-tiktok"></i>
                  </a>
                  <a
                    href="#"
                    className="text-[#FF0000] drop-shadow-sm transition-transform hover:scale-110"
                    title="YouTube"
                  >
                    <i className="fa-brands fa-youtube"></i>
                  </a>
                  <a
                    href="#"
                    className="text-[#0A66C2] drop-shadow-sm transition-transform hover:scale-110"
                    title="LinkedIn"
                  >
                    <i className="fa-brands fa-linkedin"></i>
                  </a>
                </div>
              </div>
              <div className="group relative mt-8 h-35 w-full cursor-pointer overflow-hidden rounded-md ">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')",
                    filter: "opacity(0.8) contrast(0.9) sepia(0.2)",
                  }}
                ></div>
                <div className="absolute inset-0 bg-white/20"></div>
                <button className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-[14px] font-bold text-gray-900 shadow-md transition-all hover:bg-gray-50 hover:shadow-lg active:scale-95">
                  <i className="fa-solid fa-arrow-up-right-from-square text-sm"></i>
                  Get Directions
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-gray-100 bg-white p-6">
            <h3 className="mb-2 text-[18px] font-bold text-gray-900">
              Request Information
            </h3>
            <p className="mb-5 text-[13px] text-gray-500">
              Fill the form and our admission counselor will contact you.
            </p>
            <form className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-[13.5px] focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-[13.5px] focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-[13.5px] focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
              <select className="w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-[13.5px] text-gray-600 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20">
                <option>Select Course of Interest</option>
                <option>B.Sc. CSIT</option>
                <option>BBA Finance</option>
                <option>MBA</option>
              </select>
              <button
                type="button"
                className="mt-2 w-full rounded-md bg-brand-blue py-3.5 text-[14px] font-bold text-white shadow-sm shadow-brand-blue/20 transition-colors hover:bg-brand-hover"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      </div>

      <ClaimCollegeModal
        collegeName={name}
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

      {showUnfollowDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-bold text-gray-900">Unfollow College</h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to unfollow <strong>{name}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUnfollowDialog(false)}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsFollowed(false);
                  setShowUnfollowDialog(false);
                }}
                className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-red-600"
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
