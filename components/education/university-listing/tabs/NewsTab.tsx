"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Newspaper, Calendar } from "lucide-react";
import { apiService } from "@/services/api";
import EmptyTabState from "@/app/find-college/[id]/components/EmptyTabState";

interface NewsTabProps {
  universityId: number;
}

const mapNewsToUiCategory = (article: any): string => {
  const cat = article.category?.toLowerCase() || "";
  if (["admission", "academic", "academics"].includes(cat)) return "Admission";
  if (["scholarship"].includes(cat)) return "Scholarship";
  if (["exam", "exams", "tech"].includes(cat)) return "Exams";
  if (["news", "announcement", "announcements"].includes(cat)) return "News";
  if (["notice", "policy", "press-release", "update"].includes(cat)) return "Notice";
  if (["event", "events", "sports"].includes(cat)) return "Events";
  if (["achievement", "achievements"].includes(cat)) return "Achievements";
  return "Others";
};

const newsCategoryBadgeClass = (category: string) => {
  if (category === "Exams") return "bg-orange-100 text-orange-700";
  if (category === "Admission") return "bg-blue-100 text-blue-700";
  if (category === "Scholarship") return "bg-emerald-100 text-emerald-700";
  if (category === "News") return "bg-cyan-100 text-cyan-700";
  if (category === "Notice") return "bg-violet-100 text-violet-700";
  if (category === "Events") return "bg-pink-100 text-pink-700";
  if (category === "Achievements") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
};

export default function NewsTab({ universityId }: NewsTabProps) {
  const [uniNews, setUniNews] = useState<any[]>([]);
  const [uniNewsLoading, setUniNewsLoading] = useState(false);
  const [newsCategory, setNewsCategory] = useState("all");

  useEffect(() => {
    if (!universityId) return;
    (async () => {
      setUniNewsLoading(true);
      try {
        const params: any = { page: 1, limit: 50 };
        if (newsCategory !== "all") params.category = newsCategory;
        const res = await apiService.getUniversityNews(universityId, params);
        const list = res?.data?.news || res?.news || [];
        setUniNews(list);
      } catch {
        setUniNews([]);
      } finally {
        setUniNewsLoading(false);
      }
    })();
  }, [universityId, newsCategory]);

  return (
    <div className="px-4 sm:px-0">
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">News & Notices</h2>
        <p className="mt-1 text-[14px] text-gray-500">Latest updates and announcements.</p>
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        {["all", "Admission", "Scholarship", "Exams", "News", "Notice", "Events", "Achievements", "Others"].map((cat) => (
          <button
            key={cat}
            onClick={() => setNewsCategory(cat)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${newsCategory === cat ? "bg-brand-blue text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {cat === "all" ? "All" : cat}
          </button>
        ))}
      </div>
      {uniNewsLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : uniNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {uniNews.map((item: any) => {
            const uiCategory = mapNewsToUiCategory(item);
            const dateStr = item.date ? new Date(item.date) : null;
            const formattedDate = dateStr && !isNaN(dateStr.getTime())
              ? dateStr.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              : item.date || "";
            return (
              <div key={item.id} className="flex items-center gap-4 rounded-md border border-gray-200 bg-white p-4 transition hover:border-blue-500/20">
                <div className="flex h-16 w-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                  {item.image ? (
                    <Image src={item.image} alt={item.title} width={96} height={64} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      <Newspaper className="text-2xl"></Newspaper>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/news/${item.slug || item.id}`}
                    className="font-bold text-gray-900 hover:text-brand-blue line-clamp-2 leading-snug cursor-pointer"
                  >
                    {item.title}
                  </Link>
                  <div className="mt-2 flex items-center gap-3 flex-wrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${newsCategoryBadgeClass(uiCategory)}`}>
                      {uiCategory}
                    </span>
                    <span className="flex items-center text-xs text-gray-500">
                      <Calendar className="mr-1.5 h-3.5 w-3.5"></Calendar> {formattedDate}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyTabState tabName="News & Notices" />
      )}
    </div>
  );
}
