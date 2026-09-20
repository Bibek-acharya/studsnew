import { Metadata } from "next";
import EventDetailsPage from "@/components/events/EventDetailsPage";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl, breadcrumbList } from "@/components/seo/helpers";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const stripHtml = (s: string) =>
  s
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();

async function fetchMeta(slug: string) {
  try {
    if (slug.startsWith("provider-")) {
      const s = slug.replace("provider-", "");
      const res = await fetch(`${API_BASE}/api/v1/public/events/by-slug/${s}`, {
        cache: "no-store",
      });
      if (!res.ok) return null;
      const json = await res.json();
      const d = json.data || json;
      return {
        title: d.name || d.title,
        image: d.image_url || "",
        description: stripHtml(d.short_desc || ""),
        startDate: d.start_date || "",
        endDate: d.end_date || "",
        location: d.location || "",
      };
    }
    if (slug.startsWith("inst-")) {
      const res = await fetch(
        `${API_BASE}/api/v1/institutions/public/events/by-slug/${slug}`,
        { cache: "no-store" },
      );
      if (res.ok) {
        const json = await res.json();
        const d = json.data || json;
        return {
          title: d.name || d.title,
          image: d.image_url || "",
          description: stripHtml(d.short_desc || ""),
          startDate: d.start_date || "",
          endDate: d.end_date || "",
          location: d.location || "",
        };
      }
      const res2 = await fetch(
        `${API_BASE}/api/v1/institutions/public/events/${slug.replace("inst-", "")}`,
        { cache: "no-store" },
      );
      if (res2.ok) {
        const json = await res2.json();
        const d = json.data || json;
        return {
          title: d.name || d.title,
          image: d.image_url || "",
          description: stripHtml(d.short_desc || ""),
          startDate: d.start_date || "",
          endDate: d.end_date || "",
          location: d.location || "",
        };
      }
      return null;
    }
    const rawSlug = slug;
    const isNumeric = /^\d+$/.test(rawSlug);
    const url = isNumeric
      ? `${API_BASE}/api/v1/education/events/${rawSlug}`
      : `${API_BASE}/api/v1/education/events/by-slug/${rawSlug}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    const d = json.data || json;
    return {
      title: d.title,
      image: d.image || "",
      description: stripHtml(d.excerpt || d.desc || ""),
      startDate: d.start_date || d.date || "",
      endDate: d.end_date || "",
      location: d.location || "",
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const meta = await fetchMeta(slug);
  if (!meta) return {};

  return {
    title: meta.title,
    description: meta.description || meta.title,
    alternates: { canonical: `./${slug}` },
    openGraph: {
      title: meta.title,
      description: meta.description || meta.title,
      images: meta.image
        ? [{ url: meta.image, width: 1200, height: 630 }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description || meta.title,
      images: meta.image ? [meta.image] : undefined,
    },
  };
}

export default async function EventDetailRoutePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Reuse the server-side fetchMeta (same data the metadata generator uses)
  // so JSON-LD carries real fields only — no client-side fetching.
  const meta = await fetchMeta(slug);

  const pageUrl = absoluteUrl(`/events/${slug}`);
  // Google-required Event fields: name, startDate, location. Omit any we
  // don't have rather than fabricating values.
  const eventSchema = meta
    ? {
        "@context": "https://schema.org",
        "@type": "Event",
        name: meta.title,
        ...(meta.startDate ? { startDate: meta.startDate } : {}),
        ...(meta.location
          ? {
              location: {
                "@type": "Place",
                name: meta.location,
              },
            }
          : {}),
        ...(meta.description ? { description: meta.description } : {}),
        ...(meta.image
          ? { image: [absoluteUrl(meta.image)].filter(Boolean) }
          : {}),
        ...(meta.endDate ? { endDate: meta.endDate } : {}),
      }
    : null;

  return (
    <>
      {eventSchema && <JsonLd data={eventSchema} />}
      <JsonLd
        data={breadcrumbList([
          { name: "Home", url: absoluteUrl("/") },
          { name: "Events", url: absoluteUrl("/events") },
          { name: meta?.title || "Event", url: pageUrl },
        ])}
      />
      <EventDetailsPage params={params} />
    </>
  );
}
