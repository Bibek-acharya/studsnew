"use client";

import React, { useState, useCallback, memo } from "react";
import dynamic from "next/dynamic";
import { Home, PlusCircle, UploadCloud } from "lucide-react";
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

const NEWS_TYPES = [
  { value: "notice", label: "Notice" },
  { value: "announcement", label: "Announcement" },
  { value: "news", label: "News" },
  { value: "press-release", label: "Press Release" },
  { value: "update", label: "Update" },
];

const CreateNews: React.FC = memo(() => {
  const [title, setTitle] = useState("");
  const [newsType, setNewsType] = useState("");
  const [publishedBy, setPublishedBy] = useState("Admin");
  const [publishDate, setPublishDate] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [allowComments, setAllowComments] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSave = useCallback(async (draft: boolean) => {
    if (!title.trim()) { setError("Title is required"); return; }
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await scholarshipProviderApi.createNews({
        title,
        content: content || shortDesc,
        image_url: undefined,
        status: draft ? "draft" : "published",
      });
      setSuccess(draft ? "Draft saved!" : "News published!");
    } catch (err: any) {
      setError(err.message || "Failed to save news");
    } finally {
      setSubmitting(false);
    }
  }, [title, content, shortDesc]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Create News</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">Create News</span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-blue-600" /> Create News
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">News Title <span className="text-red-500">*</span></label>
              <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-500" placeholder="Enter news title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">News Type <span className="text-red-500">*</span></label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={newsType} onChange={(e) => setNewsType(e.target.value)}>
                <option value="">Select Type</option>
                {NEWS_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Published By <span className="text-red-500">*</span></label>
              <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="Author name" value={publishedBy} onChange={(e) => setPublishedBy(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Publish Date</label>
              <input type="date" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Featured Image <span className="text-red-500">*</span></label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg py-12 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
              <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB (800x600 recommended)</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Short Description / Summary <span className="text-red-500">*</span></label>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <ReactQuill theme="snow" value={shortDesc} onChange={setShortDesc} modules={quillModules} formats={quillFormats} className="bg-white" />
            </div>
            <p className="text-xs text-gray-500 text-right mt-1">{shortDesc.replace(/<[^>]*>/g, "").length}/300 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Content <span className="text-red-500">*</span></label>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <ReactQuill theme="snow" value={content} onChange={setContent} modules={quillModules} formats={quillFormats} className="bg-white" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="news, event, nepal (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-0">Allow Comments</label>
                <p className="text-xs text-gray-500">Enable users to comment on this news</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={allowComments} onChange={(e) => setAllowComments(e.target.checked)} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
      {success && <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{success}</div>}
    </div>
  );
});

CreateNews.displayName = "CreateNews";

export default CreateNews;
