"use client";

import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash } from "lucide-react";
import PopupModal from "./PopupModal";

interface PopupAd {
  id: number;
  title: string;
  image_url: string;
  link_url: string;
  page: string;
  position: string;
  active: boolean;
  clicks: number;
  impressions: number;
  created_at: string;
}

export default function PopupManagementTab() {
  const [popups, setPopups] = useState<PopupAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPopup, setEditingPopup] = useState<PopupAd | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const resolveImageUrl = (url: string) =>
    url.startsWith("/uploads") ? `${API_BASE}${url}` : url;
  const token = typeof window !== "undefined" ? localStorage.getItem("superadmin_token") : null;
  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchPopups = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/ads?page=landing&position=popup`, { headers });
      const json = await res.json();
      if (json.success) {
        setPopups(json.data?.ads || []);
      } else {
        setError(json.error || "Failed to fetch popups");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPopups(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this popup?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/ads/${id}`, {
        method: "DELETE",
        headers,
      });
      const json = await res.json();
      if (json.success) {
        setPopups((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {}
  };

  const handleToggleActive = async (popup: PopupAd) => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/ads/${popup.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({
          title: popup.title,
          image_url: popup.image_url,
          link_url: popup.link_url,
          page: popup.page,
          position: popup.position,
          active: !popup.active,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setPopups((prev) =>
          prev.map((p) => (p.id === popup.id ? { ...p, active: !p.active } : p))
        );
      }
    } catch {}
  };

  const handleEdit = (popup: PopupAd) => {
    setEditingPopup(popup);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingPopup(null);
    setIsModalOpen(true);
  };

  const handleModalClose = (saved?: boolean) => {
    setIsModalOpen(false);
    setEditingPopup(null);
    if (saved) fetchPopups();
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading popups...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Landing Page Popups</h2>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors"
        >
          <Plus size={18} /> Create Popup
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
              <th className="px-4 py-3">Banner</th>
              <th className="px-4 py-3">Linked Scholarship</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Clicks</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {popups.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No popups created yet.
                </td>
              </tr>
            )}
            {popups.map((popup) => (
              <tr key={popup.id} className="hover:bg-gray-50 border-b border-gray-200">
                <td className="px-4 py-3">
                  {popup.image_url ? (
                    <img src={resolveImageUrl(popup.image_url)} alt="" className="w-20 h-14 object-cover rounded border" />
                  ) : (
                    <div className="w-20 h-14 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-400">No image</div>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">{popup.link_url}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleActive(popup)}
                    className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                      popup.active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {popup.active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-4 py-3 text-gray-600">{popup.clicks}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{new Date(popup.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => handleEdit(popup)} className="p-1.5 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50" title="Edit">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(popup.id)} className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50" title="Delete">
                      <Trash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <PopupModal
          popup={editingPopup}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
