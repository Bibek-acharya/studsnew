import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl, breadcrumbList } from "@/components/seo/helpers";
import CollegeDetailsView from "./CollegeDetailsView";

/**
 * Server component: fetches the college/institution on the server (same URLs
 * the client useCollegeData hook uses) with ISR revalidation, then renders the
 * existing client detail component with the data as a prop.
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface CollegeLike {
  institution_name?: string;
  name?: string;
  about?: string;
  description?: string;
  banner_url?: string | null;
  logo_url?: string | null;
  district?: string | null;
  location?: string | null;
  website_url?: string | null;
  website?: string | null;
  [key: string]: unknown;
}

async function fetchCollege(idStr: string): Promise<CollegeLike | null> {
  const numericId = Number(idStr.replace("inst_", ""));
  if (!numericId) return null;
  const fetchJson = async (path: string): Promise<CollegeLike | null> => {
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        next: { revalidate: 300 },
      });
      if (!res.ok) return null;
      const json = (await res.json()) as { data?: CollegeLike } | null;
      return json?.data ?? null;
    } catch {
      return null;
    }
  };
  // Same precedence as useCollegeData: institution first, plain college fallback.
  return (
    (await fetchJson(`/api/v1/institutions/public/${numericId}`)) ??
    (await fetchJson(`/api/v1/colleges/${numericId}`))
  );
}

function toPlainText(html: string): string {
  return String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Build a 150–160 character meta description at a word boundary.
function buildDescription(name: string, body: string): string {
  const filler = ` Explore courses, fees, facilities, admissions and reviews for ${name} on Studsphere.`;
  const text = `${body}${filler}`.replace(/\s+/g, " ").trim();
  if (text.length <= 160) return text;
  const lastSpace = text.lastIndexOf(" ", 160);
  return text.slice(0, lastSpace > 149 ? lastSpace : 160).trim();
}

// Build a schema.org EducationalOrganization from only the fields the API
// actually returned. Properties with no data are omitted entirely — never
// fabricated.
function buildEducationalOrganizationSchema(
  college: CollegeLike,
  pageUrl: string,
): Record<string, unknown> {
  const name =
    college.institution_name || college.name || "";
  const about =
    toPlainText(
      (college.institution_name ? college.about : college.description) || "",
    ) || undefined;

  const logo = absoluteUrl(college.logo_url || undefined);
  const rawWebsite =
    college.website_url || college.website || undefined;
  const website =
    typeof rawWebsite === "string" && rawWebsite.startsWith("http")
      ? rawWebsite
      : rawWebsite
        ? `https://${rawWebsite}`
        : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    ...(name ? { name } : {}),
    ...(pageUrl ? { url: pageUrl } : {}),
    ...(logo ? { logo } : {}),
    ...(about ? { description: about } : {}),
    ...(website ? { sameAs: [website] } : {}),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const college = await fetchCollege(id);
  const isInstitution = !!college?.institution_name;
  const name =
    (isInstitution ? college?.institution_name : college?.name) || "";
  const rawBody = isInstitution ? college?.about : college?.description;
  const body = toPlainText(rawBody || "");

  const suffix = " | Studsphere";
  const rawTitle = name ? `${name}${suffix}` : "College Details | Studsphere";
  const title =
    name && rawTitle.length > 60
      ? `${name.slice(0, Math.max(0, 60 - suffix.length)).trim()}${suffix}`
      : rawTitle;
  const description = name
    ? buildDescription(name, body || `View details for ${name} on Studsphere.`)
    : "View detailed college information including courses, fees, facilities, scholarships, and admission requirements on Studsphere.";

  const rawImage: string | null =
    [college?.banner_url, college?.logo_url].find(
      (u) => typeof u === "string" && u.length > 0,
    ) || null;
  const image = rawImage
    ? rawImage.startsWith("http")
      ? rawImage
      : `${API_BASE}${rawImage}`
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

export default async function FindCollegeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const college = await fetchCollege(id);
  if (!college) notFound();

  const pageUrl = absoluteUrl(`/find-college/${id}`) ?? "";
  const orgSchema = buildEducationalOrganizationSchema(college, pageUrl);

  return (
    <>
      <JsonLd data={orgSchema} />
      <JsonLd
        data={breadcrumbList([
          { name: "Home", url: absoluteUrl("/") },
          { name: "Colleges", url: absoluteUrl("/find-college") },
          { name: college.institution_name || college.name || "College", url: pageUrl },
        ])}
      />
      <CollegeDetailsView id={id} initialCollege={college} />
    </>
  );
}
