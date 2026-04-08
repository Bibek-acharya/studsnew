"use client";

import React, { useState, useEffect } from "react";
import {
  Newspaper,
  GraduationCap,
  CaretUp,
  List,
  MagnifyingGlass,
  Bell,
  PlusCircle,
  Plus,
  Faders,
  SquaresFour,
  ListDashes,
  PaperPlaneTilt,
  Archive,
  Trash,
  Article,
  X,
  UploadSimple,
  CheckCircle,
  PencilSimple,
  DoorOpen,
  LockKey,
  Clock,
  Star,
  Image as ImageIcon,
  VideoCamera,
  Link as LinkIcon,
  TextB,
  TextItalic,
  TextUnderline,
  ListBullets,
  ListNumbers,
  Eye,
  Copy,
  User,
  Share2,
  Bookmark,
  WarningCircle,
  Info,
} from "@phosphor-icons/react";

interface NewsItem {
  id: number;
  title: string;
  desc: string;
  category: string;
  author: string;
  status: string;
  views: number;
  date: string;
  deadline: string;
  created: string;
  image: string;
  featured: boolean;
}

const NewsManagementPage = () => {
  // --- DATA & STATE ---
  const [mockData, setMockData] = useState<NewsItem[]>([
    {
      id: 1,
      title: "Spring Festival 2026 Announced: A Week of Culture and Fun",
      desc: "Join us for the annual spring festival featuring music, art, and academic showcases across all campuses.",
      category: "Events",
      author: "Dean of Students",
      status: "Published",
      views: 12504,
      date: "Apr 05, 2026",
      deadline: "Apr 15, 2026",
      created: "Apr 01, 2026",
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
      featured: true,
    },
    {
      id: 2,
      title: "Campus Wi-Fi Maintenance Notice",
      desc: "Scheduled maintenance for campus networks in Building A and B. Expected downtime is 2 hours.",
      category: "Announcements",
      author: "IT Support",
      status: "Scheduled",
      views: 0,
      date: "Apr 10, 2026",
      deadline: "-",
      created: "Apr 06, 2026",
      image:
        "https://images.unsplash.com/photo-1562504208-03d85ce8fa30?w=600&q=80",
      featured: false,
    },
    {
      id: 3,
      title: "Final Exam Guidelines Update for Spring Semester",
      desc: "Please review the updated guidelines regarding online proctoring and in-person final exams.",
      category: "Academics",
      author: "Academic Affairs",
      status: "Open",
      views: 8342,
      date: "Apr 01, 2026",
      deadline: "May 01, 2026",
      created: "Mar 28, 2026",
      image:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80",
      featured: false,
    },
    {
      id: 4,
      title: "Draft: Alumni Meet 2026 Preparation",
      desc: "Initial planning for the grand alumni meetup. Awaiting final speaker confirmations.",
      category: "Events",
      author: "Sarah Jenkins",
      status: "Draft",
      views: 0,
      date: "-",
      deadline: "-",
      created: "Apr 07, 2026",
      image:
        "https://images.unsplash.com/photo-1511629091441-ee46146481b6?w=600&q=80",
      featured: false,
    },
    {
      id: 5,
      title: "Varsity Basketball Team Secures Regional Championship",
      desc: "An incredible victory for our basketball team last night against the rival state university.",
      category: "Sports",
      author: "Athletics Dept",
      status: "Published",
      views: 4500,
      date: "Apr 06, 2026",
      deadline: "-",
      created: "Apr 06, 2026",
      image:
        "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=600&q=80",
      featured: true,
    },
    {
      id: 6,
      title: "Scholarship Applications Closed",
      desc: "The window for fall semester scholarship applications has officially closed. Review process begins.",
      category: "Academics",
      author: "Financial Aid",
      status: "Closed",
      views: 2310,
      date: "Mar 15, 2026",
      deadline: "Mar 31, 2026",
      created: "Mar 01, 2026",
      image:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80",
      featured: false,
    },
  ]);

  const [view, setView] = useState<"grid" | "table">("grid");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [currentEditId, setCurrentEditId] = useState<number | null>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [toasts, setToasts] = useState<
    { id: number; message: string; type: "success" | "info" | "error" }[]
  >([]);

  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    category: "Events",
    status: "Draft",
    featured: false,
    date: "",
    deadline: "",
  });

  // --- UTILS ---
  const showToast = (
    message: string,
    type: "success" | "info" | "error" = "success",
  ) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; icon: any }> = {
      Published: {
        color: "bg-green-100 text-green-700 border-green-200",
        icon: CheckCircle,
      },
      Draft: {
        color: "bg-gray-100 text-gray-600 border-gray-200",
        icon: PencilSimple,
      },
      Open: {
        color: "bg-blue-100 text-blue-700 border-blue-200",
        icon: DoorOpen,
      },
      Closed: {
        color: "bg-red-100 text-red-700 border-red-200",
        icon: LockKey,
      },
      Scheduled: {
        color: "bg-purple-100 text-purple-700 border-purple-200",
        icon: Clock,
      },
    };
    return configs[status] || configs["Draft"];
  };

  const getCategoryStyle = (cat: string) => {
    const styles: Record<string, string> = {
      Events: "bg-blue-50 text-blue-600",
      Announcements: "bg-purple-50 text-purple-600",
      Academics: "bg-orange-50 text-orange-600",
      Sports: "bg-emerald-50 text-emerald-600",
    };
    return styles[cat] || "bg-gray-100 text-gray-600";
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num;
  };

  const filteredData = mockData.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.desc.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    const matchCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    return matchSearch && matchStatus && matchCategory;
  });

  // --- ACTIONS ---
  const handleOpenEdit = (id: number | null = null) => {
    setCurrentEditId(id);
    if (id) {
      const item = mockData.find((d) => d.id === id);
      if (item) {
        setFormData({
          title: item.title,
          desc: item.desc,
          category: item.category,
          status: item.status,
          featured: item.featured,
          date:
            item.date === "-"
              ? ""
              : new Date(item.date).toISOString().split("T")[0],
          deadline:
            item.deadline === "-"
              ? ""
              : new Date(item.deadline).toISOString().split("T")[0],
        });
      }
    } else {
      setFormData({
        title: "",
        desc: "",
        category: "Events",
        status: "Draft",
        featured: false,
        date: "",
        deadline: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (overrideStatus: string | null = null) => {
    if (!formData.title.trim()) {
      showToast("Title is required", "error");
      return;
    }

    const isNew = currentEditId === null;
    const status = overrideStatus || formData.status;

    const newItem: NewsItem = {
      id: isNew ? Date.now() : currentEditId!,
      title: formData.title,
      desc: formData.desc || "No summary provided.",
      category: formData.category,
      status: status,
      featured: formData.featured,
      author: isNew
        ? "Sarah Jenkins"
        : mockData.find((d) => d.id === currentEditId)?.author || "Admin",
      views: isNew
        ? 0
        : mockData.find((d) => d.id === currentEditId)?.views || 0,
      date: formData.date
        ? new Date(formData.date).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
        : "-",
      deadline: formData.deadline
        ? new Date(formData.deadline).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
        : "-",
      created: isNew
        ? new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
        : mockData.find((d) => d.id === currentEditId)?.created || "-",
      image: isNew
        ? `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=600&q=80`
        : mockData.find((d) => d.id === currentEditId)?.image || "",
    };

    if (isNew) {
      setMockData((prev) => [newItem, ...prev]);
      showToast(`News created successfully as ${status}`);
    } else {
      setMockData((prev) =>
        prev.map((d) => (d.id === currentEditId ? newItem : d)),
      );
      showToast(`News updated successfully`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    setMockData((prev) => prev.filter((d) => d.id !== id));
    setSelectedItems((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    showToast("Article deleted successfully");
  };

  const toggleSelect = (id: number) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === filteredData.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredData.map((d) => d.id)));
    }
  };

  const handleBulkAction = (newStatus: string) => {
    setMockData((prev) =>
      prev.map((item) =>
        selectedItems.has(item.id) ? { ...item, status: newStatus } : item,
      ),
    );
    setSelectedItems(new Set());
    showToast(`${selectedItems.size} items updated to ${newStatus}`);
  };

  const handleDuplicate = (id: number) => {
    const item = mockData.find((d) => d.id === id);
    if (item) {
      const duplicate = {
        ...item,
        id: Date.now(),
        title: item.title + " (Copy)",
        status: "Draft",
        views: 0,
      };
      const idx = mockData.findIndex((d) => d.id === id);
      const next = [...mockData];
      next.splice(idx + 1, 0, duplicate);
      setMockData(next);
      showToast("Article duplicated as Draft");
    }
  };

  return (
    <div className="bg-gray-50 text-gray-800 font-sans h-screen flex overflow-hidden antialiased relative">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Left Sidebar */}
      <aside
        className={`bg-white w-64 h-full border-r border-gray-200 flex flex-col fixed lg:static transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 z-30 shadow-sm lg:shadow-none`}
      >
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <div className="flex items-center gap-2 text-blue-600">
            <GraduationCap weight="fill" className="text-3xl" />
            <span className="text-xl font-bold tracking-tight">UniNews</span>
          </div>
          <button
            className="ml-auto lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="text-xl" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          <a
            href="#"
            className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 shadow-sm transition-all relative group hover:bg-blue-100"
          >
            <div className="flex items-center gap-3">
              <Newspaper
                weight="fill"
                className="text-2xl group-hover:scale-110 transition-transform"
              />
              <span className="font-semibold text-sm">News Management</span>
            </div>
            <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
              {mockData.length}
            </span>
          </a>
        </nav>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3 hover:bg-white p-2 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-gray-200 hover:shadow-sm">
            <img
              src="https://i.pravatar.cc/150?u=admin"
              alt="Admin"
              className="w-10 h-10 rounded-full border border-gray-200 shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                Sarah Jenkins
              </p>
              <p className="text-xs text-gray-500 truncate">Super Admin</p>
            </div>
            <CaretUp className="text-gray-400" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-gray-50/50">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0 shadow-sm">
          <div className="flex items-center gap-4 flex-1">
            <button
              className="lg:hidden text-gray-500 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <List className="text-2xl" />
            </button>
            <div className="relative hidden sm:block max-w-md w-full">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search news, categories, or authors..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <button className="p-2.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors relative">
              <Bell className="text-xl" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
            <button
              onClick={() => handleOpenEdit()}
              className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-all shadow-blue-500/20 active:scale-95"
            >
              <PlusCircle className="text-xl" />
              Create News
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-6 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                News Management
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage, publish, and track college announcements and news.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                <div className="relative w-full sm:w-auto sm:min-w-[240px]">
                  <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search titles..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="py-2 pl-3 pr-8 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer shadow-sm hover:bg-white transition-colors"
                >
                  <option value="all">All Statuses</option>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                  <option value="Scheduled">Scheduled</option>
                </select>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="py-2 pl-3 pr-8 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer shadow-sm hover:bg-white transition-colors"
                >
                  <option value="all">All Categories</option>
                  <option value="Academics">Academics</option>
                  <option value="Events">Events</option>
                  <option value="Announcements">Announcements</option>
                  <option value="Sports">Sports</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg self-start xl:self-auto border border-gray-200">
                <button
                  onClick={() => setView("grid")}
                  className={`p-1.5 rounded transition-all ${view === "grid" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-900"}`}
                >
                  {view === "grid" ? (
                    <SquaresFour weight="fill" className="text-xl" />
                  ) : (
                    <SquaresFour className="text-xl" />
                  )}
                </button>
                <button
                  onClick={() => setView("table")}
                  className={`p-1.5 rounded transition-all ${view === "table" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-900"}`}
                >
                  {view === "table" ? (
                    <ListDashes weight="fill" className="text-xl" />
                  ) : (
                    <ListDashes className="text-xl" />
                  )}
                </button>
              </div>
            </div>

            {selectedItems.size > 0 && (
              <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm transition-all">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded text-xs font-bold shadow-sm">
                    {selectedItems.size}
                  </span>
                  <span className="text-sm font-medium text-blue-800">
                    Items Selected
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleBulkAction("Published")}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm active:scale-95 flex items-center gap-2"
                  >
                    <PaperPlaneTilt /> Bulk Publish
                  </button>
                  <button
                    onClick={() => handleBulkAction("Closed")}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm active:scale-95 flex items-center gap-2"
                  >
                    <Archive /> Archive
                  </button>
                  <button
                    onClick={() => setIsConfirmOpen(true)}
                    className="px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors shadow-sm active:scale-95 flex items-center gap-2"
                  >
                    <Trash /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>

          <div id="data-container">
            {filteredData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                <Newspaper className="text-6xl text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  No news found
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Try adjusting your search or filters.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                    setCategoryFilter("all");
                  }}
                  className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : view === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData.map((item) => {
                  const isSelected = selectedItems.has(item.id);
                  const catStyle = getCategoryStyle(item.category);
                  return (
                    <div
                      key={item.id}
                      className={`bg-white rounded-2xl shadow-sm border ${isSelected ? "border-blue-400 ring-2 ring-blue-400" : "border-gray-200"} p-5 hover:shadow-md transition-all group flex flex-col h-full relative`}
                    >
                      <div
                        className={`absolute top-5 right-5 z-20 opacity-0 group-hover:opacity-100 ${isSelected ? "opacity-100" : ""} transition-opacity`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(item.id)}
                          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer shadow-sm bg-white"
                        />
                      </div>
                      <div className="mb-4">
                        <span
                          className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full ${catStyle}`}
                        >
                          {item.category}
                        </span>
                      </div>
                      <div className="h-48 w-full relative mb-5">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover rounded-xl transition-transform duration-500"
                        />
                        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/5 pointer-events-none"></div>
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-5 flex-1 leading-relaxed">
                        {item.desc}
                      </p>
                      <div className="pt-4 border-t border-gray-100 mt-auto">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                            {item.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Eye className="text-lg" />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(item.id)}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <PencilSimple className="text-lg" />
                            </button>
                            <button
                              onClick={() => handleDuplicate(item.id)}
                              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <Copy className="text-lg" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash className="text-lg" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                        <th className="px-5 py-4 w-12 text-center">
                          <input
                            type="checkbox"
                            onChange={toggleSelectAll}
                            checked={
                              selectedItems.size === filteredData.length &&
                              filteredData.length > 0
                            }
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </th>
                        <th className="px-5 py-4">News Details</th>
                        <th className="px-5 py-4">Category</th>
                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4">Views</th>
                        <th className="px-5 py-4">Dates</th>
                        <th className="px-5 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredData.map((item) => {
                        const status = getStatusConfig(item.status);
                        const isSelected = selectedItems.has(item.id);
                        const StatusIcon = status.icon;
                        return (
                          <tr
                            key={item.id}
                            className={`hover:bg-gray-50 transition-colors ${isSelected ? "bg-blue-50/50" : ""}`}
                          >
                            <td className="px-5 py-4 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelect(item.id)}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                              />
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-4 max-w-md">
                                <img
                                  src={item.image}
                                  alt=""
                                  className="w-14 h-14 rounded-lg object-cover border border-gray-200 flex-shrink-0 shadow-sm"
                                />
                                <div>
                                  <p className="text-sm font-bold text-gray-900 line-clamp-1 mb-0.5">
                                    {item.title}{" "}
                                    {item.featured && (
                                      <Star
                                        weight="fill"
                                        className="text-yellow-500 inline ml-1"
                                      />
                                    )}
                                  </p>
                                  <p className="text-xs text-gray-500 line-clamp-1 flex items-center gap-1.5">
                                    <User /> {item.author} &bull; Created{" "}
                                    {item.created}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                                {item.category}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <span
                                className={`px-3 py-1.5 text-xs font-semibold rounded-full border bg-white ${status.color} flex inline-flex items-center gap-1.5 w-max`}
                              >
                                <StatusIcon className="text-sm" /> {item.status}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-sm font-medium text-gray-700">
                              {formatNumber(item.views)}
                            </td>
                            <td className="px-5 py-4 text-xs text-gray-500 space-y-1">
                              <div className="whitespace-nowrap">
                                <span className="font-medium text-gray-400 uppercase tracking-wider mr-1">
                                  Pub:
                                </span>{" "}
                                <span className="text-gray-700">
                                  {item.date}
                                </span>
                              </div>
                              <div className="whitespace-nowrap">
                                <span className="font-medium text-gray-400 uppercase tracking-wider mr-1">
                                  Due:
                                </span>{" "}
                                <span
                                  className={`${item.deadline !== "-" ? "text-orange-600 font-medium" : "text-gray-700"}`}
                                >
                                  {item.deadline}
                                </span>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                  <Eye className="text-xl" />
                                </button>
                                <button
                                  onClick={() => handleOpenEdit(item.id)}
                                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                  <PencilSimple className="text-xl" />
                                </button>
                                <button
                                  onClick={() => handleDuplicate(item.id)}
                                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                >
                                  <Copy className="text-xl" />
                                </button>
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash className="text-xl" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 z-50 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-screen px-4 text-center">
            <div className="inline-block w-full max-w-6xl my-8 text-left align-middle transition-all transform bg-white shadow-2xl rounded-lg overflow-hidden relative">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/80 sticky top-0 z-10">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Article weight="fill" className="text-blue-600" />{" "}
                  {currentEditId ? "Edit News Article" : "Create News Article"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:bg-gray-200 hover:text-gray-700 p-2 rounded-lg transition-colors"
                >
                  <X className="text-lg" />
                </button>
              </div>

              <div className="flex flex-col lg:flex-row h-full max-h-[calc(100vh-8rem)]">
                <div className="flex-1 p-6 overflow-y-auto border-r border-gray-100 custom-scrollbar">
                  <div className="space-y-6">
                    <input
                      type="text"
                      placeholder="Article Title..."
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full text-3xl font-bold text-gray-900 placeholder-gray-300 border-0 border-b-2 border-transparent focus:border-gray-200 focus:ring-0 px-0 py-2 bg-transparent outline-none"
                    />
                    <textarea
                      placeholder="Add a short excerpt or summary (appears in cards)..."
                      rows={2}
                      value={formData.desc}
                      onChange={(e) =>
                        setFormData({ ...formData, desc: e.target.value })
                      }
                      className="w-full text-sm text-gray-600 placeholder-gray-400 border border-gray-200 rounded-lg p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none shadow-sm"
                    ></textarea>

                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                      <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap items-center gap-1">
                        <button className="p-1.5 text-gray-600 hover:bg-gray-200 rounded">
                          <TextB className="text-lg" />
                        </button>
                        <button className="p-1.5 text-gray-600 hover:bg-gray-200 rounded">
                          <TextItalic className="text-lg" />
                        </button>
                        <button className="p-1.5 text-gray-600 hover:bg-gray-200 rounded">
                          <TextUnderline className="text-lg" />
                        </button>
                        <div className="w-px h-5 bg-gray-300 mx-1"></div>
                        <button className="p-1.5 text-gray-600 hover:bg-gray-200 rounded">
                          <ListBullets className="text-lg" />
                        </button>
                        <button className="p-1.5 text-gray-600 hover:bg-gray-200 rounded">
                          <ListNumbers className="text-lg" />
                        </button>
                        <div className="w-px h-5 bg-gray-300 mx-1"></div>
                        <button className="p-1.5 text-gray-600 hover:bg-gray-200 rounded flex items-center gap-1 text-sm font-medium">
                          <LinkIcon className="text-lg" /> Link
                        </button>
                        <button className="p-1.5 text-gray-600 hover:bg-gray-200 rounded flex items-center gap-1 text-sm font-medium">
                          <ImageIcon className="text-lg" /> Image
                        </button>
                        <button className="p-1.5 text-gray-600 hover:bg-gray-200 rounded flex items-center gap-1 text-sm font-medium">
                          <VideoCamera className="text-lg" /> Video
                        </button>
                      </div>
                      <div
                        className="p-4 min-h-[300px] text-gray-700 outline-none text-base leading-relaxed"
                        contentEditable
                        placeholder="Start writing the full news content here..."
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-80 bg-gray-50 p-6 overflow-y-auto custom-scrollbar flex-shrink-0">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Featured Image
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-100 transition-colors cursor-pointer bg-white shadow-sm">
                        <UploadSimple className="text-3xl text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-blue-600 font-medium">
                          Click to upload{" "}
                          <span className="text-gray-500 font-normal">
                            or drag and drop
                          </span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          PNG, JPG, WEBP up to 5MB
                        </p>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-5 shadow-sm">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          Publishing
                        </label>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm text-gray-700 block mb-1">
                              Status
                            </label>
                            <select
                              value={formData.status}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  status: e.target.value,
                                })
                              }
                              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                            >
                              <option value="Draft">Draft</option>
                              <option value="Published">Published</option>
                              <option value="Open">Open</option>
                              <option value="Closed">Closed</option>
                              <option value="Scheduled">Scheduled</option>
                            </select>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs text-gray-600 block mb-1">
                                Publish Date
                              </label>
                              <input
                                type="date"
                                value={formData.date}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    date: e.target.value,
                                  })
                                }
                                className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-600 block mb-1">
                                Deadline Date
                              </label>
                              <input
                                type="date"
                                value={formData.deadline}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    deadline: e.target.value,
                                  })
                                }
                                className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr className="border-gray-100" />
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          Categorization
                        </label>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm text-gray-700 block mb-1">
                              Category
                            </label>
                            <select
                              value={formData.category}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  category: e.target.value,
                                })
                              }
                              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                            >
                              <option value="Academics">Academics</option>
                              <option value="Events">Events</option>
                              <option value="Announcements">
                                Announcements
                              </option>
                              <option value="Sports">Sports</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <hr className="border-gray-100" />
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              featured: e.target.checked,
                            })
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                          Mark as Featured
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between rounded-b-lg">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                >
                  Discard
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleSave("Draft")}
                    className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm transition-colors active:scale-95"
                  >
                    Save Draft
                  </button>
                  <button
                    onClick={() => handleSave("Published")}
                    className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm shadow-blue-500/30 transition-transform active:scale-95 flex items-center gap-2"
                  >
                    <PaperPlaneTilt weight="fill" className="text-lg" /> Publish
                    Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 bg-gray-900/70 z-[60] backdrop-blur-sm flex items-center justify-center p-4 transition-opacity">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all">
            <div className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
                <WarningCircle className="text-2xl text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Are you sure?
              </h3>
              <p className="text-gray-500 text-sm">
                You are about to delete {selectedItems.size} items permanently.
                This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setMockData((prev) =>
                    prev.filter((d) => !selectedItems.has(d.id)),
                  );
                  setSelectedItems(new Set());
                  setIsConfirmOpen(false);
                  showToast("Selected items deleted");
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-[70] flex flex-col gap-3">
        {toasts.map((toast) => {
          const Icon =
            toast.type === "success"
              ? CheckCircle
              : toast.type === "error"
                ? WarningCircle
                : Info;
          const colors = {
            success: "border-green-200 bg-green-50 text-green-800",
            info: "border-blue-200 bg-blue-50 text-blue-800",
            error: "border-red-200 bg-red-50 text-red-800",
          };
          const iconColors = {
            success: "text-green-500",
            info: "text-blue-500",
            error: "text-red-500",
          };
          return (
            <div
              key={toast.id}
              className={`flex items-center gap-3 px-4 py-3 border rounded-xl shadow-lg animate-in slide-in-from-right-full ${colors[toast.type]}`}
            >
              <Icon
                weight="fill"
                className={`text-xl ${iconColors[toast.type]}`}
              />
              <p className="text-sm font-semibold">{toast.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewsManagementPage;
