"use client";

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiService, ForumComment } from "../../services/api";
import { useAuth } from "../../services/AuthContext";

interface PostCardProps {
  id: number;
  userId: number;
  author: string;
  category: string;
  avatar: string;
  time: string;
  title: string;
  content: string;
  upvotes: number;
  downvotes: number;
  answers: number;
  isLiked: boolean;
  isDisliked: boolean;
  isSaved: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  id,
  userId,
  author,
  category,
  avatar,
  time,
  title,
  content,
  upvotes,
  downvotes,
  answers,
  isLiked,
  isDisliked,
  isSaved,
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [votes, setVotes] = useState(upvotes);
  const [dVotes, setDVotes] = useState(downvotes);
  const [hasLiked, setHasLiked] = useState(isLiked);
  const [hasDisliked, setHasDisliked] = useState(isDisliked);
  const [hasSaved, setHasSaved] = useState(isSaved);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editContent, setEditContent] = useState(content);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const { data: comments, isLoading: isLoadingComments } = useQuery({
    queryKey: ["forumComments", id],
    queryFn: () => apiService.getForumPostComments(id),
    enabled: showComments,
  });

  const likeMutation = useMutation({
    mutationFn: () => {
      const token = apiService.getToken();
      if (!token) throw new Error("Not authenticated");
      return apiService.likeForumPost(token, id);
    },
    onSuccess: (updatedPost) => {
      setVotes(updatedPost.upvotes);
      setDVotes(updatedPost.downvotes);
      setHasLiked(updatedPost.is_liked);
      setHasDisliked(updatedPost.is_disliked);
    },
  });

  const dislikeMutation = useMutation({
    mutationFn: () => {
      const token = apiService.getToken();
      if (!token) throw new Error("Not authenticated");
      return apiService.dislikeForumPost(token, id);
    },
    onSuccess: (updatedPost) => {
      setVotes(updatedPost.upvotes);
      setDVotes(updatedPost.downvotes);
      setHasLiked(updatedPost.is_liked);
      setHasDisliked(updatedPost.is_disliked);
    },
  });

  const saveMutation = useMutation({
    mutationFn: () => {
      const token = apiService.getToken();
      if (!token) throw new Error("Not authenticated");
      return apiService.saveForumPost(token, id);
    },
    onSuccess: (updatedPost) => {
      setHasSaved(updatedPost.is_saved);
      queryClient.invalidateQueries({ queryKey: ["forumPosts", "Saved"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { title: string; content: string }) => {
      const token = apiService.getToken();
      if (!token) throw new Error("Not authenticated");
      return apiService.updateForumPost(token, id, data);
    },
    onSuccess: (updatedPost) => {
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["forumPosts"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      const token = apiService.getToken();
      if (!token) throw new Error("Not authenticated");
      return apiService.deleteForumPost(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forumPosts"] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: (content: string) => {
      const token = apiService.getToken();
      if (!token) throw new Error("Not authenticated");
      return apiService.createForumComment(token, id, { content });
    },
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["forumComments", id] });
      queryClient.invalidateQueries({ queryKey: ["forumPosts"] });
    },
  });

  const handleLike = () => {
    if (likeMutation.isPending || dislikeMutation.isPending) return;
    likeMutation.mutate();
  };

  const handleDislike = () => {
    if (likeMutation.isPending || dislikeMutation.isPending) return;
    dislikeMutation.mutate();
  };

  const handleSave = () => {
    if (saveMutation.isPending) return;
    saveMutation.mutate();
  };

  const handleSaveEdit = () => {
    if (!editTitle.trim() || !editContent.trim()) return;
    updateMutation.mutate({ title: editTitle, content: editContent });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    commentMutation.mutate(newComment);
  };

  const isOwner = user?.id === userId;

  return (
    <article className="bg-white p-8 rounded-[2rem]  border border-slate-100 hover:shadow-xl transition-all duration-500 group animate-fadeInUp mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <img
            src={avatar}
            className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 "
            alt="User"
          />
          <div>
            <h4 className="font-black text-slate-900 text-lg hover:text-[#2563EB] cursor-pointer transition-colors flex items-center gap-2">
              {author}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-[#EEF2FF] text-[#2563EB] px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest border border-blue-50">
                {category}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                {time}
              </span>
            </div>
          </div>
        </div>

        {isOwner && !isEditing && (
          <div className="flex gap-4">
            <button
              onClick={() => setIsEditing(true)}
              className="text-slate-400 hover:text-blue-500 transition-colors p-2"
              title="Edit Post"
            >
              <i className="fa-solid fa-pen-to-square text-lg"></i>
            </button>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this post?")) {
                  deleteMutation.mutate();
                }
              }}
              className="text-slate-400 hover:text-rose-500 transition-colors p-2"
              disabled={deleteMutation.isPending}
              title="Delete Post"
            >
              <i className={`fa-solid fa-trash-can text-lg ${deleteMutation.isPending ? "animate-pulse" : ""}`}></i>
            </button>
          </div>
        )}
      </div>

      <div className="mb-8">
        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full bg-slate-50 py-3 px-6 rounded-md text-xl font-bold border-2 border-slate-100 focus:border-blue-500 outline-none transition-all"
            />
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-slate-50 py-4 px-6 rounded-md text-base font-medium border-2 border-slate-100 focus:border-blue-500 outline-none transition-all min-h-[150px] resize-none"
            />
            <div className="flex gap-4">
              <button
                onClick={handleSaveEdit}
                disabled={updateMutation.isPending}
                className="bg-[#2563EB] text-white px-6 py-2 rounded-md font-bold text-sm uppercase tracking-widest hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditTitle(title);
                  setEditContent(content);
                }}
                className="bg-slate-100 text-slate-600 px-6 py-2 rounded-md font-bold text-sm uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="font-black text-2xl text-slate-900 mb-4 leading-tight group-hover:text-[#2563EB] transition-colors cursor-pointer">
              {title}
            </h3>
            <p className="text-slate-500 text-lg leading-relaxed mb-6 font-medium">
              {content}
            </p>
          </>
        )}
      </div>

      <div className="flex flex-col gap-6 pt-6 border-t border-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <i
                  className={`fa-solid fa-circle-chevron-up text-2xl cursor-pointer transition-all active:scale-95 ${hasLiked
                    ? "text-[#2563EB]"
                    : "text-slate-300 hover:text-[#2563EB]"
                    }`}
                  onClick={handleLike}
                ></i>
                <span className="text-sm font-black text-slate-700 mt-1">{votes}</span>
              </div>
              <div className="flex flex-col items-center">
                <i
                  className={`fa-solid fa-circle-chevron-down text-2xl cursor-pointer transition-all active:scale-95 ${hasDisliked
                    ? "text-rose-500"
                    : "text-slate-300 hover:text-rose-500"
                    }`}
                  onClick={handleDislike}
                ></i>
                <span className="text-sm font-black text-slate-700 mt-1">{dVotes}</span>
              </div>
            </div>

            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-3 text-slate-400 hover:text-[#2563EB] transition-colors group/btn"
            >
              <i className="fa-regular fa-comment-dots text-2xl group-hover/btn:scale-110 transition-transform"></i>
              <span className="text-sm font-black uppercase tracking-widest">{answers} Answers</span>
            </button>

            <button className="flex items-center gap-3 text-slate-400 hover:text-emerald-500 transition-colors group/btn">
              <i className="fa-solid fa-share-nodes text-xl group-hover/btn:scale-110 transition-transform"></i>
              <span className="text-sm font-black uppercase tracking-widest">Share</span>
            </button>
          </div>

          <button 
            onClick={handleSave}
            className={`flex items-center gap-3 transition-colors ${hasSaved ? "text-amber-500" : "text-slate-300 hover:text-amber-500"}`}
          >
            <i className={`fa-solid fa-bookmark text-xl ${hasSaved ? "" : "fa-regular"}`}></i>
            <span className="text-sm font-black uppercase tracking-widest">{hasSaved ? "Saved" : "Save"}</span>
          </button>
        </div>

        {showComments && (
          <div className="mt-4 space-y-6 pt-6 border-t border-slate-50 animate-fadeIn">
            <form onSubmit={handleAddComment} className="flex gap-4">
              <img src={user?.first_name ? `https://api.dicebear.com/7.x/notionists/svg?seed=${user.first_name}` : avatar} className="w-10 h-10 rounded-full" alt="Me" />
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Shared your thoughts..." 
                  className="w-full bg-slate-50 border border-slate-100 rounded-md py-2.5 px-4 text-sm font-medium outline-none focus:border-blue-500 transition-all"
                />
                <button type="submit" className="absolute right-2 top-1.5 text-blue-600 hover:bg-blue-50 p-1 rounded-md transition-all">
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
              </div>
            </form>

            <div className="space-y-4">
              {isLoadingComments ? (
                <div className="flex justify-center py-4"><div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
              ) : comments?.comments?.map((comment: any) => (
                <div key={comment.id} className="flex gap-4 p-4 rounded-md bg-slate-50/50 border border-slate-50">
                  <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${comment.user.first_name}`} className="w-8 h-8 rounded-full" alt={comment.user.first_name} />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-xs text-slate-900">{comment.user.first_name}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Just now</span>
                    </div>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default PostCard;
