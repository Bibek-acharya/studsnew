import { redirect } from "next/navigation";
import type { Metadata } from "next";

/**
 * `/referral` — 06 §6's URL, resolved to the page that exists.
 *
 * ## Why this is a redirect and not a page
 *
 * 06 §6 puts the referral surface at `/referral`. The page is at
 * `/user/dashboard/referral` instead, for reasons set out in that route's header:
 * the endpoint requires auth, `middleware.ts` only gates
 * `/user/dashboard/:path*`, and the dashboard `Sidebar.tsx` is the navigation a
 * signed-in student already uses.
 *
 * A root-level `/referral` therefore has nothing to render — it is the same
 * surface under a URL that bypasses the auth gate and the shell. Rather than
 * leave the spec's URL a 404 for anyone who has read the spec or followed a link
 * pasted from it, it redirects.
 *
 * ## The signed-out case
 *
 * This path is outside the middleware matcher, so the redirect fires for
 * everybody. A signed-in student lands on the page. A signed-out one lands on
 * `/login?redirect=/user/dashboard/referral`, because the dashboard middleware
 * is what gates the destination — which is the correct outcome, and the reason
 * the destination is under the dashboard rather than here.
 *
 * Temporary, not permanent: a permanent redirect would be cached by browsers
 * indefinitely, and a student who is signed out at the moment they follow the
 * link would be pinned to a cached 307/308 with no way back into the flow.
 *
 * Left to the default rendering mode rather than forced dynamic: nothing here
 * reads a request, a cookie or a param, so a prerendered 307 is served straight
 * from the cache and the destination's middleware still does the auth work. The
 * one thing this route does NOT get is a `loading.tsx`/`error.tsx` pair — it has
 * no render to cover and nothing that can fail, so a boundary here would be
 * unreachable code. `/r/[code]` is the same on that count.
 */
export const metadata: Metadata = {
  title: "Invite a friend",
  robots: { index: false, follow: false },
};

export default function ReferralAliasPage() {
  redirect("/user/dashboard/referral");
}
