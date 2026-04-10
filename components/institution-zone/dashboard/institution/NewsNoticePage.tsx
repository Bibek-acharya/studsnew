"use client";
import React, { useState, useRef, useEffect } from "react";
import { Bold, Italic, Underline, Link2, AlignLeft, AlignCenter, AlignRight, List, Tag, Sparkles, CheckCircle, Upload, Type } from "lucide-react";

type PromotionType = "standard" | "featured";
type CategoryType = "News" | "Notice" | "Event" | "Achievement" | "Announcement";

const NewsNoticePage: React.FC = () => {
  const [category, setCategory] = useState<CategoryType>("News");
  const [publishedBy, setPublishedBy] = useState("");
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [promotion, setPromotion] = useState<PromotionType>("standard");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/^,/, "");
      if (newTag && !tags.includes(newTag)) setTags(prev => [...prev, newTag]);
      setTagInput("");
    }
    if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags(prev => prev.slice(0, -1));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handlePublish = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  const CATEGORIES: CategoryType[] = ["News", "Notice", "Event", "Achievement", "Announcement"];

  const toolbarButtons = [
    { icon: <Bold className="w-4 h-4" />, cmd: "bold", title: "Bold" },
    { icon: <Italic className="w-4 h-4" />, cmd: "italic", title: "Italic" },
    { icon: <Underline className="w-4 h-4" />, cmd: "underline", title: "Underline" },
  ];

  const alignButtons = [
    { icon: <AlignLeft className="w-4 h-4" />, cmd: "justifyLeft", title: "Align Left" },
    { icon: <AlignCenter className="w-4 h-4" />, cmd: "justifyCenter", title: "Align Center" },
    { icon: <AlignRight className="w-4 h-4" />, cmd: "justifyRight", title: "Align Right" },
  ];

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-[900px] mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create News / Notice</h1>
          <p className="text-slate-500 text-sm mt-1">Publish announcements, notices, and news for students.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">Draft</span>
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 text-sm font-medium">
          <CheckCircle className="w-5 h-5 text-green-600" /> Publication saved successfully!
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        {/* Meta Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value as CategoryType)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Published By</label>
            <input value={publishedBy} onChange={e => setPublishedBy(e.target.value)} placeholder="e.g. Admin Office" className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>

        {/* Heading */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Heading <span className="text-red-500">*</span></label>
          <input value={heading} onChange={e => setHeading(e.target.value)} placeholder="e.g. Admission Open for 2024-25 Academic Year" className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        {/* Subheading */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Subheading</label>
          <input value={subheading} onChange={e => setSubheading(e.target.value)} placeholder="Optional subheading or subtitle" className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        {/* Feature Photo */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Feature Photo</label>
          <label className="block w-full h-36 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer overflow-hidden flex items-center justify-center transition-colors">
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            {imagePreview ? (
              <img src={imagePreview} alt="Feature" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-slate-400">
                <Upload className="w-8 h-8 mx-auto mb-1" />
                <span className="text-sm">Drag & drop or click to upload</span>
                <p className="text-xs mt-0.5">PNG, JPG, WEBP up to 5MB</p>
              </div>
            )}
          </label>
        </div>

        {/* Summary */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Summary</label>
          <textarea rows={3} value={summary} onChange={e => setSummary(e.target.value)} placeholder="A short summary shown on listing cards..." className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
        </div>

        {/* Rich Text Editor */}
        <div>
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <label className="text-sm font-medium text-slate-700">Content</label>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold shadow-sm hover:opacity-90 transition-opacity">
              <Sparkles className="w-3.5 h-3.5" /> Write with AI
            </button>
          </div>

          {/* Toolbar */}
          <div className="border border-slate-200 rounded-t-xl bg-slate-50 px-3 py-2 flex items-center flex-wrap gap-1">
            {/* Heading Select */}
            <select
              onChange={e => applyFormat("formatBlock", e.target.value)}
              className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white focus:outline-none"
            >
              <option value="p">Normal</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
              <option value="h4">Heading 4</option>
            </select>

            <div className="w-px h-5 bg-slate-300 mx-1" />

            {toolbarButtons.map(btn => (
              <button
                key={btn.cmd}
                onMouseDown={e => { e.preventDefault(); applyFormat(btn.cmd); }}
                title={btn.title}
                className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-slate-600 hover:text-slate-900 transition-colors"
              >
                {btn.icon}
              </button>
            ))}

            <div className="w-px h-5 bg-slate-300 mx-1" />

            {alignButtons.map(btn => (
              <button
                key={btn.cmd}
                onMouseDown={e => { e.preventDefault(); applyFormat(btn.cmd); }}
                title={btn.title}
                className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-slate-600 hover:text-slate-900 transition-colors"
              >
                {btn.icon}
              </button>
            ))}

            <div className="w-px h-5 bg-slate-300 mx-1" />

            <button
              onMouseDown={e => { e.preventDefault(); applyFormat("insertUnorderedList"); }}
              title="Bullet List"
              className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              <List className="w-4 h-4" />
            </button>

            <button
              onMouseDown={e => {
                e.preventDefault();
                const url = window.prompt("Enter URL:");
                if (url) applyFormat("createLink", url);
              }}
              title="Insert Link"
              className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Link2 className="w-4 h-4" />
            </button>
          </div>

          {/* Contenteditable Area */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            className="min-h-[200px] border border-t-0 border-slate-200 rounded-b-xl p-4 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset focus:border-blue-400"
            data-placeholder="Write your content here..."
            onFocus={e => {
              const el = e.currentTarget;
              if (!el.textContent?.trim()) el.innerHTML = "";
            }}
          />
          <style>{`[contenteditable]:empty:before{content:attr(data-placeholder);color:#94a3b8}`}</style>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
            <Tag className="w-4 h-4" /> Tags
          </label>
          <div className="flex flex-wrap gap-2 items-center border border-slate-200 rounded-lg p-2.5 focus-within:ring-2 focus-within:ring-blue-500">
            {tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                {tag}
                <button onClick={() => setTags(prev => prev.filter(t => t !== tag))} className="hover:text-blue-900 text-blue-500 ml-0.5">×</button>
              </span>
            ))}
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder={tags.length === 0 ? "Type a tag and press Enter..." : "Add more tags..."}
              className="flex-1 min-w-[140px] outline-none text-sm bg-transparent"
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">Press Enter or comma to add a tag</p>
        </div>

        {/* Promotion Options */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Promotion Type</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                promotion === "standard" ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <input type="radio" value="standard" checked={promotion === "standard"} onChange={() => setPromotion("standard")} className="sr-only" />
              <div className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${promotion === "standard" ? "border-blue-500 bg-blue-500" : "border-slate-300"}`}>
                  {promotion === "standard" && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Standard</p>
                  <p className="text-xs text-slate-500 mt-0.5">Regular listing in news/notice feed</p>
                </div>
              </div>
            </label>

            <label
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                promotion === "featured" ? "border-amber-500 bg-amber-50" : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <input type="radio" value="featured" checked={promotion === "featured"} onChange={() => setPromotion("featured")} className="sr-only" />
              <div className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${promotion === "featured" ? "border-amber-500 bg-amber-500" : "border-slate-300"}`}>
                  {promotion === "featured" && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
                    Feature — Premium <span className="px-1.5 py-0.5 bg-amber-200 text-amber-700 text-xs rounded-full font-semibold">⭐ Featured</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Highlighted at top of feed with premium badge</p>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end pb-6">
        <button className="px-5 py-2.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium">Cancel</button>
        <button className="px-5 py-2.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium">Save as Draft</button>
        <button
          onClick={handlePublish}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4" /> Publish
        </button>
      </div>
    </div>
  );
};

export default NewsNoticePage;
