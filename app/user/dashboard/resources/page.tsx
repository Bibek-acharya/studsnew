import { redirect } from "next/navigation";

/**
 * The old dashboard "Study Resources" route, now a redirect.
 *
 * It served `ResourcesSection` — 43 lines of hardcoded mock data (six fake
 * resources, "Dr. Academic", "Prof. Johnson") on a page no sidebar item linked
 * to. 06 §2.3 moves the surface to `/user/dashboard/coins` and leaves this as a
 * redirect rather than deleting the route, because the URL may already be
 * bookmarked and a 404 on a dashboard link is worse than a bounce.
 *
 * The reason for the move rather than repurposing in place: a URL reading
 * `/resources` that serves a wallet is a permanent, indexable lie, and four
 * lines of redirect is cheap next to that.
 */
export const metadata = {
  title: "StudsTokens",
};

export default function Page() {
  redirect("/user/dashboard/coins");
}