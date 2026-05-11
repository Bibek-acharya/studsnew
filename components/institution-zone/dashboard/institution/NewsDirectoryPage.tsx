"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, MagnifyingGlass, Eye, Pencil, Trash, Spinner, CaretLeft, CaretRight, X } from "@phosphor-icons/react";
import { toast } from "sonner";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";
import { institutionNewsApi, InstitutionNews } from "@/services/institutionNewsApi";

const NEWS_TYPES: Record<string, string> = {
  notice: "Notice",
  announcement: "Announcement",
  news: "News",
  "press-release": "Press Release",
  update: "Update",
};

const TYPE_COLORS: Record<string, string> = {
  notice: "bg-purple-100 text-purple-700",
  announcement: "bg-green-100 text-green-700",
  news: "bg-blue-100 text-blue-700",
  "press-release": "bg-pink-100 text-pink-700",
  update: "bg-red-100 text-red-700",
};

const STATUS_COLORS: Record<string, string> = {
  published: "bg-green-100 text-green-700",
  draft: "bg-yellow-100 text-yellow-700",
  archived: "bg-gray-100 text-gray-700",
};

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800&h=400";

const NewsDirectoryPage: React.FC = () => {
  const router = useRouter();
  const [news, setNews] = useState<InstitutionNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; newsId: number | null; title: string }>({
    isOpen: false,
    newsId: null,
    title: "",
  });
  const limit = 10;

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      try {
        const res = await institutionNewsApi.list(page, limit);
        setNews(res.news || []);
        setTotal(res.meta?.total || 0);
      } catch {
        setNews([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, [page]);

  const filtered = useMemo(() => {
    if (!search) return news;
    return news.filter((n) => n.title.toLowerCase().includes(search.toLowerCase()));
  }, [news, search]);

  const handleDelete = useCallback((id: number) => {
    const target = news.find((item) => item.id === id);
    setDeleteModal({ isOpen: true, newsId: id, title: target?.title || "this news item" });
  }, [news]);

  const confirmDeleteNews = useCallback(async () => {
    if (!deleteModal.newsId) return;
    const newsId = deleteModal.newsId;
    setDeleteModal({ isOpen: false, newsId: null, title: "" });
    try {
      await institutionNewsApi.delete(newsId);
      setNews((prev) => prev.filter((n) => n.id !== newsId));
      toast.success("News deleted successfully.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete news");
    }
  }, [deleteModal.newsId]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <SectionHeader
        title="News Directory"
        breadcrumbItems={[
          { label: "Dashboard", href: "/institution-zone/dashboard" },
          { label: "News" },
        ]}
      />

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteModal({ isOpen: false, newsId: null, title: "" })} />
          <div className="relative mx-4 w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setDeleteModal({ isOpen: false, newsId: null, title: "" })}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="mb-2 text-lg font-bold text-gray-900">Delete News Item</h3>
            <p className="mb-6 text-sm text-gray-600">
              Are you sure you want to delete &ldquo;{deleteModal.title}&rdquo;? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ isOpen: false, newsId: null, title: "" })}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteNews}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 font-semibold text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search news..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
              />
            </div>
            <button
              onClick={() => router.push("/institution-zone/dashboard/news/create")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap"
            >
              <Plus size={18} />
              Create News
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-3 text-gray-500">Loading news...</span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-6 font-semibold text-gray-700">Image</th>
                    <th className="text-left py-3 px-6 font-semibold text-gray-700">Title</th>
                    <th className="text-center py-3 px-6 font-semibold text-gray-700">Type</th>
                    <th className="text-center py-3 px-6 font-semibold text-gray-700">Author</th>
                    <th className="text-center py-3 px-6 font-semibold text-gray-700">Published</th>
                    <th className="text-center py-3 px-6 font-semibold text-gray-700">Status</th>
                    <th className="text-center py-3 px-6 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-500">
                        {search ? "No news found matching your search." : "No news yet. Create your first news item!"}
                      </td>
                    </tr>
                  ) : filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="py-3 px-6">
                        <img
                          src={item.image_url || FALLBACK_IMAGE}
                          alt={item.title}
                          className="w-20 h-14 object-cover rounded-lg border border-gray-200"
                        />
                      </td>
                      <td className="py-3 px-6">
                        <p className="font-medium text-gray-900">{item.title}</p>
                        {item.short_desc && (
                          <p
                            className="text-xs text-gray-500 mt-0.5"
                            dangerouslySetInnerHTML={{
                              __html: item.short_desc.replace(/<[^>]*>/g, "").slice(0, 60) + (item.short_desc.replace(/<[^>]*>/g, "").length > 60 ? "..." : ""),
                            }}
                          />
                        )}
                        {!item.short_desc && item.content && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {item.content.replace(/<[^>]*>/g, "").slice(0, 60)}
                          </p>
                        )}
                      </td>
                      <td className="text-center py-3 px-6">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${TYPE_COLORS[item.news_type] || "bg-gray-100 text-gray-700"}`}>
                          {NEWS_TYPES[item.news_type] || item.news_type || "News"}
                        </span>
                      </td>
                      <td className="text-center py-3 px-6 text-gray-600">{item.published_by || "Admin"}</td>
                      <td className="text-center py-3 px-6 text-gray-500">
                        {item.published_at
                          ? new Date(item.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                          : item.publish_date
                            ? new Date(item.publish_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                            : "N/A"}
                      </td>
                      <td className="text-center py-3 px-6">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${STATUS_COLORS[item.status] || "bg-gray-100 text-gray-700"}`}>
                          {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "Draft"}
                        </span>
                      </td>
                      <td className="text-center py-3 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => router.push(`/institution-zone/dashboard/news/create?edit=${item.id}`)}
                            className="p-1.5 hover:bg-blue-50 rounded text-blue-600"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 hover:bg-red-50 rounded text-red-600"
                            title="Delete"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-medium">{(page - 1) * limit + 1}-{Math.min(page * limit, total)}</span>{" "}
                  of <span className="font-medium">{total}</span> news
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:opacity-50 hover:bg-gray-50"
                  >
                    <CaretLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium ${
                        page === i + 1
                          ? "bg-blue-600 text-white"
                          : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  {totalPages > 5 && <span className="text-gray-400">...</span>}
                  {totalPages > 5 && (
                    <button
                      onClick={() => setPage(totalPages)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm"
                    >
                      {totalPages}
                    </button>
                  )}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:opacity-50 hover:bg-gray-50"
                  >
                    <CaretRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NewsDirectoryPage;
