"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { apiService, ForumPost, ForumCommunity } from "@/services/api";
import { useAuth } from "@/services/AuthContext";
import DynamicIcon from "@/components/shared/DynamicIcon";
import { Heart, MessageCircle, Image, BarChart2, Video, X, Plus } from "lucide-react";

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

interface PollOption {
  text: string;
  votes: number;
}

function parsePollOptions(post: ForumPost): PollOption[] {
  if (!post.poll_options) return [];
  try {
    return JSON.parse(post.poll_options);
  } catch {
    return [];
  }
}

/* ── internal components ──────────────────────────────────────────────── */

const PostCard: React.FC<{
  post: ForumPost;
  onLike: (id: number) => void;
  onCommentClick: (id: number) => void;
}> = ({ post, onLike, onCommentClick }) => {
  const images = parseImageUrls(post);
  const pollOptions = parsePollOptions(post);
  const user = post.user;
  const avatarLetter = user ? (user.first_name?.[0] || "U").toUpperCase() : "U";
  const communityName = post.community?.name || "";
  const isGeneral = post.community?.is_general || communityName === "General";

  return (
    <div className="bg-white rounded-lg p-5 border border-slate-200/80 shadow-xs space-y-3 card-hover">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">
            {avatarLetter}
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 leading-snug">
              {user ? `${user.first_name} ${user.last_name}` : "Anonymous"}
            </h4>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
              {communityName && !isGeneral && (
                <span className="text-blue-600 font-bold">{communityName}</span>
              )}
              {communityName && !isGeneral && <span>·</span>}
              <span>{relativeTime(post.created_at || post.CreatedAt || new Date().toISOString())}</span>
            </div>
          </div>
        </div>
      </div>

      {post.title && (
        <h3 className="text-sm font-bold text-slate-900 leading-snug">{post.title}</h3>
      )}

      {post.content && (
        <p className="text-xs text-slate-800 leading-relaxed font-medium">{post.content}</p>
      )}

      {images.length > 0 && (
        <div className={`grid gap-1 rounded-xl overflow-hidden ${
          images.length === 1 ? "grid-cols-1" :
          images.length === 2 ? "grid-cols-2" :
          images.length === 3 ? "grid-cols-2" :
          images.length === 4 ? "grid-cols-2" :
          "grid-cols-3"
        }`}>
          {images.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Post image ${i + 1}`}
              className="w-full object-cover rounded-lg border border-slate-100"
              style={{ maxHeight: i === 0 && images.length === 1 ? 320 : 200 }}
            />
          ))}
        </div>
      )}

      {post.video_url && (
        <div className="rounded-xl overflow-hidden border border-slate-100 bg-black">
          <video src={post.video_url} controls className="w-full max-h-80 object-contain" />
        </div>
      )}

      {post.is_poll && pollOptions.length > 0 && (
        <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <BarChart2 className="h-3.5 w-3.5 text-[#0000ff]" />
            Poll {post.total_votes != null && `(${post.total_votes} votes)`}
          </div>
          {pollOptions.map((opt, idx) => {
            const total = post.total_votes || 1;
            const pct = Math.round((opt.votes / total) * 100);
            return (
              <div key={idx} className="relative overflow-hidden rounded-lg border border-slate-200 bg-white">
                <div
                  className="absolute inset-0 bg-blue-50/60 rounded-lg transition-all"
                  style={{ width: `${pct}%` }}
                />
                <div className="relative flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700">
                  <span>{opt.text}</span>
                  <span className="text-slate-400 font-normal">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-6 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-500">
        <button
          onClick={() => onLike(post.id)}
          className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
            post.is_liked ? "text-rose-500" : "hover:text-slate-800"
          }`}
        >
          <Heart className={`h-3.5 w-3.5 ${post.is_liked ? "fill-current" : ""}`} />
          <span>{post.upvotes || 0}</span>
        </button>
        <button
          onClick={() => onCommentClick(post.id)}
          className="flex items-center gap-1.5 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          <span>{post.comment_count || 0} Comments</span>
        </button>
      </div>
    </div>
  );
};

const CreatePostModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    content: string;
    images: File[];
    video: File | null;
    poll: { question: string; options: PollOption[]; duration: string } | null;
  }) => void;
  isSubmitting: boolean;
  user: { first_name: string; last_name: string; image_url?: string } | null;
}> = ({ isOpen, onClose, onSubmit, isSubmitting, user }) => {
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [showPoll, setShowPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);
  const [pollDuration, setPollDuration] = useState("2 Weeks");

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const avatarLetter = user ? (user.first_name?.[0] || "U").toUpperCase() : "U";

  const reset = () => {
    setContent("");
    setImages([]);
    setImagePreviews([]);
    setVideo(null);
    setVideoPreview(null);
    setShowPoll(false);
    setPollQuestion("");
    setPollOptions(["", ""]);
    setPollDuration("2 Weeks");
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

  const handleSubmit = () => {
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
    onSubmit({ content, images, video, poll });
    reset();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-[28px] w-full max-w-lg shadow-2xl flex flex-col max-h-[85vh] overflow-hidden p-6 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 text-lg font-bold overflow-hidden">
              {avatarLetter}
            </div>
            <div className="flex flex-col">
              <h2 className="text-[1.1rem] font-bold text-gray-900 leading-snug tracking-tight">
                {user ? `${user.first_name} ${user.last_name}` : "Guest"}
              </h2>
              <span className="text-[0.875rem] text-gray-500 font-medium">Student</span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-800 hover:text-black hover:bg-gray-100 p-2 rounded-full transition-colors w-9 h-9 flex items-center justify-center"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        <div className="flex-1 my-3 flex flex-col overflow-y-auto pr-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tell others about yourself..."
            className="w-full text-[1.05rem] text-gray-800 placeholder-gray-400 bg-transparent border-none py-1 outline-none font-medium leading-relaxed resize-none min-h-[80px]"
            autoFocus
          />

          <div className="mt-2 space-y-3">
            {imagePreviews.length > 0 && (
              <div className="grid gap-2 grid-cols-2">
                {imagePreviews.map((url, i) => (
                  <div key={i} className="relative rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50 group">
                    <img src={url} alt={`Preview ${i + 1}`} className="w-full h-32 object-cover" />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-md backdrop-blur-sm"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {videoPreview && (
              <div className="relative rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-black">
                <video src={videoPreview} controls className="w-full max-h-[200px] object-contain" />
                <button
                  onClick={removeVideo}
                  className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-md backdrop-blur-sm z-10"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {showPoll && (
              <div className="space-y-3 bg-slate-50 rounded-2xl p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Create a poll</span>
                  <button
                    onClick={() => setShowPoll(false)}
                    className="text-[10px] font-bold text-gray-400 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
                <textarea
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  placeholder="Ask a question..."
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-800 placeholder-gray-400 focus:border-[#0000ff] outline-none transition-all resize-y min-h-[60px]"
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
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-800 placeholder-gray-400 focus:border-[#0000ff] outline-none transition-all"
                      />
                      {pollOptions.length > 2 && (
                        <button
                          onClick={() => removePollOption(i)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {pollOptions.length < 5 && (
                  <button
                    onClick={addPollOption}
                    className="text-[#0000ff] font-semibold text-sm flex items-center gap-1.5 hover:underline"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add option
                  </button>
                )}
                <div className="relative border border-gray-200 rounded-lg px-3.5 py-3 focus-within:border-[#0000ff] transition-all">
                  <label className="absolute -top-2.5 left-3 bg-slate-50 px-1 text-[11px] font-semibold text-gray-400">
                    Poll Duration
                  </label>
                  <select
                    value={pollDuration}
                    onChange={(e) => setPollDuration(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-gray-800 text-sm cursor-pointer font-medium"
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
        </div>

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

        <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1 sm:gap-2 text-gray-600">
            <button
              onClick={() => imageInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-[#0000ff] transition-all group"
              title="Add Image"
            >
              <Image className="h-[18px] w-[18px] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold hidden sm:inline">Image</span>
            </button>
            <button
              onClick={() => setShowPoll((p) => !p)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all group ${
                showPoll
                  ? "bg-blue-50 text-[#0000ff]"
                  : "hover:bg-gray-100 text-gray-600 hover:text-[#0000ff]"
              }`}
              title="Create Poll"
            >
              <BarChart2 className="h-[18px] w-[18px] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold hidden sm:inline">Poll</span>
            </button>
            <button
              onClick={() => videoInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-[#0000ff] transition-all group"
              title="Add Video"
            >
              <Video className="h-[18px] w-[18px] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold hidden sm:inline">Video</span>
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-[#0000ff] text-white font-bold py-2.5 px-7 rounded-full text-[15px] hover:opacity-90 active:scale-95 transition-all shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>
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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom duration-300"
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

  const token = apiService.getToken();

  const showToast = useCallback((message: string) => {
    const id = ++toastIdRef.current;
    setToasts((p) => [...p, { id, message }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000);
  }, []);

  const fetchCommunities = useCallback(async () => {
    try {
      const data = await apiService.getForumCommunities();
      setCommunities(isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getForumPosts(50, token || undefined, selectedCommunityId || undefined, 1);
      const list: ForumPost[] = isArray(data) ? (data as ForumPost[]) : ((data as { posts?: ForumPost[] })?.posts || []);
      if (!selectedCommunityId) {
        const joinedIds = communities.filter((c) => c.is_member).map((c) => c.id);
        const generalId = communities.find((c) => c.is_general)?.id;
        setPosts(list.filter((p) => joinedIds.includes(p.community_id) || p.community_id === generalId));
      } else {
        setPosts(list);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [token, selectedCommunityId]);

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
    fetchPosts();
  }, [fetchPosts]);

  const handleCommunityClick = (id: number) => {
    setSelectedCommunityId((prev) => (prev === id ? null : id));
  };

  const handleJoinToggle = async (communityId: number) => {
    if (!isAuthenticated || !token) {
      showToast("Please login to join communities");
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
    } catch (e) {
      showToast("Failed to update membership");
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
    content: string;
    images: File[];
    video: File | null;
    poll: { question: string; options: PollOption[]; duration: string } | null;
  }) => {
    if (!data.content.trim() && data.images.length === 0 && !data.video && !data.poll) return;
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
        community_id: selectedCommunityId || communities.find((c) => c.is_general)?.id || communities[0]?.id || 0,
        category: "General",
        title: data.content.slice(0, 80),
        content: data.content,
        poll_options: pollItems.length > 1 ? pollItems : undefined,
        is_poll: pollItems.length > 1,
        image_url: imageUrlValue,
        video_url: videoUrlValue,
      });

      setPosts((p) => [newPost, ...p]);
      showToast("Post published successfully!");
    } catch (e) {
      showToast("Failed to create post");
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

  const handleCommentClick = (_postId: number) => {
    // Placeholder — deep link to post detail in future
  };

  const selectedCommunity = communities.find((c) => c.id === selectedCommunityId);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased py-6">
      <main className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 sm:px-6 lg:px-8">
          {/* ── LEFT SIDEBAR ── */}
          <aside className="lg:col-span-3 space-y-5">
            <div className="bg-white rounded-lg p-5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-xs font-extrabold text-black tracking-wider uppercase">
                  Discover Communities
                </h3>
                {selectedCommunityId && (
                  <button
                    onClick={() => setSelectedCommunityId(null)}
                    className="text-[10px] font-black text-blue-600 hover:underline"
                  >
                    Show all
                  </button>
                )}
              </div>

              <div className="space-y-3.5">
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
          <section className="lg:col-span-6 space-y-5">
            {/* Create Post Widget */}
            <div className="bg-white rounded-lg p-4 border border-slate-200/80 shadow-xs input-glow transition-all">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold overflow-hidden">
                  {user?.image_url ? (
                    <img src={user.image_url} alt="" className="w-full h-full object-cover" />
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
              <div className="bg-white rounded-lg border border-slate-200/80 p-12 text-center shadow-xs flex flex-col items-center justify-center min-h-[320px]">
                <div className="w-14 h-14 rounded-full bg-blue-50 text-[#0000ff] flex items-center justify-center mb-4 text-2xl shadow-xs">
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
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onCommentClick={handleCommentClick}
                  />
                ))}
              </div>
            )}
          </section>

          {/* ── RIGHT SIDEBAR ── */}
          <aside className="lg:col-span-3 space-y-5">
            <div className="bg-white rounded-lg p-5 border border-slate-200/80 shadow-xs">
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
      />

      <ToastContainer toasts={toasts} />
    </div>
  );
};

export default CampusForumPage;
