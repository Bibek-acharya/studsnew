"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { publicResultApi, StudentResult, PublishedResultScholarship } from "@/services/scholarshipProviderApi";

function parseSlug(slug: string, scholarships: { id: number; slug?: string }[]): number | null {
  const num = Number(slug);
  if (!isNaN(num)) return num;
  const found = scholarships.find((s) => s.slug === slug);
  return found ? found.id : null;
}

const PASS_MARKS = 40;
const passed = (marks: number | undefined) => (marks ?? 0) >= PASS_MARKS;

export default function ScholarshipResultPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  const searchParams = useSearchParams();
  const rollNumber = searchParams.get("roll") || "";
  const dateOfBirth = searchParams.get("dob") || "";

  const [result, setResult] = useState<StudentResult | null>(null);
  const [scholarship, setScholarship] = useState<PublishedResultScholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!rollNumber || !dateOfBirth) {
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const scholarships = await publicResultApi.getScholarships();
        const sid = parseSlug(slug, scholarships);
        if (!sid) { setNotFound(true); setLoading(false); return; }

        const s = scholarships.find((x: PublishedResultScholarship) =>
          x.id === sid || x.slug === slug
        ) || null;
        setScholarship(s);

        const data = await publicResultApi.checkResult(sid, rollNumber);
        if (data) setResult(data);
        else setNotFound(true);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug, rollNumber, dateOfBirth]);

  if (!rollNumber || !dateOfBirth) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-lg font-semibold text-gray-700">No credentials provided</p>
          <p className="mt-1 text-sm text-gray-500">Please enter your roll number and date of birth.</p>
          <Link href={`/scholarship-result/${slug}`} className="mt-4 inline-block text-sm font-medium text-brand-blue underline underline-offset-2">Go back</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400 mb-4" />
        <p className="text-sm text-gray-500">Checking your result...</p>
      </div>
    );
  }

  if (notFound || !result) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4">
            <circle cx="12" cy="12" r="10" /><path d="M16 16s-1.5-2-4-2-4 2-4 2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
          <p className="text-lg font-semibold text-gray-700">No result found</p>
          <p className="mt-1 text-sm text-gray-500">We could not find a result matching the provided credentials. Please verify your roll number.</p>
          <Link href={`/scholarship-result/${slug}`} className="mt-4 inline-block text-sm font-medium text-brand-blue underline underline-offset-2">Try again</Link>
        </div>
      </div>
    );
  }

  const hasPassed = passed(result.marks_obtained ?? result.final_score);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-10 px-4 overflow-hidden">
      {/* Watermark */}
      {scholarship?.image_url && (
        <div
          className="absolute inset-0 bg-no-repeat bg-center opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `url(${scholarship.image_url})`,
            backgroundSize: "400px",
          }}
        />
      )}

      <div className="relative mx-auto max-w-3xl">
        {/* Scholarship Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">{scholarship?.title || scholarship?.provider_name || "Scholarship Result"}</h1>
          <p className="text-sm text-gray-500 mt-1">{scholarship?.location || scholarship?.office_address || ""}</p>
        </div>

        {/* Student Info Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-6">
          {/* Name / Value rows */}
          <div className="divide-y divide-gray-100">
            <Row label="Name" value={result.student_name || "—"} />
            <Row label="Symbol Number" value={result.roll_number || "—"} />
            <Row label="Stream" value={result.stream || "—"} />
            <Row label="Exam Center" value={result.exam_center || "—"} />
          </div>

          {/* Result Message */}
          <div className={`py-6 px-5 text-center ${hasPassed ? "bg-green-50" : "bg-red-50"}`}>
            {hasPassed ? (
              <>
                <p className="text-2xl font-bold text-green-700">Congratulations!</p>
                <p className="text-base text-green-600 mt-1">You Have Passed.</p>
                {result.rank && <p className="text-sm text-green-600 mt-1">Rank: #{result.rank}</p>}
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-red-700">Sorry!</p>
                <p className="text-base text-red-600 mt-1">You Have Failed.</p>
              </>
            )}
          </div>

          {/* Interview Info — only if passed */}
          {hasPassed && (result.interview_location || result.interview_date || result.reporting_time) && (
            <div className="border-t border-gray-100">
              <div className="py-4 px-5">
                <h3 className="font-semibold text-gray-700 mb-3">Interview Information</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-gray-500 block">Interview Date</span>
                    <span className="font-semibold text-gray-900">{result.interview_date || "TBD"}</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-gray-500 block">Interview Center</span>
                    <span className="font-semibold text-gray-900">{result.interview_location || "TBD"}</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-gray-500 block">Reporting Time</span>
                    <span className="font-semibold text-gray-900">{result.reporting_time || "TBD"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Required Documents */}
          {result.required_documents && result.required_documents.length > 0 && (
            <div className="border-t border-gray-100 py-4 px-5">
              <h3 className="font-semibold text-gray-700 mb-2 text-sm">Required Documents</h3>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {result.required_documents.map((doc, i) => (
                  <li key={i}>{doc}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="text-center">
          <Link href={`/scholarship-result/${slug}`} className="text-sm font-medium text-brand-blue underline underline-offset-2">
            Check another result
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 px-5">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}
