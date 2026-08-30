"use client";

import React, { useEffect, useState } from "react";
import {
  Building,
  Plus,
  MessageSquare,
  Users,
  ArrowLeft,
  Loader2,
  Pencil,
  Trash2,
  Flag,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import DynamicIcon from "@/components/shared/DynamicIcon";
import {
  apiService,
  type AdminForumReport,
  type ForumCommunity,
  type ForumComment,
  type ForumPost,
} from "@/services/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function resolveImageUrl(path?: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
}

function parseMediaUrls(value?: string): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((url): url is string => typeof url === "string" && url.length > 0) : [value];
  } catch {
    return [value];
  }
}

function parsePollOptions(value?: string): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((option) => typeof option === "string" ? option : String(option?.text || "")).filter(Boolean);
  } catch {
    return [];
  }
}

function AdminCommentTree({
  comments,
  deletingCommentId,
  onDelete,
  depth = 0,
}: {
  comments: ForumComment[];
  deletingCommentId: number | null;
  onDelete: (commentId: number) => void;
  depth?: number;
}) {
  return (
    <div className="space-y-2">
      {comments.map((comment) => (
        <div key={comment.id} className={depth === 0 ? "" : "ml-4 border-l border-gray-200 pl-3"}>
          <div className="rounded-md border border-gray-200 bg-white px-3 py-2.5">
            <div className="flex items-start gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-[10px] font-bold text-gray-600">
                {comment.user?.image_url ? (
                  <img src={resolveImageUrl(comment.user.image_url)} alt="" className="h-full w-full object-cover" />
                ) : (
                  (comment.user?.first_name?.[0] || comment.user_name?.[0] || "U").toUpperCase()
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-xs font-semibold text-gray-900">
                    {comment.user_name || `${comment.user?.first_name || ""} ${comment.user?.last_name || ""}`.trim() || "Unknown user"}
                  </span>
                  <span className="text-[10px] text-gray-400">{new Date(comment.created_at).toLocaleString()}</span>
                  <button
                    type="button"
                    onClick={() => onDelete(comment.id)}
                    disabled={deletingCommentId === comment.id}
                    className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    title="Delete comment and replies"
                    aria-label="Delete comment and replies"
                  >
                    {deletingCommentId === comment.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                  </button>
                </div>
                {comment.parent_user_name && <p className="text-[10px] text-gray-400">Replying to @{comment.parent_user_name}</p>}
                <p className="mt-1 whitespace-pre-wrap break-words text-xs leading-relaxed text-gray-700">{comment.content}</p>
                {comment.image_url && <img src={resolveImageUrl(comment.image_url)} alt="Comment attachment" className="mt-2 max-h-48 rounded object-contain" />}
              </div>
            </div>
          </div>
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              <AdminCommentTree comments={comment.replies} deletingCommentId={deletingCommentId} onDelete={onDelete} depth={depth + 1} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function CampusFeedSection() {
  const [communities, setCommunities] = useState<ForumCommunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommunity, setSelectedCommunity] =
    useState<ForumCommunity | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    icon: "",
    bg_color: "",
  });
  const [creating, setCreating] = useState(false);
  const [communityPosts, setCommunityPosts] = useState<ForumPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [editingCommunity, setEditingCommunity] = useState<ForumCommunity | null>(null);
  const [editForm, setEditForm] = useState({ name: "", description: "", icon: "", bg_color: "" });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);
  const [reports, setReports] = useState<AdminForumReport[]>([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [showReports, setShowReports] = useState(true);
  const [commentsByPost, setCommentsByPost] = useState<Record<number, ForumComment[]>>({});
  const [commentsLoadingPostId, setCommentsLoadingPostId] = useState<number | null>(null);
  const [expandedCommentPosts, setExpandedCommentPosts] = useState<Record<number, boolean>>({});
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);
  const [commentDeleteTarget, setCommentDeleteTarget] = useState<{ postId: number; commentId: number } | null>(null);

  const fetchCommunities = () => {
    setLoading(true);
    apiService
      .getForumCommunities()
      .then((data) => setCommunities(Array.isArray(data) ? data : []))
      .catch(() => setCommunities([]))
      .finally(() => setLoading(false));
  };

  const fetchReports = () => {
    const token = localStorage.getItem("superadmin_token") || "";
    setReportsLoading(true);
    apiService.getAdminForumReports(token)
      .then((data) => setReports(Array.isArray(data) ? data : []))
      .catch(() => setReports([]))
      .finally(() => setReportsLoading(false));
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchCommunities();
      fetchReports();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name.trim()) return;
    setCreating(true);
    try {
      await apiService.createForumCommunity(createForm);
      setShowCreate(false);
      setCreateForm({ name: "", description: "", icon: "", bg_color: "" });
      fetchCommunities();
    } catch {
      /* ignore */
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (community: ForumCommunity) => {
    setEditingCommunity(community);
    setEditForm({
      name: community.name,
      description: community.description || "",
      icon: community.icon || "",
      bg_color: community.bg_color || "",
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name.trim()) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("superadmin_token") || "";
      await apiService.updateForumCommunity(token, editingCommunity!.id, editForm);
      setEditingCommunity(null);
      fetchCommunities();
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (communityId: number) => {
    setDeleting(true);
    try {
      const token = localStorage.getItem("superadmin_token") || "";
      await apiService.deleteForumCommunity(token, communityId);
      setDeleteConfirm(null);
      fetchCommunities();
      if (selectedCommunity?.id === communityId) {
        setSelectedCommunity(null);
        setCommunityPosts([]);
      }
    } catch {
      /* ignore */
    } finally {
      setDeleting(false);
    }
  };

  const handlePostDelete = async (postId: number) => {
    try {
      const token = localStorage.getItem("superadmin_token") || "";
      await apiService.adminDeleteForumPost(token, postId);
      setCommunityPosts((p) => p.filter((x) => x.id !== postId));
      setReports((current) => current.filter((report) => report.post_id !== postId));
    } catch {
      /* ignore */
    } finally {
      setDeletingPostId(null);
    }
  };

  const togglePostComments = async (postId: number) => {
    if (expandedCommentPosts[postId]) {
      setExpandedCommentPosts((current) => ({ ...current, [postId]: false }));
      return;
    }
    setExpandedCommentPosts((current) => ({ ...current, [postId]: true }));
    if (commentsByPost[postId]) return;

    const token = localStorage.getItem("superadmin_token") || "";
    setCommentsLoadingPostId(postId);
    try {
      const comments = await apiService.getAdminForumPostComments(token, postId);
      setCommentsByPost((current) => ({ ...current, [postId]: comments }));
    } catch {
      setCommentsByPost((current) => ({ ...current, [postId]: [] }));
    } finally {
      setCommentsLoadingPostId(null);
    }
  };

  const handleCommentDelete = async (postId: number, commentId: number) => {
    const token = localStorage.getItem("superadmin_token") || "";
    setDeletingCommentId(commentId);
    try {
      const result = await apiService.adminDeleteForumComment(token, commentId);
      const comments = await apiService.getAdminForumPostComments(token, postId);
      setCommentsByPost((current) => ({ ...current, [postId]: comments }));
      setCommunityPosts((posts) => posts.map((post) => post.id === postId
        ? { ...post, comment_count: Math.max(0, (post.comment_count || 0) - result.deleted_count) }
        : post));
    } finally {
      setDeletingCommentId(null);
      setCommentDeleteTarget(null);
    }
  };

  const viewCommunity = async (community: ForumCommunity) => {
    setSelectedCommunity(community);
    setPostsLoading(true);
    try {
      const data = await apiService.getForumPosts(50, undefined, community.id);
      const posts = Array.isArray(data) ? data : data?.posts || [];
      setCommunityPosts(posts);
    } catch {
      setCommunityPosts([]);
    } finally {
      setPostsLoading(false);
    }
  };

  if (selectedCommunity) {
    return (
      <div className="rounded-md border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSelectedCommunity(null);
                setCommunityPosts([]);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {selectedCommunity.icon ? (
                  <DynamicIcon name={selectedCommunity.icon} size={20} className="inline mr-1 text-blue-600" />
                ) : null}
                {selectedCommunity.name}
              </h2>
              {selectedCommunity.description && (
                <p className="text-sm text-gray-500">
                  {selectedCommunity.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <MessageSquare size={15} />
              {selectedCommunity.post_count || 0} posts
            </span>
            <span className="flex items-center gap-1.5">
              <Users size={15} />
              {selectedCommunity.member_count || 0} members
            </span>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {postsLoading ? (
            <div className="flex items-center justify-center py-12 text-sm text-gray-400">
              <Loader2 size={20} className="mr-2 animate-spin" />
              Loading posts...
            </div>
          ) : communityPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <MessageSquare size={32} className="mb-2 opacity-50" />
              <p className="text-sm">No posts in this community yet</p>
            </div>
          ) : (
            communityPosts.map((post) => (
              <div key={post.id} className="px-5 py-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-xs font-bold text-white">
                    {(post.user?.first_name?.charAt(0) || "U").toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {post.user?.first_name} {post.user?.last_name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(
                        post.created_at || post.CreatedAt || "",
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="ml-auto rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                    {post.category}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setDeletingPostId(post.id); }}
                    className="ml-2 flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    title="Delete post"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <h3 className="mb-1 text-base font-bold text-gray-900">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {post.content}
                </p>
                {parseMediaUrls(post.image_url).length > 0 && (
                  <div className={`mt-3 grid gap-2 ${parseMediaUrls(post.image_url).length > 1 ? "sm:grid-cols-2" : "grid-cols-1"}`}>
                    {parseMediaUrls(post.image_url).map((url) => (
                      <img
                        key={url}
                        src={resolveImageUrl(url)}
                        alt="Post attachment"
                        className="max-h-80 w-full rounded-md bg-gray-50 object-contain"
                      />
                    ))}
                  </div>
                )}
                {post.video_url && (
                  <video
                    controls
                    preload="metadata"
                    src={resolveImageUrl(post.video_url)}
                    className="mt-3 max-h-[420px] w-full rounded-md bg-black"
                  >
                    Your browser does not support video playback.
                  </video>
                )}
                {post.is_poll && (
                  <div className="mt-3 rounded-md border border-gray-200 bg-gray-50 p-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Poll results</p>
                    <div className="space-y-2">
                      {parsePollOptions(post.poll_options).map((option, optionIndex) => {
                        const votes = post.poll_results?.[optionIndex] || 0;
                        const percentage = post.total_votes ? Math.round((votes / post.total_votes) * 100) : 0;
                        return (
                          <div key={`${option}-${optionIndex}`}>
                            <div className="mb-1 flex items-center justify-between gap-3 text-xs">
                              <span className="font-medium text-gray-700">{option}</span>
                              <span className="shrink-0 text-gray-500">{votes} votes ({percentage}%)</span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                              <div className="h-full rounded-full bg-blue-600" style={{ width: `${percentage}%` }} />
                            </div>
                          </div>
                        );
                      })}
                      {parsePollOptions(post.poll_options).length === 0 && <p className="text-xs text-gray-400">No poll options available.</p>}
                    </div>
                  </div>
                )}
                <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                  <span>{post.upvotes || 0} likes</span>
                  <button
                    type="button"
                    onClick={() => togglePostComments(post.id)}
                    className="flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700"
                  >
                    {commentsLoadingPostId === post.id ? <Loader2 size={12} className="animate-spin" /> : <MessageSquare size={12} />}
                    {post.comment_count || 0} comments
                    {expandedCommentPosts[post.id] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>
                </div>
                {expandedCommentPosts[post.id] && (
                  <div className="mt-3 rounded-md bg-gray-50 p-3">
                    {commentsLoadingPostId === post.id ? (
                      <div className="flex items-center justify-center py-5 text-xs text-gray-400">
                        <Loader2 size={15} className="mr-2 animate-spin" /> Loading comments...
                      </div>
                    ) : (commentsByPost[post.id]?.length || 0) > 0 ? (
                      <AdminCommentTree
                        comments={commentsByPost[post.id]}
                        deletingCommentId={deletingCommentId}
                        onDelete={(commentId) => setCommentDeleteTarget({ postId: post.id, commentId })}
                      />
                    ) : (
                      <p className="py-3 text-center text-xs text-gray-400">No comments on this post.</p>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      {deletingPostId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-bold text-gray-900">Delete Post</h3>
            <p className="mb-4 text-sm text-gray-600">
              Delete this post and all its comments, votes, and attached files? This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handlePostDelete(deletingPostId)}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setDeletingPostId(null)}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {commentDeleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-bold text-gray-900">Delete Comment</h3>
            <p className="mb-4 text-sm text-gray-600">
              Delete this comment and every reply and sub-reply beneath it? This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleCommentDelete(commentDeleteTarget.postId, commentDeleteTarget.commentId)}
                disabled={deletingCommentId !== null}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deletingCommentId !== null ? "Deleting..." : "Delete comment"}
              </button>
              <button
                type="button"
                onClick={() => setCommentDeleteTarget(null)}
                disabled={deletingCommentId !== null}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-300 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    );
  }

  return (
    <div className="rounded-md border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <Building size={20} className="text-blue-600" /> Manage Campus Feed
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowReports((visible) => !visible)}
            className={`flex items-center gap-2 rounded-md border px-3 py-2.5 text-sm font-medium transition-colors ${showReports ? "border-red-200 bg-red-50 text-red-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
          >
            <Flag size={15} /> Reports {reports.length > 0 && `(${reports.length})`}
            {showReports ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus size={16} /> Create Community
          </button>
        </div>
      </div>

      {showReports && (
        <div className="border-b border-gray-200 bg-red-50/40 px-5 py-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Reported posts</h3>
              <p className="text-xs text-gray-500">Review user reports before moderating the related community post.</p>
            </div>
            <button type="button" onClick={fetchReports} className="text-xs font-semibold text-blue-600 hover:text-blue-700">Refresh</button>
          </div>
          {reportsLoading ? (
            <div className="flex items-center py-5 text-xs text-gray-400"><Loader2 size={15} className="mr-2 animate-spin" /> Loading reports...</div>
          ) : reports.length === 0 ? (
            <p className="rounded-md border border-dashed border-gray-200 bg-white px-4 py-5 text-center text-xs text-gray-400">No reported posts.</p>
          ) : (
            <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
              {reports.map((report) => (
                <div key={report.id} className="rounded-md border border-red-100 bg-white p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">{report.post.title || "Untitled post"}</p>
                      <p className="text-[11px] text-gray-500">
                        {report.post.community?.name || "Unknown community"} · reported by {report.reporter.first_name} {report.reporter.last_name} · {new Date(report.created_at).toLocaleString()}
                      </p>
                    </div>
                    <span className="shrink-0 rounded bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-700">Post #{report.post_id}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {report.reasons.map((reason) => <span key={reason} className="rounded bg-gray-100 px-2 py-1 text-[10px] text-gray-600">{reason}</span>)}
                  </div>
                  {report.other_text && <p className="mt-2 rounded bg-gray-50 px-2.5 py-2 text-xs text-gray-600">{report.other_text}</p>}
                  <button
                    type="button"
                    disabled={!communities.some((community) => community.id === report.post.community_id)}
                    onClick={() => {
                      const community = communities.find((item) => item.id === report.post.community_id);
                      if (community) viewCommunity(community);
                    }}
                    className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:text-gray-300"
                  >
                    View community posts
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showCreate && (
        <div className="border-b border-gray-100 bg-gray-50 px-5 py-4">
          <form onSubmit={handleCreate} className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                {createForm.icon ? (
                  <DynamicIcon name={createForm.icon} size={24} />
                ) : (
                  <span className="text-xs text-gray-400">Icon</span>
                )}
              </div>
              <input
                type="text"
                value={createForm.icon}
                onChange={(e) =>
                  setCreateForm((p) => ({ ...p, icon: e.target.value }))
                }
                placeholder="e.g. users, book-open, graduation-cap"
                className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
            </div>
            <p className="text-xs text-gray-400">
              Icon name from{" "}
              <a href="https://lucide.dev/icons" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                lucide.dev/icons
              </a>
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={createForm.name}
                onChange={(e) =>
                  setCreateForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Community name"
                required
                className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
              <input
                type="text"
                value={createForm.bg_color}
                onChange={(e) =>
                  setCreateForm((p) => ({ ...p, bg_color: e.target.value }))
                }
                placeholder="Bg color (hex)"
                className="w-28 rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
            </div>
            <input
              type="text"
              value={createForm.description}
              onChange={(e) =>
                setCreateForm((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Short description"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={creating}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create"}
              </button>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {editingCommunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Edit Community</h3>
            <form onSubmit={handleSaveEdit} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  {editForm.icon ? (
                    <DynamicIcon name={editForm.icon} size={24} />
                  ) : (
                    <span className="text-xs text-gray-400">Icon</span>
                  )}
                </div>
                <input
                  type="text"
                  value={editForm.icon}
                  onChange={(e) => setEditForm((p) => ({ ...p, icon: e.target.value }))}
                  placeholder="e.g. users, book-open"
                  className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
              </div>
              <p className="text-xs text-gray-400">
                <a href="https://lucide.dev/icons" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  Browse icons
                </a>
              </p>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Community name"
                required
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
              <input
                type="text"
                value={editForm.bg_color}
                onChange={(e) => setEditForm((p) => ({ ...p, bg_color: e.target.value }))}
                placeholder="Bg color (hex)"
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
              <input
                type="text"
                value={editForm.description}
                onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Short description"
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingCommunity(null)}
                  className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-bold text-gray-900">Delete Community</h3>
            <p className="mb-4 text-sm text-gray-600">
              This will permanently delete this community and all its posts, comments, votes, and uploaded files. This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="divide-y divide-gray-100">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-sm text-gray-400">
            <Loader2 size={20} className="mr-2 animate-spin" />
            Loading communities...
          </div>
        ) : communities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Building size={32} className="mb-2 opacity-50" />
            <p className="text-sm">No communities yet</p>
          </div>
        ) : (
          communities.map((community) => (
            <div
              key={community.id}
              className="flex w-full items-center gap-4 px-5 py-4 transition-colors hover:bg-gray-50"
            >
              <button
                type="button"
                onClick={() => viewCommunity(community)}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl"
                style={{ backgroundColor: community.bg_color || "#e0e7ff" }}
              >
                {community.icon ? (
                  <DynamicIcon name={community.icon} size={22} className="text-white" />
                ) : (
                  <Building size={22} className="text-white" />
                )}
              </button>
              <button
                type="button"
                onClick={() => viewCommunity(community)}
                className="min-w-0 flex-1 text-left"
              >
                <p className="text-sm font-semibold text-gray-900">
                  {community.name}
                </p>
                {community.description && (
                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    {community.description}
                  </p>
                )}
              </button>
              <div className="flex shrink-0 items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <MessageSquare size={13} />
                  {community.post_count || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={13} />
                  {community.member_count || 0}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleEdit(community); }}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-blue-600"
                  title="Edit community"
                >
                  <Pencil size={15} />
                </button>
                {!community.is_general && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setDeleteConfirm(community.id); }}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-600"
                    title="Delete community"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
