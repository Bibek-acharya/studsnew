"use client";

import { useState, useEffect, useMemo } from "react";
import { ExternalLink, Trophy } from "lucide-react";
import { getPublicNews } from "@/services/scholarshipProviderApi";

const decodeEntities = (text: string) => {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
};

const stripHtml = (html: string) => {
  if (!html) return "";
  return decodeEntities(html.replace(/<[^>]*>/g, ""));
};

export default function AchievementsTab({ scholarship }: { scholarship: any }) {
  const [providerNews, setProviderNews] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getPublicNews(1, 50);
        if (!mounted) return;
        if (data?.news?.length) {
          const pid = scholarship.provider_id;
          const pname = scholarship.provider;
          let filtered = data.news;
          if (pid) {
            filtered = data.news.filter((n: any) => n.provider_id === pid);
          } else if (pname) {
            const q = pname.toLowerCase().split("|")[0].trim();
            filtered = data.news.filter((n: any) =>
              n.published_by?.toLowerCase().includes(q),
            );
          }
          setProviderNews(filtered);
        } else {
          setProviderNews([]);
        }
      } catch {
        setProviderNews(null);
      }
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [scholarship.provider_id, scholarship.provider]);

  const items = useMemo(() => {
    const result: any[] = [];

    if (providerNews && !loading) {
      const achievementNews = providerNews.filter(
        (n: any) => n.news_type?.toLowerCase() === "achievement",
      );
      for (const n of achievementNews) {
        result.push({
          title: n.title,
          description: stripHtml(n.short_desc || n.content || "").substring(
            0,
            150,
          ),
          badge: "Achievement",
          tags: n.tags || [],
          link: n.id ? `/news/${(n as any).slug || `provider-${n.id}`}` : "#",
          image_url: n.image_url,
        });
      }
    }

    if (scholarship.news_items?.length) {
      const achievementItems = scholarship.news_items.filter(
        (item: any) => item.category?.toLowerCase() === "achievement",
      );
      for (const item of achievementItems) {
        result.push({
          title: item.title,
          description: stripHtml(item.description || ""),
          badge: "Achievement",
          tags: [],
          link: item.link || "#",
        });
      }
    }

    if (Array.isArray(scholarship.achievements)) {
      for (const a of scholarship.achievements) {
        result.push({
          title: a.title,
          description: a.description || "",
          badge: a.badge || "Achievement",
          tags: a.tags || [],
          link: a.link || "#",
        });
      }
    }

    return result;
  }, [providerNews, loading, scholarship.news_items, scholarship.achievements]);

  if (items.length === 0 && !loading) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-[20px] font-bold text-gray-900">
            Our Achievements
          </h2>
          <p className="mt-1 text-[14px] text-gray-500">
            Milestones and success stories
          </p>
        </div>
        <div className="py-16 text-center text-gray-400">
          <p className="text-[15px] font-medium">
            No achievements information available
          </p>
        </div>
      </div>
    );
  }

  const gradients = [
    "from-yellow-500 to-yellow-600",
    "from-blue-500 to-blue-600",
    "from-green-500 to-green-600",
    "from-purple-500 to-purple-600",
  ];
  const badgeColors = [
    "bg-green-50 text-green-600",
    "bg-yellow-50 text-yellow-600",
    "bg-green-50 text-green-600",
    "bg-purple-50 text-purple-600",
  ];
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">
          Our Achievements
        </h2>
        <p className="mt-1 text-[14px] text-gray-500">
          Milestones and success stories
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {items.map((item, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-md border border-gray-100 bg-white"
          >
            <div className="p-4 pb-0">
              {item.image_url ? (
                <div className="h-40 overflow-hidden rounded-md">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div
                  className={`flex h-40 items-center justify-center overflow-hidden rounded-md bg-gradient-to-br ${gradients[i % gradients.length]}`}
                >
                  <Trophy size={80} className="text-white/90" />
                </div>
              )}
            </div>
            <div className="p-5">
              <div className="mb-3">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold ${badgeColors[i % badgeColors.length]}`}
                >
                  {item.badge || "Achievement"}
                </span>
              </div>
              <h3 className="mb-2 text-[16px] font-bold text-gray-900">
                {item.title}
              </h3>
              <p className="mb-4 text-[13px] text-gray-600 line-clamp-2">
                {item.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(item.tags) &&
                    item.tags.map((tag: string, j: number) => (
                      <span
                        key={j}
                        className="rounded-md bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-600"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[13px] font-bold text-blue-600 hover:text-blue-700"
                  >
                    Read More <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
