"use client";

/**
 * The student's own referral code and the share row — 06 §6, verbatim on markup.
 *
 * ## The link is the server's, never ours
 *
 * `referral_link` arrives from §2.4 and is used exactly as sent. This component
 * does not build a link from `referral_code`, and the reason is the one that
 * matters for a link whose only job is to be handed to another person: a client
 * that concatenated a host and a code would produce a URL that works on a
 * developer's machine and 404s in production, and the student who finds that out
 * is the friend, on their phone, having already been told the code works.
 *
 * `06` §6 says the link is `https://<host>/register?ref=<CODE>` and `03` §2.4's
 * example is `https://studsphere.com/r/STU-7K2M9Q`. Both are satisfied by
 * deferring to the server: whatever host and shape it sends is the one that
 * routes, and `/r/[code]` normalises whatever arrives and forwards it to
 * `/register?ref=`.
 *
 * ## Share targets, in 06 §6's order
 *
 * Web Share API when the browser has it — on a phone that is the path nearly
 * every student will actually take, and it puts the app picker in front of them
 * rather than a list of four logos. Then WhatsApp and Viber, which are the
 * channels this audience uses, then Facebook because referral links really are
 * shared there in Nepal, then email, then copy link as the floor.
 *
 * `navigator.share` is feature-detected rather than assumed, and its absence
 * simply reveals the rest of the row. Every target is also reachable by the
 * Copy link button, so no share path is a dead end on a browser without the Web
 * Share API.
 */
import React, { useCallback, useState } from "react";
import { Check, Copy, Link2, Mail, Share2 } from "lucide-react";
import { toast } from "sonner";
import { COPY } from "@/components/coins/referralView";

/** Swap `Copy` for `Check` for this long, per §6. */
const COPIED_MS = 1600;

/**
 * Copy without a clipboard API.
 *
 * `navigator.clipboard` is unavailable on an insecure origin, which includes a
 * plain-HTTP LAN address a student might genuinely load the site on, and it
 * throws when a permission is denied. A referral code that cannot be copied
 * defeats the surface, so there is a fallback and it is never announced.
 */
async function copyText(value: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // Fall through to the textarea path.
  }
  try {
    const area = document.createElement("textarea");
    area.value = value;
    // Kept in the layout but not visible, because a textarea that reflows the
    // card as it is created is its own visual glitch.
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

interface ShareTarget {
  id: string;
  label: string;
  href: string | null;
  /** Web Share API carries the same text, so it is not a URL target. */
  native?: boolean;
  icon: typeof Share2;
}

export default function ReferralCodeShare({
  code,
  link,
}: {
  /** Shown exactly as the server stores it. Never reformatted. */
  code: string;
  /** The server's share link. Empty means the server sent none. */
  link: string;
}) {
  const [copied, setCopied] = useState<"code" | "link" | null>(null);

  const message = COPY.shareMessage.replace("{CODE}", code).replace(
    "{LINK}",
    // A share message with an empty link reads as a mistake, so the code alone
    // is better than a dangling colon. The server normally sends one; this is
    // the degraded branch.
    link || "the site",
  );

  const handleCopy = useCallback(
    async (what: "code" | "link", value: string, toastMessage: string) => {
      const ok = await copyText(value);
      if (!ok) {
        // No clipboard at all: say so rather than showing a `Copied` state that
        // did not happen.
        toast.error("Copying did not work. Select the code and copy it.");
        return;
      }
      setCopied(what);
      toast.success(toastMessage);
      window.setTimeout(() => setCopied(null), COPIED_MS);
    },
    [],
  );

  /**
   * The Web Share API rejects when the student dismisses the picker, which is
   * the common case and not an error. Left unhandled it surfaces as an
   * unhandled rejection in the console, and the AGENTS definition of done
   * includes no console errors — so the cancel is swallowed and anything else is
   * not, since a genuine failure here has no useful recovery.
   */
  const handleNativeShare = useCallback(() => {
    navigator.share({ text: message, url: link || undefined }).catch((error) => {
      if ((error as { name?: string })?.name === "AbortError") return;
      console.error("Web Share API failed:", error);
    });
  }, [message, link]);

  const encoded = encodeURIComponent(message);
  const targets: ShareTarget[] = [
    {
      id: "native",
      label: "Share",
      href: null,
      native: true,
      icon: Share2,
    },
    {
      id: "whatsapp",
      label: COPY.shareWhatsApp,
      href: link ? `https://wa.me/?text=${encoded}` : null,
      icon: Share2,
    },
    {
      id: "viber",
      label: COPY.shareViber,
      href: link ? `viber://chat?text=${encoded}` : null,
      icon: Share2,
    },
    {
      id: "facebook",
      label: COPY.shareFacebook,
      // §6 names `m.me/`. The `?text=` is not a departure from that, it is what
      // makes the button do its job: `m.me/` on its own opens an empty composer,
      // and a share button that shares nothing is a broken button.
      href: link ? `https://m.me/?text=${encoded}` : null,
      icon: Share2,
    },
    {
      id: "email",
      label: COPY.shareEmail,
      href: link
        ? `mailto:?subject=${encodeURIComponent("Studsphere")}&body=${encoded}`
        : null,
      icon: Mail,
    },
  ];

  // `navigator.share` is checked at render rather than in an effect: whether the
  // button is there is not changing, and an effect would put a frame of the
  // wrong row on screen.
  const canShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  const visible = targets.filter((target) => {
    if (target.native) return canShare;
    // A target with no link would open an empty chat, which is worse than not
    // offering it. The code alone is still shareable by hand and by Copy.
    return target.href !== null;
  });

  return (
    <div className="rounded-md border border-gray-200 bg-white p-5">
      <p className="text-sm font-semibold text-gray-900">{COPY.headline}</p>

      <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-gray-500">
        {COPY.codeLabel}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {/*
          §6's exact treatment. `font-mono` and the wide tracking are doing real
          work: a code transcribed from a screen is the main way it goes wrong,
          and a mono-spaced, letter-spaced string is materially easier to read
          aloud character by character than a proportional one.
        */}
        <code className="select-all rounded-md border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-sm font-bold tracking-[0.18em] text-gray-900">
          {code}
        </code>
        <button
          type="button"
          onClick={() =>
            void handleCopy("code", code, COPY.copiedToast)
          }
          aria-label={`${COPY.copy} your referral code`}
          title={COPY.copy}
          className="inline-flex items-center gap-1.5 rounded-md bg-brand-blue px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
        >
          {copied === "code" ? (
            <Check size={13} aria-hidden="true" />
          ) : (
            <Copy size={13} aria-hidden="true" />
          )}
          {copied === "code" ? COPY.copied : COPY.copy}
        </button>
      </div>

      <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-gray-500">
        {COPY.shareHeading}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {visible.map((target) => {
          const Icon = target.icon;
          const className =
            "inline-flex h-8 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2";
          if (target.native) {
            return (
              <button
                key={target.id}
                type="button"
                onClick={handleNativeShare}
                aria-label={`${COPY.shareHeading} your referral link`}
                title={COPY.shareHeading}
                className={className}
              >
                <Icon size={13} aria-hidden="true" />
                {target.label}
              </button>
            );
          }
          return (
            <a
              key={target.id}
              href={target.href ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${COPY.shareHeading} on ${target.label}`}
              title={target.label}
              className={className}
            >
              <Icon size={13} aria-hidden="true" />
              {target.label}
            </a>
          );
        })}

        {/* The floor. Present even with no share link at all, because a code is
            still something a student can send by hand. */}
        <button
          type="button"
          onClick={() =>
            void handleCopy("link", link || code, COPY.linkCopiedToast)
          }
          aria-label={COPY.copyLink}
          title={COPY.copyLink}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
        >
          {copied === "link" ? (
            <Check size={13} aria-hidden="true" />
          ) : (
            <Link2 size={13} aria-hidden="true" />
          )}
          {copied === "link" ? COPY.copied : COPY.copyLink}
        </button>
      </div>
    </div>
  );
}
