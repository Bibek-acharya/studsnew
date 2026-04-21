"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  MagnifyingGlass,
  ListIcon,
  Bell,
  Plus,
  ArrowLeft,
  X,
  Eye,
  Trash,
  CircleNotch,
  Funnel,
  PaperPlaneRight,
  FloppyDisk,
  CaretDown,
  PencilSimple,
} from "@phosphor-icons/react";
import Link from "next/link";
import { fetchInquiries, Inquiry } from "@/services/inquiryApi";
import SuperadminSidebar from "@/components/superadmin/dashboard/SuperadminSidebar";

const InquiriesManagement: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [previewData, setPreviewData] = useState<Inquiry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const loadInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchInquiries();
      setInquiries(result.inquiries);
    } catch {
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInquiries();
  }, [loadInquiries]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getDaysAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "1 day ago";
      return `${diffDays} days ago`;
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return "bg-[#EEF2FF] text-[#4F46E5]";
      case "read":
        return "bg-[#FEF3C7] text-[#D97706]";
      case "replied":
        return "bg-[#ECFDF5] text-[#10B981]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      searchQuery === "" ||
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.message?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
              <h1 className="text-[24px] font-bold text-[#111827]">Inquiries Management</h1>
              <p className="text-[#6B7280] font-medium mt-1">Manage contact form submissions and inquiries.</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Inquiries", value: inquiries.length, color: "text-[#4F46E5]" },
              { label: "New", value: inquiries.filter((i) => i.status === "new").length, color: "text-blue-600" },
              { label: "Read", value: inquiries.filter((i) => i.status === "read").length, color: "text-amber-600" },
              { label: "Replied", value: inquiries.filter((i) => i.status === "replied").length, color: "text-green-600" },
            ].map((stat, i) => (
              <div key={i} className="bg-white border border-[#E5E7EB] p-5 rounded-2xl flex items-center gap-4 shadow-sm">
                <div className={`w-12 h-12 rounded-xl bg-[#F9FAFB] flex items-center justify-center ${stat.color} shadow-inner`}>
                  <Funnel className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                  <p className="text-xl font-bold text-[#111827]">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filters Section */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full sm:w-[250px]">
                <MagnifyingGlass size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                <input
                  type="text"
                  placeholder="Search inquiries..."
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg pl-10 pr-4 py-2 text-sm font-medium outline-none focus:border-[#4F46E5] focus:ring-4 focus:ring-[#EEF2FF] transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm font-semibold outline-none min-w-[150px] appearance-none cursor-pointer hover:border-indigo-300 transition-colors"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' fill=\'%236B7280\' viewBox=\'0 0 256 256\'%3E%3Cpath d=\'M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                    <th className="p-4 text-xs font-bold text-[#6B7280] uppercase tracking-wider">Name</th>
                    <th className="p-4 text-xs font-bold text-[#6B7280] uppercase tracking-wider">Email</th>
                    <th className="p-4 text-xs font-bold text-[#6B7280] uppercase tracking-wider">Phone</th>
                    <th className="p-4 text-xs font-bold text-[#6B7280] uppercase tracking-wider">Status</th>
                    <th className="p-4 text-xs font-bold text-[#6B7280] uppercase tracking-wider">Date</th>
                    <th className="p-4 text-xs font-bold text-[#6B7280] uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center">
                        <CircleNotch className="animate-spin mx-auto text-[#4F46E5]" size={32} />
                      </td>
                    </tr>
                  ) : filteredInquiries.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-[#6B7280]">No inquiries found.</td>
                    </tr>
                  ) : filteredInquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-gray-50 border-b border-gray-100 last:border-0">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5] font-bold">
                            {inq.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-sm">{inq.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm">{inq.email}</td>
                      <td className="p-4 text-sm">{inq.phone}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[12px] font-bold ${getStatusBadge(inq.status)}`}>
                          {inq.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-[#6B7280]">{getDaysAgo(inq.created_at)}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setPreviewData(inq)} className="w-[32px] h-[32px] rounded-lg bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center hover:opacity-80 transition-all">
                            <Eye size={18} />
                          </button>
                          <button onClick={() => setDeleteId(String(inq.id))} className="w-[32px] h-[32px] rounded-lg bg-[#FEF2F2] text-[#EF4444] flex items-center justify-center hover:opacity-80 transition-all">
                            <Trash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Preview Modal */}
      {previewData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#111827]/50 backdrop-blur-sm transition-opacity duration-300" onClick={() => setPreviewData(null)} />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#111827]">Inquiry Details</h2>
              <button onClick={() => setPreviewData(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                <X size={20} weight="bold" />
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5] text-xl font-bold">
                  {previewData.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#111827]">{previewData.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${getStatusBadge(previewData.status)}`}>
                    {previewData.status}
                  </span>
                </div>
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-[#6B7280]">
                  <span className="font-semibold">Email:</span>
                  <a href={`mailto:${previewData.email}`} className="text-[#4F46E5] hover:underline">{previewData.email}</a>
                </div>
                <div className="flex items-center gap-3 text-[#6B7280]">
                  <span className="font-semibold">Phone:</span>
                  <a href={`tel:${previewData.phone}`} className="text-[#4F46E5] hover:underline">{previewData.phone}</a>
                </div>
                <div className="flex items-center gap-3 text-[#6B7280]">
                  <span className="font-semibold">Date:</span>
                  <span>{getDaysAgo(previewData.created_at)}</span>
                </div>
              </div>
              <div className="bg-[#F9FAFB] rounded-xl p-4 border border-[#E5E7EB]">
                <h4 className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-3">Message</h4>
                <p className="text-[#111827] leading-relaxed">{previewData.message}</p>
              </div>
            </div>
            <div className="p-6 bg-[#F9FAFB] border-t border-[#E5E7EB] flex justify-end gap-3">
              <button onClick={() => setPreviewData(null)} className="px-5 py-2.5 text-sm font-bold bg-[#111827] text-white rounded-lg hover:bg-gray-800 transition-all">
                Close
              </button>
              <a href={`mailto:${previewData.email}`} className="px-5 py-2.5 text-sm font-bold bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338ca] transition-all flex items-center gap-2">
                <PaperPlaneRight size={18} weight="bold" /> Reply
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#111827]/50 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-8 text-center animate-in zoom-in-95 duration-300 shadow-2xl">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash size={36} weight="fill" />
            </div>
            <h2 className="text-2xl font-bold text-[#111827] mb-2">Delete Inquiry?</h2>
            <p className="text-[#6B7280] mb-8">This action cannot be undone.</p>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3 text-sm font-bold text-[#111827] bg-white border border-[#E5E7EB] rounded-xl hover:bg-gray-50 transition-all">Cancel</button>
              <button onClick={() => { setDeleteId(null); showToast("Inquiry deleted", "success"); }} className="flex-1 py-3 text-sm font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-all shadow-md shadow-red-100">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-8 right-8 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl text-white shadow-2xl animate-in slide-in-from-bottom-5 duration-300 ${toast.type === "success" ? "bg-[#10B981]" : "bg-red-500"}`}>
          <span className="font-bold">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default InquiriesManagement;