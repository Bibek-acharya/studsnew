"use client";

import { useEffect, useState } from "react";
import { FolderOpen, Loader2, ImageIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { publicResultApi, PublishedResultScholarship } from "@/services/scholarshipProviderApi";
import Image from "next/image";

export default function ScholarshipResultListing() {
  const [scholarships, setScholarships] = useState<PublishedResultScholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

      <section >
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {scholarships.map((s) => (
              <div
                key={s.id}
                className="relative flex flex-col bg-white rounded-md border border-gray-200/80 transition-all duration-300 p-3 group cursor-pointer"
                onClick={() => router.push(`/scholarship-result/${s.slug || s.id}`)}
              >
                {/* Banner Image */}
                <div className="h-32 w-full bg-gray-100 relative overflow-hidden rounded-md mb-3">
                  {s.image_url || s.banner_background_image_url ? (
                    <img
                      src={s.banner_background_image_url || s.image_url}
                      alt={s.title || ""}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full p-3 flex items-start bg-linear-to-br from-gray-200 to-gray-50">
                      <span className="text-gray-600 text-[13px] font-medium flex items-start gap-1.5 leading-snug">
                        <ImageIcon className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                        {s.title || "Scholarship"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col grow px-1">
                  {/* Title */}
                  <h3 className="font-bold text-[16px] leading-tight text-slate-900 mb-1 hover:text-brand-blue line-clamp-2">
                    {s.title || "Scholarship"}
                  </h3>

                  {/* Organization */}
                  <div className="flex items-center gap-1.5 text-[12.5px] text-gray-500 mb-3.5 line-clamp-1">
                    {s.provider_name || "Organization"}
                  </div>
                  {/* View Result Button */}
                  <div className="flex items-center gap-2 mt-auto">
                    <button
                      onClick={(e) => { e.stopPropagation(); router.push(`/scholarship-result/${s.slug || s.id}`); }}
                      className="w-full py-2 text-[13px] font-semibold text-white bg-brand-blue rounded-md hover:bg-[#0000cc] transition-colors"
                    >
                      View Result
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
