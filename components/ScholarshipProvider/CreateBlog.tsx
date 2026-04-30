"use client";

import React, { useState, useCallback, memo } from "react";
import dynamic from "next/dynamic";
import { Home, Feather, UploadCloud } from "lucide-react";
import { scholarshipProviderApi } from "@/services/scholarshipProviderApi";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const quillModules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link", "image"],
    ["clean"],
  ],
};

const quillFormats = ["bold", "italic", "underline", "strike", "list", "align", "link", "image"];

const BLOG_TYPES = [
  { value: "story", label: "Success Story" },
  { value: "impact", label: "Impact Story" },
  { value: "update", label: "Organization Update" },
  { value: "opinion", label: "Opinion/Editorial" },
  { value: "tutorial", label: "Tutorial/Guide" },
  { value: "interview", label: "Interview" },
];

const CATEGORIES = [
  { value: "education", label: "Education" },
  { value: "health", label: "Health" },
  { value: "community", label: "Community" },
  { value: "disaster-relief", label: "Disaster Relief" },
  { value: "leadership", label: "Leadership" },
];

const PUBLISHED_BY = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "guest", label: "Guest Author" },
];

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "scheduled", label: "Scheduled" },
];

const CreateBlog: React.FC = memo(() => {
  const [title, setTitle] = useState("");
  const [blogType, setBlogType] = useState("");
  const [category, setCategory] = useState("");
  const [publishedBy, setPublishedBy] = useState("admin");
  const [publishDate, setPublishDate] = useState("");
  const [readingTime, setReadingTime] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("draft");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSave = useCallback(async (draft: boolean) => {
    if (!title.trim()) { setError("Title is required"); return; }
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await scholarshipProviderApi.createBlog({
        title,
        content: content || shortDesc,
        author: PUBLISHED_BY.find((p) => p.value === publishedBy)?.label || "Admin",
        image_url: undefined,
        status: draft ? "draft" : status,
      });
      setSuccess(draft ? "Draft saved!" : "Blog published!");
    } catch (err: any) {
      setError(err.message || "Failed to save blog");
    } finally {
      setSubmitting(false);
    }
  }, [title, content, shortDesc, publishedBy, status]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Create Blog</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">Create Blog</span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Feather className="w-5 h-5 text-blue-600" /> Create Blog
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => handleSave(true)}
              disabled={submitting}
              className="px-4 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors"
            >
              Draft
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={submitting || !title.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Publish
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Blog Title <span className="text-red-500">*</span></label>
              <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="Enter blog title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Blog Type <span className="text-red-500">*</span></label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={blogType} onChange={(e) => setBlogType(e.target.value)}>
                <option value="">Select Type</option>
                {BLOG_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select Category</option>
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Published By <span className="text-red-500">*</span></label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={publishedBy} onChange={(e) => setPublishedBy(e.target.value)}>
                {PUBLISHED_BY.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Publish Date</label>
              <input type="date" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Reading Time</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="e.g., 5 min read" value={readingTime} onChange={(e) => setReadingTime(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Featured Image <span className="text-red-500">*</span></label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg py-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
              <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB (1200x630 recommended)</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Short Description / Excerpt <span className="text-red-500">*</span></label>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <ReactQuill theme="snow" value={shortDesc} onChange={setShortDesc} modules={quillModules} formats={quillFormats} className="bg-white" />
            </div>
            <p className="text-xs text-gray-500 text-right mt-1">{shortDesc.replace(/<[^>]*>/g, "").length}/250 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Blog Content <span className="text-red-500">*</span></label>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <ReactQuill theme="snow" value={content} onChange={setContent} modules={quillModules} formats={quillFormats} className="bg-white" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="blog, story, nepal (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
      {success && <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{success}</div>}
    </div>
  );
});

CreateBlog.displayName = "CreateBlog";

export default CreateBlog;
