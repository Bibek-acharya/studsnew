import type { Metadata } from "next";
import {
  fetchDownloadsList,
  type DownloadListResponse,
} from "@/services/downloads.api";
import DownloadsView from "./DownloadsView";

export const metadata: Metadata = {
  title: "Downloads | Studsphere",
  description:
    "Download StudSphere brochures, forms and official documents — brochures, application forms and resources in one place.",
  alternates: { canonical: "./" },
  openGraph: {
    title: "Downloads | Studsphere",
    description:
      "Download StudSphere brochures, forms and official documents — brochures, application forms and resources in one place.",
    type: "website",
  },
};

const PAGE_LIMIT = 9;

/**
 * Server component: fetches the first page of downloads with ISR revalidation
 * and hands off to the client view for category filtering and pagination.
 * Falls back to a client-side fetch when the API is unreachable
 * (dev-tolerance) — the page never crashes on a bad backend.
 */
export default async function DownloadsPage() {
  const initialData: DownloadListResponse = await fetchDownloadsList({
    page: 1,
    limit: PAGE_LIMIT,
    revalidate: 300,
  });

  return <DownloadsView initialData={initialData} />;
}
