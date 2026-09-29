"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";

/**
 * The route-level error screen for the study-resource collections.
 *
 * Realigned to the page dialect the catalogue renders — `bg-gray-50` ground,
 * `rounded-md` panel, `border-gray-200`, `brand-blue` action — so a failed route
 * looks like the page it was trying to become rather than like a different
 * product. The previous version carried the `bg-[#f6f8fc]` / `rounded-3xl` /
 * slate treatment that exists nowhere else in the feature (06 §12).
 *
 * Rose is kept for the icon, because rose is already this product's "something
 * went wrong" signal and red is reserved for destructive states. The copy is
 * deliberately plain: no apology, no cause, and no promise about when it will
 * work, since none of those are true.
 */
export default function StudyResourcesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Study resources error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4 py-16">
      <div className="w-full max-w-md rounded-md border border-gray-200 bg-white p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-rose-50 text-rose-600">
          <RotateCcw className="h-7 w-7" aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-xl font-bold text-gray-900">
          We could not load this page
        </h1>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          The study resource service did not respond as expected. Please try
          again in a moment.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-brand-blue px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Try again
        </button>
      </div>
    </div>
  );
}
