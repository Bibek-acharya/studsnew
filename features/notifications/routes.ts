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

// Legacy /user/* paths from the registry whose real pages live under
// /user/dashboard — remapped, user role only.
const USER_LINK_REMAPS: Record<string, string> = {
  "/user/calendar": "/user/dashboard/calendar",
  "/user/counselling": "/user/dashboard/counselling",
  "/user/settings": "/user/dashboard/settings",
};

// Public-template prefixes whose target routes exist in app/ — pass through
// for any role. Two registry subpaths have no real page and are excluded:
// `/campus-forum/post/<id>` (real post route is `/campus-forum/[id]`) and
// `/user/dashboard/admit-card` (no such page; handled in the user branch).
const PASS_THROUGH_PREFIXES = [
  "/scholarship-pay/",
  "/campus-forum",
  "/careers",
];

const DEAD_PREFIXES = ["/campus-forum/post/", "/user/dashboard/admit-card"];

export function resolveRoute(role: Role, link: string): string {
  if (!link) return ROLE_FALLBACK[role];
  if (role === "provider" && PROVIDER_LEGACY_SLUGS.has(link)) {
    return PROVIDER_DASHBOARD;
  }
  if (role === "institution" && INSTITUTION_DIRECTORY_ROUTES[link]) {
    return INSTITUTION_DIRECTORY_ROUTES[link];
  }
  if (DEAD_PREFIXES.some((p) => link.startsWith(p))) return ROLE_FALLBACK[role];
  const remap = USER_LINK_REMAPS[link];
  if (remap) return role === "user" ? remap : ROLE_FALLBACK[role];
  if (role === "user" && (link === "/user/dashboard" || link.startsWith("/user/dashboard/"))) {
    return link;
  }
  if (PASS_THROUGH_PREFIXES.some((p) => link.startsWith(p))) return link;
  return ROLE_FALLBACK[role];
}
