import NewsDetailsPage from "@/components/news/NewsDetailsPage";

export default function NewsDetailRoutePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <NewsDetailsPage params={params} />;
}
