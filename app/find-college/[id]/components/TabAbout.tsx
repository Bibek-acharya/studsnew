"use client";

import React from "react";
import {
  AboutVideoInteractive,
  InfoBlock,
  OverviewRow,
  AdminRow,
} from "./index";
import EmptyTabState from "./EmptyTabState";

interface TabAboutProps {
  description: string;
  instVideos: any;
  instVision: string | null;
  instMission: string | null;
  instOverviewData: any[] | null;
  instLeadershipData: any[] | null;
}

const TabAbout: React.FC<TabAboutProps> = ({
  description,
  instVideos,
  instVision,
  instMission,
  instOverviewData,
  instLeadershipData,
}) => {
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
      instLeadershipData.length > 0);

  if (!hasData) return <EmptyTabState tabName="about" />;

  return (
    <div className="space-y-10">
      <AboutVideoInteractive videos={instVideos || undefined} />

      {description && (
        <div className="prose prose-gray max-w-none text-[15px] leading-[1.8] md:text-[16px] break-normal [overflow-wrap:normal] [word-break:normal] [hyphens:none] overflow-x-auto [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap [&_img]:max-w-full [&_table]:block [&_table]:overflow-x-auto">
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {instVision && (
          <InfoBlock
            title="Our Vision"
            desc={instVision}
            icon="fa-solid fa-eye"
            color="blue"
          />
        )}
        {instMission && (
          <InfoBlock
            title="Our Mission"
            desc={instMission}
            icon="fa-solid fa-bullseye"
            color="green"
          />
        )}
      </div>

      {instOverviewData &&
        Array.isArray(instOverviewData) &&
        instOverviewData.length > 0 && (
          <div className="space-y-6 rounded-md">
            <h2 className="text-[22px] font-bold text-gray-900">
              University Overview
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full rounded-md border border-gray-200 text-left text-sm">
                <tbody className="divide-y divide-gray-200 text-gray-600">
                  {instOverviewData.map((row: any, i: number) => (
                    <OverviewRow
                      key={i}
                      label={row.key || row.label || ""}
                      value={row.value || ""}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      {instLeadershipData &&
        Array.isArray(instLeadershipData) &&
        instLeadershipData.length > 0 && (
          <div className="space-y-6 rounded-md">
            <h2 className="text-[22px] font-bold text-gray-900">
              Leadership &amp; Administration
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full rounded-md border border-gray-200 text-left text-sm">
                <thead className="bg-gray-50 text-[13px] font-bold uppercase text-gray-700">
                  <tr>
                    <th className="px-4 py-3">Position</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Current Holder</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-600">
                  {instLeadershipData.map((row: any, i: number) => (
                    <AdminRow
                      key={i}
                      position={row.position || ""}
                      role={row.role || ""}
                      holder={row.holder || ""}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
  );
};

export default TabAbout;
