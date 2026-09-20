import { Metadata } from "next";
import BlogDetailsPage from "@/components/blogs/BlogDetailsPage";
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
      const res = await fetch(`${API_BASE}/api/v1/public/blogs/by-slug/${s}`, {
        cache: "no-store",
      });
      if (!res.ok) return null;
      const json = await res.json();
      const d = json.data || json;
      return {
        title: d.title,
        image: d.image_url || "",
        description: stripHtml(d.short_desc || ""),
        author: d.author || "Provider",
        datePublished: d.published_at || d.created_at || "",
      };
    }
    if (slug.startsWith("inst-")) {
      const res = await fetch(
        `${API_BASE}/api/v1/institutions/public/blogs/by-slug/${slug}`,
        { cache: "no-store" },
      );
      if (!res.ok) return null;
      const json = await res.json();
      const d = json.data || json;
      return {
        title: d.title,
        image: d.image || "",
        description: stripHtml(d.excerpt || ""),
        author: "Institution",
        datePublished: d.published_at || d.created_at || "",
      };
    }
    const rawSlug = slug;
    const isNumeric = /^\d+$/.test(rawSlug);
    const url = isNumeric
      ? `${API_BASE}/api/v1/education/blogs/${rawSlug}`
      : `${API_BASE}/api/v1/education/blogs/by-slug/${rawSlug}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    const d = json.data || json;
    const blog = d.blog || d;
    return {
      title: blog.title,
      image: blog.image || "",
      description: stripHtml(blog.excerpt || ""),
      author: blog.author || "Admin",
      datePublished:
        blog.created_at || blog.published_at || blog.publish_date || "",
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

export default async function BlogDetailRoutePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Reuse the server-side fetchMeta (same data the metadata generator uses)
  // so JSON-LD carries real fields only — no client-side fetching.
  const meta = await fetchMeta(slug);

  const pageUrl = absoluteUrl(`/blogs/${slug}`);
  const blogPosting = meta
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
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
      {blogPosting && <JsonLd data={blogPosting} />}
      <JsonLd
        data={breadcrumbList([
          { name: "Home", url: absoluteUrl("/") },
          { name: "Blogs", url: absoluteUrl("/blogs") },
          { name: meta?.title || "Blog Post", url: pageUrl },
        ])}
      />
      <BlogDetailsPage params={params} />
    </>
  );
}
