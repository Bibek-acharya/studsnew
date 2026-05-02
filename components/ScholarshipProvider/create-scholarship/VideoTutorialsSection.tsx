"use client";

import React from "react";
import { Plus, Trash } from "@phosphor-icons/react";

interface VideoTutorial {
  url: string;
  title: string;
  description: string;
}

interface VideoTutorialsSectionProps {
  videos: VideoTutorial[];
  setVideos: React.Dispatch<React.SetStateAction<VideoTutorial[]>>;
}

const formInputClass = "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500";
const formTextareaClass = "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500 min-h-[80px]";

export const VideoTutorialsSection: React.FC<VideoTutorialsSectionProps> = ({
  videos,
  setVideos,
}) => {
  const addVideo = () => {
    setVideos([...videos, { url: "", title: "", description: "" }]);
  };

  const removeVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const updateVideo = (index: number, field: keyof VideoTutorial, value: string) => {
    setVideos(videos.map((v, i) => i === index ? { ...v, [field]: value } : v));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
      <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4 flex items-center gap-3">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Video Tutorials Section</h2>
          <p className="text-sm text-gray-500 mt-0.5">Add educational videos to help users understand the scholarship</p>
        </div>
      </div>
      <div className="p-6 space-y-8">
        {videos.map((video, index) => (
          <div key={index} className="p-5 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
            <h3 className="font-semibold text-gray-800 border-b pb-2">
              Video {index + 1} - {index === 0 ? "How to Apply" : "Program Overview"}
            </h3>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                YouTube Video Embed URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={formInputClass}
                placeholder="https://www.youtube.com/embed/..."
                value={video.url}
                onChange={(e) => updateVideo(index, "url", e.target.value)}
              />
              <p className="text-xs text-gray-500">Use the embed URL (not the watch URL)</p>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Video Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={formInputClass}
                placeholder={index === 0 ? "How to Apply..." : "Program Journey..."}
                value={video.title}
                onChange={(e) => updateVideo(index, "title", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Short Description <span className="text-red-500">*</span>
              </label>
              <textarea
                className={formTextareaClass}
                rows={2}
                placeholder="Video description..."
                value={video.description}
                onChange={(e) => updateVideo(index, "description", e.target.value)}
              />
            </div>
            <button
              type="button"
              className="text-red-500 text-sm font-medium hover:text-red-700 flex items-center gap-1"
              onClick={() => removeVideo(index)}
            >
              <Trash size={16} /> Remove Video
            </button>
          </div>
        ))}
        {videos.length < 2 && (
          <button
            type="button"
            className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 flex items-center gap-1.5 transition-colors shadow-sm"
            onClick={addVideo}
          >
            <Plus size={16} /> Add Video
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoTutorialsSection;