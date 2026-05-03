"use client";

import React, { useState } from "react";
import { Plus, Trash } from "@phosphor-icons/react";
import { scholarshipProviderApi } from "@/services/scholarshipProviderApi";
import FileUpload from "../common/FileUpload";

export interface GalleryImageItem {
  title: string;
  url: string;
  file?: File;
}

interface GallerySectionProps {
  images: GalleryImageItem[];
  setImages: React.Dispatch<React.SetStateAction<GalleryImageItem[]>>;
}

const formInputClass = "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500";

export const GallerySection: React.FC<GallerySectionProps> = ({ images, setImages }) => {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const addImage = () => {
    setImages([...images, { title: "", url: "" }]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const updateImage = (index: number, field: keyof GalleryImageItem, value: string) => {
    setImages(images.map((img, i) => i === index ? { ...img, [field]: value } : img));
  };

  const handleFileSelect = async (index: number, file: File) => {
    setUploadingIndex(index);
    try {
      const url = await scholarshipProviderApi.uploadImage(file, "gallery");
      setImages(images.map((img, i) => i === index ? { ...img, url, file } : img));
    } catch (error) {
      console.error("Failed to upload image:", error);
    } finally {
      setUploadingIndex(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
      <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Photo Gallery</h2>
            <p className="text-sm text-gray-500 mt-0.5">Images displayed in the gallery section</p>
          </div>
        </div>
        <button
          type="button"
          className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
          onClick={addImage}
        >
          <Plus size={16} /> Add Image
        </button>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((img, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex items-center gap-3">
              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-700">Image Title</label>
                <input
                  className={`${formInputClass} text-sm`}
                  placeholder="Leadership Training"
                  value={img.title}
                  onChange={(e) => updateImage(index, "title", e.target.value)}
                />
              </div>
              <div className="flex-grow">
                {uploadingIndex === index ? (
                  <p className="text-sm text-blue-600 py-2">Uploading...</p>
                ) : (
                  <FileUpload
                    label="Upload Image"
                    accept="image/*"
                    maxSize="5MB"
                    previewUrl={img.url}
                    onFileSelect={(file) => handleFileSelect(index, file)}
                    onClearPreview={() => updateImage(index, "url", "")}
                  />
                )}
              </div>
              <button
                type="button"
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-6"
                onClick={() => removeImage(index)}
              >
                <Trash size={18} />
              </button>
            </div>
          ))}
        </div>
        {images.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">No images added yet.</p>
        )}
      </div>
    </div>
  );
};

export default GallerySection;