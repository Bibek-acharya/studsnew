"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import EmptyTabState from "./EmptyTabState";

interface TabNewsProps {
  news: any[];
}

const TabNews: React.FC<TabNewsProps> = ({ news }) => {
  const router = useRouter();
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  const categories = useMemo(() => {
    const cats = new Set<string>();
    news.forEach((n) => {
      if (n.badge || n.category) cats.add(n.badge || n.category);
    });
    return Array.from(cats).sort();
  }, [news]);

  const filtered = useMemo(() => {
    return news.filter((n) => {
      if (category !== "all" && (n.badge || n.category) !== category) return false;
      return true;
    });
  }, [news, category]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (news.length === 0) return <EmptyTabState tabName="news" />;

  const getCategoryBadgeClass = (cat: string): string => {
    const lower = cat.toLowerCase();
    if (lower.includes("admission")) return "bg-blue-500 text-white";
    if (lower.includes("scholarship")) return "bg-green-500 text-white";
    if (lower.includes("exam")) return "bg-amber-500 text-white";
    if (lower.includes("event")) return "bg-purple-500 text-white";
    if (lower.includes("achievement")) return "bg-pink-500 text-white";
    return "bg-gray-500 text-white";
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">News & Notices</h2>
        <p className="mt-1 text-[14px] text-gray-500">Latest updates and announcements.</p>
      </div>

      {categories.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => { setCategory("all"); setPage(1); }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${category === "all" ? "bg-brand-blue text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setPage(1); }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${category === cat ? "bg-brand-blue text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {paginated.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginated.map((item: any) => {
            const dateStr = item.time || "";
            return (
              <div key={item.id || item.title} className="flex items-center gap-4 rounded-md border border-gray-200 bg-white p-4 transition hover:border-blue-500/20">
                <div className="flex h-16 w-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      <i className="fa-regular fa-newspaper text-2xl"></i>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => router.push(`/news/${item.slug || `inst-${item.id}`}`)}
                    className="font-bold text-gray-900 hover:text-brand-blue line-clamp-2 leading-snug text-left cursor-pointer"
                  >
                    {item.title}
                  </button>
                  <div className="mt-2 flex items-center gap-3 flex-wrap">
                    {(item.badge || item.category) && (
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${getCategoryBadgeClass(item.badge || item.category)}`}>
                        {item.badge || item.category}
                      </span>
                    )}
                    {dateStr && (
                      <span className="flex items-center text-xs text-gray-500">
                        <i className="fa-regular fa-calendar mr-1.5"></i> {dateStr}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyTabState tabName="News & Notices" />
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              className={`h-10 w-10 rounded-md text-sm font-bold transition ${page === idx + 1 ? "bg-brand-blue text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              onClick={() => setPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TabNews;
