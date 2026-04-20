"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 w-full max-w-350">
        <Image
          src="/404.png"
          alt="404 - Page Not Found"
          width={400}
          height={400}
          className="mx-auto w-full max-w-[300px] md:max-w-[400px] h-auto"
          priority
        />
      </div>

      <div className="w-full max-w-350">
        <h2 className="mb-3 text-3xl font-bold text-slate-800">
          Lost in the Studsphere?
        </h2>

        <p className="mb-8 text-base text-slate-500">
          It looks like you&apos;ve drifted into uncharted academic territory. The page you&apos;re looking for doesn&apos;t exist in our syllabus.
        </p>

        <form onSubmit={handleSearch} className="relative mx-auto max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search colleges, courses, scholarships..."
            className="w-full rounded-full border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-[15px]  transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
        </form>
      </div>

      </div>
  );
}