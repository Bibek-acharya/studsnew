import ProviderDetailPage from "@/components/providers/ProviderDetailPage";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ProviderDetailPage params={params} />;
}
