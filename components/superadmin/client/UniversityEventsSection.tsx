"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Home, CalendarDays, Search, Pencil, Trash2, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { adminEventApi, AdminEvent } from "@/services/eventApi";

interface University { id: number; name: string; }
interface DeleteModal { isOpen: boolean; id: number | null; title: string; }

export default function UniversityEventsSection({ setActiveSection }: { setActiveSection: (s: string) => void }) {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [universities, setUniversities] = useState<University[]>([]);
  const [filterUniversity, setFilterUniversity] = useState(0);
  const [deleteModal, setDeleteModal] = useState<DeleteModal>({ isOpen: false, id: null, title: "" });
  const limit = 10;

  const fetchEvents = useCallback(async (p: number, s: string, uid: number) => {
    setLoading(true);
    try {
      const params: any = { page: p, limit, search: s || undefined, has_university: "true" };
      if (uid) params.university_id = uid;
      const res = await adminEventApi.list(params);
      setEvents(res.events || []);
      setTotal(res.meta?.total || 0);
    } catch { setEvents([]); setTotal(0); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("superadmin_token");
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const res = await fetch(`${baseUrl}/api/v1/admin/universities?limit=500`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const json = await res.json();
        setUniversities(json?.data?.universities?.map((u: any) => ({ id: u.id, name: u.name })) || []);
      } catch {}
    })();
  }, []);

  useEffect(() => { fetchEvents(page, search, filterUniversity); }, [page, filterUniversity]);

  const handleSearch = () => { setPage(1); fetchEvents(1, search, filterUniversity); };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    const id = deleteModal.id;
    setDeleteModal({ isOpen: false, id: null, title: "" });
    try { await adminEventApi.delete(id); setEvents((prev) => prev.filter((e) => e.id !== id)); toast.success("Event deleted."); }
    catch (err) { toast.error(err instanceof Error ? err.message : "Failed to delete"); }
  };

  const totalPages = Math.ceil(total / limit);
  if (loading && events.length === 0) return <div className="py-12 text-center text-slate-500">Loading...</div>;

  return (
    <div className="space-y-6">
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Event</h3>
            <p className="text-sm text-gray-600 mb-6">Delete &ldquo;{deleteModal.title}&rdquo;?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteModal({ isOpen: false, id: null, title: "" })} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">University Events</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <Home className="w-4 h-4" /> <span>Dashboard</span> <span>-</span> <span className="text-gray-800 font-medium">University Events</span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><CalendarDays className="w-5 h-5 text-blue-600" /> Events Directory</h2>
          <div className="flex items-center gap-3">
            <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" value={filterUniversity} onChange={(e) => { setFilterUniversity(Number(e.target.value)); setPage(1); }}>
              <option value={0}>All Universities</option>
              {universities.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
            <div className="relative w-48">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
            </div>
            <button onClick={() => setActiveSection("create-university-events")} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"><Plus size={16} /> Add Event</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">University</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Category</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Date</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Location</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.length === 0 ? <tr><td colSpan={6} className="py-8 text-center text-gray-500">No events found</td></tr> : events.map((item) => {
                const uni = universities.find((u) => u.id === (item as any).university_id);
                return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4"><p className="font-medium text-gray-900">{item.title}</p></td>
                  <td className="text-center py-3 px-4 text-gray-500">{uni?.name || "-"}</td>
                  <td className="text-center py-3 px-4"><span className="px-2 py-1 rounded text-xs font-semibold bg-purple-100 text-purple-700">{item.category}</span></td>
                  <td className="text-center py-3 px-4 text-gray-500">{item.date || "-"}</td>
                  <td className="text-center py-3 px-4 text-gray-600">{item.location || "-"}</td>
                  <td className="text-center py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 hover:bg-green-50 rounded text-green-600" onClick={() => setActiveSection(`edit-university-event-${item.id}`)}><Pencil className="w-4 h-4" /></button>
                      <button className="p-1.5 hover:bg-red-50 rounded text-red-600" onClick={() => { const t = events.find((e) => e.id === item.id); setDeleteModal({ isOpen: true, id: item.id, title: t?.title || "" }); }}><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-500">Showing {(page - 1) * limit + 1}-{Math.min(page * limit, total)} of {total}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /></button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium ${page === i + 1 ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{i + 1}</button>
              ))}
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
