"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

/**
 * The route-level error boundary for the referral page.
 *
 * The same shape and the same reasoning as `app/user/dashboard/coins/error.tsx`:
 * a gray/`rounded-md` red card rather than the `rounded-2xl` full-takeover of
 * `app/user/dashboard/error.tsx`, because that file's version is a
 * whole-dashboard failure and this one is scoped to a segment inside a dashboard
 * that is otherwise working. Overstating what broke is its own kind of lie.
 *
 * `console.error` rather than a silent catch, matching both other boundaries in
 * this segment.
 *
 * The copy claims nothing about the balance, the code or the referrals. This
 * boundary fires for a render throw, not for a failed read — a failed read is
 * handled in-page, where the wording can be about what actually happened — so
 * promising an intact account here would be asserting something this component
 * cannot see.
 */
export default function ReferralError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Referral page error:", error);
  }, [error]);

  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-5">
      <div className="flex items-start gap-3">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-red-50 text-red-700 ring-1 ring-red-200"
          aria-hidden="true"
        >
          <AlertTriangle size={16} />
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-gray-900">
            This page did not load
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Something went wrong showing your referral details. Try again.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-3 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
