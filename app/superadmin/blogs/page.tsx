"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";
import {
  Plus,
  MagnifyingGlass,
  PencilSimple,
  Trash,
  Calendar,
  X,
  WarningCircle,
  CircleNotch,
  Image as PhosphorImage,
  Eye,
  PaperPlaneRight,
  CaretDown,
  List as ListIcon,
  Bell,
  TextAa,
  ArrowLeft,
  CheckCircle,
  Tag as TagIcon,
  ChatCircleText,
  TextB,
  TextItalic,
  TextUnderline,
  ListBullets,
  ListNumbers
} from "@phosphor-icons/react";
import SuperadminSidebar from "@/components/superadmin/dashboard/SuperadminSidebar";
import {
  fetchAdminBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  uploadBlogImage,
  BlogEntry,
} from "@/services/blogApi";

const CATEGORIES = ["Technology", "Education", "Careers", "Lifestyle", "Events", "Scholarships", "Campus Life"];

const BlogManagement: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [blogsList, setBlogsList] = useState<BlogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [previewData, setPreviewData] = useState<BlogEntry | null>(null);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [editId, setEditId] = useState<string | number | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formTags, setFormTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [formPublished, setFormPublished] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: 1,
        limit: 50,
        category: selectedCategory === "All" ? undefined : selectedCategory,
        search: searchQuery || undefined
      };
      const result = await fetchAdminBlogs(params);
      setBlogsList(result.blogs);
    } catch (error) {
      console.error("Error loading blogs:", error);
      setBlogsList([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await uploadBlogImage(file);
        setFormImage(url);
        showToast("Image uploaded successfully");
      } catch (error) {
        showToast("Image upload failed", "error");
      }
    }
  };

  const resetForm = () => {
    setEditId(null);
    setFormTitle("");
    setFormSlug("");
    setFormExcerpt("");
    setFormContent("");
    setFormImage("");
    setFormCategory("");
    setFormTags([]);
    setTagInput("");
    setFormPublished(true);
  };

  const handleEdit = (blog: BlogEntry) => {
    setEditId(blog.id);
    setFormTitle(blog.title);
    setFormSlug(blog.slug);
    setFormExcerpt(blog.excerpt);
    setFormContent(blog.content);
    setFormImage(blog.image);
    setFormCategory(blog.category);
    setFormTags(blog.tags || []);
    setFormPublished(blog.published);
    setActiveTab("create");
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteBlog(String(deleteId));
      showToast("Blog post deleted successfully");
      loadBlogs();
      setDeleteId(null);
    } catch (error) {
      showToast("Failed to delete post", "error");
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formTags.includes(tagInput.trim())) {
        setFormTags([...formTags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setFormTags(formTags.filter((_, i) => i !== index));
  };

  const handleSave = async (publishedOverride?: boolean) => {
    if (!formTitle || !formCategory || !formContent) {
      showToast("Please fill all required fields", "error");
      return;
    }

    setSaving(true);
    try {
      const data = {
        title: formTitle,
        slug: formSlug || formTitle.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        excerpt: formExcerpt,
        content: formContent,
        image: formImage,
        category: formCategory,
        author: "Admin",
        tags: formTags,
        published: publishedOverride !== undefined ? publishedOverride : formPublished,
      };

      if (editId) {
        await updateBlog(String(editId), data);
        showToast("Blog post updated successfully");
      } else {
        await createBlog(data);
        showToast("Blog post published successfully");
      }
      resetForm();
      setActiveTab("list");
      loadBlogs();
    } catch (error) {
      showToast("Failed to save post", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB] text-[#111827] font-sans">
      <SuperadminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F9FAFB]">
        <header className="h-18 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-8 shrink-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-[#6B7280] p-2 hover:bg-gray-50 rounded-lg">
              <ListIcon size={24} />
            </button>
            <div className="hidden md:flex items-center bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 w-75 gap-3 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-50 transition-all">
              <MagnifyingGlass size={18} className="text-[#6B7280]" />
              <input 
                type="text" 
                placeholder="Search articles..." 
                className="bg-transparent outline-none w-full text-sm font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer text-[#6B7280] p-2 hover:bg-gray-50 rounded-full transition-colors">
              <Bell size={22} weight="regular" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#EF4444] rounded-full ring-2 ring-white"></span>
            </div>
            <div className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-1.5 pr-3 rounded-xl border border-transparent hover:border-gray-100 transition-all">
              <img src="https://i.pravatar.cc/150?img=11" alt="Admin" className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm" />
              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Jane Doe</span>
                <span className="text-[11px] font-bold text-[#6B7280] uppercase">Super Admin</span>
              </div>
              <CaretDown size={14} className="text-[#6B7280] group-hover:text-indigo-600 transition-all" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-[26px] font-extrabold text-[#111827] tracking-tight">
                {activeTab === 'list' ? "Blog Management" : editId ? "Edit Article" : "Write New Story"}
              </h1>
              <p className="text-[#6B7280] font-medium mt-1">Share insights, campus news, and educational content with your audience.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              {activeTab === 'list' ? (
                <button 
                  onClick={() => { resetForm(); setActiveTab('create'); }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2.5 transition-all shadow-lg shadow-indigo-100 active:scale-95"
                >
                  <Plus size={20} weight="bold" /> Create Post
                </button>
              ) : (
                <button 
                  onClick={() => setActiveTab('list')}
                  className="bg-white hover:bg-gray-50 border border-[#E5E7EB] text-[#111827] px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95"
                >
                  <ArrowLeft size={18} weight="bold" /> Back to Dashboard
                </button>
              )}
            </div>
          </div>

          {activeTab === "list" ? (
            <section className="animate-in fade-in duration-500 space-y-6">
              <div className="flex flex-wrap justify-between items-center gap-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative w-full sm:w-62.5">
                    <MagnifyingGlass size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                    <input
                      type="text"
                      placeholder="Filter by title..."
                      className="w-full bg-[#F9FAFB] border-none rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <select
                    className="bg-white border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm font-bold outline-none min-w-37.5 appearance-none cursor-pointer hover:border-indigo-300 transition-colors"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="All">All Topics</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col justify-center items-center py-32 gap-4">
                  <CircleNotch className="animate-spin text-indigo-600" size={40} weight="bold" />
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest font-mono">Loading articles...</p>
                </div>
              ) : blogsList.length === 0 ? (
                <div className="bg-white border border-[#E5E7EB] rounded-3xl p-20 text-center shadow-sm">
                   <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-dashed border-gray-200">
                      <ChatCircleText size={32} className="text-gray-300" />
                   </div>
                   <p className="text-xl font-bold text-gray-900 mb-2">No articles found</p>
                   <p className="text-[#6B7280] font-medium">Try refining your search or create your first blog post today.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {blogsList.map((blog) => (
                    <div key={blog.id} className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-xl transition-all group relative">
                      <div className="absolute top-6 right-6 flex gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => handleEdit(blog)} className="w-8 h-8 bg-white/90 backdrop-blur text-[#111827] rounded-lg flex items-center justify-center hover:bg-white shadow-xl border border-gray-100 transition-all"><PencilSimple size={16} weight="bold" /></button>
                         <button onClick={() => setDeleteId(blog.id)} className="w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center hover:bg-red-600 shadow-xl transition-all"><Trash size={16} weight="bold" /></button>
                      </div>
                      
                      <div className="aspect-video overflow-hidden rounded-xl bg-gray-50 border border-gray-100 mt-1 relative">
                        <img 
                          src={blog.image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop"} 
                          alt="" 
                          className="w-full h-full object-cover grayscale-0 group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
                        />
                        {!blog.published && (
                          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                            <span className="bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-2xl">Draft</span>
                          </div>
                        )}
                        <div className="absolute top-2 left-2">
                           <span className="px-2.5 py-1 bg-white/90 backdrop-blur rounded-lg text-[10px] font-black uppercase tracking-wider text-indigo-600 shadow-sm border border-indigo-100">
                            {blog.category}
                           </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2.5 px-1 py-1">
                        <h3 className="font-extrabold text-[17px] text-[#111827] line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{blog.title}</h3>
                        <p className="text-[#6B7280] text-[13px] leading-relaxed line-clamp-2 font-medium italic opacity-80">{blog.excerpt}</p>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-50 mt-auto">
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-black text-indigo-600 border border-indigo-200 uppercase">
                             {blog.author?.[0] || 'A'}
                           </div>
                           <div className="flex flex-col">
                             <span className="text-[11px] font-bold text-gray-900 leading-none">{blog.author || "Admin"}</span>
                             <span className="text-[10px] font-bold text-[#6B7280] leading-none mt-0.5 uppercase tracking-tighter">{new Date(blog.created_at).toLocaleDateString()}</span>
                           </div>
                        </div>
                        <button onClick={() => setPreviewData(blog)} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all active:scale-90"><Eye size={20} weight="bold" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ) : (
            <section className="animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
              <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 items-start">
                <div className="space-y-6">
                  <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center gap-2 font-black text-[#111827] border-b-2 border-indigo-600 pb-4 mb-8 w-fit text-sm uppercase tracking-[2px]">
                       <TextAa size={20} weight="bold" /> Content Editor
                    </div>

                    <div className="space-y-7">
                      <div className="group">
                        <label className="block text-xs font-black uppercase tracking-widest mb-2.5 text-gray-500">Post Title <span className="text-[#EF4444]">*</span></label>
                        <input 
                          type="text" 
                          placeholder="e.g. Master the Art of Career Planning" 
                          className="w-full bg-[#F9FAFB] border border-transparent rounded-xl px-5 py-4 text-xl font-bold text-[#111827] outline-none focus:bg-white focus:border-indigo-600 transition-all placeholder:text-gray-300"
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="group">
                           <label className="block text-xs font-black uppercase tracking-widest mb-2.5 text-gray-500">URL Slug</label>
                           <input 
                             type="text" 
                             placeholder="career-planning-guide" 
                             className="w-full bg-[#F9FAFB] border border-transparent rounded-xl px-4 py-2.5 text-sm font-bold text-[#111827] outline-none focus:bg-white focus:border-indigo-600 transition-all"
                             value={formSlug}
                             onChange={(e) => setFormSlug(e.target.value)}
                           />
                         </div>
                         <div className="group">
                            <label className="block text-xs font-black uppercase tracking-widest mb-2.5 text-gray-500">Category Selection</label>
                            <select 
                              className="w-full bg-[#F9FAFB] border border-transparent rounded-xl px-4 py-2.5 text-sm font-bold text-[#111827] outline-none focus:bg-white focus:border-indigo-600 transition-all cursor-pointer"
                              value={formCategory}
                              onChange={(e) => setFormCategory(e.target.value)}
                            >
                              <option value="" disabled>Select a topic</option>
                              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                         </div>
                      </div>

                      <div className="group">
                        <label className="block text-xs font-black uppercase tracking-widest mb-2.5 text-gray-500">Short Hook</label>
                        <textarea 
                          placeholder="What is this story about?" 
                          className="w-full bg-[#F9FAFB] border border-transparent rounded-xl px-5 py-3.5 text-sm font-bold text-[#111827] outline-none focus:bg-white focus:border-indigo-600 transition-all min-h-25 resize-none italic"
                          value={formExcerpt}
                          onChange={(e) => setFormExcerpt(e.target.value)}
                        />
                      </div>

                      <div className="group">
                        <label className="block text-xs font-black uppercase tracking-widest mb-2.5 text-gray-500">Story Body <span className="text-[#EF4444] font-black">*</span></label>
                        <div className="border-2 border-[#F9FAFB] rounded-2xl overflow-hidden group-focus-within:border-indigo-100 transition-all shadow-sm">
                           <div className="bg-[#F9FAFB] border-b-2 border-white p-3 flex gap-2 flex-wrap">
                              <button className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm text-gray-500"><TextB size={18} weight="bold" /></button>
                              <button className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm text-gray-500"><TextItalic size={18} weight="bold" /></button>
                              <button className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm text-gray-500"><TextUnderline size={18} weight="bold" /></button>
                              <div className="w-px h-6 bg-gray-200 mx-1 self-center"></div>
                              <button className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm text-gray-500"><ListBullets size={18} weight="bold" /></button>
                              <button className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm text-gray-500"><ListNumbers size={18} weight="bold" /></button>
                           </div>
                           <ReactQuill
                            theme="snow"
                            value={formContent}
                            onChange={setFormContent}
                            placeholder="Type your story here..."
                            className="bg-white min-h-100"
                            modules={{ toolbar: false }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-900 border border-gray-800 rounded-4xl p-8 text-white shadow-2xl">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-800">
                       <span className="text-[10px] font-black uppercase tracking-[3px] text-indigo-400 font-mono">Control Panel</span>
                       <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${formPublished ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></span>
                          <span className="text-[10px] font-bold uppercase tracking-widest">{formPublished ? 'Published' : 'Draft'}</span>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-indigo-500/30 transition-all cursor-pointer" onClick={() => setFormPublished(!formPublished)}>
                          <div>
                            <p className="text-[11px] font-black uppercase tracking-widest text-indigo-300">Visibility</p>
                            <p className="text-xs text-gray-400 font-bold mt-0.5">{formPublished ? 'Public' : 'Private Draft'}</p>
                          </div>
                          <button className={`relative w-12 h-6 rounded-full transition-all duration-500 ${formPublished ? 'bg-indigo-600' : 'bg-white/10'}`}>
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-500 ${formPublished ? 'translate-x-6' : 'translate-x-0'}`} />
                          </button>
                       </div>
                       
                       <div className="flex flex-col gap-3 pt-4">
                          <button onClick={() => handleSave(true)} disabled={saving} className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-900/10 flex items-center justify-center gap-2 disabled:opacity-50">
                             {saving ? <CircleNotch className="animate-spin" size={18} weight="bold" /> : <PaperPlaneRight size={18} weight="fill" />}
                             {editId ? "Update Post" : "Submit & Publish"}
                          </button>
                          <button onClick={() => handleSave(false)} disabled={saving} className="w-full py-4 rounded-2xl border-2 border-white/10 font-black uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all disabled:opacity-30">Save to Drafts</button>
                       </div>
                    </div>
                  </div>

                  <div className="bg-white border border-[#E5E7EB] rounded-2xl p-7 shadow-sm">
                    <div className="flex items-center gap-2 font-black text-[#111827] mb-6 text-xs uppercase tracking-[2px]">
                       <TagIcon size={18} weight="bold" className="text-indigo-600" /> SEO Tags
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest mb-2.5 text-gray-500">Keywords</label>
                      <div className="flex flex-wrap gap-2 p-2 border border-[#E5E7EB] rounded-xl bg-[#F9FAFB] min-h-10.5 focus-within:border-indigo-500 focus-within:bg-white transition-all shadow-inner">
                        {formTags.map((tag, i) => (
                          <span key={i} className="flex items-center gap-1 bg-indigo-50 text-indigo-700 font-black text-[10px] uppercase px-2.5 py-1.5 rounded-lg border border-indigo-100">
                            #{tag}
                            <button onClick={() => removeTag(i)} className="hover:text-red-500 transition-colors ml-1"><X size={10} weight="bold" /></button>
                          </span>
                        ))}
                        <input
                          type="text"
                          className="flex-1 outline-none text-sm font-bold placeholder:text-gray-400 min-w-25 bg-transparent"
                          placeholder={formTags.length === 0 ? "Add tags..." : ""}
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleAddTag}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-[#E5E7EB] rounded-2xl p-7 shadow-sm">
                    <div className="flex items-center gap-2 font-black text-[#111827] mb-6 text-xs uppercase tracking-[2px]">
                       <PhosphorImage size={18} weight="bold" className="text-indigo-600" /> Header Image
                    </div>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="group relative h-45 bg-[#F9FAFB] border-2 border-dashed border-gray-200 rounded-3xl flex items-center justify-center transition-all hover:bg-white hover:border-indigo-400 cursor-pointer overflow-hidden shadow-inner"
                    >
                      {formImage ? (
                        <>
                          <img src={formImage} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gray-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                              <div className="bg-white p-3 rounded-xl text-[#111827] flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-2xl scale-90 group-hover:scale-100 transition-all"><PencilSimple size={16} /> Replace</div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-6 text-gray-400 flex flex-col items-center">
                          <Plus size={24} weight="bold" />
                          <p className="text-[10px] font-black uppercase tracking-widest mt-2">Upload Banner</p>
                        </div>
                      )}
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </div>
                  </div>
                </div>
              </form>
            </section>
          )}
        </main>
      </div>

      {previewData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-md" onClick={() => setPreviewData(null)} />
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[40px] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-500">
             <div className="flex items-center justify-between px-10 py-6 border-b border-gray-100 bg-white">
               <h2 className="text-sm font-black text-[#111827] uppercase tracking-widest">Article Preview</h2>
               <button onClick={() => setPreviewData(null)} className="p-3 hover:bg-gray-100 rounded-full transition-all"><X size={20} weight="bold" /></button>
             </div>
             <div className="flex-1 overflow-y-auto bg-[#F9FAFB]/30">
                <img src={previewData.image} alt="" className="w-full h-auto object-cover max-h-120" />
                <div className="max-w-3xl mx-auto px-10 py-16 bg-white -mt-24 relative rounded-t-[48px] shadow-sm border-x border-t border-gray-50 mb-10">
                   <div className="flex items-center gap-5 mb-10">
                      <span className="px-5 py-2 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">{previewData.category}</span>
                      <span className="text-[11px] font-bold text-gray-400 flex items-center gap-2 uppercase tracking-widest">
                        <Calendar size={15} /> {new Date(previewData.created_at || new Date()).toLocaleDateString()}
                      </span>
                   </div>
                   <h1 className="text-4xl md:text-5xl font-black text-[#111827] mb-12 leading-tight tracking-tight">{previewData.title}</h1>
                   <article className="prose prose-indigo prose-xl max-w-none text-gray-800 leading-loose font-medium" dangerouslySetInnerHTML={{ __html: previewData.content }} />
                </div>
             </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-950/90 backdrop-blur-xl" onClick={() => setDeleteId(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-4xl p-12 text-center animate-in zoom-in-95 duration-400 shadow-2xl">
            <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 border-8 border-white shadow-xl"><WarningCircle size={48} weight="fill" /></div>
            <h2 className="text-2xl font-black text-[#111827] mb-4 uppercase tracking-tighter italic">Delete forever?</h2>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-[#6B7280] bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all">Keep It</button>
              <button onClick={handleDelete} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-white bg-red-500 rounded-2xl hover:bg-red-600 transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-10 right-10 z-[200] flex items-center gap-5 px-8 py-5 rounded-4xl text-white shadow-2xl animate-in slide-in-from-right-10 duration-500 border-2 border-white/20 backdrop-blur-lg ${toast.type === 'success' ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`}>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            {toast.type === 'success' ? <CheckCircle size={24} weight="bold" /> : <WarningCircle size={24} weight="bold" />}
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xs uppercase tracking-widest">{toast.type === 'success' ? 'Confirmed' : 'Error'}</span>
            <span className="font-bold text-sm">{toast.message}</span>
          </div>
          <button onClick={() => setToast(null)} className="ml-6 p-1.5"><X size={16} weight="bold" /></button>
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        .ql-container.ql-snow { border: none !important; }
        .ql-editor { padding: 40px !important; min-height: 400px !important; font-size: 1.125rem !important; color: #111827 !important; line-height: 2 !important; }
      `}</style>
    </div>
  );
};

export default BlogManagement;
