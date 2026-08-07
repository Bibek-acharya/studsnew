"use client";

import React, { memo } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const QuillEditor = dynamic(() => import("react-quill-new"), { ssr: false });

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

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "align",
  "link",
  "image",
];

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = memo(({
  value = "",
  onChange,
  placeholder,
  minHeight = 120,
}) => {
  return (
    <div className="border border-slate-200 rounded-lg overflow-visible">
      <QuillEditor
        value={value}
        onChange={onChange}
        modules={quillModules}
        formats={quillFormats}
        placeholder={placeholder}
        className="bg-white"
      />
      <style>{`
        .ql-container {
          min-height: ${minHeight}px;
          max-height: 500px;
          overflow-y: auto;
        }
        .ql-editor {
          min-height: ${minHeight}px;
        }
      `}</style>
    </div>
  );
});

RichTextEditor.displayName = "RichTextEditor";

export default RichTextEditor;
