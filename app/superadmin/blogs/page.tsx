"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Filter,
  Calendar,
  User,
  Tag,
  ChevronLeft,
  X,
  Clock,
  LayoutGrid,
  List,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import Link from "next/link";
import {
  fetchAdminBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  BlogEntry,
} from "@/services/blogApi";

const CATEGORIES = [
  "Admission",
  "Scholarship",
  "Exams",
  "Notice",
  "Events",
  "Achievements",
  "Others"
];

const BlogManagement: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogEntry | null>(null);
  const [blogs, setBlogs] = useState<BlogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formAuthor, setFormAuthor] = useState("StudSphere Command");
  const [formCategory, setFormCategory] = useState("Admission");
  const [formPublished, setFormPublished] = useState(true);
  const [formFeatured, setFormFeatured] = useState(false);

  const loadBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const category = selectedCategory === "All" ? undefined : selectedCategory;
      const search = searchQuery || undefined;
      const result = await fetchAdminBlogs({ page: 1, limit: 50, category, search });
      setBlogs(result.blogs);
    } catch {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  const filteredBlogs = useMemo(() => {
    return blogs;
  }, [blogs]);

  const resetForm = () => {
    setFormTitle("");
    setFormExcerpt("");
    setFormContent("");
    setFormImage("");
    setFormAuthor("StudSphere Command");
    setFormCategory("Admission");
    setFormPublished(true);
    setFormFeatured(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      await deleteBlog(String(id));
      setBlogs(prev => prev.filter(b => b.id !== id));
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  };

  const handleEdit = (blog: BlogEntry) => {
    setEditingBlog(blog);
    setFormTitle(blog.title);
    setFormExcerpt(blog.excerpt);
    setFormContent(blog.content);
    setFormImage(blog.image);
    setFormAuthor(blog.author);
    setFormCategory(blog.category);
    setFormPublished(blog.published);
    setFormFeatured(blog.featured);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingBlog(null);
    resetForm();
    setIsFormOpen(true);
  };

  const handleSubmit = async () => {
    if (!formTitle.trim()) return;
    setSaving(true);
    try {
      if (editingBlog) {
        const updated = await updateBlog(String(editingBlog.id), {
          title: formTitle,
          excerpt: formExcerpt,
          content: formContent,
          image: formImage,
          author: formAuthor,
          category: formCategory,
          published: formPublished,
          featured: formFeatured,
        });
        setBlogs(prev => prev.map(b => b.id === editingBlog.id ? updated : b));
      } else {
        const created = await createBlog({
          title: formTitle,
          excerpt: formExcerpt,
          content: formContent,
          image: formImage,
          author: formAuthor,
          category: formCategory,
          published: formPublished,
          featured: formFeatured,
        });
        setBlogs(prev => [created, ...prev]);
      }
      setIsFormOpen(false);
      resetForm();
    } catch (err: any) {
      alert("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
    catch { return d; }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-6 md:p-10 selection:bg-blue-500/30">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/superadmin" className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-bold text-white tracking-tight">News & Blog Console</h1>
          </div>
          <p className="text-slate-400 text-sm ml-12">Manage campus updates, notices, and international education news.</p>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-[0.98] shadow-lg shadow-blue-900/20"
        >
          <Plus className="w-5 h-5" />
          <span>Compose New Post</span>
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Posts", value: blogs.length, icon: LayoutGrid, color: "text-blue-500" },
          { label: "Published", value: blogs.filter(b => b.published).length, icon: CheckCircle2, color: "text-emerald-500" },
          { label: "Drafts", value: blogs.filter(b => !b.published).length, icon: Edit2, color: "text-amber-500" },
          { label: "Total Views", value: blogs.reduce((s, b) => s + (b.views || 0), 0).toLocaleString(), icon: User, color: "text-purple-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by title or author..."
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center bg-slate-950/50 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-slate-800 text-white shadow-sm" : "text-slate-500"}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-slate-800 text-white shadow-sm" : "text-slate-500"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {["All", ...CATEGORIES].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-blue-600/10 text-blue-500 border border-blue-500/20"
                  : "text-slate-500 hover:text-slate-300 border border-transparent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      )}

      {/* List View */}
      {!loading && viewMode === "list" && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-slate-500 text-xs font-semibold uppercase tracking-widest px-4">
                <th className="px-6 py-4">Article</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.map(blog => (
                <tr key={blog.id} className="group bg-slate-900/40 hover:bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl transition-all">
                  <td className="px-6 py-4 first:rounded-l-2xl">
                    <div className="flex items-center gap-4 max-w-md">
                      <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-800">
                        <img src={blog.image || "https://via.placeholder.com/100"} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-white text-sm line-clamp-1 group-hover:text-blue-400 transition-colors">{blog.title}</p>
                        <p className="text-slate-500 text-xs line-clamp-1">{blog.excerpt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">{blog.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                      blog.published
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}>
                      {blog.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-300">{formatDate(blog.created_at)}</span>
                  </td>
                  <td className="px-6 py-4 last:rounded-r-2xl text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(blog)}
                        className="p-2.5 bg-slate-800 hover:bg-blue-600/20 text-slate-400 hover:text-blue-400 rounded-xl transition-all border border-slate-700 hover:border-blue-500/30 shadow-sm"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="p-2.5 bg-slate-800 hover:bg-red-600/20 text-slate-400 hover:text-red-400 rounded-xl transition-all border border-slate-700 hover:border-red-500/30 shadow-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Grid View */}
      {!loading && viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBlogs.map(blog => (
            <div key={blog.id} className="group flex flex-col bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all shadow-xl shadow-black/20 relative">
              <div className="h-48 overflow-hidden relative">
                <img src={blog.image || "https://via.placeholder.com/400"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-slate-700">
                    {blog.category}
                  </span>
                  {!blog.published && (
                    <span className="bg-amber-500/80 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">Draft</span>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
                  {blog.title}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-3 mb-6 flex-1">{blog.excerpt}</p>
                <div className="flex items-center justify-between pt-5 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-xs font-semibold text-slate-300">{blog.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(blog)} className="text-slate-500 hover:text-blue-500 transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(blog.id)} className="text-slate-500 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredBlogs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-900/20 border border-slate-800 border-dashed rounded-3xl">
          <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center text-slate-600 mb-4">
            <Filter className="w-8 h-8" />
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No articles found</p>
          <p className="text-slate-600 text-xs mt-1">Try adjusting your search or category filters.</p>
        </div>
      )}

      {/* Editor Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{editingBlog ? "Refine Entry" : "Compose New Entry"}</h2>
                <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest font-semibold">Editorial Console &middot; Level 4 Access</p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-2 hover:bg-slate-800 rounded-xl text-slate-500 hover:text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Col */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Title</label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold tracking-tight text-lg"
                      placeholder="Headline of the update..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Classification</label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500 transition-all text-sm appearance-none cursor-pointer"
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Visibility</label>
                      <select
                        value={formPublished ? "published" : "draft"}
                        onChange={(e) => setFormPublished(e.target.value === "published")}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500 transition-all text-sm appearance-none cursor-pointer"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Teaser / Excerpt</label>
                    <textarea
                      rows={3}
                      value={formExcerpt}
                      onChange={(e) => setFormExcerpt(e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500 transition-all text-sm resize-none"
                      placeholder="A short hook for the feed..."
                    ></textarea>
                  </div>
                </div>

                {/* Right Col */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Cover Asset URL</label>
                    <div className="relative group">
                      <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500" />
                      <input
                        type="text"
                        value={formImage}
                        onChange={(e) => setFormImage(e.target.value)}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-blue-500 transition-all text-sm"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                    <div className="w-full h-32 rounded-xl border border-slate-800 border-dashed bg-slate-950/30 overflow-hidden mt-3 relative flex items-center justify-center">
                      {formImage ? <img src={formImage} className="w-full h-full object-cover opacity-50" alt="" /> : <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">Asset Preview</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Author Credit</label>
                    <div className="relative group">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500" />
                      <input
                        type="text"
                        value={formAuthor}
                        onChange={(e) => setFormAuthor(e.target.value)}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-blue-500 transition-all text-sm"
                        placeholder="System Administrator"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formFeatured} onChange={(e) => setFormFeatured(e.target.checked)} className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-500 focus:ring-blue-500" />
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Featured Post</span>
                    </label>
                  </div>
                </div>

                {/* Full Width: Content Body */}
                <div className="md:col-span-2 space-y-2 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Article Content</label>
                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest italic">HTML Supported</span>
                  </div>
                  <textarea
                    rows={8}
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-5 px-6 text-white focus:outline-none focus:border-blue-500 transition-all text-sm leading-7 custom-scrollbar"
                    placeholder="Describe the full story here..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-500">
                <AlertCircle className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Requires Nexus Clearance</span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="px-6 py-2.5 rounded-xl text-slate-400 hover:text-white font-bold transition-colors"
                >
                  Discard
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving || !formTitle.trim()}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/40"
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                  <span>{editingBlog ? "Sync Update" : "Broadcast News"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default BlogManagement;
