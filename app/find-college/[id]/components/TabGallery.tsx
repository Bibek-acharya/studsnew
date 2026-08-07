"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import EmptyTabState from "./EmptyTabState";

interface GalleryGroup {
  folder: string;
  images: string[];
}

interface TabGalleryProps {
  images: GalleryGroup[] | string[];
}

const IMAGES_PER_FOLDER = 3;

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

  const openLightbox = useCallback((groupIndex: number, imageIndex: number) => {
    setSelectedGroupIndex(groupIndex);
    setSelectedImageIndex(imageIndex);
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedGroupIndex(null);
    setSelectedImageIndex(null);
  }, []);

  const handlePrevImage = useCallback(() => {
    if (selectedGroupIndex === null || selectedImageIndex === null) return;
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    } else {
      if (selectedGroupIndex > 0) {
        setSelectedGroupIndex(selectedGroupIndex - 1);
        setSelectedImageIndex(groups[selectedGroupIndex - 1].images.length - 1);
      } else {
        setSelectedGroupIndex(groups.length - 1);
        setSelectedImageIndex(groups[groups.length - 1].images.length - 1);
      }
    }
  }, [selectedGroupIndex, selectedImageIndex, groups]);

  const handleNextImage = useCallback(() => {
    if (selectedGroupIndex === null || selectedImageIndex === null) return;
    const currentGroup = groups[selectedGroupIndex];
    if (selectedImageIndex < currentGroup.images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    } else {
      if (selectedGroupIndex < groups.length - 1) {
        setSelectedGroupIndex(selectedGroupIndex + 1);
        setSelectedImageIndex(0);
      } else {
        setSelectedGroupIndex(0);
        setSelectedImageIndex(0);
      }
    }
  }, [selectedGroupIndex, selectedImageIndex, groups]);

  useEffect(() => {
    if (selectedGroupIndex === null || selectedImageIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevImage();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNextImage();
      } else if (e.key === "Escape") {
        e.preventDefault();
        closeLightbox();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedGroupIndex, selectedImageIndex, handlePrevImage, handleNextImage, closeLightbox]);

  const currentGroup = selectedGroupIndex !== null ? groups[selectedGroupIndex] : null;
  const currentLightboxImage = currentGroup && selectedImageIndex !== null
    ? currentGroup.images[selectedImageIndex]
    : null;

  if (groups.length === 0 || allImages.length === 0)
    return <EmptyTabState tabName="gallery images" />;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">Campus Gallery</h2>
      </div>

      <div className="space-y-8">
        {groups.map((group, groupIndex) => {
          const visibleImages = group.images.slice(0, IMAGES_PER_FOLDER);
          const remainingCount = group.images.length - IMAGES_PER_FOLDER;

          return (
            <div key={groupIndex}>
              {group.folder && (
                <h3 className="text-[16px] font-semibold text-gray-800 mb-4">
                  {group.folder}
                </h3>
              )}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {visibleImages.map((image: string, imageIndex: number) => {
                  const isThirdImage = imageIndex === IMAGES_PER_FOLDER - 1;
                  const showOverlay = isThirdImage && remainingCount > 0;

                  return (
                    <div
                      key={image}
                      className="aspect-[16/10] overflow-hidden rounded-md cursor-pointer bg-brand-blue relative"
                      onClick={() => openLightbox(groupIndex, showOverlay ? IMAGES_PER_FOLDER : imageIndex)}
                    >
                      <img
                        src={image}
                        className="h-full w-full object-cover transition duration-300 hover:scale-105"
                        alt={group.folder || "Gallery"}
                      />
                      {showOverlay && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition hover:bg-black/60">
                          <span className="text-white text-xl font-bold">
                            +{remainingCount} more images
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {currentLightboxImage && currentGroup && (
        <div
          className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-black/90"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition z-10"
            onClick={closeLightbox}
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>

          {/* Main image area */}
          <div className="flex items-center justify-center flex-1 w-full px-4 pb-4">
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition z-10"
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
              className="max-h-[70vh] max-w-[85vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition z-10"
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
            >
              <i className="fa-solid fa-chevron-right text-xl"></i>
            </button>
          </div>

          {/* Thumbnails strip */}
          <div
            className="w-full bg-black/80 px-4 py-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center gap-2 overflow-x-auto max-w-[90vw] mx-auto">
              {currentGroup.images.map((image: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition ${
                    idx === selectedImageIndex
                      ? "border-white"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
            <p className="text-white/70 text-xs text-center mt-2">
              {selectedImageIndex !== null ? selectedImageIndex + 1 : 0} / {currentGroup.images.length}
              {currentGroup.folder ? ` — ${currentGroup.folder}` : ""}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabGallery;
