import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchCourseDetailsById } from "@/services/course-api";
import CourseDetailView from "./CourseDetailView";

export const revalidate = 300;

function stripHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Title <= 60 chars including the "| Studsphere" suffix.
function buildTitle(rawTitle: string): string {
  const suffix = " | Studsphere";
  const name = rawTitle || "Course Details";
  if (name.length + suffix.length <= 60) return `${name}${suffix}`;
  return `${name.slice(0, 60 - suffix.length).trim()}${suffix}`;
}

// Description clamped to ~150-160 chars.
function buildDescription(base: string, extra: string): string {
  let description = base;
  if (description.length < 150 && extra) {
    description = `${description} ${extra}`.trim();
  }
  if (description.length > 160) {
    const cut = description.slice(0, 157);
    description = `${cut.slice(0, Math.max(0, cut.lastIndexOf(" ")))}...`;
  }
  return description;
}

const FALLBACK_DESCRIPTION =
  "Explore course details including curriculum, eligibility, admission process, fees, scholarships, and FAQs. Find the right program for your career goals.";

async function loadCourseDetails(id: string) {
  try {
    return await fetchCourseDetailsById(id);
  } catch (error) {
    if ((error as { status?: number })?.status === 404) {
      return null;
    }
    // Non-404 failures render the existing empty-state UI (same as client behavior).
    return undefined;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const details = await loadCourseDetails(id);
  const course = details?.course;

  const rawTitle = stripHtml(course?.title || "");
  const title = buildTitle(rawTitle);

  const rawDescription = stripHtml(course?.description || "");
  const base = rawDescription
    ? `Explore ${rawTitle || "this course"} in Nepal — ${rawDescription.slice(0, 100)}`
    : "";
  const description =
    base && base.length > 40
      ? buildDescription(base, "curriculum, eligibility, fees, scholarships and FAQs at Studsphere.")
      : FALLBACK_DESCRIPTION;

  return {
    title,
    description,
    alternates: { canonical: "./" },
    openGraph: {
      title,
      description,
      type: "website",
      ...(course?.bannerUrl ? { images: [course.bannerUrl] } : {}),
    },
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const details = await loadCourseDetails(id);

  if (details === null) {
    notFound();
  }

  return (
    <div className="min-h-screen font-sans">
      <CourseDetailView details={details ?? undefined} />
    </div>
  );
}
