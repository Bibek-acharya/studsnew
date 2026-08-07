"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, Target, Landmark, Users, BadgeCheck } from "lucide-react";
import {
  AboutVideoInteractive,
} from "./index";
import EmptyTabState from "./EmptyTabState";
import RichText from "@/components/RichText";
import { getImageUrl } from "@/services/api";

interface VideoEntry {
  url: string;
  message: string;
  name: string;
  designation: string;
  avatar: string;
}

interface NewsItem {
  id: number;
  slug: string;
  title: string;
  time: string;
  desc?: string;
}

interface TabAboutProps {
  description: string;
  instVideos: any;
  instVision: string | null;
  instMission: string | null;
  instOverviewData: any[] | null;
  instLeadershipData: any[] | null;
  latestNews?: NewsItem[];
  collegeName?: string;
}

const TabAbout: React.FC<TabAboutProps> = ({
  description,
  instVideos,
  instVision,
  instMission,
  instOverviewData,
  instLeadershipData,
  latestNews = [],
  collegeName = "",
}) => {
  const [showAllNews, setShowAllNews] = useState(false);

  const hasData =
    description ||
    (Array.isArray(instVideos) && instVideos.length > 0) ||
    instVision ||
    instMission ||
    (instOverviewData &&
      Array.isArray(instOverviewData) &&
      instOverviewData.length > 0) ||
    (instLeadershipData &&
      Array.isArray(instLeadershipData) &&
      instLeadershipData.length > 0) ||
    latestNews.length > 0;

  if (!hasData) return <EmptyTabState tabName="about" />;

  return (
    <div className="space-y-10">
      <AboutVideoInteractive videos={instVideos || undefined} />

      {/* Latest News & Stories */}
      {latestNews.length > 0 && (
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
                  <span>Updated at: {latestNews[0]?.time || new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 py-3 bg-blue-50 border-b border-gray-100">
            <h3 className="text-[16px] font-bold text-gray-900">
              {collegeName} Latest News & Stories
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {(showAllNews ? latestNews : latestNews.slice(0, 10)).map((item) => (
              <div key={item.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <span className="text-[13px] font-bold text-blue-600 whitespace-nowrap mt-0.5">{item.time || "-"}</span>
                  <div className="flex-1">
                    <p className="text-[14px] text-gray-700 leading-relaxed font-medium">{item.title}</p>
                    {item.desc && (
                      <p className="text-[13px] text-gray-500 mt-1 line-clamp-2">{item.desc}</p>
                    )}
                    <Link
                      href={`/news/${item.slug}`}
                      className="inline-block mt-2 text-[13px] font-semibold text-blue-600 underline hover:text-blue-800 transition-colors"
                    >
                      View Detail
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {latestNews.length > 10 && !showAllNews && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setShowAllNews(true)}
                className="w-full text-center text-[14px] font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                View More ({latestNews.length - 10} more)
              </button>
            </div>
          )}
        </div>
      )}

      {description && (
        <RichText
          html={description}
          className="max-w-none text-[15px] leading-[1.8] md:text-[16px] overflow-x-auto [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap [&_img]:max-w-full [&_table]:block [&_table]:overflow-x-auto"
        />
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {instVision && (
          <div className="rounded-md border border-gray-100 bg-[#f4f7fb] p-8">
            <div className="mb-4 flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100/80 text-blue-600">
                <Eye className="h-5 w-5" />
              </div>
              <h3 className="text-[16px] font-bold text-gray-900">Our Vision</h3>
            </div>
            <RichText
              html={instVision}
              variant="sm"
              className="text-[14.5px] leading-[1.7] text-gray-600"
            />
          </div>
        )}
        {instMission && (
          <div className="rounded-md border border-gray-100 bg-[#f0fdf4] p-8">
            <div className="mb-4 flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100/80 text-green-600">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="text-[16px] font-bold text-gray-900">Our Mission</h3>
            </div>
            <RichText
              html={instMission}
              variant="sm"
              className="text-[14.5px] leading-[1.7] text-gray-600"
            />
          </div>
        )}
      </div>

      {instOverviewData &&
        Array.isArray(instOverviewData) &&
        instOverviewData.length > 0 && (
          <div className="overflow-hidden rounded-md border border-gray-100 bg-white">
            <div className="border-b border-gray-100 bg-[#f8fafc] px-6 py-4">
              <h3 className="flex items-center gap-2 text-[16px] font-bold text-gray-900">
                <Landmark className="h-5 w-5 text-blue-600" /> Institution Overview
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {instOverviewData.map((row: any, i: number) => (
                <div
                  key={i}
                  className="flex flex-col p-4 transition-colors hover:bg-gray-50 sm:flex-row"
                >
                  <div className="w-full text-[14px] font-semibold text-gray-800 sm:w-1/3">
                    {row.key || row.label || ""}
                  </div>
                  <RichText
                    html={row.value || ""}
                    variant="sm"
                    className="w-full text-[14px] text-gray-600 sm:w-2/3"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

      {instLeadershipData &&
        Array.isArray(instLeadershipData) &&
        instLeadershipData.length > 0 && (
          <div className="overflow-hidden rounded-md border border-gray-100 bg-white">
            <div className="border-b border-gray-100 bg-[#f8fafc] px-6 py-4">
              <h3 className="flex items-center gap-2 text-[16px] font-bold text-gray-900">
                <Users className="h-5 w-5 text-blue-600" /> Leadership &amp; Administration
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
                  {instLeadershipData.map((row: any, i: number) => (
                    <tr key={i}>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {row.position || ""}
                      </td>
                      <td className="px-6 py-4">{row.role || ""}</td>
                      <td className="px-6 py-4 font-semibold">
                        {row.holder || ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      {(() => {
        const video: VideoEntry | undefined = Array.isArray(instVideos) && instVideos.length > 0
          ? instVideos.find((v: VideoEntry) => v.message || v.name)
          : undefined;
        if (!video || (!video.message && !video.name)) return null;
        return (
          <div className="overflow-hidden rounded-md bg-[#f4f7fb] p-6 sm:p-8">
            <div className="flex items-start gap-5">
              {video.avatar ? (
                <img
                  src={getImageUrl(video.avatar)}
                  alt={video.name || "Speaker"}
                  className="h-24 w-24 shrink-0 rounded-md border border-gray-200 object-cover"
                />
              ) : (
                <div className="h-24 w-24 shrink-0 rounded-md border border-gray-200 bg-gray-200 flex items-center justify-center">
                  <i className="fa-solid fa-user text-gray-400 text-3xl"></i>
                </div>
              )}
              <div className="min-w-0 flex-1">
                <RichText
                  html={video.message}
                  variant="sm"
                  className="text-[14px] leading-relaxed text-gray-700"
                />
                <div className="mt-3">
                  {video.name && (
                    <h4 className="text-[15px] font-bold text-gray-900">
                      {video.name}
                    </h4>
                  )}
                  {video.designation && (
                    <p className="text-[13px] text-gray-500">
                      {video.designation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default TabAbout;
