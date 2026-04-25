"use client";

import React from "react";
import { PlusCircle } from "lucide-react";

export default function CreateBlogSection({ setActiveSection }: { setActiveSection: (s: string) => void }) {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-8">
      <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-gray-900">
        <PlusCircle size={20} className="text-blue-600" /> Create Blog
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Blog Title</label>
          <input type="text" className="input-field" placeholder="Blog title" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Author</label>
          <input type="text" className="input-field" placeholder="Author name" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select className="input-field">
            <option value="">Select Category</option>
            <option value="education">Education</option>
            <option value="career">Career</option>
            <option value="lifestyle">Lifestyle</option>
          </select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Blog Content</label>
          <textarea className="input-field" rows={8} placeholder="Write your blog here..." />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <button type="button" onClick={() => setActiveSection("manage-blog")} className="rounded-md border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">Cancel</button>
        <button type="button" className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700">Publish Blog</button>
      </div>
    </div>
  );
}
