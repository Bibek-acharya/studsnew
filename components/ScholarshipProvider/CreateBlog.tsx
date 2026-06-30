"use client";

import "react-quill-new/dist/quill.snow.css";

import React, { useState, useCallback, useEffect, memo } from "react";
import dynamic from "next/dynamic";
import { Home, Feather } from "lucide-react";
import { toast } from "sonner";
import { scholarshipProviderApi } from "@/services/scholarshipProviderApi";
import FileUpload from "./common/FileUpload";
import Dropdown from "../college-recommender/Dropdown";

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

interface CreateBlogProps {
  blogId?: number | null;
  onNavigate?: (section: string) => void;
  onEditComplete?: () => void;
}

const CreateBlog: React.FC<CreateBlogProps> = memo(
  ({ blogId, onNavigate, onEditComplete }) => {
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
    const [success, setSuccess] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
      if (blogId != null) {
        const id = blogId as number;
        async function fetchBlog() {
          try {
            const blog = await scholarshipProviderApi.getBlogById(id);
            setTitle(blog.title || "");
            setContent(blog.content || "");
            setPublishedBy(blog.author?.toLowerCase() || "admin");
            setStatus(blog.status || "draft");
            setFeaturedImageUrl(blog.image_url || "");
            setFeaturedImagePreview(blog.image_url || "");
          } catch (err) {
            setError("Failed to load blog");
          }
        }
        fetchBlog();
      }
    }, [blogId]);

    const handleImageSelect = useCallback(async (file: File) => {
      const localPreview = URL.createObjectURL(file);
      setFeaturedImagePreview(localPreview);
      setUploadingImage(true);
      setError("");

      try {
        const url = await scholarshipProviderApi.uploadImage(file, "blogs");
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
        setSuccess("");
        try {
          const payload = {
            title,
            content: content || shortDesc,
            author:
              PUBLISHED_BY.find((p) => p.value === publishedBy)?.label ||
              "Admin",
            image_url: featuredImageUrl,
            status: draft ? "draft" : status,
          };
          if (isEditing && blogId) {
            await scholarshipProviderApi.updateBlog(blogId, payload);
            toast.success(
              draft
                ? "Your blog has been updated as a draft."
                : "Your blog has been updated.",
            );
          } else {
            await scholarshipProviderApi.createBlog(payload);
            toast.success(
              draft
                ? "Your blog post has been saved as a draft."
                : "Your blog has been published successfully.",
            );
          }
          onEditComplete?.();
          onNavigate?.("sec-blog-directory");
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
        onNavigate,
        isEditing,
        blogId,
        onEditComplete,
      ],
    );

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditing ? "Edit Blog" : "Create Blog"}
          </h1>
          <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0 gap-2">
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
            <span>-</span>
            <span className="text-gray-800 font-medium">
              {isEditing ? "Edit Blog" : "Create Blog"}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-8 border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Feather className="w-5 h-5 text-blue-600" />{" "}
              {isEditing ? "Edit Blog" : "Create Blog"}
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
                disabled={submitting || uploadingImage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Publish
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Blog Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 ${errors.title ? "border-red-500" : "border-gray-200"}`}
                  placeholder="Enter blog title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setErrors((prev) => ({ ...prev, title: "" }));
                  }}
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-500">{errors.title}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Blog Type <span className="text-red-500">*</span>
                </label>
                <Dropdown
                  value={blogType}
                  onChange={(v) => {
                    setBlogType(v);
                    setErrors((prev) => ({ ...prev, blogType: "" }));
                  }}
                  options={BLOG_TYPES}
                  placeholder="Select Type"
                  error={errors.blogType}
                />
                {errors.blogType && (
                  <p className="mt-1 text-xs text-red-500">{errors.blogType}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Category
                </label>
                <Dropdown
                  value={category}
                  onChange={(v) => setCategory(v)}
                  options={CATEGORIES}
                  placeholder="Select Category"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Published By <span className="text-red-500">*</span>
                </label>
                <Dropdown
                  value={publishedBy}
                  onChange={(v) => setPublishedBy(v)}
                  options={PUBLISHED_BY}
                  placeholder="Select author"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Reading Time
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  placeholder="e.g., 5 min read"
                  value={readingTime}
                  onChange={(e) => setReadingTime(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Featured Image <span className="text-red-500">*</span>
              </label>
              <FileUpload
                accept="image/*"
                maxSize="5MB"
                recommendedSize="1200x630"
                onFileSelect={handleImageSelect}
                previewUrl={featuredImagePreview}
              />
              {uploadingImage && (
                <p className="mt-2 text-xs text-blue-600">
                  Uploading featured image...
                </p>
              )}
              {errors.featuredImage && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.featuredImage}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Short Description / Excerpt{" "}
                <span className="text-red-500">*</span>
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

            <div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tags
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  placeholder="blog, story, nepal (comma separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Status
                </label>
                <Dropdown
                  value={status}
                  onChange={(v) => setStatus(v)}
                  options={STATUS_OPTIONS}
                  placeholder="Select status"
                />
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
  },
);

CreateBlog.displayName = "CreateBlog";

export default CreateBlog;
