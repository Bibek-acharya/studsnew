"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiService } from "@/services/api";
import { useAuth } from "@/services/AuthContext";

export default function useCourseBookmarks() {
  const { isAuthenticated } = useAuth();
  const [savedCourseIds, setSavedCourseIds] = useState<number[]>([]);
  const [bookmarkMap, setBookmarkMap] = useState<Record<number, number>>({});
  const [pendingBookmarks, setPendingBookmarks] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!isAuthenticated) return;

    apiService
      .getBookmarksByType("courses")
      .then((items) => {
        const ids: number[] = [];
        const map: Record<number, number> = {};
        items.forEach((bookmark) => {
          ids.push(bookmark.item_id);
          map[bookmark.item_id] = bookmark.id;
        });
        setSavedCourseIds(ids);
        setBookmarkMap(map);
      })
      .catch(() => {});
  }, [isAuthenticated]);

  const toggleSaved = async (courseId: number) => {
    if (!isAuthenticated) {
      toast.error("Please login to save bookmarks");
      return;
    }
    if (pendingBookmarks[courseId]) return;

    setPendingBookmarks((previous) => ({ ...previous, [courseId]: true }));
    const existingBookmarkId = bookmarkMap[courseId];

    try {
      if (existingBookmarkId) {
        await apiService.deleteBookmark(existingBookmarkId);
        setBookmarkMap((previous) => {
          const next = { ...previous };
          delete next[courseId];
          return next;
        });
        setSavedCourseIds((previous) => previous.filter((id) => id !== courseId));
        toast.success("Removed from bookmarks");
      } else {
        const response = await apiService.createBookmark(courseId, "courses");
        setBookmarkMap((previous) => ({ ...previous, [courseId]: response.data.id }));
        setSavedCourseIds((previous) => [...previous, courseId]);
        toast.success("Added to bookmarks!");
      }
    } catch {
      toast.error("Failed to save bookmark");
    } finally {
      setPendingBookmarks((previous) => {
        const next = { ...previous };
        delete next[courseId];
        return next;
      });
    }
  };

  return {
    savedCourseIds: isAuthenticated ? savedCourseIds : [],
    pendingBookmarks,
    toggleSaved,
  };
}
