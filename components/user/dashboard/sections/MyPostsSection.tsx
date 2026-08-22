"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Heart,
  MessageSquare,
  Share2,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  PenSquare,
  Trash2,
} from "lucide-react";
import { apiService, ForumPost, ForumCommunity } from "@/services/api";
import { useAuth } from "@/services/AuthContext";
import DynamicIcon from "@/components/shared/DynamicIcon";

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
  return `${Math.floor(days / 30)}mo ago`;
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

function isArray<T>(data: unknown): data is T[] {
  return Array.isArray(data);
}

export default function MyPostsSection() {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [communities, setCommunities] = useState<ForumCommunity[]>([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  const token = apiService.getToken();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [communitiesData, postsData] = await Promise.all([
        apiService.getForumCommunities(token || undefined),
        apiService.getForumPosts(50, token || undefined, undefined, 1),
      ]);

      const communityList = isArray(communitiesData) ? communitiesData : [];
      setCommunities(communityList);

      const postList: ForumPost[] = isArray(postsData)
        ? (postsData as ForumPost[])
        : ((postsData as { posts?: ForumPost[] })?.posts || []);

      const userId = user?.id;
      const joinedIds = communityList.filter((c) => c.is_member).map((c) => c.id);
      const generalId = communityList.find((c) => c.is_general)?.id;

      setPosts(
        postList.filter(
          (p) =>
            p.user_id === userId ||
            joinedIds.includes(p.community_id) ||
            p.community_id === generalId
        )
      );
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [token, user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredPosts = selectedCommunityId
    ? posts.filter((p) => p.community_id === selectedCommunityId)
    : posts;

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

  const handleDelete = async (postId: number) => {
    if (!token) return;
    setDeleteLoading(postId);
    try {
      await apiService.deleteForumPost(token, postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (e) {
      console.error(e);
    } finally {
      setDeleteLoading(null);
    }
  };

  const joinedCommunities = communities.filter((c) => c.is_member || c.is_general);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <PenSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">My Posts</h1>
            <p className="text-xs sm:text-sm text-gray-500">Posts from your joined communities</p>
          </div>
        </div>
      </div>

      {/* Community Tabs */}
      {joinedCommunities.length > 0 && (
        <div className="flex overflow-x-auto gap-1.5 sm:gap-2 pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedCommunityId(null)}
            className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors ${
              selectedCommunityId === null
                ? "bg-[#0000ff] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All Posts
          </button>
          {joinedCommunities.map((community) => (
            <button
              key={community.id}
              onClick={() => setSelectedCommunityId(community.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors ${
                selectedCommunityId === community.id
                  ? "bg-[#0000ff] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <div
                className={`w-4 h-4 sm:w-5 sm:h-5 rounded flex items-center justify-center ${
                  community.bg_color || "bg-blue-100"
                }`}
              >
                {community.icon ? (
                  <DynamicIcon name={community.icon} size={10} />
                ) : (
                  <span className="text-[7px] sm:text-[8px]">🎓</span>
                )}
              </div>
              <span className="hidden sm:inline">{community.name}</span>
              <span className="sm:hidden">{community.name.length > 10 ? community.name.slice(0, 10) + "..." : community.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Posts */}
      {isLoading ? (
        <div className="flex justify-center py-8 sm:py-12">
          <div className="h-7 w-7 sm:h-8 sm:w-8 animate-spin rounded-full border-4 border-[#0000ff] border-t-transparent" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-12 text-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <PenSquare className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h3 className="text-gray-900 font-bold text-base sm:text-lg mb-1">No posts yet</h3>
          <p className="text-gray-500 text-xs sm:text-sm">
            {selectedCommunityId
              ? "No posts in this community yet."
              : "You haven't posted or joined any communities yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredPosts.map((post) => {
            const images = parseImageUrls(post);
            const community = post.community;
            const isOwner = post.user_id === user?.id;

            return (
              <div
                key={post.id}
                className="bg-white border border-gray-200 rounded-xl p-3 sm:p-5 shadow-sm space-y-2 sm:space-y-3"
              >
                {/* Post Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      {post.user?.image_url ? (
                        <img
                          src={imageUrl(post.user.image_url)}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs sm:text-sm font-bold text-gray-600">
                          {(post.user?.first_name?.[0] || "U").toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-none">
                        {post.user
                          ? `${post.user.first_name} ${post.user.last_name}`
                          : "Anonymous"}
                      </h3>
                      <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5">
                        {community && (
                          <span className="text-[10px] sm:text-xs text-blue-600 font-medium">
                            {community.name}
                          </span>
                        )}
                        <span className="text-[10px] sm:text-xs text-gray-400">
                          {relativeTime(post.created_at || post.CreatedAt || new Date().toISOString())}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    {isOwner && (
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={deleteLoading === post.id}
                        className="p-1 sm:p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      >
                        {deleteLoading === post.id ? (
                          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        )}
                      </button>
                    )}
                    <button className="p-1 sm:p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                      <MoreVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>

                {/* Post Title */}
                {post.title && (
                  <h4 className="text-sm sm:text-base font-bold text-gray-900">{post.title}</h4>
                )}

                {/* Post Content */}
                {post.content && (
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{post.content}</p>
                )}

                {/* Post Images */}
                {images.length > 0 && (
                  <div className="rounded-xl overflow-hidden">
                    {images.length === 1 ? (
                      <img
                        src={imageUrl(images[0])}
                        alt=""
                        className="w-full max-h-60 sm:max-h-80 object-cover"
                      />
                    ) : (
                      <div className="grid grid-cols-2 gap-0.5 sm:gap-1">
                        {images.slice(0, 4).map((url, i) => (
                          <img
                            key={i}
                            src={imageUrl(url)}
                            alt=""
                            className="w-full h-24 sm:h-32 object-cover"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Post Video */}
                {post.video_url && (
                  <div className="rounded-xl overflow-hidden">
                    <video
                      src={imageUrl(post.video_url)}
                      controls
                      className="w-full max-h-60 sm:max-h-80 object-contain bg-black"
                    />
                  </div>
                )}

                {/* Category */}
                {post.category && (
                  <div>
                    <span className="inline-block bg-gray-100 text-gray-600 text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md font-medium">
                      {post.category}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-medium text-gray-500 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full hover:bg-gray-100 transition-colors ${
                      post.is_liked ? "text-blue-600" : ""
                    }`}
                  >
                    <ArrowUp size={12} className="sm:w-3.5 sm:h-3.5" />
                    {post.upvotes || 0}
                  </button>
                  <button
                    onClick={() => handleDislike(post.id)}
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full hover:bg-gray-100 transition-colors ${
                      post.is_disliked ? "text-red-600" : ""
                    }`}
                  >
                    <ArrowDown size={12} className="sm:w-3.5 sm:h-3.5" />
                  </button>
                  <button className="flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full hover:bg-gray-100 transition-colors">
                    <MessageSquare size={12} className="sm:w-3.5 sm:h-3.5" />
                    {post.comment_count || 0}
                  </button>
                  <button className="flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full hover:bg-gray-100 transition-colors">
                    <Share2 size={12} className="sm:w-3.5 sm:h-3.5" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
