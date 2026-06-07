"use client";

import React, { useState, useEffect } from "react";
import { getImageUrl } from "@/services/api";

type CardData = {
  avatar: string;
  title: string;
  quote: string;
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
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
};

const AboutVideoInteractive: React.FC<{ videos?: VideoEntry[] }> = ({ videos }) => {
  const cardData = React.useMemo(() => {
    if (!videos || videos.length === 0) return {};
    const data: Record<string, CardData> = {};
    videos.forEach((v, i) => {
      const key = v.name || `Video ${i + 1}`;
      data[key] = {
        avatar: v.avatar || "",
        title: v.message || "Video",
        quote: "",
        author: v.name || "",
        role: v.designation || "",
        video: v.url,
      };
    });
    return data;
  }, [videos]);

  const allKeys = Object.keys(cardData);
  const [mainKey, setMainKey] = useState("");
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!allKeys.includes(mainKey)) {
      setMainKey(allKeys[0] || "");
    }
  }, [allKeys, mainKey]);

  const others = allKeys.filter((k) => k !== mainKey);
  const mainData = cardData[mainKey];

  const handleSwap = (newKey: string) => {
    setFading(true);
    setTimeout(() => {
      setMainKey(newKey);
      setFading(false);
    }, 150);
  };

  if (!mainData || allKeys.length === 0) return null;

  const mainYouTubeId = getYouTubeId(mainData.video);

  return (
    <div className="mx-auto mb-10 flex w-full flex-col gap-6 xl:flex-row xl:gap-8">
      <div className="relative h-[50vh] w-full min-w-0 flex-1 overflow-hidden rounded-md bg-brand-blue ring-1 ring-gray-200/50 sm:h-85 sm:rounded-md">
        {mainYouTubeId ? (
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
        <div className="absolute right-5 top-5 z-20 flex max-h-[calc(100%-40px)] flex-col gap-2 overflow-y-auto pb-4 pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {others.map((key) => {
            const data = cardData[key];
            const ytId = getYouTubeId(data.video);
            return (
              <div
                key={key}
                onClick={() => handleSwap(key)}
                className="group relative h-12.5 w-[70px] shrink-0 cursor-pointer transition-transform sm:h-[55px] sm:w-[85px]"
              >
                <div className="relative h-full w-full overflow-hidden rounded-md border-2 border-white bg-brand-blue sm:rounded-md">
                  {ytId ? (
                    <iframe
                      className="absolute inset-0 h-full w-full pointer-events-none"
                      src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0`}
                      allow="autoplay; encrypted-media"
                      title={key}
                    />
                  ) : (
                    <video
                      className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                      src={data.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 z-30 flex h-[80%] flex-col justify-end bg-linear-to-t from-black/90 via-black/40 to-transparent p-1">
                    <span
                      className="truncate text-[8px] font-bold leading-tight text-white sm:text-[9px]"
                      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}
                    >
                      {key}
                    </span>
                    <span
                      className="mt-0.5 truncate text-[6px] font-medium leading-tight text-gray-300 sm:text-[7px]"
                      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}
                    >
                      {data.role}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative h-[50vh] w-full max-w-[380px] shrink-0 overflow-hidden rounded-md border border-white/10 bg-brand-blue sm:h-[340px]">
        <div
          className={`relative z-10 flex h-full flex-col justify-center px-5 py-6 transition-opacity duration-150 sm:px-6 ${fading ? "opacity-50" : "opacity-100"}`}
        >
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
          <h2
            dangerouslySetInnerHTML={{ __html: mainData.title }}
            className="mb-2 text-[16px] font-normal leading-tight tracking-tight text-white sm:mb-3 sm:text-[18px]"
          />
          <p className="mb-4 text-[12px] leading-relaxed text-blue-100/80 sm:text-[13px]">
            {mainData.quote}
          </p>
          <div className="mt-auto">
            <h4 className="mb-1 text-[11px] font-bold uppercase tracking-wide text-white sm:text-[12px]">
              {mainData.author}
            </h4>
            <p className="text-[12px] text-blue-200/60">{mainData.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutVideoInteractive;