"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  fetchPublicBlogById,
  fetchPublicBlogBySlug,
  fetchBlogComments,
  postBlogComment,
  BlogEntry,
  BlogComment,
} from "@/services/blogApi";
import {
  getPublicBlogByID,
  getPublicBlogBySlug,
} from "@/services/scholarshipProviderApi";
import { useAuth } from "@/services/AuthContext";
import { getImageUrl, stripHtml } from "@/services/api";
import RichText from "@/components/RichText";

const BlogDetailsPage: React.FC<{ params: Promise<{ slug: string }> }> = ({
  params,
}) => {
  const { user } = useAuth();
  const [id, setId] = useState<string | null>(null);
  const [blog, setBlog] = useState<BlogEntry | null>(null);
  const [related, setRelated] = useState<BlogEntry[]>([]);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [postingComment, setPostingComment] = useState(false);

  useEffect(() => {
    params.then((p) => setId(p.slug));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    async function fetchBlog() {
      const safeId = id!;
      try {
        const isProvider = safeId.startsWith("provider-");

        if (isProvider) {
          const slug = safeId.replace("provider-", "");
          const blogData = await getPublicBlogBySlug(slug);
          if (blogData) {
            setBlog({
              id: blogData.id || 0,
              title: blogData.title,
              slug: slug,
              excerpt: blogData.content?.slice(0, 200) || "",
              content: blogData.content || "",
              image: blogData.image_url || "",
              author: blogData.author || "Provider",
              category: "Others",
              tags: [],
              read_time: "3 min",
              featured: false,
              published: blogData.status === "published",
              views: blogData.views || 0,
              created_at: blogData.published_at || blogData.created_at,
            });
            setRelated([]);
          }
        } else {
          let blogResult, commentsData;
          if (/^\d+$/.test(safeId)) {
            const API_BASE =
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
            const res = await fetch(
              `${API_BASE}/api/v1/education/blogs/${safeId}`,
            );
            const json = await res.json();
            blogResult = json?.data || json;
            commentsData = await fetchBlogComments(safeId).catch(() => []);
          } else {
            [blogResult, commentsData] = await Promise.all([
              fetchPublicBlogBySlug(safeId),
              fetchBlogComments(safeId),
            ]);
          }
          if (blogResult) {
            setBlog(blogResult.blog);
            setRelated(blogResult.related);
          }
          setComments(commentsData || []);
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBlog();
  }, [id]);

  const [commentInput, setCommentInput] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const topCategory = useMemo(() => {
    if (!blog) return "Admission";
    return blog.category || "Others";
  }, [blog]);

  const topCategoryClass = useMemo(() => {
    if (topCategory === "Scholarship") return "bg-emerald-500";
    if (topCategory === "Admission") return "bg-blue-700";
    if (topCategory === "Exams") return "bg-red-500";
    if (topCategory === "Events") return "bg-purple-500";
    if (topCategory === "Achievements") return "bg-amber-500";
    if (topCategory === "Notice") return "bg-indigo-500";
    return "bg-slate-500";
  }, [topCategory]);

  const postComment = async () => {
    const text = commentInput.trim();
    if (!text || !id) return;

    setPostingComment(true);
    try {
      const authorName = user
        ? `${user.first_name} ${user.last_name}`
        : "Guest User";
      const initial = authorName.charAt(0).toUpperCase();
      const avatarUrl =
        user?.image_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random`;

      const newComment = await postBlogComment(id, {
        author: authorName,
        avatar: avatarUrl,
        message: text,
      });
      setComments([newComment, ...comments]);
      setCommentInput("");
    } catch (err) {
      console.error("Failed to post comment:", err);
      alert("Failed to post comment. Please try again.");
    } finally {
      setPostingComment(false);
    }
  };

  if (loading || !id) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-slate-500 font-semibold">
        Blog post not found.
      </div>
    );
  }

  return (
    <div className="text-gray-800 antialiased selection:bg-blue-200 selection:text-blue-900 bg-white">
      <div className="max-w-350 mx-auto py-8 lg:py-12 flex flex-col lg:flex-row gap-8 lg:gap-12 px-4 sm:px-6">
        <main className="lg:w-2/3">
          <div className="flex items-center gap-4 text-sm mb-4">
            <span
              className={`${topCategoryClass} text-white px-3 py-1 rounded-full font-medium flex items-center gap-1.5`}
            >
              <i className="fa-solid fa-graduation-cap text-xs"></i>{" "}
              {topCategory}
            </span>
            <span className="text-gray-500 flex items-center gap-1.5">
              <i className="fa-regular fa-clock"></i>{" "}
              {new Date(blog.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="text-gray-500 flex items-center gap-1.5 ml-auto sm:ml-0">
              <i className="fa-regular fa-eye"></i> {blog.views} views
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-gray-600 border-b border-gray-100 pb-6 mb-6">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-user text-gray-400"></i>
              <span>
                Published by:{" "}
                <strong className="text-gray-900 font-semibold">
                  {blog.author}
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fa-regular fa-calendar text-gray-400"></i>
              <span>
                Latest Update:{" "}
                <strong className="text-gray-900 font-semibold">Today</strong>
              </span>
            </div>
          </div>

          <div className="w-full h-[300px] sm:h-[400px] rounded-md mb-8 overflow-hidden bg-gray-100">
            <img
              src={getImageUrl(blog.image)}
              alt={blog.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = getImageUrl("");
              }}
            />
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-xl mb-8 text-gray-700 text-sm sm:text-base leading-relaxed news-content">
            <RichText html={blog.excerpt} variant="sm" />
          </div>

          <div className="prose max-w-none text-gray-700 [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_code]:break-words [&_img]:max-w-full news-content">
            <RichText html={blog.content} className="text-gray-700 mb-8" />
          </div>

          <div className="mt-8 mb-6 flex flex-wrap items-center gap-3">
            <span className="text-gray-900 font-medium">Tags:</span>
            {blog.tags.map((tag) => (
              <button
                key={tag}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-1.5 rounded-full text-xs font-medium transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-b border-gray-100 py-4 mb-10">
            <span className="text-gray-900 font-medium">
              Share this announcement:
            </span>
            <div className="flex items-center gap-2">
              <button
                className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors"
                aria-label="Share on Facebook"
              >
                <i className="fa-brands fa-facebook-f text-sm"></i>
              </button>
              <button
                className="w-8 h-8 rounded-full bg-blue-400 text-white flex items-center justify-center hover:bg-blue-500 transition-colors"
                aria-label="Share on Instagram"
              >
                <i className="fa-brands fa-instagram text-sm"></i>
              </button>
              <button
                className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                aria-label="Share on LinkedIn"
              >
                <i className="fa-brands fa-linkedin-in text-sm"></i>
              </button>
              <button
                className="w-8 h-8 rounded-full bg-blue-400 text-white flex items-center justify-center hover:bg-blue-500 transition-colors"
                aria-label="Copy Link"
              >
                <i className="fa-solid fa-link text-sm"></i>
              </button>
            </div>
          </div>

          <section>
            <div className="flex items-center gap-2 mb-6">
              <i className="fa-solid fa-comments text-blue-600 text-xl"></i>
              <h2 className="text-xl font-bold text-gray-900">
                Comments & Discussion
              </h2>
            </div>

            <div className="mb-10">
              <textarea
                value={commentInput}
                onChange={(event) => setCommentInput(event.target.value)}
                className="w-full border border-gray-200 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm placeholder-gray-400"
                rows={4}
                placeholder="Join the discussion..."
              ></textarea>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <i className="fa-solid fa-circle-info text-gray-400"></i>{" "}
                  Please keep comments respectful
                </span>
                <button
                  onClick={postComment}
                  disabled={postingComment || !commentInput.trim()}
                  className="bg-[#2563eb] hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded-lg text-sm transition-colors"
                >
                  {postingComment ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>

            <div className="space-y-6 pl-2">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4 relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1e3a8a] rounded-full"></div>

                  <div className="flex-shrink-0 pl-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                      {comment.avatar && comment.avatar.startsWith("http") ? (
                        <img
                          src={comment.avatar}
                          alt={comment.author}
                          className="w-full h-full rounded-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                            (
                              e.target as HTMLImageElement
                            ).parentElement!.innerText = comment.author
                              .charAt(0)
                              .toUpperCase();
                          }}
                        />
                      ) : (
                        comment.avatar || comment.author.charAt(0).toUpperCase()
                      )}
                    </div>
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="mb-1">
                      <h4 className="font-bold text-sm text-gray-900 inline-block mr-2">
                        {comment.author}
                      </h4>
                      <span className="text-xs text-gray-400">
                        {comment.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed mb-3 whitespace-pre-wrap">
                      {comment.message}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                        <i className="fa-regular fa-heart"></i> {comment.likes}
                      </button>
                      <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                        <i className="fa-regular fa-comment"></i> Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <aside className="lg:w-1/3 mt-12 lg:mt-0">
          <div className="sticky top-8">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2">
              <i className="fa-regular fa-copy text-blue-600 text-lg"></i>
              <h3 className="text-lg font-bold text-gray-900">
                Related Articles
              </h3>
            </div>

            <div className="space-y-8">
              {related.map((rel, idx) => {
                const tag =
                  idx % 3 === 0
                    ? "Scholarship"
                    : idx % 3 === 1
                      ? "Exam"
                      : "Fee";
                const tagClass =
                  tag === "Scholarship"
                    ? "bg-green-100 text-green-700"
                    : tag === "Exam"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700";

                return (
                  <Link
                    key={rel.id}
                    href={`/blogs/${(rel as any).slug || rel.id}`}
                    className="group block text-left w-full"
                  >
                    <img
                      src={getImageUrl(rel.image)}
                      alt={rel.title}
                      className="w-full h-40 object-cover rounded-md mb-3"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getImageUrl("");
                      }}
                    />
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className={`${tagClass} text-xs font-semibold px-2 py-0.5 rounded`}
                      >
                        {tag}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <i className="fa-regular fa-clock"></i> 90 days ago
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {stripHtml(rel.excerpt)}
                    </p>
                  </Link>
                );
              })}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                View all articles{" "}
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </Link>
            </div>
          </div>
        </aside>
      </div>
      <style>{`
        .news-content { overflow-wrap: break-word; word-break: break-word; }
        .news-content a { color: #2563eb !important; text-decoration: underline !important; font-weight: 500 !important; }
        .news-content a:hover { color: #1d4ed8 !important; }
      `}</style>
    </div>
  );
};

export default BlogDetailsPage;
