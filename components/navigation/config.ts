import {
  DesktopMenuSection,
  MobileMenuItem,
  MobileMenuSection,
  NotificationTab,
  ViewKey,
} from "./types";

export const routeMap: Record<ViewKey, string> = {
  educationPage: "/",
  findCollege: "/find-college",
  compareColleges: "/compare-colleges",
  courseFinder: "/course-finder",
  bookCounselling: "/counseling",
  scholarshipProviderZone: "/scholarship-provider",
  scholarshipMain: "/",
  scholarshipRecommenderTool: "/scholarship-recommender",
  scholarshipFinderTool: "/scholarship-finder",
  collegeRecommenderTool: "/college-recommender",
  campusForum: "/campus-forum",
  admissionsDiscovery: "/admissions",
  entranceDiscovery: "/entrance",
  newsPage: "/news",
  blogPage: "/blogs",
  eventsPage: "/events",
  contact: "/contact-us",
  institutionZone: "/institution-zone",
  studentDashboard: "/user/dashboard",
  userDashboard: "/user/dashboard",
  writeReview: "/write-review",
  myApplications: "/user/dashboard/applications",
  savedColleges: "/user/dashboard/bookmarks",
  notificationSettings: "/user/dashboard/notifications",
  userSettings: "/user/dashboard/settings",
  login: "/login",
  signup: "/register",
  volunteer: "/volunteer",
  nepaliUniversities: "/universities/nepali",
  foreignUniversities: "/universities/foreign",
  scholarshipResultCheck: "/scholarship-result",
};

export const notificationTabs: NotificationTab[] = [
  "all",
  "following",
  "system",
  "archive",
];

export const desktopMenuSections: DesktopMenuSection[] = [
  {
    key: "tools",
    label: "Tools",
    items: [
      {
        icon: "fa-compass",
        color: "text-green-500",
        title: "Course Finder",
        desc: "Discover the perfect academic course tailored to your skills and career goals.",
        viewKey: "courseFinder",
      },
      {
        icon: "fa-headset",
        color: "text-emerald-500",
        title: "Get Counselling?",
        desc: "Get expert counselling to choose your ideal college and course.",
        viewKey: "bookCounselling",
      },
      {
        icon: "fa-award",
        color: "text-yellow-500",
        title: "Scholarship Recommender",
        desc: "Find scholarships tailored to your profile and needs.",
        viewKey: "scholarshipRecommenderTool",
      },
      {
        icon: "fa-wand-magic-sparkles",
        color: "text-emerald-500",
        title: "College Recommender",
        desc: "Get personalized college recommendations based on your preferences.",
        viewKey: "collegeRecommenderTool",
      },
      {
        icon: "fa-scale-balanced",
        color: "text-blue-500",
        title: "Compare Colleges",
        desc: "Compare colleges side by side on fees, courses, and ratings.",
        viewKey: "compareColleges",
      },
    ],
  },
  {
    key: "scholarships",
    label: "Scholarships",
    items: [
      {
        icon: "fa-graduation-cap",
        color: "text-yellow-500",
        title: "Scholarship Finder",
        desc: "Find scholarships tailored to your profile and needs.",
        viewKey: "scholarshipFinderTool",
      },
      {
        icon: "fa-building-ngo",
        color: "text-indigo-500",
        title: "Scholarship Provider",
        desc: "List and manage scholarship programs with us.",
        viewKey: "scholarshipProviderZone",
      },
      {
        icon: "fa-check-circle",
        color: "text-green-500",
        title: "Scholarship Result",
        desc: "View your scholarship application result.",
        viewKey: "scholarshipResultCheck",
        lucideIcon: "FileSpreadsheet",
      },
    ],
  },
  {
    key: "admission",
    label: "Admission",
    items: [
      {
        icon: "fa-school",
        color: "text-blue-500",
        title: "High School (+2)",
        desc: "Explore top high schools for Science, Management, and Humanities.",
        viewKey: "admissionsDiscovery",
        data: { level: "high-school" },
      },
      {
        icon: "fa-cubes",
        color: "text-orange-500",
        title: "A-Level",
        desc: "Discover internationally recognized Cambridge A-Level degrees.",
        viewKey: "admissionsDiscovery",
        data: { level: "a-level" },
      },
      {
        icon: "fa-wrench",
        color: "text-green-600",
        title: "Diploma / CTEVT",
        desc: "Explore skills-oriented technical and vocational education.",
        viewKey: "admissionsDiscovery",
        data: { level: "diploma" },
      },
      {
        icon: "fa-graduation-cap",
        color: "text-purple-600",
        title: "Bachelor",
        desc: "Find bachelor programs across arts, science, management, and more.",
        viewKey: "admissionsDiscovery",
        data: { level: "bachelor" },
      },
      {
        icon: "fa-user-graduate",
        color: "text-rose-600",
        title: "Master",
        desc: "Discover master's degrees and postgraduate programs.",
        viewKey: "admissionsDiscovery",
        data: { level: "master" },
      },
    ],
  },
  {
    key: "more",
    label: "More",
    alignRight: true,
    items: [
      {
        icon: "fa-hand-holding-heart",
        color: "text-red-500",
        title: "Become a Volunteer",
        desc: "Join our volunteer programs and make a difference in education.",
        viewKey: "volunteer",
      },
      {
        icon: "fa-newspaper",
        color: "text-blue-500",
        title: "News",
        desc: "Stay updated with the latest educational news.",
        viewKey: "newsPage",
      },
      {
        icon: "fa-pen",
        color: "text-green-500",
        title: "Blogs",
        desc: "Read insights, study tips, and campus experiences.",
        viewKey: "blogPage",
      },
      {
        icon: "fa-calendar-days",
        color: "text-orange-500",
        title: "Events",
        desc: "Join upcoming webinars, fairs, and campus events.",
        viewKey: "eventsPage",
      },
      {
        icon: "fa-envelope",
        color: "text-purple-600",
        title: "Contact Us",
        desc: "Reach out to our support team for any assistance.",
        viewKey: "contact",
      },
    ],
  },
];

export const mobileMenuSections: MobileMenuSection[] = [
  {
    key: "tools",
    label: "Tools",
    items: [
      {
        label: "Course Finder",
        icon: "fa-compass",
        color: "text-green-500",
        viewKey: "courseFinder",
      },
      {
        label: "Get Counselling?",
        icon: "fa-headset",
        color: "text-teal-600",
        viewKey: "bookCounselling",
      },
      {
        label: "Scholarship Finder",
        icon: "fa-award",
        color: "text-yellow-500",
        viewKey: "scholarshipFinderTool",
      },
      {
        label: "College Recommender",
        icon: "fa-wand-magic-sparkles",
        color: "text-emerald-500",
        viewKey: "collegeRecommenderTool",
      },
      {
        label: "Compare Colleges",
        icon: "fa-scale-balanced",
        color: "text-blue-500",
        viewKey: "compareColleges",
      },
    ],
  },
  {
    key: "scholarships",
    label: "Scholarships",
    items: [
      {
        label: "Scholarship Finder",
        icon: "fa-award",
        color: "text-yellow-500",
        viewKey: "scholarshipFinderTool",
      },
      {
        label: "Scholarship Provider",
        icon: "fa-building",
        color: "text-indigo-500",
        viewKey: "scholarshipProviderZone",
      },
      {
        label: "Scholarship Result",
        icon: "fa-check-circle",
        color: "text-green-500",
        viewKey: "scholarshipResultCheck",
      },
    ],
  },
  {
    key: "admission",
    label: "Admission",
    items: [
      {
        label: "High School (+2)",
        icon: "fa-school",
        color: "text-blue-500",
        viewKey: "admissionsDiscovery",
        data: { level: "high-school" },
      },
      {
        label: "A-Level",
        icon: "fa-cubes",
        color: "text-orange-500",
        viewKey: "admissionsDiscovery",
        data: { level: "a-level" },
      },
      {
        label: "Diploma / CTEVT",
        icon: "fa-wrench",
        color: "text-green-600",
        viewKey: "admissionsDiscovery",
        data: { level: "diploma" },
      },
      {
        label: "Bachelor",
        icon: "fa-graduation-cap",
        color: "text-purple-600",
        viewKey: "admissionsDiscovery",
        data: { level: "bachelor" },
      },
      {
        label: "Master",
        icon: "fa-user-graduate",
        color: "text-rose-600",
        viewKey: "admissionsDiscovery",
        data: { level: "master" },
      },
    ],
  },
  {
    key: "more",
    label: "More",
    items: [
      {
        label: "Become a Volunteer",
        icon: "fa-hand-holding-heart",
        color: "text-red-500",
        viewKey: "volunteer",
      },
      {
        label: "News",
        icon: "fa-newspaper",
        color: "text-blue-500",
        viewKey: "newsPage",
      },
      {
        label: "Blogs",
        icon: "fa-pen",
        color: "text-green-500",
        viewKey: "blogPage",
      },
      {
        label: "Events",
        icon: "fa-calendar-days",
        color: "text-orange-500",
        viewKey: "eventsPage",
      },
      {
        label: "Contact Us",
        icon: "fa-envelope",
        color: "text-purple-600",
        viewKey: "contact",
      },
    ],
  },
];

export const partnerMobileItems: MobileMenuItem[] = [
  {
    label: "Institution Zone",
    icon: "fa-building",
    color: "text-blue-500",
    viewKey: "institutionZone",
  },
  {
    label: "Provider Zone",
    icon: "fa-award",
    color: "text-indigo-500",
    viewKey: "scholarshipProviderZone",
  },
];

export const mobileQuickLinks: Array<{
  label: string;
  viewKey: ViewKey;
  badge?: string;
}> = [
  { label: "Find College", viewKey: "findCollege" },
  { label: "Campus Feed", viewKey: "campusForum", badge: "NEW" },
  { label: "Entrance", viewKey: "entranceDiscovery" },
];
