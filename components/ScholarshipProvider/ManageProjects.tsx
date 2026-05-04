"use client";

import React, { useState, useEffect, memo } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { getProjects, createProject, updateProject, deleteProject } from "@/services/scholarshipProviderApi";
import ConfirmationModal from "./common/ConfirmationModal";
import FileUpload from "./common/FileUpload";

const ManageProjects: React.FC = memo(() => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: number | null }>({ isOpen: false, id: null });
  const [form, setForm] = useState({ title: "", description: "", image_url: "", category: "", date: "", sort_order: 0 });

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setLoading(true);
    try { const data = await getProjects(); setItems(data || []); }
    catch { setItems([]); }
    finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    try {
      if (editing) { await updateProject(editing.id, form); toast.success("Project updated"); }
      else { await createProject(form); toast.success("Project created"); }
      setShowForm(false); setEditing(null);
      setForm({ title: "", description: "", image_url: "", category: "", date: "", sort_order: 0 });
      fetchItems();
    } catch { toast.error("Failed to save"); }
  };

  const handleEdit = (item: any) => {
    setEditing(item);
    setForm({ title: item.title, description: item.description, image_url: item.image_url, category: item.category, date: item.date || "", sort_order: item.sort_order });
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    try { await deleteProject(deleteModal.id); toast.success("Project deleted"); fetchItems(); }
    catch { toast.error("Failed to delete"); }
    setDeleteModal({ isOpen: false, id: null });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Manage Projects</h1>
        <button onClick={() => { setEditing(null); setForm({ title: "", description: "", image_url: "", category: "", date: "", sort_order: 0 }); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg p-6 border border-slate-100 space-y-4">
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" rows={3} />
          <input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          <div className="flex gap-4">
            <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <input type="number" placeholder="Sort order" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          <div className="flex gap-2">
            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold">{editing ? "Update" : "Create"}</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? <p className="text-center text-gray-500 col-span-2">Loading...</p> : items.length === 0 ? (
          <p className="text-center text-gray-400 col-span-2">No projects added yet.</p>
        ) : items.map((item: any) => (
          <div key={item.id} className="bg-white rounded-lg border border-gray-100 overflow-hidden">
            {item.image_url && <img src={item.image_url} alt={item.title} className="w-full h-40 object-cover" />}
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                  {item.category && <span className="inline-block mt-2 px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">{item.category}</span>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleEdit(item)} className="p-1.5 hover:bg-green-50 rounded text-green-600"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => setDeleteModal({ isOpen: true, id: item.id })} className="p-1.5 hover:bg-red-50 rounded text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ConfirmationModal isOpen={deleteModal.isOpen} title="Delete Project" message="Are you sure?" confirmText="Delete" cancelText="Cancel" onConfirm={handleDelete} onCancel={() => setDeleteModal({ isOpen: false, id: null })} destructive />
    </div>
  );
});
ManageProjects.displayName = "ManageProjects";
export default ManageProjects;
