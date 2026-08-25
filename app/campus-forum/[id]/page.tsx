"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiService, ForumPost, ForumCommunity } from "@/services/api";
import { useAuth } from "@/services/AuthContext";
import DynamicIcon from "@/components/shared/DynamicIcon";
import ShareCollegeModal from "@/app/find-college/[id]/ShareCollegeModal";
import {
  Users,
  Plus,
  Share2,
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
  const [allCommunities, setAllCommunities] = useState<ForumCommunity[]>([]);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [joinLoading, setJoinLoading] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [relatedJoinLoading, setRelatedJoinLoading] = useState<Record<number, boolean>>({});
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const token = apiService.getToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const communitiesData = await apiService.getForumCommunities(token || undefined);
        const list = isArray(communitiesData) ? communitiesData : [];
        setAllCommunities(list);
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

  const handleRelatedJoinToggle = async (id: number) => {
    if (!isAuthenticated || !token) return;
    setRelatedJoinLoading((p) => ({ ...p, [id]: true }));
    try {
      const updated = await apiService.joinForumCommunity(token, id);
      setAllCommunities((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, is_member: updated.is_member, member_count: updated.member_count } : c
        )
      );
    } catch (e) {
      console.error(e);
    } finally {
      setRelatedJoinLoading((p) => ({ ...p, [id]: false }));
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
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Top Banner */}
      <div className="relative h-40 sm:h-48 md:h-56 w-full bg-[#0000ff]" />

      {/* Main Header Container */}
      <div className="max-w-350 mx-auto">
        <div className="relative bg-white">
          <div className="relative flex flex-row items-start gap-3 px-6 pb-8 md:block md:px-0">
            <div className="relative z-10 -mt-2 flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-[#0000ff] p-1.5 md:absolute md:-top-4 md:left-12 md:mx-0 md:mt-0 md:h-37.5 md:w-37.5 lg:left-24 xl:left-32">
              {community.icon ? (
                <DynamicIcon name={community.icon} size={40} className="text-white" />
              ) : (
                <Users className="w-10 h-10 sm:w-14 sm:h-14 text-white" />
              )}
            </div>

            <div className="min-w-0 flex-1 pt-1 flex flex-col items-start gap-3 md:items-center md:mt-4 md:pt-0 md:gap-6 lg:mt-0 lg:flex-row lg:items-end lg:justify-between lg:gap-0 lg:pl-42.5">
              <div className="w-full space-y-1.5 md:space-y-3 text-left lg:w-auto">
                <div className="flex items-center gap-2 pt-0 md:pt-4">
                  <h1 className="min-w-0 text-[18px] font-bold tracking-tight text-gray-900 truncate md:text-[24px] md:overflow-visible md:whitespace-normal lg:text-3xl">
                    {community.name}
                  </h1>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12px] font-medium md:text-[14px]">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Users className="w-4 h-4 text-gray-500 shrink-0" />
                    <span className="text-gray-600 truncate max-w-[120px] md:max-w-none">
                      {community.member_count ?? 0} members
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <MessageSquare className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 whitespace-nowrap">
                      {community.post_count ?? 0} posts
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={joinLoading}
                    onClick={handleJoinToggle}
                    className={`flex items-center justify-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold transition-colors md:px-4 md:py-1.5 md:text-[13px] disabled:opacity-50 ${
                      isJoined
                        ? "bg-green-300 text-gray-800 hover:bg-green-400"
                        : "bg-brand-blue text-white hover:bg-brand-hover"
                    }`}
                  >
                    {joinLoading ? (
                      <i className="fa-solid fa-spinner fa-spin"></i>
                    ) : (
                      <i className={`fa-solid ${isJoined ? "fa-check" : "fa-plus"}`}></i>
                    )}
                    {isJoined ? "Following" : "Join"}
                  </button>
                </div>
              </div>

              <div className="hidden mt-8 w-full flex-nowrap items-center gap-2 overflow-x-auto pb-1 md:flex lg:mt-0 lg:w-auto lg:gap-3 lg:overflow-visible lg:pb-0">
                <button
                  className="shrink-0 flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-[13px] font-semibold text-gray-700 transition-colors hover:bg-gray-50 lg:px-5 lg:py-3 lg:text-[15px]"
                >
                  <Users className="h-4 w-4" />
                  Invite Friends
                </button>
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="shrink-0 flex items-center justify-center rounded-md border border-gray-200 bg-white p-2.5 text-gray-700 transition-colors hover:bg-gray-50 lg:p-3"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile action buttons */}
          <div className="grid grid-cols-2 gap-2 px-6 pb-6 md:hidden">
            <button
              className="flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-[13px] font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Users className="h-4 w-4" />
              Invite
            </button>
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center justify-center rounded-md border border-gray-200 bg-white p-2.5 text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Share2 className="h-5 w-5" />
            </button>
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
              <h3 className="font-bold text-sm text-gray-900">Related Communities</h3>
              <div className="space-y-3">
                {allCommunities.filter((c) => c.id !== communityId).length === 0 ? (
                  <p className="text-xs text-gray-400">No other communities yet.</p>
                ) : (
                  allCommunities.filter((c) => c.id !== communityId).map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-1 group">
                      <div
                        className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                        onClick={() => router.push(`/campus-forum/${item.id}`)}
                      >
                        <div
                          className={`w-9 h-9 rounded-md flex items-center justify-center text-sm font-semibold flex-shrink-0 transition-transform group-hover:scale-105 ${
                            item.bg_color || "bg-blue-100/70"
                          }`}
                        >
                          {item.icon ? (
                            <DynamicIcon name={item.icon} size={20} />
                          ) : (
                            <span className="text-lg">🎓</span>
                          )}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold truncate leading-snug text-slate-800 group-hover:text-blue-600 transition-colors" title={item.name}>
                            {item.name}
                          </p>
                          <p className="text-[11px] font-medium text-slate-400">
                            {item.member_count ?? 0} members
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRelatedJoinToggle(item.id);
                        }}
                        disabled={relatedJoinLoading[item.id]}
                        className={`ml-2 px-4 py-1.5 text-xs font-bold rounded-full transition-all flex-shrink-0 ${
                          item.is_member
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-[#0000ff] hover:opacity-90 text-white active:scale-95"
                        }`}
                      >
                        {relatedJoinLoading[item.id] ? "..." : item.is_member ? "Joined" : "Join"}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ShareCollegeModal
        collegeName={community.name}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareUrl={`${typeof window !== "undefined" ? window.location.origin : ""}/campus-forum/${communityId}`}
        shareTitle={community.name}
        shareText={`Join ${community.name} on StudsSphere`}
      />
    </div>
  );
}
