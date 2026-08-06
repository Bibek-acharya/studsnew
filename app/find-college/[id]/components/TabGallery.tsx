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
  const [selectedGroupIndex, setSelectedGroupIndex] = useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const groups: GalleryGroup[] = useMemo(() => {
    if (!images || images.length === 0) return [];
    if (typeof images[0] === "string") {
      return [{ folder: "Gallery", images: images as string[] }];
    }
    return images as GalleryGroup[];
  }, [images]);

  const allImages = useMemo(() => groups.flatMap((g) => g.images), [groups]);

  if (groups.length === 0 || allImages.length === 0)
    return <EmptyTabState tabName="gallery images" />;

  const openLightbox = (groupIndex: number, imageIndex: number) => {
    setSelectedGroupIndex(groupIndex);
    setSelectedImageIndex(imageIndex);
  };

  const closeLightbox = () => {
    setSelectedGroupIndex(null);
    setSelectedImageIndex(null);
  };

  const handlePrevImage = () => {
    if (selectedGroupIndex === null || selectedImageIndex === null) return;
    const currentGroup = groups[selectedGroupIndex];
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    } else {
      // go to previous group's last image
      if (selectedGroupIndex > 0) {
        setSelectedGroupIndex(selectedGroupIndex - 1);
        setSelectedImageIndex(groups[selectedGroupIndex - 1].images.length - 1);
      } else {
        // wrap to last group's last image
        setSelectedGroupIndex(groups.length - 1);
        setSelectedImageIndex(groups[groups.length - 1].images.length - 1);
      }
    }
  };

  const handleNextImage = () => {
    if (selectedGroupIndex === null || selectedImageIndex === null) return;
    const currentGroup = groups[selectedGroupIndex];
    if (selectedImageIndex < currentGroup.images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    } else {
      // go to next group's first image
      if (selectedGroupIndex < groups.length - 1) {
        setSelectedGroupIndex(selectedGroupIndex + 1);
        setSelectedImageIndex(0);
      } else {
        // wrap to first group's first image
        setSelectedGroupIndex(0);
        setSelectedImageIndex(0);
      }
    }
  };

  const currentLightboxImage =
    selectedGroupIndex !== null && selectedImageIndex !== null
      ? groups[selectedGroupIndex]?.images[selectedImageIndex]
      : null;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">Campus Gallery</h2>
      </div>

      <div className="space-y-8">
        {groups.map((group, groupIndex) => (
          <div key={groupIndex}>
            {group.folder && (
              <h3 className="text-[16px] font-semibold text-gray-800 mb-4">
                {group.folder}
              </h3>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {group.images.map((image: string, imageIndex: number) => (
                <div
                  key={image}
                  className="aspect-[16/10] overflow-hidden rounded-md cursor-pointer bg-brand-blue"
                  onClick={() => openLightbox(groupIndex, imageIndex)}
                >
                  <img
                    src={image}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    alt={group.folder || "Gallery"}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {currentLightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={closeLightbox}
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
            src={currentLightboxImage}
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
            onClick={closeLightbox}
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default TabGallery;
