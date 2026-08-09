"use client";

import "react-quill-new/dist/quill.snow.css";

import React, { useState, useCallback, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import { Newspaper, Spinner } from "@phosphor-icons/react";
import { Home } from "lucide-react";
import { toast } from "sonner";
import { institutionNewsApi } from "@/services/institutionNewsApi";
import FileUpload from "@/components/ScholarshipProvider/common/FileUpload";

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

const quillFormats = [
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "align",
  "link",
  "image",
];

const NEWS_TYPES = [
  { value: "notice", label: "Notice" },
  { value: "announcement", label: "Announcement" },
  { value: "news", label: "News" },
  { value: "press-release", label: "Press Release" },
  { value: "update", label: "Update" },
];

function CreateNewsForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const newsId = searchParams.get("edit")
    ? Number(searchParams.get("edit"))
    : null;
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
  const [loadingNews, setLoadingNews] = useState(false);

  useEffect(() => {
    if (newsId) {
      setLoadingNews(true);
      institutionNewsApi
        .getById(newsId)
        .then((news) => {
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
        })
        .catch(() => setError("Failed to load news"))
        .finally(() => setLoadingNews(false));
    }
  }, [newsId]);

  const handleImageSelect = useCallback(async (file: File) => {
    const localPreview = URL.createObjectURL(file);
    setFeaturedImagePreview(localPreview);
    setUploadingImage(true);
    setError("");

    try {
      const url = await institutionNewsApi.uploadImage(file, "news");
      setFeaturedImageUrl(url);
      setFeaturedImagePreview(url);
    } catch (err: any) {
      setFeaturedImageUrl("");
      setError(err?.message || "Failed to upload featured image");
    } finally {
      setUploadingImage(false);
    }
  }, []);

  const handleClearImage = useCallback(() => {
    setFeaturedImageUrl("");
    setFeaturedImagePreview("");
  }, []);

  const handleSave = useCallback(
    async (draft: boolean) => {
      if (!title.trim()) {
        setError("Title is required");
        return;
      }
      if (!featuredImageUrl) {
        setError("Featured image is required");
        return;
      }
      setSubmitting(true);
      setError("");

      try {
        const payload = {
          title,
          short_desc: shortDesc,
          content,
          image_url: featuredImageUrl,
          news_type: newsType,
          published_by: publishedBy,
          publish_date: publishDate,
          tags: tags ? tags.split(",").map((t) => t.trim()) : [],
          allow_comments: allowComments,
          status: draft ? "draft" : "published",
        };

        if (isEditing && newsId) {
          await institutionNewsApi.update(newsId, payload);
          toast.success(
            draft ? "News updated as draft." : "News updated successfully.",
          );
        } else {
          await institutionNewsApi.create(payload);
          toast.success(
            draft ? "News saved as draft." : "News published successfully.",
          );
        }
        router.push("/institution-zone/dashboard/news/directory");
      } catch (err: any) {
        setError(err.message || "Failed to save news");
      } finally {
        setSubmitting(false);
      }
    },
    [
      title,
      shortDesc,
      content,
      featuredImageUrl,
      newsType,
      publishedBy,
      publishDate,
      tags,
      allowComments,
      isEditing,
      newsId,
      router,
    ],
  );

  if (loadingNews) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-800">Edit News</h1>
          <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
            <span>-</span>
            <span className="text-gray-800 font-medium">Edit News</span>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <Spinner className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="ml-3 text-gray-500">Loading news...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditing ? "Edit News" : "Create News"}
        </h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
          <span>-</span>
          <span className="text-gray-800 font-medium">
            {isEditing ? "Edit News" : "Create News"}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-blue-600" />{" "}
            {isEditing ? "Edit News" : "Create News"}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={submitting || uploadingImage}
              className="px-4 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Draft"}
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={
                submitting || uploadingImage || !title.trim() || !featuredImageUrl
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {submitting ? "Saving..." : isEditing ? "Update" : "Publish"}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                News Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter news title..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                News Type <span className="text-red-500">*</span>
              </label>
              <select
                value={newsType}
                onChange={(e) => setNewsType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Type</option>
                {NEWS_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Published By
              </label>
              <input
                type="text"
                value={publishedBy}
                onChange={(e) => setPublishedBy(e.target.value)}
                placeholder="Author name"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Publish Date
            </label>
            <input
              type="date"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Featured Image <span className="text-red-500">*</span>
            </label>
            <FileUpload
              accept="image/*"
              maxSize="5MB"
              recommendedSize="800x600"
              onFileSelect={handleImageSelect}
              previewUrl={featuredImagePreview}
              onClearPreview={handleClearImage}
              previewClassName="w-full h-48 object-cover rounded-lg"
            />
            {uploadingImage && (
              <p className="mt-2 text-xs text-blue-600">
                Uploading featured image...
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Short Description / Summary
            </label>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <ReactQuill
                theme="snow"
                value={shortDesc}
                onChange={setShortDesc}
                modules={quillModules}
                formats={quillFormats}
                className="bg-white"
              />
            </div>
            <p className="text-xs text-gray-500 text-right mt-1">
              {shortDesc.replace(/<[^>]*>/g, "").length}/300 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Full Content <span className="text-red-500">*</span>
            </label>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={quillModules}
                formats={quillFormats}
                className="bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tags
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="news, event, scholarship (comma separated)"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Allow Comments
                </label>
                <p className="text-xs text-gray-500">
                  Enable users to comment on this news
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={allowComments}
                  onChange={(e) => setAllowComments(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}

export default function CreateNewsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="flex items-center justify-center py-20">
            <Spinner className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        </div>
      }
    >
      <CreateNewsForm />
    </Suspense>
  );
}
