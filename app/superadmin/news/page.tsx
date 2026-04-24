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
  User,
  X,
  Clock,
  WarningCircle,
  CircleNotch,
  Image as PhosphorImage,
  UploadSimple,
  Eye,
  FloppyDisk,
  PaperPlaneRight,
  CaretDown,
  List as ListIcon,
  Bell,
  TextAa,
  ArrowLeft,
  CheckCircle,
  DeviceMobile,
  Folder,
  Funnel,
  TextB,
  TextItalic,
  TextUnderline,
  TextHTwo,
  TextHThree,
  ListBullets,
  ListNumbers,
  Link as LinkIcon
} from "@phosphor-icons/react";
import SuperadminSidebar from "@/components/superadmin/dashboard/SuperadminSidebar";
import {
  fetchAdminNews,
  createNews,
  updateNews,
  deleteNews,
  uploadNewsImage,
  NewsEntry,
} from "@/services/newsApi";

const CATEGORIES = ["Admission", "Scholarship", "Event", "Notice"];

const NewsManagement: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [newsList, setNewsList] = useState<NewsEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Modals
  const [previewData, setPreviewData] = useState<NewsEntry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Form state
  const [editId, setEditId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formStatus, setFormStatus] = useState("Published");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formTags, setFormTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [formAudience, setFormAudience] = useState<string[]>(["All"]);
  const [formSchedule, setFormSchedule] = useState("");
  const [formExpiry, setFormExpiry] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadNews = useCallback(async () => {
    setLoading(true);
    try {
      const category = selectedCategory === "All" ? undefined : selectedCategory;
      const result = await fetchAdminNews({
        page: 1,
        limit: 50,
        category,
        search: searchQuery || undefined,
      });
      setNewsList(result.news);
    } catch {
      setNewsList([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormTitle(title);
    if (!editId) {
      setFormSlug(title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, ''));
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim().replace(',', '');
      if (tag && !formTags.includes(tag)) {
        setFormTags([...formTags, tag]);
      }
      setTagInput('');
    } else if (e.key === 'Backspace' && !tagInput && formTags.length > 0) {
      setFormTags(formTags.slice(0, -1));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await uploadNewsImage(file);
        setFormImage(url);
      } catch {
        showToast("Image upload failed", "error");
      }
    }
  };

  const resetForm = () => {
    setEditId(null);
    setFormTitle("");
    setFormSlug("");
    setFormDesc("");
    setFormContent("");
    setFormImage("");
    setFormCategory("");
    setFormStatus("Published");
    setFormFeatured(false);
    setFormTags([]);
    setTagInput("");
    setFormAudience(["All"]);
    setFormSchedule("");
    setFormExpiry("");
  };

  const handleEdit = (news: NewsEntry) => {
    setEditId(news.id.toString());
    setFormTitle(news.title);
    setFormSlug((news as any).slug || news.title.toLowerCase().replace(/\s+/g, '-'));
    setFormDesc(news.desc);
    setFormContent(news.content || "");
    setFormImage(news.image);
    setFormCategory(news.category);
    setFormStatus(news.status);
    setFormFeatured(news.featured);
    setFormTags((news as any).tags || []);
    setFormExpiry((news as any).deadline || "");
    setFormSchedule((news as any).date || "");
    setActiveTab("create");
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteNews(deleteId);
      showToast("News deleted successfully");
      loadNews();
      setDeleteId(null);
    } catch {
      showToast("Failed to delete news", "error");
    }
  };

  const handleSave = async (statusOverride?: string) => {
    if (!formTitle || !formCategory || !formDesc) {
      showToast("Please fill all required fields", "error");
      return;
    }

    setSaving(true);
    try {
      const data = {
        title: formTitle,
        slug: formSlug,
        desc: formDesc,
        content: formContent,
        image: formImage,
        author: "Jane Doe",
        category: formCategory,
        status: statusOverride || formStatus,
        featured: formFeatured,
        tags: formTags,
        targetAudience: formAudience,
        branch: "All",
        deadline: formExpiry || "-",
        date: formSchedule || new Date().toISOString(),
      };

      if (editId) {
        await updateNews(editId, data);
        showToast("News updated successfully");
      } else {
        await createNews(data);
        showToast("News published successfully");
      }
      resetForm();
      setActiveTab("list");
      loadNews();
    } catch {
      showToast("Failed to save news", "error");
    } finally {
      setSaving(false);
    }
  };

  const getDaysAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  const getBadgeClass = (category: string) => {
    switch(category.toLowerCase()) {
      case 'notice': return 'bg-[#F3E8FF] text-[#9333EA]';
      case 'admission': return 'bg-[#E0E7FF] text-[#4F46E5]';
      case 'scholarship': return 'bg-[#DCFCE7] text-[#16A34A]';
      case 'event': return 'bg-[#FEF3C7] text-[#D97706]';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB] text-[#111827] font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <SuperadminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F9FAFB]">
        {/* Navbar */}
        <header className="h-[72px] bg-white border-b border-[#E5E7EB] flex items-center justify-between px-8 shrink-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-[#6B7280] p-2 hover:bg-gray-50 rounded-lg">
              <ListIcon size={24} />
            </button>
            <div className="hidden md:flex items-center bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 w-[300px] gap-3 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-50 transition-all">
              <MagnifyingGlass size={18} className="text-[#6B7280]" />
              <input type="text" placeholder="Search anywhere..." className="bg-transparent outline-none w-full text-sm font-medium" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer text-[#6B7280] p-2 hover:bg-gray-50 rounded-full transition-colors">
              <Bell size={22} weight="regular" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#EF4444] rounded-full ring-2 ring-white"></span>
            </div>
            <div className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-1.5 pr-3 rounded-xl transition-all border border-transparent hover:border-gray-100">
              <div className="relative">
                <img src="https://i.pravatar.cc/150?img=11" alt="Admin" className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Jane Doe</span>
                <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Super Admin</span>
              </div>
              <CaretDown size={14} className="text-[#6B7280] group-hover:text-indigo-600 transition-all" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-[24px] font-bold text-[#111827]">
                {activeTab === 'list' ? "News Management" : editId ? "Edit News" : "Create News"}
              </h1>
              <p className="text-[#6B7280] font-medium mt-1">Create, edit, and manage news, notices, and events.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              {activeTab === 'list' ? (
                <button 
                  onClick={() => { resetForm(); setActiveTab('create'); }}
                  className="bg-[#4F46E5] hover:bg-[#4338ca] text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-sm active:scale-[0.98]"
                >
                  <Plus size={18} weight="bold" /> Create News
                </button>
              ) : (
                <button 
                  onClick={() => setActiveTab('list')}
                  className="bg-white hover:bg-gray-50 border border-[#E5E7EB] text-[#111827] px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-sm active:scale-[0.98]"
                >
                  <ArrowLeft size={18} weight="bold" /> Back to List
                </button>
              )}
            </div>
          </div>

          {activeTab === "list" ? (
            <section className="animate-in fade-in duration-500 space-y-6">
              {/* Filters Section */}
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative w-full sm:w-[250px]">
                    <MagnifyingGlass size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                    <input
                      type="text"
                      placeholder="Search news..."
                      className="w-full bg-white border border-[#E5E7EB] rounded-lg pl-10 pr-4 py-2 text-sm font-medium outline-none focus:border-[#4F46E5] focus:ring-4 focus:ring-[#EEF2FF] transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <select
                    className="bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm font-semibold outline-none min-w-[150px] appearance-none cursor-pointer hover:border-indigo-300 transition-colors"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' fill=\'%236B7280\' viewBox=\'0 0 256 256\'%3E%3Cpath d=\'M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="All">All Categories</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                   <input type="date" className="bg-white border border-[#E5E7EB] rounded-lg px-4 py-2 text-sm outline-none cursor-pointer" />
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col justify-center items-center py-32 gap-4">
                  <CircleNotch className="animate-spin text-[#4F46E5]" size={36} weight="bold" />
                </div>
              ) : newsList.length === 0 ? (
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-16 text-center shadow-sm">
                  <p className="text-[#6B7280] font-medium">No news found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
                  {newsList.map((news) => (
                    <div key={news.id} className="bg-white border border-[#E5E7EB] rounded-[16px] p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all group relative">
                      <div className="flex justify-between items-center">
                         <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${getBadgeClass(news.category)}`}>
                           {news.category}
                         </span>
                         <div className="flex gap-1.5">
                            <button onClick={() => handleEdit(news)} className="w-7 h-7 bg-gray-50 text-[#111827] border border-gray-200 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors"><PencilSimple size={14} weight="bold" /></button>
                            <button onClick={() => setDeleteId(news.id.toString())} className="w-7 h-7 bg-red-50 text-red-500 rounded-md flex items-center justify-center hover:bg-red-100 transition-colors"><Trash size={14} weight="bold" /></button>
                         </div>
                      </div>
                      
                      <div className="aspect-[16/9] overflow-hidden rounded-xl bg-gray-50 border border-gray-100 mt-1">
                        <img 
                          src={news.image || "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop"} 
                          alt="" 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <h3 className="font-bold text-[16px] text-[#111827] line-clamp-2 leading-snug">{news.title}</h3>
                        <p className="text-sm text-[#6B7280] line-clamp-2 leading-relaxed">{news.desc}</p>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-[#E5E7EB] mt-auto">
                        <div className="flex items-center gap-1.5 text-[#6B7280] text-[13px] font-medium">
                          <Clock size={16} />
                          {getDaysAgo(news.date)}
                        </div>
                        <button onClick={() => setPreviewData(news)} className="text-[#4F46E5] font-semibold text-[13px] hover:underline">View Details</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ) : (
            <section className="animate-in fade-in slide-in-from-bottom-6 duration-700 pb-10">
              <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start">
                <div className="space-y-6">
                  {/* Basic Details */}
                  <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 font-semibold text-gray-900 border-b border-gray-100 pb-4 mb-5">
                       <TextAa size={20} /> Basic Details
                    </div>

                    <div className="space-y-5">
                      <div className="group">
                        <label className="block text-sm font-medium mb-1.5 text-gray-700">Title <span className="text-[#EF4444]">*</span></label>
                        <input 
                          type="text" 
                          placeholder="Enter news title" 
                          className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 text-sm font-medium outline-none focus:border-[#4F46E5] focus:ring-4 focus:ring-[#EEF2FF] transition-all"
                          value={formTitle}
                          onChange={handleTitleChange}
                        />
                      </div>
                      
                      <div className="group">
                        <label className="block text-sm font-medium mb-1.5 text-gray-700">Slug <span className="text-[#EF4444]">*</span></label>
                        <input 
                          type="text" 
                          placeholder="auto-generated-slug" 
                          className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 text-sm font-medium outline-none transition-all"
                          value={formSlug}
                          onChange={(e) => setFormSlug(e.target.value)}
                        />
                        <p className="text-[12px] text-gray-400 mt-1.5">Used for URL structure. Auto-generated from title.</p>
                      </div>

                      <div className="group">
                        <label className="block text-sm font-medium mb-1.5 text-gray-700">Short Description <span className="text-[#EF4444]">*</span></label>
                        <textarea 
                          placeholder="Brief summary of the news..." 
                          className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 text-sm font-medium outline-none focus:border-[#4F46E5] focus:ring-4 focus:ring-[#EEF2FF] transition-all min-h-[100px] resize-y"
                          maxLength={150}
                          value={formDesc}
                          onChange={(e) => setFormDesc(e.target.value)}
                        />
                        <div className="flex justify-between text-[12px] text-gray-400 mt-1.5">
                           <span>Max 150 characters</span>
                           <span className={formDesc.length >= 150 ? "text-red-500 font-bold" : ""}>{formDesc.length}/150</span>
                        </div>
                      </div>

                      <div className="group">
                        <label className="block text-sm font-medium mb-1.5 text-gray-700">Full Content <span className="text-[#EF4444]">*</span></label>
                        <div className="border border-[#E5E7EB] rounded-lg overflow-hidden focus-within:ring-4 focus-within:ring-[#EEF2FF] transition-all">
                           <div className="bg-gray-50 border-b border-gray-200 p-2 flex gap-1 flex-wrap">
                              <button className="p-1.5 hover:bg-white rounded transition-colors text-gray-600"><TextB size={18} /></button>
                              <button className="p-1.5 hover:bg-white rounded transition-colors text-gray-600"><TextItalic size={18} /></button>
                              <button className="p-1.5 hover:bg-white rounded transition-colors text-gray-600"><TextUnderline size={18} /></button>
                              <div className="w-px h-6 bg-gray-200 mx-1"></div>
                              <button className="p-1.5 hover:bg-white rounded transition-colors text-gray-600"><TextHTwo size={18} /></button>
                              <button className="p-1.5 hover:bg-white rounded transition-colors text-gray-600"><TextHThree size={18} /></button>
                              <div className="w-px h-6 bg-gray-200 mx-1"></div>
                              <button className="p-1.5 hover:bg-white rounded transition-colors text-gray-600"><ListBullets size={18} /></button>
                              <button className="p-1.5 hover:bg-white rounded transition-colors text-gray-600"><ListNumbers size={18} /></button>
                              <div className="w-px h-6 bg-gray-200 mx-1"></div>
                              <button className="p-1.5 hover:bg-white rounded transition-colors text-gray-600"><LinkIcon size={18} /></button>
                              <button className="p-1.5 hover:bg-white rounded transition-colors text-gray-600"><PhosphorImage size={18} /></button>
                           </div>
                           <ReactQuill
                            theme="snow"
                            value={formContent}
                            onChange={setFormContent}
                            placeholder="Write the full story here..."
                            className="bg-white min-h-[300px]"
                            modules={{ toolbar: false }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Publishing Controls */}
                  <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 font-semibold text-gray-900 border-b border-gray-100 pb-4 mb-5">
                       <UploadSimple size={20} /> Publishing
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5 text-gray-700">Status</label>
                        <select 
                          className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 text-sm font-semibold outline-none appearance-none cursor-pointer"
                          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' fill=\'%236B7280\' viewBox=\'0 0 256 256\'%3E%3Cpath d=\'M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
                          value={formStatus}
                          onChange={(e) => setFormStatus(e.target.value)}
                        >
                          <option value="Published">Published</option>
                          <option value="Draft">Draft</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1.5 text-gray-700">Schedule Publish</label>
                        <input type="datetime-local" className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 text-sm outline-none font-medium" />
                      </div>

                      <div className="flex items-center justify-between pt-3">
                         <label className="text-sm font-medium text-gray-700">Make Featured</label>
                         <button 
                          type="button"
                          onClick={() => setFormFeatured(!formFeatured)}
                          className={`relative w-11 h-6 rounded-full transition-all duration-300 ${formFeatured ? 'bg-indigo-600' : 'bg-gray-200'}`}
                        >
                          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${formFeatured ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Classification */}
                  <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 font-semibold text-gray-900 border-b border-gray-100 pb-4 mb-5">
                       <Folder size={20} /> Classification
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5 text-gray-700">Category <span className="text-[#EF4444]">*</span></label>
                        <select 
                          className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 text-sm font-semibold outline-none appearance-none cursor-pointer"
                          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' fill=\'%236B7280\' viewBox=\'0 0 256 256\'%3E%3Cpath d=\'M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                        >
                          <option value="" disabled>Select Category</option>
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1.5 text-gray-700">Tags</label>
                        <div className="flex flex-wrap gap-2 p-2 border border-[#E5E7EB] rounded-lg bg-white min-h-[42px] focus-within:border-indigo-500 transition-all">
                          {formTags.map((tag, i) => (
                            <span key={i} className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full text-[12px] font-semibold text-gray-700">
                              {tag}
                              <button type="button" onClick={() => setFormTags(formTags.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-[#EF4444]"><X size={12} weight="bold" /></button>
                            </span>
                          ))}
                          <input 
                            type="text" 
                            className="flex-1 outline-none text-sm font-medium placeholder:text-gray-400 min-w-[100px]"
                            placeholder="Type and press enter"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                          />
                        </div>
                        <p className="text-[12px] text-gray-400 mt-1.5">Press Enter or comma to add tags</p>
                      </div>
                    </div>
                  </div>

                  {/* Media */}
                  <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 font-semibold text-gray-900 border-b border-gray-100 pb-4 mb-5">
                       <PhosphorImage size={20} /> Media
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5 text-gray-700">Featured Image</label>
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="group relative h-[180px] bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center transition-all hover:bg-gray-100 hover:border-indigo-400 cursor-pointer overflow-hidden"
                        >
                          {formImage ? (
                            <>
                              <img src={formImage} alt="" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <div className="bg-white p-2 rounded-lg text-[#111827] flex items-center gap-2 text-xs font-bold shadow-xl">
                                     <PencilSimple size={16} /> Change Image
                                  </div>
                              </div>
                            </>
                          ) : (
                            <div className="text-center p-6 text-[#6B7280]">
                              <PhosphorImage size={40} className="mx-auto text-indigo-500 mb-3" />
                              <p className="text-sm">Drag & drop image here or <span className="text-indigo-600 font-bold">browse</span></p>
                            </div>
                          )}
                          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1.5 text-gray-700">Attachment (PDF)</label>
                        <input type="file" className="form-control w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm" accept=".pdf" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1.5 text-gray-700">External Link</label>
                        <input type="url" placeholder="https://..." className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 text-sm outline-none font-medium" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 flex justify-end gap-3 pt-6 border-t border-gray-200 mt-4">
                    <button onClick={resetForm} className="px-5 py-2.5 text-sm font-bold text-[#6B7280] hover:bg-gray-100 rounded-lg transition-all">Reset Form</button>
                    <button onClick={() => setPreviewData({
                      id: 0, title: formTitle, slug: formSlug, desc: formDesc, content: formContent, category: formCategory,
                      image: formImage, author: 'Jane Doe', status: formStatus, featured: formFeatured, 
                      date: new Date().toISOString(), views: 0, created: new Date().toISOString(), tags: formTags, 
                      deadline: "-", targetAudience: formAudience, branch: "All"
                    })} className="px-5 py-2.5 text-sm font-bold bg-white border border-[#E5E7EB] text-[#111827] rounded-lg hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-all transition-all">
                      <Eye size={18} /> Preview
                    </button>
                    <button onClick={() => handleSave('Draft')} className="px-5 py-2.5 text-sm font-bold bg-white border border-[#E5E7EB] text-[#111827] rounded-lg hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-all transition-all">
                      <FloppyDisk size={18} /> Save Draft
                    </button>
                    <button onClick={() => handleSave()} disabled={saving} className="px-8 py-2.5 text-sm font-bold bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338ca] shadow-md transition-all flex items-center gap-2 disabled:opacity-50 transition-all">
                      {saving ? <CircleNotch className="animate-spin" size={18} weight="bold" /> : <PaperPlaneRight size={18} weight="bold" />}
                      Publish News
                    </button>
                </div>
              </form>
            </section>
          )}
        </main>
      </div>

      {/* MODALS */}
      {previewData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#111827]/50 backdrop-blur-sm transition-opacity duration-300" onClick={() => setPreviewData(null)} />
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-500">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
                <DeviceMobile size={22} weight="bold" /> Live Preview
              </h2>
              <button onClick={() => setPreviewData(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-all"><X size={20} weight="bold" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
              <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4 ${getBadgeClass(previewData.category)}`}>{previewData.category}</span>
              <h1 className="text-3xl font-bold text-[#111827] mb-4 leading-tight">{previewData.title || "Untitled News"}</h1>
              <div className="flex items-center gap-4 text-[#6B7280] text-sm mb-8">
                <span className="flex items-center gap-1.5"><Calendar size={18} /> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span className="flex items-center gap-1.5"><User size={18} /> By {previewData.author}</span>
              </div>
              {previewData.image && (
                <div className="rounded-xl overflow-hidden mb-8 shadow-md">
                  <img src={previewData.image} alt="" className="w-full h-auto object-cover max-h-[400px]" />
                </div>
              )}
              <div className="prose prose-indigo max-w-none text-[#111827] leading-relaxed" dangerouslySetInnerHTML={{ __html: previewData.content || previewData.desc }} />
              
              {formTags.length > 0 && (
                <div className="mt-10 pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-bold text-[#111827] mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {formTags.map((t, i) => <span key={i} className="bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-[#111827]">#{t}</span>)}
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end shrink-0">
              <button onClick={() => setPreviewData(null)} className="px-6 py-2.5 text-sm font-bold bg-[#111827] text-white rounded-lg hover:bg-gray-800 transition-all">Close Preview</button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#111827]/50 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl p-8 text-center animate-in zoom-in-95 duration-400">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5">
              <WarningCircle size={36} weight="fill" />
            </div>
            <h2 className="text-xl font-bold text-[#111827] mb-2">Delete News?</h2>
            <p className="text-[#6B7280] mb-8 text-sm leading-relaxed">This action cannot be undone. Are you sure you want to delete this item?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 text-sm font-bold text-[#6B7280] bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 text-sm font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all shadow-md shadow-red-100">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-6 py-3.5 rounded-xl text-white shadow-xl animate-in slide-in-from-bottom-10 duration-500 ${toast.type === 'success' ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`}>
          {toast.type === 'success' ? <CheckCircle size={20} weight="bold" /> : <WarningCircle size={20} weight="bold" />}
          <span className="font-bold text-sm">{toast.message}</span>
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }

        .ql-container.ql-snow { border: none !important; font-family: 'Plus Jakarta Sans', sans-serif !important; font-size: 14px !important; }
        .ql-editor { padding: 20px !important; min-height: 280px !important; font-weight: 500 !important; color: #111827 !important; }
        .ql-editor.ql-blank::before { font-style: normal !important; color: #9CA3AF !important; font-weight: 500 !important; }
        
        .prose h1, .prose h2, .prose h3 { font-weight: 700 !important; }
        .prose p { margin-top: 1em !important; margin-bottom: 1em !important; }
        .prose img { border-radius: 0.75rem; }
      `}</style>
    </div>
  );
};

export default NewsManagement;
