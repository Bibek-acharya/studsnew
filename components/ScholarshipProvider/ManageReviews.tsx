"use client";

import React, { useState, useEffect, memo } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { getReviews, createReview, updateReview, deleteReview } from "@/services/scholarshipProviderApi";
import ConfirmationModal from "./common/ConfirmationModal";

const ManageReviews: React.FC = memo(() => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: number | null }>({ isOpen: false, id: null });
  const [form, setForm] = useState({ author_name: "", avatar_url: "", rating: 5, title: "", content: "", pros: "", cons: "", status: "published" });

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setLoading(true);
    try { const data = await getReviews(); setItems(data || []); }
    catch { setItems([]); }
    finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    try {
      if (editing) { await updateReview(editing.id, form); toast.success("Review updated"); }
      else { await createReview(form); toast.success("Review created"); }
      setShowForm(false); setEditing(null);
      setForm({ author_name: "", avatar_url: "", rating: 5, title: "", content: "", pros: "", cons: "", status: "published" });
      fetchItems();
    } catch { toast.error("Failed to save"); }
  };

  const handleEdit = (item: any) => {
    setEditing(item);
    setForm({ author_name: item.author_name, avatar_url: item.avatar_url, rating: item.rating, title: item.title, content: item.content, pros: item.pros, cons: item.cons, status: item.status });
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    try { await deleteReview(deleteModal.id); toast.success("Review deleted"); fetchItems(); }
    catch { toast.error("Failed to delete"); }
    setDeleteModal({ isOpen: false, id: null });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Manage Reviews</h1>
        <button onClick={() => { setEditing(null); setForm({ author_name: "", avatar_url: "", rating: 5, title: "", content: "", pros: "", cons: "", status: "published" }); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Add Review
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg p-6 border border-slate-100 space-y-4">
          <div className="flex gap-4">
            <input placeholder="Author name" value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            <input placeholder="Avatar URL (optional)" value={form.avatar_url} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Rating:</span>
            {[1, 2, 3, 4, 5].map((r) => (
              <button key={r} onClick={() => setForm({ ...form, rating: r })}>
                <Star className={`w-5 h-5 ${r <= form.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
              </button>
            ))}
          </div>
          <input placeholder="Review title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          <textarea placeholder="Review content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" rows={3} />
          <div className="flex gap-4">
            <textarea placeholder="Pros" value={form.pros} onChange={(e) => setForm({ ...form, pros: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" rows={2} />
            <textarea placeholder="Cons" value={form.cons} onChange={(e) => setForm({ ...form, cons: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" rows={2} />
          </div>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
            <option value="published">Published</option>
            <option value="pending">Pending</option>
          </select>
          <div className="flex gap-2">
            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold">{editing ? "Update" : "Create"}</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg p-6 border border-slate-100">
        {loading ? <p className="text-center text-gray-500">Loading...</p> : items.length === 0 ? (
          <p className="text-center text-gray-400">No reviews added yet.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item: any) => (
              <div key={item.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                      {item.avatar_url ? <img src={item.avatar_url} alt="" className="w-full h-full rounded-full object-cover" /> : item.author_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.author_name}</p>
                      <div className="flex text-yellow-400">
                        {Array(5).fill(0).map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < item.rating ? "fill-yellow-400" : "text-gray-300"}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(item)} className="p-1.5 hover:bg-green-50 rounded text-green-600"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteModal({ isOpen: true, id: item.id })} className="p-1.5 hover:bg-red-50 rounded text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                {item.title && <p className="font-semibold text-gray-800 mt-2">{item.title}</p>}
                <p className="text-sm text-gray-600 mt-1">{item.content}</p>
                <span className={`inline-block mt-2 px-2 py-0.5 text-xs rounded-full ${item.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <ConfirmationModal isOpen={deleteModal.isOpen} title="Delete Review" message="Are you sure?" confirmText="Delete" cancelText="Cancel" onConfirm={handleDelete} onCancel={() => setDeleteModal({ isOpen: false, id: null })} destructive />
    </div>
  );
});
ManageReviews.displayName = "ManageReviews";
export default ManageReviews;
