import type { Metadata } from "next";
import {
  fetchMediaPressList,
  type MediaPressListResponse,
} from "@/services/mediaPress.api";
import MediaPressView from "./MediaPressView";

export const metadata: Metadata = {
  title: "Media & Press | Studsphere",
  description:
    "Official StudSphere press releases, news and media coverage — announcements from Nepal's education ecosystem.",
  alternates: { canonical: "./" },
  openGraph: {
    title: "Media & Press | Studsphere",
    description:
      "Official StudSphere press releases, news and media coverage — announcements from Nepal's education ecosystem.",
    type: "website",
  },
};

const PAGE_LIMIT = 9;

/**
 * Server component: fetches the first page of media & press items with ISR
 * revalidation and hands off to the client view for filtering, detail modal
 * and pagination. Falls back to a client-side fetch when the API is
 * unreachable (dev-tolerance) — the page never crashes on a bad backend.
 */
export default async function MediaPressPage() {
  const initialData: MediaPressListResponse = await fetchMediaPressList({
    page: 1,
    limit: PAGE_LIMIT,
    revalidate: 300,
  });

  return <MediaPressView initialData={initialData} />;
}
