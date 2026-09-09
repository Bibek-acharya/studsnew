import type { LucideIcon } from "lucide-react";
import {
  Bell,
  CalendarDays,
  FileText,
  GraduationCap,
  Heart,
  Mail,
  MessageCircle,
  Newspaper,
  Settings,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

export interface NotificationStyle {
  icon: LucideIcon;
  color: string;
  bg: string;
}

// One accent tint per registry category (doc 13 §5) — replaces per-component
// SVG injection and DB-persisted styles.
const STYLES: Record<string, NotificationStyle> = {
  application: { icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
  scholarship: {
    icon: GraduationCap,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  counselling: {
    icon: CalendarDays,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  messaging: {
    icon: MessageCircle,
    color: "text-sky-600",
    bg: "bg-sky-50",
  },
  message: { icon: Mail, color: "text-sky-600", bg: "bg-sky-50" },
  content: { icon: Newspaper, color: "text-orange-600", bg: "bg-orange-50" },
  community: { icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
  social: { icon: Heart, color: "text-pink-600", bg: "bg-pink-50" },
  account: { icon: UserRound, color: "text-teal-600", bg: "bg-teal-50" },
  system: { icon: Settings, color: "text-gray-600", bg: "bg-gray-100" },
  moderation: {
    icon: ShieldCheck,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
};

// Public banner `type` values map the same way (doc 13 §5).
const ALIASES: Record<string, string> = {
  event: "counselling",
  news: "content",
  blog: "content",
  entrance: "counselling",
  admission: "application",
  info: "system",
};

export const DEFAULT_STYLE: NotificationStyle = {
  icon: Bell,
  color: "text-gray-600",
  bg: "bg-gray-100",
};

export function resolveIcon(
  category?: string,
  eventKey?: string,
): NotificationStyle {
  let key: string | undefined = category;
  if (!key || !STYLES[key]) {
    // Unknown legacy.* keys get the content-ish default.
    key = eventKey?.startsWith("legacy.") ? "content" : ALIASES[key ?? ""];
  }
  return (key && STYLES[key]) || DEFAULT_STYLE;
}
