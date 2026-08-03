import { apiRequest, type BookmarkItem, type CreateBookmarkResponse } from "./api";

export const bookmarkApi = {
  async getBookmarksByType(type: string): Promise<BookmarkItem[]> {
    const res = await apiRequest<{
      success: boolean;
      data: BookmarkItem[] | { bookmarks: BookmarkItem[] };
      message: string;
    }>(`/api/v1/bookmarks/${type}`);
    return Array.isArray(res.data) ? res.data : res.data?.bookmarks || [];
  },
  async createBookmark(
    item_id: number,
    item_type: string,
  ): Promise<CreateBookmarkResponse> {
    return apiRequest<CreateBookmarkResponse>("/api/v1/bookmarks", {
      method: "POST",
      body: JSON.stringify({ item_id, type: item_type }),
    });
  },
  async deleteBookmark(bookmarkId: number): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/api/v1/bookmarks/${bookmarkId}`, {
      method: "DELETE",
    });
  },
};
