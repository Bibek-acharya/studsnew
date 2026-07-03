"use client";

import "react-quill-new/dist/quill.snow.css";

import React, { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { Home, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { adminNewsApi } from "@/services/newsApi";
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

const CATEGORIES = [
  { value: "admission", label: "Admission" },
  { value: "scholarship", label: "Scholarship" },
  { value: "exam", label: "Exam" },
  { value: "notice", label: "Notice" },
  { value: "news", label: "News" },
  { value: "event", label: "Event" },
  { value: "achievement", label: "Achievement" },
  { value: "others", label: "Others" },
];

export default function CreateNewsSection({
  setActiveSection,
  editId,
}: {
  setActiveSection: (s: string) => void;
  editId?: number;
}) {
  const isEditing = !!editId;
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("Admin");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editId != null) {
      (async () => {
        try {
          const news = await adminNewsApi.getById(editId);
          setTitle(news.title || "");
          setCategory(news.category || "");
          setAuthor(news.author || "Admin");
          setExcerpt(news.excerpt || "");
          setContent(news.content || "");
          setTags(news.tags?.join(", ") || "");
          setImageUrl(news.image || "");
          setImagePreview(news.image || "");
        } catch {
          setError("Failed to load news");
        }
      })();
    }
  }, [editId]);

  const handleImageSelect = useCallback(async (file: File) => {
    setImagePreview(URL.createObjectURL(file));
    setUploadingImage(true);
    setError("");
    try {
      const url = await adminNewsApi.uploadImage(file);
      setImageUrl(url);
      setImagePreview(url);
    } catch (err: any) {
      setImageUrl("");
      setError(err?.message || "Failed to upload featured image");
    } finally {
      setUploadingImage(false);
    }
  }, []);

  const handleClearImage = useCallback(() => {
    setImageUrl("");
    setImagePreview("");
  }, []);

  const handleSave = useCallback(
    async (asDraft: boolean) => {
      if (!title.trim()) {
        setError("Title is required");
        return;
      }
      if (!category) {
        setError("Category is required");
        return;
      }
      if (!imageUrl) {
        setError("Featured image is required");
        return;
      }
      setSubmitting(true);
      setError("");
      try {
        const payload: any = {
          title,
          category,
          content,
          excerpt,
          image: imageUrl,
          author,
          tags: tags ? tags.split(",").map((t) => t.trim()) : [],
          published: !asDraft,
        };
        if (isEditing && editId) {
          await adminNewsApi.update(editId, payload);
          toast.success(
            asDraft ? "News updated as draft." : "News updated successfully.",
          );
        } else {
          payload.date = new Date().toISOString();
          await adminNewsApi.create(payload);
          toast.success(
            asDraft ? "News saved as draft." : "News published successfully.",
          );
        }
        setActiveSection("manage-news");
      } catch (err: any) {
        setError(err.message || "Failed to save news");
      } finally {
        setSubmitting(false);
      }
    },
    [
      title,
      category,
      content,
      excerpt,
      imageUrl,
      author,
      tags,
      isEditing,
      editId,
      setActiveSection,
    ],
  );

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
            <PlusCircle className="w-5 h-5 text-blue-600" />{" "}
            {isEditing ? "Edit News" : "Create News"}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveSection("manage-news")}
              className="px-4 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={submitting || uploadingImage}
              className="px-4 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors"
            >
              {submitting ? "Saving..." : "Draft"}
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={
                submitting ||
                uploadingImage ||
                !title.trim() ||
                !category ||
                !imageUrl
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
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-500"
                placeholder="Enter news title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Author
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                placeholder="Author name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
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
              recommendedSize="800x600"
              onFileSelect={handleImageSelect}
              previewUrl={imagePreview}
              onClearPreview={handleClearImage}
            />
            {uploadingImage && (
              <p className="mt-2 text-xs text-blue-600">
                Uploading featured image...
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Short Description
            </label>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <ReactQuill
                theme="snow"
                value={excerpt}
                onChange={setExcerpt}
                modules={quillModules}
                formats={quillFormats}
                className="bg-white"
              />
            </div>
            <p className="text-xs text-gray-500 text-right mt-1">
              {excerpt.replace(/<[^>]*>/g, "").length}/300 characters
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tags
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              placeholder="admission, scholarship, nepal (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
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
