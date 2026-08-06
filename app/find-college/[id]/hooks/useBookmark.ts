"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/services/AuthContext";
import { apiService } from "@/services/api";
import type { BookmarkItem } from "@/services/api.types";
import { toast } from "sonner";

export function useBookmark(collegeId: number | null) {
  const { isAuthenticated } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !collegeId) return;
    apiService.getBookmarksByType("institutions").then((items: BookmarkItem[]) => {
      const found = items.find((b) => b.item_id === collegeId);
      if (found) {
        setIsBookmarked(true);
        setBookmarkId(found.id);
      }
    }).catch(() => {});
  }, [isAuthenticated, collegeId]);

  const toggleBookmark = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to bookmark");
      return;
    }
    if (!collegeId) return;

    setLoading(true);
    try {
      if (isBookmarked && bookmarkId) {
        await apiService.deleteBookmark(bookmarkId);
        setIsBookmarked(false);
        setBookmarkId(null);
        toast.success("Bookmark removed");
      } else {
        const res = await apiService.createBookmark(collegeId, "institutions");
        setIsBookmarked(true);
        setBookmarkId(res.data.id);
        toast.success("Bookmarked");
      }
    } catch {
      toast.error("Failed to update bookmark");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, collegeId, isBookmarked, bookmarkId]);

  return { isBookmarked, loading, toggleBookmark };
}
