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
} from "lucide-react";
import DynamicIcon from "@/components/shared/DynamicIcon";
import {
  apiService,
  type ForumCommunity,
  type ForumPost,
} from "@/services/api";

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

  const fetchCommunities = () => {
    setLoading(true);
    apiService
      .getForumCommunities()
      .then((data) => setCommunities(Array.isArray(data) ? data : []))
      .catch(() => setCommunities([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCommunities();
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
    } catch {
      /* ignore */
    } finally {
      setDeletingPostId(null);
    }
  };

  const viewCommunity = async (community: ForumCommunity) => {
    setSelectedCommunity(community);
    setPostsLoading(true);
    try {
      const data = await apiService.getForumPosts(50, undefined, community.id);
      setCommunityPosts(Array.isArray(data) ? data : []);
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
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt=""
                    className="mt-2 h-40 w-full rounded-md object-cover"
                  />
                )}
                <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                  <span>{post.upvotes || 0} likes</span>
                  <span>{post.comment_count || 0} comments</span>
                </div>
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
    </div>
    );
  }

  return (
    <div className="rounded-md border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <Building size={20} className="text-blue-600" /> Manage Campus Feed
        </h2>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus size={16} /> Create Community
        </button>
      </div>

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
