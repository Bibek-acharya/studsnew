"use client";

import React, { useEffect, useRef, useState } from "react";
import { apiService, ForumPost, ForumCommunity, ForumComment } from "../../services/api";

interface CampusForumPageProps {
  onNavigate?: (view: any) => void;
}

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
      <div className="mb-3 overflow-hidden rounded-xl border border-gray-100">
        <img src={urls[0]} alt="Post" className="w-full max-h-80 object-cover" />
      </div>
    );
  }

  if (urls.length === 2) {
    return (
      <div className="mb-3 grid grid-cols-2 gap-1 overflow-hidden rounded-xl">
        {urls.map((u, i) => (
          <img key={i} src={u} alt={`Post ${i + 1}`} className="h-52 w-full object-cover" />
        ))}
      </div>
    );
  }

  if (urls.length === 3) {
    return (
      <div className="mb-3 grid grid-cols-[1fr_1fr] gap-1 overflow-hidden rounded-xl h-52">
        <img src={urls[0]} alt="Post 1" className="h-full w-full object-cover row-span-2" />
        <img src={urls[1]} alt="Post 2" className="h-[102px] w-full object-cover" />
        <img src={urls[2]} alt="Post 3" className="h-[102px] w-full object-cover" />
      </div>
    );
  }

  const visible = urls.slice(0, 4);
  const extra = urls.length - 4;
  return (
    <div className="mb-3 grid grid-cols-2 gap-1 overflow-hidden rounded-xl">
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
      <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-slate-100 border border-white shadow-sm">
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user.first_name}`}
          className="h-full w-full object-cover"
          alt={comment.user.first_name}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="rounded-2xl bg-gray-50 px-4 py-2.5 group">
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

const CommunityHeader: React.FC<{
  community: ForumCommunity;
  onJoin: (id: number) => void;
  onShare: (id: number) => void;
  onInvite: (id: number) => void;
  isLoading: boolean;
  onBack?: () => void;
}> = ({ community, onJoin, onShare, onInvite, isLoading, onBack }) => {
  return (
    <header className="bg-white w-full border-b border-gray-100 pt-10 pb-8 px-4 sm:px-8 lg:px-12 mb-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-5 flex items-center justify-between">
          <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white flex items-center justify-center text-4xl">
            {community.emoji || "🎓"}
          </div>
          {onBack && (
             <button onClick={onBack} className="flex items-center gap-2 text-[#5468ff] font-bold text-sm hover:underline transition">
               <span className="text-lg">←</span> Back to Global Feed
             </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[32px] font-bold text-[#0f1d3a] tracking-tight">{community.name}</h1>
            <p className="text-[15px] text-gray-500 flex items-center gap-2">
              <span>🚀</span> {community.description || "The heart of tech enthusiasts & community discussions."}
            </p>
            <p className="text-[13px] text-gray-400 font-medium mt-1">
              {community.member_count ?? 0} members <span className="mx-1">•</span> {community.post_count ?? 0} posts
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onJoin(community.id)}
              disabled={isLoading}
              className={`px-8 py-2.5 rounded-full font-bold text-[14px] transition-all duration-200 shadow-sm active:scale-95 flex items-center gap-2 ${
                community.is_member
                  ? "bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 group"
                  : "bg-[#5468ff] hover:bg-[#4355eb] text-white"
              }`}
            >
              {isLoading ? "..." : community.is_member ? "Leave Community" : "Join Community"}
            </button>
            <button
              onClick={() => onInvite(community.id)}
              className="bg-white border-[1.5px] border-[#5468ff] text-[#5468ff] hover:bg-[#f4f6ff] px-6 py-2.5 rounded-full font-bold text-[14px] transition-all duration-200 active:scale-95"
            >
              Invite Friends
            </button>
            <button
              onClick={() => onShare(community.id)}
              className="bg-white border-[1.5px] border-[#5468ff] text-[#5468ff] hover:bg-[#f4f6ff] w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
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

const CampusForumPage: React.FC<CampusForumPageProps> = ({ onNavigate }) => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [communities, setCommunities] = useState<ForumCommunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCommunityId, setSelectedCommunityId] = useState<number | null>(null);

  const [openComments, setOpenComments] = useState<Record<number, boolean>>({});
  const [commentsMap, setCommentsMap] = useState<Record<number, ForumComment[]>>({});
  const [totalCommentsMap, setTotalCommentsMap] = useState<Record<number, number>>({});
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [isCommentsLoading, setIsCommentsLoading] = useState<Record<number, boolean>>({});
  const [replyingTo, setReplyingTo] = useState<Record<number, ForumComment | null>>({});

  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

  const [joinLoading, setJoinLoading] = useState<Record<number, boolean>>({});

  const [modalCommunityId, setModalCommunityId] = useState<number>(0);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [isPollEnabled, setIsPollEnabled] = useState(false);
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [hiddenPostIds, setHiddenPostIds] = useState<Set<number>>(new Set());

  const user = apiService.getUser();
  const isAuthenticated = apiService.isAuthenticated();

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [selectedCommunityId]);

  const fetchInitialData = async () => {
    try {
      const token = apiService.getToken() || undefined;
      const fetched = await apiService.getForumCommunities(token);
      setCommunities(fetched || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const token = apiService.getToken() || undefined;
      const fetched = await apiService.getForumPosts(undefined, token, selectedCommunityId || undefined);
      setPosts(fetched || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinToggle = async (communityId: number) => {
    if (!isAuthenticated) {
      alert("Please login to join communities");
      onNavigate?.("login");
      return;
    }

    setJoinLoading((p) => ({ ...p, [communityId]: true }));
    try {
      const updated = await apiService.joinForumCommunity(apiService.getToken()!, communityId);
      setCommunities((prev) =>
        prev.map((c) =>
          c.id === communityId
            ? { ...c, is_member: updated.is_member, member_count: updated.member_count }
            : c
        )
      );
    } catch (e) {
      alert("Failed to update membership.");
    } finally {
      setJoinLoading((p) => ({ ...p, [communityId]: false }));
    }
  };

  const toggleComments = async (postId: number) => {
    const opening = !openComments[postId];
    setOpenComments((p) => ({ ...p, [postId]: opening }));
    if (opening && !commentsMap[postId]?.length) {
      fetchComments(postId, 10, 0);
    }
  };

  const fetchComments = async (postId: number, limit: number, offset: number) => {
    setIsCommentsLoading((p) => ({ ...p, [postId]: true }));
    try {
      const data = await apiService.getForumPostComments(postId, limit, offset);
      setCommentsMap((p) => ({
        ...p,
        [postId]: offset === 0 ? data.comments : [...(p[postId] || []), ...data.comments],
      }));
      setTotalCommentsMap((p) => ({ ...p, [postId]: data.total_count }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsCommentsLoading((p) => ({ ...p, [postId]: false }));
    }
  };

  const handleSetReply = (postId: number, comment: ForumComment) => {
    setReplyingTo((p) => ({ ...p, [postId]: comment }));
    document.getElementById(`comment-input-${postId}`)?.focus();
  };

  const handleCommentSubmit = async (postId: number) => {
    if (!isAuthenticated) {
      alert("Please login to comment");
      onNavigate?.("login");
      return;
    }
    const content = commentInputs[postId]?.trim();
    if (!content) return;

    try {
      const token = apiService.getToken()!;
      const newComment = await apiService.createForumComment(token, postId, {
        content,
        parent_id: replyingTo[postId]?.id,
      });

      setCommentsMap((p) => ({
        ...p,
        [postId]: [...(p[postId] || []), newComment],
      }));
      setCommentInputs((p) => ({ ...p, [postId]: "" }));
      setReplyingTo((p) => ({ ...p, [postId]: null }));
    } catch (e) {
      alert("Failed to add comment.");
    }
  };

  const handleLike = async (postId: number) => {
    if (!isAuthenticated) return;
    try {
      const updated = await apiService.likeForumPost(apiService.getToken()!, postId);
      setPosts((p) => p.map((post) => (post.id === postId ? { ...post, ...updated } : post)));
    } catch (e) { console.error(e); }
  };

  const handleCreatePostClick = () => {
    if (!isAuthenticated) { onNavigate?.("login"); return; }
    setIsCreatePostModalOpen(true);
  };

  const handlePostSubmit = async () => {
    if (!modalCommunityId || !modalTitle.trim()) return;
    setIsSubmitting(true);
    try {
      const token = apiService.getToken()!;
      const newPost = await apiService.createForumPost(token, {
        community_id: modalCommunityId,
        title: modalTitle,
        content: modalContent,
        is_poll: isPollEnabled,
      });
      setPosts([newPost, ...posts]);
      setIsCreatePostModalOpen(false);
      resetModal();
    } catch (e) {
      alert("Failed to create post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetModal = () => {
    setModalTitle(""); setModalContent(""); setModalCommunityId(0);
    setIsPollEnabled(false); setPollOptions(["", ""]);
    setSelectedImages([]); setImagePreviews([]);
  };

  const selectedCommunity = communities.find((c) => c.id === selectedCommunityId);

  return (
    <div className="min-h-screen bg-gray-50 text-[#1a1a1a] antialiased pb-12 w-full">
      {selectedCommunity && (
        <CommunityHeader
          community={selectedCommunity}
          onJoin={handleJoinToggle}
          onShare={() => {}}
          onInvite={() => {}}
          isLoading={!!joinLoading[selectedCommunity.id]}
          onBack={() => setSelectedCommunityId(null)}
        />
      )}

      <div className={`mx-auto w-full gap-8 px-4 ${selectedCommunity ? "max-w-[1200px] grid grid-cols-1 lg:grid-cols-3 py-4" : "max-w-[1400px] flex justify-center py-6"}`}>
        {!selectedCommunity && (
          <div className="sticky top-6 hidden shrink-0 space-y-6 lg:block w-[280px]">
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-[0.1em] text-gray-400 mb-4">Student Communities</h3>
              <div className="space-y-1">
                {communities.map((item) => (
                  <div key={item.id} className={`flex w-full items-center gap-2 rounded-lg p-2 transition cursor-pointer ${selectedCommunityId === item.id ? "bg-blue-50" : "hover:bg-gray-50"}`}
                    onClick={() => setSelectedCommunityId(item.id)}>
                    <div className={`h-9 w-9 shrink-0 ${item.bg_color || "bg-gray-100"} flex items-center justify-center rounded-lg text-lg`}>{item.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <span className={`block text-[13px] font-bold truncate ${selectedCommunityId === item.id ? "text-blue-600" : "text-gray-600"}`}>{item.name}</span>
                    </div>
                    <JoinButton
                      communityId={item.id}
                      isMember={!!item.is_member}
                      isLoading={!!joinLoading[item.id]}
                      onToggle={handleJoinToggle}
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className={`w-full flex-1 space-y-4 ${selectedCommunity ? "lg:col-span-2 max-w-[800px]" : "max-w-[600px]"}`}>
          <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-4">
             <div className="flex items-center gap-3 cursor-pointer" onClick={handleCreatePostClick}>
                <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-xl">🎓</div>
                <div className="bg-slate-50 border border-slate-100 rounded-full px-4 py-2 text-slate-400 text-sm flex-1 font-medium">Ask something to the community...</div>
             </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>
          ) : (
            posts.filter(p => !hiddenPostIds.has(p.id)).map(post => (
              <div key={post.id} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm animate-fadeIn">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-600 flex items-center justify-center rounded-lg text-white font-bold text-sm uppercase">
                        {post.user?.first_name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="font-bold text-[14px] text-slate-900">{post.user?.first_name} {post.user?.last_name}</p>
                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">{formatRelativeTime(post.created_at)}</p>
                      </div>
                   </div>
                </div>
                <h2 className="text-lg font-black mb-2 text-slate-900 leading-tight">{post.title}</h2>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">{post.content}</p>
                {post.image_url && <ImageGrid urls={parseImageUrls(post.image_url)} />}
                
                <div className="flex gap-6 border-t border-slate-50 pt-4">
                   <button onClick={() => handleLike(post.id)} className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest transition ${post.is_liked ? "text-blue-600" : "text-slate-400 hover:text-blue-500"}`}>
                      <i className="fa-solid fa-arrow-up text-sm"></i> <span>{post.upvotes} Upvotes</span>
                   </button>
                   <button onClick={() => toggleComments(post.id)} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-500 transition">
                      <i className="fa-regular fa-comment text-sm"></i> <span>{post.comment_count} Comments</span>
                   </button>
                </div>

                {openComments[post.id] && (
                  <div className="mt-4 space-y-4 border-t border-slate-50 pt-4 animate-fadeIn">
                    <div className="space-y-4">
                      {(commentsMap[post.id] || []).map(comment => (
                        <CommentItem key={comment.id} comment={comment} postId={post.id} onReply={c => handleSetReply(post.id, c)} />
                      ))}
                    </div>
                    <div className="flex gap-3 mt-4">
                       <input 
                         id={`comment-input-${post.id}`} 
                         value={commentInputs[post.id] || ""} 
                         onChange={e => setCommentInputs({...commentInputs, [post.id]: e.target.value})}
                         className="flex-1 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 outline-none focus:border-blue-500 text-sm font-medium" 
                         placeholder={replyingTo[post.id] ? `Reply to ${replyingTo[post.id]?.user.first_name}...` : "Write a comment..."} 
                       />
                       <button onClick={() => handleCommentSubmit(post.id)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-bold text-sm transition">Post</button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {isCreatePostModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setIsCreatePostModalOpen(false)}>
           <div className="bg-white rounded-3xl w-full max-w-xl p-8 shadow-2xl animate-scaleUp" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Community Post</h2>
                <button onClick={() => setIsCreatePostModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
                  <i className="fa-solid fa-xmark text-xl"></i>
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Select Community</label>
                  <select 
                    value={modalCommunityId} 
                    onChange={e => setModalCommunityId(Number(e.target.value))} 
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 font-bold text-sm text-slate-700"
                  >
                     <option value={0}>Choose a community to post in...</option>
                     {communities.filter(c => c.is_member).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Post Title</label>
                  <input 
                    value={modalTitle} 
                    onChange={e => setModalTitle(e.target.value)} 
                    placeholder="What's on your mind?" 
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 font-bold text-sm" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Details (Optional)</label>
                  <textarea 
                    value={modalContent} 
                    onChange={e => setModalContent(e.target.value)} 
                    placeholder="Provide more context for your post..." 
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 font-medium text-sm h-32 resize-none" 
                  />
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                 <button onClick={() => setIsCreatePostModalOpen(false)} className="flex-1 py-4 border border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition">Cancel</button>
                 <button onClick={handlePostSubmit} disabled={isSubmitting || !modalCommunityId || !modalTitle} className="flex-[2] py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition disabled:opacity-50 shadow-lg shadow-blue-200">
                    {isSubmitting ? "Creating..." : "Create Post"}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CampusForumPage;
