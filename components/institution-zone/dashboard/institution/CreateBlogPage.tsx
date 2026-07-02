"use client";

import "react-quill-new/dist/quill.snow.css";

import React, { useState, useCallback, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import {
  FloppyDisk,
  PaperPlaneTilt,
  Image,
  Spinner,
  X,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";
import { institutionBlogsApi } from "@/services/institutionBlogsApi";

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
  { value: "technology", label: "Technology" },
  { value: "campus-life", label: "Campus Life" },
  { value: "career", label: "Career" },
  { value: "community", label: "Community" },
  { value: "research", label: "Research" },
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

function CreateBlogForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const blogId = searchParams.get("edit")
    ? Number(searchParams.get("edit"))
    : null;
  const isEditing = !!blogId;

  const [title, setTitle] = useState("");
  const [blogType, setBlogType] = useState("");
  const [category, setCategory] = useState("");
  const [publishedBy, setPublishedBy] = useState("admin");
  const [readingTime, setReadingTime] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("draft");
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [featuredImagePreview, setFeaturedImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loadingBlog, setLoadingBlog] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (blogId) {
      setLoadingBlog(true);
      institutionBlogsApi
        .getById(blogId)
        .then((blog: any) => {
          setTitle(blog.title || "");
          setContent(blog.content || "");
          setFeaturedImageUrl(blog.image || "");
          setFeaturedImagePreview(blog.image || "");
          setShortDesc(blog.excerpt || "");
          setBlogType(blog.category || "");
          setCategory(blog.blog_category || "");
          setReadingTime(blog.read_time || "");
          setTags(blog.tags || "");
          setStatus(blog.status === "published" ? "published" : "draft");
        })
        .catch(() => setError("Failed to load blog"))
        .finally(() => setLoadingBlog(false));
    }
  }, [blogId]);

  const handleImageSelect = useCallback(async (file: File) => {
    const localPreview = URL.createObjectURL(file);
    setFeaturedImagePreview(localPreview);
    setUploadingImage(true);
    setError("");

    try {
      const url = await institutionBlogsApi.uploadImage(file, "blogs");
      setFeaturedImageUrl(url);
      setFeaturedImagePreview(url);
    } catch (err: any) {
      setFeaturedImageUrl("");
      setError(err?.message || "Failed to upload featured image");
    } finally {
      setUploadingImage(false);
    }
  }, []);

  const validate = useCallback(() => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Blog title is required";
    if (!blogType) errs.blogType = "Blog type is required";
    if (!featuredImageUrl) errs.featuredImage = "Featured image is required";
    if (!shortDesc.replace(/<[^>]*>/g, "").trim())
      errs.shortDesc = "Excerpt is required";
    if (!content.replace(/<[^>]*>/g, "").trim())
      errs.content = "Content is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [title, blogType, featuredImageUrl, shortDesc, content]);

  const handleSave = useCallback(
    async (draft: boolean) => {
      if (!validate()) return;
      setSubmitting(true);
      setError("");

      try {
        const payload = {
          title,
          content: content || shortDesc,
          excerpt: shortDesc.replace(/<[^>]*>/g, "").trim(),
          image: featuredImageUrl,
          category: blogType,
          blog_category: category,
          read_time: readingTime,
          tags,
          status,
        };

        if (isEditing && blogId) {
          await institutionBlogsApi.update(blogId, payload);
          toast.success(
            draft ? "Blog updated as draft." : "Blog updated successfully.",
          );
        } else {
          await institutionBlogsApi.create(payload);
          toast.success(
            draft ? "Blog saved as draft." : "Blog published successfully.",
          );
        }
        router.push("/institution-zone/dashboard/blogs/directory");
      } catch (err: any) {
        setError(err.message || "Failed to save blog");
      } finally {
        setSubmitting(false);
      }
    },
    [
      validate,
      title,
      content,
      shortDesc,
      publishedBy,
      status,
      featuredImageUrl,
      isEditing,
      blogId,
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

  const clearError = (field: string) =>
    setErrors((prev) => ({ ...prev, [field]: "" }));

  if (loadingBlog) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <SectionHeader
          title="Edit Blog"
          breadcrumbItems={[
            { label: "Dashboard", href: "/institution-zone/dashboard" },
            {
              label: "Blogs",
              href: "/institution-zone/dashboard/blogs/directory",
            },
            { label: "Edit" },
          ]}
        />
        <div className="flex items-center justify-center py-20">
          <Spinner className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="ml-3 text-gray-500">Loading blog...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <SectionHeader
        title={isEditing ? "Edit Blog" : "Create Blog"}
        breadcrumbItems={[
          { label: "Dashboard", href: "/institution-zone/dashboard" },
          {
            label: "Blogs",
            href: "/institution-zone/dashboard/blogs/directory",
          },
          { label: isEditing ? "Edit" : "Create" },
        ]}
      />

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Blog Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              clearError("title");
            }}
            placeholder="Enter blog title..."
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:border-blue-600 outline-none ${errors.title ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-500">{errors.title}</p>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Blog Type <span className="text-red-500">*</span>
              </label>
              <select
                value={blogType}
                onChange={(e) => {
                  setBlogType(e.target.value);
                  clearError("blogType");
                }}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:border-blue-600 outline-none ${errors.blogType ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="">Select Type</option>
                {BLOG_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              {errors.blogType && (
                <p className="mt-1 text-xs text-red-500">{errors.blogType}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
              >
                <option value="">Select Category</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Published By
              </label>
              <select
                value={publishedBy}
                onChange={(e) => setPublishedBy(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
              >
                {PUBLISHED_BY.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Reading Time
              </label>
              <input
                type="text"
                value={readingTime}
                onChange={(e) => setReadingTime(e.target.value)}
                placeholder="e.g. 5 min read"
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
            <label
              className={`border-2 border-dashed rounded-lg p-8 text-center hover:border-blue-500 cursor-pointer transition-colors block ${errors.featuredImage ? "border-red-500" : "border-gray-300"}`}
            >
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
          {errors.featuredImage && (
            <p className="mt-1 text-xs text-red-500">{errors.featuredImage}</p>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Short Description / Excerpt <span className="text-red-500">*</span>
          </label>
          <div
            className={`border rounded-lg overflow-hidden ${errors.shortDesc ? "border-red-500" : "border-gray-200"}`}
          >
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
            {shortDesc.replace(/<[^>]*>/g, "").length}/250 characters
          </p>
          {errors.shortDesc && (
            <p className="mt-1 text-xs text-red-500">{errors.shortDesc}</p>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Full Blog Content <span className="text-red-500">*</span>
          </label>
          <div
            className={`border rounded-lg overflow-hidden ${errors.content ? "border-red-500" : "border-gray-200"}`}
          >
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={quillModules}
              formats={quillFormats}
              className="bg-white"
            />
          </div>
          {errors.content && (
            <p className="mt-1 text-xs text-red-500">{errors.content}</p>
          )}
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
                placeholder="blog, story, campus (comma separated)"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
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
            disabled={submitting || uploadingImage}
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

export default function CreateBlogPage() {
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
      <CreateBlogForm />
    </Suspense>
  );
}
