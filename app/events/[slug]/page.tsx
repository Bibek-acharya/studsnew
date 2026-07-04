import { Metadata } from "next";
import EventDetailsPage from "@/components/events/EventDetailsPage";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

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
        description: d.short_desc || "",
      };
    }
    if (slug.startsWith("inst-")) {
      const s = slug.replace("inst-", "");
      const res = await fetch(
        `${API_BASE}/api/v1/institutions/public/events/by-slug/${s}`,
        { cache: "no-store" },
      );
      if (!res.ok) return null;
      const json = await res.json();
      const d = json.data || json;
      return {
        title: d.name || d.title,
        image: d.image_url || "",
        description: d.short_desc || "",
      };
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
      description: d.excerpt || d.desc || "",
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

export default function EventDetailRoutePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <EventDetailsPage params={params} />;
}
