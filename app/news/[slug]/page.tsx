import { Metadata } from "next";
import NewsDetailsPage from "@/components/news/NewsDetailsPage";
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
      const res = await fetch(`${API_BASE}/api/v1/public/news/by-slug/${s}`, {
        cache: "no-store",
      });
      if (!res.ok) return null;
      const json = await res.json();
      const d = json.data || json;
      return {
        title: d.title,
        image: d.image_url || "",
        description: stripHtml(d.short_desc || ""),
        author: d.published_by || "Unknown",
        datePublished: d.publish_date || d.published_at || d.created_at || "",
      };
    }
    if (slug.startsWith("inst-")) {
      const res = await fetch(
        `${API_BASE}/api/v1/institutions/public/news/by-slug/${slug}`,
        { cache: "no-store" },
      );
      if (res.ok) {
        const json = await res.json();
        const d = json.data || json;
        return {
          title: d.title,
          image: d.image_url || d.image || "",
          description: stripHtml(d.short_desc || d.excerpt || d.desc || ""),
          author: d.published_by || "Institution",
          datePublished:
            d.publish_date || d.published_at || d.created_at || "",
        };
      }
      const res2 = await fetch(
        `${API_BASE}/api/v1/institutions/public/news/${slug.replace("inst-", "")}`,
        { cache: "no-store" },
      );
      if (res2.ok) {
        const json = await res2.json();
        const d = json.data || json;
        return {
          title: d.title,
          image: d.image_url || d.image || "",
          description: stripHtml(d.short_desc || d.excerpt || d.desc || ""),
          author: d.published_by || "Institution",
          datePublished:
            d.publish_date || d.published_at || d.created_at || "",
        };
      }
      return null;
    }
    const eduSlug = slug.startsWith("edu-") ? slug.replace("edu-", "") : slug;
    const isNumeric = /^\d+$/.test(eduSlug);
    const url = isNumeric
      ? `${API_BASE}/api/v1/education/news/${eduSlug}`
      : `${API_BASE}/api/v1/education/news/by-slug/${slug.startsWith("edu-") ? slug : eduSlug}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    const d = json.data || json;
    return {
      title: d.title,
      image: d.image || "",
      description: stripHtml(d.excerpt || d.desc || ""),
      author: d.author || d.published_by || "",
      datePublished: d.date || d.created || d.created_at || "",
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

export default async function NewsDetailRoutePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Reuse the server-side fetchMeta (same data the metadata generator uses)
  // so JSON-LD carries real fields only — no client-side fetching.
  const meta = await fetchMeta(slug);

  const pageUrl = absoluteUrl(`/news/${slug}`);
  const newsArticle = meta
    ? {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: meta.title,
        ...(meta.description ? { description: meta.description } : {}),
        ...(meta.image
          ? { image: [absoluteUrl(meta.image)].filter(Boolean) }
          : {}),
        ...(meta.author ? { author: { "@type": "Person", name: meta.author } } : {}),
        ...(meta.datePublished
          ? { datePublished: meta.datePublished }
          : {}),
        mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
      }
    : null;

  return (
    <>
      {newsArticle && <JsonLd data={newsArticle} />}
      <JsonLd
        data={breadcrumbList([
          { name: "Home", url: absoluteUrl("/") },
          { name: "News", url: absoluteUrl("/news") },
          { name: meta?.title || "News Article", url: pageUrl },
        ])}
      />
      <NewsDetailsPage params={params} />
    </>
  );
}
