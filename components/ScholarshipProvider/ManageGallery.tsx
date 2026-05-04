"use client";

import React, { useState, useEffect, memo } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { getGalleryImages, createGalleryImage, updateGalleryImage, deleteGalleryImage } from "@/services/scholarshipProviderApi";
import ConfirmationModal from "./common/ConfirmationModal";

const ManageGallery: React.FC = memo(() => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: number | null }>({ isOpen: false, id: null });
  const [form, setForm] = useState({ image_url: "", caption: "", sort_order: 0 });

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setLoading(true);
    try { const data = await getGalleryImages(); setItems(data || []); }
    catch { setItems([]); }
    finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    try {
      if (editing) { await updateGalleryImage(editing.id, form); toast.success("Image updated"); }
      else { await createGalleryImage(form); toast.success("Image added"); }
      setShowForm(false); setEditing(null);
      setForm({ image_url: "", caption: "", sort_order: 0 });
      fetchItems();
    } catch { toast.error("Failed to save"); }
  };

  const handleEdit = (item: any) => {
    setEditing(item);
    setForm({ image_url: item.image_url, caption: item.caption, sort_order: item.sort_order });
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    try { await deleteGalleryImage(deleteModal.id); toast.success("Image deleted"); fetchItems(); }
    catch { toast.error("Failed to delete"); }
    setDeleteModal({ isOpen: false, id: null });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Manage Gallery</h1>
        <button onClick={() => { setEditing(null); setForm({ image_url: "", caption: "", sort_order: 0 }); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Add Image
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg p-6 border border-slate-100 space-y-4">
          <input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          {form.image_url && <img src={form.image_url} alt="Preview" className="w-full h-40 object-cover rounded-lg" />}
          <input placeholder="Caption" value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          <input type="number" placeholder="Sort order" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          <div className="flex gap-2">
            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold">{editing ? "Update" : "Add"}</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {loading ? <p className="text-center text-gray-500 col-span-3">Loading...</p> : items.length === 0 ? (
          <p className="text-center text-gray-400 col-span-3">No gallery images added yet.</p>
        ) : items.map((item: any) => (
          <div key={item.id} className="bg-white rounded-lg border border-gray-100 overflow-hidden group relative">
            <img src={item.image_url} alt={item.caption} className="w-full h-32 object-cover" />
            <div className="p-2">
              <p className="text-xs text-gray-600 truncate">{item.caption || "No caption"}</p>
            </div>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(item)} className="p-1.5 bg-white rounded shadow text-green-600"><Pencil className="w-3.5 h-3.5" /></button>
              <button onClick={() => setDeleteModal({ isOpen: true, id: item.id })} className="p-1.5 bg-white rounded shadow text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
      <ConfirmationModal isOpen={deleteModal.isOpen} title="Delete Image" message="Are you sure?" confirmText="Delete" cancelText="Cancel" onConfirm={handleDelete} onCancel={() => setDeleteModal({ isOpen: false, id: null })} destructive />
    </div>
  );
});
ManageGallery.displayName = "ManageGallery";
export default ManageGallery;
