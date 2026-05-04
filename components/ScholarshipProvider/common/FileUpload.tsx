"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, Trash2 } from "lucide-react";

interface FileUploadProps {
  label?: string;
  uploadedText?: string;
  accept?: string;
  maxSize?: string;
  recommendedSize?: string;
  multiple?: boolean;
  onFileSelect?: (file: File) => void | Promise<void>;
  onFilesSelect?: (files: FileList) => void | Promise<void>;
  previewUrl?: string;
  previewClassName?: string;
  onClearPreview?: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  uploadedText = "File uploaded",
  accept = "image/*",
  maxSize = "5MB",
  recommendedSize,
  multiple = false,
  onFileSelect,
  onFilesSelect,
  previewUrl,
  previewClassName = "w-full h-32 object-cover rounded-lg mt-2",
  onClearPreview,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (multiple && onFilesSelect) {
      onFilesSelect(e.dataTransfer.files);
    } else {
      const file = e.dataTransfer.files[0];
      if (file && onFileSelect) {
        onFileSelect(file);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (multiple && onFilesSelect && e.target.files) {
      onFilesSelect(e.target.files);
    } else {
      const file = e.target.files?.[0];
      if (file && onFileSelect) {
        onFileSelect(file);
      }
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClearPreview?.();
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative overflow-hidden border-2 border-dashed rounded-md cursor-pointer transition-all ${
          isDragOver
            ? "border-blue-600 bg-blue-50"
            : "border-slate-200 hover:border-blue-600 hover:bg-blue-50"
        }`}
      >
        {previewUrl ? (
          <div className="relative">
            <img src={previewUrl} className="w-full h-40 object-cover" alt="Preview" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-3 right-3 inline-flex items-center justify-center rounded-full bg-white/95 p-2 text-slate-700 shadow-md hover:bg-white"
              aria-label="Remove uploaded image"
              title="Remove uploaded image"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="absolute bottom-3 left-3 right-12 text-left text-white">
              <p className="text-sm font-semibold">{uploadedText}</p>
              <p className="text-xs text-white/80">Click anywhere to replace the image</p>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600">Click to upload or drag and drop</p>
            <p className="text-xs text-slate-400 mt-1">
              {accept.includes("image") ? "PNG, JPG" : "PDF, DOC"} up to {maxSize}
              {recommendedSize && ` (${recommendedSize} recommended)`}
            </p>
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default FileUpload;
