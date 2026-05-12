"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { Home, Newspaper, Search, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { adminNewsApi, AdminNews } from "@/services/newsApi";

const CATEGORY_COLORS: Record<string, string> = {
  admission: "bg-blue-100 text-blue-700",
  scholarship: "bg-emerald-100 text-emerald-700",
  exam: "bg-orange-100 text-orange-700",
  notice: "bg-purple-100 text-purple-700",
  event: "bg-pink-100 text-pink-700",
  achievement: "bg-yellow-100 text-yellow-700",
  others: "bg-gray-100 text-gray-700",
};

interface DeleteModalState {
  isOpen: boolean;
  newsId: number | null;
  title: string;
}

export default function NewsListSection({ setActiveSection }: { setActiveSection: (s: string) => void }) {
  const [news, setNews] = useState<AdminNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({ isOpen: false, newsId: null, title: "" });
  const limit = 10;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await adminNewsApi.list({ page, limit, search: search || undefined });
        setNews(res.news || []);
        setTotal(res.meta?.total || 0);
      } catch {
        setNews([]);
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
        const res = await adminNewsApi.list({ page: 1, limit, search: search || undefined });
        setNews(res.news || []);
        setTotal(res.meta?.total || 0);
      } catch {
        setNews([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    })();
  }, [search, limit]);

  const handleDelete = useCallback((id: number) => {
    const target = news.find((n) => n.id === id);
    setDeleteModal({ isOpen: true, newsId: id, title: target?.title || "this news item" });
  }, [news]);

  const confirmDelete = useCallback(async () => {
    if (!deleteModal.newsId) return;
    const id = deleteModal.newsId;
    setDeleteModal({ isOpen: false, newsId: null, title: "" });
    try {
      await adminNewsApi.delete(id);
      setNews((prev) => prev.filter((n) => n.id !== id));
      toast.success("News deleted successfully.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete news");
    }
  }, [deleteModal.newsId]);

  const totalPages = Math.ceil(total / limit);

  const categoryLabel = (cat: string) => {
    const found = CATEGORY_COLORS[cat];
    if (found) return cat.charAt(0).toUpperCase() + cat.slice(1);
    return cat;
  };

  if (loading) {
    return <div className="py-12 text-center text-slate-500">Loading news...</div>;
  }

  return (
    <div className="space-y-6">
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete News Item</h3>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete &ldquo;{deleteModal.title}&rdquo;? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteModal({ isOpen: false, newsId: null, title: "" })} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">News Directory</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">News Directory</span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-blue-600" /> News Directory
          </h2>
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                placeholder="Search news..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button type="button" onClick={() => setActiveSection("create-news")} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
              <Plus size={16} /> Create News
            </button>
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
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Published</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {news.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-gray-500">No news found</td></tr>
              ) : news.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800&h=400"}
                      alt={item.title}
                      className="w-20 h-14 object-cover rounded-lg border border-gray-200"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900">{item.title}</p>
                    {item.excerpt && (
                      <p className="text-xs text-gray-500" dangerouslySetInnerHTML={{ __html: item.excerpt.replace(/<[^>]*>/g, "").slice(0, 60) + (item.excerpt.replace(/<[^>]*>/g, "").length > 60 ? "..." : "") }} />
                    )}
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${CATEGORY_COLORS[item.category] || "bg-gray-100 text-gray-700"}`}>
                      {categoryLabel(item.category)}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4 text-gray-600">{item.author || "Admin"}</td>
                  <td className="text-center py-3 px-4 text-gray-500">
                    {item.date ? new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
                  </td>
                    <td className="text-center py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 hover:bg-green-50 rounded text-green-600" title="Edit" onClick={() => setActiveSection(`edit-news-${item.id}`)}><Pencil className="w-4 h-4" /></button>
                      <button className="p-1.5 hover:bg-red-50 rounded text-red-600" title="Delete" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4" /></button>
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
              Showing <span className="font-medium">{(page - 1) * limit + 1}-{Math.min(page * limit, total)}</span> of <span className="font-medium">{total}</span> news
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
