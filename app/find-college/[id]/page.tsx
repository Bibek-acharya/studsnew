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
import { BadgeCheckIcon, ChevronLeft, ChevronRight } from "lucide-react";

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

const cardData = {
  "Samir Sharma": {
    avatar:
      "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?auto=format&fit=crop&w=150&h=150&q=80",
    title: "Industry-Aligned<br/>Curriculum",
    quote:
      '"Our program bridges the gap between theoretical foundations and the practical skills needed in today\'s rapidly evolving tech landscape."',
    author: "Prof. Michael Chen",
    role: "Head of Computer Science",
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  },
  "Deepak Khadka": {
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
    title: "Seamless<br/>Admissions",
    quote:
      '"We ensure a smooth, transparent, and welcoming enrollment process for every prospective student joining our community."',
    author: "Deepak Khadka",
    role: "Admission Head",
    video: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  },
  "Basanta Blown": {
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80",
    title: "Student-Centric<br/>Support",
    quote:
      '"Guiding students through their academic journey with personalized assistance, care, and continuous mentorship."',
    author: "Basanta Blown",
    role: "Asst Coordinator",
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  "Tribendra Timsina": {
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80",
    title: "Academic<br/>Excellence",
    quote:
      '"Maintaining rigorous standards in our curriculum to foster critical thinking, innovation, and professional growth."',
    author: "Tribendra Timsina",
    role: "Coordinator",
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  "Kush Shrestha": {
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    title: "Efficient<br/>Operations",
    quote:
      '"Behind every great institution is a dedicated administrative team ensuring smooth and efficient day-to-day operations."',
    author: "Kush Shrestha",
    role: "Administration",
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
};

const AboutVideoInteractive = () => {
  const [mainKey, setMainKey] = useState("Samir Sharma");
  const [fading, setFading] = useState(false);

  const allKeys = Object.keys(cardData);
  const others = allKeys.filter((k) => k !== mainKey);
  const mainData = cardData[mainKey as keyof typeof cardData];

  const handleSwap = (newKey: string) => {
    setFading(true);
    setTimeout(() => {
      setMainKey(newKey);
      setFading(false);
    }, 150);
  };

  return (
    <div className="mx-auto mb-10 flex w-full max-w-212.5 flex-col items-center justify-center gap-6 xl:flex-row xl:gap-8">
      <div className="relative h-[50vh] w-full max-w-125 shrink-0 overflow-hidden rounded-xl bg-gray-900 shadow-2xl ring-1 ring-gray-200/50 sm:h-[340px] sm:rounded-2xl">
        <video
          className="absolute inset-0 h-full w-full bg-gray-800 object-cover transition-opacity duration-300"
          src={mainData.video}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute bottom-5 left-5 z-10 max-w-[70%]">
          <div
            className="flex flex-col rounded-lg border border-white/10 bg-black/60 px-4 py-2 text-white shadow-lg backdrop-blur-md sm:px-5 sm:py-3"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}
          >
            <span className="text-sm font-semibold tracking-wide sm:text-base">
              {mainKey}
            </span>
            <span className="mt-0.5 text-[10px] font-medium text-gray-300 sm:text-xs">
              {mainData.role}
            </span>
          </div>
        </div>

        <div className="absolute right-5 top-5 z-20 flex max-h-[calc(100%-40px)] flex-col gap-2 overflow-y-auto pb-4 pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {others.map((key) => {
            const data = cardData[key as keyof typeof cardData];
            return (
              <div
                key={key}
                onClick={() => handleSwap(key)}
                className="group relative h-[50px] w-[70px] shrink-0 cursor-pointer transition-transform hover:scale-105 sm:h-[55px] sm:w-[85px] shadow-xl"
              >
                <div className="relative h-full w-full overflow-hidden rounded-lg border-[2px] border-white bg-gray-800 sm:rounded-xl">
                  <video
                    className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                    src={data.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                  <div className="absolute bottom-0 left-0 right-0 z-30 flex h-[80%] flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent p-1">
                    <span
                      className="truncate text-[8px] font-bold leading-tight text-white sm:text-[9px]"
                      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}
                    >
                      {key}
                    </span>
                    <span
                      className="mt-0.5 truncate text-[6px] font-medium leading-tight text-gray-300 sm:text-[7px]"
                      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}
                    >
                      {data.role}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative h-[50vh] w-full max-w-[280px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#0B1C38] p-5 shadow-xl sm:h-[340px] sm:p-6">
        <div
          className={`relative z-10 flex h-full flex-col justify-center transition-opacity duration-150 ${fading ? "opacity-50" : "opacity-100"}`}
        >
          <img
            src={mainData.avatar}
            alt="Avatar"
            className="mb-3 h-12 w-12 rounded-xl border border-white/20 object-cover shadow-sm sm:mb-4 sm:h-14 sm:w-14"
          />
          <h2
            dangerouslySetInnerHTML={{ __html: mainData.title }}
            className="mb-2 text-[16px] font-bold leading-tight tracking-tight text-white sm:mb-3 sm:text-[18px]"
          />
          <p className="mb-4 text-[12px] leading-relaxed text-blue-100/80 sm:text-[13px]">
            {mainData.quote}
          </p>
          <div className="mt-auto">
            <h4 className="mb-1 text-[11px] font-bold uppercase tracking-wide text-white sm:text-[12px]">
              {mainData.author}
            </h4>
            <p className="text-[12px] text-blue-200/60">{mainData.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

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
    badgeClass: "bg-[#0000FF]/5 text-[#0000FF]",
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
    color: "bg-[#0000FF]/5 text-[#0000FF]",
    btn: "bg-[#0000FF] hover:bg-[#0000CC]",
  },
  {
    title: "Application Form",
    size: "PDF, 2.1 MB",
    color: "bg-[#0000FF]/5 text-[#0000FF]",
    btn: "bg-[#0000FF] hover:bg-[#0000CC]",
  },
  {
    title: "Scholarship Guidelines",
    size: "PDF, 1.5 MB",
    color: "bg-[#0000FF]/5 text-[#0000FF]",
    btn: "bg-[#0000FF] hover:bg-[#0000CC]",
  },
  {
    title: "Course Catalogue 2025",
    size: "PDF, 12.0 MB",
    color: "bg-[#0000FF]/5 text-[#0000FF]",
    btn: "bg-[#0000FF] hover:bg-[#0000CC]",
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
  const [shareUrl, setShareUrl] = useState("");
  const [college, setCollege] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const tabsScrollRef = useRef<HTMLDivElement | null>(null);
  const tabsNavRef = useRef<HTMLElement | null>(null);
  const [canScrollTabsLeft, setCanScrollTabsLeft] = useState(false);
  const [canScrollTabsRight, setCanScrollTabsRight] = useState(false);

  const updateTabScrollState = useCallback(() => {
    const container = tabsScrollRef.current;
    if (!container) {
      setCanScrollTabsLeft(false);
      setCanScrollTabsRight(false);
      return;
    }

    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    setCanScrollTabsLeft(container.scrollLeft > 4);
    setCanScrollTabsRight(container.scrollLeft < maxScrollLeft - 4);
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
  const banner = college?.image_url || fallbackCollege.banner;
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
    <div className="w-full bg-white">
      <div
        className="relative h-55 w-full bg-blue-800 bg-center md:h-90"
        // style={{ backgroundImage: `url('${banner}')` }}
      >
        <div className="absolute bottom-4 right-4 z-20 md:bottom-6 md:right-6">
          {isVerified ? (
            <button className="flex items-center gap-2 rounded-md bg-brand-blue px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:bg-brand-hover md:px-6 md:py-3 md:text-base">
              <i className="fa-regular fa-comments"></i>
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
              <div className="flex items-center justify-start gap-1.5 text-[14px] font-medium text-gray-600 md:text-[15px]">
                <i className="fa-solid fa-location-dot text-gray-500"></i>
                <span>{locationText}</span>
              </div>
              <div className="flex items-center justify-start gap-5 pt-1 text-[14px] font-medium">
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
            </div>

            <div className="mt-8 flex w-full flex-nowrap items-center gap-2 overflow-x-auto pb-1 lg:mt-0 lg:w-auto lg:gap-3 lg:overflow-visible lg:pb-0">
              <button className="shrink-0 flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[14px] font-semibold text-gray-700 transition-colors hover:bg-gray-50 lg:px-5 lg:py-3 lg:text-[15px]">
                <i className="fa-solid fa-download"></i>Brochure
              </button>
              <button className="shrink-0 flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[14px] font-semibold text-gray-700 transition-colors hover:bg-gray-50 lg:px-5 lg:py-3 lg:text-[15px]">
                <i className="fa-regular fa-circle-question"></i>Ask Question
              </button>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="shrink-0 flex items-center justify-center rounded-xl border border-gray-200 bg-white p-2.5 text-gray-700 shadow-sm transition-colors hover:bg-gray-50 lg:p-3"
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
          <button
            type="button"
            onClick={() => scrollTabs("left")}
            className={`absolute left-6 top-1/2 z-20 -translate-y-1/2 rounded-full border bg-white p-1.5 shadow-sm transition md:left-12 lg:left-24 xl:left-32 ${canScrollTabsLeft ? "border-gray-200 text-gray-700 hover:bg-gray-50" : "border-gray-100 text-gray-300"}`}
            aria-label="Scroll tabs left"
            aria-disabled={!canScrollTabsLeft}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => scrollTabs("right")}
            className={`absolute right-6 top-1/2 z-20 -translate-y-1/2 rounded-full border bg-white p-1.5 shadow-sm transition md:right-12 lg:right-24 xl:right-32 ${canScrollTabsRight ? "border-gray-200 text-gray-700 hover:bg-gray-50" : "border-gray-100 text-gray-300"}`}
            aria-label="Scroll tabs right"
            aria-disabled={!canScrollTabsRight}
          >
            <ChevronRight className="h-4 w-4" />
          </button>

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
                    className={`shrink-0 border-b-2 py-4 text-[15px] ${selected ? "border-[#0000FF] font-bold text-gray-900" : "border-transparent font-semibold text-gray-500 hover:text-gray-900"}`}
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

              <div className="space-y-6 rounded-[24px] border border-gray-100 bg-white p-8 shadow-sm">
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
            <div className="overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-[#f4f8fc] px-6 py-4">
                <p className="text-[14px] font-semibold text-[#0000FF]">
                  Fees in NPR/year – filter by level
                </p>
                <FilterPills active={courseFilter} onChange={setCourseFilter} />
              </div>
              <div className="w-full overflow-x-auto">
                <div className="min-w-[700px]">
                  <div className="grid grid-cols-12 items-center gap-4 border-b border-gray-100 bg-white px-6 py-5">
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
                        <h4 className="text-[15.5px] font-bold text-[#0000FF]">
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
            <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <p className="text-[14px] font-semibold text-[#0000FF]">
                  Admission notices – filter by level
                </p>
                <FilterPills
                  active={admissionFilter}
                  onChange={setAdmissionFilter}
                />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {filteredAdmissions.map((admission) => (
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
            </div>
          )}

          {activeTab === "offered" && (
            <div className="overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-[#f4f8fc] px-6 py-4">
                <p className="text-[14px] font-semibold text-[#0000FF]">
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
                        <button className="rounded-lg bg-[#0000FF]/5 px-4 py-2 text-xs font-bold text-[#0000FF] hover:bg-[#0000FF]/10">
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
                    className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0000FF]/5 text-[#0000FF]">
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
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {events.map((event) => (
                  <div
                    key={event.title}
                    className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
                  >
                    <img
                      src={event.image}
                      className="h-40 w-full object-cover"
                      alt={event.title}
                    />
                    <div className="p-4">
                      <h4 className="text-[16px] font-bold text-gray-900">
                        {event.title}
                      </h4>
                      <div className="my-1 flex items-center gap-2 text-[12px] text-gray-500">
                        <i className="fa-regular fa-calendar"></i>
                        {event.date}
                      </div>
                      <p className="text-[13px] text-gray-600">{event.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "scholarship" && (
            <div className="overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-[#f4f8fc] px-6 py-4">
                <p className="text-[14px] font-semibold text-[#0000FF]">
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
                        <button className="rounded-lg bg-[#0000FF] px-5 py-2 text-xs font-bold text-white hover:bg-[#0000CC]">
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
                    className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
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
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0000FF]/5 text-[#0000FF] hover:bg-[#0000FF]/10">
                      <i className="fa-brands fa-linkedin-in"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "gallery" && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-[20px] font-bold text-gray-900">
                  Campus Gallery
                </h2>
                <button className="text-[13.5px] font-bold text-[#0000FF]">
                  View All
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {galleryImages.map((image) => (
                  <div
                    key={image}
                    className="aspect-[16/10] overflow-hidden rounded-lg"
                  >
                    <img
                      src={image}
                      className="h-full w-full object-cover transition duration-300 hover:scale-105"
                      alt="Gallery"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "review" && (
            <div>
              <div className="mb-8 flex flex-col items-center gap-8 rounded-[24px] border border-gray-100 bg-white p-8 shadow-sm md:flex-row">
                <div className="text-center md:border-r md:pr-8 md:text-left">
                  <h2 className="mb-2 text-5xl font-extrabold text-gray-900">
                    4.5
                  </h2>
                  <div className="mb-2 flex items-center justify-center gap-1 md:justify-start">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <i
                        key={`full-${idx}`}
                        className="fa-solid fa-star text-[14px] text-yellow-400"
                      ></i>
                    ))}
                    <i className="fa-solid fa-star-half-stroke text-[14px] text-yellow-400"></i>
                  </div>
                  <p className="text-[13px] font-medium text-gray-500">
                    Based on {reviewsCount} reviews
                  </p>
                </div>
                <div className="w-full flex-1 space-y-2.5">
                  <RatingBar
                    label="5"
                    width="70%"
                    color="bg-green-500"
                    pct="70%"
                  />
                  <RatingBar
                    label="4"
                    width="20%"
                    color="bg-green-400"
                    pct="20%"
                  />
                  <RatingBar
                    label="3"
                    width="7%"
                    color="bg-yellow-400"
                    pct="7%"
                  />
                  <RatingBar
                    label="2"
                    width="2%"
                    color="bg-orange-400"
                    pct="2%"
                  />
                  <RatingBar label="1" width="1%" color="bg-red-500" pct="1%" />
                </div>
              </div>

              <div className="space-y-5">
                <h3 className="text-[18px] font-bold text-gray-900">
                  Recent Reviews
                </h3>
                <ReviewCard
                  initials="AS"
                  name="Amit Sharma"
                  subtitle="B.Sc. CSIT · Batch 2022"
                  rating={5}
                  pros="Excellent faculty with real-world industry experience. The labs are well-equipped with the latest tech."
                  cons="Canteen food could be better. Parking space is quite limited during peak hours."
                  tone="blue"
                />
                <ReviewCard
                  initials="SM"
                  name="Sita Maharjan"
                  subtitle="BBA · Batch 2021"
                  rating={4}
                  pros="Great focus on extracurricular activities and business competitions. Very supportive administration."
                  cons="The library space is somewhat small for a growing number of students."
                  tone="purple"
                />
              </div>
            </div>
          )}

          {activeTab === "news" && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {newsCards.map((news) => (
                <div
                  key={news.title}
                  className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
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
                    <button className="flex items-center text-[13px] font-bold text-[#0000FF] hover:text-[#0000CC]">
                      View Details
                      <i className="fa-solid fa-chevron-right ml-1 text-[11px]"></i>
                    </button>
                  </div>
                </div>
              ))}
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
              <div className="grid grid-cols-1 gap-4">
                {downloads.map((download) => (
                  <div
                    key={download.title}
                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow"
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

        <div className="space-y-6 lg:col-span-1 lg:w-full lg:max-w-[420px] lg:justify-self-end">
          <div className="w-full rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm sm:p-10">
            <h3 className="mb-8 text-2xl font-bold text-gray-900">
              Contact Information
            </h3>
            <div className="flex flex-col gap-6">
              <ContactInfoRowV2
                icon="fa-solid fa-location-dot"
                title="Address"
                value={locationText}
                badge="bg-[#0000FF]/5 text-[#0000FF]"
              />
              <ContactInfoRowV2
                icon="fa-solid fa-phone"
                title="Phone"
                value={college?.phone || "+977-1-6680000"}
                badge="bg-emerald-50 text-emerald-600"
              />
              <ContactInfoRowV2
                icon="fa-solid fa-envelope"
                title="Email"
                value={college?.email || "info@soe.ku.edu.np"}
                badge="bg-red-50 text-red-500"
                link
                linkHref="mailto:info@soe.ku.edu.np"
              />
              <ContactInfoRowV2
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
              <div className="group relative mt-8 h-44 w-full cursor-pointer overflow-hidden rounded-2xl shadow-inner">
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

          <div className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm">
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
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[13.5px] focus:border-[#0000FF] focus:outline-none focus:ring-2 focus:ring-[#0000FF]/20"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[13.5px] focus:border-[#0000FF] focus:outline-none focus:ring-2 focus:ring-[#0000FF]/20"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[13.5px] focus:border-[#0000FF] focus:outline-none focus:ring-2 focus:ring-[#0000FF]/20"
              />
              <select className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[13.5px] text-gray-600 focus:border-[#0000FF] focus:outline-none focus:ring-2 focus:ring-[#0000FF]/20">
                <option>Select Course of Interest</option>
                <option>B.Sc. CSIT</option>
                <option>BBA Finance</option>
                <option>MBA</option>
              </select>
              <button
                type="button"
                className="mt-2 w-full rounded-xl bg-[#0000FF] py-3.5 text-[14px] font-bold text-white shadow-sm shadow-[#0000FF]/20 transition-colors hover:bg-[#0000CC]"
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
    </div>
  );
};

const FilterPills: React.FC<{
  active: LevelFilter;
  onChange: (value: LevelFilter) => void;
}> = ({ active, onChange }) => {
  const levels: LevelFilter[] = ["all", "+2", "Bachelor", "Master"];
  return (
    <div className="flex gap-2 text-xs font-medium">
      {levels.map((level) => {
        const selected = active === level;
        return (
          <button
            key={level}
            onClick={() => onChange(level)}
            className={`rounded-full px-4 py-1.5 ${selected ? "bg-[#0000FF] text-white shadow-sm" : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"}`}
          >
            {level === "all" ? "All" : level}
          </button>
        );
      })}
    </div>
  );
};

const ProgTh: React.FC<{ className?: string; children?: React.ReactNode }> = ({
  className = "",
  children,
}) => (
  <div className={`text-[13px] font-bold uppercase text-gray-800 ${className}`}>
    {children}
  </div>
);

const InfoBlock: React.FC<{
  title: string;
  desc: string;
  icon: string;
  color: "blue" | "green";
}> = ({ title, desc, icon, color }) => (
  <div className="rounded-[20px] border border-gray-100 bg-white p-8 shadow-sm">
    <div className="mb-4 flex items-center gap-3.5">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full ${color === "blue" ? "bg-[#0000FF]/10 text-[#0000FF]" : "bg-[#0000FF]/10 text-[#0000FF]"}`}
      >
        <i className={icon}></i>
      </div>
      <h3 className="text-[16px] font-bold text-gray-900">{title}</h3>
    </div>
    <p className="text-[14.5px] leading-[1.7] text-gray-600">{desc}</p>
  </div>
);

const OverviewRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <tr>
    <td className="w-1/3 bg-gray-50 px-4 py-3 font-semibold">{label}</td>
    <td className="px-4 py-3">{value}</td>
  </tr>
);

const AdminRow: React.FC<{
  position: string;
  role: string;
  holder: string;
}> = ({ position, role, holder }) => (
  <tr>
    <td className="px-4 py-3 font-medium">{position}</td>
    <td className="px-4 py-3">{role}</td>
    <td className="px-4 py-3">{holder}</td>
  </tr>
);

const RatingBar: React.FC<{
  label: string;
  width: string;
  color: string;
  pct: string;
}> = ({ label, width, color, pct }) => (
  <div className="flex items-center text-[13px] font-medium text-gray-600">
    <span className="w-3">{label}</span>
    <i className="fa-solid fa-star mx-1.5 text-[10px] text-gray-400"></i>
    <div className="relative mx-3 h-2 flex-grow rounded bg-[#f1f5f9]">
      <div className={`h-full rounded ${color}`} style={{ width }}></div>
    </div>
    <span className="w-8 text-right text-gray-400">{pct}</span>
  </div>
);

const ReviewCard: React.FC<{
  initials: string;
  name: string;
  subtitle: string;
  rating: number;
  pros: string;
  cons: string;
  tone: "blue" | "purple";
}> = ({ initials, name, subtitle, rating, pros, cons, tone }) => (
  <div className="rounded-[20px] border border-gray-100 bg-white p-6 shadow-sm">
    <div className="mb-4 flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${tone === "blue" ? "bg-[#0000FF]/10 text-[#0000FF]" : "bg-[#0000FF]/10 text-[#0000FF]"}`}
        >
          {initials}
        </div>
        <div>
          <h4 className="text-[14.5px] font-bold text-gray-900">{name}</h4>
          <p className="text-[12px] text-gray-500">{subtitle}</p>
        </div>
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, idx) => (
          <i
            key={idx}
            className={`${idx < rating ? "fa-solid text-yellow-400" : "fa-regular text-gray-300"} fa-star text-[13px]`}
          ></i>
        ))}
      </div>
    </div>
    <div className="mb-3 rounded-lg border border-gray-100 bg-[#fafafa] p-4">
      <div className="mb-2 flex items-start gap-2">
        <i className="fa-solid fa-thumbs-up mt-0.5 text-green-500"></i>
        <p className="text-[13.5px] leading-relaxed text-gray-700">
          <span className="font-bold text-gray-900">Pros:</span> {pros}
        </p>
      </div>
      <div className="flex items-start gap-2">
        <i className="fa-solid fa-thumbs-down mt-0.5 text-red-500"></i>
        <p className="text-[13.5px] leading-relaxed text-gray-700">
          <span className="font-bold text-gray-900">Cons:</span> {cons}
        </p>
      </div>
    </div>
  </div>
);

const ContactInfoRow: React.FC<{
  icon: string;
  title: string;
  value: string;
  badge: string;
  link?: boolean;
}> = ({ icon, title, value, badge, link = false }) => (
  <li className="flex items-start gap-3">
    <div
      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${badge}`}
    >
      <i className={icon}></i>
    </div>
    <div>
      <p className="text-[13px] font-bold text-gray-900">{title}</p>
      {link ? (
        <a
          href="#"
          className="mt-0.5 block text-[13.5px] text-[#0000FF] hover:underline"
        >
          {value}
        </a>
      ) : (
        <p className="mt-0.5 text-[13.5px] text-gray-600">{value}</p>
      )}
    </div>
  </li>
);

const ContactInfoRowV2: React.FC<{
  icon: string;
  title: string;
  value: string;
  badge: string;
  link?: boolean;
  linkHref?: string;
}> = ({ icon, title, value, badge, link = false, linkHref = "#" }) => (
  <div className="flex items-start gap-4">
    <div
      className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${badge}`}
    >
      <i className={`${icon} text-lg`}></i>
    </div>
    <div>
      <h3 className="text-[15px] font-bold text-gray-900">{title}</h3>
      {link ? (
        <a
          href={linkHref}
          className="mt-0.5 inline-block text-sm text-gray-500 transition-colors hover:text-[#0000FF]"
        >
          {value}
        </a>
      ) : (
        <p className="mt-0.5 text-sm text-gray-500">{value}</p>
      )}
    </div>
  </div>
);

const ClaimCollegeModal: React.FC<{
  collegeName: string;
  isOpen: boolean;
  onClose: () => void;
}> = ({ collegeName, isOpen, onClose }) => {
  const [institutionName, setInstitutionName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [email, setEmail] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  React.useEffect(() => {
    if (isOpen) {
      setInstitutionName(collegeName || "");
      setRegistrationNumber("");
      setEmail("");
      setContactPerson("");
      setContactNumber("");
    }
  }, [isOpen, collegeName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      "Claim request submitted successfully! Our team will verify and grant you access.",
    );
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      onClick={onClose}
    >
      <div
        className={`mx-4 flex max-h-[90vh] w-full max-w-md flex-col rounded-[20px] bg-white shadow-2xl transition-transform duration-300 ${isOpen ? "scale-100" : "scale-95"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-5">
          <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <i className="fa-solid fa-building-shield text-[20px] text-[#0000FF]"></i>
            Claim Institution
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <i className="fa-solid fa-xmark text-[20px]"></i>
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5">
          <div className="mb-5 flex items-start gap-3 rounded-lg border border-[#0000FF]/20 bg-[#0000FF]/5 p-3.5">
            <i className="fa-solid fa-circle-info mt-0.5 shrink-0 text-[18px] text-[#0000FF]"></i>
            <p className="line-height-extra text-[13px] text-[#0000FF]">
              Provide official details to claim{" "}
              <span className="font-bold text-[#0000FF]">{collegeName}</span>.
              Upon verification, you will receive full control over this
              profile.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="College name"
              required
              value={institutionName}
              onChange={(event) => setInstitutionName(event.target.value)}
              className="w-full px-4 py-3 bg-[#EEF2F6] border border-[#D5DCE8] rounded-xl focus:bg-white focus:border-[#2D68FE] outline-none text-[14px] shadow-sm"
            />
            <input
              type="text"
              placeholder="Institution registration number"
              required
              value={registrationNumber}
              onChange={(event) => setRegistrationNumber(event.target.value)}
              className="w-full px-4 py-3 bg-[#EEF2F6] border border-[#D5DCE8] rounded-xl focus:bg-white focus:border-[#2D68FE] outline-none text-[14px] shadow-sm"
            />
            <input
              type="email"
              placeholder="Work email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full px-4 py-3 bg-[#EEF2F6] border border-[#D5DCE8] rounded-xl focus:bg-white focus:border-[#2D68FE] outline-none text-[14px] shadow-sm"
            />
            <input
              type="text"
              placeholder="Contact Person Full Name"
              required
              value={contactPerson}
              onChange={(event) => setContactPerson(event.target.value)}
              className="w-full px-4 py-3 bg-[#EEF2F6] border border-[#D5DCE8] rounded-xl focus:bg-white focus:border-[#2D68FE] outline-none text-[14px] shadow-sm"
            />
            <input
              type="tel"
              placeholder="Contact Number"
              required
              value={contactNumber}
              onChange={(event) => setContactNumber(event.target.value)}
              className="w-full px-4 py-3 bg-[#EEF2F6] border border-[#D5DCE8] rounded-xl focus:bg-white focus:border-[#2D68FE] outline-none text-[14px] shadow-sm"
            />
            <div className="mt-8 flex flex-col justify-end gap-3 sm:flex-row pt-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-[14px] font-bold text-gray-600 transition-colors hover:bg-gray-50 sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0000FF] px-6 py-2.5 text-[14px] font-bold text-white shadow-[0_4px_12px_rgba(0,0,255,0.2)] transition-all hover:-translate-y-0.5 hover:bg-[#0000CC] sm:w-auto"
              >
                Submit Claim Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const ShareCollegeModal: React.FC<{
  collegeName: string;
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  shareTitle: string;
  shareText: string;
}> = ({
  collegeName,
  isOpen,
  onClose,
  shareUrl,
  shareTitle,
  shareText,
}) => {
  const [copyLabel, setCopyLabel] = useState("Copy link");

  useEffect(() => {
    if (!isOpen) {
      setCopyLabel("Copy link");
    }
  }, [isOpen]);

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);

  const socialLinks = [
    {
      name: "Facebook",
      icon: "fa-brands fa-facebook-f",
      color: "text-[#1877F2]",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "X",
      icon: "fa-brands fa-x-twitter",
      color: "text-black",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    },
    {
      name: "WhatsApp",
      icon: "fa-brands fa-whatsapp",
      color: "text-[#25D366]",
      href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    },
    {
      name: "Instagram",
      icon: "fa-brands fa-instagram",
      color: "text-[#E4405F]",
      href: `https://www.instagram.com/`,
    },
    {
      name: "LinkedIn",
      icon: "fa-brands fa-linkedin-in",
      color: "text-[#0A66C2]",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: "Telegram",
      icon: "fa-brands fa-telegram",
      color: "text-[#229ED9]",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyLabel("Copied");
      window.setTimeout(() => setCopyLabel("Copy link"), 1600);
    } catch {
      setCopyLabel("Copy failed");
      window.setTimeout(() => setCopyLabel("Copy link"), 1600);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/45 px-4 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      onClick={onClose}
    >
      <div
        className={`mx-auto w-full max-w-lg rounded-[24px] bg-white shadow-2xl transition-transform duration-300 ${isOpen ? "scale-100" : "scale-95"}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Share college</h3>
            <p className="mt-1 text-sm text-gray-500">{collegeName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close share popup"
          >
            <i className="fa-solid fa-xmark text-[20px]"></i>
          </button>
        </div>

        <div className="px-6 py-6">

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4 text-center transition hover:-translate-y-0.5 hover:bg-white"
                aria-label={`Share on ${item.name}`}
              >
                <span className={`flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl shadow-sm ${item.color}`}>
                  <i className={item.icon}></i>
                </span>
                <span className="text-sm font-semibold text-gray-700">{item.name}</span>
              </a>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Share link
            </p>
            <div className="mt-3 flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
              <input
                readOnly
                value={shareUrl}
                className="min-w-0 flex-1 bg-transparent text-sm text-gray-600 outline-none"
              />
              <button
                type="button"
                onClick={copyLink}
                className="shrink-0 rounded-lg bg-[#0000FF] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#0000CC]"
              >
                {copyLabel}
              </button>
            </div>
            <p className="mt-3 text-xs text-gray-500">{shareTitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeDetailsPage;
