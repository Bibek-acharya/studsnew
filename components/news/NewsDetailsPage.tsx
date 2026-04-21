"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

interface CommentItem {
  id: string;
  author: string;
  avatar: string;
  time: string;
  message: string;
  likes: number;
}

const NewsDetailsPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const [id, setId] = useState<string | null>(null);
  const [article, setArticle] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    
    async function fetchNews() {
      try {
        const res = await fetch(`/api/v1/news/${id}`);
        const data = await res.json();
        if (data?.data) {
          setArticle(data.data);
          
          // Fetch related news
          const relatedRes = await fetch(`/api/v1/news?category=${data.data.category}`);
          const relatedData = await relatedRes.json();
          if (relatedData?.data?.news) {
            setRelated(relatedData.data.news.filter((n: any) => String(n.id) !== id).slice(0, 3));
          }
        }
      } catch (e) {
        console.error("Failed to fetch news:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, [id]);

  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState<CommentItem[]>([
    {
      id: "seed-1",
      author: "Rohan Sharma",
      avatar: "R",
      time: "2 days ago",
      message:
        "This extension is really helpful. I was having issues with document upload due to internet connectivity problems in my area.",
      likes: 8,
    },
  ]);

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

  const postComment = () => {
    const text = commentInput.trim();
    if (!text) return;

    const newComment: CommentItem = {
      id: `${Date.now()}`,
      author: "You (Guest)",
      avatar: "Y",
      time: "Just now",
      message: text,
      likes: 0,
    };

    setComments((prev) => [newComment, ...prev]);
    setCommentInput("");
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
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-10 lg:gap-16">
        <main className="w-full lg:w-[68%]">
          <div className="flex items-center gap-4 text-sm font-medium text-gray-500 mb-6 border-b border-gray-100 pb-4">
            <span className={`${categoryBadgeClass} text-white px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm`}>
              <i className="fa-solid fa-graduation-cap text-sm"></i> {categoryUi}
            </span>
            <span className="flex items-center gap-1.5">
              <i className="fa-regular fa-clock"></i> 90 days ago
            </span>
            <span className="flex items-center gap-1.5 ml-auto">
              <i className="fa-regular fa-eye"></i> 200 views
            </span>
          </div>

          <h1 className="text-3xl md:text-[2.5rem] font-bold leading-tight mb-6 text-gray-900 tracking-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-user text-gray-800"></i>
              <span>
                Published by: <strong className="text-gray-900 font-semibold">{article.author}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-calendar text-gray-800"></i>
              <span>
                Latest Update: <strong className="text-gray-900 font-semibold">Today</strong>
              </span>
            </div>
          </div>

          <div className="mb-8 rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-auto max-h-[450px] object-cover hover:scale-[1.02] transition-transform duration-500"
            />
          </div>

          <div className="bg-blue-50 border-l-[3px] border-blue-500 p-5 md:p-6 rounded-r-xl mb-10 text-gray-700 leading-relaxed text-[1.05rem]">
            {article.excerpt}
          </div>

          <div className="prose prose-slate max-w-none mb-12 text-gray-700 leading-relaxed text-[1.05rem]">
            {(article.content || "").split("\n").map((paragraph: string, idx: number) => (
              <p key={idx} className="mb-4">{paragraph}</p>
            ))}
          </div>

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

          <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
            <h3 className="text-lg font-bold text-gray-900">Share this announcement:</h3>
            <div className="flex gap-2">
              {[
                { icon: "fa-facebook-f", color: "bg-blue-500 hover:bg-blue-600" },
                { icon: "fa-instagram", color: "bg-blue-400 hover:bg-blue-500" },
                { icon: "fa-linkedin-in", color: "bg-blue-600 hover:bg-blue-700" },
                { icon: "fa-x-twitter", color: "bg-black hover:bg-gray-800" },
              ].map((social) => (
                <button
                  key={social.icon}
                  className={`w-9 h-9 rounded-full ${social.color} flex items-center justify-center text-white transition-colors`}
                >
                  <i className={`fa-brands ${social.icon} text-sm`}></i>
                </button>
              ))}
            </div>
          </div>

          <section className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <i className="fa-solid fa-comments text-blue-600 text-2xl"></i>
              <h2 className="text-2xl font-bold text-gray-900">Comments & Discussion</h2>
            </div>

            <div className="mb-8 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
              <textarea
                value={commentInput}
                onChange={(event) => setCommentInput(event.target.value)}
                rows={4}
                className="w-full p-4 outline-none resize-y text-gray-700 placeholder-gray-400"
                placeholder="Join the discussion..."
              ></textarea>
              <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <i className="fa-solid fa-circle-info text-gray-400"></i>
                  <span>Please keep comments respectful</span>
                </div>
                <button
                  onClick={postComment}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm active:scale-95"
                >
                  Post Comment
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="relative">
                  <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-full ${comment.author.startsWith("You") ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"} flex items-center justify-center font-bold text-sm shrink-0`}>
                        {comment.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{comment.author}</h4>
                        <span className="text-xs text-gray-500">{comment.time}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-4 whitespace-pre-wrap">{comment.message}</p>
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
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

        <aside className="w-full lg:w-[32%] lg:max-w-[400px]">
          <div className="lg:sticky lg:top-8">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-3">
              <i className="fa-regular fa-newspaper text-blue-600 text-[1.2rem]"></i>
              <h2 className="text-xl font-bold text-gray-900">Related Articles</h2>
            </div>

            <div className="space-y-6">
              {related.length > 0 ? (
                related.map((rel, idx) => {
                  const relCategory = idx % 3 === 0 ? "Scholarship" : idx % 3 === 1 ? "Exam" : "Fee";
                  const relBadge =
                    relCategory === "Scholarship"
                      ? "bg-green-500"
                      : relCategory === "Exam"
                        ? "bg-red-500"
                        : "bg-orange-500";

                  return (
                    <div key={rel.id}>
                      <Link href={`/news/${rel.id}`} className="group cursor-pointer block">
                        <div className="rounded-lg overflow-hidden mb-3">
                          <img
                            src={rel.image}
                            alt={rel.title}
                            className="w-full h-[150px] object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`${relBadge} text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full tracking-wide uppercase`}>
                            {relCategory}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <i className="fa-regular fa-clock"></i> 90 days ago
                          </span>
                        </div>
                        <h3 className="font-bold text-[1.1rem] leading-snug text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                          {rel.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{rel.excerpt}</p>
                      </Link>
                      {idx !== related.length - 1 && <hr className="border-gray-100 mt-6" />}
                    </div>
                  );
                })
              ) : (
                <div className="text-sm text-gray-500">No related articles found.</div>
              )}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors group"
              >
                View all articles
                <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default NewsDetailsPage;
