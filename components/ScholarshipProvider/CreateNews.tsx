"use client";

import React, { useState, useCallback, useEffect, memo } from "react";
import dynamic from "next/dynamic";
import { Home, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { scholarshipProviderApi } from "@/services/scholarshipProviderApi";
import FileUpload from "./common/FileUpload";

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
  { value: "achievement", label: "Achievement" },
];

interface CreateNewsProps {
  newsId?: number;
  onNavigate?: (section: string) => void;
  onEditComplete?: () => void;
}

const CreateNews: React.FC<CreateNewsProps> = memo(({ newsId, onNavigate, onEditComplete }) => {
  const isEditing = !!newsId;
  const [title, setTitle] = useState("");
  const [newsType, setNewsType] = useState("");
  const [publishedBy, setPublishedBy] = useState("Admin");
  const [publishDate, setPublishDate] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [allowComments, setAllowComments] = useState(false);
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [featuredImagePreview, setFeaturedImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (newsId != null) {
      const id = newsId as number;
      async function fetchNews() {
        try {
          const news = await scholarshipProviderApi.getNewsById(id);
          setTitle(news.title || "");
          setNewsType(news.news_type || "");
          setPublishedBy(news.published_by || "Admin");
          setPublishDate(news.publish_date || "");
          setShortDesc(news.short_desc || "");
          setContent(news.content || "");
          setTags(news.tags?.join(", ") || "");
          setAllowComments(news.allow_comments || false);
          setFeaturedImageUrl(news.image_url || "");
          setFeaturedImagePreview(news.image_url || "");
        } catch (err) {
          setError("Failed to load news");
        }
      }
      fetchNews();
    }
  }, [newsId]);

  const handleImageSelect = useCallback(async (file: File) => {
    const localPreview = URL.createObjectURL(file);
    setFeaturedImagePreview(localPreview);
    setUploadingImage(true);
    setError("");

    try {
      const url = await scholarshipProviderApi.uploadImage(file, "news");
      setFeaturedImageUrl(url);
      setFeaturedImagePreview(url);
    } catch (err: any) {
      setFeaturedImageUrl("");
      setError(err?.message || "Failed to upload featured image");
    } finally {
      setUploadingImage(false);
    }
  }, []);

  const handleSave = useCallback(async (draft: boolean) => {
    if (!title.trim()) { setError("Title is required"); return; }
    if (!featuredImageUrl) { setError("Featured image is required"); return; }
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const payload = {
        title,
        short_desc: shortDesc,
        content: content,
        image_url: featuredImageUrl,
        news_type: newsType,
        published_by: publishedBy,
        publish_date: publishDate,
        tags: tags ? tags.split(',').map(t => t.trim()) : [],
        allow_comments: allowComments,
        status: draft ? "draft" : "published",
      };
      if (isEditing && newsId) {
        await scholarshipProviderApi.updateNews(newsId, payload);
        toast.success(draft ? "Your news post has been updated as a draft." : "Your news has been updated.");
      } else {
        await scholarshipProviderApi.createNews(payload);
        toast.success(draft ? "Your news post has been saved as a draft." : "Your news has been published in the directory.");
      }
      onEditComplete?.();
      onNavigate?.("sec-news-directory");
    } catch (err: any) {
      setError(err.message || "Failed to save news");
    } finally {
      setSubmitting(false);
    }
  }, [title, shortDesc, content, featuredImageUrl, newsType, publishedBy, publishDate, tags, allowComments, onNavigate, isEditing, newsId, onEditComplete]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">{isEditing ? 'Edit News' : 'Create News'}</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">{isEditing ? 'Edit News' : 'Create News'}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-blue-600" /> {isEditing ? 'Edit News' : 'Create News'}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => handleSave(true)}
              disabled={submitting || uploadingImage}
              className="px-4 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors"
            >
              Draft
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={submitting || uploadingImage || !title.trim() || !featuredImageUrl}
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
            <FileUpload
              accept="image/*"
              maxSize="5MB"
              recommendedSize="800x600"
              onFileSelect={handleImageSelect}
              previewUrl={featuredImagePreview}
            />
            {uploadingImage && <p className="mt-2 text-xs text-blue-600">Uploading featured image...</p>}
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
    </div>
  );
});

CreateNews.displayName = "CreateNews";

export default CreateNews;
