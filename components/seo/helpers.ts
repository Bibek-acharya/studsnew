export const SITE_URL = "https://studsphere.com";

/**
 * Resolve an API-relative image/path into an absolute URL matching
 * metadataBase (app/layout.tsx). Returns undefined for empty values so
 * callers can omit the property instead of fabricating one.
 */
export function absoluteUrl(
  url: string | undefined | null,
): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  return `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

/**
 * Build a schema.org BreadcrumbList from ordered crumb entries.
 * The last entry may omit its URL (current page).
 */
export function breadcrumbList(
  items: { name: string; url?: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}
