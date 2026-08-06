"use client";

import React, { useState, useEffect } from "react";
import { getImageUrl } from "@/services/api";
import RichText from "@/components/RichText";

type CardData = {
  avatar: string;
  title: string;
  author: string;
  role: string;
  video: string;
};

interface VideoEntry {
  url: string;
  message: string;
  name: string;
  designation: string;
  avatar: string;
}

const getYouTubeId = (url: string): string | null => {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? match[1] : null;
};

const isIframeEmbed = (url: string): boolean => {
  if (!url) return false;
  return url.trim().toLowerCase().startsWith("<iframe");
};

const AboutVideoInteractive: React.FC<{ videos?: VideoEntry[] }> = ({
  videos,
}) => {
  const cardData = React.useMemo(() => {
    if (!videos || videos.length === 0) return {};
    if (!Array.isArray(videos)) return {};
    const data: Record<string, CardData> = {};
    videos.forEach((v, i) => {
      if (!v.url) return;
      const key = v.name || `Video ${i + 1}`;
      data[key] = {
        avatar: v.avatar || "",
        title: v.message || "Video",
        author: v.name || "",
        role: v.designation || "",
        video: v.url,
      };
    });
    return data;
  }, [videos]);

  const allKeys = Object.keys(cardData);
  const [mainKey, setMainKey] = useState("");
  const [showMessageModal, setShowMessageModal] = useState(false);

  useEffect(() => {
    if (!allKeys.includes(mainKey)) {
      setMainKey(allKeys[0] || "");
    }
  }, [allKeys, mainKey]);

  const mainData = cardData[mainKey];

  if (!mainData || allKeys.length === 0) return null;

  const mainYouTubeId = getYouTubeId(mainData.video);
  const messageIsLong = mainData.title && mainData.title.length > 120;

  return (
    <>
      <div className="mx-auto mb-10 flex w-full flex-col gap-6 xl:flex-row xl:gap-8">
        {/* Video - 2/3 width */}
        <div className="relative h-[50vh] w-full min-w-0 flex-[2] overflow-hidden rounded-md bg-brand-blue ring-1 ring-gray-200/50 sm:h-85">
          {isIframeEmbed(mainData.video) ? (
            <div
              className="absolute inset-0 h-full w-full"
              dangerouslySetInnerHTML={{ __html: mainData.video }}
            />
          ) : mainYouTubeId ? (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube.com/embed/${mainYouTubeId}?autoplay=1&mute=1&loop=1&playlist=${mainYouTubeId}`}
              allow="autoplay; encrypted-media"
              allowFullScreen
              title={mainData.title}
            />
          ) : (
            <video
              className="absolute inset-0 h-full w-full bg-brand-blue object-cover transition-opacity duration-300"
              src={mainData.video}
              autoPlay
              loop
              muted
              playsInline
            />
          )}
        </div>

        {/* Message card - 1/3 width */}
        <div className="relative h-[50vh] w-full min-w-0 flex-[1] overflow-hidden rounded-md border border-white/10 bg-brand-blue sm:h-auto">
          <div className="relative z-10 flex h-full flex-col justify-center px-5 py-6 sm:px-6">
            {mainData.avatar ? (
              <img
                src={getImageUrl(mainData.avatar)}
                alt="Avatar"
                className="mb-3 h-12 w-12 rounded-md border border-white/20 object-cover sm:mb-4 sm:h-14 sm:w-14"
              />
            ) : (
              <div className="mb-3 h-12 w-12 rounded-md border border-white/20 bg-white/10 flex items-center justify-center sm:mb-4 sm:h-14 sm:w-14">
                <i className="fa-solid fa-user text-white/60"></i>
              </div>
            )}
            <RichText
              html={mainData.title}
              variant="sm"
              as="h2"
              className={`mb-2 text-[16px] font-normal leading-tight tracking-tight text-white sm:mb-3 sm:text-[18px] ${messageIsLong ? "line-clamp-4" : ""}`}
            />
            {messageIsLong && (
              <button
                type="button"
                onClick={() => setShowMessageModal(true)}
                className="mb-4 text-[13px] font-medium text-blue-200 hover:text-white"
              >
                See more
              </button>
            )}
            <div className="mt-auto">
              <h4 className="mb-1 text-[11px] font-bold uppercase tracking-wide text-white sm:text-[12px]">
                {mainData.author}
              </h4>
              <p className="text-[12px] text-blue-200/60">{mainData.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Message modal */}
      {showMessageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowMessageModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Message</h3>
              <button
                type="button"
                onClick={() => setShowMessageModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            <RichText
              html={mainData.title}
              variant="sm"
              className="text-[14px] leading-relaxed text-gray-700"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AboutVideoInteractive;
