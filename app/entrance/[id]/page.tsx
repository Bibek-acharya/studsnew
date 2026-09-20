import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { mapRawEntrance, type EntranceDetailsResponse } from "@/services/entrance.api";
import EntranceDetailsView from "./EntranceDetailsView";

/**
 * Server component: fetches the entrance exam on the server with ISR
 * revalidation and renders the existing client detail component with the data
 * as a prop (its react-query fetch becomes a cache-warm no-op on first paint).
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function fetchEntrance(
  id: string,
): Promise<EntranceDetailsResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/entrances/${id}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json?.data) return null;
    return { ...json, data: mapRawEntrance(json.data) };
  } catch {
    return null;
  }
}

function toPlainText(html: string): string {
  return String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Build a 150–160 character meta description at a word boundary.
function buildDescription(body: string): string {
  const filler =
    " Eligibility, syllabus, exam pattern, important dates and application details.";
  const text = `${body}${filler}`.replace(/\s+/g, " ").trim();
  if (text.length <= 160) return text;
  const lastSpace = text.lastIndexOf(" ", 160);
  return text.slice(0, lastSpace > 149 ? lastSpace : 160).trim();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const entrance = await fetchEntrance(id);
  const name: string = entrance?.data?.title || "";
  const suffix = " | Studsphere";
  const rawTitle = name
    ? `${name}${suffix}`
    : "Entrance Exam Details | Studsphere";
  const title =
    name && rawTitle.length > 60
      ? `${name.slice(0, Math.max(0, 60 - suffix.length)).trim()}${suffix}`
      : rawTitle;

  const body = toPlainText(entrance?.data?.description || "");
  const description = name
    ? buildDescription(body || `Details for the ${name} entrance exam.`)
    : "View entrance exam details including syllabus, dates, eligibility, and preparation resources with Studsphere.";

  const image: string | undefined = entrance?.data?.imageUrl
    ? entrance.data.imageUrl.startsWith("http")
      ? entrance.data.imageUrl
      : `${API_BASE}${entrance.data.imageUrl}`
    : undefined;

  return {
    title,
    description,
    alternates: { canonical: "./" },
    openGraph: {
      title,
      description,
      type: "website",
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function EntranceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entrance = await fetchEntrance(id);
  if (!entrance) notFound();
  return <EntranceDetailsView id={id} initialData={entrance} />;
}
