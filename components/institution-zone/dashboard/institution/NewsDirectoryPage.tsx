"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Newspaper,
  Pencil,
  Trash,
  Spinner,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import { Home, Search, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  institutionNewsApi,
  InstitutionNews,
} from "@/services/institutionNewsApi";

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

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800&h=400";

const NewsDirectoryPage: React.FC = () => {
  const router = useRouter();
  const [news, setNews] = useState<InstitutionNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    newsId: number | null;
    title: string;
  }>({
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
    return news.filter((n) =>
      n.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [news, search]);

  const handleDelete = useCallback(
    (id: number) => {
      const target = news.find((item) => item.id === id);
      setDeleteModal({
        isOpen: true,
        newsId: id,
        title: target?.title || "this news item",
      });
    },
    [news],
  );

  const confirmDeleteNews = useCallback(async () => {
    if (!deleteModal.newsId) return;
    const newsId = deleteModal.newsId;
    setDeleteModal({ isOpen: false, newsId: null, title: "" });
    try {
      await institutionNewsApi.delete(newsId);
      setNews((prev) => prev.filter((n) => n.id !== newsId));
      toast.success("News deleted successfully.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete news",
      );
    }
  }, [deleteModal.newsId]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Delete News Item
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete &ldquo;{deleteModal.title}&rdquo;?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() =>
                  setDeleteModal({ isOpen: false, newsId: null, title: "" })
                }
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteNews}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
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
              />
            </div>
            <button
              onClick={() =>
                router.push("/institution-zone/dashboard/news/create")
              }
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} /> Create News
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
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Image
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Title
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">
                      Type
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">
                      Author
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">
                      Published
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-8 text-center text-gray-500"
                      >
                        {search
                          ? "No news found matching your search."
                          : "No news yet. Create your first news item!"}
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <img
                            src={item.image_url || FALLBACK_IMAGE}
                            alt={item.title}
                            className="w-20 h-14 object-cover rounded-lg border border-gray-200"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-gray-900">
                            {item.title}
                          </p>
                          {item.short_desc && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {item.short_desc
                                .replace(/<[^>]*>/g, "")
                                .replace(/&nbsp;/g, " ")
                                .replace(/&amp;/g, "&")
                                .replace(/\s+/g, " ")
                                .trim()
                                .slice(0, 60)}
                            </p>
                          )}
                          {!item.short_desc && item.content && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {item.content
                                .replace(/<[^>]*>/g, "")
                                .replace(/&nbsp;/g, " ")
                                .replace(/&amp;/g, "&")
                                .replace(/\s+/g, " ")
                                .trim()
                                .slice(0, 60)}
                            </p>
                          )}
                        </td>
                        <td className="text-center py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${TYPE_COLORS[item.news_type] || "bg-gray-100 text-gray-700"}`}
                          >
                            {NEWS_TYPES[item.news_type] ||
                              item.news_type ||
                              "News"}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4 text-gray-600">
                          {item.published_by || "Admin"}
                        </td>
                        <td className="text-center py-3 px-4 text-gray-500">
                          {item.published_at
                            ? new Date(item.published_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )
                            : item.publish_date
                              ? new Date(
                                  item.publish_date,
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "N/A"}
                        </td>
                        <td className="text-center py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${STATUS_COLORS[item.status] || "bg-gray-100 text-gray-700"}`}
                          >
                            {item.status
                              ? item.status.charAt(0).toUpperCase() +
                                item.status.slice(1)
                              : "Draft"}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() =>
                                router.push(
                                  `/institution-zone/dashboard/news/create?edit=${item.id}`,
                                )
                              }
                              className="p-1.5 hover:bg-green-50 rounded text-green-600"
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
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-medium">
                    {(page - 1) * limit + 1}-{Math.min(page * limit, total)}
                  </span>{" "}
                  of <span className="font-medium">{total}</span> news
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
                  >
                    <CaretLeft className="w-4 h-4" />
                  </button>
                  {Array.from(
                    { length: Math.min(totalPages, 5) },
                    (_, i) => (
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
                    ),
                  )}
                  {totalPages > 5 && (
                    <span className="text-gray-400">...</span>
                  )}
                  {totalPages > 5 && (
                    <button
                      onClick={() => setPage(totalPages)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm"
                    >
                      {totalPages}
                    </button>
                  )}
                  <button
                    onClick={() =>
                      setPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={page === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
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
