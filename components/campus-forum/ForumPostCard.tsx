"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ForumPost, ForumComment } from "@/services/api";
import { ArrowUp, ArrowDown, MessageSquare, MoreVertical, EyeOff, Flag, Share2 } from "lucide-react";

function parseImageUrls(rawUrl?: string): string[] {
  if (!rawUrl) return [];
  if (rawUrl.startsWith("[")) {
    try {
      const arr = JSON.parse(rawUrl);
      if (Array.isArray(arr)) return arr.filter(Boolean);
    } catch {
      // fall through
    }
  }
  return [rawUrl];
}

function formatRelativeTime(dateStr?: string): string {
  if (!dateStr) return "now";
  const date = new Date(dateStr);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSecs = Math.floor(diffInMs / 1000);

  if (diffInSecs < 60) return "now";
  const mins = Math.floor(diffInSecs / 60);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;
  const years = Math.floor(days / 365);
  return `${years}y`;
}

const ImageGrid: React.FC<{ urls: string[] }> = ({ urls }) => {
  if (urls.length === 0) return null;

  if (urls.length === 1) {
    return (
      <div className="mb-3 overflow-hidden rounded-md border border-gray-100">
        <img src={urls[0]} alt="Post" className="w-full max-h-80 object-cover" />
      </div>
    );
  }

  if (urls.length === 2) {
    return (
      <div className="mb-3 grid grid-cols-2 gap-1 overflow-hidden rounded-md">
        {urls.map((u, i) => (
          <img key={i} src={u} alt={`Post ${i + 1}`} className="h-52 w-full object-cover" />
        ))}
      </div>
    );
  }

  if (urls.length === 3) {
    return (
      <div className="mb-3 grid grid-cols-[1fr_1fr] gap-1 overflow-hidden rounded-md h-52">
        <img src={urls[0]} alt="Post 1" className="h-full w-full object-cover row-span-2" />
        <img src={urls[1]} alt="Post 2" className="h-[102px] w-full object-cover" />
        <img src={urls[2]} alt="Post 3" className="h-[102px] w-full object-cover" />
      </div>
    );
  }

  const visible = urls.slice(0, 4);
  const extra = urls.length - 4;
  return (
    <div className="mb-3 grid grid-cols-2 gap-1 overflow-hidden rounded-md">
      {visible.map((u, i) => (
        <div key={i} className="relative h-36">
          <img src={u} alt={`Post ${i + 1}`} className="h-full w-full object-cover" />
          {i === 3 && extra > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="text-2xl font-black text-white">+{extra}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

interface CommentItemProps {
  comment: ForumComment;
  postId: number;
  depth?: number;
  onReply: (comment: ForumComment) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, postId, depth = 0, onReply }) => {
  const [showReplies, setShowReplies] = useState(false);
  const replyCount = comment.replies?.length || 0;

  return (
    <div className="flex gap-2.5 items-start">
      <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-slate-100 border border-white ">
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user.first_name}`}
          className="h-full w-full object-cover"
          alt={comment.user.first_name}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="rounded-md bg-gray-50 px-4 py-2.5 group">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[12px] font-black text-gray-900 leading-none">
              {comment.user.first_name} {comment.user.last_name}
            </span>
            <span className="text-[10px] font-bold text-gray-400">
              {formatRelativeTime(comment.createdAt || comment.created_at)}
            </span>
          </div>
          <p className="text-[13px] font-medium leading-relaxed text-gray-700">{comment.content}</p>
        </div>

        <div className="mt-1.5 flex items-center gap-4 pl-2">
          <button
            onClick={() => onReply(comment)}
            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition"
          >
            Reply
          </button>
          {replyCount > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-700 transition"
            >
              <svg
                className={`h-3 w-3 transition-transform duration-200 ${showReplies ? "rotate-90" : ""}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
              {showReplies ? "Hide" : "View"} {replyCount} {replyCount === 1 ? "Reply" : "Replies"}
            </button>
          )}
        </div>

        {showReplies && replyCount > 0 && (
          <div className="mt-3 space-y-3 border-l-2 border-gray-100 pl-4">
            {comment.replies?.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                postId={postId}
                depth={depth + 1}
                onReply={onReply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface JoinButtonProps {
  communityId: number;
  isMember: boolean;
  isLoading: boolean;
  onToggle: (communityId: number) => void;
  size?: "sm" | "md";
}

const JoinButton: React.FC<JoinButtonProps> = ({ communityId, isMember, isLoading, onToggle, size = "sm" }) => {
  const base = size === "sm"
    ? "rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest transition-all "
    : "rounded-full border px-4 py-1.5 text-xs font-black uppercase tracking-widest transition-all ";

  const cls = isMember
    ? base + "border-gray-300 text-gray-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50"
    : base + "border-blue-500 text-blue-600 bg-blue-50 hover:bg-blue-100";

  return (
    <button
      onClick={(e) => { e.stopPropagation(); onToggle(communityId); }}
      disabled={isLoading}
      className={cls + " disabled:opacity-50"}
    >
      {isLoading ? "..." : isMember ? "Joined" : "Join"}
    </button>
  );
};

interface ForumPostCardProps {
  post: ForumPost;
  user: { id: number; first_name: string; last_name: string; role: string };
  isAuthenticated: boolean;
  openDropdown: number | null;
  openComments: Record<number, boolean>;
  commentsMap: Record<number, ForumComment[]>;
  totalCommentsMap: Record<number, number>;
  commentInputs: Record<number, string>;
  isCommentsLoading: Record<number, boolean>;
  replyingTo: Record<number, ForumComment | null>;
  joinLoading: Record<number, boolean>;
  onDropdownToggle: (id: number | null) => void;
  onEdit: (post: ForumPost) => void;
  onDelete: (id: number) => void;
  onShare: (id: number) => void;
  onNotInterested: (id: number) => void;
  onReport: (id: number) => void;
  onLike: (id: number) => void;
  onDislike: (id: number) => void;
  onPollVote: (postId: number, optionIdx: number) => void;
  onToggleComments: (id: number) => void;
  onCommentInputChange: (postId: number, value: string) => void;
  onCommentSubmit: (postId: number) => void;
  onSetReply: (postId: number, comment: ForumComment) => void;
  onCancelReply: (postId: number) => void;
  onLoadMoreComments: (postId: number) => void;
  onJoinToggle: (communityId: number) => void;
}

const ForumPostCard: React.FC<ForumPostCardProps> = ({
  post,
  user,
  isAuthenticated,
  openDropdown,
  openComments,
  commentsMap,
  totalCommentsMap,
  commentInputs,
  isCommentsLoading,
  replyingTo,
  joinLoading,
  onDropdownToggle,
  onEdit,
  onDelete,
  onShare,
  onNotInterested,
  onReport,
  onLike,
  onDislike,
  onPollVote,
  onToggleComments,
  onCommentInputChange,
  onCommentSubmit,
  onSetReply,
  onCancelReply,
  onLoadMoreComments,
  onJoinToggle,
}) => {
  const router = useRouter()
  const imageUrls = parseImageUrls(post.image_url);
  const postCommunityId = post.community_id ?? post.community?.id;
  const isPostCommunityMember = postCommunityId ? true : true;
  const userId = post.user?.id || post.user_id;

  return (
    <div className="rounded-md border border-gray-100 bg-white p-4  sm:p-5 overflow-hidden hover:border-gray-200 transition">

      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${post.community?.bg_color || "bg-blue-600"} text-lg`}>
            {post.community?.emoji || "✨"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-black text-gray-900 uppercase tracking-wide">{post.community?.name || "General"}</span>
              {postCommunityId && !isPostCommunityMember && (
                <JoinButton
                  communityId={postCommunityId}
                  isMember={isPostCommunityMember}
                  isLoading={!!joinLoading[postCommunityId]}
                  onToggle={onJoinToggle}
                  size="sm"
                />
              )}
              <span className="text-[11px] font-bold text-gray-400">• {formatRelativeTime(post.CreatedAt || post.created_at)}</span>
            </div>
            <p className="text-[11px] font-bold text-gray-500">{post.user?.first_name} {post.user?.last_name}</p>
          </div>
        </div>
        <div className="relative">
          <button onClick={() => onDropdownToggle(openDropdown === post.id ? null : post.id)} className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 transition">
            <MoreVertical className="h-5 w-5" />
          </button>
          {openDropdown === post.id && (
            <div className="absolute right-0 z-50 mt-1 w-56 rounded-md border border-gray-100 bg-white py-2 shadow-xl" onClick={(e) => e.stopPropagation()}>
              {isAuthenticated && user && post.user_id === user.id && (
                <>
                  <button
                    onClick={() => onEdit(post)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-bold text-gray-700 hover:bg-gray-50 transition"
                  >
                    <svg className="h-4 w-4 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit post
                  </button>
                  <button
                    onClick={() => onDelete(post.id)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-bold text-red-600 hover:bg-red-50 transition"
                  >
                    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete post
                  </button>
                  <div className="my-1 h-px bg-gray-100" />
                </>
              )}
              <button
                onClick={() => onShare(post.id)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-bold text-gray-700 hover:bg-gray-50 transition"
              >
                <Share2 className="h-4 w-4 text-blue-500 shrink-0" />
                Share via...
              </button>
              <button
                onClick={() => onNotInterested(post.id)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-bold text-gray-700 hover:bg-gray-50 transition"
              >
                <EyeOff className="h-4 w-4 text-gray-400 shrink-0" />
                Not interested
              </button>
              <div className="my-1 h-px bg-gray-100" />
              <button
                onClick={() => onReport(post.id)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-bold text-red-600 hover:bg-red-50 transition"
              >
                <Flag className="h-4 w-4 shrink-0" />
                Report post
              </button>
            </div>
          )}
        </div>
      </div>

      <h2 className="mb-2 text-base font-black leading-tight text-gray-900">{post.title}</h2>
      {post.content && <p className="mb-3 text-[14px] leading-relaxed text-gray-600">{post.content}</p>}

      <ImageGrid urls={imageUrls} />

      {post.video_url && (
        <div className="mb-3 overflow-hidden rounded-md border border-gray-100">
          <video
            src={post.video_url}
            controls
            className="w-full max-h-80 object-cover bg-black"
          />
        </div>
      )}

      {post.is_poll && post.poll_options && (() => {
        try {
          const options: string[] = JSON.parse(post.poll_options);
          const hasVoted = post.voted_option != null;
          return (
            <div className="mb-3 space-y-2">
              {options.map((option, index) => {
                const votes = post.poll_results?.[index] || 0;
                const pct = post.total_votes ? Math.round((votes / post.total_votes) * 100) : 0;
                const isSelected = post.voted_option === index;
                return (
                  <div
                    key={`${post.id}-p${index}`}
                    onClick={() => !isSelected && onPollVote(post.id, index)}
                    className={`relative cursor-pointer overflow-hidden rounded-md border p-3 transition-all duration-300 ${hasVoted
                        ? isSelected ? "border-blue-500 bg-blue-50" : "border-gray-100 bg-white"
                        : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                      }`}
                  >
                    {hasVoted && (
                      <div
                        className={`absolute left-0 top-0 bottom-0 transition-all duration-700 ease-out ${isSelected ? "bg-blue-100" : "bg-gray-100"}`}
                        style={{ width: `${pct}%` }}
                      />
                    )}
                    <div className="relative z-10 flex justify-between text-sm font-bold text-gray-700">
                      <div className="flex items-center gap-2">
                        <span>{option}</span>
                        {isSelected && (
                          <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      {hasVoted && <span>{pct}%</span>}
                    </div>
                  </div>
                );
              })}
              {post.total_votes != null && (
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{post.total_votes} votes · Click to change your vote</p>
              )}
            </div>
          );
        } catch {
          return null;
        }
      })()}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="flex items-center rounded-full bg-[#F2F4F7]">
          <button onClick={() => onLike(post.id)}
            className={`flex items-center gap-1.5 rounded-l-full px-3.5 py-1.5 text-[13px] font-black transition ${post.is_liked ? "text-indigo-600 bg-indigo-50" : "text-[#5C607A] hover:bg-gray-200"}`}>
            <ArrowUp className={`h-4 w-4 ${post.is_liked ? "fill-current" : ""}`} />
            {post.upvotes}
          </button>
          <div className="h-4 w-px bg-gray-300" />
          <button onClick={() => onDislike(post.id)}
            className={`rounded-r-full px-3.5 py-1.5 transition ${post.is_disliked ? "text-red-600 bg-red-50" : "text-[#5C607A] hover:bg-gray-200"}`}>
            <ArrowDown className={`h-4 w-4 ${post.is_disliked ? "fill-current" : ""}`} />
          </button>
        </div>

        <button onClick={() => onToggleComments(post.id)}
          className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-black transition ${openComments[post.id] ? "bg-blue-50 text-blue-600" : "bg-[#F2F4F7] text-[#5C607A] hover:bg-gray-200"}`}>
          <MessageSquare className="h-4 w-4" />
          {post.comment_count} {post.comment_count === 1 ? "Comment" : "Comments"}
        </button>
      </div>

      {openComments[post.id] && (
        <div className="mt-4 border-t border-gray-100 pt-4 space-y-4">

          {replyingTo[post.id] && (
            <div className="flex items-center justify-between rounded-md bg-blue-50 px-3 py-2 text-[11px] font-bold text-blue-600">
              <span>↩ Replying to <strong>{replyingTo[post.id]?.user.first_name}</strong></span>
              <button onClick={() => onCancelReply(post.id)}>✕ Cancel</button>
            </div>
          )}

          <div className="flex gap-3">
            <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gray-100">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.first_name || "guest"}`} className="h-full w-full object-cover" alt="You" />
            </div>
            <div className="relative flex-1">
              <textarea
                id={`comment-input-${post.id}`}
                value={commentInputs[post.id] || ""}
                onChange={(e) => onCommentInputChange(post.id, e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onCommentSubmit(post.id); } }}
                placeholder={replyingTo[post.id] ? `Reply to ${replyingTo[post.id]?.user.first_name}…` : "Write a comment…"}
                className="w-full rounded-md border border-gray-100 bg-gray-50 px-4 py-2 pr-10 text-sm font-medium text-gray-700 outline-none focus:border-blue-200 focus:bg-white transition"
                rows={1}
              />
              <button
                disabled={!commentInputs[post.id]?.trim()}
                onClick={() => onCommentSubmit(post.id)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 disabled:text-gray-300 transition hover:scale-110"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M2.01 21L23 12L2.01 3L2 10l15 2l-15 2z" /></svg>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {isCommentsLoading[post.id] && (
              <div className="flex justify-center py-4">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              </div>
            )}

            {!isCommentsLoading[post.id] && (commentsMap[post.id] || []).length === 0 && (
              <p className="text-center text-[11px] font-bold text-gray-400 py-2">No comments yet. Start the conversation!</p>
            )}

            {(commentsMap[post.id] || []).map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={post.id}
                onReply={(c) => onSetReply(post.id, c)}
              />
            ))}

            {(totalCommentsMap[post.id] || 0) > (commentsMap[post.id]?.length || 0) && !isCommentsLoading[post.id] && (
              <button
                onClick={() => onLoadMoreComments(post.id)}
                className="w-full rounded-md border border-slate-100 bg-slate-50 py-2 text-center text-xs font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 transition"
              >
                Show More Comments ({(totalCommentsMap[post.id] || 0) - (commentsMap[post.id]?.length || 0)} more)
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export { ForumPostCard, ImageGrid, CommentItem, JoinButton, parseImageUrls, formatRelativeTime };
export default ForumPostCard;
