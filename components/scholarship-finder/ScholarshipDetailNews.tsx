"use client";

import { useState, useEffect, useMemo } from "react";
import { Calendar, CheckCircle, ExternalLink, Users, FileText } from "lucide-react";
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

export default function NewsTab({ scholarship }: { scholarship: any }) {
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
              n.published_by?.toLowerCase().includes(q)
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
    return () => { mounted = false; };
  }, [scholarship.provider_id, scholarship.provider]);

  const data = useMemo(() => {
    const items: any[] = [];
    if (providerNews && !loading) {
      items.push(...providerNews.map((n: any) => ({
        title: n.title,
        description: stripHtml(n.short_desc || n.content || "").substring(0, 150),
        category: n.news_type || "Notice",
        date: n.publish_date || n.created_at?.split("T")[0] || "",
        link: n.id ? `/news/provider-${n.id}` : "#",
        _src: "provider",
      })));
    }
    if (scholarship.news_items?.length) {
      items.push(...scholarship.news_items.map((item: any) => ({
        title: item.title,
        description: stripHtml(item.description || ""),
        category: item.category,
        date: item.date,
        link: item.link || "#",
        _src: "embedded",
      })));
    }
    return items.length > 0 ? items.slice(0, 6) : null;
  }, [providerNews, loading, scholarship.news_items]);

  const displayData = !loading && !data ? [
    { title: "Entrance Examination Schedule Published", description: "The entrance examination for Project Shiksha Scholarship 2082 will be held on Shrawan 1, 2082 at all exam centers across Nepal.", category: "Notice", date: "22 Apr 2026", link: "#" },
    { title: "Final Scholarship Result Published", description: "The final result for Project Shiksha Scholarship 2082 has been published. 110 students selected.", category: "Result", date: "15 Apr 2026", link: "https://projectshiksha.hundredgroupnepal.org/final-result" },
    { title: "Leadership Training Workshop 2026", description: "Successful 3-day leadership training workshop for scholarship recipients conducted in April 2026.", category: "Event", date: "10 Apr 2026", link: "#" },
    { title: "Application Deadline Extended", description: "Due to overwhelming response, the application deadline has been extended until Ashad 30, 2082.", category: "Update", date: "28 Jun 2025", link: "#" },
  ] : data;
  const gradients = ["from-blue-500 to-blue-600", "from-green-500 to-green-600", "from-purple-500 to-purple-600", "from-orange-500 to-orange-600"];
  const badgeColors = ["bg-blue-50 text-blue-600", "bg-green-50 text-green-600", "bg-purple-50 text-purple-600", "bg-orange-50 text-orange-600"];
  const icons = [<FileText size={80} className="text-white/90" />, <CheckCircle size={80} className="text-white/90" />, <Users size={80} className="text-white/90" />, <Calendar size={80} className="text-white/90" />];
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">News & Notice</h2>
        <p className="mt-1 text-[14px] text-gray-500">Stay updated with our latest announcements and stories</p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {displayData ? displayData.map((item, i) => (
          <div key={i} className="overflow-hidden rounded-md border border-gray-100 bg-white">
            <div className="p-4 pb-0">
              <div className={`flex h-40 items-center justify-center rounded-md bg-gradient-to-br ${gradients[i % gradients.length]} overflow-hidden`}>
                {icons[i % icons.length]}
              </div>
            </div>
            <div className="p-5">
              <div className="mb-3">
                <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold ${badgeColors[i % badgeColors.length]}`}>{item.category || "Notice"}</span>
              </div>
              <h3 className="mb-2 text-[16px] font-bold text-gray-900">{item.title}</h3>
              <p className="mb-4 text-[13px] text-gray-600 line-clamp-2">{item.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
                  <Calendar size={16} /><span>{item.date}</span>
                </div>
                {item.link && (
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[13px] font-bold text-blue-600 hover:text-blue-700">
                  Read More <ExternalLink size={16} />
                </a>
                )}
              </div>
            </div>
          </div>
        )) : Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-md border border-gray-100 bg-white">
            <div className="p-4 pb-0">
              <div className="h-40 animate-pulse rounded-md bg-gray-200" />
            </div>
            <div className="p-5 space-y-3">
              <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200" />
              <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="space-y-1.5">
                <div className="h-3.5 animate-pulse rounded bg-gray-100" />
                <div className="h-3.5 w-2/3 animate-pulse rounded bg-gray-100" />
              </div>
              <div className="flex items-center justify-between">
                <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
