import { Metadata } from "next";
import BlogDetailsPage from "@/components/blogs/BlogDetailsPage";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

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
        description: d.short_desc || "",
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
      description: blog.excerpt || "",
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

export default function BlogDetailRoutePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <BlogDetailsPage params={params} />;
}
