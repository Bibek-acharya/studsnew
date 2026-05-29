"use client";

import React, { useEffect, useState } from "react";
import { FolderOpen, Loader2 } from "lucide-react";
import Link from "next/link";
import { publicResultApi, PublishedResultScholarship } from "@/services/scholarshipProviderApi";

export default function ScholarshipResultListing() {
  const [scholarships, setScholarships] = useState<PublishedResultScholarship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await publicResultApi.getScholarships();
        setScholarships(data || []);
      } catch {
        setScholarships([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="mx-auto mb-4 flex w-full max-w-350 flex-col gap-10 py-4 lg:gap-12 sm:py-6 lg:py-4">
      <section className="rounded-md bg-brand-blue py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
            Scholarship Results
          </h1>
          <p className="mx-auto max-w-2xl text-[13px] text-gray-200 md:text-sm lg:text-base">
            Select a scholarship below to check your result. Enter your roll
            number to view your outcome and interview details.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : scholarships.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <FolderOpen className="mb-4 h-36 w-36 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">
              No scholarships available
            </h3>
            <p className="mt-1 mb-6 text-sm text-gray-500">
              There are no scholarships with published results at this time. Please
              check back later.
            </p>
            <Link
              href="/scholarship-finder"
              className="rounded-md bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
            >
              Find Scholarship
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {scholarships.map((s) => (
              <Link
                key={s.id}
                href={`/scholarship-result/${s.slug || s.id}`}
                className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-brand-blue"
              >
                {s.image_url && (
                  <img
                    src={s.image_url}
                    alt={s.title || ""}
                    className="mb-3 h-12 w-12 rounded-lg object-cover"
                  />
                )}
                <h3 className="font-semibold text-gray-900 group-hover:text-brand-blue transition-colors">
                  {s.title || "Scholarship"}
                </h3>
                {s.provider_name && (
                  <p className="mt-1 text-sm text-gray-500">{s.provider_name}</p>
                )}
                <span className="mt-3 inline-block text-xs font-medium text-brand-blue">
                  Check Result &rarr;
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
