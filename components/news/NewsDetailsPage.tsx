"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/services/AuthContext";
import {
  fetchNewsComments,
  postNewsComment,
  NewsComment,
} from "@/services/newsApi";

function normalizeArticle(data: any): any {
  if (!data) return null;

  const isProvider =
    data.published_by !== undefined || data.image_url !== undefined;

  if (isProvider) {
    return {
      ...data,
      image: data.image_url || "",
      author: data.published_by || "Unknown",
      excerpt: data.short_desc || "",
      category: data.news_type || "News",
      date: data.publish_date || data.published_at || data.created_at || "",
    };
  }

  return {
    ...data,
    excerpt: data.excerpt || data.desc || "",
    date: data.date || data.created || "",
  };
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "Recently";

  const date = new Date(dateStr);

  if (isNaN(date.getTime())) return dateStr;

  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 0) {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";

  if (days < 30) return `${days} days ago`;

  if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getImageUrl(image: string | null | undefined): string | null {
  if (!image) return null;

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return image;
}

const NewsDetailsPage: React.FC<{
  params: Promise<{ id: string }>;
}> = ({ params }) => {
  const { user, isAuthenticated } = useAuth();
  const [id, setId] = useState<string | null>(null);
  const [article, setArticle] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<NewsComment[]>([]);
  const [postingComment, setPostingComment] = useState(false);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;

    async function fetchNews() {
      const safeId = id!;
      const API_BASE =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

      try {
        if (safeId.startsWith("provider-")) {
          const actualId = safeId.replace("provider-", "");
          const res = await fetch(`${API_BASE}/api/v1/public/news/${actualId}`);
          const data = await res.json();
          if (data?.data) {
            setArticle(normalizeArticle(data.data));
            return;
          }
        } else if (safeId.startsWith("inst-")) {
          const actualId = safeId.replace("inst-", "");
          const res = await fetch(
            `${API_BASE}/api/v1/institutions/public/news/${actualId}`,
          );
          const data = await res.json();
          if (data?.data) {
            setArticle(normalizeArticle(data.data));
            return;
          }
        } else if (safeId.startsWith("edu-")) {
          const actualId = safeId.replace("edu-", "");
          const res = await fetch(
            `${API_BASE}/api/v1/education/news/${actualId}`,
          );
          const data = await res.json();
          if (data?.data) {
            setArticle(normalizeArticle(data.data));
            return;
          }
        } else {
          const res = await fetch(`${API_BASE}/api/v1/public/news/${safeId}`);
          const data = await res.json();
          if (data?.data) {
            setArticle(normalizeArticle(data.data));
            return;
          }
        }

        setArticle(null);
      } catch (e) {
        console.error("Failed to fetch news:", e);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetchNewsComments(id).then((data) => {
      if (data && data.length > 0) setComments(data);
    });
  }, [id]);

  const [commentInput, setCommentInput] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const categoryUi = useMemo(() => {
    if (!article) return "Notice";

    if (article.category === "Academic") return "Admission";
    if (article.category === "Tech") return "Exam";
    if (article.category === "Jobs") return "Fee";
    if (article.category === "Policy") return "Notice";
    if (article.category === "Events") return "Events";
    if (article.category === "Announcements") return "Notice";
    if (article.category === "Academics") return "Admission";
    if (article.category === "Sports") return "Events";

    return "Notice";
  }, [article]);

  const categoryBadgeClass = useMemo(() => {
    if (categoryUi === "Admission") return "bg-blue-600";
    if (categoryUi === "Exam") return "bg-red-500";
    if (categoryUi === "Fee") return "bg-orange-500";

    return "bg-indigo-600";
  }, [categoryUi]);

  const postComment = async () => {
    const text = commentInput.trim();
    if (!text || !id || !isAuthenticated) return;

    setPostingComment(true);
    try {
      const authorName = user ? `${user.first_name} ${user.last_name}` : "User";
      const avatarUrl =
        user?.image_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random`;

      const newComment = await postNewsComment(id, {
        author: authorName,
        avatar: avatarUrl,
        message: text,
      });

      if (newComment) {
        setComments((prev) => [newComment, ...prev]);
        setCommentInput("");
      }
    } catch {
      // silently fail
    } finally {
      setPostingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!article || !id) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-slate-500 font-semibold">
        Article not found.
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-800 antialiased selection:bg-blue-200 selection:text-blue-900">
      <div className="max-w-350 mx-auto py-8 flex flex-col lg:flex-row gap-10 lg:gap-16 px-4 sm:px-6">
        <main className="w-full lg:w-[68%]">
          <div className="flex items-center gap-4 text-sm font-medium text-gray-500 mb-6 border-b border-gray-100 pb-4">
            <span
              className={`${categoryBadgeClass} text-white px-3 py-1 rounded-full flex items-center gap-1.5`}
            >
              <i className="fa-solid fa-graduation-cap text-sm"></i>
              {categoryUi}
            </span>

            <span className="flex items-center gap-1.5">
              <i className="fa-regular fa-clock"></i>
              {formatDate(article.date)}
            </span>

            {article.views > 0 && (
              <span className="flex items-center gap-1.5 ml-auto">
                <i className="fa-regular fa-eye"></i>
                {article.views} views
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-[2.5rem] font-bold leading-tight mb-6 text-gray-900 tracking-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-user text-gray-800"></i>

              <span>
                Published by:{" "}
                <strong className="text-gray-900 font-semibold">
                  {article.author}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <i className="fa-solid fa-calendar text-gray-800"></i>

              <span>
                Latest Update:{" "}
                <strong className="text-gray-900 font-semibold">
                  {formatDate(article.date)}
                </strong>
              </span>
            </div>
          </div>

          {getImageUrl(article.image) && (
            <div className="mb-8 rounded-xl overflow-hidden border border-gray-100">
              <img
                src={getImageUrl(article.image)!}
                alt={article.title}
                className="w-full h-auto max-h-[450px] object-cover hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          )}

          {article.excerpt && (
            <div className="news-content prose prose-slate max-w-none break-words bg-blue-50 border-l-[3px] border-blue-500 p-5 md:p-6 rounded-r-xl mb-10">
              <div
                dangerouslySetInnerHTML={{
                  __html: article.excerpt,
                }}
              />
            </div>
          )}

          <div
            className="news-content prose prose-slate max-w-none break-words overflow-hidden mb-12 prose-img:max-w-full prose-img:h-auto prose-img:rounded-xl prose-pre:overflow-x-auto prose-pre:whitespace-pre-wrap prose-table:block prose-table:overflow-x-auto prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700"
            dangerouslySetInnerHTML={{
              __html: article.content || article.excerpt || "",
            }}
          />

          <hr className="border-gray-100 mb-8" />

          <div className="mb-10">
            <h3 className="text-lg font-bold mb-4 text-gray-900">Tags:</h3>

            <div className="flex flex-wrap gap-2.5">
              {(article.tags || []).map((tag: string) => (
                <button
                  key={tag}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <section className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <i className="fa-solid fa-comments text-blue-600 text-2xl"></i>

              <h2 className="text-2xl font-bold text-gray-900">
                Comments & Discussion
              </h2>
            </div>

            <div className="mb-8 bg-white border border-gray-200 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
              <textarea
                value={commentInput}
                onChange={(event) => setCommentInput(event.target.value)}
                rows={4}
                className="w-full p-4 outline-none resize-y text-gray-700 placeholder-gray-400"
                placeholder={
                  isAuthenticated
                    ? "Join the discussion..."
                    : "Log in to comment..."
                }
                readOnly={!isAuthenticated}
              ></textarea>

              <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <i className="fa-solid fa-circle-info text-gray-400"></i>

                  <span>Please keep comments respectful</span>
                </div>

                {isAuthenticated ? (
                  <button
                    onClick={postComment}
                    disabled={postingComment || !commentInput.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-5 py-2 rounded-md text-sm font-semibold transition-colors active:scale-95"
                  >
                    {postingComment ? "Posting..." : "Post Comment"}
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-semibold transition-colors"
                  >
                    Log in to Comment
                  </Link>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id}>
                  <div className="border border-gray-200 rounded-xl p-5 bg-white">
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className={`w-10 h-10 rounded-full ${
                          comment.author.startsWith("You")
                            ? "bg-green-100 text-green-600"
                            : "bg-blue-100 text-blue-600"
                        } flex items-center justify-center font-bold text-sm shrink-0`}
                      >
                        {comment.avatar}
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">
                          {comment.author}
                        </h4>

                        <span className="text-xs text-gray-500">
                          {comment.time}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                      {comment.message}
                    </p>

                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                      <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                        <i className="fa-regular fa-heart"></i>
                        {comment.likes}
                      </button>

                      <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                        <i className="fa-regular fa-comment"></i>
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <aside className="w-full lg:w-[32%] lg:max-w-[400px]">
          <div className="lg:sticky lg:top-8">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-3">
              <i className="fa-regular fa-newspaper text-blue-600 text-[1.2rem]"></i>

              <h2 className="text-xl font-bold text-gray-900">
                Related Articles
              </h2>
            </div>

            <div className="space-y-6">
              {related.length > 0 ? (
                related.map((rel, idx) => {
                  const relCategoryUi =
                    rel.category === "Academic"
                      ? "Admission"
                      : rel.category === "Tech"
                        ? "Exam"
                        : rel.category === "Jobs"
                          ? "Fee"
                          : "Notice";

                  const relBadge =
                    relCategoryUi === "Admission"
                      ? "bg-blue-600"
                      : relCategoryUi === "Exam"
                        ? "bg-red-500"
                        : relCategoryUi === "Fee"
                          ? "bg-orange-500"
                          : "bg-indigo-600";

                  return (
                    <div key={rel.id}>
                      <Link
                        href={`/news/${rel.id}`}
                        className="group cursor-pointer block"
                      >
                        {getImageUrl(rel.image) && (
                          <div className="rounded-xl overflow-hidden mb-3">
                            <img
                              src={getImageUrl(rel.image)!}
                              alt={rel.title}
                              className="w-full h-[150px] object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`${relBadge} text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full tracking-wide uppercase`}
                          >
                            {relCategoryUi}
                          </span>

                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <i className="fa-regular fa-clock"></i>

                            {formatDate(rel.date)}
                          </span>
                        </div>

                        <h3 className="font-bold text-[1.1rem] leading-snug text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                          {rel.title}
                        </h3>

                        <p className="text-sm text-gray-600 line-clamp-2">
                          {rel.excerpt}
                        </p>
                      </Link>

                      {idx !== related.length - 1 && (
                        <hr className="border-gray-100 mt-6" />
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-sm text-gray-500">
                  No related articles found.
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      <style jsx global>{`
        .news-content {
          overflow-wrap: break-word;
          word-break: break-word;
        }
        .news-content iframe {
          width: 100%;
          min-height: 400px;
          border-radius: 12px;
        }

        .news-content img {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
        }

        .news-content table {
          width: 100%;
          display: block;
          overflow-x: auto;
        }

        .news-content pre {
          overflow-x: auto;
          padding: 1rem;
          border-radius: 0.75rem;
          background: #0f172a;
          color: white;
        }

        .news-content code {
          white-space: pre-wrap;
          word-break: break-word;
        }

        .news-content ul {
          list-style: disc;
          padding-left: 1.5rem;
        }

        .news-content ol {
          list-style: decimal;
          padding-left: 1.5rem;
        }

        .news-content blockquote {
          border-left: 4px solid #2563eb;
          padding-left: 1rem;
          color: #475569;
          font-style: italic;
        }

        .news-content a {
          color: #2563eb;
          text-decoration: underline;
          font-weight: 500;
        }

        .news-content a:hover {
          color: #1d4ed8;
        }
      `}</style>
    </div>
  );
};

export default NewsDetailsPage;
