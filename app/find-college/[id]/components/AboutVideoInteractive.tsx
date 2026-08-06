"use client";

import React, { useState, useEffect } from "react";

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
  const mainVideo = React.useMemo(() => {
    if (!videos || !Array.isArray(videos) || videos.length === 0) return null;
    return videos.find((v) => v.url) || null;
  }, [videos]);

  if (!mainVideo) return null;

  const youtubeId = getYouTubeId(mainVideo.url);

  return (
    <div className="relative h-[50vh] w-full overflow-hidden rounded-md bg-brand-blue ring-1 ring-gray-200/50 sm:h-85">
      {isIframeEmbed(mainVideo.url) ? (
        <div
          className="absolute inset-0 h-full w-full [&_iframe]:!w-full [&_iframe]:!h-full"
          dangerouslySetInnerHTML={{ __html: mainVideo.url }}
        />
      ) : youtubeId ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}`}
          allow="autoplay; encrypted-media"
          allowFullScreen
          title={mainVideo.message || "Video"}
        />
      ) : (
        <video
          className="absolute inset-0 h-full w-full bg-brand-blue object-cover transition-opacity duration-300"
          src={mainVideo.url}
          autoPlay
          loop
          muted
          playsInline
        />
      )}
    </div>
  );
};

export default AboutVideoInteractive;
