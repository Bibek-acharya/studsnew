// Deep-link route mapping: (role, Data.nav) → concrete route (doc 13 §6).
// Backend links arrive interpolated already — this only remaps prefixes and
// translates provider legacy slugs; anything without a real route falls back
// to the role's notifications page.
export type Role = "user" | "institution" | "provider" | "superadmin";

const PROVIDER_DASHBOARD = "/scholarship-provider/dashboard";

// Per-role "no deep link" destinations: the page that shows the inbox.
// Provider/superadmin inboxes are state-based sections of their dashboards.
const ROLE_FALLBACK: Record<Role, string> = {
  user: "/notifications",
  institution: "/institution-zone/dashboard/notifications",
  provider: PROVIDER_DASHBOARD,
  superadmin: "/superadmin/dashboard",
};

// Provider-only legacy nav slugs (doc 13 §6). Provider navigation is
// state-based on the single dashboard page, so all resolve to it.
const PROVIDER_LEGACY_SLUGS = new Set([
  "org-profile",
  "applications",
  "manage-scholarships",
  "sec-dashboard",
  "assign-access",
  "settings",
  "news-directory",
  "events-directory",
  "blog-directory",
  "calendar",
  "interviews",
]);

// Legacy directory slugs shared with the institution zone.
const INSTITUTION_DIRECTORY_ROUTES: Record<string, string> = {
  "news-directory": "/institution-zone/dashboard/news/directory",
  "events-directory": "/institution-zone/dashboard/events/directory",
  "blog-directory": "/institution-zone/dashboard/blogs/directory",
};

// Link prefixes whose target routes actually exist in app/ — pass through.
// `/campus-forum/post/<id>` is deliberately absent: the real post route is
// `/campus-forum/[id]`, so the dead prefix falls back like any unknown link.
const PASS_THROUGH_PREFIXES = [
  "/scholarship-pay/",
  "/campus-forum",
  "/user/dashboard",
];

export function resolveRoute(role: Role, link: string): string {
  if (!link) return ROLE_FALLBACK[role];
  if (role === "provider" && PROVIDER_LEGACY_SLUGS.has(link)) {
    return PROVIDER_DASHBOARD;
  }
  if (role === "institution" && INSTITUTION_DIRECTORY_ROUTES[link]) {
    return INSTITUTION_DIRECTORY_ROUTES[link];
  }
  if (link.startsWith("/campus-forum/post/")) return ROLE_FALLBACK[role];
  if (PASS_THROUGH_PREFIXES.some((p) => link.startsWith(p))) return link;
  return ROLE_FALLBACK[role];
}
