import BlogDetailsPage from "@/components/blogs/BlogDetailsPage";

export default function BlogDetailRoutePage({ params }: { params: Promise<{ id: string }> }) {
  return <BlogDetailsPage params={params} />;
}
