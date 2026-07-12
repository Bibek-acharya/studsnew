"use client";

import React, { useState, useMemo } from "react";
import EmptyTabState from "./EmptyTabState";

interface GalleryGroup {
  folder: string;
  images: string[];
}

interface TabGalleryProps {
  images: GalleryGroup[] | string[];
}

const TabGallery: React.FC<TabGalleryProps> = ({ images }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );
  const [activeFolder, setActiveFolder] = useState<string>("all");
  const [visibleImageCount, setVisibleImageCount] = useState(9);

  const groups: GalleryGroup[] = useMemo(() => {
    if (!images || images.length === 0) return [];
    if (typeof images[0] === "string") {
      return [{ folder: "Gallery", images: images as string[] }];
    }
    return images as GalleryGroup[];
  }, [images]);

  const allFolders = groups.map((g) => g.folder);
  const activeImages = useMemo(() => {
    if (activeFolder === "all") {
      return groups.flatMap((g) => g.images);
    }
    return groups.find((g) => g.folder === activeFolder)?.images || [];
  }, [groups, activeFolder]);

  if (groups.length === 0 || activeImages.length === 0)
    return <EmptyTabState tabName="gallery images" />;

  const handlePrevImage = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) =>
      prev === 0 ? activeImages.length - 1 : (prev as number) - 1,
    );
  };

  const handleNextImage = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) =>
      prev === activeImages.length - 1 ? 0 : (prev as number) + 1,
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">Campus Gallery</h2>
      </div>

      {allFolders.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => {
              setActiveFolder("all");
              setVisibleImageCount(9);
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeFolder === "all" ? "bg-brand-blue text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            All
          </button>
          {allFolders.map((folder) => (
            <button
              key={folder}
              onClick={() => {
                setActiveFolder(folder);
                setVisibleImageCount(9);
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeFolder === folder ? "bg-brand-blue text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {folder}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {activeImages
          .slice(0, visibleImageCount)
          .map((image: string, index: number) => (
            <div
              key={image}
              className="aspect-[16/10] overflow-hidden rounded-md cursor-pointer bg-brand-blue"
              onClick={() => setSelectedImageIndex(index)}
            >
              <img
                src={image}
                className="h-full w-full object-cover transition duration-300 hover:scale-105"
                alt="Gallery"
              />
            </div>
          ))}
      </div>

      {visibleImageCount < activeImages.length && (
        <div className="mt-8 text-center">
          <button
            className="rounded-md bg-brand-blue px-8 py-3 text-sm font-bold text-white hover:bg-brand-hover transition"
            onClick={() => setVisibleImageCount((prev) => prev + 9)}
          >
            Load More
          </button>
        </div>
      )}

      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setSelectedImageIndex(null)}
        >
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevImage();
            }}
          >
            <i className="fa-solid fa-chevron-left text-xl"></i>
          </button>
          <img
            src={activeImages[selectedImageIndex]}
            alt="Gallery preview"
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            onClick={(e) => {
              e.stopPropagation();
              handleNextImage();
            }}
          >
            <i className="fa-solid fa-chevron-right text-xl"></i>
          </button>
          <button
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            onClick={() => setSelectedImageIndex(null)}
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default TabGallery;
