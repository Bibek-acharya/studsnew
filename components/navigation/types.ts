export interface EducationNavbarProps {
  onNavigate?: (view: string, data?: { level?: string }) => void;
  user?: {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  } | null;
  onLogout?: () => void;
}

export type ViewKey =
  | "educationPage"
  | "findCollege"
  | "compareColleges"
  | "courseFinder"
  | "bookCounselling"
  | "scholarshipProviderZone"
  | "scholarshipMain"
  | "scholarshipFinderTool"
  | "collegeRecommenderTool"
  | "campusForum"
  | "admissionsDiscovery"
  | "entranceDiscovery"
  | "newsPage"
  | "blogPage"
  | "eventsPage"
  | "contact"
  | "institutionZone"
  | "studentDashboard"
  | "writeReview"
  | "login"
  | "signup";

export type NotificationTab = "all" | "following" | "system" | "archive";

export interface DropdownItem {
  icon: string;
  color: string;
  title: string;
  desc: string;
  viewKey?: ViewKey;
  data?: { level?: string };
  disabled?: boolean;
}

export interface DesktopMenuSection {
  key: string;
  label: string;
  alignRight?: boolean;
  items: DropdownItem[];
}

export interface MobileMenuItem {
  label: string;
  viewKey?: ViewKey;
  data?: { level?: string };
  icon?: string;
  color?: string;
  badge?: string;
  disabled?: boolean;
}

export interface MobileMenuSection {
  key: string;
  label: string;
  items: MobileMenuItem[];
}

export interface NavbarNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  isArchived: boolean;
  isFollowing: boolean;
  icon: string;
  color: string;
  bgColor: string;
}
