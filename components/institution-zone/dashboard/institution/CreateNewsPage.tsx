"use client";

import "react-quill-new/dist/quill.snow.css";

import React, { useState, useCallback, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Newspaper,
  FloppyDisk,
  PaperPlaneTilt,
  Image,
  Spinner,
  X,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";
import { institutionNewsApi } from "@/services/institutionNewsApi";

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

  const handleImageFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleImageSelect(file);
    },
    [handleImageSelect],
  );

  if (loadingNews) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <SectionHeader
          title="Edit News"
          breadcrumbItems={[
            { label: "Dashboard", href: "/institution-zone/dashboard" },
            {
              label: "News",
              href: "/institution-zone/dashboard/news/directory",
            },
            { label: "Edit" },
          ]}
        />
        <div className="flex items-center justify-center py-20">
          <Spinner className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="ml-3 text-gray-500">Loading news...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <SectionHeader
        title={isEditing ? "Edit News" : "Create News"}
        breadcrumbItems={[
          { label: "Dashboard", href: "/institution-zone/dashboard" },
          { label: "News", href: "/institution-zone/dashboard/news/directory" },
          { label: isEditing ? "Edit" : "Create" },
        ]}
      />

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            News Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter news title..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
          />
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                News Type <span className="text-red-500">*</span>
              </label>
              <select
                value={newsType}
                onChange={(e) => setNewsType(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Publish Date
              </label>
              <input
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Featured Image <span className="text-red-500">*</span>
          </label>
          {featuredImagePreview ? (
            <div className="relative">
              <img
                src={featuredImagePreview}
                alt="Featured"
                className="w-full h-48 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => {
                  setFeaturedImageUrl("");
                  setFeaturedImagePreview("");
                }}
                className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-gray-600 hover:bg-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 cursor-pointer transition-colors block">
              <Image className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG or WEBP (Max 5MB)
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
              />
            </label>
          )}
          {uploadingImage && (
            <p className="mt-2 text-xs text-blue-600">
              Uploading featured image...
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
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

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
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

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
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

        <div className="flex justify-end gap-3">
          <button
            onClick={() => handleSave(true)}
            disabled={submitting || uploadingImage}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
          >
            <FloppyDisk />
            {submitting ? "Saving..." : "Save Draft"}
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={
              submitting || uploadingImage || !title.trim() || !featuredImageUrl
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
          >
            <PaperPlaneTilt />
            {submitting ? "Publishing..." : isEditing ? "Update" : "Publish"}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CreateNewsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-4 md:p-6 lg:p-8">
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
