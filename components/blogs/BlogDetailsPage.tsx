"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getBlogById, getRelatedBlogs } from "@/lib/blogs-data";

interface CommentItem {
  id: string;
  author: string;
  avatar: string;
  time: string;
  message: string;
  likes: number;
}

const BlogDetailsPage: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  const blog = id ? getBlogById(id) : undefined;
  const related = blog && id ? getRelatedBlogs(id, blog.category) : [];

  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState<CommentItem[]>([
    {
      id: "seed-1",
      author: "Rohan Sharma",
      avatar: "R",
      time: "2 days ago",
      message:
        "This extension is really helpful. I was having issues with document upload due to internet connectivity problems in my area.",
      likes: 6,
    },
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const topCategory = useMemo(() => {
    if (!blog) return "Admission";
    if (blog.category === "Career Advice") return "Admission";
    if (blog.category === "Study Tips") return "Exam";
    return "Fee";
  }, [blog]);

  const topCategoryClass = useMemo(() => {
    if (topCategory === "Admission") return "bg-[#1e3a8a]";
    if (topCategory === "Exam") return "bg-red-500";
    return "bg-yellow-600";
  }, [topCategory]);

  const postComment = () => {
    const text = commentInput.trim();
    if (!text) return;

    setComments((prev) => [
      {
        id: `${Date.now()}`,
        author: "You (Guest)",
        avatar: "Y",
        time: "Just now",
        message: text,
        likes: 0,
      },
      ...prev,
    ]);
    setCommentInput("");
  };

  if (!blog || !id) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-slate-500 font-semibold">
        Blog post not found.
      </div>
    );
  }

  return (
    <div className="text-gray-800 antialiased selection:bg-blue-200 selection:text-blue-900 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col lg:flex-row gap-8 lg:gap-12">
        <main className="lg:w-2/3">
          <div className="flex items-center gap-4 text-sm mb-4">
            <span className={`${topCategoryClass} text-white px-3 py-1 rounded-full font-medium flex items-center gap-1.5`}>
              <i className="fa-solid fa-graduation-cap text-xs"></i> {topCategory}
            </span>
            <span className="text-gray-500 flex items-center gap-1.5">
              <i className="fa-regular fa-clock"></i> 90 days ago
            </span>
            <span className="text-gray-500 flex items-center gap-1.5 ml-auto sm:ml-0">
              <i className="fa-regular fa-eye"></i> 200 views
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">{blog.title}</h1>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-gray-600 border-b border-gray-100 pb-6 mb-6">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-user text-gray-400"></i>
              <span>
                Published by: <strong className="text-gray-900 font-semibold">{blog.author}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fa-regular fa-calendar text-gray-400"></i>
              <span>
                Latest Update: <strong className="text-gray-900 font-semibold">Today</strong>
              </span>
            </div>
          </div>

          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-[300px] sm:h-[400px] object-cover rounded-xl mb-8"
          />

          <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-xl mb-8 text-gray-700 text-sm sm:text-base leading-relaxed">
            {blog.excerpt}
          </div>

          <div className="prose max-w-none text-gray-700">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Revised Schedule</h2>
            <p className="mb-4">
              The previous deadline for counseling registration was set for December 10th, 2024. The new revised schedule is as follows:
            </p>

            <ul className="list-disc pl-5 mb-8 space-y-2 marker:text-gray-400">
              <li>
                <strong>New Registration Deadline:</strong> December 20th, 2024 (5:00 PM NST)
              </li>
              <li>
                <strong>Choice Filling Deadline:</strong> December 20th, 2024
              </li>
              <li>
                <strong>Seat Allotment (Round 1):</strong> December 25th, 2024
              </li>
              <li>
                <strong>Fee Payment & Document Verification:</strong> December 26th - 28th, 2024
              </li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mb-4">Instructions for Applicants</h2>
            <p className="mb-4">All registered candidates must follow these steps:</p>

            <ol className="list-decimal pl-5 mb-8 space-y-2">
              <li>Log in to the admission portal using your credentials</li>
              <li>Verify and update your personal information if needed</li>
              <li>Complete the choice filling process carefully</li>
              <li>Submit the application before the deadline</li>
              <li>Keep your documents ready for verification</li>
            </ol>

            <div className="text-gray-700 whitespace-pre-line mb-8">{blog.content}</div>
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
            <span className="text-gray-900 font-medium">Share this announcement:</span>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors" aria-label="Share on Facebook">
                <i className="fa-brands fa-facebook-f text-sm"></i>
              </button>
              <button className="w-8 h-8 rounded-full bg-blue-400 text-white flex items-center justify-center hover:bg-blue-500 transition-colors" aria-label="Share on Instagram">
                <i className="fa-brands fa-instagram text-sm"></i>
              </button>
              <button className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors" aria-label="Share on LinkedIn">
                <i className="fa-brands fa-linkedin-in text-sm"></i>
              </button>
              <button className="w-8 h-8 rounded-full bg-blue-400 text-white flex items-center justify-center hover:bg-blue-500 transition-colors" aria-label="Copy Link">
                <i className="fa-solid fa-link text-sm"></i>
              </button>
            </div>
          </div>

          <section>
            <div className="flex items-center gap-2 mb-6">
              <i className="fa-solid fa-comments text-blue-600 text-xl"></i>
              <h2 className="text-xl font-bold text-gray-900">Comments & Discussion</h2>
            </div>

            <div className="mb-10">
              <textarea
                value={commentInput}
                onChange={(event) => setCommentInput(event.target.value)}
                className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm placeholder-gray-400"
                rows={4}
                placeholder="Join the discussion..."
              ></textarea>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <i className="fa-solid fa-circle-info text-gray-400"></i> Please keep comments respectful
                </span>
                <button
                  onClick={postComment}
                  className="bg-[#2563eb] hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg text-sm transition-colors"
                >
                  Post Comment
                </button>
              </div>
            </div>

            <div className="space-y-6 pl-2">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4 relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1e3a8a] rounded-full"></div>

                  <div className="flex-shrink-0 pl-4">
                    <div
                      className={`w-10 h-10 rounded-full ${
                        comment.author.startsWith("You")
                          ? "bg-green-100 text-green-600"
                          : "bg-blue-100 text-blue-600"
                      } flex items-center justify-center font-bold text-sm`}
                    >
                      {comment.avatar}
                    </div>
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="mb-1">
                      <h4 className="font-bold text-sm text-gray-900 inline-block mr-2">{comment.author}</h4>
                      <span className="text-xs text-gray-400">{comment.time}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed mb-3 whitespace-pre-wrap">{comment.message}</p>
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
              <h3 className="text-lg font-bold text-gray-900">Related Articles</h3>
            </div>

            <div className="space-y-8">
              {related.map((rel, idx) => {
                const tag = idx % 3 === 0 ? "Scholarship" : idx % 3 === 1 ? "Exam" : "Fee";
                const tagClass =
                  tag === "Scholarship"
                    ? "bg-green-100 text-green-700"
                    : tag === "Exam"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700";

                return (
                  <Link
                    key={rel.id}
                    href={`/blogs/${rel.id}`}
                    className="group block text-left w-full"
                  >
                    <img
                      src={rel.image}
                      alt={rel.title}
                      className="w-full h-40 object-cover rounded-xl mb-3"
                    />
                    <div className="flex justify-between items-center mb-2">
                      <span className={`${tagClass} text-xs font-semibold px-2 py-0.5 rounded`}>{tag}</span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <i className="fa-regular fa-clock"></i> 90 days ago
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-2">{rel.excerpt}</p>
                  </Link>
                );
              })}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                View all articles <i className="fa-solid fa-arrow-right text-xs"></i>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BlogDetailsPage;
