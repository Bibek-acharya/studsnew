"use client";

import React, { useState } from "react";
import RichText from "@/components/RichText";
import {
  BadgeCheck,
  Eye,
  Target,
  Landmark,
  Users,
} from "lucide-react";

interface AboutTabProps {
  name: string;
  description: string;
  aboutData: Record<string, any>;
  overviewList: any[];
  leadershipList: any[];
  latestNewsList: any[];
}

const getYouTubeId = (url: string): string | null => {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? match[1] : null;
};

export default function AboutTab({
  name,
  description,
  aboutData,
  overviewList,
  leadershipList,
  latestNewsList,
}: AboutTabProps) {
  const [showAllNews, setShowAllNews] = useState(false);

  const videoUrl =
    (aboutData?.video_url as string) ||
    (Array.isArray(aboutData?.videos) && aboutData.videos[0]?.url) ||
    "";
  const ytId = videoUrl ? getYouTubeId(videoUrl) : null;

  return (
    <div className="space-y-10 px-4 sm:px-0">
      {latestNewsList.length > 0 && (
        <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <img
                  src="/icon.png"
                  alt="StudSphere Team"
                  className="h-12 w-12 rounded-full object-cover border-2 border-blue-500"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-[15px]">StudSphere Team</span>
                  <BadgeCheck className="h-4 w-4 shrink-0 fill-blue-500 text-white" />
                </div>
                <div className="flex items-center gap-2 text-[13px] text-gray-500 mt-0.5">
                  <span>Content Curator</span>
                  <span>•</span>
                  <span>Updated at: {latestNewsList[0]?.date || new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 py-3 bg-blue-50 border-b border-gray-100">
            <h3 className="text-[16px] font-bold text-gray-900">
              {name} Latest News & Stories
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {(showAllNews ? latestNewsList : latestNewsList.slice(0, 10)).map((item: any, idx: number) => (
              <div key={idx} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <span className="text-[13px] font-bold text-blue-600 whitespace-nowrap mt-0.5">{item.date || "-"}</span>
                  <div className="flex-1">
                    <RichText
                      html={item.text || ""}
                      variant="sm"
                      className="text-[14px] text-gray-700 leading-relaxed"
                    />
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-[13px] font-semibold text-blue-600 underline hover:text-blue-800 transition-colors"
                      >
                        View Detail
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {latestNewsList.length > 10 && !showAllNews && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setShowAllNews(true)}
                className="w-full text-center text-[14px] font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                View More ({latestNewsList.length - 10} more)
              </button>
            </div>
          )}
        </div>
      )}

      <RichText
        html={description}
        className="space-y-6 text-[15px] leading-[1.8] text-gray-600 md:text-[16px]"
      />

      {ytId ? (
        <div className="relative h-[240px] w-full overflow-hidden rounded-md border border-gray-100 bg-brand-blue md:h-[400px]">
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}`}
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="University Video"
          />
        </div>
      ) : null}

      {aboutData?.description && (
        <RichText
          html={aboutData.description as string}
          className="space-y-6 text-[15px] leading-[1.8] text-gray-600 md:text-[16px]"
        />
      )}

      {(aboutData?.vision || aboutData?.mission) && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {aboutData?.vision && (
            <div className="rounded-md border border-gray-100 bg-[#f4f7fb] p-8">
              <div className="mb-4 flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100/80 text-blue-600">
                  <Eye className="h-5 w-5" />
                </div>
                <h3 className="text-[16px] font-bold text-gray-900">Our Vision</h3>
              </div>
              <RichText
                html={aboutData.vision as string}
                variant="sm"
                className="text-[14.5px] leading-[1.7] text-gray-600"
              />
            </div>
          )}
          {aboutData?.mission && (
            <div className="rounded-md border border-gray-100 bg-[#f0fdf4] p-8">
              <div className="mb-4 flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100/80 text-green-600">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="text-[16px] font-bold text-gray-900">Our Mission</h3>
              </div>
              <RichText
                html={aboutData.mission as string}
                variant="sm"
                className="text-[14.5px] leading-[1.7] text-gray-600"
              />
            </div>
          )}
        </div>
      )}

      {overviewList.filter((row: any) => (row.label || row.key || row.field) && (row.value || row.val)).length > 0 && (
        <div className="overflow-hidden rounded-md border border-gray-100 bg-white">
          <div className="border-b border-gray-100 bg-[#f8fafc] px-6 py-4">
            <h3 className="flex items-center gap-2 text-[16px] font-bold text-gray-900">
              <Landmark className="h-5 w-5 text-blue-600" /> University Overview
            </h3>
          </div>
          <div className="overflow-x-auto">
            <div className="divide-y divide-gray-100">
              {overviewList.filter((row: any) => (row.label || row.key || row.field) && (row.value || row.val)).map((row: any, idx: number) => (
                <div
                  key={idx}
                  className="flex flex-col p-4 transition-colors hover:bg-gray-50 sm:flex-row"
                >
                  <div className="w-full text-[14px] font-semibold text-gray-800 sm:w-1/3">
                    {row.label || row.key || row.field}
                  </div>
                  <RichText
                    html={row.value || row.val || ""}
                    variant="sm"
                    className="w-full text-[14px] text-gray-600 sm:w-2/3"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {leadershipList.length > 0 && (
        <div className="overflow-hidden rounded-md border border-gray-100 bg-white">
          <div className="border-b border-gray-100 bg-[#f8fafc] px-6 py-4">
            <h3 className="flex items-center gap-2 text-[16px] font-bold text-gray-900">
              <Users className="h-5 w-5 text-blue-600" /> Leadership & Administration
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px] text-gray-600">
              <thead className="border-b border-gray-100 bg-gray-50/50 text-[13px] uppercase tracking-wider text-gray-800">
                <tr>
                  <th className="px-6 py-4 font-bold">Position</th>
                  <th className="px-6 py-4 font-bold">Role</th>
                  <th className="px-6 py-4 font-bold">Current Holder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leadershipList.map((row: any, idx: number) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {row.position || row.title}
                    </td>
                    <td className="px-6 py-4">{row.role || ""}</td>
                    <td className="px-6 py-4 font-semibold">
                      {row.holder || row.name || row.person}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
