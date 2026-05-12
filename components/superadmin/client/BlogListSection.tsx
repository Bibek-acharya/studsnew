"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Home, FileText, Search, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { superadminBlogApi, SuperAdminBlog } from "@/services/superadminBlogApi";

const STATUS_BADGE: Record<string, string> = {
  published: "bg-green-100 text-green-700",
  draft: "bg-yellow-100 text-yellow-700",
};

interface DeleteModalState {
  isOpen: boolean;
  blogId: number | null;
  title: string;
}

export default function BlogListSection({ setActiveSection }: { setActiveSection: (s: string) => void }) {
  const [blogs, setBlogs] = useState<SuperAdminBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({ isOpen: false, blogId: null, title: "" });
  const limit = 10;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await superadminBlogApi.list({ page, limit, search: search || undefined });
        setBlogs(res.blogs || []);
        setTotal(res.meta?.total || 0);
      } catch {
        setBlogs([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    })();
  }, [page]);

  const handleSearch = useCallback(() => {
    setPage(1);
    (async () => {
      setLoading(true);
      try {
        const res = await superadminBlogApi.list({ page: 1, limit, search: search || undefined });
        setBlogs(res.blogs || []);
        setTotal(res.meta?.total || 0);
      } catch {
        setBlogs([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    })();
  }, [search, limit]);

  const handleDelete = useCallback((id: number) => {
    const target = blogs.find((b) => b.id === id);
    setDeleteModal({ isOpen: true, blogId: id, title: target?.title || "this blog" });
  }, [blogs]);

  const confirmDelete = useCallback(async () => {
    if (!deleteModal.blogId) return;
    const id = deleteModal.blogId;
    setDeleteModal({ isOpen: false, blogId: null, title: "" });
    try {
      await superadminBlogApi.delete(id);
      setBlogs((prev) => prev.filter((b) => b.id !== id));
      toast.success("Blog deleted successfully.");
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
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Blog</h3>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete &ldquo;{deleteModal.title}&rdquo;? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteModal({ isOpen: false, blogId: null, title: "" })} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Blogs Directory</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">Blogs Directory</span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" /> Blogs Directory
          </h2>
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                placeholder="Search blogs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button type="button" onClick={() => setActiveSection("create-blog")} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
              <Plus size={16} /> Create Blog
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Image</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Author</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Category</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Published</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {blogs.length === 0 ? (
                <tr><td colSpan={7} className="py-8 text-center text-gray-500">No blogs found</td></tr>
              ) : blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <img
                      src={blog.image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800&h=400"}
                      alt={blog.title}
                      className="w-20 h-14 object-cover rounded-lg border border-gray-200"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900">{blog.title}</p>
                    {blog.excerpt && (
                      <p className="text-xs text-gray-500">{blog.excerpt.replace(/<[^>]*>/g, "").slice(0, 60)}{blog.excerpt.replace(/<[^>]*>/g, "").length > 60 ? "..." : ""}</p>
                    )}
                  </td>
                  <td className="text-center py-3 px-4 text-gray-600">{blog.author || "Admin"}</td>
                  <td className="text-center py-3 px-4">
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700">
                      {blog.category ? blog.category.charAt(0).toUpperCase() + blog.category.slice(1) : "General"}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4 text-gray-500">
                    {blog.created_at ? new Date(blog.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${blog.published ? STATUS_BADGE.published : STATUS_BADGE.draft}`}>
                      {blog.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="p-1.5 hover:bg-green-50 rounded text-green-600"
                        title="Edit"
                        onClick={() => setActiveSection(`edit-blog-${blog.id}`)}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1.5 hover:bg-red-50 rounded text-red-600"
                        title="Delete"
                        onClick={() => handleDelete(blog.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium">{(page - 1) * limit + 1}-{Math.min(page * limit, total)}</span> of <span className="font-medium">{total}</span> blogs
            </p>
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
}
