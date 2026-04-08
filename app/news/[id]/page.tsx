import NewsDetailsPage from "@/components/news/NewsDetailsPage";

export default function NewsDetailRoutePage({ params }: { params: Promise<{ id: string }> }) {
  return <NewsDetailsPage params={params} />;
}
