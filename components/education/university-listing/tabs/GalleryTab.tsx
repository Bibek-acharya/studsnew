"use client";

import React, { useState, useEffect } from "react";
import EmptyTabState from "@/app/find-college/[id]/components/EmptyTabState";

interface GalleryTabProps {
  galleryList: any[];
}

export default function GalleryTab({ galleryList }: GalleryTabProps) {
  const [galFolder, setGalFolder] = useState("all");
  const [galCount, setGalCount] = useState(9);
  const [galIdx, setGalIdx] = useState<number | null>(null);

  useEffect(() => {
    setGalCount(9);
  }, [galFolder]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (galIdx === null) return;
      if (e.key === "Escape") setGalIdx(null);
      if (e.key === "ArrowLeft") {
        setGalIdx((p) => {
          if (p === null) return null;
          return p === 0 ? currentImages.length - 1 : p - 1;
        });
      }
      if (e.key === "ArrowRight") {
        setGalIdx((p) => {
          if (p === null) return null;
          return p === currentImages.length - 1 ? 0 : p + 1;
        });
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [galIdx]);

  if (galleryList.length === 0) {
    return <EmptyTabState tabName="Gallery" />;
  }

  const groups = new Map<string, string[]>();
  for (const img of galleryList) {
    if ((img as any).images) {
      const folder = (img as any).folder || "Gallery";
      for (const sub of (img as any).images) {
        const url = sub.url || sub.image || sub.src;
        if (url) {
          if (!groups.has(folder)) groups.set(folder, []);
          groups.get(folder)!.push(url);
        }
      }
    } else {
      const folder = (img as any).folder || (img as any).group || "Gallery";
      const url = (img as any).url || (img as any).image || (img as any).src;
      if (url) {
        if (!groups.has(folder)) groups.set(folder, []);
        groups.get(folder)!.push(url);
      }
    }
  }

  const allFolders = Array.from(groups.keys());
  const currentImages = galFolder === "all"
    ? Array.from(groups.values()).flat()
    : groups.get(galFolder) || [];

  return (
    <div className="px-4 sm:px-0">
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">Campus Gallery</h2>
      </div>
      {allFolders.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setGalFolder("all")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${galFolder === "all" ? "bg-brand-blue text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            All
          </button>
          {allFolders.map((f) => (
            <button
              key={f}
              onClick={() => setGalFolder(f)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${galFolder === f ? "bg-brand-blue text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {f}
            </button>
          ))}
        </div>
      )}
      {galFolder === "all" ? (
        <div className="space-y-8">
          {allFolders.map((folder) => {
            const folderImages = groups.get(folder) || [];
            return (
              <div key={folder}>
                <h3 className="mb-4 text-[16px] font-bold text-gray-800">{folder}</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {folderImages.slice(0, galCount).map((url, idx) => (
                    <div
                      key={url}
                      className="aspect-[16/10] overflow-hidden rounded-md cursor-pointer bg-brand-blue"
                      onClick={() => setGalIdx(idx)}
                    >
                      <img
                        src={url}
                        className="h-full w-full object-cover transition duration-300 hover:scale-105"
                        alt="Gallery"
                      />
                    </div>
                  ))}
                </div>
                {galCount < folderImages.length && (
                  <div className="mt-4 text-center">
                    <button
                      className="rounded-md bg-brand-blue px-6 py-2 text-sm font-bold text-white hover:bg-brand-hover transition"
                      onClick={() => setGalCount((p) => p + 9)}
                    >
                      Load More
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <>
          <h3 className="mb-4 text-[16px] font-bold text-gray-800">{galFolder}</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {currentImages.slice(0, galCount).map((url, idx) => (
              <div
                key={url}
                className="aspect-[16/10] overflow-hidden rounded-md cursor-pointer bg-brand-blue"
                onClick={() => setGalIdx(idx)}
              >
                <img
                  src={url}
                  className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  alt="Gallery"
                />
              </div>
            ))}
          </div>
          {galCount < currentImages.length && (
            <div className="mt-8 text-center">
              <button
                className="rounded-md bg-brand-blue px-8 py-3 text-sm font-bold text-white hover:bg-brand-hover transition"
                onClick={() => setGalCount((p) => p + 9)}
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
      {galIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setGalIdx(null)}
        >
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            onClick={(e) => {
              e.stopPropagation();
              setGalIdx((p) => (p === null ? null : p === 0 ? currentImages.length - 1 : p - 1));
            }}
          >
            <i className="fa-solid fa-chevron-left text-xl"></i>
          </button>
          <img
            src={currentImages[galIdx]}
            alt="Gallery preview"
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            onClick={(e) => {
              e.stopPropagation();
              setGalIdx((p) => (p === null ? null : p === currentImages.length - 1 ? 0 : p + 1));
            }}
          >
            <i className="fa-solid fa-chevron-right text-xl"></i>
          </button>
          <button
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            onClick={() => setGalIdx(null)}
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
      )}
    </div>
  );
}
