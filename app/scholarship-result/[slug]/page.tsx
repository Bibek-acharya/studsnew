"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ScholarshipResultCheckPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  const router = useRouter();

  const [rollNumber, setRollNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [error, setError] = useState("");

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const qs = new URLSearchParams({
      roll: rollNumber.trim(),
      dob: dateOfBirth,
    });
    router.push(`/scholarship-result/${slug}/result?${qs}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900 lg:flex-row">
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-4 bg-white">
        <div className="mx-4 my-4 h-full w-full overflow-hidden rounded-md shadow-lg bg-[#0000ff] opacity-20" />
      </div>

      <div className="flex w-full items-center justify-center p-6 sm:p-12 lg:w-1/2">
        <div className="w-full max-w-105">
          <div className="mb-6 flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 opacity-80 transition-opacity hover:opacity-100">
              <img
                src="/studsphere.png"
                alt="StudsSphere"
                className="h-12 w-auto"
              />
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="mb-2 text-[32px] font-bold tracking-tight text-[#111827]">
              Check Your Result
            </h1>
            <p className="text-[15px] text-gray-500">
              Enter your roll number and date of birth to check your result for
              this scholarship.
            </p>
          </div>

          <form onSubmit={handleCheck} className="w-full space-y-6">
            <div>
              <label
                htmlFor="rollNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Roll Number
              </label>
              <input
                id="rollNumber"
                type="text"
                required
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="Enter your roll number"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
              />
            </div>

            <div>
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-medium text-gray-700"
              >
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                type="date"
                required
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
              />
            </div>

            {error && (
              <p className="text-sm font-medium text-red-600">{error}</p>
            )}

            <button
              type="submit"
              className="w-full rounded-md bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
            >
              Check Result
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/scholarship-result"
              className="text-sm font-medium text-brand-blue underline underline-offset-2 hover:text-blue-800"
            >
              Back to scholarship list
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
