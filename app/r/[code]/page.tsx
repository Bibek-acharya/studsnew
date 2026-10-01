import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { asUsableReferralCode } from "@/lib/referralCode";

/**
 * `/r/[code]` — the invite capture route.
 *
 * ## Why this redirects and does not render
 *
 * A link whose only job is to capture has nothing to show. Rendering a
 * "we have your invite, carry on" screen would mean a page that exists only to
 * be left, and a client-side `router.push` to leave it — which is a redirect
 * with an extra frame and a flash of chrome in front of it. The server can do it
 * in one response, so it does, and the student's first and only sight of this
 * URL is the page they actually came for.
 *
 * `/study-resources/can-unlock` is the same argument reached from the other
 * direction: that route exists as its own URL rather than as a `searchParams`
 * branch precisely so the capture stays out of a page's static rendering.
 *
 * ## Why the code is normalised here and not at the form
 *
 * This is the last point at which the code is a piece of text somebody else
 * typed. By the time the form submits, it is a string in a request body, and
 * anything lost on the way — a lowercase code, a space from a chat client, an
 * `O` read for a `0` — is lost silently, because the server sees a well-formed
 * request carrying a code that matches nothing.
 *
 * So it is normalised against the server's own rule here
 * (`lib/referralCode.ts`, transcribed from `NormalizeReferralCode`) and the
 * canonical form is what travels in the query string. `RegisterForm` normalises
 * again before it sends, which is free: the operation is idempotent, and a
 * second pass is what protects a student who arrives at `/register?ref=` by
 * typing rather than by clicking.
 *
 * ## An invalid code does not stop anybody
 *
 * Both branches land on `/register`. A dead end here would be the worst possible
 * place for one: the student is one step from an account, the friend who sent
 * the link is not present to explain what went wrong, and the code is not the
 * thing they came for. They came for the platform.
 *
 * When the code cannot be a code, the raw segment is forwarded rather than
 * dropped, because that is the only way `/register` can tell the difference
 * between "no invite" and "an invite link that did not work" — and only the
 * second one is worth saying out loud. It is forwarded through
 * `encodeURIComponent`, because an unvalidated path segment is going into a
 * redirect target and must not be able to terminate the query string or the
 * path.
 *
 * Nothing is stored server-side and no session is created. The referral is
 * attributed at user creation on the server, which is the only place a
 * student-to-student relationship can be trusted; a cookie minted here would be
 * a second, weaker claim on the same fact.
 */

/** Never indexed, and there is nothing here to describe. */
export const metadata: Metadata = {
  title: "Join Studsphere",
  robots: { index: false, follow: true },
};

/**
 * Server-rendered on demand, and deliberately not `generateStaticParams`.
 *
 * A referral code is uniform over 32^10 ≈ 1.1 × 10^15 values
 * (`internal/shared/utils/referral_code.go`). There is no enumerable set to
 * prerender, no set to enumerate at build time without inventing one, and a
 * `dynamicParams = false` would turn every real invite link into a 404 — the
 * failure this route exists to prevent. The route also performs a per-request
 * redirect, which is request-time work by nature.
 */
export const dynamic = "force-dynamic";

export default async function InviteCapturePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code: rawSegment } = await params;
  const raw = typeof rawSegment === "string" ? rawSegment : "";
  const code = asUsableReferralCode(raw);

  // A usable code travels in canonical form. An unusable one travels as sent,
  // so the form can say the link did not work instead of silently behaving as
  // though no invite was ever followed.
  const target = code
    ? `/register?ref=${encodeURIComponent(code)}`
    : `/register?ref=${encodeURIComponent(raw)}`;

  redirect(target);
}
