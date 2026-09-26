"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Pencil,
  Plus,
  Trash,
} from "lucide-react";
import { getImageUrl } from "@/services/api";
import type { CarouselSlide } from "@/services/api";
import HeroBannerModal from "./HeroBannerModal";

export type CarouselPage = "landing" | "study-resources";

export interface HeroBannerTabProps {
  page?: CarouselPage;
  heading?: string;
  itemLabel?: string;
  description?: string;
  /**
   * Image-only slides — the study-resources carousel. The list drops its
   * Content and Link & CTA columns and names rows by position instead of by
   * title, because a slide there carries nothing but an image.
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

function readSlides(payload: unknown): CarouselSlide[] {
  const data = (payload as { data?: unknown } | null)?.data;
  if (Array.isArray(data)) return data as CarouselSlide[];
  if (data && Array.isArray((data as { carousels?: unknown }).carousels)) {
    return (data as { carousels: CarouselSlide[] }).carousels;
  }
  return [];
}

export default function HeroBannerTab({
  page = "landing",
  heading = "Hero Banners",
  itemLabel = "Hero Banner",
  description = "Drag rows or use the arrow controls — the first row appears first.",
  imageOnly = false,
}: HeroBannerTabProps) {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null);
  const [dragId, setDragId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  const [reordering, setReordering] = useState(false);
  const prevSlidesRef = useRef<CarouselSlide[] | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const requestSlides = useCallback(async (): Promise<CarouselSlide[]> => {
    const res = await fetch(
      `${API_BASE}/api/v1/admin/carousels?page=${encodeURIComponent(page)}`,
      { headers: getAuthHeaders() },
    );
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json?.error || "Failed to load carousel slides");
    }

    return readSlides(json)
      .filter((slide) => (slide.page ?? "landing") === page)
      .sort(
        (first, second) =>
          (first.order || 0) - (second.order || 0) || first.id - second.id,
      );
  }, [API_BASE, page]);

  const fetchSlides = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setSlides(await requestSlides());
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Network error",
      );
    } finally {
      setLoading(false);
    }
  }, [requestSlides]);

  useEffect(() => {
    let cancelled = false;
    void requestSlides()
      .then((data) => {
        if (cancelled) return;
        setSlides(data);
        setLoading(false);
      })
      .catch((requestError: unknown) => {
        if (cancelled) return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Network error",
        );
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [requestSlides]);

  const handleDelete = async (id: number) => {
    if (!confirm(`Delete this ${itemLabel.toLowerCase()}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/carousels/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error || "Delete failed");
      }
      setSlides((previous) => previous.filter((slide) => slide.id !== id));
    } catch (requestError) {
      alert(
        requestError instanceof Error
          ? requestError.message
          : "Failed to delete slide",
      );
    }
  };

  const handleToggleActive = async (slide: CarouselSlide) => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/carousels/${slide.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        // Keep every editable field: the update endpoint replaces the record,
        // so sending only the toggle flag would clear the copy. That holds for
        // image-only slides too — whatever text a row still carries is passed
        // straight back rather than dropped here.
        body: JSON.stringify({
          page,
          title: slide.title,
          subtitle: slide.subtitle ?? "",
          description: slide.description ?? "",
          image_url: slide.image_url,
          link_url: slide.link_url ?? "",
          button_text: slide.button_text ?? "",
          order: slide.order,
          active: !slide.active,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error || "Update failed");
      }
      setSlides((previous) =>
        previous.map((item) =>
          item.id === slide.id ? { ...item, active: !item.active } : item,
        ),
      );
    } catch (requestError) {
      alert(
        requestError instanceof Error
          ? requestError.message
          : "Failed to update slide",
      );
    }
  };

  const handleEdit = (slide: CarouselSlide) => {
    setEditingSlide(slide);
    setIsModalOpen(true);
  };

  /**
   * How a row is named in its control labels. Image-only slides have no title
   * to name them by, so they fall back to their position in the list.
   */
  const rowLabel = (slide: CarouselSlide, index: number) =>
    imageOnly ? `slide ${index + 1}` : slide.title || itemLabel;

  const handleCreate = () => {
    setEditingSlide(null);
    setIsModalOpen(true);
  };

  const handleModalClose = (saved?: boolean) => {
    setIsModalOpen(false);
    setEditingSlide(null);
    if (saved) void fetchSlides();
  };

  const handleDragStart = (
    event: React.DragEvent<HTMLTableRowElement>,
    slide: CarouselSlide,
  ) => {
    setDragId(slide.id);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(slide.id));
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLTableRowElement>,
    slide: CarouselSlide,
  ) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    if (dragOverId !== slide.id) setDragOverId(slide.id);
  };

  const handleDragEnd = () => {
    setDragId(null);
    setDragOverId(null);
  };

  const applyReorder = async (from: number, to: number) => {
    if (
      reordering ||
      from === -1 ||
      to === -1 ||
      from === to ||
      to < 0 ||
      to >= slides.length
    ) {
      return;
    }

    const reordered = [...slides];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    const withOrder = reordered.map((slide, index) => ({
      ...slide,
      order: index + 1,
    }));

    prevSlidesRef.current = slides;
    setSlides(withOrder);
    setReordering(true);

    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/carousels/reorder`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          slides: withOrder.map((slide, index) => ({
            id: slide.id,
            order: index + 1,
          })),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error || "Reorder failed");
      }
    } catch (requestError) {
      setSlides(prevSlidesRef.current ?? slides);
      alert(
        requestError instanceof Error
          ? requestError.message
          : `Failed to reorder ${heading.toLowerCase()}`,
      );
      void fetchSlides();
    } finally {
      prevSlidesRef.current = null;
      setReordering(false);
    }
  };

  const handleDrop = (
    event: React.DragEvent<HTMLTableRowElement>,
    target: CarouselSlide,
  ) => {
    event.preventDefault();
    setDragOverId(null);
    if (dragId === null || dragId === target.id) {
      setDragId(null);
      return;
    }
    const sourceId = dragId;
    setDragId(null);

    const from = slides.findIndex((slide) => slide.id === sourceId);
    const to = slides.findIndex((slide) => slide.id === target.id);
    void applyReorder(from, to);
  };

  if (loading) {
    return (
      <div className="py-8 text-center text-gray-500">Loading {heading}...</div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 py-8 text-center">
        <p className="text-red-500">{error}</p>
        <button
          type="button"
          onClick={() => void fetchSlides()}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-lg font-bold text-gray-900">{heading}</h2>
            <span className="rounded-full bg-blue-50 px-2.5 py-1 font-mono text-[10px] font-bold text-blue-700">
              page={page}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500">{description}</p>
        </div>
        <button
          type="button"
          onClick={handleCreate}
          className="flex w-fit items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          <Plus size={18} aria-hidden="true" /> Create {itemLabel}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table
          className={`w-full border-collapse text-left text-sm ${
            imageOnly ? "min-w-[720px]" : "min-w-[1040px]"
          }`}
        >
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 font-medium text-gray-600">
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Image</th>
              {!imageOnly && (
                <>
                  <th className="px-4 py-3">Content</th>
                  <th className="px-4 py-3">Link &amp; CTA</th>
                </>
              )}
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {slides.length === 0 && (
              <tr>
                <td
                  colSpan={imageOnly ? 5 : 7}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  No {itemLabel.toLowerCase()}s created yet.
                </td>
              </tr>
            )}
            {slides.map((slide, index) => (
              <tr
                key={slide.id}
                draggable
                onDragStart={(event) => handleDragStart(event, slide)}
                onDragOver={(event) => handleDragOver(event, slide)}
                onDragEnd={handleDragEnd}
                onDrop={(event) => handleDrop(event, slide)}
                className={`border-b border-gray-200 transition-colors hover:bg-gray-50 ${
                  dragId === slide.id ? "opacity-50" : ""
                } ${
                  dragOverId === slide.id && dragId !== slide.id
                    ? "bg-blue-50"
                    : ""
                }`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <GripVertical
                      className={`h-4 w-4 shrink-0 cursor-grab ${
                        dragId === slide.id ? "text-blue-400" : "text-gray-300"
                      }`}
                      aria-label="Drag to reorder"
                    />
                    <span className="w-4 text-center text-xs font-bold text-gray-500">
                      {index + 1}
                    </span>
                    <div className="ml-1 flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => void applyReorder(index, index - 1)}
                        disabled={index === 0 || reordering}
                        aria-label={`Move ${rowLabel(slide, index)} up`}
                        title="Move up"
                        className="flex h-6 w-6 items-center justify-center rounded text-gray-400 hover:bg-blue-50 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-25"
                      >
                        <ChevronUp size={14} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => void applyReorder(index, index + 1)}
                        disabled={index === slides.length - 1 || reordering}
                        aria-label={`Move ${rowLabel(slide, index)} down`}
                        title="Move down"
                        className="flex h-6 w-6 items-center justify-center rounded text-gray-400 hover:bg-blue-50 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-25"
                      >
                        <ChevronDown size={14} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {slide.image_url ? (
                    <Image
                      src={getImageUrl(slide.image_url)}
                      alt={`${imageOnly ? "Slide" : "Hero banner"} ${index + 1}`}
                      width={80}
                      height={56}
                      unoptimized
                      className="h-14 w-20 rounded border object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-20 items-center justify-center rounded border bg-gray-100 text-xs text-gray-400">
                      No image
                    </div>
                  )}
                </td>
                {!imageOnly && (
                  <>
                    <td className="max-w-[280px] px-4 py-3">
                      <p className="truncate font-semibold text-gray-900">
                        {slide.title || "-"}
                      </p>
                      {slide.subtitle && (
                        <p className="mt-0.5 truncate text-xs text-gray-500">
                          {slide.subtitle}
                        </p>
                      )}
                    </td>
                    <td className="max-w-[220px] px-4 py-3 text-gray-600">
                      <p className="truncate">{slide.link_url || "-"}</p>
                      {slide.button_text && (
                        <p className="mt-0.5 truncate text-xs text-gray-400">
                          CTA: {slide.button_text}
                        </p>
                      )}
                    </td>
                  </>
                )}
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => void handleToggleActive(slide)}
                    aria-label={`${slide.active ? "Deactivate" : "Activate"} ${rowLabel(slide, index)}`}
                    aria-pressed={slide.active}
                    className={`rounded-full px-2 py-1 text-xs font-bold uppercase ${
                      slide.active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {slide.active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {slide.created_at
                    ? new Date(slide.created_at).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleEdit(slide)}
                      aria-label={`Edit ${rowLabel(slide, index)}`}
                      title="Edit"
                      className="rounded p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    >
                      <Pencil size={16} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(slide.id)}
                      aria-label={`Delete ${rowLabel(slide, index)}`}
                      title="Delete"
                      className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                    >
                      <Trash size={16} aria-hidden="true" />
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
          page={page}
          itemLabel={itemLabel}
          imageOnly={imageOnly}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
