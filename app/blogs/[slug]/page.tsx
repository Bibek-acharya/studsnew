import BlogDetailsPage from "@/components/blogs/BlogDetailsPage";

export default function BlogDetailRoutePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <BlogDetailsPage params={params} />;
}
