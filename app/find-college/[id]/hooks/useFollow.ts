"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/services/AuthContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function followFetch(path: string, options?: RequestInit): Promise<any> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
}

export function useFollow(institutionId: number | null) {
  const [isFollowed, setIsFollowed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!institutionId || !isAuthenticated) {
      setIsFollowed(false);
      return;
    }
    followFetch(`/api/v1/follow/status/${institutionId}`)
      .then((data) => setIsFollowed(data.following))
      .catch(() => setIsFollowed(false));
  }, [institutionId, isAuthenticated]);

  const toggleFollow = useCallback(async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/find-college/${institutionId}`);
      return;
    }
    if (!institutionId) return;
    setLoading(true);
    try {
      if (isFollowed) {
        await followFetch(`/api/v1/follow/institution/${institutionId}`, {
          method: "DELETE",
        });
        setIsFollowed(false);
      } else {
        await followFetch(`/api/v1/follow/institution/${institutionId}`, {
          method: "POST",
        });
        setIsFollowed(true);
      }
    } catch (e) {
      console.error("Follow action failed:", e);
    } finally {
      setLoading(false);
    }
  }, [isFollowed, isAuthenticated, institutionId, router]);

  const unfollow = useCallback(async () => {
    if (!institutionId) return;
    setLoading(true);
    try {
      await followFetch(`/api/v1/follow/institution/${institutionId}`, {
        method: "DELETE",
      });
      setIsFollowed(false);
    } catch (e) {
      console.error("Unfollow failed:", e);
    } finally {
      setLoading(false);
    }
  }, [institutionId]);

  return { isFollowed, loading, toggleFollow, unfollow };
}
