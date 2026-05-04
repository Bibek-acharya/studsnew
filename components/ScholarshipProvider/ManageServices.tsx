"use client";

import React, { useState, useEffect, memo } from "react";
import { toast } from "sonner";
import { Home, Plus, Pencil, Trash2 } from "lucide-react";
import { getServices, createService, updateService, deleteService } from "@/services/scholarshipProviderApi";
import ConfirmationModal from "./common/ConfirmationModal";

const ManageServices: React.FC = memo(() => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: number | null }>({ isOpen: false, id: null });
  const [form, setForm] = useState({ icon: "", title: "", description: "", sort_order: 0 });

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await getServices();
      setItems(data || []);
    } catch { setItems([]); }
    finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await updateService(editing.id, form);
        toast.success("Service updated");
      } else {
        await createService(form);
        toast.success("Service created");
      }
      setShowForm(false);
      setEditing(null);
      setForm({ icon: "", title: "", description: "", sort_order: 0 });
      fetchItems();
    } catch { toast.error("Failed to save"); }
  };

  const handleEdit = (item: any) => {
    setEditing(item);
    setForm({ icon: item.icon, title: item.title, description: item.description, sort_order: item.sort_order });
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    try {
      await deleteService(deleteModal.id);
      toast.success("Service deleted");
      fetchItems();
    } catch { toast.error("Failed to delete"); }
    setDeleteModal({ isOpen: false, id: null });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Manage Services</h1>
        <button onClick={() => { setEditing(null); setForm({ icon: "", title: "", description: "", sort_order: 0 }); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg p-6 border border-slate-100 space-y-4">
          <input placeholder="Icon name (e.g. coffee, book-open)" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" rows={3} />
          <input type="number" placeholder="Sort order" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          <div className="flex gap-2">
            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold">{editing ? "Update" : "Create"}</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg p-6 border border-slate-100">
        {loading ? <p className="text-center text-gray-500">Loading...</p> : items.length === 0 ? (
          <p className="text-center text-gray-400">No services added yet.</p>
        ) : (
          <div className="space-y-3">
            {items.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item)} className="p-2 hover:bg-green-50 rounded text-green-600"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => setDeleteModal({ isOpen: true, id: item.id })} className="p-2 hover:bg-red-50 rounded text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ConfirmationModal isOpen={deleteModal.isOpen} title="Delete Service" message="Are you sure?" confirmText="Delete" cancelText="Cancel" onConfirm={handleDelete} onCancel={() => setDeleteModal({ isOpen: false, id: null })} destructive />
    </div>
  );
});
ManageServices.displayName = "ManageServices";
export default ManageServices;
