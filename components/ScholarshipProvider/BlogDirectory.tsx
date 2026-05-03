"use client";

import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { toast } from "sonner";
import { Home, FileText, Search, Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { scholarshipProviderApi, ProviderBlog } from "@/services/scholarshipProviderApi";
import ConfirmationModal from "./common/ConfirmationModal";

const FALLBACK_BLOGS: ProviderBlog[] = [
  { id: 1, provider_id: 1, title: "Product of Scholarship Project - Sunil's Story", content: "How scholarship changed one student's life", image_url: "", author: "Admin", status: "published", published_at: "2025-10-27", views: 0, likes: 0, created_at: "2025-10-27", updated_at: "" },
  { id: 2, provider_id: 1, title: "Children's Day Celebration 2025", content: "Joyful celebration with communities", image_url: "", author: "Admin", status: "draft", published_at: "2025-09-17", views: 0, likes: 0, created_at: "2025-09-17", updated_at: "" },
  { id: 3, provider_id: 1, title: "The Power of Community Libraries", content: "How free libraries transform neighborhoods", image_url: "", author: "Editor", status: "published", published_at: "2025-08-05", views: 0, likes: 0, created_at: "2025-08-05", updated_at: "" },
  { id: 4, provider_id: 1, title: "Disaster Relief: A Volunteer's Perspective", content: "Personal account of earthquake relief", image_url: "", author: "Guest", status: "published", published_at: "2025-07-12", views: 0, likes: 0, created_at: "2025-07-12", updated_at: "" },
  { id: 5, provider_id: 1, title: "Nutrition & Education: The Charity Cafe Model", content: "Feeding minds and bodies together", image_url: "", author: "Admin", status: "published", published_at: "2025-06-20", views: 0, likes: 0, created_at: "2025-06-20", updated_at: "" },
];

const STATUS_COLORS: Record<string, string> = {
  published: "bg-green-100 text-green-700",
  draft: "bg-yellow-100 text-yellow-700",
  scheduled: "bg-blue-100 text-blue-700",
};

const BlogDirectory: React.FC = memo(() => {
  const [blogs, setBlogs] = useState<ProviderBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; blogId: number | null; title: string }>({
    isOpen: false,
    blogId: null,
    title: "",
  });
  const limit = 10;

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);
      try {
        const res = await scholarshipProviderApi.getBlogs(page, limit);
        setBlogs(res.blogs.length > 0 ? res.blogs : FALLBACK_BLOGS);
        setTotal(res.meta.total);
      } catch {
        setBlogs(FALLBACK_BLOGS);
        setTotal(FALLBACK_BLOGS.length);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, [page]);

  const filtered = search
    ? blogs.filter((b) => b.title.toLowerCase().includes(search.toLowerCase()))
    : blogs;

  const handleDelete = useCallback(async (id: number) => {
    const target = blogs.find((blog) => blog.id === id);
    setDeleteModal({ isOpen: true, blogId: id, title: target?.title || "this blog" });
  }, [blogs]);

  const confirmDeleteBlog = useCallback(async () => {
    if (!deleteModal.blogId) return;
    const blogId = deleteModal.blogId;
    setDeleteModal({ isOpen: false, blogId: null, title: "" });
    try {
      await scholarshipProviderApi.deleteBlog(blogId);
      setBlogs((prev) => prev.filter((b) => b.id !== blogId));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete blog");
    }
  }, [deleteModal.blogId]);

  const totalPages = Math.ceil(total / limit);

  if (loading) {
    return <div className="py-12 text-center text-slate-500">Loading blogs...</div>;
  }

  return (
    <div className="space-y-6">
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Delete Blog"
        message={`Are you sure you want to delete \"${deleteModal.title}\"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteBlog}
        onCancel={() => setDeleteModal({ isOpen: false, blogId: null, title: "" })}
        destructive
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Blog Directory</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">Blog Directory</span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" /> Blog Directory
          </h2>
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input type="text" className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="Search blogs..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Image</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Category</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Author</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Reading Time</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Published</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="py-8 text-center text-gray-500">No blogs found</td></tr>
              ) : filtered.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <img
                      src={blog.image_url || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800&h=400"}
                      alt={blog.title}
                      className="w-20 h-14 object-cover rounded-lg border border-gray-200"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900">{blog.title}</p>
                    <p className="text-xs text-gray-500">{blog.content?.slice(0, 60)}</p>
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">Story</span>
                  </td>
                  <td className="text-center py-3 px-4 text-gray-600">{blog.author || "Admin"}</td>
                  <td className="text-center py-3 px-4 text-gray-500">5 min</td>
                  <td className="text-center py-3 px-4 text-gray-500">
                    {blog.published_at ? new Date(blog.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${STATUS_COLORS[blog.status] || "bg-gray-100 text-gray-700"}`}>
                      {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 hover:bg-blue-50 rounded text-blue-600" title="View"><Eye className="w-4 h-4" /></button>
                      <button className="p-1.5 hover:bg-green-50 rounded text-green-600" title="Edit"><Pencil className="w-4 h-4" /></button>
                      <button className="p-1.5 hover:bg-red-50 rounded text-red-600" title="Delete" onClick={() => handleDelete(blog.id)}><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-500">Showing <span className="font-medium">{(page - 1) * limit + 1}-{Math.min(page * limit, total)}</span> of <span className="font-medium">{total}</span> blogs</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium ${page === i + 1 ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{i + 1}</button>
              ))}
              {totalPages > 5 && <span className="text-gray-400">...</span>}
              {totalPages > 5 && <button onClick={() => setPage(totalPages)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm">{totalPages}</button>}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

BlogDirectory.displayName = "BlogDirectory";

export default BlogDirectory;
