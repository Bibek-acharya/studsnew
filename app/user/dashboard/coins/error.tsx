"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

/**
 * The route-level error boundary for the wallet.
 *
 * Deliberately NOT the `rounded-2xl` red-card shape of
 * `app/user/dashboard/error.tsx`, and not a full-screen takeover either. That
 * file's version is a whole-dashboard failure state; this one is scoped to a
 * segment inside a dashboard that is otherwise working, so replacing the
 * sidebar, header and every other section with a centred error card overstates
 * what broke. The gray / `rounded-md` dialect is the one 06 §0.3 settles on, and
 * a `bg-gray-50` ground matches the dashboard shell it sits inside.
 *
 * `console.error` rather than a silent catch: this is the same convention
 * `app/user/dashboard/error.tsx:8` uses, and a boundary that swallows its error
 * is a boundary nobody debugs.
 *
 * The copy makes no claim about the balance. This boundary fires for a render
 * throw, not a failed read — a failed read is handled in-page with its own
 * "nothing has changed on your account" wording — so promising the balance is
 * intact here would be asserting something this component cannot see.
 */
export default function CoinsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Wallet error:", error);
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
            Something went wrong showing your StudsTokens. Try again.
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