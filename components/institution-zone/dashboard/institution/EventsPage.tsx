"use client";

import React, { useState, useMemo } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  MoreVertical, 
  Eye, 
  Edit3, 
  Copy, 
  Trash2, 
  ChevronDown,
  Calendar,
  User,
  Star,
  CheckCircle2,
  Clock,
  Lock,
  Archive,
  X,
  Send,
  AlertCircle,
  TrendingUp,
  Image as ImageIcon
} from "lucide-react";

// --- TYPES ---
type NewsStatus = 'Published' | 'Draft' | 'Open' | 'Closed' | 'Scheduled';
type NewsCategory = 'Academics' | 'Events' | 'Announcements' | 'Sports';

interface NewsItem {
  id: number;
  title: string;
  desc: string;
  category: NewsCategory;
  author: string;
  status: NewsStatus;
  views: number;
  date: string;
  deadline: string;
  created: string;
  image: string;
  featured: boolean;
}

const INITIAL_DATA: NewsItem[] = [
  { id: 1, title: 'Spring Festival 2026 Announced: A Week of Culture and Fun', desc: 'Join us for the annual spring festival featuring music, art, and academic showcases across all campuses.', category: 'Events', author: 'Dean of Students', status: 'Published', views: 12504, date: 'Apr 05, 2026', deadline: 'Apr 15, 2026', created: 'Apr 01, 2026', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80', featured: true },
  { id: 2, title: 'Campus Wi-Fi Maintenance Notice', desc: 'Scheduled maintenance for campus networks in Building A and B. Expected downtime is 2 hours.', category: 'Announcements', author: 'IT Support', status: 'Scheduled', views: 0, date: 'Apr 10, 2026', deadline: '-', created: 'Apr 06, 2026', image: 'https://images.unsplash.com/photo-1562504208-03d85ce8fa30?w=600&q=80', featured: false },
  { id: 3, title: 'Final Exam Guidelines Update for Spring Semester', desc: 'Please review the updated guidelines regarding online proctoring and in-person final exams.', category: 'Academics', author: 'Academic Affairs', status: 'Open', views: 8342, date: 'Apr 01, 2026', deadline: 'May 01, 2026', created: 'Mar 28, 2026', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80', featured: false },
  { id: 4, title: 'Draft: Alumni Meet 2026 Preparation', desc: 'Initial planning for the grand alumni meetup. Awaiting final speaker confirmations.', category: 'Events', author: 'Sarah Jenkins', status: 'Draft', views: 0, date: '-', deadline: '-', created: 'Apr 07, 2026', image: 'https://images.unsplash.com/photo-1511629091441-ee46146481b6?w=600&q=80', featured: false },
  { id: 5, title: 'Varsity Basketball Team Secures Regional Championship', desc: 'An incredible victory for our basketball team last night against the rival state university.', category: 'Sports', author: 'Athletics Dept', status: 'Published', views: 4500, date: 'Apr 06, 2026', deadline: '-', created: 'Apr 06, 2026', image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=600&q=80', featured: true },
  { id: 6, title: 'Scholarship Applications Closed', desc: 'The window for fall semester scholarship applications has officially closed. Review process begins.', category: 'Academics', author: 'Financial Aid', status: 'Closed', views: 2310, date: 'Mar 15, 2026', deadline: 'Mar 31, 2026', created: 'Mar 01, 2026', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80', featured: false },
];

export default function NewsNoticePage() {
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [news, setNews] = useState<NewsItem[]>(INITIAL_DATA);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  // --- FILTERED DATA ---
  const filteredData = useMemo(() => {
    return news.filter(item => {
      const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.desc.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchCategory = categoryFilter === 'all' || item.category === categoryFilter;
      return matchSearch && matchStatus && matchCategory;
    });
  }, [news, search, statusFilter, categoryFilter]);

  // --- ACTIONS ---
  const toggleSelect = (id: number) => {
    const next = new Set(selectedItems);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedItems(next);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === filteredData.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredData.map(d => d.id)));
    }
  };

  const handleDelete = (id: number) => {
    if (typeof window !== 'undefined' && window.confirm("Are you sure you want to delete this news?")) {
      setNews(news.filter(n => n.id !== id));
      const next = new Set(selectedItems);
      next.delete(id);
      setSelectedItems(next);
    }
  };

  const handleDuplicate = (id: number) => {
    const item = news.find(n => n.id === id);
    if (item) {
      const copy = { ...item, id: Date.now(), title: `${item.title} (Copy)`, status: 'Draft' as NewsStatus, views: 0 };
      setNews([copy, ...news]);
    }
  };

  const getStatusStyle = (status: NewsStatus) => {
    const styles = {
      'Published': 'bg-green-100 text-green-700 border-green-200',
      'Draft': 'bg-gray-100 text-gray-600 border-gray-200',
      'Open': 'bg-blue-100 text-blue-700 border-blue-200',
      'Closed': 'bg-red-100 text-red-700 border-red-200',
      'Scheduled': 'bg-purple-100 text-purple-700 border-purple-200',
    };
    return styles[status] || styles['Draft'];
  };

  const getCategoryStyle = (cat: NewsCategory) => {
    const styles = {
      'Events': 'bg-blue-50 text-blue-600',
      'Announcements': 'bg-purple-50 text-purple-600',
      'Academics': 'bg-orange-50 text-orange-600',
      'Sports': 'bg-emerald-50 text-emerald-600'
    };
    return styles[cat] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="flex-1 bg-gray-50/50 min-h-screen">
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">News Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage, publish, and track college announcements and news.</p>
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md text-sm font-semibold  transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus size={20} />
            Create News
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-md border border-gray-200  mb-6">
          <div className="flex flex-col xl:flex-row gap-4">
            <div className="flex-1 flex flex-wrap items-center gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search titles or summary..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer border-none"
              >
                <option value="all">All Status</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
                <option value="Scheduled">Scheduled</option>
              </select>

              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer border-none"
              >
                <option value="all">All Category</option>
                <option value="Academics">Academics</option>
                <option value="Events">Events</option>
                <option value="Announcements">Announcements</option>
                <option value="Sports">Sports</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-md self-start">
              <button 
                onClick={() => setView('grid')}
                className={`p-2 rounded-md transition-all ${view === 'grid' ? 'bg-white  text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setView('table')}
                className={`p-2 rounded-md transition-all ${view === 'table' ? 'bg-white  text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedItems.size > 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-6 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-md">
                {selectedItems.size} Selected
              </span>
              <span className="text-sm font-medium text-blue-800 hidden sm:inline">Items to process</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-xs font-semibold bg-white border border-blue-200 text-blue-700 rounded-md hover:bg-blue-100 transition-colors">Publish</button>
              <button className="px-3 py-1.5 text-xs font-semibold bg-white border border-red-200 text-red-600 rounded-md hover:bg-red-50 transition-colors">Delete</button>
            </div>
          </div>
        )}

        {/* Content */}
        {filteredData.length === 0 ? (
          <div className="bg-white rounded-md border border-dashed border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-gray-300" size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No results found</h3>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or search terms.</p>
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map(item => (
              <div 
                key={item.id}
                className={`group relative bg-white rounded-md border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  selectedItems.has(item.id) ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-gray-200'
                }`}
              >
                {/* Selection Overlay */}
                <div className={`absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity ${selectedItems.has(item.id) ? 'opacity-100' : ''}`}>
                  <input 
                    type="checkbox" 
                    checked={selectedItems.has(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    className="w-5 h-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer bg-white "
                  />
                </div>

                {/* Featured Badge */}
                {item.featured && (
                  <div className="absolute top-4 left-4 z-10">
                    <div className="flex items-center gap-1 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-md  uppercase tracking-wider">
                      <Star size={10} fill="currentColor" />
                      Featured
                    </div>
                  </div>
                )}

                {/* Hero Image */}
                <div className="relative h-48 overflow-hidden rounded-t-2xl">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <button 
                      onClick={() => {
                        setSelectedNews(item);
                        setIsPreviewModalOpen(true);
                      }}
                      className="w-full bg-white/90 backdrop-blur-sm text-gray-900 py-2 rounded-md text-xs font-bold flex items-center justify-center gap-2 hover:bg-white transition-colors"
                    >
                      <Eye size={14} /> Quick Preview
                    </button>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${getCategoryStyle(item.category)}`}>
                      {item.category}
                    </span>
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-base leading-tight mb-2 line-clamp-2 min-h-[3rem] group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                    {item.desc}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                      <Calendar size={12} />
                      {item.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                         onClick={() => handleDuplicate(item.id)}
                        className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                      >
                        <Copy size={16} />
                      </button>
                      <button 
                         onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-md border border-gray-200  overflow-hidden">
            <div className="overflow-x-auto overflow-y-visible">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-200 text-[11px] uppercase tracking-wider text-gray-400 font-bold">
                    <th className="px-6 py-4 w-12 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedItems.size === filteredData.length && filteredData.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-4">Title & Description</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Views</th>
                    <th className="px-6 py-4">Created At</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredData.map(item => (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-gray-50/50 transition-colors group ${selectedItems.has(item.id) ? 'bg-blue-50/30' : ''}`}
                    >
                      <td className="px-6 py-4 text-center">
                         <input 
                          type="checkbox" 
                          checked={selectedItems.has(item.id)}
                          onChange={() => toggleSelect(item.id)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4 max-w-lg">
                          <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 border border-gray-100 ">
                            <img src={item.image} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                              {item.title}
                              {item.featured && <Star size={12} className="text-amber-500 fill-amber-500" />}
                            </h4>
                            <p className="text-xs text-gray-500 truncate mt-0.5">{item.desc}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${getCategoryStyle(item.category)}`}>
                            {item.category}
                          </span>
                      </td>
                      <td className="px-6 py-4">
                         <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${getStatusStyle(item.status)}`}>
                            {item.status}
                          </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                          <TrendingUp size={14} className="text-blue-500" />
                          {item.views.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-gray-500 font-medium">
                          {item.created}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => {
                                    setSelectedNews(item);
                                    setIsPreviewModalOpen(true);
                                }}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            >
                                <Eye size={18} />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                                <Edit3 size={18} />
                            </button>
                            <button 
                                onClick={() => handleDelete(item.id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* --- PREVIEW MODAL --- */}
      {isPreviewModalOpen && selectedNews && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm" onClick={() => setIsPreviewModalOpen(false)}></div>
           <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-md overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
                <button 
                    onClick={() => setIsPreviewModalOpen(false)}
                    className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white/40 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="overflow-y-auto no-scrollbar">
                    <div className="relative h-72 sm:h-96 w-full">
                        <img src={selectedNews.image} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                        <div className="absolute bottom-10 left-10 right-10">
                            <span className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md mb-4 inline-block ${getCategoryStyle(selectedNews.category)} text-white`}>
                                {selectedNews.category}
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                                {selectedNews.title}
                            </h2>
                        </div>
                    </div>

                    <div className="p-10">
                        <div className="flex flex-wrap items-center gap-6 mb-10 pb-6 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                    <User size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{selectedNews.author}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">Publisher & Admin</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 text-gray-400">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold uppercase tracking-wide">Published</span>
                                    <span className="text-sm font-semibold text-gray-700">{selectedNews.date}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold uppercase tracking-wide">Deadline</span>
                                    <span className="text-sm font-semibold text-red-500">{selectedNews.deadline}</span>
                                </div>
                            </div>
                        </div>

                        <div className="prose prose-blue max-w-none">
                            <p className="text-xl font-medium text-gray-900 mb-6 leading-relaxed bg-blue-50/50 p-6 rounded-md border-l-4 border-blue-500">
                                {selectedNews.desc}
                            </p>
                        </div>
                    </div>
                </div>
           </div>
        </div>
      )}

      {/* --- CREATE MODAL --- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)}></div>
            <div className="relative bg-white w-full max-w-6xl max-h-[92vh] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom-5 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between px-10 py-6 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-md flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Plus size={24} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900">Create News Article</h3>
                    </div>
                    <button 
                        onClick={() => setIsCreateModalOpen(false)}
                        className="w-10 h-10 bg-gray-100 text-gray-500 rounded-md flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col lg:flex-row">
                    {/* Main Content Area */}
                    <div className="flex-1 p-10 space-y-8 border-r border-gray-100">
                        <div className="space-y-2">
                             <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Article Title</label>
                             <input 
                                type="text"
                                placeholder="Enter a catchy title..."
                                className="w-full text-4xl font-black text-gray-900 placeholder-gray-200 border-0 border-b border-transparent focus:border-blue-500 focus:ring-0 px-0 pb-4 bg-transparent outline-none transition-all border-none"
                             />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Quick Summary</label>
                            <textarea 
                                placeholder="Write a short summary that will appear on cards..."
                                rows={3}
                                className="w-full p-6 bg-gray-50/50 border border-gray-200 rounded-md text-base text-gray-700 placeholder-gray-400 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none"
                            ></textarea>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Full Content</label>
                            <div className="border border-gray-200 rounded-[2rem] overflow-hidden bg-white  ring-1 ring-black/5">
                                <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-200 flex flex-wrap items-center gap-2">
                                    <button className="p-2 text-gray-600 hover:bg-white hover: rounded-md transition-all">Type</button>
                                    <div className="w-px h-6 bg-gray-200 mx-1"></div>
                                    {['bold', 'italic', 'underline', 'link', 'image'].map(tool => (
                                        <button key={tool} className="p-2 text-gray-600 hover:bg-white hover: rounded-md transition-all capitalize">{tool}</button>
                                    ))}
                                </div>
                                <div 
                                    className="p-8 min-h-[350px] outline-none text-lg text-gray-700 leading-relaxed empty:before:content-[attr(placeholder)] empty:before:text-gray-300"
                                    contentEditable
                                    onInput={(e) => {}}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Settings Sidebar */}
                    <div className="w-full lg:w-[380px] bg-gray-50/50 p-10 space-y-8 flex-shrink-0">
                         {/* Image Upload */}
                        <div className="space-y-4">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Featured Image</label>
                            <div className="relative group cursor-pointer">
                                <div className="aspect-[4/3] bg-white border-2 border-dashed border-gray-200 rounded-md flex flex-col items-center justify-center p-8 transition-all group-hover:border-blue-500 group-hover:bg-blue-50/30">
                                    <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mb-4 transition-all group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-xl group-hover:shadow-blue-500/30">
                                        <ImageIcon size={40} />
                                    </div>
                                    <p className="text-sm font-bold text-gray-900">Drop your file here</p>
                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG or WEBP (Max 5MB)</p>
                                    <button className="mt-6 px-4 py-2 bg-white border border-gray-200 rounded-md text-xs font-bold text-gray-600  group-hover:border-blue-200 group-hover:text-blue-600 transition-all">Browse Files</button>
                                </div>
                            </div>
                        </div>

                        {/* Configs */}
                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-black/5 space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Category</label>
                                <select className="w-full bg-gray-50 border-none rounded-md px-4 py-3 text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option>Events</option>
                                    <option>Academics</option>
                                    <option>Announcements</option>
                                    <option>Sports</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</label>
                                <select className="w-full bg-gray-50 border-none rounded-md px-4 py-3 text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option>Published</option>
                                    <option>Draft</option>
                                    <option>Scheduled</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Publish Date</label>
                                    <input type="date" className="w-full bg-gray-50 border-none rounded-md px-4 py-2.5 text-xs font-semibold text-gray-900" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Deadline</label>
                                    <input type="date" className="w-full bg-gray-50 border-none rounded-md px-4 py-2.5 text-xs font-semibold text-gray-900" />
                                </div>
                            </div>

                            <label className="flex items-center gap-3 p-4 bg-amber-50 rounded-md border border-amber-100 cursor-pointer group hover:bg-amber-100 transition-colors">
                                <div className="w-8 h-8 bg-amber-500 text-white rounded-md flex items-center justify-center shadow-lg shadow-amber-500/20">
                                    <Star size={16} fill="currentColor" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[11px] font-black text-amber-800 uppercase tracking-widest leading-none mb-1">Featured</p>
                                    <p className="text-[11px] text-amber-600 font-medium">Prioritize on home</p>
                                </div>
                                <input type="checkbox" className="w-5 h-5 rounded-md border-amber-300 text-amber-600 focus:ring-amber-500" />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-10 py-8 bg-white border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                    <button 
                        onClick={() => setIsCreateModalOpen(false)}
                        className="px-6 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    >
                        Discard Changes
                    </button>
                    <div className="flex items-center gap-4">
                        <button className="px-8 py-3 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-all">
                            Save as Draft
                        </button>
                        <button className="px-8 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xl shadow-blue-500/20 transition-all flex items-center gap-2 active:scale-95">
                            <Send size={18} />
                            Publish Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
