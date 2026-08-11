"use client";

import React from "react";

interface ImagePreviewProps {
  src: string;
  fileName: string;
  onClose: () => void;
}

export default function ImagePreview({ src, fileName, onClose }: ImagePreviewProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "image";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(src, "_blank");
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <button
          onClick={handleDownload}
          className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-colors"
          title="Download"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
        <button
          onClick={onClose}
          className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-colors"
          title="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <img
        src={src}
        alt={fileName}
        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
      />
    </div>
  );
}
