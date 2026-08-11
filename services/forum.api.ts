import { type ForumCommunity, type ForumPost, type ForumComment } from "./api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const forumApi = {
  async getForumCommunities(_token?: string): Promise<ForumCommunity[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/forum/communities`, {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch communities");
    const data = await response.json();
    return data.data || data;
  },
  async createForumCommunity(data: {
    name: string;
    description?: string;
    icon?: string;
    bg_color?: string;
  }): Promise<ForumCommunity> {
    const token = typeof window !== "undefined" ? localStorage.getItem("superadmin_token") : null;
    const response = await fetch(`${API_BASE_URL}/api/v1/forum/communities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to create community");
    const res = await response.json();
    return res.data || res;
  },
  async getForumPosts(
    limit?: number,
    _token?: string,
    communityId?: number,
    page?: number,
  ): Promise<{ posts: ForumPost[]; has_more: boolean }> {
    const params = new URLSearchParams();
    if (limit) params.set("limit", String(limit));
    if (communityId) params.set("community_id", String(communityId));
    if (page) params.set("page", String(page));
    const response = await fetch(
      `${API_BASE_URL}/api/v1/forum/posts?${params.toString()}`,
      {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
    );
    if (!response.ok) throw new Error("Failed to fetch posts");
    const data = await response.json();
    return data.data || data;
  },
  async joinForumCommunity(_token: string, id: number): Promise<any> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/forum/communities/${id}/join`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
    );
    if (!response.ok) throw new Error("Failed to join community");
    const data = await response.json();
    return data.data || data;
  },
  async getForumPostComments(postId: number, limit?: number, offset?: number): Promise<any> {
    const params = new URLSearchParams();
    if (limit) params.set("limit", String(limit));
    if (offset) params.set("offset", String(offset));
    const response = await fetch(
      `${API_BASE_URL}/api/v1/forum/posts/${postId}/comments?${params.toString()}`,
      { credentials: "include" },
    );
    if (!response.ok) throw new Error("Failed to fetch comments");
    const data = await response.json();
    return data.data || data;
  },
  async createForumComment(_token: string, postId: number, data: any): Promise<ForumComment> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/forum/posts/${postId}/comments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      },
    );
    if (!response.ok) throw new Error("Failed to create comment");
    const result = await response.json();
    return result.data || result;
  },
  async voteForumPoll(_token: string, postId: number, optionIdx: number): Promise<any> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/forum/posts/${postId}/poll/vote`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ option_index: optionIdx }),
      },
    );
    if (!response.ok) throw new Error("Failed to vote");
    const data = await response.json();
    return data.data || data;
  },
  async likeForumPost(_token: string, postId: number): Promise<any> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/forum/posts/${postId}/like`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
    );
    if (!response.ok) throw new Error("Failed to like post");
    const data = await response.json();
    return data.data || data;
  },
  async dislikeForumPost(_token: string, postId: number): Promise<any> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/forum/posts/${postId}/dislike`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
    );
    if (!response.ok) throw new Error("Failed to dislike post");
    const data = await response.json();
    return data.data || data;
  },
  async saveForumPost(_token: string, postId: number): Promise<any> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/forum/posts/${postId}/save`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
    );
    if (!response.ok) throw new Error("Failed to save post");
    const data = await response.json();
    return data.data || data;
  },
  async createForumPost(_token: string, data: any): Promise<ForumPost> {
    const response = await fetch(`${API_BASE_URL}/api/v1/forum/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create post");
    const result = await response.json();
    return result.data || result;
  },
  async updateForumPost(_token: string, id: number, data: any): Promise<ForumPost> {
    const response = await fetch(`${API_BASE_URL}/api/v1/forum/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update post");
    const result = await response.json();
    return result.data || result;
  },
  async deleteForumPost(_token: string, id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/v1/forum/posts/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to delete post");
    return response.json();
  },
  async uploadForumMedia(_token: string, files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    const response = await fetch(`${API_BASE_URL}/api/v1/forum/upload`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to upload media");
    const data = await response.json();
    return data.data?.urls || data.urls || [];
  },
  async updateForumCommunity(token: string, id: number, data: {
    name: string;
    description?: string;
    icon?: string;
    bg_color?: string;
  }): Promise<ForumCommunity> {
    const response = await fetch(`${API_BASE_URL}/api/v1/forum/communities/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to update community");
    const res = await response.json();
    return res.data || res;
  },
  async deleteForumCommunity(token: string, id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/forum/communities/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to delete community");
  },
  async adminDeleteForumPost(token: string, id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/forum/admin/posts/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to delete post");
  },
  async getTrendingForumPosts(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/forum/posts/trending`, {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch trending posts");
    const data = await response.json();
    return data.data || data;
  },
};
