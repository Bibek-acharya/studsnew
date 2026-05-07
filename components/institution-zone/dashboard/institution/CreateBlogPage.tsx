"use client";

import React, { useState } from "react";
import { FloppyDisk, PaperPlaneTilt, Image, Tag } from "@phosphor-icons/react";
import SectionHeader from "@/components/institution-zone/dashboard/shared/SectionHeader";

const CreateBlogPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Education");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState<"Published" | "Draft">("Draft");

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <SectionHeader
        title="Create Blog"
        breadcrumbItems={[
          { label: "Dashboard", href: "/institution-zone/dashboard" },
          { label: "Blogs", href: "/institution-zone/dashboard/blogs/directory" },
          { label: "Create" },
        ]}
      />

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Blog Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Dr. Robert Anderson"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            />
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
            >
              <option>Education</option>
              <option>Technology</option>
              <option>Campus Life</option>
              <option>Career</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Featured Image</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 cursor-pointer transition-colors">
            <Image className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Drop your image here or click to browse</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG or WEBP (Max 5MB)</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. education, technology, career (comma separated)"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none"
          />
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write blog content here..."
            rows={14}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-blue-600 outline-none resize-none"
          />
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-3">Status</label>
          <div className="flex gap-3">
            <button
              onClick={() => setStatus("Published")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                status === "Published"
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setStatus("Draft")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                status === "Draft"
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Draft
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
            <FloppyDisk />
            Save Draft
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
            <PaperPlaneTilt />
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBlogPage;
