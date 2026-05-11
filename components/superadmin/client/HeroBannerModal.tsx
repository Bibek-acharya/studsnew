"use client";

import React, { useState } from "react";
import { X, Upload } from "lucide-react";

interface CarouselSlide {
  id?: number;
  title: string;
  image_url: string;
  link_url: string;
  active: boolean;
}

interface HeroBannerModalProps {
  slide: CarouselSlide | null;
  onClose: (saved?: boolean) => void;
}

export default function HeroBannerModal({ slide, onClose }: HeroBannerModalProps) {
  const isEditing = !!slide;
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const token = typeof window !== "undefined" ? localStorage.getItem("superadmin_token") : null;
  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  const [imageFile, setImageFile] = useState<File | null>(null);
  const resolveUrl = (url: string) =>
    url.startsWith("/uploads") ? `${API_BASE}${url}` : url;

  const [imagePreview, setImagePreview] = useState(slide?.image_url ? resolveUrl(slide.image_url) : "");
  const [imageUrl, setImageUrl] = useState(slide?.image_url || "");
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState(slide?.title || "");
  const [linkUrl, setLinkUrl] = useState(slide?.link_url || "");
  const [active, setActive] = useState(slide?.active ?? true);
  const [saving, setSaving] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (): Promise<string> => {
    if (imageFile) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", imageFile);
        const res = await fetch(`${API_BASE}/api/v1/scholarships/upload?folder=banners`, {
          method: "POST",
          body: formData,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const json = await res.json();
        if (json.success) {
          const url = json.data?.url || "";
          setImageUrl(url);
          return url;
        }
      } catch {}
      setUploading(false);
    }
    return imageUrl;
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    setSaving(true);
    try {
      const finalImageUrl = await uploadImage();
      if (!finalImageUrl) {
        alert("Please upload a banner image");
        setSaving(false);
        return;
      }

      const payload = {
        title: title.trim(),
        image_url: finalImageUrl,
        link_url: linkUrl.trim(),
        page: "landing",
        active,
      };

      const url = isEditing
        ? `${API_BASE}/api/v1/admin/carousels/${slide!.id}`
        : `${API_BASE}/api/v1/admin/carousels`;

      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        onClose(true);
      } else {
        alert(json.error || "Failed to save hero banner");
      }
    } catch {
      alert("Network error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">
            {isEditing ? "Edit Hero Banner" : "Create Hero Banner"}
          </h3>
          <button onClick={() => onClose()} className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter banner title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Banner Image</label>
            <label className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 cursor-pointer block">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="max-h-40 mx-auto rounded object-contain" />
              ) : (
                <div className="py-6">
                  <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-sm text-gray-500">Click to upload banner</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Link URL</label>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              URL users will go to when clicking the banner.
            </p>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Active</span>
          </label>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
          <button
            onClick={() => onClose()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? "Saving..." : isEditing ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
