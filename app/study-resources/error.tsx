"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function StudyResourcesError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("Study resources error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#f6f8fc] px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-[0_20px_60px_-40px_rgba(15,23,42,0.6)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <AlertTriangle className="h-7 w-7" aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-xl font-bold text-slate-950">
          We could not load this page
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          The study resource service did not respond as expected. Please try
          again in a moment.
        </p>
        <button
          type="button"
          onClick={unstable_retry}
          className="mt-6 rounded-xl bg-brand-blue px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
