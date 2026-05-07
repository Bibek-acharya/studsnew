"use client";

import React, { useState, useMemo } from "react";
import { Plus, MagnifyingGlass, Pencil, Trash, Eye } from "@phosphor-icons/react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";

interface NewsItem {
  id: number;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  image: string;
}

const INITIAL_NEWS: NewsItem[] = [
  { id: 1, title: "Annual Sports Day 2026 Announced", category: "Events", date: "May 05, 2026", excerpt: "The annual sports day will feature inter-college competitions and guest appearances.", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80" },
  { id: 2, title: "Final Exam Schedule Released", category: "Academic", date: "May 03, 2026", excerpt: "The final examination schedule for Spring 2026 semester has been published.", image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80" },
  { id: 3, title: "Campus Infrastructure Upgrade", category: "Announcement", date: "May 01, 2026", excerpt: "Major infrastructure upgrades including new labs and library facilities.", image: "https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80" },
  { id: 4, title: "Faculty Development Program", category: "General", date: "Apr 28, 2026", excerpt: "A week-long faculty training program on modern teaching methodologies.", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80" },
  { id: 5, title: "Scholarship Opportunities for 2026", category: "Academic", date: "Apr 25, 2026", excerpt: "New merit-based and need-based scholarships available for eligible students.", image: "https://images.unsplash.com/photo-1511629091441-ee46146481b6?w=600&q=80" },
  { id: 6, title: "Guest Lecture: AI in Education", category: "Events", date: "Apr 22, 2026", excerpt: "Renowned expert Dr. Sarah Kim will deliver a talk on artificial intelligence.", image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=600&q=80" },
  { id: 7, title: "College Day Celebrations", category: "Events", date: "Apr 18, 2026", excerpt: "College day celebrations with cultural performances and award ceremonies.", image: "https://images.unsplash.com/photo-1562504208-03d85ce8fa30?w=600&q=80" },
];

const categoryStyles: Record<string, string> = {
  Academic: "bg-blue-100 text-blue-700",
  Events: "bg-purple-100 text-purple-700",
  Announcement: "bg-amber-100 text-amber-700",
  General: "bg-green-100 text-green-700",
};

const NewsDirectoryPage: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === "all" || item.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [news, search, categoryFilter]);

  const handleDelete = (id: number) => {
    setNews((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <SectionHeader
        title="News Directory"
        breadcrumbItems={[
          { label: "Dashboard", href: "/institution-zone/dashboard" },
          { label: "News" },
        ]}
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search news..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Academic">Academic</option>
            <option value="Events">Events</option>
            <option value="Announcement">Announcement</option>
            <option value="General">General</option>
          </select>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap">
          <Plus size={18} />
          Create News
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredNews.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="h-48 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryStyles[item.category]}`}>
                  {item.category}
                </span>
                <span className="text-xs text-gray-400">{item.date}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{item.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4">{item.excerpt}</p>
              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Eye size={18} />
                </button>
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsDirectoryPage;
