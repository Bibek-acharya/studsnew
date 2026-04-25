"use client";

import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useRouter } from "next/navigation";
import { Newspaper, Search, Edit, Trash2, Eye } from "lucide-react";
import SectionCard from "./common/SectionCard";
import { scholarshipProviderApi, ProviderNews } from "@/services/scholarshipProviderApi";

const NewsDirectory: React.FC = memo(() => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [news, setNews] = useState<ProviderNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
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
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, [page]);

  const filtered = useMemo(() => {
    return news.filter((n) => {
      const matchSearch = n.title.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || n.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [news, search, statusFilter]);

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm("Delete this news item?")) return;
    try {
      await scholarshipProviderApi.deleteNews(id);
      setNews((prev) => prev.filter((n) => n.id !== id));
    } catch {
      alert("Failed to delete news");
    }
  }, []);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <SectionCard>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-blue-600" /> News Directory
          </h2>
          <span className="text-sm text-slate-500">Showing {filtered.length} of {total} news</span>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 flex items-center border border-slate-200 rounded-lg px-3 py-2 focus-within:border-blue-600">
            <Search className="w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search news..." className="bg-transparent border-none outline-none text-sm ml-2 w-full" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500">Loading news...</div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">News</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Date</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr><td colSpan={4} className="py-8 text-center text-slate-500">No news found</td></tr>
                ) : filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {item.image_url && <img src={item.image_url} alt={item.title} className="w-16 h-12 object-cover rounded-lg" />}
                        <span className="font-medium text-slate-900">{item.title}</span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === "published" ? "bg-green-100 text-green-700" :
                        item.status === "scheduled" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>{item.status}</span>
                    </td>
                    <td className="text-center py-3 px-4 text-slate-500">{new Date(item.created_at).toLocaleDateString()}</td>
                    <td className="text-center py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1.5 hover:bg-blue-50 rounded text-blue-600" title="View"><Eye className="w-4 h-4" /></button>
                        <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600" title="Edit"><Edit className="w-4 h-4" /></button>
                        <button className="p-1.5 hover:bg-red-50 rounded text-red-600" title="Delete" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4" /></button>
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

NewsDirectory.displayName = "NewsDirectory";

export default NewsDirectory;
