import { FolderOpen } from "lucide-react";
import Link from "next/link";

export default function ScholarshipResultListing() {
  return (
    <div className="mx-auto mb-4 flex w-full max-w-350 flex-col gap-10 py-4 lg:gap-12 sm:py-6 lg:py-4">
      <section className="rounded-md bg-brand-blue py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
            Scholarship Results
          </h1>
          <p className="mx-auto max-w-2xl text-[13px] text-gray-200 md:text-sm lg:text-base">
            Select a scholarship below to check your result. Enter your roll
            number and date of birth to view your outcome and interview
            details.
          </p>
        </div>
      </section>

      <section className="flex flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
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
      </section>
    </div>
  );
}
