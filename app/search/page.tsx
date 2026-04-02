"use client";

import React, { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchItem, searchDatabase, searchIcons } from "@/utils/searchDatabase";

export default function SearchPage() {
  const params = useSearchParams();
  const router = useRouter();
  const q = params.get("q") || "";
  const loc = params.get("loc") || "";

  const results = useMemo(() => {
    if (!q.trim()) return [];

    const keywords = q
      .toLowerCase()
      .split(" ")
      .filter((k: string) => k.length > 0);

    const filtered = searchDatabase.filter((item: SearchItem) => {
      const searchableText = `${item.title} ${item.type}`.toLowerCase();
      return (
        keywords.some((keyword: string) => searchableText.includes(keyword)) ||
        keywords.every((keyword: string) => searchableText.includes(keyword))
      );
    });

    const locMatchStr =
      loc !== "Detect Location" && loc !== "" ? loc.toLowerCase() : "";
    if (locMatchStr) {
      const locParts = locMatchStr
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      filtered.sort((a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        let aScore = 0;
        let bScore = 0;

        locParts.forEach((part) => {
          if (aTitle.includes(part)) aScore += 1;
          if (bTitle.includes(part)) bScore += 1;
        });

        return bScore - aScore;
      });
    }

    return filtered;
  }, [q, loc]);

  const handleDetailedView = (item: SearchItem) => {
    if (item.type === "College" || item.type === "University") {
      router.push(`/collegeDetails?name=${encodeURIComponent(item.title)}`);
    } else if (item.type === "Scholarship") {
      router.push(`/scholarshipDetails?name=${encodeURIComponent(item.title)}`);
    } else if (item.type === "Program" || item.type === "Course") {
      router.push(`/courseDetails?name=${encodeURIComponent(item.title)}`);
    } else {
      router.push("/");
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-7xl p-6 md:p-10">
      {!q.trim() ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900">
            Find Your Dream Path in Nepal
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-500">
            Use the search bar above to discover top colleges, programs, admissions,
            and scholarships tailored for you.
          </p>
        </div>
      ) : (
        <div>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Results for &quot;{q}&quot; {loc && loc !== "Detect Location" && `near ${loc}`}
            </h2>
            <div className="text-sm font-medium text-gray-500">
              {results.length} result{results.length !== 1 ? "s" : ""} found
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.length === 0 ? (
              <div className="col-span-full py-16 text-center">
                <h3 className="mb-2 text-xl font-semibold text-gray-800">No matches found</h3>
                <p className="mx-auto max-w-sm text-gray-500">
                  Try checking spelling or searching with different keywords.
                </p>
              </div>
            ) : (
              results.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleDetailedView(item)}
                  className="group flex h-full cursor-pointer flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white"
                      dangerouslySetInnerHTML={{
                        __html: searchIcons[item.type] || searchIcons["Course"],
                      }}
                    ></div>
                    <span className="inline-block rounded-full border border-gray-100 bg-gray-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-600">
                      {item.type}
                    </span>
                  </div>
                  <h3 className="mb-3 text-[17px] font-bold leading-snug text-gray-900 transition-colors group-hover:text-blue-600">
                    {item.title}
                  </h3>
                  <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-4">
                    <span className="text-[13px] font-medium text-gray-500">View Details</span>
                    <span className="text-blue-600">&gt;</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </main>
  );
}
