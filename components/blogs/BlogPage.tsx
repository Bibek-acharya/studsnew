"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { getAllBlogs } from "@/lib/blogs-data";
import Pagination from "@/components/ui/Pagination";

type BlogCategoryFilter =
  | "All News"
  | "Admission"
  | "Scholarship"
  | "Exams"
  | "Notice"
  | "Events"
  | "Achievements"
  | "Others";

const categoryPills: BlogCategoryFilter[] = [
  "All News",
  "Admission",
  "Scholarship",
  "Exams",
  "Notice",
  "Events",
  "Achievements",
  "Others",
];

const categoryFromBlog = (category: string): BlogCategoryFilter => {
  if (category === "Career Advice") return "Admission";
  if (category === "Study Tips") return "Exams";
  if (category === "Student Life") return "Others";
  return "Others";
};

const badgeClassFromCategory = (category: BlogCategoryFilter) => {
  if (category === "Scholarship") return "bg-emerald-500";
  if (category === "Admission") return "bg-blue-500";
  if (category === "Exams") return "bg-red-500";
  if (category === "Events") return "bg-purple-500";
  if (category === "Achievements") return "bg-amber-500";
  if (category === "Notice") return "bg-indigo-500";
  return "bg-slate-500";
};

const BlogPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<BlogCategoryFilter>("All News");
  const [sortBy, setSortBy] = useState<"Newest" | "Oldest" | "Most Popular">("Newest");
  const [currentPage, setCurrentPage] = useState(1);

  const blogs = getAllBlogs();
  const featuredBlog = blogs[0];

  const filteredBlogs = useMemo(() => {
    const base =
      activeCategory === "All News"
        ? blogs
        : blogs.filter((blog) => categoryFromBlog(blog.category) === activeCategory);

    return [...base].sort((a, b) => {
      if (sortBy === "Newest") return Number(b.id) - Number(a.id);
      if (sortBy === "Oldest") return Number(a.id) - Number(b.id);
      return b.title.localeCompare(a.title);
    });
  }, [activeCategory, blogs, sortBy]);

  const itemsPerPage = 8;
  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / itemsPerPage));
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="bg-white text-gray-800 antialiased pb-16 min-h-screen">
      <div className="max-w-[1400px] mx-auto py-8">
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">Browse by category</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categoryPills.map((pill) => {
              const isActive = activeCategory === pill;
              return (
                <button
                  key={pill}
                  onClick={() => setActiveCategory(pill)}
                  className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-blue-500 text-white shadow-sm"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {pill}
                </button>
              );
            })}
          </div>
        </section>

        {featuredBlog && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-5">Featured Story of the Week</h2>
            <Link
              href={`/blogs/${featuredBlog.id}`}
              className="relative w-full h-[350px] sm:h-[400px] rounded-2xl overflow-hidden group cursor-pointer block"
            >
              <img
                src={featuredBlog.image}
                alt={featuredBlog.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent"></div>

              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="max-w-3xl">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">Featured</span>
                      <div className="flex items-center text-gray-300 text-sm font-medium">
                        <i className="fa-regular fa-clock mr-1.5"></i>
                        90 days ago
                      </div>
                    </div>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                      {featuredBlog.title}
                    </h3>
                    <p className="text-gray-200 text-sm sm:text-base line-clamp-2">{featuredBlog.excerpt}</p>
                  </div>
                  <button className="bg-white text-gray-900 font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap shadow-sm self-start md:self-auto">
                    Read Full Story
                  </button>
                </div>
              </div>
            </Link>
          </section>
        )}

        <section>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-900">Latest Blogs</h2>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(event.target.value as "Newest" | "Oldest" | "Most Popular")
                  }
                  className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg px-4 py-2 pr-9 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors cursor-pointer shadow-sm"
                >
                  <option value="Newest">Newest</option>
                  <option value="Oldest">Oldest</option>
                  <option value="Most Popular">Most Popular</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-500">
                  <i className="fa-solid fa-chevron-down text-xs"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedBlogs.map((blog) => {
              const mappedCategory = categoryFromBlog(blog.category);
              return (
                <article
                  key={blog.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                >
                  <Link href={`/blogs/${blog.id}`} className="h-48 w-full overflow-hidden">
                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                  </Link>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-3">
                      <span
                        className={`${badgeClassFromCategory(mappedCategory)} text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider`}
                      >
                        {mappedCategory}
                      </span>
                      <div className="flex items-center text-gray-500 text-xs font-medium">
                        <i className="fa-regular fa-calendar mr-1"></i>
                        Oct, 25
                      </div>
                    </div>

                    <Link href={`/blogs/${blog.id}`} className="text-lg font-bold text-gray-900 leading-snug mb-2 line-clamp-2 hover:underline">
                      {blog.title}
                    </Link>
                    <p className="text-sm text-gray-500 line-clamp-3 mb-5 flex-1">{blog.excerpt}</p>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={`https://api.dicebear.com/7.x/notionists/svg?seed=${blog.authorAvatar}`}
                          alt={blog.author}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex flex-col justify-center">
                          <span className="text-xs font-bold text-gray-900 leading-none mb-1">{blog.author}</span>
                          <span className="text-[10px] text-gray-500 font-medium leading-none">Educator</span>
                        </div>
                      </div>
                      <Link href={`/blogs/${blog.id}`} className="text-xs font-semibold text-blue-600 flex items-center hover:underline">
                        View Details
                        <i className="fa-solid fa-chevron-right text-[10px] ml-1"></i>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredBlogs.length === 0 && (
            <div className="text-center py-10 text-slate-500 bg-white border border-gray-200 rounded-2xl mt-6">
              No blogs available for this category.
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
      </div>
    </div>
  );
};

export default BlogPage;
