"use client";

import React, { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash, GripVertical } from "lucide-react";
import HeroBannerModal from "./HeroBannerModal";

interface CarouselSlide {
  id: number;
  title: string;
  image_url: string;
  link_url: string;
  order: number;
  active: boolean;
  created_at: string;
}

export default function HeroBannerTab() {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null);
  const [dragId, setDragId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  const prevSlidesRef = useRef<CarouselSlide[] | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const resolveImageUrl = (url: string) =>
    url.startsWith("/uploads") ? `${API_BASE}${url}` : url;
  const token = typeof window !== "undefined" ? localStorage.getItem("superadmin_token") : null;
  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchSlides = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/carousels`, { headers });
      const json = await res.json();
      if (json.success) {
        const data: CarouselSlide[] = json.data || [];
        // Sort by priority (order ascending, 1 = first) client-side so display
        // matches priority even if the API returns slides in another order.
        const sorted = [...data].sort(
          (a, b) => (a.order || 0) - (b.order || 0) || a.id - b.id
        );
        setSlides(sorted);
      } else {
        setError(json.error || "Failed to fetch hero banners");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSlides(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this hero banner?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/carousels/${id}`, {
        method: "DELETE",
        headers,
      });
      const json = await res.json();
      if (json.success) {
        setSlides((prev) => prev.filter((s) => s.id !== id));
      }
    } catch {}
  };

  const handleToggleActive = async (slide: CarouselSlide) => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/carousels/${slide.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({
          title: slide.title,
          image_url: slide.image_url,
          link_url: slide.link_url,
          page: "landing",
          active: !slide.active,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSlides((prev) =>
          prev.map((s) => (s.id === slide.id ? { ...s, active: !s.active } : s))
        );
      }
    } catch {}
  };

  const handleEdit = (slide: CarouselSlide) => {
    setEditingSlide(slide);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingSlide(null);
    setIsModalOpen(true);
  };

  const handleModalClose = (saved?: boolean) => {
    setIsModalOpen(false);
    setEditingSlide(null);
    if (saved) fetchSlides();
  };

  // --- Drag & drop reordering (native HTML5) ---

  const handleDragStart = (e: React.DragEvent, slide: CarouselSlide) => {
    setDragId(slide.id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(slide.id));
  };

  const handleDragOver = (e: React.DragEvent, slide: CarouselSlide) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverId !== slide.id) setDragOverId(slide.id);
  };

  const handleDragEnd = () => {
    setDragId(null);
    setDragOverId(null);
  };

  const handleDrop = async (e: React.DragEvent, target: CarouselSlide) => {
    e.preventDefault();
    setDragOverId(null);
    if (dragId === null || dragId === target.id) {
      setDragId(null);
      return;
    }
    const sourceId = dragId;
    setDragId(null);

    // Move source to target's position; others shift to fill the gap.
    const from = slides.findIndex((s) => s.id === sourceId);
    const to = slides.findIndex((s) => s.id === target.id);
    if (from === -1 || to === -1) return;

    const reordered = [...slides];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);

    // Renumber: first row is priority 1.
    const withOrder = reordered.map((s, i) => ({ ...s, order: i + 1 }));
    prevSlidesRef.current = slides;
    setSlides(withOrder);

    // Persist via the reorder endpoint: { slides: [{ id, order }] }.
    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/carousels/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({
          slides: withOrder.map((s, i) => ({ id: s.id, order: i + 1 })),
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Reorder failed");
    } catch {
      // Roll back on failure (or reload from server to confirm true state).
      setSlides(prevSlidesRef.current ?? slides);
      prevSlidesRef.current = null;
      alert("Failed to reorder hero banners");
      fetchSlides();
    } finally {
      prevSlidesRef.current = null;
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading hero banners...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Hero Banners</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Drag rows to change display order — the first row appears first.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors"
        >
          <Plus size={18} /> Create Hero Banner
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Link URL</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {slides.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No hero banners created yet.
                </td>
              </tr>
            )}
            {slides.map((slide, idx) => (
              <tr
                key={slide.id}
                draggable
                onDragStart={(e) => handleDragStart(e, slide)}
                onDragOver={(e) => handleDragOver(e, slide)}
                onDragEnd={handleDragEnd}
                onDrop={(e) => handleDrop(e, slide)}
                className={`hover:bg-gray-50 border-b border-gray-200 ${
                  dragId === slide.id ? "opacity-50" : ""
                } ${dragOverId === slide.id && dragId !== slide.id ? "bg-blue-50" : ""}`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <GripVertical
                      className={`w-4 h-4 cursor-grab shrink-0 ${
                        dragId === slide.id ? "text-blue-400" : "text-gray-300"
                      }`}
                      aria-label="Drag to reorder"
                    />
                    <span className="text-xs font-bold text-gray-500">
                      {idx + 1}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {slide.image_url ? (
                    <img src={resolveImageUrl(slide.image_url)} alt="" className="w-20 h-14 object-cover rounded border" />
                  ) : (
                    <div className="w-20 h-14 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-400">No image</div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{slide.title || "-"}</td>
                <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">{slide.link_url || "-"}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleActive(slide)}
                    className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                      slide.active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {slide.active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{new Date(slide.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => handleEdit(slide)} className="p-1.5 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50" title="Edit">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(slide.id)} className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50" title="Delete">
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
        <HeroBannerModal
          slide={editingSlide}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
