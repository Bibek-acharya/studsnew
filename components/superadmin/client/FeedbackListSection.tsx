"use client";

import React, { useEffect, useState, useCallback } from "react";
import { MessageSquare, Loader2, Trash2, Star } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface FeedbackEntry {
  id: number;
  user_name: string;
  rating: number;
  experience: string;
  email: string;
  created_at: string;
}

export default function FeedbackListSection() {
  const [feedbacks, setFeedbacks] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchFeedbacks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("superadmin_token");
      const res = await fetch(`${API_BASE_URL}/api/v1/feedback`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to fetch feedback");
      const data = await res.json();
      setFeedbacks(data.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load feedback");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const handleDelete = async (id: number) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this feedback? This action cannot be undone.",
      )
    )
      return;
    setDeleting(id);
    try {
      const token = localStorage.getItem("superadmin_token");
      await fetch(`${API_BASE_URL}/api/v1/feedback/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    } catch {
      // silently fail
    } finally {
      setDeleting(null);
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-gray-200 bg-white p-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchFeedbacks}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-gray-200 bg-white p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <MessageSquare size={20} className="text-blue-600" /> User Feedback
        </h2>
        <button
          onClick={fetchFeedbacks}
          className="flex items-center gap-1.5 rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <Loader2 size={14} className={loading ? "animate-spin" : "hidden"} />{" "}
          Refresh
        </button>
      </div>

      {feedbacks.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          <MessageSquare size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="text-sm">No feedback received yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-semibold uppercase text-gray-500">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3 w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {feedbacks.map((fb) => (
                <tr
                  key={fb.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {fb.user_name || "Anonymous"}
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {formatTime(fb.created_at)}
                  </td>
                  <td className="px-4 py-3">{renderStars(fb.rating)}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-[300px]">
                    <p className="truncate" title={fb.experience}>
                      {fb.experience || "—"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(fb.id)}
                      disabled={deleting === fb.id}
                      className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      {deleting === fb.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
