import type { Metadata } from "next";
import ReferralSection from "@/components/user/dashboard/sections/ReferralSection";

/**
 * `/user/dashboard/referral` — the student's own referral code and the state of
 * every invite they have sent.
 *
 * ## Why here and not at the `/referral` in 06 §6
 *
 * 06 §6 names `/referral`. That path would be served to signed-out visitors,
 * because `middleware.ts` only gates `/user/dashboard/:path*`, and it would
 * therefore render an error to somebody who has not signed in yet. Every other
 * per-student surface in this app lives under the dashboard for the same reason,
 * and the dashboard `Sidebar.tsx` is how a signed-in student reaches their own
 * pages — a referral page with no nav item is a dead end, which is the exact
 * failure the previous slice fixed for the anti-dead-end link.
 *
 * `/referral` still resolves, by redirecting here, so the URL in the spec and
 * any link already in a chat both land somewhere.
 *
 * ## Why the data read is in the section
 *
 * The same reason as the wallet: §2.4 is per-user, the bearer token lives in
 * `localStorage`, and no server component in this app can reach it.
 * `apiRequest` attaches the token client-side and there is no server-side
 * session helper to substitute for it. One read, on the page that exists to
 * show it.
 *
 * Static, like every other dashboard route: the shell and this file render
 * identically for every visitor, and the numbers arrive in a client read.
 *
 * Not indexed: every figure on it belongs to one student.
 */
export const metadata: Metadata = {
  title: "Invite a friend",
  robots: { index: false, follow: false },
};

export default function ReferralPage() {
  return <ReferralSection />;
}
