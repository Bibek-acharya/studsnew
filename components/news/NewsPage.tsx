"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { FolderOpen } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import { getPublicNews } from "@/services/scholarshipProviderApi";
import { apiService } from "@/services/api";

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  source: string;
  tags: string[];
  featured?: boolean;
}

const stripHtml = (html: string) => {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
};

const timeAgo = (dateStr: string) => {
  if (!dateStr) return "Recently";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 0)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

type NewsCategoryFilter =
  | "All News"
  | "Admission"
  | "Scholarship"
  | "Exams"
  | "News"
  | "Notice"
  | "Events"
  | "Achievements"
  | "Others";

const categoryPills: NewsCategoryFilter[] = [
  "All News",
  "Admission",
  "Scholarship",
  "Exams",
  "News",
  "Notice",
  "Events",
  "Achievements",
  "Others",
];

const categoryBadgeClass = (category: NewsCategoryFilter) => {
  if (category === "Exams") return "bg-orange-100 text-orange-700";
  if (category === "Admission") return "bg-blue-100 text-blue-700";
  if (category === "Scholarship") return "bg-emerald-100 text-emerald-700";
  if (category === "News") return "bg-cyan-100 text-cyan-700";
  if (category === "Notice") return "bg-violet-100 text-violet-700";
  if (category === "Events") return "bg-pink-100 text-pink-700";
  if (category === "Achievements") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
};

const mapNewsToUiCategory = (article: NewsArticle): NewsCategoryFilter => {
  const cat = article.category?.toLowerCase() || "";
  if (["admission", "academic", "academics"].includes(cat)) return "Admission";
  if (["scholarship"].includes(cat)) return "Scholarship";
  if (["exam", "exams", "tech"].includes(cat)) return "Exams";
  if (["news", "announcement", "announcements"].includes(cat)) return "News";
  if (["notice", "policy", "press-release", "update"].includes(cat))
    return "Notice";
  if (["event", "events", "sports"].includes(cat)) return "Events";
  if (["achievement", "achievements"].includes(cat)) return "Achievements";
  return "Others";
};

const NewsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] =
    useState<NewsCategoryFilter>("All News");
  const [sortBy, setSortBy] = useState<"Newest First" | "Oldest First">(
    "Newest First",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [allNews, setAllNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      let news: NewsArticle[] = [];
      try {
        const providerData = await getPublicNews(1, 20);
        if (providerData?.news && providerData.news.length > 0) {
          news = providerData.news.map((n: any): NewsArticle => ({
            id: `provider-${n.id}`,
            title: n.title,
            excerpt: n.short_desc || "",
            content: n.content || n.short_desc || "",
            category: n.news_type || "News",
            image: n.image_url || "",
            author: n.published_by || "Provider",
            date: n.publish_date || new Date(n.created_at).toLocaleDateString(),
            readTime: "3 min",
            source: n.published_by || "Provider",
            tags: n.tags || [],
          }));
        }
      } catch (e) {
        console.warn("Failed to fetch provider news:", e);
      }
      try {
        const instRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/v1/institutions/public/news?page=1&limit=20`,
        );
        const instData = await instRes.json();
        const instNews = instData?.data?.news || [];
        if (instNews.length > 0) {
          const mapped = instNews.map((n: any): NewsArticle => ({
            id: `inst-${n.id}`,
            title: n.title,
            excerpt: n.short_desc || "",
            content: n.content || n.short_desc || "",
            category: n.news_type || "News",
            image: n.image_url || "",
            author: n.published_by || "Institution",
            date: n.publish_date || n.published_at || n.created_at || "",
            readTime: "3 min",
            source: n.published_by || "Institution",
            tags: n.tags || [],
          }));
          news = [...news, ...mapped];
        }
      } catch (e) {
        console.warn("Failed to fetch institution news:", e);
      }
      try {
        const eduData = await apiService.getEducationNews({
          page: 1,
          limit: 20,
        });
        const eduNews = eduData?.data?.news || [];
        if (eduNews.length > 0) {
          const mapped = eduNews.map((n: any): NewsArticle => ({
            id: `edu-${n.id}`,
            title: n.title,
            excerpt: n.excerpt || "",
            content: n.content || "",
            category: n.category || "News",
            image: n.image || "",
            author: n.author || "Admin",
            date: n.date || new Date(n.created_at).toLocaleDateString(),
            readTime: n.readTime || "3 min",
            source: n.source || "Admin",
            tags: n.tags || [],
            featured: n.featured === true,
          }));
          news = [...news, ...mapped];
        }
      } catch (e) {
        console.warn("Failed to fetch education news:", e);
      }
      setAllNews(news);
      setLoading(false);
    }
    fetchNews();
  }, []);

  const featuredNews =
    allNews.find((n) => n.featured === true) ||
    allNews.toSorted(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )[0];

  const processedNews = useMemo(() => {
    const filtered =
      activeCategory === "All News"
        ? allNews
        : allNews.filter(
            (article) => mapNewsToUiCategory(article) === activeCategory,
          );

    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (isNaN(dateA)) return 1;
      if (isNaN(dateB)) return -1;
      return sortBy === "Newest First" ? dateB - dateA : dateA - dateB;
    });

    return sorted;
  }, [activeCategory, allNews, sortBy]);

  const itemsPerPage = 8;
  const totalPages = Math.max(
    1,
    Math.ceil(processedNews.length / itemsPerPage),
  );
  const paginatedNews = processedNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <main className="max-w-350 mx-auto py-10 space-y-14 min-h-screen text-slate-800 px-4 sm:px-6">
      <section>
        <h1 className="text-3xl font-bold text-slate-900 mb-5">
          Browse by category
        </h1>
        <div className="flex items-center gap-3 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categoryPills.map((pill) => {
            const isActive = activeCategory === pill;
            return (
              <button
                key={pill}
                onClick={() => setActiveCategory(pill)}
                className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-all  ${
                  isActive
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-white border border-gray-200 text-slate-700 hover:bg-gray-50 hover:border-gray-300"
                }`}
              >
                {pill}
              </button>
            );
          })}
        </div>
      </section>

      {featuredNews && (
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-5">
            Featured Story of the Week
          </h2>
          <Link
            href={`/news/${featuredNews.id}`}
            className="relative w-full h-112.5 sm:h-100 rounded-md overflow-hidden shadow-lg group cursor-pointer block"
          >
            <img
              src={featuredNews.image}
              alt={featuredNews.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
            />

            <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/50 to-transparent"></div>

            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 w-full">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Featured
                    </span>
                    <div className="flex items-center text-gray-300 text-sm font-medium">
                      <i className="fa-regular fa-clock mr-1.5 opacity-80"></i>
                      {timeAgo(featuredNews.date)}
                    </div>
                  </div>

                  <h3 className="text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight tracking-tight">
                    {featuredNews.title}
                  </h3>
                  <p className="text-gray-200 text-base sm:text-lg font-medium line-clamp-2">
                    {stripHtml(featuredNews.excerpt)}
                  </p>
                </div>

                <button className="w-full sm:w-auto bg-white text-slate-900 font-semibold px-6 py-3 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-all duration-200  whitespace-nowrap">
                  Read Full Story
                </button>
              </div>
            </div>
          </Link>
        </section>
      )}

      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-3xl font-bold text-slate-900">
            Latest News & stories
          </h2>
          <div className="flex items-center text-sm font-medium text-slate-600">
            <span className="mr-2">Sort by:</span>
            <label className="flex items-center gap-1 bg-white border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500">
              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(
                    event.target.value as "Newest First" | "Oldest First",
                  )
                }
                className="bg-transparent outline-none"
              >
                <option>Newest First</option>
                <option>Oldest First</option>
              </select>
              <i className="fa-solid fa-chevron-down text-xs ml-1 text-gray-400"></i>
            </label>
          </div>
        </div>

        {loading ? (
          <div
            id="news-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-md p-5 animate-pulse"
              >
                <div className="mb-4 h-5 w-20 bg-gray-200 rounded-full" />
                <div className="rounded-md overflow-hidden aspect-16/10 mb-5 bg-gray-200 h-30" />
                <div className="h-5 bg-gray-200 rounded mb-2" />
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-5" />
                <div className="pt-4 border-t border-gray-100">
                  <div className="h-4 bg-gray-200 rounded w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            id="news-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {paginatedNews.map((item) => {
              const uiCategory = mapNewsToUiCategory(item);

              return (
                <article
                  key={item.id}
                  className="bg-white border border-gray-100 hover:border-blue-500/20 rounded-md p-5 flex flex-col transition-all duration-300 group cursor-pointer"
                >
                  <div className="mb-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${categoryBadgeClass(
                        uiCategory,
                      )}`}
                    >
                      {uiCategory}
                    </span>
                  </div>

                  <div className="rounded-md overflow-hidden aspect-16/10 mb-5 bg-gray-100 h-30">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  </div>

                  <Link
                    href={`/news/${item.id}`}
                    className="font-bold text-lg text-slate-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors "
                  >
                    {item.title}
                  </Link>
                  <p className="text-slate-500 text-sm mb-5 grow line-clamp-2 leading-relaxed">
                    {stripHtml(item.excerpt)}
                  </p>

                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-sm mt-auto">
                    <span className="text-slate-400 flex items-center font-medium">
                      <i className="fa-regular fa-clock mr-1.5"></i>{" "}
                      {timeAgo(item.date)}
                    </span>
                    <Link
                      href={`/news/${item.id}`}
                      className="text-blue-600 font-semibold flex items-center group-hover:translate-x-1 transition-transform duration-200"
                    >
                      View Details
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {!loading && processedNews.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <FolderOpen className="w-32 h-32 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg font-medium mb-6">
              No news information is currently available.
            </p>
            <Link
              href="/"
              className="bg-[#0000ff] hover:bg-[#0000cc] cursor-pointer text-white font-semibold py-2.5 px-6 rounded-md transition-colors text-sm"
            >
              Explore More
            </Link>
          </div>
        )}
      </section>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </main>
  );
};

export default NewsPage;
