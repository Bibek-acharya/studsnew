"use client";

import React, { useEffect, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { getImageUrl } from "@/services/api";
import type { CarouselSlide } from "@/services/api";

interface HeroBannerModalProps {
  slide: CarouselSlide | null;
  onClose: (saved?: boolean) => void;
  page?: "landing" | "study-resources";
  itemLabel?: string;
  /**
   * Image-only slides — the study-resources carousel. The form drops every text
   * field and asks for nothing but a picture; the copy columns are still sent
   * as empty strings so the API contract stays exactly the same.
   */
  imageOnly?: boolean;
}

function getAuthHeaders(): Record<string, string> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("superadmin_token")
      : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function HeroBannerModal({
  slide,
  onClose,
  page = "landing",
  itemLabel = "Hero Banner",
  imageOnly = false,
}: HeroBannerModalProps) {
  const isEditing = Boolean(slide);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const modalTitleId = "carousel-slide-modal-title";

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(
    slide?.image_url ? getImageUrl(slide.image_url) : "",
  );
  const [imageUrl, setImageUrl] = useState(slide?.image_url ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [title, setTitle] = useState(slide?.title ?? "");
  const [subtitle, setSubtitle] = useState(slide?.subtitle ?? "");
  const [description, setDescription] = useState(slide?.description ?? "");
  const [linkUrl, setLinkUrl] = useState(slide?.link_url ?? "");
  const [buttonText, setButtonText] = useState(slide?.button_text ?? "");
  const [active, setActive] = useState(slide?.active ?? true);
  const [saving, setSaving] = useState(false);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;
    setImageFile(file);
    setImagePreview(objectUrl);
    setUploadError(null);
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return imageUrl;

    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      const res = await fetch(
        `${API_BASE}/api/v1/scholarships/upload?folder=banners`,
        {
          method: "POST",
          body: formData,
          headers: getAuthHeaders(),
        },
      );
      const json = await res.json();
      const uploadedUrl = json?.data?.url;
      if (!res.ok || !json.success || !uploadedUrl) {
        throw new Error(json?.error || "Image upload failed");
      }
      setImageUrl(uploadedUrl);
      return uploadedUrl;
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Image upload failed";
      setUploadError(message);
      throw new Error(message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Image-only slides have no title field at all, so only the landing hero
    // can fail this check.
    if (!imageOnly && !title.trim()) {
      alert("Please enter a title");
      return;
    }

    setSaving(true);
    try {
      const finalImageUrl = await uploadImage();
      if (!finalImageUrl) {
        alert(`Please upload a ${imageOnly ? "slide" : "banner"} image`);
        setSaving(false);
        return;
      }

      // The text columns stay in the payload either way: the backend keeps
      // accepting them, and image-only slides simply store empty strings.
      const payload = {
        page,
        title: imageOnly ? "" : title.trim(),
        subtitle: imageOnly ? "" : subtitle.trim(),
        description: imageOnly ? "" : description.trim(),
        image_url: finalImageUrl,
        link_url: imageOnly ? "" : linkUrl.trim(),
        button_text: imageOnly ? "" : buttonText.trim(),
        active,
      };
      const url = isEditing
        ? `${API_BASE}/api/v1/admin/carousels/${slide?.id}`
        : `${API_BASE}/api/v1/admin/carousels`;
      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error || `Failed to save ${itemLabel.toLowerCase()}`);
      }
      onClose(true);
    } catch (requestError) {
      alert(
        requestError instanceof Error
          ? requestError.message
          : "Network error",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={modalTitleId}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h3 id={modalTitleId} className="text-lg font-bold text-gray-900">
              {isEditing ? "Edit" : "Create"} {itemLabel}
            </h3>
            <p className="mt-0.5 font-mono text-[10px] font-bold text-gray-400">
              page={page}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onClose()}
            disabled={saving}
            aria-label="Close modal"
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="space-y-5 p-6">
            {imageOnly ? (
              <p className="text-sm leading-relaxed text-gray-500">
                This carousel shows the picture on its own — there is no title,
                description or button to fill in.
              </p>
            ) : (
              <>
                <div>
                  <label
                    htmlFor="carousel-slide-title"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Title
                  </label>
                  <input
                    id="carousel-slide-title"
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    required
                    placeholder="Enter slide title"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="carousel-slide-subtitle"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Subtitle
                  </label>
                  <input
                    id="carousel-slide-subtitle"
                    type="text"
                    value={subtitle}
                    onChange={(event) => setSubtitle(event.target.value)}
                    placeholder="One short supporting line"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="carousel-slide-description"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="carousel-slide-description"
                    rows={3}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Explain what students get from this slide"
                    className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600"
                  />
                </div>
              </>
            )}

            <div>
              <span className="mb-2 block text-sm font-semibold text-gray-700">
                {imageOnly ? "Slide image" : "Banner image"}
              </span>
              <label className="block cursor-pointer rounded-xl border-2 border-dashed border-gray-300 p-4 text-center hover:bg-gray-50">
                {imagePreview ? (
                  // A blob preview cannot go through the Next.js image loader.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imagePreview}
                    alt={`${imageOnly ? "Slide" : "Banner"} preview`}
                    className="mx-auto max-h-40 rounded object-contain"
                  />
                ) : (
                  <div className="py-6">
                    <Upload className="mx-auto mb-2 text-gray-400" size={32} aria-hidden="true" />
                    <p className="text-sm text-gray-500">
                      Click to upload {imageOnly ? "slide image" : "banner"}
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  disabled={saving}
                  className="hidden"
                />
              </label>
              <p className="mt-1 text-xs text-gray-400">
                Recommended size: 1400 x 540 px
              </p>
              {uploadError && (
                <p className="mt-1 text-xs font-medium text-red-600">
                  {uploadError}
                </p>
              )}
            </div>

            {!imageOnly && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="carousel-slide-link"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Link URL
                    </label>
                    <input
                      id="carousel-slide-link"
                      type="url"
                      value={linkUrl}
                      onChange={(event) => setLinkUrl(event.target.value)}
                      placeholder="https://example.com"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="carousel-slide-cta"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Button text
                    </label>
                    <input
                      id="carousel-slide-cta"
                      type="text"
                      value={buttonText}
                      onChange={(event) => setButtonText(event.target.value)}
                      placeholder="Explore now"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
                <p className="-mt-3 text-xs text-gray-400">
                  The CTA only appears when a link URL is set.
                </p>
              </>
            )}

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={active}
                onChange={(event) => setActive(event.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 rounded-b-xl border-t border-gray-200 bg-gray-50 px-6 py-4">
            <button
              type="button"
              onClick={() => onClose()}
              disabled={saving}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {uploading
                ? "Uploading..."
                : saving
                  ? "Saving..."
                  : isEditing
                    ? "Update"
                    : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
