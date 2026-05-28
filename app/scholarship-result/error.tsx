"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900">
          Something went wrong
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          An unexpected error occurred while loading scholarship results. Please
          try again.
        </p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="rounded-md bg-brand-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            Try again
          </button>
          <Link
            href="/scholarship-result"
            className="text-sm font-medium text-brand-blue underline underline-offset-2"
          >
            Back to scholarship list
          </Link>
        </div>
      </div>
    </div>
  );
}
