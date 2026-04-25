"use client";

import React, { useState, useRef } from "react";
import { UploadCloud } from "lucide-react";

interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSize?: string;
  recommendedSize?: string;
  onFileSelect?: (file: File) => void;
  previewUrl?: string;
  previewClassName?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept = "image/*",
  maxSize = "5MB",
  recommendedSize,
  onFileSelect,
  previewUrl,
  previewClassName = "w-full h-32 object-cover rounded-lg mt-2",
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
    const file = e.dataTransfer.files[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
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
        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-all ${
          isDragOver
            ? "border-blue-600 bg-blue-50"
            : "border-slate-200 hover:border-blue-600 hover:bg-blue-50"
        }`}
      >
        <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p className="text-sm text-slate-600">Click to upload or drag and drop</p>
        <p className="text-xs text-slate-400 mt-1">
          {accept.includes("image") ? "PNG, JPG" : "PDF, DOC"} up to {maxSize}
          {recommendedSize && ` (${recommendedSize} recommended)`}
        </p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      {previewUrl && <img src={previewUrl} className={previewClassName} alt="Preview" />}
    </div>
  );
};

export default FileUpload;
