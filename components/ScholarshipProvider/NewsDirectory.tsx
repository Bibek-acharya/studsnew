"use client";

import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { toast } from "sonner";
import {
  Home,
  Newspaper,
  Search,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  scholarshipProviderApi,
  ProviderNews,
} from "@/services/scholarshipProviderApi";
import ConfirmationModal from "./common/ConfirmationModal";
import { safeHtml } from "@/lib/html";

const FALLBACK_NEWS: ProviderNews[] = [
  {
    id: 1,
    provider_id: 1,
    title: "Government Announces New Education Policy",
    short_desc: "New policy framework announced",
    content: "Ministry unveils comprehensive policy framework",
    image_url:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800&h=400",
    news_type: "news",
    published_by: "Education Ministry",
    publish_date: "2026-04-20",
    tags: ["education", "policy"],
    allow_comments: true,
    status: "published",
    published_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: "",
  },
  {
    id: 2,
    provider_id: 1,
    title: "Leadership Training 2026 Completed",
    short_desc: "Workshop concludes successfully",
    content: "3-day workshop with 50+ participants",
    image_url:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800&h=400",
    news_type: "update",
    published_by: "Youth Center",
    publish_date: "2026-03-31",
    tags: ["training", "leadership"],
    allow_comments: false,
    status: "published",
    published_at: "2026-03-31",
    created_at: "2026-03-31",
    updated_at: "",
  },
  {
    id: 3,
    provider_id: 1,
    title: "Scholarship Partnership with 100 Group",
    short_desc: "New partnership announced",
    content: "Nationwide program for underprivileged students",
    image_url:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800&h=400",
    news_type: "press-release",
    published_by: "Partnership Office",
    publish_date: "2025-10-27",
    tags: ["scholarship", "partnership"],
    allow_comments: true,
    status: "published",
    published_at: "2025-10-27",
    created_at: "2025-10-27",
    updated_at: "",
  },
  {
    id: 4,
    provider_id: 1,
    title: "Leadership Training Workshop Highlights",
    short_desc: "Key takeaways from workshop",
    content: "Storytelling for effective leadership",
    image_url:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800&h=400",
    news_type: "news",
    published_by: "Training Institute",
    publish_date: "2025-09-17",
    tags: ["workshop", "storytelling"],
    allow_comments: true,
    status: "published",
    published_at: "2025-09-17",
    created_at: "2025-09-17",
    updated_at: "",
  },
  {
    id: 5,
    provider_id: 1,
    title: "Children's Day Celebration 2025",
    short_desc: "Community celebration recap",
    content: "Joyful celebration with community children",
    image_url:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800&h=400",
    news_type: "announcement",
    published_by: "Community Center",
    publish_date: "2025-09-17",
    tags: ["children", "celebration"],
    allow_comments: false,
    status: "published",
    published_at: "2025-09-17",
    created_at: "2025-09-17",
    updated_at: "",
  },
];

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

interface NewsDirectoryProps {
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
}

const NewsDirectory: React.FC<NewsDirectoryProps> = memo(
  ({ onView, onEdit }) => {
    const [news, setNews] = useState<ProviderNews[]>([]);
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
          const res = await scholarshipProviderApi.getNews(page, limit);
          setNews(res.news);
          setTotal(res.meta.total);
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
      async (id: number) => {
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
        await scholarshipProviderApi.deleteNews(newsId);
        setNews((prev) => prev.filter((n) => n.id !== newsId));
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to delete news",
        );
      }
    }, [deleteModal.newsId]);

    const totalPages = Math.ceil(total / limit);

    if (loading) {
      return (
        <div className="py-12 text-center text-slate-500">Loading news...</div>
      );
    }

    return (
      <div className="space-y-6">
        <ConfirmationModal
          isOpen={deleteModal.isOpen}
          title="Delete News Item"
          message={`Are you sure you want to delete \"${deleteModal.title}\"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDeleteNews}
          onCancel={() =>
            setDeleteModal({ isOpen: false, newsId: null, title: "" })
          }
          destructive
        />

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
          </div>

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
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      No news found
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => {
                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <img
                            src={
                              item.image_url ||
                              "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800&h=400"
                            }
                            alt={item.title}
                            className="w-20 h-14 object-cover rounded-lg border border-gray-200"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-gray-900">
                            {item.title}
                          </p>
                          {item.short_desc ? (
                            <p
                              className="text-xs text-gray-500"
                              dangerouslySetInnerHTML={{
                                __html: safeHtml(
                                  item.short_desc.slice(0, 60) +
                                    (item.short_desc.length > 60 ? "..." : ""),
                                ),
                              }}
                            />
                          ) : (
                            <p className="text-xs text-gray-500">
                              {item.content
                                ?.replace(/<[^>]*>/g, "")
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
                            : "N/A"}
                        </td>
                        <td className="text-center py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${STATUS_COLORS[item.status] || "bg-gray-100 text-gray-700"}`}
                          >
                            {item.status.charAt(0).toUpperCase() +
                              item.status.slice(1)}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              className="p-1.5 hover:bg-blue-50 rounded text-blue-600"
                              title="View"
                              onClick={() => onView?.(item.id)}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1.5 hover:bg-green-50 rounded text-green-600"
                              title="Edit"
                              onClick={() => onEdit?.(item.id)}
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1.5 hover:bg-red-50 rounded text-red-600"
                              title="Delete"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
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
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium ${page === i + 1 ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
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
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  },
);

NewsDirectory.displayName = "NewsDirectory";

export default NewsDirectory;
