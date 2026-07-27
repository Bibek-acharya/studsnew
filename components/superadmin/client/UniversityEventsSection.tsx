"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Home, CalendarDays, Search, Pencil, Trash2, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { adminEventApi, AdminEvent } from "@/services/eventApi";

interface University {
  id: number;
  name: string;
}

interface DeleteModal {
  isOpen: boolean;
  id: number | null;
  title: string;
}

const emptyForm = { title: "", category: "", organizer: "", location: "", date: "", time: "", registrationFee: "", excerpt: "", description: "", image: "", university_id: 0 };

export default function UniversityEventsSection({ setActiveSection }: { setActiveSection: (s: string) => void }) {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [universities, setUniversities] = useState<University[]>([]);
  const [deleteModal, setDeleteModal] = useState<DeleteModal>({ isOpen: false, id: null, title: "" });
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const limit = 10;

  const fetchEvents = useCallback(async (p: number, s: string) => {
    setLoading(true);
    try {
      const res = await adminEventApi.list({ page: p, limit, search: s || undefined });
      setEvents(res.events || []);
      setTotal(res.meta?.total || 0);
    } catch {
      setEvents([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUniversities = useCallback(async () => {
    try {
      const token = localStorage.getItem("superadmin_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || ""}/api/v1/admin/universities?limit=500`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json();
      const list = json?.data?.universities || [];
      setUniversities(list.map((u: any) => ({ id: u.id, name: u.name })));
    } catch {}
  }, []);

  useEffect(() => { fetchEvents(page, search); fetchUniversities(); }, [page]);

  const handleSearch = () => { setPage(1); fetchEvents(1, search); };

  const openCreate = () => { setEditId(null); setForm(emptyForm); setFormOpen(true); };

  const openEdit = async (id: number) => {
    setEditId(id);
    try {
      const item = await adminEventApi.getById(id);
      setForm({
        title: item.title || "",
        category: item.category || "",
        organizer: item.organizer || "",
        location: item.location || "",
        date: item.date || "",
        time: item.time || "",
        registrationFee: item.registrationFee || "",
        excerpt: item.excerpt || "",
        description: item.description || "",
        image: item.image || "",
        university_id: (item as any).university_id || 0,
      });
      setFormOpen(true);
    } catch {
      toast.error("Failed to load event");
    }
  };

  const handleDelete = (id: number) => {
    const target = events.find((e) => e.id === id);
    setDeleteModal({ isOpen: true, id, title: target?.title || "this event" });
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    const id = deleteModal.id;
    setDeleteModal({ isOpen: false, id: null, title: "" });
    try {
      await adminEventApi.delete(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      toast.success("Event deleted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    if (!form.university_id) { toast.error("Please select a university"); return; }
    setSaving(true);
    try {
      const payload = { ...form, university_id: form.university_id };
      if (editId) {
        await adminEventApi.update(editId, payload);
        toast.success("Event updated.");
      } else {
        await adminEventApi.create(payload);
        toast.success("Event created.");
      }
      setFormOpen(false);
      fetchEvents(page, search);
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
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

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 overflow-y-auto py-10">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">{editId ? "Edit Event" : "Add Event"}</h3>
              <button onClick={() => setFormOpen(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">University *</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" value={form.university_id} onChange={(e) => setForm({ ...form, university_id: Number(e.target.value) })}>
                  <option value={0}>Select University</option>
                  {universities.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    <option value="">Select</option>
                    {["workshop","seminar","conference","webinar","training","program","ceremony","meeting","competition","other"].map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organizer</label>
                  <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" value={form.organizer} onChange={(e) => setForm({ ...form, organizer: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input type="time" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Fee</label>
                  <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" value={form.registrationFee} onChange={(e) => setForm({ ...form, registrationFee: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setFormOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">{saving ? "Saving..." : editId ? "Update" : "Create"}</button>
              </div>
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><CalendarDays className="w-5 h-5 text-blue-600" /> Events Directory</h2>
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
            </div>
            <button onClick={openCreate} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"><Plus size={16} /> Add Event</button>
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
              {events.length === 0 ? <tr><td colSpan={6} className="py-8 text-center text-gray-500">No events found</td></tr> : events.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4"><p className="font-medium text-gray-900">{item.title}</p></td>
                  <td className="text-center py-3 px-4 text-gray-500">{(item as any).university_id || "-"}</td>
                  <td className="text-center py-3 px-4"><span className="px-2 py-1 rounded text-xs font-semibold bg-purple-100 text-purple-700">{item.category}</span></td>
                  <td className="text-center py-3 px-4 text-gray-500">{item.date || "-"}</td>
                  <td className="text-center py-3 px-4 text-gray-600">{item.location || "-"}</td>
                  <td className="text-center py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 hover:bg-green-50 rounded text-green-600" onClick={() => openEdit(item.id)}><Pencil className="w-4 h-4" /></button>
                      <button className="p-1.5 hover:bg-red-50 rounded text-red-600" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
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
