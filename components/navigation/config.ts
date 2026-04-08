import {
  DesktopMenuSection,
  MobileMenuItem,
  MobileMenuSection,
  NavbarNotification,
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
  studentDashboard: "/",
  writeReview: "/",
  login: "/login",
  signup: "/login",
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
        icon: "fa-shuffle",
        color: "text-blue-500",
        title: "Compare College",
        desc: "Launching Soon",
        disabled: true,
      },
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
        viewKey: "scholarshipFinderTool",
      },
      {
        icon: "fa-wand-magic-sparkles",
        color: "text-emerald-500",
        title: "College Recommender",
        desc: "Get personalized college recommendations based on your preferences.",
        viewKey: "collegeRecommenderTool",
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
    ],
  },
  {
    key: "more",
    label: "More",
    alignRight: true,
    items: [
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
        label: "Compare College",
        icon: "fa-shuffle",
        color: "text-blue-500",
        disabled: true,
        badge: "SOON",
      },
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
    ],
  },
  {
    key: "more",
    label: "More",
    items: [
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

export const initialNotifications: NavbarNotification[] = [
  {
    id: "1",
    type: "notice",
    title: "Application Status Update",
    message:
      "Stanford University has updated your application status. View portal for details.",
    time: "10m ago",
    isRead: false,
    isArchived: false,
    isFollowing: true,
    icon: "file-check-2",
    color: "text-blue-500",
    bgColor: "bg-blue-100",
  },
  {
    id: "2",
    type: "exam",
    title: "Midterm Exam Reminder",
    message: "AP Physics 1 regular exam is in 3 days. Make sure you are prepared!",
    time: "1h ago",
    isRead: false,
    isArchived: false,
    isFollowing: true,
    icon: "pen-tool",
    color: "text-red-500",
    bgColor: "bg-red-100",
  },
  {
    id: "3",
    type: "match",
    title: "New College Match!",
    message: "Based on your profile, you are a 95% match for Cornell University.",
    time: "3h ago",
    isRead: true,
    isArchived: false,
    isFollowing: false,
    icon: "zap",
    color: "text-pink-500",
    bgColor: "bg-pink-100",
  },
  {
    id: "4",
    type: "scholarship",
    title: "Scholarship Match!",
    message: "You match the criteria for the National Merit Scholarship program.",
    time: "Yesterday",
    isRead: true,
    isArchived: false,
    isFollowing: false,
    icon: "award",
    color: "text-yellow-500",
    bgColor: "bg-yellow-100",
  },
  {
    id: "5",
    type: "poll",
    title: "New Poll in Student Hub",
    message: "Vote for the next virtual campus tour destination.",
    time: "2 days ago",
    isRead: true,
    isArchived: false,
    isFollowing: true,
    icon: "pie-chart",
    color: "text-green-500",
    bgColor: "bg-green-100",
  },
  {
    id: "6",
    type: "system",
    title: "Configuration Complete",
    message: "Congratulations! You have successfully created your Studsphere account.",
    time: "3 days ago",
    isRead: true,
    isArchived: false,
    isFollowing: false,
    icon: "settings",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
  },
  {
    id: "7",
    type: "system",
    title: "New Feature Added! 🎉",
    message: "Dark mode is now available. Check your settings to toggle your theme.",
    time: "4 days ago",
    isRead: true,
    isArchived: false,
    isFollowing: false,
    icon: "sparkles",
    color: "text-indigo-500",
    bgColor: "bg-indigo-100",
  },
];
