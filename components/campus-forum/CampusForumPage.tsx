"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { apiService, ForumPost, ForumCommunity } from "@/services/api";
import { useAuth } from "@/services/AuthContext";
import DynamicIcon from "@/components/shared/DynamicIcon";
import { Heart, MessageCircle, Image, BarChart2, Video, X, Plus, Send, ChevronDown, ChevronUp, Maximize2, ChevronRight, ChevronLeft, ArrowUp, ArrowDown, MessageSquare, Share2, MoreVertical } from "lucide-react";
import ShareCollegeModal from "@/app/find-college/[id]/ShareCollegeModal";
import ActionMenu from "./ActionMenu";
import ReportPostModal from "./ReportPostModal";

/* ── helpers ─────────────────────────────────────────────────────────── */

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

function isArray<T>(data: unknown): data is T[] {
  return Array.isArray(data);
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function imageUrl(path?: string): string {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("blob:")) return path;
  return `${API_BASE}${path}`;
}

interface PollOption {
  text: string;
  votes: number;
}

function parsePollOptions(post: ForumPost): PollOption[] {
  if (!post.poll_options) return [];
  try {
    const parsed = JSON.parse(post.poll_options);
    if (!Array.isArray(parsed) || parsed.length === 0) return [];
    if (typeof parsed[0] === "string") {
      return parsed.map((text: string) => ({ text, votes: 0 }));
    }
    return parsed;
  } catch {
    return [];
  }
}

/* ── internal components ──────────────────────────────────────────────── */

interface CommentData {
  id: number;
  content: string;
  user_id: number;
  user_name: string;
  user?: { id: number; first_name: string; last_name: string; image_url?: string };
  image_url?: string;
  parent_id?: number;
  parent_user_name?: string;
  reply_count?: number;
  replies?: CommentData[];
  created_at: string;
}

const PostCard: React.FC<{
  post: ForumPost;
  currentUser: { first_name: string; last_name: string; image_url?: string } | null;
  onLike: (id: number) => void;
  onDislike: (id: number) => void;
  onCommentClick: (id: number) => void;
  onShare: (post: ForumPost) => void;
  onLightbox: (url: string, type: "image" | "video") => void;
  comments?: CommentData[];
  commentsOpen?: boolean;
  onJoinCommunity?: (communityId: number) => void;
  onCommentAdded?: (postId: number) => void;
  onNotInterested?: (postId: number) => void;
  onReport?: (postId: number) => void;
  onPollVote?: (postId: number, optionIdx: number) => void;
}> = ({ post, currentUser, onLike, onDislike, onCommentClick, onShare, onLightbox, comments = [], commentsOpen, onJoinCommunity, onCommentAdded, onNotInterested, onReport, onPollVote }) => {
  const images = parseImageUrls(post);
  const pollOptions = parsePollOptions(post);
  const user = post.user;
  const avatarLetter = user ? (user.first_name?.[0] || "U").toUpperCase() : "U";
  const avatarUrl = user?.image_url ? imageUrl(user.image_url) : "";
  const communityName = post.community?.name || "";
  const isGeneral = post.community?.is_general || communityName === "General";
  const userRole = (user as any)?.role || "Student";
  const [isJoined, setIsJoined] = useState(post.community?.is_member || false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const contentLength = post.content?.length || 0;
  const shouldTruncate = contentLength > 150;
  const displayContent = shouldTruncate && !isExpanded
    ? post.content?.slice(0, 150) + "..."
    : post.content;

  const handleJoinToggle = () => {
    if (onJoinCommunity && post.community) {
      onJoinCommunity(post.community.id);
      setIsJoined(!isJoined);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200/80 p-4 shadow-none font-sans text-gray-900">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs tracking-wider shrink-0"
            style={{ backgroundColor: "#0000ff" }}
          >
            {post.community?.icon ? (
              <DynamicIcon name={post.community.icon} size={14} />
            ) : (
              communityName.substring(0, 1).toUpperCase() || "G"
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-gray-900">{communityName || "General"}</span>
              <span className="text-gray-400 text-xs">•</span>
              <span className="text-gray-400 text-xs">{relativeTime(post.created_at || post.CreatedAt || new Date().toISOString())}</span>
            </div>
            <div className="text-xs text-gray-500 font-normal">
              {user ? `${user.first_name} ${user.last_name}` : "Anonymous"} <span className="mx-0.5">•</span> {userRole}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onJoinCommunity && post.community && !isGeneral && !isJoined && (
            <button
              onClick={handleJoinToggle}
              className="px-4 py-1 rounded-full text-xs font-semibold transition-colors border border-[#2563eb] text-[#2563eb] hover:bg-blue-50"
            >
              Join
            </button>
          )}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full"
            >
              <MoreVertical size={18} />
            </button>
            {isMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
                <div className="absolute right-0 z-50 mt-1">
                  <ActionMenu
                    onShare={() => { setIsMenuOpen(false); onShare(post); }}
                    onNotInterested={() => { setIsMenuOpen(false); onNotInterested?.(post.id); }}
                    onReport={() => { setIsMenuOpen(false); onReport?.(post.id); }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {post.title && (
        <h2 className="text-base font-bold text-gray-900 leading-snug mb-2">{post.title}</h2>
      )}

      {post.content && (
        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          {displayContent}
          {shouldTruncate && (
            <span
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 font-medium cursor-pointer hover:underline ml-1"
            >
              {isExpanded ? "less" : "more"}
            </span>
          )}
        </p>
      )}

      {images.length > 0 && (
        <div className="w-full h-72 rounded-xl overflow-hidden mb-3 bg-gray-100">
          {images.length === 1 ? (
            <div className="relative cursor-pointer group h-full" onClick={() => onLightbox(imageUrl(images[0]), "image")}>
              <img src={imageUrl(images[0])} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <Maximize2 className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-1 h-full">
              {images.slice(0, 4).map((url, i) => (
                <div key={i} className="relative cursor-pointer group" onClick={() => onLightbox(imageUrl(url), "image")}>
                  <img src={imageUrl(url)} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <Maximize2 className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {post.video_url && (
        <div className="w-full h-72 rounded-xl overflow-hidden mb-3 bg-gray-100 relative cursor-pointer group" onClick={() => onLightbox(imageUrl(post.video_url), "video")}>
          <video src={imageUrl(post.video_url)} className="w-full h-full object-contain" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <Maximize2 className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      )}

      {post.is_poll && pollOptions.length > 0 && (() => {
            return (
              <div className="mb-3 space-y-1.5">
                {pollOptions.map((opt: any, idx: number) => {
                  const total = post.total_votes || 1;
                  const voteCount = post.poll_results?.[idx] || 0;
                  const pct = Math.round((voteCount / total) * 100);
                  const isSelected = post.voted_option === idx;
                  const hasVoted = post.voted_option != null;
                  return (
                    <div
                      key={idx}
                      onClick={() => onPollVote?.(post.id, idx)}
                      className={`relative overflow-hidden rounded-md border p-2 transition-all duration-300 focus:outline-none ${hasVoted ? (isSelected ? "border-blue-500 bg-blue-50" : "border-gray-100 bg-white") : "border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer"}`}
                    >
                      <div
                        className="absolute left-0 top-0 bottom-0 bg-blue-100 transition-all duration-700 ease-out"
                        style={{ width: hasVoted ? `${pct}%` : "0%" }}
                      />
                      <div className="relative flex items-center justify-between px-2 py-0.5 text-sm font-medium text-gray-700">
                        <span>{opt.text}</span>
                        {hasVoted && <span>{pct}%</span>}
                      </div>
                    </div>
                  );
                })}
                {post.total_votes != null && (
                  <p className="text-xs text-gray-500 font-medium">{post.total_votes} votes</p>
                )}
              </div>
            );
          })()}

      <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-medium text-[#52525e]">
        <div className="flex items-center bg-[#f3f4f6] hover:bg-gray-200 rounded-full px-2 py-1 sm:px-3 sm:py-2 text-gray-700 transition-colors">
          <button
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-1 sm:gap-1.5 hover:text-black ${post.is_liked ? "text-blue-600" : ""}`}
          >
            <ArrowUp size={14} className={`sm:hidden ${post.is_liked ? "text-indigo-500" : "text-gray-500"}`} />
            <ArrowUp size={16} className={`hidden sm:block ${post.is_liked ? "text-indigo-500" : "text-gray-500"}`} />
            <span className="font-semibold text-gray-800">{post.upvotes || 0}</span>
          </button>
          <span className="mx-1.5 sm:mx-2 text-gray-300">|</span>
          <button
            onClick={() => onDislike(post.id)}
            className={`flex items-center gap-1 sm:gap-1.5 hover:text-black ${post.is_disliked ? "text-red-600" : ""}`}
          >
            <ArrowDown size={14} className={`sm:hidden ${post.is_disliked ? "text-red-500" : "text-gray-500"}`} />
            <ArrowDown size={16} className={`hidden sm:block ${post.is_disliked ? "text-red-500" : "text-gray-500"}`} />
            <span className="font-semibold text-gray-800">{post.downvotes || 0}</span>
          </button>
        </div>

        <button
          onClick={() => onCommentClick(post.id)}
          className="flex items-center gap-1 sm:gap-1.5 bg-[#f3f4f6] hover:bg-gray-200 rounded-full px-2.5 py-1 sm:px-3.5 sm:py-2 text-gray-700 transition-colors font-semibold text-xs sm:text-sm"
        >
          <MessageSquare size={14} className="text-gray-500 sm:hidden" />
          <MessageSquare size={16} className="text-gray-500 hidden sm:block" />
          {post.comment_count || 0} Comment
        </button>

        <button
          onClick={() => onShare(post)}
          className="flex items-center gap-1 sm:gap-1.5 bg-[#f3f4f6] hover:bg-gray-200 rounded-full px-2.5 py-1 sm:px-3.5 sm:py-2 text-gray-700 transition-colors font-semibold text-xs sm:text-sm"
        >
          <Share2 size={14} className="text-gray-500 sm:hidden" />
          <Share2 size={16} className="text-gray-500 hidden sm:block" />
          Share
        </button>
      </div>

      {commentsOpen && (
        <div className="mt-4 border-t border-gray-100 pt-4">
           <CommentSection postId={post.id} comments={comments} totalCount={post.comment_count || 0} user={currentUser} onCommentAdded={onCommentAdded} />
        </div>
      )}
    </div>
  );
};

const CommentItem: React.FC<{
  comment: CommentData;
  postId: number;
  onReply: (postId: number, parentId: number, content: string) => void;
  onVote?: (commentId: number, delta: number) => void;
  isAuthor?: boolean;
  currentUser?: { first_name: string; last_name: string; image_url?: string } | null;
}> = ({ comment, postId, onReply, onVote, isAuthor = false, currentUser }) => {
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<CommentData[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
      setIsLiked(false);
      onVote?.(comment.id, -1);
    } else {
      setLikes(likes + 1);
      setIsLiked(true);
      onVote?.(comment.id, 1);
      if (isDisliked) {
        setDislikes(dislikes - 1);
        setIsDisliked(false);
        onVote?.(comment.id, 1);
      }
    }
  };

  const handleDislike = () => {
    if (isDisliked) {
      setDislikes(dislikes - 1);
      setIsDisliked(false);
      onVote?.(comment.id, 1);
    } else {
      setDislikes(dislikes + 1);
      setIsDisliked(true);
      onVote?.(comment.id, -1);
      if (isLiked) {
        setLikes(likes - 1);
        setIsLiked(false);
        onVote?.(comment.id, -1);
      }
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    setSubmitting(true);
    try {
      await onReply(postId, comment.id, replyContent.trim());
      setReplyContent("");
      setShowReply(false);
      const result = await apiService.getForumPostComments(postId, 50, 0, undefined, comment.id);
      setReplies(Array.isArray(result) ? result : result.comments || []);
      setShowReplies(true);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleReplies = async () => {
    if (showReplies) {
      setShowReplies(false);
      return;
    }
    setLoadingReplies(true);
    try {
      const result = await apiService.getForumPostComments(postId, 50, 0, undefined, comment.id);
      setReplies(Array.isArray(result) ? result : result.comments || []);
      setShowReplies(true);
    } catch {
    } finally {
      setLoadingReplies(false);
    }
  };

  const avatarLetter = (comment.user?.first_name?.[0] || comment.user_name?.[0] || "U").toUpperCase();
  const avatarUrl = comment.user?.image_url ? imageUrl(comment.user.image_url) : "";

  const replyCount = comment.reply_count || 0;

  return (
    <div className="text-xs">
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-200 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-slate-600">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            avatarLetter
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-bold text-slate-800 text-[11px] shrink-0">{comment.user_name}</span>
            {comment.parent_user_name && (
              <span className="text-[10px] text-slate-400 truncate">replying to <span className="font-semibold text-slate-600">@{comment.parent_user_name}</span></span>
            )}
            <span className="text-[10px] text-slate-400 shrink-0">{relativeTime(comment.created_at)}</span>
          </div>
          <p className="text-slate-700 mt-0.5 leading-relaxed">{comment.content}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex items-center gap-1">
              <button onClick={handleLike} className={`p-0.5 rounded transition ${isLiked ? "text-indigo-500" : "text-slate-400 hover:text-indigo-500"}`}>
                <ArrowUp size={12} />
              </button>
              <span className="text-[10px] font-bold text-slate-500 min-w-[12px] text-center">{likes}</span>
              <button onClick={handleDislike} className={`p-0.5 rounded transition ${isDisliked ? "text-red-500" : "text-slate-400 hover:text-red-500"}`}>
                <ArrowDown size={12} />
              </button>
            </div>
            <button onClick={() => setShowReply(!showReply)} className="text-[10px] font-bold text-slate-400 hover:text-[#0000ff]">
              Reply
            </button>
            <button className="text-[10px] font-bold text-slate-400 hover:text-[#0000ff]">
              Share
            </button>
          </div>
          {showReply && (
            <div className="mt-2 flex gap-2 items-center">
              <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-200 flex-shrink-0 flex items-center justify-center text-[8px] font-bold text-slate-600">
                {currentUser?.image_url ? (
                  <img src={imageUrl(currentUser.image_url)} alt="" className="w-full h-full object-cover" />
                ) : (
                  (currentUser?.first_name?.[0] || "U").toUpperCase()
                )}
              </div>
              <input
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 border border-slate-200 rounded-full px-2.5 py-1.5 text-xs outline-none focus:border-[#0000ff]"
                onKeyDown={(e) => e.key === "Enter" && handleReply()}
              />
              <button onClick={handleReply} disabled={submitting} className="text-[#0000ff] font-bold text-xs disabled:opacity-50">
                {submitting ? "..." : "Reply"}
              </button>
            </div>
          )}
          {replyCount > 0 && !showReplies && (
            <button
              onClick={toggleReplies}
              disabled={loadingReplies}
              className="mt-2 text-[11px] font-bold text-[#0000ff] hover:underline"
            >
              {loadingReplies ? "Loading..." : `Show ${replyCount} ${replyCount === 1 ? "reply" : "replies"}`}
            </button>
          )}
        </div>
      </div>
      {showReplies && replies.length > 0 && (
        <div className="ml-9 mt-2 space-y-3">
          {replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} postId={postId} onReply={onReply} onVote={onVote} currentUser={currentUser} />
          ))}
          <button
            onClick={() => setShowReplies(false)}
            className="text-[10px] font-bold text-slate-400 hover:text-[#0000ff]"
          >
            Hide replies
          </button>
        </div>
      )}
    </div>
  );
};

const CommentSection: React.FC<{
  postId: number;
  comments: CommentData[];
  totalCount?: number;
  user?: { first_name: string; last_name: string; image_url?: string } | null;
  onCommentAdded?: (postId: number) => void;
}> = ({ postId, comments, totalCount, user, onCommentAdded }) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState<"popular" | "newest">("newest");
  const [commentImage, setCommentImage] = useState<File | null>(null);
  const [commentImagePreview, setCommentImagePreview] = useState<string | null>(null);
  const commentImageRef = useRef<HTMLInputElement>(null);
  const token = apiService.getToken();
  const [voteCounts, setVoteCounts] = useState<Record<number, number>>({});

  const handleVote = (commentId: number, delta: number) => {
    setVoteCounts((prev) => ({ ...prev, [commentId]: (prev[commentId] || 0) + delta }));
  };

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCommentImage(file);
    setCommentImagePreview(URL.createObjectURL(file));
    if (commentImageRef.current) commentImageRef.current.value = "";
  };

  const removeCommentImage = () => {
    setCommentImage(null);
    setCommentImagePreview(null);
  };

  const handleAddComment = async () => {
    if (!token || ((!newComment.trim()) && !commentImage) || isSubmitting) return;
    setIsSubmitting(true);
    try {
      let img = "";
      if (commentImage) {
        const urls = await apiService.uploadForumMedia(token, [commentImage]);
        img = urls[0] || "";
      }
      await apiService.createForumComment(token, postId, {
        content: newComment.trim(),
        image_url: img || undefined,
      });
      setNewComment("");
      setCommentImage(null);
      setCommentImagePreview(null);
      if (onCommentAdded) {
        onCommentAdded(postId);
      }
    } catch (e) {
      console.error("Failed to post comment:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (pId: number, parentId: number, content: string) => {
    if (!token) return;
    try {
      await apiService.createForumComment(token, pId, { content, parent_id: parentId });
      if (onCommentAdded) {
        onCommentAdded(pId);
      }
    } catch (e) {
      console.error("Failed to post reply:", e);
    }
  };

  const avatarLetter = user ? (user.first_name?.[0] || "U").toUpperCase() : "U";
  const avatarUrl = user?.image_url ? imageUrl(user.image_url) : "";

  const commentCount = totalCount ?? (comments as CommentData[]).length;

  const sortedComments = useMemo(() => {
    if (!Array.isArray(comments)) return [];
    const arr = [...comments];
    if (sortBy === "newest") {
      arr.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else {
      arr.sort((a, b) => (voteCounts[b.id] || 0) - (voteCounts[a.id] || 0));
    }
    return arr;
  }, [comments, sortBy, voteCounts]);

  return (
    <div className="pt-3 space-y-3">
      <div className="flex gap-2 items-center">
        <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-200 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-slate-600">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            avatarLetter
          )}
        </div>
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:border-blue-500"
          onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
          disabled={isSubmitting}
        />
        <button
          onClick={handleAddComment}
          disabled={isSubmitting || !newComment.trim()}
          className="text-[#2563eb] disabled:text-gray-300 transition hover:scale-110"
        >
          {isSubmitting ? "..." : "Post"}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-600">{commentCount} {commentCount === 1 ? "Comment" : "Comments"}</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "popular" | "newest")}
          className="text-[11px] font-bold text-slate-500 bg-transparent border-none outline-none cursor-pointer"
        >
          <option value="popular">Popular</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      <div className="space-y-4">
        {sortedComments.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-2">No comments yet. Be the first!</p>
        ) : (
          sortedComments.map((c: CommentData) => (
            <CommentItem key={c.id} comment={c} postId={postId} onReply={handleReply} onVote={handleVote} currentUser={user} />
          ))
        )}
      </div>
    </div>
  );
};

const CreatePostModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    content: string;
    images: File[];
    video: File | null;
    poll: { question: string; options: PollOption[]; duration: string } | null;
    communityId: number;
  }) => Promise<void> | void;
  isSubmitting: boolean;
  user: { first_name: string; last_name: string; image_url?: string } | null;
  communities: ForumCommunity[];
  selectedCommunityId: number;
  onCommunityChange: (id: number) => void;
}> = ({ isOpen, onClose, onSubmit, isSubmitting, user, communities, selectedCommunityId, onCommunityChange }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [showPoll, setShowPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);
  const [pollDuration, setPollDuration] = useState("2 Weeks");
  const [error, setError] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const modalScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showPoll && modalScrollRef.current) {
      modalScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [showPoll]);

  const avatarLetter = user ? (user.first_name?.[0] || "U").toUpperCase() : "U";

  const reset = () => {
    setTitle("");
    setContent("");
    setImages([]);
    setImagePreviews([]);
    setVideo(null);
    setVideoPreview(null);
    setShowPoll(false);
    setPollQuestion("");
    setPollOptions(["", ""]);
    setPollDuration("2 Weeks");
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files);
    const total = [...images, ...newFiles].slice(0, 10);
    setImages(total);
    setImagePreviews(total.map((f) => URL.createObjectURL(f)));
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleVideoPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideo(file);
    setVideoPreview(URL.createObjectURL(file));
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const removeImage = (idx: number) => {
    setImages((p) => p.filter((_, i) => i !== idx));
    setImagePreviews((p) => p.filter((_, i) => i !== idx));
  };

  const removeVideo = () => {
    setVideo(null);
    setVideoPreview(null);
  };

  const addPollOption = () => {
    if (pollOptions.length >= 5) return;
    setPollOptions((p) => [...p, ""]);
  };

  const removePollOption = (idx: number) => {
    if (pollOptions.length <= 2) return;
    setPollOptions((p) => p.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (!selectedCommunityId) {
      setError("Please select a community before publishing.");
      return;
    }

    const hasPoll = showPoll && pollOptions.filter((o) => o.trim()).length >= 2;

    if (!title.trim() && !content.trim() && images.length === 0 && !video && !hasPoll) {
      setError("Please enter a title, post content, or add a poll.");
      return;
    }

    setError(null);

    const poll =
      showPoll && pollOptions.filter((o) => o.trim()).length >= 2
        ? {
            question: pollQuestion.trim() || "Poll",
            options: pollOptions
              .filter((o) => o.trim())
              .map((o) => ({ text: o.trim(), votes: 0 })),
            duration: pollDuration,
          }
        : null;
    await onSubmit({ title, content, images, video, poll, communityId: selectedCommunityId });
    reset();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[160] flex items-center justify-center bg-black/40 p-2 sm:p-4 backdrop-blur-sm pt-20 sm:pt-24"
      onClick={handleClose}
    >
      <div
        ref={modalScrollRef}
        className="relative w-full max-w-lg rounded-xl bg-white p-4 sm:p-6 shadow-none max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close form"
          className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-4 flex items-center space-x-3">
          {user?.image_url ? (
            <img
              src={imageUrl(user.image_url)}
              alt={user?.first_name}
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-slate-200 text-slate-600 font-semibold text-sm">
              {avatarLetter}
            </div>
          )}
          <div>
            <h2 className="text-lg font-bold leading-tight text-slate-800">
              {user ? `${user.first_name} ${user.last_name}` : "Guest"}
            </h2>
            <p className="text-sm text-slate-500">Student</p>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          {error && (
            <div className="mb-3 sm:mb-4 rounded-lg bg-red-50 p-2.5 sm:p-3 text-xs font-medium text-red-600">
              {error}
            </div>
          )}

          <div className="mb-3 sm:mb-4">
            <select
              value={selectedCommunityId || ""}
              onChange={(e) => {
                onCommunityChange(Number(e.target.value));
                if (error) setError(null);
              }}
              className="w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-slate-600 outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            >
              <option value="" disabled>
                Select a community
              </option>
              {communities.filter(c => c.is_member || c.is_general).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-4 sm:mb-6 space-y-2">
            <input
              type="text"
              placeholder="Post title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              className="w-full bg-transparent text-base sm:text-lg font-semibold text-slate-800 placeholder-slate-400 outline-none"
            />
            <textarea
              placeholder="Tell others about yourself..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="h-20 sm:h-28 w-full resize-none bg-transparent text-slate-700 placeholder-slate-400 outline-none"
            />
          </div>

          <div className="mb-3 sm:mb-4 space-y-3">
            {imagePreviews.length > 0 && (
              <div className="grid gap-2 grid-cols-2 sm:grid-cols-2">
                {imagePreviews.map((url, i) => (
                  <div key={i} className="relative rounded-xl overflow-hidden border border-gray-100 shadow-none bg-gray-50 group">
                    <img src={imageUrl(url)} alt={`Preview ${i + 1}`} className="w-full h-24 sm:h-32 object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-none backdrop-blur-sm"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {videoPreview && (
              <div className="relative rounded-xl overflow-hidden border border-gray-100 shadow-none bg-black">
                <video src={videoPreview} controls className="w-full max-h-[160px] sm:max-h-[200px] object-contain" />
                <button
                  type="button"
                  onClick={removeVideo}
                  className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-none backdrop-blur-sm z-10"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {showPoll && (
              <div className="space-y-3 bg-slate-50 rounded-xl p-3 sm:p-4 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Create a poll</span>
                  <button
                    type="button"
                    onClick={() => setShowPoll(false)}
                    className="text-[10px] font-bold text-slate-400 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
                <textarea
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  placeholder="Ask a question..."
                  className="w-full border border-slate-200 rounded-lg p-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-600 outline-none transition-all resize-y min-h-[60px]"
                />
                <div className="flex flex-col gap-2">
                  {pollOptions.map((opt, i) => (
                    <div key={i} className="relative">
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) =>
                          setPollOptions((p) => p.map((o, idx) => (idx === i ? e.target.value : o)))
                        }
                        placeholder={`Option ${i + 1}`}
                        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 pr-10 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-600 outline-none transition-all"
                      />
                      {pollOptions.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removePollOption(i)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-slate-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {pollOptions.length < 5 && (
                  <button
                    type="button"
                    onClick={addPollOption}
                    className="text-blue-600 font-semibold text-sm flex items-center gap-1.5 hover:underline"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add option
                  </button>
                )}
                <div className="relative border border-slate-200 rounded-lg px-3.5 py-3 focus-within:border-blue-600 transition-all">
                  <label className="absolute -top-2.5 left-3 bg-slate-50 px-1 text-[11px] font-semibold text-slate-400">
                    Poll Duration
                  </label>
                  <select
                    value={pollDuration}
                    onChange={(e) => setPollDuration(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-slate-800 text-sm cursor-pointer font-medium"
                  >
                    <option value="1 Day">1 Day</option>
                    <option value="3 Days">3 Days</option>
                    <option value="1 Week">1 Week</option>
                    <option value="2 Weeks">2 Weeks</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <hr className="mb-3 sm:mb-4 border-slate-200" />

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex space-x-1 sm:space-x-2 text-xs sm:text-sm font-medium text-slate-700">
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className={`flex items-center space-x-1 sm:space-x-1.5 rounded-lg px-2 sm:px-3 py-1.5 transition-colors ${
                  images.length > 0
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-slate-100 hover:text-blue-600"
                }`}
              >
                <Image className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Image</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPoll((p) => !p)}
                className={`flex items-center space-x-1 sm:space-x-1.5 rounded-lg px-2 sm:px-3 py-1.5 transition-colors ${
                  showPoll
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-slate-100 hover:text-blue-600"
                }`}
              >
                <BarChart2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Poll</span>
              </button>

              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                className={`flex items-center space-x-1 sm:space-x-1.5 rounded-lg px-2 sm:px-3 py-1.5 transition-colors ${
                  video
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-slate-100 hover:text-blue-600"
                }`}
              >
                <Video className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Video</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-blue-600 px-5 sm:px-6 py-2 font-semibold text-sm sm:text-base text-white shadow-none transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 active:scale-95 disabled:opacity-50 w-full sm:w-auto"
            >
              {isSubmitting ? "Publishing..." : "Publish"}
            </button>
          </div>
        </form>

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImagePick}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleVideoPick}
        />
      </div>
    </div>
  );
};

/* ── lightbox ─────────────────────────────────────────────────────────── */

const Lightbox: React.FC<{
  url: string | null;
  type: "image" | "video";
  onClose: () => void;
}> = ({ url, type, onClose }) => {
  if (!url) return null;
  return (
    <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white p-2 z-10">
        <X className="h-7 w-7" />
      </button>
      {type === "image" ? (
        <img src={url} alt="" className="max-w-full max-h-[90vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
      ) : (
        <video src={url} controls autoPlay className="max-w-full max-h-[90vh] rounded-lg" onClick={(e) => e.stopPropagation()} />
      )}
    </div>
  );
};

/* ── toast ────────────────────────────────────────────────────────────── */

interface ToastItem {
  id: number;
  message: string;
}

const ToastContainer: React.FC<{
  toasts: ToastItem[];
}> = ({ toasts }) => {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed top-16 sm:top-20 right-4 z-[130] flex flex-col gap-2 items-end pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="bg-white text-black px-4 py-2.5 rounded-md text-sm font-medium shadow-lg border border-gray-200 flex items-center gap-2 animate-in fade-in slide-in-from-top duration-300"
        >
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
};

/* ── main page ────────────────────────────────────────────────────────── */

const CampusForumPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [communities, setCommunities] = useState<ForumCommunity[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCommunityId, setSelectedCommunityId] = useState<number | null>(null);
  const [joinLoading, setJoinLoading] = useState<Record<number, boolean>>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastIdRef = useRef(0);
  const [openComments, setOpenComments] = useState<Record<number, boolean>>({});
  const [commentsData, setCommentsData] = useState<Record<number, CommentData[]>>({});
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [lightboxType, setLightboxType] = useState<"image" | "video">("image");
  const [sharePost, setSharePost] = useState<ForumPost | null>(null);
  const [reportPostId, setReportPostId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const token = apiService.getToken();

  const showToast = useCallback((message: string) => {
    const id = ++toastIdRef.current;
    setToasts((p) => [...p, { id, message }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000);
  }, []);

  const fetchCommunities = useCallback(async () => {
    try {
      const data = await apiService.getForumCommunities(token || undefined);
      setCommunities(isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchPosts = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    if (append) setLoadingMore(true);
    else setIsLoading(true);
    try {
      const data = await apiService.getForumPosts(20, token || undefined, selectedCommunityId || undefined, pageNum);
      const result = data as any;
      const list: ForumPost[] = result?.posts || (isArray(result) ? result : []);
      const more = result?.has_more ?? false;
      if (!selectedCommunityId) {
        const joinedIds = communities.filter((c) => c.is_member).map((c) => c.id);
        const generalId = communities.find((c) => c.is_general)?.id;
        const userId = user?.id;
        const filtered = list.filter((p) =>
          joinedIds.includes(p.community_id) || p.community_id === generalId || (userId && p.user_id === userId)
        );
        setPosts((prev) => append ? [...prev, ...filtered] : filtered);
      } else {
        setPosts((prev) => append ? [...prev, ...list] : list);
      }
      setHasMore(more);
      setPage(pageNum);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  }, [token, selectedCommunityId, communities, user]);

  const fetchTrending = useCallback(async () => {
    try {
      const data = await apiService.getTrendingForumPosts();
      setTrending(isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchCommunities();
    fetchTrending();
  }, [fetchCommunities, fetchTrending]);

  useEffect(() => {
    fetchPosts(1, false);
  }, [fetchPosts]);

  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || loadingMore || isLoading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          fetchPosts(page + 1, true);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, isLoading, page, fetchPosts]);

  const handleCommunityClick = (id: number) => {
    router.push(`/campus-forum/${id}`);
  };

  const handleJoinToggle = async (communityId: number) => {
    if (!isAuthenticated || !token) {
      showToast("Please login to join communities");
      return;
    }
    const community = communities.find((c) => c.id === communityId);
    if (community?.is_member && !window.confirm(`Leave "${community.name}"? You won't see its posts in your feed anymore.`)) {
      return;
    }
    setJoinLoading((p) => ({ ...p, [communityId]: true }));
    try {
      const updated = await apiService.joinForumCommunity(token, communityId);
      setCommunities((prev) =>
        prev.map((c) =>
          c.id === communityId
            ? { ...c, is_member: updated.is_member, member_count: updated.member_count }
            : c
        )
      );
    } catch (e: any) {
      showToast(e?.message || "Failed to update membership");
    } finally {
      setJoinLoading((p) => ({ ...p, [communityId]: false }));
    }
  };

  const handleCreatePostClick = () => {
    if (!isAuthenticated) {
      showToast("Please login to create a post");
      return;
    }
    setIsCreateModalOpen(true);
  };

  const handleSubmitPost = async (data: {
    title: string;
    content: string;
    images: File[];
    video: File | null;
    poll: { question: string; options: PollOption[]; duration: string } | null;
    communityId: number;
  }) => {
    if (!data.title.trim() && !data.content.trim() && data.images.length === 0 && !data.video && !data.poll) {
      showToast("Please add a title, content, or media");
      return;
    }
    if (data.images.length > 10) {
      showToast("Max 10 images");
      return;
    }
    if (data.video && data.video.size > 50 * 1024 * 1024) {
      showToast("Video must be under 50MB");
      return;
    }
    if (!token) {
      showToast("Please login to post");
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrlValue: string | undefined;
      let videoUrlValue: string | undefined;

      if (data.images.length > 0) {
        const urls = await apiService.uploadForumMedia(token, data.images);
        imageUrlValue = urls.length === 1 ? urls[0] : JSON.stringify(urls);
      }

      if (data.video) {
        const urls = await apiService.uploadForumMedia(token, [data.video]);
        videoUrlValue = urls[0];
      }

      const pollItems = data.poll ? data.poll.options.map((o) => o.text) : [];

      const newPost = await apiService.createForumPost(token, {
        community_id: data.communityId || selectedCommunityId || communities.find((c) => c.is_general)?.id || communities[0]?.id || 0,
        category: "General",
        title: data.title || "Untitled",
        content: data.content,
        poll_options: pollItems.length > 1 ? pollItems : undefined,
        is_poll: pollItems.length > 1,
        image_url: imageUrlValue,
        video_url: videoUrlValue,
      });

      setPosts((p) => [newPost, ...p]);
      showToast("Post published successfully!");
      setIsCreateModalOpen(false);
    } catch (e: any) {
      showToast(e?.message || "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (postId: number) => {
    if (!isAuthenticated || !token) {
      showToast("Please login to like posts");
      return;
    }
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
    if (!isAuthenticated || !token) {
      showToast("Please login to dislike posts");
      return;
    }
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

  const handleShare = (post: ForumPost) => {
    setSharePost(post);
  };

  const handleCommentClick = async (postId: number) => {
    const isOpen = openComments[postId];
    if (isOpen) {
      setOpenComments((p) => ({ ...p, [postId]: false }));
    } else {
      setOpenComments((p) => ({ ...p, [postId]: true }));
      try {
        const raw = await apiService.getForumPostComments(postId, 50, 0);
        const cmts = Array.isArray(raw?.comments) ? raw.comments : Array.isArray(raw) ? raw : [];
        setCommentsData((p) => ({ ...p, [postId]: cmts }));
      } catch {}
    }
  };

  const handleCommentAdded = async (postId: number) => {
    try {
      const raw = await apiService.getForumPostComments(postId, 50, 0);
      const cmts = Array.isArray(raw?.comments) ? raw.comments : Array.isArray(raw) ? raw : [];
      setCommentsData((p) => ({ ...p, [postId]: cmts }));
      setPosts((p) => p.map((post) => post.id === postId ? { ...post, comment_count: (post.comment_count || 0) + 1 } : post));
    } catch {}
  };

  const handleLightbox = (url: string, type: "image" | "video") => {
    setLightboxUrl(url);
    setLightboxType(type);
  };

  const handleNotInterested = async (postId: number) => {
    setPosts((p) => p.filter((post) => post.id !== postId));
    showToast("Post hidden from your feed");
    if (token) {
      try {
        await apiService.notInterestedForumPost(token, postId);
      } catch {}
    }
  };

  const handlePollVote = async (postId: number, optionIdx: number) => {
    if (!isAuthenticated) {
      showToast("Please login to vote");
      return;
    }
    try {
      const updated = await apiService.voteForumPoll(token!, postId, optionIdx);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, ...updated } : p)),
      );
    } catch {
      showToast("Failed to vote");
    }
  };

  const handleReport = (postId: number) => {
    setReportPostId(postId);
  };

  const handleReportSubmit = async (data: { reasons: string[]; otherText: string }) => {
    if (!token || !reportPostId) return;
    try {
      await apiService.reportForumPost(token, reportPostId, data.reasons, data.otherText);
      showToast("Report submitted. Thank you for your feedback.");
    } catch {
      showToast("Failed to submit report");
    }
  };

  const selectedCommunity = communities.find((c) => c.id === selectedCommunityId);

  return (
    <div className="min-h-screen bg-white text-slate-800 antialiased py-6">
      <main className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8">
          {/* ── LEFT SIDEBAR (desktop only) ── */}
          <aside className="hidden lg:block lg:col-span-3 space-y-5 order-1 sticky top-6 h-fit self-start">
            <div className="bg-white rounded-lg p-5 sm:p-6 sm:border sm:border-slate-200/80">
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-sm sm:text-xs font-extrabold text-gray-900 tracking-wider uppercase">
                  Discover Communities
                </h3>
                <button
                  onClick={() => router.push("/campus-forum/communities")}
                  className="text-blue-600 font-semibold text-sm sm:text-xs hover:underline"
                >
                  View all
                </button>
              </div>

              {/* Mobile: Horizontal scrollable cards */}
              <div className="flex overflow-x-auto gap-3 sm:hidden no-scrollbar scroll-smooth pb-1">
                {communities.filter((c) => !c.is_general).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleCommunityClick(item.id)}
                    className="flex-shrink-0 w-[145px] border border-gray-200 rounded-xl p-3 flex flex-col items-center justify-between text-center bg-white cursor-pointer"
                  >
                    <div
                      className={`w-14 h-14 mb-2 rounded-lg flex items-center justify-center text-sm font-semibold flex-shrink-0 transition-transform group-hover:scale-105 ${
                        item.bg_color || "bg-blue-100/70"
                      }`}
                    >
                      {item.icon ? (
                        <DynamicIcon name={item.icon} size={24} />
                      ) : (
                        <span className="text-xl">🎓</span>
                      )}
                    </div>

                    <div className="mb-3 w-full">
                      <p
                        className={`font-semibold text-sm leading-tight truncate max-w-[120px] mx-auto transition-colors ${
                          selectedCommunityId === item.id
                            ? "text-blue-600"
                            : "text-gray-900"
                        }`}
                        title={item.name}
                      >
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.member_count ?? 0} members
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJoinToggle(item.id);
                      }}
                      disabled={joinLoading[item.id]}
                      className={`w-full font-medium py-2 text-sm rounded-full transition-all active:scale-95 ${
                        item.is_member
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white"
                      }`}
                    >
                      {joinLoading[item.id] ? "..." : item.is_member ? "Joined" : "Join"}
                    </button>
                  </div>
                ))}
              </div>

              {/* Desktop: Vertical list */}
              <div className="hidden sm:block space-y-3.5">
                {communities.filter((c) => !c.is_general).map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-1 group">
                    <div
                      className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                      onClick={() => handleCommunityClick(item.id)}
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
                        <p
                          className={`text-xs font-bold truncate leading-snug transition-colors ${
                            selectedCommunityId === item.id
                              ? "text-blue-600"
                              : "text-slate-800 group-hover:text-blue-600"
                          }`}
                          title={item.name}
                        >
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
                        handleJoinToggle(item.id);
                      }}
                      disabled={joinLoading[item.id]}
                      className={`ml-2 px-4 py-1.5 text-xs font-bold rounded-full transition-all flex-shrink-0 ${
                        item.is_member
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-[#0000ff] hover:opacity-90 text-white active:scale-95"
                      }`}
                    >
                      {joinLoading[item.id] ? "..." : item.is_member ? "Joined" : "Join"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* ── MIDDLE ── */}
          <section className="lg:col-span-6 space-y-5 order-3 lg:order-2">
            {/* Create Post Widget */}
            <div className="bg-white rounded-lg p-4 border border-slate-200/80 input-glow transition-all w-full">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold overflow-hidden">
                  {user?.image_url ? (
                    <img src={imageUrl(user.image_url)} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (user?.first_name?.[0] || "🎓").toUpperCase()
                  )}
                </div>
                <input
                  type="text"
                  readOnly
                  onClick={handleCreatePostClick}
                  placeholder="Ask about courses, colleges, or exams..."
                  className="w-full bg-transparent text-slate-700 placeholder-slate-400 text-sm focus:outline-none font-medium cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-start gap-4 pt-3 px-1">
                <button
                  onClick={handleCreatePostClick}
                  className="flex items-center gap-2 text-slate-600 hover:text-[#0000ff] font-semibold text-xs transition-colors py-1 px-2.5 rounded-full hover:bg-blue-50/50"
                >
                  <Image className="h-[14px] w-[14px] text-blue-500" />
                  <span>Image</span>
                </button>
                <button
                  onClick={handleCreatePostClick}
                  className="flex items-center gap-2 text-slate-600 hover:text-[#0000ff] font-semibold text-xs transition-colors py-1 px-2.5 rounded-full hover:bg-purple-50/50"
                >
                  <BarChart2 className="h-[14px] w-[14px] text-purple-500" />
                  <span>Poll</span>
                </button>
                <button
                  onClick={handleCreatePostClick}
                  className="flex items-center gap-2 text-slate-600 hover:text-[#0000ff] font-semibold text-xs transition-colors py-1 px-2.5 rounded-full hover:bg-rose-50/50"
                >
                  <Video className="h-[14px] w-[14px] text-rose-500" />
                  <span>Video</span>
                </button>
              </div>
            </div>

            {/* Posts Feed */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0000ff] border-t-transparent" />
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-white rounded-lg border border-slate-200/80 p-12 text-center shadow-none flex flex-col items-center justify-center min-h-[320px]">
                <div className="w-14 h-14 rounded-full bg-blue-50 text-[#0000ff] flex items-center justify-center mb-4 text-2xl shadow-none">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                </div>
                <h3 className="text-slate-800 font-bold text-lg mb-1">
                  No posts yet in this community.
                </h3>
                <button
                  onClick={handleCreatePostClick}
                  className="text-[#0000ff] hover:underline font-bold text-sm transition-all focus:outline-none mt-1"
                >
                  Be the first to post!
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-5">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUser={user ? { first_name: user.first_name, last_name: user.last_name, image_url: user.image_url } : null}
                    onLike={handleLike}
                    onDislike={handleDislike}
                    onCommentClick={handleCommentClick}
                    onShare={handleShare}
                    onLightbox={handleLightbox}
                    comments={commentsData[post.id]}
                    commentsOpen={openComments[post.id]}
                    onJoinCommunity={handleJoinToggle}
                    onCommentAdded={handleCommentAdded}
                    onNotInterested={handleNotInterested}
                    onReport={handleReport}
                    onPollVote={handlePollVote}
                  />
                ))}

                {posts.length < 5 && communities.filter((c) => !c.is_general).length > 0 && (
                  <div className="bg-white rounded-lg p-4 border border-slate-200/80 col-span-full">
                    <div className="flex items-center justify-between mb-3 px-1">
                      <h3 className="text-xs font-extrabold text-gray-900 tracking-wider uppercase">Discover Communities</h3>
                      <button onClick={() => router.push("/campus-forum/communities")} className="text-blue-600 font-semibold text-xs hover:underline">View all</button>
                    </div>
                    <div className="flex overflow-x-auto gap-3 no-scrollbar scroll-smooth pb-1">
                      {communities.filter((c) => !c.is_general).slice(0, 4).map((item) => (
                        <div key={item.id} onClick={() => handleCommunityClick(item.id)} className="flex-shrink-0 w-[145px] border border-gray-200 rounded-xl p-3 flex flex-col items-center justify-between text-center bg-white cursor-pointer">
                          <div className={`w-14 h-14 mb-2 rounded-lg flex items-center justify-center text-sm font-semibold flex-shrink-0 ${item.bg_color || "bg-blue-100/70"}`}>
                            {item.icon ? <DynamicIcon name={item.icon} size={24} /> : <span className="text-xl">🎓</span>}
                          </div>
                          <div className="mb-3 w-full">
                            <p className="font-semibold text-sm leading-tight truncate max-w-[120px] mx-auto text-gray-900" title={item.name}>{item.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{item.member_count ?? 0} members</p>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); handleJoinToggle(item.id); }} disabled={joinLoading[item.id]} className={`w-full font-medium py-2 text-sm rounded-full transition-all active:scale-95 ${item.is_member ? "bg-green-600 hover:bg-green-700 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}>
                            {joinLoading[item.id] ? "..." : item.is_member ? "Joined" : "Join"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {posts.length > 5 && (
                  <div className="lg:hidden bg-white rounded-lg p-4 border border-slate-200/80">
                    <div className="flex items-center justify-between mb-3 px-1">
                      <h3 className="text-xs font-extrabold text-gray-900 tracking-wider uppercase">Discover Communities</h3>
                      <button onClick={() => router.push("/campus-forum/communities")} className="text-blue-600 font-semibold text-xs hover:underline">View all</button>
                    </div>
                    <div className="flex overflow-x-auto gap-3 no-scrollbar scroll-smooth pb-1">
                      {communities.filter((c) => !c.is_general).slice(0, 4).map((item) => (
                        <div key={item.id} onClick={() => handleCommunityClick(item.id)} className="flex-shrink-0 w-[145px] border border-gray-200 rounded-xl p-3 flex flex-col items-center justify-between text-center bg-white cursor-pointer">
                          <div className={`w-14 h-14 mb-2 rounded-lg flex items-center justify-center text-sm font-semibold flex-shrink-0 ${item.bg_color || "bg-blue-100/70"}`}>
                            {item.icon ? <DynamicIcon name={item.icon} size={24} /> : <span className="text-xl">🎓</span>}
                          </div>
                          <div className="mb-3 w-full">
                            <p className="font-semibold text-sm leading-tight truncate max-w-[120px] mx-auto text-gray-900" title={item.name}>{item.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{item.member_count ?? 0} members</p>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); handleJoinToggle(item.id); }} disabled={joinLoading[item.id]} className={`w-full font-medium py-2 text-sm rounded-full transition-all active:scale-95 ${item.is_member ? "bg-green-600 hover:bg-green-700 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}>
                            {joinLoading[item.id] ? "..." : item.is_member ? "Joined" : "Join"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {loadingMore && (
                  <div className="flex justify-center py-4">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                  </div>
                )}

                {hasMore && !loadingMore && <div ref={loadMoreRef} className="h-4" />}
              </div>
            )}
          </section>

          {/* ── RIGHT SIDEBAR ── */}
          <aside className="hidden sm:block lg:col-span-3 space-y-5 order-2 lg:order-3 sticky top-6 h-fit self-start">
            <div className="bg-white rounded-lg p-5 border border-slate-200/80 shadow-none">
              <div className="flex items-center gap-2 mb-4 px-1">
                <svg
                  className="h-4 w-4 text-amber-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A8 8 0 0117.657 18.657z" />
                  <path
                    fillRule="evenodd"
                    d="M10.5 20a.5.5 0 01-.5.5h-2a.5.5 0 01-.5-.5V19a.5.5 0 01.5-.5h.5v-1.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5V20z"
                    clipRule="evenodd"
                  />
                </svg>
                <h3 className="text-xs font-extrabold text-black tracking-wider uppercase">
                  Trending Discussions
                </h3>
              </div>

              <div className="space-y-4">
                {trending.length > 0 ? (
                  trending.map((item, idx) => (
                    <div key={item.id || idx}>
                      <div className="group cursor-pointer">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-relaxed">
                          {item.title || item.content?.slice(0, 80)}
                        </p>
                        <div className="flex items-center justify-between mt-2 text-[11px]">
                          <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
                            {item.category || item.community?.name || "General"}
                          </span>
                          <span className="text-slate-400 font-medium">
                            {item.comment_count || 0} Replies
                          </span>
                        </div>
                      </div>
                      {idx < trending.length - 1 && <hr className="mt-4 border-slate-100" />}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No trending discussions yet.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleSubmitPost}
        isSubmitting={isSubmitting}
        user={user ? { first_name: user.first_name, last_name: user.last_name, image_url: user.image_url } : null}
        communities={communities}
        selectedCommunityId={selectedCommunityId || communities.find((c) => c.is_general)?.id || 0}
        onCommunityChange={setSelectedCommunityId}
      />

      <Lightbox url={lightboxUrl} type={lightboxType} onClose={() => setLightboxUrl(null)} />

      <ShareCollegeModal
        isOpen={!!sharePost}
        onClose={() => setSharePost(null)}
        shareUrl={sharePost ? `${typeof window !== "undefined" ? window.location.origin : ""}/campus-forum?post=${sharePost.id}` : ""}
        shareTitle={sharePost?.title || "Campus Forum Post"}
        shareText={sharePost?.content?.slice(0, 200) || "Check out this post on Campus Forum"}
        collegeName={sharePost?.title || "Post"}
      />

      <ReportPostModal
        isOpen={reportPostId !== null}
        onClose={() => setReportPostId(null)}
        onSubmit={handleReportSubmit}
      />

      <ToastContainer toasts={toasts} />
    </div>
  );
};

export default CampusForumPage;
