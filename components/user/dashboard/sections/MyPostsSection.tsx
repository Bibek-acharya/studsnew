"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MessageSquare,
  ArrowUp,
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
      setPosts(postList.filter((p) => p.user_id === userId));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [token, user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  const handleJoin = async (communityId: number) => {
    if (!token) return;
    try {
      const updated = await apiService.joinForumCommunity(token, communityId);
      setCommunities((prev) =>
        prev.map((c) =>
          c.id === communityId
            ? { ...c, is_member: updated.is_member, member_count: updated.member_count }
            : c
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  const unjoinedCommunities = communities.filter((c) => !c.is_member && !c.is_general);

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-50 flex items-center justify-center">
          <PenSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">My Posts</h1>
          <p className="text-xs sm:text-sm text-gray-500">{posts.length} posts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Posts Grid */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="flex justify-center py-8 sm:py-12">
              <div className="h-7 w-7 sm:h-8 sm:w-8 animate-spin rounded-full border-4 border-[#0000ff] border-t-transparent" />
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-10 text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <PenSquare className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-gray-900 font-bold text-base sm:text-lg mb-1">No posts yet</h3>
              <p className="text-gray-500 text-xs sm:text-sm">You haven&apos;t posted anything yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {posts.map((post) => {
                const images = parseImageUrls(post);
                const community = post.community;

                return (
                  <div
                    key={post.id}
                    className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-2.5 sm:p-3 shadow-sm flex flex-col"
                  >
                    {/* Community Tag */}
                    {community && (
                      <div className="flex items-center gap-1 mb-1.5 sm:mb-2">
                        <div
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded flex items-center justify-center ${
                            community.bg_color || "bg-blue-100"
                          }`}
                        >
                          {community.icon ? (
                            <DynamicIcon name={community.icon} size={8} />
                          ) : (
                            <span className="text-[6px]">&#127891;</span>
                          )}
                        </div>
                        <span className="text-[9px] sm:text-[10px] text-blue-600 font-medium truncate">
                          {community.name}
                        </span>
                      </div>
                    )}

                    {/* Post Title */}
                    {post.title && (
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight line-clamp-2 mb-1">
                        {post.title}
                      </h4>
                    )}

                    {/* Post Content */}
                    {post.content && (
                      <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed line-clamp-3 mb-1.5">
                        {post.content}
                      </p>
                    )}

                    {/* Post Image */}
                    {images.length > 0 && (
                      <div className="rounded-md overflow-hidden mb-1.5">
                        <img
                          src={imageUrl(images[0])}
                          alt=""
                          className="w-full h-20 sm:h-28 object-cover"
                        />
                      </div>
                    )}

                    {/* Post Video */}
                    {post.video_url && (
                      <div className="rounded-md overflow-hidden mb-1.5">
                        <video
                          src={imageUrl(post.video_url)}
                          className="w-full h-20 sm:h-28 object-cover bg-black"
                        />
                      </div>
                    )}

                    <div className="flex-1" />

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-1.5 sm:pt-2 mt-auto border-t border-gray-100">
                      <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[10px] text-gray-500">
                        <span className="flex items-center gap-0.5">
                          <ArrowUp size={10} />
                          {post.upvotes || 0}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <MessageSquare size={10} />
                          {post.comment_count || 0}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={deleteLoading === post.id}
                        className="p-0.5 sm:p-1 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                      >
                        {deleteLoading === post.id ? (
                          <div className="w-3 h-3 animate-spin rounded-full border-1.5 border-red-500 border-t-transparent" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Sidebar - Suggested Communities */}
        <div className="hidden lg:block">
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 sticky top-6 space-y-4">
            <h3 className="font-bold text-sm text-gray-900">Suggested Communities</h3>
            {unjoinedCommunities.length === 0 ? (
              <p className="text-xs text-gray-500">No new communities to join.</p>
            ) : (
              <div className="space-y-3">
                {unjoinedCommunities.slice(0, 5).map((community) => (
                  <div key={community.id} className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        community.bg_color || "bg-blue-100/70"
                      }`}
                    >
                      {community.icon ? (
                        <DynamicIcon name={community.icon} size={16} />
                      ) : (
                        <span className="text-sm">&#127891;</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{community.name}</p>
                      <p className="text-[10px] text-gray-500">{community.member_count ?? 0} members</p>
                    </div>
                    <button
                      onClick={() => handleJoin(community.id)}
                      className="px-3 py-1 text-[10px] font-bold rounded-full bg-[#0000ff] text-white hover:bg-blue-700 transition-colors flex-shrink-0"
                    >
                      Join
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
