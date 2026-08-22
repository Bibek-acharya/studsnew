"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiService, ForumPost, ForumCommunity } from "@/services/api";
import { useAuth } from "@/services/AuthContext";
import DynamicIcon from "@/components/shared/DynamicIcon";
import {
  Users,
  Plus,
  Share2,
  ArrowLeft,
  MessageSquare,
  ArrowUp,
  ArrowDown,
  MoreVertical,
} from "lucide-react";

function isArray<T>(data: unknown): data is T[] {
  return Array.isArray(data);
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function imageUrl(path?: string): string {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("blob:")) return path;
  return `${API_BASE}${path}`;
}

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return "Just now";
  const mins = Math.floor(diff / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function parseImageUrls(post: ForumPost): string[] {
  if (!post.image_url) return [];
  try {
    const parsed = JSON.parse(post.image_url);
    return Array.isArray(parsed) ? parsed : [post.image_url];
  } catch {
    return [post.image_url];
  }
}

export default function CommunityDetailPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const communityId = Number(params.id);

  const [community, setCommunity] = useState<ForumCommunity | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [joinLoading, setJoinLoading] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  const token = apiService.getToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const communitiesData = await apiService.getForumCommunities(token || undefined);
        const list = isArray(communitiesData) ? communitiesData : [];
        const found = list.find((c) => c.id === communityId);
        setCommunity(found || null);
        setIsJoined(found?.is_member || false);

        const postsData = await apiService.getForumPosts(50, token || undefined, communityId, 1);
        const postList: ForumPost[] = isArray(postsData)
          ? (postsData as ForumPost[])
          : ((postsData as { posts?: ForumPost[] })?.posts || []);
        setPosts(postList);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    if (communityId) fetchData();
  }, [communityId]);

  const handleJoinToggle = async () => {
    if (!isAuthenticated || !token) return;
    setJoinLoading(true);
    try {
      const updated = await apiService.joinForumCommunity(token, communityId);
      setIsJoined(updated.is_member);
      setCommunity((prev) =>
        prev ? { ...prev, is_member: updated.is_member, member_count: updated.member_count } : prev
      );
    } catch (e) {
      console.error(e);
    } finally {
      setJoinLoading(false);
    }
  };

  const handleLike = async (postId: number) => {
    if (!isAuthenticated || !token) return;
    try {
      const updated = await apiService.likeForumPost(token, postId);
      setPosts((p) =>
        p.map((post) =>
          post.id === postId
            ? { ...post, upvotes: updated.upvotes, downvotes: updated.downvotes, is_liked: updated.is_liked, is_disliked: updated.is_disliked }
            : post
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleDislike = async (postId: number) => {
    if (!isAuthenticated || !token) return;
    try {
      const updated = await apiService.dislikeForumPost(token, postId);
      setPosts((p) =>
        p.map((post) =>
          post.id === postId
            ? { ...post, upvotes: updated.upvotes, downvotes: updated.downvotes, is_liked: updated.is_liked, is_disliked: updated.is_disliked }
            : post
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Community not found.</p>
        <button
          onClick={() => router.back()}
          className="text-blue-600 font-semibold text-sm hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Top Banner */}
      <div className="h-40 sm:h-48 md:h-56 w-full bg-[#0000ff]" />

      {/* Main Header Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative pb-4 sm:pb-6 border-b border-gray-200">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="absolute -top-4 left-0 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors z-10"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>

          {/* Avatar and Group Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-14 sm:-mt-12 mb-4 gap-3 sm:gap-4">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-white flex items-center justify-center shadow-sm shrink-0 bg-[#0000ff]">
              {community.icon ? (
                <DynamicIcon name={community.icon} size={48} />
              ) : (
                <Users className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
              )}
            </div>

            <div className="flex-1 pt-2 text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                {community.name}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {community.member_count ?? 0} members
                <span className="mx-1">•</span>
                {community.post_count ?? 0} posts
              </p>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0 w-full sm:w-auto justify-center sm:justify-end">
              <button
                onClick={handleJoinToggle}
                disabled={joinLoading}
                className={`font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full flex items-center gap-1.5 sm:gap-2 transition-colors text-xs sm:text-sm ${
                  isJoined
                    ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    : "bg-[#0000ff] hover:bg-blue-700 text-white"
                }`}
              >
                {isJoined ? (
                  "Joined"
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Join
                  </>
                )}
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-3 sm:px-4 py-2 sm:py-2.5 rounded-full flex items-center gap-1.5 sm:gap-2 transition-colors text-xs sm:text-sm">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Invite Friends</span>
                <span className="sm:hidden">Invite</span>
              </button>
              <button className="p-2 sm:p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Layout: Feed + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 pt-4 sm:pt-6">
          {/* Main Feed Column */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {/* Posts */}
            {posts.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 text-center">
                <p className="text-gray-500 text-sm">No posts yet in this community.</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 shadow-sm space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                        {post.user?.image_url ? (
                          <img src={imageUrl(post.user.image_url)} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs sm:text-sm font-bold text-gray-600">
                            {(post.user?.first_name?.[0] || "U").toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-none">
                          {post.user ? `${post.user.first_name} ${post.user.last_name}` : "Anonymous"}
                        </h3>
                        <span className="text-[10px] sm:text-xs text-gray-400">
                          {relativeTime(post.created_at || post.CreatedAt || new Date().toISOString())}
                        </span>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>

                  {post.title && (
                    <h4 className="text-sm sm:text-base font-bold text-gray-900">{post.title}</h4>
                  )}

                  {post.content && (
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{post.content}</p>
                  )}

                  {post.category && (
                    <div className="pt-1">
                      <span className="inline-block bg-gray-100 text-gray-600 text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md font-medium">
                        {post.category}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-medium text-gray-500 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full hover:bg-gray-100 transition-colors ${post.is_liked ? "text-blue-600" : ""}`}
                    >
                      <ArrowUp size={12} className="sm:w-3.5 sm:h-3.5" />
                      {post.upvotes || 0}
                    </button>
                    <button
                      onClick={() => handleDislike(post.id)}
                      className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full hover:bg-gray-100 transition-colors ${post.is_disliked ? "text-red-600" : ""}`}
                    >
                      <ArrowDown size={12} className="sm:w-3.5 sm:h-3.5" />
                    </button>
                    <button className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full hover:bg-gray-100 transition-colors">
                      <MessageSquare size={12} className="sm:w-3.5 sm:h-3.5" />
                      {post.comment_count || 0}
                    </button>
                    <button className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full hover:bg-gray-100 transition-colors">
                      <Share2 size={12} className="sm:w-3.5 sm:h-3.5" />
                      Share
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Sidebar Column */}
          <div className="hidden lg:block">
            <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 space-y-4 sticky top-6">
              <h3 className="font-bold text-sm text-gray-900">About Community</h3>
              {community.description && (
                <p className="text-sm text-gray-600">{community.description}</p>
              )}
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>{community.member_count ?? 0} members</span>
                </div>
              </div>
              <button
                onClick={handleJoinToggle}
                disabled={joinLoading}
                className={`w-full font-semibold px-5 py-2.5 rounded-full transition-colors text-sm ${
                  isJoined
                    ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    : "bg-[#0000ff] hover:bg-blue-700 text-white"
                }`}
              >
                {isJoined ? "Joined" : "Join Community"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
