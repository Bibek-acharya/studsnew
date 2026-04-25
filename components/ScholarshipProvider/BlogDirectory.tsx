"use client";

import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { FileText, Search, Edit, Trash2, Eye, BarChart3, Heart } from "lucide-react";
import SectionCard from "./common/SectionCard";
import { scholarshipProviderApi, ProviderBlog } from "@/services/scholarshipProviderApi";

const BlogDirectory: React.FC = memo(() => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [blogs, setBlogs] = useState<ProviderBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);
      try {
        const res = await scholarshipProviderApi.getBlogs(page, limit);
        setBlogs(res.blogs);
        setTotal(res.meta.total);
      } catch {
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, [page]);

  const filtered = useMemo(() => {
    return blogs.filter((b) => {
      const matchSearch = b.title.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || b.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [blogs, search, statusFilter]);

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm("Delete this blog?")) return;
    try {
      await scholarshipProviderApi.deleteBlog(id);
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    } catch {
      alert("Failed to delete blog");
    }
  }, []);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <SectionCard>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" /> Blog Directory
          </h2>
          <span className="text-sm text-slate-500">Showing {filtered.length} of {total} blogs</span>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 flex items-center border border-slate-200 rounded-lg px-3 py-2 focus-within:border-blue-600">
            <Search className="w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search blogs..." className="bg-transparent border-none outline-none text-sm ml-2 w-full" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500">Loading blogs...</div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Blog</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Author</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Date</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Views</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Likes</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="py-8 text-center text-slate-500">No blogs found</td></tr>
                ) : filtered.map((blog) => (
                  <tr key={blog.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {blog.image_url && <img src={blog.image_url} alt={blog.title} className="w-16 h-12 object-cover rounded-lg" />}
                        <span className="font-medium text-slate-900">{blog.title}</span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4 text-slate-600">{blog.author || "Admin"}</td>
                    <td className="text-center py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        blog.status === "published" ? "bg-green-100 text-green-700" :
                        blog.status === "scheduled" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>{blog.status}</span>
                    </td>
                    <td className="text-center py-3 px-4 text-slate-500">{blog.published_at ? new Date(blog.published_at).toLocaleDateString() : new Date(blog.created_at).toLocaleDateString()}</td>
                    <td className="text-center py-3 px-4 text-slate-500 flex items-center justify-center gap-1"><BarChart3 className="w-3 h-3" />{blog.views}</td>
                    <td className="text-center py-3 px-4 text-slate-500 flex items-center justify-center gap-1"><Heart className="w-3 h-3" />{blog.likes}</td>
                    <td className="text-center py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1.5 hover:bg-blue-50 rounded text-blue-600" title="View"><Eye className="w-4 h-4" /></button>
                        <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600" title="Edit"><Edit className="w-4 h-4" /></button>
                        <button className="p-1.5 hover:bg-red-50 rounded text-red-600" title="Delete" onClick={() => handleDelete(blog.id)}><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
                <p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 disabled:opacity-50" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
                  <button className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 disabled:opacity-50" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
                </div>
              </div>
            )}
          </div>
        )}
      </SectionCard>
    </div>
  );
});

BlogDirectory.displayName = "BlogDirectory";

export default BlogDirectory;
