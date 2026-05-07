"use client";

import React, { useState } from "react";
import { Plus, Trash } from "@phosphor-icons/react";
import { scholarshipProviderApi } from "@/services/scholarshipProviderApi";
import FileUpload from "../common/FileUpload";

export interface GalleryEntry {
  title: string;
  url: string;
}

export interface GalleryGroup {
  folder: string;
  images: GalleryEntry[];
}

interface GallerySectionProps {
  groups: GalleryGroup[];
  setGroups: React.Dispatch<React.SetStateAction<GalleryGroup[]>>;
}

const formInputClass = "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500";

export const GallerySection: React.FC<GallerySectionProps> = ({ groups, setGroups }) => {
  const [uploadingInfo, setUploadingInfo] = useState<{ groupIndex: number; imageIndex: number } | null>(null);

  const addGroup = () => {
    setGroups([...groups, { folder: "", images: [] }]);
  };

  const removeGroup = (groupIndex: number) => {
    setGroups(groups.filter((_, i) => i !== groupIndex));
  };

  const updateFolder = (groupIndex: number, value: string) => {
    setGroups(groups.map((g, i) => i === groupIndex ? { ...g, folder: value } : g));
  };

  const addImage = (groupIndex: number) => {
    setGroups(groups.map((g, i) =>
      i === groupIndex && g.images.length < 8
        ? { ...g, images: [...g.images, { title: "", url: "" }] }
        : g
    ));
  };

  const removeImage = (groupIndex: number, imageIndex: number) => {
    setGroups(groups.map((g, i) =>
      i === groupIndex ? { ...g, images: g.images.filter((_, pi) => pi !== imageIndex) } : g
    ));
  };

  const updateImage = (groupIndex: number, imageIndex: number, field: keyof GalleryEntry, value: string) => {
    setGroups(groups.map((g, i) =>
      i === groupIndex
        ? { ...g, images: g.images.map((img, pi) => pi === imageIndex ? { ...img, [field]: value } : img) }
        : g
    ));
  };

  const handleFileSelect = async (groupIndex: number, imageIndex: number, file: File) => {
    setUploadingInfo({ groupIndex, imageIndex });
    try {
      const url = await scholarshipProviderApi.uploadImage(file, "gallery");
      setGroups(groups.map((g, i) =>
        i === groupIndex
          ? { ...g, images: g.images.map((img, pi) => pi === imageIndex ? { ...img, url } : img) }
          : g
      ));
    } catch (error) {
      console.error("Failed to upload image:", error);
    } finally {
      setUploadingInfo(null);
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
          onClick={addGroup}
        >
          <Plus size={16} /> Add Gallery Group
        </button>
      </div>

      <div className="p-6 space-y-8">
        {groups.map((group, groupIndex) => (
          <div key={groupIndex} className="border border-gray-200 rounded-2xl p-5">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gallery Folder Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-sm"
                  placeholder="e.g. Leadership Workshop"
                  value={group.folder}
                  onChange={(e) => updateFolder(groupIndex, e.target.value)}
                />
              </div>
              <button
                type="button"
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg shrink-0 mt-5"
                onClick={() => removeGroup(groupIndex)}
              >
                <Trash size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {group.images.map((img, imageIndex) => (
                <div key={imageIndex} className="border border-gray-200 rounded-2xl p-4 bg-white relative">
                  <button
                    type="button"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center z-10"
                    onClick={() => removeImage(groupIndex, imageIndex)}
                  >
                    <Trash size={14} />
                  </button>

                  {uploadingInfo?.groupIndex === groupIndex && uploadingInfo?.imageIndex === imageIndex ? (
                    <p className="text-sm text-blue-600 py-20 text-center">Uploading...</p>
                  ) : (
                    <FileUpload
                      label=""
                      uploadedText="Image uploaded"
                      accept="image/*"
                      maxSize="5MB"
                      previewUrl={img.url}
                      previewClassName="w-full h-44 object-cover rounded-2xl"
                      onFileSelect={(file) => handleFileSelect(groupIndex, imageIndex, file)}
                      onClearPreview={() => updateImage(groupIndex, imageIndex, "url", "")}
                    />
                  )}

                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">
                      Image Title
                    </label>
                    <input
                      type="text"
                      className={formInputClass}
                      placeholder="Leadership Training"
                      value={img.title}
                      onChange={(e) => updateImage(groupIndex, imageIndex, "title", e.target.value)}
                    />
                  </div>
                </div>
              ))}

              {group.images.length < 8 && (
                <button
                  type="button"
                  className="border-2 border-dashed border-gray-300 rounded-2xl min-h-[280px] flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50/40 transition"
                  onClick={() => addImage(groupIndex)}
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 text-3xl mb-4">
                    +
                  </div>
                  <p className="font-semibold text-gray-800">Add Image</p>
                  <p className="text-sm text-gray-400 mt-1">Maximum 8 images</p>
                </button>
              )}
            </div>

            <div className="mt-5 text-xs text-gray-400">
              Max 3 cards per row • Max 8 images per folder
            </div>
          </div>
        ))}

        {groups.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">No images added yet.</p>
        )}
      </div>
    </div>
  );
};

export default GallerySection;
