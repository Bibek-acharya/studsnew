"use client";

import React, { useState, useCallback, memo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Newspaper, Save, UploadCloud, Eye, Tag } from "lucide-react";
import SectionCard from "./common/SectionCard";
import InputField from "./common/InputField";
import SelectField from "./common/SelectField";
import Button from "./common/Button";
import { scholarshipProviderApi } from "@/services/scholarshipProviderApi";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link", "image"],
    ["clean"],
  ],
};

const quillFormats = ["header", "bold", "italic", "underline", "strike", "list", "align", "link", "image"];

const CATEGORY_OPTIONS = [
  { value: "announcement", label: "Announcement" },
  { value: "update", label: "Update" },
  { value: "achievement", label: "Achievement" },
  { value: "event", label: "Event" },
  { value: "press", label: "Press Release" },
];

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "scheduled", label: "Scheduled" },
];

const CreateNews: React.FC = memo(() => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [status, setStatus] = useState("draft");
  const [featuredImage, setFeaturedImage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const addTag = useCallback(() => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags((prev) => [...prev, tagInput.trim()]);
      setTagInput("");
    }
  }, [tagInput, tags]);

  const removeTag = useCallback((tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  }, []);

  const handleSave = useCallback(async (draft: boolean) => {
    if (!title.trim()) return;
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await scholarshipProviderApi.createNews({
        title,
        content,
        image_url: featuredImage || undefined,
        status: draft ? "draft" : status,
      });
      setSuccess(draft ? "Draft saved!" : "News published!");
      setTimeout(() => router.push("/scholarship-provider"), 1500);
    } catch (err: any) {
      setError(err.message || "Failed to save news");
    } finally {
      setSubmitting(false);
    }
  }, [title, content, featuredImage, status, router]);

  return (
    <div className="space-y-6">
      <SectionCard>
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-blue-600" /> Create News
        </h2>

        <div className="space-y-6">
          <InputField label="Title" required placeholder="Enter news title" value={title} onChange={(e) => setTitle(e.target.value)} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField label="Category" required value={category} onChange={(e) => setCategory(e.target.value)} options={CATEGORY_OPTIONS} />
            <SelectField label="Status" value={status} onChange={(e) => setStatus(e.target.value)} options={STATUS_OPTIONS} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Featured Image</label>
            <div className="border-2 border-dashed border-slate-200 rounded-md py-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-all">
              <UploadCloud className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
              <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB (1200x630 recommended)</p>
            </div>
            {featuredImage && <img src={featuredImage} className="w-full h-48 object-cover rounded-lg mt-2" alt="Featured" />}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Content</label>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <ReactQuill theme="snow" value={content} onChange={setContent} modules={quillModules} formats={quillFormats} className="bg-white" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className="flex-1 px-3.5 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-blue-600"
                placeholder="Add a tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button type="button" variant="outline" onClick={addTag}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                  <Tag className="w-3 h-3" /> {tag}
                  <button onClick={() => removeTag(tag)} className="ml-1 hover:text-blue-900">×</button>
                </span>
              ))}
            </div>
          </div>

          <InputField label="Publish Date" type="date" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} />
        </div>
      </SectionCard>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
      {success && <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{success}</div>}

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => handleSave(true)} disabled={submitting}><Save className="w-4 h-4" /> Save Draft</Button>
        <Button onClick={() => handleSave(false)} disabled={submitting || !title.trim()}><Eye className="w-4 h-4" /> Publish News</Button>
      </div>
    </div>
  );
});

CreateNews.displayName = "CreateNews";

export default CreateNews;
