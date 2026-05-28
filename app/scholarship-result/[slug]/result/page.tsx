"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ScholarshipResultPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  const searchParams = useSearchParams();
  const rollNumber = searchParams.get("roll") || "";
  const dateOfBirth = searchParams.get("dob") || "";

  if (!rollNumber || !dateOfBirth) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9ca3af"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto mb-4"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-lg font-semibold text-gray-700">
            No credentials provided
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Please enter your roll number and date of birth.
          </p>
          <Link
            href={`/scholarship-result/${slug}`}
            className="mt-4 inline-block text-sm font-medium text-brand-blue underline underline-offset-2"
          >
            Go back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#9ca3af"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mx-auto mb-4"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
        <p className="text-lg font-semibold text-gray-700">
          No result found
        </p>
        <p className="mt-1 text-sm text-gray-500">
          We could not find a result matching the provided credentials. Please
          verify your roll number and date of birth.
        </p>
        <Link
          href={`/scholarship-result/${slug}`}
          className="mt-4 inline-block text-sm font-medium text-brand-blue underline underline-offset-2"
        >
          Try again
        </Link>
      </div>
    </div>
  );
}
