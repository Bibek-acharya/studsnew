"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  ArrowRight,
  Image,
  BarChart2,
  Video,
  MoreVertical,
  Share,
  EyeOff,
  Flag,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Repeat,
  Share2,
  BadgeCheck,
  ChevronDown,
  Calendar,
  MapPin,
  X,
  CheckCircle,
} from "lucide-react";
import {
  apiService,
  ForumPost,
  ForumCommunity,
  ForumComment,
} from "@/services/api";
import { useAuth } from "@/services/AuthContext";

interface CommentProps {
  avatar: string;
  username: string;
  role?: string;
  isAuthor?: boolean;
  time: string;
  content: string;
  upvotes: number;
  replies?: CommentProps[];
}

function formatRelativeTime(dateStr: string): string {
  if (!dateStr) return "Recently";
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 0) return "Just now";
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getUserInitials(user?: {
  first_name?: string;
  last_name?: string;
}): string {
  if (!user) return "?";
  return (
    `${(user.first_name || "")[0] || ""}${(user.last_name || "")[0] || ""}`.toUpperCase() ||
    "?"
  );
}

function getAvatarFromName(name: string): string {
  const emojiMap: Record<string, string> = {
    engineering: "📐",
    it: "💻",
    medical: "🩺",
    kathmandu: "🏛️",
    tribhuvan: "🎒",
    exam: "📝",
    notice: "📢",
    general: "💬",
  };
  const key = Object.keys(emojiMap).find((k) => name.toLowerCase().includes(k));
  return emojiMap[key || "general"];
}

const CommentItem: React.FC<{ comment: CommentProps; depth?: number }> = ({
  comment,
  depth = 0,
}) => {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className="relative">
      <div
        className={`flex gap-3 relative z-10 bg-white ${depth > 0 ? "" : ""}`}
      >
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-sm">
          {comment.avatar}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between group/btn">
            <div>
              <div className="flex items-center gap-1.5 text-sm">
                <span className="font-semibold text-[#1B1F3B]">
                  {comment.username}
                </span>
                {comment.isAuthor && (
                  <span className="bg-gray-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    Author
                  </span>
                )}
                {comment.role && (
                  <span className="text-xs text-gray-400 font-medium">
                    {comment.role}
                  </span>
                )}
                <span className="text-gray-400 text-xs font-medium">
                  {comment.time}
                </span>
              </div>
            </div>
          </div>
          <p className="text-[15px] text-[#1B1F3B] mt-1.5 leading-relaxed">
            {comment.content}
          </p>
          <div className="flex items-center gap-4 mt-2 text-sm text-[#5C607A] font-semibold">
            <button className="hover:text-gray-800 transition">Reply</button>
          </div>
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <>
          <div className="absolute left-4 top-8 bottom-0 w-[2px] bg-gray-100 z-0" />
          <div className="pl-11 pt-4 relative z-10">
            {comment.replies.map((reply, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-7 top-4 w-6 h-[2px] bg-gray-100" />
                <CommentItem comment={reply} depth={depth + 1} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const PostCardComponent: React.FC<{
  post: ForumPost;
  onLike: (postId: number) => void;
  onDislike: (postId: number) => void;
  onCommentToggle: (postId: number) => void;
  onCommentSubmit: (postId: number, content: string) => void;
  isCommentsOpen: boolean;
  comments: ForumComment[];
  commentInput: string;
  setCommentInput: (postId: number, val: string) => void;
}> = ({
  post,
  onLike,
  onDislike,
  onCommentToggle,
  onCommentSubmit,
  isCommentsOpen,
  comments,
  commentInput,
  setCommentInput,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const community = post.community;
  const user = post.user;
  const communityName = community?.name || "General";
  const username = user ? `${user.first_name} ${user.last_name}` : "Anonymous";

  return (
    <div className="bg-white rounded-md border border-gray-100 p-4 sm:p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-md flex items-center justify-center text-white font-bold shrink-0"
            style={{ backgroundColor: community?.bg_color || "#6366f1" }}
          >
            {community?.emoji || communityName.substring(0, 3).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-sm">
                {communityName}
              </h3>
              <span className="text-xs text-gray-400 font-medium">
                • {formatRelativeTime(post.created_at)}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{username}</p>
          </div>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-gray-400 hover:bg-gray-100 p-1.5 rounded-full transition"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-100 z-50 py-2">
              <button className="w-full text-left px-4 py-2.5 text-[15px] font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition">
                <Share className="w-5 h-5 text-gray-400" /> Share via...
              </button>
              <button className="w-full text-left px-4 py-2.5 text-[15px] font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition">
                <EyeOff className="w-5 h-5 text-gray-400" /> Not interested
              </button>
              <button className="w-full text-left px-4 py-2.5 text-[15px] font-medium text-red-600 hover:bg-red-50 flex items-center gap-3 transition">
                <Flag className="w-5 h-5 text-red-500" /> Report
              </button>
            </div>
          )}
        </div>
      </div>

      <h2 className="font-bold text-gray-900 text-base mb-2">{post.title}</h2>
      <p className="text-sm text-gray-700 mb-3 leading-relaxed">
        {post.content}
      </p>

      {post.image_url && (
        <div className="rounded-md overflow-hidden border border-gray-100 bg-gray-50 h-48 md:h-64 relative">
          <img
            src={post.image_url}
            alt="Post"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex items-center flex-wrap gap-2 mt-4">
        <div className="flex items-center bg-[#F2F4F7] rounded-full">
          <button
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-l-full font-semibold text-[13px] transition ${post.is_liked ? "text-indigo-600 bg-indigo-50" : "text-[#5C607A] hover:bg-gray-200"}`}
          >
            <ArrowUp className="w-4 h-4" /> {post.upvotes}
          </button>
          <div className="w-px h-4 bg-gray-300" />
          <button
            onClick={() => onDislike(post.id)}
            className={`px-3.5 py-1.5 rounded-r-full font-semibold text-[13px] transition ${post.is_disliked ? "text-red-500 bg-red-50" : "text-[#5C607A] hover:bg-gray-200"}`}
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => onCommentToggle(post.id)}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-[#F2F4F7] hover:bg-gray-200 rounded-full text-[#5C607A] font-semibold text-[13px] transition"
        >
          <MessageSquare className="w-4 h-4 text-[#7A809D]" />{" "}
          {post.comment_count} Comment
        </button>

        <button className="flex items-center gap-1.5 px-4 py-1.5 bg-[#F2F4F7] hover:bg-gray-200 rounded-full text-[#5C607A] font-semibold text-[13px] transition">
          <Share2 className="w-4 h-4 text-[#7A809D]" /> Share
        </button>
      </div>

      {isCommentsOpen && (
        <div className="mt-4 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl shrink-0">✍️</span>
            <div className="flex-1 flex items-center justify-between border border-gray-300 rounded-full px-4 py-2 bg-white">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(post.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && commentInput.trim()) {
                    onCommentSubmit(post.id, commentInput.trim());
                  }
                }}
                placeholder="Add a comment..."
                className="bg-transparent outline-none w-full text-sm text-gray-700 placeholder-gray-400 font-medium"
              />
            </div>
          </div>

          <div className="flex justify-between items-center mb-5 text-sm">
            <h3 className="font-semibold text-gray-800">Comments</h3>
          </div>

          <div className="space-y-6">
            {comments.map((c) => (
              <CommentItem
                key={c.id}
                comment={{
                  avatar: getUserInitials(c.user) || "💬",
                  username: `${c.user.first_name} ${c.user.last_name}`,
                  time: formatRelativeTime(c.created_at),
                  content: c.content,
                  upvotes: 0,
                  replies: c.replies?.map((r) => ({
                    avatar: getUserInitials(r.user) || "💬",
                    username: `${r.user.first_name} ${r.user.last_name}`,
                    time: formatRelativeTime(r.created_at),
                    content: r.content,
                    upvotes: 0,
                  })),
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PollPostComponent: React.FC<{
  post: ForumPost;
  onVote: (postId: number, optionIdx: number) => void;
}> = ({ post, onVote }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const community = post.community;
  const user = post.user;
  const communityName = community?.name || "General";
  const username = user ? `${user.first_name} ${user.last_name}` : "Anonymous";

  let pollOptions: { label: string; percentage: number }[] = [];
  try {
    const rawOptions = post.poll_options ? JSON.parse(post.poll_options) : [];
    const results = post.poll_results || {};
    const totalVotes = post.total_votes || 0;
    pollOptions = rawOptions.map((opt: string, idx: number) => ({
      label: opt,
      percentage:
        totalVotes > 0
          ? Math.round(((results[idx] || 0) / totalVotes) * 100)
          : 0,
    }));
  } catch {}

  return (
    <div className="bg-white rounded-md border border-gray-100 p-4 sm:p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-md flex items-center justify-center text-white font-bold shrink-0"
            style={{ backgroundColor: community?.bg_color || "#6366f1" }}
          >
            {community?.emoji || communityName.substring(0, 3).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-sm">
                {communityName}
              </h3>
              <span className="text-xs text-gray-400 font-medium">
                • {formatRelativeTime(post.created_at)}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{username}</p>
          </div>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-gray-400 hover:bg-gray-100 p-1.5 rounded-full transition"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-100 z-50 py-2">
              <button className="w-full text-left px-4 py-2.5 text-[15px] font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition">
                <Share className="w-5 h-5 text-gray-400" /> Share via...
              </button>
              <button className="w-full text-left px-4 py-2.5 text-[15px] font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition">
                <EyeOff className="w-5 h-5 text-gray-400" /> Not interested
              </button>
              <button className="w-full text-left px-4 py-2.5 text-[15px] font-medium text-red-600 hover:bg-red-50 flex items-center gap-3 transition">
                <Flag className="w-5 h-5 text-red-500" /> Report
              </button>
            </div>
          )}
        </div>
      </div>

      <h2 className="font-bold text-gray-900 text-base mb-2">{post.title}</h2>
      <p className="text-sm text-gray-700 mb-4">{post.content}</p>

      <div className="space-y-2">
        {pollOptions.map((option, idx) => {
          const hasVoted =
            post.voted_option !== undefined && post.voted_option !== null;
          const isSelected = post.voted_option === idx;
          return (
            <div
              key={idx}
              onClick={() => !hasVoted && onVote(post.id, idx)}
              className={`relative border rounded-md p-3 overflow-hidden transition ${hasVoted ? (isSelected ? "border-indigo-300 bg-indigo-50" : "border-gray-200") : "bg-gray-50 border-gray-200 hover:bg-gray-100 cursor-pointer"}`}
            >
              <div
                className="absolute left-0 top-0 bottom-0 bg-blue-100 z-0 rounded-l-lg"
                style={{ width: `${option.percentage}%` }}
              />
              <div className="relative z-10 flex justify-between text-sm font-medium text-gray-700">
                <span className="flex items-center gap-2">
                  {isSelected && (
                    <CheckCircle className="w-4 h-4 text-indigo-600" />
                  )}
                  {option.label}
                </span>
                <span>{option.percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-xs text-gray-500 mt-3 font-medium">
        {post.total_votes || 0} votes
      </div>

      <div className="flex items-center flex-wrap gap-2 mt-4">
        <div className="flex items-center bg-[#F2F4F7] rounded-full">
          <button className="flex items-center gap-1.5 px-3.5 py-1.5 text-[#5C607A] hover:bg-gray-200 rounded-l-full font-semibold text-[13px] transition">
            <ArrowUp className="w-4 h-4" /> {post.upvotes}
          </button>
          <div className="w-px h-4 bg-gray-300" />
          <button className="px-3.5 py-1.5 text-[#5C607A] hover:bg-gray-200 rounded-r-full transition">
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>

        <button className="flex items-center gap-1.5 px-4 py-1.5 bg-[#F2F4F7] hover:bg-gray-200 rounded-full text-[#5C607A] font-semibold text-[13px] transition">
          <MessageSquare className="w-4 h-4 text-[#7A809D]" />{" "}
          {post.comment_count} Comment
        </button>
      </div>
    </div>
  );
};

const CampusFeedPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [communities, setCommunities] = useState<ForumCommunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCommunityId, setSelectedCommunityId] = useState<number | null>(
    null,
  );

  const [openComments, setOpenComments] = useState<Record<number, boolean>>({});
  const [commentsMap, setCommentsMap] = useState<
    Record<number, ForumComment[]>
  >({});
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>(
    {},
  );
  const [isCommentsLoading, setIsCommentsLoading] = useState<
    Record<number, boolean>
  >({});

  const [toasts, setToasts] = useState<
    { id: number; message: string; type: "success" | "error" | "info" }[]
  >([]);
  const toastIdRef = useRef(0);

  const addToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "info") => {
      const id = ++toastIdRef.current;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(
        () => setToasts((prev) => prev.filter((t) => t.id !== id)),
        3500,
      );
    },
    [],
  );

  const token = apiService.getToken();

  useEffect(() => {
    apiService
      .getForumCommunities(token || undefined)
      .then((comms) => {
        if (comms) setCommunities(comms);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setPosts([]);
    apiService
      .getForumPosts(
        20,
        token || undefined,
        selectedCommunityId || undefined,
        1,
      )
      .then((result) => {
        setPosts(result.posts || []);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [selectedCommunityId]);

  const handleLike = async (postId: number) => {
    if (!isAuthenticated) {
      addToast("Please login to vote", "info");
      return;
    }
    try {
      const result = await apiService.likeForumPost(token!, postId);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                upvotes: result.upvotes,
                is_liked: result.is_liked,
                is_disliked: result.is_disliked,
              }
            : p,
        ),
      );
    } catch {
      addToast("Failed to vote", "error");
    }
  };

  const handleDislike = async (postId: number) => {
    if (!isAuthenticated) {
      addToast("Please login to vote", "info");
      return;
    }
    try {
      const result = await apiService.dislikeForumPost(token!, postId);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                downvotes: result.downvotes,
                is_liked: result.is_liked,
                is_disliked: result.is_disliked,
              }
            : p,
        ),
      );
    } catch {
      addToast("Failed to vote", "error");
    }
  };

  const handleCommentToggle = async (postId: number) => {
    const willOpen = !openComments[postId];
    setOpenComments((prev) => ({ ...prev, [postId]: willOpen }));
    if (willOpen && !commentsMap[postId]) {
      setIsCommentsLoading((prev) => ({ ...prev, [postId]: true }));
      try {
        const result = await apiService.getForumPostComments(postId);
        setCommentsMap((prev) => ({
          ...prev,
          [postId]: result.comments || [],
        }));
      } catch {
        addToast("Failed to load comments", "error");
      } finally {
        setIsCommentsLoading((prev) => ({ ...prev, [postId]: false }));
      }
    }
  };

  const handleCommentSubmit = async (postId: number, content: string) => {
    if (!isAuthenticated) {
      addToast("Please login to comment", "info");
      return;
    }
    if (!content.trim()) return;
    try {
      const newComment = await apiService.createForumComment(token!, postId, {
        content,
      });
      setCommentsMap((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment],
      }));
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, comment_count: p.comment_count + 1 } : p,
        ),
      );
    } catch {
      addToast("Failed to post comment", "error");
    }
  };

  const handlePollVote = async (postId: number, optionIdx: number) => {
    if (!isAuthenticated) {
      addToast("Please login to vote", "info");
      return;
    }
    try {
      const updated = await apiService.voteForumPoll(token!, postId, optionIdx);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, ...updated } : p)),
      );
    } catch {
      addToast("Failed to vote", "error");
    }
  };

  const regularPosts = posts.filter((p) => !p.is_poll);
  const pollPosts = posts.filter((p) => p.is_poll);

  return (
    <div className="min-h-screen bg-[#F8F9FA] antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6 justify-center w-full">
        {/* ================= LEFT SIDEBAR ================= */}
        <div className="hidden lg:block w-[280px] shrink-0 space-y-6 sticky top-6 h-fit">
          {/* Profile Card */}
          <div className="bg-white rounded-md border border-gray-100 p-5 flex flex-col items-center text-center">
            <div className="relative w-20 h-20 rounded-full overflow-hidden mb-3 bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-500">
              {user ? getUserInitials(user) : "👤"}
            </div>
            <h2 className="font-bold text-gray-900 text-lg">
              {user ? `${user.first_name} ${user.last_name}` : "Guest User"}
            </h2>
            {!user && (
              <a
                href="/login"
                className="text-blue-600 text-sm font-medium mt-1 hover:underline"
              >
                Log in to your account
              </a>
            )}
          </div>

          {/* Student Communities */}
          <div className="bg-white rounded-md border border-gray-100 p-5">
            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">
              Student Communities
            </h3>
            <div className="space-y-4">
              <button
                onClick={() => setSelectedCommunityId(null)}
                className={`flex items-center gap-3 group w-full text-left ${!selectedCommunityId ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
              >
                <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center shrink-0 text-lg">
                  🌐
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition">
                  All Communities
                </span>
              </button>
              {communities.map((comm) => (
                <button
                  key={comm.id}
                  onClick={() => setSelectedCommunityId(comm.id)}
                  className={`flex items-center gap-3 group w-full text-left ${selectedCommunityId === comm.id ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
                >
                  <div
                    className="w-10 h-10 rounded-md flex items-center justify-center shrink-0 text-lg"
                    style={{ backgroundColor: comm.bg_color || "#f3f4f6" }}
                  >
                    <span>{comm.emoji || getAvatarFromName(comm.name)}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition block truncate">
                      {comm.name}
                    </span>
                    {comm.member_count !== undefined && (
                      <span className="text-[11px] text-gray-400">
                        {comm.member_count} members
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ================= MAIN FEED ================= */}
        <div className="w-full max-w-[600px] space-y-4">
          {/* Create Post Box */}
          <div className="bg-white rounded-md border border-gray-100 p-4">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl shrink-0">🎓</span>
              <input
                type="text"
                placeholder="Ask anonymously about courses, colleges, or entrance exams..."
                className="bg-transparent border-none w-full text-sm outline-none text-gray-700 placeholder-gray-400 font-medium"
              />
            </div>
            <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
              <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition">
                <Image className="w-4 h-4 text-blue-500" /> Image
              </button>
              <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-purple-600 transition">
                <BarChart2 className="w-4 h-4 text-purple-500" /> Poll
              </button>
              <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 transition">
                <Video className="w-4 h-4 text-red-500" /> Video
              </button>
            </div>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="text-center py-8 text-gray-500 font-medium">
              Loading posts...
            </div>
          )}

          {/* No posts */}
          {!isLoading && posts.length === 0 && (
            <div className="bg-white rounded-md border border-gray-100 p-8 text-center">
              <p className="text-gray-500 font-medium">
                No posts yet. Be the first to share!
              </p>
            </div>
          )}

          {/* Regular Posts */}
          {regularPosts.map((post) => (
            <PostCardComponent
              key={post.id}
              post={post}
              onLike={handleLike}
              onDislike={handleDislike}
              onCommentToggle={handleCommentToggle}
              onCommentSubmit={handleCommentSubmit}
              isCommentsOpen={!!openComments[post.id]}
              comments={commentsMap[post.id] || []}
              commentInput={commentInputs[post.id] || ""}
              setCommentInput={(postId, val) =>
                setCommentInputs((prev) => ({ ...prev, [postId]: val }))
              }
            />
          ))}

          {/* Poll Posts */}
          {pollPosts.map((post) => (
            <PollPostComponent
              key={post.id}
              post={post}
              onVote={handlePollVote}
            />
          ))}
        </div>

        {/* ================= RIGHT SIDEBAR ================= */}
        <div className="hidden xl:block w-[300px] shrink-0 space-y-6 sticky top-6 h-fit">
          {/* Trending Discussions */}
          <div className="bg-white rounded-md border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-orange-500 text-xl">🔥</span>
              <h3 className="font-bold text-gray-900 text-sm">
                Trending Discussions
              </h3>
            </div>
            <div className="space-y-4">
              {posts.slice(0, 3).map((post) => (
                <div key={post.id}>
                  <h4 className="font-bold text-gray-800 text-sm leading-snug cursor-pointer hover:text-blue-600 transition">
                    {post.title}
                  </h4>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">
                      {post.community?.name || "General"}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MessageSquare className="w-3 h-3" /> {post.comment_count}{" "}
                      Replies
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-md border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-900 text-sm">
                Upcoming Events
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3 items-center">
                <div className="bg-blue-50 border border-blue-100 rounded-md p-2 text-center min-w-[3rem]">
                  <div className="text-blue-600 text-[10px] font-bold uppercase">
                    MAY
                  </div>
                  <div className="text-blue-900 font-bold text-lg leading-none mt-0.5">
                    15
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-800">
                    KU IT Meet 2024
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <MapPin className="w-3 h-3" /> Kathmandu University,
                    Dhulikhel
                  </div>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <div className="bg-orange-50 border border-orange-100 rounded-md p-2 text-center min-w-[3rem]">
                  <div className="text-orange-600 text-[10px] font-bold uppercase">
                    JUN
                  </div>
                  <div className="text-orange-900 font-bold text-lg leading-none mt-0.5">
                    10
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-800">
                    Locust Hackathon
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <MapPin className="w-3 h-3" /> Pulchowk Campus, Lalitpur
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast notifications */}
      {toasts.length > 0 && (
        <div className="fixed top-24 right-4 z-200 flex flex-col gap-3 w-80">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className="flex items-start gap-3 rounded-md border px-4 py-3 backdrop-blur-sm bg-white/95 shadow-lg"
            >
              <p className="flex-1 text-sm font-semibold text-gray-800">
                {toast.message}
              </p>
              <button
                onClick={() =>
                  setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                }
                className="text-gray-400 hover:text-gray-600 shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampusFeedPage;
