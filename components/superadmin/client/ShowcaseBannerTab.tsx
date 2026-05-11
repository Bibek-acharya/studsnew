"use client";

import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash } from "lucide-react";
import ShowcaseBannerModal from "./ShowcaseBannerModal";

interface ShowcaseAd {
  id: number;
  title: string;
  image_url: string;
  link_url: string;
  active: boolean;
  created_at: string;
}

export default function ShowcaseBannerTab() {
  const [ads, setAds] = useState<ShowcaseAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<ShowcaseAd | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const resolveImageUrl = (url: string) =>
    url.startsWith("/uploads") ? `${API_BASE}${url}` : url;
  const token = typeof window !== "undefined" ? localStorage.getItem("superadmin_token") : null;
  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchAds = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/ads?page=landing&position=showcase`, { headers });
      const json = await res.json();
      if (json.success) {
        setAds(json.data?.ads || []);
      } else {
        setError(json.error || "Failed to fetch showcase banners");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAds(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this showcase banner?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/ads/${id}`, {
        method: "DELETE",
        headers,
      });
      const json = await res.json();
      if (json.success) {
        setAds((prev) => prev.filter((a) => a.id !== id));
      }
    } catch {}
  };

  const handleToggleActive = async (ad: ShowcaseAd) => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/ads/${ad.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({
          title: ad.title,
          image_url: ad.image_url,
          link_url: ad.link_url,
          page: "landing",
          position: "showcase",
          active: !ad.active,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setAds((prev) =>
          prev.map((a) => (a.id === ad.id ? { ...a, active: !a.active } : a))
        );
      }
    } catch {}
  };

  const handleEdit = (ad: ShowcaseAd) => {
    setEditingAd(ad);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingAd(null);
    setIsModalOpen(true);
  };

  const handleModalClose = (saved?: boolean) => {
    setIsModalOpen(false);
    setEditingAd(null);
    if (saved) fetchAds();
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading showcase banners...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Showcase Banners</h2>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors"
        >
          <Plus size={18} /> Create Showcase Banner
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Link URL</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ads.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No showcase banners created yet.
                </td>
              </tr>
            )}
            {ads.map((ad) => (
              <tr key={ad.id} className="hover:bg-gray-50 border-b border-gray-200">
                <td className="px-4 py-3">
                  {ad.image_url ? (
                    <img src={resolveImageUrl(ad.image_url)} alt="" className="w-20 h-14 object-cover rounded border" />
                  ) : (
                    <div className="w-20 h-14 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-400">No image</div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{ad.title || "-"}</td>
                <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">{ad.link_url || "-"}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleActive(ad)}
                    className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                      ad.active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {ad.active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{new Date(ad.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => handleEdit(ad)} className="p-1.5 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50" title="Edit">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(ad.id)} className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50" title="Delete">
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
        <ShowcaseBannerModal
          ad={editingAd}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
