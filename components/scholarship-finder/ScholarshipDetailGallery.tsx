"use client";

import { useMemo } from "react";
import { ArrowRight } from "lucide-react";

export default function GalleryTab({ images, lightboxIndex, setLightboxIndex, closeLightbox, changeImage }: {
  images: { url: string; title: string; folder: string }[];
  lightboxIndex: number | null;
  setLightboxIndex: (i: number | null) => void;
  closeLightbox: () => void;
  changeImage: (dir: number) => void;
}) {
  if (images.length === 0) return null;

  const urls = images.map(i => i.url);

  const grouped: { heading: string; items: typeof images }[] = useMemo(() => {
    const groups = new Map<string, typeof images>();
    for (const img of images) {
      const key = img.folder || "Gallery";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(img);
    }
    return Array.from(groups.entries()).map(([heading, imgs]) => ({ heading, items: imgs }));
  }, [images]);

  return (
    <div className="space-y-10">
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900">Photo Gallery</h2>
        <p className="text-[14px] text-gray-500 mt-1">Glimpses of our programs and events</p>
      </div>
      {grouped.map((group, gi) => (
          <div key={gi} className="space-y-5">
            <h3 className="text-lg font-bold text-gray-800 capitalize tracking-tight">{group.heading}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
            {group.items.slice(0, group.items.length > 8 ? 7 : 8).map((img, ii) => {
              const globalIndex = urls.indexOf(img.url);
              return (
                <div
                  key={ii}
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-300"
                  onClick={() => setLightboxIndex(globalIndex >= 0 ? globalIndex : null)}
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gray-50">
                    <img
                      src={img.url}
                      alt={img.title || "Gallery image"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
              );
            })}
            {group.items.length > 8 && (
              <div
                className="group cursor-pointer overflow-hidden rounded-2xl border border-blue-100 border-dashed bg-blue-50/30 p-1.5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300"
                onClick={() => {
                  const firstIdx = urls.indexOf(group.items[0].url);
                  setLightboxIndex(firstIdx >= 0 ? firstIdx : null);
                }}
              >
                <div className="aspect-[4/3] overflow-hidden rounded-xl bg-blue-600/5 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                  <span className="mt-2 font-bold text-sm text-blue-700">View All</span>
                </div>
                <p className="text-[12px] text-blue-600/60 mt-2 px-1 text-center font-bold tracking-tight">
                  +{group.items.length - 7} PHOTOS
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
