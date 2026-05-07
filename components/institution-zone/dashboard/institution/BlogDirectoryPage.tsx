"use client";

import React, { useState, useMemo } from "react";
import { Plus, MagnifyingGlass, Pencil, Trash, Eye, User } from "@phosphor-icons/react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";

interface BlogItem {
  id: number;
  title: string;
  author: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
}

const INITIAL_BLOGS: BlogItem[] = [
  { id: 1, title: "The Future of Online Education in Nepal", author: "Dr. Robert Anderson", date: "May 05, 2026", category: "Education", excerpt: "Exploring how digital platforms are transforming higher education across the country.", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80" },
  { id: 2, title: "Top 10 Career Paths for 2026 Graduates", author: "Prof. Sarah Kim", date: "May 02, 2026", category: "Career", excerpt: "A comprehensive guide to the most promising career opportunities for new graduates.", image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80" },
  { id: 3, title: "How AI is Reshaping Campus Learning", author: "Dr. Michael Chen", date: "Apr 28, 2026", category: "Technology", excerpt: "Artificial intelligence tools are revolutionizing the way students learn and interact.", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80" },
  { id: 4, title: "Student Life: Balancing Academics and Fun", author: "Emily Johnson", date: "Apr 25, 2026", category: "Campus Life", excerpt: "Tips and tricks for maintaining a healthy balance between studies and campus activities.", image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80" },
  { id: 5, title: "The Rise of Interdisciplinary Studies", author: "Dr. Robert Anderson", date: "Apr 20, 2026", category: "Education", excerpt: "Why combining multiple fields of study is becoming essential in modern education.", image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80" },
  { id: 6, title: "Building a Strong Tech Resume", author: "Prof. Sarah Kim", date: "Apr 15, 2026", category: "Career", excerpt: "Practical advice for students looking to stand out in the competitive tech job market.", image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&q=80" },
  { id: 7, title: "Campus Sustainability Initiatives", author: "Emily Johnson", date: "Apr 10, 2026", category: "Campus Life", excerpt: "How our campus is leading the way in environmental sustainability and green practices.", image: "https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80" },
];

const categoryStyles: Record<string, string> = {
  Education: "bg-blue-100 text-blue-700",
  Technology: "bg-purple-100 text-purple-700",
  "Campus Life": "bg-green-100 text-green-700",
  Career: "bg-amber-100 text-amber-700",
};

const BlogDirectoryPage: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogItem[]>(INITIAL_BLOGS);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredBlogs = useMemo(() => {
    return blogs.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === "all" || item.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [blogs, search, categoryFilter]);

  const handleDelete = (id: number) => {
    setBlogs((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <SectionHeader
        title="Blog Directory"
        breadcrumbItems={[
          { label: "Dashboard", href: "/institution-zone/dashboard" },
          { label: "Blogs" },
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
              placeholder="Search blogs..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
          >
            <option value="all">All Categories</option>
            <option>Education</option>
            <option>Technology</option>
            <option>Campus Life</option>
            <option>Career</option>
          </select>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap">
          <Plus size={18} />
          Create Blog
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBlogs.map((item) => (
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
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">{item.excerpt}</p>
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                <User size={14} />
                <span>{item.author}</span>
              </div>
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

export default BlogDirectoryPage;
