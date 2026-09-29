"use client";

/**
 * The earn routes, rendered from the server's list and nothing else.
 *
 * This is the highest-stakes list in the feature and the one most likely to rot.
 * If it were written here, it would be a copy of the economy config, and the
 * first thing to change is the value — which is exactly the drift 06 §5 warns
 * about: a list copied out of configuration tells a student with a finished
 * profile to finish it, and the student is the one who looks wrong. So the
 * list, the labels, and the numbers all come from `ways_to_earn` in the 402/423
 * body, and this component only decides order and layout.
 *
 * Ranking (06 §5): a route that can actually close the gap on its own comes
 * first, largest first; the rest follow by value. So a profile with 15 coins
 * left leads a 22-coin gap, and a 60-coin referral that takes a week does not
 * jump ahead of it just for being larger.
 *
 * "Not launched" routes are rendered, unlinked, rather than dropped. A silent
 * omission looks like a bug; a stated unavailability looks like a fact. The
 * server sends them in a separate array precisely so the two cannot be confused.
 */
import React from "react";
import { FileUp, UserCheck, UserPlus } from "lucide-react";
import Link from "next/link";
import { fmtCoins } from "@/components/coins/useCoinState";
import type { UnavailableRoute, WayToEarn } from "@/services/coinsApi";

/** The one link that ends a dead end. Present on every earn surface. */
export const AFFORDABLE_CATALOGUE_HREF = "/study-resources?affordable=1";

const ROUTE_ICON: Record<string, typeof UserPlus> = {
  REFERRAL: UserPlus,
  PROFILE: UserCheck,
  UPLOAD: FileUp,
};

const ROUTE_HREF: Record<string, string> = {
  PROFILE: "/user/dashboard/profile",
  REFERRAL: "/user/dashboard/coins",
  UPLOAD: "/user/dashboard/coins",
};

const ROUTE_CTA: Record<string, string> = {
  REFERRAL: "Invite",
  PROFILE: "Profile",
  UPLOAD: "Upload",
};

/**
 * Order: routes that close the gap alone, biggest first; then the rest, biggest
 * first. Stable within each group so the server's order is preserved where the
 * rule does not decide.
 */
export function rankWaysToEarn(
  ways: WayToEarn[],
  shortfall: number,
): WayToEarn[] {
  const closes = ways.filter((way) => way.potential >= shortfall);
  const rest = ways.filter((way) => way.potential < shortfall);
  closes.sort((a, b) => b.potential - a.potential);
  rest.sort((a, b) => b.potential - a.potential);
  return [...closes, ...rest];
}

export default function EarnRoutes({
  shortfall,
  waysToEarn,
  unavailableRoutes = [],
  className = "",
}: {
  /** The gap, in coins. Decides the ranking, never a displayed value. */
  shortfall: number;
  waysToEarn: WayToEarn[];
  unavailableRoutes?: UnavailableRoute[];
  className?: string;
}) {
  const ranked = rankWaysToEarn(waysToEarn, Math.max(0, shortfall));
  if (ranked.length === 0 && unavailableRoutes.length === 0) return null;

  return (
    <>
      {ranked.length > 0 && (
        <ul className={`mt-4 divide-y divide-gray-100 rounded-md border border-gray-200 ${className}`}>
          {ranked.map((way) => {
            const Icon = ROUTE_ICON[way.code] ?? UserPlus;
            const href = ROUTE_HREF[way.code];
            return (
              <li
                key={way.code}
                className="flex flex-col items-start gap-3 p-3 sm:flex-row sm:items-center"
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-700"
                  aria-hidden="true"
                >
                  <Icon size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    <span className="truncate">{way.label}</span>
                    <span className="ml-2 shrink-0 text-xs font-bold tabular-nums text-gray-500">
                      +{fmtCoins(way.potential)} StudsTokens
                    </span>
                  </p>
                </div>
                {href && (
                  <Link
                    href={href}
                    className="shrink-0 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
                  >
                    {ROUTE_CTA[way.code] ?? "Open"}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {unavailableRoutes.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {unavailableRoutes.map((route) => (
            <li key={route.code} className="flex items-center gap-2 text-xs text-gray-500">
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300"
                aria-hidden="true"
              />
              <span className="truncate">
                {route.label} is not available yet
              </span>
            </li>
          ))}
        </ul>
      )}

      <Link
        href={AFFORDABLE_CATALOGUE_HREF}
        className="mt-3 flex items-center gap-2 rounded-md bg-gray-50 px-3 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
      >
        Browse resources you can unlock now
      </Link>
    </>
  );
}
